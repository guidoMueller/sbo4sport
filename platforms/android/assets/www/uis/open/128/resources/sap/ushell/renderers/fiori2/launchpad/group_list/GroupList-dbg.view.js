//Copyright (c) 2013 SAP AG, All Rights Reserved

(function () {
    "use strict";
    /*global jQuery, sap, $, document */
    /*jslint plusplus: true, nomen: true */

    jQuery.sap.require("sap.ushell.ui.launchpad.GroupListItem");
    jQuery.sap.require("sap.ui.core.IconPool");

    var _mouseStop = $.ui.sortable.prototype._mouseStop;

    $.ui.sortable.prototype._mouseStop = function (event, noPropagation) {
        if (!event) {
            return;
        }

        if (this.options.revert) {
            var that = this,
                args = arguments,
                cur = that.placeholder.offset(),
                // the duration will not determine how long the revert animation is
                dur = $.isFunction(this.options.revert) ? this.options.revert.apply(this.element[0], [event, that._uiHash(this)]) : this.options.revert,
                jqHelper = jQuery(this.helper);

            self.reverting = true;

            if (jQuery(".sapUshellDeleteArea_grouplist_functional").data("groupOver") === true) {
                var oGroup = sap.ui.getCore().byId(jQuery(that.currentItem).attr('id')),
                    bRemovable = oGroup.getRemovable(),
                    fOnConfirm = function () {
                        //User wants to delete
                        //Flag for deletion
                        jqHelper.data("deleteMe", true);
                        //Animation to grouplist delete area
                        jqHelper.animate({
                            top: (jQuery(document).height() - jqHelper.height() - 10) + "px",
                            left: "0px",
                            opacity: 0
                        }, !isNaN(dur) ? dur : 250, function () {
                            event.scrollToGroup = false;
                            that._clear(event);

                            //Delete the group!
                            var oEventBus = sap.ui.getCore().getEventBus();
                            oEventBus.publish("launchpad", bRemovable ? "deleteGroup" : "resetGroup", {
                                groupId : oGroup.getGroupId()
                            });

                            //show the original group list items after dragging is finished
                            var oController = sap.ui.getCore().byId('groupList').oController;
                            oController._getJqAllListItems().not(".sapUshellSortableHelperClone").not(".sapUshellClonedGrouplistItem").css("visibility", "");
                            //Save that nothing is "over" the delete area anymore
                            jQuery(".sapUshellDeleteArea_grouplist_functional").data("groupOver", false);
                        });
                    };
                //hide the dragged group while the confirm message is visible
                jqHelper.animate({opacity : 'hide'});
                oGroup.bDeletionFlag = true;

                fOnConfirm();

            } else if (jQuery(".sapUshellGroupList").data("dropGroup")) {
                var jqGroupListItem = jQuery.sap.byId(jQuery(".sapUshellGroupList").data("dropGroup").sId);

                //Animate tile right into the group list item
                jqHelper.animate({
                    top: jqGroupListItem.offset().top + 16,
                    left: jqGroupListItem.offset().left + 48,
                    height: "0px",
                    width: "0px",
                    opacity: 0
                }, !isNaN(dur) ? dur : 250, function () {
                    jQuery(".sapUshellGroupList").data("dropGroup", null);
                    _mouseStop.apply(that, args);
                });

            } else {
                _mouseStop.apply(that, args);
            }
        } else {
            event.scrollToGroup = true;
            this._clear(event, noPropagation);
        }

        return false;
    };

    sap.ui.jsview("sap.ushell.renderers.fiori2.launchpad.group_list.GroupList", {
        createContent: function (oController) {
            var that = this,
                oOpenCatalogItem =  this._getOpenCatalogItem(oController),
                oAddGroupItem = this._getAddGroupItem(oController),
                oGroupListItemTemplate = this._getGroupListItemTemplate(oController),
                nAddedListItemId = undefined,
                oShell = sap.ui.getCore().byId("shell"),
                oShellModel = oShell && oShell.getModel();

            this.oGrouplistDeleteArea = new sap.ushell.ui.launchpad.DeleteArea({
                type: sap.ushell.ui.launchpad.DeleteAreaType.GroupList,
                message: sap.ushell.resources.i18n.getText("deleteAreaMsgForGroup"),
                icon: sap.ui.core.IconPool.getIconURI('delete')
            });
            var hideGroupsFilter = [];//Add filter only if the feature is enabled.
            if(oShellModel && oShellModel.getProperty("/enableHideGroups")){
                hideGroupsFilter.push(new sap.ui.model.Filter("isGroupVisible", sap.ui.model.FilterOperator.EQ, true));
            }
            this.oGroupList = new sap.m.List("groupListItems",{
                items : {
                    path     : "/groups",
                    template : oGroupListItemTemplate,
                    filters : hideGroupsFilter
                }
            }).addStyleClass("sapUshellGroupItemList");
            //This two functions overwrite methods from ListBase class
            //sap.m.ListBase.prototype.onsapskipforward
            //sap.m.ListBase.prototype.onsapskipback
            // to avoid unpredicted behavior with F6
            jQuery.extend(this.oGroupList, {
                onsapskipforward: function () {},
                onsapskipback: function () {}
            });
            var fChangeHandler = function (oEvent) {
                var oList = oEvent.getSource().oList; //The list of groups from the model - items aggregation

                if (oList[oList.length-1].editMode){
                    var aListItems = that.oGroupList.getItems(); //The list of groupListItems from the DOM.
                    nAddedListItemId = aListItems[aListItems.length-1].getId(); //Since there might be hidden groups, take the last group from the model.
                }
            };

            /**
             *
             * @param ui : groupListItem DOM Reference
             * @private
             */
            this._handleTouchStart = function(evt, ui) {
                //In order to save the start position of the dragged element
                var jqElement = jQuery(ui);
                jqElement.attr('startPos',jqElement.index());
            },

            /**
             *
             * @param ui : groupListItem DOM Reference
             * @private
             */
            this._handleDoubleTap = function(evt, ui) {
                var groupListItem = sap.ui.getCore().byId(ui.getAttribute('id'));
                if (groupListItem) {
                    groupListItem.ondblclick();
                }
            },

            /**
             *
             * @param ui : groupListItem DOM reference
             * @private
             */
            this._handleTouchDrag = function (evt, ui) {
                //remove the sapUshellOver class from all groupListItems in order to prevent multiple selection
                jQuery(this.getDomRef()).find(".sapUshellOver").removeClass('sapUshellOver');
                //show delete-area
                this.oGrouplistDeleteArea.show();
            },

            this.oGroupList.onBeforeRendering = function () {
                if (that.touchSupport) {
                    that.touchSupport.disable();
                    that.touchSupport = null;
                }
            },

            this._handleDelete = function (evt, groupListItem) {
                //If the tile positioned over the delete area
                if (this.oGrouplistDeleteArea.isElementOverDeleteArea(groupListItem)) {
                    if (this.isOutsideDeleteArea) {
                        var oGroup = sap.ui.getCore().byId(groupListItem.getAttribute('id'));
                        this.oGrouplistDeleteArea.setDeleteAreaMessage(oGroup);
                        this.oGrouplistDeleteArea.groupOver(true);
                        this.oGrouplistDeleteArea.adjustStyleOnOverIn(true, jQuery(groupListItem));
                        this.isOutsideDeleteArea = false;
                    }
                }
                else {
                    if (!this.isOutsideDeleteArea) {
                        this.oGrouplistDeleteArea.groupOver(false);
                        this.oGrouplistDeleteArea.adjustStyleOnOverOut(true, jQuery(groupListItem));
                        this.isOutsideDeleteArea = true;
                    }
                }
            },

            this.oGroupList.onAfterRendering = function () {
                oController._updateGroupSelection();

                if (this.getModel().getProperty("/personalization")) {
                    if (!sap.ui.Device.system.desktop) {
                        that.touchSupport = new sap.ushell.touchSupport({
                            containerSelector: "#groupListPage-scroll .sapUshellGroupItemList",
                            draggableSelector: ".sapUshellGroupLI:not(.sapUshellDefaultGroupItem)",
                            rootSelector : "#groupList",
                            wrapperSelector : "#groupListPage-scroll",
                            touchStartCallback : that._handleTouchStart.bind(that),
                            touchEndCallback : oController._handleDrop.bind(oController),
                            touchDragCallback : that._handleTouchDrag.bind(that),
                            dragAndScrollCallback : that._handleDelete.bind(that),
                            doubleTapCallback: that._handleDoubleTap.bind(that),
                            placeHolderClass : "sapUshellGroupListItem-placeholder",
                            cloneClass :"sapUshellGroupListItem-clone",
                            moveTolerance : 1,
                            switchModeDelay : 1000,
                            debug: jQuery.sap.debug()
                        }).enable();
                    }
                    else {
                        jQuery.proxy(oController.makeSortable, oController)();
                    }
                }

                if (nAddedListItemId) {
                    var jqAddedListItem = jQuery.sap.byId(nAddedListItemId);

                    jqAddedListItem
                        .css('opacity', 0)
                        .slideDown(300)
                        .animate(
                            { opacity: 1 },
                            { queue: false, duration: 300 }
                        );

                    nAddedListItemId = undefined;
                }

                this.getBinding("items").detachChange(fChangeHandler);
                this.getBinding("items").attachChange(fChangeHandler);
            };

            this.oGroupList.updateItems = sap.ushell.override.updateAggregatesFactory("items");

            //hidden Sidebar item to support TabIndex
            var lastHiddenSidebarTabFocusHelper = new sap.m.Button("lastHiddenSidebarTabFocusHelper");
            lastHiddenSidebarTabFocusHelper.addEventDelegate({
                onfocusin: function () {
                    try {
                        if (!sap.ushell.renderers.fiori2.AccessKeysHandler.goToEdgeTile('first')) {
                            sap.ui.getCore().byId('actionsBtn').focus();
                        }
                    } catch (e) {
                    }
                }
            });

            //hidden Sidebar item to support TabIndex
            var firstHiddenSidebarTabFocusHelper = new sap.m.Button("firstHiddenSidebarTabFocusHelper");
            firstHiddenSidebarTabFocusHelper.addEventDelegate({
                onfocusin: function () {
                    try {
                        var actionsBtn = sap.ui.getCore().byId('actionsBtn');
                        actionsBtn.focus();
                    } catch (e) {
                    }
                }
            });

            if (sap.ui.getCore().byId("shell") && sap.ui.getCore().byId("shell").getModel()
                    && sap.ui.getCore().byId("shell").getModel().getProperty("/personalization")) {
                this.oActionList = new sap.m.List({
                    items : [ oAddGroupItem, oOpenCatalogItem ]
                });

              //This two functions overwrite methods from ListBase class
                //sap.m.ListBase.prototype.onsapskipforward
                //sap.m.ListBase.prototype.onsapskipback
                // to avoid unpredicted behavior with F6
                jQuery.extend(this.oActionList, {
                    onsapskipforward: function () {},
                    onsapskipback: function () {}
                });
                this.oActionList._navToTabChain = function () {};
                /*
                 override original onAfterRendering as currently sap.m.List
                 does not support afterRendering handler in the constructor
                 this is done to support tab order accessibility
                 */
                var origOpenCatalogListOnAfterRendering = this.oActionList.onAfterRendering;
                this.oActionList.onAfterRendering = function (oEvent) {
                    origOpenCatalogListOnAfterRendering.call(this, oEvent);
                    var oControl = oEvent.srcControl.getItems()[0];
                };

                var groupListFooter = new sap.m.Bar({
                    id: "groupListFooter",
                    contentMiddle: [this.oActionList, lastHiddenSidebarTabFocusHelper]
                });
                groupListFooter.addStyleClass("sapUshellPersonalizationOn");

                this.groupListPage = new sap.m.Page({
                    id: "groupListPage", // sap.ui.core.ID
                    showHeader: false,
                    showFooter: true,
                    content: [firstHiddenSidebarTabFocusHelper, this.oGroupList], // sap.ui.core.Control
                    footer: groupListFooter,
                    enableScrolling: !!sap.ui.Device.system.desktop
                });
                this.groupListPage.addStyleClass("sapUshellPersonalizationOn");
            } else {
                this.groupListPage = new sap.m.Page({
                    id: "groupListPage", // sap.ui.core.ID
                    showHeader: false,
                    showFooter: false,
                    content: [firstHiddenSidebarTabFocusHelper, this.oGroupList] // sap.ui.core.Control
                });
            }
            this.addStyleClass("sapUshellGroupList");


            return [this.groupListPage, this.oGrouplistDeleteArea];
        },

        _getOpenCatalogItem : function () {
            var fOpenCatalog = function () {
                sap.ushell.renderers.fiori2.Navigation.openCatalogByHash({
                    groupContext : null
                });
            },
                oOpenCatalogItem = new sap.m.ActionListItem("openCatalogActionItem", {
                    text: "{i18n>open_catalog}",
                    tooltip: "{i18n>openCatalog_tooltip}",
                    press: fOpenCatalog
                });

            return oOpenCatalogItem;
        },

        _getGroupListItemTemplate : function (oController) {
            var fOnAfterRenderingHandler = function (oEvent) {
                if (this.getParent().getItems()[0] === this) {
                    this.setAllowEditMode(false);
                    if (this.getDefaultGroup()) {
                        this.addStyleClass("sapUshellDefaultGroupItem");
                    }
                } else {
                    this.addStyleClass("sapUshellGroupListItem");
                }

                oController._bindGroupListItemEvents(oEvent);
                jQuery(this.getDomRef()).attr("tabindex", "0");
            };

            return new sap.ushell.ui.launchpad.GroupListItem({
                index : "{index}",
                title : "{title}",
                tooltip : "{title}",
                defaultGroup : "{isDefaultGroup}",
                groupId : "{groupId}",
                editMode : "{editMode}",
                //xTODO: This information does not belong into the ui element, but there is no other way to make it accessible to drop-event-handler (_mouseStop).
                removable : "{removable}",
                numberOfTiles : "{tiles/length}",
                afterRendering : fOnAfterRenderingHandler,
                isGroupVisible: "{isGroupVisible}",
                press : [ function (oEvent) {
                    this._handleGroupListItemPress(oEvent);
                }, oController ],
                change : [ oController.onGroupTitleChange, oController],
                over : [ oController._handleGroupListItemOver, oController ],
                out : [ oController._handleGroupListItemOut, oController ],
                drop : [ oController._handleGroupListItemDrop, oController ]
            });
        },

        _getAddGroupItem : function (oController) {

            var oAddGroupItem = new sap.m.ActionListItem("addGroupActionItem", {
                text : "{i18n>add_group}",
                tooltip: "{i18n>add_group_tooltip}",
                press : [ function () {
                    oController._handleGroupCreate.apply(oController, arguments);
                }, oController]
            });

            return oAddGroupItem;
        },

        getControllerName: function () {
            return "sap.ushell.renderers.fiori2.launchpad.group_list.GroupList";
        }
    });
}());
