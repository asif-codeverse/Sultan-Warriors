const axios = require('axios');

async function detectEmotionFromBase64(imageBase64) {
    const apiKey = process.env.FACEPLUS_API_KEY;
    const apiSecret = process.env.FACEPLUS_API_SECRET;
    const url = 'https://api-us.faceplusplus.com/facepp/v3/detect';
    
    const formData = new FormData();
    formData.append('image_base64', imageBase64.split(',')[1]); // Remove the base64 header part
    formData.append('api_key', apiKey);
    formData.append('api_secret', apiSecret);
    formData.append('return_attributes', 'emotion');

    try {
        const response = await axios.post(url, formData, {
            headers: formData.getHeaders(),
        });

        const emotions = response.data.faces[0]?.attributes?.emotion;
        if (!emotions) {
            return 'No emotions detected';
        }

        return emotions;  // Return emotions data (anger, happiness, etc.)
    } catch (error) {
        console.error('❌ Error in Face++ API:', error);
        throw new Error('Emotion detection failed');
    }
}

module.exports = { detectEmotionFromBase64 };
