sap.ui.define( ["uniorg/ui/core/mvc/BaseController"],
    function ( BaseController ) {
        "use strict";

        return BaseController.extend( "uniorg.ui.core.mvc.ComponentController", {

            onInit: function () {
                BaseController.prototype.onInit.apply( this, arguments );

                var oView = this.getView();

                // remember the App Control
                this.app = oView.byId( "idAppControl" );

                // to avoid scrollbars on desktop the root view must be set to block display
                // view.setDisplayBlock(true); // done inside view
                oView.toggleStyleClass( "sapUiSizeCompact", sap.ui.Device.system.desktop );
                //oView.toggleStyleClass("sapUiSizeCompact", true);

                /*
                 this.app.setHomeIcon({
                 "phone" : "img/57_iPhone_Desktop_Launch.png",
                 "phone@2" : "img/114_iPhone-Retina_Web_Clip.png",
                 "tablet" : "img/72_iPad_Desktop_Launch.png",
                 "tablet@2" : "img/144_iPad_Retina_Web_Clip.png",
                 favicon" : "img/favicon.ico",
                 "precomposed": false
                 });
                 */

                // subscribe to event bus
                var oEventBus = sap.ui.getCore().getEventBus();
                oEventBus.subscribe( "nav", "to", this.onNavTo, this );
                oEventBus.subscribe( "nav", "back", this.onNavBack, this );
            },

            // ====== event handling ===============================================

            onNavTo: function ( channelId, eventId, data ) {
                if ( data && data.id ) {
                    // lazy load view
                    if ( this.app.getPage( data.id ) === null ) {
                        jQuery.sap.log.info( "now loading page '" + data.id + "'" );
                        //this.app.addPage(sap.ui.jsview(data.id, "sap.m.mvc." + data.id));
                    }
                    // Navigate to given page (include bindingContext)
                    this.app.to( data.id, data.data.context );
                } else {
                    jQuery.sap.log.error( "nav-to event cannot be processed. Invalid data: " + data );
                }
            },

            onNavBack: function () {
                this.app.back();
            }

        } );

    }, /* bExport= */ true );