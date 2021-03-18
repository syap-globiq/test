/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"F75353CC-9485-4B79-82A5-82A230716775"}
 */
var searchText = null;

/**
 * @protected 
 * @param event
 *
 * @properties={typeid:24,uuid:"77598B3B-21D1-4B82-ACFD-84560EE97FA8"}
 * @override
 */
function onLoad(event) {
	elements.listTags.entryRendererFunction = renderFilterEntry();
	
	_super.onLoad(event);
	elements.faClose.imageStyleClass = scopes.svyPopupFilter.STYLING.CLOSE_ICON;
	elements.iconRemoveAll.imageStyleClass = scopes.svyPopupFilter.STYLING.REMOVE_ICON;
	
	scopes.svyPopupFilter.applyLocaleStrings(controller.getName(), 'svyTokenPopupFilter');
}

/**
 * @protected 
 * @param firstShow
 * @param event
 *
 * @properties={typeid:24,uuid:"D9DA9D2A-F16E-469F-A19A-7625D3798EC5"}
 * @override
 */
function onShow(firstShow,event) {
	
	_super.onShow(firstShow,event);
	
	elements.listTags.clear();
	for (var i = 0; i < values.length; i++) {
		var tag = elements.listTags.newEntry();
		tag.text = values[i];
	}
}

/**
 * @protected 
 * @param selectedValues
 *
 * @properties={typeid:24,uuid:"9F26FAEA-39F7-41B5-80D8-7C2117A36A2E"}
 * @override
 */
function setSelectedFilterValues(selectedValues) {
	_super.setSelectedFilterValues(selectedValues);
}

/**
 * @protected
 * @return {String}
 * @properties={typeid:24,uuid:"41DCC810-7BC6-4D8F-BD4B-251DA79704E2"}
 */
function renderFilterEntry() {
	return "(function renderFilterEntry(entry) {  \n\
		var entryText = entry.text;\n\
		\n\
		if (!(entryText instanceof String)) {\n\
			entryText = entryText.toString();\n\
		}\n\
		\n\
		var isExcluded = false;\n\
		if (entryText.indexOf('!=') === 0) {\n\
			entryText = entryText.substring(2);\n\
			isExcluded = true;\n\
		} else if (entryText.indexOf('!') === 0) {\n\
			entryText = entryText.substring(1);\n\
			isExcluded = true;\n\
		} else if (entryText.indexOf('%!=') === 0) {\n\
			entryText = entryText.substring(3);\n\
			isExcluded = true;\n\
		}\n\
		\n\
		var template = '';\n\
		template += '<div class=\"row\">' + \n\
		'<div class=\"col-md-12 svy-popup-filter-token\">' + \n\
			'<span class=\"" + scopes.svyPopupFilter.STYLING.REMOVE_ICON +" svy-popup-filter-token-icon margin-right-10\" data-target=\"close\"></span>' + \n\
			'<span class=\"' + (isExcluded ? '" + scopes.svyPopupFilter.STYLING.EXCLUDE_ICON +"' : '" + scopes.svyPopupFilter.STYLING.INCLUDE_ICON +"') + ' svy-popup-filter-token-icon' + (isExcluded ? ' text-warning' : ' text-success') + '\" data-target=\"exclude\"></span>' +\n\
			'<span class=\"svy-popup-filter-token-text\">' + \n\
				entryText + \n\
			'</span>' +\n\
		'</div>' + \n\
		'</div>';\n\
		\n\
		return template;\n\
	})";
}

/**
 * @param {JSEvent} event
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"BE24F6EF-5DD7-4EB6-9AC9-305215A865DA"}
 */
function onActionSearchText(event) {
	addTag(searchText);
}

/**
 * @param oldValue
 * @param newValue
 * @param {JSEvent} event
 *
 * @return {boolean}
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"8663257D-6939-43F4-A748-873F81D0D52B"}
 */
function onDataChange(oldValue, newValue, event) {
	addTag(searchText);
	return true
}

/**
 * Called when the mouse is clicked on a list entry.
 *
 * @param {{text: String}} entry
 * @param {Number} index
 * @param {string} dataTarget
 * @param {JSEvent} event
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"A67A8863-8ACB-48BF-BDC1-0F65B9F0C566"}
 */
function onClick(entry, index, dataTarget, event) {
	if (dataTarget === "close") {
		removeTag(entry.text, index);
	} else if (dataTarget === "exclude") {
		toggleExcludeTag(entry.text, index);
	}
}

/**
 * @param {JSEvent} event
 * @param {string} dataTarget
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"69A13409-C425-4D4D-ADF9-29148E922AF0"}
 */
function onActionRemoveAll(event, dataTarget) {
	clear();
}

/**
 * @protected
 * @properties={typeid:24,uuid:"9FEBB97F-A251-4EA3-8C33-D9A5FBFD9E53"}
 */
function clear() {
	values = [];
	elements.listTags.clear();
}

/**
 * @protected 
 * @param text
 *
 * @properties={typeid:24,uuid:"B8552CF6-0A2A-49D2-BCFF-C4B3EFCE6EF7"}
 */
function addTag(text) {
	if (!text && text != "0") return;
	
	if (text.indexOf('-') === 0) {
		//exclude
		text = text.substring(1);
		if (operator === scopes.svyPopupFilter.OPERATOR.IS_IN) {
			text = '!' + text;
		} else if (operator === scopes.svyPopupFilter.OPERATOR.LIKE) {
			text = '!=' + text;
		} else if (operator === scopes.svyPopupFilter.OPERATOR.LIKE_CONTAINS) {
			text = '%!=' + text;
		}
	}
	
	if (values.indexOf(text) == -1) {
		values.push(text);
		var tag = elements.listTags.newEntry();
		tag.text = text;
		
		searchText = null;
	} else {
		// do nothing
	}
}

/**
 * @protected 
 * @param {String} text
 * @param {Number} index
 *
 * @properties={typeid:24,uuid:"1E39D48A-7276-498F-B958-274E7CDCBDC5"}
 */
function removeTag(text, index) {
	if (!text && text != "0") return;
	var indexOfText = values.indexOf(text)
	if (indexOfText > -1) {
		values.splice(indexOfText,1);
		elements.listTags.removeEntry(index);
	} else {
		// do nothing
	}
}

/**
 * @protected 
 * @param {String} text
 * @param {Number} index
 *
 * @properties={typeid:24,uuid:"D4A4AA8C-98E8-40AA-9B21-F7195A1D4BCA"}
 */
function toggleExcludeTag(text, index) {
	/** @type {String} */
	var valueEntry = values[index];
	if (operator === scopes.svyPopupFilter.OPERATOR.LIKE) {
		//not like
		if (valueEntry.indexOf("!=") === 0) {
			values[index] = valueEntry.replace("!=", "");
		} else {
			values[index] = "!=" + values[index];			
		}
	} else if (operator === scopes.svyPopupFilter.OPERATOR.LIKE_CONTAINS) {
		//not like contains
		if (valueEntry.indexOf("%!=") === 0) {
			values[index] = valueEntry.replace("%!=", "");
		} else {
			values[index] = "%!=" + values[index];			
		}
	} else if (operator === scopes.svyPopupFilter.OPERATOR.IS_IN) {
		//not
		if (valueEntry.indexOf("!") === 0) {
			values[index] = valueEntry.replace("!", "");
		} else {
			values[index] = "!" + values[index];			
		}
	}
	
	elements.listTags.clear();
	for (var i = 0; i < values.length; i++) {
		var tag = elements.listTags.newEntry();
		tag.text = values[i];
	}
}
