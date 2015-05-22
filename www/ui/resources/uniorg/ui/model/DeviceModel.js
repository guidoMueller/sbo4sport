sap.ui.define( ["sap/ui/model/json/JSONModel"],
    function ( JSONModel ) {
        "use strict";

        return JSONModel.extend( "uniorg.ui.model.DeviceModel", {

            /**
             * Creates a bindable device model with predefined data
             * the data has following properties:
             * <ul>
             *    <li>isCordova - if the app is running inside FioriClient|Cordova|PhoneGap container</li>
             *    <li>isTouch - if the device has touch support</li>
             *    <li>isNoTouch - if the device has no touch support</li>
             *    <li>isPhone - if the device is a phone</li>
             *    <li>isNoPhone - if the device is no phone</li>
             * </ul>
             *
             * @class
             * @public
             * @alias sap.ui.demo.mdtemplate.model.Device
             */
            constructor: function () {
                JSONModel.call( this, {
                    isCordova:        (typeof window.cordova !== "undefined"),
                    isSAPFioriClient: window["uniorg-ui-issapfioriclient"],
                    isTouch:          sap.ui.Device.support.touch,
                    isNoTouch:        !sap.ui.Device.support.touch,
                    isPhone:          sap.ui.Device.system.phone,
                    isNoPhone:        !sap.ui.Device.system.phone,
                    // move to formatter
                    listMode:         sap.ui.Device.system.phone ? "None" : "SingleSelectMaster",
                    listItemType:     sap.ui.Device.system.phone ? "Active" : "Inactive",
                    listItemHeight:   sap.ui.Device.support.touch ? "18rem" : "16rem"
                } );
                this.setDefaultBindingMode( "OneWay" );
            }

        } );

    }, /* bExport= */ true );