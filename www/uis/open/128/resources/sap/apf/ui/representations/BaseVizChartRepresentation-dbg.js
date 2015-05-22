/*!
* SAP APF Analysis Path Framework
* 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
*/
jQuery.sap.require('sap.apf.ui.representations.utils.vizHelper');
jQuery.sap.require('sap.apf.ui.representations.utils.formatter');
jQuery.sap.declare("sap.apf.ui.representations.BaseVizChartRepresentation");
/** 
 * @class representation base class constructor. 
 * @param oParameters defines parameters required for chart such as Dimension/Measures, tooltip, axis information.
* @returns chart object 
 */
sap.apf.ui.representations.BaseVizChartRepresentation = function(oApi, oParameters) {
	this.oMessageObject = "";
	this.legendBoolean = true;
	this.aDataResponse = undefined;
	this.dataset = {};
	this.oModel = new sap.ui.model.json.JSONModel();
	this.bDataHasBeenSelected = false;
	this.parameter = oParameters;
	this.sort = oParameters.sort;
	this.dimension = oParameters.dimensions;
	this.measure = oParameters.measures;
	this.alternateRepresentation = oParameters.alternateRepresentationType;
	this.requiredFilters = oParameters.requiredFilters;
	this.vizHelper = new sap.apf.ui.representations.utils.vizHelper(oApi, oParameters);
	this.chartInstance = {};
	this.chartParam = "";
	this.thumbnailChartParam = "";
	this.disableSelectEvent = false;
	this.oApi = oApi;
	var self = this;
	this.showXaxisLabel = true;
	this.axisType = "axis";
};
sap.apf.ui.representations.BaseVizChartRepresentation.prototype = {
	/**
	* @method getParameter
	* @description returns the constructor arguments which will be used to create toggle representation.
	*/
	getParameter : function() {
		return this.parameter;
	},
	/**
	* @method setData
	* @param aDataResponse  Response from oData service
	* @param metadata Metadata of the oData service
	* @description Fetches the data from oData service and updates the selection if present 
	 * Handles data with multiple dimensions .
	*/
	setData : function(aDataResponse, metadata) {
		this.vizHelper.init(aDataResponse, metadata, this.axisType);
		this.formatter = new sap.apf.ui.representations.utils.formatter(this.oApi, metadata, aDataResponse);
		this.aDataResponse = aDataResponse || [];
		this.metadata = metadata;
		if (!this.metadata) {
			this.oMessageObject = this.oApi.createMessageObject({
				code : "6004",
				aParameters : [ this.oApi.getTextNotHtmlEncoded("step") ]
			});
			this.oApi.putMessage(this.oMessageObject);
		}
	},
	/**
	* @method getAlternateRepresentation
	* @description returns the alternate representation of current step (i.e. list representation for the charts)  
	 */
	getAlternateRepresentation : function() {
		return this.alternateRepresentation;
	},
	/**
	* @description returns meta data for representation type
	*/
	getMetaData : function() {
		return this.metadata;
	},
	/**
	* @description returns data for representation type
	*/
	getData : function() {
		return this.aDataResponse;
	},
	/**
	* @method getRequestOptions
	* @description provide optional filter properties for odata request URL such as pagging, sorting etc             
	 */
	getRequestOptions : function() {
		if (this.sort) {
			return {
				orderby : [ {
					property : this.sort.sortField,
					descending : this.sort.descending
				} ]
			};
		} else
			return {};
	},
	/**
	* @method createDataset
	* @description Intantiates the dataset to be consumed by the chart 
	 */
	createDataset : function() {
		this.dataset = this.vizHelper.getDataset();
		this.oModel = this.vizHelper.getModel();
	},
	/**
	* @method getMainContent
	* @param oStepTitle title of the main chart
	* @param width width of the main chart
	* @param height height of the main chart
	* @description draws Main chart into the Chart area
	*/
	getMainContent : function(oStepTitle, width, height) {
		var self = this;
		if (!oStepTitle) {
			this.oMessageObject = this.oApi.createMessageObject({
				code : "6002",
				aParameters : [ "title", this.oApi.getTextNotHtmlEncoded("step") ]
			});
			this.oApi.putMessage(this.oMessageObject);
		}
		if (this.dimension.length === 0) {
			this.oMessageObject = this.oApi.createMessageObject({
				code : "6002",
				aParameters : [ "dimensions", oStepTitle ]
			});
			this.oApi.putMessage(this.oMessageObject);
		}
		if (this.measure.length === 0) {
			this.oMessageObject = this.oApi.createMessageObject({
				code : "6002",
				aParameters : [ "measures", oStepTitle ]
			});
			this.oApi.putMessage(this.oMessageObject);
		}
		if (!this.aDataResponse || this.aDataResponse.length === 0) {
			this.oMessageObject = this.oApi.createMessageObject({
				code : "6000",
				aParameters : [ oStepTitle ]
			});
			this.oApi.putMessage(this.oMessageObject);
		}
		var chartHeight = height || 600;
		chartHeight = chartHeight + "px";
		var chartWidth = width || 1000;
		chartWidth = chartWidth + "px";
		self.title = oStepTitle;
		self.createDataset();
		self.chartParam = {
			width : chartWidth,
			title : {
				visible : true,
				text : self.title
			},
			xAxis : {
				title : {
					visible : true
				},
				label : {
					visible : self.showXaxisLabel
				}
			},
			yAxis : {
				title : {
					visible : true
				}
			},
			legend : {
				visible : self.legendBoolean,
				title : {
					visible : self.legendBoolean
				}
			},
			plotArea : {
				animation : {
					dataLoading : false,
					dataUpdating : false
				}
			},
			dataset : self.dataset
		};
		self.chart = new sap.viz.ui5[self.chartType](self.chartParam);
		self.setFormatString(self.measure);
		/**
		* @method attachInitialized
		* @param event which is triggered on when the chart is initialized
		* @description Draws the selection
		*/
		self.chart.attachInitialized(function() {
			self.drawSelection();
		});
		/**
		* @method attachSelectData
		* @param event which is triggered on selection of data on chart 
		 * @description Adding selection to the chart based on the selected indices provided
		*/
		self.chart.attachSelectData(function(e) {
			self.handleSelection(e);
		});
		/**
		* @method attachDeselectData
		* @param event handler on deselect of data
		* @description For deselect of data from the chart on user event
		*/
		self.chart.attachDeselectData(function(e) {
			self.handleDeselection(e);
		});
		self.chart.setModel(self.oModel);
		self.vizHelper.validateSelectionModes(self.chart);
		self.chartInstance = self.chart;
		return self.chart;
	},
	/**
	* @method setFormatString
	* @param measure
	* @description sets the format string for axis label and tooltip
	*/
	setFormatString : function(measures) {
		var formatString = [];
		var tooltipFormatString = [];
		var labelFormatString = [];
		var bAllMeasuresSameUnit = true;
		var i = 0;
		var self = this;
		if (measures.length === 1) { // for single measure formatting (if any) will be applied to Y-axis.
			formatString = this.formatter.getFormatString(measures[0]);
			if (formatString !== undefined) {
				if (this.chart.getYAxis !== undefined && formatString.label !== undefined) {
					this.chart.getYAxis().getLabel().setFormatString(formatString.label);
				}
				if (this.chart.getToolTip !== undefined && formatString.tooltip !== undefined) {
					this.chart.getToolTip().setFormatString([ [ formatString.tooltip ] ]);
				}
			}
		} else { // for multiple measures formatting will be applied to Y-axis only whne all the mesauers have same semantic for their units .
			var firstMeasureUnitSemantic = self.metadata.getPropertyMetadata(measures[0].fieldName).unit ? self.metadata.getPropertyMetadata(self.metadata.getPropertyMetadata(measures[0].fieldName).unit).semantics : undefined;
			var measureUnitSemantic;
			measures.forEach(function(measure, index) {
				measureUnitSemantic = self.metadata.getPropertyMetadata(measures[0].fieldName).unit ? self.metadata.getPropertyMetadata(self.metadata.getPropertyMetadata(measure.fieldName).unit).semantics : undefined;
				if (bAllMeasuresSameUnit && firstMeasureUnitSemantic !== undefined && measureUnitSemantic && (firstMeasureUnitSemantic !== measureUnitSemantic)) {
					bAllMeasuresSameUnit = false;  // bAllMeasuresSameUnit boolean is used to find out if there are measures with different unit semantics
				}
				formatString[index] = self.formatter.getFormatString(measure); // get the format object which has label and tooltip format strings
				if (formatString[index].label !== undefined && formatString[index].tooltip !== undefined) {
					tooltipFormatString.push([ formatString[index].tooltip ]);  
					labelFormatString.push(formatString[index].label);
				}
			});
			if (bAllMeasuresSameUnit) {  // all measures has the unit with same semantics 
				if (formatString.length !== 0 && this.chart.getYAxis !== undefined && labelFormatString.length !== 0) {
					this.chart.getYAxis().getLabel().setFormatString(labelFormatString[0]);
				}
			}
			if (formatString.length !== 0 && this.chart.getToolTip !== undefined && tooltipFormatString.length !== 0) {
				this.chart.getToolTip().setFormatString(tooltipFormatString); // tooltip always shows the formatted values for all the measures
			}
		}
	},
	/**
	* @method drawSelection
	* @param 
	 * @description Draws the selection on main chart when chart is loaded
	*/
	drawSelection : function() {
		var aSelections = this.vizHelper.getSelectionFromFilter(this.filter);
		if (aSelections.length > 0) {
			this.disableSelectEvent = true;
			this.chart.selection(aSelections);
		}
	},
	/**
	* @method drawThumbnailSelection
	* @param 
	 * @description Draws the selection on the thumbnail chart  when chart is loaded
	*/
	drawThumbnailSelection : function() {
		var self = this;
		var aSelections = this.vizHelper.getSelectionFromFilter(this.filter);
		if (aSelections.length > 0) {
			self.thumbnailChart.selection([], {
				clearSelection : true
			});
			self.thumbnailChart.selection(aSelections);
		}
	},
	/**
	* @method handleSelection
	* @param event
	* @description  plots the selections made on the chart
	*/
	handleSelection : function(evt) {
		var self = this;
		if (!self.disableSelectEvent) {
			var ctxArray = self.vizHelper.getHighlightPointsFromSelectionEvent(self.chart.selection());
			self.chart.selection(ctxArray);
			self.thumbnailChart.selection(ctxArray);
			self.bDataHasBeenSelected = true;
			self.oApi.selectionChanged();
		} else {
			self.disableSelectEvent = false;
		}
	},
	/**
	* @method handleDeselection
	* @param event
	* @description  de-selects the selected datapoints on the chart
	*/
	handleDeselection : function(evt) {
		var self = this;
		if (!self.disableSelectEvent) {
			self.disableSelectEvent = true;
			var newSelection = self.vizHelper.getHighlightPointsFromDeselectionEvent(self.chart.selection());
			self.chart.selection([], {
				clearSelection : true
			});
			self.thumbnailChart.selection([], {
				clearSelection : true
			});
			self.chart.selection(newSelection);
			self.thumbnailChart.selection(newSelection);
			if (!newSelection.length) {
				self.disableSelectEvent = false;
			}
			self.bDataHasBeenSelected = true;
			self.oApi.selectionChanged();
		} else {
			self.disableSelectEvent = false;
		}
	},
	/**
	* @method getSelectionCount
	* @description This method helps in determining the selection count of a representation
	* @returns the selection count of the current representation.
	*/
	getSelectionCount : function() {
		return this.vizHelper.getFilterCount();
	},
	/**
	* @method hasSelection
	* @description This method helps in determining the selections of a representation
	* @returns true if the representation holds any selections.
	*/
	hasSelection : function() {
		return this.bDataHasBeenSelected;
	},
	/**
	* @method removeAllSelection
	* @description removes all Selection from Chart
	*/
	removeAllSelection : function() {
		this.chart.selection([], {
			clearSelection : true
		});
		this.thumbnailChart.selection([], {
			clearSelection : true
		});
	},
	/**
	* @method getFilterMethodType
	* @description This method helps in determining which method has to be used for the filter retrieval from a representation.
	* @returns {sap.apf.constants.filterMethodTypes} The filter method type the representation supports
	*/
	getFilterMethodType : function() {
		return sap.apf.core.constants.filterMethodTypes.filter; // returns the filter method type the representation supports
	},
	getFilter : function() {
		this.filter = this.vizHelper.getFilterFromSelection();
		return this.filter;
	},
	/**
	* @method setFilter
	* @param {sap.apf.utils.Filter} oFilter
	* @description sets the initial filter to the representation. The filter holds the values of the start filter of the path.
	*/
	setFilter : function(oFilter) {
		this.filter = oFilter;
		this.bDataHasBeenSelected = false;
	},
	/**
	* @method adoptSelection
	* @param {object} oSourceRepresentation Source representation implementing the representationInterface.
	* @description Called on representation by binding when a representation type is set.
	*/
	adoptSelection : function(oSourceRepresentation) {
		if (oSourceRepresentation && oSourceRepresentation.getFilter) {
			this.vizHelper.filterValues = oSourceRepresentation.getFilter().getInternalFilter().getFilterTerms().map(function(term) {
				return [ term.getValue() ];
			});
		}
	},
	/**
	*@method getThumbnailContent 
	 *@description draws Thumbnail for the current chart type and returns to the calling object
	*@returns thumbnail object for the chart type
	*/
	getThumbnailContent : function() {
		var self = this;
		var height = sap.apf.ui.utils.CONSTANTS.thumbnailDimensions.HEIGHT;
		var width = sap.apf.ui.utils.CONSTANTS.thumbnailDimensions.WIDTH;
		self.createDataset();
		self.thumbnailChartParam = {
			width : width,
			height : height,
			title : {
				visible : false
			},
			xAxis : {
				visible : false,
				title : {
					visible : false
				}
			},
			yAxis : {
				visible : false,
				title : {
					visible : false
				}
			},
			legend : {
				visible : false,
				title : {
					visible : false
				}
			},
			sizeLegend : {
				visible : false,
				title : {
					visible : false
				}
			},
			toolTip : {
				visible : false
			},
			interaction : {
				selectability : {
					axisLabelSelection : false,
					legendSelection : false,
					plotLassoSelection : false,
					plotStdSelection : false
				},
				enableHover : false
			},
			background : {
				visible : false
			},
			general : {
				layout : {
					padding : 0
				}
			},
			plotArea : {
				animation : {
					dataLoading : false,
					dataUpdating : false
				}
			},
			dataset : self.dataset
		};
		self.thumbnailChart = new sap.viz.ui5[self.chartType](self.thumbnailChartParam);
		self.thumbnailChart.attachInitialized(function() {
			self.drawThumbnailSelection();
		});
		self.thumbnailLayout = new sap.ui.layout.HorizontalLayout().addStyleClass('thumbnailLayout');
		if (this.aDataResponse !== undefined && this.aDataResponse.length !== 0) {
			self.thumbnailChart.setModel(self.oModel);
			self.thumbnailLayout.removeAllContent();
			self.thumbnailLayout.addContent(self.thumbnailChart);
		} else {
			var noDataText = new sap.m.Text({
				text : self.oApi.getTextNotHtmlEncoded("noDataText")
			}).addStyleClass('noDataText');
			self.thumbnailLayout.removeAllContent();
			self.thumbnailLayout.addContent(noDataText);
		}
		return self.thumbnailLayout;
	},
	/**
	* @method serialize
	* @description Getter for Serialized data for a representation
	* @returns selectionObject
	*/
	serialize : function() {
		return {
			oFilter : this.vizHelper.filterValues,
			bIsAlternateView : this.bIsAlternateView
		};
	},
	/**
	* @method deserialize
	* @description This method uses selection object from serialized data and sets the selection to representation
	*/
	deserialize : function(oSerializable) {
		this.vizHelper.filterValues = oSerializable.oFilter;
		this.bIsAlternateView = oSerializable.bIsAlternateView;
	},
	/**
	* @method getPrintContent
	* @param oStepTitle title of the step
	* @description gets the printable content of the representation
	*/
	getPrintContent : function(oStepTitle) {
		var oChart;
		oChart = this.getMainContent(oStepTitle, 1000, 600);
		oChart.getPlotArea().getAnimation().setDataLoading(false);
		oChart.getPlotArea().getAnimation().setDataUpdating(false);
		return oChart;
	}
};