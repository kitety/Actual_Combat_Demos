/* config-overrides.js */

module.exports = {
  webpack: function (config) {
    config.output.library = "reactApp";
    config.output.libraryTarget = "umd";
    config.output.publicPath = "http://localhost:20000/";
    return config;
  },
  devServer: function (configFunction) {
    return (proxy, allowedHosts) => {
      const config = configFunction(proxy, allowedHosts);
      config.port = 20000;
      config.headers = {
        "Access-Control-Allow-Origin": "*",
      };
      return config;
    };
  },
};
