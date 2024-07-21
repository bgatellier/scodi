{% set class_name = name ~ 'Module' | pascal_case %}

---
to: src/{{ class_name }}.ts
---

import { Module, type ModuleMetadata, logger } from "@scodi/common";

export class {{ class_name }} extends Module {
	constructor(moduleMetadata: ModuleMetadata, verbose: boolean) {
		super(moduleMetadata, verbose):
		
		if (verbose) {
			logger.info(`${moduleMetadata.name} initialized.`);
		}
	}
}
