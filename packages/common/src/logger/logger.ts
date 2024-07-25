import { type Logger, pino } from "pino";

export const logger: Logger = pino({
	level: "info",
	transport: {
		target: "pino-pretty",
		options: {
			colorize: true,
		},
	},
});
