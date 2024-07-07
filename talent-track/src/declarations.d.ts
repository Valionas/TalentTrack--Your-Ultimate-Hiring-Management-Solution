// src/declarations.d.ts
declare module "*.svg" {
    const content: any;
    export default content;
  }
// src/images.d.ts
declare module '*.png' {
    const value: string;
    export default value;
}

declare module '*.jpg' {
  const value: string;
  export default value;
}