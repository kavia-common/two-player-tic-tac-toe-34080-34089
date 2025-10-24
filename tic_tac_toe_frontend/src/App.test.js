import { render, screen } from '@testing-library/react';
import App from './App';

test("renders Tic Tac Toe title and status", () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /retro tic tac toe/i })).toBeInTheDocument();
  expect(screen.getByText(/player x's turn/i)).toBeInTheDocument();
});
