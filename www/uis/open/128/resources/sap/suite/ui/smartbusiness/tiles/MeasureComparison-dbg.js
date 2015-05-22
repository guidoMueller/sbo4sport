jQuery.sap.declare("sap.suite.ui.smartbusiness.tiles.MeasureComparison");
jQuery.sap.require("sap.suite.ui.smartbusiness.tiles.Generic");
sap.suite.ui.smartbusiness.tiles.Generic.extend("sap.suite.ui.smartbusiness.tiles.MeasureComparison", {
    metadata : {
        properties : {
            kpiValueRequired : {
                type : "boolean",
                defaultValue : false
            },
            tileType : {
                type : "string",
                defaultValue : "CM"
            }
        }
    },
    renderer : {} //No need to write Anything
});

sap.suite.ui.smartbusiness.tiles.MeasureComparison.prototype.init = function() {
    sap.suite.ui.smartbusiness.tiles.Generic.prototype.init.apply(this);
    this._bShowUOM = false;
    this._bUseFormattedVDMValue = false;
    this._bShowKpiMeasureUOMInFooter = false;
    this._bHasKpiMeasure = null;
    this.setAggregation("_tile", new sap.suite.ui.commons.GenericTile({
        header  :"{/header}",
        subheader  : "{/subheader}",
        size : this.getSize(),
        frameType : this.getFrameType(),
        tileContent : new sap.suite.ui.commons.TileContent({
            unit : "{/unit}",
            size: this.getSize(),
            footer : "{/footerNum}",
            content: new sap.suite.ui.commons.ComparisonChart({
                scale : "{/scale}",
                size: this.getSize(),
                state: "{/state}",
                data: {
                    template: new sap.suite.ui.commons.ComparisonData({
                        title: "{title}",
                        value : "{value}",
                        color: "{color}",
                        displayValue : "{displayValue}"
                    }),
                    path: "/data"
                }
            })
        }),
        press: jQuery.proxy(this.tilePressed, this)
    }));
    this.jsonModel = new sap.ui.model.json.JSONModel();
    this.setModel(this.jsonModel);
};
sap.suite.ui.smartbusiness.tiles.MeasureComparison.prototype.onBeforeRendering = function() {
    sap.suite.ui.smartbusiness.tiles.Generic.prototype.onBeforeRendering.apply(this);
    if(this.getContentOnly()) {
        this.setAggregation("_tile", new sap.suite.ui.commons.ComparisonChart({
            scale : "{/scale}",
            size: this.getSize(),
            state: "{/state}",
            data: {
                template: new sap.suite.ui.commons.ComparisonData({
                    title: "{title}",
                    value : "{value}",
                    color: "{color}",
                    displayValue : "{displayValue}"
                }),
                path: "/data"
            }
        }));
    }
};

sap.suite.ui.smartbusiness.tiles.MeasureComparison.prototype.doProcess = function() {
    var that = this;
    this._fetchDataForMeasureComparisonTile(function(comparisionData) {
        var jsonData={};
        this._processedComparisionData = this._processMeasureComparisionData(comparisionData);
        jsonData.data = this._processedComparisionData;
        if(true || that.isAssociatedKpi()) {
        	jsonData.subheader= this.evaluationApi.getTitle();
        	jsonData.header= this.evaluationApi.getKpiName();
        }
        if(this._bShowKpiMeasureUOMInFooter && this._bHasKpiMeasure) {
        	var kpiMeasureUOMProperty = this.UOM_PROPERTY_MAPPING[this.evaluationApi.getKpiMeasureName()];
        	if(kpiMeasureUOMProperty) {
        		jsonData.unit = comparisionData[kpiMeasureUOMProperty];
        	}
        }
        that.jsonModel.setData(jsonData);
        that.setDoneState();
    }, this.logError);
};

sap.suite.ui.smartbusiness.tiles.MeasureComparison.prototype._fetchDataForMeasureComparisonTile = function(fnSuccess,fnError){
    var that = this;
    var _getAllMeasures  = function(tileConfiguration) {
    	var measures = [];
    	if(tileConfiguration && tileConfiguration.MEASURES && tileConfiguration.MEASURES.length) {
    		var configMeasures = tileConfiguration.MEASURES;
    		for(var i=0, l=configMeasures.length; i < l;i++) {
    			measures.push(configMeasures[i].name);
    		}
    	}
    	if(measures.length) {
        	return measures;
    	} else {
    		throw new Error("No Measures Defined for Measure Comparision Tile");
    	}
    };
    /* Preparing arguments for the prepareQueryServiceUri function */
    var oParam = {};
    oParam.serviceUri = this._addSystemAliasToUri(this.evaluationApi.getODataUrl(), this.getSapSystem());
    oParam.entitySet = this.evaluationApi.getEntitySet();
    oParam.measure = _getAllMeasures(this.getTileConfiguration());
    if(oParam.measure.indexOf(this.evaluationApi.getKpiMeasureName()) > -1) {
    	this._bHasKpiMeasure = true;
    }
    oParam.filter = this.getAllFilters();
    var finalQuery = sap.suite.smartbusiness.odata.getUri(oParam);
    this.comparisionChartODataRef = finalQuery.model.read(finalQuery.uri, null, null, true, function(data) {
        if(data && data.results && data.results.length) {
            fnSuccess.call(that,data.results[0]);
        } else {
            fnError.call(that,"no Response from QueryServiceUri");
        }
    },function(eObject) {
        if(eObject && eObject.response) {
            jQuery.sap.log.error(eObject.message +" : "+eObject.request.requestUri);
        }
    });
};
sap.suite.ui.smartbusiness.tiles.MeasureComparison.prototype._processMeasureComparisionData = function(rawComparisionData) {
	var processedData = [],formattedValue, VDMFormattedProperty,UOM,measureTile, measureName,i, measures, obj;
	measures = this.getTileConfiguration().MEASURES;
	for(i=0, l=measures.length; i < l; i++) {
		obj = {};
		measureName = measures[i].name;
		measureTile = this.LABEL_PROPERTY_MAPPING[measureName];
		obj["title"] = measureTile;
		
		UOM = this.UOM_PROPERTY_MAPPING[measureName];
		VDMFormattedProperty = this.TEXT_PROPERTY_MAPPING[measureName];
		if(this._bUseFormattedVDMValue && VDMFormattedProperty && (VDMFormattedProperty != measureName)) {
			formattedValue = rawComparisionData[VDMFormattedProperty];
		} else {
	        formattedValue = sap.suite.smartbusiness.utils.getLocaleFormattedValue(Number(rawComparisionData[measureName]));
		}
        obj.value = Number(rawComparisionData[measureName]); 
        obj.displayValue = "" + formattedValue;
        if(this._bShowUOM && UOM) {
        	obj.displayValue += " " + rawComparisionData[UOM];
        }
        obj.color = measures[i].color;
        processedData.push(obj);
	}
	return processedData;
};
sap.suite.ui.smartbusiness.tiles.MeasureComparison.prototype.doDummyProcess = function() {
    this.jsonModel.setData(this.getDummyDataForMeasureComparisonTile());
};


