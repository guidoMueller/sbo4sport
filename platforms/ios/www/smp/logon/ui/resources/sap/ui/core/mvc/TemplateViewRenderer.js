/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2014 SAP SE. All rights reserved
 */
sap.ui.define(['jquery.sap.global','./ViewRenderer'],function(q,V){"use strict";var T={};T.render=function(r,c){var a=r;a.write("<div");a.writeControlData(c);a.addClass("sapUiView");a.addClass("sapUiTmplView");V.addDisplayClass(a,c);a.addStyle("width",c.getWidth());a.addStyle("height",c.getHeight());a.writeStyles();a.writeClasses();a.write(">");a.renderControl(c._oTemplate);a.write("</div>")};return T},true);
