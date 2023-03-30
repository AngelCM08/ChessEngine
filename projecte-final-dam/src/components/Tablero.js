import React from 'react'
import { useState } from "react";
import { Chess, SQUARES } from "chess.js";
import { Chessboard } from "react-chessboard";

export const Tablero = () => {

	const [game, setGame] = useState(new Chess());

	function makeAMove(move) {
		const gameCopy = { ...game };
		const result = gameCopy.move(move);
		setGame(gameCopy);
		return result; // null if the move was illegal, the move object if the move was legal
	}

	function makeBestMove() {
		const bestMove = getBestMove(game.fen());
		if (bestMove) {
			makeAMove(bestMove);
		}
	}

	function onDrop(sourceSquare, targetSquare) {
		const move = makeAMove({
			from: sourceSquare,
			to: targetSquare,
			promotion: "q", // always promote to a queen for example simplicity
		});

		// illegal move
		if (move === null) return false;
		setTimeout(makeBestMove, 200);
		return true;
	}

	function getBestMove(fen) {
		const game = new Chess(fen);
		const depth = 5; // profundidad de búsqueda del árbol
		const alpha = -Infinity;
		const beta = Infinity;
		const isMaximizingPlayer = game.turn() === "w";

		const [bestMove, _] = minimax(depth, alpha, beta, isMaximizingPlayer);
		return bestMove;
	}

	function evaluateBoard() {
		// Aquí deberías implementar tu propia función de evaluación de tablero
		// para determinar el valor de la posición actual del juego.
		// Podría ser tan simple como contar la diferencia en piezas entre ambos jugadores.
		// O podrías usar un enfoque más sofisticado, como una red neuronal.

		let whiteScore = 0;
		let blackScore = 0;

		for (let i = 0; i < 64; i++) {
			const square = SQUARES;
			const piece = game.get(square[i]);

			if (piece === null) {
				continue;
			}

			const pieceValue = {
				p: 1,
				n: 3,
				b: 3,
				r: 5,
				q: 9,
				k: 0,
			}[piece.type];

			if (piece.type === "w") {
				whiteScore += pieceValue;
			} else {
				blackScore += pieceValue;
			}
		}

		return whiteScore - blackScore;
	}

	function minimax(depth, alpha, beta, isMaximizingPlayer) {
		if (depth === 0 || game.game_over()) {
			return [null, evaluateBoard(game.board())];
		}

		let bestMove = null;
		let bestMoveValue = isMaximizingPlayer ? -Infinity : Infinity;
		const possibleMoves = game.moves();

		for (let i = 0; i < possibleMoves.length; i++) {
			game.move(possibleMoves[i]);
			const [_, value] = minimax(depth - 1, alpha, beta, !isMaximizingPlayer);
			game.undo();

			if (isMaximizingPlayer) {
				if (value > bestMoveValue) {
					bestMoveValue = value;
					bestMove = possibleMoves[i];
				}
				alpha = Math.max(alpha, value);
			} else {
				if (value < bestMoveValue) {
					bestMoveValue = value;
					bestMove = possibleMoves[i];
				}
				beta = Math.min(beta, value);
			}

			if (alpha >= beta) {
				break;
			}
		}

		return [bestMove, bestMoveValue];
	}

	return <Chessboard className="tablero" position={game.fen()} onPieceDrop={onDrop} />;
}