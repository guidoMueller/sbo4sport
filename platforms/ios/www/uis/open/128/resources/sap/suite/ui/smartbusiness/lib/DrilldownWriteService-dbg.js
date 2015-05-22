jQuery.sap.declare("sap.suite.ui.smartbusiness.lib.DrilldownWriteService");
sap.suite = sap.suite || {};
sap.suite.smartbusiness = sap.suite.smartbusiness || {};
sap.suite.smartbusiness.ddaconfig = sap.suite.smartbusiness.ddaconfig || {};

sap.suite.smartbusiness.ddaconfig.DrilldownWriteService = function() {
    var oDataModel = null;
    var serviceUri = "/sap/hba/r/sb/core/odata/modeler/SMART_BUSINESS.xsodata";
    if(sap.suite.smartbusiness.odata) {
        oDataModel = sap.suite.smartbusiness.odata.getModelByServiceUri(serviceUri);
    } else {
        oDataModel = new sap.ui.model.odata.ODataModel(serviceUri, true);
    }
    this.getODataModel = function() {
       return oDataModel;
    };
    this.getEntitySet = function() {
       var Entities = {
              CHART_CONFIGURATION : "/DDA_CHART",
            MASTER_CONFIGURATION : "/DDA_MASTER",
            COLUMNS_CONFIGURATION : "/DDA_COLUMNS",
            HEADER_CONFIGURATION : "/DDA_HEADER",
            FILTER_CONFIGURATION : "/DDA_FILTERS",
            DDA_CONFIGURATION : "/DDA_CONFIG",
            DDA_MASTER_TEXT_CONFIGURATION : "/DDA_MASTER_TEXT"
       };
       return  {
              getChartEntity : function() {
                     return Entities.CHART_CONFIGURATION;
              },
            getMasterEntity : function() {
                return Entities.MASTER_CONFIGURATION;
            },
            getColumnEntity : function() {
                return Entities.COLUMNS_CONFIGURATION;
            },
            getHeaderEntity : function() {
              return Entities.HEADER_CONFIGURATION;
            },
            getFilterEntity : function() {
              return Entities.FILTER_CONFIGURATION;
            },
            getConfigEntity : function() {
              return Entities.DDA_CONFIGURATION;
            },
            getMasterTextEntity : function() {
              return Entities.DDA_MASTER_TEXT_CONFIGURATION;
            }
       };
    };
};

sap.suite.smartbusiness.ddaconfig.DrilldownWriteService.prototype = {
		_executeBatch  : function(entitySet, payLoads, httpMethod, sCallback, fCallback) {
			var requests= [];
			for(var i=0, l= payLoads.length; i< l ;i++) {
				var payload = payLoads[i];
				if(httpMethod == "POST"){
					requests.push(this.getODataModel().createBatchOperation(entitySet, httpMethod, payload));
				} else if(httpMethod == "DELETE"){
					requests.push(this.getODataModel().createBatchOperation(payload, httpMethod));
				} else if(httpMethod == "PUT"){
					requests.push(this.getODataModel().createBatchOperation(entitySet[i], httpMethod, payload));         
				}

			}
			this.getODataModel().addBatchChangeOperations(requests);
			this.getODataModel().submitBatch(function(data, response){
				if(sCallback) {
					sCallback.call(null, data, response);
				}
			},function() {
				if(fCallback) {
					fCallback.apply(null, arguments);
				}
			}, true);
		},
    
    /**
     * Write Services
     */
    createMasterEntry : function(payLoads, sCallback, fCallback) {
        this._executeBatch(this.getEntitySet().getMasterEntity(), payLoads, "POST", sCallback, fCallback);
    },
    createConfig : function(payLoads, sCallback, fCallback) {
        this._executeBatch(this.getEntitySet().getConfigEntity(), payLoads, "POST", sCallback, fCallback);        
    },
    createFilters : function(payLoads, sCallback, fCallback) {
        this._executeBatch(this.getEntitySet().getFilterEntity(), payLoads, "POST", sCallback, fCallback);
    },
    createHeader : function(payLoads, sCallback, fCallback) {
        this._executeBatch(this.getEntitySet().getHeaderEntity(), payLoads, "POST", sCallback, fCallback);
    },
    createColumns : function(payLoads, sCallback, fCallback) {
        this._executeBatch(this.getEntitySet().getColumnEntity(), payLoads, "POST", sCallback, fCallback);
    },
       createChartConfiguration : function(payLoads, sCallback, fCallback) {
           this._executeBatch(this.getEntitySet().getChartEntity(), payLoads, "POST", sCallback, fCallback);
       },
       createMasterTextEntry : function(payLoads, sCallback, fCallback) {
              this._executeBatch(this.getEntitySet().getMasterTextEntity(), payLoads, "POST", sCallback, fCallback);
       },
       
       /**
       * Update Services
       */
    updateMasterEntry : function(payLoads, sCallback, fCallback) {
    	   var entities = [];
    	   for(var i=0;i<payLoads.length;i++){
    		   entities.push(this.getEntitySet().getMasterEntity()+"(EVALUATION_ID='"+payLoads[i].EVALUATION_ID+"',CONFIGURATION_ID='"+payLoads[i].CONFIGURATION_ID+"',IS_ACTIVE="+payLoads[i].IS_ACTIVE+")");
    	   }
    	   this._executeBatch(entities, payLoads, "PUT", sCallback, fCallback);
       },
    updateConfig : function(id, payLoads, sCallback, fCallback) {
        this._executeBatch(this.getEntitySet().getConfigEntity()+"("+this.formId(id)+")", payLoads, "PUT", sCallback, fCallback);        
    },
    updateFilters : function(id, payLoads, sCallback, fCallback) {
        this._executeBatch(this.getEntitySet().getFilterEntity()+"("+this.formId(id)+")", payLoads, "PUT", sCallback, fCallback);
    },
    updateHeader : function(id, payLoads, sCallback, fCallback) {
        this._executeBatch(this.getEntitySet().getHeaderEntity()+"("+this.formId(id)+")", payLoads, "PUT", sCallback, fCallback);
    },
    updateColumns : function(id, payLoads, sCallback, fCallback) {
        this._executeBatch(this.getEntitySet().getColumnEntity()+"("+this.formId(id)+")", payLoads, "PUT", sCallback, fCallback);
    },
    updateChartConfiguration : function(id, payLoads, sCallback, fCallback) {
        this._executeBatch(this.getEntitySet().getChartEntity()+"("+this.formId(id)+")", payLoads, "PUT", sCallback, fCallback);
    },
    updateMasterTextEntry : function(id, payLoads, sCallback, fCallback) {
       this._executeBatch(this.getEntitySet().getMasterTextEntity()+"("+this.formId(id)+")", payLoads, "PUT", sCallback, fCallback);
    },
       
       /**
       * Delete Services
       */
    deleteMasterEntry : function(id, sCallback, fCallback) {
       var entities = [];
       for(var i=0;i<id.length;i++){
              entities.push(this.getEntitySet().getMasterEntity()+"(EVALUATION_ID='"+id[i].EVALUATION_ID+"',CONFIGURATION_ID='"+id[i].CONFIGURATION_ID+"',IS_ACTIVE="+id[i].IS_ACTIVE+")");
       }
        this._executeBatch( null, entities, "DELETE", sCallback, fCallback);
    },
    deleteMasterEntry_Eval : function(id, sCallback, fCallback) {
        var entities = [];
        for(var i=0;i<id.length;i++){
               entities.push("DDA_DEL_EVAL_LEVEL(EVALUATION_ID='"+id[i].EVALUATION_ID+"',IS_ACTIVE="+id[i].IS_ACTIVE+")");
        }
         this._executeBatch( null, entities, "DELETE", sCallback, fCallback);
    },
    deleteConfig : function(id, sCallback, fCallback) {
       var entities = [];
       for(var i=0;i<id.length;i++){
              entities.push("DDA_CONFIG_DEL(EVALUATION_ID='"+id[i].EVALUATION_ID+"',IS_ACTIVE="+id[i].IS_ACTIVE+")");
       }
        this._executeBatch(null, entities,  "DELETE", sCallback, fCallback);        
    },
    deleteFilters : function(id, sCallback, fCallback) {
       var entities = [];
       for(var i=0;i<id.length;i++){
              entities.push("DDA_FILTERS_DEL(EVALUATION_ID='"+id[i].EVALUATION_ID+"',IS_ACTIVE="+id[i].IS_ACTIVE+")");
       }
        this._executeBatch(null, entities, "DELETE", sCallback, fCallback);
    },
    deleteHeader : function(id, sCallback, fCallback) {
       var entities = [];
       for(var i=0;i<id.length;i++){
              entities.push("DDA_HEADER_DEL(EVALUATION_ID='"+id[i].EVALUATION_ID+"',IS_ACTIVE="+id[i].IS_ACTIVE+")");
       }
       this._executeBatch(null, entities, "DELETE", sCallback, fCallback);
    },
    deleteColumns : function(id, sCallback, fCallback) {
       var entities = [];
       for(var i=0;i<id.length;i++){
              entities.push("DDA_COLUMNS_DEL(EVALUATION_ID='"+id[i].EVALUATION_ID+"',CONFIGURATION_ID='"+id[i].CONFIGURATION_ID+"',IS_ACTIVE="+id[i].IS_ACTIVE+")");
       }
        this._executeBatch(null, entities, "DELETE", sCallback, fCallback);
    },
    deleteChartConfiguration : function(id, sCallback, fCallback) {
       var entities = [];
       for(var i=0;i<id.length;i++){
              entities.push(this.getEntitySet().getChartEntity()+"(EVALUATION_ID='"+id[i].EVALUATION_ID+"',CONFIGURATION_ID='"+id[i].CONFIGURATION_ID+"',IS_ACTIVE="+id[i].IS_ACTIVE+")");
       }
        this._executeBatch(null, entities, "DELETE", sCallback, fCallback);
    },
    deleteMasterTextEntry : function(id, sCallback, fCallback) {
       var entities = [];
       for(var i=0;i<id.length;i++){
              entities.push("DDA_MASTEXT_DEL(EVALUATION_ID='"+id[i].EVALUATION_ID+"',CONFIGURATION_ID='"+id[i].CONFIGURATION_ID+"',IS_ACTIVE="+id[i].IS_ACTIVE+")");
       }
       this._executeBatch(null, entities, "DELETE", sCallback, fCallback);
    },
    
    /**
     * id={EVALUATION_ID : 'x', CONFIGURATION_ID :'y'}
     * formId loops through the object id and returns key value pairs as string
     */
    formId : function(id){
       var tempId = '';
       for(each in id){
              if(isNaN(id[each])){
              tempId = tempId+(each+"='"+id[each]+"',");
              } else {
                     tempId = tempId+(each+"="+id[each]+","); 
              }
       }
       return tempId.substring(0,tempId.length-1);
    },
    
    
   
    
    /**
     * Master Write Service. In one Batch Call, Save Everything
     * @param : oParam
     * {
     *      masterPayload : {EVALUATION_ID :'', CONFIGURATION_ID:'', CONFIG_ORDER : 1, TEXT : ''},
     *      configPayload :[
     *          {EVALUATION_ID :'', CONFIGURATION_ID:'', PROPERTY_NAME : 'SAP_FILTER', PROPERTY_VALUE:'', VISIBILITY : 1},
     *          {EVALUATION_ID :'', CONFIGURATION_ID:'', PROPERTY_NAME : 'SAP_HEADER', PROPERTY_VALUE:'', VISIBILITY : 1},
     *          {EVALUATION_ID :'', CONFIGURATION_ID:'', PROPERTY_NAME : 'SAP_AGGREGATE_VALUE', PROPERTY_VALUE:'', VISIBILITY : 1},
     *          {EVALUATION_ID :'', CONFIGURATION_ID:'', PROPERTY_NAME : 'QUERY_SERVICE_URI', PROPERTY_VALUE:'/a/b.xsodata', VISIBILITY : 1},
     *          {EVALUATION_ID :'', CONFIGURATION_ID:'', PROPERTY_NAME : 'QUERY_ENTITY_SET', PROPERTY_VALUE:'XYZ', VISIBILITY : 1}
     *      ],
     *      columnsPayload : [
     *          {
     *              EVALUATION_ID :'', 
     *              CONFIGURATION_ID:'',
     *              NAME:'COUNTRY', 
     *              TYPE:'DIMENSION', 
     *              SORT_BY:'COUNTRY', 
     *              SORT_ORDER : 'asc',
     *              COLOR : '',
     *              STACKING : 1, //tiny int
     *              AXIS : 1 //integer
     *          }
     *          //Multiple Columns
     *      ],
     *      chartPayload : {
     *          EVALUATION_ID :'', 
                CONFIGURATION_ID:'',
     *          CHART_TYPE : 'TABLE',
     *          AXIS_TYPE : 'DUAL', //SINGLE/DUAL
     *          VALUE_TYPE : 'PERCENTAGE', //PERCENTAGE/ABSOLUTE,
     *          COLOR_SCHEME : 'AUTO_SEMANTIC',
     *          DATA_LIMIT : 0 //Integer ; 0 means no limit
     *      },
     *      filterPayload : [
     *          {
     *              EVALUATION_ID :'',
     *              CONFIGURATION_ID:'',
     *              DIMENSION :''
     *          }
     *          //Multiple Filters
     *      ],
     *      headerPayload : [
     *          {
     *              EVALUATION_ID :'',
     *              CONFIGURATION_ID:'',
     *              
     *          }
     *      ]
     * }
     */
    saveDDAConfiguration : function(oParams) {
        
    },
    
};
