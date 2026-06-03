const Home = require("../models/homes.model");

exports.getAddHome = (req, res, next) => {
    res.render("host/edit-home", { pageTitle: "Airbnb Add Home" });
}

exports.postAddHome = (req, res, next) => {
    const {price, houseName, ratings, image, location} = req.body;
    const home = new Home(price, houseName, ratings, image, location)
    home.save();
    res.redirect("/host/home-list") 
  }

exports.getHostHomes = (req, res, next)=>{
    Home.fetchAll((registeredHomes) => {
        res.render("host/host-home-list", {registeredHomes, pageTitle: 'Host Homes List'})
    });  
}

exports.getEditHome = (req, res, next) => {
    const editing = req.query.editing === 'true';
    const homeId = req.params.homeId
    Home.findById(homeId, (home)=>{
        if(!home){
            // console.log("home not found for editing")
            return res.redirect("/host/home-list")   
        } 
        // console.log(homeId, editing, home)
        res.render("host/edit-home", {editing, home, pageTitle: 'Edit Your Home'})
    })
}

exports.postEditHome = (req, res, next) => {
    const { homeId, houseName, price, location, ratings, image } = req.body;
    const home = new Home(price, houseName, ratings, image, location)
    home.id = homeId;
    console.log(home)
    home.save();
    res.redirect("/host/home-list")  
}

exports.postDeleteHome = (req, res, next) => {
    const { homeId } = req.params;
    Home.deleteById(homeId, (err)=>{
        if(err){
            console.log('Error while deleting', err);
        }
        res.redirect("/host/home-list")  
    })
}
