const express = require("express");
const path = require("path");
const app = express();
<<<<<<< HEAD
const PORT = process.env.PORT || 3000;

const { getPostById, getComments, addComment } = require("./utils/UserComments");
=======
const PORT = 3000;
const {
    addFeedback,
    getFeedback,
    ensureFileExists,
    readJSON,
} = require("./utils/FoodblogUtil");

const dataFilePath = path.join(__dirname, "utils", "foodblogs.json");
>>>>>>> 6a2e7d7df84258af01d7298924bc747269776a74

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
