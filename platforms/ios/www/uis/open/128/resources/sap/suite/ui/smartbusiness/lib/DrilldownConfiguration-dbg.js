jQuery.sap.declare("sap.suite.ui.smartbusiness.lib.DrilldownConfiguration");

/**
 * NamesSpace for DDA Configuration API
 */
sap.suite = sap.suite || {};
sap.suite.smartbusiness = sap.suite.smartbusiness || {};
sap.suite.smartbusiness.ddaconfig = sap.suite.smartbusiness.ddaconfig || {};

/**
 * 
 * @param oHeader
 * @returns {sap.suite.smartbusiness.ddaconfig.Header}
 */
sap.suite.smartbusiness.ddaconfig.Header =  function(oHeader) {
    this.oHeader = oHeader;
};
sap.suite.smartbusiness.ddaconfig.Header.prototype = {
    getVisualizationType : function() {
        return this.oHeader.VISUALIZATION_TYPE;
    },
    getReferenceEvaluationId : function() {
        return this.oHeader.REFERENCE_EVALUATION_ID;
    },
    getConfigurationId : function() {
        return this.oHeader.CONFIGURATION_ID;
    },
    getEvaluationId : function() {
        return this.oHeader.EVALUATION_ID;
    },
    getVisualizationOrder : function() {
        return this.oHeader.VISUALIZATION_ORDER;
    },
    isVisible : function() {
        return this.oHeader.VISIBILITY == 1;
    },
    getEvaluation: function() {
    	var that = this;
    	var DATA = this.oHeader.REFERENCE_EVALUATION_INFO;
    	return {
    		getTitle : function() {
    			if(DATA && DATA.TITLE){
    				return DATA.TITLE;
    			}
    			else{
    				return "";
    			}
    		},
    		getSubtitle: function() {
    			if(DATA && DATA.INDICATOR_TITLE){
    				return DATA.INDICATOR_TITLE;
    			}
    			else{
    				return "";
    			}
    		}
    	};	
    },
    isAssociated : function() {
        if(this.getReferenceEvaluationId()) {
            if(this.getReferenceEvaluationId()!== this.getEvaluationId()) {
                return true;
            }
        }
        return false;
    },
    isDimensionRequired : function() {
        return this.getVisualizationType() == "TREND" || this.getVisualizationType() == "COMPARISION";
    },
    getDimension : function() {
        return this.oHeader.DIMENSION;
    },
    getMeasure : function() {
        return this.oHeader.MEASURE;
    },
    getVisibility : function() {
        return this.oHeader.VISIBILITY;
    },
    getConfiguration:function(){
    	var defaultMeasures=[{name:"",color:"Good"},{name:"",color:"Critical"},{name:"",color:"Error"}];
    	var defaultSorting={order : "desc",by : "M"	};
    	var data={
				MEASURES:defaultMeasures,
    			SORTING : defaultSorting
    	};
    	if(this.oHeader.CONFIGURATION){
    		try{
        		data=JSON.parse(this.oHeader.CONFIGURATION);
        		data.MEASURES=data.MEASURES?JSON.parse(data.MEASURES):defaultMeasures;
        		data.SORTING=data.SORTING?JSON.parse(data.SORTING):defaultSorting;	
    		}catch(e){};
    	}
    	return data;
    }
};

/**
 * 
 * @param oChart
 * @returns {sap.suite.smartbusiness.ddaconfig.Chart}
 */
sap.suite.smartbusiness.ddaconfig.Chart = function(oChart) {
    this.oChart = oChart;  
};
sap.suite.smartbusiness.ddaconfig.Chart.prototype = {
    getValueType : function() {
        return this.oChart.VALUE_TYPE; //Possible Values Absolute/Percentage
    },
    getAxisType : function() {
        return this.oChart.AXIS_TYPE; //Possible Values Single/Dual
    },
    getThresholdMeasure : function() {
        return this.oChart.THRESHOLD_MEASURE;
    },
    getChartType : function() {
        var _this = this;
        return  {
            isBar : function() {
                return _this.oChart.CHART_TYPE.toUpperCase() == "BAR"; 
             },
             isColumn : function() {
                 return _this.oChart.CHART_TYPE.toUpperCase() == "COLUMN"; 
             },
             isLine : function() {
                 return _this.oChart.CHART_TYPE.toUpperCase() == "LINE"; 
             },
             isCombinationChart : function() {
                 return _this.oChart.CHART_TYPE.toUpperCase() == "COMBINATION"; 
             },
             isTable : function() {
                 return _this.oChart.CHART_TYPE.toUpperCase() == "TABLE"; 
             },
             isBubble : function() {
                 return _this.oChart.CHART_TYPE.toUpperCase() == "BUBBLE"; 
             },
             getText : function() {
                 return _this.oChart.CHART_TYPE;
             }
        };
    },
    getColorScheme : function() {
        var that = this;
        return {
            getText : function() {
                return that.oChart.COLOR_SCHEME;
            },
            isManual : function() {
                return that.oChart.COLOR_SCHEME == "MANUAL_NON_SEMANTIC" || that.oChart.COLOR_SCHEME == "MANUAL_SEMANTIC";
            },
            isManualSemantic : function() {
                return that.oChart.COLOR_SCHEME == "MANUAL_SEMANTIC";
            },
            isManualNonSematic : function() {
                return that.oChart.COLOR_SCHEME == "MANUAL_NON_SEMANTIC";
            },
            isAutoSemantic : function() {
                return that.oChart.COLOR_SCHEME == 'AUTO_SEMANTIC';
            }
        };
    },
    getDataLimit : function() {
       return this.oChart.DATA_LIMIT;
    },
    isAbsoluteValue : function() {
        return this.getValueType() == "ABSOLUTE";
    },
    isPercentageValue : function() {
        return this.getValueType() == "PERCENTAGE";
    },
    isSingleAxis : function() {
        return this.getAxisType() == "SINGLE";
    },
    isDualAxis : function() {
        return this.getAxisType() == "DUAL";
    },
    isStackingEnabled : function() {
        //TODO
        return false;
    }
    
    /*Chart Types*/
};

/**
 * 
 * @returns {sap.suite.smartbusiness.ddaconfig.Column}
 */
sap.suite.smartbusiness.ddaconfig.Column = function() {
};
sap.suite.smartbusiness.ddaconfig.Column.prototype = {
    getName  : function() {
        return this.oParam.NAME;
    },
    getSortBy : function() {
        return this.oParam.SORT_BY;
    },
    getSortOrder : function() {
      return this.oParam.SORT_ORDER;  
    },
    getType : function() {
        return this.oParam.TYPE;
    },
    getVisibility : function() {
        return this.oParam.VISIBILITY;
    },
    isVisibleInChart : function() {
        return this.oParam.VISIBILITY == "BOTH" || this.oParam.VISIBILITY == "CHART";
    },
    isVisibleInTable : function() {
        return this.oParam.VISIBILITY == "BOTH" || this.oParam.VISIBILITY == "TABLE";
    },
    getColor : function() {
        return this.oParam.COLOR;
    },
    isStacked : function() {
        return this.oParam.STACKING == 1;
    },
    getStacking : function() {
      return this.oParam.STACKING;  
    },
    isDimension : function() {
        return this.getType().toUpperCase() == "DIMENSION";
    },
    isMeasure : function() {
        return this.getType().toUpperCase() == "MEASURE";
    },
    getAxis : function() {
        return this.oParam.AXIS;
    }
};

/**
 * 
 * @param oParam
 * @returns {sap.suite.smartbusiness.ddaconfig.Dimension}
 */
sap.suite.smartbusiness.ddaconfig.Dimension = function(oParam) {
    this.oParam = oParam;
};
sap.suite.smartbusiness.ddaconfig.Dimension.prototype = new sap.suite.smartbusiness.ddaconfig.Column();

/**
 * 
 * @param oParam
 * @returns {sap.suite.smartbusiness.ddaconfig.Measure}
 */
sap.suite.smartbusiness.ddaconfig.Measure = function(oParam) {
    this.oParam = oParam;
};
sap.suite.smartbusiness.ddaconfig.Measure.prototype = new sap.suite.smartbusiness.ddaconfig.Column();


/**
 * 
 * @param oParam
 * @returns {sap.suite.smartbusiness.ddaconfig.Filter}
 */
sap.suite.smartbusiness.ddaconfig.Filter = function(oParam) {
    this.oFilter = oParam;
};
sap.suite.smartbusiness.ddaconfig.Filter.prototype = {
    getName : function() {
        return this.oFilter.DIMENSION;
    },
    isVisible  : function() {
        return this.oFilter.VISIBILITY == 1;
    }
};


/**
 * 
 * @param oParam
 * @returns {sap.suite.smartbusiness.ddaconfig.View}
 */
sap.suite.smartbusiness.ddaconfig.View = function(oParam) {
    this._viewId = oParam.CONFIGURATION_ID;
    this._evaluationId = oParam.EVALUATION_ID;
    this._title  = oParam.TEXT;
    this._order = oParam.CONFIG_ORDER;
    this._columns = [];this._dimensions = []; this._measures = []; this._filters = [];
    this._dimensionMap = {}; this._measureMap = {}; this._filterMap = {};
    this._headers  = [], this._chartConfig = [];
    this._additionalLanguageTitles = [];
};
sap.suite.smartbusiness.ddaconfig.View.prototype = {
    getTitle : function() {
        return this._title;
    },
    getId : function() {
        return this._viewId;
    },
    getEvaluationId : function() {
      return this._evaluationId;  
    },
    getViewOrder : function() {
        return this._order;
    },
    getFilters : function() {
        return this._filters;
    },
    getColumns  : function() {
        return this._columns;
    },
    getDimensions : function () {
        return this._dimensions;  
    },
    getMeasures : function() {
      return this._measures;  
    },
    findDimensionByName : function (dimensionName) {
        if(this._dimensionMap[dimensionName]) {
            return this._dimensionMap[dimensionName];
        } else {
            throw new Error("Invalid Dimension Name : "+dimensionName);
        }
        
    },
    findMeasureByName : function (measureName) {
        if(this._measureMap[measureName]) {
            return this._measureMap[measureName];
        } else {
            throw new Error("Invalid Dimension Name : "+measureName);
        }
        
    },
    findColumnByName : function(columnName) {
        if(this._dimensionMap[columnName]) {
            return this._dimensionMap[columnName];
        } else if(this._measureMap[columnName]) {
            return this._measureMap[columnName];
        } else {
            throw new Error("Invalid Column Name : "+columnName);
        }
    },
    getHeaders : function() {
        return this._headers;
    },
    getChartConfiguration : function() {
        return this._chartConfig;
    },
    getAdditionalLanguageTitles: function() {
        return this._additionalLanguageTitles;
    }
};

/*
 * Static functions to read entire configuration and associate it to VIEW; 
 */
sap.suite.smartbusiness.ddaconfig.View.setDimensionAndMeasures = function(oColumns, oThis) {
    oColumns.forEach(function(oValue, index, aArray) {
        if(oValue.CONFIGURATION_ID == this.getId()) {
            this._columns.push(oValue.NAME);
            if(oValue.TYPE.toUpperCase() == "MEASURE") {
                this._measureMap[oValue.NAME] = new sap.suite.smartbusiness.ddaconfig.Measure(oValue);
                this._measures.push(oValue.NAME);
            } else if(oValue.TYPE.toUpperCase() == "DIMENSION") {
                this._dimensionMap[oValue.NAME] = new sap.suite.smartbusiness.ddaconfig.Dimension(oValue);
                this._dimensions.push(oValue.NAME);
            }
        }
    }, oThis);
};
sap.suite.smartbusiness.ddaconfig.View.setFilters = function(oFilters, oThis) {
    oFilters.forEach(function(oValue, index, aArray){
        this._filters.push(oValue.DIMENSION);
        this._filterMap[oValue.DIMENSION] = new sap.suite.smartbusiness.ddaconfig.Filter(oValue);
    
    }, oThis);
};
sap.suite.smartbusiness.ddaconfig.View.setConfig = function(oConfig, oThis) {
    var Segments = sap.suite.smartbusiness.ddaconfig.Configuration.Constants;
    for(var eachSegment in Segments) {
        var func = Segments[eachSegment].func;
        if(jQuery.sap.startsWith(func,"is")) {
            sap.suite.smartbusiness.ddaconfig.View.prototype[func] = function() {
              return true;  
            };
        } else {
            sap.suite.smartbusiness.ddaconfig.View.prototype[func] = function() {
              return null;  
            };
        }
    }
    oConfig.forEach(function(oValue, index, aArray) {
        var tempObject = Segments[oValue.PROPERTY_TYPE];
        if(tempObject) {
            var func = tempObject.func;
            if(jQuery.sap.startsWith(func,"is")) {
                sap.suite.smartbusiness.ddaconfig.View.prototype[func] = function() {
                  return oValue.VISIBILITY == 1;  
                };
            } else {
                sap.suite.smartbusiness.ddaconfig.View.prototype[func] = function() {
                  return oValue.PROPERTY_VALUE;  
                };
            }
        } else {
            jQuery.sap.log.error("Unknown Property_Name : " + oValue.PROPERTY_TYPE);
        }
    
    },oThis);
};

sap.suite.smartbusiness.ddaconfig.View.setHeader = function(oHeader, oThis) {
    if(oHeader.length) {
        oHeader.forEach(function(oValue, index, array) {
            this.getHeaders().push(new sap.suite.smartbusiness.ddaconfig.Header(oValue));
        
        }, oThis);
        oThis.getHeaders().sort(function(o1, o2) {
            if(o1.VISUALIZATION_ORDER > o2.VISUALIZTION_ORDER) {
                return 1;
            } 
            return -1;
        });
    }
};
sap.suite.smartbusiness.ddaconfig.View.setChart = function(oChart, oThis) {
    if(oChart.length) {
        oChart.forEach(function(oValue, index, array) {
            if(this.getId() == oValue.CONFIGURATION_ID) {
                this.getChartConfiguration().push(new sap.suite.smartbusiness.ddaconfig.Chart(oValue));
            }
        }, oThis);
    }
};

sap.suite.smartbusiness.ddaconfig.View.setAdditionalLanguageTitles = function(oMasterText, oThis) {
    if(oMasterText.length) {
        oMasterText.forEach(function(oValue, index, array) {
            if(this.getId() == oValue.CONFIGURATION_ID) {
                this.getAdditionalLanguageTitles().push(oValue);
            }
        }, oThis);
    }
};

/**
 * 
 * @param evaluationId
 * @returns {sap.suite.smartbusiness.ddaconfig.Configuration}
 */
sap.suite.smartbusiness.ddaconfig.Configuration = function(evaluationId, MODE) {
    this.evaluationId = evaluationId;
    var defautView = null;
    this.MODE = !!MODE;
    var viewMap = {};
    var _notConfigured = true;
    var debugMode  = jQuery.sap.getUriParameters().get("debug_ddaconfig") == "true";
    var _index = -1;
    var init = function(oMaster, oConfig, oHeader, oFilter, oColumns, oChart, oMasterText) {
        oMaster.forEach(function(v,i,a) {
            var viewId = v.CONFIGURATION_ID;
            if(viewId) {
                _index++;
                var vObject = new sap.suite.smartbusiness.ddaconfig.View(v);
                viewMap[viewId] = vObject;
                if(_index == 0) {
                    defautView = viewId;
                }
                sap.suite.smartbusiness.ddaconfig.View.setConfig(oConfig, vObject);
                sap.suite.smartbusiness.ddaconfig.View.setDimensionAndMeasures(oColumns, vObject);
                sap.suite.smartbusiness.ddaconfig.View.setFilters(oFilter, vObject);
                sap.suite.smartbusiness.ddaconfig.View.setHeader(oHeader, vObject);
                sap.suite.smartbusiness.ddaconfig.View.setChart(oChart, vObject);
                sap.suite.smartbusiness.ddaconfig.View.setAdditionalLanguageTitles(oMasterText, vObject);
                _notConfigured= false;
            }
        });
        
    };
    this.getMaxViewOrder = function() {
    	var max_order = 0;
    	for (var view in viewMap) {
    		max_order = Math.max(max_order, viewMap[view].getViewOrder());
    	}
    	return max_order;
    };
    this.hasNoConfiguration = function() {
        return _notConfigured;
    };
    this.findViewById  = function(vId) {
        if(viewMap[vId]) {
            return viewMap[vId];
        }
        return null;
    },
    this.getDefaultViewId = function() {
      return defautView;  
    },
    this.getDefaultView = function() {
      if(defautView) {
          return viewMap[defautView];
      }
      return null;
    };
    this.removeViewById=function(viewId){
        delete viewMap[viewId];
    };
    this.removeAllViews=function(viewId){
        viewMap = {};
    };
    this.getAllViews = function() {
        var views = [];
        for(var each in viewMap) {
            var tempObj = {};
            tempObj["ID"] = each;
            tempObj["TITLE"] = viewMap[each].getTitle() || "-NA- ("+each+")";
            views.push(tempObj);
        }
        return views;
    };
    this.getTree = function() {
        var tree= {name : "Evaluation", children : []};
        var allViews = this.getAllViews();
        for(var each in allViews) {
            var eachView = {
                    name : allViews[each].TITLE || "NA",
                    children : []
            };
            
            var view = this.findViewById(allViews[each].ID);

            var measures = view.getMeasures();
            var measure = {
                    name : "measures",
                    children : []
             };
            eachView.children.push(measure);
            measures.forEach(function(value, index, array) {
                measure.children.push({
                    name : value,
                    children :[]
                });
            }, this);

            
            var dimensions = view.getDimensions();
            var dimension = {
                    name : "dimensions",
                    children : []
             };
            eachView.children.push(dimension);
            dimensions.forEach(function(value, index, array) {
                dimension.children.push({
                    name : value,
                    children :[]
                });
            }, this);
            
            var headers = view.getHeaders();
            var header = {
                    name : "header",
                    children : []
            };
            eachView.children.push(header);
            headers.forEach(function(each) {
                
                var firstHeader = {
                        name : "1",
                        children : []
                };
                header.children.push(firstHeader);
                
                firstHeader.children.push({
                    name : "Visualization Type = "+each.getVisualizationType(),
                    children : []
                 });
                firstHeader.children.push({
                    name : "Reference Evaluation = "+each.getReferenceEvaluationId(),
                    children : []
                 });
            });
            tree.children.push(eachView);
        }
        return tree;
    };
    
    var _encodeUrl = function(uRi) {
        return jQuery.sap.encodeURL(uRi);
    };
    var _fetchConfiguration = function() {
        var that = this;
        var oDataModel = null;
        var serviceUri = "/sap/hba/r/sb/core/odata/modeler/SMART_BUSINESS.xsodata";
        if(sap.suite.smartbusiness.odata) {
            oDataModel = sap.suite.smartbusiness.odata.getModelByServiceUri(serviceUri);
        } else {
            oDataModel = new sap.ui.model.odata.ODataModel(serviceUri, true);
        }
        var masterUri = "/DDA_MASTER?$filter="+_encodeUrl("EVALUATION_ID eq '"+this.evaluationId+"'")+"&$orderby=CONFIG_ORDER";
        var configUri = "/DDA_CONFIG?$filter="+_encodeUrl("EVALUATION_ID eq '"+this.evaluationId+"'");
        var headerUri = "/DDA_HEADER?$expand=REFERENCE_EVALUATION_INFO&$filter="+_encodeUrl("EVALUATION_ID eq '"+this.evaluationId+"'");
        var filtersUri = "/DDA_FILTERS?$filter="+_encodeUrl("EVALUATION_ID eq '"+this.evaluationId+"'");
        var columnsUri = "/DDA_COLUMNS?$filter="+_encodeUrl("EVALUATION_ID eq '"+this.evaluationId+"'")+"&$orderby=COLUMNS_ORDER";
        var chartUri = "/DDA_CHART?$filter="+_encodeUrl("EVALUATION_ID eq '"+this.evaluationId+"'");
        var masterTextUri = "/DDA_MASTER_TEXT?$filter="+_encodeUrl("EVALUATION_ID eq '"+this.evaluationId+"'");
        var request1 = oDataModel.createBatchOperation(masterUri,"GET");
        var request2 = oDataModel.createBatchOperation(configUri,"GET");
        var request3 = oDataModel.createBatchOperation(headerUri,"GET");
        var request4 = oDataModel.createBatchOperation(filtersUri,"GET");
        var request5 = oDataModel.createBatchOperation(columnsUri,"GET");
        var request6 = oDataModel.createBatchOperation(chartUri,"GET");
        var request7 = oDataModel.createBatchOperation(masterTextUri,"GET");
        oDataModel.addBatchReadOperations([request1, request2, request3, request4, request5, request6, request7]);
        oDataModel.submitBatch(function(data, response) {
            var A = data.__batchResponses;
            if(debugMode) {
                jQuery.sap.log.info("DDA-MASTER : ",JSON.stringify(A[0]));
                jQuery.sap.log.info("DDA-CONFIG : ",JSON.stringify(A[1]));
                jQuery.sap.log.info("DDA-HEADER : ",JSON.stringify(A[2]));
                jQuery.sap.log.info("DDA-FILTERS : ",JSON.stringify(A[3]));
                jQuery.sap.log.info("DDA-COLUMNS : ",JSON.stringify(A[4]));
                jQuery.sap.log.info("DDA-CHART : ",JSON.stringify(A[5]));
                jQuery.sap.log.info("DDA-MASTER-TEXT : ",JSON.stringify(A[6]));
            }
            
            sap.suite.smartbusiness.ddaconfig.MasterData = {};
            sap.suite.smartbusiness.ddaconfig.MasterData.MASTER = A[0].data.results;
            sap.suite.smartbusiness.ddaconfig.MasterData.CONFIG = A[1].data.results;
            sap.suite.smartbusiness.ddaconfig.MasterData.HEADER = A[2].data.results;
            sap.suite.smartbusiness.ddaconfig.MasterData.FILTERS = A[3].data.results;
            sap.suite.smartbusiness.ddaconfig.MasterData.COLUMNS = A[4].data.results;
            sap.suite.smartbusiness.ddaconfig.MasterData.CHART = A[5].data.results;
            
            init.call(that,A[0].data.results,A[1].data.results,A[2].data.results,A[3].data.results,A[4].data.results,A[5].data.results,A[6].data.results);
        }, function(errorObject){
            throw new Error("Failed to fetch DDA Configuration");
        },false);
    };
    _fetchConfiguration.call(this);
};

/**
 * Constants Defined for All Segment Types
 */
sap.suite.smartbusiness.ddaconfig.Configuration.Constants = {
    SAP_FILTER : {
        desc : "Flag whether filter is enabled",
        func : "isFilterEnabled"
    },
    SAP_HEADER : {
        desc : "Flag whether header is enabled",
        func : "isHeaderEnabled"
    },
    SAP_AGGREGATE_VALUE : {
        desc : "Flag whether aggregate kpi value is enabled",
        func : "isAggregateValueEnabled"
    },
    QUERY_SERVICE_URI : {
        desc : "Evaluation Query Service Uri",
        func : "getQueryServiceUri"
    },
    QUERY_ENTITY_SET : {
        desc : "Result path for the query service uri",
        func : "getEntitySet"
    }
};


sap.suite.smartbusiness.ddaconfig.writeservices = (function() {
    var _instance = null;
    return {
        getInstance : function(bForce) {
            jQuery.sap.require("sap.suite.ui.smartbusiness.lib.DrilldownWriteService");
            if(_instance && !bForce) {
                return _instance;
            } else {
                _instance = new sap.suite.smartbusiness.ddaconfig.DrilldownWriteService();
            }
            return _instance;
        }
    }
})();