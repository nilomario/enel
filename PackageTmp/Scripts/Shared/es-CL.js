$(function () {
    jQuery.extend(jQuery.validator.methods, {
        date: function (value, element) {

            if (this.optional(element))
                return true;

            if (!(/^\d\d?[\.\/-]\d\d?[\.\/-]\d\d\d?\d?$/.test(value) || /^\d{1,2}\-\d{1,2}\-\d{4}$/.test(value)))
                return false;

            var adata = value.split('-');

            var mm = parseInt(adata[1], 10);

            var dd = parseInt(adata[0], 10);

            var yyyy = parseInt(adata[2], 10);

            var xdata = new Date(yyyy, mm - 1, dd);

            if ((xdata.getFullYear() == yyyy) && (xdata.getMonth() == mm - 1) && (xdata.getDate() == dd))
                return true;

            return false;
        },
        number: function (value, element) {
            return this.optional(element) || /^-?(?:\d+|\d{1,3}(?:\.\d{3})+)(?:,\d+)?$/.test(value);
        },
        range: function (value, element, param) {
            var globalizedValue = value.replace(".", "");
            globalizedValue = globalizedValue.replace(",", ".");
            return this.optional(element) || (globalizedValue >= param[0] && globalizedValue <= param[1]);
        }
    });
});