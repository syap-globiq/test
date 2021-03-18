/**
 * @private
 * @type {String}
 * @SuppressWarnings (unused)
 *
 * @properties={typeid:35,uuid:"08F5A764-2756-4813-8357-5C99E7C761D7"}
 */
var tooltipCustomer = 'Show customer at double click';

/**
 * @param {Number} foundsetindex
 * @param {Number} columnindex
 * @param {JSRecord<db:/example_data/orders>} record
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"B8E6B20B-B389-4204-96D4-36BA81D25C24"}
 */
function onCellDoubleClick(foundsetindex, columnindex, record, event) {

	var column = elements.table.getColumn(columnindex)
	if (column.id == "customer") {
		// navigate to the clicked customer
		scopes.global.showForm(forms.customerView, foundset.orders_to_customers, scopes.svyNavigation.NAVIGATION_SELECTION_TYPE.LOAD_RECORDS);
		
	} else {
		// navigate to the orderEdit
		scopes.global.showForm(forms.orderEdit, foundset, scopes.svyNavigation.NAVIGATION_SELECTION_TYPE.SET_FOUNDSET)
	}
}
