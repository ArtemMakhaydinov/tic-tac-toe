const gameBoard = (function () {

    const _board = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    const _winRows = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];

    function placeMarkOnBoard(mark, cell) {
        if (_board[cell] === cell) {
            _board[cell] = mark;
            return true;
        }
        else {
            return false;
        };
    };

    function renderBoard() {
        const cells = document.querySelectorAll('.cell');
        cells.forEach(element => { _renderCell(element); });
    };

    function _renderCell(cell) {
        const cellIndex = cell.dataset.index;
        if (typeof _board[cellIndex] === 'string') {
            cell.textContent = _board[cellIndex]
        }
        else {
            cell.textContent = '';
        }
    };

    function getBoard() {
        return _board;
    };

    function getWinRows() {
        return _winRows;
    };

    function findWinRow(board, player) {
        const winRow = [];
        _winRows.forEach(row => {
            if (board[row[0]] === player && board[row[1]] === player && board[row[2]] === player) {
                row.forEach(cell => { winRow.push(cell) })
            };
        });
        if (winRow.length !== 0) {
            return winRow
        }
        else {
            return false;
        };
    };

    function checkTie(board) {
        let availableCells = emptyCells(board);
        if (availableCells.length === 0) {
            return true;
        }
        else {
            return false;
        };
    };

    function turnCellRed(arr) {
        arr.forEach(cell => {
            document.querySelector(`.cell_${cell}`).style.color = '#ef9f9f'
        });
    };

    function emptyCells(board) {
        return board.filter(cell => cell !== 'X' && cell !== 'O');
    };

    function resetBoard() {
        for (let i = 0; i < _board.length; i++) {
            _board[i] = i;
            document.querySelector(`.cell_${i}`).style.color = '#354259';
        };
    };

    return {
        placeMarkOnBoard,
        renderBoard,
        getBoard,
        getWinRows,
        turnCellRed,
        findWinRow,
        checkTie,
        emptyCells,
        resetBoard,
    };
})();


const players = (function () {
    let playerXIsBot = false;
    let playerOIsBot = true;

    function setPlayers() {
        const humanXButton = document.querySelector('.human_x');
        const botXButton = document.querySelector('.bot_x');
        const humanOButton = document.querySelector('.human_o');
        const botOButton = document.querySelector('.bot_o');

        if (this.dataset.player === 'Hum-X') {
            if (!playerXIsBot) return;
            humanXButton.classList.add('pressed');
            botXButton.classList.remove('pressed');
            playerXIsBot = false;
        }
        else if (this.dataset.player === 'AI-X') {
            if (playerXIsBot) return;
            humanXButton.classList.remove('pressed');
            botXButton.classList.add('pressed');
            playerXIsBot = true;
        }
        else if (this.dataset.player === 'Hum-O') {
            if (!playerOIsBot) return;
            humanOButton.classList.add('pressed');
            botOButton.classList.remove('pressed');
            playerOIsBot = false;
        }
        else if (this.dataset.player === 'AI-O') {
            if (playerOIsBot) return;
            humanOButton.classList.remove('pressed');
            botOButton.classList.add('pressed');
            playerOIsBot = true;
        };

        gameFlow.resetGame();
        startXBot()
    };

    function getBotMarks() {
        const bots = [];
        if (playerXIsBot) bots.push('X');
        if (playerOIsBot) bots.push('O');
        return bots;
    };

    function startXBot() {
        if (playerXIsBot) {
            botPlay.setMarks('X');
            const bestPlay = botPlay.minimax([0, 1, 2, 3, 4, 5, 6, 7, 8], 'X');
            setTimeout(gameFlow.handleMove, 200, bestPlay.index);
        };
    }

    return {
        setPlayers,
        getBotMarks,
        startXBot,
    };
})();


const gameFlow = (function () {
    let currentPlayer = 'X';


    function handleClick() {
        const cell = +this.dataset.index;
        handleMove(cell);
    }

    function handleMove(cell) {

        if (_checkWinTie()) {
            return;
        }
        else if (!gameBoard.placeMarkOnBoard(currentPlayer, cell)) {
            return;
        };

        gameBoard.renderBoard();
        _checkWinTie();
        changePlayer();
        setAnnouncer();
        handleBots();
    };

    function _checkWinTie() {
        let board = gameBoard.getBoard();
        if (gameBoard.findWinRow(board, 'X')) {
            gameBoard.turnCellRed(gameBoard.findWinRow(board, 'X'));
            return true;
        }
        else if (gameBoard.findWinRow(board, 'O')) {
            gameBoard.turnCellRed(gameBoard.findWinRow(board, 'O'));
            return true;
        }
        else if (gameBoard.checkTie(board)) {
            gameBoard.turnCellRed([0, 1, 2, 3, 4, 5, 6, 7, 8]);
            return true;
        };

        return false;
    };

    function changePlayer(player) {
        if (player) {
            currentPlayer = player;
            return;
        }
        else if (currentPlayer === 'X') {
            currentPlayer = 'O';
        }
        else {
            currentPlayer = 'X';
        };
    };

    function handleBots() {
        let board = gameBoard.getBoard();
        let bots = players.getBotMarks();
        if (bots.includes(currentPlayer)) {
            botPlay.setMarks(currentPlayer);
            const bestPlay = botPlay.minimax(board, currentPlayer);
            setTimeout(handleMove, 100, bestPlay.index);
        }
    }

    function resetAfterGameEnd() {
        if (_checkWinTie()) resetGame();
    }

    function resetGame() {
        gameBoard.resetBoard();
        gameBoard.renderBoard();
        gameFlow.changePlayer('X');
        players.startXBot();
    };

    function setAnnouncer() {
        const announcer = document.querySelector('.announcer');
        let board = gameBoard.getBoard();

        if (gameBoard.findWinRow(board, 'X')) {
            announcer.textContent = 'Player X WIN! \n'
            announcer.textContent += 'Click here to restart.';
            return;
        }
        else if (gameBoard.findWinRow(board, 'O')) {
            announcer.textContent = 'Player O WIN! \n'
            announcer.textContent += 'Click here to restart.';
            return;
        }
        else if (gameBoard.checkTie(board)) {
            announcer.textContent = 'It\'s TIE! \n'
            announcer.textContent += 'Click here to restart.';
            return;
        }
        else if (currentPlayer === 'X') {
            console.log(currentPlayer);
            announcer.textContent = 'Player X turn!';
        }
        else if (currentPlayer === 'O') {
            console.log(currentPlayer);
            announcer.textContent = 'Player O turn!';
        };
    };

    return {
        handleClick,
        handleMove,
        changePlayer,
        resetGame,
        resetAfterGameEnd,
    };

})();

const botPlay = (function () {
    let bot;
    let opponent;

    function setMarks(botMark) {
        bot = botMark;
        bot === 'X' ? opponent = 'O' : opponent = 'X';
    }

    function minimax(newBoard, player) {
        let availableSpots = gameBoard.emptyCells(newBoard);
        let moves = [];
        let bestMove;

        if (gameBoard.findWinRow(newBoard, opponent)) {
            return { score: -10 };
        }
        else if (gameBoard.findWinRow(newBoard, bot)) {
            return { score: 10 };
        }
        else if (availableSpots.length === 0) {
            return { score: 0 };
        };

        for (let i = 0; i < availableSpots.length; i++) {
            const move = {};
            move.index = newBoard[availableSpots[i]];
            newBoard[availableSpots[i]] = player;

            if (player === bot) {
                let result = minimax(newBoard, opponent);
                move.score = result.score;
            }
            else {
                let result = minimax(newBoard, bot);
                move.score = result.score;
            };

            newBoard[availableSpots[i]] = move.index;
            moves.push(move);
        };

        if (player === bot) {
            let bestScore = -10000;
            for (let i = 0; i < moves.length; i++) {
                if (moves[i].score > bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                };
            };
        }
        else {
            let bestScore = 10000;
            for (let i = 0; i < moves.length; i++) {
                if (moves[i].score < bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                };
            };
        };

        return moves[bestMove];

    };

    return {
        minimax,
        setMarks,
    }
})();


// EVENT LISTENERS

document.querySelectorAll('.cell').forEach(e => { e.addEventListener('click', gameFlow.handleClick) });
document.querySelectorAll('.header_button').forEach(e => { e.addEventListener('click', players.setPlayers) });
document.querySelector('.announcer').addEventListener('click', gameFlow.resetAfterGameEnd);