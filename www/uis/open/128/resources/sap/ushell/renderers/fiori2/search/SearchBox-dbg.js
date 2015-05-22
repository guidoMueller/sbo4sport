(function (global) {
    "use strict";

    jQuery.sap.require("sap.m.SearchField");

    
    // extend search field 
    // add pill for datasource

    sap.ushell.renderers.fiori2.search.SearchBox =
        sap.m.SearchField.extend("sap.ushell.renderers.fiori2.search.SearchBox", {

            metadata: {
                properties: {
                    dataSourceName: "string"
                },
                events: {
                    deletePill: {},
                    resetAll: {}
                }
            },

            renderer: "sap.m.SearchFieldRenderer",

            onAfterRendering: function () {

                // init
                var self = this;
                var element = $(this.getDomRef());

                // call base class
                sap.m.SearchField.prototype.onAfterRendering.apply(this, arguments);

                // add event for reset button
                element.find("#sfOverlay-reset").click(function () {
                    self.fireResetAll();
                });
                element.find("#sfOverlay-reset").on({"touchstart" : function () { 
                        self.fireResetAll();
                    }
                });

                element.find("#containerSf-reset").click(function () {
                    self.fireResetAll();
                });
                element.find("#containerSf-reset").on({"touchstart" : function () { 
                        self.fireResetAll();
                    }
                });

                // add css classed to form and input
                var form = element.find("form");
                form.addClass("sapUiUfdShellSearchBoxForm");
                var input = element.find("input");
                input.addClass("sapUiUfdShellSearchBox");

                // check datasource
                var dataSourceName = this.getDataSourceName();
                if (!dataSourceName || dataSourceName === "") {
                    return;
                }

                // add pill
                var pill = $('<span class="sapUshellDataSourcePill sapUshellSearchBoxPill"></span>');
                form.prepend(pill);
                pill.append('<span class="sapUiUfdShellSearchBoxPillDsName">'+dataSourceName+'</span>');
                var delButton = $('<span class="sapUiUfdShellSearchBoxPillDel"></span>');

                var bRtl = sap.ui.getCore().getConfiguration().getRTL();
                if (bRtl) {
                    pill.prepend(delButton);
                }else{
                    pill.append(delButton);
                }
                
                delButton.click(function () {
                    self.fireDeletePill();
                });
                delButton.on({"touchstart" : function () { 
                        self.fireDeletePill(); 
                    }
                });

            }

        });


}(window));