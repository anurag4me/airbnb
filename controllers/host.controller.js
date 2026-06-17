const path = require("path");
const Home = require("../models/homes.model");
const fs = require("fs")

exports.getAddHome = (req, res, next) => {
  res.render("host/edit-home", {
    pageTitle: "Airbnb Add Home",
    isLoggedIn: req.session.isLoggedIn,
    user: req.session.user,
  });
};

exports.postAddHome = async (req, res, next) => {
  try {
    const {
      _id,
      name,
      price,
      description,
      location,
      ratings
    } = req.body;

    const home = new Home({
      name,
      price,
      description,
      photo: req.files.photo?.[0].filename || null,
      rule: req.files.rule?.[0]?.filename || null,
      location,
      ratings
    });

    let result = await home.save();

    const pdfFile = req.files.rule?.[0];

    if (pdfFile) {
      const newFileName = `${home._id}.pdf`;

      await fs.promises.rename(
        pdfFile.path,
        path.join('uploads', 'rules', newFileName)
      );

      home.rule = newFileName;
      result = await home.save();
    }

    console.log("Home saved successfully", result);

    res.redirect("/host/home-list");
  } catch (err) {
    console.log(err);
    next(err);
  }
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

exports.postEditHome = async (req, res, next) => {
  try {
    const {
      _id,
      name,
      price,
      description,
      location,
      ratings
    } = req.body;

    const home = await Home.findById(_id);

    if (!home) {
      return res.status(404).send("Home not found");
    }

    home.name = name;
    home.price = price;
    home.description = description;
    home.location = location;
    home.ratings = ratings;

    // PHOTO UPDATE
    const newPhoto = req.files?.photo?.[0];

    if (newPhoto) {
      if (home.photo) {
        const oldPhotoPath = path.join(
          "uploads",
          "homes",
          home.photo
        );

        fs.unlink(oldPhotoPath, (err) => {
          if (err) {
            console.log("Error deleting old photo:", err);
          }
        });
      }

      home.photo = newPhoto.filename;
    }

    // RULE PDF UPDATE
    const newRule = req.files?.rule?.[0];

    if (newRule) {
      const pdfName = `${home._id}.pdf`;

      const targetPath = path.join(
        "uploads",
        "rules",
        pdfName
      );

      if(fs.existsSync(targetPath)){
        await fs.promises.unlink(targetPath);
      }

      await fs.promises.rename( newRule.path, targetPath);

      home.rule = pdfName;
    }

    const result = await home.save();

    console.log("Home updated successfully", result);

    res.redirect("/host/home-list");
  } catch (err) {
    console.log(err);
    next(err);
  }
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
