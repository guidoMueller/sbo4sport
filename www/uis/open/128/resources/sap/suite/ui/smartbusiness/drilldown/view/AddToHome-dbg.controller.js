jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("sap.suite.ui.smartbusiness.lib.Chip");
sap.ui.controller("sap.suite.ui.smartbusiness.drilldown.view.AddToHome", {
    onInit : function() {
        this.drilldownController = this.getView().getViewData();
        this.evaluationApi  = this.drilldownController.EVALUATION;
        this.thresholds = this.evaluationApi.getThresholds();
        this.LAYOUT = this.byId("container");
        this.SAP_SYSTEM  = this.drilldownController.SAP_SYSTEM;
        try {
            this.LAYOUT_MODEL = new sap.ui.model.json.JSONModel({
                TITLE : "",
                CL : this.thresholds.getCriticalLow(),
                CH : this.thresholds.getCriticalHigh(),
                WL : this.thresholds.getWarningLow(),
                WH : this.thresholds.getWarningHigh(),
                TA : this.thresholds.getTarget(),
                TC : this.thresholds.getTrend(),
                RE : this.thresholds.getReference(),
                MINIMIZING_KPI : this.evaluationApi.isMinimizingKpi(),
                MAXIMIZING_KPI : this.evaluationApi.isMaximizingKpi(),
                TARGET_KPI : this.evaluationApi.isTargetKpi()
            });
            this.LAYOUT.setModel(this.LAYOUT_MODEL),
            this.createForm(this.evaluationApi.getThresholdValueType() == "MEASURE");
        }catch(e) {
            
        }
    },
    createForm : function(bIsDynamicFilter) {
        var _getVisibilityObject = function(modelProperty) {
            return  {
                parts : [
                    {path : modelProperty},
                    {path : "/TARGET_KPI"}
                ],
                formatter : function(MinOrMax, target) {
                    if(MinOrMax || target) {
                        return true;
                    }
                    return false;
                }
            }
        };
        var formLayout = null;
        var nonEditableLabel = null;
        if(!bIsDynamicFilter) {
            formLayout = new sap.ui.layout.form.SimpleForm({
                content : [
                   new sap.m.Label({text : "{i18n>SUB_TITLE_LABEL}", required : true}),
                   new sap.m.Input({value : "{/TITLE}", id:"subtitleInput"}),
                   
                   new sap.m.Label({text : "{i18n>CRITICAL_HIGH_LABEL}", visible : _getVisibilityObject("/MINIMIZING_KPI")}),
                   new sap.m.Input({value : "{/CH}", visible : _getVisibilityObject("/MINIMIZING_KPI"), valueState : sap.ui.core.ValueState.Error, valueStateText : "{i18n>CRITICAL_HIGH_VALUE_HELP}"}),
                   new sap.m.Label({text : "{i18n>WARNING_HIGH_LABEL}", visible : _getVisibilityObject("/MINIMIZING_KPI")}),
                   new sap.m.Input({value : "{/WH}", visible : _getVisibilityObject("/MINIMIZING_KPI"), valueState : sap.ui.core.ValueState.Warning, valueStateText : "{i18n>WARNING_HIGH_VALUE_HELP}"}),
                   
                   new sap.m.Label({text : "{i18n>TARGET_LABEL}"}),
                   new sap.m.Input({value : "{/TA}", valueState : sap.ui.core.ValueState.None, valueStateText : "{i18n>TARGET_VALUE_HELP}"}),
                   
                   new sap.m.Label({text : "{i18n>WARNING_LOW_LABEL}", visible : _getVisibilityObject("/MAXIMIZING_KPI")}),
                   new sap.m.Input({value : "{/WL}",visible :  _getVisibilityObject("/MAXIMIZING_KPI"), valueState : sap.ui.core.ValueState.Warning, valueStateText : "{i18n>WARNING_LOW_VALUE_HELP}"}),
                   new sap.m.Label({text : "{i18n>CRITICAL_LOW_LABEL}",visible :  _getVisibilityObject("/MAXIMIZING_KPI")}),
                   new sap.m.Input({value : "{/CL}", visible : _getVisibilityObject("/MAXIMIZING_KPI"), valueState : sap.ui.core.ValueState.Error, valueStateText : "{i18n>CRITICAL_LOW_VALUE_HELP}"}),
                ]
            });
        } else {
            formLayout = new sap.ui.layout.form.SimpleForm({
                content : [
                   new sap.m.Label({text : "{i18n>SUB_TITLE_LABEL}", required : true}),
                   new sap.m.Input({value : "{/TITLE}"}),
                ]
            });
            nonEditableLabel = new sap.m.Label({
                text : "{i18n>DYNAMIC_MEASURE_NOT_EDITABLE}"
            });
            nonEditableLabel.addStyleClass("labelDynamicThresholdNotEditable")
        }
        this.LAYOUT.removeAllItems();
        this.LAYOUT.addItem(formLayout);
        if(nonEditableLabel) {
            this.LAYOUT.addItem(nonEditableLabel);
        }
    },
    validate : function(sCallback, fCallback) {
        var modelData = this.LAYOUT_MODEL.getData();
        modelData.TITLE = sap.ui.getCore().byId("subtitleInput").getValue();
        var object = {title : ""};
        if(this.evaluationApi.getThresholdValueType() == "MEASURE") {
            if(!modelData.TITLE.trim()) {
                fCallback.call(this, {errorMessage : this.drilldownController.getView().getModel("i18n").getProperty("VALIDATION_ERROR_TITLE_MISSING")});
            } else {
                object.title  = modelData.TITLE.trim();
                sCallback.call(this, object);
            }
        } else {
            if(!modelData.TITLE.trim()) {
                fCallback.call(this, {errorMessage : this.drilldownController.getView().getModel("i18n").getProperty("VALIDATION_ERROR_TITLE_MISSING")});
                return;
            }
            object.title  = modelData.TITLE.trim();
            object.evaluationValues = [];
            var targetValue = modelData.TA ? modelData.TA.trim() : null;
            var CLValue = modelData.CL ? modelData.CL.trim() : null;
            var CHValue = modelData.CH ? modelData.CH.trim() : null;
            var WLValue = modelData.WL? modelData.WL.trim() : null;
            var WHValue = modelData.WH? modelData.WH.trim() : null;
            if(targetValue) {
                object.evaluationValues.push({
                    TYPE :"TA",
                    FIXED : targetValue,
                    ID : this.evaluationApi.getId(),
                    COLUMN_NAME : null,
                    ODATA_PROPERTY : null
                });
            }
            if(CLValue) {
                object.evaluationValues.push({
                    TYPE :"CL",
                    FIXED : CLValue,
                    ID : this.evaluationApi.getId(),
                    COLUMN_NAME : null,
                    ODATA_PROPERTY : null
                });
            }
            if(CHValue) {
                object.evaluationValues.push({
                    TYPE :"CH",
                    FIXED : CHValue,
                    ID : this.evaluationApi.getId(),
                    COLUMN_NAME : null,
                    ODATA_PROPERTY : null
                });
            }
            if(WLValue) {
                object.evaluationValues.push({
                    TYPE :"WL",
                    FIXED : WLValue,
                    ID : this.evaluationApi.getId(),
                    COLUMN_NAME : null,
                    ODATA_PROPERTY : null
                });
            }
            if(WHValue) {
                object.evaluationValues.push({
                    TYPE :"WH",
                    FIXED : WHValue,
                    ID : this.evaluationApi.getId(),
                    COLUMN_NAME : null,
                    ODATA_PROPERTY : null
                });
            }
            if(object.evaluationValues.length ==0) {
                object.evaluationValues = null;
            }
            sCallback.call(this, object);
        }
    },
    _addTileToHomePage : function(chipId) {
        var oBookmarkService = sap.ushell.Container.getService("Bookmark");
        var categoryId = null ; //Adds to Default Group (My Home)
        oBookmarkService.addCatalogTileToGroup(chipId, categoryId, {
            baseUrl : "/sap/hba/r/sb/core/odata/runtime/SMART_BUSINESS.xsodata",
            remoteId : "HANA_CATALOG"
        }).done(function() {
            jQuery.sap.log.info("Tile Added to HOME");
        }).fail(function(oError) {
            jQuery.sap.log.error("Failed to add tile to home : "+oError);
        });
    },
    _notifyShell : function(chipId) {
        var oService =  sap.ushell && sap.ushell.Container && sap.ushell.Container.getService;
        if(oService) {
            oNotifyShell = oService("LaunchPage");
            if(oNotifyShell && oNotifyShell.onCatalogTileAdded) {
                oNotifyShell.onCatalogTileAdded(chipId);
            }
        }
    },
    publishTile : function(callback) {
        this.validate(function(tObject) {
            var response  = sap.suite.smartbusiness.chip.savePersonalizedTile({
                evaluationId : this.evaluationApi.getId(),
                tileType : this.drilldownController.TILE_TYPE,
                dimension : this.drilldownController.DIMENSION,
                additionalFilters : this.drilldownController.getAdditionFiltersForChipConfiguration(),
                evaluationValues : tObject.evaluationValues ? tObject : null,
                title : tObject.title,
                sapSystem : this.SAP_SYSTEM
            });
            if(response.status == 'Success') {
                sap.m.MessageToast.show(this.drilldownController.getView().getModel("i18n").getProperty("PERSONALIZED_TILE_CREATED_SUCCESSFULLY"));
                callback.call();
                this._addTileToHomePage(response.chipId);
                this._notifyShell(response.chipId);
            } else {
                jQuery.sap.log.error(response.message);
                sap.m.MessageToast.show(this.drilldownController.getView().getModel("i18n").getProperty("PERSONALIZED_TILE_CREATION_FAILED"));
                callback.call();
            }
        }, function(oError){
            sap.m.MessageBox.show(oError.errorMessage,null,this.drilldownController.getView().getModel("i18n").getProperty("VALIDATION_ERROR_HEADER"))
        });
    }, 
    onAfterRendering : function() {
        
    }
});
