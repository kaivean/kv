/**
 * @file 中间页入口文件
 * @author wukaifang(wukaifang@baidu.com)
 */

define(function (require, exports) {

    var lib = require('kv/lib');

    var Form = require('kv/form/Form');

    var form;
    /**
     * 初始化模块
     *
     * @public
     */
    exports.init = function () {
        form = new Form({
            main: '.left'
        });
    };

    return exports;
});
