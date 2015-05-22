/**
 * Unified MVC handling
 *
 * @namespace
 * @name uniorg.ui.core.mvc
 * @public
 */

    // Provides class uniorg.ui.core.mvc.BaseController
sap.ui.define( ["sap/ui/core/mvc/Controller"],
    function ( Controller ) {
        "use strict";

        /**
         * Constructor for a new BaseController.
         *
         * @param {string} [sServiceUrl] base uri of the service to request data from; additional URL parameters appended here will be appended to every request
         *                                can be passed with the mParameters object as well: [mParameters.serviceUrl] A serviceURl is required!
         * @param {object} [mParameters] (optional) a map which contains the following parameter properties:
         * @param {string} [mParameters.routeName] the name of the used route
         *
         * @class
         * Base Controller implementation
         *
         * @extends sap.ui.core.mvc.Controller
         *
         * @author UNIORG
         * @version 1.0.0
         *
         * @constructor
         * @public
         * @alias uniorg.ui.core.mvc.BaseController
         */
        var BaseController = Controller.extend( "uniorg.ui.core.mvc.BaseController", {

            onInit: function ( mParameters ) {
                // apply config
                this._mParameters = jQuery.extend( {
                    sRouteName: ""
                }, mParameters );

                // init class members
                this._bIsViewUpdatedAtLeastOnce = false;
                this._aComponents = []; // array of used components to cache
                this._aFragments = [];  // array of used fragments to cache

                var oRouter = this.getRouter(),
                    sRouteName = this.getParameter( "sRouteName" );
                if ( oRouter ) {
                    var oRoute = oRouter.getRoute( sRouteName );
                    if ( oRoute ) {
                        // subscribe to routing
                        oRoute.attachPatternMatched( this.onRouteMatched, this );
                    } else {
                        // TODO: onRouteMatchedGlobal
                        //oRouter.attachRoutePatternMatched(this.onRouteMatchedGlobal, this);
                        oRouter.attachRoutePatternMatched( this.onRouteMatched, this );
                    }
                }

                // subscribe to nav container events
                this.getView().addEventDelegate( {
                    //onBeforeFirstShow : this.onBeforeFirstShow.bind(this);
                    onBeforeFirstShow: jQuery.proxy( this.onBeforeFirstShow, this )
                } );

                // nav button handling
                var oPage = this.getView().byId( "page" );
                if ( oPage ) {
                    oPage.setShowNavButton( sap.ui.Device.system.phone );
                    oPage.attachNavButtonPress( this.onNavButton.bind( this ) );
                }

                // modify view
                this.modifyView();
            },

            onExit: function () {
                // destroy all cached components
                jQuery.each( this._aComponents, function ( iIdx ) {
                    if ( this._aComponents[iIdx] ) {
                        this._aComponents[iIdx].destroy();
                    }
                } );
                delete this._aComponents;

                // destroy all cached fragments
                jQuery.each( this._aFragments, function ( iIdx ) {
                    if ( this._aFragments[iIdx] ) {
                        this._aFragments[iIdx].destroy();
                    }
                } );
                delete this._aFragments;
            },

            // ====== event handling ===============================================

            onBeforeFirstShow: function () {
                if ( !this._bIsViewUpdatedAtLeastOnce ) {
                    this.updateView();
                    this._bIsViewUpdatedAtLeastOnce = true;


                    //var oNavButton = this.getView().byId("page-navButton");
                    //if (oNavButton) oNavButton.setIcon("sap-icon://menu2");
                }
            },

            /**
             * Event handler  for navigating back.
             * It checks if there is a history entry. If yes, history.go(-1) will happen.
             * If not, a backward navigation with forward history will take place.
             * @param sRoute the route name where you would like to navigate to
             * @param mData optional data for the route
             * @public
             */
            /*
             onNavBack : function(oEvent) {
             this.navBack("sRoute", {});
             },
             */

            onNavButton: function () {
                var sRouteName = this.getParameter( "sRouteName" ) || "";
                this.getRouter().myNavBack( sRouteName );
            },

            /**
             * Event handler for navigating to defined route.
             * You have to define a custom data route name property
             * e.g. XMLView -> data:routeName="routeName"
             * e.g. JSView  -> customData : [{ key : "routeName", value : "routeName" }]
             *
             * @param {sap.ui.base.Event} oEvent - the navigate to event.
             * @returns {undefined} undefined
             * @public
             */
            onNavTo: function ( oEvent ) {
                var oItem = oEvent.getParameter( "listItem" ) || oEvent.getSource(),
                    sRouteName = oItem.data( "routeName" ),
                    oRouteConfig = oItem.data( "routeConfig" ) || undefined;
                if ( oRouteConfig === "MD_BINDING" ) {
                    var sBindingPath = oItem.getBindingContext().getPath();
                    oRouteConfig = {
                        //from: "master",
                        detailId: sBindingPath.substr( 1 )
                    };
                }

                if ( sRouteName ) {
                    // nav to with history
                    this.navTo( sRouteName, oRouteConfig, false );
                    //this.getRouter().getTargets().display(sRouteName, oRouteConfig);
                } else {
                    jQuery.sap.log.error( "Missing customData data:routeName=\"routeName\"!" );
                }
            },

            /**
             * Event is fired when controller is called from router via route
             * Implement route/name specific action (event is globaly thrown)
             *
             * @param {jQuery.Event} oEvent - the route event.
             * @returns {undefined} undefined
             * @public
             */
            onRouteMatched: function ( oEvent ) {
                var oArgs = oEvent.getParameter( "arguments" );
                //this.updateView();
            },

            onRouteMatchedGlobal: function () {
                //var oArgs = oEvent.getParameter("arguments");
                //this.updateView();
            },

            onShowActions: function ( oEvent ) {
                var oButton = oEvent.getSource(),
                //oActionSheet = this.getFragment("fragment.Action", "Action");
                    oActionSheet = this.getFragment( "fragment.Action" );

                // delay because addDependent will do a async rerendering and the
                // actionSheet will immediately close without it.
                jQuery.sap.delayedCall( 0, this, function () {
                    oActionSheet.openBy( oButton );
                } );
                var sPlacement = oButton.data( "placement" ) ||
                    this.getPopupPlacement();
                oActionSheet.setPlacement( sPlacement );
            },

            // ====== public =======================================================

            getBindingConfig: function ( sRoute, sContainerId, sProperty ) {
                //var oConfig = this.getOwnerComponent().getMetadata().getConfig(),
                var oConfig = this.getComponent().getMetadata().getConfig(),
                    mViewBinding = oConfig.oDataServiceConfig.viewBinding;

                if ( sRoute === "*" ) {
                    return mViewBinding;
                }
                if ( !sRoute ) {
                    sRoute = this.getParameter( "sRouteName" );
                }
                if ( mViewBinding[sRoute] ) {
                    if ( !sContainerId ) {
                        sContainerId = "VIEW";
                    }
                    if ( mViewBinding[sRoute][sContainerId] ) {
                        if ( !sProperty ) {
                            sProperty = "bindingInfo";
                        }
                        if ( mViewBinding[sRoute][sContainerId][sProperty] ) {
                            // bindingInfo only
                            return mViewBinding[sRoute][sContainerId][sProperty];
                        } else {
                            // container binding
                            return mViewBinding[sRoute][sContainerId];
                        }
                    } else {
                        // route binding
                        return mViewBinding[sRoute];
                    }
                } else {
                    return {};
                }
            },

            getComponent: function ( sId, mSettings ) {
                if ( !sId ) {
                    // return owner component
                    return sap.ui.core.Component.getOwnerComponentFor(
                        this.getView()
                    );
                } else {
                    // return or load component
                    if ( !this._aComponents[sId] ) {
                        // TO DO: maybe make mSettings.url absolute
                        // jQuery.sap.getModulePath("uniorg")
                        this._aComponents[sId] = new sap.ui.core.ComponentContainer(
                            sId, mSettings
                        );
                    }
                    return this._aComponents[sId];
                }
            },

            /**
             * Return class config parameters
             *
             * @return {object} oData Object containing the requested data if parameter is availbale
             * @public
             * @deprecated please use {@link #getParameters} instead
             */
            /*
             getConfig : function() {
             jQuery.sap.log.error(this + " - Used deprecated getConfig(). Please use .getParameter() instead!");
             return this._mParameters;
             },
             */

            /**
             * Return class config parameter by name
             *
             * @param {string} sParameter the property to read
             *
             * @return {object} oData Object containing the requested data if parameter is availbale
             * @public
             * @deprecated please use {@link #getParameter} instead
             */
            /*
             getConfigParameter : function(sParameter) {
             jQuery.sap.log.error(this + " - Used deprecated getConfigParameter(). Please use .getParameters() instead!");
             return this.getConfig()[sParameter];
             },
             */

            /**
             * Return class config parameters
             *
             * @return {object} oData Object containing the requested data if parameter is availbale
             * @public
             */
            getParameters: function () {
                return this._mParameters;
            },

            /**
             * Return class config parameter by name
             *
             * @param {string} sParameter the property to read
             *
             * @return {object} oData Object containing the requested data if parameter is availbale
             * @public
             */
            getParameter: function ( sParameter ) {
                return this.getParameters()[sParameter];
            },

            setParameter: function ( sParameter, oValue ) {
                this.getParameters()[sParameter] = oValue;
            },

            /**
             * Convenience method for accessing the event bus in every controller of the application.
             * @param {boolean} bGlobal if true return core global EventBus else component EventBus
             * @public
             * @returns {sap.ui.core.EventBus} the event bus for this component
             */
            getEventBus: function ( bGlobal ) {
                if ( bGlobal ) {
                    // global event bus
                    return sap.ui.getCore().getEventBus();
                } else {
                    // component event bus
                    var sComponentId = sap.ui.core.Component.getOwnerIdFor( this.getView() );
                    return sap.ui.component( sComponentId ).getEventBus();
                    //return this.getOwnerComponent().getEventBus();
                }
            },

            /**
             * Convenience method for loading and caching view fragments in every controller of the application.
             * @param {string} sName fragment name
             * @param {object} oController mvc.controller or null to use this
             * @param {string} sType fragment type [XML|JS|.. ]
             * @public
             * @returns {sap.ui.core.EventBus} the event bus for this component
             */
            getFragment: function ( sName, oController, sType ) {
                var oView = this.getView(),
                    sViewName = oView.getViewName(),
                    sPackage = sViewName.substr( 0, sViewName.lastIndexOf( "." ) );

                //console.log("getFragmentFor", sName, sPackage);

                if ( !sType ) {
                    sType = "XML";
                } // [XML|JS|HTML]

                if ( new RegExp( "^fragment." ).test( sName ) || new RegExp( "^tab." ).test( sName ) ) {
                    // resolve relative path
                    sName = sPackage + "." + sName;
                }
                //console.log("getFragmentKey", sName, this.getView(), this._aFragments);

                if ( !this._aFragments[sName] ) {
                    if ( oController && typeof oController === "string" ) {
                        if ( !new RegExp( "^view." ).test( oController ) ) {
                            // resolve relative path
                            oController = sPackage + "." + oController;
                        }
                        oController = sap.ui.controller( oController );
                    } else {
                        oController = this;
                    }

                    // attach owner component reference to controller
                    if ( !oController.component ) {
                        oController.component =
                            sap.ui.core.Component.getOwnerComponentFor( this.getView() );
                    }

                    this._aFragments[sName] = sap.ui.xmlfragment( sName, oController );
                    // TODO: add dynamic sType
                    //this._aFragments[sName] = sap.ui.fragment(sName, sType, oController);
                    //this._aFragments[sName].setModel(oController.getModel());
                    //this._aFragments[sName].bindElement("/UmeUser/0");
                    this.getView().addDependent( this._aFragments[sName] );

                    // toggle compact style
                    jQuery.sap.syncStyleClass(
                        "sapUiSizeCompact", oView, this._aFragments[sName]
                    );
                }
                return this._aFragments[sName];
            }, // eof getFragment

            /**
             * Convenience method for getting the view model by name in every controller of the application.
             * @public
             * @param {string} sName the model name
             * @returns {sap.ui.model.Model} the model instance
             */
            getModel: function ( sName ) {
                return this.getView().getModel( sName );
            },

            /**
             * Convenience method for setting the view model in every controller of the application.
             * @public
             * @param {sap.ui.model.Model} oModel the model instance
             * @param {string} sName the model name
             * @returns {sap.ui.mvc.View} the view instance
             */
            setModel: function ( oModel, sName ) {
                return this.getView().setModel( oModel, sName );
            },

            getPopupPlacement: function () {
                //return (sap.ui.Device.system.phone) ? "Top" : "Bottom";
                //return (sap.ui.Device.support.touch) ? "Top" : "Bottom";
                return "Top";
            },

            /**
             * Convenience method for accessing the router in every controller of the application.
             * @public
             * @returns {sap.ui.core.routing.Router} the router for this component
             */
            getRouter: function () {
                return sap.ui.core.UIComponent.getRouterFor( this );
            },

            /**
             * Convenience method for getting the resource bundle.
             * @public
             * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
             */
            getResourceBundle: function () {
                return this.getOwnerComponent().getModel( "i18n" ).getResourceBundle();
            },

            getText: function ( sKey, oParams ) {
                var aParams = [];
                if ( oParams && !(oParams instanceof Array) ) {
                    aParams = [oParams];
                }
                return this.getResourceBundle().getText( sKey, aParams );
            },

            isCordova: function () {
                return (typeof window.cordova !== "undefined");
                /*
                 return (cordova || PhoneGap || phonegap)
                 && /^file:\/{3}[^\/]/i.test(window.location.href)
                 && /ios|iphone|ipod|ipad|android/i.test(navigator.userAgent);
                 */
            },

            // implement view modifications
            modifyView: function () {
            },

            navBack: function ( sRoute, mData ) {
                var oHistory = sap.ui.core.routing.History.getInstance();
                var sPreviousHash = oHistory.getPreviousHash();

                //The history contains a previous entry
                if ( sPreviousHash !== undefined ) {
                    window.history.go( -1 );
                } else {
                    var bReplace = true; // otherwise we go backwards with a forward history
                    this.getRouter().navTo( sRoute, mData, bReplace );
                }
            },

            navTo: function ( sName, oParameters, bReplace ) {
                if ( bReplace === undefined ) {
                    // If we're on a phone, include nav in history; if not, don't.
                    bReplace = sap.ui.Device.system.phone ? false : true;
                    //bReplace = false;
                }
                sap.ui.getCore().byId( "__xmlview0--backHeadItem" ).setVisible( true );
                this.getRouter().navTo( sName, oParameters, bReplace );
            },

            removeTabBarIcons: function ( sId, bAlways ) {
                if ( sap.ui.Device.system.phone || bAlways ) {
                    var oIconTabBar = this.getView().byId( sId );
                    if ( oIconTabBar ) {
                        var aItems = oIconTabBar.getItems();
                        for ( var i = 0; i < aItems.length; i++ ) {
                            aItems[i].setIcon( null );
                        }
                    }
                }
            },

            // implement view update dependencies
            updateView: function () {
                // memorize that this function was executed at least once
                this._bIsViewUpdatedAtLeastOnce = true;
            },

            /**
             * Validate container input fields
             *
             * @param {object} oContainer the container with the fields
             * @param {boolean} bValidateHidden also validate hidden fields, default: false
             * @public
             * @name sap.ui.core.Core#validateInput
             * @function
             */
            validateInput: function ( oContainer, bValidateHidden ) {
                //sFormContainerId = oContainer
                var bIsValid = true,
                    aElements = (oContainer && oContainer._aElements) ?
                                oContainer._aElements : oContainer.findElements( true );

                // raise validation errors for binded value properties
                //jQuery('input[aria-required=true]').each(function(){
                //var oInput = sap.ui.getCore().byId(this.id);
                jQuery.each( aElements, function ( sKey, oElement ) {
                    var sPropertyName = null;

                    // check supported properties
                    if ( oElement instanceof sap.m.InputBase ) {
                        sPropertyName = "value";
                    }

                    // validate supported properties that are visible
                    if ( sPropertyName && (bValidateHidden || oElement.getVisible()) ) {
                        if ( oElement.setValueState ) {
                            oElement.setValueState( sap.ui.core.ValueState.None );
                        }
                        var onElementValidationError = function ( oEvent ) {
                            var oSource = oEvent.getSource();
                            bIsValid = false;
                            // TODO: collect tab + field info -> link auf FehlerFeld
                            //console.log(oSource.getId(), oSource.getValue(), oSource);
                        };
                        oElement.attachEvent( "validationError", onElementValidationError );
                        oElement.updateModelProperty(
                            sPropertyName,
                            oElement.getProperty( sPropertyName )
                        );
                        oElement.detachEvent( "validationError", onElementValidationError );
                    }
                } );
                return bIsValid;
            }

        } );

        return BaseController;

    }, /* bExport= */ true );