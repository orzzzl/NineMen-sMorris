/*
* Created by Dongbo on 3/1/15.
*/

/*
Bugs Found:
1. No tie checking:
 The game should ends in the following ways:
 -The first player who has less than three stones loses.
 -The first player who cannot make a legal move loses.
 -If a repetition of a position occurs, the game is a draw.
So the game should be tie if a repetition of a position occurs, otherwise the game would run forever.

 */

describe("In Nine Men's Morris", function() {
    var _gameLogic;

    beforeEach(module("myApp"));

    beforeEach(inject(function(gameLogic) {
        _gameLogic = gameLogic;
    }));


    function expectMoveOk(turnIndexBeforeMove, stateBeforeMove, move) {
        expect(_gameLogic.isMoveOk({turnIndexBeforeMove: turnIndexBeforeMove,
            stateBeforeMove: stateBeforeMove,
            move: move})).toBe(true);
    }

    function expectIllegalMove(turnIndexBeforeMove, stateBeforeMove, move) {
        expect(_gameLogic.isMoveOk({turnIndexBeforeMove: turnIndexBeforeMove,
            stateBeforeMove: stateBeforeMove,
            move: move})).toBe(false);
    }

    /*phase one*/

    it("phase one: placing 'W' in (1, 4) from initial state is legal", function() {
        expectMoveOk(0, {},
            [
                { setTurn: {turnIndex: 1}},
                { set: {key: 'board', value: [ ['', '', '', '', '', '', '', ''],
                                               ['', '', '', '', 'W', '', '', ''],
                                               ['', '', '', '', '', '', '', ''] ]}},
                { set: {key: 'playerStates', value: [ {phase: 1,
                                                     phaseLastTime: 1,
                                                     alreadyMills: []},
                                                    {phase: 1,
                                                     phaseLastTime: 1,
                                                     alreadyMills: []} ]}},
                {set: {key: 'delta', value:
                {
                    destination: [1, 4],
                    origin     : [null, null]
                }}}
            ]);
    });

    it("phase one: placing 'B' in (1, 4) from initial state is not legal", function() {
        expectIllegalMove(0, {},
            [
                { setTurn: {turnIndex: 1}},
                { set: {key: 'board', value: [ ['', '', '', '', '', '', '', ''],
                    ['', '', '', '', 'B', '', '', ''],
                    ['', '', '', '', '', '', '', ''] ]}},
                { set: {key: 'playerStates', value: [ {phase: 1,
                    phaseLastTime: 1,
                    alreadyMills: []},
                    {phase: 1,
                        phaseLastTime: 1,
                        alreadyMills: []} ]}},
                {set: {key: 'delta', value:
                {
                    destination: [1, 4],
                    origin     : [null, null]
                }}}
            ]);
    });

    it("phase one: placing 'B' in (0, 3) from a state is legal", function() {
        expectMoveOk(1,
            {
                board: [ ['W', '', '', '', '', '', '', ''],
                    ['', '', '', '', '', '', '', ''],
                    ['', '', '', '', '', '', '', ''] ],
                delta: {  destination: [0, 0],
                    origin     : [null, null] },
                playerStates: [{ phase: 1,
                    phaseLastTime: 1,
                    alreadyMills: [] },
                    { phase: 1,
                        phaseLastTime: 1,
                        alreadyMills: [] }]
            }, [{setTurn: {turnIndex: 0}},
                {set: {key: 'board', value: [ ['W', '', '', 'B', '', '', '', ''],
                    ['', '', '', '', '', '', '', ''],
                    ['', '', '', '', '', '', '', '']]}},
                {set: {key: 'playerStates', value: [{ phase: 1,
                    phaseLastTime: 1,
                    alreadyMills: [] },
                    { phase: 1,
                        phaseLastTime: 1,
                        alreadyMills: [] }]}},
                {set: {key: 'delta', value:
                {
                    destination: [0, 3],
                    origin     : [null, null]
                }}}
            ]);
    });

    it("phase one: placing piece when there already has one is not legal", function() {
        expectIllegalMove(1,
            {
                board: [ ['W', '', '', '', '', '', '', ''],
                    ['', '', '', '', '', '', '', ''],
                    ['', '', '', '', '', '', '', ''] ],
                delta: {  destination: [0, 0],
                    origin     : [null, null] },
                playerStates: [{ phase: 1,
                    phaseLastTime: 1,
                    alreadyMills: [] },
                    { phase: 1,
                        phaseLastTime: 1,
                        alreadyMills: [] }]
            }, [{setTurn: {turnIndex: 0}},
                {set: {key: 'board', value: [ ['B', '', '', '', '', '', '', ''],
                    ['', '', '', '', '', '', '', ''],
                    ['', '', '', '', '', '', '', '']]}},
                {set: {key: 'playerStates', value: [{ phase: 1,
                    phaseLastTime: 1,
                    alreadyMills: [] },
                    { phase: 1,
                        phaseLastTime: 1,
                        alreadyMills: [] }]}},
                {set: {key: 'delta', value:
                {
                    destination: [0, 0],
                    origin     : [null, null]
                }}}
            ]);
    });

    it("phase one: placing 'B' in (0, 3) when it's not B's turn is not legal", function() {
        expectIllegalMove(0,
            {
                board: [ ['W', '', '', '', '', '', '', ''],
                    ['', '', '', '', '', '', '', ''],
                    ['', '', '', '', '', '', '', ''] ],
                delta: {  destination: [0, 0],
                    origin     : [null, null] },
                playerStates: [{ phase: 1,
                    phaseLastTime: 1,
                    alreadyMills: [] },
                    { phase: 1,
                        phaseLastTime: 1,
                        alreadyMills: [] }]
            }, [{setTurn: {turnIndex: 1}},
                {set: {key: 'board', value: [ ['W', '', '', 'B', '', '', '', ''],
                    ['', '', '', '', '', '', '', ''],
                    ['', '', '', '', '', '', '', '']]}},
                {set: {key: 'playerStates', value: [{ phase: 1,
                    phaseLastTime: 1,
                    alreadyMills: [] },
                    { phase: 1,
                        phaseLastTime: 1,
                        alreadyMills: [] }]}},
                {set: {key: 'delta', value:
                {
                    destination: [0, 3],
                    origin     : [null, null]
                }}}
            ]);
    });

    it("phase one: moving 'B' from (0, 0) to (0, 1) from a state is not legal", function() {
        expectIllegalMove(1,
            {
                board: [ ['B', '', 'B', 'W', '', '', '', ''],
                    ['', '', '', '', '', '', '', ''],
                    ['', '', '', '', '', '', '', 'W'] ],
                delta: {  destination: [0, 3],
                    origin     : [0, 4]  },
                playerStates: [{ phase: 2,
                    phaseLastTime: 2,
                    alreadyMills: [] },
                    {  phase: 2,
                        phaseLastTime: 2,
                        alreadyMills: [] }]
            }, [{setTurn: {turnIndex: 0}},
                {set: {key: 'board', value: [ ['', 'B', 'B', 'W', '', '', '', ''],
                    ['', '', '', '', '', '', '', ''],
                    ['', '', '', '', '', '', '', 'W'] ]}},
                {set: {key: 'playerStates', value: [{ phase: 2,
                    phaseLastTime: 2,
                    alreadyMills: [] },
                    { phase: 2,
                        phaseLastTime: 2,
                        alreadyMills: [] }]}},
                {set: {key: 'delta', value:
                {
                    destination: [0, 1],
                    origin     : [0, 0]
                }}}
            ]);
    });

    it("phase two: moving 'B' from (0, 0) to (0, 7) from a state is legal", function() {
        expectMoveOk(1,
            {
                board: [ ['B', '', 'B', 'W', '', 'B', '', ''],
                         ['', '', '', 'B', 'B', '', 'W', 'W'],
                         ['', '', 'B', 'W', '', 'W', '', 'W'] ],
                delta: {  destination: [0, 3],
                          origin     : [0, 4]  },
                playerStates: [{ phase: 2,
                                 phaseLastTime: 2,
                                 alreadyMills: [] },
                              {  phase: 2,
                                 phaseLastTime: 2,
                                 alreadyMills: [] }]
            }, [{setTurn: {turnIndex: 0}},
                {set: {key: 'board', value: [ ['', 'B', 'B', 'W', '', 'B', '', ''],
                                              ['', '', '', 'B', 'B', '', 'W', 'W'],
                                              ['', '', 'B', 'W', '', 'W', '', 'W'] ]}},
                {set: {key: 'playerStates', value: [{ phase: 2,
                                                      phaseLastTime: 2,
                                                      alreadyMills: [] },
                                                    { phase: 2,
                                                      phaseLastTime: 2,
                                                      alreadyMills: [] }]}},
                {set: {key: 'delta', value:
                {
                    destination: [0, 1],
                    origin     : [0, 0]
                }}}
            ]);
    });

    it("phase two: moving 'B' from (0, 0) to (0, 7) from a state is legal", function() {
        expectMoveOk(1,
            {
                board: [ ['B', '', 'B', 'W', '', 'B', '', ''],
                    ['', '', '', 'B', 'B', '', 'W', 'W'],
                    ['', '', 'B', 'W', '', 'W', '', 'W'] ],
                delta: {  destination: [0, 3],
                    origin     : [0, 4]  },
                playerStates: [{ phase: 2,
                    phaseLastTime: 2,
                    alreadyMills: [] },
                    {  phase: 2,
                        phaseLastTime: 2,
                        alreadyMills: [] }]
            }, [{setTurn: {turnIndex: 0}},
                {set: {key: 'board', value: [ ['', '', 'B', 'W', '', 'B', '', 'B'],
                    ['', '', '', 'B', 'B', '', 'W', 'W'],
                    ['', '', 'B', 'W', '', 'W', '', 'W'] ]}},
                {set: {key: 'playerStates', value: [{ phase: 2,
                    phaseLastTime: 2,
                    alreadyMills: [] },
                    { phase: 2,
                        phaseLastTime: 2,
                        alreadyMills: [] }]}},
                {set: {key: 'delta', value:
                {
                    destination: [0, 7],
                    origin     : [0, 0]
                }}}
            ]);
    });

    it("phase two: moving 'B' from (0, 0) to (2, 4) from a state is not legal", function() {
        expectIllegalMove(1,
            {
                board: [ ['B', '', 'B', 'W', '', 'B', '', ''],
                    ['', '', '', 'B', 'B', '', 'W', 'W'],
                    ['', '', 'B', 'W', '', 'W', '', 'W'] ],
                delta: {  destination: [0, 3],
                    origin     : [0, 4]  },
                playerStates: [{ phase: 2,
                    phaseLastTime: 2,
                    alreadyMills: [] },
                    {  phase: 2,
                        phaseLastTime: 2,
                        alreadyMills: [] }]
            }, [{setTurn: {turnIndex: 0}},
                {set: {key: 'board', value: [ ['', '', 'B', 'W', '', 'B', '', ''],
                    ['', '', '', 'B', 'B', '', 'W', 'W'],
                    ['', '', 'B', 'W', 'B', 'W', '', 'W'] ]}},
                {set: {key: 'playerStates', value: [{ phase: 2,
                    phaseLastTime: 2,
                    alreadyMills: [] },
                    { phase: 2,
                        phaseLastTime: 2,
                        alreadyMills: [] }]}},
                {set: {key: 'delta', value:
                {
                    destination: [2, 4],
                    origin     : [0, 0]
                }}}
            ]);
    });

    it("phase one: forming a mill and change to phase four", function() {
        expectMoveOk(0,
            {board: [ ['B', '', 'B', 'W', '', 'B', '', ''],
                ['', '', '', 'B', 'B', '', 'W', 'W'],
                ['', '', 'B', 'W', '', 'W', '', 'W'] ],
                delta: { destination: [0, 2], origin: [null, null] },
                playerStates: [{
                    phase: 1,
                    phaseLastTime: 1,
                    alreadyMills: []}, {
                    phase: 1,
                    phaseLastTime: 1,
                    alreadyMills: []}]}, [
                {setTurn: {turnIndex: 0}},
                {set: {key: 'board', value: [
                    ['B', '', 'B', 'W', '', 'B', '', ''],
                    ['W', '', '', 'B', 'B', '', 'W', 'W'],
                    ['', '', 'B', 'W', '', 'W', '', 'W']
                ]}},
                {set: {key: 'playerStates', value: [{ phase: 4,
                                                      phaseLastTime: 1,
                                                      alreadyMills: [[[1, 6], [1, 7], [1, 0]]] },
                                                    { phase: 1,
                                                      phaseLastTime: 1,
                                                      alreadyMills: [] }]}},
                {set: {key: 'delta', value:
                {   destination: [1, 0],
                    origin     : [null, null]
                }}}]);
    });

    it("phase four: remove an enemy's man", function() {
        expectMoveOk(0,
            {board: [ ['B', '', 'B', 'W', '', 'B', '', 'W'],
                      ['', '', '', 'B', 'B', '', 'W', 'W'],
                      ['', '', 'B', 'W', '', 'W', '', 'W'] ],
                delta: { destination: [0, 7],
                         origin     : [null, null] },
                playerStates: [{
                    phase: 4,
                    phaseLastTime: 1,
                    alreadyMills: [[[0, 7], [1, 7], [2, 7]]]}, {
                    phase: 1,
                    phaseLastTime: 1,
                    alreadyMills: []}]}, [
                {setTurn: {turnIndex: 1}},
                {set: {key: 'board', value: [
                    ['', '', 'B', 'W', '', 'B', '', 'W'],
                    ['', '', '', 'B', 'B', '', 'W', 'W'],
                    ['', '', 'B', 'W', '', 'W', '', 'W'] ]}},
                {set: {key: 'playerStates', value: [{ phase: 1,
                                                      phaseLastTime: 4,
                                                      alreadyMills: [[[0, 7], [1, 7], [2, 7]]] },
                                                    { phase: 1,
                                                      phaseLastTime: 1,
                                                      alreadyMills: [] }]}},
                {set: {key: 'delta', value:
                {   destination: [null, null],
                    origin     : [0, 0]
                }}}
            ]);
    });

    it("phase four: remove an enemy's man when it's not the right turn is not legal", function() {
        expectIllegalMove(1,
            {board: [ ['B', '', 'B', 'W', '', 'B', '', 'W'],
                ['', '', '', 'B', 'B', '', 'W', 'W'],
                ['', '', 'B', 'W', '', 'W', '', 'W'] ],
                delta: { destination: [0, 7],
                    origin     : [null, null] },
                playerStates: [{
                    phase: 4,
                    phaseLastTime: 1,
                    alreadyMills: [[[0, 7], [1, 7], [2, 7]]]}, {
                    phase: 1,
                    phaseLastTime: 1,
                    alreadyMills: []}]}, [
                {setTurn: {turnIndex: 0}},
                {set: {key: 'board', value: [
                    ['', '', 'B', 'W', '', 'B', '', 'W'],
                    ['', '', '', 'B', 'B', '', 'W', 'W'],
                    ['', '', 'B', 'W', '', 'W', '', 'W'] ]}},
                {set: {key: 'playerStates', value: [{ phase: 1,
                    phaseLastTime: 4,
                    alreadyMills: [[[0, 7], [1, 7], [2, 7]]] },
                    { phase: 1,
                        phaseLastTime: 1,
                        alreadyMills: [] }]}},
                {set: {key: 'delta', value:
                {   destination: [null, null],
                    origin     : [0, 0]
                }}}
            ]);
    });

    it("phase four: remove nothing when need to remove an enemy's man is not legal", function() {
        expectIllegalMove(0,
            {board: [ ['B', '', 'B', 'W', '', 'B', '', 'W'],
                ['', '', '', 'B', 'B', '', 'W', 'W'],
                ['', '', 'B', 'W', '', 'W', '', 'W'] ],
                delta: { destination: [0, 7],
                    origin     : [null, null] },
                playerStates: [{
                    phase: 4,
                    phaseLastTime: 1,
                    alreadyMills: [[[0, 7], [1, 7], [2, 7]]]}, {
                    phase: 1,
                    phaseLastTime: 1,
                    alreadyMills: []}]}, [
                {setTurn: {turnIndex: 1}},
                {set: {key: 'board', value: [
                    ['B', '', 'B', 'W', '', 'B', '', 'W'],
                    ['', '', '', 'B', 'B', '', 'W', 'W'],
                    ['', '', 'B', 'W', '', 'W', '', 'W'] ]}},
                {set: {key: 'playerStates', value: [{ phase: 1,
                    phaseLastTime: 4,
                    alreadyMills: [[[0, 7], [1, 7], [2, 7]]] },
                    { phase: 1,
                        phaseLastTime: 1,
                        alreadyMills: [] }]}},
                {set: {key: 'delta', value:
                {   destination: [null, null],
                    origin     : [0, 1]
                }}}
            ]);
    });

    it("phase four: not remove an enemy's man when is should be is not legal", function() {
        expectIllegalMove(0,
            {board: [ ['B', '', 'B', 'W', '', 'B', '', 'W'],
                ['', '', '', 'B', 'B', '', 'W', 'W'],
                ['', '', 'B', 'W', '', 'W', '', 'W'] ],
                delta: { destination: [0, 7],
                    origin     : [null, null] },
                playerStates: [{
                    phase: 4,
                    phaseLastTime: 1,
                    alreadyMills: [[[0, 7], [1, 7], [2, 7]]]}, {
                    phase: 1,
                    phaseLastTime: 1,
                    alreadyMills: []}]}, [
                {setTurn: {turnIndex: 1}},
                {set: {key: 'board', value: [
                    ['B', '', 'B', 'W', '', 'B', '', 'W'],
                    ['', '', '', 'B', 'B', '', 'W', 'W'],
                    ['', '', 'B', 'W', '', 'W', '', 'W'] ]}},
                {set: {key: 'playerStates', value: [{ phase: 1,
                    phaseLastTime: 4,
                    alreadyMills: [[[0, 7], [1, 7], [2, 7]]] },
                    { phase: 1,
                        phaseLastTime: 1,
                        alreadyMills: [] }]}},
                {set: {key: 'delta', value:
                {   destination: [null, null],
                    origin     : [null, null]
                }}}
            ]);
    });

    it("phase four: alreadyMills mess is not legal", function() {
        expectIllegalMove(0,
            {board: [ ['B', '', 'B', 'W', '', 'B', '', 'W'],
                ['', '', '', 'B', 'B', '', 'W', 'W'],
                ['', '', 'B', 'W', '', 'W', '', 'W'] ],
                delta: { destination: [0, 7],
                    origin     : [null, null] },
                playerStates: [{
                    phase: 4,
                    phaseLastTime: 1,
                    alreadyMills: [[[0, 7], [1, 7], [2, 7]]]}, {
                    phase: 1,
                    phaseLastTime: 1,
                    alreadyMills: []}]}, [
                {setTurn: {turnIndex: 1}},
                {set: {key: 'board', value: [
                    ['', '', 'B', 'W', '', 'B', '', 'W'],
                    ['', '', '', 'B', 'B', '', 'W', 'W'],
                    ['', '', 'B', 'W', '', 'W', '', 'W'] ]}},
                {set: {key: 'playerStates', value: [{ phase: 1,
                    phaseLastTime: 4,
                    alreadyMills: [[[0, 7], [1, 7], [2, 3]]] },
                    { phase: 1,
                        phaseLastTime: 1,
                        alreadyMills: [] }]}},
                {set: {key: 'delta', value:
                {   destination: [null, null],
                    origin     : [0, 0]
                }}}
            ]);
    });

    it("phase four: remove phase move man is not legal", function() {
        expectIllegalMove(0,
            {board: [ ['B', '', 'B', 'W', '', 'B', '', 'W'],
                ['', '', '', 'B', 'B', '', 'W', 'W'],
                ['', '', 'B', 'W', '', 'W', '', 'W'] ],
                delta: { destination: [0, 7],
                    origin     : [null, null] },
                playerStates: [{
                    phase: 4,
                    phaseLastTime: 1,
                    alreadyMills: [[[0, 7], [1, 7], [2, 7]]]}, {
                    phase: 1,
                    phaseLastTime: 1,
                    alreadyMills: []}]}, [
                {setTurn: {turnIndex: 1}},
                {set: {key: 'board', value: [
                    ['', 'B', 'B', 'W', '', 'B', '', 'W'],
                    ['', '', '', 'B', 'B', '', 'W', 'W'],
                    ['', '', 'B', 'W', '', 'W', '', 'W'] ]}},
                {set: {key: 'playerStates', value: [{ phase: 1,
                    phaseLastTime: 4,
                    alreadyMills: [[[0, 7], [1, 7], [2, 7]]] },
                    { phase: 1,
                        phaseLastTime: 1,
                        alreadyMills: [] }]}},
                {set: {key: 'delta', value:
                {   destination: [0, 1],
                    origin     : [0, 0]
                }}}
            ]);
    });

    it("phase four: remove an own man is not legal", function() {
        expectIllegalMove(0,
            {board: [ ['B', '', 'B', 'W', '', 'B', '', 'W'],
                ['', '', '', 'B', 'B', '', 'W', 'W'],
                ['', '', 'B', 'W', '', 'W', '', 'W'] ],
                delta: { destination: [0, 7],
                    origin     : [null, null] },
                playerStates: [{
                    phase: 4,
                    phaseLastTime: 1,
                    alreadyMills: [[[0, 7], [1, 7], [2, 7]]]}, {
                    phase: 1,
                    phaseLastTime: 1,
                    alreadyMills: []}]}, [
                {setTurn: {turnIndex: 1}},
                {set: {key: 'board', value: [
                    ['B', '', 'B', 'W', '', 'B', '', ''],
                    ['', '', '', 'B', 'B', '', 'W', 'W'],
                    ['', '', 'B', 'W', '', 'W', '', 'W'] ]}},
                {set: {key: 'playerStates', value: [{ phase: 1,
                    phaseLastTime: 4,
                    alreadyMills: [[[0, 7], [1, 7], [2, 7]]] },
                    { phase: 1,
                        phaseLastTime: 1,
                        alreadyMills: [] }]}},
                {set: {key: 'delta', value:
                {   destination: [null, null],
                    origin     : [0, 7]
                }}}
            ]);
    });

    it("phase two: 'W' wins when'B' has less than three men is legal", function() {
        expectMoveOk(0, {
                board: [ ['B', '', 'B', 'W', '', 'W', '', 'W'],
                         ['' , '', '' , '' , '', 'W', '', 'W'],
                         ['' , '', 'B', 'W', '', 'W', '', 'W']],
                delta: { destination: [0, 0], origin: [1, 3]},
                playerStates: [{ phase: 4,
                    phaseLastTime: 2,
                    alreadyMills: [[[0, 7], [1, 7], [2, 7]], [[0, 5],[1, 5], [2, 5]]]},
                    { phase: 3,
                        phaseLastTime: 3,
                        alreadyMills: []}]},
            [   {endMatch: {endMatchScores: [1, 0]}},
                {set: {key: 'board', value:
                      [ ['', '', 'B', 'W', '', 'W', '', 'W'],
                        ['' , '', '' , '' , '', 'W', '', 'W'],
                        ['' , '', 'B', 'W', '', 'W', '', 'W']]}},
                {set: {key: 'playerStates', value: [{ phase: 2,
                                                      phaseLastTime: 4,
                                                      alreadyMills: [[[0, 7], [1, 7], [2, 7]], [[0, 5],[1, 5], [2, 5]]] },
                                                    { phase: 3,
                                                      phaseLastTime: 3,
                                                      alreadyMills: [] }]}},
                {set: {key: 'delta', value:
                {   destination: [null, null],
                    origin     : [0, 0]
                }}}
            ]);
    });

    it("phase two: 'B' wins because 'W' has less than three men.", function() {
        expectMoveOk(1, {
                board: [ ['W', '', 'W', 'B', '', 'B', '', 'B'],
                         ['' , '', '' , '' , '', 'B', '', 'B'],
                         ['' , '', 'B', 'W', '', 'B', '', 'B']],
                delta: { destination: [0, 0], origin: [1, 3]},
                playerStates: [{ phase: 3,
                    phaseLastTime: 3,
                    alreadyMills: []},
                    { phase: 4,
                        phaseLastTime: 2,
                        alreadyMills: [[[0, 7], [1, 7], [2, 7]], [[0, 5],[1, 5], [2, 5]]]}]},
            [   {endMatch: {endMatchScores: [0, 1]}},
                {set: {key: 'board', value:
                      [ ['', '', 'W', 'B', '', 'B', '', 'B'],
                        ['' , '', '' , '' , '', 'B', '', 'B'],
                        ['' , '', 'B', 'W', '', 'B', '', 'B']]}},
                {set: {key: 'playerStates', value: [ { phase: 3,
                                                       phaseLastTime: 3,
                                                       alreadyMills: [] },
                                                     { phase: 2,
                                                       phaseLastTime: 4,
                                                       alreadyMills: [[[0, 7], [1, 7], [2, 7]], [[0, 5],[1, 5], [2, 5]]] }]}},
                {set: {key: 'delta', value:
                {   destination: [null, null],
                    origin     : [0, 0]
                }}}
            ]);
    });

    it("phase two: 'W' wins because 'B' has no place to move.", function() {
       expectMoveOk(1, {
           board: [ ['W', '', 'W', 'B', 'W', 'B', 'B', 'B'],
                    ['', 'B', '' , '' , 'B', 'W', 'B', '' ], 
                    ['', '' , '' , '' , '' , 'B', '' , '' ] ],
           delta: { destination: [0, 0], origin: [0, 1]},
           playerStates:[{phase: 2, phaseLastTime: 2, alreadyMills: []},
                         {phase: 2, phaseLastTime: 2, alreadyMills: []}]},
           [   {endMatch: {endMatchScores: [0, 1]}},
               {set: {key: 'board', value:
                   [ ['W', 'B', 'W', 'B', 'W', 'B', 'B', 'B'],
                       ['', '', '' , '' , 'B', 'W', 'B', '' ],
                       ['', '' , '' , '' , '' , 'B', '' , '' ] ]}},
               {set: {key: 'playerStates', value: [{ phase: 2,
                                                     phaseLastTime: 2,
                                                     alreadyMills: [] },
                                                   { phase: 2,
                                                     phaseLastTime: 2,
                                                     alreadyMills: [] }]}},
               {set: {key: 'delta', value:
               {   destination: [0, 1],
                   origin     : [1, 1]
               }}}
           ]);
    });

    it("phase two: 'B' wins because 'W' has no place to move.", function() {
        expectMoveOk(0, {
                board: [ ['B', '', 'B', 'W', 'B', 'W', 'W', 'W'],
                    ['', 'W', '' , '' , 'W', 'B', 'W', '' ],
                    ['', '' , '' , '' , '' , 'W', '' , '' ] ],
                delta: { destination: [0, 0], origin: [0, 1]},
                playerStates:[{phase: 2, phaseLastTime: 2, alreadyMills: []},
                              {phase: 2, phaseLastTime: 2, alreadyMills: []}]},
            [   {endMatch: {endMatchScores: [1, 0]}},
                {set: {key: 'board', value:
                    [ ['B', 'W', 'B', 'W', 'B', 'W', 'W', 'W'],
                        ['', '', '' , '' , 'W', 'B', 'W', '' ],
                        ['', '' , '' , '' , '' , 'W', '' , '' ] ]}},
                {set: {key: 'playerStates', value: [{ phase: 2,
                                                      phaseLastTime: 2,
                                                      alreadyMills: [] },
                                                    { phase: 2,
                                                      phaseLastTime: 2,
                                                      alreadyMills: [] }]}},
                {set: {key: 'delta', value:
                {   destination: [0, 1],
                    origin     : [1, 1]
                }}}
            ]);
    });

    it("phase one: 'W' advanced to phase 2.", function() {
        expectMoveOk(0, {
                board: [ ['B', '', 'B', 'W', 'B', 'W', 'W', ''],
                    ['B', 'W', '' , '' , 'W', 'B', 'W', '' ],
                    ['W', 'B' , 'B' , '' , '' , 'W', '' , '' ] ],
                delta: { destination: [0, 0], origin: [null, null]},
                playerStates:[{phase: 1, phaseLastTime: 1, alreadyMills: []},
                              {phase: 1, phaseLastTime: 1, alreadyMills: []}]},
            [   {setTurn: {turnIndex: 1}},
                {set: {key: 'board', value:
                      [ ['B', '', 'B', 'W', 'B', 'W', 'W', 'W'],
                        ['B', 'W', '' , '' , 'W', 'B', 'W', '' ],
                        ['W', 'B' , 'B' , '' , '' , 'W', '' , '' ] ]}},
                {set: {key: 'playerStates', value: [{ phase: 2,
                                                      phaseLastTime: 1,
                                                      alreadyMills: [] },
                                                    { phase: 1,
                                                      phaseLastTime: 1,
                                                      alreadyMills: [] }]}},
                {set: {key: 'delta', value:
                {   destination: [0, 7],
                    origin     : [null, null]
                }}}
            ]
        );
    });

    it("null move is not legal", function() {
        expectIllegalMove(0, {}, null);
    });

    it("move without board is not legal", function() {
        expectIllegalMove(0, {}, [{setTurn: {turnIndex : 1}}]);
    });

    it("move without delta is not legal", function() {
        expectIllegalMove(0, {}, [{setTurn: {turnIndex : 1}},
            {set: {key: 'board', value:
                [ ['W', '', 'W', 'B', 'W', 'B', 'B', 'B'],
                    ['', 'B', '' , '' , 'B', 'W', 'B', '' ],
                    ['', '' , '' , '' , '' , 'B', '' , '' ] ]}}]);
    });

    it("move without playerStates is not legal", function() {
        expectIllegalMove(0, {
                board: [['B', '', 'B', 'W', '', 'W', '', 'W'],
                    ['', '', '', '', '', 'W', '', 'W'],
                    ['', '', 'B', 'W', '', 'W', '', 'W']],
                delta: { destination: [0, 0], origin: [1, 3]},
                playerStates: [{ phase: 2,
                    phaseLastTime: 4,
                    alreadyMills: [[[0, 7], [1, 7], [2, 7]], [[0, 5],[1, 5], [2, 5]]]},
                    { phase: 3,
                        phaseLastTime: 3,
                        alreadyMills: []}]},
            [   {setTurn: {turnIndex: 1}},
                {set: {key: 'board', value: [
                    ['B', '', 'B', 'W', '', '', 'W', 'W'],
                    ['', '', '', '', '', 'W', '', 'W'],
                    ['', '', 'B', 'W', '', 'W', '', 'W']
                ]}},
                {set: {key: 'delta', value:
                {   destination: [0, 6],
                    origin     : [0, 5]
                }}}
            ]
        );
    });

    it("move with a game that is already over is not legal", function() {
        expectIllegalMove(1, {
                board: [['', '', 'B', 'W', '', 'W', '', 'W'],
                    ['', '', '', '', '', 'W', '', 'W'],
                    ['', '', 'B', 'W', '', 'W', '', 'W']],
                delta: { destination: [null, null], origin: [0, 0]},
                playerStates: [{ phase: 2,
                    phaseLastTime: 4,
                    alreadyMills: [[[0, 7], [1, 7], [2, 7]], [[0, 5],[1, 5], [2, 5]]]},
                    { phase: 3,
                        phaseLastTime: 3,
                        alreadyMills: []}]},
            [   {setTurn: {turnIndex: 0}},
                {set: {key: 'board', value: [
                    ['B', '', '', 'W', '', 'W', '', 'W'],
                    ['', '', '', '', '', 'W', '', 'W'],
                    ['', '', 'B', 'W', '', 'W', '', 'W']
                ]}},
                {set: {key: 'playerStates', value: [{ phase: 2,
                                                      phaseLastTime: 4,
                                                      alreadyMills: [[[0, 7], [1, 7], [2, 7]], [[0, 5],[1, 5], [2, 5]]] },
                                                    { phase: 3,
                                                      phaseLastTime: 3,
                                                      alreadyMills: [] }]}},
                {set: {key: 'delta', value:
                {   destination: [0, 0],
                    origin     : [0, 2]
                }}}
            ]
        );
    });

} );

