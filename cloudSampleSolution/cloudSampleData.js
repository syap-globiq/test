/**
 * @public 
 * updating dates in orders table since they are very old
 *
 * @properties={typeid:24,uuid:"A7B3CFD2-4791-4CE9-8A62-8C20B1A1232B"}
 */
function updateOrderDates() {
	
	var thisYear = new Date().getFullYear();
	var yearPool = [thisYear, thisYear-1, thisYear-2];
	
	var comparedDate = new Date (yearPool[yearPool.length - 1], 0, 1)
	comparedDate.setHours(0, 0, 0);
	
	var query = datasources.db.example_data.orders.createSelect();
	var orCondition = query.or
	orCondition.add(query.columns.orderdate.lt(comparedDate));
	orCondition.add(query.columns.requireddate.lt(comparedDate));
	orCondition.add(query.columns.shippeddate.lt(comparedDate));
	query.where.add(orCondition)
	
	var orderFS = datasources.db.example_data.orders.getFoundSet();
	orderFS.loadRecords(query);

	for (var index = 1; index <= orderFS.getSize(); index++) {
		var record = orderFS.getRecord(index);
		// random index 1 to 3
		var random = Math.min(Math.floor(((Math.random()*10)%3)), 2);
		var newYear = yearPool[random];
		
		if (record.orderdate && record.orderdate <= comparedDate) {
			record.orderdate = record.orderdate.setFullYear(newYear);
		}

		if (record.shippeddate && record.shippeddate <= comparedDate) {
			record.shippeddate = record.shippeddate.setFullYear(newYear);
		}

		if (record.requireddate && record.requireddate <= comparedDate) {
			record.requireddate = record.requireddate.setFullYear(newYear)
		}

	}
	databaseManager.saveData(orderFS);

}
