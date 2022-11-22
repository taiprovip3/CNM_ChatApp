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

<div className="dropdown">
  <button type="button" className="btn btn-primary dropdown-toggle" data-bs-toggle="dropdown">
    Dropdown button
  </button>
  <ul className="dropdown-menu">
    <li><a className="dropdown-item" href=".">Link 1</a></li>
    <li><a className="dropdown-item" href=".">Link 2</a></li>
    <li><a className="dropdown-item" href=".">Link 3</a></li>
  </ul>
</div>
        <button onClick={() => sendSMS()}>Click me</button>
    </div>
  );
}
