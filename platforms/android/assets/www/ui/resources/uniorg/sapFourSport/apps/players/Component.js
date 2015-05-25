sap.ui.define(
    ["uniorg/ui/core/mvc/mf/UIComponent"],
    function ( UIComponent ) {
        "use strict";

        var Component = UIComponent.extend( "uniorg.sapFourSport.apps.players.Component", {

            metadata: {
                "name":    "UNIORG Sap4Sport players",
                "version": "1.0.0",
                "library": "uniorg.sapFourSport.apps.players",
                config:    {
                    root:               "uniorg.sapFourSport.apps.players",
                    oDataServiceConfig: {
                        serviceUrl:  applicationContext.applicationEndpointURL,
                        viewBinding: {
                            master: {
                                LIST: {
                                    bindingInfo: { // filter search
                                        path:       "/UmeUsers",
                                        parameters: {
                                            expand: "UmeAccount"
                                        }
                                    }
                                }
                            },
                            detail: {
                                VIEW:       {
                                    bindingInfo: {
                                        path: "/UmeUsers({0})"
                                    }
                                },
                                tabAccount: {
                                    bindingInfo: {
                                        path: "/UmeAccounts({0})"
                                    }
                                }
                            }
                        }
                    }
                },
                routing:   {
                    config: {
                        viewPath: "uniorg.sapFourSport.apps.players.view"
                    }
                }
            }

        } );

        return Component;
    }, true );