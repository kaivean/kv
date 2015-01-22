/**
 * @file Checkbox Plugin
 * @author kaivean(kaisey2012@163.com)
 */

define(function (require) {
    var Control = require('./Control');

    function listen() {
        this.on(this.box, 'click', onClick);
    }

    function onClick() {
        var sel = this.cn('sel');
        this.setChecked(!this.main.hasClass(sel));
    }

    /**
     * Checkbox Plugin
     *
     * @class
     * @extends Control
     */
    var Checkbox = Control.extend({
        /**
         * 控件类型标识
         *
         * @type {string}
         * @readonly
         * @override
         */
        type: 'Checkbox',

        /**
         * 控件默认配置项
         *
         * @property {Object} defaultOption
         * @property {string|HTMLElement} defaultOption.main 控件的主容器（#id或.class）
         * @property {boolean} defaultOption.isChecked 是否选中
         * @readonly
         * @override
         */
        defaultOption: {
            main: '',
            isChecked: false
        },

        /**
         * 控件初始化
         *
         * @protected
         */
        init: function () {
            this.box = this.main.find('i');
            this.p(listen);
            this.setChecked(this.option.isChecked, true);
        },

        /**
         * 设置选中状态
         *
         * @param {boolean} isChecked 状态
         * @param {boolean} silent 是否保持沉静，即不触发事件
         */
        setChecked: function (isChecked, silent) {
            var sel = this.main.hasClass(this.cn('sel'));
            if (sel !== isChecked) {
                isChecked ?
                    this.main.addClass(this.cn('sel')) : this.main.removeClass(this.cn('sel'));
                !silent && this.fire('change', {isChecked: isChecked});
            }
        },

        /**
         * 获取选中状态
         *
         * @return {boolean} 是否选中
         */
        getChecked: function () {
            return this.main.hasClass(this.cn('sel'));
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
            if (this.parentClass && this.parentClass.prototype.dispose) {
                this.parentClass.prototype.dispose.apply(this, arguments);
            }
        }

    });

    return Checkbox;

});
