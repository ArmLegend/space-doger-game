export interface Position {
    x: number;
    y: number;
  }
  
  export interface GameObject {
    id: string;
    position: Position;
    velocity: Position;
    size: number;
  }
  
  export interface GameState {
    ship: Position;
    asteroids: GameObject[];
    gameOver: boolean;
    score: number;
    level: number;
  }