import type { ValidatedAnalysisInput } from "../index.js";
import type { Service } from "../service/Service.js";

/**
 * Define an analysis report that is shared between every Scodi module.
 */
interface ReportBase {
	/**
	 * URL that is analyzed
	 */
	analyzedUrl: string;

	/**
	 * Date of the analyze.
	 * Could be different from the moment when the analysis is done, because some services have a cache system.
	 */
	date: Date;

	/**
	 * URL where the analysis results are accessible
	 */
	resultUrl?: string;

	/**
	 * Details about the service that process the analysis
	 * Optional because some Scodi modules do not sollicitate a third-party service (Scodi API for example)
	 */
	service: Service;

	inputs: Pick<ValidatedAnalysisInput, "config" | "threshold">;
}

interface ValueHolder<A> {
	/**
	 * Report value
	 */
	result: A;
}

export default interface Report extends ReportBase {
	/**
	 * Grade given by the service (often a letter)
	 */
	get grade(): string;

	/**
	 * Normalized grade: a number equivalent to the grade
	 */
	get normalizedGrade(): number;

	displayGrade(): string;

	isThresholdReached(): boolean | undefined;
}

export interface ReportArguments<A> extends ReportBase, ValueHolder<A> {}

/**
 * Define an analysis report that is shared between every Scodi module.
 *
 * /!\ WARNING /!\
 * Be very careful if you change the Report class structure, as it could have an impact on every Scodi module.
 */
export interface GenericReport<A> extends Report, ValueHolder<A> {}
