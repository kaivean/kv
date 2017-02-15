/**
 * @file Select Plugin
 * @author kaivean(kaisey2012@163.com)
 */

define(function (require) {

    var $ = require('./lib').dom;
    var Control = require('./Control');
    var Popup = require('./Popup');

    function listen() {
        this.on(this.dropdown, 'click', 'li', onItemClick);
        this.on(this.ctrPopup, 'change', onToggle);
    }

    function onItemClick(e) {
        var $a = $(e.currentTarget);
        var i = this.items.index($a);
        this.select(i);
        this.ctrPopup.hide();
    }

    function onToggle(isShow) {
        if (isShow) {
            this.trig.addClass('expanded');
        }
        else {
            this.trig.removeClass('expanded');
        }
    }

    /**
     * Select Plugin
     *
     * @class
     * @extends Control
     */
    var Select = Control.extend({
        /**
         * 控件类型标识
         *
         * @type {string}
         * @readonly
         * @override
         */
        type: 'Select',

        /**
         * 控件默认配置项
         *
         * @property {Object} defaultOption
         * @property {string|HTMLElement} defaultOption.main 控件的主容器（#id或.class）
         * @property {number} defaultOption.index  初始化选中项索引
         * @readonly
         * @override
         */
        defaultOption: {
            main: '',
            index: 0
        },

        /**
         * 控件初始化
         *
         * @protected
         */
        init: function () {
            this.label = this.main.find(this.cn('label', 1));
            this.labelCont = this.label.find('span');
            this.dropdown = this.main.find('ul');
            this.trig = this.label.find('i');
            this.items = this.dropdown.find('li');

            this.select(this.option.index, true);
            this.ctrPopup = new Popup({
                main: this.label,
                prefix: this.prefix,
                content: this.dropdown
            });

            this.p(listen);
        },

        /**
         * 选择item
         *
         * @param {boolean} index 索引
         * @param {boolean} silent 是否保持沉静，即不触发事件
         */
        select: function (index, silent) {

            if (this.items.length > index && this.index !== index) {
                var item = this.items.eq(index);
                this.labelCont.text(item.text());
                this.labelCont.data('value', item.data('value'));
                this.index = index;
                !silent && this.fire('change', {index: index});
            }
        },

        /**
         * 获取选中状态
         *
         * @return {boolean} 是否选中
         */
        getValue: function () {
            return this.labelCont.data('value');
        },

        /**
         * 禁用控件
         */
        disable: function () {
            this.main.addClass(this.cn('disable'));
            if (this.parentClass && this.parentClass.prototype.dispose) {
                this.parentClass.prototype.dispose.apply(this, arguments);
            }
        },

        /**
         * 使用控件
         */
        enable: function () {
            this.main.removeClass(this.cn('disable'));
            this.p(listen);
        },

        /**
         * 销毁控件
         *
         * @override
         */
        dispose: function () {
            this.ctrPopup && this.ctrPopup.dispose();
            this.ctrPopup = null;
            if (this.parentClass && this.parentClass.prototype.dispose) {
                this.parentClass.prototype.dispose.apply(this, arguments);
            }
        }

    });

    return Select;

});
