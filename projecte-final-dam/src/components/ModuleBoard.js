import React, { useState, useEffect } from 'react';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';

export const ModuleBoard = ({ position }) => {
  const [game, setGame] = useState(new Chess());
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const updatePosition = () => {
      const updatedGame = new Chess();
      updatedGame.load(position[currentIndex]);
      setGame(updatedGame);
      setCurrentIndex((prevIndex) => (prevIndex + 1) % position.length);
    };

    if (position !== undefined && position.length > 0) {
      const interval = setInterval(updatePosition, 1000); // Actualiza cada 1 segundo (1000 ms)

      return () => clearInterval(interval); // Limpia el intervalo al desmontar el componente
    }
  }, [position, game]);

  return <Chessboard position={game.fen()} arePiecesDraggable={false} customBoardStyle={{border: '2px solid black'}} />;
};