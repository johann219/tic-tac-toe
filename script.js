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

GameBoard.changeState({row: 1, column: 2}, 'x');
GameBoard.changeState({row: 3, column: 1}, 'o');
GameBoard.changeState({row: 3, column: 3}, 'x');
GameBoard.changeState({row: 2, column: 1}, 'o');
GameBoard.changeState({row: 1, column: 1}, 'x');
GameBoard.changeState({row: 1, column: 2}, 'o');