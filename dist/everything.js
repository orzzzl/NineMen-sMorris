/*************************************************************************
	> File Name: NMM_Logic.js
	> Author: Zeleng Zhuang
	> Mail: zhuangzeleng19920731@gmail.com
	> Created Time: Sat Feb 14 15:05:55 2015
 ************************************************************************/

'use strict';

angular.module ('myApp', ['ngTouch', 'ui.bootstrap']).factory('gameLogic', function () {
    /**
     * Get initial board for the game.
     *    (0,0)----------------(0,1)----------------(0,2)
     *      |                    |                    |
     *      |   (1,0)----------(1,1)----------(1,2)   |
     *      |     |              |              |     |
     *      |     |   (2,0)----(2,1)----(2,2)   |     |
     *      |     |     |                 |     |     |
     *    (0,7)-(1,7)-(2,7)             (2,3)-(1,3)-(0,3)
     *      |     |     |                 |     |     |
     *      |     |   (2,6)----(2,5)----(2,4)   |     |
     *      |     |              |              |     |
     *      |   (1,6)----------(1,5)----------(1,4)   |
     *      |                    |                    |
     *    (0,6)----------------(0,5)----------------(0,4)
     *
     *    And 'W' stand for white, which is the 0th player,
     *        'B' stand for black, which is the 1th player.
     * @returns {*[]}
     */
    function getInitialBoard () {
        return [  ['', '', '', '', '', '', '', ''],
                  ['', '', '', '', '', '', '', ''],
                  ['', '', '', '', '', '', '', '']  ];
    }

    /**
     * This function returns the initial player states.
     * @returns {{phase: number, phaseLastTime: number, alreadyMills: Array}}
     */
    function getInitialState () {
        return    {
                   count: 0,
                   phase: 1,
                   phaseLastTime: 1,
                   alreadyMills: []
                  };
    }

    function getInitialStates () {
        var playerStates = [];
        playerStates [0] = getInitialState();
        playerStates [1] = getInitialState();
        return playerStates;
    }
    /**
     * This function checks if a mill is already existed.
     * @param Mills
     * @param alreadyMills
     * @returns {boolean}
     */
    function isAlreadyMills (Mills, alreadyMills) {
        for (var i = 0; i < alreadyMills.length; i ++) {
            if (Mills.sort().toString() === alreadyMills [i].sort().toString())
                return true;
        }
        return false;
    }

    /**
     * The purpose of this function is to check if there is mills in the board which is not
     * included in the alreadyMills array.
     *
     * This function return an object with attribute "player" and "mills".
     * "player" denote for which player forms a mills ("N" stand for no player),
     * "mills" stores the index number of men which forms a mills.
     * @param board
     * @param alreadyMills
     * @returns {{}}
     */
    function isMills (board, alreadyMills, color) {
        var circuit_index, rotation_index;
        var obj = {};

        for (rotation_index = 1; rotation_index <= 7; rotation_index += 2) {
            if (
                board [0][rotation_index] === color &&
                board [1][rotation_index] === color &&
                board [2][rotation_index] === color &&
                !isAlreadyMills ([[0, rotation_index], [1, rotation_index], [2, rotation_index]], alreadyMills)
            ) {
                obj.player = color;
                obj.mills  = [[0, rotation_index], [1, rotation_index], [2, rotation_index]];
                return obj;
            }
        }
        for (circuit_index = 0; circuit_index <= 2; circuit_index ++) {
            for (rotation_index = 0; rotation_index <= 6; rotation_index += 2) {
                if (
                    board [circuit_index][rotation_index          ] === color &&
                    board [circuit_index][rotation_index + 1      ] === color &&
                    board [circuit_index][(rotation_index + 2) % 8] === color &&
                    !isAlreadyMills (
                                     [ [circuit_index, rotation_index          ],
                                       [circuit_index, rotation_index + 1      ],
                                       [circuit_index, (rotation_index + 2) % 8] ], alreadyMills
                                    )
                ) {
                    obj.player = color;
                    obj.mills = [ [circuit_index, rotation_index          ],
                                  [circuit_index, rotation_index + 1      ],
                                  [circuit_index, (rotation_index + 2) % 8] ];
                    return obj;
                }
            }
        }
        obj.player = 'N';
        obj.mills = [];
        return obj;
    }

    /**
     * To check if two certain points are adjacent.
     * @param positionA
     * @param positionB
     * @returns {boolean}
     */
    function isAdjacent (positionA, positionB) {
        var x = positionA, y = positionB;

        if (x [0] === y [0]) {
            if (Math.abs(x [1] - y [1]) === 1 ||
                Math.abs(x [1] - y [1]) === 7  )
                return true;
        } else if (x [1]     ===    y [1] &&
                   x [1] % 2 ===       1) {
            if (Math.abs(x [0] - y [0]) === 1)
                return true;
        }
        return false;
    }

    /**
     * Get the number of men a certain player has on board.
     * @param board
     * @param turnIndexBeforeMove
     * @returns {number}
     */
    function getCount (board, turnIndexBeforeMove) {
        var circuit_index, rotation_index, count = 0;

        for (circuit_index = 0; circuit_index <= 2; circuit_index ++) {
            for (rotation_index = 0; rotation_index <= 7; rotation_index ++) {
                if (turnIndexBeforeMove === 0) {
                    if (board [circuit_index][rotation_index] === 'W')
                        count ++;
                }
                if (turnIndexBeforeMove === 1) {
                    if (board [circuit_index][rotation_index] === 'B')
                        count ++;
                }
            }
        }
        return count;
    }

    /**
     * To find all the points on board that are adjacent to a certain point.
     * If no point is found, return 'N'
     * @param board
     * @param pos
     * @returns {*}
     */
    function findAdjacentPosition (board, pos) {
        var circuit_index, rotation_index;
        var res = [];
        var emp = 1;

        for (circuit_index = 0; circuit_index <= 2; circuit_index ++) {
            for (rotation_index = 0; rotation_index <= 7; rotation_index++) {
                if (
                    board [circuit_index][rotation_index] === '' &&
                    isAdjacent([circuit_index, rotation_index], pos)
                ) {
                    emp = 0;
                    res.push([circuit_index, rotation_index]);
                }
            }
        }
        if (emp === 1)
            return 'N';
        else
            return res;
    }

    /**
     * Basically this function is used to judge a winning condition that one player has no place
     * to move his man.
     * @param board
     * @param turnIndexBeforeMove
     * @returns {boolean}
     */
    function isAdjacentPosition (board, turnIndexBeforeMove) {
        var circuit_index, rotation_index;
        var color = turnIndexBeforeMove === 0 ? 'W' : 'B';

        for (circuit_index = 0; circuit_index <= 2; circuit_index ++) {
            for (rotation_index = 0; rotation_index <= 7; rotation_index++) {
                if (
                    board [circuit_index][rotation_index] === color &&
                    findAdjacentPosition (board, [circuit_index, rotation_index]) !=='N'
                )
                    return true;
            }
        }
        return false;
    }

    /**
     * This function judges if 'W' wins, 'B' wins or no winner.
     * If one player has less than 3 men or has no place to move his man, he loose.
     * @param board
     * @param playerStates
     * @returns {string}
     */
    function getWinner (board, playerStates) {
        var phaseW = playerStates [0].phase;
        var phaseB = playerStates [1].phase;

        if (phaseW !== 1 && getCount (board, 0) < 3)
            return 'B';

        if (phaseB !== 1 && getCount (board, 1) < 3)
            return 'W';

        if (phaseW === 2) {
            if (!isAdjacentPosition (board, 0))
                return 'B';
        }

        if (phaseB === 2) {
            if (!isAdjacentPosition (board, 1))
                return 'W';
        }
        return 'N';
    }

    /**
     * This function is to calculate the next phase of the player.
     * @param board
     * @param playerStates
     * @param turnIndexBeforeMove
     * @returns {number|phase|playerStates.phase}
     */
    function phaseCalc (board, playerStates, turnIndexBeforeMove) {
        var result = playerStates [turnIndexBeforeMove].phase;
        var num = getCount (board, turnIndexBeforeMove);
        var color = turnIndexBeforeMove === 0 ? 'W' : 'B';
        var obj = isMills(board, playerStates[turnIndexBeforeMove].alreadyMills, color);

        if (obj.player === color)
            return 4;

        if (playerStates [turnIndexBeforeMove].count === 9)
            result = 2;
        else {
               if (num === 3 && playerStates [turnIndexBeforeMove].phaseLastTime === 2) {
                   result = 3;
               } else {
                   result = (result === 4? playerStates [turnIndexBeforeMove].phaseLastTime : result);
               }
        }
        return result;
    }

    /**
     * This function is to check if a mills is still existed.
     * @param board
     * @param turnIndexBeforeMove
     * @param mills
     * @returns {boolean}
     */
    function checkPlace (board, turnIndexBeforeMove, mills) {
        var color = (turnIndexBeforeMove === 0 ? 'W' : 'B');

        for (var i = 0; i < mills.length; i ++) {
            if (board [ mills [i][0] ][ mills [i][1] ] !== color)
                return false;
        }

        return true;
    }

    /**
     * This function is to check if the mills in the already mills array has
     * disappeared because one man in the mills been move away.
     * It will return -1 if no mills is been disappeared, or it will return the
     * index of mills that has disappear.
     * @param board
     * @param playerStates
     * @param turnIndexBeforeMove
     * @returns {number}
     */
    function checkMills (board, playerStates, turnIndexBeforeMove) {
        for (var i = 0; i < playerStates[turnIndexBeforeMove].alreadyMills.length; i ++)
        {
            if (!checkPlace (board, turnIndexBeforeMove, playerStates[turnIndexBeforeMove].alreadyMills [i]))
                return i;
        }
        return -1;
    }

    /**
     * This function returns the new playerStates for the next round.
     * @param board
     * @param playerStates
     * @param turnIndexBeforeMove
     */
    function getPlayerStates (board, playerStates, turnIndexBeforeMove) {
        var color = (turnIndexBeforeMove === 0 ? 'W' : 'B');
        var tmpPhase = playerStates [turnIndexBeforeMove].phase;
        var obj = isMills (board, playerStates[turnIndexBeforeMove].alreadyMills, color);
        var tmp = angular.copy(playerStates[turnIndexBeforeMove].alreadyMills);
        var tmpopp = angular.copy(playerStates[1-turnIndexBeforeMove].alreadyMills);
        var check = checkMills(board, playerStates, turnIndexBeforeMove);
        var checkopp = checkMills(board, playerStates, 1 - turnIndexBeforeMove);
        var ret = angular.copy(playerStates);

        if (tmpPhase !== 4) {
            ret[turnIndexBeforeMove].count = ret[turnIndexBeforeMove].count + 1;
        }

        var phaseToSet = phaseCalc (board, ret, turnIndexBeforeMove);
        var num = getCount (board, 1 - turnIndexBeforeMove);


        if (check !== -1)
            tmp.splice (check, 1);

        if (checkopp !== -1)
            tmpopp.splice (checkopp, 1);

        if (obj.player === color)
            tmp.push (obj.mills);

        if (num === 3 && playerStates[1 - turnIndexBeforeMove].phaseLastTime === 2) {
            ret [1 - turnIndexBeforeMove].phase = 3;
            ret [1 - turnIndexBeforeMove].phaseLastTime = 2;
        }

        ret [turnIndexBeforeMove].phase = phaseToSet;
        ret [turnIndexBeforeMove].phaseLastTime = tmpPhase;
        ret [turnIndexBeforeMove].alreadyMills = tmp;
        ret [1 - turnIndexBeforeMove].alreadyMills = tmpopp;
        return ret;
    }


    function createMove (
                         board, playerStates, circuitIndex, rotationIndex,
                         circuitIndexOrigin, rotationIndexOrigin, turnIndexBeforeMove
                         ) {
        if (board === undefined) {
            board = getInitialBoard();
        }

        if (playerStates === undefined) {
            playerStates = getInitialStates();
        }

        var color = (turnIndexBeforeMove === 0 ? 'W' : 'B');
        var tmpPhase = playerStates [turnIndexBeforeMove].phase;
        var firstOperation;
        var winner = getWinner(board, playerStates);
        var boardAfterMove = angular.copy(board);
        var playerStatesAfterMove;

        if (winner !== 'N') {
            throw new Error ("Can only make a move if the game is not over!");
        }

        if (tmpPhase !== 4 && board [circuitIndex][rotationIndex] !== '') {
            throw new Error ("That place has been occupied!");
        }

        if (playerStates [turnIndexBeforeMove].phase === 1) {

            boardAfterMove [circuitIndex][rotationIndex] = color;

        } else if (playerStates [turnIndexBeforeMove].phase === 2 ||
                 playerStates [turnIndexBeforeMove].phase === 3
                  ) {

            if (!isAdjacent ([circuitIndex, rotationIndex], [circuitIndexOrigin, rotationIndexOrigin]) &&
                playerStates [turnIndexBeforeMove].phase === 2) {
                throw new Error ("You can only move to an adjacent place!");

            } else if (board [circuitIndexOrigin][rotationIndexOrigin] !== color) {
                throw new Error ("You can only move the your man!");

            } else {
                boardAfterMove [circuitIndex][rotationIndex] = color;
                boardAfterMove [circuitIndexOrigin][rotationIndexOrigin] = '';

                winner = getWinner (boardAfterMove, playerStates);
                if (winner !== 'N') {
                    firstOperation = {endMatch: {endMatchScores:
                        (winner === 'B' ? [0, 1] : [1, 0])  } };
                }
            }
        }
        else if (playerStates [turnIndexBeforeMove].phase === 4) {
            var oppCoror = (color === 'B' ? 'W' : 'B');

            if (board [circuitIndexOrigin][rotationIndexOrigin] !== oppCoror) {
                throw new Error ("Please choose a man of the enemy to remove!");

            } else {
                boardAfterMove [circuitIndexOrigin][rotationIndexOrigin] = '';
                winner = getWinner (boardAfterMove, playerStates);

                if (winner !== 'N') {
                    firstOperation = {endMatch: {endMatchScores:
                        (winner === 'B' ? [0, 1] : [1, 0])  } };
                }
            }
        }

        if (winner === 'N') {
            if (isMills(boardAfterMove, playerStates[turnIndexBeforeMove].alreadyMills, color).player === color)
                firstOperation = {setTurn: {turnIndex: turnIndexBeforeMove}};
            else
                firstOperation = {setTurn: {turnIndex: 1 - turnIndexBeforeMove}};
        }

        playerStatesAfterMove = getPlayerStates(boardAfterMove, playerStates, turnIndexBeforeMove);

        return [firstOperation,
            {set: {key: 'board', value: boardAfterMove}},
            {set: {key: 'playerStates', value: playerStatesAfterMove}},
            {set: {key: 'delta', value:
            {
                destination: [circuitIndex, rotationIndex],
                origin     : [circuitIndexOrigin, rotationIndexOrigin]
            }
            }}];
    }


    function getAllPossibleMove (board, playerStates, turnIndexBeforeMove) {
        var possibleMoves = [];
        var phase = playerStates [turnIndexBeforeMove].phase;
        var circuitIndex;
        var rotationIndex;
        var circuitIndexOrigin;
        var rotationIndexOricin;

        if (phase === 1 || phase === 4) {
            for (circuitIndex = 0; circuitIndex <= 2; circuitIndex ++) {
                for (rotationIndex = 0; rotationIndex <= 7; rotationIndex ++) {
                    try {
                        if (phase === 1)
                            possibleMoves.push(createMove(board, playerStates, circuitIndex, rotationIndex,
                            null, null, turnIndexBeforeMove));
                        else
                            possibleMoves.push(createMove(board, playerStates, null, null,
                            circuitIndex, rotationIndex, turnIndexBeforeMove));
                    } catch (e) {
                        //Move is not valid.
                    }
                }
            }
        }

        if (phase === 2 || phase === 3) {
            for (circuitIndex = 0; circuitIndex <= 2; circuitIndex++) {
                for (rotationIndex = 0; rotationIndex <= 7; rotationIndex++) {
                    for (circuitIndexOrigin = 0; circuitIndexOrigin <= 2; circuitIndexOrigin++) {
                        for (rotationIndexOricin = 0; rotationIndexOricin <= 7; rotationIndexOricin++) {
                            try {
                                possibleMoves.push(createMove(board, playerStates, circuitIndex, rotationIndex,
                                    circuitIndexOrigin, rotationIndexOricin, turnIndexBeforeMove));
                            } catch (e) {
                                //Move is not valid.
                            }

                        }
                    }
                }
            }
        }
        return possibleMoves;
    }



    function isMoveOk (params) {
        var move = params.move;
        var turnIndexBeforeMove = params.turnIndexBeforeMove;
        var stateBeforeMove = params.stateBeforeMove;

        try {
            var deltaVal = move [3].set.value;
            var circuitIndex = deltaVal.destination [0];
            var rotationIndex = deltaVal.destination [1];
            var circuitIndexOrigin = deltaVal.origin [0];
            var rotationIndexOrigin = deltaVal.origin [1];
            var board = stateBeforeMove.board;
            var playerStates = stateBeforeMove.playerStates;

            var expectedMove = createMove (board, playerStates, circuitIndex, rotationIndex,
                                            circuitIndexOrigin, rotationIndexOrigin, turnIndexBeforeMove);

            if (!angular.equals(move, expectedMove)) {
                return false;
            }
        } catch (e) {
            // if there are any exceptions then the move is illegal
            return false;
        }
        return true;
    }





    return {
        getInitialBoard: getInitialBoard,
        getInitialStates: getInitialStates,
        getAllPossibleMove:getAllPossibleMove,
        createMove: createMove,
        isMoveOk: isMoveOk
    };


}
);
;/**
 * Created by zelengzhuang on 3/3/15.
 */

angular.module('myApp')
    .controller('Ctrl',
    ['$scope', '$log', '$timeout', '$rootScope','$translate',
        'gameService', 'stateService', 'gameLogic', 'aiService', 'resizeGameAreaService', 'dragAndDropService',
        function ($scope, $log, $timeout, $rootScope,$translate,
                  gameService, stateService, gameLogic, aiService, resizeGameAreaService, dragAndDropService) {

            'use strict';


            resizeGameAreaService.setWidthToHeight(.866525424);



            var animationEnded = false;
            var isComputerTurn = false;
            var state = null;


            // drag and drop
            var draggingLines = document.getElementById("draggingLines");
            var horizontalDraggingLine = document.getElementById("horizontalDraggingLine");
            var verticalDraggingLine = document.getElementById("verticalDraggingLine");
            var gameArea = document.getElementById("gameArea");
            var rowsNum = 7;
            var colsNum = 7;
            var draggingStartedRowCol = null; // The {row: YY, col: XX} where dragging started.
            var draggingStartRaw = null;
            var draggingPiece = null;
            var nextZIndex = 61;
            dragAndDropService.addDragListener("gameArea", handleDragEvent);
            var rowtmp;
            var coltmp;

            function handleDragEvent(type, clientX, clientY) {

                if ($scope.playerStates === undefined || $scope.turnIndex === -1)
                    return;
                // Center point in gameArea
                var phase = $scope.playerStates[$scope.turnIndex].phase;
                var x = clientX - gameArea.offsetLeft;
                var y = clientY - gameArea.offsetTop;
                // Is outside gameArea?
                if (x < 0 || y < 0 || x >= gameArea.clientWidth || y >= gameArea.clientHeight) {
                  //  draggingLines.style.display = "none";
                    if (draggingPiece) {
                        // Drag the piece where the touch is (without snapping to a square).
                        var size = getSquareWidthHeight();
                        setDraggingPieceTopLeft({top: y - size.height / 2, left: x - size.width / 2});
                    } else {
                        return;
                    }
                } else {
                    // Inside gameArea. Let's find the containing square's row and col
                    coltmp = Math.floor(colsNum * x / gameArea.clientWidth);
                    rowtmp = Math.floor(rowsNum * y / gameArea.clientHeight);

                    var col;
                    var row;
                    if (coltmp === 0 && rowtmp === 0) {
                        col = 0; row = 0;
                    } else if (coltmp === 3 && rowtmp === 0) {
                        col = 1; row = 0;
                    } else if (coltmp === 6 && rowtmp === 0) {
                        col = 2; row = 0;
                    } else if (coltmp === 6 && rowtmp === 3) {
                        col = 3; row = 0;
                    } else if (coltmp === 6 && rowtmp === 6) {
                        col = 4; row = 0;
                    } else if (coltmp === 3 && rowtmp === 6) {
                        col = 5; row = 0;
                    } else if (coltmp === 0 && rowtmp === 6) {
                        col = 6; row = 0;
                    } else if (coltmp === 0 && rowtmp === 3) {
                        col = 7; row = 0;
                    } else if (coltmp === 1 && rowtmp === 1) {
                        col = 0; row = 1;
                    } else if (coltmp === 3 && rowtmp === 1) {
                        col = 1; row = 1;
                    } else if (coltmp === 5 && rowtmp === 1) {
                        col = 2; row = 1;
                    } else if (coltmp === 5 && rowtmp === 3) {
                        col = 3; row = 1;
                    } else if (coltmp === 5 && rowtmp === 5) {
                        col = 4; row = 1;
                    } else if (coltmp === 3 && rowtmp === 5) {
                        col = 5; row = 1;
                    } else if (coltmp === 1 && rowtmp === 5) {
                        col = 6; row = 1;
                    } else if (coltmp === 1 && rowtmp === 3) {
                        col = 7; row = 1;
                    } else if (coltmp === 2 && rowtmp === 2) {
                        col = 0; row = 2;
                    } else if (coltmp === 3 && rowtmp === 2) {
                        col = 1; row = 2;
                    } else if (coltmp === 4 && rowtmp === 2) {
                        col = 2; row = 2;
                    } else if (coltmp === 4 && rowtmp === 3) {
                        col = 3; row = 2;
                    } else if (coltmp === 4 && rowtmp === 4) {
                        col = 4; row = 2;
                    } else if (coltmp === 3 && rowtmp === 4) {
                        col = 5; row = 2;
                    } else if (coltmp === 2 && rowtmp === 4) {
                        col = 6; row = 2;
                    } else if (coltmp === 2 && rowtmp === 3) {
                        col = 7; row = 2;
                    }

                    if (type === "touchstart" && !draggingStartedRowCol) {
                        // drag started
                        if ((phase === 2 || phase === 3)) {
                            draggingStartRaw = {roww: rowtmp, col: coltmp};
                            draggingStartedRowCol = {row: row, col: col};
                            draggingPiece = document.getElementById("e2e_test_img_" + draggingStartedRowCol.row + "x" + draggingStartedRowCol.col);
                            if (draggingPiece !== null)
                                draggingPiece.style['z-index'] = ++nextZIndex;

                            if (row === undefined || col === undefined) {
                                canceled ();
                                return;
                            }

                            if (row < 0 || row > 2 || col < 0 || col > 7) {
                                canceled ();
                                return;
                            }

                            var color = $scope.turnIndex === 0 ? 'W' : 'B';
                   
                            if ($scope.board [row][col] !== color) {
                                canceled ();
                                return;
                            }
                        }
                        if (phase === 4 || phase === 1) {
                            $rootScope.$apply(function () {
                                if (!$scope.isYourTurn) {
                                    return;
                                }
                                try {

                                    var phase = $scope.playerStates[$scope.turnIndex].phase;
                                    if (phase === 1) {
                                        var move = gameLogic.createMove($scope.board, $scope.playerStates, row, col, null, null, $scope.turnIndex);
                                    } else if (phase === 4) {
                                        var move = gameLogic.createMove($scope.board, $scope.playerStates, null, null, row, col, $scope.turnIndex);
                                    }
                                    gameService.makeMove(move);
//                                }
                                } catch (e) {
                                    $log.info(["Can't place piece:", row]);
                                    return;
                                }
                            });
                        }
                    }
                        if (!draggingPiece) {
                            return;
                        }


                    if (type === "touchend") {
                        var from = draggingStartedRowCol;
                        var to = {row: row, col: col};
                        var phase = $scope.playerStates[$scope.turnIndex].phase;
                        if (phase === 2 || phase === 3)
                            dragDone(from, to);
                    } else {
                        // Drag continue
                        console.log (gameArea.clientWidth);
                        var size = getSquareWidthHeight();
                        console.log ("size.width: " + size.width/2 + "size.height" + size.height/2 + "x" + x + "y" + y);
                        setDraggingPieceTopLeft({top: y - size.height / 2, left: x - size.width / 2});
                    }
                }
                if (type === "touchend" || type === "touchcancel" || type === "touchleave") {
                    canceled ();
                }
            }

            function canceled () {
                  // drag ended
                  // return the piece to it's original style (then angular will take care to hide it).
                    var tmp = getSquareTopLeft(rowtmp, coltmp);
                    setDraggingPieceTopLeft(tmp);
                 //   draggingLines.style.display = "none";
                    if (draggingPiece !== null) {
                        draggingPiece.removeAttribute("style");//fix broken UI
                        draggingPiece = null;
                    }
                    draggingStartedRowCol = null;
                    draggingPiece = null;

            }
            function setDraggingPieceTopLeft(topLeft) {
                var originalSize = getSquareTopLeft(draggingStartRaw.roww, draggingStartRaw.col);
                if (draggingPiece !== null) {
                    draggingPiece.style.left = (topLeft.left - originalSize.left + gameArea.clientWidth * 0.03) + "px";
                    draggingPiece.style.top = (topLeft.top - originalSize.top + gameArea.clientHeight * 0.03) + "px";
                }
            }
            function getSquareWidthHeight() {
                return {
                    width: gameArea.clientWidth / colsNum,
                    height: gameArea.clientHeight / rowsNum
                };
            }
            function getSquareTopLeft(row, col) {
                var size = getSquareWidthHeight();
                return {top: row * size.height, left: col * size.width}
            }


            function dragDone(from, to) {

                $rootScope.$apply(function () {

                    $log.info(["Clicked on cell:", from.row, from.col]);
                    if (window.location.search === '?throwException') { // to test encoding a stack trace with sourcemap
                        throw new Error("Throwing the error because URL has '?throwException'");
                    }
                    if (!$scope.isYourTurn) {
                        return;
                    }
                    if ($scope.waitPiece === undefined) {
                        $scope.waitPiece = false;
                    }
                    if ($scope.lastPlacement === undefined) {
                        $scope.lastPlacement = {};
                    }

                    try {
                        var phase = $scope.playerStates[$scope.turnIndex].phase;
                        if (phase === 2 || phase === 3) {
                            var move = gameLogic.createMove($scope.board, $scope.playerStates, to.row, to.col, from.row, from.col, $scope.turnIndex);
                            gameService.makeMove(move);
                            console.log (draggingPiece);
                        }
                    } catch (e) {
                        $log.info(["Can't move piece:", from.row, from.col]);
                        return;
                    }

                });
            }




             //end drag and drop


            function animationEndedCallback() {
                $rootScope.$apply(function () {
                    $log.info("Animation ended");
                    animationEnded = true;
                    if (isComputerTurn) {
                        sendComputerMove();
                    }
                });
            }
            // See http://www.sitepoint.com/css3-animation-javascript-event-handlers/
            document.addEventListener("animationend", animationEndedCallback, false); // standard
            document.addEventListener("webkitAnimationEnd", animationEndedCallback, false); // WebKit
            document.addEventListener("oanimationend", animationEndedCallback, false); // Opera



            function sendComputerMove() {
                gameService.makeMove(
                    aiService.createComputerMove($scope.board, $scope.playerStates, $scope.turnIndex,
                        // at most 1 second for the AI to choose a move (but might be much quicker)
                        {millisecondsLimit: 1000}
                    ));
            }


            function updateUI(params) {
                animationEnded = false;
                state = params.stateAfterMove;
                $scope.board = params.stateAfterMove.board;
                $scope.delta = params.stateAfterMove.delta;
                $scope.playerStates = params.stateAfterMove.playerStates;

                if ($scope.board === undefined) {
                    $scope.board = gameLogic.getInitialBoard();
                }

                if ($scope.playerStates === undefined) {
                    $scope.playerStates = gameLogic.getInitialStates();
                }

                $scope.isYourTurn = params.turnIndexAfterMove >= 0 && // game is ongoing
                params.yourPlayerIndex === params.turnIndexAfterMove; // it's my turn
                $scope.turnIndex = params.turnIndexAfterMove;

                // Is it the computer's turn?
                if ($scope.isYourTurn &&
                    params.playersInfo[params.yourPlayerIndex].playerId === '') {
                    $scope.isYourTurn = false; // to make sure the UI won't send another move.
                    // Waiting 0.5 seconds to let the move animation finish; if we call aiService
                    // then the animation is paused until the javascript finishes.
                    $timeout(sendComputerMove, 1000);
                }
            }

            window.e2e_test_stateService = stateService; // to allow us to load any state in our e2e tests.


            $scope.shouldShowImage = function (row, col) {
                var cell = $scope.board[row][col];
//                console.log (row + "***" + col+ "***" + cell);
                return cell !== "";
            };


            $scope. shouldHighLight = function (row, col) {
                if ($scope.playerStates === undefined || $scope.turnIndex === -1)
                    return false;
                var color = $scope.turnIndex === 0 ? 'W' : 'B';
                var turn = $scope.turnIndex;
                var board = $scope.board;
//                if ($scope.playerStates === undefined)
//                    return false;
                var phase = $scope.playerStates [$scope.turnIndex].phase;
                if (phase === 1)
                    return false;
                if (phase === 2 || phase === 3) {
                    if (board [row][col] === color)
                        return true;
                    else
                        return false;
                }
                if (phase === 4) {
                    var oppcolor = turn === 1 ? 'W' : 'B';
                    if (board [row][col] === oppcolor)
                        return true;
                    else
                        return false;
                }
            };

            $scope.getImageSrc = function (row, col) {
                var cell = $scope.board[row][col];
                    return cell === "W" ? "imgs/white.png"
                        : cell === "B" ? "imgs/black.png" : "";
            };

            $scope.shouldEnLar = function (row, col) {

                var ss = !animationEnded &&
                    state.delta !== undefined &&
                    state.delta.destination[0] === row && state.delta.destination[1] === col;
                    
                return ss;

            };

            $scope.shouldFade = function (row, col) {

                return !animationEnded &&
                    state.delta !== undefined &&
                    state.delta.origin[0] === row && state.delta.origin[1] === col;

            };



            gameService.setGame({
                gameDeveloperEmail: "zhuangzeleng19920731@gmail.com",
                minNumberOfPlayers: 2,
                maxNumberOfPlayers: 2,
                isMoveOk: gameLogic.isMoveOk,
                updateUI: updateUI
            });

        }]);;/**
 * Created by zelengzhuang on 4/5/15.
 */

angular.module('myApp').factory('aiService',
    ["alphaBetaService", "gameLogic",
function(alphaBetaService, gameLogic) {

    'use strict';

    function createComputerMove (board, playerStates, playerIndex, alphaBetaLimits) {
        return alphaBetaService.alphaBetaDecision(
            [null, {set: {key: 'board', value: board}}, {set: {key: 'playerStates', value: playerStates}}],
            playerIndex, getNextStates, getStateScoreForIndex0,
            // If you want to see debugging output in the console, then surf to game.html?debug
            window.location.search === '?debug' ? getDebugStateToString : null,
            alphaBetaLimits);
    }

    function getDebugStateToString(move) {
        return "\n" + move[1].set.value.join("\n") + "\n";
    }

    function getStateScoreForIndex0(move) {
        if (move[0].endMatch) {
            var endMatchScores = move[0].endMatch.endMatchScores;
            return endMatchScores[0] > endMatchScores[1] ? Number.POSITIVE_INFINITY
                : endMatchScores[0] < endMatchScores[1] ? Number.NEGATIVE_INFINITY
                : 0;
        }
        if (move[2].set.value [0].phase === 4) {
            return Number.POSITIVE_INFINITY / 2;
        }
        if (move[2].set.value [1].phase === 4) {
            return Number.NEGATIVE_INFINITY / 2;
        }
        return (move[2].set.value [0].alreadyMills.length * 1000000000000 - move[2].set.value [1].alreadyMills.length * 1000000000000);
    }


    function getNextStates(move, playerIndex) {
        return gameLogic.getAllPossibleMove (move[1].set.value, move[2].set.value, playerIndex);
    }






    return {createComputerMove: createComputerMove};
}]);