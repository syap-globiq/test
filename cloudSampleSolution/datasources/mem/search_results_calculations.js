/**
 * @properties={type:12,typeid:36,uuid:"107910EE-0B2A-4B94-B969-F689354F99C1"}
 */
function iconStyleClass() {
	switch (table_name) {
	case "customers":
		return "icon-contacts";
		break;
	case "orders":
		return "icon-box";
		break;
	default:
		return "fas fa-question"
		break;
	}
}
