/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2014 SAP SE. All rights reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.control, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides control sap.viz.ui5.controls.common.feeds.FeedItem.
jQuery.sap.declare("sap.viz.ui5.controls.common.feeds.FeedItem");
jQuery.sap.require("sap.viz.library");
jQuery.sap.require("sap.ui.core.Element");


/**
 * Constructor for a new ui5/controls/common/feeds/FeedItem.
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
 * <li>{@link #getUid uid} : string</li>
 * <li>{@link #getType type} : string</li>
 * <li>{@link #getValues values} : string[]</li></ul>
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
 * In addition, all settings applicable to the base type {@link sap.ui.core.Element#constructor sap.ui.core.Element}
 * can be used as well.
 *
 * @param {string} [sId] id for the new control, generated automatically if no id is given 
 * @param {object} [mSettings] initial settings for the new control
 *
 * @class
 * FeedItem Class
 * @extends sap.ui.core.Element
 * @version 1.24.4
 *
 * @constructor
 * @public
 * @since 1.21.0
 * @name sap.viz.ui5.controls.common.feeds.FeedItem
 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
 */
sap.ui.core.Element.extend("sap.viz.ui5.controls.common.feeds.FeedItem", { metadata : {

	library : "sap.viz",
	properties : {
		"uid" : {type : "string", group : "Misc", defaultValue : null},
		"type" : {type : "string", group : "Misc", defaultValue : null},
		"values" : {type : "string[]", group : "Misc", defaultValue : null}
	}
}});


/**
 * Creates a new subclass of class sap.viz.ui5.controls.common.feeds.FeedItem with name <code>sClassName</code> 
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
 * @name sap.viz.ui5.controls.common.feeds.FeedItem.extend
 * @function
 */


/**
 * Getter for property <code>uid</code>.
 * Uid of a feed item.
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>uid</code>
 * @public
 * @name sap.viz.ui5.controls.common.feeds.FeedItem#getUid
 * @function
 */

/**
 * Setter for property <code>uid</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sUid  new value for property <code>uid</code>
 * @return {sap.viz.ui5.controls.common.feeds.FeedItem} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.controls.common.feeds.FeedItem#setUid
 * @function
 */


/**
 * Getter for property <code>type</code>.
 * Type of a feed item. Enumeration: Measure, Dimension
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>type</code>
 * @public
 * @name sap.viz.ui5.controls.common.feeds.FeedItem#getType
 * @function
 */

/**
 * Setter for property <code>type</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sType  new value for property <code>type</code>
 * @return {sap.viz.ui5.controls.common.feeds.FeedItem} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.controls.common.feeds.FeedItem#setType
 * @function
 */


/**
 * Getter for property <code>values</code>.
 * Value of a feed item.
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string[]} the value of property <code>values</code>
 * @public
 * @name sap.viz.ui5.controls.common.feeds.FeedItem#getValues
 * @function
 */

/**
 * Setter for property <code>values</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string[]} aValues  new value for property <code>values</code>
 * @return {sap.viz.ui5.controls.common.feeds.FeedItem} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.controls.common.feeds.FeedItem#setValues
 * @function
 */


// Start of sap/viz/ui5/controls/common/feeds/FeedItem.js
///**
// * This file defines behavior for the control,
// */

jQuery.sap.require("sap.viz.ui5.controls.common.feeds.AnalysisObject");

// /**
// * This file defines behavior for the control,
// */
sap.viz.ui5.controls.common.feeds.FeedItem.prototype._create = function() {
	var uid = this.getProperty('uid');
	var type = this.getProperty('type');
	var values = this.getProperty('values');
	
	if (uid && type) {
		var valueInstances = [];
		if (values) {
			values.forEach( function(value, index, values) {
				if (typeof value === 'string') {
					values[index] = new sap.viz.ui5.controls.common.feeds.AnalysisObject({
						'uid' : value,
						'name' : value,
						'type' : type
					});
				}
			}.bind(this));

			valueInstances = sap.viz.ui5.controls.common.feeds.AnalysisObject.toInstances(values);
		}
		this._instance = new sap.viz.controls.common.feeds.FeedItem(uid, type, valueInstances);
	}
};

sap.viz.ui5.controls.common.feeds.FeedItem.prototype.init = function() {
};

sap.viz.ui5.controls.common.feeds.FeedItem.prototype.getUid = function() {
	return this._instance ? this._instance.id() : this.getProperty('uid');
};

/**
 * Uid of a feed item. 
 * Please reference to feeds section in this doc to get the exact sUid string for each chart type.
 * 
 * For example:
 * 	Bar chart > feeds > Axis Labels > id: axisLabels.
 * 	The 'axisLabels' should be the sUid for x axis feeding for bar chart.
 *
 * @param {string}
 *            sUid
 * @returns {sap.viz.ui5.controls.common.feeds.FeedItem}
 * @public
 * @function sap.viz.ui5.controls.common.feeds.FeedItem.prototype.setUid
 */
sap.viz.ui5.controls.common.feeds.FeedItem.prototype.setUid = function(sUid) {
	this.setProperty('uid', sUid);
	this._create();
	return this;
};

sap.viz.ui5.controls.common.feeds.FeedItem.prototype.getType = function() {
	return this._instance ? this._instance.type() : this.getProperty('type');
};

sap.viz.ui5.controls.common.feeds.FeedItem.prototype.setType = function(type) {
	this.setProperty('type', type);
	this._create();
	return this;
};

sap.viz.ui5.controls.common.feeds.FeedItem.prototype.getValues = function() {
	if (this._instance) {
		return sap.viz.ui5.controls.common.feeds.AnalysisObject.toAnalysisObjects(this._instance.values());
	} else {
		return this.getProperty('values');
	}
};

sap.viz.ui5.controls.common.feeds.FeedItem.prototype.setValues = function(values) {
	this.setProperty('values', values);
	this._create();
	return this;
};

/**
 * Deserialize a JSON to FeedItem instance
 *
 * @name sap.viz.ui5.controls.common.feeds.FeedItem.fromJSON
 * @function
 * @param {Object}
 *            oJsonObj
 *
 *
 * @type sap.viz.ui5.controls.common.feeds.FeedItem
 * @public
 */
sap.viz.ui5.controls.common.feeds.FeedItem.fromJSON = function(oJsonObj) {
	return sap.viz.controls.common.feeds.FeedItem.fromJSON(oJsonObj);
};

/**
 * Serialize a FeedItem instance to JSON
 *
 * @name sap.viz.ui5.controls.common.feeds.FeedItem.toJSON
 * @function
 * @param {sap.viz.ui5.controls.common.feeds.FeedItem}
 *            ofObject
 *
 *
 * @type Object
 * @public
 */
sap.viz.ui5.controls.common.feeds.FeedItem.toJSON = function(ofObject) {
	return sap.viz.controls.common.feeds.FeedItem.toJSON(ofObject);
};

sap.viz.ui5.controls.common.feeds.FeedItem.toFeeds = function(instances) {
	return Array.prototype.map.call(instances, function(instance, i, array) {
		return new sap.viz.ui5.controls.common.feeds.FeedItem({
			'uid' : instance.id(),
			'type' : instance.type(),
			'values' : sap.viz.ui5.controls.common.feeds.AnalysisObject.toAnalysisObjects(instance.values())
		});
	});
};
sap.viz.ui5.controls.common.feeds.FeedItem.toInstances = function(feeds) {
	return Array.prototype.map.call(feeds, function(feed, i, array) {
		return feed._instance;
	});
};
