/**
 * @private 
 * @type {String}
 * @SuppressWarnings(unused)
 *
 * @properties={typeid:35,uuid:"AC0890DB-44B5-406C-98C2-10C91900F290"}
 */
var SAMPLE_APPLICATION_VERSION = "1.0.0";

/**
 * @protected 
 * @properties={typeid:35,uuid:"E58D06FB-AB22-4449-AD17-2388722974D7",variableType:-4}
 */
var DEFAULT_COLORS = {
	'MAIN-COLOR': '#4880FF',
	'SECONDARY-COLOR': '#FFF'
};

/**
 * @protected
 * Callback method for when solution is opened.
 * When deeplinking into solutions, the argument part of the deeplink url will be passed in as the first argument
 * All query parameters + the argument of the deeplink url will be passed in as the second argument
 * For more information on deeplinking, see the chapters on the different Clients in the Deployment Guide.
 *
 * @param {String} arg startup argument part of the deeplink url with which the Client was started
 * @param {Object<Array<String>>} queryParams all query parameters of the deeplink url with which the Client was started
 *
 * @properties={typeid:24,uuid:"BFCC6B60-B595-4A61-B90E-0D1D0853B7C7"}
 */
function onSolutionOpen(arg, queryParams) {
	
	// autosave false
	databaseManager.setAutoSave(false);
	
	// disable null check validation exception
	databaseManager.nullColumnValidatorEnabled = false;

	// global config for grids
	configGrid();
	
	// global config for grid filters
	scopes.svyToolbarFilter.setPopupDefaultOperator(scopes.svyToolbarFilter.FILTER_TYPES.TOKEN, scopes.svyPopupFilter.OPERATOR.LIKE);

	// run onAfterUserCreate when a user is created from the svySecurityUX templates
	scopes.svySecurityUX.addAfterUserCreateListener(onAfterUserCreate);
	
	// apply custom style at the onOpen
	overrideSolutionStyle();
	
	// reference FA for load
	plugins.fontawesomeLib.load();

	// update sample data to last year
	scopes.cloudSampleData.updateOrderDates();
	
	// init navigation first-item
	scopes.global.showForm(forms.homeDashboard);
}

/**
 * configure grid globally, applying a common style & behavior
 * 
 * @private
 * @properties={typeid:24,uuid:"7AB92316-A5EC-4779-9CEC-CFFDB1DB3615"}
 */
function configGrid() {
	// configure grid globally, for common styles

	// set up grid options
	plugins.ngDataGrid.gridOptions = {
		headerHeight: 10,
		rowHeight: 52
	}
	
	// set up default column properties
	plugins.ngDataGrid.columnOptions = {
		menuTabs: ['generalMenuTab']
	}

	// set up tool panel options
	var toolPanelOptions = plugins.ngDataGrid.createToolPanelConfig();
	toolPanelOptions.suppressColumnFilter = true;
	toolPanelOptions.suppressColumnSelectAll = true;
	toolPanelOptions.suppressRowGroups = true;
	plugins.ngDataGrid.toolPanelConfig = toolPanelOptions;

	// set up grid icons
	var icons = plugins.ngDataGrid.createIconConfig();
	icons.iconSortAscending = "fa fa-long-arrow-up";
	icons.iconSortDescending = "fa fa-long-arrow-down";
	icons.iconFilter = "fa fa-filter";

	//	icons.iconCheckboxChecked = "fa fa-check-square-o";
	//	icons.iconCheckboxUnchecked = "fa fa-square-o";
	//	icons.iconCheckboxIndeterminate = "fa fa-minus-square-o";

	plugins.ngDataGrid.iconConfig = icons;
}

/**
 * @protected
 * @param userName
 * @param tenantName
 *
 * @properties={typeid:24,uuid:"662640D4-C396-4AA7-B10F-74248E813CD0"}
 */
function onAfterUserCreate(userName, tenantName) {
	var user = scopes.svySecurity.getUser(userName, tenantName);
	if (scopes.modelUsers.sendRegistrationEmail(user)) {
		plugins.webnotificationsToastr.success("An invitation email has been sent to the new user " + userName, "Invitation sent");
	}
}

/**
 * @protected 
 * @properties={typeid:24,uuid:"96687A40-3405-44AC-A105-56468D89CA7A"}
 */
function overrideSolutionStyle() {
		
	var mainColor = DEFAULT_COLORS['MAIN-COLOR'];
	var secondaryColor = DEFAULT_COLORS['SECONDARY-COLOR'];
	

	var propMainColor = scopes.svyProperties.getUserPropertyValue("MAIN-COLOR", "style")
	if (propMainColor) {
		mainColor = propMainColor;
	}

	var propSecondaryColor = scopes.svyProperties.getUserPropertyValue("SECONDARY-COLOR", "style")
	if (propSecondaryColor) {
		secondaryColor = propSecondaryColor;
	}

	overrideStyleColors(mainColor, secondaryColor);
}

/**
 * @public
 * @param {String} mainColor
 * @param {String} secondaryColor
 *
 * @properties={typeid:24,uuid:"B36E5C6E-51A0-40D1-AF79-D47421D1B73C"}
 */
function overrideStyleColors(mainColor, secondaryColor) {
	var newColorStyle = {
		'MAIN-COLOR': mainColor,
		'SECONDARY-COLOR': secondaryColor
	}

	// set the preferred colors
	var mediaOriginal = solutionModel.getMedia('cloudSampleTemplateOriginal.less');
	var cssText = mediaOriginal.getAsString();

	// override css
	cssText = utils.stringReplaceTags(cssText, newColorStyle);
	var media = solutionModel.getMedia('cloudSampleTemplate.less');
	media.setAsString(cssText);

	application.overrideStyle('cloudSampleSolution.less', 'cloudSampleTemplate.less');
}
