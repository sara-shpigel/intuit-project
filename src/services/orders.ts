import axios from 'axios';

export const getOrders = async () => {
    try {
        const response = await axios.get('http://localhost:3001/orders');
        return response.data;
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
};

export const addOrder = async (order: String) => {
    try {
        await axios.post('http://localhost:3001/orders', { order });
      } catch (error) {
        console.error('Error submitting order:', error);
      }
};