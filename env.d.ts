// shims.d.ts 或 env.d.t文件的作用是为 TypeScript 编译器提供类型声明，以便更好地理解 .vue 文件的结构和内容。
declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  // eslint-disable-next-line @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>;
  export default component;
}