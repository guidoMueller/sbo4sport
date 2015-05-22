/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2014 SAP SE. All rights reserved
 */
sap.ui.define([],
  function(){
    /**
     * Contructor for ResponsiveLegend - must not be used: To get a ResponsiveLegend instance, please use VizFrame.getResponsiveLegend.
     * 
     * @public
     * @name sap.viz.ui5.controls.ResponsiveLegend
     */
    var ResponsiveLegend = function(){
      //Do not use the constructor
      throw new Error();
    };
    
    ResponsiveLegend.createInstance = function(oControl){
      var oResponsiveLegendControl = jQuery.sap.newObject(this.prototype);
      oResponsiveLegendControl._oLegendControl = oControl;
      return oResponsiveLegendControl;
    };
    
    ResponsiveLegend.prototype._oLegendControl = undefined;
    
    ResponsiveLegend.prototype.show = function(){
      this._oLegendControl.show();
    };
    
    ResponsiveLegend.prototype.hide = function(){
      this._oLegendControl.hide();
    };
    
    ResponsiveLegend.prototype.setOpenBy = function(openBy){
      this._oLegendControl.setOpenBy(openBy);
    };
    
    return ResponsiveLegend;
}, true);