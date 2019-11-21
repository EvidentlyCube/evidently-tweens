import 'mocha';
import {expect} from 'chai';
import {TweenAwait} from "../src";

const testDurations = [0, 1, 100, 1024*1024*1024];

describe('TweenAwait', () => {
	it("Should throw error when no function apssed in constructor", () => {
		expect(() => new TweenAwait(null)).to.throw(Error);
	});

	testDurations.forEach(duration => {
		it(`Should call await callback on advance regardless of time passed (duration=${duration})`, () => {
			let awaitCallCount = 0;
			const tween = new TweenAwait(() =>
			{
				awaitCallCount++;
				return false;
			});

			tween.advance(duration);
			expect(awaitCallCount).to.equal(1)
		});
	});

	testDurations.forEach(duration => {
		it(`Should return passed time when await callback return false (duration=${duration})`, () => {
			const tween = new TweenAwait(() => false);

			const result = tween.advance(duration);

			expect(result).to.equal(duration);
		});
	});

	testDurations.forEach(duration => {
		it(`Should return zero when calling advance and tween finishes (duration=${duration})`, () => {
			const tween = new TweenAwait(() => true);

			const result = tween.advance(duration);

			expect(result).to.equal(0);
		});
	});

	testDurations.forEach(duration => {
		it(`Should return zero when calling advance on already finished tween (duration=${duration})`, () => {
			const tween = new TweenAwait(() => true);
			tween.finish();

			const result = tween.advance(duration);

			expect(result).to.equal(0);
		});
	});

	it("Should stay unfinished when await callback returns false", () => {
		const tween = new TweenAwait(() => false);
		tween.advance(1);

		expect(tween.isFinished).to.be.false;
	});

	it("Should become finished when await callback returns true", () => {
		const tween = new TweenAwait(() => true);
		tween.advance(1);

		expect(tween.isFinished).to.be.true;
	});

	it("Should not call await callback when already finished", () => {
		let awaitCallCount = 0;
		const tween = new TweenAwait(() => {
			awaitCallCount++;
			return true;
		});

		tween.advance(1);
		tween.advance(1);
		tween.advance(1);
		tween.advance(1);

		expect(awaitCallCount).to.equal(1);
	});

	it("Should become finished and not call await callback on .finish()", () => {
		let awaitCallCount = 0;
		const tween = new TweenAwait(() => {
			awaitCallCount++;
			return true;
		});

		tween.finish();

		expect(awaitCallCount).to.equal(0);
		expect(tween.isFinished).to.be.true;
	});

	it("Should become finished and not call await callback on .skip()", () => {
		let awaitCallCount = 0;
		const tween = new TweenAwait(() => {
			awaitCallCount++;
			return true;
		});

		tween.skip();

		expect(awaitCallCount).to.equal(0);
		expect(tween.isFinished).to.be.true;
	});
});

