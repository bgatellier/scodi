import type { GeneralProperties, KPIProperties } from "greenit-analysis-cli";
import type { Result } from "../Result.js";

export type GreenITResult = Result & GeneralProperties & KPIProperties;
