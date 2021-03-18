/**
 * @properties={type:12,typeid:36,uuid:"9F573EB9-CBBE-4DEC-B40A-C813A9C97B0D"}
 */
function styleClassIsGrantedForSelectedUser() {
	if (utils.hasRecords(roles_to_user_roles_ux_selected_user)) {
		return "fa fa-check-circle text-success fa-lg";
	} else {
		return "fas fa-minus-circle text-tertiary fa-lg";
	}
}
