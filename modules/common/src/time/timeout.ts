/**
 * This is Promise wrapper of the setTimeout() function.
 */
export const timeout = (delay: number): Promise<void> =>
	new Promise((resolve) =>
		setTimeout(() => {
			resolve();
		}, delay),
	);
