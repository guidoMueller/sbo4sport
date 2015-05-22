/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */

jQuery.sap.declare("sap.apf.core.configurationFactory");
jQuery.sap.require("sap.apf.core.step");
jQuery.sap.require("sap.apf.core.request");
jQuery.sap.require("sap.apf.utils.hashtable");
jQuery.sap.require("sap.apf.core.binding");
jQuery.sap.require("sap.apf.core.representationTypes");
jQuery.sap.require("sap.apf.core.constants");

/**
 * @private
 * @class This class loads the configuration object, registers its properties and provides getters to receive references or copies of them.
 */
sap.apf.core.ConfigurationFactory = function(oInject) {
	// Private Vars
	var idRegistry = new sap.apf.utils.Hashtable(oInject.messageHandler);
	var setItem = function(oItem) {
		oInject.messageHandler.check(oItem !== undefined && oItem.hasOwnProperty("id") !== false, "oItem is undefined or property 'id' is missing", sap.apf.core.constants.message.code.errorCheckConfiguration);
		if(!idRegistry){ 
			idRegistry = new sap.apf.utils.Hashtable(oInject.messageHandler);}
		var result = idRegistry.setItem(oItem.id, oItem);
		oInject.messageHandler.check((result === undefined), "Configuration includes duplicated identifiers (IDs)", sap.apf.core.constants.message.code.errorCheckConfigurationWarning);
	};
	var getItemsByType = function(type) {
		var aResults = [];
		if (idRegistry.getNumberOfItems() != 0) {
			idRegistry.each(function(index, element) {
				if (element.type === type) {
					aResults.push(element);
				}
			});
			return aResults;
		} else {
			oInject.messageHandler.putMessage(oInject.messageHandler.createMessageObject({
				code : "5020"
			}));
			return aResults;
		}
	};
	var loadSteps = function(aSteps) {
		oInject.messageHandler.check(aSteps !== undefined && aSteps instanceof Array !== false, "aSteps is missing or not an Array", sap.apf.core.constants.message.code.errorCheckConfiguration);
		for( var i = 0; i < aSteps.length; i++) {
			loadStep(aSteps[i]);
		}
	};
	var loadStep = function(oStep) {
		if (oStep.type === undefined) {
			oStep.type = "step";
		}
		setItem(oStep);
	};
	var loadRequests = function(aRequests) {
		oInject.messageHandler.check(aRequests !== undefined && aRequests instanceof Array !== false, "aRequests is missing or not an Array", sap.apf.core.constants.message.code.errorCheckConfiguration);
		for( var i = 0; i < aRequests.length; i++) {
			loadRequest(aRequests[i]);
		}
	};
	var loadRequest = function(oRequest) {
		if (oRequest.type === undefined) {
			oRequest.type = "request";
		}
		setItem(oRequest);
	};
	var loadBindings = function(aBindings) {
		oInject.messageHandler.check(aBindings !== undefined && aBindings instanceof Array !== false, "aBindings is missing or not an Array", sap.apf.core.constants.message.code.errorCheckConfiguration);
		for( var i = 0; i < aBindings.length; i++) {
			loadBinding(aBindings[i]);
		}
	};
	var loadBinding = function(oBinding) {
		var representationRegistry = new sap.apf.utils.Hashtable(oInject.messageHandler);
		if (oBinding.type === undefined) {
			oBinding.type = "binding";
		}
		oInject.messageHandler.check(oBinding.id !== undefined, "binding has no id");
		oInject.messageHandler.check(oBinding.representations !== undefined && oBinding.representations instanceof Array !== false, "representations for binding " + oBinding.id + " not defined", sap.apf.core.constants.message.code.errorCheckConfiguration);

		checkRepresentationForID();
		checkInitialStepForSingleRepresentation();
		setItem(oBinding);

		function checkRepresentationForID() {
			for( var i = 0; i < oBinding.representations.length; i++) {
				//check for existing id
				if (!(oBinding.representations[i].id && typeof oBinding.representations[i].id === "string")) {
					oInject.messageHandler.putMessage(oInject.messageHandler.createMessageObject({
						code : "5028",
						aParameters : [ oBinding.id ]
					}));
				}
				//check for duplicated id
				if (representationRegistry.setItem(oBinding.representations[i].id, oBinding.representations[i].id)) {
					oInject.messageHandler.putMessage(oInject.messageHandler.createMessageObject({
						code : "5029",
						aParameters : [ oBinding.id ]
					}));
				}
			}
		}

		function checkInitialStepForSingleRepresentation() {
			if (oBinding.representations.length > 1) {
				var aSteps = getItemsByType('step');
				for( var i = 0; i < aSteps.length; i++) {
					if (aSteps[i].categories[0].id === 'initial' && aSteps[i].binding === oBinding.id) {
						var oMessageObject = oInject.messageHandler.createMessageObject({
							code : "5003",
							aParameters : [ aSteps[i].id ]
						});
						oInject.messageHandler.putMessage(oMessageObject);
					}
				}
			}
		}
	};
	var loadCategories = function(aCategories) {
		oInject.messageHandler.check(aCategories !== undefined && aCategories instanceof Array !== false, "aCategories is missing or not an Array", sap.apf.core.constants.message.code.errorCheckConfiguration);
		for( var i = 0; i < aCategories.length; i++) {
			loadCategory(aCategories[i]);
		}
	};
	var loadRepresentationTypes = function(aRepresentationTypes) {
		oInject.messageHandler.check(aRepresentationTypes !== undefined && aRepresentationTypes instanceof Array !== false, "aRepresentationInfo is missing or not an Array", sap.apf.core.constants.message.code.errorCheckConfiguration);
		for( var i in aRepresentationTypes) {
			loadRepresentationType(aRepresentationTypes[i]);
		}
	};
	var loadRepresentationType = function(oRepresentationTypeConfig) {
        var representationConstructorCandidate;
		if (oRepresentationTypeConfig.type === undefined) {
			oRepresentationTypeConfig.type = "representationType";
		}
        representationConstructorCandidate = sap.apf.utils.extractFunctionFromModulePathString(oRepresentationTypeConfig.constructor);
        if(!jQuery.isFunction(representationConstructorCandidate)) {
            oInject.messageHandler.putMessage(oInject.messageHandler.createMessageObject({code : '5030', parameters : [oRepresentationTypeConfig.id]}));
        }
		setItem(oRepresentationTypeConfig);
	};
	var loadFacetFilters = function(aFacetFilters) {
		oInject.messageHandler.check(aFacetFilters !== undefined && aFacetFilters instanceof Array !== false, "Facet filter configuration is missing or not an Array", sap.apf.core.constants.message.code.errorCheckConfiguration);
		for( var i in aFacetFilters) {
			loadFacetFilter.call(this, aFacetFilters[i]);
		}
	};
	var loadFacetFilter = function(oFacetFilter) {
		if (oFacetFilter.type === undefined) {
			oFacetFilter.type = "facetFilter";
		}
		this.addObject(oFacetFilter);
	};
	var loadCategory = function(oCategoryConfig) {
		if (oCategoryConfig.type === undefined) {
			oCategoryConfig.type = "category";
		}
		setItem(oCategoryConfig);
	};
	var loadPredefinedRepresentationTypes = function(aRepresentationTypes){
		loadRepresentationTypes(aRepresentationTypes);
	};
	/**
	 * @private
	 * @class Step templates are runtime objects, which contain analysis step information based on the analytical content configuration.
     * @name sap.apf.core.configurationFactory~StepTemplate
	 */
	var StepTemplate = function(oStepConfig, oFactory) {
		var oStepTemplate = jQuery.extend(true, {}, oStepConfig);
		var aRepresentationInfo = getRepresentationInfo(oStepConfig, oFactory);
		delete oStepTemplate.request;
		delete oStepTemplate.binding;
		delete oStepTemplate.thumbnail;
		delete oStepTemplate.longTitle;
		/**
		 * @memberOf StepTemplate
		 * @description Contains 'stepTemplate'
		 * @returns {string}
		 */
		oStepTemplate.type = "stepTemplate";
		
		/**
         * @private
         * @function
		 * @memberOf sap.apf.core.configurationFactory~StepTemplate
         * @name sap.apf.core.configurationFactory~StepTemplate#isForInitialStep
		 * @description Returns true if category of step configuration equals 'initial'
		 * @returns {boolean}
		 */
		oStepTemplate.isForInitialStep = function() {
			return (oStepTemplate.categories[0].id === 'initial');
        };
        /**
         * @private
         * @function
         * @memberOf sap.apf.core.configurationFactory~StepTemplate
         * @name sap.apf.core.configurationFactory~StepTemplate#getRepresentationInfo
         * @description Returns all representation information that is configured for the step.
         * @returns {object[]}
         */
        oStepTemplate.getRepresentationInfo = function() {
			var aReprInfo = jQuery.extend(true, [], aRepresentationInfo); // clone deep
			for( var i = 0; i < aReprInfo.length; i++) {
				delete aReprInfo[i].id;
				delete aReprInfo[i].type;
				delete aReprInfo[i].constructor;
			}
			return aReprInfo;
		};
		function getRepresentationInfo(oStepConfig, oConfigurationFactory) {
			var aRepresentations;
			var aRepresentationInfo = [];
			if (oStepConfig.binding) {
				aRepresentations = getRepresentations(oStepConfig, oConfigurationFactory);
				for( var i = 0; i < aRepresentations.length; i++) {
					var oRepresentationType = jQuery.extend(true, {}, oConfigurationFactory.getConfigurationById(aRepresentations[i].representationTypeId));
					oRepresentationType.representationId = aRepresentations[i].id;
					oRepresentationType.representationLabel = aRepresentations[i].label;
					aRepresentationInfo.push(oRepresentationType);
				}
				return aRepresentationInfo;
			} else {
				oInject.messageHandler.check(false, 'Step with ID "' + oStepConfig.id + '" does not contain any binding references.', sap.apf.core.constants.message.code.errorCheckConfigurationWarning);
			}
		}
		function getRepresentations(oStepConfig, oConfigurationFactory) {
			var aRepresentations = oConfigurationFactory.getConfigurationById(oStepConfig.binding).representations;
			if (aRepresentations) {
				return aRepresentations;
			} else {
				oInject.messageHandler.check(false, 'Binding of step with ID "' + oStepConfig.id + '" does not contain any representations.', sap.apf.core.constants.message.code.errorCheckConfigurationWarning);
			}
		}
		return oStepTemplate;
	};
	// Private Func
	// Constructor functions
	var Category = function(oCategoryConfig) {
		this.type = oCategoryConfig.type;
		this.id = oCategoryConfig.id;
		this.label = oCategoryConfig.label;
		return this;
	};
	var Thumbnail = function(oThumbnailConfig, oFactory) { // oFactory needed when accessing object of configurationFactory!
		this.type = "thumbnail";
		if (oThumbnailConfig === undefined) {
			return this;
		}
		this.leftUpper = oFactory.createLabel(oThumbnailConfig.leftUpper);
		this.rightUpper = oFactory.createLabel(oThumbnailConfig.rightUpper);
		this.leftLower = oFactory.createLabel(oThumbnailConfig.leftLower);
		this.rightLower = oFactory.createLabel(oThumbnailConfig.rightLower);
		this.altTitle = oFactory.createLabel(oThumbnailConfig.altTitle);
		return this;
	};
	/**
     * @private
	 * @description Creates and returns a new thumbnail object.
	 * @param oThumbnailConfig
	 * @return Object
	 */
	this.createThumbnail = function(oThumbnailConfig) {
		return new Thumbnail(oThumbnailConfig, this);
	};
	var Label = function(oLabelConfig, oFactory) { // oFactory need when accessing object of configurationFactory !!!
		if (oLabelConfig === undefined) {
			return undefined;
		}
		this.type = "label";
		this.kind = oLabelConfig.kind;
		if (this.kind === "text") {
			this.file = oLabelConfig.file;
			this.key = oLabelConfig.key;
		} else if (this.kind === "property") {
			this.property = oLabelConfig.property;
		} else if (this.kind === "sapLabel") {
			this.labelOf = oLabelConfig.labelOf;
		} else {
			return undefined;
		}
		return this;
	};
	/**
     * @private
	 * @param oLabelConfig
	 * @return New Object of type Label
	 */
	this.createLabel = function(oLabelConfig) {
		return new Label(oLabelConfig, this);
	};
	// Public Func
    /**
     * @private
     * @description Loads all properties of the input configuration object, which can also include custom error texts.
     * @param oConfiguration configuration object
     * @returns undefined
     */
	this.loadConfig = function(oConfiguration) {
        idRegistry = new sap.apf.utils.Hashtable(oInject.messageHandler);
        var aRepresentationTypes = sap.apf.core.representationTypes();
        loadPredefinedRepresentationTypes(aRepresentationTypes);
        loadSteps(oConfiguration.steps);
		loadRequests(oConfiguration.requests);
		loadBindings(oConfiguration.bindings);
		loadCategories(oConfiguration.categories);
		if (oConfiguration.representationTypes) {
			loadRepresentationTypes(oConfiguration.representationTypes);	
		}	
		if (oConfiguration.facetFilters) {
			loadFacetFilters.call(this, oConfiguration.facetFilters);
		}
	};
	/**
     * @private
	 * @description Adds an object to the configuration factory
	 * @param {object} configurationObject - Must contain valid values for 'type'-property and 'id'.
     * Further properties are type specific.
     * @returns undefined
	 */
	this.addObject = function(configurationObject) {
        if(!(configurationObject.type in sap.apf.core.constants.configurationObjectTypes)){
            oInject.messageHandler.putMessage(oInject.messageHandler.createMessageObject({
                code: "5033",
                aParams: [configurationObject.type]
            }));
        }
        if(!(configurationObject.property)){
            oInject.messageHandler.putMessage(oInject.messageHandler.createMessageObject({
                code: "5034"
            }));
        }
		idRegistry.setItem(configurationObject.id, configurationObject);
	};
	/**
     * @private
	 * @description Returns a reference of a configuration object. Not a copy.
	 * @param sId
	 * @returns Object
	 */
	this.getConfigurationById = function(sId) {
		return idRegistry.getItem(sId);
	};

	/**
     * @private
	 * @description Returns true, if configuration object exists.
	 * @param sId
	 * @returns {boolean}
	 */
	this.existsConfiguration = function(sId) {
		return idRegistry.hasItem(sId);
	};
	
	/**
     * @private
	 * @description Returns service documents
	 * @returns {Array}
	 */
	this.getServiceDocuments = function() {
		var aRequestItems = getItemsByType("request");
		var aServiceDocuments = [];
		for(var oRequest in aRequestItems) {
			aServiceDocuments.push(aRequestItems[oRequest].service);
		}
		aServiceDocuments = sap.apf.utils.eliminateDuplicatesInArray(oInject.messageHandler, aServiceDocuments);
		return aServiceDocuments;
	};	
	
	/**
     * @private
	 * @description Returns new step templates created from all step configuration objects, containing static information only. Note that a step config object is used to create an object of type stepTempate as well as a runtime object of type step.
	 * @returns Array of objects
	 */
	this.getStepTemplates = function() {
		var aItems = getItemsByType("step");
		var aStepTemplates = [];
		for( var stepConfig in aItems) {
			aStepTemplates[stepConfig] = new StepTemplate(aItems[stepConfig], this);
		}
		return aStepTemplates;
	};
    /**
     * @private
     * @description Returns array of cloned facet filter configurations
     * @returns Array of objects
     */
    this.getFacetFilterConfigurations = function () {
        var facetFilters = getItemsByType("facetFilter");
        var resolvedFunction;
        facetFilters = jQuery.extend(true, [], facetFilters);
        for (var i = 0, len = facetFilters.length; i < len; i++) {
            if (facetFilters[i].preselectionFunction) {
                resolvedFunction = sap.apf.utils.extractFunctionFromModulePathString(facetFilters[i].preselectionFunction);
                if (!jQuery.isFunction(resolvedFunction)) {
                      oInject.messageHandler.putMessage(oInject.messageHandler.createMessageObject({code: '5035', parameters: [facetFilters[i].id]}));
                      facetFilters[i].preselectionFunction = undefined;
                } else {
                    facetFilters[i].preselectionFunction = resolvedFunction;
                }
            }
        }
        return facetFilters;
    };
	/**
     * @private
	 * @description Returns new category objects of all loaded category configuration objects.
	 * @returns Array
	 */
	this.getCategories = function() {
		var aItems = getItemsByType("category");
		var aCategories = [];
		for( var oCategoryConfig in aItems) {
			aCategories[oCategoryConfig] = new Category(aItems[oCategoryConfig]);
		}
		return aCategories;
	};
	/**
     * @private
	 * @description Creates and returns a new step object from its specified configuration object. Creates an initial step if the configuration object specifies so.
	 * @param sStepId Identifies the configuration object. If the step id is not known an error will be thrown.
	 * @returns Object
	 */
	this.createStep = function(sStepId) {
		var oStepConfig = this.getConfigurationById(sStepId);
		oInject.messageHandler.check((oStepConfig !== undefined && oStepConfig.type === "step"), "Error - referenced object is undefined or has not type step", sap.apf.core.constants.message.code.errorCheckConfiguration);
		oInject.messageHandler.check(sap.apf.core.Step !== undefined, "Step must be defined ", sap.apf.core.constants.message.code.errorCheckConfiguration);
		oInject.messageHandler.check(typeof sap.apf.core.Step === "function", "Step must be Ctor function");
		return new sap.apf.core.Step(oInject.messageHandler, oStepConfig, this);
	};
	/**
     * @private
	 * @description Creates and returns a new binding object, by the identified configuration object.
	 * @param sBindingId Identifies the configuration object. If the id is not known an error will be thrown.
	 * @param oTitle Short title, type label.
	 * @param oLongTitle Long title, type label.
	 * @returns {Object}
	 */
	this.createBinding = function(sBindingId, oTitle, oLongTitle) {
		var oBindingConfig = this.getConfigurationById(sBindingId);
		oInject.messageHandler.check((oBindingConfig !== undefined && oBindingConfig.type === "binding"), "Error - oBindingConfig is undefined or has not type binding", sap.apf.core.constants.message.code.errorCheckConfiguration);
		oBindingConfig.oTitle = oTitle;
		oBindingConfig.oLongTitle = oLongTitle;
		return new sap.apf.core.Binding(oInject, oBindingConfig, this);
	};
	/**
     * @private
	 * @description Creates and returns a new request object.
	 * @param {String|Object} - request Request id or request object. If the step id is not known an error will be thrown.
	 * @returns {Object}
	 */
	this.createRequest = function(request) {
		var oMessageObject;
		var oRequestConfig;
		if(typeof request === "string") {
			oRequestConfig = this.getConfigurationById(request);
			if (!(oRequestConfig !== undefined && oRequestConfig.type === "request")) {
				oMessageObject = oInject.messageHandler.createMessageObject({
					code : "5004",
					aParameters : [ request ]
				});
				oInject.messageHandler.putMessage(oMessageObject);
				return undefined;
			}
		} else {
			oRequestConfig = request;
			oInject.messageHandler.check(oRequestConfig.type && oRequestConfig.type === "request" 
				                      && oRequestConfig.service && oRequestConfig.entityType,
					                     'Wrong request configuration when creating a new request');
			if (!oRequestConfig.id) {
				oRequestConfig.id = getUniqueId();
				setItem(oRequestConfig);	
			}
			
		}
		
		return new sap.apf.core.Request(oInject, oRequestConfig);
	
		function getUniqueId() {
		    	var date = new Date();
			    var uniqueInteger = Math.random( ) * date.getTime();
				return uniqueInteger;
		    }
	};
};
