/**
 * @return {Array}
 * @properties={typeid:24,uuid:"4CCFFCB3-B115-4FB1-AD8D-FC95817D879A"}
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

	var rev = scopes.modelDashboard.getTotalRevenueYear(startDate, endDate, foundset.customerid);
	return rev;
}
