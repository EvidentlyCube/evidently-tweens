import {Tween} from "./Tween";
import {VoidCallback} from './common'

/**
 * Runs multiple tweens at the same time. The tweens are advanced in the order they were added.
 */
export class TweenParallel implements Tween
{
	private readonly _finishedCallback: VoidCallback | undefined;
	private _tweens: Tween[];

	/**
	 * Number of remaining tweens.
	 */
	public get tweenCount(): number
	{
		return this._tweens.length;
	}

	/**
	 * The remaining tweens
	 */
	public get tweens(): Readonly<Tween[]>
	{
		return this._tweens;
	}

	public get isFinished(): boolean
	{
		return this._tweens.length === 0;
	}

	/**
	 * @param {VoidCallback|undefined} finishedCallback
	 * @param {Tween[]} tweens The tweens to add.
	 */
	constructor(finishedCallback: VoidCallback | undefined = undefined, ...tweens: Tween[])
	{
		this._finishedCallback = finishedCallback;
		this._tweens = [];

		tweens.forEach(tween => this.add(tween));
	}

	/**
	 * Calls `advance()` on all the tweens in the order they were added. Finished tweens are removed from the list.
	 * @param {number} durationToAdvance
	 * @return {number} Returns the largest duration consumed from the added tweens.
	 */
	public advance(durationToAdvance: number): number
	{
		let maxTimeUsed = 0;

		this._tweens.forEach((tween: Tween) =>
		{
			const timeUsed = tween.advance(durationToAdvance);
			maxTimeUsed = Math.max(maxTimeUsed, timeUsed);
		});

		if (this._tweens.length > 0)
		{
			this._tweens = this._tweens.filter(tween => !tween.isFinished);

			if (this._tweens.length === 0 && this._finishedCallback)
			{
				this._finishedCallback();
			}
		}

		return maxTimeUsed;
	}

	/**
	 * Calls `finish()` on every tween added and removes them, then calling the finished callback if there were any tweens in the first place.
	 */
	public finish(): void
	{
		if (this._tweens.length > 0) {
			this._tweens.forEach(tween => tween.finish());
			this._tweens.length = 0;

			this._finishedCallback && this._finishedCallback();
		}
	}

	/**
	 * Calls `skip()` on ever tween added and removes them.
	 */
	public skip(): void
	{
		this._tweens.forEach(tween => tween.skip());

		this._tweens.length = 0;
	}

	/**
	 * Adds the specified tween to be run. The same tween can't be added twice.
	 * @param {Tween} tween Tween to add to run in parallel.
	 */
	public add(tween: Tween): void
	{
		if (this._tweens.indexOf(tween) !== -1)
		{
			throw new Error('Adding a tween to a sequence when the tween already exists in this sequence.');
		}

		if (!tween)
		{
			throw new Error('Cannot add undefined tween.');
		}

		this._tweens.push(tween);
	}
}