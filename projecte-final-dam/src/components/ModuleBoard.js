import React, {useState, useEffect} from 'react'
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";

export const ModuleBoard = ({position}) => {
	const [game, setGame] = useState(new Chess());

	useEffect(() => { 
		console.log(position);
		if(!(position === undefined)){
			//console.log("Pos: "+position);
			const updatedGame = new Chess();
			updatedGame.move(position[0]);
			console.log(position[0]);
			setGame(updatedGame);
		}
		console.log(game.ascii());
	}, [position]);

	return (
		<>
			<Chessboard position={game.fen()} />
		</>
	);
}