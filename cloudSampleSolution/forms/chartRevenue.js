/**
 * @return {Array}
 * @properties={typeid:24,uuid:"B394612E-8D1F-4C89-8D03-66EDCFC1B71B"}
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
	
	var rev = scopes.modelDashboard.getTotalRevenueYear(startDate, endDate);
	return rev;
}

/**
 * @return {Array}
 * @properties={typeid:24,uuid:"95E33C89-94BB-4FB4-A393-555C9163AA57"}
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

	var rev = scopes.modelDashboard.getTotalRevenueYear(startDate, endDate);
	return rev;
}
