sap.ui.define( [
        "sap/ui/core/Control",
        "sap/ui/core/IconPool",
        "sap/m/Image"
    ],
    /**
     * @param {sap.ui.core.Control}  Control  Base control class
     * @param {sap.ui.core.IconPool} IconPool The core icon pool
     * @param {sap.m.Image}          Image    Image class used for icons and images
     */
    function ( Control, IconPool, Image ) {
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
         * @alias uniorg.m.cards.BaseCardItem
         */
        var BaseCardItem = Control.extend( "uniorg.m.cards.BaseCardItem", {
            metadata: {
                properties: {

                    /**
                     * Icon to display on the left side of the header
                     */
                    icon: {type: "sap.ui.core.URI", group: "Appearance", defaultValue: null},

                    /**
                     * Title for the header
                     */
                    title: {type: "string", group: "Misc", defaultValue: null},

                    /**
                     * text for the subheader
                     */
                    subhead: {type: "string", group: "Misc", defaultValue: null},

                    /**
                     * url to the background image
                     */
                    backgroundSrc: {type: "sap.ui.core.URI", group: "Appearance", defaultValue: null},

                    /**
                     * height for the header. usefull if there is a background image
                     */
                    headerHeight: {type: "sap.ui.core.CSSSize", group: "Appearance", defaultValue: "auto"},

                    /**
                     *
                     */
                    hasDarkBackground: {type: "boolean", group: "Appearance", defaultValue: false}
                },

                defaultAggregation: "content",

                aggregations: {

                    /**
                     * content for inside the card
                     */
                    content: {
                        type:         "sap.ui.core.Control",
                        multiple:     true,
                        bindable:     "bindable",
                        singularName: "content"
                    },

                    /**
                     * Buttons to be displayed on the bottom of the card
                     */
                    actions: {type: "sap.m.Button", multiple: true, bindable: "bindable", singularName: "action"}
                }
            }
        } );

        /**
         * @internal
         * @return {sap.m.Image} the image element for the icon
         */
        BaseCardItem.prototype.getIconImage = function () {
            if ( this._image ) {
                return this._image;
            }
            var sSrc = this.getIcon();

            this._image = IconPool.createControlByURI( {
                id:  this.getId() + "--Icon",
                src: sSrc
            }, Image ).setParent( this, null, true );
            return this._image;
        };

        /**
         * override setIcon to remove the icon image cache
         *
         * @param {string} sIcon url to the image/icon
         * @return {self}  to allow method chaining
         */
        BaseCardItem.prototype.setIcon = function ( sIcon ) {
            var sValue = this.getIcon();

            if ( sIcon === null || sIcon === undefined ) {
                sIcon = "";
            }

            if ( sValue === sIcon ) {
                return this;
            }

            this._image = undefined;
            this.setProperty( "icon", sIcon );
            return this;
        };

        return BaseCardItem;
    },
    /*bExport*/ true
);