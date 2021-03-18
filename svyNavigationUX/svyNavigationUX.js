/**
 * @private 
 * @type {String}
 *
 * @properties={typeid:35,uuid:"B5500C84-FDCF-496E-9E23-4015ADD023E5"}
 */
var SVY_NAVIGATION_UX_VERSION = '1.0.3';

/**
 * @protected  
 * @enum 
 * @properties={typeid:35,uuid:"6DD3A365-FA98-4478-BF8D-1E99AAD08D4B",variableType:-4}
 */
var NAVIGATION_EVENT = {
	GLOBAL_SEARCH: 'global-search'
};

/**
 * @param {function(String)} listener
 * @public
 * 
 * @example <pre>
 * function onShow(firstShow, event) {
	// listen for a global search event
	scopes.svyNavigationUX.addGlobalSearchListener(globalSearchListener);
}

function globalSearchListener(searchText) {
	// perform a search
}

function onHide(event) {
	// stop listening when hiding the form
	scopes.svyNavigationUX.removeGlobalSearchListener(globalSearchListener)
	return true
}</pre>
 *
 * @properties={typeid:24,uuid:"942B4700-9824-401D-B648-13577CAD641A"}
 */
function addGlobalSearchListener(listener) {
	scopes.svyEventManager.addListener(NAVIGATION_EVENT.GLOBAL_SEARCH, NAVIGATION_EVENT.GLOBAL_SEARCH, listener);
}

/**
 * @param {function(String)} listener
 * @public 
 * 
 * @example <pre>
 * function onShow(firstShow, event) {
	// listen for a global search event
	scopes.svyNavigationUX.addGlobalSearchListener(globalSearchListener);
}

function globalSearchListener(searchText) {
	// perform a search
}

function onHide(event) {
	// stop listening when hiding the form
	scopes.svyNavigationUX.removeGlobalSearchListener(globalSearchListener)
	return true
}</pre>
 *
 * @properties={typeid:24,uuid:"88C787BF-C39C-43C7-B3FD-810CDC58E8A1"}
 */
function removeGlobalSearchListener(listener) {
	scopes.svyEventManager.removeListener(NAVIGATION_EVENT.GLOBAL_SEARCH, NAVIGATION_EVENT.GLOBAL_SEARCH, listener);
}

/**
 * @public
 * @param {String} searchText
 *
 * @properties={typeid:24,uuid:"48780730-F4A6-4E1C-AA35-E6944AE6F4DC"}
 */
function triggerGlobalSearch(searchText) {
	scopes.svyEventManager.fireEvent(NAVIGATION_EVENT.GLOBAL_SEARCH, NAVIGATION_EVENT.GLOBAL_SEARCH, searchText);
}

/**
 * Gets the version of this module
 * @public 
 * @return {String} the version of the module using the format Major.Minor.Revision
 * @properties={typeid:24,uuid:"2EA50B1D-90FE-433F-8299-3CDE67CDF35C"}
 */
function getVersion() {
    return SVY_NAVIGATION_UX_VERSION;
}
