/**
 * @param {JSEvent} event
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"7984D179-92B2-481F-A085-27F2B6931AF6"}
 */
function onActionBack(event) {
	scopes.svyNavigationHistory.back();
}

/**
 * @param {JSEvent} event
 * @param {string} dataTarget
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"10F36B49-6417-4D92-AFA2-8EF903405D80"}
 */
function onActionEditCustomer(event, dataTarget) {
	scopes.global.showForm(forms.customerInfoEdit);
}
