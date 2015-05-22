jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");
jQuery.sap.includeStyleSheet("../../resources/sap/suite/ui/smartbusiness/designtime/workspace/view/workspaceStyling.css");
sap.ca.scfld.md.controller.BaseDetailController.extend("sap.suite.ui.smartbusiness.designtime.workspace.view.S4", {
       
       onInit : function() {
          var that = this;
          var view = this.getView();

          this.oRouter.attachRouteMatched(function(evt) {
                 if (evt.getParameter("name") === "evalDetail") {

                        var context = new sap.ui.model.Context(view.getModel(), '/' + (evt.getParameter("arguments").contextPath));
                        var evalContext = new sap.ui.model.Context(view.getModel(), '/' + (evt.getParameter("arguments").evalPath));

                        this.evalPath = evt.getParameter("arguments").evalPath;
                        this.contextPath = evt.getParameter("arguments").contextPath;

                        //For binding trend *********************************************************************************
                        that.context = new sap.ui.model.Context(view.getModel(), '/' + (evt.getParameter("arguments").contextPath));
                        that.evalContext = new sap.ui.model.Context(view.getModel(), '/' + (evt.getParameter("arguments").evalPath));

                        that.evalPath = evt.getParameter("arguments").evalPath;
                        that.contextPath = evt.getParameter("arguments").contextPath;

                       if(that.evalContext.getObject()) {
                              that.onAfterEvaluationContext(that.context.getObject(), that.evalContext.getObject());
                              view.setBindingContext(evalContext);
                        }
                        else {
                              that.oApplicationFacade.getODataModel().read(("/" + evt.getParameter("arguments").evalPath), null, null, true, function(data) {
                                     that.onAfterEvaluationContext(null, data);
                              });
                        }

                        //Fetching Filters and Input Parameters
                        that.oApplicationFacade.getODataModel().read((that.evalPath+"/FILTERS"),null,null,true,function(FilterValues){
                              var objectForFilters;
                              that.evaluationDetails = that.evaluationDetails || {};
                              that.evaluationDetails.EVALUATION_FILTERS = FilterValues.results;
                              objectForFilters = that.formObjectForInputParametersAndFilters(FilterValues);
                              that.modelForFiltersAndIp = new sap.ui.model.json.JSONModel();
                              that.modelForFiltersAndIp.setData(objectForFilters);
                              that.getView().byId("filterInputParameterTable").setModel(that.modelForFiltersAndIp,"filterInput");
                        },function(err){
                              sap.suite.smartbusiness.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("YMSG_ERROR_RETRIEVING_DATA"), err.response.body);
                        });

                        if(that.context.getObject()) {
                              this.onAfterIndicatorContext();
                        }
                        else {
                              this.oApplicationFacade.getODataModel().read(this.contextPath, null, null, true, function(data) {
                                     that.oApplicationFacade.getODataModel().oData[that.contextPath] = data;
                                     that.onAfterIndicatorContext();
                              }, function(err) {
                                     sap.suite.smartbusiness.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("YMSG_ERROR_RETRIEVING_DATA"), err.response.body);
                              });
                        }
                 }
          }, this);

       },
       
       formObjectForTrendThreshold : function(kpiContextObj, evaluationContextObj, evaluationValues){
          var obj = {TA:null, TC:null, RE:null, CL:null, CH:null, WL:null, WH:null};
          evaluationValues = (evaluationValues && evaluationValues.results) ? evaluationValues.results : [];
          for(var i=0,l=evaluationValues.length; i<l; i++) {
                 if((evaluationContextObj.VALUES_SOURCE == "FIXED") || (!(evaluationContextObj.VALUES_SOURCE))) {
                        obj[evaluationValues[i]["TYPE"]] = evaluationValues[i]["FIXED"];
                 }
                 else if(evaluationContextObj.VALUES_SOURCE == "MEASURE") {
                        obj[evaluationValues[i]["TYPE"]] = evaluationValues[i]["COLUMN_NAME"];
                 }
          }
          if(kpiContextObj) {
                 obj.GOAL_TYPE = kpiContextObj.GOAL_TYPE;
          }
          else {
                 obj.GOAL_TYPE = null;
          }

          obj.VALUES_SOURCE = evaluationContextObj.VALUES_SOURCE || "FIXED";
          return obj;
       },
       
       formObjectForInputParametersAndFilters: function(listOfFilters){
          var obj = {EVALUATION_FILTERS:[]}, flag=0, isBetween=0;
           var i, valuesStr = '', tempObj={};
           var tempName = (listOfFilters.results && listOfFilters.results.length) ? listOfFilters.results[0].NAME : "";
           for(i=0;i<listOfFilters.results.length;i++){
                  if(listOfFilters.results[i].NAME == tempName && (listOfFilters.results[i].OPERATOR == "EQ" || listOfFilters.results[i].OPERATOR == "GT" || listOfFilters.results[i].OPERATOR == "LT" || listOfFilters.results[i].OPERATOR == "NE")){
                         tempObj = {};
                         valuesStr += listOfFilters.results[i].VALUE_1 + ",";
                         tempObj = {"ID":listOfFilters.results[i].ID, "IS_ACTIVE":listOfFilters.results[i].IS_ACTIVE, "NAME":listOfFilters.results[i].NAME, "OPERATOR":listOfFilters.results[i].OPERATOR, "TYPE":listOfFilters.results[i].TYPE, "VALUES":valuesStr, "VALUE_2":null}

                         tempName = listOfFilters.results[i].NAME;
                         flag = 0;
                  }
                  if(listOfFilters.results[i].NAME != tempName && (listOfFilters.results[i].OPERATOR == "EQ" || listOfFilters.results[i].OPERATOR == "GT" || listOfFilters.results[i].OPERATOR == "LT" || listOfFilters.results[i].OPERATOR == "NE")){
                         if(tempObj.VALUES){
                        	 tempObj.VALUES = tempObj.VALUES.substring(0,tempObj.VALUES.length-1);  //Remove the last comma
                        	 obj.EVALUATION_FILTERS.push(tempObj);
                         }
                         valuesStr = '';
                         valuesStr = valuesStr + listOfFilters.results[i].VALUE_1 + ",";
                         tempObj = {"ID":listOfFilters.results[i].ID, "IS_ACTIVE":listOfFilters.results[i].IS_ACTIVE, "NAME":listOfFilters.results[i].NAME, "OPERATOR":listOfFilters.results[i].OPERATOR, "TYPE":listOfFilters.results[i].TYPE, "VALUES":valuesStr, "VALUE_2":null}

                         tempName = listOfFilters.results[i].NAME;
                         flag = 0;
                  }
                  if(listOfFilters.results[i].OPERATOR == "BT"){
                         if(tempObj.VALUES){
                               tempObj.VALUES = tempObj.VALUES.substring(0,tempObj.VALUES.length-1);  //Remove the last comma
                               obj.EVALUATION_FILTERS.push(tempObj);
                               tempObj = {};
                         }
                         tempObj = {"ID":listOfFilters.results[i].ID, "IS_ACTIVE":listOfFilters.results[i].IS_ACTIVE, "NAME":listOfFilters.results[i].NAME, "OPERATOR":listOfFilters.results[i].OPERATOR, "TYPE":listOfFilters.results[i].TYPE, "VALUES":listOfFilters.results[i].VALUE_1, "VALUE_2":listOfFilters.results[i].VALUE_2}
                         obj.EVALUATION_FILTERS.push(tempObj);
                         flag = 1;
                         tempName = listOfFilters.results[i].NAME;
                         tempObj = {};
                  }
           }
           if(flag==0){
                  tempObj.VALUES = (tempObj.VALUES) ? tempObj.VALUES.substring(0,tempObj.VALUES.length-1) : tempObj.VALUES;  //Remove the last comma
                  obj.EVALUATION_FILTERS.push(tempObj);
           }
           return obj;
       },
       
       formatOwnerName: function(ownerName){
    	   var that = this;
    	   if(ownerName==null || ownerName==""){
    		   return "";
    	   }
    	   else{
    		   return sap.suite.smartbusiness.formatters.getBundleText(undefined, "OWNER", ownerName);
    	   }
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
       formatThresholdCriticalHigh: function(goalType){
    	   var that = this;
    	   var thresholdText = null;
//         var context = new sap.ui.model.Context(that.getView().getModel(), '/' + (that.evalPath));
           if(that.evalContext!=null)
               goalType = that.evalContext.getObject().GOAL_TYPE;
           switch(goalType) {
           case 'MI': thresholdText = that.oApplicationFacade.getResourceBundle().getText("CRITICAL"); break;
           case 'RA': thresholdText = that.oApplicationFacade.getResourceBundle().getText("CRITICAL_HIGH"); break;
           default : thresholdText = "";
           }
           return thresholdText;
       },
       formatThresholdWarningHigh: function(goalType){
    	   var that = this;
    	   var thresholdText = null;
//         var context = new sap.ui.model.Context(that.getView().getModel(), '/' + (that.evalPath));
           if(that.evalContext!=null)
               goalType = that.evalContext.getObject().GOAL_TYPE;
           switch(goalType) {
           case 'MI': thresholdText = that.oApplicationFacade.getResourceBundle().getText("WARNING"); break;
           case 'RA': thresholdText = that.oApplicationFacade.getResourceBundle().getText("WARNING_HIGH"); break;
           default : thresholdText = "";
           }
           return thresholdText;
       },
       formatThresholdWarningLow: function(goalType){
    	   var that = this;
    	   var thresholdText = null;
//         var context = new sap.ui.model.Context(that.getView().getModel(), '/' + (that.evalPath));
           if(that.evalContext!=null)
               goalType = that.evalContext.getObject().GOAL_TYPE;
           switch(goalType) {
           case 'MA': thresholdText = that.oApplicationFacade.getResourceBundle().getText("WARNING"); break;
           case 'RA': thresholdText = that.oApplicationFacade.getResourceBundle().getText("WARNING_LOW"); break;
           default : thresholdText = "";
           }
           return thresholdText;
       },
       formatThresholdCriticalLow: function(goalType){
    	   var that = this;
    	   var thresholdText = null;
//         var context = new sap.ui.model.Context(that.getView().getModel(), '/' + (that.evalPath));
           if(that.evalContext!=null)
               goalType = that.evalContext.getObject().GOAL_TYPE;
           switch(goalType) {
           case 'MA': thresholdText = that.oApplicationFacade.getResourceBundle().getText("CRITICAL"); break;
           case 'RA': thresholdText = that.oApplicationFacade.getResourceBundle().getText("CRITICAL_LOW"); break;
           default : thresholdText = "";
           }
           return thresholdText;
       },

       formatProperties: function(name, value) {
                     return ((this.getView().byId("properties").getItems().length > 1) ? (', ' + name + ' : ' + value) : (name + ' : ' + value));
              },
              
              formatOperator: function(operatorType) {
                     var that = this;
                     var operatorTypeText = null;
                     switch(operatorType) {
                     case 'EQ' : operatorTypeText = that.oApplicationFacade.getResourceBundle().getText("EQUAL_TO"); break;
                     case 'GT' : operatorTypeText = that.oApplicationFacade.getResourceBundle().getText("GREATER_THAN"); break;
                     case 'LT' : operatorTypeText = that.oApplicationFacade.getResourceBundle().getText("LESS_THAN"); break;
                     case 'NE' : operatorTypeText = that.oApplicationFacade.getResourceBundle().getText("NOT_EQUAL_TO"); break;
                     case 'BT' : operatorTypeText = that.oApplicationFacade.getResourceBundle().getText("BETWEEN"); break;
                     case undefined : operatorTypeText = null; break;
                     default : operatorTypeText = that.oApplicationFacade.getResourceBundle().getText("NONE");
                     }
                     return operatorTypeText;
              },
              
              formatTypeOfFilter: function(inputType) {
                     var that = this;
                     var parameterTypeText = null;
                     switch(inputType) {
                     case 'FI' : parameterTypeText = that.oApplicationFacade.getResourceBundle().getText("FILTER"); break;
                     case 'PA' : parameterTypeText = that.oApplicationFacade.getResourceBundle().getText("INPUT_PARAMETER"); break;
                     case undefined : operatorTypeText = null; break;
                     default : parameterTypeText = that.oApplicationFacade.getResourceBundle().getText("NONE");
                     }
                     return parameterTypeText;
              },
              
              getHeaderFooterOptions : function() {
                     var that = this;
                     this.oHeaderFooterOptions = {
                                  bSuppressBookmarkButton: {},
                                  onBack: function(){
                                	  var hash = window.location.hash.replace("evalDetail","detail");
                                	  sap.suite.smartbusiness.utils.replaceHash({hash:hash.substr(0,hash.lastIndexOf("/"))}, true);
                                	  //window.location.hash = hash.substr(0,hash.lastIndexOf("/"));
                                  },
                                  oUpDownOptions : {
                                         sI18NDetailTitle: "ITEM_DETAIL_HEADER",
                                         iPosition : 0,
                                         iCount : 0,
                                         fSetPosition : function (iNewPosition) {
                                                that.oApplicationFacade.evaluationIndex = iNewPosition;
                                                var nextEvalContextPath = that.oApplicationFacade.evaluationContexts[that.oApplicationFacade.evaluationIndex].substring(1);
                                                var view = that.getView();

                                                that.oHeaderFooterOptions.oUpDownOptions.iPosition = that.oApplicationFacade.evaluationIndex;
                                                that.oHeaderFooterOptions.oUpDownOptions.iCount = that.oApplicationFacade.evaluationContexts.length;
                                                that.setHeaderFooterOptions(that.oHeaderFooterOptions);
                                                that.getHeaderFooterOptions();

                                                sap.suite.smartbusiness.utils.replaceHash({action: "SBWorkspace", route: "evalDetail", context: (that.contextPath + "/" + nextEvalContextPath)});
                                         }
                                  },
                                  buttonList : that.getAllFooterButtons()
                     };

                     if(that.oApplicationFacade.evaluationIndex && that.oApplicationFacade.evaluationContexts) {
                            that.onAfterAllEvaluationContexts();
                            if(that.bookmark == false) {
                            that.updateFooterButtons();
                            }
                     }
                     else {
                            that.oApplicationFacade.evaluationContexts = [];
                            that.oApplicationFacade.getODataModel().read((that.contextPath + "/EVALUATIONS"), null, null, true, function(data) {
                                  for(var i=0,l=data.results.length; i<l; i++) {
                                         that.oApplicationFacade.evaluationContexts[i] = ("/" + data.results[i].__metadata.uri.split("/")[data.results[i].__metadata.uri.split("/").length - 1]);
                                         that.oApplicationFacade.getODataModel().oData[that.oApplicationFacade.evaluationContexts[i].substr(1)] = data.results[i]; 
                                         if(that.oApplicationFacade.evaluationContexts[i] == ('/' + (that.evalPath))) {
                                                that.oApplicationFacade.evaluationIndex = i;
                                                var evalContext = new sap.ui.model.Context(that.getView().getModel(), '/' + (that.evalPath));
                                                that.getView().setBindingContext(evalContext);
                                         }
                                  }
                                   that.onAfterAllEvaluationContexts(that.oApplicationFacade.evaluationIndex, that.oApplicationFacade.evaluationContexts);
                            }, function(err) {
                                   sap.suite.smartbusiness.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("YMSG_ERROR_RETRIEVING_DATA"), err.response.body);
                            });
                     }
                     
                     return this.oHeaderFooterOptions;
              },

              formatEvalStatus: function(state, count) {
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
       
     //Binding of Evaluation values
       hideShow: function(goalType){
           var that = this;
           if(goalType=="MA"){
                  that.byId("CHlabel").setVisible(false);
                  that.byId("CHinput").setVisible(false);
                  
                  that.byId("WHlabel").setVisible(false);
                  that.byId("WHinput").setVisible(false);  
                  
                  that.byId("WLlabel").setVisible(true);
                  that.byId("WLinput").setVisible(true);
                  
                  that.byId("CLlabel").setVisible(true);
                  that.byId("CLinput").setVisible(true);
           }
           else if(goalType=="MI"){
                  that.byId("WLlabel").setVisible(false);
                  that.byId("WLinput").setVisible(false);
                  
                  that.byId("CLlabel").setVisible(false);
                  that.byId("CLinput").setVisible(false);
                  
                  that.byId("CHlabel").setVisible(true);
                  that.byId("CHinput").setVisible(true);

                  that.byId("WHlabel").setVisible(true);
                  that.byId("WHinput").setVisible(true);  
           }
           else if(goalType=="RA"){
        	   	  that.byId("WLlabel").setVisible(true);
        	      that.byId("WLinput").setVisible(true);

        	      that.byId("CLlabel").setVisible(true);
        	      that.byId("CLinput").setVisible(true);

            	  that.byId("CHlabel").setVisible(true);
        	      that.byId("CHinput").setVisible(true);

        	      that.byId("WHlabel").setVisible(true);
        	      that.byId("WHinput").setVisible(true);
        }
        else if(goalType==null){
	              that.byId("WLlabel").setVisible(false);
	              that.byId("WLinput").setVisible(false);
	            
	              that.byId("CLlabel").setVisible(false);
	              that.byId("CLinput").setVisible(false);
	            
	              that.byId("CHlabel").setVisible(false);
	              that.byId("CHinput").setVisible(false);
	            
	              that.byId("WHlabel").setVisible(false);
	              that.byId("WHinput").setVisible(false);
        }
     },

       
       onAfterAllEvaluationContexts: function() {
          var that = this;
          that.oHeaderFooterOptions.oUpDownOptions.iPosition = that.oApplicationFacade.evaluationIndex;
          that.oHeaderFooterOptions.oUpDownOptions.iCount = that.oApplicationFacade.evaluationContexts.length;
          that.setHeaderFooterOptions(that.oHeaderFooterOptions);
          that.updateFooterButtons(that.evalContext.getObject());
       },

       onAfterIndicatorContext: function(){
          var that = this;
//          var context = new sap.ui.model.Context(that.getView().getModel(), '/' + (that.contextPath));
//          that.getView().setBindingContext(context,"indicator");
//          this.currentIndicatorObj = context.getObject();
       },
       
       formatFavoriteMark: function(favMark) {
          return ((favMark) ? true : false);
       },

       onAfterEvaluationContext: function(indicatorObj, evaluationObj) {
         var that = this;
         //Binding the Eval Properties
         that.hideShow(evaluationObj.GOAL_TYPE);
         that.byId("goalType").setText(that.formatGoalType(evaluationObj.GOAL_TYPE));
         //Fetching trend values
         that.oApplicationFacade.getODataModel().read((that.evalPath+"/VALUES"),null,null,true,function(evaluationValues){
                 var objForTrend = {};
                 that.evaluationDetails = that.evaluationDetails || {};
                 that.evaluationDetails.EVALUATION_VALUES = evaluationValues.results;
                 objForTrend = that.formObjectForTrendThreshold(indicatorObj, evaluationObj, evaluationValues);
                 that.modelForTarget = new sap.ui.model.json.JSONModel();
                 that.byId("thresholdTrendId").setModel(that.modelForTarget);
                 that.modelForTarget.setData(objForTrend);

          },function(err){
                 sap.suite.smartbusiness.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("YMSG_ERROR_RETRIEVING_DATA"), err.response.body);
          });
          if(that.oHeaderFooterOptions) {
                 that.updateFooterButtons(evaluationObj);
          }
          else {
                 that.bookmark = false;
          }
          that.evaluationDetails = that.evaluationDetails || {};
                 that.evaluationDetails.EVALUATIONS = evaluationObj;
          that.currentEvaluationObj = evaluationObj;
       },
       
       getAllFooterButtons : function() {
          var that = this;
          return [{
                 sId: "activateButton",
                 sI18nBtnTxt : "ACTIVATE",
                 onBtnPressed : function(evt) {
                        var log = that.checkForMandatoryParametersForEvaluation();
                        
                        that.oApplicationFacade.getODataModel().read(("/EVALUATION_TEXTS?$filter=ID eq '"+that.currentEvaluationObj.ID + "' and IS_ACTIVE eq 0 and TITLE ne ''"), null, null, false, function(data) {
                     	   if(!(data && data.results && data.results.length)) {
                     		   log.error.push(that.oApplicationFacade.getResourceBundle().getText("ERROR_ENTER_EVALUATION_TITLE"));
                     	   }
                        }, function(err) {
                        	sap.suite.smartbusiness.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("YMSG_ERROR_RETRIEVING_DATA"), err.response.body);
                        });
                        
                        if(log.error.length) {
                              var errMsg = "";
                              for(var i=0,l=log.error.length; i<l; i++) {
                                     errMsg += errMsg ? "\n" : "";
                                     errMsg += that.oApplicationFacade.getResourceBundle().getText(log.error[i]);
                              }
                              sap.suite.smartbusiness.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("ACTIVATE_EV_ERROR"), errMsg);
                        }
                        else {
                        	  if(log.warning.length) {
                        		  var warnMsg = "";
                                  for(var i=0,l=log.warning.length; i<l; i++) {
                                         warnMsg += warnMsg ? "\n" : "";
                                         warnMsg += that.oApplicationFacade.getResourceBundle().getText(log.warning[i]);
                                  }
                                  
                                  var backDialog = new sap.m.Dialog({
              						icon:"sap-icon://warning2",
              						title:that.oApplicationFacade.getResourceBundle().getText("WARNING"),
              						state:"Warning",
              						type:"Message",
              						content:[new sap.m.Text({text:warnMsg + "\n\n" + that.oApplicationFacade.getResourceBundle().getText("WARNING_EV_ACTIVATE")})],
              						beginButton: new sap.m.Button({
              							text:that.oApplicationFacade.getResourceBundle().getText("CONTINUE"),
              							press: function(){
              								backDialog.close();
              								that.activateEvaluation();
              							}
              						}),
              						endButton: new sap.m.Button({
              							text:that.oApplicationFacade.getResourceBundle().getText("CANCEL"),
              							press:function(){
              								backDialog.close();
              							}
              						})   	                                           
              					});
              					backDialog.open();
                        	  }	
                        	  else {
                        		  that.activateEvaluation(); 
                        	  }
                        }
                 }
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
//                              path += "(ID='" + contextObj.ID + "',TYPE='" + contextObj.ENTITY_TYPE + "',USER_ID='" + that.oApplicationFacade.currentLogonHanaUser + "')";
//                              oDataModel.remove(path,null,function(data) {
//                                     sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("FAVOURITE_EV_DELETE_SUCCESS"));
//                                     oDataModel.refresh();
//                                     contextObj.MANUAL_ENTRY = 0;
//                                     that.updateFooterButtons(contextObj);
//                              }, function(err) {
//                                     sap.suite.smartbusiness.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("FAVOURITE_EV_DELETE_ERROR"), err.response.body);
//                              });
                        	
                        	//xsjs remove
                        	sap.suite.smartbusiness.utils.remove(sap.suite.smartbusiness.utils.serviceUrl("EVALUATION_FAVOURITE_SERVICE_URI"),payload,function(data) {
                        		sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("FAVOURITE_EV_DELETE_SUCCESS"));
                        		contextObj.MANUAL_ENTRY = null;
                           		that.updateFooterButtons(contextObj);
                        		oDataModel.refresh();
                        		that.setBtnText("favouriteToggleButton",that.oApplicationFacade.getResourceBundle().getText("ADD_FAVOURITE"));
                        	}, function(err) {
                        		sap.suite.smartbusiness.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("FAVOURITE_EV_DELETE_ERROR"), err.responseText);
                        	});
                        }
                        else if(contextObj.MANUAL_ENTRY == 0) {
                        	// odata update
//                              path += "(ID='" + contextObj.ID + "',TYPE='" + contextObj.ENTITY_TYPE + "',USER_ID='" + that.oApplicationFacade.currentLogonHanaUser + "')";
//                              oDataModel.update(path,payload,null,function(data) {
//                                     sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("FAVOURITE_EV_SUCCESS"));
//                                     oDataModel.refresh();
//                                     contextObj.MANUAL_ENTRY = 1;
//                                     that.updateFooterButtons(contextObj);
//                              }, function(err) {
//                                     sap.suite.smartbusiness.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("FAVOURITE_EV_DELETE_ERROR"), err.response.body);
//                              });
                        	
                        	//xsjs update
                        	sap.suite.smartbusiness.utils.update(sap.suite.smartbusiness.utils.serviceUrl("EVALUATION_FAVOURITE_SERVICE_URI"),payload,null,function(data) {
                        		sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("FAVOURITE_EV_SUCCESS"));
                        		contextObj.MANUAL_ENTRY = 1;
                        		that.updateFooterButtons(contextObj);
                        		oDataModel.refresh();
                        		that.setBtnText("favouriteToggleButton",that.oApplicationFacade.getResourceBundle().getText("REMOVE_FAVOURITE"));
                        	}, function(err) {
                        		sap.suite.smartbusiness.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("FAVOURITE_EV_DELETE_ERROR"), err.responseText);
                        	});
                        }
                        else if(contextObj.MANUAL_ENTRY == null) {
                        	//odata create
//                              oDataModel.create(path,payload,null,function(data) {
//                                     sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("FAVOURITE_EV_SUCCESS"));
//                                     oDataModel.refresh();
//                                     contextObj.MANUAL_ENTRY = 1;
//                                     that.updateFooterButtons(contextObj);
//                              }, function(err) {
//                                     sap.suite.smartbusiness.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("FAVOURITE_EV_ERROR"), err.response.body);
//                              });
                        	
                        	//xsjs create
                        	sap.suite.smartbusiness.utils.update(sap.suite.smartbusiness.utils.serviceUrl("EVALUATION_FAVOURITE_SERVICE_URI"),payload,null,function(data) {
                        		sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("FAVOURITE_EV_SUCCESS"));
                        		contextObj.MANUAL_ENTRY = 1;
                        		that.updateFooterButtons(contextObj);
                        		oDataModel.refresh();
                        		that.setBtnText("favouriteToggleButton",that.oApplicationFacade.getResourceBundle().getText("REMOVE_FAVOURITE"));
                        	}, function(err) {
                        		sap.suite.smartbusiness.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("FAVOURITE_EV_ERROR"), err.responseText);
                        	});
                        }
                        contextObj.MANUAL_ENTRY ? evt.getSource().setText(that.oApplicationFacade.getResourceBundle().getText("REMOVE_FAVOURITE"))
                                     : evt.getSource().setText(that.oApplicationFacade.getResourceBundle().getText("ADD_FAVOURITE"));
                 }             
          }, {
                 sId: "editButton",
                 sI18nBtnTxt : "EDIT",
                 onBtnPressed : function(evt) {
                	 var evalPath = that.getView().getBindingContext().getPath();
                	 evalPath = (that.currentEvaluationObj.COUNTER == 2) ? evalPath.replace("IS_ACTIVE=1","IS_ACTIVE=0") : evalPath;
                	 sap.suite.smartbusiness = sap.suite.smartbusiness || {};
                	 sap.suite.smartbusiness.modelerAppCache = sap.suite.smartbusiness.modelerAppCache || {};
                	 sap.suite.smartbusiness.modelerAppCache.createSBKPIEvaluation  = sap.suite.smartbusiness.modelerAppCache.createSBKPIEvaluation || {};
                	 sap.suite.smartbusiness.modelerAppCache.createSBKPIEvaluation.appFromWorkspace = true;
                	 if(that.getView().getBindingContext().getObject().COUNTER == 2){
                		 sap.suite.smartbusiness.utils.appToAppNavigation({action: "createSBKPIEvaluation", route: "editEvaluationDraft", context: ("/"+that.contextPath.replace("INDICATORS_MODELER","INDICATORS") + evalPath.replace("EVALUATIONS_MODELER","EVALUATIONS"))});
                	 }
                	 else if(that.getView().getBindingContext().getObject().COUNTER == 1){
                		 sap.suite.smartbusiness.utils.appToAppNavigation({action: "createSBKPIEvaluation", route: "editEvaluation", context: ("/"+that.contextPath.replace("INDICATORS_MODELER","INDICATORS") + evalPath.replace("EVALUATIONS_MODELER","EVALUATIONS"))});
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
                                     that.oApplicationFacade.getResourceBundle().getText("WARNING_SINGLE_EVALUATION_DELETE"),
                                     "sap-icon://hint",
                                     that.oApplicationFacade.getResourceBundle().getText("DELETE_BUTTON_TEXT"),
                                     [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL ],
                                     function(evt){
                                            if(evt=="OK"){
                                            	var ODataModel = that.oApplicationFacade.getODataModel();
                                            	var payloads = [];
                                            	payloads.push({ID:that.getView().getBindingContext().getObject().ID,IS_ACTIVE:that.getView().getBindingContext().getObject().IS_ACTIVE});
                                            	//odata remove
//                                            	var entity = "EVALUATIONS" + that.getView().getBindingContext().sPath.substr(1).substr(that.getView().getBindingContext().sPath.substr(1).indexOf("("));
//                                            	ODataModel.remove(entity,null,function(data){
//                                            		sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("DELETE_EV_SUCCESS"));
//                                            		ODataModel.refresh();
//                                            		window.history.back();
//                                            	},
//                                            	function(err){
//                                            		sap.suite.smartbusiness.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("DELETE_EV_ERROR"), err.response.body);
//                                            	});
                                            	
                                            	//xsjs remove
                                            	sap.suite.smartbusiness.utils.remove(sap.suite.smartbusiness.utils.serviceUrl("EVALUATION_SERVICE_URI"),payloads,function(data){
                                            		sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("DELETE_EV_SUCCESS"));
                                            		ODataModel.refresh();
                                            		var hash = window.location.hash.replace("evalDetail","detail");
                                            		sap.suite.smartbusiness.utils.replaceHash({hash:hash.substr(0,hash.lastIndexOf("/"))}, true);
                                            	},
                                            	function(err){
                                            		sap.suite.smartbusiness.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("DELETE_EV_ERROR"), err.responseText);
                                            	});
                                            }
                                            if(evt=="CANCEL"){
                                                   
                                            }

                                     });
                 }
          }, {
                sId: "duplicateButton",
                sI18nBtnTxt : "DUPLICATE",
                onBtnPressed : function(evt) {
                	sap.suite.smartbusiness = sap.suite.smartbusiness || {};
                	sap.suite.smartbusiness.modelerAppCache = sap.suite.smartbusiness.modelerAppCache || {};
                	sap.suite.smartbusiness.modelerAppCache.createSBKPIEvaluation  = sap.suite.smartbusiness.modelerAppCache.createSBKPIEvaluation || {};
                	sap.suite.smartbusiness.modelerAppCache.createSBKPIEvaluation.appFromWorkspace = true;
                	sap.suite.smartbusiness.utils.appToAppNavigation({action: "createSBKPIEvaluation", route: "duplicateEvaluation", context: ("/"+that.contextPath.replace("INDICATORS_MODELER","INDICATORS")+"/" + that.evalPath.replace("EVALUATIONS_MODELER","EVALUATIONS"))});
                }
           }, {
                 sId: "addTileButton",
                 sI18nBtnTxt : "ADD_TILE",
                 onBtnPressed : function(evt){ 
                	 sap.suite.smartbusiness = sap.suite.smartbusiness || {};
                	 sap.suite.smartbusiness.modelerAppCache = sap.suite.smartbusiness.modelerAppCache || {};
                	 sap.suite.smartbusiness.modelerAppCache.configureSBKPITile  = sap.suite.smartbusiness.modelerAppCache.configureSBKPITile || {};
                	 sap.suite.smartbusiness.modelerAppCache.configureSBKPITile.appFromWorkspace = true;
                	 sap.suite.smartbusiness.utils.appToAppNavigation({action: "configureSBKPITile", route: "detail", context: ("EVALUATIONS_CHIP" + that.evalPath.substr(that.evalPath.indexOf("(")))});
                 }
          }, {
                 sId: "drilldownButton",
                 sI18nBtnTxt : "DRILLDOWN_CONFIG",
                 onBtnPressed : function(evt) {
                	 sap.suite.smartbusiness = sap.suite.smartbusiness || {};
                	 sap.suite.smartbusiness.modelerAppCache = sap.suite.smartbusiness.modelerAppCache || {};
                	 sap.suite.smartbusiness.modelerAppCache.configureSBKPIDrilldown  = sap.suite.smartbusiness.modelerAppCache.configureSBKPIDrilldown || {};
                	 sap.suite.smartbusiness.modelerAppCache.configureSBKPIDrilldown.appFromWorkspace = true;
                	 sap.suite.smartbusiness.utils.appToAppNavigation({action: "configureSBKPIDrilldown", route: "detail", context: ("EVALUATIONS_DDA('" + that.evalContext.getProperty("ID") + "')")});
                 }
          }, {
                 sId: "authUsersButton",
                 sI18nBtnTxt : "AUTH_USERS",
                 onBtnPressed : function(evt) {
                	 sap.suite.smartbusiness = sap.suite.smartbusiness || {};
                	 sap.suite.smartbusiness.modelerAppCache = sap.suite.smartbusiness.modelerAppCache || {};
                	 sap.suite.smartbusiness.modelerAppCache.authorizeSBEvaluation  = sap.suite.smartbusiness.modelerAppCache.authorizeSBEvaluation || {};
                	 sap.suite.smartbusiness.modelerAppCache.authorizeSBEvaluation.appFromWorkspace = true;
                	 sap.suite.smartbusiness.utils.appToAppNavigation({action: "authorizeSBEvaluation", route: "detail", context: (that.evalPath)});
                 }
          }];
       },
       
       updateFooterButtons: function(evaluationObj) {
    	   evaluationObj = evaluationObj || this.getView().getModel("evaluation").getData().EVALUATION;
    	   var footerAllButtons = this.getAllFooterButtons();

    	   this.oHeaderFooterOptions.buttonList = [];


    	   if(evaluationObj.IS_ACTIVE) {
    		   this.oHeaderFooterOptions.oEditBtn = footerAllButtons[5];
    		   this.oHeaderFooterOptions.buttonList.push(footerAllButtons[6]);
    		   this.oHeaderFooterOptions.buttonList.push(footerAllButtons[7]);
    	   }
    	   else {
    		   this.oHeaderFooterOptions.oEditBtn = footerAllButtons[0];
    	   }

    	   if(evaluationObj.MANUAL_ENTRY) {
    		   footerAllButtons[1].sI18nBtnTxt = this.oApplicationFacade.getResourceBundle().getText("REMOVE_FAVOURITE");
    	   }
    	   else {
    		   footerAllButtons[1].sI18nBtnTxt = this.oApplicationFacade.getResourceBundle().getText("ADD_FAVOURITE"); 
    	   }
    	   this.oHeaderFooterOptions.buttonList.push(footerAllButtons[1]);

    	   this.oHeaderFooterOptions.buttonList.push(footerAllButtons[4]);

    	   if(evaluationObj.COUNTER == 2) {
    		   footerAllButtons[2].sI18nBtnTxt = this.oApplicationFacade.getResourceBundle().getText("EDIT_DRAFT");
    	   }
    	   else {
    		   footerAllButtons[2].sI18nBtnTxt = this.oApplicationFacade.getResourceBundle().getText("EDIT"); 
    	   }
    	   this.oHeaderFooterOptions.buttonList.push(footerAllButtons[2]);

    	   this.oHeaderFooterOptions.buttonList.push(footerAllButtons[3]);

    	   this.setHeaderFooterOptions(this.oHeaderFooterOptions);
       },
       
       checkForMandatoryParametersForEvaluation: function() {
          var that = this;
          var evaluationObj = that.evalContext.getObject();
          var errorLog = [];
          var warningLog = [];
          var inputParameters = {};
          var evaluationFilters = this.evaluationDetails.EVALUATION_FILTERS;
          var evaluationValues = this.evaluationDetails.EVALUATION_VALUES;
          var isTarget = false;
          
          evaluationObj.ODATA_URL ? true : errorLog.push("ERROR_ENTER_ODATA_URL");
          evaluationObj.ODATA_ENTITYSET ? true : errorLog.push("ERROR_ENTER_ENTITY_SET");
          evaluationObj.COLUMN_NAME ? true : errorLog.push("ERROR_ENTER_MEASURE");

          if(evaluationObj.ODATA_URL && evaluationObj.ODATA_ENTITYSET) {
                 this.oData4SAPAnalyticsModel = new sap.suite.smartbusiness.odata4analytics.Model(new sap.suite.smartbusiness.odata4analytics.Model.ReferenceByURI(evaluationObj.ODATA_URL), null);
                 this.queryResultObj = this.oData4SAPAnalyticsModel.findQueryResultByName(evaluationObj.ODATA_ENTITYSET);
                 if(this.queryResultObj.getParameterization()) {
                        inputParameters = this.queryResultObj.getParameterization().getAllParameters();
                 }

                 for(var i=0,l=evaluationValues.length; i<l; i++) {
                	 if(evaluationValues[i].TYPE == "TA") {
                		 isTarget = true;
                	 }
                	 else if(evaluationValues[i].TYPE && (evaluationValues[i].TYPE.toString().search(/^\d\d$/) == 0)) {
                		 if(evaluationValues[i].COLUMN_NAME == evaluationObj.COLUMN_NAME) {
                			 errorLog.push("ADDI_MEASURE_HAS_MAIN_MEASURE");
                		 }
                	 }
                 }

                 if(!isTarget) {
                	 warningLog.push("ERROR_ENTER_TARGET");
                 }

                 for(var i=0,l=evaluationFilters.length; i<l; i++) {
                        if(evaluationFilters[i].TYPE == 'PA') {
                              if(inputParameters[evaluationFilters[i].NAME] && (evaluationFilters[i].VALUE_1) && (evaluationFilters[i].VALUE_1 != 0)) {
                                     delete inputParameters[evaluationFilters[i].NAME];
                              }
                        }
                 }
                 if(Object.keys(inputParameters).length) {
                        errorLog.push("ERROR_ENTER_ALL_INPUT_PARAMETERS");
                 }
          }
          return {error:errorLog, warning:warningLog};
       },
       formatFilterValue: function(value){
    	   if(!value)
    		   return value;
    	   var valueArray = value.split(",");
    	   pattern =/^[1-9][0-9]{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])T([0-1][0-9]|2[0-3])(:[0-5][0-9]){2}[.][0-9]{3}Z$/;
           if(!pattern.test(valueArray[0]))
	    		return value;
    	   var dateArray = [];
    	   for(var key in valueArray)
    		   dateArray.push(new Date(valueArray[key]).toString());
    	   return dateArray.join(",");
       },
       
       activateEvaluation: function() {
    	   var that = this;
    	   var payload = {};
    	   var entity = "ACTIVE_EVALUATIONS";
    	   var sPath = that.getView().getBindingContext().sPath;
           var isFav = that.getView().getBindingContext().getProperty("MANUAL_ENTRY");
           payload.ID = sPath.substring((sPath.indexOf("'")+1),sPath.lastIndexOf("'"));
           var ODataModel = that.oApplicationFacade.getODataModel();
           //odata write
//           ODataModel.create(entity,payload,null,function(data){
//                  sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("ACTIVATE_EV_SUCCESS"));
//                  ODataModel.refresh();
//                  sap.suite.smartbusiness.utils.hashChange({hash:window.location.hash.replace("IS_ACTIVE=0","IS_ACTIVE=1")});
//                  that.byId("evalStatus").setText(that.oApplicationFacade.getResourceBundle().getText("STATUS_ACTIVE"));
//                  that.byId("evalStatus").setState(sap.ui.core.ValueState.Success); 
//                  that.setHeaderFooterOptions(that.oHeaderFooterOptions);
//           },
//           function(err){
//                  sap.suite.smartbusiness.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("ACTIVATE_EV_ERROR"), err.response.body);
//           });
           
           //xsjs write
           sap.suite.smartbusiness.utils.create(sap.suite.smartbusiness.utils.serviceUrl("ACTIVATE_EVALUATION_SERVICE_URI"),payload,null,function(data){
        	   sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("ACTIVATE_EV_SUCCESS"));
        	   ODataModel.refresh();
        	   sap.suite.smartbusiness.utils.replaceHash({hash:window.location.hash.replace("IS_ACTIVE=0","IS_ACTIVE=1")}, true);
        	   that.byId("evalStatus").setText(that.oApplicationFacade.getResourceBundle().getText("STATUS_ACTIVE"));
        	   that.byId("evalStatus").setState(sap.ui.core.ValueState.Success); 
        	   that.setHeaderFooterOptions(that.oHeaderFooterOptions);
           },
           function(err){
        	   sap.suite.smartbusiness.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("ACTIVATE_EV_ERROR"), err.responseText);
           });
           
           
       }

});

