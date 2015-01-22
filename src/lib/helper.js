/**
 * 帮助库
 *
 * @file 帮助库
 * @author kaivean(kaisey2012@163.com)
 */

define(function (require) {
    var is = require('./is');
    var util = require('./util');

    /**
     * 帮助库
     *
     * @class
     * @singleton
     */
    var helper = {};

    /**
     * string format
     *
     * @param {string} source 模板字符串
     * @param {Object} opts   替换的变量对象，对象的key就是模板变量
     * @return {string}       目标代码
     */
    helper.format = function (source, opts) {
        source = String(source);

        opts = opts || {};

        return source.replace(
            /\{(.+?)\}/g,

            // var str = 'hello {name}'
            // match 整个正则匹配到的的值 match= '{name}''
            // 括号代表的匹配，key = 'name'
            function (match, variable) {
                var variables = variable.split('.');
                var val = opts;
                for (var i = 0; i < variables.length; i++) {
                    var key = variables[i];
                    if (is.undef(val[key])) {
                        val = undefined;
                        break;
                    }
                    else {
                        val = val[key];
                    }
                }

                var replacer = val;
                if (is.fn(replacer)) {
                    replacer = replacer(variable);
                }
                // 假如没有替换的值，就返回原值
                return (is.undef(replacer) ? match : replacer);
            }
        );
    };

    /**
     * 对目标字符串进行html编码
     * 编码字符有5个：&<>"'
     *
     * @public
     * @param {string} source 目标字符串
     * @return {string} html编码后的字符串
     */
    helper.encodeHTML = function (source) {
        return source === null
            ? ''
            : String(source)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;');
    };

    /**
     * 生成类 ， 该类自带拓展子类的方法
     *
     * @inner
     * @param {Object} props 该类的属性方法集合
     *
     * @return {Class} 新的类
     */
    helper.createClass = function (props) {
        // 此为生成的类
        function Class() {
            // 先调用父类原型初始化函数
            if (this.parentClass && this.parentClass.prototype.init) {
                this.parentClass.prototype.init.apply(this, arguments);
            }
            if (this.init) {
                this.init.apply(this, arguments);
            }
        }
        // Populate our constructed prototype object
        Class.prototype =  util.extend(Class.prototype, props || {});

        // Enforce the constructor to be what we expect
        Class.prototype.constructor = Class;

        /**
         * 扩展生成子类
         *
         * @param {Object} props 新类的扩展属性方法集合对象
         *
         * @return {Class} 新的子类
         */
        Class.extend = function (props) {
            return helper.extendProps(this, props);
        };

        return Class;
    };

    /**
     * 扩展属性生产新类
     *
     * @inner
     * @param {Class} parentClass 父类
     * @param {Object} props 扩展方法集合
     *
     * @return {Class} 新的子类
     */
    helper.extendProps = function (parentClass, props) {
        // 建立空类作为中介  并没有直接实例化父类，因为实例化空类内存少得多
        var EmptyClass = function () {

        };
        EmptyClass.prototype = parentClass.prototype;

        var SubClass = helper.createClass();
        SubClass.prototype = new EmptyClass();

        SubClass.prototype =  util.extend(SubClass.prototype, props || {});

        // 由于没有实例化父类  不能直接调用父类原型的函数，故在此先保留父类
        SubClass.prototype.parentClass = parentClass;

        return SubClass;

    };

    return helper;
});
