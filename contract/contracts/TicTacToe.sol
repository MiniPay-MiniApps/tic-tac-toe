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

import "./ITicTacToe.sol";

/**
 * @title TicTacToe
 * @notice A Solidity implementation of the tic-tac-toe game.
 * @dev Implements a two-player tic-tac-toe game on a 3x3 board.
 *      Players take turns placing their marks, and the game ends when
 *      a player wins (three in a row, column, or diagonal) or the board is full (draw).
 */
contract TicTacToe is ITicTacToe {
    // Mapping to store all game instances
    mapping(uint256 => Game) private gameRegistry;
    
    // Counter for total number of games created
    uint256 private gameCounter;

    /**
     * @notice Ensures the specified game ID is valid
     * @param gameId The game identifier to validate
     */
    modifier validGameId(uint256 gameId) {
        require(gameId > 0 && gameId <= gameCounter, "Invalid game ID");
        _;
    }

    /**
     * @notice Creates a new game instance
     * @return gameId The unique identifier for the newly created game
     */
    function newGame() external override returns (uint256 gameId) {
        gameCounter++;
        
        Game memory newGameInstance;
        newGameInstance.playerTurn = Players.PlayerOne;
        newGameInstance.winner = Winners.None;
        
        gameRegistry[gameCounter] = newGameInstance;
        
        emit GameCreated(gameCounter, msg.sender);
        
        return gameCounter;
    }

    /**
     * @notice Allows a player to join an existing game
     * @param gameId The identifier of the game to join
     * @return success Whether the join operation was successful
     * @return reason Explanation of the result
     */
    function joinGame(uint256 gameId) external override returns (bool success, string memory reason) {
        if (gameId == 0 || gameId > gameCounter) {
            return (false, "No such game exists.");
        }

        Game storage currentGame = gameRegistry[gameId];
        address joiningPlayer = msg.sender;

        // Check if player one slot is available
        if (currentGame.playerOne == address(0)) {
            currentGame.playerOne = joiningPlayer;
            emit PlayerJoinedGame(gameId, joiningPlayer, uint8(Players.PlayerOne));
            return (true, "Joined as player one");
        }

        // Check if player two slot is available
        if (currentGame.playerTwo == address(0)) {
            // Prevent same player from joining twice
            if (currentGame.playerOne == joiningPlayer) {
                return (false, "You are already player one");
            }
            
            currentGame.playerTwo = joiningPlayer;
            emit PlayerJoinedGame(gameId, joiningPlayer, uint8(Players.PlayerTwo));
            return (true, "Joined as player two");
        }

        return (false, "Game is full");
    }

    /**
     * @notice Executes a move on the game board
     * @param gameId The identifier of the game
     * @param xCoordinate The x-coordinate (0-2) on the board
     * @param yCoordinate The y-coordinate (0-2) on the board
     * @return success Whether the move was executed successfully
     * @return reason Explanation of the result
     */
    function makeMove(uint256 gameId, uint256 xCoordinate, uint256 yCoordinate) 
        external 
        override 
        returns (bool success, string memory reason) 
    {
        if (gameId == 0 || gameId > gameCounter) {
            return (false, "No such game exists.");
        }

        Game storage currentGame = gameRegistry[gameId];

        // Verify game is still active
        if (currentGame.winner != Winners.None) {
            return (false, "The game has already ended.");
        }

        // Verify both players have joined
        if (currentGame.playerOne == address(0) || currentGame.playerTwo == address(0)) {
            return (false, "Game is not ready - both players must join");
        }

        // Validate coordinates are within bounds
        if (xCoordinate >= 3 || yCoordinate >= 3) {
            return (false, "Coordinates out of bounds.");
        }

        // Verify the cell is empty (check before turn validation to match expected behavior)
        if (currentGame.board[xCoordinate][yCoordinate] != Players.None) {
            return (false, "There is already a mark at the given coordinates.");
        }

        // Verify it's the caller's turn
        address expectedPlayer = _getActivePlayer(currentGame);
        if (msg.sender != expectedPlayer) {
            return (false, "It is not your turn.");
        }

        // Place the mark
        currentGame.board[xCoordinate][yCoordinate] = currentGame.playerTurn;
        emit PlayerMadeMove(gameId, msg.sender, xCoordinate, yCoordinate);

        // Check for game end conditions
        Winners gameResult = _determineGameResult(currentGame.board);
        
        if (gameResult != Winners.None) {
            currentGame.winner = gameResult;
            emit GameOver(gameId, gameResult);
            return (true, "Game ended");
        }

        // Switch to next player
        _switchPlayer(currentGame);

        return (true, "");
    }

    /**
     * @notice Retrieves the complete game state
     * @param gameId The identifier of the game
     * @return The game state structure
     */
    function getGame(uint256 gameId) 
        external 
        view 
        override 
        validGameId(gameId) 
        returns (Game memory) 
    {
        return gameRegistry[gameId];
    }

    /**
     * @notice Gets the address of the player whose turn it is
     * @param game The game state reference
     * @return The address of the active player, or zero address if invalid
     */
    function _getActivePlayer(Game storage game) private view returns (address) {
        if (game.playerTurn == Players.PlayerOne) {
            return game.playerOne;
        } else if (game.playerTurn == Players.PlayerTwo) {
            return game.playerTwo;
        }
        return address(0);
    }

    /**
     * @notice Determines the game result by checking all win conditions
     * @param board The current game board state
     * @return The winner (PlayerOne, PlayerTwo, Draw, or None if game continues)
     */
    function _determineGameResult(Players[3][3] memory board) private pure returns (Winners) {
        // Check for horizontal wins
        for (uint256 row = 0; row < 3; row++) {
            if (
                board[row][0] != Players.None &&
                board[row][0] == board[row][1] &&
                board[row][1] == board[row][2]
            ) {
                return board[row][0] == Players.PlayerOne ? Winners.PlayerOne : Winners.PlayerTwo;
            }
        }

        // Check for vertical wins
        for (uint256 col = 0; col < 3; col++) {
            if (
                board[0][col] != Players.None &&
                board[0][col] == board[1][col] &&
                board[1][col] == board[2][col]
            ) {
                return board[0][col] == Players.PlayerOne ? Winners.PlayerOne : Winners.PlayerTwo;
            }
        }

        // Check main diagonal (top-left to bottom-right)
        if (
            board[0][0] != Players.None &&
            board[0][0] == board[1][1] &&
            board[1][1] == board[2][2]
        ) {
            return board[0][0] == Players.PlayerOne ? Winners.PlayerOne : Winners.PlayerTwo;
        }

        // Check anti-diagonal (top-right to bottom-left)
        if (
            board[0][2] != Players.None &&
            board[0][2] == board[1][1] &&
            board[1][1] == board[2][0]
        ) {
            return board[0][2] == Players.PlayerOne ? Winners.PlayerOne : Winners.PlayerTwo;
        }

        // Check for draw (board full with no winner)
        if (_isBoardComplete(board)) {
            return Winners.Draw;
        }

        // Game continues
        return Winners.None;
    }

    /**
     * @notice Checks if all cells on the board are occupied
     * @param board The game board to check
     * @return True if all cells are filled, false otherwise
     */
    function _isBoardComplete(Players[3][3] memory board) private pure returns (bool) {
        for (uint256 x = 0; x < 3; x++) {
            for (uint256 y = 0; y < 3; y++) {
                if (board[x][y] == Players.None) {
                    return false;
                }
            }
        }
        return true;
    }

    /**
     * @notice Alternates the player turn
     * @param game The game state to update
     */
    function _switchPlayer(Game storage game) private {
        if (game.playerTurn == Players.PlayerOne) {
            game.playerTurn = Players.PlayerTwo;
        } else {
            game.playerTurn = Players.PlayerOne;
        }
    }
}
