const path = require("path");
const resolve = (dir) => path.resolve(__dirname, dir);
const PROXY_DEV_URL = `10.2.20.7`;
const { EnvironmentPlugin } = require("webpack");
let myConfig = null;

module.exports = {
  webpack: {
    alias: {
      "@": resolve("src"),
    },
    configure: (webpackConfig, { env, paths }) => {
      webpackConfig.output = {
        path: path.resolve(__dirname, "build"),
        //
        filename: "[name].[hash:8].js",
        sourceMapFilename: "[name].[hash:8].map",
        chunkFilename: "[name].[hash:8].js",
      };
      webpackConfig.devtool = "eval-source-map";
      console.log(webpackConfig);
      return webpackConfig;
    },
    plugins: {
      add: [
        new EnvironmentPlugin({
          NODE_ENV: myConfig?.mode,
          PROXY_DEV_URL: PROXY_DEV_URL,
        }),
      ] /* An array of plugins */,
    },
  },
  devServer: {
    port: 3003,
    // open: true,
    // hot: true,
    compress: true,
    proxy: {
      "/api": {
        target: `http://${PROXY_DEV_URL}/register/api`,
        pathRewrite: { "^/api/": "/" },
      },
      "/connect": {
        target: `${PROXY_DEV_URL}/websocket/register/connect/`,
        ws: true,
        // pathRewrite: { "^/connect/": "/" },
      },
    },
  },
};
