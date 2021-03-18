/**
 * @protected
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"AC151136-BEA3-48FC-B52E-FC60921FD046",variableType:4}
 */
var activeSessions = 0;

/**
 * @private
 * @type {Number}
 * @SuppressWarnings (unused)
 *
 * @properties={typeid:35,uuid:"ACE16F44-CCCE-4413-B83F-9EA34C6071E5",variableType:4}
 */
var m_TenantUserCount = 0;

/**
 * @private
 * @type {Number}
 * @SuppressWarnings (unused)
 *
 * @properties={typeid:35,uuid:"2DBC33C8-4C2F-4D11-A93F-6913C8D19CEF",variableType:4}
 */
var m_ActiveSessionsCount = 0;

/**
 * @private
 * @type {Number}
 * @SuppressWarnings (unused)
 *
 * @properties={typeid:35,uuid:"D7316200-F59A-46C5-A3C7-42FC00D3E209",variableType:4}
 */
var m_TotalSessionsCount = 0;

/**
 * @private
 * @type {Date}
 * @SuppressWarnings (unused)
 *
 * @properties={typeid:35,uuid:"1B5C273C-3774-4DB5-A887-4477F3076456",variableType:93}
 */
var m_LastRefreshDate = new Date();

/**
 * @private
 * @type {String}
 * @SuppressWarnings (unused)
 * @properties={typeid:35,uuid:"47DC6238-4ED8-4092-88E6-2E1075B4BDE7"}
 */
var m_LockStausText = '';

/**
 * @private
 * @type {String}
 * @SuppressWarnings (unused)
 *
 * @properties={typeid:35,uuid:"0675AFEC-5D66-4E0B-9CE6-92BB0E071E43"}
 */
var m_LockReasonText = '';

/**
 * Callback method for when form is shown.
 *
 * @param {Boolean} firstShow form is shown first time after load
 * @param {JSEvent} event the event that triggered the action
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"BFFEFFCE-6ABE-4572-B308-BA93FD0851B9"}
 */
function onShow(firstShow, event) {
	var tenant = scopes.svySecurity.getTenant();
	activeSessions = tenant.getActiveSessions().length;
	updateUI();
}

/**
 * Handle record selected.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"B121EB61-8408-4012-BFF3-ADAA71C4B737"}
 */
function onRecordSelection(event) {
	updateUI();
}

/**
 * @protected
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"4286147E-324E-48B2-80A9-1F5344A0A1CF"}
 */
function onActionLock(event) {
	var msg = "Locks the tenant account preventing its users from logging in.\n"
	msg += "The lock will remain in place until it is removed. Users with active sessions will be unaffected until subsequent login attempts."

	var tenant = scopes.svySecurity.getTenant();
	var answer = plugins.dialogs.showQuestionDialog("Do you wish to lock the Tenant " + tenant.getDisplayName(), msg, "Yes", "No");
	if (answer == "Yes") {
		tenant.lock();
		updateUI();
	}
}

/**
 * @param {JSEvent} event
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"AB106273-1B8B-4BF5-A343-7E148F1F7A38"}
 */
function onActionUnlock(event) {
	var tenant = scopes.svySecurity.getTenant();
	tenant.unlock()
	updateUI();
}

/**
 * @protected
 * @properties={typeid:24,uuid:"FDB4C889-7BB5-415F-A4C3-A878F8AADED4"}
 */
function updateUI() {
	var tenant = scopes.svySecurity.getTenant();
	if (tenant) {
		m_TenantUserCount = tenant.getUsers().length;
		m_ActiveSessionsCount = tenant.getActiveSessions().length;
		m_TotalSessionsCount = tenant.getSessionCount();
		
		var isLocked = tenant.isLocked();
		if (isLocked) {
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

		if (tenant.isMasterTenant() && tenant.isSlaveTenant()) {
			elements.faMaster.visible = true;
			elements.faMaster.cssPosition.l("calc(50% - 50px)");
			elements.faMaster.cssPosition.r("50%");
			elements.faSlave.visible = true;
			elements.faSlave.cssPosition.r("calc(50% - 50px)");
			elements.faSlave.cssPosition.l("50%");
			elements.labelMaster.visible = true;
			elements.labelMaster.text = "MASTER & SLAVE";
		} else if (tenant.isMasterTenant()) {
			elements.faMaster.visible = true;
			elements.faSlave.visible = false;
			elements.labelMaster.visible = true;
			elements.labelMaster.text = "MASTER";
		} else if (tenant.isSlaveTenant()) {
			elements.faMaster.visible = false;
			elements.faSlave.visible = true;
			elements.labelMaster.visible = true;
			elements.labelMaster.text = "SLAVE";
		} else {
			elements.faSlave.visible = false;
			elements.faMaster.visible = false;
			elements.labelMaster.visible = false;
			elements.labelMaster.text = null;
		}

        if (isLocked) {
            var m_LockExp = tenant.getLockExpiration();
            m_LockReasonText = '';
            if (m_LockExp) {
            	m_LockReasonText = utils.stringFormat('<b>Locked</b> - the lock expires on %1$tc ', [m_LockExp]);
            } else {
                m_LockStausText = 'Locked';
            }
            m_LockReasonText += tenant.getLockReason() ? tenant.getLockReason() : '';
        } else {
            m_LockStausText = 'Active';
            m_LockReasonText = null;
        }

		scopes.svySecurityUXCharts.createChartTotalTenantUsageOverTimeMonths(foundset.tenant_name, elements.chart);
	} else {
		m_TenantUserCount = 0;
		m_ActiveSessionsCount = 0;
		m_TotalSessionsCount = 0;
		m_LockStausText = 'no tenant';
		m_LockReasonText = null;
	}


}

/**
 * @param {JSEvent} event
 * @param {string} dataTarget
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"C5E5D835-BB76-4DB3-8175-36CF2472012E"}
 */
function onActionEditDisplayName(event, dataTarget) {
    if (tenant_name) {
        var displName = plugins.dialogs.showInputDialog('Edit Tenant', utils.stringFormat('Enter display name for tenant "%1$s"', [tenant_name]), display_name);
        if (displName) {
            var tenant = scopes.svySecurity.getTenant(tenant_name);
            if (tenant) {
                tenant.setDisplayName(displName);
                //the data broadcast will update the UI
            }
        }
    }
}
