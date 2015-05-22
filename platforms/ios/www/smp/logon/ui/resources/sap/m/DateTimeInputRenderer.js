/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2014 SAP SE. All rights reserved
 */
jQuery.sap.require("sap.ui.core.Renderer");jQuery.sap.require("sap.m.InputBaseRenderer");jQuery.sap.declare("sap.m.DateTimeInputRenderer");sap.m.DateTimeInputRenderer=sap.ui.core.Renderer.extend(sap.m.InputBaseRenderer);
sap.m.DateTimeInputRenderer.addOuterClasses=function(r,c){r.addClass("sapMDTI")};
sap.m.DateTimeInputRenderer.addCursorClass=function(r,c){if(c.getEnabled()&&c.getEditable()){r.addClass("sapMPointer")}};
sap.m.DateTimeInputRenderer.addOuterStyles=function(r,c){r.addStyle("width",c.getWidth())};
