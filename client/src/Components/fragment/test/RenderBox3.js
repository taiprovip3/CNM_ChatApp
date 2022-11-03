import React, { useContext } from 'react';
import { BoxReducerContext } from '../../provider/BoxReducerProvider';

export default function RenderBox3({ onInputChange }) {
  const { dispatch } = useContext(BoxReducerContext);
  console.log("renderBox2 called");
  return (
    <div id='renderBox3'>
        <input type="text" placeholder='Enter somethings...' onChange={onInputChange} />
        <p>This is renderBox3, updateds</p>
        <button onClick={() => dispatch("SHOW_ME_defaultBoxRender")}>Change to defaultBoxRender</button>
    </div>
  );
}
