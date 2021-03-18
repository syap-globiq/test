/**
 * @public
 * @param {scopes.svySecurity.User} user
 * @return {Boolean}
 *
 * @properties={typeid:24,uuid:"6BC09BAF-6EA7-440F-BBEE-00032A0B43C7"}
 * @AllowToRunInFind
 */
function sendRegistrationEmail(user) {
	if (user && user.getEmail() && plugins.mail.isValidEmailAddress(user.getEmail())) {
		try {
			
			// TODO enable it to reset password
			var accessToken = user.generateAccessToken(7*24*60*60*1000);
			
			var urlSampleSolution = utils.stringFormat('%1$ssolutions/' + application.getSolutionName() + '/index.html',
				[application.getServerURL()]);
			
			var resetURL = utils.stringFormat(urlSampleSolution + '?a=set-password&token=%2$s',
				[application.getServerURL(), encodeURI(accessToken)]);


			//TODO: Improve email parameters
			var subject = 'Activation mail for svyCloud sample solution';
			var message = '<html>Congratulations, you have been invited to access the Servoy Cloud sample solution.<br/>'
			message += 'Click on <a href=' + urlSampleSolution + '>this link</a> to access your sample solution account.<br/><br/>';
			message += 'Use the following credentials to login into your sample application.<br/>'
			message += '\tYour App ID : ' + user.getTenant().getName() + '.<br/>'
			message += '\tYour User name : ' + user.getUserName() + '.<br/>'
			message += '\tSet your password through the following link: ' + resetURL + '<br/><html>'
			
			if(application.isInDeveloper()){
				application.output(message);
				plugins.dialogs.showInfoDialog('', message)
			}
			else{
				// reset the password only if the email was send succesfully
				if (plugins.mail.sendMail(user.getEmail(), "info@servoy.com", subject, message)) {
					return true;
				}
			}

		} catch (e) {
			application.output(e.message, LOGGINGLEVEL.ERROR);
			return false;
		}
	}

	return false;
}
