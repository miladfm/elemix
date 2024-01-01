export type CompoDocInterfaceType = 'interface' | 'number' | 'string' | string;
export type HTMLString = string;

export interface CompoDocInterface {
  name: string;
  id: string;
  file: string;
  deprecated: boolean;
  description: HTMLString;
  deprecationMessage: string;
  type: CompoDocInterfaceType;
  sourceCode: string;
  properties: CompoDocInterfaceProperty[];
  indexSignatures: unknown[];
  kind: number;
  methods: CompoDocInterfaceMethod[];
  extends: unknown[];
}

export interface CompoDocInterfaceMethod {
  name: string;
  args: {
    name: string;
    type: CompoDocInterfaceType;
    deprecated: string;
    description: HTMLString;
    deprecationMessage: string;
    optional: boolean;
  }[];
  optional: boolean;
  returnType: string;
  typeParameters: unknown[];
  line: number;
  deprecated: boolean;
  description: HTMLString;
  deprecationMessage: string;
}

export interface CompoDocInterfaceProperty {
  name: string;
  deprecated: boolean;
  deprecationMessage: string;
  type: CompoDocInterfaceType;
  optional: boolean;
  description: HTMLString;
  jsdoctags: {
    comment: HTMLString; // @default 123 -> "<p>123</p>"
    kind: number;
    deprecated: boolean;
    tagName: {
      escapedText: string; // @default 123 -> default
      text: string;
      kind: number;
    };
  }[];
  line: number;
}

export interface DocsConfig {
  apiRefPath: string;
  overviewMarkdown: string;
}

export interface StorybookParameters {
  docs: DocsConfig;

  [name: string]: any;
}
