sap.ui.define( [
        "uniorg/ui/core/mvc/md/DetailController",
        "uniorg/sapFourSport/util/Formatter"
    ],
    function ( DetailController ) {
        "use strict";

        return DetailController.extend( "uniorg.sapFourSport.apps.member.controller.Detail", {

            onInit: function () {
                var mParameters = {};

                DetailController.prototype.onInit.apply( this, [mParameters] );
                this._oModel = new sap.ui.model.odata.ODataModel( "http://sbo4sports.uniorg.de:8000/uniorg/sbo4sport/member/services/member.xsodata" );
                this.getView().setModel( this._oModel );
                this.filter = [];
                this.trainerFilter = [];
                this.teamFilter = [];
                this.birthdayFilter = [];
                this.natFilter = [];
                this.setMemberTable();
                // init class members
                this._oSapMessagesList = null;
                sap.ui.getCore().byId( "__xmlview0--backHeadItem" ).setVisible( true );
            },

            setMemberTable: function () {
                // reuse table sample component
                this._oTable = new sap.m.Table( "membersTable", {
                    headerToolbar: new sap.m.Toolbar( {
                        content: [
                            new sap.m.Label( {
                                text: "Members"
                            } )
                        ]
                    } ),
                    columns:       [
                        new sap.m.Column( {
                            width:  "2em",
                            header: new sap.m.Label( {
                                text: "Name"
                            } )
                        } ),
                        new sap.m.Column( {
                            width:  "2em",
                            header: new sap.m.Label( {
                                text: "Geburtstag"
                            } )
                        } ),
                        new sap.m.Column( {
                            width:  "2em",
                            header: new sap.m.Label( {
                                text: "Kontakt"
                            } )
                        } ),
                        new sap.m.Column( {
                            width:  "2em",
                            header: new sap.m.Label( {
                                text: "Manschaft"
                            } )
                        } ),
                        new sap.m.Column( {
                            width:  "2em",
                            header: new sap.m.Label( {
                                text: "Saison"
                            } )
                        } ),
                        new sap.m.Column( {
                            width:  "2em",
                            header: new sap.m.Label( {
                                text: "Trainer"
                            } )
                        } ),
                        new sap.m.Column( {
                            width:  "2em",
                            header: new sap.m.Label( {
                                text: "Nationalität"
                            } )
                        } )]
                } );
                var select = "U_LASTNAME,U_FIRSTNAME,U_SEX,U_BIRTHDATE,U_EMAIL,U_PHONE,U_MOBIL,U_NAME,U_SEASON,U_TRAINER,U_NATNAME";
                this._oTable.bindItems( "/MemberS?$select=" + select, new sap.m.ColumnListItem( {
                    cells: [
                        new sap.m.Text( {
                            text: {
                                parts:     ['U_LASTNAME', 'U_FIRSTNAME'],
                                formatter: function ( lastName, firstName ) {
                                    return lastName + ' ' + firstName;
                                }
                            }
                        } ),
                        new sap.m.Text( {
                            text: {
                                parts:     ['U_BIRTHDATE'],
                                formatter: function ( birthDate ) {
                                    var date = birthDate;
                                    var day = (date.getDay().toString().length == 2) ? date.getDay() : "0" + date.getDay().toString();
                                    var month = (date.getMonth().toString().length == 2) ? date.getMonth() : "0" + date.getMonth().toString();
                                    return day + '.' + month + '.' + date.getFullYear();
                                }
                            }
                        } ),
                        new sap.ui.core.HTML( {
                            content: {
                                parts:     ['U_EMAIL', 'U_PHONE', 'U_MOBIL'],
                                formatter: function ( mail, phone, mobile ) {
                                    var returnString = '<a href="mailto:' + mail + '">' + mail + '</a></br>';
                                    returnString += '<a href="tel:' + phone + '">' + phone + '</a></br>';
                                    returnString += '<a href="tel:' + mobile + '">' + mobile + '</a></br>';
                                    return returnString;
                                }
                            }
                        } ),
                        new sap.m.Text( {
                            text: "{U_NAME}"
                        } ),
                        new sap.m.Text( {
                            text: "{U_SEASON}"
                        } ),
                        new sap.m.Text( {
                            text: "{U_TRAINER}"
                        } ),
                        new sap.m.Text( {
                            text: "{U_NATNAME}"
                        } )]
                } ) );

                this._oTable.setModel( this._oModel );

                this.getView().byId( "idIconTabBar" ).insertContent( this._oTable );

                // update table
                this._oTable.setHeaderText( null );
                this._oTable.setShowSeparators( "Inner" );
            },

            onPress: function () {
                var oBinding = this._oTable.getBinding( "items" );
                this.filter = [];
                oBinding.filter( [] );
            },

            handleSelectTrainer: function ( oEvent ) {
                var sKey = oEvent.getParameter( "selectedItem" ),
                    oFilter;
                var value = sKey.getKey();
                if ( value !== "" ) {
                    oFilter = new sap.ui.model.Filter( "U_TRAINER", sap.ui.model.FilterOperator.StartsWith, "'" + value + "'" );
                    this.trainerFilter = oFilter;
                } else {
                    this.filter = [];
                }
                this.applyUniorgFilter();
            },

            handleSelectTeam: function ( oEvent ) {
                var oBinding = this._oTable.getBinding( "items" ),
                    sKey = oEvent.getParameter( "selectedItem" ),
                    oFilter;
                var value = sKey.getKey();
                if ( value !== "" ) {
                    this.teamFilter = new sap.ui.model.Filter( "U_NAME", sap.ui.model.FilterOperator.Contains, "'" + value + "'" );
                } else {
                    this.teamFilter = [];
                }
                this.applyUniorgFilter();
            },

            handleSelectBirthday: function ( oEvent ) {
                var sFrom = oEvent.getParameter("from");
                var sTo = oEvent.getParameter("to");
                var bValid = oEvent.getParameter("valid");
                sFrom = new Date(sFrom).getTime();
                sTo = new Date(sTo).getTime();
                if (bValid) {
                    this.birthdayFilter = new sap.ui.model.Filter( [
                        new sap.ui.model.Filter( "U_BIRTHDATE", sap.ui.model.FilterOperator.GE, "'" + sFrom + "'" ),
                        new sap.ui.model.Filter( "U_BIRTHDATE", sap.ui.model.FilterOperator.LE, "'" + sTo + "'" )
                        ], true );
                } else {
                    this.birthdayFilter = [];
                }
                this.applyUniorgFilter();

            },
            
            applyUniorgFilter: function () {
                var oBinding = this._oTable.getBinding( "items" ),
                    filter = [];
                if ( this.birthdayFilter.length !== 0 ) {
                    filter.push(this.birthdayFilter);
                } 
                if ( this.teamFilter.length !== 0) {
                    filter.push(this.teamFilter);
                } 
                if ( this.trainerFilter.length !== 0 ) {
                    filter.push(this.trainerFilter);
                } 
                if ( this.natFilter.length !== 0 ) {
                    filter.push(this.natFilter);
                }
                oBinding.filter( filter );
            },

            handleIconTabBarSelect: function ( oEvent ) {
                var sKey = oEvent.getParameter( "selectedKey" ),
                    oFilter;
                var value = sap.ui.getCore().byId( sKey ).getText()
                if ( value !== "" ) {
                    oFilter = new sap.ui.model.Filter( "U_NATNAME", sap.ui.model.FilterOperator.StartsWith, "'" + value + "'" );
                    this.natFilter = oFilter;
                } else {
                    this.filter = [];
                }
                this.applyUniorgFilter();
            },

            handleIconTabBarTopSelect: function ( oEvent ) {
                var sKey = oEvent.getParameter( "selectedKey" );
                if ( sKey === "1" ) {
                } else if ( sKey === "2" ) {
                    var win = window.open(
                        '/sap/bi/aas/rt/index.html?APPLICATION=BO4SPORTS_MEMBERS_MOBILE_1',
                        '_blank'
                    );
                    win.focus();
                } else if ( sKey === "3" ) {

                }
            }

        } );

    }, /* bExport= */ true );