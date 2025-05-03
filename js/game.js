import { Gameboard } from "./gameboard.js";
import { Players } from "./players.js";
import { Utilities } from "./utilities.js";

const Game = (() => {
    let gameOngoing = false;

    const startBtn = document.querySelector('.start-button');
    const newRoundBtn = document.querySelector('.newround-button');
    const gridsizeSelect = document.querySelector('#gridsize-select');
    const resetBtn = document.querySelector('.reset-button');

    const playerSection1 = document.querySelector('#player-section-1');
    const playerSection2 = document.querySelector('#player-section-2');

    const gameResult = document.querySelector('.game-result');
    
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

        const onWinCondition = () => {
            gameResult.textContent = `${Players.getPlayerName(activePlayerID)} wins!`;
            Utilities.showElement(gameResult);
            Players.increasePlayerWins(activePlayerID);
            Players.updatePlayerWinsDisplay(activePlayerID);
            playerSection1.classList.remove('active-player');
            playerSection2.classList.remove('active-player');
            gameOngoing = false;

            const winningLineCoordinates = Gameboard.checkForWin().line;

            winningLineCoordinates.forEach((winningCellCoordinates) => {
                const winningCellRow = winningCellCoordinates[0];
                const winningCellColumn = winningCellCoordinates[1];
                document.querySelector(`[data-row="${winningCellRow + 1}"][data-column="${winningCellColumn + 1}"]`).classList.add('winning-cell');
            });
        }

        const onDrawCondition = () => {
            gameResult.textContent = 'It is a draw!';
            Utilities.showElement(gameResult);
            playerSection1.classList.remove('active-player');
            playerSection2.classList.remove('active-player');
            gameOngoing = false;
        };

        const onCellClick = (event) => {
            const cell = event.target;

            if(gameOngoing && cell.getAttribute('data-checked') === 'null') {
                cell.setAttribute('data-checked', Players.getPlayerSymbol(activePlayerID));
                Gameboard.makeMove(getPlayerMove(cell), Players.getPlayerSymbol(activePlayerID));

                if (Gameboard.checkForWin().won) {
                    onWinCondition();
                    return;
                }
        
                if (turnCounter() === turnLimit && gameOngoing) {
                    onDrawCondition();
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

        playerSection1.classList.remove('active-player');
        playerSection2.classList.remove('active-player');

        Utilities.hideElement(gameResult);
    };

    createBoardFromGridsizeSelect();

    gridsizeSelect.addEventListener('change', createBoardFromGridsizeSelect);
    
    startBtn.addEventListener('click', startGame);

    newRoundBtn.addEventListener('click', () => {
        createBoardFromGridsizeSelect();
        gameOngoing = false;

        Utilities.hideElement(gameResult);
        Utilities.disableElement(newRoundBtn);
        Utilities.enableElement(gridsizeSelect);
        Utilities.enableElement(startBtn);
    });

    resetBtn.addEventListener('click', fullReset);
})();