sap.ui.define( ["uniorg/ui/core/mvc/BaseController"],
    function ( BaseController ) {
        "use strict";

        return BaseController.extend( "uniorg.ui.core.mvc.md.view.Dashboard", {

            // ====== event handling ===============================================

            onNavBack: function () {
                //this.router.myNavBack("home", {});
            },

            onRefresh: function ( oEvent ) {
                console.log( "onRefresh..." );
            },

            onTilePress: function ( oEvent ) {
                var oSource = oEvent.getSource(),
                    bReplace = !jQuery.device.is.phone,
                    oRouteConfig = {"filterGroupKey": oSource.data( "key" )};

                /*
                 oRouter.myNavToWithoutHash({
                 targetViewName : "uniorg.bonvendo.app.ume.usermgmt.ui.view.Master",
                 isMaster : true
                 });
                 */

                //this.getRouter().navTo("master", oRouteConfig);
                this.getComponent().to( data.id, data.data.context );
            }

            // ====== public =======================================================

            // ====== private ======================================================

        } );

    }, /* bExport= */ true );