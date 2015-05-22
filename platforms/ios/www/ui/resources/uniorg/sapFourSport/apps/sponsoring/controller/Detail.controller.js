sap.ui.define( [
        "uniorg/ui/core/mvc/md/DetailController",
        "uniorg/sapFourSport/util/Formatter"
    ],
    function ( DetailController ) {
        "use strict";

        return DetailController.extend( "uniorg.sapFourSport.apps.sponsoring.controller.Detail", {

            onInit: function () {
                var mParameters = {};

                DetailController.prototype.onInit.apply( this, [mParameters] );
                this._oModel = new sap.ui.model.odata.ODataModel( "http://sbo4sports.uniorg.de:8000/uniorg/sbo4sport/sponsor/services/sponsor.xsodata" );
                this.getView().setModel( this._oModel );
                this.setTable();
                this.setSponsoringViz();

                // init class members
                this._oSapMessagesList = null;
                sap.ui.getCore().byId( "__xmlview0--backHeadItem" ).setVisible( true );
            },
            
            getTableTemplate: function() {
                return new sap.m.ColumnListItem( {
                    cells: [
                        new sap.m.Text( {
                            text: "{BpName}"
                        } ),
                        new sap.m.Text( {
                            text: "{OpenAmtLC}"
                        } ),
                        new sap.m.Text( {
                            text: "{LineTotal}"
                        } ),
                        new sap.m.Text( {
                            text: "{PlanAmtLC}"
                        } )]
                } );
            },

            setTable: function () {
                var oModel = this._oModel;
                // reuse table sample component
                this._oTable = new sap.m.Table( "sponsoringTable", {
                    columns:       [
                        new sap.m.Column( {
                            width:  "2em",
                            header: new sap.m.Label( {
                                text: "Sponsor"
                            } ),
                             mergeDuplicates: true,
                            minScreenWidth: "Tablet",
                            demandPopin:    true
                        } ),
                        new sap.m.Column( {
                            width:  "3em",
                            header: new sap.m.Label( {
                                text: "nicht Bezahlt"
                            } ),
                            minScreenWidth: "Tablet",
                            demandPopin:    true
                        } ),
                        new sap.m.Column( {
                            width:  "2em",
                            header: new sap.m.Label( {
                                text: "Bezahlt"
                            } ),
                            minScreenWidth: "Tablet",
                            demandPopin:    true
                        } ),
                        new sap.m.Column( {
                            width:  "2em",
                            header: new sap.m.Label( {
                                text: "Sponsoring"
                            } ),
                            minScreenWidth: "Tablet",
                            demandPopin:    true
                        } )]
                } );
                this._oTable.setGrowing(true);
                this._oTable.setGrowingScrollToLoad(true);
                this._oTable.bindItems( "/SponsorS?$select=BpName,OpenAmtLC,LineTotal,PlanAmtLC", this.getTableTemplate() );

                this._oTable.setModel( this._oModel );

                this.getView().byId( "idIconTabBar" ).insertContent( this._oTable, 10 );

                // update table
                this._oTable.setHeaderText( null );
                this._oTable.setShowSeparators( "Inner" );
            },
            
            onPressTop: function() {
                this._oTable.bindAggregation("items", {
                    path: "/SponsorS",
                    parameters: {
                        select: "BpName,OpenAmtLC,LineTotal,PlanAmtLC",
                        top: 10,
                        orderby: "PlanAmtLC ASC"
                    },
                    sorter: new sap.ui.model.Sorter("PlanAmtLC", true),
                    template: this.getTableTemplate()
                });
                this._oVizFrame.getDataset().bindAggregation("data", {
                    path: "/SponsorS",
                    parameters: {
                        select: "BpName,OpenAmtLC,LineTotal,PlanAmtLC",
                        top: 10,
                        orderby: "PlanAmtLC ASC"
                    },
                    sorter: new sap.ui.model.Sorter("PlanAmtLC", true),
                    template: this.getTableTemplate()
                });
            },

            setSponsoringViz: function () {
                this._oVizFrame = this.getView().byId( "idVizFrameStackedBar" );
                this._oVizFrame.setModel( this._oModel );
                var oPopOver = this.getView().byId( "idPopOver" );
                var oDataset = new sap.viz.ui5.data.FlattenedDataset( {
                    dimensions: [{
                        name:  "Sponsor",
                        value: "{BpName}"
                    }],
                    measures:   [
                        {
                            name:  'Sponsoring',
                            value: '{PlanAmtLC}'
                        },
                        {
                            name:  "Bezahlt",
                            value: "{LineTotal}"
                        },
                        {
                            name:  "Nicht Bezahlt",
                            value: "{OpenAmtLC}"
                        }
                    ],
                    data:       {
                    path: "/SponsorS",
                    parameters: {
                        select: "BpName,OpenAmtLC,LineTotal,PlanAmtLC",
                        top: 10,
                        orderby: "PlanAmtLC ASC"
                    },
                    sorter: new sap.ui.model.Sorter("PlanAmtLC", true),
                    template: this.getTableTemplate()
                }
                } );
                this._oVizFrame.setDataset( oDataset );


                var feedPrimaryValues = new sap.viz.ui5.controls.common.feeds.FeedItem( {
                    'uid':    "primaryValues",
                    'type':   "Measure",
                    'values': ["Sponsoring", "Bezahlt"]
                } ), feedAxisLabels = new sap.viz.ui5.controls.common.feeds.FeedItem( {
                    'uid':    "axisLabels",
                    'type':   "Dimension",
                    'values': ["Sponsor"]
                } ), feedColor = new sap.viz.ui5.controls.common.feeds.FeedItem( {
                    'uid':    "regionColor",
                    'type':   "Measure",
                    'values': ["Nicht Bezahlt"]
                } );

                this._oVizFrame.addFeed( feedPrimaryValues );
                this._oVizFrame.addFeed( feedAxisLabels );
                this._oVizFrame.addFeed( feedColor );
                oPopOver.connect( this._oVizFrame.getVizUid() );
            }


        } );

    }, /* bExport= */ true );