/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2014 SAP SE. All rights reserved
 */

jQuery.sap.declare("sap.uiext.inbox.model.InboxListBinding");

jQuery.sap.require("sap.ui.model.odata.ODataListBinding");

sap.ui.model.odata.ODataListBinding.extend("sap.uiext.inbox.model.InboxListBinding", {
    filter: function(aFilters, sFilterType) {
    	//In our case we have one model - bound to both RowRepeater and Table.
    	//On refresh all the bindings are reset. So the aKeys and iLength property are reset to an empty array and 0.
    	//But in case of Table, updateRows is called on refresh on binding but an explicit call to get data for this binding will be done only in case the table has a 
    	//DomRef. But not in case of RowRepeater.RowRepeater updateRows makes a call to loadData even if not yet rendered.
    	//So in case of refresh while in RowRepeater view , one can see only one call. But on refresh from the Table view, there are two calls.
    	//So this hack is : When refresh is made from the RRview, and then there is a switch to table view: we do not have the aKeys and iLength for table binding.
    	//Also, since we already have the data we need not make a call to the server, rather reset the state and apply filter on it. The bRefreshDirty flag state is maintained for this reason.
    	//Along with the above properties on refresh of binding the bLengthFinal flag is set to false. When this is false, the mdoel makes a call to the server.
    	//As we will be working on the local Data by resetting the state, we mark this flag also as true.
    	if(this.bRefreshDirty){
    		this.bLengthFinal = true;
    	}
		if(!this.bStateSaved && !this.bRefreshDirty){
			this.saveState()
		}else{
			this.resetState();
		}
        
        if (!aFilters) {
            aFilters = [];
        }
        
        if (aFilters instanceof sap.ui.model.Filter) {
            aFilters = [aFilters];
        }
        
        if (sFilterType == sap.ui.model.FilterType.Application) {
            this.aApplicationFilters = aFilters;
        } else {
            this.aFilters = aFilters;
        }
        
        aFilters = this.aFilters.concat(this.aApplicationFilters);
        
        if (!aFilters || !jQuery.isArray(aFilters) || aFilters.length == 0) {
            this.aFilters = [];
            this.aApplicationFilters = [];
        }
        //this.createFilterParams(aFilters);
        //Inbox specific coding
        //if(/*this.sFilterParams.indexOf('TaskDefinitionID') !== -1 || */this.sFilterParams.indexOf('Status%20eq%20%27COMPLETED%27') !== -1){
        
        //In case of Completed Tasks view, we make explicit calls to the server all the time.
        //Hence in this case, we leverage on the createFilterParams method to create the correct OData URI and resetData , so that a call is made to the server.
        
        if(this._hasFilter(aFilters,'Status','EQ','COMPLETED') || this._hasFilter(aFilters,'SubstitutedUser','EQ')){
        	this.createFilterParams(aFilters);
        	this.resetData();
        }else{
        	this.applyFilter();
        	this.applySort();
        	//Inbox specific coding
        	var sUrl = this.oModel.sServiceUrl + this.sPath;
        	this.oModel.fireRequestCompleted({url : sUrl});
        }
		if (this.bInitialized) {
            if (this.oRequestHandle) {
                this.oRequestHandle.abort();
                this.oRequestHandle = null;
                this.bPendingRequest = false;
            }
            this._fireChange({reason: sap.ui.model.ChangeReason.Filter});
            // TODO remove this if the filter event gets removed which is now deprecated
            if (sFilterType == sap.ui.model.FilterType.Application) {
                this._fireFilter({filters: this.aApplicationFilters});
            } else {
                this._fireFilter({filters: this.aFilters});
            }
}
        
        return this;
    
    },
    
    sort : function(aSorters) {
		
    	
    	if(!this.bStateSaved){
    			this.saveState()
    		}else{
    			this.resetState();
    			
    		}
    		
    		//if(!aSorters){
    			this.applyFilter();
    		//}
    		
    	if (aSorters instanceof sap.ui.model.Sorter) {
    		aSorters = [aSorters];
    	}
    	
    	this.aSorters = aSorters;
    	this.createSortParams(aSorters);
    	//this.aKeys = [];
    	this.applySort();

    	if (this.bInitialized) {
    		if (this.oRequestHandle) {
    			this.oRequestHandle.abort();
    			this.oRequestHandle = null;
    			this.bPendingRequest = false;
    		}
    		this._fireChange({ reason : sap.ui.model.ChangeReason.Sort });
    		// TODO remove this if the sort event gets removed which is now deprecated
    		this._fireSort({sorter: aSorters});
    	}
    	return this;
    },
    
    loadData : function(iStartIndex, iLength) {

    	var that = this;

    	// create range parameters and store start index for sort/filter requests
    	if (iStartIndex || iLength) {
    		this.sRangeParams = "$skip=" + iStartIndex + "&$top=" + iLength;
    		this.iStartIndex = iStartIndex;
    	}
    	else {
    		iStartIndex = this.iStartIndex;
    	}

    	// create the request url
    	var aParams = [];
    	if (this.sRangeParams) { 
    		aParams.push(this.sRangeParams);
    	}
    	if (this.sSortParams) {
    		aParams.push(this.sSortParams);
    	}
    	//add here status ne 'Completed'
    	//Ignore all filters and make a call to the complete set of Open Tasks always.
    	if(this._hasFilter(this.aFilters.concat(this.aApplicationFilters),'Status','NE','COMPLETED') && !this._hasFilter(this.aFilters.concat(this.aApplicationFilters),'SubstitutedUser','EQ')){
    		aParams.push("$filter=Status%20ne%20%27COMPLETED%27");
    	}else if (this.sFilterParams) {
    		aParams.push(this.sFilterParams);
    	}
    	if (this.sCustomParams) {
    		aParams.push(this.sCustomParams);
    	}
    	aParams.push("$inlinecount=allpages");

    	function fnSuccess(oData) {

    		// Collecting contexts
    		jQuery.each(oData.results, function(i, entry) {
    			that.aKeys[iStartIndex + i] = that.oModel._getKey(entry);
    		});

    		// update iLength (only when the inline count is available)
    		if (oData.__count) {
    			that.iLength = parseInt(oData.__count, 10);
    			that.bLengthFinal = true;
    		}

    		// if we got data and the results + startindex is larger than the
    		// length we just apply this value to the length
    		if (that.iLength < iStartIndex + oData.results.length) {
    			that.iLength = iStartIndex + oData.results.length;
    			that.bLengthFinal = false;
    		}

    		// if less entries are returned than have been requested
    		// set length accordingly
    		if (oData.results.length < iLength || iLength === undefined) {
    			that.iLength = iStartIndex + oData.results.length;
    			that.bLengthFinal = true;
    		}

    		// check if there are any results at all...
    		if (oData.results.length == 0) {
    			that.iLength = 0;
    			that.bLengthFinal = true;
    		}
    		
    		that.oRequestHandle = null;
    		that.bPendingRequest = false;
    		
    		//On Refresh / call made for the first time for the binding, make, on success save the state.
    		//But save the state only for Open Tasks. In case of Completed tasks, just reset the flag.
    		if(!that.bStateSaved){
    			if(that._hasFilter(that.aFilters.concat(that.aApplicationFilters),'Status','EQ','COMPLETED') || that._hasFilter(that.aFilters.concat(that.aApplicationFilters),'SubstitutedUser','EQ')){
    				that.bStateSaved = true;
    			}else{
    				that.saveState();
    			}
    		}
    		if(that.bRefreshDirty){
    			that.bRefreshDirty = false
    		}
    		if(that.sPath === '/TaskCollection'){
    			that.applyFilter();
    			that.applySort();
    		}
    		that.fireDataReceived();
    	}
    	
    	function fnError(oError) {
    		that.oRequestHandle = null;
    		that.bPendingRequest = false;
    		that.fireDataReceived();
    	}
    	
    	function fnUpdateHandle(oHandle) {
    		that.oRequestHandle = oHandle;
    	}
    	
    	var sPath = this.sPath,
    		oContext = this.oContext;
    		
    	if (this.isRelative()) {
    		sPath = this.oModel.resolve(sPath,oContext);
    	}
    	if (sPath) {
    		this.bPendingRequest = true;
    		// execute the request and use the metadata if available
    		this.fireDataRequested();
    		this.oModel._loadData(sPath, aParams, fnSuccess, fnError, false, fnUpdateHandle);
    	}

    }
});
	
//Save the complete state of the binding
sap.uiext.inbox.model.InboxListBinding.prototype.saveState = function() {
	this.oModel._temp_oData = this.oModel.oData;
	this._temp_aKeys = this.aKeys;
	this.bStateSaved = true;
};

//reset the complete state of the binding.
sap.uiext.inbox.model.InboxListBinding.prototype.resetState = function() {
	this.oModel.oData = this.oModel._temp_oData;
	//this case typically happens: witching views with Completed Tasks for the first time when binding is not availoable yet.
	//For Completed Tasks, as we know, we do not save the state, and the first binding has happened with the Completed tasks.
	//So in this case this._temp_aKeys is undefined. But, this.oModel.oData is not undefined as the aggregation binding for another view has already happened.
	//So we can reuse this data (as we get the complete set of data) and create keys out of it.
	
	if(this.oModel.oData && !this._temp_aKeys){
		var that = this;
		that._temp_aKeys = [];
		jQuery.each(this.oModel.oData, function(i, entry) {
			that._temp_aKeys.push(that.oModel._getKey(entry));
		});
	}
	this.aKeys = this._temp_aKeys;
	
    this.iLength = this.aKeys.length;
	//this.bLengthFinal = true;
};
	
//takes care of local Filter
sap.uiext.inbox.model.InboxListBinding.prototype.applyFilter = function(){
	if (!this.aFilters) {
		return;
	}
	var that = this,
		oFilterGroups = {},
		aFilterGroup,
		aFiltered = [],
		bGroupFiltered = false,
		bFiltered = true,
		aFilters = this.aFilters.concat(this.aApplicationFilters);

	jQuery.each(aFilters, function(j, oFilter) {
		if (oFilter.sPath) {
			aFilterGroup = oFilterGroups[oFilter.sPath];
			if (!aFilterGroup) {
				aFilterGroup = oFilterGroups[oFilter.sPath] = [];
			}
		} else {
			aFilterGroup = oFilterGroups["__multiFilter"];
			if (!aFilterGroup) {
				aFilterGroup = oFilterGroups["__multiFilter"] = [];
			}
		}
		aFilterGroup.push(oFilter);
	});
	jQuery.each(this.aKeys, function(i, iIndex) {
		bFiltered = true;
		jQuery.each(oFilterGroups, function(sPath, aFilterGroup) {
			if (sPath !== "__multiFilter") {
				var oValue = that.oModel.getProperty(sPath, that.oModel.getContext('/'+iIndex));
				//var oValue = that.oModel.getProperty(sPath, that.oModel.mContexts['/' + iIndex]);
				//var oValue = that.oModel.getProperty(sPath, that.oModel.oData[iIndex]);
				if (typeof oValue == "string") {
					oValue = oValue.toUpperCase();
				}
				bGroupFiltered = false;
				jQuery.each(aFilterGroup, function(j, oFilter) {
					var fnTest = that.getFilterFunction(oFilter);
					if (oValue != undefined && fnTest(oValue)) {
						bGroupFiltered = true;
						return false;
					}
				});
			} else {
				bGroupFiltered = false;
				jQuery.each(aFilterGroup, function(j, oFilter) {
					bGroupFiltered = that._resolveMultiFilter(oFilter, iIndex);
					if (bGroupFiltered) {
						return false;
					}
				});
			}
			if (!bGroupFiltered) {
				bFiltered = false;
				return false;
			}
		});
		if (bFiltered) {
			aFiltered.push(iIndex);
		}
	});
	this.aKeys = aFiltered;
	this.iLength = aFiltered.length;
};
	
sap.uiext.inbox.model.InboxListBinding.prototype.getFilterFunction = function(oFilter){
	if (oFilter.fnTest) {
		return oFilter.fnTest;
	}
	
	//TODO: Impl is very specific to Inbox here (for Due date Filter)
	if (oFilter instanceof sap.ui.model.odata.Filter) {
		var oLessEqualValue, oGreaterEqualValue;
		if (oFilter.aValues.length > 1 && oFilter.bAND) {
			jQuery.each(oFilter.aValues, function(i, oFilterSegment) {
					if(oFilterSegment.operator === 'LE'){
						oLessEqualValue = oFilterSegment.value1;
					}else if(oFilterSegment.operator === 'GE'){
						oGreaterEqualValue = oFilterSegment.value1;
					}
			});
			if(oLessEqualValue && oGreaterEqualValue){
				oFilter.fnTest = function(value) { return (value >= oGreaterEqualValue) && (value <= oLessEqualValue); }; 
				return oFilter.fnTest;
			}
		}
	}//TODO: Impl is very specific to Inbox : End
	
	var oValue1 = oFilter.oValue1,
		oValue2 = oFilter.oValue2;
	if (typeof oValue1 == "string") {
		oValue1 = oValue1.toUpperCase();
	}
	if (typeof oValue2 == "string") {
		oValue2 = oValue2.toUpperCase();
	}
	switch (oFilter.sOperator) {
		case "EQ":
			//This is also a Hack, because in case of TaskDefinitionID, the value is encoded. Decode it while making local filter.
			//In other cases, keep the default.
			oFilter.fnTest = function(value) { 
									if(typeof value == "string"){
										return decodeURIComponent(value) == oValue1;
									}else{
										return value == oValue1;
									} 
							 }; 
			break;
		case "NE":
			oFilter.fnTest = function(value) { return value != oValue1; }; break;
		case "LT":
			//inbox specific coding
			oFilter.fnTest = function(value) { if(value){return value < oValue1;} return false; }; break;
		case "LE":
			oFilter.fnTest = function(value) { return value <= oValue1; }; break;
		case "GT":
			oFilter.fnTest = function(value) { return value > oValue1; }; break;
		case "GE":
			oFilter.fnTest = function(value) { return value >= oValue1; }; break;
		case "BT":
			oFilter.fnTest = function(value) { return (value >= oValue1) && (value <= oValue2); }; break;
		case "Contains":
			oFilter.fnTest = function(value) {
				if (typeof value != "string") {
					throw new Error("Only \"String\" values are supported for the FilterOperator: \"Contains\".");
				}
				return value.indexOf(oValue1) != -1; 
			}; 
			break;
		case "StartsWith":
			oFilter.fnTest = function(value) { 
				if (typeof value != "string") {
					throw new Error("Only \"String\" values are supported for the FilterOperator: \"StartsWith\".");
				}
				return value.indexOf(oValue1) == 0; 
			}; 
			break;
		case "EndsWith":
			oFilter.fnTest = function(value) { 
				if (typeof value != "string") {
					throw new Error("Only \"String\" values are supported for the FilterOperator: \"EndsWith\".");
				}
				var iPos = value.indexOf(oValue1);
				if (iPos == -1){
					return false;					
				}
				return iPos == value.length - new String(oFilter.oValue1).length; 
			}; 
			break;
		default:
			oFilter.fnTest = function(value) { return true; };
	}
	return oFilter.fnTest;
};
	
//takes care of Local sort	
sap.uiext.inbox.model.InboxListBinding.prototype.applySort = function(){
	var that = this,
	aSortValues = [],
	aCompareFunctions = [],
	oValue,
	oSorter;

if (!this.aSorters || this.aSorters.length == 0) {
	return;
}


for(var j=0; j<this.aSorters.length; j++) {
	oSorter = this.aSorters[j];
	aCompareFunctions[j] = oSorter.fnCompare;
	
	if (!aCompareFunctions[j]) {
		aCompareFunctions[j] = function(a, b) {
			if (b == null) {
				return -1;
			}
			if (a == null) {
				return 1;
			}
			if (typeof a == "string" && typeof b == "string") {
				return a.localeCompare(b);
			}
			if (a < b) {
				return -1;
			}
			if (a > b) {
				return 1;
			}
			return 0;
		}
	}
	jQuery.each(this.aKeys, function(i, iIndex) {
		//oValue = that.oModel.getProperty(oSorter.sPath, that.oModel.mContexts['/' + iIndex]);
		if(oSorter.sPath.indexOf('CustomAttributeData') !== -1){
			var aCustomAttrKeys = that.oModel.getProperty('CustomAttributeData', that.oModel.getContext('/'+iIndex));
			var sCustomAttributeName = oSorter.sPath.replace('CustomAttributeData/','');
			if(aCustomAttrKeys && aCustomAttrKeys.length > 0){
				var sCustomAttributeKey;
				jQuery.each(aCustomAttrKeys, function(i, key) {
	    			if(key.indexOf("Name='"+sCustomAttributeName+"'") !== -1){
	    				sCustomAttributeKey = key;
	    				return false;
	    			}
	    		});
			}
			if(sCustomAttributeKey && that.oModel.oData){
				oValue = that.oModel.oData[sCustomAttributeKey].Value;
			}
		}else{
			oValue = that.oModel.getProperty(oSorter.sPath, that.oModel.getContext('/'+iIndex));
		}
		if (typeof oValue == "string") {
			oValue = oValue.toLocaleUpperCase();
		}
		if (!aSortValues[j]) {
			aSortValues[j] = [];
		}
		aSortValues[j][iIndex] = oValue;
	});
}

this.aKeys.sort(function(a, b) {
	var valueA = aSortValues[0][a],
		valueB = aSortValues[0][b];
	
	return that._applySortCompare(a, b, valueA, valueB, aSortValues, aCompareFunctions, 0);
});
};
	
	
sap.uiext.inbox.model.InboxListBinding.prototype._applySortCompare = function(a, b, valueA, valueB, aSortValues, aCompareFunctions, iDepth){
	var oSorter = this.aSorters[iDepth],
		fnCompare = aCompareFunctions[iDepth],
		returnValue;

	returnValue = fnCompare(valueA, valueB);
	if (oSorter.bDescending) {
		returnValue = -returnValue;
	}
	if (returnValue == 0 && this.aSorters[iDepth + 1]) {
		valueA = aSortValues[iDepth + 1][a],
		valueB = aSortValues[iDepth + 1][b];
		returnValue = this._applySortCompare(a, b, valueA, valueB, aSortValues, aCompareFunctions, iDepth + 1);
	}
	return returnValue;
};	


//On refresh  maintain flags. bStateSaved = false, so that of needed the state is saved on succesful response.
//bRefreshDirty, because on Model refresh, all bindings for this model are refreshed.
sap.uiext.inbox.model.InboxListBinding.prototype.refresh = function(bForceUpdate) {
	this.bStateSaved = false;
	this.bRefreshDirty = true;
	sap.ui.model.odata.ODataListBinding.prototype.refresh.apply(this, arguments);
};

//Utility method to check if a particul filter is applied.
sap.uiext.inbox.model.InboxListBinding.prototype._hasFilter = function(aFilters, sPath, sOperator, oValue1, oValue2) {
	var bFilterPathFound = false;
	if(aFilters && aFilters.length > 0){
		//group filters by path
		jQuery.each(aFilters, function(j, oFilter) {
			if (oFilter.sPath === sPath && oFilter.sOperator === sOperator) {
				if(oValue1){
					if(oFilter.oValue1 === oValue1){
						bFilterPathFound = true;
						return false;
					}
				}else{
					bFilterPathFound = true;
					return false;
				}
			} 
		});
	}
	return bFilterPathFound;
};