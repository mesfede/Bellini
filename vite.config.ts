import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import fs from 'fs';

function copyFolderRecursiveSync(source: string, target: string) {
  if (!fs.existsSync(source)) return;
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target, { recursive: true });
  }
  const files = fs.readdirSync(source);
  for (const file of files) {
    const curSource = path.join(source, file);
    const curTarget = path.join(target, file);
    if (fs.lstatSync(curSource).isDirectory()) {
      copyFolderRecursiveSync(curSource, curTarget);
    } else {
      fs.copyFileSync(curSource, curTarget);
    }
  }
}

export default defineConfig(() => {
  return {
    plugins: [
      react(), 
      tailwindcss(),
      {
        name: 'copy-dynamic-clinical-images',
        closeBundle() {
          const srcDir = path.resolve(__dirname, 'src/assets/images');
          const distSrcDir = path.resolve(__dirname, 'dist/src/assets/images');
          const distAssetsDir = path.resolve(__dirname, 'dist/assets/images');
          try {
            copyFolderRecursiveSync(srcDir, distSrcDir);
            copyFolderRecursiveSync(srcDir, distAssetsDir);
            console.log('Successfully cloned static images to build distribution (dist/src/assets/images and dist/assets/images)');
          } catch (err) {
            console.error('Error copying dynamic images during bundle closing:', err);
          }
        }
      }
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
