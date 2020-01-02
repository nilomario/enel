var charts;
var _data = [];
var d = new Date();
var _days = [];
var _amt = [];
var month = new Array();
month[0] = "Enero";
month[1] = "Febrero";
month[2] = "Marzo";
month[3] = "Abril";
month[4] = "Mayo";
month[5] = "Junio";
month[6] = "Julio";
month[7] = "Agosto";
month[8] = "Septiembre";
month[9] = "Octubre";
month[10] = "Noviembre";
month[11] = "Diciembre";
var n = month[d.getMonth()];

datos = { 'idProductor': idProductor, 'idTotem': idTotem };

$.post(urlForMorris, datos, function (data) {
    $.each(data, function (key, value) {
        _days.push(value[0]);
        _amt.push(value[1]);
    });

    charts = new Highcharts.Chart({
        chart: { renderTo: 'newContainer2', defaultSeriesType: 'column' },
        plotOptions: { line: { dataLabels: { enabled: true }, enableMouseTracking: false } },
        title: { text: 'Ventas Diarias / ' + n },
        tooltip: { valuePrefix: ' ' + moneda },
        xAxis: { categories: _days, title: { text: 'Meses' } },
        yAxis: { title: { text: 'Total de Ventas/Día' } },
        series: [{ data: _amt, name: 'Total de Ventas' }],
        exporting: {
            enabled: false
        },
        credits: {
            enabled: false
        }
    });
});

$.post(urlForMorris2, datos, function (data) {
    charts = new Highcharts.Chart({
        chart: { renderTo: 'newContainer', defaultSeriesType: 'line' },
        plotOptions: { line: { dataLabels: { enabled: true }, enableMouseTracking: false } },
        title: { text: 'Ventas Mensuales / ' + d.getFullYear() },
        xAxis: { categories: ['Ene', ' Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'], title: { text: 'Meses' } },
        yAxis: { title: { text: 'Total de Ventas/Mes' } },
        series: [{ data: data, name: 'Total de Ventas' }],
        exporting: {
            enabled: false
        },
        credits: {
            enabled: false
        }
    });
});