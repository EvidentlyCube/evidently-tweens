import {Tween} from "./Tween";
import {VoidCallback} from './common'

/**
 * Runs multiple tweens in sequence, one-by-one, in the order they were added.
 */
export class TweenSequence implements Tween
{
	private readonly _finishedCallback: VoidCallback | undefined;
	private readonly _tweens: Tween[];

	public get isFinished(): boolean
	{
		return this._tweens.length === 0;
	}

	/**
	 * Tweens remaining
	 */
	public get tweens(): Readonly<Tween[]>
	{
		return this._tweens;
	}

	/**
	 * Number of tweens remaining
	 */
	public get tweenCount(): number
	{
		return this._tweens.length;
	}

	/**
	 * @param {VoidCallback|undefined} finishedCallback
	 * @param tweens
	 */
	public constructor(finishedCallback: VoidCallback = undefined, ...tweens: Tween[])
	{
		this._finishedCallback = finishedCallback;
		this._tweens = [];

		tweens.forEach(tween => this.add(tween));
	}

	/**
	 * Adds a tween to the sequence. The same tween can't be added twice.
	 * @param {Tween} tween Tween to add.
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

	/**
	 * Advances the first tween in the list. If it finishes and any `duration` is left then the next one is called with the remaining `duration`, untill
	 * all of the tweens finish or all the `duration` is used up. Finished tweens are removed from the list.
	 * @param {number} durationToAdvance
	 * @return Duration left after executing the tweens.
	 */
	public advance(durationToAdvance: number): number
	{
		while (durationToAdvance > 0 && this._tweens.length > 0)
		{
			const tween = this._tweens[0];

			durationToAdvance -= tween.advance(durationToAdvance);

			if (tween.isFinished)
			{
				this._tweens.shift();

				if (this._tweens.length === 0 && this._finishedCallback)
				{
					this._finishedCallback();
				}
			}
		}

		return durationToAdvance;
	}

	/**
	 * Calls `finish()` on all the tweens, then calls the finish callback if there were any tweens in the first place
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
	 * Calls `finish` on the next tween in the list, and if it was the last one then calls the finish callback. Does nothing if there are no tweens.
	 */
	public finishOne(): void
	{
		const tween = this._tweens.shift();
		if (tween)
		{
			tween.finish();

			if (this._tweens.length === 0 && this._finishedCallback)
			{
				this._finishedCallback();
			}
		}
	}

	/**
	 * Calls `skip()` on all the tweens and does not call the finish callback.
	 */
	public skip(): void
	{
		this._tweens.forEach(tween => tween.skip());

		this._tweens.length = 0;
	}

	/**
	 * Calls `skip()` on the next tween and removes it and will call the finish callback depending on the argument passed.
	 * @param {boolean} callFinishCallback Whether to call the finish callback if it's the last tween that is skipped.
	 */
	public skipOne(callFinishCallback = true): void
	{
		const tween = this._tweens.shift();
		if (tween)
		{
			tween.skip();

			if (callFinishCallback && this._tweens.length === 0 && this._finishedCallback)
			{
				this._finishedCallback();
			}
		}
	}
}