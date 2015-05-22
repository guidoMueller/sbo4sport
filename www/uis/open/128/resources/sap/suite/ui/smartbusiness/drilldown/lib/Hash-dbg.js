jQuery.sap.declare("sap.suite.ui.smartbusiness.drilldown.lib.Hash");
sap.suite = sap.suite || {};
sap.suite.smartbusiness = sap.suite.smartbusiness || {};
sap.suite.smartbusiness.url = sap.suite.smartbusiness.url || {};
sap.suite.smartbusiness.url.hash = (function() {
	var oldHash = null;
	var newHash = null;
	var semanticObject=null,action=null,startupParams=null,applicationParams=null;
	var HASH=null;
	var delimiter="|^",escapedDelimiter=/\|\^/g;
	function reset() {
		semanticObject = null,action=null,startupParams=null,applicationParams=null;
		HASH = null;
	}
	function getApplicationParams(paramsStr) {
		var obj= {};
		if(paramsStr) {
			var slashSplits = paramsStr.split("/");
			for(var i = 1;i < slashSplits.length;i++) {
				var each = slashSplits[i];
				var keyValue = each.split("=");
				if(obj[keyValue[0]]) {
				} else {
					obj[keyValue[0]] = [];
				}
				if(keyValue[1]) {
					var values = decodeURIComponent(keyValue[1]).split(",");
					var arrays = obj[keyValue[0]];
					for(var j=0;j<values.length;j++) {
						if(arrays.indexOf(values[j]) == -1) {
							values[j]=values[j].replace(escapedDelimiter,",");
							arrays.push(values[j]);
						}
					}
				}
			}
		}
		return obj;
	}
	function getStartupParams(paramsStr) {
		var obj= {};
		if(paramsStr) {
			var splits = paramsStr.split("&");
			for(var i = 0;i < splits.length;i++) {
				var each = splits[i];
				var keyValue = each.split("=");
				if(obj[keyValue[0]]) {
				} else {
					obj[keyValue[0]] = [];
				}
				var arrays = obj[keyValue[0]];
				if(arrays.indexOf(keyValue[1])==-1) {
					arrays.push(keyValue[1]);
				}
			}
		}
		return obj;
	}
	function parseHash(newHash) {
		newHash = newHash || window.location.hash;
		if(newHash) {
			var regex = /^(?:#|)([\S\s]*?)(&\/[\S\s]*)?$/;
			var parts = regex.exec(newHash);
			var part1 = parts[1];
			var part2  = parts[2];
			var regex2 = /^([A-Za-z0-9_]+)-([A-Za-z0-9_]+)[\?]?(.*)/;
			if(part1) {
				var semanticParts = regex2.exec(part1);
				semanticObject = semanticParts[1];
				action = semanticParts[2];
				startupParams = getStartupParams(semanticParts[3]);
			}
			applicationParams = getApplicationParams(part2);
		}
	}
	function __checkAndUpdateHash() {

	};
	if(window.addEventListener) {
//		window.addEventListener("hashchange", function(oEvent) {
//			oldHash = "#"+oEvent.oldURL.split("#")[1];
//			newHash = window.location.hash;
//			reset();
//			parseHash(newHash);
//		});
	}
	function prepareHash() {
		var str = "";
		if(semanticObject) {
			str+=semanticObject;
		}
		if(action && semanticObject) {
			str+="-"+action;
		}
		if(startupParams) {
			str+="?";
			for(var each in startupParams) {
				var params = startupParams[each];
				for(var i=0;i<params.length;i++) {
					str+=each+"="+params[i]+"&";
				}
			}
			str=str.substring(0,str.length-1);
		}
		if(applicationParams) {
			var params = "";
			for(var each in applicationParams) {
				if(applicationParams[each] instanceof Array){
					applicationParams[each].forEach(function(s,i,a){
						a[i]=(s+"").replace(/,/g,delimiter);
					});
				}
				params+=each+"="+encodeURIComponent(applicationParams[each])+"/";
			}
			if(params.length) {
				params = params.substring(0,params.length-1);
				params = "&/"+params;
			}
			str+=params;
		}
		return str;
	};
	function getHash() {
	    return prepareHash();
	};
	function updateHash() {
		var str = prepareHash();
		window.location.hash = str;
		HASH = str;
		parseHash();
	}
	parseHash();
	function updateSemanticObject(sObject, bUpdateUrl) {
		if(typeof bUpdateUrl=='undefined') {
			bUpdateUrl = true;
		}
		bUpdateUrl = !!bUpdateUrl;
		semanticObject = sObject;
		if(bUpdateUrl) {
			updateHash();
		}
	}
	function updateAction(actionStr, bUpdateUrl) {
		if(typeof bUpdateUrl=='undefined') {
			bUpdateUrl = true;
		}
		bUpdateUrl = !!bUpdateUrl;
		action = actionStr;
		if(bUpdateUrl) {
			updateHash();
		}
	}
	function setStartupParameters(params, bUpdateUrl) {
		if(typeof bUpdateUrl=='undefined') {
			bUpdateUrl = true;
		}
		bUpdateUrl = !!bUpdateUrl;
		startupParams = params;
		if(bUpdateUrl) {
			updateHash();
		}
	}
	function removeStartupParameter(paramName, bUpdateUrl) {
		if(typeof bUpdateUrl=='undefined') {
			bUpdateUrl = true;
		}
		if(startupParams && startupParams[paramName]) {
			startupParams[paramName] = null;
			delete startupParams[paramName];
		}
		if(bUpdateUrl) {
			updateHash();
		}
	}
	function setApplicationParameters(params, bUpdateUrl) {
		if(typeof bUpdateUrl=='undefined') {
			bUpdateUrl = true;
		}
		bUpdateUrl = !!bUpdateUrl;
		applicationParams = params;
		if(bUpdateUrl) {
			updateHash();
		}
	}
	function removeApplicationParameter(paramName, bUpdateUrl) {
		if(typeof bUpdateUrl=='undefined') {
			bUpdateUrl = true;
		}
		if(applicationParams && applicationParams[paramName]) {
			applicationParams[paramName] = null;
			delete applicationParams[paramName];
		}
		if(bUpdateUrl) {
			updateHash();
		}
	}
	function updateStartupParameters(params, bUpdateUrl) {
		if(typeof bUpdateUrl=='undefined') {
			bUpdateUrl = true;
		}
		bUpdateUrl = !!bUpdateUrl;
		if(!startupParams) {
			startupParams= params;
		}  else {
			for(var each in params) {
				var values = params[each];
				if(!startupParams[each]) {
					startupParams[each] = [];
				}
				var arrays = startupParams[each];
				for(var j=0;j<values.length;j++) {
					if(arrays.indexOf(values[j]+"")==-1) {
						arrays.push(values[j]+"");
					}
				}
			}
		}
		if(bUpdateUrl) {
			updateHash();
		}
	}
	function updateApplicationParameters(params, bUpdateUrl) {
		if(typeof bUpdateUrl=='undefined') {
			bUpdateUrl = true;
		}
		bUpdateUrl = !!bUpdateUrl;
		if(!applicationParams) {
			applicationParams= params;
		}  else {
			for(var each in params) {
				var values = params[each];
				if(!jQuery.isArray(values)) {
					values = [values];
				}
				if(!applicationParams[each]) {
					applicationParams[each] = [];
				}
				var arrays = applicationParams[each];
				for(var j=0;j<values.length;j++) {
					if(arrays.indexOf(values[j]+"")==-1) {
						arrays.push(values[j]+"");
					}
				}
			}
		}
		if(bUpdateUrl) {
			updateHash();
		}
	}
	return {
		getSemanticObject : function() {
            reset();
            parseHash(window.location.hash);
			return semanticObject;
		},
		getAction : function() {
            reset();
            parseHash(window.location.hash);
			return action;
		},
		getStartupParameters : function() {
            reset();
            parseHash(window.location.hash);
			return startupParams;
		},
		getApplicationParameters : function(excludeParamsArray /*Array*/) {
			reset();
			parseHash(window.location.hash);
			if(excludeParamsArray && excludeParamsArray.length) {
			    excludeParamsArray.forEach(function(excludeParam){
			        delete applicationParams[excludeParam];
			    });
			}
			return applicationParams;
			
		},
		setSemanticObject : function(sObject, bUpdateUrl) {
			updateSemanticObject(sObject, bUpdateUrl);
			return this;
		},
		setAction : function(action, bUpdateUrl) {
			updateAction(action, bUpdateUrl);
			return this;
		},
		setStartupParameters : function(params, bUpdateUrl) {
			setStartupParameters(params, bUpdateUrl);
			return this;
		},
		updateStartupParameters : function(params, bUpdateUrl) {
			updateStartupParameters(params, bUpdateUrl);
			return this;
		},
		removeStartupParameter : function(paramName, bUpdateUrl) {
			removeStartupParameter(paramName, bUpdateUrl);
			return this;
		},
		setApplicationParameters : function(params, bUpdateUrl) {
			setApplicationParameters(params, bUpdateUrl);
			return this;
		},
		updateApplicationParameters : function(params, bUpdateUrl) {
			updateApplicationParameters(params, bUpdateUrl);
			return this;
		},
		removeApplicationParameter : function(param, bUpdateUrl) {
			removeApplicationParameter(param, bUpdateUrl);
			return this;
		},
		getUrlParameters : function() {
			return jQuery.sap.getUriParameters();
		},
		updateHash : function() {
			updateHash();
		},
		getHash : function() {
			return getHash();
		}
	};
})();