function addBlogPost() {
    var response = "";
    var jsonData = {};
    jsonData.title = document.getElementById("title").value;
    jsonData.content = document.getElementById("content").value;
    jsonData.author = document.getElementById("author").value;
    jsonData.imageUrl = document.getElementById("imageUrl").value;

    // Check if required fields are filled
    if (
        jsonData.title === "" ||
        jsonData.content === "" ||
        jsonData.author === "" ||
        jsonData.imageUrl === ""
    ) {
        document.getElementById("message").innerHTML =
            "All fields are required!";
        document.getElementById("message").setAttribute("class", "text-danger");
        return;
    }

    // Perform a POST request to add the blog post
    var request = new XMLHttpRequest();
    request.open("POST", "/add-blog-post", true);
    request.setRequestHeader("Content-Type", "application/json");
    request.onload = function () {
        response = JSON.parse(request.responseText);
        console.log(response);

        if (response.message === undefined) {
            // Successfully added the blog post
            document.getElementById("message").innerHTML =
                "Added Blog Post: " + jsonData.title + "!";
            document
                .getElementById("message")
                .setAttribute("class", "text-success");

            // Clear input fields
            document.getElementById("title").value = "";
            document.getElementById("content").value = "";
            document.getElementById("author").value = "";
            document.getElementById("imageUrl").value = "";

            // Redirect or refresh the blog posts section
            window.location.href = "index.html";
        } else {
            // Handle failure in adding the blog post
            document.getElementById("message").innerHTML =
                "Unable to add blog post!";
            document
                .getElementById("message")
                .setAttribute("class", "text-danger");
        }
    };

    // Send the blog post data as JSON
    request.send(JSON.stringify(jsonData));
}
