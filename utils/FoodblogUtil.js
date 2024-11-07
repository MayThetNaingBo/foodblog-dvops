const { BlogPost } = require("../models/Foodblog");
const fs = require("fs").promises;
const path = require("path");

// Define the file path
const dataFilePath = path.join(__dirname, "foodblogs.json");

// Ensure the file exists before reading or writing
async function ensureFileExists() {
    try {
        await fs.access(dataFilePath);
    } catch (err) {
        // File doesn't exist, create it with an empty array
        await fs.writeFile(dataFilePath, JSON.stringify([]), "utf8");
    }
}

// Function to read JSON data from a file
async function readJSON(filename) {
    try {
        const data = await fs.readFile(filename, "utf8");
        return JSON.parse(data);
    } catch (err) {
        console.error(err);
        throw err;
    }
}

// Function to write an object to JSON file
async function writeJSON(object, filename) {
    try {
        const allObjects = await readJSON(filename);
        allObjects.push(object);
        await fs.writeFile(
            filename,
            JSON.stringify(allObjects, null, 2),
            "utf8"
        ); // Adding null, 2 for pretty-printing JSON
        return allObjects;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

// Function to fetch all feedback on page load
async function readAllFeedback() {
    try {
        return await readJSON(dataFilePath);
    } catch (error) {
        console.error("Error reading all feedback:", error);
        throw error;
    }
}

// Function to add a new blog post
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

        if (
            !restaurantName ||
            !location ||
            !visitDate ||
            !content ||
            content.length < 6 ||
            !imageUrl
        ) {
            return res.status(400).json({
                message: "Validation error: All fields are required.",
            });
        }

        const newBlogPost = new BlogPost(
            restaurantName,
            location,
            visitDate,
            rating,
            content,
            imageUrl
        );

        const updatedBlogPosts = await writeJSON(
            newBlogPost,
            "utils/foodblogs.json"
        );
        return res.status(201).json(updatedBlogPosts);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

async function getFeedback(req, res) {
    try {
        const feedbackData = await readJSON("utils/foodblogs.json");
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
    readAllFeedback,
};
