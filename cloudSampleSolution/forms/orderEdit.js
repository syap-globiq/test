/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"56CE4D98-5F86-46D6-9F76-9378822CA2FA"}
 */
var orderText = '';

/**
 * Handle record selected.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"D4EEAFC8-18D5-4CBC-AA7B-B9C94344B52B"}
 */
function onRecordSelection(event) {
	orderText = foundset.getSelectedRecord() ? foundset.orderid : "";
}

/**
 * Called whenever a breadcrumb item is clicked with the JSEvent and the item clicked on.
 *
 * @param {JSEvent} event
 * @param {CustomType<bootstrapextracomponents-breadcrumbs.crumb>} crumb
 * @param {Number} index
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"B004B4E7-62B9-4D04-AC04-336474CAC6E5"}
 */
function onCrumbClicked(event, crumb, index) {
	switch (index) {
	case 0:
		showForm(forms.customersTableView);
		break;
	default:
		scopes.global.showForm(forms.customerView, foundset.orders_to_customers, scopes.svyNavigation.NAVIGATION_SELECTION_TYPE.LOAD_RECORDS);
		break;
	}
}

/**
 * @param {JSEvent} event
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"0781C250-0287-4E70-B3CD-B6E6C7F3D59B"}
 */
function onActionPickRequiredShippedDates(event) {
	
	// create the popup filter
	var datePicker = scopes.svyPopupFilter.createDateFilter();
	
	// set popup template form
	datePicker.setRendererForm(forms.customDatePopupFilter);
	
	// set selected values
	datePicker.setValues([foundset.shippeddate, foundset.requireddate]);
	
	// show the picker
	datePicker.showPopUp(onRequiredShippedDatesPicked, elements.shippeddate);
}

/**
 * @protected 
 * 
 * @param {Array} values
 * @param {String} operator
 * @param {scopes.svyPopupFilter.AbstractPopupFilter} dataPicker
 *
 * @properties={typeid:24,uuid:"5E29787B-B27D-4E8E-8294-498FD4C0E65A"}
 */
function onRequiredShippedDatesPicked(values, operator, dataPicker) {
	foundset.shippeddate = values[0];
	foundset.requireddate = values[1];
}
