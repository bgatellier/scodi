import type { FastifyCorsOptions } from "@fastify/cors";
import type {
	Config,
	GenericReport,
	ModuleAnalysisInterface,
	ModuleListenerInterface,
	ModuleServerInterface,
	Result,
} from "@scodi/common";
import ora from "ora";

export async function notifyListenerModules<R extends GenericReport<Result>>(
	listenerModules: ModuleListenerInterface[],
	report: R,
): Promise<unknown[]> {
	const promises = listenerModules.map((listenerModule) =>
		listenerModule.notifyAnalysisDone(report),
	);

	return Promise.all(promises);
}

export async function startAnalysis<
	C extends Config,
	R extends GenericReport<Result>,
>(
	module: ModuleAnalysisInterface<C, R>,
	conf: C,
	threshold?: number,
): Promise<R> {
	const spinner = ora({ spinner: "hearts", interval: 200 });

	spinner.start("Analysis in progress...");

	try {
		const report = await module.startAnalysis(conf, threshold);

		const reportName = `[${report.service.name}] `;
		const messageParts = [
			`${reportName}${report.analyzedUrl}: ${report.displayGrade()}`,
		];

		if (report.resultUrl) {
			messageParts.push(`View full report: ${report.resultUrl}`);
		}

		if (report.isThresholdReached() === true) {
			messageParts.push("Your threshold is reached");
		} else if (report.isThresholdReached() === false) {
			messageParts.push("Your threshold is not reached");
		}

		spinner.succeed("Analysis completed.");
		console.info(`${messageParts.join(". ")}.`);

		return report;
	} catch (error) {
		let reason = "";

		if (typeof error === "string") {
			reason = error;
		} else if (error instanceof Error) {
			reason = error.message;
		}

		if (reason.length > 0) {
			reason = ` Reason: ${reason}.`;
		}

		spinner.fail(`Analysis failed.${reason}`);

		throw new Error(reason);
	}
}

export async function startServer(
	serverModule: ModuleServerInterface,
	analysisModules: ModuleAnalysisInterface<Config, GenericReport<Result>>[],
	listenerModules: ModuleListenerInterface[],
	port: number,
	cors?: FastifyCorsOptions,
): Promise<void> {
	const fastifyInstance = await serverModule.createServer(
		analysisModules,
		listenerModules,
		cors,
	);

	try {
		await fastifyInstance.listen({ port: port });
		console.info(`Server listening on port ${port}`);
	} catch (err) {
		fastifyInstance.log.error(err);
		throw err;
	}
}
