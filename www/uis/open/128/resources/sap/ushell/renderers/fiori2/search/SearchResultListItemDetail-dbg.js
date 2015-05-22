// Copyright (c) 2013 SAP AG, All Rights Reserved
/**
 * @fileOverview
 *
 * @version
 */
(function () {
    "use strict";
    /*global jQuery, sap */


    //////////  The ResultListItemDetail Control //////////
    sap.ui.core.Control.extend("SearchResultListItemDetail", {
        // the control API:
        metadata : {
            properties : {
                itemTitle: "string",
                itemTitleUrl: "string",
                itemType: "string",
                itemData: "object",
                firstDetailAttribute: {type:"int", defaultValue:4},
                maxDetailAttributes: {type:"int", defaultValue:8}
            }
        },

        // the part creating the HTML:
        renderer : function(oRm, oControl) { // static function, so use the given "oControl" instance instead of "this" in the renderer function
            /// outer div
            oRm.write('<div');
            oRm.writeControlData(oControl);  // writes the Control ID
            oRm.addClass('searchResultListItemDetail');
            oRm.writeClasses();
            oRm.write('>');

            // detail title and attributes (aka the detail)
            oRm.write('<div class="searchResultListItemDetail-content">');

            // header of the item
            oRm.write('<div class="searchResultListItemDetail-contentTitle">');

            // item type
            // if ( oControl.getItemType() )
            // {
            //     oRm.write('<div>');
            //     var type1 = new sap.m.Text({text: oControl.getItemType()});
            //     type1.addStyleClass("searchResultListItemDetail-type");
            //     oRm.renderControl(type1);
            //     oRm.write("</div>");
            // }


            // // item title
            // if (oControl.getItemTitle())
            // {
            //     oRm.write('<div>');
            //     var title = new sap.m.Link({text: oControl.getItemTitle(), href: oControl.getItemTitleUrl()});
            //     title.addStyleClass("searchResultListItemDetail-title");
            //     oRm.renderControl(title);
            //     oRm.write("</div>");
            // }


            // close header
            oRm.write("</div>");

            // detail attributes
            oRm.write('<div class="searchResultListItemDetail-attributes">');
            if (oControl.getItemData())
            {
                var detailAttributes = oControl.getFirstDetailAttribute() + oControl.getMaxDetailAttributes();
                //container of whyfounds
                var whyFoundAttributesDict = {}; 
                
                var prepareLabelValue = function(pLabelText, pValueText, whyfoundFlag) {
//                	if (whyfoundFlag === true) {
//                		oRm.write('<div class="searchResultListItemDetail-attribute searchResultListItemDetail-whyfound">');
//                	} else {
                		oRm.write('<div class="searchResultListItemDetail-attribute">');
//                	}
                    

                    var label = new sap.m.Label({text: pLabelText});
                    label.setTooltip((''+pLabelText).replace(/<b>/gi, '').replace(/<\/b>/gi, ''));
                    label.addStyleClass("searchResultListItemDetail-attribute-label");
                    oRm.renderControl(label);

                    var value = new sap.m.Text({text: pValueText});
                    value.setTooltip((''+pValueText).replace(/<b>/gi, '').replace(/<\/b>/gi, ''));
                    value.addStyleClass("searchResultListItemDetail-attribute-value");
                    oRm.renderControl(value);

                    // close detail content block
                    oRm.write("</div>");

                };
                
                for (var j = oControl.getFirstDetailAttribute(); j < detailAttributes; j++) {
                    var attrName = "attr"+j+"Name";
                    var attr = "attr"+j;
                    var labelText = oControl.getItemData()[attrName];
                    var valueText = oControl.getItemData()[attr];
                    if(labelText===undefined||valueText===undefined){
                        continue;
                    }
                    prepareLabelValue(labelText, valueText, false);

                }
                
                //push undisplayable whyfound attributes into whyFoundAttributesDict
                for (var z = detailAttributes; z<=oControl.getItemData().numberofattributes; z++) {
//                for (var z = 1; z<=oControl.getItemData().numberofattributes; z++) {
                	var attrWhyfound = "attr"+z+"Whyfound";

                	if (oControl.getItemData()[attrWhyfound] === true) {
                        var attrNameUD = "attr"+z+"Name";
                        var attrUD = "attr"+z;
                        if (!(oControl.getItemData()[attrNameUD] in whyFoundAttributesDict)) {
                        	whyFoundAttributesDict[oControl.getItemData()[attrNameUD]] = oControl.getItemData()[attrUD];
                        }
                	}
                }
                
                // add request attrs without corresponding respond attr to whyfound container, they have subordinate prio than the above native ones 
                if ($.isArray(oControl.getItemData().whyfounds) &&  oControl.getItemData().whyfounds.length > 0) {
                	oControl.getItemData().whyfounds.forEach(function(wf, i) {
                		whyFoundAttributesDict[wf.label] = wf.valueHighlighted;
                	});
                }
                
                // whyfound attributes container
                var empty = true;
                for (var prop4EmptyCheck in whyFoundAttributesDict) {
                	empty = false;
                	break;
                }
                if (empty === false) {
                    oRm.write('<div class="searchResultListItemDetail-whyfound-container">');
                    // display the first 2 whyfound attributes
                    var wfCounter = 0;
                    for (var prop in whyFoundAttributesDict) {
                            var whyFoundLabelText = prop;
                            var whyFoundValueText = whyFoundAttributesDict[prop];
                            if(whyFoundLabelText===undefined||whyFoundValueText===undefined){
                                continue;
                            } else {
                            	wfCounter = wfCounter + 1;
                            	if (wfCounter<3) {
                            		 prepareLabelValue(whyFoundLabelText, whyFoundValueText, true);                    		
                            	} else {
                            		break;
                            	}
                            }
                    }
                    // close whyfound-container div
                    oRm.write("</div>");                	
                }
            }
            
            // close attributes div
            oRm.write("</div>");
            // close detail div
            oRm.write("</div>");
            // close outer div
            oRm.write("</div>"); // end of the complete control
        },

//        // allow <b> in title and attributes
//        onAfterRendering: function() {
//            var self = this;
//            // $(this.getDomRef()).find(".searchResultListItem-left").on("click", function(){ self.fireNavigate(); });
//            this._setSafeText(
//                $(this.getDomRef()).find(".searchResultListItemDetail-title, .searchResultListItemDetail-attribute-value"));
//        },

        setSafeText: function(objs) {
            objs.each(function(i,d) {
                var $d = $(d);
                var s = $d.text().replace(/<b>/gi, '').replace(/<\/b>/gi, '');  /// Only those two HTML tags are allowed.
                if (s.indexOf('<') === -1) {
                    $d.html($d.text());
                }
                //emphasize whyfound in case of ellipsis
                var posOfWhyfound = $d.html().indexOf("<b>");
                if (posOfWhyfound>-1 && d.offsetWidth < d.scrollWidth) {
                    var emphasizeWhyfound = "..." + $d.html().substring(posOfWhyfound);
                    $d.html(emphasizeWhyfound);                    
                }
            });
        }


    });

}());