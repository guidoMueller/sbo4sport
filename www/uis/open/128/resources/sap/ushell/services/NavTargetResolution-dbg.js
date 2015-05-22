// Copyright (c) 2013 SAP AG, All Rights Reserved
/**
 * @fileOverview The NavTargetResolution service.
 */
(function () {
    "use strict";
    /*global jQuery, sap, localStorage, window, document*/
    /*jslint nomen: true */
    jQuery.sap.declare("sap.ushell.services.NavTargetResolution");

    /**
     * This method MUST be called by the Unified Shell's container only, others MUST call
     * <code>sap.ushell.Container.getService("NavTargetResolution")</code>.
     * Constructs a new instance of the navigation target resolution service.
     *
     * @class The Unified Shell's internal navigation target resolution service
     *
     *
     * configurations:
     * <code>config : { allowTestUrlComponentConfig  : true }</code>
     * allow to redefine the Test-url, Test-local1, Test-local2 applications via url parameters
     * (sap-ushell-test-local1-url=  / sap-ushell-test-local1-additionalInformation=  ... )
     *
     *
     * @constructor
     * @see sap.ushell.services.Container#getService
     * @since 1.15.0
     * @param {oServiceConfiguration} a Service configuration
     * 
     * @public
     */
    sap.ushell.services.NavTargetResolution = function (oAdapter, oContainerInterface, sParameters, oServiceConfiguration) {
        var oServiceConfig = oServiceConfiguration && oServiceConfiguration.config,
            aLocalResolvedNavTargets,
            // oAdapter resolver is the "last" custom resolver
            aResolvers = [{
                name : "DefaultAdapter",
                isApplicable: function () { return true; },
                resolveHashFragment : oAdapter.resolveHashFragment.bind(oAdapter)
            }],
            oCurrentResolution;

        this._nextResolveHashFragment = function (aCustomResolvers, sHashFragment) {
            var oResolver,
                f;

            oResolver = aCustomResolvers.pop();
            if (oResolver.isApplicable(sHashFragment)) {
                jQuery.sap.log.info("NavTargetResolution: custom resolver " + oResolver.name + " resolves " + sHashFragment);
                f = this._nextResolveHashFragment.bind(this, aCustomResolvers);
                return oResolver.resolveHashFragment(sHashFragment, f);
            }
            return this._nextResolveHashFragment(aCustomResolvers, sHashFragment);
        };
        /**
         * Resolves the URL hash fragment.
         *
         * This function should be used by a custom renderer in order to implement custom navigation.
         * Do not use this function for developing Fiori applications.
         *
         * This function gets the hash part of the URL and returns data of the target application.
         * Example of the returned data:
         *    {"additionalInformation": "SAPUI5.Component=sap.ushell.renderers.fiori2.search.container",
         *    "applicationType": "URL",
         *    "url": "/sap/bc/ui5_ui5/ui2/ushell/resources/sap/ushell/renderers/fiori2/search/container"}
         *
         * This is an asynchronous operation.
         *
         * @param {string} sHashFragment
         *     The formatted URL hash fragment (as obtained by the SAPUI5 hasher service
         *     not as given in <code>location.hash</code>)
         *
         * @returns {object}
         *     A jQuery.Promise. Its <code>done()</code> function gets an object that you can use
         *     to create a {@link sap.ushell.components.container.ApplicationContainer}
         *     or <code>undefined</code> in case the hash fragment was empty.
         *
         *
         * @public
         */
        this.resolveHashFragment = function (sHashFragment) {
            var oCRs = aResolvers.map(function (a) { return a; });

            return this._nextResolveHashFragment(oCRs, sHashFragment).done(function (oResolution) {
                oCurrentResolution = oResolution;
            });
        };

        this.baseResolveHashFragment = function (sHashFragment) {
            return oAdapter.resolveHashFragment(sHashFragment);
        };


        /**
         * Resolves a given semantic object and business parameters to a list of links,
         * taking into account the form factor of the current device.
         *
         * @param {string} sSemanticObject
         *   the semantic object such as <code>"AnObject"</code>
         * @param {object} [mParameters]
         *   the map of business parameters with values, for instance
         *   <pre>
         *   {
         *     A: "B",
         *     C: ["e", "j"]
         *   }
         *   </pre>
         * @param {boolean} [bIgnoreFormFactor=false]
         *   when set to <code>true</code> the form factor of the current device is ignored
         *
         * @returns {object}
         *   A <code>jQuery.Deferred</code> object's promise which is resolved with an array of
         *   link objects containing (at least) the following properties:
         * <pre>
         * {
         *   intent: "#AnObject-Action?A=B&C=e&C=j",
         *   text: "Perform action"
         * }
         * </pre>
         */
        this.getSemanticObjectLinks = function (sSemanticObject, mParameters, bIgnoreFormFactor) {
            if (/\?/.test(sSemanticObject)) {
                throw new Error("Parameter must not be part of semantic object");
            }

            if (oAdapter.getSemanticObjectLinks) {
                return oAdapter.getSemanticObjectLinks(sSemanticObject, mParameters,
                    bIgnoreFormFactor);
            }

            // Note: return a promise, not an array!
            return (new jQuery.Deferred()).resolve([]).promise();
        };

        /**
         * Tells whether the given intent(s) are supported, taking into account the form factor of
         * the current device. "Supported" means that navigation to the intent is possible.
         *
         * @param {string[]} aIntents
         *   the intents (such as <code>"#AnObject-Action?A=B&C=e&C=j"</code>) to be checked
         *
         * @returns {object}
         *   A <code>jQuery.Deferred</code> object's promise which is resolved with a map
         *   containing the intents from <code>aIntents</code> as keys. The map values are
         *   objects with a property <code>supported</code> of type <code>boolean</code>.<br/>
         *   Example:
         * <pre>
         * {
         *   "#AnObject-Action?A=B&C=e&C=j": { supported: false },
         *   "#AnotherObject-Action2": { supported: true }
         * }
         * </pre>
         */
        this.isIntentSupported = function (aIntents) {
            var mResult = {};

            if (oAdapter.isIntentSupported) {
                return oAdapter.isIntentSupported(aIntents);
            }

            aIntents.forEach(function (sIntent) {
                mResult[sIntent] = {supported: undefined};
            });
            return (new jQuery.Deferred()).resolve(mResult).promise();
        };

        /**
         * Register a custom resolver for semantic objects
         *
         * The resolver must be JavaScipt object with a string property name,
         * and two functions resolveHashFragment(sHashFragment,nextResolver) returning a promise
         * and isApplicable(sHashFragment) returning a boolean
         *
         * @param {Object} resolver
         * @returns {boolean} true if resolver was registered, false otherwise
         */
        this.registerCustomResolver = function (oObject) {
            // verify oObject
            if (typeof oObject.name !== "string") {
                jQuery.sap.log.error("NavTargetResolution: Custom Resolver must have name {string} member");
                return false;
            }
            if (typeof oObject.isApplicable !== "function") {
                jQuery.sap.log.error("NavTargetResolution: Custom Resolver must have isApplicable member");
                return false;
            }
            if (typeof oObject.resolveHashFragment !== "function") {
                jQuery.sap.log.error("NavTargetResolution: Custom Resolver must have \"resolveHashFragment\" member");
                return false;
            }
            aResolvers.push(oObject);
            return true;
        };

        // specific custom resolvers enabled by a configuration
        // #1 localResolveNavigationResolver  : given an array in config.resolveLocal, resolve
        // given SO-action strings to a locally supplied configuration
        // member of a resolveLocal setting are locally resolved
        if (oServiceConfig && jQuery.isArray(oServiceConfig.resolveLocal)) {
            // register a custom resolver which redirects all !allowed to defaultOthersTo
            aLocalResolvedNavTargets = oServiceConfig.resolveLocal.map(function (oArg) {
                return oArg.linkId;
            });
            this.registerCustomResolver({
                name : "localResolveNavigationResolver",
                cleanHash : function (sHashFragment) {
                    if (sHashFragment === "") {
                        return "#";
                    }
                    var res = sap.ushell.Container.getService("URLParsing").parseShellHash(sHashFragment.substring(1));
                    if (!res) {
                        return "#";
                    }
                    sHashFragment = "#" + res.semanticObject + "-" + res.action;
                    return sHashFragment;
                },
                _getIndex : function (sOrigHashFragment) {
                    var sHashFragment = this.cleanHash(sOrigHashFragment);
                    return aLocalResolvedNavTargets.indexOf(sHashFragment.substring(1));
                },
                // applicability test
                isApplicable: function (sOrigHashFragment) {
                    return this._getIndex(sOrigHashFragment) >= 0;
                },
                // replace hash, then resolve to app
                resolveHashFragment : function (sHashFragment) {
                    var oDeferred,
                        idx = this._getIndex(sHashFragment),
                        oResolvedResult,
                        obj,
                        hasQM,
                        newsh;
                    // assume it is a configuration object
                    //{
                    //    additionalInformation : "SAPUI5.Component=sap.ushell.demoapps.FioriSandboxDefaultApp",
                    //    applicationType : "URL",
                    //    url : "../../../../../test-resources/sap/ushell/demoapps/FioriSandboxDefaultApp",
                    //},
                    oDeferred = new jQuery.Deferred();
                    oResolvedResult = JSON.parse(JSON.stringify(oServiceConfig.resolveLocal[idx].resolveTo));
                    // augment url with application parameters from sHashFragment
                    obj = sap.ushell.Container.getService("URLParsing").parseShellHash(sHashFragment);
                    if (obj && obj.params) {
                        newsh = sap.ushell.Container.getService("URLParsing").paramsToString(obj.params);
                        hasQM = oResolvedResult.url.indexOf('?') >= 0;
                        oResolvedResult.url = oResolvedResult.url + (hasQM ? "" : "?") + newsh;
                    }
                    oDeferred.resolve(oResolvedResult);
                    return oDeferred.promise();
                } // function resolveHashFragment
            });// function registerCustomResolver
        }//if resolveLocal

        // register one fixed resolver for Standalone resolution (portal use case)
        // this resolver
        // a) demonstrates a sample resolver
        // b) Allows to launch an application via a specific ( client side coded )
        //    Target  #Shell-runStandaloneApp
        // with the effective application beeing coded via hash parameters:
        //  sap-ushell-SAPUI5.Component
        //  sap-ushell-url
        //  as in:
        //       #Shell-runStandaloneApp?sap-ushell-SAPUI5.Component=...&sap-ushell-url=...
        //  example: 
        //       http://<server>/sap/bc/ui5_ui5/ui2/ushell/shells/abap/FioriLaunchpad.html?sap-client=120#Shell-runStandaloneApp?sap-ushell-SAPUI5.Component=sap.ushell.demo.AppNavSample&sap-ushell-url=%252Fsap%252Fbc%252Fui5_demokit%252Ftest-resources%252Fsap%252Fushell%252Fdemoapps%252FAppNavSample%253FA%253DURL%2526A%253DTAP%2526B%253DTAP%2526AA%253DTAP&MORE=fun
        //
        //
        //       #Test-local1 => local storage key  "sap.ushell#Test-local1"
        //       #Test-local2 => local storage key  "sap.ushell#Test-local1"
        //       #Test-url => sap-ushell-test-local1 , sap-ushell-test-url1-additionalInformation
          //  #Test-config

        this.registerCustomResolver({ name : "StandaloneLocalResolver",
            aElement : undefined,
            cleanHash : function (sHashFragment) {
                if (sHashFragment === "") {
                    return undefined;
                }
                var res = sap.ushell.Container.getService("URLParsing").parseShellHash(sHashFragment.substring(1));
                if (!res) {
                    return undefined;
                }
                sHashFragment = "#" + res.semanticObject + "-" + res.action;
                return sHashFragment;
            },
            isRunStandaloneHash : function (sHashFragment) {
                return typeof sHashFragment === "string" && sHashFragment.indexOf("#Shell-runStandaloneApp") === 0;
            },
            isApplicable: function (sHashFragment) {
                sHashFragment = this.cleanHash(sHashFragment);
                if (!sHashFragment) {
                    return false;
                }
                return sHashFragment === "#Test-url"
                    || sHashFragment === "#Test-local1"
                    || sHashFragment === "#Test-local2"
                    || sHashFragment === "#Test-config"
                    || sHashFragment === "#Test-clear"
                    || this.isRunStandaloneHash(sHashFragment);
            },
            parseUrl : function (url) {
                if (!this.aElement) {
                    this.aElement = window.document.createElement('a');
                }
                this.aElement.href = url;
                return this.aElement;
            },
            resolveHashFragment : function (sHashFragment) {
                var oDeferred = new jQuery.Deferred(),
                    hardCoded = null,
                    that = this,
                    res,
                    oParsedShellHash,
                    oLocal,
                    additionalInformation,
                    sPrefix,
                    newsh,
                    hasQM,
                    oParams,
                    sFullHashFragment = sHashFragment,
                    url;
                sHashFragment = this.cleanHash(sHashFragment);
                if (!sHashFragment) {
                    return false;
                }
                hardCoded = {
                    "#Test-config" : {
                        applicationType: "URL",
                        url: "/sap/bc/ui5_ui5/ui2/ushell/test-resources/sap/ushell/demoapps/FioriSandboxConfigApp",
                        additionalInformation : //"SAPUI5.Component=AppNavSample"
                            "SAPUI5.Component=sap.ushell.demoapps.FioriSandboxConfigApp"
                    },
                    "none" : {
                        applicationType: "URL",
                        url: "",
                        additionalInformation : ""
                    }
                };

                function getFromLocalStorage(sKey) {
                    if (localStorage) {
                        return localStorage[sKey];
                    }
                    return undefined;
                }

                function filterParams(oParams, sKey) {
                    var res = {},
                        a;
                    for (a in oParams) {
                        if (oParams.hasOwnProperty(a)) { // correct Object.hasOwnProperty.call(this,a)
                            if (a !== sKey) {
                                res[a] = oParams[a];
                            }
                        }
                    }
                    return res;
                }

                // return undefined URL if not in same domain or not in runStandaloneAppFolderWhitelist
                function localURL(sUrl) {
                    //that.parseUrl -> return an a(location)-object
                    if (that.parseUrl(sUrl).origin !== window.location.origin) {
                        return undefined;
                    }
                    //returns always an canonic absolute pathname
                    var sPathNameUrl = that.parseUrl(sUrl).pathname,
                        runStandaloneAppFolderWhitelist = jQuery.sap.getObject("runStandaloneAppFolderWhitelist", 0, oServiceConfig),
                        element;
                    if (!runStandaloneAppFolderWhitelist) {
                        return undefined;
                    }
                    for (element in runStandaloneAppFolderWhitelist) {
                        if (runStandaloneAppFolderWhitelist.hasOwnProperty(element)) {
                            if (runStandaloneAppFolderWhitelist[element]) {
                                if (element === "*" || sPathNameUrl.indexOf(that.parseUrl(element).pathname) === 0) {
                                    return sUrl;
                                }
                            }
                        }
                    }
                    return undefined;
                }
                function getURLParameter(sKey) {
                    return jQuery.sap.getUriParameters().get(sKey);
                }
                function getHashOrURLParameter(oParsedHash, sKey) {
                    return (oParsedHash.params && oParsedHash.params[sKey] && oParsedHash.params[sKey][0])
                        || getURLParameter(sKey);
                }
                function addToLocalStorage(sKey, sValue) {
                    if (localStorage) {
                        localStorage[sKey] = sValue;
                    }
                }
                if (hardCoded[sHashFragment]) {
                    res = hardCoded[sHashFragment];
                } else if (sHashFragment === "#Test-clear") {
                    addToLocalStorage("sap.ushell.#Test-local1", undefined);
                    addToLocalStorage("sap.ushell.#Test-local2", undefined);
                    jQuery.sap.log.info("NavTargetResolution: Local storage keys for #Test have been cleared");
                    res = hardCoded["#Test-config"];
                } else if (this.isRunStandaloneHash(sHashFragment)) {
                    oLocal = { applicationType : "URL" };
                    oParsedShellHash = sap.ushell.Container.getService("URLParsing").parseShellHash(sFullHashFragment);
                    additionalInformation =
                        (getHashOrURLParameter(oParsedShellHash, "sap-ushell-SAPUI5.Component") &&
                        "SAPUI5.Component=" + getHashOrURLParameter(oParsedShellHash, "sap-ushell-SAPUI5.Component"))
                        || (getHashOrURLParameter(oParsedShellHash, "sap-ushell-additionalInformation"));
                    url = getHashOrURLParameter(oParsedShellHash, "sap-ushell-url") || "";
                    // blend the parameters together: 
                    oParams = filterParams(oParsedShellHash.params, "sap-ushell-SAPUI5.Component");
                    oParams = filterParams(oParams, "sap-ushell-additionalInformation");
                    oParams = filterParams(oParams, "sap-ushell-url");
                    newsh = sap.ushell.Container.getService("URLParsing").paramsToString(oParams);
                    hasQM = url.indexOf('?') >= 0;
                    if (newsh) {
                        url = url + (hasQM ? (((url[url.length - 1] !== "&") && "&") || "") : "?") + newsh;
                    }
                    oLocal.url = localURL(url);
                    oLocal.additionalInformation = additionalInformation;
                    res = oLocal;
                } else if (sHashFragment === "#Test-local1" || sHashFragment === "#Test-local2" || sHashFragment === "#Test-url") {
                    res = getFromLocalStorage("sap.ushell." + sHashFragment);
                    if (!res || res === "undefined") {
                        oLocal = { applicationType : "URL" };
                    } else {
                        oLocal = JSON.parse(res);
                    }
                    // Configuring an app via url parameters is restricted to localhost for security reasons,
                    // unless explicitly enabled by config
                    if ((window.location.hostname === "localhost")
                            || oServiceConfig.allowTestUrlComponentConfig) {
                        sPrefix = "sap-ushell-test-" + sHashFragment.substring(6);
                        additionalInformation = getURLParameter(sPrefix + "-additionalInformation");
                        if (additionalInformation) {
                            oLocal.additionalInformation = additionalInformation;
                        }
                        url = getURLParameter(sPrefix + "-url");
                        if (url) {
                            oLocal.url = localURL(url);

                        }
                    }
                    if (!oLocal.url) {
                        jQuery.sap.log.info("NavTargetResolution: No configured app for " + sHashFragment + " found ( local storage or url params sap-ushell-test-local1-url  sap-ushell-test-local1-additionalInfo  not supplied? ");
                        jQuery.sap.log.info("NavTargetResolution: Defaulting to config app ...\n");
                        oDeferred.reject("URL is not resolvable");
                        return oDeferred.promise();
                    }
                    oLocal.url = localURL(oLocal.url);
                    res = oLocal;
                }
                if (res.url === undefined) {
                    oDeferred.reject("URL is not resolvable");
                    return oDeferred.promise();
                }
                jQuery.sap.log.info("NavTargetResolution: As URL:  http://localhost:8080/sap/bc/ui5_ui5/ui2/ushell/shells/abap/FioriLaunchpad.html?sap-ushell-test-local1-url=" + encodeURIComponent((res && res.url) || "") + "&sap-ushell-test-local1-additionalInformation=" + encodeURIComponent((res && res.additionalInfo) || "") + "#Test-local1");
                jQuery.sap.log.info("NavTargetResolution: Resolving " + sHashFragment + " to "  + JSON.stringify(res));
                oDeferred.resolve(res);
                return oDeferred.promise();
            }
            });

        /**
         * Returns the last successful resolution of a hash fragment or <code>undefined</code> if
         * no resolution has been performed yet.
         *
         * @private
         * @returns {object} the last successful resolution
         * @see #resolveHashFragment
         */
        this.getCurrentResolution = function () {
            return oCurrentResolution;
        };
    };
}());
