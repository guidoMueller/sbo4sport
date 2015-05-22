/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2014 SAP SE. All rights reserved
 */
jQuery.sap.declare("sap.uiext.inbox.model.InboxCustomModel");jQuery.sap.require("sap.ui.model.odata.ODataModel");jQuery.sap.require("sap.uiext.inbox.model.InboxListBinding");sap.ui.model.odata.ODataModel.extend("sap.uiext.inbox.model.InboxCustomModel",{bindList:function(p,c,s,f,P){return new sap.uiext.inbox.model.InboxListBinding(this,p,c,s,f,P)}});
