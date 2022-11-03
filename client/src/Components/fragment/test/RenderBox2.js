import React, { useContext } from 'react';
import { BoxReducerContext } from '../../provider/BoxReducerProvider';

export default function RenderBox2() {
  const { dispatch } = useContext(BoxReducerContext);
  console.log("renderBox2 called");
  return (
    <div id='renderBox2'>
        <p>This is renderBox2</p>
        <button onClick={() => dispatch("SHOW_ME_renderBox3")}>Change to renderBox3</button>
    </div>
  );
}
