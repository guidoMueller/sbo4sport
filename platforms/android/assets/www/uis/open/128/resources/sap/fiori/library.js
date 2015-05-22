/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2014 SAP SE. All rights reserved
 */
jQuery.sap.declare("sap.fiori.library");jQuery.sap.require("sap.ui.core.Core");jQuery.sap.require("sap.ui.core.library");sap.ui.getCore().initLibrary({name:"sap.fiori",dependencies:["sap.ui.core"],types:[],interfaces:[],controls:[],elements:[],version:"1.24.5"});jQuery.sap.require("jquery.sap.resources");(function(){var c=sap.ui.getCore().getConfiguration(),l=c.getLanguage(),d=c.getLanguagesDeliveredWithCore(),L=jQuery.sap.resources._getFallbackLocales(l,d);l=L[0];if(l&&!window["sap-ui-debug"]){jQuery.sap.require("sap.fiori.messagebundle-preload_"+l)}}());
