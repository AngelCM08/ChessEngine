import React from 'react'
import { useState } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { BoardController } from "../controllers/BoardController";

export const Tablero = () => {
	const [game, setGame] = useState(new Chess());
	const boardController = new BoardController(game);

	var numMovements, executionTime = 0;

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
		const depth = 6; // profundidad de búsqueda del árbol
		const alpha = -Infinity;
		const beta = Infinity;
		const isMaximizingPlayer = game.turn() === "w";

		console.time('loop'); 
		const [bestMove, _] = boardController.minimax(depth, alpha, beta, isMaximizingPlayer);
		console.timeEnd('loop');
		//console.log("Media Tiempo Ejecución: "+executionTime/num);
 
		console.log("bestMove: "+ bestMove +" - value: "+ _);
		return bestMove;
	}	

	return <Chessboard className="tablero" position={game.fen()} onPieceDrop={onDrop} />;
}