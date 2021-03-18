/**
 * @properties={type:12,typeid:36,uuid:"C0C677B6-69EC-4A8B-9744-1DF4622A1E93"}
 */
function styleClassIsGrantedForSelectedRole() {
	if (utils.hasRecords(permissions_to_roles_permissions_ux_selected_role)) {
		return "fa fa-check-circle text-success fa-lg";
	} else {
		return "fas fa-minus-circle text-tertiary fa-lg";
	}
}
