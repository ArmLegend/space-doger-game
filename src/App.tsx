import { useState, useEffect } from 'react';
import './App.css';
import { Ship } from './components/Ship';

// Game constants
const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;
const SHIP_SIZE = 30;
const ASTEROID_MIN_SIZE = 20;
const ASTEROID_MAX_SIZE = 60;

// Types
interface Position {
  x: number;
  y: number;
}

interface Asteroid {
  id: string;
  position: Position;
  velocity: Position;
  size: number;
}

function App() {
  // Ship position
  const [shipPosition, setShipPosition] = useState<Position>({ 
    x: GAME_WIDTH / 2, 
    y: GAME_HEIGHT - 100 
  });
  
  // Asteroids
  const [asteroids, setAsteroids] = useState<Asteroid[]>([]);
  
  // Game state
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [level, setLevel] = useState(1);
  
  // Key states - using separate state variables for direct control
  const [leftPressed, setLeftPressed] = useState(false);
  const [rightPressed, setRightPressed] = useState(false);
  const [upPressed, setUpPressed] = useState(false);
  const [downPressed, setDownPressed] = useState(false);
  
  // Setup key listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
        case 'a':
          setLeftPressed(true);
          break;
        case 'ArrowRight':
        case 'd':
          setRightPressed(true);
          break;
        case 'ArrowUp':
        case 'w':
          setUpPressed(true);
          break;
        case 'ArrowDown':
        case 's':
          setDownPressed(true);
          break;
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
        case 'a':
          setLeftPressed(false);
          break;
        case 'ArrowRight':
        case 'd':
          setRightPressed(false);
          break;
        case 'ArrowUp':
        case 'w':
          setUpPressed(false);
          break;
        case 'ArrowDown':
        case 's':
          setDownPressed(false);
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    // For testing/debugging - show key state in console
    console.log("Key listeners added");
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);
  
  // Move ship based on key states
  useEffect(() => {
    if (gameOver) return;
    
    const moveSpeed = 5;
    const intervalId = setInterval(() => {
      setShipPosition(prev => {
        let newX = prev.x;
        let newY = prev.y;
        
        if (leftPressed) {
          newX = Math.max(SHIP_SIZE / 2, prev.x - moveSpeed);
        }
        if (rightPressed) {
          newX = Math.min(GAME_WIDTH - SHIP_SIZE / 2, prev.x + moveSpeed);
        }
        if (upPressed) {
          newY = Math.max(SHIP_SIZE / 2, prev.y - moveSpeed);
        }
        if (downPressed) {
          newY = Math.min(GAME_HEIGHT - SHIP_SIZE / 2, prev.y + moveSpeed);
        }
        
        return { x: newX, y: newY };
      });
    }, 16); // ~60fps
    
    return () => clearInterval(intervalId);
  }, [leftPressed, rightPressed, upPressed, downPressed, gameOver]);
  
  // Game loop for asteroids and score
  useEffect(() => {
    if (gameOver) return;
    
    let frameId: number;
    let lastTime = 0;
    
    const createAsteroid = (): Asteroid => {
      const size = Math.random() * (ASTEROID_MAX_SIZE - ASTEROID_MIN_SIZE) + ASTEROID_MIN_SIZE;
      const speed = Math.random() * 3 + 1 + (level * 0.2);
      
      return {
        id: Math.random().toString(36).substring(2, 9),
        position: {
          x: Math.random() * GAME_WIDTH,
          y: -size
        },
        velocity: {
          x: (Math.random() - 0.5) * 2,
          y: speed
        },
        size
      };
    };
    
    const checkCollision = (shipPos: Position, asteroid: Asteroid): boolean => {
      const dx = shipPos.x - asteroid.position.x;
      const dy = shipPos.y - asteroid.position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      return distance < (SHIP_SIZE / 2 + asteroid.size / 2);
    };
    
    const gameLoop = (time: number) => {
      if (lastTime === 0) {
        lastTime = time;
      }
      const deltaTime = time - lastTime;
      lastTime = time;
      
      // Spawn new asteroids
      if (Math.random() < 0.02 + (level * 0.005)) {
        setAsteroids(prev => [...prev, createAsteroid()]);
      }
      
      // Update asteroids
      setAsteroids(prev => {
        // Move asteroids
        const newAsteroids = prev
          .map(asteroid => ({
            ...asteroid,
            position: {
              x: asteroid.position.x + asteroid.velocity.x,
              y: asteroid.position.y + asteroid.velocity.y
            }
          }))
          .filter(asteroid => asteroid.position.y < GAME_HEIGHT + asteroid.size);
        
        // Check for collisions
        for (const asteroid of newAsteroids) {
          if (checkCollision(shipPosition, asteroid)) {
            setGameOver(true);
            break;
          }
        }
        
        return newAsteroids;
      });
      
      // Update score and level
      setScore(prev => {
        const newScore = prev + deltaTime * 0.01;
        setLevel(Math.floor(newScore / 1000) + 1);
        return newScore;
      });
      
      if (!gameOver) {
        frameId = requestAnimationFrame(gameLoop);
      }
    };
    
    frameId = requestAnimationFrame(gameLoop);
    
    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [gameOver, level, shipPosition]);
  
  // Restart game
  const restartGame = () => {
    setShipPosition({ x: GAME_WIDTH / 2, y: GAME_HEIGHT - 100 });
    setAsteroids([]);
    setScore(0);
    setLevel(1);
    setGameOver(false);
  };
  
  return (
    <div className="App">
      <h1>Space Dodger</h1>
      
      {/* Display key state for debugging */}
      <div className="debug-info">
        Keys: {leftPressed ? 'Left ' : ''}{rightPressed ? 'Right ' : ''}
        {upPressed ? 'Up ' : ''}{downPressed ? 'Down ' : ''}
      </div>
      
      <div 
        className="game-container"
        style={{ 
          width: GAME_WIDTH, 
          height: GAME_HEIGHT, 
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: '#111',
          margin: '0 auto',
          border: '2px solid #5eaeff',
          borderRadius: '4px'
        }}
      >
        {/* Stars background */}
        {Array.from({ length: 50 }).map((_, i) => (
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
        {/* <div 
          className="ship"
          style={{
            position: 'absolute',
            left: shipPosition.x - SHIP_SIZE / 2,
            top: shipPosition.y - SHIP_SIZE / 2,
            width: SHIP_SIZE,
            height: SHIP_SIZE,
            backgroundColor: '#5eaeff',
            borderRadius: '50% 50% 0 0',
            clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
            transform: 'rotate(-90deg)',
            boxShadow: '0 0 10px #5eaeff',
            transition: 'left 0.05s, top 0.05s' // Smooth movement
          }}
        /> */}
        <Ship position={shipPosition} size={SHIP_SIZE} />
        
        {/* Asteroids */}
        {asteroids.map(asteroid => (
          <div
            key={asteroid.id}
            className="asteroid"
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
        ))}
        
        {/* Score display */}
        <div 
          className="score"
          style={{
            position: 'absolute',
            top: 20,
            left: 20,
            color: 'white',
            fontFamily: 'monospace',
            fontSize: '1.2rem',
          }}
        >
          <div>Score: {Math.floor(score)}</div>
          <div>Level: {level}</div>
        </div>
        
        {/* Game over screen */}
        {gameOver && (
          <div
            className="game-over"
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
              zIndex: 10
            }}
          >
            <h2>Game Over</h2>
            <p>Your score: {Math.floor(score)}</p>
            <button
              onClick={restartGame}
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
        )}
        
        {/* Controls */}
        <div
          className="controls"
          style={{
            position: 'absolute',
            bottom: 20,
            left: 20,
            color: 'white'
          }}
        >
          Use Arrow Keys or WASD to move
        </div>
      </div>
      
      {/* Manual controls for mobile or if keyboard isn't working */}
      <div className="manual-controls" style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <button 
          onMouseDown={() => setUpPressed(true)}
          onMouseUp={() => setUpPressed(false)}
          onTouchStart={() => setUpPressed(true)}
          onTouchEnd={() => setUpPressed(false)}
          style={{ width: '80px', height: '40px', margin: '5px' }}
        >
          Up
        </button>
        <div style={{ display: 'flex' }}>
          <button 
            onMouseDown={() => setLeftPressed(true)}
            onMouseUp={() => setLeftPressed(false)}
            onTouchStart={() => setLeftPressed(true)}
            onTouchEnd={() => setLeftPressed(false)}
            style={{ width: '80px', height: '40px', margin: '5px' }}
          >
            Left
          </button>
          <button 
            onMouseDown={() => setRightPressed(true)}
            onMouseUp={() => setRightPressed(false)}
            onTouchStart={() => setRightPressed(true)}
            onTouchEnd={() => setRightPressed(false)}
            style={{ width: '80px', height: '40px', margin: '5px' }}
          >
            Right
          </button>
        </div>
        <button 
          onMouseDown={() => setDownPressed(true)}
          onMouseUp={() => setDownPressed(false)}
          onTouchStart={() => setDownPressed(true)}
          onTouchEnd={() => setDownPressed(false)}
          style={{ width: '80px', height: '40px', margin: '5px' }}
        >
          Down
        </button>
      </div>
    </div>
  );
}

export default App;