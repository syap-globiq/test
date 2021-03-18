/**
 * @param {JSEvent} event
 * @param {string} dataTarget
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"2728289F-AA07-4D48-93D1-29BF6F1943C5"}
 */
function onActionManageRoles(event, dataTarget) {
	// navigate to the given tenant roles
	var item = new scopes.svyNavigation.NavigationItem(scopes.svySecurityUX.SVY_SECURITY_UX.TENANT_ROLES);
	scopes.svyNavigation.open(item);
}
