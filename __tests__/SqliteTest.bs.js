// Generated by BUCKLESCRIPT VERSION 2.2.0, PLEASE EDIT WITH CARE
'use strict';

var Fs = require("fs");
var Jest = require("@glennsl/bs-jest/src/jest.js");
var Curry = require("bs-platform/lib/js/curry.js");
var Sqlite = require("../src/Sqlite.bs.js");
var Js_option = require("bs-platform/lib/js/js_option.js");
var Belt_Array = require("bs-platform/lib/js/belt_Array.js");
var Json_decode = require("@glennsl/bs-json/src/Json_decode.bs.js");

function decode_insert_result(json) {
  return /* record */[
          /* changes */Json_decode.field("changes", Json_decode.$$int, json),
          /* last_insert_id */Json_decode.field("lastInsertROWID", Json_decode.$$int, json)
        ];
}

function decode_test_all_row(json) {
  return /* record */[
          /* id */Json_decode.field("id", (function (param) {
                  return Json_decode.optional(Json_decode.$$int, param);
                }), json),
          /* foo */Json_decode.field("foo", Json_decode.string, json)
        ];
}

function decode_test_file_row(json) {
  return /* record */[
          /* bar */Json_decode.field("bar", Json_decode.string, json),
          /* baz */Json_decode.field("baz", Json_decode.string, json)
        ];
}

function runner(db, expected, sql, fn, _) {
  return Jest.Expect[/* toBe */2](expected, Jest.Expect[/* expect */0](Json_decode.field("result", Json_decode.$$int, Curry._1(fn, db.prepare(sql)))));
}

describe("Basic functionality", (function () {
        var db = Sqlite.Connection[/* make */1]("test.db", /* Some */[true], /* None */0, /* None */0, /* () */0);
        Jest.test("Should be able to execute a simple select", (function (param) {
                return runner(db, 2, "SELECT 1+1 AS result", (function (s) {
                              return s.get();
                            }), param);
              }));
        Jest.test("Should interpolate un-named parameters", (function (param) {
                return runner(db, 3, "SELECT ? + ? AS result", (function (s) {
                              return s.get(1, 2);
                            }), param);
              }));
        Jest.test("Should interpolate :named parameters", (function (param) {
                return runner(db, 3, "SELECT :x + :y AS result", (function (s) {
                              return s.get({
                                          x: 1,
                                          y: 2
                                        });
                            }), param);
              }));
        Jest.test("Should interpolate $named parameters", (function (param) {
                return runner(db, 12, "SELECT $x + $y AS result", (function (s) {
                              return s.get({
                                          x: 5,
                                          y: 7
                                        });
                            }), param);
              }));
        return Jest.test("Should interpolate @named parameters", (function (param) {
                      return runner(db, 18, "SELECT @x + @y AS result", (function (s) {
                                    return s.get({
                                                x: 3,
                                                y: 15
                                              });
                                  }), param);
                    }));
      }));

describe("`all` and `run` functions", (function () {
        var db = Sqlite.Connection[/* make */1]("test.db", /* Some */[true], /* None */0, /* None */0, /* () */0);
        Jest.beforeAllAsync(/* None */0, (function (finish) {
                var s = db.prepare("\n      CREATE TABLE `test_all_and_run` (\n        `id` INTEGER PRIMAY KEY\n      , `foo`\n      )\n    ");
                s.run();
                return Curry._1(finish, /* () */0);
              }));
        Jest.afterAllAsync(/* None */0, (function (finish) {
                var s = db.prepare(" DROP TABLE `test_all_and_run` ");
                s.run();
                return Curry._1(finish, /* () */0);
              }));
        Jest.test("INSERT a record", (function () {
                var s = db.prepare("\n      INSERT INTO `test_all_and_run` (`foo`) VALUES ('moo')\n    ");
                var param = decode_insert_result(s.run());
                return Jest.Expect[/* toBeSupersetOf */9](/* int array */[
                            1,
                            1
                          ], Jest.Expect[/* expect */0](/* int array */[
                                param[/* changes */0],
                                param[/* last_insert_id */1]
                              ]));
              }));
        return Jest.test("Retrieve the newly inserted record", (function () {
                      var s = db.prepare("\n      SELECT * FROM `test_all_and_run` WHERE `foo` = 'moo'\n    ");
                      var a = s.all();
                      var a$1 = Belt_Array.map(a, decode_test_all_row);
                      var a$2 = Belt_Array.get(a$1, 0);
                      return Jest.Expect[/* toBeSupersetOf */9](/* array */["moo"], Jest.Expect[/* expect */0](Js_option.getWithDefault(/* array */[], Js_option.map((function (param) {
                                                return /* array */[param[/* foo */1]];
                                              }), a$2))));
                    }));
      }));

describe("File based database", (function () {
        var db_path = "/tmp/test.db";
        beforeAll((function () {
                var db = Sqlite.Connection[/* make */1](db_path, /* None */0, /* None */0, /* None */0, /* () */0);
                var s = db.prepare("\n      CREATE TABLE `test_file_db` (\n        `bar`\n      , `baz`\n      )\n    ");
                s.run();
                return /* () */0;
              }));
        afterAll((function () {
                Fs.unlinkSync(db_path);
                return /* () */0;
              }));
        Jest.test("insert and retrieve record from file database", (function () {
                var db = Sqlite.Connection[/* make */1](db_path, /* None */0, /* None */0, /* Some */[true], /* () */0);
                var s = db.prepare("\n      INSERT INTO `test_file_db` (`bar`, `baz`) VALUES ('moo', 'cow')\n    ");
                var param = decode_insert_result(s.run());
                return Jest.Expect[/* toBeSupersetOf */9](/* int array */[
                            1,
                            1
                          ], Jest.Expect[/* expect */0](/* int array */[
                                param[/* changes */0],
                                param[/* last_insert_id */1]
                              ]));
              }));
        Jest.test("read-only flag", (function () {
                var db = Sqlite.Connection[/* make */1](db_path, /* None */0, /* Some */[true], /* None */0, /* () */0);
                return Jest.Expect[/* toThrowMessageRe */22]((/attempt to write a readonly database/), Jest.Expect[/* expect */0]((function () {
                                  var s = db.prepare("\n        INSERT INTO `test_file_db` (`bar`, `baz`) VALUES ('fail', 'stuff')\n      ");
                                  return s.run();
                                })));
              }));
        return /* () */0;
      }));

exports.decode_insert_result = decode_insert_result;
exports.decode_test_all_row = decode_test_all_row;
exports.decode_test_file_row = decode_test_file_row;
exports.runner = runner;
/*  Not a pure module */
