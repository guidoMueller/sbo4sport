(function(global) {
    "use strict";

    var sap = global.sap;
    var console = global.console;

    // =======================================================================
    // helper class for highlight x
    // =======================================================================
    var Text = function() {
        this.init.apply(this, arguments);
    };

    Text.prototype = {

        init: function(text) {
            // store text
            this.text = text || "";
            // normalized text
            this.lower = this.text.toLocaleLowerCase();
            // global flag is there is any bold char
            this.globalBold = false;
            // create array which stores flag whether character is bold or not
            this.bold = new Array(this.text.length);
            for (var i = 0; i < this.bold.length; ++i) {
                this.bold[i] = false;
            }
        },

        highlight: function(term) {

            // prevent endless loop
            if (term === "" || this.lower === "") return;

            // normalize to lower case
            term = term.toLowerCase();

            // loop at all occurences of term in this.lower
            var index = -1;
            while (index < this.lower.length) {
                index = this.lower.indexOf(term, index);
                if (index >= 0) {
                    // mark bold characters in global array 
                    for (var i = index; i < index + term.length; ++i) {
                        this.bold[i] = true;
                        this.globalBold = true;
                    }
                    index += term.length;
                } else {
                    break;
                }
            }
        },

        render: function() {

            // short cut if there is nothing to do
            if (!this.globalBold) {
                return this.text;
            }

            // highlight this.text according to information in this.bold
            var bold = false;
            var result = [];
            var start = 0;
            for (var i = 0; i < this.text.length; ++i) {
                if (bold && !this.bold[i] || !bold && this.bold[i]) {
                    result.push(this.text.substring(start, i));
                    if (bold) {
                        // bold section ends
                        result.push("</b>");
                    } else {
                        // bold section starts
                        result.push("<b>");
                    }
                    bold = !bold;
                    start = i;
                }
            }

            // add last part
            result.push(this.text.substring(start, i));
            if (bold) {
                result.push("</b>");
            }
            return result.join("");
        }

    };

    // =======================================================================
    // search model
    // =======================================================================
    sap.ui.model.json.JSONModel.extend("sap.ushell.renderers.fiori2.search.SearchModel", {

        searchInit: function() {
            var self = this;
            self.sina = sap.ushell.Container.getService("Search").getSina();
            var properties = {
                templateFactsheet: true
            };

            self.suggestionid = 0;
            self.suggestionQuery = self.sina.createSuggestionQuery();

            //Searchconnector datasource for the 
            this.oUserRecentsService = sap.ushell.Container.getService("UserRecents");

            self.query = self.sina.createPerspectiveQuery(properties);

            self.searchRequestID = 0;

            self.setProperty('/dataSourceName', '');
            self.setProperty('/dataSourceLabelRaw', '');
            self.setProperty('/searchBoxTerm', '');
            self.setProperty('/headSelectedDataSource', {});
            self.setProperty('/facets', {});
            self.setProperty('/facets/dataSources', []);
            self.setProperty('/facets/attributes', []);
            self.setProperty('/results', []);
            self.setProperty('/detail', {});
            self.setProperty('/detail', {});
            self.setProperty('/detail/title', "");
            self.setProperty('/detail/titleUrl', "");
            self.setProperty('/detail/type', "");
            self.setProperty('/detail/data', {});
            self.setProperty('/count', 0);
            self.setProperty('/isResultAppended', false);
            self.setProperty('/attributeFacetFilterLists', []);
            self.resetDataSource(false);

            self.resetDataSources(false);
            self.resetAttributeFacets(false);
            self.resetFilterConditions(false);
            // self.setProperty("/suggestionTerm", "");
            // self.dsSuggestionQuery = self.sina.createSuggestionQuery();
            self.dsSuggestionQuery = self.sina.createPerspectiveQuery(properties);

            if (jQuery.device.is.phone) {
                this.appSuggestionLimit = 3;
                this.normalAppSuggestionLimit = 3;
                this.singleAppSuggestionLimit = 5;
                this.normalSuggestionLimit = 5;
                this.dataSourceSuggestionLimit = 5;

            } else {
                this.appSuggestionLimit = 3;
                this.normalAppSuggestionLimit = 3;
                this.singleAppSuggestionLimit = 7;
                this.normalSuggestionLimit = 7;
                this.dataSourceSuggestionLimit = 7;
            }


            //Set isNormalSearchEnable
            if (sap.ui.getCore().byId("mainShell").getViewData().config.searchBusinessObjects) {
                self.setProperty('/isNormalSearchEnable', sap.ui.getCore().byId("mainShell").getViewData().config.searchBusinessObjects !== "hidden");
            } else {
                self.setProperty('/isNormalSearchEnable', true);
            }


            //App Service
            self.setProperty("/tiles", []);

            //Connectors in Category
            var defaultConnector = [];
            if (self.isNormalSearchEnable()) {
                defaultConnector.push({
                    dataSourceLabel: sap.ushell.resources.i18n.getText("label_all"),
                    label: sap.ushell.resources.i18n.getText("label_all"),
                    labelRaw: "$$ALL$$"
                });
            }
            defaultConnector.push({
                dataSourceLabel: sap.ushell.resources.i18n.getText("label_apps"),
                label: sap.ushell.resources.i18n.getText("label_apps"),
                labelRaw: "$$APP$$"
            });
            self.setProperty("/connectors", defaultConnector);

            var handleConnectors = function(searchResults) {

                var items = [];

                items.push({
                    dataSourceLabel: sap.ushell.resources.i18n.getText("label_all"),
                    label: sap.ushell.resources.i18n.getText("label_all"),
                    labelRaw: "$$ALL$$"
                });
                items.push({
                    dataSourceLabel: sap.ushell.resources.i18n.getText("label_apps"),
                    label: sap.ushell.resources.i18n.getText("label_apps"),
                    labelRaw: "$$APP$$"
                });

                for (var i = 0; i < searchResults.length; i++) {
                    var searchItem = searchResults[i];

                    if (searchItem.DESCRIPTION && searchItem.OBJECT_NAME) {

                        var item;

                        if (searchItem.DESCRIPTION.value !== null) {
                            item = {
                                dataSourceLabel: self.getHighlightingForTerms(searchItem.DESCRIPTION.value, "*"),
                                label: searchItem.DESCRIPTION.value,
                                labelRaw: searchItem.OBJECT_NAME.value,
                            };
                        } else {
                            item = {
                                dataSourceLabel: self.getHighlightingForTerms(searchItem.DESCRIPTION.value, "*"),
                                label: searchItem.OBJECT_NAME.value,
                                labelRaw: searchItem.OBJECT_NAME.value,
                            };
                        }

                        if (item.label && item.labelRaw) {
                            items.push(item);
                        }
                    }

                }

                self.setProperty("/connectors", items);
            };

            if (self.isNormalSearchEnable()) {
                self.getConnectors(handleConnectors, function() {});
            };
        },



        isNormalSearchEnable: function() {
            return this.getProperty("/isNormalSearchEnable");
        },

        doSuggestion: function() {
            var self = this;

            if (self.suggestionTimeoutId) {
                global.clearTimeout(self.suggestionTimeoutId);
            }
            self.suggestionTimeoutId = global.setTimeout(function() {

                var suggestionTerm = self.getProperty("/searchBoxTerm");

                self.setProperty("/appSection", []);
                self.setProperty("/dataSourceSection", []);
                self.setProperty("/suggestSection", []);
                self.setProperty("/mixedSection", []);

                self.suggestionid = self.suggestionid + 1;
                // self.setProperty("/searchTerm", suggestionTerm);

                if (self.isNormalSearchEnable()) {
                    if ((suggestionTerm.length >= 3 || !self.isAllCategory()) && !self.isAppCategory()) {
                        self.doNormalSuggestions(suggestionTerm, self.suggestionid);
                    }

                    if (!self.isAppCategory()) {
                        self.appSuggestionLimit = self.normalAppSuggestionLimit;
                    } else {
                        self.appSuggestionLimit = self.singleAppSuggestionLimit;
                    }

                    if (self.isAllCategory() || self.isAppCategory()) {
                        self.doAppSuggestions(suggestionTerm, self.suggestionid);
                    }
                    
                    if(self.isAllCategory()){
                        self.doDataSourceSuggestions(suggestionTerm);
                    }
                } else {
                    self.appSuggestionLimit = self.singleAppSuggestionLimit;
                    self.doAppSuggestions(suggestionTerm, self.suggestionid);
                }

            }, 400);


        },

        isAllCategory: function() {
            var ds = this.getProperty("/dataSource");
            if ((ds && ds.objectName && ds.objectName.value && ds.objectName.value.toLowerCase() === "$$all$$") ||
                (ds && ds.objectName && ds.objectName.toLowerCase && ds.objectName.toLowerCase() === "$$all$$"))
                return true;
            return false;
        },

        isAppCategory: function() {
            var ds = this.getProperty("/dataSource");
            if (ds && ds.objectName && ds.objectName.value === "$$APP$$")
                return true;
            return false;
        },

        doAppSuggestions: function(suggestionTerm, suggestionid) {
            var self = this;
            var queryProperties = {
                searchTerm: suggestionTerm,
                top: self.appSuggestionLimit
            };
            var appQuery = sap.ushell.Container.getService("Search").queryApplications(queryProperties).done(function(resultset) {
                var aResult = resultset.getElements();
                var aUIResult = [];

                if (suggestionid !== self.suggestionid)
                    return;

                for (var i = 0; i < aResult.length; ++i) {
                    var appSuggest = aResult[i];
                    var item = {
                        pos: i,
                        label: appSuggest.title,
                        icon: appSuggest.icon,
                        targetURL: appSuggest.url,
                        labelRaw: "",
                        mixedLabel: appSuggest.title
                    };
                    aUIResult.push(item);
                }

                self.setProperty("/appSection", aUIResult);
//                var sItems = self.getProperty("/suggestSection");
//                var mixedItems = aUIResult.concat(sItems);
                
                // mixed items and mixed labels
                var appItems = self.getProperty("/appSection");
                var dsItems = self.getProperty("/dataSourceSection");
                var normalItems = self.getProperty("/suggestSection");
                var mixedItems = appItems.concat(dsItems).concat(normalItems);
                
                for (var j = 0; j < mixedItems.length; j++) {
                    var mixedItem = mixedItems[j];
                    if (self.isAllCategory() && mixedItem.dataSourceLabel) {
                        mixedItem.mixedLabel = mixedItem.label + " <i>in " + mixedItem.dataSourceLabel + "</i>";
                    } else {
                        mixedItem.mixedLabel = mixedItem.label;
                    }
                }
                self.setProperty("/mixedSection", mixedItems);
            });

        },

        doDataSourceSuggestions: function(suggestionTerm) {

            var self = this;

            // get ds suggestions
            self.suggestDataSources(suggestionTerm, 2);
        },


        suggestDataSources: function(searchTerm, limit) {

            var self = this;

            // prepare regexp for matching
            var searchTermHelper = searchTerm.replace(/([.+?^=!:${}()|\[\]\/\\])/g, "\\$1");
            searchTermHelper = searchTermHelper.replace(/\*/g, ".*");
            var searchTermRegExp = new RegExp('\\b' + searchTermHelper, 'i');

            var terms = self.tokenizeSuggestionTerm(searchTerm);
            
            var dataSources = self.getProperty("/connectors");
            if (dataSources) {
                // check all connectors for matching
                var dsSuggestions = [];
                for (var i = 0; i < dataSources.length; ++i) {
                    var dataSource = dataSources[i];
                    if (searchTermRegExp.test(dataSource.label) && dataSource.label.toLowerCase() !== 'all' && dataSource.label.toLowerCase() !== 'apps') {
                        var suggestion = {};
                        suggestion.label = '<i>' + sap.ushell.resources.i18n.getText("searchIn") + ': </i>' + self.getHighlightingForTerms(dataSource.label, terms);
                        suggestion.labelRaw = dataSource.labelRaw;
                        suggestion.mixedLabel = suggestion.label;
                        suggestion.suggestType = "dataSourceSuggest";
                        dsSuggestions.push(suggestion);
                        if (dsSuggestions.length === limit) {
                            break;
                        }
                    }
                }
                
                self.setProperty("/dataSourceSection", dsSuggestions);

                // mixed items and mixed labels
                var appItems = self.getProperty("/appSection");
                var dsItems = self.getProperty("/dataSourceSection");
                var normalItems = self.getProperty("/suggestSection");
                var mixedItems = appItems.concat(dsItems).concat(normalItems);
                
                self.setProperty("/mixedSection", mixedItems);
            }
        },
        
        getConnectors: function(onSuccess, onError) {
            var self = this;

            var system = self.sina.sinaSystem();

            system.getServerInfo().done(function() {

                var systemId;
                if (system && system.properties && system.properties.rawServerInfo && system.properties.rawServerInfo.ServerInfo)
                    systemId = system.properties.rawServerInfo.ServerInfo.SystemId;

                var sapclient = system.properties.rawServerInfo.ServerInfo.Client;
                self.searchConnector = systemId + sapclient + "~ESH_CONNECTOR~";

                var dsSuggestionDataSource = self.sina.createDataSource({
                    objectName: self.searchConnector,
                    packageName: "ABAP",
                    type: "Connector",
                    label: ""
                });
                self.dsSuggestionQuery.setDataSource(dsSuggestionDataSource);

                // self.dsSuggestionQuery.setSuggestionTerm(suggestionTerm);
                self.dsSuggestionQuery.setSearchTerms("*");
                self.dsSuggestionQuery.setTop(1000);
                self.dsSuggestionQuery.setOrderBy({
                    orderBy: 'DESCRIPTION',
                    sortOrder: 'ASC'
                });

                self.dsSuggestionQuery.getResultSet(jQuery.proxy(function(resultset) {

                        var elements = resultset.searchresultset.getElements();
                        onSuccess(elements);

                    }, this),

                    function(error) {
                        onError(error);
                    });


            });


        },

        getDataSourceSuggestions: function(suggestionTerm, onSuccess, onError) {
            var self = this;

            var system = self.sina.sinaSystem();

            // TO DO: delete duplicated getServerInfo()
            system.getServerInfo().done(function() {

                var systemId;
                if (system && system.properties && system.properties.rawServerInfo && system.properties.rawServerInfo.ServerInfo)
                    systemId = system.properties.rawServerInfo.ServerInfo.SystemId;

                var sapclient = system.properties.rawServerInfo.ServerInfo.Client;
                self.searchConnector = systemId + sapclient + "~ESH_CONNECTOR~";

                var dsSuggestionDataSource = self.sina.createDataSource({
                    objectName: self.searchConnector,
                    packageName: "ABAP",
                    type: "Connector",
                    label: ""
                });
                self.dsSuggestionQuery.setDataSource(dsSuggestionDataSource);

                // self.dsSuggestionQuery.setSuggestionTerm(suggestionTerm);
                self.dsSuggestionQuery.setSearchTerms(suggestionTerm);
                self.dsSuggestionQuery.setTop(1000);
                self.dsSuggestionQuery.setOrderBy({
                    orderBy: 'DESCRIPTION',
                    sortOrder: 'ASC'
                });

                self.dsSuggestionQuery.getResultSet(jQuery.proxy(function(resultset) {

                        var elements = resultset.searchresultset.getElements();
                        onSuccess(elements);

                    }, this),
                    function(error) {
                        onError(error);
                    });


            });


        },

        doNormalSuggestions: function(suggestionTerm, suggestionid) {

            var self = this;
            self.suggestionQuery.setSuggestionTerm(suggestionTerm);

            self.suggestionQuery.setDataSource(self.getProperty("/dataSource"));

            // self.suggestionQuery.dataSource(self.getDataSource());
            self.suggestionQuery.getResultSet(function(resultset) {

                if (suggestionid !== self.suggestionid)
                    return;

                var suggestions = resultset.getElements();
                var items = [];

                // var items = self.buildSuggestions(suggestions, suggestionTerm);
                var terms = self.tokenizeSuggestionTerm(suggestionTerm);

                for (var i = 0; i < suggestions.length; i++) {
                    var suggestion = suggestions[i];
                    var firstSuggestionTerm;
                    if (i === 0) {
                        firstSuggestionTerm = suggestion.labelRaw;
                    }

                    if (suggestion.attribute.value !== "$$AllAttributes$$") {
                        continue;
                    }
                    //Show DS in suggestions only when not yet selected
                    if (self.isAllCategory()) {
                        if (suggestion.dataSource.getObjectName().value !== "$$AllDataSources$$") {
                            if (firstSuggestionTerm !== suggestion.labelRaw) {
                                continue;
                            }
                            suggestion.dataSourceLabel = self.getLabelForSinaDataSource(suggestion.dataSource);
                        } else {
                            suggestion.dataSource = self.sina.createDataSource({
                                objectName: "$$ALL$$",
                                packageName: "ABAP",
                                type: "Category",
                                label: "All Categories"
                            });
                        }
                    } else {
                        if (suggestion.dataSource.getObjectName().value !== "$$AllDataSources$$") {
                            continue;
                        } else {
                            suggestion.dataSource = self.sina.createDataSource({
                                objectName: "$$ALL$$",
                                packageName: "ABAP",
                                type: "Category",
                                label: "All Categories"
                            });
                        }
                        suggestion.dataSource = self.getProperty("/dataSource");
                        suggestion.dataSourceLabel = self.getLabelForSinaDataSource(suggestion.dataSource);
                    }

                    // suggestion.label = self.correctServerErrorHighlighting(suggestion.labelRaw, newTerms);
                    suggestion.label = self.getHighlightingForTerms(suggestion.labelRaw, terms);
                    items.push(suggestion);

                    if (self.normalSuggestionLimit === items.length) break;
                }

                self.setProperty("/suggestSection", items);

//                // mixed items and mixed labels
//                var appItems = self.getProperty("/appSection");
//                var mixedItems = appItems.concat(items);
                
                // mixed items and mixed labels
                var appItems = self.getProperty("/appSection");
                var dsItems = self.getProperty("/dataSourceSection");
                var normalItems = self.getProperty("/suggestSection");
                var mixedItems = appItems.concat(dsItems).concat(normalItems);
                
                for (var i = 0; i < mixedItems.length; i++) {
                    var item = mixedItems[i];
                    if (self.isAllCategory() && item.dataSourceLabel) {
                        item.mixedLabel = item.label + " <i>in " + item.dataSourceLabel + "</i>";
                    } else {
                        item.mixedLabel = item.label;
                    }
                }
                self.setProperty("/mixedSection", mixedItems);

            });

        },


        addTitle: function(title, items) {
            if (items.length !== 0) {
                items.unshift({
                    isTitle: true,
                    title: title
                });
            }
        },

        createAllDataSource: function() {
            return this.sina.createDataSource({
                objectName: {
                    label: "$$ALL$$",
                    value: "$$ALL$$"
                },
                packageName: {
                    label: "ABAP",
                    value: "ABAP"
                },
                type: "Category",
                label: "All Categories"
            });
        },

        createAppDataSource: function() {
            return this.sina.createDataSource({
                objectName: {
                    label: "$$APP$$",
                    value: "$$APP$$"
                },
                packageName: "",
                type: "",
                label: "App Category"
            });
        },

        getLabelForSinaDataSource: function(dataSource) {

            var dataSourceLabel = dataSource.label || dataSource.objectName.label || dataSource.objectName.value;
            // if (!dataSourceLabel || dataSourceLabel === "")
            //     dataSourceLabel = dataSource.objectName.value;

            return dataSourceLabel;

        },

        getHighlightingForTerms: function(textToHighlight, terms) {
            var myText = new Text(textToHighlight);
            for (var j = 0; j < terms.length; ++j) {
                var term = terms[j];
                myText.highlight(term);
            }
            return myText.render();

        },

        tokenizeSuggestionTerm: function(suggestionTerm) {

            var terms = suggestionTerm;
            var termsSeparatedBySpace = terms.split(" ");
            var newTerms = [];
            //Split search terms with space and wildcard into array
            $.each(termsSeparatedBySpace, function(i, termSpace) {
                termSpace = $.trim(termSpace);
                if (termSpace.length > 0) {
                    var termsSeparatedByWildcard = termSpace.split("*");
                    $.each(termsSeparatedByWildcard, function(i, term) {
                        if (term.length > 0) {
                            //                            //Escape special characters
                            //                            term = term.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"); // Not necessary because of using normal index in text.highlight instead of regex
                            newTerms.push(term);
                        }
                    });
                }
            });

            return newTerms;

        },

        correctServerErrorHighlighting: function(suggestionLabel, terms) {

            var match;
            var bTagPattern = /<b>[^<]+<\/b>/igm;

            // 2 highlight search terms
            // -----------------------------
            //Does suggestion label contain <b> tag
            while (match = bTagPattern.exec(suggestionLabel)) {
                var startPosB = match.index;
                var endPosB = bTagPattern.lastIndex - 4;
                //get the content inside <b></b>
                var bString = suggestionLabel.substring(startPosB + 3, endPosB);
                // Instanciate helper class for highlight
                var myText = new Text(bString);

                for (var i = 0; i < terms.length; ++i) {
                    match = {};
                    var term = terms[i];
                    myText.highlight(term);

                    // var searchTermPattern = new RegExp(term, "ig");
                    // if (bString !== term) {
                    //     var searchTermInOrigCase = bString.match(searchTermPattern);
                    //     if (searchTermInOrigCase && searchTermInOrigCase instanceof Array && searchTermInOrigCase.length>0) {
                    //         //Tag bold positions
                    //         myText.highlight(term);
                    //     }
                    // }
                }
                //Render according the bold tags 
                bString = myText.render();
                //Get rid of old server-side <b>content</b> with bString
                suggestionLabel = suggestionLabel.substring(0, startPosB) + bString + suggestionLabel.substring(endPosB + 4);
            }
            return suggestionLabel;

        },

        buildSuggestions: function(aSuggestions, suggestionTerm) {
            var oResult = {};

            // 1 prepare search search terms
            // -----------------------------
            var terms = suggestionTerm;
            var termsSeparatedBySpace = terms.split(" ");
            var newTerms = [];
            //Split search terms with space and wildcard into array
            $.each(termsSeparatedBySpace, function(i, termSpace) {
                termSpace = $.trim(termSpace);
                if (termSpace.length > 0) {
                    var termsSeparatedByWildcard = termSpace.split("*");
                    $.each(termsSeparatedByWildcard, function(i, term) {
                        if (term.length > 0) {
                            //Escape special characters
                            term = term.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
                            newTerms.push(term);
                        }
                    });
                }
            });
            terms = newTerms;
            //            var bTagPattern = new RegExp("/<b>[^<]+<\/b>/", "ig"); 
            var bTagPattern = /<b>[^<]+<\/b>/igm;

            jQuery.each(aSuggestions, function(i, value) {

                if (value.filter.attribute !== "$$AllAttributes$$") {
                    return;
                }

                if (!oResult[value.labelRaw]) {
                    oResult[value.labelRaw] = value;
                    oResult[value.labelRaw].categories = [];
                    oResult[value.labelRaw].visible = true;
                    oResult[value.labelRaw].type = "suggestion";
                }

                var suggestionLabel = oResult[value.labelRaw].label;
                if (suggestionLabel.length === 0) {
                    oResult[value.labelRaw].label = value.labelRaw;
                    suggestionLabel = oResult[value.labelRaw].label;
                }

                var match;
                // 2 highlight search terms
                // -----------------------------
                //Does suggestion label contain <b> tag
                while (match = bTagPattern.exec(suggestionLabel)) {
                    var startPosB = match.index;
                    var endPosB = bTagPattern.lastIndex - 4;
                    //get the content inside <b></b>
                    var bString = suggestionLabel.substring(startPosB + 3, endPosB);
                    // Instanciate helper class for highlight
                    var myText = new Text(bString);

                    for (i = 0; i < terms.length; ++i) {
                        match = {};
                        var searchTermLocal = terms[i];
                        var searchTermPattern = new RegExp(searchTermLocal, "ig");
                        if (bString !== searchTermLocal) {
                            var searchTermInOrigCase = bString.match(searchTermPattern);
                            if (searchTermInOrigCase && searchTermInOrigCase instanceof Array && searchTermInOrigCase.length > 0) {
                                //Tag bold positions
                                myText.highlight(searchTermLocal);
                            }
                        }
                    }
                    //Render according the bold tags 
                    bString = myText.render();
                    //Get rid of old server-side <b>content</b> with bString
                    suggestionLabel = suggestionLabel.substring(0, startPosB) + bString + suggestionLabel.substring(endPosB + 4);
                }

                oResult[value.labelRaw].label = suggestionLabel;


                if (value.dataSource.getObjectName().value !== "$$AllDataSources$$") {
                    oResult[value.labelRaw].categories.push({
                        label: value.dataSource.getObjectName().label,
                        data: value
                    });
                }
            });

            return jQuery.map(oResult, function(v, k) {
                return [v];
            });
        },

        addFilterCondition: function(attribute, operator, value, fireQuery) {
            var self = this;
            self.query.addFilterCondition(attribute, operator, value);
            // var conditions = self.getProperty('/filterConditions').length;
            // self.setProperty('/filterConditions/'+conditions,{
            //     attribute: attribute,
            //     operator: operator,
            //     value: value
            // });
            if (fireQuery || fireQuery === undefined) {
                self._searchFireQuery();
            }
        },

        addFilterConditionGroup: function(group, fireQuery) {
            var self = this;
            self.query.getFilter().addFilterConditionGroup(group);
            if (fireQuery || fireQuery === undefined) {
                self._searchFireQuery();
            }
        },

        resetFilterConditions: function(fireQuery) {
            var self = this;
            // self.setProperty('/filterConditions',[]);
            self.query.resetFilterConditions();

            self.query.addFilterCondition('$$RenderingTemplatePlatform$$', '=', 'html');
            self.query.addFilterCondition('$$RenderingTemplateTechnology$$', '=', 'Tempo');
            self.query.addFilterCondition('$$RenderingTemplateVariant$$', '=', '');
            self.query.addFilterCondition('$$RenderingTemplateType$$', '=', 'ItemDetails');
            self.query.addFilterCondition('$$RenderingTemplateType$$', '=', 'ResultItem');

            if (fireQuery || fireQuery === undefined) {
                self._searchFireQuery();
            }
        },

        resetAttributeFacets: function(fireQuery) {
            var self = this;
            self.setProperty('/facets/attributes', []);
            if (fireQuery || fireQuery === undefined) {
                self._searchFireQuery();
            }
        },

        getDataSources: function() {
            var self = this;
            return self.getProperty("/facets/dataSources");
        },

        resetDataSources: function(fireQuery) {
            var self = this;
            self.setProperty('/facets/dataSources', []);
            if (fireQuery || fireQuery === undefined) {
                self._searchFireQuery();
            }
        },

        getResultList: function() {
            var self = this;
            return self.perspective.getSearchResultSet();
        },

        getFacets: function() {
            var self = this;
            return self.perspective.getChartFacets();
        },

        getFilter: function() {
            var self = this;
            return self.query.getFilter();
        },

        setFilter: function(filter, fireQuery) {
            var self = this;
            self.query.setFilter(filter);
            if (fireQuery || fireQuery === undefined) {
                self._searchFireQuery();
            }
        },

        getTop: function() {
            var self = this;
            return self.query.getTop();
        },

        setTop: function(top, fireQuery) {
            var self = this;
            self.query.setTop(top);
            if (fireQuery || fireQuery === undefined) {
                self._searchFireQuery();
            }
        },

        getSkip: function() {
            var self = this;
            return self.query.getSkip();
        },

        setSkip: function(skip, fireQuery) {
            var self = this;
            self.query.setSkip(skip);
            if (fireQuery || fireQuery === undefined) {
                self._searchFireQuery();
            }
        },

        resetDataSource: function(fireQuery) {
            var self = this;
            if (sap.bc === undefined)
                return;
            var dataSource = self.sina.createDataSource({
                objectName: "$$ALL$$",
                packageName: "ABAP",
                type: "Category",
                label: "All Categories"
            });
            self.setDataSource(dataSource, fireQuery);
        },

        getDataSource: function() {
            var self = this;
            return self.query.getDataSource();
        },

        getDataSourceJson: function() {
            var self = this;
            var dataSource = self.getProperty("/dataSource");
            var json = {
                "SchemaName": {
                    "label": dataSource.getSchemaName().label,
                    "value": dataSource.getSchemaName().value
                },
                "PackageName": {
                    "label": dataSource.getPackageName().label,
                    "value": dataSource.getPackageName().value
                },
                "ObjectName": {
                    "label": dataSource.getObjectName().label,
                    "value": dataSource.getObjectName().value
                }
            };
            if (dataSource.getType().value) {
                json.Type = dataSource.getType().value;
            }
            return json;
        },

        setDataSource: function(dataSource, fireQuery) {
            var self = this;
            dataSource = self.sina.createDataSource(dataSource);
            var dataSourceLabel = dataSource.getLabel();
            self.setProperty('/dataSourceName', dataSourceLabel);
            self.setProperty('/dataSourceLabelRaw', dataSource.objectName.value);

            // if(dataSource.equals(self.query.getDataSource())){
            //     return;
            // }
            self.setSkip(0, false);
            self.setProperty("/dataSource", dataSource);

            if (self.isAllCategory()) {
                self.setProperty('/dataSourceName', "");
                self.setProperty('/dataSourceLabelRaw', "$$ALL$$");
            }


            this.oUserRecentsService.noticeDataSource(dataSource);

            // self.query.setDataSource(dataSource);
            // self.suggestionQuery.setDataSource(dataSource);

            if (fireQuery || fireQuery === undefined) {
                self._searchFireQuery();
            }
        },

        getSearchTerm: function() {
            var self = this;
            return self.getProperty("/searchBoxTerm");
        },

        setSearchTerm: function(searchTerm, fireQuery) {
            var self = this;

            self.setProperty("/searchBoxTerm", searchTerm);
            // sap.ui.getCore().getEventBus().publish("searchTermChanged", {searchTerm:searchTerm});

            if (fireQuery || fireQuery === undefined) {
                self._searchFireQuery();
            }
        },

        getResultsForDataSource: function(dataSource, results) {
            var resultsForDS = [];
            for (var i = 0; i < results.length; i++) {
                var result = results[i];
                var resultDS = result.$$DataSourceMetaData$$;
                if (dataSource.objectName.value === resultDS.objectName.value) {
                    resultsForDS.push(result);
                }
            }
            return resultsForDS;
        },

        // itemPressed: function (item) {
        //     var self = this;
        //     self.setProperty("/detail", item);
        // },

        _searchFireQuery: function() {
            var self = this;
            if (!self.sina) {
                jQuery.sap.log.info("Current Search adapter does not support Sina queries");
                return;
            }

            var searchTerm = self.getProperty('/searchBoxTerm');
            var dataSource = self.getProperty("/dataSource");

            // this.oUserRecentsService.noticeSearch({
            // });

            sap.ui.getCore().getEventBus().publish("search", {
                searchTerm: searchTerm,
                dataSource: dataSource
            });

            if (self.getSkip() > 0 && self.query.getSearchTerms() === searchTerm && self.query.getDataSource().equals(dataSource)) {
                //result is appended
                self.setProperty("/isResultAppended", true);
            } else {
                self.setProperty("/results", []);
                self.setProperty("/isResultAppended", false);
            }
            self.query.setSearchTerms(searchTerm);
            self.query.setDataSource(dataSource);

            //if Apps is selected as datasource, then disable normal search
            //          if(self.isAppCategory()){
            //          	self.setProperty("/isNormalSearchEnable", false);
            //          }else{
            //          	self.setProperty("/isNormalSearchEnable", true);
            //          }

            // increment request id
            self.searchRequestID = self.searchRequestID + 1;
            var currentSearchRequestID = self.searchRequestID;

            // notify view
            // self.fireRequestSent();
            sap.ui.getCore().getEventBus().publish("searchStarted");

            var pending = 2;
            var checkFinished = function() {
                if (!--pending) {
                    sap.ui.getCore().getEventBus().publish("allSearchFinished");
                }
            };

            //App Search
            self.setProperty("/tiles", []);
            if (self.isAllCategory() || self.isAppCategory()) {
                var appQueryProps = {
                    searchTerm: self.getProperty('/searchBoxTerm'),
                    searchInKeywords: true
                };
                sap.ushell.Container.getService("Search").queryApplications(appQueryProps).done(function(oResult) {
                    if (currentSearchRequestID !== self.searchRequestID) //Request is deprecated
                    {
                        jQuery.sap.log.debug("Searchrequest deprecated");
                        return;
                    }

                    var aModelTiles = [];
                    var aTiles = oResult.getElements();
                    self.setProperty("/tiles", aTiles);

                    sap.ui.getCore().getEventBus().publish("appSearchFinished", oResult);
                });
            } else {
                sap.ui.getCore().getEventBus().publish("appSearchFinished");
            }
            checkFinished();

            //Invalidate old perspective
            self.perspective = self.getEmptyPerspective();

            // Normal Search
            if (self.isNormalSearchEnable() && !self.isAppCategory()) {
                var deferredResultSet = self.query.getResultSet();
                deferredResultSet.always(function(perspective) {
                    if (this.state() !== "resolved") {
                        //show empty result list in case of error
                        perspective = self.getEmptyPerspective();
                    }
                    //                    if (!self.isNormalSearchEnable()) { //Nomal search is hidden
                    //                    	return;
                    //                    }
                    if (currentSearchRequestID !== self.searchRequestID) //Request is deprecated
                    {
                        jQuery.sap.log.debug("Searchrequest deprecated");
                        return;
                    }
                    self.perspective = perspective;
                    self._afterSearchPrepareResultList(perspective, self.getProperty("/isResultAppended"));
                    // self._afterSearchPrepareFacets(perspective);
                    sap.ui.getCore().getEventBus().publish("searchFinished", {
                        append: self.getProperty("/isResultAppended"),
                        resultset: perspective
                    });
                });
                // example error:
                // var error = {};
                // error.responseText = '{"Error":{"Code":200,"Message":"Engine-Fehler"},"ErrorDetails":[{"Code":"ESH_FED_MSG020","Message":"Suchumfang ist nicht gültig HT3360~EPM_EMPLOYEES_DEMO~"}]}';
                // error.responseText = '{"Error":{"Code":200,"Message":"Engine error"},"ErrorDetails":[{"Code":"ESH_FED_MSG016","Message":"No authorization for the given list of connectors"}]}';
                deferredResultSet.fail(function(error) {
                    //these ina service errors shall not appear as popups:
                    var ignoredErrors = ["ESH_FED_MSG016"]; //<- No authorization for the given list of connectors, or no connectors active (i.e. only app search is used)
                    if (error && error.responseText) {
                        var showErrorPopup = true;
                        var inaErr = jQuery.parseJSON(error.responseText);
                        var errMsg = 'Search Error: ';
                        var detailMsg = '';
                        if (inaErr.Error) {
                            if (inaErr.Error.Message) {
                                errMsg += '' + inaErr.Error.Message;
                            }
                            if (inaErr.Error.Code) {
                                errMsg += ' (Code ' + inaErr.Error.Code + ').';
                            }
                        }
                        if (inaErr.ErrorDetails) {
                            detailMsg += '';
                            for (var i = 0; i < inaErr.ErrorDetails.length; i++) {
                                detailMsg += inaErr.ErrorDetails[i].Message + ' (Code ' + inaErr.ErrorDetails[i].Code + ')';
                                if (ignoredErrors.indexOf(inaErr.ErrorDetails[i].Code) !== -1) {
                                    showErrorPopup = false;
                                }
                            }
                        }
                        jQuery.sap.log.error(errMsg + ' Details: ' + detailMsg);
                        if (showErrorPopup) {
                            jQuery.sap.require("sap.ca.ui.message.message");
                            sap.ca.ui.message.showMessageBox({
                                type: sap.ca.ui.message.Type.ERROR,
                                message: errMsg,
                                details: detailMsg
                            });
                        }
                    }
                });
                deferredResultSet.always(function(perspective) {
                    checkFinished();
                });
            } else {
                checkFinished();
            }

        },

        getEmptyPerspective: function(results) {
            return {
                getSearchResultSet: function() {
                    return {
                        getElements: function() {
                            return [];
                        },
                        totalcount: 0
                    };
                }
            };
        },

        _searchGetGenericResults: function(results) {

            function getImageUrl(result) {
                var imageAttr = {
                    imageUrl: '',
                    name: ''
                };
                for (var prop in result) {
                    if (result[prop].label && result[prop].value) {
                        if (result[prop].value && jQuery.type(result[prop].value) === 'string' &&
                            (result[prop].value.split('.').pop() === 'jpg' || result[prop].value.split('.').pop() === 'png')) {
                            imageAttr.imageUrl = result[prop].value;
                            imageAttr.name = prop;
                            return imageAttr;
                        }
                    }
                }
                return imageAttr;

            }

            var moveWhyFound2ResponseAttr = function(whyfounds, property) {
                var l = whyfounds.length;
                while (l--) {
                    if (whyfounds[l].labelRaw === property.labelRaw && property !== undefined) {
                        property.value = whyfounds[l].value;
                        property.whyfound = true;
                        whyfounds.splice(l, 1);
                    }
                }
            };

            //sort against displayOrder
            var sortDisplayOrder = function(a, b) {
                return a.displayOrder - b.displayOrder;
            };

            var genericResults = [];
            for (var i = 0; i < results.length; i++) {
                var result = results[i];

                var uri = '';
                var relatedActions = result.$$RelatedActions$$;
                for (var relatedAction in relatedActions) {
                    if (relatedActions[relatedAction].type === "Navigation") {
                        uri = relatedActions[relatedAction].uri;
                        //                        uri = "#SalesOrder-DisplayFactSheet?SalesOrder=27";
                        //                        uri = "/sap/bc/ui5_ui5/ui2/ushell/shells/abap/FioriLaunchpad.html?sap-client=111#SalesOrder-DisplayFactSheet?SalesOrder=27"
                    }
                }
                var whyfounds = result.$$WhyFound$$ || [];

                var summaryAttrs = [];
                var detailAttrs = [];
                var title = '';

                for (var prop in result) {
                    if (result[prop].label && result[prop].$$MetaData$$) {
                        var presentationUsage = result[prop].$$MetaData$$.presentationUsage || [];
                        if (presentationUsage && presentationUsage.length > 0) {
                            if (presentationUsage.indexOf("Title") > -1 && result[prop].value) {
                                moveWhyFound2ResponseAttr(whyfounds, result[prop]);
                                title = title + " " + result[prop].value;
                            }
                            if (presentationUsage.indexOf("Summary") > -1) {
                                summaryAttrs.push({
                                    property: prop,
                                    displayOrder: result[prop].$$MetaData$$.displayOrder
                                });
                            } else if (presentationUsage.indexOf("Detail") > -1) {
                                detailAttrs.push({
                                    property: prop,
                                    displayOrder: result[prop].$$MetaData$$.displayOrder
                                });
                            }
                        }
                    }
                }


                summaryAttrs.sort(sortDisplayOrder);
                detailAttrs.sort(sortDisplayOrder);

                var displayRelevantAttrs = summaryAttrs.concat(detailAttrs);
                var attNum = 1;
                var listResult = {};
                var imageAttr = getImageUrl(result);
                listResult.imageUrl = imageAttr.imageUrl;
                listResult.dataSourceName = this._highlight(result.$$DataSourceMetaData$$.label);
                listResult.uri = uri;
                listResult.$$Name$$ = '';

                for (var z = 0; z < displayRelevantAttrs.length; z++) {
                    var propDisplay = displayRelevantAttrs[z].property;
                    // image attribute shall not be displayed as a normal key value pair
                    if (propDisplay !== imageAttr.name) {
                        moveWhyFound2ResponseAttr(whyfounds, result[propDisplay]);
                        listResult["attr" + attNum + "Name"] = result[propDisplay].label;
                        listResult["attr" + attNum] = result[propDisplay].value;
                        if (result[propDisplay].whyfound) {
                            listResult["attr" + attNum + "Whyfound"] = result[propDisplay].whyfound;
                        }
                        attNum = attNum + 1;
                    }
                }

                listResult.$$Name$$ = title.trim();
                listResult.numberofattributes = displayRelevantAttrs.length;
                //TODO: replace it with dataSourceName + $$Name$$ in view
                listResult.title = result.title;
                listResult.whyfounds = whyfounds;
                genericResults.push(listResult);
            }

            return genericResults;

        },

        _highlight: function(text) {

            // 1 prepare search search terms
            // -----------------------------
            var terms = this.query.filter.searchTerms;
            terms = terms.replace(new RegExp("[*]", "g"), "");
            terms = terms.split(" ");
            var newTerms = [];
            terms = $.each(terms, function(i, term) {
                term = $.trim(term);
                if (term.length > 0) {
                    newTerms.push(term);
                }
            });
            terms = newTerms;

            // 2 highlight search terms
            // -----------------------------
            var myText = new Text(text);
            for (var i = 0; i < terms.length; ++i) {
                var term = terms[i];
                myText.highlight(term);
            }
            return myText.render();

        },

        _afterSearchPrepareResultList: function(resultset, append) {
            var self = this;
            var visibleResults = self.getProperty("/results");
            var resultsForList;

            if (append) {
                visibleResults.pop(); //Remove footer
            }

            var results = resultset.getSearchResultSet().getElements();
            results = self._searchGetGenericResults(results);
            resultsForList = visibleResults.concat(results);

            //Add footer
            if (resultsForList.length < resultset.getSearchResultSet().totalcount) // There is more
            {
                var resultListFooter = {};
                resultListFooter.type = "footer";
                resultsForList.push(resultListFooter);
            }

            self.setProperty("/resultListHeading", sap.ushell.resources.i18n.getText("searchResults"));
            self.setProperty("/count", resultset.getSearchResultSet().totalcount);
            self.setProperty("/results", resultsForList);

            if (window.f2p) window.f2p.add(window.f2p.m.endSearch, {
                st: ""
            });

        },

        mockScopes: function() {

            var scopes = [{
                label: 'Supplier',
                labelRaw: 'Q7D004~VENDOR_H~',
                objectName: {
                    label: 'Supplier',
                    value: 'Q7D004~VENDOR_H~'
                },
                packageName: {
                    label: "",
                    value: ""
                },
                schemaName: {
                    label: "",
                    value: ""
                }
            }, {
                label: 'Goods Issue',
                labelRaw: 'Q7D004~GOODS_ISSUE_H~',
                objectName: {
                    label: 'Goods Issue',
                    value: 'Q7D004~GOODS_ISSUE_H~'
                },
                packageName: {
                    label: "",
                    value: ""
                },
                schemaName: {
                    label: "",
                    value: ""
                }
            }, {
                label: 'Material',
                labelRaw: 'Q7D004~MATERIAL_H~',
                objectName: {
                    label: 'Material',
                    value: 'Q7D004~MATERIAL_H~'
                },
                packageName: {
                    label: "",
                    value: ""
                },
                schemaName: {
                    label: "",
                    value: ""
                }
            }, {
                label: 'Purchasing Info Record',
                labelRaw: 'Q7D004~PURCHASE_INFO_REC_H~',
                objectName: {
                    label: 'Purchasing Info Record',
                    value: 'Q7D004~PURCHASE_INFO_REC_H~'
                },
                packageName: {
                    label: "",
                    value: ""
                },
                schemaName: {
                    label: "",
                    value: ""
                }
            }, {
                label: 'Purchase Order',
                labelRaw: 'Q7D004~PURCHASE_ORDER_H~',
                objectName: {
                    label: 'Purchase Order',
                    value: 'Q7D004~PURCHASE_ORDER_H~'
                },
                packageName: {
                    label: "",
                    value: ""
                },
                schemaName: {
                    label: "",
                    value: ""
                }
            }, {
                label: 'Sales Order',
                labelRaw: 'Q7D004~SALES_ORDER_H~',
                objectName: {
                    label: 'Sales Order',
                    value: 'Q7D004~SALES_ORDER_H~'
                },
                packageName: {
                    label: "",
                    value: ""
                },
                schemaName: {
                    label: "",
                    value: ""
                }
            }];

            return scopes;

        },

        //         searchPrepareCategoryFacet: function (resultset, oModel) {
        //             var self = this;
        //             self.oModel = oModel;
        //             // remove old categories
        // //            self.searchCategoryTree = self.searchCategoryTree || [];
        // search was invoked through SAPUI5 event bus -> update model
        _searchInvoked: function(sChannelId, sEventId, oData) {
            var self = this;

            //TODO: whats this?
            if (window.f2p) {
                window.f2p.add(window.f2p.m.startSearch, {
                    st: oData.searchTerm
                });
            }

            //reset datasource if searchterm does not contain old search term
            if (oData.searchTerm.toLowerCase().indexOf(self.getSearchTerm().toLowerCase()) === -1) {
                self.resetDataSource(false);
            }
            self.setSearchTerm(oData.searchTerm, false);
            if (oData.dataSource) {
                self.setDataSource(oData.dataSource, false);
            }
            self.setSkip(0, false);
            self.setTop(10);

        },

        _afterSearchPrepareFacets: function() {
            var self = this;
            var facets = self.getFacets();

            var dataSources = facets.filter(function(element) {
                return element.facetType === "datasource";
            });
            self._afterSearchPrepareDataSourceFacet(dataSources);

            var attributeFacets = facets.filter(function(element) {
                return element.facetType === "attribute";
            });
            self._afterSearchPrepareAttributeFacet(attributeFacets);
        },

        _afterSearchPrepareDataSourceFacet: function(dataSources) {
            var self = this;
            var items = self.getProperty("/facets/dataSources");
            if (dataSources.length > 0) {
                dataSources = dataSources[0];
                if (dataSources.query.resultSet && dataSources.query.resultSet.elements && dataSources.query.resultSet.elements.length > 0) {
                    for (var i = 0; i < dataSources.query.resultSet.elements.length; i++) {
                        var item = {
                            id: dataSources.query.resultSet.elements[i].dataSource.label + (i + 1),
                            text: dataSources.query.resultSet.elements[i].dataSource.label,
                            count: dataSources.query.resultSet.elements[i].valueRaw,
                            dataSource: dataSources.query.resultSet.elements[i].dataSource,
                            selected: self.getDataSource() === dataSources.query.resultSet.elements[i].dataSource
                        };
                        items.push(item);
                    }
                }
            }
            self.setProperty("/facets/dataSources", items);
        },

        _afterSearchPrepareAttributeFacet: function(serverSideAttributeFacets) {
            var self = this;

            function facetsWithSelections(elem) {
                var hasSelections = false;
                for (var i = 0, len = elem.items.length; i < len; i++) {
                    var item = elem.items[i];
                    if (item.selected) {
                        hasSelections = true;
                        break;
                    }
                }
                return hasSelections;
            }
            var allAttributeFacets = self.getProperty("/facets/attributes").filter(facetsWithSelections);
            for (var i = 0, len = serverSideAttributeFacets.length; i < len; i++) {
                var serverSideFacet = {
                    title: serverSideAttributeFacets[i].title,
                    dimension: serverSideAttributeFacets[i].dimension,
                    items: [],
                    allCount: 0
                };
                for (var j = 0, lenJ = serverSideAttributeFacets[j].query.resultSet.elements.length; j < lenJ; j++) {
                    var elem = serverSideAttributeFacets[i].query.resultSet.elements[j];
                    var item = {
                        text: elem.label,
                        count: elem.valueRaw,
                        filterCondition: elem.labelRaw,
                        selected: false
                    };
                    serverSideFacet.items.push(item);
                    serverSideFacet.allCount += item.count;
                }
                var facetFound = false; // search for duplicates
                for (var k = 0, lenK = allAttributeFacets.length; k < lenK; k++) {
                    var localFacet = allAttributeFacets[k];
                    if (localFacet.title === serverSideFacet.title && localFacet.dimension === serverSideFacet.dimension) {
                        facetFound = true;
                        break;
                    }
                }
                if (!facetFound) {
                    allAttributeFacets.push(serverSideFacet);
                }
            }

            self.setProperty("/facets/attributes", allAttributeFacets);
        }


    });

})(window);
