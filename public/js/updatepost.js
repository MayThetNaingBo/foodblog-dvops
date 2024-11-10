// Retrieve and populate form data on update.html page load
document.addEventListener("DOMContentLoaded", () => {
    const feedbackData = JSON.parse(localStorage.getItem("feedbackToUpdate"));
    if (feedbackData) {
        document.getElementById("restaurantName").value =
            feedbackData.restaurantName || "";
        document.getElementById("location").value = feedbackData.location || "";
        document.getElementById("visitDate").value =
            feedbackData.visitDate || "";
        document.getElementById("rating").value = feedbackData.rating || "";
        document.getElementById("content").value = feedbackData.content || "";
        document.getElementById("imageFile").value =
            feedbackData.imageUrl || "";
        localStorage.setItem("feedbackIdToUpdate", feedbackData.id);
    } else {
        console.error("No feedback data found in localStorage.");
    }
});

// Update feedback function
function updateFeedback() {
    const feedbackId = localStorage.getItem("feedbackIdToUpdate"); // Retrieve ID
    const feedbackData = {
        restaurantName: document.getElementById("restaurantName").value,
        location: document.getElementById("location").value,
        visitDate: document.getElementById("visitDate").value,
        rating: document.getElementById("rating").value,
        content: document.getElementById("content").value,
        imageUrl: document.getElementById("imageFile").value,
    };

    fetch(`/edit-feedback/${feedbackId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(feedbackData),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.message === "Feedback modified successfully!") {
                alert("Feedback updated successfully!");
                window.location.href = "index.html"; // Redirect to main page
            } else {
                alert("Failed to update feedback!");
            }
        })
        .catch((error) => console.error("Error updating feedback:", error));
}

// Cancel function to return to the main page without saving changes
function cancelPost() {
    window.location.href = "index.html";
}
