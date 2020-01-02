var divListGrid;
var divCreateItem;
var idFormCreateItem;
var divEditItem;
var idFormEditItem;
var divDetailsItem;
var idFormDetailsItem;

$(function () {
    InicializarVariablesItem();
    EnlazarEventosItem();
});

function InicializarVariablesItem() {
    divListGrid = $("#dataTable");
    divCreateItem = $("#modalCreateItem");
    idFormCreateItem = "#formCreateItem";
    divEditItem = $("#modalEditItem");
    idFormEditItem = "#formEditItem";
    divDetailsItem = $("#modalDetailsItem");
    idFormDetailsItem = "#formDetailstem";
}

function EnlazarEventosItem() {

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
        "sAjaxSource": urlGetProductValues,
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
            { "aTargets": [1], "mData": "ItemName" },
            { "aTargets": [2], "mData": "GenericName", "defaultContent": "<i>No se Informa</i>" },
            { "aTargets": [3], "mData": "Description", "defaultContent": "<i>No se Informa</i>" },
            {
                "aTargets": [4],
                "bSortable": false,
                "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                    $(nTd).css('text-align', 'center');
                },
                "mData": "ImageName", "mRender": function (data, type, row) {
                    return '<a title ="' + row.ItemName +
                        '" href= "javascript: swal.fire({ text: \'' + row.ItemName + '\', imageUrl: \'' + row.ImagePath + '' + data +
                        '\' })"><img src="' + row.ImagePath + '' + data + '" style="height:25px;max-width:80px;"/></a>';
                }
            }
        ]
    });

    $('div.dataTables_filter input').focus();
    $.fn.dataTable.ext.errMode = 'throw';

    $('#dataTable tbody').on('click', 'tr', function () {
        if ($(this).hasClass('selected')) {
            $(this).removeClass('outline');
            $(this).removeClass('selected');
        }
        else {
            table.$('tr.selected').removeClass('selected');
            $(this).removeClass('outline');
            $(this).addClass('selected');
        }
    });

    $("#btnCreate").click(function (e) {
        e.preventDefault();
        e.stopPropagation();
        btnCreate();
    });

    $("#btnEdit").click(function (e) {
        e.preventDefault();
        e.stopPropagation();
        btnEdit();
    });

    $("#btnDetails").click(function (e) {
        e.preventDefault();
        e.stopPropagation();
        btnDetail();
    });

    $("#btnDelete").click(function (e) {
        e.preventDefault();
        e.stopPropagation();
        btnDelete();
    });

    $("#btnCerrarCreateItem").click(function () { divCreateItem.modal('hide'); return false; });
    $('#btnSaveCreateItem').click(function () { saveCreateItem(); });

    $("#btnCerrarEditItem").click(function () { divEditItem.modal('hide'); return false; });
    $('#btnSaveEditItem').click(function () { saveEditItem(); });

    $("#btnCerrarDetailsItem").click(function () { divDetailsItem.modal('hide'); return false; });
}

function btnCreate() {
    openModalX(urlCreateItem, divCreateItem, refreshAfterLoadCreateModal);
}
function btnEdit() {
    var selectedId = getSelectedIdFromDataTable(divListGrid);
    var idItem = selectedId[0];
    if (idItem > 0) {
        openModalX(urlEditItem + "?id=" + idItem, divEditItem, refreshAfterLoadEditModal);
    }
    else
        showMessageNotSelectedRow();
    return false;
}
function btnDetail() {
    var selectedId = getSelectedIdFromDataTable(divListGrid);
    var idItem = selectedId[0];
    if (idItem > 0) {
        openModalWithId(urlDetailsItem, idItem, divDetailsItem, refreshAfterLoadDetailsModal);
    }
    else
        showMessageNotSelectedRow();
    return false;
}
function btnDelete() {
    var selectedId = getSelectedIdFromDataTable(divListGrid);
    var idItem = selectedId[0];
    if (idItem > 0) {
        confirmDeleteItem(idItem);
    }
    else
        showMessageNotSelectedRow();
    return false;
}
function refreshAfterLoadCreateModal(data) {
    putContentHtmlDivPopup(divCreateItem, data);
    bindClientValidation(idFormCreateItem);
    loadIds();
}
function refreshAfterLoadEditModal(data) {
    putContentHtmlDivPopup(divEditItem, data);
    bindClientValidation(idFormEditItem);
    loadIds();
}
function refreshAfterLoadDetailsModal(data) {
    putContentHtmlDivPopup(divDetailsItem, data);
    bindClientValidation(idFormDetailsItem);
}
function loadIds() {

    $('#IdCategory').on("change", function () {
        if (this.value !== '') {
            var textSelected = $("#IdCategory option[value='" + this.value + "']").text();
            $("#Category").val(textSelected);
        }
    });

    $("#fichero_seleccion").change(function () {
        var fichero_seleccionado = $(this).val();
        var nombre_fichero_seleccionado = fichero_seleccionado.replace(/.*[\/\\]/, '');
        $("#fichero_seleccionado").text(nombre_fichero_seleccionado);
    });

    $('#LastUpdated').datetimepicker({
        format: "DD-MM-YYYY",
        locale: "es",
        useCurrent: false,
        minDate: '-1969/12/31'
    });

    $('#modalCreateItem').on('shown.bs.modal', function () {
        $('#Name').focus();
    });
}
function saveCreateItem() {

    bindClientValidation(idFormCreateItem);

    if (isValidForm(idFormCreateItem)) {
        showLoadingSwal('Procesando...');
        submitFormWithFile(idFormCreateItem, refreshGridAfterSaveItem);
    }
}
function saveEditItem() {

    bindClientValidation(idFormEditItem);

    if (isValidForm(idFormEditItem)) {
        showLoadingSwal('Procesando...');
        submitFormWithFile(idFormEditItem, refreshGridAfterSaveItem);
    }
}
function confirmDeleteItem(idItem) {
    showQuestionInfo('Eliminar Producto', '¿Está seguro que desea eliminar el producto seleccionado?', 'warning', function () {
        showLoadingSwal('Procesando...');

        ajaxPostItemId_json(window.urlDeleteItem, idItem, function (data) {

            if (data.Ok) {
                reloadPage();
            } else {
                showInfo('Error', data.ErrorMessage, 'error');
            }
        });
    });
}
function refreshGridAfterSaveItem(data) {
    if (data.Ok) {
        $('#btnCerrarCreateItem').trigger('click');
        closeLoadingSwal();
        reloadPage();
    } else {
        showInfo("Error", data.ErrorMessage, "error");
    }
    return false;
}
