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
 * @properties={typeid:24,uuid:"311FA5E6-F772-4E6F-B587-FC3BE49424D4"}
 */
function onElementDataChange(oldValue, newValue, event) {
	// TODO Auto-generated method stub
	var markers = validate(event.getSource());
	if (markers && markers.length) {
		plugins.webnotificationsToastr.error(markers[0].message);
	}
	return true
}
/**
 * TODO generated, please specify type and doc for the params
 * @param {RuntimeTextField} [element] validate only the dataprovider linked to the given element when set
 * @protected 
 * @return {Array<JSRecordMarker>} It will return an array of JSRecordMarker when the record had validation problems
 * @properties={typeid:24,uuid:"17318A3C-F3AE-4ABC-8E63-5E9D7C196D7A"}
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
 * @protected 
 * @properties={typeid:24,uuid:"669B8091-6A2B-4248-85B2-8020C3C8A5F4"}
 */
function clearValidationErrors() {

	// clear error from all elements.
	for (var i = 0; i < elements.allnames.length; i++) {
		var element = elements[elements.allnames[i]];
		clearValidationError(element);
	}
}
/**
 * TODO generated, please specify type and doc for the params
 * @protected 
 * @param {Array<JSRecordMarker>} errorMarkers
 *
 * @properties={typeid:24,uuid:"EE28A2D7-2A54-4BE7-8C93-6F09DF268D29"}
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
 * TODO generated, please specify type and doc for the params
 * @param element
 * @protected 
 *
 * @properties={typeid:24,uuid:"82B3BE22-AB51-43AB-86C9-28F00B2EC6EC"}
 */
function clearValidationError(element) {
	// clear error in element if any
	if (element.hasStyleClass("form-invalid")) {
		element.toolTipText = null;
		element.removeStyleClass("form-invalid");
	}
}
/**
 * TODO generated, please specify type and doc for the params
 * @protected 
 * @param {JSRecordMarker} marker
 * @param {RuntimeTextField} element
 *
 * @properties={typeid:24,uuid:"45EC4634-7293-44BC-B7DB-62415A8B8938"}
 */
function updateValidationError(marker, element) {
	if (element) {
		
		// show error as tooltip
		element.toolTipText = marker.message;
		// style the element as invalid input
		element.addStyleClass("form-invalid");
	}
}

