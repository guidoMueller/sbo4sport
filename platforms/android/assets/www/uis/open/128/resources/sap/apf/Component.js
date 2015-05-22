/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
(function(){'use strict';jQuery.sap.declare("sap.apf.Component");jQuery.sap.require("sap.ui.core.UIComponent");jQuery.sap.require("sap.apf.api");sap.ui.core.UIComponent.extend("sap.apf.Component",{oApi:null,metadata:{"name":"CoreComponent","version":"0.0.1","publicMethods":["getApi"],"dependencies":{"libs":["sap.m","sap.ui.ux3","sap.ca.ui"]}},init:function(){this.oApi=new sap.apf.Api(this);this.oApi.activateOnErrorHandling(true);sap.ui.core.UIComponent.prototype.init.apply(this,arguments)},createContent:function(){return sap.ui.core.UIComponent.prototype.createContent.apply(this,arguments)},getApi:function(){return this.oApi}})}());
