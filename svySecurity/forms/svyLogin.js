/**
 * Login cookie name
 * 
 * @private
 * @type {String}
 *
 * @properties={typeid:35,uuid:"65B6F5CA-83A9-4C40-9CD7-C0749C146654"}
 */
var LOGIN_COOKIE = 'com.servoy.extensions.security.login';

/**
 * Error codes returned in onLoginError 
 * 
 * @protected 
 * @enum 
 * @see onLoginError
 * @properties={typeid:35,uuid:"E67B9796-263B-4E7A-A9B8-BFCCA9348DF7",variableType:-4}
 */
var ERROR_CODES = {
	TENANT_NOT_SPECIFIED : 'tenant-not-specified',
	USER_NOT_SPECIFIED : 'user-not-specified',
	PASSWORD_NOT_SPECIFIED : 'password-not-specified',
	TENANT_NOT_FOUND : 'tenant-not-found',
	USER_NOT_FOUND : 'user-ot-found',
	PASSWORD_MISMATCH : 'password-mismatch',
	INSUFFICIENT_PERMISSIONS : 'insufficient-permissions',
	LOCKED_USER : 'locked-user',
	LOCKED_TENANT : 'locked-tenant'
};

/**
 * "Remember Me flag" can be used with checkbox
 * 
 * @protected 
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"9BFD5731-4B1E-4CE3-B34F-E0D80C6FC779",variableType:4}
 */
var flagSaveUser = 0;

/**
 * User name to login as
 * 
 * @protected 
 * @type {String}
 *
 * @properties={typeid:35,uuid:"C1A3ACE5-EDC1-4EF1-A994-1F75DAF75816"}
 */
var userName = '';

/**
 * Password to check on login
 * 
 * @protected 
 * @type {String}
 *
 * @properties={typeid:35,uuid:"9C34684C-041A-44E0-9AF1-83235786B3D8"}
 */
var password = '';

/**
 * Tenant name to login with
 * 
 * @protected 
 * @type {String}
 *
 * @properties={typeid:35,uuid:"C5AEC878-26B1-4D35-A533-1D6527ACBE69"}
 */
var tenantName = '';

/**
 * Login method will authenticate the user
 * If login is successful, onLoginSuccess is called
 * If login is unsuccessful, onLoginError is called and an error code is supplied
 * NOTE: onLoginSuccess if called AFTER onOpen event of the main solution
 * 
 * @protected 
 * @return {Boolean} True when successful
 * @see onLoginError
 * @see onLoginSuccess
 * @see ERROR_CODES
 * 
 * @properties={typeid:24,uuid:"2F8D781B-F5CB-46E4-9D07-984A8E42B71B"}
 */
function login() {
	
	if(!tenantName){
		onLoginError(ERROR_CODES.TENANT_NOT_SPECIFIED);
		return false;
	}
	if(!userName){
		onLoginError(ERROR_CODES.USER_NOT_SPECIFIED);
		return false;
	}
	if(!password){
		onLoginError(ERROR_CODES.PASSWORD_NOT_SPECIFIED);
		return false;
	}
	
	var tenant = scopes.svySecurity.getTenant(tenantName);
	if(!tenant){
		onLoginError(ERROR_CODES.TENANT_NOT_FOUND);
		return false;
	}
	var user = tenant.getUser(userName);
	if(!user){
		onLoginError(ERROR_CODES.USER_NOT_FOUND);
		return false;
	}
	if(!user.checkPassword(password)){
		onLoginError(ERROR_CODES.PASSWORD_MISMATCH);
		return false;
	}
	if(user.isLocked()){
		onLoginError(ERROR_CODES.LOCKED_USER);
		return false;
	}
	if(tenant.isLocked()){
		onLoginError(ERROR_CODES.LOCKED_TENANT);
		return false;
	}
	if(!scopes.svySecurity.login(user)){
		onLoginError(ERROR_CODES.INSUFFICIENT_PERMISSIONS);
		return false;
	}
	
	// reset cookie if applicable
	if(flagSaveUser){
		setCookie();
	} else {
		clearCookie();
	}
	
	// notify success
	onLoginSuccess();
	
	return true;
}

/**
 * Hook for child forms. Called after successful login.
 * NOTE: onLoginSuccess if called AFTER onOpen event of the main solution
 *  
 * @protected 
 * @properties={typeid:24,uuid:"BCB050CC-2B33-4959-A63C-7463484FB3F1"}
 */
function onLoginSuccess(){
	// for child form implementation
}

/**
 * Hook for child forms. Called after failed login. 
 * Implementing forms can trap this error and notify user in their own way.
 * 
 * @protected 
 * @param {String} error One of the error codes
 * @see ERROR_CODES
 * @properties={typeid:24,uuid:"E27794C5-C3A3-4C09-827F-A9A1EB1658C0"}
 */
function onLoginError(error){
	// for child form implementation
	application.output(error)
}

/**
 * Saves the login settings in the cookie
 * @private 
 * @properties={typeid:24,uuid:"11E848CB-A546-44E9-8EA2-4C7041D88FFF"}
 */
function setCookie(){
	application.setUserProperty(LOGIN_COOKIE,JSON.stringify({userName:userName,tenantName:tenantName}));
}

/**
 * Clears the login settings from the cookie
 * @private 
 * @properties={typeid:24,uuid:"EA96B97D-F503-4EFC-9158-4DEE3E5DC296"}
 */
function clearCookie(){
	application.setUserProperty(LOGIN_COOKIE, null);
}

/**
 * Loads login settings from cookie
 * @private 
 * @properties={typeid:24,uuid:"401168F2-B966-4842-A056-1BE64FE1EF43"}
 */
function readCookie(){
	var str = application.getUserProperty(LOGIN_COOKIE);
	flagSaveUser = str ? 1 : 0;
	if(str){
		/** @type {{userName:String,tenantName}} */
		var value = JSON.parse(str);
		userName = value.userName;
		tenantName = value.tenantName;
	}
}

/**
 * Callback method for when form is shown.
 * Reads the cookie on first show
 * NOTE: Implementing forms should call _super.onShow if overriding
 * 
 * @param {Boolean} firstShow form is shown first time after load
 * @param {JSEvent} event the event that triggered the action
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"185B8002-4048-4F2A-89F7-355F3B627D4A"}
 */
function onShow(firstShow, event) {
	if(firstShow){
		readCookie();
	}
}
