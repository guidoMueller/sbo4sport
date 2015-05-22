/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */

jQuery.sap.declare("sap.apf.core.metadata");
jQuery.sap.require("sap.apf.utils.utils");

/**
 * @class This class initializes the metadata and the annotations and merges them together. The class provides methods to access metadata information like parameters of an entity type and their
 *        data types.
 * @param {string} sAbsolutePathToServiceDocument Absolute Path to service document like "/sap/hba/apps/wca/s/odata/wca.xsodata"
 */
sap.apf.core.Metadata = function(oInject, sAbsolutePathToServiceDocument) {
	// Public vars
	/**
	 * @description Contains 'metadata'
	 * @returns {String}
	 */
	this.type = "metadata";
	// Private vars
    var oCoreApi = oInject.coreApi;
	var oMetadata;
	var oAnnotation;
	var aEntityTypes;
	var oHtPropertyMetadata = new oInject.hashtable(oInject.messageHandler);
	var oHtFilterableProperties = new oInject.hashtable(oInject.messageHandler);
	var oHtAllProperties = new oInject.hashtable(oInject.messageHandler);
	var oHtHanaViewParameters = new oInject.hashtable(oInject.messageHandler);
	var oHtEntityTypeMetadata = new oInject.hashtable(oInject.messageHandler);
	// Public functions
	/**
	 * @description Returns all metadata for the property of the provided entity type
	 * @param {String} sEntityType - identifier of the used OData entity type
	 * @param {String} sPropertyName - identifier of the used OData property
	 * @returns {Object} - metadata of the property
	 */
	this.getPropertyMetadata = function(sEntityType, sPropertyName) {
		oInject.messageHandler.check(sEntityType !== undefined && typeof sEntityType === "string", "sap.apf.core.Metadata:getPropertyMetadata incorrect EntityType name or type");
		oInject.messageHandler.check(sPropertyName !== undefined && typeof sPropertyName === "string", "sap.apf.core.Metadata:getPropertyMetadata incorrect sPropertyName name or type");
		if (oHtPropertyMetadata.hasItem(sEntityType + sPropertyName) === true) {
			return oHtPropertyMetadata.getItem(sEntityType + sPropertyName);
		} else {
			checkInternalObjectStructure();
			var oEntityTypeFromMetadata = getEntityTypeFromMetadata(sEntityType, true);
			var oEntityTypeFromAnnotation = getEntityTypeFromPropertyAnnotations(sEntityType, true);
			//if property is a HANA view parameter, then getEntityTypeFromMetadata with param 'false' has to be used
			if(oEntityTypeFromMetadata.property.length === 0){
				oEntityTypeFromMetadata = getEntityTypeFromMetadata(sEntityType, false);
				//TODO Applied workaround: 'type' needs to be removed from entitytype name to get annotations. Find better solution!
				oEntityTypeFromAnnotation = getEntityTypeFromPropertyAnnotations(sEntityType.substring(0, sEntityType.lastIndexOf("type")), false);
			}
			//TODO Applied workaround: 'resultstype' needs to be removed from entitytype name to get annotations. Find better solution!
			if(!oEntityTypeFromAnnotation[sPropertyName]){
				oEntityTypeFromAnnotation = getEntityTypeFromPropertyAnnotations(sEntityType.substring(0, sEntityType.lastIndexOf("resultstype")), true);
			}
			var oPropertyFromMetadata = getPropertyFromEntityTypeFromMetadata(oEntityTypeFromMetadata, sPropertyName);
			var oPropertyFromAnnotation = getPropertyFromEntityTypeFromAnnotation(oEntityTypeFromAnnotation, sPropertyName);
			var oMerged = mergeAnnotationWithMetadata(oPropertyFromAnnotation, oPropertyFromMetadata);
			oHtPropertyMetadata.setItem(sEntityType + sPropertyName, defineApiResult(oMerged));
			return oHtPropertyMetadata.getItem(sEntityType + sPropertyName);
		}
	};
	/**
	 * @description Returns names of all filterable properties of the provided entity type.
	 * @param {String} sEntityType - identifier of the used OData entity type
	 * @returns {Array} aResult - names of the filterable properties
	 */
	this.getFilterableProperties = function(sEntityType) {
		oInject.messageHandler.check(sEntityType !== undefined && typeof sEntityType === "string", "sap.apf.core.Metadata:getFilterableProperties incorrect EntityType name or type");
		if (oHtFilterableProperties.hasItem(sEntityType) === true) {
			return oHtFilterableProperties.getItem(sEntityType);
		} else {
			checkInternalObjectStructure();
			var aResult = [];
			var oEntityTypeFromMetadata = getEntityTypeFromMetadata(sEntityType, true);
			var oEntityTypeFromAnnotation = getEntityTypeFromPropertyAnnotations(sEntityType, true);
			for( var i = 0; i < oEntityTypeFromMetadata.property.length; i++) {
				var oPropertyFromMetadata = oEntityTypeFromMetadata.property[i];
				if (oPropertyFromMetadata.extensions && oPropertyFromMetadata.extensions) {
					var bFilterable = true;
					for( var j = 0; j < oPropertyFromMetadata.extensions.length; j++) {
						var oExtension = oPropertyFromMetadata.extensions[j];
						if (oExtension.name === "filterable" && oExtension.value === "false") {
							bFilterable = false;
							break;
						}
					}
					if (bFilterable) {
						aResult.push(oPropertyFromMetadata.name);
					}
				}
			}
			for( var oProperty in oEntityTypeFromAnnotation) {
				if (oEntityTypeFromAnnotation[oProperty] && oEntityTypeFromAnnotation[oProperty].filterable && oEntityTypeFromAnnotation[oProperty].filterable === "true") {
					aResult.push(oProperty);
				}
			}
			oHtFilterableProperties.setItem(sEntityType, aResult);
			return oHtFilterableProperties.getItem(sEntityType);
		}
	};
	/**
	 * @description Returns names of all properties (incl. parameters) for a given entity type.
	 * @param {String} sEntityType - identifier of the used OData entity type
	 * @returns {Array} aResult - property names
	 */
	this.getAllPropertiesFromEntityType = function(sEntityType){
		oInject.messageHandler.check(sEntityType !== undefined && typeof sEntityType === "string", "sap.apf.core.Metadata:getAllProperties incorrect EntityType name or type");
		if (oHtAllProperties.hasItem(sEntityType) === true) {
			return oHtAllProperties.getItem(sEntityType);
		} else {
			var aAllProperties = [];
			var aPropertyNames = [];
			var aParameterNames = [];
			
			var oEntityTypeFromMetadata = getEntityTypeFromMetadata(sEntityType, true);
			for(var i = 0; i < oEntityTypeFromMetadata.property.length; i++){
				aPropertyNames.push(oEntityTypeFromMetadata.property[i].name);
			}
			
			var aParameters = this.getHanaViewParameters(sEntityType);
			for(var i = 0; i < aParameters.length; i++){
				aParameterNames.push(aParameters[i].name);
			}
			
			aAllProperties = aPropertyNames.concat(aParameterNames);
			
			oHtAllProperties.setItem(sEntityType, aAllProperties);
			return oHtAllProperties.getItem(sEntityType);
		}
	};
	/**
	 * @description Returns names of all properties (incl. parameters) of all entity types. 
	 * @returns {Array} aResult - property names
	 */
	this.getAllProperties = function(){
		var aAllProperties = [];
		var aEntityTypes = getEntityTypes();
		
		for(var i = 0; i < aEntityTypes.length; i++){
			aAllProperties = aAllProperties.concat(this.getAllPropertiesFromEntityType(aEntityTypes[i]));
		}
		aAllProperties = sap.apf.utils.eliminateDuplicatesInArray(oInject.messageHandler, aAllProperties);

		return aAllProperties;
	};
	/**
	 * @description Returns names of all HANA view parameters of all entity types. 
	 * @returns {Array} aResult - parameter names
	 */
	this.getAllHanaViewParameters = function(){
		var aAllParameters = [];
		var aHanaViewParameters = [];
		var aEntityTypes = getEntityTypes();
		
		for(var i = 0; i < aEntityTypes.length; i++){
			aHanaViewParameters = this.getHanaViewParameters(aEntityTypes[i]);
			for(var j = 0; j < aHanaViewParameters.length; j++){
				aAllParameters.push(aHanaViewParameters[j].name);
			}
		}
		aAllParameters = sap.apf.utils.eliminateDuplicatesInArray(oInject.messageHandler, aAllParameters);

		return aAllParameters;
	};
	
	/**
	 * @description Returns names of all key properties of all entity types. 
	 * @returns {Array} aResult - key names
	 */
	this.getAllKeys = function(){
		var aAllKeys = [];
		var aKeys = [];
		var aEntityTypes = getEntityTypes();
		
		for(var i = 0; i < aEntityTypes.length; i++){
			var oEntityType = getEntityTypeFromMetadata(aEntityTypes[i], true);
			if(!oEntityType.name){
				oEntityType = getEntityTypeFromMetadata(aEntityTypes[i], false);
			}
			for(var j = 0; j < oEntityType.key.propertyRef.length; j++){
				aKeys.push(oEntityType.key.propertyRef[j].name);
			}
			aAllKeys =  aAllKeys.concat(aKeys);
		}
		aAllKeys = sap.apf.utils.eliminateDuplicatesInArray(oInject.messageHandler, aAllKeys);
		return aAllKeys;
	};
	

	/**
	 * @description Returns all metadata attributes for a given property. It
	 *              will be searched over all entity types for this property
	 *              and the first match will be returned.
	 * @param {String}
	 *            sPropertyName - identifier of the used OData property
	 * @returns {Object} - Object with attributes of the property
	 */
	this.getAttributes = function(sPropertyName){
		var aEntityTypes = getEntityTypes();
		var oPropertyAttributes;
		for(var i = 0; i < aEntityTypes.length; i++){
			oPropertyAttributes = this.getPropertyMetadata(aEntityTypes[i], sPropertyName);
			if(oPropertyAttributes.name){
				break;
			}
		}
		return oPropertyAttributes;
	};
	/**
	 * @description Returns metadata which includes HANA view parameters and their attributes (data type, default value, ...) for the provided entity type.
	 * @param {String} sEntityType - identifier of the used OData entity type
	 * @returns {Array} or {undefined} - parameters of the entity type
	 */
	this.getHanaViewParameters = function(sEntityType) {
		oInject.messageHandler.check(sEntityType !== undefined && typeof sEntityType === "string", "sap.apf.core.Metadata:getHanaViewParameters incorrect EntityType name or type");
		if (oHtHanaViewParameters.hasItem(sEntityType) === true) {
			return oHtHanaViewParameters.getItem(sEntityType);
		} else {
			checkInternalObjectStructure();
			var oEntityTypeFromMetadata = getEntityTypeFromMetadata(sEntityType, false);
			var oEntityTypeFromAnnotation = getEntityTypeFromPropertyAnnotations(sEntityType, false);
			var oMerged = {};
			var aResult = [];
			for( var i = 0; i < oEntityTypeFromMetadata.property.length; i++) {
				var oProperty = oEntityTypeFromMetadata.property[i];
				var oPropertyAnnotation = oEntityTypeFromAnnotation[oProperty.name];
				if (oPropertyAnnotation !== undefined) {
					oProperty = jQuery.extend(oProperty, oPropertyAnnotation);
				}
				oMerged[oProperty.name] = oProperty;
			}
			for( var oProp in oMerged) {
				aResult.push(defineApiResult(oMerged[oProp]));
			}
			oHtHanaViewParameters.setItem(sEntityType, aResult);
			return oHtHanaViewParameters.getItem(sEntityType);
		}
	};
	/**
	 * @description Returns metadata which includes extensions for OData 4.0 like "RequiresFilter"
	 * @param {String} sEntityType - identifier of the used OData entity type
	 * @returns {Array} - metadata (including annotations) of the entity type
	 */
	this.getEntityTypeMetadata = function(sEntityType) {
		oInject.messageHandler.check(sEntityType !== undefined && typeof sEntityType === "string", "sap.apf.core.Metadata:getEntityTypeMetadata incorrect EntityType name or type");
		if (oHtEntityTypeMetadata.hasItem(sEntityType) === true) {
			return oHtEntityTypeMetadata.getItem(sEntityType);
		} else {
			checkInternalObjectStructure();
			var oEntityType = getEntityTypeFromAnnotation(sEntityType);
			var object = {};
			for( var oAnnotation in oEntityType) {
				var sAnnotationName = oAnnotation.split(".").pop();
				sAnnotationName = sAnnotationName.replace(/^./, sAnnotationName[0].toLowerCase());
				for (var shape in oEntityType[oAnnotation]) {
					object[sAnnotationName] = oEntityType[oAnnotation][shape];
				}
			}
			oHtEntityTypeMetadata.setItem(sEntityType, object);
			return oHtEntityTypeMetadata.getItem(sEntityType);
		}
	};
	/**
	 * @description Returns the suffix after the parameter position in the URI generation
	 * @param {String} sEntityType - entity type from configuration
	 * @returns {String} - parameter suffix for URI
	 */
	this.getUriSuffix = function(sEntityType) {
		var oMetaData = getEntityTypeFromMetadata(sEntityType+"Results",true); 
		if(oMetaData && oMetaData.property && oMetaData.property.length > 0){ 
			return "Results"; 
		}  
		else { 
			return "";
		}
	}
	// Private functions
	function getEntityTypes() {
		if(!aEntityTypes){
			aEntityTypes = [];
			for(var i = 0; i < oMetadata.dataServices.schema.length; i++){
				for(var j = 0;  j < oMetadata.dataServices.schema[i].entityType.length; j++){
					aEntityTypes.push(oMetadata.dataServices.schema[i].entityType[j].name.toLowerCase());
				}
			}
		}
		return aEntityTypes;
	}
	function getEntityTypeFromAnnotation(sEntityType) {
		for( var oEntityTypeAnnotations in oAnnotation) {
			if (oEntityTypeAnnotations.split(".").pop().toString().toLowerCase().indexOf(sEntityType.toLowerCase()) > -1) {
				return oAnnotation[oEntityTypeAnnotations];
			}
		}
		return {};
	}
	function getEntityTypeFromPropertyAnnotations(sEntityType, bAggregate) {
		for( var oEntityTypeAnnotations in oAnnotation.propertyAnnotations) {
			if (bAggregate) {
				if (oEntityTypeAnnotations.split(".").pop().toString().toLowerCase().indexOf((sEntityType + "ResultsType").toLowerCase()) > -1) {
					return oAnnotation.propertyAnnotations[oEntityTypeAnnotations];
				}
			} else {
				if (oEntityTypeAnnotations.split(".").pop().toString().toLowerCase().indexOf((sEntityType + "Type").toLowerCase()) > -1) {
					return oAnnotation.propertyAnnotations[oEntityTypeAnnotations];
				}
			}
		}
		return {};
	}
	function getEntityTypeFromMetadata(sEntityType, bAggregate) {
		for( var i = 0; i < oMetadata.dataServices.schema.length; i++) {
			for( var j = 0; j < oMetadata.dataServices.schema[i].entityType.length; j++) {
				var aAttribute = oMetadata.dataServices.schema[i].entityType[j].extensions;
				if (oMetadata.dataServices.schema[i].entityType[j].name.toLowerCase().indexOf(sEntityType.toLowerCase()) > -1) {
					if (bAggregate) {
						for( var k = 0; k < aAttribute.length; k++) {
							if (aAttribute[k].name.toLowerCase() === "semantics" && aAttribute[k].value.toLowerCase() === "aggregate") {
								return oMetadata.dataServices.schema[i].entityType[j];
							}
						}
					} else {
						for( var l = 0; l < aAttribute.length; l++) {
							if (aAttribute[l].name.toLowerCase() === "semantics" && aAttribute[l].value.toLowerCase() === "parameters") {
								return oMetadata.dataServices.schema[i].entityType[j];
							}
						}
					}
				}
			}
		}
		return {
			property : []
		};
	}
	function getPropertyFromEntityTypeFromMetadata(oEntityTypeFromMetadata, sPropertyName) {
		for( var i = 0; i < oEntityTypeFromMetadata.property.length; i++) {
			if (oEntityTypeFromMetadata.property[i].name.toLowerCase() === sPropertyName.toLowerCase()) {
				return oEntityTypeFromMetadata.property[i];
			}
		}
		return {};
	}
	function getPropertyFromEntityTypeFromAnnotation(oEntityTypeFromAnnotation, sPropertyName) {
		for( var oProperty in oEntityTypeFromAnnotation) {
			if (oProperty.toLowerCase() === sPropertyName.toLowerCase()) {
				return oEntityTypeFromAnnotation[oProperty];
			}
		}
		return {};
	}
	function mergeAnnotationWithMetadata(oFirst, oSecond) {
		for( var i in oSecond) {
			oFirst[i] = oSecond[i];
		}
		return oFirst;
	}
	function defineApiResult(object) {
		function moveToDataType(sAlternativeName) {
			if (!object.dataType) {
				object.dataType = {};
			}
			if (sAlternativeName) {
				object.dataType[sAlternativeName] = object[i];
			} else {
				object.dataType[i] = object[i];
			}
			delete object[i];
		}
		function map(sAlternativeName) {
			if (jQuery.isArray(object[i]) === true) {
				for( var j = 0; j < object[i].length; j++) {
					object[object[i][j].name] = object[i][j].value;
				}
				delete object[i];
			} else if (i !== "dataType" && typeof (object[i]) === "object") { // dataType is explicit set by the APF has not to be modified
				if (Object.keys(object[i]).length === 0) {
					object[sAlternativeName] = "true";
				}
				for( var k in object[i]) {
					object[sAlternativeName] = object[i][k];
				}
				delete object[i];
			} else {
				object[sAlternativeName] = object[i];
			}
		}
		for( var i in object) {
			switch (i) {
				case 'type':
					moveToDataType();
					break;
				case 'maxLength':
					moveToDataType();
					break;
				case 'precision':
					moveToDataType();
					break;
				default:
					var sPropertyName = i.split(".").pop();
					if (sPropertyName.search("ISO") === 0) {
						map(sPropertyName);
					} else {
						map(sPropertyName.replace(/^./, sPropertyName[0].toLowerCase()));
					}
					break;
			}
		}
		return object;
	}
	function checkInternalObjectStructure() {
		oInject.messageHandler.check(oMetadata !== undefined, 'sap.apf.metadata - oMetadata is undefined');
		oInject.messageHandler.check(oMetadata.dataServices, 'sap.apf.metadata - oMetadata.dataServices is undefined');
		oInject.messageHandler.check(oMetadata.dataServices.schema !== undefined, 'sap.apf.metadata - oMetadata.dataServices.schema is undefined');
		oInject.messageHandler.check(oAnnotation !== undefined, 'sap.apf.metadata - oAnnotation is undefined');
	}
	function initMetadata() {
		function onResponse(oData, oResponse) {
			try {
				oMetadata = oData;
                var sAnnotationUri = oCoreApi.getUriGenerator().getODataPath(sAbsolutePathToServiceDocument) + "annotation.xml";
                oAnnotation = oInject.annotation.parse(oMetadata, sAnnotationUri);
			} catch (oError) {
				oInject.messageHandler.putMessage(oInject.messageHandler.createMessageObject({
					code : "5017",
					aParameters : [ oError.message ],
					oCallingObject : this
				}));
				oAnnotation = {}; //robustness!!
			}
		}
		function onError(oError) {
			
			if (oError.messageObject && oError.messageObject.type === "messageObject") {
				oInject.messageHandler.putMessage(oError.messageObject);
			} else {
				oInject.messageHandler.putMessage(oInject.messageHandler.createMessageObject({
					code : "5018",
					aParameters : [ oError.response.statusCode, oError.sMessage, oError.response.statusText, oError.response.requestUri ]
				}));
			}
			oAnnotation = {};  //robustness!!
		}
		var oRequest = {
			method : 'GET',
			headers : {
				"x-csrf-token" : oCoreApi.getXsrfToken(sAbsolutePathToServiceDocument)
			},
			requestUri : oCoreApi.getUriGenerator().getAbsolutePath(sAbsolutePathToServiceDocument) + "$metadata",
			async : false
		};
		oCoreApi.odataRequest(oRequest, onResponse, onError, oInject.datajs.metadataHandler);
	}
	initMetadata();
};