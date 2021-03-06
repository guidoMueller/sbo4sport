/*!
 * SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2013 SAP AG. All rights reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.control, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides control sap.suite.ui.commons.ColumnMicroChart.
jQuery.sap.declare("sap.suite.ui.commons.ColumnMicroChart");
jQuery.sap.require("sap.suite.ui.commons.library");
jQuery.sap.require("sap.ui.core.Control");


/**
 * Constructor for a new ColumnMicroChart.
 * 
 * Accepts an object literal <code>mSettings</code> that defines initial 
 * property values, aggregated and associated objects as well as event handlers. 
 * 
 * If the name of a setting is ambiguous (e.g. a property has the same name as an event), 
 * then the framework assumes property, aggregation, association, event in that order. 
 * To override this automatic resolution, one of the prefixes "aggregation:", "association:" 
 * or "event:" can be added to the name of the setting (such a prefixed name must be
 * enclosed in single or double quotes).
 *
 * The supported settings are:
 * <ul>
 * <li>Properties
 * <ul>
 * <li>{@link #getSize size} : sap.suite.ui.commons.InfoTileSize (default: sap.suite.ui.commons.InfoTileSize.Auto)</li>
 * <li>{@link #getWidth width} : sap.ui.core.CSSSize</li>
 * <li>{@link #getHeight height} : sap.ui.core.CSSSize</li></ul>
 * </li>
 * <li>Aggregations
 * <ul>
 * <li>{@link #getColumns columns} : sap.suite.ui.commons.ColumnData[]</li></ul>
 * </li>
 * <li>Associations
 * <ul></ul>
 * </li>
 * <li>Events
 * <ul>
 * <li>{@link sap.suite.ui.commons.ColumnMicroChart#event:press press} : fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction, oListenerObject]</li></ul>
 * </li>
 * </ul> 

 *
 * @param {string} [sId] id for the new control, generated automatically if no id is given 
 * @param {object} [mSettings] initial settings for the new control
 *
 * @class
 * This control shows a column chart.
 * @extends sap.ui.core.Control
 * @version 1.24.3
 *
 * @constructor
 * @public
 * @name sap.suite.ui.commons.ColumnMicroChart
 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
 */
sap.ui.core.Control.extend("sap.suite.ui.commons.ColumnMicroChart", { metadata : {

	library : "sap.suite.ui.commons",
	properties : {
		"size" : {type : "sap.suite.ui.commons.InfoTileSize", group : "Misc", defaultValue : sap.suite.ui.commons.InfoTileSize.Auto},
		"width" : {type : "sap.ui.core.CSSSize", group : "Misc", defaultValue : null},
		"height" : {type : "sap.ui.core.CSSSize", group : "Misc", defaultValue : null}
	},
	aggregations : {
		"columns" : {type : "sap.suite.ui.commons.ColumnData", multiple : true, singularName : "column"}
	},
	events : {
		"press" : {}
	}
}});


/**
 * Creates a new subclass of class sap.suite.ui.commons.ColumnMicroChart with name <code>sClassName</code> 
 * and enriches it with the information contained in <code>oClassInfo</code>.
 * 
 * <code>oClassInfo</code> might contain the same kind of informations as described in {@link sap.ui.core.Element.extend Element.extend}.
 *   
 * @param {string} sClassName name of the class to be created
 * @param {object} [oClassInfo] object literal with informations about the class  
 * @param {function} [FNMetaImpl] constructor function for the metadata object. If not given, it defaults to sap.ui.core.ElementMetadata.
 * @return {function} the created class / constructor function
 * @public
 * @static
 * @name sap.suite.ui.commons.ColumnMicroChart.extend
 * @function
 */

sap.suite.ui.commons.ColumnMicroChart.M_EVENTS = {'press':'press'};


/**
 * Getter for property <code>size</code>.
 * Updates the size of the chart. If not set then the default size is applied based on the device tile.
 *
 * Default value is <code>Auto</code>
 *
 * @return {sap.suite.ui.commons.InfoTileSize} the value of property <code>size</code>
 * @public
 * @name sap.suite.ui.commons.ColumnMicroChart#getSize
 * @function
 */

/**
 * Setter for property <code>size</code>.
 *
 * Default value is <code>Auto</code> 
 *
 * @param {sap.suite.ui.commons.InfoTileSize} oSize  new value for property <code>size</code>
 * @return {sap.suite.ui.commons.ColumnMicroChart} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.ColumnMicroChart#setSize
 * @function
 */


/**
 * Getter for property <code>width</code>.
 * The width of the chart. If it is not set, the width of the control is defined by the size property.
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {sap.ui.core.CSSSize} the value of property <code>width</code>
 * @public
 * @name sap.suite.ui.commons.ColumnMicroChart#getWidth
 * @function
 */

/**
 * Setter for property <code>width</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {sap.ui.core.CSSSize} sWidth  new value for property <code>width</code>
 * @return {sap.suite.ui.commons.ColumnMicroChart} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.ColumnMicroChart#setWidth
 * @function
 */


/**
 * Getter for property <code>height</code>.
 * The height of the chart. If it is not set, the height of the control is defined by the size property.
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {sap.ui.core.CSSSize} the value of property <code>height</code>
 * @public
 * @name sap.suite.ui.commons.ColumnMicroChart#getHeight
 * @function
 */

/**
 * Setter for property <code>height</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {sap.ui.core.CSSSize} sHeight  new value for property <code>height</code>
 * @return {sap.suite.ui.commons.ColumnMicroChart} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.ColumnMicroChart#setHeight
 * @function
 */


/**
 * Getter for aggregation <code>columns</code>.<br/>
 * The column chart data.
 * 
 * @return {sap.suite.ui.commons.ColumnData[]}
 * @public
 * @name sap.suite.ui.commons.ColumnMicroChart#getColumns
 * @function
 */


/**
 * Inserts a column into the aggregation named <code>columns</code>.
 *
 * @param {sap.suite.ui.commons.ColumnData}
 *          oColumn the column to insert; if empty, nothing is inserted
 * @param {int}
 *             iIndex the <code>0</code>-based index the column should be inserted at; for 
 *             a negative value of <code>iIndex</code>, the column is inserted at position 0; for a value 
 *             greater than the current size of the aggregation, the column is inserted at 
 *             the last position        
 * @return {sap.suite.ui.commons.ColumnMicroChart} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.ColumnMicroChart#insertColumn
 * @function
 */

/**
 * Adds some column <code>oColumn</code> 
 * to the aggregation named <code>columns</code>.
 *
 * @param {sap.suite.ui.commons.ColumnData}
 *            oColumn the column to add; if empty, nothing is inserted
 * @return {sap.suite.ui.commons.ColumnMicroChart} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.ColumnMicroChart#addColumn
 * @function
 */

/**
 * Removes an column from the aggregation named <code>columns</code>.
 *
 * @param {int | string | sap.suite.ui.commons.ColumnData} vColumn the column to remove or its index or id
 * @return {sap.suite.ui.commons.ColumnData} the removed column or null
 * @public
 * @name sap.suite.ui.commons.ColumnMicroChart#removeColumn
 * @function
 */

/**
 * Removes all the controls in the aggregation named <code>columns</code>.<br/>
 * Additionally unregisters them from the hosting UIArea.
 * @return {sap.suite.ui.commons.ColumnData[]} an array of the removed elements (might be empty)
 * @public
 * @name sap.suite.ui.commons.ColumnMicroChart#removeAllColumns
 * @function
 */

/**
 * Checks for the provided <code>sap.suite.ui.commons.ColumnData</code> in the aggregation named <code>columns</code> 
 * and returns its index if found or -1 otherwise.
 *
 * @param {sap.suite.ui.commons.ColumnData}
 *            oColumn the column whose index is looked for.
 * @return {int} the index of the provided control in the aggregation if found, or -1 otherwise
 * @public
 * @name sap.suite.ui.commons.ColumnMicroChart#indexOfColumn
 * @function
 */
	

/**
 * Destroys all the columns in the aggregation 
 * named <code>columns</code>.
 * @return {sap.suite.ui.commons.ColumnMicroChart} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.ColumnMicroChart#destroyColumns
 * @function
 */


/**
 * The event is fired when the user chooses the column chart.
 *
 * @name sap.suite.ui.commons.ColumnMicroChart#press
 * @event
 * @param {sap.ui.base.Event} oControlEvent
 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
 * @param {object} oControlEvent.getParameters
 * @public
 */
 
/**
 * Attach event handler <code>fnFunction</code> to the 'press' event of this <code>sap.suite.ui.commons.ColumnMicroChart</code>.<br/>.
 * When called, the context of the event handler (its <code>this</code>) will be bound to <code>oListener<code> if specified
 * otherwise to this <code>sap.suite.ui.commons.ColumnMicroChart</code>.<br/> itself. 
 *  
 * The event is fired when the user chooses the column chart.
 *
 * @param {object}
 *            [oData] An application specific payload object, that will be passed to the event handler along with the event object when firing the event.
 * @param {function}
 *            fnFunction The function to call, when the event occurs.  
 * @param {object}
 *            [oListener] Context object to call the event handler with. Defaults to this <code>sap.suite.ui.commons.ColumnMicroChart</code>.<br/> itself.
 *
 * @return {sap.suite.ui.commons.ColumnMicroChart} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.ColumnMicroChart#attachPress
 * @function
 */

/**
 * Detach event handler <code>fnFunction</code> from the 'press' event of this <code>sap.suite.ui.commons.ColumnMicroChart</code>.<br/>
 *
 * The passed function and listener object must match the ones used for event registration.
 *
 * @param {function}
 *            fnFunction The function to call, when the event occurs.
 * @param {object}
 *            oListener Context object on which the given function had to be called.
 * @return {sap.suite.ui.commons.ColumnMicroChart} <code>this</code> to allow method chaining
 * @public
 * @name sap.suite.ui.commons.ColumnMicroChart#detachPress
 * @function
 */

/**
 * Fire event press to attached listeners.
 *
 * @param {Map} [mArguments] the arguments to pass along with the event.
 * @return {sap.suite.ui.commons.ColumnMicroChart} <code>this</code> to allow method chaining
 * @protected
 * @name sap.suite.ui.commons.ColumnMicroChart#firePress
 * @function
 */


// Start of sap/suite/ui/commons/ColumnMicroChart.js
///**
// * This file defines behavior for the control,
// */
sap.suite.ui.commons.ColumnMicroChart.prototype.init = function(){
	this._oRb = sap.ui.getCore().getLibraryResourceBundle("sap.suite.ui.commons");
};

sap.suite.ui.commons.ColumnMicroChart.prototype.onAfterRendering = function() {
	if (this._sChartResizeHandlerId) {
		sap.ui.core.ResizeHandler.deregister(this._sChartResizeHandlerId);
	}
	
    this._sChartResizeHandlerId = sap.ui.core.ResizeHandler.register(jQuery.sap.domById(this.getId()),  jQuery.proxy(this._calcColumns, this));
	this._fChartWidth = undefined;
	this._fChartHeight = undefined;
	this._aBars = [];
	
	var iColumnsNum = this.getColumns().length;
	for (var i = 0; i < iColumnsNum; i++) {
		this._aBars.push({});
	}
	
	this._calcColumns();
};

sap.suite.ui.commons.ColumnMicroChart.prototype.exit = function() {
	sap.ui.core.ResizeHandler.deregister(this._sChartResizeHandlerId);
};

sap.suite.ui.commons.ColumnMicroChart.prototype._calcColumns = function() {
	var iColumnsNum = this.getColumns().length;
	if (iColumnsNum) {
		var fChartWidth = parseFloat(this.$().css("width"));
		if (fChartWidth != this._fChartWidth) {
			this._fChartWidth = fChartWidth;
			
			var iColumnMargin = 0;
			var oBar;
			if (iColumnsNum > 1) {
				oBar = jQuery.sap.byId(this.getId() + "-bar-1");
				var bRtl = sap.ui.getCore().getConfiguration().getRTL();
				iColumnMargin = parseInt(oBar.css("margin-" + (bRtl ? "right" : "left")));
			} else {
				oBar = jQuery.sap.byId(this.getId() + "-bar-0");
			}
		
			var iColumMinWidth = parseInt(oBar.css("min-width"));
					
			this._calcColumnsWidth(iColumnMargin, iColumMinWidth, fChartWidth, this._aBars);
		}
		
		var fChartHeight = parseFloat(this.$().css("height"));
		if (fChartHeight != this._fChartHeight) {
			this._fChartHeight = fChartHeight;
			this._calcColumnsHeight(fChartHeight, this._aBars);
		}
		
		for (var i = 0; i < iColumnsNum; i++) {
			jQuery.sap.byId(this.getId() + "-bar-" + i).css(this._aBars[i]);
		}
		
		if (this._aBars.overflow) {
			jQuery.sap.log.warning(this.toString() + " Chart overflow",  "Some columns were not rendered");
		}
	}
};

sap.suite.ui.commons.ColumnMicroChart.prototype._calcColumnsWidth = function(iColumnMargin, iColumMinWidth, fChartWidth, aBars) {
	var iColumnsNum = this.getColumns().length;
	var iVisibleColumnsNum = Math.floor((fChartWidth + iColumnMargin) / (iColumMinWidth + iColumnMargin));
	var iColumnWidth = Math.floor((fChartWidth + iColumnMargin) / Math.min(iVisibleColumnsNum, iColumnsNum)) - iColumnMargin;
	
	var sColumnWidth = iColumnWidth + "px";
	
	for (var i = 0; i < iColumnsNum; i++) {
		if (i < iVisibleColumnsNum) {
			aBars[i].width = sColumnWidth;
			aBars[i].display = "inline-block";
		} else {
			aBars[i].display = "none";
		}
	}
	
	aBars.overflow = iVisibleColumnsNum != iColumnsNum;
};

sap.suite.ui.commons.ColumnMicroChart.prototype._calcColumnsHeight = function(fChartHeight, aBars) {
	var iClmnsNum = this.getColumns().length;
	
	var fMaxVal, fMinVal;
	fMaxVal = fMinVal = 0;
	
	for (var i = 0; i < iClmnsNum; i++) {
		var oClmn = this.getColumns()[i];
		if (fMaxVal < oClmn.getValue()) {
			fMaxVal = oClmn.getValue();
		} else if (fMinVal > oClmn.getValue()) {
			fMinVal = oClmn.getValue();
		}
	}
	
	var fDelta = fMaxVal - fMinVal;
	var fOnePxVal = fDelta / fChartHeight;
	
	var fDownShift, fTopShift;
	fDownShift = fTopShift = 0;
	
	for (i = 0; i < iClmnsNum; i++) {
		var fValue = this.getColumns()[i].getValue();
		
		if (Math.abs(fValue) < fOnePxVal) {
			if (fValue >= 0) {
				if (fValue == fMaxVal) {
					fTopShift = fOnePxVal - fValue;
				}
			} else {
				if (fValue == fMinVal) {
					fDownShift = fOnePxVal + fValue;
				}
			}
		}
	}
	
	if (fTopShift) {
		fMaxVal += fTopShift;
		fMinVal -= fTopShift;
	}
	
	if (fDownShift) {
		fMaxVal -= fDownShift;
		fMinVal += fDownShift;
	}
	
	var fNegativeOnePxVal =  0 - fOnePxVal;

	for (i = 0; i < iClmnsNum; i++) {
		var fValue = this.getColumns()[i].getValue();
		var fCalcVal = fValue;
		
		if (fValue >= 0) {
			fCalcVal = Math.max(fCalcVal + fTopShift - fDownShift, fOnePxVal);
		} else {
			fCalcVal = Math.min(fCalcVal + fTopShift - fDownShift, fNegativeOnePxVal);
		}
		
		aBars[i].value = fCalcVal;
	}
	
	function calcPersent(fValue) {
		return (fValue / fDelta * 100).toFixed(2) + "%";
	};
	
	var fZeroLine = calcPersent(fMaxVal);
	
	for (i = 0; i < iClmnsNum; i++) {
		var fValue = aBars[i].value;
		aBars[i].top = (fValue < 0) ? fZeroLine : calcPersent(fMaxVal - fValue);
		aBars[i].height = calcPersent(Math.abs(fValue));
	}
};

sap.suite.ui.commons.ColumnMicroChart.prototype.attachEvent = function(sEventId, oData, fnFunction, oListener) {
	sap.ui.core.Control.prototype.attachEvent.call(this, sEventId, oData, fnFunction, oListener);
	if (this.hasListeners("press")) {
		this.$().attr("tabindex", 0).attr("role", "button").addClass("sapSuiteUiCommonsPointer");
	}
	return this;
};

sap.suite.ui.commons.ColumnMicroChart.prototype.detachEvent = function(sEventId, fnFunction, oListener) {
	sap.ui.core.Control.prototype.detachEvent.call(this, sEventId, fnFunction, oListener);
	if (!this.hasListeners("press")) {
		this.$().removeAttr("tabindex").attr("role", "img").removeClass("sapSuiteUiCommonsPointer");
	}
	return this;
};

 sap.suite.ui.commons.ColumnMicroChart.prototype.ontap = function(oEvent) {
     if (sap.ui.Device.browser.internet_explorer) {
         this.$().focus();
     }
     this.firePress();
};

sap.suite.ui.commons.ColumnMicroChart.prototype.onkeydown = function(oEvent) {
    if (oEvent.which == jQuery.sap.KeyCodes.ENTER || oEvent.which == jQuery.sap.KeyCodes.SPACE) {
        this.firePress();
        oEvent.preventDefault();
    }
};

sap.suite.ui.commons.ColumnMicroChart.prototype.getLocalizedColorMeaning = function(sColor) {
	return this._oRb.getText(("SEMANTIC_COLOR_"+sColor).toUpperCase());
};

sap.suite.ui.commons.ColumnMicroChart.prototype.getAltText = function() {
	var sAltText = "";
	var aColumns = this.getColumns();
	for (var i = 0; i < aColumns.length; i++) {
		var oBar = aColumns[i];
		var sMeaning = this.getLocalizedColorMeaning(oBar.getColor());
		sAltText += ((i==0) ? "" : "\n") + oBar.getLabel() + " " + oBar.getValue() + " " + sMeaning;
	}

	return sAltText;
};

sap.suite.ui.commons.ColumnMicroChart.prototype.getTooltip_AsString  = function() {
	var oTooltip = this.getTooltip();
	var sTooltip = this.getAltText();
	
	if(typeof oTooltip === "string" || oTooltip instanceof String) {
		if(oTooltip.indexOf("{AltText}") != -1) {
			sTooltip = oTooltip.split("{AltText}").join(sTooltip);
		} else {
			sTooltip = oTooltip;
		}
	}
	return sTooltip;
};