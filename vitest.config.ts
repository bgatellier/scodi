import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        include: ['**/*.test.ts'],
        coverage: {
            provider: 'istanbul',
            reporter: ['lcov'],
            // this list is adapted from https://vitest.dev/config/#coverage-exclude
            exclude: [
                '**/coverage/**',
                '**/lib/**',
                '**/node_modules/**',
                '**/[.]**',
                'packages/*/tests/**',
                '**/*.d.ts',
                'templates/**',
                '**/*.test.ts',
                '**/__mocks__/**',
                'vitest.config.mts',
                'vitest.workspace.ts',
            ],
            clean: true
        },
        passWithNoTests: true,
        environment: 'node',
    },
})