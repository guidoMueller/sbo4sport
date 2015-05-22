/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
sap.ui.jsview("sap.apf.ui.reuse.view.facetFilter",{getControllerName:function(){return"sap.apf.ui.reuse.controller.facetFilter"},createContent:function(c){var s=this;this.aFacetFilterListControls=[];this.oCoreApi=this.getViewData().oCoreApi;this.oUiApi=this.getViewData().oUiApi;this.oPathContextHandler=this.getViewData().oPathContextHandler;this.aFacetFilterListData=this.getViewData().aFacetFilterListData;this.aFacetFilterListData.forEach(function(f){var F=new sap.m.FacetFilterList({title:s.oCoreApi.getTextNotHtmlEncoded(f.label),multiSelect:f.multiSelection==="true",key:f.property,growing:false,listClose:c.onListClose.bind(c)});s.aFacetFilterListControls.push(F)});this.onContextChanged=c.onContextChanged.bind(c);this.oFacetFilter=new sap.m.FacetFilter({type:"Simple",showReset:true,lists:this.aFacetFilterListControls,reset:c.onResetPress.bind(c)});return this.oFacetFilter}});
