/**
 * @param {JSEvent} event
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"500A0286-3A91-4C29-956E-EF0397468FEA"}
 */
function onActionAddProducts(event) {
	var lookupObj = scopes.svyLookup.createLookup(datasources.db.example_data.products.getDataSource());
	lookupObj.setMultiSelect(true);
	//lookupObj.setLookupForm(forms.multiLookup);
	
	// add fields
	lookupObj.addField('productname').setTitleText('Product');
	lookupObj.addField('products_to_suppliers.companyname').setTitleText('Supplier');
	lookupObj.addField('unitprice')
		.setSearchable(false)
		.setTitleText('Price')
		.setFormat('#,###.00')
			
	// show pop-up
	lookupObj.showPopUp(onSelect, elements.btnNewProduct, controller.getFormWidth()/2, 412);
}

/**
 * @param {Array<JSRecord<db:/example_data/products>>} record
 * @param {Array} values
 * @param {scopes.svyLookup.Lookup} lookup
 *
 * @properties={typeid:24,uuid:"0377551C-255C-4472-9E57-02B9A1CC2323"}
 */
function onSelect(record, values, lookup){
	if (values && values.length) {
		foundset.productid = values[0];
	}
	
	if(record){
		record.forEach(function(rec){
			
			if(foundset.selectRecord(foundset.orderid,rec.productid)) {
				// increase quantity if product already in order
				foundset.quantity = foundset.quantity + 1;
			} else {
				// create a new order line for each product selected in lookup
				var newRec = foundset.getRecord(foundset.newRecord())
				newRec.discount = 0;
				newRec.quantity = 1;
				newRec.unitprice = rec.unitprice;
				newRec.productid = rec.productid;
			}
		})
	}
}

/**
 * Called when the mouse is clicked on a row/cell (foundset and column indexes are given).
 * the foundsetindex is always -1 when there are grouped rows
 * the record is not an actual JSRecord but an object having the dataprovider values of the clicked record
 *
 * @param {Number} foundsetindex
 * @param {Number} [columnindex]
 * @param {object} [record]
 * @param {JSEvent} [event]
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"3124C6A0-201B-46B3-A116-A52068CBFB53"}
 */
function onCellClick(foundsetindex, columnindex, record, event) {
	var column = elements.table.getColumn(columnindex);
	switch (column.id) {
	case "plus":
		foundset.quantity = foundset.quantity ? foundset.quantity + 1 : 1;
		break;
	case "minus":
		foundset.quantity = foundset.quantity ? foundset.quantity - 1 : 0;
		break;
	case "delete":
		deleteRecord();
		break;

	default:
		break;
	}
}

/**
 * @protected 
 * @properties={typeid:24,uuid:"C3064B31-059B-4895-933E-F2A334C0AD79"}
 */
function deleteRecord() {
	foundset.deleteRecord();
}
