cordova.define("com.sap.mp.cordova.plugins.settings.AppSettings", function(require, exports, module) { 
    var exec = require("cordova/exec");



    /* Builds the url from the logon information
     * @private
     */

    
    function _getConnectionURL(info) {
        var context = info.registrationContext;
        var scheme = context.https ? "https" : "http";
        var host = context.serverHost + ":" + context.serverPort;
        var path = (context.resourcePath.length > 0 && context.resourcePath != 'null' && context.farmId.length > 0 && context.farmId!= 'null') ? (context.resourcePath + "/" + context.farmId + "/") : "";
        return scheme + "://" + host + "/" + path + "odata/applications/v1/" + sap.Logon.applicationId + "/Connections('" + info.applicationConnectionId + "')";
    };

    /*
     * Build a uril from the logon informatin for the purpose of creating a new login registatraion id.
     * @private 
    */
    function _getConnectionURLForRegistration(info) {
        var context = info.registrationContext;
        var scheme = context.https ? "https" : "http";
        var host = context.serverHost + ":" + context.serverPort;
        var path = (context.resourcePath.length > 0 && context.farmId.length > 0) ? (context.resourcePath + "/" + context.farmId + "/") : "";
        return scheme + "://" + host + "/" + path + "odata/applications/v1/" + sap.Logon.applicationId + "/Connections";
    };

        
    /*
     * Makes request to SMP server
     */
    function _request(request, successCallback, errorCallback) {
        var lmSuccess = function (info) {
            var url = _getConnectionURL(info);// + (request.path ? ("/" + request.path) : "");
            var operation = request.method;
            if (operation == 'undefined' || operation == null) {
              operation = "GET";
            }
            if (cordova.require("cordova/platform").id.indexOf("windows") === 0)  {
              sap.AuthProxy.sendRequest(operation,
                                      url,
                                      { "Accept": "application/json", "Content-Type": "application/json", "X-SMP-APPCID": info.applicationConnectionId },
                                      request.data,
                                      function (response) {
                                          successCallback(response);
                                      },
                                      function (response) {
                                          errorCallback(response);
                                      },
                                      info.registrationContext.user,
                                      info.registrationContext.password,
                                      0,
                                      null
                                      );
            } else {
              sap.Logon.getConfiguration( function(jsonconfig){
                
              var authConfig = JSON.parse(jsonconfig);
                
              sap.AuthProxy.sendRequest2(operation,
                                      url,
                                      { "Accept": "application/json", "Content-Type": "application/json" },
                                      request.data,
                                      function (response) {
                                          successCallback(response);
                                      },
                                      function (response) {
                                          errorCallback(response);
                                      },
                                      0,
                                      authConfig
                                      );
                          }, function(){}, "authentication");

              }

         }

        var lmError = function () {
            errorCallback({
                statusCode: 0,
                statusText: "Logon failed"
            });
        }

        sap.Logon.unlock(lmSuccess, lmError);
        
    };

    /** @namespace sap */

    /**
     * Used to access SMP application settings. 
     * @namespace
     * @alias AppSettings
     * @memberof sap
     * @see {@link http://dcx-pubs.sybase.com/index.html#smp0300/en/com.sybase.smp3.developer/doc/html/mdw1371795615579.html|Application Connection Properties}
     */
    module.exports = {

        "applicationConnectionId": "",
        createRegistration: function (successCB, errorCB) {
             _createRegistration(successCB, errorCB);
        },

        startSettings: function (successCB, errorCB, connectionData) {
            module.exports.getConfigPropertyMap(function (args) {
                var uploadLog = args['UploadLogs'];
                var logLevel = args['ConnectionLogLevel']; 
                if ((logLevel != 'NONE') && (uploadLog == true)) {
                    sap.Logger.upload(function () { }, function () { });
                }
                sap.Logger.setLogLevel(logLevel);
                var deviceType = args['DeviceType'];
                if (deviceType == undefined || deviceType == null || deviceType.toLowerCase() == 'unknown') {
                    if (device.platform == "iPhone" || device.platform == "iPad" || device.platform == "iPod touch" || device.platform == "iOS") {
                        deviceType = "iOS";
                    } else if (device.platform == "Android") {
                        deviceType = "Android";
                    } else {
                        deviceType = "Windows8";
                    }

                    sap.Settings.setConfigProperty({ "DeviceType": deviceType },
                                function (m) {
                                    successCB("Device Type Update Successful");
                                },
                                function (mesg) {
                                    errorCB("Device Type Update failed");
                                });

                };
                var jsonStringValue = JSON.stringify({"data":JSON.stringify(args)});
                successCB(jsonStringValue);
            },
            errorCB
            );
          
       },

/**
 *  This is a private function. End user will not use this plugin directly.
 *  This function gets list of all the blackliste features through featureVector policy from the server.
 *  @private
 * @param {function} successCB Function to invoke if the exchange is successful.
 * @param {function} errorCB Function to invoke if the exchange failed.
 **/
               
allFeatures: function (successCB, errorCB) {
    sap.Logon.unlock(function () {
                     sap.logon.Core.getSecureStoreObject(function (datastr) {
                                                        try {
                                                                var args = JSON.parse(datastr);
                                                                var featureVectorPolicyAllEnabled = args['FeatureVectorPolicyAllEnabled'];
                                                                if (featureVectorPolicyAllEnabled == true) {
                                                                    successCB(null);
                                                                } else {
                                                                    var featureVector = args.FeatureVectorPolicy;
                                                                    successCB(featureVector);
                                                                }
                                                           }
                                                         catch(e) {
                                                                errorCB(e.message);
                                                            }
                                                         },
                                                         
                                                         function () {
                                                            errorCB("Failed to retrive setting information");
                                                         },
                                                         "settingsdata");
                     },
                     function () {
                        errorCB("Failed to get Settings, make sure that you have done logon register succesfully");
                     });
    
    
},
    
/**
 *  This is a private function. End user will not use this plugin directly.
 *  This function gets feature specified in the name parameter.
 *  @private
 * @param (String} name Name of the feature to fetch.
 * @param {function} successCB Function to invoke if the exchange is successful.
 * @param {function} errorCB Function to invoke if the exchange failed.
 **/
               
               
getFeatureForName: function(successCB, errorCB, name) {
    module.exports.allFeatures(
                               function (featureVect) {
                                    if (featureVect == null) {
                                          successCB(null);
                                    } else {
                                            var feature = null;
                                            var vectorList = featureVect.results; //featureVect['features'];
                                            for (i = 0; i < vectorList.length; i++) {
                                              var vectorSubList = vectorList[i]['JSModule'].split(",");
                                              for (j=0; j< vectorSubList.length; j++) {
                               
                                                 if (vectorSubList[j] == name) {
                                                    feature = vectorList[i];
                                                    break;
                                                }
                                              }
                                              if (feature != null) //We have found a match
                                              {
                                                  break;
                                              }
                               
                                            }
                                            successCB(feature);
                                    }
                               },
                               function () {
                                    errorCB("Failed to get feature lists");
                               }
                               );
},
    
    
    /**
         * Retrieves a config property by name.
         * @param {string} name The property name
         * @param {function} successCallback Called with the value of the property.
         * @param {function} errorCallback Called with error object that contains status and statusText.
         * @example
         * sap.AppSettings.getConfigProperty("ApnsDeviceToken", function(token) {
         *    console.log("DeviceToken: " + token);
         * }, function(error) {
         *    alert("Failed to get setting. Status code" + error.statusCode + " text: " + error.statusText);
         * });
         */
        getConfigProperty: function (successCallback, errorCallback, name) {
            _request({
                path: name
            }, function (response) {
                 successCallback(JSON.parse(response.responseText).d[name]);
            }, errorCallback);
        },

        /**
         * Updates the provided Name-Vaule pairs of config properties.
         * @param {object} nameVals Object that contains name value pairs.
         * @param {function} successCallback Called if set is successful.
         * @param {function} errorCallback Called with error object that contains status and statusText.
         * @example  
         * sap.AppSettings.setConfigProperty({ "ApnsDeviceToken" : "mytoken" }, function() {
         *    console.log("Device token set");
         * }, function(error) {
         *    alert("Failed to set setting. Status code" + error.statusCode + " text: " + error.statusText);
         * });
         */
        setConfigProperty: function (nameVals, successCallback, errorCallback) {
            _request({
                method: "PUT",
                headers: {
                    "X-HTTP-METHOD": "MERGE"
                },
                data: JSON.stringify(nameVals)
            }, function (response) {
                successCallback();
            }, errorCallback);
        },

        /*
         * Returns all the settings in Name-Value pairs.
         * @param {function} successCallback Called with object that contains a collection of name value pairs.
         * @param {function} errorCallback Called with error object that contains status and statusText.
         * @example
         * sap.AppSettings.getConfigPropertyMap(function(properties) {
         *    for (var name in properties) {
         *       console.log("Property Name: " + name + " value: " + properties[name]);
         *     }
         * }, function(error) {
         *     alert("Failed to get settings. Status code" + error.statusCode + " text: " + error.statusText);
         * });
         * 
         */
        getConfigPropertyMap: function (successCallback, errorCallback) {
            _request({}, function (response) {
                var map = JSON.parse(response.responseText).d;
                delete map["__metadata"]; // remove metadata

                successCallback(map);
            }, errorCallback);
        },

        /**
         * Retrieves the application end-point with which the application can access business data.
         * @param {function} successCallback Called with the value of the ProxyApplicationEndpoint.
         * @param {function} errorCallback Called with error object that contains status and statusText.
         * @example
         * sap.AppSettings.getApplicationEndpoint(function(endpoint) {
         *    console.log("Endpoint: " + endpoint);
         * }, function(error) {
         *    alert("Failed to get setting. Status code" + error.statusCode + " text: " + error.statusText);
         * });
         * 
         */
        getApplicationEndpoint: function (successCallback, errorCallback) {
            module.exports.getConfigProperty("ProxyApplicationEndpoint", successCallback, errorCallback);
        },

        
    };
  


});
