require("dotenv").config({ quiet: true });
const express = require("express");
const storeRouter = require("./routes/store.router");
const hostRouter = require("./routes/host.router");
const app = express();
const path = require("path");
const errorsController = require("./controllers/errors.controller");
const mongoConnect = require("./utils/databaseUtil");
const authRouter = require("./routes/auth.router");
const session = require("express-session");
const MongoDBSession = require("connect-mongodb-session")(session);
const multer = require("multer")

app.set("view engine", "ejs");
app.set("views", "views");
app.use(express.urlencoded());
app.use(express.static(path.join("public")));
app.use("/uploads", express.static(path.join("uploads")));
const store = MongoDBSession({
  uri: process.env.MONGO_URL,
  collection: "sessions",
});
app.use(
  session({
    secret: "hello-world-by-anurag",
    resave: false,
    saveUninitialized: true,
    store: store,
  }),
);

app.use((req, res, next) => {
  console.log(req.url, req.method);
  next();
});

app.use((req, res, next) => {
  res.locals.currentPath = req.path;
  next();
});

app.use(authRouter);

app.use("/", storeRouter);

app.use(
  "/host",
  (req, res, next) => {
    if (!req.session.isLoggedIn) {
      return res.redirect("/login");
    }
    next();
  },
  hostRouter,
);

// if url does not matches with any above url it will print 404
app.use(errorsController.handlePageNotFound);

const PORT = 4000;
mongoConnect()
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () =>
      console.log(`server started running at http://localhost:${PORT}`),
    );
  })
  .catch((err) => {
    console.log("Error while connecting to MongoDB", err);
  });
