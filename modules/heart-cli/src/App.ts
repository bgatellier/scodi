import {
  isModuleListener,
  AnalysisEvents,
  ModuleAnalysisInterface,
  ModuleInterface,
  ModuleListenerInterface,
  ModuleServerInterface,
  Report,
} from '@fabernovel/heart-core';
import * as EventEmitter from 'events';

export default class App {
  private eventEmitter: EventEmitter;
  private modules: ModuleInterface[];

  constructor(modules: ModuleInterface[]) {
    this.eventEmitter = new EventEmitter();
    this.modules = modules;
    this.registerEventsListeners();
  }

  public startAnalysis(module: ModuleAnalysisInterface, conf: object): void {
    module.startAnalysis(conf)
      .catch (error => {
        console.error(error);
        process.exit(1);
      })
      .then((report: Report) => {
        // print analyse result
        const reportName = report.service ? `[${report.service.name}] ` : '';
        console.log(`${reportName}${report.analyzedUrl}: ${report.note}, view full report: ${report.resultUrl}`);

        this.eventEmitter.emit(AnalysisEvents.DONE, report);

        // /!\ do not exit the node process at this point,
        //     because it could stop the execution of the event handlers
      });
  }

  public startServer(module: ModuleServerInterface, modules: ModuleInterface[], port: number): void {
    module
      .startServer(modules, port)
      .on('listening', () => console.log(`Server listening on port ${port}`))
      .on('error', (error: NodeJS.ErrnoException) => {
        console.error(error.message);
        process.exit(1);
      });
  }

  /**
   * Register events listeners for listening modules
   */
  private registerEventsListeners(): void {
    this.modules
      .filter((module: ModuleInterface) => isModuleListener(module))
      .forEach((module: ModuleListenerInterface) => module.registerEvents(this.eventEmitter));
  }
}
