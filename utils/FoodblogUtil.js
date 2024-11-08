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
        // Destructure and validate request body
        const {
            restaurantName,
            location,
            visitDate,
            rating,
            content,
            imageUrl = "images/default.jpg", // Use default image if none provided
        } = req.body;

        // Simple validation checks

        if (
            !restaurantName ||
            !location ||
            !visitDate ||
            !content ||
            content.length < 6
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Validation error: All required fields must be filled with valid data.",
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


        // Save the new blog post data
        const updatedBlogPosts = await writeJSON(newBlogPost, dataFilePath);
        return res.status(201).json({ success: true, data: updatedBlogPosts });

        // Write the new post to the JSON file and return updated list of posts
        const updatedBlogPosts = await writeJSON(
            newBlogPost,
            "utils/foodblogs.json"
        );
        return res.status(201).json(updatedBlogPosts);

    } catch (error) {
        console.error("Error adding feedback:", error);
        return res
            .status(500)
            .json({
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

    readAllFeedback,
    ensureFileExists,

};
