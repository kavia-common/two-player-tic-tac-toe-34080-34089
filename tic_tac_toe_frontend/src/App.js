import React, { useEffect, useMemo, useState } from 'react';
import './App.css';

/**
 * Retro-themed Tic Tac Toe game implemented with React hooks.
 * - Two local players alternate turns (X and O)
 * - Win/draw detection with winning line highlight
 * - Reset/New Game controls
 * - Responsive layout with light theme accents (#3b82f6, #06b6d4)
 */

// Helpers
const LINES = [
  [0, 1, 2], // rows
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6], // cols
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8], // diags
  [2, 4, 6],
];

// PUBLIC_INTERFACE
function App() {
  /** Persist light theme as default and allow toggle for accessibility preference */
  const [theme, setTheme] = useState('light');

  // Game state
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [moveCount, setMoveCount] = useState(0);
  const [history, setHistory] = useState([]); // optional move history [ { index, player } ]

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Determine winner and winning line
  const { winner, line } = useMemo(() => {
    for (const [a, b, c] of LINES) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return { winner: board[a], line: [a, b, c] };
      }
    }
    return { winner: null, line: [] };
  }, [board]);

  const isDraw = !winner && moveCount === 9;

  // PUBLIC_INTERFACE
  const toggleTheme = () => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));

  const handleSquareClick = (idx) => {
    if (board[idx] || winner) return; // ignore if filled or game ended
    const nextBoard = board.slice();
    nextBoard[idx] = xIsNext ? 'X' : 'O';
    setBoard(nextBoard);
    setXIsNext(!xIsNext);
    setMoveCount((c) => c + 1);
    setHistory((h) => [...h, { index: idx, player: nextBoard[idx] }]);
  };

  // PUBLIC_INTERFACE
  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    setMoveCount(0);
    setHistory([]);
  };

  let status = `Player ${xIsNext ? 'X' : 'O'}'s turn`;
  if (winner) status = `Player ${winner} wins!`;
  else if (isDraw) status = "It's a draw";

  return (
    <div className="ttt-app">
      <header className="ttt-header">
        <h1 className="ttt-title" aria-label="Tic Tac Toe title">
          ▓█ Retro Tic Tac Toe █▓
        </h1>

        <button
          className="ttt-theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
      </header>

      <main className="ttt-main" role="main">
        <section className="ttt-board-wrapper">
          <div
            className="ttt-board"
            role="grid"
            aria-label="Tic Tac Toe board"
          >
            {board.map((value, idx) => {
              const isWinning = line.includes(idx);
              return (
                <button
                  key={idx}
                  role="gridcell"
                  aria-label={`Square ${idx + 1} ${value ? value : 'empty'}`}
                  className={`ttt-square ${isWinning ? 'win' : ''}`}
                  onClick={() => handleSquareClick(idx)}
                  disabled={Boolean(winner) || Boolean(value)}
                >
                  <span className={`ttt-mark ${value === 'X' ? 'x' : 'o'}`}>
                    {value}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="ttt-status" aria-live="polite">
          <p className={`ttt-status-text ${winner ? 'won' : isDraw ? 'draw' : ''}`}>
            {status}
          </p>
          <div className="ttt-controls">
            <button className="ttt-btn" onClick={resetGame} aria-label="Reset game">
              ⟳ New Game
            </button>
          </div>
        </section>

        {history.length > 0 && (
          <section className="ttt-history" aria-label="Move history">
            <h2 className="ttt-subtitle">Moves</h2>
            <ol className="ttt-move-list">
              {history.map((h, i) => (
                <li key={`${h.index}-${i}`}>
                  <span className="ttt-move">{i + 1}.</span>{' '}
                  <span className="ttt-move-player">Player {h.player}</span>{' '}
                  <span className="ttt-move-pos">→ {squareLabel(h.index)}</span>
                </li>
              ))}
            </ol>
          </section>
        )}
      </main>

      <footer className="ttt-footer">
        <small>Use keyboard or mouse to play. Tab through squares and press Enter.</small>
      </footer>
    </div>
  );
}

function squareLabel(index) {
  // human-friendly row/col 1-3
  const row = Math.floor(index / 3) + 1;
  const col = (index % 3) + 1;
  return `Row ${row}, Col ${col}`;
}

export default App;
