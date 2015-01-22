/**
 * 事件对象库
 *
 * @file Observer库
 * @author kaivean(kaisey2012@163.com)
 */

define(function (require) {
    var is = require('./is');
    var util = require('./util');

    /**
     * 事件对象
     *
     * @param {string} type 事件类型
     * @param {Mixed} data 事件数据
     * @constructor
     * @private
     */
    function Event(type, data) {
        this.type = type;
        if (!is.undef(data)) {
            this.data = data;
        }
    }

    /**
     * 事件处理函数队列
     *
     * @constructor
     * @private
     */
    function ListenerQueue() {
        this.queue = [];
    }

    /**
     * 添加一个事件处理函数
     *
     * @param {Function} handler 事件的处理函数
     * @param {Mixed} context 事件执行时`this`对象
     * @param {boolean} [once=false] 控制事件仅执行一次
     */
    ListenerQueue.prototype.add = function (handler, context, once) {
        if (!is.fn(handler)) {
            throw new Error('event handler must be a function');
        }

        var newListener = {
            handler: handler,
            context: context,
            once: once || false
        };

        for (var i = 0; i < this.queue.length; i++) {
            var listener = this.queue[i];

            // handler, context完全相同, 目的是去重
            if (listener.handler === newListener.handler
                && listener.context === newListener.context) {
                return;
            }
        }
        this.queue.push(newListener);
    };

    ListenerQueue.prototype.remove = function (handler, context) {
        // 没参数，视为移除所有处理函数
        if (!arguments.length) {
            this.clear();
            return;
        }

        if (!is.fn(handler)) {
            throw new Error('event handler must be a function');
        }

        for (var i = 0; i < this.queue.length; i++) {
            var listener = this.queue[i];

            // equal
            if (listener && listener.handler === handler) {
                // 假如传递了上下文，那么listener的上下文不一致，就视为不是同一个listener处理函数，也就不删除它
                if (context && listener.context !== context) {
                    continue;
                }
                // 此时函数一致，上下文没定义或者上下文一致。如果没定义上下文，只要函数名一致便删除。
                this.queue.splice(i, 1);

                // 完全符合条件的处理函数在`add`时会去重，因此这里肯定只有一个
                return;
            }
        }
    };

    ListenerQueue.prototype.clear = function () {
        this.queue.length = 0;
    };

    ListenerQueue.prototype.execute = function (e) {
        var i = 0;

        while (i < this.queue.length) {
            var listener = this.queue[i];
            if (is.empty(listener)) {
                continue;
            }
            if (listener.once) {
                this.queue.splice(i, 1);
                // 移除后，队列长度减少1个，第i+1个元素索引变为i，索引应当减1，否则第i+1元素遍历不到。
                i--;
            }
            var args = [e];

            // 定义了e.data，那么将e.data作为第二个参数
            if (!is.undef(e.data)) {
                args.push(e.data);
            }
            listener.handler.apply(listener.context, args);

            i++;
        }
    };


    function getListenerQueueByEvent(type) {
        if (!is.string(type)) {
            throw new Error('Event type error');
        }
        // 自己没有直接拥有该type属性（原型链上的type不算）
        if (!is.has(this._events, type)) {
            this._events[type] = new ListenerQueue();
        }
        return this._events[type];
    }

    /**
     * 事件观察者
     *
     * @constructor
     */
    function Observer() {
        this._events = {};
    }
    /**
     * 注册一个事件处理函数
     *
     *     @example
     *     obj.on('change', function(e, data) {});
     *     obj.on('change', function() {}, context);
     *     obj.on('change', function() {}, context, true);  相当于obj.once('change', function() {}, context);
     *
     * @param {string} type 事件的类型
     * @param {Function} handler 事件的处理函数
     * @param {Mixed} context 事件执行时`this`对象
     * @param {boolean} [once=false] 控制事件仅执行一次
     */
    Observer.prototype.on = function (type, handler, context, once) {
        var listenerQueue = getListenerQueueByEvent.call(this, type);
        listenerQueue.add(handler, context || this, once);
    };

    /**
     * 注册一个事件处理函数，但只执行一次
     *
     *     @example
     *     obj.once('change', function(e, data) {});
     *     obj.once('change', function(e, data) {}, context);
     * @param {string} type 事件的类型
     * @param {Function} handler 事件的处理函数
     * @param {Mixed} context 事件执行时`this`对象
     */
    Observer.prototype.once = function (type, handler, context) {
        this.on(type, handler, context, true);
    };

    /**
     * 解除一个事件处理函数
     *
     *     @example
     *     obj.off('change', function(e, data) {});
     *     obj.off('change', function(e, data) {}, context);
     * @param {string} type 事件的类型
     * @param {Function} handler 事件的处理函数
     * @param {Mixed} context 事件执行时`this`对象
     */
    Observer.prototype.off = Observer.prototype.un = function (type, handler, context) {
        if (!is.has(this._events, type)) {
            return;
        }
        var listenerQueue = getListenerQueueByEvent.call(this, type);
        listenerQueue.remove(handler, context);
    };
    /**
     * 触发一个事件
     *
     *     @example
     *     obj.fire('change');
     *     obj.fire('change', {status: 1});
     * @param {string} type 事件类型
     * @param {Mixed} data 事件数据
     */
    Observer.prototype.fire = function (type, data) {
        if (!is.has(this._events, type)) {
            return;
        }
        var listenerQueue = getListenerQueueByEvent.call(this, type);
        var e = new Event(type, data);
        listenerQueue.execute(e);
    };

    /**
     * 使一个对象拥有事件处理的功能
     *
     * @param {Mixed} target 需要绑定事件处理功能的对象
     * @static
     */
    Observer.enable = function (target) {
        target._events = {};
        if (is.fn(target)) {
            util.extend(target.prototype, Observer.prototype);
            return;
        }
        util.extend(target, Observer.prototype);
    };

    return Observer;
});
