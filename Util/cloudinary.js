const cloudinary = require("cloudinary");
const fs = require("fs");
cloudinary.config({
  cloud_name: "dfyxnv967",
  api_key: "884685519523628",
  api_secret: "UoqGFzjyk_ru3hiY-Ui-K-__lv0",
  secure: true,
});

const newCloud = async (filePath, folder = "Scarlett Marque") => {
  try {
    const upload = await cloudinary.uploader.upload(filePath, {
      folder: folder,
      quality: "auto:good",
      fetch_format: "auto",
      transformation: [{ width: 800, height: 800, crop: "limit" }],
    });

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    return { url: upload.secure_url, public_id: upload.public_id };
  } catch (err) {
    console.log(err);
  }
};
module.exports = { newCloud };
