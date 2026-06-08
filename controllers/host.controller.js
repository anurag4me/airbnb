const Home = require("../models/homes.model");

exports.getAddHome = (req, res, next) => {
  res.render("host/edit-home", {
    pageTitle: "Airbnb Add Home",
    isLoggedIn: req.session.isLoggedIn,
  });
};

exports.postAddHome = (req, res, next) => {
  const { _id, name, price, description, imageUrl, location, ratings } =
    req.body;
  // console.log(req.body)
  const home = new Home({
    name,
    price,
    description,
    imageUrl,
    location,
    ratings,
  });
  home.save().then((result) => {
    console.log("Home saved successfully", result);
  });
  res.redirect("/host/home-list");
};

exports.getHostHomes = (req, res, next) => {
  Home.find().then((registeredHomes) => {
    res.render("host/host-home-list", {
      registeredHomes,
      pageTitle: "Host Homes List",
      isLoggedIn: req.session.isLoggedIn,
    });
  });
};

exports.getEditHome = (req, res, next) => {
  const editing = req.query.editing === "true";
  const homeId = req.params.homeId;
  Home.findById(homeId).then((home) => {
    if (!home) {
      // console.log("home not found for editing")
      return res.redirect("/host/home-list");
    }
    // console.log(homeId, editing, home)
    res.render("host/edit-home", {
      editing,
      home,
      pageTitle: "Edit Your Home",
      isLoggedIn: req.session.isLoggedIn,
    });
  });
};

exports.postEditHome = (req, res, next) => {
  const { _id, name, price, description, imageUrl, location, ratings } =
    req.body;
  const home = Home.findByIdAndUpdate(_id, {
    $set: { name, price, description, imageUrl, location, ratings },
  })
    .then((result) => {
      console.log("Home updated successfully", result);
    })
    .catch((err) => {
      console.log("Error occurred during editing home details", err);
    });
  res.redirect("/host/home-list");
};

exports.postDeleteHome = (req, res, next) => {
  const { homeId } = req.params;
  Home.findByIdAndDelete(homeId)
    .then(() => {
      res.redirect("/host/home-list");
    })
    .catch((err) => {
      console.error("Error while deleting", err);
    });
};
