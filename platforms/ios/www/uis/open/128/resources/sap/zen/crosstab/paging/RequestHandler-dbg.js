jQuery.sap.declare("sap.zen.crosstab.paging.RequestHandler");
jQuery.sap.require("sap.zen.crosstab.paging.RequestStack");

sap.zen.crosstab.paging.RequestHandler = function(oPageManager) {
	"use strict";

	var oCrosstab = oPageManager.getCrosstab();
	var sRequestCommandTemplate = oPageManager.getRequestCommandTemplate();
	var iPageTileRowCnt = oPageManager.getTileRowCnt();
	var iPageTileColCnt = oPageManager.getTileColCnt();
	var oRequestStack = new sap.zen.crosstab.paging.RequestStack(0);
	var iMaxRequests = 0;
	var iTimeout = 0;

	oRequestStack.addElementRemovedHandler(requestRemovedCallback);

	var oRequestTimer = null;

	this.sendPageRequest = function(oPage) {
		oRequestStack.push(oPage);
		resetTimer();
	};
	
	this.enableTimeout = function(bEnableTimeout) {
		iTimeout = bEnableTimeout ? 1000: 0;
	};

	this.reset = function() {
		oRequestStack.clear();
		iMaxRequests = 0;
		this.enableTimeout(false);
	};

	this.setMaxQueueRequests = function(iMaxRequestCnt) {
		iMaxRequests = iMaxRequestCnt;
	};

	this.getMaxQueueRequests = function() {
		return oRequestStack.getMaxSize();
	};

	this.unlimitStack = function() {
		oRequestStack.unlimitStack();
	};

	function resetTimer() {
		if (oRequestTimer) {
			clearTimeout(oRequestTimer);
		}
		oRequestTimer = setTimeout(handleQueuedRequests, iTimeout);
	}

	function sendRequest(oPage) {
		var fReqHandler = oCrosstab.getPageRequestHandler();
		var oPagePos = oPage.getPosition();
		if (fReqHandler) {
			var iRow = Math.floor(oPagePos.iRow);
			var iCol = Math.floor(oPagePos.iCol);
			fReqHandler(iRow, iCol);
		} else {
			var sCommand = buildPageRequestCommand(oPagePos);
			var fSendRequest = new Function(sCommand);
			fSendRequest();
		}
	}

	function handleQueuedRequests() {
		var oPage = null;
		while (oRequestStack.getActualSize() > 0) {
			oPage = oRequestStack.pop();
			sendRequest(oPage);
		}
		if (iMaxRequests > 0) {
			oRequestStack.resetStack(iMaxRequests);
			iMaxRequests = 0;
		}
	}

	function requestRemovedCallback(oRemovedPage) {
		oPageManager.removeRequest(oRemovedPage);
	}

	function buildPageRequestCommand(oPagePos) {
		var iRequestedRow = oPagePos.iRow * iPageTileRowCnt + 1;
		var iRequestedCol = oPagePos.iCol * iPageTileColCnt + 1;

		var sCommand = sRequestCommandTemplate.replace("__X__", iRequestedCol);
		sCommand = sCommand.replace("__Y__", iRequestedRow);

		return sCommand;
	}
};