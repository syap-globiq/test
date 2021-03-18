/**
 * @properties={typeid:24,uuid:"8D3521D6-5B4C-4FAB-9D52-84495B8CA954"}
 */
function validate()
{
	// TODO Auto-generated method stub
	var markers = [];
	
	var requiredFields = ['customerid','employeeid'];
	
	for (var i in requiredFields) {
		var dataProviderID = requiredFields[i];
		var title = databaseManager.getTable(this).getColumn(dataProviderID).getTitle();
		if (!getSelectedRecord()[dataProviderID]) {
			markers.push({dataProviderID: dataProviderID, message:'Missing required field:'+title});
		}
	}
	if (getSelectedRecord().shippeddate <= getSelectedRecord().orderdate) {
		markers.push({dataProviderID: 'shippeddate', message: 'Ship date must be after order date'});
		markers.push({dataProviderID: 'orderdate', message: 'Order date must be before ship date'});
	}
	return markers;
}
