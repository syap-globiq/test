/**
 * @public 
 * Enum of all renderer form types available
 * @properties={typeid:35,uuid:"E4F70004-F7BE-4806-AC3C-F727EC06AF8F",variableType:-4}
 */
var FILTER_TYPES = {
	/**
	 * Date filter
	 * */
	DATE: 'datePopupFilterTemplate',
	/**
	 * INTEGER filter
	 * */
	INTEGER: 'integerPopupFilterTemplate',
	/**
	 * Number filter
	 * */
	NUMBER: 'numberPopupFilterTemplate',
	/**
	 * Tokens filter
	 * */
	TOKEN: 'tokenPopupFilterTemplate',
	/**
	 * Select filter
	 * */
	SELECT: 'selectFilterTemplate',
	/**
	 * Check filter
	 * */
	CHECK: 'checkPopupFilterTemplate'
};

/**
 * @type {String}
 * @private
 *
 * @properties={typeid:35,uuid:"472FF5A6-F073-4910-9CB1-565F46327D67"}
 */
var TOOLBAR_FILTER_NAME = "svy-toolbar-filter";

/**
 * cache locally the latest popup filter open, to be used in the callback method
 * @type {AbstractToolbarFilterUX}
 * @private 
 * @properties={typeid:35,uuid:"4E5DE070-8F3C-45A1-8804-15236FE03AAB",variableType:-4}
 */
var latestToolbarFilter = null;

/**
 * This is a Singleton
 * @type {PopupRendererForms}
 * @private  
 * @properties={typeid:35,uuid:"85FB53C2-C19C-419B-9F03-642998E3B1F4",variableType:-4}
 */
var popupRendererForms;

/**
 * This is a Singleton
 * @type {FilterConfig}
 * @private 
 * @properties={typeid:35,uuid:"9F30ABE1-06E5-4A81-BDAF-688EEE5A73F4",variableType:-4}
 */
var globalFilterConfig;

/**
 * @private 
 * @properties={typeid:24,uuid:"51DB1DD3-1632-4667-82F9-C2EF07BF1A5B"}
 */
function FilterConfig() {
	// TODO default auto-apply behavior
	// this.autoApply = true;
	
	this.useNonVisibleColumns = true;
	this.globalDateDisplayFormat = "dd-MM-yyyy";
	this.sortPickerAlphabetically = false;
}

/**
 * @since v1.1.0
 * @return {Boolean} Default true.
 * @private  
 * @properties={typeid:24,uuid:"CE62E19D-27B9-49C7-BD74-5B47D8F2F3B2"}
 */
function getConfigUseNonVisibleColumns() {
	return globalFilterConfig.useNonVisibleColumns;
}

/**
 * Use only visible columns of the grid when set to false
 * 
 * @since v1.1.0
 * @public 
 * @param {Boolean} useNonVisibleColumns Default true.
 *
 * @properties={typeid:24,uuid:"11013635-12DE-4CDF-9A28-57E9AC8784EB"}
 */
function setConfigUseNonVisibleColumns(useNonVisibleColumns) {
	 // TODO can i make it an UI property
	 globalFilterConfig.useNonVisibleColumns = useNonVisibleColumns;
}

/**
 * Sort the the filter picker alphabetically.
 * Default sort is based on column's position in grid.
 * 
 * @since v1.3.0
 * @public 
 * @param {Boolean} sortAlphabetically Default false.
 *
 * @properties={typeid:24,uuid:"A3FC9A77-CE20-40CB-A3BE-FEE796EFCBEB"}
 */
function setConfigSortPickerAlphabetically(sortAlphabetically) {
	 globalFilterConfig.sortPickerAlphabetically = sortAlphabetically;
}

/**
 * Returns true if the filter picker is sorted alphabetically
 * 
 * @since v1.3.0
 * @public 
 * @return {Boolean} 
 *
 * @properties={typeid:24,uuid:"D6F1DA49-0A25-48C6-8B6B-5769E33D8402"}
 */
function getConfigSortPickerAlphabetically(sortAlphabetically) {
	 return globalFilterConfig.sortPickerAlphabetically;
}

/**
 * Sets global display date format to be used
 * 
 * @public 
 * @param {String} displayFormat
 *
 * @properties={typeid:24,uuid:"1637F3D9-CE2A-445C-B0C3-9150B13B75C7"}
 */
function setConfigDateDisplayFormat(displayFormat) {
	if(displayFormat != null && displayFormat.trim() != "")
		globalFilterConfig.globalDateDisplayFormat = displayFormat;
}

/**
 * @constructor 
 * @private   
 * @properties={typeid:24,uuid:"EA19BC69-1CA7-4C3A-B6F3-BB972688F4BD"}
 */
function PopupRendererForms() {
	/** 
	 * @protected
	 * @type {RuntimeForm<AbstractPopupFilter>} 
	 * */
	this.datePopupFilterTemplate = {template: "svyDatePopupFilter", operator: scopes.svyPopupFilter.OPERATOR.BETWEEN};
	/** 
	 * @protected
	 * @type {RuntimeForm<AbstractPopupFilter>} 
	 * */
	this.integerPopupFilterTemplate = {template: "svyIntegerPopupFilter", operator: scopes.svyPopupFilter.OPERATOR.EQUALS};
	/** 
	 * @protected
	 * @type {RuntimeForm<AbstractPopupFilter>} 
	 * */
	this.numberPopupFilterTemplate = {template: "svyNumberPopupFilter", operator: scopes.svyPopupFilter.OPERATOR.EQUALS};
	/** 
	 * @protected
	 * @type {RuntimeForm<AbstractPopupFilter>} 
	 * */
	this.tokenPopupFilterTemplate = {template: "svyTokenPopupFilter", operator: scopes.svyPopupFilter.OPERATOR.IS_IN};
	/** 
	 * @protected
	 * @type {{template:String}} 
	 * */
	this.selectFilterTemplate = {template: "svySelectPopupFilter", operator: scopes.svyPopupFilter.OPERATOR.IS_IN};
	
	/** 
	 * @protected
	 * @type {RuntimeForm<AbstractPopupFilter>} 
	 * */
	this.checkPopupFilterTemplate = {template: "svyCheckPopupFilter", operator: scopes.svyPopupFilter.OPERATOR.EQUALS_OR_NULL};
}

/**
 * @return {PopupRendererForms}
 * @private  
 * @properties={typeid:24,uuid:"76C600A8-C6E6-4CDA-8CE1-7959A936BB36"}
 */
function getPopupRendererForms() {
	return popupRendererForms;
}

/**
 * @public 
 * Sets the renderer form for the given formType
 * @param {String} formType any of the FILTER_TYPES
 * @param {RuntimeForm<AbstractPopupFilter>|RuntimeForm<AbstractLookup>} form the form to set
 *
 * @properties={typeid:24,uuid:"D64D95B4-75A2-43D7-8D2E-1DFDEBBD64E1"}
 */
function setPopupRendererForm(formType, form) {
	popupRendererForms.setRendererForm(formType, form);
}

/**
 * @since v1.1.0
 * @public 
 * Sets the default operator for the given formType
 * 
 * Is possible to change the default operator used by the filters using the global setting _setPopupDefaultOperator_.
 * Each filter type can make use of a different set of operators; user enum scopes.svyPopupFilter.OPERATOR for available options.
 * Specifically
 * <br/>
 * <br/>
 *  - TOKEN: IS_IN(DEFAULT), LIKE, LIKE_CONTAINS<br/>
 *  - INTEGER: EQUALS(DEFAULT), BETWEEN, GREATER_EQUAL, GREATER_THEN, SMALLER_EQUAL, SMALLER_THEN<br/>
 *  - NUMBER: EQUALS(DEFAULT), BETWEEN, GREATER_EQUAL, GREATER_THEN, SMALLER_EQUAL, SMALLER_THEN<br/>
 *  - DATE: BETWEEN(DEFAULT), GREATER_EQUAL, SMALLER_EQUAL, EQUALS<br/>
 *  - CHECK : EQUALS<br/>
 *  - SELECT: IS_IN(DEFAULT)<br/>
 *  <br/>
 * 
 * The TOKEN filter type used to search on TEXT fields by default will search for an exact match using the IS_IN clause. 
 * Is possible to change such behavior into a LIKE for SEARCH_WORD% or %SEARCH_WORD% by changing the default operator to LIKE or LIKE_CONTAINS.
 * 
 * @param {String} formType any of the FILTER_TYPES
 * @param {String} operator the default operator to be used. Use enum value from scopes.svyToolbarFilter.OPERATOR 
 * 
 * @example <pre>
 *  // change default operator for TEXT token filters.
 *  scopes.svyToolbarFilter.setPopupDefaultOperator(scopes.svyToolbarFilter.FILTER_TYPES.TOKEN, scopes.svyPopupFilter.OPERATOR.LIKE);
 * </pre>
 *
 * @properties={typeid:24,uuid:"C1D86EEE-BC55-473B-A6E7-D963E3B9866E"}
 */
function setPopupDefaultOperator(formType, operator) {
	popupRendererForms.setDefaultOperator(formType, operator);
}

/**
 * Returns the default operator for the given formType
 * 
 * @param {String} formType any of the FILTER_TYPES
 * @private 
 * @return {String}
 *
 * @properties={typeid:24,uuid:"B7653AA8-FE25-49C2-950E-501F1AD2A40B"}
 */
function getPopupDefaultOperator(formType) {
	var popupTemplates = getPopupRendererForms();
	return popupTemplates.getDefaultOperator(FILTER_TYPES[formType]);
}

/**
 * @constructor
 * @private
 * @properties={typeid:24,uuid:"37935D63-8170-4771-AB8E-B448458A08E5"}
 * @AllowToRunInFind
 */
function initPopupRendererForms() {
	PopupRendererForms.prototype = Object.create(PopupRendererForms.prototype);
	PopupRendererForms.prototype.constructor = PopupRendererForms;
	
	/** 
	 * Returns the renderer form for the given formType
	 * @param {String} formType any of the FILTER_TYPES
	 * @return {RuntimeForm<AbstractPopupFilter>|RuntimeForm<AbstractLookup>}
	 * @public
	 * @this {PopupRendererForms} 
	 * */
	PopupRendererForms.prototype.getRendererForm = function(formType) {
		/** @type {{template:String}} */
		var result = this[formType];
		var formName = result.template;
		/** @type {RuntimeForm<AbstractPopupFilter>|RuntimeForm<AbstractLookup>} */
		var form = forms[formName];
		return form;
	}
	
	/** 
	 * Sets the renderer form for the given formType
	 * @param {String} formType any of the FILTER_TYPES
	 * @param {RuntimeForm<AbstractPopupFilter>|RuntimeForm<AbstractLookup>} form the form to set
	 * @return {PopupRendererForms}
	 * @public
	 * @this {PopupRendererForms} 
	 * */
	PopupRendererForms.prototype.setRendererForm = function(formType, form) {
		var formName = form['controller'].getName()
		this[formType].template = formName;
		return this;
	}	
	
	/** 
	 * Returns the default operator for the given formType
	 * @param {String} formType any of the FILTER_TYPES
	 * @return {String}
	 * @public
	 * @this {PopupRendererForms} 
	 * */
	PopupRendererForms.prototype.getDefaultOperator = function(formType) {
		/** @type {{template:RuntimeForm<AbstractPopupFilter>|RuntimeForm<AbstractLookup>, operator:String=}} */
		var result = this[formType];
		return result ? result.operator : null;
	}
	
	/** 
	 * Sets the default operator for the given formType
	 * @param {String} formType any of the FILTER_TYPES
	 * @param {String} operator the operator to set
	 * @return {PopupRendererForms}
	 * @public
	 * @this {PopupRendererForms} 
	 * */
	PopupRendererForms.prototype.setDefaultOperator = function(formType, operator) {
		
		// check if operator is allowed
		var allowedOperators = [];
		var OPERATOR = scopes.svyPopupFilter.OPERATOR;
		switch (formType) {
		case FILTER_TYPES.TOKEN:
			allowedOperators = [OPERATOR.IS_IN, OPERATOR.LIKE, OPERATOR.LIKE_CONTAINS];
			break;
		case FILTER_TYPES.SELECT:
			allowedOperators = [OPERATOR.IS_IN];
			break;
		case FILTER_TYPES.INTEGER:
		case FILTER_TYPES.NUMBER:
			allowedOperators = [OPERATOR.BETWEEN, OPERATOR.GREATER_EQUAL, OPERATOR.GREATER_THEN, OPERATOR.SMALLER_EQUAL, OPERATOR.SMALLER_THEN, OPERATOR.EQUALS, OPERATOR.EQUALS_OR_NULL];
			break;
		case FILTER_TYPES.DATE:
			allowedOperators = [OPERATOR.BETWEEN, OPERATOR.GREATER_EQUAL, OPERATOR.SMALLER_EQUAL, OPERATOR.EQUALS, OPERATOR.EQUALS_OR_NULL];
			break;
		case FILTER_TYPES.CHECK:
			allowedOperators = [OPERATOR.EQUALS, OPERATOR.EQUALS_OR_NULL];
			break;
		default:
			break;
		}
		
		if (allowedOperators.indexOf(operator) == -1) {
			
			var allowed = [];
			for (var op in OPERATOR) {
				if (allowedOperators.indexOf(OPERATOR[op]) > -1) {
					allowed.push(op);
				}
			}
			throw "The given operator is not allowed for the given form type. Allowed operators for such formType are: " + allowed.join(", ");
		}
		
		this[formType].operator = operator;
		return this;
	}
}

/**
 * @param {RuntimeComponent} uiComponent
 * 
 * @private
 * @constructor
 * @this {AbstractToolbarFilterUX}
 * @properties={typeid:24,uuid:"D21B3F79-9C77-4006-8A82-95AA24DC56AA"}
 * @AllowToRunInFind
 */
function AbstractToolbarFilterUX(uiComponent) {
	
	/**
	 * @protected 
	 * @type {RuntimeComponent}
	 */
	this.element = uiComponent;
	
	/**
	 * @protected
	 * @type {String}
	 */
	this.elementName = uiComponent.getName();

	/**
	 * @protected
	 * @type {String}
	 */
	this.formName = uiComponent.getFormName();
	
	/**
	 * @protected 
	 * @type {String}
	 */
	this.onFilterCreate = null;
	
	/**
	 * @protected
	 * @type {String}
	 */
	this.onFilterApplyEvent = null;
	
	/**
	 * @protected
	 * @type {String}
	 */
	this.onFilterAddedEvent = null;	
	
	/**
	 * @protected
	 * @type {String}
	 */
	this.onFilterRemovedEvent = null;
	
	/**
	 * @type {Boolean}
	 */
	this.autoApply = true;

	/**
	 * @protected
	 * @type {Object<scopes.svyPopupFilter.AbstractPopupFilter>}
	 */
	this.toolbarFilters = new Object();
	
	/**
	 * @protected
	 * @type {String}
	 */
	this.searchText = null;
		
	/**
	 * @type {Array<Filter>}
	 */
	this.filters = [];
	
	/**
	 * @protected
	 * @type {scopes.svySearch.SimpleSearch}
	 */
	this.simpleSearch = this.getDefaultSearch();
	
	/**
	 * @protected
	 * @type {function}
	 */
	this.onSearchCommand = null;
	
	/**
	 * @protected
	 * @type {String}
	 */
	this.onFilterApplyQueryCondition = null;
	
	// TODO allow the form to implement such funcitonalities

	// update grid filter

	// get filter tag/entry/index..

	// on click (show IT)

	// create filter
}

/**
 * Filter Toolbar implementation using the custom list from the custom-rendered-components package.
 * This implementation requires a "List Component" element and a foundset to filter.
 * You should create a toolbar filter instance at the onLoad of your form and assign it to a form variable.
 * Make sure to re-direct the onClick event of the "List Component" to the toolbar.onClick(entry, index, dataTarget, event);
 * 
 * @constructor
 * 
 * @param {RuntimeWebComponent<customrenderedcomponents-customlist>|RuntimeWebComponent<customrenderedcomponents-customlist_abs>} listComponent
 * @param {JSFoundSet} [foundsetToFilter]
 *
 * @extends {AbstractToolbarFilterUX}
 * @this {ListComponentFilterRenderer}
 * @protected 
 * @example <pre>
 * //keep track of toolbarFilter object in a form variable
 * var toolbarFilter;
 * 
 * //init the toolbarFilter at the onLoad.
 * function onLoad(event) {
 *  toolbarFilter = new scopes.svyToolbarFilter.ListComponentFilterRenderer(elements.filterToolbar, foundset)
 * }
 * 
 * //propagate the onClick event of the "List Component" to the toolbar filter.
 * function onClick(entry, index, dataTarget, event) {
 *  toolbarFilter.onClick(entry, index, dataTarget, event);
 * }
 * 
 * //optionally set a searchText for a cross-field search to further filter the result set
 * function search() {
 *  toolbarFilter.setSearchText(searchText);
 *  toolbarFilter.search();
 * }
 * </pre>
 * 
 * @properties={typeid:24,uuid:"8E1C5902-993A-4F97-98D1-676643FE105B"}
 */
function ListComponentFilterRenderer(listComponent, foundsetToFilter) {
	if (!listComponent) {
		throw 'listComponent element is required';
	}

	if (listComponent.getElementType() != "customrenderedcomponents-listcomponent" && listComponent.getElementType() != "customrenderedcomponents-customlist") {
		throw "The given listComponent element should be an element of type customrenderedcomponents-customlist; check the 'Custom List' from the Custom Rendered Components package";
	}
	
	AbstractToolbarFilterUX.call(this, listComponent);
	
	/**
	 * @protected 
	 * @type {RuntimeWebComponent<customrenderedcomponents-customlist>|RuntimeWebComponent<customrenderedcomponents-customlist_abs>}
	 */
	this.element = listComponent;
	
	/**
	 * @protected
	 * @type {Object<scopes.svyPopupFilter.AbstractPopupFilter>}
	 */
	this.toolbarFilters = new Object();
	
	//TODO: remove when old list component has finally disappeared
	if (listComponent.getElementType() == "customrenderedcomponents-listcomponent") {
		listComponent['entryRendererFunc'] = this.getRenderTemplate();
	} else {
		listComponent.entryRendererFunction = this.getRenderTemplate();
	}
	
	listComponent.addStyleClass("svy-toolbar-filter")
	listComponent.clear();
}

/**
 * 
 * @constructor 
 * 
 * @param {RuntimeWebComponent<customrenderedcomponents-customlist>|RuntimeWebComponent<customrenderedcomponents-customlist_abs>} listComponent
 * @param {RuntimeWebComponent<aggrid-groupingtable>|RuntimeWebComponent<aggrid-groupingtable_abs>} tableComponent
 * 
 * @extends {ListComponentFilterRenderer}
 * 
 * @protected 
 *
 * @properties={typeid:24,uuid:"3766EBA9-B4A1-4656-8287-5347C914884C"}
 */
function NgGridListComponentFilterRenderer(listComponent, tableComponent) {
	if (tableComponent.getElementType() != "aggrid-groupingtable") {
		throw "The given table element should be an element of type aggrid-groupingtable component; check the 'Data Grid' from the NG Grids package";
	}
	
	/**
	 * @protected 
	 * @type {RuntimeWebComponent<aggrid-groupingtable>|RuntimeWebComponent<aggrid-groupingtable_abs>}
	 */
	this.tableComponent = tableComponent;
	
	/**
	 * @protected 
	 * @type {Array<Filter>}
	 */
	this.innerColumnFiltersCache = [];
	
	//first set the table component as it is needed when creating default search
	ListComponentFilterRenderer.call(this, listComponent, tableComponent.myFoundset.foundset);

	/**
	 * @protected 
	 * @type {Array<Filter>}
	 */
	this.filters = [];
	
	/**
	 * @protected 
	 * @type {String}
	 */
	this.formName = listComponent.getFormName();
}

/**
 * @private 
 * @param {Array<scopes.svyPopupFilter.AbstractPopupFilter>} filters
 * @param {JSFoundSet} foundset
 * @param {Function} [onFilterApplyQueryCondition]
 * 
 * @return {QBSelect}
 *
 * @properties={typeid:24,uuid:"5B04853F-1A4F-4752-83E9-B332D697F935"}
 */
function getFilterQuery(filters, foundset, onFilterApplyQueryCondition) {
	var isFilterSet = false;

	var query = databaseManager.createSelect(foundset.getDataSource());

	for (var i = 0; i < filters.length; i++) {

		var filter = filters[i];
		var dp = filter.getDataProvider();
		if (!dp) {
			throw "dataprovider unknown";
		}

		var op = filter.getOperator();
		var values = filter.getValues();
		var useNot = false;
		var useIgnoreCase = true; // default to case -insensitive

		// Clean up values from empty values
		var qValues = values.filter(function(qv) {
			if (qv === undefined || qv === null || qv === '') {
				return false;
			} else {
				return true;
			}
		});
		
		//Dont use lower on date
        if(qValues.length && (qValues[0] instanceof Date || qValues[0] instanceof Number || qValues[0] instanceof UUID)) {
			useIgnoreCase = false;
		}
		
		if (useIgnoreCase != false) {
			// Clean up values from empty values
			qValues = qValues.map(function(qv) {
				if (qv instanceof String) {
					return qv.toLowerCase();
				} else {
					return qv;
				}
			});
		}

		var OPERATOR = scopes.svyPopupFilter.OPERATOR;

		// skip filter if no values & filter != NULL/NOT_NULL
		if ((op!= OPERATOR.IS_NULL && op!= OPERATOR.NOT_NULL) && (!qValues || !qValues.length)) {
			continue;
		}

		var value;

		switch (op) {
		case OPERATOR.NOT_NULL:
                useNot = true;
                break;
		case OPERATOR.IS_NULL:
				op = "isNull";
				value = null;
				// No need to lower if we want to compare NULL
				useIgnoreCase = false;
				break;
		case OPERATOR.EQUALS:

			if (qValues[0] && qValues[0] instanceof Date) {
				op = "between";
				/** @type {String} */
				var qDateValue = qValues[0];
				value = [scopes.svyDateUtils.toStartOfDay(new Date(qDateValue)), scopes.svyDateUtils.toEndOfDay(new Date(qDateValue))];
			} else {
				op = "eq";
				value = qValues[0];
			}
			break;
		case OPERATOR.EQUALS_OR_NULL:
			op = "^||eq";
			value = qValues[0];
			break;
		case OPERATOR.GREATER_EQUAL:
			op = "ge";
			value = qValues[0];
			break;
		case OPERATOR.GREATER_THEN:
			op = "gt";
			value = qValues[0];
			break;
		case OPERATOR.SMALLER_EQUAL:
			op = "le";
			value = qValues[0];
			break;
		case OPERATOR.SMALLER_THEN:
			op = "lt";
			value = qValues[0];
			break;
		case OPERATOR.BETWEEN:
			// TODO should this be handled by the popup form instead !?
			if (qValues.length == 2) {
				op = "between";
				value = qValues;
			} else if (qValues.length == 1) {
				if (values[0] === undefined || values[0] === null || values[0] === '') {
					op = "lt";
				} else {
					op = "gt";
				}
				value = qValues[0];
			} else {
				throw "this should not happen";
			}

			break;
		case OPERATOR.IS_IN:
			op = "isin";
			value = qValues;
			break;
		case OPERATOR.LIKE:
			op = "like";
			value = qValues;
			
			// add wildcard
			if (value instanceof Array) {
				value = value.map(function(qv) {
					if (qv instanceof String) {
						return qv + "%";
					} else {
						return qv;
					}
				});
			} else if (value instanceof String) {
				value = value + "%"
			}			
			break;
		case OPERATOR.LIKE_CONTAINS:
			op = "like";
			value = qValues;
			
			// add wildcard
			if (value instanceof Array) {
				value = value.map(function(qv) {
					if (qv instanceof String) {
						return "%" + qv + "%";
					} else {
						return qv;
					}
				});
			} else if (value instanceof String) {
				value =  "%"+ value + "%"
			}			
			break;
		default:
			break;
		}
		
		// apply callback
		if (onFilterApplyQueryCondition) {
			/** @type {Array} */
			var callbackValues = value instanceof Array ? value : [value];
			var callbackOperator = op;
			// TODO should pass values or parsed qValues ?
			if (onFilterApplyQueryCondition.call(this, query, filter.getDataProvider(), callbackOperator, callbackValues, filter) === false) {
				// don't apply query if custom query has been applied
				continue;
			}
		}

		/** @type {QBSelect} */
		var querySource = null;
		var aDP = dp.split('.');
		for (var j = 0; j < aDP.length - 1; j++) {
			querySource = querySource == null ? query.joins[aDP[j]] : querySource.joins[aDP[j]];
		}

		/** @type {QBColumn} */
		var whereClause = querySource == null ? query.columns[aDP[aDP.length - 1]] : querySource.columns[aDP[aDP.length - 1]];

		// do not lower case Dates.
		if (value instanceof Date) {
			useIgnoreCase = false;
		}
		
		if (useIgnoreCase != false) {
			whereClause = whereClause["lower"];
			if (value instanceof String) {
				/** @type {String} */
				var valueString = value;
				value = valueString.toLowerCase();
			} else if (value instanceof Array) {
				// Clean up values from empty values
				/** @type {Array} */
				var valueArray = value;
				value = valueArray.map(function(qv) {
					if (qv instanceof String) {
						return qv.toLowerCase();
					} else {
						return qv;
					}
				});
			}

		}
		if (useNot) {
			whereClause = whereClause["not"];
		}
		
		var or = query.or;
		var and = query.and;
		var hasAnd = false;
		var hasOr = false;
		var v;
		
		switch (op) {
		case "isNull" :
			whereClause = whereClause[op];
			break;
		case "between":
			whereClause = whereClause[op](value[0], value[1]);
			break;
		case "like":
			if (value instanceof Array) {
				for (v = 0; v < value.length; v++) {
					if (value[v] instanceof String && value[v].indexOf("!=") === 0) {
						// not like%
						and.add(whereClause.not[op](value[v].substr(2)));
						hasAnd = true;
					} else if (value[v] instanceof String && value[v].indexOf("%%!=") === 0 ) {
						// not %like%
						and.add(whereClause.not[op]("%" + value[v].substr(4)));
						hasAnd = true;
					} else {
					or.add(whereClause[op](value[v]));
						hasOr = true;
					}
				}
				
				// handle not LIKE filters
				if (hasAnd) {
					if (hasOr) {
						and.add(or);
				}
					whereClause = and;
				} else {
				whereClause = or;
				}
				
				break;
			}
			
			// handle not like
			if (value[v] instanceof String && value.indexOf("!=") === 0 ) {
				whereClause = whereClause.not[op](value.substr(2));
			} else if (value[v] instanceof String && value.indexOf("%!=") === 0 ) {
				whereClause = whereClause.not[op]("%" + value.substr(3));
			} else {
			whereClause = whereClause[op](value);
			}
			break;
		case "isin":
			if (value instanceof Array) {
				var isInValues = [];
				var notInValues = [];
				for (v = 0; v < value.length; v++) {
					if (value[v] instanceof String && value[v].indexOf("!") === 0) {
						//not
						notInValues.push(value[v].substr(1));
					} else {
						isInValues.push(value[v]);
					}
				}
				
				if (isInValues.length) {
					and.add(whereClause[op](isInValues));
				}
				if (notInValues.length) {
					and.add(whereClause.not[op](notInValues));
				}
				
				whereClause = and;
				break;
			}
			
			// handle not
			if (value.indexOf("!") === 0 ) {
				whereClause = whereClause.not[op](value.substr(2));
			}
		case "^||eq":
			whereClause = query.or.add(whereClause.eq(value)).add(whereClause.isNull);
			break;
		default:
			whereClause = whereClause[op](value);
			break;
		}
	
		
		//whereClause = op == "between" ? whereClause[op](value[0], value[1]) : whereClause[op](value);
		if (!isFilterSet) isFilterSet = true;
		/** @type {QBCondition} */
		var where = whereClause;
		query.where.add(where);

	}

	return query;
}

/**
 * @public
 * @param {Array<scopes.svyPopupFilter.AbstractPopupFilter>} filters
 * @param {JSFoundSet} foundset
 * 
 * @return {QBSelect}
 * 
 * @deprecated use AbstractToolbarFilterUX.applyFilters() instead
 *
 * @properties={typeid:24,uuid:"DE3A02D8-BD4A-42B7-9870-6E5BC70D9D2A"}
 */
function applyFilters(filters, foundset) {

	// remove previous filter
	foundset.removeFoundSetFilterParam(TOOLBAR_FILTER_NAME);

	// get the filter query
	var filterQuery;
	if (filters.length) {
		filterQuery = getFilterQuery(filters,foundset);
	
		// apply the query as filter
		foundset.addFoundSetFilterParam(filterQuery, TOOLBAR_FILTER_NAME);
	} else {
		// refresh foundset since filters have been removed
		foundset.loadRecords();
		filterQuery = foundset.getQuery();
	}
	return filterQuery;
}

/**
 * @public
 * @param {JSFoundSet} foundset
 * @return {Boolean}
 * 
 * @deprecated 
 *
 * @properties={typeid:24,uuid:"9078E2C7-E065-4E71-B4AB-D0D6F9F896E8"}
 */
function clearFilters(foundset) {
	if (foundset.removeFoundSetFilterParam(TOOLBAR_FILTER_NAME)) {
		return foundset.loadRecords();
	}
	return false;
}

/**
 * Creates a filter toolbar implementation using the custom list from the custom-rendered-components package.<br><br>
 * 
 * This implementation expects an NG "Data Grid" table component and a "Custom List" component.<br><br>
 * 
 * The filters offered from this implementation are generated from the table provided as follows:
 * 
 * <ul><li>any column with its <code>filterType</code> property set to TEXT will be offered as a token popup, allowing the user to enter any number of Strings to match</li>
 * <li>any column with its <code>filterType</code> property set to TEXT and the <code>valuelist</code> will be offered as a lookup where the user can search for and select any number of values</li>
 * <li>any column with its <code>filterType</code> property set to NUMBER will be offered as a number filter with a number of operators</li>
 * <li>any column with its <code>filterType</code> property set to DATE will be offered as a date filter with a number of operators</li></ul>
 * 
 * You should create a toolbar filter instance at the onLoad of your form and assign it to a form variable.
 * 
 * Make sure to re-direct the onClick event of the "List Component" to the toolbar.onClick(entry, index, dataTarget, event);
 * 
 * @param {RuntimeWebComponent<customrenderedcomponents-customlist>|RuntimeWebComponent<customrenderedcomponents-customlist_abs>} listComponent
 * @param {RuntimeWebComponent<aggrid-groupingtable>|RuntimeWebComponent<aggrid-groupingtable_abs>} tableOrFoundSet
 *
 * @returns {NgGridListComponentFilterRenderer}
 * @public
 * @example <pre>
 * //keep track of toolbarFilter object in a form variable
 * var toolbarFilter;
 * 
 * //init the toolbarFilter at the onLoad.
 * function onLoad(event) {
 *  toolbarFilter = scopes.svyToolbarFilter.createFilterToolbar(elements.filterToolbar, elements.table)
 * }
 * 
 * //propagate the onClick event of the "Custom List" component to the toolbar filter.
 * function onClick(entry, index, dataTarget, event) {
 *  toolbarFilter.onClick(entry, index, dataTarget, event);
 * }
 * 
 * //optionally set a searchText for a cross-field search to further filter the result set
 * function search() {
 *  toolbarFilter.search(searchText);
 * }
 * </pre>
 * 
 * @properties={typeid:24,uuid:"4BB94EC8-F877-445D-93E1-541F0A58D664"}
 */
function createFilterToolbar(listComponent, tableOrFoundSet) {
	return new NgGridListComponentFilterRenderer(listComponent, tableOrFoundSet);
}

/**
 * Creates a filter toolbar implementation using the custom list from the custom-rendered-components package.<br><br>
 * 
 * This implementation expects a "Custom List" component. An optional foundset to be filtered can be provided. If not given, the foundset of the form of the given list component is used.<br><br>
 * 
 * Filters to be offered need to be added via the API method <code>addFilter(titleText, dataProvider, filterType)</code>.<br><br>
 * 
 * You should create a toolbar filter instance at the onLoad of your form and assign it to a form variable.<br><br>
 * 
 * Make sure to re-direct the onClick event of the "List Component" to the toolbar.onClick(entry, index, dataTarget, event);
 * 
 * @example <pre>
 * //keep track of toolbarFilter object in a form variable
 * var toolbarFilter;
 * 
 * //init the toolbarFilter at the onLoad.
 * function onLoad(event) {
 *  	toolbarFilter = scopes.svyToolbarFilter.createSimpleFilterToolbar(elements.filters);
 *  
 *  	var filter = toolbarFilter.addFilter('Customer', 'customerid', scopes.svyToolbarFilter.FILTER_TYPES.SELECT);
 *  	filter.setValueList('vlPopupCustomers');
 *  
 * 		toolbarFilter.addFilter('City', 'shipcity', scopes.svyToolbarFilter.FILTER_TYPES.TOKEN);
 * }
 * 
 * //propagate the onClick event of the "Custom List" component to the toolbar filter.
 * function onClick(entry, index, dataTarget, event) {
 *  	toolbarFilter.onClick(entry, index, dataTarget, event);
 * }
 * 
 * //optionally set a searchText for a cross-field search to further filter the result set
 * function search() {
 *  	toolbarFilter.search(searchText);
 * }
 * </pre>
 * 
 * @param {RuntimeWebComponent<customrenderedcomponents-customlist>|RuntimeWebComponent<customrenderedcomponents-customlist_abs>} listComponent the component to render the filter
 * @param {JSFoundSet} [foundsetToFilter] optional foundset to filter; if not provided, the foundset of the form containing the listComponent element will be filtered
 * 
 * @returns {ListComponentFilterRenderer}
 * @public
 *
 * @properties={typeid:24,uuid:"C56AF663-9E68-422D-9F0D-4E61C253533C"}
 */
function createSimpleFilterToolbar(listComponent, foundsetToFilter) {
	return new ListComponentFilterRenderer(listComponent, foundsetToFilter);
}

/**
 * @private 
 * @param headerTitle
 * @return {String}
 *
 * @properties={typeid:24,uuid:"CACDDD32-E443-413B-8229-578929CD7F20"}
 */
function getI18nText(headerTitle) {
	/** @type {String} */
	var text = headerTitle;
	if (text && text.indexOf("i18n:") == 0) {
		text = i18n.getI18NMessage(text.replace("i18n:",""))
	}
	return text;
}

/**
 * @constructor
 * @private
 * @properties={typeid:24,uuid:"E8CB92CC-FCCF-4A46-B180-9CF800899C2E"}
 * @AllowToRunInFind
 */
function initAbstractToolbarFilterUX() {
	AbstractToolbarFilterUX.prototype = Object.create(AbstractToolbarFilterUX.prototype);
	AbstractToolbarFilterUX.prototype.constructor = AbstractToolbarFilterUX;
	
	/**
	 * Applies all filters
	 * 
	 * @public  
	 * @return {Boolean} true if records are loaded, false otherwise
	 * @this {AbstractToolbarFilterUX}
	 */
	AbstractToolbarFilterUX.prototype.applyFilters = function() {
		//force apply filters
		this._applyFilters(true);
		return this.getFoundSet().loadAllRecords();
	}
	
	/**
	 * Internal implementation, creates the filters, but does not necessarily directly apply them
	 * @protected 
	 * @this {AbstractToolbarFilterUX}
	 */
	AbstractToolbarFilterUX.prototype._applyFilters = function(forceApply) {
		var foundset = this.getFoundSet();
		if (!foundset) {
			application.output("cannot apply filters for undefined foundset. May happen for a related foundset where parent record is undefined.", LOGGINGLEVEL.DEBUG)
			return null;
		}
		
		var filters = this.getActiveFilters();
		
		// remove previous filter
		if ((this.autoApply === true || forceApply === true) && !this.onSearchCommand) {
			foundset.removeFoundSetFilterParam(TOOLBAR_FILTER_NAME);
		}
		
		// get the filter query
		var filterQuery;
		if (filters.length) {
			var onFilterApplyQueryFunction = this.onFilterApplyQueryCondition ? scopes.svySystem.convertQualifiedNameToServoyMethod(this.onFilterApplyQueryCondition) : null;
			filterQuery = getFilterQuery(filters, foundset, onFilterApplyQueryFunction);
			
			// apply the query as filter
			// DO NOTHING if onSearchCommand is set
			if ((this.autoApply === true || forceApply === true) && !this.onSearchCommand) {
				foundset.addFoundSetFilterParam(filterQuery, TOOLBAR_FILTER_NAME);
			}
		} else {
			// refresh foundset since filters have been removed
	
			// if autoApply reload records and return the query
			if ((forceApply === true || this.autoApply === true) && !this.searchText) {
				foundset.loadRecords();
				return foundset.getQuery();
			}
			
			filterQuery = foundset.getQuery();			
		}
		
		// DO NOTHING if onSearchCommand is set
		//if ((forceApply === true || this.autoApply === true) && !this.searchText) {
		if ((forceApply === true || this.autoApply === true) && !this.onSearchCommand && !this.searchText) {
			foundset.loadRecords();
		}
		
		return filterQuery;
	}
	
	/**
	 * @public 
	 * Sets whether filters are automatically applied each time they were changed (defaults to true)
	 * When set to false, filters can be applied via applyFilters() of this ToolbarFilter
	 * @param {Boolean} autoApply
	 * @return {AbstractToolbarFilterUX}
	 * @this {AbstractToolbarFilterUX}
	 */
	AbstractToolbarFilterUX.prototype.setAutoApplyFilters = function(autoApply) {
		this.autoApply = autoApply;
		return this;
	}

	/**
	 * Returns the element used to display the filters
	 * @public
	 * @return {RuntimeComponent}
	 *
	 * @this {AbstractToolbarFilterUX}
	 */
	AbstractToolbarFilterUX.prototype.getElement = function() {
		return this.element;
	}
	
	/**
	 * Allows to provide a method that will be called when the filter UI for a specific dataprovider is created<br>
	 * That method then can create and return any filter that will then be used for this column
	 * 
	 * @public
	 * @param {function(Filter): scopes.svyPopupFilter.AbstractPopupFilter} callback function that receives the Filter object as argument and must return a scopes.svyPopupFilter.AbstractPopupFilter
	 * @return {AbstractToolbarFilterUX}
	 *
	 * @this {AbstractToolbarFilterUX}
	 *  */
	AbstractToolbarFilterUX.prototype.setOnFilterCreate = function(callback) {
		this.onFilterCreate = scopes.svySystem.convertServoyMethodToQualifiedName(callback);
		return this;
	}
	
	/**
	 * Sets a callback method that is fired whenever the filter is applied<br>
	 * The callback method receives an array of values, the operator and the filter as arguments
	 * 
	 * @param {function(Array, String, scopes.svyPopupFilter.AbstractPopupFilter)} callback
	 * 
	 * @return {AbstractToolbarFilterUX}
	 *
	 * @public
	 * 
	 * @this {AbstractToolbarFilterUX}
	 *  */
	AbstractToolbarFilterUX.prototype.setOnFilterApplyCallback = function(callback) {
		this.onFilterApplyEvent = scopes.svySystem.convertServoyMethodToQualifiedName(callback);
		return this;
	}	
	
	/**
	 * Sets a callback method that is fired whenever a filter has been added<p>
	 * 
	 * The callback method receives the Filter object of the filter added as argument
	 * 
	 * @param {function()} callback
	 * 
	 * @return {AbstractToolbarFilterUX}
	 * 
	 * @public
	 *
	 * @this {AbstractToolbarFilterUX}
	 *  */
	AbstractToolbarFilterUX.prototype.setOnFilterAddedCallback = function(callback) {
		this.onFilterAddedEvent = scopes.svySystem.convertServoyMethodToQualifiedName(callback);
		return this;
	}	
	
	/**
	 * Sets a callback method that is fired whenever a filter is removed
	 * 
	 * @param {function()} callback
	 * 
	 * @return {AbstractToolbarFilterUX}
	 *
	 * @public
	 * 
	 * @this {AbstractToolbarFilterUX}
	 **/
	AbstractToolbarFilterUX.prototype.setOnFilterRemovedCallback = function(callback) {
		this.onFilterRemovedEvent = scopes.svySystem.convertServoyMethodToQualifiedName(callback);
		return this;
	}
	
	/**
	 * Set the onSearchCommand function to override the search behavior.
	 * You can add custom conditions to the filter query object;
	 * 
	 * @public
	 * @param {function(QBSelect, JSFoundSet)} callback
	 * @return {AbstractToolbarFilterUX}
	 *
	 * @this {AbstractToolbarFilterUX}
	 * @example <pre>function onSearch(query, fs) {
	 *   // add custom conditions to the query
	 *   query.where.add(query.columns.orderdate.not.isNull);
	 *   
	 *   // apply the query to the foundset
	 *   fs.loadRecords(query);
	 * }
	 * </pre>
	 * 
	 **/
	AbstractToolbarFilterUX.prototype.setOnSearchCommand = function(callback) {
		this.onSearchCommand = callback;
		return this;
	}
	
	/**
	 * Sets a callback method that is fired whenever a query for a given filter is applied<p>
	 * This can be used to either modify the filter before the query is created
	 * or to enhance the provided QBSelect yourself<p>
	 * To prevent the filter from adding criteria to the query as it would normally do, the method being
	 * called can return <code>false</code><p>
	 * The method called receives these parameters<ul>
	 * 
	 * <code>@param {QBSelect} qbSelect the query to enhance</code></br>
	 * <code>@param {String} dataprovider the column/dataprovider of this filter</code></br>
	 * <code>@param {String} operator the operator used</code></br>
	 * <code>@param {Array} values the filter's values</code></br>
	 * <code>@param {scopes.svyPopupFilter.AbstractPopupFilter} filter the filter object</code></br></ul>
	 * 
	 * @param {function(QBSelect, String, String, Array, scopes.svyPopupFilter.AbstractPopupFilter)} callback
	 * 
	 * @return {AbstractToolbarFilterUX}
	 *
	 * @public
	 * 
	 * @this {AbstractToolbarFilterUX}
	 *  */
	AbstractToolbarFilterUX.prototype.setOnFilterApplyQueryCondition = function(callback) {
		this.onFilterApplyQueryCondition = scopes.svySystem.convertServoyMethodToQualifiedName(callback);
		return this;
	}	
	
	/**
	 * Adds the given Filter to the UI
	 * 
	 * Should be overriden by a subclass implementing a UI
	 * 
	 * @param {Filter} filter
	 * 
	 * @return {Boolean}
	 * 
	 * @public 
	 *
	 * @this {AbstractToolbarFilterUX}
	 *  */
	AbstractToolbarFilterUX.prototype.addFilterUI = function(filter) {
		throw scopes.svyExceptions.AbstractMethodInvocationException("addFilterUI not implemented")
	}
	
	/**
	 * Removes the given filter
	 * 
	 * @param {Filter} filter
	 * 
	 * @public 
	 *
	 * @this {AbstractToolbarFilterUX}
	 *  */
	AbstractToolbarFilterUX.prototype.removeFilter = function(filter) {
		this.removeFilterUI(filter);
		this.filters.splice(this.filters.indexOf(filter), 1);
	}	
	
	/**
	 * Removes the given filter from the UI
	 * 
	 * Should be overriden by a subclass implementing a UI
	 * 
	 * @param {Filter} filter
	 * 
	 * @return {Boolean}
	 * 
	 * @public 
	 *
	 * @this {AbstractToolbarFilterUX}
	 *  */
	AbstractToolbarFilterUX.prototype.removeFilterUI = function(filter) {
		throw scopes.svyExceptions.AbstractMethodInvocationException("removeGridFilter not implemented")
	}
	
	/**
	 * @param {CustomType<aggrid-groupingtable.column>} column
	 * 
	 * @return {Boolean}
	 * 
	 * @protected
	 * 
	 * @deprecated 
	 *
	 * @this {AbstractToolbarFilterUX}
	 *  */
	AbstractToolbarFilterUX.prototype.showGridFilter = function(column) {
		throw scopes.svyExceptions.AbstractMethodInvocationException("showGridFilter not implemented")
	}
	
	/**
	 * Clears all filters from the UI and fires the onFilterRemovedEvent
	 * 
	 * @return {Boolean}
	 * 
	 * @public
	 *
	 * @this {AbstractToolbarFilterUX}
	 */
	AbstractToolbarFilterUX.prototype.clearFilterUI = function() {
		this._clearFilterUI()
			
		// on filter removed event
		if (this.onFilterRemovedEvent) {
			scopes.svySystem.callMethod(this.onFilterRemovedEvent);
		}
		return true;
	}
	
	/**
	 * Clears all grid filters
	 * 
	 * @return {Boolean}
	 * 
	 * @deprecated use clearFilterUI
	 * @protected 
	 *
	 * @this {AbstractToolbarFilterUX}
	 */
	AbstractToolbarFilterUX.prototype.clearGridFilters = function() {
		return this.clearFilterUI();
	}
	
	/**
	 * Clears all grid filters
	 * Internal implementation, will take care to clear the filters and update the UI
	 * Will not trigger the event onFilterRemovedEvent
	 * 
	 * @return {Boolean}
	 * 
	 * @protected 
	 *
	 * @this {AbstractToolbarFilterUX}
	 */
	AbstractToolbarFilterUX.prototype._clearFilterUI = function() {
		// remove the filter from cache
		this.toolbarFilters = new Object();
		this.executeSearch();
		return true;
	}
	
	/**
	 *  
	 * Override this method in a subclass to adjust the UI to the updated values for the given dataprovider
	 * 
	 * @param {String} dataprovider
	 * @param {Array} values
	 * @param {String} operator
	 * 
	 * @return {Boolean}
	 *
	 * @this {AbstractToolbarFilterUX}
	 *  */
	AbstractToolbarFilterUX.prototype.updateFilterUI = function(dataprovider, values, operator) {
		throw scopes.svyExceptions.AbstractMethodInvocationException("updateGridFilter not implemented")
	}

	/**
     * @param {CustomType<aggrid-groupingtable.column>|{text:String, dataprovider:String, id:String, columnIndex:Number}} column
	 * 
	 * @return {Boolean}
	 * 
	 * @protected
	 * 
	 * @deprecated use isFilterActive instead
	 *
	 * @this {AbstractToolbarFilterUX}
	 *  */
	AbstractToolbarFilterUX.prototype.hasActiveFilter = function(column) {
		return this.toolbarFilters[column.dataprovider] ? true : false;
	}

	/**
     * @param {Filter} filter
	 * 
	 * @return {Boolean}
	 * 
	 * @protected
	 *
	 * @this {AbstractToolbarFilterUX}
	 *  */
	AbstractToolbarFilterUX.prototype.isFilterActive = function(filter) {
		return this.toolbarFilters[filter.dataprovider] ? true : false;
	}	
	
	/**
	 * Returns true if the toolbar has any dataprovider it can filter on
	 *
	 * @return {Boolean}
	 *
	 * @public
	 *
	 * @this {AbstractToolbarFilterUX}
	 */
	AbstractToolbarFilterUX.prototype.hasFilters = function() {
		return this.getFilters().length > 0 ? true : false;
	}
	
	/**
	 * Returns the filters' state of the toolbar
	 * 
	 * @return {Array<{
				id: String,
				dataprovider: String,
				operator: String,
				params: Object,
				text: String,
				values: Array}>} jsonState
				
	 * @public 
	 *
	 * @this {AbstractToolbarFilterUX}
	 */
	AbstractToolbarFilterUX.prototype.getToolbarFiltersState = function() {
		var jsonState = [];
		for (var dp in this.toolbarFilters) {
			var filter = this.toolbarFilters[dp];
			var filterState = filter.getState();
			delete filterState.params;
			jsonState.push(filterState);
		}
		return jsonState;
	}
	
	/**
	 * Restores the filters' state 
	 * 
	 * @param {Array<{
	 *			id: String,
	 *			dataprovider: String,
	 *			operator: String,
	 *			params: Object,
	 *			text: String,
	 *			values: Array}>} jsonState
	 *
	 * @public 
	 * 
	 * @this {AbstractToolbarFilterUX}
	 */
	AbstractToolbarFilterUX.prototype.restoreToolbarFiltersState = function(jsonState) {

		// clear previous filters
		this._clearFilterUI();

		// restore new filters
		for (var i = 0; i < jsonState.length; i++) {
			var obj = jsonState[i];
			var filter = this.getFilter(obj.dataprovider);

			if (!filter) continue; // TODO throw a warning ?

			switch (filter.filterType) {

			case 'CHECK':
			case 'INTEGER':
			case 'NUMBER':
				obj.values = obj.values.map(function(value) {
					return utils.stringToNumber(value);
				});

				break;
			case 'DATE':
				obj.values = obj.values.map(function(value) {
					return new Date(value);
				});

				break;
			case 'TEXT':

			default:
				break;
			}

			var values = obj.values;
			
			// set the filter again
//			this.setFilterValue(filter, values, obj.operator);
			var popupFilter = this.getOrCreateToolbarFilter(filter.dataprovider);
			popupFilter.restoreState(obj);
			
			if (!this.isFilterActive(filter)) {
				this.addFilterUI(filter);
			}
			
			var displayValues = getFilterUiDisplayValues(popupFilter, filter, values);
			this.updateFilterUI(filter.dataprovider, displayValues, obj.operator);
		}
		
		// update filter UI
		var element = this.getElement();
		if (this.hasFilters()) {
			element.addStyleClass('has-filter');
		} else {
			element.removeStyleClass('has-filter');
		}
		
		this.search(this.searchText);
	}
	
	/**
	 * Applies all filters and returns the query for this toolbar
	 *
	 * @return {QBSelect}
	 *
	 * @public
	 *
	 * @this {AbstractToolbarFilterUX}
	 */
	AbstractToolbarFilterUX.prototype.getQuery = function() {
		//apply foundset filters and force when the search text has been changed
		var filterQuery = this._applyFilters(this.searchText !== this.simpleSearch.getSearchText() ? true : false);

		var query;
		//quick search?
		if (this.searchText !== this.simpleSearch.getSearchText()) {
			this.simpleSearch.setSearchText(this.searchText);			
		}
		if (this.searchText) {
			
			// filters need to be applied
			if (this.onSearchCommand && this.getActiveFilters().length) {
				
				// include filters in query
				var foundset = databaseManager.getFoundSet(this.simpleSearch.getDataSource());
				var searchQuery = this.simpleSearch.getQuery();
				
				// add temp filters to make sure filterQuery is merged with searchQuery
				var toolbarFilterName = TOOLBAR_FILTER_NAME + "-temp";
				var searchFilterName = TOOLBAR_FILTER_NAME + "-temp-search";
				foundset.addFoundSetFilterParam(filterQuery, toolbarFilterName);
				foundset.addFoundSetFilterParam(searchQuery, searchFilterName);
				foundset.loadRecords();
				
				query = foundset.getQuery();
				
				// remove filters from query
				foundset.removeFoundSetFilterParam(toolbarFilterName);
				foundset.removeFoundSetFilterParam(searchFilterName);
				foundset.loadRecords();

			} else {
				query = this.simpleSearch.getQuery();
			}
		} else {
			query = filterQuery;
		}
		
		return query;
	}

	/**
	 * Sets the search text for the simple search
	 * 
	 * @return {AbstractToolbarFilterUX}
	 * 
	 * @public
	 *
	 * @this {AbstractToolbarFilterUX}
	 */
	AbstractToolbarFilterUX.prototype.setSearchText = function(searchText) {
		this.searchText = searchText;
		return this;
	}
	
	/**
	 * Returns the search text for the simple search
	 *
	 * @return {String}
	 *
	 * @public
	 *
	 * @this {AbstractToolbarFilterUX}
	 */
	AbstractToolbarFilterUX.prototype.getSearchText = function() {
		return this.searchText;
	}	
	
	/**
	 * Returns the SimpleSearch
	 *
	 * @return {scopes.svySearch.SimpleSearch}
	 *
	 * @public
	 *
	 * @this {AbstractToolbarFilterUX}
	 */
	AbstractToolbarFilterUX.prototype.getSimpleSearch = function() {
		return this.simpleSearch;
	}
	
	/**
	 * Returns the SearchProvider for the given column or dataprovider
	 *
	 * @param {CustomType<aggrid-groupingtable.column>|String} columnOrDataProvider
	 *
	 * @return {scopes.svySearch.SearchProvider}
	 *
	 * @public
	 *
	 * @this {AbstractToolbarFilterUX}
	 */
	AbstractToolbarFilterUX.prototype.getSearchProvider = function(columnOrDataProvider) {
		/** @type {String} */
		var dataProvider = columnOrDataProvider;
		if (!(columnOrDataProvider instanceof String)) {
			/** @type {CustomType<aggrid-groupingtable.column>} */
			var gridColumn = columnOrDataProvider;
			dataProvider = gridColumn.dataprovider;
		}
		return this.simpleSearch.getSearchProvider(dataProvider);
	}
	
	/**
	 * @public
	 * @return {scopes.svySearch.SimpleSearch}
	 *
	 * @this {AbstractToolbarFilterUX}
	 *  */
	AbstractToolbarFilterUX.prototype.getDefaultSearch = function() {
		var tableDataSource = this.getDataSource();

		if (!tableDataSource) {
			return null;
		}

		var filters = this.getFilters();

		// create a simple search
		var simpleSearch = scopes.svySearch.createSimpleSearch(tableDataSource);
		simpleSearch.setSearchText(this.searchText);
		var simpleSearchDateFormat = globalFilterConfig.globalDateDisplayFormat ? globalFilterConfig.globalDateDisplayFormat : "dd-MM-yyyy";
		simpleSearch.setDateFormat(simpleSearchDateFormat);

		for (var i = 0; filters && i < filters.length; i++) {
			addSearchProvider(simpleSearch, filters[i]);
		}
		return simpleSearch;
	}
	
	/**
	 * Applies all filters and executes the search
	 * 
	 * @param {String} [searchText] optional searchText to search for; if not provided here, call setSearchText() to set the search criteria before performing the search
	 * 
	 * @public  
	 *
	 * @this {AbstractToolbarFilterUX}
	 */
	AbstractToolbarFilterUX.prototype.search = function(searchText) {
		if (arguments.length === 1) {
			this.setSearchText(searchText);
		}
		
		this._applyFilters(true);
		this.executeSearch(searchText);
	}
	
	/**
	 * Executes the search
	 * 
	 * @param {String} [searchText] optional searchText to search for; if not provided here, call setSearchText() to set the search criteria before performing the search
	 * 
	 * @this {AbstractToolbarFilterUX}
	 */
	AbstractToolbarFilterUX.prototype.executeSearch = function(searchText) {
		var searchTextChanged = this.searchText !== this.simpleSearch.getSearchText() ? true : false;
		var foundset = this.getFoundSet();
		if (!foundset) {
			application.output("cannot apply search in an undefined foundset. May happen for a related foundset where parent record is undefined. ", LOGGINGLEVEL.DEBUG)
			return;
		}
		
		// apply sort by default
		var sortString = foundset.getCurrentSort();

		// quick search
		var searchQuery = this.getQuery();
		
		// keep the sort
		if (sortString) {
			var sorts = sortString.split(",");
			
			// it can handle joins
			searchQuery.sort.clear();
			for (var i = 0; i < sorts.length; i++) {
				var sort = sorts[i].trim();
				var sortDataProvider = sort.split(" ")[0];

				// TODO can be an utility method
				/** @type {QBSelect} */
				var querySource = null;
				var aDP = sortDataProvider.split('.');
				for (var j = 0; j < aDP.length - 1; j++) {
					querySource = querySource == null ? searchQuery.joins[aDP[j]] : querySource.joins[aDP[j]];
				}

				/** @type {QBColumn} */
				var sortColumn = querySource == null ? searchQuery.columns[aDP[aDP.length - 1]] : querySource.columns[aDP[aDP.length - 1]];

				if (sort.split(" ")[1] === "desc") {
					searchQuery.sort.add(sortColumn.desc);
				} else {
					searchQuery.sort.add(sortColumn.asc);
				}
			}
			
			searchQuery.result.distinct = false;
		}

		if (this.onSearchCommand) {
			//fire onSearchCommand
			this.onSearchCommand.call(this, searchQuery, foundset);
			
			// if there is no search text & autoApply is false do nothing, filters have been already applied as foundset filter.
		} else if ((searchTextChanged && !this.autoApply) || this.searchText) { 
			
			//apply search if relevant (any time searchText changes)
			foundset.loadRecords(searchQuery);
		}
	}
	
	/**
	 * @param {String} dataprovider
	 * @param {JSEvent} event
	 * 
	 * @this {AbstractToolbarFilterUX}
	 * 
	 * @protected 
	 *
	 * @properties={typeid:24,uuid:"06EB08B6-AA6C-4DC8-A0A7-B7CF3C140D77"}
	 */
	AbstractToolbarFilterUX.prototype.showPopupFilter = function (dataprovider, event) {
		var filter = this.getOrCreateToolbarFilter(dataprovider);

		// show the filter
		var popup = filter.createPopUp(this.onFilterApply);
		popup.x(event.getX());
		popup.y(event.getY());
		// popup.width(300);
		popup.show();
	}
	
	/**
	 * @param {String} dataprovider
	 * 
	 * @return {scopes.svyPopupFilter.AbstractPopupFilter}
	 * 
	 * @protected 
	 *
	 * @this {AbstractToolbarFilterUX}
	 */
	AbstractToolbarFilterUX.prototype.getFilterUI = function(dataprovider) {
		/** @type {scopes.svyPopupFilter.AbstractPopupFilter} */
		var filter = this.toolbarFilters[dataprovider];
		return filter;
	}	
	
	/**
	 * Returns the Filter for the given dataprovider
	 * 
	 * @param {String} dataprovider
	 * 
	 * @return {Filter}
	 * 
	 * @public  
	 *
	 * @this {AbstractToolbarFilterUX}
	 */
	AbstractToolbarFilterUX.prototype.getFilter = function(dataprovider) {
		var filters = this.getFilters();
		filters = filters.filter(
			/**
			 * @param {Filter} filterElement
			 */
			function (filterElement) {
				return filterElement.dataprovider === dataprovider
			}
		);
		if (filters && filters.length) {
			return filters[0];
		} else {
			return null;
		}
	}
	
	/**
	 * @public
	 * @return {Array<Filter>}
	 *
	 * @this {AbstractToolbarFilterUX}
	 */
	AbstractToolbarFilterUX.prototype.getFilters = function() {
		return this.filters;
	}	
	
	/**
	 * @param {String} titleText
	 * @param {String} dataProvider
	 * @param {String} filterType any of the FILTER_TYPES enum values
	 * 
	 * @public 
	 * 
	 * @this {AbstractToolbarFilterUX}
	 * @return {Filter}
	 */
	AbstractToolbarFilterUX.prototype.addFilter = function(titleText, dataProvider, filterType) {
		var newFilter = new Filter(titleText, dataProvider, this);
		var filterTypeInternal = 'TEXT';
		switch (filterType) {
			case FILTER_TYPES.CHECK:
				filterTypeInternal = 'RADIO';
				break;
			case FILTER_TYPES.DATE:
				filterTypeInternal = 'DATE';
				break;
			case FILTER_TYPES.INTEGER:
				filterTypeInternal = 'INTEGER';
				break;
			case FILTER_TYPES.NUMBER:
				filterTypeInternal = 'NUMBER';
				break;
			case FILTER_TYPES.SELECT:
				break;
			case FILTER_TYPES.TOKEN:
				break;
			default:
				break;
		}
		newFilter.filterType = filterTypeInternal;
		newFilter.id = dataProvider;
		newFilter.setOperator(getPopupDefaultOperator(newFilter.filterType));
		this.filters.push(newFilter);
		return newFilter;
	}
	
	/**
	 * @param {String} dataprovider
	 * 
	 * @return {scopes.svyPopupFilter.AbstractPopupFilter}
	 * 
	 * @protected 
	 *
	 * @this {AbstractToolbarFilterUX}
	 */
	AbstractToolbarFilterUX.prototype.getOrCreateToolbarFilter = function(dataprovider) {
		var popupFilter = this.getFilterUI(dataprovider);
		var filter = this.getFilter(dataprovider);
		
		if (!popupFilter && this.onFilterCreate) {
			popupFilter = scopes.svySystem.callMethod(this.onFilterCreate, [filter]);
			if (popupFilter) {
				// include this as param
				popupFilter.addParam(this);
				// set filter's dataprovider
				popupFilter.setDataProvider(dataprovider);
				// persist the filter in memory
				this.toolbarFilters[filter.dataprovider] = popupFilter;
			}
		}
		
		if (!popupFilter) {
			var popupTemplates = getPopupRendererForms();
			
			var filterType;
			if (filter.valuelist) {
				filterType = FILTER_TYPES.SELECT;
				
				// will be a lookup form
				// number picker
				// calendar picker
				var lookup = scopes.svyLookup.createValueListLookup(filter.valuelist);
				/** @type {RuntimeForm<AbstractLookup>} */
				var lookupForm = popupTemplates.getRendererForm(FILTER_TYPES.SELECT);
				lookup.setLookupForm(lookupForm);
				popupFilter = scopes.svyPopupFilter.createSelectFilter(filter.dataprovider, lookup);
			} else {
				// will be a free text entry
				switch (filter.filterType) {
				case 'TEXT':
					filterType = FILTER_TYPES.TOKEN;
					popupFilter = scopes.svyPopupFilter.createTokenFilter();
					popupFilter.setRendererForm(popupTemplates.getRendererForm(FILTER_TYPES.TOKEN));
					break;
				case 'INTEGER':
					filterType = FILTER_TYPES.INTEGER;
					popupFilter = scopes.svyPopupFilter.createIntegerFilter();
					popupFilter.setRendererForm(popupTemplates.getRendererForm(FILTER_TYPES.INTEGER));
					break;
				case 'NUMBER':
					
					// Check if column type is Number or Integer
					var relationName = scopes.svyDataUtils.getDataProviderRelationName(filter.dataprovider)
					var dataSource = relationName ? scopes.svyDataUtils.getRelationForeignDataSource(relationName) : this.getFoundSet().getDataSource();
					var jstable = databaseManager.getTable(dataSource);
					var jscol = jstable.getColumn(scopes.svyDataUtils.getUnrelatedDataProviderID(filter.dataprovider));
					
					// if DB column and column is a NUMBER
					if (jscol && jscol.getType() == JSColumn.INTEGER) {
						filterType = FILTER_TYPES.INTEGER;
						popupFilter = scopes.svyPopupFilter.createIntegerFilter();
						popupFilter.setRendererForm(popupTemplates.getRendererForm(FILTER_TYPES.INTEGER));
					} else {
						filterType = FILTER_TYPES.NUMBER;
						popupFilter = scopes.svyPopupFilter.createNumberFilter();
						popupFilter.setRendererForm(popupTemplates.getRendererForm(FILTER_TYPES.NUMBER));
					}
					
					break;
				case 'DATE':
					// calendar picker
					filterType = FILTER_TYPES.DATE;
					popupFilter = scopes.svyPopupFilter.createDateFilter();
					popupFilter.setRendererForm(popupTemplates.getRendererForm(FILTER_TYPES.DATE));
					break;
				case 'RADIO':
					// TODO shall i check the check type ?
				
					// calendar picker
					filterType = FILTER_TYPES.CHECK;
					popupFilter = scopes.svyPopupFilter.createCheckFilter();
					popupFilter.setRendererForm(popupTemplates.getRendererForm(FILTER_TYPES.CHECK));
					break;
				default:
					break;
				}
			}

			if (popupFilter) {
				// set filter's dataprovider
				popupFilter.setDataProvider(filter.dataprovider);
				popupFilter.setText(filter.text);
				
				// set default operator
				var operator = filter.getOperator() || popupTemplates.getDefaultOperator(filterType);
				if (operator) {
					popupFilter.setOperator(operator);
				}
				
				// include this as param
				popupFilter.addParam(this);

				// persist the filter in memory
				this.toolbarFilters[filter.dataprovider] = popupFilter;
			}
		}
		
		// cache popupFilter
		this.getFilter(dataprovider).setFilterUI(popupFilter);
		
		return popupFilter;
	}
	
	/**
	 * Shows the filter picker popup
	 * 
	 * @param {RuntimeComponent} target
	 * 
	 * @public
	 *
	 * @this {AbstractToolbarFilterUX}
	 */
	AbstractToolbarFilterUX.prototype.showPopupFilterPicker = function(target) {

		var filterPopupMenu = plugins.window.createPopupMenu();
		var menuItem = filterPopupMenu.addMenuItem("title");
		menuItem.enabled = false;
		menuItem.text = scopes.svyPopupFilter.LOCALE.filterPopupMenu.addFilter;

		var columnFilters = this.getFilters();
		for (var index = 0; index < columnFilters.length; index++) {
			var columnFilter = columnFilters[index];
			var check = filterPopupMenu.addCheckBox(columnFilter.dataprovider);
			check.selected = this.isFilterActive(columnFilter);
			check.text = columnFilter.text;
			check.methodArguments = [columnFilter.id, columnFilter.dataprovider]
			check.setMethod(onFilterPopupMenuClicked);
		}
		
		filterPopupMenu.cssClass = "toolbar-filter-popup";

		// cache the latest menu so it can be used in callback
		latestToolbarFilter = this;
		
		filterPopupMenu.show(target);
	}

	/**
	 * Sets a filter value for the given filter
	 * 
     * @param {Filter} filter
     * @param {Array} values
     * @param {String} operator
     * 
     * @public  
     *
     * @this {AbstractToolbarFilterUX}
     */
	AbstractToolbarFilterUX.prototype.setFilterValue = function(filter, values, operator) {
		if (!this.isFilterActive(filter)) {
			this.addFilterUI(filter);
		}
		var popupFilter = this.getOrCreateToolbarFilter(filter.dataprovider);
		popupFilter.setValues(values);
		popupFilter.setOperator(operator);
		this.onFilterApply(values, operator, popupFilter, true);
	}
	
	/**
	 * @public
	 * @return {Array<scopes.svyPopupFilter.AbstractPopupFilter>}
	 *
	 * @this {AbstractToolbarFilterUX}
	 */
	AbstractToolbarFilterUX.prototype.getActiveFilters = function() {
		/** @type {Array<scopes.svyPopupFilter.AbstractPopupFilter>} */
		var activeFilters = [];
		for (var dp in this.toolbarFilters) {
			/** @type {scopes.svyPopupFilter.AbstractPopupFilter} */
			var filter = this.toolbarFilters[dp];
			var filterValues = filter.getValues();
			if (filterValues && filterValues.length) {
				activeFilters.push(this.toolbarFilters[dp]);
			}
		}
		return activeFilters;
	}
	
	/**
	 * Returns the datasource to be filtered as the datasource of the form the filter UI Component is on<p>
	 * This method can be overwritten by subclasses to return for example the datasource of an NG Grid
	 * 
	 * @public 
	 * @return {String}
	 * 
	 * @this {AbstractToolbarFilterUX}
	 */
	AbstractToolbarFilterUX.prototype.getDataSource = function() {
		return this.getFoundSet().getDataSource();
	}	
	
	/**
	 * Returns the foundset to be filtered as the foundset of the form the filter UI Component is on<p>
	 * This method can be overwritten by subclasses to return for example the foundset of an NG Grid
	 * 
	 * @public 
	 * @return {JSFoundSet}
	 * 
	 * @this {AbstractToolbarFilterUX}
	 */
	AbstractToolbarFilterUX.prototype.getFoundSet = function() {
		return forms[this.formName].foundset;
	}
	
	/**
	 * @param {Array} values
	 * @param {String} operator
	 * @param {scopes.svyPopupFilter.AbstractPopupFilter} popupFilter
	 * @param {Boolean} [forceApply] Default false.
	 * 
	 * @protected 
	 *
	 * @this {AbstractToolbarFilterUX}
	 */
	AbstractToolbarFilterUX.prototype.onFilterApply = function(values, operator, popupFilter, forceApply) {
		/** @type {AbstractToolbarFilterUX} */
		var thisIntance = popupFilter.getParams()[0];
		
		// check if values or operator have changed
		var currentValues = popupFilter.getValues();
		var currentOperator = popupFilter.getOperator();
		if (!forceApply && scopes.svyJSUtils.areObjectsEqual(currentValues, values) && operator == currentOperator) {
			// nothing has changed, do nothing
			return;
		}
		
		//	TODO to be moved somewhere else ~?
		// persist the values & operator:
		popupFilter.setOperator(operator);
		popupFilter.setValues(values);
		thisIntance.getFilter(popupFilter.getDataProvider()).setOperator(operator);
		
		
		var displayValues = getFilterUiDisplayValues(popupFilter, thisIntance.getFilter(popupFilter.getDataProvider()), values);
		
		// update the UI
		thisIntance.updateFilterUI(popupFilter.getDataProvider(), displayValues, popupFilter.getOperator());
		
		// apply the search
		thisIntance.executeSearch();
		
		// if has active filters
		var element = thisIntance.getElement();
		if (thisIntance.getActiveFilters().length) {
			element.addStyleClass('has-active-filter');
		} else {
			element.removeStyleClass('has-active-filter');
		}
	
		if (thisIntance['onFilterApplyEvent']) {
			scopes.svySystem.callMethod(thisIntance['onFilterApplyEvent'], [values, operator, popupFilter])
		}
	}
}

/**
* @private 
* @param {Number} itemIndex
* @param {Number} parentIndex
* @param {Boolean} isSelected
* @param {String} parentText
* @param {String} menuText
* @param {String} [columnId] the id of the column
* @param {String} [columnDataprovider] dataprovider bound to the column
*
* @properties={typeid:24,uuid:"4288095A-3F08-48FD-AD10-C86B79972DA9"}
*/
function onFilterPopupMenuClicked(itemIndex, parentIndex, isSelected, parentText, menuText, columnId, columnDataprovider) {
	var toolbarFilterUX = latestToolbarFilter;
	latestToolbarFilter = null;
	if (toolbarFilterUX) {		
		var filter = toolbarFilterUX.getFilter(columnDataprovider);
		if (isSelected) {
			toolbarFilterUX.removeFilterUI(filter);
		} else {
			toolbarFilterUX.addFilterUI(filter);
		}
	}
}

/**
 * @constructor
 * @extends {AbstractToolbarFilterUX}
 * @private
 * @properties={typeid:24,uuid:"C7D04E91-D3C9-42D0-8837-7F1AFE0FF731"}
 * @AllowToRunInFind
 */
function initListComponentFilterRenderer() {
	ListComponentFilterRenderer.prototype = Object.create(AbstractToolbarFilterUX.prototype);
	ListComponentFilterRenderer.prototype.constructor = ListComponentFilterRenderer;

	/**
	 * Returns the Custom List element this renderer is using to display the filters
	 * 
	 * @return {RuntimeWebComponent<customrenderedcomponents-customlist>|RuntimeWebComponent<customrenderedcomponents-customlist_abs>}
	 * 
	 * @public
	 * 
	 * @override
	 *
	 * @this {ListComponentFilterRenderer}
	 */
	ListComponentFilterRenderer.prototype.getElement = function() {
		return this.element;
	}

	/**
	 * @return {String}
	 * 
	 * @protected
	 *
	 * @this {ListComponentFilterRenderer}
	 */
	ListComponentFilterRenderer.prototype.getRenderTemplate = function() {
		return "(function renderFilterEntry(entry) {  \n\
			var template = '';\n\
			var strDivider = ' : ';\n\
			var entryValue = entry.value ? entry.value.toString() : ''; \n\
			var valuesArr = entryValue.split(',');\n\
			for ( var i = 0; i < valuesArr.length ; i++ ) {\n\
				if (valuesArr[i].indexOf('!=') === 0) { \n\
					valuesArr[i] = '-' + valuesArr[i].substring(2, valuesArr[i].length); \n\
				} else if (valuesArr[i].indexOf('!') === 0) { \n\
					valuesArr[i] = '-' + valuesArr[i].substring(1, valuesArr[i].length); \n\
				} else if (valuesArr[i].indexOf('%!=') === 0) { \n\
					valuesArr[i] = '-' + valuesArr[i].substring(3, valuesArr[i].length); \n\
				} \n\
			}\n\
			template += '<div class=\"btn-group push-right margin-left-10 toolbar-filter-tag\">' + \n\
			'<button class=\"btn btn-default btn-sm btn-round\" data-target=\"open\" svy-tooltip=\"entry.text + entry.operator + \\' \\' + entry.value\">' + \n\
				'<span class=\"toolbar-filter-tag-text\">' + entry.text + '</span>' + \n\
				'<span class=\"toolbar-filter-tag-operator\">' + entry.operator + '</span>' + \n\
				'<span class=\"toolbar-filter-tag-value\"> ' + valuesArr.join(', ') + ' </span>' + \n\
				'<span class=\"toolbar-filter-tag-icon " + scopes.svyPopupFilter.STYLING.OPEN_FILTER_ICON +"\">' + '</span>' + \n\
			'</button>' + \n\
			'<button class=\"btn btn-default btn-sm btn-round\" data-target=\"close\">' + \n\
			'<span class=\"" + scopes.svyPopupFilter.STYLING.REMOVE_FILTER_ICON +" text-danger\">' + '</span>' + '</button>' + '</div>'; \n\
			return template; \n\
		})";
	}
	
	/**
	 * Called when the mouse is clicked on a list entry.
	 *
	 * @param {object} entry
	 * @param {Number} index
	 * @param {string} dataTarget
	 * @param {JSEvent} event
	 *  
	 * @public
	 * @this {ListComponentFilterRenderer}
	 *  */
	ListComponentFilterRenderer.prototype.onClick = function(entry, index, dataTarget, event) {
		var filter = this.getFilter(entry['dataprovider']);
		if (!dataTarget || dataTarget === "open") {
			//open the filter
			if (filter) {
				this.showPopupFilter(filter.dataprovider, event);
			}
		} else if (dataTarget === "close") {
			// remove the filter
			if (filter) {
				this.removeFilterUI(filter);
			} else {
				this.getElement().removeEntry(index)
			}
		}
	}

	/**
	 * @param {Filter} filter
	 * 
	 * @protected
	 *
	 * @this {ListComponentFilterRenderer}
	 */
	ListComponentFilterRenderer.prototype.addFilterUI = function(filter) {
		var newFilter = this.getElement().newEntry();
		newFilter.text = getI18nText(filter.text);
		newFilter.dataprovider = filter.dataprovider;
		newFilter.value = "";
		newFilter.operator = "";
		newFilter.id = filter.id || filter.dataprovider;
		
		// if has active filters
		var element = this.getElement();
		element.addStyleClass('has-filter');
		
		if (this.onFilterAddedEvent) {
			scopes.svySystem.callMethod(this.onFilterAddedEvent, [filter])
		}
	}

	/**
	 * @param {Filter} filter
	 * 
	 * @protected
	 *
	 * @this {ListComponentFilterRenderer}
	 */
	ListComponentFilterRenderer.prototype.removeFilterUI = function(filter) {
		//remove from display
		var index = this.getFilterTagIndex(filter);
		if (index > -1) {
			this.getElement().removeEntry(index);
		}
		
		var popupFilter = this.toolbarFilters[filter.dataprovider];
		var hasValues = popupFilter && popupFilter.getValues().length > 0 ? true : false;
		
		// remove the filter from cache
		delete this.toolbarFilters[filter.dataprovider];
		
		// TODO should remove the filter UI !?!?
		// filter.setFilterUI(null)
		
		//filter had values -> search again
		if (hasValues) {
			this.executeSearch();
		}
		
		if (this.getElement().getEntriesCount() == 0) {
			this._clearFilterUI();
		}
		// on filter removed event
		if (this.onFilterRemovedEvent) {
			scopes.svySystem.callMethod(this.onFilterRemovedEvent);
		}
	}

	/**
	 * @param {String} dataprovider
	 * @param {Array} displayValues
	 * @param {String} operator
	 *
	 * @protected
	 * 
	 * @this {ListComponentFilterRenderer}
	 */
	ListComponentFilterRenderer.prototype.updateFilterUI = function(dataprovider, displayValues, operator) {
		var index;
		var element = this.getElement();
		var count = element.getEntriesCount();
		var entries = [];
		
		var operatorText = this.getOperatorText(operator);
		
		for (var i = 0; i < count; i++) {
			var filterTag = element.getEntry(i);
			// TODO can i rely on dataprovider only !?
			if (filterTag && filterTag.dataprovider == dataprovider) {
				index = i;
			}
			entries.push(filterTag);
		}

		if (index || index == 0) {

			// TODO can i make an API in listcomponent to update an entry value !?
			// clear and re-draw all elements
			element.clear();
			for (i = 0; i < entries.length; i++) {
				var entryCopy = entries[i];
				var entry = element.newEntry();
				
				// copy entry properties
				for (var prop in entryCopy) {
					entry[prop] = entryCopy[prop];
				}

				// update display value if necessary
				if (i === index) {
					entry.value = displayValues.join(",");

					var OPERATOR = scopes.svyPopupFilter.OPERATOR;
					
					// show val1...val2
					if (operator == OPERATOR.BETWEEN && displayValues.length) {
						var displayValue1 = displayValues[0] ? displayValues[0] : "";
						var displayValue2 = displayValues[1] ? displayValues[1] : "";
						entry.value =  displayValue1 + "..." + displayValue2;
						entry.operator = "";
					} else {
						// do not show operator unless value is set or operator IS_NULL OR NOT_NULL
						var showOperator = ( operator == OPERATOR.IS_NULL || operator == OPERATOR.NOT_NULL) || ( displayValues.length && operatorText) ? true : false;
						entry.operator = showOperator ? " " + operatorText : "";
					}
				}

			}
			return true;
		} else {
			return false;
		}
	}

	/**
	 * Clears all grid filters
	 * 
	 * @protected 
	 * 
	 * @override 
	 *
	 * @this {ListComponentFilterRenderer}
	 */
	ListComponentFilterRenderer.prototype._clearFilterUI = function() {
		AbstractToolbarFilterUX.prototype._clearFilterUI.call(this);
		this.getElement().clear();
		var element = this.getElement();
		element.removeStyleClass('has-filter');
	}

	/**
	 * @param {CustomType<aggrid-groupingtable.column>} column
	 * 
	 * @return {Boolean}
	 * 
	 * @protected
	 * 
	 * @deprecated use isFilterActive instead
	 *
	 * @this {ListComponentFilterRenderer}
	 */
	ListComponentFilterRenderer.prototype.hasActiveFilter = function(column) {
		var filter = this.getFilter(column.dataprovider);
		return this.getFilterTagIndex(filter) > -1 ? true : false;
	}

	/**
	 * @param {Filter} filter
	 * 
	 * @return {Boolean}
	 * 
	 * @protected
	 *
	 * @this {ListComponentFilterRenderer}
	 */
	ListComponentFilterRenderer.prototype.isFilterActive = function(filter) {
		return this.getFilterTagIndex(filter) > -1 ? true : false;
	}	

	/**
	 * @param {Filter} filter
	 *
	 * @return {Number}
	 * 
	 * @protected 
	 *
	 * @this {ListComponentFilterRenderer}
	 */
	ListComponentFilterRenderer.prototype.getFilterTagIndex = function(filter) {
		var count = this.getElement().getEntriesCount();
		for (var i = 0; i < count; i++) {
			var filterTag = this.getElement().getEntry(i);
			// TODO can i rely on dataprovider only !?
			if (filterTag && filterTag.id == filter.id) {
				return i;
			}
		}
		return -1;
	}
	
	/**
	 *  
	 * @protected 
	 * @param {String} operator
	 * 
	 * @return {String}
	 *
	 * @this {ListComponentFilterRenderer}
	 *  */
	ListComponentFilterRenderer.prototype.getOperatorText = function(operator) {
		var operatorText = "";
		var OPERATOR = scopes.svyPopupFilter.OPERATOR;
		switch (operator) {
		case OPERATOR.GREATER_THEN:
			operatorText = ">";
			break;
		case OPERATOR.GREATER_EQUAL:
			operatorText = ">";
			break;
		case OPERATOR.SMALLER_THEN:
			operatorText = "<";
			break;
		case OPERATOR.SMALLER_EQUAL:
			operatorText = "<";
			break;
		case OPERATOR.BETWEEN:
			operatorText = "...";
			break;
		case OPERATOR.IS_NULL:
			operatorText = "Empty";
			break;
		case OPERATOR.NOT_NULL:
			operatorText = "Not Empty";
			break;
		case OPERATOR.EQUALS:
		case OPERATOR.LIKE:
		case OPERATOR.LIKE_CONTAINS:
		case OPERATOR.IS_IN:
		default:
			break;
		}
		
		return operatorText;
	}	

}

/**
 * @constructor
 * @extends {ListComponentFilterRenderer}
 * @private
 * @properties={typeid:24,uuid:"1EF00502-EE35-4BEA-A14B-DBAF089F9D0E"}
 */
function initNgGridListComponentFilterRenderer() {
	NgGridListComponentFilterRenderer.prototype = Object.create(ListComponentFilterRenderer.prototype);
	NgGridListComponentFilterRenderer.prototype.constructor = NgGridListComponentFilterRenderer;
	
	/**
	 * Returns the datasource to be filtered as the datasource of the NG Grid
	 * 
	 * @public 
	 * @return {String}
	 * 
	 * @this {NgGridListComponentFilterRenderer}
	 */
	NgGridListComponentFilterRenderer.prototype.getDataSource = function() {
		var tableComponent = this.tableComponent;
		
		if (!tableComponent) {
			return null;
		}
		
		var tableFoundset = tableComponent.myFoundset.foundset;
		var tableDataSource;		
		
		var jsForm = solutionModel.getForm(tableComponent.getFormName());
		var jsTable = jsForm.findWebComponent(tableComponent.getName());
		var foundsetSelector = jsTable.getJSONProperty("myFoundset").foundsetSelector;
		
		try {
			if (foundsetSelector) {
				if (databaseManager.getTable(foundsetSelector)) {
					tableDataSource = foundsetSelector;
				} else if (foundsetSelector.split('.').length > 1) {
					tableDataSource = scopes.svyDataUtils.getRelationForeignDataSource(foundsetSelector)
				} else if (solutionModel.getRelation(foundsetSelector)) {
					var jsRel = solutionModel.getRelation(foundsetSelector);
					tableDataSource = jsRel.foreignDataSource;
				}
			}
		} catch (e) {
			application.output(e, LOGGINGLEVEL.ERROR);
		}
		
		if (tableDataSource) {
			// do nothing
		} else if (tableFoundset) {
			tableDataSource = tableFoundset.getDataSource();
		} else {
			var form = forms[this.formName];
			tableDataSource = form ? form.foundset.getDataSource() : null;
		}

		return tableDataSource || null;
	}	
	
	/**
	 * Returns the foundset to be filtered as the foundset of the NG Grid
	 * 
	 * @public 
	 * @return {JSFoundSet}
	 * 
	 * @this {NgGridListComponentFilterRenderer}
	 */
	NgGridListComponentFilterRenderer.prototype.getFoundSet = function() {
		return this.tableComponent.myFoundset.foundset;
	}
	
	/**
	 * Returns all filters of this ToolbarFilter
	 * 
	 * @public 
	 * @return {Array<Filter>}
	 * 
	 * @this {NgGridListComponentFilterRenderer}
	 */
	NgGridListComponentFilterRenderer.prototype.getFilters = function() {
		var column;
		var filter;
		/** Array<Filter> */
		var filters = [];
		var innerColumnFiltersCache = this.innerColumnFiltersCache;

		var table = this.tableComponent;
		var sortByName = globalFilterConfig.sortPickerAlphabetically;

		/**
		 * @param {CustomType<aggrid-groupingtable.column>} col
		 * @private
		 * @return {Filter}
		 *  */
		function innerGetOrFreateFilterFromGridColumn(col) {
			for (var cacheIndex = 0; cacheIndex < innerColumnFiltersCache.length; cacheIndex++) {
				if ((col.id && col.id == innerColumnFiltersCache[cacheIndex].id) || (!col.id && col.dataprovider == innerColumnFiltersCache[cacheIndex].id)) {
					return innerColumnFiltersCache[cacheIndex];
				}
			}
			var innerColFilter = createFilterFromGridColumn(col);
			innerColumnFiltersCache.push(innerColFilter);
			return innerColFilter;
		}
		
		/** 
		 * @param {Filter} filterObj
		 * @private 
		 * */
		function addFilterInner(filterObj) {
			if (sortByName && filterObj.text && filters.length) {
				
				for (var sortIndex = 0; sortIndex < filters.length; sortIndex++) {
					if (filterObj.text < filters[sortIndex].text) {
						scopes.svyJSUtils.arrayInsert(filters, sortIndex, filterObj);
						return;
					}
				}
				
			} 
			// push filter at the end
			filters.push(filterObj);
		}
		
		//add all visible columns of the table
		if (table) {
			var columns = table.columns;
			var useNonVisibleColumns = getConfigUseNonVisibleColumns();
	
			if (useNonVisibleColumns) {
				// scan all columns
				for (var index = 0; index < columns.length; index++) {
					column = columns[index];
					if (column.filterType && column.filterType != 'NONE') {
						filter = innerGetOrFreateFilterFromGridColumn(column);
						addFilterInner(filter);
					}
				}
			} else if (table) {
				// we have a table element to look for columns
				// scan only visible columns. Access the column state
				var jsonState = table.getColumnState();
				if (jsonState) {
					/** @type {{columnState:Array}} */
					var state = JSON.parse(jsonState);
					/** @type {Array} */
					var colsState = state.columnState ? state.columnState : [];
					for (var j = 0; j < colsState.length; j++) {
						if (!colsState[j].hide) { // skip column if hidden
							// NEW API
							var colIndex = table.getColumnIndex(colsState[j].colId);
							column = columns[colIndex];
							if (column && column.filterType && column.filterType != 'NONE') {
								//visibleColumns.push(col.dataprovider);
								filter = innerGetOrFreateFilterFromGridColumn(column);
								addFilterInner(filter);
							}
						}
					}
				} else {
					for (var i = 0; i < columns.length; i++) {
						column = columns[i];
						if (column.filterType && column.filterType != 'NONE' && column.visible) {
							filter = innerGetOrFreateFilterFromGridColumn(column);
							addFilterInner(filter);
						}
					}
				}
			}
		}
		
		//add filters added by API
		if (sortByName) {
			// add filters sorted by name
			for (i = 0; i < this.filters.length; i++) {
				addFilterInner(this.filters[i]);
			}
		} else {
			filters = filters.concat(this.filters);
		}
		
		return filters;
	}

}

/**
 * @constructor 
 * @param {String} titleText Display text to show for filter popup
 * @param {String} dataprovider Dataprovider to use for filtering the data
 * @param {AbstractToolbarFilterUX} [toolbar]
 * 
 * @private
 *
 * @properties={typeid:24,uuid:"803ED7DC-5206-4561-914C-3DE613DCA0EC"}
 */
function Filter(titleText, dataprovider, toolbar) {
	/**
	 * @type {String}
	 */
	this.dataprovider = dataprovider;
	
	/** 
	 * @type {String} 
	 */
	this.text = titleText;
	
	/** 
	 * @type {String} 
	 * @protected 
	 */
	this.operator = null;	
	
	/**
	 * @type {String}
	 */
	this.id = dataprovider;
	
	/**
	 * @type {String}
	 */
	this.valuelist = null;
	
	/**
	 * should this field also be used in the quicksearch 
	 * @type {Boolean}
	 */
	this.useInSearch = false;
	
	/**
	 * The filter type of this filter
	 * @type {String}
	 */
	this.filterType = null;
	
	/**
	 * @return {AbstractToolbarFilterUX}
	 * @protected 
	 */
	this.getToolbar = function() {
		return toolbar;
	}
	
	/**
	 * @type {scopes.svyPopupFilter.AbstractPopupFilter}
	 */
	var popupFilter;
	
	/**
	 * @param {scopes.svyPopupFilter.AbstractPopupFilter} filterUI
	 */
	this.setFilterUI = function(filterUI) {
		popupFilter = filterUI;
	}
	
	/**
	 * Returns the popupFilter
	 * @protected 
	 */
	this.getFilterUI = function() {
		return popupFilter;
	}
	
	return this;
}

/**
 * @constructor 
 * @this {Filter}
 * @private 
 * @properties={typeid:24,uuid:"BB3FE387-AE4B-46F9-820D-E532A6D1545D"}
 */
function initFilter() {
	Filter.prototype = Object.create(Filter.prototype);
	Filter.prototype.constructor = Filter;
	
	/**
	 * @param {String} valueListName
	 * @return {Filter}
	 * @public 
	 * @this {Filter}
	 */
	Filter.prototype.setValueList = function(valueListName) {
		this.valuelist = valueListName;
		return this;
	}
	
	/**
	 * Sets whether this filter should be used in search as well (default is false)
	 * @param {Boolean} useInSearch
	 * @return {Filter}
	 * @public 
	 * @this {Filter}
	 */
	Filter.prototype.setUseInSearch = function(useInSearch) {
		this.useInSearch = useInSearch;
		var toolbar = this.getToolbar();
		if (useInSearch) {
			addSearchProvider(toolbar.getSimpleSearch(), this);
		} else {
			//search providers cannot be removed currently
			if (toolbar.getSimpleSearch().getSearchProvider(this.dataprovider)) {
				application.output("Operation not supported. Search provider cannot be removed; " + this.dataprovider, LOGGINGLEVEL.WARNING)
			}
		}
		return this;
	}
	
	/**
	 * @public 
	 * Sets the search operator as one of the scopes.svyPopupFilter.OPERATOR enum values
	 * @param {String} operator
	 * @return {Filter}
	 * @this {Filter}
	 */
	Filter.prototype.setOperator = function(operator) {
		this.operator = operator;
		var popupFilter = this.getFilterUI();
		if (popupFilter) {
			popupFilter.setOperator(operator);
		}
		return this;
	}	
	
	/**
	 * Returns search operator as one of the scopes.svyPopupFilter.OPERATOR enum values
	 * @return {String}
	 * @this {Filter}
	 */
	Filter.prototype.getOperator = function() {
		return this.operator;
	}	
}

/**
 * Creates a Filter from the given NG Grid column
 * @return {Filter}
 * 
 * @param {CustomType<aggrid-groupingtable.column>} column
 * @private 
 * @properties={typeid:24,uuid:"0D4C4ECF-973A-4F02-85A0-02E96B5E49C9"}
 */
function createFilterFromGridColumn(column) {
	var filter = new Filter(getI18nText(column.headerTitle), column.dataprovider);
	filter.id = column.id || column.dataprovider;
	filter.filterType = column.filterType;
	filter.valuelist = column.valuelist;
	filter.useInSearch = column.visible;
	filter.setOperator(getPopupDefaultOperator(filter.filterType));
	return filter;
}

/**
 * Adds a search provider for a filter to the given search
 * 
 * @param {scopes.svySearch.SimpleSearch} search
 * @param {Filter} filter
 * 
 * @private 
 *
 * @properties={typeid:24,uuid:"4B042CA6-BBD7-4511-9CF6-276B87638EC8"}
 */
function addSearchProvider(search, filter) {
	if (filter.dataprovider && filter.useInSearch) {
		// Check if column exists
		var relationName = scopes.svyDataUtils.getDataProviderRelationName(filter.dataprovider)
		var dataSource = relationName ? scopes.svyDataUtils.getRelationForeignDataSource(relationName) : search.getDataSource();

		var table = databaseManager.getTable(dataSource);
		var jsColumn = table.getColumn(scopes.svyDataUtils.getUnrelatedDataProviderID(filter.dataprovider));
		if (jsColumn) {
			var vlItems = null;

			// skip media fields
			if (jsColumn.getType() === JSColumn.MEDIA) {
				return;
			}

			// check if valuelist substitions can be applied
			if (filter.valuelist) {
				vlItems = application.getValueListItems(filter.valuelist);
				if (!vlItems.getMaxRowIndex()) {
					application.output("skip search on column with valuelist " + filter.valuelist);
					return;
				}
			}

			try {
				// create the search provider
				// TODO shall i remove all white spaces !?
				var provider = search.addSearchProvider(filter.dataprovider);

				// set the provider alias
				var alias = filter.text ? getI18nText(filter.text) : jsColumn.getDataProviderID();
				if (alias) {
					// TODO should also set lowercase ?
					alias = alias.replace(/ /, '-');
					provider.setAlias(alias);
				}
				// if is a date use explicit search
				if (jsColumn.getType() === JSColumn.DATETIME) {
					provider.setImpliedSearch(false);
				}

				// add valuelist substitutions
				for (var index = 1; vlItems && index <= vlItems.getMaxRowIndex(); index++) {
					var vlItem = vlItems.getRowAsArray(index);
					provider.addSubstitution(vlItem[0], vlItem[1])

				}
			} catch (e) {
				// when addSearchProvider fails due to a cross-db  dataprovider it throws an exception and the toolbar filter is not created
				application.output("skip search on column with dataprovider: " + filter.dataprovider + '. Please check other log messages to see if this is a cross-db dataprovider which it is not supported');
			}
		}
	}
}

/**
 * Returns an array of display values for the given values
 *
 * @param {scopes.svyPopupFilter.AbstractPopupFilter} filterUI
 * @param {Filter} filter
 * @param {Array} values
 *
 * @private
 *
 * @return {Array}
 *
 * @properties={typeid:24,uuid:"14F18D0E-0B6A-4E8E-BBA5-C8E7CB83B5B2"}
 */
function getFilterUiDisplayValues(filterUI, filter, values) {
	var displayValues = values ? values : [];

	// resolve valuelist real values
	if (filter.valuelist) {
		displayValues = [];
		for (var i = 0; i < values.length; i++) {
			displayValues[i] = application.getValueListDisplayValue(filter.valuelist, values[i]);
		}
	}

	// Clean up values from empty values
	displayValues = displayValues.filter(function(qv) {
		if (qv === undefined || qv === null || qv === '') {
			return false;
		} else {
			return true;
		}
	});

	// format dates / checks
	displayValues = displayValues.map(function(v) {
		if (filterUI instanceof scopes.svyPopupFilter.SvyCheckFilter) {
			return !v ? '(' + scopes.svyPopupFilter.LOCALE.svyCheckPopupFilter.labelUnchecked + ')' : '(' + scopes.svyPopupFilter.LOCALE.svyCheckPopupFilter.labelChecked + ')'
		}
		if (v instanceof Date) {
			return utils.dateFormat(v, globalFilterConfig.globalDateDisplayFormat);
		} else {
			return v;
		}
	});

	return displayValues;
}

/**
 * @private
 * @SuppressWarnings(unused)
 * @properties={typeid:35,uuid:"FE4768E2-C48C-4BBE-B6B1-30CCC1194975",variableType:-4}
 */
var init = (function() {
	initPopupRendererForms();
	globalFilterConfig = new FilterConfig();
	popupRendererForms = new PopupRendererForms();
	initAbstractToolbarFilterUX();
	initListComponentFilterRenderer();
	initNgGridListComponentFilterRenderer();
	initFilter();
}());
