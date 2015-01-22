/**
 * @file 弹出框 Plugin
 * @author kaivean(kaisey2012@163.com)
 */

define(function (require) {

    var $ = require('./lib').dom;
    var Control = require('./Control');

    function listen () {
        this.on(this.main, 'click', onClick);
        this.on(this.layer, 'click', onLayerClick);
        this.on($(document), 'click', onDocClick);
    }

    function onClick (e) {
        this.isInner = true;
        if (this.layer.css('display') === 'none') {
            this.show();
        }
        else {
            this.hide();
        }
    }

    function onLayerClick (e) {
        this.isInner = true;
    }

    // 点击其他地方 隐藏弹出层，冒泡原理
    function onDocClick (e) {

        // 如果不在弹出层内点击 就隐藏弹出层
        if (!this.isInner) {
            this.hide();
        }
        this.isInner = false;
    }

    /**
     * 弹出框 Plugin
     *
     * @class
     * @extends Control
     */
    var Popup = Control.extend({
        /**
         * 控件类型标识
         *
         * @type {string}
         * @readonly
         * @override
         */
        type: 'Popup',

        /**
         * 控件默认配置项
         *
         * @property {Object} defaultOption
         * @property {string|HTMLElement} defaultOption.main 控件的主容器（#id或.class），触发显示／隐藏弹出框的按钮
         * @property {string|HTMLElement} defaultOption.content 显示的内容
         * @property {string} defaultOption.direction 相对主元素的方向, 当前支持botoom/right
         * @property {number} defaultOption.gap 和主元素的间距
         *
         * @readonly
         * @override
         */
        defaultOption: {
            main: '',
            content: '',
            direction: 'bottom',
            gap: 10
        },

        /**
         * 控件初始化
         *
         * @protected
         */
        init: function () {

            var cont = $(this.option.content).eq(0).hide();
            var  offset = this.main.position();

            var cssOpt = {
                position: 'absolute',
                zIndex: 10001,
                left: 0,
                top: 0
            };

            switch (this.option.direction) {
                case 'right':
                    cssOpt.top = offset.top
                        + parseInt(this.main.css('marginTop'), 10);
                    cssOpt.left = offset.left
                        + this.main.outerWidth()
                        + parseInt(this.main.css('marginLeft'), 10)
                        + this.option.gap;

                    break;

                case 'bottom':
                    // 主元素的 顶部偏移 ＋ 不包含margin的高度 ＋ marginTop ＋ 间隔
                    cssOpt.top = offset.top
                        + this.main.outerHeight()
                        + parseInt(this.main.css('marginTop'), 10)
                        + this.option.gap;
                    cssOpt.left = offset.left + parseInt(this.main.css('marginLeft'), 10);
            }

            this.layer = $('<div></div>')
                .addClass(this.cn('layer'))
                .css(cssOpt)
                .hide()
                .append(cont.show())
                .insertAfter(this.main);

            this.p(listen);

        },

        /**
         * 显示弹出层
         */
        show: function () {
            this.layer.show();
            this.fire('change', true);
        },

        /**
         * 隐藏弹出层
         */
        hide: function () {
            this.layer.hide();
            this.fire('change', false);
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

    return Popup;

});
