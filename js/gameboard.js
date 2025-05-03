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
        for (let i = 0; i < gridSize; i++) {
            const diagonalCell = [i, gridSize - 1 - i];
            winningUpwardDiagonal.push(diagonalCell);
        }
        return winningUpwardDiagonal;
    };
    
    const createDownwardWinningDiagonal = (gridSize) => {
        const winningDownwardDiagonal = [];
        for (let i = 0; i < gridSize; i++) {
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

    const checkForWin = () => {
        for (const winLineCoordinates of winningCombinations) {
            const winCellFirstRowCoordinate = winLineCoordinates[0][0];
            const winCellFirstColumnCoordinate = winLineCoordinates[0][1];
            const winCellFirstValue = state[winCellFirstRowCoordinate][winCellFirstColumnCoordinate];
    
            if (winCellFirstValue !== null) {
                const isWinningLine = winLineCoordinates.every((winCellCoordinates) => {
                    const cellToCompareRowCoordinate = winCellCoordinates[0];
                    const cellToCompareColumnCoordinate = winCellCoordinates[1];
                    const cellToCompareValue = state[cellToCompareRowCoordinate][cellToCompareColumnCoordinate];
    
                    return winCellFirstValue === cellToCompareValue;
                });

                if(isWinningLine) {
                    return {
                        won: true,
                        line: winLineCoordinates,
                    }
                }
            }
        }
        
        return {
            won: false, 
            line: null,
        };
    };

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

    return { createBoard, makeMove, checkForWin };
})();

export { Gameboard };