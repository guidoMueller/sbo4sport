//Copyright (c) 2013 SAP AG, All Rights Reserved
/**
 * @fileOverview
 *
 * @version
 */
(function (global) {
    "use strict";
    /*global jQuery, sap */

    sap.ui.core.Control.extend("SearchResultListWithDetail", {
        // the control API:
        metadata : {
            properties : {

            },
            aggregations : {
                "resultList":      {type: "sap.ui.core.Control", multiple: false},
                "preview":         {type: "sap.ui.core.Control", multiple: false}
            }
        },

        // the part creating the HTML:
        renderer : function(oRm, oControl) { // static function, so use the given "oControl" instance instead of "this" in the renderer function
            /// outer div
            oRm.write("<div");
            oRm.writeControlData(oControl);  // writes the Control ID
            oRm.addClass("searchResultListWithDetail");
            oRm.writeClasses();              // this call writes the above class plus enables support for Square.addStyleClass(...)
            oRm.write('>');

            oRm.write('<div class="searchLayout-left">');
            if (oControl.getResultList())
            {
                oRm.renderControl(oControl.getResultList());
            }
            oRm.write('</div>');

            oRm.write('<div');
            oRm.addClass("searchLayout-right");
            oRm.writeClasses();
            oRm.write('>');
            if (oControl.getPreview())
            {
                oRm.renderControl(oControl.getPreview());
            }
            oRm.write('</div>');


            /// close outer div
            oRm.write("</div>"); // end of the complete control
        },

        onAfterRendering: function() {
            var self = this;
            var preview = $(this.getDomRef()).find('.searchResultListItemDetail');
            // var resultList = $(this.getDomRef()).find('.searchResultListWithDetail');
            // var headerSize = 50; // offset() calculates the offset to the window, we have to consider the fat header as well
            
            var headerSize = $("#searchPage-cont") ? $("#searchPage-cont").offset().top : $("#searchResultPage-cont").offset().top;

            //App Case
            // if ($("#searchPage-scroll").length > 0) headerSize = 90;

            var updatePos = function(){

                //searchPage-scroll
                if ($("#searchResultPage-scroll").length > 0 || $("#searchPage-scroll").length > 0) {

                    var resultList = $('.searchResultListWithDetail');
                    if (resultList.length > 0)
                    {
                        if (resultList.offset().top - headerSize < 0) //resultlist scrolled outside, fix detail to top
                        {
                            preview.css('margin-top', -resultList.offset().top +headerSize );
                        }else{
                            preview.css('margin-top', 0 );
                        }
                    }
                }

                delayedUpdatePos();

            };

            var delayedUpdatePos = function(){
                //****** This is a bugfix for the iPad, which triggers no event in the deceleration phase *******/
                if (self.lastScrollTimeout)
                {
                    window.clearTimeout(self.lastScrollTimeout);
                }
                self.lastScrollTimeout = setTimeout(function(){
                    updatePos();
                }, 1000);
            };

            $("#searchResultPage-cont").on("scroll", updatePos);

            $("#searchResultPage-cont").bind('touchmove', function(e){
                e.preventDefault();
                updatePos();
            });

            $("#searchPage-cont").on("scroll", updatePos);

            $("#searchPage-cont").bind('touchmove', function(e){
                e.preventDefault();
                updatePos();
            });

            updatePos();

        }

    });



    sap.ui.core.Control.extend("SearchLayout", {
        // the control API:
        metadata : {
            properties : {
                showMainHeader  : {type : "boolean", defaultValue : false},
                enableNoResults  : {type : "boolean", defaultValue : false},
                searchTerm      : "string",
                topHeader       : "string",
                topCount        : "int",
                bottomHeader    : "string",
                bottomHeaderIsUnspecific: {type : "boolean", defaultValue : true}, // DatasorurceIsAll $$ALL$$
                bottomCount     : "int",
                searchBusy      : {type : "boolean", defaultValue : false},
                showBottomList	: {type : "boolean", defaultValue : true}
            },
            aggregations : {
                "topList"       : {type: "sap.ui.core.Control", multiple: false},
                "bottomList"    : {type: "sap.ui.core.Control", multiple: false},
                "facets"        : {type: "sap.ui.core.Control", multiple: false}
            }
        },


        // the part creating the HTML:
        renderer : function(oRm, oControl) { // static function, so use the given "oControl" instance instead of "this" in the renderer function
            oControl.renderResultPage = false;
            oControl.renderNoResultPage = false;

            /// outer div
            oRm.write("<div");
            oRm.writeControlData(oControl);  // writes the Control ID
            oRm.addClass("searchLayout");
            oRm.writeClasses();              // this call writes the above class plus enables support for Square.addStyleClass(...)
            oRm.write('>');


            this.busy = new sap.m.BusyIndicator({
                size:"50px"
            });
            this.busy.addStyleClass('searchBusyIcon');
            this.busy.addStyleClass('hidden');

            if (oControl.getSearchBusy() === true){
                this.busy.removeStyleClass('hidden');


                oRm.write("<div");
                oRm.addClass("searchBusy");
                oRm.writeClasses();              // this call writes the above class plus enables support for Square.addStyleClass(...)
                oRm.write('>');
                oRm.renderControl(this.busy);
                oRm.write("</div>");

                oRm.write("<div");
                oRm.addClass("searchBusyBG");
                oRm.writeClasses();              // this call writes the above class plus enables support for Square.addStyleClass(...)
                oRm.write('>');
                oRm.write("</div>");

                oControl.renderResultPage = false;
                oControl.renderNoResultPage = false;
            }


            //Show main header when there are two lists, or no list
            // var topAndBottomList = oControl.getTopList() && oControl.getBottomList();
            // var noTopAndBottomList = !(oControl.getTopList() || oControl.getBottomList());
            var totalCount = 0;
            if (oControl.getTopCount()) totalCount = totalCount + oControl.getTopCount();
            if (oControl.getBottomCount()) totalCount = totalCount + oControl.getBottomCount();

            var showNoResultsScreen = totalCount === 0 && oControl.getEnableNoResults();

            if (oControl.getShowMainHeader() === true && oControl.getSearchBusy() === false){

                oRm.write('<div class="searchLayout-mainHeader">');
                oRm.renderControl((new sap.m.Label({text: sap.ushell.resources.i18n.getText("searchResults") })).addStyleClass('searchLayout-mainHeaderName'));
                oRm.renderControl((new sap.m.Label({text: '('+totalCount+')' })).addStyleClass('searchLayout-mainHeaderCount'));
                oRm.write('</div>');                    

            }

            // no result page                
            if(showNoResultsScreen && oControl.getSearchBusy() === false){                    
                var escapedSearchTerm = $('<div>').text(oControl.getSearchTerm()).html();
                // render no result page
                oRm.write('<div class="no-result"><div class="no-result-icon">');
                oRm.writeIcon(sap.ui.core.IconPool.getIconURI("travel-request"));
                oRm.write('</div><div class="no-result-text">');
                oRm.write('<div class="no-result-info">' + sap.ushell.resources.i18n.getText("no_results_info").replace('&1', escapedSearchTerm) + '</div>');
                oRm.write('<div class="no-result-tips">' + sap.ushell.resources.i18n.getText("no_results_tips") + '</div> ');
                oRm.write('</div></div>');

                oControl.renderNoResultPage = true;
                oControl.renderResultPage = false;
            }



            if (oControl.getFacets())
            {
                oRm.write('<div class="searchLayout-facets">');
                oRm.renderControl(oControl.getFacets());
                oRm.write('</div>');
            }


            if (oControl.getTopList() && oControl.getTopHeader() && oControl.getSearchBusy() === false) // no header without list or while busy
            {
                oRm.write('<div class="searchLayout-bucket">');
                if(oControl.getTopHeader() && oControl.getTopList()){
                    oRm.renderControl((new sap.m.Label({text: oControl.getTopHeader()})).addStyleClass('searchLayout-bucketName'));
                }
                if (oControl.getTopCount())
                    oRm.renderControl((new sap.m.Label({text: '('+oControl.getTopCount()+')' })).addStyleClass('searchLayout-bucketCount'));
                oRm.write('</div>');
            }

            if (oControl.getTopList() && oControl.getSearchBusy() === false) // No Toplist, when still busy
            {
                oRm.renderControl(oControl.getTopList());
            }

            if (oControl.getShowBottomList() && oControl.getBottomList() && oControl.getBottomHeader()  && oControl.getSearchBusy() === false) // no header without list or while busy
            {   ///Don't Show header if no results above and no datasource selected, or no resultsscreen is shown
                if (oControl.getBottomHeaderIsUnspecific() === true && oControl.getTopCount() === 0 || showNoResultsScreen) 
                {

                }else{
                    oRm.write('<div class="searchLayout-bucket">');
                    if(oControl.getBottomHeader() && oControl.getBottomList())
                        oRm.renderControl((new sap.m.Label({text: oControl.getBottomHeader()})).addStyleClass('searchLayout-bucketName'));

                    if (oControl.getBottomCount())
                        oRm.renderControl((new sap.m.Label({text: '('+oControl.getBottomCount()+')' })).addStyleClass('searchLayout-bucketCount'));                    

                    oRm.write('</div>');
                }

            }

            if (oControl.getShowBottomList() && oControl.getBottomList())
            {
                oRm.renderControl(oControl.getBottomList());
            }

            if(totalCount !== 0){
                oControl.renderResultPage = true;
            }else{
                oControl.renderResultPage = false;
            }
            
            /// close outer div
            oRm.write("</div>"); // end of the complete control
        }

    });

}(window));
