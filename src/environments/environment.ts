// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: true,
  firebase: {
    apiKey: "AIzaSyDcE7cs4NzI0GlvroNf4RrBwu3Q4TDh3bA",
    authDomain: "igrejotaapp.firebaseapp.com",
    databaseURL: "https://igrejotaapp.firebaseio.com",
    projectId: "igrejotaapp",
    storageBucket: "igrejotaapp.appspot.com",
    messagingSenderId: "67202763289"
  }
};
