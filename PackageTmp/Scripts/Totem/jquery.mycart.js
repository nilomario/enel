var setRuc = null;
var isCash = false;
var errorLog = null;
var medioPago = "";

(function ($) {

    "use strict";

    var OptionManager = (function () {
        var objToReturn = {};
        var _options = null;
        var DEFAULT_OPTIONS = {
            currencySymbol: $('.moneda').text(),
            classCartIcon: 'my-cart-icon',
            classCartBadge: 'my-cart-badge',
            classProductQuantity: 'my-product-quantity',
            classProductRemove: 'my-product-remove',
            classCheckoutCart: 'my-cart-checkout',
            affixCartIcon: true,
            showCheckoutModal: true,
            numberOfDecimals: 0,
            cartItems: null,
            clickOnAddToCart: function ($addTocart) { },
            clickOnRemoveToCart: function ($removeTocart) { },
            afterAddOnCart: function (products, totalPrice, totalQuantity) { },
            clickOnCartIcon: function ($cartIcon, products, totalPrice, totalQuantity) { },
            checkoutCart: function (products, totalPrice, totalQuantity) {

            },
            getDiscountPrice: function (products, totalPrice, totalQuantity) {
                return null;
            }
        };

        var loadOptions = function (customOptions) {
            _options = $.extend({}, DEFAULT_OPTIONS);
            if (typeof customOptions === 'object') {
                $.extend(_options, customOptions);
            }
        };
        var getOptions = function () {
            return _options;
        };

        objToReturn.loadOptions = loadOptions;
        objToReturn.getOptions = getOptions;
        return objToReturn;
    }());

    var ProductManager = (function () {
        var objToReturn = {};

        /*
        PRIVATE
        */
        localStorage.products = localStorage.products ? localStorage.products : "";
        var getIndexOfProduct = function (id) {
            var productIndex = -2;
            var products = getAllProducts();
            $.each(products, function (index, value) {
                if (value.id === id) {
                    productIndex = index;
                    return;
                }
            });
            return productIndex;
        };
        var setAllProducts = function (products) {
            localStorage.products = JSON.stringify(products);
        };
        var addProduct = function (id, name, summary, price, quantity, image, extra) {
            var products = getAllProducts();
            products.push({
                id: id,
                name: name,
                summary: summary,
                price: price,
                quantity: quantity,
                image: image,
                extra: extra
            });
            setAllProducts(products);
        };

        /*
        PUBLIC
        */
        var getAllProducts = function () {
            try {
                var products = JSON.parse(localStorage.products);
                return products;
            } catch (e) {
                return [];
            }
        };
        var updatePoduct = function (id, quantity) {
            var productIndex = getIndexOfProduct(id);
            if (productIndex < 0) {
                return false;
            }
            var products = getAllProducts();
            products[productIndex].quantity = typeof quantity === "undefined" ? products[productIndex].quantity * 1 + 1 : quantity;
            setAllProducts(products);
            return true;
        };

        var removePoduct = function (id, quantity) {
            var productIndex = getIndexOfProduct(id);
            if (productIndex < 0) {
                return false;
            }
            var products = getAllProducts();
            products[productIndex].quantity = typeof quantity === "undefined" ? products[productIndex].quantity * 1 - 1 : quantity;
            setAllProducts(products);
            return true;
        };
        var setProduct = function (id, name, summary, price, quantity, image, extra) {
            if (typeof id === "undefined") {
                console.error("id required");
                return false;
            }
            if (typeof name === "undefined") {
                console.error("name required");
                return false;
            }
            if (typeof image === "undefined") {
                console.error("image required");
                return false;
            }
            if (!$.isNumeric(price)) {
                console.error("price is not a number");
                return false;
            }
            if (!$.isNumeric(quantity)) {
                console.error("quantity is not a number");
                return false;
            }
            if (typeof extra === "undefined") {
                console.error("extra is required");
                return false;
            }
            summary = typeof summary === "undefined" ? "" : summary;

            if (!updatePoduct(id)) {
                addProduct(id, name, summary, price, quantity, image, extra);
            }
        };
        var clearProduct = function () {
            setAllProducts([]);
        };
        var removeProduct = function (id) {
            var products = getAllProducts();
            products = $.grep(products, function (value, index) {
                return value.id !== id;
            });
            setAllProducts(products);
        };
        var getTotalQuantity = function () {
            var total = 0;
            var products = getAllProducts();
            $.each(products, function (index, value) {
                total += value.quantity * 1;
            });
            return total;
        };
        var getTotalPrice = function () {
            var products = getAllProducts();
            var total = 0;
            $.each(products, function (index, value) {
                total += value.quantity * value.price;
                total = total * 1;
            });
            return total;
        };

        objToReturn.getAllProducts = getAllProducts;
        objToReturn.updatePoduct = updatePoduct;
        objToReturn.removePoduct = removePoduct;
        objToReturn.setProduct = setProduct;
        objToReturn.clearProduct = clearProduct;
        objToReturn.removeProduct = removeProduct;
        objToReturn.getTotalQuantity = getTotalQuantity;
        objToReturn.getTotalPrice = getTotalPrice;
        return objToReturn;
    }());


    var loadMyCartEvent = function (targetSelector) {

        var options = OptionManager.getOptions();
        var $cartIcon = $("." + options.classCartIcon);
        var $cartBadge = $("." + options.classCartBadge);
        var classProductQuantity = options.classProductQuantity;
        var classProductRemove = options.classProductRemove;
        var classCheckoutCart = options.classCheckoutCart;

        var idCartModal = 'my-cart-modal';
        var idCartTable = 'my-cart-table';
        var idGrandTotal = 'my-cart-grand-total';
        var idEmptyCartMessage = 'my-cart-empty-message';
        var idDiscountPrice = 'my-cart-discount-price';
        var classProductTotal = 'my-product-total';
        var classAffixMyCartIcon = 'my-cart-icon-affix';

        if (options.cartItems && options.cartItems.constructor === Array) {
            ProductManager.clearProduct();
            $.each(options.cartItems, function () {
                ProductManager.setProduct(this.id, this.name, this.summary, this.price, this.quantity, this.image, this.extra);
            });
        }

        $cartBadge.text(ProductManager.getTotalQuantity());

        if (!$("#" + idCartModal).length) {
            $('body').append(
                '<div class="modal fade" id="' + idCartModal + '" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" data-controls-modal="' + idCartModal + '" data-keyboard="false" >' +
                '<div class="modal-dialog" role="document">' +
                '<div class="modal-content">' +
                '<div class="modal-header">' +
                '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
                '<h4 style="color:black; letter-spacing: 0;" class="modal-title" id="myModalLabel"><span id="testsale" class="glyphicon glyphicon-shopping-cart"></span> Carro de Compras</h4>' +
                '</div>' +
                '<div class="modal-body">' +
                '<table class="table table-striped table-responsive" id="' + idCartTable + '"></table>' +
                '</div>' +
                '<div class="modal-footer">' +
                '<button type="button" class="btn btn-danger reinicio" data-dismiss="modal" style="float:left">CANCELAR</button>' +
                '<button type="button" class="btn btn-default" data-dismiss="modal">CERRAR</button>' +
                '<button type="button" class="btn btn-success ' + classCheckoutCart + '">PAGAR</button>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>'
            );
        }

        var drawTable = function () {
            var $cartTable = $("#" + idCartTable);
            $cartTable.empty();
            var products = ProductManager.getAllProducts();
            $.each(products, function () {
                var _price = number_format(this.price);
                var _total = number_format(this.quantity * this.price);

                if (country == "PERU") {
                    _price = (this.price / 100).toFixed(2);
                    _total = (this.quantity * this.price / 100).toFixed(2);
                }
                $cartTable.append(
                    '<tr data-id="' + this.id + '" data-price="' + this.price + '">' +
                    '<td><a href="javascript: swal.fire({ text: \'' + $('#nomb_' + this.id).text() + ' (' + $('#desc_' + this.id).text() + ') \', imageUrl: \'' + this.image + '\' })"><img class="image-responsive" style="max-width: 50px; max-height: 50px" src="' + this.image + '"/></td>' +
                    '<td>' + this.name + '</td>' +
                    '<td>' + options.currencySymbol + _price + '</td>' +
                    '<td></td>' +
                    '<td>' +
                    '<input type="button" value="-" class="btnm ' + classProductQuantity + '" />' +
                    '<input type="text" value="' + this.quantity + '" onfocus="blur();" style="width:50px" />' +
                    '<input type="button" value="+" class="btnp ' + classProductQuantity + '" />' +
                    '</td>' +
                    '<td id="total_' + this.id + '" class="text-center ' + classProductTotal + '">' + options.currencySymbol + _total + '</td>' +
                    '<td class="pull-right"><a href="javascript:void(0);" class="btn btn-xs close fa fa-trash ' + classProductRemove + '"></a></td>' +
                    '</tr>'
                );
            });

            $cartTable.append(products.length ?
                '<tr style="color: green">' +
                '<td></td>' +
                '<td></td>' +
                '<td></td>' +
                '<td></td>' +
                '<td class="pull-right"><strong style="font-size: 40px">TOTAL:</strong></td>' +
                '<td>' + '<strong style="font-size:40px"</strong>' + options.currencySymbol + '<strong style="font-size: 40px" class="' + idGrandTotal + '"></strong></td>' +
                '<td></td>' +
                '</tr>' :
                '<div class="alert alert-danger" role="alert" id="' + idEmptyCartMessage + '">Su carro est&#225; vac&#237;o.</div>'
            );

            if (!products.length) {
                $('.my-cart-checkout').hide();
                $('.reinicio').hide();
            }
            else {
                $('.my-cart-checkout').show();
                $('.reinicio').show();
            }

            showGrandTotal();
            showDiscountPrice();
        };
        var showModal = function () {
            drawTable();
            $("#" + idCartModal).modal('show');
        };
        var updateCart = function () {
            $.each($("." + classProductQuantity), function () {
                var id = $(this).closest("tr").data("id");
                ProductManager.updatePoduct(id, $(this).val());
            });
        };
        var showGrandTotal = function () {
            if (country == "PERU") {
                if (ProductManager.getTotalPrice() != 0)
                    $("." + idGrandTotal).text((ProductManager.getTotalPrice() / 100).toFixed(2));
                else
                    $("." + idGrandTotal).text(ProductManager.getTotalPrice());
            }
            else
                $("." + idGrandTotal).text(number_format(ProductManager.getTotalPrice()));
        };
        var showDiscountPrice = function () {
            $("#" + idDiscountPrice).text(options.currencySymbol + options.getDiscountPrice(ProductManager.getAllProducts(), ProductManager.getTotalPrice(), ProductManager.getTotalQuantity()));
        };

        /*
        EVENT
        */
        if (options.affixCartIcon) {
            var cartIconBottom = $cartIcon.offset().top * 1 + $cartIcon.css("height").match(/\d+/) * 1;
            var cartIconPosition = $cartIcon.css('position');
            $(window).scroll(function () {
                $(window).scrollTop() >= cartIconBottom ? $cartIcon.addClass(classAffixMyCartIcon) : $cartIcon.removeClass(classAffixMyCartIcon);
            });
        }

        $cartIcon.click(function () {
            options.showCheckoutModal ? showModal() : options.clickOnCartIcon($cartIcon, ProductManager.getAllProducts(), ProductManager.getTotalPrice(), ProductManager.getTotalQuantity());
        });

        $(document).on("click", "." + classProductQuantity, function () {
            var qty = 0;
            var signo = $(this).val();
            var price = $(this).closest("tr").data("price");
            var id = $(this).closest("tr").data("id");

            if (signo === "-") {
                if ($(this).next().val() > 1) {
                    qty = $(this).next().val(+$(this).next().val() - 1).val();
                }
            }

            if (signo === "+") {
                qty = $(this).prev().val(+$(this).prev().val() + 1).val();
            }

            if (qty > 0) {
                if (country == "PERU")
                    $('#total_' + id).html(options.currencySymbol + (qty * price / 100).toFixed(2));
                else
                    $('#total_' + id).html(options.currencySymbol + number_format(qty * price));
                $('#' + id).attr('value', qty);

                ProductManager.updatePoduct(id, qty);
                $cartBadge.text(ProductManager.getTotalQuantity());
                showGrandTotal();
            }
        });

        $(document).on('keypress', "." + classProductQuantity, function (evt) {
            if (evt.keyCode === 38 || evt.keyCode === 40) {
                return;
            }
            evt.preventDefault();
        });

        // Remove Product From Cart
        $(document).on('click', "." + classProductRemove, function () {
            var $tr = $(this).closest("tr");
            var id = $tr.data("id");
            $('#' + id).attr("value", "AGREGAR");
            $('#interaccion_' + id).hide();
            $('.a_demo_static').addClass('a_demo_four my-cart-btn').removeClass('.a_demo_static');
            $('#' + id).attr("value", "AGREGAR");
            $tr.hide(500, function () {
                ProductManager.removeProduct(id);
                drawTable();
                $cartBadge.text(ProductManager.getTotalQuantity());
                showGrandTotal();
            });
        });

        //  PinPad Status After
        function pinPadStatusAfter(data) {

            afterCancel(true);
            if (data.Ok) {
                errorLog = null;
                if (isPrinter) {
                    setTimeout(function () {
                        showInfo("Transacci\u00F3n Aprobada!", "Imprimiendo Tickets", "success");
                        setTimeout(function () {
                            refresh();
                        }, 2000);
                    }, 2000);
                }
                else {
                    setTimeout(function () {
                        showInfoOnlyTimer("Info", "Transacci\u00F3n Aprobada!", "success");
                        setTimeout(function () {
                            refresh();
                        }, 2000);
                    }, 2000);
                }
            }
            else {
                afterCancel(true);
                errorLog = null;
                if (data.IsTransValid) {
                    setTimeout(function () {
                        showInfoOnlyTimer("Transacci\u00F3n Aprobada!", "Imprimiendo Tickets", "success", 2000);
                        setTimeout(function () {
                            refresh();
                        }, 2000);
                    }, 2000);
                }
                else {
                    if (data.ErrorMessage == "A014-TRANSACCION DUPLICADA - NO APROBADO") {
                        showInfoTimer("TRANSACCION DUPLICADA", "- No Aprobado - Espere 1min Aprox.", "error");
                        setTimeout(function () {
                            refresh();
                        }, 50000);
                    }
                    else {
                        setTimeout(function () {
                            showInfo(data.Data, "De necesitar, contacte al personal de apoyo.", "error");
                            setTimeout(function () {
                                refresh();
                            }, 2000);
                        }, 2000);
                    }
                }
            }
        }

        $('#payment_7').on('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            hidePaymentModal();

            var products = ProductManager.getAllProducts();
            var monto = ProductManager.getTotalPrice();
            var qty = ProductManager.getTotalQuantity();

            showInfo("Realice su Pago", "Siga las instrucciones de Transbank.", "info");
            ajaxPostArray_json(urlPinPadActions, products, monto, qty, pinPadStatusAfter);
        });

        $('#payment_8').on('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            hidePaymentModal();

            var products = ProductManager.getAllProducts();
            var monto = ProductManager.getTotalPrice();
            var qty = ProductManager.getTotalQuantity();

            isCash = false;
            showInfo("Realice su Pago", "Siga las instrucciones de Bancard.", "info");
            ajaxPostArray_json(urlPinPadActions, products, monto, qty, pinPadStatusAfter);
        });

        $('#payment_9').on('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            hidePaymentModal();

            var products = ProductManager.getAllProducts();
            var monto = ProductManager.getTotalPrice();
            var qty = ProductManager.getTotalQuantity();

            isCash = true;
            showInfo("Info", "Espere a que se realice la transacción.", "info");
            ajaxPostArray_json(urlPinPadActions, products, monto, qty, pinPadStatusAfter);
        });


        $('#payment_10').on('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            hidePaymentModal();

            var products = ProductManager.getAllProducts();
            var monto = ProductManager.getTotalPrice();
            var qty = ProductManager.getTotalQuantity();

            medioPago = "VisaNet";

            showInfo("Realice su Pago", "Siga las instrucciones de Visanet.", "info");
            ajaxPostArray_json(urlPinPadActions, products, monto, qty, pinPadStatusAfter);
        });

        $('#payment_11').on('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            hidePaymentModal();

            var products = ProductManager.getAllProducts();
            var monto = ProductManager.getTotalPrice();
            var qty = ProductManager.getTotalQuantity();

            medioPago = "ProcesosMC";

            showInfo("Realice su Pago", "Siga las instrucciones de MasterCard.", "info");
            ajaxPostArray_json(urlPinPadActions, products, monto, qty, pinPadStatusAfter);
        });

        // Pay Button
        $(document).on('click', "." + classCheckoutCart, function (e) {
            e.preventDefault();
            e.stopPropagation();

            var products = ProductManager.getAllProducts();
            var monto = ProductManager.getTotalPrice();
            var qty = ProductManager.getTotalQuantity();

            if (!products.length) {
                $("#" + idEmptyCartMessage).fadeTo('fast', 0.5).fadeTo('fast', 1.0);
                return;
            }

            var isCheckedOut = options.checkoutCart(ProductManager.getAllProducts(), ProductManager.getTotalPrice(), ProductManager.getTotalQuantity());
            if (isCheckedOut !== false) {

                //BEGIN
                hideCartModal();

                if (country == "PERU") {
                    showPaymentModal();
                }

                if (country == "CHILE") {
                    if (payment > 1) {
                        showPaymentModal();
                    }
                    showInfo("Realice su Pago", "Siga las Instrucciones de Transbank", "info");
                    ajaxPostArray_json(urlPinPadActions, products, monto, qty, pinPadStatusAfter);
                }

                if (country == "PARAGUAY") {

                    showDocumento(function (data) {
                        if (typeof data !== "undefined") {

                            if (typeof data.presente != "undefined") {
                                setRuc = data;
                                showPaymentModal();
                            }
                            else {
                                setRuc = {
                                    presente: false,
                                    resultado: {
                                        NombreCompleto: data
                                    }
                                };
                                showPaymentModal();
                            }
                        }
                    });
                }
            }
        });

        // Cancel Sale
        $(document).on('click', ".reinicio", function () {
            ShowCancelAction("CANCELAR COMPRA", "Seguro desea cancelar la compra?", "warning", afterCancel);
        });

        // Test Sale
        $(document).on('click', "#testsale", function () {
            errorLog = "0";
        });

        var afterCancel = function (isCancel) {
            if (isCancel) {
                ProductManager.clearProduct();
                $cartBadge.text(ProductManager.getTotalQuantity());
                showGrandTotal();
                $('.a_demo_static').addClass('a_demo_four my-cart-btn').removeClass('.a_demo_static');

                $.each($(".a_demo_four"), function () {
                    $(this).attr("value", '');
                    $(this).text("AGREGAR");

                    var product = $(this).closest('.product');
                    product.data('quantity', 0);
                    $('#interaccion_' + $(this).data('id')).hide();
                    $('.a_demo_static').addClass('a_demo_four my-cart-btn').removeClass('.a_demo_static');
                });
            } else {
                $("#" + idCartModal).modal("show");
            }
        };

        $(document).on('click', targetSelector, function () {

            var $target = $(this);
            options.clickOnAddToCart($target);

            var id = $target.data('id');
            var name = $target.data('name');
            var summary = $target.data('summary');
            var price = $target.data('price');
            var quantity = $target.data('quantity');
            var image = $target.data('image');
            var extra = $target.data('extra');
            var signo = $target.val();
            var product = $(this).closest('.product');
            var qty = "";

            if (signo === '-') {
                qty = parseInt($('#' + id).attr('value')) - 1;
                if (qty > 0) {
                    product.data('quantity', qty);
                    ProductManager.updatePoduct(id, qty);
                    $cartBadge.text(ProductManager.getTotalQuantity());
                    updateProduct(product);
                    showGrandTotal();
                    return;
                }
                else {
                    product.data('quantity', 0);
                    ProductManager.updatePoduct(id, 0);
                    ProductManager.removeProduct(id);
                    drawTable();
                    $cartBadge.text(ProductManager.getTotalQuantity());

                    $('#interaccion_' + id).hide();
                    $('.a_demo_static').addClass('a_demo_four my-cart-btn').removeClass('.a_demo_static');
                    $('.a_demo_four', product).text('');
                    $('.a_demo_four', product).attr("value", 'AGREGAR');
                }
                return;
            }

            if (signo === '+') {
                qty = parseInt($('#' + id).attr('value')) + 1;
                product.data('quantity', qty);
                ProductManager.updatePoduct(id, qty);
                $cartBadge.text(ProductManager.getTotalQuantity());
                updateProduct(product);
                showGrandTotal();
                return;
            }

            product.data('quantity', 1);
            ProductManager.setProduct(id, name, summary, price, quantity, image, extra);
            $cartBadge.text(ProductManager.getTotalQuantity());
            options.afterAddOnCart(ProductManager.getAllProducts(), ProductManager.getTotalPrice(), ProductManager.getTotalQuantity());

            showGrandTotal();
            $(this).addClass('a_demo_static');
            $(this).removeClass('my-cart-btn a_demo_four');
            $('#interaccion_' + id).show();
            updateProduct(product);
            $(this).text('');
            adicionales(id);
        });

        function adicionales(id) {
            $("#extraModal_" + id).modal('show');
        }
    };

    $.fn.myCart = function (userOptions) {
        OptionManager.loadOptions(userOptions);
        loadMyCartEvent(this.selector);
        return this;
    };

    $.fn.disableSelection = function () {
        return this.each(function () {
            if (typeof this.onselectstart != 'undefined') {
                this.onselectstart = function () { return false; };
            } else if (typeof this.style.MozUserSelect != 'undefined') {
                this.style.MozUserSelect = 'none';
            } else {
                this.onmousedown = function () { return false; };
            }
        });
    };

})(jQuery);