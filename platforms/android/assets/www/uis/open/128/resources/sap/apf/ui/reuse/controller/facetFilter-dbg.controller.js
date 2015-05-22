/*!
* SAP APF Analysis Path Framework
* 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
*/
jQuery.sap.require('sap.apf.ui.utils.facetFilterListHandler');
/**
* @class facetFilter
* @memberOf sap.apf.ui.reuse.controller
* @name facetFilter
* @description controller for view.facetFilter
*/
sap.ui.controller("sap.apf.ui.reuse.controller.facetFilter", {
	/**
	 * @public
	 * @function
	 * @name sap.apf.ui.reuse.controller.facetFilter#onInit
	 * @description Called on initialization of the view.
	 * Instantiates all facet filter list related resources.
	 * Sets the initial binding.
	 * Populates value help and selected filters.
	 * */
	onInit : function() {
		var oSelf = this;
		this.oView = this.getView();
		this.oCoreApi = this.oView.oCoreApi;
		this.oUiApi = this.oView.oUiApi;
		this.oPathContextHandler = this.oView.oPathContextHandler;
		this.aFacetFilterListData = this.oView.aFacetFilterListData;
		this.aFacetFilterListControls = this.oView.aFacetFilterListControls;
		this.aFacetFilterListHandlers = this.aFacetFilterListData.map(function(oFacetFilterData) {
			return new sap.apf.ui.utils.FacetFilterListHandler(oSelf.oCoreApi, oSelf.oUiApi, oSelf.oPathContextHandler, oFacetFilterData);
		});
		this.aFacetFilterListDatasets = this.aFacetFilterListData.map(function() {
			return [];
		});
		this._setInitialBinding();
		this._populateValueHelpData();
		this._updateSelectedFilters();
	},
	/**
	 * @private
	 * @function
	 * @name sap.apf.ui.reuse.controller.facetFilter#_setInitialBinding
	 * @description Binds the appropriate JSONModel to facet filter list controls.
	 * */
	_setInitialBinding : function() {
		var oSelf = this;
		this.aFacetFilterListControls.forEach(function(oFacetFilterListControl, index) {
			oFacetFilterListControl.bindItems("/", new sap.m.FacetFilterItem({
				key : '{key}',
				text : '{text}',
				selected : '{selected}'
			}));
			var oModel = new sap.ui.model.json.JSONModel(oSelf.aFacetFilterListDatasets[index]);
			oModel.setSizeLimit(1000);
			oFacetFilterListControl.setModel(oModel);
		});
	},
	/**
	 * @private
	 * @function
	 * @name sap.apf.ui.reuse.controller.facetFilter#_populateValueHelpData
	 * @description Fetches value help data for all facet filter list controls.
	 * */
	_populateValueHelpData : function() {
		var oSelf = this;
		this.aFacetFilterListHandlers.forEach(function(oFflHandler, index) {
			oFflHandler.fetchValueHelpData().then(oSelf._populateValueHelpDataFor(index));
		});
	},
	/**
	 * @private
	 * @function
	 * @name sap.apf.ui.reuse.controller.facetFilter#_updateSelectedFilters
	 * @description Updates selected filter data for all facet filter list controls.
	 * */
	_updateSelectedFilters : function() {
		var oSelf = this;
		this.aFacetFilterListHandlers.forEach(function(oFflHandler, index) {
			oFflHandler.fetchSelectedFilterData().then(oSelf._updateSelectedFilterFor(index));
		});
	},
	/**
	 * @private
	 * @function
	 * @name sap.apf.ui.reuse.controller.facetFilter#_populateValueHelpDataFor
	 * @param {integer} index of facet filter control.
	 * @description Returns a closure which will be invoked when value help promise is resolved.
	 * @returns {function}
	 * */
	_populateValueHelpDataFor : function(index) {
		var oFacetFilterListControl = this.aFacetFilterListControls[index];
		var oFacetFilterData = this.aFacetFilterListData[index];
		var aFacetFilterListDataSet = this.aFacetFilterListDatasets[index];
		var oFacetFilterListModel = oFacetFilterListControl.getModel();
		return function(aData) {
			aData.forEach(function(oData) {
				var bSelected = false;
				var nIndex = -1;
				aFacetFilterListDataSet.forEach(function(oDataRow, index) {
					if (oDataRow.key === oData.key) {
						nIndex = index;
						return;
					}
				});
				if (nIndex !== -1) {
					bSelected = aFacetFilterListDataSet[nIndex].selected;
					aFacetFilterListDataSet.splice(nIndex, 1);
				}
				aFacetFilterListDataSet.push({
					key : oData.key,
					text : oData.text,
					selected : bSelected
				});
			});
			oFacetFilterListModel.updateBindings();
		};
	},
	/**
	 * @private
	 * @function
	 * @name sap.apf.ui.reuse.controller.facetFilter#_updateSelectedFilterFor
	 * @param {integer} index of facet filter control.
	 * @description Returns a closure which will be invoked when selected filter promise is resolved.
	 * @returns {function}
	 * */
	_updateSelectedFilterFor : function(index) {
		var oFacetFilterListControl = this.aFacetFilterListControls[index];
		var oFacetFilterData = this.aFacetFilterListData[index];
		var aFacetFilterListDataSet = this.aFacetFilterListDatasets[index];
		var oFacetFilterListModel = oFacetFilterListControl.getModel();
		return function(aData) {
			aFacetFilterListDataSet.forEach(function(oDataRow) {
				oDataRow.selected = false;
			});
			aData.forEach(function(oData) {
				var aMatchingDataRows = aFacetFilterListDataSet.filter(function(oDataRow) {
					return oDataRow.key === oData.key;
				});
				aMatchingDataRows.forEach(function(oDataRow) {
					oDataRow.selected = true;
				});
				if (!aMatchingDataRows.length) {
					aFacetFilterListDataSet.push({
						key : oData.key,
						text : oData.text,
						selected : true
					});
				}
			});
			oFacetFilterListModel.updateBindings();
		};
	},
	/**
	 * @public
	 * @function
	 * @name sap.apf.ui.reuse.controller.facetFilter#onListClose
	 * @param {oEvent} List Close Event.
	 * @description Creates a sap.apf.core.Filter with selected values and update the context path handler.
	 * */
	onListClose : function(oEvent) {
		var oClosedListControl = oEvent.getSource();
		var nIndex = this.aFacetFilterListControls.indexOf(oClosedListControl);
		var sProperty = this.aFacetFilterListData[nIndex].property;
		var bIsAllSelected = oEvent.getParameter('allSelected');
		var aSelectedItems = bIsAllSelected ? oClosedListControl.getItems() : oEvent.getParameter('selectedItems');
		var aSelectedKeys = aSelectedItems.map(function(oItem) {
			return oItem.getKey();
		});
		var oFilter = this.oCoreApi.createFilter();
		var oOrTerm = oFilter.getTopAnd().addOr();
		aSelectedKeys.forEach(function(sValue) {
			oOrTerm.addExpression({
				name : sProperty,
				operator : "EQ",
				value : sValue
			});
		});
		this.oPathContextHandler.update(sProperty, oFilter);
		this.oUiApi.selectionChanged(true);
	},
	/**
	 * @public
	 * @function
	 * @name sap.apf.ui.reuse.controller.facetFilter#onResetPress
	 * @description Reset the initial filter for all the facet filter list controls and triggers contextChanged.
	 * */
	onResetPress : function() {
		var aFilterProperties = this.aFacetFilterListData.map(function (oFacetFilterData) {
			return oFacetFilterData.property;
		});
		this.oPathContextHandler.restoreInitialContext(aFilterProperties);
		this.onContextChanged();
		this.oUiApi.selectionChanged(true);
	},
	/**
	 * @public
	 * @function
	 * @name sap.apf.ui.reuse.controller.facetFilter#onContextChanged
	 * @description Invoked by facet filter handler when context is changed.
	 * Updates the facet filter list controls with new path context handler content.
	 * */
	onContextChanged : function() {
		/*this._populateValueHelpData(); UNCOMMENT TO TRIGGER VALUE HELP REQUESTS.*/
		this._updateSelectedFilters();
	}
});
