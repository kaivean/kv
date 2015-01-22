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

        fillStyle: '#000',
        strokeStyle: '#000',

        text: '',

        fontWeight: 'normal',
        fontStyle: 'normal',
        fontSize: 16,
        fontFamily: 'Arial',
        textAlign: 'left'
    };

    function getFontDeclaration() {
      return [
        // node-canvas needs "weight style", while browsers need "style weight"
        this.fontStyle,
        this.fontWeight,
        this.fontSize + 'px',
        this.fontFamily
      ].join(' ');
    }

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

            var curX = this.x;
            var curY = this.y;

            var ctx = this.ctx;

            ctx.beginPath();
            ctx.save();

            ctx.textBaseline = 'alphabetic';
            ctx.textAlign = this.textAlign;
            ctx.font = getFontDeclaration.call(this);
            // 设置填充颜色
            ctx.fillStyle = this.fillStyle;

            var textLines = this.text.split(/\n/);
            for (var i = 0; i < textLines.length; i++) {
                var text = textLines[i];
                // 设置字体内容，以及在画布上的位置
                ctx.fillText(text, curX, curY);
                curY += this.fontSize * 1.5;
            };

            // 绘制空心字
            // ctx.strokeText("Hello!", 10, 100);
            ctx.closePath();
            ctx.restore();            
        }
    });

    return Rect;
});
