require("dotenv").config();
require("express-async-errors");
const app = require("express")();
const cloudinary = require("cloudinary").v2;
const connectMongoDB = require("./database/connectMongoDB");
const {
  logHttpRequests,
  jsonParser,
  cookieParser,
  routeNotFound,
  errorHandler,
  fileUploader
} = require("./middlewares");
const { authenticationRoutes, userRoutes, postRoutes } = require("./routes");

const port = process.env.PORT || 8080;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use(logHttpRequests());
app.use(jsonParser());
app.use(cookieParser());
app.use(fileUploader());

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
