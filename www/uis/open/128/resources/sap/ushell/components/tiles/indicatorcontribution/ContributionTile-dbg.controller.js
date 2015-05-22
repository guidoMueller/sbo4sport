sap.ui.controller("tiles.indicatorcontribution.ContributionTile", {

    onInit:function(){

        var that = this;
        this.firstTimeVisible = false;
        this.oContributionTileView = this.getView();
        this.oChip = this.oContributionTileView.getViewData().chip;
        if (this.oChip.visible) {
            this.oChip.visible.attachVisible(this.visibleHandler.bind(this));
        }
        this.system = this.oChip.url.getApplicationSystem();
        this.oContributionTileView.oGenericTile.setState(sap.suite.ui.commons.LoadState.Loading);
        try{
            sap.ushell.components.tiles.indicatorTileUtils.util.getParsedChip(
                    this.oChip.configuration.getParameterValueAsString("tileConfiguration"), function(config){
                        that.oConfig = config;
                        if (that.oChip.preview) {
                            that.oChip.preview.setTargetUrl(sap.ushell.components.tiles.indicatorTileUtils.util.getNavigationTarget(that.oConfig,that.system));
                        }
                        if(that.oChip.preview.isEnabled()){
                            that.setTitle();
                            that._updateTileModel({
                                value: 8888,
                                size: sap.suite.ui.commons.InfoTileSize.Auto,
                                frameType:"OneByOne",
                                state: sap.suite.ui.commons.LoadState.Loading,
                                valueColor:sap.suite.ui.commons.InfoTileValueColor.Error,
                                indicator: sap.suite.ui.commons.DeviationIndicator.None,
                                title : "US Profit Margin",
                                footer : "Current Quarter",
                                description: "Maximum deviation",
                                data: [
                                       { title: "Americas", value: 10, color: "Neutral" },
                                       { title: "EMEA", value: 50, color: "Neutral" },
                                       { title: "APAC", value: -20, color: "Neutral" }
                                       ],
                            });
                            that.oContributionTileView.oGenericTile.setState(sap.suite.ui.commons.LoadState.Loaded);
                        }
                        else {
                            that.oConfig.TILE_PROPERTIES.FINALVALUE;
                            that.setTitle();
                            that.oContributionTileView.oGenericTile.attachPress(function(){
                                sap.ushell.components.tiles.indicatorTileUtils.util.abortPendingODataCalls(that.comparisionChartODataRef);
                                sap.ushell.components.tiles.indicatorTileUtils.cache.setKpivalueById(that.oConfig.TILE_PROPERTIES.id, null);
                                window.location.hash = sap.ushell.components.tiles.indicatorTileUtils.util.getNavigationTarget(that.oConfig,that.system);
                            });
                            if(Number(that.oChip.configuration.getParameterValueAsString("isSufficient"))){
                                sap.ushell.components.tiles.indicatorTileUtils.cache.setEvaluationById(that.oConfig.TILE_PROPERTIES.id,that.oConfig);
                                that.flowWithoutDesignTimeCall();
                            }
                            else{
                                that.flowWithDesignTimeCall();
                            }
                        }
                    }
            );            
        }
        catch(e){
            this.logError(e);
        }
    },   

    getTile : function() {
        return this.oContributionTileView.oGenericTile;
    },

    setTitle : function(){         
        var that =this;
        this._updateTileModel({
            header : that.oChip.preview.getTitle() || sap.ushell.components.tiles.indicatorTileUtils.util.getChipTitle(that.oConfig ),
            subheader : that.oChip.preview.getDescription() || sap.ushell.components.tiles.indicatorTileUtils.util.getChipSubTitle(that.oConfig )
        });
    },

    _updateTileModel : function(newData) {
        var modelData  = this.getTile().getModel().getData();
        jQuery.extend(modelData,newData);
        this.getTile().getModel().setData(modelData);
    },

    flowWithoutDesignTimeCall: function(){
        var that = this;
        this.DEFINITION_DATA = this.oConfig;
        this._updateTileModel(this.DEFINITION_DATA);
        if(this.oChip.visible.isVisible() && !this.firstTimeVisible){
            this.firstTimeVisible = true;
            this.fetchKpiValue(function(kpiValue){
                this.CALCULATED_KPI_VALUE=kpiValue;
                if(that.oConfig.TILE_PROPERTIES.frameType == "TwoByOne"){
                    that.oContributionTileView.oGenericTile.setFrameType("TwoByOne");
                    that.oContributionTileView.oGenericTile.removeAllTileContent();
                    that.oContributionTileView.oGenericTile.addTileContent(that.oContributionTileView.oNumericTile);
                    that.oContributionTileView.oGenericTile.addTileContent(that.oContributionTileView.oComparisonTile);
                }
                else {
                    that.oContributionTileView.oGenericTile.setFrameType("OneByOne");
                    that.oContributionTileView.oGenericTile.removeAllTileContent();
                    that.oContributionTileView.oGenericTile.addTileContent(that.oContributionTileView.oComparisonTile);
                }
                this._updateTileModel({
                    data : this.CALCULATED_KPI_VALUE
                });
                var navTarget = sap.ushell.components.tiles.indicatorTileUtils.util.getNavigationTarget(that.oConfig,that.system);
                that.oContributionTileView.oGenericTile.$().wrap("<a href ='" + navTarget + "'/>")
                this.oContributionTileView.oGenericTile.setState(sap.suite.ui.commons.LoadState.Loaded);
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

    fetchKpiValue: function(fnSuccess, fnError){

        var that = this;

        try {
            /* Preparing arguments for the prepareQueryServiceUri function */
            var sUri= this.oConfig.EVALUATION.ODATA_URL;
            var entitySet= this.oConfig.EVALUATION.ODATA_ENTITYSET;
            if(this.oConfig.TILE_PROPERTIES.semanticMeasure){
                /* 
                 * Semantic Measure Inclusion (for Future use)
                 * var measure = [];
                 * measure.push(this.oConfig.EVALUATION.COLUMN_NAME);
                 * measure.push(this.oConfig.TILE_PROPERTIES.semanticMeasure);
                 * */             
                var measure=this.oConfig.EVALUATION.COLUMN_NAME+","+this.oConfig.TILE_PROPERTIES.semanticMeasure;
            }
            else {
                var measure= this.oConfig.EVALUATION.COLUMN_NAME;
            }
            var dimension = this.oConfig.TILE_PROPERTIES.dimension;
            var data= this.oConfig.EVALUATION_VALUES;
            var cachedValue = sap.ushell.components.tiles.indicatorTileUtils.cache.getKpivalueById(that.oConfig.TILE_PROPERTIES.id);
            if(!cachedValue){
                var variants = sap.ushell.components.tiles.indicatorTileUtils.util.prepareFilterStructure(this.oConfig.EVALUATION_FILTERS,this.oConfig.ADDITIONAL_FILTERS);
                var orderByObject = {};
                orderByObject["0"] = measure+",asc";
                orderByObject["1"] = measure+",desc";
                orderByObject["2"] = dimension+",asc";
                orderByObject["3"] = dimension+",desc";
                var orderByElement = orderByObject[this.oConfig.TILE_PROPERTIES.sortOrder||"0"].split(",");
                var finalQuery = sap.ushell.components.tiles.indicatorTileUtils.util.prepareQueryServiceUri(that.oChip.url.addSystemToServiceUrl(sUri), entitySet, measure, dimension, variants, 3);        
                if(this.oConfig.TILE_PROPERTIES.semanticMeasure)
                    finalQuery.uri += "&$top=3&$orderby="+orderByElement[0]+" "+orderByElement[2];
                else
                    finalQuery.uri += "&$top=3&$orderby="+orderByElement[0]+" "+orderByElement[1];             

                this.comparisionChartODataRef = finalQuery.model.read(finalQuery.uri, null, null, false, function(data) {
                    var writeData = {};
                    if(finalQuery.unit){
                        that._updateTileModel({
                            unit : data.results[0][finalQuery.unit.name]
                        });
                        writeData.unit = finalQuery.unit;
                        writeData.unit.name = finalQuery.unit.name;
                    }
                    if(data && data.results && data.results.length) {
                        dimension = sap.ushell.components.tiles.indicatorTileUtils.util.findTextPropertyForDimension(that.oChip.url.addSystemToServiceUrl(sUri), entitySet, dimension);
                        writeData.dimension = dimension;                        
                        that.oConfig.TILE_PROPERTIES.FINALVALUE = data;
                        that.oConfig.TILE_PROPERTIES.FINALVALUE = that._processDataForComparisonChart(that.oConfig.TILE_PROPERTIES.FINALVALUE,measure.split(",")[0],dimension);
                        writeData.data = data;
                        sap.ushell.components.tiles.indicatorTileUtils.cache.setKpivalueById(that.oConfig.TILE_PROPERTIES.id, writeData);
                        fnSuccess.call(that,that.oConfig.TILE_PROPERTIES.FINALVALUE);
                    } 
                    else if(data.results.length == 0){
                        that.oConfig.TILE_PROPERTIES.FINALVALUE = data;
                        writeData.data = data;
                        sap.ushell.components.tiles.indicatorTileUtils.cache.setKpivalueById(that.oConfig.TILE_PROPERTIES.id, writeData);
                        fnSuccess.call(that,that.oConfig.TILE_PROPERTIES.FINALVALUE);
                    }
                    else {
                        fnError.call(that,"no Response from QueryServiceUri");
                    }
                },function(eObject) {
                    if(eObject && eObject.response) {
                        jQuery.sap.log.error(eObject.message +" : "+eObject.request.requestUri);
                        fnError.call(that,eObject);
                    }
                });
            }
            else{
                if(cachedValue.unit){
                    that._updateTileModel({
                        unit : cachedValue.data.results[0][cachedValue.unit.name]
                    });
                }
                if(cachedValue.data && cachedValue.data.results && cachedValue.data.results.length) {
                    dimension = cachedValue.dimension;
                    that.oConfig.TILE_PROPERTIES.FINALVALUE = cachedValue.data;
                    that.oConfig.TILE_PROPERTIES.FINALVALUE = that._processDataForComparisonChart(that.oConfig.TILE_PROPERTIES.FINALVALUE,measure.split(",")[0],dimension);
                    fnSuccess.call(that,that.oConfig.TILE_PROPERTIES.FINALVALUE);
                } 
                else if(data.results.length == 0){
                    that.oConfig.TILE_PROPERTIES.FINALVALUE = cachedValue.data;
                    fnSuccess.call(that,that.oConfig.TILE_PROPERTIES.FINALVALUE);
                }
                else {
                    fnError.call(that,"no Response from QueryServiceUri");
                }
            }
        }
        catch(e){
            fnError.call(that,e);
        }
    },

    _processDataForComparisonChart: function(data,measure,dimension){
        var semanticColor = this.oConfig.TILE_PROPERTIES.semanticColorContribution;
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
            if(this.oConfig.EVALUATION.SCALING == -2)
                calculatedValueForScaling *= 100;
            tempVar = sap.ushell.components.tiles.indicatorTileUtils.util.getLocaleFormattedValue(calculatedValueForScaling,this.oConfig.EVALUATION.SCALING);
            if(this.oConfig.EVALUATION.SCALING == -2)
                tempVar += " %"
            temp.displayValue = tempVar.toString();
            if(typeof semanticColor === 'undefined'){
                temp.color= "Neutral";
            }
            else {
                temp.color= semanticColor;
             /*   if(this.oConfig.EVALUATION.GOAL_TYPE === "MA"){
                    if(temp.value > eachData[semanticMeasure]){
                        temp.color= "Good";
                    }
                    else {
                        temp.color= "Error";
                    }
                }
                else if(this.oConfig.EVALUATION.GOAL_TYPE === "MI"){
                    if(temp.value < eachData[semanticMeasure]){
                        temp.color= "Good";
                    }
                    else {
                        temp.color= "Error";
                    }
                }
                else {
                    temp.color= "Neutral";
                }*/
            }
            finalOutput.push(temp);
        }
        return finalOutput;        
    },

    logError: function(err){
        this.oContributionTileView.oGenericTile.setState(sap.suite.ui.commons.LoadState.Failed);
        this.oContributionTileView.oGenericTile.setState(sap.suite.ui.commons.LoadState.Failed);
        sap.ushell.components.tiles.indicatorTileUtils.util.logError(err);
    },
    refreshHandler: function (oController) {
        if(!oController.firstTimeVisible){
            if(Number(this.oChip.configuration.getParameterValueAsString("isSufficient")))
                oController.flowWithoutDesignTimeCall();
            else
                oController.flowWithDesignTimeCall();
        }
            
    },
    visibleHandler: function (isVisible) {
        if (!isVisible) {
            this.firstTimeVisible =  false;
            sap.ushell.components.tiles.indicatorTileUtils.util.abortPendingODataCalls(this.comparisionChartODataRef);
        }
        if (isVisible) {
            this.refreshHandler(this);
        }
    },
    onExit : function(){
        sap.ushell.components.tiles.indicatorTileUtils.util.abortPendingODataCalls(this.comparisionChartODataRef);
    }
});