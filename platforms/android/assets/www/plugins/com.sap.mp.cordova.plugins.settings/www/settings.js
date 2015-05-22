cordova.define("com.sap.mp.cordova.plugins.settings.Settings", function(require, exports, module) { // 3.7.1
var exec = require("cordova/exec");


/**
 * Provides settings exchange functionality
 *
 * @namespace
 * @alias Settings
 * @memberof sap
 */
var SettingsExchange = function () {};

SettingsExchange.prototype.connectionData   = null;
SettingsExchange.prototype.store            = null;
SettingsExchange.prototype.settingsSuccess  = null;
SettingsExchange.prototype.SettingsError    = null;
SettingsExchange.prototype.isInitialized    = false;


/**
 * Starts the settings exchange process upon onSapLogonSuccess event.
 * @private
 */
var doSettingExchange = function () {
    
    
    sap.Settings.isInitialized = true;
    var pd ="";
    sap.Logon.unlock(function (connectionInfo) {
                     if (typeof connectionInfo["registrationContext"] === 'undefined'){
                         // If registrationContext is not defined, we should assume that an SMP registration
                         // did not actually occur. This can happen if the resume event occurs while the
                         // app is not registered to SMP.
                         return;
                     }
                     var userName = connectionInfo["registrationContext"]["user"];
                     var password  = connectionInfo["registrationContext"]["password"];
                     var applicationConnectionId = connectionInfo["applicationConnectionId"];
                     var securityConfig = connectionInfo["registrationContext"]["securityConfig"];
                     var endpoint = connectionInfo["applicationEndpointURL"];
                     if (endpoint) {
                     
                         var keySSLEnabled = "false";
                         var splitendpoint = endpoint.split("/");
                         if (splitendpoint[0] == "https:")
                         {
                             keySSLEnabled="true";
                         }
                         if (securityConfig == null) {
                             securityConfig = "";
                         }
                         var burl = ""; 
                         for (var i=2; i<splitendpoint.length-2; i++){
                             burl += splitendpoint[i] +"/";
                         }
                         burl += splitendpoint[splitendpoint.length-2];
                         var appId = splitendpoint[splitendpoint.length-1];
                         pd = appId+userName+password;
                         connectionData = {
                             "keyMAFLogonOperationContextConnectionData": {
                                 "keyMAFLogonConnectionDataApplicationSettings":
                                 {
                                     "DeviceType":device.platform,
                                     "DeviceModel":device.model,
                                     "ApplicationConnectionId":applicationConnectionId
                                 },
                                 "keyMAFLogonConnectionDataBaseURL":burl
                             },
                             "keyMAFLogonOperationContextApplicationId":appId,
                             "keyMAFLogonOperationContextBackendUserName":userName,
                             "keyMAFLogonOperationContextBackendPassword":password,
                             "keyMAFLogonOperationContextSecurityConfig":securityConfig,
                             "keySSLEnabled":keySSLEnabled
                         };
                         sap.Settings.start(connectionData,
                                            function(mesg) {
                                                sap.Settings.isInitialized = true;
                                                sap.Logger.debug("Setting Exchange is successful "+mesg,"SMP_SETTINGS_JS",function(m){},function(m){});
                                            },
                                            function(mesg){
                                                sap.Logger.debug("Setting Exchange failed" + mesg,"SMP_SETTINGS_JS",function(m){},function(m){});
                                                sap.Settings.isInitialized = false;
                                            });
                         }
                     }
                     , function () {
                     sap.Logger.debug("unlock failed ","SMP_SETTINGS_JS",function(m){},function(m){});
                     }
                     );
    
    
};
if (cordova.require("cordova/platform").id.indexOf("windows") === 0)  {
   WinJS.Application.addEventListener("onSapLogonSuccess", doSettingExchange, false);
   WinJS.Application.addEventListener("onSapResumeSuccess", doSettingExchange, false);
} else {
   document.addEventListener("onSapLogonSuccess", doSettingExchange, false);
   document.addEventListener("onSapResumeSuccess", doSettingExchange, false);
} 


SettingsExchange.prototype.reset = function(key, sucessCB, errorCB)
{
    if ((typeof(sap.Settings.store) != undefined) && (sap.Settings.store != null)) {
        sap.Settings.store.removeItem(key, sucessCB, errorCB);
    } else {
        errorCB("Cannot access setting store");
    }
}

SettingsExchange.prototype.updateDeviceToken = function(devtoken) {
    var updateVals = "";
    if (device.platform == "Android") {
      updateVals = {"AndroidGcmPushEnabled":true,AndroidGcmRegistrationId:devtoken};
    }
    else if (device.platform == "iPhone" || device.platform == "iPad" || device.platform == "iPod touch" || device.platform == "iOS") {
                    updateVals = {"ApnsPushEnable":true,ApnsDeviceToken:devtoken};
    }
    sap.Settings.setConfigProperty(updateVals,function(){}, function(){});
}


/**
 * Starts the settings exchange.
 * @public
 * @memberof sap.Settings
 * @method start
 * @param {String} connectionData This example below shows the structure of the connection data.
 * @param {function} successCallback Function to invoke if the exchange is successful.
 * @param {function} errorCallback Function to invoke if the exchange failed.
 * @example
 * connectionData = {
 *      "keyMAFLogonOperationContextConnectionData": {
 *      "keyMAFLogonConnectionDataApplicationSettings":
 *      {
 *      "DeviceType":device.platform,
 *      "DeviceModel":device.model,
 *      "ApplicationConnectionId":"yourappconnectionid"
 *      },
 *      "keyMAFLogonConnectionDataBaseURL":"servername:port"
 *  },
 *  "keyMAFLogonOperationContextApplicationId":"yourapplicationid",
 *  "keyMAFLogonOperationContextBackendUserName":"yourusername",
 *  "keyMAFLogonOperationContextBackendPassword":"password",
 *  "keyMAFLogonOperationContextSecurityConfig":"securityConfigName",
 *  "keySSLEnabled":keySSLEnabled
 *  };
 * sap.Settings.start(connectionData, function(mesg) {
 *                                    
 *                                         sap.Logger.debug("Setting Exchange is successful "+mesg,"SMP_SETTINGS_JS",function(m){},function(m){});
 *                                     },
 *                                    function(mesg){
 *                                        sap.Logger.debug("Setting Exchange failed" + mesg,"SMP_SETTINGS_JS",function(m){},function(m){});
 *                                    });
 */
SettingsExchange.prototype.start = function (connectionData, successCallback, errorCallback) {
    sap.Settings.settingsSuccess = successCallback;
    sap.Settings.SettingsError = errorCallback;
    sap.Settings.connectionData = connectionData;
    sap.Logger.debug("Accessing the data from vault","SMP_SETTINGS_JS",function(m){},function(m){});
    sap.logon.Core.getSecureStoreObject( sap.Settings.getStoreDataSuccess, sap.Settings.getStoreDataError, "settingsdata");
    
    
};
/**
 *  This function return true if the feature is allowed and false if feature is not permitted.
 *  @public
 * @param (String} name Name of the feature to fetch.
 * @param {function} successCallback Function to invoke if the exchange is successful.
 * @param {function} errorCallback Function to invoke if the exchange failed.
 **/
               
SettingsExchange.prototype.isFeatureEnabled = function (name, successCallback, errorCallback) {
    if (!name) {
        successCallback(false);
    } else {
        var callGetFeatureForName = function() {
            sap.Settings.getFeatureForName(function (feature) {
                if (feature == null) {
                    successCallback(true);
                } else {
                    successCallback(false);
                }
            },
            function () {
                errorCallback();
            }, name);
        }

        // The logon plugin must be initialized before callGetFeatureForName
        if (sap.logon.Core.isInitialized()) {
            callGetFeatureForName();
        } else {
            var logonSuccessCallback = function() {
                document.removeEventListener("onSapLogonSuccess", logonSuccessCallback);
                callGetFeatureForName();
            }
            // The logon plugin has not been initialized yet, wait for it to be.
            document.addEventListener("onSapLogonSuccess", logonSuccessCallback);
        }
    }
}






/**
 *  This is a private function. End user will not use this plugin directly.
 *  This function gets called after the start function is able to read the current settings from the secured storage.
 *  @private
 *  @param {String} value This is the value of the current setting exchange stored in the secured store.
 **/

SettingsExchange.prototype.getStoreDataSuccess  = function(value){
    storedSettings = value;
    sap.Logger.debug("Exchanging the data","SMP_SETTINGS_JS",function(m){},function(m){});
    sap.Settings.startSettings(sap.Settings.SettingsExchangeDone,
         sap.Settings.SettingsExchangeError,
         [JSON.stringify(connectionData),storedSettings]);
    
}

/**
 *  This is a private function. End user will not use this plugin directly.
 *  This function is called after the start function is unable to read the current settings from the secured storage.
 *  @private
 *  @param {String} message This is the error message produced by the encrypted storage.
 **/
SettingsExchange.prototype.getStoreDataError  = function(mesage){
    sap.Logger.debug("Setting exchange failed to read data store: Proceeding without data",function(m){},function(m){});
}


/**
 *  This is a private function. End user will not use this plugin directly.
 *  This function is called after the settings exchange completes succefully.
 *  @private
 *  @param {String} message This is the  message produced when the settings plugin completes successfully.
 **/

SettingsExchange.prototype.SettingsExchangeDone = function(message) {
    sap.Logger.debug("Setting Exchange Success","SMP_SETTINGS_JS",function(m){},function(m){});
    var jsondata =  JSON.parse(message);
    settingsString = jsondata["data"];
    sap.logon.Core.setSecureStoreObject(sap.Settings.SettingsWriteDone,sap.Settings.SettingsWriteError,"settingsdata",settingsString); 
    if (sap.Settings.settingsSuccess != null) {
        sap.Logger.debug("Setting exchange successful","SMP_SETTINGS_JS",function(m){},function(m){});
        sap.Settings.settingsSuccess("Exchange Completed");
        /* Windows8 changes */
         eventId = "settingsDone";
         if (cordova.require("cordova/platform").id.indexOf("windows") === 0) {
                WinJS.Application.queueEvent({
                    type: eventId,
                    detail: { 'id': eventId, 'args': "SettingCompleted" }
                });
            }
            else {
                var event = new CustomEvent(eventId, { 'detail': { 'id': eventId, 'args': "SettingCompleted" } });
                setTimeout(function () {
                    document.dispatchEvent(event);
                }, 0);
            }
    }
}

/**
 *  This is a private function. End user will not use this plugin directly.
 *  This function is called after the settings exchange completes succefully
 *  @private
 *  @param {String} message This is the error message produced when the settings plugin has an error.
 **/
SettingsExchange.prototype.SettingsExchangeError = function(message) {
    sap.Logger.error("Setting Exchange failed calling the error callback funciton","SMP_SETTINGS_JS",function(m){},function(m){});
    if (sap.Settings.SettingsError != null) {
        sap.Settings.SettingsError("Exchange Failed");
    }
}

/**
 *  This is a private function. End user will not use this plugin directly.
 *  This function is called after the setting data is stored successfully.
 *  @private
 *  @param {String} message This is the message produced upon successful storing of settings to the encrypted store.
 **/
SettingsExchange.prototype.SettingsWriteDone  = function(message) {
    sap.Logger.debug("Setting stored","SMP_SETTINGS_JS",function(m){},function(m){});
    
}

/**
 *  This is a private function. End user will not use this plugin directly.
 *  This function is called after the storing of the setting data fails.
 *  @private
 *  @param {String} message This is the message produced upon failure to store the settings to the encrypted store.
 **/
SettingsExchange.prototype.SettingsWriteError  = function(message) {
    sap.Logger.error("Setting store failed","SMP_SETTINGS_JS",function(m){},function(m){});
}

/**
 *  This is a private function. End user will not use this plugin directly.
 *  This function is called after the deviceready. This uploads the logs to the server.
 *  @private
 *  @param {boolean} uploadLog This indicates whether the upload log is currently enabled or disbled.
 **/
SettingsExchange.prototype.logLevelUpdated  = function(logLevel)
{
    sap.Logger.setLogLevel(logLevel, sap.Settings.LogLevelSetSuccess, sap.Settings.LogLevelSetFailed);
    sap.Logger.upload(sap.Settings.logUploadedSuccess, sap.Settings.logUploadFailed);
}

/**
 *  This is a private function. End user will not use this plugin directly.
 *  This function is called when the log upload succeeds.
 *  @private
 *  @param {mesg} logupload message
 **/
SettingsExchange.prototype.LogLevelSetSuccess = function(mesg){
    sap.Logger.debug("Log level set successful","SMP_SETTINGS_JS",function(m){},function(m){});
}
/**
 *  This is a private function. End user will not use this plugin directly.
 *  This function is called when the log upload succeeds.
 *  @private
 *  @param {mesg} logupload message
 **/
SettingsExchange.prototype.LogLevelSetFailed = function(mesg){
    sap.Logger.error("Log level set failed","SMP_SETTINGS_JS",function(m){},function(m){});
}

/**
 *  This is a private function. End user will not use this plugin directly.
 *  This function is called when the log upload succeeds.
 *  @private
 *  @param {mesg} logupload message
 **/
SettingsExchange.prototype.logUploadedSuccess = function(mesg){
    sap.Logger.debug("Log upload successful","SMP_SETTINGS_JS",function(m){},function(m){});
}
/**
 *  This is a private function. End user will not use this plugin directly.
 *  This function is called when the log upload fails.
 *  @private
 *  @param {mesg} logupload failure message
 **/
SettingsExchange.prototype.logUploadFailed = function(mesg) {
    sap.Logger.error("upload log failed","SMP_SETTINGS_JS",function(m){},function(m){});
    
}



module.exports = new SettingsExchange();


});
