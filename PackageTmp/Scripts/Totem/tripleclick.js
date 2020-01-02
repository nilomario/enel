//triple click
(function ($) {
    $.event.special.trplclick = {
        setup: function () {
            $(this).bind('click', clickHandler);
        },
        teardown: function () {
            $(this).unbind('click', clickHandler);
        },
        add: function (obj) {
            var oldHandler = obj.handler;

            var defaults = {
                minClickInterval: 100,
                maxClickInterval: 500,
                minPercentThird: 85.0,
                maxPercentThird: 130.0
            };

            var hasOne = false,
                hasTwo = false,
                time = [0, 0, 0],
                diff = [0, 0];

            obj.handler = function (event, data) {
                var now = Date.now(),
                    conf = $.extend({}, defaults, event.data);

                if (time[1] && now - time[1] >= conf.maxClickInterval) {
                    obj.clearRuntime();
                }
                if (time[0] && time[1] && now - time[0] >= conf.maxClickInterval) {
                    obj.clearRuntime();
                }

                if (hasTwo) {
                    time[2] = Date.now();
                    diff[1] = time[2] - time[1];

                    var deltaPercent = 100.0 * (diff[1] / diff[0]);

                    if (deltaPercent >= conf.minPercentThird && deltaPercent <= conf.maxPercentThird) {
                        oldHandler.apply(this, arguments);
                    }
                    obj.clearRuntime();
                }

                else if (!hasOne) {
                    hasOne = true;
                    time[0] = Date.now();
                }

                else if (hasOne) {
                    time[1] = Date.now();
                    diff[0] = time[1] - time[0];

                    (diff[0] >= conf.minClickInterval && diff[0] <= conf.maxClickInterval) ?
                        hasTwo = true : obj.clearRuntime();
                }
            };

            obj.clearRuntime = function () {
                hasOne = false;
                hasTwo = false;
                time[0] = 0;
                time[1] = 0;
                time[2] = 0;
                diff[0] = 0;
                diff[1] = 0;
            };
        }
    };
    function clickHandler(event) {
        $(this).triggerHandler('trplclick', [event.data]);
    }
})(jQuery);