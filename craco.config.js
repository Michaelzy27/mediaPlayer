const CracoLessPlugin = require('craco-less');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const AntdDayjsWebpackPlugin = require('antd-dayjs-webpack-plugin');
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
  style: {
    postcss: {
      plugins: [require('tailwindcss'), require('autoprefixer')],
    },
  },
  jest: {
    configure: {
      resetMocks: true,
      setupFilesAfterEnv: ['./jest.setup.js'],
    },
  },
  webpack: {
    plugins: {
      add: [
        new AntdDayjsWebpackPlugin(),
        ...(process.env.NODE_ENV === "development"
        ? [new BundleAnalyzerPlugin({ openAnalyzer: false })]
        : []),
      ],
    },
    configure: (webpackConfig, { env, paths }) => {
      // create separate app and css chunks

      webpackConfig.entry = {
        main: path.join(__dirname, '/src/index.tsx'),
        css: path.join(__dirname, '/src/css_index.ts'),
      };

      const staticPages = ['faq', 'privacy-legal', 'contact'];

      staticPages.forEach((name) => {
        webpackConfig.plugins.push(
          new HtmlWebpackPlugin({
            filename: `${name}.html`,
            template: `./public/${name}.html`,
            chunks: ['css'],
            excludeChunks: ['main'],
          })
        );
      });

      webpackConfig.output.filename = 'static/js/[name].[hash].js';

      // https://github.com/pmmmwh/react-refresh-webpack-plugin/issues/88#issuecomment-627558799
      webpackConfig.optimization.runtimeChunk = 'single';

      return webpackConfig;
    },
  },
};
