/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2014 SAP SE. All rights reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.control, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides control sap.viz.ui5.core.BaseStructuredType.
jQuery.sap.declare("sap.viz.ui5.core.BaseStructuredType");
jQuery.sap.require("sap.viz.library");
jQuery.sap.require("sap.ui.core.Element");


/**
 * Constructor for a new ui5/core/BaseStructuredType.
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
 * In addition, all settings applicable to the base type {@link sap.ui.core.Element#constructor sap.ui.core.Element}
 * can be used as well.
 *
 * @param {string} [sId] id for the new control, generated automatically if no id is given 
 * @param {object} [mSettings] initial settings for the new control
 *
 * @class
 * Abstract base class for all elements that represent VIZ modules or complex property types
 * @extends sap.ui.core.Element
 * @version 1.24.4
 *
 * @constructor
 * @public
 * @since 1.7.2
 * @experimental Since version 1.7.2. 
 * Charting API is not finished yet and might change completely
 * @name sap.viz.ui5.core.BaseStructuredType
 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
 */
sap.ui.core.Element.extend("sap.viz.ui5.core.BaseStructuredType", { metadata : {

	"abstract" : true,
	library : "sap.viz"
}});


/**
 * Creates a new subclass of class sap.viz.ui5.core.BaseStructuredType with name <code>sClassName</code> 
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
 * @name sap.viz.ui5.core.BaseStructuredType.extend
 * @function
 */


// Start of sap/viz/ui5/core/BaseStructuredType.js
sap.viz.ui5.core.BaseStructuredType.prototype._getOrCreate = function(sName) {
  var o = this.getAggregation(sName);
  if ( !o ) {
  	var oAggregation = this.getMetadata().getAggregations()[sName];
  	jQuery.sap.require(oAggregation.type);
  	var FNClass = jQuery.sap.getObject(oAggregation.type);
    o = new FNClass();
    this.setAggregation(sName, o);
  }
  return o;
};

sap.viz.ui5.core.BaseStructuredType.prototype._getOptions = function(bIncludeDefaults) {

	var oMetadata = this.getMetadata(),
			mOptions = {},
			mProps,mDefaults,mAggrs,n,oValue;
	
	// HACK: convert UI5 wrapper names back to VIZ names
	function tovizKey(n) {
	  n = (n === 'toolTip' ? 'tooltip' : n);
		return n;
	}
	
	function tovizValue(n){
	  var result = n;
	  switch(n){
	  case 'triangleUp' : 
	    result = 'triangle-up';
	    break;
	  case 'triangleDown' :
	    result = 'triangle-down';
	    break;
	  case 'triangleLeft' :
	    result = 'triangle-left';
	    break;
	  case 'triangleRight' :
	    result = 'triangle-right';
	    break;
	  }
    return result;
	}
	
	// enforce enrichment of metadata 
	oMetadata.getJSONKeys();
	
	// collect non-default values for all VIZ properties with a simple type
	var mProps = oMetadata.getAllProperties();
	var mDefaults = oMetadata.getPropertyDefaults();
	for(n in mProps) {
		// assumption: a property is a VIZ property if and only if it has been introduced by this class
		// This check needs to be enhanced as soon as inheritance is reflected in the wrappers
		if ( mProps[n]._oParent === oMetadata ) {   
	    oValue = this.getProperty(n);
	    // use values only for non-default values
	    if(oValue instanceof Array){
	      if(bIncludeDefaults || !mDefaults[n] || oValue.toString() !== mDefaults[n].toString()){
	        mOptions[tovizKey(n)] = tovizValue(oValue);
	      }
	    }else{
  	    if ( bIncludeDefaults || oValue !== mDefaults[n] ) {
  	    	mOptions[tovizKey(n)] = tovizValue(oValue);
  	    }
	    }
		}
	}
	
	// collect non-null values for all VIZ properties with a complex type
	var mAggrs = oMetadata.getAllAggregations();
	for(n in mAggrs) {
		// assumption: an aggregation is a VIZ aggregation if and only if it has been introduced by this class
		// This check needs to be enhanced as soon as inheritance is reflected in the wrappers
		if ( mAggrs[n]._oParent == oMetadata ) {  
	    oValue = this.getAggregation(n, null);
	    if ( oValue !== null ) {
	    	// transitively retrieve options 
	    	mOptions[tovizKey(n)] = oValue._getOptions(bIncludeDefaults);
	    }
		}
	}
	
	return mOptions;
};

/**
 * Helper method to convert a given object into an object of the type expected by the given aggregation.
 * Used to mediate between old and new Interaction APIs.
 * 
 * Although this is a static method, <code>this</code> must be the object that will aggregate the given 
 * object. <code>this</code> will be used to determine the metadata of the aggregation
 * 
 * @return {object} the converted object or - if not applicable - the given object 
 */
sap.viz.ui5.core.BaseStructuredType._convertAggregatedObject = function(sAggregationName, oObject, bMultiple) {
	if ( oObject != null ) {
		// get aggregation information
		var oAggregation = this.getMetadata().getAllAggregations()[sAggregationName];
		// get class name of the given object
		var sClassName = oObject.getMetadata && oObject.getMetadata().getName();
		if ( oAggregation && sClassName !== oAggregation.type ) { // TODO inheritance?
			// ensure that the class for the type is loaded
			jQuery.sap.require(oAggregation.type);
			// create a new instance of the desired class with the options of the current one
			var fnClass = jQuery.sap.getObject(oAggregation.type);
			oObject = new fnClass(oObject._getOptions(true)); // also include default values as they might differ between types
			jQuery.sap.log.warning("[Deprecated] Type of aggregation '" + this.getMetadata().getName() + "." + sAggregationName + " has been changed from '" + sClassName + "' to '" + oAggregation.type + "'.");
		}
	}
	return oObject;
};

sap.viz.ui5.core.BaseStructuredType.prototype.validateProperty = function(sPropertyName, oValue) {
	if ( /^(lineSize|size)$/.test(sPropertyName) ) {
		var oProperty = this.getMetadata().getAllProperties()[sPropertyName];
		if ( oProperty && oProperty.type === "int" && typeof oValue !== "number" ) {
			oValue = oValue ? parseInt(oValue, 10) : null;
		}
	}
	return sap.ui.core.Element.prototype.validateProperty.call(this, sPropertyName, oValue);
};

sap.viz.ui5.core.BaseStructuredType.prototype.validateAggregation = function(sAggregationName, oObject, bMultiple) {
	if ( sAggregationName === "selectability" ) {
		// can convert types in the following two cases 
		// - if a behaviors.Interaction receives a controller.Interaction_selectability (e.g. chart.GetInteraction().setSelectability(...) in old code)
		// - if a controller.Interaction receives a behaviors.Interaction_selectability
		oObject = sap.viz.ui5.core.BaseStructuredType._convertAggregatedObject.call(this, sAggregationName, oObject, bMultiple);
	}
	return sap.ui.core.Element.prototype.validateAggregation.call(this, sAggregationName, oObject, bMultiple);
};

