/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
jQuery.sap.declare("sap.apf.core.readRequestByRequiredFilter");jQuery.sap.require("sap.apf.core.request");
sap.apf.core.ReadRequestByRequiredFilter=function(I,r,s,e){var c=I.coreApi;var m=I.messageHandler;var M;this.type="readRequestByRequiredFilter";this.send=function(f,C,R){var a=function(g,n){var j;var E;var D=[];if(g&&g.type&&g.type==="messageObject"){m.putMessage(g);j=g}else{D=g.data;E=g.metadata}C(D,E,j)};if(!M){M=c.getMetadata(s)}var h=M.getHanaViewParameters(e);var b="";var E=M.getEntityTypeMetadata(e);if(E.requiresFilter!==undefined&&E.requiresFilter==="true"){if(E.requiredProperties!==undefined){b=E.requiredProperties}}var d=b.split(',');for(var i=0;i<h.length;i++){d.push(h[i].name)}var p=c.getContext().getInternalFilter().reduceToProperty(d);var o=f.getInternalFilter();o.addAnd(p);r.sendGetInBatch(o,a,R)};this.getMetadataFacade=function(){return c.getMetadataFacade(s)}};
