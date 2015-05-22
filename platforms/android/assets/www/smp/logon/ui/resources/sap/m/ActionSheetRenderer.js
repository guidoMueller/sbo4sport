/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2014 SAP SE. All rights reserved
 */
jQuery.sap.declare("sap.m.ActionSheetRenderer");sap.m.ActionSheetRenderer={};
sap.m.ActionSheetRenderer.render=function(r,c){var a=c.getButtons(),i,m,b;for(i=0;i<a.length;i++){b=a[i];if(b.getIcon()){m=true}else{b.addStyleClass("sapMActionSheetButtonNoIcon")}}r.write("<div");r.writeControlData(c);r.addClass("sapMActionSheet");if(m){r.addClass("sapMActionSheetMixedButtons")}r.writeClasses();var t=c.getTooltip_AsString();if(t){r.writeAttributeEscaped("title",t)}r.write(">");for(i=0;i<a.length;i++){r.renderControl(a[i].addStyleClass("sapMActionSheetButton"))}if(sap.ui.Device.system.phone&&c.getShowCancelButton()){r.renderControl(c._getCancelButton())}r.write("</div>")};
