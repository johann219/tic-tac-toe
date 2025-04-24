const Utilities = (() => {
    const disableElement = (element) => element.setAttribute('disabled', '');
    const enableElement = (element) => element.removeAttribute('disabled');

    const showElement = (element) => element.classList.remove('hidden');
    const hideElement = (element) => element.classList.add('hidden');

    const randomIntFromInterval = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)
    
    return { disableElement, enableElement, showElement, hideElement, randomIntFromInterval };
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

const Players = (() => {
    const symbolSelectPlayer1 = document.querySelector('#player1-symbol-select');
    const symbolSelectPlayer2 = document.querySelector('#player2-symbol-select');

    const nameInputPlayer1 = document.querySelector('#player1-name');
    const nameInputPlayer2 = document.querySelector('#player2-name');

    const readyCheckPlayer1 = document.querySelector('#player1-ready');
    const readyCheckPlayer2 = document.querySelector('#player2-ready');

    const startBtn = document.querySelector('.start-button');
    const gridsizeSelect = document.querySelector('#gridsize-select');

    const playerForms = document.querySelectorAll('.player-form');

    const infoPlayer1 = document.querySelector('#player-info-1');
    const infoPlayer2 = document.querySelector('#player-info-2');

    let player1 = {};
    let player2 = {};

    const createPlayer = (playerName, playerSymbol) => {
        const name = playerName;
        const symbol = playerSymbol;
        const wins = 0;

        return {name, symbol, wins};
    }

    const createPlayerInfo = (player, info) => {
        info.parentElement.querySelector('h2').textContent = player.name;
        info.querySelector('.player-symbol > span').textContent = player.symbol;
    };

    const onSymbolChange = (event) => {
        const changedSelect = event.target;
        const otherSelect = changedSelect === symbolSelectPlayer1 ? symbolSelectPlayer2 : symbolSelectPlayer1;

        otherSelect.selectedIndex = changedSelect.selectedIndex === 0 ? 1 : 0;
    };

    const onNameChange = (event) => {
        const changedNameInput = event.target;
        const readyCheck = changedNameInput === nameInputPlayer1 ? readyCheckPlayer1 : readyCheckPlayer2;
        
        event.target.value !== '' ? Utilities.enableElement(readyCheck) : Utilities.enableElement(readyCheck);
    };
    
    const onReadyCheckChange = (event) => {
        const readyCheck = event.target;
        const nameInput = readyCheck === readyCheckPlayer1 ? nameInputPlayer1 : nameInputPlayer2;
        const symbolSelect = readyCheck === readyCheckPlayer1 ? symbolSelectPlayer1 : symbolSelectPlayer2;
        
        readyCheck === readyCheckPlayer1 ?
            player1 = createPlayer(nameInput.value, symbolSelect.options[symbolSelect.selectedIndex].value) :
            player2 = createPlayer(nameInput.value, symbolSelect.options[symbolSelect.selectedIndex].value);

        Utilities.disableElement(nameInput);
        Utilities.disableElement(symbolSelectPlayer1);
        Utilities.disableElement(symbolSelectPlayer2);
        
        if(readyCheckPlayer1.checked && readyCheckPlayer2.checked) {
            createPlayerInfo(player1, infoPlayer1);
            createPlayerInfo(player2, infoPlayer2);

            Utilities.showElement(infoPlayer1);
            Utilities.showElement(infoPlayer2);

            playerForms.forEach((form) => Utilities.hideElement(form));
            
            Utilities.enableElement(startBtn);
            Utilities.enableElement(gridsizeSelect);
        }
    };

    const resetPlayers = () => {
        player1 = {};
        player2 = {};
    };

    const resetPlayerInfos = () => {
        infoPlayer1.parentElement.querySelector('h2').textContent = 'Player 1';
        infoPlayer1.querySelector('.player-symbol > span').textContent = '';
        infoPlayer1.querySelector('.player-wins > span').textContent = 0;
        Utilities.hideElement(infoPlayer1);

        infoPlayer2.parentElement.querySelector('h2').textContent = 'Player 2';
        infoPlayer2.querySelector('.player-symbol > span').textContent = '';
        infoPlayer2.querySelector('.player-wins > span').textContent = 0;
        Utilities.hideElement(infoPlayer2);
    };

    const resetPlayerForms = () => {
        playerForms.forEach((form) => Utilities.showElement(form));

        nameInputPlayer1.value = '';
        nameInputPlayer2.value = '';

        Utilities.enableElement(nameInputPlayer1);
        Utilities.enableElement(nameInputPlayer2);

        Utilities.enableElement(symbolSelectPlayer1);
        Utilities.enableElement(symbolSelectPlayer2);

        readyCheckPlayer1.checked = false;
        readyCheckPlayer2.checked = false;

        Utilities.disableElement(readyCheckPlayer1);
        Utilities.disableElement(readyCheckPlayer2);
    };
    
    symbolSelectPlayer1.addEventListener('change', onSymbolChange);
    symbolSelectPlayer2.addEventListener('change', onSymbolChange);

    nameInputPlayer1.addEventListener('change', onNameChange);
    nameInputPlayer2.addEventListener('change', onNameChange);

    readyCheckPlayer1.addEventListener('change', onReadyCheckChange);
    readyCheckPlayer2.addEventListener('change', onReadyCheckChange);

    const getPlayerName = (playerID) => playerID === 1 ? player1.name : player2.name;
    const getPlayerSymbol = (playerID) => playerID === 1 ? player1.symbol : player2.symbol;
    const getPlayerWins = (playerID) => playerID === 1 ? player1.wins : player2.wins;
    const increasePlayerWins = (playerID) => playerID === 1 ? ++player1.wins : ++player2.wins;
    
    const updatePlayerWinsDisplay = (playerID) => {
        const playerInfo = playerID === 1 ? infoPlayer1 : infoPlayer2;
        playerInfo.querySelector('.player-wins > span').textContent = getPlayerWins(playerID);
    };

    return { getPlayerName, getPlayerSymbol, getPlayerWins, increasePlayerWins, resetPlayers, resetPlayerInfos, resetPlayerForms, updatePlayerWinsDisplay };
})();

const Game = (() => {
    let gameOngoing = false;

    const startBtn = document.querySelector('.start-button');
    const newRoundBtn = document.querySelector('.newround-button');
    const gridsizeSelect = document.querySelector('#gridsize-select');
    const resetBtn = document.querySelector('.reset-button');

    const playerSection1 = document.querySelector('#player-section-1');
    const playerSection2 = document.querySelector('#player-section-2');

    
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
    
    const createBoardFromGridsizeSelect = () => Gameboard.createBoard(gridsizeSelect.options[gridsizeSelect.selectedIndex].value);

    const startGame = () => {
        const cells = document.querySelectorAll('.gameboard-cell');
        
        const turnCounter = turnCounterFactory();
        const turnLimit = Math.pow(gridsizeSelect.options[gridsizeSelect.selectedIndex].value, 2);
        
        const changeActivePlayerDisplay = (activePlayerID) => {
            if (activePlayerID === 1) {
                playerSection1.classList.add('active-player');
                playerSection2.classList.remove('active-player');
            } else {
                playerSection2.classList.add('active-player');
                playerSection1.classList.remove('active-player');
            }
        };
    
        const changeActivePlayer = () => {
           activePlayerID = activePlayerID === 1 ? 2 : 1;
           changeActivePlayerDisplay(activePlayerID);
        };

        const onCellClick = (event) => {
            const cell = event.target;

            if(gameOngoing && cell.getAttribute('data-checked') === 'null') {
                cell.setAttribute('data-checked', Players.getPlayerSymbol(activePlayerID));
                Gameboard.makeMove(getPlayerMove(cell), Players.getPlayerSymbol(activePlayerID));

                if (Gameboard.checkForWin()) {
                    console.log(`${Players.getPlayerName(activePlayerID)} wins!`);
                    Players.increasePlayerWins(activePlayerID);
                    Players.updatePlayerWinsDisplay(activePlayerID);
                    playerSection1.classList.remove('active-player');
                    playerSection2.classList.remove('active-player');
                    gameOngoing = false;
                    return;
                }
        
                if (turnCounter() === turnLimit && gameOngoing) {
                    console.log('It is a draw!');
                    playerSection1.classList.remove('active-player');
                    playerSection2.classList.remove('active-player');
                    gameOngoing = false;
                    return;
                }
        
                changeActivePlayer();
            }
        }

        gameOngoing = true;

        let activePlayerID = Utilities.randomIntFromInterval(1,2);

        changeActivePlayer(activePlayerID);

        Utilities.disableElement(gridsizeSelect);
        Utilities.disableElement(startBtn);
        Utilities.enableElement(newRoundBtn);
        
        cells.forEach((cell) => cell.addEventListener('click', onCellClick));
    };

    const fullReset = () => {
        Players.resetPlayers();
        Players.resetPlayerInfos();
        Players.resetPlayerForms();
        gridsizeSelect.selectedIndex = 0;
        
        createBoardFromGridsizeSelect();
        gameOngoing = false

        Utilities.disableElement(startBtn);
        Utilities.disableElement(newRoundBtn);
        Utilities.disableElement(gridsizeSelect);
    };

    createBoardFromGridsizeSelect();

    gridsizeSelect.addEventListener('change', createBoardFromGridsizeSelect);
    
    startBtn.addEventListener('click', startGame);

    newRoundBtn.addEventListener('click', () => {
        createBoardFromGridsizeSelect();
        gameOngoing = false;

        Utilities.disableElement(newRoundBtn);
        Utilities.enableElement(gridsizeSelect);
        Utilities.enableElement(startBtn);
    });

    resetBtn.addEventListener('click', fullReset);
})();