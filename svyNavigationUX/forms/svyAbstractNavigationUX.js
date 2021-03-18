/**
 * @protected
 * 
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"77BE1648-75C9-4618-8D48-1EFA55208C4A"}
 */
function onLoad(event) {
	
	// register for navigation event
	scopes.svyNavigation.addNavigationListener(onOpenHandler);
	
	initNavigationForm();
}

/**
 * This method is called as part of the [onLoad]{@link onLoad} operation flow.
 * Override this method to initialize your navigation form
 * 
 * @protected 
 * @properties={typeid:24,uuid:"06EA8983-8AAA-4DE2-AC4B-6E02FC6BCB12"}
 */
function initNavigationForm() { }

/**
 * @return {Boolean}
 * @private
 * @param {scopes.svyNavigation.NavigationEvent} event
 *
 * @properties={typeid:24,uuid:"037A69DA-38B4-4F4A-9991-DB224D6E7A9A"}
 */
function onOpenHandler(event) {

	var type = event.getEventType();

	if (type == scopes.svyNavigation.NAVIGATION_EVENT.BEFORE_CLOSE) {
		
		// don't allow navigation when beforeClose is called
		if (beforeClose(event) === false) {
			return false;
		}
		
	} else if (type == scopes.svyNavigation.NAVIGATION_EVENT.AFTER_OPEN) {
		
		// run the beforOpen and prevent open if goes wrong
		if (beforeOpen(event) === false) {
			// FIXME i have to remove the navigation item from the list of navigationItems
			//	scopes.svyNavigation.close();
			// return false;
		}
		
		// open the item. the UI will be updated by the onOpen function
		onOpen(event);
		
		// run the after openEvent
		afterOpen(event);
	}
	return true;
}

/**
 * This method is called as part of the [onOpenHandler]{@link onOpen} operation flow.
 * 
 * @private  
 * @param {scopes.svyNavigation.NavigationEvent} event
 * @return {Boolean}
 *
 * @properties={typeid:24,uuid:"DADEB939-B785-4BA6-B9F1-EAEF9DDEB8EA"}
 */
function beforeOpen(event) {
	/** @type {scopes.svyNavigation.NavigationItem} */
	var item = event.getNavigationItem();
	var dataToShow = event.getDataToShow();
	var dataSelectionType = event.getDataSelectionType();
	
	var success = true;
	var formName = item.getFormName();
	//	var navPks = item.getPks();
	//	var navFilters = item.getFilters();

	// get the form instance
	var form = forms[formName];
	if (!form) {
		throw new scopes.svyExceptions.IllegalStateException('Cannot navigate to form because cannot find form instance ' + formName);
	}
	
	if (dataToShow) {
		success = loadFormData(form, dataToShow, dataSelectionType);
	}
	return success;
}

/**
 * @private 
 * 
 * @param {RuntimeForm} form
 * @param {JSRecord|JSFoundSet|QBSelect} dataToShow
 * @param dataSelectionType
 * 
 * @return {Boolean}
 *
 * @properties={typeid:24,uuid:"F5EA30A6-0695-44B4-AE6B-0E8ED020FBBE"}
 */
function loadFormData(form, dataToShow, dataSelectionType) {
	var success = false;
	
	/** @type {JSRecord} */
	var record;
	/** @type {JSFoundSet} */
	var jsFoundset;
	/** @type {QBSelect} */
	var query;
	
	switch (dataSelectionType) {
	case scopes.svyNavigation.NAVIGATION_SELECTION_TYPE.LOAD_RECORDS:
		// load the given data into the foundset form
		
		// TODO shall i check the dataSource type ?
		if (dataToShow instanceof JSFoundSet) {
			jsFoundset = dataToShow;
			success = form.foundset.loadRecords(jsFoundset);
		} else if (dataToShow instanceof QBSelect) {
			query = dataToShow;
			success = form.foundset.loadRecords(query);
		} else if (dataToShow instanceof JSRecord) {
			record = dataToShow;
			success = scopes.svyDataUtils.loadRecords(form.foundset, record.getPKs());
		}
		break;
		
	case scopes.svyNavigation.NAVIGATION_SELECTION_TYPE.SET_FOUNDSET:
		jsFoundset = dataToShow;
		form.controller.loadRecords(jsFoundset);
		break;
		
	case scopes.svyNavigation.NAVIGATION_SELECTION_TYPE.SELECT_RECORD:
		/** @type {JSRecord} */
		record = dataToShow;
		success = scopes.svyDataUtils.selectRecord(form.foundset, record);
		break;
		
	case scopes.svyNavigation.NAVIGATION_SELECTION_TYPE.FORCE_SELECT_RECORD:
		/** @type {JSRecord} */
		record = dataToShow;
		success = scopes.svyDataUtils.selectRecord(form.foundset, record);
		
		if (!success) {
			// to force the selection, load all the record in foundset
			jsFoundset = form.foundset.duplicateFoundSet();
			jsFoundset.loadAllRecords();
			if (scopes.svyDataUtils.selectRecord(jsFoundset, record)) {
				success = form.foundset.loadRecords(jsFoundset);
			} else {
				application.output(utils.stringFormat('Cannot select record "%1$s"', [record.getPKs().join(",")]), LOGGINGLEVEL.WARNING)
			}
		}
		
		break;
	default:
		throw new Error("Cannot open item; Error loading data, invalid dataSelectionType " + dataSelectionType);
		break;
	}
	return success;
}

/**
 * This method is called as part of the [onOpen]{@link onOpenHandler} operation flow.
 * 
 * @protected 
 * @param {scopes.svyNavigation.NavigationEvent} event
 * 
 * @return {Boolean} True (default) if the navItem can be closed and navigation can proceed, false to cancel the navigation.
 *
 * @properties={typeid:24,uuid:"8CAD8898-32AE-43ED-847E-7F589A9B0B41"}
 */
function beforeClose(event) {
	return true;
}

/**
 * This method is called as part of the [onOpen]{@link onOpenHandler} operation flow.
 * 
 * @protected 
 * @param {scopes.svyNavigation.NavigationEvent} event
 *
 * @properties={typeid:24,uuid:"7C054852-1127-4F01-A9E1-76C01F365161"}
 */
function onOpen(event) { }

/**
 * This method is called as part of the [onOpen]{@link onOpenHandler} operation flow.
 * 
 * @protected 
 * @param {scopes.svyNavigation.NavigationEvent} event
 *
 * @properties={typeid:24,uuid:"13B1A0DF-5FFD-4E1A-9B09-B899DB318A03"}
 */
function afterOpen(event) { }

/**
 * Returns the formName associated with the given menuItemID.
 * With the Default behavior it assumes the given menuItemID value is the formName to be used in navigation, therefore it returns the menuItemID value as is.
 * Override this function if you would like to use your own mapping between the menuItemID and the formName for navigation item.
 * 
 * @protected 
 * @param {String|Number} menuItemID 
 * 
 * TODO add example
 * 
 * @return {String} Returns the formName for the given menuItemID. Default returns the menuItemID value.
 *
 * @properties={typeid:24,uuid:"A585AF53-8457-4C4D-894E-CE8F9FF9F3CB"}
 */
function getMenuItemFormName(menuItemID) {
	
	/** @type {String} */
	var formName = menuItemID;
	return formName;
}

/**
 * Returns the menuItemID associated with the given formName.
 * With the Default behavior it assumes the given menuItemID value is the formName to be used in navigation, therefore it returns the formName value as is.
 * Override this function if you would like to use your own mapping between the menuItemID and the formName for navigation item.
 * 
 * @protected 
 * @param {String} formName 
 * 
 * TODO add example
 * 
 * @return {String|Number} Returns the menuItemID for the given formName. Default returns the formName value.
 *
 * @properties={typeid:24,uuid:"CF047442-EBE5-450A-B58D-AA8F34DC1703"}
 */
function getMenuItemID(formName) {
	return formName;
}

/**
 * @return {String}
 * @public
 *
 * @properties={typeid:24,uuid:"AB5A744A-D138-4EEF-8410-50B275EEED89"}
 */
function getActiveFormName() {
	throw new scopes.svyExceptions.AbstractMethodInvocationException("implement getActiveFormName for Navigation Form " + controller.getName());
}
