sap.ui.define(
    ["sap/m/Text"],
    /**
     * @param {sap.m.Text} BaseText
     * @return {uniorg.m.DdictText}
     */
    function ( BaseText ) {

        var Text = BaseText.extend( "uniorg.m.DdicText", {
            renderer: {},
            metadata: {
                properties: {
                    domain: {type: "string", defaultValue: "", bindable: "bindable"},
                    key:    {type: "string", defaultValue: "", bindable: "bindable"}
                }
            }
        } );

        /**
         * returns the translated text for the given domain & key
         *
         * @return {string} Translated text
         */
        Text.prototype.getText = function () {
            var sDomain = this.getDomain(),
                sKey = this.getKey();

            return this.getModel( "i18n" ).getProperty( sDomain + "." + sKey );
        };

        return Text;
    },
    /*bExport */ true
);