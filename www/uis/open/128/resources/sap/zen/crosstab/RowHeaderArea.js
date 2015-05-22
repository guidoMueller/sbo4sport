jQuery.sap.declare("sap.zen.crosstab.RowHeaderArea");jQuery.sap.require("sap.zen.crosstab.BaseArea");jQuery.sap.require("sap.zen.crosstab.rendering.RenderingConstants");
sap.zen.crosstab.RowHeaderArea=function(c){"use strict";sap.zen.crosstab.BaseArea.call(this,c);this.sAreaType=sap.zen.crosstab.rendering.RenderingConstants.TYPE_ROW_HEADER_AREA;this.iRenderStartRow=0;this.iRenderRowCnt=0;this.bLastPageLoaded=false};
sap.zen.crosstab.RowHeaderArea.prototype=jQuery.sap.newObject(sap.zen.crosstab.BaseArea.prototype);
sap.zen.crosstab.RowHeaderArea.prototype.renderArea=function(r){var c="sapzencrosstab-RowHeaderArea";if(this.oCrosstab.getPropertyBag().isMobileMode()){c+=" sapzencrosstab-MobileHeaderSeparator"}this.renderContainerStructure(r,c,this.oCrosstab.isVCutOff(),false)};
