/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2014 SAP SE. All rights reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.control, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides control sap.viz.ui5.controls.VizFrame.
jQuery.sap.declare("sap.viz.ui5.controls.VizFrame");
jQuery.sap.require("sap.viz.library");
jQuery.sap.require("sap.viz.ui5.controls.common.BaseControl");


/**
 * Constructor for a new ui5/controls/VizFrame.
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
 * <li>{@link #getVizType vizType} : string</li>
 * <li>{@link #getVizProperties vizProperties} : string</li></ul>
 * </li>
 * <li>Aggregations
 * <ul>
 * <li>{@link #getDataset dataset} : sap.viz.ui5.data.Dataset</li>
 * <li>{@link #getFeeds feeds} : sap.viz.ui5.controls.common.feeds.FeedItem[]</li></ul>
 * </li>
 * <li>Associations
 * <ul></ul>
 * </li>
 * <li>Events
 * <ul>
 * <li>{@link sap.viz.ui5.controls.VizFrame#event:renderComplete renderComplete} : fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction, oListenerObject]</li>
 * <li>{@link sap.viz.ui5.controls.VizFrame#event:selectData selectData} : fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction, oListenerObject]</li>
 * <li>{@link sap.viz.ui5.controls.VizFrame#event:deselectData deselectData} : fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction, oListenerObject]</li></ul>
 * </li>
 * </ul> 
 *
 * 
 * In addition, all settings applicable to the base type {@link sap.viz.ui5.controls.common.BaseControl#constructor sap.viz.ui5.controls.common.BaseControl}
 * can be used as well.
 *
 * @param {string} [sId] id for the new control, generated automatically if no id is given 
 * @param {object} [mSettings] initial settings for the new control
 *
 * @class
 * VizFrame is a viz control that manages a visualization’s initialization, layout, feeding, customization and interactions.
 * @extends sap.viz.ui5.controls.common.BaseControl
 * @version 1.24.4
 *
 * @constructor
 * @public
 * @since 1.22.0
 * @name sap.viz.ui5.controls.VizFrame
 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
 */
sap.viz.ui5.controls.common.BaseControl.extend("sap.viz.ui5.controls.VizFrame", { metadata : {

	publicMethods : [
		// methods
		"getVizUid", "vizUpdate", "vizSelection", "getResponsiveLegend"
	],
	library : "sap.viz",
	properties : {
		"vizType" : {type : "string", group : "Misc", defaultValue : null},
		"vizProperties" : {type : "string", group : "Misc", defaultValue : null}
	},
	aggregations : {
		"dataset" : {type : "sap.viz.ui5.data.Dataset", multiple : false}, 
		"feeds" : {type : "sap.viz.ui5.controls.common.feeds.FeedItem", multiple : true, singularName : "feed"}
	},
	events : {
		"renderComplete" : {}, 
		"selectData" : {}, 
		"deselectData" : {}
	}
}});


/**
 * Creates a new subclass of class sap.viz.ui5.controls.VizFrame with name <code>sClassName</code> 
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
 * @name sap.viz.ui5.controls.VizFrame.extend
 * @function
 */

sap.viz.ui5.controls.VizFrame.M_EVENTS = {'renderComplete':'renderComplete','selectData':'selectData','deselectData':'deselectData'};


/**
 * Getter for property <code>vizType</code>.
 * Type for viz frame. Supported chart type: bubble, combination, column, bar, line, stacked_bar, stacked_column, bullet, timebubble.
 * User can pass 'chartType' or 'info/chartType'. For example both 'bar' and 'info/bar' will create a info bar chart.
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>vizType</code>
 * @public
 * @name sap.viz.ui5.controls.VizFrame#getVizType
 * @function
 */

/**
 * Setter for property <code>vizType</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sVizType  new value for property <code>vizType</code>
 * @return {sap.viz.ui5.controls.VizFrame} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.controls.VizFrame#setVizType
 * @function
 */


/**
 * Getter for property <code>vizProperties</code>.
 * Chart properties, refer chart property doc for more details.
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>vizProperties</code>
 * @public
 * @name sap.viz.ui5.controls.VizFrame#getVizProperties
 * @function
 */

/**
 * Setter for property <code>vizProperties</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sVizProperties  new value for property <code>vizProperties</code>
 * @return {sap.viz.ui5.controls.VizFrame} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.controls.VizFrame#setVizProperties
 * @function
 */


/**
 * Getter for aggregation <code>dataset</code>.<br/>
 * Dataset for chart.
 * 
 * @return {sap.viz.ui5.data.Dataset}
 * @public
 * @name sap.viz.ui5.controls.VizFrame#getDataset
 * @function
 */


/**
 * Setter for the aggregated <code>dataset</code>.
 * @param {sap.viz.ui5.data.Dataset} oDataset
 * @return {sap.viz.ui5.controls.VizFrame} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.controls.VizFrame#setDataset
 * @function
 */
	

/**
 * Destroys the dataset in the aggregation 
 * named <code>dataset</code>.
 * @return {sap.viz.ui5.controls.VizFrame} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.controls.VizFrame#destroyDataset
 * @function
 */


/**
 * Getter for aggregation <code>feeds</code>.<br/>
 * All feeds for chart.
 * 
 * @return {sap.viz.ui5.controls.common.feeds.FeedItem[]}
 * @public
 * @name sap.viz.ui5.controls.VizFrame#getFeeds
 * @function
 */


/**
 * Inserts a feed into the aggregation named <code>feeds</code>.
 *
 * @param {sap.viz.ui5.controls.common.feeds.FeedItem}
 *          oFeed the feed to insert; if empty, nothing is inserted
 * @param {int}
 *             iIndex the <code>0</code>-based index the feed should be inserted at; for 
 *             a negative value of <code>iIndex</code>, the feed is inserted at position 0; for a value 
 *             greater than the current size of the aggregation, the feed is inserted at 
 *             the last position        
 * @return {sap.viz.ui5.controls.VizFrame} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.controls.VizFrame#insertFeed
 * @function
 */

/**
 * Adds some feed <code>oFeed</code> 
 * to the aggregation named <code>feeds</code>.
 *
 * @param {sap.viz.ui5.controls.common.feeds.FeedItem}
 *            oFeed the feed to add; if empty, nothing is inserted
 * @return {sap.viz.ui5.controls.VizFrame} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.controls.VizFrame#addFeed
 * @function
 */

/**
 * Removes an feed from the aggregation named <code>feeds</code>.
 *
 * @param {int | string | sap.viz.ui5.controls.common.feeds.FeedItem} vFeed the feed to remove or its index or id
 * @return {sap.viz.ui5.controls.common.feeds.FeedItem} the removed feed or null
 * @public
 * @name sap.viz.ui5.controls.VizFrame#removeFeed
 * @function
 */

/**
 * Removes all the controls in the aggregation named <code>feeds</code>.<br/>
 * Additionally unregisters them from the hosting UIArea.
 * @return {sap.viz.ui5.controls.common.feeds.FeedItem[]} an array of the removed elements (might be empty)
 * @public
 * @name sap.viz.ui5.controls.VizFrame#removeAllFeeds
 * @function
 */

/**
 * Checks for the provided <code>sap.viz.ui5.controls.common.feeds.FeedItem</code> in the aggregation named <code>feeds</code> 
 * and returns its index if found or -1 otherwise.
 *
 * @param {sap.viz.ui5.controls.common.feeds.FeedItem}
 *            oFeed the feed whose index is looked for.
 * @return {int} the index of the provided control in the aggregation if found, or -1 otherwise
 * @public
 * @name sap.viz.ui5.controls.VizFrame#indexOfFeed
 * @function
 */
	

/**
 * Destroys all the feeds in the aggregation 
 * named <code>feeds</code>.
 * @return {sap.viz.ui5.controls.VizFrame} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.controls.VizFrame#destroyFeeds
 * @function
 */


/**
 * Event fires when the rendering ends.
 *
 * @name sap.viz.ui5.controls.VizFrame#renderComplete
 * @event
 * @param {sap.ui.base.Event} oControlEvent
 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
 * @param {object} oControlEvent.getParameters
 * @public
 */
 
/**
 * Attach event handler <code>fnFunction</code> to the 'renderComplete' event of this <code>sap.viz.ui5.controls.VizFrame</code>.<br/>.
 * When called, the context of the event handler (its <code>this</code>) will be bound to <code>oListener<code> if specified
 * otherwise to this <code>sap.viz.ui5.controls.VizFrame</code>.<br/> itself. 
 *  
 * Event fires when the rendering ends.
 *
 * @param {object}
 *            [oData] An application specific payload object, that will be passed to the event handler along with the event object when firing the event.
 * @param {function}
 *            fnFunction The function to call, when the event occurs.  
 * @param {object}
 *            [oListener] Context object to call the event handler with. Defaults to this <code>sap.viz.ui5.controls.VizFrame</code>.<br/> itself.
 *
 * @return {sap.viz.ui5.controls.VizFrame} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.controls.VizFrame#attachRenderComplete
 * @function
 */

/**
 * Detach event handler <code>fnFunction</code> from the 'renderComplete' event of this <code>sap.viz.ui5.controls.VizFrame</code>.<br/>
 *
 * The passed function and listener object must match the ones used for event registration.
 *
 * @param {function}
 *            fnFunction The function to call, when the event occurs.
 * @param {object}
 *            oListener Context object on which the given function had to be called.
 * @return {sap.viz.ui5.controls.VizFrame} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.controls.VizFrame#detachRenderComplete
 * @function
 */

/**
 * Fire event renderComplete to attached listeners.
 *
 * @param {Map} [mArguments] the arguments to pass along with the event.
 * @return {sap.viz.ui5.controls.VizFrame} <code>this</code> to allow method chaining
 * @protected
 * @name sap.viz.ui5.controls.VizFrame#fireRenderComplete
 * @function
 */


/**
 * Event fires when certain data point(s) is(are) selected, data context of selected item(s) would be passed in.
 *
 * @name sap.viz.ui5.controls.VizFrame#selectData
 * @event
 * @param {sap.ui.base.Event} oControlEvent
 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
 * @param {object} oControlEvent.getParameters
 * @public
 */
 
/**
 * Attach event handler <code>fnFunction</code> to the 'selectData' event of this <code>sap.viz.ui5.controls.VizFrame</code>.<br/>.
 * When called, the context of the event handler (its <code>this</code>) will be bound to <code>oListener<code> if specified
 * otherwise to this <code>sap.viz.ui5.controls.VizFrame</code>.<br/> itself. 
 *  
 * Event fires when certain data point(s) is(are) selected, data context of selected item(s) would be passed in.
 *
 * @param {object}
 *            [oData] An application specific payload object, that will be passed to the event handler along with the event object when firing the event.
 * @param {function}
 *            fnFunction The function to call, when the event occurs.  
 * @param {object}
 *            [oListener] Context object to call the event handler with. Defaults to this <code>sap.viz.ui5.controls.VizFrame</code>.<br/> itself.
 *
 * @return {sap.viz.ui5.controls.VizFrame} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.controls.VizFrame#attachSelectData
 * @function
 */

/**
 * Detach event handler <code>fnFunction</code> from the 'selectData' event of this <code>sap.viz.ui5.controls.VizFrame</code>.<br/>
 *
 * The passed function and listener object must match the ones used for event registration.
 *
 * @param {function}
 *            fnFunction The function to call, when the event occurs.
 * @param {object}
 *            oListener Context object on which the given function had to be called.
 * @return {sap.viz.ui5.controls.VizFrame} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.controls.VizFrame#detachSelectData
 * @function
 */

/**
 * Fire event selectData to attached listeners.
 *
 * @param {Map} [mArguments] the arguments to pass along with the event.
 * @return {sap.viz.ui5.controls.VizFrame} <code>this</code> to allow method chaining
 * @protected
 * @name sap.viz.ui5.controls.VizFrame#fireSelectData
 * @function
 */


/**
 * Event fires when certain data point(s) is(are) deselected, data context of deselected item(s) would be passed in
 *
 * @name sap.viz.ui5.controls.VizFrame#deselectData
 * @event
 * @param {sap.ui.base.Event} oControlEvent
 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
 * @param {object} oControlEvent.getParameters
 * @public
 */
 
/**
 * Attach event handler <code>fnFunction</code> to the 'deselectData' event of this <code>sap.viz.ui5.controls.VizFrame</code>.<br/>.
 * When called, the context of the event handler (its <code>this</code>) will be bound to <code>oListener<code> if specified
 * otherwise to this <code>sap.viz.ui5.controls.VizFrame</code>.<br/> itself. 
 *  
 * Event fires when certain data point(s) is(are) deselected, data context of deselected item(s) would be passed in
 *
 * @param {object}
 *            [oData] An application specific payload object, that will be passed to the event handler along with the event object when firing the event.
 * @param {function}
 *            fnFunction The function to call, when the event occurs.  
 * @param {object}
 *            [oListener] Context object to call the event handler with. Defaults to this <code>sap.viz.ui5.controls.VizFrame</code>.<br/> itself.
 *
 * @return {sap.viz.ui5.controls.VizFrame} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.controls.VizFrame#attachDeselectData
 * @function
 */

/**
 * Detach event handler <code>fnFunction</code> from the 'deselectData' event of this <code>sap.viz.ui5.controls.VizFrame</code>.<br/>
 *
 * The passed function and listener object must match the ones used for event registration.
 *
 * @param {function}
 *            fnFunction The function to call, when the event occurs.
 * @param {object}
 *            oListener Context object on which the given function had to be called.
 * @return {sap.viz.ui5.controls.VizFrame} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.controls.VizFrame#detachDeselectData
 * @function
 */

/**
 * Fire event deselectData to attached listeners.
 *
 * @param {Map} [mArguments] the arguments to pass along with the event.
 * @return {sap.viz.ui5.controls.VizFrame} <code>this</code> to allow method chaining
 * @protected
 * @name sap.viz.ui5.controls.VizFrame#fireDeselectData
 * @function
 */


/**
 * Uid for viz frame. It supports other controls to connect to a viz instance.
 *
 * @name sap.viz.ui5.controls.VizFrame#getVizUid
 * @function
 * @type string
 * @public
 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
 */


/**
 * Update viz frame according to a JSON object, it can update css, properties, feeds and data model.
 *
 * @name sap.viz.ui5.controls.VizFrame#vizUpdate
 * @function
 * @param {object} oOJson
 *         A JSON object contains combination of css, properties, feeds and data model.
 * @type void
 * @public
 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
 */


/**
 * Selections for the chart instance of the viz frame.
 *
 * @name sap.viz.ui5.controls.VizFrame#vizSelection
 * @function
 * @param {object[]} aAPoints
 *         Some data points of the chart
 * @param {object} oOAction
 *         A flag 'clearSelection', whether to clear previous selection, by default the selection will be incremental selection
 * @type object
 * @public
 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
 */


/**
 * Get ResponsiveLegend Control. (For fiori application set only.)
 *
 * @name sap.viz.ui5.controls.VizFrame#getResponsiveLegend
 * @function
 * @type void
 * @public
 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
 */


// Start of sap/viz/ui5/controls/VizFrame.js
jQuery.sap.require("sap.viz.ui5.controls.libs.sap-viz-controls");
jQuery.sap.require("sap.viz.ui5.controls.common.feeds.AnalysisObject");
jQuery.sap.require("sap.viz.ui5.controls.common.feeds.FeedItem");
jQuery.sap.require("sap.viz.ui5.controls.common.helpers.VizControlsHelper");
jQuery.sap.require("sap.viz.ui5.controls.ResponsiveLegend");

sap.viz.ui5.controls.VizFrame.prototype.init = function() {
    sap.viz.ui5.controls.common.BaseControl.prototype.init.apply(this, arguments);

    this._vizFrame = null;

    this._onThemeChanged = jQuery.proxy(this._applyTheme, this);
    sap.ui.getCore().attachThemeChanged(this._onThemeChanged);
    this._clearVariables();
};

sap.viz.ui5.controls.VizFrame.prototype.applySettings = function() {
    sap.ui.core.Control.prototype.applySettings.apply(this, arguments);

    if (!this._vizFrame) {
        this._createVizFrame();
    }
};

sap.viz.ui5.controls.VizFrame.prototype.exit = function() {
    sap.viz.ui5.controls.common.BaseControl.prototype.exit.apply(this, arguments);

    sap.ui.getCore().detachThemeChanged(this._onThemeChanged);
    this._clearVariables();
};

sap.viz.ui5.controls.VizFrame.prototype._clearVariables = function() {
    this._vizFrame$ = null;
    this._vizCreated = false;

    this._clearRequestedProperties();

    this._cachedDataset = null;
};

sap.viz.ui5.controls.VizFrame.prototype._clearRequestedProperties = function() {
    this._requestedVizType = 'info/column';
    this._requestedVizProperties = null;
};

sap.viz.ui5.controls.VizFrame.prototype.getVizUid = function() {
    if (this._vizFrame) {
        return this._vizFrame.vizUid();
    } else {
        return null;
    }
};

/**
 * Setter for property uiConfig. uiConfig could only set via settings parameter
 * of constructor.
 *
 * uiConfig from base type could config the instance. Supported uiConfig
 * keyword: applicationSet
 *
 * Example:
 *
 * <pre>
 * var vizFrame = new sap.viz.ui5.controls.VizFrame({
 * 	'vizType' : 'bar',
 * 	'uiConfig' : {
 * 		'applicationSet' : 'fiori'
 * 	}
 * });
 * </pre>
 *
 * @param {object}
 *            oUiConfig
 * @returns {sap.viz.ui5.controls.VizFrame}
 * @public
 * @function sap.viz.ui5.controls.VizFrame.prototype.setUiConfig
 */
sap.viz.ui5.controls.VizFrame.prototype.setUiConfig = function(oUiConfig) {
    sap.viz.ui5.controls.common.BaseControl.prototype.setUiConfig.apply(this, arguments);

};
sap.viz.ui5.controls.VizFrame.prototype.getVizType = function() {
    var sVizType = this._getVizType();

    if (sVizType.indexOf('info/') === 0) {
        sVizType = sVizType.substr('info/'.length);
    }

    return sVizType;
};

sap.viz.ui5.controls.VizFrame.prototype._getVizType = function() {
    var sVizType;
    if (this._vizFrame && this._vizFrame.vizType()) {
        sVizType = this._vizFrame.vizType();
    } else {
        sVizType = this._requestedVizType;
    }

    return sVizType;
};

/**
 * Setter for property vizType. vizType could only set via settings parameter in Constructor.
 * vizType is a string of supported chart type or extension chart type.
 *  
 * Supported chart types: bubble, combination, column, bar, line, stacked_bar, stacked_column, bullet, timebubble. 
 * User can pass 'chartType' or 'info/chartType' for these supported chart types. 
 * 
 * Example:
 * <pre>
 * var vizFrame = new sap.viz.ui5.controls.VizFrame({
 * 	'vizType' : 'bar'
 * });
 * </pre>
 * 
 * For extension chart type, user should load extension js file manually at first.
 * 
 * Example:
 * <pre>
 * var vizFrame = new sap.viz.ui5.controls.VizFrame({
 * 	'vizType' : 'myextension'
 * });
 * </pre>
 * 
 * @param {string}
 *            sVizType
 * @returns {sap.viz.ui5.controls.VizFrame}
 * @public
 * @function sap.viz.ui5.controls.VizFrame.prototype.setVizType
 */
sap.viz.ui5.controls.VizFrame.prototype.setVizType = function(sVizType) {
    var prefix = 'info/';

    if (sap.viz.ui5.controls.VizFrame._isNativeVizType(prefix + sVizType)) {
        // Add prefix automatically
        sVizType = prefix + sVizType;
    }

    if (this._vizFrame && this._vizCreated) {
        try {
            this._vizFrame.vizType(sVizType);
        } catch (e) {
            this._requestedVizType = sVizType;
        }
    } else {
        this._requestedVizType = sVizType;
    }
    return this;
};

sap.viz.ui5.controls.VizFrame.prototype.getVizProperties = function() {
    if (this._vizFrame) {
        return jQuery.extend(true, {}, this._vizFrame.vizProperties() || {}, this._requestedVizProperties || {});
    } else {
        return this._requestedVizProperties;
    }
};

/**
 * Properties for viz frame. Detail doc ref:
 *
 * Example:
 *
 * <pre>
 *  var vizFrame = new sap.viz.ui5.controls.VizFrame(...);
 *  var properties = {
 *      'legend' : { 'visible'; : true },
 *      'plotArea' : {
 *      	'colorPalette' : ['#ff0000']
 *      }
 * };
 * vizFrame.setVizProperties(properties);
 * </pre>
 *
 * @param {object}
 *            oVizProperties
 * @returns {sap.viz.ui5.controls.VizFrame}
 * @public
 * @function sap.viz.ui5.controls.VizFrame.prototype.setVizProperties
 */
sap.viz.ui5.controls.VizFrame.prototype.setVizProperties = function(oVizProperties) {
    if (this._vizFrame && this._vizCreated) {
        try {
            this._vizFrame.vizProperties(oVizProperties);
        } catch (e) {
            this._requestedVizProperties = oVizProperties;
        }
    } else {
        this._requestedVizProperties = jQuery.extend(true, this._requestedVizProperties || {}, oVizProperties || {});
    }
    return this;
};

sap.viz.ui5.controls.VizFrame.prototype.getFeeds = function() {
    var feeds = this.getAggregation('feeds');
    if (feeds && this._vizFrame && this._vizCreated) {
        // Convert feedItems to ui5 feedItems when chart rendering
        feeds = sap.viz.ui5.controls.common.feeds.FeedItem.toFeeds(this._vizFrame.feeds());
    }
    return feeds;
};

/**
 * Selections for viz frame. Example:
 *
 * <pre>
 *  var vizFrame = new sap.viz.ui5.controls.VizFrame(...);
 *  var points = [{
 *      data : {
 *          "Country" : "China",
 *          "Year" : "2001",
 *          "Product" : "Car",
 *          "Profit" : 25
 *      }}, {
 *      data : {
 *      	"Country" : "China",
 *          "Year" : "2001",
 *          "Product" : "Trunk",
 *          "Profit" : 34
 *      }}];
 *  var action = {
 *  	clearSelection : true
 *  };
 * vizFrame.vizSelection(points, action);
 * </pre>
 *
 * @param {object[]}
 *            aPoints some data points of the chart
 * @param {object}
 *            oAction whether to clear previous selection, by default the
 *            selection will be incremental selection
 * @returns {sap.viz.ui5.controls.VizFrame}
 * @public
 * @function sap.viz.ui5.controls.VizFrame.prototype.vizSelection
 */
sap.viz.ui5.controls.VizFrame.prototype.vizSelection = function(aPoints, oAction) {
    if (this._vizFrame && this._vizCreated) {
        try {
            var result = this._vizFrame.vizSelection.apply(this._vizFrame, arguments);
            if (result === this._vizFrame) {
                result = this;
            }
        } catch (e) {
            return null;
        }
        return result;
    } else {
        return null;
    }
};

/**
 * Update viz frame according to a JSON object, it can update css, properties,
 * feeds and data model. Example:
 *
 * <pre>
 * var vizFrame = new sap.viz.ui5.controls.VizFrame(...);
 * var data = {
 *     'path' : "/rawData"
 * };
 * var properties = {
 *     'legend' : {'visible' : true},
 * };
 * var FeedItem = sap.viz.ui5.controls.common.feeds.FeedItem;
 * var feeds = [
 *     new FeedItem({'uid' : 'primaryValues',
 *                   'type' : 'Measure',
 *                   'values' []}),
 *     new FeedItem({'uid' : 'regionColor',
 *                   'type' : 'Dimension',
 *                   'values' []})];
 * vizFrame.vizUpdate({
 *               'data' : data,
 *               'properties' : properties,
 *               'feeds' : feeds
 *           });
 * </pre>
 *
 * @param {object}
 *            oOptions a JSON object contains combination of properties, feeds
 *            and data model.
 * @returns {sap.viz.ui5.controls.VizFrame}
 * @public
 * @function sap.viz.ui5.controls.VizFrame.prototype.vizUpdate
 */
sap.viz.ui5.controls.VizFrame.prototype.vizUpdate = function(oOptions) {
    if (this._vizFrame) {
        if (oOptions.data || oOptions.feeds) {
            // Create requested cache when aggregation changed
            if (oOptions.properties) {
                this._requestedVizProperties = jQuery.extend(true, this._requestedVizProperties || {}, oOptions.properties || {});
            }

            if (oOptions.data) {
                this.setDataset(oOptions.data);
            }
            if (oOptions.feeds) {
                this._setFeeds(oOptions.feeds);
            }
        } else {
            // Call _vizFrame.vizUpdate directly when aggregation not changed
            this._vizFrame.vizUpdate(oOptions);
        }
    }
};

sap.viz.ui5.controls.VizFrame.prototype.getResponsiveLegend = function(){
	if(this._vizFrame){
		return sap.viz.ui5.controls.ResponsiveLegend.createInstance(this._vizFrame.responsiveLegend());
	}
};

sap.viz.ui5.controls.VizFrame.prototype._createVizFrame = function(options) {
    this._applyTheme();

    var VizFrame = sap.viz.controls.frame.VizFrame;
    var GlobalConfig = sap.viz.controls.common.config.GlobalConfig;

    var cssPrefix = 'ui5-viz-controls';
    this._vizFrame$ = jQuery(document.createElement('div'));
    this._vizFrame$.addClass(cssPrefix + '-viz-frame');

    var vizFrameConfig = GlobalConfig.defaultUIConfig(GlobalConfig.DEFAULT_UICONFIG_TYPE_FRAME);
    vizFrameConfig.enableFilterMenu = false;
    vizFrameConfig.enableFilterBar = false;
    vizFrameConfig.enableSettingButton = false;
    vizFrameConfig.enableFullScreenButton = false;
    vizFrameConfig.enablePlayControl = false;
    vizFrameConfig.enableContextMenu = false;
    vizFrameConfig.controls.chart.enableMorphing = false;
    vizFrameConfig.controls.chart.enableTrellis = false;
    vizFrameConfig.controls.contextMenu.menu = [["direction", "stacking"], ["legend", "datalabels"]];

    var uiConfig = this.getUiConfig();
    if (uiConfig) {
        if (uiConfig.applicationSet === 'fiori') {
            jQuery.extend(true, vizFrameConfig.controls.chart.defaultProperties || {}, {
                'tooltip' : {
                    'visible' : false
                },
                'plotArea' : {
                    // @formatter:off
                    'colorPalette' : ['sapUiChartPaletteQualitativeHue1',
                                      'sapUiChartPaletteQualitativeHue2',
                                      'sapUiChartPaletteQualitativeHue3',
                                      'sapUiChartPaletteQualitativeHue4',
                                      'sapUiChartPaletteQualitativeHue5',
                                      'sapUiChartPaletteQualitativeHue6',
                                      'sapUiChartPaletteQualitativeHue7',
                                      'sapUiChartPaletteQualitativeHue8',
                                      'sapUiChartPaletteQualitativeHue9',
                                      'sapUiChartPaletteQualitativeHue10',
                                      'sapUiChartPaletteQualitativeHue11'],
                    // @formatter:on
                    'isFixedDataPointSize' : true,
                    'dataLabel' : {
                        'hideWhenOverlap' : true,
                        'respectShapeWidth' : true,
                        'style' : {
                            'color' : null
                        }
                    }
                },
                'interaction' : {
                    'behaviorType' : 'sFinBehavior',
                    'selectability' : {
                        'mode' : 'multiple'
                    }
                }
            });
            vizFrameConfig.enableResponsiveLegend = true;
        }
    }
    // sap.ui.core.RenderManager.preserveContent
    jQuery(this._app$).attr("data-sap-ui-preserve", true);
    var vizFrame = this._vizFrame = new VizFrame(this._vizFrame$.get(0), vizFrameConfig);
    this._registerControl('sap.viz.controls.frame.VizFrame', this._vizFrame);

    vizFrame.vizOn('selectData', jQuery.proxy(function(e) {
        this.fireEvent("selectData", e);
    }, this));
    vizFrame.vizOn('deselectData', jQuery.proxy(function(e) {
        this.fireEvent("deselectData", e);
    }, this));
    vizFrame.vizOn('initialized', jQuery.proxy(function(e) {
        this.fireEvent("renderComplete", e);
    }, this));

    return vizFrame;
};

sap.viz.ui5.controls.VizFrame.prototype._updateVizFrame = function() {
    var options = {
        'type' : this._getVizType()
    };
    // data & feeds
    var data = this._getVizDataset();
    var feeds = this.getAggregation('feeds');
    if (data && feeds) {
        options.data = data;
        options.feeds = sap.viz.ui5.controls.common.helpers.VizControlsHelper.getFeedInstances(feeds)
    }
    // properties
    if (this._requestedVizProperties) {
        options.properties = this._requestedVizProperties;
    }

    if (!this._vizCreated) {
        if (options.data && options.feeds) {
            this._vizCreated = true;
            this._vizFrame.createViz(options);
            this._clearRequestedProperties();
        }
    } else {
        this._vizFrame.vizUpdate(options);
        this._clearRequestedProperties();
    }
};

sap.viz.ui5.controls.VizFrame.prototype._getVizDataset = function() {
    var ds = this.getDataset();
    if (ds) {
        if (this._isExtension()) {
            sap.viz.ui5.controls.common.helpers.VizControlsHelper.updateAxis(ds.getDimensions(), this._getVizType(), this.getAggregation('feeds'));
            return ds.getVIZDataset();
        } else {
            return ds.getVIZFlatDataset();
        }
    } else {
        return null;
    }
};

sap.viz.ui5.controls.VizFrame.prototype._createChildren = function() {
    this._vizFrame$.appendTo(this._app$);
    this._updateVizFrame();
};

sap.viz.ui5.controls.VizFrame.prototype._updateChildren = function() {
    this._updateVizFrame();
};

sap.viz.ui5.controls.VizFrame.prototype._setFeeds = function(aFeeds) {
    this.destroyFeeds();
    if (aFeeds && aFeeds.length) {
        for (var i = 0; i < aFeeds.length; i++) {
            this.addFeed(aFeeds[i]);
        }
    }
    return this;
};

sap.viz.ui5.controls.VizFrame.prototype._applyTheme = function() {
};

sap.viz.ui5.controls.VizFrame.prototype._validateSize = function() {
    if (!this._app$) {
        return;
    }
    var size = {
        'width' : this.$().width(),
        'height' : this.$().height()
    };

    var appSize = {
        'width' : this._app$.width(),
        'height' : this._app$.height()
    };

    if (this._vizFrame) {
        this._vizFrame.size({
            'width' : appSize.width,
            'height' : appSize.height
        });
    } else {
        this._vizFrame$.css({
            'width' : appSize.width + 'px',
            'height' : appSize.height + 'px'
        });
    }
};

sap.viz.ui5.controls.VizFrame.prototype._isExtension = function() {
    return !sap.viz.ui5.controls.VizFrame._isNativeVizType(this._getVizType());
};
sap.viz.ui5.controls.VizFrame._isNativeVizType = function(vizType) {
    // @formatter:off
    return jQuery.inArray(vizType,
            [ 'info/column', 'info/bar', 'info/stacked_bar',
                    'info/stacked_column', 'info/line', 'info/combination',
                    'info/bullet', 'info/bubble', 'info/time_bubble' ]) !== -1;
    // @formatter:on
};
