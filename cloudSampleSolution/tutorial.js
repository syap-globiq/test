/**
 * @private 
 * @type {String}
 *
 * @properties={typeid:35,uuid:"C61537DC-EC33-4C3F-802A-D7ADDA6FC740"}
 */
var urlTutorial = "https://github.com/Servoy/svySampleSolution/wiki/";

/**
 * @enum
 * @public
 * @properties={typeid:35,uuid:"BD0628C9-D4B3-46CC-8BFE-C1B007ACBDF8",variableType:-4}
 */
var TUTORIAL = {
	TUTORIAL_1: "tutorial"
};

/**
 * Show tutorial
 * @param {String} [step] tutorial step; use enum TUTORIAL
 * @public 
 *
 * @properties={typeid:24,uuid:"8201E806-25E5-4C1F-A40F-40DDA36F231B"}
 */
function showTutorial(step) {
	
	if (!step) {
		step = "Tutorial"
	}
	
	var url = urlTutorial + step;
	application.showURL(url, "_blank");
}
