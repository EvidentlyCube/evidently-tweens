"use strict";
exports.__esModule = true;
var TweenParallel_1 = require("./TweenParallel");
var TweenAnimate_1 = require("./TweenAnimate");
var TweenSequence_1 = require("./TweenSequence");
var TweenCallback_1 = require("./TweenCallback");
var tween = new TweenParallel_1.TweenParallel(function () { return console.log("Finished!"); }, new TweenAnimate_1.TweenAnimate(500, 0, 100, function (i) { return console.log(i); }), new TweenSequence_1.TweenSequence(undefined, new TweenCallback_1.TweenCallback(function () { return console.log("Started!"); })));
while (!tween.isFinished) {
    tween.advance(50);
}
