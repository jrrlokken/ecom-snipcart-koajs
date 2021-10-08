const config = require("config");
const path = require("path");
const Koa = require("koa");
const Router = require("koa-router");
const loadRoutes = require("./app/routes");
const DataLoader = require("./app/dataLoader");
const views = require("koa-views");
const serve = require("koa-static");

const app = new Koa();
const router = new Router();

const port = process.env.PORT || config.get("server.port");

const productsLoader = new DataLoader(
  path.join(__dirname, config.get("data.path"), "products")
);

app.use(
  views(
    path.join(__dirname, config.get("views.path")),
    config.get("views.options")
  )
);

app.use(serve(config.get("static.path")));

app.use(async (ctx, next) => {
  ctx.state.settings = config.get("settings");
  ctx.state.urlWithoutQuery = ctx.origin + ctx.pathname;
  await next();
});

loadRoutes(router, productsLoader);
app.use(router.routes());

app.listen(port, () => {
  console.log(`Application started - listening on port ${port}`);
});
