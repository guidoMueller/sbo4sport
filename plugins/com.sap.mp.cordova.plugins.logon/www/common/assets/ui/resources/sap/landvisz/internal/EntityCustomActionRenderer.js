/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2013 SAP AG. All rights reserved
 */
jQuery.sap.declare("sap.landvisz.internal.EntityCustomActionRenderer");sap.landvisz.internal.EntityCustomActionRenderer={};
sap.landvisz.internal.EntityCustomActionRenderer.render=function(r,c){if(!this.initializationDone){c.initControls();c.initializationDone=true;r.write("<div");r.writeControlData(c);r.addClass("sapLandviszAction");r.writeClasses();r.write("id=\"");r.write(c.getId()+"Action");r.write("\" title =\"");r.write(c.getCustomAction());r.write("\">");r.write(c.getCustomAction());r.write("</div>")}};
