import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import FoodVendingMachine from '.';
import { getOrders, addOrder } from '../../services/orders';

jest.mock('../../services/orders', () => ({
  getOrders: jest.fn(),
  addOrder: jest.fn()
}));

describe('FoodVendingMachine', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    render(<FoodVendingMachine />);
    expect(screen.getByText('Food Vending Machine')).toBeInTheDocument();
    expect(screen.getByLabelText('Enter your food order')).toBeInTheDocument();
    expect(screen.getByText('Submit Order')).toBeInTheDocument();
  });

  it('submits order and transitions through states correctly', async () => {
    (addOrder as jest.Mock).mockResolvedValueOnce({ id: 0, name: 'Pizza' });    
    (getOrders as jest.Mock).mockResolvedValue([{ id: 0, name: 'Pizza' }]);

    render(<FoodVendingMachine />);
    const orderInput = screen.getByLabelText('Enter your food order');
    fireEvent.change(orderInput, { target: { value: 'Pizza' } });
    fireEvent.click(screen.getByText('Submit Order'));

    await waitFor(() => expect(screen.getByText('Vending machine is processing the order.')).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText('The order is on its way to the customer.')).toBeInTheDocument(), { timeout: 1000 });
    await waitFor(() => expect(screen.getByText('The order has been delivered to the customer.')).toBeInTheDocument(), { timeout: 1000 });
    await waitFor(() => expect(screen.getByText('Vending machine is waiting for an order.')).toBeInTheDocument(), { timeout: 1000 });
    await waitFor(() => expect(screen.getByText('The order Pizza has been delivered to the customer.')).toBeInTheDocument());
  });

  it('displays error message when submitting empty order', async () => {
    (getOrders as jest.Mock).mockResolvedValueOnce([]);
    render(<FoodVendingMachine />);
    fireEvent.click(screen.getByText('Submit Order'));
    await waitFor(() => expect(screen.getByText('Please enter a valid food order.')).toBeInTheDocument());
  
    const orderInput = screen.getByLabelText('Enter your food order');
    fireEvent.change(orderInput, { target: { value: 'Pizza' } });
    fireEvent.click(screen.getByText('Submit Order'));
  
    await waitFor(() => expect(screen.queryByText('Please enter a valid food order.')).toBeNull());
  });

  it('fetches orders on component mount and displays them', async () => {
    (getOrders as jest.Mock).mockResolvedValueOnce([{ id: 1, name: 'Burger' }]);
    render(<FoodVendingMachine />);
    await waitFor(() => expect(screen.getByText('The order Burger has been delivered to the customer.')).toBeInTheDocument());
  });
});
