import React from 'react';
import { useGameLoop } from '../hooks/useGameLoop';
import { Ship } from './Ship';
import { Asteroid } from './Asteroid';
import { GameOver } from './GameOver';

export const Game: React.FC = () => {
  const { gameState, startGame, GAME_WIDTH, GAME_HEIGHT, SHIP_SIZE } = useGameLoop();
  
  return (
    <div
      style={{
        width: GAME_WIDTH,
        height: GAME_HEIGHT,
        backgroundColor: '#111',
        position: 'relative',
        overflow: 'hidden',
        margin: '0 auto',
        boxShadow: '0 0 20px rgba(0, 0, 0, 0.5)',
      }}
    >
      {/* Stars background */}
      {Array.from({ length: 100 }).map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${Math.random() * 2 + 1}px`,
            height: `${Math.random() * 2 + 1}px`,
            backgroundColor: 'white',
            borderRadius: '50%',
            opacity: Math.random() * 0.8 + 0.2,
          }}
        />
      ))}
      
      {/* Ship */}
      <Ship position={gameState.ship} size={SHIP_SIZE} />
      
      {/* Asteroids */}
      {gameState.asteroids.map(asteroid => (
        <Asteroid key={asteroid.id} asteroid={asteroid} />
      ))}
      
      {/* Score and Level display */}
      <div
        style={{
          position: 'absolute',
          top: 20,
          left: 20,
          color: 'white',
          fontFamily: 'monospace',
          fontSize: '1.2rem',
        }}
      >
        <div>Score: {Math.floor(gameState.score)}</div>
        <div>Level: {gameState.level}</div>
      </div>
      
      {/* Game over screen */}
      {gameState.gameOver && (
        <GameOver score={gameState.score} onRestart={startGame} />
      )}
      
      {/* Controls info */}
      {!gameState.gameOver && gameState.score === 0 && (
        <div
          style={{
            position: 'absolute',
            bottom: 20,
            left: 20,
            color: 'white',
            fontFamily: 'monospace',
          }}
        >
          <p>Use arrow keys or WASD to move.</p>
          <p>Dodge the asteroids!</p>
        </div>
      )}
    </div>
  );
};