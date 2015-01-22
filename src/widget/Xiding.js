/**
 * @file 吸顶 Plugin
 * @author kaivean(kaisey2012@163.com)
 */

define(function (require) {
    var lib = require('./lib');
    var $ = lib.dom;
    var Control = require('./Control');

    var $window;

    function listen() {
        this.on($window, 'scroll', onsrcoll);
    }

    function onsrcoll(e) {

        var scrollTop = $window.scrollTop();
        var winH = $window.height();

        var winTop;
        var alignTop;
        var isFixed = false;
        if (this.option.vDirection === 'top') {
            winTop = scrollTop;
            alignTop = this.elem.offset().top;
            isFixed = winTop >= alignTop;
        }
        else if (this.option.vDirection === 'bottom') {
            winTop = scrollTop + winH;
            alignTop = this.elem.offset().top + this.elem.outerHeight() - this.main.outerHeight();
            isFixed = winTop <= alignTop;
        }

        var alignLeft;
        if (this.option.hDirection === 'left') {
            alignLeft = this.elem.offset().left - this.main.outerWidth() - this.option.hOffset;
        }
        else if (this.option.hDirection === 'right') {
            alignLeft = this.elem.offset().left + this.elem.outerWidth() + this.option.hOffset;
        }

        if (isFixed) {
            var t;
            if (this.option.vDirection === 'top') {
                t = this.option.vOffset;
            }
            else if (this.option.vDirection === 'bottom') {
                t = $window.height() - this.main.outerHeight() - this.option.vOffset;
            }
            if (lib.is.ie6()) {
                this.main.css({
                    'position': 'absolute',
                    'top': scrollTop + t,
                    'left': alignLeft
                });
            }
            else {
                this.main.css({
                    'position': 'fixed',
                    'top': t,
                    'left': alignLeft
                });
            }
        }
        else {
            this.main.css({
                'position': 'absolute',
                'top': alignTop,
                'left': alignLeft
            });
        }
    }


    /**
     * 吸顶 Plugin
     *
     * @class
     * @extends Control
     */
    var Xiding = Control.extend({
        /**
         * 控件类型标识
         *
         * @property {string}
         * @readonly
         * @override
         */
        type: 'Xiding',

        /**
         * 控件默认配置项
         *
         * @property {Object} defaultOption
         * @property {string|HTMLElement}  defaultOption.main 控件的主容器（#id或.class）
         * @property {Obect} defaultOption.alignElement 对齐元素
         * @property {stirng} defaultOption.hDirection 水平对齐方向，left或right
         * @property {string} defaultOption.vDirection 垂直对齐方向，top或bottom
         * @property {number} defaultOption.hOffset 水平对齐间距
         * @property {number} defaultOption.vOffset 垂直对齐间距
         *
         * @readonly
         * @override
         */
        defaultOption: {
            main: '',
            alignElement: null,
            hDirection: 'left',
            vDirection: 'top',
            hOffset: 10,
            vOffset: 20
        },

        /**
         * 控件初始化
         *
         * @protected
         */
        init: function () {

            this.elem = $(this.option.alignElement);
            $window = $(window);

            this.p(listen);

            // 初始化一次
            this.p(onsrcoll);

            // this.main.show();
            // 默认不可见，处理后再可见，防止一开始排列混乱的时候展现出来
            this.main.css('visibility', 'visible');
        },

        update: function () {
            this.p(onsrcoll);
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

    return Xiding;

});
