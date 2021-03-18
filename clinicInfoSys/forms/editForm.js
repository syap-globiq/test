
/**
 * Callback method when form is (re)loaded.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"430818B3-E597-49B8-BC2E-ACCBF5334B31"}
 */
function onLoad(event) {
	// TODO Auto-generated method stub
	databaseManager.setAutoSave(false);
}

/**
 * @param {JSEvent} event
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"7CA1A85E-F99D-46C1-A76A-6CFE95605A60"}
 */
function onSave(event) {
	// TODO Auto-generated method stub
	databaseManager.setAutoSave(true);
}



/**
 * Handle focus lost event of the element.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"02E55BF5-1FAE-48B0-815A-868752F01288"}
 */
function onFocusLost(event) {
	// TODO Auto-generated method stub
	databaseManager.setAutoSave(false);
}
