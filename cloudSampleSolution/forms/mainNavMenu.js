/**
 * @private
 * @properties={typeid:35,uuid:"CAE104C4-A142-4A6D-AA79-C960AAA819AE",variableType:-4}
 */
var NAVBAR_ACTIONS = {
	DOWNLOAD_IDE: "download-ide",
	PRIMARY_COLOR: "primary-color"
};

/**
 * @protected 
 * @param event
 *
 * @properties={typeid:24,uuid:"6BF1B22E-1E26-426D-8AD6-F7D6EA7CA770"}
 * @override
 */
function onLoad(event) {
	_super.onLoad(event);

	// register for search event
	scopes.svyNavigationUX.addGlobalSearchListener(onSearch);
}

/**
 * @return {Array<CustomType<servoyextra-sidenav.MenuItem>>}
 * @protected
 * @override
 * @properties={typeid:24,uuid:"C7E93724-084A-4757-B313-3CD3899C1572"}
 */
function loadMenuItems() {

	/** @type {CustomType<servoyextra-sidenav.MenuItem>} */
	var menuItem;
	var menuItems = [];
	var menuSubItem;
	var menuSubItems = [];

	// HOME
	menuItem = new Object();
	menuItem.id = "homeDashboard";
	menuItem.text = "DASHBOARD"
	menuItem.iconStyleClass = "fa fa-th-large";
	menuItems.push(menuItem);

	// CUSTOMERS
	menuItem = new Object();
	menuItem.id = "customersTableView";
	menuItem.text = "CUSTOMERS"
	menuItem.iconStyleClass = "icon-contacts";
	menuItems.push(menuItem);

	// ORDERS
	menuItem = new Object();
	menuItem.id = "ordersTableView";
	menuItem.text = "ORDERS"
	menuItem.iconStyleClass = "icon-box";
	menuItems.push(menuItem);

	// SECURITY
	menuItem = new Object();
	menuItem.id = scopes.svySecurityUX.SVY_SECURITY_UX.TENANT;
	menuItem.text = "SECURITY"
	menuItem.iconStyleClass = "fa fa-shield";

	menuSubItem = new Object();
	menuSubItem.id = scopes.svySecurityUX.SVY_SECURITY_UX.TENANT_ROLES;
	menuSubItem.text = "ROLES"
	menuSubItem.iconStyleClass = "fa fa-user-shield";
	menuSubItems.push(menuSubItem);

	menuSubItem = new Object();
	menuSubItem.id = scopes.svySecurityUX.SVY_SECURITY_UX.TENANT_USERS;
	menuSubItem.text = "USERS"
	menuSubItem.iconStyleClass = "fa fa-user-shield";
	menuSubItems.push(menuSubItem);

	menuItem.menuItems = menuSubItems;
	menuItems.push(menuItem);
	
	// DIVIDER
	menuItem = new Object();
	menuItem.isDivider = true;
	menuItems.push(menuItem);
	
	// TUTORIAL
	menuItem = new Object();
	menuItem.id = "TUTORIAL";
	menuItem.text = "TUTORIAL"
	menuItem.styleClass = "font-weight-bold"
	menuItem.iconStyleClass = "fas fa-graduation-cap";
	menuItems.push(menuItem);

	// DIVIDER
	menuItem = new Object();
	menuItem.isDivider = true;
	menuItems.push(menuItem);
	
	return menuItems;
}

/**
 * @protected 
 * @param menuItemId
 * @param event
 * @return {Boolean}
 *
 * @properties={typeid:24,uuid:"413A1E7A-D4AD-4651-A78C-54541FDAB6D7"}
 * @override
 */
function onMenuItemSelected(menuItemId,event) {
	
	if (menuItemId === "TUTORIAL") {
		scopes.tutorial.showTutorial()
		return false;
	}
	
	return true;
}

/**
 * @return {Array<CustomType<bootstrapextracomponents-navbar.menuItem>>}
 * @protected
 * @properties={typeid:24,uuid:"B1558097-985D-4E15-A3CB-DC956FE2CA6C"}
 * @override
 */
function loadNavbarItems() {
	var menuItems = [];
	/** @type {CustomType<bootstrapextracomponents-navbar.menuItem>} */
	var menuItem;

	menuItem = elements.navbar.createMenuItem('Download IDE', NAVBAR_ACTIONS.DOWNLOAD_IDE, 'RIGHT');
	menuItem.displayType = 'MENU_ITEM';
	menuItem.styleClass = 'btn-download-ide btn-round border-default margin-10';
	menuItem.iconName = "icon-cloud-download";
	menuItems.push(menuItem);

	menuItem = elements.navbar.createMenuItem('Search', DEFAULT_NAVBAR_ACTIONS.SEARCH, 'RIGHT');
	menuItem.displayType = 'INPUT_GROUP';
	menuItem.styleClass = 'closed searchbar';
	menuItem.inputButtonStyleClass = "btn-default";
	menuItem.iconName = "fa fa-search";
	menuItems.push(menuItem);

	if (security.getUserName()) {
		menuItem = elements.navbar.createMenuItem(security.getUserName(), DEFAULT_NAVBAR_ACTIONS.USER, 'RIGHT');
		menuItem.displayType = 'MENU_ITEM';
		menuItem.iconName = 'fas fa-user';
		menuItem.styleClass = 'no-border';
		var submenuItems = [];

		var primaryColor = elements.navbar.createMenuItem('Primary Colors', NAVBAR_ACTIONS.PRIMARY_COLOR);
		primaryColor.iconName = "fas fa-square text-primary border-default border-radius";
		submenuItems.push(primaryColor);

		var logout = elements.navbar.createMenuItem('Logout', DEFAULT_NAVBAR_ACTIONS.LOGOUT);
		//logout.iconName = "fas fa-sign-out-alt";
		submenuItems.push(logout);
		menuItem.subMenuItems = submenuItems;
		menuItems.push(menuItem);
	}

	return menuItems;
}

/**
 * @protected
 * @param {JSEvent} event
 * @param menuItem
 *
 * @properties={typeid:24,uuid:"05D20151-9074-408E-9565-00608B51F491"}
 * @override
 */
function onNavbarMenuItemClicked(event, menuItem) {

	switch (menuItem.itemId) {
	case NAVBAR_ACTIONS.DOWNLOAD_IDE:
		application.showURL('https://www.servoy.com/download/', '_blank');
		break;
	case NAVBAR_ACTIONS.PRIMARY_COLOR:

		var popup = plugins.window.createFormPopup(forms.colorPicker);
		popup.x(event.getX());
		popup.y(event.getY());
		popup.show();

		break;
	case DEFAULT_NAVBAR_ACTIONS.LOGOUT:
		scopes.svySecurity.logout();
		break;
	default:
		break;
	}

}

/**
 * @protected
 * @param {String} txt
 *
 * @properties={typeid:24,uuid:"AC463340-1123-4AE3-8E04-536019C90B85"}
 * @AllowToRunInFind
 */
function onSearch(txt) {
	// show search view lookup
	var lookup = scopes.svyLookup.createLookup(datasources.mem.search_results.getDataSource());
	lookup.setLookupForm(forms.searchViewLookup);
	lookup.addField("").setSearchable(false).setStyleClass("text-center fa-2x").setStyleClassDataprovider("iconStyleClass").setWidth("50");
	lookup.addField("text_value").setTitleText("RESULT");
	
	// show the lookup as popup popup
	var popup = lookup.createPopUp(onSearchLookup, txt);
	popup.y(86);
	popup.x(application.getWindow().getWidth() - 501);
	popup.width(500);
	popup.show();
}

/**
 * @protected 
 * @param {Array<JSRecord<mem:search_results>>} records
 * @param values
 * @param lookup
 *
 * @properties={typeid:24,uuid:"DFE38EA8-88D7-4939-9DD2-D9498CE540F0"}
 */
function onSearchLookup(records, values, lookup) {

	// handle search lookup selection
	if (records && records.length) {
		
		var record = records[0];

		switch (record.table_name) {
		case "customers":
			// navigate to customer
			var customerRecord = scopes.svyDataUtils.getRecord(datasources.db.example_data.customers.getDataSource(), [record.pks]);
			scopes.global.showForm(forms.customerView, customerRecord, scopes.svyNavigation.NAVIGATION_SELECTION_TYPE.LOAD_RECORDS);
			break;
		case "orders":
			// navigate to customer's order
			var orderRecord = scopes.svyDataUtils.getRecord(datasources.db.example_data.orders.getDataSource(), [record.pks]);
			scopes.global.showForm(forms.orderEdit, orderRecord, scopes.svyNavigation.NAVIGATION_SELECTION_TYPE.LOAD_RECORDS);
			break;
		default:
		}
	}
}
