import StateMachine from "./fsm-library/fsm";

export type SetMessage = (message: string) => void;
export type SetOrder = (order: string) => void;
export type FetchOrders = () => Promise<void>;

export function waitingState(setMessage: SetMessage): void {
  setMessage('Vending machine is waiting for an order.');
}

export function processingState(
  setMessage: SetMessage,
  setOrder: SetOrder,
  fsm: StateMachine
) : void {
  setMessage('Vending machine is processing the order.');
  setOrder('');
  setTimeout(() => {
    fsm.transitionTo('onRoute');
  }, 1000);
};

export function onRouteState(
  setMessage: SetMessage,
  fsm: StateMachine
) : void {
  setMessage('The order is on its way to the customer.');
  setTimeout(() => {
    fsm.transitionTo('delivered');
  }, 1000);
};

export function deliveredState (
  setMessage: SetMessage,
  fetchOrders: FetchOrders,
  fsm: StateMachine
) : void {
  setMessage('The order has been delivered to the customer.');
  setTimeout(async () => {
    await fetchOrders();
    fsm.transitionTo('waiting');
  }, 1000);
};
