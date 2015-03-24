/* https://github.com/angular/protractor/blob/master/docs/toc.md */

/*
* Bugs:
* 1.
* There is one time,
* when I was testing the test that
* each player placed 9 pieces would lead to phase 2,
* it didn't do and placed one more piece in the board,
* so W has 10 piece, and B has 9.
* Don't know the reason, recommend check buy repeat doing this.
*/
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

        //expect(getImg(row, col).isDisplayed()).toEqual(pieceKind === "" ? false : true);
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



    it('at the game start, should show W if I click in 0x4', function () {
        clickDivAndExpectPiece(0, 4, "W");
        expectBoard(
            [['', '', '', '', 'W', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', '']]);
    });


    it('at phase 1, should show W and B when click', function () {
        clickDivAndExpectPiece(0, 0, "W");
        clickDivAndExpectPiece(0, 1, "B");
        clickDivAndExpectPiece(0, 2, "W");
        clickDivAndExpectPiece(0, 3, "B");
        clickDivAndExpectPiece(0, 4, "W");
        clickDivAndExpectPiece(0, 5, "B");
        clickDivAndExpectPiece(0, 6, "W");
        clickDivAndExpectPiece(0, 7, "B");
        expectBoard(
            [['W', 'B', 'W', 'B', 'W', 'B', 'W', 'B'],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', '']]);
    });

    it('at phase 1, try to place a piece in a filled place would do nothing', function () {
        clickDivAndExpectPiece(0, 0, "W");
        clickDivAndExpectPiece(0, 5, "B");
        clickDivAndExpectPiece(0, 6, "W");
        clickDivAndExpectPiece(0, 1, "B");
        clickDivAndExpectPiece(0, 2, "W");
        clickDivAndExpectPiece(0, 3, "B");
        clickDivAndExpectPiece(0, 4, "W");
        clickDivAndExpectPiece(0, 7, "B");
        expectBoard(
            [['W', 'B', 'W', 'B', 'W', 'B', 'W', 'B'],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', '']]);
        clickDivAndExpectPiece(0, 6, "W");
        clickDivAndExpectPiece(0, 7, "B");
        expectBoard(
            [['W', 'B', 'W', 'B', 'W', 'B', 'W', 'B'],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', '']]);

    });

    it('at phase 1, try to place a piece in a filled place would do nothing', function () {
        clickDivAndExpectPiece(0, 0, "W");
        clickDivAndExpectPiece(0, 1, "B");
        clickDivAndExpectPiece(0, 2, "W");
        clickDivAndExpectPiece(0, 5, "B");
        clickDivAndExpectPiece(0, 6, "W");
        clickDivAndExpectPiece(0, 3, "B");
        clickDivAndExpectPiece(0, 4, "W");
        clickDivAndExpectPiece(0, 7, "B");
        expectBoard(
            [['W', 'B', 'W', 'B', 'W', 'B', 'W', 'B'],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', '']]);
        clickDivAndExpectPiece(0, 6, "W");
        clickDivAndExpectPiece(0, 7, "B");
        expectBoard(
            [['W', 'B', 'W', 'B', 'W', 'B', 'W', 'B'],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', '']]);

    });

    it('at phase 1, each player placed 9 pieces would lead to phase 2,' +
    'place piece in any space will have no affect', function () {
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
        //cant place more pieces
        clickDivAndExpectPiece(2, 5, "");
        clickDivAndExpectPiece(2, 6, "");
        expectBoard(
            [['W', 'B', 'W', 'B', 'W', 'B', 'W', 'B'],
                ['W', 'B', 'W', 'B', 'W', 'B', 'W', 'B'],
                ['', '', '', 'W', 'B', '', '', '']]);

    });

    it('at phase 2, click a Piece would change to a selected Piece', function () {
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
        clickDivAndExpectPiece(2, 3, "WS");
        expectBoard(
            [['W', 'B', 'W', 'B', 'W', 'B', 'W', 'B'],
                ['W', 'B', 'W', 'B', 'W', 'B', 'W', 'B'],
                ['', '', '', 'WS', 'B', '', '', '']]);

    });

    it('at phase 2, we can move a piece to nearby not filled position', function () {
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
        //move
        clickDivAndExpectPiece(2, 3, "WS");
        clickDivAndExpectPiece(2, 2, "W");
        expectBoard(
            [['W', 'B', 'W', 'B', 'W', 'B', 'W', 'B'],
                ['W', 'B', 'W', 'B', 'W', 'B', 'W', 'B'],
                ['', '', 'W', '', 'B', '', '', '']]);

    });

    it('at phase 2, we can not move a piece to nearby filled position', function () {
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
        //cant place more pieces
        clickDivAndExpectPiece(2, 3, "WS");
        clickDivAndExpectPiece(2, 4, "B");
        expectBoard(
            [['W', 'B', 'W', 'B', 'W', 'B', 'W', 'B'],
                ['W', 'B', 'W', 'B', 'W', 'B', 'W', 'B'],
                ['', '', '', 'W', 'B', '', '', '']]);

    });

    it('at phase 2, we can not move others piece', function () {
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
        //move others piece
        clickDivAndExpectPiece(2, 4, "BS");
        clickDivAndExpectPiece(2, 5, "");
        expectBoard(
            [['W', 'B', 'W', 'B', 'W', 'B', 'W', 'B'],
                ['W', 'B', 'W', 'B', 'W', 'B', 'W', 'B'],
                ['', '', '', 'W', 'B', '', '', '']]);
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
        clickDivAndExpectPiece(2, 3, "WS");
        clickDivAndExpectPiece(2, 2, "W");
        expectBoard(
            [['W', 'B', 'W', 'B', 'W', 'B', 'W', 'B'],
                ['W', 'B', 'W', 'B', 'W', 'B', 'W', 'B'],
                ['', '', 'W', '', 'B', '', '', '']]);
        ////move B
        clickDivAndExpectPiece(2, 4, "BS");
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
        clickDivAndExpectPiece(2, 3, "WS");
        clickDivAndExpectPiece(2, 2, "W");
        expectBoard(
            [['W', 'B', 'W', 'B', 'W', 'B', 'W', 'B'],
                ['W', 'B', 'W', 'B', 'W', 'B', 'W', 'B'],
                ['', '', 'W', '', 'B', '', '', '']]);
        //try to move B, but would click
        clickDivAndExpectPiece(2, 4, "BS");
        expectBoard(
            [['W', 'B', 'W', 'B', 'W', 'B', 'W', 'B'],
                ['W', 'B', 'W', 'B', 'W', 'B', 'W', 'B'],
                ['', '', 'W', '', 'BS', '', '', '']]);

    });



});
