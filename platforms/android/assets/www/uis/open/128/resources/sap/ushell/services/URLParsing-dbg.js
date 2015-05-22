// Copyright (c) 2013 SAP AG, All Rights Reserved
/**
 * @fileOverview URL Parsing shell services
 *
 * URL Parsing serivces for shell compliant hashes
 *
 *
 * [ SO-Action~[Context]]
 * [ ? [A=B(&C=D)+]
 * &/
 *
 * The parsing functions are deliberately restrictive and fragile,
 * only shell compliant hashes are parsed correctly,
 * invalid or completely empty results ( not silently ignored parts) are returned if the hash is not deemed parseable
 */
(function () {
    "use strict";
    /*global jQuery, sap */
    jQuery.sap.declare("sap.ushell.services.URLParsing");

    // usage : sap.ushell.Container.getService("URLParsing").parseShellHash etc.

    /**
     * This method MUST be called by the Unified Shell's container only, others MUST call
     * <code>sap.ushell.Container.getService("URLParsing")</code>.
     * Constructs a new instance of the URL parsing service.
     *
     * @class The Unified Shell's internal URL parsing service (platform independent)
     *
     * Methods in this class allow to break down a shell compliant hash into it's respective parts
     * (SemanticObject,Action,Context, Parameters, appSpecificHash) or (ShellPart,appSpecificHash) respectively
     * or construct a hash from its constituents.
     *
     * All methods deal with the *internal* shellHash format.
     *
     * Most of the parse methods are robust w.r.t. a leading "#".
     *
     * Note: The functions were designed with a "truthy" behaviour for not present values,
     * Thus a client should not rely on the difference between null, "undefined", "" when testing for the
     * result of a parse action.
     *
     * The parsing functions are deliberately restrictive and fragile,
     * only shell compliant hashes are parsed correctly,
     * behaviour for non-compliant hashes is undefined and subject to change,
     * notably we do not aim do "degrade" nicefully or support partial parsing of corrupted urls.
     *
     * @constructor
     * @see sap.ushell.services.Container#getService
     * @since 1.15.0
     * @public
     */
    sap.ushell.services.URLParsing = function () {
        /*jslint regexp : true*/
        var reValidShellPart = /^(([A-Za-z0-9_\/]+)-([A-Za-z0-9_\/\-]+)(~([A-Z0-9a-z=+\/]+))?)?([?]([^&]|(&[^\/]))*&?)?$/;
        /**
         * Extract the Shell hash# part from an URL
         * The application specific route part is removed
         * @see getHash for a function which retains the app specific route
        *
        * Shell services shall use this service to extract relevant
        * parts of an URL from an actual URL string (which should be treated as opaque)
        * <p>
        * The URL has to comply with the Fiori-Wave 2 agreed upon format
        *
        * <p>
        * This service shall be used to extract a hash part from an url.
        * The result can be further broken up by parseShellHash
        *
        * examples <p>
        *
        * http://a.b.c?defhij#SemanticObject-Action~Context?PV1=A&PV2=B&/appspecific
        * <br/>
        * returns : "#SemanticObject-Action~Context?PV1=A&PV2=B&/appspecific"
        *
        * Note: the results when passing an illegal (non-compliant) url are undefined and subject to change
        * w.o. notice. Notably further checks may added.
        * The design is deliberately restrictive and non-robust.
        *
        * @param {string} sShellHashString
        *     a valid (Shell) url, e.g. <br/>
        *     <code>http://xx.b.c#Object-name~AFE2==?PV1=PV2&PV4=V5&/display/detail/7?UU=HH</code>
        * @returns {Object}
        *     the parsed result
        *
        *
        * @methodOf sap.ushell.services.URLParsing#
        * @name parseShellHash
        * @since 1.16.0
         *@public
        */
        this.getShellHash = function (sURL) {
            /*jslint regexp : true*/
            var re = /[^#]*#(([^&]|&[^\/])*)(&\/.*)?/,
                match = re.exec(sURL);
            if (match) {
                return match[1];
            }
            return undefined;
        };


        /**
         * Extract a hash part from an URL, including an app-specific part
         * @param {String} sURL
         *   any value
         * @returns {String}
         *   <code>extracted string</code> if and only if a hash is present, undefined otherwise
         * @since 1.16.0
         * @public
         */
        this.getHash = function (sURL) {
            /*jslint regexp : true*/
            var re = /[^#]#(.*)/,
                match = re.exec(sURL);
            if (match) {
                return match[1];
            }
            return undefined;
        };

        /**
         * parse parameters from a uri query string (starting with ?)
         * into a parameter object
         * @params {String} sParams
         *   Parameter string, e.g. <code>?ABC=1&ABC=1%202DEF=4</code>
         * @returns {Object} oParams
         *   any value { ABC : ["1","1 2"], DEF : ["4"]}
         * @since 1.20.0
         * @public
         */
        this.parseParameters = function (sParams) {
            if (!sParams) {
                return {};
            }
            
            var oParams = jQuery.sap.getUriParameters(sParams).mParams;
            
            if (!oParams){
            	return {};
            }else{
            	if (this.extractSearchTerm(sParams) !== ""){
                	oParams.searchTerm[0] = this.extractSearchTerm(sParams);
                }
                return oParams;	
            }
//            return jQuery.sap.getUriParameters(sParams).mParams || {};
        };

        /**
         * extract search term with &  
         * it is not extracted by jQuery.sap.getUriParameters(sParams) 
         * @params {String} str
         *   string, e.g. <code>?searchTerm=SALES & COSTS&dataSource={...}</code>
         * @returns {String} searchTerm
         *   value "SALES & COSTS"
         * @since 1.23.0
         * @public
         */
        this.extractSearchTerm = function (str) {
        	var startindex = str.indexOf("searchTerm=") + 11;
        	var endindex = str.indexOf("&dataSource={", startindex);
        	  
        	if (startindex !=-1 && endindex !=-1 &&  endindex  > startindex ){
              return str.substring(startindex , endindex );        		  
        	}else{
              return "";
        	};
        };
        
        /**
         * combine members of a javascript object into a
         * parameter string,
         * note that parameters are ordered in an arbitrary manner
         * which is subject to change
         * @param {Object} oParams
         *   any value { ABC : [1,"1 2"], DEF : ["4"]}
         * @returns {String}
         *   <code>ABC=1&ABC=1%202DEF=4</code>
         *   Note that the result is *not* prefixed with a "?",
         *   parameter values are encodeURIComponent encoded.
         * @since 1.20.0
         * @public
         */
        this.paramsToString = function (oParams) {
            var first,
                a,
                k,
                i,
                lst,
                shellPart = "";
            first = "";
            a = null;
            lst = [];
            for (a in oParams) {
                if (oParams.hasOwnProperty(a)) {
                    lst.push(a);
                }
            }
            lst.sort();
            for (k = 0; k < lst.length; k = k + 1) {
                a = lst[k];
                if (jQuery.isArray(oParams[a])) {
                    for (i = 0; i < oParams[a].length; i = i + 1) {
                        shellPart += first + encodeURIComponent(a) + "=" + encodeURIComponent(oParams[a][i]);
                        first = "&";
                    }
                } else {
                    shellPart += first + encodeURIComponent(a) + "=" + encodeURIComponent(oParams[a]);
                    first = "&";
                }
            }
            return shellPart;
        };

        /**
         * Decompose a shell hash into the respective parts
         * @param {String} sHash
         *  Hash part of a shell compliant URL
         *  <code>#SO-Action~Context?P1=a&P2=x&/route?RPV=1</code>
         *  the hash part of an URL, <br/> e.g. <code>"#Object-name~AFE2==?PV1=PV2&PV4=V5&/display/detail/7?UU=HH</code>
         *
         *  Note that params always has an Array for each parameter value!
         *
         * @returns {object}
         *   <code>undefined </code> if not a parseable hash <br/>
         *   <code> { semanticObject : string, <br/>
         *            action : string, <br/>
         *            contextRaw : string, <br/>
         *            params :  MapObject<String,Array[String]>, <br/>
         *            appSpecificRoute : string <br/>
         *          }
         *  </code>
         *
         * @since 1.16.0
         * @public
         */
        this.parseShellHash = function (sHash) {
            /*jslint regexp : true*/
            var re = reValidShellPart,
                oSplitHash,
                sSemanticObject,
                sAction,
                sContext,
                sParams,
                match,
                pm,
                pmx,
                a;
            if (!sHash) {
                return undefined;
            }
            // split shell-hash and app-specific parts first
            oSplitHash = this.splitHash(sHash);

            match = re.exec(oSplitHash.shellPart);
            if (match) {
                sSemanticObject = match[2];
                sAction = match[3];
                sContext = match[5];
                sParams = match[6];
                pm = this.parseParameters(sParams);
                return { semanticObject : sSemanticObject,
                    action : sAction,
                    contextRaw : sContext,
                    params : pm,
                    appSpecificRoute : oSplitHash.appSpecificRoute };
            }
            if (oSplitHash.appSpecificRoute) {
                return { semanticObject : undefined,
                    action : undefined,
                    contextRaw : undefined,
                    params :  {},
                    appSpecificRoute : oSplitHash.appSpecificRoute };
            }
            return undefined;
        };

        /**
        * @name privstripLeadingHash
        * @since 1.16.0
        * @private
        */
        this.privstripLeadingHash = function (sHash) {
            if (sHash[0] === '#') {
                return sHash.substring(1);
            }
            return sHash;
        };

        /**
         * split a Unified Shell compliant hash into an Object containing a shell specific part and an app specific parts</br>
         * for non compliant hash strings, the empty object {} is returned.
         * an optional leading # is stripped
         * @param {String} sHash
         *  Hash part of a shell conformant URL
         *  {code}#SO-Action~Context?P1=a&P2=x&/route?RPV=1{code}
         *  the hash part of an URL, e.g. {code}"#Object-name~AFE2==?PV1=PV2&PV4=V5&/display/detail/7?UU=HH{code}
         *
         *  Note that params always has an Array for each parameter value!
         *
         * @returns {object}
         *   <code>{}</code>(empty object) if not a parseable hash
         *   <code>{ shellPart : "Object-name~AFE2==?PV1=PV2&PV4=V5",<br/>
         *            appSpecificRoute : "display/detail/7?UU=HH"<br/>
         *         }</br>
         *    </code> otherwise
         *
         * @since 1.16.0
         * @public
         */
        this.splitHash = function (sHash) {
            var re = /^(?:#|)([\S\s]*?)(&\/[\S\s]*)?$/,
                aMatch,
                sShellPart,
                sAppSpecificRoute;

            if (sHash === undefined || sHash === null || sHash === "") {
                return {};
            }
            // break down hash into parts
            // "#SO-ABC~CONTXT?ABC=3A&DEF=4B&/detail/1?A=B");
            aMatch = re.exec(sHash);
            sShellPart = aMatch[1];
            if (sShellPart !== "" && !reValidShellPart.test(sShellPart)) {
                return {};
            }
            sAppSpecificRoute = aMatch[2];
            if (sShellPart || sAppSpecificRoute) {
                return {  shellPart : sShellPart,
                    appSpecificRoute : sAppSpecificRoute }; // ,"&/detail/1?A=B");
            }
            return {};
        };

        function appendIf(sUrl, app) {
            if (app) {
                return sUrl + app;
            }
            return sUrl;
        }

        /**
         * compose a shell Hash from it's respective parts
         * Note that it also may append an app specific route !
         * @returns {string}
         *  the hash part of an URL, e.g. <code>"Object-name~AFE2==?PV1=PV2&PV4=V5&/display/detail/7?UU=HH</code>
         *  returns "" for an undefined object
         *
         * @param {object} oShellHash
         *   <code>undefined </code> if not a parseable hash
         *   <code> { target : { semanticObject : string,<br/>
         *                       action : string,<br/>
         *                       contextRaw : string<br/>
         *                     },<br/>
         *            params :  MapObject<String,Array[String]>,<br/>
         *            appSpecificRoute : string<br/>
         *          }<br/>
         *    </code>
         *    xor
         *   <code> { target : { shellHash }<br/>
         *          }
         *    </code>
         *
         * @since 1.16.0
         * @public
         */
        this.constructShellHash = function (oShellHash) {
            var shellPart,
                result,
                i = null,
                k,
                lst = [],
                first = "?",
                a = null;
            if (!oShellHash) {
                return "";
            }
            // align lack of target
            if (!oShellHash.target) {
                oShellHash.target = {};
                oShellHash.target.semanticObject = oShellHash.semanticObject;
                oShellHash.target.action = oShellHash.action;
                oShellHash.target.contextRaw = oShellHash.contextRaw;
            }
            if (oShellHash.target.shellHash || oShellHash.target.shellHash === "") {
                result = this.privstripLeadingHash(oShellHash.target.shellHash);
                return appendIf(result, oShellHash.appSpecificRoute);
            }
            // reconstruct shell part
            if (oShellHash.target.semanticObject && oShellHash.target.action) {
                shellPart = oShellHash.target.semanticObject + "-" + oShellHash.target.action;
            } else {
                return appendIf("", oShellHash.appSpecificRoute);
            }

            if (oShellHash.target.contextRaw) {
                shellPart += "~" + oShellHash.target.contextRaw;
            }
            first = "?";
            a = null;
            lst = [];
            for (a in oShellHash.params) {
                if (oShellHash.params.hasOwnProperty(a)) {
                    lst.push(a);
                }
            }
            lst.sort();
            for (k = 0; k < lst.length; k = k + 1) {
                a = lst[k];
                if (jQuery.isArray(oShellHash.params[a])) {
                    if (oShellHash.params[a].length > 1) {
                        jQuery.sap.log.error("Array startup parameters violate the designed intent of the Unified Shell Intent, use only single-valued parameters!");
                    }
                    for (i = 0; i < oShellHash.params[a].length; i = i + 1) {
                        shellPart += first + encodeURIComponent(a) + "=" + encodeURIComponent(oShellHash.params[a][i]);
                        first = "&";
                    }
                } else {
                    shellPart += first + encodeURIComponent(a) + "=" + encodeURIComponent(oShellHash.params[a]);
                    first = "&";
                }
            }
            return appendIf(shellPart, oShellHash.appSpecificRoute);
        };

        /**
         * Makes the given server-relative service URL point to the system given as parameter
         * <code>sSystem</code> or to the system of the current application if <code>sSystem</code>
         * is empty.
         * <em>Server-relative URL</em> means a URL starting with exactly one "/" (also known as
         * absolute-path URL). <em>System of the current application</em> is the value of the
         * business parameter <code>sap-system</code> with which the application is started.
         * <p>
         * Applications must call this API for any service URL with empty parameter
         * <code>sSystem</code> to create service URLs which respect the system of the current
         * application. They may call this API with non-empty parameter <code>sSystem</code> if
         * application specific logic is to determine the target system for service calls.
         * <p>
         * With service URLs converted using this API, administrators can redirect service
         * calls to servers other than the Unified Shell frontend server via SAP Web
         * Dispatcher or SAP Gateway configuration.
         * <p>
         * The system is added via segment parameter <code>o</code> to the last URL segment of the
         * service URL. It is also possible to make this function put the system to a different
         * URL path segment of the service URL by specifying the empty segment parameter
         * <code>o</code>, e.g. <code>/sap/opu/odata/MyService;o=/MyEntities/$count?p1=v1</code>.
         * If both <code>sSystem</code> is empty and the current application has
         * no system, no system is added and the empty segment parameter <code>o</code> is removed.
         * <br/>
         * <b>Example 1:</b> <code>/sap/opu/odata/MyService/?p1=v1</code> is converted to
         * <code>/sap/opu/odata/MyService;o=SYS/?p1=v1</code> if the current application's system
         * is &quot;SYS&quot;.
         * However it remains unchanged if the both the current application's system <em>and</em>
         * the parameter <code>sSystem</code> are empty.<br/>
         * <b>Example 2:</b> <code>/sap/opu/odata/MyService;o=/MyEntities/$count?p1=v1</code> is
         * converted to
         * <code>/sap/opu/odata/MyService;o=sid(SYS.123)/MyEntities/$count?p1=v1</code> if
         * parameter <code>sSystem</code> is set to &quot;sid(SYS.123)&quot;</code>.
         * <p>
         * The URL is in no way normalized.
         *
         * @param {string} sServiceUrl
         *   a server-relative URL without system alias information
         * @param {string} [sSystem]
         *   a system specification like &quot;SYS&quot; or &quot;sid(SYS.123)&quot;; if empty the
         *   system of the current application is used
         * @returns {string}
         *   the service URL pointing to the system specified in parameter <code>sSystem</code> or
         *   to the system of the current application
         * @public
         * @since 1.19.1
         * @throws Error if the URL is not server-relative (e.g. <code>./something</code>,
         *   <code>http://foo.bar/something</code>, ...)
         */
        this.addSystemToServiceUrl = function (sServiceUrl, sSystem) {
            /*jslint regexp:true */
            var oResolution;

            if (!sServiceUrl || sServiceUrl.indexOf('/') !== 0
                    || sServiceUrl.indexOf('//') === 0) {
                throw new sap.ui2.srvc.Error("Invalid URL: " + sServiceUrl,
                    "sap.ushell.services.URLParsing");
            }

            oResolution =
                sap.ushell.Container.getService("NavTargetResolution").getCurrentResolution();
            if (!sSystem && oResolution && oResolution.url) {
                sSystem = jQuery.sap.getUriParameters(oResolution.url).get("sap-system");
            }

            if (/^[^?]*(;o=([\/;?]|$))/.test(sServiceUrl)) {
                // URL with ";o=" *not* followed by system: insert system
                sServiceUrl = sServiceUrl.replace(/;o=([\/;?]|$)/,
                    (sSystem ? ";o=" + sSystem : "") + "$1");
            } else if (!/^[^?]*;o=/.test(sServiceUrl) && sSystem) {
                // URL without ";o=": append system
                sServiceUrl = sServiceUrl.replace(/(\/[^?]*?)(\/$|$|(\/?\?.*))/,
                    "$1;o=" + sSystem + "$2");
            }

            sap.ushell.Container.addRemoteSystemForServiceUrl(sServiceUrl);
            return sServiceUrl;
        };
    };

    sap.ushell.services.URLParsing.hasNoAdapter = true;
}());
