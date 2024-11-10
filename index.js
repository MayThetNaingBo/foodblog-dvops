const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;

const { getPostById, getComments, addComment } = require("./utils/UserComments");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Serve the home page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Get a specific post by ID for detailed view
app.get("/get-post/:id", getPostById);

// Get comments for a specific post
app.get("/get-comments/:id", getComments);

// Add a comment to a specific post
app.post("/add-comment/:id", addComment);

// Start the server
app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});
