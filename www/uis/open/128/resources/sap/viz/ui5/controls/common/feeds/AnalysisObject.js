/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2014 SAP SE. All rights reserved
 */
jQuery.sap.declare("sap.viz.ui5.controls.common.feeds.AnalysisObject");jQuery.sap.require("sap.viz.library");jQuery.sap.require("sap.ui.core.Element");sap.ui.core.Element.extend("sap.viz.ui5.controls.common.feeds.AnalysisObject",{metadata:{library:"sap.viz",properties:{"uid":{type:"string",group:"Misc",defaultValue:null},"name":{type:"string",group:"Misc",defaultValue:null},"type":{type:"string",group:"Misc",defaultValue:null}}}});
sap.viz.ui5.controls.common.feeds.AnalysisObject.prototype._create=function(u,n,t){if(u&&t){this._instance=new sap.viz.controls.common.feeds.AnalysisObject(u,n,t)}else{this._requestedUid=u||this._requestedUid;this._requestedType=t||this._requestedType;this._requestedName=n||this._requestedName}};
sap.viz.ui5.controls.common.feeds.AnalysisObject.prototype.init=function(){this._requestedUid=null;this._requestedType=null;this._requestedName=null};
sap.viz.ui5.controls.common.feeds.AnalysisObject.prototype.getUid=function(){return this._instance?this._instance.id():this._requestedUid};
sap.viz.ui5.controls.common.feeds.AnalysisObject.prototype.setUid=function(v){this._create(v,this.getName(),this.getType());return this};
sap.viz.ui5.controls.common.feeds.AnalysisObject.prototype.getType=function(){return this._instance?this._instance.type():this._requestedType};
sap.viz.ui5.controls.common.feeds.AnalysisObject.prototype.setType=function(t){if(t){t=t.toLowerCase()}this._create(this.getUid(),this.getName(),t);return this};
sap.viz.ui5.controls.common.feeds.AnalysisObject.prototype.getName=function(){return this._instance?this._instance.name():this._requestedName};
sap.viz.ui5.controls.common.feeds.AnalysisObject.prototype.setName=function(n){this._create(this.getUid(),n,this.getType());return this};
sap.viz.ui5.controls.common.feeds.AnalysisObject.fromJSON=function(j){var i=sap.viz.controls.common.feeds.AnalysisObject.fromJSON(j);return new sap.viz.ui5.controls.common.feeds.AnalysisObject({'uid':i.id(),'name':i.name(),'type':i.type(),})};
sap.viz.ui5.controls.common.feeds.AnalysisObject.toJSON=function(a){var i=a?a._instance:null;return sap.viz.controls.common.feeds.AnalysisObject.toJSON(i)};
sap.viz.ui5.controls.common.feeds.AnalysisObject.toAnalysisObjects=function(a){return Array.prototype.map.call(a,function(b,i,c){return new sap.viz.ui5.controls.common.feeds.AnalysisObject({'uid':b.id(),'name':b.name(),'type':b.type()})})};
sap.viz.ui5.controls.common.feeds.AnalysisObject.toInstances=function(a){return Array.prototype.map.call(a,function(b,i,c){return b._instance})};
