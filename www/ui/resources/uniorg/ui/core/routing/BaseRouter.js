sap.ui.define( [
        "sap/ui/core/routing/Router",
        "sap/m/routing/RouteMatchedHandler"
    ],
    function ( Router, RouteMatchedHandler ) {
        "use strict";

        return Router.extend( "uniorg.ui.core.routing.BaseRouter", {

            constructor: function ( aRoutes, oRoutingConfig, oComponent ) {
                if ( oComponent._mRootSettings &&
                    oComponent._mRootSettings.launchPadId &&
                    oComponent._mRootSettings.launchPadId !== ""
                ) {
                    aRoutes = this.prefixRoutes( aRoutes, oComponent._mRootSettings.launchPadId );
                }
                Router.apply( this, [aRoutes, oRoutingConfig, oComponent] );
                this._oRouteMatchedHandler = new RouteMatchedHandler( this );
            },

            destroy: function () {
                Router.prototype.destroy.apply( this, arguments );
                this._oRouteMatchedHandler.destroy();
            },

            // ====== public =======================================================

            myNavBack: function ( sRoute, mData ) {
                var oHistory = sap.ui.core.routing.History.getInstance(),
                    sPreviousHash = oHistory.getPreviousHash();

                // The history contains a previous entry
                if ( sPreviousHash !== undefined ) {
                    window.history.go( -1 );
                } else {
                    var bReplace = true; // otherwise we go backwards with a forward history
                    this.navTo( sRoute, mData, bReplace );
                }
            },

            /**
             * Changes the view without changing the hash
             *
             * @param {object} oOptions must have the following properties
             * <ul>
             *   <li> currentView : the view you start the navigation from.</li>
             *   <li> targetViewName : relative of fully qualified name of the view you want to navigate to.</li>
             *   <li> targetViewType : the viewtype eg: XML</li>
             *   <li> isMaster : default is false, true if the view should be put in the master</li>
             *   <li> transition : default is "show", the navigation transition</li>
             *   <li> data : the data passed to the navContainers livecycle events</li>
             * </ul>
             * @returns {undefined} undefined
             * @public
             */
            myNavToWithoutHash: function ( oOptions ) {
                var oSplitApp = (this._oSplitContainer) ?
                                this._oSplitContainer : this._findSplitApp( oOptions.currentView );

                // Load view, add it to the page aggregation, and navigate to it
                if ( !oOptions.targetViewType ) {
                    oOptions.targetViewType = "XML";
                }

                // check absolute or relative view name
                if ( oOptions.targetViewName.indexOf( "." ) === -1 ) {
                    var sViewName = oOptions.currentView.getViewName(),
                        iPos = sViewName.lastIndexOf( "." );
                    oOptions.targetViewName = sViewName.substr( 0, iPos + 1 ) +
                    oOptions.targetViewName;
                }
                var oView = this.getView( oOptions.targetViewName, oOptions.targetViewType );
                oSplitApp.addPage( oView, oOptions.isMaster );
                oSplitApp.to( oView.getId(), oOptions.transition || "show", oOptions.data );
            },

            /**
             *
             * @param aRoutes
             * @param sPrefx
             */
            prefixRoutes: function ( aRoutes, sPrefix ) {
                return aRoutes.map( function ( oRoute ) {
                    oRoute.pattern = sPrefix + "/" + oRoute.pattern;
                    if ( oRoute.subroutes ) {
                        oRoute.subroutes = this.prefixRoutes( oRoute.subroutes, sPrefix );
                    }
                    return oRoute;
                }.bind( this ) );
            },

            backWithoutHash: function ( oCurrentView, bIsMaster ) {
                var sBackMethod = bIsMaster ? "backMaster" : "backDetail";
                this._findSplitApp( oCurrentView )[sBackMethod]();
            },

            // ====== private =======================================================

            _findSplitApp: function ( oControl ) {
                var sAncestorControlName = "idAppControl";

                if ( !oControl ) {
                    oControl = this.getAggregation( "rootControl" );
                }

                if ( oControl instanceof sap.ui.core.mvc.View &&
                    oControl.byId( sAncestorControlName ) ) {
                    return oControl.byId( sAncestorControlName );
                }

                return oControl.getParent() ?
                       this._findSplitApp( oControl.getParent(), sAncestorControlName )
                    : null;
            }

        } );

    }, /* bExport= */ true );