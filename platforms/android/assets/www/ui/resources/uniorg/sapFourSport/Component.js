sap.ui.define( ["uniorg/ui/core/UIComponent"],
    function ( UIComponent ) {
        "use strict";

        var Component = UIComponent.extend( "uniorg.sapFourSport.Component", {

            metadata: {
                name:       "Dashboard",
                manifest:   "json",
                "rootView": "uniorg.sapFourSport.view.Component",
                config:     {
                    rootPath: jQuery.sap.getModulePath( "uniorg.sapFourSport" )
                }
            }

        } );

        Component.prototype.init = function () {
            UIComponent.prototype.init.apply( this );

        };

        return Component;

    }, true );