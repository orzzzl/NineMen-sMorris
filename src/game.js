/**
 * Created by zelengzhuang on 3/3/15.
 */

angular.module('myApp')
    .controller('Ctrl',
    ['$scope', '$log', '$timeout',
        'gameService', 'stateService', 'gameLogic', 'resizeGameAreaService',
        function ($scope, $log, $timeout,
                  gameService, stateService, gameLogic, resizeGameAreaService) {

            'use strict';


            resizeGameAreaService.setWidthToHeight(.866525424);

            var animationEnded = false;
            var canMakeMove = false;
            var isComputerTurn = false;
            var state = null;
            var turnIndex = null;


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
                /*
                gameService.makeMove(aiService.createComputerMove($scope.board, $scope.turnIndex,
                    // at most 1 second for the AI to choose a move (but might be much quicker)
                var move = gameLogic.createMove($scope.board, $scope.playerStates, Math.floor(Math.random()*3),
                    Math.floor(Math.random()*8), null, null, $scope.turnIndex);
                gameService.makeMove (move);
                    {millisecondsLimit: 1000}));
                    */
                var possibleMoves = gameLogic.getAllPossibleMove($scope.board, $scope.playerStates, $scope.turnIndex);
                gameService.makeMove(possibleMoves[Math.floor(Math.random()*possibleMoves.length)]);
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

            $scope.cellClicked = function (row, col) {


                $scope.clickx = row;
                $scope.clicky = col;


                var color = $scope.turnIndex === 0 ? 'W' : 'B';

                $log.info(["Clicked on cell:", row, col]);
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

                    if (phase === 1) {
                        $scope.waitPiece = false;
                        var move = gameLogic.createMove($scope.board, $scope.playerStates, row, col, null, null, $scope.turnIndex);
                    } else if (phase === 4) {
                        $scope.waitPiece = false;
                        var move = gameLogic.createMove($scope.board, $scope.playerStates, null, null, row, col, $scope.turnIndex);
                    } else {
                        if (!$scope.waitPiece || ($scope.waitPiece && $scope.board [row][col] === color &&
                                                 ($scope.playerStates[$scope.turnIndex].phase === 2 ||
                                                  $scope.playerStates[$scope.turnIndex].phase === 3 ) )) {
                            $scope.waitPiece = true;
                            $scope.lastPlacement = {c: row, r: col};
                        } else {
                            $scope.waitPiece = false;
                            var move = gameLogic.createMove($scope.board, $scope.playerStates, row, col,
                                $scope.lastPlacement.c, $scope.lastPlacement.r, $scope.turnIndex);
                        }
                    }
                    if (!$scope.waitPiece) {
                        if (move[2].set.value[$scope.turnIndex].phase !== 4) {
                            $scope.isYourTurn = false; // to prevent making another move
                        } else {
                            $scope.isYourTurn = true;
                        }

                        gameService.makeMove(move);
                    }
                } catch (e) {
                    $log.info(["Cell is already full in position:", row, col]);
                    return;
                }
            };
            $scope.shouldShowImage = function (row, col) {
                var cell = $scope.board[row][col];
                return cell !== "";
            };


            $scope. shouldHighLight = function (row, col) {
                var color = $scope.turnIndex === 0 ? 'W' : 'B';
                var states = $scope.playerStates;
                var turn = $scope.turnIndex;
                var board = $scope.board;
                var phase = states [turn].phase;
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

                if (!$scope.waitPiece || !(row === $scope.lastPlacement.c && col === $scope.lastPlacement.r))
                    return cell === "W" ? "imgs/white.png"
                        : cell === "B" ? "imgs/black.png" : "";
                else
                    return cell === "W" ? "imgs/john_selected.png"
                        : cell === "B" ? "imgs/nick_selected.png" : "";
            };

            $scope.shouldSlowlyAppear = function (row, col) {
                //return (row == $scope.clickx && col == $scope.clicky);
                if ($scope.playerStates[$scope.turnIndex].phase !== 1)
                    return false;

                return !animationEnded &&
                    state.delta !== undefined &&
                    state.delta.destination[0] === row && state.delta.destination[1] === col;

            };

            gameService.setGame({
                gameDeveloperEmail: "zhuangzeleng19920731@gmail.com",
                minNumberOfPlayers: 2,
                maxNumberOfPlayers: 2,
                isMoveOk: gameLogic.isMoveOk,
                updateUI: updateUI
            });

        }]);