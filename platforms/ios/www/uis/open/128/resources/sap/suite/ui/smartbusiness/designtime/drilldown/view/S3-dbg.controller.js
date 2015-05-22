sap.ui.getCore().loadLibrary("sap.suite.ui.commons");
jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");
jQuery.sap.require("sap.suite.ui.smartbusiness.tiles.Bullet");
jQuery.sap.require("sap.suite.ui.smartbusiness.tiles.Comparison")
jQuery.sap.require("sap.suite.ui.smartbusiness.tiles.AreaChart");
jQuery.sap.require("sap.suite.ui.smartbusiness.tiles.Numeric");
jQuery.sap.require("sap.suite.ui.smartbusiness.tiles.MeasureComparison");
jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");
jQuery.sap.require("sap.m.MessageBox");
sap.ca.scfld.md.controller.BaseDetailController.extend("sap.suite.ui.smartbusiness.designtime.drilldown.view.S3", {

	onInit : function() {
		this.DDA_MODEL = null;
		this.evaluationId = null;
		this.viewId = null;
		this.ddaFilter=this.byId("ddaFilter");
		this.initializeTileHeader();
		this.defineHeaderFooterOptions();
		this.oRouter.attachRoutePatternMatched(this.onRoutePatternMatched, this);
		this.busyIndicator = new sap.m.BusyDialog();

	},
	tileTypeMapping:{
		NT : "Numeric",
		AT : "Bullet",
		CT : "Comparison",
		TT : "AreaChart",
		CM:"MeasureComparison"
	},
	headerNumberFormatter:function(s){
		return s?"12,345.67":"";
	},
	headerNumberUnitFormatter:function(s){
		return s?"EUR":"";
	},
	bindUiToModel:function(){
		this.DDA_MODEL.bindModel(this.getView(),"SB_DDACONFIG");
	},
	initializeTileHeader:function(){
		var that=this;
		var tileContainer=this.byId("tileContainer");
		//var filter= new sap.ui.model.Filter("visible",sap.ui.model.FilterOperator.EQ,true);
		tileContainer.bindAggregation("items",{
			path:"SB_DDACONFIG>/HEADERS_VISIBLE",
			factory:function(sId,oBindingContext){
				var type=oBindingContext.getProperty("VISUALIZATION_TYPE");
				return new sap.suite.ui.smartbusiness.tiles[that.tileTypeMapping[type]]({
					evaluationId:that.evaluationId,
					mode:"DUMMY",
					header:	"{SB_DDACONFIG>TITLE}",
					subheader: "{SB_DDACONFIG>SUBTITLE}"
				}).addStyleClass("drilldownKpiTiles");

			},
			//filters:[filter]
		});
	},
	lauchConfigurator: function() {
		this.oRouter.navTo("configurator", {evaluationId: this.evaluationId, viewId: this.viewId});
		//this.evaluationId = null;
	},
	onRoutePatternMatched: function(oEvent) {
		var view = this.getView();

		if (oEvent.getParameter("name") === "detail") {
			
			try {
				
				//check if the model has to be refreshed due to an eval level save/delete
				if(this.oApplicationFacade.__refreshModel && this.oApplicationFacade.__refreshModel === 1) {
					this.getView().getModel() && this.getView().getModel().refresh();
				}
				var str=oEvent.getParameter("arguments").contextPath;
				var context = new sap.ui.model.Context(view.getModel(), '/' + str);
				view.setBindingContext(context);
				try{
					this.evaluationId = view.getBindingContext().getObject()["ID"];
				}catch(e){
					try{
						this.evaluationId=  str.match(/ID=[^,]+/g)[0].replace(/(ID=')|(')/g,"");
					}catch(e){
						this.evaluationId=str.replace(/EVALUATIONS_DDA\('|'\)/g,"")
					}
				}

				var evaluationId=oEvent.getParameter("arguments")["evaluationId"];
				if(evaluationId !== this.evaluationId) {
					this.DDA_MODEL =  sap.suite.smartbusiness.ddaconfig.Model.getInstance(this.evaluationId, true, this.getView().getModel("i18n"));
					this.EVALUATION = sap.suite.smartbusiness.kpi.parseEvaluation(this.DDA_MODEL.EVALUATION_DATA);
					var newViewId=this.DDA_MODEL.NEW_VIEWID;
					var viewId = this.DDA_MODEL.getConfigurator().getDefaultViewId();
					if(viewId != null) {
						this.viewId = viewId;
						this.DDA_MODEL.setViewId(viewId);
					} else {
						this.viewId = newViewId;
					}
					this.bindUiToModel();
					this.ddaFilter.setEvaluationData(this.EVALUATION);
					this.ddaFilter.setEvaluationId(this.evaluationId);
					var filterDimensions=[];
					this.getView().getModel("SB_DDACONFIG").getProperty("/FILTERS").forEach(function(s){
						filterDimensions.push(s.name); 
					})
					this.ddaFilter.setDimensions(filterDimensions);
				}else{
					this.bindUiToModel();
					if(this.viewId==newViewId && this.getView().getModel("SB_DDACONFIG").getProperty("/ID")!=newViewId ){

					}
				}
				//store init count of headers and filters
				this.INIT_COUNT_HEADERS = this.getView().getModel("SB_DDACONFIG").getData()["HEADERS"].length;
				this.INIT_COUNT_FILTERS = this.getView().getModel("SB_DDACONFIG").getData()["FILTERS"].length;

				this._oTextsModel = this.getView().getModel("i18n");
				var otoolBar = this.getView().byId("chartToolbar");
				otoolBar._oFirstDimensionSelect.bindProperty("selectedKey","SB_DDACONFIG>/ID");

				this._oModel = this.getView().getModel("SB_DDACONFIG").getData();
				this.refreshChart();
				
				if(this.copyClipboard && Object.keys(this.copyClipboard) && Object.keys(this.copyClipboard).length) {
					this.checkEvaluationForPaste();
				}

				if(this.getPage().getFooter()) {
					this.checkForCopy();
				}
				
			}
			catch(e) {
				sap.suite.smartbusiness.utils.showErrorMessage(this.oApplicationFacade.getResourceBundle().getText("FAILED_TO_LOAD_ODATA"), e.message);
			}
			
		}
	}, 
	
	defineHeaderFooterOptions:function(){
		var that = this;
		this.oHeaderFooterOptions = { 
				bSuppressBookmarkButton : true,
				sI18NDetailTitle: "DRILLDOWN_CONFIG_DETAILS",
				oEditBtn : {
					sI18nBtnTxt : "CONFIGURE",
					onBtnPressed : function(evt) {
						that.lauchConfigurator()
					},
					bEnabled : false, // default true
				},
				buttonList : [
				              {
				            	  sId : "Delete", // optional
				            	  sI18nBtnTxt : "DELETE",
				            	  onBtnPressed : function(evt) {

				            		  that.onDeleteConfiguration();
				            	  }
				              },
				              {
				            	  sId : "Copy", // optional
				            	  sI18nBtnTxt : "COPY",
				            	  onBtnPressed : function(evt) {
				            		  that.copyEvaluationToClipboard();
				            	  }
				              },
				              {
				            	  sId : "Paste", // optional
				            	  sI18nBtnTxt : "PASTE",
				            	  onBtnPressed : function(evt) {
				            		  that.copyDDAConfiguration();
				            	  }
				              }
				              /* {
				                  sId : "cancel", // optional
				                  sI18nBtnTxt : "Cancel",
				                  onBtnPressed : function(evt) {
				                  }
				             },*/

				              ]
		
		};
	},
	
	getHeaderFooterOptions : function() {
		return this.oHeaderFooterOptions;
	},

	refreshChart: function() {
		var oController = this ;
		var button = this.getView().byId("chartToolbar").getToolBar().getContentRight();
		if (button) {
			if(button[0] && (!(button[0].getVisible()))) { button[0].setVisible(true); }
			if(button[1] && (!(button[1].getVisible()))) { button[1].setVisible(true); }
			if(button[3] && (!(button[3].getVisible()))) { button[3].setVisible(true); }
			if(button[0])
				button[0].firePress();
		}
				
		this.oChartDataModel = new sap.ui.model.json.JSONModel() ;
		this.oChartData = [] ;
				
		this.dda_chart = this.getView().byId("chartRef") ;	
		this.dda_chart.setStackedChartWidthEnhancer(false);
		this.dda_table = this.getView().byId("chartTable") ;		

		var tmpData = this._oModel;
		this.dda_config = {} ;
		this.dda_config.chartConfig = {
				mode: tmpData.DATA_MODE || "DUMMY",
				title: "",
				dataLimit: tmpData.DATA_LIMIT || null,	
				dataLimitations: tmpData.DATA_LIMITATIONS || false,
				type: (tmpData.CHART_TYPE).toUpperCase() || "BAR",
				axis: tmpData.AXIS_TYPE || "SINGLE",
				value: tmpData.VALUE_TYPE || "ABSOLUTE",
				colorScheme: tmpData.COLOR_SCHEME || "NONE",
				thresholdMeasure: tmpData.THRESHOLD_MEASURE || ""
		} ;

		this.dda_config.columnsConfig = [] ;
		for(var i=0;i<tmpData.COLUMNS.length;i++) {
			this.dda_config.columnsConfig.push({
				name: tmpData.COLUMNS[i].NAME,
				type: tmpData.COLUMNS[i].TYPE,
				visibility: tmpData.COLUMNS[i].VISIBILITY || "BOTH",
				sortOrder: tmpData.COLUMNS[i].SORT_ORDER || "NONE",
				sortBy: tmpData.COLUMNS[i].SORT_BY || "",
				axis: tmpData.COLUMNS[i].AXIS || 1,
				stacking: tmpData.COLUMNS[i].STACKING || 0,
				color:tmpData.COLOR_SCHEME=="MANUAL_NON_SEMANTIC"?tmpData.COLUMNS[i].COLOR1:tmpData.COLOR_SCHEME=="MANUAL_SEMANTIC"?tmpData.COLUMNS[i].COLOR2:""
			}) ;
		}			

		this.oColumns = [] ;
		this.oDimensions = [] ;
		this.oMeasures = [] ;
		this.dimNameArray = [] ;
		this.msrNameArray = [] ;
		this.chartDimensions = [] ;
		this.chartDimNames = [] ;
		this.chartMeasures = [] ;
		this.chartMsrNames = [] ;
		this.tableDimensions = [] ;
		this.tableDimNames = [] ;
		this.tableMeasures = [] ;
		this.tableMsrNames = [] ;
		for(var i=0;i<this.dda_config.columnsConfig.length;i++) {
			this.oColumns.push(this.dda_config.columnsConfig[i]);
			if((this.dda_config.columnsConfig[i].type).toUpperCase() === "DIMENSION") {
				this.oDimensions.push(this.dda_config.columnsConfig[i]) ;
				this.dimNameArray.push(this.dda_config.columnsConfig[i].name) ;
				if(((this.dda_config.columnsConfig[i].visibility).toUpperCase() === "CHART") || ((this.dda_config.columnsConfig[i].visibility).toUpperCase() === "BOTH")) {
					this.chartDimensions.push(this.dda_config.columnsConfig[i]) ;
					this.chartDimNames.push(this.dda_config.columnsConfig[i].name) ;
			    }
				if(((this.dda_config.columnsConfig[i].visibility).toUpperCase() === "TABLE") || ((this.dda_config.columnsConfig[i].visibility).toUpperCase() === "BOTH")) {
			    	this.tableDimensions.push(this.dda_config.columnsConfig[i]) ;
			    	this.tableDimNames.push(this.dda_config.columnsConfig[i].name) ;
			    }	
			} else if((this.dda_config.columnsConfig[i].type).toUpperCase() === "MEASURE") {
				this.oMeasures.push(this.dda_config.columnsConfig[i]) ;
				this.msrNameArray.push(this.dda_config.columnsConfig[i].name) ;
				if(((this.dda_config.columnsConfig[i].visibility).toUpperCase() === "CHART") || ((this.dda_config.columnsConfig[i].visibility).toUpperCase() === "BOTH")) {
					this.chartMeasures.push(this.dda_config.columnsConfig[i]) ;
					this.chartMsrNames.push(this.dda_config.columnsConfig[i].name) ;
			    }
				if(((this.dda_config.columnsConfig[i].visibility).toUpperCase() === "TABLE") || ((this.dda_config.columnsConfig[i].visibility).toUpperCase() === "BOTH")) {
			    	this.tableMeasures.push(this.dda_config.columnsConfig[i]) ;
			    	this.tableMsrNames.push(this.dda_config.columnsConfig[i].name) ;
			    }
			}
		}
		
		// check for atleast one dimension & measure :
		if((!(this.chartDimensions.length)) || (!(this.chartMeasures.length))) {
			this.dda_chart.setDataset(new sap.viz.core.FlattenedDataset({}));
			return ;
		}			
		// -------------------------------------------
		
		this.stacking = this.getStacking(this.chartMeasures,this.chartDimensions);                        // TODO      workaround for stacking .
		this.isStackMsr = false;
		this.isStackDim = false;
		if(this.stacking.isEnabled && (this.stacking.type == "M"))                                     
			this.isStackMsr = true;
		else if(this.stacking.isEnabled && (this.stacking.type == "D")) 
			this.isStackDim = true;
		
		// getting chart type
		this.sapCaChartType = this.getSapCaChartType() ;	
		
		this.dda_chart.setAdvancedChartSettings({plotArea: {
													            animation: {
													                dataLoading: false,
													                dataUpdating: false,
													                resizing: false
													            }
															},
															legend:   {
															  title: { visible: false }
															}          
												});
		

		// get data for chart.....................
			if((this.dda_config.chartConfig.mode).toUpperCase() === "DUMMY") {
				this.oChartData = this.getDummyDataForChart(this.dimNameArray,this.msrNameArray) ;
				this.oChartDataModel.setData({businessData: oController.oChartData}) ;
			} else if((this.dda_config.chartConfig.mode).toUpperCase() === "RUNTIME") {
				this.getRuntimeChartData(this.dimNameArray,this.msrNameArray) ;           // TODO        P.S.  write code for avoiding multiple calls - caching .
			}						
			
			//getting labels , texts etc.
			try {
				var mProperties = sap.suite.smartbusiness.odata.properties(this._oModel.QUERY_SERVICE_URI,this._oModel.QUERY_ENTITY_SET);
			}
			catch(e) {
				jQuery.sap.log.error("Failed to instantiate the odata model");
				throw e;
			}
	        this.column_labels_mapping = mProperties.getLabelMappingObject();
	        this.dimension_text_property_mapping = mProperties.getTextPropertyMappingObject();
	        this.measure_unit_property_mapping = mProperties.getUnitPropertyMappingObject();
			
		//----------------------------------------	
						
		// if chart type = Table , do following :
		if((this.sapCaChartType).toUpperCase() === "TABLE") {
			this.updateTable(this.tableDimensions, this.tableMeasures);
			if (button) {
				if(button[0]) { button[0].setVisible(false); }
				if(button[1]) { button[1].setVisible(true); }
				if(button[3]) { button[3].setVisible(false); }
				if(button[1]) { button[1].firePress(); }
			}
			return ;
		}
		// --------------------------------------------
		
		// if dual chart is chosen and there is no measure with axis 1 or 2 :
		if((((this.dda_config.chartConfig.type).toUpperCase() == "BAR") && (this.dda_config.chartConfig.axis == "DUAL")) || (((this.dda_config.chartConfig.type).toUpperCase() == "COLUMN") && (this.dda_config.chartConfig.axis == "DUAL"))) {
			var isOneMsrAxis1 = false;
			var isOneMsrAxis2 = false;
			for(var i=0;i<this.chartMeasures.length;i++) {
				if(this.chartMeasures[i].axis == 1)
					isOneMsrAxis1 = true;
				else if(this.chartMeasures[i].axis == 2)
					isOneMsrAxis2 = true;
			}
			
			if(!(isOneMsrAxis1) || !(isOneMsrAxis2)) {
				//var alert_text = "There is no measure with axis : "+(isOneMsrAxis1 ? 2 : 1)+". Dual Axis charts require atleast one measure with axis 1 and one with axis 2 . Kindly configure the same for proper simulation.";
				sap.m.MessageBox.alert(oController._oTextsModel.getResourceBundle().getText("SELECT_MEASURE_FOR_AXIS",(isOneMsrAxis1 ? 2 : 1)));
				return ;
			}
		}
		// --------------------------------------------
		// if bubble chart chosen , but less than 3 measures selected .
		if(((this.dda_config.chartConfig.type).toUpperCase() === "BUBBLE") && (this.chartMeasures.length < 3)) {
			sap.m.MessageBox.alert(oController._oTextsModel.getResourceBundle().getText("BUBBLE_CHART_MEASURE_COUNT"));
			return;
		} 	
		
		// --------------------------------------------
				
		this.dda_chart.setChartType(this.sapCaChartType) ;	
				
		this.oDataset = this.create_Dataset(this.chartDimensions,this.chartMeasures) ;                                
		
		// axis formatters : 
		var chartType = this.dda_config.chartConfig.type ;
		var axisType = this.dda_config.chartConfig.axis ;
		var valueType = this.dda_config.chartConfig.value ;
		var locale=new sap.ui.core.Locale(sap.ui.getCore().getConfiguration().getLanguage());
    	var percentFormatter = sap.ca.ui.model.format.NumberFormat.getInstance({},locale);
		if ((chartType == 'BAR') && (valueType == "ABSOLUTE")) {
			this.dda_chart.setXAxisLabelFormatter(this.formatChartNumbers.bind(this));
			this.dda_chart.setYAxisLabelFormatter(this.pseudoChartFormatter);
			if(axisType == 'DUAL')
			{
				this.dda_chart.setXAxis2LabelFormatter(this.formatChartNumbers.bind(this));
			}
		} else if(chartType == 'BUBBLE') {
			this.dda_chart.setXAxisLabelFormatter(this.formatChartNumbers.bind(this));
			this.dda_chart.setYAxisLabelFormatter(this.formatChartNumbers.bind(this));
		} else if(((chartType == 'BAR') || (chartType == 'COLUMN')) && (valueType == 'PERCENTAGE')) {
			if(chartType == 'BAR') {
				this.dda_chart.setXAxisLabelFormatter(function(rawValue){return percentFormatter.format_percentage(rawValue);});
				this.dda_chart.setYAxisLabelFormatter(this.pseudoChartFormatter);
				if(axisType == 'DUAL') {
					this.dda_chart.setXAxis2LabelFormatter(function(rawValue){return percentFormatter.format_percentage(rawValue);});
				}
			}
			else {
				this.dda_chart.setYAxisLabelFormatter(function(rawValue){return percentFormatter.format_percentage(rawValue);});
				this.dda_chart.setXAxisLabelFormatter(this.pseudoChartFormatter);
				if(axisType == 'DUAL') {
					this.dda_chart.setYAxis2LabelFormatter(function(rawValue){return percentFormatter.format_percentage(rawValue);});
				}
			}
		} else {
			this.dda_chart.setYAxisLabelFormatter(this.formatChartNumbers.bind(this));
			this.dda_chart.setXAxisLabelFormatter(this.pseudoChartFormatter);
			if((chartType == 'COLUMN') && (axisType == 'DUAL'))
			{
				this.dda_chart.setYAxis2LabelFormatter(this.formatChartNumbers.bind(this));
			}
		}
		//--------------------------------------
		
		// data label :
		this.dda_chart.setDataLabelFormatter([
		                                     [this.formatChartNumbers.bind(this)]
		                                     ]);
		//--------------------------------------
		
		// Setting "in %" in axis for 100 percent charts :
		if(((chartType == 'BAR') || (chartType == 'COLUMN')) && (valueType == 'PERCENTAGE')) {
			var formatterArray=[[],[],[]] ;
			for(var k=0;k<this.chartMsrNames.length;k++){
				formatterArray[0].push(oController.getChartPercentFormatter(true));
				formatterArray[1].push(oController.getChartPercentFormatter(true));
			}
			this.dda_chart.setPopoverFormatter(formatterArray);
		}

		this.dda_chart.setDataset(this.oDataset) ;
		this.dda_chart.setModel(this.oChartDataModel) ;

		// show or hide legend 
		this.showChartLegendIfApplicable(this.chartDimNames,this.chartMsrNames);


		// implement custom coloring ..............................
		if((this.dda_config.chartConfig.type == "BAR") || (this.dda_config.chartConfig.type == "COLUMN") || (this.dda_config.chartConfig.type == "COMBINATION") || (this.dda_config.chartConfig.type == "LINE")) {
			if((this.dda_config.chartConfig.colorScheme).toUpperCase() === "AUTO_SEMANTIC") {
				var thresholdmsr = this.dda_config.chartConfig.thresholdMeasure || "";                 // || (this.chartMeasures)[0].name ;         // TODO                                       
				var colorArray = [];
				var tmsr = -1;
				for(var i=0;i<this.chartMeasures.length;i++) {
					colorArray.push({color: sap.ca.ui.charts.ChartSemanticColor.GoodLight}) ;
					if(this.chartMeasures[i].name === thresholdmsr)
						tmsr = i ;
				}
				if(tmsr >= 0)
					colorArray[tmsr].color = sap.ca.ui.charts.ChartSemanticColor.Neutral ;
				this.applyCustomColoring(this.dda_chart, this.dda_config.chartConfig.colorScheme, colorArray, thresholdmsr, this.DDA_MODEL.EVALUATION_DATA.GOAL_TYPE) ;
			} else if(((this.dda_config.chartConfig.colorScheme).toUpperCase() === "MANUAL_SEMANTIC") || ((this.dda_config.chartConfig.colorScheme).toUpperCase() === "MANUAL_NON_SEMANTIC")) {
				this.applyCustomColoring(this.dda_chart, this.dda_config.chartConfig.colorScheme, this.chartMeasures) ;
			}
		}
		//---------------------------------------------------------		
		
		// update table :
		this.updateTable(this.tableDimensions, this.tableMeasures);
	},  

	getSapCaChartType: function() {
		
		var sapCaChartType = sap.ca.ui.charts.ChartType.Bar ;
		var chartType = this.dda_config.chartConfig.type ;
		var axisType = this.dda_config.chartConfig.axis ;
		var valueType = this.dda_config.chartConfig.value ;
		var stacking = (this.isStackMsr || (this.isStackDim && (this.chartDimensions.length > 1))) ? true : false ;
		
		switch (chartType) {
		case "BAR":
			if(axisType === "SINGLE") {
				if(valueType === "ABSOLUTE") {
					if(stacking) {
						sapCaChartType = sap.ca.ui.charts.ChartType.StackedBar;
					} else {
						sapCaChartType = sap.ca.ui.charts.ChartType.Bar;
					}
				} else if(valueType === "PERCENTAGE") {
					sapCaChartType = sap.ca.ui.charts.ChartType.StackedBar100;
				}
			} else if(axisType === "DUAL") {
				if(valueType === "ABSOLUTE") {
					sapCaChartType = sap.ca.ui.charts.ChartType.DualStackedBar;
				} else if(valueType === "PERCENTAGE") {
					sapCaChartType = sap.ca.ui.charts.ChartType.DualStackedBar100;
				}
			} 
			break;

		case "COLUMN":
			if(axisType === "SINGLE") {
				if(valueType === "ABSOLUTE") {
					if(stacking) {
						sapCaChartType = sap.ca.ui.charts.ChartType.StackedColumn;
					} else {
						sapCaChartType = sap.ca.ui.charts.ChartType.Column;
					}
				} else if(valueType === "PERCENTAGE") {
					sapCaChartType = sap.ca.ui.charts.ChartType.StackedColumn100;
				}
			} else if(axisType === "DUAL") {
				if(valueType === "ABSOLUTE") {
					sapCaChartType = sap.ca.ui.charts.ChartType.DualStackedColumn;
				} else if(valueType === "PERCENTAGE") {
					sapCaChartType = sap.ca.ui.charts.ChartType.DualStackedColumn100;
				}
			} 
			break;

		case "LINE":
			sapCaChartType = sap.ca.ui.charts.ChartType.Line;
			break;

		case "COMBINATION":
			sapCaChartType = sap.ca.ui.charts.ChartType.Combination;
			break;

		case "BUBBLE":
			sapCaChartType = sap.ca.ui.charts.ChartType.Bubble;
			break;

		case "TABLE":
			sapCaChartType = "TABLE";
			break;

		default:
			sapCaChartType = sap.ca.ui.charts.ChartType.Bar ;

		}
		
		return sapCaChartType;
	},
	
	showChartLegendIfApplicable : function(dimensions, measures) {
   	 	var that = this;
        var otoolbar = this.getView().byId("chartToolbar") ;
        var chtype = this.dda_config.chartConfig.type ;
           
        var isStackApplied = (((chtype == "BAR") || (chtype == "COLUMN")) && (this.isisStackDim) && (this.getDimensionToBeStacked(that.chartDimensions)) && (dimensions.length > 1)) ? true : false ;        
        
        if((measures.length > 1) || (isStackApplied)) {             
        	otoolbar.setShowLegend(true);
        } else {
        	otoolbar.setShowLegend(false);
        }
    },
    
    getChartPercentFormatter: function(isStandard){
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
	
	getStacking: function(measures,dimensions) {													    // TODO
		var oStacking = {};
		oStacking.isEnabled = false;
		oStacking.type = "none";
		
		for(var i=0;i<measures.length;i++) {
			if(measures[i].stacking === 1) {
				oStacking.isEnabled = true;
				oStacking.type = "M";
			}				
		}
		if(!(oStacking.isEnabled)) {
			for(var i=0;i<dimensions.length;i++) {
				if(dimensions[i].stacking === 1) {
					oStacking.isEnabled = true;
					oStacking.type = "D";
				}				
			}
		}
		
		return oStacking;
	},
	
	setStacking: function(isEnabled,type,columns) {																// TODO     type : M for measure , D for dimension and N for none .
		var that = this;
		if(isEnabled) {
			if(type == "M") {
				for(var i=0;i<columns.length;i++) {
					if((columns[i].TYPE).toUpperCase() === "MEASURE") {
						columns[i].STACKING = 1;
					} else if((columns[i].TYPE).toUpperCase() === "DIMENSION") {
						columns[i].STACKING = 0;
					}	
				}
			} else if(type == "D") {
				for(var i=0;i<columns.length;i++) {
					if((columns[i].TYPE).toUpperCase() === "MEASURE") {
						columns[i].STACKING = 0;
					} else if((columns[i].TYPE).toUpperCase() === "DIMENSION") {
						columns[i].STACKING = 1;
					}				
				}
			}
		} else {
			for(var i=0;i<columns.length;i++) {
				columns[i].STACKING = 0;
			}
		}		
	},
	
	getDimensionToBeStacked: function(dimensions) {
		var oDim = null;
		for(var i=0;i<dimensions.length;i++) {
			if(dimensions[i].axis === 2) {
				oDim = dimensions[i];
				break;
			}
		}
		
		return oDim ;
	},
	
	setDimensionToBeStacked: function(columns,stackDim) {
		if(stackDim) {
			for(var i=0;i<columns.length;i++) {
				if((columns[i].TYPE).toUpperCase() === "DIMENSION") {
					columns[i].AXIS = 1;
					if(columns[i].NAME === stackDim) {
						columns[i].AXIS = 2;
					}
				}
			}
		}
	},
	
	updateColumnProperty: function(columns,name,property,value) {
		for(var i=0;i<columns.length;i++) {
			if(columns[i].NAME === name) {
				(columns[i])[property] = value;
				break;
			}
		}
	},
	
	getMeasuresByAxis: function(columns) {
		var dualMsr = {};
		dualMsr.axis1 = {};
		dualMsr.axis1.objArr = [];
		dualMsr.axis1.nameArr = [];
		dualMsr.axis2 = {};
		dualMsr.axis2.objArr = [];
		dualMsr.axis2.nameArr = [];
		
		for(var i=0;i<columns.length;i++) {
			if(columns[i].axis === 1) {
				dualMsr.axis1.objArr.push(columns[i]);
				dualMsr.axis1.nameArr.push(columns[i].name);
			} else if(columns[i].axis === 2) {
				dualMsr.axis2.objArr.push(columns[i]);
				dualMsr.axis2.nameArr.push(columns[i].name);
			}
		}
		return dualMsr;
	},
	
	create_Dataset: function(dimensions,measures) {
		
		var oController = this;
		
		var chtype = this.dda_config.chartConfig.type || "BAR";
		var axisType = this.dda_config.chartConfig.axis || "SINGLE";
		var valueType = this.dda_config.chartConfig.value || "ABSOLUTE";
		var stacking = this.isStackMsr;
		var dimensionToBeStacked = this.getDimensionToBeStacked(dimensions);
		
		var dataset = new sap.viz.core.FlattenedDataset({
			data: {
				path: "/businessData"
			}
		});
		
		// setting dimensions :

		for (var i = 0; i < dimensions.length; i++) {
			var val = ((this.dda_config.chartConfig.mode).toUpperCase() === "RUNTIME")? this.dimension_text_property_mapping[dimensions[i].name] : dimensions[i].name;
			var oAxis = 1;
			if(((chtype == "BAR") || (chtype == "COLUMN")) && (this.isStackDim) && (dimensionToBeStacked) && (val === dimensionToBeStacked.name) && (dimensions.length > 1)) {
				oAxis = 2;
				this.dda_chart.setStackedChartWidthEnhancer(true);
			}
			
			var dimchart = new sap.viz.ui5.data.DimensionDefinition({
				axis: oAxis,
				value: "{" + val + "}",
				name: this.column_labels_mapping[dimensions[i].name] || dimensions[i].name
			});
			dataset.addDimension(dimchart);
		}
		
		// setting measures :

		if ((chtype == "LINE") || (chtype == "COMBINATION") || ((chtype == "BAR") && (axisType == "SINGLE")) || ((chtype == "COLUMN") && (axisType == "SINGLE"))) {	

			for (var i = 0; i < measures.length; i++) {
				var val = measures[i].name;
				var msrchart = new sap.viz.ui5.data.MeasureDefinition({
					name: this.column_labels_mapping[val] || val,
					value: "{" + val + "}"
				});
				dataset.addMeasure(msrchart);
			}

		} else if (chtype == "BUBBLE") {

			for(var i=0;i<3;i++) {
				var val = measures[i].name ;
				var msrchart = new sap.viz.ui5.data.MeasureDefinition({
					group : i+1,
					name : this.column_labels_mapping[val] || val,
					value : "{"+val+"}",
				});
				dataset.addMeasure(msrchart);
			}				
			
		} else if (((chtype == "BAR") && (axisType == "DUAL")) || ((chtype == "COLUMN") && (axisType == "DUAL"))) {

			for (var i=0;i<measures.length;i++) {
				var val = measures[i].name;
				var grp = (measures[i].axis == 1 || measures[i].axis == 2) ? measures[i].axis : 2 ;
				
				var msrchart = new sap.viz.ui5.data.MeasureDefinition({
					group: grp,
					name: this.column_labels_mapping[val] || val,
					value: "{" + val + "}"

				});
				dataset.addMeasure(msrchart);
			}																										

		} 
		
		return dataset;
	},

	/*
	 * 2 Table related methods follow - same as runtime methods. 
	 */
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
    _getTableCell : function(originalMeasure, thresholdMeasure) {
        var that = this;
        if(thresholdMeasure && (originalMeasure !== thresholdMeasure)) {
            return new sap.m.ObjectNumber({
                number: {
                    path: originalMeasure
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
                    path : originalMeasure
                }
            })
        }
    },
	
	updateTable: function(dimensions,measures) {
		
		this.dda_table.destroyColumns();
		this.dda_table.destroyItems();
		
		for(var i=0;i<dimensions.length;i++) {
			var val = dimensions[i].name;
			var Label = new sap.m.Label({
				text: this.column_labels_mapping[val] || val
			});
			var columns = new sap.m.Column({
				hAlign: "Left",								
				header: Label,
				minScreenWidth: "Tablet",
				demandPopin: true,
			});
			this.dda_table.addColumn(columns);
		}
		
		for (var i=0;i<measures.length;i++) {
			var val = measures[i].name;
			var Label = new sap.m.Label({
				text: this.column_labels_mapping[val] || val
			});
			var columns = new sap.m.Column({
				hAlign: "Right",
				header: Label,
				minScreenWidth: "Tablet",
				demandPopin: true,
			});

			this.dda_table.addColumn(columns);
		}
	
		var template = new sap.m.ColumnListItem({
			//type : "Navigation",
			unread : false,			
		});
		
        for(var i=0;i<dimensions.length;i++){
          var val = ((this.dda_config.chartConfig.mode).toUpperCase() === "RUNTIME")? this.dimension_text_property_mapping[dimensions[i].name] : dimensions[i].name;
          var ocell = new sap.m.Label({
				text : "{"+val+"}"
			});
          template.addCell(ocell);

	    }
        var thresholdmsr = this._oModel["THRESHOLD_MEASURE"];
	    
        for(var i=0;i<measures.length;i++){
	          var val = measures[i].name;
	          if(this._oModel["COLOR_SCHEME"] == "AUTO_SEMANTIC")
	        	  var ocell = this._getTableCell(val, thresholdmsr);
	          else
	        	  var ocell = this._getTableCell(val, val);
	        template.addCell(ocell);
	    }
            
       this.dda_table.setModel(this.oChartDataModel);
       this.dda_table.bindAggregation("items", "/businessData", template);
		
	},	

	applyCustomColoring: function(oChart, colorScheme, arr, thresholdMeasure, improvementDirection) {                       // pass chart reference , type of coloring , measures obj , threshold measure (if applicable) and improvementDirection(either 0, 1 or 2)

		var oController = this;

		if((colorScheme).toUpperCase() === "AUTO_SEMANTIC") {                                                       

			if(((improvementDirection == "MA") || (improvementDirection == "MI")) && thresholdMeasure) {	 		                                                     
				oController.setCustomColors(oChart,arr,colorScheme) ;

				oChart.setChartSemanticColorFormatter(function(oContext) {

					var data = oChart.getModel().getData().businessData;
					var bindingContext = oContext.ctx.path.dii_a1;
					var bindingData = data[bindingContext];
					var referenceMeasureValue = bindingData[thresholdMeasure];
					if(referenceMeasureValue!=null && typeof referenceMeasureValue!='undefined') {
						if(oContext.val > referenceMeasureValue) {
							if(improvementDirection == "MA")
								return sap.ca.ui.charts.ChartSemanticColor.GoodLight;
							else if(improvementDirection == "MI")
								return sap.ca.ui.charts.ChartSemanticColor.BadLight;
						} else if(oContext.val < referenceMeasureValue) {
							if(improvementDirection == "MA")
								return sap.ca.ui.charts.ChartSemanticColor.BadLight;
							else if(improvementDirection == "MI")
								return sap.ca.ui.charts.ChartSemanticColor.GoodLight;
						} else {
							return sap.ca.ui.charts.ChartSemanticColor.Neutral;
						}
					} else {
						jQuery.sap.log.error("Threshold Measure:'"+thresholdMeasure+"' not in Dataset. Error Applying Semantic Color");
						return sap.ca.ui.charts.ChartSemanticColor.NeutralLight;
					}
				});
			} else {
				jQuery.sap.log.error("Threshold Measure not available or Goal type is RA . Error Applying Semantic Color");
			}
			
		} else if(((colorScheme).toUpperCase() === "MANUAL_SEMANTIC") || ((colorScheme).toUpperCase() === "MANUAL_NON_SEMANTIC")) {                                           
			oController.setCustomColors(oChart,arr,colorScheme) ;
		}

	},

	setCustomColors: function(oChart,msrObj,colorScheme){                           // pass chart reference and msr obj.

		var dset = oChart.getDataset() ;
		var msr = dset.getMeasures() ;
		
		var defaultColor = "";
		if((colorScheme).toUpperCase() === "AUTO_SEMANTIC" || (colorScheme).toUpperCase() === "MANUAL_SEMANTIC")
			defaultColor = sap.ca.ui.charts.ChartSemanticColor.Neutral;
		
		for(var i=0;i<msr.length;i++)
		{
			msr[i].addCustomData(new sap.ui.core.CustomData({
				key: "fillColor",
				value: msrObj[i].color || defaultColor
			})) ;
		}	          

	},
	
	set_percentCharts_uom: function() {
    	 
    	 var oController = this; 
    	 var chartType = this.dda_config.chartConfig.type ;
         var axisType = this.dda_config.chartConfig.axis ;
         var valueType = this.dda_config.chartConfig.value ;
         
         var msrLabels = [];
         for(var i=0;i<this.chartMsrNames.length;i++) {
        	 msrLabels.push(this.column_labels_mapping[this.chartMsrNames[i]] || this.chartMsrNames[i]);
         }
         
         var dualMsr = this.getMeasuresByAxis(this.chartMeasures);
         var dualMsrAxis1 = [],dualMsrAxis2 = [] ;
         for(var i=0;i<dualMsr.axis1.nameArr.length;i++) {
        	 dualMsrAxis1.push(this.column_labels_mapping[dualMsr.axis1.nameArr[i]] || dualMsr.axis1.nameArr[i]);
         }
         for(var i=0;i<dualMsr.axis2.nameArr.length;i++) {
        	 dualMsrAxis2.push(this.column_labels_mapping[dualMsr.axis2.nameArr[i]] || dualMsr.axis2.nameArr[i]);
         }
         
         var msrLabelStr = (axisType == 'DUAL') ? dualMsrAxis1.join(" & ") : msrLabels.join(" & ");
         
 		 var oChartSettings = {} ;
         
         if(this.dda_chart)
        	 oChartSettings = this.dda_chart.getAdvancedChartSettings() ? this.dda_chart.getAdvancedChartSettings() : {} ;
		
    	 if(((chartType == 'BAR') || (chartType == "COLUMN")) && (valueType == "PERCENTAGE")) {	
 			if(chartType == 'COLUMN') {
 				oChartSettings.yAxis = {
 						title : {visible : true, text : (msrLabelStr+" ("+(oController._oTextsModel.getResourceBundle().getText("IN_PERCENTAGE"))+")")}
 				};
 				if(axisType == 'DUAL') {
 	 				oChartSettings.yAxis2 = {
 	 						title : {visible : true, text : (dualMsrAxis2.join(" & ")+" ("+(oController._oTextsModel.getResourceBundle().getText("IN_PERCENTAGE"))+")")}
 	 				};
 				}
 			}
 			else if(chartType == 'BAR') {
 				oChartSettings.xAxis = {
 						title : {visible : true, text : (msrLabelStr+" ("+(oController._oTextsModel.getResourceBundle().getText("IN_PERCENTAGE"))+")")}
 				};
 				if(axisType == 'DUAL') {
 					oChartSettings.xAxis2 = {
 	 						title : {visible : true, text : (msrLabelStr+" ("+(oController._oTextsModel.getResourceBundle().getText("IN_PERCENTAGE"))+")")}
 	 				};
 					oChartSettings.xAxis = {
 	 						title : {visible : true, text : (dualMsrAxis2.join(" & ")+" ("+(oController._oTextsModel.getResourceBundle().getText("IN_PERCENTAGE"))+")")}
 	 				};
 				}
 			}
 			
 			if(this.dda_chart)
 				this.dda_chart.setAdvancedChartSettings(oChartSettings) ;
 		}
     },
	
	formatChartNumbers: function (value) {
		var locale = new sap.ui.core.Locale(sap.ui.getCore().getConfiguration().getLanguage());
		function isNumber(n) {
			return !isNaN(parseFloat(n)) && isFinite(n);
		}

		if (isNumber(value)) {
			if (!this.chartFormatter) {
				var dec = 1;                              //   TODO            numberOfDecimals
				jQuery.sap.require("sap.ca.ui.model.format.NumberFormat");
				if (dec || dec==0){
					this.chartFormatter = sap.ca.ui.model.format.NumberFormat.getInstance({
						style: 'short',
						shortDecimals: dec
					},locale);
				}

				else{
					this.chartFormatter = sap.ca.ui.model.format.NumberFormat.getInstance({
						style: 'short'
					},locale);
				}
			}
			value = this.chartFormatter.format(value);
		}

		return value;
	},
	pseudoChartFormatter: function (value) {
		return value;
	},
	
	getRuntimeChartData: function(dimensions,measures) {                          // TODO
		var that = this;
		
		var chartToolbarRef = this.getView().byId("chartToolbar");
		chartToolbarRef.setBusy(true);
		
		this.COLUMNS_SORT = [];
        for(var i=0;i<that.oColumns.length;i++) {
            if(that.oColumns[i].sortBy && that.oColumns[i].sortOrder) {
                if((that.oColumns[i].sortOrder).toUpperCase() == "ASC" || (that.oColumns[i].sortOrder).toUpperCase == "DESC") {
                    this.COLUMNS_SORT.push({
                        name : that.oColumns[i].sortBy,
                        order : that.oColumns[i].sortOrder
                    });
                }
            }
        }
        
        try{
			var oUriObject = sap.suite.smartbusiness.odata.getUri({
		        serviceUri : this._oModel.QUERY_SERVICE_URI,
		        entitySet : this._oModel.QUERY_ENTITY_SET,
		        dimension : dimensions,
		        measure : measures,
		        filter : this.DDA_MODEL.EVALUATION_DATA.FILTERS.results,
		        sort : this.COLUMNS_SORT,
	            dataLimit : (((this.dda_config.chartConfig.dataLimitations) && (this.dda_config.chartConfig.dataLimit > 0)) ? (this.dda_config.chartConfig.dataLimit) : null),
	            //includeDimensionKeyTextAttribute : true/false, default true,
	            //includeMeasureRawFormattedValueUnit : true/false, default True,
		    });
		    
		    oUriObject.model.read(oUriObject.uri, null, null, true, function(data) {
		    	if(data.results.length) {
		    		that.oChartData = data.results ;		
					that.oChartDataModel.setData({businessData: that.oChartData}) ;
				} else {
					jQuery.sap.log.info("Chart data Table Returned Empty Results");
					that.oChartData = [];		
					that.oChartDataModel.setData({businessData: that.oChartData}) ;
				}
		    	chartToolbarRef.setBusy(false);
		    }, function() {
		    	jQuery.sap.log.error("Error fetching data : "+oUriObject.uri);
		    	that.oChartData = [];		
				that.oChartDataModel.setData({businessData: that.oChartData}) ;
				chartToolbarRef.setBusy(false);
		    });
		} catch(exp){
			jQuery.sap.log.error(exp.toString());
			that.oChartData = [];		
			that.oChartDataModel.setData({businessData: that.oChartData}) ;
			chartToolbarRef.setBusy(false);
		}
	},
	
	getDummyDataForChart: function(dim,measure,MAX_D,DATA_SZ) {
		MAX_D=MAX_D|| 5;
		DATA_SZ= DATA_SZ||10;
		var chartData=[];
		var tmp,dimension={};
		for(var i=0;i<dim.length;i++){
			dimension[dim[i]]=[];
			for(var j=0;j<MAX_D;j++){
				dimension[dim[i]].push(dim[i]+"_"+j);
			}
		}

		for(var i=0;i<DATA_SZ;i++){
			tmp={};
			for(var j=0;j<dim.length;j++){
				var count= dimension[dim[j]].length;
				var p=sap.suite.smartbusiness.utils.getRandomNumber(count);
				tmp[dim[j]]=dimension[dim[j]][p];
			}
			for(var j=0;j<measure.length;j++){
				tmp[measure[j]]=sap.suite.smartbusiness.utils.getRandomNumber(100);
			}
			chartData.push(tmp);
		}
		chartData=this.sortChartData(chartData,dim);
		return chartData;
	},
	
	sortChartData: function(arr,dim) {
		var data=[];
		arr.sort(function(a,b){
			var i=0;
			while(i<dim.length){
				if(a[dim[i]]>b[dim[i]]){
					return -1;
				}
				else if(a[dim[i]]<b[dim[i]]){
					return 1;
				}
				i++;

			}

		});
		var tmp={};
		for(var i=0,k=0;i<arr.length;i++){
			var s="";
			for(var j=0;j<dim.length;j++){
				s+=arr[i][dim[j]];
			}
			if(!tmp[s]){
				tmp[s]=true;
				data[k++]=arr[i];
			}
		}
		return data;
	},

//	** For deleting a view :

	onDeleteConfiguration: function() {
		  var that=this;
		
    	  var self = that;
     	  this.confirmDialog = new sap.m.Dialog({
     		 icon:"sap-icon://warning2",
     		 title:self._oTextsModel.getResourceBundle().getText("WARNING"),
     		 state:"Error",
     		 type:"Message",
     		 content:[new sap.m.Text({text:self._oTextsModel.getResourceBundle().getText("DELETE_ALL_CONFIGURATIONS")})],
     		 beginButton: new sap.m.Button({
     			 text:self._oTextsModel.getResourceBundle().getText("OK"),
     			 press: function(){
     				//go into busy mode.
     				that.busyIndicator.open() && that.getView().setBusy(true);
     				self.deleteMaster();
     			 }
     		 }),
     		 endButton: new sap.m.Button({
     			 text:self._oTextsModel.getResourceBundle().getText("CANCEL"),
     			 press:function(){this.getParent().close();}
     		 })
     	 });
     	 this.confirmDialog.open();
	},	
	deleteMaster: function() {	
		var that = this;
		var modelData=this.getView().getModel("SB_DDACONFIG").getData();
		this.busyIndicator.open() && this.getView().setBusy(true);
		var saveService=sap.suite.smartbusiness.ddaconfig.DrilldownSaveService;
		saveService.saveEvalConfiguration(this.evaluationId,modelData,"delete",function(){
    		  jQuery.sap.log.info("Deleted master configuration for the evaluation");
      		  that.busyIndicator.close() && that.getView().setBusy(false);
      		  sap.m.MessageToast.show(that._oTextsModel.getResourceBundle().getText("EVAL_CONFIG_DELETE_SUCCESS"));
      		  that.confirmDialog.close();
      		  that.DDA_MODEL.removeAllViews();
      		  that.DDA_MODEL.setViewId("");
      		  that.bindUiToModel();
      		  that._oModel = that.DDA_MODEL.getModelDataForDDAConfiguration();
      		  that.refreshChart();
      		  that.getView().getModel().refresh();
		},function(e){
      		  jQuery.sap.log.error(e + " failed");
      		  that.busyIndicator.close() && that.getView().setBusy(false);
      		  sap.suite.smartbusiness.utils.showErrorMessage(that._oTextsModel.getResourceBundle().getText("DELETE_ERROR"));
      	  });
	},
	// --------------------------------------------------------------------------------------------

	onViewSwitch: function(oEvent) {
		var sKey = oEvent.getParameter("selectedKey");
		this.viewId = sKey;
		this.DDA_MODEL.setViewId(this.viewId);
		this._oModel = this.DDA_MODEL.getModelDataForDDAConfiguration();
		this.bindUiToModel();
		this.refreshChart();
	},
	
	updateHeaderFooterOptions: function(paste) {
		this.setBtnEnabled("Paste",paste);
	},
	
	checkEvaluationForPaste: function() {
		var currentEvaluationData = this.EVALUATION.evaluationData;
		var currentMasterData = this.getView().getModel("SB_DDACONFIG").getData();

		if((this.copyClipboard.evaluationData.ID == currentEvaluationData.ID) || this.checkEvaluationForPaste1()) {
			this.updateHeaderFooterOptions(false);
		}
		else {
			this.updateHeaderFooterOptions(true);
		}
		
//		if(this.copyClipboard.evaluationData.ID != currentEvaluationData.ID) {
//			for(var i=0,l=this.copyClipboard.MasterData.ALL_MEASURES.length; i<l; i++) {
//				if(currentMasterData.ALL_MEASURES.indexOf(this.copyClipboard.MasterData.ALL_MEASURES[i]) == -1) {
//					this.updateHeaderFooterOptions(false);
//					return;
//				}
//			}
//			for(var i=0,l=this.copyClipboard.MasterData.ALL_DIMENSIONS.length; i<l; i++) {
//				if(currentMasterData.ALL_DIMENSIONS.indexOf(this.copyClipboard.MasterData.ALL_DIMENSIONS[i]) == -1) {
//					this.updateHeaderFooterOptions(false);
//					return;
//				}
//			}
//			this.updateHeaderFooterOptions(true);
//		}
//		else {
//			this.updateHeaderFooterOptions(false);
//		}
//		return;
	},
	
	checkEvaluationForPaste1: function() {
		//var currentEvaluationData = this.EVALUATION.evaluationData;
		var masterData = this.copyClipboard.masterData;
		var measures = {};
		var dimensions = {};
		if(this.getView().getModel("SB_DDACONFIG").getData().ALL_MEASURES.length) {
			if(this.getView().getModel("SB_DDACONFIG").getData().ALL_MEASURES.length == 1) {
				measures[this.getView().getModel("SB_DDACONFIG").getData().ALL_MEASURES[0]] = "M";
			}
			else {
				measures = this.getView().getModel("SB_DDACONFIG").getData().ALL_MEASURES.reduce(function(p,c,i,a) { measures = measures || {}; if(i == 1){ measures[a[0]] = "M"; }  measures[a[i]] = "M"; return measures;});
			}
		}
		if(this.getView().getModel("SB_DDACONFIG").getData().ALL_DIMENSIONS.length) {
			if(this.getView().getModel("SB_DDACONFIG").getData().ALL_DIMENSIONS.length == 1) {
				dimensions[this.getView().getModel("SB_DDACONFIG").getData().ALL_DIMENSIONS[0]] = "D";
			}
			else {
				dimensions = this.getView().getModel("SB_DDACONFIG").getData().ALL_DIMENSIONS.reduce(function(p,c,i,a) { dimensions = dimensions || {}; if(i == 1){ dimensions[a[0]] = "D"; }  dimensions[a[i]] = "D"; return dimensions;});
			}
		}
		
		var error = null;
		this.diffHeaders = [];
		
		for(var i=0,l=masterData.FILTERS.length; i<l; i++) {
			delete masterData.FILTERS[i].__metadata;
			if(dimensions[masterData.FILTERS[i].DIMENSION] != "D") {
				if(error == null) {
					error = {};
				}
				if(error.DIMENSIONS == undefined) {
					error.DIMENSIONS = {};
				}
				if(error.DIMENSIONS[masterData.FILTERS[i].DIMENSION] == undefined) {
					error.DIMENSIONS[masterData.FILTERS[i].DIMENSION] = [];
				} 
				masterData.FILTERS[i].entityType = "FILTER";
				error.DIMENSIONS[masterData.FILTERS[i].DIMENSION].push(masterData.FILTERS[i]);
			}
		}
		
		for(var i=0,l=masterData.CHART.length; i<l; i++) {
			delete masterData.CHART[i].__metadata;
			if(masterData.CHART[i].THRESHOLD_MEASURE) {
				if(measures[masterData.CHART[i].THRESHOLD_MEASURE] != "M") {
					if(error == null) {
						error = {};
					}
					if(error.MEASURES == undefined) {
						error.MEASURES = {};
					}
					if(error.MEASURES[masterData.CHART[i].THRESHOLD_MEASURE] == undefined) {
						error.MEASURES[masterData.CHART[i].THRESHOLD_MEASURE] = [];	
					}
					masterData.CHART[i].entityType = "THRESHOLD_MEASURE";
					error.MEASURES[masterData.CHART[i].THRESHOLD_MEASURE].push(masterData.CHART[i]);
				}
			}
		}

		for(var i=0,l=masterData.COLUMNS.length; i<l; i++) {
			delete masterData.COLUMNS[i].__metadata;
			var measure = null;
			var dimension = null;
			if(masterData.COLUMNS[i].TYPE == "MEASURE") {
				if((measures[masterData.COLUMNS[i].NAME] != "M")) {
					if(error == null) {
						error = {};
					}
					if(error.MEASURES == undefined) {
						error.MEASURES = {};
					}
					if(error.MEASURES[masterData.COLUMNS[i].NAME] == undefined) {
						error.MEASURES[masterData.COLUMNS[i].NAME] = [];	
					}
					masterData.COLUMNS[i].entityType = "MEASURE";
					error.MEASURES[masterData.COLUMNS[i].NAME].push(masterData.COLUMNS[i]);
					//error.MEASURES[masterData.COLUMNS[i].NAME][error.MEASURES[masterData.COLUMNS[i].NAME].length-1].entityType = "MEASURE";
				}
				if((measures[masterData.COLUMNS[i].SORT_BY] != "M")) {
					if(error == null) {
						error = {};
					}
					if(error.MEASURES == undefined) {
						error.MEASURES = {};
					}
					if(error.MEASURES[masterData.COLUMNS[i].SORT_BY] == undefined) {
						error.MEASURES[masterData.COLUMNS[i].SORT_BY] = [];	
					}
					measure = jQuery.extend(true, {}, masterData.COLUMNS[i], {});
					measure.entityType = "SORT_BY";
					error.MEASURES[masterData.COLUMNS[i].SORT_BY].push(measure);
				}
			}
			else if(masterData.COLUMNS[i].TYPE == "DIMENSION") {
				if((dimensions[masterData.COLUMNS[i].NAME] != "D")) {
					if(error == null) {
						error = {};
					}
					if(error.DIMENSIONS == undefined) {
						error.DIMENSIONS = {};
					}
					if(error.DIMENSIONS[masterData.COLUMNS[i].NAME] == undefined) {
						error.DIMENSIONS[masterData.COLUMNS[i].NAME] = [];	
					}
					masterData.COLUMNS[i].entityType = "DIMENSION";
					error.DIMENSIONS[masterData.COLUMNS[i].NAME].push(masterData.COLUMNS[i]);
					//error.DIMENSIONS[masterData.COLUMNS[i].NAME][error.DIMENSIONS[masterData.COLUMNS[i].NAME].length-1].entityType = "DIMENSION";
				}
				if((dimensions[masterData.COLUMNS[i].SORT_BY] != "D")) {
					if(error == null) {
						error = {};
					}
					if(error.DIMENSIONS == undefined) {
						error.DIMENSIONS = {};
					}
					if(error.DIMENSIONS[masterData.COLUMNS[i].SORT_BY] == undefined) {
						error.DIMENSIONS[masterData.COLUMNS[i].SORT_BY] = [];	
					}
					dimension = jQuery.extend(true, {}, masterData.COLUMNS[i], {});
					dimension.entityType = "SORT_BY";
					error.DIMENSIONS[masterData.COLUMNS[i].SORT_BY].push(dimension);
				}
			}
		}
		
		for(var i=0,l=masterData.HEADER.length; i<l; i++) {
			if(masterData.HEADER[i].EVALUATION_ID !== masterData.HEADER[i].REFERENCE_EVALUATION_ID) {
				this.diffHeaders.push(masterData.HEADER[i]);
			}
			else {
				if((masterData.HEADER[i].VISUALIZATION_TYPE != "NT") && (masterData.HEADER[i].VISUALIZATION_TYPE != "AT")) {
					if((masterData.HEADER[i].VISUALIZATION_TYPE === "CM")) {
						var measuresArr = undefined;
						try{
							measuresArr = JSON.parse(JSON.parse(masterData.HEADER[i].CONFIGURATION).MEASURES);
						}
						catch(e) {
							throw new Error("Failed to parse multiple measures of Comparison Chart Multiple Measures");
						}
						
						for(var j=0,m=measuresArr.length; i<m; i++) {
							if(measures[measuresArr[j]["name"]] != "M") {
								masterData.HEADER[i].entityType = "HEADERS";
								if(error == null) {
									error = {};
								}
								if(error.MEASURES == undefined) {
									error.MEASURES = {};
								}
								if(error.MEASURES[measuresArr[j]["name"]] == undefined) {
									error.MEASURES[measuresArr[j]["name"]] = [];	
								}
								error.MEASURES[measuresArr[j]["name"]].push(masterData.HEADER[i]);
								break;
							}
						}
					}
					else {
						if(dimensions[masterData.HEADER[i].DIMENSION] != "D") {
							masterData.HEADER[i].entityType = "HEADERS";
							if(error == null) {
								error = {};
							}
							if(error.DIMENSIONS == undefined) {
								error.DIMENSIONS = {};
							}
							if(error.DIMENSIONS[masterData.HEADER[i].DIMENSION] == undefined) {
								error.DIMENSIONS[masterData.HEADER[i].DIMENSION] = [];	
							}
							error.DIMENSIONS[masterData.HEADER[i].DIMENSION].push(masterData.HEADER[i]);
						}
					}
				}
			}
		}
		return error;
	},
	
	copyEvaluationToClipboard: function() {
		var that = this;
		var copyToClipboard = function() {
			that.copyClipboard = {};
			that.copyClipboard.MasterData = that.getView().getModel("SB_DDACONFIG").getData();
			that.copyClipboard.masterData = sap.suite.smartbusiness.ddaconfig.MasterData;
			that.copyClipboard.evaluationData = that.EVALUATION.evaluationData;
			sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("COPY_DDA_TO_CLIPBOARD", that.EVALUATION.evaluationData.TITLE || (that.EVALUATION.evaluationData.ID + "*")));
			that.updateHeaderFooterOptions(false);
		}
		if(sap.suite.smartbusiness.ddaconfig.MasterData.HEADER && sap.suite.smartbusiness.ddaconfig.MasterData.HEADER.length) {
			var diffHeaders = [];
			for(var i=0,l=sap.suite.smartbusiness.ddaconfig.MasterData.HEADER.length; i<l; i++) {
				if(sap.suite.smartbusiness.ddaconfig.MasterData.HEADER[i].EVALUATION_ID != sap.suite.smartbusiness.ddaconfig.MasterData.HEADER[i].REFERENCE_EVALUATION_ID) {
					diffHeaders.push(sap.suite.smartbusiness.ddaconfig.MasterData.HEADER[i]);
				}
			}
			if(diffHeaders && diffHeaders.length) {
				that.warnDialog = that.warnDialog || new sap.m.Dialog({
					icon:"sap-icon://warning2",
					title:that.oApplicationFacade.getResourceBundle().getText("WARNING"),
					state:"Warning",
					type:"Message",
					content:[new sap.m.Text({text:that.oApplicationFacade.getResourceBundle().getText("RELATED_KPIS_HEADER_TILES_EXIST_WARN")})],
					beginButton: new sap.m.Button({
						text:that.oApplicationFacade.getResourceBundle().getText("CONTINUE"),
						press: function(){
							that.warnDialog.close();
							copyToClipboard();
						}
					})//,
//					endButton: new sap.m.Button({
//						text:that.oApplicationFacade.getResourceBundle().getText("CANCEL"),
//						press:function(){
//							that.warnDialog.close();
//						}
//					})   	                                           
				});
				that.warnDialog.open();
			}
			else {
				copyToClipboard();
			}
		}
		else {
			copyToClipboard();
		}
	},
	
	copyDDAConfiguration: function() {
		var that = this;
		if(this.copyClipboard && this.copyClipboard.evaluationData) {
			var payload = {sourceEvaluationId:this.copyClipboard.evaluationData.ID, targetEvaluationId: this.EVALUATION.evaluationData.ID};
			var callCopyDDA = function(){
				sap.suite.smartbusiness.utils.create(sap.suite.smartbusiness.utils.serviceUrl("COPY_DDA_CONFIGURATION_SERVICE_URI"),payload,null,function(data){
					sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("DDA_COPY_SUCCESS"));
					that.getView().getModel().refresh();
					var evt = {
							getParameter: function(param) {
								var evtObj = {
										name:"detail",
										arguments:{contextPath: "EVALUATIONS_DDA('" + that.evaluationId + "')"}  
								};
								return evtObj[param];
							}	
					};
					that.onRoutePatternMatched(evt);
				},function(err){
					sap.suite.smartbusiness.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("DDA_COPY_ERROR"), err.responseText);
				});
			};
			if(sap.suite.smartbusiness && sap.suite.smartbusiness.ddaconfig && sap.suite.smartbusiness.ddaconfig && sap.suite.smartbusiness.ddaconfig.MasterData && sap.suite.smartbusiness.ddaconfig.MasterData.MASTER && sap.suite.smartbusiness.ddaconfig.MasterData.MASTER.length) {
				this.warnOverwriteDialog = this.warnOverwriteDialog || new sap.m.Dialog({
				icon:"sap-icon://warning2",
				title:that.oApplicationFacade.getResourceBundle().getText("WARNING"),
				state:"Warning",
				type:"Message",
				content:[new sap.m.Text({text:that.oApplicationFacade.getResourceBundle().getText("DDA_CONFIG_EXISTING_WARN")})],
				beginButton: new sap.m.Button({
					text:that.oApplicationFacade.getResourceBundle().getText("CONTINUE"),
					press: function(){
						that.warnOverwriteDialog.close();
						callCopyDDA();
					}
				}),
				endButton: new sap.m.Button({
					text:that.oApplicationFacade.getResourceBundle().getText("CANCEL"),
					press:function(){
						that.warnOverwriteDialog.close();
					}
				})   	                                           
			});
			this.warnOverwriteDialog.open();
			}
			else {
				callCopyDDA();
			}
		}
	},
	
	checkForCopy: function() {
		if(sap.suite.smartbusiness.ddaconfig && sap.suite.smartbusiness.ddaconfig.MasterData && sap.suite.smartbusiness.ddaconfig.MasterData.MASTER && sap.suite.smartbusiness.ddaconfig.MasterData.MASTER.length) {
			this.setBtnEnabled("Copy",true);
		}
		else {
			this.setBtnEnabled("Copy",false);
		}
	},
	
	onAfterRendering: function() {
		this.setBtnEnabled("Paste",false);
		this.checkForCopy();
	}
	

});