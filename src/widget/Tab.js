/**
 * @file Tab Control Plugin
 * @author kaivean(kaisey2012@163.com)
 */

define(function (require) {

    var lib = require('./lib');
    var $ = lib.dom;
    var Control = require('./Control');

    function listen() {
        // 为图片轮播等需要渐隐等持续效果的场合 做优化
        var delay = this.option.hasEffect ? 250 : 100;
        this.on(
                this.navItems,
                this.option.allowHover ? 'mouseenter' : 'click',
                lib.debounce(delay, true, onMouseenterOrClick)
            );

        if (this.option.autoProgress && this.option.stopOnFocus) {
            this
                .on(this.main, 'mouseenter', this.stopAutoProgress)
                .on(this.main, 'mouseleave', this.restartAutoProgress);
        }

        if (this.option.keyNavigation) {
            this.on($(document), 'keyup', onkeyup);
        }
    }

    function showTab(silent) {

        var selNav = this.navItems.eq(this.curTabIdx);

        var selContItem = this.getContItem();

        selNav.addClass(this.cn('nav-sel'))
            .prev().addClass(this.cn('nav-prev'))
            .end()
            .next().addClass(this.cn('nav-next'));

        if (this.option.hasEffect) {
            selContItem.slideDown(500);
        }
        else {
            selContItem.show();
        }

        // 执行回调
        !silent && this.fire('change', {
            oldId: this.oldIdx,
            curId: this.curTabIdx,
            navElement: selNav,
            contentElement: selContItem
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

    function onMouseenterOrClick(e) {
        var newIdx = this.navItems.index($(e.currentTarget));
        this.changeTab(newIdx);

        return false;
    }

    /**
     * Tab Control Plugin
     *
     * @class
     * @extends Control
     */
    var Tab = Control.extend({
        /**
         * 控件类型标识
         *
         * @type {string}
         * @readonly
         * @override
         */
        type: 'Tab',

        /**
         * 控件配置项
         *
         * @property {Object} defaultOption
         * @property {string|HTMLElement} defaultOption.main 控件的主容器（#id或.class）
         * @property {number} defaultOption.index  初始化选中项索引
         * @property {boolean} defaultOption.allowHover 启用hover时切换
         * @property {boolean} defaultOption.keyNavigation 控件class前缀，同时将作为main的class之一
         * @property {boolean} defaultOption.keyNavigation 左右键导航
         * @property {boolean} defaultOption.autoProgress 自动切换
         * @property {boolean} defaultOption.progressInterval 自动切换时间间隔
         * @property {boolean} defaultOption.stopOnFocus 当鼠标在tab元素内，禁止自动切换
         * @property {boolean} defaultOption.hasEffect  是否有过度效果
         * @property {Function} defaultOption.onChange  变化时的回调函数
         * @readonly
         * @override
         */
        defaultOption: {
            main: '',
            index: 0,
            allowHover: false,
            keyNavigation: true,
            autoProgress: false,
            progressInterval: 2000,
            stopOnFocus: false,
            hasEffect: false,
            onChange: null
        },

        /**
         * 控件配置项
         * 具体参数 参考默认配置项
         */
        option: {},

        /**
         * 控件初始化
         *
         * @protected
         */
        init: function () {
            this.nav = this.main.children(this.cn('nav', 1));
            this.cont = this.main.children(this.cn('cont', 1));
            this.navItems = this.nav.children();
            this.contItems = this.cont.children(this.cn('item', 1));

            this.curTabIdx = this.option.index;

            // 若具有hover行为 则关闭自动切换行为
            // this.option.progressOnHover
            //     ? this.option.autoProgress = false : '';
            if (this.option.autoProgress) {
                this.startAutoProgress();
            }
            this.p(listen);

            // 不要初始化隐藏！要在html中直接隐藏
            // this.tabs.each(function () {
                // $($(this).data(that.type)).hide(); //slideUp('fast');.fadeOut()
            // });
            this.p(showTab, true);
        },

        /**
         * 切换至索引项
         *
         * @param {number} newIdx 新索引
         * @return {boolean} 是否完成切换
         */
        changeTab: function (newIdx) {
            var oldI = this.curTabIdx;
            if (newIdx === oldI) {
                return false;
            }

            this.curTabIdx = newIdx;
            this.oldIdx = oldI;

            this.navItems.eq(oldI).removeClass(this.cn('nav-sel'));
            this.navItems.removeClass(
                [
                    this.cn('nav-sel-prev'),
                    this.cn('nav-sel-next')
                ].join(' ')
            );
            this.getContItem(oldI).stop(true, true).hide();
            this.p(showTab);

            return true;
        },

        /**
         * 获取当前的内容元素
         *
         * @param {number} i 索引, 默认为当前索引
         * @return {HMTLElement} 元素的jQuery
         */
        getContItem: function (i) {
            i = lib.is.undef(i) ? this.curTabIdx : i;
            var ci = (this.contItems.length > i)
                ? this.contItems.eq(i) : this.contItems.last();
            return ci;
        },
        /**
         * 切换至下一个项
         */
        next: function () {
            var nextTabIdx = this.curTabIdx + 1;
            if (this.navItems.length <= nextTabIdx) {
                nextTabIdx = 0;
            }
            this.changeTab(nextTabIdx);
        },

        /**
         * 切换至前一个项
         */
        prev: function () {
            var nextTabIdx = this.curTabIdx - 1;
            if (0 > nextTabIdx) {
                nextTabIdx = this.navItems.length - 1;
            }
            this.changeTab(nextTabIdx);
        },

        /**
         * 启动自动轮播
         */
        startAutoProgress: function () {
            if (this.option.autoProgress && !this.autoProgressId) {
                this.autoProgressId = setInterval(
                    lib.bind(this.next, this),
                    this.option.progressInterval
                );
            }
        },
        /**
         * 重新开始自动轮播
         */
        restartAutoProgress: function () {
            if (this.option.autoProgress) {
                this.stopAutoProgress();
                this.startAutoProgress();
            }
        },

        /**
         * 停止自动轮播
         */
        stopAutoProgress: function () {
            if (this.option.autoProgress && this.autoProgressId) {
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
            if (this.parentClass && this.parentClass.prototype.dispose) {
                this.parentClass.prototype.dispose.apply(this, arguments);
            }
        }
    });

    return Tab;
});
