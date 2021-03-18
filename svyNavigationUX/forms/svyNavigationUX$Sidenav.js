/**
 * @protected
 * @properties={typeid:35,uuid:"2B0AE741-5A64-4206-B804-3C6D02DF9DAA",variableType:-4}
 */
var DEFAULT_NAVBAR_ACTIONS = {
	SEARCH: "navbar-search",
	USER: "navbar-user",
	LOGOUT: "navbar-logout"
};

/**
 * @private
 * @properties={typeid:24,uuid:"35A142E7-128E-4496-8F28-5D62647F5FCF"}
 * @override
 */
function initNavigationForm() {

	// init the sidenav menu
	var menuItems = loadMenuItems();
	elements.sidenav.setRootMenuItems(menuItems);

	// init the navbar menu
	var navbarItems = loadNavbarItems();
	elements.navbar.setMenuItems(navbarItems);
}

/**
 * This method is called as part of then form's onLoad event.
 * Load the returned list of menu items into the sidenav menu of the template.
 * Override this method and return an Array of type servoyextra-sidenav.MenuItem (Array<servoyextra-sidenav.MenuItem>)
 * to initialize the sidenav menu with your own set of menu items.<br/>
 * Learn more on MenuItem and Sidenav https://github.com/Servoy/servoy-extra-components/wiki/Sidenav#menu-item
 * 
 * @return {Array<CustomType<servoyextra-sidenav.MenuItem>>}
 * @protected
 * 
 * @example <pre>
 * function loadMenuItems() {
 * 	var menuItems = [];
 *	
 *	\\ @type {CustomType&lt;servoyextra-sidenav.MenuItem&gt;} 
 *	var menuItem = new Object();
 *	menuItem.id = "yourFormName";
 *	menuItem.iconStyleClass = "fa fa-home";
 *	menuItem.text = "Home";
 *	menuItems.push(menuItem);
 *
 *	return menuItems;
 *}
 * </pre>
 * @properties={typeid:24,uuid:"7C672A54-C78D-48DF-946B-F1F96993AAB7"}
 */
function loadMenuItems() {
	var menuItems = [];

	/** @type {CustomType<servoyextra-sidenav.MenuItem>} */
	var menuItem = new Object();
	menuItem.id = "svyNavigationUX$Welcome";
	menuItem.text = "NAVIGATION"
	menuItem.iconStyleClass = "fas fa-compass";
	menuItems.push(menuItem);
	

        // return the menu items
	return menuItems;
}

/**
 * 
 * This method is called as part of then form's onLoad event.
 * Load the returned list of menu items into the top navbar menu of this template.
 * Override this method and return an Array of type bootstrapextracomponents-navbar.menuItem (Array<bootstrapextracomponents-navbar.menuItem>)
 * to initialize the navbar menu with your own set of menu items.<br/>
 * Learn more on MenuItem and Navbar https://github.com/Servoy/bootstrapextracomponents/wiki/Navbar#menuitem-type
 * 
 * @return {Array<CustomType<bootstrapextracomponents-navbar.menuItem>>}
 *
 * @protected
 * @example <pre>function loadNavbarItems() {
 *	var menuItems = [];
 * 	var menuItem;
 *
 *	menuItem = elements.navbar.createMenuItem('Search', DEFAULT_NAVBAR_ACTIONS.SEARCH, 'RIGHT');
 *	menuItem.displayType = 'INPUT_GROUP';
 *	menuItem.styleClass = 'closed searchbar';
 *	menuItem.inputButtonStyleClass = "btn-default";
 *	menuItem.iconName = "fa fa-search";
 *	menuItems.push(menuItem);
 *
 *	if (security.getUserName()) {
 *		menuItem = elements.navbar.createMenuItem(security.getUserName(), DEFAULT_NAVBAR_ACTIONS.USER, 'RIGHT');
 *		menuItem.displayType = 'MENU_ITEM';
 *		menuItem.iconName = 'fa fa-user';
 *		menuItem.styleClass = 'no-border';
 *		var submenuItems = [];
 *
 *		submenuItems.push(elements.navbar.createMenuItem('Logout', DEFAULT_NAVBAR_ACTIONS.LOGOUT));
 *		menuItem.subMenuItems = submenuItems;
 *		menuItems.push(menuItem);
 *	}
 *
 *	return menuItems;
 *}</pre>
 * @properties={typeid:24,uuid:"22C5E77A-8061-4AF0-801F-7A1DAE6644FE"}
 */
function loadNavbarItems() {
	var menuItems = [];
	var menuItem;

	menuItem = elements.navbar.createMenuItem('Search', DEFAULT_NAVBAR_ACTIONS.SEARCH, 'RIGHT');
	menuItem.displayType = 'INPUT_GROUP';
	menuItem.styleClass = 'closed searchbar';
	menuItem.inputButtonStyleClass = "btn-default";
	menuItem.iconName = "fa fa-search";
	menuItems.push(menuItem);

	if (security.getUserName()) {
		menuItem = elements.navbar.createMenuItem(security.getUserName(), DEFAULT_NAVBAR_ACTIONS.USER, 'RIGHT');
		menuItem.displayType = 'MENU_ITEM';
		menuItem.iconName = 'fa fa-user';
		menuItem.styleClass = 'no-border';
		var submenuItems = [];

		submenuItems.push(elements.navbar.createMenuItem('Logout', DEFAULT_NAVBAR_ACTIONS.LOGOUT));
		menuItem.subMenuItems = submenuItems;
		menuItems.push(menuItem);
	}

	return menuItems;
}

/**
 * Returns the active formName which is the containedForm of the sidenav element
 * 
 * @return {String}
 * @public
 *
 * @properties={typeid:24,uuid:"01FF50C6-D6EA-4CB1-81C7-58E11A8FFD46"}
 */
function getActiveFormName() {
	if (elements.sidenav && elements.sidenav.containedForm) {
		return elements.sidenav.containedForm;
	} else {
		return null;
	}
}

/**
 * @private
 * @param {scopes.svyNavigation.NavigationEvent} event
 *
 * @properties={typeid:24,uuid:"EB547A09-C78E-462F-936D-21FB1E5675B4"}
 * @override
 */
function onOpen(event) {

	/** @type {scopes.svyNavigation.NavigationItem} */
	var item = event.getNavigationItem();
	var formName = item.getFormName();
	
	// get the form instance
	var form = forms[formName];
	if (!form) {
		throw new scopes.svyExceptions.IllegalStateException('Cannot navigate to form because cannot find form instance ' + formName);
	}

	// show form
	elements.sidenav.containedForm = formName;

	//  update the selected menu item for the main menu
	var menuId = getMenuItemID(item.getFormName());
	if (menuId) {
		elements.sidenav.setSelectedMenuItemAsync(menuId);
	} else {
		elements.sidenav.setSelectedMenuItemAsync(null);
	}
}

/**
 * Called whenever a menu item from the sidenav is selected with the JSEvent and the menuItemId clicked on.
 * 
 * @param {String} menuItemId
 * @param {JSEvent} event
 *
 * @return {boolean}
 *
 * @private
 *
 * @properties={typeid:24,uuid:"F63F028E-A9C6-40E2-9B2B-2D89DA4C02F2"}
 */
function onMenuItemSelectedHandler(menuItemId, event) {

	if (onMenuItemSelected(menuItemId, event) === false) {
		return false;
	}

	// form to navigate too
	var formName = getMenuItemFormName(menuItemId)
	var form = forms[formName];

	// open the selected navigation item
	if (menuItemId && formName && form) {
		var menuItem = elements.sidenav.getMenuItem(menuItemId);

		// TODO will always be a new navigation item !?!?
		var item = new scopes.svyNavigation.NavigationItem(formName, menuItem.text);
		return scopes.svyNavigation.open(item);
	}

	return true;
}

/**
 * Called as part of the onMenuItemSelectedHandler event
 * Called whenever a menu item from the sidenav is selected with the JSEvent and the menuItemId clicked on.
 * This method can be overriden to prevent the selection (.e.g check if user has permissions) or for handling specific menu options which will trigger a function (.e.g logout) instead of switching the visible form
 * Return false to stop the navigation and prevent the selection.
 * 
 * @protected
 * @param {String} menuItemId
 * @param {JSEvent} event
 *
 * @return {Boolean}
 *
 * @properties={typeid:24,uuid:"F49F40C5-606A-48E5-9E0D-392601162147"}
 */
function onMenuItemSelected(menuItemId, event) {
	return true;
}

/**
 * Called whenever a menu item is clicked or a submenu item is selected with the JSEvent and the menuItem object clicked on.
 *
 * @param {JSEvent} event
 * @param {CustomType<bootstrapextracomponents-navbar.menuItem>} menuItem
 *
 * @private
 *
 * @properties={typeid:24,uuid:"27141B27-E4A4-4E9E-972B-782E0A8CA996"}
 */
function onNavbarMenuItemClickedHandler(event, menuItem) {
	var menuItemId = menuItem.itemId;

	if (onMenuItemSelected(menuItemId, event) === false) {
		return;
	}

	switch (menuItemId) {
	case DEFAULT_NAVBAR_ACTIONS.SEARCH:
		onGlobalSearch(menuItem.text);
		break;
	case DEFAULT_NAVBAR_ACTIONS.LOGOUT:
		// TODO shall implement a onLogout event ?
	default:

		// form to navigate too
		var formName = getMenuItemFormName(menuItemId)
		var form = forms[formName];

		// navigate to a form
		if (form) {
			// TODO will always be a new navigation item !?!?
			var item = new scopes.svyNavigation.NavigationItem(menuItemId, menuItem.text);
			if (scopes.svyNavigation.open(item)) {
				elements.navbar.setMenuSelected(menuItemId);
			}
		} else {
			onNavbarMenuItemClicked(event, menuItem);
		}
		break;
	}
}

/**
 * Called as part of the onNavbarMenuItemClickedHandler event
 * Called whenever a menu item is clicked or a submenu item is selected with the JSEvent and the menuItem object clicked on.
 * This method can be overriden for handling specific navbar options
 *
 * @param {JSEvent} event
 * @param {CustomType<bootstrapextracomponents-navbar.menuItem>} menuItem
 * @protected
 * 
 * @example <pre>
 * function onNavbarMenuItemClicked(event, menuItem) {
 * 
 *   switch (menuItem.itemId) {
 *   case DEFAULT_NAVBAR_ACTIONS.LOGOUT:
 *   	scopes.svySecurity.logout();
 *   	break;
 *   default:
 *   	break;
 *   }
 *}</pre>
 *
 * @properties={typeid:24,uuid:"8A65736D-B12C-4978-8A11-468129B7201F"}
 */
function onNavbarMenuItemClicked(event, menuItem) { 
	// intentionally left empty
}

/**
 * @private 
 * @param {String} searchText
 *
 * @properties={typeid:24,uuid:"3DEDEC6C-611D-4FF2-A726-A79EA0B7060D"}
 */
function onGlobalSearch(searchText) {
	scopes.svyNavigationUX.triggerGlobalSearch(searchText);
}

/**
 * Callback method for when form is shown.
 *
 * @param {Boolean} firstShow form is shown first time after load
 * @param {JSEvent} event the event that triggered the action
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"06F44AEF-F11B-48CA-9B83-65DD135D90B9"}
 */
function onShow(firstShow, event) {
	if (firstShow) {
		// set first selection
		if (elements.sidenav.containedForm) {
			var selectedItemID = getMenuItemID(elements.sidenav.containedForm); 
			var selectedItem = elements.sidenav.getMenuItem(selectedItemID);
			if (selectedItem) {
				elements.sidenav.setSelectedMenuItemAsync(selectedItemID);
			}
		}
	}
}
