sap.ui.define( [
        "uniorg/ui/core/mvc/BaseController"
    ],
    function ( BaseController ) {
        "use strict";

        return BaseController.extend( "uniorg.ui.core.mvc.md.view.Menu", {

            onInit: function ( mParameters ) {
                // apply config
                this._mParameters = jQuery.extend( {
                    sRouteName: "menu"
                }, mParameters );

                BaseController.prototype.onInit.apply( this, [this._mParameters] );
            },

            // ====== event handling ===============================================

            onHome: function () {
                this.navTo( "master" );
            },

            onItemPress: function ( oEvent ) {
                var oListItem = oEvent.getParameter( "listItem" ),
                    sFilter = oListItem.data( "filter" );

                // check if list item is filter
                if ( sFilter !== null ) {
                    this.getEventBus().publish( "Menu", "ApplyFilter", {
                        key:    oListItem.data( "key" ),
                        filter: oListItem.data( "filter" ),
                        title:  oListItem.getProperty( "title" )
                    } );

                    this.navTo( "master", {
                        filterKey: oListItem.data( "key" )
                    } );
                }
            },

            // ====== public =======================================================

            modifyView: function () {
                var oView = this.getView(),
                    oPage = oView.byId( "page" ),
                    oList = oView.byId( "list" );

                // LIST
                oList.attachItemPress( this.onItemPress.bind( this ) );
                //oList.attachSelectionChange(this.onSelectionChange.bind(this));
                oList.setMode( "SingleSelectMaster" );
                oList.setIncludeItemInSelection( true );

                // ACTION BAR
                var oActionBar = oView.byId( "actionBar" );
                if ( !oActionBar ) {
                    oActionBar = new sap.m.Toolbar(
                        oView.createId( "actionBar" )
                    );
                }

                oActionBar.addContent( new sap.m.Button(
                    {
                        press:   this.onHome.bind( this ),
                        tooltip: "{i18n>Home}",
                        icon:    "sap-icon://home"
                    }
                ) );

                oActionBar.addContent( new sap.m.Label(
                    oView.createId( "masterTitle" ),
                    {
                        text:    "{i18n>menuTitle}",
                        visible: !sap.ui.Device.system.phone
                    }
                ) );

                // device specific phone ux handling
                if ( sap.ui.Device.system.phone ) {
                    // change nav button icon to menu
                    var oNavButton = oView.byId( "page-navButton" );
                    oNavButton.setType( "Default" );
                    oNavButton.setIcon( "sap-icon://list" );
                } else {
                    // move the action bar to top on non touch devices (Desktop)
                    oPage.setAggregation( "customHeader", oActionBar );
                }
            }

        } );

    }, /* bExport= */ true );