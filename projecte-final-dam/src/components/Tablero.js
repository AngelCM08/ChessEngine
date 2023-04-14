import React from 'react'
import { useState } from "react";
import { Chess, SQUARES } from "chess.js";
import { Chessboard } from "react-chessboard";

export const Tablero = () => {

	const [game, setGame] = useState(new Chess());
	var numMovements;

	function makeAMove(move) {
		const gameCopy = { ...game };
		//Por aquí debería haber una función que ponga colorines a los movimientos.
		const result = gameCopy.move(move);
		numMovements = game.history().length / 2;
		console.log(numMovements);
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
		const depth = 3; // profundidad de búsqueda del árbol
		const alpha = -Infinity;
		const beta = Infinity;
		const isMaximizingPlayer = game.turn() === "w";

		const [bestMove, _] = minimax(depth, alpha, beta, isMaximizingPlayer);
		return bestMove;
	}

	function evaluateBoard() {
		//TODO 1. Evaluación gradual: Es interesante variar los pesos de las funciones según la fase de juego en la que nos encontremos. 
			/*Por ejemplo, queremos que nuestro rey esté alejado del centro en el medio juego. Sin embargo, como todos sabemos, 
			es una pieza fundamental en los finales y mejor que esté en el centro. Para medir la fase de juego existente, 
			los módulos pueden usar el nº de piezas sobre el tablero por ejemplo. */
		
		
		//TODO 2. Pareja de alfiles: Se puede añadir un pequeño bonus por la pareja de alfiles (con la misma se cubren todas las casillas del tablero).


		//TODO 3. Tablas de piezas y casillas: Son una manera simple de asignar valores a piezas específicas en casillas específicas. 
			//Por ejemplo durante la apertura, los peones tendrán un pequeño bonus por ocupar casillas centrales.


		//TODO 4. Seguridad del rey: Esto es muy importante. Por ejemplo se puede medir calculando la cantidad de peones que rodean al rey, o si hay una torre cerca del mismo.	


		//TODO 5. Movilidad: Uno normalmente prefiere posiciones donde tienes más opciones, por ejemplo alfiles con diagonales abiertas, etc... 
			//Esto se puede medir por ejemplo usando el nº de jugadas legales posibles en una posición como score para la movilidad.	


		//TODO 6. Estructura de peones: Los peones doblados pueden dar un bonus negativo, 
			//o por ejemplo los peones aislados en finales, ya que como todos sabemos son más fáciles de atacar. 


		//TODO 7. Torre en columna abierta: Esto como sabemos suele ser positivo al igual que tener una torreen séptima. 
			/*Hay muchos más factores que se pueden tener en cuenta pero estos siete resumen bien la idea de la evaluación 
			avanzada que uno puede añadir a las funciones de evaluación. */

		let whiteScore = 0;
		let blackScore = 0;
		const square = SQUARES;
		
		for (let i = 0; i < 64; i++) {
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

			/*switch (piece.type) {
				case value:
					
					break;
			
				default:
					break;
			}*/

			if (piece.color === "w") {
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
			//Mostrar en tablero pequeño la posición actual que se está evaluando
			console.log(game.ascii());

			//Evaluar siguiente posición
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