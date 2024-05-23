const displayController = (() => {
    const renderMessage = (message) => {
        document.querySelector("#message").innerHTML = message;
    }

    return {
        renderMessage
    }
})();

const Gameboard = (() => {

    let gameboard = ["", "", "", "", "", "", "", "", ""]

    //render function
    const render = () => {
        let boardHTML = "";
        gameboard.forEach((square, index) => {
            boardHTML += `<div class="square" id="square-${index}">${square}</div>`
        })

        document.querySelector("#gameboard").innerHTML = boardHTML;

        const squares = document.querySelectorAll(".square");
        squares.forEach((square) => {
            square.addEventListener('click', Game.handleClick);
        })
    }

    //update mark function
    const update = (index, value) => {
        gameboard[index] = value;
        render();

    }

    //get current state of gameboard function
    const getGameboard = () => gameboard;

    return {
        render,
        update,
        getGameboard
    }
})();

// factory function to create players
const createPlayer = function (name, mark) {
    return {
        name,
        mark
    }
}

const Game = (() => {

    let players = [];
    let currentPlayerIndex;
    let gameOver;

    //start game function
    const start = () => {
        players = [
            createPlayer(document.querySelector('#player1').value, "X"),
            createPlayer(document.querySelector('#player2').value, "O")
        ]
        currentPlayerIndex = 0;
        gameOver = false;
        Gameboard.render();

        const squares = document.querySelectorAll(".square");
        squares.forEach((square) => {
            square.addEventListener('click', handleClick);
        })
    }

    //handle click function
    const handleClick = (event) => {
        let index = parseInt(event.target.id.split("-")[1]);
        if(Gameboard.getGameboard()[index]  !== "") 
            return;

        Gameboard.update(index, players[currentPlayerIndex].mark);

        if(checkForWin(Gameboard.getGameboard())) {
            gameOver = true;
            displayController.renderMessage(`${players[currentPlayerIndex].name} won!`);
            
        }

        else if (checkForTie(Gameboard.getGameboard())) {
            gameOver = true;
            displayController.renderMessage(`It's a Tie!`);
        }

        currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0; //ternary operator to switch between x and o

        if (gameOver) {
            return;
        }
    }

    //restart game function
    const restart = () => {
        for (let i = 0; i < 9; i++) {
            Gameboard.update(i, "");
        }
        Gameboard.render();
        gameOver = false;
        displayController.renderMessage(``);
    }

    return {
        start,
        handleClick,
        restart
    }

})();

function checkForWin(board) {
    
    //all winning combinations of the board for horizontal, vertical and diagonal runs
    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ]

    for (let i = 0; i < winningCombinations.length; i++) {
        const [a, b, c] = winningCombinations[i];

        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return true;
        }
    }
    return false;
}

function checkForTie(board) {
    return board.every(cell => cell !== "")
}

const restartButton = document.querySelector('#restart-button');
restartButton.addEventListener('click', () => {
    Game.restart();
})

const startButton = document.querySelector("#start-button");
startButton.addEventListener('click', () => {
    Game.start();
})