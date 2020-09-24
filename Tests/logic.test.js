const { timeStamp } = require('console');
const { placeCounter, createBoard, switchPlayer, checkWin } = require('../Server/server.js');

// Unit Tests

test('Can place a counter', () => {
    // Arrange
    let originalBoard = [[null, null, null, null],
                    [null, null, null, null],
                    [null, null, null, null],
                    [null, null, null, null]];
    
    let expectedBoard = [[null, null, null, null],
                    [null, null, null, null],
                    [null, null, null, null],
                    [null, null, null, 'red']];
    
    // Act
    let actualBoard = placeCounter(3, originalBoard, 'red');

    // Assert
    expect(expectedBoard).toEqual(actualBoard);
});

test('Can create board', () => {
    // Arrange

    // 4x5 Board
    let expectedBoard = [[null, null, null, null],
                    [null, null, null, null],
                    [null, null, null, null],
                    [null, null, null, null],
                    [null, null, null, null]];
    
    // Act
    let actualBoard = createBoard(4,5);

    // Assert
    expect(expectedBoard).toEqual(actualBoard);
});

test('Can switch player', () => {
    // Arrange
    let originalTurn = 0;

    let expectedTurn = 1;
    
    // Act
    let actualTurn = switchPlayer(originalTurn);

    // Assert
    expect(expectedTurn).toEqual(actualTurn)

});

test('Can win vertically', () => {
    // Arrange
    let originalBoard = [[null, null, null, null],
                        [null, null, null, null],
                        ['red', 'red', 'red', 'red'],
                        [null, null, null, null]];

    let expectedWinner = 'red';
    
    // Act
    let actualWinner = checkWin(0, 2, originalBoard);

    // Assert
    expect(expectedWinner).toEqual(actualWinner);
});

test('Can win horizontally', () => {
    // Arrange
    let originalBoard = [['yellow', null, null, null],
                        ['yellow', null, null, null],
                        ['yellow', null, null, null],
                        ['yellow', null, null, null],
                        [null, null, null, null]];

    let expectedWinner = 'yellow';

    // Act
    let actualWinner = checkWin(0, 0, originalBoard);

    // Assert
    expect(expectedWinner).toEqual(actualWinner);
});

it.todo('Can win diagonally +ve');

it.todo('Can win diagonally -ve');

it.todo('Cannot create board greater than 10x12');

it.todo('Cannot place a counter in full column');

it.todo('Game over when board is full');

it.todo('Can increase player score');



 