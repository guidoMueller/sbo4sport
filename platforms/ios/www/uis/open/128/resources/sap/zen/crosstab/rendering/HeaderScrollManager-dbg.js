jQuery.sap.declare("sap.zen.crosstab.rendering.HeaderScrollManager");

sap.zen.crosstab.rendering.HeaderScrollManager = function (oCrosstab, oRenderEngine) {
	"use strict";

	var oScrollDivs = {};
	var iCurrentHScrollPos = 0;
	var that = this;
	var oCrossRequestManager = oRenderEngine.getCrossRequestManager();
	var oUpdateTimer = null;

	this.destroy = function () {
		// do nothing
	};

	this.onNewScrollbars = function () {
		oScrollDivs = {};
	};

	oRenderEngine.registerNewScrollbarsNotification(this.onNewScrollbars);

	function getDomScrollDiv (sScrollDivSuffix) {
		var oJqScrollDiv = oScrollDivs[sScrollDivSuffix];
		if (!oJqScrollDiv) {
			oJqScrollDiv = $('#' + oCrosstab.getId() + sScrollDivSuffix);
			if (oJqScrollDiv && oJqScrollDiv.length > 0) {
				oScrollDivs[sScrollDivSuffix] = oJqScrollDiv;
			}
		}
		return oJqScrollDiv;
	}

	function moveHorizontal () {
		getDomScrollDiv("_lowerLeft_scrollDiv").scrollLeft(iCurrentHScrollPos);
		getDomScrollDiv("_upperLeft_scrollDiv").scrollLeft(iCurrentHScrollPos);
	}
		
	this.hScrollHandler = function (oEvent) {
		var iOldHScrollPos = iCurrentHScrollPos;
		iCurrentHScrollPos = oEvent.getParameters().newScrollPos;
		moveHorizontal();
		if (iOldHScrollPos !== iCurrentHScrollPos) {
			that.sendClientScrollPosUpdate();
		}
	};
	
	this.sendClientScrollPosUpdate = function() {
		if (oUpdateTimer) {
			clearTimeout(oUpdateTimer);
			oUpdateTimer = null;
		}
		oUpdateTimer = setTimeout(that.doSendPosUpdate, 200, null);
	};
	
	this.doSendPosUpdate = function() {
		oCrosstab.getUtils().sendClientScrollPosUpdate(iCurrentHScrollPos, undefined, undefined, undefined, true);
	};

	this.setHScrollData = function(oHScrollData) {
		if (oHScrollData) {
			iCurrentHScrollPos = oHScrollData.iHPos;
		} else {
			iCurrentHScrollPos = 0;
		}
	};
	
	this.moveScrollbars = function() {
		var oHScrollbar = oCrosstab.getHorizontalHeaderScrollbar();
		if (oHScrollbar) {
			moveHorizontal();
			oHScrollbar.setScrollPosition(iCurrentHScrollPos);
		}
	};
};