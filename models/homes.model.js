const mongoose = require("mongoose");

const homeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  ratings: {
    type: Number,
    required: true,
  },
  imageUrl: String,
  description: String,
})

// homeSchema.pre('findOneAndDelete', async function(next){
//   const homeId = this.getQuery()._id;
//   await Favourite.deleteMany({homeId});
//   next();
// })

module.exports = mongoose.model("Home", homeSchema)