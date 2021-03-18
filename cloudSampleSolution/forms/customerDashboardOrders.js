/**
 * @properties={typeid:24,uuid:"BE829C33-A2F2-451B-981A-6CC35A25C936"}
 * @override
 */
function onShow() {
	// override base 
}

/**
 * @param {JSEvent} event
 * @param {string} dataTarget
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"E0143577-D0A3-422B-8382-DE48E2094A1F"}
 */
function onActionNewOrder(event, dataTarget) {
	foundset.newRecord();
	edit();
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
 * @properties={typeid:24,uuid:"86C6F9A6-E39E-406F-81F4-40531531C313"}
 */
function onCellClick(foundsetindex, columnindex, record, event) {
	var column = elements.table.getColumn(columnindex);
	if (column && column.id === "edit") {
		edit();
	}
}

/**
 * @protected 
 * @properties={typeid:24,uuid:"76AA264F-0E7E-4ED7-A5BC-C85DD23A2099"}
 */
function edit() {
	scopes.global.showForm(forms.orderEdit, foundset, scopes.svyNavigation.NAVIGATION_SELECTION_TYPE.SET_FOUNDSET);
}
