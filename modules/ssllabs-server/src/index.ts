import type { ModuleIndex, ModuleMetadata } from "@scodi/common";
import { SsllabsServerModule } from "./SsllabsServerModule.js";

export const initialize: ModuleIndex["initialize"] = (
	moduleMetadata: ModuleMetadata,
	verbose: boolean,
) => {
	return new SsllabsServerModule(moduleMetadata, verbose);
};
