/**
 * @file  通用函数库
 * @author wukaifang(wukaifang@baidu.com)
 */

define(function (require) {
    var lib = {};

    var util = require('./lib/util');
    var helper = require('./lib/helper');
    var fn = require('./lib/fn');

    util.extend(lib, util, helper, fn);

    lib.is = require('./lib/is');
    lib.Observer = require('./lib/Observer');
    lib.deferred = require('./lib/deferred');
    lib.url = require('./lib/url');
    lib.json = require('./lib/json');
    lib.cookie = require('./lib/cookie');
    lib.event = require('./lib/event');

    lib.dom = require('jquery');
    lib.ajax = lib.dom.ajax;

    return lib;
});
