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
    clientID: 'o9qQfEpDggK3Osq9GUFYC7XFg42GQ734',
    domain: 'mju.auth0.com',
    audience: 'http://localhost:8080',
    redirect: `${host}/callback`,
    scope: 'openid profile email'
  },
  api: {
    baseURI: 'http://localhost:8080/api'
  }
};
