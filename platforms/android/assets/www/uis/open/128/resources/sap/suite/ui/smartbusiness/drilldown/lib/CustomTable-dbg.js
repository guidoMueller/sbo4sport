jQuery.sap.declare("sap.suite.ui.smartbusiness.drilldown.lib.CustomTable");
sap.m.Table.extend("sap.suite.ui.smartbusiness.drilldown.lib.CustomTable", {
       metadata : {
              properties : {
                     actionItems : {
                            type : "any", multiple : true
                     }
              }
       },
       renderer  : {}
});

sap.suite.ui.smartbusiness.drilldown.lib.CustomTable.prototype.init = function() {
       sap.m.Table.prototype.init.apply(this);
       this._selectedContext = [];
       var oCustomHeader = new sap.m.Bar({
           contentMiddle:[ new sap.m.Label({
               text:"{i18n>TABLE_POPOVER_HEADING}"
           })],
           contentRight:(jQuery.device.is.phone) ? [] :
               [new sap.m.Button({
                   icon:"sap-icon://decline",
                   width : "2.375rem",
                   press:jQuery.proxy(this._closePopover, this)
               })]
       });
       this._popOver = new sap.m.ResponsivePopover({
           modal:false,
           enableScrolling:true,
           verticalScrolling:true,
           horizontalScrolling:false,
           placement:sap.m.PlacementType.Auto,
           contentWidth:"18rem",
           customHeader:oCustomHeader
       });
    var oStaticArea = sap.ui.getCore().getUIArea(sap.ui.getCore().getStaticAreaRef());
    oStaticArea.addContent(this._popOver, true);
};

sap.suite.ui.smartbusiness.drilldown.lib.CustomTable.prototype._closePopover = function() {
       if(this._popOver.isOpen()) {
              this._popOver.close();
       }
};
sap.suite.ui.smartbusiness.drilldown.lib.CustomTable.prototype.setPopoverFooter = function(oContent) {
    this._popOver.removeAllContent();
    this._popOver.addContent(oContent);
};
sap.suite.ui.smartbusiness.drilldown.lib.CustomTable.prototype.onBeforeRendering = function() {
       this._popOver.getCustomHeader().getContentMiddle()[0].setText(this.getModel("i18n").getProperty("TABLE_POPOVER_HEADING"));
       this.attachSelectionChange(function(oEvent) {
    	   	  var a = oEvent.getParameters().listItems[0];
    	   	  this.popoverOpenAt = a;
              var selectedItems=[];
              var items = this.getSelectedItems();
              var columns = this.getColumns();
              if(items.length) {
                     var item = items[0];
                     var bindingData = item.getBindingContext().getObject();
                     var obj=  {};
                     for(var each in bindingData) {
                         obj[each] = bindingData[each];
                     }
                     selectedItems.push(obj);
                     this.setSelectedContext(selectedItems);
                     if(true || this._notEmpty()) {
                         this._popOver.openBy(a.getCells()[parseInt(a.getCells().length/2) || 0],false);
                     }
              } else {
                 this._closePopover();
              }
       });
};
sap.suite.ui.smartbusiness.drilldown.lib.CustomTable.prototype._notEmpty = function() {
    var content = this._popOver.getContent()
    var notEmpty = false;
    if(content && content.length > 0) {
        var vBox = content[0];
        var listItems = vBox.getItems();
        listItems.forEach(function(list){
            if(list.getItems().length > 0) {
                notEmpty = true;
                return false;
            }
        });
    } 
    return notEmpty;
};
sap.suite.ui.smartbusiness.drilldown.lib.CustomTable.prototype.setSelectedContext = function(aSelected) {
       this._selectedContext = aSelected;
};
sap.suite.ui.smartbusiness.drilldown.lib.CustomTable.prototype.getSelectedContext = function(aSelected) {
       return this._selectedContext;
};