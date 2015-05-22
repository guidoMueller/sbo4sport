// Copyright (c) 2013 SAP AG, All Rights Reserved

(function () {
    "use strict";
    /*global jQuery, sap, console, window, $ */
    /*jslint plusplus: true, nomen: true*/

    sap.ui.controller("sap.ushell.renderers.fiori2.launchpad.group_list.GroupList", {
        onInit : function () {
            // #groupList
            this.sViewId = "#" + this.getView().getId();
            // #__list4
            this.sGroupListId = "#" + this.getView().oGroupList.getId();

            jQuery(".sapUshellGroupList").data("dropGroup", null);

            //Internal counter for over and out events thrown by GroupListItems
            //This is needed because of a jQuery bug that throws over and out events in the wrong order
            this.iOutEventCounter = 0;
            this.iOverEventCounter = 0;
            //Internal flag to detect "real" GroupListOut-events
            this.iOutEventFlag = false;
            this.oDashboard = document.getElementById('dashboard');
            this.handleMobileScroll = this._fHandleMobileScroll.bind(this);
        },
        onAfterRendering : function () {
            this.jqView = jQuery(this.sViewId);
            this.jgGroupList = jQuery(this.sGroupListId);

            var oEventBus = sap.ui.getCore().getEventBus();
            oEventBus.unsubscribe("grouplist", "ScrollAnimationEnd", this._handleScrollAnimationEnd, this);
            oEventBus.subscribe("grouplist", "ScrollAnimationEnd", this._handleScrollAnimationEnd, this);

            // The delete area is moved out of the scrollable area            
            jQuery("#__area1").appendTo("#shellPage");

            // Use a resize-handler to fix the size of input-fields (necessary for ie).
            if (sap.ui.Device.browser.internet_explorer){
                this._bindResizeHandler();
            }

            var oDashboardPageContent = jQuery("#dashboardPage-cont"),
            that = this;
            if (sap.ui.Device.system.desktop) {
	            var timer;
				oDashboardPageContent.unbind('scroll');
	            oDashboardPageContent.scroll(function () {
	                //call fHandleScroll only when the scrolling in the dashboard has finished to avoid // highlighting wrong groups on selection.
	                clearTimeout(timer);
	                timer = setTimeout(function () {
	                    var nScrollTop = jQuery("#dashboardPage-cont").scrollTop();
	                    that._fHandleScroll(nScrollTop);
	                }, 300);
	            });
	        }
            else {
                this.oDashboard.addEventListener('scroll',that.handleMobileScroll);
            }
        },
        onGroupTitleChange : function (oEvent) {
            this._publishAsync("launchpad", "changeGroupTitle", {
                groupId : oEvent.getSource().getGroupId(),
                newTitle : oEvent.getParameter("newTitle")
            });
            oEvent.getSource().addStyleClass('sapUshellOver');
        },
        makeSortable : function () {
            this.jgGroupList = jQuery(this.sGroupListId);
            this._sortable();
        },
        _getJqAllListItems : function () {
            this.jqView = jQuery(this.sViewId);
            return this.jqView.find(".sapUshellGroupListItem");
        },
        _getJqGroupListItems : function () {
            this.jgGroupList = jQuery(this.sGroupListId);
            return this.jgGroupList.find(".sapUshellGroupListItem");
        },

        _getGroupTopOffset : function (oGroup) {
            var iGroupTopOffset = 0,
                oDashboardPage = sap.ui.getCore().byId("groupListPage");

            iGroupTopOffset += oGroup.parent().parent().position().top;
            iGroupTopOffset += oGroup.position().top;
            iGroupTopOffset -= oGroup.parent().parent().parent().position().top;

            return iGroupTopOffset;
        },
     
        _sortable : function () {
            var that = this,
              //  jqParentGroupListPage = jQuery("#groupListPage").parent();
              jqParentGroupListPage = jQuery("#shell-container");

            that.bActive = false;

            this.jgGroupList.find(".sapMListUl").sortable({
                containment: jqParentGroupListPage,
                items: '>:not(.sapUshellDefaultGroupItem)',
                placeholder: "sapUshellGroupLI-placeholder",
                helper: function (event, element) {
                    var clone = element.clone(),
                        jqGroupListItem = jQuery(".sapUshellGroupListItem");
                    clone.addClass("sapUshellSortableHelperClone");
                    clone.addClass("sapUshellClonedGrouplistItem");
                    clone.removeClass("li");
                    clone.css("font-size", element.css("font-size"));
                    clone.css("width", jqGroupListItem.first().parent().width());
                    clone.css("height", jqGroupListItem.first().height() + parseInt(jqGroupListItem.first().css("border-bottom-width")));

                    clone.hide();
                    window.setTimeout(function () {
                        clone.appendTo('body');
                        clone.show();
                    }, 1);

                    return clone;
                },
                revert: jQuery.proxy(this._handleSortableRevert, this),
                start: jQuery.proxy(this._handleSortableStart, this),
                stop: jQuery.proxy(this._handleSortableStop, this),
                change: jQuery.proxy(this._handleSortableChange, this)
            });

            if (!sap.ui.Device.system.desktop) {
                this.jgGroupList.find(".sapMListUl").sortable('disable');
            }
        },

        _bindGroupListItemEvents : function(oEvent) {
            var oGroupListItem = oEvent.getSource();

            if (!sap.ui.Device.system.tablet) {
                return;
            }

            var that = this;

            jQuery.sap.byId(oGroupListItem.sId).bind("mousedown", function (event) {
                var _this = jQuery(this);

                if (that.bActive === false && !_this.hasClass("sapUshellDefaultGroupItem")) {
                    var _event = event;

                    jQuery(".sapUshellGroupItemList").find(".ui-sortable").sortable('disable');

                    clearTimeout(this.fdownTimer);
                    this.fdownTimer = setTimeout(function () {
                        that.bActive = true;
                        jQuery(_this).effect("shake", {
                            times: 1,
                            distance: 5,
                            complete: function () {
                                if( !that.bActive ) {
                                    return;
                                }
                                jQuery(".sapUshellGroupItemList").find(".ui-sortable").sortable('enable');

                                //deactivate scrolling during drag and drop on mobile devices
                                var oGroupListPage = sap.ui.getCore().byId("groupListPage"),
                                oScroller = oGroupListPage.getScrollDelegate();

                                if (oScroller && oScroller._scroller) {
                                	oScroller._scroller.disable();
                                }

                                _this.trigger(_event);
                            }
                        }, 50);
                    }, 150);
                }
            });

            jQuery.sap.byId(oGroupListItem.sId).bind("mouseup", function (event) {
                clearTimeout(this.fdownTimer);
                that.bActive = false;

                if (!sap.ui.Device.system.desktop) {
                    //activate scrolling after drag and drop on mobile devices
                    var oGroupListPage = sap.ui.getCore().byId("groupListPage"),
                    oScroller = oGroupListPage.getScrollDelegate();

                    if (oScroller && oScroller._scroller) {
                    	
                    	if(!oScroller._scroller.enabled) {
                        	oScroller._scroller.enable();
                        	//workaround to enable addGroup on iOS after enabling iScroll
                        	oScroller._scroller.scrollTo(oScroller._scroller.absStartX, oScroller._scroller.absStartY);
                    	}
                    	
                    }
                }
            });

            jQuery.sap.byId(oGroupListItem.sId).bind("mousemove", function (event) {
                clearTimeout(this.fdownTimer);
                that.bActive = false;
            });
        },

        _handleSortableRevert : function (event, ui) {
            //Return desired return duration
            return 250;
        },

        _handleSortableStart : function (event, ui) {
            var UI5groupList = this.getView().oGroupList;
            var UI5items =  UI5groupList.getItems();
            var that = this;
            this.sortableInfo = {
                jqGroupPage: jQuery(this.getView().getDomRef()),
                jqGroupList: jQuery(UI5groupList.getDomRef())
            }
            this.sortableInfo.jqCloneArea = this.sortableInfo.jqGroupPage.find(".sapUshellCloneArea");
            if (!this.sortableInfo.jqCloneArea.length) {
                this.sortableInfo.jqCloneArea = jQuery("<div id='cloneArea' class='sapUshellCloneArea'></div>").appendTo(this.sortableInfo.jqGroupList);
            }
            this.sortableInfo.jqGroupListItems = [];
            for (var i=0, length=UI5items.length; i<length; i++) {
                var item = UI5items[i].getDomRef();
                if (item.id == ui.item.id) continue;
                this.sortableInfo.jqGroupListItems.push(jQuery(item));
            }
            this.sortableInfo.jqFirstItem = this.sortableInfo.jqGroupListItems[0];
            this.sortableInfo.fontSize = this.sortableInfo.jqFirstItem.css("font-size");
            this.sortableInfo.width = this.sortableInfo.jqFirstItem.parent().width();
            this.sortableInfo.height = this.sortableInfo.jqFirstItem.height()+parseInt(this.sortableInfo.jqFirstItem.css("border-bottom-width"));

            sap.ui.getCore().getEventBus().publish("launchpad", "sortableStart");

            //Clone all existing groups
            //Iterate through all groups
            this.sortableInfo.cloneGroupsArr = [];
            for (var i=0, length=this.sortableInfo.jqGroupListItems.length; i<length; i++) {
                //Clone the current group (including style)
                var jqGroup = this.sortableInfo.jqGroupListItems[i];
                var jqClonedGroup = jqGroup.clone();
                //Position the clone inside the cloneArea
                var iGroupTopOffset = that._getGroupTopOffset(jqGroup);
                jqClonedGroup.addClass("sapUshellClonedGrouplistItem");
                //Save the clone and the current group (sapUshellDashboardGroupsContainerItem)
                jqGroup.data("clone", jqClonedGroup);
                //Set the new position
                jqClonedGroup.css("top", iGroupTopOffset + "px");
                //Fix some styling
                jqClonedGroup.css({"font-size": this.sortableInfo.fontSize, "width": this.sortableInfo.width, "height": this.sortableInfo.height});
                //Append the clone...
                that.sortableInfo.jqCloneArea.append(jqClonedGroup);
                jqGroup.css("visibility", "hidden");
                this.sortableInfo.cloneGroupsArr.push(jqClonedGroup);
            }

            //Get the clone that is under the current original tile and hide it...
            ui.item.startPos = ui.item.index();
            //show delete-area
            this.oView.oGrouplistDeleteArea.show();
        },

        _updateGroupSelection : function () {
            // Nothing to do if Grouplist is not shown.
            var oModel = this.getView().getModel();
            if(!oModel || !oModel.getProperty("/currentState/showPane")) {
                return;
            }

            //Check if something is currently being dragged or sorted (there is a helper in the dom)
            //If so, cancel this whole update action
            if (jQuery(".ui-sortable-helper").length > 0) {
                return;
            }
            if (sap.ui.Device.system.desktop){
                var nScrollTop = jQuery("#dashboardPage-cont").scrollTop();
            }
            else {
                var nScrollTop = this.oDashboard.scrollTop;
            }
            this._fHandleScroll(nScrollTop);
        },

        _fHandleMobileScroll : function () {
        	var nScrollTop = this.oDashboard.scrollTop;
            this._fHandleScroll(nScrollTop);
        },

        _fHandleScroll : function (nScrollTop) {
            var jqContainer = jQuery('#dashboardGroups').find('.sapUshellTileContainer'),
                oOffset = jQuery('#dashboardGroups').offset(),
                firstContainerOffset = oOffset && oOffset.top || 0,
                edgeMargin = oOffset && oOffset.top,
                animationTime = 1200,
                contentTop = [],
            	oModel = this.getView().getModel();
            	
            // In some weird corner cases, those may not be defined -> bail out.
            if(!jqContainer || !oOffset) {
                return;
            }

            jqContainer.each(function () {
                var nContainerTopPos = jQuery(this).parent().offset().top;
                contentTop.push([nContainerTopPos, nContainerTopPos + jQuery(this).parent().height()]);
            });

            if(!oModel.getProperty("/groupList-skipScrollToGroup")) {
                var winTop = nScrollTop + firstContainerOffset;
                jQuery.each(contentTop, function (i, currentPos) {
                    if (currentPos[0] <= winTop && winTop <= currentPos[1]) {
                        jQuery('#groupList .sapUshellDefaultGroupItem, #groupList .sapUshellGroupListItem')
                            .removeClass('sapUshellOver')
                            .eq(i).addClass('sapUshellOver');
                    }
                });
            }
            sap.ushell.utils.handleTilesVisibility();
        },
        
        _handleSortableStop : function (event, ui) {
            //Delete all clones
            for(var i= 0, length=this.sortableInfo.cloneGroupsArr.length; i<length; i++) {
                this.sortableInfo.cloneGroupsArr[i].remove();
            }

            //hide delete-area
            this.oView.oGrouplistDeleteArea.hide();
            var oGroupListItem = sap.ui.getCore().byId(ui.item[0].id),
                toIndex = ui.item.index();

            if (oGroupListItem) {
                if (!oGroupListItem.bDeletionFlag) {
                    this._handleGroupMove(event, ui);
                } else {
                    oGroupListItem.bDeletionFlag = false;
                }
            }

            //make sure all hidden item are visible again
            for(var i= 0, length=this.sortableInfo.jqGroupListItems.length; i<length; i++) {
                this.sortableInfo.jqGroupListItems[i].css("visibility", "");
            }

            //we need to cancel the sortable as changes to the model already position the item in the right order
            this.jgGroupList.find(".sapMListUl").sortable('cancel');

            if (!sap.ui.Device.system.desktop) {
                this.bActive = false;
                this.jgGroupList.find(".sapMListUl").sortable('disable');
            }

            //do not scroll in case of delete.
            if (event.scrollToGroup === undefined || event.scrollToGroup == true) {
                // Wait until dashboard is rerendered
                window.setTimeout(jQuery.proxy(function () {
                    //when the dashboard scrolls to the selected group, highlighting the selected group also happens by the "fHandleScroll" function
                    this._handleScrollToGroup(this.oView.oGroupList.getItems()[toIndex], true);
                }, this), 500);
            }
            delete this.sortableInfo;
            sap.ui.getCore().getEventBus().publish("launchpad", "sortableStop");
        },

        _handleDrop : function(event, ui) {
            var jqGroupListItem = jQuery(ui);
            //hide delete-area
            this.oView.oGrouplistDeleteArea.hide();
            //Update model
            var oGroupListItem = sap.ui.getCore().byId(jqGroupListItem.attr("id")),
                oGroupList = oGroupListItem.getParent(),
                wrappedItem,
                bRemovable,
                deleteArea = jQuery(".sapUshellDeleteArea_grouplist_functional"),
                oEventBus = sap.ui.getCore().getEventBus(),
                nNewIndex = jqGroupListItem.index();

            if (oGroupListItem) {
                if (deleteArea.data("groupOver") === true) {
                    bRemovable = oGroupListItem.getRemovable();
                    oEventBus.publish("launchpad", bRemovable ? "deleteGroup" : "resetGroup", {
                        groupId : oGroupListItem.getGroupId()
                    });

                    deleteArea.data("groupOver", false);
                }
                else {
                    jqGroupListItem.startPos = parseInt(jqGroupListItem.attr('startPos'));
                    oGroupList.removeItem(oGroupListItem, true);
                    oGroupList.insertItem(oGroupListItem, nNewIndex, true);
                    this.getView().getModel().setProperty("/groupList-skipScrollToGroup", true);
                    wrappedItem = {item : jqGroupListItem};
                    this._handleGroupMove(event, wrappedItem);
                    setTimeout(function() {oGroupListItem.firePress();}, 1);
                }
            }
        },

        _handleSortableChange : function (event, ui) {

            for(var i= 0, length=this.sortableInfo.jqGroupListItems.length; i<length; i++) {
                //Get the original tile and its clone
                var jqItem = this.sortableInfo.jqGroupListItems[i];
                var oClonedGroup = jqItem.data("clone");
                var iGroupTopOffset = this._getGroupTopOffset(jqItem);
                if (oClonedGroup) {
                    //Stop currently running animations
                    //Without this, animations would queue up
                    oClonedGroup.stop(true, false);

                    //Get the invisible tile that has snapped to the new
                    //location, get its position, and animate the visible
                    //clone to it

                    //Animate everything to their new locations
                    oClonedGroup.animate({
                        top: iGroupTopOffset + "px"
                    }, {
                        duration: 250
                    }, {
                        easing: "swing"
                    });
                }

            }
        },

        // Model Event Handlers
        _handleGroupCreate : function () {
            var focused = jQuery(':focus');
            if (focused) {
                focused.blur();
            }

            this._publishAsync("launchpad", "createGroup", {
                title : sap.ushell.resources.i18n.getText("new_group_name")
            });
        },

        _handleGroupListItemPress : function (oEvent) {
            var oSource = oEvent.getSource();
            //to support accessibility tab order we set focus in press in case edit mode is off
            var focus = oEvent.getParameter("action") === "sapenter"
            this._handleScrollToGroup(oSource, false, focus);
            this._updateGroupSelection();
           // }
        },

        _handleScrollToGroup : function (oGroupItem, groupChanged, focus) {
            if (!oGroupItem) {
                return;
            }
            var that = this;
            this.oDashboard.removeEventListener('scroll',that.handleMobileScroll);

            this._publishAsync("launchpad", "scrollToGroup", {
                group : oGroupItem,
                groupChanged : groupChanged,
                focus : focus
            });
        },

        _handleScrollAnimationEnd : function() {
            var that = this;
            this.oDashboard.addEventListener('scroll',that.handleMobileScroll);
        },

        _handleGroupMove : function (event, ui) {
            var fromIndex = ui.item.startPos,
                toIndex = ui.item.index();

            if (fromIndex !== toIndex && toIndex !== -1) {
                this._publishAsync("launchpad", "moveGroup", {
                    fromIndex  : fromIndex,
                    toIndex    : toIndex
                });
            }
        },

        // TODO: This is done in _mouseStop in the view.js, but should be handled here.
        /*
        _handleGroupDelete : function (event, ui) {
            var oEventBus = sap.ui.getCore().getEventBus(),
                oGroup = sap.ui.getCore().byId(ui.draggable[0].id);
            oEventBus.publish("launchpad", "deleteGroup", {
                groupId : oGroup.getGroupId()
            });
        },
        */

        onCategoryFilter : function (oEvent) {
            var oBus = sap.ui.getCore().getEventBus(),
                sQuery = oEvent.getParameter("selectedItem").getText();

            // Async publication of category filter
            window.setTimeout(jQuery.proxy(oBus.publish, oBus, "catalog", "categoryFilter", {
                category : (sQuery !== "All") ? sQuery : null
            }), 1);
        },

        _publishAsync : function (sChannelId, sEventId, oData) {
            var oBus = sap.ui.getCore().getEventBus();
            window.setTimeout($.proxy(oBus.publish, oBus, sChannelId, sEventId, oData), 1);
        },

        //Group List Items
        _handleGroupListItemOver : function (oEvent) {
            //If this is the first GroupListItemOver, then the tile probably just started hovering the group list
            //Due to wrong order and number of events we still have to check if this has already happened
            if (this.iOutEventCounter === 0 && this.iOverEventCounter === 0) {
                this._handleGroupListOver(oEvent);
            }

            //Flag that this event has happened
            this.iOutEventFlag = true;

            //Notify dashboard
            var oEventBus = sap.ui.getCore().getEventBus();
            oEventBus.publish("grouplist", "GroupListItemOver", oEvent);

            this.iOutEventCounter++;
        },
        _handleGroupListItemOut : function (oEvent) {
            this.iOutEventCounter--;

            //Check if there is an OVER-event happening within the next few ms
            this.iOutEventFlag = false;
            var that = this;
            setTimeout(function () {
                if (that.iOutEventFlag === false) {
                    //There was NO next over event, it could be a GroupListOut
                    //but we still have to check if the order and number of the events was correct
                    //If every over has an out, the tile cannot be over the group list anymore
                    if (that.iOutEventCounter === 0 && that.iOverEventCounter === 1) {
                        that._handleGroupListOut(oEvent);
                    }
                }
            }, 1);

            //Notify dashboard
            var oEventBus = sap.ui.getCore().getEventBus();
            oEventBus.publish("grouplist", "GroupListItemOut", oEvent);
        },
        _handleGroupListItemDrop : function (oEvent) {
            //Reset some stuff
            this.iOutEventCounter = 0;
            this.iOverEventCounter = 0;
            this.iOutEventFlag = false;

            //Notify dashboard
            var oEventBus = sap.ui.getCore().getEventBus();
            oEventBus.publish("grouplist", "GroupListItemDrop", oEvent);
        },

        //Group List
        _handleGroupListOver : function (oEvent) {
            this.iOverEventCounter++;

            //Notify dashboard
            var oEventBus = sap.ui.getCore().getEventBus();
            oEventBus.publish("grouplist", "GroupListOver", oEvent);
        },
        _handleGroupListOut : function (oEvent) {
            this.iOverEventCounter = 0;

            //Notify dashboard
            var oEventBus = sap.ui.getCore().getEventBus();
            oEventBus.publish("grouplist", "GroupListOut", oEvent);
        },
        _bindResizeHandler : function () {
            var fResizeHandler = function (event) {
                var jqGrouplist = jQuery("#groupList"),
                    jqTitleOnly = jQuery(".sapMSLITitleOnly"),
                    jqInputField = jQuery(".sapUshellGroupLI").find(".sapMInput");

                jqTitleOnly.css("width", (jqGrouplist.width() - parseInt(jqTitleOnly.css("padding-left"), 10)) + "px");
                jqInputField.css("width", (jqGrouplist.width() - (2 * parseInt(jqInputField.css("margin-left"), 10))) + "px");
            };
            jQuery(window).unbind("resize", fResizeHandler);
            jQuery(window).bind("resize", fResizeHandler);
        }
    });
}());
