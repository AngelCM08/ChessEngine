import React from 'react'
import { useState } from "react";
import { Chess, SQUARES } from "chess.js";
import { Chessboard } from "react-chessboard";

export const Tablero = () => {

	const [game, setGame] = useState(new Chess());
	var numMovements;
	var bool = true;

	function makeAMove(move) {
		const gameCopy = { ...game };
		//Por aquí debería haber una función que ponga colorines a los movimientos.
		const result = gameCopy.move(move);
		numMovements = game.history().length / 2;
		//console.log(numMovements);
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

		console.log("bestMove: "+ bestMove +" - value: "+ _);
		return bestMove;
	}

	function evaluateBoard() {
		//TODO 1. Evaluación gradual: Es interesante variar los pesos de las funciones según la fase de juego en la que nos encontremos. 
			/*Por ejemplo, queremos que nuestro rey esté alejado del centro en el medio juego. Sin embargo, como todos sabemos, 
			es una pieza fundamental en los finales y mejor que esté en el centro. Para medir la fase de juego existente, 
			los módulos pueden usar el nº de piezas sobre el tablero por ejemplo. */
		
		
		//TODO 2. Pareja de alfiles: Se puede añadir un pequeño bonus por la pareja de alfiles (con la misma se cubren todas las casillas del tablero).
			//boolean que se ponga a true si un contador de alfiles llega a 2 y el contrario no tiene los dos.


		//TODO 3. Tablas de piezas y casillas: Son una manera simple de asignar valores a piezas específicas en casillas específicas. 
			//Por ejemplo durante la apertura, los peones tendrán un pequeño bonus por ocupar casillas centrales.
			//Los peones de C a F suman +0.1 a su bando si se han avanzado en los primeros 7 movimientos.


		//TODO 4. Seguridad del rey: Esto es muy importante. 
			//Por ejemplo se puede medir calculando la cantidad de peones que rodean al rey, o si hay una torre cerca del mismo.	
			//Sumar +0.2 si 3 peones estan maximo a dos casillas de rey. +0.2 si hay una torre a 3 casillas del rey, +0.1 por otras piezas. 
			//FUNCION (GetNearbyPieces())(Buscar forma de comprobar si hay piezas alrededor del rey, serviria para cualquier otra pieza)


		//TODO 5. Movilidad: Uno normalmente prefiere posiciones donde tienes más opciones, por ejemplo alfiles con diagonales abiertas, etc... 
			//!!!MuybuenaIdea xD ---> Esto se puede medir por ejemplo usando el nº de jugadas legales posibles en una posición como score para la movilidad.


		//TODO 6. Estructura de peones: Los peones doblados pueden dar un bonus negativo, (-0.2) 
			//o por ejemplo los peones aislados en finales, ya que como todos sabemos son más fáciles de atacar. 


		//TODO 7. Torre en columna abierta: Esto como sabemos suele ser positivo al igual que tener una torre en séptima. 
			//+0.2 por torre en columna abierta, +0.2 extra si está en 7a.

		//TODO 8. Tener la dama centralizada a partir de la jugada 9.


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
				case "":
					
					break;
			
				default:
					break;
			}*/

			//TODO Se supone que esto controlará las piezas que hay alrededor del rey para sumar algunas décimas por piezas cerca.
			if(bool){
				getNearbyPieces("e1", 1);
				bool = false;
			}
			if (piece.color === "w") {
				whiteScore += pieceValue;
			} else {
				blackScore += pieceValue;
			}
		}

		//console.log(whiteScore+" - "+blackScore);
		return whiteScore - blackScore;
	}

	function minimax(depth, alpha, beta, isMaximizingPlayer) {
		if (depth === 0 || game.game_over()) {
			return [null, evaluateBoard(game.board())];
		}

		let bestMove = null;
		let bestMoveValue = isMaximizingPlayer ? -Infinity : Infinity;
		const possibleMoves = game.moves();
    
		// Ordenamos los movimientos de mayor a menor valor heurístico
		const orderedMoves = possibleMoves.sort((move1, move2) => {
			game.move(move1);
			const value1 = evaluateBoard(game.board());
			game.undo();

			game.move(move2);
			const value2 = evaluateBoard(game.board());
			game.undo();

			return isMaximizingPlayer ? value2 - value1 : value1 - value2;
		});

		for (let i = 0; i < orderedMoves.length; i++) {
			game.move(orderedMoves[i]);
			//Mostrar en tablero pequeño la posición actual que se está evaluando
			//console.log(game.ascii());

			//Evaluar siguiente posición
			const [_, value] = minimax(depth - 1, alpha, beta, !isMaximizingPlayer);
			game.undo();

			if (isMaximizingPlayer) {
				if (value > bestMoveValue) {
					bestMoveValue = value;
					bestMove = orderedMoves[i];
				}
				alpha = Math.max(alpha, value);
			} else {
				if (value < bestMoveValue) {
					bestMoveValue = value;
					bestMove = orderedMoves[i];
				}
				beta = Math.min(beta, value);
			}

			if (alpha >= beta) {
				break;
			}
		}		
		return [bestMove, bestMoveValue];
	}

	function getNearbyPieces(piecePosition, range) {
		// Obtener las coordenadas de la casilla en la que se encuentra la pieza que deseas examinar
		var coords = piecePosition;
		console.log("piecePosition:", piecePosition, "range:", range);

		// Crear un array para almacenar las piezas adyacentes
		var nearbyPieces = [];
		var positionReaded = [];
		var positionSelected = [];

		// Examinar las casillas adyacentes a la pieza en un rango determinado
		var aux1, aux2;
		var row, col;
		console.log("row:", row, "col:", col);
		console.log("coords: "+coords);

		for (row = ((aux1 = piecePosition[1] - range) > 0 ) ? aux1 : 1; row <= (parseInt(piecePosition[1]) + range); row++) {
			console.log("row: "+row);
			console.log("parseInt(piecePosition[1]): "+parseInt(piecePosition[1]));

			for (col = ((aux2 = getNumByLetter(piecePosition[0]) - range) > 0) ? aux2 : 1; col <= (getNumByLetter(piecePosition[0]) + range); col++) {
				console.log("col: "+col);
				console.log("getNumByLetter(piecePosition[0]): "+getNumByLetter(piecePosition[0]));

				coords = getLetterByNum(col)+row;
				positionReaded.push(coords);
				console.log("Checking position: ", coords);
				if(coords != piecePosition){
					if (game.get(coords)) {
						var piece = game.get(coords);
						console.log("Piece found: ", piece);
						if (piece) {
							nearbyPieces.push(piece);
							positionSelected.push(coords);
						}
					}
				}
			}
		}		
		console.log("Position Readed: ", positionReaded);
		console.log("Position Selected: ", positionSelected);
		console.log("Nearby Pieces: ", nearbyPieces);
		return nearbyPieces;
}

	function getNumByLetter(letter){
		const letterMap = {
			'a': 1,
			'b': 2,
			'c': 3,
			'd': 4,
			'e': 5,
			'f': 6,
			'g': 7,
			'h': 8
		};		  
		return letterMap[letter];
	}
	
	function getLetterByNum(num) {
		const numMap = {
		  1: 'a',
		  2: 'b',
		  3: 'c',
		  4: 'd',
		  5: 'e',
		  6: 'f',
		  7: 'g',
		  8: 'h'
		};		
		return numMap[num];
	}

	return <Chessboard className="tablero" position={game.fen()} onPieceDrop={onDrop} />;
}