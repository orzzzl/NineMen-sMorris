/* https://github.com/angular/protractor/blob/master/docs/toc.md */


describe('NineMen-sMorris', function() {

    'use strict';

    beforeEach(function() {
        browser.get('http://localhost:9002/game.min.html');
    });

    function getDiv(row, col) {
        return element(by.id('e2e_test_div_' + row + 'x' + col));
    }

    function getImg(row, col) {
        return element(by.id('e2e_test_img_' + row + 'x' + col));
    }

    function expectPiece(row, col, pieceKind) {
        // Careful when using animations and asserting isDisplayed:
        // Originally, my animation started from {opacity: 0;}
        // And then the image wasn't displayed.
        // I changed it to start from {opacity: 0.1;}
        var picUrl;

        if (pieceKind === "")
            picUrl = null;
        else if (pieceKind === "W")
            picUrl = "http://localhost:9002/imgs/john.png";
        else if (pieceKind === "B")
            picUrl = "http://localhost:9002/imgs/nick.png";
        else if (pieceKind === "A")
            picUrl = "http://localhost:9002/imgs/john_selected.png";
        else if (pieceKind === "C")
            picUrl = "http://localhost:9002/imgs/nick_selected.png";

        expect(getImg(row, col).isDisplayed()).toEqual(pieceKind === "" ? false : true);
        if (pieceKind !== "")
            expect(getImg(row, col).getAttribute("src")).toEqual(picUrl);
    }

    function expectBoard(board) {
        for (var row = 0; row < 3; row++) {
            for (var col = 0; col < 8; col++) {
                //console.log(row+" "+col+" "+board[row][col]);
                expectPiece(row, col, board[row][col]);
            }
        }
    }

    function clickDivAndExpectPiece(row, col, pieceKind) {
        getDiv(row, col).click();
        expectPiece(row, col, pieceKind);
    }

    // playMode is either: 'passAndPlay', 'playAgainstTheComputer', 'onlyAIs',
    // or a number representing the playerIndex (-2 for viewer, 0 for white player, 1 for black player, etc)
    function setMatchState(matchState, playMode) {
        browser.executeScript(function(matchStateInJson, playMode) {
            var stateService = window.e2e_test_stateService;
            stateService.setMatchState(angular.fromJson(matchStateInJson));
            stateService.setPlayMode(angular.fromJson(playMode));
            angular.element(document).scope().$apply(); // to tell angular that things changes.
        }, JSON.stringify(matchState), JSON.stringify(playMode));
    }


    it('should have a title', function () {
        expect(browser.getTitle()).toEqual("Nine Men's Morris");
    });

    it('should have an empty NNM board', function () {
        expectBoard(
            [['', '', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', '', '']]);
    });



    it('should show W if I click in 0x0', function () {
        clickDivAndExpectPiece(0, 0, "W");
        expectBoard(
            [['W', '', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', '', '']]);
    });


    it('should ignore clicking on a non-empty cell', function () {
        clickDivAndExpectPiece(0, 0, "W");
        clickDivAndExpectPiece(0, 0, "W"); // clicking on a non-empty cell doesn't do anything.
        clickDivAndExpectPiece(1, 1, "B");
        expectBoard(
            [['W', '', '', '', '', '', '', '', ''],
                ['', 'B', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', '', '']]);
    });


    var board1 = [
        ['W', '', 'B', 'B', '', 'B', '', ''],
        ['', 'W', '', 'W', 'W', '', 'B', ''],
        ['', '', '', '', '', '', '', '']
    ];

    var board2 = [
        ['', 'W', 'B', 'B', '', 'B', '', ''],
        ['', 'W', '', 'W', 'W', '', 'B', ''],
        ['', '', '', '', '', '', '', '']
    ];

    var board3 = [
        ['', 'W', 'B', '', 'B', 'B', '', ''],
        ['', 'W', '', 'W', 'W', '', 'B', ''],
        ['', '', '', '', '', '', '', '']
    ];

    var board4 = [
        ['', 'W', 'B', '', 'B', 'B', '', ''],
        ['', 'W', '', 'W', 'W', '', '', ''],
        ['', '', '', '', '', '', '', '']
    ];

    var board5 = [
        ['', 'W', 'B', '', 'B', 'B', '', ''],
        ['', 'W', '', 'W', 'W', '', 'B', ''],
        ['', 'W', '', '', '', '', '', '']
    ];

    var board6 = [
        ['', '', 'B', '', 'B', 'B', '', ''],
        ['', 'W', '', 'W', 'W', '', '', ''],
        ['', '', '', '', '', '', '', '']
    ];

    var board7 = [
        ['', '', 'B', '', 'B', 'B', '', ''],
        ['', '', '', 'W', 'W', '', '', ''],
        ['', '', '', '', 'W', '', '', '']
    ];


    var delta1 = {destination: [0, 5], origin: [0, 6]};

    var delta2 = {destination: [0, 1], origin: [0, 0]};

    var delta3 = {destination: [1, 6], origin: [null, null]};

    var delta4 = {destination: [0, 1], origin: [null, null]};

    var delta5 = {destination: [0, 2], origin: [2, 7]};

    var delta6 = {destination: [2, 4], origin: [1, 1]};

    var playerStates1 = [{phase: 2, count: 20, phaseLastTime: 2, alreadyMills: []},
        {phase: 2, count: 20, phaseLastTime: 2, alreadyMills: []}];

    var playerStates2 = [{phase: 2, count: 21, phaseLastTime: 2, alreadyMills: []},
        {phase: 2, count: 20, phaseLastTime: 2, alreadyMills: []}];

    var playerStates3 = [{phase: 1, count: 4, phaseLastTime: 1, alreadyMills: []},
        {phase: 1, count: 4, phaseLastTime: 1, alreadyMills: []}];

    var playerStates4 = [{phase: 1, count: 4, phaseLastTime: 1, alreadyMills: []},
        {phase: 1, count: 3, phaseLastTime: 1, alreadyMills: []}];

    var playerStates5 = [{phase: 3, count: 33, phaseLastTime: 3, alreadyMills: []},
        {phase: 3, count: 33, phaseLastTime: 3, alreadyMills: []}];

    var playerStates6 = [{phase: 3, count: 34, phaseLastTime: 3, alreadyMills: []},
        {phase: 3, count: 33, phaseLastTime: 3, alreadyMills: []}];

    var matchState2 = {
        turnIndexBeforeMove: 0,
        turnIndex: 1,
        endMatchScores: null,
        lastMove: [{setTurn: {turnIndex: 1}},
            {set: {key: 'board', value: board2}},
            {set: {key: 'playerStates', value: playerStates2}},
            {set: {key: 'delta', value: delta2}}],
        lastState: {board: board1, delta: delta1, playerStates: playerStates1},
        currentState: {board: board2, delta: delta2, playerStates: playerStates2},
        lastVisibleTo: {},
        currentVisibleTo: {}
    };

    var matchState3 = {
        turnIndexBeforeMove: 1,
        turnIndex: 0,
        endMatchScores: null,
        lastMove: [{setTurn: {turnIndex: 0}},
            {set: {key: 'board', value: board3}},
            {set: {key: 'playerStates', value: playerStates3}},
            {set: {key: 'delta', value: delta3}}],
        lastState: {board: board4, delta: delta4, playerStates: playerStates4},
        currentState: {board: board3, delta: delta3, playerStates: playerStates3},
        lastVisibleTo: {},
        currentVisibleTo: {}
    };

    var matchState4 = {
        turnIndexBeforeMove: 0,
        turnIndex: 1,
        endMatchScores: null,
        lastMove: [{setTurn: {turnIndex: 1}},
            {set: {key: 'board', value: board7}},
            {set: {key: 'playerStates', value: playerStates6}},
            {set: {key: 'delta', value: delta6}}],
        lastState: {board: board6, delta: delta5, playerStates: playerStates5},
        currentState: {board: board7, delta: delta6, playerStates: playerStates6},
        lastVisibleTo: {},
        currentVisibleTo: {}
    };

    it('a normal select in phase 2', function () {
        setMatchState(matchState2, 'passAndPlay');
        expectBoard(board2);
        clickDivAndExpectPiece(0, 3, "C");
        clickDivAndExpectPiece(0, 4, "B");
        expectBoard(board3);
    });


    it('To form a morris in phase 1', function () {
        setMatchState(matchState3, 'passAndPlay');
        expectBoard(board3);
        clickDivAndExpectPiece(2, 1, "W");
        expectBoard(board5);
    });

    it('select a piece in phase2', function () {
        setMatchState(matchState2, 'passAndPlay');
        expectBoard(board2);
        clickDivAndExpectPiece(0, 3, "C");
        expectBoard([
            ['', 'W', 'B', 'C', '', 'B', '', ''],
            ['', 'W', '', 'W', 'W', '', 'B', ''],
            ['', '', '', '', '', '', '', '']
        ])
    });

    it('flying test', function () {
        setMatchState(matchState4, 'passAndPlay');
        expectBoard(board7);
    });


    it('at phase 2, after we move a piece to nearby filled position,' +
    'if 3 on a line, we can remove a piece', function () {
        clickDivAndExpectPiece(0, 0, "W");
        clickDivAndExpectPiece(0, 1, "B");
        clickDivAndExpectPiece(0, 4, "W");
        clickDivAndExpectPiece(0, 5, "B");
        clickDivAndExpectPiece(0, 2, "W");
        clickDivAndExpectPiece(0, 3, "B");
        clickDivAndExpectPiece(0, 6, "W");
        clickDivAndExpectPiece(0, 7, "B");
        clickDivAndExpectPiece(1, 0, "W");
        clickDivAndExpectPiece(1, 1, "B");
        clickDivAndExpectPiece(1, 2, "W");
        clickDivAndExpectPiece(1, 5, "B");
        clickDivAndExpectPiece(1, 6, "W");
        clickDivAndExpectPiece(1, 3, "B");
        clickDivAndExpectPiece(1, 4, "W");
        clickDivAndExpectPiece(1, 7, "B");
        clickDivAndExpectPiece(2, 3, "W");
        clickDivAndExpectPiece(2, 4, "B");
        //phase 1 end
        expectBoard(
            [['W', 'B', 'W', 'B', 'W', 'B', 'W', 'B'],
                ['W', 'B', 'W', 'B', 'W', 'B', 'W', 'B'],
                ['', '', '', 'W', 'B', '', '', '']]);
        //move W
        clickDivAndExpectPiece(2, 3, "A");
        clickDivAndExpectPiece(2, 2, "W");
        expectBoard(
            [['W', 'B', 'W', 'B', 'W', 'B', 'W', 'B'],
                ['W', 'B', 'W', 'B', 'W', 'B', 'W', 'B'],
                ['', '', 'W', '', 'B', '', '', '']]);
        ////move B
        clickDivAndExpectPiece(2, 4, "C");
        clickDivAndExpectPiece(2, 5, "B");
        expectBoard(
            [['W', 'B', 'W', 'B', 'W', 'B', 'W', 'B'],
                ['W', 'B', 'W', 'B', 'W', 'B', 'W', 'B'],
                ['', '', 'W', '', '', 'B', '', '']]);
        //remove W
        clickDivAndExpectPiece(2, 2, "");
        expectBoard(
            [['W', 'B', 'W', 'B', 'W', 'B', 'W', 'B'],
                ['W', 'B', 'W', 'B', 'W', 'B', 'W', 'B'],
                ['', '', '', '', '', 'B', '', '']]);

    });

    it('at phase 2, after we move a piece to nearby filled position,' +
    ' we can not remove a piece if not 3 pieces on a line,', function () {
        clickDivAndExpectPiece(0, 0, "W");
        clickDivAndExpectPiece(0, 1, "B");
        clickDivAndExpectPiece(0, 4, "W");
        clickDivAndExpectPiece(0, 5, "B");
        clickDivAndExpectPiece(0, 2, "W");
        clickDivAndExpectPiece(0, 3, "B");
        clickDivAndExpectPiece(0, 6, "W");
        clickDivAndExpectPiece(0, 7, "B");
        clickDivAndExpectPiece(1, 0, "W");
        clickDivAndExpectPiece(1, 1, "B");
        clickDivAndExpectPiece(1, 2, "W");
        clickDivAndExpectPiece(1, 5, "B");
        clickDivAndExpectPiece(1, 6, "W");
        clickDivAndExpectPiece(1, 3, "B");
        clickDivAndExpectPiece(1, 4, "W");
        clickDivAndExpectPiece(1, 7, "B");
        clickDivAndExpectPiece(2, 3, "W");
        clickDivAndExpectPiece(2, 4, "B");
        //phase 1 end
        expectBoard(
            [['W', 'B', 'W', 'B', 'W', 'B', 'W', 'B'],
                ['W', 'B', 'W', 'B', 'W', 'B', 'W', 'B'],
                ['', '', '', 'W', 'B', '', '', '']]);
        //move W
        clickDivAndExpectPiece(2, 3, "A");
        clickDivAndExpectPiece(2, 2, "W");
        expectBoard(
            [['W', 'B', 'W', 'B', 'W', 'B', 'W', 'B'],
                ['W', 'B', 'W', 'B', 'W', 'B', 'W', 'B'],
                ['', '', 'W', '', 'B', '', '', '']]);
        //try to move B, but would click
        clickDivAndExpectPiece(2, 4, "C");
        expectBoard(
            [['W', 'B', 'W', 'B', 'W', 'B', 'W', 'B'],
                ['W', 'B', 'W', 'B', 'W', 'B', 'W', 'B'],
                ['', '', 'W', '', 'C', '', '', '']]);

    });

});
