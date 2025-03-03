import React from 'react';

interface GameOverProps {
  score: number;
  onRestart: () => void;
}

export const GameOver: React.FC<GameOverProps> = ({ score, onRestart }) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        padding: '2rem',
        borderRadius: '0.5rem',
        textAlign: 'center',
        width: '300px',
      }}
    >
      <h2>Game Over</h2>
      <p>Your score: {Math.floor(score)}</p>
      <button
        onClick={onRestart}
        style={{
          backgroundColor: '#5eaeff',
          color: 'white',
          border: 'none',
          padding: '0.5rem 1rem',
          borderRadius: '0.25rem',
          cursor: 'pointer',
          marginTop: '1rem',
        }}
      >
        Play Again
      </button>
    </div>
  );
};