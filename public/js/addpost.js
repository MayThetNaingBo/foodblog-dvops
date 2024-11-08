function submitPost() {
    const restaurantName = document.getElementById("restaurantName").value;
    const location = document.getElementById("location").value;
    const visitDate = document.getElementById("visitDate").value;
    const content = document.getElementById("content").value;
    const imageUrl = document.getElementById("imageUrl").value;
    const rating = document.querySelector(
        'input[name="rating"]:checked'
    )?.value; // Get selected rating

    // Validation to check if all fields are filled
    if (
        !restaurantName ||
        !location ||
        !visitDate ||
        !content ||
        !imageUrl ||
        !rating
    ) {
        const messageElement = document.getElementById("message");
        messageElement.innerHTML = "All fields are required!";
        messageElement.setAttribute("class", "text-danger");
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
        .then((response) => response.json())
        .then((response) => {
            if (response.success) {
                // Redirect to the main page after successful submission
                window.location.href = "index.html";
            } else {
                const messageElement = document.getElementById("message");
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

function cancelPost() {
    // Redirect back to the main page
    window.location.href = "index.html";
}
