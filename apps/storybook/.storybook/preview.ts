import { Preview } from '@storybook/html';
import { DocsContainer } from '../components/docs-container';
import { DocPage } from '../components/docs-page';

const parameters: Record<string, any> = {
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
  docs: {
    // source: {
    //   excludeDecorators: true,
    //   type: 'source',
    // },
    container: DocsContainer,
    page: DocPage,
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
    // disable: true,
    // expanded: true,
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/i,
    },
  },
};

export default {
  parameters,
  // decorators: [
  //   (story) => {
  //     const storyResult = story({test: 'Elemix'});
  //
  //     const elem = document.createElement('div');
  //     elem.style.padding = '24px';
  //     elem.style.background = 'red';
  //     elem.appendChild(storyResult);
  //     return elem;
  //   }
  // ]
} satisfies Preview;
