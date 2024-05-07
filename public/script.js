const p1 = {
	score: 0,
	button: document.querySelector("#p1Button"),
	display: document.querySelector("#p1Display"),
};
const p2 = {
	score: 0,
	button: document.querySelector("#p2Button"),
	display: document.querySelector("#p2Display"),
};

const pScore = document.getElementById("pScore");
const victoryLap = document.getElementById("victoryLap");
const wordPlayed = document.getElementById("wordPlayed");
const p1Words = document.getElementById("p1Words");

let winnerInfo = {
	winName: "",
	winTotal: 0,
	hiWord: "",
	hiTotal: 0,
};

let p1Info = {
	p1Name: "Madison",
	p1Total: 0,
	p1HiWord: "",
	p1HiTotal: 0,
};

let p2Info = {
	p2Name: "Jacob",
	p2Total: 0,
	p2HiWord: "",
	p2HiTotal: 0,
};

function updateScores(player) {
	player.score += parseInt(pScore.value, 10);
	player.display.textContent = player.score;
}

function updateWinnerInfo(p1, p2) {
	if (p1.score > p2.score) {
		winnerInfo.winName = p1Info.p1Name;
		winnerInfo.winTotal = p1.score;
		winnerInfo.hiWord = p1Info.p1HiWord;
		winnerInfo.hiTotal = p1Info.p1HiTotal;
	} else {
		winnerInfo.winName = p2Info.p2Name;
		winnerInfo.winTotal = p2.score;
		winnerInfo.hiWord = p2Info.p2HiWord;
		winnerInfo.hiTotal = p2Info.p2HiTotal;
	}
	return winnerInfo;
}

function updateP1Info(wordValue, scoreValue) {
	let p1HiWord = p1Info.p1HiWord;
	let p1HiTotal = p1Info.p1HiTotal;

	if (scoreValue > p1HiTotal) {
		p1HiWord = wordValue;
		p1HiTotal = scoreValue;
	}

	p1Info = {
		...p1Info,
		p1Name: "Madison",
		p1Total: p1.score,
		p1HiWord: p1HiWord,
		p1HiTotal: p1HiTotal,
	};
}

function updateP2Info(wordValue, scoreValue) {
	let p2HiWord = p2Info.p2HiWord;
	let p2HiTotal = p2Info.p2HiTotal;

	if (scoreValue > p2HiTotal) {
		p2HiWord = wordValue;
		p2HiTotal = scoreValue;
	}

	p2Info = {
		...p2Info,
		p2Name: "Jacob",
		p2Total: p2.score,
		p2HiWord: p2HiWord,
		p2HiTotal: p2HiTotal,
	};
}

p1.button.addEventListener("click", function () {
	const scoreValue = pScore.value;
	const wordValue = wordPlayed.value.trim();
	if (scoreValue === "" || wordValue === "") {
		alert("Please fill out both fields");
		return;
	}
	updateScores(p1, p2);
	updateP1Info(wordValue, parseInt(scoreValue));
	clearInput();
	const newItem = document.createElement("li");
	newItem.textContent = wordValue.toUpperCase();
	p1Words.appendChild(newItem);
	wordPlayed.value = "";
});

p2.button.addEventListener("click", function () {
	const scoreValue = pScore.value;
	const wordValue = wordPlayed.value.trim();
	if (scoreValue === "" || wordValue === "") {
		alert("Please fill out both fields");
		return;
	}
	updateScores(p2, p1);
	updateP2Info(wordValue, parseInt(scoreValue));
	clearInput();
	const newItem = document.createElement("li");
	newItem.textContent = wordValue.toUpperCase();
	p2Words.appendChild(newItem);
	wordPlayed.value = "";
});

function clearInput() {
	pScore.value = "";
	setTimeout(() => {
		pScore.value = "";
	}, 500);
}

async function sendWinnerInfoToServer(winnerInfo) {
	try {
		const response = await fetch("/hallOfFame", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(winnerInfo),
		});
		if (response.ok) {
			console.log("Winner information sent to the server");
		} else {
			console.error("Failed to send winner information");
		}
	} catch (error) {
		console.error("Error sending winner information:", error);
	}
}

function victory() {
	if (p1.score > p2.score) {
		window.location.href = "../views/madison.html";
	} else {
		window.location.href = "../views/jacob.html";
	}
}

// Updates winnerInfo, sends info to server, and finally directs to win screen
victoryLap.addEventListener("click", () => {
	if (confirm("End Game?")) {
		updateWinnerInfo(p1, p2);
		sendWinnerInfoToServer(winnerInfo);
		victory();
	}
});
