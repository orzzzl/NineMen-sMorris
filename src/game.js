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
                    $timeout(sendComputerMove, 500);
                }
            }
           // window.e2e_test_stateService = stateService; // to allow us to load any state in our e2e tests.

            $scope.cellClicked = function (row, col) {

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
            $scope.getImageSrc = function (row, col) {
                var cell = $scope.board[row][col];

                if (!$scope.waitPiece || !(row === $scope.lastPlacement.c && col === $scope.lastPlacement.r))
                    return cell === "W" ? "imgs/john.png"
                        : cell === "B" ? "imgs/nick.png" : "";
                else
                    return cell === "W" ? "imgs/john_selected.png"
                        : cell === "B" ? "imgs/nick_selected.png" : "";
            };
            $scope.shouldSlowlyAppear = function (row, col) {
                return $scope.delta !== undefined &&
                    $scope.delta.row === row && $scope.delta.col === col;
            };

            gameService.setGame({
                gameDeveloperEmail: "zhuangzeleng19920731@gmail.com",
                minNumberOfPlayers: 2,
                maxNumberOfPlayers: 2,
                isMoveOk: gameLogic.isMoveOk,
                updateUI: updateUI
            });

        }]);