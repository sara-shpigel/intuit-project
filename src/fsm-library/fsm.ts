type ConditionFunction = () => boolean;
export type StateAction = () => void;

class StateMachine {
  private currentState: string;
  private states: { [key: string]: StateAction };
  private transitions: { [key: string]: { [key: string]: ConditionFunction } };

  constructor(initialState: string) {
    this.currentState = initialState;
    this.states = {};
    this.transitions = {};
  }

  public addState(name: string, action: StateAction): void {
    this.states[name] = action;
  }

  public addTransition(from: string, to: string, condition: ConditionFunction): void {
    if (!this.transitions[from]) {
      this.transitions[from] = {};
    }
    this.transitions[from][to] = condition;
  }

  public transitionTo(newState: string): void {
      this.currentState = newState;
      this.states[newState]();
  }

  public getState(): string {
    return this.currentState;
  }
}

export default StateMachine;
