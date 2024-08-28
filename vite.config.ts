import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    dts({
      tsconfigPath: "tsconfig.app.json", //需要配这个打包后才有
    }),
  ],
  build: {
    lib: {
      entry: "core/index.ts", // 工具库入口
      name: "webrtc-player", // 工具库名称
      fileName: (format) => `webrtc-player.${format}.js`, // 工具库名称
    },
  },
});
