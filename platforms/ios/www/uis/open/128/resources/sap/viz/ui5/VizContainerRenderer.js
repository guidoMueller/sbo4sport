/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2014 SAP SE. All rights reserved
 */
jQuery.sap.declare("sap.viz.ui5.VizContainerRenderer");sap.viz.ui5.VizContainerRenderer={};
sap.viz.ui5.VizContainerRenderer.render=function(r,c){r.write("<DIV");r.writeControlData(c);r.addClass("sapVizContainer");r.writeClasses();if(c.getWidth()){r.addStyle("width",c.getWidth())}else{r.addStyle("width","100%")}if(c.getHeight()){r.addStyle("height",c.getHeight())}else{r.addStyle("height","100%")}r.writeStyles();r.write(">");r.write("</DIV>")};
