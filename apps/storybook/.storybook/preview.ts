import { Preview } from '@storybook/html';
import { themes } from '@storybook/theming';
import { dark, light } from './theme';

const parameters: Record<string, any> = {
  darkMode: {
    dark: { ...dark, default: true },
    light: { ...themes.normal, ...light },
    stylePreview: true,
  },
  backgrounds: {
    disable: true,
    grid: {
      disable: true,
    },
  },
  viewMode: 'docs',
  previewTabs: {
    canvas: { hidden: false },
  },
  viewport: {
    viewports: {},
  },
  options: {
    storySort: {
      order: [
        // 'Get started',
        // 'Components state',
        // 'Testing',
        // 'Changelog',
        // ['Components state', 'Properties'],
        // 'Components',
        // ['Introduction', 'Changelog', 'Components'],
      ],
    },
  },
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/i,
    },
  },
};

export default {
  parameters,
} satisfies Preview;
