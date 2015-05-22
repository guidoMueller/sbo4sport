sap.ui.define( [],
    function () {
        "use strict";

        return {

            UME_PASSWORD: function () {
                return new sap.ui.model.type.String( null, {
                    /* search: /^(?=[\\w\\d]{6,}$)(?=.*\\d)/ */
                    minLength: 5
                } );
            },

            /**
             * EMAIL String type
             *
             * @extends sap.ui.model.type.String
             *
             * @name util.Type.EMAIL
             */
            EMAIL: function () {
                return new sap.ui.model.type.String( null, {
                    search: /^(")?(?:[^\."])(?:(?:[\.])?(?:[\w\-!#$%&'*+/=?^_`{|}~]))*\1@(\w[\-\w]*\.){1,5}([A-Za-z]){2,6}$/
                } );
            },

            URL: function () {
                return new sap.ui.model.type.String( null, {
                    search: /(((^https?)|(^ftp)):\/\/((([\-\w]+\.)+\w{2,3}(\/[%\-\w]+(\.\w{2,})?)*(([\w\-\.\?\\\/+@&#;`~=%!]*)(\.\w{2,})?)*)|(localhost|LOCALHOST))\/?)/i
                } );
            },

            ALPHA: function () {
                return new sap.ui.model.type.String( null, {
                    search: /^[a-zA-Z_]+$/
                } );
            },

            ALPHANUM: function () {
                return new sap.ui.model.type.String( null, {
                    search: /^[a-zA-Z0-9_]+$/
                } );
            },

            IPADDRESS: function () {
                return new sap.ui.model.type.String( null, {
                    search: /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/
                } );
            },

            POSITIVNUM: function () {
                return new sap.ui.model.type.String( null, {
                    search: /^[0-9]+$/
                } );
            },

            REQUIRED: function () {
                return new sap.ui.model.type.String( null, {
                    minLength: 1
                } );
            }

        };

    }, /* bExport= */ true );