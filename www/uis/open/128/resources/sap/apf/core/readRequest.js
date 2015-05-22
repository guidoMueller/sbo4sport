/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
jQuery.sap.declare("sap.apf.core.readRequest");jQuery.sap.require("sap.apf.core.request");
sap.apf.core.ReadRequest=function(i,r,s,e){var c=i.coreApi;var m=i.messageHandler;this.type="readRequest";this.send=function(f,C,R){var a=function(o,n){var M;var E;var d=[];if(o&&o.type&&o.type==="messageObject"){m.putMessage(o);M=o}else{d=o.data;E=o.metadata}C(d,E,M)};r.sendGetInBatch(f.getInternalFilter(),a,R)};this.getMetadata=function(){return c.getEntityTypeMetadata(s,e)};this.getMetadataFacade=function(){return c.getMetadataFacade(s)}};
