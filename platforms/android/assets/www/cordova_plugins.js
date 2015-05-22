cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/com.sap.mp.cordova.plugins.authproxy/www/authproxy.js",
        "id": "com.sap.mp.cordova.plugins.authproxy.AuthProxy",
        "clobbers": [
            "sap.AuthProxy"
        ]
    },
    {
        "file": "plugins/com.sap.mp.cordova.plugins.cachemanager/www/cachemanager.js",
        "id": "com.sap.mp.cordova.plugins.cachemanager.CacheManager",
        "clobbers": [
            "sap.CacheManager"
        ]
    },
    {
        "file": "plugins/com.sap.mp.cordova.plugins.logger/www/logger.js",
        "id": "com.sap.mp.cordova.plugins.logger.Logging",
        "clobbers": [
            "sap.Logger"
        ]
    },
    {
        "file": "plugins/com.sap.mp.cordova.plugins.odata/www/OData.js",
        "id": "com.sap.mp.cordova.plugins.odata.OData",
        "clobbers": [
            "window.sap.OData"
        ]
    },
    {
        "file": "plugins/com.sap.mp.cordova.plugins.odata/www/OfflineStore.js",
        "id": "com.sap.mp.cordova.plugins.odata.OfflineStore",
        "clobbers": [
            "window.sap.OfflineStore"
        ]
    },
    {
        "file": "plugins/com.sap.mp.cordova.plugins.push/www/push.js",
        "id": "com.sap.mp.cordova.plugins.push.Push",
        "clobbers": [
            "sap.Push"
        ]
    },
    {
        "file": "plugins/com.sap.mp.cordova.plugins.toolbar/www/toolbar.js",
        "id": "com.sap.mp.cordova.plugins.toolbar.toolbar",
        "clobbers": [
            "window.sap.Toolbar"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.network-information/www/network.js",
        "id": "org.apache.cordova.network-information.network",
        "clobbers": [
            "navigator.connection",
            "navigator.network.connection"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.network-information/www/Connection.js",
        "id": "org.apache.cordova.network-information.Connection",
        "clobbers": [
            "Connection"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.device/www/device.js",
        "id": "org.apache.cordova.device.device",
        "clobbers": [
            "device"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.inappbrowser/www/inappbrowser.js",
        "id": "org.apache.cordova.inappbrowser.inappbrowser",
        "clobbers": [
            "window.open"
        ]
    },
    {
        "file": "plugins/com.sap.mp.cordova.plugins.i18n/www/i18n.js",
        "id": "com.sap.mp.cordova.plugins.i18n.i18n"
    },
    {
        "file": "plugins/org.apache.cordova.dialogs/www/notification.js",
        "id": "org.apache.cordova.dialogs.notification",
        "merges": [
            "navigator.notification"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.dialogs/www/android/notification.js",
        "id": "org.apache.cordova.dialogs.notification_android",
        "merges": [
            "navigator.notification"
        ]
    },
    {
        "file": "plugins/com.sap.mp.cordova.plugins.logon/www/common/modules/MAFLogonCorePlugin.js",
        "id": "com.sap.mp.cordova.plugins.logon.LogonCore",
        "clobbers": [
            "sap.logon.Core"
        ]
    },
    {
        "file": "plugins/com.sap.mp.cordova.plugins.logon/www/common/modules/i18n.js",
        "id": "com.sap.mp.cordova.plugins.logon.LogonI18n",
        "clobbers": [
            "sap.logon.i18n"
        ]
    },
    {
        "file": "plugins/com.sap.mp.cordova.plugins.logon/www/common/modules/Utils.js",
        "id": "com.sap.mp.cordova.plugins.logon.LogonUtils",
        "clobbers": [
            "sap.logon.Utils"
        ]
    },
    {
        "file": "plugins/com.sap.mp.cordova.plugins.logon/www/common/modules/StaticScreens.js",
        "id": "com.sap.mp.cordova.plugins.logon.LogonStaticScreens",
        "clobbers": [
            "sap.logon.StaticScreens"
        ]
    },
    {
        "file": "plugins/com.sap.mp.cordova.plugins.logon/www/common/modules/DynamicScreens.js",
        "id": "com.sap.mp.cordova.plugins.logon.LogonDynamicScreens",
        "clobbers": [
            "sap.logon.DynamicScreens"
        ]
    },
    {
        "file": "plugins/com.sap.mp.cordova.plugins.logon/www/common/modules/LogonController.js",
        "id": "com.sap.mp.cordova.plugins.logon.Logon",
        "clobbers": [
            "sap.Logon"
        ]
    },
    {
        "file": "plugins/com.sap.mp.cordova.plugins.logon/www/common/modules/InAppBrowserUI.js",
        "id": "com.sap.mp.cordova.plugins.logon.LogonIabUi",
        "clobbers": [
            "sap.logon.IabUi"
        ]
    },
    {
        "file": "plugins/com.sap.mp.cordova.plugins.logon/www/common/modules/LogonJsView.js",
        "id": "com.sap.mp.cordova.plugins.logon.LogonJsView",
        "clobbers": [
            "sap.logon.LogonJsView"
        ]
    },
    {
        "file": "plugins/com.sap.mp.cordova.plugins.settings/www/settings.js",
        "id": "com.sap.mp.cordova.plugins.settings.Settings",
        "clobbers": [
            "sap.Settings"
        ]
    },
    {
        "file": "plugins/com.sap.mp.cordova.plugins.settings/www/appsettings.js",
        "id": "com.sap.mp.cordova.plugins.settings.AppSettings",
        "merges": [
            "sap.Settings"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "com.sap.mp.cordova.plugins.authproxy": "3.7.1",
    "com.sap.mp.cordova.plugins.cachemanager": "3.7.1",
    "com.sap.mp.cordova.plugins.logger": "3.7.1",
    "com.sap.mp.cordova.plugins.odata": "3.7.1",
    "com.sap.mp.cordova.plugins.push": "3.7.1",
    "com.sap.mp.cordova.plugins.toolbar": "3.7.1",
    "org.apache.cordova.network-information": "0.2.15",
    "com.sap.mp.cordova.plugins.corelibs": "3.7.1",
    "org.apache.cordova.device": "0.3.0",
    "org.apache.cordova.inappbrowser": "0.3.4-patched",
    "com.sap.mp.cordova.plugins.i18n": "3.7.1",
    "com.sap.mp.cordova.plugins.online": "3.7.1",
    "org.apache.cordova.dialogs": "0.3.0",
    "com.sap.mp.cordova.plugins.logon": "3.7.1",
    "com.sap.mp.cordova.plugins.settings": "3.7.1"
}
// BOTTOM OF METADATA
});