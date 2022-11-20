import React from 'react';
import GenerateRandomString from '../service/GenerateRandomString';

export default function TestScreen() {

  const sendSMS = () => {
    // let headers = new Headers();

    // headers.append('Content-Type', 'application/json');
    // headers.append('Accept', 'application/json');
    // headers.append('Authorization', 'Basic ' + base64.encode(username + ":" +  password));
    // headers.append('Origin','http://localhost:3000');

    const regPassword = GenerateRandomString();
    fetch("http://localhost:4000/SendPasswordToOTP", {
        mode: 'no-cors',
        method: "POST",
        credentials: 'include',
        body: JSON.stringify(regPassword),
    });
    // .then((response) => response.json())
    // .then((result) => {
    //     if(result.message === "SUCCESS") {
    //         console.log('Fetching success to server!');
    //     } else {
    //         console.log('Something error when fetch to server!');
    //     }
    // });
  }

  return (
    <div>TestScreen


        <button onClick={() => sendSMS()}>Click me</button>
    </div>
  );
}
