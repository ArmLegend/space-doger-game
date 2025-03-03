import React from 'react';
import { Position } from '../types';

interface ShipProps {
  position: Position;
  size: number;
}

export const Ship: React.FC<ShipProps> = ({ position, size }) => {
  return (
    <div 
      style={{
        position: 'absolute',
        left: position.x - size / 2,
        top: position.y - size / 2,
        width: size,
        height: size,
        backgroundColor: '#5eaeff',
        borderRadius: '50%',
        clipPath: 'polygon(50% 0%, 65% 20%, 85% 20%, 75% 40%, 90% 60%, 50% 80%, 10% 60%, 25% 40%, 15% 20%, 35% 20%)',
        transform: 'rotate(0deg)',
        boxShadow: '0 0 10px #5eaeff'
      }}
    />
  );
};