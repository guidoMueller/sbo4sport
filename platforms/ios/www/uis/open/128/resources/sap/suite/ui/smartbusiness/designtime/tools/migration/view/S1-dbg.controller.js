jQuery.sap.require("sap.ca.scfld.md.controller.BaseFullscreenController");
//jQuery.sap.includeStyleSheet("sap/suite/ui/smartbusiness/designtime/kpi/view/KpiParametersCss.css");
sap.ca.scfld.md.controller.BaseFullscreenController.extend("sap.suite.ui.smartbusiness.designtime.tools.migration.view.S1", {

	onInit: function() {
		jQuery.sap.require("sap.m.MessageBox");

		var rootPath = jQuery.sap.getModulePath("sap.suite.ui.smartbusiness.designtime.tools.migration");
		var migrationController=this;
		
		var that = this;

		// set i18n model
		this.oI18nModel = new sap.ui.model.resource.ResourceModel({
			bundleName: "sap/suite/ui/smartbusiness/designtime/tools/migration/i18n/i18n"
		});
		this.getView().setModel(migrationController.oI18nModel, "i18n");



		var oOptions = {
				bSuppressBookmarkButton : {},
				oEditBtn : {
					sI18nBtnTxt : migrationController.oI18nModel.getResourceBundle().getText("BTN_MIGRATE"),
					onBtnPressed : function(evt) {
						migrationController.migrateData();
					}
				},
				buttonList : [{
					sI18nBtnTxt : migrationController.oI18nModel.getResourceBundle().getText("BTN_RESET"),
					onBtnPressed : function(evt) {
						migrationController.clearData();
					}
				}, {
					sI18nBtnTxt : migrationController.oI18nModel.getResourceBundle().getText("BTN_CANCEL"),
					onBtnPressed : function(evt) {
						migrationController.cancel();
					}
				}]
		};
		this.setHeaderFooterOptions(oOptions);

		this.newEvaluationsModel=new sap.ui.model.json.JSONModel();
		var newEvaluationsObject={EVALUATIONS:[
		                                       {
		                                    	   ID: "",
		                                    	   INDICATOR: "",
		                                    	   TITLE: "",
		                                    	   OLD_ID: "",
		                                    	   VALID_ID:""

		                                       }
		                                       ]};
		this.newEvaluationsModel.setData((newEvaluationsObject));

		this._dialog = new sap.m.BusyDialog({});

		//console.log(this.newEvaluationsModel);

		this.getView().byId("kpiInput").setValueHelpOnly(true);

	},

	showBusy: function (op) {

		var migrationController=this;
		var that = this;
		
		if(op=="L")
			this._dialog.setText(migrationController.oI18nModel.getResourceBundle().getText("LOADING_DIALOG_TEXT"));

		if(op=="M")
			this._dialog.setText(migrationController.oI18nModel.getResourceBundle().getText("MIGRATING_DIALOG_TEXT"));

		this._dialog.open();

	},

	hideBusy: function () {
		var that = this;

		this._dialog.close();

	},


	handleKpiValueHelp: function(){
		var migrationController = this;
		var that = this;
		this.selectedKPIs=[];
		this.oldModel = new sap.ui.model.odata.ODataModel("/sap/hba/apps/kpi/s/odata/modeler_services.xsodata", true);
		this.oldModelDDA=new sap.ui.model.odata.ODataModel("/sap/hba/apps/kpi/s/odata/query_view_annotation_services.xsodata", true);

		this.oldModelVariants = new sap.ui.model.odata.ODataModel("/sap/hba/apps/kpi/s/odata/variant_services.xsodata", true);
		this.newModel= new sap.ui.model.odata.ODataModel("/sap/hba/r/sb/core/odata/modeler/SMART_BUSINESS.xsodata", true);


		this.kpiList=new sap.m.ObjectListItem({
			title:"{id}",
			number:"{evalCount}",
			numberUnit:"Evaluations",
			attributes: new sap.m.ObjectAttribute({text:"{text}" }),
		});


		var kPIListDialog = new sap.m.SelectDialog({
			//            contentWidth:"30%",
			title: migrationController.oI18nModel.getResourceBundle().getText("SELECT_KPI_DIALOG"),
			multiSelect:true,
			noDataText: "No data found",
			items: {
				path: "/ActiveKPIs",
				sorter: new sap.ui.model.Sorter({
					path: 'id',
					descending: false
				}),
				template: migrationController.kpiList
			},
			confirm: function(oEvent){

				//       migrationController.selectedKPIs.push(oEvent.getParameter("selectedItem").getProperty("title"));
				var context=oEvent.mParameters.selectedContexts;

				migrationController.selectedKPIs=[];     
				for(var i=0;i<context.length;i++){
					//       migrationController.selectedKPIs.push(context[i].getContent()[0].getContent()[0].getText());
					migrationController.selectedKPIs.push(context[i].sPath.split('\'')[1]);
				}


				if(migrationController.selectedKPIs.length>0){
					var temp;
					var check=0;
					var param1="";
					var j=0;
					for(var i=j;i<migrationController.selectedKPIs.length;i++){


						param1="ID eq '"+migrationController.selectedKPIs[i]+"' and IS_ACTIVE eq 1";
						temp=migrationController.serviceCallDataValidation("/INDICATORS",["$format=json","$filter="+param1],migrationController.newModel);

						if(temp.success){
							//     check=1;
							//     migrationController.selectedKPIs.splice(i, 1);
							check++;
							//     i=i-1;


						}


					}
				}
				//     console.log(migrationController.selectedKPIs);

				if(migrationController.selectedKPIs.length>0){



					if(check>0&&check!=migrationController.selectedKPIs.length){
						sap.m.MessageBox.show(
								migrationController.oI18nModel.getResourceBundle().getText("MSG_FEW_KPIs_MIGRATED"),
								sap.m.MessageBox.Icon.INFORMATION ,
								migrationController.oI18nModel.getResourceBundle().getText("INFORMATION_MSG_TITLE"),
								[sap.m.MessageBox.Action.OK],
								function(){ 
									//migrationController.getView().setBusy(true);
									migrationController.showBusy("L");

									setTimeout(function(){migrationController.bindEvaluations();},2500);}
						);
					}
					if(check==0){

						migrationController.showBusy("L");

						setTimeout(function(){migrationController.bindEvaluations();},2500);
//						sap.m.MessageBox.show(


//						migrationController.oI18nModel.getResourceBundle().getText("MSG_NO_KPIs_MIGRATED"),
//						sap.m.MessageBox.Icon.INFORMATION ,
//						migrationController.oI18nModel.getResourceBundle().getText("INFORMATION_MSG_TITLE"),
//						[sap.m.MessageBox.Action.OK],
//						function(){
//						//  migrationController.getView().setBusy(true);

//						}
//						);
					}


					if(check>0&&check==migrationController.selectedKPIs.length){

						sap.m.MessageBox.show(
								migrationController.oI18nModel.getResourceBundle().getText("MSG_ALL_KPIs_MIGRATED"),
								sap.m.MessageBox.Icon.INFORMATION ,
								migrationController.oI18nModel.getResourceBundle().getText("INFORMATION_MSG_TITLE"),
								[sap.m.MessageBox.Action.OK],
								function(){
									//  migrationController.getView().setBusy(true);
									migrationController.showBusy("L");

									setTimeout(function(){migrationController.bindEvaluations();},2500);
								}
								//      function(){migrationController.bindEvaluations}
						);
					}

				}


			},
			liveChange: function(oEvent){
				var searchValue ="'" + oEvent.getParameter("value").toLowerCase() + "'";
				var oFilter = new sap.ui.model.Filter("tolower(id)", sap.ui.model.FilterOperator.Contains, searchValue);
				var oBinding = oEvent.getSource().getBinding("items");
				oBinding.filter([oFilter]);
			}
		});           


		kPIListDialog.setModel(migrationController.oldModel);
		kPIListDialog.open();
	},

	bindEvaluations: function(){

		var migrationController=this;
		migrationController.testVal=[];

		var that = this;


		var values=[];
		var temp={};

		var viewCount="";

		var oldEvaluationsList= this.getView().byId("oldList");
		var newEvaluationsList= this.getView().byId("newList");


		var popoverModelData={};

		popoverModelData.VIEWS=[];

		var dialogModelData={};
		dialogModelData.CONFIGURATIONS=[];




		var viewPopoverList= new sap.m.List({

		});
		var viewDialogList= new sap.m.List({

		});
		var popoverModel=new sap.ui.model.json.JSONModel();
		this.dialogModel=new sap.ui.model.json.JSONModel();

		this.newConfigurationObject=[];
		migrationController.newConfigurationObject.CONFIGURATIONS=[];

		var popoverStandardListItem=new sap.m.ObjectListItem ({
			title:"{viewName}",
		});

		var viewCustomListGrid = new sap.ui.layout.Grid({
			hSpacing: 1,
			vSpacing: 1, 
			content: [
			          new sap.m.Label({
			        	  text: "{CONFIGURATION_NAME}",
			        	  design:sap.m.LabelDesign.Bold ,
			        	  layoutData : new sap.ui.layout.GridData({
			        		  span: "L12 M12 S12"
			        	  })
			          }),

			          new sap.m.Label({
			        	  text: "*View ID: ",
			        	  layoutData : new sap.ui.layout.GridData({
			        		  span: "L3 M3 S3",
			        		  linebreakL: true,
			        		  linebreakM: true,
			        		  linebreakS: true
			        	  })
			          }),
			          new sap.m.Input({
			        	  type:"Text",

			        	  value:"{VALID_CONFIGURATION_ID}",

			        	  layoutData : new sap.ui.layout.GridData({
			        		  span: "L8 M8 S8",

			        	  }),



			          }),
			          ]
		});


		viewPopoverList.bindItems({
			path: "/VIEWS",
			//     filters: [oFilter],
			sorter: new sap.ui.model.Sorter({
				path: 'viewName',
				descending: false,
				//  group: true
			}),
			template: popoverStandardListItem


		});


		var viewPopover = new sap.m.ResponsivePopover({
			//title: "Edit Configuration",
			//endButton:new sap.m.Button({
//			text:"Close",
//			press:function(){
//			viewPopover.close();}
//			}),
			//     content:[viewDialogList]
		});




		var viewDialogCustomList=new sap.m.CustomListItem({

			content: viewCustomListGrid,

		});


		var viewDialog = new sap.m.Dialog({
			//title: "Edit Configuration",
			endButton:new sap.m.Button({
				text:migrationController.oI18nModel.getResourceBundle().getText("BTN_SAVE_CLOSE"),
				press:function(){
					var x=this.getModel().getData().CONFIGURATIONS;

					for(var i=0;i<x.length;i++){
						for(var j=0;j<migrationController.newConfigurationObject.CONFIGURATIONS.length;j++){
							if(x[i].CONFIGURATION_NAME==migrationController.newConfigurationObject.CONFIGURATIONS[j].CONFIGURATION_NAME){
								migrationController.newConfigurationObject.CONFIGURATIONS[j].CONFIGURATION_ID=x[i].VALID_CONFIGURATION_ID;
							}
						}
					}
					
					viewDialog.close();}
			}),
			//     content:[viewDialogList]
		});

		viewDialog.addContent(viewDialogList);
		viewDialog.setModel(migrationController.dialogModel);


		viewDialogList.bindItems({
			path: "/CONFIGURATIONS",
			//     filters: [oFilter],
			sorter: new sap.ui.model.Sorter({
				path: 'CONFIGURATION_NAME',
				descending: false,
				//  group: true
			}),
			template: viewDialogCustomList


		});

		viewPopover.addContent(viewPopoverList);
		viewPopover.setModel(popoverModel);


		oldEvaluationsList.attachUpdateStarted(function(oEvent) {
			this.setBusy(true);
			this.setNoDataText(migrationController.oI18nModel.getResourceBundle().getText("LIST_LOADING"));
		});
		oldEvaluationsList.attachUpdateFinished(function(oEvent) {
			this.setBusy(false);
			this.setNoDataText("");
			//sap.m.MessageToast.show(JSON.stringify(oEvent.getParameters()))
		});

		newEvaluationsList.attachUpdateStarted(function(oEvent) {
			this.setBusy(true);
			this.setNoDataText(migrationController.oI18nModel.getResourceBundle().getText("LIST_LOADING"));
		});
		newEvaluationsList.attachUpdateFinished(function(oEvent) {
			this.setBusy(false);
			this.setNoDataText("");
			//sap.m.MessageToast.show(JSON.stringify(oEvent.getParameters()))
		});

		for(var i=0;i<migrationController.selectedKPIs.length;i++){
			temp={};  
			temp.operator="EQ";
			temp.value1=migrationController.selectedKPIs[i];
			values.push(temp);
		}

		var oFilter = new sap.ui.model.odata.Filter("objectId", values,false);


		var oldEvaluationsListGrid = new sap.ui.layout.Grid({
			hSpacing: 1,
			vSpacing: 1, 
			content: [
			          new sap.m.Label({
			        	  text: "{evaluationText}",
			        	  design:sap.m.LabelDesign.Bold ,
			        	  layoutData : new sap.ui.layout.GridData({
			        		  span: "L9 M9 S9"
			        	  })
			          }).addStyleClass("listContentTop"),

			          new sap.m.Label({
			        	  text: this.oI18nModel.getResourceBundle().getText("VAR_ID"),
			        	  layoutData : new sap.ui.layout.GridData({
			        		  span: "L2 M2 S3",
			        		  linebreakL: true,
			        		  linebreakM: true,
			        		  linebreakS: true
			        	  })
			          }),
			          new sap.m.Input({
			        	  type:"Text",
			        	  value:"{variantId}",

			        	  layoutData : new sap.ui.layout.GridData({
			        		  span: "L8 M8 S8",
			        	  }),
			        	  editable:false


			          }),

			          new sap.m.Link({
			        	  text:{path:"/variantId",formatter:function(){
			        		  var viewCount;
			        		  var selectedKPI=this.getBindingContext().getProperty("objectId");
			        		  var selectedVariant=this.getBindingContext().getProperty("variantId");
			        		  var temp=migrationController.serviceCallDataValidation("/DDA_CONFIG_PROPERTIES",["$format=json","$filter=(objectId eq '"+selectedKPI+"' and variantId eq '"+selectedVariant+"' and property eq 'queryAnnotationDocURIs')"],migrationController.oldModel);
			        		  //console.log(temp);
			        		  if(temp.success){
			        			  viewCount=temp.data[0].value.split(",").length;
			        			  return(that.oI18nModel.getResourceBundle().getText("CONFIGURED_DD", viewCount));
			        		  }
			        		  else{
			        			  viewCount = 0;
			        			  return(that.oI18nModel.getResourceBundle().getText("CONFIGURED_DD", viewCount));
			        		  }
			        	  }},

			        	  press:function(oEvent){
			        		  //     var capturedSource=oEvent.getSource();
			        		  viewCount="";
			        		  popoverModelData.VIEWS=[];

			        		  var selectedKPI=this.getBindingContext().getProperty("objectId");
			        		  var selectedVariant=this.getBindingContext().getProperty("variantId");
			        		  var temp=migrationController.serviceCallDataValidation("/DDA_CONFIG_PROPERTIES",["$format=json","$filter=(objectId eq '"+selectedKPI+"' and variantId eq '"+selectedVariant+"' and property eq 'queryAnnotationDocURIs')"],migrationController.oldModel);
			        		  //console.log(temp);
			        		  if(temp.success){
			        			  viewCount=temp.data[0].value.split(",").length;
			        			  //viewPopoverList.setHeaderText("Configured Views("+viewCount+")");
			        			  viewPopover.setTitle(that.oI18nModel.getResourceBundle().getText("CONFIGURED_DD", viewCount));

			        			  for(var i=0;i<viewCount;i++){
			        				  var obj={};
			        				  obj.viewName=temp.data[0].value.split(",")[i];
			        				  popoverModelData.VIEWS.push(obj);
			        			  }
			        			  popoverModel.setData(popoverModelData);
//			        			  this.setModel(popoverModel);
//			        			  this.setText("Configured Views("+viewCount+")");
			        			  viewPopover.openBy(oEvent.getSource());
			        			  //     viewPopover.open();


			        		  }else{
			        			  popoverModel.setData(popoverModelData);
			        			  viewCount = 0;
			        			  viewPopover.setTitle(that.oI18nModel.getResourceBundle().getText("CONFIGURED_DD", viewCount));
//			        			  this.setModel(popoverModel);
//			        			  this.setText("Configured Views(0)");
			        			  //viewPopover.open();
//			        			  setTimeout(function()
//			        			  {
			        			  viewPopover.openBy(oEvent.getSource());
//			        			  }(capturedSource),5000);

			        		  }
			        	  },
			        	  layoutData : new sap.ui.layout.GridData({
			        		  span: "L8 M8 S8",
			        		  indent:"L2 M2 S2",
			        		  linebreakL: true,
			        		  linebreakM: true,
			        		  linebreakS: true
			        	  }),
			        	  //editable:false


			          }),

			          ]
		});



		var newEvaluationsListGrid = new sap.ui.layout.Grid({
			hSpacing: 1,
			vSpacing: 1, 
			content: [
			          new sap.m.Label({
			        	  text: "{TITLE}",
			        	  design:sap.m.LabelDesign.Bold ,
			        	  layoutData : new sap.ui.layout.GridData({
			        		  span: "L9 M9 S9"
			        	  })
			          }).addStyleClass("listContentTop"),

			          new sap.m.Label({
			        	  text: "*" + this.oI18nModel.getResourceBundle().getText("EVAL_ID"),
			        	  layoutData : new sap.ui.layout.GridData({
			        		  span: "L3 M3 S3",
			        		  linebreakL: true,
			        		  linebreakM: true,
			        		  linebreakS: true
			        	  })
			          }),
			          new sap.m.Input({
			        	  type:"Text",

			        	  value:"{ID}",
			        	  layoutData : new sap.ui.layout.GridData({
			        		  span: "L8 M8 S8",

			        		  liveChange: function(e){
			        			  //     console.log(e);
			        		  },
			        		  change: function(e){
			        			  //            console.log(e);
			        		  }
			        	  }),



			          }),


			          new sap.m.Link({
			        	  text:{path:"/variantId",formatter:function(){
			        		  var viewCount;
			        		  var selectedKPI=this.getBindingContext().getProperty("OLD_ID").split("~")[0];
			        		  var selectedVariant=this.getBindingContext().getProperty("OLD_ID").split("~")[1];
			        		  var temp=migrationController.serviceCallDataValidation("/DDA_CONFIG_PROPERTIES",["$format=json","$filter=(objectId eq '"+selectedKPI+"' and variantId eq '"+selectedVariant+"' and property eq 'queryAnnotationDocURIs')"],migrationController.oldModel);
			        		  //console.log(temp);
			        		  if(temp.success){
			        			  viewCount=temp.data[0].value.split(",").length;
			        			  return(that.oI18nModel.getResourceBundle().getText("CONFIGURED_DD", viewCount));
			        		  }
			        		  else{
			        			  viewCount = 0;
			        			  return(that.oI18nModel.getResourceBundle().getText("CONFIGURED_DD", viewCount));
			        		  }
			        	  }},
			        	  press:function(oEvent){
			        		  viewCount="";
			        		  dialogModelData.CONFIGURATIONS=[];

			        		  var selectedKPI=this.getBindingContext().getProperty("OLD_ID").split("~")[0];
			        		  var selectedVariant=this.getBindingContext().getProperty("OLD_ID").split("~")[1];
			        		  var temp=migrationController.serviceCallDataValidation("/DDA_CONFIG_PROPERTIES",["$format=json","$filter=(objectId eq '"+selectedKPI+"' and variantId eq '"+selectedVariant+"' and property eq 'queryAnnotationDocURIs')"],migrationController.oldModel);
			        		  //     console.log(temp);
			        		  if(temp.success){
			        			  viewCount=temp.data[0].value.split(",").length;
			        			  //viewPopoverList.setHeaderText("Configured Views("+viewCount+")");
			        			  
			        			  viewDialog.setTitle(this.oI18nModel.getResourceBundle().getText("CONFIGURED_DD", viewCount));


			        			  var count=0;
			        			  for(var i=0;i<viewCount;i++){
			        				  count=0;
			        				  for(var j=0;j<migrationController.newConfigurationObject.CONFIGURATIONS.length;j++){
			        					  if(migrationController.newConfigurationObject.CONFIGURATIONS[j].CONFIGURATION_NAME==temp.data[0].value.split(",")[i]){
			        						  count++;
			        						  var c = migrationController.newConfigurationObject.CONFIGURATIONS[j].VALID_CONFIGURATION_ID;
			        						  migrationController.newConfigurationObject.CONFIGURATIONS[j].VALID_CONFIGURATION_ID = migrationController.newConfigurationObject.CONFIGURATIONS[j].CONFIGURATION_ID;
			        						  migrationController.newConfigurationObject.CONFIGURATIONS[j].CONFIGURATION_ID = c;
			        						  dialogModelData.CONFIGURATIONS.push(jQuery.extend({},migrationController.newConfigurationObject.CONFIGURATIONS[j]));
			        						  
			        						  break;
			        					  }

			        				  }
			        				  if(count==0){
			        					  var obj={};
			        					  obj.CONFIGURATION_NAME=temp.data[0].value.split(",")[i];
			        					  obj.CONFIGURATION_ID=temp.data[0].objectId+"~"+temp.data[0].variantId+"_"+temp.data[0].value.split(",")[i];
			        					  obj.VALID_CONFIGURATION_ID=this.getBindingContext().getProperty("VALID_ID")+"."+temp.data[0].value.split(",")[i];
			        					  obj.EVALUATION_ID=this.getBindingContext().getProperty("OLD_ID");
			        					  dialogModelData.CONFIGURATIONS.push(obj);

			        					  migrationController.newConfigurationObject.CONFIGURATIONS.push(jQuery.extend({},obj));
			        				  }
			        			  }



			        			  migrationController.dialogModel.setData(dialogModelData);
//			        			  this.setModel(popoverModel);
//			        			  this.setText("Configured Views("+viewCount+")");
			        			  viewDialog.open();


			        		  }else{
			        			  migrationController.dialogModel.setData(dialogModelData);
			        			  viewCount = 0;
			        			  viewDialog.setTitle(that.oI18nModel.getResourceBundle().getText("CONFIGURED_DD", viewCount));
//			        			  this.setModel(popoverModel);
//			        			  this.setText("Configured Views(0)");
			        			  viewDialog.open();
			        		  }
			        	  },
			        	  layoutData : new sap.ui.layout.GridData({
			        		  span: "L8 M8 S8",
			        		  indent:"L3 M3 S3",
			        		  linebreakL: true,
			        		  linebreakM: true,
			        		  linebreakS: true
			        	  }),
			          })
			          ]
		});



		var newCustomEvaluationsList=new sap.m.CustomListItem({

			content: newEvaluationsListGrid,

		});

		var customOldEvaluationList=new sap.m.CustomListItem({

			content: oldEvaluationsListGrid,


		});







		newEvaluationsList.setModel(this.newEvaluationsModel);
		//     newEvaluationsList.unbindItems();
		newEvaluationsList.bindItems({
			path: "/EVALUATIONS",
			//     filters: [oFilter],
			sorter: new sap.ui.model.Sorter({
				path: 'INDICATOR',
				descending: false,
				group: true
			}),
			template: newCustomEvaluationsList


		});


		oldEvaluationsList.setModel(migrationController.oldModel);
		//oldEvaluationsList.setModel(migrationController.oldModelDDA,"ModelDDA");


		oldEvaluationsList.bindItems({
			path:"/ActiveEvaluations",
			filters:[ oFilter],
			sorter: new sap.ui.model.Sorter({
				path: 'objectId',
				descending: false,
				group: true
			}),
			template: customOldEvaluationList
		});



		this.prepareTempDataForNewList();
	},

	prepareTempDataForNewList:function(){

		var newEvaluationsObject={};
		newEvaluationsObject.EVALUATIONS=[];

		var that = this;
		var migrationController=this;
		migrationController.objectToPush={};
		migrationController.objectToPush.INDICATORS=[];
		migrationController.objectToPush.INDICATOR_TEXTS=[];
		migrationController.objectToPush.EVALUATIONS=[];
		migrationController.objectToPush.EVALUATION_TEXTS=[];
		migrationController.objectToPush.EVALUATION_FILTERS=[];
		migrationController.objectToPush.EVALUATION_VALUES=[];
		migrationController.objectToPush.TAGS=[];

		var KPIData=[];
		var KPITextData=[];

		var noOfEvaluations=0;
		var EvaluationData=[];


		var VariantData=[];

		var KPIObjectResponse={};
		var EvaluationObjectResponse={};
		var KPITextsObjectResponse={};
		var KPIObjectParameters="";
		var EvaluationObjectParameters="";
		var KPITextsObjectParameters="";

		for(var i=0;i<migrationController.selectedKPIs.length;i++){


			if(i<(migrationController.selectedKPIs.length-1)){
				KPIObjectParameters+="id eq '"+migrationController.selectedKPIs[i]+"' or ";
				EvaluationObjectParameters+="objectId eq '"+migrationController.selectedKPIs[i]+"' or ";
			}

			else{
				KPIObjectParameters+="id eq '"+migrationController.selectedKPIs[i]+"'";
				EvaluationObjectParameters+="objectId eq '"+migrationController.selectedKPIs[i]+"'";
			}
		}

		KPIObjectResponse=migrationController.serviceCallDataValidation("/ActiveKPIs",["$format=json","$filter=("+KPIObjectParameters+")"],migrationController.oldModel);
		EvaluationObjectResponse=migrationController.serviceCallDataValidation("/ActiveEvaluations",["$format=json","$filter=("+EvaluationObjectParameters+")"],migrationController.oldModel);
		KPITextsObjectResponse=migrationController.serviceCallDataValidation("/ActiveKPIsTexts",["$format=json","$filter=("+KPIObjectParameters+")"],migrationController.oldModel);


		if(KPIObjectResponse.success){
			KPIData=KPIObjectResponse.data;
		}
		if(EvaluationObjectResponse.success){
			EvaluationData=EvaluationObjectResponse.data;
		}

		if(KPITextsObjectResponse.success){
			KPITextData=KPITextsObjectResponse.data;
		}


		if(KPIData.length>0&&KPITextData.length>0){

			for(var i=0;i<KPITextData.length;i++){

				migrationController.objectToPush.INDICATOR_TEXTS.push(migrationController.migrateIndicatorTexts(KPITextData[i]));

			}
		}


		if(KPIData.length>0){

			for(var i=0;i<KPIData.length;i++){
				var tempTags=[];
				migrationController.objectToPush.INDICATORS.push(migrationController.migrateIndicator(KPIData[i]));

				//tempIndicatorTexts=migrationController.migrateIndicatorTexts(KPIData[i]);

				tempTags=migrationController.migrateTags(KPIData[i]);
				if(tempTags.length>0){
					for(var k=0;k<tempTags.length;k++){
						migrationController.objectToPush.TAGS.push(tempTags[k]);
					}
				}

				if(EvaluationData.length>0){

					for(var j=0;j<EvaluationData.length;j++){
						if(KPIData[i].id==EvaluationData[j].objectId){
							newEvaluationsObject.EVALUATIONS.push(migrationController.migrateTempEvaluation(KPIData[i],EvaluationData[j]));

						}

					}
				}
			}

		}

		this.newEvaluationsModel.setData(newEvaluationsObject);
		migrationController.hideBusy();
		if(newEvaluationsObject.EVALUATIONS.length==0){
			sap.m.MessageBox.show(
					migrationController.oI18nModel.getResourceBundle().getText("MSG_NO_EVALUATIONS"),
					sap.m.MessageBox.Icon.INFORMATION ,
					migrationController.oI18nModel.getResourceBundle().getText("INFORMATION_MSG_TITLE"),
					[sap.m.MessageBox.Action.OK]
					//      function(){migrationController.bindEvaluations}
			);
		}
		//console.log(newEvaluationsObject);
	},




	prepareMigrationData:function(){


		var migrationController=this;

		var that = this;
		var newEvaluationsObject=this.newEvaluationsModel.getData();

		var newConfigurationObject=migrationController.newConfigurationObject.CONFIGURATIONS;


		if(migrationController.objectToPush.EVALUATIONS.length>0)
			migrationController.objectToPush.EVALUATIONS=[];

		migrationController.objectToPush.EVALUATION_TEXTS=[];
		migrationController.objectToPush.EVALUATION_FILTERS=[];
		migrationController.objectToPush.EVALUATION_VALUES=[];

		migrationController.objectToPush.DDA_MASTER=[];
		migrationController.objectToPush.DDA_CONFIG=[];
		migrationController.objectToPush.DDA_FILTERS=[];
		migrationController.objectToPush.DDA_HEADER=[];
		migrationController.objectToPush.DDA_CHART=[];
		migrationController.objectToPush.DDA_COLUMNS=[];

		migrationController.objectToPush.DDA_MASTER_TEXT=[];


		var KPIData=[];

		var noOfEvaluations=0;
		var EvaluationData=[];

		var EvaluationTextData;
		var VariantData=[];

		var KPIObjectResponse={};
		var EvaluationObjectResponse={};
		var EvaluationsTextsObjectResponse={};
		var VariantValuesObjectResponse={};
		var DDAObjectResponse={};
		var viewObjectResponse={};
		var viewPropertiesObjectResponse={};

		var KPIObjectParameters="";
		var EvaluationObjectParameters="";
		var EvaluationsTextsObjectParameters="";
		var VariantValuesObjectParameters="";
		var DDAObjectParameters="";
		var viewObjectParameters="";
		var viewPropertiesObjectParameters="";

		for(var i=0;i<migrationController.selectedKPIs.length;i++){


			if(i<(migrationController.selectedKPIs.length-1)){
				KPIObjectParameters+="id eq '"+migrationController.selectedKPIs[i]+"' or ";
				EvaluationObjectParameters+="objectId eq '"+migrationController.selectedKPIs[i]+"' or ";

			}

			else{
				KPIObjectParameters+="id eq '"+migrationController.selectedKPIs[i]+"'";
				EvaluationObjectParameters+="objectId eq '"+migrationController.selectedKPIs[i]+"'";
			}
		}



		KPIObjectResponse=migrationController.serviceCallDataValidation("/ActiveKPIs",["$format=json","$filter=("+KPIObjectParameters+")"],migrationController.oldModel);
		EvaluationObjectResponse=migrationController.serviceCallDataValidation("/ActiveEvaluations",["$format=json","$filter=("+EvaluationObjectParameters+")"],migrationController.oldModel);
		EvaluationsTextsObjectResponse=migrationController.serviceCallDataValidation("/ActiveEvaluationsTexts",["$format=json","$filter=("+EvaluationObjectParameters+")"],migrationController.oldModel);

		//=migrationController.serviceCallDataValidation("/QUERYVIEWANNOTATION",["$format=json","$filter=("+param2+")"],migrationController.oldModelDDA);



		if(KPIObjectResponse.success){
			KPIData=KPIObjectResponse.data;
		}
		if(EvaluationObjectResponse.success){
			EvaluationData=EvaluationObjectResponse.data;
		}
		if(EvaluationsTextsObjectResponse.success){
			EvaluationTextData=EvaluationsTextsObjectResponse.data;
		}

		if(EvaluationTextData&&EvaluationData){
			if(EvaluationTextData.length>0&&EvaluationData.length>0){

				for(var i=0;i<EvaluationTextData.length;i++){

					migrationController.objectToPush.EVALUATION_TEXTS.push(migrationController.migrateEvaluationTexts(EvaluationTextData[i],newEvaluationsObject.EVALUATIONS));
				}

			}
		}

		if(KPIData.length>0&&EvaluationData.length>0){

			for(var i=0;i<KPIData.length;i++){

				for(var j=0;j<EvaluationData.length;j++){
					if(KPIData[i].id==EvaluationData[j].objectId){

						var tempEvaluationValues=[];
						migrationController.objectToPush.EVALUATIONS.push(migrationController.migrateEvaluation(KPIData[i],EvaluationData[j],newEvaluationsObject.EVALUATIONS));

						tempEvaluationValues=migrationController.migrateEvaluationValues(KPIData[i],EvaluationData[j],newEvaluationsObject.EVALUATIONS);
						for(var k=0;k<tempEvaluationValues.length;k++){
							migrationController.objectToPush.EVALUATION_VALUES.push(tempEvaluationValues[k]);

						}

					}

				}

			}






			for(var j=0;j<EvaluationData.length;j++){
				VariantValuesObjectParameters="id eq '"+EvaluationData[j].variantId+"'";
				VariantValuesObjectResponse=migrationController.serviceCallDataValidation("/VARIANT_VALUES",["$format=json","$filter=("+VariantValuesObjectParameters+")"],migrationController.oldModelVariants);
				if(VariantValuesObjectResponse.success){
					var tempEvaluationFilters=[];
					tempEvaluationFilters=migrationController.migrateEvaluationFilters(EvaluationData[j],VariantValuesObjectResponse.data,newEvaluationsObject.EVALUATIONS);
					for(var k=0;k<tempEvaluationFilters.length;k++){
						migrationController.objectToPush.EVALUATION_FILTERS.push(tempEvaluationFilters[k]);

					}
				}
			}

			var viewCount="";

			for(var j=0;j<EvaluationData.length;j++){

				var temp=migrationController.serviceCallDataValidation("/DDA_CONFIG_PROPERTIES",["$format=json","$filter=(objectId eq '"+EvaluationData[j].objectId+"' and variantId eq '"+EvaluationData[j].variantId+"' and property eq 'queryAnnotationDocURIs')"],migrationController.oldModel);



				DDAObjectParameters="objectId eq '"+EvaluationData[j].objectId+"' and variantId eq '"+EvaluationData[j].variantId+"'";
				DDAObjectResponse=migrationController.serviceCallDataValidation("/DDA_CONFIG_PROPERTIES",["$format=json","$filter=("+DDAObjectParameters+")"],migrationController.oldModel);


				if(temp.success&&DDAObjectResponse.success){
					var dda={};
					var counts=0;
					var countq=0;
					var validEval="";
					var E_ID;

					var validVariant=temp.data[0].variantId.split(' ').join('');
					var variantToJoin="";

					if(validVariant.indexOf('.')>-1){
						variantToJoin=validVariant.split('.');
						validEval=E_ID||(temp.data[0].objectId + "."+variantToJoin[variantToJoin.length-1]);

					}
					else{
						validEval=E_ID||(temp.data[0].objectId + "."+validVariant);

					}
					//console.log(temp);

					viewCount=temp.data[0].value.split(",").length;

					//            if(viewCount!=newConfigurationObject.length){

					for(var s=0;s<viewCount;s++){
						countq=0;
						counts=0;
						for(var z=0;z<newConfigurationObject.length;z++){
							if(newConfigurationObject[z].CONFIGURATION_NAME==temp.data[0].value.split(",")[s])
							{counts++;
							break;


							}

						}
						if(counts==0){
							dda={};

							dda.CONFIGURATION_ID=validEval+"."+temp.data[0].value.split(",")[s];
							dda.CONFIGURATION_NAME=temp.data[0].value.split(",")[s];
							for(var q=0;q<newEvaluationsObject.EVALUATIONS.length;q++){

								if((EvaluationData[j].objectId+"~"+EvaluationData[j].variantId)==newEvaluationsObject.EVALUATIONS[q].OLD_ID)
								{
									countq++;
									dda.EVALUATION_ID=newEvaluationsObject.EVALUATIONS[q].OLD_ID;
									break;
								}
							}
							if(countq==0)
							{
								dda.EVALUATION_ID=EvaluationData[j].objectId+"~"+EvaluationData[j].variantId;
								break
							}

							newConfigurationObject.push(jQuery.extend({},dda));
						}
					}
					//     }


					viewObjectParameters="";
					for(var k=0;k<viewCount;k++){

						if(k<(viewCount-1)){
							viewObjectParameters+="queryViewAnnotationDocumentURI eq '"+temp.data[0].value.split(",")[k]+"' or ";

						}

						else{
							viewObjectParameters+="queryViewAnnotationDocumentURI eq '"+temp.data[0].value.split(",")[k]+"'";
						}

					}
					if(j==0||viewPropertiesObjectParameters=="")
						viewPropertiesObjectParameters=viewObjectParameters;
					else   
						viewPropertiesObjectParameters+=" or "+viewObjectParameters;

					if(viewObjectParameters.length>0)
					{
						viewObjectResponse=migrationController.serviceCallDataValidation("/QUERYVIEWANNOTATION",["$format=json","$expand=QUERY_VIEW_PROPERTIES&$filter=("+viewObjectParameters+")"],migrationController.oldModelDDA);



						if(viewObjectResponse.success)
							migrationController.migrateDDA(DDAObjectResponse.data,viewObjectResponse.data,newEvaluationsObject.EVALUATIONS,newConfigurationObject);
					}
//					tempEvaluationValues=migrationController.migrateEvaluationValues(KPIData[i],EvaluationData[j],newEvaluationsObject.EVALUATIONS);
//					for(var k=0;k<tempEvaluationValues.length;k++){
//					migrationController.objectToPush.EVALUATION_VALUES.push(tempEvaluationValues[k]);

//					}
				}      


			}

			//console.log(newConfigurationObject);
			if(viewPropertiesObjectParameters.length>0){
				viewPropertiesObjectResponse=migrationController.serviceCallDataValidation("/QUERYVIEWANNOTATIONTEXTS",["$format=json","$filter=("+viewPropertiesObjectParameters+")"],migrationController.oldModelDDA);
				var tempDDAText=[];
				if(viewPropertiesObjectResponse.success){
					tempDDAText=migrationController.migrateDDAText(viewPropertiesObjectResponse.data,newConfigurationObject,newEvaluationsObject.EVALUATIONS);
					for(var k=0;k<tempDDAText.length;k++){
						migrationController.objectToPush.DDA_MASTER_TEXT.push(tempDDAText[k]);

					}
				}
			}





		}




		//console.log(migrationController.objectToPush);



	},






	migrateIndicator: function(K, mode) {
		mode = mode || 1;
		var INDICATORS = {};
		INDICATORS.ID=K.id;
		INDICATORS.IS_ACTIVE=mode;
		INDICATORS.TYPE="KPI";
		INDICATORS.TITLE=K.text;
		INDICATORS.DESCRIPTION=K.description||"";
		if(Number(K.improvementDirection) == 0) {
			INDICATORS.GOAL_TYPE="RA";
		}
		else if(Number(K.improvementDirection) == 1) {
			INDICATORS.GOAL_TYPE="MA";
		}
		else {
			INDICATORS.GOAL_TYPE="MI";
		}
		INDICATORS.DATA_SPECIFICATION="";
		INDICATORS.ODATA_URL=K.queryServiceURI;
		INDICATORS.ODATA_ENTITYSET=K.queryQualifiedResultEntitySetName;
		INDICATORS.VIEW_NAME="";
		INDICATORS.COLUMN_NAME=K.queryResultMeasurePropertyName;
		INDICATORS.OWNER_NAME=K.owner||"";
		INDICATORS.OWNER_ID="";
		INDICATORS.ENTITY_TYPE="";
		INDICATORS.OWNER_E_MAIL="";

		INDICATORS.ODATA_PROPERTY="";
		INDICATORS.SEMANTIC_OBJECT=K.semanticObject;
		INDICATORS.ACTION=K.semanticObjectAlias;

		return INDICATORS;
	},

	migrateIndicatorTexts:function(K){

		var INDICATOR_TEXTS={};

		INDICATOR_TEXTS.ID=K.id;
		INDICATOR_TEXTS.IS_ACTIVE=1;
		INDICATOR_TEXTS.LANGUAGE=K.sapLanguageKey;
		INDICATOR_TEXTS.TITLE=K.text;
		INDICATOR_TEXTS.DESCRIPTION=K.description||"";


		return INDICATOR_TEXTS;

	},

	migrateTags: function(K, mode, type) {
		mode = mode || 1;
		type = type || "IN";
		var TAGS = [];
		var tags = {};

		if(K.tags)
		{
			if(K.tags.length>0){
				var tagList = K.tags.split(",");
				for(var i=0,l=tagList.length; i<l; i++) {
					tags.ID=K.id;
					tags.IS_ACTIVE=mode;
					tags.TYPE=type;
					tags.TAG=tagList[i];
					TAGS.push(tags);
					tags = {};
				}
				return TAGS;
			}
		}
		return TAGS;
	},

	migrateEvaluation: function(K, E,Etemp, mode) {
		mode = mode || 1;
		var EVALUATIONS = {};
		var E_ID;

		for(var i=0;i<Etemp.length;i++){
			if((E.objectId + "~" + E.variantId)==Etemp[i].OLD_ID)
				E_ID=Etemp[i].ID;

		}

		var variantToJoin="";
		var validVariant=E.variantId.split(' ').join('');
		if(validVariant.indexOf('.')>-1){
			variantToJoin=validVariant.split('.');
			EVALUATIONS.ID=E_ID||(E.objectId + "."+variantToJoin[variantToJoin.length-1]);

		}
		else{
			EVALUATIONS.ID=E_ID||(E.objectId + "."+validVariant);

		}


		//EVALUATIONS.ID=E_ID||(E.objectId + "~" + E.variantId);
		EVALUATIONS.IS_ACTIVE=mode;
		EVALUATIONS.INDICATOR=E.objectId;
		EVALUATIONS.INDICATOR_TYPE="KPI";
		EVALUATIONS.TITLE=E.evaluationText;
		EVALUATIONS.DESCRIPTION="";  
		EVALUATIONS.VIEW_NAME="";
		EVALUATIONS.SCALING=E.scaleFactor; 
		EVALUATIONS.ODATA_URL=K.queryServiceURI;
		EVALUATIONS.ODATA_ENTITYSET=K.queryQualifiedResultEntitySetName;
		EVALUATIONS.COLUMN_NAME=K.queryResultMeasurePropertyName;
		EVALUATIONS.OWNER_NAME=K.owner||"";
		EVALUATIONS.OWNER_ID=""
			EVALUATIONS.OWNER_E_MAIL=""
				EVALUATIONS.ENTITY_TYPE="";
		if(Number(K.improvementDirection) == 0) {
			EVALUATIONS.GOAL_TYPE="RA";
		}
		else if(Number(K.improvementDirection) == 1) {
			EVALUATIONS.GOAL_TYPE="MA";
		}
		else {
			EVALUATIONS.GOAL_TYPE="MI";
		}
		EVALUATIONS.DATA_SPECIFICATION="";
		EVALUATIONS.ODATA_PROPERTY="";
		EVALUATIONS.SEMANTIC_OBJECT=K.semanticObject;
		EVALUATIONS.ACTION=K.semanticObjectAlias;
		EVALUATIONS.VALUES_SOURCE="FIXED";

		return EVALUATIONS;
	},

	migrateEvaluationTexts:function(E,Etemp){

		var E_ID;
		var EVALUATION_TEXTS={};


		for(var i=0;i<Etemp.length;i++){
			if((E.objectId + "~" + E.variantId)==Etemp[i].OLD_ID){
				E_ID=Etemp[i].ID;
				break;
			}

		}

		var variantToJoin="";
		var validVariant=E.variantId.split(' ').join('');
		if(validVariant.indexOf('.')>-1){
			variantToJoin=validVariant.split('.');
			EVALUATION_TEXTS.ID=E_ID||(E.objectId + "."+variantToJoin[variantToJoin.length-1]);

		}
		else{
			EVALUATION_TEXTS.ID=E_ID||(E.objectId + "."+validVariant);

		}

		//            EVALUATION_TEXTS.ID=(E.objectId + "~" + E.variantId);
		EVALUATION_TEXTS.IS_ACTIVE=1;
		EVALUATION_TEXTS.LANGUAGE=E.sapLanguageKey;
		EVALUATION_TEXTS.TITLE=E.evaluationText;
		EVALUATION_TEXTS.DESCRIPTION="";


		return EVALUATION_TEXTS;

	},

	migrateTempEvaluation: function(K, E, mode) {
		mode = mode || 1;
		var EVALUATIONS = {};


		var variantToJoin="";
		var validVariant=E.variantId.split(' ').join('');
		if(validVariant.indexOf('.')>-1){
			variantToJoin=validVariant.split('.');
			EVALUATIONS.ID=E.objectId + "."+variantToJoin[variantToJoin.length-1];
			EVALUATIONS.VALID_ID=E.objectId + "." + variantToJoin[variantToJoin.length-1];
		}
		else{
			EVALUATIONS.ID=E.objectId + "."+validVariant;
			EVALUATIONS.VALID_ID=E.objectId + "." + validVariant;
		}

		EVALUATIONS.OLD_ID=E.objectId + "~" + E.variantId;
		EVALUATIONS.VARIANT_ID=validVariant;
		EVALUATIONS.INDICATOR=E.objectId;
		EVALUATIONS.TITLE=E.evaluationText;
		return EVALUATIONS;
	},


	migrateEvaluationValues: function(K, E,Etemp, mode) {
		mode = mode || 1;
		var EVALUATION_VALUES=[];
		var evaluationValues = {};

		var E_ID;
		for(var i=0;i<Etemp.length;i++){
			if((E.objectId + "~" + E.variantId)==Etemp[i].OLD_ID)
				E_ID=Etemp[i].ID;

		}

		var alterEval="";
		var variantToJoin="";
		var validVariant=E.variantId.split(' ').join('');
		if(validVariant.indexOf('.')>-1){
			variantToJoin=validVariant.split('.');
			alterEval=E_ID||(E.objectId + "."+variantToJoin[variantToJoin.length-1]);

		}
		else{
			alterEval=E_ID||(E.objectId + "."+validVariant);

		}

		//EVALUATIONS.ID=E_ID||(E.objectId + "~" + E.variantId);
		var count = 0;

		if((E.toleranceRangeHighValue == 0) || E.toleranceRangeHighValue){
			evaluationValues.ID=alterEval;
			evaluationValues.IS_ACTIVE=mode;
			evaluationValues.TYPE="WH";
			evaluationValues.FIXED=E.toleranceRangeHighValue;
			evaluationValues.COLUMN_NAME="";
			evaluationValues.ODATA_PROPERTY="";
			EVALUATION_VALUES.push(evaluationValues);
			evaluationValues = {};
		}
		if((E.deviationRangeHighValue == 0) || E.deviationRangeHighValue){   
			evaluationValues.ID=alterEval;
			evaluationValues.IS_ACTIVE=mode;
			evaluationValues.TYPE="CH";
			evaluationValues.FIXED=E.deviationRangeHighValue;
			evaluationValues.COLUMN_NAME="";
			evaluationValues.ODATA_PROPERTY="";
			EVALUATION_VALUES.push(evaluationValues);
			evaluationValues = {};
		}

		if((E.toleranceRangeLowValue == 0) || E.toleranceRangeLowValue){     
			evaluationValues.ID=alterEval;
			evaluationValues.IS_ACTIVE=mode;
			evaluationValues.TYPE="WL";
			evaluationValues.FIXED=E.toleranceRangeLowValue;
			evaluationValues.COLUMN_NAME="";
			evaluationValues.ODATA_PROPERTY="";
			EVALUATION_VALUES.push(evaluationValues);
			evaluationValues = {};
		}
		if((E.deviationRangeLowValue == 0) || E.deviationRangeLowValue){     
			evaluationValues.ID=alterEval;
			evaluationValues.IS_ACTIVE=mode;
			evaluationValues.TYPE="CL";
			evaluationValues.FIXED=E.deviationRangeLowValue;
			evaluationValues.COLUMN_NAME="";
			evaluationValues.ODATA_PROPERTY="";
			EVALUATION_VALUES.push(evaluationValues);
			evaluationValues = {};
		}
		if((E.target == 0) || E.target) {
			evaluationValues.ID=alterEval;
			evaluationValues.IS_ACTIVE=mode;
			evaluationValues.TYPE="TA";
			evaluationValues.FIXED=E.target;
			evaluationValues.COLUMN_NAME="";
			evaluationValues.ODATA_PROPERTY="";
			EVALUATION_VALUES.push(evaluationValues);
			evaluationValues = {};
		}
		return EVALUATION_VALUES;
	},


	migrateEvaluationFilters: function(E, V,Etemp, mode) {
		mode = mode || 1;
		var EVALUATION_FILTERS = [];
		var E_ID;
		for(var i=0;i<Etemp.length;i++){
			if((E.objectId + "~" + E.variantId)==Etemp[i].OLD_ID)
				E_ID=Etemp[i].ID;

		}

		var alterEval="";
		var variantToJoin="";
		var validVariant=E.variantId.split(' ').join('');
		if(validVariant.indexOf('.')>-1){
			variantToJoin=validVariant.split('.');
			alterEval=E_ID||(E.objectId + "."+variantToJoin[variantToJoin.length-1]);

		}
		else{
			alterEval=E_ID||(E.objectId + "."+validVariant);

		}

		var evaluationFilters = {};
		for(var i=0,l=V.length; i<l; i++) {
			evaluationFilters.ID=alterEval;
			evaluationFilters.IS_ACTIVE=mode;

//			if(V[i].filterPropertyName=="F")
//	evaluationFilters.NAME="FI";
//			if(V[i].filterPropertyName=="I")
//			evaluationFilters.NAME="PA";

			evaluationFilters.NAME=V[i].filterPropertyName

			evaluationFilters.VALUE_1=V[i].value;
			evaluationFilters.VALUE_2=V[i].valueTo||"";
			evaluationFilters.OPERATOR=V[i].comparator;

			if(V[i].type=="F")
				evaluationFilters.TYPE="FI";
			if(V[i].type=="I")
				evaluationFilters.TYPE="PA";

			EVALUATION_FILTERS.push(evaluationFilters);
			evaluationFilters = {};
		}
		return EVALUATION_FILTERS;
	},

	migrateDDAText:function(C,Ctemp,Etemp){

		var migrationController=this;
		var DDA_MASTER_TEXT=[];
		var DDA_TEXT={};

		var C_ID=[];
		var E_ID=[];
		for(var j=0;j<C.length;j++){
			for(var i=0;i<Ctemp.length;i++){

				if(C[j].queryViewAnnotationDocumentURI==Ctemp[i].CONFIGURATION_NAME)
				{      
					C_ID[j]=Ctemp[i].CONFIGURATION_ID;
					//E_ID[j]=Ctemp[i].EVALUATION_ID;
					for(var k=0;k<Etemp.length;k++){

						if(Ctemp[i].EVALUATION_ID==Etemp[k].OLD_ID)
						{      
							E_ID[j]=Etemp[k].ID;
							break;
							//E_ID[j]=Ctemp[i].EVALUATION_ID;
						}

					}
				}



			}


		}

		for(var i=0;i<C.length;i++){
			DDA_TEXT={};
			DDA_TEXT.CONFIGURATION_ID=C_ID[i];
			DDA_TEXT.EVALUATION_ID=E_ID[i];
			//DDA_TEXT.CONFIGURATION_ID=C[i].queryViewAnnotationDocumentURI;
			DDA_TEXT.SAP_LANGUAGE_KEY=C[i].sapLanguageKey;
			DDA_TEXT.TEXT=C[i].title;
			DDA_TEXT.IS_ACTIVE = 1;

			DDA_MASTER_TEXT.push(DDA_TEXT);
		}

		return DDA_MASTER_TEXT;

	},


	migrateDDAText:function(C,Ctemp,Etemp){

		var migrationController=this;
		var DDA_MASTER_TEXT=[];
		var DDA_TEXT={};

		var C_ID=[];
		var E_ID=[];
		for(var j=0;j<C.length;j++){
			for(var i=0;i<Ctemp.length;i++){

				if(C[j].queryViewAnnotationDocumentURI==Ctemp[i].CONFIGURATION_NAME)
				{      
					C_ID[j]=Ctemp[i].CONFIGURATION_ID;
					//E_ID[j]=Ctemp[i].EVALUATION_ID;
					for(var k=0;k<Etemp.length;k++){

						if(Ctemp[i].EVALUATION_ID==Etemp[k].OLD_ID)
						{      
							E_ID[j]=Etemp[k].ID;
							break;
							//E_ID[j]=Ctemp[i].EVALUATION_ID;
						}

					}
				}



			}


		}

		for(var i=0;i<C.length;i++){
			DDA_TEXT={};
			DDA_TEXT.CONFIGURATION_ID=C_ID[i];
			DDA_TEXT.EVALUATION_ID=E_ID[i];
			//DDA_TEXT.CONFIGURATION_ID=C[i].queryViewAnnotationDocumentURI;
			DDA_TEXT.SAP_LANGUAGE_KEY=C[i].sapLanguageKey;
			DDA_TEXT.TEXT=C[i].title;
			DDA_TEXT.IS_ACTIVE = 1;

			DDA_MASTER_TEXT.push(DDA_TEXT);
		}

		return DDA_MASTER_TEXT;

	},


	migrateDDA:function(DDA, QVA,Etemp,Ctemp) {

		var migrationController=this;
		var ddaObj = {};
		var qvaArr = [];

		var qvaObj = {};

		var E_ID;
		for(var i=0;i<Etemp.length;i++){
			if((DDA[0].objectId + "~" + DDA[0].variantId)==Etemp[i].OLD_ID)
				E_ID=Etemp[i].ID;

		}

		var alterEval="";
		var variantToJoin="";
		var validVariant=DDA[0].variantId.split(' ').join('');
		if(validVariant.indexOf('.')>-1){
			variantToJoin=validVariant.split('.');
			alterEval=E_ID||(DDA[0].objectId + "."+variantToJoin[variantToJoin.length-1]);

		}
		else{
			alterEval=E_ID||(DDA[0].objectId + "."+validVariant);

		}


		for(var i=0,l=QVA.length; i<l; i++) {
			qvaObj = QVA[i];
			var count=0;
			for(var j=0,m=QVA[i].QUERY_VIEW_PROPERTIES.length; j<m; j++) {
				qvaObj[QVA[i].QUERY_VIEW_PROPERTIES[j]["property"]] = QVA[i].QUERY_VIEW_PROPERTIES[j]["value"];
			}
			if(qvaArr.length==0)
				qvaArr.push(jQuery.extend({},qvaObj))

				else{
					for(var k=0;k<qvaArr.length;k++){
						if(qvaObj.queryViewAnnotationDocumentURI==qvaArr[k].queryViewAnnotationDocumentURI)
							count++;


					}
					if(count==0)
						qvaArr.push(jQuery.extend({},qvaObj));
				}

			delete qvaObj.QUERY_VIEW_PROPERTIES;
		}



		for(var i=0,l=DDA.length; i<l; i++) {
			if(DDA[i].property == 'queryAnnotationDocURIs') {
				ddaObj.queryAnnotationDocURIs = DDA[i].value.split(",");
			}
			else if(DDA[i].property == 'filters'){
				ddaObj.filters = DDA[i].value.split(",");
			}
			else {
				ddaObj[DDA[i].property] = DDA[i].value;
			}
		}

		/*
		 *            ADDED THE FILTERS CONFIG AND HEADERS CODE HERE MOVING THEM TO EVAL LEVEL
		 */

		// MIGRATE CONTENT FROM DDA_CONFIG_PROPERTIES TO DDA_FILTER
		ddaConfigObj = {};
		ddaConfigObj.EVALUATION_ID = alterEval;
		ddaConfigObj.CONFIGURATION_ID = "NIL";

		if(ddaObj.filters){
			for(j=0,m=ddaObj.filters.length; j<m; j++) {
				ddaConfigObj.DIMENSION = ddaObj.filters[j];                          
				ddaConfigObj.VISIBILITY = 1;
				ddaConfigObj.IS_ACTIVE = 1;
				migrationController.objectToPush.DDA_FILTERS.push(jQuery.extend({},ddaConfigObj));               
			}
		}

		// MIGRATE CONTENT FROM DDA_CONFIG_PROPERTIES TO DDA_HEADER
		ddaConfigObj = {};
		ddaConfigObj.EVALUATION_ID = alterEval;
		ddaConfigObj.CONFIGURATION_ID="NIL";

		ddaConfigObj.REFERENCE_EVALUATION_ID = ddaConfigObj.EVALUATION_ID;
		ddaConfigObj.VISUALIZATION_TYPE = 'NT';
		ddaConfigObj.VISUALIZATION_ORDER = 1;
		ddaConfigObj.VISIBILITY = 1;
		ddaConfigObj.DIMENSION = null;
		ddaConfigObj.IS_ACTIVE = 1;
		migrationController.objectToPush.DDA_HEADER.push(jQuery.extend({},ddaConfigObj));

		ddaConfigObj.VISUALIZATION_TYPE = 'AT';
		ddaConfigObj.VISUALIZATION_ORDER = 2;
		ddaConfigObj.VISIBILITY = 1;
		ddaConfigObj.DIMENSION = null;
		ddaConfigObj.IS_ACTIVE = 1;
		migrationController.objectToPush.DDA_HEADER.push(jQuery.extend({},ddaConfigObj));

		ddaConfigObj.VISUALIZATION_TYPE = 'TT';
		ddaConfigObj.VISUALIZATION_ORDER = 3;
		ddaConfigObj.VISIBILITY = 1;
		ddaConfigObj.DIMENSION = null;
		ddaConfigObj.IS_ACTIVE = 1;
		migrationController.objectToPush.DDA_HEADER.push(jQuery.extend({},ddaConfigObj));

		// MIGRATE CONTENT FROM DDA_CONFIG_PROPERTIES TO DDA_CONFIGURATION
		ddaConfigObj = {};
		ddaConfigObj.EVALUATION_ID = alterEval;
		ddaConfigObj.CONFIGURATION_ID = "NIL";

		ddaConfigObj.PROPERTY_TYPE = 'SAP_FILTER';
		ddaConfigObj.PROPERTY_VALUE = '';
		ddaConfigObj.VISIBILITY = ddaObj.isFilter || 0;
		ddaConfigObj.IS_ACTIVE = 1;
		migrationController.objectToPush.DDA_CONFIG.push(jQuery.extend({},ddaConfigObj));



		ddaConfigObj.PROPERTY_TYPE = 'SAP_AGGREGATE_VALUE';
		ddaConfigObj.PROPERTY_VALUE = '';
		ddaConfigObj.VISIBILITY = ddaObj.aggregateNumberEnabled || 0;
		ddaConfigObj.IS_ACTIVE = 1;
		migrationController.objectToPush.DDA_CONFIG.push(jQuery.extend({},ddaConfigObj));

		ddaConfigObj.PROPERTY_TYPE = 'SAP_HEADER';
		ddaConfigObj.PROPERTY_VALUE = '';
		ddaConfigObj.VISIBILITY = ddaObj.isTarget || 0;
		ddaConfigObj.IS_ACTIVE = 1;
		migrationController.objectToPush.DDA_CONFIG.push(jQuery.extend({},ddaConfigObj));

		ddaConfigObj.PROPERTY_TYPE = 'QUERY_SERVICE_URI';
		ddaConfigObj.PROPERTY_VALUE = QVA[0].queryServiceURI;
		ddaConfigObj.VISIBILITY = 1;
		ddaConfigObj.IS_ACTIVE = 1;
		migrationController.objectToPush.DDA_CONFIG.push(jQuery.extend({},ddaConfigObj));

		ddaConfigObj.PROPERTY_TYPE = 'QUERY_ENTITY_SET';
		ddaConfigObj.PROPERTY_VALUE = QVA[0].queryQualifiedResultEntitySetName;
		ddaConfigObj.VISIBILITY = 1;
		ddaConfigObj.IS_ACTIVE = 1;
		migrationController.objectToPush.DDA_CONFIG.push(jQuery.extend({},ddaConfigObj));

//		ddaConfigObj.PROPERTY_TYPE = 'THRESHOLD_MEASURE';
//		ddaConfigObj.PROPERTY_VALUE = qvaArr[i].semanticColorMeasure ? qvaArr[i].semanticColorMeasure.split(",") : null;
//		ddaConfigObj.VISIBILITY = 1;
//		ddaConfigObj.IS_ACTIVE = 1;
//		migrationController.objectToPush.DDA_CONFIG.push(jQuery.extend({},ddaConfigObj));



		for(var i=0,l=ddaObj.queryAnnotationDocURIs.length; i<l; i++) {
			var ddaConfigObj = {};
			var C_ID;

			for(var k=0;k<Ctemp.length;k++){
				if(ddaObj.queryAnnotationDocURIs[i]==Ctemp[k].CONFIGURATION_NAME)
					C_ID=Ctemp[k].CONFIGURATION_ID;

			}



			// MIGRATE CONTENT FROM DDA_CONFIG_PROPERTIES TO DDA_MASTER
			ddaConfigObj.EVALUATION_ID = alterEval;
			ddaConfigObj.CONFIGURATION_ID = C_ID||(alterEval+"."+ddaObj.queryAnnotationDocURIs[i]);
			ddaConfigObj.TEXT = qvaArr[i].title;
			ddaConfigObj.CONFIG_ORDER = i+1;
			ddaConfigObj.IS_ACTIVE = 1;
			migrationController.objectToPush.DDA_MASTER.push(jQuery.extend({},ddaConfigObj));




			/*
                            REMOVED THE FILTERS CONFIG AND HEADERS CODE FROM HERE MOVED OUTSIDE THE FOR LOOP

			 */



			ddaConfigObj = {};
			var columnOrder = 1;
			ddaConfigObj.EVALUATION_ID = alterEval;
			ddaConfigObj.CONFIGURATION_ID = C_ID||(alterEval+"."+ddaObj.queryAnnotationDocURIs[i]);

			// MIGRATE CONTENT FROM DDA_CONFIG_PROPERTIES TO DDA_COLUMNS
			var measures = qvaArr[i].measurePropertyNames.split(",");
			var dimensions = qvaArr[i].dimensionPropertyNames.split(",");
			var queryViewPropArr =qvaArr[i].QUERY_VIEW_PROPERTIES.results.filter(function(x){ return x["property"]=="dimensionPropertySortNames"});
			var sortDimVal = queryViewPropArr.length ? queryViewPropArr[0].value : null;
			var sortDimensions = sortDimVal ? sortDimVal.split(",") : null;
			queryViewPropArr =qvaArr[i].QUERY_VIEW_PROPERTIES.results.filter(function(x){ return x["property"]=="measurePropertySortNames"});
			var sortMsrVal = queryViewPropArr.length ? queryViewPropArr[0].value : null;
			var sortMeasures = sortMsrVal ? sortMsrVal.split(",") : null;
			queryViewPropArr =qvaArr[i].QUERY_VIEW_PROPERTIES.results.filter(function(x){ return x["property"]=="colorNames"});
			var colorVal = queryViewPropArr.length? queryViewPropArr[0].value : null;
			var colorNames = colorVal ? colorVal.split(",") : null;
			queryViewPropArr =qvaArr[i].QUERY_VIEW_PROPERTIES.results.filter(function(x){ return x["property"]=="colorType"}); 
			var colTypeVal = queryViewPropArr.length ? queryViewPropArr[0].value : null;
			queryViewPropArr =qvaArr[i].QUERY_VIEW_PROPERTIES.results.filter(function(x){ return x["property"]=="semanticColorMeasure"});
			var semMsrVal = queryViewPropArr.length ? queryViewPropArr[0].value : null;
			queryViewPropArr = qvaArr[i].QUERY_VIEW_PROPERTIES.results.filter(function(x){ return x["property"]=="hiddenMeasureNames"});
			var hidMsrVal = queryViewPropArr.length ? queryViewPropArr[0].value : null;
			var hidMsrArr = hidMsrVal ? hidMsrVal.split(",") : null;
			//var semanticColorMeasure = qvaArr[i].semanticColorMeasure ? qvaArr[i].semanticColorMeasure.split(",") : null;
			for(var j=0,m=dimensions.length; j<m; j++) {                                      
				ddaConfigObj.NAME = dimensions[j];
				ddaConfigObj.TYPE = 'DIMENSION';
				if(sortDimensions!=null)
				{
					if(sortDimensions.length)
					{
						ddaConfigObj.SORT_BY = (sortDimensions && sortDimensions[j]) ? sortDimensions[j] : dimensions[j];
					}
					else
						ddaConfigObj.SORT_BY =dimensions[j];
				}
				else
					ddaConfigObj.SORT_BY =dimensions[j];

//				else
//	ddaConfigObj.SORT_BY=null;
ddaConfigObj.AXIS = 1;
ddaConfigObj.STACKING = 0;
ddaConfigObj.VISIBILITY = "BOTH";
ddaConfigObj.COLOR = null;
switch(Number(qvaArr[i].orderBy)) {
case 1: ddaConfigObj.SORT_ORDER = null;
break;
case 2: ddaConfigObj.SORT_ORDER = null;
break;
case 3: ddaConfigObj.SORT_ORDER = 'asc';
break;
case 4: ddaConfigObj.SORT_ORDER = 'desc';
break;
case 0: ddaConfigObj.SORT_ORDER = null;
break;
}
ddaConfigObj.COLUMNS_ORDER = columnOrder++;
ddaConfigObj.IS_ACTIVE = 1;

migrationController.objectToPush.DDA_COLUMNS.push(jQuery.extend({},ddaConfigObj));
			}

			for(var j=0,m=measures.length; j<m; j++) {                                        
				ddaConfigObj.NAME = measures[j];
				ddaConfigObj.TYPE = 'MEASURE';
				ddaConfigObj.VISIBILITY = "BOTH";
				if(sortMeasures!=null)
				{
					if(sortMeasures.length)
					{
						ddaConfigObj.SORT_BY = (sortMeasures && sortMeasures[j]) ? sortMeasures[j] : measures[j];
					}
					else
						ddaConfigObj.SORT_BY =measures[j];
				}
				else
					ddaConfigObj.SORT_BY =measures[j];
//				if(sortMeasures.length)
//	ddaConfigObj.SORT_BY = (sortMeasures && sortMeasures[j]) ? sortMeasures[j] : measures[j];
				if(qvaArr[i].chartType && (jQuery.sap.startsWithIgnoreCase(qvaArr[i].chartType,"dual")) && (j < 2)){
					ddaConfigObj.AXIS = j+1;
				}
				else{
					ddaConfigObj.AXIS = 1;
				}
				ddaConfigObj.STACKING = 0;
				ddaConfigObj.COLOR = null;
				switch(Number(qvaArr[i].orderBy)) {
				case 1: ddaConfigObj.SORT_ORDER = 'asc';
				break;
				case 2: ddaConfigObj.SORT_ORDER = 'desc';
				break;
				case 3: ddaConfigObj.SORT_ORDER = null;
				break;
				case 4: ddaConfigObj.SORT_ORDER = null;
				break;
				case 0: ddaConfigObj.SORT_ORDER = null;
				break;
				}
				ddaConfigObj.COLUMNS_ORDER = columnOrder++;
				ddaConfigObj.IS_ACTIVE = 1;

				if(qvaArr[i].chartType && (qvaArr[i].chartType.indexOf("Stacked") > -1)) {
					ddaConfigObj.STACKING = 1;
				}
				if(hidMsrArr!=null){
					if(hidMsrArr && (hidMsrArr.indexOf(measures[j])>-1)){
						ddaConfigObj.VISIBILITY = "CHART";
					}
				}
				if(colTypeVal == 0 || colTypeVal == 2) {
					if(colorNames!=null)
						ddaConfigObj.COLOR = (colorNames && colorNames[j]) ? colorNames[j] : ""; 
						else
							ddaConfigObj.COLOR="";
				}
				else if(qvaArr[i].colorType == 1) {
					//ddaConfigObj.COLOR = semanticColorMeasure;
				} 

				migrationController.objectToPush.DDA_COLUMNS.push(jQuery.extend({},ddaConfigObj));
			}



			// MIGRATE CONTENT FROM DDA_CONFIG_PROPERTIES TO DDA_CHART
			ddaConfigObj = {};
			ddaConfigObj.EVALUATION_ID = alterEval;
			ddaConfigObj.CONFIGURATION_ID = C_ID||(alterEval+"."+ddaObj.queryAnnotationDocURIs[i]);
			ddaConfigObj.VALUE_TYPE = 'ABSOLUTE';
			ddaConfigObj.AXIS_TYPE = 'SINGLE';
			ddaConfigObj.DATA_LIMIT = qvaArr[i].top || null;
			switch(qvaArr[i].chartType) {
			case null : ddaConfigObj.CHART_TYPE = 'Table';
			break;
			case 'Select Type' : ddaConfigObj.CHART_TYPE = 'Table';
			break;
			case 'StackedColumn' : ddaConfigObj.CHART_TYPE = 'Column';
			break;
			case 'Stacked Column' : ddaConfigObj.CHART_TYPE = 'Column';
			break;
			case 'Transposed' : ddaConfigObj.CHART_TYPE = 'Column';
			break;
			case 'DualStackedBar' : ddaConfigObj.CHART_TYPE = 'Bar';
			ddaConfigObj.AXIS_TYPE = 'DUAL';
			break;
			case 'StackedBar' : ddaConfigObj.CHART_TYPE = 'Bar';                                                                
			break;
			case 'StackedColumn100' : ddaConfigObj.CHART_TYPE = 'Column';
			ddaConfigObj.VALUE_TYPE = 'PERCENTAGE';
			break; 
			case 'DualStackedColumn' : ddaConfigObj.CHART_TYPE = 'Column';
			ddaConfigObj.AXIS_TYPE = 'DUAL';
			break;
			case 'DualStackedBar100' : ddaConfigObj.CHART_TYPE = 'Bar';
			ddaConfigObj.VALUE_TYPE = 'PERCENTAGE';
			ddaConfigObj.AXIS_TYPE = 'DUAL';
			break;
			case 'DualStackedColumn100' : ddaConfigObj.CHART_TYPE = 'Column';
			ddaConfigObj.VALUE_TYPE = 'PERCENTAGE';
			ddaConfigObj.AXIS_TYPE = 'DUAL';
			break;
			default : ddaConfigObj.CHART_TYPE = qvaArr[i].chartType;
			}

			switch(colTypeVal) {
			case undefined : ddaConfigObj.COLOR_SCHEME = 'NONE';
			break;
			case null : ddaConfigObj.COLOR_SCHEME = 'NONE';
			break;
			case 0 : ddaConfigObj.COLOR_SCHEME = 'MANUAL_NON_SEMANTIC';
			break;
			case 1 : ddaConfigObj.COLOR_SCHEME = 'AUTO_SEMANTIC';
			break;
			case 2 : ddaConfigObj.COLOR_SCHEME = 'MANUAL_SEMANTIC';
			break;
			default : ddaConfigObj.COLOR_SCHEME = 'NONE';
			}
			ddaConfigObj.THRESHOLD_MEASURE=semMsrVal; 
			ddaConfigObj.IS_ACTIVE = 1;
			migrationController.objectToPush.DDA_CHART.push(jQuery.extend({},ddaConfigObj));


			// MIGRATE CONTENT FROM DDA_CONFIG_PROPERTIES TO DDA_MASTER



		}



	},

	clearData: function(){

		this.getView().byId("oldList").removeAllItems();
		this.getView().byId("newList").removeAllItems();

		this.objectToPush.INDICATORS=[];
		this.objectToPush.INDICATOR_TEXTS=[];
		this.objectToPush.EVALUATIONS=[];
		this.objectToPush.EVALUATION_TEXTS=[];
		this.objectToPush.EVALUATION_FILTERS=[];
		this.objectToPush.EVALUATION_VALUES=[];
		this.objectToPush.TAGS=[];


		this.objectToPush.DDA_MASTER=[];
		this.objectToPush.DDA_CONFIG=[];
		this.objectToPush.DDA_FILTERS=[];
		this.objectToPush.DDA_HEADER=[];
		this.objectToPush.DDA_CHART=[];
		this.objectToPush.DDA_COLUMNS=[];

		this.objectToPush.DDA_MASTER_TEXT=[];

	},
	migrateData : function(){

		var migrationController=this;
		//this.dataToMigrate=this.objectToPush;
		if((this.objectToPush!=undefined)&&(this.objectToPush.INDICATORS.length>0)){
			sap.m.MessageBox.show(
					migrationController.oI18nModel.getResourceBundle().getText("MSG_MIGRATION_BEGIN"),
					sap.m.MessageBox.Icon.INFORMATION ,
					migrationController.oI18nModel.getResourceBundle().getText("INFORMATION_MSG_TITLE"),
					[sap.m.MessageBox.Action.OK],
					function(){

						// migrationController.getView().setBusy(true);
						migrationController.showBusy("M");
						//this.getView().setBusy(true)
						setTimeout(function(){migrationController.writeData();},2500);
					}
			);

		}
		else{
			sap.m.MessageBox.show(
					migrationController.oI18nModel.getResourceBundle().getText("MSG_NO_KPI"),
					sap.m.MessageBox.Icon.INFORMATION ,
					migrationController.oI18nModel.getResourceBundle().getText("INFORMATION_MSG_TITLE"),
					[sap.m.MessageBox.Action.OK]
					//      function(){migrationController.bindEvaluations}
			);
		}
	},

	cancel : function(){
		//navigateToHomePage
		window.history.back();
	},

	writeData:function(){


		var migrationController=this;
		this.errorMessage="";

		this.prepareMigrationData();
		var data=migrationController.objectToPush;



		if(data){
			migrationController.initiateRequests();

		}


	},

	initiateRequests:function(){
		var migrationController=this;
		var uri1="/sap/hba/r/sb/core/logic/MIGRATION.xsjs";

		jQuery.ajax({
			url: "/sap/hba/r/sb/core/logic/__token.xsjs",
			async: false,
			type: "HEAD",
			headers: {"X-CSRF-Token": "Fetch"},
			success: function(d, s, x) {
				jQuery.ajax({
					type: "POST",
					url: uri1,
					cache: false,
					data: encodeURIComponent(JSON.stringify(migrationController.objectToPush)),
					headers: {"X-CSRF-Token": x.getResponseHeader("X-CSRF-Token")},
					success: function(data){
						if(JSON.parse(data).success)
						{
							sap.m.MessageBox.show(
									migrationController.oI18nModel.getResourceBundle().getText("MSG_MIGRATION_SUCCESS"),
									sap.m.MessageBox.Icon.INFORMATION ,
									migrationController.oI18nModel.getResourceBundle().getText("INFORMATION_MSG_TITLE"),
									[sap.m.MessageBox.Action.OK],
									function(){migrationController.cancel()}
							);
						}
						else{
							sap.ca.ui.message.showMessageBox({
								type: sap.ca.ui.message.Type.ERROR,
								message: migrationController.oI18nModel.getResourceBundle().getText("MSG_MIGRATION_ERROR"),
								details: JSON.parse(data).errorMessage
							});
						}
						migrationController.hideBusy();
					},
					async: true,
					error: function (XMLHttpRequest, textStatus, errorThrown) {
						sap.ca.ui.message.showMessageBox({
							type: sap.ca.ui.message.Type.ERROR,
							message: migrationController.oI18nModel.getResourceBundle().getText("MSG_MIGRATION_ERROR"),
							details: errorThrown+"\n"+JSON.parse(XMLHttpRequest.responseText).errorMessage
						});
						migrationController.hideBusy();
					}
				});

			},
			error: function() {
				sap.suite.smartbusiness.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("ERR_FETCH_AUTH_TOKEN"));
				$.sap.log.error("ERR_FETCH_AUTH_TOKEN");
			}
		});
	},



	serviceCreate:function(entity,payload,ODataModel)
	{
//		sap.ui.core.BusyIndicator.show();
		var result = {success:false,text: ""};
		ODataModel.create(entity,payload,null,function(data){
			result.success = true;
		},
		function(error){
			var errorText = JSON.parse(error.response.body);
			result.success = false;
			result.text =error.response.statusText+" - "+errorText.error.message.value;
		});
		return result;
	},
	serviceDelete:function(entity,id,ODataModel)
	{      
//		sap.ui.core.BusyIndicator.show();
		var result = {success:false,text: ""};
		ODataModel.remove(entity+"("+id+")",null,function(data){
			result.success = true;
		},
		function(error){
			result.success = false;
			result.text = error.response.statusText;
		},false,"",true);
		return result;
	},
	serviceCallDataValidation:function(entity, param, oDataModel)
	{      var result = {success:false,text: ""};
	oDataModel.read(entity, null, param, false,
			function(data, response)
			{      if(data.results[0])
			{      result.success = true;
			result.data = data.results;       
			}
			else
			{      result.success = false;
			result.text = "Record not found";
			}
			},
			function(data)                           
			{      result.success = false;
			result.text = data.response.statusText;
			});
	return result;
	},


	/**
	 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
	 * (NOT before the first rendering! onInit() is used for migrationController one!).
	 * @memberOf tool.Migration
	 */
//	onBeforeRendering: function() {

//	},

	/**
	 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
	 * This hook is the same one that SAPUI5 controls get after being rendered.
	 * @memberOf tool.Migration
	 */
//	onAfterRendering: function() {

//	},

	/**
	 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
	 * @memberOf tool.Migration
	 */
//	onExit: function() {

//	}

});
