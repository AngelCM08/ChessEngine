import React, {useState, useEffect} from 'react'
import { Chessboard } from "react-chessboard";

export const ModuleBoard = ({position}) => {
	const [moduleBoardPosition, setModuleBoardPosition] = useState('');

	useEffect(() => { 
		console.log(position);
		setModuleBoardPosition(position);
	}, [position]);

	return (
		<div>
			<Chessboard position={moduleBoardPosition} />
		</div>
	);
}