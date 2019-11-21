import {Tween} from "./Tween";

/**
 * Calls the specific function and depending on the result it'll either finish or consume all duration
 */
export class TweenAwait implements Tween
{
	private readonly _awaitCallback: () => boolean;
	private _isFinished: boolean;

	public get isFinished(): boolean
	{
		return this._isFinished;
	}

	/**
	 * @param {() => boolean} awaitFunction Function to call to check if the tween should finish. If it returns `true` the tween will be finished and will take 0 duration,
	 * otherwise it'll take all the duration.
	 */
	constructor(awaitFunction: () => boolean)
	{
		if (!awaitFunction) {
			throw new Error("Await function cannot be undefined.");
		}

		this._awaitCallback = awaitFunction;
		this._isFinished = false;
	}

	/**
	 * Calls the await function and depending on the result finishes the tween consuming 0 duration (`true`) or consumes all the duration (`false`)
	 * @param {number} durationToAdvance
	 * @return {number} either 0 or `durationToAdvance`
	 */
	public advance(durationToAdvance: number): number
	{
		if (this._isFinished || this._awaitCallback()) {
			this._isFinished = true;
			return 0;
		}

		return durationToAdvance;
	}

	/**
	 * Will mark the tween as finished and won't call the await callback, identical to `skip`
	 */
	public finish(): void
	{
		this._isFinished = true;
	}

	/**
	 * Will mark the tween as finished and won't call the await callback, identical to `finish`
	 */
	public skip(): void
	{
		this._isFinished = true;
	}
}