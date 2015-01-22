/**
 * @file  Ellipse
 * @author wukaifang(wukaifang@baidu.com)
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

    var Triangle = Shape.extend({
        type: 'Triangle',

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

            var widthBy2 = this.width / 2;
            var heightBy2 = this.height / 2;

            ctx.moveTo(x - widthBy2, x + heightBy2);
            ctx.lineTo(x, y - heightBy2);
            ctx.lineTo(x + widthBy2,y + heightBy2);


            ctx.closePath();
            ctx.restore();
            // this.fill();
            this.stroke();
        }
    });

    return Triangle;
});
