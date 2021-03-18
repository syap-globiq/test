/**
 * @private 
 * Creates a form popup for this form and returns it
 * 
 * @param {function(Array<JSRecord>,Array<String|Date|Number>,scopes.svyLookup.Lookup)} callback The function that is called when selection happens
 * @param {String} [initialValue] Initial value in search. Optional. Default is empty.
 * 
 * @return {plugins.window.FormPopup}
 *
 * @properties={typeid:24,uuid:"D3295993-D47C-4A16-AA61-4A05ACB209E4"}
 */
function createPopUp(callback, initialValue) {
	selectHandler = callback;
	var popup = plugins.window.createFormPopup(this); 
	popup.width(defaultWidth())
	return popup;
}

/**
 * @protected 
 * @return {Number}
 * @properties={typeid:24,uuid:"9AA4F775-56DD-44D3-B42F-105D1E7B775D"}
 */
function defaultWidth() {
	return 300;
}

/**
 * @param {Boolean} firstShow
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"23F81A4C-1140-4908-A176-AF5FA4A4A741"}
 * @override
 */
function onShow(firstShow,event) {
	_super.onShow(firstShow,event)
	elements.table.columns[0].width = scopes.svyPopupFilter.STYLING.MUTLI_SELECT_ICON_COLUMN_WIDTH;
	elements.table.columns.forEach(function(column) {
		column.headerStyleClass = (scopes.svyPopupFilter.STYLING.MULTI_SELECT_SHOW_TILE_HEADERS ? '' : 'display-none')
	})
}

/**
 * Callback method when form is (re)loaded.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"B17E53E3-BF3D-4090-B921-5D9E4469EAD3"}
 */
function onLoad(event) {
	elements.faClose.imageStyleClass = scopes.svyPopupFilter.STYLING.CLOSE_ICON;
	
	scopes.svyPopupFilter.applyLocaleStrings(controller.getName(), 'svySelectPopupFilter');
}

/**
 * @protected 
 * 
 * @param {JSForm} jsForm
 * @param {scopes.svyLookup.Lookup} lookupObj
 * @override
 *
 * @properties={typeid:24,uuid:"AC918557-E183-4E66-968F-F4BC69A78080"}
 */
function onCreateInstance(jsForm, lookupObj) {
	_super.onCreateInstance(jsForm,lookupObj);
	
	var jsDataSourceNode = solutionModel.getDataSourceNode(lookupObj.getDataSource());

	if (!jsDataSourceNode.getCalculation("svy_lookup_selected_item")) {
		jsDataSourceNode.newCalculation("function svy_lookup_selected_item() {if(svy_lookup_selected == 'true'){ return 'has-filter-selection'} else { return ''}}", JSColumn.TEXT);
	}
	
	var table = jsForm.findWebComponent(elements.table.getName());
	var columns = table.getJSONProperty('columns');
	
	for(var i = 1; i< columns.length; i++) {
		columns[i].styleClassDataprovider = 'svy_lookup_selected_item';
	}
	
	table.setJSONProperty('columns', columns);
}
