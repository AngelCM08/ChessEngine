import React, {useState, useEffect} from 'react'
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";

export const ModuleBoard = ({position}) => {
	const [game, setGame] = useState(new Chess());

	useEffect(() => { 
		if(position !== undefined && position.length > 0){
			//console.log("Pos: "+position);
			const updatedGame = new Chess();
			updatedGame.load(position[0]);
			setGame(updatedGame);
		}
	}, [position]);

	return (
		<>
			<Chessboard position={game.fen()} />
		</>
	);
}