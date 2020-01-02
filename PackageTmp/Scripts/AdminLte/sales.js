var _full = {};

$(function () {
    EnlazarEventosSales();
});

function EnlazarEventosSales() {

    var table = $('#dataTable').dataTable({
        "lengthMenu": [[10, 25, 50, 100], [10, 25, 50, 100]],
        "oLanguage": {
            "sEmptyTable": "No hay datos disponibles",
            "sInfo": "Mostrando _START_ a _END_ de _TOTAL_ Registros",
            "sInfoEmpty": "Mostrando 0 - 0 de 0 Registros",
            "sInfoFiltered": "(Filtrado de _MAX_ registros totales)",
            "sLengthMenu": "Mostrar _MENU_ registros",
            "sLoadingRecords": "Cargando...",
            "sProcessing": "Procesando...",
            "sSearch": "Buscar: ",
            "select": {
                rows: "%d Producto Seleccionado"
            },
            "sZeroRecords": "No se han encontrado registros que concuerden",
            "oPaginate": {
                "sFirst": "Primero",
                "sLast": "Último",
                "sNext": "Siguiente",
                "sPrevious": "Anterior"
            }
        },
        "sAjaxSource": urlGetSalesValues,
        "bStateSave": true,
        "bServerSide": true,
        "bDeferRender": true,
        "bAutoWidth": false,
        "oPaginate": false,
        "tabIndex": false,
        rowId: 'IdItem',
        select: {
            style: 'single',
            info: false
        },
        responsive: true,
        columnDefs: [
            { responsivePriority: 1, targets: 0 },
            { responsivePriority: 2, targets: 3 },
            { responsivePriority: 3, targets: 1 }
        ],
        "aoColumns": [
            { "aTargets": [1], "mData": "IdTransaccion", "defaultContent": "<i>No se Informa</i>" },
            { "aTargets": [2], "mData": "Date", "defaultContent": "<i>No se Informa</i>" },
            { "aTargets": [3], "mData": "Qty", "defaultContent": "<i>No se Informa</i>" },
            { "aTargets": [4], "mData": "GrandTotal", "defaultContent": "<i>No se Informa</i>" },
            {
                "aTargets": [5],
                "mData": "WichPaid",
                "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                    $(nTd).css('text-align', 'center');
                },
                "mRender": function (data, type, full) {
                    if (data == "Efectivo") {
                        return '<a class="badge" style="background-color: green; color: white; padding: 3px 10px 3px 10px" href="#">&nbspEfectivo&nbsp</a>';
                    }
                    if (data == "Tarjeta") {
                        return '<a class="badge" style="background-color: darkorange; color: white; padding: 3px 10px 3px 10px" href="#">&nbspTarjetas&nbsp</a>';
                    }
                }
            },
            { "aTargets": [6], "mData": "ErrorLog", "defaultContent": "<i>No se Informa</i>" }
        ]
    });

    $("#btnDashboard").click(function () {
        window.open(urlAdminLte + "?idTotem=" + idTotem + "&pais=" + pais + "&moneda=" + moneda + "&idProductor=" + idProductor + "&isdecimal=" + isDecimal, "_self");
        loadSpiner();
        return false;
    });

    $('#dataTable tbody').on('click', 'tr', function () {
        if ($(this).hasClass('selected')) {
            $(this).removeClass('outline');
            $(this).removeClass('selected');
        }
        else {
            table.$('tr.selected').removeClass('selected');
            $(this).removeClass('outline');
            $(this).addClass('selected');

            ShowCancelAction("Info", _full, "info");
        }
    });

    $('div.dataTables_filter input').focus();
    $.fn.dataTable.ext.errMode = 'throw';
}