/**
 * The interface which all of the tweens implement
 */
export interface Tween
{
	/**
	 * Whether the tween has finished
	 */
	readonly isFinished: boolean;

	/**
	 * Advances the tween by the given amount of unitless duration.
	 *
	 * @param durationToAdvance
	 * @returns {number} The amount of duration consumed by this tween which will always be between 0 (no duration consumed) and
	 * `durationToAdvance` (consumed all the duration)
	 */
	advance(durationToAdvance: number): number;

	/**
	 * Stops the execution of the tween early triggering all possible effects along the way.
	 * Please note it's not the same as calling `advance()` with some large number, because a tween may have external conditions that do not
	 * depend on the duration, eg. waiting for a user interaction or external event. `finish()` will just finish those tweens as if the conditions
	 * were met.
	 */
	finish(): void;

	/**
	 * Stops the execution of the tween early and prevents any possible effect that would have happened if `finish()` was called.
	 */
	skip(): void;
}