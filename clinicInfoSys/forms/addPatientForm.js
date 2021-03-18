
/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"7E7C155C-77FB-4CD1-8396-106E01F92491"}
 */
var patientFirstName = "";
/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"9401F803-84AB-4D5F-95EB-7B83D1D9D3E6"}
 */
var patientLastName = "";
/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"F16D2961-02BA-4E61-B80F-8FDB63A5A51C"}
 */
var patientGender = "";
/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"4C21E5A1-5F53-4B63-9E6F-6F347ADF46FA"}
 */
var dateOfConsultation = "";
/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"846D3CE6-6C38-4595-BE84-FDF42BF243CD"}
 */
var patientDiagnosis = "";
/**
 * @param {JSEvent} event
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"B7605E05-628F-452F-B5C4-648B58DF857B"}
 */
function onSave(event) {
	// TODO Auto-generated method stub
	var idx = foundset.newRecord(false); // add as last record
	// foundset.newRecord(); // adds as first record
	// foundset.newRecord(2); //adds as second record
	if (idx >= 0) // returned index is -1 in case of failure
	{
		foundset.patient_firstname = patientFirstName;
		foundset.patient_lastname = patientLastName;
		foundset.gender = patientGender;
		foundset.date_of_consultation = dateOfConsultation;
		foundset.diagnosis = patientDiagnosis;
		databaseManager.startTransaction();
		databaseManager.saveData(foundset);
		databaseManager.commitTransaction();
		var ok = plugins.dialogs.showInfoDialog("Message", "Patient saved successfully.", "OK");
		if (ok) {
			patientFirstName = "";
			patientLastName = "";
			patientGender = "";
			dateOfConsultation = "";
			patientDiagnosis = "";
			application.output("Menu item added");
		}
		
		
		// when adding at the end of the foundset, the returned index
		// corresponds with the size of the foundset
	}

}

/**
 * TODO generated, please specify type and doc for the params
 * @param oldValue
 * @param newValue
 * @param event
 *
 * @properties={typeid:24,uuid:"61CE0292-AEBB-489C-8C6A-FA9E04D81C2C"}
 * @override
 */
function onElementDataChange(oldValue, newValue, event){
	//CLEAR STYLE
	var elementName = event.getElementName();
	var field = elements[elementName];
	
	field.removeStyleClass('field-invalid');
	field.removeStyleClass('field-warning');
	field.toolTipText = null;
	
	// VALIDATE
	var markers = databaseManager.validate(
	   foundset.getSelectedRecord(),
	   {elementName : elementName});
	if(!markers){
	   return;
	}
	
	// CHECK MARKERS / RENDER VALIDATION
	if(markers.hasErrors){
	   field.addStyleClass('field-invalid');
	   field.toolTipText = markers.getMarkers(LOGGINGLEVEL.ERROR)[0].message;
	}
	// CHECK MARKERS / RENDER VALIDATION
	var warnings = markers.getMarkers(LOGGINGLEVEL.WARNING);
	if(warnings.length){
	   field.addStyleClass('field-warning');
	   field.toolTipText = warnings[0].message;
	}
	
	return true;
}
