sap.ui.define( [
        "uniorg/ui/core/mvc/BaseController",
        "uniorg/ui/util/Formatter",
        "uniorg/ui/util/Type",
        "sap/m/MessageBox"
    ],
    function ( BaseController, Formatter, Type, MessageBox ) {
        "use strict";

        return BaseController.extend( "uniorg.ui.core.mvc.md.DetailController", {

            // ====== init =========================================================

            onInit: function ( mParameters ) {
                // apply config
                this._mParameters = jQuery.extend( {
                    sRouteName: "detail",
                    bIsCRUD:    false,    // if true, add ADD|DELETE|EDIT|SAVE actions
                    bEditable:  false,
                    mBindings:  {}
                }, mParameters );

                BaseController.prototype.onInit.apply( this, [this._mParameters] );

                if ( this.getParameter( "bIsCRUD" ) === true ) {
                    this.setParameter( "bEditable", true );
                }

                // init class members
                this._bCreate = false;
                this._bEdit = false;
                this._bIsValid = false;
                this._sTabKey = null;
                this._mValidationErrors = {};

                // attach global validation handling if editable
                var oCore = sap.ui.getCore();

                if ( this.getParameter( "bEditable" ) ) {
                    oCore.attachValidationSuccess( this.onValidationSuccess, this );
                    oCore.attachValidationError( this.onValidationError, this );
                }

                this.oInitialLoadFinishedDeferred = jQuery.Deferred();

                if ( sap.ui.Device.system.phone ) {
                    // don't wait for the master on a phone
                    this.oInitialLoadFinishedDeferred.resolve();
                } else {
                    //this.getView().setBusy(true);
                    this.getEventBus().subscribe(
                        "Master",
                        "InitialLoadFinished",
                        this.onMasterLoaded,
                        this
                    );
                }
            },

            // ====== event handling ===============================================

            onCancel: function () {
                var oView = this.getView(),
                    oModel = oView.getModel();

                // aKeys?	Array of keys that should be resetted. If no array is passed all changes will be resetted.
                oModel.resetChanges(); // (aKeys)
                //this._sTabKey = null;
                this._toggleButtonsAndView( false );
            },

            onEdit: function () {
                //Clone the data
                //this._oSupplier = jQuery.extend({}, this.getView().getModel().getData().SupplierCollection[0]);
                //this._sTabKey = null;
                this._toggleButtonsAndView( true );
            },

            onMasterLoaded: function ( sChannel, sEvent, oData ) {
                //console.log("Detail onMasterLoaded", sChannel, sEvent, oData);
                this.bindView( oData.oListItem.getBindingContext().getPath() );
                this.getView().setBusy( false );
                this.oInitialLoadFinishedDeferred.resolve();
            },

            onNavButtonPress: function () {
                //var oHistory = sap.ui.core.routing.History.getInstance();

                this.getRouter().navTo( "master" );

                /*
                 if (oHistory.getPreviousHash()) {
                 window.history.go(-1);
                 } else {
                 this.getRouter().myNavBack("home", {});
                 }
                 */
            },

            onNavBack: function () {
                // This is only relevant when running on phone devices
                this.getRouter().myNavBack( "main" );
            },

            onRouteMatched: function ( oEvent ) {
                /*
                 var sEventViewPath = oEvent.getParameter("config").viewPath,
                 sViewName = this.getView().getViewName();
                 */

                //if (sViewName.indexOf(sEventViewPath) !== -1) {
                //var oParameters = oEvent.getParameters();
                var mArguments = oEvent.getParameter( "arguments" );

                jQuery.when( this.oInitialLoadFinishedDeferred ).then( jQuery.proxy( function () {
                    // when detail navigation occurs, update the binding context
                    // /SalesOrderMessages(EcoSOHeaderID.ID=1,PosIdx=1)
                    //var sDetailPath = "/" + oParameters.arguments.detail; // /UmeUsers(ID)
                    if ( mArguments && mArguments.detail ) {
                        this.bindView( "/" + mArguments.detail );
                    }
                }, this ) );
                //}
            },

            onSave: function () {
                var bSuccess = this.save();

                // goto display mode
                if ( bSuccess ) {
                    this._toggleButtonsAndView( false );
                }
            },

            onTabBarSelect: function ( oEvent ) {
                var sTabKey = oEvent.getParameter( "selectedKey" );

                this._showFormFragment( this._bEdit, sTabKey );
                this._sTabKey = sTabKey;
            },

            /**************************************************************
             * Validation handling
             **************************************************************/

            onValidationSuccess: function ( oEvent ) {
                var oElement = oEvent.getParameter( "element" );

                if ( oElement.setValueState ) {
                    oElement.setValueState( sap.ui.core.ValueState.None );
                    delete this._mValidationErrors[oElement.getId()];
                }
            },

            onValidationError: function ( oEvent ) {
                var oElement = oEvent.getParameter( "element" );

                if ( oElement.setValueState ) {
                    oElement.setValueState( sap.ui.core.ValueState.Error );
                    this._mValidationErrors[oElement.getId()] = oElement;
                }
            },

            // ====== public =======================================================

            bindView: function ( sDetailPath ) {
                var that = this,
                    oView = this.getView(),
                    oModel = oView.getModel(),
                    oBindingConfig = this.getBindingConfig( "detail", "*" ),
                    bBindedView = false;

                // delete formerly created new entry
                if ( this._createEntryContext ) {
                    oModel.deleteCreatedEntry( this._createEntryContext );
                }

                var bCreateMode = (sDetailPath.indexOf( "(" ) === -1);
                if ( bCreateMode ) {
                    this._createEntryContext = oModel.createEntry( sDetailPath );
                    oView.unbindElement();
                    oView.setBindingContext( this._createEntryContext );
                    oView.getModel().setProperty( "ID", 1, this._createEntryContext );
                } else {
                    var sKey = sDetailPath.split( "(" )[1].split( ")" )[0],
                        aObjectKeys = [sKey];
                    jQuery.each( oBindingConfig, function ( sKey, oElement ) {
                        var oContainer = oView;

                        if ( sKey !== "VIEW" ) {
                            oContainer = oContainer.byId( sKey );
                        } else {
                            bBindedView = true;
                        }
                        if ( oContainer ) {
                            var oBindingInfo = oElement.bindingInfo;
                            var sObjectPath = jQuery.sap.formatMessage(
                                oBindingInfo.path,
                                aObjectKeys
                            );
                            oContainer.bindElement(
                                sObjectPath,
                                oElement.parameters || undefined
                            );
                        }
                    } );

                    // auto binding from route path
                    if ( !bBindedView ) {
                        oView.bindElement( sDetailPath );
                    }

                } // eof ELSE

            },

            fireDetailChanged: function ( sDetailPath ) {
                this.getEventBus().publish( "Detail", "Changed", {sDetailPath: sDetailPath} );
            },

            fireDetailNotFound: function () {
                this.getEventBus().publish( "Detail", "NotFound" );
            },

            modifyView: function () {
                var oView = this.getView(),
                    oPage = oView.byId( "page" ),
                    bIsCRUD = this.getParameter( "bIsCRUD" );

                // back nav handling
                /*
                 oPage.setShowNavButton(sap.ui.Device.system.phone);
                 oPage.attachNavButtonPress(this.onNavButtonPress.bind(this));
                 */
                //oPage.setShowHeader(sap.ui.Device.system.phone);

                // ACTION BAR
                var oActionBar = oView.byId( "actionBar" ),
                    iPosCounter = 0;

                // skip if no action bar
                if ( !bIsCRUD && !oActionBar ) {
                    return;
                }

                if ( !oActionBar ) {
                    oActionBar = new sap.m.Toolbar(
                        oView.createId( "actionBar" )
                    );
                }

                // spacer
                oActionBar.insertContent(
                    new sap.m.ToolbarSpacer(),
                    iPosCounter++
                );

                // HERE ARE CUSTOM ACTIONS PLACED!!!

                // add actions after custom action

                // edit button
                if ( this.getParameter( "bIsCRUD" ) ) {
                    oActionBar.addContent( new sap.m.Button(
                        oView.createId( "edit" ),
                        {
                            press:   this.onEdit.bind( this ),
                            text:    "{i18n>Edit}",
                            icon:    "sap-icon://edit",
                            visible: true
                        }
                    ).toggleStyleClass( "uoEditIcon", true ) );

                    oActionBar.addContent( new sap.m.Button(
                        oView.createId( "save" ),
                        {
                            press:   this.onSave.bind( this ),
                            text:    "{i18n>Save}",
                            icon:    "sap-icon://save",
                            visible: false
                        }
                    ).toggleStyleClass( "uoSaveIcon", true ) );

                    oActionBar.addContent( new sap.m.Button(
                        oView.createId( "cancel" ),
                        {
                            press:   this.onCancel.bind( this ),
                            text:    "{i18n>Cancel}",
                            icon:    "sap-icon://sys-cancel-2",
                            visible: false
                        }
                    ).toggleStyleClass( "uoCancelIcon", true ) );
                }


                oPage.setAggregation( "footer", oActionBar );

                // phone specific ux handling
                if ( sap.ui.Device.system.phone ) {
                    this.removeTabBarIcons( "iconTabBar" );
                }
            },

            save: function () {
                var oView = this.getView(),
                    oModel = oView.getModel();

                if ( this.validateInput( oView.byId( "iconTabBar" ) ) ) {
                    // manually submit UmeAccount changes on EXPAND nodes
                    var _bHasPendingChanges = oModel.hasPendingChanges();
                    if ( _bHasPendingChanges ) {
                        // manually update
                        var oBindingContext = oView.getBindingContext();
                        // update via submitChanges

                        oModel.attachRequestFailed( null, function ( oEvent ) {
                            console.log( "requestFailed", oEvent );
                        }, this );

                        oModel.attachMessageChange( null, function ( oEvent ) {
                            console.log( "messageChange", oEvent );
                        }, this );

                        //var sBatchGroupId = { batchGroupId : "Ume" };
                        oModel.submitChanges( {
                            //batchGroupId : sBatchGroupId,
                            success: function ( oData ) {
                                console.log( "submitChangesSuccess", oData );
                            },
                            error:   function ( oError ) {
                                console.log( "submitChangesError", oError );
                            }
                            //eTag : ""
                        } );
                        console.log( "saveModel", oModel );
                    } else {
                        console.log( "no pending changes..." );
                    }
                } else {
                    jQuery.each( this._mValidationErrors, function ( sKey, oElement ) {
                        console.log( sKey, oElement );
                        var oLabelId = oElement.getIdForLabel();
                        /*
                         oLabel = (oLabelId)
                         ? oView.byId(oLabelId).getText()
                         : oElement.getId();
                         */
                        console.log( "getPlaceholder", oElement.getPlaceholder() );
                        console.log( "getValueStateText", oElement.getValueStateText() ); // Pflichtfeld
                        oElement.openValueStateMessage();
                    } );

                    // handle validation errors
                    //sap.ui.getCore().byId("registrationDialog").refreshStyleClass("rumble");

                    MessageBox.show(
                        "Haben Sie für alle Pflichtfelder (*) eine Eingabe gemacht? Klicken Sie die rot markierten Felder an, um weitere Informationen zum Fehler zu bekommen.",
                        sap.m.MessageBox.Icon.ERROR,
                        "{i18n>VALIDATION_ERROR}",
                        [sap.m.MessageBox.Action.OK]
                    );
                }
            },

            showEmptyView: function () {
                this.getRouter().myNavToWithoutHash( {
                    currentView:    this.getView(),
                    targetViewName: "uniorg.ui.core.mvc.view.NotFound"
                } );
            },

            updateView: function () {
                this._toggleButtonsAndView( this._bEdit ); // display mode (default)
            },

            // ====== private ======================================================

            _showFormFragment: function ( bEdit, sTabKey ) {
                bEdit = bEdit || false;
                sTabKey = sTabKey || "Default";

                if ( this._bEdit !== bEdit || this._sTabKey !== sTabKey ) {
                    var oView = this.getView(),
                        oTab = oView.byId( "tab" + sTabKey );

                    if ( oTab ) {
                        var bTabLazyLoad = oTab.data( "lazyLoad" ),
                            bTabEditable = oTab.data( "editable" );

                        if ( bTabLazyLoad ) {
                            var sFragmentMode = (bEdit && bTabEditable) ?
                                                "Change" : "Display",
                                sFragment = "tab." + sTabKey + sFragmentMode;

                            oTab.removeAllContent();
                            oTab.insertContent( this.getFragment( sFragment ) );

                            // call tab function callback (if exists)
                            var sTabFn = "onTab" + sTabKey + "Change";
                            if ( typeof this[sTabFn] !== "undefined" ) {
                                this[sTabFn]( this.getFragment( sFragment ) );
                            }
                        }
                    }
                }
            },

            _toggleButtonsAndView: function ( bEdit ) {
                var oView = this.getView();

                if ( this.getParameter( "bEditable" ) ) {
                    // Show the appropriate action buttons
                    oView.byId( "edit" ).setVisible( !bEdit );
                    oView.byId( "save" ).setVisible( bEdit );
                    oView.byId( "cancel" ).setVisible( bEdit );
                }

                // Set the right form type
                this._showFormFragment( bEdit, this._sTabKey );

                this._bEdit = bEdit;
            }

        } );

    }, /* bExport= */ true );