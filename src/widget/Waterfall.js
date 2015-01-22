/**
 * @file 简单瀑布流 Plugin
 * @author kaivean(kaisey2012@163.com)
 */

define(function (require) {
    var lib = require('./lib');
    var $ = lib.dom;

    var Control = require('./Control');

    function listen() {
        this.on($(window), 'scroll', onsrcoll);
    }

    function onsrcoll(e) {
        if (this.isLoading) {
            return false;
        }
        var $window = $(window);
        var winTopOffset = $window.scrollTop();
        var winHeight = $window.height();
        var contBottomOffset = this.wfCont.offset().top + this.wfCont.height();

        // 当最后一行没有3个item时， 应该拉到倒数第二行时就开始ajax请求
        if (this.items.length % 3 !== 0) {
            contBottomOffset = contBottomOffset - this.items.first().outerHeight();
        }

        // 滚动到容器底部 这成立时才发送ajax请求
        if (winTopOffset + winHeight  >= contBottomOffset) {
            this.fire('load');
            var res = this.option.onLoadBefore();
            // 假如没有返回值
            if (lib.isUndefined(res)) {
                res = true;
            }
            if (res) {
                this.loading.show();
                this.p(startLoad);
            }
        }
    }

    function startLoad(e) {
        var me = this;
        var jq;
        if (this.option.ajaxFunc) {
            this.isLoading = true;
            jq = this.option.ajaxFunc();
        }
        else {
            if (!lib.is.empty(this.option.ajaxConf)) {
                this.isLoading = true;
                jq = lib.ajax(this.option.ajaxConf);
            }
        }

        jq && jq.done(
            function (data) {
                me.p(onLoadSuccess, data);
            }
        )
        .fail(
            function (data) {
                me.p(onLoadFailure, data);
            }
        )
        .always(
            function (data) {
                me.isLoading = false;
                me.loading.hide();
            }
        );
    }

    function handleItems() {
        var me = this;
        var contWidth = this.wfCont.width();
        var colNum = Math.floor((contWidth + this.option.hGap) / (this.option.itemWidth + this.option.hGap));

        // 为零
        if (!this.items.length) {
            return false;
        }

        this.items.each(function (k, v) {
            var o = {
                'marginTop': me.option.vGap,
                'marginRight': 0,
                'width': me.option.itemWidth
            };
            // 凡不是一行的最后一个都给右边距
            if ((k + 1) % colNum) {
                o.marginRight = me.option.hGap;
            }
            // 凡不是第一行的都给上边距
            if (k < colNum) {
                o.marginTop = 0;
            }
            $(v).css(o);
        });
    }


    function onLoadSuccess(d) {
        this.option.onLoadSuccess && this.option.onLoadSuccess(d);
    }

    function onLoadFailure(d) {
        this.option.onLoadFailure && this.option.onLoadFailure(d);
    }

    /**
     * 简单瀑布流 Plugin
     *
     * @class
     * @extends Control
     */
    var Waterfall = Control.extend({
        /**
         * 控件类型标识
         *
         * @type {string}
         * @readonly
         * @override
         */
        type: 'Waterfall',

        /**
         * 控件默认配置项
         *
         * @property {Object} defaultOption
         * @property {string|HTMLElement} defaultOption.main 控件的主容器（#id或.class）
         * @property {number} defaultOption.itemWidth 每个项的宽度
         * @property {string} defaultOption.prefix class name
         * @property {number} defaultOption.hGap 水平间隔
         * @property {number} defaultOption.vGap 垂直间隔
         * @property {Object} defaultOption.ajaxConf 同$.ajax的参数
         * @property {Function} defaultOption.ajaxFunc 自定义请求函数，但要返回promise对象
         * @property {Function} defaultOption.onLoadBefore 当开始异步加载时回调函数
         * @property {Function} defaultOption.onLoadSuccess 当完成异步加载时回调函数
         * @readonly
         * @override
         */
        defaultOption: {
            main: '',
            itemWidth: 320,
            prefix: '',
            hGap: 10,
            vGap: 10,
            ajaxConf: {},
            ajaxFunc: null,
            onLoadBefore: function () {
                return true;
            },
            onLoadSuccess: null

        },

        /**
         * 控件初始化
         *
         * @protected
         */
        init: function () {

            this.main = $(this.option.main);

            this.wfCont = $(this.cn('cont', 1), this.main);
            this.loading = $(this.cn('loading', 1), this.main);
            this.items = this.wfCont.find(this.cn('item', 1));
            if (this.items.length) {
                this.p(handleItems, this.items);
                this.p(listen);
            }
            // 默认不可见，处理后再可见，防止一开始排列混乱的时候展现出来
            this.wfCont.css('visibility', 'visible');

            // 初始化一次
            this.p(onsrcoll);

        },

        append: function ($items) {
            // 默认不可见，处理后再可见，防止一开始排列混乱的时候展现出来
            // this.wfCont.css('visibility', 'hidden');

            this.wfCont.append($items);
            this.items = this.wfCont.find(this.cn('item', 1));
            this.p(handleItems);

            // 默认不可见，处理后再可见，防止一开始排列混乱的时候展现出来
            // this.wfCont.css('visibility', 'visible');
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

    return Waterfall;

});
