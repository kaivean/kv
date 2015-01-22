/**
 * 判断库-独立库
 *
 * @file 判断库-独立库
 * @author kaivean(kaisey2012@163.com)
 */

define(function (require) {

    /**
     * 判断库-独立库
     *
     * @class
     * @singleton
     */
    var is = {};

    /**
     * 判断是否是某类型
     *
     * @param {string} type 类型
     * @param {Object} obj 待判断对象
     * @return {boolean} 结果
     * @private
     */
    function _is(type, obj) {
        return obj !== undefined
            && obj !== null
            && Object.prototype.toString.call(obj) === '[object ' + type + ']';
    }

    /**
     * 是否为IE6
     *
     * @return {boolean} 是否IE6
     */
    is.ie6 = function () {
        return !window.XMLHttpRequest;
    };

    /**
     * 是否为空
     * 值为true的情况： null/空数组／空字符串／空对象
     *
     * @param {Object} obj 待判断对象
     * @return {boolean} 判断结果
     */
    is.empty = function(obj) {
        if (obj == null) {
            return true;
        }
        if (is.array(obj) || is.string(obj) || is.args(obj)) {
            return obj.length === 0;
        }
        for (var key in obj) {
            if (is.has(obj, key)) {
                return false;
            }
        }
        return true;
    };

    /**
     * 判断是否是 Number 类型
     *
     * @param {Object} obj 待判断对象
     *
     * @return {boolean} 结果
     */
    is.number = function (obj) {
        return _is('Number', obj);
    };

    /**
     * 判断是否是 String 类型
     *
     * @param {Object} obj 待判断对象
     *
     * @return {boolean} 结果
     */
    is.string = function (obj) {
        return _is('String', obj);
    };

    /**
     * 判断是否是 Array 类型
     *
     * @param {Object} obj 待判断对象
     *
     * @return {boolean} 结果
     */
    is.array = function (obj) {
        return _is('Array', obj);
    };

    /**
     * 判断是否是 Arguments 类型
     *
     * @param {Object} obj 待判断对象
     *
     * @return {boolean} 结果
     */
    is.args = function (obj) {
        return _is('Arguments', obj);
    };

    // fallback for IE: is.args
    // 参考underscore 1.7.0
    if (!is.args(arguments)) {
        is.args = function (obj) {
            return is.has(obj, 'callee');
        };
    }

    /**
     * 判断是否是 Object 类型
     *
     * @param {Object} obj 待判断对象
     *
     * @return {boolean} 结果
     */
    is.object =  function (obj) {
        return _is('Object', obj);
    };

    /**
     * 判断是否是 Boolean 类型
     *
     * @param {Object} obj 待判断对象
     *
     * @return {boolean} 结果
     */
    is.boolean = function(obj) {
        return obj === true || obj === false || Object.prototype.toString.call(obj) === '[object Boolean]';
    };

    /**
     * 判断是否是 Function 类型
     *
     * @param {Object} obj 待判断对象
     *
     * @return {boolean} 结果
     */
    is.fn = function (obj) {
        return _is('Function', obj);
    };

    /**
     * 判断是否是 是否是构造器的实例
     *
     * @param {Mixed} value 实例
     * @param {Object} constructor 构造器
     *
     * @return {boolean} 结果
     */
    is.instance = function (value, constructor) {
        return value instanceof constructor;
    };

    /**
     * 判断是否是 undefined 类型
     *
     * @param {Object} obj 待判断对象
     *
     * @return {boolean} 结果
     */
    is.undef = function(obj) {
        return obj === void 0;
    };

    /**
     * 判断是否是 不是undefined 类型
     *
     * @param {Object} obj 待判断对象
     *
     * @return {boolean} 结果
     */
    is.def = function(obj) {
        return !is.undef(obj);
    };

    /**
     * 判断是否是 null 类型
     *
     * @param {Object} obj 待判断对象
     *
     * @return {boolean} 结果
     */
    is.nul = function(obj) {
        return obj === null;
    };

    /**
     * 判断是否是有属性， 只是对象直接的属性，不是原型链上的
     *
     * @param {Object} obj 待判断对象
     * @param {Object} key 属性名
     * @return {boolean} 结果
     */
    is.has = function(obj, key) {
        return obj != null && Object.prototype.hasOwnProperty.call(obj, key);
    };

    return is;
});
