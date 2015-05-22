/*!
 * SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2013 SAP AG. All rights reserved
 */
jQuery.sap.declare("sap.suite.ui.commons.ComparisonChart");jQuery.sap.require("sap.suite.ui.commons.library");jQuery.sap.require("sap.ui.core.Control");sap.ui.core.Control.extend("sap.suite.ui.commons.ComparisonChart",{metadata:{library:"sap.suite.ui.commons",properties:{"scale":{type:"string",group:"Misc",defaultValue:null},"size":{type:"sap.suite.ui.commons.InfoTileSize",group:"Misc",defaultValue:sap.suite.ui.commons.InfoTileSize.Auto},"width":{type:"sap.ui.core.CSSSize",group:"Misc",defaultValue:null},"colorPalette":{type:"string[]",group:"Misc",defaultValue:[]}},aggregations:{"data":{type:"sap.suite.ui.commons.ComparisonData",multiple:true,singularName:"data"}},events:{"press":{}}}});sap.suite.ui.commons.ComparisonChart.M_EVENTS={'press':'press'};
/*!
 * @copyright@
 */

sap.suite.ui.commons.ComparisonChart.prototype.init=function(){this._oRb=sap.ui.getCore().getLibraryResourceBundle("sap.suite.ui.commons")};
sap.suite.ui.commons.ComparisonChart.prototype._calculateChartData=function(){var r=[];var d=this.getData();var c=d.length;var m=0;var M=0;var t;var a;var b;var i;for(i=0;i<c;i++){var D=isNaN(d[i].getValue())?0:d[i].getValue();m=Math.max(m,D);M=Math.min(M,D)}t=m-M;a=(t==0)?0:Math.round(m*100/t);if(a==0&&m!=0){a=1}else if(a==100&&M!=0){a=99}b=100-a;for(i=0;i<c;i++){var I={};var D=isNaN(d[i].getValue())?0:d[i].getValue();I.value=(t==0)?0:Math.round(D*100/t);if(I.value==0&&D!=0){I.value=(D>0)?1:-1}else if(I.value==100){I.value=a}else if(I.value==-100){I.value=-b}if(I.value>=0){I.negativeNoValue=b;I.positiveNoValue=a-I.value}else{I.value=-I.value;I.negativeNoValue=b-I.value;I.positiveNoValue=a}r.push(I)}return r};
sap.suite.ui.commons.ComparisonChart.prototype.ontap=function(e){if(sap.ui.Device.browser.internet_explorer){this.$().focus()}this.firePress()};
sap.suite.ui.commons.ComparisonChart.prototype.onkeydown=function(e){if(e.which==jQuery.sap.KeyCodes.ENTER||e.which==jQuery.sap.KeyCodes.SPACE){this.firePress();e.preventDefault()}};
sap.suite.ui.commons.ComparisonChart.prototype.attachEvent=function(e,d,f,l){sap.ui.core.Control.prototype.attachEvent.call(this,e,d,f,l);if(this.hasListeners("press")){this.$().attr("tabindex",0).attr("role","button").addClass("sapSuiteUiCommonsPointer")}return this};
sap.suite.ui.commons.ComparisonChart.prototype.detachEvent=function(e,f,l){sap.ui.core.Control.prototype.detachEvent.call(this,e,f,l);if(!this.hasListeners("press")){this.$().removeAttr("tabindex").attr("role","img").removeClass("sapSuiteUiCommonsPointer")}return this};
sap.suite.ui.commons.ComparisonChart.prototype.getLocalizedColorMeaning=function(c){return this._oRb.getText(("SEMANTIC_COLOR_"+c).toUpperCase())};
sap.suite.ui.commons.ComparisonChart.prototype.getAltText=function(){var s=this.getScale();var a="";for(var i=0;i<this.getData().length;i++){var b=this.getData()[i];var m=(this.getColorPalette().length)?"":this.getLocalizedColorMeaning(b.getColor());a+=((i==0)?"":"\n")+b.getTitle()+" "+(b.getDisplayValue()?b.getDisplayValue():b.getValue())+s+" "+m}return a};
sap.suite.ui.commons.ComparisonChart.prototype.getTooltip_AsString=function(){var t=this.getTooltip();var T=this.getAltText();if(typeof t==="string"||t instanceof String){if(t.indexOf("{AltText}")!=-1){T=t.split("{AltText}").join(T)}else{T=t}}return T};
