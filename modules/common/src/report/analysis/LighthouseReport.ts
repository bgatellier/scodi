import { Result } from "lighthouse"
import { LighthouseResult } from "../../index.js"
import { Service } from "../../service/Service.js"
import { GenericReport, ReportArguments } from "../Report.js"

const compute = (categories: Record<string, Result.Category>, fractionDigits?: number): number => {
  const avgScore = computeCategories(categories)

  return normalize(avgScore, fractionDigits)
}

/**
 * Calculate the average score for every categories
 * @param categories LH report categories
 *
 * @returns Average score (between 0 and 1) accross all category
 */
function computeCategories(categories: Record<string, Result.Category>): number {
  const categoriesName = Object.keys(categories)
  const categoriesNameWithScore = categoriesName.filter(
    (categoryName) => null !== categories[categoryName].score
  )

  if (categoriesName.length > categoriesNameWithScore.length) {
    console.warn(
      `Some Lighthouse categories does not have a score. Consequently, they will not be taken into account for the computation of the average score.`
    )
  }

  const sumScores = categoriesNameWithScore.reduce(
    (acc, categoryName) => acc + (categories[categoryName].score as number),
    0
  )

  return sumScores / categoriesName.length
}

/**
 *
 * @param avgScore Score between 0 and 1
 */
function normalize(avgScore: number, fractionDigits?: number): number {
  return parseFloat((100 * avgScore).toFixed(fractionDigits))
}

export class LighthouseReport implements GenericReport<LighthouseResult> {
  #analyzedUrl: string
  #date: Date
  #grade: string
  #normalizedGrade: number
  #result: LighthouseResult
  #resultUrl: string | undefined
  #service: Service
  #threshold: number | undefined

  constructor({ analyzedUrl, date, result, service, resultUrl }: ReportArguments<LighthouseResult>) {
    this.#analyzedUrl = analyzedUrl
    this.#date = date
    this.#result = result
    this.#service = service
    this.#resultUrl = resultUrl

    this.#normalizedGrade = compute(this.#result.categories)
    this.#grade = this.#normalizedGrade.toString()
  }

  get analyzedUrl(): string {
    return this.#analyzedUrl
  }

  get date(): Date {
    return this.#date
  }

  get grade(): string {
    return this.#grade
  }

  get isThresholdReached(): boolean | undefined {
    return this.#threshold !== undefined ? this.normalizedGrade >= this.#threshold : undefined
  }

  get normalizedGrade(): number {
    return this.#normalizedGrade
  }

  get result(): LighthouseResult {
    return this.#result
  }

  get resultUrl(): string | undefined {
    return this.#resultUrl
  }

  get service(): Service {
    return this.#service
  }

  get threshold(): number | undefined {
    return this.#threshold
  }
}
