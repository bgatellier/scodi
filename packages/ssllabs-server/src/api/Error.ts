/**
 * @see [Documentation]{@link https://github.com/ssllabs/ssllabs-scan/blob/master/ssllabs-api-docs-v3.md#error-reporting}
 */
export interface SsllabsServerApiError {
	errors: {
		field: string;
		message: string;
	}[];
}

export const isSsllabsServerApiError = (
	object: unknown,
): object is SsllabsServerApiError =>
	Array.isArray((object as SsllabsServerApiError).errors);
