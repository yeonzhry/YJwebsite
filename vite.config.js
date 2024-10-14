import { defineConfig } from 'vite';
import restart from 'vite-plugin-restart';
import path from 'path';

export default defineConfig({
    root: path.resolve(__dirname, 'src'), // Source files (where index.html is located)
    publicDir: path.resolve(__dirname, 'static'), // Static assets
    server: {
        host: true, // Open to local network
        open: !('SANDBOX_URL' in process.env || 'CODESANDBOX_HOST' in process.env) // Open browser if not in sandbox
    },
    build: {
        outDir: path.resolve(__dirname, 'dist'), // Output directory
        emptyOutDir: true, // Clean the output directory before building
        sourcemap: true, // Generate source maps
        rollupOptions: {
            input: {
                main: path.resolve(__dirname, 'src/index.html'),
                grid: path.resolve(__dirname, 'src/grid/index.html'),
                audio: path.resolve(__dirname, 'src/audio/index.html'),
                model: path.resolve(__dirname, 'src/model/index.html'),
                synth: path.resolve(__dirname, 'src/synth/index.html'),
                video: path.resolve(__dirname, 'src/video/index.html'),
                about: path.resolve(__dirname, 'src/about/index.html'),
                final: path.resolve(__dirname, 'src/final/index.html'),
            }
        }
    },
    plugins: [
        restart({ restart: ['static/**'] }) // Restart server on static file changes
    ],
});