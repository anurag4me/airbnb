const fs = require("fs");
const path = require("path");
const rootDir = require("../utils/pathUtil");
const Favourite = require("./favourite.model");

const filePath = path.join(rootDir, "data", "homes.json");

module.exports = class Home {
  constructor(price, houseName, ratings, image, location) {
    this.houseName = houseName;
    this.price = price;
    this.location = location;
    this.ratings = ratings;
    this.image = image;
  }

  save() {
    Home.fetchAll((registeredHomes) => {
      if (this.id) {
        registeredHomes = registeredHomes.map((home) =>
          home.id === this.id ? this : home,
        );
      } else {
        this.id = parseInt(Math.random() * 1000).toString();
        registeredHomes.push(this);
      }
      fs.writeFile(filePath, JSON.stringify(registeredHomes), (err) => {
        // console.log("File writing concluded", err);
      });
    });
  }

  static fetchAll(callback) {
    const data = fs.readFile(filePath, "utf8", (err, data) => {
      // console.log('File read: ', err, data)
      callback(!err ? JSON.parse(data) : []);
    });
  }

  static findById(homeId, callback) {
    this.fetchAll((homes) => {
      const homeFound = homes.find((home) => home.id === homeId);
      callback(homeFound);
    });
  }

  static deleteById(homeId, callback) {
    this.fetchAll((homes) => {
      homes = homes.filter((home) => home.id != homeId);
      fs.writeFile(filePath, JSON.stringify(homes), err => {
        Favourite.deleteFavourite(homeId, callback)
      })
    });
  }
};
