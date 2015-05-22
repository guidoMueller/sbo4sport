jQuery.sap.declare("sap.suite.ui.smartbusiness.lib.ListPersona");
/**
 * 
 * @param oParam
 * @returns {sap.suite.ui.smartbusiness.lib.ListPersona}
 * 
 * oParam should be an Object with following Properties
 * {
 *   title:'', //Title of Dialog Box
 *   namedModel : "DDA", //Named model name, if any("optional")
 *   context : "/CHART_TYPES",  context path of list binded.('Absolute Path')
 *   view : this.getView(),// view reference, using this the controller will get the reference of Model Data,
 *                          view.getModel().getData();   
 *   listItemContext : 'key' //  dialogbox  will use this context to bind each list item of LIST.  (Relative to 'context')  
 *   filter : { //if list if filtered, pass the filter property and filter value ("OPTIONAL")
 *      property : '',
 *      value ; ''
 *   }
 *   
 * }
 * 
 */

sap.suite.ui.smartbusiness.lib.ListPersona = function(oParam) {
    this.oParam = oParam;
    this.init();
};
sap.suite.ui.smartbusiness.lib.ListPersona.prototype = {
   init : function() {
       this.CHANGE_STATE = false;
       this.oContext = this.oParam.context;
       if(jQuery.sap.startsWith(this.oContext,"/")) {
           this.oContext = this.oContext.substring(1);
       }
       this.oView = this.oParam.view;
       this.namedModel = this.oParam.namedModel;
       this.oModel = this.oView.getModel();
       if(this.namedModel) {
           this.oModel = this.oView.getModel(this.namedModel);
       }
       
       var viewDataRef = this.oModel.getContext("/"+this.oContext).getObject();
       this.oData = [];
       this.oBackupData = [];
       jQuery.extend(true, this.oData, viewDataRef);
       jQuery.extend(true, this.oBackupData, viewDataRef);
       this.iLength = this.oData.length;
       if(this.oParam.filter) {
           this.iLength = this._getArrayIndex(this.oData.length-1) + 1;
       }
       this.oTempModel = new sap.ui.model.json.JSONModel({data : this.oData});
       this._initializeDialogView();
       this.oDialog.setModel(this.oTempModel);
       if(this.oParam.filter) {
           this.oList.getBinding("items").filter(new sap.ui.model.Filter(this.oParam.filter.property,sap.ui.model.FilterOperator.EQ,this.oParam.filter.value));
       }
   },
   _getArrayIndex : function(sIndex) {
       var aIndex = -1;
       for(var i=0;i<=sIndex;i++) {
           var eachRecord = this.oData[i];
           if(eachRecord[this.oParam.filter.property] == this.oParam.filter.value) {
               aIndex++;
           }
       }
       return aIndex;
   },
   handleListSelection : function(oEvent) {
       if(this.iLength > 1) {
           this._oSelectedItemIndex = +((oEvent.getParameter("listItem").getBindingContext().getPath()).split('/').pop());
           var sIndex = this._oSelectedItemIndex;
           if(this.oParam.filter) {
               sIndex = this._getArrayIndex(this._oSelectedItemIndex);
           }
           this.setSelectedIndex(sIndex);
       }
   },
   setSelectedIndex : function(sIndex, bChangeListSelection) {
       this.selectedIndex = sIndex;
       if(this.selectedIndex == 0) {
           this.moveDownButton.setEnabled(true);
           this.moveUpButton.setEnabled(false);
       } else if(this.selectedIndex > 0 && this.selectedIndex < this.iLength-1) {
           this.moveDownButton.setEnabled(true);
           this.moveUpButton.setEnabled(true);
       } else if(this.selectedIndex == this.iLength -1) {
           this.moveDownButton.setEnabled(false);
           this.moveUpButton.setEnabled(true);
       } else {
           jQuery.sap.log.error("Invalid Selected Index");
       }
       if(bChangeListSelection) {
           this.oList.setSelectedItem(this.oList.getItems()[this.selectedIndex], true);
       }
   },
   _getPreviousIndex : function(sIndex) {
       var rIndex = -1;
       for(var i=0;i<sIndex;i++) {
           var eachRecord = this.oData[i];
           if(eachRecord[this.oParam.filter.property] == this.oParam.filter.value) {
               rIndex = i;
           }
       }
       return rIndex;
   },
   _getNextIndex : function(sIndex) {
       var rIndex = -1;
       for(var i=this.oData.length-1;i>sIndex;i--) {
           var eachRecord = this.oData[i];
           if(eachRecord[this.oParam.filter.property] == this.oParam.filter.value) {
               rIndex = i;
           }
       }
       return rIndex;
   },
   moveItemUp : function() {
       var temp = this.oData[this._oSelectedItemIndex];
       var previousIndex = this._oSelectedItemIndex -1;
       if(this.oParam.filter) {
           previousIndex = this._getPreviousIndex(this._oSelectedItemIndex);
       }
       this.oData[this._oSelectedItemIndex] = this.oData[previousIndex];
       this.oData[previousIndex] = temp;
       this.oTempModel.updateBindings();
       this.setSelectedIndex(this.selectedIndex-1, true);
       this.CHANGE_STATE = true;
       this._oSelectedItemIndex = previousIndex;
   },
   moveItemDown : function() {
       var temp = this.oData[this._oSelectedItemIndex];
       var nextIndex = this._oSelectedItemIndex + 1;
       if(this.oParam.filter) {
           nextIndex = this._getNextIndex(this._oSelectedItemIndex);
       }
       this.oData[this._oSelectedItemIndex] = this.oData[nextIndex];
       this.oData[nextIndex] = temp;
       this.oTempModel.updateBindings();
       this.setSelectedIndex(this.selectedIndex+1, true);
       this.CHANGE_STATE = true;
       this._oSelectedItemIndex = nextIndex;
   },
   resetEverything : function() {
       if(this.CHANGE_STATE) {
           this.oData = [];
           jQuery.extend(true, this.oData, this.oBackupData);
           this.oList.removeSelections();
           this.oTempModel = new sap.ui.model.json.JSONModel({data : this.oData});
           this.oDialog.setModel(this.oTempModel);
           this.oTempModel.updateBindings();
           if(this.oParam.filter) {
               this.oList.getBinding("items").filter(new sap.ui.model.Filter(this.oParam.filter.property,sap.ui.model.FilterOperator.EQ,this.oParam.filter.value));
           }
           this.moveDownButton.setEnabled(false);
           this.moveUpButton.setEnabled(false);
           this.CHANGE_STATE = false;
       }
   },
   _initializeDialogView : function() {
	
       var that = this;
       this.oList = new sap.m.List({
           mode : "SingleSelectMaster",
           selectionChange : jQuery.proxy(this.handleListSelection, this)
       }).bindAggregation("items", "/data", new sap.m.StandardListItem({
           title : {
               path : this.oParam.listItemContext
           }
       }));
       this.moveUpButton = new sap.m.Button({
           icon :"sap-icon://arrow-top",
           enabled : false,
           press : function() {
               that.moveItemUp();
           }
       });
       this.moveDownButton = new sap.m.Button({
           icon : "sap-icon://arrow-bottom",
           enabled : false,
           press : function() {
               that.moveItemDown();
           }
       });
       this.undoButton = new sap.m.Button({
           icon : "sap-icon://undo",
           press : function() {
               that.resetEverything();
           }
       });
       this.oDialog =  new sap.m.Dialog({
           title : this.oParam.title || "Change Order of List Item",
           content :[
                     this.oList,
                     new sap.m.Bar({
                         design : "Header",
                         contentLeft : [
                                        this.moveUpButton,
                                        this.moveDownButton
                         ],
                         contentRight : [
                                         this.undoButton
                         ]
                     })
           ],
           beginButton : new sap.m.Button({
               text : this.oView.getModel("i18n").getProperty("OK"),
               press : jQuery.proxy(this.okDialog,this)
           }),
           endButton : new sap.m.Button({
               text : this.oView.getModel("i18n").getProperty("CANCEL"),
               press : jQuery.proxy(this.closeDialog,this)
           })
       });
   },
   start : function() {
       this.oDialog.open();
   },
   closeDialog : function() {
       this.oDialog.close();
   },
   okDialog : function() {
       if(this.CHANGE_STATE) {
           this.oModel.getData()[this.oContext] = this.oData;
           this.oModel.updateBindings();
       }
       this.oDialog.close();
       if(this.oParam.callback) {
           this.oParam.callback.call(null);
       }
   }
};