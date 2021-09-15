import React from 'react';
import {
  connect,
  ConnectedProps,
  MapStateToPropsParam,
  MapDispatchToPropsParam,
} from 'react-redux';

export function Connect<State, TOwnProps = unknown>() {
  function stateAndDispatch<TStateProps, TDispatchProps>(
    mapStateToProps: MapStateToPropsParam<TStateProps, TOwnProps, State>,
    mapDispatchToProps: MapDispatchToPropsParam<TDispatchProps, TOwnProps>
  ) {
    const connector = connect(mapStateToProps, mapDispatchToProps);
    type Props = ConnectedProps<typeof connector> & TOwnProps;

    function withComp(comp: React.FC<Props>) {
      const result = connector(comp as any); // can't figure out this one in due time
      return result as React.FC<TOwnProps>;
    }
    return { withComp };
  }
  return { stateAndDispatch };
}
