// Copyright (c) 2013 SAP AG, All Rights Reserved
/**
 * @fileOverview
 *
 * @version 1.24.5
 */
(function () {
    "use strict";
    /*global jQuery, sap */

    jQuery.sap.require("sap.ushell.override");
    jQuery.sap.require("sap.ui.core.delegate.ItemNavigation");

    sap.ui.core.Control.extend("sapUshellSuggestSection", {
        metadata : {
            properties : {

            },
            aggregations : {
                "items": {type: "sap.ui.core.Control", multiple: true}
            }

        },
        
        hasContent : function(){
            return true;
            // var items = this.getItems();
            // for (var j = 0; j < items.length; j++) {
            //     if(! items[j].getIsHeader()) return true;
            // }
            // return false;
        }
        
    });
        
    sap.m.List.extend("sapUshellSuggestionList", {

        init: function(oEvent) { 

            sap.m.List.prototype.init.call(this,oEvent);
            this.setShowNoData(false);
            this.setShowSeparators(sap.m.ListSeparators.Inner);

            this.oItemNavigation = new sap.ui.core.delegate.ItemNavigation();
            this.oItemNavigation.attachEvent("AfterFocus", this._afterFocus);
            this.addDelegate(this.oItemNavigation);
        },

        exit: function(oEvent) { 
            this.oItemNavigation.detachEvent("AfterFocus", this._afterFocus);
            this.oItemNavigation.destroy();
        },

        _afterFocus: function(oEvent) { 

            // this.setFocusedIndex(2);
            this.setFocusedIndex(this.getItemDomRefs().indexOf(this.getFocusedDomRef()));
        },

        // the control API:
        metadata : {
            properties : {

            },
            aggregations : {
                "sections": {type: "sap.ui.core.Control", multiple: true}
            },
            events: {

            }
        },

        // the part creating the HTML:
        renderer : function(oRm, oControl) { // static function, so use the given "oControl" instance instead of "this" in the renderer function
            /// outer div
            oRm.write("<div");
            oRm.writeControlData(oControl);  // writes the Control ID
            oRm.writeClasses();
            oRm.write(">");
            
            var sections = oControl.getSections();
              for (var i = 0; i < sections.length; i++) {
                  var section = sections[i];
                  if(section.hasContent()){
                      var items = section.getItems();
                      
                      for (var j = 0; j < items.length; j++) {
                          items[j].addStyleClass('suggestList');
                          oRm.renderControl(items[j]);
                          
                      }
                      
                  }
              }

            /// close outer div
            oRm.write("</div>"); // end of the complete control
        },

        onAfterRendering: function(oEvent) { 

            var oFocusRef = this.getDomRef();
            // var aDomRefs = oFocusRef.getElementsByTagName("li");
            // var aDomRefs = oFocusRef.getElementsByTagName("li");
            var aDomRefs = oFocusRef.getElementsByClassName("sapUshellSuggestListItem");
            
            var aItems = [];
            var iMaxColumns = 2;

            // Get max number of columns in one row
            // jQuery.each(aDomRefs, function (i, value) {
            //     var iClolumns = value.getElementsByClassName("sapUshellSearchSuggestionNavItem").length;
            //     if (iClolumns > iMaxColumns) {
            //         iMaxColumns = iClolumns;
            //     }
            // });

            var aRows = oFocusRef.getElementsByClassName("sapUshellSearchSuggestionNavItem");

            for (var i = 0; i < aDomRefs.length; i++) {
                var navItems = aDomRefs[i].getElementsByClassName("sapUshellSearchSuggestionNavItem");

                //Always fill max columns
                var lastDom;
                for (var j = 0; j < iMaxColumns; j++) {
                    var navItem = navItems[j];
                    if (navItem) {
                        aItems.push(navItem);
                        lastDom = navItem;
                    }else{
                        aItems.push(lastDom);
                    }
                }

            }

            // for (var i=0;i<aRows.length;i++) {
            //     aItems.push(aRows[i]); 

            // }

            // for (var i = 0; i < aDomRefs.length; i++) {
            //     aItems.push(aDomRefs[i]);
            // }

            // // Build Grid
            // jQuery.each(aDomRefs, function (i, value) {
            //     var oLinks = value.getElementsByClassName("sapUshellSearchSuggestionNavItem");

            //     if (oLinks.length > 0) {
            //         for (var j=0; j < iMaxColumns; j++) {
            //             aItems.push(oLinks[j] || aItems[aItems.length - 1]);
            //         }
            //     }
            // });

            // After each rendering the delegate needs to be initialized as well.
            this.oItemNavigation
                .setRootDomRef(oFocusRef)
                .setItemDomRefs(aItems)
                .setCycling(true)
                .setColumns(iMaxColumns)
                .setSelectedIndex(0);


        }
        
    });


    sap.ushell.ui.launchpad.SearchSuggestionList.prototype.init = function (oEvent) {
        sap.m.List.prototype.init.call(this,oEvent);
        this.setShowNoData(false);
        this.setShowSeparators(sap.m.ListSeparators.Inner);

        this.oItemNavigation = new sap.ui.core.delegate.ItemNavigation();
        this.oItemNavigation.attachEvent("AfterFocus", this._afterFocus);
    };

    sap.ushell.ui.launchpad.SearchSuggestionList.prototype.exit = function (oEvent) {
        this.oItemNavigation.detachEvent("AfterFocus", this._afterFocus);
        this.oItemNavigation.destroy();
    };




}());