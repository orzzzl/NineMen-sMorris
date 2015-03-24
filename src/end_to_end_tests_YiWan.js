/* https://github.com/angular/protractor/blob/master/docs/toc.md */

/*test added by Yi Wan, no bugs found 03/24/2015*/
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
        else if (pieceKind === "WS")
            picUrl = "http://localhost:9002/imgs/john_selected.png";
        else if (pieceKind === "BS")
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
	
	it('the game should have a title', function () {
        expect(browser.getTitle()).toEqual("Nine Men's Morris");
    });

    it('at the game start, should have an empty board', function () {
        expectBoard(
            [['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', '']]);
    });
	it('should show W if I click in 0x0', function () {
        clickDivAndExpectPiece(1, 1, "W");
        expectBoard(
            [['', '', '', '', '', '', '', '', ''],
                ['', 'W', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', '', '']]);
    });
	it('should ignore clicking on a non-empty cell', function () {
        clickDivAndExpectPiece(1, 1, "W");
        clickDivAndExpectPiece(1, 1, "W"); // clicking on a non-empty cell doesn't do anything.
        clickDivAndExpectPiece(1, 2, "B");
        expectBoard(
            [['', '', '', '', '', '', '', '', ''],
                ['', 'W', 'B', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', '', '']]);
    });
	
	it('should show the board as expected when we have following clicks', function () {
        clickDivAndExpectPiece(0, 0, "W");
        clickDivAndExpectPiece(1, 1, "B");
        clickDivAndExpectPiece(2, 2, "W");
        clickDivAndExpectPiece(0, 2, "B");
        clickDivAndExpectPiece(1, 3, "W");
        clickDivAndExpectPiece(2, 4, "B");
        expectBoard(
            [['W', '', 'B', '', '', '', '', ''],
			['', 'B', '', 'W', '', '', '', ''],
			['', '', 'W', '', 'B', '', '', '']]);
    });
	
    it('should show the board as expected when we have following clicks', function () {
        clickDivAndExpectPiece(1, 0, "W");
        clickDivAndExpectPiece(1, 1, "B");
        clickDivAndExpectPiece(1, 2, "W");
        clickDivAndExpectPiece(1, 3, "B");
        clickDivAndExpectPiece(1, 4, "W");
        clickDivAndExpectPiece(1, 5, "B");
        clickDivAndExpectPiece(1, 6, "W");
        clickDivAndExpectPiece(1, 7, "B");
        expectBoard(
            [['', '', '', '', '', '', '', ''],
				['W', 'B', 'W', 'B', 'W', 'B', 'W', 'B'],
                ['', '', '', '', '', '', '', '']]);
    });
	it('should show a selected piece at 0x0 if I click on that piece at phase2', function () {
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
        //click
        clickDivAndExpectPiece(0, 0, "WS");
        expectBoard(
            [['WS', 'B', 'W', 'B', 'W', 'B', 'W', 'B'],
                ['W', 'B', 'W', 'B', 'W', 'B', 'W', 'B'],
                ['', '', '', 'W', 'B', '', '', '']]);
    });
	
	it('should show the selected piece if selecting the other"s piece', function () {
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
        //click
        clickDivAndExpectPiece(0, 1, "BS");
        expectBoard(
            [['W', 'BS', 'W', 'B', 'W', 'B', 'W', 'B'],
                ['W', 'B', 'W', 'B', 'W', 'B', 'W', 'B'],
                ['', '', '', 'W', 'B', '', '', '']]);
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
	
	var playerStates1 = [{phase: 2, count: 20, phaseLastTime: 2, alreadyMills: []},
        {phase: 2, count: 20, phaseLastTime: 2, alreadyMills: []}];
	var playerStates2 = [{phase: 2, count: 21, phaseLastTime: 2, alreadyMills: []},
        {phase: 2, count: 20, phaseLastTime: 2, alreadyMills: []}];
    var playerStates3 = [{phase: 1, count: 4, phaseLastTime: 1, alreadyMills: []},
        {phase: 1, count: 4, phaseLastTime: 1, alreadyMills: []}];

    var playerStates4 = [{phase: 1, count: 4, phaseLastTime: 1, alreadyMills: []},
        {phase: 1, count: 3, phaseLastTime: 1, alreadyMills: []}];
	var delta1 = {destination: [0, 5], origin: [0, 6]};
    var delta2 = {destination: [0, 1], origin: [0, 0]};
    var delta3 = {destination: [1, 6], origin: [null, null]};

    var delta4 = {destination: [0, 1], origin: [null, null]};
	
	
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
	
	it("should ignore if it's not your turn", function(){
		setMatchState(matchState2, 0);
        expectBoard(board2);
		getDiv(0, 3).click();
        getDiv(0, 4).click();
		expectBoard(board2);
	});
	
	it("cannot play if it's viewer mode", function(){
        setMatchState(matchState3, -2);
        expectBoard(board3);
        getDiv(2,1).click() // can't click after game ended
		expectBoard(board3);
	});
	
});