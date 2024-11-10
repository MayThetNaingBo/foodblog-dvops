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

    if (!restaurantName || !location || !visitDate || !content || !rating) {
        alert("All fields are required!");
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