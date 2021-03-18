/**
 * Record validation method, will be called by databaseManager.validateRecord() and when databaseManager.saveData() is called.
 * Validate changes or state of the record.
 * All errors need toe be reported in the recordMarkers that is then returned by databaseManager.validateRecord() and is also placed
 * on the record itself (record.recordMarkers)
 *
 * @param {JSRecord<db:/example_data/customers>} record record that must be validated
 * @param {JSRecordMarkers} recordMarkers the object where all the problems can be reported against.
 * @param stateObject an object that a user can give to validateRecord for extra state (optional, can be null).
 *
 * @private
 *
 * @properties={typeid:24,uuid:"DFFF2BFA-96C7-4C03-B4CE-9842B9035C31"}
 */
function onValidate(record, recordMarkers, stateObject) {

	// check if customer id is filled
	if (!record.customerid && validateDataprovider("customerid")) {
		recordMarkers.report("Customer ID is required", "customerid", LOGGINGLEVEL.ERROR);
	} else if (record.isNew() && validateDataprovider("customerid")) {

		// check if id is Unique for new records
		var query = datasources.db.example_data.customers.createSelect();
		query.result.addPk();
		query.where.add(query.columns.customerid.eq(record.customerid));
	
		var result = databaseManager.getDataSetByQuery(query, 1);
		var isUnique = result.getMaxRowIndex() == 0;
	
		if (!isUnique) {
			recordMarkers.report("Entered Customer ID is not unique", "customerid", LOGGINGLEVEL.ERROR);
		} 
	}
	
	// check if companyname id is filled
	if (!record.companyname && validateDataprovider("companyname")) {
		recordMarkers.report("Company Name is required", "companyname", LOGGINGLEVEL.ERROR);
	}
	
	/** 
	 * If dataprovider is specified in stateObject
	 * @private
	 *  */
	function validateDataprovider(dataprovider) {
		if (stateObject) {
			return stateObject == dataprovider;
		}
		return true;
	}
}
