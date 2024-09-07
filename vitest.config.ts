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
            ]
        },
        passWithNoTests: true,
        environment: 'node',
    },
})