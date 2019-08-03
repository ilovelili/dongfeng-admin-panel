// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.
const host = 'http://localhost:4200';

export const environment = {
  production: false,
  language: 'zh',
  host: host,
  auth: {
    clientId: '5d3d48476692ea2c7cf68ff7',
    openId: {
      dingTalk: {
        appId: 'dingoaisewv330wuy27gvj',
        appSecret: 'kxnoiOkGjcyudMtwP6SLwuH7-IRKaP_oGIIbkQ3cHESWB-ZwA84-HwlVjHWZ1ZPI',
        redirect: 'https://oauth.authing.cn/oauth/dingtalk/redirect'
      }
    }
  },
  api: {
    baseURI: 'http://localhost:8080/api',
    imageServer: 'http://47.110.143.96:81/images',
    ebookServer: 'http://47.110.143.96:81/ebooks',
  }
};
