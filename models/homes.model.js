const db = require("../utils/databaseUtil");

module.exports = class Home {
  constructor(id, name, price, description, imageUrl, location, ratings) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this.location = location;
    this.ratings = ratings;
  }

  save() {
    if (this.id) { //update
      return db.execute(
        "update homes set name=?, price=?, description=?, imageUrl=?, location=?, ratings=? where id = ?",
        [
          this.name,
          this.price,
          this.description,
          this.imageUrl,
          this.location,
          this.ratings,
          this.id,
        ],
      );
    } else {
      return db.execute( // insert
        "insert into homes (name, price, description, imageUrl, location, ratings) values (?, ?, ?, ?, ?, ?)",
        [
          this.name,
          this.price,
          this.description,
          this.imageUrl,
          this.location,
          this.ratings,
        ],
      );
    }
  }

  static fetchAll() {
    return db.execute("select * from homes");
  }

  static findById(homeId) {
    return db.execute("select * from homes where id = ?", [homeId]);
  }

  static deleteById(homeId) {
    return db.execute("delete from homes where id = ?", [homeId]);
  }
};
