jQuery.sap.declare("sap.zen.crosstab.DataArea");jQuery.sap.require("sap.zen.crosstab.BaseArea");jQuery.sap.require("sap.zen.crosstab.rendering.RenderingConstants");
sap.zen.crosstab.DataArea=function(c){"use strict";sap.zen.crosstab.BaseArea.call(this,c);this.sAreaType=sap.zen.crosstab.rendering.RenderingConstants.TYPE_DATA_AREA};
sap.zen.crosstab.DataArea.prototype=jQuery.sap.newObject(sap.zen.crosstab.BaseArea.prototype);
sap.zen.crosstab.DataArea.prototype.renderArea=function(r){this.renderContainerStructure(r,"sapzencrosstab-DataArea",this.oCrosstab.isVCutOff(),this.oCrosstab.isHCutOff())};
sap.zen.crosstab.DataArea.prototype.insertCell=function(c,r,C){sap.zen.crosstab.BaseArea.prototype.insertCell.call(this,c,r,C);if(C===this.oDataModel.getColCnt()-1&&c){c.addStyle(sap.zen.crosstab.rendering.RenderingConstants.STYLE_LAST_IN_ROW)}if(r===this.oDataModel.getRowCnt()-1&&c){c.addStyle(sap.zen.crosstab.rendering.RenderingConstants.STYLE_LAST_IN_COL)}};
