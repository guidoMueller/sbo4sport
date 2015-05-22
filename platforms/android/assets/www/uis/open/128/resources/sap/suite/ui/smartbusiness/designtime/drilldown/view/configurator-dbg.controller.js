sap.ui.getCore().loadLibrary("sap.suite.ui.commons");
jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");
jQuery.sap.require("sap.suite.ui.smartbusiness.tiles.Bullet");
jQuery.sap.require("sap.suite.ui.smartbusiness.tiles.Comparison");
jQuery.sap.require("sap.suite.ui.smartbusiness.tiles.MeasureComparison");
jQuery.sap.require("sap.suite.ui.smartbusiness.tiles.AreaChart");
jQuery.sap.require("sap.suite.ui.smartbusiness.tiles.Numeric");
jQuery.sap.require("sap.m.MessageBox");
sap.ca.scfld.md.controller.BaseDetailController.extend("sap.suite.ui.smartbusiness.designtime.drilldown.view.configurator", {
	onInit : function() {
		this.DDA_MODEL = null;
		this.evaluationId = null;
		this.viewId = null;
		this.ddaFilter=this.byId("ddaFilter");
		
		try{
            if(sap.ui.core.Fragment.byId("addTileDialog","addTileDialog")){
            	sap.ui.core.Fragment.byId("addTileDialog","addTileDialog").destroy();
             }
            if(sap.ui.core.Fragment.byId("addRelatedTilesDialog","evaluationTilesList")){
            	sap.ui.core.Fragment.byId("addRelatedTilesDialog","evaluationTilesList").getParent().destroy();
            }
            if(sap.ui.core.Fragment.byId("configureTileDialog","multipleMeasureDialog")){
            	sap.ui.core.Fragment.byId("configureTileDialog","multipleMeasureDialog").destroy();
             }
			
		}catch(e){
			
		}
		this._addTileDialog=sap.ui.xmlfragment("addTileDialog","sap.suite.ui.smartbusiness.designtime.drilldown.view.addTileDialog", this);
		this._addRelatedTilesDialog=sap.ui.xmlfragment("addRelatedTilesDialog","sap.suite.ui.smartbusiness.designtime.drilldown.view.addRelatedTilesDialog", this);
		this._configureTileDialog=sap.ui.xmlfragment("configureTileDialog","sap.suite.ui.smartbusiness.designtime.drilldown.view.multipleMeasureDialog", this);
		this.initializeTileHeader();
		this.initializeAddTileDialog();
		this.defineHeaderFooterOptions();
		this.oRouter.attachRoutePatternMatched(this.onRoutePatternMatched, this);
		//flag to show if views ever re-ordered
		this.viewsReordered = false;
		this.busyIndicator = new sap.m.BusyDialog();
		var header=this.byId("headerRibbon");
		this.HeaderRibbonModel = new sap.ui.model.json.JSONModel();
		header.setModel(this.HeaderRibbonModel);
		//warning when leaving the page
		var self = this;
		window.onbeforeunload = function(){return self._oTextsModel.getResourceBundle().getText("ARE_YOU_SURE")};
	},
	
	leftArrowAction: function(){
		var that = this;
		var i, tempObj;
		var headerArrayModel = that.getView().getModel("SB_DDACONFIG").getData().HEADERS_VISIBLE;
		var visibleArrayHeader = that.byId("tileContainer").getAggregation("scrollContainer").getAggregation("content");
		try{
			var selectedTile=this._getSelectedTile().tile.getBindingContext("SB_DDACONFIG").getObject();
		}catch(e){selectedTile=null;}
		for(i=0;i<headerArrayModel.length;i++){
			if(headerArrayModel[i] == selectedTile){
				tempObj = headerArrayModel.splice(i,1);
				headerArrayModel.splice(i-1,0,tempObj[0]);
				break;
			}
		}
		that.getView().getModel("SB_DDACONFIG").setProperty("/HEADERS_VISIBLE",headerArrayModel);
		that.getView().getModel("SB_DDACONFIG").updateBindings();
		that._setSelectedTile(that._getSelectedTile().index-1);
	},
	rightArrowAction: function(){
		var that = this;
		var i, tempObj;
		var headerArrayModel = that.getView().getModel("SB_DDACONFIG").getData().HEADERS_VISIBLE;
		var visibleArrayHeader = that.byId("tileContainer").getAggregation("scrollContainer").getAggregation("content");
		try{
			var selectedTile=this._getSelectedTile().tile.getBindingContext("SB_DDACONFIG").getObject();
		}catch(e){selectedTile=null;}
		for(i=0;i<headerArrayModel.length;i++){
			if(headerArrayModel[i] == selectedTile){
				tempObj = headerArrayModel.splice(i,1);
				headerArrayModel.splice(i+1,0,tempObj[0]);
				break;
			}
		}
		that.getView().getModel("SB_DDACONFIG").setProperty("/HEADERS_VISIBLE",headerArrayModel);
		that.getView().getModel("SB_DDACONFIG").updateBindings();
		that._setSelectedTile(that._getSelectedTile().index+1);
	},
	selectedTilesFormatter:function(curId,allHeaders){
		var str=""
		var tileTypeText={
				NT : "Numeric",
		        CT : "Comparison",
		        AT : "Bullet",
		        TT : "Trend"
		};
		allHeaders.forEach(function(s){
			if(s.REFERENCE_EVALUATION_ID==curId && s.visible)
			str+=tileTypeText[s.VISUALIZATION_TYPE]+", ";
		});
		return str?"Selected: "+str.replace(/, $/g,""):"";
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
	takeConfigSnapShot:function(){
		this._configSnapShot=this._cloneObj(this.getView().getModel("SB_DDACONFIG").getData());
	},
	restoreFromConfigSnapShot:function(){
		this.getView().getModel("SB_DDACONFIG").setData(this._configSnapShot);
	},
	bindUiToModel:function(){
		this.DDA_MODEL.bindModel(this.getView(),"SB_DDACONFIG");
		this.DDA_MODEL.bindModel(this._addTileDialog,"SB_DDACONFIG");
		this.DDA_MODEL.bindModel(this._addRelatedTilesDialog,"SB_DDACONFIG");
		this.DDA_MODEL.bindModel(this._configureTileDialog,"SB_DDACONFIG");
	},
	onRoutePatternMatched:function(oEvent){
		var that=this;
		if (oEvent.getParameter("name") === "configurator") {
			
			try {
			
				var evaluationId = oEvent.getParameter("arguments")["evaluationId"];
				var viewId = oEvent.getParameter("arguments")["viewId"];
				if(that.oApplicationFacade.__newViewAdded && that.oApplicationFacade.createdViewId) {
					viewId = that.oApplicationFacade.createdViewId;
					that.oApplicationFacade.createdViewId = null;
					that.oApplicationFacade.__newViewAdded = false;
					window.location.replace(window.location.hash.substring(0,window.location.hash.lastIndexOf("/")) + "/" + viewId);
				}
				that.oApplicationFacade.createdViewId = null;
				that.oApplicationFacade.__newViewAdded = false;
				that._setSelectedTile(-1);
				if(evaluationId !== this.evaluationId) {
					this.evaluationId = evaluationId;
					this.DDA_MODEL =  sap.suite.smartbusiness.ddaconfig.Model.getInstance(this.evaluationId, true,this.getView().getModel("i18n"));
					this.EVALUATION = sap.suite.smartbusiness.kpi.parseEvaluation(this.DDA_MODEL.EVALUATION_DATA);
					var newViewId=this.DDA_MODEL.NEW_VIEWID;
					if(!viewId) {
						viewId = this.DDA_MODEL.getConfigurator().getDefaultViewId();
					}
					this._oTextsModel = this.getView().getModel("i18n");
					this._addTileDialog.setModel(this._oTextsModel,"i18n");
					this._addRelatedTilesDialog.setModel(this._oTextsModel,"i18n");
					this._configureTileDialog.setModel(this._oTextsModel,"i18n");
//					var url=this.getView().getModel("SB_DDACONFIG").getData().QUERY_SERVICE_URI;
//					var entitySet=this.getView().getModel("SB_DDACONFIG").getData().QUERY_ENTITY_SET;
//					var mProperties = sap.suite.smartbusiness.odata.properties(url,entitySet);
//					this.COLUMN_LABEL_MAPPING = this.mProperties.getLabelMappingObject();
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
					try{
						this.ddaFilter.rerender();					
					}catch(e){};
				}else{
					if(this.viewId==newViewId && this.getView().getModel("SB_DDACONFIG").getProperty("/ID")!=newViewId ){
						
					}
				}
				
				//store init count of headers and filters
				this.INIT_COUNT_HEADERS = function(){
					h = that.getView().getModel("SB_DDACONFIG").getData()["HEADERS"];
					var count = 0;
					for(var i = 0; i < h.length; ++i) {
						if (h[i]["visible"] == true)
							++count;
					}
					return count;
				}();
				this.INIT_COUNT_FILTERS = this.getView().getModel("SB_DDACONFIG").getData()["FILTERS"].length;
				if(!this.init_filters) {
					this.init_filters = [];
					this.getView().getModel("SB_DDACONFIG").getData()["FILTERS"].forEach(function(x){that.init_filters.push(x.name)});
				}
				
				//var otoolBar = this.getView().byId("chartToolbar");
				//otoolBar._oFirstDimensionSelect.bindProperty("selectedKey","SB_DDACONFIG>/ID");
				
				this._oModel = this.getView().getModel("SB_DDACONFIG").getData();
				this.refreshChart();

				this.fetchAndRenderHeaderRibbon();
	            this.displayAggregate();
				
			}
			catch(e) {
				sap.suite.smartbusiness.utils.showErrorMessage(this.oApplicationFacade.getResourceBundle().getText("FAILED_TO_LOAD_ODATA"), e.message);
			} 

		}
	},
	/**
	 * Change the Order of View
	 */
	changeViewOrder : function() {
	    var that = this;
	    new sap.suite.ui.smartbusiness.lib.ListPersona({
	        view : this.getView(),
	        context : '/ALL_VIEWS',
	        listItemContext : 'TITLE',
	        namedModel : 'SB_DDACONFIG',
	        callback : function() {
	            var configId = that.DDA_MODEL.selectedView.getId();
	            that.byId('chartToolbar')._oFirstDimensionSelect.setSelectedItem(that.byId('chartToolbar')._oFirstDimensionSelect.getItemByKey(configId));
	            that.viewsReordered = true;
	        }
	    }).start();
	},
	SaveConfig: function() {
		var self = this;
		this.warn_header = false;
		var modelData=this.getView().getModel("SB_DDACONFIG").getData();
		modelData.CURRENT_FILTERS=this.getView().byId("ddaFilter").getActiveDimensions();
		var saveService=sap.suite.smartbusiness.ddaconfig.DrilldownSaveService;
		if(modelData.ALL_VIEWS.length > 0 ) {
			this.busyIndicator.open() && this.getView().setBusy(true);
			saveService.saveEvalConfiguration(this.evaluationId,modelData,"update",function(){
				jQuery.sap.log.info("all calls success");
				self.busyIndicator.close() && self.getView().setBusy(false);
				sap.m.MessageToast.show(self._oTextsModel.getResourceBundle().getText("EVAL_CONFIG_SAVE_SUCCESS"));
				self.oRouter.navTo("detail",{"contextPath" : "EVALUATIONS_DDA('" + self.evaluationId + "')"});
				//this tells the detail route that model has to be refreshed due to eval level save
				self.oApplicationFacade.__refreshModel = 1;
			},function(e){
				jQuery.sap.log.error(e + " failed");
				self.busyIndicator.close() && self.getView().setBusy(false);
				sap.suite.smartbusiness.utils.showErrorMessage(self._oTextsModel.getResourceBundle().getText("SAVE_ERROR"));
			});
		}
		else {
			sap.suite.smartbusiness.utils.showErrorMessage(self._oTextsModel.getResourceBundle().getText("SAVE_ERROR_NO_VIEW_CONFIGURED"));
			jQuery.sap.log.error("No Views Configured. Please configure Views before adding filters/headers");
		}
	},
	
	defineHeaderFooterOptions:function(){
		var that = this;
		this.oHeaderFooterOptions = { 
				onBack: function () {
					var self = that;
					new sap.m.Dialog({
		              icon:"sap-icon://warning2",
		              title:self._oTextsModel.getResourceBundle().getText("WARNING"),
		              state:"Error",
		              type:"Message",
		              content:[new sap.m.Text({text:self._oTextsModel.getResourceBundle().getText("ARE_YOU_SURE")})],
		              beginButton: new sap.m.Button({
		                   text:self._oTextsModel.getResourceBundle().getText("OK"),
		                   press: function(){
		                	   	self.evaluationId = null;
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
				sI18NDetailTitle:"SB_GENERIC_DRILLDOWN",
		        bSuppressBookmarkButton : true,
				buttonList : [{
                    sI18nBtnTxt : "Save",
                    onBtnPressed : function(evt) {
                    	jQuery.sap.log.info("Save button pressed");
                    	that.SaveConfig();
                    },
               },
//               {
//                   sId : "SaveAndActivate", // optional
//                   sI18nBtnTxt : "Save and Activate",
//                   onBtnPressed : function(evt) {
//                	   jQuery.sap.log.info("Save and Activate button pressed");  
//                	   that.SaveConfig();
//                   }
//              },
              {
                  sId : "Delete", // optional
                  sI18nBtnTxt : "Delete",
                  onBtnPressed : function(evt) {
                 	  new sap.m.Dialog({
                 		 icon:"sap-icon://warning2",
                 		 title:that._oTextsModel.getResourceBundle().getText("WARNING"),
                 		 state:"Error",
                 		 type:"Message",
                 		 content:[new sap.m.Text({text:that._oTextsModel.getResourceBundle().getText("DELETE_ALL_CONFIGURATIONS")})],
                 		 beginButton: new sap.m.Button({
                 			 text:that._oTextsModel.getResourceBundle().getText("OK"),
                 			 press: function(){
                 				//go into busy mode.
                 				this.getParent().close();
                 				that.busyIndicator.open() && that.getView().setBusy(true);
                 				that.deleteMaster();
                 			 }
                 		 }),
                 		 endButton: new sap.m.Button({
                 			 text:that._oTextsModel.getResourceBundle().getText("CANCEL"),
                 			 press:function(){this.getParent().close();}
                 		 })
                 	 }).open();
                  }
             },
             {
                 sId : "cancel", // optional
                 sI18nBtnTxt : "Cancel",
                 onBtnPressed : function(evt) {
                	 var self = that;
                	 new sap.m.Dialog({
                		 icon:"sap-icon://warning2",
                		 title:self._oTextsModel.getResourceBundle().getText("WARNING"),
                		 state:"Error",
                		 type:"Message",
                		 content:[new sap.m.Text({text:self._oTextsModel.getResourceBundle().getText("ARE_YOU_SURE")})],
                		 beginButton: new sap.m.Button({
                			 text:self._oTextsModel.getResourceBundle().getText("OK"),
                			 press: function(){
                				 this.getParent().close();
                				 //self.oRouter.navTo("detail",{"contextPath" : "EVALUATIONS_DDA('" + self.evaluationId + "')"});
                				  //this tells the detail route that model has to be refreshed due to eval level save
                				 //self.oApplicationFacade.__refreshModel = 1;
                				 self.evaluationId = null;
                				 window.history.back();
                			 }
                		 }),
                		 endButton: new sap.m.Button({
                			 text:self._oTextsModel.getResourceBundle().getText("CANCEL"),
                			 press:function(){this.getParent().close();}
                		 })                                           
                	 }).open();
                 }
            },
               
               ]
		};
	},
	getHeaderFooterOptions : function() {
		return this.oHeaderFooterOptions;
	},
	onBeforeRendering : function() {
	},
	navigateToConfigureChart:function(){
		var routeObject = {evaluationId: this.evaluationId, viewId: this.viewId+""};
		this.evaluationId=null;/*added by chan to invalidate 
		the drilldown confiuration when navigating to addnew view		
		*/
//		this.DDA_MODEL.setViewId(this.viewId);
//		this.getView().setModel(sap.ui.getCore().getModel("SB_DDACONFIG"),"SB_DDACONFIG");
//		this.getView().getModel("SB_DDACONFIG").refresh();
		this.oRouter.navTo('configureChart', routeObject);
	},
	onAddView: function() {
		var self = this;
		var current_filters = this.getView().byId("ddaFilter").getActiveDimensions();
		if(this.warn_header || String(this.init_filters) != String(current_filters)) {
			//navigation warning
	       	 new sap.m.Dialog({
	       		 icon:"sap-icon://warning2",
	       		 title:self._oTextsModel.getResourceBundle().getText("WARNING"),
	       		 state:"Error",
	       		 type:"Message",
	       		 content:[new sap.m.Text({text:self._oTextsModel.getResourceBundle().getText("ARE_YOU_SURE")})],
	       		 beginButton: new sap.m.Button({
	       			 text:self._oTextsModel.getResourceBundle().getText("OK"),
	       			 press: function(){
	       				
	       				self.warn_header = false;
	       				self.viewId=self.DDA_MODEL.NEW_VIEWID;
	       				self.DDA_MODEL.setViewId(self.viewId);
	       				self.bindUiToModel();
	       				this.getParent().close();
	       				self.navigateToConfigureChart();
	       			 }
	       		 }),
	       		 endButton: new sap.m.Button({
	       			 text:self._oTextsModel.getResourceBundle().getText("CANCEL"),
	       			 press:function(){this.getParent().close();}
	       		 })                                           
	       	 }).open();
		} else {
			this.viewId=this.DDA_MODEL.NEW_VIEWID;
			this.DDA_MODEL.setViewId(this.viewId);
			this.bindUiToModel();
			this.navigateToConfigureChart();
		}
	},

	onEditView:function(){
		var self = this;
		var current_filters = this.getView().byId("ddaFilter").getActiveDimensions();
		if(this.warn_header || String(this.init_filters) != String(current_filters)) {
			//navigation warning
	       	 new sap.m.Dialog({
	       		 icon:"sap-icon://warning2",
	       		 title:self._oTextsModel.getResourceBundle().getText("WARNING"),
	       		 state:"Error",
	       		 type:"Message",
	       		 content:[new sap.m.Text({text:self._oTextsModel.getResourceBundle().getText("ARE_YOU_SURE")})],
	       		 beginButton: new sap.m.Button({
	       			 text:self._oTextsModel.getResourceBundle().getText("OK"),
	       			 press: function(){
	       				 self.warn_header = false;
	       				 this.getParent().close();
	       				 self.navigateToConfigureChart();
	       			 }
	       		 }),
	       		 endButton: new sap.m.Button({
	       			 text:self._oTextsModel.getResourceBundle().getText("CANCEL"),
	       			 press:function(){this.getParent().close();}
	       		 })                                           
	       	 }).open();
		} else {
			this.navigateToConfigureChart();
		}
	},
	tileTypeMapping:{
				NT : "Numeric",
                AT : "Bullet",
                CT : "Comparison",
                TT : "AreaChart",
                CM:"MeasureComparison"
	},
	_getSelectedTile:function(){
		var tiles=this.byId("tileContainer").getItems()||[];
		return {
			tile:tiles[this._selectedTileIndex],
			index:this._selectedTileIndex
		}
		
	},
	_setSelectedTile:function(i){
		this._selectedTileIndex=i;
		var tiles=this.byId("tileContainer").getItems()||[];
		for(j=0;j<tiles.length;j++){
			tiles[j].getTileControl().removeStyleClass("mySelectedStyle");
		}
		this.byId("deleteTile").setEnabled(i!=-1);
		if(i!=-1){
			tiles[i].getTileControl().addStyleClass("mySelectedStyle");
		}
		/*
		if(i!=-1){
			tiles[i].getTileControl().addStyleClass("mySelectedStyle");
			var contextData=tiles[i].getBindingContext("SB_DDACONFIG").getObject();
			this.byId("deleteTile").setEnabled(!(contextData.VISUALIZATION_TYPE=="NT" && contextData.EVALUATION_ID==contextData.REFERENCE_EVALUATION_ID));			
		}else{
			this.byId("deleteTile").setEnabled(i!=-1);
		}
		*/
		this.byId("leftMoveArrow").setEnabled((i!=-1)&&i!=0);
		this.byId("rightMoveArrow").setEnabled((i!=-1)&& i!=tiles.length-1);
	},
	deleteTile:function(){
		var that = this;
		var confirmDialog = new sap.m.Dialog({
			title:"Delete",
			type:"Message",
			content:[new sap.m.Text({text:that.oApplicationFacade.getResourceBundle().getText("DELETE_CONFIRMATION")})],
			beginButton: new sap.m.Button({
				text:"Ok",
				press: function(oEvent){
					confirmDialog.close();
					var tileRef=that._getSelectedTile().tile;
					var visibleHeaderTiles=tileRef.getModel("SB_DDACONFIG").getData().HEADERS_VISIBLE;
					visibleHeaderTiles.splice(that._getSelectedTile().index,1);
					that._setSelectedTile(-1);
					that.refreshTileBindings();
				}
			}),
			endButton: new sap.m.Button({
				text:that.oApplicationFacade.getResourceBundle().getText("CANCEL"),
				press:function(){
					confirmDialog.close();}
			})
		});
		confirmDialog.open(); 
	},
	initializeTileHeader:function(){
		var that=this;
		var tileContainer=this.byId("tileContainer");
		tileContainer.bindAggregation("items",{
				path:"SB_DDACONFIG>/HEADERS_VISIBLE",
				factory:function(sId,oBindingContext){
					var type=oBindingContext.getProperty("VISUALIZATION_TYPE");
					return new sap.suite.ui.smartbusiness.tiles[that.tileTypeMapping[type]]({
						evaluationId:that.evaluationId,
						mode:"DUMMY",
						header:	"{SB_DDACONFIG>TITLE}",
						subheader: "{SB_DDACONFIG>SUBTITLE}"
					}).addStyleClass("drilldownKpiTiles").attachBrowserEvent("click",function(evt){
								var visibleHeaderArray = this.getParent().getAggregation("content");
								that._setSelectedTile(visibleHeaderArray.indexOf(this));
					});
				},
				//filters:[filter]
			});
	},
	initializeAddTileDialog:function(){
		var that=this;
		this._tileEvaluationList=sap.ui.core.Fragment.byId("addRelatedTilesDialog","evaluationTilesList");
		var tileTypeText={
			NT : "NUMBER_TILE",
	        AT : "ACTUAL_VS_TARGET_TILE",
	        CT : "COMPARISON_TILE",
	        TT : "TREND_TILE",
	        CM:"COMPARISON_MM_TILE"
		};
		var sorter1=new sap.ui.model.Sorter('SB_DDACONFIG>GROUPING_TITLE',false,function(oContext){
			return oContext.getProperty('GROUPING_TITLE');
		});
		var sorter2=new sap.ui.model.Sorter('SB_DDACONFIG>VISUALIZATION_TYPE_INDEX',false);
		this._tileEvaluationList.bindAggregation("items",{
			path:"SB_DDACONFIG>/HEADERS",
			factory:function(sId,oBindingContext){
				var type=oBindingContext.getProperty("VISUALIZATION_TYPE");
				var miniTile=new sap.suite.ui.smartbusiness.tiles[that.tileTypeMapping[type]]({
					evaluationId:that.evaluationId,
				 	mode:"DUMMY",
				 	header:	"TITLE",
					subheader: "SUBTITLE",
					contentOnly:true
				});
				var miniTile1=new sap.suite.ui.smartbusiness.tiles[that.tileTypeMapping[type]]({
					evaluationId:that.evaluationId,
				 	mode:"DUMMY",
				 	header:	"TITLE",
					subheader: "SUBTITLE",
					contentOnly:true
				});
				var tilePane= new sap.m.HBox({
					justifyContent:"Start",
					width:"98%",
					items:[miniTile,new sap.m.Label({
			        		 text:{
			        			 path:"SB_DDACONFIG>VISUALIZATION_TYPE",
			        			 formatter:function(s){return that._oTextsModel.getResourceBundle().getText(tileTypeText[s]);}
			        		 }
		        	 		})]
				});
				return new sap.m.CustomListItem({
					type:(type=='NT'||type=='AT')?'Active':'Navigation',
					press:function(){
						var oBindingcontext=this.getBindingContext('SB_DDACONFIG').getObject();
						oBindingcontext['visible']=true;
						if(oBindingcontext.VISUALIZATION_TYPE=='NT'||oBindingcontext.VISUALIZATION_TYPE=='AT'){
							that.getView().getModel("SB_DDACONFIG").getData().HEADERS_VISIBLE.push(that._cloneObj(oBindingcontext));
							that.onAddTileOk();
							that.refreshTileBindings();
						}else{
							that._addRelatedTilesDialog.close();
							try{
								var index=oBindingcontext.VISUALIZATION_TYPE=='CM'?1:0;
								that._configureTileDialog.getContent()[index].getItems()[1].removeAllContent();
								that._configureTileDialog.getContent()[index].getItems()[1].addContent(miniTile1);	
								
							}catch(e){}
							 that._configureTileDialog.bindElement('SB_DDACONFIG>'+this.getBindingContextPath());
							 that._configureTileDialog.open();
								var oI18nModel = that.getView().getModel("i18n");
								
								 var otemplate = new sap.ui.core.Item({
				                        key: "_none^",
				                        text: oI18nModel.getResourceBundle().getText("SELECT_NONE"),

				                   });
								 
								
								 
								 if(!sap.ui.core.Fragment.byId("configureTileDialog","measuresForTile3").getItemByKey("_none^"))

								 sap.ui.core.Fragment.byId("configureTileDialog","measuresForTile3").insertItem(otemplate,"0");
				
						}
					},
					content:[new sap.m.HBox({
						justifyContent:"SpaceAround",
						items:[tilePane]
					})]
				});
			},
			sorter:[sorter1,sorter2]
		});
	},
	onMiniChartConfigureOk:function(){
		var oBindingcontext=this._configureTileDialog.getBindingContext("SB_DDACONFIG").getObject();
		oBindingcontext['visible']=true;
		this.getView().getModel("SB_DDACONFIG").getData().HEADERS_VISIBLE.push(this._cloneObj(oBindingcontext));
		this.onAddTileOk();
		this.refreshTileBindings();
	},
	showConfigureTileMeasure:function(sVal){
		return sVal!='CT'&& sVal!='TT';
	},
	showConfigureTileDimension:function(sVal){
		return sVal=='CT'|| sVal=='TT';
	},
	showConfigureTileSortOrder:function(sVal){
		return sVal=='CT';
	},
	showThirdMeasure:function(sVal){
		return !!sVal;
	},
	refreshTileBindings:function(){
		try{
			var tileContainer=this.byId("tileContainer");
			tileContainer.getModel("SB_DDACONFIG").refresh();
		}catch(e){}
	},
	_refreshEvaluationsBinding:function(){
//		var siblingEvaluations=sap.ui.core.Fragment.byId('addRelatedTilesDialog','siblingEvaluations');
//		var associatedEvaluations=sap.ui.core.Fragment.byId('addRelatedTilesDialog','associatedEvaluations');
//		if(siblingEvaluations.getItems().length){
//			siblingEvaluations.updateItems();
//		}
//		if(associatedEvaluations.getItems().length){
//			associatedEvaluations.updateItems();
//		}
	},
	onAddTileOk:function(oEvent){
		this.takeConfigSnapShot();
		this._setSelectedTile(-1);
		this.refreshTileBindings();
		try{
			this._configureTileDialog.close();
			this._addRelatedTilesDialog.close();	
		}catch(e){}
		this._refreshEvaluationsBinding();
		//to know if navigation warning is to be shown on not.
		this.warn_header = true;
	},
	onAddTileCancel:function(oEvent){
		this.restoreFromConfigSnapShot();
		this._setSelectedTile(-1);
		this.refreshTileBindings();
		try{
			this._configureTileDialog.close();
			this._addRelatedTilesDialog.close();	
		}catch(e){}
		this._refreshEvaluationsBinding();
	},
    _getEvalData:function(sId){
		try{
    		var evalData=sap.suite.smartbusiness.kpi.getEvaluationById({
 	           id : sId, cache : true, filters:false, thresholds:false, getDDAEvaluation:true
 	        });
    		return evalData;
		}catch(e){
			return {};
		}
    },
	createTileMenuForCurrentEvaluation:function(evalId){
		var that=this;
		 var tileOrder = ['NT', 'AT', 'CT', 'TT', 'CM'];
    	function _getAllDimensionsForEval(sId){
    		try{
        		var evalData=that._getEvalData(sId);
        		return sap.suite.smartbusiness.odata.getAllDimensions(evalData.ODATA_URL,evalData.ODATA_ENTITYSET);
    		}catch(e){
    			return [];
    		}
    	}
    	function _getAllMeasuresForEval(sId){
    		try{
        		var evalData=that._getEvalData(sId);
        		return sap.suite.smartbusiness.odata.getAllMeasures(evalData.ODATA_URL,evalData.ODATA_ENTITYSET);
    		}catch(e){
    			return [];
    		}
    	}
    	function _getEvaluationTitle(sId){
    		return that._getEvalData(sId).INDICATOR_TITLE;
    	}
    	function _getEvaluationSubTitle(sId){
    		return that._getEvalData(sId).TITLE;
    	}
    	function _getEvaluationIndicator(sId){
    		return that._getEvalData(sId).INDICATOR;
    	}
		var model=this.getView().getModel("SB_DDACONFIG");
		var measures=_getAllMeasuresForEval(evalId);
		if(!model.getProperty("/HEADER_EVALUATIONID")[evalId]){
			model.getProperty("/HEADER_EVALUATIONID")[evalId]=true;
			var header=model.getProperty("/HEADERS");
			for(var each in this.tileTypeMapping){
				header.push({
                        EVALUATION_ID : this.evaluationId,
                        CONFIGURATION_ID : this.viewId,
                        REFERENCE_EVALUATION_ID : evalId,
                        VISUALIZATION_TYPE : each,
                        VISUALIZATION_TYPE_INDEX:tileOrder.indexOf(each),
                        VISUALIZATION_ORDER : 1,
                        ALL_DIMENSIONS:_getAllDimensionsForEval(evalId),
                        DIMENSION : _getAllDimensionsForEval(evalId)[0]||'',
                        SORT_BY: '',
                        SORT_ORDER:'MD',
                        MEASURE1	:measures[0],
                        MEASURE2	:measures[1]||measures[0],
                        MEASURE3	:measures[2]||"",
                        COLOR1:"Good",
                        COLOR2:"Critical",
                        COLOR3:"Error",
                        ALL_MEASURES:measures,
                        VISIBILITY : 1,
                        visible : false ,
                        TITLE : _getEvaluationTitle(evalId),
                        SUBTITLE : _getEvaluationSubTitle(evalId),
                        INDICATOR:_getEvaluationIndicator(evalId)
				});
			}
		}
	},
	openEvaluationsDialog:function(){
		//this.openMinichartsCancel();
		this._addRelatedTilesDialog.open();
		sap.ui.core.Fragment.byId('addRelatedTilesDialog','showCurrentKpiEvals').firePress();
		
	},
	evaluationGroupTextFormatter:function(context){
		return {text:context.getProperty("GROUPING_TEXT"),key:context.getProperty("GROUPING_TEXT")};
	},
	relatedEvalGroupTextFormatter:function(context){
		var rBundle=this.getView().getModel("i18n").getResourceBundle();
		return {text: (rBundle.getText("KPI")+": " + context.getProperty("INDICATOR")), key: context.getProperty("INDICATOR")}; 
	},
	
	showCurrentKPIEvals:function(){
		var that=this;
		var oModel=this.getView().getModel('SB_DDACONFIG');
		var rBundle=this.getView().getModel("i18n").getResourceBundle();
		if(!oModel.getProperty('/SIBLING_EVALUATIONS').length){
			var tmp=sap.suite.smartbusiness.kpi.getSiblingEvaluations({
		           indicator : oModel.getProperty('/INDICATOR'),
		           id:this.evaluationId,
		           cache : false,
		           filters: false,
		           thresholds: false,
		           getDDAEvaluation: true
		        });
            tmp.forEach(function(s){
        		that.createTileMenuForCurrentEvaluation(s.ID);
            });
            oModel.getData().SIBLING_EVALUATIONS=tmp;
            oModel.getData().HEADERS.forEach(function(s){
    			var prefix=s.REFERENCE_EVALUATION_ID==s.EVALUATION_ID?'('+that._oTextsModel.getResourceBundle().getText('CURRENT_EVALUATION')+')':'';
    			s.GROUPING_TITLE=prefix+s.TITLE+" "+s.SUBTITLE;
            });
		}
		this.takeConfigSnapShot();
		var binding=this._tileEvaluationList.getBinding("items");
		var currentIndicator=this.getView().getModel("SB_DDACONFIG").getProperty("/INDICATOR");
		binding.filter(new sap.ui.model.Filter("INDICATOR",sap.ui.model.FilterOperator.EQ,currentIndicator));
		oModel.refresh();
	},
	showAssociatedEvals:function(){
		var that=this;
		var oModel=this.getView().getModel('SB_DDACONFIG');
		if(!oModel.getProperty('/ASSOCIATED_EVALUATIONS').length){
			oModel.getData().ASSOCIATED_EVALUATIONS=sap.suite.smartbusiness.kpi.getAssociatedEvaluations({
		           indicator : oModel.getProperty('/INDICATOR'),
		           id:this.evaluationId,
		           cache : true
		        });
			oModel.getData().ASSOCIATED_EVALUATIONS.forEach(function(s){
        		that.createTileMenuForCurrentEvaluation(s.ID);
			});
            oModel.getData().HEADERS.forEach(function(s){
    			s.GROUPING_TITLE=s.TITLE+" "+s.SUBTITLE;
            });
		}
		this.takeConfigSnapShot();
		var binding=this._tileEvaluationList.getBinding("items");
		var currentIndicator=this.getView().getModel("SB_DDACONFIG").getProperty("/INDICATOR");
		binding.filter(new sap.ui.model.Filter("INDICATOR",sap.ui.model.FilterOperator.NE,currentIndicator));
		oModel.refresh();
		//sap.ui.core.Fragment.byId('addRelatedTilesDialog','siblingEvaluations').setVisible(false);
		//sap.ui.core.Fragment.byId('addRelatedTilesDialog','associatedEvaluations').setVisible(true);
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
           
        var isStackApplied = (((chtype == "BAR") || (chtype == "COLUMN")) && (this.isStackDim) && (this.getDimensionToBeStacked(that.chartDimensions)) && (dimensions.length > 1)) ? true : false ;        
        
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
	
// ** For deleting a view :
	onDeleteView:function(){
		var that = this;
		this.warn_header = false;
		var tmpData=this.getView().getModel("SB_DDACONFIG").getData();
		var saveService=sap.suite.smartbusiness.ddaconfig.DrilldownSaveService;
		//save headers and filters only if views are already configured
		if(tmpData.ALL_VIEWS.length > 0 ) {
			this.busyIndicator.open() && this.getView().setBusy(true);
			saveService.saveViewConfiguration(this.evaluationId,tmpData,"delete",function(){
				jQuery.sap.log.info("view delete success");
				that.busyIndicator.close() && that.getView().setBusy(false);
				sap.m.MessageToast.show(that._oTextsModel.getResourceBundle().getText("CHART_CONFIG_DELETE_SUCCESS"));						
				for(var i=0,index;i<tmpData.ALL_VIEWS.length;i++){
					if(tmpData.ALL_VIEWS[i].ID == that.viewId) {
						index = i;break;
					}				
				}
				if(index || (index==0)){
					tmpData.ALL_VIEWS.splice(index,1);	
				}
				that.viewId=(tmpData.ALL_VIEWS.length <=0 ? "" : (tmpData.ALL_VIEWS.length == (index)? tmpData.ALL_VIEWS[0].ID : tmpData.ALL_VIEWS[index].ID));					
				that.DDA_MODEL.getConfigurator().removeViewById(tmpData.ID);
				that.DDA_MODEL.setViewId(that.viewId);
				that.bindUiToModel();
				that._oModel = that.DDA_MODEL.getModelDataForDDAConfiguration();
				that.refreshChart();
			},function(e){
				jQuery.sap.log.error(e + " failed");
				//go out of busy mode.
				that.busyIndicator.close() && that.getView().setBusy(false);
				sap.suite.smartbusiness.utils.showErrorMessage(that._oTextsModel.getResourceBundle().getText("DELETE_ERROR"));
			});
		}
	},
	// --------------------------------------------------------------------------------------------

	onViewSwitch: function(oEvent) {
		var sKey = oEvent.getParameter("selectedKey");
		this.viewId = sKey;
		this.DDA_MODEL.setViewId(this.viewId);
		this.bindUiToModel();
		this._oModel = this.DDA_MODEL.getModelDataForDDAConfiguration();
		this.refreshChart();
		window.location.replace(window.location.hash.substring(0,window.location.hash.lastIndexOf("/")) + "/" + this.viewId);
	},
	//--------------------------------------------------------------------------------------------
//	openminicharts:function(){
//		
//		this._oMiniCharts=sap.ui.xmlfragment("sap.suite.ui.smartbusiness.designtime.drilldown.view.minichartsDialog",this);
//		this._oMiniCharts.setModel(this._oTextsModel,"i18n");
//		
//		this._oMiniCharts.open();
//	},
//	openMinichartsCancel:function(){
//		this._oMiniCharts.close();	
//
//	},
	
	/*
	 * START - SAVE AND DELETE FUNCTIONS 
	 */
	
	deleteMaster: function() {

		var that = this;
		this.warn_header = false;
		var modelData=this.getView().getModel("SB_DDACONFIG").getData();
		var saveService=sap.suite.smartbusiness.ddaconfig.DrilldownSaveService;
		this.busyIndicator.open() && this.getView().setBusy(true);
		saveService.saveEvalConfiguration(this.evaluationId,modelData,"delete",function(){
    		  jQuery.sap.log.info("Deleted master configuration for the evaluation");
      		  that.busyIndicator.close() && that.getView().setBusy(false);
      		  that.DDA_MODEL.removeAllViews();
      		  sap.m.MessageToast.show(that._oTextsModel.getResourceBundle().getText("EVAL_CONFIG_DELETE_SUCCESS"));
      		  that.oRouter.navTo("detail",{"contextPath" : "EVALUATIONS_DDA('" + that.evaluationId + "')"});
      		  that.evaluationId=null;
      		  that.oApplicationFacade.__refreshModel = 1;
		},function(e){
      		  jQuery.sap.log.error(e + " failed");
      		  //go out of busy mode.
      		  that.busyIndicator.close() && that.getView().setBusy(false);
      		  sap.suite.smartbusiness.utils.showErrorMessage(that._oTextsModel.getResourceBundle().getText("DELETE_ERROR"));
      	  });
	},
	
	/*
	 * END - SAVE AND DELETE FUNCTIONS
	 */

	



/*ENABLE AGGREGATE*/

	fetchAndRenderHeaderRibbon: function(filters) {
		      
	        var self = this;
	        var Evaluation = this.DDA_MODEL.EVALUATION_DATA;
			var mProperties = sap.suite.smartbusiness.odata.properties(Evaluation.ODATA_URL,Evaluation.ODATA_ENTITYSET);
			var MEASURE_UNIT_PROPERTY_MAPPING = mProperties.getUnitPropertyMappingObject();
	        //on init load, take evaluation's filters; otherwise consider combined filters.
			var oUriObject = sap.suite.smartbusiness.odata.getUri({
	        	serviceUri : Evaluation.ODATA_URL,
	            entitySet : Evaluation.ODATA_ENTITYSET,
	            measure: Evaluation.COLUMN_NAME,
	            filter : Evaluation.FILTERS["results"]
	        });
	        oUriObject.model.read(oUriObject.uri, null, null, true, function(data) {
	            if(data) {
	                self.HeaderRibbonModel.setData({data:data.results[0]});
	            } else {
	                jQuery.sap.log.error("Couldn't fetch Aggregate Value. Response was "+data+" for uri : "+oUriObject.uri);
	            }
	        });
	        var kpiMeasureUnitProperty = MEASURE_UNIT_PROPERTY_MAPPING[Evaluation.COLUMN_NAME];
	       
	        
	        var oI18nModel = this.getView().getModel("i18n");
	       
	        this.byId("aggregate_number").bindProperty("text","/data/"+Evaluation.COLUMN_NAME,function(value){
	        	
	        	if(value==""||value==null)
	        		{
	        		value= oI18nModel.getResourceBundle().getText("NO_DATA");
	        		}
	        	return value;
	        	
	        	
	        });
	        
	        if(kpiMeasureUnitProperty) {
	            this.byId("aggregate_number_unit").bindProperty("text", "/data/" + kpiMeasureUnitProperty,function(value){
	            	return value;
	            });
	        }
	       
	        
	    },

	    displayAggregate:function(){
	    	
		    var oI18nModel = this.getView().getModel("i18n");
		    	 
		    if(this.byId("enableAggregate").getSelected()==false){
		    	this.byId("enableAggregate").setText(oI18nModel.getResourceBundle().getText("ENABLE_KPI_AGGREGATE"));
		    	this.byId("enableAggregate").invalidate();
		    	}else if(this.byId("enableAggregate").getSelected()==true) {
		    		this.byId("enableAggregate").setText("");
		    		
		    	}
		    	
		    }		
});
