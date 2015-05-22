// Copyright (c) 2013 SAP AG, All Rights Reserved
/**
 * @fileOverview Shell Navigation Services,
 */

/*global jQuery, sap, location, hasher, jQuery */

(function () {
    "use strict";
    /*global jQuery, sap, location, hasher */
    jQuery.sap.require("sap.ui.thirdparty.signals");
    jQuery.sap.require("sap.ui.thirdparty.hasher");
    jQuery.sap.require("sap.ui.core.routing.HashChanger");

    jQuery.sap.declare("sap.ushell.services.ShellNavigation");

    sap.ui.core.routing.HashChanger.extend("sap.ushell.services.ShellNavigationHashChanger", {

        constructor : function () {

            sap.ui.core.routing.HashChanger.apply(this);
            this.priv_initializedByShellNav = false;    // initialization flag for the shellNavigationService
            this.oURLShortening = sap.ushell.Container.getService("URLShortening");
            this.privfnShellCallback = null;
            this.privappHashPrefix = "&/";
            this.privhashPrefix = "#";

            /**
             * obtain the current shell hash (with #) urlDecoded
             * Shortened(!)
             * @private
             */
            this.privgetCurrentShellHash = function () {
                var res = this.privsplitHash(hasher.getHash());
                return { hash : "#" + ((res && res.shellPart) ? res.shellPart : "") };
//                return "#" + ((res && res.shellPart) ? res.shellPart : "");
            };

            /**
             * internal, construct the next hash, with #
             * shortened(!)
             * @private
             */
            this.privconstructHash = function (sAppSpecific) {
                var o = this.privgetCurrentShellHash();
                o.hash = o.hash + sAppSpecific;
                return o;
            };

            /**
             * internal, without #
             * @private
             */
            this.privconstructShellHash = function (oShellHash) {
                return sap.ushell.Container.getService("URLParsing").constructShellHash(oShellHash);
            };

            /** split a shell hash into app and shell specific part
             *  @private
             *  @returns <code>null</code>, if sHash is not a valid hash (not parseable);
             *      otherwise an object with properties <code>shellPart</code> and <code>appSpecificRoute</code>
             *      the properties are <code>null</code> if sHash is falsy
             */
                // this method is deliberately restrictive to work only on proper hashes
                //  this may be made part of URLParser
            this.privsplitHash = function (sHash) {
                var oShellHash,
                    sAppSpecificRoute;

                if (sHash === undefined || sHash === null || sHash === "") {
                    return {
                        shellPart : null,
                        appSpecificRoute : null
                    };
                }
                // break down hash into parts
                // "#SO-ABC~CONTXT?ABC=3A&DEF=4B&/detail/1?A=B");
                oShellHash =  sap.ushell.Container.getService("URLParsing").parseShellHash(sHash);
                if (oShellHash === undefined || oShellHash === null) {
                    return null;
                }
                sAppSpecificRoute = oShellHash.appSpecificRoute;
                oShellHash.appSpecificRoute = undefined;
                return {  shellPart : (oShellHash && this.privstripLeadingHash(this.privconstructShellHash(oShellHash))) || null,
                    appSpecificRoute : (oShellHash && sAppSpecificRoute) || null }; // ,"&/detail/1?A=B");
            };

            /**
             * internal, central navigation hook trigger hash change
             * @private
             */
            this.privsetHash = function (sFullHash, sAppHash, writeHistory) {
                hasher.prependHash = "";
                sFullHash = this.privstripLeadingHash(sFullHash);
                sAppHash = sAppHash || "";
                if (writeHistory === undefined) {
                    writeHistory = true;
                }
                // don't call method on super class 
                // we set the full hash and fire the events for the app-specific part only
                // this is necessary for consistency of all events; hashSet and hashReplaced are
                // evaluated by sap.ui.core.routing.History
                if (writeHistory) {
                    this.fireEvent("hashSet", { sHash : sAppHash });
                    hasher.setHash(sFullHash);
                } else {
                    this.fireEvent("hashReplaced", { sHash : sAppHash });
                    hasher.replaceHash(sFullHash);
                }
            };

            this.privstripLeadingHash = function (sHash) {
                if (sHash[0] === '#') {
                    return sHash.substring(1);
                }
                return sHash;
            };

            /// protected api, only used by shell services
            /**
             * returns a string which can be put into the DOM (e.g. in a link tag)
             * Please use CrossApplicationNavigation service and do not invoke this method directly
             * if you are an application
             *
             * @param {Object} oArgs
             *     object encoding a semantic object and action
             *  e.g. { target : { semanticObject : "AnObject", action: "Action" },
             *         params : { A : "B" } }
             *         or
             *      { target : { shellHash : "SO-36&jumper=postman" },
             *      }
             * @param {boolean, optional} bVerbose
             * @returns {Object}
             *     the href for the specified parameters; always starting with a hash character; all parameters are URL-encoded
             *     
             *     in case bVerbose is true, an object 
             *     { hash : 
             *       params : 
             *       skippedParams : 
             *     }
             * with params, skippedParams containing nontruncated, truncated parameters if truncation occurred, 
             * otherwise undefined
             *
             * @methodOf sap.ushell.services.ShellNavigation#
             * @name hrefForExternal
             * @since 1.15.0
             * @private
             */
            this.hrefForExternal = function (oArgs, bVerbose) {
                var sTmp;
                if (bVerbose === true) {
                    sTmp = this.privhrefForExternalNoEnc(oArgs);
                    return { hash : encodeURI(sTmp.hash),
                             params : sTmp.params,
                             skippedParams : sTmp.skippedParams };
                }
                return encodeURI(this.privhrefForExternalNoEnc(oArgs).hash);
            };

            /**
             * Shortened(!)
             */
            this.privhrefForExternalNoEnc = function (oArgs, bVerbose) {
                var r;
                if (oArgs === undefined) {
                    return this.privgetCurrentShellHash();
                }
                // construct url
                if (oArgs && oArgs.target && (typeof oArgs.target.semanticObject === "string" || typeof oArgs.target.shellHash === "string")) {
                    r = "#" + this.privconstructShellHash(oArgs);
                    return this.oURLShortening.checkHashLength(r);
                }
                return this.privgetCurrentShellHash();
            };

            this.privgetAppHash = function (oArgs) {
                var sAppHash, oShellHash;
                if (oArgs && oArgs.target && (typeof oArgs.target.shellHash === "string")) {
                    oShellHash = sap.ushell.Container.getService("URLParsing").parseShellHash(oArgs.target.shellHash);
                    sAppHash = oShellHash && oShellHash.appSpecificRoute;
                    sAppHash = sAppHash && sAppHash.substring(2);
                }
                return sAppHash;
            };

            /**
             * returns a string which can be put into the DOM (e.g. in a link tag)
             * given an app specific hash suffix
             *
             * @param {string}
             *            sAppHash
             * @returns {string} a string which can be put into the link tag,
             *          containing the current shell hash as prefix and the
             *          specified application hash as suffix
             *
             * example: hrefForAppSpecificHash("View1/details/0/") returns
             * "#MyApp-Display&/View1/details/0/"
             * @methodOf sap.ushell.services.ShellNavigation#
             * @name parseShellHash
             * @since 1.15.0
             * @private
             */
            this.hrefForAppSpecificHash = function (sAppHash) {
                return encodeURI(this.privconstructHash(this.privappHashPrefix + sAppHash).hash);
            };

            /**
             *
             * Navigate to an external target
             * Please use CrossApplicationNavigation service and do not invoke this method directly!
             *
             * @param {Object}  configuration object describing the target
             *
             *  e.g. { target : { semanticObject : "AnObject", action: "Action" },
             *         params : { A : "B" } }
             *
             * constructs sth like    http://....ushell#AnObject-Action?A=B ....
             * and navigates to it.
             * @private
             */
            this.toExternal = function (oArgs) {
                var sHash = this.privhrefForExternalNoEnc(oArgs).hash, // shortened!
                    sAppHash = this.privgetAppHash(oArgs);
                this.privsetHash(sHash, sAppHash);
            };

            /**
             * constructs the full shell hash and
             * sets it, thus triggering a navigation to it
             * @param {string} sAppHash specific hash
             * @param writeHistory if true it adds a history entry in the browser if not it replaces the hash
             * @private
             */
            this.toAppHash = function (sAppHash, writeHistory) {
                var sHash = this.privconstructHash(this.privappHashPrefix + sAppHash).hash;
                this.privsetHash(sHash, sAppHash, writeHistory);
            };
        }
    });


    /**
     * Initialization for the shell navigation.
     *
     * This will start listening to hash changes and also fire a hashchanged event with the initial hash.
     * @protected
     * @return false if it was initialized before, true if it was initialized the first time
     */
    sap.ushell.services.ShellNavigationHashChanger.prototype.initShellNavigation = function (fnShellCallback) {

        if (this.priv_initializedByShellNav) {
            jQuery.sap.log.info("initShellNavigation already called on this ShellNavigationHashChanger instance.");
            return false;
        }

        this.privfnShellCallback = fnShellCallback;

        hasher.changed.add(this.treatHashChanged, this); //parse hash changes

        if (!hasher.isActive()) {
            hasher.initialized.addOnce(this.treatHashChanged, this); //parse initial hash
            hasher.init(); //start listening for history change
        } else {
            this.treatHashChanged(hasher.getHash());
        }
        this.priv_initializedByShellNav = true;
        return true;
    };

    /**
     * Initialization for the application
     *
     * The init method of the base class is overridden, because the hasher initialization (registration for hash changes) is already done
     * in <code>initShellNavigation</code> method. The application-specific initialization ensures that the application receives a hash change event for the
     * application-specific part if set in the  initial hash.
     * @protected
     * @return false if it was initialized before, true if it was initialized the first time
     */
    sap.ushell.services.ShellNavigationHashChanger.prototype.init = function () {
        if (this.priv_initialized) {
            jQuery.sap.log.info("init already called on this ShellNavigationHashChanger instance.");
            return false;
        }
        // fire initial hash change event for the app-specific part
        var oNewHash = this.privsplitHash(hasher.getHash()),
            sAppSpecificRoute = oNewHash && (oNewHash.appSpecificRoute || "  ").substring(2);  // strip &/
        this.fireEvent("hashChanged", { newHash : sAppSpecificRoute });
        this.priv_initialized = true;
        return true;
    };

    /**
     * Fires the hashchanged event, may be extended to modify the hash before firing the event
     * @param newHash the new hash of the browser
     * @param oldHash - the previous hash
     * @protected
     */
    sap.ushell.services.ShellNavigationHashChanger.prototype.treatHashChanged = function (newHash, oldHash) {
        var sAppSpecificRoute,
            sOldAppSpecificRoute,
            oNewHash,
            oOldHash,
            oError;
        newHash = this.oURLShortening.expandHash(newHash);
        oldHash = this.oURLShortening.expandHash(oldHash);
        oNewHash = this.privsplitHash(newHash);
        oOldHash = this.privsplitHash(oldHash);

        if (!oNewHash) {
            // illegal new hash; pass the full string and an error object
            oError = new Error("Illegal new hash - cannot be parsed: '" + newHash + "'");
            this.fireEvent("shellHashChanged", {
                newShellHash : newHash,
                newAppSpecificRoute : null,
                oldShellHash : (oOldHash ? oOldHash.shellPart : oldHash),
                error: oError
            });
            this.privfnShellCallback(newHash, null, (oOldHash ? oOldHash.shellPart : oldHash), oError);
            return;
        }
        if (!oOldHash) {
            // illegal old hash - we are less restrictive in this case and just set the complete hash as shell part
            oOldHash = {
                shellPart: oldHash,
                appSpecificRoute: null
            };
        }
        if (oNewHash.shellPart === oOldHash.shellPart && (oldHash !== undefined)) { // second condition holds true for initial load where we always want to trigger the shell navigation
            // app specific change only !
            sAppSpecificRoute = (oNewHash.appSpecificRoute || "  ").substring(2);  // strip &/
            sOldAppSpecificRoute = (oOldHash.appSpecificRoute || "  ").substring(2);  // strip &/
            // an empty string has to be propagated!
            this.fireEvent("hashChanged", { newHash : sAppSpecificRoute, oldHash : sOldAppSpecificRoute });
            return;
        }

        // all Shell specific callback -> load other app !
        this.fireEvent("shellHashChanged", { newShellHash : oNewHash.shellPart, newAppSpecificRoute : oNewHash.appSpecificRoute, oldShellHash :  oOldHash.shellPart});
        this.privfnShellCallback(oNewHash.shellPart, oNewHash.appSpecificRoute, oOldHash.shellPart);
    };

    /**
     * Sets the hash to a certain value, this hash is prefixed by the
     * @param sHash the hash
     * @param writeHistory if true it adds a history entry in the browser if not it replaces the hash
     * @protected
     */
    sap.ushell.services.ShellNavigationHashChanger.prototype.setHash = function (sHash) {
        this.toAppHash(sHash, /*writeHistory*/true);
    };

    /**
     * Replaces the hash to a certain value. When using the replace function no browser history is written.
     * If you want to have an entry in the browser history, please use set setHash function.
     * @param sHash the hash
     * @protected
     */
    sap.ushell.services.ShellNavigationHashChanger.prototype.replaceHash = function (sHash) {
        this.toAppHash(sHash, /* writeHistory */false);
    };

    /**
     * Gets the current hash
     *
     * Override the implementation of the base class and just return the application-specific hash part
     *
     * @protected
     */
    sap.ushell.services.ShellNavigationHashChanger.prototype.getHash = function () {
        return this.getAppHash();
    };

    /**
     * Gets the current application-specific hash part
     *
     *
     * @private
     */
    sap.ushell.services.ShellNavigationHashChanger.prototype.getAppHash = function () {
        var oNewHash = this.privsplitHash(hasher.getHash()),
            sAppSpecificRoute = oNewHash && (oNewHash.appSpecificRoute || "  ").substring(2);  // strip &/
        return sAppSpecificRoute;
    };

    /**
     * Cleans the event registration
     * @see sap.ui.base.Object.prototype.destroy
     * @protected
     */
    sap.ushell.services.ShellNavigationHashChanger.prototype.destroy = function () {
        hasher.changed.remove(this.treatHashChanged, this);
        sap.ui.core.routing.HashChanger.prototype.destroy.apply(this, arguments);
    };


    /**
     * This method MUST be called by the Unified Shell's container only, others MUST call
     * <code>sap.ushell.Container.getService("ShellNavigation")</code>.
     * Constructs a new instance of the shell navigation service.
     *
     * Note that the shell instantiation mechanism has to assure exactly one instance is created (!)
     *
     * @class The Unified Shell's internal navigation service (platform independent)
     *
     * This interface is for consumption by shell renderers/containers only
     *
     * It is not for direct usage by applications, see
     *
     * inner app navigation : UI5 interfaces (hashChanger, Router)
     * cross app navigation : @see CrossApplicationNavigation
     *
     *
     * Usage:
     *
     * example: see renders/fiorisandbox/Shell.controller.js
     *
     * <code>
     *   jquery.sap.require("sap.ushell.services.ShellNavigator");<br/>
     *   Shell.onHashChange(shellHash,appHash) {  / *resolve url, load app and exchange root view* / }<br/>
     *   Shell.init() {<br/>
     *     this.privShellNavigator =  sap.ushell.services.ShellNavigator();<br/>
     *     this.privShellNavigator.init(jQuery.proxy(this.doHashChange,this));<br/>
     *   }<br/>
     * </code>
     *
     * Note: further app specific integration via the reference app reuse code
     *  (setting of app specific handler)
     *
     *
     *
     * Note: the ShellNavigation service replaces the UI5 core HashChanger which abstracts from the
     * browser url modification.
     *
     * It performs the following services:
     * - encoding of the actual browser url hash ( via hasher.js).
     * - expansion of "shortened" urls ( AppParameterParts) via invocation.
     * - splitting of shellHash and AppSpecific hash and abstraction w.r.t. Eventing
     *
     * Thus it is crucial to use appropriate interfaces and not directly invoke
     * window.location.hash.
     *
     * - internal construction methods for a "current" App specific and non-app specific hash
     * (invoked by CrossApplicationNavigation), not to be invoked directly!
     *
     *
     * @constructor
     * @see sap.ushell.services.Container#getService
     * @since 1.15.0
     *
     * @public
     */
    function ShellNavigation() {
        // instantiate and exchange the HashChanger from UI5
        this.hashChanger = new sap.ushell.services.ShellNavigationHashChanger();
        /////////////////////////////// api for external usage

        /**
         * returns a string which can be put into the DOM (e.g. in a link tag)
         * (it may shorten the app specific parts of the url to fit browser restrictions)
         *
         * @param {oArgs}
         *     object encoding a semantic object and action
         *  e.g. { target : { semanticObject : "AnObject", action: "Action" },
        *         params : { A : "B" } }
         *         or
         *      { target : { shellHash : "SO-36&jumper=postman" },
        *      }
         * @returns {Object}
         *     the href for the specified parameters; always starting with a hash character; all parameters are URL-encoded
         * xor (bVebose === true)
         *     an object containing { hash : ,  skippedParams:  } with skippedParams not undefined iff 
         *     parameters where truncated
         * 
         *
         * @methodOf sap.ushell.services.ShellNavigation#
         * @name hrefForExternal
         * @since 1.15.0
         * @private
         */
        this.hrefForExternal = function (oArgs, bVerbose) {
            return this.hashChanger.hrefForExternal(oArgs, bVerbose);
        };

        /**
         * returns a string which can be put into the DOM (e.g. in a link tag)
         * given an app specific hash suffix,
         * (it may shorten the app specific parts of the url to fit browser restrictions)
         *
         * @param {string}
         *            sAppHash
         * @returns {string} a string which can be put into the link tag,
         *          containing the current shell hash as prefix and the
         *          specified application hash as suffix
         *
         * example: hrefForAppSpecificHash("View1/details/0/") returns
         * "#MyApp-Display&/View1/details/0/"
         * @methodOf sap.ushell.services.ShellNavigation#
         * @name parseShellHash
         * @since 1.15.0
         * @private
         */
        this.hrefForAppSpecificHash = function (sAppHash) {
            return this.hashChanger.hrefForAppSpecificHash(sAppHash);
        };

        /**
         * Navigate to an external target
         *
         * @param {Object}  configuration object describing the target
         *
         *  e.g. { target : { semanticObject : "AnObject", action: "Action" },
         *         params : { A : "B" } }
         *
         * constructs sth like    http://....ushell#AnObject-Action?A=B ....
         * and navigates to it.
         * @private
         */
        this.toExternal = function (oArgs) {
            this.hashChanger.toExternal(oArgs);
        };

        /**
         * Constructs the full shell hash and
         * sets it, thus triggering a navigation to it
         * @param {string} sAppHash specific hash
         * @param writeHistory if true it adds a history entry in the browser if not it replaces the hash
         * @private
         */
        this.toAppHash = function (sAppHash, writeHistory) {
            this.hashChanger.toAppHash(sAppHash, writeHistory);
        };

        // Lifecycle methods

        /**
         * Initializes ShellNavigation
         * 
         * This function should be used by a custom renderer in order to implement custom navigation.
         * Do not use this function for developing Fiori applications.   
         * 
         * This method should be invoked by the Shell in order to:
         * - Register the event listener
         * - Register the container callback for the (currently single) ShellHash changes.
         * 
         * Signature of the callback function(
         *         sShellHashPart,  // The hash part on the URL that is resolved and used for application loading
         *         sAppSpecificPart // Typically ignored
         *         sOldShellHashPart, // For bookkeeping only (unreliable)
         *         
         * @param {function} The callback method for hash changes
         *  
         * @public
         */
        this.init = function (fnShellCallback) {
            hasher.prependHash = "";
            sap.ui.core.routing.HashChanger.replaceHashChanger(this.hashChanger);
            this.hashChanger.initShellNavigation(fnShellCallback);
            return this;
        };
    } // ShellNavigation

    // Note: the container instantiation mechanism has to assure exactly one instance is created
    sap.ushell.services.ShellNavigation = ShellNavigation;
    sap.ushell.services.ShellNavigation.hasNoAdapter = true;


}());
