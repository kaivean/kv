/**
 * @file deferred
 * @author kaivean(kaisey2012@163.com)
 */

define(function (require) {
    var is = require('./is');
    var util = require('./util');

    var tuple = {
        pending: 0,
        resolved: 1,
        rejected: 2
    };

    /**
     * 是否是promise对象
     *
     * @param  {Object} obj 判断对象
     * @return {boolean}     判断结果
     * @private
     */
    function isPromise(obj) {
        return obj && is.fn(obj.then);
    }

    /**
     * 延迟对象
     *
     * @class
     * @singleton
     *
     * @return {Object} deferred对象
     *
     *      @example
     *      function doSomething() {
     *          var defer = lib.deferred();
     *          setTimeout(function () {
     *              defer.resolve('hello world');
     *          }, 2000);
     *          return defer;
     *      }
     *      doSomething().then(
     *          function (value) {
     *              console.log('ok fisrt: ' + value);
     *          },
     *          function (error) {
     *              console.log('error fisrt: ' + error);
     *          }
     *      ).then(
     *          function (value) {
     *              console.log('ok second: ' + value);
     *          },
     *          function (error) {
     *              console.log('error second: ' + error);
     *          }
     *      );
     */
    function deferred() {
        var defer = {};
        var state = tuple.pending;
        var promise = {
            state: function () {
                return state;
            },

            then: function (doneCallback, failCallback) {
                var oldDef = defer;
                var newDefer = deferred();

                oldDef.resolveWith = function (value) {
                    var callback = is.fn(doneCallback) && doneCallback;
                    var returnVal = doneCallback && doneCallback.call(oldDef.promise, value);

                    if (isPromise(returnVal)) {
                        returnVal.then(newDefer.resolve, newDefer.reject);
                    }
                    else {
                        newDefer.resolve(callback ? returnVal : value);
                    }
                };

                oldDef.rejectWith = function (error) {
                    var callback = is.fn(failCallback) && failCallback;
                    var returnVal = failCallback && failCallback.call(oldDef.promise, error);
                    if (isPromise(returnVal)) {
                        returnVal.then(newDefer.resolve, newDefer.reject);
                    }
                    else {
                        newDefer.reject(callback ? returnVal : error);
                    }
                };

                return newDefer.promise;
            },

            always: function (handler) {
                return this.done(handler).fail(handler);
            },

            done: function (handler) {
                return this.then(handler);
            },

            fail: function (handler) {
                return this.then(null, handler);
            }
        };
        promise.promise = promise;

        defer.resolve = function (value) {
            if (state > tuple.pending) {
                return;
            }
            state = tuple.resolved;
            this.resolveWith && this.resolveWith(value);
        };

        defer.reject = function (error) {
            if (state > tuple.pending) {
                return;
            }
            state = tuple.rejected;
            this.rejectWith && this.rejectWith(error);
        };

        defer.guid = util.guid++;

        util.extend(defer, promise);
        return defer;
    }

    return deferred;
});
