/**
 * @properties={type:8,typeid:36,uuid:"1794659B-1A9A-4F2E-88D4-2E77A2225346"}
 */
function order_total() {
	var total = 0;
	for (var i = 1; i <= orders_to_order_details.getSize(); i++) {
		var record = orders_to_order_details.getRecord(i);
		total += record.subtotal;
	}
	return total + freight;
}

/**
 *
 * @properties={type:12,typeid:36,uuid:"8B403AE5-EDE3-4054-8A1E-6D5F2BA2B591"}
 */
function displayAddress() {
	return [shipaddress,
	shipcity,
	shipcountry + ' ' + shippostalcode].join('\n')
}

/**
 *
 * @properties={type:12,typeid:36,uuid:"3C27B08F-B2D2-4BF6-A850-549641EB6894"}
 */
function orderStatus() {
	var status = "New";
	if (requireddate) {
		if (shippeddate) {
			status = "Completed";
		} else {
			status = "Planned";
		}
	}
	return status;
}

/**
 *
 * @properties={type:12,typeid:36,uuid:"4C459023-64F1-4F01-AD78-ADD5DEBD0378"}
 */
function orderStatusStyleClass() {
	switch (orderStatus) {
	case "New Order":
		return "btn-label-info";
		break;
	case "Completed":
		return "btn-label-success";
		break;
	case "Planned":
		return "btn-label-warning";
		break;
	default:
		break;
	}
	return "btn-label-info";
}
