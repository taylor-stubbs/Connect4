const request = require('supertest');
const { app } = require('../Server/server.js');
const each = require("jest-each").default;

describe('POST /board', () => {
    let expectedBoard = [[null, null, null, null],
                        [null, null, null, null],
                        [null, null, null, null],
                        [null, null, null, null],
                        [null, null, null, null],
                        [null, null, null, null],
                        [null, null, null, null]];

    it('should return new game state', done => {
        request(app)
            .post('/board').send({    // What are we sending in the post request?
                row: 4,
                col: 7                  // Random number choice
            })
            .expect(200)                // Request succeeded [200]
            .expect(() => {
                expect.objectContaining({
                    players: ['red', 'yellow'],
                    board: expectedBoard,
                    turn: 0,
                    winner: null,
                })
            })
            .end(done);
    });
});

describe('POST /counter', () => {
    let expectedBoard = [[null, null, null, null],
                        [null, null, null, null],
                        [null, null, null, null],
                        [null, null, null, null],
                        [null, null, null, null],
                        [null, null, null, "red"],
                        [null, null, null, null]];
    it('should return game state with updated move', done => {
        request(app)
            .post('/counter').send({    // What are we sending in the post request?
                col: 6                  // Random number choice
            })
            .expect(200)                // Request succeeded [200]
            .expect(() => {
                expect.objectContaining({
                    players: ['red', 'yellow'],
                    board: expectedBoard,
                    turn: 1,
                    winner: null,
                })
            })
            .end(done);
    });
});
