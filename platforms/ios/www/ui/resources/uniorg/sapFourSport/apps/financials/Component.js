sap.ui.define(
    ["uniorg/ui/core/mvc/mf/UIComponent"],
    function ( UIComponent ) {
        "use strict";

        var Component = UIComponent.extend( "uniorg.sapFourSport.apps.financials.Component", {

            metadata: {
                "name":    "UNIORG Sap4Sport financials",
                "version": "1.0.0",
                "library": "uniorg.sapFourSport.apps.financials",
                config:    {
                    root:               "uniorg.sapFourSport.apps.financials",
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
                        viewPath: "uniorg.sapFourSport.apps.financials.view"
                    }
                }
            }

        } );

        return Component;
    }, true );