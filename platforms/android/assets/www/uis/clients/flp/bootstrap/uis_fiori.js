// Copyright (c) 2013 SAP AG, All Rights Reserved
/**
 * @fileOverview The Unified Shell's bootstrap code for the UIS platform.
 *
 * @version @version@
 */
(function () {
    "use strict";
    /*global jQuery, sap, window */
    var CacheBuster;

    window.initFioriModulePaths = function initFioriModulePaths() {
        window["uniorg-bonvendo-uis-cache-buster"] = new CacheBuster(window["uniorg-bonvendo-uis-build-timestamp"]);
        
        /*
        var FIORI_RESOURCE_PREFIX,
            FIORI_RESOURCE_SUFFIX,
            FIORI_EXTERNAL_RESOURCE_PREFIX,
            isDev = window.location.search.match(/(\?|&)dev=true($|&|#)/);
            
        if (isDev) {
            FIORI_RESOURCE_PREFIX = '';
            FIORI_RESOURCE_SUFFIX = '/sap/hana/uis/clients/flp';
            FIORI_EXTERNAL_RESOURCE_PREFIX = '/sap/hana/uis/clients/flp/sap';
        } else {
            FIORI_RESOURCE_PREFIX = '/sap/hana/uis/clients/flp/js';
            FIORI_RESOURCE_SUFFIX = '/sap/hana/uis/flp';
            FIORI_EXTERNAL_RESOURCE_PREFIX = '/sap/hana/uis/clients/flp/js/sap';
        }
        */
        
        jQuery.sap.registerResourcePath("uniorg", "/uniorg/bonvendo/ui/resources/uniorg");
        jQuery.sap.registerResourcePath("3rd", "/uniorg/bonvendo/ui/resources/3rd");
        //jQuery.sap.registerModulePath("uniorg", "/uniorg/bonvendo/ui/resources/uniorg");
        
        /*
        jQuery.sap.registerModulePath("sap.hana.uis.flp", FIORI_RESOURCE_PREFIX + FIORI_RESOURCE_SUFFIX);
        jQuery.sap.registerModulePath("sap.ushell.adapters", FIORI_EXTERNAL_RESOURCE_PREFIX + "/ushell/adapters/");
        jQuery.sap.registerModulePath("sap.ui2.srvc", FIORI_EXTERNAL_RESOURCE_PREFIX + "/ui2/srvc");
        jQuery.sap.registerModulePath("sap.ushell.base", FIORI_EXTERNAL_RESOURCE_PREFIX + "/ushell/base/");
        jQuery.sap.registerModulePath("sap.ushell.cloudAdapters.fiori", FIORI_EXTERNAL_RESOURCE_PREFIX + "/ushell/cloudAdapters/fiori");
        */
        
        //jQuery.sap.require("uniorg.ushell.services.Container");
        /*
        uniorg.bonvendo = {
            uis : {
                ushell : {
                    adapters : {
                        fiori : {}
                    }
                }
            }
        };
        */
        
        // UI5 translation does not contain properties files of format <lang>-<place> but only language
        // Meaning that if language is in format "en-US" then set it only ot "en"
        if (sap.ui.getCore().getConfiguration().getLanguage().indexOf('-') > 0) {
            sap.ui.getCore().getConfiguration().setLanguage(
                sap.ui.getCore().getConfiguration().getLanguage().split('-')[0]
            );
        }
        /*
        uniorg.ushell.adapters = {
            shop: uniorg.bonvendo.uis.ushell.adapters.shop
        };
        */
        
        //sap.hana.uis.FIORI_RESOURCE_PREFIX = FIORI_RESOURCE_PREFIX;
        
        // Loading the additional resources needed for the Fiori applications and not needed for the initial launchpad rendering
        // TODO: remove this code after upgrading to SAPUI5 1.20.4 or higher
        /*if (jQuery.sap.Version(sap.ui.version).inRange('0.0.0', '1.20.3')) {
            sap.ui.getCore().getEventBus().subscribe("launchpad", "contentRendered",
                function () {
                    //this setTimeout is MANDATORY to make this call an async one!
                    setTimeout(function () {
                        try {
                            jQuery.sap.require('sap.fiori.core-ext');
                        } catch (error) {
                            jQuery.sap.log.warning("failed to load sap.fiori.core-ext!");
                        }
                    }, 1);
                });
        }*/
        
        //  Fix search bug (search assumes String has startsWith() method)
        if (typeof String.prototype.startsWith !== 'function') {
            String.prototype.startsWith = function (str) {
                return this.indexOf(str) === 0;
            };
        }
        
    };
    
    /**
     * Cache Buster Constructor
     * @param ts - Time stamp
     * @constructor
     */
    CacheBuster = function CacheBuster(ts) {
        this.setTimestamp(ts || String(new Date().getTime()));
        // store the original function to intercept
        this._fnAjaxOrig = jQuery.ajax;
        this._fnIncludeScript = jQuery.sap.includeScript;
        this._fnIncludeStyleSheet = jQuery.sap.includeStyleSheet;
        this._fnValidateProperty = sap.ui.base.ManagedObject.prototype.validateProperty;
        
        this.init();
    };

    CacheBuster.prototype.setTimestamp = function setTimestamp(ts) {
        this.timestamp = ts;
    };

    CacheBuster.prototype.convertURL = function convertURL(sUrl) {
        //Avoid converting library.css if ie9
        if (sap.ui.Device.browser.msie && sap.ui.Device.browser.version <= 9 && sUrl.match("library.css$")) {
            return sUrl;
        }
        
        //Get file extension
        var extension = sUrl.split('.').pop().split(/\#|\?/)[0];
        if (/(xml|js|json|css)$/ig.test(extension) && sUrl.search("[?&]ts=") === -1) {
            //Add query param as '?' or '&'
            sUrl += (sUrl.split('?')[1] ? '&' : '?') + "ts=" + this.timestamp;
            return sUrl;
        }
        
        return sUrl;
    };
    /**
     * Initialize the cache busting mechanism
     * Extend the ajax, includeScript, includeStyleSheet, validateProperty methods
     */
    CacheBuster.prototype.init = function init() {
        var cacheBuster = this;
        // enhance the original ajax function with appCacheBuster functionality
        jQuery.ajax = function (url) {
            if (url && url.url) {
                url.url = cacheBuster.convertURL(url.url);
            }
            return cacheBuster._fnAjaxOrig.apply(this, arguments);
        };
        
        // enhance the includeScript function
        jQuery.sap.includeScript = function () {
            var oArgs = Array.prototype.slice.apply(arguments);
            if (oArgs[0]) { // Url
                oArgs[0] = cacheBuster.convertURL(oArgs[0]);
            }
            return cacheBuster._fnIncludeScript.apply(this, oArgs);
        };
        
        // enhance the includeStyleSheet function
        jQuery.sap.includeStyleSheet = function () {
            var oArgs = Array.prototype.slice.apply(arguments);
            if (oArgs[0]) { // Url
                oArgs[0] = cacheBuster.convertURL(oArgs[0]);
            }
            
            return cacheBuster._fnIncludeStyleSheet.apply(this, oArgs);
        };
        
        // enhance the validateProperty function to intercept URI types
        //  test via: new sap.ui.commons.Image({src: "acctest/img/Employee.png"}).getSrc()
        //            new sap.ui.commons.Image({src: "./acctest/../acctest/img/Employee.png"}).getSrc()
        //        var view = new sap.ui.core.ComponentContainer({
        //            url:"/content/ui5/TestComponent/Component.js"
        //        });
        //        view.getUrl();
        sap.ui.base.ManagedObject.prototype.validateProperty = function (sPropertyName) {
            var oMetadata = this.getMetadata(),
                oProperty = oMetadata.getAllProperties()[sPropertyName],
                oArgs;
            if (oProperty && oProperty.type === "sap.ui.core.URI") {
                oArgs = Array.prototype.slice.apply(arguments);
                try {
                    if (oArgs[1]) { /* Value */
                        oArgs[1] = cacheBuster.convertURL(oArgs[1]);
                    }
                } catch (ignore) {
                    // URI normalization or conversion failed, fall back to normal processing
                }
            }
            // either forward the modified or the original arguments
            return cacheBuster._fnValidateProperty.apply(this, oArgs || arguments);
        };
    };

}());