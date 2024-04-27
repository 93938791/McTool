import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { prismjsPlugin } from 'vite-plugin-prismjs'
import Components from "unplugin-vue-components/vite";
import { AntDesignVueResolver } from "unplugin-vue-components/resolvers";
import { fileURLToPath, URL } from "url";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  plugins: 
    [
      vue(),
      prismjsPlugin({
        languages: 'all', // 语言
        plugins: ['line-numbers','show-language','copy-to-clipboard','inline-color'],
        theme: 'okaidia',// 主题
        css: true,
      }),
      Components({
        resolvers: [AntDesignVueResolver({
            importStyle: false, // css in js
          })],
      }),
      
    ],
})
