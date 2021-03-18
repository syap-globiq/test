/**
 * @properties={typeid:24,uuid:"B489A3FE-4193-4D08-A6DD-57536F6F31D9"}
 */
function validate()
{
	// TODO Auto-generated method stub
	var markers = [];
	var requiredFields = [
	'companyname',
	'contactname',
	'contacttitle'
	];
	
	for (var i in requiredFields) {
		var dataProviderID = requiredFields[i];
		var title = databaseManager.getTable(this).getColumn(dataProviderID).getTitle();
		if (!getSelectedRecord()[dataProviderID]) {
			markers.push({dataProviderID:dataProviderID,message:'Missing required field: '+title});
		}
	}
	return markers;
}
