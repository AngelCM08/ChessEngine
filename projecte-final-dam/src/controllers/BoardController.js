import { SQUARES } from "chess.js";
import * as constants from "../Constants.js";

let game;

export class BoardController {
    constructor(setGame) {
        game = setGame;		
    }
    evaluateBoard() {
		//TODO 1. Evaluación gradual: Es interesante variar los pesos de las funciones según la fase de juego en la que nos encontremos. 
			/*Por ejemplo, queremos que nuestro rey esté alejado del centro en el medio juego. Sin embargo, como todos sabemos, 
			es una pieza fundamental en los finales y mejor que esté en el centro. Para medir la fase de juego existente, 
			los módulos pueden usar el nº de piezas sobre el tablero por ejemplo. */		
		
		//TODO 2. Pareja de alfiles: Se puede añadir un pequeño bonus por la pareja de alfiles (con la misma se cubren todas las casillas del tablero).
			//boolean que se ponga a true si un contador de alfiles llega a 2. Siempre suma, y dejará de sumar cuando uno de los dos bandos pierda la pareja.

		//TODO 3. Tablas de piezas y casillas: Son una manera simple de asignar valores a piezas específicas en casillas específicas. 
			//Por ejemplo durante la apertura, los peones tendrán un pequeño bonus por ocupar casillas centrales.
			//******El rey en la fase final no entra a evaluar su posicion a partir de la tabla.******

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

		//console.log(whiteScore+" - "+blackScore);
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
				//Controlar las piezas alrededor del rey para sumar algunas décimas por piezas cerca.
				bonus = this.getNearbyPieces(x+1, y+1, 1);
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
		
		//Si la cantidad de movimientos posibles es superior a 16 y menor que 27 se dividen entre 2, si es superior a 27 se divide entre 3 y si es menor a 16 se cogen todos los movimientos posibles.
		//Esto se hace para simplificar el cálculo de la mejor posición ya que la cantidad de cálculos és demasiado grande y el programa no está lo suficientemente optimizado.
		//No se conseguirá siempre el mejor movimiento, pero si un cálculo de una posición relativamente buena.
		var iterations = (possibleMoves.length > 16) ? ((possibleMoves.length > 27) ? possibleMoves.length/3 : possibleMoves.length/2) : possibleMoves.length;
		const randomMoves = this.shuffle(possibleMoves).slice(0, iterations);

		for (let i = 0; i < randomMoves.length; i++) {
			game.move(randomMoves[i]);
			//Mostrar en tablero pequeño la posición actual que se está evaluando
			//console.log(game.ascii());

			//Evaluar siguiente posición
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
		// Obtener las coordenadas de la casilla en la que se encuentra la pieza que deseas examinar
		var piecePosition = this.getLetterByNum(y)+x;
		var coords = piecePosition;

		// Crear un array para almacenar las piezas adyacentes
		var nearbyPieces = [];
		var positionReaded = [];
		var positionSelected = [];

		// Examinar las casillas adyacentes a la pieza en un rango determinado
		var aux1, aux2;
		var row, col;

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
		var cont=0, rockNear, bonus=0;
		nearbyPieces.forEach(piece => {
			if(piece.type === 'p') cont++;
			if(piece.type === 'r') rockNear = true;
		});
		if(rockNear) bonus += 0.2;
		if(cont === 3) bonus += 0.3;
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