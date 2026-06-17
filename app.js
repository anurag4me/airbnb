require("dotenv").config({ quiet: true });
const express = require("express");
const storeRouter = require("./routes/store.router");
const hostRouter = require("./routes/host.router");
const app = express();
const path = require("path");
const rootDir = require("./utils/pathUtil");
const errorsController = require("./controllers/errors.controller");
const mongoConnect = require("./utils/databaseUtil");
const authRouter = require("./routes/auth.router");
const session = require("express-session");
const MongoDBSession = require("connect-mongodb-session")(session);
const multer = require("multer")

app.set("view engine", "ejs");
app.set("views", "views");
app.use(express.urlencoded());
const randomName = (length) => {
  const characters = "abcdefghijklmnopqrstuvwxyz";
  let result = "";
  for(let i=0; i<length; i++){
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/")
  },
  filename: (req, file, cb) => {
    cb(null, randomName(10) + '-' + file.originalname);
  }
})
const fileFilter = (req, file, cb) => {
  if(['image/jpeg', 'image/jpg', 'image/png'].includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
}
app.use(multer({ storage, fileFilter }).single('photo'));
app.use(express.static(path.join(rootDir, "public")));
app.use("/uploads", express.static(path.join(rootDir, "uploads")));
app.use("/host/uploads", express.static(path.join(rootDir, "uploads")));
app.use("/homes/uploads", express.static(path.join(rootDir, "uploads")));
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
