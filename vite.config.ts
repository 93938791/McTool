import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { prismjsPlugin } from 'vite-plugin-prismjs'
import Components from "unplugin-vue-components/vite";
import { AntDesignVueResolver } from "unplugin-vue-components/resolvers";
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src/')
    }
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
