// Copyright 2016-2026, Opera Norway AS
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at:
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.28;

/**
 * @title ITicTacToe
 * @notice Interface for the TicTacToe contract
 */
interface ITicTacToe {
    // Players enumerates all possible players
    enum Players { None, PlayerOne, PlayerTwo }
    // Winners enumerates all possible winners
    enum Winners { None, PlayerOne, PlayerTwo, Draw }

    // Game stores the state of a round of tic tac toe.
    struct Game {
        address playerOne;
        address playerTwo;
        Winners winner;
        Players playerTurn;
        Players[3][3] board;
    }

    // Events
    event GameCreated(uint256 indexed gameId, address indexed creator);
    event PlayerJoinedGame(uint256 indexed gameId, address indexed player, uint8 playerNumber);
    event PlayerMadeMove(uint256 indexed gameId, address indexed player, uint256 xCoordinate, uint256 yCoordinate);
    event GameOver(uint256 indexed gameId, Winners winner);

    // Functions
    function newGame() external returns (uint256 gameId);
    function joinGame(uint256 _gameId) external returns (bool success, string memory reason);
    function makeMove(uint256 _gameId, uint256 _xCoordinate, uint256 _yCoordinate) external returns (bool success, string memory reason);
    function getGame(uint256 _gameId) external view returns (Game memory);
}

