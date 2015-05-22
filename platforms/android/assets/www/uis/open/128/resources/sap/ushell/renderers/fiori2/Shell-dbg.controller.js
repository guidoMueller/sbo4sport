// Copyright (c) 2013 SAP AG, All Rights Reserved
(function () {
    "use strict";
    /*global jQuery, sap, console, location, window, f2p, document, setTimeout*/

    jQuery.sap.require("sap.ui.core.IconPool");
    setTimeout(function () {
        jQuery.sap.require("sap.ushell.renderers.fiori2.launchpad.DashboardManager");
    }, 10);

    /* dont delay these cause they are needed for direct bookmarks */
    jQuery.sap.require("sap.ushell.services.Message");
    jQuery.sap.require("sap.ushell.services.ShellNavigation");
    jQuery.sap.require("sap.ushell.services.AppConfiguration");
    jQuery.sap.require("sap.ushell.renderers.fiori2.History");
    jQuery.sap.require("sap.ushell.ui.launchpad.LoadingDialog");
    jQuery.sap.require("sap.ushell.renderers.fiori2.AccessKeysHandler");
    // create global model and add some demo data
    var enableHashChange = true,
        mobile = sap.ui.Device.system.phone,
        oUserRecentsService,
        oModel = new sap.ui.model.json.JSONModel({
            groups : [],
            animationRendered : false,
            title : "My demo title",
            searchAvailable: false,
            rtl: false,
            personalization: true,
            searchTerm: "",
            states : {
                "home" : {
                    "stateName" : "home",
                    "showCurtain" : false,
                    "headerHiding" : false,
                    "headerVisible" : true,
                    "showCatalog" : false,
                    "showPane" : false,
                    "headItems" : ["configBtn"],
                    "headEndItems" : ["sf"],
                    "search" : "",
                    "paneContent" : [],
                    "actions" : ["ContactSupportBtn", "loginDetails", "hideGroupsBtn", "logoutBtn"]
                },
                "app" : {
                    "stateName" : "app",
                    "showCurtain" : false,
                    "headerHiding" : true,
                    "headerVisible" : true,
                    "headEndItems" : ["sf"],
                    "showCatalog" : false,
                    "showPane" : false,
                    "search" : "",
                    "headItems" : ["homeBtn"],
                    "actions" : ["ContactSupportBtn", "aboutBtn", "loginDetails", "logoutBtn"],
                    "shellActions": ["ContactSupportBtn", "aboutBtn", "loginDetails", "logoutBtn"] //when opening an app, take the original actions from here
                },
                "minimal" : {
                    "stateName" : "minimal",
                    "showCurtain" : false,
                    "headerHiding" : false,
                    "headerVisible" : true,
                    "headEndItems" : [],
                    "showCatalog" : false,
                    "showPane" : false,
                    "headItems" : [],
                    "actions" : ["ContactSupportBtn", "aboutBtn", "loginDetails", "logoutBtn"],
                    "shellActions": ["ContactSupportBtn", "aboutBtn", "loginDetails", "logoutBtn"] //when opening an app, take the original actions from here
                },
                "standalone" : {
                    "stateName" : "standalone",
                    "showCurtain" : false,
                    "headerHiding" : true,
                    "headerVisible" : true,
                    "headEndItems" : [],
                    "showCatalog" : false,
                    "showPane" : false,
                    "headItems" : [],
                    "actions" : ["ContactSupportBtn", "aboutBtn"],
                    "shellActions": ["ContactSupportBtn", "aboutBtn"] //when opening an app, take the original actions from here
                },
                "embedded" : {
                    "stateName" : "embedded",
                    "showCurtain" : false,
                    "headerHiding" : true,
                    "headerVisible" : true,
                    "headEndItems" : ["standardActionsBtn"],
                    "showCatalog" : false,
                    "showPane" : false,
                    "headItems" : [],
                    "actions" : ["ContactSupportBtn", "aboutBtn"],
                    "shellActions": ["ContactSupportBtn", "aboutBtn"] //when opening an app, take the original actions from here
                },
                "headerless" : {
                    "stateName" : "headerless",
                    "showCurtain" : false,
                    "headerHiding" : true,
                    "headerVisible" : false,
                    "headEndItems" : [],
                    "showCatalog" : false,
                    "showPane" : false,
                    "headItems" : [],
                    "actions" : [],
                    "shellActions": []//when opening an app, take the original actions from here
                },
//                "historyScreen" : {
//                    "stateName" : "historyScreen",
//                    "showCurtain" : true,
//                    "headerHiding" : false,
//                    "showCatalog" : false,
//                    "search" : "",
//                    "curtainContent" : ["searchHistoryPage"],
//                    "paneCurtainContent" : ["searchFilterPage"]
//                },
//                "searchResults" : {
//                    "stateName" : "searchResults",
//                    "showCurtain" : true,
//                    "headerHiding" : false,
//                    "showCatalog" : false,
//                    "search" : "",
//                    "curtainContent" : ["searchResultPage"],
//                    "paneCurtainContent" : ["searchFilterPage"]
//                },
//                "suggestions" : {
//                    "stateName" : "suggestions",
//                    "showCurtain" : true,
//                    "headerHiding" : false,
//                    "showCatalog" : false,
//                    "search" : "",
//                    "curtainContent" : ["suggestionResultPage"],
//                    "paneCurtainContent" : ["searchFilterPage"]
//                },
                "catalog" : {
                    "stateName" : "catalog",
                    "showCurtain" : false,
                    "headerHiding" : true,
                    "headerVisible" : true,
                    "headEndItems" : ["sf"],
                    "showCatalog" : true,
                    "showPane" : false,
                    "search" : "",
                    "headItems" : ["homeBtn"],
                    "actions" : ["ContactSupportBtn", "loginDetails", "logoutBtn"]
                },
                "catalogApp" : {
                    "stateName" : "catalogApp",
                    "showCurtain" : false,
                    "headerHiding" : true,
                    "headerVisible" : true,
                    "headEndItems" : ["sf"],
                    "showCatalog" : false,
                    "showPane" : false,
                    "search" : "",
                    "headItems" : ["backBtn"],
                    "actions" : ["ContactSupportBtn", "aboutBtn", "loginDetails", "logoutBtn"],
                    "shellActions": ["ContactSupportBtn", "aboutBtn", "loginDetails", "logoutBtn"] //when opening an app, take the original actions from here
                }
            }
        }),
        bCloseOverlayByFunction = false,
        oConfig = {},
        //allowed application state list that are allowed to be configured by oConfig.appState property
        allowedAppStates = ['minimal', 'app', 'standalone','embedded','headerless'];

    oModel.setSizeLimit(10000); // override default of 100 UI elements on list bindings

    /**
     * @name sap.ushell.renderers.fiori2.Shell
     * @extends sap.ui.core.mvc.Controller
     * @public
     */
    sap.ui.controller("sap.ushell.renderers.fiori2.Shell", {

        catalogPageId : "catalogPage",

        /**
         * SAPUI5 lifecycle hook.
         * @public
         */
        onInit: function () {
            // Add global model to view
            this.getView().setModel(oModel);
            var oViewData = this.getView().getViewData();
            if (oViewData){
                oConfig = oViewData.config || {};
            }
            // Bind the translation model to this view
            this.getView().setModel(sap.ushell.resources.i18nModel, "i18n");

            sap.ui.getCore().getEventBus().subscribe("externalSearch", this.externalSearchTriggered, this);
            sap.ui.getCore().getEventBus().subscribe("showCatalog", this.showCatalog, this);
            sap.ui.getCore().getEventBus().subscribe("openApp", this.openApp, this);
            sap.ui.getCore().getEventBus().subscribe("launchpad", "contentRendered", this.loadCoreExt);
            
            // this handling of configuration should is done before the code block below otherwise the doHashChange is
            // triggered before the personalization flag is disabled (URL may contain hash value which invokes navigation)
            if (oConfig) {
                if (oConfig.appState === "headerless") {
                    // we need to make sure that appState is not headerless as in headerless mode we disable personalization by design.
                    oModel.setProperty("/personalization", false);

                    // when appState is headerless we also remove the header in home state and disable the personalization.
                    // this is needed in case headerless mode will be used to navigate to the dashboard and not directly to an application.
                    // As 'home' is the official state for the dash board, we change the header visibility property of this state
                    oModel.setProperty("/states/home/headerVisible", false);
                } else {

                    if (oConfig.enablePersonalization !== undefined) {
                        oModel.setProperty("/personalization", oConfig.enablePersonalization);
                    }
                    if (oConfig.enableSetTheme !== undefined) {
                        oModel.setProperty("/setTheme", oConfig.enableSetTheme);
                    }
                }
            }

            oUserRecentsService = sap.ushell.Container.getService("UserRecents");
            this.history = new sap.ushell.renderers.fiori2.History();
            this.oNavContainer = sap.ui.getCore().byId("navContainer");
            this.oLoadingDialog = sap.ui.getCore().byId("loadingDialog");
            this.toggleRtlMode(sap.ui.getCore().getConfiguration().getRTL());
            this.oShellNavigation = sap.ushell.Container.getService("ShellNavigation");
            // must be after event registration (for synchronous navtarget resolver calls)
            this.oShellNavigation.init(jQuery.proxy(this.doHashChange, this));
            sap.ushell.Container.getService("Message").init(jQuery.proxy(this.doShowMessage, this));
            sap.ushell.Container.setLogonFrameProvider(this._getLogonFrameProvider());
            this.bContactSupportEnabled = sap.ushell.Container.getService("SupportTicket").isEnabled();
            if (this.bContactSupportEnabled) {
                sap.ushell.UserActivityLog.activate();
            }

            if (oConfig && oConfig.enableHideGroups !== undefined) {
                oModel.setProperty("/enableHideGroups", oConfig.enableHideGroups);
            }

        },

        /**
         * This method will be used by the Container service in order to create, show and destroy a Dialog control with an
         * inner iframe. The iframe will be used for rare scenarios in which additional authentication is required. This is
         * mainly related to SAML 2.0 flows.
         * The api sequence will be managed by UI2 services.
         * @returns {{create: Function, show: Function, destroy: Function}}
         * @private
         */
        _getLogonFrameProvider: function () {
            var oView = this.getView();

            return {
                /* @returns a DOM reference to a newly created iFrame. */
                create: function () {
                    return oView.createIFrameDialog();
                },

                /* make the current iFrame visible to user */
                show: function () {
                    oView.showIFrameDialog();
                },

                /* hide, close, and destroy the current iFrame */
                destroy: function () {
                    oView.destroyIFrameDialog();
                }
            };
        },

        onExit: function () {
            sap.ui.getCore().getEventBus().unsubscribe("externalSearch", this.externalSearchTriggered, this);
            sap.ui.getCore().getEventBus().unsubscribe("showCatalog", this.showCatalog, this);
            sap.ui.getCore().getEventBus().unsubscribe("openApp", this.openApp, this);
            this.oShellNavigation.hashChanger.destroy();
            this.getView().aDanglingControls.forEach(function (oControl) {
                if (oControl.destroyContent) {
                    oControl.destroyContent();
                }
                oControl.destroy();
            });
            this.getView().oDashboardManager.destroy();
            sap.ushell.UserActivityLog.deactivate();
        },

        // temporary, should not be exposed
        getModel: function () {
            return oModel;
        },

        showCatalog : function (sChannelId, sEventId, oData) {
            if (!this.isCatalogExist()) {
                var oCatalog = sap.ui.view({
                    id : this.catalogPageId,
                    viewName : "sap.ushell.renderers.fiori2.launchpad.catalog.Catalog",
                    viewData : {},
                    type : sap.ui.core.mvc.ViewType.JS
                });
                this.oNavContainer.addPage(oCatalog);
            }
            this.switchViewState("catalog");
            this.oNavContainer.to(this.catalogPageId, this.getAnimationType());
            this.setAppIcons({title: sap.ushell.resources.i18n.getText("tile_catalog")});
            this.oLoadingDialog.closeLoadingScreen();
            sap.ui.getCore().getEventBus().publish("showCatalogEvent", oData);

            //Add access keys
            // reset selections
            jQuery(document).off('keydown.dashboard');
            jQuery(document).off('keydown.catalog');
            // add catalog events
            jQuery(document).on('keydown.catalog', sap.ushell.renderers.fiori2.AccessKeysHandler.catalogKeydownHandler);
        },

        isCatalogExist : function() {
            return (sap.ui.getCore().byId(this.catalogPageId)) ? true : false;
        },

        getAnimationType : function() {
            return sap.ui.Device.os.android ? "show" : "slide";
        },

        openShellOverlay : function (oData) {
//            var oShellOverlay = sap.ui.getCore().byId("shellOverlay");
//            oShellOverlay.open();
        },

        closeShellOverlay : function () {
//            var oShellOverlay = sap.ui.getCore().byId("shellOverlay");
//            if (oShellOverlay && oShellOverlay.isActive()) {
//                bCloseOverlayByFunction = true;
//                oShellOverlay.close();
//            }
        },

        onCurtainClose : function (oEvent) {
            jQuery.sap.log.warning("Closing Curtain", oEvent);

//            sap.ui.getCore().getEventBus().publish("closeCurtain");

            bCloseOverlayByFunction = false;
//            sap.ui.getCore().byId("sf").focus();
        },

        /**
         * Callback registered with Message service. Triggered on message show request.
         *
         * @private
         */
        doShowMessage: function (iType, sMessage, oParameters) {
            jQuery.sap.require("sap.m.MessageToast");
            jQuery.sap.require("sap.m.MessageBox");
            if (iType === sap.ushell.services.Message.Type.ERROR) {
                if (sap.ushell.Container.getService("SupportTicket").isEnabled()) {
                    jQuery.sap.require("sap.ushell.ui.launchpad.EmbeddedSupportErrorMessage");
                    var errorMsg = new sap.ushell.ui.launchpad.EmbeddedSupportErrorMessage("EmbeddedSupportErrorMessage", {
                        title: oParameters.title || sap.ushell.resources.i18n.getText("error"),
                        content: new sap.m.Text({
                            text: sMessage
                        })
                    });
                    errorMsg.open();
                } else {
                    sap.m.MessageBox.show(sMessage, sap.m.MessageBox.Icon.ERROR,
                        oParameters.title || sap.ushell.resources.i18n.getText("error"));
                }
            } else if (iType === sap.ushell.services.Message.Type.CONFIRM) {
                if (oParameters.actions) {
                    sap.m.MessageBox.show(sMessage, sap.m.MessageBox.Icon.QUESTION, oParameters.title, oParameters.actions, oParameters.callback);
                } else {
                    sap.m.MessageBox.confirm(sMessage, oParameters.callback, oParameters.title);
                }
            } else {
                sap.m.MessageToast.show(sMessage, { duration: oParameters.duration || 3000 });
            }
        },

        /**
         * Callback registered with NavService. Triggered on navigation requests
         *
         * Set application container based on information in URL hash.
         * @public
         */
        ignoreHashChange : function (sShellHash, sAppPart, sOldShellHash) {
        },

        /**
         * Callback registered with NavService. Triggered on navigation requests
         *
         * Set application container based on information in URL hash.
         * @public
         */
        doHashChange : function (sShellHash, sAppPart, sOldShellHash, oParseError) {
            if (!enableHashChange) {
                enableHashChange = true;
                return;
            }

            sShellHash = this.fixShellHash(sShellHash);

            //Need to save this value because next string can change it.
            var originalHistoryLength = this.history.getHistoryLength();

            // check if the hash could be parsed (see CSN 0001102839 2014)
            if (oParseError) {
                this.hashChangeFailure(originalHistoryLength, oParseError.message, null, "sap.ushell.renderers.fiori2.Shell.controller");
                return;
            }

            this.history.hashChange(sShellHash, sOldShellHash);

            var oURLParsing = sap.ushell.Container.getService("URLParsing");
            var oShellHash = oURLParsing.parseShellHash(sShellHash);

            var oCurrentState = oModel.getProperty("/currentState");
            var bInCatalog = oCurrentState && oCurrentState.stateName === "catalog";
            var bOpenApp = oShellHash && oShellHash.action !== sap.ushell.renderers.fiori2.Navigation.CATALOG.ACTION;
            if (!bInCatalog || bOpenApp) {
                this.oLoadingDialog.setText("");
                this.oLoadingDialog.openLoadingScreen();
            }


            if (oShellHash && oShellHash.contextRaw && oShellHash.contextRaw === "navResCtx") {
                var oApplication = {};
                oApplication.additionalInformation = oShellHash.params.additionalInformation[0];
                oApplication.url = oShellHash.params.url[0];
                oApplication.applicationType = oShellHash.params.applicationType[0];
                this.openSomething(sShellHash, sOldShellHash, sAppPart, oApplication);
            } else {
                sap.ushell.Container.getService("NavTargetResolution")
                    .resolveHashFragment(sShellHash)
                    .done(jQuery.proxy(this.openSomething, this, sShellHash, sOldShellHash, sAppPart))
                    .fail(jQuery.proxy(function (sMsg) {
                        this.hashChangeFailure(originalHistoryLength, "Failed to resolve navigation target: " + sShellHash, sMsg, "sap.ushell.renderers.fiori2.Shell.controller");
                    }, this));
            }
        },

        hashChangeFailure : function(iHistoryLength, sMessage, sDetails, sComponent){
            this.reportError(sMessage, sDetails, sComponent);
            this.oLoadingDialog.closeLoadingScreen();
            //use timeout to avoid "MessageService not initialized.: error
            this.delayedMessageError(sap.ushell.resources.i18n.getText("fail_to_start_app_config_err"));

            if (iHistoryLength === 0) {
                // if started with an illegal shell hash (deep link), we just remove the hash
                this.cleanHash();
            } else {
                //navigate to the previous URL since in this state the hash that has failed to load is in the URL
                this.historyBack();
            }
         },

        reportError : function (sMessage, sDetails, sComponent) {
            jQuery.sap.log.error(sMessage, sDetails, sComponent);
        },

        delayedMessageError : function(sMsg) {
            setTimeout(function () {
                sap.ushell.Container.getService("Message").error(sMsg);
            }, 0);
        },

        fixShellHash : function(sShellHash) {
            if (!sShellHash) {
                sShellHash = '#';
            } else if (sShellHash.charAt(0) !== '#') {
                sShellHash = '#' + sShellHash;
            }
            return (sShellHash);
        },

        cleanHash : function() {
            window.location.hash = "";
        },

        changeHash : function(sHash) {
            window.location.hash = sHash;
        },

        //navigate to the previous URL since in this state the hash that has failed to load is in the URL
        historyBack : function() {
            window.history.back(1);
        },

        /**
         *  open either an app or the dashboard
         * @public
         */
        openSomething : function (sShellHash, sOldShellHash, sAppPart, oApplication) {
            var oApplicationInformation;

            if (!this.oNavContainer.getParent()) {
                sap.ui.getCore().byId("shell").addContent(this.oNavContainer);
            }

            if (oApplication) {
                // application opened
                try {
                    oApplicationInformation = sap.ushell.Container.getService("URLParsing")
                        .parseShellHash(sShellHash);
                } catch (e) {
                    // this happens when trying to parse hashes from fiori wave one
                    oApplicationInformation = undefined;
                }

                if (oApplicationInformation === undefined) {
                    // This will happen, when a custom app is opened, like Wikipedia
                    jQuery.sap.log.warning("Could not parse shell hash: " + sShellHash);
                    oApplicationInformation = {};
                }
                oApplicationInformation.sShellHash = sShellHash;
                oApplicationInformation.sOldShellHash = sOldShellHash;
                oApplicationInformation.sAppPart = sAppPart;
                oApplicationInformation.oApplication = oApplication;

                if (oApplication.applicationType === sap.ushell.renderers.fiori2.Navigation.CATALOG.ID) {
                    if (oModel.getProperty("/personalization")) {
                        sap.ui.getCore().getEventBus()
                            .publish("showCatalog", oApplicationInformation);
                    } else {
                        this.openDashboard();
                        this.cleanHash();
                        this.oLoadingDialog.closeLoadingScreen();
                    }
                } else {
                    try {
                        jQuery.sap.require('sap.fiori.core-ext');
                    } catch (error) {
                        jQuery.sap.log.warning("failed to load sap.fiori.core-ext!");
                    }
                    oApplicationInformation.oMetadata = sap.ushell.services.AppConfiguration.getMetadata(oApplication);
                    sap.ui.getCore().getEventBus()
                        .publish("openApp", oApplicationInformation);
                }
            } else {

                var oCurrentState = oModel.getProperty("/currentState");
                if (oCurrentState && oCurrentState.stateName === "catalogApp") {
                    this.showCatalog();
                } else {
                    this.openDashboard();
                }
            }
        },

        /**
        *  opens the dashboard
        * @public
        */
        openDashboard : function () {
            var openedFromCatalog = oModel.getProperty("/currentState") && oModel.getProperty("/currentState").stateName === "catalog";
            this.switchViewState("home");
            this.oNavContainer.backToTop();
            sap.ushell.services.AppConfiguration.setCurrentApplication(null);
            this.setAppIcons(null);

            if (openedFromCatalog) {
                // if a new group was created in the catalog - then the bottom space needs to be recalculated
                sap.ushell.utils.addBottomSpace();
            }
            //Recheck tiles visibility on open dashboard. Tiles will be visible on this stage, if user pressed Back from application
            try {
                sap.ushell.utils.handleTilesVisibility();
            } catch (e) {
                //nothing has to be done
            }

            //Add access keys
            // reset selections
            jQuery(document).off('keydown.dashboard');
            jQuery(document).off('keydown.catalog');
            // add dashboard events
            jQuery(document).on('keydown.dashboard', sap.ushell.renderers.fiori2.AccessKeysHandler.dashboardKeydownHandler);
            var oUnifiedShell = sap.ui.getCore().byId('shell');
            oUnifiedShell.focusOnConfigBtn();
        },

        /**
         *
         * @param sChannelId
         * @param sEventId
         * @param {Object} oApplication
         * @public
         */
        openApp : function (sChannelId, sEventId, oData) {


            //TODO - Temp for sFin demo
            this.getView().showDemoPopover = false;


            jQuery.sap.log.warning("Triggering navigation to ", oData);
            var oAppContainer,
                oApplication = oData.oApplication,
                oMetadata = oData.oMetadata || {},
                oInnerControl = null,
                appid = oData.sShellHash.replace(/\W/g, "-"),
                aOldPages,
                sAppTitle = oMetadata.title || "",
                sAppIcon = oMetadata.icon || null,
                messageSrvc = sap.ushell.Container.getService('Message');

            if (!oConfig || !oConfig.changeOpacity || oConfig.changeOpacity !== 'off') {
                // Triggering the app usage mechanism to log this openApp action.
                // Using setTimeout in order not to delay the openApp action
                setTimeout (function () {
                    oUserRecentsService.addAppUsage(oData.sShellHash);
                }, 700);
            }
            
            if (oApplication) {
                try {

                    // WebGUI Application Integration
                    if (oApplication.applicationType === "NWBC" && !(oData && oData.contextRaw && oData.contextRaw === "navResCtx") &&
                            this.history.getHistoryLength() > 1) {
                        enableHashChange = false;
                        window.history.back(1);
                        //open the new FLP html with the resolved tiny url
                        var tarShellHash = oData;
                        var oShellHash = oData;
                        var strShellH;
                        oShellHash.params.additionalInformation = oApplication.additionalInformation;
                        oShellHash.params.url = oApplication.url;
                        oShellHash.params.applicationType = oApplication.applicationType;
                        oShellHash.target = tarShellHash;
                        tarShellHash.contextRaw = oShellHash.contextRaw = "navResCtx";
                        var oShellH = sap.ushell.Container.getService("ShellNavigation").hrefForExternal(oShellHash, true);
                        
                        if(oShellH.skippedParams) {
                        	strShellH = "#" + oData.semanticObject + "-" + oData.action; 
                        } else {
                        	strShellH = oShellH.hash;
                        }
                        this.openAppNewWindow(strShellH);
                        this.oLoadingDialog.closeLoadingScreen();
                        return;
                    }

                    if (!this.oNavContainer.getPage("application" + appid) && !this.oNavContainer.getPage("shellPage" + appid)) {
                        jQuery.sap.require('sap.ushell.components.container.ApplicationContainer');
                        oAppContainer = new sap.ushell.components.container.ApplicationContainer("application" + appid, oApplication);

                        //after the app container is rendered, publish an event to notify
                        //that an app was opened
                        var origAfterRendering = oAppContainer.onAfterRendering;
                        oAppContainer.onAfterRendering = function () {
                            if (origAfterRendering) {
                                origAfterRendering.apply(this, arguments);
                            }
                            //wrapped in setTimeout since "pubilsh" is not async
                            setTimeout(function () {
                                sap.ui.getCore().getEventBus().publish("launchpad", "appOpened", oApplication);
                                jQuery.sap.log.info('app was opened');
                            }, 0);
                        };
                        //after the app container exit, publish an event to notify
                        //that an app was closed
                        var origExit = oAppContainer.exit;
                        oAppContainer.exit = function () {
                            if (origExit) {
                                origExit.apply(this, arguments);
                            }
                            //wrapped in setTimeout since "pubilsh" is not async
                            setTimeout(function () {
                                sap.ui.getCore().getEventBus().publish("launchpad", "appClosed", oApplication);
                                jQuery.sap.log.info('app was closed');
                            }, 0);
                        };

                        sap.ushell.services.AppConfiguration.setCurrentApplication(oApplication);
                        this.oLoadingDialog.showAppInfo(sAppTitle, sAppIcon);
                        if (!oMetadata.fullWidth && oApplication.applicationType !== "NWBC") {
                            oInnerControl = new sap.m.Shell("shellPage" + appid, {
                                logo: sap.ui.resource('sap.ui.core', 'themes/base/img/1x1.gif'),
                                title : sAppTitle,
                                showLogout : false,
                                app : oAppContainer
                            }).addStyleClass("sapUshellApplicationPage");
                            if (!sAppTitle) {
                                oInnerControl.addStyleClass("sapUshellApplicationPageNoHdr");
                            }
                        } else {
                            //temporary solution for setting the light background for applications
                            oAppContainer.addStyleClass('sapMShellGlobalInnerBackground');
                            oInnerControl = oAppContainer;
                        }
                        this.oNavContainer.addPage(oInnerControl);
                    } else if (this.oNavContainer.getPage("application" + appid) || this.oNavContainer.getPage("shellPage" + appid)) {
                        oInnerControl = this.oNavContainer.getPage("application" + appid) || this.oNavContainer.getPage("shellPage" + appid);
                    }

                    this.setAppIcons(oMetadata);
                    if (oApplication.applicationType[0] === "NWBC" || oApplication.applicationType === "NWBC") {
                        this.switchViewState("minimal");
                        enableHashChange = false;
                        this.changeHash(oData.semanticObject + "-" + oData.action);
                    } else {
                        var oCurrentState = oModel.getProperty("/currentState");
                        if (oCurrentState && oCurrentState.stateName === "catalog") {
                            this.switchViewState("catalogApp");
                        } else {
                            var appState = "app";
                            if (allowedAppStates.indexOf(oConfig.appState) >= 0) {
                                appState = oConfig.appState;
                            }
                            this.switchViewState(appState);
                        }
                    }

                    if (this.history.backwards && this.oNavContainer.getInitialPage() !== this.oNavContainer.getCurrentPage().getId()) {
                        this.oNavContainer.to(oInnerControl, "slideBack");
                    } else {
                        this.oNavContainer.to(oInnerControl, this.oNavContainer.getInitialPage() ? "slide" : "show");
                    }
                    //TODO: this should be done at some other place. we need this here if the user refresh the page while in an application
                    setTimeout(function () {
                        this.oLoadingDialog.closeLoadingScreen();
                    }.bind(this), 300);
                } catch (e) {
                    // create a new navContainer because old one is in a irreparable state
                    // save all other pages besides the page which causes the error
                    this.reportError(e.name, e.message, sAppTitle);
                    this.oNavContainer.removePage(this.oNavContainer.getCurrentPage()).destroy();
                    aOldPages = this.oNavContainer.removeAllPages();

                    this.oNavContainer.destroy();
                    this.oNavContainer = this.getView().initNavContainer(this);

                    jQuery.each(aOldPages, jQuery.proxy(function (i, v) {
                        if (!this.oNavContainer.getPage(v.getId())) {
                            this.oNavContainer.addPage(v);
                        }
                        if (v.getId() === this.oNavContainer.getInitialPage()) {
                            v.removeStyleClass("sapMNavItemHidden"); // still there because of old navContainer
                        }
                    }, this));
                    this.navigateToHome();
                    this.oLoadingDialog.closeLoadingScreen();
                    messageSrvc.error(sap.ushell.resources.i18n.getText("fail_to_start_app_runtime_err"));
                }
            }
            // close if we are on first position (no app has be launched before)
            if (this.history.getHistoryLength() < 1) {
                this.oLoadingDialog.closeLoadingScreen();
            }
        },

        openAppNewWindow : function (sUrl) {
            window.open(sUrl);
        },

        setAppIcons: function (oMetadataConfig) {
            // TODO Implement adjustment of relative paths:
            // Should be relative to Component.js, not to HTML file!
            var sModulePath = jQuery.sap.getModulePath("sap.ushell");
            var oLaunchIconPhone = (oMetadataConfig && oMetadataConfig.homeScreenIconPhone) ||
                (sModulePath + '/themes/base/img/launchicons/57_iPhone_Desktop_Launch.png'),
                oLaunchIconPhone2 = (oMetadataConfig && oMetadataConfig["homeScreenIconPhone@2"]) ||
                    (sModulePath + '/themes/base/img/launchicons/114_iPhone-Retina_Web_Clip.png'),
                oLaunchIconTablet = (oMetadataConfig && oMetadataConfig.homeScreenIconTablet) ||
                    (sModulePath + '/themes/base/img/launchicons/72_iPad_Desktop_Launch.png'),
                oLaunchIconTablet2 = (oMetadataConfig && oMetadataConfig["homeScreenIconTablet@2"]) ||
                    (sModulePath + '/themes/base/img/launchicons/144_iPad_Retina_Web_Clip.png'),
                oFavIcon = (oMetadataConfig && oMetadataConfig.favIcon) ||
                    (sModulePath + '/themes/base/img/launchpad_favicon.ico'),
                sTitle = (oMetadataConfig && oMetadataConfig.title) ||
                    //TODO define proper localization tag for default window title
                    sap.ushell.resources.i18n.getText("homeBtn_tooltip"),
                sCurrentFavIconHref = this.getFavIconHref();
            if (sap.ui.Device.os.ios) {
                jQuery.sap.setIcons({
                    'phone': oLaunchIconPhone,
                    'phone@2': oLaunchIconPhone2,
                    'tablet': oLaunchIconTablet,
                    'tablet@2': oLaunchIconTablet2,
                    'favicon': oFavIcon,
                    'precomposed': true
                });
            } else if (sCurrentFavIconHref !== oFavIcon) {
                jQuery.sap.setIcons({
                    'phone': '',
                    'phone@2': '',
                    'tablet': '',
                    'tablet@2': '',
                    'favicon': oFavIcon,
                    'precomposed': true
                });
            }

            window.document.title = sTitle;
        },

        getFavIconHref: function () {
            return jQuery('link').filter('[rel="shortcut icon"]').attr('href') || '';
        },

        externalSearchTriggered: function (sChannelId, sEventId, oData) {
            oModel.setProperty("/searchTerm", oData.searchTerm);
            oData.query = oData.searchTerm;
//            sap.ui.getCore().byId("sfOverlay").fireSearch(oData);
        },

        onAfterNavigate: function (oEvent) {
            var sHome = this.oNavContainer.getInitialPage(), //DashboardPage
                sFrom = oEvent.getParameter("fromId");

            if (sFrom !== sHome && sFrom !== this.catalogPageId) {
                this.oNavContainer.removeAggregation("pages", sFrom, true);
                sap.ui.getCore().byId(sFrom).destroy();
            }
            this.oLoadingDialog.closeLoadingScreen();
        },

        onAfterRendering: function () {
            if (window.f2p) {
                f2p.add(f2p.m.endHomePage);
            }
        },

        navigateToHome: function (oEvent) {
            if (!oEvent || (oEvent && oEvent.getParameter("id") === 'homeBtn')){
                location.hash = '';
                this.openDashboard();
            }
            else {
                sap.ushell.renderers.fiori2.Navigation.openCatalogByHash({
                    groupContext: null
                });
            }
        },

        toggleSearch : function (bIsAvailable) {
            oModel.setProperty("/searchAvailable", bIsAvailable);
        },

        toggleRtlMode : function (bRtl) {
            oModel.setProperty("/rtl", bRtl);
        },

        togglePane : function (oEvent) {
            var oSource = oEvent.getSource(),
                bState = oSource.getSelected();
            if (!sap.ui.getCore().byId('groupList')) {
                var oGroupListPage = this.getView().oDashboardManager.getGroupListView();

                // desktop and IOS7 both use the browser's scroller thus both should be checked
                if (sap.ui.Device.system.desktop) {
                    oGroupListPage.addStyleClass("sapUshellGroupListDesktopScrollbar");
                }
                this.getModel().setProperty('/states/home/paneContent', [oGroupListPage.getId()]);
                this.getModel().setProperty('/currentState/paneContent', [oGroupListPage.getId()]);
            }
            if (oEvent.getParameter("id") === "categoriesBtn") {
                oSource.getModel().setProperty("/currentState/showCurtainPane", !bState);
            } else {
                oSource.getModel().setProperty("/currentState/showPane", !bState);
                setTimeout (function () {
                    var oShell = sap.ui.getCore().byId("shell");
                    if(oShell){
                        oShell.setFocusOnFirstGroupInList();
                    }
                }, 1500);
            }

            setTimeout(function () {
                $("li.sapUshellOver").click();
            }, 400);         
        },

        getActiveViews: function () {
            var aCurtainContent = this.getModel().getProperty("/currentState/curtainContent"),
                oPage = sap.ui.getCore().byId(aCurtainContent[0]),
                aActiveViews = [];

            // the two search suggestion controller need to know
            // which is currently active to not trigger request twice
            jQuery.each(oPage.getContent(), function (i, v) {
                aActiveViews.push(v.getId());
            });

            return aActiveViews;
        },

        getLastSearchScreen: function(){
            return oModel.getProperty("/lastSearchScreen");
        },

        saveSearchScreen: function(sState){
            if (sState === 'historyScreen' || sState === 'searchResults' || sState === 'suggestions') {
                oModel.setProperty("/lastSearchScreen", sState);
            }
        },

        switchViewState: function (sState, bSaveLastState) {
            var sPath = sState[0] === "/" ? sState : "/states/" + sState,
                oState = oModel.getProperty(sPath),
                /** @type sap.ui.unified.Shell */
                oShell = sap.ui.getCore().byId("shell"),
                oCurrentState = oModel.getProperty("/currentState") || {};

            if (!oShell.getSearch() || oState.search !== oShell.getSearch().getId()) {
                oShell.setSearch(sap.ui.getCore().byId(oState.search));
            }

            this.saveSearchScreen(sState);

            if (!!bSaveLastState) {
                oModel.setProperty("/lastState", oCurrentState);
            }

            oState = jQuery.extend({}, oCurrentState, oState);
            oModel.setProperty("/currentState", oState);

            if (sState === "searchResults") {
            	oModel.setProperty("/lastSearchScreen", '');
            	if (window.location.href.indexOf("#Action-search") > -1) {
            		this.closeShellOverlay();
            	}
            	else {
            		var searchModel = sap.ui.getCore().getModel("searchModel");
            		window.location.href = "#Action-search&/searchTerm=" + encodeURI(searchModel.getProperty("/searchBoxTerm")) + "&dataSource=" + encodeURI(JSON.stringify(searchModel.getDataSourceJson()));
            	}
            }
            else {
            	if (!!oState.showCurtain) {
                    this.openShellOverlay();
                } else {
                    this.closeShellOverlay();
                }
            }
        },

        pressActionBtn: function (oEvent) {

        	// don't hide the shell header when the action sheet is open on mobile devices only
        	if (!sap.ui.Device.system.desktop) {
        		this.getModel().setProperty("/headerHiding", false);
        	}
            var oActionSheet = sap.ui.getCore().byId('headActions');
            if (!oActionSheet) {
                var oLoginDetails = new sap.ushell.ui.footerbar.LoginDetailsButton("loginDetails"),
                    oLogoutButton = new sap.ushell.ui.footerbar.LogoutButton("logoutBtn"),
                    oAboutButton = new sap.ushell.ui.footerbar.AboutButton("aboutBtn");

                var oHideGroupsButton = new sap.ushell.ui.footerbar.HideGroupsButton("hideGroupsBtn");
                if(!this.getModel().getProperty('/enableHideGroups')){ //Decided to always add the button but in case the hideGroups feature is off- hide it.
                   oHideGroupsButton.setVisible(false);
                }

                var oContactSupport = new sap.ushell.ui.footerbar.ContactSupportButton("ContactSupportBtn", {
                    visible: this.bContactSupportEnabled
                });

                oActionSheet = new sap.m.ActionSheet("headActions", {
                    placement: sap.m.PlacementType.Bottom,
                    buttons: {path: "/currentState/actions", factory: function (sId, oContext) {
                        return sap.ui.getCore().byId(oContext.getObject());
                    }}
                });
                oActionSheet.updateAggregation = this.getView().updateShellAggregation;
                oActionSheet.setModel(this.getModel());
                this.getView().aDanglingControls.push(oActionSheet, oLoginDetails, oLogoutButton, oAboutButton, oContactSupport, oHideGroupsButton);
            }
            oActionSheet.openBy(oEvent.getSource());

            oActionSheet.attachAfterClose(oActionSheet, function() {
            	// reset header hiding according to the current state (on mobile devices only)
            	if (!sap.ui.Device.system.desktop) {
            		var currentState = sap.ui.getCore().byId('shell').getModel().getProperty("/currentState"),
            		headerHiding = currentState.headerHiding;
            		this.getModel().setProperty("/headerHiding", headerHiding);
            	}
            });
        },

        loadCoreExt: function () {
            //if sap.fiori.core or sap.fiori.core-ext are loaded, we do not need to load core-ext
            var bAlreadyLoaded =   jQuery.sap.isDeclared('sap.fiori.core', true) ||
                                jQuery.sap.isDeclared('sap.fiori.core-ext', true),
                oLoaderWorker,
                sPathToWorker = '';

            if (bAlreadyLoaded) {
                return;
            }
            //if HTML5 Web Workers are supported use it to load core-ext
            if (window.Worker) {
                sPathToWorker = jQuery.sap.getModulePath('sap.ushell.loader', '.js');
                //initiate the Worker
                oLoaderWorker = new window.Worker(sPathToWorker);
                //add a listener for messages from the worker
                oLoaderWorker.onmessage = function (oEvent) {
                    if (oEvent.data && !oEvent.data.error) {
                        try {
                            window.eval(oEvent.data);
                            jQuery.sap.declare('sap.fiori.core-ext' + '');
                        } catch (e) {
                            jQuery.sap.log.warning('failed to load sap.fiori.core-ext');
                        }
                    } else {
                        jQuery.sap.log.warning('failed to load sap.fiori.core-ext');
                    }
                    //terminate the worker, if the worker will be extended the terminate call should be modified
                    oLoaderWorker.terminate();
                };
                //ask the loader to load core-ext
                oLoaderWorker.postMessage({
                    action: 'loadResource',
                    url: window['sap-ui-debug'] ? '../fiori/core-ext-dbg.js' : '../fiori/core-ext.js'
                });
            } else {
                //if WebWorker isn't supported, use a require statement in a setTimeout so that this call will not
                //disrupt other code flow
                setTimeout(function () {
                    try {
                        jQuery.sap.require('sap.fiori.core-ext');
                    } catch (error) {
                        jQuery.sap.log.warning("failed to load sap.fiori.core-ext");
                    }
                }, 0);
            }
        }
    });
}());
