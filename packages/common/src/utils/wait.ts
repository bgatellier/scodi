/**
 * Wait a given amount of time. Use setTimeout internally.
 *
 * @param duration Duration in milliseconds.
 */
export const wait = (duration: number): Promise<void> =>
	new Promise((resolve) =>
		setTimeout(() => {
			resolve();
		}, duration),
	);
