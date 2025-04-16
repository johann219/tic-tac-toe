const createPlayer = (name, symbol) => {
    const playerName = name;
    const playerSymbol = symbol;

    return { playerName, playerSymbol };
};


const GameBoard = (() => {
    const state = [[null, null, null], [null, null, null], [null, null, null]];

    const changeState = (move, symbol) => {
        if (state[move.row - 1][move.column - 1] === null) {
            state[move.row - 1][move.column - 1] = symbol;
        }
        console.log(`Current board:\n${state[0]}\n${state[1]}\n${state[2]}`);
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
    
    const createUpdwardDiagonal = (gridSize) => {
        const winningUpwardDiagonal = [];
        for (i = 0; i < gridSize; i++) {
            const diagonalCell = [i, gridSize - 1 - i];
            winningUpwardDiagonal.push(diagonalCell);
        }
        return winningUpwardDiagonal;
    };
    
    const createDownwardDiagonal = (gridSize) => {
        const winningDownwardDiagonal = [];
        for (i = 0; i < gridSize; i++) {
            const diagonalCell = [i, i];
            winningDownwardDiagonal.push(diagonalCell);
        }
        return winningDownwardDiagonal;
    };
    
    const createWinningCombinations = (gridSize) => {
        const winningCombinations = [];
        
        createWinningRows(gridSize).forEach((row) => winningCombinations.push(row));
        createWinningColumns(gridSize).forEach((column) => winningCombinations.push(column));
        winningCombinations.push(createDownwardDiagonal(gridSize));
        winningCombinations.push(createUpdwardDiagonal(gridSize));
    
        return winningCombinations;
    };

    return { changeState };
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
        let currentPlayer = player1;
        let currentTurn = 1;

        while (gameOngoing) {
            console.log(`Turn ${currentTurn}`);
            ++currentTurn;
            console.log(`${currentPlayer.playerName} moves!`);

            const move = askPlayerForMove(currentPlayer);
            GameBoard.changeState(move, currentPlayer.playerSymbol);

            // check for win
                // declare winner
            // check for draw
                // declare draw
            currentPlayer = currentPlayer === player1 ? player2 : player1;
            
            console.log(currentPlayer === player1);
        }
    };

    return { startGame };
})();

Game.startGame();