sap.ui.define(
    ["uniorg/ui/core/mvc/mf/UIComponent"],
    function ( UIComponent ) {
        "use strict";

        var Component = UIComponent.extend( "uniorg.sapFourSport.apps.member.Component", {

            metadata: {
                "name":    "UNIORG Sap4Sport member",
                "version": "1.0.0",
                "library": "uniorg.sapFourSport.apps.member",
                config:    {
                    root:               "uniorg.sapFourSport.apps.member",
                    oDataServiceConfig: {
                        serviceUrl:  "http://sbo4sports.uniorg.de:8000/uniorg/bonvendo/uis/ume/userappst/UmeUserManagement.xsodata",
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
                        viewPath: "uniorg.sapFourSport.apps.member.view"
                    }
                }
            }

        } );

        return Component;
    }, true );