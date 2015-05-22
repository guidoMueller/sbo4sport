jQuery.sap.declare("sap.suite.ui.smartbusiness.drilldown.lib.MiniChartManager");
sap.suite = sap.suite || {};
sap.suite.smartbusiness = sap.suite.smartbusiness || {};
sap.suite.smartbusiness.miniChartManager = (function() {
    "use strict";
    var headerMiniCharts = [];
    var VISUALIZATION_TYPE = {
            NT: "Numeric",
            CT: "Comparison",
            AT: "Bullet",
            TT : "AreaChart",
            CM : "MeasureComparison"
    };
    var VisualizationTypeWeight = {
            "NT" : 4,
            "AT" : 3,
            "CT" : 2,
            "TT" : 1,
            "CM" : 0
    };
    var urlParsingService = sap.ushell.Container.getService("URLParsing");
    /*
     * utility function which returns relevant 
     */
    var getRelevantFilter = function(oParam, obj) {
        var evalId = "";
        if(obj.isAssociated())
            evalId = obj.getReferenceEvaluationId();
        else
            evalId = obj.getReferenceEvaluationId();

        var retFilter = [];
		var oDataUri = "";
		if(sap.suite.smartbusiness.cache.getEvaluationById(evalId))
			oDataUri = sap.suite.smartbusiness.cache.getEvaluationById(evalId).ODATA_URL;
		if(oDataUri){
			var sUri = urlParsingService.addSystemToServiceUrl(
					sap.suite.smartbusiness.cache.getEvaluationById(evalId).ODATA_URL,
					oParam.sapSystem);
			var entitySet = sap.suite.smartbusiness.cache.getEvaluationById(evalId).ODATA_ENTITYSET;
			var allDimensions = sap.suite.smartbusiness.odata.getAllDimensions(sUri,entitySet);

			for(var i = 0; i < oParam.urlFilters.length; i++){
				if(allDimensions.indexOf(oParam.urlFilters[i].NAME) != -1)
					retFilter.push(oParam.urlFilters[i]);
			}
		}
		return retFilter;
    };

    return {
        renderHeaders : function(oParam){
            if(oParam.allTiles.length){
                var headers = oParam.allTiles;
                headerMiniCharts = [];
                headers.forEach(function(obj){
                    var tileType = obj.getVisualizationType();
                    if(VISUALIZATION_TYPE[tileType]) {
                        var tileControlName = VISUALIZATION_TYPE[tileType];
                        jQuery.sap.require("sap.suite.ui.smartbusiness.tiles."+tileControlName);
                        if(sap.suite.ui.smartbusiness.tiles[tileControlName]) {
                            var filters = getRelevantFilter(oParam,obj);
                            var tile = new sap.suite.ui.smartbusiness.tiles[tileControlName]({
                                dimension : obj.getDimension(),
                                evaluationId : obj.getEvaluationId(),
                                associationEvaluationId : obj.getReferenceEvaluationId(),
                                sapSystem : oParam.sapSystem,
                                additionalFilters : filters,
                                tileConfiguration : obj.getTileConfiguration()
                            }).addStyleClass("drilldownKpiTiles");
                            headerMiniCharts.push(tile);
                            var headerItem = new sap.suite.ui.commons.HeaderCellItem();
                            var headerCell = new sap.suite.ui.commons.HeaderCell();
                            oParam.headerContainer.addItem(tile);
                            if(oParam.urlFilters.length){
                                if(filters && filters.length){}
                                else{
                                    tile.setVisible(false);
                                    tile.setClick(false);
                                }
                            }
                        } else {
                            jQuery.sap.log.error("Ignoring the tile "+tileControlName +" : Not Implemented Yet");
                        }
                    } else {
                        jQuery.sap.log.error("No Tile Mapping  for Visualisation Type : "+tileType);
                    }
                });
            }
        },

        hashChangeListner : function(oParam){
            if(oParam.firstTimeFlag){
                var affectedTiles = [];
                var headers = oParam.allTiles;
                for(var i = 0; i <headers.length; i++){
                    var oDataModel = null;
                    var obj = headers[i];
                    var curTile = headerMiniCharts[i];
                    curTile.abortODataCalls();
                    var filter = getRelevantFilter(oParam, obj);
                    if(oParam.urlFilters.length){
                        if(filter && filter.length){
                            curTile.$().css("opacity","1");
                            //curTile.setVisible(true);
                            curTile.setAdditionalFilters(filter);   
                            curTile.$().off("click");   //restore tilePresssed event(remove override click)
                        }
                        else {
                            //curTile.setVisible(false);
                            curTile.$().css("opacity","0.2");
                            curTile.$().click(function(){
                                return false;   //disable tile click event
                            });
                        }
                    }
                    else{
                        //curTile.setVisible(true);
                        curTile.$().css("opacity","1");
                        curTile.setAdditionalFilters(filter);
                        curTile.$().off("click");
                    }
                }
            }
        },
    }
})();