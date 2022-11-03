import React, { useContext, useReducer, useState } from 'react';
import { BoxReducerContext } from '../provider/BoxReducerProvider';

export default function TestReducerScreen() {

  console.log('App rerendered!');
  const { myState } = useContext(BoxReducerContext);

  return (
    <div id='Container'>
        { myState }
    </div>
  );
}
