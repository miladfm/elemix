import { addons } from '@storybook/manager-api';
import { dark } from './theme';

addons.setConfig({
  theme: dark,
  toolbar: {
    title: { hidden: true },
    zoom: { hidden: true },
    eject: { hidden: true },
    copy: { hidden: true },
    fullscreen: { hidden: true },
    'storybook/background': { hidden: true },
    'storybook/viewport': { hidden: true },
  },
});
