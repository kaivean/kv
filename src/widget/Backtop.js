/**
 * @file 回到顶部 Plugin
 * @author kaivean(kaisey2012@163.com)
 */

define(function (require) {

    var lib = require('./lib');
    var $ = lib.dom;
    var Control = require('./Control');

    /**
     * 回到顶部 Plugin
     *
     * @class
     * @extends Control
     */
    var Backtop = Control.extend({
        /**
         * 控件类型标识
         *
         * @type {string}
         * @readonly
         * @override
         */
        type: 'Backtop',

        /**
         * 控件默认配置项
         *
         * @property {Object} defaultOption
         * @property {string|HTMLElement} defaultOption.main 控件的主容器（#id或.class）
         * @property {number} defaultOption.duration 持续时间
         * @property {Object} defaultOption.hideElement 满足hideDistance时隐藏的元素
         * @property {number} defaultOption.hideDistance 距离顶部还有多少距离时隐藏
         * @property {string} defaultOption.prefix 类前缀
         * @readonly
         * @override
         */
        defaultOption: {
            main: '',
            duration: 200,
            hideElement: null,
            hideDistance: 400,
            prefix: ''
        },

        /**
         * 控件初始化
         *
         * @protected
         */
        init: function () {

            this.main = $(this.option.main);
            this.hideElement = this.option.hideElement ? $(this.option.hideElement) : null;

            this.listen();

            this.onScroll();
        },

        listen: function () {
            this.on(this.main, 'click', $.proxy(this.onClick, this));
            this.on($(window), 'scroll', $.proxy(this.onScroll, this));
        },

        onClick: function (e) {
            this.toTop(e);
        },

        onScroll: function () {
            var scrollTop = $(window).scrollTop();
            if (scrollTop > this.option.hideDistance) {
                this.hideElement && this.hideElement.show();
            }
            else {
                this.hideElement && this.hideElement.hide();
            }
        },

        toTop: function (e) {
            var me = this;
            $('body,html').animate({scrollTop: 0}, this.option.duration, function () {
                me.fire('reachTop');
            });
        },

        /**
         * 销毁控件
         *
         * @override
         */
        dispose: function () {
            if (this.parentClass && this.parentClass.prototype.dispose) {
                this.parentClass.prototype.dispose.apply(this, arguments);
            }

        }

    });

    return Backtop;

});
