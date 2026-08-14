import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    // Path aset dibuat relatif agar website tetap jalan walau dipasang
    // di subfolder (mis. https://domain.com/toko/), bukan hanya di root domain.
    base: './',
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      // Sebelumnya seluruh aplikasi menumpuk di satu berkas ~940 kB.
      // Library besar dipisah agar cache browser lebih efektif dan
      // halaman pembeli tidak perlu menunggu kode Firebase/Panel Admin.
      rollupOptions: {
        output: {
          manualChunks: {
            react: ['react', 'react-dom'],
            firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore'],
            icons: ['lucide-react'],
          },
        },
      },
      chunkSizeWarningLimit: 700,
    },
    server: {
      host: '0.0.0.0',
      port: 3000,
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
