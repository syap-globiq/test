/**
 *
 * This method is used to get total revenue in a specific date range
 *
 * @param {Date} startDate
 * @param {Date} endDate
 * @param {String} [customerID]
 * @return {Array}
 *
 * @properties={typeid:24,uuid:"B182744A-D0BC-42F3-BCAB-F8019590CF05"}
 */
function getTotalRevenueYear(startDate, endDate, customerID) {
	var result = [];

	var query = datasources.db.example_data.orders.createSelect();

	/**@type {QBJoin<db:/example_data/order_details>}*/
	var join = query.joins.add(datasources.db.example_data.order_details.getDataSource(), QBJoin.INNER_JOIN);
	join.on.add(join.columns.orderid.eq(query.columns.orderid));

	var summTotal = join.columns.quantity.multiply(join.columns.unitprice).sum;

	query.result.add(summTotal);

	query.where.add(query.columns.orderdate.between(startDate, endDate));
	query.where.add(query.columns.shippeddate.not.isNull);

	if (customerID) {
		query.where.add(query.columns.customerid.eq(customerID));
	}

	var ds = databaseManager.getDataSetByQuery(query, 1);

	if (ds) {
		if (ds.getMaxRowIndex() > 0) {
			var row = ds.getRowAsArray(1);
			if (row) {
				result = row[0];
			}
		}
	}
	return result;
}

/**
 *
 * This method is used to get total revenue excluding (discount) in specific date range
 *
 * @param {Date} startDate
 * @param {Date} endDate
 * @param {String} [customerID]
 * @return {Array}
 *
 * @properties={typeid:24,uuid:"6BE06753-0F8B-4EF8-B237-FA43C5428F69"}
 */
function getTotalProfitThisYear(startDate, endDate, customerID) {
	var result = [];

	var query = datasources.db.example_data.orders.createSelect();

	/**@type {QBJoin<db:/example_data/order_details>}*/
	var join = query.joins.add(datasources.db.example_data.order_details.getDataSource(), QBJoin.INNER_JOIN);
	join.on.add(join.columns.orderid.eq(query.columns.orderid));

	var summTotal = join.columns.quantity.multiply(join.columns.unitprice).plus(join.columns.discount.multiply(-1)).sum;

	query.result.add(summTotal);

	query.where.add(query.columns.orderdate.between(startDate, endDate));
	query.where.add(query.columns.shippeddate.not.isNull);

	if (customerID) {
		query.where.add(query.columns.customerid.eq(customerID));
	}

	var ds = databaseManager.getDataSetByQuery(query, 1);

	if (ds) {
		if (ds.getMaxRowIndex() > 0) {
			var row = ds.getRowAsArray(1);
			if (row) {
				result = row[0];
			}
		}
	}
	return result;
}

/**
 *
 * This method is used to get total number of sales order in specific date range
 *
 * @param {Date} startDate
 * @param {Date} endDate
 * @param {String} [customerID]
 * @return {Array}
 *
 * @properties={typeid:24,uuid:"F1F93BA7-87A7-412C-AFA4-7C90B7D5782B"}
 */
function getTotalSalesOrder(startDate, endDate, customerID) {
	var result = [];

	var query = datasources.db.example_data.orders.createSelect();

	query.result.add(query.columns.orderid.count);

	query.where.add(query.columns.orderdate.between(startDate, endDate));

	if (customerID) {
		query.where.add(query.columns.customerid.eq(customerID));
	}

	var ds = databaseManager.getDataSetByQuery(query, 1);

	if (ds) {
		if (ds.getMaxRowIndex() > 0) {
			var row = ds.getRowAsArray(1);
			if (row) {
				result = row[0];
			}
		}
	}
	return result;
}

/**
 * This method is used to get top customers based on total amount of orders
 *
 * @param {Number} nr
 * @return {Array}
 * @properties={typeid:24,uuid:"D7C827C2-5753-43B5-85F2-CBF118F23766"}
 */
function getTopCustomers(nr) {
	var result = [];

	var query = datasources.db.example_data.orders.createSelect();

	/**@type {QBJoin<db:/example_data/order_details>}*/
	var join = query.joins.add(datasources.db.example_data.order_details.getDataSource(), QBJoin.INNER_JOIN);
	join.on.add(join.columns.orderid.eq(query.columns.orderid));

	var summTotal = join.columns.quantity.multiply(join.columns.unitprice).sum;

	query.result.add(query.columns.customerid);
	query.result.add(summTotal);

	query.groupBy.add(query.columns.customerid);
	query.sort.add(summTotal.desc);

	var ds = databaseManager.getDataSetByQuery(query, nr);

	if (ds) {
		if (ds.getMaxRowIndex() > 0) {
			for (var index = 1; index <= ds.getMaxRowIndex(); index++) {
				var row = ds.getRowAsArray(index);
				result.push(row);
			}
		}
	}
	return result;
}

/**
 * This method is used to get total sales in last 6 months
 * @return {Array}
 *
 * @properties={typeid:24,uuid:"8D66E930-646C-43A5-8185-A011DEFB7892"}
 */
function getSalesLastMonths() {
	var result = [];
	var today = new Date();
	var sixMonthago = scopes.svyDateUtils.add(today, 0, -6, 0, 0, 0, 0);
	sixMonthago.setDate(1);

	var query = datasources.db.example_data.orders.createSelect();

	/**@type {QBJoin<db:/example_data/order_details>}*/
	var join = query.joins.add(datasources.db.example_data.order_details.getDataSource(), QBJoin.FULL_JOIN);
	join.on.add(join.columns.orderid.eq(query.columns.orderid));

	var summTotal = join.columns.quantity.multiply(join.columns.unitprice).sum;
	var month = query.columns.orderdate.month;

	query.where.add(query.columns.orderdate.between(sixMonthago, today))
	query.result.add(month);
	query.result.add(summTotal);

	query.groupBy.add(month);
	query.sort.add(month);

	var ds = databaseManager.getDataSetByQuery(query, -1);

	if (ds) {
		if (ds.getMaxRowIndex() > 0) {
			for (var index = 1; index <= ds.getMaxRowIndex(); index++) {
				var row = ds.getRowAsArray(index);
				result.push(row);
			}
		}
	}
	return result;
}

/**
 * This method is used to get top products of a customer based on total quantity of products
 *
 * @param {Number} nr
 * @param {String} customerID
 * @return {Array}
 *
 * @properties={typeid:24,uuid:"7FD64592-0EB8-43A3-9829-AB8DED598BEF"}
 */
function getTopCustomersProducts(customerID, nr) {
	var result = [];

	var query = datasources.db.example_data.orders.createSelect();

	/**@type {QBJoin<db:/example_data/order_details>}*/
	var join1 = query.joins.add(datasources.db.example_data.order_details.getDataSource(), QBJoin.INNER_JOIN);
	join1.on.add(join1.columns.orderid.eq(query.columns.orderid));

	/**@type {QBJoin<db:/example_data/products>}*/
	var join2 = query.joins.add(datasources.db.example_data.products.getDataSource(), QBJoin.INNER_JOIN);
	join2.on.add(join1.columns.productid.eq(join2.columns.productid));

	var total = join1.columns.quantity.sum;

	query.result.add(join2.columns.productname);
	query.result.add(join2.columns.productid);
	query.result.add(total);

	query.where.add(query.columns.customerid.eq(customerID));

	query.groupBy.add(join2.columns.productname).add(join2.columns.productid);
	query.sort.add(total.desc);

	var ds = databaseManager.getDataSetByQuery(query, nr);

	if (ds) {
		if (ds.getMaxRowIndex() > 0) {
			for (var index = 1; index <= ds.getMaxRowIndex(); index++) {
				var row = ds.getRowAsArray(index);
				result.push(row);
			}
		}
	}
	return result;
}

/**
 * This method is used to get total sales order per year
 *
 *
 * @param {String} customerID
 * @return {Array}
 *
 * @properties={typeid:24,uuid:"E3FCB296-29D6-43E5-8F42-0DB1A5E81926"}
 */
function getSalesOrderByYear(customerID) {
	var result = [];

	var query = datasources.db.example_data.orders.createSelect();

	/**@type {QBJoin<db:/example_data/order_details>}*/
	var join = query.joins.add(datasources.db.example_data.order_details.getDataSource(), QBJoin.INNER_JOIN);
	join.on.add(join.columns.orderid.eq(query.columns.orderid));

	var summTotal = join.columns.quantity.multiply(join.columns.unitprice).sum;
	var year = query.columns.orderdate.year;

	query.result.add(year);
	query.result.add(summTotal);

	query.groupBy.add(year);
	query.sort.add(year);

	var ds = databaseManager.getDataSetByQuery(query, 6);

	if (ds) {
		if (ds.getMaxRowIndex() > 0) {
			for (var index = 1; index <= ds.getMaxRowIndex(); index++) {
				var row = ds.getRowAsArray(index);
				result.push(row);
			}
		}
	}
	return result;
}
