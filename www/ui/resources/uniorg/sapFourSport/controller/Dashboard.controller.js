sap.ui.define( [
        "uniorg/ui/core/mvc/BaseController",
        "uniorg/sapFourSport/util/Formatter"
    ],
    function ( BaseController ) {
        "use strict";

        return BaseController.extend( "uniorg.sapFourSport.controller.Dashboard", {

            onInit: function () {
                var mParameters = {};

                BaseController.prototype.onInit.apply( this, [mParameters] );
                var sPath = jQuery.sap.getModulePath( "uniorg.sapFourSport.model", "/Apps.json" );
                var oModel = new sap.ui.model.json.JSONModel( sPath );
                sap.ui.getCore().byId("__xmlview0--navContainer").setBusyIndicatorDelay(0)
                this.getView().setModel( oModel );
                // init class members
                this._oSapMessagesList = null;
            },
            
            navToContainer: function(oEvent) {
                this.onNavTo(oEvent);
            }

        } );

    }, /* bExport= */ true );