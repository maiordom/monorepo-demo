declare module '*.css' {
  const content: any;
  export default content;
}

declare module '*.svg' {
  const content: any;
  export default content;
}

declare module '*.png' {
  const content: any;
  export default content;
}

declare class JslabApi {
  getCookie: () => string;
}

declare var jslabApi = new JslabApi();

declare var __APP_URL__: string;
declare var __ANALITYCS_KEY__: string;
declare var __ENV__: 'development' | 'testing' | 'production';
declare var __CHECKOUT_IFRAME_HOST__: string;
declare var __CHECKOUT_URL__: string;
