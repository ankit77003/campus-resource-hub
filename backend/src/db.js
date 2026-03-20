const mongoose = require("mongoose");

async function connectDb() {
  const uri = process.env.MONGO_URI;
   console.log("MONGO_URI:", uri);
  if (!uri) throw new Error("Missing MONGO_URI");
  mongoose.set("strictQuery", true);
  await mongoose.connect(uri);
}

module.exports = { connectDb };

