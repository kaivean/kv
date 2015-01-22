/**
 * 事件对象库
 *
 * @file event库
 * @author kaivean(kaisey2012@163.com)
 */

define(function (require) {
    // var is = require('./is');

    /**
     * 事件帮助者
     *
     * @private
     */
    var helper = {
        hasEvent: function (ele, type) {
            return !(('on' + type) in ele);
        },
        getEvent: function (e) {
            return e || window.event;
        },
        getTarget: function (e) {
            return e.target || e.srcElement;
        },
        getRelatedTarget: function (e) {
            return e.relatedTarget || e.fromElement || e.toElement;
        },
        contains: function (parent, child) {
            while (child) {
                if (child === parent) {
                    return true;
                }
                child = child.parentNode;
            }
            return false;
        }
    };

    /**
     * 事件对象
     *
     * @param {Mixed} originEvent 原始事件
     * @return {Event} 规范化的事件对象
     * @private
     */
    function normalizeEvent(originEvent) {

        originEvent.preventDefault = originEvent.preventDefault || function () {
            this.returnValue = false;
        };

        // originEvent.data = 'ok kaivean';

        originEvent.stopPropagation = originEvent.stopPropagation || function () {
            this.cancelBubble = true;
        };

        originEvent.which = originEvent.which || originEvent.charCode || originEvent.keyCode;

        return originEvent;
    }

    var fixer = {
        // 据说chrome 28以下不支持该事件
        mouseenter: {
            type: 'mouseover',
            // 满足条件才执行 事件处理函数
            condition: function (ele, e) {
                // 相关目标就是失去鼠标的元素
                var relatedTarget = helper.getRelatedTarget(e);
                // 如果失去鼠标的元素 不是 绑定事件的元素本身及子元素，那么才满足条件
                if (!helper.contains(ele, relatedTarget)) {
                    return true;
                }
                return false;
            }
        },
        // 据说chrome 28以下不支持该事件
        mouseleave: {
            type: 'mouseout',
            condition: function (ele, e) {
                return fixer.mouseenter.condition(ele, e);
            }
        }
    };

    var event = {};

    /**
     * 注册一个事件处理函数
     *
     *     @example
     *     event.on(ele, 'click', function(e, data) {});
     *     event.on(ele, 'click', function() {}, context);
     *     event.on(ele, 'click', function() {}, context, true);  相当于event.once('click', function() {}, context);
     *
     * @param {HTMLElement} ele 元素对象
     * @param {string} type 事件的类型
     * @param {Function} handler 事件的处理函数
     * @param {Mixed} context 事件执行时`this`对象
     * @param {boolean} [once=false] 控制事件仅执行一次
     *
     * @return {Object} event
     */
    event.on = function (ele, type, handler, context, once) {

        var realType = type;
        // 不存在该事件，并且有兼容处理
        if (!helper.hasEvent(ele, type) && fixer[type]) {
            var fix = fixer[type];
            realType = fix.type;
        }

        // 对回调函数作一层封装，实现单次事件绑定等功能
        var wrapHandler = function (e) {
            if (once) {
                event.un(ele, realType, wrapHandler);
            }
            // 不存在该事件，并且有兼容处理，针对mouseenter等
            if (!helper.hasEvent(ele, type) && fixer[type]) {
                var fix = fixer[type];

                // 条件不成立
                if (!fix.condition(ele, e)) {
                    console.log('no exec', realType, e.relatedTarget);
                    return false;
                }
            }
            console.log('exec', realType, e.relatedTarget);
            arguments[0] = normalizeEvent(e);
            handler.apply(context, arguments);
        };

        if (document.addEventListener) {
            ele.addEventListener(
                realType,
                wrapHandler,
                false
            );
        }
        // for ie
        else {
            ele.attachEvent('on' + realType, wrapHandler);
        }

        return this;
    };

    /**
     * 注册一个事件处理函数，但只执行一次
     *
     *     @example
     *     event.once(ele, 'click', function(e, data) {});
     *     event.once(ele, 'click', function(e, data) {}, context);
     *
     * @param {HTMLElement} ele 元素对象
     * @param {string} type 事件的类型
     * @param {Function} handler 事件的处理函数
     * @param {Mixed} context 事件执行时`this`对象
     *
     * @return {Object} event
     */
    event.once = function (ele, type, handler, context) {
        return this.on(ele, type, handler, context, true);
    };

    /**
     * 解除一个事件处理函数
     *
     *     @example
     *     event.off(ele, 'click', function(e, data) {});
     *     event.off(ele, 'click', function(e, data) {});
     *
     * @param {HTMLElement} ele 元素对象
     * @param {string} type 事件的类型
     * @param {Function} handler 事件的处理函数
     *
     * @return {Object} event
     */
    event.off = event.un = function (ele, type, handler) {
        var realType = type;
        // 不存在该事件，并且有兼容处理
        if (!helper.hasEvent(ele, type) && fixer[type]) {
            var fix = fixer[type];
            realType = fix.type;
        }

        if (document.removeEventListener) {
            ele.removeEventListener(
                realType,
                handler,
                false
            );
        }
        // for ie
        else {
            ele.detachEvent('on' + realType, handler);
        }
        return this;
    };
    /**
     * 触发一个事件
     *
     *     @example
     *     event.fire(ele, 'click');
     *     event.fire(ele, 'click');
     *
     * @param {HTMLElement} ele 元素对象
     * @param {string} type 事件类型
     *
     * @return {Object} event
     */
    event.fire = function (ele, type) {

        var event;
        if (document.createEvent) {
            event = document.createEvent('HTMLEvents');
            event.initEvent(type, true, true);
            ele.dispatchEvent(event);
        }
        // for ie
        else {
            event = document.createEventObject();
            ele.fireEvent('on' + type, event);
        }
        return this;
    };

    return event;
});
