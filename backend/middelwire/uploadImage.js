const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../images"));
  },
  filename: function ( req, file, cb ) {
    
    cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
  },
} );

const uploadImage = multer({ storage });
module.exports = uploadImage;
