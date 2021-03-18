/**
 * @properties={type:8,typeid:36,uuid:"3C219EDC-754B-4657-9C66-20C465BB106E"}
 */
function subtotal() {
 	var amt = quantity * unitprice * (1-discount);
 	return parseFloat(amt.toFixed(2));
 }
