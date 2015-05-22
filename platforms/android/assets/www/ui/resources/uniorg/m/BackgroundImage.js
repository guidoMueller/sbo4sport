sap.ui.define(
    [
        "sap/m/Image"
    ],
    /**
     * @param {sap.ui.core.Control} BaseControl class
     */
    function ( Image ) {

        var BackgroundImage = Image.extend( "uniorg.m.BackgroundImage", {
            metadata: {
                properties: {
                    src:                {type: "sap.ui.core.URI", group: "Data", defaultValue: null},
                    width:              {type: "sap.ui.core.CSSSize", group: "Appearance", defaultValue: "3rem"},
                    height:             {type: "sap.ui.core.CSSSize", group: "Appearance", defaultValue: "3rem"},
                    // background-size: auto|length|cover|contain|initial|inherit;
                    backgroundSize:     {type: "string", group: "Misc", defaultValue: "cover"},
                    backgroundPosition: {type: "string", group: "Misc", defaultValue: "center"},
                    // background-repeat: repeat|repeat-x|repeat-y|no-repeat|initial|inherit;
                    backgroundRepeat:   {type: "string", group: "Misc", defaultValue: "no-repeat"}
                }
            },

            renderer: function ( oRm, oImage ) {
                oRm.write( "<div" );
                oRm.writeControlData( oImage );

                // Styles
                oRm.addStyle( "background-image", "url(" + oImage.getSrc() + ")" );
                oRm.addStyle( "background-position", oImage.getBackgroundPosition() );
                oRm.addStyle( "background-repeat", oImage.getBackgroundRepeat() );
                oRm.addStyle( "background-size", oImage.getBackgroundSize() );

                // Dimensions
                if ( oImage.getWidth() && oImage.getWidth() !== '' ) {
                    oRm.addStyle( "width", oImage.getWidth() );
                }
                if ( oImage.getHeight() && oImage.getHeight() !== '' ) {
                    oRm.addStyle( "height", oImage.getHeight() );
                }
                oRm.writeStyles(); // eof Styles

                // Classes
                oRm.addClass( "BackgroundImage" );
                oRm.writeClasses(); // eof Classes

                oRm.write( ">" );
                oRm.write( "</div>" );
            }

        } );

        return BackgroundImage;
    },
    /*bExport*/ true
);