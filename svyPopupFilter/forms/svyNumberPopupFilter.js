/**
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"1FDAB7CD-2E1C-4A0E-B48A-5270A7675147"}
 * @override
 */
function onLoad(event) {
	_super.onLoad(event);
	updateUI();
	elements.faClose.imageStyleClass = scopes.svyPopupFilter.STYLING.CLOSE_ICON;
	scopes.svyPopupFilter.applyLocaleStrings(controller.getName(), 'svyNumberPopupFilter');
}

/**
 * @protected 
 * @param firstShow
 * @param event
 *
 * @properties={typeid:24,uuid:"E20DFB62-7543-43D9-B286-EAE20058A031"}
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
 * @properties={typeid:24,uuid:"F928B519-7FE3-45DC-A5A4-3CE1F8D0945B"}
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
 * @properties={typeid:24,uuid:"826402C7-E82F-450F-AA53-065F3010F6FB"}
 */
function onActionToggleEqualTo(event) {
	toggleOperator(scopes.svyPopupFilter.OPERATOR.EQUALS);
}

/**
 * @param {JSEvent} event
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"5742086A-6023-4D71-807C-5764C6984519"}
 */
function onActionToggleBiggerThen(event) {
	toggleOperator(scopes.svyPopupFilter.OPERATOR.GREATER_THEN);
}

/**
 * @param {JSEvent} event
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"2B9B6314-E227-482B-BB1D-E47D89D93AF6"}
 */
function onActionToggleSmallerThen(event) {
	toggleOperator(scopes.svyPopupFilter.OPERATOR.SMALLER_THEN);
}

/**
 * @param {JSEvent} event
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"660BF5E2-956E-4637-8522-8B9B020DBE7C"}
 */
function onActionToggleBetween(event) {
	toggleOperator(scopes.svyPopupFilter.OPERATOR.BETWEEN);
}

/**
 * @protected 
 * @param {RuntimeWebComponent<bootstrapcomponents-label>} element
 *
 * @properties={typeid:24,uuid:"48A21376-C5A9-4035-AB92-6CCD31896C0D"}
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
 * @properties={typeid:24,uuid:"05318382-7231-48C9-9F63-E1BDB095281C"}
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
 * @properties={typeid:24,uuid:"0F223D2E-2293-4D7F-A3FE-3508E1761285"}
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
