export class LighthouseError extends Error {
	constructor(message?: string, options?: ErrorOptions) {
		super(message, options);

		// @see {@link https://github.com/Microsoft/TypeScript-wiki/blob/main/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work}
		Object.setPrototypeOf(this, LighthouseError.prototype);
	}
}
