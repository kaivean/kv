/**
 * @file  form
 * @author wukaifang(wukaifang@baidu.com)
 */

define(function (require) {
    var lib = require('../lib');
    var $ = lib.dom;

    function Form() {
        Form.prototype.init.apply(this, arguments);
    }

    var defaultOpts = {
        main: '',
        props: {
            id: '',
            action: '',
            enctype: 'multipart/form-data',
            target: '',
            method: 'GET'
        },
        groups: [
            {
                label: '姓名',
                component: {
                    type: 'text',
                    name: 'name',
                    placeholder: ''
                }
            },
            {
                label: '爱好',
                component: {
                    type: 'checkboxGroup',
                    name: 'hobby',
                    items: [
                        {
                            value: 'shan',
                            description: '爬山',
                            checked: 1
                        },
                        {
                            value: 'qiu',
                            description: '打球'
                        },
                        {
                            value: 'ying',
                            description: '看电影'
                        }
                    ]
                }
            },
            {
                label: '地区',
                component: {
                    type: 'select',
                    name: 'name',
                    options: [
                        {
                            name: '北京',
                            value: 1
                        },
                        {
                            name: '上海',
                            value: 2
                        },
                        {
                            name: '西安',
                            value: 3
                        }
                    ]
                }
            },
            {
                label: '上传文件：',
                component: {
                    type: 'file',
                    name: 'avatar'
                }
            },
            {
                label: '描述：',
                component: {
                    type: 'textarea',
                    name: 'avatar',
                    placeholder: '描述'
                }
            }
        ]
    };

    var components = {
        'button': {
            getComponent: function (conf) {
                var input = createElement('input', {
                    type: conf.type,
                    placeholder: conf.placeholder || null
                });

                return input;
            }
        },
        'submit': {
            getComponent: function (conf) {
                var input = createElement('input', {
                    type: conf.type,
                    name: conf.name || null,
                    placeholder: conf.placeholder || null
                });

                return input;
            }
        },
        'text': {
            getComponent: function (conf) {
                var input = createElement('input', {
                    type: conf.type,
                    name: conf.name || null,
                    placeholder: conf.placeholder || null
                });

                return input;
            }
        },
        'password': {
            getComponent: function (conf) {
                var input = createElement('input', {
                    type: conf.type,
                    name: conf.name || null,
                    placeholder: conf.placeholder || null
                });

                return input;
            }
        },
        'textarea': {
            getComponent: function (conf) {
                var input = createElement('textarea', {
                    type: conf.type,
                    name: conf.name || null,
                    placeholder: conf.placeholder || null
                });

                return input;
            }
        },
        'select': {
            getComponent: function (conf) {
                var input = createElement('select', {
                    name: conf.name || null
                });

                var opts = conf.options;
                var html = '';
                for (var i = 0; i < opts.length; i++) {
                    var opt = opts[i];
                    html += '<option value="' + opt.value + '">' +  opt.name + '</option>';
                }
                input.html(html);
                return input;
            }
        },
        'checkboxGroup': {
            getComponent: function (conf) {
                var items = conf.items;
                var cpt = [];
                for (var i = 0; i < items.length; i++) {
                    var item = items[i];
                    var label = createElement('label', {
                    });
                    var input = createElement('input', {
                        type: 'checkbox',
                        name: conf.name || item.name || null,
                        value: item.value || null,
                        checked: item.checked ? 'checked' : null
                    });

                    label.append(input).append(item.description);
                    cpt.push(label);
                }

                return $(cpt);
            },
            getValue: function (component, group, form) {
                var v = '';
                component.filter('input:checked').each(function () {
                    v += ',' + $(this).val();
                });
                return v;
            }
        },
        'radioGroup': {
            getComponent: function (conf) {
                var items = conf.items;
                var cpt = [];
                for (var i = 0; i < items.length; i++) {
                    var item = items[i];
                    var label = createElement('label', {
                    });
                    var input = createElement('input', {
                        type: 'radio',
                        name: conf.name || item.name || null,
                        checked: item.checked ? 'checked' : null
                    });

                    label.append(input).append(item.description);
                    cpt.push(label);
                }

                return $(cpt);
            },
            getValue: function (component, group, form) {
                var v = '';
                component.filter('input:checked').each(function () {
                    v += ',' + $(this).val();
                });
                return v;
            }
        },
        'file': {
            getComponent: function (conf) {
                var span = createElement('span', {
                    className: 'input-file'
                });

                var input = createElement('input', conf);

                span.append(input);
                span.append('浏览...');
                return span;
            }
        }
    };

    function createElement(nodeName, props) {
        var node = document.createElement(nodeName);
        var op2Jquery = {
            className: function (value) {
                this.addClass(value);
            }
        };
        props = props || {};
        for (var key in props) {
            if (lib.is.has(props, key) && !lib.is.nul(props[key])) {
                // 使用相应函数
                if (lib.is.has(op2Jquery, key)) {
                    op2Jquery[key].call($(node), props[key]);
                    continue;
                }
                $(node).attr(key, props[key]);
            }
        }
        return $(node);
    }

    function createComponent(componentConf) {
        componentConf.type = componentConf.type || 'text';
        var o = components[componentConf.type];
        var  component = o.getComponent(componentConf);

        return $(component);
    }


    function createGroup(conf) {
        var group = {};
        group.ele = createElement('div', {
            className: 'form-group'
        });
        group.label = createElement('label', {
            className: 'form-label'
        }).text(conf.label).appendTo(group.ele);

        group.cont = createElement('div', {
            className: 'form-cont'
        }).appendTo(group.ele);

        group.components = [];

        if (!lib.is.array(conf.component)) {
            conf.component = [conf.component];
        }
        for (var i = 0; i < conf.component.length; i++) {
            var cptConf = conf.component[i];
            var cpt = createComponent(cptConf);
            cpt.each(function () {
                $(this).appendTo(group.cont);
            });
            group.components.push(cpt);
        }

        group.tip = createElement('span', {
            className: 'form-tip form-tip-normal'
        }).appendTo(group.ele);

        return group;
    }

    function createForm(opt) {
        var form = createElement('form', opt.props);

        for (var i = 0; i < opt.groups.length; i++) {
            var groupConf = opt.groups[i];
            var group = createGroup.call(this, groupConf);
            form.append(group.ele);
            this.groups.push(group);
        }

        this.main.append(form);

        console.log(form);
    }

    Form.prototype.init = function (opt) {
        opt = opt || {};
        opt = lib.extend({}, defaultOpts, opt);

        this.main = $(opt.main);
        this.groups = [];

        createForm.call(this, opt);
    };

    lib.Observer.enable(Form);
    return Form;
});
