jQuery.sap.require("sap.ca.scfld.md.controller.BaseFullscreenController");
jQuery.sap.includeStyleSheet("../../resources/sap/suite/ui/smartbusiness/designtime/evaluation/view/evaluationParameters.css");

sap.ca.scfld.md.controller.BaseFullscreenController.extend("sap.suite.ui.smartbusiness.designtime.evaluation.view.S1",{	
	onAfterRendering : function(){
		var that = this;
		that.initialModel = that._cloneObj(that.getView().getModel().getData());
	},
	navigateBack : function(){
		var that = this;
		var isActive;
		var backDialog = new sap.m.Dialog({
			icon:"sap-icon://warning2",
			title:that.oResourceBundle.getText("WARNING"),
			state:"Warning",
			type:"Message",
			content:[new sap.m.Text({text:that.oResourceBundle.getText("NAVIGATION_DATA_LOSS")})],
			beginButton: new sap.m.Button({
				text:that.oResourceBundle.getText("CONTINUE"),
				press: function(){
					backDialog.close();
					if(that.fromHome){
						window.location.hash = "";
					}
					else{
						if(this.editDraft){
							window.location.hash = "FioriApplication-SBWorkspace?sap-system=HANA&/evalDetail/INDICATORS_MODELER(ID='"+that.getView().getModel().getData().INDICATOR+"',IS_ACTIVE=1)/EVALUATIONS_MODELER(ID='"+that.getView().getModel().getData().ID+"',IS_ACTIVE=1)";
						}
						else
						if(that.evalContext){
							window.location.hash = "FioriApplication-SBWorkspace?sap-system=HANA&/evalDetail/INDICATORS_MODELER(ID='"+that.getView().getModel().getData().INDICATOR+"',IS_ACTIVE=1)/EVALUATIONS_MODELER(ID='"+that.getView().getModel().getData().ID+"',IS_ACTIVE="+isActive+")";
						}
						else{
							window.location.hash = "FioriApplication-SBWorkspace?sap-system=HANA&/detail/INDICATORS_MODELER(ID='"+that.getView().getModel().getData().INDICATOR+"',IS_ACTIVE=1)";
						}
						
					}
				}
			}),
			endButton: new sap.m.Button({
				text:that.oResourceBundle.getText("CANCEL"),
				press:function(){
					backDialog.close();
				}
			})                                                
		});
		var updateRequired = false;
		if(that.getView().getModel().getData().mode === "create"){
			var batch = {};
			batch.oldPayload = that.getEvalParamPayload(that.initialModel);
			batch.newPayload = that.getEvalParamPayload(that.getView().getModel().getData());
			batch.objectType = "Evaluations";
			batch = sap.suite.smartbusiness.utils.dirtyBitCheck(batch);
			if(batch.updates.length > 0){
				updateRequired = true;
			}
		}
		else{
			var that = this,i = 0;
			
			var batch = {};
			that.saveFilters(that.getView());
			that.saveValues(that.getView());
			that.saveTags(that.getView());
			that.saveProperties(that.getView());
			that.saveAdditionalLanguages(that.getView());

			//checking for changes in evaluation parameters
			batch.oldPayload = that.getEvalParamPayload(that.evalDetails);
			batch.oldPayload.DATA_SPECIFICATION = "";
			isActive = batch.oldPayload.IS_ACTIVE;
			batch.oldPayload.IS_ACTIVE = 0;
			batch.newPayload = that.getEvalParamPayload(that.getView().getModel().getData());
			batch.newPayload.DATA_SPECIFICATION = "";
			batch.objectType = "Evaluations";
			batch = sap.suite.smartbusiness.utils.dirtyBitCheck(batch);
			if(batch.updates.length > 0){
				updateRequired = true;
			}

			//for changes in evaluation filters
			batch.oldPayload = that.evalDetails.FILTERS.results;
			for(var key in batch.oldPayload){
				batch.oldPayload[key].IS_ACTIVE = 0;
			}
			batch.newPayload = that.evalFiltersPayload;
			batch.objectType = "EVALUATION_FILTERS";
			batch = sap.suite.smartbusiness.utils.dirtyBitCheck(batch);
			if(batch.deletes.length > 0){
				updateRequired = true;
			}
			if(batch.updates.length > 0){
				updateRequired = true;
			}

			//for changes in evaluation values
			for(i=0;i<that.evalDetails.VALUES.results.length;i++){
				if(that.evalDetails.VALUES.results[i].COLUMN_NAME){
					delete that.evalDetails.VALUES.results[i].FIXED;
				}
				else{
					delete that.evalDetails.VALUES.results[i].COLUMN_NAME;
				}
			}
			batch.oldPayload = that.evalDetails.VALUES.results;
			for(var key in batch.oldPayload){
				batch.oldPayload[key].IS_ACTIVE = 0;
			}
			batch.newPayload = that.valuesPayload;
			batch.objectType = "EVALUATION_VALUES";
			batch = sap.suite.smartbusiness.utils.dirtyBitCheck(batch);
			if(batch.deletes.length > 0){
				updateRequired = true;
			}
			if(batch.updates.length > 0){
				updateRequired = true;
			}

			//for changes in evaluation tags
			batch.oldPayload = that.evalDetails.TAGS.results;
			for(var key in batch.oldPayload){
				batch.oldPayload[key].IS_ACTIVE = 0;
			}
			batch.newPayload = that.tagsPayload;
			batch.objectType = "TAGS";
			batch = sap.suite.smartbusiness.utils.dirtyBitCheck(batch);
			if(batch.deletes.length > 0){
				updateRequired = true;
			}
			if(batch.updates.length > 0){
				updateRequired = true;
			}

			//for changes in evaluation properties
			batch.oldPayload = that.evalDetails.PROPERTIES.results;
			for(var key in batch.oldPayload){
				batch.oldPayload[key].IS_ACTIVE = 0;
			}
			batch.newPayload = that.propPayload
			batch.objectType = "PROPERTIES";
			batch = sap.suite.smartbusiness.utils.dirtyBitCheck(batch);
			if(batch.deletes.length > 0){
				updateRequired = true;
			}
			if(batch.updates.length > 0){
				updateRequired = true;
			}

			//for changes in additional languages
			batch.oldPayload = that.evalDetails.ADDITIONAL_LANGUAGE_ARRAY;
			for(var key in batch.oldPayload){
				batch.oldPayload[key].IS_ACTIVE = 0;
			}
			batch.newPayload = that.languagesPayload
			batch.objectType = "EVALUATION_TEXTS";
			batch = sap.suite.smartbusiness.utils.dirtyBitCheck(batch);
			if(batch.deletes.length > 0){
				updateRequired = true;
			}
			if(batch.updates.length > 0){
				updateRequired = true;
			}
			
		}
		if(updateRequired){
			backDialog.open();
		}
		else{
			if(that.fromHome){
				window.location.hash = "";
			}
			else{
				if(this.editDraft){
					window.location.hash = "FioriApplication-SBWorkspace?sap-system=HANA&/evalDetail/INDICATORS_MODELER(ID='"+that.getView().getModel().getData().INDICATOR+"',IS_ACTIVE=1)/EVALUATIONS_MODELER(ID='"+that.getView().getModel().getData().ID+"',IS_ACTIVE=1)";
				}
				else
				if(that.evalContext){
					window.location.hash = "FioriApplication-SBWorkspace?sap-system=HANA&/evalDetail/INDICATORS_MODELER(ID='"+that.getView().getModel().getData().INDICATOR+"',IS_ACTIVE=1)/EVALUATIONS_MODELER(ID='"+that.getView().getModel().getData().ID+"',IS_ACTIVE="+isActive+")";
				}
				else{
					window.location.hash = "FioriApplication-SBWorkspace?sap-system=HANA&/detail/INDICATORS_MODELER(ID='"+that.getView().getModel().getData().INDICATOR+"',IS_ACTIVE=1)";
				}
				
			}
		}
	},
	onInit : function() {
		var that = this;
		that.fromHome = false;
		var oOptions = {
				onBack : function(){
					that.navigateBack();
				},

				bSuppressBookmarkButton : {},
				oEditBtn : {
					sI18nBtnTxt : "SAVE",
					onBtnPressed : function(evt) {
						that.saveAndExit();
					}
				},
				buttonList : [{
					sI18nBtnTxt : "SAVE_CREATE_NEW",
					onBtnPressed : function(evt) {
						that.saveAndCreateNew();
					}
				}, 
				{
					sI18nBtnTxt : "SAVE_AND_ACTIVATE",
					onBtnPressed : function(evt) {
						that.saveAndActivate();
					}
				},{
					sI18nBtnTxt : "ACTIVATE_VISUALIZE",
					onBtnPressed : function(evt) {
						that.activateAndAddTiles();
					}
				},{
					sI18nBtnTxt : "CANCEL",
					onBtnPressed : function(evt) {
						that.navigateBack();
					}
				}]
		};
		this.setHeaderFooterOptions(oOptions);
		this.busyDialog = new sap.m.BusyDialog();
		this.oResourceBundle = this.oApplicationFacade.getResourceBundle();
		var oModel = new sap.ui.model.json.JSONModel({NO_OF_ADDITIONAL_LANGUAGES:0});
		this.getView().setModel(oModel); 
		this.oDataModel = this.oApplicationFacade.getODataModel();
		this.editDraft = false;
		//this.oDataModel.attachRequestCompleted(that.onODataServiceLoad, that); // this is to ensure that we fire
		// select event on the odata
		// service field only after we
		// receive the data
		this.oModelForInputParameters = new sap.ui.model.json.JSONModel();
		this.oModelForDimensions = new sap.ui.model.json.JSONModel();

		var evalContext = this.evalContext || "";
		that.getView().byId("propertyNameValueBox").bindAggregation("items", "/PROPERTIES", function(a, b) {
			return new sap.ui.layout.Grid({
				content : [new sap.m.Input({
					value : "{NAME}",
					layoutData : new sap.ui.layout.GridData({
						span : "L4 M4 S4"
					})
				}), new sap.m.Input({
					value : "{VALUE}",
					layoutData : new sap.ui.layout.GridData({
						span : "L4 M4 S4"
					})
				}), new sap.m.Button({
					icon : "sap-icon://sys-cancel",
					type : "Transparent",
					layoutData : new sap.ui.layout.GridData({
						span : "L2 M2 S2"
					}),
					press : function(evt) {
						that.removeProperty(evt);
					}
				})],
				defaultSpan : "L12 M12 S12"
			}).addStyleClass("propertyEntryGrid");;
		});
		this.oDataModel.read("/LANGUAGE?$filter=LAISO eq '"+(sap.ui.getCore().getConfiguration().getLocale().getLanguage()).toUpperCase()+"'", null, null, false, function(data) {
			that.localLanguage = data.results[0].SPRAS;
		});
		that.getView().getModel().setProperty("/NO_OF_ADDITIONAL_LANGUAGES", 0);
		this.setInputParameterAndFilterLayout();
		this.decideMode();
	},
	decideMode : function(){
		var that = this;
		this.oRouter.attachRouteMatched(function(evt) {
			this.getView().getModel().setProperty("/SCALING","0")
			if(evt.getParameter("name") === "duplicateEvaluation"){
				try {
                    if(sap.ushell.services.AppConfiguration && sap.ushell.services.AppConfiguration.setWindowTitle){
                            sap.ushell.services.AppConfiguration.setWindowTitle(that.oResourceBundle.getText("FULLSCREEN_TITLE_DUPLICATE"));
                    }
                } catch(e){
                    jQuery.sap.log.error("Error Setting Window Page Title : "+that.oResourceBundle.getText("FULLSCREEN_TITLE_DUPLICATE"))
                }
                that.duplicateEval = true;
				this.evalContext = evt.getParameter("arguments").evaluationContext;
				this.indicatorContext = evt.getParameter("arguments").indicatorContext;
				that.getView().getModel().setProperty("/mode","create");
				that._oControlStore.oTitle.setText(that.oResourceBundle.getText("FULLSCREEN_DYN_TITLE", "Duplicate"));
				that.byId("evalId").setEditable(true);
				that.populateEvalDetails();
				that.fromHome = false;
			}
			else if(evt.getParameter("name") === "editEvaluationDraft"){
				try {
                    if(sap.ushell.services.AppConfiguration && sap.ushell.services.AppConfiguration.setWindowTitle){
                            sap.ushell.services.AppConfiguration.setWindowTitle(that.oResourceBundle.getText("FULLSCREEN_TITLE_EDIT"));
                    }
                } catch(e){
                    jQuery.sap.log.error("Error Setting Window Page Title : "+that.oResourceBundle.getText("FULLSCREEN_TITLE_EDIT"))
                }
				that.footerForEditMode();
				this.evalContext = evt.getParameter("arguments").evaluationContext;
				this.indicatorContext = evt.getParameter("arguments").indicatorContext;
				that.getView().getModel().setProperty("/mode","edit");
				this.editDraft = true;
				that.populateEvalDetails();
				that._oControlStore.oTitle.setText(that.oResourceBundle.getText("FULLSCREEN_DYN_TITLE", "Edit"));
				that.byId("evalId").setEditable(false);
				that.fromHome = false;
			}
			else if(evt.getParameter("arguments").indicatorContext && evt.getParameter("arguments").evaluationContext){
				try {
                    if(sap.ushell.services.AppConfiguration && sap.ushell.services.AppConfiguration.setWindowTitle){
                            sap.ushell.services.AppConfiguration.setWindowTitle(that.oResourceBundle.getText("FULLSCREEN_TITLE_EDIT"));
                    }
                } catch(e){
                    jQuery.sap.log.error("Error Setting Window Page Title : "+that.oResourceBundle.getText("FULLSCREEN_TITLE_EDIT"))
                }
				this.evalContext = evt.getParameter("arguments").evaluationContext;
				this.indicatorContext = evt.getParameter("arguments").indicatorContext;
				that.getView().getModel().setProperty("/mode","edit");
				that.populateEvalDetails();
				that._oControlStore.oTitle.setText(that.oResourceBundle.getText("FULLSCREEN_DYN_TITLE", "Edit"));
				that.byId("evalId").setEditable(false);
				that.fromHome = false;
			}
			else if(evt.getParameter("arguments").indicatorContext){
				that.getView().getModel().setProperty("/mode","create");
				that.busyDialog.open();
				this.indicatorContext = evt.getParameter("arguments").indicatorContext;
				that.getView().getModel().setProperty("/IS_ACTIVE",0);
				that.getView().getModel().setProperty("/NO_OF_ADDITIONAL_LANGUAGES", 0);
				that.getKpiDetails();
				that._oControlStore.oTitle.setText(that.oResourceBundle.getText("FULLSCREEN_DYN_TITLE", "Add"));
				that.byId("indicatorId").setEditable(false);
				that.fromHome = false;
			}
			else{
				that.byId("selectKpi").setText(that.oResourceBundle.getText("SELECT_KPI_OPI"));
				that.getView().getModel().setProperty("/mode","create");
				that.getView().getModel().setProperty("/IS_ACTIVE",0);
				that.getView().getModel().setProperty("/NO_OF_ADDITIONAL_LANGUAGES", 0);
				that._oControlStore.oTitle.setText(that.oResourceBundle.getText("FULLSCREEN_DYN_TITLE", "Add"));
				that.fromHome = true;
			}

		}, this);
	},
	footerForEditMode : function(){
		var that = this;
		var oOptions = {
				bSuppressBookmarkButton : {},
				onBack : function(){
					that.navigateBack();
				},
				oEditBtn : {
					sI18nBtnTxt : "SAVE",
					onBtnPressed : function(evt) {
						that.saveAndExit();
					}
				},
				buttonList : [{
					sI18nBtnTxt : "SAVE_AND_ACTIVATE",
					onBtnPressed : function(evt) {
						that.saveAndActivate();
					}
				}, {
					sI18nBtnTxt : "DELETE",
					onBtnPressed : function(evt) {
						that.deleteDraft();
					}
				}, {
					sI18nBtnTxt : "CANCEL",
					onBtnPressed : function(evt) {
						that.navigateBack();
					}
				}]
		};
		this.setHeaderFooterOptions(oOptions);
	},
	populateEvalDetails : function(){
		var that = this;
		that.busyDialog.open();
		that.oDataModel.read(that.indicatorContext, null,null, true, function(kpiData) {
			that.getView().getModel().setProperty("/INDICATOR",kpiData.ID);
			that.byId("indicatorId").setEditable(false);
			that.getView().getModel().setProperty("/GOAL_TYPE",kpiData.GOAL_TYPE);
			if(kpiData.DATA_SPECIFICATION != ""){
				that.getView().getModel().setProperty("/DATA_SPECIFICATION",kpiData.DATA_SPECIFICATION);
				that.byId("additionalInfo").setVisible(true);
			}
			else{
				that.byId("additionalInfo").setVisible(false);
			}
			that.getView().getModel().setProperty("/INDICATOR_TYPE",kpiData.TYPE);
			that.oDataModel.read(that.evalContext, null,"$expand=FILTERS,VALUES,PROPERTIES,TAGS", true, function(data) {
				that.evalDetails = {};
				that.evalDetails = that._cloneObj(data);
				that.getView().getModel().setProperty("/ID",data.ID);
				that.getView().getModel().setProperty("/TITLE",data.TITLE);
				that.getView().getModel().setProperty("/DESCRIPTION",data.DESCRIPTION);
				that.oDataModel.read("/EVALUATION_TEXTS?$filter=ID eq '" + data.ID + "' and IS_ACTIVE eq " + data.IS_ACTIVE, null, null, false, function(languageData) {
					languageData = languageData.results;
					var languageArray = [];
					for(i=0;i<languageData.length;i++){
						var languageObject = {};
						languageObject.TITLE = languageData[i].TITLE;
						languageObject.DESCRIPTION = languageData[i].DESCRIPTION;
						that.oDataModel.read("/LANGUAGE?$filter=SPRAS eq '"+languageData[i].LANGUAGE+"'", null, null, false, function(data) {
							languageObject.LANGUAGE_KEY = data.results[0].LAISO;
							languageObject.LANGUAGE = data.results[0].SPRAS;
							languageObject.IS_ACTIVE = that.getView().getModel().getData().IS_ACTIVE;
							languageObject.ID = that.getView().getModel().getData().ID;
						});
						if(languageObject.LANGUAGE!=that.localLanguage){
							languageArray.push(languageObject);
						}
					}
					that.getView().getModel().setProperty("/ADDITIONAL_LANGUAGE_ARRAY",languageArray);
					that.getView().getModel().setProperty("/NO_OF_ADDITIONAL_LANGUAGES",languageArray.length); 
					that.evalDetails.ADDITIONAL_LANGUAGE_ARRAY = languageArray;
					that.evalDetails.NO_OF_ADDITIONAL_LANGUAGES = languageArray.length;
				});

				that.getView().getModel().setProperty("/IS_ACTIVE",0);
				that.getView().getModel().setProperty("/SEMANTIC_OBJECT",data.SEMANTIC_OBJECT);
				that.getView().getModel().setProperty("/ACTION",data.ACTION);
				if(data.GOAL_TYPE)
					that.getView().getModel().setProperty("/GOAL_TYPE",data.GOAL_TYPE);
				that.getView().getModel().setProperty("/INDICATOR_TYPE",data.INDICATOR_TYPE);

				that.getView().getModel().setProperty("/OWNER_NAME",data.OWNER_NAME);
				that.getView().getModel().setProperty("/OWNER_ID",data.OWNER_ID);
				that.getView().getModel().setProperty("/OWNER_E_MAIL",data.OWNER_E_MAIL);
				that.getView().getModel().setProperty("/VIEW_NAME",data.VIEW_NAME);
				that.getView().getModel().setProperty("/ODATA_URL",data.ODATA_URL);
				that.createTargetThresholdLayout();
				if(data.ODATA_ENTITYSET){
					that.getView().getModel().setProperty("/ODATA_ENTITYSET",data.ODATA_ENTITYSET);
					//that.populateDimensionsAndInputParameters(that.getView().getModel().getProperty("/ODATA_URL"), that.getView().getModel().getProperty("/ODATA_ENTITYSET"));
					try{
						that.oModelForMeasure = that.populateMeasure(that.getView().getModel().getProperty("/ODATA_URL"), that.getView().getModel().getProperty("/ODATA_ENTITYSET"));
						that.populateDimensionsAndInputParameters(that.getView().getModel().getProperty("/ODATA_URL"), that.getView().getModel().getProperty("/ODATA_ENTITYSET"));
					}
					catch(e){
						sap.suite.smartbusiness.utils.showErrorMessage(that.oResourceBundle.getText("ERROR_WRONG_ENTITY_SET"), that.oResourceBundle.getText("ERROR_ODATA_ANALYTICS"));
						that.resetDimensionsAndInputParameters();
					}

				}

				that.getView().getModel().setProperty("/COLUMN_NAME",data.COLUMN_NAME);  

				that.getView().getModel().setProperty("/SCALING",data.SCALING);
				that.getView().getModel().updateBindings();
				if(data.TAGS.results.length > 0){
					var tags = "";
					for(var i=0;i<data.TAGS.results.length;i++){
						tags+=data.TAGS.results[i].TAG+",";
					}
					tags = tags.substring(0,tags.length-1);
					that.getView().getModel().setProperty("/TAG",tags);
				}
				if(data.FILTERS.results.length > 0){
					var inputParams = [], dimensions = [],j=0,k=0;
					for(var i=0;i<data.FILTERS.results.length;i++){
						if(data.FILTERS.results[i].TYPE === "PA"){
							inputParams[j] = {};
							inputParams[j++] = data.FILTERS.results[i];
						}
						else if(data.FILTERS.results[i].TYPE === "FI"){
							dimensions[k] = {};
							dimensions[k++] = data.FILTERS.results[i];
						}
					}
					if(inputParams.length > 0){
						var inputParamFormatted =  {};
						inputParamFormatted.inputParameters = [];
						inputParamFormatted.inputParameters = that.formObjectForFilters(inputParams);
						if(that.oModelForInputParameters.getData().inputParameters && that.oModelForInputParameters.getData().inputParameters.length) {
							for(var i=0;i<that.oModelForInputParameters.getData().inputParameters.length;i++){
								for(var j=0;j<inputParamFormatted.inputParameters.length;j++){
									if(that.oModelForInputParameters.getData().inputParameters[i].name === inputParamFormatted.inputParameters[j].name){
										that.oModelForInputParameters.getData().inputParameters[i].value_1 = inputParamFormatted.inputParameters[j].value_1;
										that.oModelForInputParameters.getData().inputParameters[i].value_2 = inputParamFormatted.inputParameters[j].value_2;
									}
								}
							}
							that.oModelForInputParameters.updateBindings();
						}	
					}
					if(dimensions.length > 0){
						var filtersFormatted = {};
						filtersFormatted.selectedDimensions = [];
						filtersFormatted.selectedDimensions = that.formObjectForFilters(dimensions);
						that.oModelForDimensions.getData().selectedDimensions = filtersFormatted.selectedDimensions;
						that.oModelForDimensions.updateBindings();
					}
				}

				if(data.PROPERTIES.results.length > 0){
					that.getView().getModel().setProperty("/PROPERTIES",data.PROPERTIES.results);
					that.getView().getModel().updateBindings();
				}

				that.getView().getModel().setProperty("/VALUES_SOURCE",data.VALUES_SOURCE);
				if(data.VALUES.results.length > 0){
					for(i=0;i<data.VALUES.results.length;i++){
						if(data.VALUES.results[i].FIXED){
							that.populateTargetAndTresholds(data.VALUES.results[i].TYPE,data.VALUES.results[i].FIXED);
						}
						else{
							that.populateTargetAndTresholds(data.VALUES.results[i].TYPE,data.VALUES.results[i].COLUMN_NAME);
						}
					} 
				}
				that.busyDialog.close();

			},function(err){
				that.busyDialog.close();
				sap.suite.smartbusiness.utils.showErrorMessage(that.oResourceBundle.getText("ERROR_EVALUATION_DOES_NOT_EXIST"));
			});

		},function(err){
			that.busyDialog.close();
			sap.suite.smartbusiness.utils.showErrorMessage(that.oResourceBundle.getText("ERROR_KPI_DOES_NOT_EXIST"));
		});

	},
	populateAdditionalMeasures : function(type,value){
		var that = this;
		var multiInput = that.getView().byId('targetThresholdPanel').getContent()[0].byId("additionalMeasures");
		multiInput.addToken(new sap.m.Token({text : value}));
		that.getView().byId('targetThresholdPanel').getContent()[0].byId("selectAdditionalMeasuresCheckBox").setSelected(true);
		that.getView().byId('targetThresholdPanel').getContent()[0].byId('additionalMeasures').setVisible(true);
	},
	populateTargetAndTresholds : function(type,value){
		var that = this;
		switch(type){
		case "CL" : that.getView().getModel().setProperty("/CRITICALLOW",value);break;
		case "WL" : that.getView().getModel().setProperty("/WARNINGLOW",value);break;
		case "TA" : that.getView().getModel().setProperty("/TARGET",value);break;
		case "CH" : that.getView().getModel().setProperty("/CRITICALHIGH",value);break;
		case "WH" : that.getView().getModel().setProperty("/WARNINGHIGH",value);break;
		case "TC" : that.getView().getModel().setProperty("/TREND",value);break;
		case "RE" : that.getView().getModel().setProperty("/REFERENCE_VALUE",value);break;
		default : that.populateAdditionalMeasures(type,value);
		}
	},
	formObjectForFilters : function(listOfFilters){
		var i = 0, j = 0, k = 0, temp = [], tempObj;
		for(i=0;i<listOfFilters.length;i++){
			if(listOfFilters[i].OPERATOR == "BT"){
				tempObj = {};
				tempObj = {"name":listOfFilters[i].NAME, "operator":listOfFilters[i].OPERATOR,  "value_1":listOfFilters[i].VALUE_1, "value_2":listOfFilters[i].VALUE_2}
				temp[j++] = tempObj; 
			}
			else{
				for(k=0;k<temp.length;k++){
					if((temp[k].name == listOfFilters[i].NAME) && (temp[k].operator == listOfFilters[i].OPERATOR)){
						break;
					}
				}
				if(k == temp.length){
					tempObj = {};
					tempObj = {"name":listOfFilters[i].NAME, "operator":listOfFilters[i].OPERATOR,  "value_1":listOfFilters[i].VALUE_1, "value_2":listOfFilters[i].VALUE_2}
					temp[j++] = tempObj;
				}
				else{
					temp[k].value_1+=","+listOfFilters[i].VALUE_1;
				}
			}
		}
		return temp;
	},

	getKpiDetails : function() {
		var that = this;
		if(!that.indicatorContext){
			that.busyDialog.close();
			that.indicatorContext = "INDICATORS_MODELER(ID='"+that.getView().getModel().getData().INDICATOR+"',IS_ACTIVE=1)"
		}
		that.oDataModel.read(that.indicatorContext, null, "$expand=TAGS,PROPERTIES", true, function(data) {
			that.getView().getModel().setProperty("/INDICATOR", data.ID);
			if(data.IS_ACTIVE == 0){
				sap.m.MessageToast.show(that.oResourceBundle.getText("ERROR_INACTIVE_KPI_CANNOT_HAVE_EVALUATION"));
				window.location.hash = "FioriApplication-SBWorkspace?sap-system=HANA&/detail/INDICATORS_MODELER(ID='"+that.getView().getModel().getData().INDICATOR+"',IS_ACTIVE=0)";
				return;
			}
			that.getView().byId("indicatorId").setValueState("None");

			that.getView().getModel().setProperty("/DESCRIPTION", data.DESCRIPTION);
			if(data.TAGS.results.length > 0){
				var tags = "";
				for(var i=0;i<data.TAGS.results.length;i++){
					tags+=data.TAGS.results[i].TAG+",";
				}
				tags = tags.substring(0,tags.length-1);
				that.getView().getModel().setProperty("/TAG",tags);
			}
			that.getView().getModel().setProperty("/OWNER_NAME", data.OWNER_NAME);
			that.getView().getModel().setProperty("/OWNER_ID", data.OWNER_ID);
			that.getView().getModel().setProperty("/OWNER_E_MAIL", data.OWNER_E_MAIL);
			if(data.PROPERTIES.results.length > 0){
				that.getView().getModel().setProperty("/PROPERTIES",data.PROPERTIES.results);
				that.getView().getModel().updateBindings();
			}
			if(data.DATA_SPECIFICATION != ""){
				that.getView().getModel().setProperty("/DATA_SPECIFICATION",data.DATA_SPECIFICATION);
				that.byId("additionalInfo").setVisible(true);
			}
			else{
				that.byId("additionalInfo").setVisible(false);
			}
			that.getView().getModel().setProperty("/DATA_SPECIFICATION", data.DATA_SPECIFICATION);
			that.getView().getModel().setProperty("/SEMANTIC_OBJECT", data.SEMANTIC_OBJECT);
			that.getView().getModel().setProperty("/ACTION", data.ACTION);
			that.getView().getModel().setProperty("/INDICATOR_TYPE", data.TYPE);
			that.getView().getModel().setProperty("/VIEW_NAME", data.VIEW_NAME);
			that.getView().getModel().setProperty("/ODATA_URL", data.ODATA_URL);
			that.createTargetThresholdLayout();
			if (data.ODATA_ENTITYSET) {
				that.getView().getModel().setProperty("/ODATA_ENTITYSET", data.ODATA_ENTITYSET);
				that.resetDimensionsAndInputParameters();
				try{
					that.populateDimensionsAndInputParameters(that.getView().getModel().getProperty("/ODATA_URL"), that.getView().getModel().getProperty("/ODATA_ENTITYSET"));
					that.oModelForMeasure = that.populateMeasure(that.getView().getModel().getProperty("/ODATA_URL"), that.getView().getModel().getProperty("/ODATA_ENTITYSET"));
				}
				catch(e) {
					sap.suite.smartbusiness.utils.showErrorMessage(that.oResourceBundle.getText("ERROR_WRONG_ENTITY_SET"), that.oResourceBundle.getText("ERROR_ODATA_ANALYTICS"));
					that.resetDimensionsAndInputParameters();
				}

			}
			that.getView().getModel().setProperty("/COLUMN_NAME", data.COLUMN_NAME);
			that.getView().getModel().setProperty("/GOAL_TYPE", data.GOAL_TYPE);
			that.busyDialog.close();

		}, function(err) {
			that.busyDialog.close(); 
			that.getView().byId("indicatorId").setValueState("Error");
			sap.suite.smartbusiness.utils.showErrorMessage(that.oResourceBundle.getText("ERROR_KPI_DOES_NOT_EXIST"));
		});
	},
	getEvalParamPayload : function(formData) {
		var evalPayload = {};
		evalPayload.ID = formData.ID;
		evalPayload.DESCRIPTION = formData.DESCRIPTION;
		evalPayload.INDICATOR = formData.INDICATOR;
		evalPayload.ODATA_URL = formData.ODATA_URL;
		evalPayload.VIEW_NAME = formData.VIEW_NAME;
		evalPayload.COLUMN_NAME = formData.COLUMN_NAME;
		evalPayload.OWNER_NAME = formData.OWNER_NAME;
		evalPayload.OWNER_E_MAIL = formData.OWNER_E_MAIL;
		evalPayload.OWNER_ID = formData.OWNER_ID;
		evalPayload.CREATED_BY = "";
		evalPayload.CHANGED_BY = "";
		evalPayload.IS_ACTIVE = formData.IS_ACTIVE;
		evalPayload.SCALING = parseInt(formData.SCALING)||0;
		evalPayload.TITLE = formData.TITLE;
		evalPayload.ENTITY_TYPE = "";
		evalPayload.ODATA_ENTITYSET = formData.ODATA_ENTITYSET;
		evalPayload.ODATA_PROPERTY = "";
		evalPayload.SEMANTIC_OBJECT = formData.SEMANTIC_OBJECT;
		evalPayload.ACTION = formData.ACTION;
		evalPayload.DATA_SPECIFICATION = formData.DATA_SPECIFICATION;
		evalPayload.GOAL_TYPE = formData.GOAL_TYPE;
		evalPayload.INDICATOR_TYPE = formData.INDICATOR_TYPE;
		evalPayload.VALUES_SOURCE = formData.VALUES_SOURCE;
		return evalPayload;
	},
	setFilterPayload : function(id, type, name, operator, value1, value2) {
		var obj = {};
		obj.ID = id;
		obj.IS_ACTIVE = this.getView().getModel().getData().IS_ACTIVE;
		obj.TYPE = type;
		obj.NAME = name;
		obj.OPERATOR = operator;
		obj.VALUE_1 = value1;
		if (value2)
			obj.VALUE_2 = value2;
		else
			obj.VALUE_2 = "";
		return obj;

	},
	getInputParamPayload : function(form) {
		var evalInputParams = {}, j = 0;
		var formData = form.getModel().getData();
		if (form.getController().oModelForInputParameters) {
			evalInputParams = form.getController().oModelForInputParameters.getData();
			if (evalInputParams.inputParameters) {
				if (evalInputParams.inputParameters.length > 0) {
					var i = 0, filterValue = [], filterValue1;
					while (i < evalInputParams.inputParameters.length) {
						if (evalInputParams.inputParameters[i].operator === "BT") {
							if ((evalInputParams[i].value_1 !== "") || (evalInputParams[i].value_2 !== "")) {
								filterValue = evalInputParams.inputParameters[i].value_1.split(",");
								filterValue1 = evalInputParams.inputParameters[i].value_2.split(",");
								if ((filterValue1.length === 1) && (!filterValue.length === 1)) {

									evalInputParams.inputParameters[i].value_1 = (evalInputParams.inputParameters[i].propertyType == "Edm.DateTime")
									? new Date(evalInputParams.inputParameters[i].value_1).toJSON() : evalInputParams.inputParameters[i].value_1;
									evalInputParams.inputParameters[i].value_2 = (evalInputParams.inputParameters[i].propertyType == "Edm.DateTime")
									? new Date(evalInputParams.inputParameters[i].value_2).toJSON() : evalInputParams.inputParameters[i].value_2;
									this.evalFiltersPayload[j] = {};
									this.evalFiltersPayload[j] = this.setFilterPayload(formData.ID, "PA",
											evalInputParams.inputParameters[i].name, evalInputParams.inputParameters[i].operator,
											evalInputParams.inputParameters[i].value_1, evalInputParams.inputParameters[i].value_2);
									j++;
								}
							}
						} else {
							filterValue = evalInputParams.inputParameters[i].value_1.split(",");
							if (filterValue.length > 0) {
								for ( var k = 0; k < filterValue.length; k++) {
									if (filterValue[k] !== "") {

										filterValue[k] = (evalInputParams.inputParameters[i].propertyType == "Edm.DateTime")
										? new Date(filterValue[k]).toJSON() : filterValue[k];
										this.evalFiltersPayload[j] = {};
										this.evalFiltersPayload[j] = this.setFilterPayload(formData.ID, "PA",
												evalInputParams.inputParameters[i].name, evalInputParams.inputParameters[i].operator,
												filterValue[k]);
										j++;
									}
								}
							}
						}
						i++;
					}
				}
			}

		}
	},
	getFiltersPayload : function(form) {
		var formData = form.getModel().getData();
		var evalDimensionFilters = {}, j = this.evalFiltersPayload.length;
		if (form.getController().oModelForDimensions) {
			evalDimensionFilters = form.getController().oModelForDimensions.getData();
			if (evalDimensionFilters.selectedDimensions) {
				if (evalDimensionFilters.selectedDimensions.length > 0) {
					var i = 0, filterValue = [], filterValue1;
					while (i < evalDimensionFilters.selectedDimensions.length) 
					{
						if (evalDimensionFilters.selectedDimensions[i].operator === "BT") 
						{
							if ((evalDimensionFilters.selectedDimensions[i].value_1 !== "")
									&& (evalDimensionFilters.selectedDimensions[i].value_2 !== ""))
							{
								filterValue = evalDimensionFilters.selectedDimensions[i].value_1.split(",");
								filterValue1 = evalDimensionFilters.selectedDimensions[i].value_2.split(",");
								if ((filterValue1.length === 1) || (!filterValue.length === 1))
								{
									evalDimensionFilters.selectedDimensions[i].value_1 = (evalDimensionFilters.selectedDimensions[i].propertyType == "Edm.DateTime")
									? new Date(evalDimensionFilters.selectedDimensions[i].value_1).toJSON() : evalDimensionFilters.selectedDimensions[i].value_1;
									evalDimensionFilters.selectedDimensions[i].value_2 = (evalDimensionFilters.selectedDimensions[i].propertyType == "Edm.DateTime")
									? new Date(evalDimensionFilters.selectedDimensions[i].value_2).toJSON() : evalDimensionFilters.selectedDimensions[i].value_2;
									this.evalFiltersPayload[j] = {};
									this.evalFiltersPayload[j] = this.setFilterPayload(formData.ID, "FI",
											evalDimensionFilters.selectedDimensions[i].name,
											evalDimensionFilters.selectedDimensions[i].operator,
											evalDimensionFilters.selectedDimensions[i].value_1,
											evalDimensionFilters.selectedDimensions[i].value_2);

									j++;
								}
							}
						} else {
							filterValue = evalDimensionFilters.selectedDimensions[i].value_1.split(",");
							if (filterValue.length > 0) 
							{
								for (var k = 0; k < filterValue.length; k++)
								{
									if (filterValue[k] != "")
									{      
										filterValue[k] = (evalDimensionFilters.selectedDimensions[i].propertyType == "Edm.DateTime")
										? new Date(filterValue[k]).toJSON() : filterValue[k];
										this.evalFiltersPayload[j] = {};
										this.evalFiltersPayload[j] = this.setFilterPayload(formData.ID, "FI",
												evalDimensionFilters.selectedDimensions[i].name,
												evalDimensionFilters.selectedDimensions[i].operator, 
												filterValue[k]);
										j++;
									}

								}
							}
						}
						i++;
					}
				}
			}
		}
	},

	getThresholdValue : function(id, type, state, value) {
		var obj = {};
		obj.ID = id;
		obj.TYPE = type;
		obj.IS_ACTIVE = state;

		var form = this.getView();
		var formData = form.getModel().getData();
		var valueType = formData.VALUES_SOURCE;
		if (valueType === "MEASURE") {
			obj.COLUMN_NAME = value;
		}
		if (valueType === "FIXED") {
			obj.FIXED = value;
		}
		obj.ODATA_PROPERTY = "";
		return obj;
	},
	getRangePayload : function(form) {
		var formData = form.getModel().getData();
		var i = 0;
		if (formData.CRITICALHIGH && formData.CRITICALHIGH !== "") {
			this.valuesPayload[i] = this.getThresholdValue(formData.ID, "CH", formData.IS_ACTIVE, formData.CRITICALHIGH);
			i++;
		}
		if (formData.WARNINGHIGH && formData.WARNINGHIGH !== "") {
			this.valuesPayload[i] = this.getThresholdValue(formData.ID, "WH", formData.IS_ACTIVE, formData.WARNINGHIGH);
			i++;
		}
		if (formData.TARGET && formData.TARGET !== "") {
			this.valuesPayload[i] = this
			.getThresholdValue(formData.ID, "TA", formData.IS_ACTIVE,formData.TARGET);
			i++;
		}
		if (formData.CRITICALLOW && formData.CRITICALLOW !== "") {
			this.valuesPayload[i] = this.getThresholdValue(formData.ID, "CL", formData.IS_ACTIVE,formData.CRITICALLOW);
			i++;
		}
		if (formData.WARNINGLOW && formData.WARNINGLOW !== "") {
			this.valuesPayload[i] = this.getThresholdValue(formData.ID, "WL", formData.IS_ACTIVE,formData.WARNINGLOW);
			i++;
		}
	},
	getMaximizingPayload : function(form) {
		var formData = form.getModel().getData();
		var i = this.valuesPayload.length;

		if (formData.TARGET && formData.TARGET !== "") {
			this.valuesPayload[i] = this
			.getThresholdValue(formData.ID, "TA", formData.IS_ACTIVE, formData.TARGET);
			i++;
		}
		if (formData.CRITICALLOW && formData.CRITICALLOW !== "") {
			this.valuesPayload[i] = this.getThresholdValue(formData.ID, "CL", formData.IS_ACTIVE,formData.CRITICALLOW);
			i++;
		}
		if (formData.WARNINGLOW && formData.WARNINGLOW !== "") {
			this.valuesPayload[i] = this.getThresholdValue(formData.ID, "WL", formData.IS_ACTIVE,formData.WARNINGLOW);
			i++;
		}
	},
	getMinimizingPayload : function(form) {
		var formData = form.getModel().getData();
		var i = this.valuesPayload.length;

		if (formData.CRITICALHIGH && formData.CRITICALHIGH !== "") {
			this.valuesPayload[i] = this.getThresholdValue(formData.ID, "CH", formData.IS_ACTIVE,formData.CRITICALHIGH);
			i++;
		}
		if (formData.WARNINGHIGH && formData.WARNINGHIGH !== "") {
			this.valuesPayload[i] = this.getThresholdValue(formData.ID, "WH", formData.IS_ACTIVE,formData.WARNINGHIGH);
			i++;
		}
		if (formData.TARGET && formData.TARGET !== "") {
			this.valuesPayload[i] = this
			.getThresholdValue(formData.ID, "TA", formData.IS_ACTIVE, formData.TARGET);
			i++;
		}

	},
	saveFilters : function(form) {
		this.evalFiltersPayload = [];
		this.getInputParamPayload(form);
		this.getFiltersPayload(form);
	},
	saveValues : function(form) {
		var that = this;
		this.valuesPayload = [];
		var formData = form.getModel().getData();
		switch (formData.GOAL_TYPE) {
		case "RA" :
			that.getRangePayload(form);
			break;
		case "MA" :
			that.getMaximizingPayload(form);
			break;
		case "MI" :
			that.getMinimizingPayload(form);
			break;
		}
		if (formData.TREND && formData.TREND !== "") {
			var i = this.valuesPayload.length;
			this.valuesPayload[i] = this.getThresholdValue(formData.ID, "TC", formData.IS_ACTIVE, formData.TREND);
			i++;
		}
		if (formData.REFERENCE_VALUE && formData.REFERENCE_VALUE !== "") {
			var i = this.valuesPayload.length;
			this.valuesPayload[i] = this.getThresholdValue(formData.ID, "RE", formData.IS_ACTIVE, formData.REFERENCE_VALUE);
			i++;
		}
		if(that.getView().byId('targetThresholdPanel').getContent()[0].byId("additionalMeasures").getTokens().length){
			var tokens = that.getView().byId('targetThresholdPanel').getContent()[0].byId("additionalMeasures").getTokens();
			for(var i=0,j=this.valuesPayload.length;i<tokens.length;i++){
				var type = "0";
				if (i.toString().length === 1) { 
					type = "0"+i; 
				}
				else{
					type = i.toString();
				}
				this.valuesPayload[j++] = {
						ID:formData.ID,
						IS_ACTIVE:formData.IS_ACTIVE,
						TYPE:type,
						COLUMN_NAME:tokens[i].getText(),
						ODATA_PROPERTY:""
					}
			}
		}
	},
	saveTags : function(form) {
		var formData = form.getModel().getData();
		this.tagsPayload = [];
		if (formData.TAG) {
			var tags = [];

			tags = formData.TAG.split(",");
			for ( var i = 0; i < tags.length; i++) {
				this.tagsPayload[i] = {};
				this.tagsPayload[i].ID = formData.ID;
				this.tagsPayload[i].IS_ACTIVE = formData.IS_ACTIVE;
				this.tagsPayload[i].TYPE = "EV";
				this.tagsPayload[i].TAG = tags[i];
			}
		}

	},
	saveProperties : function(form) {
		var formData = form.getModel().getData();
		this.propPayload = [];
		if (formData.PROPERTIES) {
			for ( var i = 0; i < formData.PROPERTIES.length; i++) {
				this.propPayload[i] = {};
				this.propPayload[i].ID = formData.ID;
				this.propPayload[i].IS_ACTIVE = formData.IS_ACTIVE;
				this.propPayload[i].TYPE = "EV";
				this.propPayload[i].NAME = formData.PROPERTIES[i].NAME;
				this.propPayload[i].VALUE = formData.PROPERTIES[i].VALUE;
			}

		}
	},
	saveAdditionalLanguages : function(form){
		var that = this;
		var formData = form.getModel().getData();
		this.languagesPayload = [];
		if(formData.NO_OF_ADDITIONAL_LANGUAGES > 0){
			var i=0,j=0,k=0,temp;
			that.oDataModel.read("/LANGUAGE",null,null,false,function(data){
				while(i<formData.ADDITIONAL_LANGUAGE_ARRAY.length){
					temp = formData.ADDITIONAL_LANGUAGE_ARRAY[i].LANGUAGE_KEY;
					for(j=0;j<data.results.length;j++){
						if(data.results[j].LAISO === temp){
							formData.ADDITIONAL_LANGUAGE_ARRAY[i].LANGUAGE = data.results[j].SPRAS;
							formData.ADDITIONAL_LANGUAGE_ARRAY[i].LANGUAGE_KEY = data.results[j].LAISO;
							break;
						}
					}
					i++;
				}
			});
			for(i=0;i<formData.ADDITIONAL_LANGUAGE_ARRAY.length;i++){
				this.languagesPayload[i] = {};
				this.languagesPayload[i].ID = formData.ID;
				this.languagesPayload[i].IS_ACTIVE = formData.IS_ACTIVE;
				this.languagesPayload[i].LANGUAGE = formData.ADDITIONAL_LANGUAGE_ARRAY[i].LANGUAGE;
				this.languagesPayload[i].LANGUAGE_KEY = formData.ADDITIONAL_LANGUAGE_ARRAY[i].LANGUAGE_KEY;
				this.languagesPayload[i].TITLE = formData.ADDITIONAL_LANGUAGE_ARRAY[i].TITLE;
				this.languagesPayload[i].DESCRIPTION = formData.ADDITIONAL_LANGUAGE_ARRAY[i].DESCRIPTION;
			}
		}
	},
	createBatchForEvalCreateMode : function(oEvent){
		var that = this;
		that.evalPayload = {};
		that.evalPayload.ID = that.evalParamPayload.ID;
		that.evalPayload.IS_ACTIVE = that.evalParamPayload.IS_ACTIVE;
		that.evalPayload.EVALUATION = that.evalParamPayload;
		delete that.evalPayload.EVALUATION.ID;
		delete that.evalPayload.EVALUATION.IS_ACTIVE;
		
		that.evalPayload.FILTERS = [];
		that.evalPayload.FILTERS = that.evalFiltersPayload;
		for(var i=0;i<that.evalPayload.FILTERS.length;i++){
			delete that.evalPayload.FILTERS[i].ID;
			delete that.evalPayload.FILTERS[i].IS_ACTIVE;
		}
		that.evalPayload.VALUES = [];
		that.evalPayload.VALUES = that.valuesPayload;
		for(var i=0;i<that.evalPayload.VALUES.length;i++){
			delete that.evalPayload.VALUES[i].ID;
			delete that.evalPayload.VALUES[i].IS_ACTIVE;
		}
		that.evalPayload.TAGS = [];
		that.evalPayload.TAGS = that.tagsPayload;
		for(var i=0;i<that.evalPayload.TAGS.length;i++){
			delete that.evalPayload.TAGS[i].ID;
			delete that.evalPayload.TAGS[i].IS_ACTIVE;
		}
		that.evalPayload.PROPERTIES = [];
		that.evalPayload.PROPERTIES = that.propPayload;
		for(var i=0;i<that.evalPayload.PROPERTIES.length;i++){
			delete that.evalPayload.PROPERTIES[i].ID;
			delete that.evalPayload.PROPERTIES[i].IS_ACTIVE;
		}
		
		
		that.evalPayload.TEXTS = [];
		that.evalPayload.TEXTS = that.languagesPayload;
		for(var i=0;i<that.evalPayload.TEXTS.length;i++){
			delete that.evalPayload.TEXTS[i].ID;
			delete that.evalPayload.TEXTS[i].IS_ACTIVE;
			delete that.evalPayload.TEXTS[i].LANGUAGE_KEY;
		}
		var url = sap.suite.smartbusiness.utils.serviceUrl("EVALUATION_SERVICE_URI");
		
		
		sap.suite.smartbusiness.utils.create(url,that.evalPayload,null,function(data){
			that.saveSuccessHandling(oEvent);
		},function(error){
			that.saveErrorHandling(error);
		});
	},
	
	createBatchPayload:function(oEvent){
		var that = this,i = 0;
		var path, updateRequired = false;
		var updatePayload = {};
		var batch = {};
		var formData = that.getView().getModel().getData();
		updatePayload.ID = formData.ID;
		updatePayload.IS_ACTIVE = formData.IS_ACTIVE;
		//checking for changes in evaluation parameters
		batch.oldPayload = that.getEvalParamPayload(that.evalDetails);
		batch.newPayload = that.evalParamPayload;
		batch.objectType = "Evaluations";
		batch = sap.suite.smartbusiness.utils.dirtyBitCheck(batch);
		if(batch.updates.length > 0){
			updatePayload.EVALUATION = {};
			updatePayload.EVALUATION.update = {}
			updatePayload.EVALUATION.update = that.evalParamPayload;
			delete updatePayload.EVALUATION.update.ID;
			delete updatePayload.EVALUATION.update.IS_ACTIVE;
			updateRequired = true;
		}

		//for changes in evaluation filters
		batch.oldPayload = that.evalDetails.FILTERS.results;
		batch.newPayload = that.evalFiltersPayload;
		batch.objectType = "EVALUATION_FILTERS";
		batch = sap.suite.smartbusiness.utils.dirtyBitCheck(batch);
		updatePayload.FILTERS = {};
		if(batch.deletes.length > 0){
			for(i=0;i<batch.deletes.length;i++){
				delete batch.deletes[i].ID;
				delete batch.deletes[i].IS_ACTIVE;
			}
			updatePayload.FILTERS.remove = batch.deletes;
			updateRequired = true;
		}
		if(batch.updates.length > 0){
			for(var i=0;i<batch.updates.length;i++){
				delete batch.updates[i].ID;
				delete batch.updates[i].IS_ACTIVE;
			}
			updatePayload.FILTERS.create = batch.updates;
			updateRequired = true;
		}

		//for changes in evaluation values
		for(i=0;i<that.evalDetails.VALUES.results.length;i++){
			if(that.evalDetails.VALUES.results[i].COLUMN_NAME){
				delete that.evalDetails.VALUES.results[i].FIXED;
			}
			else{
				delete that.evalDetails.VALUES.results[i].COLUMN_NAME;
			}
		}
		batch.oldPayload = that.evalDetails.VALUES.results;
		batch.newPayload = that.valuesPayload;
		batch.objectType = "EVALUATION_VALUES";
		batch = sap.suite.smartbusiness.utils.dirtyBitCheck(batch);
		updatePayload.VALUES = {};
		if(batch.deletes.length > 0){
			for(var i=0;i<batch.deletes;i++){
				delete batch.deletes[i].ID;
				delete batch.deletes[i].IS_ACTIVE;
			}
			updatePayload.VALUES.remove = batch.deletes;
			updateRequired = true;
		}
		if(batch.updates.length > 0){
			for(var i=0;i<batch.updates.length;i++){
				delete batch.updates[i].ID;
				delete batch.updates[i].IS_ACTIVE;
			}
			updatePayload.VALUES.create = batch.updates;
			updateRequired = true;
		}

		//for changes in evaluation tags
		batch.oldPayload = that.evalDetails.TAGS.results;
		batch.newPayload = that.tagsPayload;
		batch.objectType = "TAGS";
		batch = sap.suite.smartbusiness.utils.dirtyBitCheck(batch);
		updatePayload.TAGS = {};
		if(batch.deletes.length > 0){
			for(i=0;i<batch.deletes.length;i++){
				delete batch.deletes[i].ID;
				delete batch.deletes[i].IS_ACTIVE;
			}
			updatePayload.TAGS.remove = batch.deletes;
			updateRequired = true;
		}
		if(batch.updates.length > 0){
			for(var i=0;i<batch.updates.length;i++){
				delete batch.updates[i].ID;
				delete batch.updates[i].IS_ACTIVE;
			}
			updatePayload.TAGS.create = batch.updates;
			updateRequired = true;
		}


		//for changes in evaluation properties
		batch.oldPayload = that.evalDetails.PROPERTIES.results;
		batch.newPayload = that.propPayload
		batch.objectType = "PROPERTIES";
		batch = sap.suite.smartbusiness.utils.dirtyBitCheck(batch);
		updatePayload.PROPERTIES = {};
		if(batch.deletes.length > 0){
			for(i=0;i<batch.deletes.length;i++){
				delete batch.deletes[i].ID;
				delete batch.deletes[i].IS_ACTIVE;
			}
			updatePayload.PROPERTIES.remove = batch.deletes;
			updateRequired = true;
		}
		if(batch.updates.length > 0){
			for(var i=0;i<batch.updates.length;i++){
				delete batch.updates[i].ID;
				delete batch.updates[i].IS_ACTIVE;
			}
			updatePayload.PROPERTIES.create = batch.updates;
			updateRequired = true;
		}

		//for changes in additional languages
		batch.oldPayload = that.evalDetails.ADDITIONAL_LANGUAGE_ARRAY;
		batch.newPayload = that.languagesPayload
		batch.objectType = "EVALUATION_TEXTS";
		batch = sap.suite.smartbusiness.utils.dirtyBitCheck(batch);
		updatePayload.TEXTS = {}
		if(batch.deletes.length > 0){
			for(i=0;i<batch.deletes.length;i++){
				delete batch.deletes[i].ID;
				delete batch.deletes[i].IS_ACTIVE;
			}
			updatePayload.TEXTS.remove = batch.deletes;
			updateRequired = true;
		}
		if(batch.updates.length > 0){
			for(var i=0;i<batch.updates.length;i++){
				delete batch.updates[i].ID;
				delete batch.updates[i].IS_ACTIVE;
			}
			updatePayload.TEXTS.create = batch.updates;
			updateRequired = true;
		}
		if(!updateRequired){
			that.busyDialog.close();   
			that.saveSuccessHandling(oEvent);
			return;
		}
		else{
			var url = sap.suite.smartbusiness.utils.serviceUrl("EVALUATION_SERVICE_URI");
			sap.suite.smartbusiness.utils.update(url,updatePayload,null,function(data){
				that.saveSuccessHandling(oEvent);
			},function(error){
				that.saveErrorHandling(error);
			});
		}
	},
	saveErrorHandling : function(error){
		var that = this;
		sap.suite.smartbusiness.utils.showErrorMessage(that.oResourceBundle.getText("ERROR_EVAL_SAVE"));
		that.busyDialog.close();
	},
	saveSuccessHandling : function(oEvent){
		var that = this;
		sap.m.MessageToast.show(that.oResourceBundle.getText("SUCCESS_EVAL_SAVE"));
		if(oEvent === "activate" || oEvent === "saveActivate"){
			var obj = {};
			obj.ID = that.getView().getModel().getData().ID;
			var url = sap.suite.smartbusiness.utils.serviceUrl("ACTIVATE_EVALUATION_SERVICE_URI");
			sap.suite.smartbusiness.utils.create(url,obj,null,function(data){
				that.busyDialog.close();
				sap.m.MessageToast.show(that.oResourceBundle.getText("SUCCESS_EVAL_ACTIVATE"));
				if(oEvent === "activate")
					window.location.hash = "FioriApplication-configureSBKPITile?sap-system=HANA&/detail/EVALUATIONS_CHIP(ID='"+that.getView().getModel().getData().ID+"',IS_ACTIVE=1)";
				else if(oEvent === "saveActivate" && !that.fromHome)
					window.location.hash = "FioriApplication-SBWorkspace?sap-system=HANA&/evalDetail/INDICATORS_MODELER(ID='"+that.getView().getModel().getData().INDICATOR+"',IS_ACTIVE=1)/EVALUATIONS_MODELER(ID='"+that.getView().getModel().getData().ID+"',IS_ACTIVE=1)";
				else if(that.fromHome){
					window.location.hash = "";
				}
			},function(error){
				that.busyDialog.close(); 
				sap.suite.smartbusiness.utils.showErrorMessage(that.oResourceBundle.getText("ERROR_ACTIVATING_EVALUATION"));
			});
		}
		else if(oEvent == "create"){
			that.busyDialog.close(); 
			if(that.fromHome){
				window.location.hash = "";
			}
			else{
				if(this.editDraft){
					window.location.hash = "FioriApplication-SBWorkspace?sap-system=HANA&/evalDetail/INDICATORS_MODELER(ID='"+that.getView().getModel().getData().INDICATOR+"',IS_ACTIVE=1)/EVALUATIONS_MODELER(ID='"+that.getView().getModel().getData().ID+"',IS_ACTIVE=1)";
				}
				else
				if(that.duplicateEval){
					window.location.hash = "FioriApplication-SBWorkspace?sap-system=HANA&/evalDetail/INDICATORS_MODELER(ID='"+that.getView().getModel().getData().INDICATOR+"',IS_ACTIVE=1)/EVALUATIONS_MODELER(ID='"+that.getView().getModel().getData().ID+"',IS_ACTIVE=0)";
				}
				else
				if(that.evalDetails){
					var isActive = that.evalDetails.IS_ACTIVE;
					window.location.hash = "FioriApplication-SBWorkspace?sap-system=HANA&/evalDetail/INDICATORS_MODELER(ID='"+that.getView().getModel().getData().INDICATOR+"',IS_ACTIVE=1)/EVALUATIONS_MODELER(ID='"+that.getView().getModel().getData().ID+"',IS_ACTIVE="+isActive+")";
				}
				else{
					window.location.hash = "FioriApplication-SBWorkspace?sap-system=HANA&/evalDetail/INDICATORS_MODELER(ID='"+that.getView().getModel().getData().INDICATOR+"',IS_ACTIVE=1)/EVALUATIONS_MODELER(ID='"+that.getView().getModel().getData().ID+"',IS_ACTIVE=0)";
				}
			}
		}
		else if(oEvent == "createNew"){
			that.busyDialog.close(); 
			that.byId("evalId").setEditable(true);
			that.getView().getModel().setData({});
			that.getView().getModel().setProperty("/NO_OF_ADDITIONAL_LANGUAGES",0);
			that.getKpiDetails();
			window.location.hash = "FioriApplication-createSBKPIEvaluation&/addEvaluation/"+that.indicatorContext;
		}
		that.busyDialog.close();
	},
	saveAndExit : function(oEvent) {
		var that = this;
		that.createBatch = [];
		that.deleteBatch = [];
		var formData = that.getView().getModel().getData();
		if (!formData.INDICATOR) {
			that.byId("indicatorId").setValueState("Error");
			sap.suite.smartbusiness.utils.showErrorMessage(that.oResourceBundle.getText("ERROR_SELECT_KPI"));
			return;
		}
		if (that.byId("indicatorId").getValueState() === "Error") {
			sap.suite.smartbusiness.utils.showErrorMessage(that.oResourceBundle.getText("ERROR_KPI_DOES_NOT_EXIST"));
			return;
		}
		if (that.byId("evalOwnerEmail").getValueState() === "Error") {
			sap.suite.smartbusiness.utils.showErrorMessage(that.oResourceBundle.getText("ERROR_ENTER_VALID_EVAL_E_MAIL"));
			return;
		}
		if(formData.mode === "edit"){
			if (!formData.ID) {
				that.byId("evalId").setValueState("Error");
				sap.suite.smartbusiness.utils.showErrorMessage(that.oResourceBundle.getText("ERROR_ENTER_EVALUATION_ID"));
				return;
			}
			if (that.byId("evalId").getValueState() === "Error") {
				sap.suite.smartbusiness.utils.showErrorMessage(that.oResourceBundle.getText("ERROR_ENTER_VALID_EVAL_ID"));
				return;
			}
		}
		else{
			if(!that.validateEvalId()){
				if (!formData.ID) {
					that.byId("evalId").setValueState("Error");
					sap.suite.smartbusiness.utils.showErrorMessage(that.oResourceBundle.getText("ERROR_ENTER_EVALUATION_ID"));
					return;
				}
				if (that.byId("evalId").getValueState() === "Error") {
					sap.suite.smartbusiness.utils.showErrorMessage(that.oResourceBundle.getText("ERROR_ENTER_VALID_EVAL_ID"));
					return;
				}
			}
			else{
				return;
			}
		}
		if(formData.VALUES_SOURCE === "FIXED"){
			var validatedEvalValues = this.validateEvaluationValues(this.getView().getModel().getData());
			if(validatedEvalValues.length){

				var msg = this.oResourceBundle.getText("ERROR_ENTER_VALID_THRESHOLD_VALUES");
				var i;
				for(i=0;i<validatedEvalValues.length;i++){
					if(validatedEvalValues[i]==="CL"){
						if(this.getView().getModel().getData().GOAL_TYPE === "RA"){
							msg = msg+"\n"+this.oResourceBundle.getText("CRITICAL_LOW");
						}
						else{
							msg = msg+"\n"+this.oResourceBundle.getText("CRITICAL");
						}
					}
					if(validatedEvalValues[i]==="WL"){
						if(this.getView().getModel().getData().GOAL_TYPE === "RA"){
							msg = msg+"\n"+this.oResourceBundle.getText("WARNING_LOW");
						}
						else{
							msg = msg+"\n"+this.oResourceBundle.getText("WARNING");
						}
					}
					if(validatedEvalValues[i]==="TA"){
						msg = msg+"\n"+this.oResourceBundle.getText("TARGET");
					}
					if(validatedEvalValues[i]==="CH"){
						if(this.getView().getModel().getData().GOAL_TYPE === "RA"){
							msg = msg+"\n"+this.oResourceBundle.getText("CRITICAL_HIGH");
						}
						else{
							msg = msg+"\n"+this.oResourceBundle.getText("CRITICAL");
						}
					}
					if(validatedEvalValues[i]==="WH"){
						if(this.getView().getModel().getData().GOAL_TYPE === "RA"){
							msg = msg+"\n"+this.oResourceBundle.getText("WARNING_HIGH");
						}
						else{
							msg = msg+"\n"+this.oResourceBundle.getText("WARNING");
						}
					}
				}
				sap.suite.smartbusiness.utils.showErrorMessage(msg);
				return;
			}
		}

		if(!that.indicatorContext){
			that.indicatorContext = "INDICATORS_MODELER(ID='"+formData.INDICATOR+"',IS_ACTIVE=1)"
		}

		that.busyDialog.open();
		that.evalParamPayload = {};
		that.evalParamPayload = that.getEvalParamPayload(that.getView().getModel().getData());
		that.saveFilters(that.getView());
		that.saveValues(that.getView());
		that.saveTags(that.getView());
		that.saveProperties(that.getView());
		that.saveAdditionalLanguages(that.getView());
		if(!oEvent){
			oEvent = "create";
		}

		if(formData.mode === "create"){
			that.createBatch = that.createBatchForEvalCreateMode(oEvent);
		}
		else if(formData.mode === "edit"){
			if(that.evalDetails.IS_ACTIVE === 0 && formData.IS_ACTIVE === 0){
				that.createBatchPayload(oEvent);
			}
			else if(that.evalDetails.IS_ACTIVE === 1 && formData.IS_ACTIVE === 0){
				that.getView().getModel().setProperty("/mode","create");
				that.createBatch = that.createBatchForEvalCreateMode(oEvent); 
			}
		}

	},
	saveAndCreateNew : function(oEvent) {
		this.saveAndExit("createNew");
	},
	saveAndActivate : function(){
		var that = this;
		that.checkForActivation("saveActivate");
	},
	checkForActivation : function(param){
		var that = this;
		var formData = that.getView().getModel().getData();
		if (!formData.TITLE || formData.TITLE === "") {
			that.byId("evalTitle").setValueState("Error");
			sap.suite.smartbusiness.utils.showErrorMessage(that.oResourceBundle.getText("ERROR_ENTER_EVALUATION_TITLE"));
			return;
		}

		var error = that.validateDimensionsAndInputParameters();
		if (error.error) {
			if (error.errorType === "mandatoryFieldEmpty") {
				sap.suite.smartbusiness.utils.showErrorMessage(that.oResourceBundle.getText("ERROR_ENTER_ALL_INPUT_PARAMETERS"));
				return;
			}
			if (error.errorType === "fieldEmpty") {
				sap.suite.smartbusiness.utils.showErrorMessage(that.oResourceBundle.getText("ERROR_ENTER_ALL_DIMENSION_VALUES"));
				return;
			}
			if(error.errorType === "invalidEntry"){
				sap.suite.smartbusiness.utils.showErrorMessage(that.oResourceBundle.getText("ERROR_INVALID_TEXT_FOR",error.errorDimension.name));
				return;
			}
		}
		if(formData.ODATA_URL === ""){
			sap.suite.smartbusiness.utils.showErrorMessage(that.oResourceBundle.getText("ERROR_ENTER_ODATA_URL"));
			return;
		}
		if(formData.ODATA_ENTITYSET === ""){
			sap.suite.smartbusiness.utils.showErrorMessage(that.oResourceBundle.getText("ERROR_ENTER_ENTITY_SET"));
			return;
		}
		if(formData.COLUMN_NAME === ""){
			sap.suite.smartbusiness.utils.showErrorMessage(that.oResourceBundle.getText("ERROR_ENTER_MEASURE"));
			return;
		}
		
		if(that.getView().byId('targetThresholdPanel').getContent()[0].byId("additionalMeasures").getTokens().length) {
			var additionalMeasures = that.byId('targetThresholdPanel').getContent()[0].byId("additionalMeasures").getTokens();
			for(var i=0,l=additionalMeasures.length; i<l; i++) {
				if(additionalMeasures[i].getText() == formData.COLUMN_NAME) {
					that.byId('targetThresholdPanel').getContent()[0].byId("additionalMeasures").setValueState("Error");
					sap.suite.smartbusiness.utils.showErrorMessage(that.oResourceBundle.getText("ADDI_MEASURE_HAS_MAIN_MEASURE"));
					return;
				}
			}
		}
		
		if(!formData.TARGET  || formData.TARGET == ""){
			var backDialog = new sap.m.Dialog({
				icon:"sap-icon://warning2",
				title:that.oResourceBundle.getText("WARNING"),
				state:"Warning",
				type:"Message",
				content:[new sap.m.Text({text:that.oResourceBundle.getText("ERROR_TARGET_NOT_ENTERED")})],
				beginButton: new sap.m.Button({
					text:that.oResourceBundle.getText("CONTINUE"),
					press: function(){
						backDialog.close();
						that.saveAndExit(param);
					}
				}),
				endButton: new sap.m.Button({
					text:that.oResourceBundle.getText("CANCEL"),
					press:function(){
						backDialog.close();
					}
				})                                                
			});
			backDialog.open();
		}
		else{
			that.saveAndExit(param);
		}
	},
	activateAndAddTiles:function(){
		var that = this;
		that.checkForActivation("activate");
	},
	cancel : function() {
		this.navigateBack();
	},

	deleteDraft:function(){
		var that = this;
		var obj = {};
		obj.ID = that.getView().getModel().getData().ID;
		obj.IS_ACTIVE = that.getView().getModel().getData().IS_ACTIVE;
		
		var url = sap.suite.smartbusiness.utils.serviceUrl("EVALUATION_SERVICE_URI");
		
		sap.suite.smartbusiness.utils.remove(url,obj,function(data){
			sap.m.MessageToast.show(that.oResourceBundle.getText("SUCCESS_DELETING_DRAFT"));
			window.location.hash = "FioriApplication-SBWorkspace?sap-system=HANA&/detail/INDICATORS_MODELER(ID='"+that.getView().getModel().getData().INDICATOR+"',IS_ACTIVE=1)";
		},function(error){
			sap.suite.smartbusiness.utils.showErrorMessage(that.oResourceBundle.getText("ERROR_DELETING_DRAFT"));
		});
		
	},
	validateEvalId : function() {
		var that = this;
		var evalIdField = this.getView().byId('evalId');

		var is_active = 0;
		var evalId = evalIdField.getValue();
		if (evalId) {
			if (!(/^[a-zA-Z0-9.]*$/.test(evalId))) {
				sap.suite.smartbusiness.utils.showErrorMessage(that.oResourceBundle.getText("ERROR_ENTER_VALID_EVAL_ID"));
				evalIdField.setValueState("Error");
				return true;
			} else {
				evalIdField.setValueState("None");
				this.oDataModel.read("/EVALUATIONS", null,"$filter=ID eq '"+evalId+"'", true,
						function(data) {
					if(data.results.length > 0){
						if (data.results[0].ID) {
							evalIdField.setValueState("Error");
							sap.suite.smartbusiness.utils.showErrorMessage(that.oResourceBundle.getText("ERROR_EVAL_WITH_ID_EXISTS",evalId));
							return true;
						} else {
							evalIdField.setValueState("None");
						}
					}
					else{
						evalIdField.setValueState("None");
					}
				}, function() {
					evalIdField.setValueState("None");
				});
			}

		}
		return false;
	},

	validateEmailAddress : function() {
		var that = this;
		var evalOwnerEmailField = this.getView().byId('evalOwnerEmail');
		var evalOwnerEmailValue = evalOwnerEmailField.getValue();
		if (evalOwnerEmailValue) {
			if (!(/^\w+[\w-\.]*\@\w+((-\w+)|(\w*))\.[a-z]/.test(evalOwnerEmailValue))) {
				evalOwnerEmailField.setValueState("Error");
				sap.suite.smartbusiness.utils.showErrorMessage(that.oResourceBundle.getText("ERROR_ENTER_VALID_EVAL_E_MAIL"));
			} else {
				evalOwnerEmailField.setValueState("None");
			}
		} else {
			evalOwnerEmailField.setValueState("None");
		}
	},

	listAllKpis : function() {
		var that = this;
		var hanaViewValueHelpDialog = new sap.m.SelectDialog({
			title : that.oResourceBundle.getText("SELECT_KPI"),
			noDataText : that.oResourceBundle.getText("NO_DATA_FOUND"),
			items : {
				path : "/INDICATORS_MODELER",
				template : new sap.m.ObjectListItem({
					title : "{TITLE}",
					number : "{EVALUATION_COUNT}",
					firstStatus : new sap.m.ObjectStatus({
						text : "Evaluations",
					}),
					attributes : [new sap.m.ObjectAttribute({
						text : "{ID}"
					})]

				})
			},
			confirm : function(oEvent) {
				that.busyDialog.open(); 
				that.indicatorContext = "INDICATORS_MODELER(ID='"+oEvent.getParameter("selectedItem").getBindingContext().getProperty("ID")+"',IS_ACTIVE=1)"
				that.getKpiDetails();

			},
			liveChange : function(oEvent) {
				var searchValue = "'" + oEvent.getParameter("value").toLowerCase() + "'";
				var oFilterById = new sap.ui.model.Filter("tolower(ID)", sap.ui.model.FilterOperator.Contains,
						searchValue);
				var oFilterByTitle = new sap.ui.model.Filter("tolower(TITLE)", sap.ui.model.FilterOperator.Contains,
						searchValue);
				var oFilterISActive = new sap.ui.model.Filter("IS_ACTIVE", sap.ui.model.FilterOperator.EQ,1);
				var oBinding = oEvent.getSource().getBinding("items");
				var firstFilters = new sap.ui.model.Filter([oFilterById,oFilterByTitle], false);
				var secondFilters = new sap.ui.model.Filter([oFilterISActive], true);
				oBinding.filter(new sap.ui.model.Filter([firstFilters, secondFilters], true));
			}
		});
		hanaViewValueHelpDialog.setModel(that.oDataModel);
		var filters = [];
		filters.push(new sap.ui.model.Filter("IS_ACTIVE", sap.ui.model.FilterOperator.EQ, 1));
		hanaViewValueHelpDialog.getBinding("items").filter(new sap.ui.model.Filter(filters,true));
		hanaViewValueHelpDialog.open();
	},
	handleHanaViewValueHelp : function() {
		var that = this;
		var hanaViewValueHelpDialog = new sap.m.SelectDialog({
			title : that.oResourceBundle.getText("SELECT_VIEW"),
			noDataText : that.oResourceBundle.getText("NO_DATA_FOUND"),
			items : {
				path : "/HANA_VIEWS",
				template : new sap.m.StandardListItem({
					title : {
						parts : [{
							path : "OBJECT",
							type : new sap.ui.model.type.String()
						}, {
							path : "PACKAGE",
							type : new sap.ui.model.type.String()
						}, {
							path : "SUFFIX",
							type : new sap.ui.model.type.String()
						}],
						formatter : function(o, p, s) {
							if (s.indexOf("view") != -1)
								return p + "/" + o;
							else
								return p + "::" + o;
						}
					},
					description : "{SUFFIX}"
				})
			},
			confirm : function(oEvent) {
				that.getView().getModel().setProperty("/VIEW_NAME", oEvent.getParameter("selectedItem").getProperty("title"));
				that.getView().getModel().setProperty("/ODATA_URL","");
				that.getView().getModel().setProperty("/ODATA_ENTITYSET","");
				that.getView().getModel().setProperty("/COLUMN_NAME","");
				that.resetAdditionalMeasures();
				that.currentSelectedHanaViewObject = oEvent.getParameter("selectedItem").getBindingContext().getObject();
			},
			liveChange : function(oEvent) {
				var searchValue = "'" + oEvent.getParameter("value").toLowerCase() + "'";
				var oFilterPackage = new sap.ui.model.Filter("tolower(PACKAGE)", sap.ui.model.FilterOperator.Contains,
						searchValue);
				var oFilterObject = new sap.ui.model.Filter("tolower(OBJECT)", sap.ui.model.FilterOperator.Contains,
						searchValue);
				var oBinding = oEvent.getSource().getBinding("items");
				oBinding.filter(new sap.ui.model.Filter([oFilterPackage, oFilterObject], false));
			}

		});
		hanaViewValueHelpDialog.setModel(this.oDataModel);
		hanaViewValueHelpDialog.open();
	},
	hanaViewChange : function(value){
		var that = this;
		that.getView().getModel().setProperty("/ODATA_URL","");
		that.getView().getModel().setProperty("/ODATA_ENTITYSET","");
		that.getView().getModel().setProperty("/COLUMN_NAME","");
		that.resetAdditionalMeasures();
		that.resetDimensionsAndInputParameters();
	},
	handleOdataServiceValueHelp:function(){
		var that = this;
		if(!that.byId("viewInput").getValue()){
			sap.suite.smartbusiness.utils.showErrorMessage(that.oResourceBundle.getText("ERROR_ENTER_A_HANA_VIEW"));
		}
		else{
			var selectedHanaView = that.getView().getModel().getProperty("/VIEW_NAME");
			selectedHanaView = (selectedHanaView.indexOf("/") != -1 ? selectedHanaView.split("/") : selectedHanaView
					.split("::"));
			var hanaOdataServiceHelpDialog = new sap.m.SelectDialog({
				title : that.oResourceBundle.getText("SELECT_ODATA_SERVICE"),
				noDataText : that.oResourceBundle.getText("NO_DATA_FOUND"),
				items : {
					path : "/ODATA_FOR_ENTITY(P_PACKAGE='" + selectedHanaView[0] + "',P_OBJECT='" + selectedHanaView[1] + "')/Results",
					template : new sap.m.StandardListItem({
						title : {
							parts : [{
								path : "PACKAGE",
								type : new sap.ui.model.type.String()
							}, {
								path : "OBJECT",
								type : new sap.ui.model.type.String()
							}],
							formatter : function(o, p, s) {
								o = o.replace(/\./g, '/');
								return "/" + o + "/" + p + ".xsodata";
							}
						},
					})
				},
				confirm : function(oEvent) {
					that.getView().getModel().setProperty("/ODATA_URL", oEvent.getParameter("selectedItem").getProperty("title"));
					that.getView().getModel().setProperty("/ODATA_ENTITYSET","");
					that.getView().getModel().setProperty("/COLUMN_NAME","");
					that.resetAdditionalMeasures();
					that.currentSelectedODataUrlObject = oEvent.getParameter("selectedItem").getBindingContext().getObject();
				},
				liveChange : function(oEvent) {
					var searchValue = "'" + oEvent.getParameter("value").toLowerCase() + "'";
					var oFilterPackage = new sap.ui.model.Filter("tolower(PACKAGE)", sap.ui.model.FilterOperator.Contains,
							searchValue);
					var oFilterObject = new sap.ui.model.Filter("tolower(OBJECT)", sap.ui.model.FilterOperator.Contains,
							searchValue);
					var oBinding = oEvent.getSource().getBinding("items");
					oBinding.filter(new sap.ui.model.Filter([oFilterPackage, oFilterObject], false));
				}

			});
			hanaOdataServiceHelpDialog.setModel(that.oDataModel);
			hanaOdataServiceHelpDialog.open();
		}

	},
	oDataUrlChange : function(value){
		var that = this;
		that.getView().getModel().setProperty("/ODATA_ENTITYSET","");
		that.getView().getModel().setProperty("/COLUMN_NAME","");
		that.resetAdditionalMeasures();
		that.resetDimensionsAndInputParameters();
	},
	handleEntitySetValueHelp : function(){
		var that = this;
		if(!that.byId("odataServiceInput").getValue()){
			sap.suite.smartbusiness.utils.showErrorMessage(that.oResourceBundle.getText("ERROR_ENTER_ODATA_URL"));
		}
		else{
			var that = this;
			that.oModelForEntity;
			var hanaEntitySetHelpDialog = new sap.m.SelectDialog({
				title : that.oResourceBundle.getText("SELECT_ENTITY_SET"),
				noDataText : that.oResourceBundle.getText("NO_DATA_FOUND"),
				items : {
					path : "/entitySet",
					template : new sap.m.StandardListItem({
						title : {
							parts : [{
								path : "entityName",
								type : new sap.ui.model.type.String()
							}],
							formatter : function(o,s) {
								return o;
							}
						},
					})
				},
				confirm : function(oEvent) {
					that.getView().getModel().setProperty("/ODATA_ENTITYSET", oEvent.getParameter("selectedItem").getProperty("title"));
					that.resetDimensionsAndInputParameters();
					that.resetAdditionalMeasures();
					try {
						that.populateDimensionsAndInputParameters(that.getView().getModel().getProperty("/ODATA_URL"), that.getView().getModel().getProperty("/ODATA_ENTITYSET"));
					}
					catch(e) {
						sap.suite.smartbusiness.utils.showErrorMessage(that.oResourceBundle.getText("ERROR_WRONG_ENTITY_SET"), that.oResourceBundle.getText("ERROR_ODATA_ANALYTICS"));
						that.resetDimensionsAndInputParameters();
					}

				},
				liveChange : function(oEvent) {
					var searchValue = "'" + oEvent.getParameter("value").toLowerCase() + "'";
					var oFilterPackage = new sap.ui.model.Filter("tolower(entityName)", sap.ui.model.FilterOperator.Contains,
							searchValue);
					var oBinding = oEvent.getSource().getBinding("items");
					oBinding.filter(new sap.ui.model.Filter([oFilterPackage], false));
				}

			});

			try {
				if(that.getView().getModel().getData().VIEW_NAME)  {
					that.populateRelevantEntitySet(hanaEntitySetHelpDialog);
				}
				else {
					that.oModelForEntity = that.populateEntitySet(that.getView().byId("odataServiceInput").getValue());
					hanaEntitySetHelpDialog.setModel(that.oModelForEntity);
					hanaEntitySetHelpDialog.open();
				}
			} catch (err) {

			} 
		}
	},
	entitySetChange : function(value){
		var that = this;
		that.resetAdditionalMeasures();
		if(that.getView().getModel().getProperty("/ODATA_URL") && that.getView().getModel().getProperty("/ODATA_ENTITYSET")) {

			try {
				that.populateDimensionsAndInputParameters(that.getView().getModel().getProperty("/ODATA_URL"), that.getView().getModel().getProperty("/ODATA_ENTITYSET"));
			}
			catch(e) {
				sap.suite.smartbusiness.utils.showErrorMessage(that.oResourceBundle.getText("ERROR_WRONG_ENTITY_SET"), that.oResourceBundle.getText("ERROR_ODATA_ANALYTICS"));
				that.resetDimensionsAndInputParameters();
			}
		}
		else {
			that.resetDimensionsAndInputParameters();
			that.getView().getModel().setProperty("/COLUMN_NAME","");
		}

	},
	handleMeasureValueHelp : function(){
		var that = this;
		var that = this;
		if(!that.byId("entitySetInput").getValue()){
			sap.suite.smartbusiness.utils.showErrorMessage(that.oResourceBundle.getText("ERROR_ENTER_ENTITY_SET"));
		}
		else{
			try {
				that.oModelForMeasure = that.populateMeasure(that.getView().getModel().getProperty("/ODATA_URL"), that
						.getView().getModel().getProperty("/ODATA_ENTITYSET"));

			} catch (err) {

			}
			var hanaMeasureHelpDialog = new sap.m.SelectDialog({
				title : that.oResourceBundle.getText("SELECT_MEASURE"),
				noDataText : that.oResourceBundle.getText("NO_DATA_FOUND"),
				items : {
					path : "/measures",
					template : new sap.m.StandardListItem({
						title : {
							parts : [{
								path : "measureName",
								type : new sap.ui.model.type.String()
							}],
							formatter : function(o,s) {
								return o;
							}
						},
					})
				},
				confirm : function(oEvent) {
					that.getView().getModel().setProperty("/COLUMN_NAME", oEvent.getParameter("selectedItem").getProperty("title"));
				},
				liveChange : function(oEvent) {
					var searchValue = "'" + oEvent.getParameter("value").toLowerCase() + "'";
					var oFilterPackage = new sap.ui.model.Filter("tolower(measureName)", sap.ui.model.FilterOperator.Contains,
							searchValue);
					var oBinding = oEvent.getSource().getBinding("items");
					oBinding.filter(new sap.ui.model.Filter([oFilterPackage], false));
				}

			});
			hanaMeasureHelpDialog.setModel(that.oModelForMeasure);
			hanaMeasureHelpDialog.open();

		}
	},

	measureChange : function(value){
		var that = this;
		try {
			that.oModelForMeasure = that.populateMeasure(that.getView().getModel().getProperty("/ODATA_URL"), that
					.getView().getModel().getProperty("/ODATA_ENTITYSET"));

		} catch (err) {

		}
	},

	handleChangeAdditionalInfo : function(oEvent) {
		var that = this;
		that.getView().getModel().setProperty("info", that.getView().byId("additionalInfoId"));

	},
	populateRelevantEntitySet : function(dialog) {
		var that = this;
		var modelData = this.getView().getModel().getData();

		var odata_package = modelData.ODATA_URL.substr(0,modelData.ODATA_URL.lastIndexOf("/"));
		odata_package = odata_package.replace(/\//g, '.').replace(".","");

		var odata_file = modelData.ODATA_URL.substr(modelData.ODATA_URL.lastIndexOf("/") + 1);
		odata_file = odata_file.split(".")[0];

		var entity = "/ODATA_FOR_ENTITY(P_PACKAGE='"+modelData.VIEW_NAME.split("/")[0] + "',P_OBJECT='" +modelData.VIEW_NAME.split("/")[1] + "')/Results?$filter=PACKAGE eq '" + odata_package + "' and OBJECT eq '" + odata_file + "'";

		this.oApplicationFacade.getODataModel().read(entity, null, null, false, function(data) {
			if(data.results && data.results.length) {
				var cdata = data.results[0].CDATA_STR;

				dialog.open();

				// handling comments in the xsodata file
				if(cdata) {
					//handling "//"
					var eachLine = cdata.split("\n");
					for(var i=0,l=eachLine.length; i<l; i++) {
						if(eachLine[i].indexOf("//") != -1) {
							eachLine[i] = eachLine[i].substr(0, eachLine[i].indexOf("//"));
						}
					}
					cdata = eachLine.join("\n");

					//handling "/* */"
					while(cdata.indexOf("/*") != -1) {
						var start = cdata.indexOf("/*");
						var end = cdata.indexOf("*/");
						end = (end == -1) ? cdata.length : (end-2);
						cdata = cdata.substr(0,start) + cdata.substr(end);
					}
				}

				var entityDataArray = [];

				var oModel = new sap.ui.model.json.JSONModel();

				var a = cdata.split(modelData.VIEW_NAME.split("/")[0] + '::' + modelData.VIEW_NAME.split("/")[1]);

				if(a.length == 1) {
					a = cdata.split(modelData.VIEW_NAME.split("/")[0] + '/' + modelData.VIEW_NAME.split("/")[1]);
				}

				if(a.length == 1) {
					sap.m.MessageToast.show("OData Document not compatible");
					oModel = that.populateEntitySet(that.getView().byId("odataServiceInput").getValue());
					dialog.setModel(oModel);
					return;
				}

				for(var i=1,l=a.length; i<l; i++) {
					var obj = {};
					obj.entityName = a[i].split('"')[2];
					entityDataArray.push(obj);
				}

				oModel.setData({
					entitySet : entityDataArray
				});
				dialog.setModel(oModel);
				return;
			}
		}, function(err) {

		});

	},
	//Odata For Analytics
	populateEntitySet : function(dataSource) {
		var oController = this;
		var oModel = new sap.ui.model.json.JSONModel();
		var resultEntity = [], entityDataArray = [], obj = {};
		var i;
		resultEntity = sap.suite.smartbusiness.odata.getAllEntitySet(dataSource);
		for (i = 0; i < resultEntity.length; i++) {
			obj = {};
			obj.entityName = resultEntity[i];
			entityDataArray.push(obj);
		}
		oModel.setData({
			entitySet : entityDataArray
		});
		return oModel;
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

	additionalInformationForKpi : function(evt) {
		var that = this;
		that.dialogAdditionalInfo = new sap.m.Dialog({
			type : "Message",
			title : that.oResourceBundle.getText("ADDITIONAL_INFO_FROM_KPI"),
			content : [new sap.m.Label({text:{path:'/DATA_SPECIFICATION', formatter:function(value){
				if(that.getView().getModel().getData().DATA_SPECIFICATION){
					return that.getView().getModel().getData().DATA_SPECIFICATION;
				}
				else{
					return that.oResourceBundle.getText("ERROR_NO_DATA_TO_DISPLAY");
				}
			}}})],//.setText(oController.getView().getModel().getData().DATA_SPECIFICATION)],
			beginButton : new sap.m.Button({
				text : that.oResourceBundle.getText("CLOSE"),
				press : function(oEvent) {
					oEvent.getSource().getParent().close();
				}
			})
		});
		that.dialogAdditionalInfo.setModel(that.getView().getModel());
		that.dialogAdditionalInfo.open();
	},

	addNewProperty : function() {
		if (this.getView().byId("propertyName").getValue()) {
			this.getView().byId("propertyName").setValueState("None");
			if (this.getView().byId("propertyValue").getValue()) {
				this.getView().byId("propertyValue").setValueState("None");
				var propertyModel = this.getView().byId('propertyNameValueBox').getModel();
				propertyModel.getData().PROPERTIES = propertyModel.getData().PROPERTIES || [];
				for(var i=0; i<propertyModel.getData().PROPERTIES.length;i++){
					if((propertyModel.getData().PROPERTIES[i].NAME === this.getView().byId("propertyName").getValue()) && (propertyModel.getData().PROPERTIES[i].VALUE === this.getView().byId("propertyValue").getValue())){
						sap.suite.smartbusiness.utils.showErrorMessage(this.oResourceBundle.getText("ERROR_PROPERTY_VALUE_PAIR_EXISTS"));
						return;
					}
				}

				propertyModel.getData().PROPERTIES.push({
					NAME : this.getView().byId("propertyName").getValue(),
					VALUE : this.getView().byId("propertyValue").getValue()
				});
				propertyModel.updateBindings();
				this.getView().byId("propertyName").setValue("");
				this.getView().byId("propertyValue").setValue("");
			} else {
				this.getView().byId("propertyValue").setValueState("Error");
				sap.suite.smartbusiness.utils.showErrorMessage(that.oResourceBundle.getText("ERROR_ENTER_PROPERTY_VALUE"));
			}
		} else {
			this.getView().byId("propertyName").setValueState("Error");
			sap.suite.smartbusiness.utils.showErrorMessage(that.oResourceBundle.getText("ERROR_ENTER_PROPERTY_NAME"));
		}
	},

	removeProperty : function(evt) {
		var path = evt.getSource().getBindingContext().getPath();
		evt.getSource().getBindingContext().getModel().getData().PROPERTIES.splice(path.substring(path
				.lastIndexOf("/") + 1), 1);
		evt.getSource().getBindingContext().getModel().updateBindings();
	},

	populateDimensionsAndInputParameters : function(dataSource, entitySet) {
		var dimensions = [];
		var inputParameters = [];
		this.oData4SAPAnalyticsModel = new sap.suite.smartbusiness.odata4analytics.Model(
				new sap.suite.smartbusiness.odata4analytics.Model.ReferenceByURI(dataSource), null);
		this.queryResultObj = this.oData4SAPAnalyticsModel.findQueryResultByName(entitySet);
		var queryResultObjDimensions = this.queryResultObj.getAllDimensions();
		for (key in queryResultObjDimensions) {
			var name = queryResultObjDimensions[key].getName();
			var propertyType = queryResultObjDimensions[key].getKeyProperty().type;
			var newObj = {
					name : name,
					propertyType : propertyType
			};
			dimensions.push(newObj);
		}
		var data = this.oModelForDimensions.getData();
		data.dimensions = dimensions;
		data.dataSource = dataSource;
		data.entitySet = entitySet;
		if(data.selectedDimensions)
		{      
			for(var key in data.selectedDimensions)
			{
				data.selectedDimensions[key].propertyType = this.queryResultObj.findDimensionByName(data.selectedDimensions[key].name)?
						this.queryResultObj.findDimensionByName(data.selectedDimensions[key].name).getKeyProperty().type:"";  
						if(data.selectedDimensions[key].propertyType == "Edm.DateTime")
						{    
							var valueArray = data.selectedDimensions[key].value_1.split(",");
							for( i in valueArray)
							{      if( valueArray[i] != "")
							{
								var dateObj = new Date(valueArray[i]);
								var month = dateObj.getMonth()+1;
								month = /^\d$/.test(month) ? "0"+ month : month;
								var date = dateObj.getDate();
								date = /^\d$/.test(date) ? "0"+ date : date;
								var hours = dateObj.getHours();
								hours = /^\d$/.test(hours) ? "0"+ hours : hours;
								var minutes = dateObj.getMinutes();
								minutes = /^\d$/.test(minutes) ? "0"+ minutes : minutes;
								var seconds = dateObj.getSeconds();
								seconds = /^\d$/.test(seconds) ? "0"+ seconds : seconds;
								valueArray[i] = dateObj.getFullYear()+"-"+ month +"-"+date+" "+hours+":"+minutes+":"+seconds+"."+dateObj.getMilliseconds();
							}
							}
							data.selectedDimensions[key].value_1 = valueArray.join(",");
							valueArray = null;
							valueArray = data.selectedDimensions[key].value_2.split(",");
							for(var i in valueArray)
							{
								if(valueArray[i] != "")
								{
									var dateObj = new Date(data.selectedDimensions[key].value_2);
									var month = dateObj.getMonth()+1;
									month = /^\d$/.test(month) ? "0"+ month : month;
									var date = dateObj.getDate();
									date = /^\d$/.test(date) ? "0"+ date : date;
									var hours = dateObj.getHours();
									hours = /^\d$/.test(hours) ? "0"+ hours : hours;
									var minutes = dateObj.getMinutes();
									minutes = /^\d$/.test(minutes) ? "0"+ minutes : minutes;
									var seconds = dateObj.getSeconds();
									seconds = /^\d$/.test(seconds) ? "0"+ seconds : seconds;
									valueArray[i] = dateObj.getFullYear()+"-"+ month +"-"+date+" "+hours+":"+minutes+":"+seconds+"."+dateObj.getMilliseconds();
								}
							}
							data.selectedDimensions[key].value_2 = valueArray.join(",");
							this.dimensionValue[data.selectedDimensions[key].name] = this.dimensionValue[data.selectedDimensions[key].name] ? this.dimensionValue[data.selectedDimensions[key].name] : {};
							this.dimensionValue[data.selectedDimensions[key].name]["value_1"] = data.selectedDimensions[key].value_1;
							this.dimensionValue[data.selectedDimensions[key].name]["value_2"] = data.selectedDimensions[key].value_2;                                      
						}
			}
		}
		this.oModelForDimensions.setData(data);
		var inputParametersObj = this.queryResultObj.getParameterization();
		if (inputParametersObj)
		{                              
			if(this.oModelForInputParameters.getData().inputParameters)
			{   
				var inputParameters = this.oModelForInputParameters.getData().inputParameters;
				for(var key in inputParameters)
				{
					inputParameters[key].propertyType = inputParametersObj.findParameterByName(inputParameters[key].name).getProperty().type;
					if(inputParameters[key].propertyType == "Edm.DateTime")
					{
						var valueArray = inputParameters[key].value_1.split(",");
						for( i in valueArray)
						{        
							if( valueArray[i] != "")
							{
								var dateObj = new Date(valueArray[i]);
								var month = dateObj.getMonth()+1;
								month = /^\d$/.test(month) ? "0"+ month : month;
								var date = dateObj.getDate();
								date = /^\d$/.test(date) ? "0"+ date : date;
								var hours = dateObj.getHours();
								hours = /^\d$/.test(hours) ? "0"+ hours : hours;
								var minutes = dateObj.getMinutes();
								minutes = /^\d$/.test(minutes) ? "0"+ minutes : minutes;
								var seconds = dateObj.getSeconds();
								seconds = /^\d$/.test(seconds) ? "0"+ seconds : seconds;
								valueArray[i] = dateObj.getFullYear()+"-"+ month +"-"+date+" "+hours+":"+minutes+":"+seconds+"."+dateObj.getMilliseconds();
							}
						}
						inputParameters[key].value_1 = valueArray.join(",");
						valueArray = null;
						valueArray = inputParameters[key].value_2.split(",");
						for(var i in valueArray)
						{
							if(valueArray[i] != "")
							{
								var dateObj = new Date(data.selectedDimensions[key].value_2);
								var month = dateObj.getMonth()+1;
								month = /^\d$/.test(month) ? "0"+ month : month;
								var date = dateObj.getDate();
								date = /^\d$/.test(date) ? "0"+ date : date;
								var hours = dateObj.getHours();
								hours = /^\d$/.test(hours) ? "0"+ hours : hours;
								var minutes = dateObj.getMinutes();
								minutes = /^\d$/.test(minutes) ? "0"+ minutes : minutes;
								var seconds = dateObj.getSeconds();
								seconds = /^\d$/.test(seconds) ? "0"+ seconds : seconds;
								valueArray[i] = dateObj.getFullYear()+"-"+ month +"-"+date+" "+hours+":"+minutes+":"+seconds+"."+dateObj.getMilliseconds();
							}
						}
						inputParameters[key].value_2 = valueArray.join(",");
					}
				}                                       
			}
			else
			{   
				var inputParametersNames = inputParametersObj.getAllParameters();
				for ( var key in inputParametersNames) {
					var name = inputParametersNames[key].getName();
					var propertyType = inputParametersNames[key].getProperty().type;
					var optional = inputParametersNames[key].isOptional();
					var newObj = {
							name : name,
							propertyType : propertyType,
							operator : "EQ",
							value_1 : "",
							value_2 : ""
					};
					inputParameters.push(newObj);
				}
			}
			if (inputParameters.length > 0)
				this.byId("inputParameterLayoutHeaders").setVisible(true);
			data = this.oModelForInputParameters.getData();
			data.inputParameters = inputParameters;
			this.oModelForInputParameters.setData(data);
		}              

	},

	setInputParameterAndFilterLayout : function() {
		var that = this;
		this.dimensionValueHelpDialogs = {};
		this.dimensionValue = {};
		this.byId("inputParameterLayoutHeaders").setVisible(false);
		this.byId("inputParameterBaseLayout").setModel(this.oModelForInputParameters);
		this.byId("inputParameterBaseLayout").bindAggregation("items", "/inputParameters", function(sId, oContext) {
			var inputParameterOperator = new sap.m.Select({
				width : "100%",
				customData : [{
					key : "valueType",
					value : "value_1"
				}],
				items : [new sap.ui.core.Item({
					text : that.oResourceBundle.getText("EQUAL_TO"),
					key : "EQ"
				})],
				selectedKey : "{operator}",
				layoutData : new sap.ui.layout.GridData({
					span : "L4 M4"
				})
			});
			var inputParameterValue = new sap.m.Input({
				value : "{value_1}",
				customData : [{
					key : "valueType",
					value : "value_1"
				}],
				//showValueHelp : true,
				valueHelpRequest : jQuery.proxy(that.openInputParameterValueHelpDialog,that),
				change : jQuery.proxy(that.handleDimensionValueChange, that),
				valueState : {
					path : "error_1",
					formatter : function(error) {
						if (error)
							return "Error";
						else
							return "None";
					}
				},
				layoutData : new sap.ui.layout.GridData({
					span : "L4 M4"
				})
			});
			var inputParameterGrid = new sap.ui.layout.Grid({
				defaultSpan : "L9 M9",
				content : [new sap.m.Input({
					value : "{name}",
					editable:false,
					layoutData : new sap.ui.layout.GridData({
						span : "L4 M4"
					})
				}), inputParameterOperator, inputParameterValue]
			});
			return inputParameterGrid;
		});
		//Dimensions Layout
		this.byId("dimensionLayoutHeaders").setVisible(false);
		this.byId("baseDimensionLayout").setModel(this.oModelForDimensions);
		this.byId("baseDimensionLayout").bindAggregation("items", "/selectedDimensions", function(sId, oContext) {
			var dimensionOperator = new sap.m.Select({
				width : "100%",
				customData : [{
					key : "valueType",
					value : "value_1"
				}],
				items : [new sap.ui.core.Item({
					text : that.oResourceBundle.getText("EQUAL_TO"),
					key : "EQ"
				}), new sap.ui.core.Item({
					text : that.oResourceBundle.getText("GREATER_THAN"),
					key : "GT"
				}), new sap.ui.core.Item({
					text : that.oResourceBundle.getText("LESS_THAN"),
					key : "LT"
				}), new sap.ui.core.Item({
					text : that.oResourceBundle.getText("NOT_EQUAL_TO"),
					key : "NE"
				}), new sap.ui.core.Item({
					text : that.oResourceBundle.getText("BETWEEN"),
					key : "BT"
				})],
				selectedKey : "{operator}",
				change : jQuery.proxy(that.handleOperatorChange, that),
				layoutData : new sap.ui.layout.GridData({
					span : "L3 M3"
				})
			});
			var dimensionValue = new sap.m.Input({
				value : "{value_1}",
				customData : [{
					key : "valueType",
					value : "value_1"
				}],
				showValueHelp : true,
				valueState : {
					path : "error_1",
					formatter : function(error) {
						if (error)
							return "Error";
						else
							return "None";
					}
				},
				valueHelpRequest : jQuery.proxy(that.handleDimensionValueHelp, that),
				change : jQuery.proxy(that.handleDimensionValueChange, that),
				layoutData : new sap.ui.layout.GridData({
					span : "L4 M4"
				})
			});
			var dimensionValueTo = new sap.m.Input({
				value : "{value_2}",
				customData : [{
					key : "valueType",
					value : "value_2"
				}],
				showValueHelp : true,
				visible : {
					path : "operator",
					formatter : function(operator) {
						return (operator === "BT") ? true : false;
					}
				},
				valueState : {
					path : "error_2",
					formatter : function(error) {
						if (error)
							return "Error";
						else
							return "None";
					}
				},
				valueHelpRequest : jQuery.proxy(that.handleDimensionValueToHelp, that),
				change : jQuery.proxy(that.handleDimensionValueChange, that),
				layoutData : new sap.ui.layout.GridData({
					span : "L4 M4"
				})
			});
			var dimensionValueToLabel = new sap.m.Label({
				text : "To",
				visible : {
					path : "operator",
					formatter : function(operator) {
						return (operator === "BT") ? true : false;
					}
				}
			});
			var dimensionValueLayout = new sap.m.VBox({
				items : [dimensionValue, dimensionValueToLabel, dimensionValueTo],
				layoutData : new sap.ui.layout.GridData({
					span : "L4 M4"
				})
			});
			var dimensionDel = new sap.m.Button({
				icon : "sap-icon://sys-cancel",
				type : "Transparent",
				layoutData : new sap.ui.layout.GridData({
					span : "L2 M2 S2"
				}),
				press : function(evt) {
					var path = evt.getSource().getBindingContext().getPath();
					if(that.dimensionValue){
						if(that.dimensionValue[evt.getSource().getBindingContext().getObject().name]){
							delete that.dimensionValue[evt.getSource().getBindingContext().getObject().name]
						}
					}
					evt.getSource().getBindingContext().getModel().getData().selectedDimensions.splice(path.substring(path
							.lastIndexOf("/") + 1), 1);
					evt.getSource().getBindingContext().getModel().updateBindings();
					
					if(evt.getSource().getBindingContext().getModel().getData().selectedDimensions.length == 0){
						that.byId("dimensionLayoutHeaders").setVisible(false);
					}
				}
			});
			var dimensionGrid = new sap.ui.layout.Grid({
				defaultSpan : "L12 M12",
				content : [new sap.m.Input({
					value : "{name}",
					editable:false,
					layoutData : new sap.ui.layout.GridData({
						span : "L3 M3"
					})
				}), dimensionOperator, dimensionValueLayout,dimensionDel]
			});
			return dimensionGrid;
		});
	},

	openInputParameterValueHelpDialog : function(name) {
		var that = this;
		var inputParameterValueHelpDialog = new sap.m.SelectDialog({
			title : that.oResourceBundle.getText("SELECT_VALUES"),
			multiSelect : true,
			rememberSelections : true,
			items : {
				path : "/results",
				template : new sap.m.StandardListItem({
					title : "{" + name + "}",
				})
			},
			confirm : function(oEvent) {
			},
			liveChange : function(oEvent) {
			}
		});
		inputParameterValueHelpDialog.setGrowingThreshold(100);
		inputParameterValueHelpDialog.open();
	},

	openDimensionDialog : function() {
		var that = this;
		if (!this.dimensionDialog) {
			var oSorter1 = new sap.ui.model.Sorter("name",false);
			this.dimensionDialog = new sap.m.SelectDialog({
				title : that.oResourceBundle.getText("SELECT_DIMENSIONS"),
				multiSelect : true,
				items : {
					path : "/dimensions",
					sorter : oSorter1,
					template : new sap.m.StandardListItem({title : "{name}"})
				},
				confirm : function(oEvent) {
					var selectedDimensions = that.oModelForDimensions.getData().selectedDimensions||[];
					var selectedItems = oEvent.getParameter("selectedItems");
					var aContexts = [];
					for(var key in selectedItems){
						aContexts[key] = selectedItems[key].getBindingContext();
					}
					for ( var key in aContexts) {
						var selectedObject = that._cloneObj(aContexts[key].getObject());
						selectedObject.value_1 = "";
						selectedObject.value_2 = "";
						selectedObject.operator = "EQ";
						selectedDimensions.push(selectedObject);
					}
					if (aContexts.length > 0)
						that.byId("dimensionLayoutHeaders").setVisible(true);
					else
						that.byId("dimensionLayoutHeaders").setVisible(false);
					that.oModelForDimensions.setProperty("/selectedDimensions", selectedDimensions);
				},
				liveChange : function(oEvent) {
					var searchValue = oEvent.getParameter("value");
					var oFilter = new sap.ui.model.Filter("name", sap.ui.model.FilterOperator.Contains, searchValue);
					var oBinding = oEvent.getSource().getBinding("items");
					oBinding.filter([oFilter]);
				}
			});
			this.dimensionDialog.setGrowingThreshold(100);
			this.dimensionDialog.setModel(this.oModelForDimensions);

			/*if(that.getView().getModel().getData().mode == "edit" || that.getView().getModel().getData().mode == "duplicate")
			{
				var dialogItems = this.dimensionDialog.getItems();
				var selectedDimensions = this.oModelForDimensions.getData().selectedDimensions;
				for(var key in dialogItems)
				{      for(var dimensionKey in selectedDimensions)
				{
					if(dialogItems[key].getTitle() == selectedDimensions[dimensionKey].name)
						dialogItems[key].setSelected(true);
				}
				}
			}*/
		}
		this.dimensionDialog.open();
	},


	handleDimensionValueHelp : function(oEvent) {
		this.openDimensionValueHelpDialog(oEvent, "value_1");
	},

	handleDimensionValueToHelp : function(oEvent) {
		this.openDimensionValueHelpDialog(oEvent, "value_2");
	},

	openDimensionValueHelpDialog : function(oEvent, valueType) {
		var that = this;
		var parentInputField = oEvent.getSource();
		var baseModel = this.getView().getModel();
		var dimensionValuesModel = new sap.ui.model.json.JSONModel();
		var inputParameterArray = [];
		this.dimensionContext = oEvent.getSource().getBindingContext();
		var dimensionName = oEvent.getSource().getBindingContext().getProperty("name");
		var dimensionOperator = oEvent.getSource().getBindingContext().getProperty("operator")
		var dimensionType = oEvent.getSource().getBindingContext().getProperty("propertyType")
		var inputParameterData = this.oModelForInputParameters.getData().inputParameters;
		for ( var key in inputParameterData) {
			inputParameterArray.push({ 
				OPERATOR: inputParameterData[key].operator, 
				NAME: inputParameterData[key].name, 
				VALUE_1: inputParameterData[key].value_1,
				VALUE_2: inputParameterData[key].value_2, 
				TYPE: "PA" // TYPE { FI, PA} 
			}); 
		}
		var queryService = sap.suite.smartbusiness.odata.getUri({
			serviceUri : baseModel.getProperty("/ODATA_URL"),
			entitySet : baseModel.getProperty("/ODATA_ENTITYSET"),
			filter : inputParameterArray,
			dimension : dimensionName
		});
		queryService.model.read(queryService.uri, null, null, false, function(data) {
			if (that.dimensionValue[dimensionName])
			{
				that.dimensionValue[dimensionName][valueType] = that.dimensionValue[dimensionName][valueType]
				? that.dimensionValue[dimensionName][valueType] : "";
				var dimensionValueArray = that.dimensionValue[dimensionName][valueType] === ""
					? null : that.dimensionValue[dimensionName][valueType].split(",");
				for (key in dimensionValueArray)
				{      var userInputData = true;
				for ( var i in data.results)
				{   if(dimensionType == "Edm.DateTime")
				{      var date = new Date(dimensionValueArray[key]).toJSON();
				var dateFromService = new Date(data.results[i][dimensionName]).toJSON();
				if(date == dateFromService)
				{      userInputData = false;
				break;                                                                     
				}
				}
				else if (dimensionValueArray[key] === data.results[i][dimensionName])
				{  userInputData = false;
				break;
				}
				}
				if (userInputData)
				{
					var userInputValueObject = {};
					userInputValueObject[dimensionName] = dimensionValueArray[key];
					userInputValueObject.userInput = true;
					userInputValueObject.selected = true;
					data.results.push(userInputValueObject);
				}
				else
					data.results[i].selected = true;
				}
			}
			dimensionValuesModel.setData(data);
		}, function(error) {

		});
		
		var oSorter1 = new sap.ui.model.Sorter(dimensionName,false,function(context) {
			
			if (context.getProperty("userInput") === true)
				return {
				key : "USER_VALUES",
				text : that.oResourceBundle.getText("VALUES_ENTERED_BY_USER")
			};
			else
				return {
				key : "SERVICE_VALUES",
				text : that.oResourceBundle.getText("VALUES_FETCHED_FROM_SERVICE")
			};
		});
		this.dimensionValueHelpDialogs = new sap.m.SelectDialog(
				{
					title : that.oResourceBundle.getText("SELECT_VALUES"),
					multiSelect : true,
					rememberSelections : true,
					items : {
						path : "/results",
						sorter : oSorter1,
						template : new sap.m.StandardListItem({
							title : "{"+dimensionName+"}",                                                                   
							selected : "{selected}"
						})
					},
					confirm : function(oEvent) {
						var selectedDimensionValues = "";
						var aContexts = oEvent.getParameter("selectedContexts");
						for ( var key in aContexts)
						{      
							if(dimensionType == "Edm.DateTime")
							{   var dateObj = new Date(aContexts[key].getProperty(that.dimensionContext.getProperty("name")));
							var month = dateObj.getMonth()+1;
							month = /^\d$/.test(month) ? "0"+ month : month;
							var date = dateObj.getDate();
							date = /^\d$/.test(date) ? "0"+ date : date;
							var hours = dateObj.getHours();
							hours = /^\d$/.test(hours) ? "0"+ hours : hours;
							var minutes = dateObj.getMinutes();
							minutes = /^\d$/.test(minutes) ? "0"+ minutes : minutes;
							var seconds = dateObj.getSeconds();
							seconds = /^\d$/.test(seconds) ? "0"+ seconds : seconds;
							selectedDimensionValues = selectedDimensionValues + dateObj.getFullYear()+"-"+ month +"-"+date+" "+hours+":"+minutes+":"+seconds+"."+dateObj.getMilliseconds()+",";     
							}
							else
								selectedDimensionValues = selectedDimensionValues + aContexts[key].getProperty(that.dimensionContext.getProperty("name")) + ",";
						}
						selectedDimensionValues = selectedDimensionValues.substring(0, selectedDimensionValues.length - 1);
						that.oModelForDimensions.setProperty(that.dimensionContext.getPath() + "/" + valueType,selectedDimensionValues);
						parentInputField.fireChange({
							value : selectedDimensionValues
						});
						that.dimensionValue[dimensionName] = that.dimensionValue[dimensionName] ? that.dimensionValue[dimensionName] : {};
						that.dimensionValue[dimensionName][valueType] = selectedDimensionValues;
					},
					liveChange : function(oEvent) {
						var searchValue = oEvent.getParameter("value");
						var oFilter = new sap.ui.model.Filter(dimensionName, sap.ui.model.FilterOperator.Contains,
								searchValue);
						var oBinding = oEvent.getSource().getBinding("items");
						oBinding.filter([oFilter]);
					}
				});
		this.dimensionValueHelpDialogs.setGrowingThreshold(100);
		this.dimensionValueHelpDialogs.setModel(dimensionValuesModel);
		
		var dimensions = this.oModelForDimensions.getData().selectedDimensions;
		var items = this.dimensionValueHelpDialogs.getItems();
		for(var i=0;i<dimensions.length;i++){
			if((dimensionName === dimensions[i].name) &&(dimensionOperator === dimensions[i].operator)){
				var value;
				if(dimensions[i].operator === "BT"){
					if(valueType === "value_1")
						value = dimensions[i].value_1.split(",");
					else
						value = dimensions[i].value_2.split(",");
				}
				else{
					value = dimensions[i].value_1.split(",");
				}
				
				for(var j=0;j<value.length;j++){
					for(var k=1;k<items.length;k++){
						if(value[j] === items[k].getTitle()){
							items[k].setSelected(true);
						}
					}
				}
			}
		}
		
		this.dimensionValueHelpDialogs.open();
		for(var i=1;i<items.length;i++){
			if(!items[i].getSelected()){
				this.dimensionValueHelpDialogs.getItems()[i].setSelected(true);
				this.dimensionValueHelpDialogs.getItems()[i].setSelected(false);
			}
		}
	},

	handleDimensionValueChange : function(oEvent) {
		this.validateValue(oEvent, "dimensionValue");
		var valueType = oEvent.getSource().getCustomData()[0].getValue(); //value_1 or value_2
		var dimensionName = oEvent.getSource().getBindingContext().getProperty("name");
		if (!this.dimensionValue[dimensionName])
			this.dimensionValue[dimensionName] = {};
		this.dimensionValue[dimensionName][valueType] = oEvent.getParameter("value");
	},

	validateValue : function(oEvent, sourceType) {
		var that = this,result;
		var dimensionName = oEvent.getSource().getBindingContext().getProperty("name");
		var valueType = oEvent.getSource().getCustomData()[0].getValue();
		var valueArray = (sourceType === "dimensionValue") ? oEvent.getParameter("value").split(",") : oEvent
				.getSource().getBindingContext().getProperty("value_1");

		//Checking if multiple values for BT
		var operator = oEvent.getSource().getBindingContext().getProperty("operator");
		if (operator === "BT") {
			if (valueArray.length > 1) {
				result = false;
				sap.suite.smartbusiness.utils.showErrorMessage(that.oResourceBundle.getText("ERROR_MULTIPLE_VALUES_FOR_BETWEEN",dimensionName));
				var sPath = valueType === "value_1"
					? oEvent.getSource().getBindingContext().getPath() + "/error_1"
							: oEvent.getSource().getBindingContext().getPath() + "/error_2";
					oEvent.getSource().getModel().setProperty(sPath, true);
					return;
			} else {
				var sPath = valueType === "value_1"
					? oEvent.getSource().getBindingContext().getPath() + "/error_1"
							: oEvent.getSource().getBindingContext().getPath() + "/error_2";
					oEvent.getSource().getModel().setProperty(sPath, false);
			}
		}

		//Checking dimension value types are correct
		var expectedValueType = oEvent.getSource().getBindingContext().getProperty("propertyType");
		var errorMsg,pattern;
		for ( var key in valueArray) {
			result = true;
			var scriptTagPattern = /<(script)(.*)\/?>/i;
			var jsFunctionDefinitionPattern = /function\s*[^\(]*\(\s*([^\)]*)\)/;
			var jsFunctionCallPattern = /[^\(]*\(\s*([^\)]*)\)\s*{/;
			if (scriptTagPattern.test(valueArray[key]) || jsFunctionDefinitionPattern.test(valueArray[key])
					|| jsFunctionCallPattern.test(valueArray[key])) {
				result = false;
				errorMsg = that.oResourceBundle.getText("ERROR_INVALID_TEXT_FOR",dimensionName);
			}
			if(expectedValueType == "Edm.Int32" || expectedValueType == "Edm.Int16" || expectedValueType == "Edm.Int64")
			{
				pattern = /^[-+]?\d+$/;
				result = pattern.test(valueArray[key]) ? true : false;
				errorMsg = that.oResourceBundle.getText("ERROR_INVALID_ENTRY_ENTER_INTEGER",dimensionName);
			} 
			else if(expectedValueType == "Edm.Decimal")
			{
				pattern = /^[-+]?\d+(\.\d+)?$/;
				result = pattern.test(valueArray[key])?true:false;
				errorMsg = that.oResourceBundle.getText("ERROR_INVALID_ENTRY_ENTER_DECIMAL",dimensionName);
			}
			else if(expectedValueType == "Edm.DateTime")
			{
				pattern = /^[1-9][0-9]{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])(\s([0-1][0-9]|2[0-3]):[0-5][0-9]:([0-9]|[0-5][0-9])[.][0-9]+)?$/;
				result = pattern.test(valueArray[key])?true:false;
				errorMsg = that.oResourceBundle.getText("ERROR_INVALID_ENTRY_ENTER_DATE",dimensionName);
			}

			if (!result) {
				sap.suite.smartbusiness.utils.showErrorMessage(errorMsg);
				var sPath = valueType === "value_1"
					? oEvent.getSource().getBindingContext().getPath() + "/error_1"
							: oEvent.getSource().getBindingContext().getPath() + "/error_2";
					oEvent.getSource().getModel().setProperty(sPath, true);
					return;
			} else {
				var sPath = valueType === "value_1"
					? oEvent.getSource().getBindingContext().getPath() + "/error_1"
							: oEvent.getSource().getBindingContext().getPath() + "/error_2";
					oEvent.getSource().getModel().setProperty(sPath, false);
			}
		}
	},

	handleOperatorChange : function(oEvent) {
		var context = oEvent.getSource().getBindingContext();
		context.getObject().value_1 = "";
		if(this.dimensionValue){
			if(this.dimensionValue[context.getObject().name]){
				this.dimensionValue[context.getObject().name].value_1="";
			}
		}
		
		if (context.getProperty("operator") === "BT") {
			context.getObject().value_2 = "";
			if(this.dimensionValue){
				if(this.dimensionValue[context.getObject().name]){
					this.dimensionValue[context.getObject().name].value_2="";
				}
			}
		} 
		context.getModel().updateBindings();
	},

	validateDimensionsAndInputParameters : function() {
		var inputParameters = this.oModelForInputParameters.getData().inputParameters;
		var dimensions = this.oModelForDimensions.getData().selectedDimensions;
		var error = false;
		var errorType = "";
		var errorDimension = "";
		for ( var key in inputParameters) {
			if (inputParameters[key].error_1 === true || inputParameters[key].error_2 === true)
				error = true;
			if (inputParameters[key].value_1 === "") {
				error = true;
				errorType = "mandatoryFieldEmpty";
				inputParameters[key].error_1 = true;
			}
		}
		this.oModelForInputParameters.updateBindings();
		for ( var key in dimensions) {
			if (dimensions[key].error_1 === true || dimensions[key].error_2 === true){
				error = true;
				errorType = "invalidEntry";
				errorDimension = dimensions[key];
			}
			if (dimensions[key].value_1 === "") {
				error = true;
				errorType = "fieldEmpty";
				dimensions[key].error_1 = true;
			}
			if (dimensions[key].operator === "BT" && dimensions[key].value_2 === "") {
				error = true;
				errorType = "fieldEmpty";
				dimensions[key].error_2 = true;
			}
		}
		this.oModelForDimensions.updateBindings();
		return {
			error : error,
			errorType : errorType,
			errorDimension : errorDimension
		};
	},

	resetDimensionsAndInputParameters : function() {
		this.oModelForDimensions.setData({});
		this.oModelForInputParameters.setData({});
		this.dimensionDialog = null;
		this.dimensionValueHelpDialogs = {};
		this.dimensionValue = {};
		this.byId("inputParameterLayoutHeaders").setVisible(false);
		this.byId("dimensionLayoutHeaders").setVisible(false);
	},

	createTargetThresholdLayout : function() {
		var that = this;
		var trend = this.getView().getModel().getData().TREND;
		var reference_value = this.getView().getModel().getData().REFERENCE_VALUE;
		if (this.getView().getModel().getData().INDICATOR) {
			this.getView().byId('targetThresholdPanel').setVisible(true);
			this.getView().byId('targetThresholdPanel').getContent()[0].destroy();
			if(this.getView().getModel().getData().mode !== "edit"){
				delete this.getView().getModel().getData().CRITICALHIGH;
				delete this.getView().getModel().getData().WARNINGHIGH;
				delete this.getView().getModel().getData().TARGET;
				delete this.getView().getModel().getData().WARNINGLOW;
				delete this.getView().getModel().getData().CRITICALLOW;
				delete this.getView().getModel().getData().TREND;
				delete this.getView().getModel().getData().REFERENCE_VALUE;
			}
			that.getView().byId('targetThresholdPanel').addContent(new sap.ui.core.mvc.XMLView({
				viewName : "sap.suite.ui.smartbusiness.designtime.evaluation.view.createEvalTargetThresholdTrendInput",
				viewData : {controller:that}
			}));
		}
		if (!this.getView().getModel().getData().INDICATOR) {
			this.getView().byId('targetThresholdPanel').setVisible(false);
		}
		this.getView().getModel().setProperty("TREND",trend);
		this.getView().getModel().setProperty("REFERENCE_VALUE",reference_value);

	},

	addAdditionalLanguageDialog : function(){
		var that=this;
		this.additionalLanguageListModel = new sap.ui.model.json.JSONModel();
		this.additionalLanguageListModelData = jQuery.extend([], that.getView().getModel().getData().ADDITIONAL_LANGUAGE_ARRAY);
		this.getView().getModel().getData().NO_OF_ADDITIONAL_LANGUAGES = this.additionalLanguageListModelData.length;
		this.additionalLanguageListModel.setData(this.additionalLanguageListModelData);

		this.languageTextInput = new sap.m.Input({
			layoutData : new sap.ui.layout.GridData({
				span : "L8 M8 S8"
			})
		});
		this.languageDescriptionInput = new sap.m.TextArea({
			layoutData : new sap.ui.layout.GridData({
				span : "L8 M8 S8"
			})
		});
		this.languageKeySelect = new sap.m.Select({
			layoutData : new sap.ui.layout.GridData({
				span : "L6 M6 S6"
			})
		});
		this.addedLanguagesList = new sap.m.List({
			layoutData : new sap.ui.layout.GridData({
				span : "L5 M5 S5"
			}),
		});
		this.addedLanguagesList.bindItems("additionalLanguageListModel>/", new sap.m.CustomListItem({
			content : new sap.ui.layout.Grid({
				hSpacing: 1,
				vSpacing: 0,
				defaultSpan : "L12 M12 S12",
				content: [
				          new sap.m.Input({
				        	  value : "{additionalLanguageListModel>TITLE}",
				        	  design : "Bold",
				        	  layoutData : new sap.ui.layout.GridData({
				        		  span : "L12 M12 S12",
				        		  vAlign : "Middle"
				        	  }),
				        	  editable : false
				          }),
				          new sap.m.Input({
				        	  value : "{additionalLanguageListModel>DESCRIPTION}",
				        	  design : "Bold",
				        	  layoutData : new sap.ui.layout.GridData({
				        		  span : "L6 M6 S6",
				        		  vAlign : "Middle"
				        	  }),
				        	  editable : false
				          }),
				          new sap.m.Input({
				        	  value : "{additionalLanguageListModel>LANGUAGE_KEY}",
				        	  design : "Bold",
				        	  layoutData : new sap.ui.layout.GridData({
				        		  span : "L4 M4 S4"
				        	  }),
				        	  editable : false
				          }),
				          new sap.m.Button({
				        	  icon : "sap-icon://sys-cancel",
				        	  type : "Transparent",
				        	  press : function(oEvent){
				        		  var deletedIndex = oEvent.getSource().getBindingContext("additionalLanguageListModel").getPath().substr(1);
				        		  var newData = that.addedLanguagesList.getModel("additionalLanguageListModel").getData().splice(deletedIndex,1);
				        		  that.addedLanguagesList.getModel("additionalLanguageListModel").updateBindings();

				        	  },
				        	  layoutData : new sap.ui.layout.GridData({
				        		  span : "L2 M2 S2"
				        	  })
				          })]
			})
		}));
		this.addedLanguagesList.setModel(that.additionalLanguageListModel,"additionalLanguageListModel");

		var additionalLanguageDialog = new sap.m.Dialog({
			contentHeight : "50%",
			contentWidth : "25%",
			title : this.oApplicationFacade.getResourceBundle().getText("ADDITIONAL_LANGUAGE"),
			content :  [
			            new sap.ui.layout.Grid({
			            	hSpacing: 1,
			            	vSpacing: 4,
			            	defaultSpan : "L12 M12 S12",
			            	content: [
			            	          new sap.ui.layout.form.SimpleForm({
			            	        	  editable:true, 
			            	        	  layout:"ResponsiveGridLayout", 
			            	        	  content : [
			            	        	             new sap.m.Label({
			            	        	            	 text : that.oResourceBundle.getText("TITLE"),
			            	        	            	 layoutData : new sap.ui.layout.GridData({
			            	        	            		 span : "L3 M3 S3",
			            	        	            	 })
			            	        	             }),
			            	        	             that.languageTextInput,
			            	        	             new sap.m.Label({
			            	        	            	 text : that.oResourceBundle.getText("DESCRIPTION"),
			            	        	            	 layoutData : new sap.ui.layout.GridData({
			            	        	            		 span : "L3 M3 S3",
			            	        	            	 })
			            	        	             }),
			            	        	             that.languageDescriptionInput,
			            	        	             new sap.m.Label({
			            	        	            	 text : that.oResourceBundle.getText("LANGUAGE"),
			            	        	            	 layoutData : new sap.ui.layout.GridData({
			            	        	            		 span : "L3 M3 S3"
			            	        	            	 })
			            	        	             }),

			            	        	             that.languageKeySelect,
			            	        	             new sap.m.Button({
			            	        	            	 icon:"sap-icon://add",
			            	        	            	 layoutData : new sap.ui.layout.GridData({
			            	        	            		 span : "L2 M2 S2"
			            	        	            	 }),
			            	        	            	 press : function(){
			            	        	            		 if(that.languageTextInput.getValue() || that.languageDescriptionInput.getValue()){
			            	        	            			 for(var i=0;i<that.addedLanguagesList.getModel("additionalLanguageListModel").getData().length;i++){
			            	        	            				 if(that.addedLanguagesList.getModel("additionalLanguageListModel").getData()[i].LANGUAGE_KEY === that.languageKeySelect.getSelectedItem().getKey()){
			            	        	            					 sap.suite.smartbusiness.utils.showErrorMessage(that.oResourceBundle.getText("ERROR_LANGUAGE_EXISTS",that.languageKeySelect.getSelectedItem().getKey()));
			            	        	            					 return;
			            	        	            				 }
			            	        	            			 }
			            	        	            			 var addedLanguageObject = {
			            	        	            					 "TITLE" : that.languageTextInput.getValue(),
			            	        	            					 "DESCRIPTION" : that.languageDescriptionInput.getValue(),
			            	        	            					 "LANGUAGE_KEY" : that.languageKeySelect.getSelectedItem().getKey()
			            	        	            			 };
			            	        	            			 that.addedLanguagesList.getModel("additionalLanguageListModel").getData().push(addedLanguageObject);
			            	        	            			 that.addedLanguagesList.getModel("additionalLanguageListModel").updateBindings();
			            	        	            			 that.languageTextInput.setValue("");
			            	        	            			 that.languageDescriptionInput.setValue("");
			            	        	            		 }
			            	        	            	 }
			            	        	             })
			            	        	             ]
			            	          })

			            	          ]
			            }).addStyleClass("languageGrid"),
			            that.addedLanguagesList],
			            beginButton : new sap.m.Button({
			            	text : that.oResourceBundle.getText("OK"),
			            	press : function(){
			            		additionalLanguageDialog.close();
			            		that.getView().getModel().getData().ADDITIONAL_LANGUAGE_ARRAY = that.addedLanguagesList.getModel("additionalLanguageListModel").getData();
			            		that.getView().getModel().getData().NO_OF_ADDITIONAL_LANGUAGES = that.getView().getModel().getData().ADDITIONAL_LANGUAGE_ARRAY.length;
			            		that.getView().getModel().updateBindings();
			            	}
			            }),
			            endButton : new sap.m.Button({
			            	text : that.oResourceBundle.getText("CANCEL"),
			            	press : function(){
			            		additionalLanguageDialog.close();
			            	}
			            })
		});
		this.oDataModel.read("/LANGUAGE?$select=LAISO", null, null, false, function(data) {
			data = data.results;
			for(var i=0;i<data.length;i++){

				if((data[i].LAISO).toUpperCase() == (sap.ui.getCore().getConfiguration().getLocale().getLanguage()).toUpperCase()){
					data.splice(i,1);
				}
			}
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.setData(data);
			that.languageKeySelect.setModel(oModel, "otherLanguageKey");
			that.languageKeySelect.bindItems("otherLanguageKey>/", new sap.ui.core.Item({
				text: "{otherLanguageKey>LAISO}",
				key: "{otherLanguageKey>LAISO}"
			}));
		});
		additionalLanguageDialog.open();
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
	formatLangCount : function(value){
		if(!this.getView().getModel().getData()){
			value = 0;
		}
		else
			value = this.getView().getModel().getData().NO_OF_ADDITIONAL_LANGUAGES;
		return this.oApplicationFacade.getResourceBundle().getText("ADDITIONAL_LANGUAGE")+"("+value+")";
	},
	validateEvaluationValues: function(data) {
		data = data || this.getView().getModel().getData();
		var values = [];
		var errors = [];
		var score = 0;
		var duplicates = {};
		if(data.CRITICALLOW || data.CRITICALLOW === 0) {
			values.push({key: "CL", value: data.CRITICALLOW, score: score++});
		}
		if(data.WARNINGLOW || data.WARNINGLOW === 0) {
			values.push({key: "WL", value: data.WARNINGLOW, score: score++});
		}
		if(data.TARGET || data.TARGET === 0) {
			values.push({key: "TA", value: data.TARGET, score: score++});
		}
		if(data.WARNINGHIGH || data.WARNINGHIGH === 0) {
			values.push({key: "WH", value: data.WARNINGHIGH, score: score++});
		}
		if(data.CRITICALHIGH || data.CRITICALHIGH === 0) {
			values.push({key: "CH", value: data.CRITICALHIGH, score: score++});
		}
		values.sort(function(a,b) { return (a.value - b.value)});
		for(var i=0,l=values.length; i<l; i++) {
			if(values[i].score != i) {
				errors.push(values[i].key);
			}
			if(values[i] && values[i-1]) {
				if(values[i].value == values[i-1].value) {
					duplicates[values[i-1].key] = values[i-1].value;
					duplicates[values[i].key] = values[i].value;
				}
			}
		}
		if(!(errors.length)) {
			errors = Object.keys(duplicates);
		}
		return errors;
	},
	
	resetAdditionalMeasures : function(){
		var that = this;
		if(that.getView().getModel().getData().ODATA_URL && that.getView().getModel().getData().ODATA_ENTITYSET){
			if(that.getView().byId('targetThresholdPanel').getContent()[0].getController().measuresDialog){
				var measureModel = that.getView().byId('targetThresholdPanel').getContent()[0].getController().populateMeasure(that.getView().getModel().getData().ODATA_URL,that.getView().getModel().getData().ODATA_ENTITYSET);
				that.getView().byId('targetThresholdPanel').getContent()[0].getController().measuresDialog.setModel(measureModel);
			}
			
		}
		else{
			if(that.getView().byId('targetThresholdPanel').getContent()[0].getController().measuresDialog){
				var measureModel = new sap.ui.model.json.JSONModel({});
				that.getView().byId('targetThresholdPanel').getContent()[0].getController().measuresDialog.setModel(measureModel);
			}
		}
		that.getView().byId('targetThresholdPanel').getContent()[0].byId('additionalMeasures').removeAllTokens();
	}

});