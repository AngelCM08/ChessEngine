import React, { useState } from 'react';
import Stockfish from 'stockfish-js';

const StockfishComponent = ({ position }) => {
    const [bestMove, setBestMove] = useState('');

    const engine = new Stockfish();

    const onEngineMessage = (event) => {
        const message = event.data;
        if (message.startsWith('bestmove')) {
            const bestMoveRegex = /^bestmove ([a-h][1-8][a-h][1-8])/;
            const match = bestMoveRegex.exec(message);
            if (match) {
                setBestMove(match[1]);
            }
        }
    };

    engine.onmessage = onEngineMessage;

    const positionString = position.join(' ');

    engine.postMessage(`position fen ${positionString}`);
    engine.postMessage('go depth 5');

    return (
        <div>
            <p>Best move: {bestMove}</p>
        </div>
    );
};

export default StockfishComponent;