const Favourite = require("../models/favourite.model");
const Home = require("../models/homes.model");


exports.getIndex = (req, res, next)=>{
    Home.fetchAll().then(([registeredHomes])=>{
        // console.log(registeredHomes)
        res.render("store/index", {registeredHomes, pageTitle: 'Airbnb Home'})
    });  
}

exports.getHomes = (req, res, next)=>{
    Home.fetchAll().then(([registeredHomes])=>{
        res.render("store/home-list", {registeredHomes, pageTitle: 'Homes List'})
    })    
}

exports.getBookings = (req, res, next) => {
    res.render("store/bookings", {pageTitle: 'My Booking'})
}

exports.getFavouriteList = (req, res, next) => {
    Favourite.getFavourites(favourites=>{
        Home.fetchAll().then(([homes])=>{
            const favouriteHomes = favourites.map(homeId => homes.find(home=>home.id === homeId)).reverse()
            res.render("store/favourite-list", { favouriteHomes, pageTitle: "My Favourites"})
        })
    })  
}

exports.postAddToFavourite = (req, res, next) => {
    const homeId = req.body.id;
    Favourite.addToFavourite(homeId, (err)=>{
        if(err) {
            console.log("Error while marking favourite", err)
        }
        res.redirect("/favourites");
    })
}

exports.postRemoveFromFavourite = (req, res, next) => {
    const homeId = req.params.homeId;
    Favourite.deleteFavourite(homeId, err => {
        if(err) {
            console.log("Error while removing from favourite", err)
        }
        res.redirect("/favourites");
    })
}


exports.getHomeDetails = (req, res, next) => {
    const homeId = req.params.homeId;
    Home.findById(homeId).then(([homes])=>{
        const home = homes[0];
        // console.log(home)
        res.render("store/home-details", {pageTitle:"Home Detail", home})
    })
}
