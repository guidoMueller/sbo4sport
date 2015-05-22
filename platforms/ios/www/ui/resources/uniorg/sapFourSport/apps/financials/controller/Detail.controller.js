sap.ui.define( [
        "uniorg/ui/core/mvc/md/DetailController",
        "uniorg/sapFourSport/util/Formatter"
    ],
    function ( DetailController ) {
        "use strict";

        return DetailController.extend( "uniorg.sapFourSport.apps.financials.controller.Detail", {

            onInit: function () {
                var mParameters = {};

                DetailController.prototype.onInit.apply( this, [mParameters] );
                var sPath = jQuery.sap.getModulePath( "uniorg.sapFourSport.apps.financials.model", "/Apps.json" );
                var oModel = new sap.ui.model.json.JSONModel( sPath );
                this.getView().setModel( oModel );

                // init class members
                this._oSapMessagesList = null;
            }

        } );

    }, /* bExport= */ true );