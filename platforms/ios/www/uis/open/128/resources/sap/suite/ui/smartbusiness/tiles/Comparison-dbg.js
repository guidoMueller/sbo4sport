jQuery.sap.declare("sap.suite.ui.smartbusiness.tiles.Comparison");
jQuery.sap.require("sap.suite.ui.smartbusiness.tiles.Generic");
sap.suite.ui.smartbusiness.tiles.Generic.extend("sap.suite.ui.smartbusiness.tiles.Comparison", {
    metadata : {
        properties : {
            kpiValueRequired : {
                type : "boolean",
                defaultValue : false
            },
            tileType : {
                type : "string",
                defaultValue : "CT"
            }
        }
    },
    renderer : {} //No need to write Anything
});

sap.suite.ui.smartbusiness.tiles.Comparison.prototype.init = function() {
    sap.suite.ui.smartbusiness.tiles.Generic.prototype.init.apply(this);
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
sap.suite.ui.smartbusiness.tiles.Comparison.prototype.onBeforeRendering = function() {
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

sap.suite.ui.smartbusiness.tiles.Comparison.prototype.doProcess = function() {
    var that = this;
    this._fetchDataForComparisonTile(function(kpiValue) {
        var deviationTileObj={};
        deviationTileObj.data=kpiValue.kpiData;
        if(kpiValue.unitPrefix){
            deviationTileObj.unit = kpiValue.unitPrefix;
        }
        if(true || that.isAssociatedKpi()) {
            deviationTileObj.subheader= this.evaluationApi.getTitle();
            deviationTileObj.header= this.evaluationApi.getKpiName();
        }
        that.jsonModel.setData(deviationTileObj);
        that.setDoneState();
    }, this.logError);
};

sap.suite.ui.smartbusiness.tiles.Comparison.prototype._fetchDataForComparisonTile = function(fnSuccess,fnError) {
    var _getSortByClauseObject = function(tileConfiguration) {
        var fallback = [{name:this.EVALUATION_DATA.COLUMN_NAME, order : "desc"}];
        if(tileConfiguration && tileConfiguration.SORTING) {
            var sortingObject = tileConfiguration.SORTING;
            if((sortingObject.order == 'asc' || sortingObject.order == 'desc') && (sortingObject.by == 'M' || sortingObject.by == 'D')) {
                var rSortingClauseObject = [];
                rSortingClauseObject.push({
                    name : (sortingObject.by == 'M' ? this.evaluationApi.getKpiMeasureName() :  this.getDimension()),
                    order : sortingObject.order
                });
                return rSortingClauseObject;
            }
        }
        return fallback;
    };
    var that = this;
    /* Preparing arguments for the prepareQueryServiceUri function */
    var oParam = {};
    this.oConfig=this.EVALUATION_DATA;
    oParam.serviceUri = this._addSystemAliasToUri(this.evaluationApi.getODataUrl(), this.getSapSystem());
    oParam.entitySet = this.evaluationApi.getEntitySet();
    oParam.measure = this.evaluationApi.getKpiMeasureName();
    oParam.dimension = this.getDimension();
    oParam.filter = this.getAllFilters();
    oParam.sort = _getSortByClauseObject.apply(this, [this.getTileConfiguration()]);
    oParam.dataLimit = 3;        
    that.oConfig.FINALVALUE = {};
    oParam.sortingColumn =  this.evaluationApi.getKpiMeasureName();
    var finalQuery = sap.suite.smartbusiness.odata.getUri(oParam);
    var oUnitPrefix = this.UOM_PROPERTY_MAPPING[this.evaluationApi.getKpiMeasureName()];
    var oDimensions = this.TEXT_PROPERTY_MAPPING;
    this.comparisionChartODataRef = finalQuery.model.read(finalQuery.uri, null, null, true, function(data) {
        if(data && data.results && data.results.length) {
            if(oUnitPrefix) {
                that.oConfig.FINALVALUE.unitPrefix = data.results[0][oUnitPrefix];
            }
            that.oConfig.FINALVALUE.kpiData=data;
            oParam.dimension = oDimensions[that.getDimension()];
            that.oConfig.FINALVALUE.kpiData = that._processDataForComparisonChart(that.oConfig.FINALVALUE.kpiData,oParam.measure,oParam.dimension);
            fnSuccess.call(that,that.oConfig.FINALVALUE);
        } else {
            fnError.call(that,"no Response from QueryServiceUri");
        }
    },function(eObject) {
        if(eObject && eObject.response) {
            jQuery.sap.log.error(eObject.message +" : "+eObject.request.requestUri);
        }
    });
};

sap.suite.ui.smartbusiness.tiles.Comparison.prototype._processDataForComparisonChart= function(data,measure,dimension){
    var semanticMeasure = this.oConfig.PROPERTIES.semanticMeasure;
    var finalOutput= [];
    var tempVar;
    var that = this;
    for(var i=0;i<data.results.length;i++) {
        var eachData=data.results[i];
        var temp={};
        try {
            temp.title = eachData[dimension].toString();
        } 
        catch(e){
            temp.title = "";
        };
        temp.value=Number(eachData[measure]);
        var calculatedValueForScaling = Number(eachData[measure]);
        if(this.oConfig.SCALING == -2)
            calculatedValueForScaling *= 100;
        var tempVar = sap.suite.smartbusiness.utils.getLocaleFormattedValue(calculatedValueForScaling, this.oConfig.SCALING);
        temp.displayValue = tempVar.toString();
        if(this.oConfig.SCALING == -2)
            temp.displayValue += " %";
        if(typeof semanticMeasure === 'undefined' /*Instead semanticMeasure == void (0)*/){
            temp.color= "Neutral";
        }
        else {
            if(this.evaluationApi.isMaximizingKpi()){
                if(temp.value > eachData[semanticMeasure]){
                    temp.color= "Good";
                }
                else {
                    temp.color= "Error";
                }
            }
            else if(this.evaluationApi.isMinimizingKpi()){
                if(temp.value < eachData[semanticMeasure]){
                    temp.color= "Good";
                }
                else {
                    temp.color= "Error";
                }
            }
            else {
                temp.color= "Neutral";
            }
        }
        finalOutput.push(temp);
    }
    return finalOutput;     
};
sap.suite.ui.smartbusiness.tiles.Comparison.prototype.doDummyProcess = function() {
    this.jsonModel.setData(this.getDummyDataForComparisonTile());
};


