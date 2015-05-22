sap.ui.define(
    ["sap/ui/core/Renderer"],
    function ( BaseRenderer ) {

        // extend the base renderer so we get the extend function.
        var Renderer = BaseRenderer.extend( BaseRenderer );

        /**
         * renders the whole control
         *
         * @param {sap.ui.core.RenderManager}    oRm      Rendermanager
         * @param {uniorg.m.cards.BaseCardItem} oControl Card
         * @returns {void}
         */
        Renderer.render = function render( oRm, oControl ) {
            this.renderOpenTag( oRm, oControl );
            this.renderHeader( oRm, oControl );
            this.renderContent( oRm, oControl );
            this.renderActions( oRm, oControl );
            this.renderCloseTag( oRm, oControl );
        };

        /**
         * @param {sap.ui.core.RenderManager}   oRm      Rendermanager
         * @param {uniorg.m.cards.BaseCardItem} oControl Card
         * @returns {void}
         */
        Renderer.renderHeader = function renderHeader( oRm, oControl ) {
            oRm.write( "<div" );
            if ( oControl.getBackgroundSrc() ) {
                oRm.addStyle( "background-image", "url('" + oControl.getBackgroundSrc() + "')" );
            }
            if ( oControl.getHeaderHeight() ) {
                oRm.addStyle( "height", oControl.getHeaderHeight() );
            }
            oRm.writeStyles();
            oRm.addClass( "uoMCardsCard_Header" );
            if ( oControl.getHasDarkBackground() ) {
                oRm.addClass( "uoMCardCard_Header_Dark" );
            }
            oRm.writeClasses();
            oRm.write( ">" );

            // the spacer is used so a header with a tall height still got its  content (title, subhead, icon) on the bottom
            oRm.write( "<div class='uoMCardsCard_Header_Spacer'></div>" );

            oRm.write( "<div class='uoMCardsCard_Header_Content'>" );
            // if there is a an icon, render it
            if ( oControl.getIcon() ) {
                oRm.write( "<div class='uoMCardsCard_Header_Icon'>" );
                oRm.renderControl( oControl.getIconImage() );
                oRm.write( "</div>" );
            }

            // if there is a title, render the title and its subtitle
            if ( oControl.getTitle() ) {
                oRm.write( "<div class='uoMCardsCard_Header_Text'>" );
                oRm.write( "<strong>" + oControl.getTitle() + "</strong>" );
                if ( oControl.getSubhead() ) {
                    oRm.write( "<br /><em>" + oControl.getSubhead() + "</em>" );
                }
                oRm.write( "</div>" );
            }
            oRm.write( "</div>" );

            oRm.write( "</div>" );
        };

        /**
         * @param {sap.ui.core.RenderManager}   oRm      Rendermanager
         * @param {uniorg.m.cards.BaseCardItem} oControl Card
         * @returns {void}
         */
        Renderer.renderContent = function renderContent( oRm, oControl ) {
            var aControls = oControl.getContent();
            if ( !aControls || aControls.length === 0 ) {
                return;
            }
            oRm.write( "<div class='uoMCardsCard_Content'>" );
            oControl.getContent().forEach( function ( oContent ) {
                oRm.renderControl( oContent );
            } );
            oRm.write( "</div>" );
        };

        /**
         * @param {sap.ui.core.RenderManager}   oRm      Rendermanager
         * @param {uniorg.m.cards.BaseCardItem} oControl Card
         * @returns {void}
         */
        Renderer.renderActions = function renderActions( oRm, oControl ) {
            var aControls = oControl.getActions();
            if ( !aControls || aControls.length === 0 ) {
                return;
            }
            oRm.write( "<div class='uoMCardsCard_Actions'>" );
            for ( var i = 0; i < aControls.length; i++ ) {
                oRm.renderControl( aControls[i] );
            }
            oRm.write( "</div>" );
        };

        /**
         * renders the opening <div> tag with classes, styling and attributes
         *
         * @param {sap.ui.core.RenderManager}   oRm      Rendermanager
         * @param {uniorg.m.cards.BaseCardItem} oControl Card
         * @returns {void}
         */
        Renderer.renderOpenTag = function renderOpenTag( oRm, oControl ) {
            oRm.write( "<div" );
            oRm.writeControlData( oControl );
            oRm.addClass( "uoMCardsCard" );
            oRm.addClass( "uoMCardsBaseCard" );
            oRm.writeClasses();
            oRm.writeStyles();
            oRm.writeAttribute( "tabindex", "-1" );
            oRm.write( ">" );
        };

        /**
         * renders the closing </div>
         *
         * @param {sap.ui.core.RenderManager}    oRm      Rendermanager
         * @returns {void}
         */
        Renderer.renderCloseTag = function renderCloseTag( oRm ) {
            oRm.write( "</div>" );
        };

        return Renderer;
    },
    /*bExport*/ true
);