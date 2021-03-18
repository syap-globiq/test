/**
 *
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"8F9E2C09-D666-4E21-A342-57EACCB46444",variableType:8}
 */
var value = 0;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"870DCCFE-C3B2-42DB-983A-1AF644A63DAC",variableType:4}
 */
var lastYearValue = 0;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"D8C49940-B8C3-4418-981E-6EAC761FDD0C"}
 */
var diff = '';

/**
 * Callback method for when form is shown.
 *
 * @param {Boolean} firstShow form is shown first time after load
 * @param {JSEvent} event the event that triggered the action
 *
 *
 * @properties={typeid:24,uuid:"F7151473-8F9C-4D59-A1C4-5A4656BD7EBB"}
 */
function onShow(firstShow, event) {
	value = getValue();
	if (!value) {
		value = 0;
	}

	lastYearValue = getLastYearValue();
	if (!lastYearValue) {
		lastYearValue = 0;
	}

	diff = getDiffValue();

	updateUI();
}

/**
 * @properties={typeid:24,uuid:"7F25C79E-6004-468D-8B2E-98D0D3666053"}
 */
function updateUI() {
	if (diff[0] == "-") { // negative diff
		elements.lblDiff.removeStyleClass("bg-success");
		elements.lblDiff.addStyleClass("bg-danger");
		elements.fontawesome_decrease.visible =true;
		elements.fontawesome_increase.visible = false;
	} else { // positive diff
		elements.lblDiff.removeStyleClass("bg-danger");
		elements.lblDiff.addStyleClass("bg-success");
		elements.fontawesome_decrease.visible =false;
		elements.fontawesome_increase.visible = true;
	}
}

/**
 * @return {Number}
 * @properties={typeid:24,uuid:"62530077-C9E9-4E2E-8A0B-D038CF93829F"}
 */
function getValue() {
	return 0;
}

/**
 * @return {Number}
 * @properties={typeid:24,uuid:"8F45DCCA-E18C-4922-844A-426B93BCFFE3"}
 */
function getLastYearValue() {
	return 0;
}

/**
 * @return {String}
 * @properties={typeid:24,uuid:"B29B0172-183D-46C1-8FEA-33CF3F7B76BE"}
 */
function getDiffValue() {
	var mins = value - lastYearValue;
	var perc = 0;

	if (lastYearValue != null && lastYearValue != 0) {
		perc = mins / (lastYearValue * 100);
	} else {
		perc = 1;
	}

	perc = perc * 100;
	return perc.toFixed(2) + "%";
}
