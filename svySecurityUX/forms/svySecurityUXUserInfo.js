/**
 * @private
 * @type {Number}
 * @SuppressWarnings (unused)
 *
 * @properties={typeid:35,uuid:"574D5495-E4FE-4B17-BF40-870A6C9AE7AE",variableType:4}
 */
var m_TotalSessionsHours = 0;

/**
 * @private
 * @type {Number}
 * @SuppressWarnings (unused)
 *
 * @properties={typeid:35,uuid:"4C06B5FF-0563-4306-A75B-281193AF112B",variableType:4}
 */
var m_ActiveSessionsCount = 0;

/**
 * @private
 * @type {Number}
 * @SuppressWarnings (unused)
 *
 * @properties={typeid:35,uuid:"88EC6D3B-6CEF-4C79-BAA6-EB67B035E1AE",variableType:4}
 */
var m_TotalSessionsCount = 0;

/**
 * @private
 * @type {Date}
 * @SuppressWarnings (unused)
 *
 * @properties={typeid:35,uuid:"499A43CC-0684-42E2-952F-1A0BA6828C84",variableType:93}
 */
var m_LastRefreshDate = new Date();

/**
 * @private
 * @type {String}
 * @SuppressWarnings (unused)
 * @properties={typeid:35,uuid:"DFC79F07-3BCF-4F8C-9A1F-6B888F429387"}
 */
var m_LockStausText = '';

/**
 * @private
 * @type {String}
 * @SuppressWarnings (unused)
 *
 * @properties={typeid:35,uuid:"650FD882-97C3-4632-AF1D-3CD937C33ED9"}
 */
var m_LockReasonText = '';

/**
 * @private
 * @type {String}
 * @SuppressWarnings (unused)
 *
 * @properties={typeid:35,uuid:"5C49D3F0-D6D2-49D9-B027-68B417448DB5"}
 */
var m_TenantName = '';

/**
 * Callback method for when form is shown.
 *
 * @param {Boolean} firstShow form is shown first time after load
 * @param {JSEvent} event the event that triggered the action
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"603967D3-6BE8-438E-98B3-DEE2DE5D9E35"}
 */
function onShow(firstShow, event) {
	updateUI();
}

/**
 * Handle record selected.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"B9E98EBE-901C-4B95-A3A1-6B1F1369D433"}
 */
function onRecordSelection(event) {
	updateUI();
}

/**
 * @protected
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"40FC6744-B335-45E8-AD73-B1CE71752881"}
 */
function onActionLock(event) {
	var msg = "Locks the user account preventing it from logging in."
	msg += "The lock will remain in place until it expires (if a duration was specified) or it is removed using {User#unlock}.Users with active sessions will be unaffected until subsequent login attempts.Can be called even if the user account is already locked. In such cases the lock reason and duration will be reset. "

	var user = scopes.svySecurity.getUser(user_name, tenant_name);
	var answer = plugins.dialogs.showQuestionDialog("Do you wish to lock the User " + user.getDisplayName(), msg, "Yes", "No");
	if (answer == "Yes") {
		user.lock();
		updateUI();
	}
}

/**
 * @param {JSEvent} event
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"2CA7C321-6568-43D7-BEB0-CBC1673F734C"}
 */
function onActionUnlock(event) {
	var user = scopes.svySecurity.getUser(user_name, tenant_name);
	user.unlock()
	updateUI();
}

/**
 * @protected
 * @properties={typeid:24,uuid:"8034BBFC-0AB0-421E-9C66-7A495B2D2BB5"}
 */
function updateUI() {
    var user = null;
    if (tenant_name && user_name) {
        user = scopes.svySecurity.getUser(user_name, tenant_name);
    }

    if (user) {
	
		if (user.isLocked()) {
			elements.faLocked.visible = true;
			elements.faUnlocked.visible = false;
			
			elements.labelStatus.removeStyleClass('text-success');
			elements.labelStatus.removeStyleClass('border-success');
			elements.labelStatus.addStyleClass('text-warning border-warning');
		} else {
			elements.faLocked.visible = false;
			elements.faUnlocked.visible = true;
			
			elements.labelStatus.removeStyleClass('text-warning');
			elements.labelStatus.removeStyleClass('border-warning');
			elements.labelStatus.addStyleClass('text-success border-success');
		}

	    if (user) {
	        m_TotalSessionsCount = user.getSessionCount();
	        m_TotalSessionsHours = getTotalSessionHours(user_name, tenant_name);
	        m_ActiveSessionsCount = user.getActiveSessions().length;
	        var isLocked = user.isLocked();
	        if (isLocked) {
	            var m_LockExp = user.getLockExpiration();
	            m_LockReasonText = '';
	            if (m_LockExp) {
	            	m_LockReasonText = utils.stringFormat('<b>Locked</b> - the lock expires on %1$tc ', [m_LockExp]);
	            } else {
	                m_LockStausText = 'Locked';
	            }
	            m_LockReasonText += user.getLockReason() ? user.getLockReason() : '';
	        } else {
	            m_LockStausText = 'Active';
	            m_LockReasonText = null;
	        }
	        
	        scopes.svySecurityUXCharts.createChartUserUsageOverTimeMonths(tenant_name,user_name,elements.chart);
	    } else {
	        m_TotalSessionsCount = 0;
	        m_TotalSessionsHours = 0;
	        m_ActiveSessionsCount = 0;
	        m_LockStausText = 'no user';
	        m_LockReasonText = null;
	    }
    }


}

/**
 * @private
 * @param {String} userName
 * @param {String} tenantName
 * @return {Number}
 * @properties={typeid:24,uuid:"907BB518-FA88-44BF-8897-325F3F49E1EB"}
 */
function getTotalSessionHours(userName, tenantName){
    var qry = datasources.db.svy_security.sessions.createSelect();
    qry.where.add(qry.columns.tenant_name.eq(tenantName)).add(qry.columns.user_name.eq(userName));
    qry.result.add(qry.columns.session_duration.sum);    
    var ds = databaseManager.getDataSetByQuery(qry,1);
    var res = ds.getValue(1, 1) || 0;
    return res / (1000 * 60 * 60);
}

/**
 * @param {JSEvent} event
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"12F404CD-AF69-4EDF-AAF1-9299AF4C6AC2"}
 * @AllowToRunInFind
 */
function onActionResetPassword(event) {
    if (!user_name || !tenant_name) {
        return;
    }

    var user = scopes.svySecurity.getUser(user_name, tenant_name);
    if (!user) {
        return;
    }

    var resetBtn = 'Reset';
    if (resetBtn != plugins.dialogs.showWarningDialog('Confirm password reset',utils.stringFormat('Do you want to reset the password for user <b>"%1$s"</b> from tenant <b>"%2$s"</b> with a new auto-generated password?', [user_name, tenant_name]), 'Cancel', resetBtn)){
        return;
    }
    
    var newPwd = '';
    while (!newPwd || (newPwd.search(/[\/\+]/) != -1)) {
        newPwd = utils.stringMD5HashBase64(application.getUUID().toString()).substr(2, 8);
    }
    user.setPassword(newPwd);
    plugins.dialogs.showInfoDialog('User password has been reset', utils.stringFormat('The password for user <b>"%1$s"</b> from tenant <b>"%2$s"</b> has been reset.<br>The new auto-generated password is:<br><br><b>%3$s</b><br><br>Provide the new password to the user.', [user_name, tenant_name, newPwd]));
}

/**
 * @param {JSEvent} event
 * @param {string} dataTarget
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"8D2D634B-CDEF-4A77-8EBE-B614DF9ECF61"}
 */
function onActionEditUserEmail(event, dataTarget) {
    if (tenant_name && user_name) {
        var emailAddress = plugins.dialogs.showInputDialog('Edit User', utils.stringFormat('Enter email for user "%1$s"', [user_name]), email);
        if (emailAddress) {
            var user = scopes.svySecurity.getUser(user_name, tenant_name);
            if (user) {
                user.setEmail(emailAddress);
                //the data broadcast will update the UI
            }
        }
    }
}

/**
 * @param {JSEvent} event
 * @param {string} dataTarget
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"6CA95A26-489A-4BBF-934B-F22865E0E37C"}
 */
function onActionEditDisplayName(event, dataTarget) {
    if (tenant_name && user_name) {
        var displayName = plugins.dialogs.showInputDialog('Edit User', utils.stringFormat('Enter display name for user "%1$s"', [user_name]), display_name);
        if (displayName) {
            var user = scopes.svySecurity.getUser(user_name, tenant_name);
            if (user) {
                user.setDisplayName(displayName);
                //the data broadcast will update the UI
            }
        }
    }
}

/**
 * @param {JSEvent} event
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"698F30F2-20BE-4F68-B338-FFB96507272C"}
 */
function onActionBack(event) {
	// navigate to the given product
	var item = new scopes.svyNavigation.NavigationItem(scopes.svySecurityUX.SVY_SECURITY_UX.TENANT_USERS);
	scopes.svyNavigation.open(item);
}
