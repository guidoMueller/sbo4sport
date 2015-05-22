/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2014 SAP SE. All rights reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.control, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides control sap.viz.ui5.data.FlattenedDataset.
jQuery.sap.declare("sap.viz.ui5.data.FlattenedDataset");
jQuery.sap.require("sap.viz.library");
jQuery.sap.require("sap.viz.ui5.data.Dataset");


/**
 * Constructor for a new ui5/data/FlattenedDataset.
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
 * <ul>
 * <li>{@link #getDimensions dimensions} : sap.viz.ui5.data.DimensionDefinition[]</li>
 * <li>{@link #getMeasures measures} : sap.viz.ui5.data.MeasureDefinition[]</li>
 * <li>{@link #getData data} : sap.ui.core.Element[]</li></ul>
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
 * In addition, all settings applicable to the base type {@link sap.viz.ui5.data.Dataset#constructor sap.viz.ui5.data.Dataset}
 * can be used as well.
 *
 * @param {string} [sId] id for the new control, generated automatically if no id is given 
 * @param {object} [mSettings] initial settings for the new control
 *
 * @class
 * A dataset for flattened (redundant) data using a tabular format.
 * @extends sap.viz.ui5.data.Dataset
 * @version 1.24.4
 *
 * @constructor
 * @public
 * @since 1.7.2
 * @experimental Since version 1.7.2. 
 * Charting API is not finished yet and might change completely
 * @name sap.viz.ui5.data.FlattenedDataset
 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
 */
sap.viz.ui5.data.Dataset.extend("sap.viz.ui5.data.FlattenedDataset", { metadata : {

	library : "sap.viz",
	aggregations : {
		"dimensions" : {type : "sap.viz.ui5.data.DimensionDefinition", multiple : true, singularName : "dimension"}, 
		"measures" : {type : "sap.viz.ui5.data.MeasureDefinition", multiple : true, singularName : "measure"}, 
		"data" : {type : "sap.ui.core.Element", multiple : true, singularName : "data", bindable : "bindable"}
	}
}});


/**
 * Creates a new subclass of class sap.viz.ui5.data.FlattenedDataset with name <code>sClassName</code> 
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
 * @name sap.viz.ui5.data.FlattenedDataset.extend
 * @function
 */


/**
 * Getter for aggregation <code>dimensions</code>.<br/>
 * List of definitions of all dimensions in this dataset
 * 
 * @return {sap.viz.ui5.data.DimensionDefinition[]}
 * @public
 * @name sap.viz.ui5.data.FlattenedDataset#getDimensions
 * @function
 */


/**
 * Inserts a dimension into the aggregation named <code>dimensions</code>.
 *
 * @param {sap.viz.ui5.data.DimensionDefinition}
 *          oDimension the dimension to insert; if empty, nothing is inserted
 * @param {int}
 *             iIndex the <code>0</code>-based index the dimension should be inserted at; for 
 *             a negative value of <code>iIndex</code>, the dimension is inserted at position 0; for a value 
 *             greater than the current size of the aggregation, the dimension is inserted at 
 *             the last position        
 * @return {sap.viz.ui5.data.FlattenedDataset} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.data.FlattenedDataset#insertDimension
 * @function
 */

/**
 * Adds some dimension <code>oDimension</code> 
 * to the aggregation named <code>dimensions</code>.
 *
 * @param {sap.viz.ui5.data.DimensionDefinition}
 *            oDimension the dimension to add; if empty, nothing is inserted
 * @return {sap.viz.ui5.data.FlattenedDataset} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.data.FlattenedDataset#addDimension
 * @function
 */

/**
 * Removes an dimension from the aggregation named <code>dimensions</code>.
 *
 * @param {int | string | sap.viz.ui5.data.DimensionDefinition} vDimension the dimension to remove or its index or id
 * @return {sap.viz.ui5.data.DimensionDefinition} the removed dimension or null
 * @public
 * @name sap.viz.ui5.data.FlattenedDataset#removeDimension
 * @function
 */

/**
 * Removes all the controls in the aggregation named <code>dimensions</code>.<br/>
 * Additionally unregisters them from the hosting UIArea.
 * @return {sap.viz.ui5.data.DimensionDefinition[]} an array of the removed elements (might be empty)
 * @public
 * @name sap.viz.ui5.data.FlattenedDataset#removeAllDimensions
 * @function
 */

/**
 * Checks for the provided <code>sap.viz.ui5.data.DimensionDefinition</code> in the aggregation named <code>dimensions</code> 
 * and returns its index if found or -1 otherwise.
 *
 * @param {sap.viz.ui5.data.DimensionDefinition}
 *            oDimension the dimension whose index is looked for.
 * @return {int} the index of the provided control in the aggregation if found, or -1 otherwise
 * @public
 * @name sap.viz.ui5.data.FlattenedDataset#indexOfDimension
 * @function
 */
	

/**
 * Destroys all the dimensions in the aggregation 
 * named <code>dimensions</code>.
 * @return {sap.viz.ui5.data.FlattenedDataset} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.data.FlattenedDataset#destroyDimensions
 * @function
 */


/**
 * Getter for aggregation <code>measures</code>.<br/>
 * list of definitions of all measures in this dataset
 * 
 * @return {sap.viz.ui5.data.MeasureDefinition[]}
 * @public
 * @name sap.viz.ui5.data.FlattenedDataset#getMeasures
 * @function
 */


/**
 * Inserts a measure into the aggregation named <code>measures</code>.
 *
 * @param {sap.viz.ui5.data.MeasureDefinition}
 *          oMeasure the measure to insert; if empty, nothing is inserted
 * @param {int}
 *             iIndex the <code>0</code>-based index the measure should be inserted at; for 
 *             a negative value of <code>iIndex</code>, the measure is inserted at position 0; for a value 
 *             greater than the current size of the aggregation, the measure is inserted at 
 *             the last position        
 * @return {sap.viz.ui5.data.FlattenedDataset} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.data.FlattenedDataset#insertMeasure
 * @function
 */

/**
 * Adds some measure <code>oMeasure</code> 
 * to the aggregation named <code>measures</code>.
 *
 * @param {sap.viz.ui5.data.MeasureDefinition}
 *            oMeasure the measure to add; if empty, nothing is inserted
 * @return {sap.viz.ui5.data.FlattenedDataset} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.data.FlattenedDataset#addMeasure
 * @function
 */

/**
 * Removes an measure from the aggregation named <code>measures</code>.
 *
 * @param {int | string | sap.viz.ui5.data.MeasureDefinition} vMeasure the measure to remove or its index or id
 * @return {sap.viz.ui5.data.MeasureDefinition} the removed measure or null
 * @public
 * @name sap.viz.ui5.data.FlattenedDataset#removeMeasure
 * @function
 */

/**
 * Removes all the controls in the aggregation named <code>measures</code>.<br/>
 * Additionally unregisters them from the hosting UIArea.
 * @return {sap.viz.ui5.data.MeasureDefinition[]} an array of the removed elements (might be empty)
 * @public
 * @name sap.viz.ui5.data.FlattenedDataset#removeAllMeasures
 * @function
 */

/**
 * Checks for the provided <code>sap.viz.ui5.data.MeasureDefinition</code> in the aggregation named <code>measures</code> 
 * and returns its index if found or -1 otherwise.
 *
 * @param {sap.viz.ui5.data.MeasureDefinition}
 *            oMeasure the measure whose index is looked for.
 * @return {int} the index of the provided control in the aggregation if found, or -1 otherwise
 * @public
 * @name sap.viz.ui5.data.FlattenedDataset#indexOfMeasure
 * @function
 */
	

/**
 * Destroys all the measures in the aggregation 
 * named <code>measures</code>.
 * @return {sap.viz.ui5.data.FlattenedDataset} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.data.FlattenedDataset#destroyMeasures
 * @function
 */


/**
 * Getter for aggregation <code>data</code>.<br/>
 * Data containing dimensions and measures.
 * 
 * <b>Note:</b> This aggregation can only be bound against a model, it cannot be managed
 * programmatically using the aggregation mutator methods like addData.
 * 
 * @return {sap.ui.core.Element[]}
 * @public
 * @name sap.viz.ui5.data.FlattenedDataset#getData
 * @function
 */


/**
 * Inserts a data into the aggregation named <code>data</code>.
 *
 * @param {sap.ui.core.Element}
 *          oData the data to insert; if empty, nothing is inserted
 * @param {int}
 *             iIndex the <code>0</code>-based index the data should be inserted at; for 
 *             a negative value of <code>iIndex</code>, the data is inserted at position 0; for a value 
 *             greater than the current size of the aggregation, the data is inserted at 
 *             the last position        
 * @return {sap.viz.ui5.data.FlattenedDataset} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.data.FlattenedDataset#insertData
 * @function
 */

/**
 * Adds some data <code>oData</code> 
 * to the aggregation named <code>data</code>.
 *
 * @param {sap.ui.core.Element}
 *            oData the data to add; if empty, nothing is inserted
 * @return {sap.viz.ui5.data.FlattenedDataset} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.data.FlattenedDataset#addData
 * @function
 */

/**
 * Removes an data from the aggregation named <code>data</code>.
 *
 * @param {int | string | sap.ui.core.Element} vData the data to remove or its index or id
 * @return {sap.ui.core.Element} the removed data or null
 * @public
 * @name sap.viz.ui5.data.FlattenedDataset#removeData
 * @function
 */

/**
 * Removes all the controls in the aggregation named <code>data</code>.<br/>
 * Additionally unregisters them from the hosting UIArea.
 * @return {sap.ui.core.Element[]} an array of the removed elements (might be empty)
 * @public
 * @name sap.viz.ui5.data.FlattenedDataset#removeAllData
 * @function
 */

/**
 * Checks for the provided <code>sap.ui.core.Element</code> in the aggregation named <code>data</code> 
 * and returns its index if found or -1 otherwise.
 *
 * @param {sap.ui.core.Element}
 *            oData the data whose index is looked for.
 * @return {int} the index of the provided control in the aggregation if found, or -1 otherwise
 * @public
 * @name sap.viz.ui5.data.FlattenedDataset#indexOfData
 * @function
 */
	

/**
 * Destroys all the data in the aggregation 
 * named <code>data</code>.
 * @return {sap.viz.ui5.data.FlattenedDataset} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.data.FlattenedDataset#destroyData
 * @function
 */


/**
 * Binder for aggregation <code>data</code>.
 *
 * @param {string} sPath path to a list in the model 
 * @param {sap.ui.core.Element} oTemplate the control template for this aggregation
 * @param {sap.ui.model.Sorter} oSorter the initial sort order (optional)
 * @param {array} aFilters the predefined filters for this aggregation (optional)
 * @return {sap.viz.ui5.data.FlattenedDataset} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.data.FlattenedDataset#bindData
 * @function
 */

/**
 * Unbinder for aggregation <code>data</code>.
 *
 * @return {sap.viz.ui5.data.FlattenedDataset} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.data.FlattenedDataset#unbindData
 * @function
 */


// Start of sap/viz/ui5/data/FlattenedDataset.js
jQuery.sap.require('sap.viz.ui5.data.transformers.ModelToCrosstable');
// jQuery.sap.require('sap.viz.ui5.data.transformers.ModelToCrosstable2');
jQuery.sap.require('sap.viz.ui5.data.transformers.ModelToFlattable');

// enable calling 'bindAggregation("data")' without a factory
sap.viz.ui5.data.FlattenedDataset.getMetadata().getAllAggregations()["data"]._doesNotRequireFactory = true;

sap.viz.ui5.data.FlattenedDataset.prototype.init = function() {
    this._transformer = null;
};

sap.viz.ui5.data.FlattenedDataset.prototype.updateData = function() {
    this.invalidate();
};

// override standard aggregation methods for 'data' and report an error when they are used
jQuery.each("add destroy get indexOf insert remove removeAll".split(" "), function(i, sMethod) {
    var sMessage = "FlattenedDataset manages the 'data' aggregation only via data binding. The method '" + sMethod + "Data' therefore cannot be used programmatically!";
    sap.viz.ui5.data.FlattenedDataset.prototype[sMethod + "Data"] = function() {
        jQuery.sap.log.error(sMessage);
    };
});

/**
 * @returns sap.viz.api.data.FlatTableDataset
 */
sap.viz.ui5.data.FlattenedDataset.prototype.getVIZFlatDataset = function() {
    return this._transform(sap.viz.ui5.data.transformers.ModelToFlattable);
};

/**
 * @returns sap.viz.data.CrosstableDataset
 */
sap.viz.ui5.data.FlattenedDataset.prototype.getVIZDataset = function() {
    return this._transform(sap.viz.ui5.data.transformers.ModelToCrosstable);
};

sap.viz.ui5.data.FlattenedDataset.prototype._transform = function(Transformer) {
    if (!this._transformer || !(this._transformer instanceof Transformer)) {
        this._transformer = new Transformer();
    }
    // @formatter:off
    return this._transformer.getVizDataset(
        this.getBinding("data"), this.getDimensions(), this.getMeasures(), 
        this._defaultSelectionInfo, this._info);
    // @formatter:on
};

sap.viz.ui5.data.FlattenedDataset.prototype.invalidate = function(oOther) {
    if (this._transformer) {
        this._transformer.reset();
    }
    sap.ui.core.Element.prototype.invalidate.apply(this, arguments);
};

/**
 * Set chart's default selection.
 * This api will do nothing when use VizFrame.
 *
 * @param {object[]} Array of default selection info
 * @deprecated Since 1.19.
 * Please use selection API {sap.viz.ui5.core.BaseChart.prototype.selection}.
 * @public
 */
sap.viz.ui5.data.FlattenedDataset.prototype.setDefaultSelection = function(selectionInfos) {
    // Deprecated
    // Will not apply to crosstable already created
    this._defaultSelectionInfo = {
        'type' : 'defaultSelection',
        'value' : selectionInfos
    };
};

/**
 * Get/Set additional info for the crosstable dataset By now, only "additionalData" info type is supported.
 * This api will do nothing when use VizFrame.
 *
 * @param {object[]} Array of Objects is for setting info and passes different types of infos objects.
 */
sap.viz.ui5.data.FlattenedDataset.prototype.info = function(values) {
    if ( values instanceof Array) {
        // Deprecated, not public
        // Will not apply to crosstable already created
        this._info = values;
    } else if (values === undefined || typeof values === 'string') {
        if (this._transformer && this._transformer instanceof sap.viz.ui5.data.transformers.ModelToCrosstable) {
            var crosstable = sap.viz.ui5.data.transformers.ModelToCrosstable.prototype.getVizDataset();
            if (crosstable) {
                return crosstable.info(values);
            }
        }
    }
};

/**
 * Find the model context for a given 'criteria' into chart data.
 *
 * The native sap.viz library provides data objects with the
 * <code>selectData</code> event. Applications can call this method for each data
 * in a selectData event to find the corresponding UI5 model context.
 *
 * When the dataset has not been converted into a VIZ dataset yet
 * (e.g. no rendering yet)  or when the coordinates of the path are not within
 * the range of the current dataset, then undefined will be returned.
 *
 * Example when use sap.viz.ui5.*:
 * <pre>
 * selectData: function(oEvent) {
 *   var aSelectData = oEvent.getParameter("data");
 *   var oContext = this.getDataset().findContext(aSelectData[0].data[0].ctx.path);
 * }
 * </pre>
 * Example when use sap.viz.ui5.controls.VizFrame:
 * <pre>
 * selectData: function(oEvent) {
 *   var aSelectData = oEvent.getParameter("data");
 *   var oContext = this.getDataset().findContext(aSelectData[0].data);
 * }
 * </pre>
 *
 * @param {object} oCriteria a structure as provided by the sap.viz library
 * @return {sap.ui.model.Context} the model context for the given criteria or undefined.
 * @experimental Since 1.16.6. Might later be integrated into the selectData event.
 * @public
 */
sap.viz.ui5.data.FlattenedDataset.prototype.findContext = function(oCriteria) {
	if (this._transformer) {
		return this._transformer.findContext(oCriteria);
	}
};
