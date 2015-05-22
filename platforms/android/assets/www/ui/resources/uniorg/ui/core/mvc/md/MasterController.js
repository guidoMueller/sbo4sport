sap.ui.define( [
        "uniorg/ui/core/mvc/BaseController",
        "uniorg/ui/util/Formatter",
        "uniorg/ui/util/Type"
    ],
    function ( BaseController ) {
        "use strict";

        return BaseController.extend( "uniorg.ui.core.mvc.md.MasterController", {

            onInit: function ( mParameters ) {
                // apply config
                this._mParameters = jQuery.extend( {
                    sRouteName:          "master",
                    bIsCRUD:             false,            // if true, add ADD|DELETE actions
                    bIsFilterSearch:     true,     // use filter or fulltext search
                    bIsMultiSelect:      false,     // toggle list select mode
                    bShowListSeperators: true  // show list separators
                }, mParameters );

                BaseController.prototype.onInit.apply( this, [this._mParameters] );

                // init class members
                this._bInitialLoadFinished = false;
                this._bIsMultiSelect = false;   // toggle list select mode
                this._oVSDialog = null;         // set on demand
                this._oMenuFilter = null;
                this._sInfoToolbarLabel = "";
                this._sInfoToolbarText = "";

                // shortcuts
                var oView = this.getView(),
                    oEventBus = this.getEventBus();

                // clone list item template to be reused for list binding
                this._oListItemTemplate = oView.byId( "listItemTemplate" ).clone();

                // update the master list object counter after new data is loaded
                this._oList = oView.byId( "list" );
                this.oInitialLoadFinishedDeferred = jQuery.Deferred();
                this._oList.attachEvent( "updateFinished", function () { // attachEventOnce
                    if ( !this._bInitialLoadFinished ) {
                        // do onetime on updateFinished
                        this.oInitialLoadFinishedDeferred.resolve();
                        oEventBus.publish( "Master", "InitialLoadFinished", {
                            oListItem: this.getFirstItem()
                        } );
                        this._bInitialLoadFinished = true;
                        //var oListSelector = this.getOwnerComponent().oListSelector;
                        //this.getOwnerComponent().oListSelector.setBoundMasterList(this.oList);
                        //this.getRouter().getRoute("main").attachPatternMatched(oListSelector.selectAndScrollToFirstItem, oListSelector);
                    }
                    // do always on updateFinished
                    this._updateListItemCount();
                }, this );

                //this.getRouter().attachBypassed(this.onBypassed, this);
                // remove selections on bypassed

                // subscribe to component events
                oEventBus.subscribe( "Menu", "ApplyFilter", this.onMenuFilter, this );
                oEventBus.subscribe( "Action", "CreateEntry", this.onActionCreateEntry, this );

                // on phones, we will not have to select anything in the list so we don't need to attach to events
                if ( sap.ui.Device.system.phone ) {
                    return;
                }
                oEventBus.subscribe( "Detail", "Changed", this.onDetailChanged, this );
                oEventBus.subscribe( "Detail", "NotFound", this.onNotFound, this );
            },

            // ====== event handling ===============================================

            onAdd: function ( oEvent ) {
                console.log( "add new item..." );
                this.getEventBus().publish( "Action", "CreateEntry", {} );
            },

            onActionCreateEntry: function ( sChanel, sEvent, oData ) {
                this.showDetail( null, true );
            },

            /**
             * Event handler for the bypassed event, which is fired when no routing pattern matched.
             * If there was an object selected in the master list, that selection is removed.
             *
             * @param {sap.ui.base.Event} oEvent the bypassed event
             * @public
             */
            onBypassed: function ( oEvent ) {
                //this._oList.removeSelections(true);
            },

            onDelete: function ( oEvent ) {
                var aItems = this._getListSelectedItems();

                if ( aItems.length > 0 ) {
                    var oModel = this.getView().getModel();
                    // CONFIRM Sicherheitsabfrage
                    for ( var i = 0; i < aItems.length; i++ ) {
                        var oBindingContext = aItems[i].getBindingContext();
                        oModel.remove( oBindingContext.getPath(), {
                            success: function () {
                                console.log( "deleted successfully" );
                            },
                            error:   function ( oEvent ) {
                                console.log( "delete error" );
                            }
                        } );
                    }
                }
            },

            onDetailChanged: function ( sChanel, sEvent, oData ) {
                //console.log("Master onDetailChanged", sChanel, sEvent, oData);
                var sDetailPath = oData.sDetailPath;

                //Wait for the list to be loaded once
                this.waitForInitialListLoading( function () {
                    var oList = this.getView().byId( "list" ),
                        oSelectedItem = oList.getSelectedItem();

                    // the correct item is already selected
                    if ( oSelectedItem && oSelectedItem.getBindingContext().getPath() === sDetailPath ) {
                        return;
                    }

                    var aItems = oList.getItems();
                    for ( var i = 0; i < aItems.length; i++ ) {
                        var oBindingContext = aItems[i].getBindingContext();
                        if ( oBindingContext && oBindingContext.getPath() === sDetailPath ) {
                            oList.setSelectedItem( aItems[i], true );
                            break;
                        }
                    }
                } );
            },

            onMasterModeToggle: function ( oEvent ) {
                var oSplitApp = this.getRouter()._oSplitContainer;

                oSplitApp.hideMaster();
                oSplitApp.setMode( sap.m.SplitAppMode.HideMode );
            },

            onMenu: function ( oEvent ) {
                if ( !this._oMenu ) {
                    this._oMenu = this.getFragment( "fragment.Menu" );
                }
                //this._oMenu.openBy(oEvent.getParameter("domRef"));
                this._oMenu.openBy( oEvent.getSource() );
            },

            onMenuSelect: function ( oEvent ) {
                var oListItem = oEvent.getParameter( "listItem" );
                this._oMenuFilter = {
                    key:    oListItem.data( "key" ),
                    filter: oListItem.data( "filter" ),
                    title:  oListItem.getProperty( "title" )
                };
                this._oMenu.close();
                this.updateView();
            },


            onMultiSelectToggle: function () {
                this._bIsMultiSelect = !this._bIsMultiSelect;

                // toggle list mode
                this._oList.setMode(
                    (this._bIsMultiSelect) ? "MultiSelect" : "SingleSelectMaster"
                );
                // change icon
                var oButton = this.getView().byId( "multiSelect" );
                oButton.setIcon( "sap-icon://" +
                    ((this._bIsMultiSelect) ? "sys-cancel-2" : "multi-select")
                );
                // change icon color
                oButton.toggleStyleClass( "uoCancelIcon", this._bIsMultiSelect );

                // set selected list item
                if ( this._bIsMultiSelect ) {
                    this._oSelectedListItem = this._oList.getSelectedItem();
                } else {
                    this._oList.setSelectedItem( this._oSelectedListItem );
                }

                this._updateFilterBarDisplay();
            },

            onNavButton: function () {
                this.navTo( "menu" );
            },

            onNotFound: function () {
                this.getView().byId( "list" ).removeSelections();
            },

            onPrint: function ( oEvent ) {
                console.log( "delete..." );
            },

            onQuickFilterChange: function ( oEvent ) {
                this.updateView();
            },

            onRouteMatched: function ( oEvent ) {
                // on phones, we will not have to select anything in the list so we don't need to attach to events
                if ( sap.ui.Device.system.phone ) {
                    return;
                }

                // Load the detail view in desktop
                this.getRouter().myNavToWithoutHash( {
                    currentView:    this.getView(),
                    targetViewName: "Detail"
                } );

                // Wait for the list to be loaded once
                this.waitForInitialListLoading( function () {
                    // On the empty hash select the first item
                    this.selectFirstItem();
                } );
            },

            onRefresh: function () {
                var that = this,
                    oList = this._oList;

                if ( sap.ui.Device.support.touch ) {
                    // trigger search again and hide pullToRefresh when data ready
                    var fnHandler = function () {
                        that.getView().byId( "pullToRefresh" ).hide();
                        oList.detachUpdateFinished( fnHandler );
                    };
                    oList.attachUpdateFinished( fnHandler );
                }
                this.updateView();
            },

            onSearch: function ( oEvent ) {
                //var bRefresh = oEvent.getParameter("refreshButtonPressed");
                this.updateView();
            },

            onSelectionChange: function ( oEvent ) {
                // Get the list item, either from the listItem parameter or from the event's
                // source itself (will depend on the device-dependent mode).
                if ( !this._bIsMultiSelect ) {
                    this.showDetail( oEvent.getParameter( "listItem" ) || oEvent.getSource() );
                }
                this._updateFilterBarDisplay();
            },

            // ====== public =======================================================

            getFirstItem: function ( bReturnUnselectable ) {
                var oList = this.getView().byId( "list" ),
                    aItems = oList.getItems();

                for ( var i = 0; i < aItems.length; i++ ) {
                    var oObject = aItems[i];
                    if ( oObject.isSelectable() || bReturnUnselectable ) {
                        return oObject;
                    }
                }
                return null; // no list item found
            },

            /**
             * Function is called to return binding specific search filters
             * if searchMode is facet
             *
             * @param {string} sQuery the search query
             * @private
             * @return {array} [aFilters] predefined filter/s (can be either a filter or an array of filters)
             *
             * var aFilters = [];
             * aFilters.push(new sap.ui.model.Filter(
             *      "ID", "Contains", sQuery)
             * );
             * return aFilters;
             *
             */
            getSearchFilters: function ( sQuery ) {
                jQuery.sap.log.error( "Implement binding specific search filters", sQuery );
                return;
            },

            /**
             * Function is called to return binding specific default sorters
             *
             * @private
             * @return {array} [aSorters] predefined sorter/s (can be either a sorter or an array of sorters)
             *
             * var aSorters = [];
             * aSorters.push(new sap.ui.model.Sorter("ID", false));
             * return aSorters;
             *
             */
            getDefaultSorters: function () {
                jQuery.sap.log.error( "Implement binding specific default sorters" );
                return;
            },

            isMultiSelect: function () {
                //return this.getView().byId("multiSelect").getPressed();
                return this._bIsMultiSelect;
            },

            modifyView: function () {
                var oView = this.getView(),
                    oPage = oView.byId( "page" ),
                    oList = oView.byId( "list" ),
                    bHasOverflow = (sap.ui.version === "1.28.2"),
                    sButtonClass = (bHasOverflow) ? "OverflowToolbarButton" : "Button";

                // CONTENT AGGREGATION

                // CUSTOM HEADER
                var oCustomHeader = oPage.getCustomHeader(),
                    oHeaderBar = null,
                    iPosCounter = 0;
                if ( !oCustomHeader ) {
                    oHeaderBar = new sap.m.Toolbar(
                        oView.createId( "headerBar" )
                    );
                    oPage.setCustomHeader( oHeaderBar );
                } else {
                    oHeaderBar = oCustomHeader.getContent();
                    // TEST if ok???
                }

                oHeaderBar.insertContent( new sap.m.Button(
                    oView.createId( "masterTitle" ),
                    {
                        press:            this.onMenu.bind( this ),
                        text:             "Benutzer",
                        icon:             "sap-icon://slim-arrow-down",
                        iconFirst:        false,
                        iconDensityAware: false,
                        type:             "Transparent"
                    }
                ), iPosCounter++ );

                oHeaderBar.insertContent(
                    new sap.m.ToolbarSpacer(),
                    iPosCounter++
                );

                oHeaderBar.insertContent( new sap.m.ToggleButton(
                    oView.createId( "masterMode" ),
                    {
                        press:   this.onMasterModeToggle.bind( this ),
                        pressed: true,
                        //tooltip : this.i18n("Toggle"),
                        icon:    "sap-icon://detail-view"
                    }
                ), iPosCounter++ );


                // search bar
                var oSearchBar = new sap.m.Bar(
                    oView.createId( "searchBar" ),
                    {
                        contentMiddle: new sap.m.SearchField(
                            oView.createId( "searchField" ),
                            {
                                width:             "100%",
                                showRefreshButton: !sap.ui.Device.system.phone,
                                placeholder:       "Search",
                                search:            this.onSearch.bind( this ),
                                liveChange:        this.onSearch.bind( this )
                            }
                        )
                    }
                );
                oPage.setSubHeader( oSearchBar );

                // LIST
                oList.attachSelectionChange( this.onSelectionChange.bind( this ) );
                oList.setMode( "SingleSelectMaster" );
                oList.setNoDataText( this.getText( "masterListNoDataText" ) );
                oList.setGrowing( true );
                oList.setGrowingThreshold( 50 );
                oList.setGrowingScrollToLoad( true );
                oList.setIncludeItemInSelection( true );

                if ( !this.getParameter( "bShowListSeperators" ) ) {
                    oList.setShowSeparators( "None" );
                }

                // add infoToolbar
                var oInfoToolbar = new sap.m.Toolbar(
                    oView.createId( "infoToolbar" ),
                    {
                        content: [
                            new sap.m.Label(
                                oView.createId( "infoToolbarLabel" ),
                                {visible: true}
                            ),
                            new sap.m.Text(
                                oView.createId( "infoToolbarText" )
                            )
                        ]
                    }
                );
                oList.setInfoToolbar( oInfoToolbar );

                // ACTION BAR
                var oActionBar = oView.byId( "actionBar" );
                //iPosCounter = 0;
                iPosCounter = 0;
                if ( !oActionBar ) {
                    // 1.28
                    if ( bHasOverflow ) {
                        oActionBar = new sap.m.OverflowToolbar(
                            oView.createId( "actionBar" )
                        );
                    } else {
                        oActionBar = new sap.m.Toolbar(
                            oView.createId( "actionBar" )
                        );
                    }
                }

                // multi select button
                oActionBar.insertContent( new sap.m.Button(
                    oView.createId( "multiSelect" ),
                    {
                        press:   this.onMultiSelectToggle.bind( this ),
                        tooltip: "{i18n>MultiSelect}",
                        icon:    "sap-icon://multi-select"
                    }
                ), iPosCounter++ );

                // menu botton
                oActionBar.insertContent(
                    new sap.m.ToolbarSpacer(),
                    iPosCounter++
                );

                // add actions after custom action

                // add button
                if ( this.getParameter( "bIsCRUD" ) ) {
                    oActionBar.insertContent( new sap.m.Button(
                        {
                            press:   this.onAdd.bind( this ),
                            tooltip: "{i18n>Add}",
                            icon:    "sap-icon://add"
                        }
                    ), iPosCounter++ );
                }
                if ( this.getParameter( "bIsCRUD" ) ) {
                    oActionBar.addContent( new sap.m[sButtonClass](
                        {
                            press: this.onDelete.bind( this ),
                            text:  "{i18n>Delete}",
                            icon:  "sap-icon://delete"
                        }
                    ) );
                }

                // EOF ACTION BAR

                // device specific handling (Touch/NonTouch=Desktop)
                if ( sap.ui.Device.support.touch ) {
                    // add pull to refresh
                    var oPullToRefresh = new sap.m.PullToRefresh(
                        oView.createId( "pullToRefresh" ),
                        {
                            visible: sap.ui.Device.support.touch,
                            refresh: this.onRefresh.bind( this )
                        }
                    );
                    oPage.insertAggregation( "content", oPullToRefresh, 0 );

                    // move the search bar below the pullToRefresh on touch devices
                    //var oBar = oView.byId("searchBar");
                    //oPage.insertAggregation("content", oBar, 1);

                    // swipe actions
                    var oSwipeButton = new sap.m.Button(
                        oView.createId( "swipeButton" ),
                        {
                            icon:       "sap-icon://action",
                            type:       "Emphasized",
                            press:      this.onShowActions.bind( this ),
                            customData: [{
                                key:   "placement",
                                value: "Left"
                            }]
                        }
                    );
                    oList.setSwipeContent( oSwipeButton );
                }

                // touch specific ux handling
                //if (sap.ui.Device.system.phone) {
                /*
                 if (sap.ui.Device.support.touch) {
                 oPage.setAggregation("footer", oActionBar);
                 } else {
                 // move the action bar to top on non touch devices (Desktop)
                 oPage.setAggregation("customHeader", oActionBar);
                 }
                 */
                oPage.setAggregation( "footer", oActionBar );

                // phone specific ux handling
                if ( sap.ui.Device.system.phone ) {
                    // change nav button icon to menu
                    var oNavButton = oView.byId( "page-navButton" );
                    oNavButton.setType( "Default" );
                    oNavButton.setIcon( "sap-icon://menu2" );
                }
            },

            selectDetail: function () {
                //if ( !sap.ui.Device.system.phone ) {
                this.showDetail( this.selectFirstItem() );
                //}
            },

            selectFirstItem: function ( bAlways ) {
                var oList = this.getView().byId( "list" ),
                    aItems = oList.getItems();

                if ( aItems.length > 0 && (!oList.getSelectedItem() || bAlways) ) {
                    var oItem = this.getFirstItem();
                    if ( oItem ) {
                        oList.setSelectedItem( oItem, true );
                        return oItem;
                    }
                }
                return null;
            },

            /**
             * Shows the selected item on the detail page
             * On phones a additional history entry is created
             *
             * @private
             * @param {object} oItem - The selected list item
             * @return {undefined} nothing
             */
            showDetail: function ( oItem ) {
                var sBindingPath = (oItem) ?
                                   oItem.getBindingContext().getPath() :
                                   this._getBindingCreatePath();

                var oRouteConfig = {
                    from:   "master",
                    detail: sBindingPath.substr( 1 )
                };

                this.navTo( "detail", {} );
            },

            updateView: function () {
                /*
                 if (!this._oViewSettings) {
                 // init the view settings
                 this._initViewSettings();
                 }
                 */

                // update the master list binding
                this._updateListBinding();

                // update the filter bar
                this._updateFilterBarDisplay();

                // update title
                this._updateListItemCount();

                // memorize that this function was executed at least once
                this._bIsViewUpdatedAtLeastOnce = true;
            },

            waitForInitialListLoading: function ( fnToExecute ) {
                jQuery.when( this.oInitialLoadFinishedDeferred ).then( jQuery.proxy( fnToExecute, this ) );
            },

            // ====== private ======================================================

            _getBindingCreatePath: function () {
                var oBindingConfig = this.getBindingConfig( "detail", "VIEW" ),
                    sPath = (oBindingConfig.path) ? oBindingConfig.path : "",
                    iPos = sPath.lastIndexOf( "(" );

                return (iPos !== -1) ? sPath.substr( 0, iPos ) : null;
            },

            _getListSelectedItems: function () {
                return this.getView().byId( "list" ).getSelectedItems();
            },

            _updateFilterBarDisplay: function () {
                var oView = this.getView(),
                    oList = this._oList,
                    aContexts = oList.getSelectedContexts( true ),
                    sInfoToolbarText = this._sInfoToolbarText;

                // selected message (if no filter text)
                if ( this.isMultiSelect() ) {
                    var bSelected = (aContexts && aContexts.length > 0);
                    if ( bSelected ) {
                        if ( sInfoToolbarText.length > 0 ) {
                            sInfoToolbarText += ", ";
                        }
                        sInfoToolbarText += aContexts.length + " " +
                        this.getText( "selected" );
                    }
                }

                // update view
                //oView.byId("infoToolbar").setVisible(sFilterInfo.length > 0);
                oView.byId( "infoToolbarLabel" ).setText( this._sInfoToolbarLabel );
                oView.byId( "infoToolbarText" ).setText( sInfoToolbarText );
            },

            _updateListBinding: function () {
                var oView = this.getView(),
                    oSearchField = oView.byId( "searchField" ),
                    isFilterSearch = this.getParameter( "bIsFilterSearch" ),
                    oList = this._oList,
                    aFilters = [],
                    aSorters = [];

                // reset filter info
                this._sInfoToolbarText = "";

                // add search filters
                var sQuery = oSearchField.getValue();
                if ( sQuery ) {
                    if ( this.getParameter( "bIsFilterSearch" ) ) {
                        var oSearchFilters = this.getSearchFilters( sQuery );
                        if ( oSearchFilters ) {
                            // build filter OR join
                            aFilters.push( new sap.ui.model.Filter( oSearchFilters, false ) );
                        }
                    } // ELSE -> sQuery will be added as $search=sQuery in binding config
                }

                // apply menu filter
                var sInfoToolbarLabel = this.getText( "filterAll" ),
                    oMenuFilter = this._oMenuFilter;

                if ( oMenuFilter ) {
                    var sFilter = oMenuFilter.filter;
                    if ( sFilter.length > 0 ) {
                        var aFltSplit = sFilter.split( "___" );
                        aFilters.push( new sap.ui.model.Filter(
                            aFltSplit[0], aFltSplit[1], aFltSplit[2], aFltSplit[3]
                        ) );
                    }
                    // set infoToolbarLabel
                    sInfoToolbarLabel = oMenuFilter.title;
                }
                this._sInfoToolbarLabel = sInfoToolbarLabel;

                // add sorters
                aSorters = this.getDefaultSorters();

                var oBindingInfo = this.getBindingConfig( null, "LIST", (isFilterSearch) ?
                                                                        "bindingInfo" : "bindingInfoSearch"
                );

                var oBindingConfig = jQuery.extend( true, {
                    filters:  aFilters,
                    sorter:   aSorters,
                    Xevents:  {
                        dataReceived: function ( oEvent ) {
                            jQuery.sap.log.error(
                                "masterDataReceived",
                                oEvent,
                                oEvent.mParameters.data["@com.sap.vocabularies.Search.v1.Facets"]
                                /* no this!
                                 (this.getParameter("bIsFilterSearch"))
                                 ? oEvent.mParameters.data["@com.sap.vocabularies.Search.v1.Facets"]
                                 : ""
                                 */
                            );
                            //helper.fillFacets(evt.mParameters.data["@com.sap.vocabularies.Search.v1.Facets"], that.getView(), that.getCheckedFacets());
                        }
                    },
                    template: this._oListItemTemplate
                }, oBindingInfo );

                // add fulltext search
                if ( !isFilterSearch ) {
                    if ( sQuery.length > 0 ) {
                        /*
                         oBindingConfig.parameters.custom = {
                         facets: "all",
                         search: sQuery
                         };
                         */
                        oBindingConfig.parameters.custom.search = sQuery;
                        delete oBindingConfig.sorter;
                    } else {
                        //delete oBindingConfig.parameters["custom"];
                        delete oBindingConfig.parameters.custom;
                    }
                }
                oList.bindAggregation( "items", oBindingConfig );

            }, // eof _updateListBinding

            _updateListItemCount: function () {
                // only update the counter if the length is final
                if ( this._oList.getBinding( "items" ) !== undefined && this._oList.getBinding( "items" ).isLengthFinal() ) {
                    var iItems = this._oList.getBinding( "items" ).getLength(),
                    //sTitle = this.getText("masterTitleCount", iItems.toString());
                        sTitle = this.getText( this._sInfoToolbarLabel + " ({0})", iItems.toString() );

                    this.getView().byId( "page" ).setTitle( sTitle );
                    this.getView().byId( "masterTitle" ).setText( sTitle );
                }
            }

        } );

    }, /* bExport= */ true );