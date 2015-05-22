/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2014 SAP SE. All rights reserved
 */
jQuery.sap.declare("sap.viz.ui5.controls.common.feeds.FeedItem");jQuery.sap.require("sap.viz.library");jQuery.sap.require("sap.ui.core.Element");sap.ui.core.Element.extend("sap.viz.ui5.controls.common.feeds.FeedItem",{metadata:{library:"sap.viz",properties:{"uid":{type:"string",group:"Misc",defaultValue:null},"type":{type:"string",group:"Misc",defaultValue:null},"values":{type:"string[]",group:"Misc",defaultValue:null}}}});jQuery.sap.require("sap.viz.ui5.controls.common.feeds.AnalysisObject");
sap.viz.ui5.controls.common.feeds.FeedItem.prototype._create=function(){var u=this.getProperty('uid');var t=this.getProperty('type');var v=this.getProperty('values');if(u&&t){var a=[];if(v){v.forEach(function(b,i,v){if(typeof b==='string'){v[i]=new sap.viz.ui5.controls.common.feeds.AnalysisObject({'uid':b,'name':b,'type':t})}}.bind(this));a=sap.viz.ui5.controls.common.feeds.AnalysisObject.toInstances(v)}this._instance=new sap.viz.controls.common.feeds.FeedItem(u,t,a)}};
sap.viz.ui5.controls.common.feeds.FeedItem.prototype.init=function(){};
sap.viz.ui5.controls.common.feeds.FeedItem.prototype.getUid=function(){return this._instance?this._instance.id():this.getProperty('uid')};
sap.viz.ui5.controls.common.feeds.FeedItem.prototype.setUid=function(u){this.setProperty('uid',u);this._create();return this};
sap.viz.ui5.controls.common.feeds.FeedItem.prototype.getType=function(){return this._instance?this._instance.type():this.getProperty('type')};
sap.viz.ui5.controls.common.feeds.FeedItem.prototype.setType=function(t){this.setProperty('type',t);this._create();return this};
sap.viz.ui5.controls.common.feeds.FeedItem.prototype.getValues=function(){if(this._instance){return sap.viz.ui5.controls.common.feeds.AnalysisObject.toAnalysisObjects(this._instance.values())}else{return this.getProperty('values')}};
sap.viz.ui5.controls.common.feeds.FeedItem.prototype.setValues=function(v){this.setProperty('values',v);this._create();return this};
sap.viz.ui5.controls.common.feeds.FeedItem.fromJSON=function(j){return sap.viz.controls.common.feeds.FeedItem.fromJSON(j)};
sap.viz.ui5.controls.common.feeds.FeedItem.toJSON=function(o){return sap.viz.controls.common.feeds.FeedItem.toJSON(o)};
sap.viz.ui5.controls.common.feeds.FeedItem.toFeeds=function(a){return Array.prototype.map.call(a,function(b,i,c){return new sap.viz.ui5.controls.common.feeds.FeedItem({'uid':b.id(),'type':b.type(),'values':sap.viz.ui5.controls.common.feeds.AnalysisObject.toAnalysisObjects(b.values())})})};
sap.viz.ui5.controls.common.feeds.FeedItem.toInstances=function(f){return Array.prototype.map.call(f,function(a,i,b){return a._instance})};
