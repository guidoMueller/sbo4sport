sap.ui.define(
    ["sap/ui/core/Core"],
    /**
     * Library for using reveal.js in {sap,open}ui5
     *
     * @param {sap.ui.core.Core} Core
     */
    function () {
        "use strict";

        sap.ui.getCore().initLibrary( {
            name:         "uniorg.ui.viewer.reveal",
            dependencies: ["sap.ui.core"],
            controls:     [
                "uniorg.ui.viewer.reveal.Reveal"
            ],
            version:      "0.2.0"
        } );

        var sModulePath = jQuery.sap.getModulePath( "uniorg.ui.viewer.reveal" );
        jQuery.sap.includeStyleSheet( sModulePath + "/css/reveal.css" );
    }
);
