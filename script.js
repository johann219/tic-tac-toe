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

    const changeState = (move, symbol) => state[move.row - 1][move.column - 1] = symbol;

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
                newCell.setAttribute('data-checked', null);
                
                
                board.append(newCell);
            }
        }
    
        gameboardWrapperElement.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
        
        gameboardWrapperElement.append(board);
    
        const gap = 0.1 * document.querySelector('.gameboard-cell').offsetWidth;
    
        gameboardWrapperElement.style.gap = `${gap}px`;
    };

    return { createBoard, renderBoard, createWinningCombinations, changeState, checkForWin };
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

        const turnLimit = Math.pow(gridSize, 2);

        let currentPlayer = player1;
        let currentTurn = 1;
        
        const addCellsClickListeners = () => {
            const cells = document.querySelectorAll('.gameboard-cell');
        
            cells.forEach((cell) => {
                cell.addEventListener('click', (e) => {
                    if(gameOngoing && e.target.getAttribute('data-checked') === 'null') {
                        console.log(`Turn ${currentTurn}`);
                        console.log(`${currentPlayer.playerName} moves!`);
                        
                        e.target.setAttribute('data-checked', currentPlayer.playerSymbol);
                        
                        const move = {
                            row: e.target.getAttribute('data-row'),
                            column: e.target.getAttribute('data-column'),
                        };

                        GameBoard.changeState(move, currentPlayer.playerSymbol);

                        if (GameBoard.checkForWin()) {
                            console.log(`${currentPlayer.playerName} wins!`);
                            gameOngoing = false;
                        }
            
                        if (currentTurn === turnLimit) {
                            console.log('It is a draw!');
                            gameOngoing = false;
                        } else {
                            ++currentTurn;
                        }
            
                        currentPlayer = currentPlayer === player1 ? player2 : player1;
                    }
                });
            });
        };

        addCellsClickListeners();
    };

    return { startGame };
})();

Game.startGame();

