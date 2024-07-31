require("dotenv").config();
require("express-async-errors");

const app = require("express")();

const {
  loggingMiddleware: loggingHTTPRequests,
  jsonParserMiddleware: jsonParser,
  routeNotFoundMiddleware: routeNotFound,
  errorHandlerMiddleware: errorHandler,
} = require("./middlewares");
const connectMongoDB = require("./database/connectMongoDB");

const port = process.env.PORT || 8080;

app.use(loggingHTTPRequests());
app.use(jsonParser());

app.get("/", (_, res) => res.send("<h1>Welcome!</h1>"));

app.use(routeNotFound);
app.use(errorHandler);

const startServer = async () => {
  try {
    await connectMongoDB();
    app.listen(port, console.log(`Server listening on port ${port}...`));
  } catch (error) {
    console.error(error);
  }
};

startServer();
