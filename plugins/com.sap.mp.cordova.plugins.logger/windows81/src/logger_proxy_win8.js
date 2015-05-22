    var exec = require("cordova/exec");

    module.exports = {
        _loglevel: -1,
        _fileName: "test.txt",
        _file: null,
        _WinConsole: window.console,
        _nativeLoggerInstance: new SAP.Logger.Logger(),
        _loggerId: "kapsel",
        setLogLevel: function (successCB, errorCB, args) {
            loglevel = args[0];
            module.exports._loglevel = loglevel;
            module.exports._nativeLoggerInstance.setLogLevel(loglevel).then(
              function () { successCB("Loglevel is set"); }, function () { errorCB(); });;

        },

        getLogLevel: function(sucessCB, errorCB, arg) {
            sucessCB(module.exports._loglevel);
                            },

        getLogger: function(sucessCB, errorCB, logName) {
            return new LoggerPlugin.Logger().getLogger(logName);
                    },



        logInfo: function (successCB, errorCB, args)
        {
            logtext = args[0];
            tag = args[1];
           module.exports._nativeLoggerInstance.logInfo(module.exports._loggerId, tag + ": " + logtext).then(
              function () { successCB(); }, function () { errorCB(); });
        },

        logWarning: function (successCB, errorCB, args) {
            logtext = args[0];
            tag = args[1];
            module.exports._nativeLoggerInstance.logWarning(module.exports._loggerId, tag + ": " + logtext).then(
              function () { successCB(); }, function () { errorCB(); });
           
        },

        logError: function (successCB, errorCB, args) {
            logtext = args[0];
            tag = args[1];
            module.exports._nativeLoggerInstance.logError(module.exports._loggerId, tag + ": " + logtext).then(
              function () { successCB(); }, function () { errorCB(); });

        },

        logFatal: function (successCB, errorCB, args) {
            logtext = args[0];
            tag = args[1];
            module.exports._nativeLoggerInstance.logFatal(module.exports._loggerId, tag + ": " + logtext).then(
              function () { successCB(); }, function () { errorCB(); });
        },
        logDebug: function (successCB, errorCB, args) {
            logtext = args[0];
            tag = args[1];
            module.exports._nativeLoggerInstance.logDebug(module.exports._loggerId, tag + ": " + logtext).then(
              function () {
                  successCB();
              },
            function () {
                errorCB();
            });
        },
        log: function (successCB, errorCB, args) {
            logtext = args[0];
            tag = args[1];
            module.exports._nativeLoggerInstance.log(module.exports._loggerId, tag + ": " + logtext).then(
              function () { successCB(); }, function () { errorCB(); });
        },

        uploadLog: function (successCB, errorCB, connectioninfo) {
            // url = "http://smpqa12-02.sybase.com/logFile/appconnectionid";
            var context = connectioninfo[0].registrationContext;
            var scheme = context.https ? "https" : "http";
            var host = context.serverHost + ":" + context.serverPort;
            var url = scheme + "://" + host + "/clientlogs/";
            //var url = scheme+"://"+host + "/logFile/" + connectioninfo[0].applicationConnectionId;
            module.exports._nativeLoggerInstance.uploadLog(url, connectioninfo[0].applicationConnectionId, connectioninfo[0].registrationContext.mobileUser, connectioninfo[0].registrationContext.password).then(function () { successCB(); }, function () { errorCB(); });
        }
    }

    require("cordova/windows8/commandProxy").add("Logging", module.exports);


