document.addEventListener('DOMContentLoaded', function () {
    const webcam = document.getElementById('webcam');
    const canvas = document.getElementById('canvas');
    const captureButton = document.getElementById('captureButton');
    const emotionResult = document.getElementById('emotionResult');

    // Check for required elements
    if (!webcam || !canvas || !captureButton || !emotionResult) {
        console.error("❌ Essential elements not found in the DOM");
        return;
    }

    const ctx = canvas.getContext('2d');

    // Start the webcam stream
    function startWebcam() {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {
                webcam.srcObject = stream;
            })
            .catch(error => {
                console.error("❌ Webcam error:", error);
                emotionResult.textContent = "❌ Error accessing webcam.";
            });
    }

    // Convert canvas to base64
    function getBase64Image() {
        return canvas.toDataURL('image/jpeg', 1.0); // Quality 100%
    }

    // Send base64 image to backend
    async function detectEmotion(base64Image) {
        try {
            const response = await fetch('/api/emotion', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ imageBase64: base64Image })
            });

            if (!response.ok) throw new Error("Failed to get emotion");

            const data = await response.json();
            emotionResult.textContent = `🧠 Emotion Detected: ${data.emotionData}`;
        } catch (err) {
            console.error("❌ Emotion detection error:", err.message);
            emotionResult.textContent = "❌ Could not detect emotion.";
        }
    }

    // Capture image and process
    function captureImage() {
        if (webcam.videoWidth && webcam.videoHeight) {
            canvas.width = webcam.videoWidth;
            canvas.height = webcam.videoHeight;
            ctx.drawImage(webcam, 0, 0, canvas.width, canvas.height);

            const base64Image = getBase64Image();
            detectEmotion(base64Image);
        } else {
            emotionResult.textContent = "❌ Webcam not ready.";
        }
    }

    // Start everything
    startWebcam();
    captureButton.addEventListener('click', captureImage);
});
