/**
 * @properties={typeid:35,uuid:"EF4077AE-FB96-40B7-8826-9AEAC0BD0AF2",variableType:-4}
 */
var products = [];

/**
 * @properties={typeid:35,uuid:"967DB5B5-0783-4615-A371-F67E6F8C4E28",variableType:-4}
 */
var customerAmounts = [];

/**
 * @properties={typeid:35,uuid:"B4F7D662-C9CB-4A69-9985-50539573BDD8",variableType:-4}
 */
var annualAmounts = [];

/**
 * @properties={typeid:35,uuid:"7EC20E6E-385F-4494-AB80-EE1089667B40",variableType:-4}
 */
var years = [];

/**
 * @properties={typeid:35,uuid:"2696DD4E-95DC-45C7-92B9-38FEFA678CA5",variableType:-4}
 */
var colors = [];

/**
 * Callback method when form is (re)loaded.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"4743AEA6-5AA8-4355-ABC6-8C33C7CED89A"}
 */
function onLoad(event) { 
	setColors();
}

/**
 * @param {Boolean} firstShow
 * @param {JSEvent} event
 *
 * @private
 * @override
 *
 * @properties={typeid:24,uuid:"9E900B94-A1DC-4B51-BADC-A24F67B63FE3"}
 */
function onShow(firstShow, event) {
	_super.onShow(firstShow, event);
	
	RenderPieChart();
	
	renderBarChart();
}

/**
 * @properties={typeid:24,uuid:"26191B8E-1F46-48EF-9CBA-41A8716E4F1E"}
 */
function RenderPieChart() {
	setPieChartData();
	
	var data = {
		type: 'doughnut',
		data: {
			labels: products,
			datasets: [{
				data: customerAmounts,
				backgroundColor: colors,

				borderColor: colors,
				tension: 0.3
			}]
		}
	};

	var options = {
		tooltips: {
			enabled: true
		},
		cutoutPercentage: 50,
		title: {
			display: false
		},
		legend: {
			display: false,
			position: 'right'
		}

	};

	elements.chart_1.setData(data);
	elements.chart_1.setOptions(options);

}

/**
 * @properties={typeid:24,uuid:"217D2044-D358-4526-BC97-2FC0362BD9E8"}
 */
function setPieChartData(){
	/**@type {Array}*/
	var result = scopes.modelDashboard.getTopCustomersProducts(foundset.customerid, 5);
	customerAmounts = [];
	products = [];

	for (var index = 0; index < result.length; index++) {
		var val = result[index];
		customerAmounts.push(val[index + 1, 1]);
		products.push(val[index + 1, 0]);
	}
}

/**
 * @properties={typeid:24,uuid:"3ACE7ED6-FCF8-4EE8-87B6-AE0B507438E2"}
 */
function renderBarChart() {
	setBarChartData();
	
	var data = {
		type: 'bar',
		data: {
			labels: years,
			datasets: [{
				data: annualAmounts,
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

	elements.bar_chart.setData(data);
	elements.bar_chart.setOptions(options);
}

/**
 * @properties={typeid:24,uuid:"69305EF9-8F7E-4BBF-BFAD-CBEFAF5E4A09"}
 */
function setBarChartData(){
	/**@type {Array}*/
	var result = scopes.modelDashboard.getSalesOrderByYear(foundset.customerid);
	annualAmounts = [];
	years = [];

	for (var i = 0; i < result.length; i++) {
		var val = result[i];
		annualAmounts.push(val[i + 1, 1]);
		years.push(val[i + 1, 0]);
	}
}

/**
 * @properties={typeid:24,uuid:"64639450-0CDF-447B-A265-FAF43DDA56E8"}
 */
function setColors(){
	colors = ["#9D0952",
	"#F68500",
	"#F6B900",
	"#FFDD33",
	"#5C975D",
	"#5C774C"];
}
