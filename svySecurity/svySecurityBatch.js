/**
 * @private 
 * @type {String}
 *
 * @properties={typeid:35,uuid:"F22F523D-E4ED-4571-871B-001E801EBBA6"}
 */
var FLAG_CLEAN_SESSIONS_IN_DEVELOPER = 'cleanSessionsInDeveloper';

/**
 * Job timings: every minute
 * 
 * @private 
 * @type {String}
 *
 * @properties={typeid:35,uuid:"B4E0F70B-1763-41D6-806D-05FFE43E8FAF"}
 */
var BATCH_INTERVAL = '0 0/1 * * * ?';

/**
 * @type {String}
 * @private 
 * @properties={typeid:35,uuid:"8E386A49-AEC8-4B7D-BD19-2F8BCF6E11B9"}
 */
var CLIENT_ID = 'com.servoy.extensions.svy-security.batch';

/**
 * Launches the batch processor in a headless client 
 * @public    
 * @properties={typeid:24,uuid:"C0E3D90A-C0E1-41B2-A20A-6770ACA2CB48"}
 */
function startBatch() {
	var cleanSessionsInDeveloper = application.getUserProperty(FLAG_CLEAN_SESSIONS_IN_DEVELOPER);
	if (application.isInDeveloper() && cleanSessionsInDeveloper === "true") {		
		plugins.headlessclient.getOrCreateClient(CLIENT_ID, 'svySecurity', null, null, []);
	} else if (!application.isInDeveloper()) {
		plugins.headlessclient.getOrCreateClient(CLIENT_ID, 'svySecurity', null, null, []);		
	}
}

/**
 * Schedules the session manager to cleanup abandoned batches
 * Should be called internally and only on startup 1x
 * @private  
 * @properties={typeid:24,uuid:"75CBB9BA-7FA9-45BA-B243-01E86E406DB5"}
 */
function scheduleSessionManager() {
	plugins.scheduler.addCronJob('updateSessions', BATCH_INTERVAL, updateOpenClientSessions);
	application.output('Session cleanup job scheduled', LOGGINGLEVEL.INFO);
}

/**
 * @private 
 * @properties={typeid:24,uuid:"86C7FC9B-DD23-4A1D-AAD3-B0BB2095610B"}
 * @AllowToRunInFind
 */
function updateOpenClientSessions() {

	// Check settings for how to handle abandoned sessions when running developer
	var cleanSessionsInDeveloper = application.getUserProperty(FLAG_CLEAN_SESSIONS_IN_DEVELOPER);
	if (application.isInDeveloper() && cleanSessionsInDeveloper !== "true") {
		application.output('Abandoned sessions will not be cleaned from Servoy Developer. Change setting {user.cleanSessionsInDeveloper=true} in servoy.properties to have them cleaned', LOGGINGLEVEL.DEBUG);
		return;
	}

	// GET IDS FOR ALL CONNECTED CLIENTS
	var clientIDs = [];
	var clients = plugins.clientmanager.getConnectedClients();
	for (var i in clients) {
		clientIDs.push(clients[i].getClientID());
	}

	// FETCH ALL RECORDS W/ NULL END DATE WHICH DO NOT APPEAR IN CLIENT IDS LIST
	var q = datasources.db.svy_security.sessions.createSelect();
	q.result.addPk();
	q.where.add(q.columns.session_end.isNull).add(q.columns.servoy_client_id.not.isin(clientIDs));

	// LOAD INTO A FOUNDSET
	var fs = datasources.db.svy_security.sessions.getFoundSet();
	fs.loadRecords(q);
	var sessionCount = fs.getSize();
	if (!sessionCount) {
		return
	}
	application.output('Found ' + sessionCount + ' abandoned session(s)', LOGGINGLEVEL.INFO);

	// UPDATE SESSIONS
	var now = application.getServerTimeStamp();
	for (var j = 1; j <= fs.getSize(); j++) {
		var session = fs.getRecord(j);
		session.session_end = now;
		session.session_duration = Math.min(Math.max(0, now.getTime() - session.session_start.getTime()), 2147483647);
		if (!databaseManager.saveData(session)) {
			application.output('Failed to update abandoned session: ' + session.servoy_client_id, LOGGINGLEVEL.ERROR);
			continue;
		}
		application.output('Closed abandoned session: ' + session.servoy_client_id, LOGGINGLEVEL.INFO);
	}
}

/**
 * Callback method for when solution is opened.
 * When deeplinking into solutions, the argument part of the deeplink url will be passed in as the first argument
 * All query parameters + the argument of the deeplink url will be passed in as the second argument
 * For more information on deeplinking, see the chapters on the different Clients in the Deployment Guide.
 *
 * @param {String} arg startup argument part of the deeplink url with which the Client was started
 * @param {Object<Array<String>>} queryParams all query parameters of the deeplink url with which the Client was started
 * @private 
 * @properties={typeid:24,uuid:"992E7657-A8B9-487B-9CDB-6753665D62BB"}
 */
function onSolutionOpen(arg, queryParams) {

	// CHECK IF HEADLESS
	if (application.getApplicationType() != APPLICATION_TYPES.HEADLESS_CLIENT) {
		return;
	}

	// SCHEDULE JOB
	scheduleSessionManager();
}
