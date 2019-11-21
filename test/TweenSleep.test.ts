import 'mocha';
import {expect} from 'chai';
import {TweenSleep} from "../src";

describe('TweenSleep', () => {

	[0, 1, 1024].forEach(duration => {
		it("Duration should be set correctly", () => {
			const tween = new TweenSleep(duration);

			expect(tween.duration).to.equal(duration);
			expect(tween.remainingDuration).to.equal(duration);
		});
	});

	[-1, -999].forEach(duration => {
		it("Constructor should throw error when duration is negative", () => {
			expect(() => new TweenSleep(duration)).to.throw(Error);
		});
	});

	it("Should return used time, time is less than duration", () => {
		const tween = new TweenSleep(100);
		const usedTime = tween.advance(50);

		expect(usedTime).to.equal(50);
	});

	it("Should return used time, time is more than duration", () => {
		const tween = new TweenSleep(100);
		const usedTime = tween.advance(150);

		expect(usedTime).to.equal(100);
	});

	it("Should return zero time when tween is already finished", () => {
		const tween = new TweenSleep(100);
		tween.finish();
		const usedTime = tween.advance(150);

		expect(usedTime).to.equal(0);
	});

	it("Finished callback should be triggered when tween is finished", () => {
		let wasFinishCalled = false;

		const tween = new TweenSleep(100, () => wasFinishCalled = true);
		tween.advance(100);

		expect(wasFinishCalled).to.be.true;
	});

	it("Remaining duration should be calculated correctly", () => {
		const tween = new TweenSleep(100);
		tween.advance(40);

		expect(tween.remainingDuration).to.equal(60);
	});

	it("Finish should finish callback", () => {
		let wasFinishCalled = false;
		const tween = new TweenSleep(100, () => wasFinishCalled = true);
		tween.finish();

		expect(wasFinishCalled).to.be.true;
	});

	it("Skip should not invoke finish callback", () => {
		let wasFinishCalled = false;
		const tween = new TweenSleep(100, () => wasFinishCalled = true);
		tween.skip();

		expect(wasFinishCalled).to.be.false;
	});
});

