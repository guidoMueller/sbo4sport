sap.ui.define( [],
    function () {
        "use strict";

        var Formatter = {

            //[DEFAULT|CONFIRMED|PARTIALDELIVERED|DELIVERED|BILLED|CANCELED];

            _messageTypeMap: {
                "S": {icon: "status-positive", state: "Success"},
                "E": {icon: "status-error", state: "Success"},
                "W": {icon: "status-critical", state: "Success"},
                "I": {icon: "message-information", state: "Success"},
                "A": {icon: "question-mark", state: "Success"}
            },

            messageTypeIcon: function ( sValue ) {
                return (sValue) ?
                       "sap-icon://" + Formatter._messageTypeMap[sValue].icon : "";
            },

            messageTypeState: function ( sValue ) {
                return (sValue) ? Formatter._messageTypeMap[sValue].state : "None";
            }

        };

        return Formatter;

    }, /* bExport= */ true );