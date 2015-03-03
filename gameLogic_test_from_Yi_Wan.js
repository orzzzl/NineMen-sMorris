/*************************************************************************
	> File Name: gameLogic_test_from_yi.js
	> Author: Yi Wan
	> Mail: yw1840@nyu.edu
 ************************************************************************/

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
    /**success*/
    it("example of isMoveOk should return true : phase one: placing 'B' in (0, 0) from initial state", function() {
        expectMoveOk(1, {},
            [
                { setTurn: {turnIndex: 0}},
                { set: {key: 'board', value: [ ['B', '', '', '', '', '', '', ''],
                                               ['', '', '', '', '', '', '', ''],
                                               ['', '', '', '', '', '', '', ''] ]}},
                { set: {key: 'playerStates', value: [ {phase: 1,
                                                     phaseLastTime: 1,
                                                     alreadyMills: []},
                                                    {phase: 1,
                                                     phaseLastTime: 1,
                                                     alreadyMills: []} ]}},
                {set: {key: 'delta', value:
                {
                    destination: [0, 0],
                    origin     : [null, null]
                }}}
            ]);
    });
    /**success*/
    it("example of isMoveOk should return false : phase one: placing 'B' in (0, 0) from initial state", function() {
    	var turnIndexBeforeMove = 0;
    	var stateBeforeMove = {};
    	var move = [
                    { setTurn: {turnIndex: 0}},
                    { set: {key: 'board', value: [ ['B', '', '', '', '', '', '', ''],
                                                   ['', '', '', '', '', '', '', ''],
                                                   ['', '', '', '', '', '', '', ''] ]}},
                    { set: {key: 'playerStates', value: [ {phase: 1,
                                                         phaseLastTime: 1,
                                                         alreadyMills: []},
                                                        {phase: 1,
                                                         phaseLastTime: 1,
                                                         alreadyMills: []} ]}},
                    {set: {key: 'delta', value:
                    {
                        destination: [0, 0],
                        origin     : [null, null]
                    }}}
                ];
    	expect(_gameLogic.isMoveOk({turnIndexBeforeMove: turnIndexBeforeMove,
            stateBeforeMove: stateBeforeMove,
            move: move})).toBe(false);
    });

    it("phase one: placing 'B' in (0, 2) from a state is legal", function() {
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
                {set: {key: 'board', value: [ ['W', '', 'B', '', '', '', '', ''],
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
                    destination: [0, 2],
                    origin     : [null, null]
                }}}
                ]);
    });

    it("phase two: moving 'B' from (0, 2) to (0, 1) is legal", function() {
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
                {set: {key: 'board', value: [ ['B', 'B', '', 'W', '', 'B', '', ''],
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
                    origin     : [0, 2]
                }}}
            ]);
    });

    it("phase one: forming a mill and change to phase four", function() {
        expectMoveOk(1,
            {board: [ ['B', '', '', 'W', '', 'B', '', ''],
                      ['', '', '', 'B', 'B', '', 'W', 'W'],
                      ['', '', 'B', 'W', '', 'W', '', 'W'] ],
                delta: { destination: [0, 3], origin: [null, null] },
                playerStates: [{
                        phase: 1,
                        phaseLastTime: 1,
                        alreadyMills: []}, {
                        phase: 1,
                        phaseLastTime: 1,
                        alreadyMills: []}]}, [
                {setTurn: {turnIndex: 1}},
                {set: {key: 'board', value: [
                    ['B', '', '', 'W', '', 'B', '', ''],
                    ['', '', 'B', 'B', 'B', '', 'W', 'W'],
                    ['', '', 'B', 'W', '', 'W', '', 'W']
                ]}},
                {set: {key: 'playerStates', value: [{ phase: 1,
                                                      phaseLastTime: 1,
                                                      alreadyMills: [] },
                                                    { phase: 4,
                                                      phaseLastTime: 1,
                                                      alreadyMills: [[[1, 2], [1, 3], [1, 4]]] }]}},
                {set: {key: 'delta', value:
                {   destination: [1, 2],
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
                    ['B', '', '', 'W', '', 'B', '', 'W'],
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
                    origin     : [0, 2]
                }}}
            ]);
    });

    it("phase three: flying test", function() {
        expectMoveOk(1, {
                board: [['B', '', 'B', 'W', '', '', '', 'W'],
                        ['', '', '', '', '', '', 'W', 'W'],
                        ['', '', 'B', 'W', '', 'W', '', 'W']],
                delta: { destination: [null, null],
                         origin     : [1, 1]},
                playerStates: [{ phase: 2,
                                phaseLastTime: 4,
                                alreadyMills: [[[0, 7], [1, 7], [2, 7]]]},
                               { phase: 3,
                                 phaseLastTime: 2,
                                 alreadyMills: []}]},
                [{setTurn: {turnIndex: 0}},
                 {set: {key: 'board', value: [
                     ['B', '', '', 'W', '', '', '', 'W'],
                     ['', '', 'B', '', '', '', 'W', 'W'],
                     ['', '', 'B', 'W', '', 'W', '', 'W'] ]}},
                 {set: {key: 'playerStates', value: [{ phase: 2,
                                                       phaseLastTime: 4,
                                                       alreadyMills: [[[0, 7], [1, 7], [2, 7]]] },
                                                     { phase: 3,
                                                       phaseLastTime: 3,
                                                       alreadyMills: [] }]}},
                 {set: {key: 'delta', value:
                 {   destination: [1, 2],
                     origin     : [0, 2]
                 }}}
             ]);
    });

    it("phase two: moving out from a mill", function() {
        expectMoveOk(0, {
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
                    ['B', '', 'B', 'W', '', 'W', 'W', ''],
                    ['', '', '', '', '', 'W', '', 'W'],
                    ['', '', 'B', 'W', '', 'W', '', 'W']]}},
                {set: {key: 'playerStates', value: [{ phase: 2,
                                                      phaseLastTime: 2,
                                                      alreadyMills: [[[0, 5], [1, 5], [2, 5]]] },
                                                    { phase: 3,
                                                      phaseLastTime: 3,
                                                      alreadyMills: [] }]}},
                {set: {key: 'delta', value:
                {   destination: [0, 6],
                    origin     : [0, 7]
                }}}
            ]);
    });

    it("phase two: 'W' wins because 'B' has less than three men.", function() {
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
                      [ ['B', '', '', 'W', '', 'W', '', 'W'],
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
                    origin     : [0, 2]
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
                      [ ['W', '', 'W', 'B', '', 'B', '', 'B'],
                        ['' , '', '' , '' , '', 'B', '', 'B'],
                        ['' , '', 'B', '', '', 'B', '', 'B']]}},
                {set: {key: 'playerStates', value: [ { phase: 3,
                                                       phaseLastTime: 3,
                                                       alreadyMills: [] },
                                                     { phase: 2,
                                                       phaseLastTime: 4,
                                                       alreadyMills: [[[0, 7], [1, 7], [2, 7]], [[0, 5],[1, 5], [2, 5]]] }]}},
                {set: {key: 'delta', value:
                {   destination: [null, null],
                    origin     : [2, 3]
                }}}
            ]);
    });

    it("phase two: 'W' wins because 'B' has no place to move.", function() {
       expectMoveOk(1, {
           board: [ ['W', 'B', 'W', '', 'W', 'B', 'B', 'B'],
                    ['', '', '' , 'B' , 'B', 'W', 'B', '' ], 
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
               {   destination: [0, 3],
                   origin     : [1, 3]
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
                      [ ['B', '', 'B', 'W', 'B', 'W', 'W', ''],
                        ['B', 'W', '' , '' , 'W', 'B', 'W', 'W' ],
                        ['W', 'B' , 'B' , '' , '' , 'W', '' , '' ] ]}},
                {set: {key: 'playerStates', value: [{ phase: 2,
                                                      phaseLastTime: 1,
                                                      alreadyMills: [] },
                                                    { phase: 1,
                                                      phaseLastTime: 1,
                                                      alreadyMills: [] }]}},
                {set: {key: 'delta', value:
                {   destination: [1, 7],
                    origin     : [null, null]
                }}}
            ]
        );
    });

    it("move with a game that is already over", function() {
        expectIllegalMove(1, {
                board: [ ['W', '', 'W', 'B', '', 'B', '', 'B'],
                         ['' , '', '' , '' , '', 'B', '', 'B'],
                         ['' , '', 'B', '', '', 'B', '', 'B']],
                delta: { destination: [null, null], origin: [1, 0]},
                playerStates: [{ phase: 3,
                    phaseLastTime: 3,
                    alreadyMills: []},
                    { phase: 2,
                        phaseLastTime: 4,
                        alreadyMills: [[[0, 7], [1, 7], [2, 7]], [[0, 5],[1, 5], [2, 5]]]}]},
            [   {setTurn: {turnIndex: 0}},
                {set: {key: 'board', value: [['W', '', 'W', '', 'B', 'B', '', 'B'],
                                             ['' , '', '' , '' , '', 'B', '', 'B'],
                                             ['' , '', 'B', '', '', 'B', '', 'B']
                ]}},
                {set: {key: 'playerStates', value: [{ phase: 3,
                                                      phaseLastTime: 3,
                                                      alreadyMills: [] },
                                                    { phase: 2,
                                                      phaseLastTime: 4,
                                                      alreadyMills: [[[0, 7], [1, 7], [2, 7]], [[0, 5],[1, 5], [2, 5]]] }]}},
                {set: {key: 'delta', value:
                {   destination: [0, 4],
                    origin     : [0, 3]
                }}}
            ]
        );
    });
} );