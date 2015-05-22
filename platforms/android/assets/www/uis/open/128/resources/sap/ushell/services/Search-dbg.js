// Copyright (c) 2013 SAP AG, All Rights Reserved
/**
 * @fileOverview The Unified Shell's search service which provides Enterprise Search via SINA.
 *
 * @version 1.24.5
 */
(function() {
    "use strict";
    /*global jQuery, sap */
    jQuery.sap.declare("sap.ushell.services.Search");

    sap.ushell.services.Search = function(oAdapter, oContainerInterface) {
        this.init.apply(this, arguments);
    };

    sap.ushell.services.Search.prototype = {

        init: function(oAdapter, oContainerInterface) {
            // do nothing, just ensure for abap adapter to init SINA (async GetServerInfo)
            // this.aCatalogTileDescriptions;
            // this.oCatalogDeferred;
            this.oAdapter = oAdapter;
            this.oContainerInterface = oContainerInterface;
            this.oLpdService = sap.ushell.Container.getService("LaunchPage");
        },

        isSearchAvailable: function() {
            return this.oAdapter.isSearchAvailable();
        },

        getSina: function() {
            return this.oAdapter.getSina();
        },

        /**
         * A helper function returning all tiles contained in all available catalogs.
         * Further, once the tiles have been successfully fetched, they are cached locally in order to speed up
         * future calls. This is based on the assumption that catalog tiles will change very infrequently.
         * In case of success the promise's <code>done</code> function should be called with the results.
         *
         * @returns {object}
         *  jQuery.promise object
         * @private
         */
        _getCatalogTiles: function() {
            var self = this;
            if (self.allTilesDeferred) {
                return self.allTilesDeferred;
            }

            // initialize catalog tiles
            var aCatalogTileDescriptions = [];
            // this.oCatalogDeferred = oDeferred;
            self.allTilesDeferred = self.oLpdService.getCatalogs().then(function(catalogs) {
                var oDeferreds = [];
                // get promises for all catalogs' tiles
                for (var i = 0; i < catalogs.length; i++) {
                    oDeferreds.push(self.oLpdService.getCatalogTiles(catalogs[i]));
                }
                // when all promises have been resolved, merge their results together
                return jQuery.when.apply(jQuery, oDeferreds).then(function() {
                    var aTilesCollection = arguments;
                    for (var i = 0; i < aTilesCollection.length; i++) {
                        var aTiles = aTilesCollection[i];
                        for (var j = 0; j < aTiles.length; j++) {
                            try {
                                var oTile = aTiles[j],
                                    //need to instanciate a view to make use of the contracts
                                    oTileView = self.oLpdService.getCatalogTileView(oTile),
                                    aKeywords = self.oLpdService.getCatalogTileKeywords(oTile),
                                    sTargetURL = self.oLpdService.getCatalogTileTargetURL(oTile),
                                    sTitle = self.oLpdService.getCatalogTilePreviewTitle(oTile) || self.oLpdService.getCatalogTileTitle(oTile),
                                    sSize = self.oLpdService.getCatalogTileSize(oTile),
                                    sIcon = self.oLpdService.getCatalogTilePreviewIcon(oTile) || "sap-icon://business-objects-experience";

                                aCatalogTileDescriptions.push({
                                    tile: oTile,
                                    keywords: aKeywords,
                                    url: sTargetURL,
                                    title: sTitle,
                                    icon: sIcon,
                                    size: sSize
                                });
                                //destroy the view - not needed
                                oTileView.destroy();
                            } catch (e) {
                                jQuery.sap.log.error(e);
                            }
                        }
                    }
                    aCatalogTileDescriptions = self._removeDuplicateTiles(aCatalogTileDescriptions);
                    // resolve the promise
                    return aCatalogTileDescriptions;
                });
            });
            return self.allTilesDeferred;

        },

        /**
         * Filter duplicate tiles on their urls, remove tiles without urls and remove fact sheets.
         * @returns {array}
         *  unique tiles
         *
         * @private
         */
        _removeDuplicateTiles: function(aTiles) {
            var oItemsDict = {},
                aUniqueTiles = [];
            for (var i = 0; i < aTiles.length; ++i) {
                var oTile = aTiles[i];
                if (!oTile.url) {
                    continue;
                }
                var factSheetTest = new RegExp('DisplayFactSheet', 'i');
                if (factSheetTest.test(oTile.url)) {
                    continue;
                }
                if (oItemsDict[oTile.url] === undefined) {
                    oItemsDict[oTile.url] = oTile;
                    aUniqueTiles.push(oTile);
                }
            }
            return aUniqueTiles;
        },

        /**
		 * Search for tiles in all backend catalogs.
		 * @param {object}
		 *	properties configuration object which knows the attributes:
		 *   searchTerm: search for this term in apps/tiles
		 *   top: return that many apps/tiles, default is 10
		 *   searchInKeywords: also search in app keywords and not only in titles
		 
		 * @returns {array}
		 *  found tiles
		 
		 * @private
		 */
        _searchTiles: function(properties) {
            var sSearchTerm = properties.searchTerm;
            var aCatalogTiles = properties.aCatalogTiles;
            var iTop = properties.top || 10;
            var bSearchInKeywords = properties.searchInKeywords || false;
            var aFoundTiles = [],
                oTile,
                sLabel;
            // replace special chars
            sSearchTerm = sSearchTerm.replace(/([.+?^=!:${}()|\[\]\/\\])/g, "\\$1");
            sSearchTerm = sSearchTerm.replace(/\*/g, ".*");
            // only match beginnings of the word, case insensitive
            sSearchTerm = new RegExp('\\b' + sSearchTerm, 'i');

            var tileFound = function(oTile) {
                if (aFoundTiles.length < iTop) {
                    //TODO: use searchhelpers highlighter
                    sLabel = oTile.title.replace(sSearchTerm, "<b>$&</b>");
                    aFoundTiles.push(oTile);
                }
            };

            for (var j = 0; j < aCatalogTiles.length; j++) {
                oTile = aCatalogTiles[j];
                if (sSearchTerm.test(oTile.title)) {
                    tileFound(oTile);
                    continue;
                }
                if (bSearchInKeywords) {
                    for (var i = 0, len = oTile.keywords.length; i < len; i++) {
                        var keyword = oTile.keywords[i];
                        if (sSearchTerm.test(keyword)) {
                            tileFound(oTile);
                            break;
                        }
                    }
                }
            }
            return aFoundTiles;
        },

        _makeSInAResultSet: function(aFoundTiles, sOrigSearchTerm) {
            return {
                totalResults: aFoundTiles.length,
                searchTerm: sOrigSearchTerm,
                getElements: function() {
                    return aFoundTiles;
                }
            };
        },

        /**
         * Search for Apps (Tiles) in all backend catalogs.
         *
         * @param  {object}
         *  properties configuration object which knows the attributes:
         *   searchTerm: search for this term in apps/tiles
         *   top: return that many apps/tiles, default is 10
         *   searchInKeywords: also search in app keywords and not only in titles
         *
         * @returns {object}
         *  jQuery.promise object
         *
         * @public
         */
        queryApplications: function(properties) {
            var self = this,
                sOrigSearchTerm = properties.searchTerm;

            return this._getCatalogTiles().then(function(aCatalogTiles) {
                properties.aCatalogTiles = aCatalogTiles;
                var aFoundTiles = self._searchTiles(properties);
                var oSinaResult = self._makeSInAResultSet(aFoundTiles, sOrigSearchTerm);
                return oSinaResult;
            });

        },

        /**
         * Search all catalog tiles by their Semantic Object - Action pair
         * The given callback is called on success. This does not touch the respective search adapters.
         *
         * @param {array} aSemObjects
         *     an array of semantic object + action objects
         * @param {function} resultCallback
         *     the callback that will be called
         * @public
         */
        queryApplicationsByTarget: function(aSemObjects, resultCallback) {
            this._getCatalogTiles().done(function(aCatalogTileDescriptions) {
                var aResults = [];
                // loop through Semantic Objects, thus result is in same order as input SOs
                for (var j = 0, jL = aSemObjects && aSemObjects.length || 0; j < jL; j++) {
                    var oSemO = aSemObjects[j],
                        oURLParsingSrvc = sap.ushell.Container.getService("URLParsing");
                    for (var i = 0; i < aCatalogTileDescriptions.length; i++) {
                        var oTarget = oURLParsingSrvc.parseShellHash(aCatalogTileDescriptions[i].url);
                        if (oTarget && (oTarget.semanticObject === oSemO.semanticObject) && (oTarget.action === oSemO.action)) {
                            aResults.push(aCatalogTileDescriptions[i]);
                            // only take first match
                            break;
                        }
                    }
                }
                resultCallback(aResults);
            });
        }
    };


}());