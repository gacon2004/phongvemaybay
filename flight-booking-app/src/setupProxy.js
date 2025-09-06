const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = (app) => {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "https://phongvemaybay247.com",
      changeOrigin: true,
      secure: true,
      pathRewrite: { "^/api": "" },
      logLevel: "debug",
    })
  );
};
