/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2014 SAP SE. All rights reserved
 */
sap.ui.define(['jquery.sap.global','./PropertyBinding'],function(q,P){"use strict";var C=P.extend("sap.ui.model.ClientPropertyBinding",{constructor:function(m,p,c,a){P.apply(this,arguments);this.oValue=this._getValue()}});C.prototype.getValue=function(){return this.oValue};C.prototype._getValue=function(){var p=this.sPath.substr(this.sPath.lastIndexOf("/")+1);if(p=="__name__"){var a=this.oContext.split("/");return a[a.length-1]}return this.oModel.getProperty(this.sPath,this.oContext)};C.prototype.setContext=function(c){if(this.oContext!=c){this.oContext=c;if(this.isRelative()){this.checkUpdate()}}};return C},true);
