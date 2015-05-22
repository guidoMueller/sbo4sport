sap.ui.define( [
        "sap/ui/core/UIComponent",
        "sap/ui/model/resource/ResourceModel",
        "uniorg/ui/model/DeviceModel",
        "uniorg/ui/model/uis/UISModel",
        "uniorg/ui/core/routing/BaseRouter",
        "uniorg/ui/util/Prototype"
    ],
    function ( UIComponent, ResourceModel, DeviceModel, UISModel ) {
        "use strict";

        var Component = sap.ui.core.UIComponent.extend( "uniorg.ui.core.mvc.mf.UIComponent", {

            metadata: {
                name:         "UNIORG Bonvendo MODULNAME",
                version:      "1.0.0",
                //library : "uniorg.bonvendo.MODUL.SUBMODUL",
                //includes : [], // "css/style.css"
                dependencies: {
                    libs: ["sap.m", "sap.ui.layout", "uniorg.m"]
                    //components : []
                },
                //initOnBeforeRender : true,
                /*
                 aggregations : {
                 rootControl: {
                 type: "sap.ui.core.Control", multiple: false, visibility: "hidden"
                 }
                 },
                 */
                properties:   {
                    launchPadId: {type: "string", defaultValue: ""}
                },
                config:       {
                    root:                        "uniorg.bonvendo.MODUL.SUBMODUL",
                    resourceBundle:              "i18n/messagebundle.properties",
                    //messageBundle : "???",
                    oDataServiceConfig:          {
                        serviceUrl:       "/~guido/sport_app/uis/MODUL/SUBMODUL/{launchPadId}.xsodata",
                        defaultCountMode: "None",   // None|Inline, None for fulltext search
                        //refreshAfterChange : true,     // Default = true
                        sizeLimit:        500,
                        useBatch:         false,
                        viewBinding:      {}
                    },
                    oUserInterfaceServiceConfig: {
                        serviceUrl: "/~guido/sport_app/uis"
                    }
                },
                rootView:     "uniorg.ui.core.mvc.md.view.Component",
                routing:      {
                    config: {
                        routerClass:       "uniorg.ui.core.routing.BaseRouter",
                        viewType:          "XML",
                        viewPath:          "uniorg.sapFourSport.MODUL.SUBMODULE.view",
                        targetAggregation: "detailPages",
                        clearTarget:       false
                    },
                    routes: [
                        {
                            pattern:           ":filterKey:",
                            name:              "master",
                            view:              "Master",
                            viewLevel:         1,
                            //preservePageInSplitContainer : true,
                            targetAggregation: "masterPages",
                            targetControl:     "idAppControl",
                            subroutes:         [
                                {
                                    pattern:   "detail/",
                                    name:      "detail",
                                    view:      "Detail",
                                    viewLevel: 2
                                }
                            ]
                        },
                        {
                            name:              "catchallMaster",
                            view:              "Master",
                            targetAggregation: "masterPages",
                            targetControl:     "idAppControl",
                            subroutes:         [
                                {
                                    pattern:    ":all*:",
                                    name:       "catchallDetail",
                                    view:       "NotFound",
                                    viewPath:   "uniorg.ui.core.mvc.view",
                                    viewLevel:  3,
                                    transition: "show"
                                }
                            ]
                        }
                    ]
                }
            },


            /**************************************************************
             * Life Cycle Methods
             **************************************************************/

            constructor: function ( sId, mSettings ) {
                if ( typeof sId === "object" ) {
                    mSettings = sId;
                }
                this._mRootSettings = mSettings;
                UIComponent.prototype.constructor.apply( this, arguments );
            },

            init: function () {
                var oMetadata = this.getMetadata(),
                    mConfig = oMetadata.getConfig();
                //oRoutingConfig = oMetadata.getRoutingConfig();

                mConfig.rootPath = jQuery.sap.getModulePath( mConfig.root );

                // init super
                UIComponent.prototype.init.apply( this, arguments );

                /**************************************************************
                 * i18n Model (set the internationalization model)
                 **************************************************************/
                this.setModel( new ResourceModel( {
                    bundleUrl: [mConfig.rootPath, mConfig.resourceBundle].join( "/" )
                    //bundleName : mConfig.messageBundle
                } ), "i18n" );

                /**************************************************************
                 * Device Model
                 **************************************************************/
                this.setModel( new DeviceModel(), "device" );

                /**************************************************************
                 * OData Model
                 **************************************************************/
                var sServiceUrl = mConfig.oDataServiceConfig.serviceUrl, // + "?sap-language=" + sLocale;
                    oUriParameters = jQuery.sap.getUriParameters();

                if ( oUriParameters.get( "responderOn" ) === "true" ) {
                    sServiceUrl = "http://mockserver/";
                    this._initMockServer( mConfig.oDataServiceConfig );
                }


                /**************************************************************
                 * Router
                 **************************************************************/
                var oRouter = this.getRouter();
                oRouter._oSplitContainer = this.getAggregation( "rootControl" ).byId( "idAppControl" );
                oRouter.initialize();
            },

            _initMockServer: function ( oModelConfig ) {
                jQuery.sap.require( "sap.ui.core.util.MockServer" );

                var //sServiceUrl = oModelConfig.serviceUrl,
                    sServiceUrl = "http://mockserver/",
                //sFolderName = oModelConfig.dataFolderName,
                    oUriParameters = jQuery.sap.getUriParameters();

                if ( oUriParameters.get( "responderOn" ) !== "true" ) {
                    return;
                }

                var oMockServer = new sap.ui.core.util.MockServer( {
                    rootUri: sServiceUrl
                } );

                sap.ui.core.util.MockServer.config( {
                    autoRespond:      true,
                    autoRespondAfter: (oUriParameters.get( "responderDelay" ) || 1000)
                } );

                oMockServer.simulate( "model/metadata.xml", "model/" );
                oMockServer.start();
                jQuery.sap.log.info( "Using OData mock server" );
            }

        } );

        return Component;

    }, /* bExport= */ true );