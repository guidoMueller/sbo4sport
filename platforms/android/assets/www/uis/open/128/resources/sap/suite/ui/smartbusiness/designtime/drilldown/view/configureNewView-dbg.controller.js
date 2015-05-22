jQuery.sap.require("sap.ca.scfld.md.controller.ScfldMasterController");
jQuery.sap.require("sap.suite.ui.smartbusiness.lib.Util")
jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("sap.m.MessageToast");
sap.ca.scfld.md.controller.ScfldMasterController.extend("sap.suite.ui.smartbusiness.designtime.drilldown.view.configureNewView",{
	onInit:function(){
		this.DDA_MODEL = null;
		this.evaluationId = null;
		this.measureDimensionList=this.byId(sap.ui.core.Fragment.createId('measureDimensionsList','measureDimensionsList'));
		this._oDimensionList=sap.ui.xmlfragment("sap.suite.ui.smartbusiness.designtime.drilldown.view.list",this);
		this._oMeasureList=sap.ui.xmlfragment("sap.suite.ui.smartbusiness.designtime.drilldown.view.list",this);

		try{
			if(sap.ui.core.Fragment.byId("measureDimensionDialog","measureDimensionDialog")){
				sap.ui.core.Fragment.byId("measureDimensionDialog","measureDimensionDialog").destroy();
			} 
			if(sap.ui.core.Fragment.byId("thresholdDialog","dialogRef")){
				sap.ui.core.Fragment.byId("thresholdDialog","dialogRef").destroy();
			}
			if(sap.ui.core.Fragment.byId("editDialog","editDialog")){
				sap.ui.core.Fragment.byId("editDialog","editDialog").destroy();
			}
			if(sap.ui.core.Fragment.byId("dualAxisConfig","dualAxisConfig")){
				sap.ui.core.Fragment.byId("dualAxisConfig","dualAxisConfig").destroy();
			}
			if(sap.ui.core.Fragment.byId("msrDialogForStack1","stack1SelectDialog")){
				sap.ui.core.Fragment.byId("msrDialogForStack1","stack1SelectDialog").destroy();
			}
			if( sap.ui.core.Fragment.byId("additionalLanguageDialog","additionalLanguageDialog")){
				sap.ui.core.Fragment.byId("additionalLanguageDialog","additionalLanguageDialog").destroy();
			}
			if( sap.ui.core.Fragment.byId("chartTypeConfig","chartTypeConfig")){
				sap.ui.core.Fragment.byId("chartTypeConfig","chartTypeConfig").getParent().destroy();
			}

		}catch(e){};
		this._oShowMeasureDialog = sap.ui.xmlfragment("measureDimensionDialog","sap.suite.ui.smartbusiness.designtime.drilldown.view.measureDimensionDialog", this);
		this._oShowMeasureDialog.addStyleClass("dialog");
		this.addThresholdMeasureDialog=sap.ui.xmlfragment("thresholdDialog","sap.suite.ui.smartbusiness.designtime.drilldown.view.addThresholdMeasure", this);
		this._editMeasureDialog = sap.ui.xmlfragment("editDialog","sap.suite.ui.smartbusiness.designtime.drilldown.view.editDialog", this);
		this._dualAxisConfig = sap.ui.xmlfragment("dualAxisConfig","sap.suite.ui.smartbusiness.designtime.drilldown.view.dualAxisConfig", this);
		this._msrDialogForStack1 = sap.ui.xmlfragment("msrDialogForStack1","sap.suite.ui.smartbusiness.designtime.drilldown.view.msrDialogForStack1", this);
		this.AdditionalLanguagesDialog = new sap.ui.xmlfragment("additionalLanguageDialog" ,"sap.suite.ui.smartbusiness.designtime.drilldown.view.additionalLanguagesDialog", this);
		this._chartTypeConfig = sap.ui.xmlfragment("chartTypeConfig","sap.suite.ui.smartbusiness.designtime.drilldown.view.chartTypeConfig", this);         
		this.oRouter.attachRoutePatternMatched(this.onRoutePatternMatched, this);
		this.busyIndicator = new sap.m.BusyDialog();
	},
	onRoutePatternMatched:function(oEvent){
		if (oEvent.getParameter("name") === "configureChart") {

			try {

				this.evaluationId = oEvent.getParameter("arguments")["evaluationId"];
				this.currentViewId = oEvent.getParameter("arguments")["viewId"];
				this.DDA_MODEL = sap.suite.smartbusiness.ddaconfig.Model.getInstance(this.evaluationId,false,this.getView().getModel("i18n"));
				if(this.currentViewId !== "~NA~") {
					this.DDA_MODEL.setViewId(this.currentViewId);	
				}
				this.bindUiToModel();
				this.EVALUATION = sap.suite.smartbusiness.kpi.parseEvaluation(this.DDA_MODEL.EVALUATION_DATA);
				this._oModel = this.getView().getModel("SB_DDACONFIG");
				this.mProperties = sap.suite.smartbusiness.odata.properties(this._oModel.getData().QUERY_SERVICE_URI,this._oModel.getData().QUERY_ENTITY_SET);
				this.COLUMN_LABEL_MAPPING = this.mProperties.getLabelMappingObject();
				this._oTextsModel = this.getView().getModel("i18n");
				this._editMeasureDialog.setModel(this._oTextsModel,"i18n");
				this._dualAxisConfig.setModel(this._oTextsModel,"i18n");
				this._msrDialogForStack1.setModel(this._oTextsModel,"i18n");
				this._oShowMeasureDialog.setModel(this._oTextsModel,"i18n");
				this.addThresholdMeasureDialog.setModel(this._oTextsModel,"i18n");
				this.prepareInitialModelData(this._oModel);
				this.takeConfigMasterSnapShot();
				this._updateMeasureDimensionBindings();
				this.refreshChart();
				this.chartTypeInit();

			}
			catch(e) {
				sap.suite.smartbusiness.utils.showErrorMessage(this.oApplicationFacade.getResourceBundle().getText("FAILED_TO_LOAD_ODATA"), e.message);
			}
		}
	},
	displayLabelsFormatter:function(s){
		return this.COLUMN_LABEL_MAPPING[s];
	},
	bindUiToModel:function(){
		this.DDA_MODEL.bindModel(this.getView(),"SB_DDACONFIG");
		this.DDA_MODEL.bindModel(this._editMeasureDialog,"SB_DDACONFIG");
		this.DDA_MODEL.bindModel(this._editMeasureDialog);
		this.DDA_MODEL.bindModel(this._oShowMeasureDialog,"SB_DDACONFIG");
		this.DDA_MODEL.bindModel(this._oShowMeasureDialog);
		this.DDA_MODEL.bindModel(this.addThresholdMeasureDialog,"SB_DDACONFIG");
		this.DDA_MODEL.bindModel(this.AdditionalLanguagesDialog,"SB_DDACONFIG");
	},
	_cloneObj:function(ele){
		var tmp;
		if(ele instanceof Array){
			tmp=[];
			for(var i=0;i<ele.length;i++){
				tmp[i]=this._cloneObj(ele[i]);
			}
		}else if(ele instanceof Object){
			tmp={};
			for(var each in ele){
				if(ele.hasOwnProperty(each)){
					tmp[each]=this._cloneObj(ele[each]);  
				}
			}
		}else{
			tmp=ele;
		}
		return tmp;
	},
	takeConfigMasterSnapShot:function(){
		this._masterConfig=this._cloneObj(this._oModel.getData());
	},
	restoreFromConfigMasterSnapShot:function(){
		this._oModel.setData(this._masterConfig);
	},
	copyConfigSnapshot:function(){
		this._config=this._cloneObj(this._oModel.getData());
		this.enableOrDisableSave();//check for presence of atleast 1 msr or dim, disable save if nothing is selected
	},
	restorePrevConfig:function(){
		this._oModel.setData(this._config);
	},
	prepareInitialModelData:function(oModel){
		var tmpData=oModel.getData();
		var dim=tmpData.ALL_DIMENSIONS;
		var msr=tmpData.ALL_MEASURES;
		var data=[],isColumnConfigured={};
		var configuredColumns=tmpData.COLUMNS;
		for(var i=0;i<configuredColumns.length;i++){
			configuredColumns[i].SELECTED=true;
			configuredColumns[i].LABEL=this.COLUMN_LABEL_MAPPING[configuredColumns[i].NAME];
			data.push(configuredColumns[i]);
			isColumnConfigured[configuredColumns[i].NAME]=true;
		}
		for(var i=0;i<dim.length;i++){
			if(isColumnConfigured[dim[i]])
				continue;
			data.push({AXIS: 1,NAME: dim[i],SORT_BY: dim[i],SORT_ORDER: "none",STACKING: 0,
				TYPE: "DIMENSION",VISIBILITY: "BOTH",SELECTED:false,LABEL:this.COLUMN_LABEL_MAPPING[dim[i]]});
		}
		for(var i=0;i<msr.length;i++){
			if(isColumnConfigured[msr[i]])
				continue;
			data.push({0: Object,AXIS: 2,COLOR1: "",COLOR2:"",NAME: msr[i],SORT_BY: msr[i],
				SORT_ORDER: "none",STACKING: 0,TYPE: "MEASURE",VISIBILITY: "BOTH",SELECTED:false,LABEL:this.COLUMN_LABEL_MAPPING[msr[i]]
			});
		}
		tmpData.items=data;
		oModel.setData(tmpData);
	},
	_updateMeasureDimensionBindings:function(){
		var filter= new sap.ui.model.Filter("SELECTED",sap.ui.model.FilterOperator.EQ,true);
		var binding=this.measureDimensionList.getBinding("items");
		binding.filter(filter);
	},
	onChartTypeChange:function(oEvent){

		//this.copyConfigSnapshot();
		if (! this._chartTypeConfig) {
			this._chartTypeConfig = sap.ui.xmlfragment("chartTypeConfig","sap.suite.ui.smartbusiness.designtime.drilldown.view.chartTypeConfig", this);
		}
		this.getView().byId(sap.ui.core.Fragment.createId("chartTypeConfig","chartTypeConfig"));
		var chart_type = this.getView().byId(sap.ui.core.Fragment.createId("chartTypeConfig","chartType"));
//		if(chart_type.getSelectedKey().toUpperCase()!="BUBBLE")
//		this.copyConfigSnapshot();
		this.getView().byId(sap.ui.core.Fragment.createId("chartTypeConfig","singleDual")).setVisible((chart_type.getSelectedKey().toUpperCase()!="BUBBLE" && chart_type.getSelectedKey().toUpperCase()!="TABLE" && chart_type.getSelectedKey().toUpperCase().toUpperCase()!="LINE" && chart_type.getSelectedKey().toUpperCase()!="COMBINATION")?true:false);
		this.getView().byId(sap.ui.core.Fragment.createId("chartTypeConfig","isAbsolute")).setVisible((chart_type.getSelectedKey().toUpperCase()!="BUBBLE" &&  chart_type.getSelectedKey().toUpperCase()!="TABLE"&& chart_type.getSelectedKey().toUpperCase().toUpperCase()!="LINE" && chart_type.getSelectedKey().toUpperCase()!="COMBINATION")?true:false);
		this.updateSemanticColorComboBox(chart_type.getSelectedKey());
		this.refreshChart();
		this.enableOrDisableSave();
	},

	chartTypeInit:function(oEvent){

		//this.copyConfigSnapshot();
		if (! this._chartTypeConfig) {
			this._chartTypeConfig = sap.ui.xmlfragment("chartTypeConfig","sap.suite.ui.smartbusiness.designtime.drilldown.view.chartTypeConfig", this);
		}
		this.getView().byId(sap.ui.core.Fragment.createId("chartTypeConfig","chartTypeConfig"));
		var chart_type = this.getView().byId(sap.ui.core.Fragment.createId("chartTypeConfig","chartType"));
		if(chart_type.getSelectedKey().toUpperCase()!="BUBBLE")
			this.copyConfigSnapshot();
		this.getView().byId(sap.ui.core.Fragment.createId("chartTypeConfig","singleDual")).setVisible((chart_type.getSelectedKey().toUpperCase()!="BUBBLE" && chart_type.getSelectedKey().toUpperCase()!="TABLE" && chart_type.getSelectedKey().toUpperCase().toUpperCase()!="LINE" && chart_type.getSelectedKey().toUpperCase()!="COMBINATION")?true:false);
		this.getView().byId(sap.ui.core.Fragment.createId("chartTypeConfig","isAbsolute")).setVisible((chart_type.getSelectedKey().toUpperCase()!="BUBBLE" &&  chart_type.getSelectedKey().toUpperCase()!="TABLE"&& chart_type.getSelectedKey().toUpperCase().toUpperCase()!="LINE" && chart_type.getSelectedKey().toUpperCase()!="COMBINATION")?true:false);
		this.setSemanticColorComboBox(chart_type.getSelectedKey());
		this.refreshChart();
		this.enableOrDisableSave();
	},

	updateSemanticColorComboBox:function(chart_type){
		if (! this._chartTypeConfig) {

			this._chartTypeConfig = sap.ui.xmlfragment("chartTypeConfig","sap.suite.ui.smartbusiness.designtime.drilldown.view.chartTypeConfig", this);

		}
		chart_type = chart_type.toUpperCase();

		var semanticComboBox = this.getView().byId(sap.ui.core.Fragment.createId("chartTypeConfig","semanticColors"));

		if(chart_type == "BAR" || chart_type=="COLUMN"){
			semanticComboBox.setVisible(true);
			semanticComboBox.setEnabled(true);
			semanticComboBox.getItemByKey("AUTO_SEMANTIC").setEnabled(true);
			semanticComboBox.getItemByKey("MANUAL_NON_SEMANTIC").setEnabled(true);
			semanticComboBox.getItemByKey("MANUAL_SEMANTIC").setEnabled(true);

			// if stacking by dimension is applied , disable manual coloring .
			if(this.isStackDim) {
				semanticComboBox.setSelectedKey("NONE");
				semanticComboBox.getItemByKey("AUTO_SEMANTIC").setEnabled(false);
				semanticComboBox.getItemByKey("MANUAL_NON_SEMANTIC").setEnabled(false);
				semanticComboBox.getItemByKey("MANUAL_SEMANTIC").setEnabled(false);
			}

		}else if(chart_type=="BUBBLE"){
			semanticComboBox.setSelectedKey("NONE");
			semanticComboBox.setVisible(false);

		} else if(chart_type=="TABLE"){

			semanticComboBox.setVisible(true);
			semanticComboBox.setEnabled(true);
			if(!(semanticComboBox.getSelectedKey().toUpperCase() == "NONE" || semanticComboBox.getSelectedKey().toUpperCase() == "AUTO_SEMANTIC"))
				semanticComboBox.setSelectedKey("NONE");
			semanticComboBox.getItemByKey("AUTO_SEMANTIC").setEnabled(true);
			semanticComboBox.getItemByKey("MANUAL_NON_SEMANTIC").setEnabled(false);
			semanticComboBox.getItemByKey("MANUAL_SEMANTIC").setEnabled(false);

		} else if(chart_type=="LINE"|| chart_type=="COMBINATION" ){
			semanticComboBox.setSelectedKey("MANUAL_NON_SEMANTIC");
			semanticComboBox.setVisible(true);
			semanticComboBox.setEnabled(true);
			semanticComboBox.getItemByKey("MANUAL_NON_SEMANTIC").setEnabled(true);
			semanticComboBox.getItemByKey("AUTO_SEMANTIC").setEnabled(false);
			semanticComboBox.getItemByKey("MANUAL_SEMANTIC").setEnabled(true);
		}

	},

	setSemanticColorComboBox:function(chart_type){
		chart_type = chart_type.toUpperCase();
		var semanticComboBox = this.getView().byId(sap.ui.core.Fragment.createId("chartTypeConfig","semanticColors"));
		if(chart_type == "BAR" || chart_type=="COLUMN"){
			semanticComboBox.setVisible(true);
			semanticComboBox.setEnabled(true);
			semanticComboBox.getItemByKey("AUTO_SEMANTIC").setEnabled(true);
			semanticComboBox.getItemByKey("MANUAL_NON_SEMANTIC").setEnabled(true);
			semanticComboBox.getItemByKey("MANUAL_SEMANTIC").setEnabled(true);

			// if stacking by dimension is applied , disable manual coloring .
			if(this.isStackDim) {
				semanticComboBox.getItemByKey("AUTO_SEMANTIC").setEnabled(false);
				semanticComboBox.getItemByKey("MANUAL_NON_SEMANTIC").setEnabled(false);
				semanticComboBox.getItemByKey("MANUAL_SEMANTIC").setEnabled(false);
			}

		}else if(chart_type=="BUBBLE"){
			semanticComboBox.setVisible(false);

		} else if(chart_type=="TABLE"){
			semanticComboBox.setVisible(true);
			semanticComboBox.setEnabled(true);
			semanticComboBox.getItemByKey("AUTO_SEMANTIC").setEnabled(true);
			semanticComboBox.getItemByKey("MANUAL_NON_SEMANTIC").setEnabled(false);
			semanticComboBox.getItemByKey("MANUAL_SEMANTIC").setEnabled(false);

		} else if(chart_type=="LINE"|| chart_type=="COMBINATION" ){
			semanticComboBox.setVisible(true);
			semanticComboBox.setEnabled(true);
			semanticComboBox.getItemByKey("MANUAL_NON_SEMANTIC").setEnabled(true);
			semanticComboBox.getItemByKey("AUTO_SEMANTIC").setEnabled(false);
			semanticComboBox.getItemByKey("MANUAL_SEMANTIC").setEnabled(true);
		}

	},

	formatcolor:function(s){

		return s?sap.ui.core.theming.Parameters.get(s):"transparent";
	},
	formatEditColor:function(s){

		return s?sap.ui.core.theming.Parameters.get(s):"black";
	},
	sortByMeasureVisibility:function(s){
		return s?(s.toUpperCase()=="MEASURE"||s.toUpperCase()=="KPI MEASURE"):false;
	},
	sortByDimensionVisibility:function(s){
		return s?s.toUpperCase()=="DIMENSION":false;
	},
	openAllMeasuresDimension:function(){
		this.copyConfigSnapshot();
		this._oShowMeasureDialog.open();
		var buttonContainer=this._oShowMeasureDialog.getContent()[0];
		if(buttonContainer.getSelectedButton()==buttonContainer.getButtons()[1].getId()){
			this.showDimensionList();
		}else{
			this.showMeasureList();
		}

	},
	_isAddDimensionMode:function(){
		var buttonContainer=this._oShowMeasureDialog.getContent()[0];
		return buttonContainer.getSelectedButton()==buttonContainer.getButtons()[1].getId()
	},
	onMeasureDimensionSearch:function(oEvt){
		var mode=this._isAddDimensionMode()?"DIMENSION":"MEASURE";
		var curList=this._isAddDimensionMode()?this._oDimensionList:this._oMeasureList;
		var filter=[new sap.ui.model.Filter("TYPE",sap.ui.model.FilterOperator.Contains,mode)];
		var sKey = oEvt.getSource().getValue();
		if (sKey && sKey.length > 0) {
			filter.push(new sap.ui.model.Filter("LABEL", sap.ui.model.FilterOperator.StartsWith, sKey));
		}
		var binding = curList.getBinding("items");
		binding.filter(filter);
	},
	onMeasureDimensionAdded:function(){
		this._updateMeasureDimensionBindings();
		this._oShowMeasureDialog.close();
//		this.copyConfigSnapshot();
		this.refreshChart();
		this.enableOrDisableSave(); //check for presence of atleast 1 msr or dim, disable save if nothing is selected
	},
	onMeasureDimensionCancel:function(){
		this.restorePrevConfig();
		this._updateMeasureDimensionBindings();
		this._oShowMeasureDialog.close();
	},

	showDimensionList:function(){
		this._oShowMeasureDialog.removeContent(this._oMeasureList);
		this._oShowMeasureDialog.addContent(this._oDimensionList);
		this._oDimensionList.getBinding("items").filter(new sap.ui.model.Filter("TYPE",sap.ui.model.FilterOperator.EQ,"DIMENSION"));

	},
	showMeasureList:function(){
		this._oShowMeasureDialog.removeContent(this._oDimensionList);
		this._oShowMeasureDialog.addContent(this._oMeasureList);
		this._oMeasureList.getBinding("items").filter(new sap.ui.model.Filter("TYPE",sap.ui.model.FilterOperator.EQ,"MEASURE"));

	},
	formatSortOrder:function(s){
		if(s=="asc"){
			return "sap-icon://up"
		}else if(s=="desc"){
			return "sap-icon://down"
		}
		else{
			return "";
		}
	},
	colorButtonVisiblity:function(s,colorMode){
		if(s)
			return (colorMode=="MANUAL_SEMANTIC"||colorMode=="MANUAL_NON_SEMANTIC")&& s.toLowerCase()=='measure';
	},
	colorButton1Visiblity:function(s){
		return s=="MANUAL_NON_SEMANTIC";
	},
	colorButton2Visiblity:function(s){
		return s=="MANUAL_SEMANTIC";
	},
	onEditIconPress:function(oEvent){
		var that = this;
		this.copyConfigSnapshot();
		var bindingContext=oEvent.getSource().getBindingContext("SB_DDACONFIG");

		this.columnBeingEdited = bindingContext.getObject();

		this._editMeasureDialog.bindElement(bindingContext.getPath());

		if(bindingContext.getObject().TYPE.toLowerCase()=="kpi measure"){
			sap.ui.core.Fragment.byId("editDialog","typeOf").setText(this.getView().getModel("i18n").getProperty("KPI_MEASURE"));
		}

		// showing fields relevant to measure or dimension :
		if(bindingContext.getObject().VISIBILITY.toUpperCase() === "CHART")
			sap.ui.core.Fragment.byId("editDialog","hideInTable").setSelected(true);
		else
			sap.ui.core.Fragment.byId("editDialog","hideInTable").setSelected(false);              

		// if dual axis charts chosen .
		if((((this.dda_config.chartConfig.type).toUpperCase() === "BAR") || ((this.dda_config.chartConfig.type).toUpperCase() === "COLUMN")) && ((this.dda_config.chartConfig.axis).toUpperCase() === "DUAL")) {
			sap.ui.core.Fragment.byId("editDialog","Dual_config_1").setVisible(true);
			sap.ui.core.Fragment.byId("editDialog","Dual_config_2").setVisible(true);
			var DualModel = new sap.ui.model.json.JSONModel();
			DualModel.setData({DATA: that.chartMeasures});
			sap.ui.core.Fragment.byId("editDialog","Dual_config_1").setModel(DualModel,"DUAL_MODEL");

			sap.ui.core.Fragment.byId("editDialog","axis_1_label_edit").setText(that._oTextsModel.getResourceBundle().getText("AXIS",1));
			sap.ui.core.Fragment.byId("editDialog","axis_2_label_edit").setText(that._oTextsModel.getResourceBundle().getText("AXIS",2));
			sap.ui.core.Fragment.byId("editDialog","In_stack1_label_edit").setText(that._oTextsModel.getResourceBundle().getText("IN_STACK",1));

			var dualMsr = this.getMeasuresByAxis(this.chartMeasures);
			sap.ui.core.Fragment.byId("editDialog","stack1MsrsLabel_edit").setText(dualMsr.axis1.nameArr.join(","));
			sap.ui.core.Fragment.byId("editDialog","stack2MsrsLabel_edit").setText(dualMsr.axis2.nameArr.join(","));
			if(dualMsr.axis1.nameArr.length) {sap.ui.core.Fragment.byId("editDialog","AxisMsr1_edit").setSelectedKey(dualMsr.axis1.nameArr[0])};
			if(dualMsr.axis2.nameArr.length) {sap.ui.core.Fragment.byId("editDialog","AxisMsr2_edit").setSelectedKey(dualMsr.axis2.nameArr[0])};
		} else {
			sap.ui.core.Fragment.byId("editDialog","Dual_config_1").setVisible(false);
			sap.ui.core.Fragment.byId("editDialog","Dual_config_2").setVisible(false);
		}

		var StackConfig = that.getStacking(that.chartMeasures, that.chartDimensions);
		sap.ui.core.Fragment.byId("editDialog","enableStacking").setEnabled(true);
		if (StackConfig.isEnabled) {
			sap.ui.core.Fragment.byId("editDialog","enableStacking").setSelected(true);
			sap.ui.core.Fragment.byId("editDialog","stackingOptions").setVisible(true);
			if(StackConfig.type === "M") {
				sap.ui.core.Fragment.byId("editDialog","addMsrToStack").setSelected(true);
				sap.ui.core.Fragment.byId("editDialog","dimsToStack").setVisible(false);
			} else if(StackConfig.type === "D") {
				sap.ui.core.Fragment.byId("editDialog","addMsrToStack").setSelected(false);
				sap.ui.core.Fragment.byId("editDialog","dimStack").setSelected(true);
				sap.ui.core.Fragment.byId("editDialog","dimsToStack").setVisible(true);
				var oJSONModel = new sap.ui.model.json.JSONModel();
				oJSONModel.setData({STdata:that.chartDimensions});
				sap.ui.core.Fragment.byId("editDialog","dimsToStack").setModel(oJSONModel);
				var otemplate = new sap.ui.core.Item({
					key: "{name}",
					text: "{name}", 
				});
				sap.ui.core.Fragment.byId("editDialog","dimsToStack").bindItems("/STdata",otemplate);
				if(that.getDimensionToBeStacked(that.chartDimensions)) {
					sap.ui.core.Fragment.byId("editDialog","dimsToStack").setSelectedKey(that.getDimensionToBeStacked(that.chartDimensions).name);
				}
			}
		} else {
			sap.ui.core.Fragment.byId("editDialog","enableStacking").setSelected(false);
			sap.ui.core.Fragment.byId("editDialog","stackingOptions").setVisible(false);
		}

		// disable stacking option if dual charts / percentage charts :
		if((((this.dda_config.chartConfig.type).toUpperCase() === "BAR") || ((this.dda_config.chartConfig.type).toUpperCase() === "COLUMN")) && (((this.dda_config.chartConfig.axis).toUpperCase() === "DUAL") || ((this.dda_config.chartConfig.value).toUpperCase() === "PERCENTAGE"))) {
			sap.ui.core.Fragment.byId("editDialog","stackingOptions").setVisible(false);
			sap.ui.core.Fragment.byId("editDialog","enableStacking").setEnabled(false);
		}
		// disable stacking option for all charts except bar and column :
		if(!(((this.dda_config.chartConfig.type).toUpperCase() === "BAR") || ((this.dda_config.chartConfig.type).toUpperCase() === "COLUMN"))) {
			sap.ui.core.Fragment.byId("editDialog","stackingOptions").setVisible(false);
			sap.ui.core.Fragment.byId("editDialog","enableStacking").setEnabled(false);
		}


		if(bindingContext.getObject().TYPE.toUpperCase()=="MEASURE") {
			sap.ui.core.Fragment.byId("editDialog","useAsThreshold").setVisible(true);     
			if(bindingContext.getObject().NAME === that._oModel.getData().THRESHOLD_MEASURE)
				sap.ui.core.Fragment.byId("editDialog","useAsThreshold").setSelected(true);     
			else
				sap.ui.core.Fragment.byId("editDialog","useAsThreshold").setSelected(false);     
		} else if(bindingContext.getObject().TYPE.toUpperCase()=="DIMENSION") {
			sap.ui.core.Fragment.byId("editDialog","useAsThreshold").setVisible(false);          
		}

		this._editMeasureDialog.open();
	},

	onEnableStacking: function() {
		var isChecked = sap.ui.core.Fragment.byId("editDialog","enableStacking").getSelected();
		if(isChecked) {
			sap.ui.core.Fragment.byId("editDialog","stackingOptions").setVisible(true);
		} else {
			sap.ui.core.Fragment.byId("editDialog","stackingOptions").setVisible(false);
		}
	},

	onMsrStacking: function() {
		if(sap.ui.core.Fragment.byId("editDialog","addMsrToStack").getSelected()) {
			sap.ui.core.Fragment.byId("editDialog","dimsToStack").setVisible(false);
		}
	},

	onDimStacking: function() {
		var that = this;
		if(sap.ui.core.Fragment.byId("editDialog","dimStack").getSelected()) {
			sap.ui.core.Fragment.byId("editDialog","dimsToStack").setVisible(true);
			var oJSONModel = new sap.ui.model.json.JSONModel();
			oJSONModel.setData({STdata:that.chartDimensions});
			sap.ui.core.Fragment.byId("editDialog","dimsToStack").setModel(oJSONModel);
			var otemplate = new sap.ui.core.Item({
				key: "{name}",
				text: "{name}", 
			});
			sap.ui.core.Fragment.byId("editDialog","dimsToStack").bindItems("/STdata",otemplate);
			if(that.getDimensionToBeStacked(that.chartDimensions)) {
				sap.ui.core.Fragment.byId("editDialog","dimsToStack").setSelectedKey(that.getDimensionToBeStacked(that.chartDimensions).name);
			}
		} else {
			sap.ui.core.Fragment.byId("editDialog","dimsToStack").setVisible(false);
		}
	},

	onAfterRendering : function() {
		this._fixSplitterHeight();
		sap.ui.Device.resize.attachHandler(this._fixSplitterHeight,this);
	},
	_fixSplitterHeight : function() {
		var _height = $(window).height();
		var _headerHeight = 48;
		var _footerHeight = 49;
		this.byId('splitContainer').$().css("height",(_height-(_headerHeight + _footerHeight))+"px");
	},
	showGeneral:function(){
		sap.ui.core.Fragment.byId("editDialog","FormEditMeasureGeneral").setVisible(true);
		sap.ui.core.Fragment.byId("editDialog","FormEditMeasureAdvanced").setVisible(false);


	},
	showAdvanced:function(){
		sap.ui.core.Fragment.byId("editDialog","FormEditMeasureGeneral").setVisible(false);
		sap.ui.core.Fragment.byId("editDialog","FormEditMeasureAdvanced").setVisible(true);

	},
	onEditDialogOk:function(oEvent){
		var that = this;
		// updating the model
		var bindingContext=oEvent.getSource().getBindingContext("SB_DDACONFIG");

		if(sap.ui.core.Fragment.byId("editDialog","hideInTable").getSelected()) {                                                     // hide in table
			that.updateColumnProperty(that._oModel.getData().items, that.columnBeingEdited.NAME, "VISIBILITY", "CHART");
		} else {
			that.updateColumnProperty(that._oModel.getData().items, that.columnBeingEdited.NAME, "VISIBILITY", "BOTH");
		}

		if(that.columnBeingEdited.TYPE.toUpperCase() === "MEASURE") {                                                            // setting threshold measure
			if(sap.ui.core.Fragment.byId("editDialog","useAsThreshold").getSelected()) {
				that._oModel.getData().THRESHOLD_MEASURE = that.columnBeingEdited.NAME ;
			}
			else {
				if(that.columnBeingEdited.NAME === that._config.THRESHOLD_MEASURE) {
					that._oModel.getData().THRESHOLD_MEASURE = "";
				}
			}
		}

		if(sap.ui.core.Fragment.byId("editDialog","enableStacking").getSelected()) {                                                   // setting stacking options   
			if(sap.ui.core.Fragment.byId("editDialog","addMsrToStack").getSelected()) {
				that.setStacking(true, "M", that._oModel.getData().items);
				var semanticComboBox = that.getView().byId(sap.ui.core.Fragment.createId("chartTypeConfig","semanticColors"));     
				var chartTypeComboBox = that.getView().byId(sap.ui.core.Fragment.createId("chartTypeConfig","chartType"));
				if(chartTypeComboBox.getSelectedKey().toUpperCase() == "BAR" || chartTypeComboBox.getSelectedKey().toUpperCase()=="COLUMN") {
					// semanticComboBox.setSelectedKey("NONE");
					semanticComboBox.getItemByKey("AUTO_SEMANTIC").setEnabled(true);
					semanticComboBox.getItemByKey("MANUAL_NON_SEMANTIC").setEnabled(true);
					semanticComboBox.getItemByKey("MANUAL_SEMANTIC").setEnabled(true);                    
				}
			} else if(sap.ui.core.Fragment.byId("editDialog","dimStack").getSelected()) {
				var oDim = sap.ui.core.Fragment.byId("editDialog","dimsToStack").getSelectedKey();
				that.setStacking(true, "D", that._oModel.getData().items);
				that.setDimensionToBeStacked(that._oModel.getData().items, oDim);
				var semanticComboBox = that.getView().byId(sap.ui.core.Fragment.createId("chartTypeConfig","semanticColors"));     
				var chartTypeComboBox = that.getView().byId(sap.ui.core.Fragment.createId("chartTypeConfig","chartType"));
				if(chartTypeComboBox.getSelectedKey().toUpperCase() == "BAR" || chartTypeComboBox.getSelectedKey().toUpperCase()=="COLUMN") {
					semanticComboBox.setSelectedKey("NONE");
					semanticComboBox.getItemByKey("AUTO_SEMANTIC").setEnabled(false);
					semanticComboBox.getItemByKey("MANUAL_NON_SEMANTIC").setEnabled(false);
					semanticComboBox.getItemByKey("MANUAL_SEMANTIC").setEnabled(false);                    
				}
			}
		} else {
			that.setStacking(false, "N", that._oModel.getData().items);
			var semanticComboBox = that.getView().byId(sap.ui.core.Fragment.createId("chartTypeConfig","semanticColors"));     
			var chartTypeComboBox = that.getView().byId(sap.ui.core.Fragment.createId("chartTypeConfig","chartType"));
			if(chartTypeComboBox.getSelectedKey().toUpperCase() == "BAR" || chartTypeComboBox.getSelectedKey().toUpperCase()=="COLUMN") {
				// semanticComboBox.setSelectedKey("NONE");
				semanticComboBox.getItemByKey("AUTO_SEMANTIC").setEnabled(true);
				semanticComboBox.getItemByKey("MANUAL_NON_SEMANTIC").setEnabled(true);
				semanticComboBox.getItemByKey("MANUAL_SEMANTIC").setEnabled(true);                    
			}
		}

		// dual axis config setting :
		if((((this.dda_config.chartConfig.type).toUpperCase() === "BAR") || ((this.dda_config.chartConfig.type).toUpperCase() === "COLUMN")) && ((this.dda_config.chartConfig.axis).toUpperCase() === "DUAL")) {
			var axis1 = sap.ui.getCore().byId(sap.ui.core.Fragment.createId("editDialog","AxisMsr1_edit"));
			var axis2 = sap.ui.getCore().byId(sap.ui.core.Fragment.createId("editDialog","AxisMsr2_edit"));
			if(axis1.getSelectedKey() === axis2.getSelectedKey()) {
//				var alert_text = "Please choose a different measure for each axis .";
//				sap.m.MessageBox.alert(that._oTextsModel.getResourceBundle().getText("SAME_MEASURE_CHOSEN_FOR_BOTH_AXES"));     
				jQuery.sap.log.error("Same measure chosen for both axes");
			} //else {
			var tmpData = this._oModel.getData();           
			for(var i=0;i<tmpData.items.length;i++){
				if(tmpData.items[i].TYPE.toUpperCase() === "MEASURE") {
					tmpData.items[i].AXIS = 2;              
					for(var j=0;j<that.chartMeasures.length;j++) {
						if(tmpData.items[i].NAME === that.chartMeasures[j].name) {
							tmpData.items[i].AXIS = that.chartMeasures[j].axis ;
							break;
						}
					}
				}
			}
			this._oModel.setData(tmpData);
//			}
		}

		this._updateMeasureDimensionBindings();
		this._editMeasureDialog.close();
		this.refreshChart();
	},
	onEditDialogCancel:function(){
		this.restorePrevConfig();
		this._updateMeasureDimensionBindings();
		this._editMeasureDialog.close();
	},
	_getColorPaletteTemplate:function(oButton){

		var iconTemplate= new sap.ui.core.Icon({
			color:{
				path:"SB_DDACONFIG>color",
				formatter:this.formatcolor
			},
			src:"sap-icon://color-fill",
			size:"32px",
			width:"5%",
			press:function(e){
				var colorType=oButton.getModel("SB_DDACONFIG").getProperty("/COLOR_SCHEME");
				colorType=(colorType=="MANUAL_NON_SEMANTIC")?"COLOR1":(colorType=="MANUAL_SEMANTIC")?"COLOR2":"";
				oButton.getBindingContext().getObject()[colorType]=this.getBindingContext("SB_DDACONFIG").getProperty("color");
				oButton.getModel().refresh();
			}
		});
		var colorCategory= new sap.m.Label({
			text:{
				path:"SB_DDACONFIG>index",
				formatter:function(ind){
					var text="";
					switch(ind){
					case 1 : text="Neutral";break;
					case 4    : text="Good";break;
					case 7:   text="Warning";break;
					case 10: text="Bad";
					}
					return text;
				}
			},
			visible:{
				path:"SB_DDACONFIG>/COLOR_SCHEME",
				formatter:function(s){return s=="MANUAL_SEMANTIC"}
			}
		})
		return new sap.m.HBox({items:[iconTemplate,colorCategory]});

	},
	showColorPopUp:function(oEvent){
		var chosenColor;
		var oButton = oEvent.getSource();
		var colorScheme=this._oModel.getProperty("/COLOR_SCHEME");
		var colorsVerticalLayout = new sap.m.VBox();
		colorsVerticalLayout.bindAggregation("items","SB_DDACONFIG>/"+colorScheme,this._getColorPaletteTemplate(oButton));
		var colorPopup = new sap.m.Popover({
			visible:{
				path:"SB_DDACONFIG>/COLOR_SCHEME",
				formatter:function(s){return s=="MANUAL_SEMANTIC"||s=="MANUAL_NON_SEMANTIC";}
			},
			showHeader:false,
			content:[ colorsVerticalLayout],

		});
		colorPopup.setModel(this._oModel,"SB_DDACONFIG");
		colorPopup.openBy(oButton);  
	},

	onEditDialogCloseButton:function(){
		this._editMeasureDialog.close();
	},

	onSingleDualChange: function(){
		var that=this;
		var selectedAxis = ((this.getView().byId(sap.ui.core.Fragment.createId("chartTypeConfig","singleDual"))).getSelectedKey()).toUpperCase() ;
		switch(selectedAxis) {
		case "SINGLE":
			this.refreshChart();
			break;
		case "DUAL":
			if(this.chartMeasures.length < 2) {
				//that.getView().byId(sap.ui.core.Fragment.createId("chartTypeConfig","singleDual")).setSelectedKey("SINGLE");
				sap.m.MessageBox.alert(that._oTextsModel.getResourceBundle().getText("DUAL_AXIS_CHART_MIN_MEASURE"),{onClose:function(){
					that.getView().byId(sap.ui.core.Fragment.createId("chartTypeConfig","singleDual")).setSelectedKey("SINGLE");
				}});                    
			} else {
				var DualModel = new sap.ui.model.json.JSONModel();
				DualModel.setData({DATA: this.chartMeasures});
				this._dualAxisConfig.setModel(DualModel,"DUAL_AXIS_MODEL");

				// if dual chart is chosen , disable stacking by dimension :        
				this.setStacking(true, "M", this._oModel.getData().items);

				sap.ui.core.Fragment.byId("dualAxisConfig","select_msr_for_axis_lbl").setText(that._oTextsModel.getResourceBundle().getText("SELECT_MEASURE_FOR_AXIS"," "));
				sap.ui.core.Fragment.byId("dualAxisConfig","axis_1_label").setText(that._oTextsModel.getResourceBundle().getText("AXIS",1));
				sap.ui.core.Fragment.byId("dualAxisConfig","axis_2_label").setText(that._oTextsModel.getResourceBundle().getText("AXIS",2));
				sap.ui.core.Fragment.byId("dualAxisConfig","In_stack1_label").setText(that._oTextsModel.getResourceBundle().getText("IN_STACK",1));

				var dualMsr = this.getMeasuresByAxis(this.chartMeasures);
				sap.ui.core.Fragment.byId("dualAxisConfig","stack1MsrsLabel").setText(dualMsr.axis1.nameArr.join(","));
				sap.ui.core.Fragment.byId("dualAxisConfig","stack2MsrsLabel").setText(dualMsr.axis2.nameArr.join(","));
				if(dualMsr.axis1.nameArr.length) {sap.ui.core.Fragment.byId("dualAxisConfig","AxisMsr1").setSelectedKey(dualMsr.axis1.nameArr[0])};
				if(dualMsr.axis2.nameArr.length) {sap.ui.core.Fragment.byId("dualAxisConfig","AxisMsr2").setSelectedKey(dualMsr.axis2.nameArr[0])};
				this._dualAxisConfig.open();               
			}
			break;
		default:
			break;
		}
	},

	onDualAxisDialogOk: function(){
		var that=this;
		var axis1 = sap.ui.getCore().byId(sap.ui.core.Fragment.createId("dualAxisConfig","AxisMsr1"));
		var axis2 = sap.ui.getCore().byId(sap.ui.core.Fragment.createId("dualAxisConfig","AxisMsr2"));
		if(axis1.getSelectedKey() === axis2.getSelectedKey()) {
//			var alert_text = "Please choose a different measure for each axis .";
//			sap.m.MessageBox.alert(that._oTextsModel.getResourceBundle().getText("SAME_MEASURE_CHOSEN_FOR_BOTH_AXES"));     
			jQuery.sap.log.error("Same measure chosen for both axes");
		}// else {
		var tmpData = this._oModel.getData();           
		for(var i=0;i<tmpData.items.length;i++){
			if(tmpData.items[i].TYPE.toUpperCase() === "MEASURE") {
				tmpData.items[i].AXIS = 2;              
				for(var j=0;j<that.chartMeasures.length;j++) {
					if(tmpData.items[i].NAME === that.chartMeasures[j].name) {
						tmpData.items[i].AXIS = that.chartMeasures[j].axis ;
						break;
					}
				}
			}
		}
		this._oModel.setData(tmpData);             
//		}         
		this.refreshChart();
		this._dualAxisConfig.close();
	},

	onDualAxisDialogCancel: function(){
		this.getView().byId(sap.ui.core.Fragment.createId("chartTypeConfig","singleDual")).setSelectedKey("SINGLE");
		this._dualAxisConfig.close();
	},

	setStackMsrs: function() {
		var that=this;
		var axis1 = sap.ui.getCore().byId(sap.ui.core.Fragment.createId("dualAxisConfig","AxisMsr1"));
		var axis2 = sap.ui.getCore().byId(sap.ui.core.Fragment.createId("dualAxisConfig","AxisMsr2"));
		if(axis1.getSelectedKey() === axis2.getSelectedKey()) {
//			var alert_text = "Please choose a different measure for each axis .";
			sap.m.MessageBox.alert(that._oTextsModel.getResourceBundle().getText("SAME_MEASURE_CHOSEN_FOR_BOTH_AXES"));     
			jQuery.sap.log.error("Same measure chosen for both axes");
		} else {
			for(var i=0;i<that.chartMeasures.length;i++){
				if(that.chartMeasures[i].name === axis1.getSelectedKey()) {
					that.chartMeasures[i].axis = 1;
				} else if(that.chartMeasures[i].name === axis2.getSelectedKey()) {
					that.chartMeasures[i].axis = 2;
				}                            
			}
			var dualMsr = this.getMeasuresByAxis(this.chartMeasures);
			sap.ui.core.Fragment.byId("dualAxisConfig","stack1MsrsLabel").setText(dualMsr.axis1.nameArr.join(","));
			sap.ui.core.Fragment.byId("dualAxisConfig","stack2MsrsLabel").setText(dualMsr.axis2.nameArr.join(","));              
		}         
	},

	setStackMsrs_edit: function() {
		var that=this;
		var axis1 = sap.ui.getCore().byId(sap.ui.core.Fragment.createId("editDialog","AxisMsr1_edit"));
		var axis2 = sap.ui.getCore().byId(sap.ui.core.Fragment.createId("editDialog","AxisMsr2_edit"));
		if(axis1.getSelectedKey() === axis2.getSelectedKey()) {
//			var alert_text = "Please choose a different measure for each axis .";
			sap.m.MessageBox.alert(that._oTextsModel.getResourceBundle().getText("SAME_MEASURE_CHOSEN_FOR_BOTH_AXES"));     
			jQuery.sap.log.error("Same measure chosen for both axes");
		} else {
			for(var i=0;i<that.chartMeasures.length;i++){
				if(that.chartMeasures[i].name === axis1.getSelectedKey()) {
					that.chartMeasures[i].axis = 1;
				} else if(that.chartMeasures[i].name === axis2.getSelectedKey()) {
					that.chartMeasures[i].axis = 2;
				}                            
			}
			var dualMsr = this.getMeasuresByAxis(this.chartMeasures);
			sap.ui.core.Fragment.byId("editDialog","stack1MsrsLabel_edit").setText(dualMsr.axis1.nameArr.join(","));
			sap.ui.core.Fragment.byId("editDialog","stack2MsrsLabel_edit").setText(dualMsr.axis2.nameArr.join(","));              
		}    
	},

	formatAxisToBool: function(a) {
		if(a === 1)
			return true;
		else
			return false;
	},

	openMsrDialogForStack1: function() {
		var that = this;
		if (! this._msrDialogForStack1) {
			this._msrDialogForStack1 = sap.ui.xmlfragment("msrDialogForStack1","sap.suite.ui.smartbusiness.designtime.drilldown.view.msrDialogForStack1", this);
		}

		var Stack1Model = new sap.ui.model.json.JSONModel();
		Stack1Model.setData({DATA: that.chartMeasures});
		this._msrDialogForStack1.setModel(Stack1Model);
		this._msrDialogForStack1.open();
	},

	onSearchInStack1SelectDialog: function(oEvent) {
		var sValue = oEvent.getParameter("value");
		var oFilter = new sap.ui.model.Filter("name", sap.ui.model.FilterOperator.Contains, sValue);
		var oBinding = oEvent.getSource().getBinding("items");
		oBinding.filter([oFilter]);
	},

	onStack1SelectDialogOK: function(oEvent) {
		var that=this;
		var aContexts = oEvent.getParameter("selectedItems");
		if (aContexts.length) {
			for(var i=0;i<that.chartMeasures.length;i++) {
				that.chartMeasures[i].axis = 2;            
				for(var j=0;j<aContexts.length;j++) {
					if(that.chartMeasures[i].name === aContexts[j].getTitle()) {
						that.chartMeasures[i].axis = 1;
						break;
					}
				}
			}
			oEvent.getSource().getBinding("items").filter([]);
			var dualMsr = this.getMeasuresByAxis(this.chartMeasures);
			sap.ui.core.Fragment.byId("dualAxisConfig","stack1MsrsLabel").setText(dualMsr.axis1.nameArr.join(","));
			sap.ui.core.Fragment.byId("dualAxisConfig","stack2MsrsLabel").setText(dualMsr.axis2.nameArr.join(","));          
			if(dualMsr.axis1.nameArr.length) {sap.ui.core.Fragment.byId("dualAxisConfig","AxisMsr1").setSelectedKey(dualMsr.axis1.nameArr[0])};
			if(dualMsr.axis2.nameArr.length) {sap.ui.core.Fragment.byId("dualAxisConfig","AxisMsr2").setSelectedKey(dualMsr.axis2.nameArr[0])};

			sap.ui.core.Fragment.byId("editDialog","stack1MsrsLabel_edit").setText(dualMsr.axis1.nameArr.join(","));
			sap.ui.core.Fragment.byId("editDialog","stack2MsrsLabel_edit").setText(dualMsr.axis2.nameArr.join(","));          
			if(dualMsr.axis1.nameArr.length) {sap.ui.core.Fragment.byId("editDialog","AxisMsr1_edit").setSelectedKey(dualMsr.axis1.nameArr[0])};
			if(dualMsr.axis2.nameArr.length) {sap.ui.core.Fragment.byId("editDialog","AxisMsr2_edit").setSelectedKey(dualMsr.axis2.nameArr[0])};

		} else {
			sap.suite.smartbusiness.utils.showErrorMessage(that._oTextsModel.getResourceBundle().getText("SELECT_MEASURE_FOR_AXIS",1));
		}         
	},

	onStack1SelectDialogCancel: function() {

	},

	onDataModeChange: function() {
		this.refreshChart();
	},

	onIsAbsoluteChange: function(){
		var valueType = ((this.getView().byId(sap.ui.core.Fragment.createId("chartTypeConfig","isAbsolute"))).getSelectedKey()).toUpperCase() ;
		// if percentage is chosen , disable stacking by dimension :
		if(valueType === "PERCENTAGE")
			this.setStacking(true, "M", this._oModel.getData().items);
		this.refreshChart();
	},

	onSemanticColorOptionChange: function(){
		this.refreshChart();
		if(this.getView().byId(sap.ui.core.Fragment.createId("chartTypeConfig","semanticColors")).getSelectedKey()=="AUTO_SEMANTIC"){
			var filters=[];
			var filterObject = {
					"type": (new sap.ui.model.Filter("TYPE",sap.ui.model.FilterOperator.EQ,"MEASURE")),
					"selected": (new sap.ui.model.Filter("SELECTED", sap.ui.model.FilterOperator.EQ,true)),
			};
			for(var item in filterObject) {
				filters.push(filterObject[item]);
			}
			var selectionBox=sap.ui.getCore().byId(sap.ui.core.Fragment.createId("thresholdDialog","thresholdMeasure"));
			var selectionItems= selectionBox.getItems()?selectionBox.getItems():[];
			if(selectionItems.length && selectionBox.getBinding('items')) {
				selectionBox.getBinding('items').filter(filters);
			}
			if(this._oModel.getData().THRESHOLD_MEASURE)  
				selectionBox.setSelectedKey(this._oModel.getData().THRESHOLD_MEASURE); 
			this.addThresholdMeasureDialog.open();
		}
	},
	onThresholdMeasureAdded:function(){
		this._oModel.getData().THRESHOLD_MEASURE = sap.ui.getCore().byId(sap.ui.core.Fragment.createId("thresholdDialog","thresholdMeasure")).getSelectedKey();  
		this.copyConfigSnapshot();
		this.refreshChart();
		this.addThresholdMeasureDialog.close();

	},
	onThresholdMeasureCancel:function(){
		this.addThresholdMeasureDialog.close();

	},

	/******* methods for Chart Name Additional Languages : BEGIN ************/
	//utility fn
	getLAISOfromSPRAS: function(key) {
		var allLangs = this.getView().getModel('SB_DDACONFIG').getData().ALL_LANGUAGES;
		for(var i = 0; i < allLangs.length; ++i) {
			if(allLangs[i]["SPRAS"] == key)
				return allLangs[i]["LAISO"];
		}
	},
	//utilify fn: gives the index of duplicate if exists, else returns -1. @param data. @param SAP_LANGUAGE_KEY.
	getIndexOfDuplicate: function(data, lang){
		for(var i = 0; i < data.length; ++i) {
			if(data[i]["SAP_LANGUAGE_KEY"] == lang)
				return i; //duplicate at position i
		}
		//no duplicate
		return -1;
	},

	openAdditionalLanguagesDialog: function() {
		var self = this;
		this.AdditionalLanguagesDialog.setModel(this._oTextsModel,"i18n");
		//take a copy of model incase the user needs to cancel
		this.copyConfigSnapshot();
		//reset input field as blank
		sap.ui.core.Fragment.byId("additionalLanguageDialog", "newTitle").setValue("")
		var ALTable = sap.ui.core.Fragment.byId("additionalLanguageDialog", "ALTable");
		ALTable.bindAggregation("items", "SB_DDACONFIG>/ADDITIONAL_LANGUAGE_TITLES", new sap.m.ColumnListItem({
			cells:[
			       new sap.m.Label({text: "{SB_DDACONFIG>TEXT}"}),
			       new sap.m.Label({text: {path: "SB_DDACONFIG>SAP_LANGUAGE_KEY", formatter: function(s){return self.getLAISOfromSPRAS(s)}}}),
			       new sap.ui.core.Icon({src: "sap-icon://decline", press: this.deleteEntry})
			       ],
			       //text in locale language not to be shown
			       visible: {
			    	   path: "SB_DDACONFIG>SAP_LANGUAGE_KEY",
			    	   formatter: function(s){
			    		   return s != self._oModel.getData()["CURRENT_LANGUAGE"]
			    	   }
			       }
		}));
		this.AdditionalLanguagesDialog.open();
		return;
	},

	closeAdditionalLanguagesDialog_OK: function(evt) {
		//set the clipboard variable since OK pressed
		this.copyConfigSnapshot();
		this.AdditionalLanguagesDialog.close();
		return;
	},

	closeAdditionalLanguagesDialog_Cancel: function(evt) {
		//restore to the model copied when dialog is open
		this.restorePrevConfig();
		this.AdditionalLanguagesDialog.close();
		return;
	},



	deleteEntry: function(evt) {
		var bindingPath = evt.getSource().getParent().getBindingContextPath();
		var index = parseInt(bindingPath.split("/").pop());
		var ALTable = sap.ui.core.Fragment.byId("additionalLanguageDialog", "ALTable");
		//remove the entry from model
		ALTable.getModel("SB_DDACONFIG").getData()["ADDITIONAL_LANGUAGE_TITLES"].splice(index, 1);
		ALTable.getModel("SB_DDACONFIG").refresh();
		return;
	},

	addEntry: function() {
		var newTitle = sap.ui.core.Fragment.byId("additionalLanguageDialog", "newTitle").getValue();
		var newTitleLanguage = sap.ui.core.Fragment.byId("additionalLanguageDialog", "newTitleLanguage").getSelectedKey();

		//die silently if both not valid
		if (newTitle && newTitleLanguage) {} else return;

		var ALTable = sap.ui.core.Fragment.byId("additionalLanguageDialog", "ALTable");
		var tableData = ALTable.getModel("SB_DDACONFIG").getData();
		//add entry to the model
		var newEntry = {
				EVALUATION_ID : this.DDA_MODEL.getConfigurator().evaluationId,
				CONFIGURATION_ID : this._oModel.getData().ID,
				SAP_LANGUAGE_KEY : newTitleLanguage,
				TEXT : newTitle,
				IS_ACTIVE : this._oModel.getData()["IS_ACTIVE"] || 1
		};
		var index;
		if((index = this.getIndexOfDuplicate(tableData["ADDITIONAL_LANGUAGE_TITLES"], newTitleLanguage)) == -1)
			tableData["ADDITIONAL_LANGUAGE_TITLES"].push(newEntry);
		else {
			tableData["ADDITIONAL_LANGUAGE_TITLES"].splice(index, 1);
			tableData["ADDITIONAL_LANGUAGE_TITLES"].push(newEntry);
		}

		ALTable.getModel("SB_DDACONFIG").refresh();
		return;
	},
	formatName:function(a,b){
		return a+" "+b;
	},


	/******* methods for Chart Name Additional Languages : END ************/

//	All Chart Refresh Functions :

	refreshChart: function() {

		var oController = this ;

		// for checking proper configuration while saving .
		this.canSave = false;

		var button = this.getView().byId("chartToolbar_config").getToolBar().getContentRight();
		if (button) {
			if(button[0] && (!(button[0].getVisible()))) { button[0].setVisible(true); }
			if(button[1] && (!(button[1].getVisible()))) { button[1].setVisible(true); }
			if(button[3] && (!(button[3].getVisible()))) { button[3].setVisible(true); }
			if(button[0])
				button[0].firePress();
		}

		this.oChartDataModel = new sap.ui.model.json.JSONModel() ;
		this.oChartData = [] ;

		this.dda_chart = this.getView().byId("oChartRef") ;  
		this.dda_chart.setStackedChartWidthEnhancer(false);
		this.dda_table = this.getView().byId("oChartTable") ;     

		var tmpData = this._oModel.getData();
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
		for(var i=0;i<tmpData.items.length;i++) {
			this.dda_config.columnsConfig.push({
				name: tmpData.items[i].NAME,
				type: tmpData.items[i].TYPE,
				selected: tmpData.items[i].SELECTED || false,
				visibility: tmpData.items[i].VISIBILITY || "BOTH",
				sortOrder: tmpData.items[i].SORT_ORDER || "NONE",
				sortBy: tmpData.items[i].SORT_BY || "",
				axis: tmpData.items[i].AXIS || 2,
				stacking: tmpData.items[i].STACKING || 0,
				color:tmpData.COLOR_SCHEME=="MANUAL_NON_SEMANTIC"?tmpData.items[i].COLOR1:tmpData.COLOR_SCHEME=="MANUAL_SEMANTIC"?tmpData.items[i].COLOR2:""
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
			if(this.dda_config.columnsConfig[i].selected) {
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
			this.getRuntimeChartData(this.dimNameArray,this.msrNameArray,this.oDimensions,this.oMeasures) ;           // TODO        P.S.  write code for avoiding multiple calls - caching .
		}                            


		//getting labels , texts etc.
		try {
			var mProperties = sap.suite.smartbusiness.odata.properties(this._oModel.getData().QUERY_SERVICE_URI,this._oModel.getData().QUERY_ENTITY_SET);
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
			this.canSave = true;
			return ;
		}
		// --------------------------------------------

		// if dual chart is chosen , but less than 2 measures selected .
		if((((this.dda_config.chartConfig.type).toUpperCase() == "BAR") && (this.dda_config.chartConfig.axis == "DUAL")) || (((this.dda_config.chartConfig.type).toUpperCase() == "COLUMN") && (this.dda_config.chartConfig.axis == "DUAL"))) {
			if(this.chartMeasures.length < 2) {
				sap.m.MessageBox.alert(oController._oTextsModel.getResourceBundle().getText("DUAL_AXIS_CHART_MIN_MEASURE"),{onClose:function(){
					if(oController._config)
						oController.restorePrevConfig();
					else
						oController.restoreFromConfigMasterSnapShot();
					oController.onChartTypeChange();
					oController.refreshChart();
					//oController.dda_chart.setDataset(new sap.viz.core.FlattenedDataset({}));
				}});               
				return;
			}
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
				sap.m.MessageBox.alert(oController._oTextsModel.getResourceBundle().getText("SELECT_MEASURE_FOR_AXIS",(isOneMsrAxis1 ? 2 : 1)),{onClose:function(){
					if(oController._config)
						oController.restorePrevConfig();
					else
						oController.restoreFromConfigMasterSnapShot();
					oController.onChartTypeChange();
					oController.refreshChart();
					//oController.dda_chart.setDataset(new sap.viz.core.FlattenedDataset({}));
				}});
				return ;
			}
		}
		// --------------------------------------------
		// if bubble chart chosen , but less than 3 measures selected .
		if(((this.dda_config.chartConfig.type).toUpperCase() === "BUBBLE") && (this.chartMeasures.length < 3)) {
			sap.m.MessageBox.alert(oController._oTextsModel.getResourceBundle().getText("BUBBLE_CHART_MEASURE_COUNT"),{onClose:function(){
				if(oController._config && (((oController._config.CHART_TYPE).toUpperCase() != "BUBBLE") || (oController.getSelectedMeasuresCount(oController._config.COLUMNS) >= 3)))
					oController.restorePrevConfig();
				else
					oController.restoreFromConfigMasterSnapShot();
				oController.onChartTypeChange();
				oController.refreshChart();
				//oController.dda_chart.setDataset(new sap.viz.core.FlattenedDataset({}));
			}});
			return;
		}    

		// --------------------------------------------

		if((this.dda_config.chartConfig.type).toUpperCase() === "BUBBLE") {
			this.oDataset = this.create_Dataset(this.chartDimensions,this.chartMeasures) ; 
			this.dda_chart.setDataset(this.oDataset) ;
		}

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
		                                      [this.formatChartNumbers.bind(this)],[this.formatChartNumbers.bind(this)],[this.formatChartNumbers.bind(this)]
		                                      ]);
		//--------------------------------------

		// chart popover :
		var formatterArray=[[],[],[]] ;
		for(var k=0;k<this.chartMsrNames.length;k++){
			formatterArray[0].push(this.getChartNumberFormatter(true));
			formatterArray[1].push(this.getChartNumberFormatter(true));
			formatterArray[2].push(this.getChartNumberFormatter(true));
		}
		this.dda_chart.setPopoverFormatter(formatterArray);
		//---------------------------------------------------------

		// Setting "in %" in axis for 100 percent charts :
		//this.set_percentCharts_uom();

		// Setting % in chart popover for percent charts :
		if(((chartType == 'BAR') || (chartType == 'COLUMN')) && (valueType == 'PERCENTAGE')) {
			var formatterArray=[[],[],[]] ;
			for(var k=0;k<this.chartMsrNames.length;k++){
				formatterArray[0].push(oController.getChartPercentFormatter(true));
				formatterArray[1].push(oController.getChartPercentFormatter(true));
			}
			this.dda_chart.setPopoverFormatter(formatterArray);
		}

		// when scale factor = % and mode is runtime , show % in chart :
		if(((this.dda_config.chartConfig.mode).toUpperCase() === "RUNTIME") && (this.EVALUATION.getScaling() == -2) && !(((chartType == 'BAR') || (chartType == 'COLUMN')) && (valueType == 'PERCENTAGE'))) {
			this.addPercentToChart(this.chartMsrNames);
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
		this.canSave = true;
		this.copyConfigSnapshot();
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
		var otoolbar = this.getView().byId("chartToolbar_config") ;
		var chtype = this.dda_config.chartConfig.type ;

		var isStackApplied = (((chtype == "BAR") || (chtype == "COLUMN")) && (this.isStackDim) && (this.getDimensionToBeStacked(that.chartDimensions)) && (dimensions.length > 1)) ? true : false ;        

		if((measures.length > 1) || (isStackApplied)) {             
			otoolbar.setShowLegend(true);
		} else {
			otoolbar.setShowLegend(false);
		}
	},

	getStacking: function(measures,dimensions) {                                                                 // TODO
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

	setStacking: function(isEnabled,type,columns) {                                                                         // TODO     type : M for measure , D for dimension and N for none .
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

	getAxisOfMsr: function(oMeasure) {
		var axis = 2 ; 
		for(var i=0;i<this.chartMeasures.length;i++) {
			if((this.chartMeasures[i]).name === oMeasure) {
				axis = (this.chartMeasures[i]).axis ;
				break;
			}
		}
		return axis;
	},

	getSelectedMeasuresCount: function(msrObjArray) {
		var count=0;
		for(var i=0;i<msrObjArray.length;i++) {
			if((msrObjArray[i].TYPE).toUpperCase() == "MEASURE" && (msrObjArray[i].SELECTED))
				++count;
		}
		return count;
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
	_getTableCellFormatter: function(originalMeasure, isPercentScaled, axisScaled) {
		var that = this;
		var formatter;
		var chartType = this.dda_config.chartConfig.type ;
		var valueType = this.dda_config.chartConfig.value ;
		var axisType = this.dda_config.chartConfig.axis ;
		if(isPercentScaled) {
			if(chartType.toUpperCase() == "TABLE") {
				if(that._isEvaluationThresholdMeasure(originalMeasure))
					formatter= this.getChartPercentFormatter(true);
				else
					formatter= this.getChartNumberFormatter(true);
			} else if((axisType == 'DUAL') && (valueType == "ABSOLUTE") && (chartType == 'BAR' || chartType == 'COLUMN')) {
				if(axisScaled[(that.getAxisOfMsr(originalMeasure))-1])
					formatter= this.getChartPercentFormatter(true);
				else
					formatter= this.getChartNumberFormatter(true);
			} else {
				formatter= this.getChartPercentFormatter(true);
			}
		}
		else	
			formatter= this.getChartNumberFormatter(true);
		return formatter;
	},
	_getTableCell : function(originalMeasure, thresholdMeasure, is_percent_scale, axisScale) {
		var that = this;
		if(thresholdMeasure && (originalMeasure !== thresholdMeasure)) {
			return new sap.m.ObjectNumber({
				number: {
					path: originalMeasure,
					formatter: that._getTableCellFormatter(originalMeasure, is_percent_scale, axisScale)  
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
					formatter: that._getTableCellFormatter(originalMeasure, is_percent_scale, axisScale)
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
		var thresholdmsr = this._oModel.getData()["THRESHOLD_MEASURE"];

		var is_percent_scale = false;
		var chartType = this.dda_config.chartConfig.type ;
		var valueType = this.dda_config.chartConfig.value ;
		var axisType = this.dda_config.chartConfig.axis ;
		if((this.sapCaChartType).toUpperCase() === "TABLE")
			var oMsrs = this.tableMsrNames ;
		else
			var oMsrs = this.chartMsrNames ;
		if(((this.dda_config.chartConfig.mode).toUpperCase() === "RUNTIME") && (this.EVALUATION.getScaling() == -2) && this.getIsPercentScaled(oMsrs) && !(((chartType == 'BAR') || (chartType == 'COLUMN')) && (valueType == 'PERCENTAGE'))) {
			is_percent_scale = true;
		}
		var axisScale = [] ;
		if(is_percent_scale) {
			if((axisType == 'DUAL') && (valueType == "ABSOLUTE") && (chartType == 'BAR' || chartType == 'COLUMN')) {
				var msrsObj = this.getMeasuresByAxis(this.chartMeasures);	        	
				axisScale.push(this.getIsPercentScaled(msrsObj.axis1.nameArr));
				axisScale.push(this.getIsPercentScaled(msrsObj.axis2.nameArr));
			}
		}

		for(var i=0;i<measures.length;i++){
			var val = measures[i].name;
			if(this._oModel.getData()["COLOR_SCHEME"] == "AUTO_SEMANTIC")
				var ocell = this._getTableCell(val, thresholdmsr, is_percent_scale, axisScale);
			else
				var ocell = this._getTableCell(val, val, is_percent_scale, axisScale);
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

	getRuntimeChartData: function(dimensions,measures,dimObjArr,msrObjArr) {                          // TODO
		var that = this;

		var chartToolbarRef = this.getView().byId("chartToolbar_config");
		chartToolbarRef.setBusy(true);

		var oDims = [];
		var oMsrs = [];

		dimensions.forEach(function(x){oDims.push(x)}) ;
		measures.forEach(function(x){oMsrs.push(x)}) ;

		this.COLUMNS_SORT = [];
		for(var i=0;i<that.oColumns.length;i++) {
			if(that.oColumns[i].sortBy && that.oColumns[i].sortOrder) {
				if((that.oColumns[i].sortOrder).toUpperCase() == "ASC" || (that.oColumns[i].sortOrder).toUpperCase() == "DESC") {
					this.COLUMNS_SORT.push({
						name : that.oColumns[i].sortBy,
						order : that.oColumns[i].sortOrder
					});
					if(that.oColumns[i].sortBy != that.oColumns[i].name) {
						if((that.oColumns[i].type).toUpperCase() == "DIMENSION") {
							if((oDims.indexOf(that.oColumns[i].sortBy)) == -1) {
								oDims.push(that.oColumns[i].sortBy) ;
							}
						} else if((that.oColumns[i].type).toUpperCase() == "MEASURE") {
							if((oMsrs.indexOf(that.oColumns[i].sortBy)) == -1) {
								oMsrs.push(that.oColumns[i].sortBy) ;
							}
						}
					}
				}
			}
		}        

		try{
			var oUriObject = sap.suite.smartbusiness.odata.getUri({
				serviceUri : this._oModel.getData().QUERY_SERVICE_URI,
				entitySet : this._oModel.getData().QUERY_ENTITY_SET,
				dimension : oDims,
				measure : oMsrs,
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

	getChartNumberFormatter: function(isStandard){
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

	getIsPercentScaled: function(measures) {
		if(this.thresholdMeasuresArray && this.thresholdMeasuresArray.length) {
			var thresholdMsrsArray = this.thresholdMeasuresArray;
		} else {
			var thresholdMsrsArray = this._getEvaluationThresholdMeasures();
		}
		var isPercentScaled = false ;
		if(thresholdMsrsArray && thresholdMsrsArray.length) {
			for(var i=0;i<measures.length;i++) {
				if(thresholdMsrsArray.indexOf(measures[i]) != -1) {
					isPercentScaled = true ;
					break ;
				} 
			}
		}
		return isPercentScaled;
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

	_isEvaluationThresholdMeasure : function(oMsr) {
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

	addPercentToChart: function(measures) {
		var that = this;     	
		var isPercentScaled = this.getIsPercentScaled(measures);

		if(isPercentScaled) {
			if(this.dda_chart) {
				var chartType = this.dda_config.chartConfig.type ;
				var axisType = this.dda_config.chartConfig.axis ;
				var valueType = this.dda_config.chartConfig.value ;
				if(((chartType == 'BAR') || (chartType == 'COLUMN')) && (valueType == "ABSOLUTE") && (axisType == 'DUAL')) {
					var msrsObj = this.getMeasuresByAxis(this.chartMeasures);
					var isAxis1Scaled = this.getIsPercentScaled(msrsObj.axis1.nameArr);
					var isAxis2Scaled = this.getIsPercentScaled(msrsObj.axis2.nameArr);
					// data label & chart popover :
					var labelFormatter = [[],[]];
					var formatterArray=[[],[],[]] ;
					if(isAxis1Scaled) {
						labelFormatter[0].push(that.getChartPercentFormatter());
						for(var k=0;k<msrsObj.axis1.nameArr.length;k++){
							formatterArray[0].push(that.getChartPercentFormatter(true));
						}
					} else {
						labelFormatter[0].push(that.formatChartNumbers.bind(that));
						for(var k=0;k<msrsObj.axis1.nameArr.length;k++){
							formatterArray[0].push(that.getChartNumberFormatter(true));
						}
					}
					if(isAxis2Scaled) {
						labelFormatter[1].push(that.getChartPercentFormatter());
						for(var k=0;k<msrsObj.axis2.nameArr.length;k++){
							formatterArray[1].push(that.getChartPercentFormatter(true));
						}
					} else {
						labelFormatter[1].push(that.formatChartNumbers.bind(that));
						for(var k=0;k<msrsObj.axis2.nameArr.length;k++){
							formatterArray[1].push(that.getChartNumberFormatter(true));
						}
					}
					this.dda_chart.setDataLabelFormatter(labelFormatter);
					this.dda_chart.setPopoverFormatter(formatterArray);
					// chart axis :
					if(chartType == 'BAR') {
						this.dda_chart.setXAxisLabelFormatter(isAxis1Scaled?that.getChartPercentFormatter():that.formatChartNumbers.bind(that));
						this.dda_chart.setYAxisLabelFormatter(that.pseudoChartFormatter);
						this.dda_chart.setXAxis2LabelFormatter(isAxis2Scaled?that.getChartPercentFormatter():that.formatChartNumbers.bind(that));
						this.dda_chart.setYAxis2LabelFormatter(that.pseudoChartFormatter); 
					} else if(chartType == 'COLUMN') {
						this.dda_chart.setXAxisLabelFormatter(that.pseudoChartFormatter);
						this.dda_chart.setYAxisLabelFormatter(isAxis1Scaled?that.getChartPercentFormatter():that.formatChartNumbers.bind(that));
						this.dda_chart.setXAxis2LabelFormatter(that.pseudoChartFormatter);
						this.dda_chart.setYAxis2LabelFormatter(isAxis2Scaled?that.getChartPercentFormatter():that.formatChartNumbers.bind(that));
					}
				} else {
					// data label :
					this.dda_chart.setDataLabelFormatter([[this.getChartPercentFormatter()],[this.getChartPercentFormatter()],[this.getChartPercentFormatter()]]);
					// chart popover :
					var formatterArray=[[],[],[]] ;
					for(var k=0;k<measures.length;k++){
						formatterArray[0].push(that.getChartPercentFormatter(true));
						formatterArray[1].push(that.getChartPercentFormatter(true));
						formatterArray[2].push(that.getChartPercentFormatter(true));
					}
					this.dda_chart.setPopoverFormatter(formatterArray);
					// chart axis :					
					if ((chartType == 'BAR') && (valueType == "ABSOLUTE")) {
						this.dda_chart.setXAxisLabelFormatter(that.getChartPercentFormatter());
						if(axisType == 'DUAL')
						{
							this.dda_chart.setXAxis2LabelFormatter(that.getChartPercentFormatter());
						}
					} else if(chartType == 'BUBBLE') {
						this.dda_chart.setXAxisLabelFormatter(that.getChartPercentFormatter());
						this.dda_chart.setYAxisLabelFormatter(that.getChartPercentFormatter());
					} else if(((chartType == 'BAR') || (chartType == 'COLUMN')) && (valueType == 'PERCENTAGE')) {
						// do nothing .
					} else {
						this.dda_chart.setYAxisLabelFormatter(that.getChartPercentFormatter());
						if((chartType == 'COLUMN') && (axisType == 'DUAL'))
						{
							this.dda_chart.setYAxis2LabelFormatter(that.getChartPercentFormatter());
						}
					}
				}
			}
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

	// --------------------------------------------------------------------------------------------

	/*
	 * START - VALIDATE AND SAVE FUNCTIONS
	 */
	/**
	 * No need to make odata call, as all the configurations available locally.
	 */
	//called on change as well as before save
	validateChartId: function(oEvent){
		//@TODO get Field reference using fragment
		var chartIdField = oEvent ? oEvent.getSource() : this.getView().getContent()[0].getContent()[0].getMasterPages()[0].getContent()[2].getItems()[1];
		var chartId =  chartIdField.getValue();
		//chartId shouldn't be blank, must contain only words,numbers,.,_
		if(/^[\w\d\.\_]+$/.test(chartId)) {
			if(this.DDA_MODEL.getConfigurator().findViewById(chartId)) {
				if(!this._oModel.getData().ID_EDITABLE){
					chartIdField.setValueState(sap.ui.core.ValueState.None);
					return true;
				} else {
					chartIdField.setValueState(sap.ui.core.ValueState.Error);
					chartIdField.focus();
					return false;
				}
			} else {
				chartIdField.setValueState(sap.ui.core.ValueState.None);
				return true;
			}
		} else {
			chartIdField.setValueState(sap.ui.core.ValueState.Error);
			return false;
		}
	},

	validateChartName: function() {
		//@TODO get Field reference using fragment
		var chartNameField = this.getView().getContent()[0].getContent()[0].getMasterPages()[0].getContent()[2].getItems()[3];
		var chartName = chartNameField.getValue();
		if(chartName) {
			chartNameField.setValueState(sap.ui.core.ValueState.None);
			return true;
		} else {
			chartNameField.setValueState(sap.ui.core.ValueState.Error);
			chartNameField.focus();
			return false;
		}
	},

	validateDataLimit:function(oEvent){
		var datafield = oEvent ? oEvent.getSource() :this.getView().getContent()[0].getContent()[0].getMasterPages()[0].getContent()[2].getItems()[7];	
		var dataLimit = datafield.getValue();
		if(/^\d+$/gi.test(dataLimit)) {

			var parseDataLimit=parseInt(dataLimit,10);
			if( parseDataLimit>0){
				datafield.setValueState(sap.ui.core.ValueState.None);
				return true;
			}
		}else{
			datafield.setValueState(sap.ui.core.ValueState.Error);
			return false; 
		}

	},
	onSave:function(){
		if(this.validateChartId() && this.validateChartName()&&this.validateDataLimit()) {
			var self = this;
			if(this.currentViewId == this.DDA_MODEL.NEW_VIEWID) {
				this.oApplicationFacade.__newViewAdded = true;
				this.oApplicationFacade.createdViewId = this.getView().getModel("SB_DDACONFIG").getData().SELECTED_VIEW;
			}
			this.busyIndicator.open() && this.getView().setBusy(true);
			var modelData=this.getView().getModel("SB_DDACONFIG").getData();
			var saveService=sap.suite.smartbusiness.ddaconfig.DrilldownSaveService;
			saveService.saveViewConfiguration(this.evaluationId,modelData,"update",function(){
				jQuery.sap.log.info("all calls success");
				self.busyIndicator.close() && self.getView().setBusy(false);
				sap.m.MessageToast.show(self._oTextsModel.getResourceBundle().getText("CHART_CONFIG_SAVE_SUCCESS"));
				self.oApplicationFacade.__refreshModel = 1;
				window.history.back();
				self.takeConfigMasterSnapShot();

			},function(){
				jQuery.sap.log.error(x + " failed");
				self.busyIndicator.close() && self.getView().setBusy(false);
				sap.suite.smartbusiness.utils.showErrorMessage(self._oTextsModel.getResourceBundle().getText("SAVE_ERROR"));
			});
		}
	},
	formatMeasureName : function(s){
		s = this.COLUMN_LABEL_MAPPING[s];
		if(s==this.DDA_MODEL.EVALUATION_DATA.COLUMN_NAME){

			s=s+ "(" + this.getView().getModel("i18n").getProperty("KPI_MEASURE") +")";
		}

		return s;
	},
	formatMeasureNameInList: function(name,type){
		if(type=="MEASURE")
			type=this.getView().getModel("i18n").getProperty("MEASURE");
		if(type=="DIMENSION")
			type=this.getView().getModel("i18n").getProperty("DIMENSION");
		if(name==this.DDA_MODEL.EVALUATION_DATA.COLUMN_NAME){

			type=this.getView().getModel("i18n").getProperty("KPI_MEASURE");
		}


		return type;
	},

	formatType:  function(type){
		if(type=="MEASURE")
			type=this.getView().getModel("i18n").getProperty("MEASURE");
		if(type=="DIMENSION")
			type=this.getView().getModel("i18n").getProperty("DIMENSION");
		return type;
	},

	/**
	 * Change the order of Dimensions And Measures Added
	 */
	sortDimensionsAndMeasures : function() {
		var oController = this;
		new sap.suite.ui.smartbusiness.lib.ListPersona({
			title : this.getView().getModel("i18n").getProperty("CHANGE_ORDER"),
			view : this.getView(),
			context : '/items',
			listItemContext : 'LABEL',
			formatter:jQuery.proxy(this.formatMeasureName,this),
			namedModel : 'SB_DDACONFIG',
			filter : {
				property : 'SELECTED',
				value : true
			},
			callback : function() {
				oController.refreshChart();
			}
		}).start();
	},

	onBack : function() {
		this.restoreFromConfigMasterSnapShot();
		window.history.back();
	},

	onCancel: function() {
		var self = this;
		new sap.m.Dialog({
			icon:"sap-icon://warning2",
			title:self._oTextsModel.getResourceBundle().getText("WARNING"),
			state:"Error",
			type:"Message",
			content:[new sap.m.Text({text:self._oTextsModel.getResourceBundle().getText("ARE_YOU_SURE")})],
			beginButton: new sap.m.Button({
				text:self._oTextsModel.getResourceBundle().getText("OK"),
				press: function(){
					self.restoreFromConfigMasterSnapShot();
					this.getParent().close();
					window.history.back();
				}
			}),
			endButton: new sap.m.Button({
				text:self._oTextsModel.getResourceBundle().getText("CANCEL"),
				press:function(){this.getParent().close();}
			})                                           
		}).open();
	},
	onExit:function(){
		this.restoreFromConfigMasterSnapShot();
	},

	//disable save button when no measure/dimension is selected
	enableOrDisableSave : function(){
		var msrDimArr = this._config.items.filter(function(s){return s.SELECTED});
		if(this.dda_config.chartConfig.type.toUpperCase() == "TABLE") this.canSave = true;
		if(msrDimArr.length && this.canSave){
			this.getView().byId("save-btn").setEnabled(true);
		}
		else{
			this.getView().byId("save-btn").setEnabled(false);
		}
	}
});
