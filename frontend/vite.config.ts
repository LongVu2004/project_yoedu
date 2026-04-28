import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Thêm dòng này để expose ra mạng bên ngoài
    port: 5173,
    watch: {
      usePolling: true // (Optional) Giúp hot-reload hoạt động mượt hơn trên Docker Windows
    }
  }
})
