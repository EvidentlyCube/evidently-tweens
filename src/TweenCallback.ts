import {Tween} from "./Tween";
import {VoidCallback} from './common'

/**
 * Calls the specified function and takes 0 time.
 */
export class TweenCallback implements Tween
{
	private readonly _callback: VoidCallback;
	private _isFinished: boolean;

	public get isFinished(): boolean
	{
		return this._isFinished;
	}

	/**
	 * @param {VoidCallback} callback Function to call when this tween is advanced
	 */
	constructor(callback: VoidCallback)
	{
		this._callback = callback;
		this._isFinished = false;
	}

	/**
	 * Will call the callback given in the constructor.
	 * @param {number} durationToAdvance Ignored, left in for compatibility with the interface
	 * @return {number} always returns 0
	 */
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public advance(durationToAdvance: number): number
	{
		if (!this._isFinished) {
			this._callback();
			this._isFinished = true;
		}

		return 0;
	}

	/**
	 * Will call the callback given in the constructor and mark this tween as finished.
	 */
	public finish(): void
	{
		this.advance(0);
	}

	/**
	 * Will not call the callback and will mark the tween as finished.
	 */
	public skip(): void
	{
		this._isFinished = true;
	}
}