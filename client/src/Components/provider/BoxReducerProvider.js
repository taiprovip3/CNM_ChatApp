import React, { Children, useContext, useEffect, useReducer, useState } from 'react';
import RenderBox2 from '../fragment/test/RenderBox2';
import RenderBox3 from '../fragment/test/RenderBox3';

export const BoxReducerContext = React.createContext();
export default function BoxReducerProvider({ children }) {

  const [input, setInput] = useState('');
  const onInputChange = (e) => {
    setInput(e.target.value)
  };

  useEffect(() => {
    console.log('input now = ', input);
  },[input]);

  const defaultBoxRender = () => {
    return <div>
      <p>input value = {input}</p>
      <p>Hi this is defaultBoxRender</p>
      <button onClick={() => dispatch("SHOW_ME_renderBox2")}>Change to renderBox2</button>
    </div>;
  }
  const renderBox2 = () => {
    console.log('called renderBox2');
    return <RenderBox2 />;
  }
  const renderBox3 = () => {
    return <RenderBox3 onInputChange={onInputChange} />;
  }
  const factoryReducer = (state, action) => {
    switch(action){
        case 'SHOW_ME_defaultBoxRender':
            return defaultBoxRender();
        case 'SHOW_ME_renderBox2':
            return renderBox2();
        case 'SHOW_ME_renderBox3':
            return renderBox3();
        default:
            return state;
    }
  }
  const [myState, dispatch] = useReducer(factoryReducer, defaultBoxRender());

  return (
    <BoxReducerContext.Provider value={{ myState, dispatch }}>
        {children}
    </BoxReducerContext.Provider>
  );
}
