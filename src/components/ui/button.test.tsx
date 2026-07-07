import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Button } from '@/components/ui/button';

describe('Button', () => {
  it('renders its children', () => {
    render(<Button>Order now</Button>);
    expect(screen.getByRole('button', { name: 'Order now' })).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Order now</Button>);

    fireEvent.click(screen.getByRole('button', { name: 'Order now' }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when the disabled prop is set', () => {
    render(<Button disabled>Order now</Button>);
    expect(screen.getByRole('button', { name: 'Order now' })).toBeDisabled();
  });
});
