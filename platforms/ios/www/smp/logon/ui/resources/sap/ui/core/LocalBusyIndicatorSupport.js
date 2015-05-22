/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2014 SAP SE. All rights reserved
 */
sap.ui.define(['jquery.sap.global','./Element'],function(q,E){"use strict";var L=function(){if(this===sap.ui.core.Control.prototype){this.setDelay=function(d){this.setBusyIndicatorDelay(d)}}else{q.sap.log.error("Only controls can use the LocalBusyIndicator",this)}};return L},true);
