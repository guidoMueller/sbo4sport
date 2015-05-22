/*!
 * SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2013 SAP AG. All rights reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.control, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides control sap.ushell.ui.launchpad.DeleteArea.
jQuery.sap.declare("sap.ushell.ui.launchpad.DeleteArea");
jQuery.sap.require("sap.ushell.library");
jQuery.sap.require("sap.ui.core.Control");


/**
 * Constructor for a new ui/launchpad/DeleteArea.
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
 * <ul>
 * <li>{@link #getType type} : sap.ushell.ui.launchpad.DeleteAreaType (default: sap.ushell.ui.launchpad.DeleteAreaType.Dashboard)</li>
 * <li>{@link #getMessage message} : string (default: '')</li>
 * <li>{@link #getIcon icon} : string (default: '')</li></ul>
 * </li>
 * <li>Aggregations
 * <ul></ul>
 * </li>
 * <li>Associations
 * <ul></ul>
 * </li>
 * <li>Events
 * <ul>
 * <li>{@link sap.ushell.ui.launchpad.DeleteArea#event:drop drop} : fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction, oListenerObject]</li>
 * <li>{@link sap.ushell.ui.launchpad.DeleteArea#event:tileOver tileOver} : fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction, oListenerObject]</li>
 * <li>{@link sap.ushell.ui.launchpad.DeleteArea#event:tileOut tileOut} : fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction, oListenerObject]</li></ul>
 * </li>
 * </ul> 

 *
 * @param {string} [sId] id for the new control, generated automatically if no id is given 
 * @param {object} [mSettings] initial settings for the new control
 *
 * @class
 * Add your documentation for the new ui/launchpad/DeleteArea
 * @extends sap.ui.core.Control
 * @version 1.24.5
 *
 * @constructor
 * @public
 * @name sap.ushell.ui.launchpad.DeleteArea
 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
 */
sap.ui.core.Control.extend("sap.ushell.ui.launchpad.DeleteArea", { metadata : {

	library : "sap.ushell",
	properties : {
		"type" : {type : "sap.ushell.ui.launchpad.DeleteAreaType", group : "Misc", defaultValue : sap.ushell.ui.launchpad.DeleteAreaType.Dashboard},
		"message" : {type : "string", group : "Misc", defaultValue : ''},
		"icon" : {type : "string", group : "Misc", defaultValue : ''}
	},
	events : {
		"drop" : {}, 
		"tileOver" : {}, 
		"tileOut" : {}
	}
}});


/**
 * Creates a new subclass of class sap.ushell.ui.launchpad.DeleteArea with name <code>sClassName</code> 
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
 * @name sap.ushell.ui.launchpad.DeleteArea.extend
 * @function
 */

sap.ushell.ui.launchpad.DeleteArea.M_EVENTS = {'drop':'drop','tileOver':'tileOver','tileOut':'tileOut'};


/**
 * Getter for property <code>type</code>.
 *
 * Default value is <code>Dashboard</code>
 *
 * @return {sap.ushell.ui.launchpad.DeleteAreaType} the value of property <code>type</code>
 * @public
 * @name sap.ushell.ui.launchpad.DeleteArea#getType
 * @function
 */

/**
 * Setter for property <code>type</code>.
 *
 * Default value is <code>Dashboard</code> 
 *
 * @param {sap.ushell.ui.launchpad.DeleteAreaType} oType  new value for property <code>type</code>
 * @return {sap.ushell.ui.launchpad.DeleteArea} <code>this</code> to allow method chaining
 * @public
 * @name sap.ushell.ui.launchpad.DeleteArea#setType
 * @function
 */


/**
 * Getter for property <code>message</code>.
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>message</code>
 * @public
 * @name sap.ushell.ui.launchpad.DeleteArea#getMessage
 * @function
 */

/**
 * Setter for property <code>message</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sMessage  new value for property <code>message</code>
 * @return {sap.ushell.ui.launchpad.DeleteArea} <code>this</code> to allow method chaining
 * @public
 * @name sap.ushell.ui.launchpad.DeleteArea#setMessage
 * @function
 */


/**
 * Getter for property <code>icon</code>.
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>icon</code>
 * @public
 * @name sap.ushell.ui.launchpad.DeleteArea#getIcon
 * @function
 */

/**
 * Setter for property <code>icon</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sIcon  new value for property <code>icon</code>
 * @return {sap.ushell.ui.launchpad.DeleteArea} <code>this</code> to allow method chaining
 * @public
 * @name sap.ushell.ui.launchpad.DeleteArea#setIcon
 * @function
 */


/**
 *
 * @name sap.ushell.ui.launchpad.DeleteArea#drop
 * @event
 * @param {sap.ui.base.Event} oControlEvent
 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
 * @param {object} oControlEvent.getParameters
 * @public
 */
 
/**
 * Attach event handler <code>fnFunction</code> to the 'drop' event of this <code>sap.ushell.ui.launchpad.DeleteArea</code>.<br/>.
 * When called, the context of the event handler (its <code>this</code>) will be bound to <code>oListener<code> if specified
 * otherwise to this <code>sap.ushell.ui.launchpad.DeleteArea</code>.<br/> itself. 
 *  
 *
 * @param {object}
 *            [oData] An application specific payload object, that will be passed to the event handler along with the event object when firing the event.
 * @param {function}
 *            fnFunction The function to call, when the event occurs.  
 * @param {object}
 *            [oListener] Context object to call the event handler with. Defaults to this <code>sap.ushell.ui.launchpad.DeleteArea</code>.<br/> itself.
 *
 * @return {sap.ushell.ui.launchpad.DeleteArea} <code>this</code> to allow method chaining
 * @public
 * @name sap.ushell.ui.launchpad.DeleteArea#attachDrop
 * @function
 */

/**
 * Detach event handler <code>fnFunction</code> from the 'drop' event of this <code>sap.ushell.ui.launchpad.DeleteArea</code>.<br/>
 *
 * The passed function and listener object must match the ones used for event registration.
 *
 * @param {function}
 *            fnFunction The function to call, when the event occurs.
 * @param {object}
 *            oListener Context object on which the given function had to be called.
 * @return {sap.ushell.ui.launchpad.DeleteArea} <code>this</code> to allow method chaining
 * @public
 * @name sap.ushell.ui.launchpad.DeleteArea#detachDrop
 * @function
 */

/**
 * Fire event drop to attached listeners.
 *
 * @param {Map} [mArguments] the arguments to pass along with the event.
 * @return {sap.ushell.ui.launchpad.DeleteArea} <code>this</code> to allow method chaining
 * @protected
 * @name sap.ushell.ui.launchpad.DeleteArea#fireDrop
 * @function
 */


/**
 *
 * @name sap.ushell.ui.launchpad.DeleteArea#tileOver
 * @event
 * @param {sap.ui.base.Event} oControlEvent
 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
 * @param {object} oControlEvent.getParameters
 * @public
 */
 
/**
 * Attach event handler <code>fnFunction</code> to the 'tileOver' event of this <code>sap.ushell.ui.launchpad.DeleteArea</code>.<br/>.
 * When called, the context of the event handler (its <code>this</code>) will be bound to <code>oListener<code> if specified
 * otherwise to this <code>sap.ushell.ui.launchpad.DeleteArea</code>.<br/> itself. 
 *  
 *
 * @param {object}
 *            [oData] An application specific payload object, that will be passed to the event handler along with the event object when firing the event.
 * @param {function}
 *            fnFunction The function to call, when the event occurs.  
 * @param {object}
 *            [oListener] Context object to call the event handler with. Defaults to this <code>sap.ushell.ui.launchpad.DeleteArea</code>.<br/> itself.
 *
 * @return {sap.ushell.ui.launchpad.DeleteArea} <code>this</code> to allow method chaining
 * @public
 * @name sap.ushell.ui.launchpad.DeleteArea#attachTileOver
 * @function
 */

/**
 * Detach event handler <code>fnFunction</code> from the 'tileOver' event of this <code>sap.ushell.ui.launchpad.DeleteArea</code>.<br/>
 *
 * The passed function and listener object must match the ones used for event registration.
 *
 * @param {function}
 *            fnFunction The function to call, when the event occurs.
 * @param {object}
 *            oListener Context object on which the given function had to be called.
 * @return {sap.ushell.ui.launchpad.DeleteArea} <code>this</code> to allow method chaining
 * @public
 * @name sap.ushell.ui.launchpad.DeleteArea#detachTileOver
 * @function
 */

/**
 * Fire event tileOver to attached listeners.
 *
 * @param {Map} [mArguments] the arguments to pass along with the event.
 * @return {sap.ushell.ui.launchpad.DeleteArea} <code>this</code> to allow method chaining
 * @protected
 * @name sap.ushell.ui.launchpad.DeleteArea#fireTileOver
 * @function
 */


/**
 *
 * @name sap.ushell.ui.launchpad.DeleteArea#tileOut
 * @event
 * @param {sap.ui.base.Event} oControlEvent
 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
 * @param {object} oControlEvent.getParameters
 * @public
 */
 
/**
 * Attach event handler <code>fnFunction</code> to the 'tileOut' event of this <code>sap.ushell.ui.launchpad.DeleteArea</code>.<br/>.
 * When called, the context of the event handler (its <code>this</code>) will be bound to <code>oListener<code> if specified
 * otherwise to this <code>sap.ushell.ui.launchpad.DeleteArea</code>.<br/> itself. 
 *  
 *
 * @param {object}
 *            [oData] An application specific payload object, that will be passed to the event handler along with the event object when firing the event.
 * @param {function}
 *            fnFunction The function to call, when the event occurs.  
 * @param {object}
 *            [oListener] Context object to call the event handler with. Defaults to this <code>sap.ushell.ui.launchpad.DeleteArea</code>.<br/> itself.
 *
 * @return {sap.ushell.ui.launchpad.DeleteArea} <code>this</code> to allow method chaining
 * @public
 * @name sap.ushell.ui.launchpad.DeleteArea#attachTileOut
 * @function
 */

/**
 * Detach event handler <code>fnFunction</code> from the 'tileOut' event of this <code>sap.ushell.ui.launchpad.DeleteArea</code>.<br/>
 *
 * The passed function and listener object must match the ones used for event registration.
 *
 * @param {function}
 *            fnFunction The function to call, when the event occurs.
 * @param {object}
 *            oListener Context object on which the given function had to be called.
 * @return {sap.ushell.ui.launchpad.DeleteArea} <code>this</code> to allow method chaining
 * @public
 * @name sap.ushell.ui.launchpad.DeleteArea#detachTileOut
 * @function
 */

/**
 * Fire event tileOut to attached listeners.
 *
 * @param {Map} [mArguments] the arguments to pass along with the event.
 * @return {sap.ushell.ui.launchpad.DeleteArea} <code>this</code> to allow method chaining
 * @protected
 * @name sap.ushell.ui.launchpad.DeleteArea#fireTileOut
 * @function
 */


// Start of sap/ushell/ui/launchpad/DeleteArea.js
// Copyright (c) 2013 SAP AG, All Rights Reserved
/**
 * @name sap.ushell.ui.launchpad.DeleteArea
 * 
 * @private
 */
/*global jQuery, sap, $, window*/


(function () {
    "use strict";
    sap.ushell.ui.launchpad.DeleteArea.prototype.init = function () {
        // do something for initialization...
    };
    sap.ushell.ui.launchpad.DeleteArea.prototype.onAfterRendering = function () {
        if (this.getType() === sap.ushell.ui.launchpad.DeleteAreaType.Dashboard) {
            this.jqDeleteArea_visual = this.$().find(".sapUshellDeleteArea_dashboard_visual");
            this.jqDeleteArea_functional = this.$().find(".sapUshellDeleteArea_dashboard_functional");
            this.tileOver(false);
        } else {
            this.jqDeleteArea_visual = this.$().find(".sapUshellDeleteArea_grouplist_visual");
            this.jqDeleteArea_functional = this.$().find(".sapUshellDeleteArea_grouplist_functional");
            this.groupOver(false);
        }
        //New message on the DeleteArea (near the trashcan) for usability standarts
        this.jqDeleteArea_HoverMessage = this.jqDeleteArea_visual.siblings(".sapUshellDeleteArea_HoverMessage");
        if (sap.ui.Device.system.desktop) {
            this._addDroppable();
        }
    };

    sap.ushell.ui.launchpad.DeleteArea.prototype.setMessage = function (message) {
        // suppress the re-rendering, and modify the html itself to avoid flickering
        this.setProperty("message", message, true);
        this.$().find(".sapUshellDeleteArea_HoverMessage").text(message);
    };

    sap.ushell.ui.launchpad.DeleteArea.prototype._addDroppable = function () {
        if (this.jqDeleteArea_functional.is(".ui-droppable")) {
            return;
        }

        this.jqDeleteArea_functional.droppable({
            greedy: 'true',
            tolerance: 'touch',
            accept: jQuery.proxy(this._handleAccept, this),
            drop: jQuery.proxy(this._handleDrop, this),
            over: jQuery.proxy(this._handleOver, this),
            out: jQuery.proxy(this._handleOut, this)
        });
    };
    sap.ushell.ui.launchpad.DeleteArea.prototype.tileOver = function (bool) {
        this.jqDeleteArea_functional.data("tileOver", bool);
    };
    sap.ushell.ui.launchpad.DeleteArea.prototype.groupOver = function (bool) {
        this.jqDeleteArea_functional.data("groupOver", bool);
    };
    sap.ushell.ui.launchpad.DeleteArea.prototype.getFunctionalArea = function () {
        return this.jqDeleteArea_functional;
    };
    sap.ushell.ui.launchpad.DeleteArea.prototype.getVisualArea = function () {
        return this.jqDeleteArea_visual;
    };
    sap.ushell.ui.launchpad.DeleteArea.prototype.show = function () {
        this.jqDeleteArea_functional.removeClass("sapUshellDeleteArea_functional_hidden").addClass("sapUshellDeleteArea_functional_show");
        if (this.getType() === sap.ushell.ui.launchpad.DeleteAreaType.Dashboard){
            if (sap.ui.Device.os.android){
                this.jqDeleteArea_visual.removeClass("sapUshellDeleteArea_visual_hidden").addClass("sapUshellDeleteArea_visual_show sapUshellDeleteArea_dashboard_visual_show");
            } else {
                this.jqDeleteArea_visual.switchClass("sapUshellDeleteArea_visual_hidden", "sapUshellDeleteArea_visual_show sapUshellDeleteArea_dashboard_visual_show", 250, "swing");
            }
        } else {
            if (sap.ui.Device.os.android) {
                this.jqDeleteArea_visual.removeClass("sapUshellDeleteArea_visual_hidden").addClass("sapUshellDeleteArea_visual_show sapUshellDeleteArea_grouplist_visual_show");
            } else {
                this.jqDeleteArea_visual.switchClass("sapUshellDeleteArea_visual_hidden", "sapUshellDeleteArea_visual_show sapUshellDeleteArea_grouplist_visual_show", 250, "swing");
            }
        }
    };
    sap.ushell.ui.launchpad.DeleteArea.prototype.hide = function () {
        this.jqDeleteArea_visual.removeClass("sapUshellDeleteArea_visual_hover");
        if (this.getType() === sap.ushell.ui.launchpad.DeleteAreaType.Dashboard){
            this.jqDeleteArea_visual.switchClass("sapUshellDeleteArea_visual_show sapUshellDeleteArea_dashboard_visual_show", "sapUshellDeleteArea_visual_hidden", 250, "swing");
            this.jqDeleteArea_visual.removeClass("sapUshellDeleteArea_dashboard_visual_hover");
        } else {
            this.jqDeleteArea_visual.switchClass("sapUshellDeleteArea_visual_show sapUshellDeleteArea_grouplist_visual_show", "sapUshellDeleteArea_visual_hidden", 250, "swing");
            this.jqDeleteArea_visual.removeClass("sapUshellDeleteArea_grouplist_visual_hover");
        }
        this.jqDeleteArea_functional.removeClass("sapUshellDeleteArea_functional_show").addClass("sapUshellDeleteArea_functional_hidden");  
        this.jqDeleteArea_HoverMessage.switchClass("", "sapUshellDeleteArea_HoverMessage_Hide", 50, "swing");//only in group deletion we do not reach the handleDrop (since the confirmation mechanism) so remove the message here as well.
    };
    sap.ushell.ui.launchpad.DeleteArea.prototype._handleAccept = function (d) {
        if (this.getType() === sap.ushell.ui.launchpad.DeleteAreaType.GroupList) {
            return d.hasClass("sapUshellGroupListItem");
        } else {
            return true;
        }
    };
    sap.ushell.ui.launchpad.DeleteArea.prototype._handleDrop = function (event, ui) {
        this.fireEvent("drop", {
            functionalArea : this.jqDeleteArea_functional,
            ui : ui
        });
        this.jqDeleteArea_HoverMessage.switchClass("", "sapUshellDeleteArea_HoverMessage_Hide", 50, "swing");//after deleting a tile, the message should disappear.
    };

    sap.ushell.ui.launchpad.DeleteArea.prototype.adjustStyleOnOverIn = function (isDashboardDeleteArea, objectForDeletion) {
        if (isDashboardDeleteArea) {
            this.jqDeleteArea_visual.switchClass("", "sapUshellDeleteArea_visual_hover sapUshellDeleteArea_dashboard_visual_hover", 100, "swing");
        } else {
            this.jqDeleteArea_visual.switchClass("", "sapUshellDeleteArea_visual_hover sapUshellDeleteArea_grouplist_visual_hover", 100, "swing");
        }
        this.jqDeleteArea_HoverMessage.switchClass("sapUshellDeleteArea_HoverMessage_Hide", "", 150, "swing"); //on hover in, the message should appear

        if (objectForDeletion) {    //add opacity to the tile / group once it is entered the delete area
            objectForDeletion.addClass("sapUshellDeletedObjectTranparency");
        }
    };

    sap.ushell.ui.launchpad.DeleteArea.prototype._handleOver = function (event, ui) {
        var that = this, isDashboardDeleteArea = (this.getType() === sap.ushell.ui.launchpad.DeleteAreaType.Dashboard);

        // dashboard delete area scenario
        if (isDashboardDeleteArea) {
            this.tileOver(true);
        }
        else {
            // groups list delete area scenario
            // a temporary solution to the scenario where the dragged object is a group - we need to distinguish between 'reset group' scenario and the rest of them
            // the default string used is of 'delete group' - so we change it only if this group is not-removable, e.g. reset-group scenario
            if (ui.draggable) {
                var oDraggable = sap.ui.getCore().byId(ui.draggable.attr('id'));
                if (oDraggable) {
                    this.setDeleteAreaMessage(oDraggable);
                }
            }
            this.groupOver(true);
        }

        //Hide placeholder and animate clones to new positions
        this.fireTileOver();

        this.adjustStyleOnOverIn(isDashboardDeleteArea, ui.helper);
    };


    sap.ushell.ui.launchpad.DeleteArea.prototype.setDeleteAreaMessage = function (element) {
        //var oRemovable = sap.ui.getCore().byId(element.attr('id')).getRemovable();
        if (element.getRemovable()) {
            // delete group scenario
            this.setMessage(sap.ushell.resources.i18n.getText("deleteAreaMsgForGroup"));
        }
        else {
            // reset group scenario
            this.setMessage(sap.ushell.resources.i18n.getText("reset_group"));
        }
    };
    /**
     * @param DOM element
     * @returns {boolean}
     */
    sap.ushell.ui.launchpad.DeleteArea.prototype.isElementOverDeleteArea = function (element) {
        var elementRect = element.getBoundingClientRect(),
            deleteAreaY,
            deleteAreaX,
            elementY,
            elementX;

        //get deleteArea position
        deleteAreaY = this.jqDeleteArea_visual[0].offsetTop;
        deleteAreaX = this.jqDeleteArea_visual[0].offsetLeft;

        //get the right bottom corner of the element
        elementY = elementRect.top + elementRect.height;
        elementX = elementRect.left + elementRect.width;

        var isHorizontalIntersection = elementX >= deleteAreaX + this.jqDeleteArea_visual[0].offsetWidth / 5;
        var isVerticalIntersection = elementY >= deleteAreaY +  this.jqDeleteArea_visual[0].offsetHeight / 5;

        return isHorizontalIntersection && isVerticalIntersection;
    };

    sap.ushell.ui.launchpad.DeleteArea.prototype.adjustStyleOnOverOut = function (isDashboardDeleteArea, objectForDeletion) {
        if (isDashboardDeleteArea){
            this.jqDeleteArea_visual.switchClass("sapUshellDeleteArea_visual_hover sapUshellDeleteArea_dashboard_visual_hover", "", 100, "swing");
        } else {
            this.jqDeleteArea_visual.switchClass("sapUshellDeleteArea_visual_hover sapUshellDeleteArea_grouplist_visual_hover", "", 100, "swing");
        }
        this.jqDeleteArea_HoverMessage.switchClass("", "sapUshellDeleteArea_HoverMessage_Hide", 50, "swing");//on hover out, the message should disappear

        if(objectForDeletion){     //remove the opacity from the tile / group once it exits the delete area
            objectForDeletion.removeClass("sapUshellDeletedObjectTranparency");
        }
    };

    sap.ushell.ui.launchpad.DeleteArea.prototype._handleOut = function (event, ui) {
        var that = this,
            isDashboardDeleteArea = (this.getType() === sap.ushell.ui.launchpad.DeleteAreaType.Dashboard);        
        
        if (isDashboardDeleteArea) {
            this.tileOver(false);
        } else {
            this.groupOver(false);
        }

        //Hide placholder and animate clones to new positions
        this.fireTileOut();

        this.adjustStyleOnOverOut(isDashboardDeleteArea, ui.helper);
    };
}());
