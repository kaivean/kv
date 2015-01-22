/**
 * @file AutoComplete Control Plugin
 * @author kaivean(kaisey2012@163.com)
 */

define(function (require) {
    var lib = require('./lib');
    var $ = lib.dom;
    var Control = require('./Control');

    function listen() {

        this
            .on(this.main, 'focus', onfocus)
            .on(this.main, 'blur', onblur)
            .on(this.main, 'keyup', lib.debounce(100, true, onkeyup))
            .on(this.main, 'keydown', onkeydown)
            .on(this.main, 'mousedown', lib.debounce(100, true, onmousedown))

            .on(this.menu, 'click', 'li', onclick)
            .on(this.menu, 'mouseenter', 'li', onmouseenter)
            .on(this.menu, 'mouseleave', 'li', onmouseleave)

            .on(this.menu, 'mouseenter', onMouseEnterMenu)
            .on(this.menu, 'mouseleave', onMouseLeaveMenu)

            .on('valueChange', lib.throttle(300, true, onValueChange));
    }

    function listenChange() {
        var query = this.main.val();
        if (query !== this.oldQuery) {
            this.query = query;
            this.fire('valueChange');
        }
    }

    function onValueChange() {

        this.p(lookup);
    }

    function lookup() {
        var me = this;
        this.query = this.main.val();
        // 当显示suggestion的时候 避免重复查询
        if (this.shown && this.oldQuery === this.query) {
            return this;
        }
        this.oldQuery = this.query;

        // 源是一个函数
        if (lib.is.fn(this.source)) {
            var  res = this.source(this.query, $.proxy(this.process, this));

            // 未定义则无作为
            if (lib.is.undef(res)) {

            }
            // 是一个数据， 则视为渲染的数据
            else if (lib.is.array(res)) {
                this.process(res);
            }
            // 是一个promise对象，表明是ajax请求
            else if (res.done && lib.is.fn(res.done) && res.fail && lib.is.fn(res.fail)) {

                res.done(
                    function (data) {
                        this.process(me.p(onLoadSuccess, data));
                    }
                )
                .fail(
                    function (data) {
                        me.p(onLoadFailure, data);
                    }
                )
                .always(
                    function (data) {}
                );
            }
            return this;
        }
        return this.process(this.source);
    }

    /*
     *  获取menu上的激活项
     */
    function it() {
        var item = this.menu.children(this.cn('item-sel', 1));
        return item.length
                    ? item : null;
    }

    function active($item) {
        this.p(it) && this.p(it).removeClass(this.cn('item-sel'));
        $item && $item.addClass(this.cn('item-sel'));
        return this;
    }

    // 将激活项文本插入input
    function select(isSilent) {
        if (this.p(it)) {
            // 把新值赋给oldQuery，躲过ValueChange检查
            if (isSilent) {
                this.oldQuery = this.p(it).data('value');
            }
            this.main
                .val(this.p(it).data('value'));
        }

        return this;
    }

    function next() {
        var cur = this.p(it);
        var next;

        if (cur) {
            if (cur.next().length) {
                next = cur.next();
            }
            else {
                // 把新值赋给oldQuery，躲过ValueChange检查
                this.oldQuery = this.userText;
                this.main.val(this.userText);
            }
        }
        else {
            this.userText =  this.main.val();
            next = this.menu.children().first();  // next.addClass('active');

        }
        this.p(active, next).p(select, true);
    }

    function prev() {
        var cur = this.p(it);
        var next;
        if (cur) {
            if (cur.prev().length) {
                next = cur.prev();
            }
            else {
                // 把新值赋给oldQuery，躲过ValueChange检查
                this.oldQuery = this.userText;
                this.main.val(this.userText);
            }
        }
        else {
            this.userText = this.main.val();
            next = this.menu.children().last();  // next.addClass('active');
        }
        this.p(active, next).p(select, true);
    }

    function move(e) {
        if (!this.shown && this.focused) {
            return;
        }
        switch (e.which) {
            case 9: // tab
            case 27: // escape
                e.preventDefault();
                break;
            case 13: // enter
                if (this.p(it)) {
                    e.preventDefault();
                }
                break;
            case 38: // up arrow
                e.preventDefault();
                this.p(prev);
                break;

            case 40: // down arrow
                e.preventDefault();
                this.p(next);
                break;
        }

        e.stopPropagation();
    }

    function itemClick($item) {
        this.p(select, true);
        this.hide();

        // 执行回调
        this.option.onItemClick
        & this.option.onItemClick(this.main.val(), $item);
    }

    /*
     *
     *  事件处理函数区
     *
     */
    function onfocus() {
        this.focused = true;
    }

    function onblur() {
        this.focused = false;
        if (!this.mousedover && this.shown) {
            this.hide();
        }
    }

    function onkeydown(e) {
        this.p(move, e);
    }

    function onkeyup(e) {

        switch (e.which) {
            case 40: // down arrow
            case 38: // up arrow
            case 16: // shift
            case 17: // ctrl
            case 18: // alt
            case 9: // tab
                break;

            case 13: // enter
                if (this.p(it)) {
                    this.p(itemClick, this.p(it));
                }
                break;

            case 27: // escape
                if (!this.shown) {
                    return;
                }
                this.hide();
                break;

            default:
                // this.p(lookup);
        }
        e.preventDefault();
    }

    function onmousedown() {
        this.focused = true;
        this.p(lookup);
    }

    /*
     * ul.menu 事件处理
     *
     */
    function onclick(e) {
        e.stopPropagation();
        this.p(itemClick, $(e.currentTarget));
    }

    function onmouseenter(e) {
        this.mousedover = true;
        // 防止移动鼠标后再按下上下键时，未保存用户输入的文本
        if (!this.p(it)) {
            this.userText = this.main.val();
        }
        this.p(active, $(e.currentTarget));
    }

    function onmouseleave(e) {
        this.mousedover = false;
        $(e.currentTarget).removeClass(this.cn('item-sel'));
        if (!this.focused && this.shown) {
            this.hide();
        }
    }

    function onMouseEnterMenu(e) {
        this.mousedover = true;
    }

    function onMouseLeaveMenu(e) {
        this.mousedover = false;
    }

    function onLoadSuccess(d) {
        this.option.onLoadSuccess && this.option.onLoadSuccess(d);
    }

    function onLoadFailure(d) {
        this.option.onLoadFailure && this.option.onLoadFailure(d);
    }

    /**
     * 控件AutoComplete
     *
     * @class
     * @extends Control
     */
    var AutoComplete = Control.extend({

        /**
         * 控件类型标识
         *
         * @type {string}
         * @readonly
         * @override
         */
        type: 'AutoComplete',

        /**
         * 控件默认配置项
         *
         * @property {Object} defaultOption
         * @property {string|HTMLElement} defaultOption.main 控件的主容器（#id或.class）
         * @property {number} defaultOption.itemNum 显示的项目数
         * @property {Function} defaultOption.source 数据的源函数，输入框每次变化都会调用函数获取数据
         * @property {Function} defaultOption.handleSourceData 每次展示数据之前，调用该函数自定义处理函数处理
         * @property {Function} defaultOption.content 每次展示一条数据项时，调用该函数自定义返回的下拉项的html内容
         * @property {Function} defaultOption.onItemClick 当下拉项点击时
         *
         * @readonly
         * @override
         */
        defaultOption: {
            main: '',
            itemNum: 20,

            /**
             * AutoComplete控件调用该函数来获取数据
             *
             * @function
             * @param {string} query 查询关键字
             *
             * @return {Array|Promise} 返回一个数组数据或者jquery ajax请求的Promise对象
             */
            source: function (query)  {
                return [];
            },

            /**
             * 处理 通过source获取到的 数据
             *
             * @function
             * @param {Array} data 即将渲染的数据
             * @param {string} query 查询关键字
             *
             * @return {Array} 返回一个数组数据
             */
            handleSourceData: function (data, query)  {
                return data;
            },

            /**
             * AutoComplete控件在渲染下拉菜单项调用该函数来获取菜单项的内容
             *
             * @function
             * @param {string} key 数据项的索引
             * @param {string|Object} value 通过source获取到的数组数据的每一项
             * @param {HTMLElement} $item suggestion菜单的列表项（即LI）的jquery对象
             * @param {string} query 查询关键字
             *
             * @return {string} 返回列表项元素li下的内容
             */
            content: function (key, value, $item, query) {
                return value;
            },

            /**
             * 当菜单项单击或enter时 触发
             *
             * @function
             * @param {string} query 查询关键字
             * @param {Object} $item suggestion菜单的被点击的列表项（即LI）的jquery对象
             *
             */
            onItemClick: function (query, $item) {

            }
        },

        /**
         * 控件初始化
         *
         * @protected
         * @override
         */
        init: function () {

            this.itemClass = this.cn('item', 1);
            this.menuTag = '<ul></ul>';
            this.itemTag = '<li></li>';
            this.menu = $(this.menuTag).addClass(this.cn('menu'));
            this.source = this.option.source;
            this.p(listen);
            this.main.focus();

            this.oldQuery = '';
            // 监听文本框值的变化
            this.timer = setInterval($.proxy(listenChange, this), 100);
        },
        /**
         * 显示弹出框
         *
         * @return {Object} this
         */
        show: function () {
            var pos = $.extend({}, this.main.position(), {
                height: this.main[0].offsetHeight
            });
            this.menu
                .insertAfter(this.main)
                .css({
                    top: pos.top + pos.height,
                    left: pos.left,
                    width: this.main.outerWidth() - 2  // 减去ul 的border宽度
                })
                .show();

            this.shown = true;
            return this;
        },
        /**
         * 隐藏弹出框
         *
         * @return {Object} this
         */
        hide: function() {
            this.menu.hide();
            this.shown = false;
            return this;
        },

        /**
         * 设置源
         *
         * @param {Object} data 待处理数据
         */
        setData: function (data) {
            this.process(data);
            this.main.focus();
        },

        /**
         * 处理数据
         *
         * @param {Object} data 待处理数据
         * @return {Object} this
         */
        process: function(data) {
            data = this.option.handleSourceData(data, this.query);
            return lib.is.array(data)
                        ? this.render(data.slice(0, this.option.itemNum)) : this;
        },
        /**
         * 绘制整个控件
         *
         * @param {Array} items 渲染项
         * @return {Object} this
         * @override
         */
        render: function (items) {
            var me = this;
            // 子项数为 0 时
            if (!items.length) {
                return this.shown ? this.hide() : this;
            }

            items = $(items).map(function(key, item) {
                var $item;
                var itemContent;
                $item = $(me.itemTag);
                // 当文本框为空时 显示默认提示
                if (!me.query) {
                    $item.data('value', '');
                    itemContent = item;
                }
                else {
                    $item
                        .data('value', item)
                        .addClass(me.cn('item'));

                    itemContent = me.option.content
                                    ? me.option.content(key, item, $item, me.query) : item;
                }

                $item.html(itemContent);
                return $item[0];
            });

            this.menu.html(items);
            return this.shown ? this : this.show();
        },

        /**
         * 销毁控件
         * @override
         */
        dispose: function () {
            if (this.parentClass && this.parentClass.prototype.dispose) {
                this.parentClass.prototype.dispose.apply(this, arguments);
            }
            this.menu && this.menu.remove();
            this.menu = null;

            clearInterval(this.time);
        }

    });

    return AutoComplete;
});
