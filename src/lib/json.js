/**
 * json库
 *
 * @file json库
 * @author kaivean(kaisey2012@163.com)
 */

define(function (require) {
    var json2 = require('json2');

    /**
     * json库
     * 委托json2模块
     * 暂时提供接口
     *
     * @class
     * @singleton
     */
    var json = {};

    /**
     * string转换成json
     *
     * @param {string} str 转换的字符串
     *
     * @return {Object} 结果
     */
    json.parse = function (str) {
        return json2.parse(str);
    };

    /**
     * string 转换成 json
     *
     *    @example
     *    text = JSON.stringify(['e', {pluribus: 'unum'}]);
     *    // text is '["e",{"pluribus":"unum"}]'
     *
     * @param {Oject} obj any JavaScript value, usually an object or array.
     * @return {string} 结果
     */
    json.stringify = function (obj) {
        return json2.stringify(obj);
    };

    return json;
});
