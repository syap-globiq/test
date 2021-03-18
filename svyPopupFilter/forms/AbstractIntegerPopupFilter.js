/**
 * @protected
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"D06A8BAA-64CC-4A5F-A268-418088DE3933",variableType:4}
 */
var exactValue = 0;

/**
 * @protected
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"B498F011-3CD5-4810-BB9E-C532725416F2",variableType:4}
 */
var minValue = 0;

/**
 * @protected
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"DFCDBE53-9265-4D15-8F50-89CD979C5C44",variableType:4}
 */
var maxValue = 0;

/**
 * @protected
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"390BB1B7-81A8-43AA-9D75-B9370C3EFA56",variableType:4}
 */
var between1 = 0;

/**
 * @protected 
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"2D997171-C7A5-4E51-AF2D-58C6569DD892",variableType:4}
 */
var between2 = 0;

/**
 * @protected 
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"F57C6AF7-1001-40C7-9BD3-D5B886C0D6C7"}
 * @override
 */
function onLoad(event) {
	_super.onLoad(event);
	
	// default operator to between
	operator = scopes.svyPopupFilter.OPERATOR.EQUALS;
}

/**
 * @protected 
 * @param {Array} selectedValues
 *
 * @properties={typeid:24,uuid:"5CF2F716-9360-4690-BB6E-BF682162319C"}
 * @override
 */
function setSelectedFilterValues(selectedValues) {
	if (selectedValues && selectedValues.length) {
		minValue = selectedValues[0];
		maxValue = selectedValues[1];
		between1 = selectedValues[0];
		between2 = selectedValues[1];
		exactValue = selectedValues[0];
	} else {
		exactValue = null;
		minValue = null;
		maxValue = null;
		between1 = null;
		between2 = null;
	}
}

/**
 * @protected
 * @return {Array}
 * @properties={typeid:24,uuid:"ED1DE8AD-B661-497D-94C7-1EF96575D3F9"}
 * @override
 */
function getSelectedFilterValues() {
	var OPERATOR = scopes.svyPopupFilter.OPERATOR;
	switch (operator) {
	case OPERATOR.EQUALS:
		return [exactValue];
	case OPERATOR.GREATER_THEN:
	case OPERATOR.GREATER_EQUAL:
		return [minValue];
	case OPERATOR.SMALLER_THEN:
	case OPERATOR.SMALLER_EQUAL:
		return [maxValue];
	case OPERATOR.BETWEEN:
		return [between1, between2];
	default:
		return [];
	}
}
