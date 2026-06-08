const Favourite = require("../models/favourite.model");
const Home = require("../models/homes.model");

exports.getIndex = (req, res, next) => {
  Home.find().then((registeredHomes) => {
    // console.log(registeredHomes)
    res.render("store/index", {
      registeredHomes,
      pageTitle: "Airbnb Home",
      isLoggedIn: req.session.isLoggedIn,
    });
  });
};

exports.getHomes = (req, res, next) => {
  Home.find().then((registeredHomes) => {
    res.render("store/home-list", {
      registeredHomes,
      pageTitle: "Homes List",
      isLoggedIn: req.session.isLoggedIn,
    });
  });
};

exports.getBookings = (req, res, next) => {
  res.render("store/bookings", {
    pageTitle: "My Booking",
    isLoggedIn: req.session.isLoggedIn,
  });
};

exports.getFavouriteList = (req, res, next) => {
  Favourite.find()
    .populate("homeId")
    .then((favourites) => {
      const favouriteHomes = favourites.map((fav) => fav.homeId);
      res.render("store/favourite-list", {
        favouriteHomes,
        pageTitle: "My Favourites",
        isLoggedIn: req.session.isLoggedIn,
      });
    });
};

exports.postAddToFavourite = (req, res, next) => {
  const homeId = req.body._id;

  Favourite.findOne({ homeId: homeId })
    .then((existing) => {
      if (!existing) {
        const fav = new Favourite({ homeId });
        return fav.save();
      }
    })
    .then((result) => {
      console.log("Added to favourites", result);
    })
    .catch((err) => {
      console.log("Error while adding to favourites", err);
    })
    .finally(() => {
      res.redirect("/favourites");
    });
};

exports.postRemoveFromFavourite = (req, res, next) => {
  const homeId = req.params.homeId;
  Favourite.findOneAndDelete({ homeId })
    .then((result) => {
      console.log("Removed favourite", result);
    })
    .catch((err) => {
      console.log("Error while removing from favourite", err);
    })
    .finally(() => {
      res.redirect("/favourites");
    });
};

exports.getHomeDetails = (req, res, next) => {
  const homeId = req.params.homeId;
  Home.findById(homeId).then((home) => {
    // console.log(home)
    res.render("store/home-details", {
      pageTitle: "Home Detail",
      home,
      isLoggedIn: req.session.isLoggedIn,
    });
  });
};
