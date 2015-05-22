/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2014 SAP SE. All rights reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.control, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides control sap.viz.ui5.controls.common.feeds.AnalysisObject.
jQuery.sap.declare("sap.viz.ui5.controls.common.feeds.AnalysisObject");
jQuery.sap.require("sap.viz.library");
jQuery.sap.require("sap.ui.core.Element");


/**
 * Constructor for a new ui5/controls/common/feeds/AnalysisObject.
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
 * <li>{@link #getName name} : string</li>
 * <li>{@link #getType type} : string</li></ul>
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
 * AnalysisObject Class
 * @extends sap.ui.core.Element
 * @version 1.24.4
 *
 * @constructor
 * @public
 * @since 1.21.0
 * @name sap.viz.ui5.controls.common.feeds.AnalysisObject
 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
 */
sap.ui.core.Element.extend("sap.viz.ui5.controls.common.feeds.AnalysisObject", { metadata : {

	library : "sap.viz",
	properties : {
		"uid" : {type : "string", group : "Misc", defaultValue : null},
		"name" : {type : "string", group : "Misc", defaultValue : null},
		"type" : {type : "string", group : "Misc", defaultValue : null}
	}
}});


/**
 * Creates a new subclass of class sap.viz.ui5.controls.common.feeds.AnalysisObject with name <code>sClassName</code> 
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
 * @name sap.viz.ui5.controls.common.feeds.AnalysisObject.extend
 * @function
 */


/**
 * Getter for property <code>uid</code>.
 * Uid of analysis object
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>uid</code>
 * @public
 * @name sap.viz.ui5.controls.common.feeds.AnalysisObject#getUid
 * @function
 */

/**
 * Setter for property <code>uid</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sUid  new value for property <code>uid</code>
 * @return {sap.viz.ui5.controls.common.feeds.AnalysisObject} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.controls.common.feeds.AnalysisObject#setUid
 * @function
 */


/**
 * Getter for property <code>name</code>.
 * Name of an analysis object. Enumeration: Measure, Dimension
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>name</code>
 * @public
 * @name sap.viz.ui5.controls.common.feeds.AnalysisObject#getName
 * @function
 */

/**
 * Setter for property <code>name</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sName  new value for property <code>name</code>
 * @return {sap.viz.ui5.controls.common.feeds.AnalysisObject} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.controls.common.feeds.AnalysisObject#setName
 * @function
 */


/**
 * Getter for property <code>type</code>.
 * Type of an analysis object
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>type</code>
 * @public
 * @name sap.viz.ui5.controls.common.feeds.AnalysisObject#getType
 * @function
 */

/**
 * Setter for property <code>type</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sType  new value for property <code>type</code>
 * @return {sap.viz.ui5.controls.common.feeds.AnalysisObject} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.controls.common.feeds.AnalysisObject#setType
 * @function
 */


// Start of sap/viz/ui5/controls/common/feeds/AnalysisObject.js
///**
// * This file defines behavior for the control,
// */
sap.viz.ui5.controls.common.feeds.AnalysisObject.prototype._create = function(uid, name, type) {
	if (uid && type) {
		this._instance = new sap.viz.controls.common.feeds.AnalysisObject(uid, name, type);
	} else {
		this._requestedUid = uid || this._requestedUid;
		this._requestedType = type || this._requestedType;
		this._requestedName = name || this._requestedName;
	}
};

sap.viz.ui5.controls.common.feeds.AnalysisObject.prototype.init = function() {
	this._requestedUid = null;
	this._requestedType = null;
	this._requestedName = null;
};

sap.viz.ui5.controls.common.feeds.AnalysisObject.prototype.getUid = function() {
	return this._instance ? this._instance.id() : this._requestedUid;
};

sap.viz.ui5.controls.common.feeds.AnalysisObject.prototype.setUid = function(value) {
	this._create(value, this.getName(), this.getType());
	return this;
};

sap.viz.ui5.controls.common.feeds.AnalysisObject.prototype.getType = function() {
	return this._instance ? this._instance.type() : this._requestedType;
};

sap.viz.ui5.controls.common.feeds.AnalysisObject.prototype.setType = function(type) {
	if (type) {
		type = type.toLowerCase();
	}
	this._create(this.getUid(), this.getName(), type);

	return this;
};

sap.viz.ui5.controls.common.feeds.AnalysisObject.prototype.getName = function() {
	return this._instance ? this._instance.name() : this._requestedName;
};

sap.viz.ui5.controls.common.feeds.AnalysisObject.prototype.setName = function(name) {
	this._create(this.getUid(), name, this.getType());

	return this;
};

/**
 * Deserialize a JSON to AnalysisObject instance
 *
 * @name sap.viz.ui5.controls.common.feeds.AnalysisObject.fromJSON
 * @function
 * @param {object}
 *            oJsonObj
 *
 *
 * @type sap.viz.ui5.controls.common.feeds.AnalysisObject
 * @public
 */
sap.viz.ui5.controls.common.feeds.AnalysisObject.fromJSON = function(json) {
	var instance = sap.viz.controls.common.feeds.AnalysisObject.fromJSON(json);
	return new sap.viz.ui5.controls.common.feeds.AnalysisObject({
		'uid' : instance.id(),
		'name' : instance.name(),
		'type' : instance.type(),
	});
};

/**
 * Serialize a AnalysisObject instance to JSON
 *
 * @name sap.viz.ui5.controls.common.feeds.AnalysisObject.toJSON
 * @function
 * @param {sap.viz.ui5.controls.common.feeds.AnalysisObject}
 *            oAObject
 *
 *
 * @type object
 * @public
 */
sap.viz.ui5.controls.common.feeds.AnalysisObject.toJSON = function(analysisObject) {
	var instance = analysisObject ? analysisObject._instance : null;
	return sap.viz.controls.common.feeds.AnalysisObject.toJSON(instance);
};
sap.viz.ui5.controls.common.feeds.AnalysisObject.toAnalysisObjects = function(instances) {
	return Array.prototype.map.call(instances, function(instance, i, array) {
		return new sap.viz.ui5.controls.common.feeds.AnalysisObject({
			'uid': instance.id(),
			'name': instance.name(),
			'type': instance.type()
		});
	});
};
sap.viz.ui5.controls.common.feeds.AnalysisObject.toInstances = function(analysisObjects) {
	return Array.prototype.map.call(analysisObjects, function(analysisObject, i, array) {
		return analysisObject._instance;
	});
};
