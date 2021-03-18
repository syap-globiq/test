/* 
 * SvySecurity includes svyProperties module
 * SvyProperties can be used as stand-alone module instead. This means that tenant_name is not a mandatory field in svy_properties
 * 
 */

/**
 * @protected
 * @type {String}
 * @ignore
 * @properties={typeid:35,uuid:"6BE0C9D3-A073-4B3E-BED4-183542BA5B7B"}
 */
var sessionID = null;

/**
 * @protected
 * @type {String}
 * @ignore
 * @properties={typeid:35,uuid:"626CE06E-AF5A-42A1-8F8F-BE308B37F213"}
 */
var activeTenantName = null;

/**
 * @protected
 * @type {String}
 * @ignore
 * @properties={typeid:35,uuid:"A6511E73-F3FD-4A19-97F3-D9B55493F853"}
 */
var activeUserName = null;

/**
 * @protected
 * @type {Boolean}
 * @ignore
 * @properties={typeid:35,uuid:"76515CA1-B70A-495A-BA2E-948F436379D6",variableType:-4}
 */
var activeTenantIsMaster = false;

/**
 * If false then when saving or deleting security-related records
 * if an external DB transaction is detected the operation will fail.
 * If true then when saving or deleting security-related records the
 * module will start/commit a DB transaction only if an external DB transaction
 * is not detected. On exceptions any DB transaction will be rolled back
 * regardless if it is started internally or externally (exceptions will be propagated
 * to the external transaction so callers will be able to react on them accordingly)
 *
 * @private
 * @properties={typeid:35,uuid:"3DDA0C51-AD48-4496-8C9B-979D0D38EA5B",variableType:-4}
 */
var supportExternalDBTransaction = false;

/**
 * The interval (milliseconds) for an active session to update the ping time in the database
 * TODO should be externalized? Should be stored in db, so next expected time should be calculated ?
 * @private
 * @type {Number}
 * @SuppressWarnings(unused) 
 * @deprecated 
 * @properties={typeid:35,uuid:"9D18DE69-F778-4117-B8B3-0FCFF75E3B83",variableType:4}
 */
var SESSION_PING_INTERVAL = 60000;

/**
 * The default timeout (milliseconds) for a session.
 * An unterminated session is deemed inactive/abandoned if it is not terminated within this amount of time from the time of last client ping
 *
 * @private
 * @type {Number}
 * @deprecated Uses more accurate client manager plugin instead
 * @SuppressWarnings (unused)
 * @properties={typeid:35,uuid:"263D0C4F-2EA9-4A85-9AB0-E757D276FF04",variableType:8}
 */
var SESSION_TIMEOUT = 60 * 1000;

/**
 * Default user name for creation user audit fields when no user present
 *
 * @private
 * @type {String}
 *
 * @properties={typeid:35,uuid:"92742CC7-4C88-4CFE-8A4F-9AD555927665"}
 */
var SYSTEM_USER = 'system_user';

/**
 * The default validity in milliseconds of an access token
 * @private
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"43F8E253-42D9-4721-8337-98B17EEE087C",variableType:8}
 */
var ACCESS_TOKEN_DEFAULT_VALIDITY = 30 * 60 * 1000;

/**
 * @private
 * @type {String}
 *
 * @properties={typeid:35,uuid:"D2E33FFB-37E7-45FA-B739-60F75FCBD819"}
 */
var SECURITY_TABLES_FILTER_NAME = 'com.servoy.extensions.security.data-filter';

/**
 * @private
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"6F6E55FB-0644-4746-9FE2-ABA60111AEE9",variableType:4}
 */
var MAX_NAME_LENGTH = 50;

/**
 * @private 
 * @type {String}
 *
 * @properties={typeid:35,uuid:"AB71B8B7-60C9-4BAD-B6E5-785CE10C9C06"}
 */
var DEFAULT_TENANT = 'admin';

/**
 * @private 
 * @enum 
 * 
 * @properties={typeid:35,uuid:"49CE1F05-E150-4E60-A14A-3D0BD4D747F1",variableType:-4}
 */
var USER_PROPERTIES = {
	/** When set to true permissions will be synced at every login for a deployed solution. Default true  */
	AUTO_SYNC_PERMISSIONS_WHEN_DEPLOYED: "svy.security.auto-sync-permissions-when-deployed"
};

/**
 * Logs in the specified user and initializes a new {@link Session} for it.
 * The login request will not be successful if the user account or the parent [tenant]{@link User#getTenant} account [is locked]{@link User#isLocked} and the lock has not [expired]{@link User#getLockExpiration} yet.
 * The login request will not be successful also if no [permissions]{@link User#getPermissions} have been granted to the specified user.
 * This method internally calls the standard Servoy security.login().
 * @note This method does not perform any password checks - for validation of user passwords use [User.checkPassword]{@link User#checkPassword}.
 * @public
 * @param {User} user The user to log in.
 * @param {String|UUID} [userUid] The uid to log the user in with (defaults to userName)
 * @param {Array<String|Permission>} [permissionsToApply] Optional permissions to assign to the user. Note that these permissions cannot be asked for using User.getPermissions() or User.hasPermission().
 * @return {Boolean} Returns true if the login was successful and a user {@link Session} was created, otherwise false.
 * @properties={typeid:24,uuid:"83266E3D-BB41-416F-988C-964593F1F33C"}
 */
function login(user, userUid, permissionsToApply) {

    if (!user) {
        throw 'User cannot be null';
    }

    // already logged-in
    if (security.getUserUID()) {
        logWarning('Already logged-in');
        return false;
    }

    // check for lock
    if (user.isLocked()) {
        logInfo(utils.stringFormat('User "%1$s" is locked and cannot logged in.', [user.getUserName()]));
        return false;
    }

    // check for tenant lock
    if (user.getTenant().isLocked()) {
        logInfo(utils.stringFormat('Tenant "%1$s" is locked and users associated with it cannot logged in.', [user.getTenant().getName()]));
        return false;
    }

    // get internal groups
    var servoyGroups = security.getGroups().getColumnAsArray(2);
    var groups = [];
    var permissions = user.getPermissions();
    for (var i in permissions) {
        groups.push(permissions[i].getName());
    }
    
    if (permissionsToApply) {
    	for (var p = 0; p < permissionsToApply.length; p++) {
			groups.push(permissionsToApply[p] instanceof Permission ? permissionsToApply[p].getName() : permissionsToApply[p]);
       	}
    }
    
    // login with groups that do no longer exist will fail, so we need to filter them out
    groups = groups.filter(
    	function(groupName) {
    		var groupIdx = servoyGroups.indexOf(groupName);
    		if (groupIdx === -1) {
    			logWarning(utils.stringFormat('Permission "%1$s" is no longer found within internal security settings and cannot be assigned to user "%2$s".', [groupName, user.getUserName()]));
    		}
    		return groupIdx >= 0;
    	}
    );

    // no groups
    if (!groups.length) {
        logWarning('No Permissions. Cannot login');
        return false;
    }

    // login
    if (!security.login(user.getUserName(), userUid ? userUid : user.getUserName(), groups)) {
        logWarning(utils.stringFormat('Servoy security.login failed for user: "%1$s" with groups: "%2$s"', [user.getUserName(), groups]));
        return false;
    }

    // create session
    initSession(user);

    // filter security tables
    filterSecurityTables();

    return true;
}

/**
 * Logs the current user out of the application and closes the associated {@link Session}.
 * This method internally calls security.logout() to end the Servoy client session.
 *
 * @public
 *
 * @properties={typeid:24,uuid:"341F328D-C8A6-4568-BF0C-F807A19B8977"}
 */
function logout() {
    closeSession();
    removeSecurityTablesFilter();
    security.logout();
}

/**
 * Creates and returns a new tenant with the specified name.
 * The names of tenants must be unique in the system.
 *
 * @public
 * @param {String} name The name of the tenant. Must be unique and no longer than 50 characters.
 * @return {Tenant} The tenant that is created.
 *
 * @properties={typeid:24,uuid:"2093C23A-D1E5-49D2-AA0B-428D5CB8B0FA"}
 */
function createTenant(name) {
    var rec = createTenantRecord(name, null);
    return new Tenant(rec);
}

/**
 * Creates and returns a new tenant with the specified name as a clone of the given tenant.
 * The names of tenants must be unique in the system.
 * The cloned tenant has the same roles and role permissions as the original.
 * When makeSlave is true, the newly created clone will be a slave of the tenant to clone,
 * inheriting all role / permission changes made to the master.
 * <br/>
 * <b>WARNING</b>: Cannot call this function when logged in as an user.
 * 
 * 
 * @public
 * @param {Tenant} tenantToClone The tenant to clone from
 * @param {String} name The name of the tenant. Must be unique and no longer than 50 characters.
 * @param {Boolean} [makeSlave] When true, the cloned tenant will be a slave of the tenant to clone (defaults to false).
 * @return {Tenant} The cloned tenant that is created.
 * @throws {String} Throws an exception if this function is called when logged in as an user.

 * @properties={typeid:24,uuid:"6C41B9E2-7033-4FD9-84EF-1D91E400DF95"}
 */
function cloneTenant(tenantToClone, name, makeSlave) {
	
	if (getTenant()) {
		throw "Cannot clone tenant when logged in as an user.";
	}
	
	
	var rec = createTenantRecord(name, makeSlave === true && tenantToClone ? tenantToClone.getName() : null);
	var tenant = new Tenant(rec);
	var roles = tenantToClone.getRoles();
	for (var r = 0; r < roles.length; r++) {
		var role = tenant.createRole(roles[r].getName());
		role.setDisplayName(roles[r].getDisplayName());
		var permissions = roles[r].getPermissions();
		for (var p = 0; p < permissions.length; p++) {
			role.addPermission(permissions[p]);
		}
	}
	return tenant;
}

/**
 * Creates a tenant record with the given name.
 * The names of tenants must be unique in the system.
 * 
 * @private 
 * @param {String} name
 * @param {String} [masterTenantName]
 * @return {JSRecord<db:/svy_security/tenants>}
 *
 * @properties={typeid:24,uuid:"66D6A963-76FA-48CA-BE11-C9CD0CC74D1A"}
 */
function createTenantRecord(name, masterTenantName) {
	if (!name) {
        throw new Error('Name cannot be null or empty');
    }
    if (!nameLengthIsValid(name, MAX_NAME_LENGTH)) {
        throw new Error(utils.stringFormat('Name must be between 1 and %1$s characters long.', [MAX_NAME_LENGTH]));
    }
    if (getTenant(name)) {
        throw new Error(utils.stringFormat('Tenant name "%1$s" is not unique', [name]));
    }
    var fs = datasources.db.svy_security.tenants.getFoundSet();
    var rec = fs.getRecord(fs.newRecord(false, false));
    rec.tenant_name = name;
    rec.display_name = name;
    rec.master_tenant_name = masterTenantName;
    if (!rec.creation_user_name) {
        logWarning('Creating security record without current user context');
        rec.creation_user_name = SYSTEM_USER;
    }
    saveRecord(rec);
    return rec;
}

/**
 * Gets all tenants in the system.
 * @public
 * @return {Array<Tenant>} An array with all tenants or an empty array if no tenants are defined.
 *
 * @properties={typeid:24,uuid:"449FDFC0-DD1A-46EB-A576-2D6771C1BEBD"}
 */
function getTenants() {
    var tenants = [];
    var fs = datasources.db.svy_security.tenants.getFoundSet();
    fs.loadAllRecords();
    for (var i = 1; i <= fs.getSize(); i++) {
        var record = fs.getRecord(i);
        tenants.push(new Tenant(record));
    }
    return tenants;
}

/**
 * Gets a tenant by its unique tenant name.
 * If tenant name is not specified then will return the tenant of the currently logged in user.
 * If tenant name is not specified and no user is currently logged in then will return null.
 *
 * @public
 * @param {String} [name] The name of the tenant to get. Or null to get the current tenant.
 * @return {Tenant} The tenant or null if not found / no user is logged in.
 *
 * @example
 * //get the tenant of the current user
 * var currentUserTenant = scopes.svySecurity.getTenant();
 * //get a specific tenant
 * var tenant = scopes.svySecurity.getTenant('tenantNameToGet');
 *
 * @properties={typeid:24,uuid:"35A8C27C-1B0E-478F-95E2-B068FBF57BB4"}
 * @AllowToRunInFind
 */
function getTenant(name) {

    // no name, look for current user's tenant
    if (!name) {

        // No logged-in user/tenant
        if (!utils.hasRecords(active_tenant)) {
            return null;
        }

        // get user's tenant
        return new Tenant(active_tenant.getRecord(1));
    }

    // lookup tenant by name
    var fs = datasources.db.svy_security.tenants.getFoundSet();
    var qry = datasources.db.svy_security.tenants.createSelect();
    qry.where.add(qry.columns.tenant_name.eq(name));
    fs.loadRecords(qry);

    // no match
    if (fs.getSize() == 0) {
        return null;
    }

    // get matching tenant
    return new Tenant(fs.getRecord(1));
}

/**
 * Immediately and permanently deletes the specified tenant and all records associated with it, including all users and roles.
 * Tenant will not be deleted if it has users with active sessions.
 * <br/>
 * If the deleted tenant is a Master tenant and is a slave of another master tenant, this operation will replace the master tenant of it's direct slaves with the master of the tenant that is deleted;
 * If the delated tenant is a Master tenant and has no Master tenant, this operation will remove the master from all it's direct slaves.
 * 
 * @note USE WITH CAUTION! There is no undo for this operation.
 *
 * @public
 * @param {Tenant|String} tenant The tenant object or the name of the tenant to delete.
 * @return {Boolean} False if tenant could not be deleted, most commonly because of active user sessions associated with the tenant.
 * @properties={typeid:24,uuid:"3EBC98FA-0AA1-47F8-94C3-04125DA06220"}
 * @AllowToRunInFind
 */
function deleteTenant(tenant) {
    if (!tenant) {
        throw 'Tenant cannot be null';
    }
    if (tenant instanceof String) {
        /**
         * @type {String}
         * @private
         */
        var tenantName = tenant;
        tenant = scopes.svySecurity.getTenant(tenantName);
    }

    // check active sessions
    if (tenant.getActiveSessions().length) {
        logWarning('Cannot delete tenant. Has active sessions.');
        return false;
    }

    // get foundset
    var fs = datasources.db.svy_security.tenants.getFoundSet();
    var qry = datasources.db.svy_security.tenants.createSelect();
    qry.where.add(qry.columns.tenant_name.eq(tenant.getName()));
    fs.loadRecords(qry);

    if (fs.getSize() == 0) {
        logError(utils.stringFormat('Could not delete tenant. Could not find tenant "%1$s".', [tenant.getName()]));
        return false;
    }

    try {
        deleteRecord(fs.getRecord(1));
        return true;
    } catch (e) {
        logError(utils.stringFormat('Could not delete tenant "%1$s". Unkown error: %2$s. Check log.', [tenant.getName(), e.message]));
        throw e;
    }
}

/**
 * Gets a role by the specified role name and tenant name.
 * If tenant name is not specified will use the tenant of the user currently logged in the application, if available.
 * @note Will fail if tenant is not specified and user is not logged in and multiple roles are found with the specified role name but associated with different tenants.
 *
 * @public
 * @param {String} roleName The name of the role to get.
 * @param {String} [tenantName] If not specified will use the tenant of the current logged in user (if user is not currently logged in
 * @return {Role} The specified role or null if not found.
 *
 * @properties={typeid:24,uuid:"B8B832C4-7DA4-44D6-A36D-0D5BB9A7F5C0"}
 */
function getRole(roleName, tenantName) {
    if (!roleName) {
        throw new Error('Role name is not specified.');
    }

    // tenant not specified, use active tenant
    if (!tenantName) {
        if (utils.hasRecords(active_tenant)) {
            tenantName = active_tenant.tenant_name;
        } else {

        }
    }

    // get matching role
    var fs = datasources.db.svy_security.roles.getFoundSet();
    var qry = datasources.db.svy_security.roles.createSelect();
    qry.where.add(qry.columns.role_name.eq(roleName));
    if (tenantName) {
        qry.where.add(qry.columns.tenant_name.eq(tenantName));
    }
    fs.loadRecords(qry);

    // no tenant and non-unique results
    if (fs.getSize() > 1) {
        throw 'Calling getRole with no tenant specified and no active tenant. Results are not unique.';
    }

    // No Match
    if (fs.getSize() == 0) {
        return null;
    }

    // cerate role object
    return new Role(fs.getRecord(1));
}

/**
 * Gets a user by the specified username and tenant name.
 * If username is not specified will return the user currently logged in the application, if available.
 * @note Will fail if tenant is not specified and user is not logged in and multiple users are found with the specified username but associated with different tenants.
 *
 * @public
 * @param {String} [userName] The username of the user to return. Can be null to get the current user.
 * @param {String} [tenantName] The name of the tenant associated with the user. Can be null if username is also null when getting the current user.
 * @return {User} The specified user (or current user if parameters are not specified) or null if the specified user does not exist (or if parameters are not specified and a user is not logged in currently).
 * @properties={typeid:24,uuid:"FCF267E6-1580-402E-8252-ED18964474DA"}
 * @AllowToRunInFind
 */
function getUser(userName, tenantName) {

    // Looking for logged-in user
    if (!userName) {

        // no logged-in user
        if (!utils.hasRecords(active_user)) {
            return null;
        }

        // get logged-in user
        return new User(active_user.getSelectedRecord());
    }

    // tenant not specified, use active tenant
    if (!tenantName) {
        if (utils.hasRecords(active_tenant)) {
            tenantName = active_tenant.tenant_name;
        } else {

        }
    }

    // get matching user
    var fs = datasources.db.svy_security.users.getFoundSet();
    var qry = datasources.db.svy_security.users.createSelect();
    qry.where.add(qry.columns.user_name.eq(userName));
    if (tenantName) {
        qry.where.add(qry.columns.tenant_name.eq(tenantName));
    }
    fs.loadRecords(qry);

    // no tenant and non-unique results
    if (fs.getSize() > 1) {
        throw 'Calling getUser w/ no tenant supplied and no active tenant. Results are not unique.';
    }

    // No Match
    if (fs.getSize() == 0) {
        return null;
    }

    // cerate user object
    return new User(fs.getRecord(1));
}

/**
 * Gets all users in the system.
 * @public
 * @return {Array<User>} An array with all users or an empty array if no users are defined.
 *
 * @properties={typeid:24,uuid:"6BF188EF-BC15-43AE-AB70-BB9A83FB2B18"}
 */
function getUsers() {
    var users = [];
    var fs = datasources.db.svy_security.users.getFoundSet();
    fs.sort('display_name asc')
    fs.loadAllRecords();
    for (var i = 1; i <= fs.getSize(); i++) {
        var record = fs.getRecord(i);
        users.push(new User(record));
    }
    return users;
}

/**
 * Gets all permissions available in this application.
 *
 * @public
 * @return {Array<Permission>} An array with all permissions or an empty array if no permissions are defined.
 *
 * @properties={typeid:24,uuid:"08508668-696C-4BEF-8322-0884B2405FDF"}
 */
function getPermissions() {
    var permissions = [];
    var fs = datasources.db.svy_security.permissions.getFoundSet();
    fs.loadAllRecords();
    for (var i = 1; i <= fs.getSize(); i++) {
        var record = fs.getRecord(i);
        permissions.push(new Permission(record));
    }
    return permissions;
}

/**
 * Gets a permission by its unique permission name.
 *
 * @public
 * @param {String} name The name of the permission.
 * @return {Permission} The specified permission or null if a permission with the specified name is not found.
 *
 * @properties={typeid:24,uuid:"9008A7A4-154B-48A1-AF52-ED6CAFAADCBA"}
 * @AllowToRunInFind
 */
function getPermission(name) {
    if (!name) {
        throw 'Name cannot be null or empty';
    }
    var fs = datasources.db.svy_security.permissions.getFoundSet();
    var qry = datasources.db.svy_security.permissions.createSelect();
    qry.where.add(qry.columns.permission_name.eq(name));
    fs.loadRecords(qry);

    if (fs.getSize() > 0) {
        return new Permission(fs.getRecord(1));
    }
    return null;
}

/**
 * Gets the current user session or null if no session initialized (no user is currently [logged in]{@link login}).
 * @note Sessions represent authenticated user sessions. They are not initialized until after user login.
 *
 * @public
 * @return {Session} The current session or null if a user is not currently logged in.
 *
 * @properties={typeid:24,uuid:"41BC69E2-367B-439F-B0FE-B0B7A0533C24"}
 */
function getSession() {
    if (utils.hasRecords(active_session)) {
        return new Session(active_session.getSelectedRecord());
    }
    return null;
}

/**
 * Gets all active sessions for the application.
 * @note If users close the application without [logging out]{@link logout} then their sessions will remain active for a period of time.
 *
 * @public
 * @return {Array<Session>} An array will all active sessions or an empty array if there are no active sessions.
 * @properties={typeid:24,uuid:"D3256103-0741-498E-9CA9-0E34E9D530E2"}
 */
function getActiveSessions() {
    var q = datasources.db.svy_security.sessions.createSelect();
    addActiveSessionSearchCriteria(q);
    var fs = datasources.db.svy_security.sessions.getFoundSet();
    fs.loadRecords(q);
    var sessions = [];
    for (var i = 1; i <= fs.getSize(); i++) {
        var sesh = fs.getRecord(i);
        sessions.push(new Session(sesh));
    }
    return sessions;
}

/**
 * Gets the number of all unique sessions which have ever been initialized in the application.
 * This includes both active sessions (for users currently logged in the application)
 * and inactive sessions (sessions from the past which have already been closed).
 *
 * @public
 * @return {Number} The number of all sessions (active and closed).
 *
 * @properties={typeid:24,uuid:"6AAEA97C-C8FB-45FC-886C-1B43678C2F2C"}
 */
function getSessionCount() {
    var q = datasources.db.svy_security.sessions.createSelect();
    q.result.add(q.columns.id.count);
    return databaseManager.getDataSetByQuery(q, 1).getValue(1, 1);
}

/**
 * Consumes a secure-access token and returns the user associated with the token if a valid match was found.
 * Tokens may be used only once to identify a user.
 * Subsequent calls to consume the same token will fail.
 * Secure-access tokens are created with {@link User#generateAccessToken}
 *
 * @note An error will be thrown if this method is called from within an active user session.
 *
 * @public
 * @param {String} token The secure-access token to use.
 * @return {User} The user associated with the specified token or null if the token is not valid or has expired.
 *
 * @properties={typeid:24,uuid:"D8CE88B5-FEEC-4996-8116-1AA32B0D5F75"}
 */
function consumeAccessToken(token) {
    if (!token) {
        throw new Error('Token is not specified');
    }

    if (activeUserName) {
        throw new Error('Cannot call consumeAccessToken from within an active user session');
    }

    //just in case the security filters where applied
    removeSecurityTablesFilter();

    var expiration = application.getServerTimeStamp();
    var q = datasources.db.svy_security.users.createSelect();
    q.where.add(q.columns.access_token.eq(token)).add(q.columns.access_token_expiration.gt(expiration));
    var fs = datasources.db.svy_security.users.getFoundSet();
    fs.loadRecords(q);

    // no matching token
    // TODO logging here
    if (!fs.getSize()) {
        return null;
    }
    var record = fs.getRecord(1);

    //should not be able to consume an access token while the tenant or the user account is locked
    var user = new User(record);

    if (user.isLocked()) {
        return null;
    }

    // clear token
    record.access_token = null;
    record.access_token_expiration = null;
    saveRecord(record);

    return user;
}

/**
 * Use {@link createTenant} to create tenant objects. Creating tenant objects with the new operator is reserved for internal use only.
 * @classdesc Tenant account which is used to segregate all data. [Users]{@link User} and [Roles]{@link Role} belong to a Tenant.
 * @protected
 * @param {JSRecord<db:/svy_security/tenants>} record The database record where the tenant account information is stored.
 * @constructor
 *
 * @properties={typeid:24,uuid:"BD7E0091-054F-434E-B5EE-44862926D03D"}
 * @AllowToRunInFind
 */
function Tenant(record) {
    if (!record) {
        throw new Error('Tenant record is not specified');
    }

    /**
     * Creates a user with the specified user name.
     * @note If password is not specified the user account will be created with a blank password.
     * Use {@link User#setPassword} to set or change the user password.
     *
     * @public
     * @param {String} userName Must be unique in system.
     * @param {String} [password] The password to use for the new user.
     * @return {User} The user which was created.
     * @throws {String} If the user name is not specified or is not unique.
     */
    this.createUser = function(userName, password) {
        if (!userName) {
            throw new Error('User name cannot be null or empty');
        }

        if (!nameLengthIsValid(userName, MAX_NAME_LENGTH)) {
            throw new Error(utils.stringFormat('Username must be between 1 and %1$s characters long.', [MAX_NAME_LENGTH]));
        }

        if (userNameExists(userName, this.getName())) {
            throw new Error(utils.stringFormat('User Name "%1$s"is not unique to this tenant', [userName]));
        }

        var userRec = record.tenants_to_users.getRecord(record.tenants_to_users.newRecord(false, false));
        if (!userRec) {
            throw 'Failed to create user record';
        }

        userRec.user_name = userName;
        userRec.display_name = userName;

        if (!userRec.creation_user_name) {
            logWarning('Creating security record without current user context');
            userRec.creation_user_name = SYSTEM_USER;
        }
        saveRecord(userRec);

        var user = new User(userRec);
        if (password) {
            user.setPassword(password);
        }
        return user;
    }

    /**
     * Gets all users for this tenant.
     *
     * @public
     * @return {Array<User>} An array with all users associated with this tenant or an empty array if the tenant has no users.
     */
    this.getUsers = function() {
        var users = [];
        for (var i = 1; i <= record.tenants_to_users.getSize(); i++) {
            var user = record.tenants_to_users.getRecord(i);
            users.push(new User(user));
        }
        return users;
    }

    /**
     * Gets the user (associated with this tenant) specified by the username.
     *
     * @public
     * @param {String} userName The username of the user.
     * @return {User} The matching user or null if a user with the specified username and associated with this tenant is not found.
     */
    this.getUser = function(userName) {
        if (!userName) {
            throw 'User name cannot be null or empty';
        }
        var users = this.getUsers();
        for (var i in users) {
            var user = users[i];
            if (user.getUserName() == userName) {
                return user;
            }
        }
        return null;
    }

    /**
     * Immediately and permanently deletes the specified user and all security-related records associated with it.
     * The user will not be deleted if it has active sessions.
     * @note USE WITH CAUTION! There is no undo for this operation.
     *
     * @public
     * @param {User|String} user The user object or the username of the user to be deleted. The specified user must be associated with this tenant.
     * @return {Boolean} True if the user is deleted, otherwise false.
     */
    this.deleteUser = function(user) {
        var userName = null;

        if (user instanceof String) {
            userName = user;
        } else {
            userName = user.getUserName();

            if (user.getActiveSessions().length) {
                logWarning(utils.stringFormat('Could not delete user "%1$s". Has active sessions.', [userName]));
                return false;
            }

            if (user.getTenant().getName() != this.getName()) {
                logWarning(utils.stringFormat('Could not delete user "%1$s". The provided user instance is associated with a different tenant.', [userName]));
                return false;
            }
        }

        var fs = datasources.db.svy_security.users.getFoundSet();
        var qry = datasources.db.svy_security.users.createSelect();
        qry.where.add(qry.columns.user_name.eq(userName));
        qry.where.add(qry.columns.tenant_name.eq(record.tenant_name));
        fs.loadRecords(qry);
        if (fs.getSize() == 0) {
            logError(utils.stringFormat('Could not delete user "%1$s". User not found. Check log for more information.', [userName]));
            return false;
        }

        try {
            deleteRecord(fs.getRecord(1));
            return true;
        } catch (e) {
            logError(utils.stringFormat('Could not delete user "%1$s". Unkown error: %2$s. Check log.', [userName, e.message]));
            throw e;
        }
    }

    /**
     * Creates a role associated with this tenant using the specified role name.
     * <br/>
     * If this is a Master Tenant the created role will be added to all slaves of this Tenant.
     * <br/>
     * Cannot create role for a master tenant when logged in as an user.
     *
     * @public
     * @param {String} name The name of the role to be created. Must be unique to this tenant.
     * @return {Role} The role which was created.
     * @throws {String} If the role name is not unique to this tenant.
     */
    this.createRole = function(name) {
    	var loggedTenant = getTenant();
    	if (loggedTenant && loggedTenant.isMasterTenant()) {
    		throw "Cannot create role for a master tenant when logged in as an user";
    	}
    	
        if (!name) {
            throw new Error('Role name cannot be null or empty');
        }

        if (!nameLengthIsValid(name, MAX_NAME_LENGTH)) {
            throw new Error(utils.stringFormat('Role name must be between 1 and %1$s characters long.', [MAX_NAME_LENGTH]));
        }

        if (this.getRole(name)) {
            throw new Error(utils.stringFormat('Role name "%1$s" is not unique', [name]));
        }

        var roleRec = record.tenants_to_roles.getRecord(record.tenants_to_roles.newRecord(false, false));
        if (!roleRec) {
            throw new Error('Could not create role record');
        }
        roleRec.role_name = name;
        roleRec.display_name = name;
        if (!roleRec.creation_user_name) {
            logWarning('Creating security record without current user context');
            roleRec.creation_user_name = SYSTEM_USER;
        }
        saveRecord(roleRec);
        return new Role(roleRec);
    }

    /**
     * Gets a role by name unique to this tenant.
     *
     * @public
     * @param {String} name The name of the role to get.
     * @return {Role} The matching role, or null if a role with the specified name and associated with this tenant is not found.
     */
    this.getRole = function(name) {
        if (!name) {
            throw 'Name cannot be null or empty';
        }
        var roles = this.getRoles();
        for (var i in roles) {
            var role = roles[i];
            if (role.getName() == name) {
                return role;
            }
        }
        return null;
    }

    /**
     * Gets the roles associated with this tenant.
     * @public
     * @return {Array<Role>} An array with the roles associated with this tenant or an empty array if the tenant has no roles.
     */
    this.getRoles = function() {
        var roles = [];
        for (var i = 1; i <= record.tenants_to_roles.getSize(); i++) {
            var role = record.tenants_to_roles.getRecord(i);
            roles.push(new Role(role));
        }
        return roles;
    }

    /**
     * Deletes the specified role from this tenant.
     * All associated permissions and grants to users are removed immediately.
     * Users with active sessions will be affected, but design-time security (CRUD, UI) will not be affected until next log-in.
     *
     * <br/>
     * If this is a Master Tenant the deleted role will be deleted also for all slaves of this Tenant.
     * 
     * <br/>
     * Cannot delete role of a master tenant when logged in as an user.
     *
     * @public
     * @param {Role|String} role The role object or name of role to be deleted. The role must be associated with this tenant.
     * 
     * @throws {String} throws an exception if the role cannot be deleted.
     * @return {Tenant} This tenant for call-chaining support.
     */
    this.deleteRole = function(role) {
    	var loggedTenant = getTenant();
    	if (loggedTenant && loggedTenant.isMasterTenant()) {
    		throw "Cannot delete role of a master tenant when logged in as an user.";
    	}
    	
        var roleName = null;

        if (role instanceof String) {
            roleName = role;
        } else {
            roleName = role.getName();
            if (role.getTenant().getName() != this.getName()) {
                throw 'Role not deleted. The specified role instance is associated with a different tenant';
            }
        }

        var fs = datasources.db.svy_security.roles.getFoundSet();
        var qry = datasources.db.svy_security.roles.createSelect();
        qry.where.add(qry.columns.role_name.eq(roleName));
        qry.where.add(qry.columns.tenant_name.eq(record.tenant_name));
        fs.loadRecords(qry);
        if (fs.getSize() == 0) {
            throw 'Role ' + roleName + ' not found in tenant';
        }
        deleteRecord(fs.getRecord(1));
        
        return this;
    }

    /**
     * Gets the name of this tenant.
     * Tenant names are unique in the system and are specified when the tenant is created.
     *
     * @public
     * @return {String} The name of this tenant.
     */
    this.getName = function() {
        return record.tenant_name;
    }

    /**
     * Gets the display name of this tenant.
     * The display name can be set using {@link Tenant#setDisplayName}.
     *
     * @public
     * @return {String} The display name of this tenant. Can be null if a display name is not set.
     */
    this.getDisplayName = function() {
        return record.display_name;
    }

    /**
     * Sets the display name of this tenant.
     * @public
     * @param {String} displayName The display name to use.
     * @return {Tenant} This tenant for call-chaining support.
     */
    this.setDisplayName = function(displayName) {
        record.display_name = displayName;
        saveRecord(record);
        return this;
    }

    /**
     * Gets the active sessions for users associated with this tenant.
     * This includes any sessions from any device and any location for users associated with this tenant.
     * @note Any unterminated sessions are deemed to be active when they have not been idle for more than a set timeout period.
     *
     * @public
     * @return {Array<Session>} An array with all active sessions for users associated with this tenant or an empty array if the are no active sessions.
     */
    this.getActiveSessions = function() {
        var q = record.tenants_to_sessions.getQuery();
        addActiveSessionSearchCriteria(q);
        var fs = datasources.db.svy_security.sessions.getFoundSet();
        fs.loadRecords(q);
        var sessions = [];
        for (var i = 1; i <= fs.getSize(); i++) {
            var sesh = fs.getRecord(i);
            sessions.push(new Session(sesh));
        }
        return sessions;
    }

    /**
     * Gets the number of all unique sessions which have ever been initialized in the system by users associated with this tenant.
     * This includes both active sessions (for users currently logged in the application)
     * and inactive sessions (sessions from the past which have already been terminated).
     *
     * @public
     * @return {Number} The number of all sessions (active and inactive) for users associated with this tenant.
     */
    this.getSessionCount = function() {
        return databaseManager.getFoundSetCount(record.tenants_to_sessions);
    }

    /**
     * Locks the tenant account preventing its users from logging in.
     * The lock will remain in place until it expires (if a duration was specified) or it is removed using {Tenant#unlock}.
     * Users with active sessions will be unaffected until subsequent login attempts.
     * Can be called even if the tenant is already locked. In such cases the lock reason and duration will be reset.
     *
     * @public
     * @param {String} [reason] The reason for the lock.
     * @param {Number} [duration] The duration of the lock (in milliseconds). If no duration specified, the lock will remain until {Tenant#unlock} is called.
     * @return {Tenant} This tenant for call-chaining support.
     */
    this.lock = function(reason, duration) {
        record.lock_flag = 1;
        record.lock_reason = reason;
        if (duration) {
            var expiration = application.getServerTimeStamp();
            expiration.setTime(expiration.getTime() + duration);
        }
        record.lock_expiration = expiration;
        saveRecord(record);
        return this;
    }

    /**
     * Removes the lock on the tenant account which is created by {@link Tenant#lock}.
     * Can be safely called even if the tenant is not locked.
     *
     * @public
     * @return {Tenant} This tenant for call-chaining support.
     */
    this.unlock = function() {
        record.lock_flag = null;
        record.lock_reason = null;
        record.lock_expiration = null;
        saveRecord(record);
        return this;
    }

    /**
     * Indicates if the tenant account is locked using {@link Tenant#lock}.
     *
     * @public
     * @return {Boolean} True if the tenant account is currently locked and the lock has not expired.
     */
    this.isLocked = function() {
        if (record.lock_flag == 1) {
            if (record.lock_expiration) {
                var now = application.getServerTimeStamp();
                return now < record.lock_expiration;
            }
            return true;
        }
        return false;
    }

    /**
     * Gets the reason for the account lock created by {@link Tenant#lock}.
     *
     * @public
     * @return {String} The lock reason. Can be null.
     */
    this.getLockReason = function() {
        return record.lock_reason;
    }

    /**
     * Gets the expiration date/time of the lock created by {@link Tenant#lock}.
     * The lock will remain in place until it expires or it is removed using {@link Tenant#unlock}.
     *
     * @public
     * @return {Date} The date/time when the lock expires. Can be null. The date/time is using the Servoy application server timezone.
     */
    this.getLockExpiration = function() {
        return record.lock_expiration;
    }
    
    /**
     * Gets all slaves of this tenant
     * When recursive is true, all slaves of this tenant's slaves are included
     * <br/>
     * <b>WARNING</b>: Cannot call this function when logged in as an user.
     * 
     * @throws {String} Throws an exception if this function is called when logged in as an user.
     * 
     * @public 
     * @return {Array<Tenant>} slaves Array of tenants that have this tenant as their master
     */
    this.getSlaves = function(recursive) {
    	if (getTenant()) {
    		throw "Cannot get tenant slaves when logged in as an user.";
    	} 
    	
    	 var fs = datasources.db.svy_security.tenants.getFoundSet();
         var qry = datasources.db.svy_security.tenants.createSelect();
         qry.where.add(qry.columns.master_tenant_name.eq(this.getName()));
         fs.loadRecords(qry);
         
         var slaves = [];
         if (utils.hasRecords(fs)) {
        	 for (var s = 1; s <= fs.getSize(); s++) {
        	 	var recordSlave = fs.getRecord(s);
        	 	var slave = new Tenant(recordSlave);
        	 	slaves.push(slave);
        	 	if (recursive === true && utils.hasRecords(recordSlave.tenants_to_tenants$slaves)) {
        	 		slaves = slaves.concat(slave.getSlaves(recursive));
        	 	}
        	 }
         }
         return slaves;
    }
    
    /**
     * Returns true if this Tenant is a master (template) tenant
     * <br/>
     * <b>WARNING</b>: When the user is already logged, can call this function only for the tenant of the logged user; 
     * cannot call this function for other tenants when logged in as an user.
     * 
     * @public 
     * @return {Boolean} isMasterTenant Whether this tenant is a master to other tenants
     * 
     * @throws {String} Throws an exception when logged in as an user and called for another tenant than the tenant of the logged user.
     */
    this.isMasterTenant = function() {
    	
    	var loggedTenant = getTenant();
    	if (loggedTenant) {
    		
    		// if is the active tenant
    		if (loggedTenant.getName() === this.getName()) {
    			return activeTenantIsMaster;
    		}

    		throw "Cannot get tenant master info when logged in as an user of another tenant.";
    	} 
    	
    	return utils.hasRecords(record.tenants_to_tenants$slaves);
    }
    
    /**
     * Returns true if this Tenant is a slave tenant
     * 
     * @public 
     * @return {Boolean} isMasterTenant Whether this tenant is a master to other tenants
     * 
     */
    this.isSlaveTenant = function() {
    	return record.master_tenant_name ? true : false;
    }
    
    /**
     * Creates a slave of this tenant with the given name.
     * Modifications to roles and permissions of this tenant will be propagated to all of its slaves.
     * 
     * <br/>
     * <b>WARNING</b>: Cannot call this function when logged in as an user.
     * 
     * @public 
     * @param {String} name The name of the tenant. Must be unique and no longer than 50 characters.
     * 
     * @throws {String} Throws an exception if this function is called when logged in as an user.
     * 
     * @return {Tenant} slave The slave that has been created
     */
    this.createSlave = function(name) {
    	if (getTenant()) {
    		throw "Cannot create tenant slave when logged in as an user.";
    	}
		return cloneTenant(this, name, true);
    }
}

/**
 * @protected 
 * Use {@link Tenant#createUser} to create user objects. Creating user objects with the new operator is reserved for internal use only.
 * @classdesc Application user account associated with a {@link Tenant}. Security [Permissions]{@link Permission} are granted to users through their {@link Role} membership.
 * @param {JSRecord<db:/svy_security/users>} record
 * @constructor
 * @properties={typeid:24,uuid:"96BACE39-6564-4270-8DBD-D16E11F0370E"}
 * @AllowToRunInFind
 */
function User(record) {
    if (!record) {
        throw new Error('User record is not specified');
    }

    /**
     * Returns the tenant that owns this user account.
     *
     * @public
     * @return {Tenant} The parent tenant associated with this user.
     */
    this.getTenant = function() {
        return new Tenant(record.users_to_tenants.getSelectedRecord());
    }

    /**
     * Gets the username of this user which was specified when the user was created.
     * The username cannot be changed after the user is created and is unique to the associated tenant.
     *
     * @public
     * @return {String} The username of this user.
     */
    this.getUserName = function() {
        return record.user_name;
    }

    /**
     * Gets the display name of this user, i.e. "Jane Doe".
     * The display name can be set using {@link User#setDisplayName}.
     *
     * @public
     * @return {String} The display name of this user.
     */
    this.getDisplayName = function() {
        return record.display_name;
    }
    /**
     * @public
     *  @return {String} The email of this user.
     */
    this.getEmail = function() {
        return record.email;
    }
    
    /**
     * @public
     * @param {String} email
     * @return {User} This user for call-chaining support.
     */
    this.setEmail = function(email) {
        // no change
        if (email == record.email) {
            return this;
        }
        record.email = email;
        saveRecord(record);
        return this;
    }

    /**
     * Sets the display name of this user.
     *
     * @public
     * @param {String} displayName The display name to use.
     * @return {User} This user for call-chaining support.
     */
    this.setDisplayName = function(displayName) {
        // no change
        if (displayName == record.display_name) {
            return this;
        }
        record.display_name = displayName;
        saveRecord(record);
        return this;
    }

    /**
     * Checks if the specified password matches the password of this user.
     * User password can be set when the user is created or by using {@link User#setPassword}.
     *
     * @public
     * @param {String} password The password (plain-text) to check.
     * @return {Boolean} True if the specified password matches the password of this user.
     */
    this.checkPassword = function(password) {
        if (!password) {
            throw 'Password must be non-null, non-empty string';
        }
        return utils.validatePBKDF2Hash(password, record.user_password);
    }

    /**
     * Sets the users password.
     * The specified plain-text password will not be stored.
     * Only its hash will be stored and used for password validation.
     * The actual plain-text password cannot be retrieved from the stored hash.
     *
     * @public
     * @param {String} password The plain-text password to use.
     * @return {User} This user for call-chaining support.
     */
    this.setPassword = function(password) {
        if (!password) {
            throw 'Password must be non-null, non-empty string';
        }

        // no change
        if (utils.validatePBKDF2Hash(password, record.user_password)) {
            return this;
        }

        record.user_password = utils.stringPBKDF2Hash(password, 10000);
        saveRecord(record);
        return this;
    }

    /**
     * Adds this user as member of the specified role and grants the user all permissions which the role has.
     *
     * @public
     * @param {Role|String} role The role object or role name to use. The role must be associated with the tenant of this user.
     * @return {User} This user for call-chaining support.
     */
    this.addRole = function(role) {

        if (!role) {
            throw 'Role cannot be null';
        }
        /**
         * @type {String}
         * @private
         */
        var roleName = null;
        if (role instanceof String) {
            roleName = role;
        } else {
            if (role.getTenant().getName() != this.getTenant().getName()) {
                throw 'The specified role instance is associated with another tenant';
            }
            roleName = role.getName();
        }

        if (!this.getTenant().getRole(roleName)) {
            throw 'Role "' + roleName + '" does not exists in tenant';
        }
        // already has role, no change
        if (this.hasRole(role)) {
            return this;
        }
        var userRolesRec = record.users_to_user_roles.getRecord(record.users_to_user_roles.newRecord(false, false));
        if (!userRolesRec) {
            throw 'Failed to create user roles record';
        }
        userRolesRec.role_name = roleName;
        if (!userRolesRec.creation_user_name) {
            logWarning('Creating security record without current user context');
            userRolesRec.creation_user_name = SYSTEM_USER;
        }
        saveRecord(userRolesRec);
        return this;
    }

    /**
     * Removes the membership of this user from the specified role.
     * All permissions of the role will no longer be granted to the user.
     *
     * @public
     * @param {Role|String} role The role object or role name to use. The role must be associated with the tenant of this user.
     * @return {User} This user for call-chaining support.
     */
    this.removeRole = function(role) {
        if (!role) {
            throw 'Role cannot be null';
        }
        var roleName = role instanceof String ? role : role.getName();
        for (var i = 1; i <= record.users_to_user_roles.getSize(); i++) {
            var linkRec = record.users_to_user_roles.getRecord(i);
            if (linkRec.role_name == roleName) {
                deleteRecord(linkRec);
                break;
            }
        }
        return this;
    }

    /**
     * Gets all the roles that this user is member of.
     *
     * @public
     * @return {Array<Role>} An array with all roles which this user is member of or an empty array if the user is not a member of any role.
     */
    this.getRoles = function() {
        var roles = [];
        for (var i = 1; i <= record.users_to_user_roles.getSize(); i++) {
            var role = record.users_to_user_roles.getRecord(i).user_roles_to_roles.getSelectedRecord();
            roles.push(new Role(role));
        }
        return roles;
    }

    /**
     * Checks if this user is a member of the specified role.
     *
     * @public
     * @param {Role|String} role The role object or role name to check. The role must be associated with the tenant of this user.
     * @return {Boolean} True if the user is a member of the specified role.
     */
    this.hasRole = function(role) {
        if (!role) {
            throw 'Role cannot be null';
        }

        var roleName = null;
        if (role instanceof String) {
            roleName = role;
        } else {
            if (role.getTenant().getName() != this.getTenant().getName()) {
                //The specified role instance is associated with another tenant
                return false
            }
            roleName = role.getName();
        }

        for (var i = 1; i <= record.users_to_user_roles.getSize(); i++) {
            var link = record.users_to_user_roles.getRecord(i);
            if (link.role_name == roleName) {
                return true;
            }
        }
        return false;
    }

    /**
     * Gets all the permissions granted to this user via its roles membership.
     * Result will exclude duplicates.
     * Permissions cannot be granted directly to the user.
     * Use {@link User#addRole} or {@link Role#addUser} to make the user a member
     * of specific roles and all role permissions will be granted to the user.
     *
     * @public
     * @return {Array<Permission>} An array with the permissions granted to this user or an empty array if the user has no permissions.
     */
    this.getPermissions = function() {
        // map permisions to reduce recursive iterations
        var permissions = { };
        var roles = this.getRoles();
        for (var i in roles) {
            var rolePermissions = roles[i].getPermissions();
            for (var j in rolePermissions) {
                var permission = rolePermissions[j];
                if (!permissions[permission.getName()]) {
                    permissions[permission.getName()] = permission;
                }
            }
        }

        // convert map to array
        var array = [];
        for (var k in permissions) {
            array.push(permissions[k]);
        }
        return array;
    }

    /**
     * Checks if the this user is granted the specified permission via the user's role membership.
     * Permissions cannot be granted directly to the user.
     * Use {@link User#addRole} or {@link Role#addUser} to make the user a member
     * of specific roles and all role permissions will be granted to the user.
     *
     * @public
     * @param {Permission|String} permission The permission object or permission name to check.
     * @return {Boolean} True if the user has been granted the specified permission.
     */
    this.hasPermission = function(permission) {
        if (!permission) {
            throw 'Permission cannot be null';
        }
        var permissionName = permission instanceof String ? permission : permission.getName();
        var permissions = this.getPermissions();
        for (var i in permissions) {
            if (permissions[i].getName() == permissionName) {
                return true;
            }
        }
        return false;
    }

    /**
     * Gets the number of all unique sessions which have ever been initialized in the system by this user.
     * This includes both active sessions (for users currently logged in the application)
     * and inactive sessions (sessions from the past which have already been terminated).
     *
     * @public
     * @return {Number} The number of all sessions (active and inactive) for this user.
     */
    this.getSessionCount = function() {
        return databaseManager.getFoundSetCount(record.users_to_sessions);
    }

    /**
     * Gets the active sessions this user.
     * This includes any sessions from any device and any location for this user.
     * @note Any unterminated sessions are deemed to be active when they have not been idle for more than a set timeout period.
     *
     * @public
     * @return {Array<Session>} An array with all active sessions for this user or an empty array if the are no active sessions.
     */
    this.getActiveSessions = function() {
        var q = record.users_to_sessions.getQuery();
        addActiveSessionSearchCriteria(q);
        var fs = datasources.db.svy_security.sessions.getFoundSet();
        fs.loadRecords(q);
        var sessions = [];
        for (var i = 1; i <= fs.getSize(); i++) {
            var sesh = fs.getRecord(i);
            sessions.push(new Session(sesh));
        }
        return sessions;
    }

    /**
     * Locks the user account preventing it from logging in.
     * The lock will remain in place until it expires (if a duration was specified) or it is removed using {User#unlock}.
     * Users with active sessions will be unaffected until subsequent login attempts.
     * Can be called even if the user account is already locked. In such cases the lock reason and duration will be reset.
     *
     * @public
     * @param {String} [reason] The reason for the lock.
     * @param {Number} [duration] The duration of the lock (in milliseconds). If no duration specified, the lock will remain until {User#unlock} is called.
     * @return {User} This user for call-chaining support.
     */
    this.lock = function(reason, duration) {
        record.lock_flag = 1;
        record.lock_reason = reason;
        if (duration) {
            var expiration = application.getServerTimeStamp();
            expiration.setTime(expiration.getTime() + duration);
        }
        record.lock_expiration = expiration;
        saveRecord(record);
        return this;
    }

    /**
     * Removes the lock on the user account which is created by {@link User#lock}.
     * Can be safely called even if the user account is not locked.
     *
     * @public
     * @return {User} This user for call-chaining support.
     */
    this.unlock = function() {
        record.lock_flag = null;
        record.lock_reason = null;
        record.lock_expiration = null;
        saveRecord(record);
        return this;
    }

    /**
     * Indicates if the use account is locked using {@link User#lock}.
     *
     * @public
     * @return {Boolean} True if the user account is currently locked and the lock has not expired.
     */
    this.isLocked = function() {
        if (record.lock_flag == 1) {
            if (record.lock_expiration) {
                var now = application.getServerTimeStamp();
                return now < record.lock_expiration;
            }
            return true;
        }

        //if the tenant is locked then the user should be treated as locked too
        return this.getTenant().isLocked();
    }

    /**
     * Gets the reason for the account lock created by {@link User#lock}.
     *
     * @public
     * @return {String} The lock reason. Can be null.
     */
    this.getLockReason = function() {
        return record.lock_reason;
    }

    /**
     * Gets the expiration date/time of the lock created by {@link User#lock}.
     * The lock will remain in place until it expires or it is removed using {@link User#unlock}.
     *
     * @public
     * @return {Date} The date/time when the lock expires. Can be null. The date/time is using the Servoy application server timezone.
     */
    this.getLockExpiration = function() {
        return record.lock_expiration;
    }

    /**
     * Generates a secure access token to authenticate this user within a window of validity of the specified duration.
     * The generated access token can be used with {@link consumeAccessToken}.
     *
     * @public
     * @param {Number} [duration] The duration of token validity in milliseconds. Default is 30 minutes in future.
     * @return {String} The generated access token.
     */
    this.generateAccessToken = function(duration) {
        record.access_token = application.getUUID().toString();
        if (!duration) {
            duration = ACCESS_TOKEN_DEFAULT_VALIDITY;
        }
        var expiration = application.getServerTimeStamp();
        expiration.setTime(expiration.getTime() + duration);
        record.access_token_expiration = expiration;
        saveRecord(record);
        return record.access_token;
    }
}

/**
 * Use {@link Tenant#createRole} to create role objects.
 * Creating role objects with the new operator is reserved for internal use only.
 *
 * @classdesc Security role which can have [user]{@link User} members and can be granted [permissions]{@link Permission}.
 *
 * @protected
 * @param {JSRecord<db:/svy_security/roles>} record
 * @constructor
 *
 * @properties={typeid:24,uuid:"4FB7C5A5-5E35-47EA-9E3A-9FADD537800A"}
 */
function Role(record) {
    if (!record) {
        throw new Error('Role record is not specified');
    }

    /**
     * Gets the name of this role. The role name is unique to the associated tenant.
     *
     * @public
     * @return {String} The role name.
     */
    this.getName = function() {
        return record.role_name;
    }

    /**
     * Gets the display name of this role.
     * @public
     * @return {String} The display name of this role. Can be null.
     */
    this.getDisplayName = function() {
        return record.display_name;
    }

    /**
     * Sets the display name of this role.
     * <br/>
     * If the tenant of this role is a master tenant, the displayName will be set to the same role in all slaves of this role tenant.
     * <br/>
     * You cannot set the display name to role of a master tenant when logged in as an user.
     * You cannot set the display name to role of a slave tenant at anytime.
     * 
     * @public
     * @param {String} displayName The display name to use.
     * @return {Role} This role for call-chaining support.
     * @throws {String} throws an exception if the displayName cannot be changed
     */
    this.setDisplayName = function(displayName) {
    	
    	var loggedTenant = getTenant();
    	if (loggedTenant && loggedTenant.isMasterTenant()) {
    		throw "Cannot cannot set the display name to role of a master tenant when logged in as an user";
    	}
    	
        record.display_name = displayName;
        saveRecord(record);
        return this;
    }

    /**
     * Gets the tenant which this role belongs to.
     *
     * @public
     * @return {Tenant} The tenant which this role belongs to.
     */
    this.getTenant = function() {
        return new Tenant(record.roles_to_tenants.getSelectedRecord());
    }

    /**
     * Adds the specified user as member of this role.
     * All permissions granted to this role will be granted to the user.
     *
     * @public
     * @param {User|String} user The user object or username of user to add. The user must be associated with the tenant of this role.
     * @return {Role} This role for call-chaining support.
     */
    this.addUser = function(user) {

        if (!user) {
            throw 'User cannot be null'
        }

        /**
         * @type {String}
         * @private
         */
        var userName = null;
        if (user instanceof String) {
            userName = user;
        } else {
            if (user.getTenant().getName() != this.getTenant().getName()) {
                throw 'The specified user instance is associated with another tenant';
            }
            userName = user.getUserName();
        }

        if (!this.getTenant().getUser(userName)) {
            throw 'User "' + userName + '" does not exist in tenant';
        }
        if (!this.hasUser(user)) {
            var userRolesRec = record.roles_to_user_roles.getRecord(record.roles_to_user_roles.newRecord(false, false));
            if (!userRolesRec) {
                throw 'Failed to create user roles record';
            }
            userRolesRec.user_name = userName;
            if (!userRolesRec.creation_user_name) {
                logWarning('Creating security record without current user context');
                userRolesRec.creation_user_name = SYSTEM_USER;
            }
            saveRecord(userRolesRec);
        }
        return this;
    }

    /**
     * Gets all the users who are members of this role.
     *
     * @public
     * @return {Array<User>} An array with all users who are members of this role or an empty array if the role has no members.
     */
    this.getUsers = function() {
        var users = [];
        for (var i = 1; i <= record.roles_to_user_roles.getSize(); i++) {
            var user = record.roles_to_user_roles.getRecord(i).user_roles_to_users.getSelectedRecord();
            users.push(new User(user));
        }
        return users;
    }

    /**
     * Checks if the specified user is a member of this role.
     *
     * @public
     * @param {User|String} user The user object or username of user to check. The user must be associated with the tenant of this role.
     * @return {Boolean} True if the specified user is a member of this role.
     */
    this.hasUser = function(user) {

        if (!user) {
            throw 'User cannot be null';
        }

        var userName = null;
        if (user instanceof String) {
            userName = user;
        } else {
            if (user.getTenant().getName() != this.getTenant().getName()) {
                //The specified user instance is associated with another tenant
                return false;
            }
            userName = user.getUserName();
        }

        for (var i = 1; i <= record.roles_to_user_roles.getSize(); i++) {
            if (record.roles_to_user_roles.getRecord(i).user_name == userName) {
                return true;
            }
        }
        return false;
    }

    /**
     * Removes the specified user from the members of this role.
     * All permissions granted to this role will no longer be granted to the user.
     *
     * @public
     * @param {User|String} user The user object or username of user to remove.
     * @return {Role} This role for call-chaining support.
     */
    this.removeUser = function(user) {
        if (!user) {
            throw 'User cannot be null';
        }
        var userName = user instanceof String ? user : user.getUserName();
        for (var i = 1; i <= record.roles_to_user_roles.getSize(); i++) {
            if (record.roles_to_user_roles.getRecord(i).user_name == userName) {
                deleteRecord(record.roles_to_user_roles.getRecord(i));
                break;
            }
        }
        return this;
    }

    /**
     * Grants the specified permission to this role.
     * Any users that are members of this role will be granted the permission.\
     * <br/>
     * If the tenant of this role is a master tenant, the permission will also be added to the same role in all slaves of this role tenant.
     * <br/>
     * You cannot grant permission to role of a master tenant when logged in as an user.
     * You cannot grant permission to role of a slave tenant at anytime.
     *
     * @public
     * @param {Permission|String} permission The permission object or name of permission to add.\
     * 
     * @throws {String} Throws an exception when permission cannot be grant.
     * @return {Role} This role for call-chaining support.
     */
    this.addPermission = function(permission) {

        if (!permission) {
            throw 'Permission cannot be null';
        }
    	var loggedTenant = getTenant();
    	if (loggedTenant && loggedTenant.isMasterTenant()) {
    		throw "Cannot grant permission to role of a master tenant when logged in as an user";
    	}

        /**
         * @type {String}
         * @private
         */
        var permissionName = permission instanceof String ? permission : permission.getName();
        if (!scopes.svySecurity.getPermission(permissionName)) {
            throw 'Permission "' + permissionName + '" does not exist in system';
        }
        if (!this.hasPermission(permission)) {
            var rolesPermRec = record.roles_to_roles_permissions.getRecord(record.roles_to_roles_permissions.newRecord(false, false));
            if (!rolesPermRec) {
                throw 'Failed to create roles permission record';
            }
            rolesPermRec.permission_name = permissionName;
            if (!rolesPermRec.creation_user_name) {
                logWarning('Creating security record without current user context');
                rolesPermRec.creation_user_name = SYSTEM_USER;
            }
            saveRecord(rolesPermRec);
        }
        return this;
    }

    /**
     * Gets all the permissions granted to this role.
     *
     * @public
     * @return {Array<Permission>} An array with all permissions granted to this role or an empty array if no permissions are granted.
     */
    this.getPermissions = function() {

        var permissions = [];
        for (var i = 1; i <= record.roles_to_roles_permissions.getSize(); i++) {
            var permission = record.roles_to_roles_permissions.getRecord(i).roles_permissions_to_permissions.getSelectedRecord();
            permissions.push(new Permission(permission));
        }
        return permissions;
    }

    /**
     * Checks if the specified permission is granted to this role.
     *
     * @public
     * @param {Permission|String} permission The permission object or name of permission to check.
     * @return {Boolean} True if the specified permission is granted to this role.
     */
    this.hasPermission = function(permission) {
        if (!permission) {
            throw 'Permission cannot be null';
        }
        var permissionName = permission instanceof String ? permission : permission.getName();
        for (var i = 1; i <= record.roles_to_roles_permissions.getSize(); i++) {
            if (record.roles_to_roles_permissions.getRecord(i).permission_name == permissionName) {
                return true;
            }
        }
        return false;
    }

    /**
     * Removes the specified permission from this role.
     * The permission will no longer be granted to all users that are members of this role.
     * <br/>
     * If the tenant of this role is a master tenant, the permission will also be removed from the same role in all slaves of this role tenant.
     * <br/>
     * You cannot remove permission from role of a master tenant when logged in as an user.
     * You cannot remove permission from role of a slave tenant at anytime.
     * 
     * @public
     * @param {Permission|String} permission The permission object or name of permission to remove.
     * @return {Role} This role for call-chaining support.
     * @throws {String} Throws an exception when permission cannot be removed.
     */
    this.removePermission = function(permission) {
        if (!permission) {
            throw 'Permission cannot be null';
        }
    	var loggedTenant = getTenant();
    	if (loggedTenant && loggedTenant.isMasterTenant()) {
    		throw "Cannot remove permission from role of a master tenant when logged in as an user";
    	}
        
        var permissionName = permission instanceof String ? permission : permission.getName();
        for (var i = 1; i <= record.roles_to_roles_permissions.getSize(); i++) {
            if (record.roles_to_roles_permissions.getRecord(i).permission_name == permissionName) {
                deleteRecord(record.roles_to_roles_permissions.getRecord(i));
                break;
            }
        }
        
        return this;
    }
}

/**
 * Permission objects cannot be created through the API.
 * They are created automatically when the scope is loaded.
 * Use {@link getPermission} or {@link getPermissions} to get permission objects.
 * Creating permission objects with the new operator is reserved for internal use only.
 *
 * @classdesc Represents a security permission in the system. Mapped internally to a Servoy security group which must be defined.
 *
 * @protected
 * @param {JSRecord<db:/svy_security/permissions>} record
 * @constructor
 * @properties={typeid:24,uuid:"71B3A503-60B2-4CEC-B8D5-E8961D6032B1"}
 */
function Permission(record) {
    if (!record) {
        throw new Error('Permission record is not specified');
    }
    
    /** 
     * @protected 
     * @type {JSRecord<db:/svy_security/permissions>}
     */
    this.record = record;

    /**
     * Gets the name of this permission.
     * The permission name is unique in the system and matches a Servoy security group name.
     *
     * @public
     * @return {String} The name of the permission.
     */
    this.getName = function() {
        return record.permission_name;
    }

    /**
     * Gets the display name of this permission.
     * The display name can be set using {@link Permission#setDisplayName}.
     *
     * @public
     * @return {String} The display name of the permission. Can be null.
     */
    this.getDisplayName = function() {
        return record.display_name;
    }

    /**
     * Sets the display name of this permission.
     *
     * @public
     * @param {String} [displayName] The display name to use.
     * @return {Permission} This permission for call-chaining support.
     */
    this.setDisplayName = function(displayName) {
        record.display_name = displayName;
        saveRecord(record);
        return this;
    }

    /**
     * Grants this permission to the specified role.
     * The permission will be granted to all users that are members of the specified role.
     * <br/>
     * If the tenant of this permission is a master tenant, the role will also be added to the same permission for all the slaves of this permission tenant.
     * <br/>
     * You cannot grant permission to role of a master tenant when logged in as an user.
     * You cannot grant permission to role of a slave tenant at anytime.
     * 
     * @public
     * @param {Role} role The role object to which the permission should be granted.
     * @return {Permission} This permission for call-chaining support.
     * @throws {String} Throws an exception when permission cannot be granted.
     */
    this.addRole = function(role) {
        if (!role) {
            throw new Error('Role cannot be null');
        }
        
    	var loggedTenant = getTenant();
    	if (loggedTenant && loggedTenant.isMasterTenant()) {
    		throw "Cannot grant permission to role of a master tenant when logged in as an user";
    	}
        var roleName = role.getName();
        if (!this.hasRole(role)) {
            var rolePermRec = record.permissions_to_roles_permissions.getRecord(record.permissions_to_roles_permissions.newRecord(false, false));
            if (!rolePermRec) {
                throw new Error('Failed to create new roles_permissions record');
            }
            rolePermRec.tenant_name = role.getTenant().getName();
            rolePermRec.role_name = roleName;
            if (!rolePermRec.creation_user_name) {
                rolePermRec.creation_user_name = SYSTEM_USER;
            }
            saveRecord(rolePermRec);
        }
        return this;
    }

    /**
     * Gets all the roles to which this permission is granted.
     *
     * @public
     * @return {Array<Role>} An array with all roles to which this permission is granted or an empty array if the permission has not been granted to any role.
     */
    this.getRoles = function() {
        var roles = [];
        for (var i = 1; i <= record.permissions_to_roles_permissions.getSize(); i++) {
            var role = record.permissions_to_roles_permissions.getRecord(i).roles_permissions_to_roles.getSelectedRecord();
            roles.push(new Role(role));
        }
        return roles;
    }

    /**
     * Checks if this permission is granted to the specified role.
     *
     * @public
     * @param {Role|String} role The role object or the name of the role to check.
     * @return {Boolean} True if this permission is granted to the specified role.
     */
    this.hasRole = function(role) {
        if (!role) {
            throw 'Role cannot be null';
        }
        var roleName = role instanceof String ? role : role.getName();
        for (var i = 1; i <= record.permissions_to_roles_permissions.getSize(); i++) {
            if (record.permissions_to_roles_permissions.getRecord(i).role_name == roleName) {
                return true;
            }
        }
        return false;
    }

    /**
     * Removes this permission from the specified role.
     * The permission will no longer be granted to all users that are members of the specified role.
     * <br/>
     * If the tenant of this permission is a master tenant, the role will also be removed from the same permission for all the slaves of this permission tenant.
     * <br/>
     * You cannot remove permission from role of a master tenant when logged in as an user.
     * You cannot remove permission from role of a slave tenant at anytime.
     * 
     * @public
     * @param {Role|String} role The role object or the name of the role to remove.
     * @return {Permission} This permission for call-chaining support.
     * @throws {String} Throws an exception when permission cannot be removed.
     */
    this.removeRole = function(role) {
        if (!role) {
            throw 'Role cannot be null';
        }
    	var loggedTenant = getTenant();
    	if (loggedTenant && loggedTenant.isMasterTenant()) {
    		throw "Cannot remove permission from role of a master tenant when logged in as an user";
    	}
        var roleName = role instanceof String ? role : role.getName();

        for (var i = 1; i <= record.permissions_to_roles_permissions.getSize(); i++) {
            if (record.permissions_to_roles_permissions.getRecord(i).role_name == roleName) {
                deleteRecord(record.permissions_to_roles_permissions.getRecord(i));
                break;
            }
        }
        return this;
    }

    /**
     * Gets all users whom this permission is granted to via the users' role membership.
     *
     * @public
     * @return {Array<User>} An array with all users whom this permission is granted to or an empty array if no user has this permission.
     */
    this.getUsers = function() {

        var users = [];
        var q = datasources.db.svy_security.users.createSelect();
        var fs = datasources.db.svy_security.users.getFoundSet();

        q.result.addPk();
        q.where.add(q.joins.users_to_user_roles.joins.user_roles_to_roles.joins.roles_to_roles_permissions.columns.permission_name.eq(record.permission_name)
        );

        fs.loadRecords(q);
        for (var i = 1; i <= fs.getSize(); i++) {
            var user = fs.getRecord(i);
            users.push(new User(user));
        }
        return users;
    }
}

/**
 *
 * Session objects cannot be created through the API.
 * They are created automatically when a user is logged in.
 * Use {@link getSession} to get the current session or {@link getActiveSessions} to get all active sessions.
 * Creating session objects with the new operator is reserved for internal use only.
 *
 * @classdesc Security application session created by a {@link User} which starts when the user [logs in]{@link login} and ends when the user [logs out]{@link logout}.
 * @protected
 * @param {JSRecord<db:/svy_security/sessions>} record
 * @constructor
 * @properties={typeid:24,uuid:"6B34CF86-7237-4C7B-87E8-54F30E03C270"}
 */
function Session(record) {
    if (!record) {
        throw new Error('Session record is not specified');
    }

    /**
     * Gets the internal unique ID of this session.
     * This matches the Servoy Client ID as seen in the Servoy App Server admin page.
     *
     * @public
     * @return {String} The internal unique ID of this session.
     */
    this.getID = function() {
        return record.id.toString();
    }

    /**
     * Gets the user who created this session.
     * Returns null if the user account has been deleted.
     * In such cases use {@link Session#getUserName} as it will be preserved even if the user account is deleted.
     *
     * @public
     * @return {User} The user who created this session or null if the user account has been deleted.
     */
    this.getUser = function() {
        if (!utils.hasRecords(record.sessions_to_users)) {
            return null;
        }
        return new User(record.sessions_to_users.getSelectedRecord());
    }

    /**
     * The username of the user associated with this session.
     * It will be available even if the associated user account is deleted.
     *
     * @public
     * @return {String} The username of the user who created this session.
     */
    this.getUserName = function() {
        return record.user_name;
    }

    /**
     * Gets the tenant associated with this session.
     * Returns null if the tenant has been deleted.
     * In such cases use {@link Session#getTenantName} as it will be preserved even if the tenant account is deleted.
     * @public
     * @return {Tenant}
     */
    this.getTenant = function() {
        if (!utils.hasRecords(record.sessions_to_tenants)) {
            return null;
        }
        return new Tenant(record.sessions_to_tenants.getSelectedRecord());
    }

    /**
     * Gets the name of the tenant associated with this session.
     * It will be available even if the associated tenant account is deleted.
     *
     * @public
     * @return {String} The name of the tenant associated with this session.
     */
    this.getTenantName = function() {
        return record.tenant_name;
    }

    /**
     * Gets the start date/time of this session.
     * The session start date/time is set by {@link login}.
     *
     * @public
     * @return {Date} The start date/time of this session.
     */
    this.getStart = function() {
        return record.session_start
    }

    /**
     * Gets the end datetime of this session.
     * Can be null if the session is still active or if the session has not been properly closed.
     * The session end date/time is set by {@link logout}.
     *
     * @public
     * @return {Date} The end date/time of this session.
     *
     */
    this.getEnd = function() {
        return record.session_end;
    }

    /**
     * Gets the most recent time of known session activity (last client ping).
     * @note If a session is not properly closed, one can compare the last client ping property to the start of the session to determine if the session is abandoned.
     *
     * @public
     * @return {Date} The date/time of the last session activity (client ping).
     * @deprecated Sessions are cleaned by security batch processor
     *
     */
    this.getLastActivity = function() {
        return record.last_client_ping;
    }

    /**
     * Gets the client IP address of the session.
     *
     * @public
     * @return {String} The client IP address of the session.
     */
    this.getIPAddress = function() {
        return record.ip_address;
    }

    /**
     * Gets the client user agent string of the session.
     * The user agent string will be null if the session was not browser-based.
     *
     * @public
     * @return {String} The client user agent string of this session. Can be null.
     */
    this.getUserAgentString = function() {
        return record.user_agent_string;
    }

    /**
     * Gets the Servoy Client ID associated with the session (as shown on the Servoy app server admin page).
     * @note Multiple user sessions can have the same Servoy Client ID if the client is not closed between different logins (for NG/Web clients this requires complete closing of the browser and not just a tab).
     *
     * @public
     * @return {String} The Servoy Client ID associated with the session.
     */
    this.getServoyClientID = function() {
        return record.servoy_client_id;
    }
    
    /**
     * Gets the session duration in milliseconds (as updated in the database)
     * @note The session duration is updated on each "client ping" which by default is once per minute
     *
     * @public
     * @return {Number} The Servoy Client ID associated with the session.
     */
    this.getDuration = function() {
        return record.session_duration;
    }

    /**
     * Indicates if this session is still active.
     *
     * @public
     * @return {Boolean} True if the session has not been terminated and has not been inactive for longer than the session inactivity timeout period.
     */
    this.isActive = function() {
        return record.is_active;
    }

    /**
     * Indicates if this session was terminated/closed using {@link logout} or closed due to inactivity.
     * @public
     * @return {Boolean} True if the session was terminated/closed normally or by timeout from inactivity.
     */
    this.isTerminated = function() {
        return record.session_end != null || this.isAbandoned();
    }

    /**
     * Indicates if this session was abandoned and closed due to inactivity and was not closed by {@link logout}.
     *
     * @public
     * @return {Boolean} True if this session was not terminated/closed normally, but has timed out due to inactivity.
     */
    this.isAbandoned = function() {
        return record.session_end == null && !this.isActive();
    }

    /**
     * Gets the name of the Servoy solution that was accessed by this session
     *
     * @public
     * @return {String}
     */
    this.getSolutionName = function(){
    	return record.solution_name;
    }
    
    /**
     * Records a client ping in the database. Internal-use only.
     *
     * @protected
     * @deprecated 
     */
    this.sendPing = function() {
        setSessionLastPingAndDuration(record);
        saveRecord(record);
    }
}

/**
 * Utility to save record with error thrown
 * @private
 * @param {JSRecord} record
 *
 * @properties={typeid:24,uuid:"A2BD1ED2-F372-477C-BFF5-0CED1A69BDD9"}
 */
function saveRecord(record) {
    var startedLocalTransaction = false;

    if (databaseManager.hasTransaction()) {
        logDebug('Detected external database transaction.');
        if (!supportExternalDBTransaction) {
            throw new Error('External database transactions are not allowed.');
        }
    } else {
        startedLocalTransaction = true;
        databaseManager.startTransaction();
    }

    try {
        if (!databaseManager.saveData(record)) {
            throw new Error('Failed to save record ' + record.exception);
        }
        if (startedLocalTransaction) {
            if (!databaseManager.commitTransaction(false)) {
                throw new Error('Failed to commit database transaction.');
            }
        }
    } catch (e) {
        logError(utils.stringFormat('Record could not be saved due to the following: "%1$s" Rolling back database transaction.', [e.message]));
        databaseManager.rollbackTransaction();
        record.revertChanges();
        throw e;
    }
}

/**
 * Utility to delete record with errors thrown
 * @private
 * @param {JSRecord} record
 *
 * @properties={typeid:24,uuid:"D0449941-D784-429A-8214-1F1F8E7D65A1"}
 */
function deleteRecord(record) {
    var startedLocalTransaction = false;

    if (databaseManager.hasTransaction()) {
        logDebug('Detected external database transaction.');
        if (!supportExternalDBTransaction) {
            throw new Error('External database transactions are not allowed.');
        }
    } else {
        startedLocalTransaction = true;
        databaseManager.startTransaction();
    }

    try {
        if (!record.foundset.deleteRecord(record)) {
            throw new Error('Failed to delete record.');
        }
        if (startedLocalTransaction) {
            if (!databaseManager.commitTransaction(false)) {
                throw new Error('Failed to commit database transaction.');
            }
        }
    } catch (e) {
        logError(utils.stringFormat('Record could not be deleted due to the following: "%1$s" Rolling back database transaction.', [e.message]));
        databaseManager.rollbackTransaction();
        throw e;
    }
}

/**
 * Utility to sync permission records to the internal, design-time Servoy Security Groups.
 * This should be called on solution import or on startup
 * This action will create new permission records.
 *
 * NOTE: This action will not delete permissions which have been removed from internal security.
 * Design-time groups should never be renamed. They will be seen only as an ADD and will lose their tie to roles.
 *
 * @public 
 * @param {Boolean} [forcePermissionRemoval] if true then permissions without a matching
 * Servoy security group will be deleted regardless if they have been granted to any role or not;
 * if false (default) then permissions without a matching Servoy security group will be deleted only
 * if they have not been granted to any role
 *
 * @properties={typeid:24,uuid:"EA173150-F833-4823-9110-5C576FFE362E"}
 */
function syncPermissions(forcePermissionRemoval) {
    var permissionFS = datasources.db.svy_security.permissions.getFoundSet();
    var groups = security.getGroups().getColumnAsArray(2);
    for (var i in groups) {
        if (!getPermission(groups[i])) {
            var permissionRec = permissionFS.getRecord(permissionFS.newRecord(false, false));
            if (!permissionRec) {
                throw 'Failed to create permission record';
            }
            permissionRec.permission_name = groups[i];
            permissionRec.display_name = groups[i];
            if (!permissionRec.creation_user_name) {
                permissionRec.creation_user_name = SYSTEM_USER;
            }
            saveRecord(permissionRec);

            logDebug(utils.stringFormat('Created permission "%1$s" which did not exist', [groups[i]]));
        }
    }

    // look for removed permissions
    var qry = datasources.db.svy_security.permissions.createSelect();
    qry.where.add(qry.columns.permission_name.not.isin(groups));
    permissionFS.loadRecords(qry);
    var cnt = databaseManager.getFoundSetCount(permissionFS);
    for (i = cnt; i > 0; i--) {
        var record = permissionFS.getRecord(i);
        if (forcePermissionRemoval || !databaseManager.hasRecords(record.permissions_to_roles_permissions)) {
            logInfo(utils.stringFormat('Permission "%1$s" is no longer found within internal security settings and will be deleted.', [record.permission_name]));
            deleteRecord(record);
        } else {
            logWarning(utils.stringFormat('Permission "%1$s" is no longer found within internal security settings.', [record.permission_name]));
        }
    }
}

/**
 * @private
 * @param {User} user
 *
 * @properties={typeid:24,uuid:"85255CC3-38DC-4F97-923C-CD1BB1BD31A8"}
 */
function initSession(user) {

    if (!user) throw 'No user';
    if (getSession()) throw 'Session "' + getSession().getID() + '" already in progress in this client';

    // create session
    var fs = datasources.db.svy_security.sessions.getFoundSet();
    var sessionRec = fs.getRecord(fs.newRecord(false, false));
    //using the Servoy client session ID
    sessionRec.servoy_client_id = security.getClientID();
    sessionRec.user_name = user.getUserName();
    sessionRec.tenant_name = user.getTenant().getName();
    sessionRec.ip_address = application.getIPAddress();
    sessionRec.solution_name = application.getSolutionName();

    // DEPRECATED 1.2.0
//    sessionRec.last_client_ping = application.getServerTimeStamp();
    
    if (application.getApplicationType() == APPLICATION_TYPES.NG_CLIENT) {
        sessionRec.user_agent_string = plugins.ngclientutils.getUserAgent();
    }
    
    
    
    saveRecord(sessionRec);

    // create ping job
    // DERECATED 1.2.0
//    var jobName = 'com.servoy.extensions.security.sessionUpdater';
//    plugins.scheduler.removeJob(jobName);
//    plugins.scheduler.addJob(jobName, application.getServerTimeStamp(), sessionClientPing, SESSION_PING_INTERVAL);

    // store session id
    activeTenantIsMaster = user.getTenant().isMasterTenant();
    activeUserName = user.getUserName();
    activeTenantName = user.getTenant().getName();
    sessionID = sessionRec.id.toString();

    //set user and tenant name in svyProperties
    scopes.svyProperties.setUserName(activeUserName, activeTenantName);
}

/**
 * Sends the current session going to DB. For internal use only with initSession() which schedules it
 *
 * @private
 * @deprecated 1.2.0
 * @properties={typeid:24,uuid:"92DCCEDD-F678-4E72-89A3-BEEE78E88958"}
 */
function sessionClientPing() {    
    if (!utils.hasRecords(active_session)) return;
    var sessionRec = active_session.getRecord(1);
    setSessionLastPingAndDuration(sessionRec);
    //intentionally not using saveRecord and not checking result
    //this is called very often and if some updates fail we try again X seconds later anyway
    databaseManager.saveData(sessionRec);
}

/**
 * @private
 * @properties={typeid:24,uuid:"A9B894CA-526A-42AB-ABED-31F414D25EC8"}
 */
function closeSession() {
    if (!utils.hasRecords(active_session)) return;
    var sessionRec = active_session.getRecord(1);
    
    // SET END TIME AND DURATION
    var now = application.getServerTimeStamp();
    sessionRec.session_end = now;
    sessionRec.session_duration = Math.max(0,now.getTime() - sessionRec.session_start.getTime());
    
    //	DEPRECATED 1.2.0
//    setSessionLastPingAndDuration(sessionRec, true);
    
    saveRecord(sessionRec);
    sessionID = null;
    activeUserName = null;
    activeTenantName = null;
}

/**
 * @private
 * @param {JSRecord<db:/svy_security/sessions>} sessionRec
 * @param {Boolean} [setEndDate] if true will set also the session_end
 *
 * @properties={typeid:24,uuid:"28C3443D-9537-436C-828E-40250687FCF4"}
 */
function setSessionLastPingAndDuration(sessionRec, setEndDate) {
    if (!sessionRec) {
        return;
    }
    var now = application.getServerTimeStamp();
    sessionRec.last_client_ping = now;
    var duration = now.getTime() - sessionRec.session_start.getTime();
    if (duration < 0) {
        duration = 0;
    }
    sessionRec.session_duration = duration;
    if (setEndDate) {
        sessionRec.session_end = now;
    }
}

/**
 * @private
 * @properties={typeid:24,uuid:"B9830A16-34D1-4844-937F-B873663F98F1"}
 */
function filterSecurityTables() {
    var serverName = datasources.db.svy_security.getServerName();
    databaseManager.removeTableFilterParam(serverName, SECURITY_TABLES_FILTER_NAME);
    if (!databaseManager.addTableFilterParam(serverName, null, 'tenant_name', '^||=', activeTenantName, SECURITY_TABLES_FILTER_NAME)) {
        logError('Failed to filter security tables');
        logout();
        throw 'Failed to filter security tables';
    }
}

/**
 * @private
 * @properties={typeid:24,uuid:"222C8F50-1A78-42DF-8795-84F5FDE2E8BD"}
 */
function removeSecurityTablesFilter() {
    var serverName = datasources.db.svy_security.getServerName();
    databaseManager.removeTableFilterParam(serverName, SECURITY_TABLES_FILTER_NAME);
}

/**
 * Check for user name bypassing any filters for current tenant
 * @private
 * @param {String} userName
 * @param {String} tenantName
 * @return {Boolean} True if user is found in system
 *
 * @properties={typeid:24,uuid:"1FA4E812-55A3-4B03-9EF9-D155FFA89BD4"}
 */
function userNameExists(userName, tenantName) {
    var q = datasources.db.svy_security.users.createSelect();
    q.result.addPk();
    q.where.add(q.columns.user_name.eq(userName));
    q.where.add(q.columns.tenant_name.eq(tenantName));
    var ds = databaseManager.getDataSetByQuery(q, false, 1);
    if (ds.getException()) {
        throw 'SQL error checking for existing user';
    }
    return ds.getMaxRowIndex() > 0;
}

/**
 * Wrapper for future logging functionality.
 * For now simply uses application.output
 * @private
 * @param {String} msg
 *
 * @properties={typeid:24,uuid:"C17FCF1F-82BD-4883-84A1-E2B3053E4C8F"}
 */
function logDebug(msg) {
    application.output(msg, LOGGINGLEVEL.DEBUG);
}

/**
 * Wrapper for future logging functionality.
 * For now simply uses application.output
 * @private
 * @param {String} msg
 *
 * @properties={typeid:24,uuid:"13D3C8BD-2F79-4C48-B960-8DB7C29CD9F5"}
 */
function logInfo(msg) {
    application.output(msg, LOGGINGLEVEL.INFO);
}

/**
 * Wrapper for future logging functionality.
 * For now simply uses application.output
 * @private
 * @param {String} msg
 *
 * @properties={typeid:24,uuid:"40A40876-8E5A-4CE1-988F-4A1A98AAFFC0"}
 */
function logWarning(msg) {
    application.output(msg, LOGGINGLEVEL.WARNING);
}

/**
 * Wrapper for future logging functionality.
 * For now simply uses application.output
 * @private
 * @param {String} msg
 *
 * @properties={typeid:24,uuid:"F0C92AA6-8F78-4B73-A31E-3204F0AF5F80"}
 */
function logError(msg) {
    application.output(msg, LOGGINGLEVEL.ERROR);
}

/**
 * Use this method to change the behavior of the svySecurity module with respect
 * to DB transactions.
 *
 * If the flag is set to false (default) then when saving or deleting security-related records
 * if an external DB transaction is detected the operation will fail.
 * If the flag is set to true then when saving or deleting security-related records the
 * module will start/commit a DB transaction only if an external DB transaction
 * is not detected. On exceptions any DB transaction will be rolled back
 * regardless if it is started internally or externally (exceptions will be propagated
 * to the external transaction so callers will be able to react on them accordingly)
 *
 * @note If using external DB transactions then callers are responsible for refreshing
 * the state of security-related objects upon transaction rollbacks which occur after
 * successful calls to the svySecurity API.
 *
 * @public 
 * @param {Boolean} mustSupportExternalTransactions The value for the supportExternalDBTransaction flag to set.
 *
 * @properties={typeid:24,uuid:"0447F6A2-6A4C-4691-8981-F573ECF029DE"}
 */
function changeExternalDBTransactionSupportFlag(mustSupportExternalTransactions) {
    supportExternalDBTransaction = mustSupportExternalTransactions;
}

/**
 * @private
 * @param {String} name the name to validate
 * @param {Number} maxLength the max length allowed for the name; default=50
 * @return {Boolean}
 * @properties={typeid:24,uuid:"1E5103A1-3DB0-4071-B82B-73B463062619"}
 */
function nameLengthIsValid(name, maxLength) {
    if (!maxLength) {
        maxLength = 50;
    }
    if (name && name.length <= maxLength) {
        return true;
    }
    return false;
}

/**
 * Adds the necessary search criteria for active sessions to the WHERE clause of the provided QBSelect
 * @private 
 * @param {QBSelect<db:/svy_security/sessions>|QBSelect<tenants_to_sessions>|QBSelect<users_to_sessions>} qbSelect
 *
 * @properties={typeid:24,uuid:"9100D50E-8FC1-4466-9E94-3730E6B18783"}
 */
function addActiveSessionSearchCriteria(qbSelect) {
	
	// GET ACTIVE CLIENT IDS
	var activeClientIDs = [];
	var clients = plugins.clientmanager.getConnectedClients();
	for(var i in clients){
		var client = clients[i];
		activeClientIDs.push(client.getClientID());
	}
	
	// SELECT IN [...CLIENT IDS]
	qbSelect.where.add(qbSelect.columns.servoy_client_id.isin(activeClientIDs));
    
//    var expiration = application.getServerTimeStamp();
//    expiration.setTime(expiration.getTime() - SESSION_TIMEOUT); // i.e 1 min in the past
//    var andActiveCriteria = qbSelect.and;
//    andActiveCriteria.add(qbSelect.columns.session_end.isNull).add(qbSelect.columns.last_client_ping.gt(expiration));
//    qbSelect.where.add(andActiveCriteria);
}

/**
 * Gets the version of this module
 * @public 
 * @return {String} the version of the module using the format Major.Minor.Revision
 * @properties={typeid:24,uuid:"D9AFB31E-2B51-43A7-98AC-29F3D12BB22E"}
 */
function getVersion() {
    return application.getVersionInfo()['svySecurity'];
}

/**
 * If no tenants exist, create a tenant, user and role with permission
 * Tenantname: tenant
 * Username: user
 * Password: pass
 * Role: Administrators
 * Permissions: Administrators
 * 
 * @private
 * @properties={typeid:24,uuid:"B34BC0F8-6792-4AD1-BD36-9E616C790B81"}
 */
function createSampleData(){
	if (!getTenants().length) {
		logInfo('No security data found. Default data will be created');
		var tenant = createTenant(DEFAULT_TENANT);
		var user = tenant.createUser(DEFAULT_TENANT);
		user.setPassword(DEFAULT_TENANT);
		var role = tenant.createRole(DEFAULT_TENANT);
		user.addRole(role);
		
		// check if there are permissions
		var permissions = getPermissions();
		if (!permissions.length) {
			logInfo('No permission data found. Permissions will be synced');
			syncPermissions();
			permissions = getPermissions();
		}
		
		// assign default permission
		var permission = getPermissions()[0];
		if (permission) {
			role.addPermission(permission);
		} else {
			role.addPermission("Administrators")
			logInfo('No permission data found. Administrator permission will be assigned as default permission')
		}
	}
}

/**
 * Record after-insert trigger.
 * Adds this role to all slaves
 *
 * @param {JSRecord<db:/svy_security/roles>} record record that is inserted
 * @protected 
 *
 * @properties={typeid:24,uuid:"17106233-8761-463C-ABDB-6F8ED312DFA5"}
 */
function afterRecordInsert_role(record) {
	var loggedTenant = getTenant();
	if (loggedTenant && loggedTenant.isMasterTenant()) {
		logWarning("You are creating a role while you are logged in as an user of a master tenant");
	}
	if (loggedTenant && loggedTenant.isSlaveTenant()) {
		logWarning("You are creating a role while you are logged in as an user of a slave tenant");
	}
	
	if (utils.hasRecords(record.roles_to_tenants) && utils.hasRecords(record.roles_to_tenants.tenants_to_tenants$slaves)) {
		//propagate insert to all slaves
		for (var i = 1; i <= record.roles_to_tenants.tenants_to_tenants$slaves.getSize(); i++) {
			var recordSlave = record.roles_to_tenants.tenants_to_tenants$slaves.getRecord(i);
			
			var recordRoleSlave;
			var roleFound = false;
			for (var r = 1; r <= recordSlave.tenants_to_roles.getSize(); r++) {
				recordRoleSlave = recordSlave.tenants_to_roles.getRecord(r);
				if (recordRoleSlave.role_name === record.role_name) {
					roleFound = true;
					break;
				}
			}
			
			if (roleFound === true) {
				continue;
			}
			
			recordRoleSlave = recordSlave.tenants_to_roles.getRecord(recordSlave.tenants_to_roles.newRecord());
			//copy fields to not miss values in case columns are added in the future
			databaseManager.copyMatchingFields(record, recordRoleSlave, ['tenant_name']);
			databaseManager.saveData(recordRoleSlave);
		}
	}
}

/**
 * Record after-update trigger.
 * Removes this role from all slaves.
 *
 * @param {JSRecord<db:/svy_security/roles>} record record that is updated
 * @protected 
 *
 * @properties={typeid:24,uuid:"90523996-D26E-4296-B97E-8B911FE4A4C7"}
 */
function afterRecordUpdate_role(record) {
	var loggedTenant = getTenant();
	if (loggedTenant && loggedTenant.isMasterTenant()) {
		logWarning("You are updating a role while you are logged in as an user of a master tenant");
	}
	if (loggedTenant && loggedTenant.isSlaveTenant()) {
		logWarning("You are updating a role while you are logged in as an user of a slave tenant");
	}
	
	
	if (utils.hasRecords(record.roles_to_tenants) && utils.hasRecords(record.roles_to_tenants.tenants_to_tenants$slaves)) {
		//propagate update to all slaves
		for (var i = 1; i <= record.roles_to_tenants.tenants_to_tenants$slaves.getSize(); i++) {
			var recordSlave = record.roles_to_tenants.tenants_to_tenants$slaves.getRecord(i);
			
			for (var r = 1; r <= recordSlave.tenants_to_roles.getSize(); r++) {
				var recordRoleSlave = recordSlave.tenants_to_roles.getRecord(r);
				if (recordRoleSlave.role_name === record.role_name) {
					databaseManager.copyMatchingFields(record, recordRoleSlave, ['tenant_name']);					
					databaseManager.saveData(recordRoleSlave);
					break;
				}
			}
		}
	}
}

/**
 * Record after-insert trigger.
 * Adds this permission to the role on all slaves.
 *
 * @param {JSRecord<db:/svy_security/roles_permissions>} record record that is inserted
 * @protected 
 *
 * @properties={typeid:24,uuid:"6A602687-ACF0-4F04-B0D6-8D5762FEF65E"}
 */
function afterRecordInsert_role_permission(record) {
	var loggedTenant = getTenant();
	if (loggedTenant && loggedTenant.isMasterTenant()) {
		logWarning("You are granting a permission to a role while you are logged in as an user of a master tenant");
	}
	if (loggedTenant && loggedTenant.isSlaveTenant()) {
		logWarning("You are granting a permission to a role while you are logged in as an user of a slave tenant");
	}
	
	if (utils.hasRecords(record.roles_permissions_to_tenants) && utils.hasRecords(record.roles_permissions_to_tenants.tenants_to_tenants$slaves)) {
		//propagate insert to all slaves
		for (var i = 1; i <= record.roles_permissions_to_tenants.tenants_to_tenants$slaves.getSize(); i++) {
			var recordSlave = record.roles_permissions_to_tenants.tenants_to_tenants$slaves.getRecord(i);
			
			var recordRolePermissionSlave,
				recordRoleSlave,
				roleFound = false,
				permissionFound;
			for (var r = 1; r <= recordSlave.tenants_to_roles.getSize(); r++) {
				recordRoleSlave = recordSlave.tenants_to_roles.getRecord(r);
				if (recordRoleSlave.role_name === record.role_name) {
					roleFound = true;
					permissionFound = false;
					for (var p = 1; p <= recordRoleSlave.roles_to_roles_permissions.getSize(); p++) {
						recordRolePermissionSlave = recordRoleSlave.roles_to_roles_permissions.getRecord(p);
						if (recordRolePermissionSlave.permission_name === record.permission_name) {
							logDebug('Slave ' + recordSlave.tenant_name + ' already has a permission ' + record.permission_name + ' granted to role ' + record.role_name);
							permissionFound = true;
							break;
						}
					}
					break;
				}
			}
			
			if (roleFound && !permissionFound) {
				recordRolePermissionSlave = recordRoleSlave.roles_to_roles_permissions.getRecord(recordRoleSlave.roles_to_roles_permissions.newRecord());
				//copy fields to not miss values in case columns are added in the future
				databaseManager.copyMatchingFields(record, recordRolePermissionSlave, ['tenant_name']);
				databaseManager.saveData(recordRolePermissionSlave);
			} else if (!roleFound) {
				logDebug('Slave ' + recordSlave.tenant_name + ' has no role ' + record.role_name + ' to which permission ' + record.permission_name + ' could be granted');
			}
		}
	}
}

/**
 * Record after-delete trigger.
 * Removes this role from all slaves
 *
 * @param {JSRecord<db:/svy_security/roles>} record record that is deleted
 * @protected 
 *
 * @properties={typeid:24,uuid:"AC038DA1-1E18-4116-8922-E2B7FD079374"}
 */
function afterRecordDelete_role(record) {
	var loggedTenant = getTenant();
	if (loggedTenant && loggedTenant.isMasterTenant()) {
		logWarning("You are deleting a role while you are logged in as an user of a master tenant");
	}
	if (loggedTenant && loggedTenant.isSlaveTenant()) {
		logWarning("You are deleting a role while you are logged in as an user of a slave tenant");
	}
	
	if (utils.hasRecords(record.roles_to_tenants) && utils.hasRecords(record.roles_to_tenants.tenants_to_tenants$slaves)) {
		//propagate delete to all slaves
		for (var i = 1; i <= record.roles_to_tenants.tenants_to_tenants$slaves.getSize(); i++) {
			var recordSlave = record.roles_to_tenants.tenants_to_tenants$slaves.getRecord(i);
			
			for (var r = 1; r <= recordSlave.tenants_to_roles.getSize(); r++) {
				var recordRoleSlave = recordSlave.tenants_to_roles.getRecord(r);
				if (recordRoleSlave.role_name === record.role_name) {
					recordSlave.tenants_to_roles.deleteRecord(r)
					break;
				}
			}
		}
	}
}

/**
 * Record after-delete trigger.
 * Removes this permission from all slaves
 *
 * @param {JSRecord<db:/svy_security/roles_permissions>} record record that is deleted
 * @protected 
 *
 * @properties={typeid:24,uuid:"094D2472-04CC-4555-8BCD-CE55D18BE397"}
 */
function afterRecordDelete_roles_permissions(record) {
	var loggedTenant = getTenant();
	if (loggedTenant && loggedTenant.isMasterTenant()) {
		logWarning("You are removing permission from role while you are logged in as an user of a master tenant");
	}
	if (loggedTenant && loggedTenant.isSlaveTenant()) {
		logWarning("You are removing permission from role while you are logged in as an user of a slave tenant");
	}
	
	if (utils.hasRecords(record.roles_permissions_to_tenants) && utils.hasRecords(record.roles_permissions_to_tenants.tenants_to_tenants$slaves)) {
		//propagate delete to all slaves
		for (var i = 1; i <= record.roles_permissions_to_tenants.tenants_to_tenants$slaves.getSize(); i++) {
			var recordSlave = record.roles_permissions_to_tenants.tenants_to_tenants$slaves.getRecord(i);
			
			var recordRolePermissionSlave,
				recordRoleSlave;
			for (var r = 1; r <= recordSlave.tenants_to_roles.getSize(); r++) {
				recordRoleSlave = recordSlave.tenants_to_roles.getRecord(r);
				if (recordRoleSlave.role_name === record.role_name) {
					for (var p = 1; p <= recordRoleSlave.roles_to_roles_permissions.getSize(); p++) {
						recordRolePermissionSlave = recordRoleSlave.roles_to_roles_permissions.getRecord(p);
						if (recordRolePermissionSlave.permission_name === record.permission_name) {
							recordRoleSlave.roles_to_roles_permissions.deleteRecord(p)
							break;
						}
					}
				}
			}
		}
	}
}

/**
 * @protected 
 * Record after-delete trigger.
 * Clears the master_tenant_name from all slaves or replace it with the master of the tenant that is deleted.
 *
 * @param {JSRecord<db:/svy_security/tenants>} record record that is deleted
 *
 * @properties={typeid:24,uuid:"FA620835-B83C-4F75-B5BC-0A83EBE50D87"}
 */
function afterRecordDelete_tenant(record) {
	var loggedTenant = getTenant();
	if (loggedTenant) {
		logWarning("You are deleting a tenant while you are logged in as an user.");
	}
	
	// TODO should also check if i can delete any tenant while logged in !?
	
	if (utils.hasRecords(record.tenants_to_tenants$slaves)) {
		//if the tenant to delete itself has a master, set that on all slaves
		var masterTenantName = null;
		if (utils.hasRecords(record.tenants_to_tenants$master)) {
			masterTenantName = record.tenants_to_tenants$master.tenant_name;
		}
		for (var s = 1; s <= record.tenants_to_tenants$slaves.getSize(); s++) {
			var recordSlave = record.tenants_to_tenants$slaves.getRecord(s);
			recordSlave.master_tenant_name = masterTenantName;
		}
		databaseManager.saveData(record.tenants_to_tenants$slaves);
	}
}

/**
 * @private 
 * @return {Boolean}
 * @properties={typeid:24,uuid:"84E4C3B3-806D-4109-9DBB-37895F94B402"}
 */
function getAutoSyncPermissionsEnabled() {
	var result = application.getUserProperty(USER_PROPERTIES.AUTO_SYNC_PERMISSIONS_WHEN_DEPLOYED);
	return result != "false" ? true : false;
}

/**
 * Initializes the module.
 * NOTE: This var must remain at the BOTTOM of the file.
 * @private
 * @SuppressWarnings (unused)
 * @properties={typeid:35,uuid:"9C3DE1BE-A17E-4380-AB9F-09500C26514F",variableType:-4}
 */
var init = function() {	
	if (application.isInDeveloper()) {
		syncPermissions();
	} else if (getAutoSyncPermissionsEnabled()) {
		
		// auto sync permission
		syncPermissions();

		var msg = "Security permissions are synchronized at every user login for the deployed solution.\n\
		Such default behavior is setup to facilitate your testing and your first deployment, however synchronizing permissions at every login can impact the perfomances of your solution.\n\
		Is recommended to use a postImportHook module running scopes.svySecurity.syncPermissions() to synchronize permissions at every deployement instead and disable auto-sync for every login.\n\
		Auto-sync can be disabled by setting the user property " + USER_PROPERTIES.AUTO_SYNC_PERMISSIONS_WHEN_DEPLOYED + "=false";
		logWarning(msg);
	}
	createSampleData();
    scopes.svySecurityBatch.startBatch();
}();
