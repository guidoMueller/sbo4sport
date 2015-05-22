jQuery.sap.declare("sap.suite.ui.smartbusiness.lib.DrilldownSaveService");
sap.suite = sap.suite || {};
sap.suite.smartbusiness = sap.suite.smartbusiness || {};
sap.suite.smartbusiness.ddaconfig = sap.suite.smartbusiness.ddaconfig || {};
sap.suite.smartbusiness.ddaconfig.DrilldownSaveService={
		fetchXSRFToken:function(fnS,fnE){
			jQuery.ajax({
      		  type: "HEAD",
      		  async: false,
      		  dataType: "json",
      		  url: "/sap/hba/r/sb/core/logic/__token.xsjs",
      		  headers: {"X-CSRF-Token": "Fetch"},
      		  success: function(d, s, x) {
      			  if(fnS)fnS(d,s,x);
      		  },
      		  error: function() {
      			  if(fnE)fnE(d,s,x);
      		  }
      	  });
		},
		constants:{
			"write":{fn:"getWritePayload"},
			"delete":{fn:"getDeletePayload"},
			"update":{fn:"getUpdatePayload"},
			"viewServiceUrl":"/sap/hba/r/sb/core/logic/ddaViewConfiguration_cud.xsjs",
			"evalServiceUrl":"/sap/hba/r/sb/core/logic/ddaEvaluation_cud.xsjs"
		},
        doUpdate:function(oConfig){
            var that=this;
            this.fetchXSRFToken(function(d,s,x){
                  jQuery.ajax({
                         url:sap.suite.smartbusiness.utils.appendUrlParameters(oConfig.url),
                         type:"PUT",
                         headers: {"X-CSRF-Token": x.getResponseHeader("X-CSRF-Token"), "Accept-Language": sap.suite.smartbusiness.utils.getLocaleLanguage()},
                         data:JSON.stringify(oConfig.payload)
                  }).done(oConfig.success||function(){}).fail(oConfig.error||function(){});
            },oConfig.error);
        },
        doWrite:function(oConfig){
            var that=this;
            this.fetchXSRFToken(function(d,s,x){
                  jQuery.ajax({
                         url:sap.suite.smartbusiness.utils.appendUrlParameters(oConfig.url),
                         type:"POST",
                         headers: {"X-CSRF-Token": x.getResponseHeader("X-CSRF-Token"), "Accept-Language": sap.suite.smartbusiness.utils.getLocaleLanguage()},
                         data:JSON.stringify(oConfig.payload)
                  }).done(oConfig.success||function(){}).fail(oConfig.error||function(){});
            },oConfig.error);
        },
        doDelete:function(oConfig){
            var that=this;
            this.fetchXSRFToken(function(d,s,x){
                  jQuery.ajax({
                         url:sap.suite.smartbusiness.utils.appendUrlParameters(oConfig.url),
                         type:"DELETE",
                         headers: {"X-CSRF-Token": x.getResponseHeader("X-CSRF-Token"), "Accept-Language": sap.suite.smartbusiness.utils.getLocaleLanguage()},
                         data:JSON.stringify(oConfig.payload)
                   }).done(oConfig.success||function(){}).fail(oConfig.error||function(){});
            },oConfig.error);
            
        },
        doServiceCall:function(oConfig){
            var that=this;
            if(oConfig.type=="POST"){
                  this.doWrite(oConfig);
            }else if(oConfig.type=="PUT"){
                  this.doUpdate(oConfig);
            }else if(oConfig.type="DELETE"){
                  this.doDelete(oConfig);
            }
        },

        saveEvalConfiguration:function(evalId,data,action,fnS,fnE){
            var type = (action=="delete"?"DELETE":(action=="update"?"PUT":"POST"));
            if(this.constants[action]){
                  this.doServiceCall({
                         type:type,
                         payload:this[this.constants[action].fn](evalId,data),
                         url:this.constants.evalServiceUrl,
                         success:fnS,
                         error:fnE
                  });    
            }else{
                  fnE("Service Failed. Unrecognized action "+action);
            }
        },
        saveViewConfiguration:function(evalId,data,action,fnS,fnE){
            action=data.ID_EDITABLE?"write":action;
            var type = (action=="delete"?"DELETE":(action=="update"?"PUT":"POST"));
            if(this.constants[action]){
                  this.doServiceCall({
                         type:type,
                         payload:this[this.constants[action].fn](evalId,data,true),
                         url:this.constants.viewServiceUrl,
                         success:fnS,
                         error:fnE
                  });    
            }else{
                  fnE("Service Failed. Unrecognized action "+action);
            }
        },
		getUpdatePayload:function(evalId,data,isView){
			return {
				payload:this.getWritePayload(evalId,data,isView),
				keys:this.getDeletePayload(evalId,data,isView)
			};
		},
		getWritePayload:function(evalId,data,isView){
			var configId=data.ID,oReturn;
			if(isView){
				oReturn={
						DDA_COLUMNS:this.getColumnsPayload(data,evalId,configId),
						DDA_CHART:this.getChartPayload(data,evalId,configId),
						DDA_MASTER_TEXT:this.getViewTextPayload(data,evalId,configId)
				};
				if(data.ID_EDITABLE){
					oReturn.DDA_MASTER=this.getNewViewPayload(data.ALL_VIEWS,evalId,configId);
				}
			}else{
				oReturn={
						DDA_FILTERS:this.getFilterPayload(data.CURRENT_FILTERS,evalId,configId),
						DDA_HEADER:this.getHeaderPayload(data.HEADERS_VISIBLE,evalId,configId),
						DDA_CONFIGURATION:this.getConfigurationPayload(data,evalId,configId)						
				};
				var viewOrderPayload=this.getViewOrderPayload(data.ALL_VIEWS,evalId,configId);
				if(viewOrderPayload.length){
					oReturn.DDA_MASTER=viewOrderPayload;
				}
			}
			return oReturn;
		},
		getDeletePayload:function(evalId,data,isView){
			return {"EVALUATION_ID":evalId,"CONFIGURATION_ID":data.ID};
		},
		getViewTextPayload:function(data,evalId,configId){
			var viewTexts=[];
			var curL=data.CURRENT_LANGUAGE,viewText=data.TITLE;
			data=data.ADDITIONAL_LANGUAGE_TITLES||[];
			for(var i=0;i<data.length;i++){
				if(data[i].SAP_LANGUAGE_KEY==curL)
					continue;
				viewTexts.push({
					"CONFIGURATION_ID":configId,
					"EVALUATION_ID":evalId,
     				"SAP_LANGUAGE_KEY": data[i].SAP_LANGUAGE_KEY,
     				"TEXT": data[i].TEXT,
					"IS_ACTIVE":1
				});
			}
			viewTexts.push({
				"CONFIGURATION_ID":configId,
				"EVALUATION_ID":evalId,
 				"SAP_LANGUAGE_KEY": curL,
 				"TEXT": viewText,
				"IS_ACTIVE":1
			});
			return viewTexts;
		},
		getChartPayload:function(data,evalId,configId){
			return [{
				"EVALUATION_ID":evalId,
				"CONFIGURATION_ID":configId,
				"VALUE_TYPE":data.VALUE_TYPE,
				"AXIS_TYPE":data.AXIS_TYPE,
				"CHART_TYPE":data.CHART_TYPE,	
				"DATA_LIMIT":data.DATA_LIMITATIONS?data.DATA_LIMIT:-1,		
				"COLOR_SCHEME":data.COLOR_SCHEME,
				"IS_ACTIVE":1,
				"THRESHOLD_MEASURE":data.THRESHOLD_MEASURE
			}];
		},
		getColumnsPayload:function(data,evalId,configId){
			var columns=[];
			var colorScheme=data.COLOR_SCHEME;
			data=data.items||[];
			for(var i=0;i<data.length;i++){
				if(data[i].SELECTED)
				columns.push({
					"EVALUATION_ID":evalId,
					"CONFIGURATION_ID":configId,
					"NAME":data[i].NAME,	
					"TYPE":data[i].TYPE.toUpperCase(),
					"SORT_BY":data[i].SORT_BY,
					"VISIBILITY":data[i].VISIBILITY,
					"COLOR":(colorScheme=="MANUAL_NON_SEMANTIC"? data[i].COLOR1:colorScheme=="MANUAL_SEMANTIC"?data[i].COLOR2:"")||"",
					"STACKING":data[i].STACKING,		
					"AXIS":data[i].AXIS,
					"SORT_ORDER":data[i].SORT_ORDER,	
					"COLUMNS_ORDER":i,
					"IS_ACTIVE":1
				});
			}
			return columns;
		},
		getFilterPayload:function(data,evalId,configId){
			var filters=[];
			data=data||[];
			for(var i=0;i<data.length;i++){
				filters.push({
					"EVALUATION_ID":evalId,
					"CONFIGURATION_ID":configId,
					"DIMENSION":data[i],	
					"VISIBILITY":1,
					"IS_ACTIVE":1
				});
			}
			return filters;
		},
		_getHeaderConfiguration:function(header){
			var data;
			switch (header.VISUALIZATION_TYPE) {
			    case "CM":
			        data = [{
			            name: header.MEASURE1,
			            color: header.COLOR1
			        }, {
			            name: header.MEASURE2,
			            color: header.COLOR2
			        }];
			        (header.MEASURE3 && header.MEASURE3!="_none^") ? data.push({

			            name: header.MEASURE3,
			            color: header.COLOR3
			        }) : "";
			        data = JSON.stringify({MEASURES: JSON.stringify(data)});
			        break;
			    case "CT":
			        data = {
			            order: header.SORT_ORDER[1] == "D" ? "desc" : "asc",
			            by: header.SORT_ORDER[0]
			        };
			        data = JSON.stringify({SORTING: JSON.stringify(data)});
			        break;
			}
			return data;
		},
		getHeaderPayload:function(data,evalId,configId){
			var headers=[];
			data=data||[];
			for(var i=0;i<data.length;i++){
				if(data[i])//.visible)
				headers.push({
					"CONFIGURATION_ID":configId,
					"EVALUATION_ID":evalId,
					"VISUALIZATION_TYPE":data[i].VISUALIZATION_TYPE,
					"VISIBILITY":1,
					"REFERENCE_EVALUATION_ID":data[i].REFERENCE_EVALUATION_ID,
					"VISUALIZATION_ORDER":i,
					"DIMENSION":data[i].DIMENSION,
					"IS_ACTIVE":1,
					"CONFIGURATION":this._getHeaderConfiguration(data[i])
				});
			}
			return headers;			
		},
		getConfigurationPayload:function(data,evalId,configId){
			var config={
					"SAP_FILTER":{value:"",visibility:1},
					"SAP_AGGREGATE_VALUE":{value:"",visibility:(data.CONFIG.SAP_AGGREGATE_VALUE?1:0)},
					"SAP_HEADER":{value:"",visibility:1},
					"QUERY_SERVICE_URI":{value:data.QUERY_SERVICE_URI,visibility:1},
					"QUERY_ENTITY_SET":{value:data.QUERY_ENTITY_SET,visibility:1},
			};
			var configs=[];
			for(var each in config){
				configs.push({
					"EVALUATION_ID":evalId,
					"CONFIGURATION_ID":configId,
					"PROPERTY_TYPE":each,
					"PROPERTY_VALUE":config[each].value,		
					"VISIBILITY":config[each].visibility,
					"IS_ACTIVE":1
				});
			}
			return configs;
		},
		getNewViewPayload:function(data,evalId,configId){
			return [{
				"CONFIGURATION_ID":configId,
				"EVALUATION_ID":evalId,
				"CONFIG_ORDER":(data.length+1),
				"IS_ACTIVE":1
			}];
		},
		getViewOrderPayload:function(data,evalId,configId){
			var configOrder=[];
			data=data||[];
			for(var i=0;i<data.length;i++){
				configOrder.push({
					"CONFIGURATION_ID":data[i].ID,
					"EVALUATION_ID":evalId,
					"CONFIG_ORDER":i,
					"IS_ACTIVE":1
				});
			}
			return configOrder;	
		}

};
