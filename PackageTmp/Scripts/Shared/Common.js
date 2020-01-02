function showInfo(title, message, type) {
    showConfirmButton = false;

    swal({
        title: title,
        text: message,
        type: type,
        animation: true,
        showConfirmButton: showConfirmButton,
        allowOutsideClick: false,
        onBeforeOpen: () => {
            Swal.showLoading();
        }
    });
}

function showInfoOnlyTimer(title, message, type, timer) {
    let timerInterval;
    swal({
        title: title,
        text: message,
        type: type,
        timer: timer,
        animation: true,
        allowOutsideClick: false,
        onBeforeOpen: () => {
            const content = Swal.getContent();
            const $ = content.querySelector.bind(content);

            Swal.showLoading();

            timerInterval = setInterval(() => {
            }, 100);
        },
        onClose: () => {
            clearInterval(timerInterval);
        }
    });
}

function showInfoTimer(title, message, type, timer, functionSuccess) {
    let timerInterval;
    swal({
        title: title,
        text: message,
        type: type,
        timer: timer,
        animation: true,
        allowOutsideClick: false,
        onBeforeOpen: () => {
            const content = Swal.getContent();
            const $ = content.querySelector.bind(content);

            Swal.showLoading();

            timerInterval = setInterval(() => {
            }, 100);
        },
        onClose: () => {
            clearInterval(timerInterval);
        }
    }).then(() => {
        functionSuccess();
    });
}

function ShowCancelAction(title, text, type, funcSuccess) {
    let timerInterval;
    swal({
        title: title,
        text: text,
        type: type,
        showCancelButton: true,
        animation: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, por favor!',
        cancelButtonText: 'No'
    }).then((result) => {
        if (result.value) {
            Swal.fire({
                title: 'CANCELADO!',
                html: 'Su compra ha sido cancelada.',
                timer: 2000,
                type: 'success',
                onBeforeOpen: () => {
                    Swal.showLoading();
                },
                onClose: () => {
                    clearInterval(timerInterval);
                }
            });
        }
        funcSuccess(result.value);
    });
}

//refresh page
function refresh() {
    window.location.reload();
}

function getFuncName() {
    return getFuncName.caller.name;
}

function loadSpiner() {
    document.getElementById('fade').style.display = 'block';
    $('#mySpinner').addClass('spinner');
}

function openModal(url, $divModal, funcSuccess, funcError, errorMsg) {

    putLoadingDivPopup($divModal);

    // En evento 'close' del modal: remover los tooltips y vaciar el contenido
    var closeEvent = $divModal.modal({
        keyboard: false,
        backdrop: 'static'
    });

    //LIMPIAMOS EL CONTENIDO CUANDO SE CIERRE EL MODAL.
    $divModal.on('hidden.bs.modal', function (e) {
        putContentHtmlDivPopup($divModal, "");
    });

    $divModal.modal('show');

    if (errorMsg === undefined) {
        errorMsg = submitErrorMessage;
    }

    $.ajax({
        type: "get",
        url: url,
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            $divModal.modal('hide');
            if (funcError != undefined)
                funcError(XMLHttpRequest, textStatus, errorThrown);
            else {
                console.log(XMLHttpRequest.responseText);
                showInfo('Error', submitErrorMessage, 'error');
            }
        },
        success: funcSuccess
    });
}

function showPaymentModal() {
    $("#paymentModal").modal("show");
}

function putLoadingDivPopup($divModal) {
    var classContentModal = $divModal.find("#ContentModal").attr('class');
    classContentModal = classContentModal + " " + nameClassLoading;
    $divModal.find("#ContentModal").addClass(classContentModal);
}

function refreshAfterLoadGetProductModal(data) {
    putContentHtmlDivPopup(divGetProducts, data);
}

function putContentHtmlDivPopup($divModal, html) {
    var classContentModal = $divModal.find("#ContentModal").attr('class');
    $divModal.find("#ContentModal").removeClass(classContentModal);
    classContentModal = classContentModal.replace(nameClassLoading, '');
    $divModal.find("#ContentModal").addClass(classContentModal);
    $divModal.find("#ContentModal").html(html);
}

function openDashBoard() {
    $('#btnRefresh').addClass('spinner');
    window.open(urlAdminLte + "?idTotem=" + idTotem + "&pais=" + country + "&moneda=" + moneda + "&idProductor=" + idProductor + "&isDecimal=" + isDecimal, "_self");
}

function openVisor() {
    loadSpiner();
    window.open(urlVisor, "_self");
}