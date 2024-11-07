const { BlogPost } = require("../models/Foodblog");
const fs = require("fs").promises;

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

// Function to add a new blog post
async function addFeedback(req, res) {
    try {
        // Destructure and validate request body
        const {
            restaurantName,
            location,
            visitDate,
            rating,
            content,
            imageUrl,
        } = req.body;

        // Simple validation checks
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
        

        // Create a new blog post instance (adjusted to match the feedback structure)
        const newBlogPost = new BlogPost(
            restaurantName,
            location,
            visitDate,
            rating,
            content,
            imageUrl
        );

        // Write the new post to the JSON file and return updated list of posts
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
};
