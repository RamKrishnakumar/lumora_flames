import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    test: {
        environment: 'jsdom',   // window/document for React rendering
        globals: true,          // describe/it/expect without importing
        setupFiles: ['./src/test/setup.ts'],
        css: false,             // Tailwind adds seconds and asserts nothing
    },
})