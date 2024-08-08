require("dotenv").config();
require("express-async-errors");
const app = require("express")();
const connectMongoDB = require("./database/connectMongoDB");
const {
  logHttpRequests,
  jsonParser,
  cookieParser,
  routeNotFound,
  errorHandler,
  imageUploader,
} = require("./middlewares");
const { authenticationRoutes, userRoutes, postRoutes } = require("./routes");

const port = process.env.PORT || 8080;

app.use(logHttpRequests());
app.use(jsonParser());
app.use(cookieParser());
app.use(imageUploader());

app.get("/", (_, res) => res.send("<h1>Welcome!</h1>"));
app.use("/api/v1/authentication", authenticationRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/posts", postRoutes);

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
