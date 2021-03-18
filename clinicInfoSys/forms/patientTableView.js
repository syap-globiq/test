
/**
 * @param {JSEvent} event
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"EC213A12-A380-49E8-8164-1FB7A84CCBA2"}
 */
function onDelete() {
	// TODO Auto-generated method stub	
	foundset.deleteRecord();
}

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
 * @properties={typeid:24,uuid:"E9449072-8045-4A41-9D4B-7F1E78B77656"}
 */
function onShowEditForm(foundsetindex, columnindex, record, event) {
	// TODO Auto-generated method stub
	var column = elements.patientTable.getColumn(columnindex);
	switch(column.id) {
		case "edit":
		var editWindow = application.createWindow("editForm", JSWindow.MODAL_DIALOG);
		editWindow.setInitialBounds(JSWindow.DEFAULT,JSWindow.DEFAULT,JSWindow.DEFAULT,JSWindow.DEFAULT);
		editWindow.undecorated = false;
		editWindow.title = "Edit Patient Info";
		editWindow.show(forms.editForm);
			break;
		case "delete":
			onDelete();
			break;
		default:
			break;
	}
}
