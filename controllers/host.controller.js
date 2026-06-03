const Home = require("../models/homes.model");

exports.getAddHome = (req, res, next) => {
    res.render("host/edit-home", { pageTitle: "Airbnb Add Home" });
}

exports.postAddHome = (req, res, next) => {
    const {id, name, price, description, imageUrl, location, ratings} = req.body;
    console.log(req.body)
    const home = new Home(id, name, price, description, imageUrl, location, ratings)
    home.save();
    res.redirect("/host/home-list") 
  }

exports.getHostHomes = (req, res, next)=>{
    Home.fetchAll().then(([registeredHomes])=>{
        res.render("host/host-home-list", {registeredHomes, pageTitle: 'Host Homes List'})
    });  
}

exports.getEditHome = (req, res, next) => {
    const editing = req.query.editing === 'true';
    const homeId = req.params.homeId
    Home.findById(homeId).then(([homes])=>{
        const home = homes[0];
        if(!home){
            // console.log("home not found for editing")
            return res.redirect("/host/home-list")   
        } 
        // console.log(homeId, editing, home)
        res.render("host/edit-home", {editing, home, pageTitle: 'Edit Your Home'})
    })
}

exports.postEditHome = (req, res, next) => {
    const {id, name, price, description, imageUrl, location, ratings} = req.body;
    const home = new Home(id, name, price, description, imageUrl, location, ratings)
    home.save();
    res.redirect("/host/home-list")  
}

exports.postDeleteHome = (req, res, next) => {
  const { homeId } = req.params;
  Home.deleteById(homeId).then(() => {
    res.redirect("/host/home-list");
  }).catch(err => {
    console.error("Error while deleting", err);
  });
};
