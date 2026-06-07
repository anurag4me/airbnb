const Favourite = require("../models/favourite.model");
const Home = require("../models/homes.model");

exports.getIndex = (req, res, next) => {
  Home.fetchAll().then((registeredHomes) => {
    // console.log(registeredHomes)
    res.render("store/index", { registeredHomes, pageTitle: "Airbnb Home" });
  });
};

exports.getHomes = (req, res, next) => {
  Home.fetchAll().then((registeredHomes) => {
    res.render("store/home-list", { registeredHomes, pageTitle: "Homes List" });
  });
};

exports.getBookings = (req, res, next) => {
  res.render("store/bookings", { pageTitle: "My Booking" });
};

exports.getFavouriteList = (req, res, next) => {
  Favourite.getFavourites().then((favourites) => {
    Home.fetchAll().then(homes => {
      const favouriteHomes = homes.filter(home =>
        favourites.find(fav => fav.homeId == home._id),
      );
      res.render("store/favourite-list", { favouriteHomes, pageTitle: "My Favourites",
      });
    });
  });
};

exports.postAddToFavourite = (req, res, next) => {
  const homeId = req.body._id;
  const favourite = new Favourite(homeId);

  favourite
    .save()
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
  Favourite.deleteFavourite(homeId)
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
    res.render("store/home-details", { pageTitle: "Home Detail", home });
  });
};
