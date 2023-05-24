import React, { useState, useEffect } from 'react';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';

export const ModuleBoard = ({ position, configState }) => {
	const [game, setGame] = useState(new Chess());
	const [currentIndex, setCurrentIndex] = useState(0);

	useEffect(() => {
		setCurrentIndex(0); // Restarts currentIndex to 0 when a new position is set
	}, [position]);

	useEffect(() => {
		const updatePosition = () => {
			if (currentIndex < position.length) {
				const updatedGame = new Chess(position[currentIndex]);
				setGame(updatedGame);
				setCurrentIndex((prevIndex) => (prevIndex + 1) % position.length); // When prevIndex === position.length returns to 0
			} else setCurrentIndex(0);
		};

		if (position !== undefined && position.length > 0) {
			const interval = setInterval(updatePosition, configState.updateFreq); // Makes a Timeout

			return () => clearInterval(interval);
		}
	}, [position, game]);

	return <>
		<Chessboard
			position={game.fen()}
			boardOrientation={configState.boardOrientation}
			animationDuration={0}
			arePiecesDraggable={false}
			customBoardStyle={{ border: '2px solid black' }}
		/>
	</>;
};