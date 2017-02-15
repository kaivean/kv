/**
 * @file  Shape
 * @author kaivean(kaivean@outlook.com)
 */

define(function (require) {
    var lib = require('kv/lib');

    var Shape = lib.createClass({
        type: 'Shape',

        set: function (prop, value) {
            this[prop] = value;
            if (lib.is.has(this, prop)) {
                this[prop] = value;
            }
            else {

            }
            this.fire('propChange', prop, value);

            return this;
        },
        get: function (prop) {
            if (lib.is.undef(prop)) {
                return this;
            }
            return this._props[prop] || void 0;
        },

        init: function (props) {
            lib.each(props, function (value, prop) {

            });

            return this;
        },

        render: function (ctx) {

            return this;
        },

        fill: function () {
            this.fillStyle ? this.ctx.fillStyle = this.fillStyle : '';
            this.ctx.fill();

            return this;
        },
        stroke: function () {
            this.lineWidth ? this.ctx.lineWidth = this.lineWidth : '';
            this.strokeStyle ? this.ctx.strokeStyle = this.strokeStyle : '';
            this.ctx.stroke();

            return this;
        }
    });

    lib.Observer.enable(Shape);
    return Shape;
});
