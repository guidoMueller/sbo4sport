sap.ui.define( ["sap/ui/model/type/Boolean"],
    function ( Boolean ) {
        "use strict";

        Boolean.prototype.formatValue = function ( oValue, sInternalType ) {
            var sValueType = typeof oValue;
            switch ( sValueType ) {
                case "boolean":
                    return oValue;
                case "string":
                    oValue = oValue.toUpperCase();
                    return (oValue === "X" || oValue === "TRUE" || oValue === "1");
                case "int":
                case "float":
                    return (oValue === 1);
                default:
                    return oValue;
            }
        };

        Boolean.prototype.parseValue = function ( bValue, sInternalType ) {
            var sStyle = "ABAP";
            switch ( sStyle ) {
                case "ABAP":        // EDM.String
                    return bValue ? "X" : " ";
                case "BOOLSTRING":  // EDM.String
                    return bValue ? "true" : "false";
                default:            // EDM.Boolean
                    return bValue;
            }
        };

    }, /* bExport= */ false );