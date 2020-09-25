const { timeStamp } = require('console');
const { create } = require('domain');
const { placeCounter, createBoard, switchPlayer, checkWin, Player, getRowCoord } = require('../Server/server.js');
const each = require('jest-each').default;

// Unit Tests

describe('Can place a counter', () => {
    const p1 = new Player('Taylor', 'red');
    const p2 = new Player('Ryan', 'yellow');
    beforeEach(() => {
        board = [
                [null, null, null, null],
                [null, null, null, null],
                [null, null, null, null],
                [null, null, null, null]];
    });
    
    // Arrange
    each([
        [
            p1, 0,
            [[null, null, null, 'red'],
            [null, null, null, null],
            [null, null, null, null],
            [null, null, null, null]]
        ],
        [
            p2, 1,
            [[null, null, null, null],
            [null, null, null, 'yellow'],
            [null, null, null, null],
            [null, null, null, null]]
        ],
        [
            p1, 2,
            [[null, null, null, null],
            [null, null, null, null],
            [null, null, null, 'red'],
            [null, null, null, null]]
        ],
        [
            p2, 3,
            [[null, null, null, null],
            [null, null, null, null],
            [null, null, null, null],
            [null, null, null, 'yellow']]
        ]
    ]).it("input:", (player, column, expected_output) => {
       
        // Act
        actual_output = placeCounter(column, board, player);

        // Assert
        expect(actual_output).toStrictEqual(expected_output);
    })
});

describe('Can create board', () => {
    
    // Arrange
    each([
        //4x5
        [[[null, null, null, null],
        [null, null, null, null],
        [null, null, null, null],
        [null, null, null, null],
        [null, null, null, null]], 4, 5],

        //3x3
        [[[null,null,null],
        [null,null,null],
        [null,null,null]], 3, 3],

        //5x7
        [[[null, null, null, null, null],
        [null, null, null, null, null],
        [null, null, null, null, null],
        [null, null, null, null, null],
        [null, null, null, null, null],
        [null, null, null, null, null],
        [null, null, null, null, null]], 5, 7],

        //Edge Case: 10x12
        [[[null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null]], 10, 12]
    ]).it("input:", (expected_output, rows, cols) => {
        
        // Act
        actual_output = createBoard(rows,cols);

        // Assert
        expect(actual_output).toStrictEqual(expected_output)
    })
});

describe('Can switch player', () => {
    
    // Arrange
    each([
        [0, 1],
        [1, 0]
    ]).it("input:", (playerTurn, expected_output) => {
        
        // Act
        actual_output = switchPlayer(playerTurn);

        // Assert
        expect(actual_output).toEqual(expected_output);
    });

});

describe('Can win vertically', () => {
    const p1 = new Player('Taylor', 'red');
    const p2 = new Player('Ryan', 'yellow');
    
    // Arrange
    each([
        [[[null, null, null, null],
        [null, null, null, null],
        ['red', 'red', 'red', 'red'],
        [null, null, null, null]], 0, 2, p1],
        
        [[[null, null, null, 'red'],
        [null, null, 'red', 'red'],
        [null, null, 'red', 'red'],
        ['yellow', 'yellow', 'yellow', 'yellow']], 0, 3, p2],

        [[[null, null, 'yellow', 'yellow', 'yellow'],
        ['red', 'red', 'red', 'red', 'yellow'],
        [null, null, null, null, 'red'],
        [null, null, null, null, 'yellow']], 0, 1, p1],

        [[[null, null, 'red', 'red', 'red'],
        [null, null, null, null, null],
        [null, null, null, null, 'red'],
        [null, null, null, null, 'red'],
        [null, 'yellow', 'yellow', 'yellow', 'yellow']], 1, 4, p2]
    ]).it("input:", (board, row, col, expected_output) => {

        // Act
        actual_output = checkWin(row, col, board, expected_output)

        // Assert
        expect(actual_output).toEqual(expected_output);
    })
});

describe('Can win horizontally', () => {
    const p1 = new Player('Taylor', 'red')
    const p2 = new Player('Ryan', 'yellow')
    
    // Arrange
    each([
        [[[null, null, 'red', 'yellow'],
        [null, null, 'red', 'yellow'],
        [null, null, 'red', 'yellow'],
        [null, null, null, 'yellow']], 3, 0, p2],

        [[[null, null, null, 'red', 'red'],
        [null, null, null, 'red', 'yellow'],
        [null, null, 'yellow', 'red', 'red'],
        [null, 'yellow', 'yellow', 'red', 'yellow'],
        [null, null, null, null, 'red']], 3, 0, p1],

        [[[null, 'red', 'yellow', 'red'],
        [null, null, 'yellow', 'red'],
        [null, null, 'yellow', 'yellow'],
        [null, null, 'yellow', 'red']], 2, 3, p2],

        [[[null, 'yellow', 'red', 'red'],
        [null, 'red', 'yellow', 'yellow'],
        [null, 'red', 'red', 'yellow'],
        [null, 'red', 'yellow', 'yellow'],
        [null, 'red', 'yellow', 'red'],
        [null, null, null, null]], 1, 4, p1]
    ]).it("input:", (board, row, col, expected_output) => {
        // Act
        actual_output = checkWin(row, col, board, expected_output);

        // Assert
        expect(actual_output).toEqual(expected_output);
    });
});

it.todo('Can win diagonally +ve');

it.todo('Can win diagonally -ve');


describe('Cannot place a counter in full column', () => {
    const p1 = new Player('Taylor', 'red');

    // Arrange
    each([
            [[['red', 'red', 'red', 'red'],
            [null, null, null, null],
            [null, null, null, null],
            [null, null, null, null]], 0],

            [[[null, null, null, null],
            ['red', 'red', 'red', 'red'],
            [null, null, null, null],
            [null, null, null, null]], 1],

            [[[null, null, null, null],
            [null, null, null, null],
            ['red', 'red', 'red', 'red'],
            [null, null, null, null]], 2],

            [[[null, null, null, null],
            [null, null, null, null],
            [null, null, null, null],
            ['red', 'red', 'red', 'red']], 3]
    ]).it("input:", (board, col) => {
        // Act
        const expected_output = [...board];
        actual_output = placeCounter(col, board, p1);

        // Assert
        expect(actual_output).toEqual(expected_output);

    });
});

it.todo('Game over when board is full');

test('Can increase player score', () => {
    // Arrange
    var p1 = new Player('Taylor', 'red', 0);

    // Act
    p1.addWin();

    //Assert
    expect(p1.score).toEqual(1);
});

describe('Can get first empty row inside given column', () => {
    // Arrange
    each([
        [[[null, null, null, null]], 3],
        [[[null, null, null, 'yellow']], 2],
        [[[null, null, 'red', 'yellow']], 1],
        [[[null, 'yellow', 'red', 'yellow']], 0],
        [[['red', 'yellow', 'red', 'yellow']], null]
    ]).it("input", (board, expected_output) => {
        // Act
        actual_output = getRowCoord(0, board);

        // Assert
        expect(actual_output).toEqual(expected_output)
    })
})

 