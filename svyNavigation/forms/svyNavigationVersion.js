/**
 * @return {String}
 * @override
 * @properties={typeid:24,uuid:"FA98AD3E-AB4E-4415-8FD9-6CEAB84B7DB7"}
 */
function getId() {
	return 'com.servoy.bap.navigation';
}

/**
 * @return {String}
 * @override
 * @properties={typeid:24,uuid:"55B62A5A-A3D6-4B09-AA72-E763D83A2F58"}
 */
function getVersion() {
	return scopes.svyNavigation.getVersion();
}

/**
 * @return {Array}
 * @properties={typeid:24,uuid:"00E0EAFE-BAC1-4113-977C-A67B5BA47F76"}
 * @override
 */
function getDependencies() {
	return [{id: "com.servoy.bap.utils", minVersion: "1.4.0"}]
}
