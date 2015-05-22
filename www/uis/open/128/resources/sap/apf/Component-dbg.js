/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
/*global jQuery, sap */

(function () {
    'use strict';

    jQuery.sap.declare("sap.apf.Component");

    jQuery.sap.require("sap.ui.core.UIComponent");
    jQuery.sap.require("sap.apf.api");

    /**
     * @public
     * @class Base Component for all APF based applications.
     * @name sap.apf.Component
     * @extends sap.ui.core.UIComponent
     */
    sap.ui.core.UIComponent.extend("sap.apf.Component", {
        oApi: null,

        metadata: {
            "name": "CoreComponent",
            "version": "0.0.1",
            "publicMethods": [ "getApi" ],
            "dependencies": {
                "libs": [ "sap.m", "sap.ui.ux3", "sap.ca.ui"]
            }
        },

        /**
         * @public
         * @description Initialize the Component instance after creation. The component, that extends this component should call this method.
         * @function
         * @name sap.apf.Component.prototype.init
         */
        init: function () {
            this.oApi = new sap.apf.Api(this);
            this.oApi.activateOnErrorHandling(true);

            //BLR team hook into!
            sap.ui.core.UIComponent.prototype.init.apply(this, arguments);
        },

        /**
         * @public
         * @description Creates the content of the component. A component, that extends this component should call this method.
         * @function
         * @name sap.apf.Component.prototype.createContent
         * @returns {sap.ui.core.Control} the content
         */
        createContent: function () {
            //BLR team hook into! Delete the next statement, if component creation is defined here.
            return sap.ui.core.UIComponent.prototype.createContent.apply(this, arguments);
        },

        /**
         * @public
         * @function
         * @name sap.apf.Component#getApi
         * @description Returns the instance of the APF API.
         * @returns {sap.apf.Api}
         */
        getApi: function () {
            return this.oApi;
        }
    });
}());