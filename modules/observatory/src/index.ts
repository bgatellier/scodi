import type { ModuleIndex, ModuleMetadata } from "@scodi/common";
import { ObservatoryModule } from "./ObservatoryModule.js";

export const initialize: ModuleIndex["initialize"] = (
	moduleMetadata: ModuleMetadata,
	verbose: boolean,
) => {
	return new ObservatoryModule(moduleMetadata, verbose);
};
