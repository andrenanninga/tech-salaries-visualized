const compose = require("next-compose");
const withCss = require("@zeit/next-css");
const withPurgeCss = require("next-purgecss");

module.exports = compose([
  [
    withCss,
    {
      cssLoaderOptions: {
        importLoaders: 1,
        localIdentName: "[local]"
      }
    }
  ],
  [
    withPurgeCss,
    {
      purgeCssEnabled: () => process.env.NODE_ENV === "production",
      purgeCssPaths: ["pages/**/*", "src/**/*"]
    }
  ],
  {
    serverless: true,
    webpack: config => {
      config.module.rules.push({
        test: /\.jsx?$/,
        use: ["astroturf/loader"]
      });

      return config;
    }
  }
]);
