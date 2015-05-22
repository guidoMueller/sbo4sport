sap.ui.jsview("enterSSOPasscode", {

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
            if (data.ssoPasscode == null) {
                data.ssoPasscode = "";
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

            var vbox = new sap.m.VBox('EnterSSOPasscodeScreen');

            var inputSSOPassword = new sap.m.Input( 'Password_item', {
                    type:sap.m.InputType.Password,
                    value:"{/ssoPasscode}",
                    placeholder:"Enter SSO Passcode",
                    liveChange:function() {
                        inputSSOPassword.setValueState(sap.ui.core.ValueState.None);
                        valueStateErrorControl = null;
                    }
            });
            var valueStateErrorControl = null;
            if (data.valueStateText != null) {
                inputSSOPassword.setValueStateText(data.valueStateText);
                inputSSOPassword.setValueState(sap.ui.core.ValueState.Error);
                valueStateErrorControl = inputSSOPassword;
            }

            var buttonOK = new sap.m.Button( 'button_ok', {
                type:sap.m.ButtonType.Emphasized,
                text:"OK",
                width:"100%",
                press : function(){
                    data.ssoPasscode = inputSSOPassword.getValue();
                    window.iab.triggerEvent("SUBMIT", JSON.stringify(data));
                }
            });

            var dialogForgotSSOPasscode = new sap.m.Dialog('forgot_sso_passcode',{
                title:'Forgot SSO Passcode'
            });
            var lButton = new sap.m.Button('lButton_ok_forgot_soo', {
                text:"OK",
                press:function(){
                    console.log("Forgot SSO passcode.");
                    //window.iab.triggerEvent("FORGOT", JSON.stringify(data));
                    dialogForgotSSOPasscode.close();
                }
            });
            dialogForgotSSOPasscode.addButton(lButton);
            var forgotSSOPasscodeText = new sap.m.Text('forgot_sso_passcode_text',{
                text:"Please reset SSO passcode in the Client Hub and restart the app."
            });
            dialogForgotSSOPasscode.addContent(forgotSSOPasscodeText);

            var buttonForgotSSOPasscode = new sap.m.Button( 'button_forgotSSOPasscode', {
                text:"Forgot SSO Passcode",
                width:"100%",
                press : function(){
                    dialogForgotSSOPasscode.open();
                }
            });

            var dialogSkipSSOPasscode = new sap.m.Dialog('skip_sso_passcode',{
                title:'Skip SSO Passcode'
            });
            var lButton = new sap.m.Button('lButton_ok_skip_sso', {
                text:"OK",
                press:function(){
                    console.log("skip SSO passcode.");
                    window.iab.triggerEvent("SKIP", JSON.stringify(data));
                    dialogSkipSSOPasscode.close();
                }
            });
            var rButton = new sap.m.Button('rButton_cancel_skip', {
                text:"Cancel",
                press:function(){dialogSkipSSOPasscode.close();}
            });
            dialogSkipSSOPasscode.addButton(lButton);
            dialogSkipSSOPasscode.addButton(rButton);
            var skipSSOPasscodeText = new sap.m.Text('skip_sso_passcode_text',{
                text:"Skip SSO Entry will detach this app from Client Hub."
            });
            dialogSkipSSOPasscode.addContent(skipSSOPasscodeText);

            var buttonSkipSSOPasscode = new sap.m.Button( 'button_skip', {
                text:"Skip",
                width:"100%",
                press:function() {
                    dialogSkipSSOPasscode.open();
                }
            });

            var vboxPlaceholder1 = new sap.m.HBox( 'vbox_placeholder1', {
                height:"75px"
            });

            var vboxPlaceholder2 = new sap.m.HBox( 'vbox_placeholder2', {
                height:"25px"
            });

            vbox.addItem(vboxPlaceholder1);
            vbox.addItem(inputSSOPassword);
            vbox.addItem(vboxPlaceholder2);
            vbox.addItem(buttonOK);
            vbox.addItem(buttonForgotSSOPasscode);
            vbox.addItem(buttonSkipSSOPasscode);

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

            vboxOuter.onAfterRendering = function() {
                var inputs = this.$().find(':input');
                inputs.attr('autocapitalize', 'off');
                inputs.attr('autocorrect', 'off');
                inputs.attr('autocomplete', 'off');
                if (valueStateErrorControl != null) {
                    valueStateErrorControl.focus();
                } else {
                    inputSSOPassword.focus();
                }
                sap.m.FlexBox.prototype.onAfterRendering.apply(this, arguments);
            }
            window.iab.page.setShowHeader(false);
            this.onAfterRendering = function() {
                var domRef = this.getDomRef();
                var newHeight = $(window).height();
                if (window.iab.heightWithoutKeyboard != null) {
                    // If we know the height of the screen without the keyboard, use that
                    // (since the keyboard will affect $(window).height()).
                    newHeight = window.iab.heightWithoutKeyboard;
                }
                if( newHeight && newHeight > domRef.offsetHeight) {
                    // The view is not taking up the whole screen height, force it.
                    this.setHeight(newHeight + "px");
                }
            }

            return vboxOuter;
    }
});