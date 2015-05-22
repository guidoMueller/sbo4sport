/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2014 SAP SE. All rights reserved
 */
jQuery.sap.declare("sap.ui.unified.CurrencyRenderer");sap.ui.unified.CurrencyRenderer={};
sap.ui.unified.CurrencyRenderer.render=function(r,c){var h=c._hasValue();r.write("<div");r.writeControlData(c);r.addClass("sapUiUfdCurrency");if(!c._hasValue()){r.addClass("sapUiUfdCurrencyNoVal")}r.writeClasses();r.write(">");r.write("<div");r.addClass("sapUiUfdCurrencyAlign");r.writeClasses();r.write(">");r.write("<span");r.addClass("sapUiUfdCurrencyValue");r.writeClasses();r.write(">");r.writeEscaped(c.getFormattedValue());r.write("</span>");r.write("<span");r.addClass("sapUiUfdCurrencyCurrency");r.writeClasses();r.write(">");if(c.getUseSymbol()){r.writeEscaped(c.getCurrencySymbol())}else{r.writeEscaped(c.getCurrency())}r.write("</span>");r.write("</div>");r.write("</div>")};
