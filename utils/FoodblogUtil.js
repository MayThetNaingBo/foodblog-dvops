const { BlogPost } = require("../models/Foodblog");
const fs = require("fs").promises;
const path = require("path");

const dataFilePath = path.join(__dirname, "foodblogs.json");

async function readJSON(filename) {
    try {
        const data = await fs.readFile(filename, "utf8");
        return JSON.parse(data);
    } catch (err) {
        console.error("Error reading JSON file:", err);
        throw err;
    }
}

async function writeJSON(object, filename) {
    try {
        const allObjects = await readJSON(filename);
        allObjects.push(object);
        await fs.writeFile(
            filename,
            JSON.stringify(allObjects, null, 2),
            "utf8"
        );
        return allObjects;
    } catch (err) {
        console.error("Error writing to JSON file:", err);
        throw err;
    }
}

async function ensureFileExists() {
    try {
        await fs.access(dataFilePath);
    } catch (err) {
        await fs.writeFile(dataFilePath, "[]", "utf8"); // Initialize with an empty array
    }
}

async function addFeedback(req, res) {
    try {
        const {
            restaurantName,
            location,
            visitDate,
            rating,
            content,
            imageUrl,
        } = req.body;

        // Debugging log to see incoming data
        console.log("Received data:", req.body);

        // Validation
        if (!restaurantName) {
            return res.status(400).json({
                success: false,
                message: "Validation error: Restaurant name is required.",
            });
        }
        if (!location) {
            return res.status(400).json({
                success: false,
                message: "Validation error: Location is required.",
            });
        }
        if (!visitDate) {
            return res.status(400).json({
                success: false,
                message: "Validation error: Date of visit is required.",
            });
        }
        if (!content || content.length < 6) {
            return res.status(400).json({
                success: false,
                message:
                    "Validation error: Feedback content must be at least 6 characters.",
            });
        }
        if (!imageUrl) {
            return res.status(400).json({
                success: false,
                message: "Validation error: Image URL is required.",
            });
        }

        // URL validation for imageUrl
        const urlPattern = /^(https?:\/\/)/i;
        if (!urlPattern.test(imageUrl)) {
            return res.status(400).json({
                success: false,
                message:
                    "Validation error: Please provide a valid URL for the image.",
            });
        }

        // Create and save the new blog post
        const newBlogPost = new BlogPost(
            restaurantName,
            location,
            visitDate,
            rating,
            content,
            imageUrl
        );
        const updatedBlogPosts = await writeJSON(newBlogPost, dataFilePath);
        return res.status(201).json({ success: true, data: updatedBlogPosts });
    } catch (error) {
        console.error("Error adding feedback:", error);
        return res.status(500).json({
            success: false,
            message: "Server error. Unable to add feedback.",
        });
    }
}

async function getFeedback(req, res) {
    try {
        const feedbackData = await readJSON(dataFilePath);
        res.status(200).json(feedbackData);
    } catch (error) {
        console.error("Error fetching feedback data:", error);
        res.status(500).json({ message: "Unable to fetch feedback data." });
    }
}

module.exports = {
    readJSON,
    writeJSON,
    addFeedback,
    getFeedback,
    ensureFileExists,
};
