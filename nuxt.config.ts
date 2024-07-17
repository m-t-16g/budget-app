import { defineNuxtConfig } from "nuxt/config";
import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";
export default defineNuxtConfig({
    // 日付ベースの互換性設定
    compatibilityDate: "2024-04-03",
    // 開発ツールの有効化
    devtools: {
        enabled: true,

        timeline: {
            enabled: true,
        },
    },
    // ビルド設定
    build: { transpile: ["vuetify"] },
    modules: [
        (_options, nuxt) => {
            nuxt.hooks.hook("vite:extendConfig", (config) => {
                // @ts-expect-error
                config.plugins.push(vuetify({ autoImport: true }));
            });
        },
        //...
    ],
    vite: {
        vue: {
            template: {
                transformAssetUrls,
            },
        },
    },
    app: {
        head: {
            title: "家計簿アプリ",
            charset: "utf-8",
        },
    },
});
