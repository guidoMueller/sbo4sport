jQuery.sap.declare("sap.suite.ui.smartbusiness.drilldown.lib.Performance");
sap.suite.ui.smartbusiness.drilldown.lib.Performance=function(p){this.oParam=p;this._init()};
sap.suite.ui.smartbusiness.drilldown.lib.Performance.prototype={_processData:function(j){var d=[];for(var e in j){var D=j[e];d.push({"TimeTaken":(D.time)/1000,"Call":D.title})}return d},_init:function(){var t=this;this._dataSet=new sap.viz.ui5.data.FlattenedDataset({data:{path:"/"}});var d=["Call"];var m=["TimeTaken"];d.forEach(function(D){var a=new sap.viz.ui5.data.DimensionDefinition({name:D,axis:1,value:{path:D}});this._dataSet.addDimension(a)},this);m.forEach(function(M){var a=new sap.viz.ui5.data.MeasureDefinition({name:M,value:{path:M}});this._dataSet.addMeasure(a)},this);this._oChart=new sap.viz.ui5.Bar({dataset:this._dataSet,width:"750px",height:"380px"});this._oChart.setModel(new sap.ui.model.json.JSONModel());this._oDialog=new sap.m.Dialog({title:"Performance Check",contentWidth:"800px",contentHeight:"400px",endButton:new sap.m.Button({text:"Close",press:function(){t._oDialog.close()}})});this._oDialog.addContent(this._oChart)},start:function(d,c){var p=this._processData(d);this._oChart.getModel().setData(p);var t=this;if(!this._oDialog.isOpen()){if(c){this._oDialog.addStyleClass("sapUiSizeCompact")}else{this._oDialog.removeStyleClass("sapUiSizeCompact")}this._oDialog.open();setTimeout(function(){t._oChart.rerender()},200)}}};