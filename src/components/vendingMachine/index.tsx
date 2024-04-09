import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import StateMachine from '../../fsm-library/fsm';
import { addOrder, getOrders } from '../../services/orders';
import {waitingState, processingState, onRouteState, deliveredState} from '../../stateFunctions'
import './style.css';

interface Order {
  id: number;
  name: string;
}

function FoodVendingMachine() {
  const [order, setOrder] = useState<string>('');
  const [message, setMessage] = useState<string>('Vending machine is waiting for an order.');
  const [orders, setOrders] = useState<Order[]>([]);
  const [fsm] = useState<StateMachine>(new StateMachine('waiting'));
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchOrders();
  }, []);

  fsm.addState('waiting', () => waitingState(setMessage));
  fsm.addState('processing', () => processingState(setMessage, setOrder, fsm));
  fsm.addState('onRoute', () => onRouteState(setMessage, fsm));
  fsm.addState('delivered', () => deliveredState(setMessage, fetchOrders, fsm));

  async function fetchOrders() {
    try {
      const result = await getOrders();
      setOrders(result);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  }

  async function handleSubmitOrder() {
    try {
      if (order.trim() === '') {
        setError('Please enter a valid food order.');
        return;
      }
      setError('');
      fsm.transitionTo('processing');
      await addOrder(order);
    } catch (error) {
      console.error('Error submitting order:', error);
    }
  }

  return (
    <div className="container">
      <h1 className="heading">Food Vending Machine</h1>
      <h3 className="message">Food Vending Machine State: {fsm.getState()}</h3>
      <p className="message">{message}</p>
      <div className="input-container">
        <TextField className="input-field" value={order} onChange={(e) => setOrder(e.target.value)} label="Enter your food order" variant="outlined" />
      </div>
      <div className="button-container">
        <Button className="button" variant="outlined" onClick={handleSubmitOrder}>Submit Order</Button>
      </div>
      {error && <p className="error">{error}</p>}
      <div className="orders-list">
        <List dense>
          {orders.map((order) => (
            <ListItem key={order.id} className="order-item">
              <ListItemText primary={`The order ${order.name} has been delivered to the customer.`} />
            </ListItem>
          ))}
        </List>
      </div>
    </div>
  );
  
  
  
  
}

export default FoodVendingMachine;
