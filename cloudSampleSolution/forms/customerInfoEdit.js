/**
 * Called whenever a breadcrumb item is clicked with the JSEvent and the item clicked on.
 *
 * @param {JSEvent} event
 * @param {CustomType<bootstrapextracomponents-breadcrumbs.crumb>} crumb
 * @param {Number} index
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"027CD8C5-1758-4700-9622-3F48373E9C00"}
 */
function onCrumbClicked(event, crumb, index) {
	switch (index) {
	case 0:
		showForm(forms.customersTableView);
		break;
	default:
		showForm(forms.customerView);
		break;
	}
}
