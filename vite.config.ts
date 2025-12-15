import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), ''); // تم تصحيح مكان قراءة المسار ليكون أكثر أماناً
    return {
      // هذا السطر هو الحل لمشكلة الشاشة البيضاء 👇
      base: '/lecteur-text-pro/', 
      
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        // تنبيه: تأكد من وجود المتغيرات في GitHub Secrets وإلا ستكون فارغة
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
