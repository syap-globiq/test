/**
 * @return {Array}
 * @properties={typeid:24,uuid:"D3898D6D-26F0-4706-AB58-2484C664145D"}
 * @override
 */
function getValue() {
	/**@type {Date}*/
	var startDate = new Date();

	/**@type {Date}*/
	var endDate = new Date();

	//set to begining of the year
	startDate.setFullYear(1900, 0, 1);
	startDate.setHours(0, 0, 0);

	var rev = scopes.modelDashboard.getTotalSalesOrder(startDate, endDate, foundset.customerid);

	return rev;
}
