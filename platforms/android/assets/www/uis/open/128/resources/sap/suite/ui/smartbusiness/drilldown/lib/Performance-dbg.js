jQuery.sap.declare("sap.suite.ui.smartbusiness.drilldown.lib.Performance");
sap.suite.ui.smartbusiness.drilldown.lib.Performance = function(oParam) {
    this.oParam = oParam;
    this._init();
};
sap.suite.ui.smartbusiness.drilldown.lib.Performance.prototype = {
        _processData : function(junkData) {
            var data = [];
            for(var each in junkData) {
                var oData = junkData[each];
                data.push({
                    "TimeTaken" : (oData.time)/1000,
                    "Call" : oData.title
                });
            }
            return data;
        },
        _init : function() {
            var that = this;
            this._dataSet = new sap.viz.ui5.data.FlattenedDataset({
                data : {
                    path : "/"
                }
            });
            var dimensions = ["Call"];
            var measures = ["TimeTaken"];
            dimensions.forEach(function(sDimension) {
                var dimDefinition = new sap.viz.ui5.data.DimensionDefinition({
                    name : sDimension,
                    axis : 1,
                    value : {
                        path : sDimension
                    }
                });
                this._dataSet.addDimension(dimDefinition);
            }, this);
            measures.forEach(function(sMeasure) {
                var measureDefinition = new sap.viz.ui5.data.MeasureDefinition({
                    name : sMeasure,
                    value : {
                        path : sMeasure
                    }
                });
                this._dataSet.addMeasure(measureDefinition);
            }, this);
            this._oChart = new sap.viz.ui5.Bar({
                dataset : this._dataSet,
                width : "750px",
                height : "380px"
            });
            this._oChart.setModel(new sap.ui.model.json.JSONModel());
            this._oDialog = new sap.m.Dialog({
                title : "Performance Check",
                contentWidth : "800px",
                contentHeight : "400px",
                endButton : new sap.m.Button({
                    text : "Close",
                    press : function() {
                        that._oDialog.close();
                        
                    }
                })
            });
            this._oDialog.addContent(this._oChart);
        },
        start : function(data, bCompactMode) {
            var processedData = this._processData(data);
            this._oChart.getModel().setData(processedData);
            var that = this;
            if(!this._oDialog.isOpen()) {
                if(bCompactMode) {
                    this._oDialog.addStyleClass("sapUiSizeCompact");
                } else {
                    this._oDialog.removeStyleClass("sapUiSizeCompact"); 
                }
                this._oDialog.open();
                setTimeout(function() {
                    that._oChart.rerender();
                },200);
            }
        }
};