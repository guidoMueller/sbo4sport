/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2014 SAP SE. All rights reserved
 */
jQuery.sap.declare("sap.viz.ui5.controls.VizFrameRenderer");sap.viz.ui5.controls.VizFrameRenderer={};
sap.viz.ui5.controls.VizFrameRenderer.render=function(r,c){r.write("<DIV");r.writeControlData(c);r.addClass("sapVizFrame");r.writeClasses();r.addStyle("width",c.getWidth());r.addStyle("height",c.getHeight());r.writeStyles();r.write(">");r.write("</DIV>")};
