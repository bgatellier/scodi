import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        coverage: {
            provider: 'v8',
            reporter: ['lcov'],
            exclude: [
                'vitest.config.ts',
                'vitest.workspace.ts',
                'coverage/**',
                'packages/*/tests/**',
                'templates/**',
                '**/__mocks__/**',
                '**/lib/**',
                '**/node_modules/**',
                '**/[.]**',
                '**/*.d.ts',
                '**/*.test.ts',
            ],
            // moon handle this coverage results cleaning,
            // as we have to deal with its caching system (which vitest is not aware of).
            clean: false
        },
        passWithNoTests: true,
        environment: 'node',
    },
})