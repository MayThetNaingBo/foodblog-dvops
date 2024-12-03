const express = require("express");
const path = require("path");
const fs = require("fs");
const rateLimit = require("express-rate-limit");
const app = express();
const PORT = 3000;

// File path for storing drafts
const draftsFilePath = path.join(__dirname, "drafts.json");

// Ensure the drafts file exists
if (!fs.existsSync(draftsFilePath)) {
    fs.writeFileSync(draftsFilePath, JSON.stringify({}));
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Utility function to save draft to file
function saveDraftToFile(userId, draftData) {
    const drafts = JSON.parse(fs.readFileSync(draftsFilePath));
    drafts[userId] = draftData;
    fs.writeFileSync(draftsFilePath, JSON.stringify(drafts));
}

// Utility function to get a draft from the file
function getDraftFromFile(userId) {
    const drafts = JSON.parse(fs.readFileSync(draftsFilePath));
    return drafts[userId];
}

// Autosave draft API
app.post("/autosave-draft", (req, res) => {
    const { userId, restaurantName, location, visitDate, content, imageUrl } =
        req.body;

    const draftData = {
        restaurantName,
        location,
        visitDate,
        content,
        imageUrl,
        lastSaved: new Date(),
    };

    saveDraftToFile(userId, draftData);
    res.status(200).json({
        success: true,
        message: "Draft autosaved successfully.",
    });
});

app.get("/get-draft/:userId", (req, res) => {
    const { userId } = req.params;
    const draft = getDraftFromFile(userId);

    if (draft) {
        res.status(200).json({ success: true, draft });
    } else {
        res.status(404).json({ success: false, message: "No draft found." });
    }
});

// Rate Limiting (Using express-rate-limit)
const addPostRateLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes window
    max: 3, // Limit each user to 5 requests per 5 minutes
    message: {
        success: false,
        message:
            "You cannot post not more than 3 blogs continuoulsy. Please wait a while before adding more posts.",
    },
});

// Path to your feedback JSON file
const dataFilePath = path.join(__dirname, "utils", "foodblogs.json");

// Ensure the feedback file exists
async function ensureFileExists() {
    if (!fs.existsSync(dataFilePath)) {
        fs.writeFileSync(dataFilePath, JSON.stringify([]));
    }
}

// Load initial data from JSON file
app.get("/initial-data", async (req, res) => {
    try {
        const initialData = JSON.parse(fs.readFileSync(dataFilePath));
        res.json(initialData);
    } catch (error) {
        console.error("Error loading initial data:", error);
        res.status(500).json({ message: "Error loading initial data." });
    }
});

// Add new feedback entry with rate limiting
app.post("/add-blogpost", addPostRateLimiter, async (req, res) => {
    try {
        const allPosts = JSON.parse(fs.readFileSync(dataFilePath));
        const newFeedback = { id: Date.now().toString(), ...req.body };
        allPosts.push(newFeedback);
        fs.writeFileSync(dataFilePath, JSON.stringify(allPosts));
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

// Get all feedback entries
app.get("/get-feedback", async (req, res) => {
    try {
        const allPosts = JSON.parse(fs.readFileSync(dataFilePath));
        res.json(allPosts);
    } catch (error) {
        console.error("Error fetching feedback:", error);
        res.status(500).json({ message: "Error fetching feedback." });
    }
});

// Get specific feedback by ID
app.get("/get-feedback/:id", async (req, res) => {
    try {
        const allPosts = JSON.parse(fs.readFileSync(dataFilePath));
        const feedback = allPosts.find((post) => post.id === req.params.id);
        if (feedback) {
            res.status(200).json(feedback);
        } else {
            res.status(404).json({ message: "Feedback not found." });
        }
    } catch (error) {
        console.error("Error fetching feedback by ID:", error);
        res.status(500).json({ message: "Error fetching feedback by ID." });
    }
});

// Update an existing feedback entry by ID
app.put("/edit-feedback/:id", async (req, res) => {
    try {
        const allPosts = JSON.parse(fs.readFileSync(dataFilePath));
        const index = allPosts.findIndex((post) => post.id === req.params.id);
        if (index !== -1) {
            allPosts[index] = { ...allPosts[index], ...req.body };
            fs.writeFileSync(dataFilePath, JSON.stringify(allPosts));
            res.status(200).json({
                success: true,
                message: "Feedback updated successfully!",
            });
        } else {
            res.status(404).json({ message: "Feedback not found." });
        }
    } catch (error) {
        console.error("Error updating feedback:", error);
        res.status(500).json({ message: "Error updating feedback." });
    }
});

// Delete a feedback entry by ID
app.delete("/delete-feedback/:id", async (req, res) => {
    try {
        const allPosts = JSON.parse(fs.readFileSync(dataFilePath));
        const filteredPosts = allPosts.filter(
            (post) => post.id !== req.params.id
        );
        fs.writeFileSync(dataFilePath, JSON.stringify(filteredPosts));
        res.status(200).json({
            success: true,
            message: "Feedback deleted successfully!",
        });
    } catch (error) {
        console.error("Error deleting feedback:", error);
        res.status(500).json({ message: "Error deleting feedback." });
    }
});

// Start the server
async function startServer() {
    try {
        await ensureFileExists();
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Error ensuring file exists:", error);
    }
}

startServer();
