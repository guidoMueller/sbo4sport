jQuery.sap.require("sap.ca.scfld.md.controller.BaseFullscreenController");
jQuery.sap.require("sap.m.MessageBox");
sap.ca.scfld.md.controller.BaseFullscreenController.extend("sap.suite.ui.smartbusiness.drilldown.view.Drilldown", {
    _getEvaluationId : function() {
        try {
            var startupParameters = this.oConnectionManager.getComponent().oComponentData.startupParameters;
            return startupParameters["evaluationId"][0];
        }catch(e) {
            return sap.suite.smartbusiness.url.hash.getStartupParameters().evaluationId[0];
        }
    },
    _getDataFromUrl : function() {
        try {
            var startupParameters = this.oConnectionManager.getComponent().oComponentData.startupParameters;
            this.TILE_TYPE='';
            this.DIMENSION='';
            if(startupParameters["tileType"]) {
                this.TILE_TYPE = startupParameters["tileType"][0];
            }
            if(startupParameters["dimension"]) {
                this.DIMENSION = startupParameters["dimension"][0];
            }
            if(startupParameters["sap-system"]) {
                this.SAP_SYSTEM = startupParameters["sap-system"][0];
            }
            if(startupParameters["chipId"]) {
                this.CHIP_ID = startupParameters["chipId"][0];
            }
        }catch(e) {
            var sParams = sap.suite.smartbusiness.url.hash.getStartupParameters();
            if(sParams) {
                if(sParams.tileType) {
                    this.TILE_TYPE = sParams.tileType[0];
                }
                if(sParams.dimension) {
                    this.DIMENSION = sParams.dimension[0];
                }
                if(sParams["sap-system"]) {
                    this.SAP_SYSTEM = sParams["sap-system"][0];
                }
                if(sParams["chipId"]) {
                    this.CHIP_ID = sParams["chipId"][0];
                }
            }
        }
    },
    fetchAllEvaluations : function(oParam){
        var headerEvalArray = [this._getEvaluationId()];
        var oHeaders = this.CONFIGURATION.getHeaders();
        oHeaders.forEach(function(curHeader) {
            if(curHeader.isAssociated()) {
                if(headerEvalArray.indexOf(curHeader.getReferenceEvaluationId()) == -1) {
                    headerEvalArray.push(curHeader.getReferenceEvaluationId());
                }
                if(headerEvalArray.indexOf(curHeader.getEvaluationId()) == -1) {
                    headerEvalArray.push(curHeader.getEvaluationId());
                }
            }
        });
        this._bundled_evaluations_call_ref = sap.suite.smartbusiness.drilldown.setEvaluationsCache({
            evalIdArray : headerEvalArray,
            sapSystem : this.SAP_SYSTEM,
            success: oParam.success,
            context: oParam.context
        });
    }, 
    onAfterRendering : function() {
        var EVAL_ID = this._getEvaluationId();
        this._EVALUATION_ID = EVAL_ID;
        this.firstTimeFlag = false;
        this._getDataFromUrl();
        if(!this._proxyHashChangeListener) {
            this._proxyHashChangeListener = jQuery.proxy(this.hashChangeListener, this);
            this._attachHashChangeEvent();
        }
        this._busyDialog.open();
        var startTimeConfigFetch = new Date().getTime();
        this.DDA_CONFIG_ODATA_CALL_REF = sap.suite.smartbusiness.drilldown.loadConfiguration({
           evaluationId : EVAL_ID,
           cache : true,
           success : function(batchResponse) {
               var endTimeConfigFetch = new Date().getTime();
               this._requestTimeLog["DDA_CONFIG_FETCH"] = {
                       title : "Configuration",
                       time : endTimeConfigFetch - startTimeConfigFetch
               };
               this.CONFIGURATION = sap.suite.smartbusiness.drilldown.parse(EVAL_ID, batchResponse);
               var that=this;
               if( this.CONFIGURATION.getAllViews().length==0){
            	   jQuery.sap.log.error("drilldown not configured");
            	   var oI18nModel = that.getView().getModel("i18n");
            	   sap.m.MessageBox.alert(oI18nModel.getResourceBundle().getText("DDA_NOT_CONFIGURED"), function () {
            		   window.location.hash = "";
            		   that._busyDialog.close();
            	   });
            	   return;
               }

               var startTimeBundledEvaluationFetch = new Date().getTime();
               this.fetchAllEvaluations({
                   success: function() {
                       var endTimeBundledEvaluationFetch = new Date().getTime();
                       this._requestTimeLog["BUNDLED_EVALUATIONS_FETCH"] = {
                               title : "Evaluations",
                               time : endTimeBundledEvaluationFetch - startTimeBundledEvaluationFetch
                       };
                       this.EVALUATION_ODATA_CALL_REF = sap.suite.smartbusiness.drilldown.getEvaluationById({
                           id : EVAL_ID,
                           cache : true,
                           filters : true,
                           thresholds : true,
                           success : function(evalData) {
                               this._busyDialog.close();
                               this.EVALUATION = sap.suite.smartbusiness.kpi.parseEvaluation(evalData);
                               this._initialize();
                           },
                           error : function() {
                               this._busyDialog.close();
                               throw new Error("Evaluation Details Not Found with ID : "+EVAL_ID);
                           },
                           context : this,
                           sapSystem : this.SAP_SYSTEM
                       });
                   },
                   context : this,
               });
           },
           error : function() {
               jQuery.sap.log.error("Drilldown Configuration Fetching Failed");
               this._busyDialog.close();
           },
           context : this,
           sapSystem : this.SAP_SYSTEM
        });
        
    },
    onInit : function() {
        // invalidating cache on page load
        sap.suite.smartbusiness.cache.invalidateKpiDetailsCache();
    	this._requestTimeLog = {};
        this._busyDialog = new sap.m.BusyDialog();
        sap.sb_drilldown_app = this;
        this.EVALUATION = null;
        this.CONFIGURATION = null;
        this.SELECTED_VIEW = null;
        this.POPOVER_VIEW_NAVIGATION_MODEL = new sap.ui.model.json.JSONModel({"VIEW_NAVIGATION":[]});
        this.POPOVER_EXTERNAL_APP_NAVIGATION_MODEL = new sap.ui.model.json.JSONModel({"APP_NAVIGATION":[]});
        this.SEMANTIC_OBJECT = sap.suite.smartbusiness.url.hash.getSemanticObject();
        this.ACTION = sap.suite.smartbusiness.url.hash.getAction();
        var locale = new sap.ui.core.Locale(sap.ui.getCore().getConfiguration().getLanguage());
        
        this.VALUE_FORMATTER = sap.ca.ui.model.format.NumberFormat.getInstance({
            style: "standard"
        },locale);
        this.urlParsingService = sap.ushell.Container.getService("URLParsing");
        this.addExportMethodToTable();
        this._hideOrShowFacetFilterIfRequired();//Show Facet Filter if some filters has been applied 
    },
    _hideOrShowFacetFilterIfRequired : function() {
    	/**
    	 * Show the Filters if View switched from Chart/Table Context
    	 */
        var filter = this.getUIComponents().getFilter();
        var filterObj = sap.suite.smartbusiness.url.hash.getApplicationParameters(["viewId"]);
        if(jQuery.isEmptyObject(filterObj) == false) {
        	filter.setVisible(true);
	    }
    },
    onBeforeRendering : function() {
    	
    },
    _initialize : function() {
    	this.setHeaderFooterOptions(this.getHeaderFooterOptions());
        //Set Window Page Title
        this._initExternalNavigationLinks();  
        var windowPageTitle = this.EVALUATION.getKpiName()+" - "+this.EVALUATION.getTitle();
        try {
            if(sap.ushell.services.AppConfiguration && sap.ushell.services.AppConfiguration.setWindowTitle){
                sap.ushell.services.AppConfiguration.setWindowTitle(windowPageTitle);
            }
        } catch(e){
            jQuery.sap.log.error("Error Setting Window Page Title : "+windowPageTitle)
        }
        /*Prepare OData MetaData like Label, Text Property, UnitProperty*/
        var mProperties = sap.suite.smartbusiness.odata.properties(this.urlParsingService.addSystemToServiceUrl(this.EVALUATION.getODataUrl(),this.SAP_SYSTEM),this.EVALUATION.getEntitySet());
        this.COLUMN_LABEL_MAPPING = mProperties.getLabelMappingObject();
        this.DIMENSION_TEXT_PROPERTY_MAPPING = mProperties.getTextPropertyMappingObject();
        this.MEASURE_UNIT_PROPERTY_MAPPING = mProperties.getUnitPropertyMappingObject();
        
        /**
         * Prepare Add To Home Dialog
         */
        this._initAddToHomeDialogBox();
        
        var viewListModel = new sap.ui.model.json.JSONModel();
        viewListModel.setData(this.CONFIGURATION.getAllViews());
        var UIComponents = this.getUIComponents();
        UIComponents.getChartToolbar().setModel(viewListModel,"VIEW_SWITCH");
        //model for chart
        this.chartModel = new sap.ui.model.json.JSONModel();
        var chartModelSize = 9999;
        this.chartModel.setSizeLimit(chartModelSize);
        UIComponents.getChartToolbar().setModel(this.chartModel);
        //model for aggregate Number, unit etc
        this.EvaluationHeaderModel = new sap.ui.model.json.JSONModel();
        UIComponents.getHeader().setModel(this.EvaluationHeaderModel);
        //model of title lable
        this.titleModel = new sap.ui.model.json.JSONModel();
        UIComponents.getPage().getCustomHeader().getContentMiddle()[0].setModel(this.titleModel);
        
        
        this.renderDrilldownHeader();
        //act according to hash
        this._initRequestTimeLogChart();
        this.hashChangeListener();
    },
    switchedToTableView : function() {
        if(this.getUIComponents().getChart()) {
            this.setChartSelectionContextObject(null);
        }
    },
    switchedToChartView : function() {
        this.getUIComponents().getTable().setSelectedContext(null);
    },
    renderDrilldownHeader : function() {
        var aFilters = this.CONFIGURATION.getFilters();
        this.renderFilters(aFilters);
        var aHeaders = this.CONFIGURATION.getHeaders();
        this.renderKpiHeaders(aHeaders);
        this.renderTitle();
        this.renderEvaluationHeader();
    },
    renderTitle: function() {
        var title_label = this.getUIComponents().getPage().getCustomHeader().getContentMiddle()[0];
        if(title_label) {
            title_label.setText(this.EVALUATION.getKpiName());
        }
    },
    renderFilters: function(filters) {
        var facetFilter = this.getUIComponents().getFilter();
        facetFilter.setEvaluationData(this.EVALUATION);
        facetFilter.setEvaluationId(this.EVALUATION.getId());
        facetFilter.setDimensions(filters);
        facetFilter.setSapSystem(this.SAP_SYSTEM);
    },
    renderKpiHeaders: function(headers) {
        var self = this;
        var header_container = this.getUIComponents().getTileContainer();
        header_container.removeAllItems();
        this.miniChartManager = sap.suite.smartbusiness.miniChartManager.renderHeaders({
            allTiles : headers,
            headerContainer : header_container,
            sapSystem : this.SAP_SYSTEM,
            urlFilters : this.getUrlFilters()
        });
    },
    renderView: function(currentView) {
        this.table = null;
        this.chart = null;
        this._addUIComponents(currentView); //based on configuration
        
        var chartColumns = currentView.getColumns()
        var chartConfig = currentView.getChartConfiguration();
        this.renderTable(chartColumns, chartConfig[0].getColorScheme());
        if(this.chart) {
            //first element passed since getChartConfiguration() returns an array
            this.renderChart(currentView, chartConfig[0], chartColumns);
        }
    },
    
    /**
     * @desc fetches Evaluation data and binds value to aggregate number
     * @param [filters] - null if only evaluation filters are to be considered
     */
    renderEvaluationHeader : function() {
        var objectHeader = this.getUIComponents().getHeader(), that = this;
        objectHeader.setTitle(this.EVALUATION.getTitle());
        if(this.EVALUATION.getDescription()) {
            objectHeader.removeAllAttributes();
            objectHeader.addAttribute(new sap.m.ObjectAttribute({
                text : this.EVALUATION.getDescription()
            }));
        }
        var kpiMeasure = this.EVALUATION.getKpiMeasureName();
        
        /* 
         * Just in case the odata service provides a formatted measure value
         *  as sap:text, use it. Else fallback to measure value 
         */
        var formatted_kpiMeasure = kpiMeasure;
        if(this.DIMENSION_TEXT_PROPERTY_MAPPING[kpiMeasure]) {
        	formatted_kpiMeasure = this.DIMENSION_TEXT_PROPERTY_MAPPING[kpiMeasure];
        }
        
        var kpiMeasureUnitProperty = this.MEASURE_UNIT_PROPERTY_MAPPING[kpiMeasure];
        
        /*
         * Bypass ca formatter when using formatted kpi measure value 
         * returned by odata source
         */
        objectHeader.bindProperty("number", "/data/" + formatted_kpiMeasure, 
        		formatted_kpiMeasure != kpiMeasure ? 
        				function(v){return v} : 
        				function(value) {
				            if(value) {
				                if(that.EVALUATION.getScaling() == -2) {
				                    return (that.VALUE_FORMATTER.format(value*100) + "%");
				                }
				                else {
				                    return that.VALUE_FORMATTER.format(value);
				                }
				            }
				            return value;
				        });
        if(kpiMeasureUnitProperty) {
            objectHeader.bindProperty("numberUnit", "/data/" + kpiMeasureUnitProperty);
        }
    },
    fetchKpiValue: function() {
        if(!this.CONFIGURATION.isAggregateValueEnabled()) {
            return;
        }
        var that = this;
        var oUriObject = sap.suite.smartbusiness.odata.getUri({
            serviceUri : this.urlParsingService.addSystemToServiceUrl(this.EVALUATION.getODataUrl(), this.SAP_SYSTEM),
            entitySet : this.EVALUATION.getEntitySet(),
            measure: this._getEvaluationThresholdMeasures(),
            filter : this.getAllFilters()
        });
        var startTimeFetchKpiValue = new Date().getTime();
        var evaluationId = this._getEvaluationId();
        this.FETCH_AGREGATION_VALUE_ODATA_CALL_REF_SUCCESS = function(data) {
            var endTimeFetchKpiValue = new Date().getTime();
            that._requestTimeLog["KPI_VALUE"] = {
                 title : "Kpi Value",
                 time : endTimeFetchKpiValue - startTimeFetchKpiValue
            };
            if(data && data.results.length) {
                that.EvaluationHeaderModel.setData({data:data.results[0]});
                sap.suite.smartbusiness.cache.setKpiDetailsById(evaluationId,data);
                // removing from current_calls 
                if(sap.suite.smartbusiness.cache.current_calls[evaluationId]) {
                    var x = sap.suite.smartbusiness.cache.current_calls[evaluationId];
                    delete sap.suite.smartbusiness.cache.current_calls[evaluationId];
                    x.resolve();
                }
            } else {
                jQuery.sap.log.error("Couldn't fetch Aggregate Value. Response was "+data+" for uri : "+oUriObject.uri);
                that.EvaluationHeaderModel.setData({data:{}});
            }
        };
        this.FETCH_AGREGATION_VALUE_ODATA_CALL_REF_FAIL = function(err) {
            jQuery.sap.log.error(err);
            that.EvaluationHeaderModel.setData({data:{}});
            if(sap.suite.smartbusiness.cache.current_calls[evaluationId]){
                sap.suite.smartbusiness.cache.current_calls[evaluationId].reject();
            }
        };
        var fromCache = sap.suite.smartbusiness.cache.getKpiDetailsById(evaluationId);
        if(fromCache) {
            this.FETCH_AGREGATION_VALUE_ODATA_CALL_REF_SUCCESS(fromCache);
        }
        //if the call is currently in progress
        else if(sap.suite.smartbusiness.cache.current_calls[evaluationId]){
            jQuery.when(sap.suite.smartbusiness.cache.current_calls[evaluationId]).then(function() {
                var data = sap.suite.smartbusiness.cache.getKpiDetailsById(evaluationId);
                that.FETCH_AGREGATION_VALUE_ODATA_CALL_REF_SUCCESS(data);
            },function(errorMessage){that.logError(errorMessage)});
        }
        else {
            sap.suite.smartbusiness.cache.current_calls[evaluationId] = jQuery.Deferred();
            this.FETCH_AGREGATION_VALUE_ODATA_CALL_REF = oUriObject.model.read(oUriObject.uri, null, null, true,this.FETCH_AGREGATION_VALUE_ODATA_CALL_REF_SUCCESS ,this.FETCH_AGREGATION_VALUE_ODATA_CALL_REF_FAIL);
        }
    },
    _addPopoverContent : function(oControl, bIsTable) {
        var listOfViews = new sap.m.List({
            visible : {
                path : "/VIEW_NAVIGATION",
                formatter : function(oArray) {
                    if(oArray && oArray.length >0) {
                        return true;
                    }
                    return false;
                }
            }
        });
        listOfViews.bindItems("/VIEW_NAVIGATION", new sap.m.StandardListItem({
            title : "{TITLE}",
            type : sap.m.ListType.Navigation,
            customData : new sap.ui.core.CustomData({
                key : "{ID}",
                value : "{ID}"
            }),
            press : jQuery.proxy(this._onViewSelection,this,{publishContext : true, isTable : !!bIsTable})
        }).setTooltip("{TITLE}"));
        var allViews = this._getListOfViewsForPopover(this.CONFIGURATION.getAllViews(), this.SELECTED_VIEW.getId()); 
        listOfViews.setModel(this.POPOVER_VIEW_NAVIGATION_MODEL);
        
        var listOfNavigations = new sap.m.List({
            /*
            visible : {
                path : "/APP_NAVIGATION",
                formatter : function(oArray) {
                    if(oArray && oArray.length >0) {
                        return true;
                    }
                    return false;
                }
            }*/
        });
        this._popoverNavigationListReferences.push(listOfNavigations);
        listOfNavigations.bindItems("/APP_NAVIGATION", new sap.m.StandardListItem({
            title : "{text}",
            type : sap.m.ListType.Navigation,
            customData : new sap.ui.core.CustomData({
                key : "{id}",
                value : "{applicationAlias}"
            }),
            press : jQuery.proxy(this._onAppSelection,this,{publishContext : true, isTable : !!bIsTable})
        }).setTooltip("{text}"));
        listOfNavigations.setModel(this.POPOVER_EXTERNAL_APP_NAVIGATION_MODEL);
        
        var popoverContent = new sap.m.VBox({
            items : [listOfViews, listOfNavigations],
            width : "99%"
        });
        oControl.setPopoverFooter(popoverContent);
    },
    _addUIComponents : function(viewConfiguration) {
        this.table = null;
        this.chart = null;
        var chartToolbarRef = this.getUIComponents().getChartToolbar();
        chartToolbarRef.removeAllCharts();
        var chartConfiguration = viewConfiguration.getChartConfiguration()[0];
        if(chartConfiguration) {
            var that = this;
            this._popoverNavigationListReferences =  [];
             this.table = new sap.suite.ui.smartbusiness.drilldown.lib.CustomTable({
                 mode : sap.m.ListMode.SingleSelectMaster
             }).addStyleClass("smartBusinessDrilldownTable");
             this.table.attachSelectionChange(function() {
                that._onTableRowSelected(); 
             });
             this.table.addEventDelegate({
                 onAfterRendering : function() {
                     that.switchedToTableView();
                 }
             });
             this.table.setModel(this.getView().getModel("i18n"), "i18n");
             this._addPopoverContent(this.table, true);
             if(chartConfiguration.getChartType().isTable()) {
                 chartToolbarRef.addChart(this.table);
             } else {
                 this.chart = new sap.ca.ui.charts.Chart({
                     showPopover : true,
                     chartType : "Bar"
                 });
                 this.chart.setAdvancedChartSettings({
                     plotArea : {
                         animation : {
                             dataLoading : false,
                             dataUpdating : false,
                             resizing : false
                         }
                     },
                     legend : {
                         title : {
                             visible : false
                         }
                     },
                     yAxis : {
                         title : {
                             visible : true
                         }
                     },
                     xAxis : {
                         title : {
                             visible : true
                         }
                     }
                 });
                 this.chart.addEventDelegate({
                     onAfterRendering : function() {
                         that.switchedToChartView();
                     }
                 })
                 chartToolbarRef.addChart(this.chart);
                 chartToolbarRef.addChart(this.table);
                 this._addPopoverContent(this.chart, false);
             }
        } else {
            jQuery.sap.log.error("NO Chart Configuration found!! ");
        }
        
    },
    _setNoDataText : function(sPropertyKey) {
        this.table.setNoDataText(this.getView().getModel("i18n").getProperty(sPropertyKey));
        if(this.chart) {
            this.chart.setNoData(new sap.m.Label({
                text : this.getView().getModel("i18n").getProperty(sPropertyKey)
            }));
        }
    },
    fetchDataForChart : function() {
        var chartToolbarRef = this.getUIComponents().getChartToolbar();
        var VIEW = this.SELECTED_VIEW;
        var that = this;
        try {
            this.chartModel.setData({data:[]});
            chartToolbarRef.setBusy(true);
            var dimensions = [].concat(this.SELECTED_VIEW.getDimensions());
            dimensions.forEach(function(sDimensionName) {
                var oDimension = VIEW.findDimensionByName(sDimensionName);
                var sortByDimension = oDimension.getSortBy();
                if((dimensions.indexOf(sortByDimension) == -1)) {
                    if(oDimension.getSortOrder() == "asc" || oDimension.getSortOrder() == "desc") {
                        dimensions.push(sortByDimension);
                    }
                }
            });
            var measures = this.SELECTED_VIEW.getMeasures();
            var sortingToBeApplied = null;
            if(this.TABLE_SORTING && this.TABLE_SORTING.length) {
                sortingToBeApplied = this.TABLE_SORTING;
            } else if(this.COLUMNS_SORT && this.COLUMNS_SORT.length) {
                sortingToBeApplied = this.COLUMNS_SORT;
            }
            var dataLimit = null;
            try {
                var iDataLimit = window.parseInt(this.SELECTED_VIEW.getChartConfiguration()[0].getDataLimit());
                if(isNaN(iDataLimit)) {
                    jQuery.sap.log.error("Invalid Data Limit Value : "+dataLimit);
                } else {
                    if(iDataLimit!=-1) {
                        dataLimit = iDataLimit;
                    }
                }
            }catch(e) {
                jQuery.sap.log.error("Error parsing Data Limit Value")
            }
            var oUriObject = sap.suite.smartbusiness.odata.getUri({
                serviceUri : this.urlParsingService.addSystemToServiceUrl(this.EVALUATION.getODataUrl(), this.SAP_SYSTEM),
                entitySet : this.EVALUATION.getEntitySet(),
                dimension : dimensions,
                measure : measures,
                filter : this.getAllFilters(),
                sort : sortingToBeApplied,
                dataLimit : dataLimit
            });
            //Set NoData Text for Chart and Table
            this._setNoDataText("DATA_LOADING");
            var startTimeChartDataFetch = new Date().getTime();
            this.CHART_TABLE_DATA_ODATA_CALL_REF = oUriObject.model.read(oUriObject.uri, null, null, true, function(data) {
                var endTimeChartDataFetch = new Date().getTime();
                that._requestTimeLog["CHART_TABLE_DATA"] = {
                        title : "Chart/Table Data",
                        time : endTimeChartDataFetch - startTimeChartDataFetch
                };
                if(data.results.length === 0) {
                    that._setNoDataText("DATA_NODATA");
                }
                that.chartModel.setData({data:data.results});
                chartToolbarRef.setBusy(false);
                if(that.getUIComponents().getChart()) {
                    var popoverFormatter=that.getChartPopoverFormatter();
                    that.getUIComponents().getChart().setPopoverFormatter(popoverFormatter);
                }
                if(data.results.length) {
                    that._appendUOMToTableHeader(data.results[0]);
                    that._appendUOMToChartAxis(data.results[0]);
                }
            }, function() {
                jQuery.sap.log.error("Error fetching data : "+oUriObject.uri);
                that._setNoDataText("DATA_LOADING_FAILED");
                that.chartModel.setData({data:[]});
                chartToolbarRef.setBusy(false);
                that.chartModel.setData({data:[]});
            });
        } catch(e) {
            that._setNoDataText("DATA_LOADING_FAILED");
            jQuery.sap.log.error(e);
            chartToolbarRef.setBusy(false);
            this.chartModel.setData({data:[]});
        }
    },
    _getTableContextParameters : function(dimensionsArray) {
        var extraFilters = {};
        var tableSelectedContext =  this.getUIComponents().getTable().getSelectedContext();
        if(tableSelectedContext && tableSelectedContext.length) {
            tableSelectedContext.forEach(function(eachContext) {
                dimensionsArray.forEach(function(eachDimension){
                    var dimensionValue = eachContext[eachDimension];
                    if(dimensionValue) {
                        if(dimensionValue.getTime) {
                            dimensionValue = dimensionValue.getTime();
                        }
                        if(extraFilters[eachDimension]) {
                            extraFilters[eachDimension].push(dimensionValue);
                        } else {
                            extraFilters[eachDimension] = [];
                            extraFilters[eachDimension].push(dimensionValue);
                        }
                    }
                 });
            });
        }
        return extraFilters;
    },
    _getChartContextParameters : function(dimensionsArray) {
        var extraFilters, chartContexts;
        chartContexts = this.getChartSelectionContextObject();
        extraFilters = {};
        if(chartContexts) {
            var dataSet = this.getUIComponents().getChart().getDataset();
            for(var each in chartContexts) {
                var context = chartContexts[each];
                var cObject = dataSet.findContext(context).getObject();
                dimensionsArray.forEach(function(eachDimension){
                   var dimensionValue = cObject[eachDimension];
                   if(dimensionValue) {
                       if(dimensionValue.getTime) {
                           dimensionValue = dimensionValue.getTime();
                       }
                       if(extraFilters[eachDimension]) {
                           extraFilters[eachDimension].push(dimensionValue);
                       } else {
                           extraFilters[eachDimension] = [];
                           extraFilters[eachDimension].push(dimensionValue);
                       }
                   }
                });
            }
        }
        return extraFilters;
    },
    _onViewSelection : function(customParam, oEvent) {
        var viewId = oEvent.getSource().getCustomData()[0].getKey();
        var parameters = sap.suite.smartbusiness.url.hash.getApplicationParameters();
        parameters["viewId"] = viewId;
        sap.suite.smartbusiness.url.hash.setApplicationParameters(parameters, false);
        var extraFilters = {};
        var dimensionsArray = this.SELECTED_VIEW.getDimensions();
        if(customParam.isTable) {
            extraFilters = this._getTableContextParameters(dimensionsArray);
            sap.suite.smartbusiness.url.hash.updateApplicationParameters(extraFilters, false);
            this.getUIComponents().getTable().setSelectedContext(null);
        } else {
            extraFilters = this._getChartContextParameters(dimensionsArray);
            sap.suite.smartbusiness.url.hash.updateApplicationParameters(extraFilters, false);
            this.setChartSelectionContextObject(null);
        }
        sap.suite.smartbusiness.url.hash.updateHash();
        this._hideOrShowFacetFilterIfRequired();
    },
    getChartSelectionContextObject : function() {
        return this._chartPopoverContext;  
    },
    setChartSelectionContextObject : function(oValue) {
        this._chartPopoverContext = oValue;
    },
    _detachHashChangeListener : function() {
        try {
            this.hashChanger.detachEvent("hashChanged", this._proxyHashChangeListener); 
            this._proxyHashChangeListener = null;
        } catch(e) {
            jQuery.sap.log.error("Error Detaching hashChanged Event");
        }
    },
    _onAppSelection : function(customParam, oEvent) {
        var extraFilters, navId = oEvent.getSource().getCustomData()[0].getKey();
        var soAction = navId.split("~")[0];
        var splits = soAction.split("-");
        var so = splits[0];
        var action = splits[1];
        var appParameters = sap.suite.smartbusiness.url.hash.getApplicationParameters(["viewId"]);
        if(so == "AdhocAnalysis") {
        	appParameters = sap.suite.smartbusiness.url.hash.getApplicationParameters();
        }
        sap.suite.smartbusiness.url.hash.setSemanticObject(so, false);
        sap.suite.smartbusiness.url.hash.setAction(action, false);
        sap.suite.smartbusiness.url.hash.setApplicationParameters(null, false);
        sap.suite.smartbusiness.url.hash.updateStartupParameters(appParameters, false);
        var dimensionsArray = this.SELECTED_VIEW.getDimensions();
        if(customParam.isFromOpenIn) {
            //Navigation Link Clicked from OpenIn
            extraFilters = this._getTableContextParameters(dimensionsArray);
            sap.suite.smartbusiness.url.hash.updateStartupParameters(extraFilters, false);
            extraFilters = this._getChartContextParameters(dimensionsArray);
            sap.suite.smartbusiness.url.hash.updateStartupParameters(extraFilters, false);
        } else {
            if(customParam.isTable) {
                extraFilters = this._getTableContextParameters(dimensionsArray);
                sap.suite.smartbusiness.url.hash.updateStartupParameters(extraFilters, false);
                //Navigation Link Clicked from Table Popover
            } else {
                extraFilters = this._getChartContextParameters(dimensionsArray);
                sap.suite.smartbusiness.url.hash.updateStartupParameters(extraFilters, false);
                //Navigation Link Clicked From Chart Popover
            }
        }
        this._detachHashChangeListener();
        sap.suite.smartbusiness.url.hash.updateHash();
    },
    _fillChartTablePopoverContent : function() {
        var aViews = this._getListOfViewsForPopover(this.CONFIGURATION.getAllViews(), this.SELECTED_VIEW.getId());
        this.POPOVER_VIEW_NAVIGATION_MODEL.setData({
            VIEW_NAVIGATION : aViews
        });
        this.POPOVER_EXTERNAL_APP_NAVIGATION_MODEL.setData({
            APP_NAVIGATION : []
        });
        if(this._popoverNavigationListReferences && this._popoverNavigationListReferences.length) {
            this._popoverNavigationListReferences.forEach(function(oNavigationList) {
                oNavigationList.setNoDataText(" ");
                oNavigationList.setBusy(true);
            }, this);
        }
        this.SEMANTIC_OBJECT_BY_CONTEXT_LINKS_ODATA_CALL_REF = sap.suite.smartbusiness.navigation.getLinksByContext({
            semanticObject : this.SEMANTIC_OBJECT,
            dimensions : this.SELECTED_VIEW.getDimensions(),
            context : this,
            viewId : this.EVALUATION.getId() + "_" + this.SELECTED_VIEW.getId(),
            success : function(links) {
                var OPEN_IN_LINKS = jQuery.extend({}, this._OPEN_IN_LINKS);
                var uniqueLinks = this._getUniqueNavLinks(links, OPEN_IN_LINKS);
                if(uniqueLinks.length) {
                    this.POPOVER_EXTERNAL_APP_NAVIGATION_MODEL.setData({
                        APP_NAVIGATION : uniqueLinks
                    });
                }
                if(this._popoverNavigationListReferences && this._popoverNavigationListReferences.length) {
                    this._popoverNavigationListReferences.forEach(function(oNavigationList) {
                        oNavigationList.setBusy(false);
                        oNavigationList.setNoDataText("-");
                    }, this);
                }
            }
        });
    },    
    _getListOfViewsForPopover : function(allViews, excludeThisViewId) {
        var array = [];
        allViews.forEach(function(view){
            if(view.ID !== excludeThisViewId) {
                array.push(jQuery.extend(false, {}, view));
            }
        });
        return array;
    },
    _onTableRowSelected : function() {
        this._fillChartTablePopoverContent();
    },
    _onChartDataPointSelection : function(oEvent) {
        var srcEvent = oEvent.getParameter("srcEvent");
        var contextPath = srcEvent.getParameter("data")[0].data[0].ctx.path;
        this._chartPopoverContext = this._chartPopoverContext || {};
        var generateUniqueKey = function(ctxPath) {
            var keys = Object.keys(ctxPath).sort();
            var str="";
            keys.forEach(function(k) {
                str+= k+"#"+ctxPath[k]+"#";
            }); 
            return str;
        };
        var _key = generateUniqueKey(contextPath);
        if(this._chartPopoverContext[_key]) {
            delete this._chartPopoverContext[_key];
        } else {
            this._chartPopoverContext[_key] = contextPath;
        }
        if(this._chartPopoverContext) {
            var _length = Object.keys(this._chartPopoverContext).length;
            if(_length !== this.chart.getInternalVizChart().getVIZInstance().selection().length) {
                this._chartPopoverContext = {};
                this._chartPopoverContext[_key] = contextPath;
            }    
            
        }
        if(this.chart.getInternalVizChart().getVIZInstance().selection().length == 0) {
            this._chartPopoverContext = {};
        }
        this._fillChartTablePopoverContent();
    },
    _getStacking : function(chartColumns) {
        var stacking = {
                stacking : false,
                dimensionStacked : false,
                measureStacked : false,
                stackedDimensionName : null
        };
        var currentView  = this.SELECTED_VIEW;
        chartColumns.forEach(function(eachColumn) {
            var oColumn = currentView.findColumnByName(eachColumn);
            if(oColumn.isMeasure()) {
                if(oColumn.isStacked()) {
                    stacking.stacking = true;
                    stacking.measureStacked = true;
                    return false;
                }
            }
        });
        if(!stacking.stacking) {
            chartColumns.forEach(function(eachColumn) {
                var oColumn = currentView.findColumnByName(eachColumn);
                if(oColumn.isDimension()) {
                    if(oColumn.isStacked()) {
                        stacking.stacking = true;
                        stacking.dimensionStacked = true;
                        if(oColumn.getAxis() == 2) {
                            stacking.stackedDimensionName = oColumn.getName()
                            return false;
                        }
                    }
                }
            });
        }
        return stacking;
    },
    _getEvaluationThresholdMeasures : function(){
        var thresholdMeasuresArray = [];
        thresholdMeasuresArray.push(this.EVALUATION.getKpiMeasureName());
        if(this.EVALUATION.getThresholdValueType() === "MEASURE") {
            var thresholdObjArray = this.EVALUATION.getValues().results ;
            if(thresholdObjArray && thresholdObjArray.length) {
                for(var i=0;i<thresholdObjArray.length;i++) {
                    if((thresholdObjArray[i]).COLUMN_NAME && !((thresholdObjArray[i]).FIXED)) {
                        thresholdMeasuresArray.push((thresholdObjArray[i]).COLUMN_NAME);
                    }
                }
            }
        }
        return thresholdMeasuresArray;
    },
    _addDimensionAndMeasureToDataset : function(oChart, oDataset, oChartConfig, aColumns) {
        this.thresholdMeasuresArray = this._getEvaluationThresholdMeasures();
        var oStacking = this._getStacking(aColumns);
        var VIEW = this.SELECTED_VIEW;
        //Adding Dimension to DataSet
        var oChartType = oChartConfig.getChartType();
        if((oChartType.isBar() || oChartType.isColumn()) && oStacking.dimensionStacked) {
            aColumns.forEach(function(sColumn) {
                var oColumn = VIEW.findColumnByName(sColumn);
                if(oColumn.isDimension()) {
                    var iAxis = 1;
                    if(oColumn.getName() == oStacking.stackedDimensionName && VIEW.getDimensionCount() > 1) {
                        iAxis = 2;
                        oChart.setStackedChartWidthEnhancer(true);
                    }
                    var oDimensionDefinition = new sap.viz.ui5.data.DimensionDefinition({
                        name : this.COLUMN_LABEL_MAPPING[oColumn.getName()],
                        axis : iAxis,
                        value : {
                            path : this.DIMENSION_TEXT_PROPERTY_MAPPING[oColumn.getName()],
                            formatter : this.getColumnValueFormatter(this.DIMENSION_TEXT_PROPERTY_MAPPING[oColumn.getName()], true)
                        }
                    });
                    oDimensionDefinition.column_name = oColumn.getName();
                    oDataset.addDimension(oDimensionDefinition);
                }
            }, this);
        } else {
            aColumns.forEach(function(sColumn) {
                var oColumn = VIEW.findColumnByName(sColumn);
                if(oColumn.isDimension()) {
                    var oDimensionDefinition = new sap.viz.ui5.data.DimensionDefinition({
                        name : this.COLUMN_LABEL_MAPPING[oColumn.getName()],
                        axis : 1,
                        value : {
                            path : this.DIMENSION_TEXT_PROPERTY_MAPPING[oColumn.getName()],
                            formatter : this.getColumnValueFormatter(this.DIMENSION_TEXT_PROPERTY_MAPPING[oColumn.getName()], true)
                        }
                    });
                    oDimensionDefinition.column_name = oColumn.getName();
                    oDataset.addDimension(oDimensionDefinition);
                }
            }, this);
        } 
        
        //Adding Measure to Dataset
        if(oChartType.isLine() || oChartType.isCombination()) {
            aColumns.forEach(function(sColumn) {
                var oColumn = VIEW.findColumnByName(sColumn);
                if(oColumn.isMeasure()) {
                    var oMeasureDefinition = new sap.viz.ui5.data.MeasureDefinition({
                        name : this.COLUMN_LABEL_MAPPING[oColumn.getName()],
                        value : {
                            path : oColumn.getName()
                        }
                    });
                    oMeasureDefinition.column_name = oColumn.getName();
                    oDataset.addMeasure(oMeasureDefinition);
                }
            }, this);
        } else if(oChartType.isBubble()) {
            var _index = 0;
            aColumns.forEach(function(sColumn, index) {
                var oColumn = VIEW.findColumnByName(sColumn);
                if(oColumn.isMeasure()) {
                    ++_index;
                    var oMeasureDefinition = new sap.viz.ui5.data.MeasureDefinition({
                        name : this.COLUMN_LABEL_MAPPING[oColumn.getName()],
                        group : _index,
                        value : {
                            path : oColumn.getName()
                        }
                    });
                    oMeasureDefinition.column_name = oColumn.getName();
                    oDataset.addMeasure(oMeasureDefinition);
                }
            }, this);
        } else if(oChartType.isBar() || oChartType.isColumn()) {
            if(oChartConfig.isSingleAxis()) {
                aColumns.forEach(function(sColumn) {
                    var oColumn = VIEW.findColumnByName(sColumn);
                    if(oColumn.isMeasure()) {
                        var oMeasureDefinition = new sap.viz.ui5.data.MeasureDefinition({
                            name : this.COLUMN_LABEL_MAPPING[oColumn.getName()],
                            value : {
                                path : oColumn.getName()
                            }
                        });
                        oMeasureDefinition.column_name = oColumn.getName();
                        oDataset.addMeasure(oMeasureDefinition);
                    }
                }, this);
            } else if(oChartConfig.isDualAxis()) {
                aColumns.forEach(function(sColumn) {
                    var oColumn = VIEW.findColumnByName(sColumn);
                    if(oColumn.isMeasure()) {
                        var oMeasureDefinition = new sap.viz.ui5.data.MeasureDefinition({
                            group : oColumn.getAxis(),
                            name : this.COLUMN_LABEL_MAPPING[oColumn.getName()],
                            value : {
                                path : oColumn.getName()
                            }
                        });
                        oMeasureDefinition.column_name = oColumn.getName();
                        oDataset.addMeasure(oMeasureDefinition);
                    }
                }, this);
            }
        }
    },
    _appendUOMToChartAxis : function(data) {
        var oChart, aMeasures, chartAdvancedSetting, UOMS, uomFlag, uomPropertyName, uomValue, chartConfig, chartType;
        var getUomAsString = function (oUoms) {
            var aUoms = [];
            for(var each in oUoms) {
                aUoms.push(oUoms[each]);
            }
            return aUoms.join(" & ");
        };
        var getAxisObject = function (sAxisLabel) {
            return {
                title : {
                    visible : true,
                    text : sAxisLabel
                }
            };
        }; 
        oChart = this.getUIComponents().getChart();
        if(!oChart) {
            return;
        }
        aMeasures = this.SELECTED_VIEW.getMeasures();
        chartAdvancedSetting = oChart.getAdvancedChartSettings() || {};
        UOMS = {};
        uomFlag = false;
        if(aMeasures.length == 1 && aMeasures[0] == this.EVALUATION.getKpiMeasureName()) {
            var sMeasure = aMeasures[0];
            uomPropertyName = this.MEASURE_UNIT_PROPERTY_MAPPING[sMeasure];
            if(uomPropertyName) {
                uomValue = data[uomPropertyName];
                if(uomValue) {
                    UOMS[sMeasure] = uomValue;
                    uomFlag = true;
                } else {
                    UOMS[sMeasure] = this.COLUMN_LABEL_MAPPING[sMeasure];
                }
            } else {
                UOMS[sMeasure] = this.COLUMN_LABEL_MAPPING[sMeasure];
            }
        } else {
            aMeasures.forEach(function(sMeasure) {
                uomPropertyName = this.MEASURE_UNIT_PROPERTY_MAPPING[sMeasure];
                if(uomPropertyName) {
                    uomValue = data[uomPropertyName];
                    if(uomValue) {
                        UOMS[sMeasure] = this.COLUMN_LABEL_MAPPING[sMeasure] +" ("+uomValue+")";
                        uomFlag = true;
                    } else {
                        UOMS[sMeasure] = this.COLUMN_LABEL_MAPPING[sMeasure];
                    }
                } else {
                    UOMS[sMeasure] = this.COLUMN_LABEL_MAPPING[sMeasure];
                }
            }, this);
        }
        chartConfig = this.SELECTED_VIEW.getChartConfiguration()[0];
        chartType = chartConfig.getChartType();
        if(uomFlag) {
            if(chartType.isColumn() || chartType.isBar()) {
//                if(chartConfig.isAbsoluteValue()) {
                    if(chartConfig.isSingleAxis()) {
                        if(chartType.isBar()) {
                            chartAdvancedSetting.xAxis = getAxisObject(getUomAsString(UOMS));
                        } else {
                            chartAdvancedSetting.yAxis = getAxisObject(getUomAsString(UOMS));
                        }
                    } else {
                        var x1Axis = {}, x2Axis = {};
                        aMeasures.forEach(function(sMeasure) {
                             var oMeasure = this.SELECTED_VIEW.findMeasureByName(sMeasure);
                             if(oMeasure.getAxis() == 1) {
                                 x1Axis[sMeasure] = UOMS[sMeasure];
                             } else if(oMeasure.getAxis() == 2) {
                                 x2Axis[sMeasure] = UOMS[sMeasure];
                             }
                        }, this);
                        if(chartType.isBar()) {
                            chartAdvancedSetting.xAxis = getAxisObject(getUomAsString(x2Axis));
                            chartAdvancedSetting.xAxis2 = getAxisObject(getUomAsString(x1Axis));
                        } else {
                            chartAdvancedSetting.yAxis = getAxisObject(getUomAsString(x1Axis));
                            chartAdvancedSetting.yAxis2 = getAxisObject(getUomAsString(x2Axis));
                        }
                    }
//                }
            } else if(chartType.isBubble()) {
                var aDatasetMeasures = oChart.getDataset().getMeasures();
                aDatasetMeasures.forEach(function(oDatasetMeasure) {
                    var sMeasureName = oDatasetMeasure.column_name;
                    var sLabel = UOMS[sMeasureName];
                    if(oDatasetMeasure.getGroup() == 1) {
                        chartAdvancedSetting.xAxis = getAxisObject(sLabel);
                    } else if(oDatasetMeasure.getGroup() == 2) {
                        chartAdvancedSetting.yAxis = getAxisObject(sLabel);
                    }
                }, this);
            } else if (chartType.isTable()){
                //Nothing to do
            } else {
                chartAdvancedSetting.yAxis = getAxisObject(getUomAsString(UOMS));
            }
        }
    },
    _updateAxisLabelIfRequired : function(oChart, oDataset, oChartConfig, aColumns) {
        var oChartType = oChartConfig.getChartType();
        var VIEW = this.SELECTED_VIEW;
        var chartAdvancedSetting = oChart.getAdvancedChartSettings() || {};
        var IN_PERCENTAGE_VALUE = "("+this.getView().getModel("i18n").getProperty("IN_PERCENTAGE")+")";
        var getAxisObject = function(sLabel) {
            return {
                    title : {
                        visible : true,
                        text : sLabel
                    }
            };
        };
        if(oChartConfig.isPercentageValue()) {
            if(oChartType.isBar() || oChartType.isColumn()) {
                var aMeasures = VIEW.getMeasures();
                if(oChartConfig.isSingleAxis()) {
                    var aMeasuresLabel = [];
                    aMeasures.forEach(function(sMeasure) {
                        aMeasuresLabel.push(this.COLUMN_LABEL_MAPPING[sMeasure]);
                    }, this);
                    var strMeasuresLabel = aMeasuresLabel.join(" & ") + IN_PERCENTAGE_VALUE;
                    if(oChartType.isColumn()) {
                        chartAdvancedSetting.yAxis = getAxisObject(strMeasuresLabel);
                    } else {
                        chartAdvancedSetting.xAxis = getAxisObject(strMeasuresLabel);
                    }
                } else {
                    var aFirstAxisMeasures = [];
                    var aSecondAxisMeasures = [];
                    aMeasures.forEach(function(sMeasure) {
                        var oColumn = VIEW.findMeasureByName(sMeasure);
                        if(oColumn.getAxis() == 1) {
                            aFirstAxisMeasures.push(this.COLUMN_LABEL_MAPPING[sMeasure]);
                        } else if(oColumn.getAxis() == 2) {
                            aSecondAxisMeasures.push(this.COLUMN_LABEL_MAPPING[sMeasure]);
                        }
                    }, this);
                    var strFirstAxisLabel = aFirstAxisMeasures.join(" & ")+IN_PERCENTAGE_VALUE;
                    var strSecondAxisLabel = aSecondAxisMeasures.join(" & ")+IN_PERCENTAGE_VALUE;
                    if(oChartType.isColumn()) {
                        chartAdvancedSetting.yAxis = getAxisObject(strFirstAxisLabel);
                        chartAdvancedSetting.yAxis2 = getAxisObject(strSecondAxisLabel);
                    } else {
                        chartAdvancedSetting.xAxis2 = getAxisObject(strFirstAxisLabel);
                        chartAdvancedSetting.xAxis = getAxisObject(strSecondAxisLabel);
                    }
                }
            }
        }
    },
    renderChart: function(viewConfiguration, chartConfig, chartColumns) {
        var chart = this.getUIComponents().getChart();
        chart.attachSelectDataPoint(jQuery.proxy(this._onChartDataPointSelection, this));      
        if(!chartConfig || !chartColumns.length)
            return;
        var dataSet = new sap.viz.core.FlattenedDataset({
           data : {
               path : "/data"
           }
        });
        chart.setStackedChartWidthEnhancer(false);
        this._addDimensionAndMeasureToDataset(chart, dataSet, chartConfig, chartColumns);
        //this._updateAxisLabelIfRequired(chart, dataSet, chartConfig, chartColumns);
        chart.setChartType(this.getCAChartType(chartConfig, viewConfiguration));
        chart.setDataset(dataSet);
        this.setChartLabelFormatters(chart, chartConfig, this.SELECTED_VIEW);
        this._overrideChartAxisLabelFormatters(chart, chartConfig);
        if((this.EVALUATION.getScaling() == -2) && (chartConfig.isDualAxis()) && (chartConfig.isAbsoluteValue()) && (chartConfig.getChartType().isBar() || chartConfig.getChartType().isColumn())) {
        	this._handleDualAxisWhenPercentScale(chart,chartConfig.getChartType());
        }
        this.applyColorToChart(chart, chartConfig);
        this._showChartLegendIfApplicable(chartConfig,chartColumns);
    },
    _showChartLegendIfApplicable : function(oChartConfig, aColumns) {
        var otoolbar = this.getUIComponents().getChartToolbar() ;
        var oStacking = this._getStacking(aColumns);
        var VIEW = this.SELECTED_VIEW;
        var oChartType = oChartConfig.getChartType();
        var isStackApplied = ((oChartType.isBar() || oChartType.isColumn()) && oStacking.dimensionStacked && oStacking.stackedDimensionName && (VIEW.getDimensionCount() > 1)) ? true : false ;        
        
        if((VIEW.getMeasures().length > 1) || (isStackApplied)) {             //  || ((VIEW.getMeasures()).indexOf(this.EVALUATION.getKpiMeasureName()) == -1)
        	otoolbar.setShowLegend(true);
        } else {
        	otoolbar.setShowLegend(false);
        }
    },
    _overrideChartAxisLabelFormatters : function(oChart, oChartConfig) {
    	var locale=new sap.ui.core.Locale(sap.ui.getCore().getConfiguration().getLanguage());
    	var percentFormatter = sap.ca.ui.model.format.NumberFormat.getInstance({},locale);
        if(oChartConfig.isPercentageValue()) {
            var oChartType =  oChartConfig.getChartType();
            if(oChartType.isBar()) {
                oChart.setXAxisLabelFormatter(function(rawValue){return percentFormatter.format_percentage(rawValue);});
                oChart.setYAxisLabelFormatter(function(rawValue){return rawValue;});
                if(oChartConfig.isDualAxis()) {
                    oChart.setXAxis2LabelFormatter(function(rawValue){return percentFormatter.format_percentage(rawValue);});
                }
            } else if(oChartType.isColumn()) {
                oChart.setYAxisLabelFormatter(function(rawValue){return percentFormatter.format_percentage(rawValue);});
                oChart.setXAxisLabelFormatter(function(rawValue){return rawValue;});
                if(oChartConfig.isDualAxis()) {
                    oChart.setYAxis2LabelFormatter(function(rawValue){return percentFormatter.format_percentage(rawValue);});
                }
            }
        }
    },
    _handleDualAxisWhenPercentScale: function(chart,chartType) {
    	var that = this;
    	var VIEW = this.SELECTED_VIEW;
    	var measures = VIEW.getMeasures() ;
    	var axisMeasures = this._getMeasuresByAxis();
    	var isAxis1Scaled = this._isMeasureSetPercentScaled(axisMeasures.axis1Msr);
    	var isAxis2Scaled = this._isMeasureSetPercentScaled(axisMeasures.axis2Msr);
    	    	
    	// chart label
    	var labelFormatter = [[],[]];
    	if(isAxis1Scaled)
    		labelFormatter[0].push(that._getChartPercentFormatter());
    	else
    		labelFormatter[0].push(that._getChartNumberFormatter());
    	if(isAxis2Scaled)
    		labelFormatter[1].push(that._getChartPercentFormatter());
    	else
    		labelFormatter[1].push(that._getChartNumberFormatter());    	
    	chart.setDataLabelFormatter(labelFormatter);
    	
    	// chart axis
    	if(chartType.isBar()) {
	    	chart.setXAxisLabelFormatter(isAxis1Scaled?that._getChartPercentFormatter():that._getChartNumberFormatter());
			chart.setYAxisLabelFormatter(that._pseudoChartFormatter);
	    	chart.setXAxis2LabelFormatter(isAxis2Scaled?that._getChartPercentFormatter():that._getChartNumberFormatter());
			chart.setYAxis2LabelFormatter(that._pseudoChartFormatter); 
    	} else if(chartType.isColumn()) {
    		chart.setXAxisLabelFormatter(that._pseudoChartFormatter);
			chart.setYAxisLabelFormatter(isAxis1Scaled?that._getChartPercentFormatter():that._getChartNumberFormatter());
	    	chart.setXAxis2LabelFormatter(that._pseudoChartFormatter);
			chart.setYAxis2LabelFormatter(isAxis2Scaled?that._getChartPercentFormatter():that._getChartNumberFormatter());
    	}
    	
    	// chart popover
    	// --------------- implemented in getChartPopoverFormatter() function . -------------------------
    },
    _isEvaluationThresholdMeasure: function(oMsr) {
    	if(this.thresholdMeasuresArray && this.thresholdMeasuresArray.length) {
    		var thresholdMsrsArray = this.thresholdMeasuresArray;
    	} else {
    		var thresholdMsrsArray = this._getEvaluationThresholdMeasures();
    	}
    	if(thresholdMsrsArray && thresholdMsrsArray.length) {
			if(thresholdMsrsArray.indexOf(oMsr) != -1) {
					return true;					
			} 
		}
    	return false;
    },
    _getMeasuresByAxis: function() {
    	var that = this;
    	var VIEW = this.SELECTED_VIEW;
    	var measures = VIEW.getMeasures() ;
    	var axis1Msrs = [], axis2Msrs = [] ;
    	for(var i=0;i<measures.length;i++) {
    		var oColumn = VIEW.findColumnByName(measures[i]);
    		if(oColumn.isMeasure() && (oColumn.getAxis() == 1)) {
    			axis1Msrs.push(measures[i]);
    		} else if(oColumn.isMeasure() && (oColumn.getAxis() == 2)) {
    			axis2Msrs.push(measures[i]);
    		}
    	}
    	return {
    				axis1Msr:axis1Msrs,
    				axis2Msr:axis2Msrs 
    			}
    },
    _isMeasureSetPercentScaled: function(oMsrs) {
    	if(this.thresholdMeasuresArray && this.thresholdMeasuresArray.length) {
    		var thresholdMsrsArray = this.thresholdMeasuresArray;
    	} else {
    		var thresholdMsrsArray = this._getEvaluationThresholdMeasures();
    	}
    	if(thresholdMsrsArray && thresholdMsrsArray.length && oMsrs && oMsrs.length) {
    		for(var i=0;i<oMsrs.length;i++) {
				if(thresholdMsrsArray.indexOf(oMsrs[i]) != -1) {
						return true;					
				} 
    		}
		}
    	return false;
    },
    setChartLabelFormatters:function(chart,o,v){		
		var isPercentScaled = this._isMeasureSetPercentScaled(this.SELECTED_VIEW.getMeasures());
						
		if((this.EVALUATION.getScaling() == -2) && !((o.isPercentageValue()) && (o.getChartType().isBar() || o.getChartType().isColumn())) && isPercentScaled) {
			var formatter=this.getChartLabelFormatter(o,v,true);
	    	chart.setXAxisLabelFormatter(formatter.x1);
			chart.setYAxisLabelFormatter(formatter.y1);
	    	chart.setXAxis2LabelFormatter(formatter.x2);
			chart.setYAxis2LabelFormatter(formatter.y2);
			chart.setDataLabelFormatter(formatter.dataLabel);
		} else {
			var formatter=this.getChartLabelFormatter(o,v);
	    	chart.setXAxisLabelFormatter(formatter.x1);
			chart.setYAxisLabelFormatter(formatter.y1);
	    	chart.setXAxis2LabelFormatter(formatter.x2);
			chart.setYAxis2LabelFormatter(formatter.y2);
			chart.setDataLabelFormatter(formatter.dataLabel);
		}
    },
    _pseudoChartFormatter:function(s){
    	return s;
    },
    _getChartNumberFormatter:function(isStandard){
		var locale=new sap.ui.core.Locale(sap.ui.getCore().getConfiguration().getLanguage());
		function isNumber(n) {
			return !isNaN(parseFloat(n)) && isFinite(n);
		}
		var formatterConstructor={style:isStandard?'standard':'short'};
		//if(dec||dec==0){formatterConstructor["shortDecimals"]=dec;}
		var chartFormatter=sap.ca.ui.model.format.NumberFormat.getInstance(formatterConstructor,locale);
		return function(s){
			return isNumber(s)?chartFormatter.format(s):s;
		};
    },
    _getChartPercentFormatter:function(isStandard){
		var locale=new sap.ui.core.Locale(sap.ui.getCore().getConfiguration().getLanguage());
		function isNumber(n) {
			return !isNaN(parseFloat(n)) && isFinite(n);
		}
		var formatterConstructor={style:isStandard?'standard':'short'};
		//if(dec||dec==0){formatterConstructor["shortDecimals"]=dec;}
		var chartFormatter=sap.ca.ui.model.format.NumberFormat.getInstance(formatterConstructor,locale);
		return function(s){
			return isNumber(s)?chartFormatter.format_percentage(s):s;
		};
    },
    getChartLabelFormatter:function(oChartConfig,viewConfig,isPercentScaled){
    	jQuery.sap.require("sap.ca.ui.model.format.NumberFormat");
    	if(isPercentScaled) {
    		var formatter={ x1:this._pseudoChartFormatter,
    				y1:this._getChartPercentFormatter(),
    				x2:this._pseudoChartFormatter,
    				y2:this._pseudoChartFormatter,
    				dataLabel:[[this._getChartPercentFormatter()],[this._getChartPercentFormatter()],[this._getChartPercentFormatter()]]
			};
    	} else {
    		var formatter={ x1:this._pseudoChartFormatter,
		    				y1:this._getChartNumberFormatter(),
		    				x2:this._pseudoChartFormatter,
		    				y2:this._pseudoChartFormatter,
		    				dataLabel:[[this._getChartNumberFormatter()]]
    				};
    	}
    	if(oChartConfig.getChartType().isBubble()||(oChartConfig.getChartType().isBar()&& oChartConfig.isAbsoluteValue())){
    		if(isPercentScaled)
    			formatter.x1=this._getChartPercentFormatter();
    		else
    			formatter.x1=this._getChartNumberFormatter();
    	}
    	if(oChartConfig.getChartType().isBar()||(oChartConfig.getChartType().isColumn()&& oChartConfig.isStackingEnabled(viewConfig) && oChartConfig.isPercentageValue())){
    		formatter.y1=this._pseudoChartFormatter;
    	}
    	if(oChartConfig.getChartType().isBar() && oChartConfig.isDualAxis() && oChartConfig.isStackingEnabled(viewConfig)){
    		if(isPercentScaled)
    			formatter.x2=this._getChartPercentFormatter();
    		else
    			formatter.x2=this._getChartNumberFormatter();
    	}
    	if(oChartConfig.getChartType().isColumn() && oChartConfig.isStackingEnabled(viewConfig) && oChartConfig.isDualAxis()){
    		if(isPercentScaled)
    			formatter.y2=this._getChartPercentFormatter();
    		else
    			formatter.y2=this._getChartNumberFormatter();
    	}	
    	return formatter;
    },
    getColumnValueFormatter:function(sName,bIsDimension,isPercentScaled,axisScaled){
    	var that = this;
    	var VIEW = this.SELECTED_VIEW;    	
    	var oConfig = (VIEW.getChartConfiguration())[0];
    	var formatter;
    	if(bIsDimension){
    		formatter=function (s) {return s==0?s+"":s;}
    	}else{
    		if(isPercentScaled) {
    			if(oConfig.getChartType().isTable()) {
    				if(that._isEvaluationThresholdMeasure(sName))
    					formatter=this._getChartPercentFormatter(true);
    				else
    					formatter=this._getChartNumberFormatter(true);
    			} else if((oConfig.isDualAxis()) && (oConfig.isAbsoluteValue()) && (oConfig.getChartType().isBar() || oConfig.getChartType().isColumn())) {
    				var oColumn = VIEW.findColumnByName(sName);
    				if(axisScaled[(oColumn.getAxis())-1])
    					formatter=this._getChartPercentFormatter(true);
    				else
    					formatter=this._getChartNumberFormatter(true);
    			} else {
    				formatter=this._getChartPercentFormatter(true);
    			}
    		}
    		else	
    			formatter=this._getChartNumberFormatter(true);
    	}
    	var sUri =this.urlParsingService.addSystemToServiceUrl(this.EVALUATION.getODataUrl(), this.SAP_SYSTEM);
    	var oMetaData=sap.suite.smartbusiness.odata.getEdmType(sUri,sName,true);
    	var sType=oMetaData.type;
    	var sFormat=oMetaData.format;
    	sFormat = sFormat.toUpperCase();
    	if(sType=='Edm.DateTime'){
    		if(!sap.suite.smartbusiness.odata.isTimeZoneIndependent(sUri,this.EVALUATION.getEntitySet())){
        		var style;
        		if(sFormat=="DATE"){
        			style="daysAgo";
        		}else if(sFormat=="DATETIME"){
        			style="short";
        		}else if(sFormat=="NONE"){
        			style="daysAgo";
        		}
        		if(style){
    				var oF=new sap.ca.ui.model.type.Date({
    					style: style
    				});
    				formatter=function(s){
    					return oF.formatValue(s,"string");
    				}
        		}
    		}else{
        		formatter=function(ts){
        			if(ts && ts.getMinutes){
            			ts.setMinutes( ts.getMinutes() + ts.getTimezoneOffset());
            			var instanceType=(sFormat=="DATE")?"getDateInstance":"getDateTimeInstance";
            			return sap.ui.core.format.DateFormat[instanceType]().format(ts);
        			}
        			return ts;
        		}
    		}
    	}
    	return formatter;
	},
    getChartPopoverFormatter:function(){
    	var oChartConfig= this.SELECTED_VIEW.getChartConfiguration()[0];
		var formatterArray=[[],[],[]] ;
		var that=this;
		var VIEW = this.SELECTED_VIEW;
		var measures=this.SELECTED_VIEW.getMeasures();
        var uom = this.MEASURE_UNIT_PROPERTY_MAPPING;
        var oChartType = oChartConfig.getChartType() ;
		var locale=new sap.ui.core.Locale(sap.ui.getCore().getConfiguration().getLanguage());
		var chartPopoverFormatter = sap.ca.ui.model.format.NumberFormat.getInstance({
			style: 'Standard'
		},locale);
		
		var isPercentScaled = this._isMeasureSetPercentScaled(measures);
		
		function _getFormatter(sMeasure) {
			return function(val) {
			    var unit = "";
				var data=that.getUIComponents().getChart().getModel().getData().data;
				if(data && data.length) {
	                unit=(data && data[0])?data[0][uom[sMeasure]]?" "+data[0][uom[sMeasure]]:"":"";
	                data[0][uom[sMeasure]]
				}
                return chartPopoverFormatter.format_standard(val)+unit ;
			} 
		}
		function _getPercentFormatter(sMeasure) {
			return function(val) {
			    return chartPopoverFormatter.format_percentage(val) ;
			} 
		}
		
		if(oChartConfig.isPercentageValue()){
			for(var k=0;k<measures.length;k++){
				formatterArray[0].push(function(val) {
					return chartPopoverFormatter.format_percentage(val) ;
				});
				formatterArray[1].push(function(val) {
					return chartPopoverFormatter.format_percentage(val) ;
				});
			}
		}else{
			if(this.EVALUATION.getScaling() == -2 && isPercentScaled) {
				if((oChartConfig.isDualAxis()) && (oChartConfig.isAbsoluteValue()) && (oChartConfig.getChartType().isBar() || oChartConfig.getChartType().isColumn())) {
					var axisMeasures = this._getMeasuresByAxis();
			    	var isAxis1Scaled = this._isMeasureSetPercentScaled(axisMeasures.axis1Msr);
			    	var isAxis2Scaled = this._isMeasureSetPercentScaled(axisMeasures.axis2Msr);
			    	if(isAxis1Scaled) {
			    		for(var k=0;k<axisMeasures.axis1Msr.length;k++){
							formatterArray[0].push(_getPercentFormatter((axisMeasures.axis1Msr)[k]));
						}
			    	} else {
			    		for(var k=0;k<axisMeasures.axis1Msr.length;k++){
							formatterArray[0].push(_getFormatter((axisMeasures.axis1Msr)[k]));
						}
			    	}
			    	if(isAxis2Scaled) {
			    		for(var k=0;k<axisMeasures.axis2Msr.length;k++){
							formatterArray[1].push(_getPercentFormatter((axisMeasures.axis2Msr)[k]));
						}
			    	} else {
			    		for(var k=0;k<axisMeasures.axis2Msr.length;k++){
							formatterArray[1].push(_getFormatter((axisMeasures.axis2Msr)[k]));
						}
			    	}
			    	
				} else {
					for(var k=0;k<measures.length;k++){
						formatterArray[0].push(_getPercentFormatter(measures[k]));
						formatterArray[1].push(_getPercentFormatter(measures[k]));
						formatterArray[2].push(_getPercentFormatter(measures[k]));
					}
				}
			}
			else {
				for(var k=0;k<measures.length;k++){
					formatterArray[0].push(_getFormatter(measures[k]));
					formatterArray[1].push(_getFormatter(measures[k]));
				}
			}
		}
		return formatterArray;

	
    },
    applyColorToChart : function(chart, chartConfig) {
        var thresholdMeasure = chartConfig.getThresholdMeasure();
        var oController = this;
        var colorScheme = chartConfig.getColorScheme();
        if(!colorScheme.getText()) {
            JQuery.sap.log.error("Color Scheme Value Missing");
            return;
        }
        var measures = chart.getDataset().getMeasures();
        if(colorScheme.isManual()) {
            measures.forEach(function(oMeasure, index, oMeasures) {
                var _color = this.SELECTED_VIEW.findMeasureByName(oMeasure.column_name).getColor();
                if(!_color) {
                    if(colorScheme.isManualSemantic()) {
                        jQuery.sap.log.warning("Semantic Color NOT found for measure name : " + oMeasure.getName() +", assigning default to 'Neutral Light'");
                        _color= "sapCaUiChartSemanticColor-Neutral-Light";
                    } else {
                        jQuery.sap.log.warning("Color NOT found for measure name : " + oMeasure.getName() +", assigning default color");
                        _color = "";
                    }
                }
                oMeasure.addCustomData(new sap.ui.core.CustomData({
                    key : "fillColor",
                    value : _color
                }));
            }, this);
        } else if(colorScheme.isAutoSemantic() && !this.EVALUATION.isTargetKpi()) {
            if(thresholdMeasure) {
                measures.forEach(function(oMeasure, index, oMeasures) {
                    if(oMeasure.getName() ==  thresholdMeasure) {
                        oMeasure.addCustomData(new sap.ui.core.CustomData({
                            key : "fillColor",
                            value : sap.ca.ui.charts.ChartSemanticColor.Neutral
                        }));
                    } else {
                        oMeasure.addCustomData(new sap.ui.core.CustomData({
                            key : "fillColor",
                            value : sap.ca.ui.charts.ChartSemanticColor.Good
                        }));
                    }
                
                }, this);
                chart.setChartSemanticColorFormatter(function(oContext) {
                    var data = chart.getModel().getData().data;
                    var bindingContext = oContext.ctx.path.dii_a1;
                    var bindingData = data[bindingContext];
                    var referenceMeasureValue = bindingData[thresholdMeasure];
                    if(referenceMeasureValue!=null && typeof referenceMeasureValue!='undefined') {
                        if(oController.EVALUATION.isTargetKpi()) {
                            if(oContext.val == referenceMeasureValue) {
                                return sap.ca.ui.charts.ChartSemanticColor.Neutral;
                            }
                            return sap.ca.ui.charts.ChartSemanticColor.NeutralLight;
                        } else {
                            if(oContext.val > referenceMeasureValue) {
                                if(oController.EVALUATION.isMaximizingKpi()) {
                                    return sap.ca.ui.charts.ChartSemanticColor.Good;
                                }
                                return sap.ca.ui.charts.ChartSemanticColor.Bad;
                            } else if(oContext.val < referenceMeasureValue) {
                                if(oController.EVALUATION.isMinimizingKpi()) {
                                    return sap.ca.ui.charts.ChartSemanticColor.Good
                                }
                                return sap.ca.ui.charts.ChartSemanticColor.Bad;
                            } else {
                                return sap.ca.ui.charts.ChartSemanticColor.Neutral;
                            }
                        }
                    } else {
                        jQuery.sap.log.error("Threshold Measure:'"+thresholdMeasure+"'  not in Dataset. Error Applying Semantic Color");
                        return sap.ca.ui.charts.ChartSemanticColor.NeutralLight;
                    }
                });
            } else {
                jQuery.sap.log.error("Chart Color Scheme is Auto-Semantic but no threshold measure Configured!!!");
            }
        } else {
            jQuery.sap.log.debug("Color Scheme is None: Default Color will be used by CA Chart");
        }
        
        if(colorScheme.isAutoSemantic()) {
            if(this.EVALUATION.isTargetKpi()) {
                jQuery.sap.log.error("Auto Semantic Coloring can not be applied on target type KPI");
            }
        }
    },
    getCAChartType : function(chartConfig, viewConfiguration) {
        if(chartConfig.getChartType().isBar()) {
            if(chartConfig.isSingleAxis()) {
                if(chartConfig.isAbsoluteValue()) {
                    if(chartConfig.isStackingEnabled(viewConfiguration)) {
                        return sap.ca.ui.charts.ChartType.StackedBar;
                    } else {
                        return sap.ca.ui.charts.ChartType.Bar;
                    }
                } else {
                    return sap.ca.ui.charts.ChartType.StackedBar100;
                }
            } else if(chartConfig.isDualAxis()) {
                if(chartConfig.isAbsoluteValue()) {
                    return sap.ca.ui.charts.ChartType.DualStackedBar;
                } else {
                    return sap.ca.ui.charts.ChartType.DualStackedBar100;
                }
            }
        } else if(chartConfig.getChartType().isColumn()) {
            if(chartConfig.isSingleAxis()) {
                if(chartConfig.isAbsoluteValue()) {
                    if(chartConfig.isStackingEnabled(viewConfiguration)) {
                        return sap.ca.ui.charts.ChartType.StackedColumn;
                    } else {
                        return sap.ca.ui.charts.ChartType.Column;
                    }
                } else {
                    return sap.ca.ui.charts.ChartType.StackedColumn100;
                }
            } else if(chartConfig.isDualAxis()) {
                if(chartConfig.isAbsoluteValue()) {
                    return sap.ca.ui.charts.ChartType.DualStackedColumn;
                } else {
                    return sap.ca.ui.charts.ChartType.DualStackedColumn100;
                }
            }
        } else {
            return chartConfig.getChartType().getText();
        }
    },
    
    /* TABLE Related Methods Start Here*/
    _getVisibleColumns : function(defaultColumns) {
        var visibleColumns = [];
        defaultColumns.forEach(function(column, index, array) {
            var oColumn = this.SELECTED_VIEW.findColumnByName(column);
            if(oColumn.isVisibleInTable()) {
                visibleColumns.push(column);
            }
        },this);
        return visibleColumns;
    },
    _getValueState : function(actualValue, thresholdValue) {
        if(!this.EVALUATION.isTargetKpi()) {
            if(actualValue < thresholdValue) {
                return this.EVALUATION.isMaximizingKpi() ? sap.ui.core.ValueState.Error : sap.ui.core.ValueState.Success;
            } else if (actualValue == thresholdValue) {
                return sap.ui.core.ValueState.None;
            } else {
                return this.EVALUATION.isMaximizingKpi() ? sap.ui.core.ValueState.Success : sap.ui.core.ValueState.Error;
            }
        } else {
            return sap.ui.core.ValueState.None;
        }
    },
    _getTableCell : function(originalMeasure, colorScheme, isPercentScaled, axisScale) {
        var thresholdMeasure = this.SELECTED_VIEW.getChartConfiguration()[0] && this.SELECTED_VIEW.getChartConfiguration()[0].getThresholdMeasure();
        var that = this;
        // && (originalMeasure !== thresholdMeasure) put this condition if required
        if(this.EVALUATION.isTargetKpi()) {
            return new sap.m.Label({
                text : {
                    path : originalMeasure,
                    formatter:this.getColumnValueFormatter(originalMeasure,false,isPercentScaled,axisScale)
                }
            });
        } else {
            if(colorScheme.isAutoSemantic() && thresholdMeasure) {
                return new sap.m.ObjectNumber({
                    number: {
                        path: originalMeasure,
                        formatter:this.getColumnValueFormatter(originalMeasure,false,isPercentScaled,axisScale)
                    },
                    state : {
                        parts : [
                                 {path : originalMeasure},
                                 {path : thresholdMeasure}
                        ],
                        formatter : function(oMeasureValue, tMeasureValue) {
                            try {
                                oMeasureValue = window.parseFloat(oMeasureValue);
                                tMeasureValue = window.parseFloat(tMeasureValue);
                                return that._getValueState(oMeasureValue, tMeasureValue);
                            }catch(e) {
                                return sap.ui.core.ValueState.None;
                            }
                        }
                    }
                });
            } else {
                return new sap.m.Label({
                    text : {
                        path : originalMeasure,
                        formatter:this.getColumnValueFormatter(originalMeasure,false,isPercentScaled,axisScale)
                    }
                });
            }
        }
    },
    _sortTableByColumnName : function(oColumnHeader) {
        var iconMapping = {
            "asc" : String.fromCharCode(0xe1e1),
            "desc" : String.fromCharCode(0xe1e2)
        };
        var sortOrder = null;
        if(oColumnHeader.sort_by === void (0)) {
            sortOrder = "desc";
        } else {
            sortOrder = oColumnHeader.sort_by =="asc" ? "desc" : "asc";
        }
        oColumnHeader.sort_by = sortOrder;
        var allColumns = this.getUIComponents().getTable().getColumns();
        allColumns.forEach(function(oColumn) {
           var header = oColumn.getHeader();
           header.setText(header.dimension_label+(header.UOM?" ("+header.UOM+")":""));
        });
        
        oColumnHeader.setText(iconMapping[sortOrder]+" "+oColumnHeader.dimension_label+(oColumnHeader.UOM?" ("+oColumnHeader.UOM+")":""));
        
        var oColumn = this.SELECTED_VIEW.findColumnByName(oColumnHeader.dimension_key);
        var actualSortBy = oColumn.getSortBy();
        
        this.TABLE_SORTING = [{
                name : actualSortBy,
                order : sortOrder
        }];
        this.fetchDataForChart();
        
    },
    _appendUOMToTableHeader : function(result) {
        if(this.UOM_APPENDED_TO_HEADER) {
            return;
        }
        var columns = this.getUIComponents().getTable().getColumns();
        columns.forEach(function(oColumn) {
            var columnHeaderText = oColumn.getHeader().getText();
            var columnName = oColumn.column_name;
            var oColumnObject = this.SELECTED_VIEW.findColumnByName(columnName);
            if(oColumnObject.isMeasure()) {
                var uomProperty = this.MEASURE_UNIT_PROPERTY_MAPPING[columnName];
                if(uomProperty!==columnName) {
                    var uomValue = result[uomProperty];
                    if(uomValue) {
                        oColumn.getHeader().UOM = uomValue;
                        oColumn.getHeader().setText(columnHeaderText+" ("+uomValue+")");
                    }
                }
            }
        },this);
        this.UOM_APPENDED_TO_HEADER = true;
    },
    renderTable: function(tableColumns, colorScheme) {
        var that = this;
        var table = this.getUIComponents().getTable();
        var oConfig = (this.SELECTED_VIEW.getChartConfiguration())[0];
        table.removeAllColumns();
        var SELECTED_VIEW = this.SELECTED_VIEW;
        var visibleColumns = this._getVisibleColumns(tableColumns);
        this.COLUMNS_SORT = [];
        tableColumns.forEach(function(sColumn, index, allColumns) {
            var oColumn = this.SELECTED_VIEW.findColumnByName(sColumn);
            if(oColumn.getSortBy() && oColumn.getSortOrder()) {
                /*TO be on safer side.. Checking the sort order value */
                if(oColumn.getSortOrder() == "asc" || oColumn.getSortOrder() == "desc") {
                    this.COLUMNS_SORT.push({
                        name : oColumn.getSortBy(),
                        order : oColumn.getSortOrder()
                    });
                }
            }
        }, this);
        
        var isPercentScaled = false ;
        if((this.EVALUATION.getScaling() == -2) && !((oConfig.isPercentageValue()) && (oConfig.getChartType().isBar() || oConfig.getChartType().isColumn()))) {
        	isPercentScaled = this._isMeasureSetPercentScaled(this.SELECTED_VIEW.getMeasures());			 
        }
        
        var axisScale = [] ;
        if(isPercentScaled) {
	        if((oConfig.isDualAxis()) && (oConfig.isAbsoluteValue()) && (oConfig.getChartType().isBar() || oConfig.getChartType().isColumn())) {
	        	var axisMeasures = this._getMeasuresByAxis();
	        	axisScale.push(this._isMeasureSetPercentScaled(axisMeasures.axis1Msr));
	        	axisScale.push(this._isMeasureSetPercentScaled(axisMeasures.axis2Msr));
	        }
        }
        
        var template =  new sap.m.ColumnListItem();
        for (var i = 0, l= visibleColumns.length ; i < l; i++) {
            var oColumn = this.SELECTED_VIEW.findColumnByName(visibleColumns[i]);
            var Label = new sap.m.Label({
                text: this.COLUMN_LABEL_MAPPING[visibleColumns[i]] //Use the Label instead of Technical Column Name
            }).addStyleClass("tableColumnHeader");
            Label.dimension_key = visibleColumns[i];
            Label.dimension_label = this.COLUMN_LABEL_MAPPING[visibleColumns[i]];
            Label.attachBrowserEvent("click", function() {
                that._sortTableByColumnName(this);
            });
            var columns = new sap.m.Column({
                hAlign: oColumn.isMeasure() ? "Right" : "Left",
                styleClass: "qty",
                header: Label,
                minScreenWidth: "Tablet",
                demandPopin: true,
            });
            columns.column_name = visibleColumns[i];
            if(oColumn.isMeasure()) {
                //Dynamically get oCell object based on Threshold Measure
                var oCell = this._getTableCell(visibleColumns[i], colorScheme, isPercentScaled, axisScale);
                template.addCell(oCell);
            } else {
                var oCell = new sap.m.Label({
                    text: {
                        path: this.DIMENSION_TEXT_PROPERTY_MAPPING[visibleColumns[i]],
                        formatter:this.getColumnValueFormatter(this.DIMENSION_TEXT_PROPERTY_MAPPING[visibleColumns[i]],true)
                    }
                });
                template.addCell(oCell);
            }
            table.addColumn(columns);
        }
        table.bindAggregation("items", "/data", template);
    },
    /* TABLE Related Methods End Here*/
    
    
    
    /*
     * EVENT-HANDLERS :: BEGIN
     */
    
    _abortPendingODataCalls : function() {
        var abort = function(oDataCallRef) {
            try {
                if(oDataCallRef) {
                    oDataCallRef.abort();
                }
            }catch(e) {}
        };
        var abortArray = function(aODataCallRef) {
            if(aODataCallRef && aODataCallRef.length) {
                aODataCallRef.forEach(function(odataCallRef) {
                    abort(odataCallRef);
                });
            }
        };
        abort(this.DDA_CONFIG_ODATA_CALL_REF);
        abort(this._bundled_evaluations_call_ref);
        abort(this.EVALUATION_ODATA_CALL_REF);
        abort(this.SEMANTIC_OBJECT_LINKS_ODATA_CALL_REF);
        abortArray(this.SEMANTIC_OBJECT_BY_CONTEXT_LINKS_ODATA_CALL_REF);
        abort(this.CHART_TABLE_DATA_ODATA_CALL_REF);
        abort(this.FETCH_AGREGATION_VALUE_ODATA_CALL_REF);
    },
    onBack: function(evt) {
        this._abortPendingODataCalls();
        window.history.back();
        
    },
    _resetConfigurations : function() {
        this.TABLE_SORTING = null;
        this.UOM_APPENDED_TO_HEADER = null;
        this.setChartSelectionContextObject(null);
    },
    onViewChange: function(evt) {
        //Reseting something that needs to be reset  
        this._resetConfigurations();
        var selectedViewId = evt.getParameters()["selectedKey"];
        /* Old Code - reseting all filters
        sap.suite.smartbusiness.url.hash.setApplicationParameters({
            viewId : [selectedViewId]
        });
        */
        
        /**
         * New Code - Do not reset filters on view change
         */
        var AppParameters = sap.suite.smartbusiness.url.hash.getApplicationParameters();
        AppParameters["viewId"] = [selectedViewId];
        sap.suite.smartbusiness.url.hash.setApplicationParameters(AppParameters);
        
    },
    _attachHashChangeEvent: function () {
        this.hashChanger = this.oRouter.oHashChanger;
        var that = this;
        if (this.hashChanger) {
            try {
                if (!that.hashChangerAttached) {
                    this.hashChanger.attachEvent("hashChanged", this._proxyHashChangeListener);
                    this.hashChanger.viewRef = this;
                }
                that.hashChangerAttached = true;
            } catch (e) {
                jQuery.sap.log.error("Couldn't Attach HashChange Event");
            }
        } else {
            
            jQuery.sap.log.error("Router HashChanger Object Found NULL");
        }
    },
    getUrlFilters : function() {
        var params = sap.suite.smartbusiness.url.hash.getApplicationParameters(["viewId"]/*Excludes array keys*/);
        var urlFilters = [];
        for (var key in params) {
            var aFilterValues = params[key];
            if(aFilterValues && aFilterValues.length) {
                aFilterValues.forEach(function(sFilterValue) {
                    var Obj = {};
                    Obj["NAME"] = key;
                    Obj["OPERATOR"] = "EQ";
                    Obj["VALUE_1"] = sFilterValue;
                    Obj["VALUE_2"] = "";
                    Obj["TYPE"] = "FI";
                    urlFilters.push(Obj);
                });
            }
        }
        return urlFilters;
    },
    getAllFilters : function() {
        var evaluationFilters = this.EVALUATION.getFilters()["results"] || [];
        return evaluationFilters.concat(this.getUrlFilters());
    },
    getAdditionFiltersForChipConfiguration : function() {
        var params = sap.suite.smartbusiness.url.hash.getApplicationParameters(["viewId"]/*Excludes array keys*/);
        var urlFilters = [];
        if(params) {
            for (var key in params) {
                var filterValues = params[key];
                if(filterValues && filterValues.length) {
                    filterValues.forEach(function(eachFilterValue) {
                        var tempArray = [];
                        tempArray[0] = key;
                        tempArray[1] = "EQ";
                        tempArray[2] = eachFilterValue;
                        tempArray[3] = "";
                        urlFilters.push(tempArray);
                    });
                }
            }
        }
        return urlFilters;
    },
    _hideKpiHeaderIfRequired : function() {
        return;
        
        if(this.CONFIGURATION.getHeaders().length == 0) {
            return;
        }
        try {
            var appParameters = sap.suite.smartbusiness.url.hash.getApplicationParameters(["viewId"]);
            if(appParameters) {
                if(Object.keys(appParameters).length) {
                    this.getUIComponents().getTileContainer().$().css("overflow","hidden");
                    this.getUIComponents().getTileContainer().$().animate({
                        height : "0px"
                    });
                    return;
                }
            }
            this.getUIComponents().getTileContainer().$().animate({
                height : "156px"
            });
        } catch(e) {
            jQuery.sap.log.error("Failed to Hide KPI Header : "+e);
        }
    },
    hashChangeListener: function (hashChangeEvent) {
        this.NEW_HASH = hashChangeEvent ? hashChangeEvent.getParameter("newHash") : "";
        this.OLD_HASH = hashChangeEvent ? hashChangeEvent.getParameter("oldHash") : "";        
        var AppParameters = sap.suite.smartbusiness.url.hash.getApplicationParameters();
        var Key_ViewId = "viewId";
        //when no specific view specified - take default view (default mode)
        if(!AppParameters[Key_ViewId]) {
            this.SELECTED_VIEW = this.CONFIGURATION.getDefaultView();
            if (this.SELECTED_VIEW) {
                this.renderView(this.SELECTED_VIEW);
                AppParameters.viewId = [this.SELECTED_VIEW.getId()];
                sap.suite.smartbusiness.url.hash.setApplicationParameters(AppParameters, false);
                var hash = sap.suite.smartbusiness.url.hash.getHash();
                window.location.replace("#"+hash);
            } else {
                jQuery.sap.log.error("Evaluation does not have any views configured");
            }
        }
        //when application starts with a specific viewId/filter in the hash (bookmark mode)
        else if(!this.SELECTED_VIEW) {
            this.firstTimeFlag = true;
            this.SELECTED_VIEW = this.CONFIGURATION.findViewById(AppParameters[Key_ViewId][0]);
            if (this.SELECTED_VIEW) {
                this._resetConfigurations();
                this.renderView(this.SELECTED_VIEW);
                //accessing internal property _oFirstDimensionSelect to set selected View.
                //It doesn't fire the change automatically; so done manually
                this._hideKpiHeaderIfRequired();
                this._setViewComboBoxSelectedIndex();
                this.fetchKpiValue();
                this.fetchDataForChart();
                this._fixFacetListSelection();
            } else {
                jQuery.sap.log.error("The view with viewId : "+ AppParameters[Key_ViewId][0]  + " does not exist");
            }
        }
        //when viewId gets changed in the hash (viewswitch mode)
        else if(this.SELECTED_VIEW && AppParameters[Key_ViewId][0] != this.SELECTED_VIEW.getId()) {
            this.SELECTED_VIEW = this.CONFIGURATION.findViewById(AppParameters[Key_ViewId][0]);
            if(this.firstTimeFlag) {
                sap.suite.smartbusiness.cache.invalidateKpiDetailsCache();
            }
            this._setViewComboBoxSelectedIndex();
            this._resetConfigurations();
            this.renderView(this.SELECTED_VIEW);
            this.fetchKpiValue();
            this.fetchDataForChart();
            this._hideKpiHeaderIfRequired();
            this._fixFacetListSelection();
            this._refreshKpiHeaderTiles();
        }
        //when filters/view change in the hash
        else {
         // invalidating cache on change of filters
            if(this.firstTimeFlag) {
                sap.suite.smartbusiness.cache.invalidateKpiDetailsCache();
            }
            this._setViewComboBoxSelectedIndex();
            this._hideKpiHeaderIfRequired();
            this.fetchKpiValue();
            this.fetchDataForChart();
            this._fixFacetListSelection();
            this._refreshKpiHeaderTiles();
        }
        this.getUIComponents().getFilter().refreshFilter();
    },
    _refreshKpiHeaderTiles : function() {
        var header_container = this.getUIComponents().getTileContainer();
        sap.suite.smartbusiness.miniChartManager.hashChangeListner({
            allTiles : this.CONFIGURATION.getHeaders(),
            headerContainer : header_container,
            sapSystem : this.SAP_SYSTEM,
            urlFilters : this.getUrlFilters(),
            firstTimeFlag : this.firstTimeFlag
        });
        this.firstTimeFlag = true;
    },
    _setViewComboBoxSelectedIndex : function() {
        try {
            this.getUIComponents().getChartToolbar()._oFirstDimensionSelect.setSelectedKey(this.SELECTED_VIEW.getId());
        }catch(e) {
            jQuery.sap.log.error("Failed to Set Selected Index of View ComboBox");
        }
    }, 
    //Experimental
    _fixFacetListSelection : function() {
        try {
            var filter = this.getUIComponents().getFilter();
            var facetFilter = filter.getFacetFilterReference();
            var urlParameters = sap.suite.smartbusiness.url.hash.getApplicationParameters(["viewId"]);
            var facetLists = facetFilter.getLists();
            if(facetLists.length) {
                facetLists.forEach(function(facetList) {
                    var dimensionName = facetList._techName;
                    if(urlParameters[dimensionName]) {
                        var aFilterValue = urlParameters[dimensionName];
                        var items = facetList.getItems();
                        if(items.length) {
                            items.forEach(function(item) {
                            	var curKey=item.getBindingContext().getObject()[facetList._techName]||"";
                            	curKey=curKey.getTime?curKey.getTime()+"":curKey+"";
                                if(aFilterValue.indexOf(curKey) > -1) {
                                    item.setSelected(true);
                                } else {
                                    item.setSelected(false);
                                }
                            });
                        }
                    } else {
                        var items = facetList.getItems();
                        if(items.length) {
                            items.forEach(function(item) {
                                item.setSelected(false);
                            });
                        }
                    }
                }, this);
            }
        } catch(e) {
        }
    },
    /*
     * EVENT-HANDLERS :: END
     */
    _getUniqueNavLinks : function(results, existingLinks) {
        var uniqueLinks=[];
        var curApp = sap.suite.smartbusiness.url.hash.getSemanticObject()+"-"+sap.suite.smartbusiness.url.hash.getAction();
        results.forEach(function(s){
            var t=s.id.match(/-([^?~])*~([^?])*/g);
            t=t?t.toString():"";
            if(t) {
                if(!existingLinks[t]) {
                    existingLinks[t] = t;
                    if(s.id.indexOf(curApp) == -1) {
                        uniqueLinks.push(s);
                    }
                }
            }
        });
        return uniqueLinks;
    },
    _initExternalNavigationLinks : function() {
        this._OPEN_IN_LINKS = {};
        var so = sap.suite.smartbusiness.url.hash.getSemanticObject();
        this._oExternalNavLinksSOPopover = new sap.m.ResponsivePopover({
           modal:false,
           showHeader : false,
           enableScrolling:true,
           verticalScrolling:true,
           horizontalScrolling:false,
           placement:sap.m.PlacementType.Top,
           contentWidth:"18rem",
        });
        var startTimeFetchSOLinks = new Date().getTime();
        var businessParamsMap = {};
        if(this.CHIP_ID) {
            businessParamsMap["chipId"] = this.CHIP_ID;
        }
        if(this._EVALUATION_ID) {
            businessParamsMap["evaluationId"] = this._EVALUATION_ID;
        }
        this.SEMANTIC_OBJECT_LINKS_ODATA_CALL_REF = sap.suite.smartbusiness.navigation.getLinksBySemanticObject({
            success : function(results) {
                var endTimeFetchSOLinks = new Date().getTime();
                this._requestTimeLog["SEMANTIC_OBJECT_LINKS"] = {
                    title : "Semantic Object Links",
                    time : endTimeFetchSOLinks - startTimeFetchSOLinks
                };
                results = this._getUniqueNavLinks(results, this._OPEN_IN_LINKS);
                if(results.length) {
                    var model = new sap.ui.model.json.JSONModel({"EXTERNAL_APP_LINKS" : results});
                    var listOfLinks = new sap.m.List({
                        
                    });
                    listOfLinks.bindItems("/EXTERNAL_APP_LINKS", new sap.m.StandardListItem({
                        title : "{text}",
                        customData : new sap.ui.core.CustomData({
                            key : "{id}",
                            value : "{applicationAlias}"
                        }),
                        type : sap.m.ListType.Navigation,
                        press : jQuery.proxy(this._onAppSelection,this,{publishContext : true,isFromOpenIn : true})
                    })).setModel(model);
                    this._oExternalNavLinksSOPopover.removeAllContent();
                    this._oExternalNavLinksSOPopover.addContent(listOfLinks);
                } else {
                    this.setHeaderFooterOptionsWithoutOpenInButton();
                }
            },
            async : false,
            error : function(error) {
                jQuery.sap.log.error("Error fetching navigation links by semantic object : "+so);
                this.setHeaderFooterOptionsWithoutOpenInButton();
            },
            semanticObject : so,
            businessParam : businessParamsMap,
            context : this
        });
    },
    _showExternalNavigationLinks : function(srcControl) {
        if(!this._oExternalNavLinksSOPopover.isOpen()) {
            this._oExternalNavLinksSOPopover.openBy(srcControl); 
        }
    },
    _toggleFilter : function() {
    	var oController = this;
        var filter = this.getUIComponents().getFilter();
        if(!filter.getSelectedItems())
        	{
             filter.setVisible(!filter.getVisible());
        	}else
        if(filter.getSelectedItems() && filter.getVisible()==true){
        	
        	this.oI18nModel = oController.getView().getModel("i18n");
        	sap.m.MessageBox.alert(oController.oI18nModel.getResourceBundle().getText("Do_you_really_want_to_reset_the_filters?"),{onClose:function(oEvent){
        		if(oEvent=="OK"){
        		 filter.resetFilter();
        		 filter.setVisible(false);
        		}else if(oEvent=="CANCEL"){
        			 filter.setVisible(true);
        		}
        	},
        			title:oController.oI18nModel.getResourceBundle().getText("Reset_Filters"),
        			actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL]
        	});

       	
 
        }
    },
    setHeaderFooterOptionsWithoutOpenInButton : function() {
        var options = this.getHeaderFooterOptions();
        options.buttonList = [];
        this.setHeaderFooterOptions(options);
        /*
         * On Setting Header and Footer Again,the page title is Lost 
         */
        this.renderTitle();
    },
    getHeaderFooterOptions : function() {
        var options = this._getHeaderFooterOptions();
        var oController = this;
        var oI18nModel = oController.getView().getModel("i18n");
        var os = sap.ui.Device.os.name;
        if(os && os != sap.ui.Device.os.OS.IOS) {
        	options.additionalShareButtonList.push({
                sBtnTxt: oI18nModel.getResourceBundle().getText("EXPORT_AS_EXCEL"),
                sIcon: "sap-icon://excel-attachment",
                onBtnPressed: function (oEvent) {
                    oController._exportAsExcel();
                }
            });
        	
        }
        if((window.location.hostname =="localhost") || (jQuery.sap.getUriParameters().get("sbcmode") == "99")) {
            options.additionalShareButtonList.push({
                sBtnTxt: "Enable Compact Mode",
                sIcon: "sap-icon://resize",
                onBtnPressed: function (oEvent) {
                    if(oController._compactMode) {
                        oController.getView().removeStyleClass("sapUiSizeCompact");
                        oController._compactMode = false;
                        oEvent.getSource().setText("Enable Compact Mode");
                    } else {
                        oController.getView().addStyleClass("sapUiSizeCompact");
                        oController._compactMode = true;
                        oEvent.getSource().setText("Disable Compact Mode");
                    }
                    jQuery(window).trigger("resize");
                }
            });
        }
        if((window.location.hostname =="localhost") || (jQuery.sap.getUriParameters().get("sbrequestlog") == "99")) {
            options.additionalShareButtonList.push({
                sBtnTxt: "Request-Time Log",
                sIcon: "sap-icon://time-entry-request",
                onBtnPressed: function (oEvent) {
                    oController._performance.start(oController._requestTimeLog, oController._compactMode);
                }
            });
        }
        var ELIGIBLE_TILES_TO_ENABLE_ADD_TO_HOME = ["NT","AT","TT"];
        if(ELIGIBLE_TILES_TO_ENABLE_ADD_TO_HOME.indexOf(this.TILE_TYPE) > -1) {
            options.additionalShareButtonList.push({
                sBtnTxt: oI18nModel.getResourceBundle().getText("SAVE_AS_TILE"),
                sIcon: "sap-icon://add-favorite",
                onBtnPressed: function (oEvent) {
                    oController._openAddToHomeDialogBox();
                }
            });
        }
        return options;
    },
    _getHeaderFooterOptions : function () {
        var oController = this;
        var oI18nModel = oController.getView().getModel("i18n");
        this.oListItem = new sap.m.ObjectListItem();
        var add2HomeIcon = String.fromCharCode(0xe078);
        var oOptions = {
                onBack: function () {
                    oController._abortPendingODataCalls();
                    window.history.back();
                },
                sFullscreenTitle: "",
                onFacetFilter: function() {
                    oController._toggleFilter();
                    $(window).trigger('resize');
                },
                buttonList : [{
                    sBtnTxt : oI18nModel.getResourceBundle().getText("OPEN_IN_LABEL"),
                    onBtnPressed: function (oEvent) {
                        oController._showExternalNavigationLinks(oEvent.getSource());
                    }
                }],
                bSuppressBookmarkButton: true,
                oJamOptions: {
                    fGetShareSettings: function () {
                        var oHeader = oController.getView().byId("header-ribbon");
                        // Create object List Item for shareToJam
                        var oListItem = new sap.m.ObjectListItem();
                        oListItem.setTitle(oHeader.getTitle());
                        oListItem.setNumber(oHeader.getNumber());
                        oListItem.setNumberUnit(oHeader.getNumberUnit());
                        var oShareSettings = {
                                object: {
                                    id: window.location.href,
                                    display: oListItem,
                                    share: "SAP Smart Business" //TODO
                                }
                        };
                        return oShareSettings;
                    },
                },additionalShareButtonList : [],
                oEmailSettings: {
                    fGetMailBody: function () {
                        var oHeader = oController.getView().byId("header-ribbon");
                       if(oHeader.getNumberUnit()){
                        return "(" + oController.EVALUATION.getKpiName().trim() + "/" + oHeader.getTitle().trim() + ": " + oHeader.getNumber() +" "+ (oHeader.getNumberUnit()) +")" + "\n" + window.location.href;
                        }
                        else{
                        	return "(" + oController.EVALUATION.getKpiName().trim() + "/" + oHeader.getTitle().trim() + ": " + oHeader.getNumber()  +")" + "\n" + window.location.href;	
                        }
                    }
                },
        };
        return oOptions;
    },
    _initRequestTimeLogChart : function() {
        if((window.location.hostname =="localhost") || (jQuery.sap.getUriParameters().get("sbrequestlog") == "99")) {
            jQuery.sap.require("sap.suite.ui.smartbusiness.drilldown.lib.Performance");
            this._performance = new sap.suite.ui.smartbusiness.drilldown.lib.Performance();
        }
    },
    
    addExportMethodToTable : function() {
        
        var that = this;
        sap.m.Table.prototype.exportData = sap.m.Table.prototype.exportData || function (mSettings) {
               
               jQuery.sap.require("sap.ui.core.util.Export");
               mSettings = mSettings || {};
               if (!mSettings.rows) {
                      mSettings.rows = {
                            path: "/data"
                      };
               }
               /*if (mSettings.columns) {
                      var column = [];
                      var tempCol = [];
                      tempCol = Object.keys(that.getUIComponents().getTable().getModel().getData().data[0]);
                      tempCol.shift();
                      jQuery.each(tempCol, function(iIndex, oColumn) {
                                   column.push(mSettings.columns[tempCol.indexOf(oColumn)]);
                      });
                      mSettings.columns = column;
               }*/
               var oExport = new sap.ui.core.util.Export(mSettings);
               this.addDependent(oExport);
               return oExport;
        }
     },
     
     _exportAsExcel : function() {
    	 var that = this;
        jQuery.sap.require("sap.ui.core.util.ExportTypeCSV");
        var columnNames = [];
        var configuredColumns = [];
        configuredColumns = this.SELECTED_VIEW.getColumns();
        for(var i=0;i<configuredColumns.length; i++) {
            columnNames.push(configuredColumns[i]);
            var textMappingProperty = this.DIMENSION_TEXT_PROPERTY_MAPPING[configuredColumns[i]];
            var uomProperty = this.MEASURE_UNIT_PROPERTY_MAPPING[configuredColumns[i]]
            if(textMappingProperty && textMappingProperty!=configuredColumns[i]) {
                columnNames.push(textMappingProperty);
            }
            if(uomProperty) {
                columnNames.push(uomProperty);
            }
        }

//        jQuery.each(selectedColumns, function(iIndex, oColumn){
//        	columnNames.push(oColumn);
//        	if(that.DIMENSION_TEXT_PROPERTY_MAPPING[oColumn])
//        		columnNames.push(that.DIMENSION_TEXT_PROPERTY_MAPPING[oColumn]);
//        });
//        columnNames = Object.keys(this.getUIComponents().getTable().getModel().getData().data[0]);
//        columnNames.shift();
        var column = jQuery.map(columnNames, function(colName){
               return {
            	   	  name : that.COLUMN_LABEL_MAPPING[colName] || colName,
                      template : {
                            content : {
                                   path: colName,
                            }
                      }
               };
        });
        
        this.getUIComponents().getTable().exportData({
               exportType : new sap.ui.core.util.ExportTypeCSV({separatorChar : ";"}),
               columns : column
        }).saveFile().always(function() {
               this.destroy();
        });    
        
     },

    
    _openAddToHomeDialogBox : function() {
        this.oATHDialog.setModel(this.getView().getModel("i18n"), "i18n");
        this._compactMode ? this.oATHDialog.addStyleClass("sapUiSizeCompact") : this.oATHDialog.removeStyleClass("sapUiSizeCompact");
        this.oATHDialog.open();
    },
    _initAddToHomeDialogBox  : function() {
        var oController = this;
        this.oATHDialogContent = new sap.ui.view({
            type : "XML",
            viewName : "sap.suite.ui.smartbusiness.drilldown.view.AddToHome",
            viewData : this
        });
        this.oATHDialog = new sap.m.Dialog({
            title : "{i18n>SAVE_AS_TILE_DIALOG_TITLE}",
            content : [
                   this.oATHDialogContent  
            ],
            beginButton : new sap.m.Button({
                text : "{i18n>OK_BUTTON}",
                press : function() {
                    oController.oATHDialogContent.getController().publishTile(function(){
                        oController.oATHDialog.close();
                    });
                }
            }), 
            endButton : new sap.m.Button({
                text : "{i18n>CANCEL_BUTTON}",
                press : function() {
                    oController.oATHDialog.close();
                }
            })
        });
        this.oATHDialog.addStyleClass("sbAddToHomeDialogBox");
        this.getView().addDependent(this.oATHDialog);
    },
    getUIComponents : function() {
        var page = this.getView().byId("smartbusiness_drilldown_page");
        var chartToolbar = this.getView().byId("chartToolbar");
        var header = this.getView().byId("header-ribbon");
        var tilesContainer = this.getView().byId("header-container");
        var facetFilter = this.getView().byId("facetFilter");
        var that = this;
        
        return {
            getChart : function() {
                return that.chart;
            },
            getTable : function() {
                return that.table;
            },
            getChartToolbar : function() {
                return chartToolbar;
            },
            getFilter : function() {
                return facetFilter;
            },
            getHeader : function() {
                return header;
            },
            getTileContainer : function() {
                return tilesContainer;
            },
            getPage : function() {
                return page;
            }
        };
    },
    onExit : function() {
        this._abortPendingODataCalls();
        this._detachHashChangeListener();
    }
});
