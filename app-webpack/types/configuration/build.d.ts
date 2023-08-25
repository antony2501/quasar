import { MinifyOptions as TerserOptions } from "terser";
import { Configuration as WebpackConfiguration } from "webpack";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";
import * as WebpackChain from "webpack-chain";
import { DefinedDefaultAlgorithmAndOptions } from "compression-webpack-plugin";
import { QuasarHookParams } from "./conf";

interface HtmlMinifierOptions {
  caseSensitive?: boolean;
  collapseBooleanAttributes?: boolean;
  collapseInlineTagWhitespace?: boolean;
  collapseWhitespace?: boolean;
  conservativeCollapse?: boolean;
  continueOnParseError?: boolean;
  customAttrAssign?: RegExp[];
  customAttrCollapse?: RegExp;
  customAttrSurround?: RegExp[];
  customEventAttributes?: RegExp[];
  decodeEntities?: boolean;
  html5?: boolean;
  ignoreCustomComments?: RegExp[];
  ignoreCustomFragments?: RegExp[];
  includeAutoGeneratedTags?: boolean;
  keepClosingSlash?: boolean;
  maxLineLength?: number;
  minifyCSS?: boolean;
  minifyJS?: boolean;
  minifyURLs?: boolean;
  preserveLineBreaks?: boolean;
  preventAttributesEscaping?: boolean;
  processConditionalComments?: boolean;
  processScripts?: string[];
  quoteCharacter?: string;
  removeAttributeQuotes?: boolean;
  removeComments?: boolean;
  removeEmptyAttributes?: boolean;
  removeEmptyElements?: boolean;
  removeOptionalTags?: boolean;
  removeRedundantAttributes?: boolean;
  removeScriptTypeAttributes?: boolean;
  removeStyleLinkTypeAttributes?: boolean;
  removeTagWhitespace?: boolean;
  sortAttributes?: boolean;
  sortClassName?: boolean;
  trimCustomFragments?: boolean;
  useShortDoctype?: boolean;
}

interface InvokeParams {
  isClient: boolean;
  isServer: boolean;
}

interface EsbuildTargetOptions {
  /**
   * @default ['es2019', 'edge88', 'firefox78', 'chrome87', 'safari13.1']
   */
  browser?: string[];
  /**
   * @example 'node16'
   */
  node?: string;
}

interface QuasarStaticBuildConfiguration {
  /**
   * Transpile JS code with Babel
   *
   * @default true
   */
  webpackTranspile?: boolean;
  /**
   * Add dependencies for transpiling with Babel (from node_modules, which are by default not transpiled).
   * It is ignored if "transpile" is not set to true.
   * @example [ /my-dependency/, 'my-dep', ...]
   */
  webpackTranspileDependencies?: (RegExp | string)[];
  /**
   * @example
   *    {
   *      browser: ['es2019', 'edge88', 'firefox78', 'chrome87', 'safari13.1'],
   *      node: 'node16'
   *    }
   */
  esbuildTarget?: EsbuildTargetOptions;

  /** Show a progress bar while compiling. */
  showProgress?: boolean;
  /**
   * Extend Webpack config generated by Quasar CLI.
   * Equivalent to chainWebpack(), but you have direct access to the Webpack config object.
   */
  extendWebpack?: (
    config: WebpackConfiguration,
    invokeParams: InvokeParams
  ) => void;
  /**
   * Extend Webpack config generated by Quasar CLI.
   * Equivalent to extendWebpack(), but using [webpack-chain](https://github.com/neutrinojs/webpack-chain) instead.
   */
  chainWebpack?: (chain: WebpackChain, invokeParams: InvokeParams) => void;
  /**
   * Prepare external services before `$ quasar dev` command runs
   * like starting some backend or any other service that the app relies on.
   * Can use async/await or directly return a Promise.
   */
  beforeDev?: (params: QuasarHookParams) => void;
  /**
   * Run hook after Quasar dev server is started (`$ quasar dev`).
   * At this point, the dev server has been started and is available should you wish to do something with it.
   * Can use async/await or directly return a Promise.
   */
  afterDev?: (params: QuasarHookParams) => void;
  /**
   * Run hook before Quasar builds app for production (`$ quasar build`).
   * At this point, the distributables folder hasn’t been created yet.
   * Can use async/await or directly return a Promise.
   */
  beforeBuild?: (params: QuasarHookParams) => void;
  /**
   * Run hook after Quasar built app for production (`$ quasar build`).
   * At this point, the distributables folder has been created and is available
   *  should you wish to do something with it.
   * Can use async/await or directly return a Promise.
   */
  afterBuild?: (params: QuasarHookParams) => void;
  /**
   * Run hook if publishing was requested (`$ quasar build -P`),
   *  after Quasar built app for production and the afterBuild hook (if specified) was executed.
   * Can use async/await or directly return a Promise.
   * `opts` is Object of form `{arg, distDir}`,
   * where “arg” is the argument supplied (if any) to -P parameter.
   */
  onPublish?: (ops: { arg: string; distDir: string }) => void;
  /**
   * Public path of your app.
   * Use it when your public path is something else,
   * like _“<protocol>://<domain>/some/nested/folder”_ – in this case,
   * it means the distributables are in _“some/nested/folder”_ on your webserver.
   *
   * @default '/'
   */
  publicPath?: string;
  /**
   * Sets [Vue Router mode](https://router.vuejs.org/guide/essentials/history-mode.html).
   * History mode requires configuration on your deployment web server too.
   *
   * @default 'hash'
   */
  vueRouterMode?: "hash" | "history";
  /**
   * Sets Vue Router base.
   * Should not need to configure this, unless absolutely needed.
   */
  vueRouterBase?: string;
  /**
   * Automatically open remote Vue Devtools when running in development mode.
   */
  vueDevtools?: boolean;
  /**
   * Should the Vue Options API be available? If all your components only use Composition API
   * it would make sense performance-wise to disable Vue Options API for a compile speedup.
   *
   * @default true
   */
  vueOptionsAPI?: boolean;
  /**
   * @default 'index.html'
   */
  htmlFilename?: string;
  /**
   * Folder where Quasar CLI should generate the distributables.
   * Relative path to project root directory.
   *
   * @default 'dist/{ctx.modeName}' For all modes except Cordova.
   * @default 'src-cordova/www' For Cordova mode.
   */
  distDir?: string;
  /**
   * Ignores the public folder.
   */
  ignorePublicFolder?: boolean;
  /**
   * Source map [strategy](https://webpack.js.org/configuration/devtool/) to use.
   */
  devtool?: WebpackConfiguration["devtool"];

  /**
   * Add properties to `process.env` that you can use in your website/app JS code.
   *
   * @example { SOMETHING: 'someValue' }
   */
  env?: { [index: string]: string | boolean | undefined | null };
  /**
   * Defines constants that get replaced in your app.
   * Unlike `env`, you will need to use JSON.stringify() on the values yourself except for booleans.
   * Also, these will not be prefixed with `process.env.`.
   *
   * @example { SOMETHING: JSON.stringify('someValue') } -> console.log(SOMETHING) // console.log('someValue')
   */
  rawDefine?: { [index: string]: string | boolean | undefined | null };
  /**
   * Folder where Quasar CLI should look for .env* files.
   * Can be an absolute path or a relative path to project root directory.
   *
   * @default project root directory
   */
  envFolder?: string;
  /**
   * Additional .env* files to be loaded.
   * Each entry can be an absolute path or a relative path to quasar.config > build > envFolder.
   *
   * @example ['.env.somefile', '../.env.someotherfile']
   */
  envFiles?: string[];

  /**
   * Gzip the distributables.
   * Could be either a boolean or compression plugin options object.
   * In addition, you can specify which file extension you want to
   * gzip with extension array field in replacement of compression plugin test option.
   * By default it's ['js','css'].
   * @example
   *    {
   *      extension: ['js','css','svg'],
   *      threshold: 0,
   *      minRatio: 1
   *    }
   * @default false
   */
  gzip?:
    | boolean
    | (DefinedDefaultAlgorithmAndOptions<any> & {
        extensions: string[];
      });
  /**
   * Show analysis of build bundle with webpack-bundle-analyzer.
   * When providing an object, it represents webpack-bundle-analyzer config options.
   */
  analyze?: boolean | BundleAnalyzerPlugin.Options;
  /** Include vue runtime + compiler version, instead of default Vue runtime-only. */
  vueCompiler?: boolean;
  /**
   * Should the Vue Options API be available? If all your components only use Composition API
   * it would make sense performance-wise to disable Vue Options API for a compile speedup.
   *
   * @default true
   */
  vueOptionsApi?: boolean;
  // TODO: esbuildEslintOptions
  // TODO: webpackEslintPluginOptions
  /**
   * Minification options. [Full list](https://github.com/webpack-contrib/terser-webpack-plugin/#minify).
   */
  uglifyOptions?: TerserOptions;
  /** Options to supply to `sass-loader` for `.scss` files. */
  scssLoaderOptions?: object;
  /** Options to supply to `sass-loader` for [`.sass`](https://github.com/webpack-contrib/sass-loader#sassoptions) files. */
  sassLoaderOptions?: object;
  /** Options to supply to `stylus-loader`. */
  stylusLoaderOptions?: object;
  /** Options to supply to `less-loader`. */
  lessLoaderOptions?: object;
  /** Options to supply to `vue-loader` */
  vueLoaderOptions?: object;
  /** Options to supply to `ts-loader` */
  tsLoaderOptions?: object;
  /** Options to supply to `ts-checker` */
  tsCheckerOptions?: object;
  /**
   * RTL options. [Full list](https://github.com/vkalinichev/postcss-rtl).
   * When providing an object, it is the configuration for postcss-rtl plugin, and if fromRTL is present it will only be used for client styles
   * When providing a function, the function will receive a boolean that is true for client side styles and false otherwise and the path to the style file
   *
   */
  rtl?:
    | boolean
    | object
    | ((isClientCSS: boolean, resourcePath: string) => object);
}

/**
 * Following properties of `build` are automatically configured by Quasar CLI
 *  depending on dev/build commands and Quasar mode.
 * You can override some, but make sure you know what you are doing.
 */
interface QuasarDynamicBuildConfiguration {
  /**
   * Set to `false` to disable minification, or specify the minifier to use.
   * Available options are 'terser' or 'esbuild'.
   * If set to anything but boolean false then it also applies to CSS.
   * For production only.
   * @default 'esbuild'
   */
  minify?: boolean | 'terser' | 'esbuild';
  /**
   * Minification options for html-minifier. [Full list](https://github.com/kangax/html-minifier)
   * @default
   *  {
   *    removeComments: true,
   *    collapseWhitespace: true,
   *    removeAttributeQuotes: true,
   *    collapseBooleanAttributes: true,
   *    removeScriptTypeAttributes: true
   *  }
   */
  htmlMinifyOptions?: HtmlMinifierOptions;
  /**
   * If `true`, a separate sourcemap file will be created. If 'inline', the
   * sourcemap will be appended to the resulting output file as data URI.
   * 'hidden' works like `true` except that the corresponding sourcemap
   * comments in the bundled files are suppressed.
   * @default false
   */
  sourcemap?: boolean | 'inline' | 'hidden';
}

export type QuasarBuildConfiguration = QuasarStaticBuildConfiguration &
  QuasarDynamicBuildConfiguration;
