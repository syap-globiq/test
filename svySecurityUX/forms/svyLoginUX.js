/**
 * @protected 
 * @properties={typeid:24,uuid:"0F8EF383-C4EC-4F30-B0A5-08D28469C8D8"}
 * @override
 */
function onLoginSuccess() {
	elements.errorMsg.visible = false;
}

/**
 * @protected 
 * @param error
 *
 * @properties={typeid:24,uuid:"53BCBA3B-4338-44F0-8572-7DA218CE54A5"}
 * @override
 */
function onLoginError(error) {
	elements.errorMsg.text = error;
	elements.errorMsg.visible = true;
}

/**
 * Callback method when form is (re)loaded.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"9FEABBD6-00AC-4423-A921-27553CCFA252"}
 */
function onLoad(event) {
	// auto fill credentials in developer
	if (application.isInDeveloper()) {
		 tenantName = "admin";
		 userName = "admin";
		 password = "admin";
	}
}
