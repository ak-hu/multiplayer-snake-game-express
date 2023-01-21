// game colors
const BG_COLOR = '#96ceb4';
const SNAKE_ONE_COLOR = '#ffcc5c';
const SNAKE_TWO_COLOR = '#5c8fff';
const FOOD_COLOR = '#ff6f69';

// getting elements by id
const gameScreen = document.getElementById('gameScreen');
const initialScreen = document.getElementById('initialScreen');
const newGameBtn = document.getElementById('newGameButton');
const joinGameBtn = document.getElementById('joinGameButton');
const gameCodeInput = document.getElementById('gameCodeInput');
const gameCodeDisplay = document.getElementById('gameCodeDisplay');

// variables
let gameActive;
let playerNumber;
let playerArray = [];
let snakeL = 5;

// creating svg interface
const svgns = "http://www.w3.org/2000/svg";
const svg = document.createElementNS(svgns, "svg");
const apple = document.createElementNS(svgns, 'rect');


// add buttons' events
newGameBtn.addEventListener('click', newGame);
joinGameBtn.addEventListener('click', joinGame);


// socket.io connecting
const socket = io();

socket.on('init', handleInit);
socket.on('gameState', handleGameState);
socket.on('gameOver', handleGameOver);
socket.on('gameCode', handleGameCode);
socket.on('unknownGame', handleUnknownGame);
socket.on('tooManyPlayers', handleTooManyPlayers);


// snake control
function keydown(e) {
	socket.emit('keydown', e.keyCode);
}

// common game functions
function init(){
	initialScreen.style.display = "none";
	gameScreen.style.display = "flex";

	document.addEventListener('keydown', keydown);
	gameActive = true;
}


// game painting 
function paintGame(state) {
	const field = 600;

	svg.setAttributeNS(null, 'width', field);
	svg.setAttributeNS(null, 'height', field);
	svg.setAttributeNS(null, 'style', 'border: ' + 10 + `px solid ${BG_COLOR};`);
	svg.classList.add('field');
	gameScreen.appendChild(svg);

	field = 400;

	const gridsize = state.gridsize;
	const size = field / gridsize;
	const food = state.food;

	apple.setAttributeNS(null, 'x', food.x);
	apple.setAttributeNS(null, 'y', food.y);
	apple.setAttributeNS(null, 'height', size);
	apple.setAttributeNS(null, 'width', size);
	apple.style.fill = FOOD_COLOR;
	apple.classList.add('food');
	svg.appendChild(apple);

	paintPlayer(state.players[0], size, SNAKE_ONE_COLOR);
	paintPlayer(state.players[1], size, SNAKE_TWO_COLOR);

}


// creating player
function paintPlayer(playerState, size, colour) {
	const snake = playerState.snake;

	let snk = [document.createElementNS(svgns, 'rect')];
	let player = snk[0];

	for (let cell of snake) {
		player.setAttributeNS(null, 'x', cell.x * size);
		player.setAttributeNS(null, 'y', cell.y * size);
		player.setAttributeNS(null, 'height', size);
		player.setAttributeNS(null, 'width', size);
		player.style.fill = colour;
		player.classList.add('player');
	}
	playerArray.push(snk);
	svg.appendChild(player);
	if (playerArray.length > snakeL) {
		svg.removeChild(playerArray[0][0]);
		playerArray.shift();
	}
}

// creating new game
function newGame() {
	socket.emit('newGame');
	init();
}

// joining the existing game
function joinGame() {
	const code = gameCodeInput.value;
	socket.emit('joinGame', code);
	init();
}

// wrong game id
function handleUnknownGame() {
	reset();
	alert("Unknown game code");
}

// max amount of player is reached
function handleTooManyPlayers() {
	reset();
	alert("This game is already in progress");
}

// game code on the web page
function handleGameCode(gameCode) {
	gameCodeDisplay.innerText = gameCode;
}

function handleInit(number) {
	playerNumber = number;
}

function handleGameState(gameState) {
	if (!gameActive) {
		return;
	}
	gameState = JSON.parse(gameState);
	requestAnimationFrame( () => paintGame(gameState));
}

function handleGameOver(data) {
	if (!gameActive) {
		return;
	}
	data = JSON.parse(data);

	if (data.winner === playerNumber) {
		alert("You win!");
	} else {
		alert('You lose');
	}
	gameActive = false;
}


// reset game
function reset() {
	playerNumber = null;
	gameCodeInput.value = '';
	initialScreen.style.display = "flex";
	gameScreen.style.display = "none";
}
