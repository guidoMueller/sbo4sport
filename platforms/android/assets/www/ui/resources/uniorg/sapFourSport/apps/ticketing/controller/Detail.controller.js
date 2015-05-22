sap.ui.define( [
		"uniorg/ui/core/mvc/md/DetailController",
		"uniorg/sapFourSport/util/Formatter"
	],
	function( DetailController ) {
		"use strict";

		return DetailController.extend( "uniorg.sapFourSport.apps.ticketing.controller.Detail", {

			onInit: function() {
				var mParameters = {};

				sap.ui.getCore().byId( "__xmlview0--backHeadItem" ).setVisible( true );
				DetailController.prototype.onInit.apply( this, [mParameters] );
				var uri = applicationContext.applicationEndpointURL;
				var user = applicationContext.registrationContext.user;
				var password = applicationContext.registrationContext.password;
				var headers = {"X-SMP-APPCID" : applicationContext.applicationConnectionId};
				var oModel = new sap.ui.model.odata.ODataModel(uri, true, user, password, headers);
				var iOS = ( navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? true : false );
				if (iOS) { //unsure why but the first call seems to be to http://sapes1 rather than https which fails.
					oModel = new sap.ui.model.odata.ODataModel(uri, true, user, password, headers);
				}
				this.getView().setModel( oModel );
				// reuse table sample component
				this._oTable = new sap.m.Table( "idRandomDataTable", {
					headerToolbar: new sap.m.Toolbar( {
						content: []
					} ),
					columns: [
						new sap.m.Column( {
							width: "2em",
							header: new sap.m.Label( {
								text: "Datum"
							} )
						} ),
						new sap.m.Column( {
							width: "3em",
							header: new sap.m.Label( {
								text: "Team 1"
							} )
						} ),
						new sap.m.Column( {
							width: "3em",
							header: new sap.m.Label( {
								text: "Preis"
							} )
						} ),
						new sap.m.Column( {
							width: "3em",
							header: new sap.m.Label( {
								text: "Type"
							} )
						} )]
				} );

				this._oTable.bindItems( "/Ticket", new sap.m.ColumnListItem( {
					cells: [
						new sap.m.Text( {
							text: "{EVENTDATE}"
						} ),
						new sap.m.Text( {
							text: "{EVENTDESC}"
						} ),
						new sap.m.Text( {
							text: {
								parts: ['PRICE', 'CURRENCY'],
								formatter: function( PRICE, CURRENCY ) {
									return PRICE + ' ' + CURRENCY;
								}
							}
						} ),
						new sap.m.Text( {
							text: "{PRICECAT}"
						} )]
				} ) );
				this._oTable.setModel( oModel );

				this.getView().byId( "idIconTabBar" ).insertContent( this._oTable );

				// update table
				this._oTable.setHeaderText( null );
				this._oTable.setShowSeparators( "Inner" );

				this._oSapMessagesList = null;


				var oVizFrame = this.getView().byId( "idVizFrameStackedBar" );
				oVizFrame.setModel( oModel );
				var oPopOver = this.getView().byId( "idPopOver" );
				var oDataset = new sap.viz.ui5.data.FlattenedDataset( {
					dimensions: [{
						axis: 1,
						name: "Verein",
						value: "{EVENTDESC}"
					}, {
						name: "Preis Kategorie",
						value: "{PRICECAT}"
					}],
					measures: [
						{
							name: 'Einnahmen',
							value: '{PRICE}'
						}
					],
					data: {
						path: "/TicketS"

					}
				} );
				oVizFrame.setDataset( oDataset );


				var feedPrimaryValues = new sap.viz.ui5.controls.common.feeds.FeedItem( {
					'uid': "primaryValues",
					'type': "Measure",
					'values': ["Einnahmen"]
				} ), feedAxisLabels = new sap.viz.ui5.controls.common.feeds.FeedItem( {
					'uid': "axisLabels",
					'type': "Dimension",
					'values': ["Verein"]
				} ), feedColor = new sap.viz.ui5.controls.common.feeds.FeedItem( {
					'uid': "regionColor",
					'type': "Dimension",
					'values': ["Preis Kategorie"]
				} );
				oVizFrame.addFeed( feedPrimaryValues );
				oVizFrame.addFeed( feedAxisLabels );
				oVizFrame.addFeed( feedColor );
				oPopOver.connect( oVizFrame.getVizUid() );

			},

			handleIconTabBarTopSelect: function( oEvent ) {
				var sKey = oEvent.getParameter( "selectedKey" );
				if ( sKey === "1" ) {
				} else if ( sKey === "2" ) {
				} else if ( sKey === "3" ) {
					var win = window.open(
						'/sap/bi/aas/rt/index.html?APPLICATION=BO4SPORTS_TICKETS_MOBILE_1',
						'_blank'
					);
					win.focus();
				}
			},

			handleIconTabBarSelect: function( oEvent ) {
				var oBinding = this._oTable.getBinding( "items" ),
					sKey = oEvent.getParameter( "selectedKey" ),
					oFilter;
				if ( sKey === "1" ) {
					oFilter = new sap.ui.model.Filter( "PRICECAT", sap.ui.model.FilterOperator.StartsWith, "Preiskat.1" );
					oBinding.filter( [oFilter] );
				} else if ( sKey === "2" ) {
					oFilter = new sap.ui.model.Filter( "PRICECAT", sap.ui.model.FilterOperator.StartsWith, "Preiskat.2" );
					oBinding.filter( [oFilter] );
				} else if ( sKey === "3" ) {
					oFilter = new sap.ui.model.Filter( "PRICECAT", sap.ui.model.FilterOperator.StartsWith, "Preiskat.3" );
					oBinding.filter( [oFilter] );
				} else if ( sKey === "4" ) {
					oFilter = new sap.ui.model.Filter( "PRICECAT", sap.ui.model.FilterOperator.StartsWith, "Preiskat.4" );
					oBinding.filter( [oFilter] );
				} else if ( sKey === "5" ) {
					oFilter = new sap.ui.model.Filter( "PRICECAT", sap.ui.model.FilterOperator.StartsWith, "Preiskat.5" );
					oBinding.filter( [oFilter] );
				} else if ( sKey === "6" ) {
					oFilter = new sap.ui.model.Filter( "PRICECAT", sap.ui.model.FilterOperator.StartsWith, "Preiskat.6" );
					oBinding.filter( [oFilter] );
				} else {
					oBinding.filter( [] );
				}
			}

		} );

	}, /* bExport= */ true );