/*************************************************************************
	> File Name: NMM_Logic_Test.js
	> Author: Zeleng Zhuang
	> Mail: zhuangzeleng19920731@gmail.com
	> Created Time: Mon Feb 23 11:25:24 2015
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

    it("phase one: placing 'W' in (0, 0) from initial state is legal", function() {
        expectMoveOk(0, {},
            [
                {
                     setTurn: {turnIndex: 1},
                     updateStates: {
                     player: 0,
                     setPhase: 1,
                     setPhaseLastTime: 1}
                },
                {set: {key: 'board', value: [
                    ['W', '', '', '', '', '', '', ''],
                    ['', '', '', '', '', '', '', ''],
                    ['', '', '', '', '', '', '', '']
                ]}},
                {set: {key: 'delta', value:
                {
                    destination: [0, 0],
                    origin     : [null, null]
                }
                }}
            ]
        );
    });

    it("phase one: placing 'B' in (0, 1) from a state is legal", function() {
        expectMoveOk(1,
            {
                board: [
                    ['W', '', '', '', '', '', '', ''],
                    ['', '', '', '', '', '', '', ''],
                    ['', '', '', '', '', '', '', '']
                ],
                delta: {
                    destination: [0, 0],
                    origin     : [null, null]
                },
                playerStates: [
                    {
                        phase: 1,
                        phaseLastTime: 1,
                        alreadyMills: []
                    },
                    {
                        phase: 1,
                        phaseLastTime: 1,
                        alreadyMills: []
                    }
                ]
            }, [
                {
                    setTurn: {turnIndex: 0},
                    updateStates: {
                        player: 1,
                        setPhase: 1,
                        setPhaseLastTime: 1}
                },
                {set: {key: 'board', value: [
                    ['W', 'B', '', '', '', '', '', ''],
                    ['', '', '', '', '', '', '', ''],
                    ['', '', '', '', '', '', '', '']
                ]}},
                {set: {key: 'delta', value:
                {
                    destination: [0, 1],
                    origin     : [null, null]
                }
                }}
                ]
        );
    });

    it("phase two: moving 'B' in (0, 1) from a state is legal", function() {
        expectMoveOk(1,
            {
                board: [
                    ['B', '', 'B', 'W', '', 'B', '', ''],
                    ['', '', '', 'B', 'B', '', 'W', 'W'],
                    ['', '', 'B', 'W', '', 'W', '', 'W']
                ],
                delta: {
                    destination: [0, 3],
                    origin     : [0, 4]
                },
                playerStates: [
                    {
                        phase: 2,
                        phaseLastTime: 2,
                        alreadyMills: []
                    },
                    {
                        phase: 2,
                        phaseLastTime: 2,
                        alreadyMills: []
                    }
                ]
            }, [
                {
                    setTurn: {turnIndex: 0},
                    updateStates: {
                        player: 1,
                        setPhase: 2,
                        setPhaseLastTime: 2}
                },
                {set: {key: 'board', value: [
                    ['', 'B', 'B', 'W', '', 'B', '', ''],
                    ['', '', '', 'B', 'B', '', 'W', 'W'],
                    ['', '', 'B', 'W', '', 'W', '', 'W']
                ]}},
                {set: {key: 'delta', value:
                {
                    destination: [0, 1],
                    origin     : [0, 0]
                }
                }}
            ]
        );
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
                        alreadyMills: []}]}, [{
                    setTurn: {turnIndex: 0},
                    updateStates: {
                        player: 0,
                        setAlreadyMills:[[[0, 7], [1, 7], [2, 7]]],
                        setPhase: 4,
                        setPhaseLastTime: 1}},
                {set: {key: 'board', value: [
                    ['B', '', 'B', 'W', '', 'B', '', 'W'],
                    ['', '', '', 'B', 'B', '', 'W', 'W'],
                    ['', '', 'B', 'W', '', 'W', '', 'W']
                ]}}, {set: {key: 'delta', value:
                {   destination: [0, 7],
                    origin     : [null, null]
                }}}]);
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
                    alreadyMills: []}]}, [{
                setTurn: {turnIndex: 0},
                updateStates: {
                    player: 0,
                    setAlreadyMills:[[[1, 6], [1, 7], [1, 0]]],
                    setPhase: 4,
                    setPhaseLastTime: 1}},
                {set: {key: 'board', value: [
                    ['B', '', 'B', 'W', '', 'B', '', ''],
                    ['W', '', '', 'B', 'B', '', 'W', 'W'],
                    ['', '', 'B', 'W', '', 'W', '', 'W']
                ]}}, {set: {key: 'delta', value:
                {   destination: [1, 0],
                    origin     : [null, null]
                }}}]);
    });

    it("phase one: forming a mill and change to phase four", function() {
        expectMoveOk(1,
            {board: [ ['B', 'B', '', 'W', '', 'B', '', ''],
                      ['', '', '', 'B', 'B', '', 'W', 'W'],
                      ['', 'B', '', 'W', '', 'W', '', 'W'] ],
                delta: { destination: [0, 3], origin: [null, null] },
                playerStates: [{
                    phase: 1,
                    phaseLastTime: 1,
                    alreadyMills: []}, {
                    phase: 1,
                    phaseLastTime: 1,
                    alreadyMills: []}]}, [{
                setTurn: {turnIndex: 1},
                updateStates: {
                    player: 1,
                    setAlreadyMills:[[[0, 1], [1, 1], [2, 1]]],
                    setPhase: 4,
                    setPhaseLastTime: 1}},
                {set: {key: 'board', value: [
                    ['B', 'B', '', 'W', '', 'B', '', ''],
                    ['', 'B', '', 'B', 'B', '', 'W', 'W'],
                    ['', 'B', '', 'W', '', 'W', '', 'W']
                ]}}, {set: {key: 'delta', value:
                {   destination: [1, 1],
                    origin     : [null, null]
                }}}]);
    });

    it("phase one: forming a mill and change to phase four", function() {
        expectMoveOk(1,
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
                    alreadyMills: []}]}, [{
                setTurn: {turnIndex: 1},
                updateStates: {
                    player: 1,
                    setAlreadyMills:[[[1, 2], [1, 3], [1, 4]]],
                    setPhase: 4,
                    setPhaseLastTime: 1}},
                {set: {key: 'board', value: [
                    ['B', '', 'B', 'W', '', 'B', '', ''],
                    ['', '', 'B', 'B', 'B', '', 'W', 'W'],
                    ['', '', 'B', 'W', '', 'W', '', 'W']
                ]}}, {set: {key: 'delta', value:
                {   destination: [1, 2],
                    origin     : [null, null]
                }}}]);
    });

    it("phase four: remove an enemy's man", function() {
        expectMoveOk(0,
            {
                board: [
                    ['B', '', 'B', 'W', '', 'B', '', 'W'],
                    ['', '', '', 'B', 'B', '', 'W', 'W'],
                    ['', '', 'B', 'W', '', 'W', '', 'W']
                ],
                delta: {
                    destination: [0, 7],
                    origin     : [null, null]
                },
                playerStates: [
                {
                    phase: 4,
                    phaseLastTime: 1,
                    alreadyMills: [[[0, 7], [1, 7], [2, 7]]]
                },
                {
                        phase: 1,
                        phaseLastTime: 1,
                        alreadyMills: []
                }
                ]

            }, [
                {
                    setTurn: {turnIndex: 1},
                    updateStates: {
                        player: 0,
                        setPhase: 1,
                        setPhaseLastTime: 4}
                },
                {set: {key: 'board', value: [
                    ['', '', 'B', 'W', '', 'B', '', 'W'],
                    ['', '', '', 'B', 'B', '', 'W', 'W'],
                    ['', '', 'B', 'W', '', 'W', '', 'W']
                ]}},
                {set: {key: 'delta', value:
                {
                    destination: [null, null],
                    origin     : [0, 0]
                }
                }}
            ]
            );
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
             [{  setTurn: {turnIndex: 0},
                 updateStates: { player: 1,
                                 setPhase: 3,
                                 setPhaseLastTime: 3}},
                 {set: {key: 'board', value: [
                     ['', '', 'B', 'W', '', '', '', 'W'],
                     ['', '', '', 'B', '', '', 'W', 'W'],
                     ['', '', 'B', 'W', '', 'W', '', 'W']
                 ]}},
                 {set: {key: 'delta', value:
                 {   destination: [1, 3],
                     origin     : [0, 0]
                 }}}
             ]
        );
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
            [{  setTurn: {turnIndex: 1},
                updateStates: { player: 0,
                    setPhase: 2,
                    setPhaseLastTime: 2,
                    setAlreadyMills: [[[0, 7], [1, 7], [2, 7]]]}},
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

    it("phase two: 'W' wins because 'B' has less than three men.", function() {
        expectMoveOk(0, {
                board: [ ['B', '', 'B', 'W', '', 'W', '', 'W'],
                         ['' , '', '' , '' , '', 'W', '', 'W'],
                         ['' , '', 'B', 'W', '', 'W', '', 'W']],
                delta: { destination: [0, 0], origin: [1, 3]},
                playerStates: [{ phase: 4,
                    phaseLastTime: 2,
                    alreadyMills: [[[0, 7], [1, 7], [2, 7]]]},
                    { phase: 3,
                        phaseLastTime: 3,
                        alreadyMills: []}]},
            [   {endMatch: {endMatchScores: [1, 0]}},
                {set: {key: 'board', value:
                    [ ['', '', 'B', 'W', '', 'W', '', 'W'],
                        ['' , '', '' , '' , '', 'W', '', 'W'],
                        ['' , '', 'B', 'W', '', 'W', '', 'W']]}},
                {set: {key: 'delta', value:
                {   destination: [null, null],
                    origin     : [0, 0]
                }}}
            ]
        );
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
                        alreadyMills: [[[0, 7], [1, 7], [2, 7]]]}]},
            [   {endMatch: {endMatchScores: [0, 1]}},
                {set: {key: 'board', value:
                    [ ['', '', 'W', 'B', '', 'B', '', 'B'],
                        ['' , '', '' , '' , '', 'B', '', 'B'],
                        ['' , '', 'B', 'W', '', 'B', '', 'B']]}},
                {set: {key: 'delta', value:
                {   destination: [null, null],
                    origin     : [0, 0]
                }}}
            ]
        );
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
               {set: {key: 'delta', value:
               {   destination: [0, 1],
                   origin     : [1, 1]
               }}}
           ]
       );
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
                {set: {key: 'delta', value:
                {   destination: [0, 1],
                    origin     : [1, 1]
                }}}
            ]
        );
    });


    it("phase one: 'W' advanced to phase 2.", function() {
        expectMoveOk(0, {
                board: [ ['B', '', 'B', 'W', 'B', 'W', 'W', ''],
                    ['B', 'W', '' , '' , 'W', 'B', 'W', '' ],
                    ['W', 'B' , 'B' , '' , '' , 'W', '' , '' ] ],
                delta: { destination: [0, 0], origin: [null, null]},
                playerStates:[{phase: 1, phaseLastTime: 1, alreadyMills: []},
                    {phase: 1, phaseLastTime: 1, alreadyMills: []}]},
            [   {  setTurn: {turnIndex: 1},
                updateStates: { player: 0,
                    setPhase: 2,
                    setPhaseLastTime: 1,
                    }},
                {set: {key: 'board', value:
                    [ ['B', '', 'B', 'W', 'B', 'W', 'W', 'W'],
                        ['B', 'W', '' , '' , 'W', 'B', 'W', '' ],
                        ['W', 'B' , 'B' , '' , '' , 'W', '' , '' ] ]}},
                {set: {key: 'delta', value:
                {   destination: [0, 7],
                    origin     : [null, null]
                }}}
            ]
        );
    });

    it("null move is illegal", function() {
        expectIllegalMove(0, {}, null);
    });

    it("move without board is illegal", function() {
        expectIllegalMove(0, {}, [{setTurn: {turnIndex : 1}}]);
    });

    it("move without delta is illegal", function() {
        expectIllegalMove(0, {}, [{setTurn: {turnIndex : 1}},
            {set: {key: 'board', value:
                [ ['W', '', 'W', 'B', 'W', 'B', 'B', 'B'],
                    ['', 'B', '' , '' , 'B', 'W', 'B', '' ],
                    ['', '' , '' , '' , '' , 'B', '' , '' ] ]}}]);
    });

    it("move without update phase when there should be", function() {
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

    it("move with a game that is already over", function() {
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
            [   {setTurn: {turnIndex: 0},
                updateStates: { player: 1,
                    setPhase: 3,
                    setPhaseLastTime: 3,
                    setAlreadyMills: []}},
                {set: {key: 'board', value: [
                    ['B', '', '', 'W', '', 'W', '', 'W'],
                    ['', '', '', '', '', 'W', '', 'W'],
                    ['', '', 'B', 'W', '', 'W', '', 'W']
                ]}},
                {set: {key: 'delta', value:
                {   destination: [0, 0],
                    origin     : [0, 2]
                }}}
            ]
        );
    });

    it("getPossibleMoves returns exactly one cell", function() {
        var board = [ ['', 'W', 'W', 'B', 'W', 'B', 'B', 'B'],
                      ['', 'B', '' , '' , 'B', 'W', 'B', '' ],
                      ['', '' , '' , '' , '' , 'B', '' , '' ] ];
        var playerStates = [{phase: 2, phaseLastTime: 2, alreadyMills: []},
                            {phase: 2, phaseLastTime: 2, alreadyMills: []}];
        var possibleMoves = _gameLogic.getAllPossibleMove(board, playerStates, 0);
        var expectedMove = [
            {   setTurn: {turnIndex: 1},
                updateStates: { player: 0,
                    setPhase: 2,
                    setPhaseLastTime: 2}},
            {   set: {key: 'board', value:
                  [ ['W', '', 'W', 'B', 'W', 'B', 'B', 'B' ],
                    ['' , 'B', '' , '' , 'B', 'W', 'B', '' ],
                    ['' , '' , '' , '' , '' , 'B', '' , '' ] ]
            }},
            {   set: {key: 'delta', value:
            {       destination: [0, 0],
                    origin     : [0, 1]
            }}}];
        expect(angular.equals(possibleMoves, [expectedMove])).toBe(true);
    });

    it("getPossibleMoves returns exactly one cell", function() {
        var board = [ ['', 'W', 'W', 'B', 'W', 'B', 'B', 'B'],
            ['', 'B', '' , '' , 'B', 'W', 'B', '' ],
            ['', '' , '' , '' , '' , 'B', '' , '' ] ];
        var playerStates = [{phase: 1, phaseLastTime: 1, alreadyMills: []},
            {phase: 1, phaseLastTime: 1, alreadyMills: []}];
        var possibleMoves = _gameLogic.getAllPossibleMove(board, playerStates, 0);
        var expectedMove = undefined;
        expect(angular.equals(possibleMoves, [expectedMove])).toBe(false);
    });

    it("getPossibleMoves returns exactly one cell", function() {
        var board = [ ['', 'W', 'W', 'B', 'W', 'B', 'B', 'B'],
            ['', 'B', '' , '' , 'B', 'W', 'B', '' ],
            ['', '' , '' , '' , '' , 'B', '' , '' ] ];
        var playerStates = [{phase: 4, phaseLastTime: 2, alreadyMills: []},
            {phase: 2, phaseLastTime: 2, alreadyMills: []}];
        var possibleMoves = _gameLogic.getAllPossibleMove(board, playerStates, 0);
        var expectedMove = undefined;
        expect(angular.equals(possibleMoves, [expectedMove])).toBe(false);
    });

} );

