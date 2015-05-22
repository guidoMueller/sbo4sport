sap.ui.define( ["uniorg/ui/util/BaseController"],
    function ( BaseController ) {
        "use strict";

        return BaseController.extend( "uniorg.ui.core.mvc.view.NotFound", {

            // ====== members ======================================================

            _msg: "<div class='titlesNotFound'>The requested object '{0}' is unknown to the explored app. We suspect it's lost in space.</div>",

            // ====== init =========================================================

            onInit: function ( oConfig ) {
                this._oConfig = jQuery.extend( {}, oConfig );

                BaseController.prototype.onInit.apply( this, [this._oConfig] );

                //this.getView().addEventDelegate(this);
            },

            // ====== event handling ===============================================

            onRouteMatched: function ( oEvent ) {
                if ( oEvent.getParameter( "name" ) !== "notFound" ) {
                    return;
                }
                var params = oEvent.getParameter( "arguments" )["all*"];
                var html = this._msg.replace( "{0}", params );
                this.getView().byId( "msgHtml" ).setContent( html );
            },

            onBeforeShow: function ( oEvent ) {
                if ( oEvent.data.path ) {
                    var html = this._msg.replace( "{0}", oEvent.data.path );
                    this.getView().byId( "msgHtml" ).setContent( html );
                }
            },

            onNavBack: function () {
                this.getRouter().myNavBack( "home", {} );
            }

            // ====== public =======================================================

            // ====== private ======================================================

        } );

    }, /* bExport= */ true );