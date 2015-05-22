jQuery.sap.require("sap.ca.scfld.md.controller.BaseFullscreenController");

sap.ca.scfld.md.controller.BaseFullscreenController.extend("sap.suite.ui.smartbusiness.designtime.visualization.view.S4", {
	onInit : function() {
		var that = this;
		var view = this.getView();

		this.LUMIRA_SEMANTIC_OBECT = "LumiraAnalytics";
		this.LUMIRA_ACTION = "openStory";
		
		this.lumiraSemanticObject = "LumiraAnalytics";
		this.lumiraAction = "openStory";
		
		this.apfSemanticObject = "";
		this.apfAction = "";
		
		this.APF_SEMANTIC_OBECT = "";
		this.APF_ACTION = "";
		
		this.sbAction = "analyzeSBKPIDetails";
		
		if(!(that.oApplicationFacade.currentLogonHanaUser)) {
			this.oApplicationFacade.getODataModel().read("/SESSION_USER",null,null,true,function(data) {
				that.oApplicationFacade.currentLogonHanaUser = (data.results && data.results.length) ? data.results[0].LOGON_USER : null; 
			}, function(err) {
				that.oApplicationFacade.currentLogonHanaUser = null;
				sap.suite.smartbusiness.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("YMSG_ERROR_RETRIEVING_DATA"), err.response.body);
			});
		}

		this.oRouter.attachRouteMatched(function(oEvent) {

			if(oEvent.getParameter("name") == "addTile" || oEvent.getParameter("name") == "editTile") {
				this.oApplicationFacade.getODataModel().read("/LANGUAGE?$select=LAISO,SPRAS", null, null, false, function(data) {
					data = data.results;
					if(data.length) {
						if(data.length == 1) {
							that.languagesObject = {LAISO:{},SPRAS:{}};
							that.languagesObject.LAISO[data[0]["LAISO"]] = data[0]["SPRAS"]; that.languagesObject.SPRAS[data[0]["SPRAS"]] = data[0]["LAISO"];
						}
						else {
							that.languagesObject = data.reduce(function(p,c,i,a) { that.languagesObject = that.languagesObject || {}; that.languagesObject.LAISO = that.languagesObject.LAISO || {}; that.languagesObject.SPRAS = that.languagesObject.SPRAS || {}; if(i == 1){ that.languagesObject.LAISO[a[0]["LAISO"]] = a[0]["SPRAS"]; that.languagesObject.SPRAS[a[0]["SPRAS"]] = a[0]["LAISO"]; }  that.languagesObject.LAISO[a[i]["LAISO"]] = a[i]["SPRAS"]; that.languagesObject.SPRAS[a[i]["SPRAS"]] = a[i]["LAISO"]; return that.languagesObject;});
						}
					}
					that.languagesArray = data;
				});
			}
			
			if(oEvent.getParameter("name") == "addTile") {
				this.getSelectedRadioButton(null, "GDD");
				this.byId('selectTileType').setSelectedKey('NT');
				this.selectTile('NT');
				this.getView().byId('NT').$().css("border","solid 2px " + sap.ui.core.theming.Parameters.get("sapUiHighlight"));
				
				this.lumiraSemanticObject = "LumiraAnalytics";
				this.lumiraAction = "openStory";
				
				this.apfSemanticObject = "";
				this.apfAction = "";
				
				this.initialAppParameters = [];

				that.oApplicationFacade.getODataModel().read(oEvent.getParameter("arguments").contextPath + "/TEXTS",null,null,true,function(languageData) {
					languageData = languageData.results;
					var additionalLanguageData = [];
					var i;
					for(i=0;i<languageData.length;i++){
						if(languageData[i].LANGUAGE != that.localLanguage){
							additionalLanguageData.push(languageData[i]);
						}
					}
					var languageArray = [];
					var i;
					for(i=0;i<additionalLanguageData.length;i++){
						var languageObject = {};
						languageObject.ADDITIONAL_LANGUAGE_TITLE = additionalLanguageData[i].TITLE;
						languageObject.ADDITIONAL_LANGUAGE_DESCRIPTION = additionalLanguageData[i].DESCRIPTION;
						languageObject.ADDITIONAL_SAP_LANGUAGE_KEY = additionalLanguageData[i].LANGUAGE;
						languageObject.ADDITIONAL_LANGUAGE_KEY = that.languagesObject.SPRAS[languageObject.ADDITIONAL_SAP_LANGUAGE_KEY]
						languageArray.push(languageObject);
					}
					that.oldLanguagePayload = $.extend(true,[],additionalLanguageData);
					that.additionalLanguageLinkModel.setProperty("/ADDITIONAL_LANGUAGE_ARRAY",languageArray);
					that.additionalLanguageLinkModel.setProperty("/NO_OF_ADDITIONAL_LANGUAGES",that.additionalLanguageLinkModel.getData().ADDITIONAL_LANGUAGE_ARRAY.length);
					that.byId('additionalLanguageLink').bindProperty("text","additionalLanguageLinkModel>/NO_OF_ADDITIONAL_LANGUAGES",function(sValue){
						return that.oApplicationFacade.getResourceBundle().getText("ADDITIONAL_LANGUAGE")+"("+sValue+")";
					});

				}, function(err) {
				});

			}

			if(oEvent.getParameter("name") === "addTile" || oEvent.getParameter("name") === "editTile") {

				that.inSufficientAdditionalMeasureAlerted = false;
				that.inSufficientAdditionalMeasure = false;

				that.byId("semanticObjectText").setValueState("None");
				that.byId("selectODD").setValueState("None");
				that.byId("tileTitle").setValueState("None");
				that.byId("tileSubtitle").setValueState("None");
				that.byId("appPropertyName").setValueState("None");
				that.byId("appPropertyValue").setValueState("None");
				that.byId("selectStoryId").setValueState("None");

				this.getSelectedRadioButton(null, "GDD");

				this.appMode = oEvent.getParameter("name");

				this.context = new sap.ui.model.Context(view.getModel(), '/' + oEvent.getParameter("arguments").contextPath);
				view.setBindingContext(this.context);

				this.tileConfigurationModel = new sap.ui.model.json.JSONModel();
				this.byId("tileConfigForm").setModel(this.tileConfigurationModel,"tileConfig");
				this.tileConfigurationModel.setData({});

				this.appParametersModel = new sap.ui.model.json.JSONModel();
				this.getView().byId('propertyNameValueBox').setModel(this.appParametersModel, "appParameters");

				this.additionalLanguageLinkModel = new sap.ui.model.json.JSONModel();
				this.getView().byId('additionalLanguageLink').setModel(this.additionalLanguageLinkModel,"additionalLanguageLinkModel");

				that.localLanguage = that.languagesObject.LAISO[sap.ui.getCore().getConfiguration().getLocale().getLanguage().split("-")[0].toUpperCase()];
				
				// handling for bookmark cases
				if(this.context.getObject()) {
					this.onAfterContextData(this.context.getObject());
				}
				else {
					this.oApplicationFacade.getODataModel().read("/" + oEvent.getParameter("arguments").contextPath, null, null, true, function(data) {
						that.onAfterContextData(data);
					}, function(err){
						sap.suite.smartbusiness.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("FAILED_TO_READ_CHIP_INFO"), err.response.body);
					});
				}

				that.oApplicationFacade.getODataModel().read(oEvent.getParameter("arguments").contextPath + "/VALUES",null,null,false,function(data) {
					that.evaluationDetails = that.evaluationDetails || {};
					that.evaluationDetails.VALUES = [];
					var evaluationValuesObj = {};
					var obj = {};
					for(var i=0,l=data.results.length; i<l; i++) {
						obj = {};
						obj.TYPE = data.results[i].TYPE;
						obj.FIXED = data.results[i].FIXED;
						obj.COLUMN_NAME = data.results[i].COLUMN_NAME;
						obj.ODATA_PROPERTY = data.results[i].ODATA_PROPERTY;
						that.evaluationDetails.VALUES.push(obj);
						evaluationValuesObj[obj.TYPE] = obj;
					}
					var measureObj = {Measures:[]};
					if(that.evaluationObj) {
						measureObj = {Measures:[{COLUMN_NAME:that.evaluationObj.COLUMN_NAME}]};
					}
					i=0;
					while(evaluationValuesObj[((i<10) ? ("0" + i) : i)]) {
						measureObj.Measures.push({COLUMN_NAME: evaluationValuesObj[((i<10) ? ("0" + i) : i)].COLUMN_NAME});
						i++;
					}

					if(measureObj.Measures.length < 2) {
						that.inSufficientAdditionalMeasure = true;
					} 

					that.customMeasuresModel = new sap.ui.model.json.JSONModel();
					that.customMeasuresModel.setData(measureObj);
					
					var measureObjOpt = jQuery.extend(true, {}, measureObj, {});
					
					that.customMeasuresModel1 = new sap.ui.model.json.JSONModel();
					that.customMeasuresModel1.setData(measureObjOpt);

				}, function(err) {
					sap.suite.smartbusiness.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("YMSG_ERROR_RETRIEVING_DATA"), err.response.body);
				});

				that.oApplicationFacade.getODataModel().read(oEvent.getParameter("arguments").contextPath + "/FILTERS",null,null,true,function(data) {
					that.evaluationDetails = that.evaluationDetails || {};
					that.evaluationDetails.FILTERS = [];
					var obj = {};
					for(var i=0,l=data.results.length; i<l; i++) {
						obj = {};
						obj.TYPE = data.results[i].TYPE;
						obj.NAME = data.results[i].NAME;
						obj.VALUE_1 = data.results[i].VALUE_1;
						obj.OPERATOR = data.results[i].OPERATOR;
						obj.VALUE_2 = data.results[i].VALUE_2;
						that.evaluationDetails.FILTERS.push(obj);
					}
				}, function(err) {
					sap.suite.smartbusiness.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("YMSG_ERROR_RETRIEVING_DATA"), err.response.body);
				}); 
			}

			if(oEvent.getParameter("name") == "editTile") {
				this.chipContext = new sap.ui.model.Context(view.getModel(), '/' + oEvent.getParameter("arguments").chipContextPath);

				that.oApplicationFacade.getODataModel().read(oEvent.getParameter("arguments").chipContextPath + "/TEXTS",null,null,true,function(languageData) {
					languageData = languageData.results;
					var additionalLanguageData = [];
					var i;
					for(i=0;i<languageData.length;i++){
						if(languageData[i].language != that.localLanguage){
							additionalLanguageData.push(languageData[i]);
						}
					}
					var languageArray = [];
					var i;
					for(i=0;i<additionalLanguageData.length;i++){
						var languageObject = {};
						languageObject.ADDITIONAL_LANGUAGE_TITLE = additionalLanguageData[i].title;
						languageObject.ADDITIONAL_LANGUAGE_DESCRIPTION = additionalLanguageData[i].description;
						languageObject.ADDITIONAL_SAP_LANGUAGE_KEY = additionalLanguageData[i].language;
						languageObject.ADDITIONAL_LANGUAGE_KEY = that.languagesObject.SPRAS[languageObject.ADDITIONAL_SAP_LANGUAGE_KEY]
						languageArray.push(languageObject);
					}
					that.oldLanguagePayload = $.extend(true,[],additionalLanguageData);
					that.additionalLanguageLinkModel.setProperty("/ADDITIONAL_LANGUAGE_ARRAY",languageArray);
					that.additionalLanguageLinkModel.setProperty("/NO_OF_ADDITIONAL_LANGUAGES",that.additionalLanguageLinkModel.getData().ADDITIONAL_LANGUAGE_ARRAY.length);
					that.byId('additionalLanguageLink').bindProperty("text","additionalLanguageLinkModel>/NO_OF_ADDITIONAL_LANGUAGES",function(sValue){
						return that.oApplicationFacade.getResourceBundle().getText("ADDITIONAL_LANGUAGE")+"("+sValue+")";
					});

				}, function(err) {
				});

				//handling for bookmark cases
				if(this.chipContext.getObject()) {
					this.onAfterChipContextData(this.chipContext.getObject());
				}
				else {
					this.oApplicationFacade.getODataModel().read(oEvent.getParameter("arguments").chipContextPath, null, null, true, function(data) {
						delete data.DDA_CONFIGURATIONS;
						delete data.EVALUATION_INFO;
						delete data.TEXTS;
						delete data.__metadata;
						that.onAfterChipContextData(data);
					}, function(err){
						sap.suite.smartbusiness.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("FAILED_TO_READ_CHIP_INFO"), err.response.body);
					});
				}
			}

		}, this);
	},

	getHeaderFooterOptions : function() {
		var that = this;
		this.oHeaderFooterOptions = {
				bSuppressBookmarkButton: {},
				onBack: function() {
					that.handleBackAndCancel();
				},
				oEditBtn : {
					sI18nBtnTxt : "SAVE",
					onBtnPressed : function(evt) {
						var configuration = that.formChipConfiguration();
						var serviceStatus = that.publishChip(configuration);
						if(serviceStatus) {
							that.oApplicationFacade.getODataModel().refresh();
							sap.suite.smartbusiness.utils.replaceHash({action:"configureSBKPITile", route:"detail", context: that.context.sPath.substr(1)});
						}
					}
				},
				buttonList : []
		};

		return this.oHeaderFooterOptions;
	},

	getSelectedRadioButton : function(oEvent, confirmationType) {
		var bindingContext = this.getView().getBindingContext();
		if((oEvent && oEvent.mParameters.selected) || confirmationType){
			this.confirmationType = (oEvent) ? oEvent.getSource().data("drilldownType") : confirmationType;
			if (this.confirmationType === 'GDD') {
				this.getView().byId('selectNavType').setVisible(false);
				this.getView().byId('selectStoryId').setVisible(false);
				this.getView().byId('semanticObjectText').setVisible(false);
				this.getView().byId('selectODD').setVisible(false);
				this.getView().byId('propertyNameValueBoxHeader').setVisible(false);
				this.getView().byId('propertyNameValueBox').setVisible(false);
				if(this.tileConfigurationModel && this.tileConfigurationModel.getData()) {
					this.tileConfigurationModel.getData().semanticObject = this.onLoadSemanticObject;
					this.tileConfigurationModel.getData().action = this.sbAction;
					this.tileConfigurationModel.getData().navType = "0";
				}
			} else if (this.confirmationType === 'ODD') {
				this.getView().byId('selectNavType').setVisible(true);
				this.getView().byId('selectStoryId').setVisible(true);
				this.getView().byId('selectODD').setVisible(true);
				this.getView().byId('semanticObjectText').setVisible(true);
				this.getView().byId('selectODD').setVisible(true);
				this.getView().byId('propertyNameValueBoxHeader').setVisible(true);
				this.getView().byId('propertyNameValueBox').setVisible(true);
				if(this.tileConfigurationModel && this.tileConfigurationModel.getData()) {
					this.tileConfigurationModel.getData().navType = (Number(this.tileConfigurationModel.getData().navType)) ? this.tileConfigurationModel.getData().navType : "1";
				}
				this.getView().byId('selectNavType').setSelectedKey(this.tileConfigurationModel.getData().navType);
				this.selectNavType(null, this.tileConfigurationModel.getData().navType);
			}
		}
	},

	selectTileType:function(oEvent){
		this.tileConfigurationModel.getData().tileType = oEvent.getSource().getSelectedKey();
		this.selectTile(oEvent.getSource().getSelectedItem().getKey());
	},

	onTileSelect: function(oEvent){
		this.tileType = oEvent.getSource().data("tileType");
		this.selectTile(this.tileType);
		this.getView().byId('selectTileType').setSelectedKey(this.tileType);
		this.tileConfigurationModel.getData().tileType = this.getView().byId('selectTileType').getSelectedKey();
	},

	selectTile: function(key){
		this.getView().byId('NT').$().css("border","solid 2px " + sap.ui.core.theming.Parameters.get("sapUiWhite"));
		this.getView().byId('CT').$().css("border","solid 2px " + sap.ui.core.theming.Parameters.get("sapUiWhite"));
		this.getView().byId('TT').$().css("border","solid 2px " + sap.ui.core.theming.Parameters.get("sapUiWhite"));
		this.getView().byId('AT').$().css("border","solid 2px " + sap.ui.core.theming.Parameters.get("sapUiWhite"));
		this.getView().byId('CM').$().css("border","solid 2px " + sap.ui.core.theming.Parameters.get("sapUiWhite"));
		this.getView().byId(key).$().css("border","solid 2px " + sap.ui.core.theming.Parameters.get("sapUiHighlight"));
		if(key === "NT"){
			this.getView().byId('selectDimension').setVisible(false);
			this.getView().byId('selectSortOrder').setVisible(false);
			this.getView().byId('measure1Layout').setVisible(false);
			this.getView().byId('measure2Layout').setVisible(false);
			this.getView().byId('measure3Layout').setVisible(false);
		} else if(key === "CT"){
			this.getView().byId('selectDimension').setVisible(true);
			this.getView().byId('selectSortOrder').setVisible(true);
			this.getView().byId('measure1Layout').setVisible(false);
			this.getView().byId('measure2Layout').setVisible(false);
			this.getView().byId('measure3Layout').setVisible(false);
		} else if(key === "TT"){
			this.getView().byId('selectDimension').setVisible(true);
			this.getView().byId('selectSortOrder').setVisible(false);
			this.getView().byId('measure1Layout').setVisible(false);
			this.getView().byId('measure2Layout').setVisible(false);
			this.getView().byId('measure3Layout').setVisible(false);
		} else if(key === "AT") {
			this.getView().byId('selectDimension').setVisible(false);
			this.getView().byId('selectSortOrder').setVisible(false);
			this.getView().byId('measure1Layout').setVisible(false);
			this.getView().byId('measure2Layout').setVisible(false);
			this.getView().byId('measure3Layout').setVisible(false);
		}
		else if(key === "CM") {
			if(this.inSufficientAdditionalMeasure && !(this.inSufficientAdditionalMeasureAlerted)) {
				sap.m.MessageToast.show(this.oApplicationFacade.getResourceBundle().getText("INSUFFICIENT_ADDL_MEASURES"));
				this.inSufficientAdditionalMeasureAlerted = true;
			}

			this.getView().byId('selectDimension').setVisible(false);
			this.getView().byId('selectSortOrder').setVisible(false);
			this.getView().byId('measure1Layout').setVisible(true);
			this.getView().byId('measure2Layout').setVisible(true);
			this.getView().byId('measure3Layout').setVisible(true);
		}
	},

	selectSortOrder:function(oEvent){
		this.tileConfigurationModel.getData().sortOrder = oEvent.getSource().getSelectedKey();
	},

	selectNavType:function(oEvent, key){
		if(oEvent) {
			key = oEvent.getSource().getSelectedKey();
		}
		this.tileConfigurationModel.getData().navType = key;
		this.byId("selectNavType").setSelectedKey(key);

		switch(Number(key)) {
		case 1: //@Bring up Lumira Content
			this.getView().byId("selectStoryId").setVisible(true);
			this.tileConfigurationModel.getData().semanticObject = this.lumiraSemanticObject;
			this.getView().byId("semanticObjectText").setValue(this.lumiraSemanticObject);
			this.tileConfigurationModel.getData().action = this.lumiraAction;
			this.getView().byId("selectODD").setValue(this.lumiraAction);
			break;
		case 2: //@Bring up APF Content
			this.getView().byId("selectStoryId").setVisible(false);
			this.tileConfigurationModel.getData().semanticObject = this.apfSemanticObject;
			this.getView().byId("semanticObjectText").setValue(this.apfSemanticObject);
			this.tileConfigurationModel.getData().action = this.apfAction;
			this.getView().byId("selectODD").setValue(this.apfAction);
			break;
		case 3: //@Bring up CXO Content
			this.tileConfigurationModel.getData().semanticObject = this.tempSemanticObject || this.evaluationObj.semanticObject || "";
			this.getView().byId("semanticObjectText").setValue(this.tileConfigurationModel.getData().semanticObject);
			this.tileConfigurationModel.getData().action = this.tempAction || this.evaluationObj.action || "";
			this.getView().byId("selectODD").setValue(this.tileConfigurationModel.getData().action);
			break;
		case 4: //@Bring up Custom DrillDown
			this.getView().byId("selectStoryId").setVisible(false);
			this.tileConfigurationModel.getData().semanticObject = this.tempSemanticObject || this.evaluationObj.semanticObject || "";
			this.getView().byId("semanticObjectText").setValue(this.tempSemanticObject || this.evaluationObj.semanticObject || "");
			this.tileConfigurationModel.getData().action = this.tempAction || this.evaluationObj.action || "";
			this.getView().byId("selectODD").setValue(this.tempAction || this.evaluationObj.action || "");
			break;
		default: break;
		}
	},

	formChipConfiguration: function() {
		var that = this;
		var payload = {};
		var data = this.tileConfigurationModel.getData();
		var configuration = null;
		var tileConfig = {};
		var tileProperties = {};

		//chip properties
		payload.id = data.id || "";
		this.currentChipId = payload.id;
		payload.isActive = 0;
		payload.catalogId = 'HANA_CATALOG';
		payload.title = data.title;
		payload.description = data.description;
		payload.tileType = data.tileType;
		payload.evaluationId = data.evaluationId;
		payload.url = payload.url || this.getChipUrl(payload.tileType);
		payload.keywords = data.keywords;

		if(data.changedOn) {
			payload.changedOn = data.changedOn;
		}

		// TILE_PROPERTIES in configuration
		tileProperties.id = data.id || "";
		tileProperties.evaluationId = data.evaluationId; 
		tileProperties.tileType = data.tileType;
		if(data.tileType == 'CT') {
			tileProperties.dimension = data.dimension || this.byId("selectDimension").getSelectedKey();
			tileProperties.sortOrder = data.sortOrder || this.byId("selectSortOrder").getSelectedKey();
		}
		if(data.tileType == 'TT') {
			tileProperties.dimension = data.dimension || this.byId("selectDimension").getSelectedKey();
		}

		var evaluation = this.getView().getBindingContext().getObject() || this.evaluationObj;

		tileProperties.frameType = 'OneByOne';
		if(this.byId("genericDrilldown").getSelected()) { 
			tileProperties.navType = "0";
			tileProperties.semanticObject = (data.semanticObject && (data.semanticObject.length != (data.semanticObject.split(" ").length - 1))) ? data.semanticObject : evaluation.COLUMN_NAME;
			tileProperties.semanticAction = this.sbAction;
		}
		else {
			tileProperties.navType = data.navType || this.byId("selectNavType").getSelectedKey(); 
			if(tileProperties.navType == "1") {
				tileProperties.storyId = data.storyId || this.byId("selectStoryId").getValue();
			}
			else {
				delete data.storyId;
			}
			tileProperties.semanticObject = data.semanticObject || this.byId("semanticObjectText").getValue();
			tileProperties.semanticAction = data.action || this.byId("selectODD").getValue();
		}
		//tileProperties.navType = data.navType; 
		tileConfig.ADDITIONAL_APP_PARAMETERS = {};

		var appParameters = this.byId("propertyNameValueBox").getModel("appParameters").getData();
		if(appParameters.PROPERTIES && appParameters.PROPERTIES.length) {
			for(var i=0,l=appParameters.PROPERTIES.length; i<l; i++) {
				tileConfig.ADDITIONAL_APP_PARAMETERS[appParameters.PROPERTIES[i].NAME] = appParameters.PROPERTIES[i].VALUE; 
			}
		}

		tileConfig.ADDITIONAL_APP_PARAMETERS = Object.keys(tileConfig.ADDITIONAL_APP_PARAMETERS).length ? JSON.stringify(tileConfig.ADDITIONAL_APP_PARAMETERS) : JSON.stringify({});

		tileConfig.TILE_PROPERTIES = JSON.stringify(tileProperties);


		// EVALUATION_FILTERS properties in configuration
		tileConfig.EVALUATION_FILTERS =   this.evaluationDetails.FILTERS.length ? JSON.stringify(this.evaluationDetails.FILTERS) : JSON.stringify([]);

		// EVALUATION_VALUES properties in configuration
		tileConfig.EVALUATION_VALUES =    this.evaluationDetails.VALUES.length ? JSON.stringify(this.evaluationDetails.VALUES) : JSON.stringify([]);

		// EVALUATION properties in configuration
		this.evaluationDetails.EVALUATION = {};
		this.evaluationDetails.EVALUATION.ID = evaluation.ID;
		this.evaluationDetails.EVALUATION.INDICATOR = evaluation.INDICATOR;
		this.evaluationDetails.EVALUATION.INDICATOR_TYPE = evaluation.INDICATOR_TYPE;
		this.evaluationDetails.EVALUATION.INDICATOR_TITLE = evaluation.INDICATOR_TITLE;
		this.evaluationDetails.EVALUATION.GOAL_TYPE = evaluation.GOAL_TYPE;
		this.evaluationDetails.EVALUATION.TITLE = evaluation.TITLE;
		this.evaluationDetails.EVALUATION.SCALING = evaluation.SCALING;
		this.evaluationDetails.EVALUATION.ODATA_URL = evaluation.ODATA_URL;
		this.evaluationDetails.EVALUATION.ODATA_ENTITYSET = evaluation.ODATA_ENTITYSET;
		this.evaluationDetails.EVALUATION.VIEW_NAME = evaluation.VIEW_NAME;

		if(data.tileType == 'CM') {
			this.evaluationDetails.EVALUATION.COLUMN_NAMES = [];
			var customMeasures = this.getView().getModel("multiMeasures").getData();
			if(customMeasures && customMeasures.MULTI_MEASURE) {
				customMeasures = customMeasures.MULTI_MEASURE; 
			}
			this.evaluationCustomMeasureArray = [];
			for(var i=0,l=customMeasures.length; i<l; i++) {
				if(customMeasures[i].COLUMN_NAME) {
					this.evaluationDetails.EVALUATION.COLUMN_NAMES.push({COLUMN_NAME:customMeasures[i].COLUMN_NAME, semanticColor:customMeasures[i].semanticColor});
					this.evaluationCustomMeasureArray.push({COLUMN_NAME:customMeasures[i].COLUMN_NAME, semanticColor:customMeasures[i].semanticColor});
				}
				else {
					this.evaluationCustomMeasureArray.push({COLUMN_NAME:null, semanticColor:null});
				}
			}
		}
		this.evaluationDetails.EVALUATION.COLUMN_NAME = evaluation.COLUMN_NAME;
		this.evaluationDetails.EVALUATION.OWNER_NAME = evaluation.OWNER_NAME; 
		this.evaluationDetails.EVALUATION.VALUES_SOURCE = evaluation.VALUES_SOURCE;

		tileConfig.EVALUATION = this.evaluationDetails.EVALUATION ? JSON.stringify(this.evaluationDetails.EVALUATION) : JSON.stringify({});

		configuration = JSON.stringify({tileConfiguration:JSON.stringify(tileConfig), isSufficient:"1", timeStamp:Date.now().toString()});

		var tileConfigLimit = 4050;
		if(payload.id) {
			tileConfigLimit = 4096;
		}
		
		if(configuration.length > tileConfigLimit) {
			tileConfig.EVALUATION_FILTERS = JSON.stringify([]);  
			configuration = JSON.stringify({tileConfiguration:JSON.stringify(tileConfig), isSufficient:"0", timeStamp:Date.now().toString()});
			if(configuration.length > tileConfigLimit) {
				tileConfig.EVALUATION_VALUES = JSON.stringify([]);
				tileConfig.EVALUATION_FILTERS = JSON.stringify([]);
				configuration = JSON.stringify({tileConfiguration:JSON.stringify(tileConfig), isSufficient:"0", timeStamp:Date.now().toString()});
			}
		}

		payload.configuration = configuration;

		return payload;
	},

	publishChip: function(payload) {
		var serviceStatus = true;
		var that = this;
		payload.keywords = payload.keywords || "";
		delete payload.navType;
		delete payload.semanticObject;
		delete payload.action;
		this.chipTextPayload = [];
		var batchOperations = [];
		this.deleteBatch = [];
		this.createBatch = [];
		var isUpdatesSuccessful = true;

		var oDataModel = this.oApplicationFacade.getODataModel();

		if(this.appMode == "addTile") {
			//odata write
//			oDataModel.create("/CHIPS",payload, null, function(data) {
//				if(that.additionalLanguageLinkModel.getData().NO_OF_ADDITIONAL_LANGUAGES) {
//					for(var i=0;i<that.additionalLanguageLinkModel.getData().NO_OF_ADDITIONAL_LANGUAGES;i++){
//						var chipTextObject = {};
//						that.oApplicationFacade.getODataModel().read("/LANGUAGE?$filter=LAISO eq '" +encodeURIComponent(that.additionalLanguageLinkModel.getData().ADDITIONAL_LANGUAGE_ARRAY[i].ADDITIONAL_LANGUAGE_KEY)  + "'", null, null, false, function(data){
//							chipTextObject.language = data.results[0].SPRAS;
//						});
//						chipTextObject.title = that.additionalLanguageLinkModel.getData().ADDITIONAL_LANGUAGE_ARRAY[i].ADDITIONAL_LANGUAGE_TITLE;
//						chipTextObject.description = that.additionalLanguageLinkModel.getData().ADDITIONAL_LANGUAGE_ARRAY[i].ADDITIONAL_LANGUAGE_DESCRIPTION;
//						chipTextObject.id = payload.id;
//						chipTextObject.isActive = 0;
//						that.chipTextPayload.push(chipTextObject);
//						batchOperations.push(oDataModel.createBatchOperation("/CHIP_TEXTS","POST",chipTextObject));
//					}
//					oDataModel.addBatchChangeOperations(batchOperations);
//					oDataModel.submitBatch(function(data,response,errorResponse){
//						if(errorResponse.length)
//						{       
//							isUpdatesSuccessful = false;
//							return;
//						}
//						var responses = data.__batchResponses[0].__changeResponses;
//						for(var key in responses)
//							if(responses[key].statusCode != "201" && responses[key].statusCode != "204" && responses[key].statusCode != "200") {
//								isUpdatesSuccessful = false;      
//							}
//						if(isUpdatesSuccessful) {
//							sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("TILE_SAVED_SUCCESSFULLY"));
//						}
//					},function(error){
//						isUpdatesSuccessful = false;
//						sap.suite.smartbusiness.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("ERROR_SAVING_TILE"), err.response.body);
//					},false);
//				}
//				else {
//					sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("TILE_SAVED_SUCCESSFULLY"));
//				}
//
//			}, function(err) {
//				sap.suite.smartbusiness.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("ERROR_SAVING_TILE"), err.response.body);
//			});
			
			//xsjs write
			var finalPayload = [];
			if(that.additionalLanguageLinkModel.getData().NO_OF_ADDITIONAL_LANGUAGES) {
				for(var i=0;i<that.additionalLanguageLinkModel.getData().NO_OF_ADDITIONAL_LANGUAGES;i++){
					var chipTextObject = {};
					chipTextObject.title = that.additionalLanguageLinkModel.getData().ADDITIONAL_LANGUAGE_ARRAY[i].ADDITIONAL_LANGUAGE_TITLE;
					chipTextObject.description = that.additionalLanguageLinkModel.getData().ADDITIONAL_LANGUAGE_ARRAY[i].ADDITIONAL_LANGUAGE_DESCRIPTION;
					chipTextObject.id = payload.id;
					chipTextObject.language = that.additionalLanguageLinkModel.getData().ADDITIONAL_LANGUAGE_ARRAY[i].ADDITIONAL_SAP_LANGUAGE_KEY;
					chipTextObject.isActive = 0;
					that.chipTextPayload.push(chipTextObject);
				}
			}
			finalPayload.push({id:payload.id, isActive:payload.isActive, CHIP:payload, TEXTS:that.chipTextPayload});
			sap.suite.smartbusiness.utils.create(sap.suite.smartbusiness.utils.serviceUrl("CHIP_SERVICE_URI"),finalPayload,null,function(data) {
				serviceStatus = true;
				that.currentChipId = JSON.parse(data).response[0].id;
				sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("TILE_SAVED_SUCCESSFULLY"));
			},function(err){
				serviceStatus = false;
				sap.suite.smartbusiness.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("ERROR_SAVING_TILE"), err.responseText);
			});
		}
		else {
			if(this.currentContextState) {
				//odata create
//				oDataModel.create("/CHIPS",payload, null,  function(data) {
//					if(that.additionalLanguageLinkModel.getData().NO_OF_ADDITIONAL_LANGUAGES) {
//						for(var i=0;i<that.additionalLanguageLinkModel.getData().NO_OF_ADDITIONAL_LANGUAGES;i++){
//							var chipTextObject = {};
//							that.oApplicationFacade.getODataModel().read("/LANGUAGE?$filter=LAISO eq '" +encodeURIComponent(that.additionalLanguageLinkModel.getData().ADDITIONAL_LANGUAGE_ARRAY[i].ADDITIONAL_LANGUAGE_KEY)  + "'", null, null, false, function(data){
//								chipTextObject.language = data.results[0].SPRAS;
//							});
//							chipTextObject.title = that.additionalLanguageLinkModel.getData().ADDITIONAL_LANGUAGE_ARRAY[i].ADDITIONAL_LANGUAGE_TITLE;
//							chipTextObject.description = that.additionalLanguageLinkModel.getData().ADDITIONAL_LANGUAGE_ARRAY[i].ADDITIONAL_LANGUAGE_DESCRIPTION;
//							chipTextObject.id = payload.id;
//							chipTextObject.isActive = 0;
//							that.chipTextPayload.push(chipTextObject);
//							batchOperations.push(oDataModel.createBatchOperation("/CHIP_TEXTS","POST",chipTextObject));
//						}
//						oDataModel.addBatchChangeOperations(batchOperations);
//						oDataModel.submitBatch(function(data,response,errorResponse){
//							if(errorResponse.length)
//							{       
//								isUpdatesSuccessful = false;
//								return;
//							}
//							var responses = data.__batchResponses[0].__changeResponses;
//							for(var key in responses)
//								if(responses[key].statusCode != "201" && responses[key].statusCode != "204" && responses[key].statusCode != "200") {
//									isUpdatesSuccessful = false;      
//								}
//							if(isUpdatesSuccessful) {
//								sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("TILE_EDITED_SUCCESSFULLY"));
//							}
//						},function(error){
//							isUpdatesSuccessful = false;
//							sap.suite.smartbusiness.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("ERROR_SAVING_TILE"), err.response.body);
//						},false);
//					}
//					else{
//						sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("TILE_EDITED_SUCCESSFULLY"));
//					}
//				}, function(err) {
//					sap.suite.smartbusiness.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("ERROR_SAVING_TILE"), err.response.body);
//				});
				
				//xsjs write
				var finalPayload = [];
				if(that.additionalLanguageLinkModel.getData().NO_OF_ADDITIONAL_LANGUAGES) {
					for(var i=0;i<that.additionalLanguageLinkModel.getData().NO_OF_ADDITIONAL_LANGUAGES;i++){
						var chipTextObject = {};
						chipTextObject.title = that.additionalLanguageLinkModel.getData().ADDITIONAL_LANGUAGE_ARRAY[i].ADDITIONAL_LANGUAGE_TITLE;
						chipTextObject.description = that.additionalLanguageLinkModel.getData().ADDITIONAL_LANGUAGE_ARRAY[i].ADDITIONAL_LANGUAGE_DESCRIPTION;
						chipTextObject.id = payload.id;
						chipTextObject.language = that.additionalLanguageLinkModel.getData().ADDITIONAL_LANGUAGE_ARRAY[i].ADDITIONAL_SAP_LANGUAGE_KEY;
						chipTextObject.isActive = 0;
						that.chipTextPayload.push(chipTextObject);
					}
				}
				finalPayload.push({id:payload.id, isActive:payload.isActive, CHIP:payload, TEXTS:that.chipTextPayload});
				sap.suite.smartbusiness.utils.create(sap.suite.smartbusiness.utils.serviceUrl("CHIP_SERVICE_URI"),finalPayload,null,function(data) {
					serviceStatus = true;
					sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("TILE_SAVED_SUCCESSFULLY"));
				},function(err){
					serviceStatus = false;
					sap.suite.smartbusiness.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("ERROR_SAVING_TILE"), err.responseText);
				});
			}
			else {
				//odata update
//				oDataModel.update(this.chipContext.sPath,payload, null,  function(data) {
//					if(that.additionalLanguageLinkModel.getData().NO_OF_ADDITIONAL_LANGUAGES || that.oldLanguagePayload) {
//						for(var i=0;i<that.additionalLanguageLinkModel.getData().NO_OF_ADDITIONAL_LANGUAGES;i++){
//							var chipTextObject = {};
//							that.oApplicationFacade.getODataModel().read("/LANGUAGE?$filter=LAISO eq '" +encodeURIComponent(that.additionalLanguageLinkModel.getData().ADDITIONAL_LANGUAGE_ARRAY[i].ADDITIONAL_LANGUAGE_KEY)  + "'", null, null, false, function(data){
//								chipTextObject.language = data.results[0].SPRAS;
//							});
//							chipTextObject.title = that.additionalLanguageLinkModel.getData().ADDITIONAL_LANGUAGE_ARRAY[i].ADDITIONAL_LANGUAGE_TITLE;
//							chipTextObject.description = that.additionalLanguageLinkModel.getData().ADDITIONAL_LANGUAGE_ARRAY[i].ADDITIONAL_LANGUAGE_DESCRIPTION;
//							chipTextObject.id = payload.id;
//							chipTextObject.isActive = payload.isActive;
//							that.chipTextPayload.push(chipTextObject);
//						}
//
//						that.languagePayloadForDirtyBitTest = []; 
//
//						for(var i=0;i<that.oldLanguagePayload.length;i++){
//							var textObject = {};
//							textObject.id = payload.id;
//							textObject.language = that.oldLanguagePayload[i].language;
//							textObject.isActive = that.oldLanguagePayload[i].isActive;
//							textObject.description = that.oldLanguagePayload[i].description;
//							textObject.title= that.oldLanguagePayload[i].title;
//							that.languagePayloadForDirtyBitTest.push(textObject);
//						}
//
//						var languageDeltaObject = sap.suite.smartbusiness.utils.dirtyBitCheck({
//							oldPayload : that.languagePayloadForDirtyBitTest,
//							newPayload : that.chipTextPayload,
//							objectType : "CHIP_TEXTS"
//						});
//
//						if(languageDeltaObject){
//							if(languageDeltaObject.deletes.length){
//								var i;
//								for(i=0;i<languageDeltaObject.deletes.length;i++){
//									that.deleteBatch.push(oDataModel.createBatchOperation("/CHIP_TEXTS(id='"+languageDeltaObject.deletes[i].id+"',isActive="+languageDeltaObject.deletes[i].isActive+",language='"+languageDeltaObject.deletes[i].language+"')","DELETE"));
//								}
//							}
//							if(languageDeltaObject.updates.length){
//								var i;
//								for(i=0;i<languageDeltaObject.updates.length;i++){
//									that.createBatch.push(oDataModel.createBatchOperation("/CHIP_TEXTS","POST",languageDeltaObject.updates[i]));
//								}
//							}
//
//							if(that.deleteBatch.length){
//								oDataModel.addBatchChangeOperations(that.deleteBatch);
//								oDataModel.submitBatch(function(data,response,errorResponse){
//									if(errorResponse.length)
//									{       
//										isUpdatesSuccessful = false;
//										return;
//									}
//									var responses = data.__batchResponses[0].__changeResponses;
//									for(var key in responses)
//										if(responses[key].statusCode != "201" && responses[key].statusCode != "204" && responses[key].statusCode != "200") {
//											isUpdatesSuccessful = false;      
//										}
//									if(isUpdatesSuccessful) {
//										if(that.createBatch.length){
//											oDataModel.addBatchChangeOperations(that.createBatch);
//											oDataModel.submitBatch(function(data,response,errorResponse){
//												if(errorResponse.length)
//												{       
//													isUpdatesSuccessful = false;
//													return;
//												}
//												var responses = data.__batchResponses[0].__changeResponses;
//												for(var key in responses)
//													if(responses[key].statusCode != "201" && responses[key].statusCode != "204" && responses[key].statusCode != "200") {
//														isUpdatesSuccessful = false;      
//													}
//												if(isUpdatesSuccessful) {
//													sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("TILE_EDITED_SUCCESSFULLY"));
//												}
//											},function(error){
//												isUpdatesSuccessful = false;
//												sap.suite.smartbusiness.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("ERROR_SAVING_TILE"), err.response.body);
//											},false);
//										}
//										else{
//											sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("TILE_EDITED_SUCCESSFULLY"));
//										}
//									}
//								},function(error){
//									isUpdatesSuccessful = false;
//									sap.suite.smartbusiness.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("ERROR_SAVING_TILE"), err.response.body);
//								},false);
//							}
//							else{
//								if(that.createBatch.length){
//									oDataModel.addBatchChangeOperations(that.createBatch);
//									oDataModel.submitBatch(function(data,response,errorResponse){
//										if(errorResponse.length)
//										{       
//											isUpdatesSuccessful = false;
//											return;
//										}
//										var responses = data.__batchResponses[0].__changeResponses;
//										for(var key in responses)
//											if(responses[key].statusCode != "201" && responses[key].statusCode != "204" && responses[key].statusCode != "200") {
//												isUpdatesSuccessful = false;      
//											}
//										if(isUpdatesSuccessful) {
//											sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("TILE_EDITED_SUCCESSFULLY"));
//										}
//									},function(error){
//										isUpdatesSuccessful = false;
//										sap.suite.smartbusiness.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("ERROR_SAVING_TILE"), err.response.body);
//									},false);
//								}
//
//							}
//						}
//					}
//					else{
//						sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("TILE_EDITED_SUCCESSFULLY"));
//					}
//				}, function(err) {
//					sap.suite.smartbusiness.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("ERROR_SAVING_TILE"),err.response.body);
//				});
				
				//xsjs update
				var finalPayload = [];
				if(that.additionalLanguageLinkModel.getData().NO_OF_ADDITIONAL_LANGUAGES) {
					for(var i=0;i<that.additionalLanguageLinkModel.getData().NO_OF_ADDITIONAL_LANGUAGES;i++){
						var chipTextObject = {};
						chipTextObject.title = that.additionalLanguageLinkModel.getData().ADDITIONAL_LANGUAGE_ARRAY[i].ADDITIONAL_LANGUAGE_TITLE;
						chipTextObject.description = that.additionalLanguageLinkModel.getData().ADDITIONAL_LANGUAGE_ARRAY[i].ADDITIONAL_LANGUAGE_DESCRIPTION;
						chipTextObject.id = payload.id;
						chipTextObject.language = that.additionalLanguageLinkModel.getData().ADDITIONAL_LANGUAGE_ARRAY[i].ADDITIONAL_SAP_LANGUAGE_KEY;
						chipTextObject.isActive = 0;
						that.chipTextPayload.push(chipTextObject);
					}
				}
				that.languagePayloadForDirtyBitTest = []; 
				for(var i=0;i<that.oldLanguagePayload.length;i++){
					var textObject = {};
					textObject.id = payload.id;
					textObject.language = that.oldLanguagePayload[i].language;
					textObject.isActive = that.oldLanguagePayload[i].isActive;
					textObject.description = that.oldLanguagePayload[i].description;
					textObject.title= that.oldLanguagePayload[i].title;
					that.languagePayloadForDirtyBitTest.push(textObject);
				}
				var languageDeltaObject = sap.suite.smartbusiness.utils.dirtyBitCheck({
					oldPayload : that.languagePayloadForDirtyBitTest,
					newPayload : that.chipTextPayload,
					objectType : "CHIP_TEXTS"
				});
				var textsUpdatePayload = {remove:[],create:[]};
				if(languageDeltaObject) {
					if(languageDeltaObject.deletes.length){
						for(var i=0;i<languageDeltaObject.deletes.length;i++){
							textsUpdatePayload.remove.push(languageDeltaObject.deletes[i]);
						}
					}
					if(languageDeltaObject.updates.length){
						for(var i=0;i<languageDeltaObject.updates.length;i++){
							that.createBatch.push(oDataModel.createBatchOperation("/CHIP_TEXTS","POST",languageDeltaObject.updates[i]));
							textsUpdatePayload.create.push(languageDeltaObject.updates[i]);
						}
					}
				}
				finalPayload.push({id:payload.id, isActive:payload.isActive, CHIP:{update:payload}, TEXTS:textsUpdatePayload});
				sap.suite.smartbusiness.utils.update(sap.suite.smartbusiness.utils.serviceUrl("CHIP_SERVICE_URI"),finalPayload,null,function(data) {
					serviceStatus = true;
					sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("TILE_SAVED_SUCCESSFULLY"));
				},function(err){
					serviceStatus = false;
					sap.suite.smartbusiness.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("ERROR_SAVING_TILE"), err.responseText);
				}); 
			}
		}
		return serviceStatus;
	},

	getChipUrl: function(tileType) {
		var chipUrls = {
				"NT" : "/sap/bc/ui5_ui5/ui2/ushell/resources/sap/ushell/components/tiles/indicatornumeric/NumericTileChip.xml",
				"CT" : "/sap/bc/ui5_ui5/ui2/ushell/resources/sap/ushell/components/tiles/indicatorcontribution/ContributionTileChip.xml",
				"TT" : "/sap/bc/ui5_ui5/ui2/ushell/resources/sap/ushell/components/tiles/indicatorArea/AreaChartTileChip.xml",
				"AT" : "/sap/bc/ui5_ui5/ui2/ushell/resources/sap/ushell/components/tiles/indicatordeviation/DeviationTileChip.xml",
				"CM" : "/sap/bc/ui5_ui5/ui2/ushell/resources/sap/ushell/components/tiles/indicatorcomparison/ComparisonTileChip.xml"
		}
		return chipUrls[tileType];
	},

	populateDimension : function(dataSource, entitySet) {
		dataSource = this.validateQueryServiceURI(dataSource) + "";
		entitySet = entitySet + "";
		var dimensions = [], dimensionDataArray = [], obj = {};
		var i;
		dimensions = sap.suite.smartbusiness.odata.getAllDimensions(dataSource, entitySet);
		for (i = 0; i < dimensions.length; i++) {
			obj = {};
			obj.dimensionName = dimensions[i];
			dimensionDataArray.push(obj);
		}
		var oModel = new sap.ui.model.json.JSONModel();
		oModel.setData({
			dimensions : dimensionDataArray
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

	handleDimensionSelectionChange: function(evt) {
		this.tileConfigurationModel.getData().dimension = evt.getSource().getSelectedItem().getKey();
	},

	setGenericDrillDown: function(navType) {
		return (navType == 0) ? true : false;
	},

	setOtherDrillDown: function(navType) {
		if(navType > 0) {
			this.getView().byId('selectODD').setVisible(true);
		} 
		else {
			this.getView().byId('selectODD').setVisible(false);
		}
		return (navType > 0) ? true : false;
	},

	onAfterContextData: function(contextObj) {
		var that = this; 
		this.evaluationObj = contextObj;

		if(this.customMeasuresModel && this.customMeasuresModel.getData()) {
			var customMeasures = this.customMeasuresModel.getData();
			customMeasures.Measures.unshift({COLUMN_NAME: this.evaluationObj.COLUMN_NAME});
			this.customMeasuresModel.setData(customMeasures);
		}
		
		if(this.customMeasuresModel1 && this.customMeasuresModel1.getData()) {
			var customMeasures1 = this.customMeasuresModel1.getData();
			customMeasures1.Measures.unshift({COLUMN_NAME: this.evaluationObj.COLUMN_NAME});
			this.customMeasuresModel1.setData(customMeasures1);
		}

		try {
			this.oModelForEntity = this.populateDimension(contextObj.ODATA_URL, contextObj.ODATA_ENTITYSET);
			this.tileConfigurationModel.getData().dimension = this.oModelForEntity.getData().dimensions[0].dimensionName;
			this.initialData = jQuery.extend(true, {}, this.tileConfigurationModel.getData(), {});
		} catch (err) {

		} finally {
			if (this.oModelForEntity.getData().dimensions.length) {
				this.getView().byId("selectDimension").setModel(this.oModelForEntity, "populateDimension");
			} else {
				sap.suite.smartbusiness.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("UNABLE_TO_FETCH_NAVIG"));
			}
		}

		if(this.appMode == "addTile") {
			that.selectTile('NT');
			that.getView().byId('NT').$().css("border","solid 2px " + sap.ui.core.theming.Parameters.get("sapUiHighlight"));
			
			that.currentLocaleLanguage = that.languagesObject.LAISO[sap.ui.getCore().getConfiguration().getLanguage().split("-")[0].toUpperCase()];

			var texts_entity = "/EVALUATIONS_CHIP_TEXTS?$filter=ID eq '" + contextObj.ID + "' and IS_ACTIVE eq 1"; 

			that.oApplicationFacade.getODataModel().read(texts_entity,null,null,true,function(data) {
				that.evaluationDetails = that.evaluationDetails || {};
				that.evaluationDetails.TEXTS = [];
				var obj = {};
				for(var i=0,l=data.results.length; i<l; i++) {
					obj = {};
					obj.language = data.results[i].LANGUAGE;
					obj.title = data.results[i].TITLE;
					obj.description = data.results[i].DESCRIPTION;
					that.evaluationDetails.TEXTS.push(obj);
				}
			}, function(err) {
				sap.suite.smartbusiness.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("YMSG_ERROR_RETRIEVING_DATA"), err.response.body);
			});

			this.updateFooterButtons(null);   
			this.tileConfigurationModel.setData({evaluationId:contextObj.ID,title:contextObj.INDICATOR_TITLE,description:contextObj.TITLE,semanticObject:(contextObj.SEMANTIC_OBJECT || ''),action:(contextObj.ACTION || ''),storyId:'',tileType:'NT',navType:0});
			this.initialData = jQuery.extend(true, {}, this.tileConfigurationModel.getData(), {});
			
			this.tempSemanticObject = contextObj.SEMANTIC_OBJECT || "";
			this.onLoadSemanticObject = this.tempSemanticObject;
			this.tempAction = contextObj.ACTION || "";
			
			var multiMeasureModel = new sap.ui.model.json.JSONModel();
			multiMeasureModel.setData({MULTI_MEASURE:[{COLUMN_NAME:that.evaluationObj.COLUMN_NAME,semanticColor:"Error"},{COLUMN_NAME:"",semanticColor:"Critical"},{COLUMN_NAME:"",semanticColor:"Good"}]});
			this.getView().setModel(multiMeasureModel,"multiMeasures");

		}
	},

	onAfterChipContextData: function(contextObj) {
		var that = this;
		this.currentContextState = contextObj.isActive;
		this.currentChipId = contextObj.id;

		this.updateFooterButtons(contextObj);
		if(this.appMode == "editTile") {
			var configuration = JSON.parse(contextObj.configuration);
			var appParameters = [];
			if(JSON.parse(configuration.tileConfiguration).ADDITIONAL_APP_PARAMETERS) {
				appParameters = JSON.parse(JSON.parse(configuration.tileConfiguration).ADDITIONAL_APP_PARAMETERS);
			}

			var evaluation = {};
			var multiMeasures = {MULTI_MEASURE:[]}
			if(JSON.parse(configuration.tileConfiguration).EVALUATION) {
				evaluation = JSON.parse(JSON.parse(configuration.tileConfiguration).EVALUATION);
				var multiMeasureModel = new sap.ui.model.json.JSONModel();
				if(evaluation.COLUMN_NAMES && evaluation.COLUMN_NAMES.length) {
					for(var i=0,l=evaluation.COLUMN_NAMES.length; i<l; i++) {
						multiMeasures.MULTI_MEASURE.push({COLUMN_NAME:evaluation.COLUMN_NAMES[i].COLUMN_NAME, semanticColor:evaluation.COLUMN_NAMES[i].semanticColor});
					}
					if(multiMeasures.MULTI_MEASURE && multiMeasures.MULTI_MEASURE.length == 2) {
						multiMeasures.MULTI_MEASURE.push({COLUMN_NAME:"", semanticColor:"Good"});
					}
					multiMeasureModel.setData(multiMeasures);
					this.getView().setModel(multiMeasureModel,"multiMeasures");
				}
				else {
					multiMeasureModel.setData({MULTI_MEASURE:[{COLUMN_NAME:that.evaluationObj.COLUMN_NAME,semanticColor:"Error"},{COLUMN_NAME:"",semanticColor:"Critical"},{COLUMN_NAME:"",semanticColor:"Good"}]});
					this.getView().setModel(multiMeasureModel,"multiMeasures");
				}

			}

			var tileProperties = JSON.parse(JSON.parse(configuration.tileConfiguration).TILE_PROPERTIES); 

			contextObj.semanticObject = tileProperties.semanticObject;
			that.onLoadSemanticObject = contextObj.semanticObject;
			contextObj.action = tileProperties.semanticAction;
			
			this.tempSemanticObject = contextObj.semanticObject || "";
			this.tempAction = contextObj.action || "";
			
			contextObj.navType = tileProperties.navType || "0";
			contextObj.sortOrder = tileProperties.sortOrder || undefined;
			contextObj.dimension = tileProperties.dimension || undefined;
			
			if(contextObj.navType.toString() == "1") {
				this.lumiraSemanticObject = contextObj.semanticObject;
				this.lumiraAction = contextObj.action;
				this.apfSemanticObject = this.APF_SEMANTIC_OBECT;
				this.apfAction = this.APF_ACTION;
			}
			else if(contextObj.navType.toString() == "2") {
				this.apfSemanticObject = contextObj.semanticObject;
				this.apfAction = contextObj.action;
				this.lumiraSemanticObject = this.LUMIRA_SEMANTIC_OBECT;
				this.lumiraAction = this.LUMIRA_ACTION;
			}
			else {
				this.apfSemanticObject = this.APF_SEMANTIC_OBECT;
				this.apfAction = this.APF_ACTION;
				this.lumiraSemanticObject = this.LUMIRA_SEMANTIC_OBECT;
				this.lumiraAction = this.LUMIRA_ACTION;
			}

			this.byId('selectTileType').setSelectedKey(contextObj.tileType);
			this.selectTile(contextObj.tileType);

			if(Number(contextObj.navType) == 1) {
				contextObj.storyId = tileProperties.storyId;
			}
			else {
				contextObj.storyId = "";
			}

			this.tileConfigurationModel.setData(contextObj);
			this.initialData = jQuery.extend(true, {}, this.tileConfigurationModel.getData(), {});

			if(Number(contextObj.navType)) {
				this.byId("selectNavType").setSelectedKey(contextObj.navType);
				this.getSelectedRadioButton(null,"ODD");
			}
			else {
				this.getSelectedRadioButton(null,"GDD");
			}

			//this.handleSemanticObjectChange(null, contextObj.semanticObject);

			var parametersJson = [];

			if(appParameters && Object.keys(appParameters).length) {
				for(var key in appParameters) {
					if(appParameters.hasOwnProperty(key)) {
						parametersJson.push({NAME:key, VALUE:appParameters[key]});
					}
				}
			}
			this.byId("propertyNameValueBox").getModel("appParameters").setData({PROPERTIES:parametersJson});
			this.initialAppParameters = jQuery.extend(true, [], (this.appParametersModel.getData().PROPERTIES || []));
		}
	},

	addNewProperty : function() {
		var that = this;
		if (this.getView().byId("appPropertyName").getValue()) {
			this.getView().byId("appPropertyName").setValueState("None");
			if (this.getView().byId("appPropertyValue").getValue()) {
				this.getView().byId("appPropertyValue").setValueState("None");
				var propertyModel = this.getView().byId('propertyNameValueBox').getModel("appParameters");
				propertyModel.getData().PROPERTIES = propertyModel.getData().PROPERTIES || [];
				if(this.checkForDuplicateProperty()) {
					propertyModel.getData().PROPERTIES.push({
						NAME : this.getView().byId("appPropertyName").getValue(),
						VALUE : this.getView().byId("appPropertyValue").getValue()
					});
					propertyModel.updateBindings();
					this.getView().byId("appPropertyName").setValue("");
					this.getView().byId("appPropertyValue").setValue("");
				}
			} else {
				this.getView().byId("appPropertyValue").setValueState("Error");
				this.getView().byId("appPropertyValue").setValueStateText(this.oApplicationFacade.getResourceBundle().getText("ENTER_PROPERTY_VALUE"));
				sap.m.MessageToast.show(this.oApplicationFacade.getResourceBundle().getText("ENTER_PROPERTY_VALUE"));
			}
		} else {
			this.getView().byId("appPropertyName").setValueState("Error");
			this.getView().byId("appPropertyName").setValueStateText(this.oApplicationFacade.getResourceBundle().getText("ENTER_PROPERTY_NAME"));
			sap.m.MessageToast.show(this.oApplicationFacade.getResourceBundle().getText("ENTER_PROPERTY_NAME"));
		}
	},

	removeProperty : function(evt) { 
		var path = evt.getSource().getBindingContext("appParameters").getPath();
		evt.getSource().getBindingContext("appParameters").getModel().getData().PROPERTIES.splice(path.substring(path.lastIndexOf("/") + 1), 1);
		evt.getSource().getBindingContext("appParameters").getModel().updateBindings();
	},

	getAllFooterButtons: function() {
		var that = this;
		var buttonsList = [
		                   {
		                	   sI18nBtnTxt : that.oApplicationFacade.getResourceBundle().getText("DELETE_DRAFT"),
		                	   onBtnPressed : function(evt) {
		                		   sap.m.MessageBox.show(
		                				   that.oApplicationFacade.getResourceBundle().getText("WANT_TO_DELETE_SELECTED_TILE"),
		                				   "sap-icon://hint",
		                				   that.oApplicationFacade.getResourceBundle().getText("DELETE"),
		                				   [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL ],
		                				   function(evt){
		                					   if(evt=="OK"){
		                						   //odata remove
//		                						   that.oApplicationFacade.getODataModel().remove(that.chipContext.sPath,null,function(data) {
//		                							   sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("DELETION_SUCCESSFUL"));
//		                							   that.oApplicationFacade.getODataModel().refresh();
//		                							   that.oRouter.navTo("detail",{
//		                								   contextPath: that.context.sPath.substr(1)
//		                							   });
//		                						   },function(err){
//		                							   sap.suite.smartbusiness.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("DELETION_FAILED"), err.response.body);
//		                						   });
		                						   
		                						   //xsjs remove
		                						   sap.suite.smartbusiness.utils.remove(sap.suite.smartbusiness.utils.serviceUrl("CHIP_SERVICE_URI"),{id:that.currentChipId,isActive:that.currentContextState},function(data) {
		                							   sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("DELETION_SUCCESSFUL"));
		                							   that.oApplicationFacade.getODataModel().refresh();
		                							   sap.suite.smartbusiness.utils.replaceHash({action:"configureSBKPITile", route:"detail", context: that.context.sPath.substr(1)});
		                						   },function(err){
		                							   sap.suite.smartbusiness.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("DELETION_FAILED"), err.response.body);
		                						   });
		                					   }
		                					   if(evt=="CANCEL"){

		                					   }
		                				   }
		                		   );
		                	   },
		                   }, {
		                	   sI18nBtnTxt : that.oApplicationFacade.getResourceBundle().getText("SAVE") + ' and ' + that.oApplicationFacade.getResourceBundle().getText("ACTIVATE"),
		                	   onBtnPressed : function(evt) {
		                		   var data = that.tileConfigurationModel.getData();
		                		   var errorLog = "";
		                		   var configuration = null;

		                		   if((!(data.semanticObject) && Number(data.navType) != 0) || ((data.semanticObject.length == (data.semanticObject.split(" ").length - 1)) && Number(data.navType) != 0)  || (!(data.action) && Number(data.navType) != 0)   || ((data.action.length == (data.action.split(" ").length - 1)) && Number(data.navType) != 0) || !(data.title) || !(data.description) || (!(data.storyId) && Number(data.navType) == 1) || ((data.storyId.length == (data.storyId.split(" ").length - 1)) && Number(data.navType) == 1) || (data.title.length == (data.title.split(" ").length - 1)) || (data.description.length == (data.description.split(" ").length - 1))) {

		                			   if(((!(data.semanticObject) || (data.semanticObject.length == (data.semanticObject.split(" ").length - 1))) && (Number(data.navType) != 0))) {
		                				   errorLog += that.oApplicationFacade.getResourceBundle().getText("ERROR_ENTER_SEMANTIC_OBJECT") + "\n";
		                				   that.byId("semanticObjectText").setValueState("Error");
		                				   that.byId("semanticObjectText").setValueStateText(that.oApplicationFacade.getResourceBundle().getText("ERROR_ENTER_SEMANTIC_OBJECT"));
		                			   }
		                			   if(((!(data.action) || (data.action.length == (data.action.split(" ").length - 1))) && (Number(data.navType) != 0))) {
		                				   errorLog += that.oApplicationFacade.getResourceBundle().getText("ERROR_ENTER_SEMANTIC_ACTION") + "\n";
		                				   that.byId("selectODD").setValueState("Error");
		                				   that.byId("selectODD").setValueStateText(that.oApplicationFacade.getResourceBundle().getText("ERROR_ENTER_SEMANTIC_ACTION"));
		                			   }
		                			   if(((!(data.storyId) || (data.storyId.length == (data.storyId.split(" ").length - 1))) && (Number(data.navType) == 1))) {
		                				   errorLog += that.oApplicationFacade.getResourceBundle().getText("ERROR_ENTER_STORY_ID") + "\n";
		                				   that.byId("selectStoryId").setValueState("Error");
		                				   that.byId("selectStoryId").setValueStateText(that.oApplicationFacade.getResourceBundle().getText("ERROR_ENTER_STORY_ID"));
		                			   }
		                			   if(!(data.title) || (data.title.length == (data.title.split(" ").length - 1))) {
		                				   errorLog += that.oApplicationFacade.getResourceBundle().getText("ERROR_ENTER_TITLE") + "\n";
		                				   that.byId("tileTitle").setValueState("Error");
		                				   that.byId("tileTitle").setValueStateText(that.oApplicationFacade.getResourceBundle().getText("ERROR_ENTER_TITLE"));
		                			   }
		                			   if(!(data.description) || (data.description.length == (data.description.split(" ").length - 1))) {
		                				   errorLog += that.oApplicationFacade.getResourceBundle().getText("ERROR_ENTER_DESCRIPTION");
		                				   that.byId("tileSubtitle").setValueState("Error");
		                				   that.byId("tileSubtitle").setValueStateText(that.oApplicationFacade.getResourceBundle().getText("ERROR_ENTER_DESCRIPTION"));
		                			   } 
		                			   sap.suite.smartbusiness.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("ACTIVATION_ERROR"), errorLog);
		                		   }
		                		   else {
		                			   configuration = that.formChipConfiguration();
		                			   if(data.tileType == "CM") {
		                				   var evaluation = JSON.parse(JSON.parse(JSON.parse(configuration.configuration).tileConfiguration).EVALUATION);
		                				   if(!(that.evaluationCustomMeasureArray) || !(that.evaluationCustomMeasureArray.length)) {
		                					   errorLog += that.oApplicationFacade.getResourceBundle().getText("ERROR_ENTER_THREE_MEASURES");
		                				   }
		                				   else {
		                					   for(var i=0,l=2; i<l; i++) {
		                						   if(!(that.evaluationCustomMeasureArray[i].COLUMN_NAME) || !(that.evaluationCustomMeasureArray[i].semanticColor)) {
		                							   errorLog += that.oApplicationFacade.getResourceBundle().getText("ERROR_ENTER_THREE_MEASURES");
		                							   break;
		                						   }
		                					   }
		                					   if((!errorLog) && (that.evaluationCustomMeasureArray.length == 3)) {
		                						   if(that.evaluationCustomMeasureArray[2].COLUMN_NAME && that.evaluationCustomMeasureArray[2].semanticColor) {
		                							   if(evaluation.COLUMN_NAMES[0].COLUMN_NAME == evaluation.COLUMN_NAMES[1].COLUMN_NAME) {
			                							   errorLog += that.oApplicationFacade.getResourceBundle().getText("ERROR_DUPLICATE_MEASURE_THREE_MEASURES");
			                						   } 
			                						   else if(that.evaluationCustomMeasureArray[0].COLUMN_NAME == that.evaluationCustomMeasureArray[2].COLUMN_NAME) {
			                							   errorLog += that.oApplicationFacade.getResourceBundle().getText("ERROR_DUPLICATE_MEASURE_THREE_MEASURES");
			                						   }
			                						   else if(that.evaluationCustomMeasureArray[1].COLUMN_NAME == that.evaluationCustomMeasureArray[2].COLUMN_NAME) {
			                							   errorLog += that.oApplicationFacade.getResourceBundle().getText("ERROR_DUPLICATE_MEASURE_THREE_MEASURES");
			                						   }
		                						   }
		                						   else {
		                							   that.evaluationCustomMeasureArray.pop();
		                							   if(that.evaluationCustomMeasureArray[0].COLUMN_NAME == that.evaluationCustomMeasureArray[1].COLUMN_NAME) {
			                							   errorLog += that.oApplicationFacade.getResourceBundle().getText("ERROR_DUPLICATE_MEASURE_THREE_MEASURES");
			                						   }
		                						   }
		                					   }

		                				   }
		                			   }
		                			   if(errorLog) {
		                				   sap.suite.smartbusiness.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("ACTIVATION_ERROR"), errorLog);
		                			   }
		                			   else {
		                				   var serviceStatus = that.publishChip(configuration);
		                				   //odata write
//		                				   that.oApplicationFacade.getODataModel().create("/ACTIVE_CHIPS",{id:that.currentChipId},null,function(data) {
//		                					   sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("ACTIVATION_SUCCESSFUL"));
//		                					   that.oApplicationFacade.getODataModel().refresh();
//		                					   that.oRouter.navTo("detail",{
//		                						   contextPath: that.context.sPath.substr(1)
//		                					   });
//		                				   },function(err){
//		                					   sap.suite.smartbusiness.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("ACTIVATION_ERROR"), err.response.body);
//		                				   });
		                				   
		                				   //xsjs create
		                				   if(serviceStatus) {
		                					   sap.suite.smartbusiness.utils.create(sap.suite.smartbusiness.utils.serviceUrl("ACTIVATE_CHIP_SERVICE_URI"),{id:that.currentChipId},null,function(data) {
		                						   sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("ACTIVATION_SUCCESSFUL"));
		                						   that.oApplicationFacade.getODataModel().refresh();
		                						   sap.suite.smartbusiness.utils.replaceHash({action:"configureSBKPITile", route:"detail", context: that.context.sPath.substr(1)});
		                					   },function(err){
		                						   sap.suite.smartbusiness.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("ACTIVATION_ERROR"), err.responseText);
		                					   });
		                				   }
		                				   
		                			   }
		                		   }
		                	   },
		                   },{
		                	   sI18nBtnTxt : "CONFIG_DRILLDOWN",
		                	   onBtnPressed : function(evt) {
		                		   sap.suite.smartbusiness.utils.appToAppNavigation({action: "configureSBKPIDrilldown", route: "detail", context: ("EVALUATIONS_DDA('"+that.getView().getBindingContext().getProperty("ID")+"')")});
		                	   }
		                   }, {
		                	   sI18nBtnTxt : "SAVE_CREATE_NEW",
		                	   onBtnPressed : function(evt) {
		                		   var configuration = that.formChipConfiguration();
		                		   var serviceStatus = that.publishChip(configuration);

		                		   if(serviceStatus) {
		                			   if(that.appMode == "addTile") {
			                			   var hashObj = hasher || window.hasher;
			                			   var currentHash = hasher.getHash();
			                			   //sap.suite.smartbusiness.utils.hashChange({hash: "#FioriApplication-configureSBKPITile"});
			                			   sap.suite.smartbusiness.utils.appToAppNavigation({action: "configureSBKPITile"});
			                			   setTimeout(function(){
			                				   sap.suite.smartbusiness.utils.hashChange({hash: currentHash});
			                			   },0);
			                		   }
			                		   else {
			                			   sap.suite.smartbusiness.utils.replaceHash({action:"configureSBKPITile", route:"addTile", context: that.context.sPath.substr(1)});
			                		   }
		                		   }
		                	   }
		                   }, {
		                	   sI18nBtnTxt : "CANCEL",
		                	   onBtnPressed : function(evt) {
		                		   that.handleBackAndCancel();
		                	   }
		                   }

		                   ];
		return buttonsList;

	},

	updateFooterButtons: function(chipObj) {
		var buttonsList = this.getAllFooterButtons();
		this.oHeaderFooterOptions.buttonList = [];

		if(chipObj) {
			if((!(chipObj.isActive)) && (this.appMode == "editTile")) {
				this.oHeaderFooterOptions.buttonList.push(buttonsList[0]);
			}
		}
		for(var i=1,l=buttonsList.length; i<l; i++) {
			if(i==2) {
				if(chipObj && (chipObj.isActive == 1)) {
					this.oHeaderFooterOptions.buttonList.push(buttonsList[i]);
				}
			}
			else {
				this.oHeaderFooterOptions.buttonList.push(buttonsList[i]);
			}

		}

		this.setHeaderFooterOptions(this.oHeaderFooterOptions);
	},

	checkForDuplicateProperty: function() {
		var that = this;
		var properties = this.getView().byId('propertyNameValueBox').getModel("appParameters").getData().PROPERTIES;
		var property = this.getView().byId("appPropertyName").getValue();
		var value = this.getView().byId("appPropertyValue").getValue();
		if(!isNaN(Number(property))) {
			this.getView().byId("appPropertyName").setValueState("Error");
			this.getView().byId("appPropertyName").setValueStateText(that.oApplicationFacade.getResourceBundle().getText("ERROR_PROPERTY_NOT_STRING"));
			sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("ERROR_PROPERTY_NOT_STRING"));
			return false;
		}
		for(var i=0,l=properties.length; i<l; i++) {
			if((properties[i].NAME == property)) {
				if(properties[i].NAME == property) {
					this.getView().byId("appPropertyName").setValueState("Error");
					this.getView().byId("appPropertyName").setValueStateText(that.oApplicationFacade.getResourceBundle().getText("ERROR_MULTIPLE_VALUES_FOR_PROPERTY"));
					sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("ERROR_MULTIPLE_VALUES_FOR_PROPERTY"));
				}
				return false;
			} 
		}
		return true;
	},

	inputNameChange: function(evt) {
		var that = this;
		var property = evt.getSource().getValue();
		var index = Number(evt.getSource().getBindingContext("appParameters").sPath[evt.getSource().getBindingContext("appParameters").sPath.length - 1]);
		var properties = this.getView().byId('propertyNameValueBox').getModel("appParameters").getData().PROPERTIES;
		for(var i=0,l=properties.length; i<l; i++) {
			if(i == index) {
				continue;
			}
			if(properties[i].NAME == property) {
				evt.getSource().setValueState("Error");
				evt.getSource().setValueStateText(that.oApplicationFacade.getResourceBundle().getText("ERROR_MULTIPLE_VALUES_FOR_PROPERTY"));
				sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("ERROR_MULTIPLE_VALUES_FOR_PROPERTY"));
				return;
			}
		}
		evt.getSource().setValueState("None");
	},

	inputValueChange: function(evt) {
		var that = this;
		var value = evt.getSource().getValue();
		var property = evt.getSource().getBindingContext("appParameters").getObject().NAME;
		var index = Number(evt.getSource().getBindingContext("appParameters").sPath[evt.getSource().getBindingContext("appParameters").sPath.length - 1]);
		var properties = this.getView().byId('propertyNameValueBox').getModel("appParameters").getData().PROPERTIES;
		for(var i=0,l=properties.length; i<l; i++) {
			if(i == index) {
				continue;
			}
			if(properties[i].NAME == property && properties[i].VALUE == value) {
				evt.getSource().setValueState("Error");
				evt.getSource().setValueStateText(that.oApplicationFacade.getResourceBundle().getText("ERROR_DUPLICATE_PROPERTY_VALUE"));
				sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("ERROR_DUPLICATE_PROPERTY_VALUE"));
			}
		}
	},

	onAfterRendering: function() {
		var that = this;
		if(this.appMode == "addTile") {
			this.getView().byId('NT').$().css("border","solid 2px " + sap.ui.core.theming.Parameters.get("sapUiHighlight"));
		}
		this.initialData = jQuery.extend(true, {}, this.tileConfigurationModel.getData(), {});
	},

	handleSemanticObjectChange: function(evt) {
		if(evt.getSource().getValue()) {
			evt.getSource().setValueState("None");
		}
		this.tempSemanticObject = evt.getSource().getValue();
		if(this.tileConfigurationModel.getData().navType.toString() == "2") {
			this.apfSemanticObject = evt.getSource().getValue();
		}
		if(this.tileConfigurationModel.getData().navType.toString() == "1") {
			this.lumiraSemanticObject = evt.getSource().getValue();
		}
		if(this.tileConfigurationModel.getData().navType.toString() == "0" || this.tileConfigurationModel.getData().navType.toString() == "4") {
			this.onLoadSemanticObject = evt.getSource().getValue();
		}
	},

	setSemanticAction: function(evt) {
		if(evt.getSource().getValue()) {
			evt.getSource().setValueState("None");
		}
		this.tempAction = evt.getSource().getValue();
		if(this.tileConfigurationModel.getData().navType.toString() == "2") {
			this.apfAction = evt.getSource().getValue();
		}
		if(this.tileConfigurationModel.getData().navType.toString() == "1") {
			this.lumiraAction = evt.getSource().getValue();
		}
	},

	subTitleChange: function(evt) {
		if(evt.getSource().getValue()) {
			evt.getSource().setValueState("None");
		}
	},

	titleChange: function(evt) {
		if(evt.getSource().getValue()) {
			evt.getSource().setValueState("None");
		}
	},

	appPropertyNameChange: function(evt) {
		if(evt.getSource().getValue()) {
			evt.getSource().setValueState("None");
		}
	},

	appPropertyValueChange: function(evt) {
		if(evt.getSource().getValue()) {
			evt.getSource().setValueState("None");
		}
	},

	setStoryId: function(evt) {
		if(evt.getSource().getValue()) {
			evt.getSource().setValueState("None");
		}
	},

	handleStoryIdValueHelp: function() {
		var that = this;
		var storyIdValueHelpDialog = new sap.m.SelectDialog({
			title : that.oApplicationFacade.getResourceBundle().getText("STORY_ID"),
			noDataText : that.oApplicationFacade.getResourceBundle().getText("NO_DATA_FOUND"),
			items : {
				path : "/Stories",
				template : new sap.m.StandardListItem({
					title : "{NAME}",
					description : "{UUID}"
				})
			},
			confirm : function(oEvent) {
				that.tileConfigurationModel.getData().storyId = oEvent.getParameter("selectedItem").getProperty("description");
				that.byId("selectStoryId").setValue(that.tileConfigurationModel.getData().storyId);
			},
			liveChange : function(oEvent) {
				var searchValue = "'" + oEvent.getParameter("value").toLowerCase() + "'";
				var oFilterPackage = new sap.ui.model.Filter("tolower(NAME)", sap.ui.model.FilterOperator.Contains,searchValue);
				var oFilterObject = new sap.ui.model.Filter("tolower(UUID)", sap.ui.model.FilterOperator.Contains,searchValue);
				var oBinding = oEvent.getSource().getBinding("items");
				oBinding.filter(new sap.ui.model.Filter([oFilterPackage, oFilterObject], false));
			}
		});
		storyIdValueHelpDialog.open();
		var oDataStoryIdModel = new sap.ui.model.odata.ODataModel("/sap/bi/launchpad/integration/smb.xsodata",true);
		storyIdValueHelpDialog.setModel(oDataStoryIdModel);
		if(this.evaluationObj.VIEW_NAME) {
			storyIdValueHelpDialog.getBinding("items").filter([new sap.ui.model.Filter("VIEW_NAME","EQ",this.evaluationObj.VIEW_NAME)]);
		}
	},

	handleCustomMeasure: function(evt) {
		var that = this;
		var currentInput = evt.getSource();
		this.customMeasuresDialog = new sap.m.SelectDialog({
			title : that.oApplicationFacade.getResourceBundle().getText("CHOOSE_ADDL_MEASURE"),
			noDataText : that.oApplicationFacade.getResourceBundle().getText("NO_DATA_FOUND"),
			items : {
				path : "additionalMeasures>/Measures",
				template : new sap.m.StandardListItem({
					title : "{additionalMeasures>COLUMN_NAME}"
				})
			},
			confirm : function(oEvent) {
				var value = oEvent.getParameter("selectedItem").getProperty("title");
				currentInput.setValue(value);
			},
			liveChange : function(oEvent) {
				var searchValue = "'" + oEvent.getParameter("value").toLowerCase() + "'";
				var oFilterPackage = new sap.ui.model.Filter("tolower(COLUMN_NAME)", sap.ui.model.FilterOperator.Contains,searchValue);
				var oBinding = oEvent.getSource().getBinding("items");
				oBinding.filter(new sap.ui.model.Filter([oFilterPackage], false));
			}
		});
		this.customMeasuresDialog.open();
		this.customMeasuresDialog.setModel(this.customMeasuresModel, "additionalMeasures");
	},
	handleCustomMeasure1: function(evt) {
		var that = this;
		var currentInput = evt.getSource();
		this.customMeasuresDialog1 = new sap.m.SelectDialog({
			title : that.oApplicationFacade.getResourceBundle().getText("CHOOSE_ADDL_MEASURE"),
			noDataText : that.oApplicationFacade.getResourceBundle().getText("NO_DATA_FOUND"),
			items : {
				path : "additionalMeasures1>/Measures",
				template : new sap.m.StandardListItem({
					title : "{additionalMeasures1>COLUMN_NAME}"
				})
			},
			confirm : function(oEvent) {
				var value = oEvent.getParameter("selectedItem").getProperty("title");
				currentInput.setValue(value);
			},
			liveChange : function(oEvent) {
				var searchValue = "'" + oEvent.getParameter("value").toLowerCase() + "'";
				var oFilterPackage = new sap.ui.model.Filter("tolower(COLUMN_NAME)", sap.ui.model.FilterOperator.Contains,searchValue);
				var oBinding = oEvent.getSource().getBinding("items");
				oBinding.filter(new sap.ui.model.Filter([oFilterPackage], false));
			}
		});
		this.customMeasuresDialog1.open();
		var modelData = this.customMeasuresModel1.getData();
		if(modelData.Measures[0].COLUMN_NAME !== "") {
			modelData.Measures.unshift({COLUMN_NAME:""})
		}
		this.customMeasuresModel1.setData(modelData);
		this.customMeasuresDialog1.setModel(this.customMeasuresModel1, "additionalMeasures1");
	},
	addAdditionalLanguageDialog : function(){

		var that=this;

		this.additionalLanguageListModel = new sap.ui.model.json.JSONModel();
		this.additionalLanguageListModelData = $.extend(true,{},this.additionalLanguageLinkModel.getData());
		this.additionalLanguageListModel.setData(that.additionalLanguageListModelData);

		this.languageTextInput = new sap.m.Input({
			layoutData : new sap.ui.layout.GridData({
				span : "L8 M8 S8"
			})
		});
		this.languageDescriptionInput = new sap.m.Input({
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
		}).setModel(that.additionalLanguageListModel,"additionalLanguageListModel");

		this.addedLanguagesList.bindItems("additionalLanguageListModel>/ADDITIONAL_LANGUAGE_ARRAY", new sap.m.CustomListItem({
			content : new sap.ui.layout.Grid({
				hSpacing: 1,
				vSpacing: 0,
				defaultSpan : "L12 M12 S12",
				content: [
				          new sap.m.Input({
				        	  value : "{additionalLanguageListModel>ADDITIONAL_LANGUAGE_TITLE}",
				        	  design : "Bold",
				        	  layoutData : new sap.ui.layout.GridData({
				        		  span : "L12 M12 S12",
				        		  vAlign : "Middle"
				        	  }),
				        	  editable : false
				          }),
				          new sap.m.Input({
				        	  value : "{additionalLanguageListModel>ADDITIONAL_LANGUAGE_DESCRIPTION}",
				        	  design : "Bold",
				        	  layoutData : new sap.ui.layout.GridData({
				        		  span : "L6 M6 S6",
				        		  vAlign : "Middle"
				        	  }),
				        	  editable : false
				          }),
				          new sap.m.Input({
				        	  value : "{additionalLanguageListModel>ADDITIONAL_LANGUAGE_KEY}",
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
				        		  var newData = that.addedLanguagesList.getModel("additionalLanguageListModel").getData().ADDITIONAL_LANGUAGE_ARRAY.splice(deletedIndex,1);
				        		  that.addedLanguagesList.getModel("additionalLanguageListModel").getData().NO_OF_ADDITIONAL_LANGUAGES = that.addedLanguagesList.getModel("additionalLanguageListModel").getData().ADDITIONAL_LANGUAGE_ARRAY.length;
				        		  that.addedLanguagesList.getModel("additionalLanguageListModel").updateBindings();
				        	  },
				        	  layoutData : new sap.ui.layout.GridData({
				        		  span : "L2 M2 S2"
				        	  })
				          })
				          ]
			})
		}));

		var additionalLanguageDialog = new sap.m.Dialog({
			contentHeight : "50%",
			contentWidth : "25%",
			title : that.oApplicationFacade.getResourceBundle().getText("ADDITIONAL_LANGUAGE"),
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
			            	        	            	 text : that.oApplicationFacade.getResourceBundle().getText("TITLE"),
			            	        	            	 textAlign : "Right",
			            	        	            	 layoutData : new sap.ui.layout.GridData({
			            	        	            		 span : "L3 M3 S3",
			            	        	            	 })
			            	        	             }),

			            	        	             that.languageTextInput,

			            	        	             new sap.m.Label({
			            	        	            	 text : that.oApplicationFacade.getResourceBundle().getText("SUB_TITLE"),
			            	        	            	 layoutData : new sap.ui.layout.GridData({
			            	        	            		 span : "L3 M3 S3",
			            	        	            	 })
			            	        	             }),

			            	        	             that.languageDescriptionInput,

			            	        	             new sap.m.Label({
			            	        	            	 text : that.oApplicationFacade.getResourceBundle().getText("LANGUAGE")+":",
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
			            	        	            			 for(var i=0;i<that.addedLanguagesList.getModel("additionalLanguageListModel").getData().ADDITIONAL_LANGUAGE_ARRAY.length;i++){
			            	        	            				 if(that.addedLanguagesList.getModel("additionalLanguageListModel").getData().ADDITIONAL_LANGUAGE_ARRAY[i].ADDITIONAL_LANGUAGE_KEY === that.languageKeySelect.getSelectedItem().getText()){
			            	        	            					 sap.suite.smartbusiness.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("ERROR_LANGUAGE_EXISTS",that.languageKeySelect.getSelectedItem().getText()));
			            	        	            					 return;
			            	        	            				 }
			            	        	            			 }
			            	        	            			 var addedLanguageObject = {
			            	        	            					 "ADDITIONAL_LANGUAGE_TITLE" : that.languageTextInput.getValue(),
			            	        	            					 "ADDITIONAL_LANGUAGE_DESCRIPTION" : that.languageDescriptionInput.getValue(),
			            	        	            					 "ADDITIONAL_LANGUAGE_KEY" : that.languageKeySelect.getSelectedItem().getText(),
			            	        	            					 "ADDITIONAL_SAP_LANGUAGE_KEY" : that.languageKeySelect.getSelectedKey()
			            	        	            			 };
			            	        	            			 that.addedLanguagesList.getModel("additionalLanguageListModel").getData().ADDITIONAL_LANGUAGE_ARRAY.push(addedLanguageObject);
			            	        	            			 that.addedLanguagesList.getModel("additionalLanguageListModel").getData().NO_OF_ADDITIONAL_LANGUAGES = that.addedLanguagesList.getModel("additionalLanguageListModel").getData().ADDITIONAL_LANGUAGE_ARRAY.length;
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

			            that.addedLanguagesList
			            ],

			            beginButton : new sap.m.Button({
			            	text : that.oApplicationFacade.getResourceBundle().getText("OK"),
			            	press : function(){
			            		that.additionalLanguageLinkModel.setData(that.additionalLanguageListModel.getData());
			            		that.additionalLanguageLinkModel.updateBindings();
			            		additionalLanguageDialog.close();
			            	}
			            }),
			            endButton : new sap.m.Button({
			            	text : that.oApplicationFacade.getResourceBundle().getText("CANCEL"),
			            	press : function(){
			            		additionalLanguageDialog.close();
			            	}
			            })
		});

		var data = this.languagesArray;
		
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
			key: "{otherLanguageKey>SPRAS}"
		}));

		additionalLanguageDialog.open();
	},
	
	handleBackAndCancel: function() {
		var that = this;
		var obj = {};
		obj.oldPayload = that.initialData;
		obj.newPayload = that.tileConfigurationModel.getData();
		obj.objectType = "Chips";
		obj = sap.suite.smartbusiness.utils.dirtyBitCheck(obj);
		that.chipTextPayload = [];
		if(that.additionalLanguageLinkModel.getData().NO_OF_ADDITIONAL_LANGUAGES) {
			for(var i=0;i<that.additionalLanguageLinkModel.getData().NO_OF_ADDITIONAL_LANGUAGES;i++){
				var chipTextObject = {};
				chipTextObject.title = that.additionalLanguageLinkModel.getData().ADDITIONAL_LANGUAGE_ARRAY[i].ADDITIONAL_LANGUAGE_TITLE;
				chipTextObject.description = that.additionalLanguageLinkModel.getData().ADDITIONAL_LANGUAGE_ARRAY[i].ADDITIONAL_LANGUAGE_DESCRIPTION;
				chipTextObject.language = that.additionalLanguageLinkModel.getData().ADDITIONAL_LANGUAGE_ARRAY[i].ADDITIONAL_SAP_LANGUAGE_KEY;
				that.chipTextPayload.push(chipTextObject);
			}
		}
		that.languagePayloadForDirtyBitTest = []; 
		for(var i=0;i<that.oldLanguagePayload.length;i++){
			var textObject = {};
			textObject.language = that.oldLanguagePayload[i].language;
			textObject.description = that.oldLanguagePayload[i].description;
			textObject.title= that.oldLanguagePayload[i].title;
			that.languagePayloadForDirtyBitTest.push(textObject);
		}
		var languageDeltaObject = sap.suite.smartbusiness.utils.dirtyBitCheck({
			oldPayload : that.languagePayloadForDirtyBitTest,
			newPayload : that.chipTextPayload,
			objectType : "CHIP_TEXTS"
		});
		
		var appParameters = sap.suite.smartbusiness.utils.dirtyBitCheck({
			oldPayload : that.initialAppParameters,
			newPayload : that.appParametersModel.getData().PROPERTIES || [],
			objectType : "APP_PARAMETERS"
		});
		
		if(obj.updates.length || languageDeltaObject.deletes.length || languageDeltaObject.updates.length || appParameters.deletes.length || appParameters.updates.length) {
			var backDialog = new sap.m.Dialog({
				icon:"sap-icon://warning2",
				title:that.oApplicationFacade.getResourceBundle().getText("WARNING"),
				state:"Error",
				type:"Message",
				content:[new sap.m.Text({text:that.oApplicationFacade.getResourceBundle().getText("ON_BACK_WARNING")})],
				beginButton: new sap.m.Button({
					text:that.oApplicationFacade.getResourceBundle().getText("CONTINUE"),
					press: function(){
						sap.suite.smartbusiness.utils.replaceHash({action:"configureSBKPITile", route:"detail", context: that.context.sPath.substr(1)});
					}
				}),
				endButton: new sap.m.Button({
					text:that.oApplicationFacade.getResourceBundle().getText("CANCEL"),
					press:function(){backDialog.close();}
				})                                              
			});
			backDialog.open();
		}
		else {
			sap.suite.smartbusiness.utils.replaceHash({action:"configureSBKPITile", route:"detail", context: that.context.sPath.substr(1)});
		}
	}
});

