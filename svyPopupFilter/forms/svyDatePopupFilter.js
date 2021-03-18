/**
 * Handle changed data, return false if the value should not be accepted. In NGClient you can return also a (i18n) string, instead of false, which will be shown as a tooltip.
 *
 * @param {String} oldValue old value
 * @param {String} newValue new value
 * @param {JSEvent} event the event that triggered the action
 *
 * @return {Boolean}
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"5F50F324-FFA8-4B4B-9C78-F010DE4CC94F"}
 */
function onDataChange(oldValue, newValue, event) {
	updateUI();
	return true;
}

/**
 * @properties={typeid:24,uuid:"1AE71264-9439-48B2-947D-44A2C6F1DE27"}
 * @override
 */
function updateUI() {
	var OPERATOR = scopes.svyPopupFilter.OPERATOR;
	switch (operator) {
	case OPERATOR.EQUALS:
	case OPERATOR.GREATER_THEN:
	case OPERATOR.GREATER_EQUAL:
		elements.calendarDateFrom.enabled = true;
		elements.calendarDateTo.enabled = false;
		break;
	case OPERATOR.SMALLER_THEN:
	case OPERATOR.SMALLER_EQUAL:
		elements.calendarDateFrom.enabled = false;
		elements.calendarDateTo.enabled = true;
		break;
	case OPERATOR.BETWEEN:
		elements.calendarDateFrom.enabled = true;
		elements.calendarDateTo.enabled = true;
		break;
	default:
		break;
	}
}

/**
 * @protected 
 * @return {Array}
 * @properties={typeid:24,uuid:"A9F72B69-F4CD-4C0A-9272-BC30DE13C23F"}
 * @override
 */
function getSelectedFilterValues() {

	var OPERATOR = scopes.svyPopupFilter.OPERATOR;
	switch (operator) {
	case OPERATOR.EQUALS:
	case OPERATOR.GREATER_THEN:
	case OPERATOR.GREATER_EQUAL:
		if (dateFrom){
			return [scopes.svyDateUtils.toStartOfDay(dateFrom)];
		}
		else {
			return [];
		}	
	case OPERATOR.SMALLER_THEN:
	case OPERATOR.SMALLER_EQUAL:
		if (dateTo){
			return [scopes.svyDateUtils.toEndOfDay(dateTo)];
		}
		else {
			return [];
		}	
	case OPERATOR.BETWEEN:
		if (dateFrom && dateTo) {
			return [scopes.svyDateUtils.toStartOfDay(dateFrom), scopes.svyDateUtils.toEndOfDay(dateTo)];
		} else {
			// TODO should handle scenario where not selected !?
			return [];
		}
	
	default:
		return [];
	}
}

/**
 * @protected 
 * @override 
 * @return {Number}
 * @properties={typeid:24,uuid:"49D922DD-72BD-42A4-81B3-32CC58E46551"}
 */
function defaultWidth() {
	return 580;
}

/**
 * @param {JSEvent} event
 * @override
 *
 * @properties={typeid:24,uuid:"ECFE906A-F8FD-4469-AE71-AE4C6BF530C2"}
 */
function onLoad(event) {
	_super.onLoad(event);
	
	elements.faClose.imageStyleClass = scopes.svyPopupFilter.STYLING.CLOSE_ICON;
	
	scopes.svyPopupFilter.applyLocaleStrings(controller.getName(), 'svyDatePopupFilter');
	
	var valueListContent = databaseManager.createEmptyDataSet(0, 2);
	valueListContent.addRow([scopes.svyPopupFilter.LOCALE.svyDatePopupFilter.operator.EQUALS, scopes.svyPopupFilter.OPERATOR.EQUALS]);
	valueListContent.addRow([scopes.svyPopupFilter.LOCALE.svyDatePopupFilter.operator.SMALLER_EQUAL, scopes.svyPopupFilter.OPERATOR.SMALLER_EQUAL]);
	valueListContent.addRow([scopes.svyPopupFilter.LOCALE.svyDatePopupFilter.operator.GREATER_EQUAL, scopes.svyPopupFilter.OPERATOR.GREATER_EQUAL]);
	valueListContent.addRow([scopes.svyPopupFilter.LOCALE.svyDatePopupFilter.operator.BETWEEN, scopes.svyPopupFilter.OPERATOR.BETWEEN]);
	application.setValueListItems('svyDateSelectionTypes', valueListContent);
}
