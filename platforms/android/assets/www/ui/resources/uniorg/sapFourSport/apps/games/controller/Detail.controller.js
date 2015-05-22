sap.ui.define( [
        "uniorg/ui/core/mvc/md/DetailController",
        "uniorg/sapFourSport/util/Formatter"
    ],
    function ( DetailController, Formatter ) {
        "use strict";

        return DetailController.extend( "uniorg.sapFourSport.apps.games.controller.Detail", {

            onInit: function () {
                var mParameters = {};

                DetailController.prototype.onInit.apply( this, [mParameters] );
                var sPath = jQuery.sap.getModulePath( "uniorg.sapFourSport.apps.games.model", "/Games.json" );
                var sPathLeagues = jQuery.sap.getModulePath( "uniorg.sapFourSport.apps.games.model", "/leagues.xml" );
                var sPathSports = jQuery.sap.getModulePath( "uniorg.sapFourSport.apps.games.model", "/Sports.xml" );
                var uri = applicationContext.applicationEndpointURL;
                var user = applicationContext.registrationContext.user;
                var password = applicationContext.registrationContext.password;
                var headers = {"X-SMP-APPCID" : applicationContext.applicationConnectionId};
                this._oModel = new sap.ui.model.odata.ODataModel(uri, true, user, password, headers);
                var iOS = ( navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? true : false );
                if (iOS) { //unsure why but the first call seems to be to http://sapes1 rather than https which fails.
                    this._oModel = new sap.ui.model.odata.ODataModel(uri, true, user, password, headers);
                }
                this._oModelGames = new sap.ui.model.json.JSONModel( sPath );

                var xmlModel = new sap.ui.model.xml.XMLModel( sPathLeagues );
                //sap.ui.getCore().setModel( xmlModel, "gamesLeagues" );
                this.getView().setModel( new sap.ui.model.xml.XMLModel( sPathSports ), "gamesSports" );
                this.getView().setModel( this._oModel, "oDataTicket" );

                this.selectTrainerfilter = [];
                this.textFilter = [];
                this.selectSaisonfilter = [];
                this.leagueFilter = [];
                this.sportFilter = [];
                
                this.uniorgFilterSaison = [];
                this.uniorgFilterRound = [];
                this.uniorgFilterTeam = [];
                
                //sap.ui.getCore().setModel( this._oModelGames, "gamesModel" );
                this.getView().setModel( xmlModel, "gamesLeagues" );
                this._oSapMessagesList = null;

                this.setGamesTable();
                this.setGamesViz();
                this.setUniOrgGamesTable();


                sap.ui.getCore().byId( "__xmlview0--backHeadItem" ).setVisible( true );

            },

            setUniOrgGamesTable: function () {
                // reuse table sample component
                this._oTable2 = new sap.m.Table( "gamesUniorgTable", {
                    headerToolbar: new sap.m.Toolbar( {
                        content: [
                            new sap.m.Label( {
                                text: "Last Games"
                            } )
                        ]
                    } ),
                    columns:       [
                        new sap.m.Column( {
                            width:  "2em",
                            minScreenWidth: "Tablet",
                            demandPopin:    true,
                            header: new sap.m.Label( {
                                text: "Event"
                            } )
                        } ),
                        new sap.m.Column( {
                            width:  "2em",
                            minScreenWidth: "Tablet",
                            demandPopin:    true,
                            header: new sap.m.Label( {
                                text: "Gegner"
                            } )
                        } ),
                        new sap.m.Column( {
                            width:  "3em",
                            minScreenWidth: "Tablet",
                            demandPopin:    true,
                            header: new sap.m.Label( {
                                text: "Stadium"
                            } )
                        } ),
                        new sap.m.Column( {
                            width:  "2em",
                            minScreenWidth: "Tablet",
                            demandPopin:    true,
                            header: new sap.m.Label( {
                                text: "Spieltag"
                            } )
                        } ),
                        new sap.m.Column( {
                            width:  "2em",
                            minScreenWidth: "Tablet",
                            demandPopin:    true,
                            header: new sap.m.Label( {
                                text: "Saison"
                            } )
                        } ),
                        new sap.m.Column( {
                            width:  "2em",
                            minScreenWidth: "Tablet",
                            demandPopin:    true,
                            header: new sap.m.Label( {
                                text: "Zuschauer"
                            } )
                        } )]
                } );
                

                this._oTable2.bindItems( "/RoundS", new sap.m.ColumnListItem( {
                    cells: [
                        new sap.m.Text( {
                            text: "{EVENTDESC}"
                        } ),
                        new sap.m.Text( {
                            text: "{OPPONENTDESC}"
                        } ),
                        new sap.m.Text( {
                            text: "{STADIUMDESC}"
                        } ),
                        new sap.m.Text( {
                            text: "{ROUNDDESC}"
                        } ),
                        new sap.m.Text( {
                            text: "{SAISONDESC}"
                        } ),
                        new sap.m.Text( {
                            text: "{ENTREES}"
                        } )]
                } ) );

                this._oTable2.setModel( this._oModel );

                this._oTable2.setGrowing(true);
                this._oTable2.setGrowingScrollToLoad(true);
                this.getView().byId( "idIconTabBarRounds" ).insertContent( this._oTable2, 10 );

                // update table
                this._oTable2.setHeaderText( null );
                this._oTable2.setShowSeparators( "Inner" );
            }

            ,

            setGamesTable: function () {
                // reuse table sample component
                this._oTable = new sap.m.Table( "gamesTable", {
                    headerToolbar: new sap.m.Toolbar( {
                        content: []
                    } ),

                    columns: [
                        new sap.m.Column( {
                            width:          "2em",
                            minScreenWidth: "Tablet",
                            demandPopin:    true,
                            header:         new sap.m.Label( {
                                text: "Datum"
                            } )
                        } ),
                        new sap.m.Column( {
                            width:          "2em",
                            minScreenWidth: "Tablet",
                            demandPopin:    true,
                            header:         new sap.m.Label( {
                                text: "Spielstand"
                            } )
                        } ),
                        new sap.m.Column( {
                            width:          "2em",
                            minScreenWidth: "Tablet",
                            demandPopin:    true,
                            header:         new sap.m.Label( {
                                text: "Team 1"
                            } )
                        } ),
                        new sap.m.Column( {
                            width:          "2em",
                            minScreenWidth: "Tablet",
                            demandPopin:    true,
                            header:         new sap.m.Label( {
                                text: "Team 2"
                            } )
                        } ),
                        new sap.m.Column( {
                            width:          "2em",
                            minScreenWidth: "Tablet",
                            demandPopin:    true,
                            header:         new sap.m.Label( {
                                text: "Zuschauer"
                            } )
                        } ),
                        new sap.m.Column( {
                            width:          "2em",
                            minScreenWidth: "Tablet",
                            demandPopin:    true,
                            header:         new sap.m.Label( {
                                text: "Stadium"
                            } )
                        } )]
                } );

                this._oTable.bindItems( "/games/bl1", this.getTableTemplate() );

                this._oTable.setGrowing(true);
                this._oTable.setGrowingScrollToLoad(true);
                this._oTable.setModel( this._oModelGames );

                this.getView().byId( "idIconTabBar" ).insertContent( this._oTable, 10 );

                // update table
                this._oTable.setHeaderText( null );
                this._oTable.setShowSeparators( "Inner" );
            },

            getTableTemplate: function () {
                return new sap.m.ColumnListItem( {
                    cells: [
                        new sap.m.Text( {
                            text: {
                                parts:     ['MatchDateTime'],
                                formatter: function ( MatchDateTime ) {
                                    var date = new Date( MatchDateTime.replace( 'T', ' ' ) );
                                    var day = (date.getDay().toString().length == 2) ? date.getDay() : "0" + date.getDay().toString();
                                    var month = (date.getMonth().toString().length == 2) ? date.getMonth() : "0" + date.getMonth().toString();
                                    var hour = (date.getHours().toString().length == 2) ? date.getHours() : "0" + date.getHours().toString();
                                    var min = (date.getMinutes().toString().length == 2) ? date.getMinutes() : "0" + date.getMinutes().toString();
                                    return day + '.' + month + '.' + date.getFullYear() + ' ' + hour + ':' + min + ' Uhr';
                                }
                            }
                        } ),
                        new sap.m.Text( {
                            text: {
                                parts:     ['MatchResults'],
                                formatter: function ( MatchResults ) {
                                    var returnString = '';
                                    for ( var i = 0; i < MatchResults.length; i++ ) {
                                        returnString += MatchResults[i].ResultName + ' ' + MatchResults[i].PointsTeam1 + ':' + MatchResults[i].PointsTeam2 + '\n';
                                    }
                                    return returnString;
                                }
                            }
                        } ),
                        new sap.m.Text( {
                            text: "{Team1/TeamName}"
                        } ),
                        new sap.m.Text( {
                            text: "{Team2/TeamName}"
                        } ),
                        new sap.m.Text( {
                            text: "{NumberOfViewers}"
                        } ),
                        new sap.m.Text( {
                            text: "{Location/LocationStadium}"
                        } )]
                } );
            },

            setGamesViz: function () {
                this._oVizFrame = this.getView().byId( "idVizFrameStackedBar" );
                var oPopOver = this.getView().byId( "idPopOver" );
                var oDataset = new sap.viz.ui5.data.FlattenedDataset( {
                    dimensions: [{
                        axis:  1,
                        name:  "Stadium",
                        value: "{Location/LocationStadium}"
                    }, {
                        name:  "Heimmannschaft",
                        value: "{Team1/TeamName}"
                    }],
                    measures:   [
                        {
                            name:  'Zuschauer',
                            value: '{NumberOfViewers}'
                        }
                    ],
                    data:       {
                        path: "/games/bl1"

                    }
                } );
                this._oVizFrame.setDataset( oDataset );
                this._oVizFrame.setModel( this._oModelGames );


                var feedPrimaryValues = new sap.viz.ui5.controls.common.feeds.FeedItem( {
                    'uid':    "primaryValues",
                    'type':   "Measure",
                    'values': ["Zuschauer"]
                } ), feedAxisLabels = new sap.viz.ui5.controls.common.feeds.FeedItem( {
                    'uid':    "axisLabels",
                    'type':   "Dimension",
                    'values': ["Stadium"]
                } ), feedColor = new sap.viz.ui5.controls.common.feeds.FeedItem( {
                    'uid':    "regionColor",
                    'type':   "Dimension",
                    'values': ["Heimmannschaft"]
                } );
                this._oVizFrame.addFeed( feedPrimaryValues );
                this._oVizFrame.addFeed( feedAxisLabels );
                this._oVizFrame.addFeed( feedColor );
                oPopOver.connect( this._oVizFrame.getVizUid() );
            },

            setGamesVizPie: function () {
                var dataset = new sap.viz.ui5.data.FlattenedDataset( {

                    dimensions: [{
                        axis:  1,
                        name:  "Stadium",
                        value: "{Location/LocationStadium}"
                    }],

                    measures: [{
                        name:  'Zuschauer',
                        value: '{NumberOfViewers}'
                    }],
                    data: {
                        path: "/games/bl1"
                    }

                } );

                this.pie = new sap.viz.ui5.Pie( {
                    id:       "pie",
                    plotArea: {
                        //'colorPalette' : d3.scale.category20().range()
                    },
                    toolTip:  {
                        preRender:  function ( tooltipDomNode ) {
                            //Called before render tooltip.
                            tooltipDomNode.append( 'div' ).text( 'Append more information in default tooltip.' ).style( {'font-weight': 'bold'} );
                        },
                        postRender: function ( tooltipDomNode ) {
                            //Called after tooltip is renderred.
                            //tooltipDomNode.selectAll('.v-body-measure-value').style({'color': 'red'});
                            tooltipDomNode.selectAll( '.v-body-measure-value' ).attr( 'style', 'color: red;' );
                        }
                    },

                    title : {
                        visible : false
                    },
                    dataset:  dataset
                } );
                this.pie.setModel( this._oModelGames );
                this.getView().byId( "pieChartContent" ).addContent( this.pie, 10 );
            },

            handleIconTabBarTopSelect: function ( oEvent ) {
                var sKey = oEvent.getParameter( "selectedKey" );
                if ( sKey === "1" ) {
                } else if ( sKey === "2" ) {
                    var win = window.open(
                        '/sap/bi/aas/rt/index.html?APPLICATION=BO4SPORTS_ROUNDS_MOBILE_3',
                        '_blank'
                    );
                    win.focus();
                } else if ( sKey === "3" ) {

                }
            },

            handleIconTabBarSelect: function ( oEvent ) {
                var sKey = oEvent.getParameter( "selectedItem" );
                var value = sKey.getKey();
                if ( value !== "All" ) {
                    this.selectTrainerfilter = new sap.ui.model.Filter( "MatchDateTime", sap.ui.model.FilterOperator.StartsWith, value );
                } else {
                    this.selectTrainerfilter = [];
                }
                this.applyFilter();
            },

            onChartSaisonSelect: function ( oEvent ) {
                var sKey = oEvent.getParameter( "selectedItem" );
                var value = sKey.getKey();
                if ( value !== "All" ) {
                    this.selectSaisonfilter = [new sap.ui.model.Filter( "MatchDateTime", sap.ui.model.FilterOperator.StartsWith, value )];
                } else {
                    this.selectSaisonfilter = [];
                }
                this.pie.getDataset().getBinding( "data" ).filter( this.selectSaisonfilter );
                this._oVizFrame.getDataset().getBinding( "data" ).filter( this.selectSaisonfilter );
            },

            onSelectSport: function ( oEvent ) {
                var sKey = oEvent.getParameter( "selectedItem" );
                var value = sKey.getKey();
                if ( value !== "All" ) {
                    this.sportFilter = [new sap.ui.model.Filter( "LeagueSportID", sap.ui.model.FilterOperator.EQ, value )];
                } else {
                    this.sportFilter = [];
                }
                this.getView()
                    .byId( "gamesLeaguesSelect" )
                    .getBinding( "items" ).filter( this.sportFilter );
                this.getView()
                    .byId( "gamesLeaguesSelectTable" )
                    .getBinding( "items" ).filter( this.sportFilter );

                var firstSelect = this.getView()
                    .byId( "gamesLeaguesSelect" )
                    .getFirstItem().getKey();

                this.getView()
                    .byId( "gamesSportsSelect" )
                    .setSelectedKey( value );
                this.getView()
                    .byId( "gamesSportsSelectTable" )
                    .setSelectedKey( value );

                this.handleSelectLeague( firstSelect );

            },

            onSelectLeague: function ( oEvent ) {
                var sKey = oEvent.getParameter( "selectedItem" );
                var value = sKey.getKey();

                this.handleSelectLeague( value );
            },

            handleSelectLeague: function ( value ) {

                this.pie.getDataset().bindAggregation( "data", "/games/" + value );
                this._oVizFrame.getDataset().bindAggregation( "data", "/games/" + value );
                this._oTable.bindAggregation( "items", "/games/" + value, this.getTableTemplate() );
                if ( this.selectSaisonfilter.length !== 0 ) {
                    this.pie.getDataset().getBinding( "data" ).filter( this.selectSaisonfilter );
                    this._oVizFrame.getDataset().getBinding( "data" ).filter( this.selectSaisonfilter );
                }
                this.applyFilter();
            },

            onSearch: function ( oEvent ) {
                var query = oEvent.getParameter( "newValue" );
                if ( query !== "" ) {
                    this.textFilter = new sap.ui.model.Filter( [
                        new sap.ui.model.Filter( "Team1/TeamName", sap.ui.model.FilterOperator.Contains, query ),
                        new sap.ui.model.Filter( "Team2/TeamName", sap.ui.model.FilterOperator.Contains, query )
                    ], false );

                } else {
                    this.textFilter = [];
                }
                this.applyFilter();
            },

            applyFilter: function () {
                var oBinding = this._oTable.getBinding( "items" ),
                    filter;
                if ( this.textFilter.length === 0 && this.selectSaisonfilter.length === 0 ) {
                    filter = [];
                } else if ( this.textFilter.length === 0 && this.selectSaisonfilter.length !== 0 ) {
                    filter = [this.selectSaisonfilter];
                } else if ( this.textFilter instanceof sap.ui.model.Filter && this.selectSaisonfilter.length === 0 ) {
                    filter = [this.textFilter];
                } else {
                    filter = [this.selectSaisonfilter, this.textFilter];
                }
                oBinding.filter( filter );
            },

            onAfterRendering: function () {
                this.getView()
                    .byId( "gamesLeaguesSelect" )
                    .getBinding( "items" ).filter( [
                        new sap.ui.model.Filter( [
                            new sap.ui.model.Filter( {
                                path: "LeagueSportID", test: function ( oValue ) {
                                    return parseInt( oValue ) == 1;
                                }
                            } ),
                            new sap.ui.model.Filter( {
                                path: "LeagueSaison", test: function ( oValue ) {
                                    return parseInt( oValue ) == 2014;
                                }
                            } )
                        ], true )
                    ] );
                this.getView()
                    .byId( "gamesLeaguesSelectTable" )
                    .getBinding( "items" ).filter( [
                        new sap.ui.model.Filter( [
                            new sap.ui.model.Filter( {
                                path: "LeagueSportID", test: function ( oValue ) {
                                    return parseInt( oValue ) == 1;
                                }
                            } ),
                            new sap.ui.model.Filter( {
                                path: "LeagueSaison", test: function ( oValue ) {
                                    return parseInt( oValue ) == 2014;
                                }
                            } )
                        ], true )
                    ] );
                    
                this.setGamesVizPie();
            },
            
            onSelectSaison: function( oEvent ) {
                var sKey = oEvent.getParameter( "selectedItem" );
                var value = sKey.getKey();
                if ( value !== "All" ) {
                    this.uniorgFilterSaison = new sap.ui.model.Filter( "SAISONDESC", sap.ui.model.FilterOperator.Contains, value );
                } else {
                    this.uniorgFilterSaison = [];
                }
                this.getView()
                    .byId( "onSelectRound" )
                    .getBinding( "items" ).filter( [this.uniorgFilterSaison] );
                this.getView()
                    .byId( "onSelectTeam" )
                    .getBinding( "items" ).filter( [this.uniorgFilterSaison] );
                this.applyUniorgFilter();
            },
            
            onSelectRound: function( oEvent ) {
                var sKey = oEvent.getParameter( "selectedItem" );
                var value = sKey.getKey();
                if ( value !== "All" ) {
                    this.uniorgFilterRound = new sap.ui.model.Filter( "ROUNDDESC", sap.ui.model.FilterOperator.EQ, value );
                } else {
                    this.uniorgFilterRound = [];
                }
                this.getView()
                    .byId( "onSelectTeam" )
                    .getBinding( "items" ).filter( [this.uniorgFilterRound] );
                this.getView()
                    .byId( "onSelectSaison" )
                    .getBinding( "items" ).filter( [this.uniorgFilterRound] );
                this.applyUniorgFilter();
            },
            
            onSelectTeam: function( oEvent ) {
                var sKey = oEvent.getParameter( "selectedItem" );
                var value = sKey.getKey();
                if ( value !== "All" ) {
                    this.uniorgFilterTeam = new sap.ui.model.Filter( "OPPONENTDESC", sap.ui.model.FilterOperator.Contains, value );
                } else {
                    this.uniorgFilterTeam = [];
                }
                this.getView()
                    .byId( "onSelectSaison" )
                    .getBinding( "items" ).filter( [this.uniorgFilterTeam] );
                this.getView()
                    .byId( "onSelectRound" )
                    .getBinding( "items" ).filter( [this.uniorgFilterTeam] );
                this.applyUniorgFilter();
            },
            
            onPressResetFilter: function() {
                this.uniorgFilterSaison = [];
                this.uniorgFilterRound = [];
                this.uniorgFilterTeam = [];
                this.applyUniorgFilter();
            },

            applyUniorgFilter: function () {
                var oBinding = this._oTable2.getBinding( "items" ),
                    filter = [];
                if ( this.uniorgFilterSaison.length !== 0 ) {
                    filter.push(this.uniorgFilterSaison);
                } 
                if ( this.uniorgFilterRound.length !== 0) {
                    filter.push(this.uniorgFilterRound);
                } 
                if ( this.uniorgFilterTeam.length !== 0 ) {
                    filter.push(this.uniorgFilterTeam);
                } 
                oBinding.filter( filter );
            }

        } );

    }, /* bExport= */
    true
)
;