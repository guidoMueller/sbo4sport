/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */

jQuery.sap.declare('sap.apf.core.utils.filterTerm');
jQuery.sap.require('sap.apf.utils.utils');

/**
 * @private
 * @class This class implements a simple term in a filter in the form (property,
 *        operator, value). It is used by sap.apf.core.utils.Filter.
 * @param {sap.apf.core.MessageHandler} oMsgHandler
 * @param {string} sProperty This is the property of the term. Property is property
 *            in wording of oData and corresponds to a field name of an xs odata
 *            view, if apf runs against hana or gateway
 * @param {string} sOperator is the operator. Operator must be a value of
 *            {sap.apf.core.constants.FilterOperators}.
 * @param {string|number|boolean|Date} value Some constant value like 1000 or 'Jan'.
 * @param {string|number|boolean|Date} highvalue required, if operator is BT.
 * @returns {sap.apf.core.utils.FilterTerm}
 */
sap.apf.core.utils.FilterTerm = function (oMsgHandler, sProperty, sOperator, value, highvalue) {
    this.type = "filterTerm";
    var op = sOperator;
    var val = value; // value can be string or number

    if (op.length == 2) {
        op = op.toUpperCase();
    }
    // do some checks
    oMsgHandler.check((op !== undefined),
        "sap.apf.utils.FilterTerm.constructor op undefined");

    oMsgHandler.check(
        (jQuery.inArray(op, sap.apf.core.constants.aSelectOpt) > -1),
            "sap.apf.core.utils.FilterTerm op " + op + " not supported");
    oMsgHandler.check((sProperty !== undefined),
        "sap.apf.utils.core.FilterTerm sProperty undefined");
    oMsgHandler.check((val !== undefined),
        "sap.apf.utils.FilterTerm value undefined");

    /**
     * @description Boolean test, whether parameter val is contained in the
     *              filter term for property. This is a helper function of the
     *              contains method.
     * @param {string} property The property of the value.
     * @param {string|number|boolean|Date} val Value, that shall be contained.
     * @returns {boolean} bContained Returns true, if the value is contained,
     *          otherwise false. If the property differs, then true is returned,
     *          because the filter term holds no restriction on the property.
     */
    var containsSingleValue = function (property, val) {
        var v, len;

        if (property !== sProperty) {
            return true;
        }
        if (op === sap.apf.core.constants.FilterOperators.EQ) {
            if (value instanceof Date && val instanceof Date) {
                if (value.valueOf() === val.valueOf()) {
                    return true;
                } else {
                    return false;
                }
            }
            if (value === val) {
                return true;
            } else {
                return false;
            }
        } else if (op === sap.apf.core.constants.FilterOperators.LT) {
            if (value instanceof Date && val instanceof Date) {
                if (value.valueOf() > val.valueOf()) {
                    return true;
                } else {
                    return false;
                }
            }
            if (value > val) {
                return true;
            } else {
                return false;
            }
        } else if (op === sap.apf.core.constants.FilterOperators.LE) {
            if (value instanceof Date && val instanceof Date) {
                if (value.valueOf() >= val.valueOf()) {
                    return true;
                } else {
                    return false;
                }
            }

            if (value >= val) {
                return true;
            } else {
                return false;
            }
        } else if (op === sap.apf.core.constants.FilterOperators.GT) {
            if (value instanceof Date && val instanceof Date) {
                if (value.valueOf() < val.valueOf()) {
                    return true;
                } else {
                    return false;
                }
            }
            if (value < val) {
                return true;
            } else {
                return false;
            }
        } else if (op === sap.apf.core.constants.FilterOperators.BT) {
            if (value instanceof Date && val instanceof Date) {
                if (value.valueOf() <= val.valueOf() && val.valueOf() <= highvalue.valueOf()) {
                    return true;
                } else {
                    return false;
                }
            }

            if (value <= val && val <= highvalue) {
                return true;
            } else {
                return false;
            }
        } else if (op === sap.apf.core.constants.FilterOperators.GE) {
            if (value instanceof Date && val instanceof Date) {
                if (value.valueOf() <= val.valueOf()) {
                    return true;
                } else {
                    return false;
                }
            }
            if (value <= val) {
                return true;
            } else {
                return false;
            }
        } else if (op === sap.apf.core.constants.FilterOperators.NE) {
            if (value instanceof Date && val instanceof Date) {
                if (value.valueOf() === val.valueOf()) {
                    return false;
                } else {
                    return true;
                }
            }
            if (value === val) {
                return false;
            } else {
                return true;
            }
        } else if (op === sap.apf.core.constants.FilterOperators.StartsWith) {
            len = value.length;
            if (len > val.length) {
                return false;
            }
            v = val.slice(0, len);
            if (v === value) {
                return true;
            } else {
                return false;
            }
        } else if (op === sap.apf.core.constants.FilterOperators.EndsWith) {
            len = value.length;
            if (len > val.length) {
                return false;
            }
            v = val.slice(-len);
            if (v === value) {
                return true;
            } else {
                return false;
            }

        } else if (op === sap.apf.core.constants.FilterOperators.Contains) {
            var index = val.indexOf(value);
            if (index > -1) {
                return true;
            } else {
                return false;
            }
        }
    };
    /**
     * @description The method checks, whether value is contained in the logical
     *              expression for given property.
     * @param {string|string[]} property The property is either a single property or an array
     *            of properties.
     * @param {string|number|boolean|Date} val The value is either a single value or an array in json
     *            format with property : value pairs.
     */
    this.contains = function (property, val) {
        var i = 0;
        if (property instanceof Array) {
            for (i = 0; i < property.length; i++) {
                if (property[i] === sProperty) {
                    return containsSingleValue(property[i], val[property[i]]);
                }
            }
            return true; // not restricted to property
        } else {
            return containsSingleValue(property, val);
        }
    };

    /**
     * @description Transforms the object into a string, that can be used in the
     *              filter part of an odata request.
     * @param {object} conf Configuration for returning the result.
     * @param {boolean} [conf.asFilterArray] If an array with single lines for each
     *            property has to be returned.
     * @param conf.formatValue callback function for correct rendering of the value. The callback function is called with
     * property and value.
     */
    this.toUrlParam = function (conf) {
        var strDelimiter = "'";
        var spaceCharacter = " ";
        var param = "";
        var aParam = [];
        var value, hvalue;


        if (conf && conf.formatValue) {
            value = conf.formatValue(sProperty, val);
            if (highvalue) {
                hvalue = conf.formatValue(sProperty, highvalue);
            }
        } else {

            if (typeof val === 'number') {
                value = val;
            } else {
                value = strDelimiter + sap.apf.utils.escapeOdata(val) + strDelimiter;
            }
            if (highvalue) {
                if (typeof val === 'number') {
                    hvalue = highvalue;
                } else {
                    hvalue = strDelimiter + sap.apf.utils.escapeOdata(highvalue) + strDelimiter;
                }
            }
        }
        if (op === sap.apf.core.constants.FilterOperators.StartsWith) {
            param = 'startswith(' + sap.apf.utils.escapeOdata(sProperty) + ',' + value + ')';
            param = jQuery.sap.encodeURL(param);
        } else if (op === sap.apf.core.constants.FilterOperators.EndsWith) {
            param = 'endswith(' + sap.apf.utils.escapeOdata(sProperty) + ',' + value + ')';
            param = jQuery.sap.encodeURL(param);
        } else if (op === sap.apf.core.constants.FilterOperators.Contains) {
            // substringof is odata 2.0, and contains will be odata 4.0
            param = 'substringof(' + value + ','
                + sap.apf.utils.escapeOdata(sProperty) + ')';
            param = jQuery.sap.encodeURL(param);
        } else if (op === sap.apf.core.constants.FilterOperators.BT) {
            param = '(('
                + jQuery.sap.encodeURL(sap.apf.utils.escapeOdata(sProperty)
                    + spaceCharacter + "ge" + spaceCharacter + value)
                + ')'
                + jQuery.sap.encodeURL(spaceCharacter + 'and'
                    + spaceCharacter)
                + '('
                + jQuery.sap.encodeURL(sap.apf.utils.escapeOdata(sProperty)
                    + spaceCharacter + "le" + spaceCharacter + hvalue)
                + '))';
        } else {
            param = '('
                + jQuery.sap.encodeURL(sap.apf.utils.escapeOdata(sProperty)
                    + spaceCharacter + op.toLowerCase()
                    + spaceCharacter + value) + ')';
        }
        if (conf && conf.asFilterArray === true) {
            aParam.push(param);
            return aParam;
        } else {
            return param;
        }
    };
    /**
     * @description Returns the property.
     * @returns {string} property
     */
    this.getProperty = function () {
        return sProperty;
    };
    /**
     * @description Returns the operator.
     * @returns {string} op
     */
    this.getOp = function () {
        return op;
    };

    /**
     * @description Returns the value.
     * @returns {string|number|boolean} value
     */
    this.getValue = function () {
        return val;
    };

    /**
     * @description Returns the high value (.
     * @returns {string|number|boolean} value
     */
    this.getHighValue = function () {
        return highvalue;
    };
    /**
     * @description Returns the hash value of the filter term. The hash value is
     *              needed for simple comparison. The hash uniquely identifies a
     *              filter term.
     * @returns {number} hash value - Hash as int32
     */
    this.getHash = function () {
        var sString = sProperty + op + val;
        return sap.apf.utils.hashCode(sString);
    };

    /**
     * @description Copy constructor.
     * @returns {sap.apf.core.utils.FilterTerm} Fiterterm
     */
    this.copy = function () {
        return new sap.apf.core.utils.FilterTerm(oMsgHandler, sProperty, op,
            val, highvalue);
    };

    /**
     * @description This function either returns undefined, if the filter term
     *              is defined for the property or a copy of itself, if not.
     * @param {string|string[]} property This is either a property or an array of properties.
     *            If it is an array, then the test is done against each of the
     *            properties.
     * @returns {undefined|sap.apf.core.utils.FilterTerm} oFilterTerm Returns
     *          filter term or undefined, if the property equals the property of
     *          the filter term.
     */
    this.removeTermsByProperty = function (property) {
        var i = 0;
        var len = 0;
        if (property instanceof Array) {
            len = property.length;
            for (i = 0; i < len; i++) {
                if (sProperty === property[i]) {
                    return undefined;
                }
            }
            // not found - return copy
            return this.copy();
        } else {
            if (sProperty === property) {
                return undefined;
            } else {
                return this.copy();
            }
        }
    };

    /**
     * @description This function either returns undefined, if the filter term
     *              is defined for the property or a copy of itself, if not.
     * @param {string|string[]} property This is either a property or an array of properties.
     *            If it is an array, then the test is done against each of the
     *            properties.
     * @param {string} option option
     * @param {boolean|number|string} value Value of the expression.
     * @returns {sap.apf.core.utils.FilterTerm|undefined} oFilterTerm The filter
     *          term or undefined is returned, if the property equals the
     *          property of the filter term.
     */
    this.removeTerms = function (property, option, value) {
        var i = 0;
        var len = 0;
        if (property instanceof Array) {
            len = property.length;
            for (i = 0; i < len; i++) {
                if (sProperty === property[i] && op === option && val === value) {
                    return undefined;
                }
            }
            // not found - return copy
            return this.copy();
        } else {

            if (sProperty === property && op === option && val === value) {
                return undefined;
            } else {
                return this.copy();
            }
        }
    };

    /**
     * @description changes the property name to target property name, if
     *              property name = source property,
     * @param {object} aMapping the mapping directive has the form { source :
	 *            'sourceProp', target : 'targetProp' }
     * @returns undefined
     */
    this.mapProperties = function (aMapping) {

        var i;
        for (i = 0; i < aMapping.length; i++) {
            if (sProperty === aMapping[i].source) {
                sProperty = aMapping[i].target;
                return undefined;
            }
        }
        return undefined;
    };
};
