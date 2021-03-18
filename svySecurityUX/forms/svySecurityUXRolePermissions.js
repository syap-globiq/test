/**
 * Called when the mouse is clicked on a row/cell (foundset and column indexes are given).
 * the foundsetindex is always -1 when there are grouped rows
 * the record is not an actual JSRecord but an object having the dataprovider values of the clicked record
 *
 * @param {Number} foundsetindex
 * @param {Number} [columnindex]
 * @param {JSRecord<db:/svy_security/permissions>} [record]
 * @param {JSEvent} [event]
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"66FD190A-B06A-4334-96AE-5327EA8ACB5D"}
 */
function onCellClick(foundsetindex, columnindex, record, event) {
	var column = elements.table.getColumn(columnindex);

	if (column.id === "granted") {
		var role = scopes.svySecurity.getRole(foundset.role_name);
		if (role) {
			var permissionName = record.permission_name;
			
			if (role.hasPermission(permissionName)) {
				role.removePermission(permissionName)
			} else {
				role.addPermission(permissionName);
			}
		} else {
			throw "Cannot find role"
		}
	}
}
