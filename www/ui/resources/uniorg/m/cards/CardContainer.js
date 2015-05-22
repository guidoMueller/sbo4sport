sap.ui.define( [
        "sap/ui/core/Control"
    ],
    /**
     * @param {sap.ui.core.Control} BaseControl class
     */
    function ( Control ) {
        "use strict";

        /**
         *
         * @param {string} [sId] id for the new control, generated automatically if no id is given
         * @param {object} [mSettings] initial settings for the new control
         *
         * @author  UNIORG Solutions GmbH 2015
         * @version 0.3
         *
         * @class
         * @extends sap.ui.core.Control
         * @constructor
         * @public
         * @alias uniorg.m.cards.CardContainer
         */
        var CardContainer = Control.extend( "uniorg.m.cards.CardContainer", {
            metadata: {
                properties:         {},
                defaultAggregation: "cards",
                aggregations:       {
                    /**
                     * set of cards
                     */
                    cards: {
                        type:         "uniorg.m.cards.BaseCardItem",
                        multiple:     true,
                        bindable:     "bindable",
                        singularName: "card"
                    }
                }
            }
        } );

        /**
         * after rendering, trigger isotope
         *
         * @return {void}
         */
        /*
         CardContainer.prototype.onAfterRendering = function() {
         var $dom = jQuery(".uoMCardsCardContainer_Content", this.getDomRef());
         $dom.css("opacity", 0);
         // the dom isn't completly reader in onAfterRendering, so wait a little for the flow..
         setTimeout(function() {
         $dom.isotope({
         itemSelector: ".uoMCardsCard",
         layoutMode: "masonry",
         masonry: {
         gutter: 20,
         isFitWidth: true
         }
         }).animate({ "opacity": 1});
         }, 250);
         };
         */

        return CardContainer;
    },
    /*bExport*/ true
);