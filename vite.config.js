import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { TDesignResolver } from '@tdesign-vue-next/auto-import-resolver';
// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(),
  AutoImport({
    resolvers: [TDesignResolver({
      library: 'vue-next'
    })],
  }),
  Components({
    resolvers: [TDesignResolver({
      library: 'vue-next'
    })],
  }),
    ,
  vueJsx({
    // 可选配置
    include: /\.(jsx|tsx)/,
    // 自定义 babel 配置
    // babelPlugins: [
    //   ['@babel/plugin-proposal-decorators', { legacy: true }],
    //   ['@babel/plugin-proposal-class-properties', { loose: true }]
    // ]
  })
  ],
})
