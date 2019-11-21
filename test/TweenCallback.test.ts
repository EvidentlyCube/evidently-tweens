import 'mocha';
import {expect} from 'chai';
import {TweenCallback} from "../src";

const testDurations = [0, 1, 100, 1024*1024*1024];

describe('TweenCallback', () => {
	it("Should start unfinished", () => {
		const tween = new TweenCallback(() => {});

		expect(tween.isFinished).to.be.false;
	});

	it("Should call the callback on advance", () => {
		let calls = 0;
		const tween = new TweenCallback(() => calls++);

		tween.advance(1);
		expect(tween.isFinished).to.be.true;
		expect(calls).to.equal(1);
	});

	it("Should call the callback on finish", () => {
		let calls = 0;
		const tween = new TweenCallback(() => calls++);

		tween.finish();
		expect(tween.isFinished).to.be.true;
		expect(calls).to.equal(1);
	});

	it("Should call the callback on advance only when not yet finished", () => {
		let calls = 0;
		const tween = new TweenCallback(() => calls++);

		tween.advance(1);
		tween.advance(1);
		tween.advance(1);
		tween.advance(1);

		expect(tween.isFinished).to.be.true;
		expect(calls).to.equal(1);
	});

	it("Should call the callback on .finish() only when not yet finished", () => {
		let calls = 0;
		const tween = new TweenCallback(() => calls++);

		tween.finish();
		tween.finish();
		tween.finish();
		tween.finish();

		expect(tween.isFinished).to.be.true;
		expect(calls).to.equal(1);
	});

	it("Should not call the callback on skip", () => {
		let calls = 0;
		const tween = new TweenCallback(() => calls++);

		tween.skip();

		expect(tween.isFinished).to.be.true;
		expect(calls).to.equal(0);
	});

	testDurations.forEach(duration => {
		it("Should always return 0 on advance regardless on duration", () => {
			const tween = new TweenCallback(() => {});
			const usedTime = tween.advance(duration);

			expect(usedTime).to.equal(0);
		});
	});

	testDurations.forEach(duration => {
		it("Should always return 0 on advance when tween already finished", () => {
			const tween = new TweenCallback(() => {});
			tween.finish();

			const usedTime = tween.advance(duration);
			expect(usedTime).to.equal(0);
		});
	});
});

