/*
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2014 SAP SE. All rights reserved
 */
jQuery.sap.declare('sap.viz.ui5.data.transformers.ModelToFlattable');
sap.viz.ui5.data.transformers.ModelToFlattable=function(){this.reset()};
sap.viz.ui5.data.transformers.ModelToFlattable.prototype.reset=function(o){this._oVIZFlatTable=null;this._aFlatContextLookup=null};
sap.viz.ui5.data.transformers.ModelToFlattable.prototype.getVizDataset=function(b,d,m){if(!this._oVIZFlatTable&&sap.viz.__svg_support){this._createVIZFlatTable(b,d,m)}return this._oVIZFlatTable||null};
sap.viz.ui5.data.transformers.ModelToFlattable.prototype.findContext=function(c){if(this._aFlatContextLookup&&typeof c==='object'&&c._id!==undefined){return this._aFlatContextLookup[c._id]}};
sap.viz.ui5.data.transformers.ModelToFlattable.prototype._createVIZFlatTable=function(b,d,m){var c=b&&b.getContexts(0,b.getLength());if(!c||c.length===0){if(this._oVIZFlatTable){delete this._oVIZFlatTable;this.invalidate()}return}var a=[],M=[],f={'metadata':{'fields':[]},'data':[]},C=[];jQuery.each(d,function(i,o){a.push({def:o,adapter:o._getAdapter()});f.metadata.fields.push({'id':o.getName(),'semanticType':'Dimension'})});jQuery.each(m,function(i,o){M.push({def:o,adapter:o._getAdapter()});f.metadata.fields.push({'id':o.getName(),'semanticType':'Measure'})});jQuery.each(c,function(I,o){if(!f.data[I]){f.data[I]=[]}for(var i=0;i<a.length;i++){var v=a[i].adapter(o);f.data[I].push(v)}for(var j=0;j<M.length;j++){var v=M[j].adapter(o);f.data[I].push(v)}C[I]=o});this._aFlatContextLookup=C;this._oVIZFlatTable=new sap.viz.api.data.FlatTableDataset(f)};
