const mongoose = require("mongoose");

const winnerSchema = new mongoose.Schema({
	winName: String,
	winTotal: Number,
	hiWord: String,
	hiTotal: Number,
});

const Winners = mongoose.model("Winners", winnerSchema);

async function getTopHighScores() {
	try {
		const topHighScores = await Winners.find().sort({ hiTotal: -1 }).limit(10);

		return topHighScores;
	} catch (error) {
		throw new Error("Failed to retrieve top high scores");
	}
}

module.exports = { Winners, getTopHighScores };
