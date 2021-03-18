/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"054F1B07-938A-4968-963D-9F1039CCD99B"}
 */
var primaryColor = "#4880FF";

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"CF54C6A0-6074-4B06-8973-787FE3D1527D"}
 */
var secondaryColor = "#FFFFFF";

/**
 * Callback method when form is (re)loaded.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"9A3921DF-552C-41D3-8D96-999FF469F78A"}
 */
function onLoad(event) {
	var propMainColor = scopes.svyProperties.getUserPropertyValue("MAIN-COLOR", "style")
	if (propMainColor) {
		primaryColor = propMainColor;
	}
	
	var propSecondaryColor = scopes.svyProperties.getUserPropertyValue("SECONDARY-COLOR", "style")
	if (propSecondaryColor) {
		secondaryColor = propSecondaryColor;
	}
}

/**
 * @param {JSEvent} event
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"9B8F4B5A-2E1E-4D38-8128-CFD499B18D97"}
 */
function onActionApplyColors(event) {

	scopes.svyProperties.setUserProperty("MAIN-COLOR", "style", primaryColor);
	scopes.svyProperties.setUserProperty("SECONDARY-COLOR", "style", secondaryColor);
	
	scopes.cloudSample.overrideStyleColors(primaryColor, secondaryColor);
}

/**
 * @param {JSEvent} event
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"884618B4-82F5-492A-8BA5-B79BB9CFE5D2"}
 */
function onActionReset(event) {
	primaryColor = "#4880FF";
	secondaryColor = "#FFFFFF";
	
	scopes.svyProperties.setUserProperty("MAIN-COLOR", "style", primaryColor);
	scopes.svyProperties.setUserProperty("SECONDARY-COLOR", "style", secondaryColor);
	
	scopes.cloudSample.overrideStyleColors(primaryColor, secondaryColor);
}
