// Copyright (c) 2013 SAP AG, All Rights Reserved
/*global jQuery, sap*/

(function () {
    "use strict";
    jQuery.sap.declare("sap.ushell.ui.tile.DynamicTileRenderer");
    jQuery.sap.require("sap.ushell.ui.tile.TileBaseRenderer");
    jQuery.sap.require("sap.ushell.ui.tile.State");
    jQuery.sap.require("sap.ui.core.format.NumberFormat");

    /**
     * @name sap.ushell.ui.tile.DynamicTileRenderer.
     * @static
     * @private
     */
    sap.ushell.ui.tile.DynamicTileRenderer = sap.ui.core.Renderer.extend(sap.ushell.ui.tile.TileBaseRenderer);
    var translationBundle = sap.ushell.resources.i18n;

    /**
     * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
     *
     * @param {sap.ui.core.RenderManager} oRm the RenderManager that can be used for writing to the render output buffer
     * @param {sap.ui.core.Control} oControl an object representation of the control that should be rendered
     */
    sap.ushell.ui.tile.DynamicTileRenderer.renderPart = function (oRm, oControl) {
        // write the HTML into the render manager
        oRm.write("<div");
        oRm.addClass("sapUshellDynamicTile");
        oRm.writeClasses();
        oRm.write(">");

        // dynamic data
        oRm.write("<div");
        oRm.addClass("sapUshellDynamicTileData");
        oRm.addClass((oControl.getNumberState() ? "sapUshellDynamicTileData" + oControl.getNumberState() :
                                                  "sapUshellDynamicTileData" + sap.ushell.ui.tile.State.Neutral));
        oRm.writeClasses();
        oRm.write(">");

        //sapUshellDynamicTileIndication that includes Arrow and number factor
        oRm.write("<div class='sapUshellDynamicTileIndication'>");

        // state arrow

            if (oControl.getStateArrow()) {
                oRm.write("<div");
                oRm.addClass("sapUshellDynamicTileStateArrow");
                oRm.addClass("sapUshellDynamicTileData" + oControl.getStateArrow());
                oRm.writeClasses();
                oRm.write(">");
                oRm.write("</div>");
            }

            // unit
        oRm.write('<br><div'); //br was added in order to solve the issue of all the combination of presentation options between Number - Arrow - Unit
        oRm.addClass("sapUshellDynamicTileNumberFactor");
        oRm.writeClasses();
        oRm.writeAccessibilityState(oControl, {label : translationBundle.getText("TileUnits_lable") + oControl.getNumberFactor()});
        oRm.write('>');
        oRm.writeEscaped(oControl.getNumberFactor());
        oRm.write('</div>');

        // closeing the sapUshellDynamicTileIndication scope
        oRm.write("</div>");
        //}

        // number
        var numValue = oControl.getNumberValue(),
            number;

        if (typeof numValue === "string" && isNaN(parseFloat(numValue))) {
            number = numValue;
        } else {
            var oNForm = sap.ui.core.format.NumberFormat.getFloatInstance({maxFractionDigits: oControl.getNumberDigits()});
            number = oNForm.format(oControl.getNumberValue());
        }

        oRm.write('<div');
        oRm.addClass("sapUshellDynamicTileNumber");
        oRm.writeClasses();
        if (number && number !== "") {
            oRm.writeAccessibilityState(oControl, {
                label : translationBundle.getText("TileValue_lable") + number
            });
            oRm.write('>');
            oRm.writeEscaped(number);
        } else {
            // in case numberValue is a String
            oRm.write('>');
            oRm.writeEscaped(oControl.getNumberValue());
        }
        oRm.write('</div>');

        // end of dynamic data
        oRm.write("</div>");

        // span element
        oRm.write("</div>");
    };


    sap.ushell.ui.tile.DynamicTileRenderer.getInfoPrefix = function (oControl) {
        return oControl.getNumberUnit();
    };
}());
