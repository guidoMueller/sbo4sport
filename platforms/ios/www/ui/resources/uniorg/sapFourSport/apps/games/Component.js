sap.ui.define(
    ["uniorg/ui/core/mvc/mf/UIComponent"],
    function ( UIComponent ) {
        "use strict";

        var Component = UIComponent.extend( "uniorg.sapFourSport.apps.games.Component", {

            metadata: {
                "name":    "UNIORG Sap4Sport games",
                "version": "1.0.0",
                "library": "uniorg.sapFourSport.apps.games",
                config:    {
                    root:               "uniorg.sapFourSport.apps.games",
                    oDataServiceConfig: {
                        serviceUrl:  applicationContext.applicationEndpointURL,
                        viewBinding: {
                            master: {
                                LIST: {
                                    bindingInfo: { // filter search
                                        path:       "/games",
                                        parameters: {
                                            expand: "UmeAccount"
                                        }
                                    }
                                }
                            },
                            detail: {
                                VIEW: {
                                    bindingInfo: {
                                        path: "/games/detail"
                                    }
                                }
                            }
                        }
                    }
                },
                routing:   {
                    config: {
                        viewPath: "uniorg.sapFourSport.apps.games.view"
                    }
                }
            }

        } );

        return Component;
    }, true );