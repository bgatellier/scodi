import { GenericReport, ReportArguments, ServiceInterface } from '@fabernovel/heart-core';

import Host from './Host';

type SsllabsServerReportType = Host;

export default class SsllabsServerReport implements GenericReport<SsllabsServerReportType> {
  analyzedUrl: string;
  date: Date;
  resultUrl?: string;
  service: ServiceInterface;
  value: SsllabsServerReportType;

  constructor(report: ReportArguments<SsllabsServerReportType>) {
    Object.assign(this, report);
  }

  get note() {
    return this.getNote();
  }

  get normalizedNote() {
    return this.getNormalizedNote();
  }

  getNote() {
    return this.getNormalizedNote.toString();
  }

  getNormalizedNote() {
    return this.value.getAveragePercentage();
  }
}
