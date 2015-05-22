sap.ui.controller("tiles.indicatorcomparison.ComparisonTile", {

    onInit:function(){

        var that = this;
        this.firstTimeVisible = false;
        this.oComparisonTileView = this.getView();
        this.oChip = this.oComparisonTileView.getViewData().chip;
        if (this.oChip.visible) {
            this.oChip.visible.attachVisible(this.visibleHandler.bind(this));
        }
        this.system = this.oChip.url.getApplicationSystem();
        this.oComparisonTileView.oGenericTile.setState(sap.suite.ui.commons.LoadState.Loading);
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
                                title : "Liquidity Structure",
                                footer : "Current Quarter",
                                description: "Apr 1st 2013 (B$)",
                                data: [
                                       { title: "Measure 1", value: 1.2, color: "Good" },
                                       { title: "Measure 2", value: 0.78, color: "Good" },
                                       { title: "Measure 3", value: 1.4, color: "Error" }
                                       ],
                            });
                            that.oComparisonTileView.oGenericTile.setState(sap.suite.ui.commons.LoadState.Loaded);
                        }
                        else {

                            that.oConfig.TILE_PROPERTIES.FINALVALUE;
                            that.setTitle();
                            that.oComparisonTileView.oGenericTile.attachPress(function(){
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
        return this.oComparisonTileView.oGenericTile;
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
                    that.oComparisonTileView.oGenericTile.setFrameType("TwoByOne");
                    that.oComparisonTileView.oGenericTile.removeAllTileContent();
                    that.oComparisonTileView.oGenericTile.addTileContent(that.oComparisonTileView.oNumericTile);
                    that.oComparisonTileView.oGenericTile.addTileContent(that.oComparisonTileView.oComparisonTile);
                }
                else {
                    that.oComparisonTileView.oGenericTile.setFrameType("OneByOne");
                    that.oComparisonTileView.oGenericTile.removeAllTileContent();
                    that.oComparisonTileView.oGenericTile.addTileContent(that.oComparisonTileView.oComparisonTile);
                }
                this._updateTileModel({
                    data : this.CALCULATED_KPI_VALUE
                });
                var navTarget = sap.ushell.components.tiles.indicatorTileUtils.util.getNavigationTarget(that.oConfig,that.system);
                that.oComparisonTileView.oGenericTile.$().wrap("<a href ='" + navTarget + "'/>")
                this.oComparisonTileView.oGenericTile.setState(sap.suite.ui.commons.LoadState.Loaded);
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

                var measure=this.oConfig.EVALUATION.COLUMN_NAME;
                var measures=measure;

                for(var j=0;j<this.oConfig.EVALUATION.COLUMN_NAMES.length;j++){
                    if(this.oConfig.EVALUATION.COLUMN_NAMES[j].COLUMN_NAME != this.oConfig.EVALUATION.COLUMN_NAME)
                        measures = measures + "," +this.oConfig.EVALUATION.COLUMN_NAMES[j].COLUMN_NAME ;

                }

            }

            var data= this.oConfig.EVALUATION_VALUES;
            var cachedValue = sap.ushell.components.tiles.indicatorTileUtils.cache.getKpivalueById(that.oConfig.TILE_PROPERTIES.id);
            if(!cachedValue){
                var variants = sap.ushell.components.tiles.indicatorTileUtils.util.prepareFilterStructure(this.oConfig.EVALUATION_FILTERS,this.oConfig.ADDITIONAL_FILTERS);

                var orderByObject = {};
                orderByObject["0"] = measure+",asc";
                orderByObject["1"] = measure+",desc";

                var orderByElement = orderByObject[this.oConfig.TILE_PROPERTIES.sortOrder||"0"].split(",");
                var finalQuery = sap.ushell.components.tiles.indicatorTileUtils.util.prepareQueryServiceUri(that.oChip.url.addSystemToServiceUrl(sUri), entitySet, measures,null, variants, 3);        
                if(this.oConfig.TILE_PROPERTIES.semanticMeasure)
                    finalQuery.uri += "&$top=3&$orderby="+orderByElement[0]+" "+orderByElement[2];
                else
                    finalQuery.uri += "&$top=3&$orderby="+orderByElement[0]+" "+orderByElement[1] ;


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


                        that.oConfig.TILE_PROPERTIES.FINALVALUE = data;
                        that.oConfig.TILE_PROPERTIES.FINALVALUE = that._processDataForComparisonChart(that.oConfig.TILE_PROPERTIES.FINALVALUE,measures.split(",")[0]);
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
                    //dimension = cachedValue.dimension;
                    that.oConfig.TILE_PROPERTIES.FINALVALUE = cachedValue.data;
                    that.oConfig.TILE_PROPERTIES.FINALVALUE = that._processDataForComparisonChart(that.oConfig.TILE_PROPERTIES.FINALVALUE,measures);
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

    _processDataForComparisonChart: function(data,measure){
        //var semanticMeasure = this.oConfig.TILE_PROPERTIES.semanticObject;
        var finalOutput= [], LABEL_MAPPING={}, i, tempObject, l;
        var tempVar;
        var aTitles = [];
        var that = this;

        for(i=0;i<data.results.length;i++) {
            var eachData=data.results[i];
        }
        aTitles = sap.ushell.components.tiles.indicatorTileUtils.util.getAllMeasuresWithLabelText(this.oConfig.EVALUATION.ODATA_URL, this.oConfig.EVALUATION.ODATA_ENTITYSET);
        for(i = 0 , l=aTitles.length; i< l;i++) {
            tempObject = aTitles[i];
            LABEL_MAPPING[tempObject.key] = tempObject.value;
        }

        for(i=0;i<that.oConfig.EVALUATION.COLUMN_NAMES.length; i++){
            var temp={};
            var columnObject = that.oConfig.EVALUATION.COLUMN_NAMES[i];
            temp.value=Number(eachData[columnObject.COLUMN_NAME]);
            var calculatedValueForScaling = Number(eachData[columnObject.COLUMN_NAME]);
            if(that.oConfig.EVALUATION.SCALING == -2)
                calculatedValueForScaling *= 100;
            tempVar = sap.ushell.components.tiles.indicatorTileUtils.util.getLocaleFormattedValue(calculatedValueForScaling, that.oConfig.EVALUATION.SCALING);
            if(that.oConfig.EVALUATION.SCALING == -2)
                tempVar += " %";
            temp.displayValue = tempVar.toString();

            temp.color = columnObject.semanticColor;
            temp.title = LABEL_MAPPING[columnObject.COLUMN_NAME] || columnObject.COLUMN_NAME;

            finalOutput.push(temp);

        }

        return finalOutput;
    },

    logError: function(err){
        this.oComparisonTileView.oGenericTile.setState(sap.suite.ui.commons.LoadState.Failed);
        this.oComparisonTileView.oGenericTile.setState(sap.suite.ui.commons.LoadState.Failed);
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
            this.firstTimeVisible = false;
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
