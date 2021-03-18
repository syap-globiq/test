/**
 * Record after-create trigger.
 *
 * @param {JSRecord<db:/example_data/order_details>} record record that is created
 *
 * @private
 *
 * @properties={typeid:24,uuid:"3E60EC54-4A86-4954-B8BC-D06FAF2BEF6B"}
 */
function afterFoundSetRecordCreate(record) {

	// default discount & quantity
	record.discount = 0;
	record.quantity = 0;
	
	// if product is defined, set default unit price
	if (utils.hasRecords(record.order_details_to_products)) {
		var product = record.order_details_to_products.getSelectedRecord();
		record.unitprice = product.unitprice;
	}
}
