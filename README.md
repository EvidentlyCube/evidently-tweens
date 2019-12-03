# Evidently Tweens

[![Build Status](https://travis-ci.com/EvidentlyCube/evidently-tweens.svg?branch=master)](https://travis-ci.com/EvidentlyCube/evidently-tweens)

A simple tweening library powered by TypeScript made for game dev for those who like their code to be type-safe and explicit in what it does.

## Getting Started

This library was written in TypeScript but will also work in projects written in JavaScript.

### Installing

Add it to your project via:

```
npm i --save evidently-tweens
```


### Documentation

The full documentation can be found [here](https://evidentlycube.github.io/evidently-tweens/). 

An example of using tweens:

```
import {TweenParallel} from "./TweenParallel";
import {TweenAnimate} from "./TweenAnimate";
import {TweenSequence} from "./TweenSequence";
import {TweenCallback} from "./TweenCallback";
import {TweenSleep} from "./TweenSleep";

const tween = new TweenParallel(
	() => console.log("Finished!"),
	new TweenAnimate(500, 0, 100, i => console.log(i)),
	new TweenSequence(
		undefined,
		new TweenCallback(() => console.log("Started!")),
		new TweenSleep(130),
		new TweenCallback(() => console.log("Yawn :3"))
	)
);

while (!tween.isFinished) {
	tween.advance(50);
}
```

Which will produce the following output in the console: 

```
10
Started!
20
30
Yawn :3
40
50
60
70
80
90
100
Finished!
```

## Details

 * The tweens operate on a unit-less duration, so you're free to use actual time or frames. 
 * There is no global, automatic runner, you need to call `advance()` on a tween instance to run it for specific amount of time.
 * Every tween accepts a callback that's called when it finishes.
 * `advance()` method accepts the duration for which the tweens should run and returns the amount of time consumed by that tween. For example, given a sleep tween with `duration=50`, if you call `advance(60)` on it, it will return `10`, because the 50 units of duration were used to run the tween.
 * The implemented tweens are:
    * `TweenSleep` which does nothing for the requested amount of duration (useful in `TweenSequence` or with a finished callback)
    * `TweenCallback` which instantly calls a function (useful in `TweenSequence`) and takes 0 duration.
    * `TweenAwait` which every time it runs calls a function, and if the function returns true it finishes. Takes 0 duration when it passes or all the available duration when it doesn't.
    * `TweenAnimate` animates a number with optional easing from certain value to another.
    * `TweenParallel` runs multiple tweens at the same time. On each run, `advance()` will return the amount of duration consumed by the longest tween in it, or 0 if there were no tweens to run.
    * `TweenSequence` runs tweens one after another. Any duration left from the execution of one tween will immediately be used on the next one. Thus, a single sequence with five `TweenCallback`s in it will run all of them in the sigle call to `advance()`
 
## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Links

 * [NPM](https://www.npmjs.com/package/evidently-tweens)
 * [Travis-ci](https://travis-ci.com/EvidentlyCube/evidently-tweens) 