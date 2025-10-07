import type {
	GeneralProperties,
	KPIProperties,
} from "greenit-analysis-cli/src/cli-core/analysis.js";
import type { Result } from "../Result.js";

export type GreenITResult = Result & GeneralProperties & KPIProperties;
