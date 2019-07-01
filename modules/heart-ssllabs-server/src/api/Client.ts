import { Request } from '@fabernovel/heart-core';
import { stringify } from 'querystring';

import AnalyzeParameters from './model/parameters/AnalyzeParameters';
import Host from './model/Host';

export default class Client {
  private readonly API_URL = 'https://api.ssllabs.com/api/v3';
  private readonly SERVICE_URL = 'https://www.ssllabs.com/ssltest/analyze.html?d=';
  private conf: AnalyzeParameters;

  public async launchAnalysis(conf: AnalyzeParameters): Promise<Host> {
    this.conf = conf;

    return this.requestApi();
  }

  public getProjectUrl(): string {
    return this.conf.host;
  }

  public getAnalyzeUrl(): string {
    return this.SERVICE_URL + this.getProjectUrl();
  }

  public async getAnalysisReport(): Promise<Host> {
    // avoid starting a new analysis instead of requesting the results
    if ('string' === typeof this.conf.startNew) {
      delete this.conf.startNew;
    }

    return this.requestApi();
  }

  private generateApiUrl(path: string): string {
    return `${this.API_URL}${path}?${stringify(this.conf)}`;
  }

  private async requestApi(): Promise<Host> {
    const host = await Request.get(this.generateApiUrl('/analyze'));

    return new Host(host);
  }
}