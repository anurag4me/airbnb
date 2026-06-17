const Home = require("../models/homes.model");
const fs = require("fs")

exports.getAddHome = (req, res, next) => {
  res.render("host/edit-home", {
    pageTitle: "Airbnb Add Home",
    isLoggedIn: req.session.isLoggedIn,
    user: req.session.user,
  });
};

exports.postAddHome = (req, res, next) => {
  const { _id, name, price, description, location, ratings } = req.body;
  console.log(req.body)
  console.log(req.file)

  if(!req.file) {
    return res.status(422).send("No Image provided");
  }

  const home = new Home({
    name,
    price,
    description,
    photo: req.file.path,
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
      user: req.session.user,
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
      user: req.session.user,
    });
  });
};

exports.postEditHome = (req, res, next) => {
  const { _id, name, price, description, photo, location, ratings } = req.body;
  Home.findById(_id)
    .then(home => {
      home.name = name;
      home.price = price;
      home.description = description;
      home.location = location;
      home.ratings = ratings;

      if(req.file) {
        fs.unlink(home.photo, err=>{
          if(err) {
            console.log("Error while deleting file", err)
          }
        });
        home.photo = req.file.path;
      }

      home
        .save()
        .then((result) => {
          console.log("Home updated successfully", result);
        })
        .catch((err) => {
          console.log("Error occurred during editing home details", err);
        });
        res.redirect("/host/home-list");
    })
    
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
