/**
 * @file cookie封装
 * @author wukaifang(wukaifang@baidu.com)
 */

define(function (require) {

    var json = require('./json');

    /**
     * 编码
     */
    var encode = encodeURIComponent;

    /**
     * 解码
     */
    var decode = decodeURIComponent;

    /**
     * 序列化json对象
     *
     * @param {Object} jsonObj json
     *
     * @return {string} 序列化的字符串
     */
    function serialize(jsonObj) {
        return encode(json.stringify(jsonObj));
    }

    /**
     * 反序列化成json对象
     *
     * @param {string} str 字符串
     *
     * @return {Object} json对象
     */
    function deserialize(str) {
        str = decode(str);
        return json.parse(str);
    }

    // 返回接口
    return {
        /**
         * 保存cookie
         *
         * @param {string} key key
         * @param {Object} value 值
         * @param {Object} opts 参数
         * @param {number} opts.expires 过期时间，以天为单位
         * @param {string} opts.path cookie在该路径下有效
         * @param {string} opts.domain cookie在该domain下有效
         * @param {boolean} opts.secure cookie路径
         *
         * @return {Object} cookie
         */
        write: function (key, value, opts) {
            if (typeof opts.expires === 'number') {
                var days = opts.expires;
                var t = opts.expires = new Date();
                t.setTime(+t + days * 864e+5);
            }

            return (document.cookie = [
                encode(key), '=', serialize(value),
                // cookie参数
                opts.expires ? '; expires=' + opts.expires.toUTCString() : '',
                opts.path    ? '; path=' + opts.path : '',
                opts.domain  ? '; domain=' + opts.domain : '',
                opts.secure  ? '; secure' : ''
            ].join(''));

        },

        /**
         * 读取cookie
         *
         * @param {string} key cookie的关键词
         *
         * @return {Object} json
         */
        read: function (key) {
            var result = key ? undefined : {};

            // 发现没有cookie便返回空数组
            var cookies = document.cookie ? document.cookie.split('; ') : [];

            for (var i = 0, l = cookies.length; i < l; i++) {
                var parts = cookies[i].split('=');
                var name = decode(parts.shift());
                var cookie = parts.join('=');

                if (key && key === name) {
                    // 反序列化
                    result = deserialize(cookie);
                    break;
                }

                // 获取未能序列化的cookie
                if (!key && (cookie = deserialize(cookie)) !== undefined) {
                    result[name] = cookie;
                }
            }

            return result;
        },

        /**
         * 移除cookie
         *
         * @param {string} key cookie的关键词
         *
         * @return {boolean} 是否删除成功
         */
        remove: function (key) {
            if (this.read(key) === undefined) {
                return false;
            }
            this.write(key, '', {expires: -1});
            return !this.read(key);
        }
    };

});
