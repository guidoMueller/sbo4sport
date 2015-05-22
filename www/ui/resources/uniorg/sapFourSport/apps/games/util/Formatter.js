sap.ui.define( [],
    function () {
        "use strict";

        var Formatter = {

            gameDateTime: function ( sValue ) {
                console.log( sValue );
                return new Date( sValue );
            }

        };

        return Formatter;

    }, /* bExport= */ true );