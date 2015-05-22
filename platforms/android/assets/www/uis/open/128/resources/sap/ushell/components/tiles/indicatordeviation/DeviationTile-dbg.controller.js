(function () {  
    "use strict";
    sap.ui.controller("tiles.indicatordeviation.DeviationTile", {
        onInit : function () {
            var that = this;
            this.firstTimeVisible = false;
            this.oKpiTileView = this.getView();
            this.oViewData = this.oKpiTileView.getViewData(),
            this.oTileApi = this.oViewData.chip; // instance specific CHIP API
            if (this.oTileApi.visible) {
                this.oTileApi.visible.attachVisible(this.visibleHandler.bind(this));
            }
            this.system = this.oTileApi.url.getApplicationSystem();
            this.oKpiTileView.oGenericTile.setState(sap.suite.ui.commons.LoadState.Loading);
            try{
                sap.ushell.components.tiles.indicatorTileUtils.util.getParsedChip(
                        this.oTileApi.configuration.getParameterValueAsString("tileConfiguration"),function(config){
                            that.oConfig = config;
                            that.setTextInTile();
                            if (that.oTileApi.preview) {
                                that.oTileApi.preview.setTargetUrl(sap.ushell.components.tiles.indicatorTileUtils.util.getNavigationTarget(that.oConfig,that.system));
                            }
                            if(that.oTileApi.preview.isEnabled()){
                                that._updateTileModel({
                                    actual: { value: 120, color: sap.suite.ui.commons.InfoTileValueColor.Good},
                                    targetValue: 100,
                                    thresholds: [
                                                 { value: 0, color: sap.suite.ui.commons.InfoTileValueColor.Error },
                                                 { value: 50, color: sap.suite.ui.commons.InfoTileValueColor.Critical },
                                                 { value: 150, color: sap.suite.ui.commons.InfoTileValueColor.Critical },
                                                 { value: 200, color: sap.suite.ui.commons.InfoTileValueColor.Error }
                                                 ],
                                                 showActualValue: true,
                                                 showTargetValue: true
                                });
                                that.oKpiTileView.oGenericTile.setState(sap.suite.ui.commons.LoadState.Loaded);
                            }
                            else{
                                that.oKpiTileView.oGenericTile.attachPress(function(){
                                    sap.ushell.components.tiles.indicatorTileUtils.util.abortPendingODataCalls(that.queryServiceUriODataReadRef);
                                    sap.ushell.components.tiles.indicatorTileUtils.cache.setKpivalueById(that.oConfig.TILE_PROPERTIES.id, null);
                                    window.location.hash = sap.ushell.components.tiles.indicatorTileUtils.util.getNavigationTarget(that.oConfig,that.system);
                                });
                                if(Number(that.oTileApi.configuration.getParameterValueAsString("isSufficient"))){
                                    sap.ushell.components.tiles.indicatorTileUtils.cache.setEvaluationById(that.oConfig.TILE_PROPERTIES.id,that.oConfig);
                                    that.flowWithoutDesignTimeCall();
                                }
                                else{
                                    that.flowWithDesignTimeCall();
                                }
                            }
                        });
            }
            catch(e){
                this.logError(e);
            }
        },

        _setLocalModelToTile : function() {
            if(this.getTile().getModel()) {

            } else {
                this.getTile().setModel(new sap.ui.model.json.JSONModel({}));
            }
        },

        getTile : function() {
            return this.oKpiTileView.oGenericTile;
        },

        _updateTileModel : function(newData) {
            var modelData  = this.getTile().getModel().getData();
            jQuery.extend(modelData,newData);
            this.getTile().getModel().setData(modelData);
        },

        fetchKpiValue : function(fnSuccess, fnError) {
            var that = this;
            var kpiValue = 0;
            try {
                var sUri = this.DEFINITION_DATA.EVALUATION.ODATA_URL;
                var sEntitySet = this.DEFINITION_DATA.EVALUATION.ODATA_ENTITYSET;
                var sThresholdObject = this.setThresholdValues();
                var sMeasure = sThresholdObject.fullyFormedMeasure;
                var cachedValue = sap.ushell.components.tiles.indicatorTileUtils.cache.getKpivalueById(that.oConfig.TILE_PROPERTIES.id);
                if(!cachedValue){
                    var variantData = sap.ushell.components.tiles.indicatorTileUtils.util.prepareFilterStructure(
                            this.DEFINITION_DATA.EVALUATION_FILTERS,this.DEFINITION_DATA.ADDITIONAL_FILTERS);
                    var oQuery = sap.ushell.components.tiles.indicatorTileUtils.util.prepareQueryServiceUri(
                            that.oTileApi.url.addSystemToServiceUrl(sUri), sEntitySet, sMeasure, null, variantData);
                    if(oQuery) {
                        this.QUERY_SERVICE_MODEL = oQuery.model;
                        this.queryUriForKpiValue = oQuery.uri;
                        try {
                            this.queryServiceUriODataReadRef = this.QUERY_SERVICE_MODEL.read(oQuery.uri, null, null, true, function(data) {  
                                var writeData = {};
                                if(data && data.results && data.results.length) {
                                    kpiValue=data.results[0][that.DEFINITION_DATA.EVALUATION.COLUMN_NAME];
                                    if(oQuery.unit){
                                        that._updateTileModel({
                                            unit : data.results[0][oQuery.unit.name]
                                        });
                                        writeData.unit = oQuery.unit;
                                        writeData.unit.name = oQuery.unit.name;
                                    }
                                    writeData.data = data;
                                    sap.ushell.components.tiles.indicatorTileUtils.cache.setKpivalueById(that.oConfig.TILE_PROPERTIES.id, writeData);
                                    if(that.DEFINITION_DATA.EVALUATION.VALUES_SOURCE == "MEASURE"){
                                        sThresholdObject.criticalHighValue = data.results[0][sThresholdObject.sCriticalHigh];
                                        sThresholdObject.criticalLowValue = data.results[0][sThresholdObject.sCriticalLow] ;
                                        sThresholdObject.warningHighValue = data.results[0][sThresholdObject.sWarningHigh];
                                        sThresholdObject.warningLowValue = data.results[0][sThresholdObject.sWarningLow];
                                        sThresholdObject.targetValue = data.results[0][sThresholdObject.sTarget];
                                        sThresholdObject.trendValue = data.results[0][sThresholdObject.sTrend];
                                    }
                                    fnSuccess.call(that, kpiValue, sThresholdObject);
                                } else {
                                    fnError.call(that,"no Response from QueryServiceUri");
                                }
                            },function(eObject) {
                                if(eObject && eObject.response) {
                                    fnError.call(that,eObject.message);
                                }
                            });
                        } catch(e){
                            that.logError("Error in Query Service URI");
                        }                                      
                    }
                }
                else{
                    if(cachedValue.data && cachedValue.data.results && cachedValue.data.results.length) {
                        kpiValue=cachedValue.data.results[0][that.DEFINITION_DATA.EVALUATION.COLUMN_NAME];
                        if(cachedValue.unit){
                            that._updateTileModel({
                                unit : cachedValue.data.results[0][cachedValue.unit.name]
                            });
                        }
                        if(that.DEFINITION_DATA.EVALUATION.VALUES_SOURCE == "MEASURE"){
                            sThresholdObject.criticalHighValue = cachedValue.data.results[0][sThresholdObject.sCriticalHigh];
                            sThresholdObject.criticalLowValue = cachedValue.data.results[0][sThresholdObject.sCriticalLow] ;
                            sThresholdObject.warningHighValue = cachedValue.data.results[0][sThresholdObject.sWarningHigh];
                            sThresholdObject.warningLowValue = cachedValue.data.results[0][sThresholdObject.sWarningLow];
                            sThresholdObject.targetValue = cachedValue.data.results[0][sThresholdObject.sTarget];
                            sThresholdObject.trendValue = cachedValue.data.results[0][sThresholdObject.sTrend];
                        }
                        fnSuccess.call(that, kpiValue, sThresholdObject);
                    } else {
                        fnError.call(that,"no Response from QueryServiceUri");
                    }
                }
            }catch(e) {
                fnError.call(that,e);
            }
        },



        getThresholdsObjAndColor : function(thresholdObject) {            
            try {
                var oThresholdObjAndColor = {};
                oThresholdObjAndColor.arrObj = [];
                oThresholdObjAndColor.returnColor = sap.suite.ui.commons.InfoTileValueColor.Neutral;
                var improvementDirection = this.DEFINITION_DATA.EVALUATION.GOAL_TYPE;
                var evalValue = this.DEFINITION_DATA.EVALUATION_VALUES;
                var wL,cL,cH,wH; 
                if(improvementDirection === "MI") {
                    cH = Number(thresholdObject.criticalHighValue) || 0;
                    wH = Number(thresholdObject.warningHighValue) || 0;
                    if(cH && wH) {
                        cH = window.parseFloat(cH);
                        wH = window.parseFloat(wH);
                        oThresholdObjAndColor.arrObj.push({value:cH,color:sap.suite.ui.commons.InfoTileValueColor.Error});
                        oThresholdObjAndColor.arrObj.push({value:wH,color:sap.suite.ui.commons.InfoTileValueColor.Critical});
                        if(this.CALCULATED_KPI_VALUE < wH) {
                            oThresholdObjAndColor.returnColor = sap.suite.ui.commons.InfoTileValueColor.Good ;
                        } else if(this.CALCULATED_KPI_VALUE <= cH) {
                            oThresholdObjAndColor.returnColor = sap.suite.ui.commons.InfoTileValueColor.Critical;
                        } else {
                            oThresholdObjAndColor.returnColor = sap.suite.ui.commons.InfoTileValueColor.Error;
                        }
                    }

                } else if(improvementDirection === "MA") {
                    cL = Number(thresholdObject.criticalLowValue) || 0;
                    wL = Number(thresholdObject.warningLowValue) || 0;    
                    if(cL && wL) {
                        cL = window.parseFloat(cL);
                        wL = window.parseFloat(wL);
                        oThresholdObjAndColor.arrObj.push({value:cL,color:sap.suite.ui.commons.InfoTileValueColor.Error});
                        oThresholdObjAndColor.arrObj.push({value:wL,color:sap.suite.ui.commons.InfoTileValueColor.Critical});
                        if(this.CALCULATED_KPI_VALUE < cL) {
                            oThresholdObjAndColor.returnColor = sap.suite.ui.commons.InfoTileValueColor.Error;
                        } else if(this.CALCULATED_KPI_VALUE <= wL) {
                            oThresholdObjAndColor.returnColor = sap.suite.ui.commons.InfoTileValueColor.Critical;
                        } else {
                            oThresholdObjAndColor.returnColor = sap.suite.ui.commons.InfoTileValueColor.Good ;
                        }
                    }
                } else {
                    cH = Number(thresholdObject.criticalHighValue) || 0;
                    wH = Number(thresholdObject.warningHighValue) || 0;
                    cL = Number(thresholdObject.criticalLowValue) || 0;
                    wL = Number(thresholdObject.warningLowValue) || 0;    
                    if(wL && wH && cL && cL) {
                        cH = window.parseFloat(cH);
                        wH = window.parseFloat(wH);
                        wL = window.parseFloat(wL);
                        cL = window.parseFloat(cL);
                        oThresholdObjAndColor.arrObj.push({value:cH,color:sap.suite.ui.commons.InfoTileValueColor.Error});
                        oThresholdObjAndColor.arrObj.push({value:wH,color:sap.suite.ui.commons.InfoTileValueColor.Critical});
                        oThresholdObjAndColor.arrObj.push({value:wL,color:sap.suite.ui.commons.InfoTileValueColor.Critical});
                        oThresholdObjAndColor.arrObj.push({value:cL,color:sap.suite.ui.commons.InfoTileValueColor.Error});
                        if(this.CALCULATED_KPI_VALUE < cL || this.CALCULATED_KPI_VALUE > cH) {
                            oThresholdObjAndColor.returnColor = sap.suite.ui.commons.InfoTileValueColor.Error;
                        } else if((this.CALCULATED_KPI_VALUE >= cL && this.CALCULATED_KPI_VALUE <= wL) || 
                                (this.CALCULATED_KPI_VALUE >= wH && this.CALCULATED_KPI_VALUE <= cH)
                        ) {
                            oThresholdObjAndColor.returnColor = sap.suite.ui.commons.InfoTileValueColor.Critical;
                        } else {
                            oThresholdObjAndColor.returnColor = sap.suite.ui.commons.InfoTileValueColor.Good ;
                        }
                    }
                }
                return oThresholdObjAndColor;

            } catch(e) {
                this.logError(e);
            }

        },

        flowWithoutDesignTimeCall : function() {
            var that = this;
            var formattedValue, formattedTargetvalue;
            this.DEFINITION_DATA = this.oConfig;
            this._updateTileModel(this.DEFINITION_DATA);
            if(this.oTileApi.visible.isVisible() && !this.firstTimeVisible){

                this.firstTimeVisible = true;
                this.fetchKpiValue(function(kpiValue, thresholdObject){
                    var calculatedValueForScaling = Number(kpiValue);
                    if(this.oConfig.EVALUATION.SCALING == -2)
                        calculatedValueForScaling *= 100;
                    formattedValue = sap.ushell.components.tiles.indicatorTileUtils.util.getLocaleFormattedValue(Number(calculatedValueForScaling), this.oConfig.EVALUATION.SCALING);
                    if(this.oConfig.EVALUATION.SCALING == -2) 
                        formattedValue += " %";
                    this.CALCULATED_KPI_VALUE=Number(kpiValue);
                    var deviationTileObj={};
                    var thresholdsArrayObjAndColor = this.getThresholdsObjAndColor(thresholdObject);
                    var actualKpiObj={value:Number(kpiValue),color:thresholdsArrayObjAndColor.returnColor};

                    deviationTileObj.actualValueLabel = formattedValue.toString();
                    deviationTileObj.actual=actualKpiObj;
                    deviationTileObj.thresholds = [];
                    deviationTileObj.thresholds = thresholdsArrayObjAndColor.arrObj;
                    var evalValue = this.DEFINITION_DATA.EVALUATION_VALUES;
                    if(this.DEFINITION_DATA.EVALUATION.VALUES_SOURCE == "MEASURE"){
                        var calculatedTargetValue = Number(thresholdObject.targetValue);
                        if(this.oConfig.EVALUATION.SCALING == -2)
                            calculatedTargetValue *= 100; 
                        formattedTargetvalue = sap.ushell.components.tiles.indicatorTileUtils.util.getLocaleFormattedValue(calculatedTargetValue, this.oConfig.EVALUATION.SCALING);
                        if(this.oConfig.EVALUATION.SCALING == -2) 
                            formattedTargetvalue += "%";
                        deviationTileObj.targetValue = Number(thresholdObject.targetValue);
                        deviationTileObj.targetValueLabel = formattedTargetvalue.toString();
                    } else {
                        for(var itr = 0; itr < evalValue.length; itr++){
                            if(evalValue[itr].TYPE==="TA") {
                                var calculatedTargetValue = Number(evalValue[itr].FIXED);
                                if(this.oConfig.EVALUATION.SCALING == -2)
                                    calculatedTargetValue *= 100; 
                                formattedTargetvalue = sap.ushell.components.tiles.indicatorTileUtils.util.getLocaleFormattedValue(calculatedTargetValue);
                                if(this.oConfig.EVALUATION.SCALING == -2) 
                                    formattedTargetvalue += "%";
                                deviationTileObj.targetValue =  Number(evalValue[itr].FIXED);
                                deviationTileObj.targetValueLabel = formattedTargetvalue.toString();
                            } 
                        }  
                    } 
                    this._updateTileModel(deviationTileObj);
                    var navTarget = sap.ushell.components.tiles.indicatorTileUtils.util.getNavigationTarget(that.oConfig,that.system);
                    that.oKpiTileView.oGenericTile.$().wrap("<a href ='" + navTarget + "'/>")
                    this.oKpiTileView.oGenericTile.setState(sap.suite.ui.commons.LoadState.Loaded);
                }, this.logError);
            }
        },

        flowWithDesignTimeCall: function() {
            var that = this;    
            try{
                var evaluationData = sap.ushell.components.tiles.indicatorTileUtils.cache.getEvaluationById(this.oConfig.EVALUATION.ID)
                if(evaluationData){
                    that.oConfig.EVALUATION_FILTERS = evaluationData.EVALUATION_FILTERS;
                    that.flowWithoutDesignTimeCall();
                }
                else{
                    sap.ushell.components.tiles.indicatorTileUtils.util.getFilterFromRunTimeService(this.oConfig,function(filter){
                        that.oConfig.EVALUATION_FILTERS = filter;
                        sap.ushell.components.tiles.indicatorTileUtils.cache.setEvaluationById(that.oConfig.TILE_PROPERTIES.id,that.oConfig);
                        that.flowWithoutDesignTimeCall();
                    });
                }
            }
            catch(e){
                this.logError(e);
            }
        },

        setTextInTile : function(){
            var that =this;
            this._updateTileModel({
                header : that.oTileApi.preview.getTitle() || sap.ushell.components.tiles.indicatorTileUtils.util.getChipTitle(that.oConfig ),
                subheader : that.oTileApi.preview.getDescription() || sap.ushell.components.tiles.indicatorTileUtils.util.getChipSubTitle(that.oConfig )
            });
        },

        logError: function(err){
            this.oKpiTileView.oGenericTile.setState(sap.suite.ui.commons.LoadState.Failed);
            this.oKpiTileView.oGenericTile.setState(sap.suite.ui.commons.LoadState.Failed);
            sap.ushell.components.tiles.indicatorTileUtils.util.logError(err);
        },

        setThresholdValues : function(){
            var that = this;
            var oThresholdObject = {};
            oThresholdObject.fullyFormedMeasure = this.DEFINITION_DATA.EVALUATION.COLUMN_NAME;
            if(this.DEFINITION_DATA.EVALUATION.VALUES_SOURCE == "MEASURE"){
                switch(this.DEFINITION_DATA.EVALUATION.GOAL_TYPE){
                case "MI" :
                    oThresholdObject.sWarningHigh =  sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(that.oConfig, "WH", "MEASURE");
                    oThresholdObject.sCriticalHigh =  sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(that.oConfig, "CH", "MEASURE");
                    oThresholdObject.sTarget =  sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(that.oConfig, "TA", "MEASURE");
                    oThresholdObject.sTrend =  sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(that.oConfig, "TC", "MEASURE");
                    oThresholdObject.fullyFormedMeasure += that.formSelectStatement(oThresholdObject);
                    break;
                case "MA" :
                    oThresholdObject.sWarningLow =  sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(that.oConfig, "WL", "MEASURE");
                    oThresholdObject.sCriticalLow =  sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(that.oConfig, "CL", "MEASURE");
                    oThresholdObject.sTarget =  sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(that.oConfig, "TA", "MEASURE");
                    oThresholdObject.sTrend =  sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(that.oConfig, "TC", "MEASURE");
                    oThresholdObject.fullyFormedMeasure += that.formSelectStatement(oThresholdObject);
                    break;
                case "RA" :
                    oThresholdObject.sWarningHigh =  sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(that.oConfig, "WH", "MEASURE");
                    oThresholdObject.sCriticalHigh =  sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(that.oConfig, "CH", "MEASURE");
                    oThresholdObject.sTarget =  sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(that.oConfig, "TA", "MEASURE");
                    oThresholdObject.sTrend =  sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(that.oConfig, "TC", "MEASURE");
                    oThresholdObject.sWarningLow =  sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(that.oConfig, "WL", "MEASURE");
                    oThresholdObject.sCriticalLow =  sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(that.oConfig, "CL", "MEASURE");
                    oThresholdObject.fullyFormedMeasure += that.formSelectStatement(oThresholdObject);
                    break;
                }
            } else {
                oThresholdObject.criticalHighValue = sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(that.oConfig, "CH", "FIXED");
                oThresholdObject.criticalLowValue = sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(that.oConfig, "CL", "FIXED");
                oThresholdObject.warningHighValue = sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(that.oConfig, "WH", "FIXED");
                oThresholdObject.warningLowValue = sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(that.oConfig, "WL", "FIXED");
                oThresholdObject.targetValue = sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(that.oConfig, "TA", "FIXED");
                oThresholdObject.trendValue = sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(that.oConfig, "TC", "FIXED");
            }
            return oThresholdObject;
        },

        formSelectStatement : function(object) {
            var tmpArray = Object.keys(object);
            var sFormedMeasure = "";
            for(var i=0;i<tmpArray.length;i++)
                if((object[tmpArray[i]] !== undefined) && (object.fullyFormedMeasure))sFormedMeasure+=","+object[tmpArray[i]];
            return sFormedMeasure;
        },
        refreshHandler: function (oController) {
            if(!oController.firstTimeVisible){
                if(Number(this.oTileApi.configuration.getParameterValueAsString("isSufficient")))
                    oController.flowWithoutDesignTimeCall();
                else
                    oController.flowWithDesignTimeCall();
            }

        },
        visibleHandler: function (isVisible) {
            if (!isVisible) {
                this.firstTimeVisible = false;
                sap.ushell.components.tiles.indicatorTileUtils.util.abortPendingODataCalls(this.queryServiceUriODataReadRef);
            }
            if (isVisible) {
                this.refreshHandler(this);
            }
        },
        onExit : function(){
            sap.ushell.components.tiles.indicatorTileUtils.util.abortPendingODataCalls(this.queryServiceUriODataReadRef);
        }

    });
}());