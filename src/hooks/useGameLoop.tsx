import { useState, useEffect, useRef } from 'react';
import { GameState, GameObject, Position } from '../types';

const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;
const SHIP_SIZE = 30;
const ASTEROID_MIN_SIZE = 20;
const ASTEROID_MAX_SIZE = 60;
const ASTEROID_SPEED_MIN = 1;
const ASTEROID_SPEED_MAX = 5;

export const useGameLoop = () => {
  const [gameState, setGameState] = useState<GameState>({
    ship: { x: GAME_WIDTH / 2, y: GAME_HEIGHT - 100 },
    asteroids: [],
    gameOver: false,
    score: 0,
    level: 1,
  });
  
  const frameRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const keysPressed = useRef<Set<string>>(new Set());
  
  // Initialize key handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current.add(e.key);
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.key);
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      cancelAnimationFrame(frameRef.current);
    };
  }, []);
  
  // Create a new asteroid
  const createAsteroid = (): GameObject => {
    const size = Math.random() * (ASTEROID_MAX_SIZE - ASTEROID_MIN_SIZE) + ASTEROID_MIN_SIZE;
    const speed = Math.random() * (ASTEROID_SPEED_MAX - ASTEROID_SPEED_MIN) + ASTEROID_SPEED_MIN;
    
    return {
      id: Math.random().toString(36).substr(2, 9),
      position: {
        x: Math.random() * GAME_WIDTH,
        y: -size,
      },
      velocity: {
        x: (Math.random() - 0.5) * 2,  // Random x direction
        y: speed + (gameState.level * 0.5),  // Speed increases with level
      },
      size,
    };
  };
  
  // Check collision between ship and asteroid
  const checkCollision = (ship: Position, asteroid: GameObject): boolean => {
    const dx = ship.x - asteroid.position.x;
    const dy = ship.y - asteroid.position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    return distance < (SHIP_SIZE / 2 + asteroid.size / 2);
  };
  
  // Main game loop
  const gameLoop = (timestamp: number) => {
    if (!lastTimeRef.current) {
      lastTimeRef.current = timestamp;
    }
    
    const deltaTime = timestamp - lastTimeRef.current;
    lastTimeRef.current = timestamp;
    
    if (gameState.gameOver) {
      return;
    }
    
    // Update ship position based on keys
    const moveSpeed = 8;
    let newShipX = gameState.ship.x;
    let newShipY = gameState.ship.y;
    
    if (keysPressed.current.has('ArrowLeft') || keysPressed.current.has('a')) {
      newShipX = Math.max(SHIP_SIZE / 2, gameState.ship.x - moveSpeed);
    }
    if (keysPressed.current.has('ArrowRight') || keysPressed.current.has('d')) {
      newShipX = Math.min(GAME_WIDTH - SHIP_SIZE / 2, gameState.ship.x + moveSpeed);
    }
    if (keysPressed.current.has('ArrowUp') || keysPressed.current.has('w')) {
      newShipY = Math.max(SHIP_SIZE / 2, gameState.ship.y - moveSpeed);
    }
    if (keysPressed.current.has('ArrowDown') || keysPressed.current.has('s')) {
      newShipY = Math.min(GAME_HEIGHT - SHIP_SIZE / 2, gameState.ship.y + moveSpeed);
    }
    
    // Randomly spawn new asteroids
    let newAsteroids = [...gameState.asteroids];
    if (Math.random() < 0.02 + (gameState.level * 0.005)) {
      newAsteroids.push(createAsteroid());
    }
    
    // Update asteroid positions
    newAsteroids = newAsteroids.map(asteroid => ({
      ...asteroid,
      position: {
        x: asteroid.position.x + asteroid.velocity.x,
        y: asteroid.position.y + asteroid.velocity.y,
      },
    })).filter(asteroid => 
      asteroid.position.y < GAME_HEIGHT + asteroid.size
    );
    
    // Check for collisions
    let isGameOver = false;
    for (const asteroid of newAsteroids) {
      if (checkCollision({ x: newShipX, y: newShipY }, asteroid)) {
        isGameOver = true;
        break;
      }
    }
    
    // Update score and level
    const newScore = gameState.score + (deltaTime * 0.01);
    const newLevel = Math.floor(newScore / 1000) + 1;
    
    setGameState({
      ship: { x: newShipX, y: newShipY },
      asteroids: newAsteroids,
      gameOver: isGameOver,
      score: newScore,
      level: newLevel,
    });
    
    frameRef.current = requestAnimationFrame(gameLoop);
  };
  
  // Start game loop
  const startGame = () => {
    setGameState({
      ship: { x: GAME_WIDTH / 2, y: GAME_HEIGHT - 100 },
      asteroids: [],
      gameOver: false,
      score: 0,
      level: 1,
    });
    
    lastTimeRef.current = 0;
    frameRef.current = requestAnimationFrame(gameLoop);
  };
  
  return {
    gameState,
    startGame,
    GAME_WIDTH,
    GAME_HEIGHT,
    SHIP_SIZE,
  };
};