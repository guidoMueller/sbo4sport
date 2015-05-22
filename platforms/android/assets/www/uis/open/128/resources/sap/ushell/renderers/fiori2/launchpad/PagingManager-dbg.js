// Copyright (c) 2013 SAP AG, All Rights Reserved

(function () {
    "use strict";
    /*global jQuery, sap, console, document, $, setTimeout, window */
    /*jslint plusplus: true, nomen: true, bitwise: true */

    jQuery.sap.declare("sap.ushell.renderers.fiori2.launchpad.PagingManager");
    sap.ui.base.EventProvider.extend("sap.ushell.renderers.fiori2.launchpad.PagingManager", {
        metadata : {
            publicMethods : ["setElementClass", "setContainerSize", "getNumberOfAllocatedElements", "moveToNextPage", "getTileHeight"]
        },
        constructor : function (sId, mSettings) {
            //make this class only available once
//            if (sap.ushell.renderers.fiori2.launchpad.getPagingManager && sap.ushell.renderers.fiori2.launchpad.getPagingManager()) {
//                return sap.ushell.renderers.fiori2.launchpad.getPagingManager();
//            }
            sap.ushell.renderers.fiori2.launchpad.getPagingManager = jQuery.sap.getter(this.getInterface());
            this.currentPageIndex = 0;
            this.containerHeight = mSettings.containerHeight || 0;
            this.containerWidth = mSettings.containerWidth || 0;
            this.ElementClass = mSettings.elementClassName || "";
            this.tileHeight = 0;
        },
        getTileHeight : function () {
            return this.tileHeight;
        },
        setElementClass : function (sClassName) {
            this.ElementClass = sClassName;
        },

        setContainerSize : function (nHeight, nWidth) {
            this.containerHeight = nHeight;
            this.containerWidth = nWidth;
        },

        getNumberOfAllocatedElements : function () {
            return this._calcElementsPerPage() * this.currentPageIndex;
        },

        moveToNextPage : function () {
            this.currentPageIndex++;
        },

        _calcElementsPerPage : function () {
            var oElement = jQuery("<div>").addClass(this.ElementClass);
            jQuery('body').append(oElement);
            var elementHeight = oElement.height();
            var elementWidth = oElement.width();
            
            if(elementHeight < 100 || elementWidth < 100) {
              elementWidth = 100; 
              elementHeight = 100;
            }
            
            var elementsPerRow = Math.round(this.containerWidth / elementWidth),
                elementsPerColumn = Math.round(this.containerHeight / elementHeight);
            this.tileHeight = elementHeight;

            oElement.remove();
            if (!elementsPerRow || !elementsPerColumn || elementsPerColumn === Infinity || elementsPerRow === Infinity || elementsPerColumn === 0 || elementsPerRow === 0) {
                return 10;
            }
            return elementsPerRow * elementsPerColumn;
        }
    });
}());