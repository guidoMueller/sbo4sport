/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
/*global jQuery, sap, OData */
jQuery.sap.declare("sap.apf.core.textResourceHandler");
jQuery.sap.require("sap.apf.utils.hashtable");
jQuery.sap.require("jquery.sap.resources");
(function() {
    'use strict';
/**
 * @class The text resource handler retrieves the texts from text bundles or
 *        property files. Text bundles which are not default loaded via apf, will
 *        be loaded on demand by the resource path handler.
 */
sap.apf.core.TextResourceHandler = function(oInject) {
	var oMessageHandler = oInject.messageHandler;
	var oCoreApi = oInject.coreApi;
	var oHTBundles = new sap.apf.utils.Hashtable(oMessageHandler);
	/**
	 * @description retrieves the not encoded text by label object
	 * @param {object} oLabel - label object from configuration
	 * @param {string[]} [aParameters] - array with parameters to replace place holders in text bundle
	 * @returns {string}
	 */
	this.getTextNotHtmlEncoded = function(oLabel, aParameters) {
		if (typeof oLabel === "string") {
			return handleKeyOnlyKind(oLabel, aParameters);
		}
		oMessageHandler.check((oLabel !== undefined && oLabel.kind !== undefined), "Error - oLabel is not compatible");
		if (oLabel.kind === "text") {
			oMessageHandler.check((oLabel.key !== undefined), "Error - oLabel is not compatible");
			return handleTextKind(oLabel, aParameters);
		} else {
			// unknown type
			return "";
		}
	};
	/**
	 * @description retrieves the encoded text by label object
	 * @param {object} oLabel - label object from configuration
     * @param {string[]} [aParameters] - Parameter for placeholder replacement in the message bundle
	 * @returns {string}
	 */
	this.getTextHtmlEncoded = function(oLabel, aParameters) {
		return jQuery.sap.encodeHTML(this.getTextNotHtmlEncoded(oLabel, aParameters));
	};
	/**
	 * @description returns a message text for message handling
	 * @param {string} sRessourceKey - Key of the message in the Ressourcefile
	 * @param {string[]} [aParameters] - Parameter for placeholder replacement in the message bundle
	 * @returns {string}
	 */
	this.getMessageText = function(sRessourceKey, aParameters) {
		var sText;
		loadTextBundles(sap.apf.core.constants.resourceLocation.apfUiTextBundle, sap.apf.core.constants.resourceLocation.applicationMessageTextBundle);
		if (oHTBundles.hasItem(sap.apf.core.constants.resourceLocation.applicationMessageTextBundle)) {
			sText = oHTBundles.getItem(sap.apf.core.constants.resourceLocation.applicationMessageTextBundle).getText(sRessourceKey, aParameters);
			if (sText !== sRessourceKey) {
				return sText;
			}
		}
		return oHTBundles.getItem(sap.apf.core.constants.resourceLocation.apfUiTextBundle).getText(sRessourceKey, aParameters);
	};
	// Private Functions 
	function loadTextBundles(oApfBundle, oApplicationBundle) {
		var sUrl;
		if (oHTBundles.hasItem(oApfBundle) === false) {
			sUrl = oCoreApi.getResourceLocation(oApfBundle);
			addCustomTextResource(oApfBundle, sUrl);
		}
		sUrl = oCoreApi.getResourceLocation(oApplicationBundle);
		if (sUrl !== "" && oHTBundles.hasItem(oApplicationBundle) === false) {
			addCustomTextResource(oApplicationBundle, sUrl);
		}
	
	}
	function handleTextKind(oLabel, aParameters) {
		loadTextBundles(sap.apf.core.constants.resourceLocation.apfUiTextBundle, sap.apf.core.constants.resourceLocation.applicationUiTextBundle);
		// first look in textbundle from application (applicationUiTextBundle), otherwise fallback is used (apfUiTextBundle)
		if (bKeyInTextBundle(oLabel.key, sap.apf.core.constants.resourceLocation.applicationUiTextBundle)) {
			return oHTBundles.getItem(sap.apf.core.constants.resourceLocation.applicationUiTextBundle).getText(oLabel.key, aParameters);
		} else if (bKeyInTextBundle(oLabel.key, sap.apf.core.constants.resourceLocation.apfUiTextBundle)) {
			return oHTBundles.getItem(sap.apf.core.constants.resourceLocation.apfUiTextBundle).getText(oLabel.key, aParameters);
		} else {
			oMessageHandler.putMessage(oMessageHandler.createMessageObject({
				code : "3001",
				aParameters : [ oLabel.key ],
				oCallingObject : this
			}));
			return "# text not available: " + oLabel.key;
		}
	}
	function handleKeyOnlyKind(key, aParameters) {
		loadTextBundles(sap.apf.core.constants.resourceLocation.apfUiTextBundle, sap.apf.core.constants.resourceLocation.applicationUiTextBundle);
		// first look in textbundle from application (applicationUiTextBundle), otherwise fallback is used (apfUiTextBundle)
		if (bKeyInTextBundle(key, sap.apf.core.constants.resourceLocation.applicationUiTextBundle)) {
			return oHTBundles.getItem(sap.apf.core.constants.resourceLocation.applicationUiTextBundle).getText(key, aParameters);
		} else if (bKeyInTextBundle(key, sap.apf.core.constants.resourceLocation.apfUiTextBundle)) {
			return oHTBundles.getItem(sap.apf.core.constants.resourceLocation.apfUiTextBundle).getText(key, aParameters);
		} else {
			oMessageHandler.putMessage(oMessageHandler.createMessageObject({
				code : "3001",
				aParameters : [ key ],
				oCallingObject : this
			}));
			return "# text not available: " + key;
		}
	}
    function bKeyInTextBundle(key, sTextBundle) {
		var oTextBundle = oHTBundles.getItem(sTextBundle);
		if (oTextBundle && oTextBundle.aPropertyFiles && oTextBundle.aPropertyFiles.length >= 0 && oTextBundle.aPropertyFiles[0].aKeys instanceof Array) {
			//noinspection RedundantIfStatementJS
            if (jQuery.inArray(key, oTextBundle.aPropertyFiles[0].aKeys) >= 0) {
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	}
	function addCustomTextResource(sKey, sUrl) {
		var oBundle = jQuery.sap.resources({
			url : sUrl,
			includeInfo : sap.ui.getCore().getConfiguration().getOriginInfo()
		});
		// remember the bundle under the given Key
		oHTBundles.setItem(sKey, oBundle);
	}
};
}());
