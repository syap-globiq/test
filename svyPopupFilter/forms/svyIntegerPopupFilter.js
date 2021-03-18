/**
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"934D4D48-B378-41FF-8CF7-A4D336CC187D"}
 * @override
 */
function onLoad(event) {
	_super.onLoad(event);
	updateUI();
	elements.faClose.imageStyleClass = scopes.svyPopupFilter.STYLING.CLOSE_ICON;
	scopes.svyPopupFilter.applyLocaleStrings(controller.getName(), 'svyIntegerPopupFilter')
}

/**
 * @protected 
 * @param firstShow
 * @param event
 *
 * @properties={typeid:24,uuid:"0D79E880-F8C6-487A-919D-7F5A4AF03DDA"}
 * @override
 */
function onShow(firstShow,event) {
	if (filter && filter.getText()) {
		elements.labelTitle.text = filter.getText();
	}
	_super.onShow(firstShow,event);
}

/**
 * @param {String} newOperator
 *
 * @properties={typeid:24,uuid:"C839B489-0F22-429C-8A5C-1CD831CB6BE4"}
 */
function toggleOperator(newOperator) {
	operator = newOperator;
	updateUI();
}

/**
 * @param {JSEvent} event
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"B49188B2-9D0E-4869-B180-981C052E07E9"}
 */
function onActionToggleEqualTo(event) {
	toggleOperator(scopes.svyPopupFilter.OPERATOR.EQUALS);
}

/**
 * @param {JSEvent} event
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"F5A1708D-5C2B-468F-855D-7C844778500B"}
 */
function onActionToggleBiggerThen(event) {
	toggleOperator(scopes.svyPopupFilter.OPERATOR.GREATER_THEN);
}

/**
 * @param {JSEvent} event
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"6B62C61B-B44E-43BA-9740-FD48A2F8D737"}
 */
function onActionToggleSmallerThen(event) {
	toggleOperator(scopes.svyPopupFilter.OPERATOR.SMALLER_THEN);
}

/**
 * @param {JSEvent} event
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"D254C591-5491-46F4-BC4F-13D47B28E826"}
 */
function onActionToggleBetween(event) {
	toggleOperator(scopes.svyPopupFilter.OPERATOR.BETWEEN);
}

/**
 * @protected 
 * @param {RuntimeWebComponent<bootstrapcomponents-label>} element
 *
 * @properties={typeid:24,uuid:"24EDBA5E-5CE5-4975-A584-25CC47D235E0"}
 */
function setIconUnselected(element) {
	element.removeStyleClass('fa-dot-circle');
	if(!element.hasStyleClass('fa-circle-o')) {
		element.addStyleClass('fa-circle-o');
	}
	element.removeStyleClass('text-primary');
	if(!element.hasStyleClass('text-tertiary')) {
		element.addStyleClass('text-tertiary');
	}
}

/**
 * @protected 
 * @param {RuntimeWebComponent<bootstrapcomponents-label>} element
 * 
 * @properties={typeid:24,uuid:"DF5B1D2E-C0E3-4982-806B-DFC0185BE237"}
 */
function setIconSelected(element) {
	element.removeStyleClass('fa-circle-o');
	if(!element.hasStyleClass('fa-dot-circle')) {
		element.addStyleClass('fa-dot-circle');
	}
	element.removeStyleClass('text-tertiary');
	if(!element.hasStyleClass('text-primary')) {
		element.addStyleClass('text-primary');
	}
}

/**
 * @protected
 * @properties={typeid:24,uuid:"A6EE23A1-056D-4B86-B1F2-DD81B2A55634"}
 */
function updateUI() {
	elements.labelEqualTo.addStyleClass("text-tertiary");
	setIconUnselected(elements.iconEqualTo);
	elements.textboxEqualTo.enabled = false;

	elements.labelGreater.addStyleClass("text-tertiary");
	setIconUnselected(elements.iconGreater);
	elements.textboxGreater.enabled = false;

	elements.labelSmaller.addStyleClass("text-tertiary");
	setIconUnselected(elements.iconSmaller);
	elements.textboxSmaller.enabled = false;

	elements.labelBetween.addStyleClass("text-tertiary");
	setIconUnselected(elements.iconBetween);
	elements.textboxBetweenMin.enabled = false;
	elements.textboxBetweenMax.enabled = false;

	switch (operator) {
	case scopes.svyPopupFilter.OPERATOR.EQUALS:
		elements.labelEqualTo.removeStyleClass("text-tertiary");
		setIconSelected(elements.iconEqualTo);
		elements.textboxEqualTo.enabled = true;
		break;
	case scopes.svyPopupFilter.OPERATOR.BETWEEN:
		elements.labelBetween.removeStyleClass("text-tertiary");
		setIconSelected(elements.iconBetween);
		elements.textboxBetweenMin.enabled = true;
		elements.textboxBetweenMax.enabled = true;
		break;
	case scopes.svyPopupFilter.OPERATOR.GREATER_THEN:
		elements.labelGreater.removeStyleClass("text-tertiary");
		setIconSelected(elements.iconGreater);
		elements.textboxGreater.enabled = true;
		break;
	case scopes.svyPopupFilter.OPERATOR.SMALLER_THEN:
		elements.labelSmaller.removeStyleClass("text-tertiary");
		setIconSelected(elements.iconSmaller);
		elements.textboxSmaller.enabled = true;
		break;
	default:
		break;
	}
}
