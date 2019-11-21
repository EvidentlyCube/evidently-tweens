import {Tween} from "./index";
import {VoidCallback, EasingCallback} from './common'

/**
 * Animates a number from one value to another, with optional tweening.
 */
export class TweenAnimate implements Tween {
	private readonly _from: number;
	private readonly _to: number;
	private readonly _updateCallback: (i: number) => void;
	private readonly _easingFunction: EasingCallback | undefined;

	private readonly _finishedCallback: VoidCallback | undefined;
	private readonly _duration: number;
	private _timeSpent: number;

	public get isFinished(): boolean {
		return this._timeSpent >= this._duration;
	}

	public get duration(): number {
		return this._duration;
	}

	/**
	 * Duration remaining for this tween to run
	 */
	public get remainingDuration(): number {
		return this._duration - this._timeSpent;
	}

	private get rawTimeFactor(): number {
		return (this.duration - this.remainingDuration) / this.duration;
	}

	private get timeFactor(): number {
		return this._easingFunction
			? this._easingFunction(this.rawTimeFactor)
			: this.rawTimeFactor;
	}

	/**
	 * @param {number} duration How long is the tween
	 * @param {number} from Starting value
	 * @param {number} to Final value
	 * @param {(i:number) => void}updateCallback Function to call on each `advance` with the new number vlaue
	 * @param {EasingCallback|undefined} easing Optional easing function
	 * @param {VoidCallback|undefined} finishedCallback Function to call when the tween finishes
	 */
	constructor(duration: number, from: number, to: number, updateCallback: (i: number) => void, easing: EasingCallback | undefined = undefined, finishedCallback: VoidCallback | undefined = undefined) {
		if (duration < 0) {
			throw new Error(`Duration has to be a positive number, ${duration} given`);
		}

		this._duration = duration;
		this._timeSpent = 0;
		this._finishedCallback = finishedCallback;

		this._from = from;
		this._to = to;
		this._updateCallback = updateCallback;
		this._easingFunction = easing;

	}

	/**
	 * Advances the tween by the given duration and calls the update callback with the new value for the number.
	 *
	 * @param {number} durationToAdvance Duration to spend on this tween.
	 * @return {number} Returns the duration consumed by this tween.
	 */
	public advance(durationToAdvance: number): number {
		if (this.isFinished) {
			return 0;
		}

		if (durationToAdvance > this.remainingDuration) {
			durationToAdvance = this.remainingDuration;
		}

		this._timeSpent += durationToAdvance;

		this._updateCallback(this._from + (this._to - this._from) * this.timeFactor);

		if (this.isFinished && this._finishedCallback) {
			this._finishedCallback();
		}

		return durationToAdvance;
	}

	/**
	 * Instantly finishes the tween, calling the update callback with the final value and calling the finished callback if it was provided, identical to
	 * calling `advance()` with `remainingDuration`
	 */
	public finish(): void {
		this.advance(this.remainingDuration);
	}

	/**
	 * Instantly finishes the tween and does not call the update callback nor the finished callback.
	 */
	public skip(): void {
		this._timeSpent = this._duration;
	}
}