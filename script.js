const Player = (() => {
    const symbolSelectPlayer1 = document.querySelector('#player1-symbol-select');
    const symbolSelectPlayer2 = document.querySelector('#player2-symbol-select');

    const onSymbolChange = (event) => {
        const changedSelect = event.target;
        
        const otherSelect = changedSelect === symbolSelectPlayer1 ? symbolSelectPlayer2 : symbolSelectPlayer1;

        otherSelect.selectedIndex = changedSelect.selectedIndex === 0 ? 1 : 0;
    };
    
    symbolSelectPlayer1.addEventListener('change', onSymbolChange);
    symbolSelectPlayer2.addEventListener('change', onSymbolChange);
})();


const Gameboard = (() => {
    let state = [];
    let winningCombinations = [];
    
    const deleteCells = () => {
        // delete cells data
        state.length = 0;
        
        // delete cells render
        const gameboardCells = document.querySelectorAll('.gameboard-cell');
        gameboardCells.forEach((cell) => cell.remove());
    };

    const deleteWinningCombinations = () => winningCombinations.length = 0;

    const createEmptyCellsData = (gridSize) => {
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

    const makeMove = (move, symbol) => state[move.moveRow - 1][move.moveColumn - 1] = symbol;

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

    const createBoard = (gridSize) => {
        deleteCells();
        createEmptyCellsData(gridSize);
        renderBoard(gridSize);

        deleteWinningCombinations();
        createWinningCombinations(gridSize);
    };

    const getState = () => state;

    const getWinningCombinations = () => winningCombinations;

    return { getState, getWinningCombinations, createBoard, makeMove, checkForWin };
})();

const Game = (() => {
    const player1 = createPlayer('Ivan', 'x');
    const player2 = createPlayer('Vika', 'o');

    let gameOngoing = false;

    const gridSizeSelectElement = document.querySelector('#gridsize-select');
    const restartBtnElement = document.querySelector('.restart-button');
    
    const getPlayerMove = (targetCell) => {
        const moveRow = targetCell.getAttribute('data-row');
        const moveColumn = targetCell.getAttribute('data-column');

        return { moveRow, moveColumn };
    };

    const turnCounterFactory = () => {
        let turnCount = 1;
        return function () {
            return turnCount++;
        }
    }

    const startGame = () => {
        console.log(`Game starts! ${player1.playerName} is playing as ${player1.playerSymbol} against ${player2.playerName} who is playing as ${player2.playerSymbol}`);
        
        gameOngoing = true;
        
        const turnCounter = turnCounterFactory();
        const gridSize = gridSizeSelectElement.options[gridSizeSelectElement.selectedIndex].value;
        
        let turnLimit = Math.pow(gridSize, 2);

        let currentPlayer = player1;

        const addCellsClickListeners = () => {
            const cells = document.querySelectorAll('.gameboard-cell');
        
            cells.forEach((cell) => {
                cell.addEventListener('click', () => {
                    if(gameOngoing && cell.getAttribute('data-checked') === 'null') {
                        cell.setAttribute('data-checked', currentPlayer.playerSymbol);
                        Gameboard.makeMove(getPlayerMove(cell), currentPlayer.playerSymbol);

                        if (Gameboard.checkForWin()) {
                            console.log(`${currentPlayer.playerName} wins!`);
                            gameOngoing = false;
                        }
            
                        if (turnCounter() === turnLimit) {
                            console.log('It is a draw!');
                            gameOngoing = false;
                        }
            
                        currentPlayer = currentPlayer === player1 ? player2 : player1;
                    }
                });
            });
        };

        Gameboard.createBoard(gridSize);
        addCellsClickListeners();

        const createGridSizeSelector = () => {
            gridSizeSelectElement.addEventListener('change', () => {
                gridSize = gridSizeSelectElement.options[gridSizeSelectElement.selectedIndex].value;
                Gameboard.createBoard(gridSize);
                addCellsClickListeners();
                turnLimit = Math.pow(gridSize, 2);
            });
        };
        createGridSizeSelector();
    };

    restartBtnElement.addEventListener('click', () => {
        gameOngoing = false;
        Gameboard.createBoard(gridSizeSelectElement.options[gridSizeSelectElement.selectedIndex].value);
        gridSizeSelectElement.selectedIndex = 0;
        startGame();
    });

    return { startGame };
})();

Game.startGame();