// Copyright (c) 2013 SAP AG, All Rights Reserved
(function () {
    "use strict";
    /*global Tiles, jQuery, sap */

    jQuery.sap.require("sap.ushell.components.tiles.utils");
    sap.ui.controller("sap.ushell.components.tiles.applauncher.Configuration", {

        // checks given inputs
        onConfigurationInputChange: function (oControlEvent) {
        	sap.ushell.components.tiles.utils.checkInput(this.getView(), oControlEvent);
        },
        // default semantic objects for static applauncher: blank
        aDefaultObjects : [{obj: "", name: ""}],
        onInit: function () {
            var oView = this.getView(),
                oTargetUrl = oView.byId("targetUrl"),
                oSemanticObjectSelector = oView.byId("navigation_semantic_objectInput"),
                oResourceModel = sap.ushell.components.tiles.utils.getResourceBundleModel();

            oView.setModel(oResourceModel, "i18n");
            // set view name for identification in utils
            oView.setViewName("sap.ushell.components.tiles.applauncher.Configuration");
            sap.ushell.components.tiles.utils.createSemanticObjectModel(this, oSemanticObjectSelector, this.aDefaultObjects);

            // make sure that the chose object is written back to the configuration
            oSemanticObjectSelector.attachChange(function (oControlEvent) {
                var sValue = oControlEvent.getSource().getValue();
                oView.getModel().setProperty("/config/navigation_semantic_object", sValue);
            });
            // toggle editable property of targetURL input field depending on navigation_use_semantic_object
            function targetUrlVisibilityFormatter(bUseLaunchpad) {
                return !bUseLaunchpad;
            }
            oTargetUrl.bindProperty("enabled", {
                formatter: targetUrlVisibilityFormatter,
                path: "/config/navigation_use_semantic_object"
            });
        },

        onAfterRendering: function(){

        	sap.ushell.components.tiles.utils.updateTooltipForDisabledProperties(this.getView());
        },

        // forward semantic object value helper request to utils
        onValueHelpRequest : function (oEvent) {
        	sap.ushell.components.tiles.utils.objectSelectOnValueHelpRequest(this, oEvent);
        },
        // change handler for check box
        onCheckBoxChange : function (oEvent) {
            var oView = this.getView(),
                oSemanticObjectSelector = oView.byId("navigation_semantic_objectInput"),
                oModel = oSemanticObjectSelector.getModel(),
                value = oEvent.getSource().getSelected();
            oModel.setProperty("/enabled", value);
        },
        // forward icon value help request to utils
        onIconValueHelpRequest : function (oEvent) {
        	sap.ushell.components.tiles.utils.iconSelectOnValueHelpRequest(this, oEvent);
        },
        // forward icon close request to utils
        onSelectIconClose: function () {
        	sap.ushell.components.tiles.utils.onSelectIconClose(this.getView());
        },
        // forward icon ok to utils
        onSelectIconOk: function () {
        	sap.ushell.components.tiles.utils.onSelectIconOk(this.getView());
        }
    });
}());