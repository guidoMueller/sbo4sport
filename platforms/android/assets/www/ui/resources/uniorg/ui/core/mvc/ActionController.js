sap.ui.define( ["uniorg/ui/core/mvc/BaseController"],
    function ( BaseController ) {
        "use strict";

        return BaseController.extend( "uniorg.ui.core.mvc.ActionController", {

            // ====== event handling ===============================================

            onPrintAction: function () {
                console.log( "print..." );
            },

            onDeleteAction: function () {
                console.log( "delete..." );
            }

        } );

    }, /* bExport= */ true );