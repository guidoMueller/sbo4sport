sap.ui.jsview("enterFioriConfiguration", {

    getControllerName: function() {
        return null;
    },

    /**
     * 
     * @param oController may be null
     * @returns {sap.ui.cre.Control}
     */
    createContent: function(oController) {
            var jsView = this;
            var data = window.iab.context;
            if (data.fioriConfiguration == null) {
                data.fioriConfiguration = "";
            }

            // create JSON model instance
            var oModel = new sap.ui.model.json.JSONModel();
            // set the data for the model
            oModel.setData(data);
            // set the model to the core
            sap.ui.getCore().setModel(oModel);

            // This function calculates how wide the vbox containing all the controls should be.
            var calculateDisplayWidth = function(totalWidth) {
                var displayWidth = 0;
                if (totalWidth <= 360) {
                    displayWidth = totalWidth*0.9;
                } else {
                    // On a wide screen, use a little more space
                    displayWidth = 324 + ((totalWidth - 360)*0.1);
                }
                return Math.round(displayWidth);
            }

            var vbox = new sap.m.VBox('EnterFioriConfiguration');

            var inputConfiguration = new sap.m.Input( 'configuration_input', {
                value:"{/fioriConfiguration}",
                placeholder:"Enter Fiori URL or Work Email",
                liveChange:function(){
                    inputConfiguration.setValueState(sap.ui.core.ValueState.None);
                    valueStateErrorControl = null;
                }
            });
            var valueStateErrorControl = null;
            if (data.valueStateText != null) {
                inputConfiguration.setValueStateText(data.valueStateText);
                inputConfiguration.setValueState(sap.ui.core.ValueState.Error);
                valueStateErrorControl = inputConfiguration;
            }
            
            var helpText = new sap.m.Text( 'configuration_text', {
                text:"Enter the Fiori URL or your Work Email address, as indicated in the instructions from your IT Administrator."
            });
            var panel = new sap.m.Panel( 'configuration_text_panel', {
                content: [helpText]
            });

            var buttonOKPress = function() {
                buttonOK.setEnabled(false);
		
                if (inputConfiguration.getValue()) {
                    inputConfiguration.setValue(inputConfiguration.getValue().trim());
                }

                setTimeout(function(){
                    // fix bcp issue: error message shows up and then disappear in ios by moving validation to here
                    // we would need to refactor or clean up later
                    function isEmail(emailAddress) {
                         if (typeof(emailAddress) !== 'string') {
                             return false;
                         }
                         var regexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/;
                         var result = regexp.test(emailAddress);
                         console.log("check email format: " + result);
                         return result;
                    };
                    function isUrl(url) {
                         if (typeof(url) !== 'string') {
                             return false;
                         }
                         var regexp = /^(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/i;
                         var result = regexp.test(url);
                         console.log("check URL format: " + result);
                         return result;
                   };
                    if (!(isUrl(inputConfiguration.getValue()) || isEmail(inputConfiguration.getValue()))) {
                         inputConfiguration.setValueStateText("Invalid Fiori URL. Please enter the SAP Fiori configuration again");
                         inputConfiguration.setValueState(sap.ui.core.ValueState.Error);
                         inputConfiguration.focus();
                         buttonOK.setEnabled(true);
                         return ;
                    }
                    data.fioriConfiguration = inputConfiguration.getValue();
                    window.iab.triggerEvent("SUBMIT", JSON.stringify(data));
                    buttonOK.setEnabled(true);
                }, 500);
            }
            var buttonOK = new sap.m.Button( 'button_ok', {
                type:sap.m.ButtonType.Emphasized,
                text:"OK",
                width:"100%",
                press : buttonOKPress
            });

            var vboxPlaceholder1 = new sap.m.HBox( 'vbox_placeholder1', {
                height:"75px"
            });

            var vboxPlaceholder2 = new sap.m.HBox( 'vbox_placeholder2', {
                height:"25px"
            });

            var vboxPlaceholder3 = new sap.m.HBox( 'vbox_placeholder3', {
                height:"25px"
            });

            vbox.addItem(vboxPlaceholder1);
            vbox.addItem(inputConfiguration);
            vbox.addItem(vboxPlaceholder2);
            vbox.addItem(panel);
            vbox.addItem(vboxPlaceholder3);
            vbox.addItem(buttonOK);

            vboxPageContent = new sap.m.VBox('vbox_content', {
                alignItems:sap.m.FlexAlignItems.Center,
                justifyContent:sap.m.FlexJustifyContent.Start,
                items:[vbox]
            });

            var sapLogo = new sap.m.Image( 'sap_logo', {
                src:"img/sapLogo.png",
                height:"40px"
            });

            var copyright = new sap.m.Text( 'copyright', {
                text:"Copyright \u00A9 2015 SAP SE. All rights reserved."
            });

            var footerHBox = new sap.m.HBox('panel_hbox', {
                justifyContent:sap.m.FlexJustifyContent.SpaceBetween,
                alignItems:sap.m.FlexAlignItems.Start,
                width: "90%",
                items: [sapLogo, copyright]
            });

            vboxOuter = new sap.m.FlexBox('vbox_outer', {
                direction:sap.m.FlexDirection.Column,
                justifyContent:sap.m.FlexJustifyContent.SpaceBetween,
                alignItems:sap.m.FlexAlignItems.Center,
                items:[vboxPageContent, footerHBox],
                fitContainer: true
            });

            // If the screen width is available, pre-calculate how wide the vbox should be
            // so that the user can't see it draw as the wrong size then quickly redraw as
            // the correct size.
            if ($(window).width()) {
                vbox.setWidth(calculateDisplayWidth($(window).width()) + "px");
                copyright.setWidth(Math.round($(window).width()/2) + "px");
            }

            sap.ui.core.ResizeHandler.register(vboxOuter, function(e){
                vbox.setWidth(calculateDisplayWidth(e.size.width) + "px");
                copyright.setWidth(Math.round(e.size.width/2) + "px");
                var domRef = jsView.getDomRef();
                if( $(window).height() && $(window).height() > domRef.offsetHeight) {
                    // The view is not taking up the whole screen height, force it.
                    jsView.setHeight($(window).height() + "px");
                }
            });

            vboxPageContent.onAfterRendering = function() {
                var inputs = this.$().find(':input');
                inputs.attr('autocapitalize', 'off');
                inputs.attr('autocorrect', 'off');
                inputs.attr('autocomplete', 'off');
                if (valueStateErrorControl != null) {
                    // Do the work in a setTimeout because otherwise the focus gets stolen
                    // away (and if the focus is not on the input control then the value
                    // state text is not visible).
                    setTimeout(function(){
                        valueStateErrorControl.focus();
                    },400);
                }
                sap.m.FlexBox.prototype.onAfterRendering.apply(this, arguments);
  
            }
            window.iab.page.setShowHeader(false);
            window.iab.heightWithoutKeyboard = null;
            this.onAfterRendering = function() {
                var domRef = this.getDomRef();
                if( $(window).height() && $(window).height() > domRef.offsetHeight) {
                    // The view is not taking up the whole screen height, force it.
                    this.setHeight($(window).height() + "px");
                    window.iab.heightWithoutKeyboard = $(window).height();
                }
            }
			
			window.onkeyup = function(e) {
			    var key = e.keyCode ? e.keyCode : e.which;

			     if (key == 13) {
					 // GO button pressed on Android keyboard
			         buttonOKPress();
			     }
			}
			
            return vboxOuter;
    }
});
