sap.ui.define( [
        "uniorg/ui/core/mvc/md/DetailController",
        "uniorg/sapFourSport/util/Formatter"
    ],
    function ( DetailController ) {
        "use strict";

        return DetailController.extend( "uniorg.sapFourSport.apps.players.controller.Detail", {

            onInit: function () {
                var mParameters = {};

                DetailController.prototype.onInit.apply( this, [mParameters] );
                var sPathLeagues = jQuery.sap.getModulePath( "uniorg.sapFourSport.apps.players.model", "/Goals.xml" );
                this.xmlModel = new sap.ui.model.xml.XMLModel( sPathLeagues );
                this.getView().setModel( this.xmlModel, "playersGoals" );
                console.log(this.xmlModel);
                this.setGamesViz();
                this.setGamesVizPie();

                // init class members
                this._oSapMessagesList = null;
                sap.ui.getCore().byId( "__xmlview0--backHeadItem" ).setVisible( true );
            },

            setGamesViz: function () {
                this._oVizFrame = this.getView().byId( "playersBarChart" );
                var oPopOver = this.getView().byId( "idPopOver2" );
                var oDataset = new sap.viz.ui5.data.FlattenedDataset( {
                    dimensions: [{
                        axis:  1,
                        name:  "Spieler",
                        value: "{goalGetterName}"
                    }],
                    measures:   [
                        {
                            name:  'Tore',
                            value: '{goalGetterGoalCount}'
                        }
                    ],
                    data:       {
                        path: "/item/"

                    }
                } );
                this._oVizFrame.setDataset( oDataset );
                this._oVizFrame.setModel( this.xmlModel );


                var feedPrimaryValues = new sap.viz.ui5.controls.common.feeds.FeedItem( {
                    'uid':    "primaryValues",
                    'type':   "Measure",
                    'values': ["Tore"]
                } ), feedAxisLabels = new sap.viz.ui5.controls.common.feeds.FeedItem( {
                    'uid':    "axisLabels",
                    'type':   "Dimension",
                    'values': ["Spieler"]
                } ), feedColor = new sap.viz.ui5.controls.common.feeds.FeedItem( {
                    'uid':    "regionColor",
                    'type':   "Dimension",
                    'values': ["Spieler"]
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
                        name:  "Tore",
                        value: "{goalGetterName}"
                    }],

                    measures: [{
                        name:  'Tore',
                        value: '{goalGetterGoalCount}'
                    }],
                    data: {
                        path: "/item/"
                    }

                } );

                this.pie = new sap.viz.ui5.Pie( {
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
                this.pie.setModel( this.xmlModel );
                this.getView().byId( "goalsChartPie" ).addContent( this.pie, 10 );
            },

            handleIconTabBarTopSelect: function ( oEvent ) {
                var sKey = oEvent.getParameter( "selectedKey" );
                if ( sKey === "1" ) {
                } else if ( sKey === "2" ) {
                    var win = window.open(
                        '/sap/bi/aas/rt/index.html?APPLICATION=BO4SPORTS_PLAYERS_MOBILE_1',
                        '_blank'
                    );
                    win.focus();
                } 
            }
        } );

    }, /* bExport= */ true );