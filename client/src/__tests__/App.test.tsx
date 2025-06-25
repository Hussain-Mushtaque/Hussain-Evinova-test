import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import App from '../App';
import { render } from '../utils/test-utils';

vi.mock('../components/PokemonBattle', () => ({
  default: () => <div data-testid="pokemon-battle">Mocked Pokemon Battle Component</div>,
}));

describe('App Component', () => {
  it('renders the App component', () => {
    render(<App />);
    
    expect(screen.getByTestId('pokemon-battle')).toBeInTheDocument();
  });

  it('has the correct CSS class', () => {
    const { container } = render(<App />);
    
    expect(container.firstChild).toHaveClass('App');
  });
});
