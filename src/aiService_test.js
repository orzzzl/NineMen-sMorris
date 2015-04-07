/**
 * Created by zelengzhuang on 4/6/15.
 */

describe("aiService", function() {

    'use strict';

    var _aiService;

    beforeEach(module("myApp"));

    beforeEach(inject(function (aiService) {
        _aiService = aiService;
    }));

    it ("prevent the opposite player to form a mill.", function () {
        var board = [['W', 'W', '', '', '', '', '', ''],
                     ['', 'B', '', '', '', '', '', ''],
                     ['', '', '', '', '', '', '', '']];

        var playerStates = [ {phase: 1,
            count: 2,
            phaseLastTime: 1,
            alreadyMills: []},
            {phase: 1,
                count: 1,
                phaseLastTime: 1,
                alreadyMills: []} ];
        var move = _aiService.createComputerMove (board, playerStates, 1, {maxDepth: 1});
        var expectedMove = [{setTurn: {turnIndex: 0}},
            {set: {key: 'board', value: [ ['W', 'W', 'B', '', '', '', '', ''],
                ['', 'B', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', '']]}},
            {set: {key: 'playerStates', value: [{ phase: 1,
                count: 2,
                phaseLastTime: 1,
                alreadyMills: [] },
                { phase: 1,
                    count: 2,
                    phaseLastTime: 1,
                    alreadyMills: [] }]}},
            {set: {key: 'delta', value:
            {
                destination: [0, 2],
                origin     : [null, null]
            }}}
        ];
        expect(angular.equals(move, expectedMove)).toBe(true);
    });

    it ("computer player will form a mills if it is not stopped.", function () {
        var board = [['', 'W', '', '', '', '', '', ''],
            ['B', 'B', '', '', '', '', '', ''],
            ['W', '', '', 'W', '', '', '', '']];

        var playerStates = [ {phase: 1,
            count: 3,
            phaseLastTime: 1,
            alreadyMills: []},
            {phase: 1,
                count: 2,
                phaseLastTime: 1,
                alreadyMills: []} ];
        var move = _aiService.createComputerMove (board, playerStates, 1, {maxDepth: 1});

        var expectedMove = [{setTurn: {turnIndex: 1}},
            {set: {key: 'board', value: [['', 'W', '', '', '', '', '', ''],
                ['B', 'B', 'B', '', '', '', '', ''],
                ['W', '', '', 'W', '', '', '', '']]}},
            {set: {key: 'playerStates', value: [{ phase: 1,
                count: 3,
                phaseLastTime: 1,
                alreadyMills: [] },
                { phase: 4,
                    count: 3,
                    phaseLastTime: 1,
                    alreadyMills: [[[1,0], [1,1], [1,2]]] }]}},
            {set: {key: 'delta', value:
            {
                destination: [1, 2],
                origin     : [null, null]
            }}}
        ];
        expect(angular.equals(move, expectedMove)).toBe(true);
    });

    it ("end of game test, computer wins", function () {
        var board = [['', 'W', '', '', '', '', '', ''],
            ['B', 'B', '', 'B', '', '', 'B', ''],
            ['W', '', '', 'W', '', '', '', '']];

        var playerStates = [ {phase: 3,
            count: 50,
            phaseLastTime: 3,
            alreadyMills: []},
            {phase: 2,
                count: 49,
                phaseLastTime: 2,
                alreadyMills: []} ];
        var move = _aiService.createComputerMove (board, playerStates, 1, {maxDepth: 1});

        var expectedMove = [{setTurn: {turnIndex: 1}},
            {set: {key: 'board', value: [['', 'W', '', '', '', '', '', ''],
                ['B', 'B', 'B', '', '', '', 'B', ''],
                ['W', '', '', 'W', '', '', '', '']]}},
            {set: {key: 'playerStates', value: [{ phase: 3,
                count: 50,
                phaseLastTime: 3,
                alreadyMills: [] },
                { phase: 4,
                    count: 50,
                    phaseLastTime: 2,
                    alreadyMills: [[[1,0], [1,1], [1,2]]] }]}},
            {set: {key: 'delta', value:
            {
                destination: [1, 2],
                origin     : [1, 3]
            }}}
        ];
        expect(angular.equals(move, expectedMove)).toBe(true);
    });

    it ("end of game test, computer will prevent player from winning", function () {
        var board = [['W', 'W', '', '', 'W', '', '', ''],
            ['B', '', '', 'B', '', 'B', '', ''],
            ['W', '', '', '', '', '', '', '']];

        var playerStates = [ {phase: 2,
            count: 50,
            phaseLastTime: 2,
            alreadyMills: []},
            {phase: 3,
                count: 49,
                phaseLastTime: 3,
                alreadyMills: []} ];
        var move = _aiService.createComputerMove (board, playerStates, 1, {maxDepth: 1});

        var expectedMove = [{setTurn: {turnIndex: 0}},
            {set: {key: 'board', value: [['W', 'W', 'B', '', 'W', '', '', ''],
                ['', '', '', 'B', '', 'B', '', ''],
                ['W', '', '', '', '', '', '', '']]}},
            {set: {key: 'playerStates', value: [{ phase: 2,
                count: 50,
                phaseLastTime: 2,
                alreadyMills: [] },
                { phase: 3,
                    count: 50,
                    phaseLastTime: 3,
                    alreadyMills: [] }]}},
            {set: {key: 'delta', value:
            {
                destination: [0, 2],
                origin     : [1, 0]
            }}}
        ];
        expect(angular.equals(move, expectedMove)).toBe(true);
    });


});

