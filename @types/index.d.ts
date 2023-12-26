/// <reference types="./jest.d" />

declare module '*.svg' {
  const content: string;
  export default content;
}
