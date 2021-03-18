/**
 * The lookup object used by this lokup form
 *
 * @protected
 * @type {scopes.svyPopupFilter.AbstractPopupFilter}
 * @properties={typeid:35,uuid:"3C7F8FC9-6083-4277-8D38-15E88C38F976",variableType:-4}
 */
var filter = null;

/**
 * @type {String}
 * @properties={typeid:35,uuid:"8BEF8CB3-74EA-44E0-9A5F-8F41F4DD41F2"}
 */
var operator = scopes.svyPopupFilter.OPERATOR.EQUALS;

/**
 * Handler for the selection callback
 *
 * @protected
 * @type {function(Array<String|Date|Number>,String,scopes.svyPopupFilter.AbstractPopupFilter)}
 * @properties={typeid:35,uuid:"9F61B19E-D6E3-4855-9777-2BD6E7C8F0C1",variableType:-4}
 */
var selectHandler = null;

/**
 * @type {JSWindow}
 *
 * @properties={typeid:35,uuid:"58EBFD96-AE11-4E69-BEEF-592D23F190D2",variableType:-4}
 */
var window;

/**
 * Set to true when the selection is confirmed. Return a value only when the selection is confirmed.
 * Force an explicit selection to return the selected values
 * 
 * @protected 
 * @properties={typeid:35,uuid:"888621A3-11F1-4BF7-9066-979DE6E01A60",variableType:-4}
 */
var confirmSelection = false;

/**
 * If true will select an empty value
 * @private  
 * @properties={typeid:35,uuid:"4CD5B8FC-C9E7-4327-8411-55D8AA782538",variableType:-4}
 */
var confirmSelectEmptyValue = false;

/**
 * Callback method for when form is shown.
 *
 * @param {Boolean} firstShow form is shown first time after load
 * @param {JSEvent} event the event that triggered the action
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"EBC67630-EBBE-4776-BBF2-6C27197ED33C"}
 */
function onShow(firstShow, event) {
	
	// set the filter values (they may have been set via APIs while form was hidden)
	setSelectedFilterValues(filter.getValues());
	if (filter.getOperator()) {
		setOperator(filter.getOperator());
	}
	
	// reset confirmSeleciton to init state false
	confirmSelection = false;
	confirmSelectEmptyValue = false;
}

/**
 * Shows this form as pop-up, returns selection in callback
 *
 * @public
 * @param {function(Array<String|Date|Number>,String,scopes.svyPopupFilter.AbstractPopupFilter)} callback The function that is called when selection happens
 * @param {RuntimeComponent} target The component which will be shown
 * @param {Number} [width] The width of the pop-up. Optional. Default is component width
 * @param {Number} [height] The height of the pop-up. Optional. Default is form height.
 *
 * @properties={typeid:24,uuid:"23332477-AC70-49F7-B9E9-8218A974CF23"}
 */
function showPopUp(callback, target, width, height) {
	selectHandler = callback;
	var w = !width ? defaultWidth() : width;
//	if (initialValue) {
//		searchText = initialValue;
//		search(searchText);
//		foundset.loadAllRecords();
//	}
	plugins.window.showFormPopup(target, this, this, 'foobar', w, height);
}

/**
 * @public
 * Creates a form popup for this form and returns it
 * 
 * @param {function(Array<String|Date|Number>,String,scopes.svyPopupFilter.AbstractPopupFilter)} callback The function that is called when selection happens
 * @param {String} [initialValue] Initial value in search. Optional. Default is empty.
 * 
 * @return {plugins.window.FormPopup}
 *
 * @properties={typeid:24,uuid:"FA38C5FD-BD64-4B0C-A9C6-CBF1C15E96A3"}
 */
function createPopUp(callback, initialValue) {
	selectHandler = callback;
	var popup = plugins.window.createFormPopup(this); 
	popup.width(defaultWidth());
	return popup;
}

/**
 * @public
 * @param {function(Array<String|Date|Number>,String,scopes.svyPopupFilter.AbstractPopupFilter)} [callback] The function that is called when selection happens. The callback function is optional for lookups in modal dialog
 * @param {Number} [x]
 * @param {Number} [y]
 * @param {Number} [width] The width of the pop-up. Optional. Default is component width
 * @param {Number} [height] The height of the pop-up. Optional. Default is form height.
 * @param {String} [initialValue] Initial value in search. Optional. Default is empty.
 * 
 * @return {Array<JSRecord>|Array<String|Date|Number>} returns the selected records; if the lookupDataprovider has been set instead it returns the lookupDataprovider values on the selected records
 *
 * @properties={typeid:24,uuid:"F2CD734C-4A24-4071-A1C5-9DCF79FFE0F1"}
 */
function showModalWindow(callback, x, y, width, height, initialValue) {
	selectHandler = callback;
	if (initialValue) {
//		searchText = initialValue;
//		search(searchText);
//		foundset.loadAllRecords();
	}
	
	var w = width ? width : defaultWidth();

	window = createWindow(x, y, w, height);
	window.show(controller.getName());
	
	// return null if selection is not confirmed
	if (confirmSelection !== true) {
		confirmSelection = false;
		return null;
	}
	
	// return empty selection
	if (confirmSelectEmptyValue === true) {
		confirmSelectEmptyValue = false;
		return [];
	}
		
		
	// return the selected values
	var filterValues = getSelectedFilterValues();
	return filterValues;
}

/**
 * @public
 * @param {JSWindow} win the JSWindow object to show
 * @param {function(Array<JSRecord>,Array<String|Date|Number>,scopes.svyPopupFilter.AbstractPopupFilter)} [callback] The function that is called when selection happens. The callback function is optional for lookups in modal dialog
 * @param {String} [initialValue] Initial value in search. Optional. Default is empty.
 * 
 * @return {Array<String|Date|Number>} returns the selected filter values
 *
 * @properties={typeid:24,uuid:"230A40A9-C29E-4A2F-839F-CBDAFD7AAD31"}
 */
function showWindow(win, callback, initialValue) {
	selectHandler = callback;
	if (initialValue) {
//		searchText = initialValue;
//		search(searchText);
//		foundset.loadAllRecords();
	}

	window = win;
	window.show(controller.getName());
	
	// return null if selection is not confirmed
	if (confirmSelection !== true) {
		confirmSelection = false;
		return null;
	}
	
	// return empty selection
	if (confirmSelectEmptyValue === true) {
		confirmSelectEmptyValue = false;
		return [];
	}
		
	// return the selected values
	var lookupValues = getSelectedFilterValues();
	return lookupValues;
}

/**
 * @public 
 * @param {Number} [x]
 * @param {Number} [y]
 * @param {Number} [width] The width of the pop-up. Optional. Default is component width
 * @param {Number} [height] The height of the pop-up. Optional. Default is form height.
 * @param {Number} [jsWindowType] Type of window; should be an option of JSWindow, Default JSWindow.MODAL_DIALOG
 * 
 * @return {JSWindow}
 * @properties={typeid:24,uuid:"B1359774-382E-4448-80EB-EB1E27B5484E"}
 */
function createWindow(x, y, width, height, jsWindowType) {
	if (!jsWindowType) jsWindowType = JSWindow.MODAL_DIALOG;
	
	var win = application.createWindow(controller.getName(), jsWindowType);

	// TODO allow to setup window as wished; object/function provider
	win.undecorated = true;
	
	var w = width ? width : defaultWidth();
	if (w && height) {
		win.setSize(w, height);
	}
	if ( (x == 0 || x > 0) && (y == 0 || y >= 0)) {
		win.setLocation(x, y);
	}
	
	return win;
}

/**
 * Hook for sub form(s) to implement specific solution model additions
 *
 * @protected
 * @param {JSForm} jsForm
 * @param {scopes.svyPopupFilter.AbstractPopupFilter} filterObj
 * @properties={typeid:24,uuid:"D97DF7D8-E172-4A1B-A136-EB32130063B4"}
 */
function onCreateInstance(jsForm, filterObj) {
	// to be overridden
}

/**
 * @public
 * @param {scopes.svyPopupFilter.AbstractPopupFilter} filterObj
 * @return {RuntimeForm<AbstractPopupFilter>}
 * @properties={typeid:24,uuid:"7A225FAF-8038-4390-804E-55B3B37C962C"}
 */
function newInstance(filterObj) {
	// TODO: does it need to be a new form instance each time !?
	
	// create JSForm clone
	var formName = controller.getName() + '_' + application.getUUID().toString().replace(/-/g,'_');
	var jsForm = solutionModel.cloneForm(formName, solutionModel.getForm(controller.getName()));

	// pass control to sub form(s)
	onCreateInstance(jsForm, filterObj);

	/** @type {RuntimeForm<AbstractPopupFilter>} */
	var form = forms[jsForm.name];
	form['filter'] = filterObj;
	
	form.setSelectedFilterValues(filterObj.getValues());
	
	if (filterObj.getOperator()) {
		form.setOperator(filterObj.getOperator());
	}

	return form;
}

/**
 * Callback when item is selected
 * @return {Array<String|Date|Number>} returns the selected values
 * @protected
 * @properties={typeid:24,uuid:"9FA30759-D016-43FB-8527-AB0DB65FF6BC"}
 */
function onSelect() {
	
	// confirmSelection
	confirmSelection = true;

	// dismiss popup
	dismiss();
	
	if (confirmSelectEmptyValue === true) {
		// invoke callback
		executeSelectHandler([]);
		return [];
	}

	var filterValues = getSelectedFilterValues();

	// invoke callback
	executeSelectHandler(filterValues);

	// return the value. May be used by a modal dialog
	return filterValues;
}

/**
 * @private 
 * @properties={typeid:24,uuid:"39875490-89E2-483E-BF97-37473A193FA0"}
 */
function executeSelectHandler(selectedValues) {
	// invoke callback
	if (selectHandler) {
		// TODO can we just return the selected values and the filterObject itself instead of so many arguments ?
		selectHandler.call(this, selectedValues, operator, filter);
	}
}

/**
 * Dismiss the lookup returning an empty selection; returns an empty array [] as result.
 * 
 * @return {Array}
 * 
 * @protected 
 * @properties={typeid:24,uuid:"BD6BEF20-A395-4449-AC96-4B9CB452371A"}
 */
function selectEmptyValue() {
	confirmSelection = true;
	confirmSelectEmptyValue = true;
	
	dismiss();
	
	// invoke callback
	executeSelectHandler([]);

	return [];
}

/**
 * @return {Array<String|Date|Number>}
 * @protected 
 * @properties={typeid:24,uuid:"72534BFA-AF8D-4C12-A1D0-760F2B20EEA4"}
 */
function getSelectedFilterValues() {
	return [];
}

/**
 * @public  
 * @param {Array} selectedValues
 *
 * @properties={typeid:24,uuid:"173ECAC9-9A4B-4070-B84A-9E8EE85962E8"}
 */
function setSelectedFilterValues(selectedValues) {
	throw "To be implemented";
}

/**
 * @return {String}
 * @public  
 * @properties={typeid:24,uuid:"4DDB2E2B-74ED-4961-8542-E459CE465440"}
 */
function getOperator() {
	return operator;
}

/**
 * @public  
 * @param {String} defaultOperator
 *
 * @properties={typeid:24,uuid:"922E1870-6AEE-46EC-91F6-BEB8F36657B9"}
 */
function setOperator(defaultOperator) {
	// FIXME restrict the operator types
	if (defaultOperator) {
		operator = defaultOperator;
	}
}

/**
 * Cancek the selection and dismiss the popup;
 * @protected 
 * @properties={typeid:24,uuid:"98FF1FB4-9DBF-48EE-A54E-A7B6C3E6C727"}
 */
function cancel() {
	// discard any selection
	confirmSelection = false;
	dismiss();
}

/**
 * Dismisses the popup
 *
 * @protected
 * @properties={typeid:24,uuid:"F18750A2-44A6-4CC0-B6A9-C973F0569851"}
 */
function dismiss() {
	if (window) {
		window.hide();
		window = null;
	} else {
		plugins.window.closeFormPopup(null);
	}
}

/**
 * Callback method when form is (re)loaded.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"713CB6FC-7348-4166-89FB-0F11403F1850"}
 */
function onLoad(event) {}

/**
 * Handle hide window.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @return {Boolean}
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"87379F0B-072F-4151-A8A6-E3FC0F547C35"}
 */
function onHide(event) {
	onSelect()
	return true
}

/**
 * @return {Number}
 * @protected 
 * @properties={typeid:24,uuid:"3C5B0CAD-4EBE-4991-91E8-07E298AB2B38"}
 */
function defaultWidth() {
	return 300;
}
