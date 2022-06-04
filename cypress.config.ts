import { defineConfig } from 'cypress';

// const webpackPreprocessor = require('@cypress/webpack-batteries-included-preprocessor');
// const webpackOptions = webpackPreprocessor.defaultOptions.webpackOptions;

const cyExtendsTask = require('@bahmutov/cypress-extends');
const cyCodeCoverageTask = require('@cypress/code-coverage/task');

export default defineConfig({
  videosFolder: 'cypress/videos',
  screenshotsFolder: 'cypress/screenshots',
  fixturesFolder: 'cypress/fixtures',
  supportFolder: 'cypress/support',
  projectId: '6gwih2',
  viewportWidth: 1920,
  viewportHeight: 1080,
  video: false,
  e2e: {
    setupNodeEvents(on, config) {
      const webpackPreprocessor = require('@cypress/webpack-batteries-included-preprocessor');
      const webpackOptions = webpackPreprocessor.defaultOptions.webpackOptions;

      webpackOptions.module.rules.unshift({
        test: /[/\\]@angular[/\\].+\.m?js$/,
        resolve: {
          fullySpecified: false,
        },
        use: {
          loader: 'babel-loader',
          options: {
            plugins: ['@angular/compiler-cli/linker/babel'],
            compact: false,
            cacheDirectory: true,
          },
        },
      });

      // on(
      //   'file:preprocessor',
      //   webpackPreprocessor({
      //     webpackOptions: webpackOptions,
      //     typescript: require.resolve('typescript'),
      //   }),
      // );

      // on('file:preprocessor', require('@cypress/code-coverage/use-babelrc'));

      on('before:browser:launch', (browser = {} as any, launchOptions) => {
        // some complex before:browser:launch configuration. There can be multiples of this, but at the end launchOptions need to be returned.
        return launchOptions;
      });

      // let's say we have multiple tasks are being used. This is a pattern to combine the tasks into an object and return them collectively
      const allTasks = Object.assign(
        {},
        cyCodeCoverageTask(on, config),
        cyExtendsTask(config.configFile),
      );

      // on('dev-server:start', (options) =>
      //   startAngularDevServer({
      //     options,
      //     tsConfig: 'cypress/tsconfig.json',
      //     target: 'workflow:build',
      //   }),
      // );

      return allTasks;
    },
    specPattern: '(cypress|src)/**/*.spec.ts',
    baseUrl: 'http://localhost:4200',
  },
});
