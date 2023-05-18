import { SQUARES } from "chess.js";
import * as constants from "../Constants.js";

let game;

export class BoardController {
    constructor(setGame) {
        game = setGame;		
    }
    evaluateBoard() {
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
			
			var bonusValue = this.evaluateBonus(piece, square[i]);
			
			if (piece.color === "w") {
				whiteScore += pieceValue + bonusValue;
			} else {
				blackScore += pieceValue + bonusValue;
			}
		}
		return whiteScore - blackScore;
	}

	evaluateBonus(piece, square) {
		if (piece === null) {
			return 0;
		}

		var absoluteValue = this.getAbsoluteValue(piece.type, piece.color === 'w', (this.getNumByLetter(square[0])-1), square[1]-1);
		return piece.color === 'w' ? absoluteValue : -absoluteValue;
	};	

	getAbsoluteValue(type, isWhite, x ,y) {
		var bonus=0;
		switch (type) {
			case 'p': return (isWhite ? constants.pawnEvalWhite[y][x] : constants.pawnEvalBlack[y][x]);
			case 'r':
				if(game.moves({square: this.getLetterByNum(y+1)+x}).length >= 10) bonus = 0.5;
				return (isWhite ? constants.rookEvalWhite[y][x] : constants.rookEvalBlack[y][x]);
			case 'n': return constants.knightEval[y][x];
			case 'b':
				if(game.moves({square: this.getLetterByNum(y+1)+x}).length >= 6) bonus = 0.5;
				return bonus + (isWhite ? constants.bishopEvalWhite[y][x] : constants.bishopEvalBlack[y][x]);
			case 'q': return constants.evalQueen[y][x];
			case 'k':
				bonus = this.getNearbyPieces(x+1, y+1, 2);
				return bonus + (isWhite ? constants.kingEvalWhite[y][x] : constants.kingEvalBlack[y][x]);
			default: return 0;
		  }
	};

	minimax(depth, alpha, beta, isMaximizingPlayer) {
		if (depth === 0 || game.game_over()) {
			return [null, this.evaluateBoard(game.board())];
		}

		let bestMove = null;
		let bestMoveValue = isMaximizingPlayer ? -Infinity : Infinity;
		const possibleMoves = game.moves();
		
		/*If the quantity of legal movements is above 27 they are divided by 3, if it is between 16(not included) and 27(included) they are divided by 2 and if it is under 16(included) they are not divided.
		This is done to simplify calculation for the best move because the quantity of movements is enormous and is so difficult to optimize the application.
		It is not possible to always get the best move, but it has a not that bad move in a faster time. */
		var iterations = (possibleMoves.length > 16) ? ((possibleMoves.length > 27) ? possibleMoves.length/3 : possibleMoves.length/2) : possibleMoves.length;
		const randomMoves = this.shuffle(possibleMoves).slice(0, iterations);

		for (let i = 0; i < randomMoves.length; i++) {
			game.move(randomMoves[i]);
			//Show by console the movements that are being calculated.
			//console.log(game.ascii());

			//Evaluate next position
			const [_, value] = this.minimax(depth - 1, alpha, beta, !isMaximizingPlayer);
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

			if (alpha >= beta) {
				break;
			}
		}		
		return [bestMove, bestMoveValue];
	}

	shuffle(array) {
		const copy = [...array];
		for (let i = copy.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[copy[i], copy[j]] = [copy[j], copy[i]];
		}
		return copy;
	}

	getNearbyPieces(x, y, range) {
		// Get coords of the piece that it wants to examine.
		var piecePosition = this.getLetterByNum(y)+x;
		var coords = piecePosition;
		var nearbyPieces = [];
		var positionReaded = [];
		var positionSelected = [];
		var aux1, aux2, row, col;

		for (row = ((aux1 = x - range) > 0 ) ? aux1 : 1; row <= (x + range); row++) {
			for (col = ((aux2 = y - range) > 0) ? aux2 : 1; col <= y + range; col++) {
				coords = this.getLetterByNum(col)+row;
				positionReaded.push(coords);

				if(coords !== piecePosition){
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
		return this.isKingSafe(nearbyPieces);
    }

	isKingSafe(nearbyPieces) {
		var counter=0, rockNear, bonus=0;
		nearbyPieces.forEach(piece => {
			if(piece.type === 'p') counter++;
			if(piece.type === 'r') rockNear = true;
		});
		if(rockNear) bonus += 0.2;
		if(counter === 3) bonus += 0.3;
		return bonus; 
	}

	getNumByLetter(letter){
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
	
	getLetterByNum(num) {
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
    
	consultPhase() {
		/*if(numMovements < gamePhase.Initial){
			return 0; //Initial
		}else if()*/
	}
}