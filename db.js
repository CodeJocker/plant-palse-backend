const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/hangaTech");
    console.log("connected to database");
  } catch (err) {
    console.log(err);
  }
};

module.exports = connectDb;
