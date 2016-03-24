(function ($, undefined) {
    "use strict";
    $.fn.levelSelector = function (options) {
        var defaults = {
            url: "/levelSelector/list",
            handel: function (v) {
                return "<option value=" + v.Id + ">" + v.Name + "</option>";
            },
            path: 0,
            sChar: ',',
            change: function (arrays) { return arrays; },
            create: function () {
                return $("<select>");
            },
            filter: function (arrays) {
                return arrays;
            },
            param: function (arrays) {
                return { ids: arrays.join(defaults.sChar) };
            },
            provider: function (arrays, callback) {
                $.ajax(defaults.url, {
                    type: 'GET',
                    dataType: "json",
                    cache: true,
                    data: defaults.param(arrays || [0]),
                    success: callback
                });
            },
            defOption: 'Choose..'
        },
        fn = function () {
            var root = $(this);
            var methods = {
                init: function () {
                    $("select", root).remove();
                    root.on("change", "select", methods.add);
                    methods.reInit();
                },
                ajaxCall: function (select, data) {
                    data = defaults.filter(data);
                    if (data && data.length !== 0) {
                        select.append(methods.opts(data)).show();
                        return;
                    }
                    select.remove();
                },
                add: function () {
                    if ((this.value - 0) !== 0) {
                        var select = defaults.create.apply(root);
                        if (this !== root) {
                            $(this).nextAll("select").remove();
                            select.insertAfter(this);
                        } else {
                            select.appendTo(this);
                        }
                        select.hide();
                        var arrays = methods.get();
                        defaults.change.call(root, arrays);
                        defaults.provider(arrays, function (data) {
                            methods.ajaxCall(select, data);
                        });
                    } else {
                        $(this).nextAll("select").remove();
                    }
                },
                opts: function (data) {
                    var html = ['<option value="0">', defaults.defOption, '</option>'];
                    for (var i = 0; i < data.length; i++) {
                        html.push(defaults.handel(data[i]));
                    }
                    return html.join('');
                },
                get: function () {
                    var ls = [0];
                    $("select", root).each(function () {
                        if (this.value && /\d+/.test(this.value)) {
                            ls.push(this.value - 0);
                        }
                    });
                    return ls;
                },
                reInit: function () {
                    var path = root.attr("val") || defaults.path;
                    if (path && /*/^(\d+,?)+$/.test(path)&& */path !== '0') {
                        var arrays = path.split(defaults.sChar);
                        $.each(arrays, function (i) {
                            if (i > 0 && i < arrays.length) {
                                var select = defaults.create.apply(root).appendTo(root);
                                defaults.provider(arrays.slice(0, i), function (data) {
                                    methods.ajaxCall(select, data);
                                    select.val(arrays[i] || 0);
                                });
                            }
                        });
                    } else {
                        methods.add.apply(root);
                    }
                }
            };
            methods.init();
        };
        defaults = $.extend({}, defaults, options);
        return this.each(fn);
    };
})(jQuery);