import { AnyAction } from 'redux';

import { PayloadAction, SimpleAction } from '../index';

export class StoreModule<ActionType extends string, S extends {}> {
  path: string;

  initialState: S;

  reducers: {
    [key in ActionType]?: <
      A extends PayloadAction<ActionType, unknown> | SimpleAction<ActionType>
    >(
      state: S,
      action: A
    ) => S;
  } = {};

  selectors: { [key in ActionType]?: (state: S) => any[] } = {};

  constructor(path: string, initialState: S) {
    this.path = path;
    this.initialState = initialState;
  }

  setPayloadAction<P extends any>(
    type: ActionType,
    logic: (payload: P) => P,
    tinyReducer: (state: S, action: PayloadAction<ActionType, P>) => S
  ) {
    this.reducers[type] = tinyReducer as (state: S, action: AnyAction) => S;
    return {
      type: { type, payload: (undefined as unknown) as P },
      action: (payload: P) => ({ type, payload: logic(payload) }),
    };
  }

  setSimpleAction(
    type: ActionType,
    tinyReducer: (state: S, action: SimpleAction<ActionType> | AnyAction) => S
  ) {
    this.reducers[type] = tinyReducer;
    return { type: { type }, action: () => ({ type }) };
  }

  getReducer() {
    return <
      A extends PayloadAction<ActionType, any> | SimpleAction<ActionType>
    >(
      state: S = this.initialState,
      action: A
    ) => {
      const thisReducer = this.reducers[action.type];
      if (thisReducer) return thisReducer(state, action);
      return state;
    };
  }

  helper<T>(state: T, separator: string = "."): S {
    return this.resolve( this.path, state, separator);
  }

  private resolve<T>(path: string, object: T, separator = "."): S {
    return path.split(separator).reduce((r: Object, val) => (r ? (r as any)[val] : undefined), object) as S;
  }

}
