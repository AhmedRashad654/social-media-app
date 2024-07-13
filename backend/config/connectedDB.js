const mongoose = require("mongoose");
module.exports = async () => {
  try {
    await mongoose.connect(process.env.MONGOURL).then(() => {
      console.log("connectedDB in instagram");
    });
  } catch (error) {
    console.log(error);
  }
};
