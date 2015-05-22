//Copyright (c) 2013 SAP AG, All Rights Reserved
/**
 * @fileOverview
 *
 * @version
 */
(function (global) {
    "use strict";
    /*global jQuery, sap */
    


        sap.m.Link.extend("sap.ushell.renderers.fiori2.search.DataSourcePill", {
        metadata : {
            properties : {
                dataSourceName: "string", // closed (default) or open
            },
            events: {
                press: {}
            }
        },
        renderer : function(oRm, oControl) { // static function, so use the given "oControl" instance instead of "this" in the renderer function
            /// outer div
            oRm.write('<div tabindex=0');
            oRm.writeControlData(oControl);  // writes the Control ID
            oRm.addClass("sapUshellDataSourcePill");
            oRm.addClass("sapUshellDataSourceListPill");
            oRm.writeClasses();              // this call writes the above class plus enables support for Square.addStyleClass(...)
            oRm.write(">");

            oRm.write('<div class="sapUiUfdShellSearchBoxPillDsName">'+oControl.getDataSourceName()+'</div>');

            oRm.write("</div>");
        },
        onclick : function(evt) {
            this.firePress();
        },
        onkeyup : function(evt) {
        	if(event.keyCode == 13){
        		this.firePress();
        	}
        }
    });

    sap.ui.core.Control.extend("sap.ushell.renderers.fiori2.search.DataSourceList", {
        // the control API:
        metadata : {
            properties : {
                "dataSources" : {type : "object[]"}
            },
            events: {
                dsPress: {}
            }
        },

        // the part creating the HTML:
        renderer : function(oRm, oControl) { // static function, so use the given "oControl" instance instead of "this" in the renderer function
            

            /// outer div
            oRm.write("<div");
            oRm.writeControlData(oControl);  // writes the Control ID
            oRm.addClass("sapUshellDataSourceList");
            oRm.writeClasses();              // this call writes the above class plus enables support for Square.addStyleClass(...)
            oRm.write('>');

            var sDevice = sap.ui.Device.media.getCurrentRange(sap.ushell.renderers.fiori2.search.DataSourceList.RANGESET);
            var numColums = sap.ushell.renderers.fiori2.search.DataSourceList._columns[sDevice.name];
            
            
            //Build table Columns
            var columns = []; 
            for (var i = 0; i < numColums; i++) {

                var hAlign;
                if (i === 0) {
                    hAlign = "Left";
                }else if(i === numColums-1){
                    hAlign = "Left";
                }else{
                    hAlign = "Left";
                }

                columns.push(new sap.m.Column({
                  hAlign: hAlign
                }));


            }

            var dss = oControl.getDataSources();
            if (dss && dss.length !== 0) {

                $.each(dss, function( i, value ) {

                    var dsLabel = value.label || value.objectName.label || value.objectName.value;
                    if (!dsLabel || dsLabel === "") 
                        dsLabel = value.objectName.value;
                    
                    var pill = new sap.ushell.renderers.fiori2.search.DataSourcePill({
                        dataSourceName: dsLabel,
                        press:function(){
                            oControl.fireDsPress({ds:value});
                        }
                    }).addStyleClass("sapUshellDataSourcePill");

                    oRm.renderControl(pill);
                });
            }

            // var currentColumnListItem;
            // //Build table columncontent
            // var dss = oControl.getDataSources();
            // var emptyCells = 0;
            // if (dss && dss.length !== 0) {

            //     var table = new sap.m.Table({
            //       columns: columns,
            //       showNoData : false,
            //     });

            //     $.each(dss, function( i, value ) {
            //         if(i%numColums === 0){ // new row
            //             currentColumnListItem = new sap.m.ColumnListItem();
            //             table.addItem(currentColumnListItem);
            //         }
            //         var dsLabel = value.label || value.objectName.label || value.objectName.value;
            //         if (!dsLabel || dsLabel === "") 
            //             dsLabel = value.objectName.value;
                    
            //         currentColumnListItem.addCell(
            //             new sap.ushell.renderers.fiori2.search.DataSourcePill({
            //                 dataSourceName: dsLabel,
            //                 press:function(){
            //                     oControl.fireDsPress({ds:value});
            //                 }
            //             }).addStyleClass("sapUshellDataSourcePill")
            //         );
            //         emptyCells = (i+1)%numColums;
            //     });

            //     for (i = 0; i < emptyCells; i++) {
            //         currentColumnListItem.addCell(
            //             new sap.m.Text()
            //         );
            //     }
            //     oRm.renderControl(table);
                
            // }

            /// close outer div
            oRm.write("</div>"); // end of the complete control
        },

        _handleMediaChange: function() {
            this.rerender();
        },



    });
            
    sap.ushell.renderers.fiori2.search.DataSourceList.RANGESET = "DataSourceLayoutRangeSet";
    sap.ushell.renderers.fiori2.search.DataSourceList._columns = {
        Phone : 1,
        Tablet : 2,
        Desktop : 3
    };

    

    sap.ushell.renderers.fiori2.search.DataSourceList.prototype.init = function () {
        // if (sap.m.Table.prototype.init) {
        //     sap.m.Table.prototype.init.call(this);
        // }

        sap.ui.Device.media.initRangeSet(
            sap.ushell.renderers.fiori2.search.DataSourceList.RANGESET,
            [500, 1024],
            "px",
            ["Phone", "Tablet", "Desktop"]
        );
        // sap.ui.Device.media.attachHandler(sap.ushell.renderers.fiori2.search.DataSourceList, this, sap.ushell.renderers.fiori2.search.DataSourceList.RANGESET );
        sap.ui.Device.media.attachHandler(this._handleMediaChange, this, sap.ushell.renderers.fiori2.search.DataSourceList.RANGESET );
    };


}(window));
