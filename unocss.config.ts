import { defineConfig, presetAttributify, presetUno } from "unocss";
import presetRemToPx from "@unocss/preset-rem-to-px";

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
    // @ts-ignore
    presetRemToPx({
      baseFontSize: 4,
    }),
  ],
});
