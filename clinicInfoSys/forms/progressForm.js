
/**
 * @param {JSEvent} event
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"200CB18E-4349-419C-A9AA-2E648C98F42D"}
 */
function onAction(event) {
	// TODO Auto-generated method stub
	elements.progressbar.setProgress(0);
	application.sleep(1000);
	for (var i = 1; i <= 100; i++){
		elements.progressbar.setProgress(i);
		application.sleep(100);
	}

}
