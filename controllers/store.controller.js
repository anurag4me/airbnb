const Home = require("../models/homes.model");
const User = require("../models/user.model");
const path = require("path");

exports.getIndex = (req, res, next) => {
  Home.find().then((registeredHomes) => {
    // console.log(registeredHomes)
    res.render("store/index", {
      registeredHomes,
      pageTitle: "Airbnb Home",
      isLoggedIn: req.session.isLoggedIn,
      user: req.session.user,
    });
  });
};

exports.getHomes = (req, res, next) => {
  Home.find().then((registeredHomes) => {
    res.render("store/home-list", {
      registeredHomes,
      pageTitle: "Homes List",
      isLoggedIn: req.session.isLoggedIn,
      user: req.session.user,
    });
  });
};

exports.getBookings = (req, res, next) => {
  res.render("store/bookings", {
    pageTitle: "My Booking",
    isLoggedIn: req.session.isLoggedIn,
    user: req.session.user,
  });
};

exports.getFavouriteList = async (req, res, next) => {
  const userId = req.session.user._id;
  const user = await User.findById(userId).populate('favourites');
  res.render("store/favourite-list", {
    favouriteHomes: user.favourites,
    pageTitle: "My Favourites",
    isLoggedIn: req.session.isLoggedIn,
    user: req.session.user,
  });
};

exports.postAddToFavourite = async (req, res, next) => {
  const homeId = req.body._id;
  const userId = req.session.user._id;
  const user = await User.findById(userId);

  if(!user.favourites.includes(homeId)){
    user.favourites.push(homeId);
    await user.save();
  }

  res.redirect("/favourites");
};

exports.postRemoveFromFavourite = async (req, res, next) => {
  const homeId = req.params.homeId;
  const userId = req.session.user._id;
  const user = await User.findById(userId);

  if(user.favourites.includes(homeId)){
    user.favourites = user.favourites.filter(fav => fav != homeId);
    await user.save();
  }

  res.redirect("/favourites");
};

exports.getHomeDetails = (req, res, next) => {
  const homeId = req.params.homeId;
  Home.findById(homeId).then((home) => {
    // console.log(home)
    res.render("store/home-details", {
      pageTitle: "Home Detail",
      home,
      isLoggedIn: req.session.isLoggedIn,
      user: req.session.user,
    });
  });
};

exports.getHomeRules = async (req, res, next) => {
  const homeId = req.params.homeId;
  const home = await Home.findById(homeId);
  if(!req.session.isLoggedIn) {
    return res.render("store/home-details", {
      pageTitle: "Home Detail",
      home,
      isLoggedIn: req.session.isLoggedIn,
      user: req.session.user,
      errorMessages: ['Please login first to download rules pdf'],
    });
  }
  const filePath = path.join("uploads", "rules", home.rule);
  res.download(filePath, 'Rules.pdf');
}
