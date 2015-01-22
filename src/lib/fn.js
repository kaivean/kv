/**
 * 函数相关库
 *
 * @file 函数相关库
 * @author kaivean(kaisey2012@163.com)
 */

define(function (require) {
    var is = require('./is');
    var util = require('./util');

    /**
     * 函数相关库
     *
     * @class
     * @singleton
     */
    var fn = {};

    /**
     * 绑定一个对象到函数里，作为函数上下文即this对象
     * @param  {Function} func    函数
     * @param  {Object} context 对象上下文
     * @return {Function}         绑定了的函数
     */
    fn.bind = function (func, context) {
        if (Function.prototype.bind && func.bind === Function.prototype.bind) {
            return Function.prototype.bind.apply(func, util.slice(arguments, 1));
        }

        if (!is.fn(func)) {
            throw new TypeError('Bind must be called on a function');
        }

        var args = util.slice(arguments, 2);
        var bound = function () {
            if (!is.instance(this, bound)) {
                return func.apply(context, args.concat(util.slice(arguments)));
            }
        };
        return bound;
    };

    /**
     * 频率控制 返回函数连续调用时，fn 执行频率限定为每多少时间执行一次
     *
     * @param  {number} delay   延迟时间，单位毫秒
     * @param  {boolean} noTrailing 给 immediate参数传递false 绑定的函数先执行，而不是delay后后执行
     * @param  {Function} callback 需要调用的函数
     * @param {boolean} debounceMode 是否使用debounce模式，实际相当于变成了debounce函数
     *
     * @return {Function}    实际调用函数
     */
    fn.throttle = function (delay, noTrailing, callback, debounceMode) {
        // After wrapper has stopped being called, this timeout ensures that
        // `callback` is executed at the proper times in `throttle` and `end`
        // debounce modes.
        var timeoutId;

        // Keep track of the last time `callback` was executed.
        var lastExec = 0;

        // `noTrailing` defaults to falsy.
        if (typeof noTrailing !== 'boolean') {
            debounceMode = callback;
            callback = noTrailing;
            noTrailing = undefined;
        }

        // The `wrapper` function encapsulates all of the throttling / debouncing
        // functionality and when executed will limit the rate at which `callback`
        // is executed.
        function wrapper() {
            var that = this;
            var elapsed = +new Date() - lastExec;
            var args = arguments;

            // Execute `callback` and update the `lastExec` timestamp.
            function exec() {
                lastExec = +new Date();
                callback.apply(that, args);
            }

            // If `debounceMode` is true (atBegin) this is used to clear the flag
            // to allow future `callback` executions.
            function clear() {
                timeoutId = undefined;
            }

            if (debounceMode && !timeoutId) {
                // Since `wrapper` is being called for the first time and
                // `debounceMode` is true (atBegin), execute `callback`.
                exec();
            }

            // Clear any existing timeout.
            timeoutId && clearTimeout(timeoutId);

            if (debounceMode === undefined && elapsed > delay) {
                // In throttle mode, if `delay` time has been exceeded, execute
                // `callback`.
                exec();

            }
            else if (noTrailing !== true) {
                // In trailing throttle mode, since `delay` time has not been
                // exceeded, schedule `callback` to execute `delay` ms after most
                // recent execution.
                //
                // If `debounceMode` is true (atBegin), schedule `clear` to execute
                // after `delay` ms.
                //
                // If `debounceMode` is false (at end), schedule `callback` to
                // execute after `delay` ms.
                timeoutId = setTimeout(
                    debounceMode ? clear : exec,
                    debounceMode === undefined ? delay - elapsed : delay
                );
            }
        }

        // Set the guid of `wrapper` function to the same of original callback, so
        // it can be removed in jQuery 1.4+ .unbind or .die by using the original
        // callback as a reference.
        if (util.guid) {
            wrapper.guid = callback.guid = callback.guid || util.guid++;
        }

        // Return the wrapper function.
        return wrapper;
    };

    /**
     * 空闲控制 返回函数连续调用时，空闲时间必须大于或等于 delay，callback 才会执行
     *
     * @param {number} delay 空闲时间
     * @param {boolean} atBegin 给 atBegin参数传递false 绑定的函数先执行，而不是delay后后执行
     * @param {Function} callback 要调用的函数
     *
     * @return {Function}    实际调用函数
     */
    fn.debounce = function (delay, atBegin, callback) {
        return callback === undefined
            ? fn.throttle(delay, atBegin, false)
            : fn.throttle(delay, callback, atBegin !== false);
    };

    return fn;
});
