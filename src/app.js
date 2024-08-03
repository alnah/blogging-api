require("dotenv").config();
require("express-async-errors");

const app = require("express")();

const connectMongoDB = require("./database/connectMongoDB");
const {
  loggingHttpRequests,
  jsonParser,
  cookieParser,
  routeNotFound,
  errorHandler,
} = require("./middlewares");

const { authenticationRoutes } = require("./routes");

const port = process.env.PORT || 8080;

app.use(loggingHttpRequests());
app.use(jsonParser());
app.use(cookieParser());

app.get("/", (_, res) => res.send("<h1>Welcome!</h1>"));
app.use("/api/v1/authentication", authenticationRoutes);

app.use(routeNotFound);
app.use(errorHandler);

const startServer = async () => {
  try {
    await connectMongoDB();
    app.listen(port, () => console.log(`Server listening on port ${port}...`));
  } catch (error) {
    console.error(error);
  }
};

startServer();
