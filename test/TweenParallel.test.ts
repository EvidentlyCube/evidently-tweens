import 'mocha';
import {expect} from 'chai';
import {TweenSleep} from "../src";
import {TweenParallel} from "../src";
import {TweenAwait, TweenSequence} from "../src";

class TestCase
{
	public readonly tween1: TweenSleep;
	public readonly tween2: TweenSleep;
	public parallelTween: TweenParallel;
	public tween1FinishCallbacks: number = 0;
	public tween2FinishCallbacks: number = 0;
	public tweenParallelFinishCallbacks: number = 0;

	public constructor()
	{
		this.tween1 = new TweenSleep(200, () => this.tween1FinishCallbacks++);
		this.tween2 = new TweenSleep(100, () => this.tween2FinishCallbacks++);
		this.parallelTween = new TweenParallel(() => this.tweenParallelFinishCallbacks++);
		this.parallelTween.add(this.tween1);
		this.parallelTween.add(this.tween2);
	}
}

describe('TweenParallel', () =>
{
	it("ShouldStartEmpty", () =>
	{
		const parallel = new TweenParallel();

		expect(parallel.tweenCount).to.equal(0);
	});


	it("ShouldAddTween", () =>
	{
		const tween = new TweenSleep(100);
		const parallel = new TweenParallel();
		parallel.add(tween);

		expect(parallel.tweenCount).to.equal(1);
		expect(parallel.isFinished).to.be.false;
		expect(parallel.tweens).to.contain(tween);
	});


	it("ShouldAddTweensPassedInConstructor_paramInit", () =>
	{
		const tween1 = new TweenSleep(200);
		const tween2 = new TweenSleep(100);
		const parallel = new TweenParallel(null, tween1, tween2);

		expect(parallel.tweenCount).to.equal(2);
		expect(parallel.isFinished).to.be.false;
		expect(parallel.tweens).to.contain(tween1);
		expect(parallel.tweens).to.contain(tween2);
	});

	it("ShouldThrowExceptionWhenAddingNullTween_paramsInit", () =>
	{
		expect(() => new TweenParallel(null, null)).to.throw(Error);
	});

	it("ShouldThrowExceptionWhenAddingNullTween_adding", () =>
	{
		const parallel = new TweenParallel();

		expect(() => parallel.add(null)).to.throw(Error);
	});


	it("ShouldThrowExceptionWhenAddingTheSameTweenTwice_paramsInit", () =>
	{
		const tween = new TweenSleep(100);
		expect(() => new TweenParallel(null, tween, tween)).to.throw(Error);
	});

	it("ShouldThrowExceptionWhenAddingTheSameTweenTwice_adding", () =>
	{
		const tween = new TweenSleep(100);
		const parallel = new TweenParallel();
		parallel.add(tween);

		expect(() => parallel.add(tween)).to.throw(Error);
	});


	it("ShouldadvanceAllTweensBySpecifiedTime", () =>
	{
		const testCase = new TestCase();
		testCase.parallelTween.advance(50);

		expect(testCase.tween1.remainingDuration).to.equal(150);
		expect(testCase.tween2.remainingDuration).to.equal(50);
	});


	it("ShouldRemoveFinishedTweens", () =>
	{
		const testCase = new TestCase();
		testCase.parallelTween.advance(150);

		expect(testCase.parallelTween.tweenCount).to.equal(1);
		expect(testCase.parallelTween.tweens).to.contain(testCase.tween1);
		expect(testCase.parallelTween.tweenCount).to.not.contain(testCase.tween2);
	});


	it("ShouldRemoveFinishedTweensEvenMultipleAtOnce", () =>
	{
		const testCase = new TestCase();
		testCase.parallelTween.advance(250);

		expect(testCase.parallelTween.tweenCount).to.equal(0);
		expect(testCase.parallelTween.tweenCount).to.not.contain(testCase.tween1);
		expect(testCase.parallelTween.tweenCount).to.not.contain(testCase.tween2);
	});


	it("ShouldTriggerFinishCallback", () =>
	{
		const testCase = new TestCase();
		testCase.parallelTween.advance(250);

		expect(testCase.tweenParallelFinishCallbacks).to.equal(1);
	});


	it("ShouldNotTriggerFinishCallbackWhenThereWereNoTweens", () =>
	{
		let tweenParallelFinishCallbacks = 0;
		const parallel = new TweenParallel(() => tweenParallelFinishCallbacks++);
		parallel.advance(100);

		expect(tweenParallelFinishCallbacks).to.equal(0);
	});


	it("ShouldNotTriggerFinishCallbackTheSecondTimeWhenadvancedWithoutTweens", () =>
	{
		const testCase = new TestCase();
		testCase.parallelTween.advance(250);
		testCase.parallelTween.advance(250);

		expect(testCase.tweenParallelFinishCallbacks).to.equal(1);
	});


	it("ShouldTriggerFinishCallbackAgainWhenNewTweenWasAdded", () =>
	{
		const testCase = new TestCase();
		testCase.parallelTween.advance(250);
		testCase.parallelTween.add(new TweenSleep(100));
		testCase.parallelTween.advance(250);

		expect(testCase.tweenParallelFinishCallbacks).to.equal(2);
	});


	it("ShouldReturnLargestTimeSpanUsed_usedLessThanMax", () =>
	{
		const testCase = new TestCase();
		const result = testCase.parallelTween.advance(50);

		expect(result).to.equal(50);
	});


	it("ShouldReturnLargestTimeSpanUsed_usedMoreThanMax", () =>
	{
		const testCase = new TestCase();
		const result = testCase.parallelTween.advance(250);

		expect(result).to.equal(200);
	});

	it("ShouldFinishAllTweens", () =>
	{
		const testCase = new TestCase();
		testCase.parallelTween.finish();

		expect(testCase.parallelTween.isFinished).to.be.true;
		expect(testCase.tween1.isFinished).to.be.true;
		expect(testCase.tween2.isFinished).to.be.true;
		expect(testCase.tweenParallelFinishCallbacks).to.equal(1);
		expect(testCase.parallelTween.tweenCount).to.equal(0);
	});

	it("ShouldFinishAllTweens_evenWhenAwaitAdded", () =>
	{
		let finishWasCalled = false;
		const awaitTween = new TweenAwait(() => false);
		const testCase = new TweenSequence(() => finishWasCalled = true, awaitTween);
		testCase.finish();

		expect(awaitTween.isFinished).to.be.true;
		expect(testCase.isFinished).to.be.true;
		expect(finishWasCalled).to.be.true;
	});


	it("ShouldSkipAllTweens", () =>
	{
		const testCase = new TestCase();
		testCase.parallelTween.skip();

		expect(testCase.parallelTween.isFinished).to.be.true;
		expect(testCase.tween1.isFinished).to.be.true;
		expect(testCase.tween2.isFinished).to.be.true;
		expect(testCase.tween1FinishCallbacks).to.equal(0);
		expect(testCase.tween2FinishCallbacks).to.equal(0);
		expect(testCase.tweenParallelFinishCallbacks).to.equal(0);
		expect(testCase.parallelTween.tweenCount).to.equal(0);
	});
});

