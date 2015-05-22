jQuery.sap.declare("sap.suite.ui.smartbusiness.drilldown.lib.Configuration");

/**
 * NamesSpace for DDA Configuration API
 */
sap.suite = sap.suite || {};
sap.suite.smartbusiness = sap.suite.smartbusiness || {};
sap.suite.smartbusiness.drilldown = (function(){
    var _cache = {};
    var _encodeUrl = function(uRi) {
        return jQuery.sap.encodeURL(uRi);
    };
    var trim = function(str) {
    	if(str) {
    		return str.trim();
    	}
    	return str;
    };
    var Header =  function(oHeader) {
        this.oHeader = oHeader;
        this.oHeader.CONFIGURATION = trim(this.oHeader.CONFIGURATION);
        if(this.oHeader.CONFIGURATION) {
        	var temp = this.oHeader.CONFIGURATION;
        	try {
        		tempObject = JSON.parse(temp);
        		for(var each in tempObject) {
        			tempObject[each]  = JSON.parse(tempObject[each]);
        		}
        		this.oHeader.PARSED_CONFIGURATION = tempObject;
        	} catch(e) {
        		jQuery.sap.log.error("Error Parsing Drilldown Header Configuration");
        		this.oHeader.PARSED_CONFIGURATION = null;
        	}
        } else {
        	this.oHeader.PARSED_CONFIGURATION = null;
        }
    };
    Header.prototype = {
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
            getTileConfiguration : function() {
            	return this.oHeader.PARSED_CONFIGURATION;
            },
            getVisibility : function() {
                return this.oHeader.VISIBILITY;
            }
    };

    /**
     * 
     * @param oChart
     * @returns {Chart}
     */
    var Chart = function(oChart) {
        this.oChart = oChart;
    };
    Chart.prototype = {
            getValueType : function() {
                return this.oChart.VALUE_TYPE; //Possible Values Absolute/Percentage
            },
            getAxisType : function() {
                return this.oChart.AXIS_TYPE; //Possible Values Single/Dual
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
                    isCombination : function() {
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
            getThresholdMeasure : function() {
                return this.oChart.THRESHOLD_MEASURE;
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
            isStackingEnabled : function(viewConfiguration) {
                var flag = false;
                var columns = viewConfiguration.getColumns();
                columns.forEach(function(column) {
                    var oColumn  = viewConfiguration.findColumnByName(column);
                    if(oColumn.isStacked()) {
                        flag = true;
                        return false;
                    }
                });
                return flag;
            }

            /*Chart Types*/
    };

    /**
     * 
     * @returns {Column}
     */
    var Column = function() {
    };
    Column.prototype = {
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
     * @returns {Dimension}
     */
    var Dimension = function(oParam) {
        this.oParam = oParam;
    };
    Dimension.prototype = new Column();

    /**
     * 
     * @param oParam
     * @returns {Measure}
     */
    var Measure = function(oParam) {
        this.oParam = oParam;
    };
    Measure.prototype = new Column();


    /**
     * 
     * @param oParam
     * @returns {Filter}
     */
    var Filter = function(oParam) {
        this.oFilter = oParam;
    };
    Filter.prototype = {
            getName : function() {
                return this.oFilter.DIMENSION;
            },
            isVisible  : function() {
                return this.oFilter.VISIBILITY == 1;
            }
    };
    var View = function(oParam) {
        this._viewId = oParam.CONFIGURATION_ID;
        this._evaluationId = oParam.EVALUATION_ID;
        this._title  = oParam.TEXT;
        this._order = oParam.CONFIG_ORDER;
        this._columns = [];this._dimensions = []; this._measures = []; 
        this._dimensionMap = {}; this._measureMap = {};
        this._chartConfig = [];
    };
    View.prototype = {
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
            getColumns  : function() {
                return this._columns;
            },
            getDimensions : function () {
                return this._dimensions;  
            },
            getDimensionCount : function() {
                return this._dimensions.length;
            },
            getMeasures : function() {
                return this._measures;  
            },
            getMeasureCount : function() {
                return this._measures.length;
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
            getChartConfiguration : function() {
                return this._chartConfig;
            }
    };
    var Configuration = function(evaluationId, batchResponse) {
        this.evaluationId = evaluationId;
        this._batchResponse = batchResponse;
        var defautView = null;
        var viewMap = {};
        var viewIdArray = [];
        var _index = -1;
        this._filters = []; this._filterMap = {};
        this._headers = [];
        var init = function(oMaster, oConfig, oHeader, oFilter, oColumns, oChart) {
            oMaster.forEach(function(v,i,a) {
                var viewId = v.CONFIGURATION_ID;
                if(viewId) {
                    _index++;
                    viewIdArray.push(viewId);
                    var vObject = new View(v);
                    viewMap[viewId] = vObject;
                    if(_index == 0) {
                        defautView = viewId;
                    }
                    View.setDimensionAndMeasures(oColumns, vObject);
                    View.setChart(oChart, vObject);
                }
            });
            var Segments = Configuration.Constants;
            for(var eachSegment in Segments) {
                var func = Segments[eachSegment].func;
                if(jQuery.sap.startsWith(func,"is")) {
                    Configuration.prototype[func] = function() {
                        return true;  
                    };
                } else {
                    Configuration.prototype[func] = function() {
                        return null;  
                    };
                }
            }
            oConfig.forEach(function(oValue, index, aArray) {
                var tempObject = Segments[oValue.PROPERTY_TYPE];
                if(tempObject) {
                    var func = tempObject.func;
                    if(jQuery.sap.startsWith(func,"is")) {
                        Configuration.prototype[func] = function() {
                            return oValue.VISIBILITY == 1;  
                        };
                    } else {
                        Configuration.prototype[func] = function() {
                            return oValue.PROPERTY_VALUE;  
                        };
                    }
                } else {
                    jQuery.sap.log.error("Unknown Property_Name : " + oValue.PROPERTY_TYPE);
                }
            },this);
            if(oFilter.length) {
                oFilter.forEach(function(oValue, index, aArray){
                    this._filters.push(oValue.DIMENSION);
                    this._filterMap[oValue.DIMENSION] = new Filter(oValue);
                }, this);
            }
            if(oHeader.length) {
                oHeader.forEach(function(oValue, index, array) {
                    this.getHeaders().push(new Header(oValue));
                }, this);
            }
        };
        this.getFilters = function() {
            return this._filters;
        };
        this.getHeaders = function() {
            return this._headers;
        };
        this.getMaxViewOrder = function() {
            var max_order = 0;
            for (var view in viewMap) {
                max_order = Math.max(max_order, viewMap[view].getViewOrder());
            }
            return max_order;
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
        this.getAllViews = function() {
            var views = [];
            viewIdArray.forEach(function(viewId) {
                views.push({
                    ID : viewId,
                    TITLE : this.findViewById(viewId).getTitle() || "-NA- ("+viewId+")"
                })
            }, this);
            return views;
        };
        init.call(this, this._batchResponse[0].data.results,
                this._batchResponse[1].data.results,
                this._batchResponse[2].data.results,
                this._batchResponse[3].data.results,
                this._batchResponse[4].data.results,
                this._batchResponse[5].data.results);
    };
    Configuration.Constants = {
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
    View.setDimensionAndMeasures = function(oColumns, oThis) {
        oColumns.forEach(function(oValue, index, aArray) {
            if(oValue.CONFIGURATION_ID == this.getId()) {
                this._columns.push(oValue.NAME);
                if(oValue.TYPE.toUpperCase() == "MEASURE") {
                    this._measureMap[oValue.NAME] = new Measure(oValue);
                    this._measures.push(oValue.NAME);
                } else if(oValue.TYPE.toUpperCase() == "DIMENSION") {
                    this._dimensionMap[oValue.NAME] = new Dimension(oValue);
                    this._dimensions.push(oValue.NAME);
                }
            }
        }, oThis);
    };
    View.setChart = function(oChart, oThis) {
        if(oChart.length) {
            oChart.forEach(function(oValue, index, array) {
                if(this.getId() == oValue.CONFIGURATION_ID) {
                    this.getChartConfiguration().push(new Chart(oValue));
                }
            }, oThis);
        }
    };
    var ConfigurationTree = function(eTitle) {
        var TILE_MAPPING = {
                TT : "Area Chart Tile",
                CT  : "Comparison Tile",
                NT  :"Numeric Tile",
                AT  : "Bullet Tile"
        };
        var tree= {name : eTitle, children : []};
        var allViews = this.getAllViews();
        for(var each in allViews) {
            var eachView = {
                    name : allViews[each].TITLE || "NA",
                    children : []
            };

            var view = this.findViewById(allViews[each].ID);

            /**
             * Configuration
             * 
             */
            var config = {
                    name : "*Configuration",
                    children : []
            };
            eachView.children.push(config);

            config.children.push({
                name : "Filter Enabled : "+this.isFilterEnabled()
            });
            config.children.push({
                name : "Kpi Aggregate Value Enabled: "+this.isAggregateValueEnabled()
            });
            config.children.push({
                name : "Header Enabled : "+this.isHeaderEnabled()
            });
            config.children.push({
                name : "OData Service Uri : "+this.getQueryServiceUri()
            });
            config.children.push({
                name : "Entity Set : "+this.getEntitySet()
            });

            /**
             * Filters
             */
            var filters = this.getFilters();
            var filter = {
                    name : "*Filters("+filters.length+")",
                    children : []
            };
            eachView.children.push(filter);
            filters.forEach(function(eachFilter){
                filter.children.push({
                    name : eachFilter
                });
            });

            /**
             * Chart Configuration
             * 
             */
            var chartConfig = view.getChartConfiguration().length ? view.getChartConfiguration()[0] : null;
            var chart = {
                    name : "*Chart",
                    children : []
            }
            eachView.children.push(chart);
            if(chartConfig) {
                chart.children.push({
                    name : "Type : "+chartConfig.getChartType().getText()
                });
                chart.children.push({
                    name : "Color Scheme : "+chartConfig.getColorScheme().getText()
                });
                chart.children.push({
                    name : "Value Type : "+chartConfig.getValueType()
                });
                chart.children.push({
                    name : "Axis Type : "+chartConfig.getAxisType()
                });
                chart.children.push({
                    name : "Data Limit : "+(chartConfig.getDataLimit() || "NA")
                });
                chart.children.push({
                    name : "Stacking Enabled : "+chartConfig.isStackingEnabled(view)
                });
                chart.children.push({
                    name : "Threshold Measure : "+chartConfig.getThresholdMeasure()
                });


            } else {
                chart.children.push({
                    name : "Oops!!!NO Chart Configuration"
                });
            }
            /**
             * Measure
             */
            var measures = view.getMeasures();
            var measure = {
                    name : "*Measures("+measures.length+")",
                    children : []
            };
            eachView.children.push(measure);
            measures.forEach(function(value, index, array) {
                var tempMeasure = {
                        name : value,
                        children : []
                };
                measure.children.push(tempMeasure);
                var oMeasure = view.findMeasureByName(value);
                tempMeasure.children.push({
                    name : "Color : "+(oMeasure.getColor() || "NA")
                });
                tempMeasure.children.push({
                    name : "Sort By : "+oMeasure.getSortBy()
                });
                tempMeasure.children.push({
                    name : "Sort Order : "+oMeasure.getSortOrder()
                });
                tempMeasure.children.push({
                    name : "Visible in Table : "+oMeasure.isVisibleInTable()
                });
                tempMeasure.children.push({
                    name : "Axis : "+oMeasure.getAxis()
                });
                tempMeasure.children.push({
                    name : "Is Stacked :" +oMeasure.isStacked()
                });

            }, this);

            /**
             * Dimension
             */
            var dimensions = view.getDimensions();
            var dimension = {
                    name : "*Dimensions("+dimensions.length+")",
                    children : []
            };
            eachView.children.push(dimension);
            dimensions.forEach(function(value, index, array) {
                var tempDimension = {
                        name : value,
                        children : []
                };
                dimension.children.push(tempDimension);
                var oDimension = view.findDimensionByName(value);
                tempDimension.children.push({
                    name : "Sort By : " +oDimension.getSortBy()
                });
                tempDimension.children.push({
                    name : "Sort Order : " +oDimension.getSortOrder()
                });
                tempDimension.children.push({
                    name : "Visible in Table : " + oDimension.isVisibleInTable()
                });
                tempDimension.children.push({
                    name : "Axis :" +oDimension.getAxis()
                });
                tempDimension.children.push({
                    name : "Is Stacked :" +oDimension.isStacked()
                });

            }, this);


            /**
             * Header
             */
            var headers = this.getHeaders();
            var header = {
                    name : "*Kpi_Headers("+headers.length+")",
                    children : []
            };
            eachView.children.push(header);
            headers.forEach(function(each, index) {
                var firstHeader = {
                        name : index+1+"",
                        children : []
                };
                header.children.push(firstHeader);

                firstHeader.children.push({
                    name : "Type : "+TILE_MAPPING[each.getVisualizationType()],
                });
                firstHeader.children.push({
                    name : "Reference Evaluation : "+each.getReferenceEvaluationId(),
                });
                firstHeader.children.push({
                    name : "Dimension : "+(each.getDimension() || "NA"),
                });
                firstHeader.children.push({
                    name : "isAssociatedOrOtherEvaluation : "+each.isAssociated(),
                });
            });
            tree.children.push(eachView);
        }
        return tree;
    };
    var getCacheKey = function(oParam) {
        var key = oParam.id;
        return key;
    };

    var formatEvaluation = function(evalData){
        var evaluationList=[];
        var filterList=[];
        var valueList=[];
        var filterCount1=parseInt(evalData.results[0].FILTERS_COUNT) || 1;
        var valueCount=parseInt(evalData.results[0].VALUES_COUNT) || 1;
        var totalCount=filterCount1*valueCount;
        for(var i=0;i<evalData.results.length;i+=totalCount){
            var filterCount=parseInt(evalData.results[i].FILTERS_COUNT) || 1;
            var valueCount=parseInt(evalData.results[i].VALUES_COUNT) || 1;
            var totalCount=filterCount*valueCount;
            var evalList={};
            evalList.keys={};

            evalList.keys.VALUES={};
            evalList.keys.VALUES.results = [];
            evalList.keys.FILTERS={};
            evalList.keys.FILTERS.results = [];
            evalList.keys.ID=evalData.results[i].ID;
            evalList.keys.DESCRIPTION =evalData.results[i].DESCRIPTION;
            evalList.keys.ACTION = evalData.results[i].ACTION;
            evalList.keys.INDICATOR = evalData.results[i].INDICATOR;
            evalList.keys.INDICATOR_TITLE = evalData.results[i].INDICATOR_TITLE;
            evalList.keys.TITLE = evalData.results[i].TITLE;
            evalList.keys.NAME = evalData.results[i].NAME;
            evalList.keys.SCALING=evalData.results[i].SCALING;
            evalList.keys.ODATA_URL=evalData.results[i].ODATA_URL;
            evalList.keys.ODATA_ENTITYSET=evalData.results[i].ODATA_ENTITYSET;
            evalList.keys.VIEW_NAME=evalData.results[i].VIEW_NAME;
            evalList.keys.COLUMN_NAME=evalData.results[i].COLUMN_NAME;
            evalList.keys.OWNER_NAME=evalData.results[i].OWNER_NAME;
            evalList.keys.OWNER_E_MAIL=evalData.results[i].OWNER_E_MAIL;
            evalList.keys.OWNER_ID=evalData.results[i].OWNER_ID;           
            evalList.keys.PROPERTIES = evalData.results[i].PROPERTIES||{};
            evalList.keys.ODATA_PROPERTY=evalData.results[i].ODATA_PROPERTY;
            evalList.keys.SEMANTIC_OBJECT=evalData.results[i].SEMANTIC_OBJECT;
            evalList.keys.VALUES_SOURCE=evalData.results[i].VALUES_SOURCE;
            evalList.keys.INDICATOR_TYPE=evalData.results[i].INDICATOR_TYPE;            
            evalList.keys.GOAL_TYPE=evalData.results[i].GOAL_TYPE;

            for(var j=i;j<valueCount+i;j++){
                if(parseInt(evalData.results[i].VALUES_COUNT)){
                    var value={};
                    value.TYPE=evalData.results[j].TYPE;
                    value.FIXED=evalData.results[j].FIXED;
                    value.COLUMN_NAME=evalData.results[j].COLUMN_NAME_1;
                    value.ODATA_PROPERTY=evalData.results[j].ODATA_PROPERTY_1;
                    value.ID = evalData.results[j].ID;
                    evalList.keys.VALUES.results.push(value);
                }
            }
            for(var k=i;k<totalCount+i;k+=valueCount){
                if(parseInt(evalData.results[i].FILTERS_COUNT)){
                    var filter={};
                    filter.ID = evalData.results[k].ID;
                    filter.NAME=evalData.results[k].NAME;
                    filter.OPERATOR=evalData.results[k].OPERATOR;
                    filter.TYPE=evalData.results[k].TYPE_1;                
                    filter.VALUE_1=evalData.results[k].VALUE_1;
                    filter.VALUE_2=evalData.results[k].VALUE_2;
                    evalList.keys.FILTERS.results.push(filter);
                }
            }
            evaluationList.push(evalList.keys);
        }

        return evaluationList;
    };
    var _appendSapSystemToUri = function(serviceUri, sapSystem) {
        if(sap.ushell && sap.ushell.Container && sap.ushell.Container.getService) {
            var urlParsingService = sap.ushell.Container.getService("URLParsing");
            serviceUri = urlParsingService.addSystemToServiceUrl(serviceUri, sapSystem);
        }
        return serviceUri;
    };
    return  {
        getConfigurationTree : function(evaluationId, sCallback, fCallback) {
            this.loadConfiguration({
                evaluationId : evaluationId,
                cache : true,
                success : function(batchResponse) {
                    var Configuration = this.parse(evaluationId, batchResponse);
                    sCallback.call(null, ConfigurationTree.apply(Configuration,["Evaluation"]));
                },
                error : function(errorMessage) {
                    jQuery.sap.log.error("Error Fetching Drilldown Configuration")
                },
                context : this
            });
        },
        parse : function(evaluationId, batchResponse) {
            return new Configuration(evaluationId, batchResponse);
        },
        getConfigurationFromCache : function(evalId) {
        	return _cache[evalId];
        },
        loadConfiguration : function(oParam) {
            var evaluationId = oParam.evaluationId;
            var cache = !!oParam.cache;
            if(_cache[evaluationId] && cache) {
                oParam.success.call(oParam.context || null, _cache[evaluationId]);
            } else {
                var oDataModel = null;
                var serviceUri = "/sap/hba/r/sb/core/odata/runtime/SMART_BUSINESS.xsodata";
                serviceUri = _appendSapSystemToUri(serviceUri, oParam.sapSystem);
                if(sap.suite.smartbusiness.odata) {
                    oDataModel = sap.suite.smartbusiness.odata.getModelByServiceUri(serviceUri);
                } else {
                    oDataModel = new sap.ui.model.odata.ODataModel(serviceUri, true);
                }
                oDataModel.setTokenHandlingEnabled(false);
                var masterUri = "/DDA_MASTER?$filter="+_encodeUrl("EVALUATION_ID eq '"+evaluationId+"'")+"&$orderby=CONFIG_ORDER";
                var configUri = "/DDA_CONFIG?$filter="+_encodeUrl("EVALUATION_ID eq '"+evaluationId+"'");
                var headerUri = "/DDA_HEADER?$filter="+_encodeUrl("EVALUATION_ID eq '"+evaluationId+"'")+"&$orderby=VISUALIZATION_ORDER";
                var filtersUri = "/DDA_FILTERS?$filter="+_encodeUrl("EVALUATION_ID eq '"+evaluationId+"'");
                var columnsUri = "/DDA_COLUMNS?$filter="+_encodeUrl("EVALUATION_ID eq '"+evaluationId+"'")+"&$orderby=COLUMNS_ORDER";
                var chartUri = "/DDA_CHART?$filter="+_encodeUrl("EVALUATION_ID eq '"+evaluationId+"'");
                var request1 = oDataModel.createBatchOperation(masterUri,"GET");
                var request2 = oDataModel.createBatchOperation(configUri,"GET");
                var request3 = oDataModel.createBatchOperation(headerUri,"GET");
                var request4 = oDataModel.createBatchOperation(filtersUri,"GET");
                var request5 = oDataModel.createBatchOperation(columnsUri,"GET");
                var request6 = oDataModel.createBatchOperation(chartUri,"GET");
                oDataModel.addBatchReadOperations([request1, request2, request3, request4, request5, request6]);
                var oDataCallReference = oDataModel.submitBatch(function(data, response) {
                    var batchResponse = data.__batchResponses;
                    _cache[evaluationId] = batchResponse;
                    oParam.success.call(oParam.context || null, batchResponse);
                    //oParam.success.call(null,A[0].data.results,A[1].data.results,A[2].data.results,A[3].data.results,A[4].data.results,A[5].data.results,A[6].data.results);
                }, function(errorObject){
                    jQuery.sap.log.error("Failed to fetch DDA Configuration");
                    if(oParam.error) {
                        oParam.error.call(oParam.context || null, errorObject);
                    }
                }, true);
                return oDataCallReference
            }
        },
        setEvaluationsCache : function(oParam, callback) {
            var that = this;
            if(!oParam.evalIdArray) {
                throw new Error("Evaluation Id Not Found")
            }
            var cache_key = getCacheKey(oParam);
            var model =null;
            var urlParsingService = sap.ushell.Container.getService("URLParsing");
            var serviceUri = urlParsingService.addSystemToServiceUrl("/sap/hba/r/sb/core/odata/runtime/SMART_BUSINESS.xsodata", oParam.sapSystem);
            if(sap.suite.smartbusiness.odata) {
                model = sap.suite.smartbusiness.odata.getModelByServiceUri(serviceUri);
            } else {
                model = new sap.ui.model.odata.ODataModel(serviceUri, true);
            }
            var filterValue = ""
                oParam.evalIdArray.forEach(function(currentEvaluationId) {
                    var cache_key = currentEvaluationId;
                    var evaluationObject = sap.suite.smartbusiness.cache.getEvaluationById(cache_key);
                    if(!evaluationObject) 
                        filterValue += "ID eq '#EVALUATION_ID' or ".replace("#EVALUATION_ID",cache_key);
                });
            if(filterValue){
                filterValue = filterValue.slice(0,-4);
                var oDataParamObject = {};
                oDataParamObject["$filter"] = filterValue;
                oDataParamObject["$orderby"] = "ID,NAME";
                var callRef = model.read("/EVALUATIONS_CORE", null, oDataParamObject, true, function(data) {
                    if(data.results && data.results.length) {
                        var evalList = formatEvaluation(data);
                        for(var i=0; i<evalList.length; i++)                            
                            sap.suite.smartbusiness.cache.setEvaluationById(evalList[i].ID, evalList[i]);
                        oParam.success.call(oParam.context || null);
                    } else {
                        jQuery.sap.log.error("Empty Evaluation returned");
                        oParam.success.call(oParam.context || null);
                    }
                }, function(){
                    jQuery.sap.log.error("Error fetching Evaluations");
                    oParam.success.call(oParam.context || null);
                });
                return callRef;
            }
            else{
                oParam.success.call(oParam.context || null);
                return null;
            }
        },       
        getEvaluationById : function(oParam) {
            if(!oParam.id) {
                throw new Error("Evaluation Id Not Found")
            }
            var cache_key = getCacheKey(oParam);
            if(oParam.cache) {
                var evaluationObject = sap.suite.smartbusiness.cache.getEvaluationById(cache_key);
                if(evaluationObject) {
                    if(oParam.success) {
                        oParam.success.call(oParam.context || null, evaluationObject);
                        return null;
                    }
                }
            }
            var model =null;
            var urlParsingService = sap.ushell.Container.getService("URLParsing");
            var serviceUri = urlParsingService.addSystemToServiceUrl("/sap/hba/r/sb/core/odata/runtime/SMART_BUSINESS.xsodata", oParam.sapSystem);
            if(sap.suite.smartbusiness.odata) {
                model = sap.suite.smartbusiness.odata.getModelByServiceUri(serviceUri);
            } else {
                model = new sap.ui.model.odata.ODataModel(serviceUri, true);
            }
            var filterValue = "ID eq '#EVALUATION_ID'".replace("#EVALUATION_ID",oParam.id);
            var evalData = null;
            var oDataParamObject = {};
            oDataParamObject["$filter"] = filterValue;
            var expandParams = "";
            if(oParam.filters) {
                expandParams += "FILTERS,";
            }
            if(oParam.thresholds) {
                expandParams += "VALUES,";
            }
            if(expandParams) {
                oDataParamObject["$expand"] = expandParams.substring(0,expandParams.length-1);
            }
            var callRef = model.read("/EVALUATIONS", null, oDataParamObject, true, function(data) {
                if(data.results && data.results.length) {
                    evalData = data.results[0];
                    sap.suite.smartbusiness.cache.setEvaluationById(cache_key, evalData);
                    oParam.success.call(oParam.context || null, evalData);
                } else {
                    oParam.error.call(oParam.context || null, "Empty Results with EvaluationID : "+oParam.id);
                }
            }, function(){
                jQuery.sap.log.error("Error fetching Evaluation : ",oParam.id);
                if(oParam.error) {
                    oParam.error.apply(oParam.context || null, arguments);
                }
            });
            return callRef;
        }
    };
})(); 