jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");
jQuery.sap.require("sap.m.MessageBox");

sap.ca.scfld.md.controller.BaseDetailController.extend("sap.suite.ui.smartbusiness.designtime.visualization.view.S3", {

	onInit : function() {
		var that = this;
		var view = this.getView();
		this.oRouter.attachRouteMatched(function(oEvent) {
			if (oEvent.getParameter("name") === "detail") {
				that.selectedTile = undefined;
				var context = new sap.ui.model.Context(view.getModel(), '/' + oEvent.getParameter("arguments").contextPath);
				view.setBindingContext(context);
				// Make sure the master is here
			}
		}, this);
		var that = this;
		this.oHeaderFooterOptions = { 
				bSuppressBookmarkButton: {}, 
				oEditBtn : {
					sI18nBtnTxt : that.oApplicationFacade.getResourceBundle().getText("FULLSCREEN_TITLE"),
					onBtnPressed : function(evt) {
						sap.suite.smartbusiness.utils.replaceHash({action:"configureSBKPITile", route:"addTile", context: that.getView().getBindingContext().sPath.substr(1)});
					},
					bEnabled : false, // default true
				},
				buttonList : []            
		};
	},

	getHeaderFooterOptions : function() {
		return this.oHeaderFooterOptions;
	},

	getChipRow: function(id,context){
		var that = this;
		var tileContent;
		var tile;
		var config = JSON.parse(JSON.parse(JSON.parse(context.getObject().configuration).tileConfiguration).TILE_PROPERTIES);
		var navType = new sap.m.Text();
		
		if(config.navType == "0") {
			navType.setText(that.oApplicationFacade.getResourceBundle().getText("GENERIC_DRILLDOWN"));
		}
		else {
			navType.setText(that.oApplicationFacade.getResourceBundle().getText("OTHER_DRILLDOWN"));
		}
		
		var status = new sap.m.ObjectNumber();
		
		if(context.getObject().COUNTER == "1") {
			if(context.getObject().isActive) {
				status.setNumber(that.oApplicationFacade.getResourceBundle().getText("STATUS_ACTIVE"));
				status.setState("Success");
			}
			else {
				status.setNumber(that.oApplicationFacade.getResourceBundle().getText("STATUS_NEW"));
				status.setState("None");
			}
		}
		else {
			status.setNumber(that.oApplicationFacade.getResourceBundle().getText("STATUS_ACTIVE_DRAFT"));
			status.setState("Success");
		}
		
		var favourite;
		
		var semanticObjectVisibility;
		
		if(Number(config.navType)) {
			semanticObjectVisibility = true;
		}
		else {
			semanticObjectVisibility = false;
		}
		
		if(context.getProperty("tileType")=="NT")
			tileContent = new sap.suite.ui.commons.NumericContent({size:"S", value:"0.0", scale:"M", valueColor:"Good", unit:that.oApplicationFacade.getResourceBundle().getText("TILE_CURRENCY"), footer:that.oApplicationFacade.getResourceBundle().getText("ACTUAL")});
		else if(context.getProperty("tileType")=="CT")
			tileContent =  new sap.suite.ui.commons.ComparisonChart({
				scale: "M",
				size:"S",
				data: [new sap.suite.ui.commons.ComparisonData({title:that.oApplicationFacade.getResourceBundle().getText("VALUE_1"), value: 1550}),
				       new sap.suite.ui.commons.ComparisonData({title:that.oApplicationFacade.getResourceBundle().getText("VALUE_2"), value: 219.2}),
				       new sap.suite.ui.commons.ComparisonData({title:that.oApplicationFacade.getResourceBundle().getText("VALUE_3"), value: 66.46})]
			});
		else if(context.getProperty("tileType")=="AT")
			tileContent =  new sap.suite.ui.commons.BulletChart({
				scale: "M",
				size:"S",
				minValue: 0,
				maxvalue: 312,
				targetValue: 150,
				actual: new sap.suite.ui.commons.BulletChartData({value:312, color:"Error"}),
				thresholds: [new sap.suite.ui.commons.BulletChartData({value:312, color:"Error"}),
				             new sap.suite.ui.commons.BulletChartData({value:200, color:"Critical"})]
			});
		else if(context.getProperty("tileType")=="TT")
			tileContent = new sap.suite.ui.commons.MicroAreaChart({
				size:"S",
				width: "130px",
				height: "59px",
				minXValue: 0,
				maxXValue: 100,
				minYValue: 0,
				maxYValue: 100,
				firstXLabel: new sap.suite.ui.commons.MicroAreaChartLabel({label:"Jan 1", color:"Neutral"}),
				lastXLabel: new sap.suite.ui.commons.MicroAreaChartLabel({label:"Jan 31", color:"Neutral"}),
				firstYLabel: new sap.suite.ui.commons.MicroAreaChartLabel({label:"3 M", color:"Error"}),
				lastYLabel: new sap.suite.ui.commons.MicroAreaChartLabel({label:"23 M", color:"Good"}),
				target: new sap.suite.ui.commons.MicroAreaChartItem({
					points:[new sap.suite.ui.commons.MicroAreaChartPoint({x:0,y:0}),
					        new sap.suite.ui.commons.MicroAreaChartPoint({x:30,y:30}),
					        new sap.suite.ui.commons.MicroAreaChartPoint({x:60,y:40}),
					        new sap.suite.ui.commons.MicroAreaChartPoint({x:100,y:90})]
				}),
				innerMinThreshold: new sap.suite.ui.commons.MicroAreaChartItem({color:"Good"}),
				innerMaxThreshold: new sap.suite.ui.commons.MicroAreaChartItem({color:"Good"}),
				minThreshold:  new sap.suite.ui.commons.MicroAreaChartItem({
					color:"Error",
					points:[new sap.suite.ui.commons.MicroAreaChartPoint({x:0,y:0}),
					        new sap.suite.ui.commons.MicroAreaChartPoint({x:30,y:40}),
					        new sap.suite.ui.commons.MicroAreaChartPoint({x:60,y:50}),
					        new sap.suite.ui.commons.MicroAreaChartPoint({x:100,y:100})]
				}),
				maxThreshold:  new sap.suite.ui.commons.MicroAreaChartItem({
					color:"Error",
					points:[new sap.suite.ui.commons.MicroAreaChartPoint({x:0,y:0}),
					        new sap.suite.ui.commons.MicroAreaChartPoint({x:30,y:20}),
					        new sap.suite.ui.commons.MicroAreaChartPoint({x:60,y:30}),
					        new sap.suite.ui.commons.MicroAreaChartPoint({x:100,y:70})]
				}),
				chart: new sap.suite.ui.commons.MicroAreaChartItem({
					points:[new sap.suite.ui.commons.MicroAreaChartPoint({x:0,y:0}),
					        new sap.suite.ui.commons.MicroAreaChartPoint({x:30,y:40}),
					        new sap.suite.ui.commons.MicroAreaChartPoint({x:60,y:50}),
					        new sap.suite.ui.commons.MicroAreaChartPoint({x:100,y:100})]
				}),
			});
		else if(context.getProperty("tileType")=="CM") {
			tileContent =  new sap.suite.ui.commons.ComparisonChart({
				scale: "M",
				size:"S",
				data: [new sap.suite.ui.commons.ComparisonData({title:that.oApplicationFacade.getResourceBundle().getText("MEASURE_1"), value: 34, color: "Good"}),
				       new sap.suite.ui.commons.ComparisonData({title:that.oApplicationFacade.getResourceBundle().getText("MEASURE_2"), value: 125, color: "Error"}),
				       new sap.suite.ui.commons.ComparisonData({title:that.oApplicationFacade.getResourceBundle().getText("MEASURE_3"), value: 97, color: "Critical"})]
			});
		}

		tile = new sap.suite.ui.commons.GenericTile({
			size:"S", 
			header: context.getProperty("title"),
			subheader: context.getProperty("description"),
			customData: [new sap.ui.core.CustomData({key:"tileType",value:context.getProperty("tileType")})],
			tileContent: new sap.suite.ui.commons.TileContent({content:tileContent, size:"S",}),
			press: function(evt) {
//				var tiles = that.byId("tileGrid").getItems();
//				for(var i=0,l=tiles.length; i<l; i++) {
//					tiles[i].getCells()[0].$().css("border","solid 2px " + sap.ui.core.theming.Parameters.get("sapUiWhite"));
//				}
//				evt.getSource().$().css("border","solid 2px " + sap.ui.core.theming.Parameters.get("sapUiHighlight"));
			}
		}).addStyleClass("sbTile");
		
		return new sap.m.ColumnListItem({
			type: "Navigation",
		    press: function(evt) {
	        	var chipContext = this.getBindingContext().sPath;
	        	if(this.getBindingContext().getObject().isActive) {
	        		if(this.getBindingContext().getObject().COUNTER == 2) {
	        			chipContext = chipContext.replace("isActive=1","isActive=0");
	        		}
	        	}
	        	else {
	        		chipContext = chipContext.replace("isActive=1","isActive=0");
	        	}
	        	chipContext = chipContext.replace("/CHIPS_MODELER","CHIPS");
	        	sap.suite.smartbusiness.utils.replaceHash({action:"configureSBKPITile", route:"editTile", context: (that.getView().getBindingContext().sPath.substr(1) + "/" + chipContext)});
	        },
			cells: [
			        tile,
			        new sap.ui.layout.VerticalLayout({
						content: [
						        navType,
						        new sap.m.Text({text: that.oApplicationFacade.getResourceBundle().getText("SEMANTIC_OBJECT") + ': ' + config.semanticObject, visible:semanticObjectVisibility}),
						        new sap.m.Text({text: that.oApplicationFacade.getResourceBundle().getText("ACTION") + ': ' + config.semanticAction, visible:semanticObjectVisibility}),
						        ]
					}).addStyleClass("navigationVLayout"),
					status,
			        new sap.ui.layout.HorizontalLayout({
			        	content: [
//			        	          new sap.ui.core.Icon({
//			        	        	  src: "sap-icon://favorite",
//			        	        	  size: "22px",
//			        	        	  press: function(evt) {
//								
//			        	        	  }
//			        	          }),
			        	          new sap.ui.core.Icon({
			        	        	  src: "sap-icon://edit",
			        	        	  size: "22px",
			        	        	  press: function(evt) {
			        	        		  var chipContext = this.getBindingContext().sPath;
			        	        		  if(this.getBindingContext().getObject().isActive) {
			        	        			  if(this.getBindingContext().getObject().COUNTER == 2) {
			        	        				  chipContext = chipContext.replace("isActive=1","isActive=0");
			        	        			  }
			        	        		  }
			        	        		  else {
			        	        			  chipContext = chipContext.replace("isActive=1","isActive=0");
			        	        		  }
			                			  chipContext = chipContext.replace("/CHIPS_MODELER","CHIPS");
			                			  sap.suite.smartbusiness.utils.replaceHash({action:"configureSBKPITile", route:"editTile", context: (that.getView().getBindingContext().sPath.substr(1) + "/" + chipContext)});
			        	        	  }
			        	          }),
			        	          new sap.ui.core.Icon({
			        	        	  src: "sap-icon://sys-cancel",
			        	        	  size: "22px",
			        	        	  press: function(evt) {
			        	        		  that.handleDelete(this);
			        	        	  }
			        	          })
			        	          ]
			        }).addStyleClass("chipActionsHLayout")
			        ]
		});
	},

	handleDelete: function(contextObj) {
		var that = this;
		  sap.m.MessageBox.show(
				  that.oApplicationFacade.getResourceBundle().getText("WANT_TO_DELETE_SELECTED_TILE"),
				  "sap-icon://hint",
				  that.oApplicationFacade.getResourceBundle().getText("DELETE"),
				  [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL ],
				  function(evt){
					  if(evt=="OK"){
						  //odata remove
//						  that.oApplicationFacade.getODataModel().remove(contextObj.getBindingContext().sPath.replace("CHIPS_MODELER","CHIPS"),null,function(data) {
//							  sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("DELETION_SUCCESSFUL"));
//							  that.oApplicationFacade.getODataModel().refresh();
//						  },function(err){
//							  sap.suite.smartbusiness.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("DELETION_FAILED"), err.response.body);
//						  });
						  
						  //xsjs remove
						  sap.suite.smartbusiness.utils.remove(sap.suite.smartbusiness.utils.serviceUrl("CHIP_SERVICE_URI"),{id:contextObj.getBindingContext().getObject().id, isActive:contextObj.getBindingContext().getObject().isActive},function(data) {
							  sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("DELETION_SUCCESSFUL"));
							  that.oApplicationFacade.getODataModel().refresh();
						  },function(err){
							  sap.suite.smartbusiness.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("DELETION_FAILED"), err.responseText);
						  });
					  }
					  if(evt=="CANCEL"){

					  }
				  }
		  );
	},
	
	formatChipsCount: function(count) {
		return this.oApplicationFacade.getResourceBundle().getText("TILES") + " (" + (count || 0) + ")";
	},
	
	getFooterButtons: function() {
		var that = this;
		var buttonList = [
		                  {
		                	  sI18nBtnTxt : that.oApplicationFacade.getResourceBundle().getText("ACTIVATE"),
		                	  onBtnPressed : function(evt) {
		                		  if(that.selectedTile) {
		                			  var data = JSON.parse(JSON.parse(JSON.parse(that.selectedTile.getBindingContext().getObject().configuration).tileConfiguration).TILE_PROPERTIES);
		                			  var evaluation = JSON.parse(JSON.parse(JSON.parse(that.selectedTile.getBindingContext().getObject().configuration).tileConfiguration).EVALUATION);
		                			  var errorLog = "";
		                			  if(!(data.semanticObject && data.semanticAction && that.selectedTile.getBindingContext().getObject().title && that.selectedTile.getBindingContext().getObject().description) || (!(data.storyId) && data.navType == 1) || (data.semanticObject.length == (data.semanticObject.split(" ").length - 1)) || (data.semanticAction.length == (data.semanticAction.split(" ").length - 1)) ) {
		                				  if(!(data.semanticObject) || (data.semanticObject.length == (data.semanticObject.split(" ").length - 1))) {
		                					  errorLog += that.oApplicationFacade.getResourceBundle().getText("ERROR_ENTER_SEMANTIC_OBJECT") + "\n";
		                				  }
		                				  if(!(data.semanticAction) || (data.semanticAction.length == (data.semanticAction.split(" ").length - 1))) {
		                					  errorLog += that.oApplicationFacade.getResourceBundle().getText("ERROR_ENTER_SEMANTIC_ACTION") + "\n";
		                				  }
		                				  if(!(that.selectedTile.getBindingContext().getObject().title) || (that.selectedTile.getBindingContext().getObject().title.length == (that.selectedTile.getBindingContext().getObject().title.split(" ").length - 1))) {
		                					  errorLog += that.oApplicationFacade.getResourceBundle().getText("ERROR_ENTER_TITLE") + "\n";
		                				  }
		                				  if(!(that.selectedTile.getBindingContext().getObject().description) || (that.selectedTile.getBindingContext().getObject().description.length == (that.selectedTile.getBindingContext().getObject().description.split(" ").length - 1))) {
		                					  errorLog += that.oApplicationFacade.getResourceBundle().getText("ERROR_ENTER_DESCRIPTION") + "\n";
		                				  }
		                				  if((!(data.storyId) && (data.navType == 1))) {
		                					  errorLog += that.oApplicationFacade.getResourceBundle().getText("ERROR_ENTER_STORY_ID");
		                				  }
		                				  sap.suite.smartbusiness.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("ACTIVATION_ERROR"), errorLog);
		                			  } 
		                			  else {
		                				  if(that.selectedTile.getBindingContext().getObject().tileType == "CM") {
		                					  if(!(evaluation) || !(evaluation.COLUMN_NAMES) || !(evaluation.COLUMN_NAMES.length)) {
		                						  errorLog += that.oApplicationFacade.getResourceBundle().getText("ERROR_ENTER_THREE_MEASURES");
		                					  }
		                					  else {
		                						  for(var i=0,l=evaluation.COLUMN_NAMES.length; i<l; i++) {
		                							  if(!(evaluation.COLUMN_NAMES[i].COLUMN_NAME) || !(evaluation.COLUMN_NAMES[i].semanticColor)) {
		                								  errorLog += that.oApplicationFacade.getResourceBundle().getText("ERROR_ENTER_THREE_MEASURES");
		                								  break;
		                							  }
		                						  }
		                						  if((!errorLog) && (evaluation.COLUMN_NAMES.length == 3)) {
		                							  if(evaluation.COLUMN_NAMES[0].COLUMN_NAME == evaluation.COLUMN_NAMES[1].COLUMN_NAME) {
		                								  errorLog += that.oApplicationFacade.getResourceBundle().getText("ERROR_DUPLICATE_MEASURE_THREE_MEASURES");
		                							  } 
		                							  else if(evaluation.COLUMN_NAMES[0].COLUMN_NAME == evaluation.COLUMN_NAMES[2].COLUMN_NAME) {
		                								  errorLog += that.oApplicationFacade.getResourceBundle().getText("ERROR_DUPLICATE_MEASURE_THREE_MEASURES");
		                							  }
		                							  else if(evaluation.COLUMN_NAMES[1].COLUMN_NAME == evaluation.COLUMN_NAMES[2].COLUMN_NAME) {
		                								  errorLog += that.oApplicationFacade.getResourceBundle().getText("ERROR_DUPLICATE_MEASURE_THREE_MEASURES");
		                							  }
		                						  }
		                					  }
		                				  }
		                				  if(errorLog) {
		                					  sap.suite.smartbusiness.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("ACTIVATION_ERROR"), errorLog);
		                				  }
		                				  else {
		                					  //odata write
//		                					  that.oApplicationFacade.getODataModel().create("/ACTIVE_CHIPS",{id:that.selectedTile.getBindingContext().getObject().id},null,function(data) {
//		                						  sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("ACTIVATION_SUCCESSFUL"));
//		                						  that.oApplicationFacade.getODataModel().refresh();
//		                						  that.selectedTile = undefined;
//		                						  that.updateFooterButtons();
//
//		                					  },function(err){
//		                						  sap.suite.smartbusiness.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("ACTIVATION_ERROR"), err.response.body);
//		                					  });
		                					  
		                					  //xsjs write
		                					  sap.suite.smartbusiness.utils.create(sap.suite.smartbusiness.utils.serviceUrl("ACTIVATE_CHIP_SERVICE_URI"),{id:that.selectedTile.getBindingContext().getObject().id},null,function(data) {
		                						  sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("ACTIVATION_SUCCESSFUL"));
		                						  that.oApplicationFacade.getODataModel().refresh();
		                						  that.selectedTile = undefined;
		                						  that.updateFooterButtons();

		                					  },function(err){
		                						  sap.suite.smartbusiness.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("ACTIVATION_ERROR"), err.responseText);
		                					  });
		                				  }
		                			  }
		                		  }
		                		  else {
		                			  sap.suite.smartbusiness.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("SELECT_A_TILE_TO_DELETE"));
		                		  }
		                	  },
		                  },
		                  {
		                	  sI18nBtnTxt : that.oApplicationFacade.getResourceBundle().getText("EDIT")+" "+that.oApplicationFacade.getResourceBundle().getText("STATUS_DRAFT"),
		                	  onBtnPressed : function(evt) {
		                		  if(that.selectedTile) {
		                			  var chipContext = that.selectedTile.getBindingContext().sPath.replace("isActive=1","isActive=0");
		                			  chipContext = chipContext.replace("/CHIPS_MODELER","CHIPS");
		                			  that.oRouter.navTo("editTile", {
		                				  contextPath : that.getView().getBindingContext().sPath.substr(1),
		                				  chipContextPath : chipContext
		                			  });
		                		  }
		                		  else {
		                			  sap.suite.smartbusiness.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("SELECT_A_TILE_TO_EDIT"));
		                		  }
		                	  },
		                  }, 
		                  {
		                	  sI18nBtnTxt : that.oApplicationFacade.getResourceBundle().getText("EDIT"),
		                	  onBtnPressed : function(evt) {
		                		  if(that.selectedTile) {
		                			  that.oRouter.navTo("editTile", {
		                				  contextPath : that.getView().getBindingContext().sPath.substr(1),
		                				  chipContextPath : that.selectedTile.getBindingContext().sPath.replace("/CHIPS_MODELER","CHIPS")
		                			  });
		                		  }
		                		  else {
		                			  sap.suite.smartbusiness.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("SELECT_A_TILE_TO_EDIT"));
		                		  }
		                	  },
		                  },                                
		                  {
		                	  sI18nBtnTxt : that.oApplicationFacade.getResourceBundle().getText("DELETE"),
		                	  onBtnPressed : function(evt) {
		                		  if(that.selectedTile) {

		                			  sap.m.MessageBox.show(
		                					  that.oApplicationFacade.getResourceBundle().getText("WANT_TO_DELETE_SELECTED_TILE"),
		                					  "sap-icon://hint",
		                					  that.oApplicationFacade.getResourceBundle().getText("DELETE"),
		                					  [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL ],
		                					  function(evt){
		                						  if(evt=="OK"){
		                							  that.oApplicationFacade.getODataModel().remove(that.selectedTile.getBindingContext().sPath.replace("CHIPS_MODELER","CHIPS"),null,function(data) {
		                								  sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("DELETION_SUCCESSFUL"));
		                								  that.oApplicationFacade.getODataModel().refresh();
		                								  that.selectedTile = undefined;
		                								  that.updateFooterButtons(); 
		                							  },function(err){
		                								  sap.suite.smartbusiness.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("DELETION_FAILED"), err.response.body);
		                							  });
		                						  }
		                						  if(evt=="CANCEL"){

		                						  }
		                					  }
		                			  );
		                		  }
		                		  else {
		                			  sap.suite.smartbusiness.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("SELECT_A_TILE_TO_DELETE"));
		                		  }
		                	  },
		                  }
		                  ]
		return buttonList;

	},

	setSorting: function(key, groupDescending) {
		groupDescending = groupDescending || false;
		var list = this.getView().byId("tileGrid");
		if(key == "tileType") {
			list.getBinding("items").sort([new sap.ui.model.Sorter("tileType",groupDescending,null)]); 
		} 
		else if(key == "status") {
			list.getBinding("items").sort([new sap.ui.model.Sorter("isActive",groupDescending,null), new sap.ui.model.Sorter("COUNTER",groupDescending,null)]);
		}
		else if(key == "none") {
			list.getBinding("items").sort([]);
		}
	},

	setFiltering: function(items) {
		var filtersArray = [];
		var list = this.getView().byId("tileGrid");

		var filterObject = {
				"NT": (new sap.ui.model.Filter("tileType", sap.ui.model.FilterOperator.EQ, 'NT')),
				"CT": (new sap.ui.model.Filter("tileType", sap.ui.model.FilterOperator.EQ, 'CT')),
				"AT": (new sap.ui.model.Filter("tileType", sap.ui.model.FilterOperator.EQ, 'AT')),
				"TT": (new sap.ui.model.Filter("tileType", sap.ui.model.FilterOperator.EQ, 'TT')),
				"CM": (new sap.ui.model.Filter("tileType", sap.ui.model.FilterOperator.EQ, 'CM')),
				"new": (new sap.ui.model.Filter("isActive", sap.ui.model.FilterOperator.EQ, 0)),
				"active": (new sap.ui.model.Filter("isActive", sap.ui.model.FilterOperator.EQ, 1))
		};
		
		filtersArray = sap.suite.smartbusiness.utils.getFilterArray(items, filterObject);
		
		if(filtersArray.length) {
			list.getBinding("items").filter(new sap.ui.model.Filter(filtersArray, true));
		}
		else {
			list.getBinding("items").filter(filtersArray);
		}
		
	},
	
	handleSortPress: function() {
		var that = this;
		this.sortOptionsDialog = this.sortOptionsDialog || new sap.m.ViewSettingsDialog({
			id: this.createId("sortOptionsDialog"),
			sortItems: [
					new sap.m.ViewSettingsItem({
						text: that.oApplicationFacade.getResourceBundle().getText("TILE_TYPE"),
						key: "tileType"
					}), 
					new sap.m.ViewSettingsItem({
						text: that.oApplicationFacade.getResourceBundle().getText("STATUS"),
						key: "status"
					}),
					new sap.m.ViewSettingsItem({
						text: that.oApplicationFacade.getResourceBundle().getText("NONE"),
						key: "none"
					})
					],
			confirm : function(evt) {
				if(evt.getParameter("sortItem")) {
					that.setSorting(evt.getParameter("sortItem").getKey(), evt.getParameter("sortDescending"));
            	}
			}
		});
		this.sortOptionsDialog.open();
	},
	
	handleFilterPress: function() {
		var that = this;
		this.filterOptionsDialog = this.filterOptionsDialog || new sap.m.ViewSettingsDialog({
			id: this.createId("filterOptionsDialog"),
			filterItems: [
			              new sap.m.ViewSettingsFilterItem({
			            	  text: that.oApplicationFacade.getResourceBundle().getText("TILE_TYPE"),
			            	  key: "tileType",
			            	  items: [
			            	          new sap.m.ViewSettingsItem({
			            	        	  text: that.oApplicationFacade.getResourceBundle().getText("NUMERIC_TILE"),
			            	        	  key: "NT"
			            	          }),
			            	          new sap.m.ViewSettingsItem({
			            	        	  text: that.oApplicationFacade.getResourceBundle().getText("COMPARISON_TILE"),
			            	        	  key: "CT"
			            	          }),
			            	          new sap.m.ViewSettingsItem({
			            	        	  text: that.oApplicationFacade.getResourceBundle().getText("TREND_TILE"),
			            	        	  key: "AT"
			            	          }),
			            	          new sap.m.ViewSettingsItem({
			            	        	  text: that.oApplicationFacade.getResourceBundle().getText("ACTUAL_VS_TARGET_TILE"),
			            	        	  key: "TT"
			            	          }),
			            	          new sap.m.ViewSettingsItem({
			            	        	  text: that.oApplicationFacade.getResourceBundle().getText("COMPARISON_MM_TILE"),
			            	        	  key: "CM"
			            	          })
			            	          ]
			              }),
			              new sap.m.ViewSettingsFilterItem({
			            	  text: that.oApplicationFacade.getResourceBundle().getText("STATUS"),
			            	  key: "status",
			            	  items: [
			            	          new sap.m.ViewSettingsItem({
			            	        	  text: that.oApplicationFacade.getResourceBundle().getText("STATUS_NEW"),
			            	        	  key: "new"
			            	          }),
			            	          new sap.m.ViewSettingsItem({
			            	        	  text: that.oApplicationFacade.getResourceBundle().getText("STATUS_ACTIVE"),
			            	        	  key: "active"
			            	          }) 
			            	          ]
			              })
			              ],
			              confirm : function(evt) {
			            	  var infoBarText = "";
			            	  var selectedFilters = evt.getParameter("filterItems");

			            	  that.setFiltering(evt.getParameter("filterItems"));

			            	  if(selectedFilters && selectedFilters.length) {
			            		  var filterObj = {};
			            		  for(var i=0,l=selectedFilters.length; i<l; i++) {
			            			  filterObj[selectedFilters[i].getParent().getKey()] = filterObj[selectedFilters[i].getParent().getKey()] || "";
			            			  filterObj[selectedFilters[i].getParent().getKey()] += (filterObj[selectedFilters[i].getParent().getKey()]) ? (",") : "";
			            			  filterObj[selectedFilters[i].getParent().getKey()] += selectedFilters[i].getText(); 
			            		  }

			            		  for(var filter in filterObj) {
			            			  if(filterObj.hasOwnProperty(filter)) {
			            				  infoBarText += (infoBarText) ? " ; " : "";
			            				  infoBarText += filterObj[filter];
			            			  }
			            		  }
			            		  that.byId("filterToolbar").setVisible(true);
			            		  that.byId("visualizationInfo").setText(infoBarText);	
			            	  }
			            	  else {
			            		  that.byId("visualizationInfo").setText("");
			            		  that.byId("filterToolbar").setVisible(false);
			            	  }
			              }
		});
		this.filterOptionsDialog.open();
	}
});


