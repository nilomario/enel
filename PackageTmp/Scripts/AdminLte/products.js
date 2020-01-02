$(function () {
    EnlazarEventosProducts();
});

function EnlazarEventosProducts() {

    $('#dataTable').dataTable({
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
        "sAjaxSource": urlGetProductValues,
        "bStateSave": true,
        "bServerSide": true,
        "bDeferRender": true,
        "bAutoWidth": false,
        "oPaginate": false,
        "tabIndex": false,
        rowId: 'idproducto',
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
            { "aTargets": [1], "mData": "nombre" },
            { "aTargets": [2], "mData": "descripcion", "defaultContent": "<i>No se Informa</i>" },
            { "aTargets": [3], "mData": "precio", "defaultContent": "<i>No se Informa</i>" },
            { "aTargets": [4], "mData": "idcategoria", "defaultContent": "<i>No se Informa</i>" },
            {
                "aTargets": [5],
                "bSortable": false,
                "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                    $(nTd).css('text-align', 'center');
                },
                "mData": "imagen", "mRender": function (data, type, row) {
                    return '<a title ="' + row.nombre +
                        '" href= "javascript: swal.fire({ text: \'' + row.nombre + '\', imageUrl: \'' + row.imagen + '' +
                        '\' })"><img src="' + row.imagen + '' + '" style="height:25px;max-width:80px;"/></a>';
                }
            }
        ]
    });

    $("#btnDashboard").click(function () {
        window.open(urlAdminLte + "?idTotem=" + idTotem + "&pais=" + pais + "&moneda=" + moneda + "&idProductor=" + idProductor + "&isDecimal=" + isDecimal, "_self");
        loadSpiner();
        return false;
    });
}