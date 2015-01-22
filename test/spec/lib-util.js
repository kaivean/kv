/**
 * @file test
 * @author kaivean(kaisey2012@163.com)
 */

define(function (require) {
    var  lib = require('kv/lib');
    describe('util.indexOf', function () {

        describe('arr = [1, 5, 8, 9]', function () {
            var arr = [1, 5, 8, 9];
            it('8 is located in 2', function () {
                expect(lib.indexOf(arr, 8)).toEqual(2);
            });

            it('4 should be located in -1', function () {
                expect(lib.indexOf(arr, 4)).toEqual(-1);
            });
        });
    });

    describe('util.keys', function () {
        describe('test array', function () {
            var o = [1, 5, 8, 9];
            it('get keys', function () {
                expect(lib.keys(o)).toEqual([]);
            });
        });

        describe('test object', function () {
            var o = {
                name:  'kaivean',
                age: 10,
                sex: 'male'
            };
            it('get  object keys', function () {
                expect(lib.keys(o)).toEqual(['name', 'age', 'sex']);
            });
        });
    });

    describe('util.extend', function () {
        var o = {
            name:  'hello'
        };
        var b = {
            name:  'kaivean',
            age: 10,
            sex: 'male'
        };
        it('o b merge', function () {
            expect(lib.extend({}, o, b)).toEqual(b);
        });
        it('b o merge ', function () {
            expect(lib.extend({}, b, o)).not.toEqual(b);
        });

        it('name is hello ', function () {
            expect(lib.extend(b, o).name).toEqual('hello');
        });
    });

    describe('util.each', function () {
        var b = {
            name:  'kaivean',
            age: 10,
            sex: 'male'
        };
        lib.each(b, function (v ,i , o) {
            console.log(v, i ,o);
            it('a', function () {
                expect(v).toEqual(b[i]);
            });
        });
    });


    describe('url.parse', function () {
        var url1 = 'http://www.baidu.com/life/hunshapic?module=life&zt=ps#list';
        var url2 = 'www.baidu.com/life/hunshapic?module=life&zt=ps';
        var url3 = 'www.baidu.com/?#list';

        it('ok http://www.baidu.com/life/hunshapic?module=life&zt=ps#list', function () {
            var obj = lib.url.parse(url1);
            console.log('url.parse url1', obj);
            expect(lib.url.parse(url1).protocol).toEqual('http');
            expect(lib.url.parse(url1).host).toEqual('www.baidu.com');
            expect(lib.url.parse(url1).path).toEqual('/life/hunshapic');
        });
        it('ok www.baidu.com/life/hunshapic?module=life&zt=ps', function () {
            var obj = lib.url.parse(url2);
            console.log('url.parse url2', obj);
            expect(lib.url.parse(url2).protocol).toBeUndefined();
            expect(lib.url.parse(url2).host).toEqual('www.baidu.com');
            expect(lib.url.parse(url2).path).toEqual('/life/hunshapic');
        });

        it('ok http://www.baidu.com/?module=life&zt=ps#list', function () {
            var obj = lib.url.parse(url3);
            console.log('url.parse url3', obj);
            expect(lib.url.parse(url3).protocol).toBeUndefined();
            expect(lib.url.parse(url3).host).toEqual('www.baidu.com');
            expect(lib.url.parse(url3).query).toEqual({});
            expect(lib.url.parse(url3).hash).toEqual('list');
        });
    });

    describe('url.serializeQuery', function () {
        var query = {
            module: 'life',
            test: {zt: 'ps'}
        }

        it('ok', function () {
            var str = lib.url.serializeQuery(query);
            expect(str).not.toEqual('list');
            console.log('url.serializeQuery', str);
        });
    });

});
// describe("Player", function() {
//   var player;
//   var song;

//   beforeEach(function() {
//     player = new Player();
//     song = new Song();
//   });

//   it("should be able to play a Song", function() {
//     player.play(song);
//     expect(player.currentlyPlayingSong).toEqual(song);

//     //demonstrates use of custom matcher
//     expect(player).toBePlaying(song);
//   });

//   describe("when song has been paused", function() {
//     beforeEach(function() {
//       player.play(song);
//       player.pause();
//     });

//     it("should indicate that the song is currently paused", function() {
//       expect(player.isPlaying).toBeFalsy();

//       // demonstrates use of 'not' with a custom matcher
//       expect(player).not.toBePlaying(song);
//     });

//     it("should be possible to resume", function() {
//       player.resume();
//       expect(player.isPlaying).toBeTruthy();
//       expect(player.currentlyPlayingSong).toEqual(song);
//     });
//   });

//   // demonstrates use of spies to intercept and test method calls
//   it("tells the current song if the user has made it a favorite", function() {
//     spyOn(song, 'persistFavoriteStatus');

//     player.play(song);
//     player.makeFavorite();

//     expect(song.persistFavoriteStatus).toHaveBeenCalledWith(true);
//   });

//   //demonstrates use of expected exceptions
//   describe("#resume", function() {
//     it("should throw an exception if song is already playing", function() {
//       player.play(song);

//       expect(function() {
//         player.resume();
//       }).toThrowError("song is already playing");
//     });
//   });
// });
