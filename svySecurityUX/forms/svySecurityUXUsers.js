/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"FCCA5241-88C2-48FB-8F63-D380B307319E"}
 */
var newUserEmail = null;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"9E6B619C-6F0F-47BA-A05D-81CF263FA64C"}
 */
var newUserName = '';

/**
 * Callback method for when form is shown.
 *
 * @param {Boolean} firstShow form is shown first time after load
 * @param {JSEvent} event the event that triggered the action
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"20AF5EC1-DC87-45E4-96DD-00E2491C83EB"}
 */
function onShow(firstShow, event) {
	scopes.svySecurityUX.setSelectedUser(foundset.user_name);
}

/**
 * Handle record selected.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"3A355438-1518-41B9-9DD7-C4816547FF2A"}
 */
function onRecordSelection(event) {
	scopes.svySecurityUX.setSelectedUser(foundset.user_name);
}

/**
 * @protected 
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"6C10F510-A289-4DDA-9D24-4666F08E6F9D"}
 */
function onActionNewUser(event) {
	newUserName = null;
	newUserEmail = null;
	
	// hide role
	elements.fldNewUser.visible = true;
	elements.fldNewEmail.visible = true;
	elements.iconConfirmNew.visible = true;
	elements.iconCancelNew.visible = true;

	elements.btnNewUser.visible = false;
	elements.iconNewUser.visible = false;
	elements.btnDeleteUser.visible = false;
	elements.iconDeleteUser.visible = false;
}

/**
 * @param {JSEvent} event
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"3D9471FF-E0AA-488A-982B-03ADF885DF44"}
 */
function onActionSaveUser(event) {
	createUser();
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
 * @properties={typeid:24,uuid:"72F57EC5-B60D-4491-B4A1-86ABFAAE0639"}
 */
function onDataChangeUser(oldValue, newValue, event) {
	// TODO Auto-generated method stub
	return true;
}

/**
 * @private
 *
 * @properties={typeid:24,uuid:"12B5BF9F-819E-430A-8B9B-E8F0E9BA205F"}
 */
function createUser() {

	if (newUserName) {
		var tenant = scopes.svySecurity.getTenant();
		try {

			var user = tenant.createUser(newUserName)
			if (!user) {
				throw "Ops something went wrong";
			}
			
			if (newUserEmail) {
				user.setEmail(newUserEmail)
			}
			
			// trigger event: user created
			scopes.svySecurityUX.triggerAfterUserCreate(user.getUserName(), user.getTenant().getName())

		} catch (e) {

			if (e instanceof String) {
				elements.fldNewUser.toolTipText = e;
			} else {
				elements.fldNewUser.toolTipText = e.message;
			}
			elements.fldNewUser.addStyleClass("form-invalid");
			return;
		}
	}

	// reset all fields
	resetNewUserFields();
}

/**

 * @protected
 *
 * @properties={typeid:24,uuid:"9E543316-8C5D-470B-B340-1C748A1B622B"}
 */
function onActionCancelNewUser() {
	resetNewUserFields();
}

/**
 * @protected 
 * @properties={typeid:24,uuid:"223A86A2-93E0-446C-889F-79104AFE5500"}
 */
function resetNewUserFields() {
	newUserName = null;
	newUserEmail = null;
	
	// hide role
	elements.fldNewUser.visible = false;
	elements.fldNewUser.removeStyleClass("form-invalid");
	elements.fldNewEmail.visible = false;
	elements.iconConfirmNew.visible = false;
	elements.iconCancelNew.visible = false;
	
	//elements.errorNewRole.text = null;
	//elements.errorNewRole.visible = false;

	elements.btnNewUser.visible = true;
	elements.iconNewUser.visible = true;
	elements.btnDeleteUser.visible = true;
	elements.iconDeleteUser.visible = true;
}

/**
 * @protected
 *
 * @properties={typeid:24,uuid:"5671D9E4-2485-4788-AAD6-F5744DC20D11"}
 */
function onActionDeleteUser() {
	
	var msg = "Immediately and permanently deletes the specified user and all security-related settings associated with it"
	msg += "The user will not be deleted if it has active sessions."

	var answer = plugins.dialogs.showQuestionDialog("Do you wish to delete the User " + user_name, msg, "Yes", "No");
	if (answer == "Yes") {
		var tenant = scopes.svySecurity.getTenant();
		tenant.deleteUser(foundset.user_name);
	}
}

/**
 * Called when the mouse is clicked on a row/cell (foundset and column indexes are given).
 * the foundsetindex is always -1 when there are grouped rows
 * the record is not an actual JSRecord but an object having the dataprovider values of the clicked record
 *
 * @param {Number} foundsetindex
 * @param {Number} [columnindex]
 * @param {object} [record]
 * @param {JSEvent} [event]
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"3167013F-F9E9-4CDE-9042-0F18AA90FF31"}
 */
function onCellClick(foundsetindex, columnindex, record, event) {
	var column = elements.table.getColumn(columnindex);
	if (column.id == "edit") {
		// navigate to the given product
		var item = new scopes.svyNavigation.NavigationItem(scopes.svySecurityUX.SVY_SECURITY_UX.USER);
		scopes.svyNavigation.open(item, foundset.getSelectedRecord(), scopes.svyNavigation.NAVIGATION_SELECTION_TYPE.LOAD_RECORDS);
	}
}
