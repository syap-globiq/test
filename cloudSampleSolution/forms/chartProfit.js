/**
 * @return {Array}
 * @properties={typeid:24,uuid:"372FCFFB-E63A-4A38-A779-7E34F9F8AAC6"}
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

	var rev = scopes.modelDashboard.getTotalProfitThisYear(startDate,endDate);
	return rev;
}

/**
 * @return {Array}
 * @properties={typeid:24,uuid:"377629D1-F186-4440-A4AA-D0D6EAB40EC3"}
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

	var rev = scopes.modelDashboard.getTotalProfitThisYear(startDate,endDate);
	return rev;
}
