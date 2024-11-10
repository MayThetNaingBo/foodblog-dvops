// Submit Post Function
function submitPost() {
    const restaurantName = document.getElementById("restaurantName").value;
    const location = document.getElementById("location").value;
    const visitDate = document.getElementById("visitDate").value;
    const content = document.getElementById("content").value;
    let imageUrl = document.getElementById("imageUrl").value;
    const rating = document.querySelector(
        'input[name="rating"]:checked'
    )?.value;

    const MIN_CONTENT_LENGTH = 5; // Set minimum word count for feedback section

    // URL Checking
    const urlRegex = /(https?:\/\/|www\.)/i; // Detects URLs starting with http://, https://, or www.

    // Check for empty fields
    if (!restaurantName || !location || !visitDate || !content || !rating) {
        alert("All fields are required!");
        return;
    }

    // Check if restaurant name contains a URL
    if (urlRegex.test(restaurantName)) {
        alert("Restaurant name should not contain URLs.");
        return;
    }

    // Check for minimum feedback section length
    const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
    if (wordCount < MIN_CONTENT_LENGTH) {
        alert(`Feedback must be at least ${MIN_CONTENT_LENGTH} words.`);
        return;
    }

    const feedbackData = {
        restaurantName,
        location,
        visitDate,
        rating,
        content,
        imageUrl,
    };

    fetch("/add-blogpost", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(feedbackData),
    })
        .then((response) => {
            if (!response.ok) {
                return response.text().then((message) => {
                    throw new Error(message);
                });
            }
            return response.json();
        })
        .then((response) => {
            if (response.success) {
                window.location.href = "index.html";
            }
        })
        .catch((error) => {
            alert(error.message); // Display validation error as an alert
            console.error("Error occurred:", error);
        });
}

function cancelPost() {
    window.location.href = "index.html";
}
// Go back to the main page after submitting the post successfully