/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
jQuery.sap.declare("sap.apf.core.metadataFactory");
sap.apf.core.MetadataFactory=function(i){this.type="metadataFactory";var t=this;var m=i.messageHandler;var c=i.configurationFactory;var h=i.hashtable;var M=i.metadata;var e=i.entityTypeMetadata;var f=i.metadataFacade;var a=i.metadataProperty;delete i.metadata;delete i.entityTypeMetadata;delete i.metadataFacade;delete i.metadataProperty;delete i.configurationFactory;var o=new h(m);this.getMetadata=function(A){if(o.hasItem(A)===false){o.setItem(A,{metadata:new M(i,A)})}return o.getItem(A).metadata};this.getEntityTypeMetadata=function(A,E){var b;var d=this.getMetadata(A);b=o.getItem(A).entityTypes;if(!b){b=new h(m);o.getItem(A).entityTypes=b}if(!b.getItem(E)){b.setItem(E,new e(m,E,d))}return b.getItem(E)};this.getMetadataFacade=function(A){return new f({messageHandler:m,metadataProperty:sap.apf.core.MetadataProperty,metadataFactory:t},A);return oMetadataFacade};this.getServiceDocuments=function(){return c.getServiceDocuments()}};
