import { create } from '@storybook/theming';
import logo from './assets/logo.svg';

export const light = create({
  base: 'light',
  brandTitle: 'Elemix',

  brandUrl: 'https://github.com/miladfm/elemix',
  brandImage: logo,

  colorPrimary: '#8c40ef',
  colorSecondary: '#8c40ef',

  // UI
  appBg: '#ffffff',
  appContentBg: '#ffffff',
  appBorderColor: '#e9eaeb',

  // Text colors
  textColor: '#3f4250',
  textInverseColor: '#ffffff',

  // Toolbar default and active colors
  barTextColor: '#727683',
  barSelectedColor: '#8d40ee', // Selected controller tab
  barBg: '#f9f9fa',

  buttonBg: '#ffffff',
  buttonBorder: '#d9dadd',

  // BIZARRE
  booleanBg: '#ffffff',
  booleanSelectedBg: '#f1eefc',

  // Form colors
  inputBg: '#ffffff',
  inputBorder: '#d9dadd',
  inputTextColor: '#3f4250',
  inputBorderRadius: 4,
  appPreviewBg: 'transparent', // The default value of the story background and will be overridden after the Theme has applied
  appBorderRadius: 4, // Toolbar menu overlay radius
  fontBase: 'Nunito Sans, sans-serif',
  fontCode: 'Nunito Sans, sans-serif',
  textMutedColor: '#798186', // Font color of sidenav title and search box text
  barHoverColor: '#8c40ef',
});

export const dark = create({
  base: 'dark',
  brandTitle: 'Elemix',

  brandUrl: 'https://github.com/miladfm/elemix',
  brandImage: logo,

  colorPrimary: '#8d40ee',
  colorSecondary: '#8d40ee',

  // UI
  appBg: '#151a2d',
  appContentBg: '#151a2d',
  appBorderColor: '#484b5a',

  // Text colors
  textColor: '#b8bac0',
  textInverseColor: '#0c0f1a',

  // Toolbar default and active colors
  barTextColor: '#7e8291',
  barSelectedColor: '#8d40ee', // Selected controller tab
  barBg: '#252a3b',

  buttonBg: '#151a2d',
  buttonBorder: '#626672',

  // BIZARRE
  booleanBg: '#151a2d',
  booleanSelectedBg: '#2d1c51',

  // Form colors
  inputBg: '#151a2d',
  inputBorder: '#626672',
  inputTextColor: '#b8bac0',
  inputBorderRadius: 4,

  appPreviewBg: 'transparent', // The default value of the story background and will be overridden after the Theme has applied
  appBorderRadius: 4, // Toolbar menu overlay radius
  fontBase: 'Nunito Sans, sans-serif',
  fontCode: 'Nunito Sans, sans-serif',
  textMutedColor: '#798186', // Font color of sidenav title and search box text
  barHoverColor: '#fff',
});
