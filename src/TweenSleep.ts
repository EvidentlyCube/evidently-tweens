import {Tween} from "./Tween";
import {VoidCallback} from './common'

/**
 * Tween that does nothing for specific `duration` and optionally calls a finished callback at the end,
 */
export class TweenSleep implements Tween
{
	private readonly _finishedCallback: VoidCallback | undefined;
	private readonly _duration: number;
	private _timeSpent: number;

	public get isFinished(): boolean
	{
		return this._timeSpent >= this._duration;
	}

	public get duration(): number
	{
		return this._duration;
	}

	/**
	 * Duration remaining for this tween to run
	 */
	public get remainingDuration(): number
	{
		return this._duration - this._timeSpent;
	}

	/**
	 * @param {number} duration Must be
	 * @param {VoidCallback|undefined} finishedCallback A function to call once the tween finishes. Please be mindful of proper `this` binding when passing
	 * methods of a class.
	 */
	public constructor(duration: number, finishedCallback: VoidCallback | undefined = undefined)
	{
		if (duration < 0)
		{
			throw new Error(`Duration has to be a positive number, ${duration} given`);
		}

		this._duration = duration;
		this._timeSpent = 0;
		this._finishedCallback = finishedCallback;
	}

	/**
	 * Spends the given `duration` on this tween.
	 *
	 * @param {number} durationToAdvance Duration to spend on this tween.
	 * @return {number} Returns the duration consumed by this tween.
	 */
	public advance(durationToAdvance: number): number
	{
		if (this.isFinished)
		{
			return 0;
		}

		if (durationToAdvance > this.remainingDuration)
		{
			durationToAdvance = this.remainingDuration;
		}

		this._timeSpent += durationToAdvance;

		if (this.isFinished && this._finishedCallback) {
			this._finishedCallback();
		}

		return durationToAdvance;
	}

	/**
	 * Instantly finishes the tween, calling the finished callback if it was provided.
	 */
	public finish(): void
	{
		this.advance(this.remainingDuration);
	}

	/**
	 * Instantly finishes the tween and does not call the finished callback.
	 */
	public skip(): void
	{
		this._timeSpent = this._duration;
	}
}