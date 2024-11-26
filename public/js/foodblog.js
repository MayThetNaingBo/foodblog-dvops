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
                fetchFeedback(); // Refresh the posts list to show the new entry
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

// Fetch and display all feedback posts
function fetchFeedback() {
    fetch("/get-feedback")
        .then((response) => response.json())
        .then((data) => {
            displayPosts(data); // Use displayPosts to render all feedback
        })
        .catch((error) => console.error("Error fetching feedback:", error));
}

document.addEventListener("DOMContentLoaded", fetchFeedback);
// Function which dynamically displays all feedback posts on the main page
function displayPosts(data) {
    const postsContainer = document.getElementById("blog-posts-container");
    postsContainer.innerHTML = ""; // Clear any existing posts

    data.forEach((post) => {
        const postElement = document.createElement("div");
        postElement.classList.add("col-md-4", "mb-3");
        postElement.id = `post-${post.id}`; // Unique ID for deletion

        const {
            restaurantName,
            location,
            visitDate,
            rating,
            content,
            imageUrl,
        } = post;

        // Generate stars based on the rating
        let stars = "Rating: ";
        for (let i = 1; i <= 5; i++) {
            stars += `<span style="color: ${
                i <= rating ? "gold" : "gray"
            };">&#9733;</span>`;
        }
        function displayFeedback(feedback) {
            const {
                id,
                restaurantName,
                location,
                visitDate,
                rating,
                content,
                imageUrl,
            } = feedback;
            const feedbackCard = document.createElement("div");
            feedbackCard.className = "col-md-4 mb-4";

            // Generate stars based on the rating
            let stars = "Rating: ";
            for (let i = 1; i <= 5; i++) {
                stars += `<span style="color: ${
                    i <= rating ? "gold" : "gray"
                };">&#9733;</span>`;
            }

            feedbackCard.innerHTML = `
                <div class="card h-100">
                    <div  onclick="window.location.href='post.html?id=${post.id}'">
                        <img src="${imageUrl}" class="card-img-top" alt="${restaurantName}">
                        <div class="card-body">
                            <h5 class="card-title">${restaurantName}</h5>
                            <p class="card-text">${content}</p>
                            <div>${stars}</div>
                            <small class="text-muted">Location: ${location} | Date: ${visitDate}</small>   
                        </div>
                    </div>
                    <div class="mb-2">
                        <button class="btn btn-warning" onclick="editFeedback('${post.id}')">Update</button>
                        <button class="btn btn-danger" onclick="deleteFeedback('${post.id}')">Delete</button>
                    </div>
                </div>
    `;

            document
                .getElementById("blog-posts-container")
                .appendChild(feedbackCard);
        }

        postElement.innerHTML = `
             <div class="card h-100">
                    <div  onclick="window.location.href='post.html?id=${post.id}'">
                        <img src="${imageUrl}" class="card-img-top" alt="${restaurantName}">
                        <div class="card-body">
                            <h5 class="card-title">${restaurantName}</h5>
                            <p class="card-text">${content}</p>
                            <div>${stars}</div>
                            <small class="text-muted">Location: ${location} | Date: ${visitDate}</small>   
                        </div>
                    </div>
                    <div class="mb-2 ml-3">
                        <button class="btn btn-warning" onclick="editFeedback('${post.id}')">Update</button>
                        <button class="btn btn-danger" onclick="deleteFeedback('${post.id}')">Delete</button>
                    </div>
            </div>
        `;

        postsContainer.appendChild(postElement);
    });
}

// Function to delete feedback
// Call fetchFeedback when the page loads to display the posts initially
document.addEventListener("DOMContentLoaded", fetchFeedback);

function displayFeedback(feedback) {
    const {
        id,
        restaurantName,
        location,
        visitDate,
        rating,
        content,
        imageUrl,
    } = feedback;
    const feedbackCard = document.createElement("div");
    feedbackCard.className = "col-md-4 mb-4";

    // Generate stars based on the rating
    let stars = "Rating: ";
    for (let i = 1; i <= 5; i++) {
        stars += `<span style="color: ${
            i <= rating ? "gold" : "gray"
        };">&#9733;</span>`;
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
document.addEventListener("DOMContentLoaded", fetchFeedback);
