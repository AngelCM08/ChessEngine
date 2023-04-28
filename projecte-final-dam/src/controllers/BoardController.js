import { SQUARES } from "chess.js";

let game;

const gamePhase = 
{
    //Consideramos fase inicial hasta el movimiento 12 incluído.
    Initial: 13,
    //Consideramos fase medio juego a partir del movimiento 13 y durará hasta que queden <17 piezas.
    Intermediate: 17,
    //Consideramos fase final <17 piezas.
    Final: 16
};

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

		//TODO 8. Tener la dama centralizada a partir de la jugada 10 +0.3, antes -0.2.


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
			/*if(bool){
				getNearbyPieces("e1", 1);
				bool = false;
			}*/
			if (piece.color === "w") {
				whiteScore += pieceValue;
			} else {
				blackScore += pieceValue;
			}
		}

		//console.log(whiteScore+" - "+blackScore);
		return whiteScore - blackScore;
	}

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

	getNearbyPieces(piecePosition, range) {
		// Obtener las coordenadas de la casilla en la que se encuentra la pieza que deseas examinar
		var coords = piecePosition;

		// Crear un array para almacenar las piezas adyacentes
		var nearbyPieces = [];
		var positionReaded = [];
		var positionSelected = [];

		// Examinar las casillas adyacentes a la pieza en un rango determinado
		var aux1, aux2;
		var row, col;

		for (row = ((aux1 = piecePosition[1] - range) > 0 ) ? aux1 : 1; row <= (parseInt(piecePosition[1]) + range); row++) {

			for (col = ((aux2 = this.getNumByLetter(piecePosition[0]) - range) > 0) ? aux2 : 1; col <= (this.getNumByLetter(piecePosition[0]) + range); col++) {
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
		return nearbyPieces;
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