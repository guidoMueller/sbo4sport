sap.ui.define( [
        "sap/ui/core/UIComponent",
        "sap/ui/model/resource/ResourceModel",
        "uniorg/ui/model/DeviceModel",
        "uniorg/ui/model/uis/UISModel",
        "uniorg/ui/util/Prototype"
    ],
    function ( UIComponent, ResourceModel, DeviceModel, UISModel ) {
        "use strict";

        var Component = sap.ui.core.UIComponent.extend( "uniorg.ui.core.UIComponent", {

            metadata: {
                name:         "UNIORG Bonvendo MODULNAME",
                version:      "1.0.0",
                rootView:     "uniorg.sapFourSport.view.Component",
                dependencies: {
                    libs: ["sap.m", "sap.ui.layout"]
                },
                properties:   {
                    launchPadId: {type: "string", defaultValue: ""}
                },
                config:       {
                    root:                        "uniorg.sapFourSport.MODUL.SUBMODUL",
                    resourceBundle:              "uniorg.sapFourSport.i18n.properties",
                    messageBundle:               "uniorg.sapFourSport.i18n.messagebundle",
                    oDataServiceConfig:          {
                        serviceUrl:          "/~guido/sport_app/uis/MODUL/SUBMODUL/{launchPadId}.xsodata",
                        defaultCountMode:    "None",   // None|Inline, None for fulltext search
                        sizeLimit:           500,
                        useBatch:            false,
                        deferredBatchGroups: ["changes"],
                        changeBatchGroups:   {
                            "*": {
                                batchGroupId: "changes",
                                changeSetId:  "ID",
                                single:       true
                            }
                        },
                        viewBinding:         {}
                    },
                    oUserInterfaceServiceConfig: {
                        serviceUrl: "uis"
                    }
                }
            },

            /**************************************************************
             * Life Cycle Methods
             **************************************************************/

            init: function () {
                // init super
                UIComponent.prototype.init.apply( this, arguments );
                var oMetadata = this.getMetadata(),
                    mConfig = oMetadata.getConfig();


                /**************************************************************
                 * i18n Model (set the internationalization model)
                 **************************************************************/
                this.setModel( new ResourceModel( {
                    bundleName: mConfig.messageBundle
                } ), "i18n" );

                /**************************************************************
                 * Device Model
                 **************************************************************/
                this.setModel( new DeviceModel(), "device" );


                /**************************************************************
                 * Router
                 **************************************************************/
                var oRouter = this.getRouter();
                if ( oRouter ) {
                    this.getRouter().initialize();
                }
            }

        } );

        return Component;

    }, /* bExport= */ true );