const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const path = require("path");

const { winnerSchema } = require("./schemas");

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

async function main() {
	await mongoose.connect("mongodb://127.0.0.1/hallOfFame");
}

main().catch((err) => console.log(err));

app.use(express.static(path.join(__dirname)));
app.use(express.static("public"));
app.use(express.static("media"));

app.set("view engine", "ejs");

app.get(["/", "/scrabble"], (req, res) => {
	res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.get("/jacob", (req, res) => {
	res.sendFile(path.join(__dirname, "views", "jacob.html"));
});

app.get("/madison", (req, res) => {
	res.sendFile(path.join(__dirname, "views", "madison.html"));
});

const Winners = mongoose.model("Winners", winnerSchema);

// Save winnerInfo
app.post("/hallOfFame", async (req, res) => {
	try {
		const winnerInfo = req.body;
		const newWinner = new Winners(winnerInfo);
		await newWinner.save();

		res.status(200).send("Winner information saved successfully");
	} catch (error) {
		console.error(error);
		res.status(500).send("Error storing winner information");
	}
});

// Fetch winners
app.get("/hallOfFame", async (req, res) => {
	try {
		const topWinners = await Winners.find().sort({ winTotal: -1 }).limit(10);
		res.render("hallOfFame", { topWinners });
	} catch (error) {
		console.error(error);
		res.status(500).send("Error fetching top winners");
	}
});

app.listen(3000, () => {
	console.log("Running on port 3000");
});
