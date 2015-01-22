/**
 * @file test
 * @author kaivean(kaisey2012@163.com)
 */

define(function (require) {
    var  lib = require('kv/lib');

    describe('lib.deferred', function () {
        var $ = require('jquery');

        function doSomething() {
            var defer = lib.deferred();
            // var defer = $.Deferred();
            setTimeout(function () {
                defer.resolve('hello world');
            }, 2000);

            setTimeout(function () {
                console.log('four second over');
                defer.reject('hello world again');
            }, 4000);

            return defer;
        }
        it('always', function () {
            doSomething().then(
                function (value) {
                    console.log('ok fisrt: ' + value, this);
                },
                function (error) {
                    console.log('error fisrt: ' + error);
                }
            ).then(
                function (value) {
                    console.log('ok second: ' + value, this);
                },
                function (error) {
                    console.log('error second: ' + error);
                }
            ).always(function (value) {
                expect(' be called').toEqual(' be called');
            }).done(function (value) {
                console.log('done: ' + value, this);
            }).fail(function (value) {
                console.log('fail: ' + value, this);
            });
        });
        console.log('my is fisrt');
    });
});
