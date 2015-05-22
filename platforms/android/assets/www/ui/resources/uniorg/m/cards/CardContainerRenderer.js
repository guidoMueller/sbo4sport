sap.ui.define(
    ["sap/ui/core/Renderer"],
    function ( BaseRenderer ) {

        // extend the base renderer so we get the extend function.
        var Renderer = BaseRenderer.extend( BaseRenderer );

        /**
         * renders the whole control
         *
         * @param {sap.ui.core.RenderManager}    oRm      Rendermanager
         * @param {uniorg.m.cards.CardContainer} oControl Card Container
         * @returns {void}
         */
        Renderer.render = function render( oRm, oControl ) {
            this.renderOpenTag( oRm, oControl );

            var aCards = oControl.getCards();
            for ( var i = 0; i < aCards.length; i++ ) {
                oRm.renderControl( aCards[i] );
            }

            this.renderCloseTag( oRm, oControl );
        };

        /**
         * renders the opening <div> tag with classes, styling and attributes
         *
         * @param {sap.ui.core.RenderManager}    oRm      Rendermanager
         * @param {uniorg.m.cards.CardContainer} oControl Card Container
         * @returns {void}
         */
        Renderer.renderOpenTag = function renderOpenTag( oRm, oControl ) {
            oRm.write( "<div" );
            oRm.writeControlData( oControl );
            oRm.addClass( "uoMCardsCardContainer" );
            oRm.writeClasses();
            oRm.writeStyles();
            oRm.writeAttribute( "tabindex", "-1" );
            oRm.write( ">" );
            oRm.write( "<div class='uoMCardsCardContainer_Content'>" );
        };

        /**
         * renders the closing </div>
         *
         * @param {sap.ui.core.RenderManager}    oRm      Rendermanager
         * @returns {void}
         */
        Renderer.renderCloseTag = function renderCloseTag( oRm ) {
            oRm.write( "</div>" );
            oRm.write( "</div>" );
        };

        return Renderer;
    },
    /*bExport*/ true
);