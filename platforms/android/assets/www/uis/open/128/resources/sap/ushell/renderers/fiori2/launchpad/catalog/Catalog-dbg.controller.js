// Copyright (c) 2013 SAP AG, All Rights Reserved

(function () {
    "use strict";
    /*global jQuery, $, sap, console, window */
    /*jslint nomen: true */

    sap.ui.controller("sap.ushell.renderers.fiori2.launchpad.catalog.Catalog", {

        onInit: function () {
            sap.ui.getCore().getEventBus().subscribe("showCatalogEvent", this.onShow, this);
            sap.ui.getCore().byId("catalogSelect").addEventDelegate({
                onBeforeRendering : this.onBeforeSelectRendering
            }, this);
        },

        onExit: function () {
            sap.ui.getCore().getEventBus().unsubscribe("showCatalogEvent", this.onShow);
            this.getView().aDanglingControls.forEach(function (oControl) {
                oControl.destroy();
            });
        },

        onAfterRendering: function () {
            // disable swipe gestures -> never show master in Portait mode
            var oModel = sap.ui.getCore().byId("navContainer").getModel(),
                that = this;
            //check if the catalogs were already loaded, if so, we don't need the loading message 
            if (!oModel.getProperty('/catalogs').length) {
                //add the loading message right after the catalog is rendered
                oModel.setProperty('/catalogs', [{
                    title: sap.ushell.resources.i18n.getText('catalogsLoading'),
                    "static": true,
                    tiles: [],
                    numIntentSupportedTiles : -1//only in order to present this option in the Catalog.view (dropdown menu)since there is a filter there on this property
                }]);
            }
            sap.ui.getCore().byId("catalogSelect").setSelectedItemId();

            if (!this.PagingManager) {
                this.lastCatalogId = 0;
                jQuery.sap.require("sap.ushell.renderers.fiori2.launchpad.PagingManager");
                this.PagingManager = new sap.ushell.renderers.fiori2.launchpad.PagingManager('catalogPaging', {
                    elementClassName: 'sapUshellTile',
                    containerHeight: window.innerHeight,
                    containerWidth: window.innerWidth
                });
            }

            //just the first time
            if (this.PagingManager.currentPageIndex === 0) {
                that.allocateNextPage();
            }

            if (sap.ui.Device.system.desktop) {
                jQuery("#catalogTilesPage-cont").scroll(function (event) {
                    var oPage = sap.ui.getCore().byId('catalogTilesPage'),
                        scroll = oPage.getScrollDelegate(),
                        currentPos = scroll.getScrollTop(),
                        max = scroll.getMaxScrollTop();

                    if (max - currentPos <= 30 + that.PagingManager.getTileHeight()) {
                        that.allocateNextPage();
                    }
                });
            } else {
                // Register scroll event handler for mobile devices use-case
                setTimeout(function () {
                    var that = this;
                    this.oCatalogTilesPage = sap.ui.getCore().byId("catalogTilesPage");
                    this.oScroller = this.oCatalogTilesPage.getScrollDelegate();

                    if (this.oScroller && this.oScroller._scroller) {
                        // Keep the original onScrollMove event
                        if (!this.oOriginalScrollMove) {
                            this.oOriginalScrollMove = this.oScroller._scroller.options.onScrollMove;
                        }
                        // Set a new event handler for onScrollMove
                        this.oScroller._scroller.options.onScrollMove = function (oEvent) {

                            // Calling the original onScrollMove event
                            that.oOriginalScrollMove.apply(that.oScroller);
                            //call the paging
                            var currentPos = that.oScroller.getScrollTop(),
                                max = that.oScroller.getMaxScrollTop();

                            if (max - currentPos <= 30 + that.PagingManager.getTileHeight()) {
                                that.allocateNextPage();
                            }
                        };
                    } else {
                        jQuery("#catalogTilesPage-cont").scroll(function (event) {
                            var oPage = sap.ui.getCore().byId('catalogTilesPage'),
                                scroll = oPage.getScrollDelegate(),
                                currentPos = scroll.getScrollTop(),
                                max = scroll.getMaxScrollTop();
                            //call the paging
                            if (max - currentPos <= 30 + that.PagingManager.getTileHeight()) {
                                that.allocateNextPage();
                            }
                        });
                    }
                }.bind(this), 1500);
            }
        },

        onShow: function (sChannelId, sEventId, oData) {
            //if the user goes to the catalog directly (not via the dashboard) 
            //we must close the loading dialog
            var oLoadingDialog = sap.ui.getCore().byId('loadingDialog');
            oLoadingDialog.close();

            // reset active tiles
            var oModel = sap.ui.getCore().byId("navContainer").getModel(),
                aCatalogTiles = oModel.getProperty("/catalogTiles") || [],
                oDataParam = oData.params,
                sPath = (oDataParam && oDataParam.targetGroup && oDataParam.targetGroup.length && oDataParam.targetGroup[0]) || "/groups/0",
                i;
            oData.groupContext = oModel.getContext(sPath);
            $.extend(this.getView().getViewData(), oData);

            if (this.PagingManager) {
                this.resetPageFilter();
            }
            this.categoryFilter = (oDataParam && oDataParam.catalogSelector && oDataParam.catalogSelector.length && oDataParam.catalogSelector[0]) || null;
            this.searchFilter = (oDataParam && oDataParam.tileFilter && oDataParam.tileFilter.length && oDataParam.tileFilter[0]) || "";

            oModel.setProperty("/showCatalogHeaders", true);
            oModel.setProperty("/catalogSearchFilter", this.searchFilter);

            for (i = 0; i < aCatalogTiles.length; i = i + 1) {
                aCatalogTiles[i].active = false;
            }

            if (this.categoryFilter || this.searchFilter) {
                // selected category does not work with data binding
                // we need to rerender it manually and then set the selection
                // see function onBeforeSelectRendering
                sap.ui.getCore().byId("catalogSelect").rerender();
            } else {
                //display all
                sap.ui.getCore().byId("catalogSelect").setSelectedItemId("");
            }

            this.oRenderingFilter = new sap.ui.model.Filter('', 'EQ', 'a');
            this.oRenderingFilter.fnTest = function (val) {
                if (val.catalogIndex < this.lastCatalogId) {
                    return true;
                }

                if (this.allocateTiles > 0) {
                    this.lastCatalogId = val.catalogIndex;
                    this.allocateTiles--;
                    return true;
                }

                return false;
            }.bind(this);

            if (this.PagingManager) {
                this.applyTileFilters();
            }
        },
        resetPageFilter : function () {
            this.lastCatalogId = 0;
            this.allocateTiles = this.PagingManager.getNumberOfAllocatedElements();
        },
        allocateNextPage : function () {
            //calculate the number of tiles in the page.
            this.PagingManager.moveToNextPage();
            this.allocateTiles = this.PagingManager._calcElementsPerPage();
            this.applyTileFilters();
        },

        onBeforeSelectRendering : function () {
            var oSelect = sap.ui.getCore().byId("catalogSelect"),
                aItems = jQuery.grep(oSelect.getItems(), jQuery.proxy(function (oItem) {
                    return oItem.getBindingContext().getObject().id === this.categoryFilter;
                }, this));

            if (!aItems.length) {
                aItems.push(oSelect.getItemAt(0));
            }

            if (aItems[0] && oSelect.getSelectedItemId() !== aItems[0].getId()) {
                window.setTimeout($.proxy(oSelect.setSelectedItem, oSelect, aItems[0].getId()), 500);
            }
        },

        setCategoryFilter : function (aFilter) {
            sap.ushell.renderers.fiori2.Navigation.openCatalogByHash({
                groupContext : this.getView().getViewData().groupContext,
                categoryFilter : aFilter,
                searchFilter : this.searchFilter
            }, false);
        },

        setSearchFilter : function (aFilter) {
            sap.ushell.renderers.fiori2.Navigation.openCatalogByHash({
                groupContext : this.getView().getViewData().groupContext,
                categoryFilter : this.categoryFilter,
                searchFilter : aFilter
            }, false);
        },

        applyTileFilters : function () {
            var aFilters = [],
                oSearchFilter,
                oCategoryFilter;
            if (this.searchFilter) {
                oSearchFilter = new sap.ui.model.Filter($.map(this.searchFilter.split(/[\s,]+/), function (v) {
                    return (v && new sap.ui.model.Filter("keywords", sap.ui.model.FilterOperator.Contains, v)) ||
                        (v && new sap.ui.model.Filter("title", sap.ui.model.FilterOperator.Contains, v))|| undefined;
                }), true);
                aFilters.push(oSearchFilter);
            }
            if (this.categoryFilter) {
                oCategoryFilter = new sap.ui.model.Filter("catalogId", sap.ui.model.FilterOperator.EQ, this.categoryFilter);
                aFilters.push(oCategoryFilter);
            }
            //Anyway we would like to filter out tiles which are not supported on current device
            aFilters.push(new sap.ui.model.Filter("isTileIntentSupported", sap.ui.model.FilterOperator.EQ, true));

            //Adding the page filter.
            if (this.oRenderingFilter) {
                aFilters.push(this.oRenderingFilter);
            }

            sap.ui.getCore().byId("catalogTiles").getBinding("tiles").filter(aFilters);
        },

        onLiveFilter : function (oEvent) {
            var sQuery = oEvent.getParameter("newValue");
            if (sQuery) {
                this.setSearchFilter(sQuery);
            } else {
                this.setSearchFilter();
            }
        },

        onCategoryFilter : function (oEvent) {
            var oSource = oEvent.getParameter("selectedItem"),
                oSourceContext = oSource.getBindingContext(),
                oModel = oSourceContext.getModel();
            if (oModel.getProperty("static", oSourceContext)) { // show all categories
                oModel.setProperty("/showCatalogHeaders", true);
                this.setCategoryFilter();
                this.selectedCategory = undefined;
            } else { // filter to category
                oModel.setProperty("/showCatalogHeaders", false);
                this.setCategoryFilter(oSource.getBindingContext().getObject().id);
                this.selectedCategory = oSource.getId();
            }
        },

        onTileAfterRendering : function (oEvent) {
            var footItem = oEvent.getSource().getFootItems()[0];
            if (footItem !== undefined) {
                if (footItem.getIcon() == "sap-icon://add") {
                    footItem.addStyleClass("sapUshellCatalogPlusIcon");
                } else {
                    footItem.addStyleClass("sapUshellCatalogVIcon");
                }
            }
        },

        /**
         * Event handler triggered if tile should be added to the default group.
         *
         * @param {sap.ui.base.Event} oEvent
         *     the event object. It is expected that the binding context of the event source points to the tile to add.
         */
        onTileFooterClick : function (oEvent) {
            var oSource = oEvent.getSource(),
                oSourceContext = oSource.getBindingContext(),
                that = this,
                ourModel,
                oOkBtn,
                oCancelBtn,
                oHBox,
                oPopover,
                placement,
                clickedObject = oEvent.oSource,
                clickedObjectDomRef = clickedObject.getDomRef(),
                oNewGroupNameInput,
                popoverData = this.createPopoverData(oEvent),
                popoverDataSectionHeight = 192,
                shellView = sap.ui.getCore().byId("mainShell"),
                dashboardMgr = shellView.oDashboardManager,
                oList = new sap.m.List({
                    mode : sap.m.ListMode.MultiSelect
                }),
                oListItemTemplate = new sap.m.DisplayListItem({
                    label : "{title}",
                    selected : "{selected}",
                    tooltip: "{title}"
                });

            var hideGroupsFilter = null; //Add filter only if the feature is enabled.
            if(this.getView().getModel().getProperty('/enableHideGroups'))
            {
                hideGroupsFilter = [new sap.ui.model.Filter("isGroupVisible", sap.ui.model.FilterOperator.EQ, true)];
            }
            oList.bindItems("/", oListItemTemplate, null, hideGroupsFilter);
            ourModel = new sap.ui.model.json.JSONModel(popoverData.userGroupList);
            oList.setModel(ourModel);

            oList.addEventDelegate({
                onsapup: function(oEvent){
                    try {
                        oEvent.preventDefault();

                        if (sap.ui.getCore().byId('shell').getModel().getData().groups.length) {
                            var currentFocusGroup = jQuery(":focus");
                            if (currentFocusGroup.index() == 0){   //first group in the list
                                var jqNewGroupItem = jQuery("#newGroupItem");
                                jqNewGroupItem.focus();
                                oEvent._bIsStopHandlers = true;
                            }
                        }
                    } catch (e) {
                    }
                }
            });

            //new group Input
            oNewGroupNameInput = new sap.m.Input({
                id : "newGroupNameInput",
                type : "Text",
                placeholder : sap.ushell.resources.i18n.getText("newGroupPlaceholder")
            });

            // new group panel - back button
            var oBackButton = new sap.m.Button({
                icon: sap.ui.core.IconPool.getIconURI("nav-back"),
                press : function (oEvent) {
                    oPopover.removeAllContent();

                    if (!sap.ui.Device.system.phone) {
                        oPopover.setContentHeight(popoverDataSectionHeight + "px");
                    } else {
                        oPopover.setContentHeight("100%");
                    }

                    oPopover.setVerticalScrolling(true);

                    oPopover.addContent(popoverContainer);
                    oPopover.setTitle(sap.ushell.resources.i18n.getText("addTileToGroups_popoverTitle"));
                    oPopover.setCustomHeader();

                    oNewGroupNameInput.enabled = false;
                    oNewGroupNameInput.setValue('');
                },
                tooltip : sap.ushell.resources.i18n.getText("newGroupGoBackBtn_tooltip")
            });
            oBackButton.addStyleClass("catalogNewGroupBackButton");

            // new group panel's label
            var oNewGroupLabel = new sap.m.Label({
                    text : sap.ushell.resources.i18n.getText("newGroup_popoverTitle")
                }),

            // new group panel's header
                oHeadBar = new sap.m.Bar({
                    contentLeft : [oBackButton],
                    contentMiddle : [oNewGroupLabel]
                }),

                // popover container Item - "New Group"
                newGroupItem = new sap.m.StandardListItem({
                    id : "newGroupItem",
                    title : sap.ushell.resources.i18n.getText("newGroup_listItemText"),
                    type : "Navigation",
                    press : function () {
                        that._navigateToCreateNewGroupPanel(oPopover, oNewGroupNameInput, oHeadBar);
                    }
                }),

                oNewGroupItemList = new sap.m.List({});

            oNewGroupItemList.addItem(newGroupItem);
            oNewGroupItemList.addEventDelegate({
                onsapdown: function(oEvent){
                    try {
                        oEvent.preventDefault();
                        oEvent._bIsStopHandlers = true;
                        if (sap.ui.getCore().byId('shell').getModel().getData().groups.length) {
                            var jqFirstGroupListItem = jQuery("#popoverContainer .sapMListModeMultiSelect li").first();
                            jqFirstGroupListItem.focus();
                        }
                    } catch (e) {
                    }
                },
                onsaptabnext: function(oEvent){
                    try {
                        oEvent.preventDefault();
                        oEvent._bIsStopHandlers = true;
                        var jqOkButton = jQuery("#okButton");
                        jqOkButton.focus();
                    } catch (e) {
                    }
                }
            });

            var popoverContainer = this._setPopoverContainer(oNewGroupItemList, oList, popoverDataSectionHeight);

            if (document.body.clientHeight - clickedObjectDomRef.getBoundingClientRect().bottom >= 310) {
                placement = "Bottom";
            } else {
                placement = "Auto";
            }

            oPopover = new sap.m.ResponsivePopover({
                id : "groupsPopover",
                placement : placement,
                content : [popoverContainer],
                enableScrolling : true,
                title: sap.ushell.resources.i18n.getText("addTileToGroups_popoverTitle"),
                contentWidth: '20rem',
                afterClose: function () {
                    oPopover.destroy();
                    oNewGroupNameInput.destroy();
                    newGroupItem.destroy();
                    oOkBtn.destroy();
                    oCancelBtn.destroy();
                    popoverContainer.destroy();
                }
            });

            if (!sap.ui.Device.system.phone) {
                oPopover.setContentHeight(popoverDataSectionHeight + "px");
            } else {
                oPopover.setContentHeight("100%");
            }

            oOkBtn = this.createOkButton(oSourceContext, ourModel, popoverData, that, oPopover, oNewGroupNameInput, oHeadBar);
            oOkBtn.addEventDelegate({
                onsaptabprevious: function(oEvent){
                    try {
                        oEvent.preventDefault();
                        oEvent._bIsStopHandlers = true;
                        var jqNewGroupItem = jQuery("#newGroupItem");
                        if (!jqNewGroupItem.length){
                            jqNewGroupItem = jQuery("#newGroupNameInput input");
                        }
                        jqNewGroupItem.focus();
                    } catch (e) {
                    }
                }
            });

            oCancelBtn = new sap.m.Button({
                id : "cancelButton",
                press : function (oEvent) {
                    oEvent.preventDefault();
                    oEvent._bIsStopHandlers = true;
                    oPopover.close();
                },
                text : sap.ushell.resources.i18n.getText("cancelBtn")
            });

            oPopover.setBeginButton(oOkBtn);
            oPopover.setEndButton(oCancelBtn);
            oPopover.setInitialFocus('newGroupItem');
            oPopover.openBy(clickedObject);
        },

        _navigateToCreateNewGroupPanel : function (oPopover, oNewGroupNameInput, oHeadBar) {

            oPopover.removeAllContent();
            oPopover.addContent(oNewGroupNameInput.addStyleClass("catalogNewGroupInput"));
            oPopover.setCustomHeader(oHeadBar);
            oPopover.setContentHeight("");
            oNewGroupNameInput.setValueState(sap.ui.core.ValueState.None);
            oNewGroupNameInput.setPlaceholder(sap.ushell.resources.i18n.getText("newGroupPlaceholder"));
            oNewGroupNameInput.enabled = true;
            oNewGroupNameInput.focus();
        },

        createOkButton : function (oSourceContext, ourModel, popoverData, generalContext, oPopover, oNewGroupNameInput, oHeadBar) {
            var oOkBtn = new sap.m.Button({
                id : "okButton",
                press : function ( oEvent ) {

                    oEvent.preventDefault();
                    oEvent._bIsStopHandlers = true;

                    var selectedGroupsIDsArray = [],
                        deselectedGroupsIDsArray = [],
                        groupsIdTitleMap = {},
                        srvc = sap.ushell.Container.getService("LaunchPage"),
                        detailedMessage,
                        index,
                        tempGroup,
                        groupCtx,
                        realGroupID,
                        numberOfAddedGroups = 0,
                        numberOfRemovedGroups = 0,
                        firstAddedGroupTitle,
                        firstRemovedGroupTitle,
                        tileCataogId = oSourceContext.getModel().getProperty(oSourceContext.getPath()).id,
                        oEventBus = sap.ui.getCore().getEventBus(),
                        newGroupName,
                        groupNameFromInput = oNewGroupNameInput.getValue().trim(),
                        emptyGroupName = sap.ushell.resources.i18n.getText("newGroup_listItemText"),
                        promises = [],
                        that = this;

                    for (index = 0; index < popoverData.userGroupList.length; index = index + 1) {
                        tempGroup = this.oData[index];
                        realGroupID = srvc.getGroupId(tempGroup.object);

                        // Add the real group Id and title to the map  
                        // in order to support the detailed message that follows the user gourp selection    
                        groupsIdTitleMap[realGroupID] = tempGroup.title;

                        if (tempGroup.selected) {
                            selectedGroupsIDsArray.push(realGroupID);
                            //var groupIndex = dashboardMgr.getIndexOfGroup();
                            groupCtx = new sap.ui.model.Context(oSourceContext.getModel(), "/groups/" + index);
                            if (!ourModel.oData[index].initiallySelected) {
                                promises.push(generalContext._addTile(oSourceContext, groupCtx));
                                ourModel.oData[index].initiallySelected = true;
                                numberOfAddedGroups = numberOfAddedGroups + 1;
                                if (numberOfAddedGroups == 1) {
                                    firstAddedGroupTitle = tempGroup.title;
                                }
                            }
                        } else if ( (!tempGroup.selected) && (ourModel.oData[index].initiallySelected) ) {
                            promises.push(generalContext._removeTile(tileCataogId, index));
                            ourModel.oData[index].initiallySelected = false;
                            numberOfRemovedGroups = numberOfRemovedGroups + 1;
                            if (numberOfRemovedGroups == 1) {
                                firstRemovedGroupTitle = tempGroup.title;
                            }
                        }
                    }

                    // we are in the new group creation panel
                    if (oNewGroupNameInput.enabled) {
                        if (groupNameFromInput.length > 0) {
                            newGroupName = groupNameFromInput;
                        } else {
                            newGroupName = emptyGroupName;
                        }

                        promises.push(generalContext._createGroupAndSaveTile(oSourceContext, newGroupName));
                        numberOfAddedGroups++;
                        firstAddedGroupTitle = newGroupName;
                    }



                    jQuery.when.apply(jQuery, promises).then(
                        function(){
                            if (!(numberOfAddedGroups == 0 && numberOfRemovedGroups == 0)) {

                                var isOperationFailed = false,
                                    isNewGroupAdded = false,
                                    aErrorIndexes= [];

                                for (index = 0; index < arguments.length && (!isOperationFailed || !isNewGroupAdded); index++) {
                                    // check if tile was added to the new group successfully
                                    if (arguments[index].action == "addTileToNewGroup" && arguments[index].status == 1){
                                        var tempGroup = that.oData[that.oData.length - 1],
                                            srvc = sap.ushell.Container.getService("LaunchPage"),
                                            realGroupID = srvc.getGroupId(tempGroup.object);
                                        selectedGroupsIDsArray.push(realGroupID);
                                        isNewGroupAdded = true;
                                    }
                                    // Check if the operation failed
                                    //  The Data (i.e. arguments[index]) for each operation includes: 
                                    //   - group: The relevant group object 
                                    //   - status: A boolean value stating if the operation succeeded of failed
                                    //   - action: A String with the value 'add' or 'remove' or 'createNewGroup'
                                    if ( !arguments[index].status ) {
                                        isOperationFailed = true;
                                        aErrorIndexes.push(arguments[index]);
                                    }
                                }
                                if (isOperationFailed){
                                    var shellView = sap.ui.getCore().byId("mainShell"),
                                    	oErrorMessageObj = generalContext.prepareErrorMessage(aErrorIndexes, popoverData.tileTitle),
                                        dashboardMgr = shellView.oDashboardManager;
                                        dashboardMgr._resetGroupsOnFailure(oErrorMessageObj.messageId, oErrorMessageObj.parameters);

                                } else {
                                    // Update the model with the changes
                                    oSourceContext.getModel().setProperty("/catalogTiles/" + popoverData.tileIndex + "/associatedGroups", selectedGroupsIDsArray);

                                    // Get the detailed message
                                    detailedMessage = generalContext.prepareDetailedMessage(popoverData.tileTitle, numberOfAddedGroups, numberOfRemovedGroups, firstAddedGroupTitle, firstRemovedGroupTitle);

                                    sap.m.MessageToast.show( detailedMessage, {
                                        duration: 3000,// default
                                        width: "15em",
                                        my: "center bottom",
                                        at: "center bottom",
                                        of: window,
                                        offset: "0 -50",
                                        collision: "fit fit"
                                    });
                                }
                            }
                        });


                    oPopover.close();

                }.bind(ourModel),
                text : sap.ushell.resources.i18n.getText("okBtn")
            });
            return oOkBtn;
        },
        
        prepareErrorMessage : function (aErroneousActions, sTileTitle) {
        	var oGroup,
        		sAction,
        		sFirstErroneousAddGroup,
        		sFirstErroneousRemoveGroup,
        		iNumberOfFailAddActions = 0,
        		iNumberOfFailDeleteActions = 0,
        		bCreateNewGroupFailed = false,
        		message;

        	for(var index in aErroneousActions) {
        		
        		// Get the data of the error (i.e. action name and group object)

        		oGroup = aErroneousActions[index].group;
        		sAction = aErroneousActions[index].action;
        		
        		if(sAction == 'add') {
        			iNumberOfFailAddActions++;
        			if(iNumberOfFailAddActions == 1) {
        				sFirstErroneousAddGroup = oGroup.title;
        			}
        		} else if (sAction == 'remove') {
        			iNumberOfFailDeleteActions++;
        			if(iNumberOfFailDeleteActions == 1) {
        				sFirstErroneousRemoveGroup = oGroup.title;
        			}
        		} else if (sAction == 'addTileToNewGroup') {
                    iNumberOfFailAddActions++;
                    if(iNumberOfFailAddActions == 1) {
                        sFirstErroneousAddGroup = oGroup.title;
                    }
                }  else {
                    bCreateNewGroupFailed = true;
                }
        	}

        	// First - Handle bCreateNewGroupFailed 
        	if(bCreateNewGroupFailed) {
              	if (aErroneousActions.length == 1) {
              		message = sap.ushell.resources.i18n.getText({messageId: "fail_tile_operation_create_new_group"});
              	} else {
              		message = sap.ushell.resources.i18n.getText({messageId: "fail_tile_operation_some_actions"});
              	} 
            // Single error - it can be either one add action or one remove action
        	} else if (aErroneousActions.length == 1) { 
        		if (iNumberOfFailAddActions) {
        			message = sap.ushell.resources.i18n.getText({messageId: "fail_tile_operation_add_to_group", parameters: [sTileTitle, sFirstErroneousAddGroup]});
        		} else {
        			message = sap.ushell.resources.i18n.getText({messageId: "fail_tile_operation_remove_from_group", parameters: [sTileTitle, sFirstErroneousRemoveGroup]});
        		}
        	// 	Many errors (iErrorCount > 1) - it can be several remove actions, or several add actions, or a mix of both
        	} else {
        		if (iNumberOfFailDeleteActions == 0) {
                    message = sap.ushell.resources.i18n.getText({messageId: "fail_tile_operation_add_to_several_groups", parameters: [sTileTitle]});
        		} else if (iNumberOfFailAddActions == 0) {
                    message = sap.ushell.resources.i18n.getText({messageId: "fail_tile_operation_remove_from_several_groups", parameters: [sTileTitle]});
        		} else {
              		message = sap.ushell.resources.i18n.getText({messageId: "fail_tile_operation_some_actions"});
        		}
        	}
            return message;
        }, 
        
        prepareDetailedMessage : function (tileTitle, numberOfAddedGroups, numberOfRemovedGroups, firstAddedGroupTitle, firstRemovedGroupTitle) {
            var message;

            if (numberOfAddedGroups == 0) {
                if (numberOfRemovedGroups == 1) {
                    message = sap.ushell.resources.i18n.getText("tileRemovedFromSingleGroup", [tileTitle, firstRemovedGroupTitle]);
                } else if (numberOfRemovedGroups > 1) {
                    message = sap.ushell.resources.i18n.getText("tileRemovedFromSeveralGroups", [tileTitle, numberOfRemovedGroups]);
                }
            } else if (numberOfAddedGroups == 1) {
                if (numberOfRemovedGroups == 0) {
                    message = sap.ushell.resources.i18n.getText("tileAddedToSingleGroup", [tileTitle, firstAddedGroupTitle]);
                } else if (numberOfRemovedGroups == 1) {
                    message = sap.ushell.resources.i18n.getText("tileAddedToSingleGroupAndRemovedFromSingleGroup", [tileTitle, firstAddedGroupTitle, firstRemovedGroupTitle]);
                } else if (numberOfRemovedGroups > 1) {
                    message = sap.ushell.resources.i18n.getText("tileAddedToSingleGroupAndRemovedFromSeveralGroups", [tileTitle, firstAddedGroupTitle, numberOfRemovedGroups]);
                }
            } else if (numberOfAddedGroups > 1) {
                if (numberOfRemovedGroups == 0) {
                    message = sap.ushell.resources.i18n.getText("tileAddedToSeveralGroups", [tileTitle, numberOfAddedGroups]);
                } else if (numberOfRemovedGroups == 1) {
                    message = sap.ushell.resources.i18n.getText("tileAddedToSeveralGroupsAndRemovedFromSingleGroup", [tileTitle, numberOfAddedGroups, firstRemovedGroupTitle]);
                } else if (numberOfRemovedGroups > 1) {
                    message = sap.ushell.resources.i18n.getText("tileAddedToSeveralGroupsAndRemovedFromSeveralGroups", [tileTitle, numberOfAddedGroups, numberOfRemovedGroups]);
                }
            }
            return message;
        },

        /**
         * Returns an object that contains:
         *  - An array of user groups, each one contains a "selected" property
         *  - An array ID's of the groups that contain the relevant Tile
         *
         * @param {sap.ui.base.Event} oEvent
         */
        createPopoverData : function (oEvent) {
            var oSource = oEvent.getSource(),
                oSourceContext = oSource.getBindingContext(),
                srvc = sap.ushell.Container.getService("LaunchPage"),
                index,
                model,
                path,
                tileTitle,
                realGroupID,

                // The popover basically contains an entry for each user group
                userGroupList = oSourceContext.getModel().getProperty("/groups"),

                // the relevant Catalog Tile form the model: e.g. /catalogTiles/5
                catalogTile = this.getCatalogTileDataFromModel(oSourceContext),

                // e.g. /catalogTiles/5/associatedGroups
                tileGroups = catalogTile.tileData.associatedGroups,

                // g.e. 5
                 tileIndex = catalogTile.tileIndex;

            // In order to decide which groups (in the popover) will be initially selected: 
            for (index = 0; index < userGroupList.length; index = index + 1) {

                // Get the group's real ID
                realGroupID = srvc.getGroupId(userGroupList[index].object);

                // Check if the group (i.e. real group ID) exists in the array of groups that contain the relevant Tile
                // if so - the check box that re[resents this group should be initially selected 
                userGroupList[index].selected = !($.inArray(realGroupID, tileGroups) == -1);

                // In order to know if the group was selected before user action    
                userGroupList[index].initiallySelected = userGroupList[index].selected;
            }
            path = oSourceContext.getPath(0);
            model = oSourceContext.getModel();
            tileTitle = model.getProperty(path).title;

            return {userGroupList : userGroupList, catalogTile : catalogTile, tileTitle : tileTitle, tileIndex : tileIndex};
        },

        /**
         * Returns the part of the model that contains the IDs of the groups that contain the relevant Tile
         *
         * @param {} oSourceContext
         *     model context
         */
        getCatalogTileDataFromModel : function (oSourceContext) {
            var tilePath = oSourceContext.sPath,
                tilePathPartsArray = tilePath.split("/"),
                tileIndex = tilePathPartsArray[tilePathPartsArray.length - 1];

            // Return an object containing the Tile in the CatalogTiles Array (in the model) and its index
            return {tileData : oSourceContext.getModel().getProperty("/catalogTiles/" + tileIndex), tileIndex : tileIndex};
        },

        /**
         * Event handler triggered if tile should be added to a specified group.
         *
         * @param {sap.ui.base.Event} oEvent
         *     the event object. It is expected that the binding context of the event source points to the group. Also,
         *     the event must contain a "control" parameter whose binding context points to the tile.
         */
        onAddTile : function (oEvent) {
            var oSourceContext = oEvent.getParameter("control").getBindingContext();
            if (!oSourceContext.getProperty("active")) {
                this._addTile(oSourceContext, oEvent.getSource().getBindingContext());
            }
        },

        onNavButtonPress : function (oEvent) {
            var oNavContainer = sap.ui.getCore().byId("navContainer");
            if (location.hash === '' || location.hash === '#') {
                oNavContainer.to("dashboardPage");
            } else {
                location.hash = '';
            }
        },

        /**
         * Send request to add a tile to a group. Request is triggered asynchronously, so UI is not blocked.
         *
         * @param {sap.ui.model.Context} oTileContext
         *     the catalog tile to add
         * @param {sap.ui.model.Context} oGroupContext
         *     the group where the tile should be added
         * @private
         */
        _addTile : function (oTileContext, oGroupContext) {
            var shellView = sap.ui.getCore().byId("mainShell"),
                dashboardMgr = shellView.oDashboardManager,
                deferred = jQuery.Deferred(),
                promise = dashboardMgr._createTile({
                catalogTileContext : oTileContext,
                groupContext: oGroupContext
            });

            promise.done(function(data){
                deferred.resolve(data);
            });

            return deferred;
        },

        /**
         * Send request to delete a tile from a group. Request is triggered asynchronously, so UI is not blocked.
         *
         * @param tileCatalogId
         *     the id of the tile
         * @param index
         *     the index of the group in the model
         * @private
         */
        _removeTile : function (tileCatalogId, index) {
            var shellView = sap.ui.getCore().byId("mainShell"),
                dashboardMgr = shellView.oDashboardManager,
                deferred = jQuery.Deferred(),
                promise = dashboardMgr._deleteCatalogTileFromGroup({
                    tileId : tileCatalogId,
                    groupIndex : index
                });
            
            // The function _deleteCatalogTileFromGroup always results in deferred.resolve 
            // and the actual result of the action (success/failure) is contained in the data object   
            promise.done(function(data){
                deferred.resolve(data);
            });

            return deferred;
        },

        /**
         * Send request to create a new group and add a tile to this group. Request is triggered asynchronously, so UI is not blocked.
         *
         * @param {sap.ui.model.Context} oTileContext
         *     the catalog tile to add
         * @param newGroupName
         *     the name of the new group where the tile should be added
         * @private
         */
        _createGroupAndSaveTile : function (oTileContext, newGroupName) {
            var shellView = sap.ui.getCore().byId("mainShell"),
                dashboardMgr = shellView.oDashboardManager,
                deferred = jQuery.Deferred(),
                promise = dashboardMgr._createGroupAndSaveTile({
                    catalogTileContext : oTileContext,
                    newGroupName: newGroupName
                });

            promise.done(function(data){
                deferred.resolve(data);
            });

            return deferred;
        },

        _setPopoverContainer : function (oNewGroupItemList, oList, popoverDataSectionHeight) {
            var popoverContainerId = "popoverContainer",
                popoverContainer = new sap.m.ScrollContainer({
                    id: popoverContainerId,
                    horizontal : false,
                    vertical : true
                });

            if (!sap.ui.Device.system.phone) {
                popoverContainer.setHeight((popoverDataSectionHeight - 2) + "px");
            } else {
                popoverContainer.setHeight("100%");
            }

            popoverContainer.addContent(oNewGroupItemList);
            popoverContainer.addContent(oList);

            return popoverContainer;
        }
    });
}());
