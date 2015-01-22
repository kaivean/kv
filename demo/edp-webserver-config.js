exports.port = 8848;
exports.directoryIndexes = true;
exports.documentRoot = __dirname + '/..';
exports.less = require('less');
exports.getLocations = function () {
    return [
        { 
            location: /\/$/, 
            handler: redirect('/demo/index.html', false) 
        },
        { 
            location: /^\/redirect-local/, 
            handler: redirect('redirect-target', false) 
        },
        { 
            location: /^\/redirect-remote/, 
            handler: redirect('http://www.baidu.com', false) 
        },
        { 
            location: /^\/redirect-target/, 
            handler: content('redirectd!') 
        },
        { 
            location: '/empty', 
            handler: empty() 
        },
        { 
            location: /\.tpl\.html($|\?)/, 
            handler: tplHandlerForEtpl() 
        },
        { 
            location: /\.tpl\.js($|\?)/, 
            handler: tplHandlerForSmarty4Js() 
        },
        { 
            location: /\.css($|\?)/, 
            handler: [
                autocss()
            ]
        },
        { 
            location: /\.less($|\?)/, 
            handler: [
                file(),
                less()
            ]
        },
        { 
            location: /\.styl($|\?)/, 
            handler: [
                file(),
                stylus()
            ]
        },
        { 
            location: /\.php($|\?)/, 
            handler: acitonHandler()
            
        },
        // 在查询字符串?之前不包含点号，就转到mock/index.php
        { 
            location: /^[^\.]+?($|\?)/,
            handler: acitonHandler()
            
        },
        { 
            location: /^.*$/, 
            handler: [
                file(),
                proxyNoneExists()
            ]
        }
    ];
};

exports.injectResource = function (res) {
    for (var key in res) {
        global[key] = res[key];
    }
};

// 处理后缀.tpl.html for etpl
function tplHandlerForEtpl() {
    return [
        html2js({
            mode: 'compress',
            wrap: false
        }),
        function (context) {// eval(context.content);
            
            // 去掉两端的单引号和空格，返回模板压缩的字符串
            context.content = context.content.replace(/^'*((.|\n)*?)'*$/, '$1').trim(); 
        }
    ];
}
// 处理后缀.tpl.js for Smarty4Js
function tplHandlerForSmarty4Js() {
    return [
        function (context) {

            var path = require('path');
            var req = context.request;
            var filepath = exports.documentRoot + req.path;

            var Smarty4Js = require('/usr/local/lib/node_modules/smarty4Js');
            var smarty4Js = new Smarty4Js();
            var tplPath = path.dirname(filepath) + '/' + path.basename(filepath, '.js') + '.html';
            console.log('to>>>>>>>>>', tplPath);
            context.content = smarty4Js.compile(require('fs').readFileSync(tplPath, 'utf8')).getJsTpl();
        }
    ];
}

function phpHandler() {
    return [
        // php()
        // changePath() ,
        proxy('test.baidu.com' , 80)
    ];
}

function acitonHandler() {
    return [
        php('php-cgi', 
            '',
            function (context) {
                var req = context.request;
                var path = req.pathname || '';
                var search = req.search || '';
                var str = path.split('.');
                console.log('to>>>>>>>>>' + path);
                var key = 'pathname';
                // 假如参数带有pathname
                if (req.query[key]) {
                    var d = new Date();
                    key = key + d.getFullYear() +   (d.getMonth() + 1)   + d.getDate()
                }
                // console.log(req);
                return {
                    pathname: '/mock/index.php',
                    search: search
                        + (search.indexOf('?') === -1 ? '?' : '&')
                        + key + '='
                        + str[0]
                };
            }
        )
        // livereload()
        // changePath() ,
        // proxy('test.baidu.com' , 80)
    ];
}

function changePath() {
    return function (context) {

        var req = context.request;
        var path = req.pathname || '';
        var search = req.search || '';
        var str = path.split('.');

        var params = str[0].split('/'); 
        if (params.length < 1) {
            return false;
        }
        params.shift();

        context.request.url = '/mock/index.php?'
            + (search.indexOf('?') === -1 ? '?' : '&')
            + 'pathname='
            + str[0];
        console.log(context.request.url);
    };
}
