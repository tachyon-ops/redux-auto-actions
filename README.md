# REDUX-AUTO-ACTIONS

<!-- STORY -->

This module is aimed at reducing the termendous amount of boilerplate that plagues react-redux flow creations. It follows the Keep It Super Simple philosophy.

## Import

```js
import { StoreModule } from 'redux-auto-actions';
```

## Usage

### 1 First create `app-actions.ts`

```ts
import { AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { GlobalState } from '../state';

import { ActionType, appS } from './app.state';

/**
 * Exportable Actions
 */
const increment = appS.setPayloadAction<number>(
  ActionType.INCREMENT,
  (state, action) => ({
    ...state,
    counter: state.counter + action.payload,
  })
);
const decrement = appS.setPayloadAction<number>(
  ActionType.DECREMENT,
  (state, action) => ({
    ...state,
    counter: state.counter - action.payload,
  })
);
const reset = appS.setSimpleAction(ActionType.RESET, () => appS.initialState);

/**
 * Thunks
 */
type AppThunks<R> = ThunkAction<R, GlobalState, null, AnyAction>;

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
export const selectors = appS.helper;
```

### 2 Now setup `app.state.ts`

```ts
import { StoreModule } from 'redux-auto-actions';

export interface AppState {
  counter: number;
}
export enum AppStateLabel {
  STATE = 'app',
}

export const appS = new StoreModule<ActionType, AppState>(AppStateLabel.STATE, {
  counter: 0,
});

export enum ActionType {
  INCREMENT = 'INCREMENT',
  DECREMENT = 'DECREMENT',
  RESET = 'RESET',
}
```

### 3 Now setup store `store.ts`

```ts
import { createStore, applyMiddleware, Store, Middleware } from 'redux';
import thunk from 'redux-thunk';

import { defaultState } from './state';
import { combinedReducers } from './reducer';

const middleware: Middleware[] = [thunk];

export const appStore: Store = createStore(
  combinedReducers,
  defaultState,
  applyMiddleware(...middleware)
);
```

### 4 Once you connect your store to the app, by means of setting up the `Provider`

```ts
import { Provider } from 'react-redux';

import { appStore } from './store/store';

// ...
<Provider store={store}>
  <App />
</Provider>
// ...
```

### 5 You can create your `App.tsx`

#### redux-auto-actions way

If you are using our cool Connect helper, which is aimed at removing TypeScript boilerplate around your component construction, you can think of any argument passed to `stateAndDispatch()` as the function signature of `connect()` from `react-redux`. Remember that for more advanced usages (using `mergeParam` or `options`) you will need to use `react-redux` boilerplate. More info in [Redux.js docs - Typing the connect higher order component](https://redux.js.org/recipes/usage-with-typescript/#typing-the-connect-higher-order-component)

```tsx
import React from 'react';
import { Connect } from 'redux-auto-actions';

import { GlobalState } from './store';
import { selectors, actions } from './store/app.actions';
import { AppButton } from './components/Button';
import './App.css';

interface AppProps {}

export const Counter = Connect<GlobalState, AppProps>()
  .stateAndDispatch(
    /**
     * @implNote you can inject component props into mapStateToProps
     */
    (state, ownProps) => ({
      counter: selectors.counter(state),
    }),

    /**
     * @implNote you can inject component props into mapDispatchToProps
     * currently the <code>(dispatch, ownProps) => ({})</code> way is not available
     */
    {
      increment: actions.increment,
      decrement: actions.decrement,
      reset: actions.reset,
      testAsync: actions.testAsync,
    }
  )
  .withComp(({ counter, increment, decrement, reset, testAsync }) => (
    <div className="App">
      <header className="App-header">
        <h4>{counter}</h4>
        <br />
        <AppButton label="Increment" onClick={() => increment(1)} />
        <AppButton label="Decrement" onClick={() => decrement(1)} />
        <AppButton label="Reset" onClick={() => reset()} />
        <AppButton label="TestAsync" onClick={() => testAsync(10)} />
      </header>
    </div>
  ));
```

#### Traditional way

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
interface AppProps extends PropsFromRedux, OwnArgs {}

const AppRaw: React.FC<AppProps> = ({
  counter,
  increment,
  decrement,
  reset,
  testAsync,
}) => (
  <div className="App">
    <header className="App-header">
      <h4>{counter}</h4>
      <br />
      <AppButton label="Increment" onClick={() => increment(1)} />
      <AppButton label="Decrement" onClick={() => decrement(1)} />
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
