function addFeedback() {
    const restaurantName = document.getElementById("restaurantName").value;
    const location = document.getElementById("location").value;
    const visitDate = document.getElementById("visitDate").value;
    const rating = document.getElementById("rating").value;
    const content = document.getElementById("content").value;
    const imageUrl =
        document.getElementById("imageFile").value || "images/default.jpg";

    const feedbackData = {
        restaurantName,
        location,
        visitDate,
        rating,
        content,
        imageUrl,
    };

    if (!restaurantName || !location || !visitDate || !content) {
        const messageElement = document.getElementById("message");
        messageElement.innerHTML = "All fields are required!";
        messageElement.setAttribute("class", "text-danger");
        return;
    }

    fetch("/add-blogpost", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(feedbackData),
    })
        .then((response) => response.json())
        .then((response) => {
            const messageElement = document.getElementById("message");
            if (response.success) {
                messageElement.innerHTML =
                    "Added Feedback for: " + restaurantName + "!";
                messageElement.setAttribute("class", "text-success");
                document.getElementById("blogPostForm").reset();
                fetchFeedback();
            } else {
                messageElement.innerHTML =
                    response.message || "Unable to add feedback!";
                messageElement.setAttribute("class", "text-danger");
            }
        })
        .catch((error) => {
            const messageElement = document.getElementById("message");
            messageElement.innerHTML =
                "Network error. Unable to connect to server.";
            messageElement.setAttribute("class", "text-danger");
            console.error(
                "Network error occurred while sending feedback:",
                error
            );
        });
}

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

function displayFeedback(feedback) {
    const { restaurantName, location, visitDate, rating, content, imageUrl } = feedback;
    const feedbackCard = document.createElement("div");
    feedbackCard.className = "col-md-4 mb-4";

    // Generate stars based on the rating
    let stars = "Rating: ";
    for (let i = 1; i <= 5; i++) {
        stars += `<span style="color: ${i <= rating ? 'gold' : 'gray'};">&#9733;</span>`;
    }

    feedbackCard.innerHTML = `
        <div class="card h-100">
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
