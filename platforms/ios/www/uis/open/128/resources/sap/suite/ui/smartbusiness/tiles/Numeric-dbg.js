jQuery.sap.declare("sap.suite.ui.smartbusiness.tiles.Numeric");
jQuery.sap.require("sap.suite.ui.smartbusiness.tiles.Generic");
sap.suite.ui.smartbusiness.tiles.Generic.extend("sap.suite.ui.smartbusiness.tiles.Numeric", {
    metadata : {
        properties : {
            kpiValueRequired : {
                type : "boolean",
                defaultValue : true//For Comparision Tile, this can be set as false
            },
            tileType : {
                type : "string",
                defaultValue : "NT" //All Tiles Should define their type "Numeric/Bullet/Comparison/AreaChart"
            }
        }
    },
    renderer : {} //No need to write Anything
});

sap.suite.ui.smartbusiness.tiles.Numeric.prototype.init = function() {
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
            content: new sap.suite.ui.commons.NumericContent({
                value : "{/value}",
                scale : "{/scale}",
                unit : "{/unit}",
                indicator : "{/indicator}",
                valueColor: "{/valueColor}",
                size: this.getSize(),
                state: "{/state}",
                formatterValue : "{/formatterValue}",
                truncateValueTo : 6,
                nullifyValue : false
            })
        }),
        press: jQuery.proxy(this.tilePressed, this)        
    }));
    this.jsonModel = new sap.ui.model.json.JSONModel();
    this.setModel(this.jsonModel);
};
sap.suite.ui.smartbusiness.tiles.Numeric.prototype.onBeforeRendering = function() {
    sap.suite.ui.smartbusiness.tiles.Generic.prototype.onBeforeRendering.apply(this);
    //Write onBeforeRendering Code Here
    
    //Override fulltile to only COntent
    if(this.getContentOnly()) {
        this.setAggregation("_tile", new sap.suite.ui.commons.NumericContent({
            value : "{/value}",
            scale : "{/scale}",
            unit : "{/unit}",
            indicator : "{/indicator}",
            valueColor: "{/valueColor}",
            size: this.getSize(),
            state: "{/state}",
            formatterValue : true,
            truncateValueTo : 6,
        }));
    }
    
    //Later Just Update the Model Data
    
};
/*
 * All Tiles must implement this methods.. This method is called once parent controls finishes loading Evaluation Details and 
 * Kpi Value(if required)
 * 
 * Don't enclose your any code in try/Catch. Parent Control is already doing it.
 * In other words, Do not handle any exception
 */
sap.suite.ui.smartbusiness.tiles.Numeric.prototype.doProcess = function() {
    /**
     * PROPERTIES AVAILABLE which can be accessed in this Method
     * 
     * 
     * this.EVALUATION_ID
     * this.EVALUATION_DATA //Evaluation-Data
     * this.KPI_VALUE
     * this.UOM //if present else empty string
     * this.WARNING_LOW_VALUE
     * this.WARNING_HIGH_VALUE,
     * this.CRITICAL_LOW_VALUE
     * this.CRITICAL_HIGH_VALUE
     * this.TARGET_VALUE
     * this.TREND_VALUE
     * this.LABEL_PROPERTY_MAPPING //Object with key as Original Dimension/Measure and value as Dimension/Measure Label
     * this.TEXT_PROPERTY_MAPPING //
     * this.UOM_PROPERTY_MAPPING //
     * this.getScalingFactorMapping() //{"0":"","3" : "Kilo" ......}
     * this.getTileControl() //returns the Aggregation _tile reference
     * 
     * to Check if current kpi is associated call
     * this.isAssociatedKpi()
     * 
     * Note* : All the thresholds values at this point will be ABSOLUTE VALUE. So you don't need to check, whether its FIXED or MEASURE
     * Use these value blindly (But react on NULL)
     */
		
		var numericTileObj={};
		numericTileObj.valueColor = this._applyTrendColor();
		numericTileObj.indicator = this._applyTrendIndicator();
		numericTileObj.frameType = this.getFrameType();
		numericTileObj.unit = this.UOM;
		var oScaledValue = "";
        var calculatedValueForScaling = this.KPI_VALUE;
        if(this.EVALUATION_DATA.SCALING == -2){
            calculatedValueForScaling *= 100;
            numericTileObj.formatterValue = false;
        }
		var formatValue = sap.suite.smartbusiness.utils.getLocaleFormattedValue(calculatedValueForScaling, this.EVALUATION_DATA.SCALING);
		if(this.EVALUATION_DATA.SCALING == -2) 
		    numericTileObj.scale = "%"
		numericTileObj.value = formatValue.toString();
		if(true || this.isAssociatedKpi()){
			numericTileObj.header = this.EVALUATION_DATA.INDICATOR_TITLE;
			numericTileObj.subheader = this.EVALUATION_DATA.TITLE;
		}
		this.jsonModel.setData(numericTileObj);
		this.jsonModel.updateBindings();
		this.setDoneState();
				
	
};

/**
 * This method is called if tile is runing in DUMMY Mode
 */
sap.suite.ui.smartbusiness.tiles.Numeric.prototype.doDummyProcess = function() {
    /*
     * this.getDummyDataForNumericTile();
     * this.getDummyDataForBulletTile();
     * this.getDummyDataForAreaChartTile();
     * this.getDummyDataForComparisonTile();
     * 
     * and bind with Control
     */
    this.jsonModel.setData(this.getDummyDataForNumericTile());
};

sap.suite.ui.smartbusiness.tiles.Numeric.prototype._applyTrendColor = function() {
	
	var returnColor = null;
	var wL = window.parseFloat(this.WARNING_LOW_VALUE);
	var cL = window.parseFloat(this.CRITICAL_LOW_VALUE);
	var cH = window.parseFloat(this.CRITICAL_HIGH_VALUE);
	var wH = window.parseFloat(this.WARNING_HIGH_VALUE);
	var improvementDirection = this.EVALUATION_DATA.GOAL_TYPE;
    if(this.evaluationApi.isMinimizingKpi()) {
        if(this.hasSomeValue(cH, wH)) {
            if(this.KPI_VALUE < wH) {
                returnColor = sap.suite.ui.commons.InfoTileValueColor.Good ;
            } else if(this.KPI_VALUE <= cH) {
                returnColor = sap.suite.ui.commons.InfoTileValueColor.Critical;
            } else {
                returnColor = sap.suite.ui.commons.InfoTileValueColor.Error;
            }
        }

    } else if(this.evaluationApi.isMaximizingKpi()) {
        if(this.hasSomeValue(cL, wL)) {
            if(this.KPI_VALUE < cL) {
                returnColor = sap.suite.ui.commons.InfoTileValueColor.Error;
            } else if(this.KPI_VALUE <= wL) {
                returnColor = sap.suite.ui.commons.InfoTileValueColor.Critical;
            } else {
                returnColor = sap.suite.ui.commons.InfoTileValueColor.Good ;
            }
        }
    } else {
        if(this.hasSomeValue(wL, wH, cL, cH)) {
            if(this.KPI_VALUE < cL || this.KPI_VALUE > cH) {
                returnColor = sap.suite.ui.commons.InfoTileValueColor.Error;
            } else if((this.KPI_VALUE >= cL && this.KPI_VALUE <= wL) || 
                    (this.KPI_VALUE >= wH && this.KPI_VALUE <= cH)
            ) {
                returnColor = sap.suite.ui.commons.InfoTileValueColor.Critical;
            } else {
                returnColor = sap.suite.ui.commons.InfoTileValueColor.Good ;
            }
        }
    }
    return returnColor;
};

sap.suite.ui.smartbusiness.tiles.Numeric.prototype._applyTrendIndicator = function() {
	
	var trendIndicator = sap.suite.ui.commons.DeviationIndicator.None;
	if(this.TREND_VALUE || this.TREND_VALUE == "0") {
	    if(this.TREND_VALUE > this.KPI_VALUE){
	        trendIndicator = sap.suite.ui.commons.DeviationIndicator.Down;
	    }
	    else if(this.TREND_VALUE < this.KPI_VALUE){
	        trendIndicator = sap.suite.ui.commons.DeviationIndicator.Up;
	    }
	}
	return trendIndicator;
}


