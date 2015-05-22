jQuery.sap.declare("sap.suite.ui.smartbusiness.lib.DrilldownModel");
jQuery.sap.require("sap.suite.ui.smartbusiness.lib.DrilldownConfiguration");

/**
 * NamesSpace for DDA Configuration API
 */
sap.suite = sap.suite || {};
sap.suite.smartbusiness = sap.suite.smartbusiness || {};
sap.suite.smartbusiness.ddaconfig = sap.suite.smartbusiness.ddaconfig || {};

sap.suite.smartbusiness.ddaconfig.Model = function(evaluationId, viewId, i18n) {
    this.ddaConfigurator = null;
    this.viewId = viewId;
    this.selectedView = null;
    this.i18nModel=i18n;
    this.evaluationId = evaluationId;
    if(this.evaluationId) {
        this._init();
    }
};
sap.suite.smartbusiness.ddaconfig.Model._instances = {};
sap.suite.smartbusiness.ddaconfig.Model.languageTexts={
		ALL_LANGUAGES:[],
		CURRENT_LANGUAGE:[],
		isLoaded:false
};
sap.suite.smartbusiness.ddaconfig.Model.getInstance = function(evaluationId, bForce, i18n) {
    function getInstance(eId) {
        var modelInstance = new sap.suite.smartbusiness.ddaconfig.Model(eId,null,i18n);
        sap.suite.smartbusiness.ddaconfig.Model._instances[eId] = modelInstance;
        return sap.suite.smartbusiness.ddaconfig.Model._instances[eId];
    }
    if(bForce) {
        return getInstance(evaluationId,null,i18n);
    }
    if(sap.suite.smartbusiness.ddaconfig.Model._instances[evaluationId]) {
        return sap.suite.smartbusiness.ddaconfig.Model._instances[evaluationId];  
    } else {
        return getInstance(evaluationId,null,i18n);
    }
};
sap.suite.smartbusiness.ddaconfig.Model.prototype = {
    _init : function(evaluationId) {
        this.ddaConfigurator = new sap.suite.smartbusiness.ddaconfig.Configuration(this.evaluationId);
        this.EVALUATION_DATA = sap.suite.smartbusiness.kpi.getEvaluationById({
           id : this.evaluationId,
           cache : true,
           filters:true,
           thresholds:true
        });
        this._setModel();
    },
    NEW_VIEWID:"~NA~",
    _setModel : function() {
    	this._oModel=new sap.ui.model.json.JSONModel(this.getModelDataForDDAConfiguration());
    	try{
    		this._oModel.setSizeLimit(9999);
    	}catch(e){	
    	}
    },
    removeAllViews:function(){
    	this.getConfigurator().removeAllViews();
    	this._oModel.setData(this.getModelDataForDDAConfiguration());
    },
    bindModel:function(oControl,sName){
    	if(sName){
    		oControl.setModel(this._oModel,sName);
    	}else{
    		oControl.setModel(this._oModel);
    	}
    	this._oModel.refresh();
    },
    getConfigurator : function() {
        return this.ddaConfigurator;
    },
    setEvaluationId : function(evaluationId) {
        this.evaluationId = evaluationId;
        this._init()
    },
    setViewId : function(viewId) {
        this.viewId = viewId;
        this.selectedView = this.ddaConfigurator.findViewById(this.viewId);
        this._setModel();
    },
    fetchLanguageData:function(sName,fnS){
    	if(sap.suite.smartbusiness.ddaconfig.Model.languageTexts.isLoaded){
    		fnS({
    			ALL_LANGUAGES:sap.suite.smartbusiness.ddaconfig.Model.languageTexts.ALL_LANGUAGES,
    			CURRENT_LANGUAGE:sap.suite.smartbusiness.ddaconfig.Model.languageTexts.CURRENT_LANGUAGE
    		});
    	}else{
    		var locale_language = sap.ui.getCore().getConfiguration().getLocale().getLanguage().toUpperCase();
    		new sap.ui.model.odata.ODataModel("/sap/hba/r/sb/core/odata/modeler/SMART_BUSINESS.xsodata", true)
    								.read("/LANGUAGE?$select=SPRAS,LAISO", null, null, true, 
    										function(data) {
    										sap.suite.smartbusiness.ddaconfig.Model.languageTexts.isLoaded=true;
    										var lang={ALL_LANGUAGES:[],CURRENT_LANGUAGE:[]};
    											for(var i = 0; i < data.results.length; ++i) {
    												if(data.results[i]["LAISO"] == locale_language) {
    													lang["CURRENT_LANGUAGE"] = data.results[i]["SPRAS"];
    													//remove current language from the list of addnl languages
    													data.results.splice(i, 1);
    													break;
    												}
    											}
    										lang["ALL_LANGUAGES"] = data.results;
    							    		sap.suite.smartbusiness.ddaconfig.Model.languageTexts.ALL_LANGUAGES=lang["ALL_LANGUAGES"];
    							    		sap.suite.smartbusiness.ddaconfig.Model.languageTexts.CURRENT_LANGUAGE=lang["CURRENT_LANGUAGE"];
    										fnS(lang);
    											
    										});
    	
    	}
    },
    _getEvalData:function(sId){
		try{
    		var evalData=sap.suite.smartbusiness.kpi.getEvaluationById({
 	           id : sId, cache : true, filters:false, thresholds:false, getDDAEvaluation:true
 	        });
    		return evalData;
		}catch(e){
			return {};
		}
    },
    getDefaultModelData:function(){
    	var that=this;
    	try{
    		var dimensions=sap.suite.smartbusiness.odata.getAllDimensions(this.EVALUATION_DATA.ODATA_URL,this.EVALUATION_DATA.ODATA_ENTITYSET);
    		var measures=sap.suite.smartbusiness.odata.getAllMeasures(this.EVALUATION_DATA.ODATA_URL,this.EVALUATION_DATA.ODATA_ENTITYSET);
            var mProperties = sap.suite.smartbusiness.odata.properties(this.EVALUATION_DATA.ODATA_URL,this.EVALUATION_DATA.ODATA_ENTITYSET);
            var COLUMN_LABEL_MAPPING = mProperties.getLabelMappingObject();
    	}catch(e){
    		var dimensions=[];
    		var measures=[];
    	}
    	function _getEvaluationTitle(sId){
    		return that._getEvalData(sId).INDICATOR_TITLE;
    	}
    	function _getEvaluationSubTitle(sId){
    		return that._getEvalData(sId).TITLE;
    	}
    	function _getEvaluationIndicator(sId){
    		return that._getEvalData(sId).INDICATOR;
    	}
    	function getMeasureWithLabels(){
    		
    		var msrLabel=[];
    		for(var i=0;i<measures.length;i++){
    			msrLabel.push({
    				NAME:measures[i],
    				LABEL:COLUMN_LABEL_MAPPING[measures[i]]
    			})
    			
    		}
    		//msrLabel.unshift(this.i18nModel.getProperty("SELECT_NONE"));
    		return msrLabel;
    		
    	}
        var modelData =  {
        		CONFIG:{
        			SAP_AGGREGATE_VALUE:true
        		},
            	ID_EDITABLE:true,
            	INDICATOR:this.EVALUATION_DATA.INDICATOR,
            	ID : "",
            	TITLE : "",
            	EVALUATION_TITLE:this.EVALUATION_DATA.TITLE,
                QUERY_SERVICE_URI : this.EVALUATION_DATA.ODATA_URL,
                QUERY_ENTITY_SET : this.EVALUATION_DATA.ODATA_ENTITYSET,
            	TEXT:"", 
            	MAIN_MEASURE:"",
            	THRESHOLD_MEASURE:"",
                ALL_DIMENSIONS:dimensions,
                ALL_MEASURES:measures,
                ALL_MEASURES_LABELS:getMeasureWithLabels(),
                VALUE_TYPES : [
                       {key : "ABSOLUTE", text : this.i18nModel.getProperty("ABSOLUTE_VALUES")},           
                       {key : "PERCENTAGE", text : this.i18nModel.getProperty("PERCENTAGE_VALUES")}           
                ],
                AXIS_TYPES : [
                       {key : "SINGLE", text : this.i18nModel.getProperty("SINGLE_AXIS")},           
                       {key : "DUAL", text : this.i18nModel.getProperty("DUAL_AXIS")}           
                ],
                AXIS_TYPE : "SINGLE",
                VALUE_TYPE : "ABSOLUTE",
                CHART_TYPE: "Column",
                CHART_TYPES : [
                                   {key : "Bar", text : this.i18nModel.getProperty("BARS")},
                                   {key : "Column", text :this.i18nModel.getProperty("COLUMNS")},
                                   {key : "Line", text : this.i18nModel.getProperty("LINES")},
                                   {key : "Combination", text : this.i18nModel.getProperty("COLUMNS_AND_LINES")},
                                   {key : "Bubble", text : this.i18nModel.getProperty("BUBBLES")},
                                   {key : "Table", text : this.i18nModel.getProperty("TABLE")}
                               ],
                DATA_MODES :[
                             {key : "DUMMY", text : this.i18nModel.getProperty("DUMMY_DATA")},
                             {key : "RUNTIME", text : this.i18nModel.getProperty("ACTUAL_BACKEND_DATA")}
                             
                ],
                DATA_MODE:"DUMMY",
                DATA_LIMIT :  200,
                DATA_LIMITATIONS :false,
                COLOR_SCHEME : "NONE",
                COLOR_SCHEMES : [
                                 
                                 {key : "AUTO_SEMANTIC", text :this.i18nModel.getProperty("AUTO_SEMANTIC_COLORS")},
                                 {key : "MANUAL_SEMANTIC", text : this.i18nModel.getProperty("MANUAL_SEMANTIC_COLORS")},
                                 {key : "MANUAL_NON_SEMANTIC", text : this.i18nModel.getProperty("MANUAL_COLORS")},
                                 {key : "NONE", text : this.i18nModel.getProperty("DEFAULT_COLORS")}
                    ],
            	"MANUAL_NON_SEMANTIC":	[ 	
    			                  	  	{color:sap.ca.ui.charts.ChartColor.sapUiChart1,index:0},
    			                  	  	{color:sap.ca.ui.charts.ChartColor.sapUiChart2,index:1},
    			                  	  	{color:sap.ca.ui.charts.ChartColor.sapUiChart3,index:2},
    			                  	  	{color:sap.ca.ui.charts.ChartColor.sapUiChart4,index:3},
    			                  	  	{color:sap.ca.ui.charts.ChartColor.sapUiChart5,index:4},
    			                  	  	{color:sap.ca.ui.charts.ChartColor.sapUiChart6,index:5},
    			                  	  	{color:sap.ca.ui.charts.ChartColor.sapUiChart7,index:6},
    			                  	  	{color:sap.ca.ui.charts.ChartColor.sapUiChart8,index:7},
    			                  	  	{color:sap.ca.ui.charts.ChartColor.sapUiChart9,index:8},
    			                  	  	{color:sap.ca.ui.charts.ChartColor.sapUiChart10,index:9},
    			                  	  	{color:sap.ca.ui.charts.ChartColor.sapUiChart11,index:10}
    			                  	 ],
              	"MANUAL_SEMANTIC": [	 
              	                  	 {color:"sapCaUiChartSemanticColor-Neutral-Dark",index:0},
              	                  	 {color:"sapCaUiChartSemanticColor-Neutral",index:1},
              	                  	 {color:"sapCaUiChartSemanticColor-Neutral-Light",index:2},
              	                  	 {color:"sapCaUiChartSemanticColor-Good-Dark",index:3},
              	                  	 {color:"sapCaUiChartSemanticColor-Good",index:4},
              	                  	 {color:"sapCaUiChartSemanticColor-Good-Light",index:5},
              	                  	 {color:"sapCaUiChartSemanticColor-Critical-Dark" ,index:6},
              	                  	 {color:"sapCaUiChartSemanticColor-Critical",index:7},
              	                  	 {color:"sapCaUiChartSemanticColor-Critical-Light",index:8},
              	                  	 {color:"sapCaUiChartSemanticColor-Bad-Dark",index:9},
              	                  	 {color:"sapCaUiChartSemanticColor-Bad",index:10},
              	                  	 {color:"sapCaUiChartSemanticColor-Bad-Light",index:11}
              	                  ],
                COLUMNS : [

                ],
                SIBLING_EVALUATIONS:[
                 ],
                ASSOCIATED_EVALUATIONS:[
                ],
                ADDITIONAL_LANGUAGE_TITLES: [],
                FILTERS : [],
                HEADER_EVALUATIONID:{},
                HEADERS_VISIBLE:[
                                 /*
                                 {
                                     EVALUATION_ID : this.evaluationId,
                                     CONFIGURATION_ID : this.NEW_VIEWID,
                                     REFERENCE_EVALUATION_ID : this.evaluationId,
                                     VISUALIZATION_TYPE : 'NT',
                                     VISUALIZATION_ORDER : 1,
                                     DIMENSION : dimensions[0],
                                     SORT_BY:"",
                                     SORT_ORDER:"MD",
                                     ALL_MEASURES:measures,
                                     VISIBILITY : 1,
                                     ALL_DIMENSIONS:dimensions,
                                     visible : true,
                                     TITLE : _getEvaluationTitle(this.evaluationId),
                                     SUBTITLE : _getEvaluationSubTitle(this.evaluationId),
                                     INDICATOR:_getEvaluationIndicator(this.evaluationId)
                                 }*/
                                 ],
                HEADERS : [
                           {
                               EVALUATION_ID : this.evaluationId,
                               CONFIGURATION_ID : this.NEW_VIEWID,
                               REFERENCE_EVALUATION_ID : this.evaluationId,
                               VISUALIZATION_TYPE : 'NT',
                               VISUALIZATION_TYPE_INDEX:0,
                               VISUALIZATION_ORDER : 1,
                               DIMENSION : dimensions[0],
                               SORT_BY:"",
                               SORT_ORDER:"MD",
                               ALL_MEASURES:measures,
                               VISIBILITY : 1,
                               ALL_DIMENSIONS:dimensions,
                               visible : true,
                               TITLE : _getEvaluationTitle(this.evaluationId),
                               SUBTITLE : _getEvaluationSubTitle(this.evaluationId),
                               GROUPING_TITLE:"",
                               INDICATOR:_getEvaluationIndicator(this.evaluationId)
                           },
                           {
                               EVALUATION_ID : this.evaluationId,
                               CONFIGURATION_ID : this.NEW_VIEWID,
                               REFERENCE_EVALUATION_ID : this.evaluationId,
                               VISUALIZATION_TYPE : 'AT',
                               VISUALIZATION_TYPE_INDEX:1,
                               VISUALIZATION_ORDER : 1,
                               DIMENSION :  dimensions[0],
                               SORT_BY:"",
                               SORT_ORDER:"MD",
                               ALL_MEASURES:measures,
                               ALL_DIMENSIONS:dimensions,
                               VISIBILITY : 1,
                               visible : false,
                               TITLE : _getEvaluationTitle(this.evaluationId),
                               SUBTITLE : _getEvaluationSubTitle(this.evaluationId),
                               GROUPING_TITLE:"",
                               INDICATOR:_getEvaluationIndicator(this.evaluationId)
                           },
                           {
                               EVALUATION_ID : this.evaluationId,
                               CONFIGURATION_ID : this.NEW_VIEWID,
                               REFERENCE_EVALUATION_ID : this.evaluationId,
                               VISUALIZATION_TYPE : 'CT',
                               VISUALIZATION_TYPE_INDEX:2,
                               VISUALIZATION_ORDER : 1,
                               DIMENSION :  dimensions[0],
                               SORT_BY:"",
                               SORT_ORDER:"MD",
                               ALL_MEASURES:measures,
                               ALL_DIMENSIONS:dimensions,
                               VISIBILITY : 1,
                               visible : false,
                               TITLE : _getEvaluationTitle(this.evaluationId),
                               SUBTITLE : _getEvaluationSubTitle(this.evaluationId),
                               GROUPING_TITLE:"",
                               INDICATOR:_getEvaluationIndicator(this.evaluationId)
                           },
                           {
                               EVALUATION_ID : this.evaluationId,
                               CONFIGURATION_ID : this.NEW_VIEWID,
                               REFERENCE_EVALUATION_ID : this.evaluationId,
                               VISUALIZATION_TYPE : 'TT',
                               VISUALIZATION_TYPE_INDEX:3,
                               VISUALIZATION_ORDER : 1,
                               DIMENSION :  dimensions[0],
                               SORT_BY:"",
                               SORT_ORDER:"MD",
                               ALL_MEASURES:measures,
                               ALL_DIMENSIONS:dimensions,
                               VISIBILITY : 1,
                               visible : false,
                               TITLE : _getEvaluationTitle(this.evaluationId),
                               SUBTITLE : _getEvaluationSubTitle(this.evaluationId),
                               GROUPING_TITLE:"",
                               INDICATOR:_getEvaluationIndicator(this.evaluationId)
                           },
                           {
                               EVALUATION_ID : this.evaluationId,
                               CONFIGURATION_ID : this.NEW_VIEWID,
                               REFERENCE_EVALUATION_ID : this.evaluationId,
                               VISUALIZATION_TYPE : 'CM',
                               VISUALIZATION_TYPE_INDEX:4,
                               VISUALIZATION_ORDER : 1,
                               DIMENSION :  dimensions[0],
                               SORT_BY:"",
                               SORT_ORDER:"MD",
                               MEASURE1:measures[0],
                               MEASURE2:measures[1]||measures[0],
                               MEASURE3:"",
                               COLOR1:"Good",
                               COLOR2:"Critical",
                               COLOR3:"Error",
                               ALL_MEASURES:measures,
                               ALL_DIMENSIONS:dimensions,
                               VISIBILITY : 1,
                               visible : false,
                               TITLE : _getEvaluationTitle(this.evaluationId),
                               SUBTITLE : _getEvaluationSubTitle(this.evaluationId),
                               GROUPING_TITLE:_getEvaluationTitle(this.evaluationId)+" "+_getEvaluationSubTitle(this.evaluationId),
                               INDICATOR:_getEvaluationIndicator(this.evaluationId)
                           }
                           
                ],
                SELECTED_VIEW : "",
                ALL_VIEWS : this.ddaConfigurator.getAllViews(),
                ALL_LANGUAGES: [],
                CURRENT_LANGUAGE: "E"
            };
            modelData.HEADER_EVALUATIONID[this.evaluationId]=true;
            //modelData.TITLE=this.EVALUATION_DATA.TITLE;
            this.fetchLanguageData("SB_DDACONFIG_LANG",function(o){
            	modelData.ALL_LANGUAGES=o.ALL_LANGUAGES;
            	modelData.CURRENT_LANGUAGE=o.CURRENT_LANGUAGE;
            });
            return modelData;
    },
    getModelDataForDDAConfiguration : function() {
    	var that=this;
        var tileTypes=["NT","AT","CT","TT","CM"];
    	function getDataLimit(n){
    		return (n==-1 || !n)?200:n;
    	}
    	function _getAllDimensionsForEval(sId){
    		try{
        		var evalData=sap.suite.smartbusiness.kpi.getEvaluationById({
     	           id : sId,cache : true, filters:true,thresholds:true
     	        });
        		return sap.suite.smartbusiness.odata.getAllDimensions(evalData.ODATA_URL,evalData.ODATA_ENTITYSET);
    		}catch(e){
    			return [];
    		}
    	}
    	function _getAllMeasuresForEval(sId){
    		try{
        		var evalData=sap.suite.smartbusiness.kpi.getEvaluationById({
     	           id : sId,cache : true, filters:true,thresholds:true
     	        });
        		return sap.suite.smartbusiness.odata.getAllMeasures(evalData.ODATA_URL,evalData.ODATA_ENTITYSET);
    		}catch(e){
    			return [];
    		}
    	}
    	var measures=sap.suite.smartbusiness.odata.getAllMeasures(this.EVALUATION_DATA.ODATA_URL,this.EVALUATION_DATA.ODATA_ENTITYSET);
    	function _getEvaluationTitle(sId){
    		var evaluationData = that._getEvalData(sId);
    		return (evaluationData && evaluationData.INDICATOR_TITLE) ? evaluationData.INDICATOR_TITLE : "";
    	}
    	function _getEvaluationSubTitle(sId){
    		var evaluationData = that._getEvalData(sId);
    		return (evaluationData && evaluationData.TITLE) ? evaluationData.TITLE : "";
    	}
    	function _getEvaluationIndicator(sId){
    		var evaluationData = that._getEvalData(sId);
    		return (evaluationData && evaluationData.INDICATOR) ? evaluationData.INDICATOR : "";
    	}
    	var modelData=this.getDefaultModelData();
        if(this.selectedView) {
            /**
             * Filling ALL Views Array
             */
        		var that=this;
            modelData.ALL_VIEWS = this.ddaConfigurator.getAllViews();
            modelData.SELECTED_VIEW = this.selectedView.getId();
            modelData.ID = this.selectedView.getId();
            modelData.TITLE = this.selectedView.getTitle();
            modelData.ADDITIONAL_LANGUAGE_TITLES = this.selectedView.getAdditionalLanguageTitles();
            modelData.ID_EDITABLE = false;
            var chartConfiguration=this.selectedView.getChartConfiguration()[0];
            modelData.THRESHOLD_MEASURE = chartConfiguration?chartConfiguration.getThresholdMeasure():"";
            modelData.AXIS_TYPE = chartConfiguration?chartConfiguration.getAxisType():"SINGLE";
            modelData.VALUE_TYPE = chartConfiguration?chartConfiguration.getValueType():"ABSOLUTE";
            modelData.CHART_TYPE = chartConfiguration?chartConfiguration.getChartType().getText():"Bar";
            modelData.DATA_LIMIT = chartConfiguration?getDataLimit(chartConfiguration.getDataLimit()):200;
            modelData.DATA_LIMITATIONS=this.getDataLimitations();
            modelData.CONFIG.SAP_AGGREGATE_VALUE=this.selectedView.isAggregateValueEnabled();
            modelData.COLOR_SCHEME = chartConfiguration?chartConfiguration.getColorScheme().getText():"AUTO_SEMANTIC";
            if(this.selectedView.getHeaders().length){
            	var headers = this.selectedView.getHeaders();
            	modelData.HEADERS = [];
            	modelData.HEADERS_VISIBLE=[];
            	var headerTileRegister={};
                modelData.HEADER_EVALUATIONID={};
                headers.forEach(function(oHeader) {
                	modelData.HEADER_EVALUATIONID[oHeader.getReferenceEvaluationId()]=true;
                	headerTileRegister[oHeader.getReferenceEvaluationId()]=headerTileRegister[oHeader.getReferenceEvaluationId()]||{};
                    var measures=_getAllMeasuresForEval(oHeader.getReferenceEvaluationId());
                    var dimensions=_getAllDimensionsForEval(oHeader.getReferenceEvaluationId());
                    var headerConfig=oHeader.getConfiguration();
                	modelData.HEADERS_VISIBLE.push({
                        EVALUATION_ID : that.evaluationId,
                        CONFIGURATION_ID : modelData.SELECTED_VIEW,
                        REFERENCE_EVALUATION_ID : oHeader.getReferenceEvaluationId(),
                        VISUALIZATION_TYPE : oHeader.getVisualizationType(),
                        VISUALIZATION_ORDER : oHeader.getVisualizationOrder(),
                        DIMENSION : oHeader.getDimension()||dimensions[0],
                        SORT_BY:"",
                        SORT_ORDER	:headerConfig.SORTING.by+(headerConfig.SORTING.order=="desc"?+"D":"A"),
                        MEASURE1	:headerConfig.MEASURES[0].name||measures[0],
                        MEASURE2	:headerConfig.MEASURES[1].name||measures[1]||measures[0],
                        MEASURE3	:headerConfig.MEASURES[2]?headerConfig.MEASURES[2].name:"",
                        COLOR1:headerConfig.MEASURES[0].color||"Neutral",
                        COLOR2:headerConfig.MEASURES[1].color||"Neutral",
                        COLOR3:headerConfig.MEASURES[2]?headerConfig.MEASURES[2].color:"Neutral",
                        ALL_MEASURES:measures,
                        ALL_DIMENSIONS:dimensions,
                        VISIBILITY : oHeader.getVisibility(),
                        visible : true,
                        TITLE : _getEvaluationTitle(oHeader.getReferenceEvaluationId()),
                        SUBTITLE : _getEvaluationSubTitle(oHeader.getReferenceEvaluationId()),
                        INDICATOR:_getEvaluationIndicator(oHeader.getReferenceEvaluationId())
                    });
                	//headerTileRegister[oHeader.getReferenceEvaluationId()][oHeader.getVisualizationType()]=true;
                });
                modelData.HEADERS_VISIBLE.sort(function(a,b){
                	return a.VISUALIZATION_ORDER > b.VISUALIZATION_ORDER?1:-1;
                });
                modelData.HEADER_EVALUATIONID[this.evaluationId]=true;
                headerTileRegister[this.evaluationId]=headerTileRegister[this.evaluationId]||{};
                var that=this;
                
                for(var each in headerTileRegister){     
                	var measures=_getAllMeasuresForEval(each);
                	var dimensions=_getAllDimensionsForEval(each);
                	tileTypes.forEach(function(s){
                        modelData.HEADERS.push({
                            EVALUATION_ID : that.evaluationId,
                            CONFIGURATION_ID : modelData.SELECTED_VIEW,
                            REFERENCE_EVALUATION_ID : each,
                            VISUALIZATION_TYPE : s,
                            VISUALIZATION_TYPE_INDEX:tileTypes.indexOf(s),
                            VISUALIZATION_ORDER : 1,
                            DIMENSION : dimensions[0],
                            SORT_BY:"",
                            SORT_ORDER:"MD",
                            MEASURE1	:measures[0],
                            MEASURE2	:measures[1]||measures[0],
                            MEASURE3	:"",
                            COLOR1:"Good",
                            COLOR2:"Critical",
                            COLOR3:"Error",
                            ALL_MEASURES:measures,
                            ALL_DIMENSIONS:_getAllDimensionsForEval(each),
                            VISIBILITY : 1,
                            visible : false,
                            TITLE: _getEvaluationTitle(each),
                        	SUBTITLE: _getEvaluationSubTitle(each),
                        	GROUPING_TITLE:_getEvaluationTitle(each)+" "+_getEvaluationSubTitle(each),
                            INDICATOR:_getEvaluationIndicator(each)
                        });
                	});
                }
            }
            //modelData.HEADERS = [];
            

            var columns  = this.selectedView.getColumns();
            for(var i=0;i<columns.length;i++) {
                var column = this.selectedView.findColumnByName(columns[i]);
                modelData.COLUMNS.push({
                    NAME : column.getName(),
                    TYPE : column.getType(),
                    COLOR1 : modelData.COLOR_SCHEME=="MANUAL_NON_SEMANTIC"?column. getColor():"",
                    COLOR2 : modelData.COLOR_SCHEME=="MANUAL_SEMANTIC"?column. getColor():"",
                    AXIS : column.getAxis(),
                    SORT_ORDER : column.getSortOrder(),
                    SORT_BY : column.getSortBy(),
                    VISIBILITY : column.getVisibility(),
                    STACKING : column.getStacking()
                });
            }
            var filters = this.selectedView.getFilters();
            for(var i=0; i<filters.length;i++) {
                var filter = filters[i];
                modelData.FILTERS.push({
                    name : filter
                });
            }
        }
        return modelData;
    },

    getDataLimitations:function(){
    	var chartConfiguration=this.selectedView.getChartConfiguration()[0];
       	if(chartConfiguration && chartConfiguration.getDataLimit()!= -1){
       		return true;
       	}else if(chartConfiguration && chartConfiguration.getDataLimit()== -1){
       		return false;
       		
       	}
       }
      
};
