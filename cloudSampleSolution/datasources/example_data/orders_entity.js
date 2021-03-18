/**
 * Record after-create trigger.
 *
 * @param {JSRecord<db:/example_data/orders>} record record that is created
 *
 * @private
 *
 * @properties={typeid:24,uuid:"B30BE850-3667-45B8-ACCE-464B1494C12B"}
 */
function afterFoundSetRecordCreate(record) {
	record.orderdate = new Date();
	
	if (utils.hasRecords(record.orders_to_customers)) {
		var customer = record.orders_to_customers.getSelectedRecord();
		record.shipaddress = customer.address;
		record.shipcity = customer.city;
		record.shipcountry = customer.country;
		record.shipregion = customer.region;
	}
}
