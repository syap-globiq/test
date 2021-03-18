/**
 * @properties={typeid:35,uuid:"93BF043E-6E88-4FAD-AF8E-85B580B84B0C",variableType:-4}
 */
var months = [];

/**
 * @properties={typeid:35,uuid:"13FF7A72-9023-4B5B-851C-86A8AEAF7EEF",variableType:-4}
 */
var amounts = [];

/**
 * @properties={typeid:24,uuid:"6A9102DD-46BC-4AA1-9837-17EE86CA36C8"}
 */
function RenderChart() {
	var colors = ["#9D0952",
		"#F68500",
		"#F6B900",
		"#FFDD33",
		"#5C975D",
		"#5C774C"];

	var data = {
		type: 'bar',
		data: {
			labels: months,
			datasets: [{
				data: amounts,
				backgroundColor: colors,

				borderColor: colors,
				tension: 0.3
			}]
		}
	};

	var options = {
		tooltips: {
			enabled: false
		},
		legend: {
			display: false
		},
		scales: {
			yAxes: [{
				ticks: {
					beginAtZero: true
				},
				scaleLabel: {
					display: true,
					labelString: 'Amount($)'
				}
			}]
		}
	};

	elements.chart_1.setData(data);
	elements.chart_1.setOptions(options);

}

/**
 * Callback method when form is (re)loaded.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"52A43A4E-E6E6-42DD-BF79-3D958C9C4EF1"}
 */
function onLoad(event) {
	/**@type {Array}*/
	var result = scopes.modelDashboard.getSalesLastMonths();
	var monthShortNames = scopes.svyDateUtils.getShortMonthNames();

	for (var index = 0; index < result.length; index++) {
		var val = result[index];
		amounts.push(val[index + 1, 1]);
		var month = val[index + 1, 0];
		var monthName = monthShortNames[month - 1];

		months.push(monthName);

	}

	RenderChart();
}

/**
 * @param {Number} dataset_index
 * @param {Number} index
 * @param {string} label
 * @param {Number} value
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"71DFC481-5290-4232-B0DD-20DC4D46584F"}
 */
function onClickMonth(dataset_index, index, label, value) {

	// retrieve fist and last day of the clicked month
	var monthIndex = scopes.svyDateUtils.getShortMonthNames("en").indexOf(label);
	var monthDate = new Date()
	monthDate.setMonth(monthIndex);
	var startDate = scopes.svyDateUtils.toStartOfDay(scopes.svyDateUtils.getFirstDayOfMonth(monthDate));
	var endDate = scopes.svyDateUtils.toEndOfDay(scopes.svyDateUtils.getLastDayOfMonth(monthDate));

	// navigate to orders table
	var item = new scopes.svyNavigation.NavigationItem("ordersTableView");
	// TODO: can extend the svyNavigation to include filters
	item.setCustomData({ filters: [{ dataprovider: "orderdate", operator: scopes.svyPopupFilter.OPERATOR.BETWEEN, values: [startDate, endDate] }] })

	// open the item
	scopes.svyNavigation.open(item);
}
