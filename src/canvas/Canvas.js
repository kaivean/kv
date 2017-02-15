/**
 * @file  Canvas
 * @author kaivean(kaivean@outlook.com)
 */

define(function (require) {
    var lib = require('kv/lib');

    function onclick(e) {
        var pos = this.getClickPostion(e);
        console.log(pos);
    }

    var Canvas = lib.createClass({

        init: function (id, opts) {
            if (!lib.is.instance(this, Canvas)) {
                return new Canvas(id);
            }

            // reference canvas element (with id="c")
            this.ele = document.getElementById(id);

            this.ele.width = opts.width || 300;
            this.ele.height = opts.height || 150;

            lib.event.on(this.ele, 'click', onclick, this);

            if (!this.ele.getContext) {
                return;
            }
            // get 2d context to draw on (the "bitmap" mentioned earlier)
            this.ctx = this.ele.getContext('2d');

            // 保存各种元素（形状等）
            this.pool = [];
        },

        add: function (obj) {
            obj.ctx = this.ctx;
            this.pool.push(obj);
        },

        render: function () {
            var me = this;
            lib.each(me.pool, function (obj, index) {
                obj.render(me.ctx);
            });
        },

        getClickPostion: function (e) {
            var mouseX = e.clientX;
            var mouseY = e.clientY;
            var canvasOffsetleft = this.ele.offsetLeft;
            var canvasOffsettop = this.ele.offsetTop;
            var scrollT = document.body.scrollTop;
            var scrollL = document.body.scrollLeft;

            var x = mouseX + scrollL - canvasOffsetleft;
            var y = mouseY + scrollT - canvasOffsettop;
            return {
                x: x,
                y: y
            };
        }
    });

    return Canvas;
});
