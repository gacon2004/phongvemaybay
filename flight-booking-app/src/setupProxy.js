const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "https://phongvemaybay247.com",
      changeOrigin: true,         // giả mạo Origin = target
      secure: true,               // https chuẩn
      pathRewrite: { "^/api": "" } // /api/search -> /search
      // logLevel: "debug",       // bật nếu muốn xem log proxy
    })
  );
};
