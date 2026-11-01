import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');

  // Support VITE_ELEVENLABS_API_KEY, ELEVENLABS_API_KEY, or ELEVEN_LABS_API_KEY on Render / CI
  const elevenApiKey = (
    env.VITE_ELEVENLABS_API_KEY ||
    env.ELEVENLABS_API_KEY ||
    env.ELEVEN_LABS_API_KEY ||
    env.VITE_ELEVEN_LABS_API_KEY ||
    process.env.VITE_ELEVENLABS_API_KEY ||
    process.env.ELEVENLABS_API_KEY ||
    process.env.ELEVEN_LABS_API_KEY ||
    ''
  ).replace(/^["']|["']$/g, '').trim();

  return {
    plugins: [react()],
    base: './', // Relative base path allows deployment without path breaking
    define: {
      'import.meta.env.VITE_ELEVENLABS_API_KEY': JSON.stringify(elevenApiKey)
    },
    server: {
      port: 3000,
      open: false,
    },
  };
});
