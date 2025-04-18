// emotionDetection.js

const video = document.getElementById('video'); 
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const captureButton = document.getElementById('captureButton');
const emotionResult = document.getElementById('emotionResult');

// Initialize webcam feed
async function startWebcam() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
    } catch (err) {
        console.error('Error accessing webcam:', err);
    }
}

// Capture frame on button click
captureButton.addEventListener('click', captureFrame);

function captureFrame() {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Convert canvas to base64
    const imageBase64 = canvas.toDataURL('image/jpeg');
    sendFrameToServer(imageBase64);
}

// Send the base64 image to the backend
async function sendFrameToServer(imageBase64) {
    try {
        const response = await fetch('/api/emotion', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ imageBase64 }),
        });

        const data = await response.json();
        emotionResult.textContent = `Detected Emotion: ${data.emotionData || 'None'}`;
    } catch (error) {
        console.error('Error sending frame to server:', error);
        emotionResult.textContent = 'Error in detection.';
    }
}

// Start the webcam feed when the page loads
startWebcam();
