const mongoose = require("mongoose");
require('dotenv').config()
module.exports = () => {
  return mongoose.connect(
    `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.jbzqoag.mongodb.net/${process.env.MONGO_DB_NAME}`
  );
};
