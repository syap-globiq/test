/**
 * @return {Array}
 * @properties={typeid:24,uuid:"30C54EC3-4E07-42C3-9FBA-34E0B4D7B342"}
 * @override
 */
function getValue() {
	/**@type {Date}*/
	var startDate = new Date();

	/**@type {Date}*/
	var endDate = new Date();

	//set to beginning of the year
	startDate.setFullYear(startDate.getFullYear(), 0, 1);
	startDate.setHours(0, 0, 0);
	
	//set to end of the year
	endDate.setFullYear(endDate.getFullYear(), 11, 30);
	endDate.setHours(0, 0, 0);

	var rev = scopes.modelDashboard.getTotalSalesOrder(startDate, endDate);

	return rev;
}

/**
 * @return {Array}
 * @properties={typeid:24,uuid:"19B37987-C221-4CCE-9BD0-E68E52536727"}
 * @override
 */
function getLastYearValue() {

	/**@type {Date}*/
	var startDate = new Date();

	/**@type {Date}*/
	var endDate = new Date();

	//set to beginning of the year
	startDate.setFullYear(startDate.getFullYear() - 1, 0, 1);
	startDate.setHours(0, 0, 0);

	//set to end of the year
	endDate.setFullYear(endDate.getFullYear() - 1, 11, 30);
	endDate.setHours(0, 0, 0);

	var rev = scopes.modelDashboard.getTotalSalesOrder(startDate, endDate);
	return rev;
}
