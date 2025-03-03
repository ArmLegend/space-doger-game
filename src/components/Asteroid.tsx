import React from 'react';
import { GameObject } from '../types';

interface AsteroidProps {
  asteroid: GameObject;
}

export const Asteroid: React.FC<AsteroidProps> = ({ asteroid }) => {
  return (
    <div
      style={{
        position: 'absolute',
        left: asteroid.position.x - asteroid.size / 2,
        top: asteroid.position.y - asteroid.size / 2,
        width: asteroid.size,
        height: asteroid.size,
        backgroundColor: '#888',
        borderRadius: '50%',
        boxShadow: 'inset 5px -5px 15px rgba(0, 0, 0, 0.4)',
      }}
    />
  );
};