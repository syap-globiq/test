/**
 * @properties={typeid:24,uuid:"AC7F796B-C26D-413E-8C79-85CB95C0E8BC"}
 */
function validate()
{
	// TODO Auto-generated method stub
	var markers = [];
	
	if (getSelectedRecord().unitsinstock < 0) {
		markers.push({
			dataProviderID:'unitsinstock',
			message:'Cannot be negative'
		});
	}
	return markers;
}
