/*
 * SAP InA UI Toolkit DU - New Wave Search and Analytics
 * version 0.0.0 - 2014-03-27 - commit unknown (inofficial dev version)
 * http://help.sap.com/hana_platform
 * Copyright (c) 2014 SAP AG; All rights reserved
 */

/*
 * @file Simple info access (SINA) API: Filter Interface
 * @namespace sap.bc.ina.api.sina.filter
 * @copyright Copyright (c) 2014 SAP AG. All rights reserved.
 * @ignore
 */

(function(global) {
    "use strict";

    if (global !== null) {
        global.sap = global.sap || {};
        global.sap.bc = global.sap.bc || {};
        global.sap.bc.ina = global.sap.bc.ina || {};
        global.sap.bc.ina.api = global.sap.bc.ina.api || {};
        global.sap.bc.ina.api.sina = global.sap.bc.ina.api.sina || {};

        global.sap.bc.ina.api.sina.expandPackage = function(global, packageName) {
            var structure = packageName.split('.');
            var walker = global;
            for (var ii = 0; ii < structure.length; ii++) {
                if (typeof walker[structure[ii]] === 'undefined') {
                    walker[structure[ii]] = {};
                }
                walker = walker[structure[ii]];
            }
        };
    }
}(typeof window === 'undefined' ? null : window));

(function(global, isXS) {

    "use strict";

    var executeFilter = function($) {
        if (!$) {
            $ = global.$;
        }

        // =========================================================================
        // create packages
        // =========================================================================

        if (!isXS) {
            global.sap.bc.ina.api.sina.expandPackage(global, 'sap.bc.ina.api.sina.filter');
        }

        var filter = global.sap.bc.ina.api.sina.filter;
        var module = filter;
        module.DataSource = function() {
            this.init.apply(this, arguments);
        };
        module.DataSourceMetaData = function() {
            this.init.apply(this, arguments);
        };
        module.Filter = function() {
            this.init.apply(this, arguments);
        };
        module.Condition = function() {
            this.init.apply(this, arguments);
        };
        module.ConditionGroup = function() {
            this.init.apply(this, arguments);
        };

        // =========================================================================
        // class datasource metadata
        // =========================================================================
        module.DataSourceMetaData.prototype = {
            init: function() {}
        };

        // =========================================================================
        // class datasource
        // =========================================================================
        module.DataSource.prototype = {

            /**
             * A generic data source for a query.
             * @constructs sap.bc.ina.api.sina.filter.DataSource
             * Use {sap.bc.ina.api.sina.sinabase.createDataSource} factory instead of this constructor.
             * @private
             */
            init: function() {},

            /**
             * Compares this datasource with another datasource.
             * @memberOf sap.bc.ina.api.sina.filter.DataSource
             * @instance
             * @param  {sap.bc.ina.api.sina.impl.inav2.filter.DataSource} the other datasource to be
             * compared against this datasource.
             * @return {boolean} true if they are equal, false otherwise
             */
            equals: function(otherDS) {},

            /**
             * Returns the metadata for this data source asynchronously from the server.
             * @ignore
             * @memberOf sap.bc.ina.api.sina.filter.DataSource
             * @instance
             * @param  {Function} callback Function will be called after the meta data arrives
             * from the server. This function must have one argument through which it will
             * receive the metadata object.
             */
            getMetaData: function(callback) {},

            /**
             * Returns the metadata for this data source synchronously from the server.
             * @ignore
             * @memberOf sap.bc.ina.api.sina.filter.DataSource
             * @instance
             * Warning: Calling the function will block the javascript thread until
             * a result has been received.
             * @return {sap.bc.ina.api.sina.impl.inav2.filter.DataSourceMetaData} The metadata for this datasource.
             */
            getMetaDataSync: function() {},

            getLabel: function() {},

            setLabel: function(label) {}

        };

        // =========================================================================
        // class filter
        // =========================================================================
        module.Filter.prototype = {

            /**
             * A simple filter for SINA queries.
             * Use sina.createFilter() method instead of this private constructor.
             * @constructs sap.bc.ina.api.sina.filter.Filter
             * @param  {Object} properties Configuration object.
             * @private
             * @since SAP HANA SPS 06
             * @ignore
             */
            init: function(properties) {
                properties = properties || {};
                this.setDataSource(properties.dataSource, false);
                this.root = null;
                this.conditionGroupsByAttribute = {};
                this.defaultConditionGroup = new module.ConditionGroup({
                    operator: 'And'
                });
                this.searchTerms = "";
            },

            addFilterConditionGroup: function(conditionGroup) {
                this.defaultConditionGroup.addCondition(conditionGroup);
            },

            /**
             * Adds a filter condition to the current set of filter conditions. By default
             * conditions of the same attribute will be 'OR'ed. Conditions between different
             * attributes will have an 'AND' operator.
             * @ignore
             * @memberOf sap.bc.ina.api.sina.filter.Filter
             * @instance
             * @since SAP HANA SPS 06
             * @param {String} attribute            Technical identifier of the attribute, as defined in the database.
             * @param {String} operator             Operator of the filter condition. The default value is "=".
             * @param {String} value                Value that should be filtered within the attribute.
             */
            addFilterCondition: function(attribute, operator, value) {
                // To be implemented by data provider
                return this;
            },

            getFilterConditions: function() {
                return this.defaultConditionGroup;
            },

            getSearchTerms: function() {
                return this.searchTerms;
            },

            hasFilterCondition: function(attribute, operator, value) {
                return this.defaultConditionGroup.hasCondition(new module.Condition(attribute, operator, value));
            },

            empty: function() {
                // To be implemented by data provider
                return this;
            },

            /**
             * Gets the data source that is currently in use by the filter instance.
             * @return {sap.bc.ina.api.sina.filter.DataSource} The data source instance.
             */
            getDataSource: function() {
                return this.dataSource;
            },

            removeFilterCondition: function(attribute, operator, value) {
                // To be implemented by data provider
                return this;
            },

            setSearchTerms: function(searchTerms) {
                this.searchTerms = searchTerms;
            },

            /**
             * Sets the data source for the filter.
             * @param dataSource A SINA data source.
             */
            setDataSource: function(dataSource) {
                this.dataSource = dataSource;
            },

            getJson: function() {
                // To be implemented by data provider
            }

        };

        // =========================================================================
        // class condition
        // =========================================================================
        module.Condition.prototype = {

            /**
             * Creates a new filter condition.
             * @ignore
             * @constructs sap.bc.ina.api.sina.impl.inav2.filter.Condition
             * @param {String|Object} attribute     Technical identifier of the attribute, as defined in the database.
             * If the type is Object, this object can have properties with the name and value of the arguments.
             * @param {String} operator             Operator of the filter condition. The default value is "=".
             * @param {String} value                Value that should be filtered in the attribute.
             */
            init: function(attribute, operator, value) {
                if ($.type(attribute) === 'object') {
                    var props = attribute;
                    attribute = props.attribute;
                    operator = props.operator;
                    value = props.value;
                }
                this.attribute = attribute || "";
                this.operator = operator || "=";
                this.value = value;
            },

            equals: function(otherCondition) {
                return this.attribute.toLowerCase() === otherCondition.attribute.toLowerCase() &&
                    this.operator === otherCondition.operator &&
                    this.value.toLowerCase() === otherCondition.value.toLowerCase();
            },

            getJson: function(parent) {
                // implement in provider
            },

            setJson: function(json) {
                // implement in provider
            },

            toString: function() {
                return this.attribute + this.operator + this.value + '';
            }

        };


        // =========================================================================
        // class condition group
        // =========================================================================
        module.ConditionGroup.prototype = {

            init: function(properties) {
                properties = properties || {};
                this.label = properties.label || '';
                this.conditions = properties.conditions || [];
                this.setOperator(properties.operator || 'And');
            },

            addCondition: function(condition) {
                this.conditions.push(condition);
                return this;
            },

            getConditions: function() {
                return this.conditions;
            },

            getConditionsAsArray: function(group, conditions) {
                conditions = conditions || [];
                group = group || this;
                for (var i = 0; i < group.conditions.length; i++) {
                    if (group.conditions[i] instanceof module.ConditionGroup) {
                        this.getConditionsAsArray(group.conditions[i], conditions);
                    } else {
                        conditions.push(group.conditions[i]);
                    }
                }
                return conditions;
            },

            hasCondition: function(condition) {
                var found = false;
                for (var i = 0, len = this.conditions.length; i < len; i++) {
                    var item = this.conditions[i];
                    if (item instanceof module.ConditionGroup) {
                        found = item.hasCondition(condition);
                    } else {
                        if (item.equals && item.equals(condition)) {
                            found = true;
                        }
                    }
                    if (found === true) {
                        break;
                    }
                }
                return found;
            },

            removeCondition: function(condition) {
                this.conditions.splice(this.conditions.indexOf(condition), 1);
                return this;
            },

            setLabel: function(label) {
                this.label = label;
                return this;
            },

            setOperator: function(operator) {
                switch (operator.toLowerCase()) {
                    case 'or':
                        operator = 'Or';
                        break;
                    case 'and':
                        operator = 'And';
                        break;
                    default:
                        throw {
                            message: 'unknown operator for condition group: ' + operator
                        };
                }
                this.operator = operator;
                return this;
            },

            toString: function() {
                return this.label;
            },

            getJson: function(parent) {
                // implement in provider
            },

            setJson: function(json) {
                // implement in provider
            }

        };
    };

    if (isXS) {
        executeFilter($.sap.bc.ina.api.sina.sinaxsjq.jq);
    } else if (typeof define === "function" && define.amd && !global.sap.ushell) { // only concatenated sina is in ushell repo!
        define(["jquery"], function($) {
            executeFilter($);
        });
    } else {
        executeFilter();
    }

}(typeof window === 'undefined' ? $ : window, typeof window === 'undefined'));

/*
 * @file The Simple Information Access (SINA) Interface
 * @namespace sap.bc.ina.api.sina.sinabase
 * @requires jQuery
 * @copyright Copyright (c) 2014 SAP AG. All rights reserved.
 */


(function(global, isXS) {

    "use strict";

    var executeSinaBase = function($) {
        if (!$) {
            $ = global.$;
        }

        // =========================================================================
        // package structure
        // =========================================================================
        if (!isXS) {
            global.sap.bc.ina.api.sina.expandPackage(global, 'sap.bc.ina.api.sina.sinabase');
        }

        var sinabase = global.sap.bc.ina.api.sina.sinabase;
        var filter = global.sap.bc.ina.api.sina.filter;
        var module = sinabase;
        var emptyFunction = function() {};

        // =========================================================================
        // provider registry
        // =========================================================================
        $.extend(module, {

            provider: {},

            registerProvider: function(provider) {
                this.provider[provider.impl_type] = provider;
            }

        });

        // =========================================================================
        // sina base class
        // =========================================================================
        module.Sina = function() {
            this.init.apply(this, arguments);
        };

        module.Sina.prototype = {

            /**
             * Sina base class. Use the getSina() factory in {@link sap.bc.ina.api.sina} instead
             * of using this private constructor directly.
             * @constructs sap.bc.ina.api.sina.sinabase.Sina
             * @since SAP HANA SPS 08
             * @private
             */
            init: function() {

            },

            _initQueryProperties: function(properties) {
                properties = properties || {};
                properties.system = properties.system || this.sinaSystem();
                if (properties.dataSource) {
                    properties.dataSource = new this._provider.DataSource(properties.dataSource);
                }
                return properties;
            },

            /**
             * Creates and returns a chart query for simple analytics.
             * @memberOf sap.bc.ina.api.sina.sinabase.Sina
             * @instance
             * @since SAP HANA SPS 06
             * @param  {Object} properties Configuration object.
             * @return {sap.bc.ina.api.sina.sinabase.ChartQuery} The instance of a chart query.
             * See {@link sap.bc.ina.api.sina.sinabase.ChartResultSet} for the result set format.
             * @example
             * <caption>Create a query that returns a result set suitable for a bar or pie chart:</caption>
             * var query = sap.bc.ina.api.sina.createChartQuery()
             * .dataSource({ schemaName : "SYSTEM",
             *               objectName : "J_EPM_PRODUCT"
             *  })
             * .addDimension("CATEGORY")
             * .addMeasure({ name : "CATEGORY",
             *               aggregationFunction : "COUNT"
             * }); //end of query
             * var resultSet = query.getResultSetSync();
             * var elements = resultSet.getElements();
             * // contents of elements:
             * [
                {
                  "label": "Others",
                  "labelRaw": "Others",
                  "value": "13",
                  "valueRaw": 13
                },
                {
                  "label": "Notebooks",
                  "labelRaw": "Notebooks",
                  "value": "10",
                  "valueRaw": 10
                },
                {
                  "label": "Flat screens",
                  "labelRaw": "Flat screens",
                  "value": "9",
                  "valueRaw": 9
                },
                {
                  "label": "Software",
                  "labelRaw": "Software",
                  "value": "8",
                  "valueRaw": 8
                },
                {
                  "label": "Electronics",
                  "labelRaw": "Electronics",
                  "value": "5",
                  "valueRaw": 5
                }
              ]
             */
            createChartQuery: function(properties) {
                properties = this._initQueryProperties(properties);
                return new this._provider.chartQuery(properties);
            },

            /**
             * Creates and returns a search query for text queries.
             * @memberOf sap.bc.ina.api.sina.sinabase.Sina
             * @instance
             * @since SAP HANA SPS 06
             * @param  {Object} properties Configuration object.
             * @return {sap.bc.ina.api.sina.sinabase.SearchQuery} The instance of a search query.
             * See {@link sap.bc.ina.api.sina.sinabase.SearchResultSet} for the result set format.
             * @example
             * <caption>Simple search for the term "basic" in view J_EPM_PRODUCT. If the term is
             * found in a column marked as freestyle search relevant, the content of columns
             * in the attributes array is returned, in this case PRODUCT_ID, TEXT, CATEGORY, PRICE,
             * and CURRENCY_CODE. The return attributes do not have to be marked as freestyle search relevant though.</caption>
             * var query = sap.bc.ina.api.sina.createSearchQuery({
                dataSource          : { schemaName  : "SYSTEM",
                                        objectName  : "J_EPM_PRODUCT" },
                attributes          : [ "PRODUCT_ID",
                                        "TEXT",
                                        "CATEGORY",
                                        "PRICE",
                                        "CURRENCY_CODE"],
                searchTerms         : "basic",
                skip                : 0,
                top                 : 5
               });
             * var resultSet = query.getResultSetSync();
             * var elements = resultSet.getElements();
             * // contents of elements:
             * [{ "PRODUCT_ID":{"label":"PRODUCT_ID","valueRaw":"HT-1000","value":"HT-1000"},
             *     "TEXT":{"label":"TEXT","valueRaw":"Notebook Basic 15 with 1,7GHz - 15","value":"Notebook Basic 15 with 1,7GHz - 15"},
             *     "CATEGORY":{"label":"CATEGORY","valueRaw":"Notebooks","value":"Notebooks"},
             *     "PRICE":{"label":"PRICE","valueRaw":"956.00","value":"956.00"},
             *     "CURRENCY_CODE":{"label":"CURRENCY_CODE","valueRaw":"EUR","value":"EUR"}},
             *     // second result item:
             *     {"PRODUCT_ID":{"label":"PRODUCT_ID","valueRaw":"HT-1001","value":"HT-1001"},
             *     "TEXT":{"label":"TEXT","valueRaw":"Notebook Basic 17 with 1,7GHz - 17","value":"Notebook Basic 17 with 1,7GHz - 17"},
             *     "CATEGORY":{"label":"CATEGORY","valueRaw":"Notebooks","value":"Notebooks"},
             *     "PRICE":{"label":"PRICE","valueRaw":"1249.00","value":"1249.00"},
             *     "CURRENCY_CODE":{"label":"CURRENCY_CODE","valueRaw":"EUR","value":"EUR"}},
             *     // third result item:
             *     {"PRODUCT_ID":{"label":"PRODUCT_ID","valueRaw":"HT-1002","value":"HT-1002"},
             *     "TEXT":{"label":"TEXT","valueRaw":"Notebook Basic 18 with 1,7GHz - 18","value":"Notebook Basic 18 with 1,7GHz - 18"},
             *     "CATEGORY":{"label":"CATEGORY","valueRaw":"Notebooks","value":"Notebooks"},
             *     "PRICE":{"label":"PRICE","valueRaw":"1570.00","value":"1570.00"},
             *     "CURRENCY_CODE":{"label":"CURRENCY_CODE","valueRaw":"USD","value":"USD"}},
             *     // fourth result item:
             *     {"PRODUCT_ID":{"label":"PRODUCT_ID","valueRaw":"HT-1003","value":"HT-1003"},
             *     "TEXT":{"label":"TEXT","valueRaw":"Notebook Basic 19 with 1,7GHz - 19","value":"Notebook Basic 19 with 1,7GHz - 19"},
             *     "CATEGORY":{"label":"CATEGORY","valueRaw":"Notebooks","value":"Notebooks"},
             *     "PRICE":{"label":"PRICE","valueRaw":"1650.00","value":"1650.00"},
             *     "CURRENCY_CODE":{"label":"CURRENCY_CODE","valueRaw":"EUR","value":"EUR"}},
             *     // fifth result item:
             *     {"PRODUCT_ID":{"label":"PRODUCT_ID","valueRaw":"HT-8000","value":"HT-8000"},
             *     "TEXT":{"label":"TEXT","valueRaw":"1,5 Ghz, single core, 40 GB HDD, Windows Vista Home Basic, 512 MB RAM","value":"1,5 Ghz, single core, 40 GB HDD, Windows Vista Home Basic, 512 MB RAM"},
             *     "CATEGORY":{"label":"CATEGORY","valueRaw":"Notebooks","value":"Notebooks"},
             *     "PRICE":{"label":"PRICE","valueRaw":"799.00","value":"799.00"},
             *     "CURRENCY_CODE":{"label":"CURRENCY_CODE","valueRaw":"EUR","value":"EUR"}}
             *  ]
             * @example
             * <caption>The same search as in the previous example but now with term highlighting. If the term
             * "basic" is found in the TEXT attribute, it will be returned as &lt;b&gt;basic&lt;/b&gt;.
             * The parameter maxLength defines the length of chars to be returned.
             * The parameter startPosition defines start position of chars to be returned.
             * The maxLength and startPosition parameters can be omitted. In this case, the default values
             * shown in the example below are used.</caption>
             * var searchQuery = sap.bc.ina.api.sina.createSearchQuery({
             *  dataSource          : { "schemaName"  :  "SYSTEM" ,
             *                          "objectName"  :  "J_EPM_PRODUCT" },
             *  attributes          : [ "PRODUCT_ID",
             *                          { attributeName: "TEXT", highlighted:true,
             *                            maxLength:30000, startPosition:1 } ],
             *  searchTerms         : "basic",
             *  skip                : 0,
             *  top                 : 5
             * });
             *  var resultSet = searchQuery.getResultSetSync();
             *  var searchResults = resultSet.getElements();
             * @example
             * <caption>The same search as in the previous example, but now with the snippet function. If the term
             * "basic" is found in the TEXT attribute
             * the content is shortened and will begin and end with three dots (...)
             * In addition to the snippet, the search term is highlighted the same way as in the highlighted function (see previous example).
             * It is therefore not necessary to use highlighted and snippet for the same attribute.
             * </caption>
             * var searchQuery = sap.bc.ina.api.sina.createSearchQuery({
             *  dataSource          : { "schemaName"  :  "SYSTEM" ,
             *                          "objectName"  :  "J_EPM_PRODUCT" },
             *  attributes          : [ "PRODUCT_ID",
             *                          { attributeName: "TEXT", snippet:true } ],
             *  searchTerms         : "basic",
             *  skip                : 0,
             *  top                 : 5
             * });
             *  var resultSet = searchQuery.getResultSetSync();
             *  var searchResults = resultSet.getElements();
             */
            createSearchQuery: function(properties) {
                properties = this._initQueryProperties(properties);
                return new this._provider.searchQuery(properties);
            },



            /**
             * Creates a chart query that delivers a result set suitable for a group bar chart.
             * @memberOf sap.bc.ina.api.sina.sinabase.Sina
             * @instance
             * @since SAP HANA SPS 06
             * @param  {Object} properties Configuration object.
             * @return {sap.bc.ina.api.sina.sinabase.GroupBarChartQuery} The instance of a chart query.
             * See {@link sap.bc.ina.api.sina.sinabase.GroupBarChartResultSet} for the result set format.
             * @example
             * <caption>Grouped bar chart query with two dimensions and one measure:</caption>
             * var query = sap.bc.ina.api.sina.sina.createGroupBarChartQuery({
             *      dataSource : { "schemaName"  :  "SYSTEM" ,
             *                     "objectName"  :  "J_EPM_PRODUCT" },
             *      dimensions : ['YEAR', 'COUNTRY'],
             *      measures   : [{ name: 'PROFIT', aggregationFunction: 'SUM' }]
             *  });
             *  var resultSet = query.getResultSetSync();
             *  var elements = resultSet.getElements();
             * @example
             *  <caption>Grouped bar chart query with two dimensions and one measure:</caption>
             * var query = sap.bc.ina.api.sina.sina.createGroupBarChartQuery();
             * query.dataSource({ schemaName : "SYSTEM",
             *                    objectName : "J_EPM_PRODUCT"
             * });
             * query.addDimension('CURRENCY_CODE');
             * query.addDimension('CATEGORY');
             * query.count('PRODUCT_ID');
             * var resultSet = query.getResultSetSync();
             * var elements = resultSet.getELements();
             * // contents of elements:
             * [
                {
                  "label": "EUR",
                  "value": [
                    {
                      "label": "Notebooks",
                      "value": [
                        {
                          "label": "COUNT",
                          "value": {
                            "value": "6",
                            "valueRaw": 6
                          }
                        }
                      ]
                    },
                    {
                      "label": "Others",
                      "value": [
                        {
                          "label": "COUNT",
                          "value": {
                            "value": "5",
                            "valueRaw": 5
                          }
                        }
                      ]
                    },
                    {
                      "label": "Software",
                      "value": [
                        {
                          "label": "COUNT",
                          "value": {
                            "value": "3",
                            "valueRaw": 3
                          }
                        }
                      ]
                    }
                  ]
                }
                ]
             */
            createGroupBarChartQuery: function(properties) {
                properties = this._initQueryProperties(properties);
                return new this._provider.groupBarChartQuery(properties);
            },


            /**
             * Creates a chart query that delivers a result set suitable for a line chart.
             * @memberOf sap.bc.ina.api.sina.sinabase.Sina
             * @instance
             * @since SAP HANA SPS 06
             * @param  {Object} properties Configuration object.
             * @return {sap.bc.ina.api.sina.sinabase.LineChartQuery} Instance of a chart query.
             * See {@link sap.bc.ina.api.sina.sinabase.LineChartResultSet} for the result set format.
             * @example
             *  <caption>Line chart with two dimensions and one measure:</caption>
             * var queryProperties = {
             *     dataSource      : { schemaName  : "SYSTEM",
                                       objectName  : "J_EPM_PRODUCT"
                                     },
                   dimensionX      : {name: 'CATEGORY'},
                   dimensionLine   : {name: 'CURRENCY_CODE'},
                   measureY        : {name: 'PRODUCT_ID', aggregationFunction: 'COUNT'}
               };
               query = sap.bc.ina.api.sina.sina.createLineChartQuery(queryProperties);
             * var resultSet = query.getResultSetSync();
             * var elements = resultSet.getEements();
             * // contents of elements (shortened):
             * [
                 {
                   "label": "EUR",
                   "value": [
                     {
                       "x": "Notebooks",
                       "y": 6
                     },
                     {
                       "x": "Others",
                       "y": 5
                     },
                     {
                       "x": "Software",
                       "y": 3
                     },
                     {
                       "x": "Speakers",
                       "y": 3
                     },
                     {
                       "x": "Electronics",
                       "y": 2
                     },
                     {
                       "x": "Flat screens",
                       "y": 2
                     },
                     {
                       "x": "Laser printers",
                       "y": 2
                     },
                     {
                       "x": "Mice",
                       "y": 2
                     },
                     {
                       "x": "PC",
                       "y": 2
                     },
                     {
                       "x": "Workstation ensemble",
                       "y": 2
                     }
                   ]
                 },
                 {
                   "label": "USD",
                   "value": [
                     {
                       "x": "Others",
                       "y": 4
                     },
                     {
                       "x": "Flat screens",
                       "y": 2
                     },
                     {
                       "x": "Handhelds",
                       "y": 2
                     },
                     {
                       "x": "High Tech",
                       "y": 2
                     },
                     {
                       "x": "Notebooks",
                       "y": 2
                     },
                     {
                       "x": "Software",
                       "y": 2
                     },
                     {
                       "x": "Electronics",
                       "y": 1
                     },
                     {
                       "x": "Graphic cards",
                       "y": 1
                     },
                     {
                       "x": "Handheld",
                       "y": 1
                     },
                     {
                       "x": "Headset",
                       "y": 1
                     }
                   ]
                 }
              ]
             */
            createLineChartQuery: function(properties) {
                properties = this._initQueryProperties(properties);
                properties.dimensions = [properties.dimensionLine, properties.dimensionX];
                properties.measures = [{
                    name: properties.measureY.name,
                    aggregationFunction: properties.measureY.aggregationFunction
                }];
                return new this._provider.lineChartQuery(properties);
            },

            /**
             * Creates and returns a suggestion for text queries.
             * @memberOf sap.bc.ina.api.sina.sinabase.Sina
             * @instance
             * @since SAP HANA SPS 06
             * @param  {Object} properties Configuration object.
             * @return {sap.bc.ina.api.sina.sinabase.SuggestionQuery} The instance of a suggestion query.
             * @example
             * <caption>Getting suggestions asynchronously for attributes CATEGORY
             * and PRODUCT_ID:</caption>
             *  var properties = {
             *      dataSource : { "schemaName"  : "SYSTEM",
             *                    "objectName"  : "J_EPM_PRODUCT"
             *                   },
             *      searchTerms : "s*",
             *      top   : 10,
             *      skip  : 0,
             *      onSuccess : function(resultset) {
             *                        var suggestions = resultset.getElements();
             *                        console.dir(suggestions);
             *      },
             *      onError :   function(error){
             *                        console.error(error);
             *      },
             *      attributes : ["CATEGORY","PRODUCT_ID"]
             *  };
             *  var suggestion_query = sap.bc.ina.api.sina.sina.createSuggestionQuery(properties);
             *  suggestion_query.getResultSet(); //returns immediately, see onSuccess on how to go on
             */
            createSuggestionQuery: function(properties) {
                properties = this._initQueryProperties(properties);
                return new this._provider.suggestionQuery(properties);
            },


            /**
             * Creates and returns a perspective query.
             * @ignore
             * @since SAP HANA SPS 06
             * @memberOf sap.bc.ina.api.sina.sinabase.Sina
             * @instance
             * @private
             * @param  {Object} properties Configuration object.
             * @return {sap.bc.ina.api.sina.sinabase.PerspectiveQuery} The instance of a perspective query.
             */
            createPerspectiveQuery: function(properties) {
                properties = this._initQueryProperties(properties);
                return new this._provider.perspectiveQuery(properties);
            },

            /**
             * Creates and returns a perspective searcg query.
             * @ignore
             * @since SAP HANA SPS 07
             * @memberOf sap.bc.ina.api.sina.sinabase.Sina
             * @instance
             * @private
             * @param  {Object} properties Configuration object.
             * @return {sap.bc.ina.api.sina.sinabase.PerspectiveSearchQuery} The instance of a perspective search query.
             */
            createPerspectiveSearchQuery: function(properties) {
                properties = this._initQueryProperties(properties);
                return new this._provider.perspectiveSearchQuery(properties);
            },

            /**
             * Creates and returns a perspective query.
             * @ignore
             * @since SAP HANA SPS 07
             * @memberOf sap.bc.ina.api.sina.sinabase.Sina
             * @instance
             * @private
             * @param  {Object} properties Configuration object.
             * @return {sap.bc.ina.api.sina.sinabase.PerspectiveQuery} The instance of a perspective query.
             */
            createPerspectiveGetQuery: function(properties) {
                properties = this._initQueryProperties(properties);
                return new this._provider.perspectiveGetQuery(properties);
            },

            /**
             * Gets or sets a system that will be used for data access. The system must have the
             * INA V2 service up and running.
             * @ignore
             * @since SAP HANA SPS 06
             * @memberOf sap.bc.ina.api.sina.sinabase.Sina
             * @instance
             * @param  {sap.bc.ina.api.sina.system.System|sap.bc.ina.api.sina.system.System} sys The system representation.
             * @return {sap.bc.ina.api.sina.system.System|sap.bc.ina.api.sina.system.System} The system currently set,
             * but only if no parameter has been set.
             */
            sinaSystem: function(sys) {
                // must not be named system or it would overwrite sap.bc.ina.api.sina.system module!
                if (sys) {
                    this.sys = sys;
                } else {
                    return this.sys;
                }
                return {};
            },

            createFacet: function(properties) {
                return new this._provider.Facet(properties);
            },

            FacetType: {
                ATTRIBUTE: "attribute",
                DATASOURCE: "datasource",
                SEARCH: "searchresult"
            },

            createFilter: function(properties) {
                return new this._provider.Filter(properties);
            },

            createFilterCondition: function(properties) {
                return new this._provider.FilterCondition(properties);
            },

            createFilterConditionGroup: function(properties) {
                return new this._provider.FilterConditionGroup(properties);
            },

            createDataSource: function(properties) {
                return new this._provider.DataSource(properties);
            }

        };

        // =========================================================================
        // query
        // =========================================================================
        module.Query = function() {
            this.init.apply(this, arguments);
        };
        module.Query.prototype = {

            /**
             *  The base query for chart, search, and suggestions queries.
             *  Use the sina.create*Query factory methods instead of this class.
             *  @constructs sap.bc.ina.api.sina.sinabase.Query
             *  @private
             */
            init: function(properties) {
                properties = properties || {};
                this.system = properties.system;
                this.onSuccess = properties.onSuccess;
                this.onError = properties.onError;
                this._responseJson = null;
                this.setTop(properties.top || 10);
                this.setSkip(properties.skip || 0);
                // this.resultSet = properties.resultSet || null;
                this.resultSetProperties = properties;
                this.filterConditions = properties.filterConditions || null;
                this.filter = this.filter || properties.filter || new filter.Filter({
                    dataSource: properties.dataSource
                });
                this.setSearchTerms(properties.searchTerms || '');
            },


            /**
             * Returns or sets a new data source for this query. If no
             * parameters are given, the current data source is returned.
             * Otherwise, the data source is set.
             * @instance
             * @memberOf sap.bc.ina.api.sina.sinabase.Query
             * @param {sap.bc.ina.api.sina.sinabase.filter.DataSource|Object} newDataSource The current data source of this query.
             * This can be an instance of sap.bc.ina.api.sina.sinabase.filter.DataSource or it can be a plain object, like
             * { "schemaName"  : "SYSTEM",
             *   "objectName"  : "J_EPM_PRODUCT" };
             * that the system uses to create an instance of sap.bc.ina.api.sina.sinabase.filter.DataSource.
             * @return {sap.bc.ina.api.sina.sinabase.filter.DataSource|sap.bc.ina.api.sina.sinabase.Query} The current
             * data source of this query if no parameter is supplied, otherwise "this".
             */
            dataSource: function(newDataSource) {
                if (newDataSource) {
                    this.setDataSource(newDataSource);
                    return this;
                } else {
                    return this.getDataSource();
                }
            },

            /**
             * Gets the data source object for this query.
             * @memberOf sap.bc.ina.api.sina.sinabase.Query
             * @instance
             * @return {sap.bc.ina.api.sina.sinabase.filter.DataSource} The data source for this query.
             */
            getDataSource: function() {
                return this.filter.getDataSource();
            },

            /**
             * Sets the data source for this query object. Results already retrieved by this query are deleted.
             * @memberOf sap.bc.ina.api.sina.sinabase.Query
             * @instance
             * @param {sap.bc.ina.api.sina.sinabase.filter.DataSource|Object} dataSource The current data source of this query.
             * This can be an instance of sap.bc.ina.api.sina.sinabase.filter.DataSource or it can be a plain object, like
             * { "schemaName"  : "SYSTEM",
             *   "objectName"  : "J_EPM_PRODUCT" };
             * that the system uses to create an instance of sap.bc.ina.api.sina.sinabase.filter.DataSource
             */
            setDataSource: function(dataSource) {
                if (dataSource === undefined) {
                    return this;
                }
                if (this.filter.getDataSource() === undefined) {
                    this.filter.setDataSource(dataSource);
                    this._resetResultSet();
                    return this;
                }
                if (!this.filter.getDataSource().equals(dataSource)) {
                    this.filter.setDataSource(dataSource);
                    this._resetResultSet();
                }
                return this;
            },

            /**
             * Returns the filter instance for this query.
             * @memberOf sap.bc.ina.api.sina.sinabase.Query
             * @instance
             * @return {sap.bc.api.sina.sinabase.filter.Filter} The filter instance for this query object.
             */
            getFilter: function() {
                return this.filter;
            },

            /**
             * Sets the new filter instance for this query. Results already retrieved by this query are deleted.
             * @memberOf sap.bc.ina.api.sina.sinabase.Query
             * @instance
             * @param {sap.bc.api.sina.sinabase.filter.Filter} filterInstance The filter instance to be used by this query.
             */
            setFilter: function(filterInstance) {
                this.filter = filterInstance;
                this._resetResultSet();
                return this;
            },

            /**
             * Sets the search terms for this query. Results already retrieved by this query are deleted.
             * @memberOf sap.bc.ina.api.sina.sinabase.Query
             * @instance
             * @param {String} terms The search terms to searched for by this query.
             */
            setSearchTerms: function(terms) {
                if (this.filter.getSearchTerms() !== terms) {
                    this.filter.setSearchTerms(terms);
                    this._resetResultSet();
                }
                return this;
            },

            /**
             * Returns the search terms currently set.
             * @memberOf sap.bc.ina.api.sina.sinabase.Query
             * @instance
             * @return {String} The search terms.
             */
            getSearchTerms: function() {
                return this.filter.getSearchTerms();
            },

            /**
             * Returns or sets a new skip value for this query. If no
             * parameter is given, the current skip value is returned.
             * Otherwise, the skip value is set.
             * @instance
             * @memberOf sap.bc.ina.api.sina.sinabase.Query
             * @param  {int} newSkip The new skip value for this query.
             * @return {int|sap.bc.ina.api.sina.sinabase.Query} The current skip value of this query if no parameter
             * was supplied, otherwise "this".
             */
            skip: function(newSkip) {
                if (newSkip !== undefined) {
                    this.setSkip(newSkip);
                } else {
                    return this._skip;
                }
                return this;
            },

            /**
             * Returns the skip value of this query.
             * @memberOf sap.bc.ina.api.sina.sinabase.Query
             * @instance
             * @return {int} The current skip value of this query.
             */
            getSkip: function() {
                //underscore is needed because of the skip function in Query
                return this._skip;
            },

            /**
             * Sets the skip value for this query.
             * To use the new skip value, call getResultSet again.
             * @memberOf sap.bc.ina.api.sina.sinabase.Query
             * @instance
             * @param {int} skip The skip value for this query.
             */
            setSkip: function(skip) {
                if (typeof skip !== "number") {
                    return false;
                }
                this._skip = this._skip || undefined;
                if (this._skip !== skip) {
                    this._skip = skip;
                    this._resetResultSet();
                }
                return this;
            },

            /**
             * Returns or sets a new top value for this query. If no
             * parameter is given, the current top value is returned.
             * Otherwise, the top value is set.
             * @instance
             * @memberOf sap.bc.ina.api.sina.sinabase.Query
             * @param  {int} newTop The new top value for this query.
             * @return {int|sap.bc.ina.api.sina.sinabase.Query} The current top value of this query if no parameter
             * was supplied, otherwise "this".
             */
            top: function(newTop) {
                if (newTop !== undefined) {
                    this.setTop(newTop);
                } else {
                    return this._top;
                }
                return this;
            },

            /**
             * Returns the top value of this query.
             * @memberOf sap.bc.ina.api.sina.sinabase.Query
             * @instance
             * @return {int} The current top value of this query.
             */
            getTop: function() {
                //underscore is needed because of the top function in Query
                return this._top;
            },

            /**
             * Sets the top value for this query.
             * To use the new top value, call getResultSet of this query again.
             * @memberOf sap.bc.ina.api.sina.sinabase.Query
             * @instance
             * @param {int} top The new top value of this query.
             */
            setTop: function(top) {
                if (typeof top !== "number") {
                    return false;
                }
                this._top = this._top || undefined;
                if (this._top !== top) {
                    this._top = top;
                    this._resetResultSet();
                }
                return this;
            },

            /**
             * Adds a filter condition for this query.
             * In the standard setting, the filter uses the AND operator for filter conditions on different
             * attributes and the OR operator for filter conditions on the same attribute.
             * @memberOf sap.bc.ina.api.sina.sinabase.Query
             * @instance
             * @param {String} attribute The attribute that the filter condition is applied to.
             * @param {String} operator  The operator used to filter the value.
             * @param {String} value     The value of the attribute to be filtered in conjunction with the operator.
             * @return {sap.bc.ina.api.sina.sinabase.Query} this
             * @example
             *  var query = sap.bc.ina.api.sina.createChartQuery();
             *  query.addFilterCondition("CATEGORY", "=", "Notebooks")
             *  .addFilterCondition("PRICE","<","1000")
             *  .addFilterCondition("CURRENCY_CODE", "=", "EUR");
             */
            addFilterCondition: function(attribute, operator, value) {
                // if (!(this.filter instanceof filter.Filter)) {
                //     this.filter = new filter.Filter();
                // }
                if (this.filter.hasFilterCondition(attribute, operator, value) === false) {
                    this.filter.addFilterCondition(attribute, operator, value);
                    this._resetResultSet();
                }
                return this;
            },

            /**
             * Removes a previously added filter condition.
             * @memberOf sap.bc.ina.api.sina.sinabase.Query
             * @instance
             * @param {String} attribute The attribute that the filter condition was applied to.
             * @param {String} operator  The operator that was used to filter the value.
             * @param {String} value     The value of the attribute that was filtered in conjunction with the operator.
             * @return {sap.bc.ina.api.sina.sinabase.Query} this
             * @example
             *  query.removeFilterCondition("CATEGORY", "=", "Notebooks")
             *  .removeFilterCondition("PRICE","<","1000")
             *  .removeFilterCondition("CURRENCY_CODE", "=", "EUR");
             */
            removeFilterCondition: function(attribute, operator, value) {
                // if (!(this.filter instanceof filter.Filter)) {
                //     this.filter = new filter.Filter();
                // }
                this.filter.removeFilterCondition(attribute, operator, value);
                this._resetResultSet();
                return this;
            },

            resetFilterConditions: function() {
                this.filter.resetFilterConditions();
                this._resetResultSet();
                return this;
            },

            /**
             * Returns the result set of the query synchronously. This function blocks the JS
             * thread until the server call is made. Use getResultSet() for an asynchronous version
             * of this function that does not block the thread.
             * @memberOf sap.bc.ina.api.sina.sinabase.Query
             * @instance
             * @return {Object} The result set of this query. Call getElements() on this object to
             * get the result set elements.
             */
            getResultSetSync: function() {
                this.resultSet = this.executeSync();
                return this.resultSet;
            },

            /**
             * Returns the result set of the query asynchronously.
             * @memberOf sap.bc.ina.api.sina.sinabase.Query
             * @instance
             * @param  {function} onSuccess This function is called once  the result has been
             * retrieved from the server. The first parameter of this function is the result set.
             * The result set has the function getElements() . This contains  all result set elements.
             * @param  {function} onError This function is called if the result set of the query could
             * not be retrieved from the server. The first argument is an error object.
             * @return {Object} returns a jQuery Promise Object, see {@link http://api.jquery.com/Types/#Promise}
             * for more informations.
             */
            getResultSet: function(onSuccess, onError) {
                var self = this;
                onSuccess = onSuccess || this.onSuccess || emptyFunction;
                onError = onError || this.onError || emptyFunction;
                var resultSetDeferred = this.execute();
                resultSetDeferred.done(function(resultSet) {
                    self.resultSet = resultSet;
                    onSuccess(resultSet);
                });
                resultSetDeferred.fail(function(err) {
                    onError(err);
                });
                return resultSetDeferred.promise();
            },

            // =========================================================================
            // methods to be implemented by data providers
            // =========================================================================

            _resetResultSet: function() {

            },

            execute: function() {

            },

            executeSync: function() {

            },


        };

        // =========================================================================
        // chart query
        // =========================================================================
        module.ChartQuery = function() {
            this.init.apply(this, arguments);
        };
        module.ChartQuery.prototype = $.extend({}, module.Query.prototype, {

            /**
             * A query that yields results suitable for simple chart controls, like
             * pie or bar charts.
             * @since SAP HANA SPS 08
             * @constructs sap.bc.ina.api.sina.sinabase.ChartQuery
             * @augments {sap.bc.ina.api.sina.sinabase.Query}
             * @private
             */
            init: function() {
                module.Query.prototype.init.apply(this, arguments);
            }

        });

        // =========================================================================
        // class facet
        // =========================================================================
        module.FacetType = module.Sina.prototype.FacetType;
        module.Facet = function() {
            this.init.apply(this, arguments);
        };
        module.Facet.prototype = {

            /**
             * A facet that is contained in a perspective.
             * @ignore
             * @constructs sap.bc.ina.api.sina.sinabase.Facet
             */
            init: function(properties) {
                properties = properties || {};
                this.title = properties.title || "";
                this.query = properties.query || null;
                properties.facetType = properties.facetType || "";
                this.facetType = properties.facetType.toLowerCase();
                if (properties.query) {
                    this.setQuery(properties.query);
                }
            },

            getChartType: function() {},

            getTitle: function() {
                return this.title;
            },

            getDimension: function() {
                return this.dimension;
            },

            getQuery: function() {
                return this.query;
            },

            getLayout: function() {},

            getLayoutBinding: function() {},

            getColorPalette: function() {},

            setQuery: function(query) {
                this.query = query;
            }

        };

        // =========================================================================
        // perspective query
        // =========================================================================
        module.PerspectiveQuery = function() {
            this.init.apply(this, arguments);
        };
        module.PerspectiveQuery.prototype = $.extend({}, module.Query.prototype, {
            init: function() {
                module.Query.prototype.init.apply(this, arguments);
                this.facets = [];
            },

            addFacet: function(facet) {
                this.facets.push(facet);
                return this;
            },

            getFacets: function() {
                return this.facets;
            },

            /**
             * Sets how the result will be ordered.
             * @memberOf sap.bc.ina.api.sina.sinabase.PerspectiveQuery
             * @instance
             * @param {Object|Array} orderBy If orderBy is an object, it must have the
             * properties 'orderBy' (string) and 'sortOrder' (string).
             * The orderBy property can either be the name of a database attribute that
             * the result will be sorted alphabetically for, or it can be the special
             * '$$score$$' string. The result will then be ordered according to the SAP HANA
             * Score function.
             * This function can also receive an array of these objects for multiple
             * order-by values, for example to order by $$score$$ and then alphabetically
             * for an attribute. The result will then be ordered after the first entry.
             * If two results have the same rank however, they will be ordered after the
             * second order-by value, and so on.
             * @default {orderBy:'$$score$$', sortOrder:'DESC'}
             * See {@link sap.bc.ina.api.sina.sinabase.Sina#createSearchQuery} for examples.
             */
            setOrderBy: function(orderBy) {
                this._resetResultSet();
                this.orderBy = orderBy || {
                    orderBy: '$$score$$',
                    sortOrder: 'DESC'
                };
                return this;
            }
        });

        // =========================================================================
        // search query
        // =========================================================================
        module.SearchQuery = function() {
            this.init.apply(this, arguments);
        };
        module.SearchQuery.prototype = $.extend({}, module.Query.prototype, {

            /**
             * A query that yields results suitable for a simple result list.
             * @constructs sap.bc.ina.api.sina.sinabase.SearchQuery
             * @augments {sap.bc.ina.api.sina.sinabase.Query}
             * @private
             */
            init: function() {
                module.Query.prototype.init.apply(this, arguments);
            }
        });

        // =========================================================================
        // suggestion query
        // =========================================================================
        module.SuggestionQuery = function() {
            this.init.apply(this, arguments);
        };
        module.SuggestionQuery.prototype = $.extend({}, module.Query.prototype, {

            /**
             * A SINA suggestion query.
             * Use {@link sap.bc.ina.api.sina.sinabase.Sina.createSuggestionQuery} instead
             * of this private constructor.
             * @constructs sap.bc.ina.api.sina.sinabase.SuggestionQuery
             * @augments {sap.bc.ina.api.sina.sinabase.Query}
             * @param  {Object} properties Configuration object.
             * @since SAP HANA SPS 08
             * @private
             */
            init: function() {
                module.Query.prototype.init.apply(this, arguments);
            }
        });

        // =========================================================================
        // class Sina Error
        // =========================================================================
        module.SinaError = function() {
            this.init.apply(this, arguments);
        };

        module.SinaError.SEVERITY_ERROR = 3;
        module.SinaError.SEVERITY_WARNING = 2;
        module.SinaError.SEVERITY_INFO = 1;
        module.SinaError.prototype = {

            /**
             * A sina error that is contained in a perspective.
             * @ignore
             * @constructs sap.bc.ina.api.sina.sinabase.SinaError
             */
            init: function(properties) {
                this.SEVERITY_ERROR = 3;
                this.SEVERITY_WARNING = 2;
                this.SEVERITY_INFO = 1;
                this.message = properties.message || "";
                this.errorCode = properties.errorCode || null;
                this.severity = properties.severity || module.SinaError.ERROR;
            },

            getErrorCode: function() {
                return this.errorCode;
            },

            getMessage: function() {
                return this.message;
            },

            getSeverity: function() {
                return this.severity;
            },
            setSeverity: function(severity) {
                this.severity = severity;
            }

        };

    };

    if (isXS) {
        executeSinaBase($.sap.bc.ina.api.sina.sinaxsjq.jq);
    } else if (typeof define === "function" && define.amd && !global.sap.ushell) { // only concatenated sina is in ushell repo!
        define(["jquery"], function($) {
            executeSinaBase($);
        });
    } else {
        executeSinaBase();
    }

}(typeof window === 'undefined' ? $ : window, typeof window === 'undefined'));

/*
 * @file Simple info access (SINA) API: System representation
 * @ignore
 * @namespace global.sap.bc.ina.api.sina.system
 * @copyright Copyright (c) 2013 SAP AG. All rights reserved.
 */

(function(global, isXS) {

    "use strict";

    var executeSystem = function($) {

        // =========================================================================
        // create packages
        // =========================================================================
        if (!$) {
            $ = global.$;
        }
        if (!isXS) {
            global.sap.bc.ina.api.sina.expandPackage(global, 'sap.bc.ina.api.sina.system');
            global.sap.bc.ina.api.sina.expandPackage(global, 'sap.bc.ina.api.sina.proxy');
        }

        var module = global.sap.bc.ina.api.sina.system;
        var proxy = global.sap.bc.ina.api.sina.proxy;

        module.System = function() {
            this.init.apply(this, arguments);
        };
        module.Service = function() {
            this.init.apply(this, arguments);
        };
        module.Capability = function() {
            this.init.apply(this, arguments);
        };

        // =========================================================================
        // Capabilities
        // =========================================================================

        module.Capability.prototype = {
            /**
             * Describes a capability offered by a service.
             * @ignore
             * @constructs sap.bc.ina.api.system.Capability
             * @param {Object} properties Configures the capability instance with this
             * object.
             */
            init: function(properties) {
                this.properties = properties || {};
                this.name = this.properties.Capability || "";
                this.minVersion = this.properties.MinVersion || 0;
                this.maxVersion = this.properties.MaxVersion || 0;
            }

        };

        // =========================================================================
        // Service
        // =========================================================================
        module.Service.prototype = {

            /**
             * Describes the services offered by a system.
             * @ignore
             * @constructs sap.bc.ina.api.system.Service
             *
             * @param  {Object} properties Configuration object.
             */
            init: function(properties) {
                this.properties = properties || {};
                this.name = this.properties.Service;
                this.minVersion = this.properties.MinVersion || 0;
                this.maxVersion = this.properties.MaxVersion || 0;
                this.capabilities = {};
                for (var i = 0; i < this.properties.Capabilities.length; i++) {
                    this.capabilities[this.properties.Capabilities[i].Capability] = new module.Capability(this.properties.Capabilities[i]);
                }

            },

            getCapability: function(name) {
                return this.capabilities[name];
            },

            getCapabilities: function() {
                return this.capabilities;
            }

        };

        // =========================================================================
        // system
        // =========================================================================

        module.System.prototype = {

            /**
             * A system representation that offers services to SINA.
             * @ignore
             * @constructs sap.bc.ina.api.system.System
             * @param  {Object} properties Configuration object.
             */
            init: function(properties) {
                this.properties = properties || {};
                this.services = {};
                this.proxy = properties.proxy || new proxy.Proxy();
            },

            getService: function(name) {
                return this.services[name];
            },

            getServices: function() {
                return this.services;
            },

            getSystemType: function() {
                return this.systemType;
            },

            _deleteServerInfo: function() {
                this.jqXHR = jQuery.Deferred();
            },

            _getServerInfo: function(isAsync) {
                var self = this;

                if (self.jqXHR) {
                    return self.jqXHR.promise();
                }

                self.jqXHR = $.Deferred();
                var request = {
                    async: isAsync,
                    type: "GET",
                    url: self.infoUrl,
                    getServerInfo: true,
                    processData: false,
                    contentType: 'application/json',
                    dataType: 'json'
                };
                self.proxy.ajax(request)
                    .done(function(data) {
                        self.setServerInfo(data);
                        self.jqXHR.resolve(self.properties);

                    })
                    .fail(function(err) {
                        self.jqXHR.reject(err);
                    });
                if (isAsync === true) {
                    return self.jqXHR.promise();
                }
                return self.properties;
            },

            getServerInfo: function() {
                return this._getServerInfo(true);
            },

            getServerInfoSync: function() {
                return this._getServerInfo(false);
            },

            setServerInfo: function(json) {
                this.properties.rawServerInfo = json;
            }

        };
    };

    if (isXS) {
        executeSystem($.sap.bc.ina.api.sina.sinaxsjq.jq);
    } else if (typeof define === "function" && define.amd && !global.sap.ushell) { // only concatenated sina is in ushell repo!
        define(["jquery"], function($) {
            executeSystem($);
        });
    } else {
        executeSystem();
    }

}(typeof window === 'undefined' ? $ : window, typeof window === 'undefined'));

/*
 * @file Proxy which offers some extras for ajax calls.
 * @namespace sap.bc.ina.api.sina.proxy
 * @copyright Copyright (c) 2014 SAP AG. All rights reserved.
 * @ignore
 */
(function(global, isXS) {

    "use strict";

    var executeProxy = function($) {
        // =========================================================================
        // create packages
        // =========================================================================
        if (!isXS) {
            global.sap.bc.ina.api.sina.expandPackage(global, 'sap.bc.ina.api.sina.proxy');
        }

        global.sap.bc.ina.api.sina.proxy.record = global.sap.bc.ina.api.sina.proxy.record || {};
        global.sap.bc.ina.api.sina.proxy.record.recordings = [];

        var module = global.sap.bc.ina.api.sina.proxy;
        module.Proxy = function() {
            this.init.apply(this, arguments);
        };

        // =========================================================================
        // import packages
        // =========================================================================

        //-----------------------------------------------------------------------------
        // Receives service calls from data boxes and forwards them to server side, either
        // as single GET requests or as POST with GETs as payload.
        //-----------------------------------------------------------------------------
        module.inaReqResBuffer = {};

        module.Proxy.prototype = {

            init: function(properties) {
                var self = this;
                self.properties = properties || {};
                self.xsrfToken = "";
                self.xsrfService = self.properties.xsrfService;
                self.xsrfRetries = 0;
                self.properties.cachelifetime = self.properties.cachelifetime || 0;
                // log.debug('sina: cachelifetime is '+self.properties.cachelifetime);
                self.properties.httpMethod = self.properties.httpMethod || 'post';
                // log.debug('sina: httpMethod is '+self.properties.httpMethod);
                // adjust cachelifetime in config.js, not here!

                if (isXS) {
                    return;
                }

                if (self.properties.cachelifetime > 0) {
                    global.window.setInterval(function() {
                        // log.debug("Deleting request buffer");
                        module.inaReqResBuffer = {};
                    }, self.properties.cachelifetime);
                }
                self._checkRecordingURLValues();
            },

            _checkRecordingURLValues: function() {
                var self = this;

                function getURLParameter(name) {
                    return decodeURI((new RegExp(name + '=' + '(.+?)(&|$)').exec(global.window.location.search) || [null])[1]);
                }

                function hasURLProperty(name) {
                    if (global.window.location.search.toLowerCase().indexOf("&" + name.toLowerCase()) !== -1)
                        return true;
                    if (global.window.location.search.toLowerCase().indexOf("?" + name.toLowerCase()) !== -1)
                        return true;
                    return false;
                }

                if (hasURLProperty('record')) {
                    var target = getURLParameter('record');
                    if (!target || target === "undefined") {
                        target = 'defaultRecord.json';
                    }
                    self.properties.record = target;
                }

                if (hasURLProperty('demoMode')) {
                    var dataSet = getURLParameter('demoMode');
                    if (!dataSet || dataSet === "undefined") {
                        dataSet = 'defaultRecord.json';
                    }
                    self.properties.demoMode = dataSet;
                }
            },

            _requestHashValue: function(url, data) {
                return JSON.stringify({
                    "requestUrl": url,
                    "requestData": data
                });
            },

            _handleRequestFromCache: function(request) {
                var inaRequestString = JSON.stringify(request.data);
                var inaResponseString = module.inaReqResBuffer[inaRequestString];
                if (inaResponseString) {
                    // use response from cache
                    var jqXHRClone = $.Deferred();
                    jqXHRClone.resolve(inaResponseString);
                    return jqXHRClone.promise();
                }
                return {};
            },

            _handleRequestFromRecords: function(request) {
                var self = this;
                var deferred = $.Deferred();
                var promise = deferred.promise();
                var requestHash = self._requestHashValue(request.url, request.data);

                var findRequest = function(records) {
                    //search for request
                    for (var i = 0; i < records.length; i++) {
                        var record = records[i];
                        var recordHash = self._requestHashValue(record.requestUrl, record.requestData);
                        if (requestHash === recordHash) {
                            promise.responseText = JSON.stringify(record.responseData);
                            deferred.resolve(record.responseData);
                            return;
                        }
                    }
                    //nothing found
                    deferred.reject();
                };

                if (global.sap.bc.ina.api.sina.impl.inav2.proxy.record.demoData) {
                    findRequest(global.sap.bc.ina.api.sina.impl.inav2.proxy.record.demoData);
                } else {
                    $.ajax({
                        dataType: "json",
                        url: self.properties.demoMode,
                        async: request.async,
                        success: function(records) {
                            global.sap.bc.ina.api.sina.impl.inav2.proxy.record.demoData = records;
                            findRequest(records);
                        },
                        error: function() {

                        },

                    });

                }
                return promise;
            },



            _processRequestBuffer: function() {
                var self = this;
                $.each(self.requestBuffer, function(index, request) {
                    self.fireRequest(request).done(function(result) {
                        request.jqxhrProxy.resolve(result);
                    });
                });
                self.requestBuffer = [];
            },

            setXSRFService: function(url) {
                var self = this;
                self.xsrfService = url;
            },

            _getXSRFToken: function() {
                var self = this;
                if (!self.xsrfDeferred) {
                    self.xsrfRetries++;
                    self.xsrfRequest = {
                        "headers": {
                            "X-CSRF-Token": "Fetch"
                        },
                        "cache": false,
                        "url": self.xsrfService
                    };
                    self.xsrfDeferred = $.ajax(self.xsrfRequest);
                    self.xsrfDeferred.done(function(data) {
                        self.xsrfToken = self.xsrfDeferred.getResponseHeader("X-CSRF-Token") || self.xsrfToken || "";
                        self.xsrfRetries = 0;
                    });
                }
                return self.xsrfDeferred.promise();
            },

            _requestWithXSRFToken: function(request) {
                var self = this;
                if (self.xsrfDeferred && request.async === false) {
                    if (self.xsrfDeferred.state() === "pending") {
                        // reset sent xsrf request and make the next one blocking
                        self.xsrfRequest.async = false;
                        self.xsrfDeferred = $.ajax(self.xsrfRequest);
                        self.xsrfToken = self.xsrfDeferred.getResponseHeader("X-CSRF-Token") || self.xsrfToken || "";
                    }
                    request.headers = {
                        "X-CSRF-Token": self.xsrfToken
                    };
                    return $.ajax(request);
                } else {
                    var deferred = $.Deferred();
                    self._getXSRFToken().done(function(data) {
                        request.headers = {
                            "X-CSRF-Token": self.xsrfToken
                        };
                        $.ajax(request).done(function(data) {
                            deferred.resolve(data);
                        })
                            .fail(function(error) {
                                if (error.status === 400) {
                                    if (error.responseJSON &&
                                        error.responseJSON.Error &&
                                        error.responseJSON.Error.Code &&
                                        error.responseJSON.Error.Code === 403) {
                                        if (self.xsrfRetries < 5) {
                                            // try again if xsrf token has become invalid
                                            self.xsrfDeferred = null;
                                            return self._requestWithXSRFToken(request);
                                        }
                                    }
                                }
                                deferred.reject(error);
                                return deferred.promise();
                            });
                    });
                    return deferred.promise();
                }
            },

            /**
             * send an ajax request to the server if the request wasn't cached already
             * @param  {Object} request an object compatible to the one jQuerys ajax
             * function expects, see {@link http://api.jquery.com/jQuery.ajax/}
             * @return {Object} returns jQuerys jqXHR Object.
             */
            ajax: function(request) {
                var self = this;
                var inaRequestString = request.data === undefined ? undefined : JSON.stringify(request.data);
                var response;
                if (isXS) {
                    var deferred = $.Deferred();
                    if (request.getServerInfo) {
                        response = $.xs.db.ina.getServiceInfo("");
                        deferred.resolve(JSON.parse(response));
                    } else {
                        response = $.xs.db.ina.getResponse(inaRequestString);
                        deferred.resolve(JSON.parse(response));
                    }
                    return deferred;
                }

                if (self.properties.cachelifetime > 0) {
                    return self._handleRequestFromCache(request);
                }
                if (self.properties.demoMode) {
                    return self._handleRequestFromRecords(request);
                }
                var requestHash;
                if (self.properties.record) {
                    requestHash = self._requestHashValue(request.url, request.data);
                }

                request.processData = request.processData || false;
                request.type = request.type || self.properties.httpMethod || "POST";
                if (inaRequestString) {
                    if (request.type.toLowerCase() === 'get') {
                        request.data = 'Request=' + inaRequestString;
                    } else {
                        request.data = inaRequestString;
                    }
                }

                var jqXHR = self._requestWithXSRFToken(request);
                jqXHR.done(function(response) {
                    if (self.properties.cachelifetime > 0) {
                        self._cacheResponse(request, response);
                    }
                    if (self.properties.record) {
                        self._recordResponse(JSON.parse(requestHash), response);
                    }
                });
                return jqXHR;
            },

            _cacheResponse: function(request, data) {
                var inaRequestString = JSON.stringify(request.data);
                module.inaReqResBuffer[inaRequestString] = data;
            },

            _recordResponse: function(request, response) {
                var self = this;
                var record = {
                    "requestUrl": request.requestUrl,
                    "requestData": request.requestData,
                    "responseData": response
                };
                global.sap.bc.ina.api.sina.impl.inav2.proxy.record.recordings.push(JSON.stringify(record));

                var uniqRequestArray = function(array) {
                    var seen = {};
                    return array.filter(function(record) {
                        var k = module.Proxy.prototype._requestHashValue(record.requestUrl, record.requestData);
                        return (seen[k] === 1) ? 0 : seen[k] = 1; //return 1 if not seen, else 0
                    });
                };

                var recordings = global.sap.bc.ina.api.sina.impl.inav2.proxy.record.recordings.slice();
                for (var i = 0; i < recordings.length; i++) {
                    recordings[i] = JSON.parse(recordings[i]);
                }

                var sizeBefore = recordings.length;
                recordings = uniqRequestArray(recordings);
                // var recordingsString = JSON.stringify(recordings, "\t");
                var recordingsString = JSON.stringify(recordings);

                $.ajax({
                    type: "PUT",
                    url: self.properties.record,
                    data: recordingsString,
                    contentType: 'application/json',
                    dataType: 'json',
                });
            }
        };
    };

    if (isXS) {
        executeProxy($.sap.bc.ina.api.sina.sinaxsjq.jq);
    } else if (typeof define === "function" && define.amd && !global.sap.ushell) { // only concatenated sina is in ushell repo!
        define(["jquery"], function($) {
            executeProxy($);
        });
    } else {
        executeProxy($);
    }

}(typeof window === 'undefined' ? $ : window, typeof window === 'undefined'));

/*
 * @file Implementation of the filter interface
 * @namespace sap.bc.ina.api.sina.impl.inav2.filter
 * @copyright Copyright (c) 2013 SAP AG. All rights reserved.
 * @ignore
 */

(function(global, isXS) {

    "use strict";

    var executeFilter = function($) {
        if (!$) {
            $ = global.$;
        }

        // =========================================================================
        // create packages
        // =========================================================================

        if (!isXS) {
            global.sap.bc.ina.api.sina.expandPackage(global, 'sap.bc.ina.api.sina.impl.inav2.filter');
        }

        var filter = global.sap.bc.ina.api.sina.impl.inav2.filter;
        var module = filter;
        module.DataSource = function() {
            this.init.apply(this, arguments);
        };
        module.DataSourceMetaData = function() {
            this.init.apply(this, arguments);
        };
        module.Filter = function() {
            this.init.apply(this, arguments);
        };
        module.Condition = function() {
            this.init.apply(this, arguments);
        };
        module.ConditionGroup = function() {
            this.init.apply(this, arguments);
        };

        // =========================================================================
        // class datasource metadata
        // =========================================================================
        module.DataSourceMetaData.prototype = $.extend({}, global.sap.bc.ina.api.sina.filter.DataSourceMetaData.prototype, {

            /**
             * Meta data for a data source object.
             * @ignore
             * @constructs sap.bc.ina.api.sina.impl.inav2.filter.DataSourceMetaData
             * @param  {Object} properties Configuration object.
             */
            init: function(properties) {
                properties = properties || {};
                this.datasource = properties.datasource || {};
                this.description = properties.description || "";
                this.dimensions = {};
            },

            _getMetaDataRequest: function() {
                var request = global.sap.bc.ina.api.sina.impl.inav2.jsontemplates.dataSourceMetaDataRequest;
                request.DataSource = this.datasource.toInAJson();
                return request;
            },

            _getMetaData: function(isAsync, callback) {
                var self = this;
                var request = {
                    async: isAsync,
                    url: global.sap.bc.ina.api.sina.sinaSystem().inaUrl,
                    processData: false,
                    contentType: 'application/json',
                    dataType: 'json',
                    data: this._getMetaDataRequest()
                };
                var jqXHR = global.sap.bc.ina.api.sina.sinaSystem().proxy.ajax(request);
                jqXHR.done(function(data) {
                    if (!self.rawMetadata) {
                        self._parseServerMetaData(data);
                    }
                    if (callback) {
                        callback(self);
                    }
                });
                return this;
            },

            _parseServerMetaData: function(json) {
                this.rawMetadata = json;
                this.description = this.rawMetadata.Cube.Description;
                this.datasource.setLabel(this.description);
                for (var i = 0; i < this.rawMetadata.Cube.Dimensions.length; i++) {
                    var dimension = {};
                    dimension.name = this.rawMetadata.Cube.Dimensions[i].Name;
                    dimension.description = this.rawMetadata.Cube.Dimensions[i].Description;
                    dimension.attributes = {};
                    for (var j = 0; j < this.rawMetadata.Cube.Dimensions[i].Attributes.length; j++) {
                        dimension.attributes[this.rawMetadata.Cube.Dimensions[i].Attributes[j].Name] = {
                            name: this.rawMetadata.Cube.Dimensions[i].Attributes[j].Name,
                            description: this.rawMetadata.Cube.Dimensions[i].Attributes[j].Description
                        };
                    }
                    this.dimensions[dimension.name] = dimension;
                }
            }

        });

        // =========================================================================
        // class datasource
        // =========================================================================
        module.DataSource.prototype = $.extend({}, global.sap.bc.ina.api.sina.filter.DataSource.prototype, {

            /**
             * The data source of a query that is a view in SAP HANA.
             * Use {@link sap.bc.ina.api.sina.sinabase.Sina} createDataSource() factory instead of this constructor.
             * @constructs sap.bc.ina.api.sina.impl.inav2.filter.DataSource
             * @augments {sap.bc.ina.api.sina.filter.DataSource}
             * @param {Object} properties
             * @param {String} [properties.schemaName=_SYS_BIC] The schema of the view to be used.
             * @param {String} properties.packageName The package name of the view to be used.
             * @param {String} properties.objectName The object name if the view to be used.
             * @example <caption>Properties object for a view which resides in the 'SYSTEM' schema
             * and has the name 'J_EPM_PRODUCT'</caption>
             * { schemaName  : 'SYSTEM',
             *   objectName  : 'J_EPM_PRODUCT' }
             * @example <caption>Properties object for a view which resides in the repository
             * in package 'sap.bc.ina.demos.epm.views'</caption>
             * { packageName : 'sap.bc.ina.demos.epm.views',
             *   objectName  : 'V_EPM_PRODUCT' }
             * @private
             */
            init: function(properties) {
                properties = properties || {};
                properties.schemaName = properties.schemaName || properties.SchemaName || {};
                this.setSchemaName(properties.schemaName);
                properties.packageName = properties.packageName || properties.PackageName || {};
                this.setPackageName(properties.packageName);
                properties.objectName = properties.objectName || properties.ObjectName || {};
                this.setObjectName(properties.objectName);
                properties.type = properties.type || properties.Type || {};
                this.setType(properties.type);
                this.label = properties.label || properties.Label || properties.Description || '';
                if (properties.metaData) {
                    this.setMetaData(properties.metaData);
                }
            },

            /**
             * Compares this datasource with another datasource.
             * @memberOf sap.bc.ina.api.sina.impl.inav2.filter.DataSource
             * @instance
             * @param  {sap.bc.ina.api.sina.impl.inav2.filter.DataSource} the other datasource to be
             * compared against this datasource.
             * @return {boolean} true if they are equal, false otherwise
             */
            equals: function(otherDS) {
                if (otherDS instanceof module.DataSource) {
                    if (this.getSchemaName().label !== otherDS.getSchemaName().label || this.getSchemaName().value !== otherDS.getSchemaName().value) {
                        return false;
                    }
                    if (this.getPackageName().label !== otherDS.getPackageName().label || this.getPackageName().value !== otherDS.getPackageName().value) {
                        return false;
                    }
                    if (this.getObjectName().label !== otherDS.getObjectName().label || this.getObjectName().value !== otherDS.getObjectName().value) {
                        return false;
                    }
                    if (this.getType().label !== otherDS.getType().label || this.getType().value !== otherDS.getType().value) {
                        return false;
                    }
                    return true;
                }
                return false;
            },

            /**
             * Returns the metadata for this data source asynchronously from the server.
             * @ignore
             * @memberOf sap.bc.ina.api.sina.impl.inav2.filter.DataSource
             * @instance
             * @param  {Function} callback Function will be called after the meta data arrives
             * from the server. This function must have one argument through which it will
             * receive the metadata object.
             */
            getMetaData: function(callback) {
                var self = this;
                if (!self.metaData) {
                    self.metaData = new module.DataSourceMetaData({
                        datasource: this
                    });
                }
                self.metaData._getMetaData(true, callback);
            },

            /**
             * Returns the metadata for this data source synchronously from the server.
             * @ignore
             * @memberOf sap.bc.ina.api.sina.impl.inav2.filter.DataSource
             * @instance
             * Warning: Calling the function will block the javascript thread until
             * a result has been received.
             * @return {sap.bc.ina.api.sina.impl.inav2.filter.DataSourceMetaData} The metadata for this datasource.
             */
            getMetaDataSync: function() {
                var self = this;
                if (!self.metaData) {
                    self.metaData = new module.DataSourceMetaData({
                        datasource: this
                    });
                    self.metaData._getMetaData(false);
                }
                return self.metaData;
            },

            setMetaData: function(dataSourceMetaData) {
                this.metaData = dataSourceMetaData;
            },

            /**
             * Returns the schema name for this data source.
             * @memberOf sap.bc.ina.api.sina.impl.inav2.filter.DataSource
             * @instance
             * @since SAP HANA SPS 06
             * @return {String} The schema name for this data source.
             */
            getSchemaName: function() {
                return this.schemaName;
            },

            /**
             * Sets the schema name for this data source.
             * @memberOf sap.bc.ina.api.sina.impl.inav2.filter.DataSource
             * @instance
             * @since SAP HANA SPS 06
             * @param {String} schemaName The new schemaName.
             */
            setSchemaName: function(schemaName) {
                if (!this.schemaName) {
                    this.schemaName = {};
                }
                if ($.type(schemaName) === 'object') {
                    this.schemaName.label = schemaName.label || schemaName.value || '';
                    this.schemaName.value = schemaName.value || '';
                }
                if ($.type(schemaName) === 'string') {
                    this.schemaName.label = schemaName;
                    this.schemaName.value = schemaName;
                }
            },

            /**
             * Returns the package name for this data source.
             * @memberOf sap.bc.ina.api.sina.impl.inav2.filter.DataSource
             * @instance
             * @since SAP HANA SPS 06
             * @return {String} The package name for this data source.
             */
            getPackageName: function() {
                return this.packageName;
            },

            /**
             * Sets the package name for this data source.
             * @memberOf sap.bc.ina.api.sina.impl.inav2.filter.DataSource
             * @instance
             * @since SAP HANA SPS 06
             * @param {String} packageName The new package name.
             */
            setPackageName: function(packageName) {
                if (!this.packageName) {
                    this.packageName = {};
                }
                if ($.type(packageName) === 'object') {
                    this.packageName.label = packageName.label || packageName.value || '';
                    this.packageName.value = packageName.value || '';
                }
                if ($.type(packageName) === 'string') {
                    this.packageName.label = packageName;
                    this.packageName.value = packageName;
                }
            },

            /**
             * Returns the object name for this data source.
             * @memberOf sap.bc.ina.api.sina.impl.inav2.filter.DataSource
             * @instance
             * @since SAP HANA SPS 06
             * @return {String} The object name for this data source.
             */
            getObjectName: function() {
                return this.objectName;
            },

            /**
             * Sets the object name for this data source.
             * @memberOf sap.bc.ina.api.sina.impl.inav2.filter.DataSource
             * @instance
             * @since SAP HANA SPS 06
             * @param {String} objectName The new object name.
             */
            setObjectName: function(objectName) {
                if (!this.objectName) {
                    this.objectName = {};
                }
                if ($.type(objectName) === 'object') {
                    this.objectName.label = objectName.label || objectName.value || '';
                    this.objectName.value = objectName.value || '';
                }
                if ($.type(objectName) === 'string') {
                    this.objectName.label = objectName;
                    this.objectName.value = objectName;
                }
            },

            setObjectNameValue: function(value) {
                if (!this.objectName) {
                    this.objectName = {};
                }
                this.objectName.value = value || '';
            },

            setObjectNameLabel: function(label) {
                if (!this.objectName) {
                    this.objectName = {};
                }
                this.objectName.label = label || '';
            },

            getType: function() {
                return this.type;
            },

            setType: function(type) {
                if (!this.type) {
                    this.type = {};
                }
                if ($.type(type) === 'object') {
                    this.type.label = type.label || type.value || '';
                    this.type.value = type.value || '';
                }
                if ($.type(type) === 'string') {
                    this.type.label = type;
                    this.type.value = type;
                }
            },

            getLabel: function() {
                if (typeof this.label !== "undefined" && this.label !== "") {
                    return this.label;
                }
                if (typeof this.getObjectName().label !== "undefined" && this.getObjectName().label !== "") {
                    return this.getObjectName().label;
                }

                if (typeof this.getObjectName().value !== "undefined" && this.getObjectName().value !== "") {
                    return this.getObjectName().value;
                }
                return "";
            },

            setLabel: function(label) {
                this.label = label || '';
            },

            fromInAJson: function(inaJson) {
                this.setSchemaName({
                    value: inaJson.SchemaName,
                    label: inaJson.SchemaLabel
                });
                this.setPackageName({
                    value: inaJson.PackageName,
                    label: inaJson.PackageLabel
                });
                this.setObjectName({
                    value: inaJson.ObjectName,
                    label: inaJson.ObjectLabel
                });
                this.setType({
                    value: inaJson.Type,
                    label: ''
                });
            },

            toInAJson: function() {
                var json = {
                    "SchemaName": this.getSchemaName().value,
                    "PackageName": this.getPackageName().value,
                    "ObjectName": this.getObjectName().value
                };
                if (this.getType().value) {
                    json.Type = this.getType().value;
                }
                return json;
            },

            toURL: function() {
                var json = {
                    "sn": this.getSchemaName().value,
                    "pn": this.getPackageName().value,
                    "on": this.getObjectName().value
                    // "sl" : this.getSchemaName().label,
                    // "pl" : this.getPackageName().label,
                    // "ol" : this.getObjectName().label,
                    // "l": this.label
                };
                if (this.getType().value) {
                    json.tn = this.getType().value;
                    // json.tl = this.getType().label;
                }
                return json;
            },

            fromURL: function(inaJson) {
                this.setSchemaName(inaJson.sn);
                this.setPackageName(inaJson.pn);
                this.setObjectName(inaJson.on);
                // this.setLabel(inaJson.l);
                this.setType(inaJson.tn);
            }

        });

        // =========================================================================
        // class filter
        // =========================================================================
        module.Filter.prototype = $.extend({}, global.sap.bc.ina.api.sina.filter.Filter.prototype, {

            /**
             * A simple filter for SINA queries.
             * Use sina.createFilter() method instead of this private constructor.
             * @constructs sap.bc.ina.api.sina.impl.inav2.filter.Filter
             * @augments {sap.bc.ina.api.sina.filter.Filter}
             * @param  {Object} properties Configuration object.
             * @private
             * @since SAP HANA SPS 06
             * @ignore
             */
            init: function(properties) {
                global.sap.bc.ina.api.sina.filter.Filter.prototype.init.apply(this, [properties]);
                this.defaultConditionGroup = new module.ConditionGroup({
                    operator: 'And'
                });
            },

            addFilterCondition: function(attribute, operator, value) {
                var local_attribute = attribute;
                var local_operator = operator;
                var local_value = value;
                if ($.type(attribute) === 'object') {
                    var props = attribute;
                    local_attribute = props.attribute;
                    local_operator = props.operator;
                    local_value = props.value;
                }
                if (local_attribute === undefined || local_operator === undefined || local_value === undefined) {
                    return this;
                }
                if (this.conditionGroupsByAttribute[local_attribute] === undefined) {
                    this.conditionGroupsByAttribute[local_attribute] = new module.ConditionGroup({
                        operator: "OR"
                    });
                    this.defaultConditionGroup.addCondition(this.conditionGroupsByAttribute[local_attribute]);
                }
                this.conditionGroupsByAttribute[local_attribute].addCondition(new module.Condition(attribute, operator, value));
                return this;
            },

            removeFilterCondition: function(attribute, operator, value) {
                this.defaultConditionGroup.removeCondition(new module.Condition(attribute, operator, value));
                return this;
            },

            resetFilterConditions: function() {
                this.root = null;
                this.conditionGroupsByAttribute = {};
                this.defaultConditionGroup = new module.ConditionGroup({
                    operator: 'And'
                });
                return this;
            },

            empty: function() {
                this.root = null;
                this.conditionGroupsByAttribute = {};
                this.defaultConditionGroup = new module.ConditionGroup({
                    operator: 'And'
                });
                this.searchTerms = "";
                return this;
            },

            getJson: function() {
                var root = [];
                this.defaultConditionGroup.getJson(root);
                var result = {
                    Selection: root[0]
                };
                return result;
            },

            setJson: function(json) {
                if (json.Selection === undefined) {
                    return;
                }
                var group = new module.ConditionGroup();
                group.setJson(json);
                this.defaultConditionGroup.addCondition(group);
            }

        });

        // =========================================================================
        // class condition
        // =========================================================================
        module.Condition.prototype = $.extend({}, global.sap.bc.ina.api.sina.filter.Condition.prototype, {

            /**
             * Creates a new filter condition.
             * @ignore
             * @constructs sap.bc.ina.api.sina.impl.inav2.filter.Condition
             * @param {String|Object} attribute     Technical identifier of the attribute, as defined in the database.
             * If the type is Object, this object can have properties with the name and value of the arguments.
             * @param {String} operator             Operator of the filter condition. The default value is "=".
             * @param {String} value                Value that should be filtered in the attribute.
             */
            init: function(attribute, operator, value) {
                global.sap.bc.ina.api.sina.filter.Condition.prototype.init.apply(this, [attribute, operator, value]);
                if ($.type(attribute) === 'object') {
                    this.inaV2_extended_properties = attribute;
                    delete this.inaV2_extended_properties.attribute;
                    delete this.inaV2_extended_properties.operator;
                    delete this.inaV2_extended_properties.value;
                }
            },

            getJson: function(parent) {
                var operand;
                var json = {};

                if (this.operator.toLowerCase() === 'contains') {
                    operand = 'SearchOperand';
                } else {
                    operand = 'MemberOperand';
                }
                json[operand] = {
                    "AttributeName": this.attribute,
                    "Comparison": this.operator,
                    "Value": this.value
                };
                if (operand === 'SearchOperand') {
                    delete json[operand].Comparison;
                }
                json[operand] = $.extend({}, json[operand], this.inaV2_extended_properties);
                if (this.operator === '=' && this.value === null) {
                    json.MemberOperand.Comparison = 'IS NULL';
                    json.MemberOperand.Value = '';
                }
                parent.push(json);
            },

            setJson: function(json) {
                this.attribute = json.MemberOperand.AttributeName;
                this.operator = json.MemberOperand.Comparison;
                this.value = json.MemberOperand.Value;
                if (json.MemberOperand.Comparison === 'IS NULL' && json.MemberOperand.Value === '') {
                    this.operator = '=';
                    this.value = null;
                }
            }

        });


        // =========================================================================
        // class condition group
        // =========================================================================
        module.ConditionGroup.prototype = $.extend({}, global.sap.bc.ina.api.sina.filter.ConditionGroup.prototype, {

            init: function(properties) {
                global.sap.bc.ina.api.sina.filter.ConditionGroup.prototype.init.apply(this, [properties]);
            },

            getJson: function(parent) {
                if (this.conditions.length === 0) {
                    return {};
                }
                var children = [];
                for (var i = 0; i < this.conditions.length; ++i) {
                    this.conditions[i].getJson(children);
                }
                var json = {
                    "Operator": {
                        "Code": this.operator,
                        "SubSelections": children
                    }
                };
                if (parent) {
                    parent.push(json);
                } else {
                    var result = {
                        Selection: json
                    };
                    return result;
                }
                return {};
            },

            setJson: function(json) {
                if (json.Selection === undefined && json.Operator) {
                    json.Selection = {};
                    json.Selection.Operator = json.Operator;
                }
                this.setOperator(json.Selection.Operator.Code);
                var conditions = json.Selection.Operator.SubSelections;
                for (var i = 0; i < conditions.length; i++) {
                    var condition;
                    if (conditions[i].Operator) {
                        condition = new module.ConditionGroup();
                    } else {
                        condition = new module.Condition();
                    }
                    condition.setJson(conditions[i]);
                    this.addCondition(condition);
                }
            }

        });
    };

    if (isXS) {
        executeFilter($.sap.bc.ina.api.sina.sinaxsjq.jq);
    } else if (typeof define === "function" && define.amd && !global.sap.ushell) { // only concatenated sina is in ushell repo!
        define(["jquery", './jsontemplates'], function($) {
            executeFilter($);
        });
    } else {
        executeFilter();
    }

}(typeof window === 'undefined' ? $ : window, typeof window === 'undefined'));

/*
 * Simple info access (SINA) API: JSON Templates
 * Package: sap.bc.ina.api.sina.simple.impl.inav2.jsontemplates
 * Copyright (c) 2013 SAP AG. All rights reserved.
 */

(function(global, isXS) {

    "use strict";

    // =========================================================================
    // import packages
    // =========================================================================
    var $ = global.$;

    if (!isXS) {
        global.sap.bc.ina.api.sina.expandPackage(global, 'sap.bc.ina.api.sina.impl.inav2.jsontemplates');
    }

    var jsontemplates = global.sap.bc.ina.api.sina.impl.inav2.jsontemplates;
    var module = jsontemplates;

    module.dataSourceMetaDataRequest = {
        "DataSource": {},
        "Options": ["SynchronousRun"],
        "Metadata": {
            "Context": "Search",
            "Expand": ["Cube"]
        },
        "ServiceVersion": 204
    };

    module.catalogRequest = {
        "DataSource": {
            "ObjectName": "$$DataSources$$",
            "PackageName": "ABAP"
        },
        "Options": ["SynchronousRun"],
        "Search": {
            "Top": 1000,
            "Skip": 0,
            "OrderBy": [{
                "AttributeName": "Description",
                "SortOrder": "ASC"
            }, {
                "AttributeName": "ObjectName",
                "SortOrder": "ASC"
            }],
            "Expand": ["Grid", "Items"],
            "Filter": {
                "Selection": {
                    "Operator": {
                        "Code": "And",
                        "SubSelections": [{
                            "MemberOperand": {
                                "AttributeName": "SupportedService",
                                "Comparison": "=",
                                "Value": "Search"
                            }
                        }]
                    }
                }
            },
            "NamedValues": [{
                "AttributeName": "ObjectName",
                "Name": "ObjectName"
            }, {
                "AttributeName": "Description",
                "Name": "Description"
            }, {
                "AttributeName": "Type",
                "Name": "Type"
            }]
        },
        "SearchTerms": "*",
        "ServiceVersion": 204
    };

    module.suggestionRequest = {
        "DataSource": {},
        "Options": ["SynchronousRun"],
        "Suggestions": {
            "Expand": ["Grid", "Items"],
            "Precalculated": false,
            "SearchTerms": "",
            "AttributeNames": []
        },
        "ServiceVersion": 204
    };

    module.suggestion2Request = {
        "DataSource": {},
        "Options": ["SynchronousRun"],
        "Suggestions2": {
            "Expand": ["Grid", "Items"],
            "Precalculated": false,
            "AttributeNames": []
        },
        "ServiceVersion": 204
    };

    module.perspectiveRequest = {
        "DataSource": {},
        "Options": ["SynchronousRun"],
        "Search": {
            "Expand": ["Grid", "Items", "TotalCount"],
            "Filter": {
                "Selection": {
                    "Operator": {
                        "Code": "And",
                        "SubSelections": [{
                            "MemberOperand": {
                                "AttributeName": "$$RenderingTemplatePlatform$$",
                                "Comparison": "=",
                                "Value": "html"
                            }
                        }, {
                            "MemberOperand": {
                                "AttributeName": "$$RenderingTemplateTechnology$$",
                                "Comparison": "=",
                                "Value": "Tempo"
                            }
                        }, {
                            "MemberOperand": {
                                "AttributeName": "$$RenderingTemplateType$$",
                                "Comparison": "=",
                                "Value": "ResultItem"
                            }
                        }]
                    }
                }
            },
            "Top": 10,
            "Skip": 0,
            "SearchTerms": "S*",
            "NamedValues": [{
                "Function": "WhyFound",
                "Name": "$$WhyFound$$"
            }, {
                "Function": "RelatedActions",
                "Name": "$$RelatedActions$$"
            }]
        },
        "ServiceVersion": 204
    };

    module.perspectiveSearchRequest = {
        "DataSource": {
            "ObjectName": "$$Perspectives$$",
            "Type": "View"
        },
        "Options": [
            "SynchronousRun"
        ],
        "Search": {
            "Expand": [
                "Grid",
                "Items"
            ],
            "Filter": {
                "Selection": {
                    "Operator": {
                        "Code": "Or",
                        "SubSelections": [{
                            "MemberOperand": {
                                "AttributeName": "SCHEMA_VERSION_NUMBER",
                                "Comparison": "=",
                                "Value": "3"
                            }
                        }, {
                            "MemberOperand": {
                                "AttributeName": "SCHEMA_VERSION_NUMBER",
                                "Comparison": "=",
                                "Value": "4"
                            }
                        }, {
                            "MemberOperand": {
                                "AttributeName": "SCHEMA_VERSION_NUMBER",
                                "Comparison": "=",
                                "Value": "5"
                            }
                        }]
                    }
                }
            },
            "SearchTerms": "*",
            "SelectedValues": [{
                "AttributeName": "PACKAGE_ID",
                "Name": "PACKAGE_ID"
            }, {
                "AttributeName": "PERSPECTIVE_ID",
                "Name": "PERSPECTIVE_ID"
            }, {
                "AttributeName": "TITLE_TEXT",
                "Name": "TITLE_TEXT"
            }, {
                "AttributeName": "SUMMARY_TEXT",
                "Name": "SUMMARY_TEXT"
            }],
            "Skip": 0,
            "Top": 30
        }
    };


    module.perspectiveRequestFactsheet = {
        "DataSource": {},
        "Options": ["SynchronousRun"],
        "Search": {
            "Expand": ["Grid", "Items", "TotalCount"],
            "Filter": {
                "Selection": {
                    "Operator": {
                        "Code": "And",
                        "SubSelections": [{
                            "MemberOperand": {
                                "AttributeName": "$$RenderingTemplatePlatform$$",
                                "Comparison": "=",
                                "Value": "html"
                            }
                        }, {
                            "MemberOperand": {
                                "AttributeName": "$$RenderingTemplateTechnology$$",
                                "Comparison": "=",
                                "Value": "Tempo"
                            }
                        }, {
                            "MemberOperand": {
                                "AttributeName": "$$RenderingTemplateType$$",
                                "Comparison": "=",
                                "Value": "ResultItem"
                            }
                        }]
                    }
                }
            },
            "Top": 10,
            "Skip": 0,
            "SearchTerms": "S*",
            "NamedValues": [{
                "Function": "WhyFound",
                "Name": "$$WhyFound$$"
            }, {
                "AttributeName": "$$RelatedActions$$"
            }, {
                "AttributeName": "$$RelatedActions.Proxy$$"
            }]
        },
        "ServiceVersion": 204
    };

    // =========================================================================
    // template search request
    // =========================================================================
    module.searchRequest = {
        "DataSource": {},
        "SearchTerms": "DUMMY",
        "Search": {
            "Expand": ["Grid", "Items", "TotalCount"],
            "Top": "DUMMY",
            "Skip": "DUMMY",
            "SelectedValues": "DUMMY",
            "NamedValues": [{
                "AttributeName": "$$ResultItemAttributes$$",
                "Name": "$$ResultItemAttributes$$"
            }, {
                "AttributeName": "$$RelatedActions$$",
                "Name": "$$RelatedActions$$"
            }]
        }
    };

    // =========================================================================
    // template chart request
    // =========================================================================
    module.chartRequest = {
        "DataSource": {},
        "Options": ["SynchronousRun"],
        "SearchTerms": "",
        "Analytics": {
            "Definition": {
                "Dimensions": [{
                    "Axis": "Rows",
                    "Name": "CATEGORY",
                    "SortOrder": 1,
                    "Top": 5
                }, {
                    "Axis": "Columns",
                    "Name": "CustomDimension1",
                    "Members": [{
                        "Aggregation": "COUNT",
                        "AggregationDimension": "CATEGORY",
                        "MemberOperand": {
                            "AttributeName": "Measures",
                            "Comparison": "=",
                            "Value": "COUNT"
                        },
                        "Name": "COUNT",
                        "SortOrder": 2
                    }]
                }],
                "Filter": {}
            }
        }
    };

}(typeof window === 'undefined' ? $ : window, typeof window === 'undefined'));

/*
 * @file Proxy class to buffer InA JSON requests/responses.
 * @namespace global.sap.bc.ina.api.sina.impl.inav2.proxy
 * @copyright Copyright (c) 2012 SAP AG. All rights reserved.
 * @ignore
 */
(function(global, isXS) {

    "use strict";

    var executeProxy = function($) {
        // =========================================================================
        // create packages
        // =========================================================================
        if (!isXS) {
            global.sap.bc.ina.api.sina.expandPackage(global, 'sap.bc.ina.api.sina.impl.inav2.proxy');
        }
        global.sap.bc.inauitk = global.sap.bc.inauitk || {};
        global.sap.bc.ina.api.sina.impl.inav2.proxy.record = global.sap.bc.ina.api.sina.impl.inav2.proxy.record || {};
        global.sap.bc.ina.api.sina.impl.inav2.proxy.record.recordings = [];

        var module = global.sap.bc.ina.api.sina.impl.inav2.proxy;
        var proxy = global.sap.bc.ina.api.sina.proxy;
        module.Proxy = function() {
            this.init.apply(this, arguments);
        };

        // =========================================================================
        // import packages
        // =========================================================================

        //-----------------------------------------------------------------------------
        // Receives service calls from data boxes and forwards them to server side, either
        // as single GET requests or as POST with GETs as payload.
        //-----------------------------------------------------------------------------
        module.inaReqResBuffer = {};

        module.Proxy.prototype = $.extend({}, proxy.Proxy.prototype, {

            init: function(properties) {
                var self = this;
                self.properties = properties || {};
                proxy.Proxy.prototype.init.apply(this, [properties]);
            }

        });

    };

    if (isXS) {
        executeProxy($.sap.bc.ina.api.sina.sinaxsjq.jq);
    } else if (typeof define === "function" && define.amd && !global.sap.ushell) { // only concatenated sina is in ushell repo!
        define(["jquery", "../../proxy"], function($) {
            executeProxy($);
        });
    } else {
        executeProxy($);
    }


}(typeof window === 'undefined' ? $ : window, typeof window === 'undefined'));

/*
 * @file Simple info access (SINA) API: Implementation of the SINA interface
 * for the INA V2 service.
 * @namespace sap.bc.ina.api.sina.impl.inav2.sina_impl
 * @requires sap.bc.ina.api.sina
 * @requires sap.bc.ina.api.sina.impl.inav2.filter
 * @requires sap.bc.ina.api.sina.impl.inav2.system
 * @requires sap.bc.ina.api.sina.impl.inav2.proxy
 * @requires jQuery
 * @copyright Copyright (c) 2013 SAP AG. All rights reserved.
 */

(function(global, isXS) {

    "use strict";

    var executeSinaImpl = function($) {
        // =========================================================================
        // create packages
        // =========================================================================
        if (!$) {
            $ = global.$;
        }

        if (!isXS) {
            global.sap.bc.ina.api.sina.expandPackage(global, 'sap.bc.ina.api.sina.impl.inav2.sina_impl');
            global.sap.bc.ina.api.sina.expandPackage(global, 'sap.bc.ina.api.sina.impl.inav2.proxy');
        }

        var module = global.sap.bc.ina.api.sina.impl.inav2.sina_impl;
        module.Sina = function() {
            this.init.apply(this, arguments);
        };
        module.Facet = function() {
            this.init.apply(this, arguments);
        };
        module.Perspective = function() {
            this.init.apply(this, arguments);
        };
        module.Perspective2 = function() {
            this.init.apply(this, arguments);
        };
        module.Query = function() {
            this.init.apply(this, arguments);
        };
        module.CatalogQuery = function() {
            this.init.apply(this, arguments);
        };
        module.CatalogResultSet = function() {
            this.init.apply(this, arguments);
        };
        module.PerspectiveQuery = function() {
            this.init.apply(this, arguments);
        };
        module.PerspectiveGetQuery = function() {
            this.init.apply(this, arguments);
        };
        module.PerspectiveSearchQuery = function() {
            this.init.apply(this, arguments);
        };
        module.PerspectiveSearchResultSet = function() {
            this.init.apply(this, arguments);
        };
        module.Suggestion = function() {
            this.init.apply(this, arguments);
        };
        module.SuggestionQuery = function() {
            this.init.apply(this, arguments);
        };
        module.SuggestionResultSet = function() {
            this.init.apply(this, arguments);
        };
        module.Suggestion2Query = function() {
            this.init.apply(this, arguments);
        };
        module.Suggestion2ResultSet = function() {
            this.init.apply(this, arguments);
        };
        module.ChartQuery = function() {
            this.init.apply(this, arguments);
        };
        module.ChartResultSet = function() {
            this.init.apply(this, arguments);
        };
        module.GroupBarChartQuery = function() {
            this.init.apply(this, arguments);
        };
        module.GroupBarChartResultSet = function() {
            this.init.apply(this, arguments);
        };
        module.LineChartQuery = function() {
            this.init.apply(this, arguments);
        };
        module.LineChartResultSet = function() {
            this.init.apply(this, arguments);
        };
        module.SearchQuery = function() {
            this.init.apply(this, arguments);
        };
        module.SearchResultSet = function() {
            this.init.apply(this, arguments);
        };

        module.SuggestionAutoQuery = function(properties) {
            if (properties.system instanceof global.sap.bc.ina.api.sina.impl.inav2.system.ABAPSystem) {
                $.extend(this, module.Suggestion2Query.prototype);
            }
            if (properties.system instanceof global.sap.bc.ina.api.sina.impl.inav2.system.HANASystem) {
                $.extend(this, module.SuggestionQuery.prototype);
            }
            this.init.apply(this, arguments);
        };

        // =========================================================================
        // import packages
        // =========================================================================
        var jsontemplates = global.sap.bc.ina.api.sina.impl.inav2.jsontemplates;
        var filter = global.sap.bc.ina.api.sina.impl.inav2.filter;
        // var system = global.sap.bc.ina.api.sina.impl.inav2.system;
        var config = global.sap.bc.ina.api.sina.impl.inav2.proxy.config;
        var sinabase = global.sap.bc.ina.api.sina.sinabase;
        module.Condition = filter.Condition;

        // =========================================================================
        // register provider
        // =========================================================================
        module.IMPL_TYPE = "inav2";
        sinabase.registerProvider({
            impl_type: module.IMPL_TYPE,
            sina: module.Sina,
            chartQuery: module.ChartQuery,
            searchQuery: module.SearchQuery,
            groupBarChartQuery: module.GroupBarChartQuery,
            lineChartQuery: module.LineChartQuery,
            suggestionQuery: module.SuggestionAutoQuery,
            perspectiveQuery: module.PerspectiveQuery,
            perspectiveSearchQuery: module.PerspectiveSearchQuery,
            perspectiveGetQuery: module.PerspectiveGetQuery,
            Facet: module.Facet,
            DataSource: filter.DataSource,
            Filter: filter.Filter,
            FilterCondition: filter.Condition,
            FilterConditionGroup: filter.ConditionGroup
        });

        // =========================================================================
        // sina
        // =========================================================================
        module.Sina.prototype = $.extend({}, sinabase.Sina.prototype, {

            /**
             * Creates a new instance of SINA that uses the INA V2 service. Use
             * the SINA factory {@link sap.bc.ina.api.sina.getSina} instead of this
             * private constructor.
             * @private
             * @augments {sap.bc.ina.api.sina.sinabase.Sina}
             * @this {sap.bc.ina.api.sina.impl.inav2.sina_impl.Sina}
             * @constructs sap.bc.ina.api.sina.impl.inav2.sina_impl.Sina
             * @param  {Object} properties Configuration properties for the instance.
             * @since SAP HANA SPS 06
             * @ignore
             */
            init: function(properties) {
                properties = properties || {};
                this.sinaSystem(properties.system || new global.sap.bc.ina.api.sina.impl.inav2.system.HANASystem());
                sinabase.Sina.prototype.init.apply(this, arguments);
            },

            /**
             * Gets or sets an SAP client. Only used with system type ABAP.
             * @ignore
             * @since SAP HANA SPS 06
             * @memberOf sap.bc.ina.api.sina.impl.inav2.sina_impl.Sina
             * @instance
             * @param  {Integer} sapclient Number of the SAP client to be used with the service.
             * @return {Integer} The SAP client number that is currently set, but only if called
             * without a parameter.
             */
            sapclient: function(sapclient) {
                var sys;
                if (sapclient) {
                    if (sapclient < 0) {
                        sys = new global.sap.bc.ina.api.sina.impl.inav2.system.HANASystem();
                    } else {
                        sys = new global.sap.bc.ina.api.sina.impl.inav2.system.ABAPSystem({
                            "sapclient": sapclient
                        });
                    }
                    this.sinaSystem(sys);
                } else {
                    return this.sinaSystem().properties.sapclient();
                }
                return {};
            },

            _registerPostProcessor: function(postProcessor) {
                if (!this.postProcessor) {
                    this.postProcessor = [];
                }
                this.postProcessor.push(postProcessor);
            },

            _postprocess: function(sinAction, sourceTitle) {
                if (this.postProcessor) {
                    for (var i = 0; i < this.postProcessor.length; i++) {
                        this.postProcessor[i](sinAction, sourceTitle);
                    }
                }
            },

        });

        // =========================================================================
        // class query. Base for chart, search and perspective queries
        // =========================================================================
        module.Query.prototype = $.extend({}, {

            /**
             *  The base query for chart, search, and suggestions queries.
             *  Use the sap.bc.ina.api.sina.create*Query factory methods instead of this class.
             *  @constructs sap.bc.ina.api.sina.impl.inav2.sina_impl.Query
             *  @private
             *  @ignore
             */
            init: function(properties) {
                this.filter = properties.filter || new filter.Filter({
                    dataSource: properties.dataSource
                });
            },

            _resetResultSet: function() {
                this.deferredResultSet = null;
                this.resultSet = null;
                this.jqXHR = null;
            },

            _getSinaError: function(data) {

                var error = {};
                if (data.error) {

                    var e = JSON.parse(error.responseText);
                    // error.message = e.error.message;
                    // error.code = e.error.code;
                    // return error;

                    return new sinabase.SinaError({
                        message: e.error.message,
                        errorCode: e.error.code
                    });

                }

                // if (data.Messages) {
                //   for (var i = 0; i < data.Messages.length; i++) {

                //     if (data.Messages[i].Type >= 2) {
                //       return new sinabase.SinaError({
                //         message: data.Messages[i].Text,
                //         errorCode: 0
                //       });

                //     }
                //   }
                // }

                return null;

            },

            setDataSource: function(dataSource) {
                if (dataSource === undefined) {
                    return this;
                }
                dataSource = new filter.DataSource(dataSource);
                if (this.filter.getDataSource() === undefined) {
                    this.filter.setDataSource(dataSource);
                    this._resetResultSet();
                    return this;
                }
                if (!this.filter.getDataSource().equals(dataSource)) {
                    this.filter.setDataSource(dataSource);
                    this._resetResultSet();
                }
                return this;
            },

            execute: function() {
                var self = this;

                var jsonRequest = self.createJsonRequest();

                self.system.getServerInfo();

                var jqXHR = self._fireRequest(jsonRequest, true);

                var deferredResultSet = $.Deferred();

                jqXHR.done(function(data) {
                    var error = self._getSinaError(data);
                    if (data && error) {
                        deferredResultSet.reject(error);
                        return;
                    }
                    var resultSet = new self.resultSetClass(self.resultSetProperties);
                    resultSet.setJsonData(data);
                    deferredResultSet.resolve(resultSet);
                })
                    .fail(function(error) {
                        deferredResultSet.reject(error);
                    })
                    .always(function(data) {
                        self._responseJson = data;
                    });
                return deferredResultSet.promise();
            },

            executeSync: function() {
                var self = this;

                if (!isXS && self.resultSet !== null) {
                    return self.resultSet;
                }
                var jsonRequest = self.createJsonRequest();
                self.system.getServerInfo();
                var data = self._fireRequest(jsonRequest, false);
                self._responseJson = data;
                self.resultSet = new self.resultSetClass(self.resultSetProperties);

                if (!isXS && data && data.responseText) {
                    var response = JSON.parse(data.responseText);
                    self.resultSet.setJsonData(response);
                } else if (data && data.arguments) {
                    self.resultSet.setJsonData(data.arguments[0]);
                }

                return self.resultSet;
            },

            /**
             * Calls the server for the query instances.
             * @private
             * @ignore
             * @memberOf sap.bc.ina.api.sina.impl.inav2.Query
             * @instance
             * @param  {Object} jsonRequest   Request data that is sent to the server.
             * @param  {boolean} async        Should the request be asynchronous?
             */
            _fireRequest: function(jsonRequest, async) {

                var request = {
                    async: async,
                    url: this.system.inaUrl,
                    contentType: 'application/json',
                    dataType: 'json',
                    data: jsonRequest
                };

                var jqXHR = this.system.proxy.ajax(request);
                return jqXHR;

            },

            /**
             * Assembles the order-by expression needed for calling ina.v2 service.
             * @private
             * @ignore
             * @memberOf sap.bc.ina.api.sina.impl.inav2.Query
             * @instance
             * @return {Object} Order-by expression.
             */
            _assembleOrderBy: function() {

                var orderByList = [];

                function orderByToInaSyntax(orderBy, sortOrder) {
                    var inaOrderObj = {};
                    if (orderBy.toLowerCase() === '$$score$$') {
                        inaOrderObj.Function = 'Score';
                    } else {
                        inaOrderObj.AttributeName = orderBy;
                    }
                    inaOrderObj.SortOrder = sortOrder.toUpperCase();
                    return inaOrderObj;
                }

                var orderObj;
                if ($.type(this.orderBy) === 'array') {
                    for (var j = 0; j < this.orderBy.length; j++) {
                        orderObj = orderByToInaSyntax(this.orderBy[j].orderBy, this.orderBy[j].sortOrder);
                        orderByList.push(orderObj);
                    }
                } else if ($.type(this.orderBy) === 'object' && this.orderBy.orderBy) {
                    orderObj = orderByToInaSyntax(this.orderBy.orderBy, this.orderBy.sortOrder);
                    orderByList.push(orderObj);
                }

                return orderByList;
            }

        });

        // =========================================================================
        // class catalog query
        // =========================================================================
        module.CatalogQuery.prototype = $.extend({}, module.Query.prototype, {

            /**
             * A catalog query.
             * @constructs sap.bc.ina.api.sina.impl.inav2.CatalogQuery
             * @augments {sap.bc.ina.api.sina.impl.inav2.sina_impl.Query}
             * @param  {Object} properties Configuration object.
             * @since SAP HANA SPS 06
             * @private
             * @ignore
             */
            init: function(properties) {
                properties = properties || {};
                this.resultSetClass = module.SearchResultSet;
            },

            createJsonRequest: function() {
                return jsontemplates.catalogRequest;
            }

        });



        // =========================================================================
        // class Facet
        // =========================================================================
        module.Facet.prototype = $.extend({}, sinabase.Facet.prototype, {

            /**
             * A facet that is contained in a perspective.
             * @ignore
             * @constructs sap.bc.ina.api.sina.impl.inav2.Facet
             */
            init: function(properties) {
                // TODO: make facet general available only in sinabase
                properties = properties || {};
                sinabase.Facet.prototype.init.apply(this, arguments);
                if (this.facetType === '$$datasources$$') {
                    this.facetType = sinabase.FacetType.DATASOURCE;
                    this.query = new module.ChartQuery();
                    this.query.resultSet = new module.ChartResultSet({
                        "type": "datasource"
                    });
                } else if (this.facetType === sinabase.FacetType.ATTRIBUTE) {
                    this.query = new module.ChartQuery();
                    this.query.resultSet = new module.ChartResultSet();
                } else if (this.facetType === sinabase.FacetType.SEARCH) {
                    this.query = new module.SearchQuery();
                    this.query.resultSet = new module.SearchResultSet();
                }
            },

            // TODO: move out of facet into Perspective
            setJsonData: function(data) {
                this.query.resultSet.setJsonData(data);
                this._parseServerSideFacetMetaData(data.Metadata);
            },

            // TODO: move out of facet into Perspective
            _parseServerSideFacetMetaData: function(data) {
                if (data && data.Cube) {
                    this.title = data.Cube.Description;
                    this.dimension = data.Cube.ObjectName;
                }

            }

        });

        // =========================================================================
        // class perspective query
        // =========================================================================
        module.PerspectiveQuery.prototype = $.extend({}, sinabase.PerspectiveQuery.prototype, module.Query.prototype, {

            /**
             * Creates a perspective query.
             * @ignore
             * @constructs sap.bc.ina.api.sina.impl.inav2.PerspectiveQuery
             * @param  {Object} properties Configuration object.
             * @augments {sap.bc.ina.api.sina.impl.inav2.sina_impl.Query}
             */
            init: function(properties) {
                var self = this;
                self.chartFacets = [];
                self.searchFacet = null;
                self.searchresultset = null;
                self.layout = null;
                self.templateFactsheet = properties.templateFactsheet || false;
                properties = properties || {};
                module.Query.prototype.init.apply(this, arguments);
                sinabase.PerspectiveQuery.prototype.init.apply(this, arguments);
                properties.orderBy = properties.orderBy || {};
                this.setOrderBy(properties.orderBy);
                this.resultSetClass = module.Perspective;
            },

            createJsonRequest: function() {
                if (this.templateFactsheet) {
                    jsontemplates.perspectiveRequest = jsontemplates.perspectiveRequestFactsheet;
                }
                jsontemplates.perspectiveRequest.DataSource = this.filter.dataSource.toInAJson();
                var searchterms = this.filter.getSearchTerms();
                jsontemplates.perspectiveRequest.Search.SearchTerms = searchterms;
                if (config && config.startWithSearch !== undefined && config.startWithSearch === 'false') {
                    if (!searchterms && this.filter.dataSource.getObjectName().value.toLowerCase() === '$$all$$') {
                        //TODO: remove workaround: return a catalog request and only show datasource facet,
                        //due to high response time while searching for '*' in $$ALL$$
                        var cq = new module.CatalogQuery();
                        return cq.createJsonRequest();
                    }
                }
                jsontemplates.perspectiveRequest.Search.Top = this._top;
                jsontemplates.perspectiveRequest.Search.Skip = this._skip;
                jsontemplates.perspectiveRequest.Search.Filter = this.filter.getJson();
                jsontemplates.perspectiveRequest.Search.OrderBy = this._assembleOrderBy();
                return jsontemplates.perspectiveRequest;
            },

            getPerspective: function(onSuccess, onError) {
                this.getResultSet(onSuccess, onError);
            },

            generatePerspectiveSync: function() {
                return this.getResultSetSync();
            }

        });

        // =========================================================================
        // class Perspective (ResultSet)
        // =========================================================================
        module.Perspective.prototype = {

            /**
             *  A perspective.
             *  @constructs sap.bc.ina.api.sina.impl.inav2.Perspective
             *  @ignore
             */
            init: function(properties) {
                var self = this;
                self.chartFacets = [];
                self.searchFacet = null;
                self.searchresultset = null;
                self.layout = null;
                properties = properties || {};
            },

            getSearchResultSet: function() {
                return this.searchresultset;
            },

            getChartFacets: function() {
                return this.chartFacets;
            },

            getSearchFacet: function() {
                return this.searchFacet;
            },

            getLayout: function() {
                return this.layout;
            },

            setJsonData: function(data) {
                var self = this;
                //there is always a searchresult
                self.searchFacet = new module.Facet({
                    "facetType": "searchresult"
                });
                self.searchFacet.setJsonData(data);
                self.searchresultset = self.searchFacet.getQuery().getResultSetSync();
                if (data.ResultsetFacets && data.ResultsetFacets.Elements) {
                    for (var j = 0; j < data.ResultsetFacets.Elements.length; j++) {
                        var facet = new module.Facet({
                            "facetType": sinabase.FacetType.ATTRIBUTE
                        });
                        facet.setJsonData(data.ResultsetFacets.Elements[j]);
                        self.chartFacets.push(facet);
                    }
                } else {
                    //TODO: remove workaround
                    //convert catalogquery searchresult to a datasource facet
                    // var dsFacet = new module.Facet({
                    //     facetType: '$$datasources$$'
                    // });
                    // for (var i = 0; i < self.searchFacet.getQuery().getResultSetSync().getElements().length; i++) {
                    //     var dataSource = new filter.DataSource();
                    //     var resultElement = self.searchFacet.getQuery().getResultSetSync().getElements()[i];
                    //     dataSource.setObjectName(resultElement.ObjectName.valueRaw);
                    //     dataSource.setPackageName(resultElement.PackageName.valueRaw);
                    //     dataSource.setSchemaName(resultElement.SchemaName.valueRaw);
                    //     dataSource.setType(resultElement.Type.valueRaw);
                    //     dataSource.setLabel(resultElement.Description.value);
                    //     dsFacet.getQuery().getResultSetSync().getElements()[i] = {
                    //         dataSource: dataSource
                    //     };
                    // }
                    // self.searchFacet.getQuery().getResultSetSync().elements = [];
                    // self.searchFacet.getQuery().getResultSetSync().totalcount = -1;
                    // self.chartFacets.push(dsFacet);
                }

            }

        };

        // =========================================================================
        // class perspective query
        // =========================================================================
        module.PerspectiveGetQuery.prototype = $.extend({}, module.Query.prototype, {

            /**
             * Creates a perspective search query.
             * @ignore
             * @constructs sap.bc.ina.api.sina.impl.inav2.PerspectiveGetQuery
             * @param  {Object} properties Configuration object.
             * @augments {sap.bc.ina.api.sina.impl.inav2.sina_impl.Query}
             */
            init: function(properties) {
                var self = this;
                properties = properties || {};
                this.perspectiveId = properties.perspectiveId;
                module.Query.prototype.init.apply(this, [properties]);
                this.resultSetClass = module.Perspective2;
            },

            setPerspectiveId: function(perspectiveId) {
                this.perspectiveId = perspectiveId;
            },

            getPerspective: function(onSuccess, onError) {
                var self = this;
                var request = {
                    async: true,
                    url: "/sap/bc/ina/service/v2/Perspectives('" + this.perspectiveId + "')",
                    type: "GET"
                };

                var jqXHR = this.system.proxy.ajax(request);

                jqXHR.done(function(data) {
                    if (data && data.error) {
                        onError(data.error);
                    }
                    self.resultSet = new self.resultSetClass(self.resultSetProperties);
                    self.resultSet.setJsonData(data);
                    if (onSuccess) {
                        onSuccess(self.resultSet);
                    }
                })
                    .fail(function(error) {
                        if (onError)
                            onError(error);
                    });

            }

        });

        // =========================================================================
        // class Perspective 2 - static JSON form server
        // =========================================================================
        module.Perspective2.prototype = {

            /**
             *  A perspective.
             *  @constructs sap.bc.ina.api.sina.impl.inav2.Perspective2
             *  @ignore
             */
            init: function(properties) {
                var self = this;
                properties = properties || {};
            },


            getFacetForID: function(facetId) {
                var self = this;
                for (var j = 0; j < self.facets.length; j++) {
                    if (self.facets[j].facetId === facetId) {
                        return self.facets[j];
                    }
                }
                return undefined;

            },

            getDimensionForID: function(dimensionId) {
                var self = this;
                for (var j = 0; j < self.dimensions.length; j++) {
                    if (self.dimensions[j].Name === dimensionId) {
                        return self.dimensions[j];
                    }
                }
                return undefined;

            },

            getPreviewDimension: function() {
                var self = this;
                if (this.bindings["WIDGET-4"] && this.bindings["WIDGET-4"].dimension) {
                    return this.bindings["WIDGET-4"].dimension;
                }
                if (this.bindings["WIDGET-1"] && this.bindings["WIDGET-1"].dimension) {
                    return this.bindings["WIDGET-1"].dimension;
                }
                if (this.bindings["WIDGET-2"] && this.bindings["WIDGET-2"].dimension) {
                    return this.bindings["WIDGET-2"].dimension;
                }
                if (this.bindings["WIDGET-3"] && this.bindings["WIDGET-3"].dimension) {
                    return this.bindings["WIDGET-3"].dimension;
                }
                return undefined;

            },

            setJsonData: function(data) {
                var self = this;
                self.rawdata = data;
                self.ChangedAt = data.ChangedAt;
                self.ChangedBy = data.ChangedBy;
                self.content = JSON.parse(data.Content);
                self.perspectiveId = data.Id;
                self.name = data.Name;
                self.packageName = data.Package;
                self.isActive = data.isActive;
                self.isGenerated = data.isGenerated;

                self.datasource = self.content.Model.Queries[0].Datasource;

                self.measures = [];
                var measuresJSON = self.content.Model.Queries[0].CustomDimension1.Members;
                for (var k = 0; k < measuresJSON.length; k++) {
                    self.measures.push(measuresJSON[k]);
                }

                self.dimensions = [];
                var dimensionJSON = self.content.Model.Queries[0].Dimensions;
                for (var j = 0; j < dimensionJSON.length; j++) {
                    self.dimensions.push(dimensionJSON[j]);
                }

                self.facets = [];
                var facetJSON = self.content.Model.Facets;
                for (var i = 0; i < facetJSON.length; i++) {

                    self.facets.push({
                        isActive: facetJSON[i].Active,
                        facetId: facetJSON[i].FacetId,
                        dimension: self.getDimensionForID(facetJSON[i].SeriesChart.ScaleDimensions[0].DimensionName)
                    });


                }

                self.bindings = {};
                var bindingsJSON = self.content.Bindings;
                for (var l = 0; l < bindingsJSON.length; l++) {
                    var bindingJSON = bindingsJSON[l];
                    self.bindings[bindingJSON.WidgetId] = self.getFacetForID(bindingJSON.FacetId);
                }
            }

        };

        // =========================================================================
        // class perspective query
        // =========================================================================
        module.PerspectiveSearchQuery.prototype = $.extend({}, module.Query.prototype, {

            /**
             * Creates a perspective search query.
             * @ignore
             * @constructs sap.bc.ina.api.sina.impl.inav2.PerspectiveSearchQuery
             * @param  {Object} properties Configuration object.
             * @augments {sap.bc.ina.api.sina.impl.inav2.sina_impl.Query}
             */
            init: function(properties) {
                var self = this;
                properties = properties || {};
                module.Query.prototype.init.apply(this, [properties]);
                this.filter.searchTerms = properties.searchTerms || "*";
                this.resultSetClass = module.PerspectiveSearchResultSet;
            },


            createJsonRequest: function() {
                jsontemplates.perspectiveSearchRequest.Search.SearchTerms = this.filter.searchTerms;
                jsontemplates.perspectiveSearchRequest.Search.Top = this._top;
                jsontemplates.perspectiveSearchRequest.Search.Skip = this._skip;
                return jsontemplates.perspectiveSearchRequest;
            },

            getPerspectiveResults: function(onSuccess, onError) {
                this.getResultSet(onSuccess, onError);
            }

        });

        // =========================================================================
        // class PerspectiveSearch (ResultSet)
        // =========================================================================
        module.PerspectiveSearchResultSet.prototype = {

            /**
             *  A perspective.
             *  @constructs sap.bc.ina.api.sina.impl.inav2.sina_impl.PerspectiveSearchResultSet
             *  @ignore
             */
            init: function(properties) {
                var self = this;
                self.perspectives = [];
                properties = properties || {};
            },

            getPerspectiveSearchResultSet: function() {
                return this.perspectives;
            },

            setJsonData: function(data) {
                var self = this;

                var perspectivesJSON = data["ItemLists"][0]["Items"];
                for (var i = 0; i < perspectivesJSON.length; i++) {
                    var namedValues = perspectivesJSON[i]["NamedValues"];
                    var perspective = {
                        packageId: namedValues[0].Value,
                        perspectiveId: namedValues[0].Value + "/" + namedValues[1].Value,
                        perspectiveDescription: namedValues[3].Value,
                        title: namedValues[2].Value
                    };
                    self.perspectives.push(perspective);
                }

            }

        };

        // =========================================================================
        // class suggestion query
        // =========================================================================
        module.SuggestionQuery.prototype = $.extend({}, sinabase.SuggestionQuery.prototype, module.Query.prototype, {

            /**
             * A suggestion query for a SAP HANA system.
             * @constructs sap.bc.ina.api.sina.impl.inav2.sina_impl.SuggestionQuery
             * @augments {sap.bc.ina.api.sina.sinabase.SuggestionQuery}
             * @augments {sap.bc.ina.api.sina.impl.inav2.sina_impl.Query}
             * @param  {Object} properties Configuration object.
             * @since SAP HANA SPS 06
             * @private
             */
            init: function(properties) {
                properties = properties || {};
                this.attributes = properties.attributes || [];
                module.Query.prototype.init.apply(this, arguments);
                sinabase.SuggestionQuery.prototype.init.apply(this, arguments);
                this.resultSetClass = module.SuggestionResultSet;
            },

            /**
             * Adds a response attribute to this suggestion query. This attributes is used
             * to look for suitable suggestions for the search term of this query. At least one term is required.
             * @instance
             * @since SAP HANA SPS 06
             * @memberOf sap.bc.ina.api.sina.impl.inav2.sina_impl.SuggestionQuery
             * @param {String} attribute The name of the attribute as given in the SAP HANA database.
             */
            addResponseAttribute: function(attribute) {
                this.attributes.push(attribute);
                this._resetResultSet();
                return this;
            },

            /**
             * Sets a list of response attributes for this suggestion query. These attributes are used
             * to look for suitable suggestions for the search term of this query. At least one term is required.
             * @instance
             * @since SAP HANA SPS 06
             * @memberOf sap.bc.ina.api.sina.impl.inav2.sina_impl.SuggestionQuery
             * @param {Array} attributes A list of names of the attributes as given in the SAP HANA database.
             */
            setResponseAttributes: function(attributes) {
                this.attributes = attributes;
                this._resetResultSet();
                return this;
            },

            createJsonRequest: function() {
                jsontemplates.suggestionRequest.Suggestions.Precalculated = false;
                var searchterms = this.filter.getSearchTerms();
                if (this.attributes.length === 0) {
                    throw "add at least one response attribute to your query";
                }
                if (searchterms.charAt(searchterms.length - 1) !== '*') {
                    searchterms += '*';
                }
                jsontemplates.suggestionRequest.Suggestions.SearchTerms = searchterms;
                jsontemplates.suggestionRequest.Suggestions.AttributeNames = this.attributes;
                jsontemplates.suggestionRequest.DataSource = this.filter.dataSource.toInAJson();
                jsontemplates.suggestionRequest.Suggestions.Top = this._top;
                var filter = this.filter.getJson();
                if (filter && filter.Selection) {
                    jsontemplates.suggestionRequest.Suggestions.Filter = this.filter.getJson();
                }
                return jsontemplates.suggestionRequest;
            }

        });


        // =========================================================================
        // class suggestion result set
        // =========================================================================
        module.SuggestionResultSet.prototype = {

            /**
             * A suggestion result set for a SAP HANA system.
             * @constructs sap.bc.ina.api.sina.impl.inav2.sina_impl.SuggestionResultSet
             * @since SAP HANA SPS 06
             * @private
             */
            init: function() {
                this.suggestions = [];
            },

            setJsonData: function(data) {
                this.suggestions = [];
                var itemLists = {};
                for (var i = 0; i < data.ItemLists.length; i++) {
                    itemLists[data.ItemLists[i].Name] = data.ItemLists[i];
                }
                // only Suggestions ItemList is relevant here
                for (var a = 0; a < itemLists.Suggestions.Items.length; a++) {
                    var item = itemLists.Suggestions.Items[a],
                        term = "",
                        attribute = "",
                        attributeDescription = "";
                    // dataSource = new filter.DataSource(),
                    // dataSourceDescription = "";
                    var suggestion = {};
                    for (var d = 0; d < item.NamedValues.length; ++d) {
                        var namedValue = item.NamedValues[d];
                        switch (namedValue.Name) {
                            case "Term":
                                term = namedValue.Value;
                                suggestion.label = term;
                                break;
                                // case "$$DataSource$$":
                                //     dataSource = namedValue.Value;
                                //     dataSource.setObjectName(dataSource);
                                // break;
                                // case "$$DataSourceDescription$$":
                                //     dataSourceDescription = namedValue.Value;
                                //     dataSource.setLabel(dataSourceDescription);
                                // break;
                            case "AttributeName":
                                attribute = namedValue.Value;
                                suggestion.attribute = attribute;
                                break;
                            case "$$AttributeDescription$$":
                                attributeDescription = namedValue.Value;
                                suggestion.attributeDescription = attributeDescription;
                                break;
                            case "Score":
                                var score = namedValue.Value;
                                suggestion.score = parseInt(score, 10);
                                break;
                        }

                    }
                    // suggestion.dataSource = dataSource;
                    this.suggestions.push(suggestion);
                }
                this.suggestions.sort(function(a, b) {
                    return b.score - a.score;
                });
                for (var o = this.suggestions.length - 1; o >= 0; o--) {
                    delete this.suggestions[o].score;
                }
            },

            /**
             * Returns the elements of the result set, ordered by relevancy score.
             * @memberOf sap.bc.ina.api.sina.impl.inav2.sina_impl.SuggestionResultSet
             * @instance
             * @since SAP HANA SPS 06
             * @return {Array} A list of result set elements.
             * @example
             * var queryProperties = {
             *     dataSource  : { schemaName : "SYSTEM",
             *                     objectName : "J_EPM_PRODUCT"
             *     },
             *     searchTerms : "s*",
             *     attributes  : ['CATEGORY','PRODUCT_ID','TEXT','PRICE','CURRENCY_CODE']
             * };
             * var query = sap.bc.ina.api.sina.createSuggestionQuery(queryProperties);
             * var resultSet = query.getResultSetSync();
             * var elements = resultSet.getElements();
             * // contents of elements (shortened):
             * [{"label":"USD","attribute":"CURRENCY_CODE"},
             *   {"label":"Software","attribute":"CATEGORY"},
             *   {"label":"Scanner","attribute":"CATEGORY"},
             *   {"label":"Speakers","attribute":"CATEGORY"},
             *   {"label":"1200 dpi x 1200 dpi - up to 25 ppm (mono) / up to 24 ppm (colour) - capacity: 100 sheets - Hi-Speed USB2.0, Ethernet","attribute":"TEXT"},
             *   {"label":"1000 dpi x 1000 dpi - up to 16 ppm (mono) / up to 15 ppm (colour)- capacity 80 sheets - scanner (216 x 297 mm, 1200dpi x 2400dpi)","attribute":"TEXT"},
             *   {"label":"Print 2400 dpi image quality color documents at speeds of up to 32 ppm¹ (color) or 36 ppm¹ (monochrome), letter/A4. Powerful 500 MHz processor, 512MB of memory","attribute":"TEXT"},
             *   {"label":"Scanner and Printer","attribute":"CATEGORY"},
             *   {"label":"1000 dpi x 1000 dpi - up to 15 ppm (mono) / up to 13 ppm (colour) - capacity: 40 sheets - Hi-Speed USB - excellent dimesions for the small office","attribute":"TEXT"},
             *   {"label":"Print up to 25 ppm letter and 24 ppm A4 color or monochrome, with a first-page-out-time of less than 13 seconds for monochrome and less than 15 seconds for color","attribute":"TEXT"}
             *  ]
             */
            getElements: function() {
                return this.suggestions;
            }

        };

        // =========================================================================
        // class suggestion 2 query
        // =========================================================================
        module.Suggestion2Query.prototype = $.extend({}, sinabase.SuggestionQuery.prototype, module.Query.prototype, {

            init: function(properties) {
                properties = properties || {};
                this.attributes = properties.attributes || [];
                module.Query.prototype.init.apply(this, [properties]);
                sinabase.SuggestionQuery.prototype.init.apply(this, [properties]);
                this.resultSetClass = module.Suggestion2ResultSet;
                this.searchTerms = properties.searchTerms || {};
                this.suggestionTerm = properties.suggestionTerm || '';
            },

            /**
             * Adds a response attribute to this suggestion query. Instead of the SuggestionQuery
             * which searches within these attributes. This Suggestion2Query will search everywhere
             * but only returns these response attributes.
             * @ignore
             * @instance
             * @since SAP HANA SPS 06
             * @memberOf sap.bc.ina.api.sina.impl.inav2.Suggestion2Query
             * @param {String} attribute the name of the attribute as given in the HANA database
             */
            addResponseAttribute: function(attribute) {
                this.attributes.push(attribute);
                this._resetResultSet();
                return this;
            },


            addSearchTerm: function(term) {
                if (term) {
                    this.searchTerms[term] = term;
                }
                this._resetResultSet();
                return this;
            },

            setSuggestionTerm: function(term) {
                if (term.charAt(term.length - 1) !== '*') {
                    term += '*';
                }
                if (this.suggestionTerm !== term) {
                    this.suggestionTerm = term;
                    this._resetResultSet();
                }
                return this;
            },


            /**
             * Adds a response attribute to this suggestion query. Instead of the SuggestionQuery
             * which searches within these attributes. This Suggestion2Query will search everywhere
             * but only returns these response attributes.
             * @ignore
             * @instance
             * @memberOf sap.bc.ina.api.sina.impl.inav2.Suggestion2Query
             * @param {Array} attributes list with the names of the attribute as given in the SAP HANA database.
             */
            setResponseAttributes: function(attributes) {
                this.attributes = attributes;
                this._resetResultSet();
                return this;
            },

            createJsonRequest: function() {
                jsontemplates.suggestion2Request.Suggestions2.Precalculated = false;
                jsontemplates.suggestion2Request.Suggestions2.NamedValues = [];
                for (var i = 0; i < this.attributes.length; i++) {
                    jsontemplates.suggestion2Request.Suggestions2.NamedValues.push({
                        AttributeName: this.attributes[i],
                        Name: this.attributes[i]
                    });
                }
                jsontemplates.suggestion2Request.DataSource = this.filter.dataSource.toInAJson();
                jsontemplates.suggestion2Request.Suggestions2.Top = this.getTop();
                jsontemplates.suggestion2Request.Suggestions2.Skip = this.getSkip();
                var rootConditionGroup = new filter.ConditionGroup();
                var searchTermConditions = new filter.ConditionGroup();
                for (var searchTerm in this.searchTerms) {
                    var stCondition = new filter.Condition('$$SearchTerms$$', 'contains', searchTerm);
                    rootConditionGroup.addCondition(stCondition);
                }
                var suggestionCondition = new filter.Condition('$$SuggestionTerms$$', 'contains', this.suggestionTerm);
                rootConditionGroup.addCondition(suggestionCondition);
                rootConditionGroup.addCondition(this.getFilter().getFilterConditions());
                jsontemplates.suggestion2Request.Suggestions2.Filter = rootConditionGroup.getJson();
                return jsontemplates.suggestion2Request;
            }

        });

        // =========================================================================
        // class suggestion 2 result set
        // =========================================================================
        module.Suggestion2ResultSet.prototype = {

            init: function() {
                this.datasources = {};
                this.suggestions = [];
            },

            setJsonData: function(data) {
                this.datasources = {};
                this.suggestions = [];

                function isNamedValueSuitable(name) {
                    switch (name) {
                        //upper and lower bounds are not needed now
                        case "Value1":
                        case "Value2":
                        case "Order":
                            return false;
                        default:
                            return true;
                    }
                }

                var itemLists = {};
                if (!data.ItemLists) {
                    return;
                }
                for (var i = 0; i < data.ItemLists.length; i++) {
                    itemLists[data.ItemLists[i].Name] = data.ItemLists[i];
                }

                for (var a = 0; a < data.Grids.length; a++) {
                    var axes = data.Grids[a].Axes;
                    var cells = data.Grids[a].Cells;
                    if (axes === undefined || cells === undefined) {
                        return;
                    }
                    var suggestionDict = {};
                    for (var cellIndex = 0; cellIndex < cells.length; ++cellIndex) {
                        var cell = cells[cellIndex],
                            attributeName = "",
                            attributeLabel = "",
                            dataSourceLabel = "",
                            suggestion = {};
                        suggestion.dataSource = new filter.DataSource();
                        suggestion.attribute = {};
                        for (var j = 0; j < cell.Index.length; j++) {
                            var cellIndexValue = cell.Index[j];
                            var tuple = axes[j].Tuples[cellIndexValue];
                            if (tuple === undefined) {
                                continue;
                            }
                            for (var c = 0; c < tuple.length; c++) {
                                var dimension = axes[j].Dimensions[c];
                                var tupleValueForDimension = tuple[c];
                                var itemlist = itemLists[dimension.ItemListName];
                                var namedValues = itemlist.Items[tupleValueForDimension].NamedValues;
                                for (var d = 0; d < namedValues.length; ++d) {
                                    var namedValue = namedValues[d];
                                    switch (namedValue.Name) {
                                        case "$$Term$$":
                                            suggestion.valueRaw = cell.Value || cell.ValueFormatted || null;
                                            suggestion.value = cell.ValueFormatted || cell.Value || null;
                                            suggestion.labelRaw = namedValue.Value;
                                            suggestion.label = namedValue.ValueFormatted;
                                            if (!suggestion.filter) {
                                                suggestion.filter = {};
                                            }
                                            suggestion.filter.value = suggestion.labelRaw;
                                            suggestion.filter.valueLabel = suggestion.labelRaw;

                                            break;
                                        case "$$DataSource$$":
                                            var objectName = namedValue.Value;
                                            suggestion.dataSource.setObjectNameValue(objectName);
                                            break;
                                        case "$$DataSourceDescription$$":
                                            var objectNameLabel = namedValue.Value;
                                            suggestion.dataSource.setObjectNameLabel(objectNameLabel);
                                            break;
                                        case "$$Attribute$$":
                                            var attribute = namedValue.Value;
                                            if (!suggestion.filter) {
                                                suggestion.filter = {};
                                            }
                                            suggestion.filter.attribute = attribute;
                                            suggestion.attribute.value = attribute;
                                            break;
                                        case "$$AttributeDescription$$":
                                            attributeLabel = namedValue.Value;
                                            if (!suggestion.filter) {
                                                suggestion.filter = {};
                                            }
                                            suggestion.filter.attributeLabel = attributeLabel;
                                            suggestion.attribute.label = attributeLabel;
                                            break;
                                    }

                                }
                            }
                        }
                        this.suggestions.push(suggestion);
                    }

                }

            },


            getElements: function() {
                return this.suggestions;
            }

        };

        // =========================================================================
        // class chart query
        // =========================================================================
        module.ChartQuery.prototype = $.extend({}, sinabase.ChartQuery.prototype, module.Query.prototype, {

            /**
             * A query that yields results suitable for simple chart controls, like
             * pie or bar charts.
             * @since SAP HANA SPS 06
             * @constructs sap.bc.ina.api.sina.impl.inav2.sina_impl.ChartQuery
             * @augments {sap.bc.ina.api.sina.impl.inav2.sina_impl.Query}
             * @augments {sap.bc.ina.api.sina.sinabase.ChartQuery}
             * @private
             */
            init: function(properties) {
                properties = properties || {};
                module.Query.prototype.init.apply(this, [properties]);
                sinabase.ChartQuery.prototype.init.apply(this, [properties]);
                this.dimensions = {};
                this.dimensions.CustomDimension1 = {
                    Axis: "Columns",
                    Name: "CustomDimension1",
                    Members: []
                };
                properties.dimensions = properties.dimensions || {};
                if ($.type(properties.dimensions) === 'array') {
                    for (var i = 0; i < properties.dimensions.length; i++) {
                        this.addDimension(properties.dimensions[i]);
                    }
                } else if ($.type(properties.dimensions) === 'string' || $.type(properties.dimensions) === 'object') {
                    this.addDimension(properties.dimensions);
                }
                properties.measures = properties.measures || {};
                if ($.type(properties.measures) === 'array') {
                    for (var j = 0; j < properties.measures.length; j++) {
                        this.addMeasure(properties.measures[j]);
                    }
                } else if ($.type(properties.measures) === 'object') {
                    this.addMeasure(properties.measures);
                }
                this.resultSetClass = module.ChartResultSet;
            },

            createJsonRequest: function() {
                jsontemplates.chartRequest.DataSource = this.filter.dataSource.toInAJson();
                jsontemplates.chartRequest.SearchTerms = this.filter.getSearchTerms();
                jsontemplates.chartRequest.Analytics.Definition.Filter = this.filter.getJson();
                jsontemplates.chartRequest.Analytics.Definition.Dimensions = [];
                for (var dimension in this.dimensions) {
                    jsontemplates.chartRequest.Analytics.Definition.Dimensions.push(this.dimensions[dimension]);
                }
                return jsontemplates.chartRequest;
            },

            /**
             * Adds a count measure for the given dimension to the chart query.
             * @memberOf sap.bc.ina.api.sina.impl.inav2.ChartQuery
             * @instance
             * @param  {string} dimension The dimension that the count is computed for.
             * @return {sap.bc.ina.api.sina.impl.inav2.ChartQuery} The chart query to allow chained method calls.
             */
            count: function(dimension) {
                this.addMeasure({
                    name: dimension,
                    aggregationFunction: 'COUNT'
                });
                return this;
            },

            /**
             * Adds one of the following aggregations to a dimension: 'COUNT', 'AVG', 'SUM', 'MIN', 'MAX'
             * @memberOf sap.bc.ina.api.sina.impl.inav2.ChartQuery
             * @instance
             * @since SAP HANA SPS 06
             * @param {Object} properties The configuration object can have the following properties:p
             * name, aggregationFunction, sortOrder, top.
             * @example
             * var query = sina.createChartQuery()
             *  .dataSource({ "schemaName"  : {"value":"SYSTEM"},
             *                "objectName"  : {"value":"J_EPM_PRODUCT"})
             * .addDimension("CATEGORY")
             * .addMeasure({name:"CATEGORY",aggregationFunction:"COUNT"});
             * var resultSet = query.getResultSetSync();
             */
            addMeasure: function(properties) {
                if ($.isEmptyObject(properties)) {
                    return {};
                }
                var axis = "Columns";
                var name = "CustomDimension1"; //COUNT_"+dimension;
                var member;
                if (properties.aggregationFunction.toUpperCase() === 'COUNT' || properties.aggregationFunction.toUpperCase() === 'AVG') {
                    member = this._createAggregationDimension(properties.aggregationFunction, properties.name, properties.aggregationFunction, properties.sortOrder || undefined, properties.top || undefined);
                } else {
                    member = this._createAggregationDimension(properties.aggregationFunction, "", properties.name, properties.sortOrder, properties.top);
                    delete member.AggregationDimension;
                    delete member.Name;
                    delete member.SortOrder;
                }
                this.dimensions.CustomDimension1.Members.push(member);
                return this;
            },

            /**
             * Adds a dimension to the query.
             * @memberOf sap.bc.ina.api.sina.impl.inav2.ChartQuery
             * @instance
             * @since SAP HANA SPS 06
             * @param {String|Object} dimension The name of the dimension. This is the same as the name of the corresponding database attribute.
             * If it is an object, the name and values of this object must be the same as the functions parameters.
             * @param {int} sortOrder Sort order of this dimension. 1 for ascending, 2 for descending.
             * Default is 1.
             * @param {int} top How many members does the dimension have? The default value is 5.
             * @example <caption>Plain function call</caption>
             * var query = sina.createChartQuery()
             * .addDimension("CATEGORY",1,5)
             * @example <caption>Call with properties object</caption>
             * var query = sina.createChartQuery({
             *     dimensions: [{name: "YEAR", sortOrder: 1, top:5}]
             * });
             */
            addDimension: function(dimension, sortOrder, top) {
                if ($.type(dimension) === 'object') {
                    if ($.isEmptyObject(dimension)) {
                        return {};
                    }
                    this.dimensions[dimension.name] = this._createDimension(dimension.name, null, dimension.sortOrder, dimension.top);
                } else if ($.type(dimension) === 'string') {
                    if (!dimension) {
                        return {};
                    }
                    this.dimensions[dimension] = this._createDimension(dimension, null, sortOrder, top);
                }
                return this;
            },

            _createDimension: function(dimension, axis, sortOrder, top) {
                return {
                    "Axis": axis || "Rows",
                    "Name": dimension,
                    "SortOrder": sortOrder || 1,
                    "Top": top || 5
                };
            },

            /**
             * Creates an aggregation for a dimension.
             * @private
             * @ignore
             * @param  {String} aggregation Type of aggregation to be created. The default value is SUM.
             * @param  {String} dimension   Dimension that the aggregation is created for.
             * @param  {int}    sortOrder   Sort order of the aggregation dimension. 1 for ascending, 2 for descending.
             * @param  {String} name        Name of the aggregation to be created.
             * @return {Object}             An object suitable for an INA request.
             */
            _createAggregationDimension: function(aggregationFunction, aggregationDimension, name, sortOrder) {
                return {
                    "Aggregation": aggregationFunction,
                    "AggregationDimension": aggregationDimension,
                    "MemberOperand": {
                        "AttributeName": "Measures",
                        "Comparison": "=",
                        "Value": name
                    },
                    "Name": name,
                    "SortOrder": sortOrder || 2
                };
            }

        });

        // =========================================================================
        // class chart result set
        // =========================================================================
        module.ChartResultSet.prototype = {

            /**
             * A result set that yields elements suitable for simple chart controls, like
             * pie or bar charts.
             * @since SAP HANA SPS 06
             * @constructs sap.bc.ina.api.sina.impl.inav2.sina_impl.ChartResultSet
             * @private
             */
            init: function(properties) {
                properties = properties || {};
                this.type = properties.type;
                this.elements = [];
            },

            /**
             * Creates filter conditions for simple charts based on named values.
             * It also decides whether the element sets a filter range or an 'equals' filter.
             * There are the following cases:
             * 1) Value1 and Value2 both have values that are not the empty string:
             * It is a range with upper and lower boundary.
             * 2) Value2 has no value:
             * It is not a range but an equals ("=") filter condition.
             * 3) Either Value1 or Value2 have an empty string ("") as value:
             * It is a range with only one boundary, upper or lower.
             * @private
             * @ignore
             * @param  {object} element     The chart element that the filter condition is added to.
             * @param  {object} namedValues Server side data.
             * @param  {object} metadata    Server side meta data.
             */
            _parseNamedValues: function(element, namedValues, metadata) {
                var self = this;

                for (var i = 0; i < namedValues.length; i++) {
                    var name = namedValues[i].Name;
                    var value = namedValues[i].Value;
                    element.label = namedValues[i].ValueFormatted;
                    element.labelRaw = namedValues[i].Value;
                    switch (name) {
                        case '$$DataSource$$':
                            self._parseNamedValuesForDataSource(element, value);
                            break;
                        case '$$AttributeValue$$':
                            self._parseNamedValuesForRange(element, value, metadata);
                            break;
                    }

                }
            },

            _parseNamedValuesForRange: function(element, values, metadata) {
                var valueIDRaw,
                    value1,
                    value2;

                for (var d = 0; d < values.length; ++d) {
                    var namedValue = values[d];
                    switch (namedValue.Name) {
                        case "ValueID":
                            element.label = namedValue.ValueFormatted;
                            valueIDRaw = namedValue.Value;
                            break;
                        case "Value1":
                            if (metadata.Cube.ObjectName && (namedValue.Value !== undefined)) {
                                value1 = new filter.Condition(metadata.Cube.ObjectName, ">=", namedValue.Value);
                            }
                            break;
                        case "Value2":
                            if (metadata.Cube.ObjectName && (namedValue.Value !== undefined)) {
                                value2 = new filter.Condition(metadata.Cube.ObjectName, "<=", namedValue.Value);
                            }
                            break;
                        case "Order":
                            break;
                    }
                }
                if (valueIDRaw) {
                    if (value1 && value2) {
                        // 1) range
                        var group = new filter.ConditionGroup();
                        group.setOperator("AND");
                        group.setLabel(element.label);
                        if (value1.value) {
                            // 3) upper boundary of the range
                            group.addCondition(value1);
                        }
                        if (value2.value) {
                            // 3) lower boundary of the range
                            group.addCondition(value2);
                        }
                        element.labelRaw = group;
                    } else if (value1 && value1.value && (!value2)) {
                        // 2) not a range
                        value1.operator = '=';
                        element.labelRaw = value1;
                    } else if (value2 && value2.value && (!value1)) {
                        // 2) not a range
                        value2.operator = '=';
                        element.labelRaw = value2;
                    }
                }
            },

            // DataSource chart (category tree)
            _parseNamedValuesForDataSource: function(element, values) {

                element.dataSource = new filter.DataSource();
                for (var d = 0; d < values.length; ++d) {
                    var namedValue = values[d];
                    switch (namedValue.Name) {
                        case "ObjectName":
                            var label = namedValue.ValueFormatted;
                            element.dataSource.setLabel(label);
                            element.dataSource.setObjectName(namedValue.Value, namedValue.ValueFormatted);
                            break;
                        case "PackageName":
                            element.dataSource.setPackageName(namedValue.Value, namedValue.ValueFormatted);
                            break;
                        case "SchemaName":
                            element.dataSource.setSchemaName(namedValue.Value, namedValue.ValueFormatted);
                            break;
                        case "Type":
                            element.dataSource.setType(namedValue.Value, namedValue.ValueFormatted);
                            break;
                        default:
                            element[namedValue.Name] = namedValue.Value;
                            break;
                    }
                }
            },

            setJsonData: function(data) {
                this.elements = [];
                var metadata;
                if (data.Metadata) {
                    metadata = data.Metadata;
                }
                if (data.ResultSet) {
                    data = data.ResultSet;
                }
                var itemLists = {};
                for (var i = 0; i < data.ItemLists.length; i++) {
                    itemLists[data.ItemLists[i].Name] = data.ItemLists[i];
                }

                for (var a = 0; a < data.Grids.length; a++) {
                    var axes = data.Grids[a].Axes;
                    var cells = data.Grids[a].Cells;
                    for (var cellIndex = 0; cellIndex < cells.length; ++cellIndex) {
                        //one dimension chart
                        if (axes[0].Dimensions.length === 1) {
                            var cell = cells[cellIndex];
                            var element = {
                                valueRaw: cell.Value || cell.ValueFormatted || null,
                                value: cell.ValueFormatted || cell.Value || null
                            };
                            // only axes 0 is relevant for chart results
                            for (var j = 0; j < 1; j++) {
                                var cellIndexValue = cell.Index[j];
                                var tuple = axes[j].Tuples[cellIndexValue];
                                if (tuple === undefined) {
                                    continue;
                                }
                                for (var c = 0; c < tuple.length; c++) {
                                    var dimension = axes[j].Dimensions[c];
                                    var tupleValueForDimension = tuple[c];
                                    var itemlist = itemLists[dimension.ItemListName];
                                    var namedValues = itemlist.Items[tupleValueForDimension].NamedValues;
                                    this._parseNamedValues(element, namedValues, metadata);
                                }
                            }
                            this.elements.push(element);
                        }

                    }
                }

            },

            /**
             * Returns the elements of the result set.
             * @memberOf sap.bc.ina.api.sina.impl.inav2.sina_impl.ChartResultSet
             * @instance
             * @since SAP HANA SPS 06
             * @return {Array} A list of result set elements.
             * @example
             * var query = sap.bc.ina.api.sina.createChartQuery()
             * .dataSource({ schemaName : "SYSTEM",
             *               objectName : "J_EPM_PRODUCT"
             *  })
             * .addDimension("CATEGORY")
             * .addMeasure({ name : "CATEGORY",
             *               aggregationFunction : "COUNT"
             * }); //end of query
             * var resultSet = query.getResultSetSync();
             * var elements = resultSet.getElements();
             * // contents of elements:
             * [
                {
                  "label": "Others",
                  "labelRaw": "Others",
                  "value": "13",
                  "valueRaw": 13
                },
                {
                  "label": "Notebooks",
                  "labelRaw": "Notebooks",
                  "value": "10",
                  "valueRaw": 10
                },
                {
                  "label": "Flat screens",
                  "labelRaw": "Flat screens",
                  "value": "9",
                  "valueRaw": 9
                },
                {
                  "label": "Software",
                  "labelRaw": "Software",
                  "value": "8",
                  "valueRaw": 8
                },
                {
                  "label": "Electronics",
                  "labelRaw": "Electronics",
                  "value": "5",
                  "valueRaw": 5
                }
              ]
             */
            getElements: function() {
                return this.elements;
            }
        };

        // =======================================================================
        // result set parser
        // =======================================================================

        var ResultSetParser = function() {
            this.init.apply(this, arguments);
        };

        ResultSetParser.prototype = {

            init: function(options) {
                this.resultSet = options.resultSet;
                this.parse();
            },

            parse: function() {

                // enhance result set:
                // -> create link to item lists in dimensions of axes
                this.enhance(this.resultSet);

                // get reference to grid,row axis,col axis
                var grid = this.resultSet.Grids[0];
                var rowAxis = grid.Axes[0];
                var colAxis = grid.Axes[1];

                // key function for getting key of an item
                // (key needed for insertion into tree)
                var keyFunction = function(item) {
                    return item.NamedValues[0].Value;
                };

                // create new tree
                var tree = new Tree({
                    keyFunction: keyFunction
                });

                // loop at all cells and add cell to result tree
                for (var i = 0; i < grid.Cells.length; ++i) {

                    var cell = grid.Cells[i];

                    var rowIndex = cell.Index[0];
                    var rowItems = this.resolve(rowAxis, rowIndex);
                    var rowItemsDebug = rowItems.map(keyFunction);

                    var colIndex = cell.Index[1];
                    var colItems = this.resolve(colAxis, colIndex);
                    var colItemsDebug = colItems.map(keyFunction);
                    colItems = [$.extend({}, colItems[0])];
                    // add cell info to col item
                    colItems[0].cell = cell;

                    // assemble tree path = rowItems + colItems
                    var treePath = rowItems;
                    treePath.push.apply(treePath, colItems);

                    // insert
                    tree.insert(treePath);

                }

                return tree;
            },

            resolve: function(axis, index) {
                var items = [];
                var tuples = axis.Tuples[index];
                for (var i = 0; i < tuples.length; ++i) {
                    var itemIndex = tuples[i];
                    var item = axis.Dimensions[i].ItemList.Items[itemIndex];
                    items.push(item);
                }
                return items;
            },

            enhance: function(resultSet) {

                // create dictionary with item lists
                var itemListByName = {};
                for (var i = 0; i < resultSet.ItemLists.length; ++i) {
                    var itemList = resultSet.ItemLists[i];
                    itemListByName[itemList.Name] = itemList;
                }

                // loop at all dimensions and set link to item list
                for (i = 0; i < resultSet.Grids.length; ++i) {
                    var grid = resultSet.Grids[i];
                    for (var j = 0; j < grid.Axes.length; ++j) {
                        var axis = grid.Axes[j];
                        for (var k = 0; k < axis.Dimensions.length; ++k) {
                            var dimension = axis.Dimensions[k];
                            dimension.ItemList = itemListByName[dimension.ItemListName];
                        }
                    }
                }

            }

        };

        // =======================================================================
        // tree
        // =======================================================================

        var Tree = function() {
            this.init.apply(this, arguments);
        };

        Tree.prototype = {

            init: function(options) {

                // create root tree element
                this.root = {
                    data: "root",
                    subTree: {}
                };

                // set key function
                if (options && options.keyFunction) {
                    this.keyFunction = options.keyFunction;
                } else {
                    this.keyFunction = function(obj) {
                        return obj;
                    };
                }
            },

            insert: function(path) {
                var parent = this.root;
                for (var i = 0; i < path.length; ++i) {
                    var pathElement = path[i];
                    var key = this.keyFunction(pathElement);
                    if (!parent.subTree.hasOwnProperty(key)) {
                        parent.subTree[key] = {
                            subTree: {},
                            data: pathElement
                        };
                    }
                    parent = parent.subTree[key];
                }
            },

            toString: function() {
                var stringStream = [];
                this.toStringHelper(this.root, [], stringStream);
                return stringStream.join("");
            },

            toStringHelper: function(tree, path, stringStream) {

                var pathElement = null;
                if (tree === this.root) {
                    pathElement = tree.data;
                } else {
                    pathElement = this.keyFunction(tree.data);
                }
                path.push(pathElement);


                var hasChildren = false;
                for (var child in tree.subTree) {
                    if (tree.subTree.hasOwnProperty(child)) {
                        hasChildren = true;
                        var subTree = tree.subTree[child];
                        var pathCopy = path.slice(0);
                        this.toStringHelper(subTree, pathCopy, stringStream);
                    }
                }

                if (!hasChildren) {
                    stringStream.push(path.toString() + "\n");
                }
            }
        };

        // =========================================================================
        // class group bar chart query
        // =========================================================================
        module.GroupBarChartQuery.prototype = $.extend({}, module.ChartQuery.prototype, {

            /**
             * A query that yields results suitable for a grouped bar chart control.
             * @constructs sap.bc.ina.api.sina.impl.inav2.sina_impl.GroupBarChartQuery
             *  @augments {sap.bc.ina.api.sina.impl.inav2.sina_impl.ChartQuery}
             *  @private
             */
            init: function(properties) {
                properties = properties || {};
                module.ChartQuery.prototype.init.apply(this, [properties]);
                this.resultSetClass = module.GroupBarChartResultSet;
            }
        });

        // =========================================================================
        // class goruped bar chart result set
        // =========================================================================
        module.GroupBarChartResultSet.prototype = {

            /**
             * A result set that yields elements suitable for a grouped bar chart.
             * @since SAP HANA SPS 06
             * @constructs sap.bc.ina.api.sina.impl.inav2.sina_impl.GroupBarChartResultSet
             * @private
             */
            init: function(properties) {
                properties = properties || {};
                this.elements = [];
            },

            setJsonData: function(data) {
                var self = this;
                this.elements = [];
                var resultSetParser = new ResultSetParser({
                    resultSet: data
                });
                var tree = resultSetParser.parse();

                function parseSubTree(subTree, parentElem) {
                    for (var itemName in subTree) {
                        var item = subTree[itemName];
                        var elem = {
                            label: item.data.NamedValues[0].ValueFormatted,
                            value: []
                        };
                        if (item.data.cell) {
                            elem.value = {
                                value: item.data.cell.ValueFormatted,
                                valueRaw: item.data.cell.Value
                            };
                        }
                        if (parentElem) {
                            parentElem.value.push(elem);
                        } else {
                            self.elements.push(elem);
                        }
                        if (item.subTree) {
                            parseSubTree(item.subTree, elem);
                        }
                    }
                }
                parseSubTree(tree.root.subTree);

            },

            /**
             * Returns the elements of the result set.
             * @memberOf sap.bc.ina.api.sina.impl.inav2.sina_impl.GroupBarChartResultSet
             * @instance
             * @since SAP HANA SPS 06
             * @return {Array} A list of result set elements.
             * @example
             * var query = sap.bc.ina.api.sina.createGroupBarChartQuery();
             * query.dataSource({ schemaName : "SYSTEM",
             *                    objectName : "J_EPM_PRODUCT"
             * });
             * query.addDimension('CURRENCY_CODE');
             * query.addDimension('CATEGORY');
             * query.count('PRODUCT_ID');
             * var resultSet = query.getResultSetSync();
             * var elements = resultSet.getELements();
             * // contents of elements:
             * [
                {
                  "label": "EUR",
                  "value": [
                    {
                      "label": "Notebooks",
                      "value": [
                        {
                          "label": "COUNT",
                          "value": {
                            "value": "6",
                            "valueRaw": 6
                          }
                        }
                      ]
                    },
                    {
                      "label": "Others",
                      "value": [
                        {
                          "label": "COUNT",
                          "value": {
                            "value": "5",
                            "valueRaw": 5
                          }
                        }
                      ]
                    },
                    {
                      "label": "Software",
                      "value": [
                        {
                          "label": "COUNT",
                          "value": {
                            "value": "3",
                            "valueRaw": 3
                          }
                        }
                      ]
                    }
                  ]
                }
                ]
             */
            getElements: function() {
                return this.elements;
            }
        };

        // =========================================================================
        // class line chart query
        // =========================================================================
        module.LineChartQuery.prototype = $.extend({}, module.ChartQuery.prototype, {

            /**
             * A query that yields results suitable for a line chart control.
             * @constructs sap.bc.ina.api.sina.impl.inav2.sina_impl.LineChartQuery
             *  @augments {sap.bc.ina.api.sina.impl.inav2.sina_impl.ChartQuery}
             *  @private
             */
            init: function(properties) {
                properties = properties || {};
                module.ChartQuery.prototype.init.apply(this, [properties]);
                this.resultSetClass = module.LineChartResultSet;
            }
        });

        // =========================================================================
        // class line chart result set
        // =========================================================================
        module.LineChartResultSet.prototype = $.extend({}, module.GroupBarChartResultSet.prototype, {

            /**
             * A result set that yields elements suitable for a line chart.
             * @since SAP HANA SPS 06
             * @constructs sap.bc.ina.api.sina.impl.inav2.sina_impl.LineChartResultSet
             * @augments {sap.bc.ina.api.sina.impl.inav2.sina_impl.GroupBarChartResultSet}
             * @private
             */
            init: function(properties) {
                properties = properties || {};
                this.elements = [];
            },

            setJsonData: function(data) {
                var self = this;
                this.elements = [];
                var resultSetParser = new ResultSetParser({
                    resultSet: data
                });
                var tree = resultSetParser.parse();

                //create line chart result format
                function parseSubTree(subTree, parentElem) {
                    for (var dimensionLineItemName in subTree) {
                        var dimensionLineItem = subTree[dimensionLineItemName];
                        var elem = {
                            label: dimensionLineItem.data.NamedValues[0].ValueFormatted,
                            value: []
                        };
                        for (var dimensionXItemName in dimensionLineItem.subTree) {
                            var dimensionXItem = dimensionLineItem.subTree[dimensionXItemName];
                            var point = {
                                x: dimensionXItem.data.NamedValues[0].ValueFormatted
                            };
                            for (var measureYItemName in dimensionXItem.subTree) {
                                var measureYItem = dimensionXItem.subTree[measureYItemName];
                                point.y = measureYItem.data.cell.Value;
                            }
                            elem.value.push(point);
                        }
                        self.elements.push(elem);
                    }
                }
                parseSubTree(tree.root.subTree);
            },

            /**
             * Returns the elements of the result set.
             * @memberOf sap.bc.ina.api.sina.impl.inav2.sina_impl.LineChartResultSet
             * @instance
             * @since SAP HANA SPS 06
             * @return {Array} A list of result set elements.
             * @example
             * var queryProperties = {
             *     dataSource      : { schemaName  : "SYSTEM",
                                       objectName  : "J_EPM_PRODUCT"
                                     },
                   dimensionX      : {name: 'CATEGORY'},
                   dimensionLine   : {name: 'CURRENCY_CODE'},
                   measureY        : {name: 'PRODUCT_ID', aggregationFunction: 'COUNT'}
               };
               query = sap.bc.ina.api.sina.createLineChartQuery(queryProperties);
             * var resultSet = query.getResultSetSync();
             * var elements = resultSet.getEements();
             * // contents of elements (shortened):
             * [
                  {
                    "label": "EUR",
                    "value": [
                      {
                        "x": "Notebooks",
                        "y": 6
                      },
                      {
                        "x": "Others",
                        "y": 5
                      },
                      {
                        "x": "Software",
                        "y": 3
                      },
                      {
                        "x": "Speakers",
                        "y": 3
                      },
                      {
                        "x": "Electronics",
                        "y": 2
                      },
                      {
                        "x": "Flat screens",
                        "y": 2
                      },
                      {
                        "x": "Laser printers",
                        "y": 2
                      },
                      {
                        "x": "Mice",
                        "y": 2
                      },
                      {
                        "x": "PC",
                        "y": 2
                      },
                      {
                        "x": "Workstation ensemble",
                        "y": 2
                      }
                    ]
                  },
                  {
                    "label": "USD",
                    "value": [
                      {
                        "x": "Others",
                        "y": 4
                      },
                      {
                        "x": "Flat screens",
                        "y": 2
                      },
                      {
                        "x": "Handhelds",
                        "y": 2
                      },
                      {
                        "x": "High Tech",
                        "y": 2
                      },
                      {
                        "x": "Notebooks",
                        "y": 2
                      },
                      {
                        "x": "Software",
                        "y": 2
                      },
                      {
                        "x": "Electronics",
                        "y": 1
                      },
                      {
                        "x": "Graphic cards",
                        "y": 1
                      },
                      {
                        "x": "Handheld",
                        "y": 1
                      },
                      {
                        "x": "Headset",
                        "y": 1
                      }
                    ]
                  }
               ]
             */
            getElements: function() {
                return this.elements;
            }
        });

        // =========================================================================
        // class search query
        // =========================================================================
        module.SearchQuery.prototype = $.extend({}, sinabase.SearchQuery.prototype, module.Query.prototype, {

            /**
             * A query that yields results suitable for a simple result list.
             * @constructs sap.bc.ina.api.sina.impl.inav2.sina_impl.SearchQuery
             * @augments {sap.bc.ina.api.sina.sinabase.SearchQuery}
             * @augments {sap.bc.ina.api.sina.impl.inav2.sina_impl.Query}
             * @private
             */
            init: function(properties) {
                properties = properties || {};
                module.Query.prototype.init.apply(this, [properties]);
                sinabase.SearchQuery.prototype.init.apply(this, [properties]);
                this.sqlSearch = (properties.sqlSearch === undefined || properties.sqlSearch === true) ? true : false;
                this.attributes = properties.attributes || [];
                properties.orderBy = properties.orderBy || {};
                this.setOrderBy(properties.orderBy);
                this.resultSetClass = module.SearchResultSet;
            },

            /**
             * Adds a response attribute to the search query. The content of this
             * attribute is returned if the search term was found in one of the
             * response attributes.
             * @memberOf sap.bc.ina.api.sina.impl.inav2.sina_impl.SearchQuery
             * @instance
             * @param {String|Object} attribute If the argument is a string, it is
             * the name of an attribute of the database view. If it is an object, it can contain
             * the name of the attribute and additional server-side
             * functions, like snippet or highlighting.
             * See {@link sap.bc.ina.api.sina.sinabase.Sina#createSearchQuery} for examples.
             */
            addResponseAttribute: function(attribute) {
                this.attributes.push(attribute);
                this._resetResultSet();
                return this;
            },

            createJsonRequest: function() {
                var self = this;
                jsontemplates.searchRequest.DataSource = this.filter.dataSource.toInAJson();
                if (this.system instanceof global.sap.bc.ina.api.sina.impl.inav2.system.HANASystem) {
                    if (this.attributes.length === 0) {
                        throw {
                            message: "Add at least one response attribute to your query"
                        };
                    }
                    if (this.sqlSearch === true) {
                        // TODO: remove workaround for SPS6. See CSS 0001971234 2013
                        jsontemplates.searchRequest.Options = ["SqlSearch"];
                    }
                }
                var selectedValues = [];
                for (var i = 0; i < this.attributes.length; ++i) {
                    var attribute = this.attributes[i];
                    if ($.type(attribute) === 'string') {
                        selectedValues.push({
                            Name: attribute,
                            AttributeName: attribute
                        });
                    } else if ($.type(attribute) === 'object') {
                        var selectedValue = {
                            Name: attribute.name || attribute.attributeName,
                            AttributeName: attribute.attributeName || attribute.name
                        };
                        if (attribute.highlighted === true) {
                            selectedValue.Function = 'Highlighted';
                        }
                        if (attribute.snippet === true) {
                            selectedValue.Function = 'Snippet';
                        }
                        if (attribute.startPosition !== undefined) {
                            selectedValue.StartPosition = attribute.startPosition;
                        }
                        if (attribute.maxLength !== undefined) {
                            selectedValue.MaxLength = attribute.maxLength;
                        }
                        selectedValues.push(selectedValue);
                    }
                }
                jsontemplates.searchRequest.Search.SelectedValues = selectedValues;
                var searchterms = this.filter.getSearchTerms();
                if (!searchterms) {
                    searchterms = '*';
                }
                jsontemplates.searchRequest.SearchTerms = searchterms;
                jsontemplates.searchRequest.Search.Top = this._top;
                jsontemplates.searchRequest.Search.Skip = this._skip;
                jsontemplates.searchRequest.Search.Filter = this.filter.getJson();
                jsontemplates.searchRequest.Search.OrderBy = this._assembleOrderBy();

                return jsontemplates.searchRequest;
            },

            /**
             * Sets how the result will be ordered.
             * @memberOf sap.bc.ina.api.sina.impl.inav2.sina_impl.SearchQuery
             * @instance
             * @param {Object|Array} orderBy If orderBy is an object, it must have the
             * properties 'orderBy' (string) and 'sortOrder' (string).
             * The orderBy property can either be the name of a database attribute that
             * the result will be sorted alphabetically for, or it can be the special
             * '$$score$$' string. The result will then be ordered according to the SAP HANA
             * Score function.
             * This function can also receive an array of these objects for multiple
             * order-by values, for example to order by $$score$$ and then alphabetically
             * for an attribute. The result will then be ordered after the first entry.
             * If two results have the same rank however, they will be ordered after the
             * second order-by value, and so on.
             * @default {orderBy:'$$score$$', sortOrder:'DESC'}
             * See {@link sap.bc.ina.api.sina.sinabase.Sina#createSearchQuery} for examples.
             */
            setOrderBy: function(orderBy) {
                this._resetResultSet();
                this.orderBy = orderBy || {
                    orderBy: '$$score$$',
                    sortOrder: 'DESC'
                };
            }

        });

        // =========================================================================
        // class result set
        // =========================================================================
        module.SearchResultSet.prototype = {

            /**
             * A result set suitable for a simple result list. An instance of this
             * class will be returned by {@link sap.bc.ina.api.sina.impl.inav2.sina_impl.SearchQuery#getResultSet}
             * @constructs sap.bc.ina.api.sina.impl.inav2.SearchResultSet
             * @private
             */
            init: function(properties) {
                properties = properties || {};
                this.elements = [];
                this.totalcount = 0;
            },

            toString: function(rs) {
                var elements = this.elements;
                var elements2 = [];
                var i;
                for (i = 0; i < elements.length; ++i) {
                    var element = elements[i];
                    var element2 = {};
                    for (var attrName in element) {
                        if (attrName.slice(0, 2) === '$$' || attrName.slice(0, 1) === '_') {
                            continue;
                        }
                        var attrValue = element[attrName];
                        if (!attrValue.label || !attrValue.value) {
                            continue;
                        }
                        var attribute = {
                            label: attrValue.label,
                            value: attrValue.value
                        };
                        element2[attrName] = attribute;
                    }
                    elements2.push(element2);
                }
                return JSON.stringify(elements2);
            },

            setJsonData: function(data) {
                this.elements = [];

                function ResultElementRenderingTemplateSpecification() {
                    this.type = "";
                    this.platform = "";
                    this.technology = "";
                    this.width = "";
                    this.height = "";
                    this.variant = "";
                    // this.description = "";
                    this.uri = "";
                    // this.request = null;
                    // this.encodedJSON = "";
                }

                ResultElementRenderingTemplateSpecification.prototype = {

                    _fromInaJson: function(inaJson) {
                        this.type = inaJson.Type || "";
                        this.platform = inaJson.Platform || "";
                        this.technology = inaJson.Technology || "";
                        this.width = inaJson.Width || "";
                        this.height = inaJson.Height || "";
                        this.variant = inaJson.Variant || "";
                        // this.description = inaJson.Description || "";
                        this.uri = inaJson.Uri || "";
                    }

                };

                function ResultElementRelatedAction() {
                    this.type = "";
                    this.description = "";
                    this.uri = "";
                    this.request = null;
                    this.encodedJSON = "";
                }

                ResultElementRelatedAction.prototype = {

                    _fromInaJson: function(inaJson) {
                        var self = this;
                        self.description = inaJson.Description;
                        self.uri = inaJson.Uri;

                        switch (inaJson.Type) {
                            case "RelatedRequest":
                                self.type = 'Search';
                                var queryProps = {};
                                queryProps.dataSource = new filter.DataSource();
                                queryProps.dataSource.fromInAJson(inaJson.Request.DataSource);
                                queryProps.system = global.sap.bc.ina.api.sina.sinaSystem();
                                queryProps.top = 1;
                                self.request = new module.SearchQuery(queryProps);
                                self.request.filter.setJson(inaJson.Request.Filter);
                                // mark request without filter condition as invalid
                                if (inaJson.Request.Filter.Selection === undefined) {
                                    self.request.invalid = true;
                                    self.request.invalidMessage = "Related request '" + self.description + "' is invalid because of missing filter conditions.";
                                }
                                break;
                            case "GeneralUri":
                                self.type = 'Link';
                                self.url = self.uri;
                                break;
                            case "SAPNavigation":
                                self.type = 'Navigation';
                                self.url = self.uri;
                                break;
                        }
                        self.encodedJSON = encodeURIComponent(self);
                    }
                };

                function ResultElementAttributeMetaData(resultElementAttribute) {
                    this.resultElementAttribute = resultElementAttribute;
                    this.correspondingSearchAttributeName = "";
                    this.description = "";
                    this.isTitle = false;
                    this.presentationUsage = [];
                    this.displayOrder = null;
                }

                ResultElementAttributeMetaData.prototype = {

                    _fromInaJson: function(inaAttributeMetaData) {
                        var self = this;
                        self.correspondingSearchAttributeName = inaAttributeMetaData.correspondingSearchAttributeName || "";
                        self.description = inaAttributeMetaData.Description || "";
                        self.presentationUsage = inaAttributeMetaData.presentationUsage || [];
                        if (inaAttributeMetaData.IsTitle !== undefined) {
                            self.isTitle = inaAttributeMetaData.IsTitle;
                        }
                        if (self.isTitle) {
                            if (!self.resultElementAttribute.resultElement.title) {
                                self.resultElementAttribute.resultElement.title = self.resultElementAttribute.resultElement.$$DataSourceMetaData$$.getLabel() + ":";
                            }
                            self.resultElementAttribute.resultElement._registerPostProcessor(function() {
                                self.resultElementAttribute.resultElement.title = self.resultElementAttribute.resultElement.title + " " + self.resultElementAttribute.value;
                            });
                        }
                    }

                };

                function ResultElementAttribute(resultElement) {
                    this.resultElement = resultElement;
                    this.$$MetaData$$ = new ResultElementAttributeMetaData(this);
                    this.label = "";
                    this.labelRaw = "";
                    this.value = "";
                    this.valueRaw = "";
                }

                ResultElementAttribute.prototype = {

                    _fromInaJson: function(inaAttribute) {
                        var self = this;
                        self.labelRaw = this.$$MetaData$$.correspondingSearchAttributeName || inaAttribute.Name || "";
                        self.label = this.$$MetaData$$.description || inaAttribute.Name || "";
                        self.valueRaw = inaAttribute.Value || null;
                        self.value = inaAttribute.ValueFormatted || null;

                    },

                    toString: function() {
                        //stay compatible with result templates <= SAP HANA SPS 05
                        return this.value;
                    }
                };

                function ResultElement() {
                    //these members are always provided:
                    this.title = "";
                    this.$$DataSourceMetaData$$ = {};
                    this.$$RelatedActions$$ = {};
                    this.$$RenderingTemplateSpecification$$ = {};
                    this.$$WhyFound$$ = [];
                    this.$$PostProcessors$$ = [];
                    //the real result item attributes will be added to
                    //this object dynamically
                }

                ResultElement.prototype = {

                    _fromInaJson: function(namedValues) {
                        var self = this;
                        for (var k = 0; k < namedValues.length; ++k) {
                            var namedValue = namedValues[k];
                            switch (namedValue.Name) {
                                case "$$DataSourceMetaData$$":
                                    var dataSourceMetaData = namedValue.Value[0];
                                    var dataSource = new filter.DataSource(dataSourceMetaData);
                                    self.$$DataSourceMetaData$$ = dataSource;
                                    break;
                                case "$$AttributeMetadata$$":
                                    for (var m = 0; m < namedValue.Value.length; ++m) {
                                        var inaAttributeMetaData = namedValue.Value[m];
                                        if (!self[inaAttributeMetaData.Name]) {
                                            self[inaAttributeMetaData.Name] = new ResultElementAttribute(self);
                                        }
                                        self[inaAttributeMetaData.Name].$$MetaData$$._fromInaJson(inaAttributeMetaData);
                                        self[inaAttributeMetaData.Name].$$MetaData$$.displayOrder = m;
                                    }

                                    break;
                                case "$$ResultItemAttributes$$":
                                    for (var l = 0; l < namedValue.Value.length; ++l) {
                                        var inaAttribute = namedValue.Value[l];
                                        if (!self[inaAttribute.Name]) {
                                            self[inaAttribute.Name] = new ResultElementAttribute(self);
                                        }
                                        self[inaAttribute.Name]._fromInaJson(inaAttribute);
                                    }
                                    break;
                                case "$$RelatedActions$$":
                                    var actions = {};
                                    for (var n = 0; n < namedValue.Value.length; ++n) {
                                        var action = namedValue.Value[n];
                                        var sinaAction = new ResultElementRelatedAction();
                                        sinaAction._fromInaJson(action);
                                        actions[action.ID] = sinaAction;
                                    }
                                    self.$$RelatedActions$$ = actions;
                                    break;
                                case "$$RenderingTemplateSpecification$$":
                                    for (var o = 0; o < namedValue.Value.length; ++o) {
                                        var template = new ResultElementRenderingTemplateSpecification();
                                        template._fromInaJson(namedValue.Value[o]);
                                        // template = propertiesToLowerCase(template);
                                        if (template.type === "ItemDetails") {
                                            self._detailTemplate = template; //save for later, so no 2nd request is needed
                                        } else {
                                            self.$$RenderingTemplateSpecification$$ = template;
                                        }
                                    }
                                    break;
                                case "$$WhyFound$$":
                                    for (var z = 0; z < namedValue.Value.length; ++z) {
                                        var whyfoundElem = {};
                                        whyfoundElem.label = namedValue.Value[z].Description;
                                        whyfoundElem.labelRaw = namedValue.Value[z].Name;
                                        whyfoundElem.value = namedValue.Value[z].Value;
                                        whyfoundElem.valueHighlighted = whyfoundElem.value;
                                        whyfoundElem.valueRaw = namedValue.Value[z].Value;
                                        self.$$WhyFound$$.push(whyfoundElem);
                                    }
                                    break;
                                default:
                                    // we assume thats a (HANA InA) result element:
                                    self[namedValue.Name] = new ResultElementAttribute();
                                    self[namedValue.Name].label = namedValue.Name || "";
                                    self[namedValue.Name].valueRaw = namedValue.Value || namedValue.ValueFormatted || null;
                                    self[namedValue.Name].value = namedValue.ValueFormatted || namedValue.Value || null;
                            }
                        }
                        for (var i = 0; i < this.$$PostProcessors$$.length; i++) {
                            this.$$PostProcessors$$[i]();
                        }
                    },

                    _registerPostProcessor: function(fn) {
                        this.$$PostProcessors$$.push(fn);
                    }


                };

                function _prepareDetails(element) {
                    // TODO: remove service workaround: if there is no detail query -> try to create
                    if (element._detailTemplate && !element.$$RelatedActions$$.$$DETAILS$$) {
                        element.$$RelatedActions$$.$$DETAILS$$ = {
                            request: new module.SearchQuery(),
                            description: '',
                            encodedJSON: '',
                            type: 'Search',
                            uri: ''
                        };
                    }
                    // End of workaround
                    // prefill result set of detail query
                    if (element._detailTemplate && element.$$RelatedActions$$.$$DETAILS$$) {
                        var detailResultSet = new module.SearchResultSet();
                        detailResultSet.elements[0] = $.extend(true, {}, element);
                        detailResultSet.elements[0].$$RenderingTemplateSpecification$$ = element._detailTemplate;
                        detailResultSet.totalcount = 1;
                        delete detailResultSet.elements[0].$$RelatedActions$$.$$DETAILS$$;
                        element.$$RelatedActions$$.$$DETAILS$$.request.resultSet = detailResultSet;
                        return detailResultSet.elements[0];
                    }
                    // return function(onSuccess,onError){
                    //     if(this._detailResultSet){
                    //         if(onSuccess){
                    //             onSuccess(this._detailResultSet);
                    //         }
                    //     }
                    //     else{
                    //         this.$$RelatedActions$$.$$DETAILS$$.request.getResultSet(onSuccess,onError);
                    //     }
                    // };
                    return {};
                }

                var itemLists = {};
                if (!data.ItemLists) {
                    return {};
                }
                for (var i = 0; i < data.ItemLists.length; i++) {
                    itemLists[data.ItemLists[i].Name] = data.ItemLists[i];
                    if (data.ItemLists[i].Name.toLowerCase() === "searchresult") {
                        this.totalcount = data.ItemLists[i].TotalCount.Value;
                    }
                }

                var axis0;
                if (data && data.Grids && data.Grids[0] && data.Grids[0].Axes && data.Grids[0].Axes[0]) {
                    axis0 = data.Grids[0].Axes[0];
                } else {
                    return {};
                }
                // only axes 0 is relevant for abap search results
                for (var j = 0; j < axis0.Tuples.length; j++) {
                    var tuple = axis0.Tuples[j];
                    if (tuple === undefined) {
                        continue;
                    }
                    var element = new ResultElement();
                    for (var c = tuple.length - 1; c >= 0; c--) {
                        // for (var c = 0; c < tuple.length; c++) {
                        var dimension = axis0.Dimensions[c];
                        var tupleValueForDimension = tuple[c];
                        var itemlist = itemLists[dimension.ItemListName];
                        var namedValues = itemlist.Items[tupleValueForDimension].NamedValues;
                        element._fromInaJson(namedValues);
                    }

                    if (axis0 && axis0.Dimensions[1]) {
                        var dimensionMetaData = axis0.Dimensions[1];
                        var itemlistMetaData = itemLists[dimensionMetaData.ItemListName];
                        var pointer2MyMetaData = tuple[1];
                        if (itemlistMetaData && itemlistMetaData.Items && itemlistMetaData.Items[pointer2MyMetaData]) {
                            var namedValuesAttributeMetadata = itemlistMetaData.Items[pointer2MyMetaData].NamedValues[2];
                            if (namedValuesAttributeMetadata) {
                                element = this._postProcess4WhyFound(element, namedValuesAttributeMetadata.Value);
                            }
                        }
                    }

                    var detail = _prepareDetails(element);
                    this._postProcessRelatedAction(element);
                    if (detail) {
                        this._postProcessRelatedAction(detail);
                    }
                    this.elements.push(element);
                }
                return {};
            },

            /**
             * Returns the elements of the result set.
             * @memberOf sap.bc.ina.api.sina.impl.inav2.sina_impl.SearchResultSet
             * @instance
             * @since SAP HANA SPS 06
             * @return {Array} A list of result set elements.
             * @example
             * var query = sap.bc.ina.api.sina.createSearchQuery({
                dataSource          : { schemaName  : "SYSTEM",
                                        objectName  : "J_EPM_PRODUCT" },
                attributes          : [ "PRODUCT_ID",
                                        "TEXT",
                                        "CATEGORY",
                                        "PRICE",
                                        "CURRENCY_CODE"],
                searchTerms         : "basic",
                top                 : 5
               });
             * var resultSet = query.getResultSetSync();
             * var elements = resultSet.getElements();
             * // contents of elements (shortened):
             * [{ "PRODUCT_ID":{"label":"PRODUCT_ID","valueRaw":"HT-1000","value":"HT-1000"},
             *     "TEXT":{"label":"TEXT","valueRaw":"Notebook Basic 15 with 1,7GHz - 15","value":"Notebook Basic 15 with 1,7GHz - 15"},
             *     "CATEGORY":{"label":"CATEGORY","valueRaw":"Notebooks","value":"Notebooks"},
             *     "PRICE":{"label":"PRICE","valueRaw":"956.00","value":"956.00"},
             *     "CURRENCY_CODE":{"label":"CURRENCY_CODE","valueRaw":"EUR","value":"EUR"}},
             *     // second result item:
             *     {"PRODUCT_ID":{"label":"PRODUCT_ID","valueRaw":"HT-1001","value":"HT-1001"},
             *     "TEXT":{"label":"TEXT","valueRaw":"Notebook Basic 17 with 1,7GHz - 17","value":"Notebook Basic 17 with 1,7GHz - 17"},
             *     "CATEGORY":{"label":"CATEGORY","valueRaw":"Notebooks","value":"Notebooks"},
             *     "PRICE":{"label":"PRICE","valueRaw":"1249.00","value":"1249.00"},
             *     "CURRENCY_CODE":{"label":"CURRENCY_CODE","valueRaw":"EUR","value":"EUR"}},
             *     // third result item:
             *     {"PRODUCT_ID":{"label":"PRODUCT_ID","valueRaw":"HT-1002","value":"HT-1002"},
             *     "TEXT":{"label":"TEXT","valueRaw":"Notebook Basic 18 with 1,7GHz - 18","value":"Notebook Basic 18 with 1,7GHz - 18"},
             *     "CATEGORY":{"label":"CATEGORY","valueRaw":"Notebooks","value":"Notebooks"},
             *     "PRICE":{"label":"PRICE","valueRaw":"1570.00","value":"1570.00"},
             *     "CURRENCY_CODE":{"label":"CURRENCY_CODE","valueRaw":"USD","value":"USD"}},
             *     // fourth result item:
             *     {"PRODUCT_ID":{"label":"PRODUCT_ID","valueRaw":"HT-1003","value":"HT-1003"},
             *     "TEXT":{"label":"TEXT","valueRaw":"Notebook Basic 19 with 1,7GHz - 19","value":"Notebook Basic 19 with 1,7GHz - 19"},
             *     "CATEGORY":{"label":"CATEGORY","valueRaw":"Notebooks","value":"Notebooks"},
             *     "PRICE":{"label":"PRICE","valueRaw":"1650.00","value":"1650.00"},
             *     "CURRENCY_CODE":{"label":"CURRENCY_CODE","valueRaw":"EUR","value":"EUR"}},
             *     // fifth result item:
             *     {"PRODUCT_ID":{"label":"PRODUCT_ID","valueRaw":"HT-8000","value":"HT-8000"},
             *     "TEXT":{"label":"TEXT","valueRaw":"1,5 Ghz, single core, 40 GB HDD, Windows Vista Home Basic, 512 MB RAM","value":"1,5 Ghz, single core, 40 GB HDD, Windows Vista Home Basic, 512 MB RAM"},
             *     "CATEGORY":{"label":"CATEGORY","valueRaw":"Notebooks","value":"Notebooks"},
             *     "PRICE":{"label":"PRICE","valueRaw":"799.00","value":"799.00"},
             *     "CURRENCY_CODE":{"label":"CURRENCY_CODE","valueRaw":"EUR","value":"EUR"}}
             *  ]
             */
            getElements: function() {
                return this.elements;
            },

            _postProcessRelatedAction: function(element) {
                if (!element.$$RelatedActions$$) {
                    return;
                }
                for (var relatedActionID in element.$$RelatedActions$$) {
                    var relatedAction = element.$$RelatedActions$$[relatedActionID];
                    //Postprocessing
                    if (relatedAction.type === "Search") {
                        global.sap.bc.ina.api.sina._postprocess(relatedAction, element.title);
                    }
                }
            },

            _postProcess4WhyFound: function(element, metaAttributes) {
                if (element.$$WhyFound$$ && element.$$WhyFound$$.length > 0) {
                    var i = element.$$WhyFound$$.length;
                    var value;
                    var hasResponseAttribute;
                    while (i--) {
                        hasResponseAttribute = false;
                        if (element[element.$$WhyFound$$[i].labelRaw] !== undefined && metaAttributes !== undefined) {
                            ////                        value = element.$$WhyFound$$[i].value.replace(/<b>/g, '<div class="InA-highlighter" data-sap-widget="highlighter">').replace(/<\/b>/g, '</div">');
                            //                        value = element.$$WhyFound$$[i].value;
                            //                        element[element.$$WhyFound$$[i].labelRaw].value    = value;
                            //                        element[element.$$WhyFound$$[i].labelRaw].valueRaw = value;
                            //                        element.$$WhyFound$$.splice(i,1);
                            var j = metaAttributes.length;
                            while (j--) {
                                // The WhyFound attributes are requst attributes. Try to get its corresponding response attribute
                                if (metaAttributes[j].Name === element.$$WhyFound$$[i].labelRaw && metaAttributes[j].correspondingSearchAttributeName) {
                                    element.$$WhyFound$$[i].labelRaw = metaAttributes[j].correspondingSearchAttributeName;
                                    hasResponseAttribute = true;
                                }
                            }
                        }
                        //                    if (!hasResponseAttribute){
                        //                        element.$$WhyFound$$[i].label = element.$$WhyFound$$[i].label + " (modeling error: add missing corresponding response attribute!)";
                        //                    }
                    }
                }
                return element;
            }
        };
    };

    if (isXS) {
        executeSinaImpl($.sap.bc.ina.api.sina.sinaxsjq.jq);
    } else if (typeof define === "function" && define.amd && !global.sap.ushell) { // only concatenated sina is in ushell repo!
        define(["jquery", "./filter", "../../sinabase", "./system", "./proxy"], function($) {
            executeSinaImpl($);
        });
    } else {
        executeSinaImpl();
    }

}(typeof window === 'undefined' ? $ : window, typeof window === 'undefined'));

/*
 * @file Simple info access (SINA) API: System representation
 * @ignore
 * @namespace global.sap.bc.ina.api.sina.impl.inav2.system
 * @copyright Copyright (c) 2013 SAP AG. All rights reserved.
 */

(function(global, isXS) {

    "use strict";

    var executeSystem = function($) {

        // =========================================================================
        // create packages
        // =========================================================================
        if (!$) {
            $ = global.$;
        }
        if (!isXS) {
            global.sap.bc.ina.api.sina.expandPackage(global, 'sap.bc.ina.api.sina.impl.inav2.system');
            global.sap.bc.ina.api.sina.expandPackage(global, 'sap.bc.ina.api.sina.impl.inav2.proxy');
        }

        var module = global.sap.bc.ina.api.sina.impl.inav2.system;
        var proxy = global.sap.bc.ina.api.sina.impl.inav2.proxy;
        var system = global.sap.bc.ina.api.sina.system;
        var base = global.sap.bc.ina.api.sinabase;


        module.ABAPSystem = function() {
            this.init.apply(this, arguments);
        };
        module.HANASystem = function() {
            this.init.apply(this, arguments);
        };

        module.ABAPSystem.prototype = $.extend({}, system.System.prototype, {

            init: function(properties) {
                properties = properties || {};
                this.systemType = 'ABAP';
                this.inaUrl = properties.inaUrl || "/sap/es/ina/GetResponse";
                this.infoUrl = properties.infoUrl || "/sap/es/ina/GetServerInfo";
                properties.proxy = properties.proxy ||  new proxy.Proxy({
                    "xsrfService": this.infoUrl
                });
                system.System.prototype.init.apply(this, [properties]);
                this.config = global.sap.bc.inauitk.config;

                if (properties.sapclient) {
                    this.sapclient(properties.sapclient);
                } else {
                    var sapclient = this._readSapClientFromUrl();
                    this.sapclient(sapclient);
                }
                if (properties.saplanguage) {
                    this.saplanguage(properties.saplanguage);
                } else {
                    var saplanguage = this._getUrlParameter("sap-language");
                    this.saplanguage(saplanguage);
                }

            },

            setSinaUrlParameter: function(name, value) {
                value = value + ""; //convert to str
                if (name.toUpperCase() === "SAP-CLIENT" && value.length < 3) {
                    //add leading 0 to sap-client parameter
                    for (var i = 0; i < 2; i++) {
                        value = "0" + value;
                    }
                }

                function setForUrl(url) {
                    var currentValue = (new RegExp(name + '=' + '(.+?)(&|$)', 'i').exec(url) || [null])[1];
                    if (!currentValue) {
                        // there is no such parameter -> find the right position to add
                        if (url.indexOf("?") === -1) {
                            // url has no parameters at all -> first parameter
                            url += "?" + encodeURIComponent(name) + "=" + encodeURIComponent(value);
                        } else {
                            // therer are other url parameters -> append
                            url += "&" + encodeURIComponent(name) + "=" + encodeURIComponent(value);
                        }
                    } else {
                        // the parameter exists -> replace it
                        url = url.replace(name + "=" + currentValue, encodeURIComponent(name) + "=" + encodeURIComponent(value));
                    }
                    return url;
                }
                this.infoUrl = setForUrl(this.infoUrl);
                this.inaUrl = setForUrl(this.inaUrl);
            },

            _getUrlParameter: function(name) {
                var search = global.location.href;
                var value = (new RegExp(name + '=' + '(.+?)(&|$)', 'i').exec(search) || [null])[1];
                if (!value) {
                    return value;
                }
                value = decodeURIComponent(value.replace(/\+/g, " "));
                return value;
            },

            _readSapClientFromUrl: function() {
                // dont read sap client from url in fiori scenario where
                // frontend (ui) server is not the search server
                if (global.sap.bc.ina.api.sina.properties && global.sap.bc.ina.api.sina.properties.noSapClientFromUrl && global.sap.bc.ina.api.sina.properties.noSapClientFromUrl === true) {
                    return "";
                }
                return this._getUrlParameter("sap-client");
            },

            sapclient: function(sapclient) {
                if (sapclient) {
                    this._sapclient = sapclient;
                    this.setSinaUrlParameter("sap-client", this._sapclient);
                    this._deleteServerInfo();
                    // trigger another serverinfo call if sapclient changes since
                    // there could be another database type working in this client
                    this.getServerInfo();
                    return {};
                } else {
                    return this._sapclient;
                }
            },

            saplanguage: function(language) {
                if (language) {
                    this._saplanguage = language;
                    this.setSinaUrlParameter("sap-language", this._saplanguage);
                    return {};
                } else {
                    return this._saplanguage;
                }
            },

            setServerInfo: function(json) {
                this.properties = {};
                this.properties.rawServerInfo = json;

                if (this instanceof module.ABAPSystem) {
                    //TODO: move this code out of if(ABAP) when HANA INA Service supports these values
                    this.properties.dbms = json.ServerInfo.DataBaseManagementSystem;
                }

                for (var i = 0; i < json.Services.length; i++) {
                    this.services[json.Services[i].Service] = new system.Service(json.Services[i]);
                }
            }

        });

        module.HANASystem.prototype = $.extend({}, system.System.prototype, {

            init: function(properties) {
                properties = properties || {};
                this.systemType = 'HANA';
                this.infoUrl = properties.infoUrl || "/sap/bc/ina/service/v2/GetServerInfo";
                this.inaUrl = properties.inaUrl || "/sap/bc/ina/service/v2/GetResponse";
                properties.proxy = properties.proxy ||  new proxy.Proxy({
                    "xsrfService": this.infoUrl
                });
                system.System.prototype.init.apply(this, [properties]);
                this._setUpAjaxErrorHandler();
                // this.getServerInfo();
            },

            _setUpAjaxErrorHandler: function() {
                //global ajax setup for errors

                if (!isXS) {
                    $(global.document).ajaxError(function(event, jqXHR, ajaxSettings, thrownError) {
                        // log.debug("Error: call to "+ajaxSettings.url+" with argument "+ajaxSettings.data+" had status "+jqXHR.status+" ("+jqXHR.statusText+") - Response was: "+jqXHR.responseText); //log message for debugging

                        switch (jqXHR.status) {
                            case 401:
                                global.window.location = "/sap/hana/xs/formLogin/login.html?x-sap-origin-location=" +
                                    encodeURIComponent(global.window.location.pathname) +
                                    encodeURIComponent(global.window.location.search);
                                break;
                            case 404:
                                return;
                        }
                        // var message = '';
                        // if(jqXHR.status!==200){
                        //     message = 'Server responded with status code ' + jqXHR.status+'. ';
                        // }
                        // if(thrownError&&thrownError.message){
                        //     message += thrownError.message;
                        // }
                        // if(message){
                        //     log.error(message); //message to the user
                        // }
                    });
                }
            }
        });
    };

    if (isXS) {
        executeSystem($.sap.bc.ina.api.sina.sinaxsjq.jq);
    } else if (typeof define === "function" && define.amd && !global.sap.ushell) { // only concatenated sina is in ushell repo!
        define(["jquery", "../../system"], function($) {
            executeSystem($);
        });
    } else {
        executeSystem();
    }

}(typeof window === 'undefined' ? $ : window, typeof window === 'undefined'));


/*
 * @file Simple info access (SINA) API: Factory
 * @namespace sap.bc.ina.api.sina
 * @requires jQuery
 * @copyright Copyright (c) 2013 SAP AG. All rights reserved.
 */

if (typeof window === 'undefined') {
    $.import("sinaxsjq.xsjslib");

    $.import("filter.xsjslib");
    $.import("impl/inav2/filter.xsjslib");

    $.import("sinabase.xsjslib");

    $.import("impl/inav2/jsontemplates.xsjslib");

    $.import("proxy.xsjslib");
    $.import("impl/inav2/proxy.xsjslib");

    $.import("system.xsjslib");
    $.import("impl/inav2/system.xsjslib");

    $.import("impl/inav2/sina_impl.xsjslib");
}

(function(global, isXS) {

    "use strict";

    var executeSina = function($) {
        if (!$) {
            $ = global.$;
        }

        if (!isXS) {
            global.sap.bc.ina.api.sina.expandPackage(global, 'sap.bc.ina.api.sina');
        }

        var module = global.sap.bc.ina.api.sina;
        module.properties = module.properties || {};
        var api = global.sap.bc.ina.api;
        var inaV2Proxy = global.sap.bc.ina.api.sina.impl.inav2.proxy;
        // var config = proxy.config;
        var inaV2System = global.sap.bc.ina.api.sina.impl.inav2.system;
        var sinabase = global.sap.bc.ina.api.sina.sinabase;

        // =========================================================================
        // global fields
        // =========================================================================
        if (global.sap.bc.ina.api.sina.impl && global.sap.bc.ina.api.sina.impl.inav2 && global.sap.bc.ina.api.sina.impl.inav2.sina_impl && global.sap.bc.ina.api.sina.impl.inav2.sina_impl.IMPL_TYPE) {
            /**
             * SAP HANA info access HTTP service implementation of SINA.
             * @memberOf sap.bc.ina.api
             * @constant
             */
            api.SINA_TYPE_INAV2 = global.sap.bc.ina.api.sina.impl.inav2.sina_impl.IMPL_TYPE;
        }

        /**
         * Factory method for the SINA API. Optionally, you can choose a service implementation to be used.
         * @memberOf sap.bc.ina.api.sina
         * @param {Object} [properties]
         * @param {String} [properties.impl_type=sap.bc.ina.api.sina.impl.inav2.sina_impl.IMPL_TYPE] Define the service type to be used by the SINA API.
         * @return {sap.bc.ina.api.sina.sinabase.Sina} The instance of SINA. If no properties object was provided, it will return an instance
         * that uses the info access HTTP service (V2) on an SAP HANA system.
         * @since SAP HANA SPS 06
         * @public
         */
        global.sap.bc.ina.api.sina.getSina = function(properties) {
            properties = properties || {};
            properties.impl_type = properties.impl_type || api.SINA_TYPE_INAV2;
            if (properties.impl_type === api.SINA_TYPE_INAV2) {
                if (!properties.system) {
                    //create default proxy with settings from config.js
                    var sys;
                    // if (config) {
                    //     proxyProperties = {
                    //         httpMethod : config.httpMethod,
                    //         cachelifetime : config.cachelifetime,
                    //         demoMode : config.demoMode,
                    //         record : config.record
                    //     };
                    // }
                    var newProxy = new inaV2Proxy.Proxy(properties);
                    if (properties.systemType && properties.systemType.toUpperCase() === "ABAP") {
                        sys = new inaV2System.ABAPSystem({
                            'proxy': newProxy
                        });
                    } else {
                        sys = new inaV2System.HANASystem({
                            'proxy': newProxy
                        });
                    }
                    newProxy.setXSRFService(sys.infoUrl);
                    properties.system = sys;
                }
            }
            if (sinabase.provider[properties.impl_type] && sinabase.provider[properties.impl_type].sina) {
                var sina = new sinabase.provider[properties.impl_type].sina(properties);
                sina._provider = sinabase.provider[properties.impl_type];
                return sina;
            }
            return {};
        };

        if (!isXS) {
            module.properties.noDefaultSina = module.properties.noDefaultSina || false;
            if (module.properties.noDefaultSina !== undefined && !module.properties.noDefaultSina) {
                /**
                 * Default instantiation of SINA. After page load a SINA instance will be provided with default
                 * settings if there is not already a global SINA instance at sap.bc.ina.api.sina.
                 * If you need other settings, create your own SINA instance using the factory @link {sap.bc.ina.api.sina.getSina}
                 * You can turn off the default instatiation by setting a variable sap.bc.ina.api.properties.noDefaultSina to true
                 * BEFORE sina.js is loaded!
                 * @memberOf sap.bc.ina.api.sina
                 * @type {sap.bc.ina.api.sina.impl.inav2.Sina}
                 * @since SAP HANA SPS 06
                 */
                global.sap.bc.ina.api.sina = global.jQuery.extend({}, module, module.getSina(module.properties)); // without extend the new global sina instance would overwrite everything after sap.bc.ina.sina !!!
                return global.sap.bc.ina.api.sina;
            }
            return {};
        } else {

            global.sap.bc.ina.api.sinaxs = global.sap.bc.ina.api.sinaxs || module.getSina(module.properties);
            return global.sap.bc.ina.api.sinaxs;
        }

    };

    if (isXS) {
        executeSina($.sap.bc.ina.api.sina.sinaxsjq.jq);
    } else if (global.sap && global.sap.ushell) {
        executeSina(); // only concatenated sina is in ushell repo!
    } else if (typeof define === "function" && define.amd) {
        define(["require",
                "./filter",
                "./impl/inav2/sina_impl"
            ],
            function() {
                var sina = executeSina($);
                // sina.filter = global.sap.bc.ina.api.sina.impl.inav2.filter;
                // sina.systems = global.sap.bc.ina.api.sina.impl.inav2.system;
                return sina;
            });
    } else {
        executeSina();
    }

}(typeof window === 'undefined' ? $ : window, typeof window === 'undefined'));