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
        await fs.writeFile(filename, JSON.stringify(allObjects), "utf8");
        return allObjects;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

// Function to add a new blog post
async function addBlogPost(req, res) {
    try {
        // Destructure and validate request body
        const { title, content, author, imageUrl } = req.body;

        if (
            !author.includes("@") ||
            !author.includes(".") ||
            content.length < 6
        ) {
            return res.status(400).json({ message: "Validation error" });
        } else {
            // Create a new blog post instance
            const newBlogPost = new BlogPost(title, content, author, imageUrl);

            // Write the new post to the JSON file and return updated list of posts
            const updatedBlogPosts = await writeJSON(
                newBlogPost,
                "utils/foodblogs.json"
            );
            return res.status(201).json(updatedBlogPosts);
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

module.exports = {
    readJSON,
    writeJSON,
    addBlogPost,
};
