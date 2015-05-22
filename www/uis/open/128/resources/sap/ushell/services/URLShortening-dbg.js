// Copyright (c) 2013 SAP AG, All Rights Reserved
/**
 * @fileOverview Cross Application Navigation
 *
 *   This file exposes an API to perform (Invoke) Cross Application Navigation
 *   for applications for cross app navigation
 *
 *   it exposes interfaces to perform a hash change and/or trigger an external navigation
 *
 * @version 1.24.5
 */


/*global jQuery, sap, sessionStorage */
/*jslint nomen: true*/

(function () {
    "use strict";
    /*global jQuery, sap, location, hasher */
    jQuery.sap.declare("sap.ushell.services.URLShortening");
    jQuery.sap.require("jquery.sap.storage");

    /**
     * This method MUST be called by the Unified Shell's container only, others MUST call
     * <code>sap.ushell.Container.getService("CrossApplicationNavigation")</code>.
     * Constructs a new instance of the CrossApplicationNavigation service.
     *
     * @class A service to compact URL with application parameters exceeding a certain limit
     *        when passing them via the browser hash
     *        
     *        
     *  The browser hash is limited in length on certain platforms. 
     *  
     *  The technical means to resolve urls in the unified shell do not involve browser 
     *  has values, as actual parameters are: 
     *  a) Passed and returned by the NavTargetResolution service as an OData request/response value
     *  b) subsequently passed to the Application as URL 
     *
     * The length of these parameters shall not be restricted by "artificial" and platform dependent
     * browser url length. 
     * 
     * The URL Shortener Service allows to shorten a given navigation target url, replacing
     * extended parameters by a token.
     * 
     * The full url is persisted in the sessionStorage of the browser, and potentially 
     * in the backend via the corresponding adapter (Not yet implemente
     *
     * This interface is only for usage by shell-internal services
     * 
     * 
     * Technically this service only compacts Application Parameters of a shell hash, 
     * these are split into a retained part (roughly URL_PARAMS_LENGTH_LIMIT long) 
     * and an extended part
     * 
     * Thus there are several strategies to still construct and url exceeding the 
     * limit.
     *
     * Usage:
     *
     * <code>
     *   var oUrlShortening = sap.ushell.Container.getService("URLShortening");<br/>
     * </code>
     *
     * @constructor
     * @see sap.ushell.services.Container#getService
     * @since 1.20.0
     * @private
     */
    sap.ushell.services.URLShortening = function () {
        var self = this;
        this.ABBREV_PARAM_NAME = "sap-ushell-appparams";
        this.URL_LENGTH_LIMIT = 1023;
        this.URL_PARAMS_LENGTH_LIMIT = 512;
        /**
        * given a url which is a shell hash, attempt to reduce it by replacing 
        * params list with sap-ushell-args=XGUID
        *
        * where guid is an generated abbreviation. 
        * 
        * The Parameters are stored under XGUID using a backend persistence. 
        * 
        * The inverse operation expandHash 
        *
        * @param {oArgs} oArgs
        *     object encoding a semantic object and action
        *  e.g. <code>{ target : { semanticObject : "AnObject", action: "Action" },<br/>
        *         params : { A : "B" } }</code>
        *  or
        *  e.g. <code>{ target : { semanticObject : "AnObject", action: "Action", context  : "AB7F3C" },<br/>
        *         params : { A : "B", C : [ "e", "j"] } }</code>
        *  or  
        *      <code>{ target : { shellHash : "SO-36&jumper=postman" },
        *      }</code>
        * @returns {string}
        *     the href for the specified parameters; always starting with a hash character; all parameters are URL-encoded
        *
        * @since 1.20.0
        * @public
         */
        this.compactHash = function (oURL) {
            var oSegments,
                oResult,
                prependHash,
                oUrlParsing,
                sResString;
            if (typeof oURL !== "string" || oURL.length < self.URL_LENGTH_LIMIT) {
                return oURL; // no shortening
            }
            // decompose the URL
            oUrlParsing = sap.ushell.Container.getService("URLParsing");
            oSegments = oUrlParsing.parseShellHash(oURL);
            //
            prependHash = '';
            if (oURL.charAt(0) === '#') {
                prependHash = '#';
            }
            // already has a parameter name
            if (oSegments && oSegments.params && oSegments.params[self.ABBREV_PARAM_NAME]) {
                return oURL;
            }
            //
            oResult = this._splitParameters(oSegments.params);
            if (!oResult.key) {
                // parameter can not be shortened
                return oURL;
            }
            sResString = oUrlParsing.paramsToString(oResult.tailParams);
            this._storeValue(oResult.key, sResString);
            return prependHash + oUrlParsing.constructShellHash({
                target : {
                    semanticObject: oSegments.semanticObject,
                    action : oSegments.action,
                    contextRaw : oSegments.contextRaw
                },
                params : oResult.headParams,
                appSpecificRoute : oSegments.appSpecificRoute
            });
        };

        /**
         * do a simple test on length of the hash
         * issue a warning if it exceeds arbitrary limits. 
         * 
         * This function can be replaced by compactHash if a 
         * transparent URL shortening is desired.
         * 
         * currently it truncates the startup parameters if they exceed URL_PARAMS_LENGTH_LIMIT characters
         *
         * it returns an tupel { sHash : oUrl, 
         *                       oParams : parames encoded in url shell hash
         *                       oSkippedParams : params not encoded in url shell hash, undefined if no truncation occured
         *                     }
         *                       
         *
         * @since 1.20.0
         * @public
          */
        this.checkHashLength = function (oURL) {
            var oSegments,
                oResult,
                prependHash,
                oUrlParsing,
                sResString;
            if (typeof oURL !== "string" || oURL.length < self.URL_LENGTH_LIMIT) {
                return { hash : oURL }; // no shortening
            }
            // decompose the URL
            oUrlParsing = sap.ushell.Container.getService("URLParsing");
            oSegments = oUrlParsing.parseShellHash(oURL);
             //
            prependHash = '';
            if (oURL.charAt(0) === '#') {
                prependHash = '#';
            }
            //
            oResult = this._splitParameters(oSegments.params);
            if (oResult.key) {
                // shell parameter length may not exceed 512 
                jQuery.sap.log.error("Application startup parameter length exceeds " + self.URL_PARAMS_LENGTH_LIMIT + " characters, truncation occured!");
                delete oResult.headParams[this.ABBREV_PARAM_NAME];
                // parameter can not be shortened
                return {
                    hash : prependHash + oUrlParsing.constructShellHash({
                        target : {
                            semanticObject: oSegments.semanticObject,
                            action : oSegments.action,
                            contextRaw : oSegments.contextRaw
                        },
                        params : oResult.headParams,
                        appSpecificRoute : oSegments.appSpecificRoute
                    }),
                    params : oResult.headParams,
                    skippedParams : oResult.tailParams
                };
            }
            // decision -> do not support shortening, 
            // also do not limit url length. Thus we allow plattform dependent behaviour, good luck
            jQuery.sap.log.error("URL exceeds dangerous limits, arbitrary shortening or worse may occur!");
            return oURL;
        };

// split a parameters object, 
// return a tripel key, headParams, tailParams if split, 
// otherwise key is undefined
        this._splitParameters = function (oParams) {
            var a,
                i,
                k,
                key,
                headParams = {},
                tailParams = {},
                hasTail = false,
                obj,
                item,
                cLength = 0,
                delta,
                lst = [];
            // sort parameter names first, then truncate in deterministic order
            for (a in oParams) {
                if (Object.prototype.hasOwnProperty.call(oParams, a)) {
                    lst.push(a);
                }
            }
            lst.sort();
            //
            for (k = 0; k < lst.length; k = k + 1) {
                a = lst[k];
                obj = oParams[a];
                if (obj.length > 1) {
                    jQuery.sap.log.error("Array startup parameters violate the designed intent of the Unified Shell Intent, use only single-valued parameters!");
                }
                for (i = 0; i < obj.length; i = i + 1) {
                    item = oParams[a][i];
                    delta = a.length + item.length;
                    if (delta + cLength > this.URL_PARAMS_LENGTH_LIMIT) {
                        if (tailParams[a]) {
                            tailParams[a].push(item);
                        } else {
                            tailParams[a] = [item];
                        }
                        hasTail = true;
                    } else {
                        if (headParams[a]) {
                            headParams[a].push(item);
                        } else {
                            headParams[a] = [item];
                        }
                    }
                    cLength = cLength + delta + 1;
                }
            }
            if (hasTail) {
                key = this._generateKey();
                headParams[this.ABBREV_PARAM_NAME] = key;
            }
            return { key : key,
                     tailParams: tailParams,
                     headParams: headParams
                   };
        };

        /**
         * generate a unique string value 
         * The string value may not exceed 22 characters.
         * for efficiency reasons, it should have a good locality
         * (slow variation in the first bytes) with time. 
         */
        this._generateKey = function () {
            return jQuery.sap.uid();
        };
        /**
        *
        * expand a given url if the tag is present in the parameters list 
        *
        * @param {Object} oArgs
        * configuration object describing the target
        *
        *  e.g. <code>{ target : { semanticObject : "AnObject", action: "Action" },<br/>
        *         params : { A : "B" } }</code>
        *    constructs sth. like   <code>#AnObject-Action?A=B&C=e&C=j</code>;
        *  or
        *  e.g. <code>{ target : { semanticObject : "AnObject", action: "Action", context  : "AB7F3C" },<br/>
        *         params : { A : "B", C : [ "e", "j"] } }</code>
        *  or  
        *      <code>{ target : { shellHash : "SO-36&jumper=postman" },
        *      }</code>
        *
        * and navigate to it via changing the hash
        * @since 1.15.0
        * @public
        */
        this.expandHash = function (oURL) {
            var segments,
                val,
                prependHash,
                paramsExpanded;
            if (typeof oURL !== "string") {
                return oURL; // no shortening
            }
            // decompose the URL
            segments = sap.ushell.Container.getService("URLParsing").parseShellHash(oURL);
            // non parseable or does it have a special parameter name? 
            if (!segments || (segments && segments.params && !segments.params[this.ABBREV_PARAM_NAME])) {
                return oURL;
            }
            prependHash = '';
            if (oURL.charAt(0) === '#') {
                prependHash = '#';
            }
            // can we retrieve a value for it? 
            val = this._retrieveValue(segments.params[this.ABBREV_PARAM_NAME] && segments.params[this.ABBREV_PARAM_NAME][0]);
            if (!val) {
                return oURL;
            }
            paramsExpanded = this._blendParameters(segments.params, val);

            return prependHash + sap.ushell.Container.getService("URLParsing").constructShellHash(
                {
                    target : {
                        semanticObject : segments.semanticObject,
                        action : segments.action,
                        contextRaw : segments.contextRaw
                    },
                    params : paramsExpanded,
                    appSpecificRoute : segments.appSpecificRoute
                }
            );
        };

        this._retrieveValue = function (sKey) {
            return jQuery.sap.storage(jQuery.sap.storage.Type.session).get(sKey);
        };

        this._storeValue = function (sKey, sValue) {
            jQuery.sap.storage(jQuery.sap.storage.Type.session).put(sKey, sValue);
        };


        this._blendParameters = function (oParams, sValue) {
            var newParams = sap.ushell.Container.getService("URLParsing").parseParameters("?" + sValue),
                a;
            delete oParams[this.ABBREV_PARAM_NAME];
            for (a in newParams) {
                if (Object.prototype.hasOwnProperty.call(newParams, a)) {
                    if (oParams[a]) {
                        oParams[a] = oParams[a].concat(newParams[a]);
                    } else {
                        oParams[a] = newParams[a];
                    }
                }
            }
            return oParams;
        };


    }; // URLShortening
    sap.ushell.services.URLShortening.hasNoAdapter = true;
}());
