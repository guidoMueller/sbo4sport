jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");
jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("sap.m.MessageToast");

sap.ca.scfld.md.controller.BaseDetailController.extend("sap.suite.ui.smartbusiness.designtime.workspace.view.S3", {

	onInit : function() {
		var that = this;
		var view = this.getView();

		this.oRouter.attachRouteMatched(function(evt) {
			if(evt.getParameter("name") === "multiSelect") {
				var pageContent = this.getView().getContent()[0].getContent();
				for(var i=0,l=pageContent.length; i<l; i++) {
					pageContent[i].setVisible(false);
				}
				this.oApplicationFacade.multiSelectMode = true;
			}
			else if (evt.getParameter("name") === "detail") {

				if(this.oApplicationFacade.multiSelectMode) {
					var pageContent = this.getView().getContent()[0].getContent();
					for(var i=0,l=pageContent.length; i<l; i++) {
						pageContent[i].setVisible(true);
					}
					this.oApplicationFacade.multiSelectMode = undefined;
				}

				this.oApplicationFacade.currentContextPath = evt.getParameter("arguments").contextPath;

				var context = new sap.ui.model.Context(view.getModel(), '/' + (evt.getParameter("arguments").contextPath));
				view.setBindingContext(context);
				view.contextPath = evt.getParameter("arguments").contextPath;

				//*******************************************************************************************
				that.contextIndicatorId = view.getBindingContext().getProperty("ID") || evt.getParameter("arguments").contextPath.split("(")[1].split(",")[0].split("=")[1].replace(/'/g,'');

				var model = new sap.ui.model.json.JSONModel();
				that.getView().byId("kpiAssociationTable").getBinding("items").filter(new sap.ui.model.Filter([new sap.ui.model.Filter("SOURCE_INDICATOR", sap.ui.model.FilterOperator.EQ, that.contextIndicatorId) , new sap.ui.model.Filter("TARGET_INDICATOR", sap.ui.model.FilterOperator.EQ, that.contextIndicatorId)],false));

				that.byId("kpiAssociationTable").getBinding("items").attachDataReceived(function(data){
					that.getView().byId("associationIconTab").setCount(that.getView().byId("kpiAssociationTable").getItems().length);
				});
				//*******************************************************************************************

				if(view.getBindingContext().getObject()) {
					this.onAfterIndicatorContext(view.getBindingContext().getObject());
					this.contextIndicatorId = view.getBindingContext().getProperty("ID");
				} 
				else {
					this.oApplicationFacade.getODataModel().read(view.contextPath, null, null, true, function(data) {
						that.onAfterIndicatorContext(data);
						that.currentContextDataForBookmark = data;
						that.contextIndicatorId = data.ID;
					}, function(err) {
						that.contextIndicatorId = evt.getParameter("arguments").contextPath.split("(")[1].split(",")[0].split("=")[1].replace(/'/g,'');
						sap.suite.smartbusiness.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("YMSG_ERROR_RETRIEVING_DATA"), err.response.body);
					});
				}

				that.byId("evaluationTable").getBinding("items").attachDataReceived(function(data){
					that.oApplicationFacade.evaluationContexts = [];
					var tableItems = that.byId("evaluationTable").getItems();
					for(var i=0;i<tableItems.length;i++){
						that.oApplicationFacade.evaluationContexts[i] = tableItems[i].getBindingContext().getPath();
					}
				});

			}
		}, this);

		this.oHeaderFooterOptions =
		{
				bSuppressBookmarkButton: {},
				buttonList : []
		};
		that.byId("directionArrowAssociation").setColor(sap.ui.core.theming.Parameters.get("sapUiLightText"));
	},

	getHeaderFooterOptions : function() {
		return this.oHeaderFooterOptions;
	},

	onAfterRendering: function() {

	},

	formatOwner: function(owner) {
		return (owner || "");
	},

	formatStatus: function(status) {
		return ((status) ? (this.oApplicationFacade.getResourceBundle().getText("ACTIVE")) : this.oApplicationFacade.getResourceBundle().getText("DRAFT"));
	},

	formatGoalType: function(goalType) {
		var that = this;
		var goalTypeText = null;
		switch(goalType) {
		case 'MA': goalTypeText = that.oApplicationFacade.getResourceBundle().getText("MAXIMIZING"); break;
		case 'MI': goalTypeText = that.oApplicationFacade.getResourceBundle().getText("MINIMIZING"); break;
		case 'RA': goalTypeText = that.oApplicationFacade.getResourceBundle().getText("RANGE"); break;
		default : goalTypeText = that.oApplicationFacade.getResourceBundle().getText("NONE");
		}
		return goalTypeText;
	},

	formatEvaluationCount: function(evalCount) {
		return (evalCount || 0);
	},

	formatFavoriteMark: function(favMark) {
		return ((favMark) ? true : false);
	},

	formatTags: function(tag) { 
		return ((this.getView().byId("tags").getItems().length > 1) ? (', ' + tag) : (tag));
	},

	formatAssociationCount: function(sourceCount,targetCount) {
		var that = this;
		if(sourceCount==null && targetCount==null){
			return that.oApplicationFacade.getResourceBundle().getText("ASSOCIATIONS")+"(0)";
		}
		if(sourceCount==null){
			return that.oApplicationFacade.getResourceBundle().getText("ASSOCIATIONS")+"("+targetCount+")";
		}
		if(targetCount==null){
			return that.oApplicationFacade.getResourceBundle().getText("ASSOCIATIONS")+"("+sourceCount+")";
		}
		var count = (parseInt(sourceCount)+parseInt(targetCount));
		return that.oApplicationFacade.getResourceBundle().getText("ASSOCIATIONS")+"("+count.toString()+")";
	},


	formatProperties: function(name, value)  {
		var prop = ((this.getView().byId("assoProperties").getItems().length > 1) ? (", " + name + " : " + value) : (name + " : " + value+","));
		return prop;
	},

	formatArrowDirection: function(source_indicator) {
		return ((source_indicator == this.contextIndicatorId) ? ("sap-icon://arrow-right") : ("sap-icon://arrow-left"));  
	},
	formatAssociationType: function(associationType){
		if(associationType=="SUPPORTING"){
			return this.oApplicationFacade.getResourceBundle().getText("SUPPORTING");
		}
		else{
			return this.oApplicationFacade.getResourceBundle().getText("CONFLICTING");
		}
	},
	formatTargetIndicatorText: function(sourceIndicator, targetIndicator, sourceIndicatorTitle, targetIndicatorTitle) { 
		var indicatorText = null;
		if(targetIndicator == this.contextIndicatorId) {
			indicatorText = sourceIndicatorTitle;
		}
		else {
			indicatorText = targetIndicatorTitle;
		}
		return indicatorText;
	},

	formatStatusOfAssociation: function(is_active,counter){
		var that = this;
		if(counter=="2"){
			var str = that.oApplicationFacade.getResourceBundle().getText("STATUS_ACTIVE")+","+that.oApplicationFacade.getResourceBundle().getText("STATUS_DRAFT");
			return str;
		}
		if(is_active==0){
			return that.oApplicationFacade.getResourceBundle().getText("STATUS_NEW");
		}
		if(is_active==1){
			return that.oApplicationFacade.getResourceBundle().getText("STATUS_ACTIVE");
		}
	},

	formatKpiStatus: function(state, count) {
		var that = this;
		var isActive = "";
		if(count > 1) {
			isActive = (that.oApplicationFacade.getResourceBundle().getText("STATUS_ACTIVE") + "," + that.oApplicationFacade.getResourceBundle().getText("STATUS_DRAFT"));
		}
		else if(state){
			isActive = that.oApplicationFacade.getResourceBundle().getText("STATUS_ACTIVE");
		}
		else {
			isActive = that.oApplicationFacade.getResourceBundle().getText("STATUS_NEW");
		}
		return isActive;
	},

	handleEvaluationSelect: function(evt) {
		var that = this;
		for(var i=0;i<this.oApplicationFacade.evaluationContexts.length;i++){
			if(evt.getParameter("listItem").getBindingContext().sPath === this.oApplicationFacade.evaluationContexts[i]){
				this.oApplicationFacade.evaluationIndex = i;
				break;
			}
		}
		sap.suite.smartbusiness.utils.replaceHash({action:"SBWorkspace", route:"evalDetail", context:(this.getView().contextPath + "/" + evt.getParameter("listItem").getBindingContext().sPath.substring(1))});
	},

	onAfterIndicatorContext: function(contextObj) {
		var that = this;
		that.updateFooterButtons(contextObj);
	},

	getAllFooterButtons: function() {
		var that = this;
		var buttonList = [
		                  {
		                	  id: "addEval",
		                	  sId: "addEvaluationButton",
		                	  sI18nBtnTxt : "ADD_EVALUATION",
		                	  onBtnPressed : function(evt) {
		                		  sap.suite.smartbusiness = sap.suite.smartbusiness || {};
		                		  sap.suite.smartbusiness.modelerAppCache = sap.suite.smartbusiness.modelerAppCache || {};
		                		  sap.suite.smartbusiness.modelerAppCache.createSBKPIEvaluation  = sap.suite.smartbusiness.modelerAppCache.createSBKPIEvaluation || {};
		                		  sap.suite.smartbusiness.modelerAppCache.createSBKPIEvaluation.appFromWorkspace = true;
		                		  sap.suite.smartbusiness.utils.appToAppNavigation({action:"createSBKPIEvaluation", route:"addEvaluation", context:(that.getView().getBindingContext().getPath())});
		                	  },
		                  }, {
		                	  sId: "favouriteToggleButton",
		                	  sI18nBtnTxt : "ADD_FAVOURITE",
		                	  onBtnPressed : function(evt) {
		                		  var path = "/FAVOURITES";
		                		  var contextObj = that.getView().getBindingContext().getObject();
		                		  var oDataModel = that.oApplicationFacade.getODataModel(); 
		                		  var payload = {ID:contextObj.ID, TYPE:contextObj.ENTITY_TYPE, USER_ID:that.oApplicationFacade.currentLogonHanaUser, MANUAL_ENTRY:1, LAST_WORKED_ON:null};
		                		  if(contextObj.MANUAL_ENTRY) {
		                			  //odata remove
//		                			  path += "(ID='" + contextObj.ID + "',TYPE='" + contextObj.ENTITY_TYPE + "',USER_ID='" + that.oApplicationFacade.currentLogonHanaUser + "')";
//		                			  oDataModel.remove(path,null,function(data) {
//		                				  sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("FAVOURITE_IN_DELETE_SUCCESS_KPI_OPI"));
//		                				  oDataModel.refresh();
//		                				  contextObj.MANUAL_ENTRY = 0;
//		                				  that.updateFooterButtons(contextObj);
//		                			  }, function(err) {
//		                				  sap.suite.smartbusiness.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("FAVOURITE_IN_DELETE_ERROR_KPI_OPI"), err.response.body);
//		                			  });

		                			  //xsjs remove
		                			  sap.suite.smartbusiness.utils.remove(sap.suite.smartbusiness.utils.serviceUrl("INDICATOR_FAVOURITE_SERVICE_URI"),payload,function(data) {
		                				  sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("FAVOURITE_IN_DELETE_SUCCESS_KPI_OPI"));
		                				  oDataModel.refresh();
		                				  contextObj.MANUAL_ENTRY = 0;
		                				  that.updateFooterButtons(contextObj);
		                			  }, function(err) {
		                				  sap.suite.smartbusiness.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("FAVOURITE_IN_DELETE_ERROR_KPI_OPI"), err.responseText);
		                			  });
		                		  }
		                		  else if(contextObj.MANUAL_ENTRY == 0) {
		                			  //odata update
//		                			  path += "(ID='" + contextObj.ID + "',TYPE='" + contextObj.ENTITY_TYPE + "',USER_ID='" + that.oApplicationFacade.currentLogonHanaUser + "')";
//		                			  oDataModel.update(path,payload,null,function(data) {
//		                				  sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("FAVOURITE_IN_SUCCESS_KPI_OPI"));
//		                				  oDataModel.refresh();
//		                				  contextObj.MANUAL_ENTRY = 1;
//		                				  that.updateFooterButtons(contextObj);
//		                			  }, function(err) {
//		                				  sap.suite.smartbusiness.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("FAVOURITE_KPI_OPI_ERROR"), err.response.body);
//		                			  });
		                			  
		                			  //xsjs update
		                			  sap.suite.smartbusiness.utils.update(sap.suite.smartbusiness.utils.serviceUrl("INDICATOR_FAVOURITE_SERVICE_URI"),payload,null,function(data) {
		                				  sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("FAVOURITE_IN_SUCCESS_KPI_OPI"));
		                				  oDataModel.refresh();
		                				  contextObj.MANUAL_ENTRY = 1;
		                				  that.updateFooterButtons(contextObj);
		                			  }, function(err) {
		                				  sap.suite.smartbusiness.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("FAVOURITE_KPI_OPI_ERROR"), err.responseText);
		                			  });
		                		  }
		                		  else if(contextObj.MANUAL_ENTRY == null) {
		                			  //odata create
//		                			  oDataModel.create(path,payload,null,function(data) {
//		                				  sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("FAVOURITE_IN_SUCCESS_KPI_OPI"));
//		                				  oDataModel.refresh();
//		                				  contextObj.MANUAL_ENTRY = 1;
//		                				  that.updateFooterButtons(contextObj);
//		                			  }, function(err) {
//		                				  sap.suite.smartbusiness.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("FAVOURITE_KPI_OPI_ERROR"), err.response.body);
//		                			  });
		                			  
		                			  //xsjs create
		                			  sap.suite.smartbusiness.utils.create(sap.suite.smartbusiness.utils.serviceUrl("INDICATOR_FAVOURITE_SERVICE_URI"),payload,null,function(data) {
		                				  sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("FAVOURITE_IN_SUCCESS_KPI_OPI"));
		                				  oDataModel.refresh();
		                				  contextObj.MANUAL_ENTRY = 1;
		                				  that.updateFooterButtons(contextObj);
		                			  }, function(err) {
		                				  sap.suite.smartbusiness.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("FAVOURITE_KPI_OPI_ERROR"), err.responseText);
		                			  });
		                		  }
		                	  }
		                  }, {
		                	  sId: "activateButton",
		                	  sI18nBtnTxt : "ACTIVATE",
		                	  onBtnPressed : function(evt) {
		                		  var entity = "ACTIVE_INDICATORS";
		                		  var payload = {};
		                		  var payloads = [];
		                		  var sPath = that.getView().getBindingContext().sPath;
		                		  payload.ID = sPath.substring((sPath.indexOf("'")+1),sPath.lastIndexOf("'"));
		                		  payloads.push(payload);

		                		  that.oApplicationFacade.getODataModel().read(("/INDICATOR_TEXTS?$filter=ID eq '"+that.contextIndicatorId + "' and IS_ACTIVE eq 0 and TITLE ne ''"), null, null, false, function(data) {
		                			  if(data && data.results && data.results.length) {
		                				  var ODataModel = that.oApplicationFacade.getODataModel();
		                				  // odata write
//		                				  ODataModel.create(entity,payload,null,function(data){
//		                					  sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("ACTIVATE_KPI_OPI_SUCCESS"));
//		                					  sap.suite.smartbusiness.utils.hashChange({hash:window.location.hash.replace("IS_ACTIVE=0","IS_ACTIVE=1")});
//		                					  ODataModel.refresh(); 
//		                				  },
//		                				  function(err){
//		                					  sap.suite.smartbusiness.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("ACTIVATE_KPI_OPI_ERROR"), err.response.body);
//		                				  });

		                				  //xsjs write
		                				  sap.suite.smartbusiness.utils.create(sap.suite.smartbusiness.utils.serviceUrl("ACTIVATE_INDICATOR_SERVICE_URI"), payloads , null, function(data){
	                						  sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("ACTIVATE_KPI_OPI_SUCCESS"));
	                						  sap.suite.smartbusiness.utils.replaceHash({hash:window.location.hash.replace("IS_ACTIVE=0","IS_ACTIVE=1")}, true);
	                						  ODataModel.refresh(); 
	                					  },
	                					  function(err){
	                						  sap.suite.smartbusiness.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("ACTIVATE_KPI_OPI_ERROR"), err.responseText);
	                					  });
		                			  }
		                			  else {
		                				  sap.suite.smartbusiness.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("ERROR_ENTER_KPI_OPI_TITLE"));
		                			  }
		                		  }, function() {

		                		  });
		                	  }
		                  }, {
		                	  id: "editBut",
		                	  sId: "editButton",
		                	  sI18nBtnTxt : "EDIT",
		                	  onBtnPressed : function(evt) {
		                		  var contextPath = that.getView().getBindingContext().getPath();
		                		  contextPath = (that.getView().getBindingContext().getObject().COUNTER == 2) ? contextPath.replace("IS_ACTIVE=1","IS_ACTIVE=0") : contextPath;
		                		  contextPath = contextPath.replace("INDICATORS_MODELER","INDICATORS");
		                		  sap.suite.smartbusiness = sap.suite.smartbusiness || {};
		                		  sap.suite.smartbusiness.modelerAppCache = sap.suite.smartbusiness.modelerAppCache || {};
		                		  sap.suite.smartbusiness.modelerAppCache.createSBKPI  = sap.suite.smartbusiness.modelerAppCache.createSBKPI || {};
		                		  sap.suite.smartbusiness.modelerAppCache.createSBKPI.appFromWorkspace = true;
		                		  if(that.getView().getBindingContext().getObject().COUNTER == 2){
		                			  sap.suite.smartbusiness.utils.appToAppNavigation({action:"createSBKPI", route:"editDraftKpi", context:(contextPath)});
		                		  }
		                		  else if(that.getView().getBindingContext().getObject().COUNTER == 1){
		                			  sap.suite.smartbusiness.utils.appToAppNavigation({action:"createSBKPI", route:"editKpi", context:(contextPath)});
		                		  }
		                	  }
		                  }, {
		                	  sId: "deleteButton",
		                	  sI18nBtnTxt : "DELETE_BUTTON_TEXT",
		                	  onBtnPressed : function(evt) {
		                		  if(!(sap.m.MessageBox)) {
		                			  jQuery.sap.require("sap.m.MessageBox");
		                		  }	
		                		  sap.m.MessageBox.show(
		                				  that.oApplicationFacade.getResourceBundle().getText("WARNING_SINGLE_INDICATOR_DELETE_KPI_OPI"),
		                				  "sap-icon://hint",
		                				  that.oApplicationFacade.getResourceBundle().getText("DELETE_BUTTON_TEXT"),
		                				  [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL ],
		                				  function(evt){
		                					  if(evt=="OK"){
		                						  var entity = that.getView().getBindingContext().sPath.substring(1).replace("INDICATORS_MODELER","INDICATORS");
		                						  var payloads = [];
		                						  payloads.push({ID:that.getView().getBindingContext().getObject().ID,IS_ACTIVE:that.getView().getBindingContext().getObject().IS_ACTIVE});
		                						  var ODataModel = that.oApplicationFacade.getODataModel();
		                						  //odata remove
//		                						  ODataModel.remove(entity,null,function(data){
//	                								  sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("DELETE_KPI_OPI_SUCCESS"));
//	                								  ODataModel.refresh();
//	                								  sap.suite.smartbusiness.utils.hashChange({hash:window.location.hash.substr(0,window.location.hash.indexOf("&/"))});
//	                							  },
//	                							  function(err){
//	                								  sap.suite.smartbusiness.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("DELETE_KPI_OPI_ERROR"), err.response.body);
//	                							  });
		                						  
		                						  //xsjs remove
		                						  sap.suite.smartbusiness.utils.remove(sap.suite.smartbusiness.utils.serviceUrl("INDICATOR_SERVICE_URI"),payloads,function(data){
		                							  sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("DELETE_KPI_OPI_SUCCESS"));
		                							  ODataModel.refresh();
		                							  sap.suite.smartbusiness.utils.replaceHash({hash:window.location.hash.substr(0,window.location.hash.indexOf("&/"))}, true);
		                						  },
		                						  function(err){
		                							  sap.suite.smartbusiness.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("DELETE_KPI_OPI_ERROR"), err.responseText);
		                						  });
		                					  }
		                					  if(evt=="CANCEL"){

		                					  }
		                				  }
		                		  );
		                	  }
		                  },
		                  {
		                	  sId: "duplicateButton",
		                	  sI18nBtnTxt : "DUPLICATE",
		                	  onBtnPressed : function(evt) {
		                		  sap.suite.smartbusiness = sap.suite.smartbusiness || {};
		                		  sap.suite.smartbusiness.modelerAppCache = sap.suite.smartbusiness.modelerAppCache || {};
		                		  sap.suite.smartbusiness.modelerAppCache.createSBKPI  = sap.suite.smartbusiness.modelerAppCache.createSBKPI || {};
		                		  sap.suite.smartbusiness.modelerAppCache.createSBKPI.appFromWorkspace = true;
		                		  sap.suite.smartbusiness.utils.appToAppNavigation({action:"createSBKPI", route:"duplicateKpi", context:(that.getView().getBindingContext().getPath().replace("INDICATORS_MODELER","INDICATORS"))});
		                	  }
		                  }
		                  ];

		return buttonList;
	},

	updateFooterButtons: function(indicatorObj) {
		indicatorObj = indicatorObj || this.getView().getBindingContext().getObject();
		var footerAllButtons = this.getAllFooterButtons();

		this.oHeaderFooterOptions.buttonList = [];

		if((indicatorObj.COUNTER == 2) || (indicatorObj.IS_ACTIVE)) {
			this.oHeaderFooterOptions.oEditBtn = footerAllButtons[0];
		}

		if(indicatorObj.MANUAL_ENTRY) {
			footerAllButtons[1].sI18nBtnTxt = this.oApplicationFacade.getResourceBundle().getText("REMOVE_FAVOURITE");
		}
		else {
			footerAllButtons[1].sI18nBtnTxt = this.oApplicationFacade.getResourceBundle().getText("ADD_FAVOURITE"); 
		}
		this.oHeaderFooterOptions.buttonList.push(footerAllButtons[1]);

		if(!(indicatorObj.IS_ACTIVE)) {
			this.oHeaderFooterOptions.oEditBtn = footerAllButtons[2];
		}

		this.oHeaderFooterOptions.buttonList.push(footerAllButtons[5]);

		if(indicatorObj.COUNTER == 2) {
			footerAllButtons[3].sI18nBtnTxt = this.oApplicationFacade.getResourceBundle().getText("EDIT_DRAFT");
		}
		else {
			footerAllButtons[3].sI18nBtnTxt = this.oApplicationFacade.getResourceBundle().getText("EDIT"); 
		}
		this.oHeaderFooterOptions.buttonList.push(footerAllButtons[3]);

		this.oHeaderFooterOptions.buttonList.push(footerAllButtons[4]);

		this.setHeaderFooterOptions(this.oHeaderFooterOptions);
	}


});

