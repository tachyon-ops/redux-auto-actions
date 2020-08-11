# REDUX-AUTO-ACTIONS

<!-- STORY -->

<hr>

A component for triggering a user action. e.g: a submit button in a form

## Import

```js
import { StoreModule } from 'redux-auto-actions';
```

## Usage

1. First create `app-actions.ts`

```ts
export interface AppState {
  counter: number;
}
export enum AppStateLabel {
  STATE = 'app',
}
export const appS = new StoreModule<ActionType, AppState>(AppStateLabel.STATE, { counter: 0 });
export const AppInitialState = appS.initialState;

export enum ActionType {
  INCREMENT = 'INCREMENT',
  DECREMENT = 'DECREMENT',
  RESET = 'RESET',
}

/**
 * Exportable Actions
 */
const { action: increment, type: incrementType } = appS.setPayloadAction<number>(
  ActionType.INCREMENT,
  (amount) => amount,
  (state, action) => ({ ...state, counter: state.counter + action.payload })
);
const { action: decrement, type: decrementType } = appS.setPayloadAction<number>(
  ActionType.DECREMENT,
  (amount) => -amount,
  (state, action) => ({ ...state, counter: state.counter + action.payload })
);
const { action: reset, type: resetType } = appS.setSimpleAction(ActionType.RESET, () => appS.initialState);

type AllAppActions = typeof incrementType | typeof decrementType | typeof resetType;

/**
 * Thunks
 */
type AppThunks<R> = ThunkAction<R, GlobalState, null, AllAppActions>;

type TestAyncThunk = (amount: number) => AppThunks<boolean>;
const testAsync: TestAyncThunk = (amount) => (dispatch) => {
  setTimeout(() => dispatch(increment(amount)), 1000);
  return true;
};

export const actions = {
  increment,
  decrement,
  reset,
  testAsync,
};

/**
 * Reducer
 */
export const AppReducer = appS.getReducer();

/**
 * Exportable Selectors
 */
function counter(state: GlobalState) {
  return appS.helper(state).counter;
}
export const selectors = {
  counter,
};
```

2. Now setup store `store.ts`

```ts
import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import { AppState, AppStateLabel, AppInitialState, AppReducer } from './app.actions';

export interface GlobalState {
  [AppStateLabel.STATE]: AppState;
}
const defaultState: GlobalState = {
  [AppStateLabel.STATE]: AppInitialState,
};

const combinedReducers = combineReducers({
  [AppStateLabel.STATE]: AppReducer,
});

export const store = createStore(combinedReducers, defaultState, applyMiddleware(thunk));
```

3. Once you connect your store to the app, by means of setting up the `Provider`

```ts
<Provider store={store}>
  <App />
</Provider>
```

4. You can create your `App.tsx`

```tsx
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { GlobalState } from './store';
import { selectors, actions } from './store/app.actions';
import { AppButton } from './components/Button';
import './App.css';

const connector = connect(
  (state: GlobalState) => ({
    counter: selectors.counter(state),
  }),
  {
    increment: actions.increment,
    decrement: actions.decrement,
    reset: actions.reset,
    testAsync: actions.testAsync,
  }
);
type PropsFromRedux = ConnectedProps<typeof connector>;

interface OwnArgs {}
interface Props extends PropsFromRedux, OwnArgs {}

const AppRaw: React.FC<Props> = ({ counter, increment, decrement, reset, testAsync }) => (
  <div className="App">
    <header className="App-header">
      <h4>{counter}</h4>
      <br />
      <AppButton label="Increment" onClick={() => increment(1)} />
      <AppButton label="Decrement" onClick={() => decrement(1)} />
      {/* <AppButton label="Increment 5" onClick={incrementFive} /> */}
      <AppButton label="Reset" onClick={() => reset()} />
      <AppButton label="TestAsync" onClick={() => testAsync(10)} />
    </header>
  </div>
);
export const App = connector(AppRaw);
```

Have fun!

### Help with work

Just fork and do a PR :) I will add you to the colaborators list with a BIG thank you!

- If you want to buy me a coffee or a beer as a thank you, I'm very much appreciated :stuck_out_tongue_winking_eye: [![Donate](https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=D3J2WXTXLAWK8&source=url)

### Guidelines

Whenever a new `master` is deployed, it should be tagged with the new deployed version.
After we reach version 1.0.0 as the first release (production ready). After that, we follow semantic versioning.

### Publishing

Remember to always publish on a merge request. Pipeline `master:only` actions will be created in the future, once we stabilize this library.

Enjoy!

## Troubleshooting

- Create an issue
