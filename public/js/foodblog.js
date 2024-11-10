// Add feedback function
function addFeedback() {
    const restaurantName = document.getElementById("restaurantName").value;
    const location = document.getElementById("location").value;
    const visitDate = document.getElementById("visitDate").value;
    const rating = document.getElementById("rating").value;
    const content = document.getElementById("content").value;
    const imageUrl =
        document.getElementById("imageFile").value || "images/NoImage.jpg";

    const feedbackData = {
        restaurantName,
        location,
        visitDate,
        rating,
        content,
        imageUrl,
    };

    if (!restaurantName || !location || !visitDate || !content) {
        alert("All fields are required!");
        return;
    }

    fetch("/add-blogpost", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(feedbackData),
    })
        .then((response) => response.json())
        .then((response) => {
            if (response.success) {
                alert("Added Feedback for: " + restaurantName + "!");
                document.getElementById("blogPostForm").reset();
                fetchFeedback();
            } else {
                alert(response.message || "Unable to add feedback!");
            }
        })
        .catch((error) => {
            alert("Network error. Unable to connect to server.");
            console.error(
                "Network error occurred while sending feedback:",
                error
            );
        });
}

// Fetch the Feedback
function fetchFeedback() {
    fetch("/initial-data")
        .then((response) => response.json())
        .then((data) => {
            const feedbackContainer = document.getElementById(
                "blog-posts-container"
            );
            feedbackContainer.innerHTML = "";
            data.forEach((feedback) => displayFeedback(feedback));
        })
        .catch((error) => console.error("Error loading feedback:", error));
}

document.addEventListener("DOMContentLoaded", fetchFeedback);

// Function which displays the feedback on the main page when successful
function displayFeedback(feedback) {
    const { id, restaurantName, location, visitDate, rating, content, imageUrl } = feedback;
    const feedbackCard = document.createElement("div");
    feedbackCard.className = "col-md-4 mb-4";

    // Generate stars based on the rating
    let stars = "Rating: ";
    for (let i = 1; i <= 5; i++) {
        stars += `<span style="color: ${i <= rating ? "gold" : "gray"};">&#9733;</span>`;
    }

    feedbackCard.innerHTML = `
        <div class="card h-100" onclick="window.location.href='post.html?id=${id}'">
            <img src="${imageUrl}" class="card-img-top" alt="${restaurantName}">
            <div class="card-body">
                <h5 class="card-title">${restaurantName}</h5>
                <p class="card-text">${content}</p>
                <div>${stars}</div>
                <small class="text-muted">Location: ${location} | Date: ${visitDate}</small>
            </div>
        </div>
    `;

    document.getElementById("blog-posts-container").appendChild(feedbackCard);
}

// Fetch and display feedback posts on page load
document.addEventListener("DOMContentLoaded", fetchFeedback);