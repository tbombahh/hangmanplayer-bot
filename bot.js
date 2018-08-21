var VERSIONNUMBER = "2.4";

var HTTPS = require('https');
var botID = process.env.BOT_ID;

var r1 = /\/play$/,
	 r2 = /\/guess\s[a-zA-Z]$/,
	 r3 = /\/forfeit$/,
	 r4 = /\/progress$/,
	 r5 = /\/help$/;
	 r6 = /\/about$/;

var currentlyPlayingGame = false;

var guessWord = "tilted";
var displayWord = "??????";

var guessedLetters = "";

var guessesMax = 5;
var guessesRemain = 5;

var wordList = ["alcohol","corona","free"];

function respond() {
	request = JSON.parse(this.req.chunks[0]);
  
	if(request.text && r1.test(request.text.toLowerCase())) {
		if(currentlyPlayingGame){
			this.res.writeHead(200);
			sendMessage("You are already playing a game. Type \"/forfeit\" to end your game.");
			this.res.end();
		} else {
			this.res.writeHead(200);
			sendMessage(startGame());
			this.res.end();
		}
	}

	else if(request.text && r2.test(request.text.toLowerCase())) {
		if(currentlyPlayingGame){
			this.res.writeHead(200);
			sendMessage(guessLetter(request.text.toLowerCase().slice(-1)));
			this.res.end();
		} else {
			this.res.writeHead(200);
			sendMessage("You are not currently playing a game. Type \"/play\" to start a game.");
			this.res.end();
		}
	}

	else if(request.text && r3.test(request.text.toLowerCase())) {
		if(currentlyPlayingGame){
			this.res.writeHead(200);
			sendMessage(endGameLose());
			this.res.end();
		} else {
			this.res.writeHead(200);
			sendMessage("You are not currently playing a game. Type \"/play\" to start a game.");
			this.res.end();
		}
	}

	else if(request.text && r4.test(request.text.toLowerCase())) {
		if(currentlyPlayingGame){
			this.res.writeHead(200);
			sendMessage(progressText1() + progressText2() + progressText3());
			this.res.end();
		} else {
			this.res.writeHead(200);
			sendMessage("You are not currently playing a game. Type \"/play\" to start a game.");
			this.res.end();
		}
	}

	else if(request.text && r5.test(request.text.toLowerCase())) {
		this.res.writeHead(200);
		sendMessage("I am a bot that runs games of Hangman. Type \"/play\" to start a game. Type \"/guess [letter]\" to guess that letter. Type \"/progress\" to see progress on the game. Type \"/forfeit\" to end a game. Type \"/stats\" to see stats about the number of games played. Note that sometimes I can be a little slow to respond, so be patient!");
		this.res.end();
	}

	else if(request.text && r6.test(request.text.toLowerCase())) {
		this.res.writeHead(200);
		sendMessage("I am HangBot version " + VERSIONNUMBER + ". I was created by James Calixto, with lots of help from Pulkit Kashyap. I run games of Hangman.");
		this.res.end();
	}

	else {
		console.log("no response required");
		this.res.writeHead(200);
		this.res.end();
	}
}

function sendMessage(messageText){
	var botResponse, options, body, botReq;

	botResponse = messageText;

 	options = {
		hostname: 'api.groupme.com',
		path: '/v3/bots/post',
		method: 'POST'
 	};

 	body = {
		"bot_id" : botID,
	 	"text" : botResponse
  	};

  	console.log('sending ' + botResponse + ' to ' + botID);
  
  	botReq = HTTPS.request(options, function(res) {
		if(res.statusCode == 202) {
		} else {
		  console.log('rejecting bad status code ' + res.statusCode);
		}
  	});

  	botReq.on('error', function(err) {
	 	console.log('error posting message '  + JSON.stringify(err));
  	});

  	botReq.on('timeout', function(err) {
	 	console.log('timeout posting message '  + JSON.stringify(err));
  	});

  	botReq.end(JSON.stringify(body));
}

function startGame() {
	currentlyPlayingGame = true;
	// reset guessed letters
	guessedLetters = "";
	// reset number of guesses
	guessesRemain = guessesMax;
	// make a new guessWord
	generateWord();
	updateDisplayWord();
	return "Try to guess \"" + displayWord + "\" in " + guessesMax + " guesses or less.";
}
	
function generateWord(){
	rng = (Math.floor((Math.random() * 4379) + 1));
	guessWord = wordList[rng];
}

function updateDisplayWord(){
	// make a new temp string
	var tempString = "";
	// for every letter in the guessword
	for (var i = 0; i < guessWord.length; i++) {
		// if it's in our guessed letters
		if (guessedLetters.indexOf(guessWord.charAt(i)) != -1) {
			// show the letter
			tempString += guessWord.charAt(i);
		} else {
		// otherwise
			// put a - there
			tempString += "?";
		}
	// make it the display word
	displayWord = tempString;
	}
}

function guessLetter(str) {
	// if we already have this letter (letter is in guessed letters)
	if (guessedLetters.indexOf(str) != -1) {
		// reject it with a message
		return "You have already guessed the letter " + str + ".";
	}

	// update the display text 
	guessedLetters += str;
	updateDisplayWord();

	if (displayWord.indexOf("?") == -1) {
		// if we won (display text has no ?) then go to win
		return endGameWin();
	}
	
	if (guessWord.indexOf(str) == -1) {
		// decrement guess count
		guessesRemain -= 1;
	}

	if (guessesRemain == 0) {
		return endGameLose();
	}

	return "You guessed " + str + ", giving you \"" + displayWord + "\" with " + guessNumberText();
}

function guessNumberText() {
	if (guessesRemain == 1) {
		return "only 1 guess left.";
	} else {
		return guessesRemain + " guesses left.";
	}
}

function endGameWin() {
	currentlyPlayingGame = false;
	gamesPlayed += 1;
	gamesWon += 1;
	return "Congratulations! You guessed the word \"" + guessWord + "\". Try again?";
}

function endGameLose() {
	currentlyPlayingGame = false;
	gamesPlayed += 1;
	return "You lost. The word you were trying to guess was \"" + guessWord + "\". Better luck next time.";
}

function progressText1() {
	return "You are trying to guess the remainder of \"" + displayWord + "\" ";
}

function progressText2() {
	if (guessedLetters.length == 0) {
		return "and you have not yet guessed any letters. "
	} else if (guessedLetters.length == 1) {
		return "and you have already guessed the letter " + guessedLetters + ". ";
	} else {
		return "and you have already guessed the letters " + guessedLetters.split("") + ". ";
	}
}

function progressText3() {
	return "You have " + guessNumberText();
}

exports.respond = respond;
