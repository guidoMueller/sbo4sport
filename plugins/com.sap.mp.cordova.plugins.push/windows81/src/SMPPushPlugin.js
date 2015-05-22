
    var cordova = require('cordova/exec/proxy');
    module.exports  = {


    pushNotifications: Windows.Networking.PushNotifications,
    channelinstance: null,
    notificatoinProcessor: null,
    background: Windows.ApplicationModel.Background,
    pushNotifications: Windows.Networking.PushNotifications,
    notifications: Windows.UI.Notifications,
    TaskName: "PushTask",
    TaskEntryPoint: "js\\BackgroundPush.js",

        /*
         * This function will create a push channel and the channel uri will be updated based on teh implemenation of sap.PushModule.updateDeviceToken method (if provided)
         * This function should not be called directly.
         * Private
        */
    registerForNotificationTypes: function (successCB, errorCB, processNotification) {
        // backgroundTaskComplete();
        sap.PushModule.background.BackgroundExecutionManager.requestAccessAsync().done(function (result) {
            // Make sure the app can even receive raw notifications
            if (result !== sap.PushModule.background.BackgroundAccessStatus.denied && result !== sap.PushModule.background.BackgroundAccessStatus.unspecified) {

                var channelOperation = sap.PushModule.pushNotifications.PushNotificationChannelManager.createPushNotificationChannelForApplicationAsync();
                //console.log(channelOperation.done);
                channelOperation.done(
                    function complete(newChannel) {
                        //console.log("Registration completed");
                        sap.PushModule.channelinstance = newChannel;
                        sap.PushModule.channelinstance.addEventListener("pushnotificationreceived", sap.PushModule.pushNotificationReceivedHandler);
                        sap.PushModule.notificatoinProcessor = sap.Push.ProcessNotificationForUser;
                        if ((sap.PushModule.updateDeviceToken != undefined) && (sap.PushModule.updateDeviceToken != null) && (typeof sap.PushModule.updateDeviceToken === "function"))
                        {
                            sap.PushModule.updateDeviceToken(sap.PushModule.channelinstance.uri, successCB, errorCB);
                        } else {
                            console.log("sap.PushModule.updateDeviceToken is not defined");
                        }
                        sap.PushModule.RegisterBackgroundTask();
                        
                        sap.Push.RegisterSuccess("registration success");
                    },

                    function error(msg) {
                        console.log("Registration error");
                        errorCB("Failed to register with message: " + msg);
                        sap.Push.RegisterFailed("Failed to register with message: " + msg);
                    },
                    function progress() {
                        console.log("Registration is in progress");
                    }

                 )
            } else {
                errorCB("Raw notification access denied");
            };
        })
    },

    
        /* 
         * This function closes any open registration channel. This will be called when unregister for notification is triggered.
         * @private
        */
    unregisterForNotification: function (successCB) {
        // sap.PushModule.pushNotifications.PushNotificationChannelManager.closeNotificationChannel();
        sap.PushModule.closeNotificationChannel(successCB, successCB);
        
    },


        /*
        * This function is called when a background prush notificatieon is arrived.
        * @private
        */
    RegisterBackgroundTask: function () {
        sap.PushModule.background.BackgroundExecutionManager.requestAccessAsync().done(function (result) {
            // Make sure the app can even receive raw notifications
            if (result !== sap.PushModule.background.BackgroundAccessStatus.denied && result !== sap.PushModule.background.BackgroundAccessStatus.unspecified) {

                // Clean up the registered task just 
                sap.PushModule.unregisterBackgroundTask();

                // Only open a new channel if you haven't already done so
                if (!sap.PushModule.channelinstance) {
                    sap.PushModule.openNotificationsChannel().done(sap.PushModule.registerBackgroundTask);
                } else {
                    sap.PushModule.registerBackgroundTask();
                }
            } else {
                console.log && console.log("Lock screen access is denied", "sample", "status");
            }
        }, function (e) {
            console.log && console.log("An error occurred while requesting lock screen access.", "sample", "error");
        });
    },

    closeNotificationChannel: function (successCB, errorCB) {
        if (sap.PushModule.channelinstance == null) {
            errorCB("The channel is not opened or invalid");
        } else {
            sap.PushModule.channelinstance.close();
            successCB("The registration channel closed successfully");
        }
    },

        /*
         * This is a default implementation for updating the SMP server with the registration uri recieved from the WNS notfication server.
         * If the push plugin is not working with SMP server, this fuction should be custom defined.
         * @public
         * @param urri {string} the channel uri recieved form the the openchannel call.
         * @param successCB {function} the success callback function
         * @param errorCB {function} the error callback function.
        */
    updateDeviceToken: function (uri, successCB, errorCB) {
        sap.Settings.setConfigProperty({ "WnsChannelURI": uri, "WnsPushEnable": true },
                            function (m) {
                                successCB("Registration Successful");
                            },
                            function (mesg) {
                                errorCB("Failed to register channel uri with server");
                            });
    },

        /*
        * @private
        * This funciton process the notificaitn recieved.
        */
    pushNotificationReceivedHandler: function (e) {
        var notificationTypeName = "";
        var notificationPayload = null;
        switch (e.notificationType) {
            // You can get the toast, tile, or badge notification object.
            // In this example, we take the XML from the notification.
            case sap.PushModule.pushNotifications.PushNotificationType.toast:
                notificationTypeName = "Toast";
                notificationPayload = e.toastNotification.content.getXml();
                break;
            case sap.PushModule.pushNotifications.PushNotificationType.tile:
                notificationTypeName = "Tile";
                notificationPayload = e.tileNotification.content.getXml();
                break;
            case sap.PushModule.pushNotifications.PushNotificationType.badge:
                 
                notificationTypeName = "Badge";
                notificationPayload = e.badgeNotification.content.getXml();
                
                var Notifications = Windows.UI.Notifications;

                var badgeAttributes = e.badgeNotification.content.getElementsByTagName("badge");
                var count = badgeAttributes[0].getAttribute("value");
               

                break;
            case sap.PushModule.pushNotifications.PushNotificationType.raw:
                notificationTypeName = "raw";
                notificationPayload = e.rawNotification.content;
        }
        if (notificationPayload != null) {
            if (sap.PushModule.notificatoinProcessor != null) {
                sap.PushModule.notificatoinProcessor(notificationPayload);
            } else {
                console.log("Notification process funciton is not provided");
            }
        }
        e.cancel = true;
    },
        /*
         * This function will be called as part of the backgroudn notification.
         * @private
        */
    onActivatedHandler: function (e) {
        e.setPromise(WinJS.UI.processAll().then(function () {
            if (e.detail.kind === Windows.ApplicationModel.Activation.ActivationKind.launch && e.detail.arguments !== "") {
                // If there is some payload sent by the toast, go to Scenario 5
                var settings = Windows.Storage.ApplicationData.current.localSettings;
                settings.values["PushTask"] = e.detail.arguments;
                
            } else {
                var settings = Windows.Storage.ApplicationData.current.localSettings;
                settings.values["PushTask"] = "{Payload is empty}";
            }
        }));
   },

        /*
        * This function is called to registere backgroudn task
        * @private
        */
    registerBackgroundTask: function () {
        // Register the background task for raw notifications
        var taskBuilder = new sap.PushModule.background.BackgroundTaskBuilder();
        var trigger = new sap.PushModule.background.PushNotificationTrigger();
        taskBuilder.setTrigger(trigger);
        taskBuilder.taskEntryPoint = sap.PushModule.TaskEntryPoint;
        taskBuilder.name = sap.PushModule.TaskName;

        try {
            var task = taskBuilder.register();
            //task.oncompleted = backgroundTaskComplete;
            task.addEventListener("completed", sap.PushModule.backgroundTaskComplete);
            console.log && console.log("Background task registered", "sample", "status");
        } catch (e) {
            console.log && console.log("Registration error: " + e.message, "sample", "error");
            sap.PushModule.unregisterBackgroundTask();
        }
    },

        /*
        * This function unregister application frm the background task
        * @private
        */

    unregisterBackgroundTask: function () {
        var iter = sap.PushModule.background.BackgroundTaskRegistration.allTasks.first();
        while (iter.hasCurrent) {
            var task = iter.current.value;
            if (task.name === sap.PushModule.TaskName) {
                task.unregister(true);
                return true;
            }
            iter.moveNext();
        }
        return false;
    },

        /*
        * This function reset the notification after it has recieved and processed.
        * @private
        */
    resetBadge: function (callback) {
        var notifications = Windows.UI.Notifications;
        notifications.BadgeUpdateManager.createBadgeUpdaterForApplication().clear();
        notifications.TileUpdateManager.createTileUpdaterForApplication().clear();
        //notifications.ToastNotificationManager.createToastUpdaterForApplication().clear();
        callback("Cleared notification");

    },

        /*
        * This function is used to get the background notification recieved afer applicatoin is started up. This funciton is not directly called. It is called bu push.js
        * @private
        */
    checkForNotification: function (callback) {
        var settings = Windows.Storage.ApplicationData.current.localSettings;
        callback(settings.values["PushTask"]);
        
    },

        /*
        * This is background task complete routine. Not called directly.
        * @private
        */
    backgroundTaskComplete: function () {
        // Retrieve state that is set when a raw notification is received
        try {
            // This sample assumes the payload is a string, but it can be of any type.
            var settings = Windows.Storage.ApplicationData.current.localSettings;
            console.log("Background task triggered by raw notification with payload = " + settings.values["PushTask"] + " has completed!", "sample", "status");
            if (sap.PushModule.notificatoinProcessor != null) {
                sap.PushModule.notificatoinProcessor(settings.values["PushTask"]);
            } else {
                console.log("Notification process funciton is not provided");
            }
        } catch (e) {
            console.log("Error while processing background task: " + e.message, "", "error");
        }
    }

    }

    require("cordova/windows8/commandProxy").add("SMPPushPlugin", module.exports);

