import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        coverage: {
            provider: 'v8',
            reporter: ['lcov'],
            exclude: [
                'coverage/**',
                'lib/**',
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
            // moon handle this coverage results cleaning,
            // as we have to deal with its caching system (which vitest is not aware of).
            clean: false
        },
        passWithNoTests: true,
        environment: 'node',
    },
})