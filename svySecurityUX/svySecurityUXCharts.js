/**
 * @public
 * @param {String} tenantName
 * @param {RuntimeWebComponent<svychartjs-chart>|RuntimeWebComponent<svychartjs-chart_abs>} chart
 *
 * @properties={typeid:24,uuid:"32738348-D594-46AE-8F78-FD6263C40428"}
 */
function createChartTotalTenantUsageOverTimeMonths(tenantName, chart){
    //get total usage for tenant by month for the last X months
    var monthsWindow = 6;
    var curDate = application.getServerTimeStamp();
    var cutOffDate = scopes.svyDateUtils.getFirstDayOfMonth(scopes.svyDateUtils.addMonths(curDate, (-1 * (monthsWindow - 1))));
        
    var yearMonths = new Array(monthsWindow); //will contain 20171, 20172,...201712
    var yearMonthsNames = new Array(monthsWindow); //will contain Jan, Feb, Mar....
    for (var index = 0; index < yearMonths.length; index++) {
        var dt = scopes.svyDateUtils.addMonths(cutOffDate, index);
        yearMonths[index] = utils.stringFormat('%1$.0f%2$.0f',[dt.getFullYear(), (dt.getMonth() + 1)]); /*month in JS is 0-11!*/
        yearMonthsNames[index] = utils.dateFormat(dt,'MMM');        
    }
    
    var qry = datasources.db.svy_security.sessions.createSelect();
    var yearMonthCol = qry.columns.session_start.year.cast(QUERY_COLUMN_TYPES.TYPE_STRING).concat(qry.columns.session_start.month.cast(QUERY_COLUMN_TYPES.TYPE_STRING)); 
    
    //select    
    qry.result.add(yearMonthCol, 'yyyymm');
    qry.result.add(qry.columns.session_duration.sum.divide(3600000), 'usage_hours'); //session_duration is stored in milliseconds so we need to convert it to hours
    
    //group by
    qry.groupBy.add(yearMonthCol);
    
    //where
    qry.where.add(qry.columns.session_start.gt(cutOffDate));
    qry.where.add(qry.columns.tenant_name.eq(tenantName));
    
    //sort
    qry.sort.add(yearMonthCol);
    
    var ds = databaseManager.getDataSetByQuery(qry, monthsWindow);
        
    var dsData = databaseManager.createEmptyDataSet();
    
    for (index = 0; index < yearMonths.length; index++) {
        dsData.addColumn(yearMonths[index].label, index+1, JSColumn.NUMBER);        
    }
    
    //initialize the dsData with 0's for the value columns    
    var rowData = new Array(monthsWindow);
    for (var i = 0; i < monthsWindow; i++){
        rowData[i] = 0;
    }            
    dsData.addRow(rowData);
    
    
    for (index = 1; index <= ds.getMaxRowIndex(); index++) {        
        var row = ds.getRowAsArray(index);
        var valueIndx = yearMonths.indexOf(row[0]);
        var value = row[1];        
        dsData.setValue(1, valueIndx + 1, roundNumber(value, 2));
    }
    
    var colors = getColors(6);
    var chartDatasets = [{
            label: utils.stringFormat('Usage over time for tenant "%1$s"',[tenantName]),
            fill: true,
            data: dsData.getRowAsArray(1),
            borderColor: colors[5],            
            pointBorderColor: colors[5],
            pointBackgroundColor: colors[5],
            pointBorderWidth: 1,
            pointHoverRadius: 3,
            pointHoverBackgroundColor: colors[5],
            pointHoverBorderColor: 'orange',
            pointHoverBorderWidth: 2,
            tension: 0.3
        }];
    
    
    var data = {
        type: 'line',
        data: {
            labels: yearMonthsNames,
            datasets: chartDatasets
        }
    };
    
    var options = {
        title: {
            display: true,
            text: utils.stringFormat('Usage for last %1$.0f months by users of tenant %2$s', [monthsWindow, tenantName])
        },
        legend: {
            display: false,
            position: 'right'
        },
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                },
                scaleLabel: {
                    display: true,
                    labelString: 'Usage Hours'
                }
            }]
        }
    };
    
    chart.setData(data);
    chart.setOptions(options);
}

/**
 * @public
 * @param {String} tenantName
 * @param {String} userName
 * @param {RuntimeWebComponent<svychartjs-chart>|RuntimeWebComponent<svychartjs-chart_abs>} chart
 *
 * @properties={typeid:24,uuid:"4717A3D5-AEB9-4BA9-B405-44270722C904"}
 */
function createChartUserUsageOverTimeMonths(tenantName, userName, chart){    
    var monthsWindow = 6;
    var curDate = application.getServerTimeStamp();
    var cutOffDate = scopes.svyDateUtils.getFirstDayOfMonth(scopes.svyDateUtils.addMonths(curDate, (-1 * (monthsWindow - 1))));
    
    var yearMonths = new Array(monthsWindow); //will contain 20171, 20172,...201712
    var yearMonthsNames = new Array(monthsWindow); //will contain Jan, Feb, Mar....
    for (var index = 0; index < yearMonths.length; index++) {
        var dt = scopes.svyDateUtils.addMonths(cutOffDate, index);
        yearMonths[index] = utils.stringFormat('%1$.0f%2$.0f',[dt.getFullYear(), (dt.getMonth() + 1)]); /*month in JS is 0-11!*/
        yearMonthsNames[index] = utils.dateFormat(dt,'MMM');        
    }
    
    var qry = datasources.db.svy_security.sessions.createSelect();
    var yearMonthCol = qry.columns.session_start.year.cast(QUERY_COLUMN_TYPES.TYPE_STRING).concat(qry.columns.session_start.month.cast(QUERY_COLUMN_TYPES.TYPE_STRING)); 
    
    //select
    qry.result.add(qry.columns.user_name, 'user');    
    qry.result.add(yearMonthCol, 'yyyymm');
    qry.result.add(qry.columns.session_duration.sum.divide(3600000), 'usage_hours'); //session_duration is stored in milliseconds so we need to convert it to hours
    
    //group by
    qry.groupBy.add(qry.columns.user_name);
    qry.groupBy.add(yearMonthCol);
    
    //where
    qry.where.add(qry.columns.session_start.gt(cutOffDate));
    qry.where.add(qry.columns.tenant_name.eq(tenantName));
    qry.where.add(qry.columns.user_name.eq(userName));
    
    //sort
    qry.sort.add(qry.columns.user_name.asc);
    qry.sort.add(yearMonthCol);
    
    var ds = databaseManager.getDataSetByQuery(qry, monthsWindow);
        
    var dsData = databaseManager.createEmptyDataSet();
    dsData.addColumn('user',1,JSColumn.TEXT);
    for (index = 0; index < yearMonths.length; index++) {
        dsData.addColumn(yearMonths[index].label, index+2, JSColumn.NUMBER);        
    }
    
    //initialize the dsData with user names and 0's for the value columns
    
    var rowData = new Array(monthsWindow + 1);
    rowData[0] = userName;
    for (var i = 0; i < monthsWindow; i++){
        rowData[i+1] = 0;
    }            
    dsData.addRow(rowData);
    
    for (index = 1; index <= ds.getMaxRowIndex(); index++) {        
        var row = ds.getRowAsArray(index);
        var userIndx = 0;
        var valueIndx = yearMonths.indexOf(row[1]);
        var value = row[2];
        
        dsData.setValue(userIndx+1, valueIndx + 2, roundNumber(value, 2));
    }
    
    var colors = getColors(6);
    var chartDatasets = [];
    
    chartDatasets.push({
        label: userName,
        fill: true,
        data: dsData.getRowAsArray(1).splice(1,monthsWindow),
        borderColor: colors[5],            
        pointBorderColor: colors[5],
        pointBackgroundColor: colors[5],
        pointBorderWidth: 1,
        pointHoverRadius: 3,
        pointHoverBackgroundColor: colors[5],
        pointHoverBorderColor: 'orange',
        pointHoverBorderWidth: 2,
        tension: 0.3
    });
    
    var data = {
        type: 'line',
        data: {
            labels: yearMonthsNames,
            datasets: chartDatasets
        }
    };
    
    var options = {
        title: {
            display: true,
            text: utils.stringFormat('Usage for last %1$.0f months by user %2$s', [monthsWindow, userName])
        },
        legend: {
            display: false,
            position: 'right'
        },
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                },
                scaleLabel: {
                    display: true,
                    labelString: 'Usage Hours'
                }
            }]
        }
    };
    
    chart.setData(data);
    chart.setOptions(options);
}

/**
 * @public 
 * @param {Number} number
 * @param {Number} decimals - number of decimal places to round to
 * @return {Number}
 *
 * @properties={typeid:24,uuid:"81FC5026-7002-45DF-AF5E-10687E65247C"}
 */
function roundNumber(number, decimals) {
    if (decimals) {
        var dec = Math.pow(10, decimals);
        return Math.round(number * dec) / dec;
    }
    else {
        return Math.round(number);
    }
}

/**
 * @public 
 * @param {Number} numberOfDataElements
 * @return {Array<String>}
 *
 *
 * @properties={typeid:24,uuid:"A3C81BC7-4580-4B1F-B28C-C73FEF6A314D"}
 */
function getColors(numberOfDataElements) {
    var colors6 = ['#0D3C55','#1395BA','#A2B86C','#EBC844','#F16C20','#C02E1D']; 
    var colors12 = ['#15516B','#1395BA','#5CA793','#EBC844','#EF8B2C','#D94E1F','#117899','#1395BA','#A2B86C','#ECAA38','#F16C20','#C02E1D']; 
    if (numberOfDataElements <= 6) {
        return colors6;
    }
    else if (numberOfDataElements <= 12) {
        return colors12
    }
    else {
        return colors12.concat(colors6);
    }
}
