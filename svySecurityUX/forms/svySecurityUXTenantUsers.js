/**
 * @param {JSEvent} event
 * @param {string} dataTarget
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"741696D2-C10F-43F0-AF6E-ABB9C89AD253"}
 */
function onActionManageRoles(event, dataTarget) {
	// navigate to the given product
	var item = new scopes.svyNavigation.NavigationItem(scopes.svySecurityUX.SVY_SECURITY_UX.TENANT_USERS);
	scopes.svyNavigation.open(item);
}
