{% set class_name = name ~ 'Module' | pascal_case %}

---
to: src//{{ class_name }}.ts
---

import { Module, logger, type ModuleMetadata } from "@fabernovel/heart-common"

export class {{ class_name }} extends Module {
  constructor(moduleMetadata: ModuleMetadata, verbose: boolean) {
    super(moduleMetadata, verbose)

    if (verbose) {
      logger.info(`${moduleMetadata.name} initialized.`)
    }
  }
}
