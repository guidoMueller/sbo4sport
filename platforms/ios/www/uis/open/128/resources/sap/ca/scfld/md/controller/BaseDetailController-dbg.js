/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.ui.core.mvc.Controller");
jQuery.sap.require("sap.ca.scfld.md.app.CommonHeaderFooterHelper");
/**
 * @class
 * @name sap.ca.scfld.md.controller.BaseDetailController
 * @extends sap.ui.core.mvc.Controller
 * @public
 */
sap.ui.core.mvc.Controller.extend("sap.ca.scfld.md.controller.BaseDetailController", {

	constructor : function() {
		this.oApplicationImplementation = sap.ca.scfld.md.app.Application.getImpl();
		// Make sure that our init-coding is executed even if the App overrides onInit() and does not call
		// onInit() of the super class.
		var fMyOnInit = jQuery.proxy(function() {

			// get routing object for navigation
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);

			this.oApplicationFacade = sap.ca.scfld.md.app.Application.getImpl().oConfiguration.oApplicationFacade;

			this.oConnectionManager = sap.ca.scfld.md.app.Application.getImpl().getConnectionManager();

			
			this.oApplicationImplementation.setModels(this);

			// for compatibility reasons. This only affects cases where the App defines the header itself and relies
			// on this piece of code that was entered by mistake
			if (jQuery.device.is.phone){
			  var oPage = this.getPage();
			  oPage.setShowNavButton(true);
			  oPage.attachNavButtonPress(this._navBack);
			}
			
			var oPage = this.getView().getContent()[0];
			oPage.setShowNavButton(jQuery.device.is.phone);
			oPage.attachNavButtonPress(this._navBack);
			
			// --------------------------
			var fMyOnBeforeShow = jQuery.proxy(function(evt) {
				this.oApplicationImplementation.defineDetailHeaderFooter(this);
			}, this);

			// register for onBeforeShow
			if (typeof this.onBeforeShow === "function") {
				var fAppOnBeforeShow = jQuery.proxy(this.onBeforeShow, this);
				this.onBeforeShow = function(evt) {
					fAppOnBeforeShow(evt);
					fMyOnBeforeShow(evt);
				};
			} else {
				this.getView().addEventDelegate({
					onBeforeShow : jQuery.proxy(function(evt) {
						fMyOnBeforeShow();
					}, this)
				});
			};
			// -------------------------------------
		}, this);

		var fAppOnInit = jQuery.proxy(this.onInit, this);
		this.onInit = function() {
			fMyOnInit();
			fAppOnInit();
		};
	},

	onInit : function() {
		// do not add any coding here. Just needed in case the App calls onInit() of the super class
	},

	/*
	 * override this method if you have not used the standard way to include the page in the view
	 */
	getPage : function(){
		return sap.ca.scfld.md.app.CommonHeaderFooterHelper.getPageFromController(this);
	}, 

	/*********************************************************************************************************************
	 * Obsolete: Use {@link #setHeaderFooterOptions} in order to explicitly set the header and footer when they need to be
	 * changed.
	 */
	getHeaderFooterOptions : function() {
		return null;
	},

	/**
	* sets the Details page header and footer.
	* @param {object} oOptions The following attributes are supported:
	* <p><b>Detail Page Header part:</b></p>
	* <ul>
	* <li>{string} <b>sI18NDetailTitle</b> you can provide the i18n-key for the title in the i18n-properties file of the App. </li>
	* <li>{string} <b>sDetailTitle</b> you can also set the title text directly. 
	* If both are not provided, the i18n-key DETAIL_TITLE will be taken.</li>
	* <li>{function} <b>onBack</b> provides your own back button behavior.</li>
	* <li>{object} <b>oUpDownOptions </b> in order to get the up-down buttons in the right upper header, please provide the following attributes:</li>
	* <ul>
	*     <li>iPosition -- the (0-based) index of the item currently displayed</li>
	*     <li>iCount -- the total number of items</li>
	*     <li>fSetPosition -- callback function that is called when a new item should be displayed. The (0-based) index of the new item is passed to this method</li>
	*     <li>sI18NDetailTitle -- key in your i18n-file which maps to a text with two placeholders (e.g. ' Order {0} of {1}') that is used as title on desktop and tablet ('Item {0} of {1}' is taken as default)</li>
	*     <li>sI18NPhoneTitle -- key in your i18n-file which maps to a text with two placeholders (e.g. ' Limit: {0} of {1}') that is used as title on phone ('{0} of {1}' is taken as default) </li>
	* </ul>
	* </ul>
	* <p><b>Detail Page Footer part:</b> -- there are several pre-defined buttons which you can use on the Footer bar if you provide the necessary attributes; 
	* there are also custom-defined buttons possible. In general, every button can have the following settings:</p>
	* <ul>
	*     <li><b>sId</b> -- an <i>optional</i> property to set an Id for the specific button. 
	*     This Id is meant to be used in the call of the setBtnEnables method.</li>
	*     <li><b>bDisabled</b> -- an <i>optional</i> property to set the button initially enabled/disabled</li>
	*     <li><b>sI18nBtnTxt</b> -- If the button doesn't have the fix predefined text, you can provide the key of the i18n text which is used as the text of the button</li>
	*     <li><b>onBtnPressed</b> -- callback function of the specific button</li>
	* </ul>
	*
	* Here are the buttons/attributes allowed on the Detail Page Footer bar:
	* <ul>
	* <li>{object} <b>oEditBtn</b> the button for default/recommended action of the view - 
	* usually this would be the edit but also other usages are possible.</li>
	* <li>{object} <b>oPositiveAction</b> can be used as the positive button e.g. for Approve action in an approval scenario</li>
	* <li>{object} <b>oNegativeAction</b> can be used as the negative button e.g. for Reject action in an approval scenario</li>
	* <li>{array} <b>buttonList</b> list of buttons which can be defined additionally</li>
	* <li>{object} <b>oAddBookmarkSettings</b> describe the settings for the Add-Bookmark-button, which should have the same parameters 
	* provided for "sap.ushell.services.Bookmark" with 
	* the exception that attribute url can be left out, as it is set by the scaffolding. The bookmark button will 
	* be displayed even if there are no settings provided, but can be suppressed via property <b>bSuppressBookmarkButton</b> explicitly.</li>
	* <li>{boolean} <b>bSuppressBookmarkButton</b> can suppress the Bookmark button from the 'Share' menu.</li>
	* <li>{object} <b>oEmailSettings</b> provide settings for the Email functionality:</li>
	*    <ul>
	*        <li>sSubject -- Email subject part</li>
	*        <li>sRecepient -- Email address of the recipient</li>
	*        <li>fGetMailBody -- function to provide Email body text</li>
	*    </ul>
	* <li>{object} <b>oJamOptions</b> in order to configure the "Share in SAP Jam" button and the "Discuss in SAP Jam" button</li>
	*    <ul>
	*        <li>{object} oShareSettings settings for the "Share in SAP Jam" button, for further allowed settings please check "sap.collaboration.components.fiori.sharing.Component.setSettings" method</li>
	*        <li>{object} oDiscussSettings settings for the "Discuss in SAP Jam" button, for further allowed settings please check "sap.collaboration.components.fiori.feed.Component.setSettings" method</li>
	*    </ul>
	* <li>{array} <b>additionalShareButtonList</b> contains information about additional buttons in the share menu.</li>
	* </ul>
	* @public
	* @name sap.ca.scfld.md.controller.BaseDetailController#setHeaderFooterOptions
	* @function
	*/
	setHeaderFooterOptions : function(oOptions) {
		this.oApplicationImplementation.oDHFHelper.setHeaderFooter(this, oOptions);
	},

	/**
	* enables/disables the header/footer button based on the given id
	* @param {string} sId id of the button to be updated
	* @param {boolean} bEnabled set the button enabled/disabled
	* @public
	* @name sap.ca.scfld.md.controller.BaseDetailController#setBtnEnabled
	* @function
	*/
	setBtnEnabled : function(sId, bEnabled) {
		if (this._oControlStore.oButtonListHelper) {
			this._oControlStore.oButtonListHelper.setBtnEnabled(sId, bEnabled);
		}
	},

	/**
	* updates the header/footer button text based on the given id
	* @param {string} sId id of the button to be updated
	* @param {string} sText the new text for the button to be updated
	* @public
	* @name sap.ca.scfld.md.controller.BaseDetailController#setBtnText
	* @function
	*/
	setBtnText : function(sId, sText) {
		if (this._oControlStore.oButtonListHelper) {
			this._oControlStore.oButtonListHelper.setBtnText(sId, sText);
		}
	},
	
	getHeaderBtn : function(){
		if (this._oControlStore.oHeaderBtn){
			return this._oControlStore.oHeaderBtn;
		}else{
			return null; 
		}
	},
	/*
	 * Override this method in order to describe wether this view is the main detail (S3) screen or a screen on deeper hierarchy level
	 * Note: This method must only return true or false.
	 * The default implementation also returns other values for compatibility reasons
	 */
  isMainScreen : function(){
  	if (this._oControlStore.oBackButton){
  		return false;
  	}
  	// for compatibility reasons in order to distinguish from overridden cases
  	return "X";
  },

	_navBack : function() {
		window.history.back();
	}
});
