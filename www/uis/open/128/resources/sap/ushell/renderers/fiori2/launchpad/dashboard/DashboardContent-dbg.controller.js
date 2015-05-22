// Copyright (c) 2013 SAP AG, All Rights Reserved

(function () {
    "use strict";
    /*global jQuery, sap, console, setTimeout, clearTimeout */
    /*jslint plusplus: true, nomen: true */
    jQuery.sap.require("sap.ushell.ui.launchpad.TileContainer");

    sap.ui.controller("sap.ushell.renderers.fiori2.launchpad.dashboard.DashboardContent", {

        onInit : function () {
            this.sViewId = "#" + this.oView.getId();
            //On Android 4.x, and Safari mobile in Chrome and Safari browsers sometimes we can see bug with screen rendering
            //so _webkitMobileRenderFix function meant to fix it after  `contentRefresh` event.
            if (sap.ui.Device.browser.mobile) {
                    sap.ui.getCore().getEventBus().subscribe("launchpad", "contentRefresh", this._webkitMobileRenderFix, this);
            }
            this.isDesktop = (sap.ui.Device.system.desktop && (navigator.userAgent.toLowerCase().indexOf('tablet')<0));
        },

        onExit: function () {
            sap.ui.getCore().getEventBus().unsubscribe("launchpad", "contentRefresh", this._webkitMobileRenderFix, this);
        },

        onAfterRendering : function () {
            var oEventBus = sap.ui.getCore().getEventBus();

            //Bind launchpad event handlers
            oEventBus.unsubscribe("launchpad", "scrollToGroup", this._scrollToGroup, this);
            oEventBus.subscribe("launchpad", "scrollToGroup", this._scrollToGroup, this);

            //Bind grouplist event handlers
            oEventBus.unsubscribe("grouplist", "GroupListOver", this._handleGroupListOver, this);
            oEventBus.unsubscribe("grouplist", "GroupListOut", this._handleGroupListOut, this);
            oEventBus.unsubscribe("grouplist", "GroupListItemOver", this._handleGroupListItemOver, this);
            oEventBus.unsubscribe("grouplist", "GroupListItemOut", this._handleGroupListItemOut, this);
            oEventBus.unsubscribe("grouplist", "GroupListItemDrop", this._handleGroupListItemDrop, this);
            oEventBus.subscribe("grouplist", "GroupListOver", this._handleGroupListOver, this);
            oEventBus.subscribe("grouplist", "GroupListOut", this._handleGroupListOut, this);
            oEventBus.subscribe("grouplist", "GroupListItemOver", this._handleGroupListItemOver, this);
            oEventBus.subscribe("grouplist", "GroupListItemOut", this._handleGroupListItemOut, this);
            oEventBus.subscribe("grouplist", "GroupListItemDrop", this._handleGroupListItemDrop, this);

            //Temporary workaround for Android Chrome rendering problem, after group has been renamed.
            if (sap.ui.Device.os.android) {
                oEventBus.unsubscribe("launchpad", "changeGroupTitle", this._changeGroupTitleHandler, this);
                oEventBus.subscribe("launchpad", "changeGroupTitle", this._changeGroupTitleHandler, this);
            }

            // The delete area is moved out of the scrollable area
            jQuery("#__area0").appendTo("#shellPage");
            var timer;
            jQuery(window).bind("resize", function () {
                clearTimeout(timer);
                timer = setTimeout(this._resizeHandler.bind(this), 300);
            }.bind(this));

            // Register scroll event handler for Desktop use-case  (OR apple IOS7)
            if (sap.ui.Device.system.desktop) {
                jQuery("#dashboardPage-cont").scroll(sap.ushell.utils.handleTilesVisibility);
            } else {
                // Register scroll event handler for mobile devices use-case
                setTimeout(function () {
                    this.oDashboardPage = sap.ui.getCore().byId("dashboardPage");
                    this.oScroller = this.oDashboardPage.getScrollDelegate();

                    if(this.oScroller && this.oScroller._scroller) {
                        // Keep the original onScrollMove event
                        if (!this.oOriginalScrollMove) {
                            this.oOriginalScrollMove = this.oScroller._scroller.options.onScrollMove;
                        }
                        var that = this;
                        // Set a new event handler for onScrollMove
                        this.oScroller._scroller.options.onScrollMove = function (oEvent) {

                            // Calling the original onScrollMove event
                            that.oOriginalScrollMove.apply(that.oScroller);
                            sap.ushell.utils.handleTilesVisibility();
                        };
                    }
                    else {
                        jQuery("#dashboardPage-cont").scroll(sap.ushell.utils.handleTilesVisibility);
                        //TODO consider removing this line
                        jQuery("#dashboard").scroll(sap.ushell.utils.handleTilesVisibility);
                    }
                }.bind(this), 1500);
            }
        },

        //Change Group Title Handler for temporary workaround for Android Chrome rendering problem, after group has been renamed.
        _changeGroupTitleHandler: function () {
            this._forceBrowserRerenderElement(document.getElementById('groupList'));
        },

        //force browser to repaint Body, by setting it `display` property to 'none' and to 'block' again
        _forceBrowserRerenderElement: function (element) {
            var animationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame;
            if (animationFrame) {
                animationFrame(function () {
                    var display = element.style.display;
                    element.style.display = 'none';
                    element.offsetHeight;
                    element.style.display = display;
                });
            } else {
                console.log('unsupported browser for animation frame');
            }
        },

        //function fixes Android 4.x Chrome, and Safari bug with poor rendering
        _webkitMobileRenderFix: function () {
            //force Chrome to repaint Body, by setting it `display` property to 'none' and to 'block' again
            if (sap.ui.Device.browser.chrome || sap.ui.Device.os.ios || sap.ui.Device.os.android) {
                // this includes almost all browsers and devices
                // if this is the IOS6 (as the previous fix causes double flickering
                // and this one only one flickering)
                this._forceBrowserRerenderElement(document.body);
            }
        },

        _resizeHandler : function () {
            this._addBottomSpace();
            sap.ushell.utils.handleTilesVisibility();
        },

        _addBottomSpace : function () {
        	sap.ushell.utils.addBottomSpace();
        },

        _scrollToGroup : function (sChannelId, sEventId, oData) {

            var sGroupId,
                that = this;

            if (oData.group) {
                sGroupId = oData.group.getGroupId();
            } else {
                // in case of scroll after deletion, the oData contains only the groupId.
                sGroupId = oData.groupId;
            }

            jQuery.each(this.oView.oDashboardGroupsBox.getGroups(), function (nIndex, oGroup) {
                if (oGroup.getGroupId() === sGroupId) {
                    var iY;

                    if (sap.ui.Device.system.desktop) {
                        if (nIndex === 0) {
                            sap.ui.getCore().byId("dashboardPage").scrollTo(0, 500);
                        }
                        else {
                            var jqDashboardPageCont = jQuery("#dashboardPage-cont");
                            var iTopSpacing = jQuery('#shell-hdr').height() + parseInt(jQuery('.sapUshellContainerTitle').css('margin-top'),10);
                            iY = jQuery.sap.byId(oGroup.sId).offset().top + jqDashboardPageCont.scrollTop() - iTopSpacing;
                            sap.ui.getCore().byId("dashboardPage").scrollTo(iY, 500);
                        }
                    } else {
                        iY =  -1*( document.getElementById('dashboardGroups').getBoundingClientRect().top) + document.getElementById(oGroup.sId).getBoundingClientRect().top;
                        jQuery('#dashboard').animate({scrollTop : iY}, 500,that.fHandleScrollEnd);
                    }

                    //on press event we need to set the group in focus as well unless we are in edit mode
                    if (oData.group && oData.focus && !oData.group.getEditMode()) {
                        jQuery.sap.byId(oGroup.sId).focus();
                    }
                    //fix bottom space, if this a deletion scenario the 'oData.groupId' will return true
                    if (oData.groupId || oData.groupChanged) {
                        that._addBottomSpace();
                    }

                    jQuery('#groupList .sapUshellDefaultGroupItem, #groupList .sapUshellGroupListItem')
                        .removeClass('sapUshellOver')
                        .eq(nIndex).addClass('sapUshellOver');

                    // Call Tiles visibility scrolling handler
                    //TODO should be triggered by Scroll event - consider removing it
                    sap.ushell.utils.handleTilesVisibility();

                    return false;
                }
            });
        },

        fHandleScrollEnd : function() {

            //Notify groupList
            var oEventBus = sap.ui.getCore().getEventBus();
            oEventBus.publish("grouplist", "ScrollAnimationEnd");
        },

        makeGroupSortable : function (jqTileContainer) {
            var jqGroup = jqTileContainer.find('.sapUshellInner');

            if (jqGroup.hasClass("ui-sortable")) {
                return;
            }

            this._sortable(jqGroup);
        },

        _getTileTopOffset : function (oTile, tilePosition, dashboardScrollTop) {
            var iTileTopOffset = 0 + dashboardScrollTop;
            iTileTopOffset += oTile.closest(".sapUshellDashboardGroupsContainerItem").position().top;
            iTileTopOffset += tilePosition.top;
            return iTileTopOffset;
        },

        _sortable : function (jqGroup) {
            var that = this,
                jqDashboardGroup = jQuery.sap.byId(this.oView.oDashboardGroupsBox.getId()),
                jqCloneArea = jqDashboardGroup.find(".sapUshellCloneArea");

            that.bActive = false;

            //Check if there already is a clone area
            if (jqCloneArea.length <= 0) {
                jqCloneArea = jQuery("<div id='cloneArea' class='sapUshellCloneArea sapUshellDashboardGroupsContainerItem'></div>");
                jqDashboardGroup.append(jqCloneArea);
            }

            jqGroup.sortable({ //create sortable tiles
                containment: "document", // this.jqParentParent.parent().parent(),
                items: '>:not(.sapUshellPlusTile)',
                connectWith: ".sapUshellInner.sapUshellTilesContainer-sortable",
                placeholder: "sapUshellTile-placeholder",
                tolerance: "pointer",
                helper: function (event, element) {
                    var clone = element.clone();
                    var jqCloneATag = clone.find('a');
                    if (jqCloneATag.length) {
                        var tagAContent = jqCloneATag.html();
                        jqCloneATag.replaceWith(jQuery('<div>'+tagAContent+'</div>'));
                    }
                    clone.find('[title]').removeAttr('title');
                    clone.attr("id", clone.attr("id") + '-helperclone');
                    clone.addClass("sapUshellSortableHelperClone");
                    clone.css("font-size", element.css("font-size"));
                    clone.hide();
                    setTimeout(function () {
                        clone.appendTo('body');
                        clone.show();
                    }, 1);
                    return clone;
                },
                revert: 250,
                start:  this._handleSortableStart.bind(this),
                change: this._handleSortableChange.bind(this),
                stop: this._handleSortableStop.bind(this)
            }).disableSelection(); //disable text selection browser-behaviour

            if (sap.ui.Device.system.phone) {
                jqGroup.sortable('disable');
            }
        },

        _bindTileEvents : function (oEvent) {

            if (!sap.ui.Device.system.tablet) {
                return;
            }

            var that = this,
                oTile = oEvent.getSource();

            var jqThis = jQuery.sap.byId(oTile.sId);

            jqThis.bind("mousedown", function (event) {
                if (that.bActive === false) {
                    try {
                        jQuery(".sapUshellInner.sapUshellTilesContainer-sortable").sortable('disable');
                    } catch (e) {
                        jQuery.sap.log.warning('tile container sortable was not initialized. intializing again now.');
                        jQuery(".sapUshellInner.sapUshellTilesContainer-sortable").each(function () {
                            that._sortable(jQuery(this));
                        });
                    }

                    var _this = jQuery(this),
                        _event = event;

                    clearTimeout(that.fdownTimer);
                    that.fdownTimer = setTimeout(function () {
                        that.bActive = true;

                        jQuery(_this).effect("shake", {
                            times: 1,
                            distance: 5,
                            complete: function () {
                                if (!that.bActive) {
                                    return;
                                }

                                //deactivate scrolling during drag and drop on mobile devices
                                var oDashboardPage = sap.ui.getCore().byId("dashboardPage"),
                                    oScroller = oDashboardPage.getScrollDelegate();

                                if (oScroller && oScroller._scroller) {
                                    oScroller._scroller.disable();
                                }
                                jQuery(".sapUshellInner.sapUshellTilesContainer-sortable").sortable('enable');
                                jQuery(this).trigger(_event);
                            }
                        }, 50);
                    }, 150);
                }
            });


            jqThis
                .bind('mouseup', $.proxy(that, '_resetDraggingTimeout'))
                .bind('mousemove', $.proxy(that, '_resetDraggingTimeout'))
                .bind('scrollstart', $.proxy(that, '_resetDraggingTimeout'))
                .bind('touchmove', $.proxy(that, '_resetDraggingTimeout'))
                .bind('touchcancel', $.proxy(that, '_resetDraggingTimeout'));

        },

        _resetDraggingTimeout : function () {
            clearTimeout(this.fdownTimer);
            this.bActive = false;

            if (!sap.ui.Device.system.desktop) {
                //activate scrolling after drag and drop on mobile devices
                var oDashboardPage = sap.ui.getCore().byId("dashboardPage"),
                    oScroller = oDashboardPage.getScrollDelegate();

                if (oScroller && oScroller._scroller) {
                    oScroller._scroller.enable();
                }
            }
        },

        _handleSortableStart : function (event, ui) {

            this.sortableInfo = {};
            this.sortableInfo.dashboardGroups = document.getElementById(this.oView.oDashboardGroupsBox.getId());
            this.sortableInfo.jqDashboardGroups = jQuery(this.sortableInfo.dashboardGroups);
            var jqTiles = this.sortableInfo.jqDashboardGroups.find(".sapUshellTile");
            //fix for ios, that prevent iPada tile from lunch after Drag and Drop
            if (sap.ui.Device.os.ios && sap.ui.Device.system.tablet) {
                jqTiles.find('a').removeAttr('href');
            }
            this.sortableInfo.originalTiles =  jqTiles.not(".sapUshellSortableHelperClone").not(ui.item);
            this.sortableInfo.cloneArea = this.sortableInfo.jqDashboardGroups.find("#cloneArea");
            this.sortableInfo.tilesFirstContainer = this.sortableInfo.jqDashboardGroups.find('.sapUshellTileContainer:visible:first');
            this.sortableInfo.containerLeftMargin = parseInt(this.sortableInfo.tilesFirstContainer.css("margin-left"));
            this.sortableInfo.jqDashboardPageCont = jQuery("#dashboardPage-cont");


            var uiCore = sap.ui.getCore();
            uiCore.getEventBus().publish("launchpad", "sortableStart");

            var oTile = uiCore.byId(ui.item[0].id);
            if (oTile.getLong()) {
                ui.placeholder.addClass("sapUshellLong");
            }
            if (oTile.getTall()) {
                ui.placeholder.addClass("sapUshellTall");
            }

            // Make the dragged item "unclickable" to prevent opening apps while/immediately after
            // drag'n'drop, because doing this produces ui errors.
            ui.item.click(function(oEvent) {
                oEvent.preventDefault();
                oEvent.stopPropagation();
            });

            //show delete-area
            this.oView.oDashboardDeleteArea.show();

            if (!this.isDesktop) {
                return
            }

            //Flag the original tile that is currently being dragged
            //ui.item.addClass("sapUshellExcludeMe");

            var that = this,
            //Refresh the current margin (window scaling and opening the sidebar change the margin)
                containerOffsetLeft = parseFloat(jQuery("#dashboardPage-scroll").offset().left),
                dashboardOffsetLeft = this.sortableInfo.jqDashboardGroups.offset().left;//css("width")

            this.sortableInfo.cloneArea.css("left", dashboardOffsetLeft - containerOffsetLeft);

            //Clone all existing tiles
            //Iterate through all tiles
            var dashboardPageScrollTop = this.sortableInfo.jqDashboardPageCont.scrollTop();
            for(var i=0; i<this.sortableInfo.originalTiles.length; i++) {
                //Clone the current tile (including style)
                var jqTile = this.sortableInfo.originalTiles.eq(i),
                    oClonedTile = jqTile.clone();
                var tile = jqTile[0];
                tile.tilePosition = jqTile.position();
                tile.tileOffset = jqTile.offset();
                oClonedTile.attr("id", oClonedTile.attr("id") + '-clone');
                oClonedTile.css("font-size", jqTile.css("font-size"));
                oClonedTile.addClass("sapUshellClonedTile");

                //Save the clone and the current group (sapUshellDashboardGroupsContainerItem)
                jqTile.data("clone", oClonedTile);

                //Position the clone inside the cloneArea
                var sTileLeftOffset = parseInt(tile.tilePosition.left) + this.sortableInfo.containerLeftMargin + "px",
                    iTileTopOffset = that._getTileTopOffset(jqTile, tile.tilePosition, dashboardPageScrollTop);

                //Set the new position
                oClonedTile.css("left", sTileLeftOffset);
                oClonedTile.css("top", iTileTopOffset + "px");

                //Append the clone...
                that.sortableInfo.cloneArea.append(oClonedTile);

                jqTile.css("visibility", "hidden");
            }
        },

        _handleSortableStop : function (event, ui) {
            // Make sure that helper is disposed
            jQuery(".sapUshellSortableHelperClone").remove();

            //hide delete-area
            this.oView.oDashboardDeleteArea.hide();

            var uiCore = sap.ui.getCore(),
                oTile = uiCore.byId(ui.item[0].id),
                oEventBus = uiCore.getEventBus();

            if(oTile) {
                var oOldGroup = oTile.getParent();

                if (!oTile.bDeletionFlag) {
                    // Move tile in model if user actually moved a tile directly between groups.
                    // Only process if the event is not thrown by a helper and the tile was not
                    // deleted.
                    // If the tile was dropped on a group, oTile == undefined, as the drop handler
                    // destroyed it (see _handleGroupListItemDrop()). Nothing to be done here.
                    if (oTile.getLong()) {
                        jQuery(".sapUshellTile-placeholder").removeClass("sapUshellLong");
                    }

                    var oNewGroup = sap.ui.getCore().byId(ui.item.parents(".sapUshellTileContainer").attr("id")),
                        sNewGroupId = oNewGroup.getGroupId(),
                        nNewIndex = ui.item.index();

                    oOldGroup.removeTile(oTile, true);
                    oNewGroup.insertTile(oTile, nNewIndex, true);

                    oEventBus.publish("launchpad", "moveTile", {
                        sTileId    : oTile.getUuid(),
                        toGroupId  : sNewGroupId,
                        toIndex    : nNewIndex
                    });

                    // Workaround: Prevent a new sort from being started before re-rendering has happened.
                    // This is necessary because the delayed rendering would corrupt an ongoing sort, as it
                    // deletes the current container (& sortable) and creates a new one.)
                    // (But don't do this, when we're deleting tiles. In this case rerendering was already
                    // triggered by the deletion handler in mouseStop.)
                    ui.item.parent().sortable('disable');

                } else if (oTile.bDeletionFlag) {
                    oOldGroup.removeTile(oTile, true);
                    oTile.bDeletionFlag = false;

                    oEventBus.publish("launchpad", "deleteTile", {
                        tileId  : oTile.getUuid()
                    });

                    oTile.destroy();
                }
            }

            if (sap.ui.Device.system.phone) {
                that.bActive = false;
                jQuery(".sapUshellInner.sapUshellTilesContainer-sortable").sortable('disable');
            }

            if (this.isDesktop) {
                //Show all original tiles and reset everything
                var jqShellTile = jQuery(".sapUshellTile").not(".sapUshellClonedTile");
                jqShellTile.removeData("clone");
                jqShellTile.removeClass("sapUshellExcludeMe");
                jqShellTile.css("visibility", "visible");

                //Delete all clones
                var jqDashboardGroup = jQuery.sap.byId(this.oView.oDashboardGroupsBox.getId()),
                    jqCloneArea = jqDashboardGroup.find("#cloneArea");
                jqCloneArea.empty();
            }

            delete this.sortableInfo;
            oEventBus.publish("launchpad", "sortableStop");
        },

        /**
         *
         * @param event
         * @param ui : tile DOM Reference
         * @private
         */
        _handleDrop : function (event, ui) {
            var jqTile = jQuery(ui);
            //hide delete-area
            this.oView.oDashboardDeleteArea.hide();

            var oNewGroup = sap.ui.getCore().byId(jqTile.parents(".sapUshellTileContainer").attr("id")),
                sNewGroupId = oNewGroup.getGroupId(),
                nNewIndex = jqTile.index(),
                uiCore = sap.ui.getCore(),
                oTile = uiCore.byId(jqTile.attr('id')),
                oOldGroup = oTile.getParent(),
                oEventBus = uiCore.getEventBus(),
                oDeleteArea = jQuery(".sapUshellDeleteArea_dashboard_functional");
            if (oDeleteArea.data("tileOver") === true){
                oOldGroup.removeTile(oTile, true);

                oEventBus.publish("launchpad", "deleteTile", {
                    tileId: oTile.getUuid()
                });

                oTile.destroy();
                oDeleteArea.data("tileOver", false);

            } else {
                oOldGroup.removeTile(oTile, true);
                oNewGroup.insertTile(oTile, nNewIndex, true);

                oEventBus.publish("launchpad", "moveTile", {
                    sTileId: oTile.getUuid(),
                    toGroupId: sNewGroupId,
                    toIndex: nNewIndex
                });
            }
        },

        _handleSortableChange : function (event, ui, bAnimate) {
            if (typeof bAnimate == "undefined") {
                bAnimate = true;
            }

            // when moving from one group to another this should only be called for the target group
            if (ui && (ui.placeholder.length > 0)) {
                var jqTargetGroup = ui.placeholder.parent();
                var jqPlusTiles = jqTargetGroup.children('.sapUshellPlusTile');
                if (jqPlusTiles.length > 0) {
                    jqPlusTiles.detach();
                    jqTargetGroup.append(jqPlusTiles);
                }
            }

            if (!this.isDesktop) return;

            var that = this;
            var oOriginalTiles = this.sortableInfo.originalTiles;
            var dashboardPageScrollTop = this.sortableInfo.jqDashboardPageCont.scrollTop();

            for (var i=0; i<oOriginalTiles.length; i++) {
                //Get the original tile and its clone
                var jqTile = oOriginalTiles.eq(i);
                var tile = jqTile[0];
                var currentTilePosition = jqTile.position();
                var currentTileOffset = jqTile.offset();
                if ((currentTileOffset.left == tile.tileOffset.left) && (currentTileOffset.top == tile.tileOffset.top)) {
                    continue;
                }
                tile.tilePosition = currentTilePosition;
                tile.tileOffset = currentTileOffset;
                var oClonedTile = jqTile.data("clone");
                if (!oClonedTile) continue;

                //Get the invisible tile that has snapped to the new
                //location, get its position, and animate the visible
                //clone to it
                var tileLeftOffset = tile.tilePosition.left + this.sortableInfo.containerLeftMargin;
                var iTileTopOffset = that._getTileTopOffset(jqTile, tile.tilePosition, dashboardPageScrollTop);

                //Animate / move everything to their new locations
                if(bAnimate) {
                    //Stop currently running animations
                    //Without this, animations would queue up
                    oClonedTile.stop(true, false).animate({left: tileLeftOffset, top: iTileTopOffset}, {duration: 250}, {easing: "swing"});
                } else {
                    oClonedTile.css({left: tileLeftOffset, top: iTileTopOffset});
                }
            }
        },

        _handleGroupListOver : function (sChannel, sEventId, oEvent) {
            //Toggle transparency of the hovering tile
            jQuery(".sapUshellSortableHelperClone").toggleClass("sapUshellOverGroupList");

            //Hide the old placeholder
            jQuery(".sapUshellTile-placeholder").hide();
        },
        _handleGroupListOut : function (sChannel, sEventId, oEvent) {
            //Toggle transparency of the hovering tile
            jQuery(".sapUshellSortableHelperClone").toggleClass("sapUshellOverGroupList");

            //Show the old placeholder
            jQuery(".sapUshellTile-placeholder").show();

            //Reset the target drop group
            jQuery(".sapUshellGroupList").data("dropGroup", null);

            //Make the cloned tiles animate themselves to their new positions
            this._handleSortableChange(undefined, undefined, false);
        },
        _handleGroupListItemOver : function (sChannel, sEventId, oEvent) {
            //Memorize the group over which the tile is hovering
            jQuery(".sapUshellGroupList").data("dropGroup", oEvent.getSource());

            //Clone the old placeholder
            var jqPlaceholderClone = jQuery(".sapUshellTile-placeholder").not(".sapUshellPlaceholderClone").clone();
            jqPlaceholderClone.addClass("sapUshellPlaceholderClone");
            jqPlaceholderClone.attr("id", "placeholder-clone_" + oEvent.getSource().sId);

            //Identify the jQuery object of target group
            var jqTargetGroup;
            jQuery.each(this.oView.oDashboardGroupsBox.getGroups(), function (nIndex, oGroup) {
                if (oGroup.getGroupId() === oEvent.getSource().getGroupId()) {
                    jqTargetGroup = jQuery("#" + oGroup.sId).find(".sapUshellTilesContainer-sortable");
                    return false;
                }
            });

            //Attach cloned placeholder to last position of target group
            //Check if target group contains a plus tile (if so, insert before that)
            if(jqTargetGroup.find(".sapUshellPlusTile").length > 0) {
                //Append before plus tile
                jqTargetGroup.find(".sapUshellPlusTile").before(jqPlaceholderClone);
                jqPlaceholderClone.show();
            } else {
                //Append as last element
                jqTargetGroup.append(jqPlaceholderClone);
                jqPlaceholderClone.show();
            }

            //Make the original tile and the original placeholder invisible (if not already)
            //jQuery(".sapUshellExcludeMe.sapUshellSortableHelperClone").hide();
            jQuery(".sapUshellTile-placeholder").not(".sapUshellPlaceholderClone").hide();

            //Make the cloned tiles animate themselves to their new positions
            this._handleSortableChange(undefined, undefined, false);
        },
        _handleGroupListItemOut : function (sChannel, sEventId, oEvent) {
            //Remove my placeholder clones
            jQuery("#placeholder-clone_" + oEvent.getSource().sId).remove();

            //Make the cloned tiles animate themselves to their new positions
            //In theory, this should only be necessary in "over", but due to the wrong order of events,
            //a placeholder could be removed AFTER the over event, thus leading to strange behavior
            this._handleSortableChange(undefined, undefined, false);
        },

        _handleGroupListItemDrop : function (sChannel, sEventId, oEvent) {
            //Move the tile
            var oTile = oEvent.getParameter("control"),
                oOldGroup = oTile.getParent();

            oOldGroup.removeTile(oTile, true);

            this._publishAsync("launchpad", "moveTile", {
                sTileId    : oTile.getUuid(),
                toGroupId  : oEvent.getSource().getGroupId(),
                toIndex    : null
            });

            //Clean up the missing events
            this._handleGroupListOut(sChannel, sEventId, oEvent);
            this._handleGroupListItemOut(sChannel, sEventId, oEvent);

            // TODO: It would be good if we could move the tile to its new container.
            // But that requires the drag-item and the oTile to be moved.
            oTile.destroy();
        },
        _publishAsync : function (sChannelId, sEventId, oData) {
            var oBus = sap.ui.getCore().getEventBus();
            window.setTimeout($.proxy(oBus.publish, oBus, sChannelId, sEventId, oData), 1);
        }
    });
}());
