import type { Result } from "lighthouse";
import { logger, type ValidatedAnalysisInput } from "../../index.js";
import type { Service } from "../../service/Service.js";
import type { GenericReport, ReportArguments } from "../Report.js";
import type { LighthouseResult } from "./LighthouseResult.js";

const compute = (
	categories: Record<string, Result.Category>,
	fractionDigits?: number,
): number => {
	const avgScore = computeCategories(categories);

	return normalize(avgScore, fractionDigits);
};

/**
 * Calculate the average score for every categories
 * @param categories LH report categories
 *
 * @returns Average score (between 0 and 1) accross all category
 */
function computeCategories(
	categories: Record<string, Result.Category>,
): number {
	const categoriesName = Object.keys(categories);
	const categoriesNameWithScore = categoriesName.filter(
		(categoryName) => null !== categories[categoryName].score,
	);

	if (categoriesName.length > categoriesNameWithScore.length) {
		logger.warn(
			"Some Lighthouse categories does not have a score. Consequently, they will not be taken into account for the computation of the average score.",
		);
	}

	const sumScores = categoriesNameWithScore.reduce(
		(acc, categoryName) => acc + (categories[categoryName].score ?? 0),
		0,
	);

	return sumScores / categoriesName.length;
}

/**
 *
 * @param avgScore Score between 0 and 1
 */
function normalize(avgScore: number, fractionDigits?: number): number {
	return Number.parseFloat((100 * avgScore).toFixed(fractionDigits));
}

export class LighthouseReport implements GenericReport<LighthouseResult> {
	readonly #analyzedUrl: string;
	readonly #date: Date;
	readonly #grade: string;
	readonly #normalizedGrade: number;
	readonly #result: LighthouseResult;
	readonly #resultUrl: string | undefined;
	readonly #service: Service;
	readonly #inputs: Pick<ValidatedAnalysisInput, "config" | "threshold">;

	constructor({
		analyzedUrl,
		date,
		result,
		resultUrl,
		service,
		inputs,
	}: ReportArguments<LighthouseResult>) {
		this.#analyzedUrl = analyzedUrl;
		this.#date = date;
		this.#result = result;
		this.#resultUrl = resultUrl;
		this.#service = service;
		this.#inputs = inputs;

		this.#normalizedGrade = compute(this.#result.categories);
		this.#grade = this.#normalizedGrade.toString();
	}

	get analyzedUrl(): string {
		return this.#analyzedUrl;
	}

	get date(): Date {
		return this.#date;
	}

	get grade(): string {
		return this.#grade;
	}

	get normalizedGrade(): number {
		return this.#normalizedGrade;
	}

	get result(): LighthouseResult {
		return this.#result;
	}

	get resultUrl(): string | undefined {
		return this.#resultUrl;
	}

	get service(): Service {
		return this.#service;
	}

	get inputs(): Pick<ValidatedAnalysisInput, "config" | "threshold"> {
		return this.#inputs;
	}

	displayGrade(): string {
		return this.normalizedGrade.toString() === this.grade
			? `${this.grade}/100`
			: `${this.grade} (${this.normalizedGrade}/100)`;
	}

	isThresholdReached(): boolean | undefined {
		return this.inputs.threshold !== undefined
			? this.normalizedGrade >= this.inputs.threshold
			: undefined;
	}
}
