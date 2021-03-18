/**
 * @properties={typeid:24,uuid:"0C8AE254-A9A7-4399-B3C2-C62CFB3BA6A4"}
 */
function validate()
{
	// TODO Auto-generated method stub
	var markers = [];
	var requiredFields = [
	'patient_firstname',
	'patient_lastname',
	'diagnosis'
	];
	
	for (var i in requiredFields) {
		var dataProviderID = requiredFields[i];
		var title = databaseManager.getTable(this).getColumn(dataProviderID).getTitle();
		if (!getSelectedRecord()[dataProviderID]) {
			markers.push({dataProviderID:dataProviderID,message:"Missing required field: " + title});
		}
		
	}
}
