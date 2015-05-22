// Copyright (c) 2013 SAP AG, All Rights Reserved
(function () {
    "use strict";
    /*global Tiles, document, jQuery, OData, sap */
    sap.ui.getCore().loadLibrary("sap.m");
    jQuery.sap.require("sap.ui.core.IconPool");
    jQuery.sap.require("sap.ushell.components.tiles.utils");

    sap.ui.controller("sap.ushell.components.tiles.action.ActionTile", {
        onInit: function () {
            var oView = this.getView(),
                oViewData = oView.getViewData(),
                oResourceModel = sap.ushell.components.tiles.utils.getResourceBundleModel(),
                oTileApi = oViewData.chip, // instance specific CHIP API
                sConfig = oTileApi.configuration.getParameterValueAsString('tileConfiguration'),
                oConfig = sap.ushell.components.tiles.utils.getActionConfiguration(sConfig,
                    oTileApi.configurationUi.isEnabled()),
                oModel,
                that = this;

            function formatDisplayText(sSemanticObject, sSemanticAction) {
                var oBundle = oResourceModel.getResourceBundle(),
                    sResult = oBundle.getText("configuration.semantic_object")+
                        ":\n" + sSemanticObject + "\n\n" +
                        oBundle.getText("configuration.semantic_action") + ":\n" +
                        sSemanticAction;
                return sResult;
            }

            oView.setModel(oResourceModel, "i18n");
            oModel = new sap.ui.model.json.JSONModel({
                config: oConfig,
                displayText: formatDisplayText(oConfig.semantic_object, oConfig.semantic_action)
            });
            oView.setModel(oModel);

            // implement configurationUi contract: setup configuration UI
            if (oTileApi.configurationUi.isEnabled()) {
                // attach configuration UI provider, which is essentially a components.tiles.action.Configuration
                oTileApi.configurationUi.setUiProvider(function () {
                    var oConfigurationUi = sap.ushell.components.tiles.utils.getConfigurationUi(that.getView(), "sap.ushell.components.tiles.action.Configuration");
                    oTileApi.configurationUi.attachCancel(this.onCancelConfiguration.bind(null, oConfigurationUi));
                    oTileApi.configurationUi.attachSave(this.onSaveConfiguration.bind(this, oConfigurationUi, formatDisplayText)); // mind the closure
                    return oConfigurationUi;
                }.bind(this));

                oView.byId("actionTile").setTooltip(
                    oResourceModel.getResourceBundle().getText("edit_configuration.tooltip")
                );
            }
        },

        onPress: function (oEvent) {
            // trigger to show the configuration UI if the tile is pressed in Admin mode
            var oTileApi = this.getView().getViewData().chip;
            if (oTileApi.configurationUi.isEnabled()) {
                oTileApi.configurationUi.display();
            }
        },


        // configuration save handler
        // The target mapping tile is enhanced with mapping_signature and supported form_factors properties.
        onSaveConfiguration: function (oConfigurationView, fnFormatDisplayText) {
            var
            // the deferred object required from the configurationUi contract
                oDeferred = jQuery.Deferred(),
                oModel = oConfigurationView.getModel(),
            // tile model placed into configuration model by getConfigurationUi
                oTileModel = oModel.getProperty("/tileModel"),
                oTileApi = oConfigurationView.getViewData().chip;

            //error handler
            function logErrorAndReject(oError) {
                jQuery.sap.log.warning(oError, null, "sap.ushell.components.tiles.action.ActionTile.controller");
                oDeferred.reject(oError);
            }

            //If the mandatory fields are missing, then through an error message requesting the user to enter those fields
            if(jQuery.trim(oModel.getProperty("/config/semantic_action"))=="" ||
                    (jQuery.trim(oModel.getProperty("/config/navigation_provider"))=="LPD" &&
                            (jQuery.trim(oModel.getProperty("/config/navigation_provider_role"))=="" ||
                                    jQuery.trim(oModel.getProperty("/config/navigation_provider_instance"))=="" ||
                                    (jQuery.trim(oModel.getProperty("/config/target_application_alias"))=="" && jQuery.trim(oModel.getProperty("/config/target_application_id"))==""))) ||
                                    (jQuery.trim(oModel.getProperty("/config/navigation_provider"))=="SAPUI5" &&
                                            (jQuery.trim(oModel.getProperty("/config/display_title_text"))=="" ||
                                                    jQuery.trim(oModel.getProperty("/config/url"))=="" ||
                                                    jQuery.trim(oModel.getProperty("/config/ui5_component"))=="")) ||
                                                    (jQuery.trim(oModel.getProperty("/config/desktopChecked"))=="" &&
                                                            jQuery.trim(oModel.getProperty("/config/phoneChecked"))=="" &&
                                                            jQuery.trim(oModel.getProperty("/config/tabletChecked")))) {
                var oSemActionInput = oConfigurationView.byId("semantic_actionInput"),
                    oTargetAppTitleInput = oConfigurationView.byId("target_application_descriptionInput"),
                    oTargetAppURLInput = oConfigurationView.byId("target_application_urlInput"),
                    oTargetAppCompInput = oConfigurationView.byId("target_application_componentInput"),
                    oNavProviderRoleInput = oConfigurationView.byId("navigation_provider_roleInput"),
                    oNavProviderInstanceInput = oConfigurationView.byId("navigation_provider_instanceInput"),
                    oTargetAppAliasInput = oConfigurationView.byId("target_application_aliasInput"),
                    oTargetAppIdInput = oConfigurationView.byId("target_application_idInput"),
                    oFormFactorDesktopInput = oConfigurationView.byId("desktopCB"),
                    oFormFactorTabletInput = oConfigurationView.byId("tabletCB"),
                    oFormFactorPhoneInput = oConfigurationView.byId("phoneCB");

                if (oSemActionInput.getValue()=="") {
                    oSemActionInput.setValueState(sap.ui.core.ValueState.Error);
                }
                if (jQuery.trim(oModel.getProperty("/config/navigation_provider"))=="SAPUI5" && oTargetAppTitleInput.getValue()=="") {
                    oTargetAppTitleInput.setValueState(sap.ui.core.ValueState.Error);
                }
                if (jQuery.trim(oModel.getProperty("/config/navigation_provider"))=="SAPUI5" && oTargetAppURLInput.getValue()=="") {
                    oTargetAppURLInput.setValueState(sap.ui.core.ValueState.Error);
                }
                if (jQuery.trim(oModel.getProperty("/config/navigation_provider"))=="SAPUI5" && oTargetAppCompInput.getValue()=="") {
                    oTargetAppCompInput.setValueState(sap.ui.core.ValueState.Error);
                }
                if (jQuery.trim(oModel.getProperty("/config/navigation_provider"))=="LPD" && oNavProviderRoleInput.getValue()=="") {
                    oNavProviderRoleInput.setValueState(sap.ui.core.ValueState.Error);
                }
                if (jQuery.trim(oModel.getProperty("/config/navigation_provider"))=="LPD" && oNavProviderInstanceInput.getValue()=="") {
                    oNavProviderInstanceInput.setValueState(sap.ui.core.ValueState.Error);
                }
                if (jQuery.trim(oModel.getProperty("/config/navigation_provider"))=="LPD" && oTargetAppAliasInput.getValue()=="" && oTargetAppIdInput.getValue()=="") {
                    oTargetAppAliasInput.setValueState(sap.ui.core.ValueState.Error);
                    oTargetAppIdInput.setValueState(sap.ui.core.ValueState.Error);
                }
                if (jQuery.trim(oModel.getProperty("/config/desktopChecked"))=="" &&
                        jQuery.trim(oModel.getProperty("/config/phoneChecked"))=="" &&
                        jQuery.trim(oModel.getProperty("/config/tabletChecked"))) {
                    oFormFactorDesktopInput.setValueState(sap.ui.core.ValueState.Error);
                    oFormFactorTabletInput.setValueState(sap.ui.core.ValueState.Error);
                    oFormFactorPhoneInput.setValueState(sap.ui.core.ValueState.Error);
                }
                oDeferred.reject("mandatory_fields_missing");
                return oDeferred.promise();
            }

            //Before saving the model data, check if Mapping signature table contains duplicate parameter names
            //in this case the save will fail and all the data will be lost as this is the designer behavior.
            if(sap.ushell.components.tiles.utils.tableHasDuplicateParameterNames(oModel.getProperty("/config/rows"))){
                var oBundle = sap.ushell.components.tiles.utils.getResourceBundleModel().getResourceBundle();
                oDeferred.reject(oBundle.getText("configuration.signature.uniqueParamMessage.text"));
            }
            else{   //only if the data is valid proceed with the save operation

                // Decide according to special flag if the setting in form factor are default
                // if so , the configuration should not be saved - this is crucial for the backend checks
                var oFormFactor = oModel.getProperty("/config/formFactorConfigDefault") ? undefined : sap.ushell.components.tiles.utils.buildFormFactorsObject(oModel);
                var sMappingSignature = sap.ushell.components.tiles.utils.getMappingSignatureString(oModel.getProperty("/config/rows"), oModel.getProperty("/config/isUnknownAllowed"));
                // get the configuration to save from the model
                var configToSave = {
                        semantic_object: jQuery.trim(oModel.getProperty("/config/semantic_object")) || "",
                        semantic_action: jQuery.trim(oModel.getProperty("/config/semantic_action")) || "",
                        //navigation_provider: "LPD", // set fixed to launchpad
                        //Modified for new LPD_CUST implementation
                        display_title_text : jQuery.trim(oModel.getProperty("/config/display_title_text")) || "",
                        url: jQuery.trim(oModel.getProperty("/config/url")) || "",
                        ui5_component: jQuery.trim(oModel.getProperty("/config/ui5_component")) || "",
                        navigation_provider: jQuery.trim(oModel.getProperty("/config/navigation_provider")),
                        navigation_provider_role: jQuery.trim(oModel.getProperty("/config/navigation_provider_role")) || "",
                        navigation_provider_instance: jQuery.trim(oModel.getProperty("/config/navigation_provider_instance")) || "",
                        target_application_id: jQuery.trim(oModel.getProperty("/config/target_application_id")) || "",
                        target_application_alias: jQuery.trim(oModel.getProperty("/config/target_application_alias")) || "",
                        display_info_text: jQuery.trim(oModel.getProperty("/config/display_info_text")),
                        form_factors: oFormFactor,     //retrieve a structure describing form factor's mode (from application or admin selection) + form factors values.
                        mapping_signature: sMappingSignature
                };
                // use bag in order to store translatable properties
                var tilePropertiesBag = oTileApi.bag.getBag('tileProperties');
                tilePropertiesBag.setText('display_title_text', configToSave.display_title_text);
                
                // use configuration contract to write parameter values
                oTileApi.writeConfiguration.setParameterValues({tileConfiguration: JSON.stringify(configToSave)},
                    // success handler
                    function () {
                        var sConfig = oTileApi.configuration.getParameterValueAsString('tileConfiguration'),
                            oConfigurationConfig = sap.ushell.components.tiles.utils.getActionConfiguration(sConfig, false),
                            oTileConfig = sap.ushell.components.tiles.utils.getActionConfiguration(sConfig, true);
                        // switching the model under the tile -> keep the tile model
                        oModel = new sap.ui.model.json.JSONModel({config: oConfigurationConfig, tileModel: oTileModel});
                        oConfigurationView.setModel(oModel);
                        // update model (no merge)
                        oTileModel.setData({config: oTileConfig, displayText: fnFormatDisplayText(oTileConfig.semantic_object, oTileConfig.semantic_action)}, false);
                        //Added for new LPD_CUST implementation
                        tilePropertiesBag.save(
                                // success handler
                                function () {
                                    jQuery.sap.log.debug("property bag 'tileProperties' saved successfully");
                                    // update possibly changed values via contracts
                                    if (oTileApi.title) {
                                        oTileApi.title.setTitle(
                                                configToSave.display_title_text,
                                                // success handler
                                                function () {
                                                    oDeferred.resolve();
                                                },
                                                logErrorAndReject //error handler
                                        );
                                    } else {
                                        oDeferred.resolve();
                                    }
                                },
                                logErrorAndReject //error handler
                        );
                    },
                    logErrorAndReject //error handler
                );
            }
            return oDeferred.promise();
        },

        // configuration cancel handler
        onCancelConfiguration: function (oConfigurationView) {
            // re-load old configuration and display
            var oViewData = oConfigurationView.getViewData(),
                oModel = oConfigurationView.getModel(),
            // tile model placed into configuration model by getConfigurationUi
                oTileModel = oModel.getProperty("/tileModel"),
                oTileApi = oViewData.chip,
                oCurrentConfig = sap.ushell.components.tiles.utils.getActionConfiguration(
                    oTileApi.configuration.getParameterValueAsString('tileConfiguration'),
                    false
                );
            oConfigurationView.getModel().setData({config: oCurrentConfig, tileModel: oTileModel}, false);
        }
    });
}());