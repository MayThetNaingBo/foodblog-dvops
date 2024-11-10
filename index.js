const express = require("express");
const path = require("path");
const app = express();
const PORT = 3000;
const {
    addFeedback,
    getFeedback,
    ensureFileExists,
    readJSON,
} = require("./utils/FoodblogUtil");

const dataFilePath = path.join(__dirname, "utils", "foodblogs.json");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

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

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/get-feedback", (req, res) => {
    getFeedback(req, res).catch((error) => {
        console.error("Error fetching feedback:", error);
        res.status(500).json({ message: "Error fetching feedback." });
    });
});

app.get("/initial-data", async (req, res) => {
    try {
        const initialData = await readJSON(dataFilePath);
        res.json(initialData);
    } catch (error) {
        console.error("Error loading initial data:", error);
        res.status(500).json({ message: "Error loading initial data." });
    }
});

app.post("/add-blogpost", (req, res) => {
    addFeedback(req, res).catch((error) => {
        console.error("Error adding feedback:", error);
        res.status(500).json({ message: "Error adding feedback." });
    });
});

startServer();

module.exports = { app };
