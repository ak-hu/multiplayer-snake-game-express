const { GRID_SIZE } = require('./constants');

module.exports = {
    initGame,
    gameLoop,
    getUpdateVelocity,
}

// launching new game and generating random food
function initGame() {
    const state = createGameState();
    randomFood(state);
    return state;
}

// positions and vehicle
function createGameState() {
    return {
            players: [{
                pos: {
                    x: 3,
                    y: 10
                },
                vel: {
                    x: 1,
                    y: 0
                },
                snake: [
                    {x: 1, y: 10},
                    {x: 2, y: 10},
                    {x: 3, y: 10},
                ],
            },{
                pos: {
                    x: 18,
                    y: 10
                },
                vel: {
                    x: 0,
                    y: 0
                },
                snake: [
                    {x: 20, y: 10},
                    {x: 19, y: 10},
                    {x: 18, y: 10},
                ],
            }],
            food: {},
            gridsize: GRID_SIZE,
            active: true,
    };
}

function gameLoop(state) {
    if (!state) {
        return;
    }
    const  playerOne = state.players[0];
    const  playerTwo = state.players[1];

    playerOne.pos.x += playerOne.vel.x;
    playerOne.pos.y += playerOne.vel.y;

    playerTwo.pos.x += playerTwo.vel.x;
    playerTwo.pos.y += playerTwo.vel.y;

    // snake died from hitting the wall
    if (playerOne.pos.x < 0 || playerOne.pos.x > GRID_SIZE || playerOne.pos.y < 0 || playerOne.pos.y > GRID_SIZE) {
        return 2;
    }

    if (playerTwo.pos.x < 0 || playerTwo.pos.x > GRID_SIZE || playerTwo.pos.y < 0 || playerTwo.pos.y > GRID_SIZE) {
        return 1;
    }

    // snake eats food
    if (state.food.x === playerOne.pos.x && state.food.y === playerOne.pos.y){
        playerOne.snake.push({...playerOne.pos});
        playerOne.pos.x += playerOne.vel.x;
        playerOne.pos.y += playerOne.vel.y;

        randomFood(state);
    }

    if (state.food.x === playerTwo.pos.x && state.food.y === playerTwo.pos.y){
        playerTwo.snake.push({...playerTwo.pos});
        playerTwo.pos.x += playerTwo.vel.x;
        playerTwo.pos.y += playerTwo.vel.y;

        randomFood(state);
    }

    // !

    // playerOne
    if (playerOne.vel.x || playerOne.vel.y) {
        // snake bite itself
        for (let cell of playerOne.snake) {
            if (cell.x === playerOne.pos.x && cell.y ===  playerOne.pos.y) {
                return 2;
            }
        }

        //the first snake bite the second one
        for (let cell of playerOne.snake) {
            if (cell.x === playerTwo.pos.x && cell.y ===  playerTwo.pos.y) {
                return 2;
            }
        }
        // snake is  moving
        playerOne.snake.push({ ...playerOne.pos});
        playerOne.snake.shift();
    }


    // playerTwo
    if (playerTwo.vel.x || playerTwo.vel.y) {
        // snake bite itself
        for (let cell of playerTwo.snake) {
            if (cell.x === playerTwo.pos.x && cell.y ===  playerTwo.pos.y) {
                return 1;
            }
        }
        //the second snake bite the first one
        for (let cell of playerTwo.snake) {
            if (cell.x === playerOne.pos.x && cell.y ===  playerOne.pos.y) {
                return 1;
            }
        }
        // snake is  moving
        playerTwo.snake.push({ ...playerTwo.pos});
        playerTwo.snake.shift();
    }

    return false;
}

// food's appearing randomly
function randomFood(state) {
    food = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
    }

    // food is not a part of a snake
    for (let cell of state.players[0].snake) {
        if (cell.x === food.x && cell.y === food.y) {
            return randomFood(state);
        }
    }

    for (let cell of state.players[1].snake) {
        if (cell.x === food.x && cell.y === food.y) {
            return randomFood(state);
        }
    }

    state.food = food;
}

// snake is moving
function getUpdateVelocity(keyCode) {
    switch (keyCode) {
        case 37: { //left
            return {x: -1, y: 0};
        }
        case 38: { //down
            return {x: 0, y: -1};
        }
        case 39: { //right
            return {x: 1, y: 0};
        }
        case 40: { //top
            return {x: 0, y: 1};
        }
    }
}