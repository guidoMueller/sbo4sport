/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
/**
 * @class utils
 * @name utils
 * @memberOf sap.apf.ui.representations
 * @description holds utility functions used by viz representations 
 */
jQuery.sap.declare("sap.apf.ui.representations.utils.vizHelper");
/**
 * @class vizHelper
 * @name vizHelper
 * @memberOf sap.apf.ui.representations.utils
 * @description holds utility functions used by viz representations 
 */
sap.apf.ui.representations.utils.vizHelper = function(oApi, oParameters) {
	var self = this;
	this.parameter = oParameters;
	this.classifiedData = [];
	this.extendedDataSet = [];
	this.fieldKeysLookup = {};
	this.displayNameLookup = {};
	this.fieldNameLookup = {};
	this.filterLookup = {};
	this.datasetObj = {};
	this.cachedSelection = [];
	this.filterValues = [];
	this.dataAlreadySorted = false;
	/**
	 * @memberOf sap.apf.ui.representations.utils.vizHelper
	 * @method init
	 * @description Initialize hash maps, extended data response and dataset.
	 */
	this.init = function(aDataResponse, metadata, axisType) {
		this.metadata = metadata;
		this.formatter = new sap.apf.ui.representations.utils.formatter(oApi, metadata, aDataResponse);
		initFieldsKeyLookup.bind(this)(metadata, aDataResponse);
		initExtendedDataResponse.bind(this)(aDataResponse);
		initDataset.bind(this)(axisType);
		if (this.parameter.requiredFilters !== undefined && this.parameter.requiredFilters.length !== 0) {
			validateSelections();
		}
	};
	/**
	 * @memberOf sap.apf.ui.representations.utils.vizHelper
	 * @method formatMeasureValue
	 * @returns precision of amount fields
	 */
	this.validateSelectionModes = function(chartInstance) {
		var oChart = chartInstance;
		var sel = new sap.viz.ui5.types.controller.Interaction_selectability();
		var inter = new sap.viz.ui5.types.controller.Interaction();
		inter.setSelectability(sel);
		oChart.setInteraction(inter);
		if (this.parameter.requiredFilters === undefined || this.parameter.requiredFilters.length === 0) {
			sel.setMode("none");
		} else {
			sel.setMode("multiple");
			if (this.parameter.dimensions.length > 1) {
				if (this.parameter.requiredFilters[0] === this.parameter.dimensions[1].fieldName) {
					sel.setAxisLabelSelection(false);
				} else if (this.parameter.requiredFilters[0] === this.parameter.dimensions[0].fieldName) {
					sel.setLegendSelection(false);
				}
			}
		}
	};
	var validateSelections = function() {
		self.filterValues = self.filterValues.filter(function(filterTerm) {
			for( var i = 0; i < self.extendedDataResponse.length; i++) {
				var counter = 0;
				for( var j = 0; j < self.parameter.requiredFilters.length; j++) {
					if (filterTerm[j] === self.extendedDataResponse[i][self.parameter.requiredFilters[j]]) {
						counter = counter + 1;
					}
				}
				if (counter === self.parameter.requiredFilters.length) {
					return true;
				} else if (i === self.extendedDataResponse.length - 1) {
					return false;
				}
			}
		});
		self.cachedSelection = getHighlightPoints();
	};
	var initFieldsKeyLookup = function(metadata, aDataResponse) {
		var fieldObjects = this.parameter.dimensions.concat(this.parameter.measures);
		for( var i = 0; i < fieldObjects.length; i++) {
			var fieldObject = fieldObjects[i];
			var fieldName = fieldObject.fieldName;
			this.displayNameLookup[fieldName] = {};
			if (metadata !== undefined) {
				if (metadata.getPropertyMetadata(fieldName).hasOwnProperty('text')) {
					var textField = metadata.getPropertyMetadata(fieldName).text;
					var textFieldName = metadata.getPropertyMetadata(textField).label;
					this.displayNameLookup[fieldName].DISPLAY_NAME = textFieldName;
					this.displayNameLookup[fieldName].VALUE = "formatted_" + fieldName;
				} else if (metadata.getPropertyMetadata(fieldName)["aggregation-role"] === "dimension") {
					this.displayNameLookup[fieldName].DISPLAY_NAME = metadata.getPropertyMetadata(fieldName).label;
					this.displayNameLookup[fieldName].VALUE = "formatted_" + fieldName;
				} else {
					this.displayNameLookup[fieldName].DISPLAY_NAME = metadata.getPropertyMetadata(fieldName).label;
					this.displayNameLookup[fieldName].VALUE = fieldName;
				}
				if (fieldObject.fieldDesc !== undefined) {
					this.displayNameLookup[fieldName].DISPLAY_NAME = oApi.getTextNotHtmlEncoded(fieldObject.fieldDesc);
				}
				if (metadata.getPropertyMetadata(fieldName).unit !== undefined) {
					var sUnitReference = metadata.getPropertyMetadata(fieldName).unit;
					var sUnitValue;
					if (aDataResponse !== undefined && aDataResponse.length !== 0) {
						sUnitValue = aDataResponse[0][sUnitReference];
						this.displayNameLookup[fieldName].DISPLAY_NAME = this.displayNameLookup[fieldName].DISPLAY_NAME + ' (' + sUnitValue + ')';
					}
				}
			}
			this.fieldNameLookup[this.displayNameLookup[fieldName].DISPLAY_NAME] = {};
			this.fieldNameLookup[this.displayNameLookup[fieldName].DISPLAY_NAME].FIELD_NAME = fieldName;
			this.fieldNameLookup[this.displayNameLookup[fieldName].DISPLAY_NAME].VALUE = this.displayNameLookup[fieldName].VALUE;
		}
	};
	var initExtendedDataResponse = function(aDataResponse) {
		this.extendedDataResponse = jQuery.extend([], true, aDataResponse);
		var i, j, k;
		//Extend the aDataResponse
		if (this.extendedDataResponse.length !== 0) {
			for(i = 0; i < this.extendedDataResponse.length; i++) {
				for(k = 0; k < this.parameter.measures.length; k++) {
					this.extendedDataResponse[i][this.parameter.measures[k].fieldName] = parseFloat(this.extendedDataResponse[i][this.parameter.measures[k].fieldName]);
				}
				for(j = 0; j < Object.keys(this.displayNameLookup).length; j++) {
					var fieldName = Object.keys(this.displayNameLookup)[j];
					var formattedFieldExists = (this.displayNameLookup[fieldName].VALUE.search('formatted_') !== -1); // To check whether property exists or not
					if (formattedFieldExists) {
						var textExists = this.metadata.getPropertyMetadata(fieldName).hasOwnProperty('text'); // To check whether property exists or not
						if (!textExists) {
							this.extendedDataResponse[i][this.displayNameLookup[fieldName].VALUE] = this.formatter.getFormattedValue(fieldName, this.extendedDataResponse[i][fieldName]);
						} else {
							var textField = this.metadata.getPropertyMetadata(fieldName).text;
							this.extendedDataResponse[i][this.displayNameLookup[fieldName].VALUE] = this.extendedDataResponse[i][textField] + "(" + this.extendedDataResponse[i][fieldName] + ")";
						}
					}
				}
				var filterKeyText = "";
				for(j = 0; j < this.parameter.dimensions.length; j++) {
					var dimensionValueField = this.displayNameLookup[this.parameter.dimensions[j].fieldName].VALUE;
					this.extendedDataResponse[i][dimensionValueField] = this.extendedDataResponse[i][dimensionValueField].toString();
					filterKeyText = filterKeyText + this.extendedDataResponse[i][dimensionValueField];
					this.filterLookup[filterKeyText] = [];
					for(k = 0; k < this.parameter.requiredFilters.length; k++) {
						var filterValue = this.extendedDataResponse[i][this.parameter.requiredFilters[k]];
						this.filterLookup[filterKeyText].push(filterValue);
					}
				}
			}
		} else {
			var obj = {};
			for(k = 0; k < this.parameter.measures.length; k++) {
				obj[self.displayNameLookup[this.parameter.measures[k].fieldName].VALUE] = undefined;
			}
			for(j = 0; j < this.parameter.dimensions.length; j++) {
				obj[self.displayNameLookup[this.parameter.dimensions[j].fieldName].VALUE] = undefined;
			}
			this.extendedDataResponse.push(obj);
		}
	};
	var initDataset = function(axisType) {
		var obj = this.extendedDataResponse;
		var oModel = new sap.ui.model.json.JSONModel();
		oModel.setData({
			data : obj
		});
		var dimensions = [];
		var measures = [];
		var i = 0;
		for(i = 0; i < this.parameter.dimensions.length; i++) {
			dimensions[i] = {
				name : this.displayNameLookup[this.parameter.dimensions[i].fieldName].DISPLAY_NAME,
				axis : i + 1,
				value : '{' + this.displayNameLookup[this.parameter.dimensions[i].fieldName].VALUE + '}'
			};
		}
		self.measureAxisType = axisType;
		for(i = 0; i < this.parameter.measures.length; i++) {
			measures[i] = {
				name : this.displayNameLookup[this.parameter.measures[i].fieldName].DISPLAY_NAME,
				value : '{' + this.displayNameLookup[this.parameter.measures[i].fieldName].VALUE + '}'
			};
			measures[i][axisType] = i + 1;
		}
		var flattendeDataSetObj = {
			dimensions : dimensions,
			measures : measures,
			data : {
				path : "/data"
			}
		};
		if (this.metadata !== undefined) {
			for(i = 0; i < this.parameter.dimensions.length; i++) {
				var oMetaData = this.metadata.getPropertyMetadata(this.parameter.dimensions[i].fieldName);
				if (oMetaData.isCalendarYearMonth === "true") {
					if (this.parameter.dimensions.length > 1) {
						flattendeDataSetObj.data.sorter = new sap.ui.model.Sorter(this.parameter.dimensions[0].fieldName, false);
					}
				}
			}
		}
		this.datasetObj = flattendeDataSetObj;
	};
	/**
	 * @memberOf sap.apf.ui.representations.utils.vizHelper
	 * @method getDataset
	 * @description returns new flattended data set.
	 */
	this.getDataset = function() {
		return new sap.viz.ui5.data.FlattenedDataset(this.datasetObj);
	};
	/**
	 * @memberOf sap.apf.ui.representations.utils.vizHelper
	 * @method getModel
	 * @description returns json model with data set.
	 */
	this.getModel = function() {
		var obj = this.extendedDataResponse;
		var oModel = new sap.ui.model.json.JSONModel();
		oModel.setData({
			data : obj
		});
		return oModel;
	};
	/**
	 * @memberOf sap.apf.ui.representations.utils.vizHelper
	 * @method getFilterCount
	 * @description returns the number of filters.
	 */
	this.getFilterCount = function() {
		return this.filterValues.length;
	};
	/**
	 * @memberOf sap.apf.ui.representations.utils.vizHelper
	 * @method getSelectionFromFilter
	 * @description returns highlight points from currently selected filters.
	 */
	this.getSelectionFromFilter = function() {
		if (this.parameter.requiredFilters === undefined || this.parameter.requiredFilters.length === 0) {
			return [];
		}
		var highlightPoints = getHighlightPoints();
		return highlightPoints;
	};
	/**
	 * @memberOf sap.apf.ui.representations.utils.vizHelper
	 * @method getHighlightPointsFromSelectionEvent
	 * @description manage filters and returns highlight points from currently selected filters.
	 */
	this.getHighlightPointsFromSelectionEvent = function(allSelections) {
		var selections = [];
		var newSelections = [];
		selections = getExclusiveSelections(allSelections, this.cachedSelection);
		for( var i = 0; i < selections.length; i++) {
			var selObj = selections[i];
			if (this.parameter.measures.length === 1) {
				var measureDisplayName = this.displayNameLookup[this.parameter.measures[0].fieldName].DISPLAY_NAME;
				if (selObj.data[measureDisplayName] === undefined || selObj.data[measureDisplayName] === null) {
					continue; // null selection scenario encountered when a series has missing data. (StackedColumn, % StackedColumn etc.)
				}
			}
			var filterKeyText = "";
			for(var j = 0; j < this.parameter.dimensions.length; j++) {
				var dimensionDisplayName = this.displayNameLookup[this.parameter.dimensions[j].fieldName].DISPLAY_NAME;
				filterKeyText = filterKeyText + selObj.data[dimensionDisplayName];
			}
			var filterTermArray = this.filterLookup[filterKeyText];
			var resultArray = this.filterValues.filter(function(existingTerm) {
				var counter = 0;
				for( var i = 0; i < self.parameter.requiredFilters.length; i++) {
					if (existingTerm[i] === filterTermArray[i]) {
						counter = counter + 1;
					} else {
						break;
					}
				}
				if (counter === self.parameter.requiredFilters.length) {
					return true;
				} else if (i === self.parameter.requiredFilters.length) {
					return false;
				}
			});
			if (resultArray.length === 0) {
				this.filterValues.push(filterTermArray);
			}
		}
		newSelections = getHighlightPoints();
		this.cachedSelection = newSelections;
		return newSelections;
	};
	var getExclusiveSelections = function(allSelections, newSelection) {
		var exclusiveSelections = allSelections.filter(function(selObj) {
			for( var i = 0; i < newSelection.length; i++) {
				var counter = 0;
				for( var j = 0; j < Object.keys(selObj.data).length; j++) {
					if (newSelection[i].data[Object.keys(selObj.data)[j]] === selObj.data[Object.keys(selObj.data)[j]]) {
						counter = counter + 1;
					} else {
						break;
					}
				}
				if (counter === Object.keys(selObj.data).length) {
					return false;
				} else if (j === Object.keys(selObj.data).length) {
					return true;
				}
			}
			return true;
		});
		return exclusiveSelections;
	};
	/**
	 * @memberOf sap.apf.ui.representations.utils.vizHelper
	 * @method getFilterFromSelection
	 * @description returns filter objects from current selections.
	 */
	this.getFilterFromSelection = function() {
		var reqFilterValues = [];
		var i;
		for(i = 0; i < self.filterValues.length; i++) {
			reqFilterValues.push(self.filterValues[i][0]);
		}
		var oFilter = oApi.createFilter();
		var EQ = oFilter.getOperators().EQ;
		var oFilterExpression;
		var oAddedOrCondition = oFilter.getTopAnd().addOr('exprssionOr');
		for(i = 0; i < reqFilterValues.length; i++) {
			var dataType = this.metadata.getPropertyMetadata(self.parameter.requiredFilters[0]).dataType.type;
			if (dataType === "Edm.Int32") {
				reqFilterValues[i] = parseFloat(reqFilterValues[i]);
			}
			oFilterExpression = {
				id : reqFilterValues[i],
				name : self.parameter.requiredFilters[0],
				operator : EQ,
				value : reqFilterValues[i]
			};
			oAddedOrCondition.addExpression(oFilterExpression);
		}
		return oFilter;
	};
	var getHighlightPoints = function() {
		var reqFilterValues = [];
		reqFilterValues[0] = [];
		var i, j, k, l;
		for(i = 0; i < self.filterValues.length; i++) {
			reqFilterValues[0].push(self.filterValues[i][0]);
		}
		var newSelections = [];
		for(i = 0; i < self.extendedDataResponse.length; i++) {
			var dataRow = self.extendedDataResponse[i];
			for(j = 0; j < reqFilterValues[0].length; j++) {
				var counter = 0;
				for(k = 0; k < reqFilterValues.length; k++) {
					if (dataRow[self.parameter.requiredFilters[k]] === reqFilterValues[k][j]) {
						counter = counter + 1;
					}
				}
				if (counter === reqFilterValues.length) {
					var newSelObject = {
						data : {}
					};
					var displayFieldName;
					var valueFieldName;
					for(k = 0; k < self.getDataset().getDimensions().length; k++) {
						var dimensionDisplayFieldName = self.getDataset().getDimensions()[k].getName();
						var dimensionValueFieldName = self.fieldNameLookup[dimensionDisplayFieldName].VALUE;
						newSelObject.data[dimensionDisplayFieldName] = dataRow[dimensionValueFieldName];
					}
					if (self.measureAxisType !== "group") {
						var measureDisplayFieldName;
						var measureValueFieldName;
						for(l = 0; l < self.getDataset().getMeasures().length; l++) {
							var newSelObjClone = jQuery.extend(true, {}, newSelObject);
							measureDisplayFieldName = self.getDataset().getMeasures()[l].getName();
							measureValueFieldName = self.fieldNameLookup[measureDisplayFieldName].VALUE;
							newSelObjClone.data[measureDisplayFieldName] = parseFloat(dataRow[measureValueFieldName]);
							newSelections.push(newSelObjClone);
						}
					} else {
						for(k = 0; k < self.getDataset().getMeasures().length; k++) {
							displayFieldName = self.getDataset().getMeasures()[k].getName();
							valueFieldName = self.fieldNameLookup[displayFieldName].VALUE;
							newSelObject.data[displayFieldName] = parseFloat(dataRow[valueFieldName]);
						}
						newSelections.push(newSelObject);
					}
				}
			}
		}
		return newSelections;
	};
	/**
	 * @memberOf sap.apf.ui.representations.utils.vizHelper
	 * @method getHighlightPointsFromDeselectionEvent
	 * @description manage filters and returns highlight points from current selection.
	 */
	this.getHighlightPointsFromDeselectionEvent = function(currentSelection) {
		var i, j;
		var deselectedObjs = getExclusiveSelections(this.cachedSelection, currentSelection);
		for(i = 0; i < deselectedObjs.length; i++) {
			var deselObj = deselectedObjs[i];
			var filterKeyText = "";
			for(j = 0; j < this.parameter.dimensions.length; j++) {
				var dimensionDisplayName = this.displayNameLookup[this.parameter.dimensions[j].fieldName].DISPLAY_NAME;
				filterKeyText = filterKeyText + deselObj.data[dimensionDisplayName];
			}
			var filterTermArray = this.filterLookup[filterKeyText];
			this.filterValues = this.filterValues.filter(function(currentFilter, index) {
				var counter = 0;
				for( var i = 0; i < filterTermArray.length; i++) {
					if (filterTermArray[i] === currentFilter[i]) {
						counter = counter + 1;
					}
				}
				if (counter === filterTermArray.length) {
					return false;
				} else {
					return true;
				}
			});
		}
		var newSelections = getHighlightPoints();
		this.cachedSelection = newSelections;
		return newSelections;
	};
};