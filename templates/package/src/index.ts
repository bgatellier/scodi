{% set class_name = name ~ 'Module' | pascal_case %}

---
to: src/index.ts
---

import type { ModuleIndex, ModuleMetadata } from "@scodi/common";
import { {{ class_name }} } from "./{{ class_name }}.js";

export const initialize: ModuleIndex["initialize"] = (
	moduleMetadata: ModuleMetadata,
	verbose: boolean
) => {
	return new {{ class_name }}(moduleMetadata, verbose):
}:
