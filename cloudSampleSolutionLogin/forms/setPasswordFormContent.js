/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"C6631576-3798-424F-8327-A5B96AA2CE0A"}
 */
var newPassword = '';

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"1F7880B1-2E89-486D-9474-EB16D4C41405"}
 */
var confirmPassword = '';

/**
 * @type {scopes.svySecurity.User}
 *
 * @properties={typeid:35,uuid:"81910812-7AAE-4F21-BF6A-BB819DD12B6D",variableType:-4}
 */
var user;

/**
 * @param {scopes.svySecurity.User} userToReset
 *
 * @properties={typeid:24,uuid:"D7DCF90A-0BCE-4F49-A664-24DE9D82500B"}
 */
function setUser(userToReset){
	user = userToReset;
}

/**

 * @private
 *
 * @properties={typeid:24,uuid:"12FCAEAA-F6C4-402C-83D2-1911DB309C7C"}
 */
function resetPassword() {
	
	if(newPassword && confirmPassword && (newPassword == confirmPassword)){
		user.setPassword(newPassword);
		plugins.dialogs.showInfoDialog('Success', 'Your password has been changed');
		scopes.svySecurity.login(user)
	}
}
