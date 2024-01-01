/// <reference types="./jest.d" />

declare module '*.svg' {
  const content: string;
  export const ReactComponent: any;
  export default content;
}

declare module '*.md' {
  const content: string;
  export default content;
}
