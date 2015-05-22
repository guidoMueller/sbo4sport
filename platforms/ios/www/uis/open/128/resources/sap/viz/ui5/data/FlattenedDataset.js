/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2014 SAP SE. All rights reserved
 */
jQuery.sap.declare("sap.viz.ui5.data.FlattenedDataset");jQuery.sap.require("sap.viz.library");jQuery.sap.require("sap.viz.ui5.data.Dataset");sap.viz.ui5.data.Dataset.extend("sap.viz.ui5.data.FlattenedDataset",{metadata:{library:"sap.viz",aggregations:{"dimensions":{type:"sap.viz.ui5.data.DimensionDefinition",multiple:true,singularName:"dimension"},"measures":{type:"sap.viz.ui5.data.MeasureDefinition",multiple:true,singularName:"measure"},"data":{type:"sap.ui.core.Element",multiple:true,singularName:"data",bindable:"bindable"}}}});jQuery.sap.require('sap.viz.ui5.data.transformers.ModelToCrosstable');jQuery.sap.require('sap.viz.ui5.data.transformers.ModelToFlattable');sap.viz.ui5.data.FlattenedDataset.getMetadata().getAllAggregations()["data"]._doesNotRequireFactory=true;
sap.viz.ui5.data.FlattenedDataset.prototype.init=function(){this._transformer=null};
sap.viz.ui5.data.FlattenedDataset.prototype.updateData=function(){this.invalidate()};
jQuery.each("add destroy get indexOf insert remove removeAll".split(" "),function(i,m){var M="FlattenedDataset manages the 'data' aggregation only via data binding. The method '"+m+"Data' therefore cannot be used programmatically!";sap.viz.ui5.data.FlattenedDataset.prototype[m+"Data"]=function(){jQuery.sap.log.error(M)}});
sap.viz.ui5.data.FlattenedDataset.prototype.getVIZFlatDataset=function(){return this._transform(sap.viz.ui5.data.transformers.ModelToFlattable)};
sap.viz.ui5.data.FlattenedDataset.prototype.getVIZDataset=function(){return this._transform(sap.viz.ui5.data.transformers.ModelToCrosstable)};
sap.viz.ui5.data.FlattenedDataset.prototype._transform=function(T){if(!this._transformer||!(this._transformer instanceof T)){this._transformer=new T()}return this._transformer.getVizDataset(this.getBinding("data"),this.getDimensions(),this.getMeasures(),this._defaultSelectionInfo,this._info)};
sap.viz.ui5.data.FlattenedDataset.prototype.invalidate=function(o){if(this._transformer){this._transformer.reset()}sap.ui.core.Element.prototype.invalidate.apply(this,arguments)};
sap.viz.ui5.data.FlattenedDataset.prototype.setDefaultSelection=function(s){this._defaultSelectionInfo={'type':'defaultSelection','value':s}};
sap.viz.ui5.data.FlattenedDataset.prototype.info=function(v){if(v instanceof Array){this._info=v}else if(v===undefined||typeof v==='string'){if(this._transformer&&this._transformer instanceof sap.viz.ui5.data.transformers.ModelToCrosstable){var c=sap.viz.ui5.data.transformers.ModelToCrosstable.prototype.getVizDataset();if(c){return c.info(v)}}}};
sap.viz.ui5.data.FlattenedDataset.prototype.findContext=function(c){if(this._transformer){return this._transformer.findContext(c)}};
