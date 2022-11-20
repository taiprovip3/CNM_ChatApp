import React from 'react';
import GenerateRandomString from '../service/GenerateRandomString';

export default function TestScreen() {

  const sendSMS = () => {
    let headers = new Headers();

    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    headers.append('Origin','http://localhost:3000');
    headers.append('GET', 'POST', 'OPTIONS');
    const regPassword = GenerateRandomString();
    console.log('regPassword: ', regPassword);
    fetch("http://localhost:4000/SendPasswordToOTP", {
        // mode: 'cors',
        // credentials: 'include',
        method: "POST",
        body: JSON.stringify({ password: regPassword }),
        // headers: headers,
    });
  }

  return (
    <div>TestScreen


        <button onClick={() => sendSMS()}>Click me</button>
    </div>
  );
}
