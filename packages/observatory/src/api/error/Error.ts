export interface ScanError {
	error: unknown;
	message: string;
}

export const isScanError = (object: unknown): object is ScanError =>
	(object as ScanError).error !== null;
