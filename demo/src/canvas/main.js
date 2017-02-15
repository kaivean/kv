/**
 * @file 中间页入口文件
 * @author kaivean(kaivean@outlook.com)
 */

define(function (require, exports) {

    var lib = require('kv/lib');
    var $ = require('jquery');
    var Canvas = require('kv/canvas/Canvas');
    var Ellipse = require('kv/canvas/shape/Ellipse');
    var Rect = require('kv/canvas/shape/Rect');
    var Circle = require('kv/canvas/shape/Circle');
    var Triangle = require('kv/canvas/shape/Triangle');
    var Text = require('kv/canvas/shape/Text');

    var canvas;
    /**
     * 初始化模块
     *
     * @public
     */
    exports.init = function () {
        canvas = new Canvas('mycanvas', {
            width: 800,
            height: 600
        });

        var ellipse = new Ellipse({
            id: 'myellipse',
            x: 100,
            y: 100,
            width: 10,
            height: 20
        });

        var circle = new Circle({
            id: 'mycircle',
            x: 50,
            y: 50,
            radius: 10
        });

        var rect = new Rect({
            id: 'myrect',
            x: 20,
            y: 20,
            
            fillColor: '#666',
            width: 80,
            height: 80

        });

        var tri = new Triangle({
            id: 'myrect',
            x: 100,
            y: 100,
            
            fillColor: '#666',
            width: 80,
            height: 80
        });

        var text = new Text({
            x: 100,
            y: 100,
            text: 'hello\nkaivean'
        });

        canvas.add(ellipse);

        canvas.add(circle);

        canvas.add(rect);

        canvas.add(text);

        canvas.add(tri);

        canvas.render();

        lib.event.once(document.getElementById('right'), 'mouseenter', function (e) {
            console.log('mouseenter', e);
        });

        lib.event.on(document.getElementById('right'), 'mouseleave', function (e) {
            console.log('mouseleave', e);
            lib.event.fire(document.getElementById('h'), 'click');
        });



        // $('#h').mouseenter(function (e) {
        //     console.log('mouseenter jquery', e);
        // });

    };

    return exports;
});
