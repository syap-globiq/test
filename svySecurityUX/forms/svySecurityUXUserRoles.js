/**
 * Callback method for when form is shown.
 *
 * @param {Boolean} firstShow form is shown first time after load
 * @param {JSEvent} event the event that triggered the action
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"5CBEE7CC-44BC-4007-B15D-E3143593CADB"}
 */
function onShow(firstShow, event) {
	elements.table.myFoundset.foundset.loadRecords();
}

/**
 * Called when the mouse is clicked on a row/cell (foundset and column indexes are given).
 * the foundsetindex is always -1 when there are grouped rows
 * the record is not an actual JSRecord but an object having the dataprovider values of the clicked record
 *
 * @param {Number} foundsetindex
 * @param {Number} [columnindex]
 * @param {JSRecord<db:/svy_security/roles>} [record]
 * @param {JSEvent} [event]
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"225DBC59-1682-4542-BEB9-28234B40D4D1"}
 */
function onCellClick(foundsetindex, columnindex, record, event) {
	var column = elements.table.getColumn(columnindex);

	if (column.id === "granted") {
		var user = scopes.svySecurity.getUser(foundset.user_name);
		if (user) {
			var roleName = record.role_name;
			
			if (user.hasRole(roleName)) {
				user.removeRole(roleName)
			} else {
				user.addRole(roleName);
			}
		} else {
			throw "Cannot find user"
		}
	}
}
