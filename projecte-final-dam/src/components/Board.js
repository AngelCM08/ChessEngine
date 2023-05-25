import React from 'react'
import { useState } from "react";
import { Chess, SQUARES } from "chess.js";
import { Chessboard } from "react-chessboard";
import { ModuleBoard } from './ModuleBoard';
import config from '../config';
import { Info } from './Info';
import * as constants from "../Constants.js";

export const Board = () => {
	const [game, setGame] = useState(new Chess());
	const [position, setPosition] = useState([]);
	const [gameOver, setGameOver] = useState(false);
	const [configState, setConfigState] = useState(config);
	const [movementsState, setMovementsState] = useState(0);
	const startPositionFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
	var positionsSearched = [];

	const updatePosition = (newPosition) => {
		setPosition(newPosition);
	};

	//Board Interface
	function onDrop(sourceSquare, targetSquare) {
		const move = makeAMove({
			from: sourceSquare,
			to: targetSquare,
			promotion: "q", // always promote to a queen for example simplicity
		});

		// illegal move
		if (move === null) return false;
		setTimeout(makeBestMove, 200); //Needed timeout to charge correctly the movement of the piece.

		if (gameOver) return false;
		return true;
	}

	function makeBestMove() {
		const bestMove = getBestMove(game.fen());
		if (bestMove) {
			makeAMove(bestMove);
		}
	}

	function makeAMove(move) {
		const gameCopy = { ...game };
		const result = gameCopy.move(move);
		setMovementsState(Math.round(game.history().length / 2));
		setGame(gameCopy);

		// Detect if game is over
		if (gameCopy.game_over()) setGameOver(true);

		return result; //null if the move was illegal, the move object if the move was legal
	}

	function getBestMove(fen) {
		const game = new Chess(fen);
		const depth = configState.depth; //Depth from the research tree
		const alpha = -Infinity;
		const beta = Infinity;
		const isMaximizingPlayer = game.turn() === "w";
		var bestMove, bestMoveValue;

		if(configState.debugMode){
			console.time('Time to Move');
			[bestMove, bestMoveValue] = minimax(depth, alpha, beta, isMaximizingPlayer);
			console.timeEnd('Time to Move'); //Calculation of the time spent to process the movement done.
			console.log('Num of positions searched: '+positionsSearched.length);
		}else{
			[bestMove, bestMoveValue] = minimax(depth, alpha, beta, isMaximizingPlayer);
		}

		updatePosition(positionsSearched);

		if(configState.debugMode) console.log("Best Move: " + bestMove + "\nPosition Value: " + bestMoveValue + "\nMovement: " + (movementsState+1));
		return bestMove;
	}

	// Board Logic
	function evaluateBoard() {
		let whiteScore = 0, blackScore = 0, piece;
		const square = SQUARES;

		for (let i = 0; i < 64; i++) {
			if ((piece = game.get(square[i])) === null) continue;

			const pieceValue = {
				p: 1,
				n: 3,
				b: 3,
				r: 5,
				q: 9,
				k: 0,
			}[piece.type];

			var bonusValue = evaluateBonus(piece, square[i]);

			if (piece.color === "w") whiteScore += pieceValue + bonusValue;
			else blackScore += pieceValue + bonusValue;
		}
		return whiteScore - blackScore;
	}

	function evaluateBonus(piece, square) {
		var absoluteValue = complexEvaluation(piece.type, piece.color === 'w', 
												(getNumByLetter(square[0]) - 1), square[1] - 1);
		return piece.color === 'w' ? absoluteValue : -absoluteValue;
	};

	function complexEvaluation(type, isWhite, x, y) {
		var bonus = 0;
		switch (type) {
			case 'p': return (isWhite ? constants.pawnEvalWhite[y][x] : constants.pawnEvalBlack[y][x]);
			case 'r':
				if (game.moves({ square: getLetterByNum(y + 1) + x }).length >= 10) bonus = 0.5;
				return bonus + (isWhite ? constants.rookEvalWhite[y][x] : constants.rookEvalBlack[y][x]);
			case 'n': return constants.knightEval[y][x];
			case 'b':
				if (game.moves({ square: getLetterByNum(y + 1) + x }).length >= 6) bonus = 0.5;
				return bonus + (isWhite ? constants.bishopEvalWhite[y][x] : constants.bishopEvalBlack[y][x]);
			case 'q': return constants.evalQueen[y][x];
			case 'k':
				bonus = getNearbyPieces(x + 1, y + 1, 2);
				return bonus + (isWhite ? constants.kingEvalWhite[y][x] : constants.kingEvalBlack[y][x]);
		}
	};

	function minimax(depth, alpha, beta, isMaximizingPlayer) {
		if (depth === 0 || game.game_over()) {
			positionsSearched.push(game.fen());
			return [null, evaluateBoard(game.board())];
		}

		let bestMove = null;
		let bestMoveValue = isMaximizingPlayer ? -Infinity : Infinity;
		let randomMoves = null;

		/*If the quantity of legal movements is above 27 they are divided by 3, if it is between 16(not included) and 27(included) they are divided by 2 and if it is under 16(included) they are not divided.
		This is done to simplify calculation for the best move because the quantity of movements is enormous and is so difficult to optimize the application.
		It is not possible to always get the best move, but it has a not that bad move in a faster time. */
		if(configState.reduceIterations){
			const possibleMoves = game.moves();
			var iterations = (possibleMoves.length > 16) ? ((possibleMoves.length > 27) ? possibleMoves.length / 3 : possibleMoves.length / 2) : possibleMoves.length;
			randomMoves = shuffle(possibleMoves).slice(0, iterations);
		}else{
			randomMoves = game.moves();
		}

		for (let i = 0; i < randomMoves.length; i++) {
			game.move(randomMoves[i]);
			//Show by console the movements that are being calculated.

			if(configState.showAscii) console.log(game.ascii());

			//Evaluate next position
			const [_, value] = minimax(depth - 1, alpha, beta, !isMaximizingPlayer);
			game.undo();

			if (isMaximizingPlayer) {
				if (value > bestMoveValue) {
					bestMoveValue = value;
					bestMove = randomMoves[i];
				}
				alpha = Math.max(alpha, value);
			} else {
				if (value < bestMoveValue) {
					bestMoveValue = value;
					bestMove = randomMoves[i];
				}
				beta = Math.min(beta, value);
			}

			if (alpha >= beta) break;
		}
		return [bestMove, bestMoveValue];
	}

	function shuffle(array) {
		const copy = [...array];
		for (let i = copy.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[copy[i], copy[j]] = [copy[j], copy[i]];
		}
		return copy;
	}

	function getNearbyPieces(x, y, range) {
		var piecePosition = getLetterByNum(y) + x;
		var coords = piecePosition;
		var nearbyPieces = [];
		var positionReaded = [];
		var positionSelected = [];
		var aux1, aux2, row, col;

		for (row = ((aux1 = x - range) > 0) ? aux1 : 1; row <= (x + range); row++) {
			for (col = ((aux2 = y - range) > 0) ? aux2 : 1; col <= y + range; col++) {
				coords = getLetterByNum(col) + row;
				positionReaded.push(coords);

				if (coords !== piecePosition) {
					if (game.get(coords)) {
						var piece = game.get(coords);

						if (piece) {
							nearbyPieces.push(piece);
							positionSelected.push(coords);
						}
					}
				}
			}
		}
		return isKingSafe(nearbyPieces);
	}

	function isKingSafe(nearbyPieces) {
		var counter = 0, rockNear, bonus = 0;
		nearbyPieces.forEach(piece => {
			if (piece.type === 'p') counter++;
			if (piece.type === 'r') rockNear = true;
		});
		if (rockNear) bonus += 0.2;
		if (counter === 3) bonus += 0.3;
		return bonus;
	}

	function getNumByLetter(letter) {
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

	// Board decoration elements
	const onMouseOverSquare = (square) => {
		// get list of possible moves for this square
		var moves = game.moves({
			square: square,
			verbose: true
		})

		// exit if there are no moves available for this square
		if (moves.length === 0) return

		// highlight the square they moused over
		addSquareHighlight(document.querySelector('[data-square="' + square + '"]'));

		// highlight the possible squares for this piece
		for (var i = 0; i < moves.length; i++) {
			addSquareHighlight(document.querySelector('[data-square="' + moves[i].to + '"]'));
		}
	};

	const onMouseOutSquare = () => {
		deleteAllSquareHighlight();
	};

	function addSquareHighlight(square) {
		if (square.getAttribute('data-square-color') === 'black') square.style.backgroundColor = constants.blackSquareGrey;
		else square.style.backgroundColor = constants.whiteSquareGrey;
	}

	function deleteAllSquareHighlight() {
		const blackSquares = document.querySelectorAll('[data-square-color="black"]');
		const whiteSquares = document.querySelectorAll('[data-square-color="white"]');

		blackSquares.forEach(square => {
			square.style.backgroundColor = constants.blackSquare;
		});

		whiteSquares.forEach(square => {
			square.style.backgroundColor = constants.whiteSquare;
		});
	}

	const onClickResetMatch = () => {
		const startGame = new Chess(startPositionFen);
		startGame.load(startPositionFen);
		setGame(startGame);
	};

	// Info & Configuration
	const onSelectTab = () => {};

	const onChangeBoardOrientation = (selectedOption) => {
		setConfigState((prevConfig) => ({
			...prevConfig,
			boardOrientation: selectedOption.target.value,
		}));
	};

	const onChangeUpdateFreq = (selectedOption) => {
		setConfigState((prevConfig) => ({
			...prevConfig,
			updateFreq: selectedOption.target.value,
		}));
	};

	const onChangeDepth = (selectedOption) => {
		setConfigState((prevConfig) => ({
			...prevConfig,
			depth: selectedOption.target.value,
		}));
	};

	const onChangeReduceIterations = (selectedOption) => {
		var booleanValue = selectedOption.target.value === 'true';
		setConfigState((prevConfig) => ({
			...prevConfig,
			reduceIterations: booleanValue,
		}));
	};

	const onChangeShowAscii = (selectedOption) => {
		var booleanValue = selectedOption.target.value === 'true';
		setConfigState((prevConfig) => ({
			...prevConfig,
			showAscii: booleanValue,
		}));
	};

	const onChangeDebugMode = (selectedOption) => {
		var booleanValue = selectedOption.target.value === 'true';
		setConfigState((prevConfig) => ({
			...prevConfig,
			debugMode: booleanValue,
		}));
	};

	return (
		<>
			<div className='board'>
				<div className='turn'>White WIN!</div>
				<Chessboard className="board"
					boardOrientation={configState.boardOrientation}
					position={game.fen()}
					onPieceDrop={onDrop}
					onMouseOverSquare={onMouseOverSquare}
					onMouseOutSquare={onMouseOutSquare}
					areArrowsAllowed={true}
					customBoardStyle={{ border: '3px solid black' }}
				/>
			</div>
			<div className='moduleBoard'>
				<ModuleBoard 
					position={position} 
					configState={configState} 
				/>
			</div>
			<div className='info'>
				<Info 
					history={game.history({verbose:true})}
					numMovements={movementsState}
					configState={configState} 
					onClickResetMatch={onClickResetMatch}
					onSelectTab={onSelectTab} 
					onChangeBoardOrientation={onChangeBoardOrientation} 
					onChangeUpdateFreq={onChangeUpdateFreq} 
					onChangeDepth={onChangeDepth}
					onChangeReduceIterations={onChangeReduceIterations}
					onChangeShowAscii={onChangeShowAscii}
					onChangeDebugMode={onChangeDebugMode}
				/>
			</div>
		</>
	);
}