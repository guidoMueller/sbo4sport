// Copyright (c) 2013 SAP AG, All Rights Reserved
/**
 * @fileOverview This file contains miscellaneous utility functions.
 */

(function () {
    "use strict";
    /*global dispatchEvent, document, jQuery, localStorage, sap */

    // ensure that sap.ushell exists
    jQuery.sap.declare("sap.ushell.utils");

    sap.ushell.utils = {};
    var visibilityCalcTimer;

    /**
     * Creates an <code>Error</code> object and logs the error message immediately.
     *
     * @param {string} sMessage
     *   the error message
     * @param {string} [sComponent]
     *   the error component to log
     *
     * @class An error that is written to the log.
     * @constructor
     * @since 1.15.0
     */
    sap.ushell.utils.Error = function (sMessage, sComponent) {
        this.name = "sap.ushell.utils.Error";
        this.message = sMessage;
        jQuery.sap.log.error(sMessage, null, sComponent);
    };

    sap.ushell.utils.Error.prototype = new Error();

    /**
     * Wrapper for localStorage.setItem() including exception handling
     * caused by exceeding storage quota limits
     * or exception is always thrown (safari private browsing mode)
     *
     * @param {string} sKey
     *   the key for the storage entry
     * @param {string} sValue
     *   the value for the storage entry
     * @param {boolean} [bLocalEvent=false]
     *   when true the storage event is also fired for the source window
     *
     * @since 1.21.2
     * @private
     */
    sap.ushell.utils.localStorageSetItem = function (sKey, sValue, bLocalEvent) {
        var oEvent;
        try {
            localStorage.setItem(sKey, sValue);
            if (bLocalEvent) {
                oEvent = document.createEvent("StorageEvent");
                // Events are fired only if setItem works
                // If we want to decouple this (to have eventing to the same window)
                // we have to provide a wrapper for localStorage.getItem and -removeItem() also
                oEvent.initStorageEvent("storage", false, false,
                        sKey, "", sValue, "", localStorage);
                dispatchEvent(oEvent);
            }
        } catch (e) {
            jQuery.sap.log.warning("Error calling localStorage.setItem(): " + e, null,
                "sap.ushell.utils");
        }
    };

    /**
     * Creates an empty map.
     * @class A mapping from arbitrary string(!) keys (including "get" or "hasOwnProperty") to
     * values of any type.
     * @since 1.15.0
     */
    sap.ushell.utils.Map = function () {
        this.entries = {};
    };

    /**
     * Associates the specified value with the specified key in this map. If the map previously
     * contained a mapping for the key, the old value is replaced by the specified value. Returns
     * the old value. Note: It might be a good idea to assert that the old value is
     * <code>undefined</code> in case you expect your keys to be unique.
     *
     * @param {string} sKey
     *   key with which the specified value is to be associated
     * @param {any} vValue
     *   value to be associated with the specified key
     * @returns {any}
     *   the old value
     * @since 1.15.0
     */
    sap.ushell.utils.Map.prototype.put = function (sKey, vValue) {
        var vOldValue = this.get(sKey);
        this.entries[sKey] = vValue;
        return vOldValue;
    };

    /**
     * Returns <tt>true</tt> if this map contains a mapping for the specified key.
     *
     * @param {string} sKey
     *   key whose presence in this map is to be tested
     * @returns {boolean}
     *   <tt>true</tt> if this map contains a mapping for the specified key
     * @since 1.15.0
     */
    sap.ushell.utils.Map.prototype.containsKey = function (sKey) {
        if (typeof sKey !== "string") {
            throw new sap.ushell.utils.Error("Not a string key: " + sKey, "sap.ushell.utils.Map");
        }
        return Object.prototype.hasOwnProperty.call(this.entries, sKey);
    };

    /**
     * Returns the value to which the specified key is mapped, or <code>undefined</code> if this map
     * contains no mapping for the key.
     * @param {string} sKey
     *   the key whose associated value is to be returned
     * @returns {any}
     *   the value to which the specified key is mapped, or <code>undefined</code> if this map
     *   contains no mapping for the key
     * @since 1.15.0
     */
    sap.ushell.utils.Map.prototype.get = function (sKey) {
        if (this.containsKey(sKey)) {
            return this.entries[sKey];
        }
        //return undefined;
    };

    /**
     * Returns an array of this map's keys. This array is a snapshot of the map; concurrent
     * modifications of the map while iterating do not influence the sequence.
     * @returns {string[]}
     *   this map's keys
     * @since 1.15.0
     */
    sap.ushell.utils.Map.prototype.keys = function () {
        return Object.keys(this.entries);
    };

    /**
     * Removes a key together with its value from the map.
     * @param {string} sKey
     *  the map's key to be removed
     * @since 1.17.1
     */
    sap.ushell.utils.Map.prototype.remove = function (sKey) {
        delete this.entries[sKey];
    };

    /**
     * Returns this map's string representation.
     *
     * @returns {string}
     *   this map's string representation
     * @since 1.15.0
     */
    sap.ushell.utils.Map.prototype.toString = function () {
        var aResult = ['sap.ushell.utils.Map('];
        aResult.push(JSON.stringify(this.entries));
        aResult.push(')');
        return aResult.join('');
    };

    /**
     * Serves as a marker for functions that are to be exposed in QUnit tests. Calls to this
     * function are expected to be placed directly before the named function declaration (even
     * <b>after</b> the JSDoc). The function itself does nothing.
     *
     * @param {object} o
     *   the object to which this function will be attached in tests; must not be <code>this</code>
     *   (use <code>that</code> instead)
     * @param {string} [sExternalFunctionName]
     *   Optional external function name (since 1.25.0) to be used instead of the "local" function
     *   name which may have been changed e.g. by a minifier. Use this parameter in case of
     *   integration tests (and only then) which MUST be able to run against minified productive
     *   code!<p>
     *   <b>BEWARE:</b> Integration tests should rely on
     *   <code>sap.ushell.utils.testPublishAt</code> only in exceptional cases!
     * @since 1.15.0
     */
    sap.ushell.utils.testPublishAt = function (o, sExternalFunctionName) {
      // intentionally left blank
    };

    /**
     * Setting Tiles visibility using the Visibility contract, according to the view-port's position.
     *
     * Serves only the last caller, with a delay of 1 sec in order to make sure that rendering is complete
     */
    sap.ushell.utils.handleTilesVisibility = function () {

        // If a previous call is still waiting  - cancel it
        clearTimeout(visibilityCalcTimer);

        // Set the new timer
        visibilityCalcTimer = setTimeout(function () {
            var start = new Date(),
            // Get the visible and non-visible Tiles
            aTiles = sap.ushell.utils.getVisibleTiles();

            if ((typeof aTiles != "undefined") && aTiles.length > 0){
                var launchPageService = sap.ushell.Container.getService("LaunchPage");

                aTiles.forEach(function (oTile) {
                    launchPageService.setTileVisible(sap.ushell.utils.getTileObject(oTile), oTile.isDisplayedInViewPort);
                });
                jQuery.sap.log.debug("Visible Tiles: " + aTiles.filter(function (oTile) {return oTile.isDisplayedInViewPort; }).length);
                jQuery.sap.log.debug("NonVisible Tiles: " + aTiles.filter(function (oTile) {return !oTile.isDisplayedInViewPort; }).length);
            }

            var duration = new Date() - start;
            jQuery.sap.log.debug("Start time is: " + start + " and duration is: " + duration);
        }, 1000);
    };

    /**
     * Setting Tiles visibility using the Visibility contract as not visible.
     *
     * The affected tiles are only the visible tiles according to the view port's position.
     *
     * This action happens immediately with no timers or timeouts.
     */
    sap.ushell.utils.setTilesNoVisibility = function () {
        // this method currently is used upon navigation (i.e. Shell.controlelr - openApp)
        // as there is logic that is running in the background such as OData count calls of the dynamic tiles
        // which are still visible at navigation (as no one had marked it otherwise).
        var aTiles = sap.ushell.utils.getVisibleTiles();
        if ((typeof aTiles !== "undefined") && aTiles.length > 0) {
            var launchPageService = sap.ushell.Container.getService("LaunchPage");

            aTiles.forEach(function (oTile) {
                launchPageService.setTileVisible(sap.ushell.utils.getTileObject(oTile), false);
            });
            jQuery.sap.log.debug("Visible Tiles: " + aTiles.filter(function (oTile) {return oTile.isDisplayedInViewPort; }).length);
            jQuery.sap.log.debug("NonVisible Tiles: " + aTiles.filter(function (oTile) {return !oTile.isDisplayedInViewPort; }).length);
        }
    };

    /**
     * Gets a hash and returns only the semanticObject-action part of it
     */
    sap.ushell.utils.getBasicHash = function (hash) {
        // Check hash validity
        if (!sap.ushell.utils.validHash(hash)) {
            jQuery.sap.log.debug("Utils ; getBasicHash ; Got invalid hash");
            return;
        }

        var oURLParsing = sap.ushell.Container.getService("URLParsing"),
            oShellHash = oURLParsing.parseShellHash(hash);

        return oShellHash ?  oShellHash.semanticObject + "-" + oShellHash.action : hash;
    };

    sap.ushell.utils.validHash = function (hash) {
        return (hash && hash.constructor === String && $.trim(hash) != "");
    };

    sap.ushell.utils.handleTilesOpacity = function () {
        jQuery.sap.require("sap.ui.core.theming.Parameters");

        var that = this,
            aTilesOpacityValues,
            currentTile,
            appUsagePromise,
            appUsage,
            sColor = sap.ui.core.theming.Parameters.get("sapUshellTileBackgroundColor"),
            rgbColor = this.hexToRgb(sColor),
            jqTiles,
            calculatedOpacity,
            RGBAformat,
            jqTile,
            sCurrentHash,
            rgbaValue,
            oContext,
            pathSegments,
            groupind,
            tileInd,
            oCore = sap.ui.getCore(),
            oModel = oCore.byId("shell").getModel(),
            oUserRecentsService = sap.ushell.Container.getService("UserRecents");
        //In case of custom theme where UI5 parameters are not used - tiles opacity cannot be supported
        if (rgbColor) {
            RGBAformat = "rgba(" + rgbColor.r + "," + rgbColor.g + "," + rgbColor.b + ",{0})";
            appUsagePromise = oUserRecentsService.getAppsUsage();

            appUsagePromise.done(function(appUsage) {
                aTilesOpacityValues = appUsage.usageMap;
                jqTiles = jQuery('.sapUshellTile');
                var groups = oModel.getProperty("/groups");
                oModel.setProperty('/animationRendered', true);

                for (var index = 0; index < jqTiles.length; index++) {
                    jqTile = jQuery(jqTiles[index]);
                    sCurrentHash = this.getBasicHash(jqTile.find('.sapUshellTileBase').attr('data-targeturl'));
                    if (sCurrentHash) {
                        calculatedOpacity = this.convertToRealOpacity(aTilesOpacityValues[sCurrentHash], appUsage.maxUsage);
                        rgbaValue = RGBAformat.replace("{0}", calculatedOpacity);
                        currentTile = sap.ui.getCore().byId(jqTile.attr('id'));
                        oContext = currentTile.getBindingContext();
                        pathSegments = oContext.sPath.split('/');
                        groupind = pathSegments[2];
                        tileInd = pathSegments[4];
                        groups[groupind].tiles[tileInd].rgba = rgbaValue;
//                        oModel.setProperty( oContext.sPath + "/rgba", rgbaValue);
//                        currentTile.setAnimationRendered(true);
                    }
                }

                oModel.setProperty("/groups", groups);
            }.bind(this));
        }

    };

    sap.ushell.utils.convertToRealOpacity = function(amountOfUsage, max) {
    	var aOpacityLevels = [1, 0.95, 0.9, 0.85, 0.8],
    	    iOpacityVariance = Math.floor(max/aOpacityLevels.length),
    	    iOpacityLevelIndex;

    	if (!amountOfUsage) {
    		return aOpacityLevels[0];
    	}
    	else if (!max){
    		return aOpacityLevels[aOpacityLevels.length - 1];
    	}
    	else{
    		iOpacityLevelIndex = Math.floor((max - amountOfUsage)/iOpacityVariance);
    		return iOpacityLevelIndex < aOpacityLevels.length ? aOpacityLevels[iOpacityLevelIndex] : aOpacityLevels[aOpacityLevels.length - 1];
    	}
    };

    sap.ushell.utils.hexToRgb = function(hex) {
        var bIsHexIllegal = !hex || hex[0] != '#' || (hex.length  != 4 && hex.length != 7),
        	result;

        //If hex consists of three-character RGB notation, convert it into six-digit form
        hex = !bIsHexIllegal && hex.length === 4 ? '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3] : hex;
        result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    };

    /**
     * Iterate over all the Tiles and mark each one as visible or non-visible according to the view-port's position
     *
     *  @returns Array of Tile objects, each one includes the flag "isDisplayedInViewPort" indicating its visibility
     */
    sap.ushell.utils.getVisibleTiles = function () {

        var nWindowHeight = document.body.clientHeight,
            oControl = sap.ui.getCore().byId("dashboardGroups"),
            oNavContainer = sap.ui.getCore().byId("navContainer"),
            groupsIndex,
            tilesIndex,
            group,
            groupTiles,
            oTile,
            tileDomRef,
            tileOffset,
            tileTop,
            tileBottom,
            shellHdrHeight = jQuery('#shell-hdr').height(),
            aTiles = [];



        if (oControl && oControl.getGroups() && oNavContainer) {
            //verify we are in the dashboard page
            var sCurrentState = oNavContainer.getModel().getProperty("/currentState/stateName"),
            	bIsInDashBoard = sCurrentState === "home",
                aGroups = oControl.getGroups();

            // Loop over all Groups
            //jQuery.each(aGroups, function(groupIndex) {
            for (groupsIndex = 0; groupsIndex < aGroups.length; groupsIndex = groupsIndex + 1) {
                group = aGroups[groupsIndex];
                groupTiles = group.getTiles();
                if (groupTiles) {
                    // Loop over all Tiles in the current Group
                    for (tilesIndex = 0; tilesIndex < groupTiles.length; tilesIndex = tilesIndex + 1) {

                        oTile = groupTiles[tilesIndex];

                        if (!bIsInDashBoard) {
                            // if current state is not dashboard ("Home") set not visible
                            oTile.isDisplayedInViewPort = false;
                        }
                        else {
                            tileDomRef = jQuery(oTile.getDomRef());
                            tileOffset = tileDomRef.offset();

                            // On Dashboard loading - the Dashboard Groups Container is rendered once in an empty state on initialization
                            // and then again when all data is loaded and the Groups need to be rendered.
                            // This condition is for exiting the function when it is called for the 1st time
                            if (!tileOffset) {
                                return;
                            }

                            tileTop = tileDomRef.offset().top;
                            tileBottom = tileTop + tileDomRef.height();

                            // If the Tile is located above or below the view-port
                            oTile.isDisplayedInViewPort = (tileBottom > shellHdrHeight) && (tileTop < nWindowHeight);
                        }
                        aTiles.push(oTile);
                    } // End of Tiles loop
                }
            } // End of Groups loop

        }
        return aTiles;
    };

    sap.ushell.utils.getTileObject = function (ui5TileObject) {
        var bindingContext = ui5TileObject.getBindingContext();
        return bindingContext.getObject().object;
    };

    sap.ushell.utils.addBottomSpace = function () {
    	var jqContainer = jQuery('#dashboardGroups').find('.sapUshellTileContainer'),
	        oOffset = jQuery('#dashboardPage').offset(),
	        edgeMargin = oOffset && oOffset.top;

	    var nBottomSpace = jQuery(window).height() - edgeMargin - jqContainer.last().parent().height();
	    nBottomSpace = (nBottomSpace < 0) ? 0 : nBottomSpace;

	    // Add margin to the bottom of the screen in order to allow the lower TileContainer (in case it is chosen)
	    //to be shown on the top of the view-port
	    jQuery('.sapUshellDashboardGroupsContainer').css("margin-bottom", nBottomSpace + "px");
    };

    sap.ushell.utils.groupHasVisibleTiles = function (groupTiles) {
        var visibleTilesInGroup = false,
            tileIndex,
            tempTile;

        if (!groupTiles || (groupTiles && groupTiles.length === 0)) {
        	return false;
        }

        for (tileIndex = 0; tileIndex < groupTiles.length; tileIndex = tileIndex + 1) {
            tempTile = groupTiles[tileIndex];
            // Check if the Tile is visible on the relevant device
            if (tempTile.isTileIntentSupported) {
                visibleTilesInGroup = true;
                break;
            }
        }
        return visibleTilesInGroup;
    }
}());
