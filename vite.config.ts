/*
 * @Author: Anixuil
 * @Date: 2024-12-26 17:19:21
 * @LastEditors: Anixuil
 * @LastEditTime: 2025-01-20 15:09:10
 * @Description: 项目配置文件
 */
import { defineConfig } from 'vite'
import path from 'node:path'
import electron from 'vite-plugin-electron/simple'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import monacoEditorPlugin from 'vite-plugin-monaco-editor'
// import ElementPlus from 'unplugin-element-plus/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/, /\.[tj]sx?$/],
      imports: ['vue', 'vue-router', 'pinia'],
      dts: 'auto-imports.d.ts'
    }),
    Components({
      resolvers: [ElementPlusResolver({
        importStyle: 'sass'
      })],
      dts: true,
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
      exclude: [/node_modules/]
    }),
    electron({
      main: {
        // Shortcut of `build.lib.entry`.
        entry: 'electron/main.ts',
      },
      preload: {
        // Shortcut of `build.rollupOptions.input`.
        // Preload scripts may contain Web assets, so use the `build.rollupOptions.input` instead `build.lib.entry`.
        input: path.join(__dirname, 'electron/preload.ts'),
      },
      // Ployfill the Electron and Node.js API for Renderer process.
      // If you want use Node.js in Renderer process, the `nodeIntegration` needs to be enabled in the Main process.
      // See 👉 https://github.com/electron-vite/vite-plugin-electron-renderer
      renderer: process.env.NODE_ENV === 'test'
        // https://github.com/electron-vite/vite-plugin-electron-renderer/issues/78#issuecomment-2053600808
        ? undefined
        : {},
    }),
    // renderer({
    //   resolve: {
    //     sqlite3: { type: 'cjs' }
    //   }
    // })
    // ElementPlus({
    //   useSource: true
    // })
    monacoEditorPlugin,
  ],
  resolve: {
    alias: {
      '@': '/src',
      '@components': '/src/components',
      '@types': '/src/types',
      '@renderer': '/src/renderer',
      '@main': '/src/main',
      '@router': '/src/router',
      '@styles': '/src/styles',
      '@store': '/src/store',
      '@utils': '/src/utils',
      '@views': '/src/views',
      '@api': '/src/api',
      '@assets': '/src/assets',
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @use "@styles/modules/theme/variables.scss" as *;
        @use "@styles/modules/theme/mixins.scss" as *;
        `,
        api: 'modern-compiler', // 设置scss的api类型为modern-compiler 以支持新特性
      },
    },
  },
  optimizeDeps: {
    include: ['monaco-editor/esm/vs/editor/editor.worker']
  },
  // build: {
  //   rollupOptions: {
  //     external: ["sqlite3", "electron"],
  //     output: {
  //       entryFileNames: '[name].cjs',
  //     },
  //   },
  // }
})
