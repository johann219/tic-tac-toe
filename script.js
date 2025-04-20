const createPlayer = (name, symbol) => {
    const playerName = name;
    const playerSymbol = symbol;

    return { playerName, playerSymbol };
};


const GameBoard = (() => {
    let state = [];
    let winningCombinations = [];

    const createBoard = (gridSize) => {
        for (let i = 0; i < gridSize; i++) {
            const boardRow = [];
            for (let j = 0; j < gridSize; j++) {
                boardRow.push(null);
            }
            state.push(boardRow);
        }
    };

    const createWinningRows = (gridSize) => {
        const winningRows = [];
        for (let i = 0; i < gridSize; i++) {
            const winningRow = [];
            for (let j = 0; j < gridSize; j++) {
                const rowCell = [i, j];
                winningRow.push(rowCell);
            }
            winningRows.push(winningRow);
        }
        return winningRows;
    }
    
    const createWinningColumns = (gridSize) => {
        const winningColumns = [];
        for (let i = 0; i < gridSize; i++) {
            const winningColumn = [];
            for (let j = 0; j < gridSize; j++) {
                const columnCell = [j, i];
                winningColumn.push(columnCell);
            }
            winningColumns.push(winningColumn);
        }
        
        return winningColumns;
    };
    
    const createUpdwardWinningDiagonal = (gridSize) => {
        const winningUpwardDiagonal = [];
        for (i = 0; i < gridSize; i++) {
            const diagonalCell = [i, gridSize - 1 - i];
            winningUpwardDiagonal.push(diagonalCell);
        }
        return winningUpwardDiagonal;
    };
    
    const createDownwardWinningDiagonal = (gridSize) => {
        const winningDownwardDiagonal = [];
        for (i = 0; i < gridSize; i++) {
            const diagonalCell = [i, i];
            winningDownwardDiagonal.push(diagonalCell);
        }
        return winningDownwardDiagonal;
    };
    
    const createWinningCombinations = (gridSize) => {
        createWinningRows(gridSize).forEach((row) => winningCombinations.push(row));
        createWinningColumns(gridSize).forEach((column) => winningCombinations.push(column));
        winningCombinations.push(createDownwardWinningDiagonal(gridSize));
        winningCombinations.push(createUpdwardWinningDiagonal(gridSize));
    };

    const changeState = (move, symbol) => {
        if (state[move.row - 1][move.column - 1] === null) {
            state[move.row - 1][move.column - 1] = symbol;
        }
        console.log(`Current board:\n${state[0]}\n${state[1]}\n${state[2]}`);
    };

    const checkForWin = () => winningCombinations.some((winLineCoordinates) => {
        const winCellFirstRowCoordinate = winLineCoordinates[0][0];
        const winCellFirstColumnCoordinate = winLineCoordinates[0][1];

        const winCellFirstValue = state[winCellFirstRowCoordinate][winCellFirstColumnCoordinate];

        if (winCellFirstValue !== null) {
            return winLineCoordinates.every((winCellCoordinates) => {
                const cellToCompareRowCoordinate = winCellCoordinates[0];
                const cellToCompareColumnCoordinate = winCellCoordinates[1];
                        
                const cellToCompareValue = state[cellToCompareRowCoordinate][cellToCompareColumnCoordinate];

                return winCellFirstValue === cellToCompareValue;
            });
        }
        return false;
    });

    const renderBoard = (gridSize) => {
        const board = new DocumentFragment();
        const gameboardWrapperElement = document.querySelector('.gameboard-wrapper');
        
        for (let i = 1; i <= gridSize; i++) {
            for (let j = 1; j <= gridSize; j++){
                const newCell = document.createElement('div');
                newCell.classList.add('gameboard-cell');
                newCell.setAttribute('data-row', i);
                newCell.setAttribute('data-column', j);
                
                board.append(newCell);
            }
        }
    
        gameboardWrapperElement.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
        
        gameboardWrapperElement.append(board);
    
        const gap = 0.1 * document.querySelector('.gameboard-cell').offsetWidth;
    
        gameboardWrapperElement.style.gap = `${gap}px`;
    };

    const addCellsClickListeners = () => {
        const cells = document.querySelectorAll('.gameboard-cell');
    
        cells.forEach((cell) => {
            cell.addEventListener('click', (e) => {
                const cellRow = e.target.getAttribute('data-row');
                const cellColumn = e.target.getAttribute('data-column');
                
                console.log(`Cell coordinates: {${cellRow}, ${cellColumn}}`);
            });
        });
    };

    return { createBoard, renderBoard, addCellsClickListeners, createWinningCombinations, changeState, checkForWin };
})();

const Game = (() => {
    const player1 = createPlayer('Ivan', 'x');
    const player2 = createPlayer('Vika', 'o');

    let gameOngoing = false;

    const askPlayerForMove = (player) => {
        const moveStr = prompt(`${player.playerName}, enter your move (2 digits separated by space): `);
        const row = moveStr.split(' ').at(0);
        const column = moveStr.split(' ').at(1);
        return { row, column };
    }; 

    const startGame = () => {
        console.log(`Game starts! ${player1.playerName} is playing as ${player1.playerSymbol} against ${player2.playerName} who is playing as ${player2.playerSymbol}`);
        
        gameOngoing = true;
        
        const gridSize = prompt('Enter desirable grid size: ');

        GameBoard.createBoard(gridSize);
        GameBoard.renderBoard(gridSize);
        GameBoard.createWinningCombinations(gridSize);
        GameBoard.addCellsClickListeners();

        const turnLimit = Math.pow(gridSize, 2);

        let currentPlayer = player1;
        let currentTurn = 1;

        while (gameOngoing) {
            console.log(`Turn ${currentTurn}`);
            console.log(`${currentPlayer.playerName} moves!`);

            //const move = askPlayerForMove(currentPlayer);
            //GameBoard.changeState(move, currentPlayer.playerSymbol);

            if (GameBoard.checkForWin()) {
                console.log(`${currentPlayer.playerName} wins!`);
                gameOngoing = false;
                break;
            }

            if (currentTurn === turnLimit) {
                console.log('It is a draw!');
                gameOngoing = false;
                break;
            } else {
                ++currentTurn;
            }

            currentPlayer = currentPlayer === player1 ? player2 : player1;
        }
    };

    return { startGame };
})();

Game.startGame();

