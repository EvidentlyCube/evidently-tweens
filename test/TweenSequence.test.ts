import 'mocha';
import {expect} from 'chai';
import {TweenSleep} from "../src";
import {TweenSequence} from "../src";
import {TweenAwait} from "../src";

describe('TweenSequence', () =>
{
	it("Should add tweens to sequence", () =>
	{
		const tween1 = new TweenSleep(100);
		const tween2 = new TweenSleep(100);
		const sequence = new TweenSequence(null, tween1, tween2);

		expect(sequence.tweens).to.contain(tween1);
		expect(sequence.tweens).to.contain(tween2);
	});

	it("ShouldAddTweensToSequence_adding", () =>
	{
		const tween1 = new TweenSleep(100);
		const tween2 = new TweenSleep(100);
		const sequence = new TweenSequence();
		sequence.add(tween1);
		sequence.add(tween2);

		expect(sequence.tweens).to.contain(tween1);
		expect(sequence.tweens).to.contain(tween2);
	});

	it("ShouldThrowExceptionWhenAddingTheSameTweenMultipleTimes", () =>
	{
		const tween = new TweenSleep(100);
		expect(() => new TweenSequence(null, tween, tween)).to.throw();
	});

	it("ShouldThrowExceptionWhenAddingNullTween_arrayInit", () =>
	{
		expect(() => new TweenSequence(null, null as any)).to.throw();
	});

	it("ShouldThrowExceptionWhenAddingNullTween_adding", () =>
	{
		const sequence = new TweenSequence();
		expect(() => sequence.add(null as any)).to.throw();
	});

	it("ShouldAdvanceTheFirstTween", () =>
	{
		const tween1 = new TweenSleep(100);
		const tween2 = new TweenSleep(100);
		const sequence = new TweenSequence();
		sequence.add(tween1);
		sequence.add(tween2);

		sequence.advance(50);

		expect(tween1.remainingDuration).to.equal(50);
		expect(tween2.remainingDuration).to.equal(100);
		expect(tween1.isFinished).to.be.false;
		expect(tween2.isFinished).to.be.false;
	});

	it("ShouldAdvanceTheSecondTweenByWhatIsLeft", () =>
	{
		const tween1 = new TweenSleep(100);
		const tween2 = new TweenSleep(100);
		const sequence = new TweenSequence();
		sequence.add(tween1);
		sequence.add(tween2);

		sequence.advance(150);

		expect(tween1.remainingDuration).to.be.equal(0);
		expect(tween2.remainingDuration).to.be.equal(50);
		expect(tween1.isFinished).to.be.true;
		expect(tween2.isFinished).to.be.false;
	});

	it("ShouldSkipAllTheTweens", () =>
	{
		const tween1 = new TweenSleep(100);
		const tween2 = new TweenSleep(100);
		const sequence = new TweenSequence();
		sequence.add(tween1);
		sequence.add(tween2);

		sequence.skip();

		expect(tween1.isFinished).to.be.true;
		expect(tween2.isFinished).to.be.true;
		expect(sequence.isFinished).to.be.true;
	});

	it("ShouldFinishAllTheTweens", () =>
	{
		let tween1FinishCallbacks = 0;
		let tween2FinishCallbacks = 0;
		const tween1 = new TweenSleep(100, () => tween1FinishCallbacks++);
		const tween2 = new TweenSleep(100, () => tween2FinishCallbacks++);
		const sequence = new TweenSequence();
		sequence.add(tween1);
		sequence.add(tween2);

		sequence.finish();

		expect(tween1FinishCallbacks).to.be.equal(1);
		expect(tween2FinishCallbacks).to.be.equal(1);
		expect(tween1.isFinished).to.be.true;
		expect(tween2.isFinished).to.be.true;
		expect(sequence.isFinished).to.be.true;
	});

	it("ShouldFinishAllTheTweensOnlyOnceRegardlessOfCalls", () =>
	{
		let tween1FinishCallbacks = 0;
		let tween2FinishCallbacks = 0;
		const tween1 = new TweenSleep(100, () => tween1FinishCallbacks++);
		const tween2 = new TweenSleep(100, () => tween2FinishCallbacks++);
		const sequence = new TweenSequence();
		sequence.add(tween1);
		sequence.add(tween2);

		sequence.finish();
		sequence.finish();
		sequence.finish();

		expect(tween1FinishCallbacks).to.be.equal(1);
		expect(tween2FinishCallbacks).to.be.equal(1);
		expect(tween1.isFinished).to.be.true;
		expect(tween2.isFinished).to.be.true;
		expect(sequence.isFinished).to.be.true;
	});

	it("ShouldTriggerFinishCallbackOnlyWhenLastTweenFinishes", () =>
	{
		let sequenceFinishCallbackCount = 0;
		const tween1 = new TweenSleep(100);
		const tween2 = new TweenSleep(100);
		const sequence = new TweenSequence(() => sequenceFinishCallbackCount++);
		sequence.add(tween1);
		sequence.add(tween2);

		sequence.advance(50);
		expect(sequenceFinishCallbackCount).to.be.equal(0);
		sequence.advance(50);
		expect(sequenceFinishCallbackCount).to.be.equal(0);
		sequence.advance(50);
		expect(sequenceFinishCallbackCount).to.be.equal(0);
		sequence.advance(50);
		expect(sequenceFinishCallbackCount).to.be.equal(1);
		sequence.advance(50);
		expect(sequenceFinishCallbackCount).to.be.equal(1);
		expect(sequence.isFinished).to.be.true;
	});

	it("FinishOne_ExhaustiveTest", () =>
	{
		let tween1FinishCallbacks = 0;
		let tween2FinishCallbacks = 0;
		let sequenceFinishCallbacks = 0;
		const tween1 = new TweenSleep(100, () => tween1FinishCallbacks++);
		const tween2 = new TweenSleep(100, () => tween2FinishCallbacks++);
		const tween3 = new TweenAwait(() => false);
		const sequence = new TweenSequence(() => sequenceFinishCallbacks++);
		sequence.add(tween1);
		sequence.add(tween2);
		sequence.add(tween3);

		sequence.finishOne();
		expect(sequence.tweenCount).to.be.equal(2);
		expect(tween1FinishCallbacks).to.be.equal(1);
		expect(tween2FinishCallbacks).to.be.equal(0);
		expect(sequenceFinishCallbacks).to.be.equal(0);
		expect(tween1.isFinished).to.be.true;
		expect(tween2.isFinished).to.be.false;
		expect(tween3.isFinished).to.be.false;
		expect(sequence.isFinished).to.be.false;

		sequence.finishOne();
		expect(sequence.tweenCount).to.be.equal(1);
		expect(tween1FinishCallbacks).to.be.equal(1);
		expect(tween2FinishCallbacks).to.be.equal(1);
		expect(sequenceFinishCallbacks).to.be.equal(0);
		expect(tween1.isFinished).to.be.true;
		expect(tween2.isFinished).to.be.true;
		expect(tween3.isFinished).to.be.false;
		expect(sequence.isFinished).to.be.false;

		sequence.finishOne();
		expect(sequence.tweenCount).to.be.equal(0);
		expect(tween1FinishCallbacks).to.be.equal(1);
		expect(tween2FinishCallbacks).to.be.equal(1);
		expect(sequenceFinishCallbacks).to.be.equal(1);
		expect(tween1.isFinished).to.be.true;
		expect(tween2.isFinished).to.be.true;
		expect(tween3.isFinished).to.be.true;
		expect(sequence.isFinished).to.be.true;
	});

	it("SkipOne_ExhaustiveTest", () =>
	{
		let tween1FinishCallbacks = 0;
		let tween2FinishCallbacks = 0;
		let sequenceFinishCallbacks = 0;
		const tween1 = new TweenSleep(100, () => tween1FinishCallbacks++);
		const tween2 = new TweenSleep(100, () => tween2FinishCallbacks++);
		const sequence = new TweenSequence(() => sequenceFinishCallbacks++);
		sequence.add(tween1);
		sequence.add(tween2);

		sequence.skipOne();
		expect(sequence.tweenCount).to.be.equal(1);
		expect(tween1FinishCallbacks).to.be.equal(0);
		expect(tween2FinishCallbacks).to.be.equal(0);
		expect(sequenceFinishCallbacks).to.be.equal(0);
		expect(tween1.isFinished).to.be.true;
		expect(tween2.isFinished).to.be.false;
		expect(sequence.isFinished).to.be.false;

		sequence.skipOne();
		expect(sequence.tweenCount).to.be.equal(0);
		expect(tween1FinishCallbacks).to.be.equal(0);
		expect(tween2FinishCallbacks).to.be.equal(0);
		expect(sequenceFinishCallbacks).to.be.equal(1);
		expect(tween1.isFinished).to.be.true;
		expect(tween2.isFinished).to.be.true;
		expect(sequence.isFinished).to.be.true;
	});
});

