import { create } from '@storybook/theming';
import logo from '../images/logo.svg';

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

  colorPrimary: '#21C55D',
  colorSecondary: '#21C55D',

  // UI
  appBg: '#151517',
  appContentBg: '#151517', // Controller BG
  appBorderColor: 'hsla(0,0%,100%,.1)', // All borders

  // Text colors
  textColor: '#a1a1aa',
  textInverseColor: 'blue',

  // Toolbar default and active colors
  barTextColor: '#F4F4F5', // Controller: toolbar text, icon and reset icon
  barSelectedColor: '#21C55D', // Selected controller tab
  barBg: '#151517',

  buttonBg: '#151517',
  buttonBorder: 'hsla(0,0%,100%,.1)',

  // BIZARRE
  booleanBg: '#151a2d',
  booleanSelectedBg: '#2d1c51',

  // Form colors
  inputBg: '#151517',
  inputBorder: 'hsla(0,0%,100%,.1)',
  inputTextColor: '#e4e4e7',
  inputBorderRadius: 6,

  appPreviewBg: '#151517', // The default value of the story background and will be overridden after the Theme has applied
  appBorderRadius: 4, // Toolbar menu overlay radius
  fontBase: 'Nunito Sans, sans-serif',
  fontCode: 'Nunito Sans, sans-serif',
  textMutedColor: '#a1a1aa', // Font color of sidenav title and search box text
  barHoverColor: '#fff',
});
