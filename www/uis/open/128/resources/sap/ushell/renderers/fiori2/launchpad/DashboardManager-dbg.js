// Copyright (c) 2013 SAP AG, All Rights Reserved

(function () {
    "use strict";
    /*global jQuery, sap, console, document, $, setTimeout, window */
    /*jslint plusplus: true, nomen: true, bitwise: true */

    jQuery.sap.declare("sap.ushell.renderers.fiori2.launchpad.DashboardManager");
    jQuery.sap.require("sap.ushell.services.Message");
    jQuery.sap.require('sap.ui.thirdparty.jqueryui.jquery-ui-core');
    jQuery.sap.require('sap.ui.thirdparty.jqueryui.jquery-ui-widget');
    jQuery.sap.require('sap.ui.thirdparty.jqueryui.jquery-ui-mouse');
    jQuery.sap.require('sap.ui.thirdparty.jqueryui.jquery-ui-sortable');
    jQuery.sap.require('sap.ui.thirdparty.jqueryui.jquery-ui-draggable');
    jQuery.sap.require('sap.ui.thirdparty.jqueryui.jquery-ui-droppable');
    jQuery.sap.require('sap.ui.thirdparty.jqueryui.jquery-ui-effect');
    jQuery.sap.require('sap.ui.thirdparty.jqueryui.jquery-ui-effect-shake');

    /**
     * Return translated text. Private function in this module.
     * @param sMsgId
     *      Id of the text that is to be translated.
     * @param aParams
     *      Array of parameters to be included in the resulted string instead of place holders.
     */
    var getLocalizedText = function (sMsgId, aParams) {
        return aParams ? sap.ushell.resources.i18n.getText(sMsgId, aParams)  : sap.ushell.resources.i18n.getText(sMsgId);
    };

    /**
     * This function returns the number of tiles which are supported on the current device in the current catalog.
     * @param oCatalogModel
     * @returns {Number}
     * @private
     */
    var getNumIntentSupportedTiles = function (oCatalogModel) {
        var aCatalogTiles = this.oModel.getProperty('/catalogTiles'),
            aCurrentCatalogSupportedTiles = aCatalogTiles.filter(function (oTile) {
                return oTile.catalogId === oCatalogModel.id && oTile.isTileIntentSupported === true;
            });

        return aCurrentCatalogSupportedTiles.length;
    };

    sap.ui.base.EventProvider.extend("sap.ushell.renderers.fiori2.launchpad.DashboardManager", {
        metadata : {
            publicMethods : ["getModel", "getDashboardView", "getGroupListView", "loadPersonalizedGroups", "attachEvent", "detachEvent", "attachEventOnce"]
        },

        constructor : function (sId, mSettings) {
            //make this class only available once
            if (sap.ushell.renderers.fiori2.launchpad.getDashboardManager && sap.ushell.renderers.fiori2.launchpad.getDashboardManager()) {
                return sap.ushell.renderers.fiori2.launchpad.getDashboardManager();
            }
            sap.ushell.renderers.fiori2.launchpad.getDashboardManager = jQuery.sap.getter(this.getInterface());
            this.oPageBuilderService = sap.ushell.Container.getService("LaunchPage");
            this.oModel = mSettings.model;
            this.oConfig = mSettings.config;
            this.oDashboardView = sap.ui.view('dashboard', {
                type: sap.ui.core.mvc.ViewType.JS,
                viewName: "sap.ushell.renderers.fiori2.launchpad.dashboard.DashboardContent",
                viewData: {
                    config: this.oConfig
                }
            });
            this.oDashboardView.setWidth('');
            this.oDashboardView.setDisplayBlock(true);
            this.oSortableDeferred = $.Deferred();
            this.oSortableDeferred.resolve();
            this.aRequestQueue = [];
            this.bRequestRunning = false;
            this.registerEvents();
            this.oTileCatalogToGroupsMap = {};
            this.tileViewUpdateQueue = [];
            this.tileViewUpdateTimeoutID = 0;
        },

        registerEvents : function () {
            var oEventBus = sap.ui.getCore().getEventBus();
            oEventBus.subscribe("launchpad", "addBookmarkTile", this._createBookmark, this);
            oEventBus.subscribe("launchpad", "loadDashboardGroups", this.loadPersonalizedGroups, this);
            oEventBus.subscribe("launchpad", "createGroup", this._createGroup, this);
            oEventBus.subscribe("launchpad", "deleteGroup", this._deleteGroup, this);
            oEventBus.subscribe("launchpad", "resetGroup", this._resetGroup, this);
            oEventBus.subscribe("launchpad", "changeGroupTitle", this._changeGroupTitle, this);
            oEventBus.subscribe("launchpad", "moveGroup", this._moveGroup, this);
            oEventBus.subscribe("launchpad", "deleteTile", this._deleteTile, this);
            oEventBus.subscribe("launchpad", "moveTile", this._moveTile, this);
            oEventBus.subscribe("launchpad", "sortableStart", this._sortableStart, this);
            oEventBus.subscribe("launchpad", "sortableStop", this._sortableStop, this);
            oEventBus.subscribe("showCatalog", this.loadAllCatalogs, this);

            this.oDashboardView.addEventDelegate({
                onBeforeFirstShow: jQuery.proxy(function (evt) {
                    try {
                        this.loadPersonalizedGroups();
                    } catch (err) {
                        console.log("DahsboardManager ; oDashboardView.addEventDelegate failed ; exception: " + err);
                    }
                }, this),
                onAfterHide: jQuery.proxy(function (evt) {
                    try {
                        sap.ushell.utils.setTilesNoVisibility();// setting no visibility on all visible tiles
                    } catch (err) {
                        console.log("DahsboardManager ; Call to _sap.ushell.utils.setTilesNoVisibility failed ; exception: " + err);
                    }
                }, this)
            });
        },

        destroy : function () {
            var oEventBus = sap.ui.getCore().getEventBus();
            oEventBus.unsubscribe("launchpad", "addBookmarkTile", this._createBookmark, this);
            oEventBus.unsubscribe("launchpad", "loadDashboardGroups", this.loadPersonalizedGroups, this);
            oEventBus.unsubscribe("launchpad", "createGroup", this._createGroup, this);
            oEventBus.unsubscribe("launchpad", "deleteGroup", this._deleteGroup, this);
            oEventBus.unsubscribe("launchpad", "resetGroup", this._resetGroup, this);
            oEventBus.unsubscribe("launchpad", "changeGroupTitle", this._changeGroupTitle, this);
            oEventBus.unsubscribe("launchpad", "moveGroup", this._moveGroup, this);
            oEventBus.unsubscribe("launchpad", "deleteTile", this._deleteTile, this);
            oEventBus.unsubscribe("launchpad", "moveTile", this._moveTile, this);
            oEventBus.unsubscribe("launchpad", "sortableStart", this._sortableStart, this);
            oEventBus.unsubscribe("launchpad", "sortableStop", this._sortableStop, this);
            oEventBus.unsubscribe("showCatalog", this.loadAllCatalogs, this);

            this.oDashboardView.destroy();

            sap.ushell.renderers.fiori2.launchpad.getDashboardManager = undefined;
        },


        _refreshTiles : function () {
            var that = this,
                aGroups = this.oModel.getProperty("/groups");

            jQuery.each(aGroups, function (nIndex, oGroup) {
                jQuery.each(oGroup.tiles, function (nIndex, oTile) {
                    that.oPageBuilderService.refreshTile(oTile.object);
                });
            });
        },

        _sortableStart : function () {
            this.oSortableDeferred = $.Deferred();
        },

        _createBookmark : function (sChannelId, sEventId, oData) {
            var tileGroup = oData.group ? oData.group.object : "",
                groupId = oData.group ? oData.group.groupId : 0,
                targetGroup;

            delete oData.group;

            this._addRequest($.proxy(function () {
                var oResultPromise = sap.ushell.Container.getService("Bookmark").addBookmark(oData, tileGroup),
                    oResourceBundle = sap.ushell.resources.i18n;
                oResultPromise.always($.proxy(this._checkRequestQueue, this));
                oResultPromise.done(function (oTile) {
                    if (!oTile) {
                        this.loadPersonalizedGroups();
                        return;
                    }

                    var newTile = this._getTileModel(oTile);

                    targetGroup = this.oModel.getProperty("/groups/" + (this._getIndexOfGroup(groupId) || 0));
                    targetGroup.tiles.push(newTile);
                    this.oModel.setProperty("/groups/"  + this._getIndexOfGroup(groupId), targetGroup);
                    if (sap.ushell.Container) { // TODO at least in some test cases this is not present
                        sap.ushell.Container.getService('Message').info(oResourceBundle.getText('tile_created_msg'));
                    }

                }.bind(this));

                oResultPromise.fail(function (sMsg) {
                    jQuery.sap.log.error(
                        "Failed to add bookmark",
                        sMsg,
                        "sap.ushell.ui.footerbar.AddBookmarkButton"
                    );
                    if (sap.ushell.Container) {
                        sap.ushell.Container.getService('Message').error(oResourceBundle.getText('fail_to_add_tile_msg'));
                    }
                });
            }, this));
        },

        _sortableStop : function () {
            this.oSortableDeferred.resolve();
        },

        _handleAfterSortable : function (fFunc) {
            return $.proxy(function () {
                var outerArgs = Array.prototype.slice.call(arguments);
                this.oSortableDeferred.done(function () {
                    fFunc.apply(null, outerArgs);
                });
            }, this);
        },

        _addRequest : function (fRequest) {
            this.aRequestQueue.push(fRequest);
            if (!this.bRequestRunning) {
                this.bRequestRunning = true;
                this.aRequestQueue.shift()();
            }
        },

        _checkRequestQueue : function () {
            if (this.aRequestQueue.length === 0) {
                this.bRequestRunning = false;
            } else {
                this.aRequestQueue.shift()();
            }
        },

        _requestFailed : function () {
            this.aRequestQueue = [];
            this.bRequestRunning = false;
        },

        /*
         * oData should have the following parameters:
         * title
         */
        _createGroup : function (sChannelId, sEventId, oData) {
            var that = this,
                oGroup = this._getGroupModel(null),
                aGroups = this.oModel.getProperty("/groups"),
                oModel = this.oModel;

            oModel.setProperty("/groupList-skipScrollToGroup", true);
            window.setTimeout(function () {
                oModel.setProperty("/groups/" + aGroups.length, oGroup);
            }, 500);
            window.setTimeout(function () {
                oModel.setProperty("/groupList-skipScrollToGroup", false);
            }, 1000);

            // We don't call the backend here as the user hasn't had the opportunity to give the group a name yet.
            // The group will be persisted after it got a name, in the changeGroupTitle handler.
            // TODO: This depends on the behaviour of the GroupList, which enters edit-mode immediately after creating a group.
            //       It would be better if this event would be fired after the group has a name.
        },

        _getIndexOfGroup : function (sGroupId) {
            var nGroupIndex = null,
                aGroups = this.oModel.getProperty("/groups");
            jQuery.each(aGroups, function (nIndex, oGroup) {
                if (oGroup.groupId === sGroupId) {
                    nGroupIndex = nIndex;
                    return false;
                }
            });
            return nGroupIndex;
        },

        _getPathOfGroup : function (sGroupId) {
            return "/groups/" + this._getIndexOfGroup(sGroupId);
        },

        _getPathOfTile : function (sTileId) {
            var aGroups = this.oModel.getProperty("/groups"),
                nResGroupIndex = null,
                nResTileIndex = null;

            jQuery.each(aGroups, function (nGroupIndex, oGroup) {
                jQuery.each(oGroup.tiles, function (nTileIndex, oTile) {
                    if (oTile.uuid === sTileId) {
                        nResGroupIndex = nGroupIndex;
                        nResTileIndex = nTileIndex;
                        return false;
                    }
                });

                if (nResGroupIndex !== null) {
                    return false;
                }
            });

            return nResGroupIndex !== null ? "/groups/" + nResGroupIndex + "/tiles/" + nResTileIndex : null;
        },

        // see http://stackoverflow.com/questions/5306680/move-an-array-element-from-one-array-position-to-another
        _moveInArray : function (aArray, nFromIndex, nToIndex) {
            if (nToIndex >= aArray.length) {
                var k = nToIndex - aArray.length;
                while ((k--) + 1) {
                    aArray.push(undefined);
                }
            }
            aArray.splice(nToIndex, 0, aArray.splice(nFromIndex, 1)[0]);
        },

        _updateGroupIndices : function (aArray) {
            var k;
            for (k = 0; k < aArray.length; k++) {
                aArray[k].index = k;
            }
        },
        /*
         * oData should have the following parameters
         * groupId
         */
        _deleteGroup : function (sChannelId, sEventId, oData) {
            var that = this,
                sGroupId = oData.groupId,
                aGroups = this.oModel.getProperty("/groups"),
                nGroupIndex = this._getIndexOfGroup(sGroupId),
                oGroup = null,
                oResultPromise,
                oModel,
                nextSelectedItemIndex,
                oBus;

            nextSelectedItemIndex = aGroups.length - 1 === nGroupIndex ? nGroupIndex - 1 : nGroupIndex;
            this._destroyGroupModel("/groups" + nGroupIndex);
            oGroup = aGroups.splice(nGroupIndex, 1)[0].object;
            oModel = this.oModel;
            oModel.setProperty("/groupList-skipScrollToGroup", true);
            oModel.setProperty("/groups", aGroups);
            this._updateGroupIndices(aGroups);

            if (nextSelectedItemIndex >= 0) {
                oBus = sap.ui.getCore().getEventBus();
                window.setTimeout($.proxy(oBus.publish, oBus, "launchpad", "scrollToGroup", { groupId : this.oModel.getProperty("/groups")[nextSelectedItemIndex].groupId }), 200);
            }

            window.setTimeout(function () {
                oModel.setProperty("/groupList-skipScrollToGroup", false);
            }, 1000);

            this._addRequest($.proxy(function () {
                var groupName = sap.ushell.Container.getService("LaunchPage").getGroupTitle(oGroup);
                try {
                    oResultPromise = this.oPageBuilderService.removeGroup(oGroup);
                } catch (err) {
                    this._resetGroupsOnFailure("fail_to_delete_group_msg");
                    return;
                }

                oResultPromise.done($.proxy( this._showLocalizedMessage("group_deleted_msg", [groupName])));
                oResultPromise.fail( this._handleAfterSortable(that._resetGroupsOnFailureHelper("fail_to_delete_group_msg")));
                oResultPromise.always( $.proxy(this._checkRequestQueue, this) );
            }, this));
        },

        /*
         * oData should have the following parameters
         * groupId
         */
        _resetGroup : function (sChannelId, sEventId, oData) {
            var that = this,
                sGroupId = oData.groupId,
                nGroupIndex = this._getIndexOfGroup(sGroupId),
                oGroup = this.oModel.getProperty("/groups/" + nGroupIndex),
                oResultPromise;

            this.oModel.setProperty("/groups/" + nGroupIndex + "/sortable", false);

            this._addRequest($.proxy(function () {
                try {
                    oResultPromise = this.oPageBuilderService.resetGroup(oGroup.object);
                } catch (err) {
                    this._resetGroupsOnFailure("fail_to_reset_group_msg");
                    return;
                }

                oResultPromise.done(this._handleAfterSortable($.proxy(function (sGroupId, oGroup, oResetedGroup) {
                    var nGroupIndex = that._getIndexOfGroup(sGroupId);

                    this._loadGroup(nGroupIndex, oResetedGroup || oGroup.object);
                    this._showLocalizedMessage("group_reset_msg", [oGroup.title]);
                    this.oModel.setProperty("/groups/" + nGroupIndex + "/sortable", true);
                }, this, sGroupId, oGroup)));

                oResultPromise.fail(this._handleAfterSortable(that._resetGroupsOnFailureHelper("fail_to_reset_group_msg")));
                oResultPromise.always($.proxy(this._checkRequestQueue, this));
            }, this));
        },

        /*
         * oData should have the following parameters
         * fromIndex
         * toIndex
         */
        _moveGroup : function (sChannelId, sEventId, oData) {
            var iFromIndex = oData.fromIndex,
                iToIndex = oData.toIndex,
                aGroups = this.oModel.getProperty("/groups"),
                oModel = this.oModel,
                oResultPromise;

            //Fix the indices to support hidden groups
            iFromIndex = this._adjustFromGroupIndex(iFromIndex, aGroups);

            //Move var definition after fixing the from index.
            var oGroup = aGroups[iFromIndex],
            sGroupId = oGroup.groupId;
            //Fix the to index accordingly
            iToIndex = this._adjustToGroupIndex(iToIndex, aGroups, sGroupId);

            this._moveInArray(aGroups, iFromIndex, iToIndex);
            this._updateGroupIndices(aGroups);
            oModel.setProperty("/groupList-skipScrollToGroup", true);
            oModel.setProperty("/groups", aGroups);

            window.setTimeout(function () {
                oModel.setProperty("/groupList-skipScrollToGroup", false);
            }, 1000);

            if (oGroup.isDefaultGroup) {
                that.toggleDefaultGroupVisibility(false);
            }

            this._addRequest($.proxy(function () {
                var oGroup = this.oModel.getProperty(this._getPathOfGroup(sGroupId));
                try {
                    oResultPromise = this.oPageBuilderService.moveGroup(oGroup.object, iToIndex);
                } catch (err) {
                    this._resetGroupsOnFailure("fail_to_move_group_msg");
                    return;
                }
                oResultPromise.fail(this._handleAfterSortable(this._resetGroupsOnFailureHelper("fail_to_move_group_msg")));
                oResultPromise.always($.proxy(this._checkRequestQueue, this));
            }, this));
        },

        /*
         * toIndex - The index in the UI of the required group new index. (it is not including the group itself)
         * groups - The list of groups in the model (including hidden and visible groups)
         * The function returns the new index to be used in the model - since there might be hidden groups that should be taken in account
         */
        _adjustToGroupIndex : function(toIndex, groups, groupId ){
                var visibleCounter = 0,
                    bIsGroupIncluded = false,
                    i = 0;
                // In order to get the new index, count all groups (visible+hidden) up to the new index received from the UI.
                for (i = 0; i < groups.length && visibleCounter < toIndex; i++) {
                    if (groups[i].isGroupVisible) {
                        if (groups[i].groupId === groupId) {
                            bIsGroupIncluded = true;
                        } else {
                            visibleCounter++;
                        }
                    }
                }
                if (bIsGroupIncluded) {
                    return i - 1;
                }
                return i;
        },

        _adjustFromGroupIndex : function(index, groups){

        	var visibleGroupsCounter = 0;
        	for(var i=0; i<groups.length; i++){
        		if(groups[i].isGroupVisible){
        			visibleGroupsCounter++;
        		}
        		if(visibleGroupsCounter === index+1){
        			return i;
        		}
        	}
        	//Not suppose to happen, but if not found return the input index
        	return index;
        },
        /*
         * oData should have the following parameters
         * groupId
         * newTitle
         */
        _changeGroupTitle : function (sChannelId, sEventId, oData) {
            var sNewTitle = oData.newTitle,
                sGroupId = oData.groupId,
                nGroupIndex = this._getIndexOfGroup(sGroupId),
                oGroup = this.oModel.getProperty("/groups/" + nGroupIndex),
                oResultPromise;

            this.oModel.setProperty("/groups/" + nGroupIndex + "/title", sNewTitle);

            // Check, if the group has already been persisted.
            if (!oGroup.object) {
                // Add the group in the backend.
                this._addRequest($.proxy(function () {
                    try {
                        oResultPromise = this.oPageBuilderService.addGroup(sNewTitle);
                    } catch (err) {
                        this._resetGroupsOnFailure("fail_to_create_group_msg");
                        return;
                    }

                    oResultPromise.done(this._handleAfterSortable($.proxy(function (sGroupId, oNewGroup) {
                        var nGroupIndex = this._getIndexOfGroup(sGroupId);
                        this._loadGroup(nGroupIndex, oNewGroup);
                    }, this, sGroupId)));

                    oResultPromise.fail( this._handleAfterSortable(this._resetGroupsOnFailureHelper("fail_to_create_group_msg")));
                }, this));
            } else {
                // Rename the group in the backend.
                // model is already changed - it only has to be made persistent in the backend
                this._addRequest($.proxy(function () {
                    try {
                        oResultPromise = this.oPageBuilderService.setGroupTitle(oGroup.object, sNewTitle);
                    } catch (err) {
                        this._resetGroupsOnFailure("fail_to_rename_group_msg");
                        return;
                    }

                    // Revert to the old title.
                    oResultPromise.fail(this._handleAfterSortable($.proxy(function (sGroupId, sOldTitle) {
                        var sGroupPath = this._getPathOfGroup(sGroupId);
                        this._showLocalizedError("fail_to_rename_group_msg");
                        this.oModel.setProperty(sGroupPath + "/title", sOldTitle);
                        this._requestFailed();
                    }, this, sGroupId)));
                }, this));
            }

            oResultPromise.always($.proxy(this._checkRequestQueue, this));
        },

        _createTile : function (oData) {
            var oCatalogTileContext = oData.catalogTileContext,
                oContext = oData.groupContext,
                oGroup = this.oModel.getProperty(oContext.getPath()),
                sGroupId = oGroup.groupId,
                oResultPromise,
                deferred = jQuery.Deferred(),
                oResponseData = {};

            //publish event for UserActivityLog
            var oBus = sap.ui.getCore().getEventBus();
            $.proxy(oBus.publish, oBus, "launchpad", "addTile", {
                catalogTileContext : oCatalogTileContext,
                groupContext: oContext
            });

            if (oContext.getObject().isDefaultGroup) {
                this.toggleDefaultGroupVisibility(true);
            }

            if (!oCatalogTileContext) {
                jQuery.sap.log.warning("DashboardManager: Did not receive catalog tile object. Abort.", this);
                return;
            }

            this._addRequest($.proxy(function () {
                try {
                    oResultPromise = this.oPageBuilderService.addTile(oCatalogTileContext.getProperty("src"), oContext.getProperty("object"));
                } catch (err) {
                    this._resetGroupsOnFailure("fail_to_add_tile_msg");
                    return;
                }

                var that = this;
                oResultPromise
                    .done(this._handleAfterSortable($.proxy(function (sGroupId, oTile) {
                        var sGroupPath = this._getPathOfGroup(sGroupId);
                        this._addTileToGroup(sGroupPath, oTile);
                        oResponseData = {group: oGroup, status: 1, action: 'add'}; // 1 - success
                        deferred.resolve(oResponseData);
                    }, this, sGroupId)))
                     .fail(function() {
                        oResponseData = {group: oGroup, status: 0, action: 'add'};  // 0 - failure
                        deferred.resolve(oResponseData);
                    })
                    .always(
                        function(){
                            that._checkRequestQueue();
                    });
            }, this));

            return deferred.promise();
        },

        _createGroupAndSaveTile : function (oData) {
            var oCatalogTileContext = oData.catalogTileContext,
                sNewTitle = oData.newGroupName,
                oResultPromise,
                deferred = jQuery.Deferred(),
                that = this,
                oResponseData = {};

            if (sap.ushell.utils.validHash(sNewTitle) && oCatalogTileContext){

                var oGroup = this._getGroupModel(null),
                    aGroups = this.oModel.getProperty("/groups"),
                    oBus = sap.ui.getCore().getEventBus(),
                    sGroupId = oGroup.groupId;

                var index = aGroups.length;
                this.oModel.setProperty("/groups/" + index, oGroup);
                this.oModel.setProperty("/groups/" + index + "/title", sNewTitle);

                if (!oCatalogTileContext) {
                    jQuery.sap.log.warning("DashboardManager: Did not receive catalog tile object. Abort.", this);
                    return;
                }

                // Create new group
                this._addRequest($.proxy(function () {
                    try {
                        oResultPromise = this.oPageBuilderService.addGroup(sNewTitle);
                    } catch (err) {
                        this._resetGroupsOnFailure("fail_to_create_group_msg");
                        return;
                    }

                    oResultPromise.done(this._handleAfterSortable($.proxy(function (sGroupId, oNewGroup) {
                        var nGroupIndex = this._getIndexOfGroup(sGroupId);

                        this._loadGroup(nGroupIndex, oNewGroup);

                        var oContext = new sap.ui.model.Context(this.oModel, "/groups/" + nGroupIndex);

                        var promise = this._createTile({
                            catalogTileContext : oCatalogTileContext,
                            groupContext: oContext
                        });

                        promise.done(function(data){
                            oResponseData = {group: data.group, status: 1, action: 'addTileToNewGroup'}; // 1 - success
                            deferred.resolve(oResponseData);
                        }).fail(function(data){
                            oResponseData = {group: data.group, status: 0, action: 'addTileToNewGroup'}; // 0 - failure
                            deferred.resolve(oResponseData);
                        });
                    }, this, sGroupId)));

                    oResultPromise.fail(function(data){
                        this._handleAfterSortable(this._resetGroupsOnFailureHelper("fail_to_create_group_msg"));
                        oResponseData = {group: data.group, status: 0, action: 'createNewGroup'}; // 0 - failure
                        deferred.resolve(oResponseData); // 0 - failure
                    });

                    oResultPromise.always($.proxy(this._checkRequestQueue, this));
                }, this));
            }
            return deferred.promise();
        },

        /*
         * Dashboard
         * oData should have the following parameters
         * tileId
         * groupId
         */
        _deleteTile : function (sChannelId, sEventId, oData) {
            var that = this,
                sTileId = oData.tileId,
                aGroups = this.oModel.getProperty("/groups");

            jQuery.each(aGroups, function (nGroupIndex, oGroup) {
                var bFoundFlag = false;
                jQuery.each(oGroup.tiles, function (nTileIndex, oTmpTile) {
                    if (oTmpTile.uuid === sTileId) {
                        // Remove tile from group.
                        that._destroyTileModel("/groups/" + nGroupIndex + "/tiles/" + nTileIndex);
                        var oTile = oGroup.tiles.splice(nTileIndex, 1)[0],
                            oResultPromise;

                        that.oModel.setProperty("/groups/" + nGroupIndex + "/tiles", oGroup.tiles);

                        if (oGroup.isDefaultGroup && oGroup.tiles.length == 0) {
                            that.toggleDefaultGroupVisibility(false);
                        }

                        that._addRequest(function () {
                            try {
                                oResultPromise = that.oPageBuilderService.removeTile(oGroup.object, oTile.object);
                            } catch (err) {
                                this._resetGroupsOnFailure("fail_to_remove_tile_msg");
                                return;
                            }

                            oResultPromise.done(that._handleAfterSortable(function () {
                                var sTileName = sap.ushell.Container.getService("LaunchPage").getTileTitle(oTile.object);
                                if (sTileName) {
                                    that._showLocalizedMessage("tile_deleted_msg", [sTileName]);
                                } else {
                                    that._showLocalizedMessage("empty_tile_deleted_msg");
                                }

                            }.bind(oTile)));
                            oResultPromise.fail(that._handleAfterSortable(that._resetGroupsOnFailureHelper("fail_to_remove_tile_msg")));
                            oResultPromise.always( $.proxy(that._checkRequestQueue, that) );
                        });
                        sap.ushell.utils.handleTilesVisibility();
                        bFoundFlag = true;
                        return false;
                    }
                });
                if (bFoundFlag) {
                    return false;
                }
            });
        },

        _sendDeleteTileRequest : function (oGroup, oTile) {
            var oResultPromise,
                tmpPageBuilderService = sap.ushell.Container.getService('LaunchPage');
            try {
                oResultPromise = tmpPageBuilderService.removeTile(oGroup, oTile.object);
            } catch (err) {
                jQuery.sap.log.error("_deleteCatalogTileFromGroup ; removeTile ; Exception occurred: " + err);
            }

            return oResultPromise;
        },

        /*
         * Delete all instances of a catalog Tile from a Group  
         */
        _deleteCatalogTileFromGroup : function (oData) {
            var that = this,
                sDeletedTileCatalogId = decodeURIComponent(oData.tileId),
                iGroupIndex = oData.groupIndex,
                oGroup = this.oModel.getProperty("/groups/" + iGroupIndex),
                aTiles = this.oModel.getProperty("/groups/" + iGroupIndex + "/tiles/"),
                serv = sap.ushell.Container.getService("LaunchPage"),
                deferred = jQuery.Deferred(),
                aDeleteTilePromises = [],
                sTmpTileCatalogId,
                index,
                that = this,
                aFilteredTiles;

                aFilteredTiles = oGroup.tiles.filter(
                        function (oTile) {
                            var sTmpTileCatalogId = serv.getCatalogTileId(oTile.object);
                            if (sTmpTileCatalogId !== sDeletedTileCatalogId) {
                                return true;
                            } else {
                                // Initialize oPositiveDeferred object that will later be resolved with the status of the delete request
                                var oPositiveDeferred = jQuery.Deferred(),
                                // Send the delete request to the server
                                oDeletePromise = that._sendDeleteTileRequest(oGroup.object, oTile );

                                oDeletePromise.done(
                                    (function (deferred) {
                                        return function () {
                                            deferred.resolve({status: true});
                                        }
                                    })(oPositiveDeferred));

                                oDeletePromise.fail(
                                    (function (deferred) {
                                        return function () {
                                            deferred.resolve({status: false});
                                        }
                                    })(oPositiveDeferred));

                                aDeleteTilePromises.push(oPositiveDeferred);

                                return false;
                            }
                });

                oGroup.tiles = aFilteredTiles;

                // Wait for all of the delete requests before resolving the deferred
                jQuery.when.apply(jQuery, aDeleteTilePromises).
                	done(
                		function( result ){
                            var bSuccess = true,
                                index = 0,
                                promisesLength = aDeleteTilePromises.length;
		                    // Check if at least one deleteTilePromises has failure status
		                	for ( index; index < promisesLength; index++) {
		                	    if( ! result.status) {
                                    bSuccess = false;
		                			break;
		                        }
		                	}
                            if(bSuccess){
                             //   that.oModel.setProperty("/groups/" + iGroupIndex + "/tiles/", oGroup.tiles);
                            	that.oModel.setProperty("/groups/" + iGroupIndex, oGroup );
                            }

                            deferred.resolve({group: oGroup, status: bSuccess, action: 'remove'});
                        });
            return deferred.promise();
        },

        /*
         * oData should have the following parameters:
         * fromGroupId
         * toGroupId
         * fromIndex
         * toIndex can be null => append as last tile in group
         */
        _moveTile : function (sChannelId, sEventId, oData) {
            var that = this,
                nNewIndex = oData.toIndex,
                sNewGroupId = oData.toGroupId,
                sTileId = oData.sTileId,

                oTile,
                nTileIndex,

                oOldGroup,
                nOldGroupIndex,

                oNewGroup,
                nNewGroupIndex,

                aGroups = this.oModel.getProperty("/groups");

            jQuery.each(aGroups, function (nTmpGroupIndex, oTmpGroup) {
                var bFoundFlag = false;
                jQuery.each(oTmpGroup.tiles, function (nTmpTileIndex, oTmpTile) {
                    if (oTmpTile.uuid === sTileId) {
                        oTile = oTmpTile;
                        nTileIndex = nTmpTileIndex;
                        oOldGroup = oTmpGroup;
                        nOldGroupIndex = nTmpGroupIndex;
                        bFoundFlag = true;
                        return false;
                    }
                });
                if (bFoundFlag) {
                    return false;
                }
            });
            jQuery.each(aGroups, function (nTmpGroupIndex, oTmpGroup) {
                if (oTmpGroup.groupId === sNewGroupId) {
                    oNewGroup = oTmpGroup;
                    nNewGroupIndex = nTmpGroupIndex;

                    if (oOldGroup.isDefaultGroup && nOldGroupIndex != nNewGroupIndex && oOldGroup.tiles.length <= 1) {
                        that.toggleDefaultGroupVisibility(false);
                    }
                }
            });

            // When a tile is dragged into an empty group, the Plus-Tiles in the empty list cause
            // the new index to be off by one, i.e. 1 instead of 0, which causes an error.
            // This is a generic check which sanitizes the values if necessary.
            if (nNewIndex && nNewIndex > oNewGroup.tiles.length) {
                nNewIndex = oNewGroup.tiles.length;
            }

            if (oOldGroup.groupId === sNewGroupId) {
                if (nNewIndex === null || nNewIndex === undefined) {
                    // moved over group list to same group
                    oOldGroup.tiles.splice(nTileIndex, 1);
                    // Tile is appended. Set index accordingly.
                    nNewIndex = oOldGroup.tiles.length;
                    // append as last item
                    oOldGroup.tiles.push(oTile);
                } else {
                    nNewIndex = this._adjustTileIndex(nNewIndex, oTile, oOldGroup);
                    this._moveInArray(oOldGroup.tiles, nTileIndex, nNewIndex);
                }

                this.oModel.setProperty("/groups/" + nOldGroupIndex + "/tiles", oOldGroup.tiles);
            } else {
                // remove from old group
                oOldGroup.tiles.splice(nTileIndex, 1);
                this.oModel.setProperty("/groups/" + nOldGroupIndex + "/tiles", oOldGroup.tiles);

                // add to new group
                if (nNewIndex === null || nNewIndex === undefined) {
                    // Tile is appended. Set index accordingly.
                    nNewIndex = oNewGroup.tiles.length;
                    // append as last item
                    oNewGroup.tiles.push(oTile);
                } else {
                    nNewIndex = this._adjustTileIndex(nNewIndex, oTile, oNewGroup);
                    oNewGroup.tiles.splice(nNewIndex, 0, oTile);
                }
                this.oModel.setProperty("/groups/" + nNewGroupIndex + "/tiles", oNewGroup.tiles);
            }
            // Re-calculate the visibility of the Tiles
            sap.ushell.utils.handleTilesVisibility();

            // change in backend
            var oSourceGroup = this.oModel.getProperty("/groups/" + nOldGroupIndex).object,
                oTargetGroup = this.oModel.getProperty("/groups/" + nNewGroupIndex).object,
                oResultPromise;

            this._addRequest($.proxy(function () {
                try {
                    oResultPromise = this.oPageBuilderService.moveTile(oTile.object, nTileIndex, nNewIndex, oSourceGroup, oTargetGroup);
                } catch (err) {
                    this._resetGroupsOnFailure("fail_to_move_tile_msg");
                    return;
                }

                oResultPromise.done(this._handleAfterSortable($.proxy(function (sTileId, oTargetTile) {
                    var sTilePath = this._getPathOfTile(sTileId),
                        srvc = this.oPageBuilderService;

                    // If we cannot find the tile, it might have been deleted -> Check!
                    if(sTilePath) {
                        // Update the model with the new tile.
                        this.oModel.setProperty(sTilePath + "/object", oTargetTile);
                    }
                }, this, sTileId)));

                oResultPromise.fail(this._handleAfterSortable(this._resetGroupsOnFailureHelper("fail_to_move_tile_msg")));
                oResultPromise.always($.proxy(this._checkRequestQueue, this));
            }, this));
        },

        // Adjust the moved-tile new index according to the visible+hidden tiles
        _adjustTileIndex : function (newLocationIndex, oTile, newGroup) {
            var visibleCounter = 0,
                bIsTileIncluded = false,
                i = 0;
            // In order to get the new index, count all tiles (visible+hidden) up to the new index received from the UI.
            for (i = 0; i < newGroup.tiles.length && visibleCounter < newLocationIndex; i++) {
                if (newGroup.tiles[i].isTileIntentSupported) {
                    if (newGroup.tiles[i] === oTile) {
                        bIsTileIncluded = true;
                    } else {
                        visibleCounter++;
                    }
                }
            }
            if (bIsTileIncluded) {
                return i - 1;
            }
            return i;
        },

        //  Set default Group visibility
        toggleDefaultGroupVisibility : function (bVisible) {
            var oDashboardItem = this.oDashboardView.oDashboardGroupsBox.getGroups()[0],
            oGroupListItem;
    	    // In case GroupList exists on the DOM .
            if (sap.ui.getCore().byId('groupList')) {
                oGroupListItem = sap.ui.getCore().byId('groupList').oGroupList.getItems()[0];
                if (oGroupListItem) {
            	// Hide/Show the Default Group in the group list
                    oGroupListItem.setShow(bVisible);
                }
            }
            if (oDashboardItem) {
                oDashboardItem.setVisible(bVisible);
            }
        },

        // temporary - should not be exposed
        getModel : function () {
            return this.oModel;
        },

        getDashboardView : function () {
            if (!sap.ui.getCore().byId('dashboard')) {
                this.oDashboardView = sap.ui.jsview("dashboard", "sap.ushell.renderers.fiori2.launchpad.dashboard.DashboardContent");
            }
            return this.oDashboardView;
        },

        getGroupListView : function () {
            if (!sap.ui.getCore().byId('groupList')) {
                this.oGroupListView = sap.ui.jsview("groupList", "sap.ushell.renderers.fiori2.launchpad.group_list.GroupList");
            }
            return this.oGroupListView;
        },

        // CATALOG LOADING

        loadAllCatalogs : function (sChannelId, sEventId, oData) {
        	if (!this.oModel.getProperty("/catalogs") ||
                    !sap.ushell.Container.getService("LaunchPage").isCatalogsValid()) {
                var that = this;

                // catalog also needs groups 
                if (!this.oModel.getProperty("/groups") || this.oModel.getProperty("/groups").length === 0 ) {
                    this.loadPersonalizedGroups();
                }
                this.numOfLoadedCatalogs = 0;
                this._destroyAllGroupModels("/catalogs");
                this._destroyAllTileModels("/catalogTiles");
                // Clear existing Catalog items
                this.oModel.setProperty("/catalogs", []);
                this.oModel.setProperty("/catalogTiles", []);
                // Trigger loading of catalogs
                sap.ushell.Container.getService("LaunchPage").getCatalogs()
                //once all catalogs are loaded, check for errors
                .done(this.onDoneLoadingCatalogs.bind(this))
                //in case of a severe error, show an error message
                .fail(that._showLocalizedErrorHelper("fail_to_load_catalog_msg"))
                //for each loaded catalog, add it to the model
                .progress(this.addCatalogToModel.bind(this));
            }
            var aGroups = this.getModel().getProperty("/groups");
        	if (aGroups && aGroups .length !== 0) {
            	this.mapCatalogTilesToGroups();
            	// update the catalogTile model after mapCatalogTilesToGroups() was called
            	this.updateCatalogTilesToGroupsMap();
            }
        },

        updateCatalogTilesToGroupsMap : function () {
            var catalogTiles = this.getModel().getProperty("/catalogTiles"),
	    	tile,
	    	index,
	    	tileId,
	    	associatedGrps,
	    	aGroups;
            var srvc = sap.ushell.Container.getService("LaunchPage");
            var catalogTilesModel = this.getModel().getProperty("/catalogTiles");
            // if the catalogTile model doesn't exist, it will be updated in some time later
            if (catalogTiles) {
              for (index = 0; index < catalogTiles.length; index++) {
                     tile = catalogTiles[index];
                     tileId = encodeURIComponent(srvc.getCatalogTileId(tile.src));
                     associatedGrps = this.getModel().getProperty("/catalogTiles/" + index + "/associatedGroups");
                     aGroups = this.oTileCatalogToGroupsMap[tileId];
                     associatedGrps = aGroups ? aGroups : [] ;
                     catalogTilesModel[index].associatedGroups = associatedGrps;
              }
            }
            this.getModel().setProperty("/catalogTiles", catalogTilesModel);
        },

        addCatalogToModel : function (oCatalog){
            var aCurrentCatalogs = this.oModel.getProperty('/catalogs');
            var srvc = sap.ushell.Container.getService("LaunchPage");
            var sCatalogId = srvc.getCatalogId(oCatalog);
            var bCatalogExist = false;
            //check if the catalog already exist in the model
            aCurrentCatalogs.forEach(function (oCat){
               if (oCat.id === sCatalogId){
                   bCatalogExist = true;
               }
            });

            if (!bCatalogExist) {
                var oCatalogModel = {
                    title: srvc.getCatalogTitle(oCatalog),
                    id: srvc.getCatalogId(oCatalog),
                    "static": false,
                    tiles: []
                };
                srvc.getCatalogTiles(oCatalog).done(function (aTiles) {
                    //if this catalog has no tiles we do not need to add it to the model
                    if (!aTiles.length) {
                        return;
                    }
                    var oCatalogData = {
                        catalog: oCatalogModel.title,
                        id: oCatalogModel.id,
                        index: this.numOfLoadedCatalogs
                    };
                    this.setCatalogTiles("/catalogTiles", true, oCatalogData, aTiles);
                    oCatalogModel.numIntentSupportedTiles = getNumIntentSupportedTiles.call(this, oCatalogModel);
                    aCurrentCatalogs.push(oCatalogModel);
                    this.oModel.setProperty('/catalogs', aCurrentCatalogs);
                    this.numOfLoadedCatalogs++;
                }.bind(this)
                ).fail(this._showLocalizedErrorHelper("fail_to_load_catalog_tiles_msg"));
            }
        },

        onDoneLoadingCatalogs : function (aCatalogs) {
            var srvc = sap.ushell.Container.getService("LaunchPage");
            var aLoadedCatalogs = aCatalogs.filter(function (oCatalog) {
                return !srvc.getCatalogError(oCatalog);
            });
            //check if some of the catalogs failed to load
            if (aLoadedCatalogs.length !== aCatalogs.length){
                this._showLocalizedError("partialCatalogFail");
            }
            var aCurrentCatalogs = this.oModel.getProperty('/catalogs');
            //filter out the "Loading Catalogs..." menu item if exists
            if (aCurrentCatalogs[0] && aCurrentCatalogs[0].title === sap.ushell.resources.i18n.getText('catalogsLoading')) {
                aCurrentCatalogs.splice(0, 1);
            }
            //create the "All" static entry for the catalogSelect menu
            aCurrentCatalogs.splice(0, 0, {
                title : getLocalizedText("all"),
                "static" : true,
                tiles : [],
                numIntentSupportedTiles : -1//only in order to present this option in the Catalog.view (dropdown menu)since there is a filter there on this property
            });
            this.oModel.setProperty('/catalogs', aCurrentCatalogs);
            sap.ushell.utils.handleTilesVisibility();
        },

        setCatalogTiles : function (sPath, bAppend, oData, aCatalogTiles) {
            var srvc = sap.ushell.Container.getService("LaunchPage");

            // Fill tile info for current catalog
            this.oModel.setProperty(sPath, $.merge((bAppend && this.oModel.getProperty(sPath)) || [], $.map(
                aCatalogTiles,
                function (oCatalogTile, iTile) {
                    var catalogTileId = encodeURIComponent(srvc.getCatalogTileId(oCatalogTile)),
                    	associatedGrps = this.oTileCatalogToGroupsMap[catalogTileId] || [];

                    return {
                	    associatedGroups : associatedGrps,
                        src : oCatalogTile,
                        catalog : oData.catalog,
                        catalogIndex : oData.index * 100000 + iTile,
                        catalogId : oData.id,
                        title : srvc.getCatalogTileTitle(oCatalogTile),
                        keywords : (srvc.getCatalogTileKeywords(oCatalogTile) || []).join(','),
                        id : catalogTileId,
                        size : srvc.getCatalogTileSize(oCatalogTile),
                        content : [srvc.getCatalogTileView(oCatalogTile)],
                        isTileIntentSupported : srvc.isTileIntentSupported(oCatalogTile)
                    };
                }.bind(this)
            )));
        },

        mapCatalogTilesToGroups : function () {

            this.oTileCatalogToGroupsMap = {};

            //Calculate the relation between the CatalogTile and the instances.
            var oGroups = this.oModel.getProperty("/groups"),
            	srvc = sap.ushell.Container.getService("LaunchPage"),
                indexGrps = 0,
                oGroup,
        	    tileInd,
        	    oTiles,
        	    tileId,
    		    tileGroups,
    		    groupId;

            for (indexGrps = 0; indexGrps < oGroups.length; indexGrps++) {
            	oGroup = oGroups[indexGrps];
            	oTiles = oGroup.tiles;

	        	if (oTiles) {
	        	    for (tileInd = 0; tileInd < oTiles.length; ++tileInd) {
		        		tileId = encodeURIComponent(srvc.getCatalogTileId(oTiles[tileInd].object));
		        		tileGroups = this.oTileCatalogToGroupsMap[tileId] || [];
		        		groupId = srvc.getGroupId(oGroup.object);
		        		if (tileGroups.indexOf(groupId) === -1 && (typeof (oGroup.isGroupVisible) === 'undefined' || oGroup.isGroupVisible)) {
		        			tileGroups.push(groupId);
		        		}
		        		this.oTileCatalogToGroupsMap[tileId] = tileGroups;
	        	    }
	        	}
            }
        },

        /**
         * Shows a localized message in the Message-Toast.
         * @param {string} sMsgId
         *      The localization id of the message
         * @param {object} oParams
         *      Additional parameters for the Message Toast showing the message. Can be undefined.
         * @param {sap.ushell.services.Message.Type} [iType=sap.ushell.services.Message.Type.INFO]
         *      The message type (optional)
         */
        _showLocalizedMessage : function (sMsgId, oParams, iType) {
            sap.ushell.Container.getService("Message").show(iType || sap.ushell.services.Message.Type.INFO, getLocalizedText(sMsgId, oParams), oParams);
        },
        /**
         * Shows a localized error message in the Message-Toast.
         * @param {string} sMsgId
         *      The localization id of the message
         * @param {object} oParams
         *      Additional parameters for the Message Toast showing the message. Can be undefined.
         *
         */
        _showLocalizedError : function (sMsgId, oParams) {
            this._showLocalizedMessage(sMsgId, oParams, sap.ushell.services.Message.Type.ERROR);
        },

        /**
         * A wrapper for _showLocalizedError to reduce boilerplate code in error handling.
         * @param {string} sMsgId
         *      The localization id of the message
         * @param {object} oParams
         *      Additional parameters for the Message Toast showing the message. Can be undefined.
         * @returns {Function}
         *      A function that will call _showLocalizedError with the given parameters.
         */
        _showLocalizedErrorHelper : function (sMsgId, oParams) {
            var that = this;
            return function () {
                that._showLocalizedError(sMsgId, oParams);
            };
        },

        /**
         * Helper function to bind an error message to a reset-function, which reloads all groups
         * from a group array when called.
         * @param {string} sMsgId
         *      The id of the localized string.
         * @returns {Function}
         *      The reset function, which returns the dashboard into an consistent state.
         */
        _resetGroupsOnFailureHelper : function (sMsgId) {
            var that = this;
            return function (aGroups) {
                that._showLocalizedError(sMsgId);
//                that._requestFailed();

                // Give the Toast a chance to be shown before the reload freezes the screen.
                setTimeout(function () {
                    that.loadGroupsFromArray(aGroups);
                });
            };
        },

        /**
         * Helper function to reset groups after a backend failure.
         * @param {string} sMsgId
         *      The id of the localized string.
         */
        _resetGroupsOnFailure : function (sMsgId, aParameters) {
            this._requestFailed();
            this._showLocalizedError(sMsgId, aParameters);
            this.loadPersonalizedGroups();
            this.oModel.updateBindings(true);
        },

        /**
         * Load all groups in the given array. The default group will be loaded first.
         * @param aGroups
         *      The array containing all groups (including the default group).
         */
        loadGroupsFromArray : function (aGroups) {
            var that = this;

            this.oPageBuilderService.getDefaultGroup().done(function (oDefaultGroup) {
                var i,
                    k = 1;

                that._loadGroup(0, oDefaultGroup);
                for (i = 0; i < aGroups.length; ++i) {
                    if (aGroups[i] !== oDefaultGroup) {
                        that._loadGroup(k, aGroups[i]);
                        k++;
                    }
                }
                for (i = aGroups.length; i < that.oModel.getProperty("/groups/length"); ++i) {
                    that._destroyGroupModel("/groups/" + i);
                }
                //set new length in case there are less new groups
                that.oModel.setProperty("/groups/length", aGroups.length);

                if (that.oModel.getProperty('/currentState/stateName') === "catalog") {
                	// update the catalogTile's groups mapping, and update the catalogTile
                	// model if nedded only when in the catalog flow
                	that.mapCatalogTilesToGroups();
                	that.updateCatalogTilesToGroupsMap();
                }
            }).fail(that._resetGroupsOnFailureHelper("fail_to_get_default_group_msg"));
        },

        /**
         * Load all tiles in a group and add the group to the internal model.
         * @param nIndex
         *      The index at which the group should be added. 0 is reserved for the default group.
         * @param oGroup
         *      The group as it is returned by the UI2 services.
         */
        _loadGroup : function (nIndex, oGroup) {
            var that = this,
                sGroupPath = "/groups/" + nIndex;
            this._destroyGroupModel(sGroupPath);
            // Set group on model
            var sOldGroupId = this.oModel.getProperty(sGroupPath + "/groupId"),
                oNewGroupModel = this._getGroupModel(oGroup, nIndex === 0);

            // If the group already exists, keep the id. The backend-handlers relay on the id staying the same.
            if(sOldGroupId) {
                oNewGroupModel.groupId = sOldGroupId;
            }

            oNewGroupModel.index = nIndex;
            this.oModel.setProperty(sGroupPath, oNewGroupModel);
        },

        _getGroupModel : function (oGroup, bDefault) {
            var srvc = this.oPageBuilderService,
                aGroupTiles = (oGroup && srvc.getGroupTiles(oGroup)) || [],
                aModelTiles = [],
                i,
                isSortable;

            if (sap.ui.getCore().byId("shell") && sap.ui.getCore().byId("shell").getModel()) {
            	isSortable = sap.ui.getCore().byId("shell").getModel().getProperty("/personalization");
            }

            for (i = 0; i < aGroupTiles.length; ++i) {
                aModelTiles.push(this._getTileModel(aGroupTiles[i]));
            }

            return {
                title           : (bDefault && getLocalizedText("my_group")) ||
                                  (oGroup && srvc.getGroupTitle(oGroup)) ||
                                  "",
                object          : oGroup,
                groupId         : jQuery.sap.uid(),
                tiles           : aModelTiles,
                isDefaultGroup  : bDefault || false,
                editMode        : !oGroup,
                removable       : !oGroup || srvc.isGroupRemovable(oGroup),
                sortable        : isSortable,
                isGroupVisible  : !oGroup || srvc.isGroupVisible(oGroup),
                isEnabled       : !bDefault //Currently only default groups is considered as locked
            };
        },

        _addTileToGroup : function (sGroupPath, oTile) {
            var sTilePath = sGroupPath + "/tiles",
                iNumTiles = this.oModel.getProperty(sTilePath).length;

            this.oModel.setProperty(sTilePath + "/" + iNumTiles, this._getTileModel(oTile));
        },

        _updateModelWithTileView : function(sTileUUID, oTileView){
            var that = this;

            //add the tile view to the update queue
            this.tileViewUpdateQueue.push({uuid: sTileUUID, view: oTileView});

            /*
            in order to avoid many updates to the model we wait to allow
            other tile update to accumulate in the queue.
            therefore we clear the previous call to update the model
            and create a new one
             */
            if(this.tileViewUpdateTimeoutID){
                clearTimeout(this.tileViewUpdateTimeoutID);
            }
            this.tileViewUpdateTimeoutID = setTimeout(function(){
                that.tileViewUpdateTimeoutID = undefined;
                /*
                we wait with the update till the personalization operation is done
                to avoid the rendering of the tiles during D&D operation
                 */
                that.oSortableDeferred.done(function(){
                    that._updateModelWithTilesViews();
                });
            }, 50);
        },

        _updateModelWithTilesViews : function(){
            var aGroups = this.oModel.getProperty("/groups"),
                aTiles,
                oTileModel,
                oUpdatedTile,
                sSize;

            if (!aGroups) {
                return;
            }

            /*
            go over the tiles in the model and search for tiles to update.
            tiles are identified using uuid
             */
            for (var i = 0; i < aGroups.length; i = i + 1) {
                //group loop - get the groups tiles
                aTiles = aGroups[i].tiles;
                for (var j = 0; j < aTiles.length; j = j + 1) {
                    //group tiles loop - get the tile model
                    oTileModel = aTiles[j];
                    for (var q = 0; q < this.tileViewUpdateQueue.length; q++){
                        //updated tiles view queue loop - check if the current tile was updated
                        oUpdatedTile = this.tileViewUpdateQueue[q];
                        if(oTileModel.uuid == oUpdatedTile.uuid){
                            if(oUpdatedTile.view){
                                /*
                                 if view is provided then we destroy the current content
                                 (TileState control) and set the tile view
                                 */
                                oTileModel.content[0].destroy();
                                oTileModel.content = [oUpdatedTile.view];
                            }
                            else{
                                //some error on getTileView, therefore we set the state to 'Failed'
                                oTileModel.content[0].setState("Failed");
                            }
                            /*
                             in some cases tile size can be different then the initial value
                             therefore we read and set the size again
                             */
                            sSize = this.oPageBuilderService.getTileSize(oTileModel.object);
                            oTileModel['long'] = ((sSize !== null) && (sSize === "1x2" || sSize === "2x2")) || false;
                            oTileModel.tall = ((sSize !== null) && (sSize === "2x1" || sSize === "2x2")) || false;
                            break;
                        }
                    }
                }
            }

            //clear the update queue and set the model
            this.tileViewUpdateQueue = [];
            this.oModel.setProperty("/groups", aGroups);
        },

        _getTileModel : function (oTile) {
            var srvc = this.oPageBuilderService,
                sSize = srvc.getTileSize(oTile),
                sTileUUID = jQuery.sap.uid(),
                oTileView,
                fUpdateModelWithView,
                that = this,
                oDfd;;

            // first we set visibility of tile to false
            // before we get the tile's model etc.
            srvc.setTileVisible(oTile, false);

            oDfd = srvc.getTileView(oTile);

            /*
             register done and fail handlers for the getTileView API.
             */
            oDfd.done(function(oView){
                oTileView = oView;
                if(fUpdateModelWithView){
                    //call to the '_updateModelWithTileView' with uuid and view
                    fUpdateModelWithView.apply(that, [sTileUUID, oTileView]);
                }
            });
            oDfd.fail(function(){
                if(fUpdateModelWithView){
                    //call to the '_updateModelWithTileView' with uuid and no view to indicate failure
                    fUpdateModelWithView.apply(that, [sTileUUID]);
                }
                else{
                    // in case call is synchronise we set the view with 'TileState' control with 'Failed' status
                    oTileView = new sap.ushell.ui.launchpad.TileState({state: "Failed"});
                }
            });

            /*
             in case getTileView is asynchronous we set the 'fUpdateModelWithView' to handle the view
              update, and create a 'Loading' TileState control as the tile view
             */
            if(!oTileView){
                fUpdateModelWithView = this._updateModelWithTileView;
                oTileView = new sap.ushell.ui.launchpad.TileState({state: "Loading"});
            }

            return {
                "object"  : oTile,
                "uuid"    : sTileUUID,
                "content" : [oTileView],
                "long"    : ((sSize !== null) && (sSize === "1x2" || sSize === "2x2")) || false,
                "tall"    : ((sSize !== null) && (sSize === "2x1" || sSize === "2x2")) || false,
                "target"  : srvc.getTileTarget(oTile) || "",
                "debugInfo": srvc.getTileDebugInfo(oTile),
                "isTileIntentSupported": srvc.isTileIntentSupported(oTile),
                "rgba"  : ""
            };
        },

        _destroyAllGroupModels : function (oTarget) {
            var aGroups = (typeof oTarget === "string") ? this.oModel.getProperty(oTarget) : oTarget,
                i;
            if (aGroups) {
                for (i = 0; i < aGroups.length; i = i + 1) {
                    this._destroyGroupModel(aGroups[i]);
                }
            }
        },

        _destroyGroupModel : function (oTarget) {
            var oGroupModel = (typeof oTarget === "string") ? this.oModel.getProperty(oTarget) : oTarget,
                i;
            if (oGroupModel) {
                this._destroyAllTileModels(oGroupModel.tiles);
            }
        },

        _destroyAllTileModels : function (oTarget) {
            var aTiles = (typeof oTarget === "string") ? this.oModel.getProperty(oTarget) : oTarget,
                i;
            if (aTiles) {
                for (i = 0; i < aTiles.length; i = i + 1) {
                    this._destroyTileModel(aTiles[i]);
                }
            }
        },

        _destroyTileModel : function (oTarget) {
            var oTileModel = (typeof oTarget === "string") ? this.oModel.getProperty(oTarget) : oTarget,
                i;
            if (oTileModel && oTileModel.content) {
                for (i = 0; i < oTileModel.content.length; i = i + 1) {
                    oTileModel.content[i].destroy();
                }
            }
        },

        /**
         * Load all user groups from the backend. (Triggered on initial page load.)
         */
        loadPersonalizedGroups : function () {
            var that = this,
                oGroupsPromise = this.oPageBuilderService.getGroups();

            oGroupsPromise.done(function (aGroups) {
                that.loadGroupsFromArray(aGroups);
            });

            oGroupsPromise.fail(that._showLocalizedErrorHelper("fail_to_load_groups_msg"));
        }
    });
}());
