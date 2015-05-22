/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */

jQuery.sap.declare('sap.apf.utils.pathContextHandler');
jQuery.sap.require('sap.apf.utils.hashtable');

/**
 * @private
 * @class Path context handler
 * @description Provides methods that allow to manage the context that is used
 *              for each path update. The context consists of logical filter
 *              expressions that need to be applied for all OData server
 *              requests during update of an analysis path. Methods of this
 *              class allow partial updates of the overall context by components
 *              being responsible for partial concerns of the overall context.
 * @param {Object} functions Object containing functions to be used by path context
 *            handler.
 * @param {sap.apf.core.MessageHandler} msgHandler Message handler instance.
 * @name sap.apf.utils.PathContextHandler
 * @returns {sap.apf.utils.PathContextHandler}
 */
sap.apf.utils.PathContextHandler = function(functions, msgHandler) {
	var uniqueConsumerId = 1;
	var contextFragments = {};
    var initialContext;
	/**
	 * @private
	 * @function
	 * @name sap.apf.utils.PathContextHandler#add
	 * @description Adds a context fragment for a path context. Creates a unique
	 *              fragment and a corresponding identifier. Subsequent changes
	 *              need to be done by the update method providing the
	 *              identifier.
	 * @param {sap.apf.utils.Filter} filter
	 *            filter Requires a filter instance
	 * @returns {number} Unique numeric ID to be provided for later updates of the same
	 *          fragment. Consecutive numbers for the different unique IDs are not guaranteed.
	 */
	this.add = function(filter) {
		contextFragments[uniqueConsumerId] = filter;
		functions.setContext(combineFragments());
		return uniqueConsumerId++;
	};

	/**
	 * @private
	 * @function
	 * @name sap.apf.utils.PathContextHandler#update
	 * @description Updates a context fragment for the given identifier by fully
	 *              replacing the existing one.
	 * @param {id}
	 *            id Either requires numeric identifier of the context fragment that was returned by
	 *            add method or requires an external identifier of type string that has to be determined by the consumer.
	 *            When using identifiers of type string the add method must not be used. Update is sufficient.
	 *            It either overwrites an existing context fragment for the identifier or creates a new one. 
	 * @param {sap.apf.utils.Filter}
	 *            filter Requires a filter instance
	 */
	this.update = function(id, filter) {
		if(id && typeof id == 'number') {
		    msgHandler.check((id > 0 && id < uniqueConsumerId),'Passed unknown numeric identifier during update of path context handler');
            if(!(id > 0 && id < uniqueConsumerId)) {
                return;
            }
		} else if(!id || typeof id != 'string') {
		    msgHandler.check(id,'Passed falsy dentifier during update of path context handler');
		    return;
		}
		contextFragments[id] = filter;
		functions.setContext(combineFragments());
	};

	/**
	 * @private
	 * @function
	 * @name sap.apf.utils.PathContextHandler#get
	 * @description Returns a context fragment for the given identifier
	 * @param {number|string} id Requires identifier of the context fragment. The id was returned by
	 *            the add method. 
	 * @returns {sap.apf.utils.Filter} Context assigned to identifier
	 */
	this.get = function(id) {
	    switch (typeof id) {
	    case 'number':
	        msgHandler.check((id > 0 && id < uniqueConsumerId),'Passed unknown numeric identifier during get from path context handler');
	        break;
	    case 'string':
	        msgHandler.check(contextFragments[id],'Passed unknown string identifier during get from path context handler');
	    }
		return contextFragments[id];
	};
	/**
	 * @private
	 * @function
	 * @name sap.apf.utils.PathContextHandler#getAllIds
	 * @description Returns the ids for all context fragments
	 * @returns [number|string] Ids for all context fragments
	 */
	this.getAllIds = function() {
		var aResultIds = [];
		for(property in contextFragments) {
		    if(contextFragments.hasOwnProperty(property)) {
                aResultIds.push(ifPossibleConvertToNumber(property));
            }
		}
		return aResultIds;
	};
	/**
	 * @private
	 * @function
	 * @name sap.apf.utils.PathContextHandler#serialize
	 * @description Serializes the content of the pathContextHandler.
	 * @returns {object} Serialized data as deep JS object
	 */
	this.serialize = function() {
		var serializableData = {};
		for(property in contextFragments) {
		    if(contextFragments.hasOwnProperty(property)) {
		        serializableData[property] = contextFragments[property].serialize();
		    }
		}
		return serializableData;
	};

	/**
	 * @private
	 * @function
	 * @name sap.apf.utils.PathContextHandler#deserialize
	 * @description Re-initializes path context context handler from serialized data.
	 * @param deserializableData
	 *            Serialized data used to re-initialize path context handler
	 * @returns {object} Re-initialize instance of sap.apf.utils.pathContextHandler
	 */
	this.deserialize = function(deserializableData) {
	    uniqueConsumerId = 1;
		contextFragments = {};
	      for(property in deserializableData) {
	            if(deserializableData.hasOwnProperty(property)) {
	                contextFragments[property] = new sap.apf.utils.Filter(msgHandler).deserialize(deserializableData[property]);
	                uniqueConsumerId++;
	            }
	      }
		return this;
	};
    /**
     * @private
     * @function
     * @name sap.apf.utils.PathContextHandler#saveInitialContext
     * @description Internally saves the current state of the filter fragments
     * @param {array} [ids]
     * If provided initial state will be selectively saved.
     * Only the filter fragments for the provided IDs are saved or updated as initial state.
     * If omitted, all filter current fragments are saved or updated as initial state.
     */
    this.saveInitialContext = function(ids) {
        var property,
            i,
            len;
        var initialContextBeforeSaveOrUpdate = {};
        var initialContextAfterSaveOrUpdate = {};
        if(ids) {
            for(property in initialContext) {
                if(initialContext.hasOwnProperty(property)) {
                    initialContextBeforeSaveOrUpdate[property] = new sap.apf.utils.Filter(msgHandler).deserialize(initialContext[property]);
                }
            }
            for(i = 0, len = ids.length; i < len; i++) {
                initialContextBeforeSaveOrUpdate[ids[i]] = contextFragments[ids[i]];
            }
            for(property in initialContextBeforeSaveOrUpdate){
                initialContextAfterSaveOrUpdate[property] = initialContextBeforeSaveOrUpdate[property].serialize();
            }
            initialContext = initialContextAfterSaveOrUpdate;
        } else {
            initialContext = this.serialize();
        }
    };
    /**
     * @private
     * @function
     * @name sap.apf.utils.PathContextHandler#restoreInitialContext
     * @description Internally restores a previously saved state of filter fragments.
     * If no initial state has been saved before the current filter fragments remain unchanged.
     * @param {array} [ids]
     * If provided initial state will be selectively restored.
     * Only the filter fragments for the provided IDs are restored.
     * If omitted, all filter fragments are restored to the state that has been saved as initial state.
     */
    this.restoreInitialContext = function(ids) {
        var fragmentsToBeKept = {};
        var property;
        if(initialContext) {
            if(ids) {
                for(property in contextFragments) {
                    if(ids.indexOf(ifPossibleConvertToNumber(property)) == -1) {
                        fragmentsToBeKept[property] = contextFragments[property];
                    }
                }
            }
            this.deserialize(initialContext);
            for(property in fragmentsToBeKept) {
                contextFragments[property] = fragmentsToBeKept[property];
            }
            functions.setContext(combineFragments());
        }
    };
	function combineFragments() {
	    var filterArray = [];
	    for(var filter in contextFragments) {
	        if(contextFragments.hasOwnProperty(filter)) {
	            filterArray.push(contextFragments[filter]);
	        }
	    }
	 return  new sap.apf.utils.Filter(msgHandler).intersectWith(filterArray);
	}
    function ifPossibleConvertToNumber(property) {
        if(isNaN(Number(property))) {
            return property;
        } else {
            return Number(property);
        }
    }
};