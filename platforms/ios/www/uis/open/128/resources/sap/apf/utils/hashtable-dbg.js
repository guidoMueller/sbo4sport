/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
 
/**
  * Hashtable
  */
jQuery.sap.declare('sap.apf.utils.hashtable');
/**
 * @class This function return an object of DataAccess with all properties as Constructor Function - this Class build URIs for ChipRequest-Instance
 */
sap.apf.utils.Hashtable = function (oMessageHandler, obj) {
	var nNumberOfItems = 0;
	var oItemHolder = {};

	/**
	 * @description type information
	 */
	this.type = "hashTable";

	/**
	 * @description add an object to the hash table with key and value
	 * @param key unique key
	 * @param value value of object
	 * @returns previous object 
	 */
	this.setItem = function (key, value) {
		var oPreviousValue;
		oMessageHandler.check((key !== undefined && key !== null), "sap.apf.utils.HashTable.setItem key undefined");
		oMessageHandler.check((value !== undefined && value !== null), "sap.apf.utils.HashTable.setItem value undefined");
		if (this.hasItem(key)) {
			oPreviousValue = oItemHolder[key];
		} else {
			nNumberOfItems++;
		}
		oItemHolder[key] = value;
		return oPreviousValue;
	};

	/**
	 * @descriptions returns the number of items in the hash table
	 * @returns {nNumber} number of items in hash table
	 */
	this.getNumberOfItems = function () {
		return nNumberOfItems;
	};
	/**
	 * @description get the value by the key
	 * @param key
	 * @returns hashed item or undefined
	 */
	this.getItem = function (key) {
		oMessageHandler.check((key !== undefined && key !== null), "sap.apf.utils.HashTable.getItem key undefined");
		return this.hasItem(key) ? oItemHolder[key] : undefined;
	};

	/**
	 * @description tests, whether the key exists in the hash table
	 * @param key
	 * @returns boolean
	 */
	this.hasItem = function (key) {
		oMessageHandler.check((key !== undefined && key !== null), "sap.apf.utils.HashTable.hasItem key undefined");
		return oItemHolder.hasOwnProperty(key);
	};

	/**
	 * @description removes an item from the hash table with given key
	 * @param key
	 * @returns removed item or otherwise undefined
	 */
	this.removeItem = function (key) {
		oMessageHandler.check((key !== undefined && key !== null), "sap.apf.utils.HashTable.removeItem key undefined");
		var oItemRemoved;
		if (this.hasItem(key)) {
			oItemRemoved = oItemHolder[key];
			nNumberOfItems--;
			delete oItemHolder[key];
			return oItemRemoved;
		} else {
			return undefined;
		}
	};

	/**
	 * @description returns all keys of the hash table
	 * @return array with keys
	 */
	this.getKeys = function () {
		var aKeys = [];
		for (var k in oItemHolder) {
			if (this.hasItem(k)) {
				aKeys.push(k);
			}
		}
		return aKeys;
	};

	/**
	 * @description applies a function on each item in the hash table
	 * @param fn is function to be applied with k and item as argument
	 */
	this.each = function (fn) {
		for (var k in oItemHolder) {
			if (this.hasItem(k)) {
				fn(k, oItemHolder[k]);
			}
		}
	};

	/**
	 * @descriptions deletes all key/value pairs of the hash table
	 */
	this.reset = function () {
		oItemHolder = {};
		nNumberOfItems = 0;
	};
};
