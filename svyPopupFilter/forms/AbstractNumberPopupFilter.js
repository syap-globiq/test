/**
 * @protected
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"64A38280-61B3-4E05-8D5E-171030DDE1C3",variableType:8}
 */
var exactValue = 0;

/**
 * @protected
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"4324310F-1338-4611-B55A-A1B392137582",variableType:8}
 */
var minValue = 0;

/**
 * @protected
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"DC73D0DD-6E60-4B5F-B1B8-594B002524FC",variableType:8}
 */
var maxValue = 0;

/**
 * @protected
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"87DA31B7-91F3-4694-A72D-D18527803647",variableType:8}
 */
var between1 = 0;

/**
 * @protected 
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"E5DD7D6F-B33D-4499-B4B2-82B1BDBE3385",variableType:8}
 */
var between2 = 0;

/**
 * @protected 
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"CB21CCB8-503D-4506-9B20-B4528756E4DD"}
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
 * @properties={typeid:24,uuid:"5AD8EFD8-E67C-416F-A3FF-FA7B5D451606"}
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
 * @properties={typeid:24,uuid:"1FC1203A-36F8-47B2-9CBF-D2DE967DC894"}
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
