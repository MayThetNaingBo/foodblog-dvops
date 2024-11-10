const fs = require("fs").promises;
const path = require("path");
const dataFilePath = path.join(__dirname, "foodblogs.json");

async function ensureFileExists() {
    try {
        await fs.access(dataFilePath);
    } catch (error) {
        await fs.writeFile(dataFilePath, JSON.stringify([]), "utf8");
    }
}

// Read JSON data
async function readJSON(filename) {
    const data = await fs.readFile(filename, "utf8");
    return JSON.parse(data);
}

// Write JSON data
async function writeJSON(data, filename) {
    await fs.writeFile(filename, JSON.stringify(data, null, 2), "utf8");
}

// Fetch a specific feedback post by ID
async function getFeedbackById(req, res) {
    try {
        const { id } = req.params;
        const allPosts = await readJSON(dataFilePath);
        const feedback = allPosts.find((post) => post.id === id);

        if (!feedback) {
            return res.status(404).json({ message: "Feedback not found." });
        }

        res.status(200).json(feedback);
    } catch (error) {
        console.error("Error fetching feedback:", error);
        res.status(500).json({ message: "Error fetching feedback." });
    }
}

// Update feedback by ID
async function updateFeedback(req, res) {
    try {
        const { id } = req.params;
        const {
            restaurantName,
            location,
            visitDate,
            rating,
            content,
            imageUrl,
        } = req.body;

        const allPosts = await readJSON(dataFilePath);
        const postIndex = allPosts.findIndex((post) => post.id === id);

        if (postIndex === -1) {
            return res.status(404).json({ message: "Feedback not found." });
        }

        allPosts[postIndex] = {
            ...allPosts[postIndex],
            restaurantName,
            location,
            visitDate,
            rating,
            content,
            imageUrl,
        };
        await writeJSON(allPosts, dataFilePath);
        return res
            .status(200)
            .json({ message: "Feedback modified successfully!" });
    } catch (error) {
        console.error("Error updating feedback:", error);
        return res.status(500).json({ message: "Error updating feedback." });
    }
}

// Delete feedback by ID
async function deleteFeedback(req, res) {
    try {
        const { id } = req.params;
        const allPosts = await readJSON(dataFilePath);
        const filteredPosts = allPosts.filter((post) => post.id !== id);

        if (allPosts.length === filteredPosts.length) {
            return res.status(404).json({ message: "Feedback not found." });
        }

        await writeJSON(filteredPosts, dataFilePath);
        return res
            .status(200)
            .json({ message: "Feedback deleted successfully!" });
    } catch (error) {
        console.error("Error deleting feedback:", error);
        return res.status(500).json({ message: "Error deleting feedback." });
    }
}

module.exports = {
    updateFeedback,
    deleteFeedback,
    getFeedbackById,
    ensureFileExists,
    readJSON, // Ensure readJSON is exported
    writeJSON, // Ensure writeJSON is exported
};
