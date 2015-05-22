/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
jQuery.sap.declare("sap.apf.utils.serializationMediator");
sap.apf.utils.SerializationMediator=function(i){this.savePath=function(a,b,c){var e={pathContextHandler:i.pathContextHandler.serialize()};if(typeof a==='string'&&typeof b==='function'){i.coreApi.savePath(a,b,e)}else if(typeof a==='string'&&typeof b==='string'&&typeof c==='function'){i.coreApi.savePath(a,b,c,e)}};this.openPath=function(p,c,n){var C=function(r,e,m){if(r&&r.path&&r.path.SerializedAnalysisPath&&r.path.SerializedAnalysisPath.pathContextHandler){i.pathContextHandler.deserialize(r.path.SerializedAnalysisPath.pathContextHandler);delete r.path.SerializedAnalysisPath.pathContextHandler}c(r,e,m)};i.coreApi.openPath(p,C,n)};this.deletePath=function(p,c){i.coreApi.deletePath(p,c)}};
