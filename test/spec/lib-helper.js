/**
 * @file test
 * @author kaivean(kaisey2012@163.com)
 */

define(function (require) {
    var  lib = require('kv/lib');

    describe('lib.helper', function () {

        it('format', function () {
            var ret = lib.format('hello {my.name}! {test}', {my: {name: "kaifang"} } );
            expect(ret).toEqual('hello kaifang! {test}');
            console.log(ret);
        });
        
    });
});
