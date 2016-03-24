(function ($, address) {
    /*
      ======== A Handy Little QUnit Reference ========
      http://api.qunitjs.com/
  
      Test methods:
        module(name, {[setup][ ,teardown]})
        test(name, callback)
        expect(numberOfAssertions)
        stop(increment)
        start(decrement)
      Test assertions:
        ok(value, [message])
        equal(actual, expected, [message])
        notEqual(actual, expected, [message])
        deepEqual(actual, expected, [message])
        notDeepEqual(actual, expected, [message])
        strictEqual(actual, expected, [message])
        notStrictEqual(actual, expected, [message])
        throws(block, [expected], [message])
    */
    module('jQuery.levelSelector', {
        setup: function () {
            this.elems = $('#qunit-fixture');
        }
    });

    test('修改测试 handel 回调方法是否正常工作 ', function () {
        expect(1);
        this.elems.levelSelector({
            handel: function (v) {
                return '<option value="' + v.Id + '">' + v.Id + '@' + v.Name + '</option>';
            },
            provider: function (arrays, callback) {
                callback(arrays.length === 1 ? [{ Id: 1, Name: "test option" }] : []);
            }
        });
        strictEqual(this.elems.find("option").eq(1).html(), '1@test option', 'handel回调方法正常工作的');
    });
    test('通过path参数初始化是否正常工作', function () {
        expect(1);
        this.elems.levelSelector({
            path: '0,10,169,2073',
            provider: function (arrays, callback) {
                var id = (arrays[arrays.length - 1] - 0);
                var data = [];
                $.each(address, function (i, v) {
                    if (v.ParentId === id) {
                        data.push(v);
                    }
                });
                callback(data);
            }
        });
        var html = [];
        this.elems.find("option:selected").each(function () {
            html.push(this.innerHTML);
        });
        strictEqual(html.join(), '江苏省,苏州市,平江区', '通过path参数初始化是正常工作的');
    });

    test("重写使用其他符合分隔", function () {
        expect(1);
        this.elems.levelSelector({
            path: '0|10|169|2073',
            sChar: '|',
            provider: function (arrays, callback) {
                var id = (arrays[arrays.length - 1] - 0);
                var data = [];
                $.each(address, function (i, v) {
                    if (v.ParentId === id) {
                        data.push(v);
                    }
                });
                callback(data);
            }
        });
        var html = [];
        this.elems.find("option:selected").each(function () {
            html.push(this.innerHTML);
        });
        strictEqual(html.join(), '江苏省,苏州市,平江区', '通过sChar分隔');
    });
    //module(':levelSelector selector', {
    //    // This will run before each test in this module.
    //    setup: function () {
    //        this.elems = $('#qunit-fixture').children();
    //    }
    //});

    //test('is awesome', function () {
    //    expect(1);
    //    // Use deepEqual & .get() when comparing jQuery objects.
    //    deepEqual(this.elems.filter(':levelSelector').get(), this.elems.last().get(), 'knows awesome when it sees it');
    //});

}(jQuery, window.address));
