const express = require("express");
const path = require("path");
const app = express();
const PORT = 3000;
const {
    addFeedback,
    getFeedback,
    ensureFileExists,
    readJSON,
} = require("./utils/FoodblogUtil");

const {
    getPostById,
    getComments,
    addComment,

} = require("./utils/UserComments");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

async function startServer() {
    try {
        await ensureFileExists();
        const server = app.listen(PORT, function () {
            const address = server.address();
            const baseUrl = `http://${
                address.address === "::" ? "localhost" : address.address
            }:${address.port}`;
            console.log(`Server started at: ${baseUrl}`);
        });
    } catch (error) {
        console.error("Error ensuring file exists:", error);
    }
}

// Route to serve the home page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Route to get feedback (all posts)
app.get("/get-feedback", (req, res) => {
    getFeedback(req, res).catch((error) => {
        console.error("Error fetching feedback:", error);
        res.status(500).json({ message: "Error fetching feedback." });
    });
});

// Route to get initial data for posts
app.get("/initial-data", async (req, res) => {
    try {
        const initialData = await readJSON(path.join(__dirname, "utils", "foodblogs.json"));
        res.json(initialData);
    } catch (error) {
        console.error("Error loading initial data:", error);
        res.status(500).json({ message: "Error loading initial data." });
    }
});

// Route to add a new blog post
app.post("/add-blogpost", (req, res) => {
    addFeedback(req, res).catch((error) => {
        console.error("Error adding feedback:", error);
        res.status(500).json({ message: "Error adding feedback." });
    });
});

// Route to get a specific post by ID for detailed view
app.get("/get-post/:id", getPostById);

// Route to get comments for a specific post
app.get("/get-comments/:id", getComments);

// Route to add a comment to a specific post
app.post("/add-comment/:id", addComment);

// Route to edit a comment on a specific post

startServer();

module.exports = { app };
