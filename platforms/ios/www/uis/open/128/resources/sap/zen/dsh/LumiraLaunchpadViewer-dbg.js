/* Sample Viewer for the Generic Items Interface 
 * Viewer will output passed in variables and show the basic workflow 
 * for functions (init, showErrors & done )
 */
 /*global sap, jQuery, sap.zen.dsh, $, alert */
/* jshint unused: false */

jQuery.sap.declare("sap.zen.dsh.LumiraLaunchpadViewer");

(function() {
    "use strict";
    
    sap.zen.dsh.LumiraLaunchpadViewer = {

        renderingDiv : "", 

        preload: function(){

            //preload viewer
        },

        /*
         * Description:
         *     Init function creates the Viewer for the BI Analytic Item
         * 
         * Parameters:
         *     JavaScript Object containing:
         *          JSON: viewDetails: { mode: embed | view, pl, pvl, tz }
         *          JSON: analyticItemMetaData: {name, description, uuid}
         *          div: DOM object
         *          function: showErrors
         *          function: done
         * Return Type:
         *  boolean, true if successful, false otherwise
         */
        init: function(params){
            var viewDetails = params.viewDetails;
            var analyticItemMetaData = params.analyticItemMetaData;
            this.renderingDiv = params.renderingDiv;
            var showError = params.showError;
            var done =params.done;
            // parse the viewDetails JSON Object
            var mode = viewDetails.mode;
            var pl = viewDetails.pl;
            var pvl = viewDetails.pvl;
            var tz = viewDetails.tz;
            
            if(!mode){
                showError("Viewer Mode has not been provided");
            }
            
            // parse the analytic items JSON Object
            var analyticItemName = analyticItemMetaData.name;
            var analyticItemDescription = analyticItemMetaData.description;
            var analyticItemUUID = analyticItemMetaData.uuid;
            
            var aPackagesAndFile = analyticItemUUID.split(":");
            
            var aPackages = aPackagesAndFile[0].split("\.");
            var lastPackage = aPackages[aPackages.length - 1];
            
            var url = "/sap/bi/aas/rt/index.html?APPLICATION=" + lastPackage;
            
            var outputHTML = "<iframe style='width: 100%;height: 100%;' src='" + url + "'/>";

            this.renderingDiv.innerHTML=outputHTML;
            
            //display dimensions of window
           // this.displayDimensions();
            
            // Redisplay the screen size when the screen is resized e.g. changing the orientation on an iPad
            $(window).resize(function () {
                sap.zen.dsh.LumiraLaunchpadViewer.displayDimensions();
            });
            
            
            done();
        },

        onBack: function(){
            alert("Going back to LaunchPad... in DS");
        },

        displayDimensions : function(){
            
            var computedStyleDivHTML = "height:" + this.renderingDiv.offsetHeight + "<br/>";
            computedStyleDivHTML += "width:" + this.renderingDiv.offsetWidth + "<br/>";
            
            var computedStyleDiv = document.getElementById('computedStyle');
            computedStyleDiv.innerHTML=computedStyleDivHTML;
        }
    };
}());
