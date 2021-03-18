/**
 * @protected 
 * @return {Array}
 * @properties={typeid:24,uuid:"FDF25859-3EDE-4B66-BB40-E6E668E8C23E"}
 * @override
 */
function getSelectedFilterValues() {
	
	var date1 = dateFrom ? scopes.svyDateUtils.toStartOfDay(dateFrom) : null;
	var date2 = dateTo ? scopes.svyDateUtils.toEndOfDay(dateTo) : null;

	return [date1, date2];
}

/**
 * @protected 
 * @override 
 * @return {Number}
 * @properties={typeid:24,uuid:"6BDC9E67-A063-4EE9-A687-0029D1976CD1"}
 */
function defaultWidth() {
	return 580;
}
