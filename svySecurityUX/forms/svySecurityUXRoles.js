/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"22889AE2-20E0-4AAA-A15E-78A9AE6779EA"}
 */
var newRoleName = '';

/**
 * Callback method for when form is shown.
 *
 * @param {Boolean} firstShow form is shown first time after load
 * @param {JSEvent} event the event that triggered the action
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"1F50744B-2663-4CE4-97CD-D72738894D7B"}
 */
function onShow(firstShow, event) {
	scopes.svySecurityUX.setSelectedRole(foundset.role_name);
}

/**
 * Handle record selected.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"4FE15ED6-28AD-40DE-9CDD-63C5ED8D6310"}
 */
function onRecordSelection(event) {
	scopes.svySecurityUX.setSelectedRole(foundset.role_name);
}

/**
 * @protected 
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"313704AB-9377-4BC7-BDE9-DD9A017E29C7"}
 */
function onActionNewRole(event) {
	newRoleName = null;
	
	// hide role
	elements.fldNewRole.visible = true;
	elements.iconConfirmNew.visible = true;
	elements.iconCancelNew.visible = true;

	elements.btnNewRole.visible = false;
	elements.iconNewRole.visible = false;
	elements.btnDeleteRole.visible = false;
	elements.iconDeleteRole.visible = false;
}

/**
 * @param {JSEvent} event
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"D6B95B92-351E-4F51-AA89-AB79D6B99754"}
 */
function onActionSaveRole(event) {
	createRole();
}

/**
 * @param oldValue
 * @param newValue
 * @param {JSEvent} event
 *
 * @return {boolean}
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"D7A22947-5F39-4B4E-9CCD-4034706A3F9A"}
 */
function onDataChangeRole(oldValue, newValue, event) {
	// TODO Auto-generated method stub
	return true;
}

/**
 * @private
 *
 * @properties={typeid:24,uuid:"7C8383C5-31C5-4964-911F-31FDCCE6A98E"}
 */
function createRole() {

	if (newRoleName) {
		var tenant = scopes.svySecurity.getTenant();
		try {

			if (!tenant.createRole(newRoleName)) {
				throw "Ops something went wrong";
			}

		} catch (e) {

			if (e instanceof String) {
				elements.fldNewRole.toolTipText = e;
			} else {
				elements.fldNewRole.toolTipText = e.message;
			}
			elements.fldNewRole.addStyleClass("form-invalid");
			return;
		}
	}

	resetNewRoleFields();
}

/**

 * @protected
 *
 * @properties={typeid:24,uuid:"AE04F250-83D1-49C2-8A3D-B21979AC4AEE"}
 */
function onActionCancelNewRole() {
	resetNewRoleFields();
}

/**
 * @protected 
 * @properties={typeid:24,uuid:"56F6D2C9-C3AD-4380-B373-FF7D28474270"}
 */
function resetNewRoleFields() {
	newRoleName = null;
	
	// hide role
	elements.fldNewRole.visible = false;
	elements.fldNewRole.removeStyleClass("form-invalid");
	elements.iconConfirmNew.visible = false;
	elements.iconCancelNew.visible = false;
	//elements.errorNewRole.text = null;
	//elements.errorNewRole.visible = false;

	elements.btnNewRole.visible = true;
	elements.iconNewRole.visible = true;
	elements.btnDeleteRole.visible = true;
	elements.iconDeleteRole.visible = true;
}

/**
 * @protected
 *
 * @properties={typeid:24,uuid:"0818F08B-71A3-40D8-A97C-D4FC572771DD"}
 */
function onActionDeleteRole() {
	
	var msg = "Deletes the specified role from this tenant."
	msg += "All associated permissions and grants to users are removed immediately. Users with active sessions will be partially affected, will be fully affected at next log-in."

	var answer = plugins.dialogs.showQuestionDialog("Do you wish to delete the Role " + role_name, msg, "Yes", "No");
	if (answer == "Yes") {
		var tenant = scopes.svySecurity.getTenant()
		tenant.deleteRole(foundset.role_name);
	}
	

}
