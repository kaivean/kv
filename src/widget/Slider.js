/**
 * @file Slider Plugin
 * @author kaivean(kaisey2012@163.com)
 */

define(function (require) {

    var lib = require('./lib');
    var $ = require('./lib').dom;
    var Control = require('./Control');

    function listen() {
        this.prevBtn.length && this.on(
            this.prevBtn,
            'click',
            lib.throttle(250, true, onClickPrev)
        );
        this.nextBtn.length && this.on(
            this.nextBtn,
            'click',
            lib.throttle(250, true, onClickNext)
        );

        if (this.option.autoProgress && this.option.stopOnFocus) {
            this
                .on(this.main, 'mouseenter', this.stopAutoProgress)
                .on(this.main, 'mousemove', this.stopAutoProgress)
                .on(this.main, 'mouseover', this.stopAutoProgress)
                .on(this.main, 'mouseleave', this.restartAutoProgress);
        }

        if (this.option.keyNavigation) {
            this.on($(document), 'keyup', onkeyup);
        }
    }

    function onClickPrev() {
        this.stopAutoProgress();
        this.prev(function () {
            if (this.option.autoProgress) {
                this.startAutoProgress();
            }
        });
    }

    function onClickNext() {
        this.stopAutoProgress();
        this.next(function () {
            if (this.option.autoProgress) {
                this.startAutoProgress();
            }
        });
    }

    function onkeyup(e) {
        if (e.which === 39) { // Right Arrow
            this.next();
            if (this.option.autoProgress) {
                this.restartAutoProgress();
            }
        }
        else if (e.which === 37) { // Left Arrow
            this.prev();
            if (this.option.autoProgress) {
                this.restartAutoProgress();
            }
        }
    }

    function getPosLeft(index) {
        index = index || this.index;
        // return index * 100 + '%';
        var item = this.getItems().eq(index);
        // console.log(index, item.position().left);
        return item.position().left;
    }

    function onAnimateDone() {
        this.cont.clearQueue();
        this.fire('change', this.oriItems.index(this.getItems().eq(this.index)));
    }

    function doAnimate(left, callback) {
        var me = this;
        this.cont.stop(false).animate(
            {left: -left},
            this.option.slideTime,
            'swing',
            function () {
                callback && callback.call(me);
                onAnimateDone.call(me);
            }
        );
    }

    /**
     * Slider Plugin
     *
     * @class
     * @extends Control
     */
    var Slider = Control.extend({
        /**
         * 控件类型标识，始终是 Slider
         *
         * @type {string}
         * @readonly
         * @override
         */
        type: 'Slider',

        /**
         * 控件默认配置项
         *
         * @property {Object} defaultOption
         * @property {string|HTMLElement} defaultOption.main 控件的主容器（#id或.class）
         * @property {boolean} defaultOption.keyNavigation 左右键导航
         * @property {boolean} defaultOption.autoProgress 自动切换
         * @property {boolean} defaultOption.progressInterval 自动切换时间间隔
         * @property {boolean} defaultOption.slideInterval 切换时长
         * @property {boolean} defaultOption.stopOnFocus 当鼠标在tab元素内，禁止自动切换
         * @property {string} option.transition 切换效果
         * @property {Function} defaultOption.effectFunc  自定义切换动画
         * @readonly
         * @override
         */
        defaultOption: {
            main: '',
            keyNavigation: false,
            autoProgress: false,
            progressInterval: 2000,
            slideTime: 600,
            stopOnFocus: true,
            transition: 'infinite',
            effectFunc: null
        },

        /**
         * 控件初始化
         *
         * @protected
         */
        init: function () {
            this.contWrap = this.main.find(this.cn('cont-wrap', 1));
            this.cont = this.main.find(this.cn('cont', 1));
            this.prevBtn = this.main.find(this.cn('prev', 1));
            this.nextBtn = this.main.find(this.cn('next', 1));
            this.oriItems = this.items = this.getItems();

            this.step = 1;

            var itemSel = this.items.filter(this.cn('item-sel', 1));
            this.index = this.items.index(itemSel);
            if (this.index < 0) {
                this.index = 0;
            }

            this.cont.css({
                position: 'relative',
                width: 100 * this.items.length + '%'
            });

            this.items.css({
                width: this.main.width()
            });

            this.p(listen);

            if (this.option.autoProgress) {
                this.startAutoProgress();
            }
        },

        getItems: function () {
            return this.cont.children();
        },

        move: function (noEffect, callback) {

            if (noEffect) {
                this.cont.css('left', -this.p(getPosLeft));
            }

            else if (lib.isFunction(this.option.effectFunc)) {
                this.option.effectFunc.call(this);
            }
            else {
                this.p(
                    doAnimate,
                    this.p(getPosLeft),
                    callback
                );
            }
            this.getItems().removeClass(this.cn('item-sel')).eq(this.index).addClass(this.cn('item-sel'));
        },

        next: function (callback) {
            if (this.index >= this.getItems().length - 1) {
                switch (this.option.transition) {
                    case 'infinite':
                        this.getItems()
                            .first()
                            .appendTo(this.cont);

                        this.cont.css('left', -this.p(getPosLeft, this.index - this.step));
                        break;
                    case 'repeat':
                        this.index = 0;
                }
            }
            else {
                this.index += this.step;
            }
            this.move(false, callback);
            return this;
        },
        prev: function (callback) {

            if (this.index <= 0) {
                switch (this.option.transition) {
                    case 'infinite':
                        this.getItems()
                            .last()
                            .prependTo(this.cont);
                        this.cont.css('left', -this.p(getPosLeft, this.index + this.step));
                        break;
                    case 'repeat':
                        this.index = this.getItems().length - 1;
                }
            }
            else {
                this.index -= this.step;
            }
            this.move(false, callback);
            return this;
        },

        startAutoProgress: function () {
            if (!this.autoProgressId) {
                this.autoProgressId = setInterval(
                    lib.bind(this.next, this),
                    this.option.progressInterval);
            }
        },

        restartAutoProgress: function () {
            this.stopAutoProgress();
            this.startAutoProgress();
        },

        stopAutoProgress: function () {
            if (this.autoProgressId) {
                clearInterval(this.autoProgressId);
                this.autoProgressId = null;
            }
        },

        /**
         * 销毁控件
         *
         * @override
         */
        dispose: function () {
            this.stopAutoProgress();
            if (this.parentClass && this.parentClass.prototype.dispose) {
                this.parentClass.prototype.dispose.apply(this, arguments);
            }
        }

    });

    return Slider;

});
