/**
 * Enumeration for navigation policy options which control how to update the stack of navigation item when an item is opened or closed.
 * @private  
 * @enum 
 * @properties={typeid:35,uuid:"58A3FF05-89EB-403F-A003-D984BB984064",variableType:-4}
 */
var NAVIGATION_POLICY = {
    /**
     * TODO should be renamed STACK ?
     * 
     * Opened NavigationItems are handled as a linear stack.
     * You can compare the behavior of the linear navigation to the behavior of a breadcrumb.
     * Whenever you open an item which is already in the stack, it will remove all the items in the stack in front of it.
     * Whenever an item is closed {@link close(itemOrId)} all the items on top of it are removed.
     * This is the Default policy
     */
    LINEAR: 'linear',

    /**
     * TODO should be called PILE ?
     * 
     * Opened NavigationItems are handled as a pile.
     * You can compare the behavior of the concurrent navigation to the behavior of a tab panel.
     * You can freely navigate and remove the items in the pile of Navigation Items without affecting other Navigation items (which you may have opened previously or subsequently)
     * Whenever you open an item which is already in the pile, it will move the item on top of the pile and select it as currentItem.
     * Whenever an item is closed {@link close(itemOrId)} it removes the single item regardless of it's position in the pile.
     */
    CONCURRENT: 'concurrent'
};

/**
 * @public 
 * @enum 
 * @properties={typeid:35,uuid:"564021D4-081B-4FE5-8FE4-FF2585815D29",variableType:-4}
 */
var NAVIGATION_EVENT = {
	/** 
	 * register for navigation event to listen for this event (@see addNavigationListener)
	 * beforeClose event will be fired before navigating allowing a chance to react or cancel 
	 * */
	BEFORE_CLOSE: 'before-close',
	/** 
	 * register for navigation event to listen for this event (@see addNavigationListener)
	 * afterOpen event will be fired when a navigation item has been opened; react to the after_open event to implement your navigation 
	 * */
	AFTER_OPEN: 'after-open'
};

/**
 * Enumeration for the data selection type specified in the open function. 
 * The chosen selection type is passed to the open function [open](@link open) [afterOpen](@link afterOpen) and needs to be implemented accordingly. The Default value is LOAD_RECORDS
 * @public 
 * @enum
 * @see open(itemOrId, dataToShow, dataSelectionType)
 * @properties={typeid:35,uuid:"D3C9A2CC-0D47-4BA4-88F1-BE35392E1E3C",variableType:-4}
 */
var NAVIGATION_SELECTION_TYPE = {
	/**
	 * This is the DEFAULT selection type.
	 * Will run foundset.loadRecords(dataToShow) on the form to be shown.<br/>
	 * Load records into the form's foundset. If you load a relation into this foundset, then this foundset will not be a related foundset, 
	 * it will not automatically update its state of records are updated or added that belong to that relation. 
	 * It will only be a snapshot of that related foundsets state. 
	 * Foundset filter params are copied over from the source foundset and are merged with the existing filters on this foundset.
	 * */ 
	LOAD_RECORDS: 'load-records',
	
	/** 
	 * Can be used only when the dataToShow is of type JSFoundSet.
	 * Will run controller.loadRecords(dataToShow) for the target form.<br/>
	 * Replace the default form's foundset with setting the (related) foundset into the form. The form will no longer share the default foundset with forms of the same datasource,
	 * use loadAllRecords to restore the default foundset. This will really update the foundset instance itself of the form, so now existing foundset is altered just the new foundset is shown. 
	 * When the form uses a seperate foundset, foundset filter params are copied over from the source foundset and are merged with the existing filters.
	 * */ 
	SET_FOUNDSET: 'set-foundset',
	
	/** 
	 * Can be used only when the dataToShow is a JSRecord.
	 * Selects the record with the given pk in the foundset even if the record is not loaded in foundset yet. 
	 * <b>Warning</b>: can be very expensive, as the entire foundset may needs to be loaded. Returns false if the record cannot be found in the entire foundset. 
	 * */ 
	SELECT_RECORD: 'select-record',
	
	/** 
	 * Can be used only when the dataToShow is a JSRecord.
	 * Selects the record with the given pk in the foundset even if the record is not loaded in foundset yet. 
	 * <b>Warning</b>: can be very expensive, as the entire foundset may needs to be loaded. Returns false if the record cannot be found in the entire foundset.
	 * If the record is not present in the foundset will force the selection by loading all records into the foundset. If there are active foundset or table filters these won't be removed, they will still apply.
	 * */ 
	FORCE_SELECT_RECORD: 'force-select-record'
};

/**
 * @private 
 * @type {Array<Function>}
 * @properties={typeid:35,uuid:"81D3643A-CACA-4109-9308-F219E9F2CDC0",variableType:-4}
 */
var listeners = [];

/**
 * @private 
 * @type {Array<NavigationItem>}
 * @properties={typeid:35,uuid:"C8BA50D6-E824-477C-A20E-601C2889D0B8",variableType:-4}
 */
var items = [];

/**
 * Set the navigation policies when the 
 * @type {NavigationPolicies}
 * @private
 * @properties={typeid:35,uuid:"87EF8EBF-9544-456E-B48E-A12AC6E6900D",variableType:-4}
 */
var navigationPolicies = createNavigationPolicies();

/**
 * Internal constructor. To create a new instance of the NavigationPolicies class use the method {@link createNavigationPolicies}.
 * @classdesc This class encapsulates the various supported navigation policies.
 * @private  
 * @constructor
 * @properties={typeid:24,uuid:"DE6AB0B7-8695-4B46-9B2E-DE5D8BC8FFEB"}
 */
function NavigationPolicies() {

    /**
     * @protected
     * @type {String}
     * @ignore
     */
    this.navigationPolicy = NAVIGATION_POLICY.LINEAR;
    
    /**
     * Sets the navigation policy
     * @public
     * @param {String} policy options which control how to update the stack of navigation item when an item is opened or closed. Must be one of the {@link NAVIGATION_POLICY} enumeration options.
     * @return {NavigationPolicies} This NavigationPolicies instance for call-chaining support.
     */
    this.setNavigationPolicy = function(policy) {
        this.navigationPolicy = policy;
        return this;
    }

    /**
     * Gets the current openExistinItemPolicy
     * @public
     * @return {String} The current open existing item policy as one of the {@link OPEN_EXISTING_ITEM_POLICY} enumeration options.
     */
    this.getNavigationPolicy = function() {
        return this.navigationPolicy;
    }
}

/**
 * Factory method for creating {@link NavigationPolicies} objects.
 * @private  
 * @return {NavigationPolicies} The created {@link NavigationPolicies} object.
 * 
 * @example <pre>// create new navigation policies
	var navPolicies = scopes.svyNavigation.createNavigationPolicies();
	navPolicies.setOpenExistingItemPolicy(scopes.svyNavigation.OPEN_EXISTING_ITEM_POLICY.MOVE_TO_TOP_OF_STACK);
	
	// set navigation policies
	scopes.svyNavigation.setNavigationPolicies(navPolicies);</pre>
 * 
 * @properties={typeid:24,uuid:"70ACC9D7-4FAD-419F-B89D-F0188E0A9724"}
 */
function createNavigationPolicies() {
    return new NavigationPolicies();
}

/**
 * Sets the navigation policies; is suggested to call this method at the onOpenSolution event to properly initialize the navigation
 * @private  
 * @param {NavigationPolicies} policies
 * @example <pre>// create new navigation policies
	var navPolicies = scopes.svyNavigation.createNavigationPolicies();
	navPolicies.setOpenExistingItemPolicy(scopes.svyNavigation.OPEN_EXISTING_ITEM_POLICY.MOVE_TO_TOP_OF_STACK);
	
	// set navigation policies
	scopes.svyNavigation.setNavigationPolicies(navPolicies);</pre>
 * 
 * @properties={typeid:24,uuid:"12D38DE2-1348-409F-9195-91FB875DF831"}
 */
function setNavigationPolicies(policies) {
	navigationPolicies = policies;
}

/**
 * Opens the navigation item. 
 * If the item already exists in the stack, then all items after the specified item are closed
 * beforeClose event will be fired allowing a chance to react or cancel
 * afterOpen will fire allowing UIs to update
 * 
 * @public 
 * @param {NavigationItem|String} itemOrID
 * @param {JSRecord|JSFoundSet|QBSelect} [dataToShow] The data to show for the given navigation item. The data is passed to the afterOpen event
 * @param {String} [dataSelectionType] Determine the type of selection in the target navigation item with the given dataToShow {@link NAVIGATION_SELECTION_TYPE} enumeration options. The chosen selection type is passed to the afterOpen and needs to be implemented accordingly. Default NAVIGATION_SELECTION_TYPE.LOAD_RECORDS
 * 
 * @example <pre>//open a form
 * var item = new scopes.svyNavigation.NavigationItem(formName);
 * scopes.svyNavigation.open(item);
 * 
 * //open an item and pass data selection
 * var item = new scopes.svyNavigation.NavigationItem(formName);
 * scopes.svyNavigation.open(item,foundset.getSelectedRecord(),scopes.svyNavigation.NAVIGATION_SELECTION_TYPE.LOAD_RECORDS);
 * 
 * // open a form and pass custom data
 * var item = new scopes.svyNavigation.NavigationItem("ordersTableView");
 * item.setCustomData({ filter: { dataprovider: "orderdate", operator: "between", values: [startDate, endDate] } });
 * scopes.svyNavigation.open(item);
 * </pre>
 * 
 * @return {Boolean}
 * @properties={typeid:24,uuid:"1210FE48-6A94-40DD-9BF4-B843044EA1ED"}
 */
function open(itemOrID, dataToShow, dataSelectionType) {
	
	if (!dataToShow && dataSelectionType) {
		throw new Error(utils.stringFormat('Cannot open item; dataSelectionType "%1$s" cannot be applied and dataToShow Undefined', [dataSelectionType]));
	}
	
	// use default selection type
	if (dataToShow && !dataSelectionType) dataSelectionType = NAVIGATION_SELECTION_TYPE.LOAD_RECORDS;
	
	// set foundset can be called on a JSFoundSet
	if (!(dataToShow instanceof JSFoundSet) && dataSelectionType === NAVIGATION_SELECTION_TYPE.SET_FOUNDSET) {
		throw new Error('Cannot open item; dataSelectionType SET_FOUNDSET can be used only for data of type JSFoundSet');
	}
	
	// select record can be used only on data of type record
	if (!(dataToShow instanceof JSRecord) && ( dataSelectionType === NAVIGATION_SELECTION_TYPE.SELECT_RECORD || dataSelectionType === NAVIGATION_SELECTION_TYPE.FORCE_SELECT_RECORD)) {
		throw new Error("Cannot open item; dataSelectionType SELECT_RECORD or FORCE_SELECT_RECORD can be applied only for data of type JSRecord");
	}
	
	return openHandler(itemOrID, null, dataToShow, dataSelectionType);
}

/**
 * Internal open handler accepts skipHistoryEntry parameter
 * 
 * @private  
 * @param {NavigationItem|String} itemOrID
 * @param {Boolean} [skipHistoryEntry] when true, no entry will be added to the history stack
 * @param {JSRecord|JSFoundSet|QBSelect} [dataToShow]
 * @param {String} [dataSelectionType]
 * @return {Boolean}
 * @properties={typeid:24,uuid:"808C5DC6-56D3-4429-B3B1-05D7A4C485C1"}
 */
function openHandler(itemOrID, skipHistoryEntry, dataToShow, dataSelectionType) {
	
	// make sure svyNavigationHistory scope is loaded when calling the open
	if (!('svyNavigationHistory' in scopes)) {
		scopes.svyNavigationHistory;
	}

	// look for existing item in nav stack
	var id = itemOrID instanceof String ? itemOrID : itemOrID.getID();
	var navItem = itemOrID instanceof NavigationItem ? itemOrID : null;
	var index = items.length;
	for (var i = 0; i < items.length; i++) {
		var item = items[i];

		// found item
		// TODO Copy /  update item if it already existed, allow for mutation ?
		if (item.getID() == id) {
			index = i;
			navItem = item;
			break;
		}
	}

	// Item ID not found in stack
	if (!navItem) {
		// TODO log warning
		return false;
	}

	// before event
	if (items.length > 0 && !beforeClose()) {
		// TODO log warning
		return false;
	}

	if (navigationPolicies.getNavigationPolicy() === NAVIGATION_POLICY.CONCURRENT) {
		// remove this item from its current position and add it again at the top of the stack
		// TODO i am moving the navigation item on top of the stack..
		// would it make more sense to keep the order ot items in stack as is and track instead the index of the selected item ?
		items.splice(index, 1);
	} else {
		// close all the items in front of the re-opened item
		for (i = items.length - 1; i > index; i--) {
			// TODO what happens if some of the beforeClose has already returned true ?
			// maybe we need an AFTER_CLOSE event which can be used to finalize the closed state:
			// e.g. AFTER_CLOSE you are now sure that the item have been closed, you can remove the item from the tabpanel UI.
			if (!beforeClose(items[i])) {
				return false;
			}
		}

		// trim stack
		items = items.slice(0, index);
	}

//	// add item
	items.push(navItem);
	
	// track history
//	if (skipHistoryEntry !== true && itemsHistoryIndex !== -1) {
//		//we have been navigating through history, but now a new item is opened
//		//the new item is added at the current history index and the history is cut off at that point
//		itemsHistory.splice(itemsHistoryIndex + 1, itemsHistory.length - itemsHistoryIndex, navItem);
//		itemsHistoryIndex = -1;
//	} else if (skipHistoryEntry !== true) {
//		//we are not navigating through history, item is added to history
//		itemsHistory.push(navItem);
//		if (MAX_HISTORY_LENGTH !== -1 && itemsHistory.length > MAX_HISTORY_LENGTH) {
//			itemsHistory.shift();
//		}
//	}

	// after event
	afterOpen(dataToShow, dataSelectionType);

	return true;
}

/**
 * @private 
 * @param {NavigationItem|String} itemOrID
 * @return {Number}
 * @properties={typeid:24,uuid:"931CD229-352B-4840-A469-793A68A0EF64"}
 */
function indexOf(itemOrID){
	var id = itemOrID instanceof String ? itemOrID : itemOrID.getID();
	for (var i = 0; i < items.length; i++){
		var item = items[i];
		if(item.getID() == id){
			return i;
		}
	}
	return -1;
}

/**
 * Closes current navigation item and opens the previous item
 * @param {NavigationItem|String} [itemOrID]
 * 
 * @private 
 * @return {Boolean}
 * @properties={typeid:24,uuid:"2F17EE08-7E2D-4559-9C53-53D50612A8FB"}
 */
function close(itemOrID) {

	var item; 
	if (itemOrID) {	
		
		if (itemOrID instanceof String) {
			/** @type {String} */
			var id = itemOrID;
			item = getNavigationItem(id)
		} else {
			item = itemOrID;
		}
		
		// find the position of the item
		var index = indexOf(itemOrID);
		
		// validate index position
		if (index >= 0) {
			// TODO shall i allow to close the last item when navigation policy is concurrent or create a new policy !?
			if (index < 1) {
				// there is no previous item, cannot close
				return false;
			}
		} else {	// cannot find the item to close
			return false;
		}
		
		// before event
		if(!beforeClose(item)){
			// TODO log warning
			return false;
		}
		
		var currentItem = getCurrentItem();
		
		// TODO does it make sense to have a remove policy which differs from OPEN_EXISTING_ITEM_POLICY !?!?
		if (navigationPolicies.getNavigationPolicy() === NAVIGATION_POLICY.CONCURRENT) {
			// remove only the navigation item
			items.splice(index, 1);
		} else {	// default navigation policy is CLOSE_ITEM_POLICY.RESET_STACK
			// trim stack
			items = items.slice(0, index - 1);
		}
		
		// open the current item if the current item has been changed
		var newCurrentItem = getCurrentItem();
		if (newCurrentItem && newCurrentItem.getID() != currentItem.getID()) {
			// open the currentItem since current item has changed
			afterOpen();
		}
		
		return true;
	} else { // close the last item
	
		// get previous item
		item = items[items.length - 2];
		
		// No previous item
		if (!item) {
			// TODO log warning
			return false;
		}

		// for linear navigation open item will close all the items in front of it
		return open(item);
	}
}

/**
 * @private  
 * @param {NavigationItem} navigationItem
 * @return {Boolean}
 * @properties={typeid:24,uuid:"2E121717-BF41-45FB-A7A0-86C384EC2359"}
 */
function reset(navigationItem){
	
	// before event
	if(!beforeClose()){
		// TODO log warning
		return false;
	}
	
	// reset to item
	items = [navigationItem];
	
	// after event
	afterOpen();
	
	return true;
}

/**
 * @private  
 * @return {Array<NavigationItem>}
 * @properties={typeid:24,uuid:"37235352-825E-4881-8E35-78A52A467961"}
 */
function getNavigationItems(){
	var a = [];
	for(var i in items){
		a.push(items[i]);
	}
	return a;
}

/**
 * Returns the item with the given ID from the items stack when found and null otherwise
 * @private  
 * @param {String} id
 * @return {NavigationItem}
 * @properties={typeid:24,uuid:"73F69D5E-6708-4937-AE3D-ACBC5C620A89"}
 */
function getNavigationItem(id){
	// TODO consider making a map for performance improvement
	for(var i in items){
		var item = items[i];
		if (item.getID() == id){
			return item;
		}
	}
	return null;
}

/**
 * @public 
 * @return {NavigationItem}
 * @properties={typeid:24,uuid:"0BAAECA1-12F7-4EDF-B27B-12502A00F940"}
 */
function getCurrentItem(){
	return items[items.length-1];
}

/**
 * @private  
 * @param {NavigationItem|String} itemOrID
 * @return {Boolean}
 * @properties={typeid:24,uuid:"A9618AEE-8091-49D1-B838-EAC9CFDC7CCB"}
 */
function hasItem(itemOrID){
	return indexOf(itemOrID) >= 0;
}

/**
 * @public 
 * @param {function(NavigationEvent)} listener
 * 
 * @example
 * <pre> // register for navigation event
 * scopes.svyNavigation.addNavigationListener(onOpen);
 * 
 * function onOpen(event) {
 *	var type = event.getEventType();
 *	if (type == scopes.svyNavigation.NAVIGATION_EVENT.AFTER_OPEN) {
 *		var item = event.getNavigationItem();
 *		var formName = item.getFormName();
 *		var dataToShow = event.getDataToShow();
 *		var dataSelectionType = event.getDataSelectionType();
 *		
 *		// get the form instance
 *		var form = forms[formName];
 *		
 *		switch (dataSelectionType) {
 *		case scopes.svyNavigation.NAVIGATION_SELECTION_TYPE.LOAD_RECORDS:
 *		// load the given data into the foundset form
 *		if (dataToShow instanceof JSFoundSet) {
 *			// load the passed foundset into the form's foundset
 *			form.foundset.loadRecords(dataToShow);
 *		} else if (dataToShow instanceof QBSelect) {
 *			// load the QBSelect into the form's foundset
 *			form.foundset.loadRecords(dataToShow);
 *		} else if (dataToShow instanceof JSRecord) {
 *			// load the record into the form's foundset
 *			scopes.svyDataUtils.loadRecords(form.foundset, dataToShow.getPKs());
 *		}
 *		break;
 *		case scopes.svyNavigation.NAVIGATION_SELECTION_TYPE.SET_FOUNDSET:
 *			form.controller.loadRecords(dataToShow);
 *			break;
 *		default:
 *			break;
 *		}
 *		
 *		// show the form
 *		application.showForm(form);
 *	} else if (event.getEventType() == scopes.svyNavigation.NAVIGATION_EVENT.BEFORE_CLOSE) {
 *      // cancel navigation if there are pending edits to be saved
 *      if (databaseManager.getEditedRecords().length) {
 *          return false;   // or ask in a dialog
 *      }
 *  }
 *	return true;
 *}
 * 
 * </pre>
 *
 * @properties={typeid:24,uuid:"04A23E5B-4EC6-4E24-BAB1-AA9CAF0A8169"}
 */
function addNavigationListener(listener) {
	if (listeners.indexOf(listener) === -1) {
		listeners.push(listener);
	}
}

/**
 * @public 
 * @param {function(NavigationEvent)} listener
 * @return {Boolean}
 * 
 * @example
 * <pre>
 * scopes.svyNavigation.removeNavigationListener(onOpen);
 * </pre>
 *
 * @properties={typeid:24,uuid:"E5011D75-223B-40AA-A4A0-79C4A13CB464"}
 */
function removeNavigationListener(listener){
	for (var i = 0; i < listeners.length; i++) {
		if (listeners[i] === listener) {
			listeners.splice(i, 1);
			return true;
		}
	}
	return false;
}

/**
 * @param {NavigationItem} [item] the item being closed. If not specified close the current item
 * @private 
 * @return {Boolean}
 * @properties={typeid:24,uuid:"914C25FC-8CA0-4B8E-B399-624FED29A6EC"}
 */
function beforeClose(item){
	if (!item) item = getCurrentItem();
	return fireEvent(NAVIGATION_EVENT.BEFORE_CLOSE, item);
}

/**
 * @param {JSRecord|JSFoundSet|QBSelect} [dataToShow]
 * @param {String} [dataSelectionType]
 * @private 
 * @properties={typeid:24,uuid:"6E9FD4C0-BD9C-4257-80F3-677953F8ACE6"}
 */
function afterOpen(dataToShow, dataSelectionType){
	fireEvent(NAVIGATION_EVENT.AFTER_OPEN, getCurrentItem(), dataToShow, dataSelectionType);
}

/**
 * @private 
 * @param {String} eventType
 * @param {NavigationItem} [item]
 * @param {JSRecord|JSFoundSet|QBSelect} [dataToShow]
 * @param {String} [dataSelectionType]
 * @return {Boolean}
 *
 * @properties={typeid:24,uuid:"CFB73B7E-56EB-4FBD-B48F-F8BA4C312B0B"}
 */
function fireEvent(eventType, item, dataToShow, dataSelectionType) {
	var event = new NavigationEvent(eventType, item, dataToShow, dataSelectionType);
	for (var i in listeners) {
		/** @type {Function} */
		var listener = listeners[i];
		var result = listener.call(this, event);
		if (eventType == NAVIGATION_EVENT.BEFORE_CLOSE) {
			if (result === false) {
				return false;
			}
		}
	}
	return true;
}

/**
 * 
 * @constructor
 * @private 
 * @param {String} eventType
 * @param {NavigationItem} [item]
 * @param {JSRecord|JSFoundSet|QBSelect} [data]
 * @param {String} [dataSelectionType]
 * @properties={typeid:24,uuid:"B809ACA1-1541-4A8B-A0F7-0557C2034248"}
 */
function NavigationEvent(eventType, item, data, dataSelectionType){
	
	/**
	 * Returns the navigation event type;
	 * The event type value can be scopes.svyNavigation.NAVIGATION_EVENT.AFTER_OPEN or scopes.svyNavigation.NAVIGATION_EVENT.BEFORE_OPEN
	 * 
	 * @public 
	 * @return {String}
	 */
	this.getEventType = function(){
		return eventType;
	}
	
	/**
	 * Returns the navigation item
	 * 
	 * @public 
	 * @return {NavigationItem}
	 */
	this.getNavigationItem = function(){
		return item;
	}
	
	/**
	 * 
	 * @public 
	 * @return {JSRecord|JSFoundSet|QBSelect}
	 */
	this.getDataToShow = function(){
		return data;
	}
	/**
	 * Returns the data selection type.
	 * The value of the data selection type can be one from the enum scopes.svyNavigation.NAVIGATION_SELECTION_TYPE
	 * 
	 * @public 
	 * @return {String}
	 */
	this.getDataSelectionType = function(){
		return dataSelectionType;
	}
}

/**
 * Creates a NavigationItem object to the given formName
 * 
 * @param {String} [formName]
 * @param {String} [text]
 * @param {String} [tooltipText]
 * @public 
 * 
 * @return {NavigationItem}
 *
 * @properties={typeid:24,uuid:"88AE45D1-10B7-4EBB-AF45-BCCDB8B3482E"}
 */
function createNavigationItem(formName, text, tooltipText) {
	return new NavigationItem(formName, text, tooltipText);
}

/**
 * @constructor
 * @public  
 * @param {String} [formName]
 * @param {String} [text]
 * @param {String} [tooltipText]
 * @properties={typeid:24,uuid:"2280FA71-A862-4C29-943A-57DA126FFB0D"}
 */
function NavigationItem(formName, text, tooltipText) {
    
	/**
     * @protected
     * @type {String}
     * @ignore
     */
    this.id = application.getUUID().toString();
    
    /**
     * @protected
     * @type {String}
     * @ignore
     */
    this.formName = formName;
    
    /**
     * @protected
     * @type {String}
     * @ignore
     */
    this.text = text ? text : formName;
    
    /**
     * @protected
     * @type {String}
     * @ignore
     */
    this.tooltipText = tooltipText ? tooltipText : this.text;
    
    /**
     * @protected
     * @type {*}
     * @ignore
     */
    this.customData = null;
}

/**
 * Extends the NavigationItem prototype by adding the necessary methods.
 * Using this approach to minimize the memory footprint of the NavigationItem instances.
 * @constructor
 * @private
 * @properties={typeid:24,uuid:"D50A8EE4-B680-4470-A1B1-1B21D2CA7285"}
 */
function setupNavigationItem() {
	
    /**
     * @public
     * 
     * @this {NavigationItem}
     */
     NavigationItem.prototype.stringify = function() { 
    	 var json = new Object();
         json.id = this.getID();
         json.formName  = this.getFormName();
         json.text = this.getText();
		 json.tooltipText = this.getTooltipText();
         var customData = this.getCustomData();
         if (customData) {
        	 json.customData = customData;
         }         
         return JSON.stringify(json);
    };
    
    /**
     * Gets the name of the form associated with this navigation item.
     * @public
     * @return {String}
     * @this {NavigationItem}
     */
    NavigationItem.prototype.getFormName = function() {
        return this.formName;
    };
    
    /**
     * Sets the name of the form associated with this navigation item.
     * @public
     * @param {String} formName
     * @return {NavigationItem}
     * @this {NavigationItem}
     */
    NavigationItem.prototype.setFormName = function(formName) {
        if (!formName || !utils.stringTrim(formName)) {
            throw new Error('FormName is not specified');
        }
        this.formName = formName;
        return this;
    };
    
    /**
     * @public
     * @return {String}
     * @this {NavigationItem}
     */
    NavigationItem.prototype.getText = function() {
        return this.text;
    };
    
    /**
     * @public
     * @param {String} text
     * @return {NavigationItem}
     * @this {NavigationItem}
     */
    NavigationItem.prototype.setText = function(text) {
        this.text = text;
        return this;
    };
    
    /**
     * @public
     * @return {String}
     * @this {NavigationItem}
     */
    NavigationItem.prototype.getTooltipText = function() {
        return this.tooltipText;
    };
    
    /**
     * @public
     * @return {String}
     * @this {NavigationItem}
     */
    NavigationItem.prototype.getID = function() {
        return this.id;
    };
    
    /**
     * @public
     * @param {String} tooltipText
     * @return {NavigationItem}
     * @this {NavigationItem}
     */
    NavigationItem.prototype.setTooltipText = function(tooltipText) {
        this.tooltipText = tooltipText;
        return this;
    };
    
    /**
     * @public
     * @return {*}
     * @this {NavigationItem}
     * 
     * @example <pre>
     * function onShow() {
     *   // get the current navigation item
     *    var item = scopes.svyNavigation.getCurrentItem();
     *    var customData = item.getCustomData();
     *    if (customData && customData.filter) {
     *       var filter = customData.filter;
     *       foundset.addFoundSetFilterParam(filter.dataprovider, filter.operator, filter.values);
     *       foundset.loadRecords();
     *    }
     * }
     * </pre>
     * 
     */
    NavigationItem.prototype.getCustomData = function() {
        return this.customData;
    };
    
    /**
     * @public
     * @param {*} customData
     * @return {NavigationItem}
     * @this {NavigationItem}
     * 
     * @example <pre>
     * var item = new scopes.svyNavigation.NavigationItem("ordersTableView");
     * item.setCustomData({ filter: { dataprovider: "orderdate", operator: "between", values: [startDate, endDate] } });
     * scopes.svyNavigation.open(item);
     * </pre>
     * 
     */
    NavigationItem.prototype.setCustomData = function(customData) {
        this.customData = customData;
        return this;
    };
}

/**
 * Gets the version of this module
 * @public 
 * @return {String} the version of the module using the format Major.Minor.Revision
 * @properties={typeid:24,uuid:"1D3CA4FB-0CEF-4443-89C3-FD9C7618C84F"}
 */
function getVersion() {
    return application.getVersionInfo()['svyNavigation'];
}

/**
 * Initializes the module.
 * NOTE: This var must remain at the BOTTOM of the file.
 * @private
 * @SuppressWarnings (unused)
 *
 * @properties={typeid:35,uuid:"73D3B2D7-093B-4C94-B13E-867D9923BE16",variableType:-4}
 */
var init = function() {
    setupNavigationItem();
}();
