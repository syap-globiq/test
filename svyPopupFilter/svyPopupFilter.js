/**
 * @private 
 * @type {String}
 *
 * @properties={typeid:35,uuid:"988201FA-4992-4215-9C01-758AA36D2E01"}
 */
var SVY_POPUP_FILTER_VERSION = '2.0.0';

/**
 * @public
 * @enum 
 * @properties={typeid:35,uuid:"39D1503E-471D-4DFC-A6EC-B8EF46289CF3",variableType:-4}
 */
var OPERATOR = {
	IS_NULL: "isNull",
	NOT_NULL: "!isNull",
	EQUALS: "eq",
	EQUALS_OR_NULL: "^||eq",
	/** All values starting with search input e.g. LIKE SEARCH_WORD% */ 
	LIKE: "like",
	/** All values containing search input e.g. LIKE %SEARCH_WORD% */ 
	LIKE_CONTAINS: "like_contains",
	GREATER_EQUAL: "ge",
	GREATER_THEN: "gt",
	SMALLER_EQUAL: "le",
	SMALLER_THEN: "lt",
	BETWEEN: "BETWEEN",
	IS_IN: "IN"
};

/**
 * @public 
 * @enum
 * @properties={typeid:35,uuid:"9526B2AE-E202-4A50-B60E-5F6A61A6A4DE",variableType:-4}
 */
var STYLING = {
	MUTLI_SELECT_ICON_COLUMN_WIDTH: '50',
	MULTI_SELECT_SHOW_TILE_HEADERS: true,
	CLOSE_ICON: 'fa fa-close',
	REMOVE_ICON: 'fa fa-trash',
	EXCLUDE_ICON: 'fas fa-minus-circle',
	INCLUDE_ICON: 'fas fa-check-circle',
	OPEN_FILTER_ICON: 'fas fa-angle-down',
	REMOVE_FILTER_ICON: 'fas fa-times'
};

/**
 * @enum  
 * @properties={typeid:35,uuid:"A96D6D86-BD86-4B5B-A522-ECC0717FF6B8",variableType:-4}
 */
var LOCALE = {
	filterPopupMenu: {
		addFilter: 'Add filter'
	},
	svyCheckPopupFilter : {
		labelChecked: 'Yes',
		labelUnchecked: 'No'
	},
	svyDatePopupFilter : {
		labelTitle: 'Date',
		labelToday: 'Today',
		labelTomorrow: 'Tomorrow',
		labelThisWeek: 'This week',
		labelNextWeek: 'Next week',
		labelThisMonth: 'This month',
		labelNextMonth: 'Next month',
		labelThisYear: 'This year',
		labelLastYear: 'Last year',
		operator: {
			EQUALS: 'Specific Dates',
			GREATER_EQUAL: 'Before than',
			SMALLER_EQUAL: 'Later than',
			BETWEEN: 'Between'
		}
	},
	svyTokenPopupFilter : {
		searchbox: {placeholderText: 'Type filter value...'},
		labelRemoveAll: 'Remove all'
	},
	svySelectPopupFilter : {
		searchText: { placeholderText: 'Search...' },
		labelSelectAll: 'Select all',
		labelDeselectAll: 'Deselect all'
	},
	svyIntegerPopupFilter : {
		labelTitle: 'Type filter value...',
		labelEqualTo: 'Equal to',
		labelGreater: 'Bigger than',
		labelSmaller: 'Smaller than',
		labelBetween: 'Between'
	},
	svyNumberPopupFilter : {
		labelTitle: 'Type filter value...',
		labelEqualTo: 'Equal to',
		labelGreater: 'Bigger than',
		labelSmaller: 'Smaller than',
		labelBetween: 'Between'
	}
};

/**
 *
 * @public
 * @return {SvyDateFilter}
 * @properties={typeid:24,uuid:"CAD4CDAB-E72C-4394-9447-3644C97BF0FE"}
 */
function createDateFilter() {
	return new SvyDateFilter();
}

/**
*
* @public
* @return {SvyIntegerFilter}
* @properties={typeid:24,uuid:"BEAC7A31-3616-45C2-A225-B14C3DC741FB"}
*/
function createIntegerFilter() {
	return new SvyIntegerFilter();
}

/**
 *
 * @public
 * @return {SvyNumberFilter}
 * @properties={typeid:24,uuid:"F6BED3F4-841A-4202-9AEE-3C49D3C62422"}
 */
function createNumberFilter() {
	return new SvyNumberFilter();
}

/**
* @public
* @return {SvyTokenFilter}
* @properties={typeid:24,uuid:"F00FE2C2-0028-47D9-B149-8A5BFC5BF385"}
*/
function createTokenFilter() {
	return new SvyTokenFilter();
}

/**
* @param {String} dataProvider
* @param {scopes.svyLookup.Lookup} lookup
* @public
* @return {SvySelectFilter}
* @properties={typeid:24,uuid:"AEA44CD1-08A4-4FD9-8713-42918377A11C"}
*/
function createSelectFilter(dataProvider, lookup) {
	return new SvySelectFilter(dataProvider, lookup);
}

/**
*
* @public
* @return {SvyCheckFilter}
* @properties={typeid:24,uuid:"40D19C13-BA73-489F-A722-676F326E1BC7"}
*/
function createCheckFilter() {
	return new SvyCheckFilter();
}

/**
 * @private 
 * @deprecated  
 * @param {String} [filterName]
 * 
 * @constructor 
 * @properties={typeid:24,uuid:"D1DCEC38-BC94-4FAC-BE1F-03E933BE5E8C"}
 */
function FilterParam(filterName){
	
	/** 
	 * @type {String}
	 * @private 
	 * */
	var name = filterName ? filterName : this.getDataSource();
		
	/** 
	 * @private 
	 * @type {String} */
	var filterDataprovider;
	
	/** 
	 * @private 
	 * @type {String} */
	var operator;

	/** 
	 * @private 
	 * @type {String|Number|Array}
	 * */
	var value;
	
	/**
	 * Sets the popupFilter dataprovider
	 * 
	 * @public 
	 * @param {String} dataProvider
	 */
	this.setFilterDataprovider = function(dataProvider){
		filterDataprovider = dataProvider;
	}
	
	/**
	 * Gets the filter dataprovider
	 * @public 
	 * @return {String}
	 */
	this.getFilterDataprovider = function(){
		return filterDataprovider;
	}
	
	/**
	 * Gets the filter name
	 * @public 
	 * @return {String}
	 */
	this.getFilterName = function(){
		return name;
	}
	
	/**
	 * Sets the filter operator
	 * 
	 * @public 
	 * @param {String} filterOperator
	 */
	this.setFilterOperator = function(filterOperator){
		operator = filterOperator;
	}
	
	/**
	 * Gets the filter operator
	 * @public 
	 * @return {String}
	 */
	this.getFilterOperator = function(){
		return operator;
	}
	
	/**
	 * Sets the filter value
	 * 
	 * @public 
	 * @param {String|Number|Array} filterValue
	 */
	this.setFilterValue = function(filterValue){
		value = filterValue;
	}
	
	/**
	 * Gets the filter value
	 * @public 
	 * @return {String|Number|Array}
	 */
	this.getFilterValue = function(){
		return value;
	}
}

/**
 * 
 * @constructor
 * @public  
 * @properties={typeid:24,uuid:"E1F6755A-CA6B-4112-920B-8F37EF6757E4"}
 */
function AbstractPopupFilter(){
	
	/**
	 * @protected    
	 * @type {String}
	 *  */
	this.id = application.getUUID().toString();
	
	/** 
	 * @protected    
	 * @type {String}
	 * @ignore
	 * */
	this.operator = null;
	
	/** 
	 * @protected    
	 * @type {Array}
	 * */
	this.filterValues = [];
	
	/** 
	 * @protected    
	 * @type {String}
	 * */
	this.dataprovider = null;
	
	/** 
	 * @protected    
	 * @type {String}
	 * */
	this.text = null;
	
	/** 
	 * @protected 
	 * @type {Array<FilterParam>} */
	this.filterParams = [];
	
	/** 
	 * @protected 
	 * @type {Array}
	 * */	
	this.params = [];
	
	/** 
	 * @type {String} 
	 * @protected 
	 * */
	this.rendererForm = null;
	
	/** 
	 * @type {String}
	 * @protected 
	 * */
	this.formInstanceName = null;
}

/**
 * 
 * @public 
 * @constructor 
 * 
 * @extends {AbstractPopupFilter}
 * @properties={typeid:24,uuid:"9ED8E5EC-1997-4A3F-8EC6-996C683D8525"}
 */
function SvyDateFilter(){
	
	AbstractPopupFilter.call(this);
	
	// TODO set the default date filter
	this.setRendererForm(forms.svyDatePopupFilter);
}

/**
 * 
 * @public 
 * @constructor 
 * 
 * @extends {AbstractPopupFilter}
 * @properties={typeid:24,uuid:"40949CD4-5BB7-4414-B518-F1168F82234F"}
 */
function SvyIntegerFilter(){
	
	AbstractPopupFilter.call(this);
	
	this.setRendererForm(forms.svyNumberPopupFilter);
}

/**
 * 
 * @public 
 * @constructor 
 * 
 * @extends {AbstractPopupFilter}
 * @properties={typeid:24,uuid:"7E1E92F4-9F9C-424E-B1FF-C8BFB6407B58"}
 */
function SvyNumberFilter(){
	
	AbstractPopupFilter.call(this);
	
	this.setRendererForm(forms.svyNumberPopupFilter);
}

/**
 * 
 * @public 
 * @constructor 
 * 
 * @extends {AbstractPopupFilter}
 * @properties={typeid:24,uuid:"C644140F-72B5-423A-8BE2-56D7CCE8BC68"}
 */
function SvyTokenFilter(){
	
	AbstractPopupFilter.call(this);
	
	this.setRendererForm(forms.svyTokenPopupFilter);
}

/**
 * 
 * @public 
 * @constructor 
 * 
 * @extends {AbstractPopupFilter}
 * @properties={typeid:24,uuid:"FAD6ACF4-3054-43D4-8D5C-32B4909271C4"}
 */
function SvyCheckFilter(){
	
	AbstractPopupFilter.call(this);
	
	this.setRendererForm(forms.svyCheckPopupFilter);
}

/**
 * @param {String} dataProvider will override the lookupDataProvider
 * @param {scopes.svyLookup.Lookup} lookup
 * 
 * @public 
 * @constructor 
 * 
 * @extends {AbstractPopupFilter}
 * @properties={typeid:24,uuid:"C1180D77-9E21-495B-B6C9-8814C3846D63"}
 */
function SvySelectFilter(dataProvider, lookup){
	
	this.dataprovider = dataProvider;
	// TODO shall i alway override the lookup dataprovider ? In case of a valuelist i dont want to
	if (!lookup.getLookupDataProvider()) {
		lookup.setLookupDataProvider(dataProvider);
	}
	
	this.lookup = lookup;
	
	AbstractPopupFilter.call(this);
}

/**
 * @constructor
 * @private 
 * @properties={typeid:24,uuid:"EFDE7B95-A6D0-4FF4-B5D3-BC4C57711061"}
 */
function initAbstractPopupFilter() {
	
	/**
	 * @protected 
	 * @param {RuntimeForm<AbstractPopupFilter>} popupFilterForm
	 * @this {AbstractPopupFilter}
	 * @deprecated
	 */
	AbstractPopupFilter.prototype.setUIFormRendered = function(popupFilterForm) {
		if (!popupFilterForm) {
			throw new scopes.svyExceptions.IllegalArgumentException("Illegal argument popupFilterForm. popupFilterForm must be an instance of AbstractPopupFilter form")
		}
		if (!scopes.svyUI.isJSFormInstanceOf(popupFilterForm, "AbstractPopupFilter")) {
			throw new scopes.svyExceptions.IllegalArgumentException("The given popupFilterForm must be an instance of AbstractPopupFilter form.");
		}
		this.rendererForm = popupFilterForm['controller'].getName();
	}
	
	/**
	 * @public
	 * @param {RuntimeForm<AbstractPopupFilter>|RuntimeForm<AbstractLookup>} popupFilterForm
	 * @this {AbstractPopupFilter}
	 */
	AbstractPopupFilter.prototype.setRendererForm = function(popupFilterForm) {
		if (!popupFilterForm) {
			throw new scopes.svyExceptions.IllegalArgumentException("Illegal argument popupFilterForm. popupFilterForm must be an instance of AbstractPopupFilter form")
		}
		if (!scopes.svyUI.isJSFormInstanceOf(popupFilterForm, "AbstractPopupFilter")) {
			throw new scopes.svyExceptions.IllegalArgumentException("The given popupFilterForm must be an instance of AbstractPopupFilter form.");
		}
		this.rendererForm = popupFilterForm['controller'].getName();
	}
	
	/**
	 * Gets the filter name
	 * @public 
	 * @return {String}
	 * @this {AbstractPopupFilter}
	 */
	AbstractPopupFilter.prototype.getID = function(){
		return this.id;
	}
	
	/**
	 * @public 
	 * @param {String} operator a value from scopes.svyPopupFilter.OPERATOR
	 * @this {AbstractPopupFilter}
	 */
	AbstractPopupFilter.prototype.setOperator = function(operator){
		this.operator = operator;
	}
	
	/**
	 * @public 
	 * @return {String}
	 * @this {AbstractPopupFilter}
	 */
	AbstractPopupFilter.prototype.getOperator = function(){
		return this.operator;
	}
	
	/**
	 * @public 
	 * @param {Array} values
	 * @this {AbstractPopupFilter}
	 */
	AbstractPopupFilter.prototype.setValues = function(values){
		this.filterValues = values.concat([]);
	}
	
	/**
	 * @public 
	 * @return {Array}
	 * @this {AbstractPopupFilter}
	 */
	AbstractPopupFilter.prototype.getValues = function(){
		if (this.filterValues) {
			return this.filterValues.concat([]);
		} else {
			return [];
		}
	}
	
	/**
	 * Sets the popupFilter dataprovider
	 *
	 * @public
	 * @param {String} dataProvider
	 * @this {AbstractPopupFilter}
	 */
	AbstractPopupFilter.prototype.setDataProvider = function(dataProvider) {
		this.dataprovider = dataProvider;
	}	


	/**
	 * Gets the popupFilter dataprovider
	 * @public
	 * @return {String}
	 * @this {AbstractPopupFilter}
	 */
	AbstractPopupFilter.prototype.getDataProvider = function() {
		return this.dataprovider;
	}
	
	/**
	 * Sets the popupFilter text
	 * @public 
	 * @param {String} text
	 * @this {AbstractPopupFilter}
	 */
	AbstractPopupFilter.prototype.setText = function(text) {
		this.text = text;
	}	


	/**
	 * Gets the popupFilter text
	 * @public 
	 * @return {String}
	 * @this {AbstractPopupFilter}
	 */
	AbstractPopupFilter.prototype.getText = function() {
		return this.text;
	}
	
	/**
	 * 
	 * Add a Filter Param
	 * 
	 * @deprecated 
	 * @protected    
	 * @param {String} filterOperator
	 * @param {String} filterValue
	 * @param {String} filterParamName
	 * @SuppressWarnings(deprecated)
	 * @this {AbstractPopupFilter}
	 */
	AbstractPopupFilter.prototype.addFilterParam = function(filterOperator, filterValue, filterParamName) {
		var filterParam = new FilterParam(filterParamName);
		filterParam.setFilterDataprovider(this.getDataProvider());
		filterParam.setFilterOperator(filterOperator);
		filterParam.setFilterValue(filterValue);
		this.filterParams.push(filterParam);
	}
	
	/**
	 * Gets the filter filterName
	 * @deprecated
	 * @SuppressWarnings(deprecated)
	 * @protected 
	 * @return {Array<FilterParam>}
	 * @this {AbstractPopupFilter}
	 */
	AbstractPopupFilter.prototype.getFilterParams = function(){
		return this.filterParams;
	}
	
	/**
	 * Gets the filter filterName
	 * 
	 * @param {String} filterParamName
	 * @deprecated
	 * @SuppressWarnings(deprecated)
	 * @protected 
	 * @return {FilterParam}
	 * @this {AbstractPopupFilter}
	 */
	AbstractPopupFilter.prototype.getFilterParam = function(filterParamName){
		return this.filterParams[this.getFilterParamIndex(filterParamName)];
	}
	
	/**
	 * Gets the filter filterName
	 * 
	 * @param {String} filterParamName
	 * @deprecated
	 * @SuppressWarnings(deprecated)
	 * @protected 
	 * @this {AbstractPopupFilter}
	 */
	AbstractPopupFilter.prototype.removeFilterParam = function(filterParamName){
		this.filterParams.splice(this.getFilterParamIndex(filterParamName), 1);
	}
	
	/** 
	 * Clear the filter params
	 * @deprecated
	 * @protected 
	 * @this {AbstractPopupFilter}
	 * */
	AbstractPopupFilter.prototype.clearFilterParams = function(){
		this.filterParams = [];
	}
	
	/** 
	 * @protected  
	 * @param {String} filterParamName
	 * @deprecated
	 * @return {Number}
	 * @this {AbstractPopupFilter}
	 *  */
	AbstractPopupFilter.prototype.getFilterParamIndex = function(filterParamName) {
		for (var i = 0; i < this.filterParams.length; i++) {
			if (this.filterParams[i].getFilterName() == filterParamName) {
				return i;
			}
		}
		return -1;
	}

	/**
	 * Add a params to be added into the onSelect callback arguments
	 * @param {Object} param
	 * @public
	 * @this {AbstractPopupFilter}
	 * */
	AbstractPopupFilter.prototype.addParam = function(param) {
		this.params.push(param);
	}

	/**
	 * @public
	 * @return {Array}
	 * @this {AbstractPopupFilter}
	 * */
	AbstractPopupFilter.prototype.getParams = function() {
		return this.params;
	}

	/**
	 * Removes a param at the specified index
	 * @public
	 * @param {Number} index
	 * @this {AbstractPopupFilter}
	 */
	AbstractPopupFilter.prototype.removeParam = function(index) {
		this.params.splice(index, 1);
	}

	/**
	 * Clear the params
	 * @public
	 * @this {AbstractPopupFilter}
	 */
	AbstractPopupFilter.prototype.clearParams = function() {
		this.params = [];
	}
	
	/**
	 * @public 
	 * @return {{
				id: String,
				dataprovider: String,
				operator: String,
				params: Object,
				text: String,
				values: Array,
				constructor: Object}}
	 *
	 * @this {AbstractPopupFilter}
	 */
	AbstractPopupFilter.prototype.getState = function() {
		return {
			id: this.getID(),
			dataprovider: this.getDataProvider(),
			operator: this.getOperator(),
			params: this.getParams(),
			text: this.getText(),
			values: this.getValues(),
			constructor: this.constructor
		}
	}
	
	/**
	 * @public 
	 * @param {{
				id: String,
				dataprovider: String,
				operator: String,
				params: Object,
				text: String,
				values: Array}} jsonState
	 * @return {AbstractPopupFilter}
	 *
	 * @this {AbstractPopupFilter}
	 */
	AbstractPopupFilter.prototype.restoreState = function(jsonState) {
		var filter = this;
		filter.setDataProvider(jsonState.dataprovider);
		filter.setOperator(jsonState.operator);
		filter.setText(jsonState.text);
		filter.setValues(jsonState.values);
		return this;
	}
	
	/**
	 * @return {RuntimeForm<AbstractPopupFilter>}
	 * @this {scopes.svyPopupFilter.AbstractPopupFilter}
	 * @protected 
	 *  */
	AbstractPopupFilter.prototype.getFormInstance = function() {

		/** @type {RuntimeForm<AbstractPopupFilter>} */
		var runtimeForm;
		if (this.formInstanceName && this.formInstanceName in forms) { // form is in memory
			runtimeForm = forms[this.formInstanceName];
		} else if (this.formInstanceName) {	// form went out of memory, then clear the form instance
			solutionModel.removeForm(this.formInstanceName);
		} 
		
		// create new form instance
		if (!runtimeForm) {	

			/** @type {RuntimeForm<AbstractPopupFilter>} */
			var popupFilterForm;
			if (this.rendererForm) {
				popupFilterForm = forms[this.rendererForm];
			} else {
				throw new scopes.svyExceptions.IllegalStateException("No form template defined for AbstractPopupFilter");
			}

			runtimeForm = popupFilterForm.newInstance(this);
			this.formInstanceName = runtimeForm['controller'].getName();
		}
		return runtimeForm;
	}
	
	/**
	 * Shows the popupFilter
	 *
	 * @public
	 * @param {function(Array<String|Date|Number>,String,AbstractPopupFilter)} callback The function that will be called when a selection is made; the callback returns the following arguments: {Array<JSRecord>} record, {Array<String|Date|Number>} popupFilterValue , {AbstractPopupFilter} popupFilter
	 * @param {RuntimeComponent} target The component to show relative to
	 * @param {Number} [width] The width of the popupFilter. Optional. Default is same as target component
	 * @param {Number} [height] The height of the popupFilter. Optional. Default is implementation-specifc.
	 * @this {scopes.svyPopupFilter.AbstractPopupFilter}
	 */
	AbstractPopupFilter.prototype.showPopUp = function(callback, target, width, height) {
		
		/** @type {RuntimeForm<AbstractPopupFilter>} */
		var runtimeForm = this.getFormInstance();
		runtimeForm.showPopUp(callback, target, width, height);
	}
	
	/**
	 * Creates and returns the popupFilter
	 * 
	 * @public 
	 * @param {function(Array<String|Date|Number>,String,scopes.svyPopupFilter.AbstractPopupFilter)} callback The function that will be called when a selection is made; the callback returns the following arguments: {Array<JSRecord>} record, {Array<String|Date|Number>} popupFilterValue , {AbstractPopupFilter} popupFilter
	 * @return {plugins.window.FormPopup}
	 * @this {AbstractPopupFilter}
	 */
	AbstractPopupFilter.prototype.createPopUp = function(callback) {
		/** @type {RuntimeForm<AbstractPopupFilter>} */
		var runtimeForm = this.getFormInstance();
		return runtimeForm.createPopUp(callback);
	}

	/**
	 * Shows the popupFilter in a modal Window
	 *
	 * @public
	 * @param {function(Array<String|Date|Number>,String,scopes.svyPopupFilter.AbstractPopupFilter)} [callback] The function that will be called when a selection is made; the callback returns the following arguments: {Array<JSRecord>} record, {Array<String|Date|Number>} popupFilterValue , {AbstractPopupFilter} popupFilter
	 * @param {Number} [x]
	 * @param {Number} [y]
	 * @param {Number} [width] The width of the popupFilter. Optional. Default is same as target component
	 * @param {Number} [height] The height of the popupFilter. Optional. Default is implementation-specifc.
	 *
	 * @return {Array<JSRecord>|Array<String|Date|Number>} returns the selected records; if the popupFilterDataprovider has been set instead it returns the popupFilterDataprovider values on the selected records. Returns null if the window is closed without a selection or an empty selection
	 * @this {AbstractPopupFilter}
	 */
	AbstractPopupFilter.prototype.showModalWindow = function(callback, x, y, width, height) {
		var runtimeForm = this.getFormInstance();

		// TODO return the actual values, no need of params
		return runtimeForm.showModalWindow(callback, x, y, width, height);
	}	
	
	
	/**
	 * Shows the popupFilter in a Window
	 *
	 * @public
	 * @param {JSWindow} win the JSWindow object to show
	 * @param {function(Array<JSRecord>,Array<String|Date|Number>,AbstractPopupFilter)} [callback] The function that will be called when a selection is made; the callback returns the following arguments: {Array<JSRecord>} record, {Array<String|Date|Number>} popupFilterValue , {AbstractPopupFilter} popupFilter
	 *
	 * @return {Array<String|Date|Number>} returns the selected records; if the popupFilterDataprovider has been set instead it returns the popupFilterDataprovider values on the selected records. Returns null if the window is closed without a selection or an empty selection
	 * @this {scopes.svyPopupFilter.AbstractPopupFilter}
	 */
	AbstractPopupFilter.prototype.showWindow = function(win, callback) {
		/** @type {RuntimeForm<AbstractPopupFilter>} */
		var runtimeForm = this.getFormInstance();

		// TODO return the actual values, no need of params
		return runtimeForm.showWindow(win, callback);
	}
	
	/**
	 * @public
	 * Creates a window object for the popupFilter; call popupFilter.showWindow(win); to show the popupFilter window
	 *
	 * @param {Number} [x]
 	 * @param {Number} [y]
 	 * @param {Number} [width] The width of the pop-up. Optional. Default is component width
 	 * @param {Number} [height] The height of the pop-up. Optional. Default is form height.
 	 * @param {Number} [jsWindowType] Type of window; should be an option of JSWindow, Default JSWindow.MODAL_DIALOG
	 *
	 * @return {JSWindow} returns a JSWindow which can be used to show the popupFilter in it using popupFilter.showWindow(window)
	 * @this {AbstractPopupFilter}
	 */
	AbstractPopupFilter.prototype.createWindow = function(x, y, width, height, jsWindowType) {
		/** @type {RuntimeForm<AbstractPopupFilter>} */
		var runtimeForm = this.getFormInstance();

		// TODO return the actual values, no need of params
		return runtimeForm.createWindow(x, y, width, height, jsWindowType);
	}
}

/**
 * @constructor 
 * @private 
 * @properties={typeid:24,uuid:"5F6ED814-D963-428A-A253-BAB7E19723A3"}
 */
function initSvyDateFilter() {
	SvyDateFilter.prototype = Object.create(AbstractPopupFilter.prototype);
	SvyDateFilter.prototype.constructor = SvyDateFilter;
}

/**
 * @constructor 
 * @private 
 * @properties={typeid:24,uuid:"37EA654C-6FC7-4573-AF99-3BBB98AB300E"}
 */
function initSvyIntegerFilter() {
	SvyIntegerFilter.prototype = Object.create(AbstractPopupFilter.prototype);
	SvyIntegerFilter.prototype.constructor = SvyIntegerFilter;
}

/**
 * @constructor 
 * @private 
 * @properties={typeid:24,uuid:"EC77FC4C-4534-4819-958B-D9A1B700018E"}
 */
function initSvyNumberFilter() {
	SvyNumberFilter.prototype = Object.create(AbstractPopupFilter.prototype);
	SvyNumberFilter.prototype.constructor = SvyNumberFilter;
}

/**
 * @constructor 
 * @private 
 * @properties={typeid:24,uuid:"B90D703F-F29C-4496-971C-88366291FAEC"}
 */
function initSvyTokenFilter() {
	SvyTokenFilter.prototype = Object.create(AbstractPopupFilter.prototype);
	SvyTokenFilter.prototype.constructor = SvyTokenFilter;
}

/**
 * @constructor 
 * @private 
 * @properties={typeid:24,uuid:"6B6B2D00-994D-486E-85A3-F19626D39D1B"}
 */
function initSvyCheckFilter() {
	SvyCheckFilter.prototype = Object.create(AbstractPopupFilter.prototype);
	SvyCheckFilter.prototype.constructor = SvyCheckFilter;
}

/**
 * @constructor 
 * @private 
 * @properties={typeid:24,uuid:"42D4D799-F710-4AD1-86CF-401ACE6A1E87"}
 */
function initSvySelectFilter() {
	SvySelectFilter.prototype = Object.create(AbstractPopupFilter.prototype);
	SvySelectFilter.prototype.constructor = SvySelectFilter;
	
	/**
	 * @param {Array} values
	 * 
	 * @this {SvySelectFilter}
	 */
	SvySelectFilter.prototype.setValues = function(values) {
		AbstractPopupFilter.prototype.setValues.call(this, values);
		
		// TODO this may not be enough if the in-memory datasource of the lookup is refreshed before show.
		this.lookup.setSelectedValues(values);
		return this;
	}
	
	
	/**
	 * @public 
	 * @return {{
				id: String,
				dataprovider: String,
				operator: String,
				params: Object,
				text: String,
				values: Array}}
	 *
	 * @this {SvySelectFilter}
	 */
	SvySelectFilter.prototype.getState = function() {

		// TODO Fixme: return pks
		var jsonState = AbstractPopupFilter.prototype.getState.call(this);
		var lookup = this.lookup;
		jsonState.values = lookup.getSelectedValues();
		
		return jsonState;
	}
	
	/**
	 * @public 
	 * @param {{
				id: String,
				dataprovider: String,
				operator: String,
				params: Object,
				text: String,
				values: Array,
				lookupSelectedRecords: Array}} jsonState
	 * @return {AbstractPopupFilter}
	 *
	 * @this {SvySelectFilter}
	 */
	SvySelectFilter.prototype.restoreState = function(jsonState) {

		AbstractPopupFilter.prototype.restoreState.call(this, jsonState);
		if (jsonState.values) {
			// TODO this may not be enough if the in-memory datasource of the lookup is refreshed before show.
			this.lookup.setSelectedValues(jsonState.values);
		}
		return this;
	}
	
	/**
	 * @public
	 * @return {scopes.svyLookup.Lookup}
	 * @this {SvySelectFilter}
	 */
	SvySelectFilter.prototype.getLookup = function() {
		return this.lookup;
	}
	
	/**
	 * Shows the popupFilter
	 *
	 * @public
	 * @param {function(Array<String|Date|Number>,String,AbstractPopupFilter)} callback The function that will be called when a selection is made; the callback returns the following arguments: {Array<JSRecord>} record, {Array<String|Date|Number>} popupFilterValue , {AbstractPopupFilter} popupFilter
	 * @param {RuntimeComponent} target The component to show relative to
	 * @param {Number} [width] The width of the popupFilter. Optional. Default is same as target component
	 * @param {Number} [height] The height of the popupFilter. Optional. Default is implementation-specifc.
	 * @this {SvySelectFilter}
	 */
	SvySelectFilter.prototype.showPopUp = function(callback, target, width, height) {
		var thisInstance = this;
		function svySelectCallback(records, values, lookup) {
			if (callback) {
				callback.call(this, values, OPERATOR.IS_IN, thisInstance);
			}
		}
		
		this.lookup.showPopUp(svySelectCallback, target, width, height);
	}
	
	/**
	 * Creates and returns the popupFilter
	 * 
	 * @public 
	 * @param {function(Array<String|Date|Number>,String,scopes.svyPopupFilter.AbstractPopupFilter)} callback The function that will be called when a selection is made; the callback returns the following arguments: {Array<JSRecord>} record, {Array<String|Date|Number>} popupFilterValue , {AbstractPopupFilter} popupFilter
	 * @return {plugins.window.FormPopup}
	 * @this {SvySelectFilter}
	 */
	SvySelectFilter.prototype.createPopUp = function(callback) {
		var thisInstance = this;
		function svySelectCallback(records, values, lookup) {
			if (callback) {
				callback.call(this, values, OPERATOR.IS_IN, thisInstance);
			}
		}
		this.lookup.setSelectedValues(thisInstance.getValues())
		return this.lookup.createPopUp(svySelectCallback);
	}

	/**
	 * Shows the popupFilter in a modal Window
	 *
	 * @public
	 * @param {function(Array<String|Date|Number>,String,AbstractPopupFilter)} [callback] The function that will be called when a selection is made; the callback returns the following arguments: {Array<JSRecord>} record, {Array<String|Date|Number>} popupFilterValue , {AbstractPopupFilter} popupFilter
	 * @param {Number} [x]
	 * @param {Number} [y]
	 * @param {Number} [width] The width of the popupFilter. Optional. Default is same as target component
	 * @param {Number} [height] The height of the popupFilter. Optional. Default is implementation-specifc.
	 *
	 * @return {Array<JSRecord>|Array<String|Date|Number>} returns the selected records; if the popupFilterDataprovider has been set instead it returns the popupFilterDataprovider values on the selected records. Returns null if the window is closed without a selection or an empty selection
	 * @this {SvySelectFilter}
	 */
	SvySelectFilter.prototype.showModalWindow = function(callback, x, y, width, height) {
		var thisInstance = this;
		function svySelectCallback(records, values, lookup) {
			if (callback) {
				callback.call(this, values, OPERATOR.IS_IN, thisInstance);
			}
		}
		
		return this.lookup.showModalWindow(svySelectCallback, x, y, width, height);
	}	
	
	
	/**
	 * Shows the popupFilter in a Window
	 *
	 * @public
	 * @param {JSWindow} win the JSWindow object to show
	 * @param {function(Array<String|Date|Number>,String,AbstractPopupFilter)} [callback] The function that will be called when a selection is made; the callback returns the following arguments: {Array<String|Date|Number>} popupFilterValues, {String} operator , {AbstractPopupFilter} popupFilter
	 *
	 * @return {Array<JSRecord>|Array<String|Date|Number>} returns the selected records; if the popupFilterDataprovider has been set instead it returns the popupFilterDataprovider values on the selected records. Returns null if the window is closed without a selection or an empty selection
	 * @this {SvySelectFilter}
	 */
	SvySelectFilter.prototype.showWindow = function(win, callback) {
		var thisInstance = this;
		function svySelectCallback(records, values, lookup) {
			if (callback) {
				callback.call(this, values, OPERATOR.IS_IN, thisInstance);
			}
		}
		
		return this.lookup.showWindow(win,svySelectCallback);
	}
	
	/**
	 * @public
	 * Creates a window object for the popupFilter; call popupFilter.showWindow(win); to show the popupFilter window
	 *
	 * @param {Number} [x]
 	 * @param {Number} [y]
 	 * @param {Number} [width] The width of the pop-up. Optional. Default is component width
 	 * @param {Number} [height] The height of the pop-up. Optional. Default is form height.
 	 * @param {Number} [jsWindowType] Type of window; should be an option of JSWindow, Default JSWindow.MODAL_DIALOG
	 *
	 * @return {JSWindow} returns a JSWindow which can be used to show the popupFilter in it using popupFilter.showWindow(window)
	 * @this {SvySelectFilter}
	 */
	SvySelectFilter.prototype.createWindow = function(x, y, width, height, jsWindowType) {
		return this.lookup.createWindow(x,y,width,height,jsWindowType);
	}
}

/**
 * Applies the locale strings set on svyToolbarFilter.TOOLBAR_LOCALE to the matching elements 
 * for the given form identifier which is one of TOOLBAR_LOCALE's main properties
 * 
 * @param {String} formName
 * @param {String} formType
 *
 * @properties={typeid:24,uuid:"C74D5888-4868-4880-8101-9F1BB1C97A9E"}
 */
function applyLocaleStrings(formName, formType) {
	var formValues = LOCALE[formType];
	if (formValues) {
		for ( var p in formValues ) {
			/** @type {RuntimeWebComponent<bootstrapcomponents-label>} */
			var runtimeElement = forms[formName].elements[p];
			if (runtimeElement) {
				if (formValues[p] instanceof String) {
					runtimeElement.text = formValues[p]
				} else {
					for ( var prop in formValues[p] ) {
						runtimeElement[prop] = formValues[p][prop];
					}
				}
			}
		}
	}
}

/**
 * Gets the version of this module
 * @public 
 * @return {String} the version of the module using the format Major.Minor.Revision
 * @properties={typeid:24,uuid:"41B693FE-B16A-475C-BB1C-E80485B711C0"}
 */
function getVersion() {
    return SVY_POPUP_FILTER_VERSION;
}

/**
 * @private 
 * @SuppressWarnings(unused)
 * @properties={typeid:35,uuid:"71D250A3-C102-485A-993D-B24A3D8855CC",variableType:-4}
 */
var init = (function() {
	initAbstractPopupFilter();
	initSvyDateFilter();
	initSvyIntegerFilter();
	initSvyNumberFilter();
	initSvyTokenFilter();
	initSvyCheckFilter();
	initSvySelectFilter();
})();
