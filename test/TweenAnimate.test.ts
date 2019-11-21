import 'mocha';
import {expect} from 'chai';
import {TweenAnimate} from "../src";

const TestFrom = 100;
const TestTo = 200;
const TestDuration = 100;

const TestCases = [
	[0, 100, 100],
	[25, 125, 100 + 100 * 0.25 * 0.25],
	[50, 150, 100 + 100 * 0.50 * 0.50],
	[75, 175, 100 + 100 * 0.75 * 0.75],
	[100, 200, 200],
];

describe('TweenAnimateNumber', () =>
{
	TestCases.forEach(testCase =>
	{
		const [duration, expectedValue] = testCase;

		it(`Should return expected tweened value for duration=${duration}`, () =>
		{
			let updatedValue: number = Number.NaN;
			const tween = new TweenAnimate(TestDuration, TestFrom, TestTo, x => updatedValue = x);
			tween.advance(duration);

			expect(updatedValue).to.not.be.NaN;
			expect(updatedValue).to.be.closeTo(expectedValue, 0.001);
		});
	});
	TestCases.forEach(testCase =>
	{
		const [duration, , expectedValue] = testCase;

		it(`Should return expected tweened value with easing for duration=${duration}`, () =>
		{
			let updatedValue: number = Number.NaN;
			const tween = new TweenAnimate(TestDuration, TestFrom, TestTo, x => updatedValue = x, x => x * x);
			tween.advance(duration);

			expect(updatedValue).to.not.be.NaN;
			expect(updatedValue).to.be.closeTo(expectedValue, 0.001);
		});
	});
});

