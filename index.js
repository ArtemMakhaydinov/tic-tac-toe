const gameBoard = (function () {

    const _board = [0, 1, 2, 3, 4, 5, 6, 7, 8];

    function placeMarkOnBoard(mark, cell) {

        if(_board[cell] === +cell){

        _board[cell] = mark;
        return true;

        } else {

            return false;
        };
    };

    function renderBoard() {

        const cells = document.querySelectorAll('.cell');
        cells.forEach(element => { _renderCell(element); });
    };

    function _renderCell(cell) {

        const cellIndex = +cell.dataset.index;
        if (typeof board[cellIndex] === 'string') { cell.textContent = board[cellIndex] };
    };

    function getBoard() {
        return _board;
    }

    function findWinRow() {

        if (_board[0] === _board[1] && _board[1] === _board[2]) {
            _turnWinRed(0, 1, 2)
        } else if (_board[3] === _board[4] && _board[4] === _board[5]) {
            _turnWinRed(cellA, cellB, cellC);
        } else if (_board[6] === _board[7] && _board[7] === _board[8]) {
            _turnWinRed(6, 7, 8);
        } else if (_board[0] === _board[3] && _board[6] === _board[5]) {
            _turnWinRed(0, 3, 6);
        } else if (_board[1] === _board[4] && _board[4] === _board[7]) {
            _turnWinRed(1, 4, 7);
        } else if (_board[2] === _board[5] && _board[5] === _board[8]) {
            _turnWinRed(2, 5, 8);
        } else if (_board[0] === _board[4] && _board[4] === _board[8]) {
            _turnWinRed(0, 4, 8);
        } else if (_board[2] === _board[4] && _board[4] === _board[6]) {
            _turnWinRed(2, 4, 6);
        };
    };

    function _turnWinRed(cellA, cellB, cellC){
        document.querySelector(`.cell_${cellA}`).style.color = '#ef9f9f';
        document.querySelector(`.cell_${cellB}`).style.color = '#ef9f9f';
        document.querySelector(`.cell_${cellC}`).style.color = '#ef9f9f';
    }

    return {
        placeMarkOnBoard,
        renderBoard,
        getBoard,
        findWinRow,
    };
})();

const playerX = (function () {

    let mode = 'player';

})();

const playerO = (function () {

    let mode = 'player';

})();

const gameFlow = (function () {

    const playerXMark = 'X';
    const playerOMark = 'O';
    let currentPlayer = 'X';

    function handleMove() {

        const cell = this.dataset.index;

        if(!gameBoard.placeMarkOnBoard(currentPlayer, cell)) return;
        gameBoard.renderBoard();
        _checkWin();
        _changePlayer();
    };

    function _checkWin() {

        if (wining(gameBoard.getBoard(), playerXMark)) {
            gameBoard.findWinRow();
        } else if (wining(gameBoard.getBoard(), playerOMark)) {
            gameBoard.findWinRow();
        }
    };

    function wining(board, player) {

        if (
            (board[0] == player && board[1] == player && board[2] == player) ||
            (board[3] == player && board[4] == player && board[5] == player) ||
            (board[6] == player && board[7] == player && board[8] == player) ||
            (board[0] == player && board[3] == player && board[6] == player) ||
            (board[1] == player && board[4] == player && board[7] == player) ||
            (board[2] == player && board[5] == player && board[8] == player) ||
            (board[0] == player && board[4] == player && board[8] == player) ||
            (board[2] == player && board[4] == player && board[6] == player)
        ) {
            return true;
        } else {
            return false;
        }
    };

    function _changePlayer() {
        if (currentPlayer === 'X') {
            currentPlayer = 'O';
        } else {
            currentPlayer = 'X';
        };
    };

    return {
        handleMove,
        wining,
    };
})();

// EVENT LISTENERS

document.querySelectorAll('.cell').forEach(element => { element.addEventListener('click', gameFlow.handleMove) });