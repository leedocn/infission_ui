import type { StorybookConfig } from "@storybook/react-vite";
import { resolve } from "node:path";

const config: StorybookConfig = {
  stories: ["../stories/**/*.stories.@(ts|tsx)"],
  staticDirs: [{ from: "../references", to: "/references" }],
  addons: ["@storybook/addon-essentials"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  viteFinal: async (viteConfig) => {
    viteConfig.resolve ??= {};
    viteConfig.resolve.alias = [
      { find: "infisson_ui/styles.css", replacement: resolve("packages/infisson_ui/src/styles.css") },
      { find: "infisson_ui", replacement: resolve("packages/infisson_ui/src/index.ts") },
    ];
    return viteConfig;
  },
};

export default config;
