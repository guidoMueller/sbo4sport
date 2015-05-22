/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2014 SAP SE. All rights reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.control, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides control sap.viz.ui5.VizContainer.
jQuery.sap.declare("sap.viz.ui5.VizContainer");
jQuery.sap.require("sap.viz.library");
jQuery.sap.require("sap.viz.ui5.controls.common.BaseControl");


/**
 * Constructor for a new ui5/VizContainer.
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
 * <li>{@link #getVizType vizType} : string</li>
 * <li>{@link #getVizCss vizCss} : string</li>
 * <li>{@link #getVizProperties vizProperties} : object</li>
 * <li>{@link #getEnableMorphing enableMorphing} : boolean</li></ul>
 * </li>
 * <li>Aggregations
 * <ul>
 * <li>{@link #getVizData vizData} : sap.viz.ui5.data.Dataset</li>
 * <li>{@link #getAnalysisObjectsForPicker analysisObjectsForPicker} : sap.viz.ui5.controls.common.feeds.AnalysisObject[]</li>
 * <li>{@link #getFeeds feeds} : sap.viz.ui5.controls.common.feeds.FeedItem[]</li></ul>
 * </li>
 * <li>Associations
 * <ul></ul>
 * </li>
 * <li>Events
 * <ul>
 * <li>{@link sap.viz.ui5.VizContainer#event:feedsChanged feedsChanged} : fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction, oListenerObject]</li>
 * <li>{@link sap.viz.ui5.VizContainer#event:vizTypeChanged vizTypeChanged} : fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction, oListenerObject]</li>
 * <li>{@link sap.viz.ui5.VizContainer#event:vizDefinitionChanged vizDefinitionChanged} : fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction, oListenerObject]</li>
 * <li>{@link sap.viz.ui5.VizContainer#event:selectData selectData} : fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction, oListenerObject]</li>
 * <li>{@link sap.viz.ui5.VizContainer#event:deselectData deselectData} : fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction, oListenerObject]</li>
 * <li>{@link sap.viz.ui5.VizContainer#event:showTooltip showTooltip} : fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction, oListenerObject]</li>
 * <li>{@link sap.viz.ui5.VizContainer#event:hideTooltip hideTooltip} : fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction, oListenerObject]</li>
 * <li>{@link sap.viz.ui5.VizContainer#event:initialized initialized} : fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction, oListenerObject]</li></ul>
 * </li>
 * </ul> 
 *
 * 
 * In addition, all settings applicable to the base type {@link sap.viz.ui5.controls.common.BaseControl#constructor sap.viz.ui5.controls.common.BaseControl}
 * can be used as well.
 *
 * @param {string} [sId] id for the new control, generated automatically if no id is given 
 * @param {object} [mSettings] initial settings for the new control
 *
 * @class
 * Controls ui5/VizContainer
 * @extends sap.viz.ui5.controls.common.BaseControl
 * @version 1.24.4
 *
 * @constructor
 * @public
 * @since 1.19.0
 * @experimental Since version 1.19.0. 
 * API is not finished yet and might change completely
 * @name sap.viz.ui5.VizContainer
 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
 */
sap.viz.ui5.controls.common.BaseControl.extend("sap.viz.ui5.VizContainer", { metadata : {

	publicMethods : [
		// methods
		"vizUpdate", "vizSelection"
	],
	library : "sap.viz",
	properties : {
		"vizType" : {type : "string", group : "Misc", defaultValue : null},
		"vizCss" : {type : "string", group : "Misc", defaultValue : null},
		"vizProperties" : {type : "object", group : "Misc", defaultValue : null},
		"enableMorphing" : {type : "boolean", group : "Misc", defaultValue : null}
	},
	aggregations : {
		"vizData" : {type : "sap.viz.ui5.data.Dataset", multiple : false}, 
		"analysisObjectsForPicker" : {type : "sap.viz.ui5.controls.common.feeds.AnalysisObject", multiple : true, singularName : "analysisObjectsForPicker"}, 
		"feeds" : {type : "sap.viz.ui5.controls.common.feeds.FeedItem", multiple : true, singularName : "feed"}
	},
	events : {
		"feedsChanged" : {}, 
		"vizTypeChanged" : {}, 
		"vizDefinitionChanged" : {}, 
		"selectData" : {}, 
		"deselectData" : {}, 
		"showTooltip" : {}, 
		"hideTooltip" : {}, 
		"initialized" : {}
	}
}});


/**
 * Creates a new subclass of class sap.viz.ui5.VizContainer with name <code>sClassName</code> 
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
 * @name sap.viz.ui5.VizContainer.extend
 * @function
 */

sap.viz.ui5.VizContainer.M_EVENTS = {'feedsChanged':'feedsChanged','vizTypeChanged':'vizTypeChanged','vizDefinitionChanged':'vizDefinitionChanged','selectData':'selectData','deselectData':'deselectData','showTooltip':'showTooltip','hideTooltip':'hideTooltip','initialized':'initialized'};


/**
 * Getter for property <code>vizType</code>.
 * Type for visualization.
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>vizType</code>
 * @public
 * @name sap.viz.ui5.VizContainer#getVizType
 * @function
 */

/**
 * Setter for property <code>vizType</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sVizType  new value for property <code>vizType</code>
 * @return {sap.viz.ui5.VizContainer} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.VizContainer#setVizType
 * @function
 */


/**
 * Getter for property <code>vizCss</code>.
 * Css for visualization.
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>vizCss</code>
 * @public
 * @name sap.viz.ui5.VizContainer#getVizCss
 * @function
 */

/**
 * Setter for property <code>vizCss</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sVizCss  new value for property <code>vizCss</code>
 * @return {sap.viz.ui5.VizContainer} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.VizContainer#setVizCss
 * @function
 */


/**
 * Getter for property <code>vizProperties</code>.
 * Properties for visualization.
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {object} the value of property <code>vizProperties</code>
 * @public
 * @name sap.viz.ui5.VizContainer#getVizProperties
 * @function
 */

/**
 * Setter for property <code>vizProperties</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {object} oVizProperties  new value for property <code>vizProperties</code>
 * @return {sap.viz.ui5.VizContainer} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.VizContainer#setVizProperties
 * @function
 */


/**
 * Getter for property <code>enableMorphing</code>.
 * Enable morphing for visualization.
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {boolean} the value of property <code>enableMorphing</code>
 * @public
 * @name sap.viz.ui5.VizContainer#getEnableMorphing
 * @function
 */

/**
 * Setter for property <code>enableMorphing</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {boolean} bEnableMorphing  new value for property <code>enableMorphing</code>
 * @return {sap.viz.ui5.VizContainer} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.VizContainer#setEnableMorphing
 * @function
 */


/**
 * Getter for aggregation <code>vizData</code>.<br/>
 * Dataset for chart.
 * 
 * @return {sap.viz.ui5.data.Dataset}
 * @public
 * @name sap.viz.ui5.VizContainer#getVizData
 * @function
 */


/**
 * Setter for the aggregated <code>vizData</code>.
 * @param {sap.viz.ui5.data.Dataset} oVizData
 * @return {sap.viz.ui5.VizContainer} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.VizContainer#setVizData
 * @function
 */
	

/**
 * Destroys the vizData in the aggregation 
 * named <code>vizData</code>.
 * @return {sap.viz.ui5.VizContainer} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.VizContainer#destroyVizData
 * @function
 */


/**
 * Getter for aggregation <code>analysisObjectsForPicker</code>.<br/>
 * Available sap.viz.ui5.controls.common.feeds.AnalysisObject for object picker popup UI
 * 
 * @return {sap.viz.ui5.controls.common.feeds.AnalysisObject[]}
 * @public
 * @name sap.viz.ui5.VizContainer#getAnalysisObjectsForPicker
 * @function
 */


/**
 * Inserts a analysisObjectsForPicker into the aggregation named <code>analysisObjectsForPicker</code>.
 *
 * @param {sap.viz.ui5.controls.common.feeds.AnalysisObject}
 *          oAnalysisObjectsForPicker the analysisObjectsForPicker to insert; if empty, nothing is inserted
 * @param {int}
 *             iIndex the <code>0</code>-based index the analysisObjectsForPicker should be inserted at; for 
 *             a negative value of <code>iIndex</code>, the analysisObjectsForPicker is inserted at position 0; for a value 
 *             greater than the current size of the aggregation, the analysisObjectsForPicker is inserted at 
 *             the last position        
 * @return {sap.viz.ui5.VizContainer} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.VizContainer#insertAnalysisObjectsForPicker
 * @function
 */

/**
 * Adds some analysisObjectsForPicker <code>oAnalysisObjectsForPicker</code> 
 * to the aggregation named <code>analysisObjectsForPicker</code>.
 *
 * @param {sap.viz.ui5.controls.common.feeds.AnalysisObject}
 *            oAnalysisObjectsForPicker the analysisObjectsForPicker to add; if empty, nothing is inserted
 * @return {sap.viz.ui5.VizContainer} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.VizContainer#addAnalysisObjectsForPicker
 * @function
 */

/**
 * Removes an analysisObjectsForPicker from the aggregation named <code>analysisObjectsForPicker</code>.
 *
 * @param {int | string | sap.viz.ui5.controls.common.feeds.AnalysisObject} vAnalysisObjectsForPicker the analysisObjectsForPicker to remove or its index or id
 * @return {sap.viz.ui5.controls.common.feeds.AnalysisObject} the removed analysisObjectsForPicker or null
 * @public
 * @name sap.viz.ui5.VizContainer#removeAnalysisObjectsForPicker
 * @function
 */

/**
 * Removes all the controls in the aggregation named <code>analysisObjectsForPicker</code>.<br/>
 * Additionally unregisters them from the hosting UIArea.
 * @return {sap.viz.ui5.controls.common.feeds.AnalysisObject[]} an array of the removed elements (might be empty)
 * @public
 * @name sap.viz.ui5.VizContainer#removeAllAnalysisObjectsForPicker
 * @function
 */

/**
 * Checks for the provided <code>sap.viz.ui5.controls.common.feeds.AnalysisObject</code> in the aggregation named <code>analysisObjectsForPicker</code> 
 * and returns its index if found or -1 otherwise.
 *
 * @param {sap.viz.ui5.controls.common.feeds.AnalysisObject}
 *            oAnalysisObjectsForPicker the analysisObjectsForPicker whose index is looked for.
 * @return {int} the index of the provided control in the aggregation if found, or -1 otherwise
 * @public
 * @name sap.viz.ui5.VizContainer#indexOfAnalysisObjectsForPicker
 * @function
 */
	

/**
 * Destroys all the analysisObjectsForPicker in the aggregation 
 * named <code>analysisObjectsForPicker</code>.
 * @return {sap.viz.ui5.VizContainer} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.VizContainer#destroyAnalysisObjectsForPicker
 * @function
 */


/**
 * Getter for aggregation <code>feeds</code>.<br/>
 * All feeds for chart.
 * 
 * @return {sap.viz.ui5.controls.common.feeds.FeedItem[]}
 * @public
 * @name sap.viz.ui5.VizContainer#getFeeds
 * @function
 */


/**
 * Inserts a feed into the aggregation named <code>feeds</code>.
 *
 * @param {sap.viz.ui5.controls.common.feeds.FeedItem}
 *          oFeed the feed to insert; if empty, nothing is inserted
 * @param {int}
 *             iIndex the <code>0</code>-based index the feed should be inserted at; for 
 *             a negative value of <code>iIndex</code>, the feed is inserted at position 0; for a value 
 *             greater than the current size of the aggregation, the feed is inserted at 
 *             the last position        
 * @return {sap.viz.ui5.VizContainer} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.VizContainer#insertFeed
 * @function
 */

/**
 * Adds some feed <code>oFeed</code> 
 * to the aggregation named <code>feeds</code>.
 *
 * @param {sap.viz.ui5.controls.common.feeds.FeedItem}
 *            oFeed the feed to add; if empty, nothing is inserted
 * @return {sap.viz.ui5.VizContainer} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.VizContainer#addFeed
 * @function
 */

/**
 * Removes an feed from the aggregation named <code>feeds</code>.
 *
 * @param {int | string | sap.viz.ui5.controls.common.feeds.FeedItem} vFeed the feed to remove or its index or id
 * @return {sap.viz.ui5.controls.common.feeds.FeedItem} the removed feed or null
 * @public
 * @name sap.viz.ui5.VizContainer#removeFeed
 * @function
 */

/**
 * Removes all the controls in the aggregation named <code>feeds</code>.<br/>
 * Additionally unregisters them from the hosting UIArea.
 * @return {sap.viz.ui5.controls.common.feeds.FeedItem[]} an array of the removed elements (might be empty)
 * @public
 * @name sap.viz.ui5.VizContainer#removeAllFeeds
 * @function
 */

/**
 * Checks for the provided <code>sap.viz.ui5.controls.common.feeds.FeedItem</code> in the aggregation named <code>feeds</code> 
 * and returns its index if found or -1 otherwise.
 *
 * @param {sap.viz.ui5.controls.common.feeds.FeedItem}
 *            oFeed the feed whose index is looked for.
 * @return {int} the index of the provided control in the aggregation if found, or -1 otherwise
 * @public
 * @name sap.viz.ui5.VizContainer#indexOfFeed
 * @function
 */
	

/**
 * Destroys all the feeds in the aggregation 
 * named <code>feeds</code>.
 * @return {sap.viz.ui5.VizContainer} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.VizContainer#destroyFeeds
 * @function
 */


/**
 * Dispatches "feedsChanged" event when the feeding changes due to add/remove/change feeding items on feeding panel, drag and drop object onto VizFrame, or switch chart type by UI operation.
 * Application should listen to "feedsChanged" event to get the corresponding data and set it back to VizFrame to to update the visualization with the new data.
 *
 * @name sap.viz.ui5.VizContainer#feedsChanged
 * @event
 * @param {sap.ui.base.Event} oControlEvent
 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
 * @param {object} oControlEvent.getParameters
 * @param {sap.viz.ui5.controls.common.feeds.FeedItem[]} oControlEvent.getParameters.feeds An array of changed feeds.
 * @public
 */
 
/**
 * Attach event handler <code>fnFunction</code> to the 'feedsChanged' event of this <code>sap.viz.ui5.VizContainer</code>.<br/>.
 * When called, the context of the event handler (its <code>this</code>) will be bound to <code>oListener<code> if specified
 * otherwise to this <code>sap.viz.ui5.VizContainer</code>.<br/> itself. 
 *  
 * Dispatches "feedsChanged" event when the feeding changes due to add/remove/change feeding items on feeding panel, drag and drop object onto VizFrame, or switch chart type by UI operation.
 * Application should listen to "feedsChanged" event to get the corresponding data and set it back to VizFrame to to update the visualization with the new data.
 *
 * @param {object}
 *            [oData] An application specific payload object, that will be passed to the event handler along with the event object when firing the event.
 * @param {function}
 *            fnFunction The function to call, when the event occurs.  
 * @param {object}
 *            [oListener] Context object to call the event handler with. Defaults to this <code>sap.viz.ui5.VizContainer</code>.<br/> itself.
 *
 * @return {sap.viz.ui5.VizContainer} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.VizContainer#attachFeedsChanged
 * @function
 */

/**
 * Detach event handler <code>fnFunction</code> from the 'feedsChanged' event of this <code>sap.viz.ui5.VizContainer</code>.<br/>
 *
 * The passed function and listener object must match the ones used for event registration.
 *
 * @param {function}
 *            fnFunction The function to call, when the event occurs.
 * @param {object}
 *            oListener Context object on which the given function had to be called.
 * @return {sap.viz.ui5.VizContainer} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.VizContainer#detachFeedsChanged
 * @function
 */

/**
 * Fire event feedsChanged to attached listeners.
 * 
 * Expects following event parameters:
 * <ul>
 * <li>'feeds' of type <code>sap.viz.ui5.controls.common.feeds.FeedItem[]</code> An array of changed feeds.</li>
 * </ul>
 *
 * @param {Map} [mArguments] the arguments to pass along with the event.
 * @return {sap.viz.ui5.VizContainer} <code>this</code> to allow method chaining
 * @protected
 * @name sap.viz.ui5.VizContainer#fireFeedsChanged
 * @function
 */


/**
 * Dispatches "vizTypeChanged" event when viz type was changed
 *
 * @name sap.viz.ui5.VizContainer#vizTypeChanged
 * @event
 * @param {sap.ui.base.Event} oControlEvent
 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
 * @param {object} oControlEvent.getParameters
 * @public
 */
 
/**
 * Attach event handler <code>fnFunction</code> to the 'vizTypeChanged' event of this <code>sap.viz.ui5.VizContainer</code>.<br/>.
 * When called, the context of the event handler (its <code>this</code>) will be bound to <code>oListener<code> if specified
 * otherwise to this <code>sap.viz.ui5.VizContainer</code>.<br/> itself. 
 *  
 * Dispatches "vizTypeChanged" event when viz type was changed
 *
 * @param {object}
 *            [oData] An application specific payload object, that will be passed to the event handler along with the event object when firing the event.
 * @param {function}
 *            fnFunction The function to call, when the event occurs.  
 * @param {object}
 *            [oListener] Context object to call the event handler with. Defaults to this <code>sap.viz.ui5.VizContainer</code>.<br/> itself.
 *
 * @return {sap.viz.ui5.VizContainer} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.VizContainer#attachVizTypeChanged
 * @function
 */

/**
 * Detach event handler <code>fnFunction</code> from the 'vizTypeChanged' event of this <code>sap.viz.ui5.VizContainer</code>.<br/>
 *
 * The passed function and listener object must match the ones used for event registration.
 *
 * @param {function}
 *            fnFunction The function to call, when the event occurs.
 * @param {object}
 *            oListener Context object on which the given function had to be called.
 * @return {sap.viz.ui5.VizContainer} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.VizContainer#detachVizTypeChanged
 * @function
 */

/**
 * Fire event vizTypeChanged to attached listeners.
 *
 * @param {Map} [mArguments] the arguments to pass along with the event.
 * @return {sap.viz.ui5.VizContainer} <code>this</code> to allow method chaining
 * @protected
 * @name sap.viz.ui5.VizContainer#fireVizTypeChanged
 * @function
 */


/**
 * Dispatches "vizDefinitionChanged" event when viz definition was changed.
 *
 * @name sap.viz.ui5.VizContainer#vizDefinitionChanged
 * @event
 * @param {sap.ui.base.Event} oControlEvent
 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
 * @param {object} oControlEvent.getParameters
 * @public
 */
 
/**
 * Attach event handler <code>fnFunction</code> to the 'vizDefinitionChanged' event of this <code>sap.viz.ui5.VizContainer</code>.<br/>.
 * When called, the context of the event handler (its <code>this</code>) will be bound to <code>oListener<code> if specified
 * otherwise to this <code>sap.viz.ui5.VizContainer</code>.<br/> itself. 
 *  
 * Dispatches "vizDefinitionChanged" event when viz definition was changed.
 *
 * @param {object}
 *            [oData] An application specific payload object, that will be passed to the event handler along with the event object when firing the event.
 * @param {function}
 *            fnFunction The function to call, when the event occurs.  
 * @param {object}
 *            [oListener] Context object to call the event handler with. Defaults to this <code>sap.viz.ui5.VizContainer</code>.<br/> itself.
 *
 * @return {sap.viz.ui5.VizContainer} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.VizContainer#attachVizDefinitionChanged
 * @function
 */

/**
 * Detach event handler <code>fnFunction</code> from the 'vizDefinitionChanged' event of this <code>sap.viz.ui5.VizContainer</code>.<br/>
 *
 * The passed function and listener object must match the ones used for event registration.
 *
 * @param {function}
 *            fnFunction The function to call, when the event occurs.
 * @param {object}
 *            oListener Context object on which the given function had to be called.
 * @return {sap.viz.ui5.VizContainer} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.VizContainer#detachVizDefinitionChanged
 * @function
 */

/**
 * Fire event vizDefinitionChanged to attached listeners.
 *
 * @param {Map} [mArguments] the arguments to pass along with the event.
 * @return {sap.viz.ui5.VizContainer} <code>this</code> to allow method chaining
 * @protected
 * @name sap.viz.ui5.VizContainer#fireVizDefinitionChanged
 * @function
 */


/**
 * Event fires when certain data point(s) is(are) selected, data context of selected item(s) would be passed in accordance with the following format.<code>{name: "selectData",data:[{
 * //selected element's detail
 * target:"Dom Element",//an object pointed to corresponding dom element
 * data:[{val: "...",//value of this element
 * ctx:{type:"Dimension"||"Measure"||"MND",
 * //for Dimension
 * path:{aa:"...",di:"...",dii:"..."},
 * //for Measure
 * path:{mg:"...",mi:"...",dii_a1:"...",dii_a2:"..."},
 * //for MND
 * path:{mg:"...",mi:"..."}
 * //path: analysis path
 * //aa: analysis axis index // 0 for analysis axis 1, 1 for analysis 2
 * //di: dimension index //zero based
 * //dii: dimension item index //zero based
 * //mg: measure group index // 0 for measure group 1,1 for measure group 2
 * //mi: measure index // measure index in measure group zero based
 * //dii_a1: each dii of di in analysis axis 1 index
 * //dii_a2: each dii of di in analysis axis 2 index
 * }},{
 * //for bubble, tagcloud and scatter, there will be more than one values in one selected element.
 * var:"...",ctx:"..."}]},{
 * //if under multi selection, there will be more than one selected elements
 * target:"...",data:["..."]}]}
 *
 * @name sap.viz.ui5.VizContainer#selectData
 * @event
 * @param {sap.ui.base.Event} oControlEvent
 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
 * @param {object} oControlEvent.getParameters
 * @public
 */
 
/**
 * Attach event handler <code>fnFunction</code> to the 'selectData' event of this <code>sap.viz.ui5.VizContainer</code>.<br/>.
 * When called, the context of the event handler (its <code>this</code>) will be bound to <code>oListener<code> if specified
 * otherwise to this <code>sap.viz.ui5.VizContainer</code>.<br/> itself. 
 *  
 * Event fires when certain data point(s) is(are) selected, data context of selected item(s) would be passed in accordance with the following format.<code>{name: "selectData",data:[{
 * //selected element's detail
 * target:"Dom Element",//an object pointed to corresponding dom element
 * data:[{val: "...",//value of this element
 * ctx:{type:"Dimension"||"Measure"||"MND",
 * //for Dimension
 * path:{aa:"...",di:"...",dii:"..."},
 * //for Measure
 * path:{mg:"...",mi:"...",dii_a1:"...",dii_a2:"..."},
 * //for MND
 * path:{mg:"...",mi:"..."}
 * //path: analysis path
 * //aa: analysis axis index // 0 for analysis axis 1, 1 for analysis 2
 * //di: dimension index //zero based
 * //dii: dimension item index //zero based
 * //mg: measure group index // 0 for measure group 1,1 for measure group 2
 * //mi: measure index // measure index in measure group zero based
 * //dii_a1: each dii of di in analysis axis 1 index
 * //dii_a2: each dii of di in analysis axis 2 index
 * }},{
 * //for bubble, tagcloud and scatter, there will be more than one values in one selected element.
 * var:"...",ctx:"..."}]},{
 * //if under multi selection, there will be more than one selected elements
 * target:"...",data:["..."]}]}
 *
 * @param {object}
 *            [oData] An application specific payload object, that will be passed to the event handler along with the event object when firing the event.
 * @param {function}
 *            fnFunction The function to call, when the event occurs.  
 * @param {object}
 *            [oListener] Context object to call the event handler with. Defaults to this <code>sap.viz.ui5.VizContainer</code>.<br/> itself.
 *
 * @return {sap.viz.ui5.VizContainer} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.VizContainer#attachSelectData
 * @function
 */

/**
 * Detach event handler <code>fnFunction</code> from the 'selectData' event of this <code>sap.viz.ui5.VizContainer</code>.<br/>
 *
 * The passed function and listener object must match the ones used for event registration.
 *
 * @param {function}
 *            fnFunction The function to call, when the event occurs.
 * @param {object}
 *            oListener Context object on which the given function had to be called.
 * @return {sap.viz.ui5.VizContainer} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.VizContainer#detachSelectData
 * @function
 */

/**
 * Fire event selectData to attached listeners.
 *
 * @param {Map} [mArguments] the arguments to pass along with the event.
 * @return {sap.viz.ui5.VizContainer} <code>this</code> to allow method chaining
 * @protected
 * @name sap.viz.ui5.VizContainer#fireSelectData
 * @function
 */


/**
 * Event fires when certain data point(s) is(are) deselected, data context of deselected item(s) would be passed in accordance with the following format.<code>{name: "deselectData",data:["---the same as selectedData---"]}
 *
 * @name sap.viz.ui5.VizContainer#deselectData
 * @event
 * @param {sap.ui.base.Event} oControlEvent
 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
 * @param {object} oControlEvent.getParameters
 * @public
 */
 
/**
 * Attach event handler <code>fnFunction</code> to the 'deselectData' event of this <code>sap.viz.ui5.VizContainer</code>.<br/>.
 * When called, the context of the event handler (its <code>this</code>) will be bound to <code>oListener<code> if specified
 * otherwise to this <code>sap.viz.ui5.VizContainer</code>.<br/> itself. 
 *  
 * Event fires when certain data point(s) is(are) deselected, data context of deselected item(s) would be passed in accordance with the following format.<code>{name: "deselectData",data:["---the same as selectedData---"]}
 *
 * @param {object}
 *            [oData] An application specific payload object, that will be passed to the event handler along with the event object when firing the event.
 * @param {function}
 *            fnFunction The function to call, when the event occurs.  
 * @param {object}
 *            [oListener] Context object to call the event handler with. Defaults to this <code>sap.viz.ui5.VizContainer</code>.<br/> itself.
 *
 * @return {sap.viz.ui5.VizContainer} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.VizContainer#attachDeselectData
 * @function
 */

/**
 * Detach event handler <code>fnFunction</code> from the 'deselectData' event of this <code>sap.viz.ui5.VizContainer</code>.<br/>
 *
 * The passed function and listener object must match the ones used for event registration.
 *
 * @param {function}
 *            fnFunction The function to call, when the event occurs.
 * @param {object}
 *            oListener Context object on which the given function had to be called.
 * @return {sap.viz.ui5.VizContainer} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.VizContainer#detachDeselectData
 * @function
 */

/**
 * Fire event deselectData to attached listeners.
 *
 * @param {Map} [mArguments] the arguments to pass along with the event.
 * @return {sap.viz.ui5.VizContainer} <code>this</code> to allow method chaining
 * @protected
 * @name sap.viz.ui5.VizContainer#fireDeselectData
 * @function
 */


/**
 * Event fires when the mouse hover onto the specific part of chart, data context of tooltip would be passed in accordance with the following format.<code>{name:"showTooltip",data:{body:[{
 * //data of one group
 * name:"...",val:[{
 * //data of one row
 * color:"...",label:"...",shape:"...",value:"..."},"..."]},"..."],footer:[{label:"...",value:"..."},"..."],plotArea:{
 * //this object specifies the plot area of the chart
 * height:"...",width:"...",x:"...",y:"..."},point:{
 * //this object specifies a point which affects the position of tooltip
 * x:"...",y:"..."}}}
 *
 * @name sap.viz.ui5.VizContainer#showTooltip
 * @event
 * @param {sap.ui.base.Event} oControlEvent
 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
 * @param {object} oControlEvent.getParameters
 * @public
 */
 
/**
 * Attach event handler <code>fnFunction</code> to the 'showTooltip' event of this <code>sap.viz.ui5.VizContainer</code>.<br/>.
 * When called, the context of the event handler (its <code>this</code>) will be bound to <code>oListener<code> if specified
 * otherwise to this <code>sap.viz.ui5.VizContainer</code>.<br/> itself. 
 *  
 * Event fires when the mouse hover onto the specific part of chart, data context of tooltip would be passed in accordance with the following format.<code>{name:"showTooltip",data:{body:[{
 * //data of one group
 * name:"...",val:[{
 * //data of one row
 * color:"...",label:"...",shape:"...",value:"..."},"..."]},"..."],footer:[{label:"...",value:"..."},"..."],plotArea:{
 * //this object specifies the plot area of the chart
 * height:"...",width:"...",x:"...",y:"..."},point:{
 * //this object specifies a point which affects the position of tooltip
 * x:"...",y:"..."}}}
 *
 * @param {object}
 *            [oData] An application specific payload object, that will be passed to the event handler along with the event object when firing the event.
 * @param {function}
 *            fnFunction The function to call, when the event occurs.  
 * @param {object}
 *            [oListener] Context object to call the event handler with. Defaults to this <code>sap.viz.ui5.VizContainer</code>.<br/> itself.
 *
 * @return {sap.viz.ui5.VizContainer} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.VizContainer#attachShowTooltip
 * @function
 */

/**
 * Detach event handler <code>fnFunction</code> from the 'showTooltip' event of this <code>sap.viz.ui5.VizContainer</code>.<br/>
 *
 * The passed function and listener object must match the ones used for event registration.
 *
 * @param {function}
 *            fnFunction The function to call, when the event occurs.
 * @param {object}
 *            oListener Context object on which the given function had to be called.
 * @return {sap.viz.ui5.VizContainer} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.VizContainer#detachShowTooltip
 * @function
 */

/**
 * Fire event showTooltip to attached listeners.
 *
 * @param {Map} [mArguments] the arguments to pass along with the event.
 * @return {sap.viz.ui5.VizContainer} <code>this</code> to allow method chaining
 * @protected
 * @name sap.viz.ui5.VizContainer#fireShowTooltip
 * @function
 */


/**
 * Event fires when the mouse hover out of the specific part of chart, no data is passed.
 *
 * @name sap.viz.ui5.VizContainer#hideTooltip
 * @event
 * @param {sap.ui.base.Event} oControlEvent
 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
 * @param {object} oControlEvent.getParameters
 * @public
 */
 
/**
 * Attach event handler <code>fnFunction</code> to the 'hideTooltip' event of this <code>sap.viz.ui5.VizContainer</code>.<br/>.
 * When called, the context of the event handler (its <code>this</code>) will be bound to <code>oListener<code> if specified
 * otherwise to this <code>sap.viz.ui5.VizContainer</code>.<br/> itself. 
 *  
 * Event fires when the mouse hover out of the specific part of chart, no data is passed.
 *
 * @param {object}
 *            [oData] An application specific payload object, that will be passed to the event handler along with the event object when firing the event.
 * @param {function}
 *            fnFunction The function to call, when the event occurs.  
 * @param {object}
 *            [oListener] Context object to call the event handler with. Defaults to this <code>sap.viz.ui5.VizContainer</code>.<br/> itself.
 *
 * @return {sap.viz.ui5.VizContainer} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.VizContainer#attachHideTooltip
 * @function
 */

/**
 * Detach event handler <code>fnFunction</code> from the 'hideTooltip' event of this <code>sap.viz.ui5.VizContainer</code>.<br/>
 *
 * The passed function and listener object must match the ones used for event registration.
 *
 * @param {function}
 *            fnFunction The function to call, when the event occurs.
 * @param {object}
 *            oListener Context object on which the given function had to be called.
 * @return {sap.viz.ui5.VizContainer} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.VizContainer#detachHideTooltip
 * @function
 */

/**
 * Fire event hideTooltip to attached listeners.
 *
 * @param {Map} [mArguments] the arguments to pass along with the event.
 * @return {sap.viz.ui5.VizContainer} <code>this</code> to allow method chaining
 * @protected
 * @name sap.viz.ui5.VizContainer#fireHideTooltip
 * @function
 */


/**
 * Event fires when the loading ends. To use the event listener when creating charts, you must use an event that is passed by the events option. For more information on events options, see the usrOptions section of the <a href="sap.viz.core.html#createViz" target="_blank">createViz</a> function in the API document.
 *
 * @name sap.viz.ui5.VizContainer#initialized
 * @event
 * @param {sap.ui.base.Event} oControlEvent
 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
 * @param {object} oControlEvent.getParameters
 * @public
 */
 
/**
 * Attach event handler <code>fnFunction</code> to the 'initialized' event of this <code>sap.viz.ui5.VizContainer</code>.<br/>.
 * When called, the context of the event handler (its <code>this</code>) will be bound to <code>oListener<code> if specified
 * otherwise to this <code>sap.viz.ui5.VizContainer</code>.<br/> itself. 
 *  
 * Event fires when the loading ends. To use the event listener when creating charts, you must use an event that is passed by the events option. For more information on events options, see the usrOptions section of the <a href="sap.viz.core.html#createViz" target="_blank">createViz</a> function in the API document.
 *
 * @param {object}
 *            [oData] An application specific payload object, that will be passed to the event handler along with the event object when firing the event.
 * @param {function}
 *            fnFunction The function to call, when the event occurs.  
 * @param {object}
 *            [oListener] Context object to call the event handler with. Defaults to this <code>sap.viz.ui5.VizContainer</code>.<br/> itself.
 *
 * @return {sap.viz.ui5.VizContainer} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.VizContainer#attachInitialized
 * @function
 */

/**
 * Detach event handler <code>fnFunction</code> from the 'initialized' event of this <code>sap.viz.ui5.VizContainer</code>.<br/>
 *
 * The passed function and listener object must match the ones used for event registration.
 *
 * @param {function}
 *            fnFunction The function to call, when the event occurs.
 * @param {object}
 *            oListener Context object on which the given function had to be called.
 * @return {sap.viz.ui5.VizContainer} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.VizContainer#detachInitialized
 * @function
 */

/**
 * Fire event initialized to attached listeners.
 *
 * @param {Map} [mArguments] the arguments to pass along with the event.
 * @return {sap.viz.ui5.VizContainer} <code>this</code> to allow method chaining
 * @protected
 * @name sap.viz.ui5.VizContainer#fireInitialized
 * @function
 */


/**
 * Update VizContainer according to a JSON object, it can update css, properties, feeds and data model.
 *
 * @name sap.viz.ui5.VizContainer#vizUpdate
 * @function
 * @param {object} oOJson
 *         A JSON object contains combination of css, properties, feeds and data model.
 * @type void
 * @public
 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
 */


/**
 * Selections for the chart instance of the VizContainer.
 *
 * @name sap.viz.ui5.VizContainer#vizSelection
 * @function
 * @param {object[]} aAPoints
 *         Some data points of the chart
 * @param {object} oOAction
 *         A flag 'clearSelection', whether to clear previous selection, by default the selection will be incremental selection
 * @type object
 * @public
 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
 */


// Start of sap/viz/ui5/VizContainer.js
jQuery.sap.require("sap.viz.ui5.controls.libs.sap-viz-controls-vizcontainer");
jQuery.sap.require("sap.viz.ui5.controls.common.feeds.AnalysisObject");
jQuery.sap.require("sap.viz.ui5.controls.common.feeds.FeedItem");
jQuery.sap.require("sap.viz.ui5.controls.common.helpers.VizControlsHelper");

sap.viz.ui5.VizContainer.prototype.init = function() {
	sap.viz.ui5.controls.common.BaseControl.prototype.init.apply(this,
			arguments);

	this._uiConfig = {
		'layout' : 'horizontal',
		'enableMorphing' : true
	};

	this._vizFrame = null;
	this._vizBuilder = null;
	this._switchBar = null;

	this._vSplitter$ = null;

	this._clearVariables();
};

sap.viz.ui5.VizContainer.prototype.exit = function() {
	sap.viz.ui5.controls.common.BaseControl.prototype.exit.apply(this,
			arguments);

	this._clearVariables();

	this.setVizData(null);
};

sap.viz.ui5.VizContainer.prototype._clearVariables = function() {
	this._vizFrame$ = null;
	this._vizBuilder$ = null;
	this._switchBar$ = null;

	this._clearRequestedProperties();
};
sap.viz.ui5.VizContainer.prototype._clearRequestedProperties = function() {
	this._requestedVizType = 'viz/column';
	this._requestedVizCss = null;
	this._requestedVizProperties = null;

	this._requestedOptions = null;
};

sap.viz.ui5.VizContainer.prototype._mergeConfig = function(oUiConfig) {
	oUiConfig = oUiConfig || {};
	if (oUiConfig.layout === 'vertical' || oUiConfig.layout === 'horizontal') {
		this._uiConfig.layout = oUiConfig.layout;
	}
	this._uiConfig.enableMorphing = oUiConfig.enableMorphing !== false;
};

sap.viz.ui5.VizContainer.prototype.getFeeds = function() {
	var feeds = [];
	if (this._vizFrame && this._vizFrame.feeds()) {
		feeds = sap.viz.ui5.controls.common.feeds.FeedItem
				.toFeeds(this._vizFrame.feeds());
	} else {
		feeds = this.getAggregation('feeds');
	}
	return feeds;
};

sap.viz.ui5.VizContainer.prototype.getVizType = function() {
	if (this._vizFrame) {
		return this._vizFrame.vizType();
	} else {
		return this._requestedVizType;
	}
};
/**
 * Setter for property vizType. A string of supported viz type: viz/column,
 * viz/stacked_column, viz/dual_column, viz/line, viz/area, viz/combination,
 * viz/dual_line, viz/dual_combination, viz/pie, viz/donut, viz/scatter,
 * viz/bubble, viz/heatmap, viz/treemap.
 * 
 * @param {string}
 *            sVizType
 * @returns {sap.viz.ui5.VizContainer}
 * @public
 * @function sap.viz.ui5.VizContainer.prototype.setVizType
 */
sap.viz.ui5.VizContainer.prototype.setVizType = function(sVizType) {
	if (this._vizFrame) {
		this._vizFrame.vizType(sVizType);
	} else {
		this._requestedVizType = sVizType;
	}
	return this;
};
sap.viz.ui5.VizContainer.prototype.getVizCss = function() {
	if (this._vizFrame) {
		return this._vizFrame.vizCss();
	} else {
		return this._requestedVizCss;
	}
};
sap.viz.ui5.VizContainer.prototype.setVizCss = function(sVizCss) {
	if (this._vizFrame) {
		this._vizFrame.vizCss(sVizCss);
	} else {
		this._requestedVizCss = sVizCss;
	}
	return this;
};

sap.viz.ui5.VizContainer.prototype.getVizProperties = function() {
	if (this._vizFrame) {
		return this._vizFrame.vizProperties();
	} else {
		return this._requestedVizProperties;
	}
};
/**
 * Properties for visualization. Example:
 * 
 * <pre>
 *  var vizContainer = new sap.viz.ui5.VizContainer(...);
 *  var properties = {
 *      'dataLabel' : {'visible' : true },
 *      'legend' : { &quot;visible&quot; : true },
 *      'direction' : 'horizontal',
 *      'stacking' : 'normal'
 * };
 * vizContainer.setVizProperties(properties);
 * </pre>
 * 
 * @param {object}
 *            oVizProperties
 * @returns {sap.viz.ui5.VizContainer}
 * @public
 * @function sap.viz.ui5.VizContainer.prototype.setVizProperties
 */
sap.viz.ui5.VizContainer.prototype.setVizProperties = function(oVizProperties) {
	if (this._vizFrame) {
		this._vizFrame.vizProperties(oVizProperties);
	} else {
		this._requestedVizProperties = oVizProperties;
	}
	return this;
};

sap.viz.ui5.VizContainer.prototype.getEnableMorphing = function() {
	if (this._vizFrame) {
		return this._vizFrame.enableMorphing();
	} else {
		return this._uiConfig.enableMorphing;
	}
};
/**
 * Setter for property enableMorphing. If set true, a tween animation will play
 * when chart changed.
 * 
 * @param {boolean}
 *            bEnableMorphing
 * @returns {sap.viz.ui5.VizContainer}
 * @public
 * @function sap.viz.ui5.VizContainer.prototype.setEnableMorphing
 */
sap.viz.ui5.VizContainer.prototype.setEnableMorphing = function(bEnableMorphing) {
	if (this._vizFrame) {
		this._vizFrame.enableMorphing(bEnableMorphing);
	} else {
		this._uiConfig.enableMorphing = bEnableMorphing;
	}
	return this;
};
/**
 * Selections for visualization. Example:
 * 
 * <pre>
 *  var vizContainer = new sap.viz.ui5.VizContainer(...);
 *  var points = [{
 *      data : {
 *      	&quot;Country&quot; : &quot;China&quot;,
 *          &quot;Year&quot; : &quot;2001&quot;,
 *          &quot;Product&quot; : &quot;Car&quot;,
 *          &quot;Profit&quot; : 25
 *      }}, {
 *      data : {
 *      	&quot;Country&quot; : &quot;China&quot;,
 *          &quot;Year&quot; : &quot;2001&quot;,
 *          &quot;Product&quot; : &quot;Trunk&quot;,
 *          &quot;Profit&quot; : 34
 *      }}];
 *  var action = {
 *  	clearSelection : true
 *  };
 * vizContainer.vizSelection(points, action);
 * </pre>
 * 
 * @param {object[]}
 *            aPoints some data points of the chart
 * @param {object}
 *            oAction whether to clear previous selection, by default the
 *            selection will be incremental selection
 * @returns {sap.viz.ui5.VizContainer}
 * @public
 * @function sap.viz.ui5.VizContainer.prototype.vizSelection
 */
sap.viz.ui5.VizContainer.prototype.vizSelection = function(aPoints, oAction) {
	if (this._vizFrame) {
		var result = this._vizFrame.vizSelection.apply(this._vizFrame,
				arguments);
		if (result === this._vizFrame) {
			result = this;
		}
		return result;
	} else {
		return null;
	}
};
/**
 * Update VizContainer according to a JSON object, it can update css,
 * properties, feeds and data model. Example:
 * 
 * <pre>
 * var vizContainer = new sap.viz.ui5.VizContainer(...);
 * var vizData = new sap.viz.ui5.data.FlattenedDataset({
 *     'dimensions' : [{
 *         axis: 1,
 *         name: &quot;Country&quot;,
 *         value: &quot;{Country}&quot;
 *         },{
 *         axis: 2,
 *         name: &quot;City&quot;
 *         value: &quot;{City}&quot;  
 *      }],
 *      'measures' : [{
 *          group: 1,
 *          name: &quot;Quantity sold&quot;,
 *          value: &quot;{Quantity sold}&quot;
 *       }],
 *       'data' : {
 *           'path' : &quot;/rawData&quot;
 *       }
 * });
 * var cssString = 'position:absolute;left:0px;top:0px;';
 * var properties = {
 *     'dataLabel' : {'visible' : true },
 *     'legend' : {&quot;visible&quot; : true},
 *     'direction' : 'horizontal',
 *     'stacking' : 'normal'
 * };
 * var FeedItem = sap.viz.ui5.controls.common.feeds.FeedItem;
 * var feeds = [
 *     new FeedItem({'uid' : 'primaryValues', 
 *                   'type' : 'Measure',
 *                   'values' []}),
 *     new FeedItem({'uid' : 'regionColor', 
 *                   'type' : 'Dimension',
 *                   'values' []})];  
 * vizContainer.vizUpdate({
 *               'data' : vizData,
 *               'css' : cssString,
 *               'properties' : properties, 
 *               'feeds' : feeds
 *           });
 * </pre>
 * 
 * @param {object}
 *            oOptions a JSON object contains combination of css, properties,
 *            feeds and data model.
 * @returns {sap.viz.ui5.VizContainer}
 * @public
 * @function sap.viz.ui5.VizContainer.prototype.vizUpdate
 */
sap.viz.ui5.VizContainer.prototype.vizUpdate = function(oOptions) {
	if (this._vizFrame) {
		if (oOptions.data || oOptions.feeds) {
			this._requestedOptions = this._requestedOptions || {};
		}

		if (this._requestedOptions) {
			// Save common keyword in options, release these options when
			// aggregations trigger render
			var requestedOptions = this._requestedOptions;
			requestedOptions.css = requestedOptions.css || oOptions.css;
			requestedOptions.properties = requestedOptions.properties
					|| oOptions.properties;

			if (oOptions.data) {
				this.setVizData(oOptions.data);
			}
			if (oOptions.feeds) {
				this._resetFeeds(oOptions.feeds);
			}
		} else {
			this._vizFrame.vizUpdate(oOptions);
		}
	}
};

sap.viz.ui5.VizContainer.prototype._resetFeeds = function(aFeeds) {
	this.destroyFeeds();

	// update feeds in sequence of aaindexs
	sap.viz.ui5.controls.common.helpers.VizControlsHelper.updateFeedsByAAIndex(
			this.getVizType(), aFeeds);
	
	if (aFeeds && aFeeds.length) {
		for (var i = 0; i < aFeeds.length; i++) {
			this.addFeed(aFeeds[i]);
		}
	}
	return this;
};
sap.viz.ui5.VizContainer.prototype._setAnalysisObjectsForPicker = function(
		aAnalysisObjects) {
	this.destroyAnalysisObjectsForPicker();
	if (aAnalysisObjects && aAnalysisObjects.length) {
		for (var i = 0; i < aAnalysisObjects.length; i++) {
			this.addAnalysisObjectsForPicker(aAnalysisObjects[i]);
		}
	}
	return this;
};

sap.viz.ui5.VizContainer.prototype._createVizFrame = function(dom) {
	var VizFrame = sap.viz.controls.frame.VizFrame;
	var GlobalConfig = sap.viz.controls.common.config.GlobalConfig;

	var vizFrameConfig = GlobalConfig
			.defaultUIConfig(GlobalConfig.DEFAULT_UICONFIG_TYPE_FRAME);
	vizFrameConfig.enableFilterMenu = false;
	vizFrameConfig.enableFilterBar = false;
	vizFrameConfig.enableSettingButton = false;
	vizFrameConfig.enableFullScreenButton = false;
	vizFrameConfig.controls.chart.enableMorphing = this._uiConfig.enableMorphing;
	vizFrameConfig.controls.chart.enableTrellis = false;
	vizFrameConfig.controls.contextMenu.menu = [ [ "direction", "stacking" ],
			[ "legend", "datalabels" ] ];
	var vizFrame = new VizFrame(dom, vizFrameConfig);

	vizFrame.addEventListener('feedsChanged', jQuery.proxy(function(e) {
		this._resetFeeds(this.getFeeds());
		this.fireEvent("feedsChanged", {
			'feeds' : this.getFeeds()
		});
	}, this));

	vizFrame.addEventListener('vizTypeChanged', jQuery.proxy(function(e) {
		this.fireEvent("vizTypeChanged");
	}, this));

	vizFrame.addEventListener('vizDefinitionChanged', jQuery.proxy(function(e) {
		this.fireEvent("vizDefinitionChanged");
	}, this));

	vizFrame.vizOn('selectData', jQuery.proxy(function(e) {
		this.fireEvent("selectData", e);
	}, this));
	vizFrame.vizOn('deselectData', jQuery.proxy(function(e) {
		this.fireEvent("deselectData", e);
	}, this));
	vizFrame.vizOn('showTooltip', jQuery.proxy(function(e) {
		this.fireEvent("showTooltip", e);
	}, this));
	vizFrame.vizOn('hideTooltip', jQuery.proxy(function(e) {
		this.fireEvent("hideTooltip", e);
	}, this));
	vizFrame.vizOn('initialized', jQuery.proxy(function(e) {
		this.fireEvent("initialized", e);
	}, this));

	var options = vizFrame.getDefaultIncompleteOptions(this.getVizType());

	var feeds = this.getAggregation('feeds');
	if (feeds) {
		options.feeds = sap.viz.ui5.controls.common.helpers.VizControlsHelper
				.getFeedInstances(feeds);
	}
	var data = sap.viz.ui5.controls.common.helpers.VizControlsHelper
			.getFakedDataInstance(this.getVizType(), this.getVizData(), feeds);
	if (data) {
		options.data = data;
	}
	if (this.getVizCss()) {
		options.css = this.getVizCss();
	}
	if (this.getVizProperties()) {
		options.properties = this.getVizProperties();
	}
	this._clearRequestedProperties();
	vizFrame.createViz(options);
	return vizFrame;
};
/**
 * Create children views.
 * 
 * @private
 */
sap.viz.ui5.VizContainer.prototype._createChildren = function() {
	var app$ = this._app$;
	var cssPrefix = 'ui5-viz-controls';
	var GlobalConfig = sap.viz.controls.common.config.GlobalConfig;

	// VizFrame
	this._vizFrame$ = jQuery(document.createElement('div')).appendTo(app$)
			.addClass(cssPrefix + '-viz-frame');
	this._vizFrame = this._createVizFrame(this._vizFrame$[0]);

	if (this._uiConfig.layout === 'horizontal') {
		// VizBuilder
		var vizBuilderConfig = GlobalConfig
				.defaultUIConfig(GlobalConfig.DEFAULT_UICONFIG_TYPE_BUILDER);
		vizBuilderConfig.controls.feedingPanel.enableTrellis = false;
		vizBuilderConfig.controls.switchBar.groups = sap.viz.ui5.controls.common.helpers.VizControlsHelper
				.getSwitchBarGroups();

		this._vizBuilder$ = jQuery(document.createElement('div'))
				.appendTo(app$).addClass(cssPrefix + '-viz-builder');
		this._vizBuilder = new sap.viz.controls.builder.VizBuilder(
				this._vizBuilder$[0], vizBuilderConfig);
		this._vizBuilder.connect(this._vizFrame.vizUid());
		// Splitter
		this._vSplitter$ = jQuery(document.createElement('div')).appendTo(app$)
				.addClass(cssPrefix + '-vertical-splitter');
	} else if (this._uiConfig.layout === 'vertical') {
		// SwitchBar
		var switchBarConfig = GlobalConfig
				.defaultUIConfig(GlobalConfig.DEFAULT_UICONFIG_TYPE_SWITCHBAR);
		switchBarConfig.groups = sap.viz.ui5.controls.common.helpers.VizControlsHelper
				.getSwitchBarGroups();

		this._switchBar$ = jQuery(document.createElement('div')).appendTo(app$);
		this._switchBar = new sap.viz.controls.switchbar.SwitchBar(
				this._switchBar$[0], switchBarConfig);
		this._switchBar.connect(this._vizFrame.vizUid());
	}

	this._registerControl('sap.viz.controls.frame.VizFrame', this._vizFrame);
	if (this._vizBuilder) {
		this._registerControl('sap.viz.controls.builder.VizBuilder',
				this._vizBuilder);
	}
	if (this._switchBar) {
		this._registerControl('sap.viz.controls.switchbar.SwitchBar',
				this._switchBar);
	}

	this._validateAOs();
};

sap.viz.ui5.VizContainer.prototype._updateChildren = function() {
	var options = {};
	if (this._requestedOptions) {
		if (this._requestedOptions.css) {
			options.css = this._requestedOptions.css;
		}
		if (this._requestedOptions.properties) {
			options.properties = this._requestedOptions.properties;
		}
		this._requestedOptions = null;
	}
	options.data = sap.viz.ui5.controls.common.helpers.VizControlsHelper
			.getFakedDataInstance(this.getVizType(), this.getVizData(), this
					.getAggregation('feeds'));
	options.feeds = sap.viz.ui5.controls.common.helpers.VizControlsHelper
			.getFeedInstances(this.getAggregation('feeds'));

	this._vizFrame.vizUpdate(options);

	this._validateAOs();
};

sap.viz.ui5.VizContainer.prototype._validateAOs = function() {
	if (this._vizBuilder) {
		var aoInstaces = sap.viz.ui5.controls.common.feeds.AnalysisObject
				.toInstances(this.getAnalysisObjectsForPicker());
		this._vizBuilder.analysisObjectsForPicker(aoInstaces);
	}
};

// need to validateSize in case the host(browser/control) size change.
sap.viz.ui5.VizContainer.prototype._validateSize = function() {
	var size = {
		'width' : this.$().width(),
		'height' : this.$().height()
	};
	if (this._uiConfig.layout === 'horizontal') {
		this._app$.css({
			'min-width' : '560px',
			// TODO Plus 1 for upper border, maybe it should fix in viz.controls
			'min-height' : '601px'
		});
	} else if (this._uiConfig.layout === 'vertical') {
		this._app$.css({
			'min-width' : '300px',
			'min-height' : '654px'
		});
	}

	this.$().css({
		'overflow' : 'hidden'
	});
	// this._app$.css({
	// 'width' : size.width,
	// 'height' : size.height,
	// 'overflow': 'hidden'
	// });
	var appSize = {
		'width' : this._app$.width(),
		'height' : this._app$.height()
	}

	if (this._uiConfig.layout === 'horizontal') {
		var buiderWidth = this._vizBuilder$.width();

		this._vizFrame.size({
			'width' : appSize.width - buiderWidth,
			'height' : appSize.height
		});
		this._vizBuilder.size({
			'width' : buiderWidth,
			// TODO: Minus 1 for upper border, maybe it should fix in
			// viz.controls
			'height' : appSize.height - 1
		});
		this._vizFrame$.css({
			'left' : '0px',
			'top' : '0px'
		});
		this._vizBuilder$.css({
			'left' : appSize.width - buiderWidth + 'px',
			'top' : '0px'
		});
		this._vSplitter$.css({
			'left' : appSize.width - buiderWidth + 'px',
			'top' : '0px',
			'height' : appSize.height + 'px'
		});
	} else if (this._uiConfig.layout === 'vertical') {
		var switchBarWidth = 388;
		var switchBarHeight = 54;
		this._vizFrame.size({
			'width' : appSize.width,
			'height' : appSize.height - switchBarHeight
		});
		this._switchBar.size({
			'width' : switchBarWidth,
			'height' : switchBarHeight
		});
		this._vizFrame$.css({
			'left' : '0px',
			'top' : switchBarHeight + 'px'
		});
		this._switchBar$.css({
			'left' : (appSize.width - switchBarWidth) / 2 + 'px',
			'top' : (switchBarHeight - 36) / 2 + 'px'
		});
	}
	this.$().css({
		'overflow' : 'auto'
	});
};
