//Copyright (c) 2013 SAP AG, All Rights Reserved

(function () {
    "use strict";
    /*global jQuery, sap */
    /*jslint nomen: true */

    jQuery.sap.require("sap.ui.core.IconPool");
    jQuery.sap.require("sap.ushell.ui.launchpad.Tile");
    jQuery.sap.require("sap.ushell.ui.launchpad.TileContainer");
    jQuery.sap.require("sap.ushell.ui.launchpad.Panel");
    jQuery.sap.require("sap.ushell.ui.launchpad.CatalogListItem");

    sap.ui.jsview("sap.ushell.renderers.fiori2.launchpad.catalog.Catalog", {

        createContent: function (oController) {
            var translationBundle = sap.ushell.resources.i18n,
            	that = this,
            	aVisibleGroupsMap = undefined;

            function ifnot(v) {
                return !v;
            }
            function iflong(sLong) {
                return ((sLong !== null) && (sLong === "1x2" || sLong === "2x2")) || false;
            }
            function iftall(size) {
                return ((size !== null) && (size === "2x2" || size === "2x1")) || false;
            }
            function falseIfPhone(v) {
                if (sap.ui.Device.system.phone) {
                    return false;
                }

                return ifnot(v);
            }
            function to_int(v) {
                return parseInt(v, 10) || 0;
            }
            function get_icon(aGroupsIDs) {
            	var iconName = (aGroupsIDs && aGroupsIDs.length > 0) ? "accept" : "add";
            	return sap.ui.core.IconPool.getIconURI(iconName);
            }
            function formatTiles(v) {
                return (v && v > 0) ?
                        v + ((v > 1 && (" " + translationBundle.getText("tiles"))) || (" " + translationBundle.getText("tile"))) :
                        translationBundle.getText("no_tiles");
            }

            var oButton = new sap.m.Button({
                icon : {
                    path : "associatedGroups",
                    formatter : get_icon
                },
                tooltip: {
                    parts: ["i18n>addTileToGroup", "i18n>addAssociatedTileToGroup", "associatedGroups"],
                    formatter : function (sAddTileGroups, sAddTileToMoreGroups, aGroupsIDs) {
                        return aGroupsIDs && aGroupsIDs.length ? sAddTileToMoreGroups : sAddTileGroups;
                    }
                },
                press : [ oController.onTileFooterClick, oController ]
            }), oTileTemplate = new sap.ushell.ui.launchpad.Tile({
                afterRendering : [ oController.onTileAfterRendering, oController ],
                tileViews : {
                    path : "content",
                    factory : function (sId, oContext) { return oContext.getObject(); }
                },
                footItems : [oButton],
                "long" : {
                    path : "size",
                    formatter : iflong
                },
                "tall" : {
                    path : "size",
                    formatter : iftall
                },
                index: {
                    path : "id",
                    formatter : to_int
                }
            }), tilesContainer = new sap.ushell.ui.launchpad.TileContainer("catalogTiles", {
                showHeader : false,
                showPlaceholder : false,
                showGroupHeader : "{/showCatalogHeaders}",
                groupHeaderLevel : sap.m.HeaderLevel.H3,
                showNoData : true,
                tiles : {
                    path : "/catalogTiles",
                    template : oTileTemplate,
                    sorter : new sap.ui.model.Sorter("catalogIndex", false, function (oContext) {
                        return (oContext && oContext.getProperty("catalog")) || "";
                    })
                },
                afterRendering : function (oEvent) {
                    var jqThis = jQuery(oEvent.getSource());
                    //because the catalog can be loaded with a filter in the URL we also have to
                    //check if tiles exist in the model, and not just in the UI control
                    if (this.getTiles().length || this.getModel().getProperty('/catalogTiles/length')) {
                        //Enable tiles search/filter only after tiles are rendered.
                        //Timeout needed because of some bug in UI5 that doesn't enable control on this point.
                    	setTimeout(function () {
                            sap.ui.getCore().byId("catalogSearch").setEnabled(true);
                        });
                        sap.ui.getCore().getEventBus().publish("launchpad", "contentRendered");
                        if (!sap.ui.Device.os.ios) {
                            sap.ui.getCore().getEventBus().publish("launchpad", "contentRefresh");
                        }
                    }
                    jQuery.sap.byId("catalogTilesPage").find("label").parent().attr("tabindex", "0");
                    jQuery.sap.byId("catalogTiles").removeAttr("tabindex", 0);
                }
            });

            //hidden Catalog item to support TabIndex
            var hiddenCatalogTabFocusHelper = new sap.m.Button('hiddenCatalogTabFocusHelper');
            hiddenCatalogTabFocusHelper.addEventDelegate({
                onfocusin: function () {
                    try {
                        var shellData = sap.ui.getCore().byId('homeBtn').focus();
                    } catch (e) {
                    }
                }
            });
            
            oButton.constructor.prototype.setIcon = function (v) {
                this.setProperty("icon", v, true);          // set property, but suppress rerendering
                if (v && this._image && this._image.setSrc) {
                    this._image.setSrc(v);                  // set property of internal control
                }
                return this;
            };
            var oFilterVisibleTiles = new sap.ui.model.Filter("numIntentSupportedTiles", sap.ui.model.FilterOperator.NE, 0);
            var oCatalogSelect = new sap.m.Select("catalogSelect", {
                name : "Browse",
                tooltip: "{i18n>catalogSelect_tooltip}",
                items : {
                    path : "/catalogs",
                    template : new sap.ui.core.ListItem({
                        text : "{title}"
                    }),
                    filters: [oFilterVisibleTiles]
                },
                change : [ oController.onCategoryFilter, oController ]
            });

            /*
             override original onAfterRendering as currently sap.m.Select
             does not support afterRendering handler in the constructor
             this is done to support tab order accessibility
             */
            var origCatalogSelectOnAfterRendering = oCatalogSelect.onAfterRendering;
            oCatalogSelect.onAfterRendering = function () {
                origCatalogSelectOnAfterRendering.apply(this, arguments);
                jQuery.sap.byId("catalogSelect").attr("tabindex", 0);
            };

            /*
             * setting followOf to false, so the popover won't close on IE.
             */
            var origOnAfterRenderingPopover = oCatalogSelect._onAfterRenderingPopover;
            oCatalogSelect._onAfterRenderingPopover = function() {
                if (this._oPopover) {
                    this._oPopover.setFollowOf(false);
                }
                if (origOnAfterRenderingPopover) {
                    origOnAfterRenderingPopover.apply(this, arguments);
                }
            };

            var oCatalogSearch = new sap.m.SearchField("catalogSearch", {
        	tooltip: "{i18n>catalogSearch_tooltip}",
                enabled: false, //we Disable search/filtering of tiles till they will be rendered, to avoid bugs.
                value: {path: "/catalogSearchFilter"},
                placeholder: "{i18n>search_catalog}",
                liveChange : [ oController.onLiveFilter, oController ]
            });

            /*
             override original onAfterRendering as currently sap.m.Select
             does not support afterRendering handler in the constructor,
             this is done to support tab order accessibility
             */
            var origCatalogSearchOnAfterRendering = oCatalogSearch.onAfterRendering;
            oCatalogSearch.onAfterRendering = function () {
                origCatalogSearchOnAfterRendering.apply(this, arguments);
                jQuery.sap.byId("catalogSearch").find("input").attr("tabindex", 0);
            };

            var oDetailPage = new sap.m.Page("catalogTilesPage", {
                showHeader : true,
                showFooter : false,
                showNavButton : true,
                title : "{i18n>tile_catalog}",
                content : [ new sap.ushell.ui.launchpad.Panel({
                    translucent : true,
                    headerText : "",
                    headerLevel : sap.m.HeaderLevel.H2,
                    headerBar : new sap.m.Bar("catalogHeader", {
                        translucent : true,
                        tooltip: "{i18n>tile_catalog_header_tooltip}",
                        contentLeft : [ oCatalogSelect ],
                        contentRight : [ oCatalogSearch ]
                    }).addStyleClass("sapUshellCatalogMain"),
                    content : [ tilesContainer, hiddenCatalogTabFocusHelper]
                })],
                navButtonPress : [oController.onNavButtonPress, oController]
            }).addStyleClass("sapUshellCatalog");
            return oDetailPage;
        },

        getControllerName: function () {
            return "sap.ushell.renderers.fiori2.launchpad.catalog.Catalog";
        }
    });
}());
