jQuery.sap.declare("sap.suite.ui.smartbusiness.tiles.Bullet");
jQuery.sap.require("sap.suite.ui.smartbusiness.tiles.Generic");
sap.suite.ui.smartbusiness.tiles.Generic.extend("sap.suite.ui.smartbusiness.tiles.Bullet", {
    metadata : {
        properties : {
            kpiValueRequired : {
                type : "boolean",
                defaultValue : true
            },
            tileType : {
                type : "string",
                defaultValue : "AT"
            }
        }
    },
    renderer : {} 
});

sap.suite.ui.smartbusiness.tiles.Bullet.prototype.init = function() {
    sap.suite.ui.smartbusiness.tiles.Generic.prototype.init.apply(this);
    //Write Init Code Here

    //Tiles will be always in Full/Complete Mode
    this.setAggregation("_tile", new sap.suite.ui.commons.GenericTile({
        header  :"{/header}",
        subheader  : "{/subheader}",
        size : this.getSize(),
        frameType : this.getFrameType(),
        tileContent : new sap.suite.ui.commons.TileContent({
            unit : "{/unit}",
            size: this.getSize(),
            footer : "{/footerNum}",
            content: new sap.suite.ui.commons.BulletChart({  
                size: this.getSize(),
                state: "{/state}",
                scale : "{/scale}",
                actual: {
                    value: "{/actual/value}",
                    color: "{/actual/color}"
                },
                actualValueLabel: "{/actualValueLabel}",
                targetValue: "{/targetValue}",
                targetValueLabel: "{/targetValueLabel}",
                thresholds: {
                    template: new sap.suite.ui.commons.BulletChartData({
                        value: "{value}",
                        color: "{color}"
                    }),
                    path: "/thresholds"
                },
                showActualValue: "{/showActualValue}",
                showTargetValue: "{/showTargetValue}",

            })
        }),
        press: jQuery.proxy(this.tilePressed, this)
    }));    
    this.jsonModel = new sap.ui.model.json.JSONModel();
    this.setModel(this.jsonModel);
};
sap.suite.ui.smartbusiness.tiles.Bullet.prototype.onBeforeRendering = function() {
    sap.suite.ui.smartbusiness.tiles.Generic.prototype.onBeforeRendering.apply(this);
    //Write onBeforeRendering Code Here

    if(this.getContentOnly()) {
        this.setAggregation("_tile", new sap.suite.ui.commons.BulletChart({  
            size: this.getSize(),
            state: "{/state}",
            scale : "{/scale}",
            actual: {
                value: "{/actual/value}",
                color: "{/actual/color}"
            },
            actualValueLabel: "{/actualValueLabel}",
            targetValue: "{/targetValue}",
            targetValueLabel: "{/targetValueLabel}",
            thresholds: {
                template: new sap.suite.ui.commons.BulletChartData({
                    value: "{value}",
                    color: "{color}"
                }),
                path: "/thresholds"
            },
            showActualValue: "{/showActualValue}",
            showTargetValue: "{/showTargetValue}",

        }));
    }

    //Later Just Update the Model Data

};

sap.suite.ui.smartbusiness.tiles.Bullet.prototype.doProcess = function() {
    var deviationTileObj={};
    var thresholdsArrayObjAndColor = this.getThresholdsObjAndColor(this.KPI_VALUE, this.EVALUATION_DATA.GOAL_TYPE,this.WARNING_LOW_VALUE,this.WARNING_HIGH_VALUE,this.CRITICAL_LOW_VALUE,this.CRITICAL_HIGH_VALUE);  
    var actualKpiObj={value:Number(this.KPI_VALUE),color:thresholdsArrayObjAndColor.returnColor};
    var calculatedValueForScaling = Number(this.KPI_VALUE);
    if(this.EVALUATION_DATA.SCALING == -2)
        calculatedValueForScaling *= 100;
    var formattedKpiValue  = sap.suite.smartbusiness.utils.getLocaleFormattedValue(calculatedValueForScaling, this.EVALUATION_DATA.SCALING);
    calculatedValueForScaling = Number(this.TARGET_VALUE);
    if(this.EVALUATION_DATA.SCALING == -2)
        calculatedValueForScaling *= 100;
    var formattedTargetValue = sap.suite.smartbusiness.utils.getLocaleFormattedValue(calculatedValueForScaling, this.EVALUATION_DATA.SCALING);
    if(true || this.isAssociatedKpi()) {
        deviationTileObj.subheader= this.EVALUATION_DATA.TITLE;
        deviationTileObj.header= this.EVALUATION_DATA.INDICATOR_TITLE;
    }
    deviationTileObj.actual=actualKpiObj;
    deviationTileObj.thresholds = [];
    deviationTileObj.thresholds = thresholdsArrayObjAndColor.arrObj;
    deviationTileObj.targetValue=Number(this.TARGET_VALUE);
    deviationTileObj.unit=this.UOM;
    //deviationTileObj.scale=this._oScalingFactor[this.EVALUATION_DATA.SCALING]; 
    deviationTileObj.actualValueLabel = formattedKpiValue.toString();
    deviationTileObj.targetValueLabel = formattedTargetValue.toString();
    if(this.EVALUATION_DATA.SCALING == -2){
        deviationTileObj.actualValueLabel += " %";
        deviationTileObj.targetValueLabel += " %";
    }

    this.jsonModel.setData(deviationTileObj);
    this.setDoneState();
};

/**
 * This method is called if tile is runing in DUMMY Mode
 */
sap.suite.ui.smartbusiness.tiles.Bullet.prototype.doDummyProcess = function() {
    this.jsonModel.setData(this.getDummyDataForBulletTile());
    this.setDoneState();
};
sap.suite.ui.smartbusiness.tiles.Bullet.prototype.getThresholdsObjAndColor = function(kpiValue,goalType,wL,wH,cL,cH) {
    var oThresholdObjAndColor = {};
    oThresholdObjAndColor.arrObj = [];
    oThresholdObjAndColor.returnColor = sap.suite.ui.commons.InfoTileValueColor.Neutral;

    if(goalType === "MI") {
        if(this.hasSomeValue(cH,wH)) {
            cH = window.parseFloat(cH);
            wH = window.parseFloat(wH);
            oThresholdObjAndColor.arrObj.push({value:cH,color:sap.suite.ui.commons.InfoTileValueColor.Error});
            oThresholdObjAndColor.arrObj.push({value:wH,color:sap.suite.ui.commons.InfoTileValueColor.Critical});

            if(kpiValue < wH) {
                oThresholdObjAndColor.returnColor = sap.suite.ui.commons.InfoTileValueColor.Good ;
            } 
            else if(kpiValue <= cH) {
                oThresholdObjAndColor.returnColor = sap.suite.ui.commons.InfoTileValueColor.Critical;
            } 
            else {
                oThresholdObjAndColor.returnColor = sap.suite.ui.commons.InfoTileValueColor.Error;
            }
        }
        else{
            jQuery.sap.log.warning("One of the threshold values for Minimizing type KPI is missing");
        }

    } 
    else if(goalType === "MA") {
        if(this.hasSomeValue(cL, wL)) {
            cL = window.parseFloat(cL);
            wL = window.parseFloat(wL);
            oThresholdObjAndColor.arrObj.push({value:cL,color:sap.suite.ui.commons.InfoTileValueColor.Error});
            oThresholdObjAndColor.arrObj.push({value:wL,color:sap.suite.ui.commons.InfoTileValueColor.Critical});

            if(kpiValue < cL) {
                oThresholdObjAndColor.returnColor = sap.suite.ui.commons.InfoTileValueColor.Error;
            } 
            else if(kpiValue <= wL) {
                oThresholdObjAndColor.returnColor = sap.suite.ui.commons.InfoTileValueColor.Critical;
            }
            else {
                oThresholdObjAndColor.returnColor = sap.suite.ui.commons.InfoTileValueColor.Good ;
            }
        }
        else{
            jQuery.sap.log.warning("One of the threshold values for Maximizing type KPI is missing");
        }
    } 
    else {
        if(this.hasSomeValue(wL, wH, cL, cH)) {
            cH = window.parseFloat(cH);
            wH = window.parseFloat(wH);
            wL = window.parseFloat(wL);
            cL = window.parseFloat(cL);
            oThresholdObjAndColor.arrObj.push({value:cH,color:sap.suite.ui.commons.InfoTileValueColor.Error});
            oThresholdObjAndColor.arrObj.push({value:wH,color:sap.suite.ui.commons.InfoTileValueColor.Critical});
            oThresholdObjAndColor.arrObj.push({value:wL,color:sap.suite.ui.commons.InfoTileValueColor.Critical});
            oThresholdObjAndColor.arrObj.push({value:cL,color:sap.suite.ui.commons.InfoTileValueColor.Error});

            if(kpiValue < cL || kpiValue > cH) {
                oThresholdObjAndColor.returnColor = sap.suite.ui.commons.InfoTileValueColor.Error;
            } 
            else if((kpiValue >= cL && kpiValue <= wL) || (kpiValue >= wH && kpiValue <= cH)){
                oThresholdObjAndColor.returnColor = sap.suite.ui.commons.InfoTileValueColor.Critical;
            } else {
                oThresholdObjAndColor.returnColor = sap.suite.ui.commons.InfoTileValueColor.Good ;
            }
        }
        else{
            jQuery.sap.log.warning("One of the threshold values for Range type KPI is missing");
        }
    }
    return oThresholdObjAndColor; 
};

