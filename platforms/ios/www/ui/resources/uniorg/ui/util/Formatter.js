sap.ui.define( [
        "sap/ui/core/format/DateFormat",
        "sap/ui/core/format/NumberFormat"
    ],
    function ( DateFormat ) {
        "use strict";

        var Formatter = {

            removeLeadingZero: function ( sStr ) {
                return (sStr) ? sStr.replace( /^0+/, "" ) : sStr;
            },

            uppercaseFirstChar: function ( sStr ) {
                return sStr.charAt( 0 ).toUpperCase() + sStr.slice( 1 );
            },

            currencyValue: function ( value ) {
                return parseFloat( value ).toFixed( 2 );
            },

            history: function ( sBy, dAt ) {
                return sBy + " (" + Formatter.dateTime( dAt ) + ")";
            },

            boolText: function ( oState ) {
                var bState = (oState === true || oState === "1" || oState === "X") ?
                             true : false;
                return (bState) ? "Ja" : "Nein";
            },

            i18nText: function ( sProperty ) {
                return this.getModel( "i18n" ).getProperty( sProperty );
            },

            date: function ( dValue ) {
                if ( dValue ) {
                    return DateFormat.getDateInstance().format( new Date( dValue ) );
                    /*
                     var oDateFormat = DateFormat.getDateInstance(
                     { pattern: "yyyy-MM-dd" }
                     );
                     return oDateFormat.format(new Date(dValue));
                     */
                } else {
                    return dValue;
                }
            },

            dateTime: function ( dValue ) {
                return (dValue) ?
                       DateFormat.getDateTimeInstance().format( new Date( dValue ) )
                    : dValue;
            },

            timestamp: function ( iValue ) {
                if ( iValue ) {
                    var oDateFormat = DateFormat.getDateTimeInstance( {
                        style: "medium"
                        //pattern: "dd/MM/yyyy HH:mm"
                    } );
                    return oDateFormat.format( new Date( iValue ) );
                } else {
                    return iValue;
                }
            }

            /* INCLUDE moment.js ???
             countdownDays : function (sValue) {
             return moment(sValue).diff(moment(), "days");
             }
             */

        };

        return Formatter;

    }, /* bExport= */ true );