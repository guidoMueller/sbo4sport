sap.ui.define(
    //[ "sap/ui/core/Core", "3rd/isotope/isotope.min" ],
    ["sap/ui/core/Core"],
    function () {

        var oLibraryInfo = {
            name:     "uniorg.m",
            version:  "0.3",
            controls: [
                "uniorg.m.DdicText",
                "uniorg.m.BackgroundImage",
                "uniorg.m.BoolText",
                "uniorg.m.cards.CardContainer",
                "uniorg.m.cards.BaseCardItem"
            ]
        };
        sap.ui.getCore().initLibrary( oLibraryInfo );

        // lazy imports
        for ( var i = 0; i < oLibraryInfo.controls.length; i++ ) {
            var sName = oLibraryInfo.controls[i];
            sap.ui.lazyRequire( sName, "new extend getMetadata" );
        }
    } );