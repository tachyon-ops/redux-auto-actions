import React from 'react';
import {
  connect,
  ConnectedProps,
  MapStateToPropsParam,
  MapDispatchToPropsParam,
} from 'react-redux';

export function Connect<State, TOwnProps>() {
  function stateAndDispatch<TStateProps, TDispatchProps>(
    mapStateToProps: MapStateToPropsParam<TStateProps, TOwnProps, State>,
    mapDispatchToProps: MapDispatchToPropsParam<TDispatchProps, TOwnProps>
  ) {
    const connector = connect(mapStateToProps, mapDispatchToProps);
    type PropsFromRedux = ConnectedProps<typeof connector>;

    function withComp(comp: React.FC<PropsFromRedux & TOwnProps>) {
      // @ts-ignore
      return connector(comp);
    }
    return { withComp };
  }
  return { stateAndDispatch };
}
