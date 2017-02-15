/**
 * @file 控件基类
 * @author kaivean(kaisey2012@163.com)
 */

define(function (require) {

    var lib = require('./lib');
    var $ = lib.dom;

    /**
     * 控件基类
     * 只可继承，不可实例化
     *
     * @class
     * @abstract
     */
    var Control = lib.createClass({
        /**
         * 控件类型标识
         *
         * @type {string}
         * @readonly
         */
        type: 'Control',

        /**
         * 控件类名前缀
         *
         * @type {string}
         * @protected
         */
        prefix: null,

        /**
         * 主控件
         *
         * @type {HTMLElement}
         * @protected
         */
        main: null,

        /**
         * 默认选项
         *
         * @type {Object}
         * @protected
         */
        defaultOption: null,

        /**
         * 控件初始化
         *
         * @param {Object} option 配置参数
         * @protected
         */
        init: function (option) {

            // 初始化前缀
            this.prefix = 'k' + this.type.toLowerCase();

            // 假如子类定义了defaultOption，就用子类的
            this.defaultOption = this.defaultOption || {};

            /**
             * 保存事件数据的数组
             * @type {array}
             * @protected
             */
            this._listners = [];

            option = option || {};
            this.option = $.extend({}, this.defaultOption, option);

            if (this.option.prefix) {
                this.prefix = this.option.prefix + '-' + this.type.toLowerCase();
            }

            if (lib.is.string(this.option.main) || lib.is.object(this.option.main)) {
                this.main = $(this.option.main).eq(0);
            }
            else {
                this.main = $('.' + this.prefix).eq(0);
            }
            this._listners = [];
        },

        /**
         * 获得类名
         *
         * @param {string} prop 类名后缀
         * @param {boolean} hasDot 是否带有点号
         * @return {string} 类名
         * @protected
         */
        cn: function (prop, hasDot) {
            this.prefix = 'k' + this.type.toLowerCase();
            if (hasDot) {
                return '.' + this.prefix + '-' + prop;
            }
            return this.prefix + '-' + prop;
        },

        /**
         * 执行静态函数，写在模块内部的函数
         *
         * @return {Object} 函数执行的结果
         * @protected
         *
         */
        p: function () {
            var obj = arguments[0];
            // obj 是函数
            if (lib.is.fn(obj)) {
                var args = Array.prototype.slice.call(arguments, 1);
                return obj.apply(this, args);
            }
        },

        /**
         * 绑定事件
         * 该函数实际是去掉第一个参数 的arguments传递给jQuery的on函数
         *
         * @example
         *     this.on('#id','click',handle);
         *
         * @return {Object} 当前实例
         */
        on: function () {

            var obj = arguments[0];
            var args;
            // 此时绑定的对象就是自己
            if (lib.is.string(obj)) {
                obj = $(this);
                args = Array.prototype.slice.call(arguments, 0);
                // 最后一个是函数
                var func = args.pop();

                // 这么做的目的是，去掉jQuery回调参数的e
                args[args.length] = function (e, data) {
                    func.call(this, data);
                };
            }
            else {
                args = Array.prototype.slice.call(arguments, 1);
            }

            var event = args[0];
            args[args.length - 1] = lib.bind(args[args.length - 1], this);
            args[0] = event + '.' + this.prefix;
            obj.on.apply(obj, args);

            // 将事件元素 事件名称 等信息保存起来以便解绑事件
            var listner = {};
            listner.obj =  $(obj); // 事件元素
            listner.args = args;
            this._listners.push(listner);

            return this;
        },

        /**
         * 解绑事件
         * 该函数实际是去掉第一个参数 的arguments传递给jQuery的off函数
         *
         * @example
         *     this.off('#id','click',handle);
         *
         * @return {Object} 当前实例
         */
        off: function () {
            var obj = arguments[0];
            var args;
            // 此时绑定的对象就是自己
            if (lib.is.string(obj)) {
                obj = $(this);
                args = Array.prototype.slice.call(arguments, 0);
            }
            else {
                args = Array.prototype.slice.call(arguments, 1);
            }

            var event = args[0];
            args[0] = event + '.' + this.prefix;
            obj.off.apply(obj, args);

            return this;
        },
        /**
         * 触发事件
         * 该函数实际是去掉第一个参数 的arguments传递给jQuery的trigger函数
         *
         * @example
         *     this.fire('change', {
         *         oldId: this.oldIdx,
         *         curId: this.curTabIdx,
         *         navElement: selNav,
         *         contentElement: selContItem
         *     });
         *
         */
        fire: function () {
            var obj = arguments[0];
            var args;
            // 此时绑定的对象就是自己
            if (lib.is.string(obj)) {
                obj = $(this);
                args = Array.prototype.slice.call(arguments, 0);
            }
            else {
                args = Array.prototype.slice.call(arguments, 1);
            }

            var event = args[0];
            args[0] = event + '.' + this.prefix;
            obj.trigger.apply(obj, args);
        },

        /**
         * 销毁控件
         */
        dispose: function () {

            // 解除绑定事件
            for (var i = this._listners.length - 1; i >= 0; i--) {
                var obj = this._listners[i].obj;
                obj.off.apply(obj, this._listners[i].args);
                obj = null;
            }
        }
    });

    return Control;
});
