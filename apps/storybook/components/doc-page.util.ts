import { CompoDocInterfaceMethod, CompoDocInterfaceProperty } from './doc-page.model';

export const renderDefaultValue = (property: CompoDocInterfaceProperty) => {
  const defaultTag = property.jsdoctags?.find((tag) => tag.tagName.escapedText === 'default');
  return defaultTag ? defaultTag.comment.trim() : '';
};

export const renderMethodValue = (method: CompoDocInterfaceMethod) => {
  const inputs = method.args.map((methodArg) => `${methodArg.name}${methodArg.optional ? '?' : ''}: ${methodArg.type}`);
  return `${method.name}(${inputs.join(', ')}): ${method.returnType}`;
};

export const createMarkup = (htmlString: string) => ({ __html: htmlString });
