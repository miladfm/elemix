import type { StorybookConfig } from '@storybook/html-webpack5';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
import type { Configuration } from 'webpack';
import * as path from 'path';

const tsConfigPath = path.resolve(__dirname, '../tsconfig.storybook.json');

/**
 * register TsconfigPathsPlugin to webpack config
 */
function registerTsPaths(options: { configFile: string; config: Configuration }) {
  const { config, configFile } = options;
  const tsPaths = new TsconfigPathsPlugin({
    configFile,
  });

  config.resolve = config.resolve ?? {};
  config.resolve.plugins = config.resolve.plugins ?? [];

  // remove existing to prevent multiple tspaths plugin
  config.resolve.plugins = config.resolve.plugins.filter((plugin) => !(plugin instanceof TsconfigPathsPlugin));

  config.resolve.plugins.push(tsPaths);

  return config;
}

const config: StorybookConfig = {
  stories: ['../stories/**/*.mdx', '../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
  framework: {
    name: '@storybook/html-webpack5',
    options: {
      builder: {
        useSWC: true,
      },
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-shadow
  webpackFinal: (config) => {
    registerTsPaths({ config, configFile: tsConfigPath });
    return config;
  },
};

export default config;
