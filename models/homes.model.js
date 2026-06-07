const { ObjectId } = require("mongodb");
const { getDB } = require("../utils/databaseUtil");

module.exports = class Home {
  constructor(_id, name, price, description, imageUrl, location, ratings) {
    if (_id) {
      this._id = _id;
    }
    this.name = name;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this.location = location;
    this.ratings = ratings;
  }

  save() {
    const db = getDB();
    if (this._id) { //update
      const updatedHome = {
        name: this.name,
        price: this.price,
        description: this.description,
        imageUrl: this.imageUrl,
        location: this.location,
        ratings: this.ratings,
      };
      return db
        .collection("homes")
        .updateOne({ _id: new ObjectId(String(this._id)) }, { $set: updatedHome });
    } else { //insert
      return db.collection("homes").insertOne(this);
    }
  }

  static fetchAll() {
    const db = getDB();
    return db.collection("homes").find().toArray();
  }

  static findById(homeId) {
    const db = getDB();
    return db
      .collection("homes")
      .findOne({ _id: new ObjectId(String(homeId)) })
  }

  static deleteById(homeId) {
    const db = getDB();
    return db
      .collection("homes")
      .deleteOne({ _id: new ObjectId(String(homeId)) });
  }
};
