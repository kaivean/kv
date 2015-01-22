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
        width: 50,
        height: 50
    };

    var Ellipse = Shape.extend({
        type: 'Ellipse',

        init: function (props) {
            var me = this;
            props = lib.extend({}, defaultProps, props);

            lib.each(props, function (value, prop) {
                me.set(prop, value);
            });
        },

        render: function () {
            var x = this.x;
            var y = this.y;
            var k = (this.width / 0.75) / 2;
            var width = this.width / 2;
            var height = this.height / 2;

            var ctx = this.ctx;

            ctx.beginPath();
            ctx.save();
            ctx.moveTo(x, y - height);

            ctx.bezierCurveTo(x + k, y - height, x + k, y + height, x, y + height);
            ctx.bezierCurveTo(x - k, y + height, x - k, y - height, x, y - height);

            ctx.restore();

            this.fill();
            // this.stroke();
        },
        isClicked: function (e) {
            
        }
    });

    return Ellipse;
});
