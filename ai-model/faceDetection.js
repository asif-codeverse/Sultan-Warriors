const axios = require("axios");
require("dotenv").config();

const FACEPP_API_KEY = process.env.FACEPP_API_KEY;
const FACEPP_API_SECRET = process.env.FACEPP_API_SECRET;
const FACEPP_URL = "https://api-us.faceplusplus.com/facepp/v3/detect";

async function detectEmotions(imageBase64) {
  try {
    const response = await axios.post(FACEPP_URL, null, {
      params: {
        api_key: FACEPP_API_KEY,
        api_secret: FACEPP_API_SECRET,
        image_base64: imageBase64,
        return_attributes: "emotion",
      },
    });

    const emotions = response.data.faces[0]?.attributes?.emotion;
    return emotions || {};
  } catch (error) {
    console.error("❌ Error detecting emotions:", error.message);
    return {};
  }
}

module.exports = detectEmotions;

