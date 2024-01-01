import * as React from 'react';
import { DocsContainer as DefaultDocsContainer } from '@storybook/addon-docs';
import { dark } from '../.storybook/theme';

/**
 * A container that wraps storybook's native docs container to add extra components to the docs experience
 */
export const DocsContainer = ({ children, context }) => {
  return (
    <DefaultDocsContainer theme={dark} context={context}>
      {children}
    </DefaultDocsContainer>
  );
};