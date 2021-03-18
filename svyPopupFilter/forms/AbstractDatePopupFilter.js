/**
 * @type {Date}
 * @protected 
 *
 * @properties={typeid:35,uuid:"EE42E940-E5C5-4427-A12E-10DBD3F5B5B3",variableType:93}
 */
var dateFrom;

/**
 * @type {Date}
 * @protected 
 *
 * @properties={typeid:35,uuid:"27156EB3-336E-4F82-BFCB-4FE772DBC5D6",variableType:93}
 */
var dateTo;

/**
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"0B8B503C-329D-4924-A924-0137E86BB291"}
 * @override
 */
function onLoad(event) {
	_super.onLoad(event);
	
	// default operator to between
	operator = scopes.svyPopupFilter.OPERATOR.BETWEEN;
	updateUI();
}

/**
 * @protected 
 * @param {Array} selectedValues
 *
 * @properties={typeid:24,uuid:"61DC1807-93A7-404C-8C3C-5418355F4597"}
 * @override
 */
function setSelectedFilterValues(selectedValues) {
	if (selectedValues && selectedValues.length) {
		dateFrom = selectedValues[0];
		dateTo = selectedValues[1];
	} else {
		dateFrom = null;
		dateTo = null;
	}
}

/**
 * @protected
 * @return {Array}
 * @properties={typeid:24,uuid:"3663C0D4-B5FC-4A94-899D-41588025D5B4"}
 * @override
 */
function getSelectedFilterValues() {
	
	if (dateFrom && dateTo) {
		operator = scopes.svyPopupFilter.OPERATOR.BETWEEN;
		return [scopes.svyDateUtils.toStartOfDay(dateFrom), scopes.svyDateUtils.toEndOfDay(dateTo)];
	} else if (dateFrom) {
		operator = scopes.svyPopupFilter.OPERATOR.GREATER_EQUAL;
		return [scopes.svyDateUtils.toStartOfDay(dateFrom)];

	} else if (dateTo) {
		operator = scopes.svyPopupFilter.OPERATOR.SMALLER_EQUAL;
		return [scopes.svyDateUtils.toStartOfDay(dateTo)];
	} else {
		return [];
	}
	
	// return [dateFrom ? scopes.svyDateUtils.toStartOfDay(dateFrom) : null, dateTo ? scopes.svyDateUtils.toEndOfDay(dateTo) : null];
}

/**
 * @protected 
 * @properties={typeid:24,uuid:"4CDDC978-247C-437E-8B5D-65CEFA7E9EF1"}
 */
function updateUI() {
	
}

/**
 * @protected 
 * @properties={typeid:24,uuid:"28611948-0EA9-4818-8386-9FEB4BFE36AE"}
 */
function setSelectionToday() {
	var today = new Date();
	dateFrom = scopes.svyDateUtils.toStartOfDay(today);
	dateTo = scopes.svyDateUtils.toEndOfDay(today);
	operator = scopes.svyPopupFilter.OPERATOR.EQUALS;
	updateUI();
}

/**
 * @protected 
 * @properties={typeid:24,uuid:"C7DBF849-C71C-4404-898F-398F9B703E12"}
 */
function setSelectionTomorrow() {
	var tomorrow = scopes.svyDateUtils.addDays(new Date(), 1);
	dateFrom = scopes.svyDateUtils.toStartOfDay(tomorrow);
	dateTo = scopes.svyDateUtils.toEndOfDay(tomorrow);
	operator = scopes.svyPopupFilter.OPERATOR.EQUALS;
	updateUI();
}

/**
 * @protected 
 * @properties={typeid:24,uuid:"3BA53559-058F-404B-8661-F406A18E34B1"}
 */
function setSelectionThisWeek() {
	var today = new Date();
	dateFrom = scopes.svyDateUtils.toStartOfDay(scopes.svyDateUtils.getFirstDayOfWeek(today));
	dateTo = scopes.svyDateUtils.toEndOfDay(scopes.svyDateUtils.getLastDayOfWeek(today));
	operator = scopes.svyPopupFilter.OPERATOR.BETWEEN;
	updateUI();
}

/**
 * @protected 
 * @properties={typeid:24,uuid:"0383EF7C-9B17-46A5-AFFE-6B02F1D7FD8C"}
 */
function setSelectionThisMonth() {
	var today = new Date();
	dateFrom = scopes.svyDateUtils.toStartOfDay(scopes.svyDateUtils.getFirstDayOfMonth(today));
	dateTo = scopes.svyDateUtils.toEndOfDay(scopes.svyDateUtils.getLastDayOfMonth(today));
	operator = scopes.svyPopupFilter.OPERATOR.BETWEEN;
	updateUI();
}

/**
 * @protected 
 * @properties={typeid:24,uuid:"B7AAD534-BAA8-4F35-BDB1-4B71EB9EBB87"}
 */
function setSelectionThisYear() {
	var today = new Date();
	dateFrom = scopes.svyDateUtils.toStartOfDay(scopes.svyDateUtils.getFirstDayOfYear(today));
	dateTo = scopes.svyDateUtils.toEndOfDay(scopes.svyDateUtils.getLastDayOfYear(today));
	operator = scopes.svyPopupFilter.OPERATOR.BETWEEN;
	updateUI();
}

/**
 * @protected 
 * @properties={typeid:24,uuid:"D67CCAF0-67F8-4BF3-B942-8D680A60931F"}
 */
function setSelectionNextWeek() {
	var date = scopes.svyDateUtils.addDays(new Date(), 7);
	dateFrom = scopes.svyDateUtils.toStartOfDay(scopes.svyDateUtils.getFirstDayOfWeek(date));
	dateTo = scopes.svyDateUtils.toEndOfDay(scopes.svyDateUtils.getLastDayOfWeek(date));
	operator = scopes.svyPopupFilter.OPERATOR.BETWEEN;
	updateUI();
}

/**
 * @protected 
 * @properties={typeid:24,uuid:"C30C5704-306C-48BC-9B46-E7DF7ECBCF68"}
 */
function setSelectionNextMonth() {
	var date = scopes.svyDateUtils.addMonths(new Date(), 1);
	dateFrom = scopes.svyDateUtils.toStartOfDay(scopes.svyDateUtils.getFirstDayOfMonth(date));
	dateTo = scopes.svyDateUtils.toEndOfDay(scopes.svyDateUtils.getLastDayOfMonth(date));
	operator = scopes.svyPopupFilter.OPERATOR.BETWEEN;
	updateUI();
}

/**
 * @protected 
 * @properties={typeid:24,uuid:"D34FEE7C-1E68-40B5-A487-C6F715E9C9B6"}
 */
function setSelectionLastYear() {
	var date = scopes.svyDateUtils.addYears(new Date(), -1);
	dateFrom = scopes.svyDateUtils.toStartOfDay(scopes.svyDateUtils.getFirstDayOfYear(date));
	dateTo = scopes.svyDateUtils.toEndOfDay(scopes.svyDateUtils.getLastDayOfYear(date));
	operator = scopes.svyPopupFilter.OPERATOR.BETWEEN;
	updateUI();
}
