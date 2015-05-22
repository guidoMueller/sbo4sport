jQuery.sap.declare("sap.zen.crosstab.EventHandler");
jQuery.sap.require("sap.zen.crosstab.TouchHandler");
jQuery.sap.require("sap.zen.crosstab.rendering.CrossRequestManager");
jQuery.sap.require("sap.zen.crosstab.rendering.RenderingConstants");
jQuery.sap.require("sap.zen.crosstab.utils.Utils");
jQuery.sap.require("sap.zen.crosstab.keyboard.CrosstabKeyboardNavHandler");

sap.zen.crosstab.EventHandler = function (oCrosstab) {
	"use strict";
	
	var that = this;
	var oCrossRequestManager = oCrosstab.getRenderEngine().getCrossRequestManager();
	var oCurrentlyHoveredCell = null;
	var oSelectedCellData = null;
	var oDataArea = oCrosstab.getDataArea();
	var oRowHeaderArea = oCrosstab.getRowHeaderArea();
	var oColHeaderArea = oCrosstab.getColumnHeaderArea();
	var oDimensionHeaderArea = oCrosstab.getDimensionHeaderArea();
	var oHighlightingInfo = null;
	var oKeyboardHandler = new sap.zen.crosstab.keyboard.CrosstabKeyboardNavHandler(oCrosstab, this);
	var sMouseDownTargetId = null;
	var bPreventClickAction = false;
	var oTouchHandler = null;

	function isPreventAction (oCurrentlySelectedCell, oCell, oCrosstab) {
		var bPreventAction = false;
		if (oCrosstab.isDataSelectionMode()) {
			if (oCurrentlySelectedCell === oCell) {
				bPreventAction = true;
			}
		}
		return bPreventAction;
	}

	this.removeHighlighting = function (oHeaderCell) {
		var oDomHeaderCell = $('#' + oHeaderCell.getId());
		if (oDomHeaderCell.hasClass("sapzencrosstab-HighlightRowHeaderCell")
				|| oDomHeaderCell.hasClass("sapzencrosstab-HighlightColHeaderCell")) {
			this.applySelectionEffect(oHeaderCell, getCellHighlightFunclets(false));
		}
	};

	this.handleRowColSelection = function (e) {
		if (!oCurrentlyHoveredCell && oCrosstab.getPropertyBag().isMobileMode()) {
			oCurrentlyHoveredCell = getParentSelectableCell(e);
		}
		if (oCurrentlyHoveredCell) {
			var oCurrentlySelectedCell = that.getSelectedCell();
			if (!oCurrentlySelectedCell) {
				oCurrentlySelectedCell = getParentSelectableCell(e);
				if (oCurrentlySelectedCell) {
					var oFunclets = getCellSelectFunclets(true);
					that.applySelectionEffect(oCurrentlySelectedCell, oFunclets);
					that.setSelectedCell(oCurrentlySelectedCell);
					that.sendSelectCommand(oCurrentlySelectedCell);
					sap.zen.crosstab.utils.Utils.cancelEvent(e);
				}
			} else {
				var oCell = getParentSelectableCell(e);
				if (oCell && oCell.isSelectable && oCell.isSelectable()) {
					var bDoNothing = false;
					if (oCurrentlySelectedCell) {
						// if there was already something selected, remove the selection effects
						// in case we are in dataselection mode, a click on a selected cell shall not remove
						// the selection. So check this.
						bDoNothing = isPreventAction(oCurrentlySelectedCell, oCell, oCrosstab);
						if (!bDoNothing) {
							var oFunclets = getCellSelectFunclets(false);
							that.applySelectionEffect(oCurrentlySelectedCell, oFunclets);
						}
					}
					if (oCell === oCurrentlySelectedCell) {
						if (!bDoNothing) {
							oCurrentlySelectedCell = null;
						}
					} else {
						oCurrentlySelectedCell = oCell;
					}
					if (oCurrentlySelectedCell) {
						if (!bDoNothing) {
							// only step 1: ideally, the highlighted state is returned
							// via callback and then rendered after a fresh roundtrip
							that.highlightCells();
							var oFunclets = getCellSelectFunclets(true);
							that.applySelectionEffect(oCurrentlySelectedCell, oFunclets);
						}
					}
					if (!bDoNothing) {
						that.setSelectedCell(oCurrentlySelectedCell);
						that.sendSelectCommand(oCurrentlySelectedCell);
					}
					sap.zen.crosstab.utils.Utils.cancelEvent(e);
				}
			}
			if (oCrosstab.getPropertyBag().isMobileMode()) {
				oCurrentlyHoveredCell = null;
			}
			return true;
		} else {
			// No selectable cell was clicked
			return false;
		}
	};

	this.handleHierarchyClick = function (e, sTargetId, sClickAction) {
		var oCell = getCellById(sTargetId);
		var sHierarchyAction = oCell.getHierarchyAction();
		var sDrillState = oCell.getDrillState();
		if (sDrillState !== "L") {
			if (oCell.getArea().isRowHeaderArea()) {
				oCrossRequestManager.saveColWidths();
			}
			oCrossRequestManager.saveTableDimensions();
			oCrossRequestManager.saveHScrollInfo(sClickAction);
			oCrossRequestManager.saveVScrollInfo(sClickAction);
			executeAction(sHierarchyAction);
		}
		sap.zen.crosstab.utils.Utils.cancelEvent(e);
	};

	this.handleSortClick = function (e, sTargetId, sClickAction) {
		var oCell = getCellById(sTargetId);
		var sSortAction = oCell.getSortAction();
		if (sSortAction || oCrosstab.getTestProxy().getTestAction()) {
			oCrossRequestManager.saveVScrollInfo(sClickAction);
			oCrossRequestManager.saveHScrollInfo(sClickAction);
			oCrossRequestManager.saveColWidths();
			if (!oCrosstab.getTestProxy().getTestAction()) {
				executeAction(sSortAction);
			}
		}
		sap.zen.crosstab.utils.Utils.cancelEvent(e);
	};

	this.handleDataCellSelection = function (e) {
		if (oCurrentlyHoveredCell) {
			if (!oSelectedCellData) {
				var oFunclets = getCellSelectFunclets(true);
				that.applySelectionEffect(oCurrentlyHoveredCell, oFunclets);
				that.setSelectedCell(oCurrentlyHoveredCell);
				that.sendSelectCommand(oCurrentlyHoveredCell);
				sap.zen.crosstab.utils.Utils.cancelEvent(e);
			} else {
				var oCell = getParentSelectableCell(e);
				var oCurrentlySelectedCell = oDataArea.getCell(oSelectedCellData.iRow, oSelectedCellData.iCol);
				var oFunclets = getCellSelectFunclets(false);
				that.applySelectionEffect(oCurrentlySelectedCell, oFunclets);
				if (oCell) {
					if (oCell === oCurrentlySelectedCell) {
						oCurrentlySelectedCell = null;
					} else {
						oCurrentlySelectedCell = oCell;
					}
					if (oCurrentlySelectedCell) {
						var oFunclets = getCellSelectFunclets(true);
						that.applySelectionEffect(oCurrentlySelectedCell, oFunclets);
					}
					that.setSelectedCell(oCurrentlySelectedCell);
					that.sendSelectCommand(oCurrentlySelectedCell);
					sap.zen.crosstab.utils.Utils.cancelEvent(e);
				}
			}
		}
	};

	this.findTargetId = function (oDomTarget) {
		var sTargetId = null;
		var oJqClosestDiv = $(oDomTarget).closest("div");
		if (oJqClosestDiv.length > 0) {
			var sId = oJqClosestDiv.attr("id");
			if (sId) {
				var idx = sId.indexOf("_contentDiv");
				if (idx > -1) {
					sTargetId = sId.slice(0, idx);
				}
			}
		}
		return sTargetId;
	};

	this.executeOnClickAction = function (e) {
		if (bPreventClickAction) {
			return;
		}
		sMouseDownTargetId = null;
		bPreventClickAction = false;
		var sTargetId = e.target.id;

		if (!sTargetId) {
			sTargetId = that.findTargetId(e.target);
		}

		if (!sTargetId) {
			return;
		}
		var sClickAction = getActionById(sTargetId);

		if (sClickAction === "sort") {
			that.handleSortClick(e, sTargetId, sClickAction);
		} else if (sClickAction === "hier") {
			that.handleHierarchyClick(e, sTargetId, sClickAction);
		} else if (sClickAction === "__ce") {
			if (oCrosstab.hasLoadingPages()) {
				sap.zen.crosstab.utils.Utils.cancelEvent(e);
				return;
			}
			var bIsSelectionEnabled = oCrosstab.getPropertyBag().isSelectionEnabled();
			if (bIsSelectionEnabled && oCrosstab.isSingleDataCellSelection() === true) {
				that.handleDataCellSelection(e);
			} else if (bIsSelectionEnabled) {
				var bWasSelection = that.handleRowColSelection(e);
				if (!bWasSelection) {
					that.handleInputEnabledCell(sTargetId, -1, -1);
				}
			} else {
				that.handleInputEnabledCell(sTargetId, -1, -1);
			}
		} else if (sClickAction === "vhlp") {
			that.handleValueHelpClick(sTargetId);
		}
		sap.zen.crosstab.utils.Utils.cancelEvent(e);
	};

	this.getCellIdFromContenDivId = function (sId) {
		var i = sId.indexOf("_contentDiv");
		if (i > -1) {
			sId = sId.slice(0, i);
		} else {
			i = sId.indexOf("_textContentDiv");
			if (i > -1) {
				sId = sId.slice(0, i);
			}
		}
		return sId;
	};

	this.provideInputEnabledCell = function (oModelCell, sTargetId, oContentDiv, iSelectionStartPos, iSelectionEndPos) {
		var oInputField = oContentDiv.find("input");

		if (oInputField.length === 0) {
			var sRenderText = oContentDiv.text();
			var html = oContentDiv.html();
			var bCellIsDataCell = oModelCell.getArea().isDataArea();

			var sSetContentDivWidth = null;

			var executeTransferData = function (sValue) {
				// Cut away the unit if the input was provided with a unit, otherwise the input is invalid
				var sUnit = oModelCell.getUnit();
				if (sUnit && sUnit !== "") {
					var iUnitIndex = sValue.toUpperCase().indexOf(sUnit.toUpperCase());
					if (iUnitIndex !== -1) {
						if (iUnitIndex === 0) {
							// leading unit
							sValue = sValue.substring(iUnitIndex + sUnit.length);
						} else {
							// trailing unit
							sValue = sValue.substring(0, iUnitIndex);
						}

					}
				}

				var iOffset = oCrosstab.calculateOffset(oModelCell);

				// Trim the input, leading and trailing whitespaces lead to errors
				sValue = $.trim(sValue);

				var sTransferDataCommand = oCrosstab.getTransferDataCommand();
				sTransferDataCommand = sTransferDataCommand.replace("__ROW__", oModelCell.getRow() + "");
				sTransferDataCommand = sTransferDataCommand.replace("__COL__", (oModelCell.getCol() - iOffset) + "");
				sTransferDataCommand = sTransferDataCommand.replace("__VALUE__", sValue);
				sTransferDataCommand = sTransferDataCommand.replace("__CTYPE__", oModelCell.getPassiveCellType());

				oCrossRequestManager.saveVScrollInfo("plan");
				oCrossRequestManager.saveHScrollInfo("plan");
				oCrossRequestManager.saveColWidths();

				executeAction(sTransferDataCommand, true);
			};

			var onLoseFocus = function (e) {
				if (oInputField.val() !== sRenderText) {
					executeTransferData(oInputField.val());

					// This prevents that the previous entry shows up again in the cell while waiting for the delta with
					// the new value
					var sEncodedRenderText = $('<div/>').text(sRenderText).html();
					html = html.replace(sEncodedRenderText, oInputField.val());
				}
				onFocusLost(e);
			};
			
			var checkTargetIsInCrosstab = function(e) {
				var bIsInCrosstab = true;
				var sTargetId = null;
				var oJqTableDiv = null;
				var oJqTarget = null;
				// do keep focus if a value help is opening although the newly focused element is not part of the crosstab
				if (e && e.relatedTarget && e.relatedTarget.id && oCrosstab.getValueHelpStatus() !== sap.zen.crosstab.VHLP_STATUS_OPENING) {
					// does not work in FireFox yet (see https://bugzilla.mozilla.org/show_bug.cgi?id=962251)
					sTargetId = e.relatedTarget.id;
					oJqTarget = $('#' + sTargetId);
					oJqTableDiv = oCrosstab.getTableDiv();
					bIsInCrosstab = oJqTarget.closest(oJqTableDiv).length > 0;
				}
				return bIsInCrosstab;
			};

			var onFocusLost = function (e) {
				var oJqDiv = $('#' + sTargetId + "_contentDiv");
				oJqDiv.html(html);

				if (sSetContentDivWidth && bCellIsDataCell) {
					oJqDiv.width(sSetContentDivWidth);
				}
						
				if (checkTargetIsInCrosstab(e) === true) {
					oJqDiv.focus();
				} else {
					oKeyboardHandler.reset();
				}
			};

			var onInputFieldKeyDown = function (e) {
				if (e.which === 27) {
					onFocusLost();
					sap.zen.crosstab.utils.Utils.cancelEvent(e);
				}
				if (e.which === 13) {
					if (oInputField.val() !== sRenderText) {
						sap.zen.crosstab.utils.Utils.cancelEvent(e);
						executeTransferData(oInputField.val());
					} else {
						onFocusLost();
						if (oCrosstab.isIE8Mode()) {
							oKeyboardHandler.keyboardNavKeyHandler(e);
						}
					}
				}
				if (e.which === 38 || e.which === 40) {
					// enable vert keyboard navigation
					return true;
				}
				if (e.which === 37 || e.which === 39) {
					if (!e.ctrkKey && !e.altKey && !e.shiftKey) {
						// left/right keys must work in the input field to move back and forward in the text string.
						// however, left/right keys must not lead to leaving the cell/input field.
						// Hence, just prevent bubbling of the event to the navigation key handler, but still execute
						// the
						// default
						sap.zen.crosstab.utils.Utils.stopEventPropagation(e);
					}
					return true;
				}
			};

			var iContentDivWidth = 0;
			// content Div handling for data cells
			if (bCellIsDataCell) {
				iContentDivWidth = oContentDiv.innerWidth();
				sSetContentDivWidth = sap.zen.crosstab.utils.Utils.getWidthFromStyle(oContentDiv);
			}
			oContentDiv.html("<input id=\"" + sTargetId + "_input" + "\" type=\"text\" value=\"" + sRenderText
					+ "\" />");

			if (bCellIsDataCell) {
				oContentDiv.width(iContentDivWidth + "px");
			}
			oInputField = $('#' + sTargetId + "_input");
			oInputField.addClass("sapzencrosstab-EntryEnabledInput");
			oInputField.keydown(onInputFieldKeyDown);
			oInputField.focus();
			oCrosstab.getUtils().selectTextInInputField(oInputField, iSelectionStartPos, iSelectionEndPos);
			oInputField.on("focusout", onLoseFocus);
		} else {
			oCrosstab.getUtils().selectTextInInputField(oInputField, iSelectionStartPos, iSelectionEndPos);
		}
	};

	this.handleValueHelpClick = function (sTargetId) {
		var oCell = getCellById(sTargetId);
		if (oCell) {
			oKeyboardHandler.focusNewCell(oCell, -1, -1);
			var sCallValueHelpCommand = oCrosstab.getCallValueHelpCommand();

			var iOffset = oCrosstab.calculateOffset(oCell);

			oCrossRequestManager.saveVScrollInfo("plan");
			oCrossRequestManager.saveHScrollInfo("plan");
			oCrossRequestManager.saveColWidths();

			sCallValueHelpCommand = sCallValueHelpCommand.replace("__ROW__", oCell.getRow());
			sCallValueHelpCommand = sCallValueHelpCommand.replace("__COL__", oCell.getCol() - iOffset);
			sCallValueHelpCommand = sCallValueHelpCommand.replace("__DOM_REF_ID__", sTargetId);
			executeAction(sCallValueHelpCommand, true);
		}
	};

	this.handleInputEnabledCell = function (sTargetId, iSelectionStartPos, iSelectionEndPos) {
		if (sTargetId) {
			sTargetId = this.getCellIdFromContenDivId(sTargetId);
			if (sTargetId) {
				var oModelCell = sap.ui.getCore().getControl(sTargetId);
				if (oModelCell) {
					if (oModelCell.getArea().isDataArea() || oModelCell.getArea().isRowHeaderArea()) {
						oKeyboardHandler.focusNewCell(oModelCell, iSelectionStartPos, iSelectionEndPos);
					}
				}
			}
		}
	};

	this.sendSelectCommand = function (oCell) {
		var iRow = -1;
		var iCol = -1;
		var sAxis = "";

		if (oCell) {
			var oArea = oCell.getArea();
			// BICS values!
			if (oArea.isRowHeaderArea()) {
				sAxis = "ROWS";
			} else if (oArea.isColHeaderArea()) {
				sAxis = "COLUMNS";
			} else {
				sAxis = "DATA";
			}
			iRow = oCell.getRow();
			iCol = oCell.getCol();
		}

		var onSelectJsCommand = oCrosstab.getOnSelectCommand();
		onSelectJsCommand = onSelectJsCommand.replace("__ROW__", iRow + "");
		onSelectJsCommand = onSelectJsCommand.replace("__COL__", iCol + "");
		onSelectJsCommand = onSelectJsCommand.replace("__AXIS__", sAxis);
		executeAction(onSelectJsCommand, true);
	};
	
	this.resetColWidths = function(oCell, oUpperArea, oLowerArea) {
		var iEffectiveCol = oCell.getCol() + oCell.getColSpan() - 1;
		var iCol = 0;
		var iEndCol = oCell.getCol() + oCell.getColSpan() - oCell.getEffectiveColSpan();
		for (iCol = iEffectiveCol; iCol >= iEndCol; iCol--) {
			oUpperArea.resetColWidth(iCol);
			oLowerArea.resetColWidth(iCol);
			oUpperArea.setUserResizedCol(iCol);
			oLowerArea.setUserResizedCol(iCol);
		}
	};
	
	this.doColResize = function(oCell) {
		var oUpperArea = oCell.getArea();
		if (oUpperArea.isColHeaderArea()) {
			var oDataArea = oCrosstab.getDataArea();
			this.resetColWidths(oCell, oUpperArea, oDataArea);
		} else if (oUpperArea.isDimHeaderArea()) {
			var oRowHeaderArea = oCrosstab.getRowHeaderArea();
			this.resetColWidths(oCell, oUpperArea, oRowHeaderArea);
		}
		oCrosstab.invalidate();
	};

	this.executeOnDblClickAction = function (e) {
		var sTargetId = e.target.id;
		var sDblClickAction = getActionById(sTargetId);
		var oCell;

		if (sDblClickAction === "resi") {
			oCell = getCellById(sTargetId);
			that.doColResize(oCell);
			sap.zen.crosstab.utils.Utils.cancelEvent(e);
		}
	};

	this.rowSelectAction = function (iRow, iStartCol, oArea, fActionFunclet) {
		var iCol = 0;
		var oCell = null;
		var iColLimit = iStartCol + oArea.getRenderColCnt();

		for (iCol = iStartCol; iCol < iColLimit; iCol++) {
			oCell = oArea.getCell(iRow, iCol);
			if (oCell) {
				var oDomCell = $('#' + oCell.getId());
				if (oDomCell && oDomCell.length > 0) {
					fActionFunclet(oDomCell, oCell);
				}
			}
		}
	};

	this.colSelectAction = function (iStartRow, iCol, oArea, fActionFunclet) {
		var iRow = 0;
		var oCell = null;
		var iRowLimit = iStartRow + oArea.getRenderRowCnt();

		for (iRow = iStartRow; iRow < iRowLimit; iRow++) {
			oCell = oArea.getCell(iRow, iCol);
			if (oCell) {
				var oDomCell = $('#' + oCell.getId());
				if (oDomCell && oDomCell.length > 0) {
					fActionFunclet(oDomCell, oCell);
				}
			}
		}
	};

	this.setSelectionInfo = function (sAxis, iPos) {
		if (!oSelectedCellData) {
			oSelectedCellData = {};
			if (sAxis === "ROWS") {
				oSelectedCellData.sAreaType = sap.zen.crosstab.rendering.RenderingConstants.TYPE_ROW_HEADER_AREA;
			} else if (sAxis === "COLUMNS") {
				oSelectedCellData.sAreaType = sap.zen.crosstab.rendering.RenderingConstants.TYPE_COLUMN_HEADER_AREA;
			}
		}
		if (sAxis && oSelectedCellData) {
			if (sAxis === "ROWS") {
				if (oSelectedCellData.sAreaType === sap.zen.crosstab.rendering.RenderingConstants.TYPE_ROW_HEADER_AREA) {
					oSelectedCellData.iRow = iPos;
				} else {
					this.resetSelection();
				}
			} else if (sAxis === "COLUMNS") {
				if (oSelectedCellData.sAreaType === sap.zen.crosstab.rendering.RenderingConstants.TYPE_COLUMN_HEADER_AREA) {
					oSelectedCellData.iCol = iPos;
				} else {
					this.resetSelection();
				}
			} else {
				this.resetSelection();
			}
		} else {
			this.resetSelection();
		}
	};

	this.setSingleDataCellSelectionInfo = function (iRowPos, iColPos) {
		if (!oSelectedCellData) {
			oSelectedCellData = {};
		}
		if (iRowPos > -1 && iColPos > -1) {
			oSelectedCellData.iRow = iRowPos;
			oSelectedCellData.iCol = iColPos;
			oSelectedCellData.sAreaType = sap.zen.crosstab.rendering.RenderingConstants.TYPE_DATA_AREA;
		} else {
			this.resetSelection();
		}
	};

	this.setHighlightingInfo = function (oHlInfo) {
		oHighlightingInfo = oHlInfo;
	};

	this.getSelectedCellData = function () {
		return oSelectedCellData;
	};

	this.resetSelection = function () {
		oSelectedCellData = null;
	};

	this.setSelectedCell = function (oCell) {
		if (oCell === null) {
			oSelectedCellData = null;
		} else {
			if (!oSelectedCellData) {
				oSelectedCellData = {};
			}
			oSelectedCellData.iRow = oCell.getRow();
			oSelectedCellData.iCol = oCell.getCol();
			oSelectedCellData.sAreaType = oCell.getArea().getAreaType();
		}
	};

	this.getSelectedCell = function () {
		var oCell = null;
		if (oSelectedCellData) {
			var oArea = sap.zen.crosstab.BaseArea.getArea(oCrosstab, oSelectedCellData.sAreaType);
			if (oSelectedCellData.iCol === undefined) {
				/*
				 * if oSelectedCellData is available, but no column information is set we need to find a selectable
				 * cells column to apply the selection effect. This can occur if an application hides a Crosstab with a
				 * selected row and then shows it again.
				 */
				var iCol = oArea.getColCnt() - 1;
				while (iCol >= 0 && !oCell) {
					oCell = oArea.getCell(oSelectedCellData.iRow, iCol);
					if (oCell && !((oCell.isSelectable && oCell.isSelectable()))) {
						oCell = null;
					}
					iCol--;
				}
			} else if (oSelectedCellData.iRow === undefined) {
				/*
				 * if oSelectedCellData is available, but no row information is set we need to find a selectable cells
				 * row to apply the selection effect. This can occur if an application hides a Crosstab with a selected
				 * column and then shows it again.
				 */
				var iRow = oArea.getRowCnt() - 1;
				while (iRow >= 0 && !oCell) {
					oCell = oArea.getCell(iRow, oSelectedCellData.iCol);
					if (oCell && !((oCell.isSelectable && oCell.isSelectable()))) {
						oCell = null;
					}
					iRow--;
				}

			} else {
				oCell = oArea.getCell(oSelectedCellData.iRow, oSelectedCellData.iCol);
			}
		}
		return oCell;
	};

	this.restoreSelection = function () {
		var oCell = this.getSelectedCell();
		if (oCell
				&& ((oCell.isSelectable && oCell.isSelectable() || oCrosstab.isSingleDataCellSelection()
						&& oCell.getArea().isDataArea()) || oCell.isLoading())) {
			var oFunclets = getCellSelectFunclets(true);
			this.applySelectionEffect(oCell, oFunclets);
			this.setSelectedCell(oCell);
		} else {
			this.setSelectedCell(null);
		}
		oCurrentlyHoveredCell = null;
	};

	this.doHighlighting = function (positions, oArea, fGetCount, fGetCell) {
		var i = 0;
		var length = positions.length;
		for (i = 0; i < length; i++) {
			var oCell = null;
			var pos = positions[i].pos;
			var iCoord = fGetCount(oArea);
			while (iCoord >= 0 && !oCell) {
				oCell = fGetCell(pos, iCoord, oArea);
				if (oCell && !((oCell.isSelectable && oCell.isSelectable()))) {
					oCell = null;
				}
				iCoord--;
			}
			if (oCell) {
				this.applySelectionEffect(oCell, getCellHighlightFunclets(true));
			}
		}
	};

	this.highlightCells = function () {
		if (oHighlightingInfo) {
			var rowPositions = oHighlightingInfo.rows;
			if (rowPositions) {
				this.doHighlighting(rowPositions, oCrosstab.getRowHeaderArea(), function (oArea) {
					return oArea.getColCnt() - 1;
				}, function (pos, iCoord, oArea) {
					return oArea.getCell(pos, iCoord);
				});
			}
			var colPositions = oHighlightingInfo.cols;
			if (colPositions) {
				this.doHighlighting(colPositions, oCrosstab.getColumnHeaderArea(), function (oArea) {
					return oArea.getRowCnt() - 1;
				}, function (pos, iCoord, oArea) {
					return oArea.getCell(iCoord, pos);
				});
			}
		}
	};

	this.applySelectionEffect = function (oCell, oFunclets) {
		var oArea = oCell.getArea();
		var iRow = oCell.getRow();
		var iCol = oCell.getCol();
		var oSelectableCell = null;

		if (oArea.isRowHeaderArea()) {
			oSelectableCell = oCell;
			while (oSelectableCell && oSelectableCell.isSelectable && oSelectableCell.isSelectable() && iCol >= 0) {
				iCol--;
				if (iCol >= 0) {
					oSelectableCell = oArea.getCell(iRow, iCol);
				} else {
					oSelectableCell = null;
				}
			}
			this.rowSelectAction(iRow, iCol + 1, oArea, oFunclets.fRowHeaderCellActionFunclet);
			this.rowSelectAction(iRow, oDataArea.getRenderStartCol(), oDataArea, oFunclets.fDataCellActionFunclet);
		} else if (oArea.isColHeaderArea()) {
			oSelectableCell = oCell;
			while (oSelectableCell && oSelectableCell.isSelectable && oSelectableCell.isSelectable() && iRow >= 0) {
				iRow--;
				if (iRow >= 0) {
					oSelectableCell = oArea.getCell(iRow, iCol);
				} else {
					oSelectableCell = null;
				}
			}
			this.colSelectAction(iRow + 1, iCol, oArea, oFunclets.fColHeaderCellActionFunclet);
			this.colSelectAction(oDataArea.getRenderStartRow(), iCol, oDataArea, oFunclets.fDataCellActionFunclet);
		} else if (oArea.isDataArea()) {
			// Data selection mode: highlight the single cell itself
			if (oCell) {
				var oDomCell = $('#' + oCell.getId());
				if (oDomCell && oDomCell.length > 0) {
					oFunclets.fDataCellActionFunclet(oDomCell, oCell);
				}
			}
		}
	};

	function getParentSelectableCell (e) {
		var oSelectableCell = null;
		var i = 0;
		var oCell = sap.ui.getCore().getControl(e.target.id);
		var oDomCell = null;
		var sCellId = null;

		if (oCell && (oCell.isSelectable && oCell.isSelectable() || oCrosstab.isSingleDataCellSelection())) {
			oSelectableCell = oCell;
		} else {
			// see if we have a selectable cell as parent
			var aParentCells = $(e.target).parents("td");
			if (aParentCells) {
				for (i = 0; i < aParentCells.length; i++) {
					oDomCell = $(aParentCells[i]);
					sCellId = oDomCell.attr("id");
					if (sCellId && sCellId.length > 0) {
						oCell = sap.ui.getCore().getControl(sCellId);
						if (oCell
								&& (oCell.isSelectable && oCell.isSelectable() || oCrosstab.isSingleDataCellSelection())) {
							oSelectableCell = oCell;
							break;
						}
					}
				}
			}
		}
		return oSelectableCell;
	}

	this.executeOnMouseEnter = function (e) {
		if (!oCurrentlyHoveredCell) {
			if (!oCrosstab.isSingleDataCellSelection()) {
				oCurrentlyHoveredCell = getParentSelectableCell(e);
			} else if (oCrosstab.isSingleDataCellSelection() === true) {
				var oCell = getParentSelectableCell(e);
				if (oCell && oCell.getArea().isDataArea()) {
					oCurrentlyHoveredCell = oCell;
				}
			}
			if (oCurrentlyHoveredCell) {
				var oFunclets = getCellHoverFunclets(true);
				that.applySelectionEffect(oCurrentlyHoveredCell, oFunclets);
				sap.zen.crosstab.utils.Utils.cancelEvent(e);
			}
		}
	};

	this.removeHoverEffect = function () {
		if (oCurrentlyHoveredCell) {
			var oFunclets = getCellHoverFunclets(false);
			that.applySelectionEffect(oCurrentlyHoveredCell, oFunclets);
			oCurrentlyHoveredCell = null;
		}
	};

	this.executeOnMouseOut = function (e) {
		if (oCurrentlyHoveredCell) {
			var oDomMoveTarget = e.toElement || e.relatedTarget;
			var oDomMoveSrc = e.target;
			var oFoundCell = null;
			var oCell = sap.ui.getCore().getControl(e.target.id);
			var oDomCell = null;
			var bRemoveHoverEffect = false;

			if (oCell
					&& (oCell.isSelectable && oCell.isSelectable() || oCrosstab.isSingleDataCellSelection()
							&& oCell.getArea().isDataArea())) {
				if (oCell === oCurrentlyHoveredCell) {
					oFoundCell = $(oDomMoveSrc).find($(oDomMoveTarget));
					if (!(oFoundCell && oFoundCell.length > 0)) {
						bRemoveHoverEffect = true;
					}
				}
			} else {
				// we don't have a selectable (i. e. hoverable) cell directly.
				// See if it is something that is
				// a) starts contained in the currently hovered cell
				// b) and is moving out of the currently hovered cell
				oDomCell = $('#' + oCurrentlyHoveredCell.getId());
				oFoundCell = oDomCell.find($(oDomMoveSrc));
				if (oFoundCell && oFoundCell.length > 0) {
					// check target
					oFoundCell = oDomCell.find($(oDomMoveTarget));
					if (!(oFoundCell && oFoundCell.length > 0)) {
						bRemoveHoverEffect = true;
					}
				}
			}
			if (bRemoveHoverEffect) {
				that.removeHoverEffect();
				sap.zen.crosstab.utils.Utils.cancelEvent(e);
			}
		}
	};

	function getCellHoverFunclets (bHover) {
		var oFunclets = {};
		if (bHover) {
			oFunclets.fDataCellActionFunclet = function (oDomCell, oCell) {
				oDomCell.addClass('sapzencrosstab-HoverDataCell');
				if (oDomCell.hasClass('sapzencrosstab-HighlightDataCell')) {
					oDomCell.removeClass('sapzencrosstab-HighlightDataCell');
					oCell.bRestoreHighlight = true;
				}
			};
			oFunclets.fRowHeaderCellActionFunclet = function (oDomCell, oCell) {
				oDomCell.addClass('sapzencrosstab-HoverRowHeaderCell');
				if (oDomCell.hasClass('sapzencrosstab-HighlightRowHeaderCell')) {
					oDomCell.removeClass('sapzencrosstab-HighlightRowHeaderCell');
					oCell.bRestoreHighlight = true;
				}
			};
			oFunclets.fColHeaderCellActionFunclet = function (oDomCell, oCell) {
				oDomCell.addClass('sapzencrosstab-HoverColHeaderCell');
				if (oDomCell.hasClass('sapzencrosstab-HighlightColHeaderCell')) {
					oDomCell.removeClass('sapzencrosstab-HighlightColHeaderCell');
					oCell.bRestoreHighlight = true;
				}
			};
		} else {
			oFunclets.fDataCellActionFunclet = function (oDomCell, oCell) {
				oDomCell.removeClass('sapzencrosstab-HoverDataCell');
				if (oCell.bRestoreHighlight === true) {
					oCell.bRestoreHighlight = false;
					oDomCell.addClass('sapzencrosstab-HighlightDataCell');
				}
			};
			oFunclets.fRowHeaderCellActionFunclet = function (oDomCell, oCell) {
				oDomCell.removeClass('sapzencrosstab-HoverRowHeaderCell');
				if (oCell.bRestoreHighlight === true) {
					oCell.bRestoreHighlight = false;
					oDomCell.addClass('sapzencrosstab-HighlightRowHeaderCell');
				}
			};
			oFunclets.fColHeaderCellActionFunclet = function (oDomCell, oCell) {
				oDomCell.removeClass('sapzencrosstab-HoverColHeaderCell');
				if (oCell.bRestoreHighlight === true) {
					oCell.bRestoreHighlight = false;
					oDomCell.addClass('sapzencrosstab-HighlightColheaderCell');
				}
			};
		}
		return oFunclets;
	}

	function getCellSelectFunclets (bSelect) {
		var oFunclets = {};
		if (bSelect) {
			oFunclets.fDataCellActionFunclet = function (oDomCell, oCell) {
				oDomCell.addClass('sapzencrosstab-SelectDataCell');
				oDomCell.removeClass('sapzencrosstab-HighlightDataCell');
				oCell.bRestoreHighlight = false;
			};
			oFunclets.fRowHeaderCellActionFunclet = function (oDomCell, oCell) {
				oDomCell.addClass('sapzencrosstab-SelectRowHeaderCell');
				oDomCell.removeClass('sapzencrosstab-HighlightRowHeaderCell');
				oCell.bRestoreHighlight = false;
			};
			oFunclets.fColHeaderCellActionFunclet = function (oDomCell, oCell) {
				oDomCell.addClass('sapzencrosstab-SelectColHeaderCell');
				oDomCell.removeClass('sapzencrosstab-HighlightColHeaderCell');
				oCell.bRestoreHighlight = false;
			};
		} else {
			oFunclets.fDataCellActionFunclet = function (oDomCell, oCell) {
				oDomCell.removeClass('sapzencrosstab-SelectDataCell');
			};
			oFunclets.fRowHeaderCellActionFunclet = function (oDomCell, oCell) {
				oDomCell.removeClass('sapzencrosstab-SelectRowHeaderCell');
			};
			oFunclets.fColHeaderCellActionFunclet = function (oDomCell, oCell) {
				oDomCell.removeClass('sapzencrosstab-SelectColHeaderCell');
			};
		}
		return oFunclets;
	}

	function getCellHighlightFunclets (bHighlight) {
		var oFunclets = {};
		if (bHighlight) {
			oFunclets.fDataCellActionFunclet = function (oDomCell, oCell) {
				oDomCell.addClass('sapzencrosstab-HighlightDataCell');
			};
			oFunclets.fRowHeaderCellActionFunclet = function (oDomCell, oCell) {
				oDomCell.addClass('sapzencrosstab-HighlightRowHeaderCell');
			};
			oFunclets.fColHeaderCellActionFunclet = function (oDomCell, oCell) {
				oDomCell.addClass('sapzencrosstab-HighlightColHeaderCell');
			};
		} else {
			oFunclets.fDataCellActionFunclet = function (oDomCell, oCell) {
				oDomCell.removeClass('sapzencrosstab-HighlightDataCell');
			};
			oFunclets.fRowHeaderCellActionFunclet = function (oDomCell, oCell) {
				oDomCell.removeClass('sapzencrosstab-HighlightRowHeaderCell');
			};
			oFunclets.fColHeaderCellActionFunclet = function (oDomCell, oCell) {
				oDomCell.removeClass('sapzencrosstab-HighlightColHeaderCell');
			};
		}
		return oFunclets;
	}

	this.attachEvents = function () {
		var oDomRenderSizeDiv = $("#" + oCrosstab.getId() + "_renderSizeDiv");

		oDomRenderSizeDiv.unbind("dblclick");
		oDomRenderSizeDiv.bind("dblclick", this.executeOnDblClickAction);

		oDomRenderSizeDiv.unbind("mousedown");
		oDomRenderSizeDiv.bind("mousedown", this.executeOnMouseDown);

		if (oCrosstab.getPropertyBag().isMobileMode() || oCrosstab.getPropertyBag().isTestMobileMode()) {
			oDomRenderSizeDiv.unbind('click');
			oDomRenderSizeDiv.bind('click', function (e) {
				sap.zen.crosstab.utils.Utils.cancelEvent(e);
			});

			oDomRenderSizeDiv.unbind('mousedown');
			oDomRenderSizeDiv.bind('mousedown', function (e) {
				sap.zen.crosstab.utils.Utils.cancelEvent(e);
			});

			oTouchHandler = new sap.zen.crosstab.TouchHandler(this, oCrosstab);
			oTouchHandler.registerTouchEvents(oDomRenderSizeDiv);
			
			oKeyboardHandler.setEnabled(false);
		} else {
			oDomRenderSizeDiv.unbind("mouseup", this.executeOnMouseUp);
			oDomRenderSizeDiv.bind("mouseup", this.executeOnMouseUp);

			oDomRenderSizeDiv.unbind('click');
			oDomRenderSizeDiv.bind('click', this.executeOnClickAction);
			if (oCrosstab.getPropertyBag().isSelectionEnabled()) {
				oDomRenderSizeDiv.unbind('mouseover');
				oDomRenderSizeDiv.bind('mouseover', this.executeOnMouseEnter);

				oDomRenderSizeDiv.unbind('mouseout');
				oDomRenderSizeDiv.bind('mouseout', this.executeOnMouseOut);
			}
			// CHANGE THE FOLLOWING CALL TO DISABLE KEYBOARD HANDLER: single point of entry
			oKeyboardHandler.setEnabled(isPlanningMode());
			oKeyboardHandler.attachEvents(oDomRenderSizeDiv);
		}
	};
	
	this.executeOnMouseDown = function (e) {
		var sTargetId = e.target.id;
		var sClickAction = getActionById(sTargetId);

		if (sClickAction === "resi") {
			sap.zen.crosstab.utils.Utils.cancelEvent(e);
		} else {
			sMouseDownTargetId = sTargetId;
		}
	};

	function isPlanningMode () {
		return (oCrosstab.getTransferDataCommand() && oCrosstab.getTransferDataCommand() !== "");
	}

	function checkMouseUpInSameCell (sCellId, e) {
		var bInSameCell = false;
		var oDomCell = $('#' + sCellId)[0];
		if (oDomCell) {
			var oRect = oDomCell.getBoundingClientRect();
			var bHMatches = (oRect.left < e.clientX) && (e.clientX < oRect.right);
			var bVMatches = (oRect.bottom > e.clientY) && (e.clientY > oRect.top);
			bInSameCell = bHMatches && bVMatches;
		}
		return bInSameCell;
	}

	this.executeOnMouseUp = function (e) {
		bPreventClickAction = false;
		if (sMouseDownTargetId) {
			var sCellId = that.getCellIdFromContenDivId(sMouseDownTargetId);
			// prevent action during multiple selection of cells. Make sure we stay in the same cell
			if (checkMouseUpInSameCell(sCellId, e)) {
				var oCell = sap.ui.getCore().getControl(sCellId);
				if (oCell) {
					if (isPlanningMode()) {
						var oDomContainerDiv = $('#' + sMouseDownTargetId)[0];
						var oPositions = null;
						if (oDomContainerDiv) {
							oPositions = oCrosstab.getUtils().getSelectionParams(oDomContainerDiv);
						}
						if (oPositions.iSelectionStartPos >= 0 || oPositions.iSelectionEndPos >= 0) {
							bPreventClickAction = true;
							that.handleInputEnabledCell(e.target.id, oPositions.iSelectionStartPos,
									oPositions.iSelectionEndPos);
						}
					}
				}
			} else {
				sap.zen.crosstab.utils.Utils.cancelEvent(e);
				sap.zen.crosstab.utils.Utils.stopEventPropagation(e);
				bPreventClickAction = true;
			}
		}
	};

	this.restoreFocusOnCell = function () {
		oKeyboardHandler.restoreFocusOnCell();
	};

	function getActionById (sId) {
		var sAction = sId.slice(0, 4);
		return sAction;
	}

	function getCellById (sId) {
		var sCellId = sId.slice(5);
		return sap.ui.getCore().getControl(sCellId);
	}

	function executeAction (sAction, bDontShowLoading) {
		if (sAction) {
			if (!bDontShowLoading) {
				// oCrosstab.showLoadingIndicator();
			}
			var fAction = new Function(sAction);
			fAction();
		}
	}

};