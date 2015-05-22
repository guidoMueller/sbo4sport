//Copyright (c) 2013 SAP AG, All Rights Reserved

(function () {
    "use strict";
    /*global jQuery, sap, $, document, self */
    /*jslint plusplus: true, nomen: true, vars: true */

    jQuery.sap.require("sap.ushell.ui.launchpad.TileContainer");
    jQuery.sap.require("sap.ushell.ui.launchpad.Tile");
    jQuery.sap.require("sap.ushell.override");
    jQuery.sap.require("sap.ushell.resources");

    var _mouseStop = $.ui.sortable.prototype._mouseStop;

    $.ui.sortable.prototype._mouseStop = function (event, noPropagation) {
        if (!event) {
            return;
        }

        if (this.options.revert) {
            var that = this,
                args = arguments,
                cur = that.placeholder.offset(),
                // the dur[ation] will not determine how long the revert animation is
                dur = $.isFunction(this.options.revert) ? this.options.revert.apply(this.element[0], [event, that._uiHash(this)]) : this.options.revert,
                rtl = sap.ui.getCore().getConfiguration().getRTL(),
                jqHelper = jQuery(this.helper),
                getTransitionPosition = function (oHelper) {
                	if (rtl) {
                		return 0
                	}else{
                		return (jQuery(document).width() - oHelper.width() - 10)
                	}
                };

            self.reverting = true;

            if (jQuery(".sapUshellDeleteArea_dashboard_functional").data("tileOver") === true) {
                //Animation to dashboard delete area

                //On IE and Safari use jQuery's animate(), otherwise use css transition (hardware accelerated)
                //See http://stackoverflow.com/questions/5899783/detect-safari-using-jquery
                var bIsIE       = $.browser.msie,
                    bIsIE10     = (bIsIE && (parseInt($.browser.version, 10) === 10)) ? true : false,
                    bIsSafari   = (!(navigator.userAgent.indexOf('Chrome') > -1)) && (navigator.userAgent.indexOf("Safari") > -1);

                if (!bIsIE10 && (bIsIE || bIsSafari)) {
                    $(this.helper).animate({
                        top: (jQuery(document).height() - this.helper.height() - 10) + "px",
                        //Transition direction is different for rtl and ltr modes
                        left: getTransitionPosition(this.helper),
                        opacity: 0
                    }, !isNaN(dur) ? dur : 250, function () {
                        setTimeout(function () {
                            var sTileId = jQuery(that.currentItem).attr('id'),
                            oTile = sap.ui.getCore().byId(sTileId);
                            oTile.bDeletionFlag = true;
                            //Save that nothing is "over" the delete area anymore
                            jQuery(".sapUshellDeleteArea_dashboard_functional").data("tileOver", false);
                            _mouseStop.apply(that, args);
                        }, dur);
                    });
                } else {
                    jQuery(this.helper).css({
                        top                 : (jQuery(document).height() - this.helper.height() - 10),
                        //Transition direction is different for rtl and ltr modes
                        left                : getTransitionPosition(this.helper),
                        opacity             : 0,
                        WebkitTransition    : 'top ' + dur + 'ms ease-in-out, left ' + dur + 'ms ease-in-out, opacity ' + dur + 'ms ease-in-out, ',
                        MozTransition       : 'top ' + dur + 'ms ease-in-out, left ' + dur + 'ms ease-in-out, opacity ' + dur + 'ms ease-in-out, ',
                        MsTransition        : 'top ' + dur + 'ms ease-in-out, left ' + dur + 'ms ease-in-out, opacity ' + dur + 'ms ease-in-out, ',
                        OTransition         : 'top ' + dur + 'ms ease-in-out, left ' + dur + 'ms ease-in-out, opacity ' + dur + 'ms ease-in-out, ',
                        transition          : 'top ' + dur + 'ms ease-in-out, left ' + dur + 'ms ease-in-out, opacity ' + dur + 'ms ease-in-out'
                    });

                    setTimeout(function () {
                        var sTileId = jQuery(that.currentItem).attr('id'),
                        oTile = sap.ui.getCore().byId(sTileId);
                        oTile.bDeletionFlag = true;
                        //Save that nothing is "over" the delete area anymore
                        jQuery(".sapUshellDeleteArea_dashboard_functional").data("tileOver", false);
                        _mouseStop.apply(that, args);
                    }, dur);
                }
            } else {
                _mouseStop.apply(that, args);
            }
        } else {
            this._clear(event, noPropagation);
        }

        return false;
    };

    sap.ui.jsview("sap.ushell.renderers.fiori2.launchpad.dashboard.DashboardContent", {

        createContent: function (oController) {
            var that = this,
                oEventBus = sap.ui.getCore().getEventBus();

            this.oDashboardGroupsBox = this._getDashboardGroupsBox(oController);
            this.oDashboardDeleteArea =  this._getDashboardDeleteArea(oController);

            this.oDashboardDeleteArea.attachEvent("tileOver", function () {
                jQuery(".sapUshellTile-placeholder").hide();
                jQuery(".sapUshellExcludeMe.sapUshellSortableHelperClone").hide();
                that.oController._handleSortableChange();
            });

            this.oDashboardDeleteArea.attachEvent("tileOut", function () {
                jQuery(".sapUshellTile-placeholder").show();
                jQuery(".sapUshellExcludeMe.sapUshellSortableHelperClone").show();
                that.oController._handleSortableChange();
            });

            //First hidden Dashboard item to support TabIndex
            var firstHiddenDashboardTabFocusHelper = new sap.m.Button('firstHiddenDashboardTabFocusHelper');
            firstHiddenDashboardTabFocusHelper.addEventDelegate({
                onfocusin: function () {
                    try {
                        var shellData = sap.ui.getCore().byId('shell').getModel().getData();
                        if (shellData.currentState.showPane) {
                            var groupListPage = sap.ui.getCore().byId('groupListPage');
                            var footer = groupListPage.getFooter();
                            jQuery(footer.getDomRef()).find("[tabindex=0]").last().focus();
                        }
                        else {
                            sap.ui.getCore().byId('actionsBtn').focus();
                        }
                    } catch (e) {

                    }
                }
            });
            //Second hidden Dashboard item to support TabIndex
            var lastHiddenDashboardTabFocusHelper = new sap.m.Button('lastHiddenDashboardTabFocusHelper');
            lastHiddenDashboardTabFocusHelper.addEventDelegate({
                onfocusin: function () {
                    try {
                        var shellData = sap.ui.getCore().byId('configBtn').focus();
                    } catch (e) {
                    }
                }
            });

            return [firstHiddenDashboardTabFocusHelper, this.oDashboardGroupsBox, this.oDashboardDeleteArea, lastHiddenDashboardTabFocusHelper];

        },

        _getDashboardDeleteArea : function (oController) {
            var oDashboardDeleteArea =  new sap.ushell.ui.launchpad.DeleteArea({
                type: sap.ushell.ui.launchpad.DeleteAreaType.Dashboard,
                message: sap.ushell.resources.i18n.getText("deleteAreaMsgForTile"),
                icon: sap.ui.core.IconPool.getIconURI('delete')
            });

            return oDashboardDeleteArea;
        },

        _getDashboardGroupsBox : function (oController) {
            var that = this;
            var oTilesContainerTemplate = this._getTileContainerTemplate(oController),
                oViewData = this.getViewData(),
                oConfig;
            if (oViewData) {
                oConfig = oViewData.config;
            }

            var fAfterRenderingHandler = function () {
                if (this.getGroups().length) {
                    if ((sap.ui.Device.system.combi || !sap.ui.Device.system.desktop) && this.getModel().getProperty("/personalization")) {
                        this.touchSupport = new sap.ushell.touchSupport({
                            containerSelector: '#dashboardGroups',
                            wrapperSelector: sap.ui.Device.system.combi ? '#dashboardPage-cont' : undefined,
                            draggableSelector: ".sapUshellTile[role='link'],.sapUshellPlusTile",
                            draggableSelectorExclude: ".sapUshellPlusTile",
                            rootSelector : "#dashboardPage",
                            placeHolderClass : "sapUshellTile-placeholder",
                            cloneClass : "sapUshellTile-clone",
                            touchStartCallback : that._handleTouchStart.bind(that),
                            touchEndCallback : oController._handleDrop.bind(oController),
                            touchDragCallback : that._handleTouchDrag.bind(that),
                            dragAndScrollCallback : that._handleDelete.bind(that),
                            moveTolerance : 10,
                            switchModeDelay : 1000,
                            debug: jQuery.sap.debug()
                        }).enable();
                    }

                    sap.ui.getCore().getEventBus().publish("launchpad", "contentRendered");
                    sap.ui.getCore().getEventBus().publish("launchpad", "contentRefresh");
                    
                    var oLoadingDialog = sap.ui.getCore().byId("loadingDialog");
                    oLoadingDialog.closeLoadingScreen();
                    oController._addBottomSpace();

                    //Tile opacity is enabled by default, therefore we handle tile opacity in all cases except
                    //case where flag is explicitly set to false
                    if(!oConfig || oConfig.enableTilesOpacity !== false) {
                        sap.ushell.utils.handleTilesOpacity();
                    }
                }
                //Recheck tiles visibility on first load, and make visible tiles active
                try {
                    sap.ushell.utils.handleTilesVisibility();
                } catch (e) {
                    //nothing has to be done
                }

            };

            var hideGroupsFilter = []; //Add filter only if the feature is enabled.
            if(this.oViewData.config && this.oViewData.config.enableHideGroups){
                hideGroupsFilter.push(new sap.ui.model.Filter("isGroupVisible", sap.ui.model.FilterOperator.EQ, true));
            }
            var oGroupsContainer = new sap.ushell.ui.launchpad.DashboardGroupsContainer("dashboardGroups", {
                accessibilityLabel : sap.ushell.resources.i18n.getText("DashboardGroups_label"),
                groups : {
                    path: "/groups",
                    template : oTilesContainerTemplate,
                    filters : hideGroupsFilter
                },
                afterRendering : fAfterRenderingHandler
            });
            return oGroupsContainer;
        },
        _getTileContainerTemplate : function (oController) {
            var oFilter = new sap.ui.model.Filter("isTileIntentSupported", sap.ui.model.FilterOperator.EQ, true);
            var aAfterRenderingCallbacks = (sap.ui.Device.system.desktop && !sap.ui.Device.system.combi) ? [ oController._bindTileEvents, oController ] :  [function(){}];
            var oTilesContainerTemplate = new sap.ushell.ui.launchpad.TileContainer({
                headerText : "{title}",
                tooltip: "{title}",
                groupId: "{groupId}",
                defaultGroup: "{isDefaultGroup}",
                showHeader: true,
                showPlaceholder : true,
                tiles: {
                    path : "tiles",
                    template : new sap.ushell.ui.launchpad.Tile({
                        draggable : false,
                        "long" : "{long}",
                        "tall" : "{tall}",
                        uuid : "{uuid}",
                        target : "{target}",
                        rgba : "{rgba}",
                        animationRendered : false,
                        debugInfo : "{debugInfo}",
                        tileViews : {
                            path : "content",
                            factory : function(sId, oContext){
                                return oContext.getObject();
                            }
                        },
                        afterRendering : aAfterRenderingCallbacks
                    }),
                    filters : [oFilter]
                },
                add : function (oEvent) {
                    sap.ushell.renderers.fiori2.Navigation.openCatalogByHash({
                        groupContext : oEvent.getSource().getBindingContext()
                    });
                },
                afterRendering: function() {
                    if (this.getModel().getProperty("/personalization") && sap.ui.Device.system.desktop) {
                        var jqTileContainer = jQuery('#' + this.getId());
                        oController.makeGroupSortable(jqTileContainer);
                    }
                },
                removable: "{removable}",
                sortable: "{sortable}"
            });

            return oTilesContainerTemplate;
        },

        /**
         *
         * @param ui : tile DOM Reference
         * @private
         */
        _handleTouchStart : function(evt, ui) {

        },

        /**
         *
         * @param ui : tile DOM reference
         * @private
         */
        _handleTouchDrag : function (evt, ui) {
            //Prevent the tile to be launched after drop
            jQuery(ui).find("a").removeAttr('href');
            //show delete-area
            this.oDashboardDeleteArea.show();
            this.placeHolderElement = jQuery(".sapUshellTile-placeholder");
        },

        /**
         *
         * @param ui : tile DOM reference
         * @private
         */
        _handleDelete : function (evt, tile) {
            //If the tile positioned over the delete area
            if (this.oDashboardDeleteArea.isElementOverDeleteArea(tile)) {
                if (this.isOutsideDeleteArea){
                    this.oDashboardDeleteArea.tileOver(true);
                    this.oDashboardDeleteArea.adjustStyleOnOverIn(true, jQuery(tile));
                    this.isOutsideDeleteArea = false;
                    this.placeHolderElement.hide();
                }
            }
            else {
                if (!this.isOutsideDeleteArea) {
                    this.oDashboardDeleteArea.tileOver(false);
                    this.oDashboardDeleteArea.adjustStyleOnOverOut(true, jQuery(tile));
                    this.isOutsideDeleteArea = true;
                    this.placeHolderElement.show();
                }
            }
        },

        getControllerName: function () {
            return "sap.ushell.renderers.fiori2.launchpad.dashboard.DashboardContent";
        }
    });
}());
