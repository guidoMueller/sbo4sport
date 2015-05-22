/*
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2014 SAP SE. All rights reserved
 */
jQuery.sap.declare('sap.viz.ui5.data.transformers.ModelToFlattable');

sap.viz.ui5.data.transformers.ModelToFlattable = function() {
    this.reset();
};

sap.viz.ui5.data.transformers.ModelToFlattable.prototype.reset = function(oOther) {
    this._oVIZFlatTable = null;
    this._aFlatContextLookup = null;
};


sap.viz.ui5.data.transformers.ModelToFlattable.prototype.getVizDataset = function(oBinding, dimensions, measures) {
    if (!this._oVIZFlatTable && sap.viz.__svg_support) {
        this._createVIZFlatTable(oBinding, dimensions, measures);
    }
    return this._oVIZFlatTable || null;
};

sap.viz.ui5.data.transformers.ModelToFlattable.prototype.findContext = function(oCriteria) {
    if (this._aFlatContextLookup && typeof oCriteria === 'object' && oCriteria._id !== undefined) {
        return this._aFlatContextLookup[oCriteria._id]
    }
};

sap.viz.ui5.data.transformers.ModelToFlattable.prototype._createVIZFlatTable = function(oBinding, dimensions, measures) {
    var aContexts = oBinding && oBinding.getContexts(0, oBinding.getLength());

    // handle no data
    if (!aContexts || aContexts.length === 0) {
        if (this._oVIZFlatTable) {
            delete this._oVIZFlatTable;
            this.invalidate();
        }
        return;
    }

    var aAxis = [], aMeasures = [], flatTableDS = {
        'metadata' : {
            'fields' : []
        },
        'data' : []
    }, aContextLookup = [];

    jQuery.each(dimensions, function(i, oColumn) {
        aAxis.push({
            def : oColumn,
            adapter : oColumn._getAdapter()
        });
        flatTableDS.metadata.fields.push({
            'id' : oColumn.getName(),
            'semanticType' : 'Dimension'
        });
    });

    jQuery.each(measures, function(i, oColumn) {
        aMeasures.push({
            def : oColumn,
            adapter : oColumn._getAdapter()
        });
        flatTableDS.metadata.fields.push({
            'id' : oColumn.getName(),
            'semanticType' : 'Measure'
        });
    });

    // analyze data
    jQuery.each(aContexts, function(iIndex, oContext) {
        if (!flatTableDS.data[iIndex]) {
            flatTableDS.data[iIndex] = [];
        }
        for (var i = 0; i < aAxis.length; i++) {
            var value = aAxis[i].adapter(oContext);
            flatTableDS.data[iIndex].push(value);
        }
        for (var j = 0; j < aMeasures.length; j++) {
            var value = aMeasures[j].adapter(oContext);
            flatTableDS.data[iIndex].push(value);
        }
        aContextLookup[iIndex] = oContext;
    });
    this._aFlatContextLookup = aContextLookup;

    // finally create the VIZ flat table from the transformed data
    this._oVIZFlatTable = new sap.viz.api.data.FlatTableDataset(flatTableDS);
};
