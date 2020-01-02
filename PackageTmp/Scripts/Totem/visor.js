var qrScanned = "";

function updateProduct(product) {
    var quantity = product.data('quantity');

    $('.a_demo_static', product).attr("value", quantity);
    $('.a_demo_four', product).attr("value", quantity);
}

function number_format(amount, decimals) {
    amount += '';
    amount = parseFloat(amount.replace(/[^0-9\.]/g, ''));

    decimals = decimals || 0;

    if (isNaN(amount) || amount === 0)
        return parseFloat(0).toFixed(decimals);

    amount = '' + amount.toFixed(decimals);

    var amount_parts = amount.split('.'),
        regexp = /(\d+)(\d{3})/;

    while (regexp.test(amount_parts[0]))
        amount_parts[0] = amount_parts[0].replace(regexp, '$1' + ',' + '$2');

    return amount_parts.join('.');
}

// jquery.my.cart
$(function () {

    var goToCartIcon = function ($addTocartBtn) {
        $addTocartBtn.prepend();
    };

    $('.my-cart-btn').myCart({
        classCartIcon: 'my-cart-icon',
        classCartBadge: 'my-cart-badge',
        classProductQuantity: 'my-product-quantity',
        classProductRemove: 'my-product-remove',
        classCheckoutCart: 'my-cart-checkout',
        affixCartIcon: true,
        showCheckoutModal: true,
        numberOfDecimals: 2,
        cartItems: [
        ],
        clickOnAddToCart: function ($addTocart) {
            goToCartIcon($addTocart);
        },
        afterAddOnCart: function (products, totalPrice, totalQuantity) {
            console.log("afterAddOnCart", products, totalPrice, totalQuantity);
        },
        clickOnCartIcon: function ($cartIcon, products, totalPrice, totalQuantity) {
            console.log("cart icon clicked", $cartIcon, products, totalPrice, totalQuantity);
        },
        checkoutCart: function (products, totalPrice, totalQuantity) {
            console.log("cart checkout clicked", products, totalPrice, totalQuantity);
        },
        getDiscountPrice: function (products, totalPrice, totalQuantity) {
            console.log("calculating discount", products, totalPrice, totalQuantity);
            return totalPrice;
        }
    });
});

// click on configuration cog
$(".cog").on("click", function () {

    $('#adminPassModal').modal('toggle');

    setTimeout(function () {
        $('.modal-backdrop').remove();
        $("#adminPassModal").modal('hide');
    }, 30000);

    $('#btnRefresh').click(function () {
        $('#btnRefresh').addClass('spinner');
        window.location.reload();
    });

    var input = '',
        correct = codigoAcceso;

    var dots = document.getElementsByClassName('dot'),
        numbers = document.getElementsByClassName('number');
    dots = Array.from(dots);
    numbers = Array.from(numbers);

    var numbersBox = document.getElementsByClassName('numbers')[0];
    $(numbersBox).on('click', '.number', function (evt) {
        var number = $(this);

        number.addClass('grow');
        input += number.index() + 1;
        $(dots[input.length - 1]).addClass('active');

        if (input.length >= 5) {
            $('.number').removeClass('grow');
            if (input !== correct) {
                dots.forEach(dot => $(dot).addClass('wrong'));
                $(document.body).addClass('wrong');
            } else {
                dots.forEach(dot => $(dot).addClass('correct'));
                $(document.body).addClass('correct');

                //Enter Dashboard
                if (isInternet == "True") {
                    openDashBoard();
                }
                else
                    $("#labelsininternet").css({ "color": "white" });
                setTimeout(function () {
                    $("#labelsininternet").css({ "color": "red" });
                }, 500);
            }
            setTimeout(function () {
                dots.forEach(dot => dot.className = 'dot');
                input = '';
            }, 900);
            setTimeout(function () {
                document.body.className = '';
            }, 1000);
        }
        setTimeout(function () {
            number.className = 'number';
        }, 1000);
    });
});

// qrcode click
$(".qrcode").on("click", function () {

    swal.fire({
        title: 'Escanea tu código QR',
        text: 'Ubica el código QR frente al lector.',
        imageUrl: 'Content/Totem/Images/qr_image.jpg',
        input: 'text',
        imageWidth: 150,
        imageHeight: 150,
        imageAlt: 'Custom image',
        animation: true,
        showCancelButton: false,
        showCloseButton: false,
        showConfirmButton: false,
        timer: 15000
    })
        .then((result) => {

            if (result.dismiss === "overlay")
                return;
            if (result.dismiss === "timer")
                return;

            showInfo("Info", "Espere a que se realice la transacción", "info");
            ajaxPostJson_Anticipa(urlAnticipa, result.value, idProductor, idTotem, anticipaStatusAfter);
        });
});

function anticipaStatusAfter(data) {
    if (data.Ok !== true)
        showInfoTimer(data.ErrorMessage, "De necesitar, contacte al personal de apoyo.", "error", 3000);
    else
        showInfoTimer("Compra Satisfactoria!", "Gracias por su preferencia.", "success", 3000);
}

// scrollArrow click
$("#scrollArrow").on("click touchstart", function () {
    autoScroll();
});

//hide arrow at scroll buttom
$("#center-nav").scroll(function () {
    if ($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight - 1) {
        $("#scrollArrow").hide();
    } else {
        $("#scrollArrow").show();
    }
});

//hide arrow if no scroll
function hideArrow() {
    (function ($) {
        //$.fn.hasScrollBar = function () {
        //    return this.get(0).scrollHeight > this.height() + 150;
        //};
    })(jQuery);

    setTimeout(function () {
        //if ($('#center-nav').hasScrollBar())
        //    $('#scrollArrow').show();
        //else
        //    $('#scrollArrow').hide();
    }, 100);
}

//autoScroll time
//var idleTime = 0;
//$(document).ready(function () {
//    setInterval(timerIncrement, 10000);

//    $(document).mousemove(function (e) {
//        idleTime = 0;
//    });
//    $('#center-nav').scroll(function (e) {
//        idleTime = 0;
//    });
//    $(document).click(function (e) {
//        idleTime = 0;
//    });
//});

//function timerIncrement() {
//    idleTime = idleTime + 1;
//    if (idleTime > 1) {
//        autoScroll();
//    } else {
//        return;
//    }
//}

//var i = 519;
//function autoScroll() {
//    $("#center-nav").animate({ scrollTop: $(document).length + i }, 1000, function () {
//        i = i + 519;
//        if (i > 3200)
//            i = 0;
//    });
//}

// init Isotope
var $grid = $(".grid").isotope({
    itemSelector: ".element-item",
    masonry: {
        columnWidth: 10,
        isFitWidth: true
    }
});

// filter functions
var filterFns = {
    // show if number is greater than 50
    numberGreaterThan50: function () {
        var number = $(this).find(".number").text();
        return parseInt(number, 10) > 50;
    },
    // show if name ends with -ium
    ium: function () {
        var name = $(this).find('.name').text();
        return name.match(/ium$/);
    }
};

// bind filter button click
$("#filters").on("click", "button", function () {
    var filterValue = $(this).attr("data-filter");
    // use filterFn if matches value
    filterValue = filterFns[filterValue] || filterValue;
    $grid.isotope({ filter: filterValue });

    hideArrow();
});

// change is-checked class on buttons
$(".button-group").each(function (i, buttonGroup) {
    var $buttonGroup = $(buttonGroup);
    $buttonGroup.on("click", "button", function () {
        $buttonGroup.find(".is-checked").removeClass("is-checked");
        $(this).addClass("is-checked");
    });
});

//disable client selections
$("*").disableSelection();

function hideCartModal() {
    $(".modal").modal("hide");
}

function hidePaymentModal() {
    $("#paymentModal").modal("hide");
}

function showDocumento(funcSuccess) {
    $("#invoiceModal").modal("show");

    $("#factura").on("click", function (e) {
        e.preventDefault();
        e.stopPropagation();

        $("#invoiceModal").modal("hide");
        hidePaymentModal();

        validateRuc(function (data) {
            funcSuccess(data);
        });
    });

    $("#boleta").on("click", function (e) {
        e.preventDefault();
        e.stopPropagation();

        $("#invoiceModal").modal("hide");
        hidePaymentModal();

        validateName(function (data) {
            funcSuccess(data);
        });
    });
}

function validateRuc(funcSuccess) {
    swal({
        type: '',
        title: 'Ingrese su Ruc',
        input: 'text',
        inputPlaceholder: 'sin dígito verificador ',
        inputAttributes: {
            'autocomplete': 'off',
            'maxlength': 8,
            'autocapitalize': 'off',
            'autocorrect': 'off'
        },
        onOpen: () => swal.getConfirmButton().focus(),
        text: 'validaremos su entrada',
        showCancelButton: true,
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar',
        showLoaderOnConfirm: false,
        inputValidator: (value) => {

            var validate = value.indexOf("-") == -1;
            if (validate)
                if (value == "" || isNaN(value))
                    validate = false;
            return !validate && 'Debe ingresar un Ruc válido sin dígito verificador';
        },
        preConfirm: (text) => {
            data = { ruc: text };
            $.ajax({
                url: urlValidateRuc,
                type: "POST",
                data: JSON.stringify(data),
                dataType: "JSON",
                contentType: "application/json",
                success: function (data) {
                    d = data;
                }
            })
                .then(d => {
                    var nombreCompleto = "";
                    if (d.Ok == false) {
                        swal({
                            showCancelButton: true,
                            confirmButtonText: 'Aceptar',
                            cancelButtonText: 'Cancelar',
                            cancelButtonColor: 'Red',
                            showLoaderOnConfirm: false,
                            type: 'warning',
                            title: d.ErrorMessage,
                            text: '¿Desea volver a intentarlo?'
                        }).then((validate) => {
                            if (validate.dismiss != "cancel")
                                validateRuc(funcSuccess);
                        });
                    }
                    if (d.Ok == true) {
                        nombreCompleto = d.Data.nombrecompleto;
                        swal({
                            showCancelButton: true,
                            confirmButtonText: "Aceptar",
                            cancelButtonText: 'Cancelar',
                            cancelButtonColor: 'Red',
                            showLoaderOnConfirm: false,
                            type: "success",
                            title: nombreCompleto,
                            text: "¿Son correctos los datos?"
                        }).then((validate) => {
                            if (validate.dismiss != "cancel")
                                funcSuccess(d.Data);
                        });
                    }
                });
        }
    });
    $(".swal2-input").keyboard({ type: "tel", placement: "top" });
}

function validateName(funcSuccess) {
    swal({
        type: '',
        title: 'Ingrese un Nombre',
        input: 'text',
        inputPlaceholder: '',
        inputAttributes: {
            'autocomplete': 'off',
            'maxlength': 6,
            'autocapitalize': 'off',
            'autocorrect': 'off'
        },
        onOpen: () => swal.getConfirmButton().focus(),
        text: 'validaremos su entrada',
        showCancelButton: true,
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar',
        showLoaderOnConfirm: false,
        inputValidator: (value) => {
            return !value && 'Debe ingresar un Nombre válido';
        },
        preConfirm: (text) => {
            funcSuccess(text);
        }
    });
    $(".swal2-input").keyboard({ placement: "top" });
}

$(this).click(function () {
    clearTimeout(x);
    playslider();
});

function playslider() {
    x = setTimeout(function () {
        window.location.hash = '';
        window.location.reload();
    }, 300000);
}

playslider();