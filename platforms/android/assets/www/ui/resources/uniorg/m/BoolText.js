sap.ui.define(
    ["sap/m/Text"],
    /**
     * @param {sap.m.Text} BaseText
     * @return {uniorg.m.BoolText}
     */
    function ( BaseText ) {

        var Text = BaseText.extend( "uniorg.m.BoolText", {
            renderer: {},
            metadata: {
                properties: {
                    value: {type: "any", defaultValue: false, bindable: "bindable"}
                }
            }
        } );

        /**
         * returns the translated text for the given boolean value
         *
         * @return {string} Translated text
         */
        Text.prototype.getText = function () {
            var oState = this.getValue();
            var bValue = (oState === true || oState === "1" || oState === "X");

            return this.getModel( "i18n" ).getProperty( bValue ? "Yes" : "No" );
        };

        return Text;
    },
    /*bExport */ true
);