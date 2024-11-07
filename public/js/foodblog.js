document.addEventListener("DOMContentLoaded", function () {
    fetchFeedback();
});

function fetchFeedback() {
    fetch("/initial-data")
        .then((response) => response.json())
        .then((data) => {
            let feedbackContainer =
                document.getElementById("feedback-container");
            feedbackContainer.innerHTML = "";
            data.forEach((feedback) => {
                let feedbackDiv = document.createElement("div");
                feedbackDiv.classList.add("feedback-item");
                feedbackDiv.innerHTML = `<h3>${feedback.restaurantName}</h3>
                                         <p>${feedback.location} - ${feedback.visitDate}</p>
                                         <p>Rating: ${feedback.rating}</p>
                                         <p>${feedback.content}</p>
                                         <img src="${feedback.imageUrl}" alt="Image of ${feedback.restaurantName}">`;
                feedbackContainer.appendChild(feedbackDiv);
            });
        })
        .catch((error) => console.error("Error loading feedback:", error));
}
function addFeedback() {
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

    // Send the feedback data as FormData
    request.send(formData);
}
