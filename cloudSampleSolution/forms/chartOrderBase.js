/**
 *
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"C3BF6835-50B9-41D3-9807-F1EDFC93E607",variableType:8}
 */
var value = 0;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"9815FCBF-6B16-4004-8B0B-40566285CFC3",variableType:4}
 */
var lastYearValue = 0;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"B13A4A6D-8982-4D1B-900C-219D1F827627"}
 */
var diff = '';

/**
 * Callback method for when form is shown.
 *
 * @param {Boolean} firstShow form is shown first time after load
 * @param {JSEvent} event the event that triggered the action
 *
 *
 * @properties={typeid:24,uuid:"C6750DFD-6E53-49DD-9A96-82DE5B5B6D4E"}
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

}

/**
 * @return {Number}
 * @properties={typeid:24,uuid:"2396FBBC-64F6-49BB-BA37-FE206041CEBC"}
 */
function getValue() {
	return 0;
}

/**
 * @return {Number}
 * @properties={typeid:24,uuid:"42BB0273-11A4-4F2A-AAA6-406608946AE1"}
 */
function getLastYearValue() {
	return 0;
}

/**
 * @return {String}
 * @properties={typeid:24,uuid:"E33D294A-C043-4BBD-89EF-B54064EA60AF"}
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
