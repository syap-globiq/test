/**
 * Callback method when form is (re)loaded.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"0A80E4F6-5693-4451-9BAD-5C388A658C83"}
 */
function onLoad(event) {

	// switch the svy_security server to a db containin only sample users

	// auto fill credentials in developer
	if (application.isInDeveloper()) {
		tenantName = "admin";
		userName = "admin";
		password = "admin";
		//	login();
	}
}

/**
 * @protected
 * @properties={typeid:24,uuid:"3A541FD4-C9D5-4330-B16C-94C693E544B2"}
 * @override
 */
function onLoginSuccess() {
	elements.errorMsg.visible = false;

}

/**
 * @protected
 * @param error
 *
 * @properties={typeid:24,uuid:"C3758249-7032-472A-85BF-4940A34E8089"}
 * @override
 */
function onLoginError(error) {

	var errorTxt;
	switch (error) {
	case ERROR_CODES.INSUFFICIENT_PERMISSIONS:
		errorTxt = "The User does not have any permission; login is denied";
		break;
	case ERROR_CODES.LOCKED_TENANT:
		errorTxt = "The Tenant is locked";
		break;
	case ERROR_CODES.LOCKED_USER:
		errorTxt = "The User is locked";
		break;
	case ERROR_CODES.PASSWORD_MISMATCH:
		errorTxt = "The entered password is not correct";
		break;
	case ERROR_CODES.PASSWORD_NOT_SPECIFIED:
		errorTxt = "Please enter the User's password";
		break;
	case ERROR_CODES.TENANT_NOT_FOUND:
		errorTxt = "Tenant not found";
		break;
	case ERROR_CODES.TENANT_NOT_SPECIFIED:
		errorTxt = "Please enter the Tenant";
		break;
	case ERROR_CODES.USER_NOT_FOUND:
		errorTxt = "User not found";
		break;
	case ERROR_CODES.USER_NOT_SPECIFIED:
		errorTxt = "Please enter the User";
		break;
	default:
		errorTxt = error
		break;
	}

	elements.errorMsg.text = errorTxt;
	elements.errorMsg.visible = true;
}

/**
 * @public
 * @param {String} appName
 *
 * @properties={typeid:24,uuid:"29B7E977-546A-4BCB-A0CD-FC99D629895B"}
 */
function setAppName(appName) {
	tenantName = appName;
}
