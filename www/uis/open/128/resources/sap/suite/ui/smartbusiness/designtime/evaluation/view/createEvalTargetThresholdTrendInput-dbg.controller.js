sap.ui.controller("sap.suite.ui.smartbusiness.designtime.evaluation.view.createEvalTargetThresholdTrendInput", {

	onBeforeRendering : function(){

		var that = this;

		this.parentController = this.getView().getViewData().controller;
		this.oApplicationFacade = this.parentController.oApplicationFacade;
		this.oResourceBundle = this.oApplicationFacade.getResourceBundle(); 

		this.getView().getModel().getData().VALUES_SOURCE = this.getView().byId("valueTypeSelect").getSelectedKey();
		if(this.getView().getModel().getData().TREND){
			this.getView().byId('applyTrendCheckBox').setSelected(true);
		}
		else{
			this.getView().byId('applyTrendCheckBox').setSelected(false);
		}
		
		this.createTrendThresholdLayout();

	},

	openMeasureSelectDialog : function(oEvent){

		var that=this;
		this.valueType = oEvent.getSource().getCustomData()[0].getKey();
		var oDataUrl = this.parentController.getView().getModel().getData().ODATA_URL;
		var oDataEntitySet = this.parentController.getView().getModel().getData().ODATA_ENTITYSET;
		
		
		if(!(oDataUrl && oDataEntitySet)){
			sap.suite.smartbusiness.utils.showErrorMessage(that.oResourceBundle.getText("ERROR_WRONG_ENTITY_SET"));
			return;
		}
		else{
			var measureModel = this.populateMeasure(oDataUrl,oDataEntitySet);
			var measureSelectDialog = new sap.m.SelectDialog({
				title: that.oResourceBundle.getText("SELECT_MEASURE"),
				noDataText: that.oResourceBundle.getText("NO_DATA_FOUND"),
				items: {
					path: "/measures",
					template: new sap.m.StandardListItem({
						title:"{measureName}",

					})},
					confirm: function(oEvent){

						switch(that.valueType){
						case "REFERENCE_VALUE" : 
							that.getView().getModel().setProperty("/REFERENCE_VALUE",oEvent.getParameter("selectedItem").getProperty("title"));
							break;
						case "CRITICALHIGH" : 
							that.getView().getModel().setProperty("/CRITICALHIGH",oEvent.getParameter("selectedItem").getProperty("title"));
							break;
						case "WARNINGHIGH" : 
							that.getView().getModel().setProperty("/WARNINGHIGH",oEvent.getParameter("selectedItem").getProperty("title"));
							break;
						case "TARGET" : 
							that.getView().getModel().setProperty("/TARGET",oEvent.getParameter("selectedItem").getProperty("title"));
							break;
						case "WARNINGLOW" : 
							that.getView().getModel().setProperty("/WARNINGLOW",oEvent.getParameter("selectedItem").getProperty("title"));
							break;
						case "CRITICALLOW" : 
							that.getView().getModel().setProperty("/CRITICALLOW",oEvent.getParameter("selectedItem").getProperty("title"));
							break;
						case "TREND" : 
							that.getView().getModel().setProperty("/TREND",oEvent.getParameter("selectedItem").getProperty("title"));
							break;
						};

					},
					liveChange: function(oEvent){
						var searchValue = oEvent.getParameter("value");
						var oFilter = new sap.ui.model.Filter("measureName", sap.ui.model.FilterOperator.Contains, searchValue);
						var oBinding = oEvent.getSource().getBinding("items");
						oBinding.filter([oFilter],false);
					}
			});           
			measureSelectDialog.setModel(measureModel);
			measureSelectDialog.open();
		}
	},
	
	validateQueryServiceURI : function(dataSource) {
		dataSource = jQuery.trim(dataSource);
		if (!jQuery.sap.startsWith(dataSource, "/")) {
			dataSource = "/" + dataSource;
		}
		if (jQuery.sap.endsWith(dataSource, "/")) {
			dataSource = dataSource.substring(0, dataSource.length - 1);
		}
		return dataSource;
	},
	
	populateMeasure : function(dataSource, entitySet) {
		dataSource = this.validateQueryServiceURI(dataSource) + "";
		entitySet = entitySet + "";
		var measures = [], measureDataArray = [], obj = {};
		var i;

		measures = sap.suite.smartbusiness.odata.getAllMeasures(dataSource, entitySet);

		for (i = 0; i < measures.length; i++) {
			obj = {};
			obj.measureName = measures[i];
			measureDataArray.push(obj);
		}
		var oModel = new sap.ui.model.json.JSONModel();
		oModel.setData({
			measures : measureDataArray
		});
		return oModel;
	},

	createTrendThresholdLayout : function(){

		var that = this;

		var viewModelData = this.getView().getModel().getData();

		if(viewModelData){
			this.createTrendLayout();
			switch(viewModelData.GOAL_TYPE){

			case "MA" :
				that.createLayoutForMaximizingKPI();

				this.getView().byId('kpiGoalTypeImage').setSrc("../../resources/sap/suite/ui/smartbusiness/designtime/evaluation/img/Maximizing.png");
				this.getView().byId('kpiGoalTypeLabel').setText(that.oResourceBundle.getText("KPI_GOAL_TYPE_MAXIMIZING"));
				this.getView().byId('criticalLowLabel').setText(that.oResourceBundle.getText("CRITICAL"));
				this.getView().byId('warningLowLabel').setText(that.oResourceBundle.getText("WARNING"));
				this.getView().byId('criticalHighLabel').setVisible(false);
				this.getView().byId('warningHighLabel').setVisible(false);
				this.getView().byId('evaluationCriticalHigh').setVisible(false);
				this.getView().byId('evaluationWarningHigh').setVisible(false);
				break;

			case "MI" : 
				that.createLayoutForMinimizingKPI();

				this.getView().byId('kpiGoalTypeImage').setSrc("../../resources/sap/suite/ui/smartbusiness/designtime/evaluation/img/Minimizing.png");
				this.getView().byId('kpiGoalTypeLabel').setText(that.oResourceBundle.getText("KPI_GOAL_TYPE_MINIMIZING"));                                                
				this.getView().byId('criticalHighLabel').setText(that.oResourceBundle.getText("CRITICAL"));
				this.getView().byId('warningHighLabel').setText(that.oResourceBundle.getText("WARNING"));
				this.getView().byId('criticalLowLabel').setVisible(false);
				this.getView().byId('warningLowLabel').setVisible(false);
				this.getView().byId('evaluationCriticalLow').setVisible(false);
				this.getView().byId('evaluationWarningLow').setVisible(false);
				break;

			case "RA" :
				that.createLayoutForRangeKPI();

				this.getView().byId('kpiGoalTypeImage').setSrc("../../resources/sap/suite/ui/smartbusiness/designtime/evaluation/img/Range.png");
				this.getView().byId('criticalLowLabel').setText(that.oResourceBundle.getText("CRITICAL_LOW"));
				this.getView().byId('warningLowLabel').setText(that.oResourceBundle.getText("WARNING_LOW"));
				this.getView().byId('criticalHighLabel').setText(that.oResourceBundle.getText("CRITICAL_HIGH"));
				this.getView().byId('warningHighLabel').setText(that.oResourceBundle.getText("WARNING_HIGH"));
				this.getView().byId('kpiGoalTypeLabel').setText(that.oResourceBundle.getText("KPI_GOAL_TYPE_RANGE"));
				break;
			};
		}
	},

	createLayoutForMaximizingKPI : function(){

		var that = this;
		switch(this.getView().byId('valueTypeSelect').getSelectedKey()){

		case "MEASURE" : 
			that.getView().byId('evaluationCriticalLow').setShowValueHelp(true);
			that.getView().byId('evaluationWarningLow').setShowValueHelp(true);
			that.getView().byId('evaluationTarget').setShowValueHelp(true);
			that.getView().byId('evaluationReferenceValue').setShowValueHelp(true);
			break;

		case "FIXED" : 

			that.getView().byId('evaluationCriticalLow').setShowValueHelp(false);
			that.getView().byId('evaluationWarningLow').setShowValueHelp(false);
			that.getView().byId('evaluationTarget').setShowValueHelp(false);
			that.getView().byId('evaluationReferenceValue').setShowValueHelp(false);
			break;
		};
	},

	createLayoutForMinimizingKPI : function(){

		var that = this;
		switch(this.getView().byId('valueTypeSelect').getSelectedKey()){

		case "MEASURE" : 
			that.getView().byId('evaluationCriticalHigh').setShowValueHelp(true);
			that.getView().byId('evaluationWarningHigh').setShowValueHelp(true);
			that.getView().byId('evaluationTarget').setShowValueHelp(true);
			that.getView().byId('evaluationReferenceValue').setShowValueHelp(true);
			break;

		case "FIXED" : 
			that.getView().byId('evaluationCriticalHigh').setShowValueHelp(false);
			that.getView().byId('evaluationWarningHigh').setShowValueHelp(false);
			that.getView().byId('evaluationTarget').setShowValueHelp(false);
			that.getView().byId('evaluationReferenceValue').setShowValueHelp(false);
			break;
		};
	},

	createLayoutForRangeKPI : function(){

		var that = this;
		switch(this.getView().byId('valueTypeSelect').getSelectedKey()){

		case "MEASURE" : 
			var measureSelectFunction = jQuery.proxy(that.openMeasureSelectDialog,that);
			that.getView().byId('evaluationCriticalHigh').setShowValueHelp(true);
			that.getView().byId('evaluationWarningHigh').setShowValueHelp(true);
			that.getView().byId('evaluationCriticalLow').setShowValueHelp(true);
			that.getView().byId('evaluationWarningLow').setShowValueHelp(true);
			that.getView().byId('evaluationTarget').setShowValueHelp(true);
			that.getView().byId('evaluationReferenceValue').setShowValueHelp(true);
			break;

		case "FIXED" : 
			that.getView().byId('evaluationCriticalLow').setShowValueHelp(false);
			that.getView().byId('evaluationWarningLow').setShowValueHelp(false);
			that.getView().byId('evaluationCriticalHigh').setShowValueHelp(false);
			that.getView().byId('evaluationWarningHigh').setShowValueHelp(false);
			that.getView().byId('evaluationTarget').setShowValueHelp(false);
			that.getView().byId('evaluationReferenceValue').setShowValueHelp(false);
			break;
		};
	},
	
	createMeasuresDialog : function(){
		var that = this;
		var oDataUrl = this.parentController.getView().getModel().getData().ODATA_URL;
		var oDataEntitySet = this.parentController.getView().getModel().getData().ODATA_ENTITYSET;
		if(!(oDataUrl && oDataEntitySet)){
			sap.suite.smartbusiness.utils.showErrorMessage(that.oResourceBundle.getText("ERROR_WRONG_ENTITY_SET"));
			return;
		}
		var measureModel = this.populateMeasure(oDataUrl,oDataEntitySet);
		that.measuresDialog = new sap.m.SelectDialog({
			title: that.oResourceBundle.getText("SELECT_MEASURE"),
			noDataText: that.oResourceBundle.getText("NO_DATA_FOUND"),
			multiSelect : true,
			items: {
				path: "/measures",
				template: new sap.m.StandardListItem({
					title:"{measureName}",

				})},
			confirm : function(oEvent){
				var oSelectedItem = oEvent.getParameter("selectedItems");
				for ( var key in oSelectedItem)
				{   
					that.byId("additionalMeasures").addToken(new sap.m.Token({text : oSelectedItem[key].getTitle()}));
					that.measuresDialog.removeItem(oSelectedItem[key]);
				}
			}
		});
		that.measuresDialog.setModel(measureModel);
	},
	
	openAdditionalMeasures : function(oEvent){
		var that = this;
		if(!that.measuresDialog){
			that.createMeasuresDialog();
		}
		var items = that.measuresDialog.getItems();
		var tokens = that.byId("additionalMeasures").getTokens();
		for(var i=0;i<tokens.length;i++){
			for(var j=0;j<items.length;j++){
				if(tokens[i].getText() === items[j].getTitle()){
					that.measuresDialog.removeItem(items[j]);
				}
			}
		}
		that.measuresDialog.open();
	},
	
	multiMeasureTokenChange : function(oEvent){
		var that = this;
		if(oEvent.getParameter("type") == "removed"){
			if(!that.measuresDialog){
				that.createMeasuresDialog();
			}
			var item = oEvent.getParameter("token");
			var measures = [];
			measures = that.measuresDialog.getModel().getData().measures;
			for(var i=0;i<measures.length;i++){
				if(measures[i].measureName === item.getText()){
					that.measuresDialog.addItem(
							new sap.m.StandardListItem({
								title : item.getText(),
							})
						);
				}
			}
			
		}
		var measures = [];
		measures = that.byId("additionalMeasures").getTokens();
		for(var i=0,l=measures.length; i<l; i++) {
			if(measures[i].getText() == that.getView().getModel().getData().COLUMN_NAME) {
				that.byId("additionalMeasures").setValueState("Error");
				//sap.suite.smartbusiness.utils.showErrorMessage(this.getView().getViewData().controller.oApplicationFacade.getResourceBundle().getText("ADDI_MEASURE_HAS_MAIN_MEASURE"));
				return;
			}
			else{
				that.byId("additionalMeasures").setValueState("None");
			}
		}
		
	},
	multiMeasureChange : function(value){
		var that = this;
		var measures = [];
		measures = that.byId("additionalMeasures").getValue().split(",");
		for(var i=0;i<measures.length;i++){
			that.byId("additionalMeasures").setValue("")
			that.byId("additionalMeasures").addToken(new sap.m.Token({text : measures[i]}));
		}
		measures = that.byId("additionalMeasures").getTokens();
		if(measures.length == 0){
			that.byId("additionalMeasures").setValueState("None");
		}
		for(var i=0,l=measures.length; i<l; i++) {
			if(measures[i].getText() == that.getView().getModel().getData().COLUMN_NAME) {
				that.byId("additionalMeasures").setValueState("Error");
				//sap.suite.smartbusiness.utils.showErrorMessage(that.oResourceBundle.getText("ADDI_MEASURE_HAS_MAIN_MEASURE"));
				return;
			}
			else{
				that.byId("additionalMeasures").setValueState("None");
			}
		}
	},
	
	applyAdditionalMeasuresCheckBoxSelected : function(){
		var that = this;
		if(this.getView().byId('selectAdditionalMeasuresCheckBox').getSelected()){
			that.getView().byId('additionalMeasures').setVisible(true);
		}
		else{
			var backDialog = new sap.m.Dialog({
				icon:"sap-icon://warning2",
				title:that.oResourceBundle.getText("WARNING"),
				state:"Warning",
				type:"Message",
				content:[new sap.m.Text({text:that.oResourceBundle.getText("ON_ADIITIONAL_MEASURES_DESELECT")})],
				beginButton: new sap.m.Button({
					text:that.oResourceBundle.getText("CONTINUE"),
					press: function(){
						var tokens = that.getView().byId('additionalMeasures').getTokens();
						for(var i=0;i<tokens.length;i++){
							if(that.measuresDialog){
								that.measuresDialog.addItem(
										new sap.m.StandardListItem({
											title : tokens[i].getText(),
										})
									);
						
							}
						}
						that.getView().byId('additionalMeasures').removeAllTokens();
						that.getView().byId('additionalMeasures').setVisible(false);
						backDialog.close();
						
					}
				}),
				endButton: new sap.m.Button({
					text:that.oResourceBundle.getText("CANCEL"),
					press:function(){
						that.getView().byId('selectAdditionalMeasuresCheckBox').setSelected(true);
						backDialog.close();
					}
				})                                                
			});
			backDialog.open();
		}
		
	},

	applyTrendCheckBoxSelected : function(){
		if(this.getView().byId('applyTrendCheckBox').getSelected()){
			this.getView().getModel().getData().TREND = "";
			this.getView().getModel().updateBindings();
			this.getView().byId('trendLabel').setVisible(true);
			this.getView().byId('evaluationTrend').setVisible(true);

			this.createTrendLayout();
		}
		else{
			this.getView().getModel().getData().TREND = "";
			this.getView().getModel().updateBindings();
			this.getView().byId('trendLabel').setVisible(false);
			this.getView().byId('evaluationTrend').setShowValueHelp(false);
			this.getView().byId('evaluationTrend').setVisible(false);
		}
	},

	createTrendLayout : function(){
		var that = this;

		if(this.getView().byId('applyTrendCheckBox').getSelected()){
			switch((this.getView().byId('valueTypeSelect').getSelectedKey()).toUpperCase()){

			case "MEASURE" :  
				that.getView().byId('evaluationTrend').setShowValueHelp(true);

				break;
			case "FIXED" : 
				that.getView().byId('evaluationTrend').setShowValueHelp(false);
				break;

			default : break;
			};
		}
		else{
			that.getView().byId('trendLabel').setVisible(false);
			that.getView().byId('evaluationTrend').setShowValueHelp(false);
			that.getView().byId('evaluationTrend').setVisible(false);
		}
	},

	valueTypeSelectChange : function(){
		this.getView().getModel().getData().REFERENCE_VALUE = "";
		this.getView().getModel().getData().CRITICALLOW = "";
		this.getView().getModel().getData().WARNINGLOW = "";
		this.getView().getModel().getData().TARGET = "";
		this.getView().getModel().getData().WARNINGHIGH = "";
		this.getView().getModel().getData().CRITICALHIGH = "";
		this.getView().getModel().getData().TREND = "";

		this.getView().getModel().updateBindings();

		this.createTrendThresholdLayout();
	}
});
