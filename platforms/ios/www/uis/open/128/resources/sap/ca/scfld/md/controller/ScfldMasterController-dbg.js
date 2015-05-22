/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.ui.core.mvc.Controller");
jQuery.sap.require("sap.ca.scfld.md.app.CommonHeaderFooterHelper");

/**
 * @class This class shall be used as the base class for the master view controllers in master Detail scenarios
 * @name sap.ca.scfld.md.controller.ScfldMasterController
 * @constructor
 * @extends sap.ui.core.mvc.Controller
 * @public
 */
sap.ui.core.mvc.Controller.extend("sap.ca.scfld.md.controller.ScfldMasterController", {
	_onMasterListChanged : function(oEvent) {
		this._oApplicationImplementation.onMasterChanged(this);
		this.selectItemMatchingTheLastNavigation();
		var oList = this.getList();
		if (oList && oList.getMode() === "MultiSelect" && this._oApplicationImplementation.bManualMasterRefresh === true){ 
			oList.removeSelections(true); 
		}
		//when filtering and search are used together it can happen that the search activated the emptyList. If subsequently  
		//the filtering is removed the emptyList needs to be replaced by the original master list. The search can't do that because
		//commenHeaderFooter handler is not involved in filtering
	if (oList && oList.hasStyleClass("hiddenList") && oList.getBinding("items").getLength() > 0){
		this.getList().removeStyleClass("hiddenList");
		this._emptyList.addStyleClass("hiddenList");
		}
	},
	
	_handleItemPress : function(oEvent) {
		this.setListItem(oEvent.getSource());
	},
	_handleSelect : function(oEvent) {
		this.setListItem(oEvent.getParameter("listItem"));
		if (!sap.ui.Device.system.phone) {
			// note: this only applies when device is in
			// portrait mode
			this._oApplicationImplementation.oSplitContainer.hideMaster();
		}
	},
	_onMasterListLoaded : function(oEvent) {
		this.onDataLoaded();
		this._oApplicationImplementation.onMasterRefreshed(this);
		oEvent.oSource.detachChange(this._onMasterListLoaded, this);
		this._bListLoaded = true;
		this.fireEvent("_onMasterListLoaded");
	},
	constructor : function() {
		sap.ui.core.mvc.Controller.apply(this, arguments);
	
		var that = this;
		this._bListLoaded = false;
		var iRequestCount = 0;
		var oConnectionManager = null;
		// Make sure that our init-coding is executed even if the App overrides onInit() and does not call
		// onInit() of the super class.
		var fMyOnInit = jQuery.proxy(function() {
			// get routing object for navigation
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
	
			this._oApplicationImplementation = sap.ca.scfld.md.app.Application.getImpl();
			this.oApplicationFacade = this._oApplicationImplementation.oConfiguration.oApplicationFacade;
	
			oConnectionManager = this._oApplicationImplementation.getConnectionManager();
			iRequestCount = oConnectionManager.iRequestCount;
			
			// needed for set item from bookmark navigation
			this.oRouter.attachRoutePatternMatched(function(oEvent) {
				this._sDetailContextPath = undefined;
	
				if (this.isDetailRoute(oEvent)) {
					this._onDetailMatched(oEvent);
				}
				if (this.isMasterRoute(oEvent)) {
					this._onMasterMatched(oEvent);
				}
			}, this);
			
			this._iRequestCount = 0;
			var oModel = oConnectionManager.getModel(this.sModelName);
			// if the model could not be created still create header and footer bar, but then return
			if (!oModel){
				jQuery.sap.log.error("ScfldMasterController", "Initialization stopped, as no model is available");
				return;
			}
			oModel.attachRequestSent(null, function() {
				this._iRequestCount ++;
			}, this);

			oModel.attachRequestCompleted(null, function() {
				this._iRequestCount --;
				//some requests are sent before we attach us, we are only interested when 
				//there is no queue after initializing the controller
				if(this._iRequestCount < 0) {
					this._iRequestCount = 0;
				}
				if(this._iRequestCount === 0) {
					this.fireEvent("_allListModelUpdatesCompleted");
				}
			}, this);
			
			this._oApplicationImplementation.setModels(this);
			
			this._emptyList = new sap.m.List();
			this._emptyList.addStyleClass("hiddenList");
			this.getPage().addContent(this._emptyList);
			var fMyOnExit = jQuery.proxy(function() {
				if (this._emptyList){
					var oPage = this.getPage();
					if (oPage){
						oPage.removeContent(this._emptyList);
					}
					this._emptyList.destroy();
				}
			}, this);
			
			this._oApplicationImplementation.registerExitModule(fMyOnExit);

		}, this);
	
		var fAppOnInit = jQuery.proxy(this.onInit, this);
		this.onInit = jQuery.proxy(function() {
			fMyOnInit();
			fAppOnInit();
			var oList = this.getList();
			if (oList) {
				var oBinding = oList.getBinding("items");
				this._oApplicationImplementation.setMasterListBinding(this, oBinding);
			}
			// when no request was sent, header and footer will be displayed immediately
			if (iRequestCount == oConnectionManager.iRequestCount) {
				var bAllDisabled = !!oConnectionManager.sErrorInStartMessage;
				this._oApplicationImplementation.oMHFHelper.defineMasterHeaderFooter(this, bAllDisabled);
				if (bAllDisabled){
					this._bListLoaded = true;
					if (this._oApplicationImplementation.bIsPhone){
					  var oList = this.getList();
					  if (oList){
						  oList.setNoDataText(oConnectionManager.sErrorInStartMessage);
					  }
					} else {
						this.showEmptyView(this._oApplicationImplementation.oConfiguration.getDetailTitleKey(), undefined, oConnectionManager.sErrorInStartMessage);
					}
/*					  this.getView().addEventDelegate({
						  onBeforeShow : jQuery.proxy(function(){
					    this.showEmptyView(this._oApplicationImplementation.oConfiguration.getDetailTitleKey(), undefined, oConnectionManager.sErrorInStartMessage);
					  }, this)}); 
				  } */
			  }
			}
		}, this);
	},
	
	onInit : function() {
		// do not add any coding here. Just needed in case the App calls onInit() of the super class
	},
	
	/**
	* Override this method if you have not used the standard way to include the page in the view.
	* @public
	* @name sap.ca.scfld.md.controller.ScfldMasterController#getPage
	* @function
	* @memberOf sap.ca.scfld.md.controller.ScfldMasterController
	*/
	getPage : function(){
		return sap.ca.scfld.md.app.CommonHeaderFooterHelper.getPageFromController(this);
	}, 
	
	/**
	* Returns the list control of the master list
	* @public
	* @name sap.ca.scfld.md.controller.ScfldMasterController#getList
	* @function
	*/
	getList : function() {
		return this.byId("list");
	},
	
	/**
	* Maybe overridden.
	* Sets the list item and navigates to the corresponding hash.
	*
	* @public
	* @name sap.ca.scfld.md.controller.ScfldMasterController#setListItem
	* @function
	*/
	setListItem : function(oItem) {
		var oList = this.getList();
		if (oList) { 
			oList.removeSelections(true); 
		}		
		oItem.setSelected(true);
		this._navToListItem(oItem);
	},
	
	/**
	* May be overwritten to determine if the route is a detail route
	*
	* @param {object} oEvent: the route matched event
	* @public
	* @name sap.ca.scfld.md.controller.ScfldMasterController#isDetailRoute
	* @function
	*/
	isDetailRoute : function (oEvent) {
		var sName = oEvent.getParameter("name");
		return sName === this.getDetailRouteName();
	},
	
	/**
	* Needs to be overwritten if the name of the route leading to the detail view differs from the default which is "detail"
	* @returns {string} the name of the detail route
	* @public
	* @name sap.ca.scfld.md.controller.ScfldMasterController#getDetailRouteName
	* @function
	*/
	getDetailRouteName : function() {
		return "detail";
	},
	
	/**
	* May be overwritten to determine if the route is a master route
	* @param {object} oEvent: the route matched event
	* @returns {boolean} true if the route of the route matched event is a master route
	* @public
	* @name sap.ca.scfld.md.controller.ScfldMasterController#isMasterRoute
	* @function
	*/
	isMasterRoute : function (oEvent) {
		var sName = oEvent.getParameter("name");
		return sName === this.getMasterRouteName();
	},
	
	/**
	* Needs to be overwritten if the name of the route leading to the master view differs from the default which is "master"
	* @param {object} oEvent: the route matched event
	* @return {string} Name of the route leading to the master view 
	* @public
	* @name sap.ca.scfld.md.controller.ScfldMasterController#getMasterRouteName
	* @function
	*/
	getMasterRouteName : function() {
		return "master";
	},
	
	/**
	* gets executed when the hash matches the pattern of the master route
	* @private
	* @name sap.ca.scfld.md.controller.ScfldMasterController#_onMasterMatched
	* @function
	*/
	_onMasterMatched : function (oEvent) {
		//Do nothing on the phone, just show the list
		if(sap.ui.Device.system.phone) {
			return;
		}
	
		//Handle desktop
	
		//Wait for the list to load - then select the first item
		if(!this._bListLoaded) {
			this.attachEventOnce("_onMasterListLoaded", function() {
				this.selectFirstItem();
			}, this);
		} else {
			this.selectFirstItem();
		}
	},
	
	/**
	 * gets executed when the hash matches the pattern of the detail route
	 * @private
	 */
	_onDetailMatched : function (oEvent) {
		var sContextPath = this._sDetailContextPath = this.getBindingContextPathFor(oEvent.getParameter("arguments"));
		//List is still getting refreshed
		if(this._iRequestCount > 0) {
			this.attachEventOnce("_allListModelUpdatesCompleted", function () {
				this._handleDetailMatched(sContextPath);
			}, this);
			return;
		}
		
		//Wait for the list to load - then select the corresponding item
		if(!this._bListLoaded) {
			this.attachEventOnce("_onMasterListLoaded", function() {
				this._handleDetailMatched(sContextPath);
			}, this);
		} else {
			this._handleDetailMatched(sContextPath);
		}
	},
	
	/**
	 * checks if the item exists in the list, if it does not it will show the empty view
	 *@private
	 */
	_handleDetailMatched : function (sContextPath) {
		//no context path was given, an app might not have implemented this. Return before errors happen.
		if(sContextPath === undefined) {
			return;
		}
	
		var oItem = this.findItemByContextPath(sContextPath);
	
		//Item was not found
		if(!oItem) {
			//In the desktop case with backend search, the app can try to load more entries, if not the empty view will show up
			if (!sap.ui.Device.system.phone && this.isBackendSearch()) {
				this.applyFilterFromContext(sContextPath);
				return;
			}
			
			//we show the empty screen as default
			this.noItemFoundForContext(sContextPath);
			return;
		}
	
		var oList = this.getList();
		//Clear the list selection in the desktop case.
		if(!sap.ui.Device.system.phone && oItem) {
			if (oList) { 
				oList.removeSelections(true); 
			}			
			oItem.setSelected(true);
		}
	},

	/**
	* selects the last item that was hit by the detail route
	* @protected
	* @name sap.ca.scfld.md.controller.ScfldMasterController#selectItemMatchingTheLastNavigation
	* @function
	*/
	selectItemMatchingTheLastNavigation : function() {
		var oList = this.getList();
		if(this._sDetailContextPath === undefined) {
			return;
		}

		var oItem = oList.getSelectedItem();
		var oContext = oItem && oItem.getBindingContext(this.sModelName);

		//If this item is already selected, don't iterate over the whole list again
		if(oContext && oContext.getPath() === this._sDetailContextPath) {
			return;
		}

		oItem = this.findItemByContextPath(this._sDetailContextPath);
		if (oList) { 
			oList.removeSelections(true); 
		}
		if(oItem) {
			oItem.setSelected(true);
		}
	},

	/**
	* may be overwritten by the app - react on the case when an item was not found in the list after navigating
	* default implementation shows the empty view
	* @public
	* @name sap.ca.scfld.md.controller.ScfldMasterController#noItemFoundForContext
	* @function
	*/
	noItemFoundForContext : function(sContextPath) {
		if (this._oApplicationImplementation.bIsPhone){
			var oSplitContainer = this.getSplitContainer();
			oSplitContainer.to(this.getView(), "show");
		} else {
		  this.showEmptyView(null, null, this._oApplicationImplementation.oConnectionManager.sErrorInStartMessage);
		}
	},
	
	/**
	* Finds an item by the given contextPath
	* @param {string} sContextPath
	* @returns a listItem or null if it was not found
	* @protected
	* @name sap.ca.scfld.md.controller.ScfldMasterController#findItemByContextPath
	* @function
	*/
	findItemByContextPath : function (sContextPath) {
		var oBindingContext;
		var oList = this.getList();
		var aItems = oList.getItems();
	
		var result = jQuery.grep(aItems, function(oItem) {
			oBindingContext = oItem.getBindingContext(this.sModelName);
	
			if (oItem instanceof sap.m.GroupHeaderListItem) {
				return false;
			}
	
			if (oBindingContext && (oBindingContext.getPath() !== sContextPath)) {
				return false;
			}
	
			return true;
		});
		
		return result[0] || null;
	},
	
	
	/**
	* May be overwritten by the app: should create a Binding path from the arguments of the detail route, that matches a list item
	* @public
	* @name sap.ca.scfld.md.controller.ScfldMasterController#getBindingContextPathFor
	* @function
	*/
	getBindingContextPathFor : function (oArguments) {
		if(oArguments.contextPath === undefined) {
			jQuery.sap.log.warning("The context path was undefined. If you are using a route without it please overwrite the function getBindingContextPathFor in your master controller.");
			return undefined;
		}
	
		return "/" + oArguments.contextPath;
	},
	
	/**
	* Selects and navigates to the first item of the List
	* @public
	* @name sap.ca.scfld.md.controller.ScfldMasterController#selectFirstItem
	* @function
	*/
	selectFirstItem : function () {
		var oList = this.getList();
		var aItems = oList.getItems();
		var oListItem;
		
		if(aItems.length < 1) {
			return;
		}
		oListItem = this._oApplicationImplementation.getFirstListItem(this);
		
	  if (oListItem){
		  this.setListItem(oListItem);
	  }
	},

	/**
	* Navigates to a list item and adds a history on the phone. In desktop it is not history relevant
	* @private
	* @name sap.ca.scfld.md.controller.ScfldMasterController#_navToListItem
	* @function
	*/
	_navToListItem : function(oListItem) {
		this.oRouter.navTo(this.getDetailRouteName(), 
				this.getDetailNavigationParameters(oListItem), 
				!jQuery.device.is.phone);
	},

	/**
	* may be overwritten by the app: Should create the parameters necessary for injecting the values into the Detail route of the app.
	* @params : oListItem
	* @public
	* @name sap.ca.scfld.md.controller.ScfldMasterController#getDetailNavigationParameters
	* @function
	*/
	getDetailNavigationParameters : function(oListItem) {
		return {
			contextPath : oListItem.getBindingContext(this.sModelName).getPath().substr(1)
		};
	},
	
	/**
	* This method is meant to be overridden by the app. It shall return an object describing the Master page header and
	* footer content. Return <code>null</code> if you want to define Master page header and footer on your own (default
	* behavior). Otherwise return an object with attributes determining the Master page header and footer. 
	* The following attributes are supported:
	* <p><b>Master Page Header part:</b></p>
	* <ul>
	* <li><b>sI18NMasterTitle</b> {string} The i18n-key for the title of the master page in the i18n-properties file of the App. 
	* Note that the corresponding text should possess a placeholder for the number of displayed items (e.g. <i>Purchase
	* Orders ({0})</i>)</li>
	* <li><b>sI18NSearchFieldPlaceholder</b> {string} The i18n-key for the placeholder text to be displayed in the search field.
	* Note that this attribute should only be used if you want to display a more specific text then default ("Search"). E.g. "Search for Purchase Order ...". Normally, this will
	* only be sensible, if backend search is enabled or the application defines a very specific frontend search.</li>
	* <li><b>onBack</b> {function} provides your own back function, if you want to overwrite the default history.back behavior. 
	* If you want to suppress the Back-button in the master page, you can set the onBack attribute with value null.</li>
	* </ul>
	* <p><b>Master Page Footer part:</b> -- there are several pre-defined buttons which you can use on the Footer bar if you provide the necessary attributes; 
	* there are also custom-defined buttons possible. In general, every button can have the following settings:</p>
	* <ul>
	*     <li><b>sId</b> -- an <i>optional</i> property to set an Id for the specific button. 
	*     This Id is meant to be used in the call of the setBtnEnables method.</li>
	*     <li><b>bDisabled</b> -- an <i>optional</i> property to set the button initially enabled/disabled</li>
	*     <li><b>sI18nBtnTxt</b> -- If the button doesn't have the fix predefined text, you can provide the key of the i18n text which is used as the text of the button</li>
	*     <li><b>onBtnPressed</b> -- callback function of the specific button</li>
	* </ul>
	* 
	* Here are the buttons/attributes allowed on the Master Page Footer bar:
	* <ul>
	* <li><b>aAdditionalSettingButtons </b> {array} list of buttons which can be added to the TechnicalSettings-menu (e.g. About, Login Details and Logout). 
	* Every button should have the above listed meta information.</li>
	* <li>If you want to get the predefined add button, you can choose one of the following attributes:
	*    <ul>
	*        <li><b>onAddPress</b> {function} you can provide this callback function if you just want to get notified if the add button is pressed</li>
	*        <li><b>oAddOptions</b> {object} you can provide all the default meta-information for the add button, so that you can change the status of the button in runtime.</li>
	*    </ul>
	* </li>
	* <li>If you want to get the predefined edit button, you can choose one of the following attributes:
	*    <ul>
	*        <li><b>onEditPress</b> {function} you can provide this callback function if you just want to get notified if the edit button is pressed</li>
	*        <li><b>oEditBtn</b> {object} you can provide all the default meta-information for the edit button, so that you can change the status of the button in runtime.</li>
	*    </ul>
	* </li>
	* <li><b>oFilterOptions</b> {object} if you want to get the predefined filter button, besides above listed default button attributes, you can choose one of the following options:
	*     <ul>
	*        <li><b>onFilterPressed</b> {function} provide the callback function if you only want to get notified if the filter button is pressed.</li>
	*        <li>In case of your filter criterion/item can be represented by simple text with key, you can provide the following settings:
	*              <ul>
	*                  <li><b>aFilterItems</b> -- an array includes the possible filter items with the following attributes:</li>
	*                      <ul><li><b>text</b> -- the text to be shown to the user;</li>
	*                      <li><b>key</b> -- the unique filter key value.</li></ul>
	*                  <li><b>sSelectedItemKey</b> -- the key value of the default/current selected filter item.</li>
	*                  <li><b>onFilterSelected</b> -- the callback function for the application, if a filter item is selected; 
	*                  the filter key will be provided.</li>
	*              </ul>
	*         </li>
	*     </ul>
	* </li>
	* <li><b>oGroupOptions</b> {object} if you want to get the predefined group button, besides above listed default button attributes, you can choose one of the following options:
	*     <ul>
	*         <li><b>onGroupPressed</b> {function} provide the callback function if you only want to get notified if the group button is pressed.</li>
	*         <li>In case of your group criterion/item can be represented by simple text with key, 
	*         you can provide the following settings:
	*              <ul>
	*                  <li><b>aGroupItems</b> -- an array includes the possible group items with the following attributes:</li>
	*                      <ul><li><b>text</b> -- the text to be shown to the user;</li>
	*                      <li><b>key</b> -- the unique group key value.</li></ul>
	*                  <li><b>sSelectedItemKey</b> -- the key value of the default/current selected group item.</li>
	*                  <li><b>onGroupSelected</b> -- the callback function for the application, if a group item is selected; 
	*                  the filter key will be provided.</li>
	*               </ul>
	*          </li>
	*     </ul>
	* </li>
	* <li><b>oSortOptions</b> {object} if you want to get the predefined sort button, besides above listed default button attributes, you can choose one of the following options:
	*    <ul>
	*         <li><b>onSortPressed</b> {function} provide the callback function if you only want to get notified if the sort button is pressed.</li>
	*         <li>In case of your sort criterion/item can be represented by simple text with key, 
	*         you can provide the following settings:
	*             <ul>
	*                 <li><b>aSortItems</b> -- an array includes the possible sort items with the following attributes:</li>
	*                     <ul><li><b>text</b> -- the text to be shown to the user;</li>
	*                         <li><b>key</b> -- the unique sort key value.</li></ul>
	*                 <li><b>sSelectedItemKey</b> -- the key value of the default/current selected sort item.</li>
	*                 <li><b>onSortSelected</b> -- the callback function for the application, if a sort item is selected; 
	*                 the filter key will be provided.</li>
	*             </ul>
	*         </li>
	*    </ul>
	* </li>
	* <li><b>oPositiveAction</b> {object} can be used as the positive button e.g. for Approve action in an approval scenario</li>
	* <li><b>oNegativeAction</b> {object} can be used as the negative button e.g. for Reject action in an approval scenario</li>
	* <li><b>buttonList</b> {array} list of buttons which can be defined additionally</li>
	* </ul>
	* @public
	* @returns {object} oConfig Null or configuration object for master header and footer
	* @name sap.ca.scfld.md.controller.ScfldMasterController#getHeaderFooterOptions
	* @function
	*/
	getHeaderFooterOptions : function() {
		return null;
	},
	/**
	* enables/disables the header/footer button based on the given id
	* @param {string} sId id of the button to be updated
	* @param {boolean} bEnabled set the button enabled/disabled
	* @public
	* @name sap.ca.scfld.md.controller.ScfldMasterController#setBtnEnabled
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
	* @name sap.ca.scfld.md.controller.ScfldMasterController#setBtnText
	* @function
	*/
	setBtnText : function(sId, sText) {
		if (this._oControlStore.oButtonListHelper) {
			this._oControlStore.oButtonListHelper.setBtnText(sId, sText);
		}
	},
	
	/**
	* triggers a re-computation to adjust the master footer bar 
	* @public
	* @name sap.ca.scfld.md.controller.ScfldMasterController#refreshHeaderFooterForEditToggle
	* @function
	*/
	refreshHeaderFooterForEditToggle : function() {
		this._oApplicationImplementation.oMHFHelper.defineMasterHeaderFooterInner(this);
	},
	
	/**
	* Can be overwritten by the app: where selection is not the default data load behavior
	* @public
	* @name sap.ca.scfld.md.controller.ScfldMasterController#onDataLoaded
	* @function
	*/
	onDataLoaded : function() {
	},

	/**
	* displays the empty detail view with header and info text
	* @param {string} sViewTitle apps language model Key of the detail views title
	* @param {string} sLanguageKey scaffoldings language model Key of the emtpy page text
	* @param {string} sInfoText optional: instead of passing sLanguageKey, the text can directly be passed 
	* @public
	* @name sap.ca.scfld.md.controller.ScfldMasterController#showEmptyView
	* @function
	*/
	showEmptyView : function(sViewTitle, sLanguageKey, sInfoText) {
		var oList = this.getList();
		oList.removeSelections();
	
		var oView = this.oRouter.getView(this.getNoDataViewName(), sap.ui.core.mvc.ViewType.XML);
		var oSplitContainer = this.getSplitContainer();

		oSplitContainer.addDetailPage(oView);

		if (!sViewTitle){
			sViewTitle = this._oApplicationImplementation.oConfiguration.getDetailTitleKey()
		}		
		
		if (!sInfoText){
		   if (!sLanguageKey){
			   sLanguageKey = this._oApplicationImplementation.oConfiguration.getDefaultEmptyMessageKey()
		   }
    }
		var oController = oView.getController();
		if (oController.setTitleAndMessage){
			oController.setTitleAndMessage(sViewTitle, sLanguageKey, sInfoText);
			var oEventData = { };
		} else {
			var oEventData = {
				viewTitle : sViewTitle,
				languageKey : sLanguageKey,
				infoText : sInfoText
			};
		}
		oView.getController().setTitleAndMessage(sViewTitle, sLanguageKey, sInfoText);
		oSplitContainer.to(oView.getId(), "show", oEventData);
		return this;
	},

	/**
	* returns the split container, that contains the master view
	* @public
	* @name sap.ca.scfld.md.controller.ScfldMasterController#getSplitContainer
	* @function
	*/
	getSplitContainer : function () {
		return this._oApplicationImplementation.oSplitContainer;
//		return this.getView().getParent().getParent();
	},

	/**
	* Not yet documented
	* @public
	* @name sap.ca.scfld.md.controller.ScfldMasterController#getNoDataViewName
	* @function
	*/
	getNoDataViewName : function() {
		return "sap.ca.scfld.md.view.empty";
	},
	
	/**
	* Not yet documented - private?
	* @public
	* @name sap.ca.scfld.md.controller.ScfldMasterController#navToEmptyView
	* @function
	*/
	navToEmptyView : function() {
		this.showEmptyView();
	},
	
	/**
	* Can be overwritten to define a App specific frontend search. Note that in most cases it is more sensible
	* to override {@link applySearchPatternToListItem}
	* 
	* @param {string} sFilterPattern
	*          the content of the search field
	* @return the number of list items still visible
	* @public
	* @name sap.ca.scfld.md.controller.ScfldMasterController#applySearchPattern
	* @function
	*/
	applySearchPattern : function(sFilterPattern) {
		sFilterPattern = sFilterPattern.toLowerCase();
		var aListItems = this.getList().getItems();
		var bVisibility;
	
		var iCount = 0;
		var oGroupItem = null;
		var iCountInGroup = 0;
		for ( var i = 0; i < aListItems.length; i++) {
			if (aListItems[i] instanceof sap.m.GroupHeaderListItem){
				if (oGroupItem){
					if (iCountInGroup == 0){
						oGroupItem.setVisible(false);
					} else{
						oGroupItem.setVisible(true);
						oGroupItem.setCount(iCountInGroup);
					}
				}
				oGroupItem = aListItems[i];
				iCountInGroup = 0;
			} else {
			  bVisibility = this.applySearchPatternToListItem(aListItems[i], sFilterPattern);
			  aListItems[i].setVisible(bVisibility);
			  if (bVisibility) {
				  iCount++;
				  iCountInGroup++;
			  }
			}
		}
		//last group check, fix for CSS 0120061532 0003589854 2013
		if (oGroupItem){
			if (iCountInGroup == 0){
				oGroupItem.setVisible(false);
			} else{
				oGroupItem.setVisible(true);
				oGroupItem.setCount(iCountInGroup);
			}
		}
		//if search term is set to empty, take the binding length instead of the current visible items due to paging case.
		if (!sFilterPattern) {
			if (this._oMasterListBinding) {
				iCount = this._oMasterListBinding.getLength();
			}
		}
		return iCount;
	},
	
	/**
	* This method needs to be overridden in case backend search is active (see {@link isBackendSearch}). It
	* should modify the list binding such that it reflects the filter entered in the search field. Sample
	* coding: var oFilter = new sap.ui.model.Filter("MyField", sap.ui.model.FilterOperator.EQ, sFilterPattern);
	* var aFilters = [oFilter]; oBinding.filter(aFilters);
	* 
	* @param {string} sFilterPattern
	*          the content of the search field
	* @param {object} oBinding
	*          the context binding of the list items to be modified.
	* 
	* list binding needs to be updated with filter parameter -> this will trigger a new oData get automatically
	* @public
	* @name sap.ca.scfld.md.controller.ScfldMasterController#applyBackendSearchPattern
	* @function
	*/
	applyBackendSearchPattern : function(sFilterPattern, oBinding) {
	
	},

	/**
	 * @param {string} sContext
	 *          contains the hash provided via bookmark navigation Deeplink navigation with backend search
	 *          active: when navigating to the app via bookmark, the bookmarked item might not be part of the
	 *          initially loaded list items (usually the case for scenarios where more items exist in the
	 *          backend than shown at once in the list). The assumption in this case is that the backend search
	 *          is active in order to be able to retrieve further list items. If the check on the initial list
	 *          against the navigation context value gives no result, this method is being called. This method
	 *          needs to be overridden by apps where this scenario applies; the app has then to take care about
	 *          retrieving the correct item via backend search
	* @public
	* @name sap.ca.scfld.md.controller.ScfldMasterController#applyFilterFromContext
	* @function
	*/
	applyFilterFromContext : function(sContext) {
		this.showEmptyView();
	},
	
	/**
	* Override this method when defining a custom frontend search. This method will be called for each list
	* item and decides whether it fulfills the search criteria.
	* 
	* @param {object} oItem
	*          the item to be tested
	* @param {string} sFilterPattern
	*          the search pattern
	* @returns {boolean} whether the item fulfills the search pattern
	* @public
	* @name sap.ca.scfld.md.controller.ScfldMasterController#applySearchPatternToListItem
	* @function
	*/
	applySearchPatternToListItem : function(oItem, sFilterPattern) {
		if (sFilterPattern == "") {
			return true;
		}
		var oIteshellata = oItem.getBindingContext(this.sModelName).getProperty();
		for ( var sKey in oIteshellata) {
			var sValue = oIteshellata[sKey];
			// if (sValue instanceof Date) {
			// //just for the filter take each number as string
			// sValue = sValue.getDate() + "." +
			// sValue.getMonth() + "." + sValue.getFullYear();
			// }
			if (typeof sValue == "string") {
				if (sValue.toLowerCase().indexOf(sFilterPattern) != -1) {
					return true;
				}
			}
		}
		// if nothing found in unformatted data, check UI
		// elements
		if ((oItem.getIntro() && oItem.getIntro().toLowerCase().indexOf(sFilterPattern) != -1)
				|| (oItem.getTitle() && oItem.getTitle().toLowerCase().indexOf(sFilterPattern) != -1)
				|| (oItem.getNumber() && oItem.getNumber().toLowerCase().indexOf(sFilterPattern) != -1)
				|| (oItem.getNumberUnit() && oItem.getNumberUnit().toLowerCase().indexOf(sFilterPattern) != -1)
				|| (oItem.getFirstStatus() && oItem.getFirstStatus().getText().toLowerCase().indexOf(sFilterPattern) != -1)
				|| (oItem.getSecondStatus() && oItem.getSecondStatus().getText().toLowerCase()
						.indexOf(sFilterPattern) != -1)) {
			return true;
		}
		// last source is attribute array
		var aAttributes = oItem.getAttributes();
		for ( var j = 0; j < aAttributes.length; j++) {
			if (aAttributes[j].getText().toLowerCase().indexOf(sFilterPattern) != -1) {
				return true;
			}
		}
		return false;
	},
	/**
	* @private
	* @name sap.ca.scfld.md.controller.ScfldMasterController#_applyClientSideSearch
	* @function
	*/
	_applyClientSideSearch : function() {
		var sFilterPattern = this._oControlStore.oMasterSearchField.getValue();
		var iCount = this.applySearchPattern(sFilterPattern);
		this._oApplicationImplementation.oMHFHelper.setMasterTitle(this, iCount);
		this.evaluateClientSearchResult(iCount, this.getList(), this._emptyList);
	},
	
	/**
	* This function is called when a client side search was done. If the search returns 0 hits 
	* an empty list is shown on the master page displaying the "noDataText" of the master List.
	* If the search returns one or more hits the function makes sure that the master list is visible and
	* the empty list is hidden
	* @param {int} iSearchHitCount Number of elements found during by the search
	* @param {object} oMasterList The master list
	* @param {object} oEmptyList The empty list to be displayed instead of the master list if the search returns no results
	* @param {string} sNoDataText If this parameter is provided it will be used as the noDataText during the search
	* @public
	* @name sap.ca.scfld.md.controller.ScfldMasterController#evaluateClientSearchResult
	* @function
	*/
	evaluateClientSearchResult: function(iSearchHitCount, oMasterList, oEmptyList, sNoDataText){
		var noHitsTxt = sNoDataText;
		if (iSearchHitCount === 0){
			if (noHitsTxt === null || noHitsTxt === undefined){
				noHitsTxt = oMasterList.getNoDataText();
			}
			oEmptyList.setNoDataText(noHitsTxt);
			if (!oMasterList.hasStyleClass("hiddenList")){
				oMasterList.addStyleClass("hiddenList");
			}
			oEmptyList.removeStyleClass("hiddenList");
		}else{
			oMasterList.removeStyleClass("hiddenList");
			if(!oEmptyList.hasStyleClass("hiddenList")){
				oEmptyList.addStyleClass("hiddenList");
			}
			
		}
	},
	/**
	* determines whether search is triggered with each change of the search field content (or only when the
	* user explicitly starts the search). Default implementation triggers search immediately, exactly when
	* backend search is disabled (see {@link isBackendSearch}. Override this method if you want 'live' search
	* on backend or explicit search on frontend.
	* @public
	* @name sap.ca.scfld.md.controller.ScfldMasterController#isLiveSearch
	* @function
	*/
	isLiveSearch : function() {
		return !this.isBackendSearch();
	},
	
	/**
	* determines whether search (triggered by search field) is performed on backend or frontend (frontend being
	* default behavior).
	* @public
	* @name sap.ca.scfld.md.controller.ScfldMasterController#isBackendSearch
	* @function
	*/
	isBackendSearch : function() {
		return false;
	},
	
	/**
	* when ever you bind a master list dynamically you have to call this method
	* @public
	* @name sap.ca.scfld.md.controller.ScfldMasterController#registerMasterListBind
	* @function
	*/
	registerMasterListBind : function() {
		var oList = this.getList();
		var oBinding = oList.getBinding("items");
		var oConnectionManager = this._oApplicationImplementation.getConnectionManager()
		var iRequestCount = oConnectionManager.iRequestCount;
		this._oApplicationImplementation.setMasterListBinding(this, oBinding);
		// when no request was sent, header and footer will be displayed immediately
		if (iRequestCount == oConnectionManager.iRequestCount) {
			this._oApplicationImplementation.oMHFHelper.defineMasterHeaderFooter(this);
		}
	},

	/**
	* when ever you bind a master list dynamically you have to call this method
	* @param {string} sModelName the name of the model that is bound dynamically.
	* This must be the same name as defined in configuration.js.
	* @public
	* @name sap.ca.scfld.md.controller.ScfldMasterController#registerMasterListBinding
	* @function
	*/
	registerMasterListBinding : function(sModelName) {
		this.sModelName = sModelName;
		this.registerMasterListBind();
	}

});
