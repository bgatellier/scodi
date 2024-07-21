import type { ModuleIndex, ModuleMetadata } from "@scodi/common";
import { GreenITModule } from "./GreenITModule.js";

export const initialize: ModuleIndex["initialize"] = (
	moduleMetadata: ModuleMetadata,
	verbose: boolean,
) => {
	return new GreenITModule(moduleMetadata, verbose);
};
