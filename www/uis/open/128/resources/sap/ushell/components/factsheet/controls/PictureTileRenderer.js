/*!
 * SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2013 SAP AG. All rights reserved
*/
jQuery.sap.declare("sap.ushell.components.factsheet.controls.PictureTileRenderer");jQuery.sap.require("sap.m.CustomTileRenderer");sap.ushell.components.factsheet.controls.PictureTileRenderer=sap.ui.core.Renderer.extend(sap.m.CustomTileRenderer);
sap.ushell.components.factsheet.controls.PictureTileRenderer.render=function(r,c){jQuery.sap.log.debug("PictureTileRenderer :: begin rendering");r.write("<div ");r.writeControlData(c);r.addClass("sapCaUiPictureTile");r.writeClasses();r.write(">");r.write("<div");r.addClass("sapCaUiPictureTileContent");r.writeClasses();r.write(">");r.write("<div id='"+c.getId()+"-wrapper'>");r.renderControl(c._oDeletePictureButton);this._renderContent(r,c);r.write("</div>");r.write("</div></div>")};
sap.ushell.components.factsheet.controls.PictureTileRenderer._renderContent=function(r,t){r.renderControl(t.getContent())};
