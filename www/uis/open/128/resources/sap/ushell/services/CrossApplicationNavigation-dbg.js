// Copyright (c) 2013 SAP AG, All Rights Reserved
/**
 * @fileOverview Cross Application Navigation
 *
 *   This file exposes an API to perform (invoke) Cross Application Navigation
 *   for applications
 *
 *   It exposes interfaces to perform a hash change and/or trigger an external navigation
 *
 * @version 1.24.5
 */


/*global jQuery, sap */

(function () {
    "use strict";
    /*global jQuery, sap, location, hasher */
    jQuery.sap.declare("sap.ushell.services.CrossApplicationNavigation");

    /**
     * This method MUST be called by the Unified Shell's container only, others MUST call
     * <code>sap.ushell.Container.getService("CrossApplicationNavigation")</code>.
     * Constructs a new instance of the CrossApplicationNavigation service.
     *
     * @class The Unified Shell's CrossApplicationNavigation service, which allows to
     *        navigate to external targets or create links to external targets
     *
     * CrossApplicationNavigation currently provides platform independent functionality.
     *
     * This interface is for usage by applications or shell renderers/containers.
     *
     * Usage:
     *
     * example: see demoapps/AppNavSample/MainXML.controller.js
     *
     * <code>
     *   var xnavservice =  sap.ushell && sap.ushell.Container && sap.ushell.Container.getService;<br/>
     *      && sap.ushell.Container.getService("CrossApplicationNavigation");<br/>
     *   var href = ( xnavservice && xnavservice.hrefForExternal({<br/>
     *          target : { semanticObject : "Product", action : "display" },<br/>
     *          params : { "ProductID" : "102343333" }<br/>
     *          })) || "";<br/>
     * </code>
     *
     *
     * Parameter names and values are case sensitive.
     *
     * Note that the usage of multi-valued parameters (specifying an array with more than one member as parameter value, e.g.
     * <code>  params : { A : ["a1", "a2"] } </code> )
     * is possible with this API but <b>strongly discouraged</b>. Especially the navigation target matching performed at the back-end
     * is not supported for multi-value parameters. Furthermore, it is not guaranteed that additional parameter values specified in the
     * back-end configuration are merged with parameter values passed in this method.  
     *
     * Note that the application parameter length (including SemanticObject/Action) shall not exceed 512 bytes when serialized as UTF-8
     *
     * Note that when receiving the values as startup parameters (as part of the component data object) single values
     * are represented as an array of size 1. Above example is returned as
     * <code> deepEqual(getComponentData().startupParameters ,  { "ProductID" : [ "102343333" ] } ) </code>
     *
     * @constructor
     * @see sap.ushell.services.Container#getService
     * @since 1.15.0
     * @public
     */
    sap.ushell.services.CrossApplicationNavigation = function () {
        /**
         * Adds the system of the current application specified as <code>sap-system</code>
         * parameter in its URL to the parameter object <code>oTarget</code> used in the
         * methods {@link #hrefForExternal()} and {@link #toExternal()}.
         * The system is only added if the current application specifies it and
         * <code>oTarget</code> does not already contain this parameter.
         *
         * @param oTarget {object} The navigation target object
         *
         * @private
         */
        function addCurrentSystem(oTarget) {
            var oResolution = sap.ushell.Container.getService("NavTargetResolution")
                    .getCurrentResolution(),
                sSeparator,
                sSystem;

            if (oResolution && oResolution.url) {
                sSystem = jQuery.sap.getUriParameters(oResolution.url).get("sap-system");
            }

            if (!sSystem || typeof oTarget !== "object") {
                return;
            }
            if (oTarget.target && oTarget.target.shellHash) {
                if (typeof oTarget.target.shellHash === "string" &&
                        !/[?&]sap-system=/.test(oTarget.target.shellHash)) {
                    sSeparator = (oTarget.target.shellHash.indexOf("?") > -1) ? "&" : "?";
                    oTarget.target.shellHash += sSeparator + "sap-system=" + sSystem;
                }
                return;
            }
            oTarget.params = oTarget.params || {};
            if (!Object.prototype.hasOwnProperty.call(oTarget.params, "sap-system")) {
                oTarget.params["sap-system"] = sSystem;
            }
        }

        /**
        * Returns a string which can be put into the DOM (e.g. in a link tag)
        *
        * @param {oArgs} oArgs
        *     object encoding a semantic object and action
        *  e.g. <code>{ target : { semanticObject : "AnObject", action: "Action" },<br/>
        *         params : { A : "B" } }</code>
        *  or
        *  e.g. <code>{ target : { semanticObject : "AnObject", action: "Action", context  : "AB7F3C" },<br/>
        *         params : { A : "B", c : "e" } }</code>
        *  or
        *      <code>{ target : { shellHash : "SO-36&jumper=postman" },
        *      }</code>
        * @returns {string}
        *     the href for the specified parameters; always starting with a hash character; all parameters are URL-encoded (via encodeURIComponent)
        *
        * Note that the application parameter length (including SemanticObject/Action) shall not exceed 512 bytes when serialized as utf-8
        *
        *
        * @since 1.15.0
        * @public
         */
        this.hrefForExternal = function (oArgs) {
            if (sap.ushell && sap.ushell.services && sap.ushell.Container && typeof sap.ushell.Container.getService === "function" && sap.ushell.Container.getService("ShellNavigation")) {
                addCurrentSystem(oArgs);
                return sap.ushell.Container.getService("ShellNavigation").hrefForExternal(oArgs);
            }
            jQuery.sap.log.debug("Shell not available, no Cross App Navigation");
            return "";
        };

        /**
        *
        * Navigate to an external target
        *
        * @param {Object} oArgs
        * configuration object describing the target
        *
        *  e.g. <code>{ target : { semanticObject : "AnObject", action: "Action" },<br/>
        *         params : { A : "B" } }</code>
        *    constructs sth. like   <code>#AnObject-Action?A=B&C=e&C=j</code>;
        *  or
        *  e.g. <code>{ target : { semanticObject : "AnObject", action: "Action", context  : "AB7F3C" },<br/>
        *         params : { A : "B", c : "e" } }</code>
        *  or
        *      <code>{ target : { shellHash : "SO-36&jumper=postman" },
        *      }</code>
        *
        * and navigate to it via changing the hash
        *
        * Note that the application parameter length (including SemanticObject/Action) shall not exceed 512 bytes when serialized as utf-8
        *
        * @since 1.15.0
        * @public
        */
        this.toExternal = function (oArgs) {
            if (sap.ushell && sap.ushell.services && sap.ushell.Container && typeof sap.ushell.Container.getService === "function" && sap.ushell.Container.getService("ShellNavigation")) {
                addCurrentSystem(oArgs);
                sap.ushell.Container.getService("ShellNavigation").toExternal(oArgs);
                return;
            }
            jQuery.sap.log.debug("Shell not avialable, no Cross App Navigation");
            return;
        };


        /**
         * Returns a string which can be put into the DOM (e.g. in a link tag)
         * given an application specific hash suffix
         *
         * Example: <code>hrefForAppSpecificHash("View1/details/0/")</code> returns
         * <code>#SemanticObject-Action&/View1/details/0/</code> if the current application
         * runs in the shell and was started using "SemanticObject-Action" as
         * shell navigation hash
         *
         * @param {string} sAppHash
         *   the app specific router, obtained e.g. via router.getURL(...)
         * @returns {string}
         * A string which can be put into the link tag,
         *          containing the current shell navigation target and the
         *          specified application specific hash suffix
         *
         * Note that sAppHash shall not exceed 512 bytes when serialized as UTF-8
         * @since 1.15.0
         * @public
         */
        this.hrefForAppSpecificHash = function (sAppHash) {
            if (sap.ushell && sap.ushell.services && sap.ushell.Container && typeof sap.ushell.Container.getService === "function" && sap.ushell.Container.getService("ShellNavigation")) {
                return sap.ushell.Container.getService("ShellNavigation").hrefForAppSpecificHash(sAppHash);
            }
            jQuery.sap.log.debug("Shell not available, no Cross App Navigation; fallback to app-specific part only");
            // Note: this encoding is to be kept aligned with the encoding in hasher.js ( see _encodePath( ) )
            return "#" + encodeURI(sAppHash);
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
         *     c: "e"
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
         *   intent: "#AnObject-Action?A=B&C=e",
         *   text: "Perform action"
         * }
         * </pre>
         *
         *
         * @since 1.19.0
         * @public
         */
        this.getSemanticObjectLinks = function (sSemanticObject, mParameters, bIgnoreFormFactor) {
            // Note: check if "Shell not available" is not needed
            return sap.ushell.Container.getService("NavTargetResolution")
                .getSemanticObjectLinks(sSemanticObject, mParameters, bIgnoreFormFactor);
        };

        /**
         * Tells whether the given intent(s) are supported, taking into account the form factor of
         * the current device. "Supported" means that navigation to the intent is possible.
         *
         * @param {string[]} aIntents
         *   the intents (such as <code>"#AnObject-Action?A=B&c=e"</code>) to be checked
         *
         * @returns {object}
         *   A <code>jQuery.Deferred</code> object's promise which is resolved with a map
         *   containing the intents from <code>aIntents</code> as keys. The map values are
         *   objects with a property <code>supported</code> of type <code>boolean</code>.<br/>
         *   Example:
         * <pre>
         * {
         *   "#AnObject-Action?A=B&c=e": { supported: false },
         *   "#AnotherObject-Action2": { supported: true }
         * }
         * </pre>
         *
         * @since 1.19.1
         * @public
         */
        this.isIntentSupported = function (aIntents) {
            // Note: check if "Shell not available" is not needed
            return sap.ushell.Container.getService("NavTargetResolution")
                .isIntentSupported(aIntents);
        };
    }; // CrossApplicationNavigation
    sap.ushell.services.CrossApplicationNavigation.hasNoAdapter = true;
}());
