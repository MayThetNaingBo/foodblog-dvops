const fs = require("fs").promises;
const path = require("path");

const dataFilePath = path.join(__dirname, "foodblogs.json");

// Banned words list
const bannedWords = ["awful", "kill", "terrible", "stupid"];
function containsBannedWords(content) {
    return bannedWords.some((word) =>
        content.toLowerCase().includes(word.toLowerCase())
    );
}

async function ensureFileExists() {
    try {
        await fs.access(dataFilePath);
    } catch (err) {
        await fs.writeFile(dataFilePath, "[]", "utf8"); // Initialize with an empty array if file doesn't exist
    }
}

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

async function addFeedback(req, res) {
    try {
        let { restaurantName, location, visitDate, rating, content, imageUrl } =
            req.body;

        // Check for inappropriate content
        const isInappropriate = containsBannedWords(content);
        if (isInappropriate) {
            return res
                .status(400)
                .send(
                    "Validation error: Feedback content must be at least 6 characters."
                );
        }

        // Set a default image if imageUrl is not provided or invalid
        const urlPattern = /^(https?:\/\/)/i;
        imageUrl =
            imageUrl && urlPattern.test(imageUrl)
                ? imageUrl
                : "images/NoImage.jpg"; // Default image path

        // Create a new blog post object
        const newBlogPost = {
            id: Date.now().toString(), // Generating a unique ID
            restaurantName,
            location,
            visitDate,
            rating,
            content,
            imageUrl: imageUrl || "images/NoImage.jpg",
        };

        const updatedFeedback = await writeJSON(feedbackData, dataFilePath);
        return res.status(201).json({ success: true, data: updatedFeedback });
    } catch (error) {
        console.error("Error adding feedback:", error);
        return res.status(500).send("Server error: Unable to add feedback.");
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
    ensureFileExists,
    readJSON,
    writeJSON,
    addFeedback,
    getFeedback,
};