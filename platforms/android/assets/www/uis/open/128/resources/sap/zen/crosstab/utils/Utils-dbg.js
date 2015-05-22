jQuery.sap.declare("sap.zen.crosstab.utils.Utils");
jQuery.sap.require("sap.zen.crosstab.rendering.RenderingConstants");

sap.zen.crosstab.utils.Utils = function (oCrosstab) {
	
	var that = this;

	this.getModelCoordinates = function (iAreaRow, iAreaCol, sAreaType) {
		var oModelCoordinates = {};
		oModelCoordinates.iRow = iAreaRow;
		oModelCoordinates.iCol = iAreaCol;

		var iColHeaderAreaRows = oCrosstab.getColumnHeaderArea().getRowCnt();
		var iRowHeaderAreaCols = oCrosstab.getRowHeaderArea().getColCnt();

		if (sAreaType === sap.zen.crosstab.rendering.RenderingConstants.TYPE_DATA_AREA) {
			oModelCoordinates.iRow += iColHeaderAreaRows;
			oModelCoordinates.iCol += iRowHeaderAreaCols;
		} else if (sAreaType === sap.zen.crosstab.rendering.RenderingConstants.TYPE_COLUMN_HEADER_AREA) {
			oModelCoordinates.iCol += iRowHeaderAreaCols;
		} else if (sAreaType === sap.zen.crosstab.rendering.RenderingConstants.TYPE_ROW_HEADER_AREA) {
			oModelCoordinates.iRow += iColHeaderAreaRows;
		}
		return oModelCoordinates;
	};
	

		this.selectTextInInputField = function (oInputField, iSelectionStartPos, iSelectionEndPos) {
		if (iSelectionStartPos === -1 && iSelectionEndPos === -1) {
			oInputField.select();
		} else {
			oDomInputField = oInputField[0];
			if (oCrosstab.isIE8Mode()) {
				if (oDomInputField.createTextRange !== "undefined") {
					var oRange = oDomInputField.createTextRange();
					oRange.collapse(true);
					// This must be done in exactly this order!
					oRange.moveEnd("character", iSelectionEndPos + 1);
					oRange.moveStart("character", iSelectionStartPos);
					oRange.select();
				}
			} else if (oDomInputField.selectionStart !== "undefined") {
				oDomInputField.selectionStart = iSelectionStartPos;
				oDomInputField.selectionEnd = iSelectionEndPos;
			}
		}
	};

	this.getSelectionParams = function (oDomContainerDiv) {
		var iStartPos = -1;
		var iEndPos = -1;
		if (oCrosstab.isIE8Mode()) {
			if (document.selection !== "undefined" && document.selection.type === "Text") {
				oRange = document.selection.createRange();
				if (oRange && oRange.text.length > 0) {
					var oBodyRange = document.body.createTextRange();
					oBodyRange.moveToElementText(oDomContainerDiv);
					oBodyRange.setEndPoint("EndToStart", oRange);
					iStartPos = oBodyRange.text.length;
					iEndPos = iStartPos + oRange.text.length - 1;
				}
			}
		} else if (window.getSelection) {
			var sSelectedText = window.getSelection().toString();
			if (sSelectedText && sSelectedText.length > 0) {
				iStartPos = window.getSelection().anchorOffset;
				iEndPos = window.getSelection().focusOffset;
			}
		}
		return {
			iSelectionStartPos: iStartPos,
			iSelectionEndPos: iEndPos
		};
	};
	
	this.sendClientScrollPosUpdate = function(iCurrentHScrollStep, bHScrolledToEnd, iCurrentVScrollStep, bVScrolledToEnd, bIsHeaderData) {
		var oCrossRequestManager = oCrosstab.getRenderEngine().getCrossRequestManager();
		if (oCrossRequestManager) {
			if (bIsHeaderData === true) {
				oCrossRequestManager.setHeaderScrollData({"iHPos" : iCurrentHScrollStep});
			} else {
				oCrossRequestManager.setScrollData(iCurrentHScrollStep, bHScrolledToEnd, iCurrentVScrollStep, bVScrolledToEnd);
			}
		}
		that.sendScrollPosUpdate(iCurrentHScrollStep, bHScrolledToEnd, iCurrentVScrollStep, bVScrolledToEnd, bIsHeaderData);
	};
	
	this.sendScrollPosUpdate = function(piHScrollPos, pbHScrolledToEnd, piVScrollPos, pbVScrolledToEnd, bIsHeaderData) {
		var sCommand = oCrosstab.getScrollNotifyCommand();
		if (sCommand) {
			sCommand = sCommand.replace("__CLIENT_VPOS__", piVScrollPos);
			sCommand = sCommand.replace("__CLIENT_VPOS_END__", pbVScrolledToEnd ? "X" : " ");
			// header data currently only for horizontal scrolling possible
			sCommand = sCommand.replace("__CLIENT_HPOS__", (bIsHeaderData ? "H" + piHScrollPos : piHScrollPos));
			sCommand = sCommand.replace("__CLIENT_HPOS_END__", pbHScrolledToEnd ? "X" : " ");
			var fAction = new Function(sCommand);
			fAction();
		}
	};
};

sap.zen.crosstab.utils.Utils.unEscapeDisplayString = function (sHtmlString) {
	var sUnEscapedString = sHtmlString.replace(/<br\/>/g, "\r\n");
	sUnEscapedString = sUnEscapedString.replace(/&nbsp;/g, "&#x20;");
	sUnEscapedString = $("<div/>").html(sUnEscapedString).text();
	return sUnEscapedString;
};

sap.zen.crosstab.utils.Utils.prepareStringForRendering = function (sText) {
	var bHasLineBreaks = false;
	var sPrePreparedString = sText.replace(/(\r\n)|(\n\r)|\r|\n/g, "<br/>");
	bHasLineBreaks = (sPrePreparedString !== sText);	
	var sPreparedString = sPrePreparedString.replace(/(&#xd;&#xa;)|(&#xa;&#xd;)|&#xd;|&#xa;/g, "<br/>");
	bHasLineBreaks = (sPreparedString !== sPrePreparedString) || bHasLineBreaks;
	
	sPreparedString = sPreparedString.replace(/&#x20;/g, "&nbsp;");
	return {"text" : sPreparedString, "bHasLineBreaks" : bHasLineBreaks}; 
};

sap.zen.crosstab.utils.Utils.cancelEvent = function (e) {
	if (e) {
		if (e.preventDefault) {
			e.preventDefault();
		}
		sap.zen.crosstab.utils.Utils.stopEventPropagation(e);
	}
};

sap.zen.crosstab.utils.Utils.stopEventPropagation = function (e) {
	if (e) {
		if (e.stopPropagation) {
			e.stopPropagation();
		}
		if (e.cancelBubble) {
			e.cancelBubble = true;
		}
	}
};

sap.zen.crosstab.utils.Utils.hasEntries = function (oAssocArray) {
	var bHasEntries = false;
	if (oAssocArray) {
		for ( var key in oAssocArray) {
			if (oAssocArray.hasOwnProperty(key)) {
				bHasEntries = true;
				break;
			}
		}
	}
	return bHasEntries;
};

sap.zen.crosstab.utils.Utils.padWithZeroes = function (iNumber, iLength) {
	var s = iNumber.toString();
	if (s.length < iLength) {
		s = ('0000000000' + s).slice(-iLength);
	}
	return s;
};

sap.zen.crosstab.utils.Utils.selectTextInElement = function (oDomTextContainer) {
	var oRange;
	var oSelection;
	if (oDomTextContainer.innerHTML) {
		if (document.createRange && window.getSelection) {
			oRange = document.createRange();
			oSelection = window.getSelection();
			try {
				oSelection.removeAllRanges();
			} catch (e) {
				// this might happen in IE -> browser bug. When it happens,
				// text will not be selected
			}
			try {
				oRange.selectNodeContents(oDomTextContainer);
				oSelection.addRange(oRange);
			} catch (e) {
				oRange.selectNode(oDomTextContainer);
				oSelection.addRange(oRange);
			}
		} else if (document.body.createTextRange) {
			// IE8
			oRange = document.body.createTextRange();
			oRange.moveToElementText(oDomTextContainer);
			oRange.select();
		}
	}
};

sap.zen.crosstab.utils.Utils.getWidthFromStyle = function (oJqElement) {
	var i = 0;
	var sStyle = "";
	var aStyleDef = null;
	var sWidth = null;
	var sStyles = oJqElement.attr('style');
	if (sStyles) {
		var aStyles = sStyles.split(";");
		if (aStyles) {
			for (i = 0; i < aStyles.length; i++) {
				sStyle = aStyles[i];
				if (sStyle) {
					aStyleDef = sStyle.split(":");
					if (aStyleDef[0] === "width") {
						sWidth = aStyleDef[1];
						break;
					}
				}
			}
		}
	}
	if (sWidth) {
		sWidth = $.trim(sWidth);
	}
	return sWidth;
};

sap.zen.crosstab.utils.Utils.sign = function(x) {
	return x > 0 ? 1 : x < 0 ? -1 : 0;
};
