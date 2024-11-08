function addFeedback() {

    // Collect input data
    const restaurantName = document.getElementById("restaurantName").value;
    const location = document.getElementById("location").value;
    const visitDate = document.getElementById("visitDate").value;
    const rating = document.getElementById("rating").value;
    const content = document.getElementById("content").value;
    const imageUrl =
        document.getElementById("imageFile").value || "images/default.jpg"; // Use a default image if none is provided

    // Create a JSON object to send
    const feedbackData = {
        restaurantName,
        location,
        visitDate,
        rating,
        content,
        imageUrl,
    };

    // Validate required fields
    if (!restaurantName || !location || !visitDate || !content) {
        const messageElement = document.getElementById("message");
        messageElement.innerHTML = "All fields are required!";
        messageElement.setAttribute("class", "text-danger");
        return;
    }

    // Perform a POST request to add the feedback to the server
    fetch("/add-blogpost", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(feedbackData),
    })
        .then((response) => response.json())
        .then((response) => {
            const messageElement = document.getElementById("message");
            if (response.success) {
                messageElement.innerHTML =
                    "Added Feedback for: " + restaurantName + "!";
                messageElement.setAttribute("class", "text-success");

                // Clear input fields
                document.getElementById("blogPostForm").reset();

                // Refresh the feedback section
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
            let feedbackContainer = document.getElementById(
                "blog-posts-container"
            );
            feedbackContainer.innerHTML = "";
            data.forEach((feedback) => {
                displayFeedback(feedback);
            });
        })
        .catch((error) => console.error("Error loading feedback:", error));
}
document.addEventListener("DOMContentLoaded", function () {
    fetchFeedback(); // Load initial feedback when the page loads
});
=======
    var response = "";
    var formData = new FormData();

    // Collect input data
    formData.append(
        "restaurantName",
        document.getElementById("restaurantName").value
    );
    formData.append("location", document.getElementById("location").value);
    formData.append("visitDate", document.getElementById("visitDate").value);
    formData.append("rating", document.getElementById("rating").value);
    formData.append("feedback", document.getElementById("content").value);
    var imageFile = document.getElementById("imageFile").files[0];
    if (imageFile) {
        formData.append("imageFile", imageFile);
    }

    // Check if required fields are filled
    if (
        formData.get("restaurantName") === "" ||
        formData.get("location") === "" ||
        formData.get("visitDate") === "" ||
        formData.get("rating") === "" ||
        formData.get("feedback") === ""
    ) {
        document.getElementById("message").innerHTML =
            "All fields are required!";
        document.getElementById("message").setAttribute("class", "text-danger");
        return;
    }

    // Perform a POST request to add the feedback
    var request = new XMLHttpRequest();
    request.open("POST", "/add-blogpost", true);

    // No need to set `Content-Type` here, as `FormData` handles it automatically.
    request.onload = function () {
        response = JSON.parse(request.responseText);
        console.log(response);

        if (response.success) {
            // Successfully added the feedback
            document.getElementById("message").innerHTML =
                "Added Feedback for: " + formData.get("restaurantName") + "!";
            document
                .getElementById("message")
                .setAttribute("class", "text-success");

            // Clear input fields
            document.getElementById("restaurantName").value = "";
            document.getElementById("location").value = "";
            document.getElementById("visitDate").value = "";
            document.getElementById("rating").value = "";
            document.getElementById("content").value = "";
            document.getElementById("imageFile").value = "";

            // Redirect or refresh the feedback section
            window.location.href = "index.html";
        } else {
            // Handle failure in adding feedback
            document.getElementById("message").innerHTML =
                "Unable to add feedback!";
            document
                .getElementById("message")
                .setAttribute("class", "text-danger");
        }
    };

// Function to display a single feedback entry
function displayFeedback(feedback) {
    const { restaurantName, location, visitDate, rating, content, imageUrl } =
        feedback;
    const feedbackCard = document.createElement("div");
    feedbackCard.className = "col-md-4 mb-4";
    feedbackCard.innerHTML = `
        <div class="card h-100" style="cursor: pointer;">
            <img src="${imageUrl}" class="card-img-top" alt="${restaurantName}">
            <div class="card-body">
                <h5 class="card-title">${restaurantName}</h5>
                <p class="card-text">${content.slice(0, 50)}...</p>
                <small class="text-muted">Location: ${location} | Rating: ${rating} Stars</small>
            </div>
        </div>
    `;
    feedbackCard.addEventListener("click", function () {
        viewFeedback(
            restaurantName,
            location,
            visitDate,
            rating,
            content,
            imageUrl
        );
    });
    document.getElementById("blog-posts-container").appendChild(feedbackCard);
}
