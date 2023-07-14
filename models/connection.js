const mongoose = require("mongoose");

const connectionString = process.env.CONNECTION_STRING;

module.exports = connectionString; // Do not edit/remove this line

mongoose
  .connect(connectionString, { connectTimeoutMS: 2000 })
  .then(() => console.log("Database connected"))
  .catch((error) => console.error(error));