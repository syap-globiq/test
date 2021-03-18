/**
 * @param {JSEvent} event
 *
 * @private 
 *
 * @properties={typeid:24,uuid:"F27A0ED3-62BF-4FF6-8B52-B82B6D1416F0"}
 */
function onActionSave(event) {
	if (save()) {
		back();
	}
}

/**
 * @param {JSEvent} event
 *
 * @private
 *
 * @properties={typeid:24,uuid:"2A3F64AB-11F1-4DDB-81E9-571640F47307"}
 */
function onActionBack(event) {
	back();
}

/**
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"1BD0CAE4-813A-443C-AFB0-0630D66C8429"}
 */
function back() {
	scopes.svyNavigationHistory.back();
}

/**
 *
 * @protected
 * @return {Boolean}
 *
 * @properties={typeid:24,uuid:"422592A6-34AF-4CF4-A9B8-D2ADED0D9CBE"}
 */
function save() {
	// return false when the record had validation problems
	var markers = validate();
	if (markers && markers.length) {
		return false;
	}
	return databaseManager.saveData();
}

/**
 * Callback method for when form is shown.
 *
 * @param {Boolean} firstShow form is shown first time after load
 * @param {JSEvent} event the event that triggered the action
 * @protected 
 *
 * @properties={typeid:24,uuid:"AB40A13A-D652-40F9-828B-0BA49CF16376"}
 */
function onShow(firstShow, event) {
	 scopes.svyNavigation.addNavigationListener(onOpen);
	 updateUI();
}

/**
 * Handle hide window.
 * 
 * @param {JSEvent} event the event that triggered the action
 * @return {Boolean}
 * @protected 
 *
 * @properties={typeid:24,uuid:"8135AB2F-8ECE-4E48-9EEF-3DC512F4EB70"}
 */
function onHide(event) {
	clearValidationErrors();
	return scopes.svyNavigation.removeNavigationListener(onOpen);
}

/**
  * @protected 
 * @param event
 * 
 * @return {Boolean}
 *
 * @properties={typeid:24,uuid:"8C730973-3860-4E82-A1C3-FE78B396E219"}
 */
function onOpen(event) {
	var type = event.getEventType();
	if (type == scopes.svyNavigation.NAVIGATION_EVENT.BEFORE_CLOSE) {
		if (databaseManager.getEditedRecords().length || databaseManager.getFailedRecords().length){
			var answer = plugins.dialogs.showQuestionDialog("Pending changes", "How would you like to proceed?", "Save changes", "Discard changes", "Cancel")
			if (answer == "Save changes") {
				return save();
			}
			else if(answer == "Discard changes"){
				return databaseManager.revertEditedRecords();
			}
			else{
				return false;
			}
		}
	}
	return true;
}

/**
 * @protected 
 * @param {RuntimeForm} form
 * 
 * @return {Boolean}
 *
 * @properties={typeid:24,uuid:"29DCE67A-CA6E-48E9-BD77-3E6BC21B0847"}
 */
function showForm(form) {
	return scopes.global.showForm(form);
}

/**
 * @protected
 * @properties={typeid:24,uuid:"3B6E57D0-3923-482E-8CFA-FACE80376C9B"}
 */
function updateUI(){
	// intentionally left empty
}

/************************************************************************************************************************
*************************************************************************************************************************
*
* UI Validations
*
*************************************************************************************************************************
************************************************************************************************************************/

/**
 * Validate the record
 * @param {RuntimeTextField} [element] validate only the dataprovider linked to the given element when set
 * @protected 
 * @return {Array<JSRecordMarker>} It will return an array of JSRecordMarker when the record had validation problems 
 * @properties={typeid:24,uuid:"A95E28F2-F687-4DBB-B179-DB6EEAE1B586"}
 */
function validate(element) {
	var dataprovider = element ? element.getDataProviderID() : null;
	// validate the edited records
	var markers = scopes.svyValidationUtils.validateEditedRecords(null, LOGGINGLEVEL.ERROR, dataprovider);
	if (dataprovider) {
		// filter markers having element's dataprovider
		markers = scopes.svyValidationUtils.getMarkersWithDataprovider(markers, dataprovider);
	}
	// invalid if any error marker
	var isValid = markers.length ? false : true;
	
	if (element) {		
		if (isValid) {
			// clear validation error, if any
			clearValidationError(element);
		} else {
			// show validation error	
			updateValidationError(markers[0], element);
		}
	} else {
		
		if (isValid) {
			// clear all validation errors
			clearValidationErrors();
		} else {
			// show all validation errors
			updateValidationErrors(markers);
		}
	}

	return markers;
}

/**
 * Show validation errors in UI, if any
 * @protected 
 * @param {Array<JSRecordMarker>} errorMarkers
 *
 * @properties={typeid:24,uuid:"8D83EB2B-FCA9-4381-B4B0-802A3BF00C53"}
 */
function updateValidationErrors(errorMarkers) {
	// clear all validation errors
	clearValidationErrors();
	
	if (errorMarkers) {
		
		// get the error markers
		for (var i = 0; i < errorMarkers.length; i++) {
	
			// update the UI showing validation error
			var errorMarker = errorMarkers[i];
			
			// get the element linked to the error marker
			var element = scopes.svyValidationUtils.getMarkerElement(controller.getName(), errorMarker);
			updateValidationError(errorMarker, element);
		}
		
		// show the error message
		var errorMsg = scopes.svyValidationUtils.getErrorMessages(foundset.getSelectedRecord());
		plugins.webnotificationsToastr.error(errorMsg);
	}
}

/**
 * Update the UI showing validation error in element
 * @protected 
 * @param {JSRecordMarker} marker
 * @param {RuntimeTextField} element
 *
 * @properties={typeid:24,uuid:"0F955500-B6E1-4A86-B3D4-31271C22F596"}
 */
function updateValidationError(marker, element) {
	if (element) {
		
		// show error as tooltip
		element.toolTipText = marker.message;
		// style the element as invalid input
		element.addStyleClass("form-invalid");
	}
}

/**
 * Clear validation error from all UI elements
 * @protected 
 * @properties={typeid:24,uuid:"421146F2-E577-4722-B145-A3E16B050091"}
 */
function clearValidationErrors() {

	// clear error from all elements.
	for (var i = 0; i < elements.allnames.length; i++) {
		var element = elements[elements.allnames[i]];
		clearValidationError(element);
	}
}

/**
 * Clear validation error for the given UI element
 * @param element
 * @protected
 *
 * @properties={typeid:24,uuid:"04EE0A1B-FEFA-40D7-A441-55CFF184108A"}
 */
function clearValidationError(element) {
	// clear error in element if any
	if (element.hasStyleClass("form-invalid")) {
		element.toolTipText = null;
		element.removeStyleClass("form-invalid");
	}
}

/**
 * Handle changed data, return false if the value should not be accepted. In NGClient you can return also a (i18n) string, instead of false, which will be shown as a tooltip.
 *
 * @param oldValue old value
 * @param newValue new value
 * @param {JSEvent} event the event that triggered the action
 *
 * @return {Boolean}
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"8EA94FC5-668C-4874-9891-6379F38012C1"}
 */
function onElementDataChange(oldValue, newValue, event) {
	var markers = validate(event.getSource());
	if (markers && markers.length) {
		// show error message
		plugins.webnotificationsToastr.error(markers[0].message);
	}
	return true
}
