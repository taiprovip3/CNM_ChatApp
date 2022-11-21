import React from 'react';
import GenerateRandomString from '../service/GenerateRandomString';

export default function TestScreen() {

  const sendSMS = () => {

    const regPassword = GenerateRandomString();
    console.log('regPassword: ', regPassword);
    fetch("http://localhost:4000/SendPasswordToOTP", {
        mode: 'cors',
        method: "POST",
        body: JSON.stringify({ password: regPassword }),
    })
    // .then((res) => res.json())
    .then((data) => {
      console.log(data.status);
    });
  }

  return (
    <div>TestScreen


        <button onClick={() => sendSMS()}>Click me</button>
    </div>
  );
}
