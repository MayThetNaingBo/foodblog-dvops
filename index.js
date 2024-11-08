const express = require("express");
const path = require("path");
const app = express();

const PORT = process.env.PORT || 3000;

const {
    writeJSON,
    readJSON,
    addFeedback,
    getFeedback,
    readAllFeedback,
    ensureFileExists,
} = require("./utils/FoodblogUtil");

const PORT = process.env.PORT || 5050;
const { readJSON, addFeedback, getFeedback } = require("./utils/FoodblogUtil");

// Middleware to parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, "public")));

// Ensure the JSON file exists before starting the server
async function startServer() {
    try {
        await ensureFileExists();
        const server = app.listen(PORT, function () {
            const address = server.address();
            const baseUrl = `http://${
                address.address === "::" ? "localhost" : address.address
            }:${address.port}`;
            console.log(`Demo project at: ${baseUrl}`);
        });
    } catch (error) {
        console.error("Error ensuring file exists:", error);
    }
}

// Route to serve the index.html page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Route to fetch existing feedback
app.get("/get-feedback", getFeedback);

// Route to send initial JSON data
app.get("/initial-data", async (req, res) => {
    try {
        const initialData = await readJSON("utils/foodblogs.json");
        res.json(initialData);
    } catch (error) {
        res.status(500).json({ message: "Error loading initial data." });
    }
});

// Route to add feedback
app.post("/add-blogpost", addFeedback);

// Start the server after ensuring the file exists
startServer();

module.exports = { app };
