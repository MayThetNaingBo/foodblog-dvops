const express = require("express");
const path = require("path");
const app = express();
const PORT = 3000;

// Import functions from utility files

const {
    updateFeedback,
    deleteFeedback,
    getFeedbackById,
    ensureFileExists,
    readJSON,
    writeJSON,
} = require("./utils/UpdateDeleteFeedbackUtil");

const {
    getPostById,
    getComments,
    addComment,
    // Added missing imports for edit and delete comments
} = require("./utils/UserComments");

const dataFilePath = path.join(__dirname, "utils", "foodblogs.json");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Ensure the file exists and start the server
async function startServer() {
    try {
        await ensureFileExists(); // Ensure the feedback file is created if not present
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

// Serve the main HTML file
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Get all feedback entries
app.get("/get-feedback", async (req, res) => {
    try {
        const allPosts = await readJSON(dataFilePath);
        res.json(allPosts);
    } catch (error) {
        console.error("Error fetching feedback:", error);
        res.status(500).json({ message: "Error fetching feedback." });
    }
});

// Load initial data from JSON file
app.get("/initial-data", async (req, res) => {
    try {
        const initialData = await readJSON(dataFilePath);
        res.json(initialData);
    } catch (error) {
        console.error("Error loading initial data:", error);
        res.status(500).json({ message: "Error loading initial data." });
    }
});

// Add new feedback entry
app.post("/add-blogpost", async (req, res) => {
    try {
        const allPosts = await readJSON(dataFilePath);
        const newFeedback = { id: Date.now().toString(), ...req.body };
        allPosts.push(newFeedback);
        await writeJSON(allPosts, dataFilePath);
        res.status(201).json({
            success: true,
            message: "Feedback added successfully!",
            newFeedback,
        });
    } catch (error) {
        console.error("Error adding feedback:", error);
        res.status(500).json({ message: "Error adding feedback." });
    }
});

// Get specific feedback by ID for editing
app.get("/get-feedback/:id", async (req, res) => {
    try {
        await getFeedbackById(req, res);
    } catch (error) {
        console.error("Error fetching feedback by ID:", error);
        res.status(500).json({ message: "Error fetching feedback by ID." });
    }
});

// Update an existing feedback entry by ID
app.put("/edit-feedback/:id", async (req, res) => {
    try {
        await updateFeedback(req, res);
    } catch (error) {
        console.error("Error updating feedback:", error);
        res.status(500).json({ message: "Error updating feedback." });
    }
});

// Delete a feedback entry by ID
app.delete("/delete-feedback/:id", async (req, res) => {
    try {
        await deleteFeedback(req, res);
    } catch (error) {
        console.error("Error deleting feedback:", error);
        res.status(500).json({ message: "Error deleting feedback." });
    }
});

// Route to get a specific post by ID for detailed view
app.get("/get-post/:id", getPostById);

// Route to get comments for a specific post
app.get("/get-comments/:id", getComments);

// Route to add a comment to a specific post
app.post("/add-comment/:id", addComment);

// Start the server
startServer();

module.exports = { app };
