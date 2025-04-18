console.log("📦 MindMend Dashboard Loaded");

// Example of form submission handling (e.g., adding mood or booking appointment)
document.querySelector('form').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent page reload on form submission

    // Collect form data
    const formData = new FormData(event.target);
    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });

    try {
        // Make POST request to the server with form data
        const response = await fetch('/add-mood', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            alert('Mood recorded successfully!');
        } else {
            alert('Failed to record mood');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while submitting your data.');
    }
});
