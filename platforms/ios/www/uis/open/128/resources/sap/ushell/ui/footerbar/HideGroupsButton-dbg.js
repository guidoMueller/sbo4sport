/*!
 * SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2013 SAP AG. All rights reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.control, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides control sap.ushell.ui.footerbar.HideGroupsButton.
jQuery.sap.declare("sap.ushell.ui.footerbar.HideGroupsButton");
jQuery.sap.require("sap.ushell.library");
jQuery.sap.require("sap.m.Button");


/**
 * Constructor for a new ui/footerbar/HideGroupsButton.
 * 
 * Accepts an object literal <code>mSettings</code> that defines initial 
 * property values, aggregated and associated objects as well as event handlers. 
 * 
 * If the name of a setting is ambiguous (e.g. a property has the same name as an event), 
 * then the framework assumes property, aggregation, association, event in that order. 
 * To override this automatic resolution, one of the prefixes "aggregation:", "association:" 
 * or "event:" can be added to the name of the setting (such a prefixed name must be
 * enclosed in single or double quotes).
 *
 * The supported settings are:
 * <ul>
 * <li>Properties
 * <ul></ul>
 * </li>
 * <li>Aggregations
 * <ul></ul>
 * </li>
 * <li>Associations
 * <ul></ul>
 * </li>
 * <li>Events
 * <ul></ul>
 * </li>
 * </ul> 
 *
 * 
 * In addition, all settings applicable to the base type {@link sap.m.Button#constructor sap.m.Button}
 * can be used as well.
 *
 * @param {string} [sId] id for the new control, generated automatically if no id is given 
 * @param {object} [mSettings] initial settings for the new control
 *
 * @class
 * A button to hide groups from the dashboard, for the UShell footerbar.
 * @extends sap.m.Button
 * @version 1.24.5
 *
 * @constructor
 * @public
 * @name sap.ushell.ui.footerbar.HideGroupsButton
 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
 */
sap.m.Button.extend("sap.ushell.ui.footerbar.HideGroupsButton", { metadata : {

	library : "sap.ushell"
}});


/**
 * Creates a new subclass of class sap.ushell.ui.footerbar.HideGroupsButton with name <code>sClassName</code> 
 * and enriches it with the information contained in <code>oClassInfo</code>.
 * 
 * <code>oClassInfo</code> might contain the same kind of informations as described in {@link sap.ui.core.Element.extend Element.extend}.
 *   
 * @param {string} sClassName name of the class to be created
 * @param {object} [oClassInfo] object literal with informations about the class  
 * @param {function} [FNMetaImpl] constructor function for the metadata object. If not given, it defaults to sap.ui.core.ElementMetadata.
 * @return {function} the created class / constructor function
 * @public
 * @static
 * @name sap.ushell.ui.footerbar.HideGroupsButton.extend
 * @function
 */


// Start of sap/ushell/ui/footerbar/HideGroupsButton.js
// Copyright (c) 2013 SAP AG, All Rights Reserved

(function () {
    "use strict";
    /*global jQuery, sap*/

    jQuery.sap.declare("sap.ushell.ui.footerbar.HideGroupsButton");
    jQuery.sap.require("sap.ushell.resources");

    /**
     * @name sap.ushell.ui.footerbar.HideGroupsButton
     */
    sap.ushell.ui.footerbar.HideGroupsButton.prototype.init = function (){
        this.setIcon('sap-icon://group-2');
        this.setTooltip(sap.ushell.resources.i18n.getText("hideGroupsBtn_tooltip"));
        this.setWidth('100%');
        this.setText(sap.ushell.resources.i18n.getText("hideGroupsBtn_title"));
        this.attachPress(this.openHideGroupsDialog);
        //call the parent sap.m.Button init method
        if (sap.m.Button.prototype.init) {
            sap.m.Button.prototype.init.apply(this, arguments);
        }
    };

    sap.ushell.ui.footerbar.HideGroupsButton.prototype.openHideGroupsDialog = function () {
        jQuery.sap.require("sap.m.Dialog");
        jQuery.sap.require("sap.m.Button");
        jQuery.sap.require("sap.m.Table");
        jQuery.sap.require("sap.m.Switch");

        var that = this;

        this.handleChange = function(event){
            var parent = event.oSource.getParent();
            parent.toggleStyleClass('hideGroupsTableItem');
            parent.getCells()[0].toggleStyleClass('hideGroupsDisabledCell');
        };

        this.groupsTableTemplate = new sap.m.ColumnListItem({
            cells: [
                new sap.m.Text({text: "{title}"}),
                new sap.m.Switch({state: "{isGroupVisible}", visible: "{isEnabled}", change: that.handleChange, customTextOff: " ", customTextOn: " ", tooltip: sap.ushell.resources.i18n.getText("hideGroups_switchTooltip")
                })
            ]
        });

        this.groupsTable = new sap.m.Table("hideGroupsTable", {
            backgroundDesign: sap.m.BackgroundDesign.Transparent,
            showSeparators: sap.m.ListSeparators.Inner,
            columns: [
                new sap.m.Column({
                    hAlign: sap.ui.core.TextAlign.Left,
                    vAlign: "Middle"
                }),
                new sap.m.Column({
                    hAlign: sap.ui.core.TextAlign.Right,
                    vAlign: "Middle",
                    width: "79px"
               })
            ]
        });
        this.groupsTable.addStyleClass('hideGroupsTable');

        var oOrigOnAfterRendering = this.groupsTable.onAfterRendering;
        this.groupsTable.onAfterRendering = function(event){
            oOrigOnAfterRendering.apply(that.groupsTable, arguments);
            
            var items = event.srcControl.mAggregations.items;
            if(items){
                for(var i=0; i<items.length; i++){
                    if(!items[i].getCells()[1].mProperties.state){ //if it is disabled, need to mark the row with different background color
                        items[i].addStyleClass('hideGroupsTableItem');
                        items[i].getCells()[0].addStyleClass('hideGroupsDisabledCell');
                    }
                }
            }
            setTimeout(function() { 
               $('.sapMListTblRow').first().focus();
            }, 200);
            
        }

        this.groupsTable.setModel(this.getModel());
        
        var personalizationEnabled = this.getModel().getProperty("/personalization");
        var emptyGroupFilter = [];
        //When personalization is disabled, empty groups should not appear in the Hide Groups dialog
        //(as they are also not appearing in the dashboard and group list)
        if (!personalizationEnabled){
        	emptyGroupFilter.push(new sap.ui.model.Filter("tiles/length", sap.ui.model.FilterOperator.GT, 0));
        }
        
        this.groupsTable.bindItems({
            path: "/groups",
            template: this.groupsTableTemplate,
            filters: emptyGroupFilter
        });

        this.saveButton = new sap.m.Button("saveBtn", {
            text: sap.ushell.resources.i18n.getText("okBtn"),
            press: function (){

            	setTimeout(function() {
            	    var oModel = this.getModel();
            	    var groups = oModel.getProperty('/groups');

                	if(groups){
                		var oLaunchPageSrv = sap.ushell.Container.getService("LaunchPage");
                		var aHiddenGroupsIDs = [];

                		for(var i=0; i<groups.length; i++){
                			if(!groups[i].isGroupVisible){
                				var id = oLaunchPageSrv.getGroupId(groups[i].object);
                				aHiddenGroupsIDs.push(id);
                			} 
                		}
                		oLaunchPageSrv.hideGroups(aHiddenGroupsIDs).done(function(){
                		    that.handleToastMessage(aHiddenGroupsIDs.length);
                		}).fail(function(){
                            var errorMsg = new sap.ushell.ui.launchpad.EmbeddedSupportErrorMessage("HideGroupsErrorMessage", {
                                title: sap.ushell.resources.i18n.getText("error"),
                                content: new sap.m.Text({
                                    text: sap.ushell.resources.i18n.getText("hideGroups_error")
                                })
                            });
                            errorMsg.open();
                		});

                		oModel.updateBindings('items');
                		oModel.updateBindings('groups');
                		//it seems we do not need to update the catalog groups (for the footer popup), as when opening the catalog, the filter is reapplied anyhow.
                	}
            	}.bind(this), 100);//There is a flickering when the dialog is closed in the first time. adding minimal timeout to prevent it.

            	this.oDialog.close();
            }.bind(this)
        });

        this.handleToastMessage = function(numOfHiddenGroups){
            var sMsg = "";
            if(typeof(numOfHiddenGroups) === undefined) return;

            if(numOfHiddenGroups === 0){  //All groups are visible on your home page
                sMsg = sap.ushell.resources.i18n.getText("hideGroups_none");
            }else if(numOfHiddenGroups === 1){//1 group is hidden on your home page
                sMsg = sap.ushell.resources.i18n.getText("hideGroups_single");
            }else{//{0} groups are hidden on your home page
                sMsg = sap.ushell.resources.i18n.getText("hideGroups_multiple", numOfHiddenGroups);
            }
            sap.ushell.Container.getService("Message").show(sap.ushell.services.Message.Type.INFO, sMsg);
        };

        this.cancelButton = new sap.m.Button("CancelBtn", {
            text: sap.ushell.resources.i18n.getText("cancelBtn"),
            press: function () {
                //Need to revert any model changes if took place by the user prior to pressing the cancel button
                if(that.aGroupsStates){
                    var groups = this.getModel().getProperty('/groups');
                    for(var i=0; i<that.aGroupsStates.length; i++){
                        if(groups[i].groupId === that.aGroupsStates[i].groupId){ //just to be sure that the groups order was not changed...if it was - skip this group (most chances are that there has been no change)
                            groups[i].isGroupVisible = that.aGroupsStates[i].isVisible;
                        }
                    }
                }
                this.oDialog.close();
            }.bind(this)
        });

        this.oDialog = new sap.m.Dialog({
            id: "groupsVisibilityDialog",
            title: sap.ushell.resources.i18n.getText("hideGroups_title"),
            contentWidth : "300px",
            stretch: jQuery.device.is.phone,
            content : this.groupsTable,
            beginButton: this.saveButton,
            endButton: this.cancelButton,
            initialFocus: "groupsVisibilityDialog",
            afterClose: function () {
                this.oDialog.destroy();
            }.bind(this)
        });

        this.getModelStates = function(groups){
            if(!groups) return;
            var aStates = [];
            for(var i=0; i<groups.length; i++){
                aStates.push({
                groupId: groups[i].groupId,
                isVisible: groups[i].isGroupVisible
                });
            }
            return aStates;
        }

        this.aGroupsStates = this.getModelStates(this.getModel().getProperty('/groups'));
        this.oDialog.open();
    };

}());
