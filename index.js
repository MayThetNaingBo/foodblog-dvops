const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const PORT = process.env.PORT || 5050;
const { readJSON, addFeedback, getFeedback } = require("./utils/FoodblogUtil");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("./public"));

// Serve the index.html page
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
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

// Start the server
const server = app.listen(PORT, function () {
    const address = server.address();
    const baseUrl = `http://${
        address.address === "::" ? "localhost" : address.address
    }:${address.port}`;
    console.log(`Demo project at: ${baseUrl}`);
});

module.exports = { app, server };
