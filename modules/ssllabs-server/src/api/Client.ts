import {
  Request,
  type SsllabsServerConfig,
  SsllabsServerReport,
  SsllabsServerStatus,
} from "@fabernovel/heart-common"
import { stringify } from "querystring"
import { isSsllabsServerError, type SsllabsServerError } from "./Error.js"

export class Client {
  private readonly API_URL = "https://api.ssllabs.com/api/v3"
  private readonly SERVICE_URL = "https://www.ssllabs.com/ssltest/analyze.html?d="
  private conf: SsllabsServerConfig = { host: "" }

  public async launchAnalysis(conf: SsllabsServerConfig): Promise<SsllabsServerReport["result"]> {
    this.conf = conf

    return this.requestApi()
  }

  public getProjectUrl(): string {
    return this.conf.host
  }

  public getAnalyzeUrl(): string {
    return this.SERVICE_URL + this.getProjectUrl()
  }

  public async getResult(): Promise<SsllabsServerReport["result"]> {
    // avoid starting a new analysis instead of requesting the results
    if ("string" === typeof this.conf.startNew) {
      delete this.conf.startNew
    }

    return this.requestApi()
  }

  private generateApiUrl(path: string): string {
    const query = stringify({
      host: this.conf.host,
      publish: this.conf.publish,
      startNew: this.conf.startNew,
      fromCache: this.conf.fromCache,
      maxAge: this.conf.maxAge,
      all: this.conf.all,
      ignoreMismatch: this.conf.ignoreMismatch,
    })

    return `${this.API_URL}${path}?${query}`
  }

  private async requestApi(): Promise<SsllabsServerReport["result"]> {
    const host = await Request.get<SsllabsServerReport["result"] | SsllabsServerError>(
      this.generateApiUrl("/analyze")
    )

    if (isSsllabsServerError(host)) {
      return Promise.reject({
        error: host.errors,
      })
    }

    if (host.status === SsllabsServerStatus.ERROR) {
      return Promise.reject({
        error: "error",
        message: host.statusMessage,
      })
    }

    return host
  }
}
