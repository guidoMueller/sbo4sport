jQuery.sap.require("sap.ca.scfld.md.controller.BaseFullscreenController");
jQuery.sap.includeStyleSheet("../../resources/sap/suite/ui/smartbusiness/designtime/kpi/view/KpiParametersCss.css");

sap.ca.scfld.md.controller.BaseFullscreenController.extend("sap.suite.ui.smartbusiness.designtime.kpi.view.S1", {

	onInit : function() {
		var that = this;
		this.kpiCreateModel = new sap.ui.model.json.JSONModel();
		this.oDataModel = this.oApplicationFacade.getODataModel();
		this.viewData = {};
		this.oResourceBundle = this.oApplicationFacade.getResourceBundle();
		this.oDataModel.read("/LANGUAGE?$filter=LAISO eq '"+(sap.ui.getCore().getConfiguration().getLocale().getLanguage()).toUpperCase()+"'", null, null, false, function(data) {
			that.localLanguage = data.results[0].SPRAS;
		});

		var oOptions = {
				bSuppressBookmarkButton : {},
				onBack : function(){
					that.cancel();
				},
				oEditBtn : {
					sI18nBtnTxt : "SAVE",
					onBtnPressed : function(evt) {
						that.save();
					}
				},
				buttonList : [{
					sI18nBtnTxt : "SAVE_ACTIVATE",
					onBtnPressed : function(evt) {
						that.saveAndActivate();
					}
				},{
					sI18nBtnTxt : "SAVE_CREATE_NEW",
					onBtnPressed : function(evt) {
						that.saveAndCreateNew();
					}
				},{
					sI18nBtnTxt : "ACTIVATE_ADD_EVAL",
					onBtnPressed : function(evt) {
						that.activateAndAddEvaluation();
					}
				},{
					sI18nBtnTxt : "CANCEL",
					onBtnPressed : function(evt) {
						that.cancel();
					}
				}]
		};
		var editOptions = {
				bSuppressBookmarkButton : {},
				sI18NFullscreenTitle : "FULLSCREEN_EDIT_TITLE",
				onBack : function(){
					that.cancel();
				},
				oEditBtn : {
					sI18nBtnTxt : "SAVE",
					onBtnPressed : function(evt) {
						that.save();
					}
				},
				buttonList : [{
					sI18nBtnTxt : "SAVE_ACTIVATE",
					onBtnPressed : function(evt) {
						that.saveAndActivate();
					}
				},{
					sI18nBtnTxt : "SAVE_CREATE_NEW",
					onBtnPressed : function(evt) {
						that.saveAndCreateNew();
					}
				},{
					sI18nBtnTxt : "ACTIVATE_ADD_EVAL",
					onBtnPressed : function(evt) {
						that.activateAndAddEvaluation();
					}
				},{
					sI18nBtnTxt : "CANCEL",
					onBtnPressed : function(evt) {
						that.cancel();
					}
				}]
		};

		var editDraftOptions = {
				bSuppressBookmarkButton : {},
				sI18NFullscreenTitle : "FULLSCREEN_EDIT_TITLE",
				onBack : function(){
					that.cancel();
				},
				oEditBtn : {
					sI18nBtnTxt : "SAVE",
					onBtnPressed : function(evt) {
						that.save();
					}
				},
				buttonList : [{
					sI18nBtnTxt : "SAVE_ACTIVATE",
					onBtnPressed : function(evt) {
						that.saveAndActivate();
					}
				}, {
					sI18nBtnTxt : "DELETE_DRAFT",
					onBtnPressed : function(evt) {
						that.deleteDraft();
					}
				}, {
					sI18nBtnTxt : "CANCEL",
					onBtnPressed : function(evt) {
						that.cancel();
					}
				}]
		};

		this.setHeaderFooterOptions(oOptions);

		this.oRouter.attachRouteMatched(function(evt){
			that.route = evt.getParameter("name");
			if(evt.getParameter("name") == "editKpi"){
				that.context = new sap.ui.model.Context(that.getView().getModel(), '/' + (evt.getParameter("arguments").contextPath));

				var id = (/ID=\'.*\'/).exec(evt.getParameter("arguments").contextPath)[0];
				var kpiId = id.slice(id.indexOf("'")+1,id.lastIndexOf("'"));

				var active = (/IS_ACTIVE=.*/).exec(evt.getParameter("arguments").contextPath)[0];
				var is_active = active.slice(active.indexOf("=")+1,active.lastIndexOf(")"));

				that.viewData = {
						mode : "EDIT",
						ID : kpiId,
						IS_ACTIVE : parseInt(is_active)
				}
				if(that.viewData.IS_ACTIVE == 1){
					that.viewData.IS_DRAFT = true;
				}
				that.setHeaderFooterOptions(editOptions);
				that._oControlStore.oTitle.setText(that.oResourceBundle.getText("FULLSCREEN_DYN_TITLE", "Edit"));
				try {
                    if(sap.ushell.services.AppConfiguration && sap.ushell.services.AppConfiguration.setWindowTitle){
                            sap.ushell.services.AppConfiguration.setWindowTitle(that.oResourceBundle.getText("FULLSCREEN_EDIT_TITLE"));
                    }
                } catch(e){
                    jQuery.sap.log.error("Error Setting Window Page Title : "+that.oResourceBundle.getText("FULLSCREEN_EDIT_TITLE"))
                }
			}
			else if(evt.getParameter("name") == "editDraftKpi"){
				that.context = new sap.ui.model.Context(that.getView().getModel(), '/' + (evt.getParameter("arguments").contextPath));

				var id = (/ID=\'.*\'/).exec(evt.getParameter("arguments").contextPath)[0];
				var kpiId = id.slice(id.indexOf("'")+1,id.lastIndexOf("'"));

				var active = (/IS_ACTIVE=.*/).exec(evt.getParameter("arguments").contextPath)[0];
				var is_active = active.slice(active.indexOf("=")+1,active.lastIndexOf(")"));

				that.viewData = {
						mode : "EDIT",
						ID : kpiId,
						IS_ACTIVE : parseInt(is_active),
						IS_DRAFT : true
				}
				that.setHeaderFooterOptions(editDraftOptions);
				that._oControlStore.oTitle.setText(that.oResourceBundle.getText("FULLSCREEN_DYN_TITLE", "Edit"));
				try {
                    if(sap.ushell.services.AppConfiguration && sap.ushell.services.AppConfiguration.setWindowTitle){
                            sap.ushell.services.AppConfiguration.setWindowTitle(that.oResourceBundle.getText("FULLSCREEN_EDIT_TITLE"));
                    }
                } catch(e){
                    jQuery.sap.log.error("Error Setting Window Page Title : "+that.oResourceBundle.getText("FULLSCREEN_EDIT_TITLE"))
                }
			}
			else if(evt.getParameter("name") == "duplicateKpi"){
				that.context = new sap.ui.model.Context(that.getView().getModel(), '/' + (evt.getParameter("arguments").contextPath));

				var id = (/ID=\'.*\'/).exec(evt.getParameter("arguments").contextPath)[0];
				var kpiId = id.slice(id.indexOf("'")+1,id.lastIndexOf("'"));

				var active = (/IS_ACTIVE=.*/).exec(evt.getParameter("arguments").contextPath)[0];
				var is_active = active.slice(active.indexOf("=")+1,active.lastIndexOf(")"));

				that.viewData = {
						mode : "DUPLICATE",
						ID : kpiId,
						IS_ACTIVE : parseInt(is_active)
				}
				that._oControlStore.oTitle.setText(that.oResourceBundle.getText("FULLSCREEN_DYN_TITLE", "Duplicate"));
			}
			else{
				that.viewData = {
						mode : "CREATE",
				}
				that._oControlStore.oTitle.setText(that.oResourceBundle.getText("FULLSCREEN_DYN_TITLE", "Create"));
			}

			if (that.viewData.mode == "CREATE") {
				var kpiModelData = {};
				kpiModelData.MODE = "CREATE";
				kpiModelData.TYPE = "KPI";
				kpiModelData.KPITYPE = true;
				kpiModelData.OPITYPE = false;
				kpiModelData.NO_OF_ADDITIONAL_LANGUAGES = 0;
				kpiModelData.ADDITIONAL_LANGUAGE_ARRAY = [];
				kpiModelData.GOAL_TYPE = "MA";

				that.kpiModelDataForDirtyBitCheck = $.extend(true,{},kpiModelData);

				that.kpiCreateModel.setData(kpiModelData);
				that.getView().setModel(that.kpiCreateModel);
			} else if (that.viewData.mode == "EDIT" || that.viewData.mode == "DUPLICATE") {

				that.oDataModel.read("/INDICATORS(ID='" + that.viewData.ID  + "',IS_ACTIVE="	+ that.viewData.IS_ACTIVE + ")", null, null, false, function(indicatorData) {
					that.indicatorPayloadForDirtyBitTest = $.extend(true,{},indicatorData);

					indicatorData.MODE = that.viewData.mode;
					if (indicatorData.TYPE == "KPI") {
						indicatorData.KPITYPE = true;
						indicatorData.OPITYPE = false;
					} else if (indicatorData.TYPE == "OPI") {
						indicatorData.KPITYPE = false;
						indicatorData.OPITYPE = true;
					}

					that.oDataModel.read("/TAGS?$filter=ID eq '" + indicatorData.ID + "' and IS_ACTIVE eq " + indicatorData.IS_ACTIVE + " and TYPE eq 'IN'", null, null, false, function(tagData) {
						tagData = tagData.results;
						var tagArray = [];
						var i;
						for(i=0;i<tagData.length;i++){
							tagArray.push(tagData[i].TAG);
						}
						indicatorData.TAGS = tagArray;
						indicatorData.TAG = indicatorData.TAGS.toString(",");
						that.OLD_TAGS = tagArray;
					},function(error){
						sap.suite.smartbusiness.utils.showErrorMessage(that.oResourceBundle.getText("ERROR_FETCHING_TAGS"));
					});

					that.oDataModel.read("/PROPERTIES?$filter=ID eq '" + indicatorData.ID + "' and IS_ACTIVE eq " + indicatorData.IS_ACTIVE + " and TYPE eq 'IN'", null, null, false, function(propertiesData) {
						propertiesData = propertiesData.results;
						var propertiesArray = [];
						var i;
						for(i=0;i<propertiesData.length;i++){
							var propertiesObject = {};
							propertiesObject.NAME = propertiesData[i].NAME,
							propertiesObject.VALUE = propertiesData[i].VALUE

							propertiesArray.push(propertiesObject);
						}
						indicatorData.PROPERTIES = propertiesArray;
						that.OLD_PROPERTIES = $.extend(true,[], propertiesArray);
					},function(error){
						sap.suite.smartbusiness.utils.showErrorMessage(that.oResourceBundle.getText("ERROR_FETCHING_PROPERTIES"));
					});

					that.oDataModel.read("/INDICATOR_TEXTS?$filter=ID eq '" + indicatorData.ID + "' and IS_ACTIVE eq " + indicatorData.IS_ACTIVE, null, null, false, function(languageData) {
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
							languageObject.ADDITIONAL_LANGUAGE_SPRAS_KEY = additionalLanguageData[i].LANGUAGE;
							that.oDataModel.read("/LANGUAGE?$filter=SPRAS eq '"+additionalLanguageData[i].LANGUAGE+"'", null, null, false, function(data) {
								languageObject.ADDITIONAL_LANGUAGE_KEY = data.results[0].LAISO;
							});
							languageArray.push(languageObject);
						}
						indicatorData.ADDITIONAL_LANGUAGE_ARRAY = languageArray;
						indicatorData.NO_OF_ADDITIONAL_LANGUAGES = indicatorData.ADDITIONAL_LANGUAGE_ARRAY.length; 
						that.OLD_ADDITIONAL_LANGUAGE_ARRAY = languageArray;
					},function(error){
						sap.suite.smartbusiness.utils.showErrorMessage(that.oResourceBundle.getText("ERROR_FETCHING_ADDITIONAL_LANGUAGES"));
					});

					that.kpiCreateModel.setData(indicatorData);
					that.getView().setModel(that.kpiCreateModel);

					if(indicatorData.MODE == "EDIT"){
						that.getView().byId("kpiId").setEditable(false);
					}

				},function(error){
					sap.suite.smartbusiness.utils.showErrorMessage(that.oResourceBundle.getText("YMSG_ERROR_RETRIEVING_DATA"));
				});
			}
			var form = that.getView().byId('kpiParameterInputForm');
			form.addContent(new sap.m.Label({
				text : that.oResourceBundle.getText("PROPERTY_NAME_VALUE")
			}));

			if (that.viewData.mode === "EDIT" || that.viewData.mode === "DUPLICATE") {
				that.byId("odataServiceInput").fireChange();
			}

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
				}).addStyleClass("propertyEntryGrid");
			});

		});
	},

	save : function() {
		var successStatus = this.saveKpiDetails();
		if(successStatus){
			if(this.viewData.IS_DRAFT){
				sap.suite.smartbusiness.utils.appToAppNavigation({action: "SBWorkspace", route: "detail", context: "INDICATORS_MODELER(ID='"+this.getView().getModel().getData().ID+"',IS_ACTIVE=1)"});
			}
			else{
				sap.suite.smartbusiness.utils.appToAppNavigation({action: "SBWorkspace", route: "detail", context: "INDICATORS_MODELER(ID='"+this.getView().getModel().getData().ID+"',IS_ACTIVE=0)"});
			}
		}
	},

	activateAndAddEvaluation : function() {
		var that=this;
		var successStatus = false;
		var activationStatus = false;

		if (!(this.getView().getModel().getData().TITLE)) {
			sap.suite.smartbusiness.utils.showErrorMessage(that.oResourceBundle.getText("ERROR_ENTER_INDICATOR_TITLE"));
			successStatus = false;
			activationStatus = false;
		} 
		else{
			successStatus = this.saveKpiDetails();
			if(successStatus){
				var payload = {
						ID : this.getView().getModel().getData().ID
				};
				sap.suite.smartbusiness.utils.create(sap.suite.smartbusiness.utils.serviceUrl('ACTIVATE_INDICATOR_SERVICE_URI'),payload,null,function(data){
					if(that.getView().getModel().getData().TYPE == "KPI"){
						sap.m.MessageToast.show(that.oResourceBundle.getText("ACTIVATE_KPI_SUCCESS"));
					}
					else{
						sap.m.MessageToast.show(that.oResourceBundle.getText("ACTIVATE_OPI_SUCCESS"));
					}
					activationStatus = true;
				},function(error){
					if(that.getView().getModel().getData().TYPE == "KPI"){
						sap.suite.smartbusiness.utils.showErrorMessage(that.oResourceBundle.getText("ACTIVATE_KPI_ERROR"));
					}
					else{
						sap.suite.smartbusiness.utils.showErrorMessage(that.oResourceBundle.getText("ACTIVATE_OPI_ERROR"));
					}
					activationStatus = false;
				});			
			}
		}
		if(activationStatus){
			sap.suite.smartbusiness.utils.appToAppNavigation({action: "createSBKPIEvaluation", route: "addEvaluation", context: "INDICATORS_MODELER(ID='"+this.getView().getModel().getData().ID+"',IS_ACTIVE=1)"});
		}
	},

	saveAndCreateNew : function() {
		var successStatus = this.saveKpiDetails();
		if(successStatus){

			var kpiModelData = {};
			kpiModelData.MODE = "CREATE";
			kpiModelData.NO_OF_ADDITIONAL_LANGUAGES = 0;
			kpiModelData.ADDITIONAL_LANGUAGE_ARRAY = [];
			kpiModelData.GOAL_TYPE = "MA";
			kpiModelData.KPITYPE = true;
			kpiModelData.OPITYPE = false;
			kpiModelData.TYPE = "KPI";
			this.kpiCreateModel.setData(kpiModelData);

			this.getView().setModel(this.kpiCreateModel);
			this.getView().getModel().getData().KPITYPE = true;
			this.getView().getModel().getData().OPITYPE = false;
			this.getView().getModel().getData().TYPE = "KPI";
			this.getView().byId("KPI").setSelected(true);
			this.getView().byId("OPI").setSelected(false);
			this.getView().getModel().updateBindings();

			this.getView().byId('kpiId').setEditable(true);
			this.getView().byId('viewInput').fireChange();
			this.kpiModelDataForDirtyBitCheck = $.extend(true,{},kpiModelData);
			sap.suite.smartbusiness.utils.appToAppNavigation({action: "createSBKPI"});
		}
	},

	saveAndActivate : function(){
		var that=this;
		var  successStatus = false;
		var activationStatus = false;

		if (!(this.getView().getModel().getData().TITLE)) {
			sap.suite.smartbusiness.utils.showErrorMessage(that.oResourceBundle.getText("ERROR_ENTER_INDICATOR_TITLE"));
			activationStatus = false;
		} 
		else{
			successStatus = this.saveKpiDetails();
			if(successStatus){
				var payload = {
						ID : this.getView().getModel().getData().ID
				};

				sap.suite.smartbusiness.utils.create(sap.suite.smartbusiness.utils.serviceUrl('ACTIVATE_INDICATOR_SERVICE_URI'),payload,null,function(data){
					if(that.getView().getModel().getData().TYPE == "KPI"){
						sap.m.MessageToast.show(that.oResourceBundle.getText("ACTIVATE_KPI_SUCCESS"));
					}
					else{
						sap.m.MessageToast.show(that.oResourceBundle.getText("ACTIVATE_OPI_SUCCESS"));
					}
					activationStatus = true;
				},function(error){
					if(that.getView().getModel().getData().TYPE == "KPI"){
						sap.suite.smartbusiness.utils.showErrorMessage(that.oResourceBundle.getText("ACTIVATE_KPI_ERROR"));
					}
					else{
						sap.suite.smartbusiness.utils.showErrorMessage(that.oResourceBundle.getText("ACTIVATE_OPI_ERROR"));
					}
					activationStatus = false;
				});
			}
		}

		if(activationStatus){
			sap.suite.smartbusiness.utils.appToAppNavigation({action: "SBWorkspace", route: "detail", context: "INDICATORS_MODELER(ID='"+this.getView().getModel().getData().ID+"',IS_ACTIVE=1)"});
		}
	},

	deleteDraft : function(){
		var that=this;
		var backDialog = new sap.m.Dialog({
			icon:"sap-icon://warning2",
			title:that.oResourceBundle.getText("WARNING"),
			state:"Warning",
			type:"Message",
			content:[new sap.m.Text({text:that.oResourceBundle.getText("WARNING_DELETE_DRAFT_KPI_OPI")})],
			beginButton: new sap.m.Button({
				text:that.oResourceBundle.getText("OK"),
				press: function(){
					backDialog.close();
					that.callDeleteDraft();
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
	},

	callDeleteDraft: function() {
		var that = this;
		var payload = {};
		payload.ID = that.viewData.ID;
		payload.IS_ACTIVE = that.viewData.IS_ACTIVE;

		sap.suite.smartbusiness.utils.remove(sap.suite.smartbusiness.utils.serviceUrl('INDICATOR_SERVICE_URI'),payload,function(data){
			if(that.getView().getModel().getData().TYPE == "KPI"){
				sap.m.MessageToast.show(that.oResourceBundle.getText("SUCCESS_KPI_DELETE"));
			}
			else{
				sap.m.MessageToast.show(that.oResourceBundle.getText("SUCCESS_OPI_DELETE"));
			}
			sap.suite.smartbusiness.utils.appToAppNavigation({action: "SBWorkspace", route: "detail", context: "INDICATORS_MODELER(ID='"+that.getView().getModel().getData().ID+"',IS_ACTIVE=1)"});

		},function(error){
			if(that.getView().getModel().getData().TYPE == "KPI"){
				sap.suite.smartbusiness.utils.showErrorMessage(that.oResourceBundle.getText("ERROR_KPI_DELETE"));
			}
			else{
				sap.suite.smartbusiness.utils.showErrorMessage(that.oResourceBundle.getText("ERROR_OPI_DELETE"));
			}
		});
	}, 

	cancel : function() {
		var that=this;
		var indicatorChanged = false;
		var languageChanged = false;
		var tagChanged = false;
		var propertiesChanged = false;

		if(this.route === "createKpi"){

			if(that.kpiCreateModel.getData().ADDITIONAL_LANGUAGE_ARRAY && that.kpiCreateModel.getData().ADDITIONAL_LANGUAGE_ARRAY.length){
				languageChanged = true;
			}
			if((that.kpiCreateModel.getData().TAGS && that.kpiCreateModel.getData().TAGS.length) || that.kpiCreateModel.getData().TAG){
				tagChanged = true;
			}
			if(that.kpiCreateModel.getData().PROPERTIES && that.kpiCreateModel.getData().PROPERTIES.length){
				propertiesChanged = true;
			}

			delete that.kpiModelDataForDirtyBitCheck.ADDITIONAL_LANGUAGE_ARRAY;
			delete that.kpiModelDataForDirtyBitCheck.TAG;
			delete that.kpiModelDataForDirtyBitCheck.TAGS;
			delete that.kpiModelDataForDirtyBitCheck.PROPERTIES;
			delete that.kpiCreateModel.getData().ADDITIONAL_LANGUAGE_ARRAY;
			delete that.kpiCreateModel.getData().TAG;
			delete that.kpiCreateModel.getData().TAGS;
			delete that.kpiCreateModel.getData().PROPERTIES;

			var indicatorDeltaObject = sap.suite.smartbusiness.utils.dirtyBitCheck({
				oldPayload : that.kpiModelDataForDirtyBitCheck,
				newPayload : that.kpiCreateModel.getData(),
				objectType : "INDICATORS"
			});

			if(indicatorDeltaObject && indicatorDeltaObject.updates.length){
				indicatorChanged = true;
			}

			if(indicatorChanged || languageChanged || tagChanged || propertiesChanged){

				var backDialog = new sap.m.Dialog({
					icon:"sap-icon://warning2",
					title:that.oResourceBundle.getText("WARNING"),
					state:"Warning",
					type:"Message",
					content:[new sap.m.Text({text:that.oResourceBundle.getText("WARNING_UNSAVED_MESSAGE")})],
					beginButton: new sap.m.Button({
						text:that.oResourceBundle.getText("CONTINUE"),
						press: function(){
							backDialog.close();
							window.history.back();
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
				window.history.back();
			}
		}

		else{

			var indicatorDelta = that.getIndicatorChanges();
			var tagDelta = that.getTagChanges();
			var propertiesDelta = that.getPropertiesChanges();
			var languageDelta = that.getLanguageChanges();

			if(indicatorDelta && (indicatorDelta.updates.length)){
				indicatorChanged = true;
			}

			if(languageDelta && (languageDelta.updates.length || languageDelta.deletes.length)){
				languageChanged = true;
			}
			if(tagDelta &&(tagDelta.updates.length || tagDelta.deletes.length)){
				tagChanged = true;
			}

			if(propertiesDelta && (propertiesDelta.updates.length || propertiesDelta.deletes.length)){
				propertiesChanged = true;
			}

			if(indicatorChanged || languageChanged || tagChanged || propertiesChanged){
				var backDialog = new sap.m.Dialog({
					icon:"sap-icon://warning2",
					title:that.oResourceBundle.getText("WARNING"),
					state:"Warning",
					type:"Message",
					content:[new sap.m.Text({text:that.oResourceBundle.getText("WARNING_UNSAVED_MESSAGE")})],
					beginButton: new sap.m.Button({
						text:that.oResourceBundle.getText("CONTINUE"),
						press: function(){
							backDialog.close();
							if(sap.suite.smartbusiness.modelerAppCache && sap.suite.smartbusiness.modelerAppCache.createSBKPI && sap.suite.smartbusiness.modelerAppCache.createSBKPI.appFromWorkspace) {
								if(that.context) {
									if(that.route == "editKpi" || that.route == "duplicateKpi") {
										sap.suite.smartbusiness.utils.appToAppNavigation({action: "SBWorkspace", route: "detail", context: that.context.sPath.substr(1).replace("INDICATORS","INDICATORS_MODELER")});
									}
									else if(that.route == "editDraftKpi") {
										sap.suite.smartbusiness.utils.appToAppNavigation({action: "SBWorkspace", route: "detail", context: that.context.sPath.substr(1).replace("INDICATORS","INDICATORS_MODELER").replace("IS_ACTIVE=0","IS_ACTIVE=1")});
									}
								}
								else {
									sap.suite.smartbusiness.utils.appToAppNavigation({action: "SBWorkspace"});
								}
							}
							else {
								sap.suite.smartbusiness.utils.appToAppNavigation({});
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
				backDialog.open();
			}
			else{
				if(sap.suite.smartbusiness.modelerAppCache && sap.suite.smartbusiness.modelerAppCache.createSBKPI && sap.suite.smartbusiness.modelerAppCache.createSBKPI.appFromWorkspace) {
					if(that.context) {
						if(that.route == "editKpi" || that.route == "duplicateKpi") {
							sap.suite.smartbusiness.utils.appToAppNavigation({action: "SBWorkspace", route: "detail", context: that.context.sPath.substr(1).replace("INDICATORS","INDICATORS_MODELER")});
						}
						else if(that.route == "editDraftKpi") {
							sap.suite.smartbusiness.utils.appToAppNavigation({action: "SBWorkspace", route: "detail", context: that.context.sPath.substr(1).replace("INDICATORS","INDICATORS_MODELER").replace("IS_ACTIVE=0","IS_ACTIVE=1")});
						}
					}
					else {
						sap.suite.smartbusiness.utils.appToAppNavigation({action: "SBWorkspace"});
					}
				}
				else {
					sap.suite.smartbusiness.utils.appToAppNavigation({});
				}
			}
		}
	},

	saveKpiDetails : function() {

		var that = this;
		var kpiDetailsModelData = this.kpiCreateModel.getData();
		var successStatus = true;

		var indicatorPayload = {
				"ID" : 	kpiDetailsModelData.ID || "",
				"IS_ACTIVE" : 0,
				"INDICATOR":{
					"DESCRIPTION" : kpiDetailsModelData.DESCRIPTION || "",
					"GOAL_TYPE" : kpiDetailsModelData.GOAL_TYPE || "",
					"TITLE" : kpiDetailsModelData.TITLE || "",
					"TYPE" : kpiDetailsModelData.TYPE || "",
					"OWNER_E_MAIL" : kpiDetailsModelData.OWNER_E_MAIL || "",
					"OWNER_ID" : kpiDetailsModelData.OWNER_ID || "",
					"OWNER_NAME" : kpiDetailsModelData.OWNER_NAME || "",
					"COLUMN_NAME" : kpiDetailsModelData.COLUMN_NAME || "",
					"DATA_SPECIFICATION" : kpiDetailsModelData.DATA_SPECIFICATION || "",
					"ODATA_URL" : kpiDetailsModelData.ODATA_URL || "",
					"ODATA_ENTITYSET" : kpiDetailsModelData.ODATA_ENTITYSET || "",
					"VIEW_NAME" : kpiDetailsModelData.VIEW_NAME || "",
					"ENTITY_TYPE" : "",
					"SEMANTIC_OBJECT" : kpiDetailsModelData.SEMANTIC_OBJECT || "",
					"ACTION" : kpiDetailsModelData.ACTION || ""
				}
		};

		if (indicatorPayload.ID == "") {
			sap.suite.smartbusiness.utils.showErrorMessage(that.oResourceBundle.getText("ERROR_ENTER_INDICATOR_ID"));
			successStatus = false;
			return;
		}

		if (!(successStatus)||that.byId("kpiId").getValueState() === "Error") {
			sap.suite.smartbusiness.utils.showErrorMessage(that.oResourceBundle.getText("ERROR_ENTER_VALID_KPI_ID"));
			successStatus = false;
			return;
		}

		if(that.byId("kpiOwnerEmail").getValueState() === "Error"){
			sap.suite.smartbusiness.utils.showErrorMessage(that.oResourceBundle.getText("ERROR_ENTER_VALID_KPI_EMAIL"));
			successStatus = false;
			return;
		}

		else {
			if(this.viewData.mode == "DUPLICATE"){
				if(!this.validateKpiId()){
					return;
				}
			}
			if(that.viewData.mode == "CREATE" || that.viewData.mode == "DUPLICATE" || (that.viewData.mode == "EDIT" && this.viewData.IS_ACTIVE == 1)){
				indicatorPayload.TEXTS = [];
				indicatorPayload.TAGS = [];
				indicatorPayload.PROPERTIES = [];
				var languagePayload = that.insertLanguagePayload();
				var propertiesPayload = that.insertPropertiesPayload();
				var tagPayload = that.insertTagPayload();

				if(languagePayload.length){
					indicatorPayload.TEXTS = languagePayload;
				}
				if(propertiesPayload.length){
					indicatorPayload.PROPERTIES = 	propertiesPayload;
				}
				if(tagPayload.length){
					indicatorPayload.TAGS = tagPayload;
				}
				sap.suite.smartbusiness.utils.create(sap.suite.smartbusiness.utils.serviceUrl('INDICATOR_SERVICE_URI'),indicatorPayload,null,function(data){
					if(that.getView().getModel().getData().TYPE == "KPI"){
						sap.m.MessageToast.show(that.oResourceBundle.getText("SUCCESS_KPI_SAVE"));
					}
					else{
						sap.m.MessageToast.show(that.oResourceBundle.getText("SUCCESS_OPI_SAVE"));
					}
					successStatus = true;
				},function(error){
					if(that.getView().getModel().getData().TYPE == "KPI"){
						sap.suite.smartbusiness.utils.showErrorMessage(that.oResourceBundle.getText("ERROR_KPI_SAVE"));
					}
					else{
						sap.suite.smartbusiness.utils.showErrorMessage(that.oResourceBundle.getText("ERROR_OPI_SAVE"));
					}
					successStatus = false;	
				});
			}
			else if(that.viewData.mode == "EDIT"){

				indicatorPayload.TEXTS = {};
				indicatorPayload.TAGS = {};
				indicatorPayload.PROPERTIES = {};

				var indicatorChanged = false;
				var languageChanged = false;
				var tagChanged = false;
				var propertiesChanged = false;

				var indicatorDeltaObject = that.getIndicatorChanges();

				if(indicatorDeltaObject){
					if(indicatorDeltaObject.updates.length){
						indicatorChanged = true;
						indicatorPayload.INDICATOR = {};
						for(var i=0;i<indicatorDeltaObject.updates.length;i++){
							indicatorPayload.INDICATOR.update = indicatorDeltaObject.updates[i];
						}
					}
				}

				var languageDeltaObject = that.getLanguageChanges(); 
				if(languageDeltaObject){
					if(languageDeltaObject.deletes.length){
						languageChanged = true;
						for(var i=0;i<languageDeltaObject.deletes.length;i++){
							indicatorPayload.TEXTS.remove = languageDeltaObject.deletes;
						}
					}
					if(languageDeltaObject.updates.length){
						languageChanged = true;
						for(var i=0;i<languageDeltaObject.updates.length;i++){
							indicatorPayload.TEXTS.create = languageDeltaObject.updates;
						}
					}
				}

				var tagDeltaObject = that.getTagChanges();

				if(tagDeltaObject){
					if(tagDeltaObject.deletes.length){
						tagChanged = true;
						for(var i=0;i<tagDeltaObject.deletes.length;i++){
							indicatorPayload.TAGS.remove = tagDeltaObject.deletes;
						}
					}
					if(tagDeltaObject.updates.length){
						tagChanged = true;
						for(var i=0;i<tagDeltaObject.updates.length;i++){
							indicatorPayload.TAGS.create = tagDeltaObject.updates;
						}
					}
				}

				var propertiesDeltaObject = that.getPropertiesChanges();

				if(propertiesDeltaObject){
					if(propertiesDeltaObject.deletes.length){
						propertiesChanged = true;
						for(var i=0;i<propertiesDeltaObject.deletes.length;i++){
							indicatorPayload.PROPERTIES.remove = propertiesDeltaObject.deletes;
						}
					}
					if(propertiesDeltaObject.updates.length){
						propertiesChanged = true;
						for(var i=0;i<propertiesDeltaObject.updates.length;i++){
							indicatorPayload.PROPERTIES.create = propertiesDeltaObject.updates;
						}
					}
				}

				if(indicatorChanged || tagChanged || propertiesChanged || languageChanged){
					sap.suite.smartbusiness.utils.update(sap.suite.smartbusiness.utils.serviceUrl('INDICATOR_SERVICE_URI'),indicatorPayload,null,function(data){
						if(that.getView().getModel().getData().TYPE == "KPI"){
							sap.m.MessageToast.show(that.oResourceBundle.getText("SUCCESS_KPI_SAVE"));
						}
						else{
							sap.m.MessageToast.show(that.oResourceBundle.getText("SUCCESS_OPI_SAVE"));
						}
						successStatus = true;
					},function(error){
						if(that.getView().getModel().getData().TYPE == "KPI"){
							sap.suite.smartbusiness.utils.showErrorMessage(that.oResourceBundle.getText("ERROR_KPI_SAVE"));
						}
						else{
							sap.suite.smartbusiness.utils.showErrorMessage(that.oResourceBundle.getText("ERROR_OPI_SAVE"));
						}
						successStatus = false;	
					});
				}
			}
		}
		return successStatus;
	},

	getIndicatorChanges : function(){

		var oldIndicatorPayloadData = this.indicatorPayloadForDirtyBitTest;
		var newIndicatorPayloadData = this.kpiCreateModel.getData();

		var oldPayload = {
				"DESCRIPTION" : oldIndicatorPayloadData.DESCRIPTION || "",
				"GOAL_TYPE" : oldIndicatorPayloadData.GOAL_TYPE || "",
				"TITLE" : oldIndicatorPayloadData.TITLE || "",
				"TYPE" : oldIndicatorPayloadData.TYPE || "",
				"OWNER_E_MAIL" : oldIndicatorPayloadData.OWNER_E_MAIL || "",
				"OWNER_ID" : oldIndicatorPayloadData.OWNER_ID || "",
				"OWNER_NAME" : oldIndicatorPayloadData.OWNER_NAME || "",
				"COLUMN_NAME" : oldIndicatorPayloadData.COLUMN_NAME || "",
				"DATA_SPECIFICATION" : oldIndicatorPayloadData.DATA_SPECIFICATION || "",
				"ODATA_URL" : oldIndicatorPayloadData.ODATA_URL || "",
				"ODATA_ENTITYSET" : oldIndicatorPayloadData.ODATA_ENTITYSET || "",
				"VIEW_NAME" : oldIndicatorPayloadData.VIEW_NAME || "",
				"ENTITY_TYPE" : "",
				"SEMANTIC_OBJECT" : oldIndicatorPayloadData.SEMANTIC_OBJECT || "",
				"ACTION" : oldIndicatorPayloadData.ACTION || ""	
		};

		var newPayload = {
				"DESCRIPTION" : newIndicatorPayloadData.DESCRIPTION || "",
				"GOAL_TYPE" : newIndicatorPayloadData.GOAL_TYPE || "",
				"TITLE" : newIndicatorPayloadData.TITLE || "",
				"TYPE" : newIndicatorPayloadData.TYPE || "",
				"OWNER_E_MAIL" : newIndicatorPayloadData.OWNER_E_MAIL || "",
				"OWNER_ID" : newIndicatorPayloadData.OWNER_ID || "",
				"OWNER_NAME" : newIndicatorPayloadData.OWNER_NAME || "",
				"COLUMN_NAME" : newIndicatorPayloadData.COLUMN_NAME || "",
				"DATA_SPECIFICATION" : newIndicatorPayloadData.DATA_SPECIFICATION || "",
				"ODATA_URL" : newIndicatorPayloadData.ODATA_URL || "",
				"ODATA_ENTITYSET" : newIndicatorPayloadData.ODATA_ENTITYSET || "",
				"VIEW_NAME" : newIndicatorPayloadData.VIEW_NAME || "",
				"ENTITY_TYPE" : "",
				"SEMANTIC_OBJECT" : newIndicatorPayloadData.SEMANTIC_OBJECT || "",
				"ACTION" : newIndicatorPayloadData.ACTION || ""	
		};

		var indicatorDeltaObject = sap.suite.smartbusiness.utils.dirtyBitCheck({
			oldPayload : oldPayload,
			newPayload : newPayload,
			objectType : "INDICATORS"
		});

		return indicatorDeltaObject;
	},

	getLanguageChanges : function(){
		var that=this;
		this.languagePayloadForDirtyBitTest = [];
		var newLanguagePayload = this.insertLanguagePayload();
		for(var i=0;i<this.OLD_ADDITIONAL_LANGUAGE_ARRAY.length;i++){
			var languageObject = {};
			languageObject.LANGUAGE = this.OLD_ADDITIONAL_LANGUAGE_ARRAY[i].ADDITIONAL_LANGUAGE_SPRAS_KEY;
			languageObject.TITLE = this.OLD_ADDITIONAL_LANGUAGE_ARRAY[i].ADDITIONAL_LANGUAGE_TITLE;
			languageObject.DESCRIPTION = this.OLD_ADDITIONAL_LANGUAGE_ARRAY[i].ADDITIONAL_LANGUAGE_DESCRIPTION;
			this.languagePayloadForDirtyBitTest.push(languageObject);
		}

		var languageDeltaObject = sap.suite.smartbusiness.utils.dirtyBitCheck({
			oldPayload : that.languagePayloadForDirtyBitTest,
			newPayload : newLanguagePayload,
			objectType : "INDICATOR_TEXTS"
		});

		return languageDeltaObject;
	},

	getTagChanges : function(){
		var that=this;
		this.tagPayloadForDirtyBitTest = [];
		var newTagPayload = this.insertTagPayload();
		var oldTagPayload = [];
		for(var i=0;i<that.OLD_TAGS.length;i++){
			var tagObject = {};
			tagObject.TAG = that.OLD_TAGS[i];
			tagObject.TYPE = "IN";
			this.tagPayloadForDirtyBitTest.push(tagObject);
		}

		var tagDeltaObject = sap.suite.smartbusiness.utils.dirtyBitCheck({
			oldPayload : that.tagPayloadForDirtyBitTest,
			newPayload : newTagPayload,
			objectType : "TAGS"
		});

		return tagDeltaObject;
	},

	getPropertiesChanges : function(){
		var that=this;
		this.propertiesPayloadForDirtyBitTest = [];
		var newPropertiesPayload = this.insertPropertiesPayload();
		for(var i=0;i<this.OLD_PROPERTIES.length;i++){
			var propertiesObject = {};
			propertiesObject.TYPE = "IN";
			propertiesObject.NAME = that.OLD_PROPERTIES[i].NAME;
			propertiesObject.VALUE = that.OLD_PROPERTIES[i].VALUE;
			this.propertiesPayloadForDirtyBitTest.push(propertiesObject);
		}

		var propertiesDeltaObject = sap.suite.smartbusiness.utils.dirtyBitCheck({
			oldPayload : that.propertiesPayloadForDirtyBitTest,
			newPayload : newPropertiesPayload,
			objectType : "PROPERTIES"
		});

		return propertiesDeltaObject;
	},

	insertLanguagePayload : function(){
		var kpiDetailsModelData = this.kpiCreateModel.getData();
		var languagePayload = {};
		var languagePayloadArray = [];
		if(kpiDetailsModelData.NO_OF_ADDITIONAL_LANGUAGES>0){
			var i;
			for (i = 0; i < kpiDetailsModelData.NO_OF_ADDITIONAL_LANGUAGES; i++) {
				languagePayload = {};
				languagePayload.LANGUAGE = kpiDetailsModelData.ADDITIONAL_LANGUAGE_ARRAY[i].ADDITIONAL_LANGUAGE_SPRAS_KEY;
				languagePayload.TITLE = kpiDetailsModelData.ADDITIONAL_LANGUAGE_ARRAY[i].ADDITIONAL_LANGUAGE_TITLE;
				languagePayload.DESCRIPTION = kpiDetailsModelData.ADDITIONAL_LANGUAGE_ARRAY[i].ADDITIONAL_LANGUAGE_DESCRIPTION;

				languagePayloadArray.push(languagePayload);
			}
		}
		return languagePayloadArray;
	},

	insertTagPayload : function(){
		var kpiDetailsModelData = this.kpiCreateModel.getData();
		var tagPayload = {};
		var tagPayloadArray = [];
		if (kpiDetailsModelData.TAG) {
			var tagArray = kpiDetailsModelData.TAG.split(",");
			var i;
			for (i = 0; i < tagArray.length; i++) {
				tagPayload = {};
				tagPayload.TYPE = "IN";
				tagPayload.TAG = tagArray[i];

				tagPayloadArray.push(tagPayload);
			}
		}
		return tagPayloadArray;
	},

	insertPropertiesPayload : function(){
		var kpiDetailsModelData = this.kpiCreateModel.getData();
		var propertyPayload = {};
		var propertyPayloadArray = [];
		if (kpiDetailsModelData.PROPERTIES) {
			var i;
			for (i = 0; i < kpiDetailsModelData.PROPERTIES.length; i++) {
				propertyPayload = {};
				propertyPayload.TYPE = "IN";
				propertyPayload.NAME = kpiDetailsModelData.PROPERTIES[i].NAME;
				propertyPayload.VALUE = kpiDetailsModelData.PROPERTIES[i].VALUE;

				propertyPayloadArray.push(propertyPayload);
			}
		}
		return propertyPayloadArray;
	},

	addAdditionalLanguageDialog : function(){

		var that=this;
		this.additionalLanguageListModel = new sap.ui.model.json.JSONModel();
		this.additionalLanguageListModelData = $.extend([], that.getView().getModel().getData().ADDITIONAL_LANGUAGE_ARRAY);
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
				        		  var newData = that.addedLanguagesList.getModel("additionalLanguageListModel").getData().splice(deletedIndex,1);
				        		  that.addedLanguagesList.getModel("additionalLanguageListModel").updateBindings();

				        	  },
				        	  layoutData : new sap.ui.layout.GridData({
				        		  span : "L2 M2 S2"
				        	  })
				          })
				          ]
			})
		}));

		this.addedLanguagesList.setModel(that.additionalLanguageListModel,"additionalLanguageListModel");

		var additionalLanguageDialog = new sap.m.Dialog({
			contentHeight : "50%",
			contentWidth : "25%",
			title : that.oResourceBundle.getText("ADDITIONAL_LANGUAGE"),
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
			            	        	            	 textAlign : "Right",
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
			            	        	            	 text : that.oResourceBundle.getText("LANGUAGE")+":",
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
			            	        	            				 if(that.addedLanguagesList.getModel("additionalLanguageListModel").getData()[i].ADDITIONAL_LANGUAGE_KEY === that.languageKeySelect.getSelectedItem().getText()){
			            	        	            					 sap.suite.smartbusiness.utils.showErrorMessage(that.oResourceBundle.getText("ERROR_LANGUAGE_EXISTS",that.languageKeySelect.getSelectedItem().getText()));
			            	        	            					 return;
			            	        	            				 }
			            	        	            			 }
			            	        	            			 var addedLanguageObject = {
			            	        	            					 "ADDITIONAL_LANGUAGE_TITLE" : that.languageTextInput.getValue(),
			            	        	            					 "ADDITIONAL_LANGUAGE_DESCRIPTION" : that.languageDescriptionInput.getValue(),
			            	        	            					 "ADDITIONAL_LANGUAGE_KEY" : that.languageKeySelect.getSelectedItem().getText(),
			            	        	            					 "ADDITIONAL_LANGUAGE_SPRAS_KEY" : that.languageKeySelect.getSelectedItem().getKey()
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

			            that.addedLanguagesList

			            ],

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

		this.oDataModel.read("/LANGUAGE?$select=LAISO,SPRAS", null, null, false, function(data) {
			data = data.results;
			var i;
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
		});

		additionalLanguageDialog.open();
	},

	addNewProperty : function() {
		var that=this;

		if (this.getView().byId("kpiPropertyName").getValue()) {
			this.getView().byId("kpiPropertyName").setValueState("None");
			if (this.getView().byId("kpiPropertyValue").getValue()) {
				this.getView().byId("kpiPropertyValue").setValueState("None");
				var propertyModel = this.getView().byId('propertyNameValueBox').getModel();
				propertyModel.getData().PROPERTIES = propertyModel.getData().PROPERTIES || [];
				for(var i=0; i<propertyModel.getData().PROPERTIES.length;i++){
					if((propertyModel.getData().PROPERTIES[i].NAME === this.getView().byId("kpiPropertyName").getValue()) && (propertyModel.getData().PROPERTIES[i].VALUE === this.getView().byId("kpiPropertyValue").getValue())){
						sap.suite.smartbusiness.utils.showErrorMessage(this.oResourceBundle.getText("ERROR_PROPERTY_VALUE_PAIR_EXISTS"));
						return;
					}
				}
				propertyModel.getData().PROPERTIES.push({
					NAME : this.getView().byId("kpiPropertyName").getValue(),
					VALUE : this.getView().byId("kpiPropertyValue").getValue()
				});
				propertyModel.updateBindings();
				this.getView().byId("kpiPropertyName").setValue("");
				this.getView().byId("kpiPropertyValue").setValue("");
			} else {
				this.getView().byId("kpiPropertyValue").setValueState("Error");
				sap.suite.smartbusiness.utils.showErrorMessage(that.oResourceBundle.getText("ENTER_PROPERTY_VALUE"));
			}
		} else {
			this.getView().byId("kpiPropertyName").setValueState("Error");
			sap.suite.smartbusiness.utils.showErrorMessage(that.oResourceBundle.getText("ENTER_PROPERTY_NAME"));
		}
	},

	removeProperty : function(evt) {
		var path = evt.getSource().getBindingContext().getPath();
		evt.getSource().getBindingContext().getModel().getData().PROPERTIES.splice(path.substring(path.lastIndexOf("/") + 1), 1);
		evt.getSource().getBindingContext().getModel().updateBindings();
	},

	kpiOpiRadioButtonChange : function(oEvent) {
		if (this.getView().byId('KPI').getSelected() == true) {
			this.getView().getModel().getData().TYPE = "KPI";
			this.getView().getModel().getData().KPITYPE = true;
			this.getView().getModel().getData().OPITYPE = false;
		}
		else{
			this.getView().getModel().getData().TYPE = "OPI";
			this.getView().getModel().getData().KPITYPE = false;
			this.getView().getModel().getData().OPITYPE = true;
		}
		if(this.getView().byId('OPI').getSelected() == true) {
			this.getView().getModel().getData().TYPE = "OPI";
			this.getView().getModel().getData().KPITYPE = false;
			this.getView().getModel().getData().OPITYPE = true;
		}
		else{
			this.getView().getModel().getData().TYPE = "KPI";
			this.getView().getModel().getData().KPITYPE = true;
			this.getView().getModel().getData().OPITYPE = false;
		}
	},

	validateKpiId : function() {
		var kpiIdField = this.getView().byId('kpiId');
		var that=this;
		var successStatus = false;

		var kpiId = kpiIdField.getValue();
		if (kpiId) {
			if (!(/^[a-zA-Z0-9.]*$/.test(kpiId))) {
				kpiIdField.setValueState("Error");
				successStatus = false;
			} else {
				kpiIdField.setValueState("None");
				this.oDataModel.read("/INDICATORS?$filter=ID eq '" + kpiId + "'", null, null, false, function(indicatorData) {
					if (indicatorData.results[0]) {
						kpiIdField.setValueState("Error");
						sap.suite.smartbusiness.utils.showErrorMessage(that.oResourceBundle.getText("ID_ALREADY_EXISTS"));
						successStatus = false;
					} else {
						kpiIdField.setValueState("None");
						successStatus = true;
					}
				}, function() {
					kpiIdField.setValueState("None");
					successStatus = true;
				});
			}
		}
		return successStatus;
	},

	formatAdditionalLanguageLink : function(sValue){
		return this.oApplicationFacade.getResourceBundle().getText("ADDITIONAL_LANGUAGE")+"("+sValue+")";
	},

	formatSemanticActionLabel : function(sValue){
		return sValue+"/"+this.oApplicationFacade.getResourceBundle().getText("ACTION");
	},

	validateEmailAddress : function() {

		var kpiOwnerEmailField = this.getView().byId('kpiOwnerEmail');
		var kpiOwnerEmailValue = kpiOwnerEmailField.getValue();
		if (kpiOwnerEmailValue) {
			if (!(/^\w+[\w-\.]*\@\w+((-\w+)|(\w*))\.[a-z]/.test(kpiOwnerEmailValue))) {
				kpiOwnerEmailField.setValueState("Error");
			} else {
				kpiOwnerEmailField.setValueState("None");
			}
		} else {
			kpiOwnerEmailField.setValueState("None");
		}
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
				that.byId("viewInput").fireChange();
			},
			liveChange : function(oEvent) {
				var searchValue = "'" + oEvent.getParameter("value").toLowerCase() + "'";
				var oFilterPackage = new sap.ui.model.Filter("tolower(PACKAGE)", sap.ui.model.FilterOperator.Contains,searchValue);
				var oFilterObject = new sap.ui.model.Filter("tolower(OBJECT)", sap.ui.model.FilterOperator.Contains,searchValue);
				var oBinding = oEvent.getSource().getBinding("items");
				oBinding.filter(new sap.ui.model.Filter([oFilterPackage, oFilterObject], false));
			}
		});
		hanaViewValueHelpDialog.setModel(this.oDataModel);
		hanaViewValueHelpDialog.open();
	},

	handleHanaViewInputChange : function(){
		this.getView().getModel().getData().ODATA_URL = "";
		this.getView().getModel().getData().ODATA_ENTITYSET = "";
		this.getView().getModel().getData().COLUMN_NAME = "";
		this.getView().getModel().updateBindings();
	},

	handleOdataServiceValueHelp:function(){
		var that = this;
		if(!that.byId("viewInput").getValue()){
			sap.suite.smartbusiness.utils.showErrorMessage(that.oResourceBundle.getText("ERROR_ENTER_HANA_VIEW"));
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
	handleEntitySetValueHelp : function(){
		var that = this;
		if(!that.byId("odataServiceInput").getValue()){
			sap.suite.smartbusiness.utils.showErrorMessage(that.oResourceBundle.getText("ERROR_ENTER_ODATA_SERVICE_URL"));
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
	handleMeasureValueHelp : function(){
		var that = this;
		if(!that.byId("entitySetInput").getValue()){
			sap.suite.smartbusiness.utils.showErrorMessage(that.oResourceBundle.getText("ERROR_ENTER_ENTITY_SET"));		
		}
		else{
			try {
				that.oModelForMeasure = that.populateMeasure(that.getView().getModel().getProperty("/ODATA_URL"), that.getView().getModel().getProperty("/ODATA_ENTITYSET"));
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
					var oFilterPackage = new sap.ui.model.Filter("tolower(measureName)", sap.ui.model.FilterOperator.Contains,searchValue);
					var oBinding = oEvent.getSource().getBinding("items");
					oBinding.filter(new sap.ui.model.Filter([oFilterPackage], false));
				}
			});
			hanaMeasureHelpDialog.setModel(that.oModelForMeasure);
			hanaMeasureHelpDialog.open();
		}
	},

	handleChangeAdditionalInfo : function(oEvent) {
		var that = this;
		that.getView().getModel().setProperty("info", that.getView().byId("additionalInfoId"));
	},


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

	onODataServiceLoad : function() {
		var that = this;
		setTimeout(function() {
			that.getView().getModel().setProperty("/ODATA_URL",that.getView().byId("odataServiceSelect").getSelectedItem().getText());
			that.getView().byId("odataServiceSelect").fireChange();
		}, 0);
		this.oDataModel.detachRequestCompleted(that.onODataServiceLoad, that);
	},

	onEntitySetServiceLoad : function() {
		var that = this;

		setTimeout(function() {
			that.getView().getModel().setProperty("/ODATA_ENTITYSET",that.getView().byId("entitySetSelect").getSelectedItem().getText());
			that.getView().byId("entitySetSelect").fireChange();
		}, 0);
	},

	onMeasureServiceLoad : function() {
		var that = this;

		setTimeout(function() {
			that.getView().getModel().setProperty("/COLUMN_NAME",that.getView().byId("valueMeasureSelect").getSelectedItem().getText());
			that.getView().byId("valueMeasureSelect").fireChange();
		}, 0);
	},

	onExit: function() {
		var hashObj = hasher || window.hasher;
		if(!(hashObj.getHash())) {
			sap.suite.smartbusiness.utils.backToHome();
		}
		if(sap.suite.smartbusiness.modelerAppCache && sap.suite.smartbusiness.modelerAppCache.createSBKPI && sap.suite.smartbusiness.modelerAppCache.createSBKPI.appFromWorkspace) {
			delete sap.suite.smartbusiness.modelerAppCache.createSBKPI.appFromWorkspace;
		}
	}
});