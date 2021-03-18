/**
 * Called when the mouse is clicked on a row/cell (foundset and column indexes are given).
 * the foundsetindex is always -1 when there are grouped rows
 *
 * @param {number} foundsetindex
 * @param {number} [columnindex]
 * @param {JSRecord} [record]
 * @param {JSEvent} [event]
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"8ED7CCB1-5E0F-4D4A-A33A-96E8E7247BF2"}
 */
function onCellDoubleClick(foundsetindex, columnindex, record, event) {
	showForm(forms.customerView);
}

/**
 * @protected 
 * @properties={typeid:24,uuid:"6CC9EB83-061C-4990-A3F6-DF96E215BE9B"}
 * @override
 */
function newRecord() {
	
	// call the super to create a new record
	_super.newRecord();
	
	// show new record in editable form
	showForm(forms.customerInfoAdd);
}
