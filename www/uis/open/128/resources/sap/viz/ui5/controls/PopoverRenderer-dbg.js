/*
 * Copyright (C) 2009-2013 SAP BOBJ or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("sap.viz.ui5.controls.PopoverRenderer");

/**
 * @class Chart Popover Renderer.
 * @static
 */
sap.viz.ui5.controls.PopoverRenderer = {

    /**
     * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
     *
     * @param {sap.ui.core.RenderManager} oRm the RenderManager that can be used for writing to the render output buffer
     * @param {sap.ui.core.Control} oControl an object representation of the control that should be rendered
     */
    render: function (oRm, oControl) {
        oRm.write("<div");
        oRm.writeControlData(oControl);
        oRm.writeClasses();
        oRm.writeStyles();
        oRm.write('>');      
        oRm.write('</div>');
    }
};
