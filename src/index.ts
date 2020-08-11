/* eslint-disable @typescript-eslint/no-explicit-any */
import { Action, Reducer as ReducerFromRedux, AnyAction, Dispatch } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { StoreModule } from './helpers/StoreModule';

export interface GlobalStateBase {
  [key: string]: any;
}

export interface SimpleAction<TType = Action> {
  type: TType;
}
export interface PayloadAction<TType, TPayload> extends SimpleAction<TType> {
  payload: TPayload;
}

// Generic dispatch
export type GenericDispatch<State> = Dispatch<AnyAction> & ThunkDispatch<State, null, AnyAction>;

// Reducer
export type Reducer<StateI, ActionI extends Action<unknown>> = ReducerFromRedux<StateI, ActionI>;

export { StoreModule };
