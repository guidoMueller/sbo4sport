// Copyright (c) 2013 SAP AG, All Rights Reserved

(function () {
    "use strict";
    /*global jQuery, sap, console, window */
    
//    jQuery.sap.require("sap.ushell.renderers.fiori2.search.SearchModel");

    /**
     * @name "sap.ushell.renderers.fiori2.SearchFilter
     * @extends sap.ui.core.mvc.Controller
     * @public
     */
    sap.ui.controller("sap.ushell.renderers.fiori2.search.SearchSuggestions", {

        /**
         * SAPUI5 lifecycle hook.
         * @public
         */
        onInit: function () {

            // var oModel = new sap.ui.model.json.JSONModel();
            // this.getView().setModel(oModel, "suggestions");
            // this.appSuggestionLimit = this.getView().appSuggestionLimit;
            // this.objSuggestionLimit = this.getView().objSuggestionLimit;           
            //this.closeSuggestions();
            //this.query = sap.ushell.Container.getService("Search").getSina().createSuggestionQuery();
            //sap.ui.getCore().getEventBus().subscribe("searchSuggest", this.doSuggestion, this);
//            sap.ui.getCore().getEventBus().subscribe("search", function(){this.closeSuggestions(); this.removeFocus();}, this);
//            sap.ui.getCore().getEventBus().subscribe("searchFinished", this.closeSuggestions, this);
            //sap.ui.getCore().getEventBus().subscribe("searchFinished", function(){this.closeSuggestions(); this.removeFocus();}, this);
        },

        onExit: function () {

            sap.ui.getCore().getEventBus().unsubscribe("searchSuggest", this.doSuggestion, this);
            sap.ui.getCore().getEventBus().unsubscribe("search", this.closeSuggestions, this);
        },

        
        removeFocus: function(){
            sap.ui.getCore().byId("sfOverlay").getFocusDomRef().blur();
        },
        
        closeSuggestions: function (sChannelId, sEventId, oData) {
                        
            // object suggestions
            var items = [];
            for(var i=0;i< this.objSuggestionLimit;++i){
                items.push({visible: false, type: "suggestion"});
            }
            
            // footer for object suggestions            
            items.push({visible: false, type: "suggestion", isGroupFooter: true});
            
            // header for app suggestions
            items.push({visible: false, type: "app", isGroupHeader: true, label: sap.ushell.resources.i18n.getText("suggestion_found_apps")});
            
            // app suggestions
            for(i=0;i< this.appSuggestionLimit;++i){
                items.push({visible: false, type: "app"});
            }
            
            // set suggestions in model
            this.getView().getModel("suggestions").setData({
                items: items,
                suggestionsVisible: false,
                visible: false
                
            });
            
        },

        dataSourceSelected: function (sChannelId, sEventId, oData) {
            if (this.getView().getModel("suggestions").getProperty("/visible")) {
                this.doSuggestion(null, null, {searchTerm: this.lastSearchTerm});
            }
        },

        onClickSuggestion: function (oEvent) {
            var oSuggestion = oEvent.getSource().getBindingContext("suggestions").getObject(),
                oDataSource,
                sSearchTerm,
                bCategorySuggested = false;

            if (oSuggestion.type === "app") {
                if (oSuggestion.targetURL) {
                    window.location = oSuggestion.targetURL;
                }
            } else {
                if (oSuggestion.data) {
                    sSearchTerm = oSuggestion.data.labelRaw;
                    oDataSource = oSuggestion.data.dataSource;
                    oDataSource.label = oDataSource.objectName.label;
                    bCategorySuggested = true;
                } else {
                    sSearchTerm = oSuggestion.labelRaw;
//                    oDataSource = sap.ushell.Container.getService("Search").getDataSource();
                    oDataSource = {
                            label: "All",
                            level: 0,
                            objectName: {
                                label: "ALL",
                                value: "$$ALL$$"
                            },
                            packageName: {
                                label: "ABAP",
                                value: "ABAP"
                            },
                            schemaName: {
                                label: "",
                                value: ""
                            },
                            type: {
                                label: "Category",
                                value: "Category"
                            }
                    }; 
                }
                sap.ui.getCore().getEventBus().publish("externalSearch", {
                    searchTerm: sSearchTerm,
                    dataSource: oDataSource,
                    categorySuggested: bCategorySuggested
                });
            }
        },

        doSuggestion: function (sChannelId, sEventId, oData) {
            var oFilter = new sap.ui.model.Filter("visible", sap.ui.model.FilterOperator.EQ, true),
                oModel = this.getView().getModel("suggestions"),
                appQuery,
                query;

            // do not trigger requests twice if view is not visible at the moment
            if (oData.activeViews && oData.activeViews.indexOf(this.getView().getId()) === -1) {
                return;
            }

            // suggestions only if there is at least 1 character
            if (oData.searchTerm.length === 0) {
                this.closeSuggestions();
                return;
            }

            // make visible
            oModel.setProperty("/visible", true);
       
            this.lastSearchTerm = oData.searchTerm;

            // app suggestions
            this.doAppSuggestions(oData);

            // business object suggestions
            if (oData.searchTerm.length >=3 && this.objSuggestionsActive()) {
                this.doObjSuggestions(oData);
            }else{
                this.clearObjSuggestions(oModel);
            }

        },

        objSuggestionsActive : function(){
            if(window.searchConfig && window.searchConfig.objSuggestions!==undefined){
                return window.searchConfig.objSuggestions;                
            } else  {
                return true;
            }
        },
        
        clearObjSuggestions : function(oModel){

            var oFilter = new sap.ui.model.Filter("visible", sap.ui.model.FilterOperator.EQ, true);
            // hide object suggestions + footer
            for (var i=0; i <= this.objSuggestionLimit; i = i + 1) {
                oModel.setProperty("/items/" + i + "/visible", false);
            }     
            this.getView().getContent()[0].getBinding("items").filter([oFilter]);
        },
        
        doAppSuggestions : function(oData){

            var oFilter = new sap.ui.model.Filter("visible", sap.ui.model.FilterOperator.EQ, true),
                oModel = this.getView().getModel("suggestions"),
                appQuery;

            appQuery = sap.ushell.Container.getService("Search").queryApplications(oData.searchTerm, jQuery.proxy(function (resultset) {
                var result = resultset.getElements();

                //TODO: uncomment
                // if (resultset.searchTerm !== this.lastSearchTerm) {
                //     return;
                // }

                for(var i=0;i<this.appSuggestionLimit;++i){
                    if(i<result.length){
                    var appSuggest = result[i];
                    oModel.setProperty("/items/"+(this.objSuggestionLimit+2+i), {
                        label: appSuggest.label,
                        icon: appSuggest.icon,
                        targetURL: appSuggest.targetURL,
                        app: appSuggest,
                        visible: true,
                        type: "app"
                    });                                            
                    }else{
                        oModel.setProperty("/items/"+(this.objSuggestionLimit+2+i)+"/visible", false);
                    }
                }
                
                if(result.length>0){
                     oModel.setProperty("/items/"+(this.objSuggestionLimit+1)+"/visible", true);
                }else{
                     oModel.setProperty("/items/"+(this.objSuggestionLimit+1)+"/visible", false);
                }
                
                this.getView().getContent()[0].getBinding("items").filter([oFilter]);
            }, this), this.appSuggestionLimit);
            
        },
        
        doObjSuggestions : function(oData){
            
            var oFilter = new sap.ui.model.Filter("visible", sap.ui.model.FilterOperator.EQ, true),
                oModel = this.getView().getModel("suggestions"),
                self = this;

            
            self.query.setSuggestionTerm(oData.searchTerm);
            self.query.dataSource({
                objectName: "$$ALL$$",
                packageName: "ABAP",
                type: "Category"
            });
            self.query.getResultSet(jQuery.proxy(function (resultset) {
                var suggestions = resultset.getElements(),
                    oSuggestions = [],
                    i = 0;

                //TODO: find out how to get the suggestionterm from ina service
                // if (resultset.searchTerm !== this.lastSearchTerm) {
                //     return;
                // }

                if (suggestions.length > 0) {
                    oSuggestions = this.buildSuggestions(suggestions, oData);
                    oModel.setProperty("/suggestionsVisible", true);
                } else {
                    oModel.setProperty("/suggestionsVisible", false);
                }

                for (i; i < this.objSuggestionLimit; i = i + 1) {
                    if (oSuggestions[i] && i < this.objSuggestionLimit) {
                        oModel.setProperty("/items/" + i, oSuggestions[i]);
                    } else {
                        oModel.setProperty("/items/" + i + "/visible", false);
                    }
                }

                if (oSuggestions.length > 0) {
                    oModel.setProperty("/items/" + (this.objSuggestionLimit), {visible: true, type: "suggestion", isGroupFooter: true});
                } else {
                    oModel.setProperty("/items/" + (this.objSuggestionLimit) + "/visible", false);
                }

                this.getView().getContent()[0].getBinding("items").filter([oFilter]);
            }, this));
            
        },
        
        buildSuggestions: function (aSuggestions, oData) {
            var oResult = {};
            
            // 1 prepare search search terms
            // -----------------------------
            var terms = oData.searchTerm;
            var termsSeparatedBySpace = terms.split(" ");
            var newTerms = [];
            //Split search terms with space and wildcard into array
            $.each(termsSeparatedBySpace, function (i,termSpace) {
                termSpace = $.trim(termSpace);
                if(termSpace.length>0){
                    var termsSeparatedByWildcard = termSpace.split("*");
                    $.each(termsSeparatedByWildcard, function (i,term) {
                        if(term.length>0){
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
            
            jQuery.each(aSuggestions, function (i, value) {

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
                
                // 2 highlight search terms
                // -----------------------------
                //Does suggestion label contain <b> tag
                while (match=bTagPattern.exec(suggestionLabel)) {
                    var startPosB = match.index; 
                    var endPosB   = bTagPattern.lastIndex-4; 
                    //get the content inside <b></b>
                    var bString   = suggestionLabel.substring(startPosB+3, endPosB);
                    // Instanciate helper class for highlight
                    var myText = new Text(bString);
                    
                    for (var i = 0; i < terms.length; ++i) {
                        var match = {};
                        var searchTermLocal = terms[i];
                        var searchTermPattern = new RegExp(searchTermLocal, "ig");
                        if (bString !== searchTermLocal) {
                            var searchTermInOrigCase = bString.match(searchTermPattern);
                            if (searchTermInOrigCase && searchTermInOrigCase instanceof Array && searchTermInOrigCase.length>0) {
                                //Tag bold positions
                                myText.highlight(searchTermLocal);
                            }
                        }
                    }
                    //Render according the bold tags 
                    bString = myText.render();
                    //Get rid of old server-side <b>content</b> with bString
                    suggestionLabel = suggestionLabel.substring(0, startPosB) + bString + suggestionLabel.substring(endPosB+4);
                }
                
                oResult[value.labelRaw].label = suggestionLabel;
                
                
                if (value.dataSource.getObjectName().value !== "$$AllDataSources$$") {
                    oResult[value.labelRaw].categories.push({
                        label: value.dataSource.getObjectName().label,
                        data: value
                    });
                }
            });

            return jQuery.map(oResult, function (v, k) {
                return [v];
            });
        }
    });
    
    // =======================================================================
    // helper class for highlight x
    // =======================================================================
    var Text = function () {
        this.init.apply(this, arguments);
    };

    Text.prototype = {

        init: function (text) {
            // store text
            this.text = text;
            // normalized text
            this.lower = text.toLocaleLowerCase();
            // global flag is there is any bold char
            this.globalBold = false;
            // create array which stores flag whether character is bold or not
            this.bold = new Array(this.text.length);
            for (var i = 0; i < this.bold.length; ++i) {
                this.bold[i] = false;
            }
        },

        highlight: function (term) {

            // normalize to lower case
            term = term.toLowerCase();

            // loop at all occurences of term in this.lower
            var index = -1;
            while (index < this.lower.length) {
                var index = this.lower.indexOf(term, index);
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

        render: function () {

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
}());
