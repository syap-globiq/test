/**
 * @protected
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"07A5A231-5297-466A-A2C4-AFDDD1A16AB6",variableType:4}
 */
var value = 0;

/**
 * @protected 
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"43A55C90-E2E3-443E-AACD-66A7BDCD88AE"}
 * @override
 */
function onLoad(event) {
	_super.onLoad(event);
	
	// default operator to equals or ^||equals if value = 0
	if (value) {
		operator = scopes.svyPopupFilter.OPERATOR.EQUALS;
	} else {
		operator = scopes.svyPopupFilter.OPERATOR.EQUALS_OR_NULL;
	}
}

/**
 * @protected 
 * @param {Array} selectedValues
 *
 * @properties={typeid:24,uuid:"85C521E3-96EE-44C5-AE82-EE5E9C3344BE"}
 * @override
 */
function setSelectedFilterValues(selectedValues) {
	
	// set the value, should be 0 or 1
	if (selectedValues && selectedValues.length) {
		value = selectedValues[0] ? 1 : 0;
	} else {
		value = 0;
	}
	
	// default operator to equals
	if (value) {
		operator = scopes.svyPopupFilter.OPERATOR.EQUALS;
	} else {
		operator = scopes.svyPopupFilter.OPERATOR.EQUALS_OR_NULL;
	}
}

/**
 * @protected
 * @properties={typeid:24,uuid:"A6082CF3-89FC-4E09-A435-3662393DC3A0"}
 * 
 * @return {Array}
 * @override
 */
function getSelectedFilterValues() {
	// returned value should be 0 or 1
	return value ? [1] : [0];
}
