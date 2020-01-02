function ajaxPostArray_json(url, items, total, qty, funcSuccess) {

    var errorMsg = submitErrorMessage;
    var funcError = undefined;

    things = JSON.stringify({
        'CartDto': items,
        'Total': total,
        'qty': qty,
        'IdTotem': idTotem,
        'IdProductor': idProductor,
        'Country': country,
        'IsCash': isCash,
        'TipoVoucher': tipoVoucher,
        'FacturaNo': factura,
        'Moneda': moneda,
        'CodigoComercio': codigoComercio,
        'ticketImage': ticketImage,
        'codigoValidacion': codigoValidacion,
        'printFirst': printFirst,
        'ErrorLog': errorLog,
        'ruc': setRuc,
        'medioPago': medioPago
    });

    $.ajax({
        contentType: 'application/json; charset=utf-8',
        type: "POST",
        dataType: "json",
        data: things,
        url: url,
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            if (funcError !== undefined)
                funcError(XMLHttpRequest, textStatus, errorThrown);
            else {
                showInfoTimer('Error', errorMsg, 'error', 3000);
                setTimeout(function () {
                    window.location.href = urlTotemVisor;
                }, 3000);
            }
        },
        success: function (responseData, textStatus) {
            funcSuccess(responseData, textStatus);
        }
    });
}

function ajaxPostJson_Anticipa(url, token, idProductor, idTotem, funcSuccess) {

    var errorMsg = submitErrorMessage;
    var funcError = undefined;

    things = JSON.stringify({ 'token': token, 'idProductor': idProductor, 'idTotem': idTotem, 'ticketImage': ticketImage, 'printerType': printerType });

    $.ajax({
        contentType: 'application/json; charset=utf-8',
        type: "POST",
        dataType: "json",
        data: things,
        url: url,
        error: function (XMLHttpRequest, textStatus, errorThrown) {

            if (funcError !== undefined)
                funcError(XMLHttpRequest, textStatus, errorThrown);
            else {
                showInfoTimer('Error', errorMsg, 'error', 3000);
                setTimeout(function () {
                    window.location.href = urlTotemVisor;
                }, 3000);
            }
        },
        success: function (responseData, textStatus) {
            funcSuccess(responseData, textStatus);
        }
    });
}

function ajaxGetAdminLte() {
    adminLte = window.location.href = urlAdminLte + "?idTotem=" + idTotem + "&pais=" + country + "&moneda=" + moneda + "&idProductor=" + idProductor + "&isDecimal=" + isDecimal;
}

function notifyProblem() {
    Swal.fire({
        title: '¿Reportar un problema a Passline?',
        type: 'info',
        showCancelButton: true,
        confirmButtonText: 'Enviar',
        cancelButtonText: 'Cancelar',
        showLoaderOnConfirm: true,
        preConfirm: () => {
            return fetch(urlSupport)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(response.statusText);
                    }
                    return response.json();
                })
                .catch(error => {
                    Swal.showValidationMessage(
                        'Error: No se pudo notificar a Passline.'
                    );
                });
        },
        allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
        if (result.value) {
            showInfoOnlyTimer('Enviado!', 'Su solicitud se notificó a Passline.', 'success', 3000);
        }
    });
}

function salesReport() {
    Swal.fire({
        title: '¿Imprimir el reporte de ventas del día de hoy?',
        type: 'info',
        showCancelButton: true,
        confirmButtonText: 'Imprimir',
        cancelButtonText: 'Cancelar',
        showLoaderOnConfirm: true,
        preConfirm: (fecha) => {
            return fetch(urlReportService)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(response.statusText);
                    }
                    return response.json();
                })
                .catch(error => {
                    Swal.showValidationMessage(
                        'Error: No se pudo procesar su solicitud.'
                    );
                });
        },
        allowOutsideClick: () => !Swal.isLoading()
    });
}