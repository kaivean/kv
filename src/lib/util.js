/**
 * @file 通用函数库
 * @author kaivean(kaisey2012@163.com)
 */

define(function (require) {
    var is = require('./is');

    /**
     * 通用函数库
     *
     * @class
     * @singleton
     */
    var util = {};

    // 全局id
    util.guid = 1;

    /**
     * 扩展合并, 非深度合并
     * 多个参数从右到左合并到第一个参数
     *
     * @param {Mixed} obj 遍历的对象
     * @return {Object} 新对象
     */
    util.extend = function (obj) {
        if (!is.object(obj)) {
            return obj;
        }
        util.each(util.slice(arguments, 1), function (source) {
            if (source) {
                for (var prop in source) {
                    if (is.has(source, prop)) {
                        obj[prop] = source[prop];
                    }
                }
            }
        });
        return obj;
    };

    /**
     * 获取对象的keys
     *
     * @param {Mixed} obj 截取的对象
     * @return {Array} key数组
     */
    util.keys = function (obj) {
        if (!is.object(obj)) {
            return [];
        }
        if (Object.keys) {
            return Object.keys(obj);
        }
        var keys = [];
        for (var key in obj) {
            if (is.has(obj, key)) {
                keys.push(key);
            }
        }
        return keys;
    };

    /**
     * 对象所在数组的索引，不存在返回-1
     *
     * @param {Array} array 对象
     * @param {Mixed} value 数组值
     * @return {number} 索引
     */
    util.indexOf = function (array, value) {
        if (is.nul(array)) {
            return -1;
        }

        var length = array.length;
        for (var i = 0; i < length; i++) {
            if (array[i] === value) {
                return i;
            }
        }
        return -1;
    };

    /**
     * 截取，实际调用Array.prototype.slice，可以传递arguments
     *
     * @param {Mixed} obj 截取的对象，Array或arguments
     * @return {Array} 新数组
     */
    util.slice = function (obj) {
        var args = Array.prototype.slice.call(arguments, 1);
        return Array.prototype.slice.apply(obj, args);
    };

    /**
     * 遍历
     *
     * @example
     *     util.each([1, 2, 3], function (value, key, obj) {});
     *
     * @param {Mixed} obj 遍历的对象
     * @param {Function} iterator 回调函数
     * @param {Object} context 回调函数的上下文
     */
    util.each = function (obj, iterator, context) {
        if (is.nul(obj)) {
            return;
        }

        // es5
        if (Array.prototype.forEach && obj.forEach === Array.prototype.forEach) {
            obj.forEach(iterator, context);
        }
        // Array
        else if (obj.length === +obj.length) {
            var length = obj.length;
            for (var i = 0; i < length; i++) {
                if (iterator.call(context, obj[i], i, obj) === {}) {
                    return;
                }
            }
        }
        // Object
        else {
            var keys = util.keys(obj);
            var len = keys.length;
            for (var j = 0; j < len; j++) {
                if (iterator.call(context, obj[keys[j]], keys[j], obj) === {}) {
                    return;
                }
            }
        }
    };

    /**
     * 当前时间戳
     *
     * @example
     *     .now();
     *     => 1392066795351
     *
     * @return {number} 时间戳
     */
    util.now = Date.now || function () {
        return new Date().getTime();
    };

    /**
     * 删除目标字符串两端的空白字符
     *
     * @param {string} str 目标字符串
     * @param {(string | RegExp)} triment 待删除的字符或规则
     *
     * @return {string} 删除两端空白字符后的字符串
     */
    util.trim = function (str, triment) {
        var whitespace = /^[\s\xa0\u3000]+|[\u3000\xa0\s]+$/g;
        return str && String(str).replace(triment || whitespace, '') || '';
    };

    return util;
});
