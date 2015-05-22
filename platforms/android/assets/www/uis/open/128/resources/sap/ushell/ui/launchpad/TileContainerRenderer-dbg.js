// Copyright (c) 2013 SAP AG, All Rights Reserved
/*global jQuery, sap*/

(function () {
    "use strict";
    jQuery.sap.require("sap.ushell.resources");
    jQuery.sap.declare("sap.ushell.ui.launchpad.TileContainerRenderer");

    /**
     * @class TileContainer renderer.
     * @static
     *
     * @private
     */
    sap.ushell.ui.launchpad.TileContainerRenderer = {};

    /**
     * Renders the HTML for the given control, using the provided
     * {@link sap.ui.core.RenderManager}.
     *
     * @param {sap.ui.core.RenderManager}
     *            oRm the RenderManager that can be used for writing to the render
     *            output buffer
     * @param {sap.ui.core.Control}
     *            oControl an object representation of the control that should be
     *            rendered
     */
    sap.ushell.ui.launchpad.TileContainerRenderer.render = function (oRm, oControl) {
        var aTiles = oControl.getTiles(),
            aFootItems = oControl.getFooterContent() || [],
            bHideTileContainer = (oControl.getDefaultGroup() && aTiles.length === 0) || !oControl.getVisible(),
            bVisibleTileExists = false;

        oRm.write("<div");
        oRm.writeControlData(oControl);

        oRm.addClass("sapUshellTileContainer");
        oRm.writeAttribute("tabindex", "0");
        oRm.writeClasses();

        if (bHideTileContainer) {
            oRm.addStyle("display", "none");
            oRm.writeStyles();
        }

        oRm.write(">");

        // PositionAnchor that if we scroll to this container, it will be under
        // UnifiedShell
        oRm.write("<a");
        oRm.addClass("sapUshellContainerPositionAnchor");
        oRm.writeClasses();
        oRm.writeAttribute("name", oControl.getId() + "-position");
        oRm.write("></a>");

        if (oControl.getShowHeader()) {
            // Title
            oRm.write("<");
            oRm.write(oControl.getHeaderLevel().toLowerCase());
            oRm.addClass('sapUshellContainerTitle');
            oRm.addClass("sapUiStrongBackgroundTextColor");
            oRm.writeClasses();
            oRm.write(">");
            oRm.writeEscaped(oControl.getHeaderText());
            oRm.write("</");
            oRm.write(oControl.getHeaderLevel().toLowerCase());
            oRm.write(">");

            // Title END
        }

        oRm.write("<div");
        oRm.addClass('sapUshellTilesContainer-sortable');
        oRm.addClass('sapUshellInner');
        oRm.writeClasses();
        oRm.write(">");

        // Tiles rendering, and checking if there is at lest one visible Tile
        jQuery.each(aTiles, function (index, tile) {
            if (tile.getVisible()) {
                bVisibleTileExists = true;
            }
            if (this.getVisible) {
                oRm.renderControl(this);
            }
        });

        // If no tiles in group or default group
        if (oControl.getShowPlaceholder() && aTiles.length === 0 && !bHideTileContainer) {
            oRm.renderControl(oControl.oPlusTile);
        }

        // hook method to render no data
        if (oControl.getShowNoData()) {
            this.renderNoData(oRm, oControl, !aTiles.length || !bVisibleTileExists);
        }

        oRm.write("</div>");
        // Tiles END

        // Footer
        if (aFootItems.length > 0) {
            oRm.write("<footer");
            oRm.addClass('sapUshellTilesContainerFtr');
            oRm.writeClasses();
            oRm.write(">");
            jQuery.each(aFootItems, function () {
                oRm.renderControl(this);
            });
            oRm.write("</footer>");
        }
        oRm.write("</div>");
    };

    // Rendering a message in case no Tiles are visible after applying the user filter
    sap.ushell.ui.launchpad.TileContainerRenderer.renderNoData = function (oRm, oControl, displayData) {
        oRm.write("<div id='" + oControl.getId() + "-listNoData' class='sapUshellNoFilteredItems sapUiStrongBackgroundTextColor'>");
        if (displayData) {
            if (oControl.getNoDataText()) {
                oRm.writeEscaped(oControl.getNoDataText());
            } else {
                oRm.writeEscaped(oControl.getNoDataText(sap.ushell.resources.i18n.getText("noFilteredItems")));
            }
        } else {
            oRm.writeEscaped("");
        }
        oRm.write("</div>");
    };

}());
