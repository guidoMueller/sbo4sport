/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2014 SAP SE. All rights reserved
 */

jQuery.sap.declare('sap.viz.ui5.controls.common.helpers.VizControlsHelper');

sap.viz.ui5.controls.common.helpers.VizControlsHelper = {};

sap.viz.ui5.controls.common.helpers.VizControlsHelper.getFeedInstances = function(feeds) {
    if (feeds) {
        return sap.viz.ui5.controls.common.feeds.FeedItem.toInstances(feeds);
    } else {
        return [];
    }
};

sap.viz.ui5.controls.common.helpers.VizControlsHelper.updateAxis = function(dimensions, vizType, feeds) {
    if (!feeds || feeds.length === 0 || !dimensions || dimensions.length === 0) {
        return;
    }
    // Map of dimensions
    var dimMap = {};
    dimensions.forEach(function(dim) {
        dimMap[dim.getName()] = dim;
    });
    // Map of feed definations
    var feedDefsMap = sap.viz.ui5.controls.common.helpers.VizControlsHelper._getFeedDefsMap(vizType);

    // Travesal
    feeds.forEach(function(feed) {
    	var def = feedDefsMap[feed.getUid()];
    	if (def.type !== 'Dimension') {
    		return;
    	}
        var aaIndex = def.aaIndex;
        feed.getValues().forEach(function(analysisObject) {
            var dim = dimMap[analysisObject.getName()];
            if (dim) {
                dim.setAxis(aaIndex);
            }
        });
    });
};

/**
 * Used in VizContainer only
 */
sap.viz.ui5.controls.common.helpers.VizControlsHelper.getFakedDataInstance = function(vizType, vizData, feeds) {
    var getFeedInstances = sap.viz.ui5.controls.common.helpers.VizControlsHelper.getFeedInstances;
    var getDataInstance = sap.viz.ui5.controls.common.helpers.VizControlsHelper.getDataInstance;

    var dataInstance = getDataInstance(vizData);
    if (dataInstance) {
        var fs = new sap.viz.controls.services.FakeDataService(vizType, JSON.parse(JSON.stringify(dataInstance.data())), getFeedInstances(feeds));

        dataInstance = new sap.viz.api.data.CrosstableDataset();
        dataInstance.data(fs.getVizDataset());
        return dataInstance;
    } else {
        return null;
    }
};

/**
 * Used in VizContainer only
 */
sap.viz.ui5.controls.common.helpers.VizControlsHelper.getDataInstance = function(vizData) {
    if (vizData) {
        return vizData.getVIZDataset();
    } else {
        return null;
    }
};

/**
 * Used in VizContainer only
 * Update feeds in sequences of aaIndexs of manifest
 */
sap.viz.ui5.controls.common.helpers.VizControlsHelper.updateFeedsByAAIndex = function(vizType, feeds) {
    if (!feeds || feeds.length === 0 || feeds.length === 1) {
        return feeds;
    }
    var vizFeedDefsMap = sap.viz.ui5.controls.common.helpers.VizControlsHelper._getFeedDefsMap(vizType);
    if (vizFeedDefsMap) {
        feeds.sort(function(f1, f2) {
            var feedDef1 = vizFeedDefsMap[f1.getUid()];
            var feedDef2 = vizFeedDefsMap[f2.getUid()];
            var priority1 = feedDef1.aaIndex ? feedDef1.aaIndex : feedDef1.aaIndex + 1000;
            var priority2 = feedDef2.aaIndex ? feedDef2.aaIndex : feedDef2.aaIndex + 1000;
            return priority1 - priority2;
        });
    }
};

/**
 * Used in VizContainer only
 */
sap.viz.ui5.controls.common.helpers.VizControlsHelper.getSwitchBarGroups = function() {
    var LangManager = sap.viz.controls.common.managers.LangManager;

    var switchBarGroups = [{
        "name" : LangManager.get("VIZ_SWITCHBAR_COLUMN_CHARTS"),
        "types" : [{
            "id" : "viz/column"
        }, {
            "id" : "viz/stacked_column"
        }, {
            "id" : "viz/dual_column"
        }]
    }, {
        "name" : LangManager.get("VIZ_SWITCHBAR_LINE_CHARTS"),
        "types" : [{
            "id" : "viz/line"
        }, {
            "id" : "viz/area"
        }, {
            "id" : "viz/combination"
        }, {
            "id" : "viz/dual_line"
        }, {
            "id" : "viz/dual_combination"
        }]
    }, {
        "name" : LangManager.get("VIZ_SWITCHBAR_PIE_CHARTS"),
        "types" : [{
            "id" : "viz/pie"
        }, {
            "id" : "viz/donut"
        }]
    }, {
        "name" : LangManager.get("VIZ_SWITCHBAR_SCATTER_CHARTS"),
        "types" : [{
            "id" : "viz/scatter"
        }, {
            "id" : "viz/bubble"
        }]
    }, {
        "name" : LangManager.get("VIZ_SWITCHBAR_MAP_CHARTS"),
        "types" : [{
            "id" : "viz/heatmap"
        }, {
            "id" : "viz/treemap"
        }]
    }];

    return switchBarGroups;
};

sap.viz.ui5.controls.common.helpers.VizControlsHelper._getFeedDefsMap = function(vizType) {
    var allFeeds;
    try {
        allFeeds = sap.viz.api.manifest.Viz.get(vizType)[0].allFeeds();
    } catch(e) {
        return null;
    }
    var map = {};
    for (var i = 0; i < allFeeds.length; i++) {
        map[allFeeds[i].id] = allFeeds[i];
    }
    return map;
};
