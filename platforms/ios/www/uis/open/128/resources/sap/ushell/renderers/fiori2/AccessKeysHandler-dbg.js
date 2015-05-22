// Copyright (c) 2013 SAP AG, All Rights Reserved
(function () {
    "use strict";
    jQuery.sap.declare("sap.ushell.renderers.fiori2.AccessKeysHandler");

    var accessKeysHandler = function () {
        this.init();
    };

    accessKeysHandler.prototype = {
        keyCodes: jQuery.sap.KeyCodes,

        activateFlag: true,

        activateAccessibilityKeys: function (flag) {
            if (this.activateFlag === !!flag) {
                return;
            }
            this.activateFlag = !!flag;
            if (this.activateFlag) {
                this.init();
            } else {
                jQuery("body").off('keyup.accessKeysHandler');
            }
        },

        handleCatalogKey: function () {
            sap.ushell.renderers.fiori2.Navigation.openCatalogByHash({
                groupContext: null
            });
            jQuery("#configBtn").focus();
        },

        handleHomepageKey: function () {
            var oMainShell = sap.ui.getCore().byId("mainShell"),
                shellController = oMainShell.getController();
            shellController.navigateToHome();
            jQuery("#homeBtn").focus();
        },

        handleSearchKey: function () {
            var searchField = sap.ui.getCore().byId('sf');
            var jqSearchField = jQuery(searchField.getDomRef());
            jqSearchField.click();

        },

        handleUserMenuKey: function () {
            var loginDetailsButton = sap.ui.getCore().byId('loginDetails');
            if (!loginDetailsButton){
                jQuery.sap.require('sap.ushell.ui.footerbar.LoginDetailsButton');
                loginDetailsButton = new sap.ushell.ui.footerbar.LoginDetailsButton();
            }
            loginDetailsButton.showLoginDetailsDialog();
        },

        handleAccessOverviewKey: function () {
            var translationBundle = sap.ushell.resources.i18n,
                oSimpleForm = new sap.ui.layout.form.SimpleForm({
                    editable: false,
                    content: [
                        new sap.m.Label({text: "Alt+C"}),
                        new sap.m.Text({text: translationBundle.getText("actionCatalog")}),

                        new sap.m.Label({text: "Alt+H"}),
                        new sap.m.Text({text: translationBundle.getText("actionHomePage") }),

                        new sap.m.Label({text: "Alt+S"}),
                        new sap.m.Text({text: translationBundle.getText("actionSearch") }),

                        new sap.m.Label({text: "Alt+U"}),
                        new sap.m.Text({text: translationBundle.getText("actionLoginDetails") })

                    ]
                }),
                oDialog,
                okButton = new sap.m.Button({
                    text: translationBundle.getText("okBtn"),
                    press: function () {
                        oDialog.close();
                    }
                });

            oDialog = new sap.m.Dialog({
                id: "hotKeysGlossary",
                title: translationBundle.getText("hotKeysGlossary"),
                contentWidth: "300px",
                leftButton: okButton,
                afterClose: function () {
                    oDialog.destroy();
                }
            });

            oDialog.addContent(oSimpleForm);
            oDialog.open();
        },

        getNumberOfTileInRow: function (fromCatalog) {
            var jqTile = jQuery(".sapUshellTile:first");
            if (!jqTile.length) return false;
            var core = sap.ui.getCore();
            var tile = core.byId(jqTile.attr('id'));
            var tileFatSize = (tile.getLong() == true) ? 2 : 1;
            var contentWidth;
            if (!fromCatalog){
                contentWidth = jQuery("#dashboardGroups").width();
            } else {
                contentWidth = jQuery("#catalogTiles").width();
            }
            var tileWidth = jqTile.outerWidth(true) / tileFatSize;
            var numberTilesInRow =  Math.floor(contentWidth / tileWidth);
            return numberTilesInRow;
        },

        goToEdgeTile: function (selector) {
            var tileToSelect = jQuery(".sapUshellTile:visible")[selector]();
            if (!tileToSelect.length) {
                return false;
            }
            this.setTileFocus(tileToSelect);
            return true;
        },

        goToFirstTileOfSiblingGroup: function (selector,e) {
            e.preventDefault();
            var currentGroup = jQuery(":focus").closest(".sapUshellDashboardGroupsContainerItem");
            if (!currentGroup.length) return;
            var nextGroup = currentGroup[selector](".sapUshellDashboardGroupsContainerItem:not(.sapUshellCloneArea)");
            var tileSelector = 'first';
            if (!nextGroup.length) {
                if (!(selector == "next")) return;
                nextGroup = currentGroup;
                tileSelector = 'last';
            }
            var jqTileToSelect = nextGroup.find(".sapUshellTile")[tileSelector]();
            this.setTileFocus(jqTileToSelect);
            this.moveScrollDashboard(jqTileToSelect);
            return false;
        },

        goToFirstTileOfSiblingGroupInCatalog: function (selector,e) {
            e.preventDefault();
           // var currentGroup = new Array();
            var jqTileContainer = this.getFocusOnTile(jQuery(":focus"));
            if (!jqTileContainer) return;

            var jqTileToFocus;

            if (selector == "next") {
                var isLastGroup = jqTileContainer.nextAll("h3").length ? false : true;
                if (!isLastGroup) {
                    jqTileToFocus = jqTileContainer.nextAll("h3").first().next();
                } else {
                    jqTileToFocus = jqTileContainer.nextAll(".sapUshellTile").last();
                }
            } else {
                var isFirstGroup = jqTileContainer.prevAll("h3").length == 1 ? true : false;
                if (!isFirstGroup) {
                    jqTileToFocus = jQuery(jqTileContainer.prevAll("h3")[1]).next();
                } else {
                    jqTileToFocus = jqTileContainer.prevAll("h3").last().next();
                }
            }

            this.setTileFocus(jqTileToFocus);
            this.moveScrollCatalog(jqTileToFocus);

            return false;
        },

        swapTwoTilesInGroup: function (group, firstTile, secondTile) {
            var groupModelObj = group.getBindingContext().getObject();
            var firstTileIndex = groupModelObj.tiles.indexOf(firstTile.getBindingContext().getObject());
            var secondTileIndex = groupModelObj.tiles.indexOf(secondTile.getBindingContext().getObject());
            var firstTileModelObj =  groupModelObj.tiles.splice(firstTileIndex, 1, null);
            var secondTileModelObj = groupModelObj.tiles.splice(secondTileIndex, 1, firstTileModelObj[0]);
            groupModelObj.tiles.splice(firstTileIndex, 1, secondTileModelObj[0]);
            var groupPath = group.getBindingContext().getPath();
            group.getModel().setProperty(groupPath, groupModelObj);
        },

        moveTileInGroup: function (group, firstTile, secondTile) {
            if (sap.ui.getCore().byId("shell").getModel().getProperty("/personalization")) {
                var groupModelObj = group.getBindingContext().getObject();
                var firstTileIndex = groupModelObj.tiles.indexOf(firstTile.getBindingContext().getObject());
                var secondTileIndex = groupModelObj.tiles.indexOf(secondTile.getBindingContext().getObject());
                var firstTileModelObj =  groupModelObj.tiles.splice(firstTileIndex, 1);
                groupModelObj.tiles.splice(secondTileIndex, 0, firstTileModelObj[0]);
                var groupPath = group.getBindingContext().getPath();
                group.getModel().setProperty(groupPath, groupModelObj);
            }
        },

        moveTile: function (direction, swapTiles) {
            if (sap.ui.getCore().byId("shell").getModel().getProperty("/personalization")) {
            if (typeof swapTiles == "undefined") {
                swapTiles=false;
            }
            var info = this.getGroupAndTilesInfo();
            if (!info) return;
            var nextTile = this.getNextTile(direction, info);
            if (!nextTile) return;

            if (swapTiles) {
                this.swapTwoTilesInGroup(info.group, info.curTile, nextTile);
            } else {
                this.moveTileInGroup(info.group, info.curTile, nextTile);
            }
            setTimeout(function() {//setTimeout because we have to wait until the asynchronous "moveTile" flow ends
                this.setTileFocus($(nextTile.getDomRef()));
            }.bind(this), 100);
        }
    },

        getNextTile: function (direction, info) {
            var nextTile,
            isRTL = sap.ui.getCore().getConfiguration().getRTL();

            if (direction == "left") { 
                nextTile = info.tiles[info.curTileIndex + ( isRTL ? 1 : -1 ) ];
            }
            if (direction == "right") {
                nextTile = info.tiles[info.curTileIndex + ( isRTL ? -1 : 1 ) ];
            }
            if (direction == "down" || direction == "up") {
                var nearTilesArr;
                var origTileLeftOffset = parseFloat(info.curTile.getDomRef().offsetLeft);
                if (direction == "down") {
                    nearTilesArr = info.tiles.slice(info.curTileIndex+1, info.curTileIndex+(info.sizeOfLine*2));
                } else {
                    var startIndex = info.curTileIndex-(info.sizeOfLine*2);
                    startIndex = (startIndex>0) ? startIndex : 0;
                    nearTilesArr = info.tiles.slice(startIndex, info.curTileIndex-1).reverse();
                }
                for (var i=0, length=nearTilesArr.length; i<length; i++) {
                    var tileElement = nearTilesArr[i].getDomRef();
                    var leftOffset = parseFloat(tileElement.offsetLeft);
                    var width = parseFloat(tileElement.offsetWidth);
                    var leftAndWidth = leftOffset+width;
                    if (leftOffset<=origTileLeftOffset && leftAndWidth>=origTileLeftOffset) {
                        nextTile=nearTilesArr[i];
                        break;
                    }
                }
            }
            return nextTile;
        },

        getGroupAndTilesInfo: function (jqTileContainer, fromCatalog) {
            if (!jqTileContainer) {
                jqTileContainer = this.getFocusOnTile(jQuery(":focus"));
            }
            if (!jqTileContainer.length) return;
            var curTile = sap.ui.getCore().byId(jqTileContainer.attr('id'));
            var group =  curTile.getParent();
            var tiles;
            if (!fromCatalog){
                tiles = group.getTiles();
            } else {
                tiles = new Array();
                var jqTiles = jqTileContainer.prevAll("h3").first().nextUntil("h3");
                for (var i=0; i<jqTiles.length; i++) {
                    tiles.push(sap.ui.getCore().byId(jqTiles[i].id));
                }
            }

            var sizeOfLine = this.getNumberOfTileInRow(fromCatalog);
            return {
                curTile: curTile,
                curTileIndex: tiles.indexOf(curTile),
                tiles: tiles,
                sizeOfLine: sizeOfLine,
                group: group
            }
        },

        goToNearbyTile: function (direction, jqTile, fromCatalog) {
            var info = this.getGroupAndTilesInfo(jqTile, fromCatalog);
            if (!info) return;
            var nextTile = this.getNextTile(direction, info);
            if (!nextTile) return;
            this.setTileFocus($(nextTile.getDomRef()));
        },

        deleteTile: function (jqTile) {
            var tileId = jqTile.attr("id");
            if (tileId) {
                var oTile = sap.ui.getCore().byId(tileId);
                var oEventBus = sap.ui.getCore().getEventBus();
                oEventBus.publish("launchpad", "deleteTile", {
                    tileId: oTile.getUuid()
                });
            }
        },

        setTileFocus : function(jqTile) {
            if (!jqTile.hasClass('sapUshellPlusTile')) {
                var jqFocusables = jqTile.find('[tabindex], a').andSelf().filter('[tabindex], a');
                jqFocusables.filter('[tabindex!="-1"]');
                jqTile=jqFocusables.eq(0);
            }
            jqTile.focus();
        },

        moveScrollDashboard: function(jqTileSelected){
            var jqDashboardPageCont = jQuery("#dashboardPage-cont");
            var iTopSpacing = jQuery('#shell-hdr').height() + parseInt(jQuery('.sapUshellContainerTitle').css('margin-top'),10);
            var iY = jqTileSelected.offset().top + jqDashboardPageCont.scrollTop() - iTopSpacing;
            sap.ui.getCore().byId("dashboardPage").scrollTo(iY, 500);
        },

        moveScrollCatalog: function(jqTileSelected){
            var jqDashboardPageCont = jQuery("#catalogTilesPage-cont");
            var iTopSpacing = jQuery('#shell-hdr').height() + jQuery('.sapMPageHeader').height() + (parseInt(jQuery('.sapMPanelHdr').css('margin-top'),10) * 2);
            var iY = jqTileSelected.offset().top + jqDashboardPageCont.scrollTop() - iTopSpacing;
            sap.ui.getCore().byId("catalogTilesPage").scrollTo(iY, 500);
        },

        goToNearbySidePanelGroup: function (direction, jqElement) {
            var selector = (direction=="up") ? "prev" : "next";
            var nextGroup = jqElement[selector]();
            if (!nextGroup) return;
            nextGroup.focus();
        },

        deleteSidePanelGroup: function (jqGroup) {
            var core = sap.ui.getCore();
            var oGroup = core.byId(jqGroup.attr('id'));
            var bRemovable = oGroup.getRemovable();
            var oEventBus = core.getEventBus();
            oEventBus.publish("launchpad", bRemovable ? "deleteGroup" : "resetGroup", {
                groupId : oGroup.getGroupId()
            });
        },

        moveSidePanelGroup: function (direction, jqGroup) {
            var core = sap.ui.getCore();
            var oGroup = core.byId(jqGroup.attr('id'));
            var index = oGroup.getIndex();
            var toIndex =  direction == "up" ? index-1 : index+1;
            if (!index || !toIndex) return;
            var groups = oGroup.getParent().getItems();
            if (toIndex>=(groups.length)) return;
            var oData = {fromIndex: index, toIndex: toIndex};
            var oBus = core.getEventBus();
            oBus.publish("launchpad", "moveGroup", oData);
            this.upDownButtonsHandler(direction);
        },

        goToEdgeSidePanelGroup: function (selector) {
            var jqGroups = jQuery(".sapUshellGroupLI");
            jqGroups[selector]().focus();
        },

        getFocusGroupFromSidePanel: function (jqFocused) {
            var jqFocusedGroup = jqFocused.closest(".sapUshellGroupLI");
            return jqFocusedGroup.length ? jqFocusedGroup : false;
        },

        getFocusOnTile: function (jqFocused) {
            var jqFocusedTile = jqFocused.closest(".sapUshellTile");
            return jqFocusedTile.length ? jqFocusedTile : false;
        },

        getFocusOnCatalogPopover: function (jqFocused) {
            var jqFocusedPopover = jqFocused.closest(".sapMPopover");
            return jqFocusedPopover.length ? jqFocusedPopover : false;
        },

        addGroup: function (jqButton) {
            var core = sap.ui.getCore();
            var oButton = core.byId(jqButton.attr('id'));
            oButton.firePress();
        },

        renameGroup: function () {
            var jqFocused = jQuery(":focus");
            var jqElement = this.getFocusGroupFromSidePanel(jqFocused);
            if (jqElement) {
                jqElement.dblclick();
            }

        },

        upDownButtonsHandler: function (direction, fromCatalog) {
            var jqElement,
                jqFocused = jQuery(":focus");
            if (jqElement = this.getFocusGroupFromSidePanel(jqFocused)) {
                this.goToNearbySidePanelGroup(direction, jqElement);
                return;
            }
            if (jqElement = this.getFocusOnTile(jqFocused)) {
                this.goToNearbyTile(direction, jqElement, fromCatalog);
                return;
            }
            if (jqElement = this.getFocusOnCatalogPopover(jqFocused)) {
                this.goToNearbyTile(direction, jqElement, fromCatalog);
                return;
            }
        },

        homeEndButtonsHandler: function (selector) {
            var jqElement,
                jqFocused = jQuery(":focus");
            if (jqFocused.closest("#dashboardGroups").length || jqFocused.closest("#catalogTiles").length) {
                this.goToEdgeTile(selector);
                return;
            }
            if (jqElement = this.getFocusGroupFromSidePanel(jqFocused)) {
                this.goToEdgeSidePanelGroup(selector);
                return;
            }
        },

        deleteButtonHandler: function () {
        	if (sap.ui.getCore().byId("shell").getModel().getProperty("/personalization")) {
        		var jqElement,
        		jqFocused = jQuery(":focus");
        		if (jqElement = this.getFocusOnTile(jqFocused)) {
        			this.deleteTile(jqElement);
        			return;
        		}
        		if (jqElement = this.getFocusGroupFromSidePanel(jqFocused)) {
        			
        			//Don't delete the group in case delete was pressed during renaming & in case this is a default group.
        			if(!jqElement.hasClass('sapUshellEditing') && !jqElement.hasClass("sapUshellDefaultGroupItem")){
        				this.deleteSidePanelGroup(jqElement);
        				return;
        			}          	
        		}
        	}
        },

        ctrlUpDownButtonsHandler: function (selector) {
            var jqElement,
                jqFocused = jQuery(":focus");
            if (jqElement = this.getFocusOnTile(jqFocused)) {
                this.moveTile(selector, false, jqElement);
                return;
            }
            if (jqElement = this.getFocusGroupFromSidePanel(jqFocused)) {
                this.moveSidePanelGroup(selector, jqElement);
                return;
            }
            this.moveTile("down");
        },

        spaceButtonHandler: function (e) {
            var jqElement,
                jqFocused = jQuery(":focus");
            if (jqElement = this.getFocusGroupFromSidePanel(jqFocused)) {
                jqElement.click();
                return false;
            }
            var jqElement = jqFocused.closest('#addGroupActionItem');
            if (jqElement.length) {
                this.addGroup(jqElement);
                return false;
            }
        },

        f6DashboardButtonHandler: function (e) {
            var jqFocused = jQuery(":focus"),
                jqElement, focusCase;
            var selector = {
                configButton: '#configBtn',
                sidePanelFirstGroup: '.sapUshellGroupLI:first:visible',
                firstTile: '.sapUshellTile:first'
                };

            if (jqFocused.closest('#dashboardGroups').length) {
                if (!e.shiftKey) {
                    focusCase = "configButton";
                } else {
                    jqElement = jQuery(selector.sidePanelFirstGroup);
                    if (!jqElement.length) {
                        focusCase = "configButton";
                    } else {
                        focusCase = "jqElement";
                    }
                }
            }

            if (jqFocused.closest(selector.sidePanelFirstGroup).length) {
                if (!e.shiftKey) {
                    focusCase = 'firstTile';
                } else {
                    focusCase = 'configButton';
                }
            }

            if (jqFocused.closest('#shell-hdr').length) {
                if (e.shiftKey) {
                    focusCase = 'firstTile';
                } else {
                    jqElement = jQuery(selector.sidePanelFirstGroup);
                    if (!jqElement.length) {
                        focusCase = 'firstTile';
                    } else {
                        focusCase = "jqElement";
                    }
                }
            }

            e.preventDefault();
            switch (focusCase) {
                case 'firstTile':
                    jqElement = jQuery(selector.firstTile);
                    this.setTileFocus(jqElement);
                    break;
                case 'jqElement':
                    jqElement.focus();
                    break;
                default:
                    jqElement = jQuery(selector.configButton);
                    jqElement.focus();
                    break;

            }
            return false;
        },

        f6CatalogButtonHandler: function (e) {
            var jqFocused = jQuery(":focus"),
                jqElement, focusCase;
            var selector = {
                homeButton: '#homeBtn',
                backButton: '.sapMBarChild.sapMBtn:first',
                dropDownList: '#catalogSelect',
                searchField: '#catalogSearch input',
                firstTile: '#catalogTiles .sapUshellTile:visible:first'
            };

            if (jqFocused.closest('#shell-hdr').length) {
                if (!e.shiftKey) {
                    focusCase = 'backButton';
                    jqElement = jQuery(selector.backButton);
                } else {
                    focusCase = 'firstTile';
                    jqElement = jQuery(selector.firstTile);
                }
            }
            if (jqFocused.closest(selector.backButton).length) {
                if (!e.shiftKey) {
                    jqElement = jQuery(selector.dropDownList);
                    focusCase = 'dropDownList';
                } else {
                    jqElement = jQuery(selector.homeButton);
                    focusCase = 'homeButton';
                }
            }

            if (jqFocused.closest('#catalogSelect').length) {
                if (!e.shiftKey) {
                    jqElement = jQuery(selector.searchField);
                    focusCase = 'searchField';
                } else {
                    jqElement = jQuery(selector.backButton);
                    focusCase = 'backButton';
                }
            }

            if (jqFocused.closest('#catalogSearch').length) {
                if (!e.shiftKey) {
                    jqElement = jQuery(selector.firstTile);
                    focusCase = 'firstTile';
                } else {
                    jqElement = jQuery(selector.dropDownList);
                    focusCase = 'dropDownList';
                }
            }

            if (jqFocused.closest('#catalogTiles').length) {
                if (!e.shiftKey) {
                    jqElement = jQuery(selector.homeButton);
                    focusCase = "homeButton";
                } else {
                    jqElement = jQuery(selector.searchField);
                    focusCase = "searchField";
                }
            }

            e.preventDefault();
            switch (focusCase) {
                case 'firstTile':
                    jqElement = jQuery(selector.firstTile);
                    this.setTileFocus(jqElement);
                    break;
                case 'homeButton':
                case 'backButton':
                case 'dropDownList':
                case 'searchField':
                    jqElement.focus();
                    break;
                default:
                    jqElement = jQuery(selector.homeButton);
                    jqElement.focus();
                    break;
            }
            return false;
        },

        mainKeydownHandler: function(e){
            e = e || window.event;
            //in case this is not F6 key return and do default

            switch (e.keyCode) {
                case this.keyCodes.SPACE:
                    this.spaceButtonHandler(e);
                    break;
                case this.keyCodes.HOME: //Home button
                    this.homeEndButtonsHandler("first");
                    break;
                case this.keyCodes.END: //End button
                    this.homeEndButtonsHandler("last");
                    break;
                default:
                    return true;
            }

            //in case this we are not in home return and do default
        },

        catalogKeydownHandler: function(keydown){
            var handler = sap.ushell.renderers.fiori2.AccessKeysHandler;
            var fromCatalog = true;
            switch (keydown.keyCode) {
                case handler.keyCodes.F6:
                    return handler.f6CatalogButtonHandler(keydown);
                    break;
                case handler.keyCodes.ARROW_UP: //Up
                    handler.upDownButtonsHandler("up", fromCatalog);
                    break;
                case handler.keyCodes.ARROW_DOWN: //Down
                    handler.upDownButtonsHandler("down", fromCatalog);
                    break;
                case handler.keyCodes.ARROW_RIGHT: // Right ->
                    handler.goToNearbyTile("right");
                    break;
                case handler.keyCodes.ARROW_LEFT: // Left <-
                    handler.goToNearbyTile("left");
                    break;
                case handler.keyCodes.PAGE_UP: //Page Up button
                    handler.goToFirstTileOfSiblingGroupInCatalog('prev',keydown);
                    break;
                case handler.keyCodes.PAGE_DOWN: //Page Down
                    handler.goToFirstTileOfSiblingGroupInCatalog('next',keydown);
                    break;
            }
        },

        dashboardKeydownHandler: function(keydown){
            var handler = sap.ushell.renderers.fiori2.AccessKeysHandler;
            switch (keydown.keyCode) {
                case handler.keyCodes.F2:
                    this.renameGroup();
                    break;
                case handler.keyCodes.F6:
                    return handler.f6DashboardButtonHandler(keydown);
                    break;
                case handler.keyCodes.DELETE: // Delete
                    handler.deleteButtonHandler();
                    break;
                case handler.keyCodes.ARROW_UP: //Up
                    if (keydown.ctrlKey === true) {
                        handler.ctrlUpDownButtonsHandler("up");
                    }
                    else{
                        handler.upDownButtonsHandler("up");
                    }
                    break;
                case handler.keyCodes.ARROW_DOWN: //Down
                    if (keydown.ctrlKey === true) {
                        handler.ctrlUpDownButtonsHandler("down");
                    }
                    else {
                        handler.upDownButtonsHandler("down");
                    }
                    break;
                case handler.keyCodes.ARROW_RIGHT: // Right ->
                    if (keydown.ctrlKey === true) {
                        handler.moveTile("right");
                    } else {
                        handler.goToNearbyTile("right");
                    }
                    break;
                case handler.keyCodes.ARROW_LEFT: // Left <-
                    if (keydown.ctrlKey === true) {
                        handler.moveTile("left");
                    } else {
                        handler.goToNearbyTile("left");
                    }
                    break;
                case handler.keyCodes.PAGE_UP: //Page Up button //TODO : check what happen when the tile is  empty
                    handler.goToFirstTileOfSiblingGroup('prev',keydown);
                    break;
                case handler.keyCodes.PAGE_DOWN: //Page Down
                    handler.goToFirstTileOfSiblingGroup('next',keydown);
                    break;
            }
        },

        init: function () {
            jQuery(document).on('keyup.accessKeysHandler', function (keyUpEvent) {
                if (!this.activateFlag) {
                    return;
                }
                if (keyUpEvent.altKey) {
                    switch (String.fromCharCode(keyUpEvent.keyCode).toUpperCase()) {
                        case 'C':
                        	if (sap.ui.getCore().byId("shell").getModel().getProperty("/personalization")) {
                        		this.handleCatalogKey();
                        	}
                            break;
                        case 'H':
                            this.handleHomepageKey();
                            break;
                        case 'S':
                            this.handleSearchKey();
                            break;
                        case 'U':
                            this.handleUserMenuKey();
                            break;
                        case '0':
                            this.handleAccessOverviewKey();
                            break;
                    } // End of switch
                } // End of if altKey
            }.bind(this)); // End of event handler

            //listen to keydown event in order to support accessibility F6 key
            jQuery(document).on('keydown.main', this.mainKeydownHandler.bind(this));
        }
    };

    sap.ushell.renderers.fiori2.AccessKeysHandler = new accessKeysHandler();

}());
