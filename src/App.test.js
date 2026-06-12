import { render, screen } from '@testing-library/react';
import App from './App';

test('renders body text', () => {
  render(<App />);
  const element = screen.getByText(/This is my Body/i);
  expect(element).toBeInTheDocument();
});
