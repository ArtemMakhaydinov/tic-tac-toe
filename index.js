const gameBoard = (function () {

    const _board = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    const _winRows = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
    
    function placeMarkOnBoard(mark, cell) {
        if (_board[cell] === cell) {
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
        const cellIndex = cell.dataset.index;
        if (typeof _board[cellIndex] === 'string') { cell.textContent = _board[cellIndex] };
    };

    function getBoard() {
        return _board;
    };

    function getWinRows() {
        return _winRows;
    };

    function findWinRow(board, player) {
        const winRow = [];
        console.log(board);
        _winRows.forEach(row => {
            if (board[row[0]] === player && board[row[1]] === player && board[row[2]] === player) {
                row.forEach(cell => { winRow.push(cell) })
            };
        });
        if (winRow.length !== 0) {
            return winRow
        } else {
            return false;
        };
    };

    function checkTie(board) {
        let availableCells = emptyCells(board);
        if (availableCells.length === 0){
            return true;
        } else {
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
    }

    return {
        placeMarkOnBoard,
        renderBoard,
        getBoard,
        getWinRows,
        turnCellRed,
        findWinRow,
        checkTie,
    };
})();

const gameFlow = (function () {

    const playerXMark = 'X';
    const playerOMark = 'O';
    let currentPlayer = 'X';

    function handleMove() {
        const cell = +this.dataset.index;
        if (!gameBoard.placeMarkOnBoard(currentPlayer, cell)) return;
        gameBoard.renderBoard();
        _checkWinTie();
        _changePlayer();
    };

    function _checkWinTie() {
        const board = gameBoard.getBoard();
        if (gameBoard.findWinRow(board, currentPlayer)) {
            gameBoard.turnCellRed(gameBoard.findWinRow(board, currentPlayer));
        } else if (gameBoard.checkTie(board)) {
            gameBoard.turnCellRed([0, 1, 2, 3, 4, 5, 6, 7, 8]);
        };
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
    };

})();

// EVENT LISTENERS

document.querySelectorAll('.cell').forEach(element => { element.addEventListener('click', gameFlow.handleMove) });