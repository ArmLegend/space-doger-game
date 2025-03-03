// src/App.test.tsx
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import App from './App';

// Mock requestAnimationFrame and cancelAnimationFrame
global.requestAnimationFrame = vi.fn((callback) => {
  return setTimeout(() => callback(performance.now()), 16);
});

global.cancelAnimationFrame = vi.fn((id) => {
  clearTimeout(id);
});

describe('Space Dodger Game', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders the game title', () => {
    render(<App />);
    expect(screen.getByText('Space Dodger')).toBeInTheDocument();
  });

  it('renders the ship', () => {
    render(<App />);
    const ship = document.querySelector('.ship');
    expect(ship).toBeInTheDocument();
  });

  it('renders the score and level', () => {
    render(<App />);
    expect(screen.getByText(/Score:/)).toBeInTheDocument();
    expect(screen.getByText(/Level:/)).toBeInTheDocument();
  });

  it('renders the manual controls', () => {
    render(<App />);
    expect(screen.getByText('Up')).toBeInTheDocument();
    expect(screen.getByText('Left')).toBeInTheDocument();
    expect(screen.getByText('Right')).toBeInTheDocument();
    expect(screen.getByText('Down')).toBeInTheDocument();
  });

  it('moves the ship left when Left arrow key is pressed', async () => {
    render(<App />);
    const ship = document.querySelector('.ship') as HTMLElement;
    
    // Get initial position
    const initialLeft = ship.style.left;
    
    // Press left key
    fireEvent.keyDown(document, { key: 'ArrowLeft' });
    
    // Fast-forward time to allow movement to occur
    act(() => {
      vi.advanceTimersByTime(100);
    });
    
    // Release key
    fireEvent.keyUp(document, { key: 'ArrowLeft' });
    
    // Check if ship moved to the left
    expect(parseFloat(ship.style.left)).toBeLessThan(parseFloat(initialLeft));
  });

  it('moves the ship right when Right arrow key is pressed', async () => {
    render(<App />);
    const ship = document.querySelector('.ship') as HTMLElement;
    
    // Get initial position
    const initialLeft = ship.style.left;
    
    // Press right key
    fireEvent.keyDown(document, { key: 'ArrowRight' });
    
    // Fast-forward time to allow movement to occur
    act(() => {
      vi.advanceTimersByTime(100);
    });
    
    // Release key
    fireEvent.keyUp(document, { key: 'ArrowRight' });
    
    // Check if ship moved to the right
    expect(parseFloat(ship.style.left)).toBeGreaterThan(parseFloat(initialLeft));
  });

  it('moves the ship up when Up arrow key is pressed', async () => {
    render(<App />);
    const ship = document.querySelector('.ship') as HTMLElement;
    
    // Get initial position
    const initialTop = ship.style.top;
    
    // Press up key
    fireEvent.keyDown(document, { key: 'ArrowUp' });
    
    // Fast-forward time to allow movement to occur
    act(() => {
      vi.advanceTimersByTime(100);
    });
    
    // Release key
    fireEvent.keyUp(document, { key: 'ArrowUp' });
    
    // Check if ship moved up
    expect(parseFloat(ship.style.top)).toBeLessThan(parseFloat(initialTop));
  });

  it('moves the ship down when Down arrow key is pressed', async () => {
    render(<App />);
    const ship = document.querySelector('.ship') as HTMLElement;
    
    // Get initial position
    const initialTop = ship.style.top;
    
    // Press down key
    fireEvent.keyDown(document, { key: 'ArrowDown' });
    
    // Fast-forward time to allow movement to occur
    act(() => {
      vi.advanceTimersByTime(100);
    });
    
    // Release key
    fireEvent.keyUp(document, { key: 'ArrowDown' });
    
    // Check if ship moved down
    expect(parseFloat(ship.style.top)).toBeGreaterThan(parseFloat(initialTop));
  });

  it('moves the ship when manual control buttons are clicked', () => {
    render(<App />);
    const ship = document.querySelector('.ship') as HTMLElement;
    
    // Get initial position
    const initialTop = ship.style.top;
    
    // Click the down button and hold
    const downButton = screen.getByText('Down');
    fireEvent.mouseDown(downButton);
    
    // Fast-forward time
    act(() => {
      vi.advanceTimersByTime(100);
    });
    
    // Release button
    fireEvent.mouseUp(downButton);
    
    // Check if ship moved down
    expect(parseFloat(ship.style.top)).toBeGreaterThan(parseFloat(initialTop));
  });

  it('creates asteroids as time passes', () => {
    render(<App />);
    
    // Initially there should be no asteroids
    const initialAsteroids = document.querySelectorAll('.asteroid');
    expect(initialAsteroids.length).toBe(0);
    
    // Advance time to allow asteroid creation
    act(() => {
      vi.advanceTimersByTime(5000); // Advance time by 5 seconds
    });
    
    // Now there should be some asteroids
    const asteroids = document.querySelectorAll('.asteroid');
    expect(asteroids.length).toBeGreaterThan(0);
  });

//   it('shows game over screen when restarting the game', () => {
//     render(<App />);
    
//     // Game over screen should not be visible initially
//     const gameOverText = screen.queryByText('Game Over');
//     expect(gameOverText).not.toBeInTheDocument();
    
//     // Manually set game over state by accessing the internal functions
//     // This is a bit of a hack, but it's useful for testing
//     const restartButton = screen.getByText('Play Again');
    
//     // Set game over and then restart
//     act(() => {
//       // First we need to simulate a game over
//       // Since we can't directly access component state, we'll use a workaround
//       // Find an element that only exists in the game over screen
//       expect(restartButton).toBeInTheDocument();
      
//       // Click restart button
//       fireEvent.click(restartButton);
//     });
    
//     // Game over screen should disappear after restart
//     expect(screen.queryByText('Game Over')).not.toBeInTheDocument();
//   });

  it('increases score as time passes', () => {
    render(<App />);
    
    // Get initial score
    const initialScoreElement = screen.getByText(/Score:/);
    const initialScoreText = initialScoreElement.textContent;
    const initialScore = parseFloat(initialScoreText?.replace('Score: ', '') || '0');
    
    // Advance time
    act(() => {
      vi.advanceTimersByTime(5000); // 5 seconds
    });
    
    // Get updated score
    const updatedScoreElement = screen.getByText(/Score:/);
    const updatedScoreText = updatedScoreElement.textContent;
    const updatedScore = parseFloat(updatedScoreText?.replace('Score: ', '') || '0');
    
    // Score should increase
    expect(updatedScore).toBeGreaterThan(initialScore);
  });

  it('supports WASD keys for movement', async () => {
    render(<App />);
    const ship = document.querySelector('.ship') as HTMLElement;
    
    // Get initial position
    const initialLeft = ship.style.left;
    
    // Press 'a' key (left)
    fireEvent.keyDown(document, { key: 'a' });
    
    // Fast-forward time
    act(() => {
      vi.advanceTimersByTime(100);
    });
    
    // Release key
    fireEvent.keyUp(document, { key: 'a' });
    
    // Check if ship moved to the left
    expect(parseFloat(ship.style.left)).toBeLessThan(parseFloat(initialLeft));
    
    // Similarly test 'd' key for right movement
    fireEvent.keyDown(document, { key: 'd' });
    act(() => { vi.advanceTimersByTime(100); });
    fireEvent.keyUp(document, { key: 'd' });
    // Should now be back near original position
    expect(parseFloat(ship.style.left)).toBeCloseTo(parseFloat(initialLeft), 0);
  });
});