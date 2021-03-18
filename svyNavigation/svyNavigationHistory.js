/**
 * Maximium number of items in the navigation history (defaults to 100)
 * @type {Number}
 * @private 
 *
 * @properties={typeid:35,uuid:"BF6833F5-83A9-4A8D-9DAA-807C3273D277",variableType:4}
 */
var MAX_HISTORY_LENGTH = 100;

/**
 * TODO it can be used as a proper history stack. 
 * Open items are pushed into the history stack.
 * It could have 2 types of policies LINEAR, CONCURRENT. A linear policy could behave like a stack. 
 * While concurrent policy would always add an open item on top of it (even if already exists in the stack, like browser history);
 * 
 * @private 
 * @type {Array<scopes.svyNavigation.NavigationItem>}
 * @properties={typeid:35,uuid:"D0C0DC25-DAA3-4E08-8A52-DB059753B6CE",variableType:-4}
 */
var itemsHistory = [];

/**
 * When navigating through the history, this index is used
 * Whenever a new navigation item is added while walking through history,
 * this history stack is cut off (items after this index will be removed) 
 * and the index is reset
 * @private 
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"F6BC814C-1D15-4003-98C4-9DD462AE3471",variableType:4}
 */
var itemsHistoryIndex = -1;

/**
 * @private 
 * @properties={typeid:35,uuid:"2D4F25E6-0270-42ED-AD5A-24F099B8FF8F",variableType:-4}
 */
var skipHistoryEntry = false;

/**
 * Returns the item with the given ID from the history stack when found and null otherwise
 * @public 
 * @param {String} id
 * @return {scopes.svyNavigation.NavigationItem}
 * @properties={typeid:24,uuid:"DCB18DBD-A023-4DB3-9A2F-37ABECE5B1B3"}
 */
function getNavigationItemFromHistory(id){
	for(var i in itemsHistory){
		var item = itemsHistory[i];
		if (item.getID() == id){
			return item;
		}
	}
	return null;
}

/**
 * Returns the history of navigation items
 * @public 
 * @return {Array<scopes.svyNavigation.NavigationItem>}
 *
 * @properties={typeid:24,uuid:"612594F1-A5D2-4745-A884-2DFA577BED65"}
 */
function getHistory() {
	return itemsHistory;
}

/**
 * Clears the history
 * @public 
 * @properties={typeid:24,uuid:"3F372497-3AE7-4B52-BCDC-BE82FB27E949"}
 */
function clearHistory() {
	itemsHistory = [];
}

/**
 * Goes back one step in the navigation history from the current position
 * @return {scopes.svyNavigation.NavigationItem}
 * @public 
 * @properties={typeid:24,uuid:"6652B0F1-EDC4-480F-BF88-69618E685032"}
 */
function back() {
	var success = false;
	
	if (itemsHistory.length <= 1 || itemsHistoryIndex === 0) {
		//nowhere to go back or we already sit on the first item
		return null;
	}
	var prevItemsHistoryIndex;
	if (itemsHistoryIndex === -1) {
		prevItemsHistoryIndex = itemsHistory.length - 1;
	} else {
		prevItemsHistoryIndex = itemsHistoryIndex;
	}
	//reduce index by 1
	prevItemsHistoryIndex --;
	var historyItem = itemsHistory[prevItemsHistoryIndex];
	//open previous item and return that
	try {
		skipHistoryEntry = true;
		success = scopes.svyNavigation.open(historyItem);
	} catch (e) {
		throw e;
	} finally {
		skipHistoryEntry = false;
	}
	
	// return the historyItem only in case of success
	if (success) {
		itemsHistoryIndex = prevItemsHistoryIndex;
		return historyItem;
	} else {
		return null;
	}
}

/**
 * Goes forward one step in the navigation history from the current position
 * @return {scopes.svyNavigation.NavigationItem}
 * @public
 * @properties={typeid:24,uuid:"D92C5424-874C-4A2D-9387-4531DA11EC52"}
 */
function next() {
	var success = false;
	
	if (itemsHistory.length <= 1 || itemsHistoryIndex === -1 || itemsHistoryIndex >= (itemsHistory.length - 1)) {
		//nowhere to go to, we have not been through history at all or we already sit on the last item of the stack
		return null;
	}
	
	var nextItemsHistoryIndex = itemsHistoryIndex;
	//advance index by 1
	nextItemsHistoryIndex ++;
	var historyItem = itemsHistory[nextItemsHistoryIndex];
	
	//open next item and return that
	try {
		skipHistoryEntry = true;
		success = scopes.svyNavigation.open(historyItem);
	} catch (e) {
		throw e;
	} finally {
		skipHistoryEntry = false;
	}
	
	// return the historyItem only in case of success
	if (success) {
		itemsHistoryIndex = nextItemsHistoryIndex;
		return historyItem;
	} else {
		return null;
	}
}

/**
 * Returns <code>true</code> when a historyNext can be performed
 * @return {Boolean}
 * @public 
 * @properties={typeid:24,uuid:"204B11FC-2D9E-4882-9BBD-EF12E567C8EC"}
 */
function hasNext() {
	return itemsHistoryIndex !== -1 && itemsHistoryIndex <= itemsHistory.length - 2;
}

/**
 * Returns <code>true</code> when a historyBack can be performed
 * @return {Boolean}
 * @public 
 * @properties={typeid:24,uuid:"5C72A676-4851-4555-B3DB-56EAFEF3253C"}
 */
function hasPrevious() {
	return !(itemsHistory.length <= 1 || itemsHistoryIndex === 0);
}

/**
 * Returns the current index when navigating through the history or -1, when not navigating
 * @return {Number}
 * @public 
 * @properties={typeid:24,uuid:"9178ADCC-DFF8-4C6F-B718-14A691C2924C"}
 */
function getHistoryIndex() {
	return itemsHistoryIndex;
}

/**
 * @public 
 * Removes the given item from the history stack
 * @param {scopes.svyNavigation.NavigationItem} itemToRemove
 *
 * @properties={typeid:24,uuid:"8BE40D61-B19E-4F5B-BA65-C29115BABA8B"}
 */
function removeItemFromHistory(itemToRemove) {
	if (!itemToRemove) return;
	for (var i = 0; i < itemsHistory.length; i++) {
		if (itemsHistory[i].getID() === itemToRemove.getID()) {
			itemsHistory.splice(i, 1);
		}
	}
}

/**
 * Sets the maximum number of items held in the navigation history
 * A maximum number of -1 means there is no limit to the number of items in the history
 * @param {Number} historyLength
 * @public 
 *
 * @properties={typeid:24,uuid:"0429219E-8AE1-4B45-8431-9306AF4FE65B"}
 */
function setMaxHistoryLength(historyLength) {
	if (!(historyLength >= -1)) {
		//nothing reasonable given
		return;
	}
	MAX_HISTORY_LENGTH = historyLength;
	if (historyLength !== -1 && itemsHistory.length > historyLength) {
		//history already longer than given; remove from start what doesn't fit anymore
		itemsHistory.splice(0, itemsHistory.length - historyLength);
	}
}

/**
 * @param {scopes.svyNavigation.NavigationEvent} event
 * @private
 * @properties={typeid:24,uuid:"F31CC1B5-CC52-4CBD-8E56-13141065B93A"}
 */
function onOpenHandler(event) {
	if (event.getEventType() === scopes.svyNavigation.NAVIGATION_EVENT.AFTER_OPEN) {
		var navItem = event.getNavigationItem();
		
		if (skipHistoryEntry !== true && itemsHistoryIndex !== -1) {
			//we have been navigating through history, but now a new item is opened
			//the new item is added at the current history index and the history is cut off at that point
			itemsHistory.splice(itemsHistoryIndex + 1, itemsHistory.length - itemsHistoryIndex, navItem);
			itemsHistoryIndex = -1;
		} else if (skipHistoryEntry !== true) {
			//we are not navigating through history, item is added to history
			itemsHistory.push(navItem);
			if (MAX_HISTORY_LENGTH !== -1 && itemsHistory.length > MAX_HISTORY_LENGTH) {
				itemsHistory.shift();
			}
		}
	}
}

/**
 * @SuppressWarnings(unused)
 * @private 
 * @properties={typeid:35,uuid:"B0276040-7CA4-4BE7-9D18-BC4B79EF6190",variableType:-4}
 */
var init = function() {
	scopes.svyNavigation.addNavigationListener(onOpenHandler);
}();
