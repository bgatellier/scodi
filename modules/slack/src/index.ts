import type { ModuleIndex, ModuleMetadata } from "@scodi/common";
import { SlackModule } from "./SlackModule.js";

export const initialize: ModuleIndex["initialize"] = (
	moduleMetadata: ModuleMetadata,
	verbose: boolean,
) => {
	return new SlackModule(moduleMetadata, verbose);
};
