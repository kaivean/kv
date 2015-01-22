/**
 * @file url库
 * @author kaivean(kaisey2012@163.com)
 */

define(function (require) {
    var is = require('./is');
    var json = require('./json');

    /**
     * url库
     *
     * @class
     * @singleton
     */
    var url = {};

    /**
     * 解析url字符串
     * 如果没有传url，默认获取当前链接的url参数字符串
     *
     * @example
     *     url.parse('http://www.baidu.com/life/hunshapic?module=life&zt=ps#list');
     *     // {
     *       root: 'http://www.baidu.com',
     *       protocol: 'http',
     *       host: 'www.baidu.com',
     *       path: '/life/hunshapic',
     *       query: {
     *           module: 'life',
     *           zt: 'ps'
     *       },
     *       hash: 'list'
     *    }
     *
     * @param {string} link 待转化的url字符串
     *
     * @return {Object} 结果
     */
    url.parse = function (link) {
        var obj = {};

        if (is.undef(url)) {
            link = window.location.href;
        }

        var rest = link;

        // protocol
        var index = rest.indexOf('://');
        if (index > -1) {
            obj.protocol = rest.substring(0, index);
            rest = rest.substring(index + 3); // 去://
        }

        // host
        // 第一个/的位置
        index = rest.indexOf('/');
        if (index > -1) {
            obj.host = rest.substring(0, index);
            rest = rest.substring(index); // 保留/

            if (obj.protocol && obj.host) {
                obj.root = obj.protocol + '://' + obj.host;
            }
        }

        // path
        // 第一个?的位置
        index = rest.indexOf('?');
        if (index > -1) {
            obj.path = rest.substring(0, index);
            rest = rest.substring(index + 1); // 跳过?
        }

        // query
        // 第一个#的位置
        index = rest.indexOf('#');
        if (index > -1) {
            var queryStr = rest.substring(0, index);
            obj.query = url.parseQuery(queryStr);
            rest = rest.substring(index + 1); // 跳过#
            obj.hash = rest;
        }

        return obj;
    };

    /**
     * 将query字符串转换成json对象
     *
     * @example
     *     url.parseQuery('module=life&zt=ps')
     *     // {module: "life", zt: "pss"}
     *
     * @param {string} queryStr query字符串
     *
     * @return {Object} 结果
     */
    url.parseQuery = function (queryStr) {

        if (is.undef(queryStr)) {
            queryStr = window.location.search.substr(1);
        }

        var obj = {};
        var params = queryStr.substring(queryStr.indexOf('?') + 1, queryStr.length).split('&');
        for (var i = 0; i < params.length; i++) {
            var param = params[i];
            var kv = param.split('=');
            if (kv[0]) {
                obj[kv[0]] = decodeURIComponent(kv[1]);
            }
        }

        return obj;
    };

    /**
     * 将参数对象转换为URL字符串
     *
     * @param {Object} query 参数对象
     * @return {string} 转换后的URL字符串，相当于`search`部分
     * @static
     */
    url.serializeQuery = function (query) {
        if (!query) {
            return '';
        }

        var search = '';
        for (var key in query) {
            if (is.has(query, key)) {
                var value = query[key];
                if (is.object(value)) {
                    value = json.stringify(value);
                }
                // 如果`value`是数组，其`toString`会自动转为逗号分隔的字符串
                search += '&' + encodeURIComponent(key) + '=' + encodeURIComponent(value);
            }
        }

        return search.slice(1);
    };

    return url;
});
