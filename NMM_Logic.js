/*************************************************************************
	> File Name: NMM_Logic.js
	> Author: Zeleng Zhuang
	> Mail: zhuangzeleng19920731@gmail.com
	> Created Time: Sat Feb 14 15:05:55 2015
 ************************************************************************/

'use strict';

angular.module ('myApp', []).factory('gameLogic', function ()
{
    function getInitialBoard ()
    {
        return [
                  ['', '', '', '', '', '', '', ''],
                  ['', '', '', '', '', '', '', ''],
                  ['', '', '', '', '', '', '', '']
                ];
    }

    function getInitialState ()
    {
        var obj = {
                   phase: 1,
                   phaseLastTime: 1,
                   alreadyMills: []
                  };
        return obj;
    }

    function isAlreadyMills (Mills, alreadyMills)
    {
        for (var i = 0; i < alreadyMills.length; i ++)
        {
            if (Mills.sort().toString() === alreadyMills [i].sort().toString())
                return true;
        }
        return false;
    }

    function isMills (board, alreadyMills)
    {
        var circuit_index, rotation_index;
        var obj = {};
        for (rotation_index = 1; rotation_index <= 7; rotation_index += 2)
        {

            if (
                board [0][rotation_index] === 'W' &&
                board [1][rotation_index] === 'W' &&
                board [2][rotation_index] === 'W' &&
                !isAlreadyMills ([[0, rotation_index], [1, rotation_index], [2, rotation_index]], alreadyMills)
            )
            {
                obj.player = 'W';
                obj.mills  = [[0, rotation_index], [1, rotation_index], [2, rotation_index]];
                return obj;
            }

            else if (
                board [0][rotation_index] === 'B' &&
                board [1][rotation_index] === 'B' &&
                board [2][rotation_index] === 'B' &&
                !isAlreadyMills ([[0, rotation_index], [1, rotation_index], [2, rotation_index]], alreadyMills)

            )
            {
                obj.player = 'B';
                obj.mills  = [[0, rotation_index], [1, rotation_index], [2, rotation_index]];
                return obj;
            }
        }

        for (circuit_index = 0; circuit_index <= 2; circuit_index ++)
        {
            for (rotation_index = 0; rotation_index <= 6; rotation_index += 2)
            {
                if (
                    board [circuit_index][rotation_index          ] === 'W' &&
                    board [circuit_index][rotation_index + 1      ] === 'W' &&
                    board [circuit_index][(rotation_index + 2) % 8] === 'W' &&
                    !isAlreadyMills (
                                     [
                                      [circuit_index, rotation_index          ],
                                      [circuit_index, rotation_index + 1      ],
                                      [circuit_index, (rotation_index + 2) % 8]
                                     ], alreadyMills
                                    )
                )
                {
                    obj.player = 'W';
                    obj.mills = [
                        [circuit_index, rotation_index          ],
                        [circuit_index, rotation_index + 1      ],
                        [circuit_index, (rotation_index + 2) % 8]
                    ];
                    return obj;
                }
                else if (
                    board [circuit_index][rotation_index          ] === 'B' &&
                    board [circuit_index][rotation_index + 1      ] === 'B' &&
                    board [circuit_index][(rotation_index + 2) % 8] === 'B' &&
                    !isAlreadyMills (
                        [
                            [circuit_index, rotation_index          ],
                            [circuit_index, rotation_index + 1      ],
                            [circuit_index, (rotation_index + 2) % 8]
                        ], alreadyMills
                    )
                )
                {
                    obj.player = 'B';
                    obj.mills = [
                        [circuit_index, rotation_index          ],
                        [circuit_index, rotation_index + 1      ],
                        [circuit_index, (rotation_index + 2) % 8]
                    ];
                    return obj;
                }

            }
        }

        obj.player = 'N';
        obj.mills = [];
        return obj;
    }

    function isAdjacent (positionA, positionB)
    {
        var x = positionA, y = positionB;

        if (x [0] === y [0])
        {
            if (Math.abs(x [1] - y [1]) === 1 ||
                Math.abs(x [1] - y [1]) === 7  )
                return true;
        }
        else if (x [1]     === y [1] &&
                 x [1] % 2 ===       1)
        {
            if (Math.abs(x [0] - y [0]) === 1)
                return true;
        }

        return false;
    }

    function getCount (board, turnIndexBeforeMove)
    {
        var circuit_index, rotation_index, count = 0;
        for (circuit_index = 0; circuit_index <= 2; circuit_index ++)
        {
            for (rotation_index = 0; rotation_index <= 7; rotation_index ++)
            {
                if (turnIndexBeforeMove === 0)
                {
                    if (board [circuit_index][rotation_index] === 'W')
                        count ++;
                }
                if (turnIndexBeforeMove === 1)
                {
                    if (board [circuit_index][rotation_index] === 'B')
                        count ++;
                }
            }
        }
        return count;
    }
     
    function findAdjacentPosition (board, pos)
    {
        var circuit_index, rotation_index;
        var res = [];
        var emp = 1;
        for (circuit_index = 0; circuit_index <= 2; circuit_index ++)
        {
            for (rotation_index = 0; rotation_index <= 7; rotation_index++)
            {
                if (
                    board [circuit_index][rotation_index] === '' &&
                    isAdjacent([circuit_index, rotation_index], pos)
                )
                {
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

    function isAdjacentPosition (board, turnIndexBeforeMove)
    {
        var circuit_index, rotation_index;
        var flag = turnIndexBeforeMove === 0 ? 'W' : 'B';
        for (circuit_index = 0; circuit_index <= 2; circuit_index ++)
        {
            for (rotation_index = 0; rotation_index <= 7; rotation_index++)
            {
                if (
                    board [circuit_index][rotation_index] === flag &&
                    findAdjacentPosition (board, [circuit_index, rotation_index]) !=='N'
                )
                    return true;
            }
        }
        return false;

    }

    function getWinner (board, playerStates)
    {
        var phaseW = playerStates [0].phase;
        var phaseB = playerStates [1].phase;

        if (phaseW !== 1 && getCount (board, 0) < 3)
            return 'B';

        if (phaseB !== 1 && getCount (board, 1) < 3)
            return 'W';

        if (phaseW === 2)
        {
            if (!isAdjacentPosition (board, 0))
                return 'B';
        }

        if (phaseB === 2)
        {
            if (!isAdjacentPosition (board, 1))
                return 'W';
        }

        return 'N';
    }

    function phaseCacl (board, playerStates, turnIndexBeforeMove)
    {
        var result = playerStates [turnIndexBeforeMove].phase;
        var num = getCount (board, turnIndexBeforeMove);
        if (num === 9)
            result = 2;
        else
        {
           if (num < 9)
           {
               if (num === 3)
               {
                   result = 3;
               }
               else
               {
                   result = result === 4? playerStates [turnIndexBeforeMove].phaseLastTime : result;
               }
           }
        }
        return result;
    }

    function checkPlace (board, turnIndexBeforeMove, mills)
    {
        var color = turnIndexBeforeMove === 0 ? 'W' : 'B';

        for (var i = 0; i < mills.length; i ++)
        {
            if (board [ mills [i][0] ][ mills [i][1] ] !== color)
                return false;
        }

        return true;
    }

    function checkMills (board, playerStates, turnIndexBeforeMove)
    {
        for (var i = 0; i < playerStates [turnIndexBeforeMove].alreadyMills.length; i ++)
        {
            if (!checkPlace (board, turnIndexBeforeMove, playerStates [turnIndexBeforeMove].alreadyMills [i]))
                return i;
        }
        return -1;
    }

    function getFirstOperation (boardAfterMove, playerStates, turnIndexBeforeMove, tmpPhase)
    {
        var firstOperation;
        var obj = isMills (boardAfterMove, playerStates[turnIndexBeforeMove].alreadyMills);
        var tmp = playerStates[turnIndexBeforeMove].alreadyMills;
        var check = checkMills(boardAfterMove, playerStates, turnIndexBeforeMove);
        var color = (turnIndexBeforeMove === 0 ? 'W' : 'B');

        if (check !== -1)
        {
            tmp.splice (check, 1);
            var phaseToSet = phaseCacl (boardAfterMove, playerStates, turnIndexBeforeMove);
            firstOperation = {
                setTurn: {turnIndex: 1 - turnIndexBeforeMove},
                updateStates: {
                    player: turnIndexBeforeMove,
                    setPhase: phaseToSet,
                    setAlreadyMills: tmp,
                    setPhaseLastTime: tmpPhase
                }
            };

        } else if (obj.player === color)
        {
            tmp.push (obj.mills);
            firstOperation = {
                setTurn: {turnIndex: turnIndexBeforeMove},
                updateStates: {
                    player: turnIndexBeforeMove,
                    setPhase: 4,
                    setAlreadyMills: tmp,
                    setPhaseLastTime: tmpPhase
                }
            };
        } else
        {
            var phaseToSet = phaseCacl (boardAfterMove, playerStates, turnIndexBeforeMove);
            firstOperation = {
                setTurn: {turnIndex: 1 - turnIndexBeforeMove},
                updateStates: {
                    player: turnIndexBeforeMove,
                    setPhase: phaseToSet,
                    setPhaseLastTime: tmpPhase
                }

            };
        }
        return firstOperation;
    }

    function createMove (
                         board, playerStates, circuitIndex, rotationIndex,
                         circuitIndexOrigin, rotationIndexOrigin, turnIndexBeforeMove
                         )
    {
        if (board === undefined)
        {
            board = getInitialBoard();
        }

        if (playerStates === undefined)
        {
            playerStates = [];
            playerStates [0] = getInitialState ();
            playerStates [1] = getInitialState ();
        }

        var tmpPhase = playerStates [turnIndexBeforeMove].phase;

        var firstOperation;
        var winner = getWinner(board, playerStates);
        if (winner !== 'N')
        {
            throw new Error ("Can only make a move if the game is not over!");
        }

        var boardAfterMove = angular.copy(board);

        if (tmpPhase !== 4 && board [circuitIndex][rotationIndex] !== '')
        {
            throw new Error ("That place has been occupied!");
        }

        var color = (turnIndexBeforeMove === 0 ? 'W' : 'B');

        if (playerStates [turnIndexBeforeMove].phase === 1)
        {
            boardAfterMove [circuitIndex][rotationIndex] = color;

            firstOperation = getFirstOperation (boardAfterMove, playerStates, turnIndexBeforeMove, tmpPhase);
        }

        else if (playerStates [turnIndexBeforeMove].phase === 2 ||
                 playerStates [turnIndexBeforeMove].phase === 3
             )
        {
            if (!isAdjacent ([circuitIndex, rotationIndex], [circuitIndexOrigin, rotationIndexOrigin]) &&
                playerStates [turnIndexBeforeMove].phase === 2)
            {
                throw new Error ("You can only move to an adjacent place!");
            }
            else if (board [circuitIndexOrigin][rotationIndexOrigin] !== color)
            {
                throw new Error ("You can only move the your man!");
            }
            else
            {
                boardAfterMove [circuitIndex][rotationIndex] = color;
                boardAfterMove [circuitIndexOrigin][rotationIndexOrigin] = '';

                winner = getWinner (boardAfterMove, playerStates);
                if (winner === 'N')
                    firstOperation = getFirstOperation (boardAfterMove, playerStates, turnIndexBeforeMove, tmpPhase);
                else
                {
                    firstOperation = {endMatch: {endMatchScores:
                        (winner === 'B' ? [0, 1] : [1, 0])  } };
                }
            }
        }
        else if (playerStates [turnIndexBeforeMove].phase === 4)
        {
            var oppCoror = (color === 'B' ? 'W' : 'B');
            if (board [circuitIndexOrigin][rotationIndexOrigin] !== oppCoror)
            {
                throw new Error ("Please choose a man of the enemy to remove!");
            }
            else
            {
                boardAfterMove [circuitIndexOrigin][rotationIndexOrigin] = '';
                winner = getWinner (boardAfterMove, playerStates);

                if (winner === 'N')
                    firstOperation = getFirstOperation (boardAfterMove, playerStates, turnIndexBeforeMove, tmpPhase);
                else
                {
                    firstOperation = {endMatch: {endMatchScores:
                        (winner === 'B' ? [0, 1] : [1, 0])  } };
                }
            }

        }
        return [firstOperation,
            {set: {key: 'board', value: boardAfterMove}},
            {set: {key: 'delta', value:
            {
                destination: [circuitIndex, rotationIndex],
                origin     : [circuitIndexOrigin, rotationIndexOrigin]
            }
            }}];
    }


    function getAllPossibleMove (board, playerStates, turnIndexBeforeMove)
    {
        var possibleMoves = [];
        var phase = playerStates [turnIndexBeforeMove].phase;
        var circuitIndex;
        var rotationIndex;
        var circuitIndexOrigin;
        var rotationIndexOricin;

        if (phase === 1 || phase === 4)
        {
            for (circuitIndex = 0; circuitIndex <= 2; circuitIndex ++)
            {
                for (rotationIndex = 0; rotationIndex <= 7; rotationIndex ++)
                {
                    try
                    {
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

        if (phase === 2 || phase === 3)
        {
            for (circuitIndex = 0; circuitIndex <= 2; circuitIndex++)
            {
                for (rotationIndex = 0; rotationIndex <= 7; rotationIndex++)
                {
                    for (circuitIndexOrigin = 0; circuitIndexOrigin <= 2; circuitIndexOrigin++)
                    {
                        for (rotationIndexOricin = 0; rotationIndexOricin <= 7; rotationIndexOricin++)
                        {
                            try
                            {
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



    function isMoveOk (params)
    {
        var move = params.move;
        var turnIndexBeforeMove = params.turnIndexBeforeMove;
        var stateBeforeMove = params.stateBeforeMove;

        try
        {
            var deltaVal = move [2].set.value;
            var circuitIndex = deltaVal.destination [0];
            var rotationIndex = deltaVal.destination [1];
            var circuitIndexOrigin = deltaVal.origin [0];
            var rotationIndexOrigin = deltaVal.origin [1];
            var board = stateBeforeMove.board;
            var playerStates = stateBeforeMove.playerStates;

            var expectedMove = createMove (board, playerStates, circuitIndex, rotationIndex,
                                            circuitIndexOrigin, rotationIndexOrigin, turnIndexBeforeMove);

            if (!angular.equals(move, expectedMove))
            {
                return false;
            }
        } catch (e)
        {
            // if there are any exceptions then the move is illegal
            return false;
        }
        return true;
    }





    return {
        getInitialBoard: getInitialBoard,
        getAllPossibleMove:getAllPossibleMove,
        createMove: createMove,
        isMoveOk: isMoveOk
    };


}
);
