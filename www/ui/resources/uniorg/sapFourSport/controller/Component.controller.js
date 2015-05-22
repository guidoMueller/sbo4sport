sap.ui.define( [
        "uniorg/ui/core/mvc/BaseController",
        "sap/m/MessageBox"
    ],
    function ( BaseController, MessageBox ) {
        "use strict";

        return BaseController.extend( "uniorg.sapFourSport.controller.Component", {

            onInit: function () {
                BaseController.prototype.onInit.apply( this, arguments );

                // init class members
                this._bIsHome = true;

                var oView = this.getView();

                // to avoid scrollbars on desktop the root view must be set to block display
                oView.setDisplayBlock( true ); // done inside view
                oView.toggleStyleClass( "sapUiSizeCompact", sap.ui.Device.system.desktop );

                // ui model
                var oData = {
                        logo:       jQuery.sap.getModulePath( "uniorg.sapFourSport", "/" ) +
                                    "mimes/UNIORG_Logo_SBO4Sports.png",
                        financials: jQuery.sap.getModulePath( "uniorg.sapFourSport", "/" ) +
                                    "mimes/UNIORG_SBO4Financials.png",
                        members:    jQuery.sap.getModulePath( "uniorg.sapFourSport", "/" ) +
                                    "mimes/UNIORG_SBO4Members.png",
                        players:    jQuery.sap.getModulePath( "uniorg.sapFourSport", "/" ) +
                                    "mimes/UNIORG_SBO4Players.png",
                        sponsoring: jQuery.sap.getModulePath( "uniorg.sapFourSport", "/" ) +
                                    "mimes/UNIORG_SBO4Sponsors.png",
                        ticketing:  jQuery.sap.getModulePath( "uniorg.sapFourSport", "/" ) +
                                    "mimes/UNIORG_SBO4Tickets.png"
                    },
                    oModel = new sap.ui.model.json.JSONModel();
                oModel.setData( oData );
                sap.ui.getCore().setModel( oModel, "ui" );
                this.getView().setModel( oModel, "ui" );

            },

            // ====== event handling ===============================================

            onAbout: function ( oEvent ) {
                console.log( "onAbout..." );
            },

            onNavBack: function () {
                sap.ui.getCore().byId( "__xmlview0--backHeadItem" ).setVisible( false );
                this.navBack( "dashboard" );
            },

            onNavLink: function ( oEvent ) {
                var oSource = oEvent.getSource(),
                    sRouteName = oSource.data( "routeName" );
                //sViewID = oSource.data("viewId");

                /*
                 //this.navToCarousel(sViewID);
                 */
                //this.navToCarousel(oEvent.getSource());
                //this.navToContainer(oEvent.getSource());

                this.navTo( sRouteName, undefined, false );
            },

            onNotification: function ( oEvent ) {
                if ( !this._oMessagePopover ) {
                    var aMockMessages = [{
                        type:        'Error',
                        title:       'Import Abbruch',
                        description: 'Aus einem unbenaknnten Grund konnten die Stammdaten nicht importiert werden!'
                    }, {
                        type:        'Warning',
                        title:       '1 Neuer Benutzer',
                        description: 'Aktuell muss noch ein neuer Benutzer freigeschaltet werdeb!'
                    }, {
                        type:        'Success',
                        title:       'Delta Import',
                        description: 'Der delta Import wurde am 03.01.2015 um 10:12:23 abgeschlossen'
                    }, {
                        type:        'Information',
                        title:       'Neue Artikel',
                        description: 'Es gibt wieder neue, frische Werbeartikel'
                    }];
                    var oModel = new sap.ui.model.json.JSONModel();
                    oModel.setData( aMockMessages );

                    var oMessageTemplate = new sap.m.MessagePopoverItem( {
                        type:        '{type}',
                        title:       '{title}',
                        description: '{description}'
                    } );

                    this._oMessagePopover = new sap.m.MessagePopover( {
                        items: {
                            path:     '/',
                            template: oMessageTemplate
                        }
                    } );

                    this._oMessagePopover.setModel( oModel );
                }

                //alert("isCordova = " + this.isCordova());

                this._oMessagePopover.openBy( oEvent.getSource() );
            },

            getNavContainer: function () {
                return this.getView().byId( "navContainer" );
            },

            getShell: function () {
                return this.getView().byId( "shell" );
            },

            navToComponent: function ( oConfiguration ) {
                var sComponentId = oConfiguration.componentName,
                    oComponent = this.getComponent(
                        sComponentId,
                        {
                            width:    "100%",
                            height:   "100%",
                            name:     oConfiguration.componentName,
                            url:      oConfiguration.componentUrl,
                            settings: oConfiguration.componentSettings
                        }
                    );

                var oNavContainer = this.getNavContainer();
                oNavContainer.addPage( oComponent );
                oNavContainer.to( sComponentId );
            },

            navToContainer: function ( oItem, oData ) {
                var oContainer = this.getNavContainer(),
                    oConfig = (oItem) ? oItem.data( "configuration" ) : oData,
                    sViewId = oConfig.viewId || oConfig.componentName,
                    oPage = this.getNavContainerPage( sViewId );

                if ( !oPage ) {
                    var iIdx = oConfig.idx || 99,
                        sViewName = oConfig.viewName;

                    if ( sViewName ) {
                        // add view
                        oPage = sap.ui.xmlview( sViewId, {
                            viewName: sViewName
                        } );
                        oContainer.insertPage( oPage, iIdx );
                    } else {
                        // add component
                        var sComponentName = oConfig.componentName;
                        if ( sComponentName ) {
                            oPage = this.getComponent(
                                sViewId,
                                {
                                    width:    "100%",
                                    height:   "100%",
                                    name:     sComponentName,
                                    settings: oConfig.componentSettings
                                }
                            );
                        }
                        oContainer.insertPage( oPage, iIdx );
                    }
                }

                if ( oPage ) {
                    oContainer.to( sViewId ); // .to(sPageId, sTransition, oData);
                    //this.getView().byId("headTitle").setText(oConfig.title);
                }
            },

            updateView: function () {
                /*
                 var oView = this.getView(),
                 oNavContainer = oView.byId("navContainer"),
                 oHomeContainer = oView.byId("homeContainer");
                 */

                // TODO : homeContainer load/set data

                // memorize that this function was executed at least once
                this._bIsViewUpdatedAtLeastOnce = true;
            },

            // ====== HANA Logout handling =========================================

            logout: function () {
                var that = this,
                    fnCallback = function ( sCSRFToken ) {
                        jQuery.ajax( {
                            url:        "/sap/hana/xs/formLogin/logout.xscfunc",
                            type:       "POST",
                            beforeSend: function ( xhr ) {
                                xhr.setRequestHeader( "X-CSRF-Token", sCSRFToken );
                            },
                            success:    function () {
                                //var oLayout = sap.ui.getCore().byId("shell");
                                var oLayout = that.getView().byId( "shell" );
                                //oLayout is the id of main layout. Change it accordingly
                                oLayout.destroy();
                                sap.ui.getCore().applyChanges();
                                jQuery( document.body ).html( "<span>Logged out successfully.</span>" );
                                window.location.reload();
                            }
                        } );
                    };
                this._getCSRFToken( fnCallback );
            },

            _getCSRFToken: function ( fnCallback ) {
                jQuery.ajax( {
                    url:        "/sap/hana/xs/formLogin/token.xsjs",
                    type:       "GET",
                    beforeSend: function ( xhr ) {
                        xhr.setRequestHeader( "X-CSRF-Token", "Fetch" );
                    },
                    success:    function ( data, textStatus, XMLHttpRequest ) {
                        var sCSRFToken = XMLHttpRequest.getResponseHeader(
                            "X-CSRF-Token"
                        );
                        fnCallback( sCSRFToken );
                    }
                } );
            },

            // ====== private ======================================================

            _toggleSettings: function ( bIsHome, bHidePane ) {
                var oView = this.getView(),
                    oShell = this.getShell();

                // show/hide pane
                if ( !bIsHome || bHidePane ) {
                    oShell.setShowPane( false );
                }

                // toggle shell visibilty mode on touch
                //this.getShell().setHeaderHiding(!bIsHome);
                if ( sap.ui.Device.system.phone ) {
                    oShell.setHeaderHiding( !bIsHome );
                }

                this._bIsHome = bIsHome;
            }

        } );

    }, /* bExport= */ true );