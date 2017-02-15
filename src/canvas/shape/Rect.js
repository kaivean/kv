/**
 * @file  Ellipse
 * @author kaivean(kaivean@outlook.com)
 */

define(function (require) {
    var lib = require('kv/lib');
    var Shape = require('./Shape');

    var defaultProps = {
        id: '',
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        radius: 0,
        fillStyle: '#000',
        strokeStyle: '#000',
    };

    var Rect = Shape.extend({
        type: 'Rect',

        init: function (props) {
            var me = this;
            props = lib.extend({}, defaultProps, props);

            lib.each(props, function (value, prop) {
                me.set(prop, value);
            });
        },

        render: function (ctx) {

            var x = this.x;
            var y = this.y;
            var width = this.width;
            var height = this.height;
            var radius = this.radius;
            var ctx = this.ctx;

            // "magic number" for bezier approximations of arcs (http://itc.ktu.lt/itc354/Riskus354.pdf)
            var k = 1 - 0.5522847498;
            var isRounded = radius !== 0;

            ctx.beginPath();
            ctx.save();

            ctx.moveTo(x + radius, y);
            if (isRounded) {
                ctx.arcTo(x + width, y, x + width, y + height, radius); 
                ctx.arcTo(x + width, y + height, x, y + height, radius); 
                ctx.arcTo(x, y + height, x, y, radius); 
                ctx.arcTo(x, y, x + width, y, radius);
            }
            else {
                ctx.rect(x, y, width, height);
            }

            // ctx.lineTo(x + w - hr, y);
            // isRounded && ctx.bezierCurveTo(x + w - k * hr, y, x + w, y + k * vr, x + w, y + vr);

            // ctx.lineTo(x + w, y + h - vr);
            // isRounded && ctx.bezierCurveTo(x + w, y + h - k * vr, x + w - k * hr, y + h, x + w - hr, y + h);

            // ctx.lineTo(x + hr, y + h);
            // isRounded && ctx.bezierCurveTo(x + k * hr, y + h, x, y + h - k * vr, x, y + h - vr);

            // ctx.lineTo(x, y + vr);
            // isRounded && ctx.bezierCurveTo(x, y + k * vr, x + k * hr, y, x + hr, y);

            ctx.closePath();
            ctx.restore();
            // this.fill();
            this.stroke();
        }
    });

    return Rect;
});
