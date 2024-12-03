const express = require("express");
const path = require("path");
const rateLimit = require("express-rate-limit");

// Import utilities from FoodblogUtil and UpdateDeleteFeedbackUtil
const {
    ensureFileExists,
    autosaveDraft,
    fetchDraft,
    saveDraftToFile, // Included saveDraftToFile
    getDraftFromFile, // Included getDraftFromFile
    addFeedback,
} = require("../foodblog-dvops/utils/FoodblogUtil");

const {
    getFeedback,
    getFeedbackById,
    updateFeedback,
    deleteFeedback,
} = require("../foodblog-dvops/utils/UpdateDeleteFeedbackUtil");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// File paths
const draftsFilePath = path.join(__dirname, "utils", "drafts.json");
const dataFilePath = path.join(__dirname, "utils", "foodblogs.json");

// Rate Limiting for adding blog posts
const addPostRateLimiter = rateLimit({
    windowMs: 3 * 60 * 1000, // 3 minutes window
    max: 3, // Limit each user to 3 requests per 3 minutes
    message: {
        success: false,
        message:
            "You have exceeded the maximum limit of 3 posts within 3 minutes. Please wait before posting again.",
    },
});

// Routes

// Draft Management Routes
app.post("/autosave-draft", autosaveDraft); // Autosave a draft
app.get("/get-draft/:userId", fetchDraft); // Fetch a saved draft by userId

// API to manually save a draft to file
app.post("/save-draft", async (req, res) => {
    try {
        const { userId, draftData } = req.body;
        await saveDraftToFile(userId, draftData);
        res.status(200).json({
            success: true,
            message: "Draft saved successfully.",
        });
    } catch (error) {
        console.error("Error saving draft to file:", error);
        res.status(500).json({
            success: false,
            message: "Error saving draft.",
        });
    }
});

// API to fetch a draft manually from file
app.get("/fetch-draft/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;
        const draft = await getDraftFromFile(userId);
        if (draft) {
            res.status(200).json({ success: true, draft });
        } else {
            res.status(404).json({
                success: false,
                message: "No draft found.",
            });
        }
    } catch (error) {
        console.error("Error fetching draft from file:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching draft.",
        });
    }
});

// Feedback Management Routes
// Feedback Management Routes
app.post("/add-blogpost", addPostRateLimiter, addFeedback); // Add new feedback
app.get("/get-feedback", getFeedback); // Get all feedback
app.get("/get-feedback/:id", getFeedbackById); // Get feedback by ID
app.put("/edit-feedback/:id", updateFeedback); // Edit feedback by ID
app.delete("/delete-feedback/:id", deleteFeedback); // Delete feedback by ID

// Server Initialization
(async () => {
    // Ensure required files exist before starting the server
    await ensureFileExists(draftsFilePath, "{}");
    await ensureFileExists(dataFilePath);

    // Start the server
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
})();
