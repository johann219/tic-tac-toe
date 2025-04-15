const GameBoard = (() => {
    const state = [[null, null, null], [null, null, null], [null, null, null]];

    const changeState = (move, symbol) => {
        if (state[move.row - 1][move.column - 1] === null) {
            state[move.row - 1][move.column - 1] = symbol;
        }
        console.log(`Current board:\n${state[0]}\n${state[1]}\n${state[2]}`);
    };

    return { state, changeState };
})();

const createPlayer = (name, symbol) => {
    const playerName = name;
    const playerSymbol = symbol;

    return { playerName, playerSymbol };
};
