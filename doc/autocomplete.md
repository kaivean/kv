## 使用

``` less
    .@{w-autocomplete}-menu {
        position: absolute;
        top: 52px;
        left: 0;
        display: none;
        background: #fff;
        z-index: 10001;
        border: 1px solid #ddd;
        boder-top: none;

        // 列表项
        li {
            padding: 5px;

            &.@{w-autocomplete}-item-sel {
                background: #ddd;
                color: #fff;
            }
        }
    }
```

```html
    <input id="query-input" name="wd" type="text" placeholder="" aria-label="请输入搜索词" accesskey="s" autofocus="true" autocomplete="off" aria-haspopup="true" aria-combobox="list" role="combobox" class="search-combobox-input" x-webkit-speech="" x-webkit-grammar="builtin:translate"/>
```

```javascript
    var ac = new AutoComplete({
        main: '#query-input',
        itemNum: 20,
        source: function (query)  {
            var data = [
                'wpppw',
                'oooooo'
            ];
            return data;
        },

        handleSourceData: function (data, query)  {
            return data;
        },

        content: function (key, value, $item, query) {
            return value;
        },

        onItemClick: function (value, $item) {
            console.log('click', value, $item);
            var data = [
                '我爱我家',
                '房地产'
            ];
            ac.setData(data);
        }
    });
```