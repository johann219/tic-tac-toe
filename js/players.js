import { Utilities } from "./utilities.js";

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
        
        event.target.value !== '' ? Utilities.enableElement(readyCheck) : Utilities.disableElement(readyCheck);
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

export { Players };