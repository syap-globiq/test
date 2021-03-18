/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"7BA93DBF-08FF-4536-9924-1F87582F09EE"}
 */
var menuName = "";
/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"0752B7B9-BD5E-4930-8F05-7AE584E60142",variableType:4}
 */
var menuPrice = 0;
/**
 * @param {JSEvent} event
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"4FD81053-1C8E-416C-BB96-7840A5205CE0"}
 */
function onSave(event) {
	// TODO Auto-generated method stub
	// foreign key data is only filled in for equals (=) relation items
	var idx = foundset.newRecord(false); // add as last record
	// foundset.newRecord(); // adds as first record
	// foundset.newRecord(2); //adds as second record
	if (idx >= 0) // returned index is -1 in case of failure
	{
		foundset.menu_name = menuName;
		foundset.menu_price = menuPrice;
		databaseManager.startTransaction();
		databaseManager.saveData(foundset);
		databaseManager.commitTransaction();
		var ok = plugins.dialogs.showInfoDialog("Message", "Menu saved successfully", "OK");
		if (ok) {
			menuName = "";
			menuPrice = 0;
			application.output("Menu item added");
		}
		
		
		// when adding at the end of the foundset, the returned index
		// corresponds with the size of the foundset
	}

}

/**
 * @param {JSEvent} event
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"5236A89D-25BE-4B40-8934-AB66508ACB9E"}
 */
function onDelete(event) {
	// TODO Auto-generated method stub
	

}
