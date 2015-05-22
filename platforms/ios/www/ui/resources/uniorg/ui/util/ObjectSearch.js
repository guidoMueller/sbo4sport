sap.ui.define( ["jquery.sap.global"],
    function ( jQuery ) {
        "use strict";

        var ObjectSearch = {

            getEntityPath: function ( oData, sId ) {
                if ( !oData.entities ) {
                    return null;
                }
                var oResult = null;
                jQuery.each( oData.entities, function ( i, oEnt ) {
                    if ( oEnt.id === sId ) {
                        oResult = "/entities/" + i + "/";
                        return false;
                    }
                } );
                return oResult;
            },

            getPath: function ( oData, sProperty, oValue ) {
                return this._getPath( oData, sProperty, oValue, "/" );
            },

            _getPath: function ( oData, sProperty, oValue, sPath ) {
                // iterate attributes
                for ( var p in oData ) {
                    if ( oData[p] instanceof Array ) {
                        // step down into recursion for arrays
                        for ( var i = 0; i < oData[p].length; i++ ) {
                            var result = this._getPath(
                                oData[p][i], sProperty, oValue, sPath + p + "/" + i + "/"
                            );
                            if ( result ) {
                                return result;
                            }
                        }
                    } else {
                        // check property
                        if ( p === sProperty && oData[p] === oValue ) {
                            return sPath;
                        }
                    }
                }
                return null;
            }
        };

        return ObjectSearch;

    }, /* bExport= */ true );