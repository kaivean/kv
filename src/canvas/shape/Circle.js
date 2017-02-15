/**
 * @file  Circle
 * @author kaivean(kaivean@outlook.com)
 */

define(function (require) {
    var lib = require('kv/lib');
    var Shape = require('./Shape');

    var defaultProps = {
        id: '',
        x: 0,
        y: 0,
        radius: 50,
        fillStyle: '#000',
        strokeStyle: '#000',
    };

    var Circle = Shape.extend({
        type: 'Circle',

        init: function (props) {
            var me = this;
            props = lib.extend({}, defaultProps, props);

            lib.each(props, function (value, prop) {
                me.set(prop, value);
            });
        },

        render: function () {
            var ctx = this.ctx;
            var x = this.x;
            var y = this.y;
            var radius = this.radius;

            ctx.beginPath();
            ctx.save();

            ctx.arc(x, y, radius, 0, Math.PI * 2);

            ctx.restore();

            this.fill();
            // this.stroke();
        },
        isClicked: function (e) {

        }
    });


    return Circle;
});
