import { get, post } from "./http/Request.js";

import { wait } from "./utils/wait.js";

const Helper = {
	wait,
};

const Request = {
	get: get,
	post: post,
};

export { ReportEntity } from "./entities/ReportEntity.js";
export { ServiceEntity } from "./entities/ServiceEntity.js";
export { InputError } from "./error/InputError.js";
export type {
	ParsedAnalysisInput,
	ValidatedAnalysisInput,
} from "./input/AnalysisInput.js";
export type { ParsedServerInput } from "./input/ServerInput.js";
export { logger } from "./logger/logger.js";
export {
	isModuleAnalysis,
	type ModuleAnalysisInterface,
} from "./module/analysis/ModuleAnalysisInterface.js";
export type { Config } from "./module/config/Config.js";
export type { GreenITConfig } from "./module/config/greenit/GreeenITConfig.js";
export type { LighthouseConfig } from "./module/config/lighthouse/LighthouseConfig.js";
export type { ObservatoryConfig } from "./module/config/observatory/ObservatoryConfig.js";
export type { SsllabsServerConfig } from "./module/config/ssllabs-server/SsllabsServerConfig.js";
export { createDatabaseConfig } from "./module/listener/ModuleListenerDatabaseConfig.js";
export {
	isModuleListenerDatabase,
	type ModuleListenerDatabaseInterface,
} from "./module/listener/ModuleListenerDatabaseInterface.js";
export {
	isModuleListener,
	type ModuleListenerInterface,
} from "./module/listener/ModuleListenerInterface.js";
export { Module } from "./module/Module.js";
export type { ModuleIndex } from "./module/ModuleIndex.js";
export type { ModuleMetadata } from "./module/ModuleMetadata.js";
export {
	isModuleServer,
	type ModuleServerInterface,
} from "./module/server/ModuleServerInterface.js";
export { GreenITReport } from "./report/greenit/GreenITReport.js";
export { LighthouseReport } from "./report/lighthouse/LighthouseReport.js";
export type { ObservatoryScanGrade } from "./report/observatory/enum/ObservatoryScanGrade.js";
export { ObservatoryReport } from "./report/observatory/ObservatoryReport.js";
export type { GenericReport } from "./report/Report.js";
export type { Result } from "./report/Result.js";
export { SsllabsServerStatus } from "./report/ssllabs-server/enum/SsllabsServerStatus.js";
export { SsllabsServerReport } from "./report/ssllabs-server/SsllabsServerReport.js";
export { getPuppeteerBrowserExecutablePath } from "./utils/puppeteer.js";
export {
	getAnalysisValidationSchema,
	validateAnalysisInput,
} from "./validation/input/analysis/AnalysisInputValidation.js";
export { validateServerInput } from "./validation/input/server/ServerInputValidation.js";
export { Helper, Request };
